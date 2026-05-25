import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { convex } from '@/lib/convex'
import { api } from '../../../../convex/_generated/api'
import type { InsightsSummary, StreakInfo } from '@/lib/analytics'
import { InsightsClient } from './client'

// Revalidate every 60 seconds for faster loads
export const revalidate = 60

export default async function InsightsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get current month date range
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const start = startDate.toISOString().slice(0, 10)
  const end = endDate.toISOString().slice(0, 10)
  const heatmapStart = sixMonthsAgo.toISOString().slice(0, 10)

  // Fetch all data in parallel for maximum speed
  const [insights, streaks, habits, allEntries] = await Promise.all([
    convex.query(api.insights.summary, { userId, startDate: start, endDate: end }),
    convex.query(api.insights.streaks, { userId }),
    convex.query(api.habits.list, { userId, active: true }),
    convex.query(api.entries.list, { userId, start: heatmapStart, end }),
  ])
  const yearEntries = allEntries
    .filter((e) => e.completed)
    .map((e) => ({ entryDate: new Date(`${e.entryDate}T00:00:00.000Z`) }))

  // Process entries for heatmap
  const heatmapData = processEntriesForHeatmap(yearEntries)

  return (
    <InsightsClient
      insights={insights as unknown as InsightsSummary}
      streaks={streaks.streaksByHabit as unknown as StreakInfo[]}
      habits={habits}
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

// Process entries for heatmap visualization
function processEntriesForHeatmap(entries: { entryDate: Date }[]) {
  const dateMap = new Map<string, number>()
  
  entries.forEach((entry) => {
    const dateStr = entry.entryDate.toISOString().split('T')[0]
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
  })

  // Calculate intensity levels
  const counts = Array.from(dateMap.values())
  const maxCount = Math.max(...counts, 1)

  return Array.from(dateMap.entries()).map(([date, count]) => ({
    date,
    count,
    value: Math.min(4, Math.ceil((count / maxCount) * 4)),
  }))
}
