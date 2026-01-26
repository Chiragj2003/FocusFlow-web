import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

// Default challenges that are always available
const DEFAULT_CHALLENGES = [
  {
    id: 'streak-7',
    title: '7-Day Streak',
    description: 'Complete all your habits for 7 consecutive days',
    type: 'streak',
    target: 7,
    duration: 7,
    reward: 100,
    active: true,
  },
  {
    id: 'streak-14',
    title: '14-Day Champion',
    description: 'Maintain a 14-day habit streak',
    type: 'streak',
    target: 14,
    duration: 14,
    reward: 250,
    active: true,
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Complete a full month of consistent habits',
    type: 'streak',
    target: 30,
    duration: 30,
    reward: 500,
    active: true,
  },
  {
    id: 'completion-50',
    title: 'Half Century',
    description: 'Complete 50 habit entries',
    type: 'completion',
    target: 50,
    duration: 30,
    reward: 150,
    active: true,
  },
  {
    id: 'completion-100',
    title: 'Century Club',
    description: 'Complete 100 habit entries',
    type: 'completion',
    target: 100,
    duration: 60,
    reward: 300,
    active: true,
  },
  {
    id: 'focus-60',
    title: 'Hour of Power',
    description: 'Accumulate 60 minutes of focus time',
    type: 'focus',
    target: 60,
    duration: 7,
    reward: 100,
    active: true,
  },
  {
    id: 'focus-600',
    title: 'Focus Marathon',
    description: 'Accumulate 10 hours of focus time',
    type: 'focus',
    target: 600,
    duration: 30,
    reward: 400,
    active: true,
  },
]

// GET /api/challenges - Get all available challenges
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get custom challenges from database
    const dbChallenges = await prisma.challenge.findMany({
      where: { active: true },
    })

    // Combine with default challenges
    const challenges = [
      ...DEFAULT_CHALLENGES,
      ...dbChallenges.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        type: c.category || 'completion',
        target: c.duration,
        duration: c.duration,
        reward: c.difficulty === 'easy' ? 100 : c.difficulty === 'hard' ? 300 : 200,
        active: c.active,
      })),
    ]

    return NextResponse.json(challenges)
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
  }
}
