import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/db'
import { getInsightsSummary, getAllStreaks } from '@/lib/analytics'

// GET /api/exports/insights - Get insights data for PDF export
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const monthParam = searchParams.get('month')
    const yearParam = searchParams.get('year')

    const now = new Date()
    const month = monthParam ? parseInt(monthParam) : now.getMonth()
    const year = yearParam ? parseInt(yearParam) : now.getFullYear()

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    // Fetch insights and streaks
    const [insights, streaks, habits] = await Promise.all([
      getInsightsSummary(userId, startDate, endDate),
      getAllStreaks(userId),
      prisma.habit.findMany({
        where: { userId, active: true },
        select: { id: true, title: true, color: true, goalType: true, unit: true },
      }),
    ])

    const monthName = new Date(year, month).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    })

    return NextResponse.json({
      monthName,
      month,
      year,
      insights,
      streaks,
      habits,
    })
  } catch (error) {
    console.error('Error fetching insights for export:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}
