import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'

// GET /api/entries - Get entries for a date range
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const habitId = searchParams.get('habitId')
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    const entries = await convex.query(api.entries.list, {
      userId,
      ...(habitId ? { habitId: habitId as Id<'habits'> } : {}),
      ...(start ? { start } : {}),
      ...(end ? { end } : {}),
    })

    // Add cache headers for better performance
    const response = NextResponse.json(entries)
    response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60')
    return response
  } catch (error) {
    console.error('Error fetching entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

// POST /api/entries - Create or update an entry (upsert)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { habitId, entryDate, completed, value, notes, mood, energy, duration } = body

    if (!habitId || !entryDate) {
      return NextResponse.json(
        { error: 'habitId and entryDate are required' },
        { status: 400 }
      )
    }

    const entry = await convex.mutation(api.entries.upsert, {
      userId,
      habitId: habitId as Id<'habits'>,
      entryDate,
      completed,
      value,
      notes,
      mood,
      energy,
      duration,
    })
    if (!entry) return NextResponse.json({ error: 'Habit not found' }, { status: 404 })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error upserting entry:', error)
    return NextResponse.json(
      { error: 'Failed to save entry' },
      { status: 500 }
    )
  }
}
