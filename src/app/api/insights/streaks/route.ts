import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../../convex/_generated/api'

// GET /api/insights/streaks - Get all streak information
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const streaks = await convex.query(api.insights.streaks, { userId })

    return NextResponse.json(streaks)
  } catch (error) {
    console.error('Error fetching streaks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch streaks' },
      { status: 500 }
    )
  }
}
