import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

// GET /api/challenges/user - Get user's joined challenges
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's challenge participations
    const participants = await prisma.challengeParticipant.findMany({
      where: { userId },
      include: { challenge: true },
      orderBy: { startedAt: 'desc' },
    })

    // Default challenges info
    const DEFAULT_CHALLENGES: Record<string, {
      title: string
      description: string
      type: string
      target: number
      duration: number
      reward: number
    }> = {
      'streak-7': {
        title: '7-Day Streak',
        description: 'Complete all your habits for 7 consecutive days',
        type: 'streak',
        target: 7,
        duration: 7,
        reward: 100,
      },
      'streak-14': {
        title: '14-Day Champion',
        description: 'Maintain a 14-day habit streak',
        type: 'streak',
        target: 14,
        duration: 14,
        reward: 250,
      },
      'streak-30': {
        title: 'Monthly Master',
        description: 'Complete a full month of consistent habits',
        type: 'streak',
        target: 30,
        duration: 30,
        reward: 500,
      },
      'completion-50': {
        title: 'Half Century',
        description: 'Complete 50 habit entries',
        type: 'completion',
        target: 50,
        duration: 30,
        reward: 150,
      },
      'completion-100': {
        title: 'Century Club',
        description: 'Complete 100 habit entries',
        type: 'completion',
        target: 100,
        duration: 60,
        reward: 300,
      },
      'focus-60': {
        title: 'Hour of Power',
        description: 'Accumulate 60 minutes of focus time',
        type: 'focus',
        target: 60,
        duration: 7,
        reward: 100,
      },
      'focus-600': {
        title: 'Focus Marathon',
        description: 'Accumulate 10 hours of focus time',
        type: 'focus',
        target: 600,
        duration: 30,
        reward: 400,
      },
    }

    // Calculate progress for each challenge
    const userChallenges = await Promise.all(
      participants.map(async (p) => {
        const challengeInfo = DEFAULT_CHALLENGES[p.challengeId] || {
          title: p.challenge?.title || 'Unknown Challenge',
          description: p.challenge?.description || '',
          type: p.challenge?.category || 'completion',
          target: p.challenge?.duration || 30,
          duration: p.challenge?.duration || 30,
          reward: 200,
        }

        // Calculate progress based on challenge type
        let progress = p.progress
        const startDate = p.startedAt

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
          let date = new Date(today)
          
          while (true) {
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
            
            if (streak >= challengeInfo.target) break
          }
          progress = streak
        }

        const completed = progress >= challengeInfo.target

        return {
          id: p.id,
          challengeId: p.challengeId,
          userId: p.userId,
          progress,
          completed,
          completedAt: completed ? p.completedAt : null,
          joinedAt: p.startedAt.toISOString(),
          challenge: {
            id: p.challengeId,
            title: challengeInfo.title,
            description: challengeInfo.description,
            type: challengeInfo.type,
            target: challengeInfo.target,
            duration: challengeInfo.duration,
            reward: challengeInfo.reward,
            active: true,
            startDate: p.startedAt.toISOString(),
            endDate: new Date(p.startedAt.getTime() + challengeInfo.duration * 24 * 60 * 60 * 1000).toISOString(),
          },
        }
      })
    )

    return NextResponse.json(userChallenges)
  } catch (error) {
    console.error('Error fetching user challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch user challenges' }, { status: 500 })
  }
}
