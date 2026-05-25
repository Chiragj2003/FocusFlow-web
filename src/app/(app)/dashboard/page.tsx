import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { dbInsightsSummary, dbStreaks, dbListHabits, dbListEntries, dbListBadges } from '@/lib/db'
import { BADGE_DEFINITIONS } from '@/lib/badges'
import { getDailyQuote, getDailyStreakMessage } from '@/lib/quotes'
import { DashboardClient } from './client'

export const revalidate = 60

export default async function DashboardPage() {
  const { userId: authUserId } = await auth()
  if (!authUserId) redirect('/sign-in')
  const userId = authUserId

  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)

  const [clerkUser, insights, streaks, habits, entries, badges] = await Promise.all([
    currentUser(),
    dbInsightsSummary(userId, start, end),
    dbStreaks(userId),
    dbListHabits(userId, true),
    dbListEntries(userId, start, end),
    dbListBadges(userId),
  ])
  const habitsCount = habits.length
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const dateMap = new Map<string, { completed: number; total: number }>()
  const daysInMonth = endDate.getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), i)
    dateMap.set(date.toISOString().split('T')[0], { completed: 0, total: habitsCount })
  }
  for (const entry of entries) {
    const stats = dateMap.get(entry.entry_date)
    if (stats && entry.completed) stats.completed++
  }

  const dailyData = Array.from(dateMap.entries())
    .filter(([dateStr]) => new Date(dateStr) <= now)
    .map(([date, stats]) => ({
      date,
      value: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    }))

  const bestStreak = streaks.longestStreak
  const currentBestStreak = streaks.currentStreak
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
      badges={badges.map((b) => {
        const def = BADGE_DEFINITIONS.find((d) => d.name === b.name)
        return { name: b.name, awardedAt: b.awarded_at, definition: def }
      })}
      allBadges={BADGE_DEFINITIONS}
      dailyQuote={dailyQuote}
      streakMessage={streakMessage}
    />
  )
}
