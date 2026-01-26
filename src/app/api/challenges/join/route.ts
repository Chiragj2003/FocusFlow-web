import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

// POST /api/challenges/join - Join a challenge
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { challengeId } = body

    if (!challengeId) {
      return NextResponse.json({ error: 'Challenge ID is required' }, { status: 400 })
    }

    // Check if already joined
    const existing = await prisma.challengeParticipant.findFirst({
      where: { challengeId, userId },
    })

    if (existing) {
      return NextResponse.json({ error: 'Already joined this challenge' }, { status: 400 })
    }

    // For default challenges, we need to check if challenge exists in DB
    // If not, create a placeholder challenge entry
    let challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    })

    if (!challenge && challengeId.startsWith('streak-') || challengeId.startsWith('completion-') || challengeId.startsWith('focus-')) {
      // It's a default challenge, create a DB entry for tracking
      const DEFAULT_CHALLENGES: Record<string, { title: string; description: string; duration: number; category: string }> = {
        'streak-7': { title: '7-Day Streak', description: 'Complete all habits for 7 days', duration: 7, category: 'streak' },
        'streak-14': { title: '14-Day Champion', description: 'Maintain a 14-day streak', duration: 14, category: 'streak' },
        'streak-30': { title: 'Monthly Master', description: 'Complete a full month', duration: 30, category: 'streak' },
        'completion-50': { title: 'Half Century', description: 'Complete 50 entries', duration: 30, category: 'completion' },
        'completion-100': { title: 'Century Club', description: 'Complete 100 entries', duration: 60, category: 'completion' },
        'focus-60': { title: 'Hour of Power', description: '60 minutes of focus', duration: 7, category: 'focus' },
        'focus-600': { title: 'Focus Marathon', description: '10 hours of focus', duration: 30, category: 'focus' },
      }

      const defaultChallenge = DEFAULT_CHALLENGES[challengeId]
      if (defaultChallenge) {
        challenge = await prisma.challenge.create({
          data: {
            id: challengeId,
            title: defaultChallenge.title,
            description: defaultChallenge.description,
            duration: defaultChallenge.duration,
            category: defaultChallenge.category,
            habits: {},
            active: true,
          },
        })
      }
    }

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Join the challenge
    const participant = await prisma.challengeParticipant.create({
      data: {
        challengeId,
        userId,
        progress: 0,
      },
      include: { challenge: true },
    })

    return NextResponse.json({
      id: participant.id,
      challengeId: participant.challengeId,
      userId: participant.userId,
      progress: 0,
      completed: false,
      completedAt: null,
      joinedAt: participant.startedAt.toISOString(),
      challenge: {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        type: challenge.category || 'completion',
        target: challenge.duration,
        duration: challenge.duration,
        reward: challenge.difficulty === 'easy' ? 100 : challenge.difficulty === 'hard' ? 300 : 200,
        active: true,
        startDate: participant.startedAt.toISOString(),
        endDate: new Date(participant.startedAt.getTime() + challenge.duration * 24 * 60 * 60 * 1000).toISOString(),
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error joining challenge:', error)
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 })
  }
}
