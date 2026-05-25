import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { convex } from '@/lib/convex'
import { api } from '../../../../convex/_generated/api'
import { BADGE_DEFINITIONS } from '@/lib/badges'

// GET /api/badges - Get user's badges
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const badges = await convex.query(api.badges.list, { userId })

    return NextResponse.json({
      badges,
      allBadges: BADGE_DEFINITIONS,
    })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    )
  }
}

// POST /api/badges/check - Check and award new badges
export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const streaks = await convex.query(api.insights.streaks, { userId })
    const newBadges = await convex.mutation(api.badges.checkAndAward, {
      userId,
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
    })

    // Get updated badge list
    const badges = await convex.query(api.badges.list, { userId })

    return NextResponse.json({
      newBadges,
      badges,
    })
  } catch (error) {
    console.error('Error checking badges:', error)
    return NextResponse.json(
      { error: 'Failed to check badges' },
      { status: 500 }
    )
  }
}
