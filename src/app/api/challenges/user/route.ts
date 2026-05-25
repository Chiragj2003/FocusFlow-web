import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../../convex/_generated/api'

// GET /api/challenges/user - Get user's joined challenges
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userChallenges = await convex.query(api.challenges.userChallenges, { userId })
    return NextResponse.json(userChallenges)
  } catch (error) {
    console.error('Error fetching user challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch user challenges' }, { status: 500 })
  }
}
