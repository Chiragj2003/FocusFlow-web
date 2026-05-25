import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../../convex/_generated/api'

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

    const joined = await convex.mutation(api.challenges.join, {
      challengeId,
      userId,
    })
    if (joined === null) {
      return NextResponse.json({ error: 'Already joined this challenge' }, { status: 400 })
    }
    if (joined === false) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }
    return NextResponse.json(joined, { status: 201 })
  } catch (error) {
    console.error('Error joining challenge:', error)
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 })
  }
}
