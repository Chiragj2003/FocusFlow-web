import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserBadges, checkAllBadges, BADGE_DEFINITIONS } from '@/lib/badges'
import { getAllStreaks } from '@/lib/analytics'

// GET /api/badges - Get user's badges
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const badges = await getUserBadges(userId)

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

    // Get streak data for streak badge checks
    const streaks = await getAllStreaks(userId)
    const bestCurrentStreak = streaks.reduce(
      (max, s) => (s.currentStreak > max ? s.currentStreak : max),
      0
    )
    const bestLongestStreak = streaks.reduce(
      (max, s) => (s.longestStreak > max ? s.longestStreak : max),
      0
    )

    // Check all badges
    const newBadges = await checkAllBadges(userId, {
      currentStreak: bestCurrentStreak,
      longestStreak: bestLongestStreak,
    })

    // Get updated badge list
    const badges = await getUserBadges(userId)

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
