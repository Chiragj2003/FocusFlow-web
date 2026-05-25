import { dbListHabits, dbListEntries, dbStreaks, dbInsightsSummary } from './db'

// ===== TYPE EXPORTS (kept for backward compatibility) =====
export interface InsightsSummary {
  userId: string
  period: { start: string; end: string }
  overallCompletionRate: number
  totalCompleted: number
  totalPossible: number
  weekly: WeeklyStats[]
  topHabits: TopHabit[]
  habitSummaries: HabitSummary[]
}

export interface WeeklyStats {
  weekStart: string
  completed: number
  possible: number
  completionRate: number
}

export interface TopHabit {
  habitId: string
  title: string
  color: string
  completionRate: number
  currentStreak: number
  longestStreak: number
}

export interface HabitSummary {
  habitId: string
  title: string
  countLogged: number
  sumValue: number
  avgPerActiveDay: number
}

export interface StreakInfo {
  habitId: string
  title: string
  currentStreak: number
  longestStreak: number
  lastCompletedDate: string | null
}

// ===== FUNCTIONS =====

export async function getCompletionRate(userId: string, startDate: Date, endDate: Date) {
  const start = startDate.toISOString().slice(0, 10)
  const end = endDate.toISOString().slice(0, 10)
  const [habits, entries] = await Promise.all([
    dbListHabits(userId, true),
    dbListEntries(userId, start, end),
  ])
  const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / 864e5) + 1
  const possible = habits.length * dayCount
  const completed = entries.filter((e) => e.completed).length
  return { completed, possible, rate: possible > 0 ? completed / possible : 0 }
}

export async function getInsightsSummary(userId: string, startDate: Date, endDate: Date): Promise<InsightsSummary> {
  const start = startDate.toISOString().slice(0, 10)
  const end = endDate.toISOString().slice(0, 10)
  return dbInsightsSummary(userId, start, end) as any
}

export async function getAllStreaks(userId: string): Promise<StreakInfo[]> {
  const data = await dbStreaks(userId)
  return data.streaksByHabit
}

export async function generateCSVExport(userId: string, startDate: Date, endDate: Date): Promise<string> {
  const start = startDate.toISOString().slice(0, 10)
  const end = endDate.toISOString().slice(0, 10)
  const [habits, entries] = await Promise.all([
    dbListHabits(userId),
    dbListEntries(userId, start, end),
  ])
  const habitMap = new Map(habits.map((h) => [h.id, h]))
  const headers = ['Date', 'Habit', 'Category', 'Completed', 'Value', 'Notes']
  const rows = entries.map((e) => {
    const habit = habitMap.get(e.habit_id)
    return [
      e.entry_date,
      habit?.title || '',
      habit?.category || '',
      e.completed ? 'Yes' : 'No',
      e.value?.toString() || '',
      e.notes || '',
    ]
  })
  return [headers, ...rows].map((row) => row.join(',')).join('\n')
}
