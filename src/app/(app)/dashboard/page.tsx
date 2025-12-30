import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { getInsightsSummary, getAllStreaks } from '@/lib/analytics'
import { getUserBadges, checkAllBadges, BADGE_DEFINITIONS, awardEarlyBirdBadge } from '@/lib/badges'
import { getDailyQuote, getDailyStreakMessage } from '@/lib/quotes'
import { DashboardClient } from './client'

export default async function DashboardPage() {
  const { userId: authUserId } = await auth()

  if (!authUserId) {
    redirect('/sign-in')
  }

  // TypeScript now knows userId is string
  const userId = authUserId
  const clerkUser = await currentUser()

  // Ensure user exists in database (upsert to avoid conflicts)
  await prisma.user.upsert({
    where: { id: userId },
    update: {}, // No update needed, just ensure exists
    create: {
      id: userId,
      timezone: 'UTC',
    },
  })
  
  // Award early bird badge for new users
  await awardEarlyBirdBadge(userId)

  // Get current month date range
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Fetch insights and streaks
  const [insights, streaks, habitsCount] = await Promise.all([
    getInsightsSummary(userId, startDate, endDate),
    getAllStreaks(userId),
    prisma.habit.count({ where: { userId, active: true } }),
  ])

  // Calculate daily data for the line chart
  const entries = await prisma.habitEntry.findMany({
    where: {
      userId,
      entryDate: { gte: startDate, lte: endDate },
    },
    orderBy: { entryDate: 'asc' },
  })

  // Group by date for line chart
  const dateMap = new Map<string, { completed: number; total: number }>()
  const daysInMonth = endDate.getDate()
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), i)
    const dateStr = date.toISOString().split('T')[0]
    dateMap.set(dateStr, { completed: 0, total: habitsCount })
  }

  for (const entry of entries) {
    const dateStr = new Date(entry.entryDate).toISOString().split('T')[0]
    const stats = dateMap.get(dateStr)
    if (stats && entry.completed) {
      stats.completed++
    }
  }

  const dailyData = Array.from(dateMap.entries())
    .filter(([dateStr]) => new Date(dateStr) <= now)
    .map(([date, stats]) => ({
      date,
      value: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    }))

  // Best streak across all habits
  const bestStreak = streaks.reduce(
    (max, s) => (s.longestStreak > max ? s.longestStreak : max),
    0
  )
  const currentBestStreak = streaks.reduce(
    (max, s) => (s.currentStreak > max ? s.currentStreak : max),
    0
  )

  // Check and award badges
  await checkAllBadges(userId, {
    currentStreak: currentBestStreak,
    longestStreak: bestStreak,
  })

  // Fetch user badges
  const badges = await getUserBadges(userId)

  // Get daily quote and streak message
  const dailyQuote = getDailyQuote()
  const streakMessage = getDailyStreakMessage(currentBestStreak)

  return (
    <DashboardClient
      insights={insights}
      dailyData={dailyData}
      bestStreak={bestStreak}
      currentBestStreak={currentBestStreak}
      habitsCount={habitsCount}
      userName={clerkUser?.firstName || undefined}
      badges={badges}
      allBadges={BADGE_DEFINITIONS}
      dailyQuote={dailyQuote}
      streakMessage={streakMessage}
    />
  )
}
