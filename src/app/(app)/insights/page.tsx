import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { dbInsightsSummary, dbStreaks, dbListHabits, dbListEntries } from '@/lib/db'
import { InsightsClient } from './client'

export const revalidate = 60

export default async function InsightsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)
  const heatmapStart = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().slice(0, 10)

  const [insights, streaks, habits, allEntries] = await Promise.all([
    dbInsightsSummary(userId, start, end),
    dbStreaks(userId),
    dbListHabits(userId, true),
    dbListEntries(userId, heatmapStart, end),
  ])

  const yearEntries = allEntries
    .filter((e) => e.completed)
    .map((e) => ({ entryDate: new Date(`${e.entry_date}T00:00:00.000Z`) }))

  const heatmapData = processEntriesForHeatmap(yearEntries)

  return (
    <InsightsClient
      insights={insights as any}
      streaks={streaks.streaksByHabit as any}
      habits={habits.map((h) => ({ _id: h.id, title: h.title, color: h.color, goal_type: h.goal_type })) as any}
      month={now.getMonth()}
      year={now.getFullYear()}
      heatmapData={heatmapData}
      yearEntries={yearEntries.map(e => ({
        entryDate: e.entryDate.toISOString().split('T')[0],
        completed: true,
      }))}
    />
  )
}

function processEntriesForHeatmap(entries: { entryDate: Date }[]) {
  const dateMap = new Map<string, number>()
  entries.forEach((entry) => {
    const dateStr = entry.entryDate.toISOString().split('T')[0]
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
  })
  const counts = Array.from(dateMap.values())
  const maxCount = Math.max(...counts, 1)
  return Array.from(dateMap.entries()).map(([date, count]) => ({
    date, count, value: Math.min(4, Math.ceil((count / maxCount) * 4)),
  }))
}
