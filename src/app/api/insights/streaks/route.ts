import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, type DbHabit, type DbEntry } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [habitsRes, entriesRes] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', userId).eq('active', true),
      supabase.from('entries').select('*').eq('user_id', userId),
    ])
    const habits = (habitsRes.data || []) as DbHabit[]
    const entries = (entriesRes.data || []) as DbEntry[]

    const streaksByHabit = habits.map((habit) => {
      const dates = new Set(entries.filter((e) => e.habit_id === habit.id && e.completed).map((e) => e.entry_date))
      const sorted = Array.from(dates).sort()
      let longestStreak = 0, current = 0
      let prev: Date | null = null
      for (const d of sorted) {
        const date = new Date(`${d}T00:00:00.000Z`)
        if (!prev) { current = 1 } else {
          const diff = (date.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000)
          current = diff === 1 ? current + 1 : 1
        }
        longestStreak = Math.max(longestStreak, current)
        prev = date
      }
      let currentStreak = 0
      const cursor = new Date(); cursor.setUTCHours(0, 0, 0, 0)
      while (dates.has(cursor.toISOString().slice(0, 10))) {
        currentStreak += 1; cursor.setUTCDate(cursor.getUTCDate() - 1)
      }
      const lastCompletedDate = sorted.length > 0 ? sorted[sorted.length - 1] : null
      return { habitId: habit.id, title: habit.title, currentStreak, longestStreak, lastCompletedDate }
    })

    const currentStreak = Math.max(0, ...streaksByHabit.map((s) => s.currentStreak))
    const longestStreak = Math.max(0, ...streaksByHabit.map((s) => s.longestStreak))
    return NextResponse.json({ currentStreak, longestStreak, streaksByHabit })
  } catch (error) {
    console.error('Error fetching streaks:', error)
    return NextResponse.json({ error: 'Failed to fetch streaks' }, { status: 500 })
  }
}
