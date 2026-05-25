import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../../../convex/_generated/api'

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

    const result = await convex.mutation(api.challenges.progress, {
      challengeId,
      userId,
    })
    if (!result) {
      return NextResponse.json({ error: 'Not participating in this challenge' }, { status: 404 })
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching challenge progress:', error)
    return NextResponse.json({ error: 'Failed to fetch challenge progress' }, { status: 500 })
  }
}
