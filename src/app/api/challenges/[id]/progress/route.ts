import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

// GET /api/challenges/[id]/progress - Get progress for a specific challenge
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: challengeId } = await params

    // Get user's participation
    const participant = await prisma.challengeParticipant.findFirst({
      where: { challengeId, userId },
      include: { challenge: true },
    })

    if (!participant) {
      return NextResponse.json({ error: 'Not participating in this challenge' }, { status: 404 })
    }

    // Default challenge targets
    const CHALLENGE_TARGETS: Record<string, { type: string; target: number }> = {
      'streak-7': { type: 'streak', target: 7 },
      'streak-14': { type: 'streak', target: 14 },
      'streak-30': { type: 'streak', target: 30 },
      'completion-50': { type: 'completion', target: 50 },
      'completion-100': { type: 'completion', target: 100 },
      'focus-60': { type: 'focus', target: 60 },
      'focus-600': { type: 'focus', target: 600 },
    }

    const challengeInfo = CHALLENGE_TARGETS[challengeId] || {
      type: participant.challenge?.category || 'completion',
      target: participant.challenge?.duration || 30,
    }

    // Calculate progress based on challenge type
    let progress = 0
    const startDate = participant.startedAt

    if (challengeInfo.type === 'completion') {
      const entries = await prisma.habitEntry.count({
        where: {
          userId,
          completed: true,
          createdAt: { gte: startDate },
        },
      })
      progress = entries
    } else if (challengeInfo.type === 'focus') {
      const sessions = await prisma.focusSession.findMany({
        where: {
          userId,
          completedAt: { gte: startDate },
        },
      })
      progress = Math.floor(sessions.reduce((sum, s) => sum + s.duration, 0) / 60)
    } else if (challengeInfo.type === 'streak') {
      // Get current streak
      const today = new Date()
      let streak = 0
      const date = new Date(today)
      
      while (streak < challengeInfo.target) {
        const dateStr = date.toISOString().split('T')[0]
        const entries = await prisma.habitEntry.count({
          where: {
            userId,
            completed: true,
            entryDate: new Date(dateStr),
          },
        })
        
        if (entries > 0) {
          streak++
          date.setDate(date.getDate() - 1)
        } else {
          break
        }
      }
      progress = streak
    }

    const completed = progress >= challengeInfo.target

    // Update progress in database
    if (progress !== participant.progress || (completed && !participant.completedAt)) {
      await prisma.challengeParticipant.update({
        where: { id: participant.id },
        data: {
          progress,
          completedAt: completed && !participant.completedAt ? new Date() : participant.completedAt,
        },
      })
    }

    return NextResponse.json({
      progress,
      completed,
    })
  } catch (error) {
    console.error('Error fetching challenge progress:', error)
    return NextResponse.json({ error: 'Failed to fetch challenge progress' }, { status: 500 })
  }
}
