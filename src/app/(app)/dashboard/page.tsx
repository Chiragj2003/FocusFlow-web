import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { convex } from '@/lib/convex'
import { api } from '../../../../convex/_generated/api'
import { BADGE_DEFINITIONS } from '@/lib/badges'
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

  const start = startDate.toISOString().slice(0, 10)
  const end = endDate.toISOString().slice(0, 10)
  const [clerkUser, insights, streaks, habits, entries, badges] = await Promise.all([
    currentUser(),
    convex.query(api.insights.summary, { userId, startDate: start, endDate: end }),
    convex.query(api.insights.streaks, { userId }),
    convex.query(api.habits.list, { userId, active: true }),
    convex.query(api.entries.list, { userId, start, end }),
    convex.query(api.badges.list, { userId }),
  ])
  const habitsCount = habits.length

  // Group by date for line chart
  const dateMap = new Map<string, { completed: number; total: number }>()
  const daysInMonth = endDate.getDate()
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), i)
    const dateStr = date.toISOString().split('T')[0]
    dateMap.set(dateStr, { completed: 0, total: habitsCount })
  }

  for (const entry of entries) {
    const dateStr = entry.entryDate
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
  const bestStreak = streaks.longestStreak
  const currentBestStreak = streaks.currentStreak

  // Get daily quote and streak message (sync - very fast)
  const dailyQuote = getDailyQuote()
  const streakMessage = getDailyStreakMessage(currentBestStreak)

  return (
    <DashboardClient
      insights={insights as any}
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
