import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { getInsightsSummary, getAllStreaks } from '@/lib/analytics'
import { InsightsClient } from './client'

export default async function InsightsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get current month date range
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Fetch insights and streaks
  const [insights, streaks, habits] = await Promise.all([
    getInsightsSummary(userId, startDate, endDate),
    getAllStreaks(userId),
    prisma.habit.findMany({
      where: { userId, active: true },
      select: { id: true, title: true, color: true },
    }),
  ])

  return (
    <InsightsClient
      insights={insights}
      streaks={streaks}
      habits={habits}
      month={now.getMonth()}
      year={now.getFullYear()}
    />
  )
}
