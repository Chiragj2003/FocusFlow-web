import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { getInsightsSummary, getAllStreaks, type StreakInfo } from '@/lib/analytics'
import { getUserBadges, checkAllBadges, BADGE_DEFINITIONS, awardEarlyBirdBadge } from '@/lib/badges'
import { getDailyQuote, getDailyStreakMessage } from '@/lib/quotes'
import { DashboardClient } from './client'

// Optimize with ISR - revalidate every 60 seconds
export const revalidate = 60

export default async function DashboardPage() {
  const { userId: authUserId } = await auth()

  if (!authUserId) {
    redirect('/sign-in')
  }

  const userId = authUserId

  // Get current month date range
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Run ALL queries in parallel for maximum speed
  const [clerkUser, _, insights, streaks, habitsCount, entries, badges] = await Promise.all([
    currentUser(),
    // Ensure user exists (fire and forget style)
    prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, timezone: 'UTC' },
    }).then(() => awardEarlyBirdBadge(userId)),
    getInsightsSummary(userId, startDate, endDate),
    getAllStreaks(userId),
    prisma.habit.count({ where: { userId, active: true } }),
    prisma.habitEntry.findMany({
      where: {
        userId,
        entryDate: { gte: startDate, lte: endDate },
      },
      select: { entryDate: true, completed: true }, // Only select needed fields
      orderBy: { entryDate: 'asc' },
    }),
    getUserBadges(userId),
  ])

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
    (max: number, s: StreakInfo) => (s.longestStreak > max ? s.longestStreak : max),
    0
  )
  const currentBestStreak = streaks.reduce(
    (max: number, s: StreakInfo) => (s.currentStreak > max ? s.currentStreak : max),
    0
  )

  // Check and award badges in background (don't await)
  checkAllBadges(userId, {
    currentStreak: currentBestStreak,
    longestStreak: bestStreak,
  }).catch(console.error)

  // Get daily quote and streak message (sync - very fast)
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
