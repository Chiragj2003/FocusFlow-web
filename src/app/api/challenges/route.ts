import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../convex/_generated/api'

// GET /api/challenges - Get all available challenges
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const challenges = await convex.query(api.challenges.list, {})

    return NextResponse.json(challenges)
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
  }
}
