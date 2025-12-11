import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getInsightsSummary } from '@/lib/analytics'

// GET /api/insights/summary - Get analytics summary
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    // Default to current month if no dates provided
    const now = new Date()
    const startDate = start
      ? new Date(start)
      : new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = end
      ? new Date(end)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const summary = await getInsightsSummary(userId, startDate, endDate)

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}
