import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { dbInsightsSummary, dbStreaks, dbListHabits } from '@/lib/db'
import { toHabitResponse } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const now = new Date()
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : now.getMonth()
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : now.getFullYear()
    const startDate = new Date(year, month, 1).toISOString().slice(0, 10)
    const endDate = new Date(year, month + 1, 0).toISOString().slice(0, 10)

    const [insights, streaks, habits] = await Promise.all([
      dbInsightsSummary(userId, startDate, endDate),
      dbStreaks(userId),
      dbListHabits(userId, true),
    ])

    return NextResponse.json({
      monthName: new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' }),
      month, year, insights, streaks, habits: habits.map(toHabitResponse),
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 })
  }
}
