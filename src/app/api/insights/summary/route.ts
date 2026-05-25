import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, type DbHabit, type DbEntry } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function dateRange(start: string, end: string): string[] {
  const result: string[] = []
  const current = new Date(`${start}T00:00:00.000Z`)
  const endDate = new Date(`${end}T00:00:00.000Z`)
  while (current <= endDate) {
    result.push(current.toISOString().slice(0, 10))
    current.setUTCDate(current.getUTCDate() + 1)
  }
  return result
}

// GET /api/insights/summary
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    const now = new Date()
    const startDate = start || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    const endDate = end || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)

    const [habitsRes, entriesRes] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', userId).eq('active', true),
      supabase.from('entries').select('*').eq('user_id', userId).gte('entry_date', startDate).lte('entry_date', endDate),
    ])

    const habits = (habitsRes.data || []) as DbHabit[]
    const entries = (entriesRes.data || []) as DbEntry[]
    const days = dateRange(startDate, endDate)
    const completedEntries = entries.filter((e) => e.completed)

    const totalCompleted = completedEntries.length
    const totalPossible = days.length * habits.length
    const overallCompletionRate = totalPossible > 0 ? totalCompleted / totalPossible : 0

    const topHabits = habits
      .map((habit) => {
        const habitEntries = entries.filter((e) => e.habit_id === habit.id)
        const completedCount = habitEntries.filter((e) => e.completed).length
        const completionRate = days.length > 0 ? completedCount / days.length : 0
        return { habitId: habit.id, title: habit.title, color: habit.color, completionRate, completedCount, totalDays: days.length }
      })
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5)

    const weekly = days.slice(-7).map((date) => {
      const completed = completedEntries.filter((e) => e.entry_date === date).length
      const total = habits.length
      return {
        weekStart: date,
        day: new Date(`${date}T00:00:00.000Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
        date,
        completed,
        total,
        possible: total,
        rate: total > 0 ? completed / total : 0,
        completionRate: total > 0 ? completed / total : 0,
      }
    })

    const habitSummaries = habits.map((habit) => {
      const habitEntries = entries.filter((e) => e.habit_id === habit.id)
      const completedHabitEntries = habitEntries.filter((e) => e.completed)
      const countLogged = completedHabitEntries.length
      const sumValue = completedHabitEntries.reduce((sum, e) => sum + (e.value ?? 0), 0)
      const avgPerActiveDay = countLogged > 0 ? sumValue / countLogged : 0
      return { habitId: habit.id, title: habit.title, countLogged, sumValue, avgPerActiveDay }
    })

    return NextResponse.json({
      userId,
      period: { start: startDate, end: endDate },
      overallCompletionRate,
      totalCompleted,
      totalPossible,
      topHabits,
      weekly,
      habitSummaries,
    })
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 })
  }
}
