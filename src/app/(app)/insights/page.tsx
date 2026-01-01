import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { getInsightsSummary, getAllStreaks } from '@/lib/analytics'
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
  
  // Get 6 months ago for heatmap (faster than full year)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  // Fetch all data in parallel for maximum speed
  const [insights, streaks, habits, yearEntries] = await Promise.all([
    getInsightsSummary(userId, startDate, endDate),
    getAllStreaks(userId),
    prisma.habit.findMany({
      where: { userId, active: true },
      select: { id: true, title: true, color: true },
    }),
    prisma.habitEntry.findMany({
      where: {
        userId,
        entryDate: { gte: sixMonthsAgo, lte: endDate },
        completed: true,
      },
      select: { entryDate: true },
    }),
  ])

  // Process entries for heatmap
  const heatmapData = processEntriesForHeatmap(yearEntries)

  return (
    <InsightsClient
      insights={insights}
      streaks={streaks}
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
