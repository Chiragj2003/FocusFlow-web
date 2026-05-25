// Database query helpers for server components (replaces Convex queries)
import { supabase, type DbHabit, type DbEntry, type DbBadge, type DbFocusSession, type DbUser } from './supabase'

// ---- HABITS ----
export async function dbListHabits(userId: string, active?: boolean) {
  let q = supabase.from('habits').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (active !== undefined) q = q.eq('active', active)
  const { data } = await q
  return (data || []) as DbHabit[]
}

// ---- ENTRIES ----
export async function dbListEntries(userId: string, start?: string, end?: string) {
  let q = supabase.from('entries').select('*').eq('user_id', userId)
  if (start) q = q.gte('entry_date', start)
  if (end) q = q.lte('entry_date', end)
  q = q.order('entry_date', { ascending: false })
  const { data } = await q
  return (data || []) as DbEntry[]
}

// ---- BADGES ----
export async function dbListBadges(userId: string) {
  const { data } = await supabase.from('badges').select('*').eq('user_id', userId)
  return (data || []) as DbBadge[]
}

// ---- FOCUS ----
export async function dbListFocusSessions(userId: string) {
  const { data } = await supabase.from('focus_sessions').select('*').eq('user_id', userId)
  return (data || []) as DbFocusSession[]
}

// ---- USERS ----
export async function dbUpsertUser(clerkUserId: string, email?: string, name?: string, timezone?: string) {
  const { data: existing } = await supabase.from('users').select('*').eq('clerk_user_id', clerkUserId).single()
  if (existing) {
    const { data } = await supabase.from('users').update({
      email: email ?? existing.email,
      name: name ?? existing.name,
      timezone: timezone ?? existing.timezone ?? 'UTC',
      updated_at: new Date().toISOString(),
    }).eq('clerk_user_id', clerkUserId).select().single()
    return data as DbUser
  }
  const { data } = await supabase.from('users').insert({
    clerk_user_id: clerkUserId,
    email: email || null, name: name || null, timezone: timezone || 'UTC',
  }).select().single()
  return data as DbUser
}

// ---- INSIGHTS ----
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

export async function dbInsightsSummary(userId: string, startDate: string, endDate: string) {
  const [habits, entries] = await Promise.all([
    dbListHabits(userId, true),
    dbListEntries(userId, startDate, endDate),
  ])
  const days = dateRange(startDate, endDate)
  const completedEntries = entries.filter((e) => e.completed)
  const totalCompleted = completedEntries.length
  const totalPossible = days.length * habits.length
  const overallCompletionRate = totalPossible > 0 ? totalCompleted / totalPossible : 0

  const topHabits = habits.map((h) => {
    const he = entries.filter((e) => e.habit_id === h.id)
    const cc = he.filter((e) => e.completed).length
    return { habitId: h.id, title: h.title, color: h.color, completionRate: days.length > 0 ? cc / days.length : 0, completedCount: cc, totalDays: days.length }
  }).sort((a, b) => b.completionRate - a.completionRate).slice(0, 5)

  const weekly = days.slice(-7).map((date) => {
    const completed = completedEntries.filter((e) => e.entry_date === date).length
    const total = habits.length
    return { weekStart: date, day: new Date(`${date}T00:00:00.000Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }), date, completed, total, possible: total, rate: total > 0 ? completed / total : 0, completionRate: total > 0 ? completed / total : 0 }
  })

  const habitSummaries = habits.map((h) => {
    const he = entries.filter((e) => e.habit_id === h.id && e.completed)
    return { habitId: h.id, title: h.title, countLogged: he.length, sumValue: he.reduce((s, e) => s + (e.value ?? 0), 0), avgPerActiveDay: he.length > 0 ? he.reduce((s, e) => s + (e.value ?? 0), 0) / he.length : 0 }
  })

  return { userId, period: { start: startDate, end: endDate }, overallCompletionRate, totalCompleted, totalPossible, topHabits, weekly, habitSummaries }
}

export async function dbStreaks(userId: string) {
  const [habits, entries] = await Promise.all([
    dbListHabits(userId, true),
    dbListEntries(userId),
  ])
  const streaksByHabit = habits.map((habit) => {
    const dates = new Set(entries.filter((e) => e.habit_id === habit.id && e.completed).map((e) => e.entry_date))
    const sorted = Array.from(dates).sort()
    let longestStreak = 0, current = 0
    let prev: Date | null = null
    for (const d of sorted) {
      const date = new Date(`${d}T00:00:00.000Z`)
      if (!prev) { current = 1 } else { current = (date.getTime() - prev.getTime()) / 864e5 === 1 ? current + 1 : 1 }
      longestStreak = Math.max(longestStreak, current); prev = date
    }
    let currentStreak = 0
    const cursor = new Date(); cursor.setUTCHours(0, 0, 0, 0)
    while (dates.has(cursor.toISOString().slice(0, 10))) { currentStreak++; cursor.setUTCDate(cursor.getUTCDate() - 1) }
    return { habitId: habit.id, title: habit.title, currentStreak, longestStreak, lastCompletedDate: sorted[sorted.length - 1] || null }
  })
  return { currentStreak: Math.max(0, ...streaksByHabit.map((s) => s.currentStreak)), longestStreak: Math.max(0, ...streaksByHabit.map((s) => s.longestStreak)), streaksByHabit }
}
