import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../convex/_generated/api'

// GET /api/focus - Get all focus sessions for the user
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessions = await convex.query(api.focus.list, {
      userId,
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching focus sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch focus sessions' }, { status: 500 })
  }
}

// POST /api/focus - Create a new focus session
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { habitId, duration, notes } = body

    if (!duration || duration < 1) {
      return NextResponse.json({ error: 'Duration is required and must be positive' }, { status: 400 })
    }

    const session = await convex.mutation(api.focus.create, {
      userId,
      habitId: habitId || undefined,
      duration,
      notes: notes || undefined,
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating focus session:', error)
    return NextResponse.json({ error: 'Failed to create focus session' }, { status: 500 })
  }
}
