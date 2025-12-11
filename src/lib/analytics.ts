import prisma from './db'
import { startOfWeek, addDays, formatDate } from './utils'

export interface InsightsSummary {
  userId: string
  period: {
    start: string
    end: string
  }
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

// Calculate completion rate for a user in a date range
export async function getCompletionRate(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<{ completed: number; possible: number; rate: number }> {
  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
  })

  if (habits.length === 0) {
    return { completed: 0, possible: 0, rate: 0 }
  }

  const entries = await prisma.habitEntry.findMany({
    where: {
      userId,
      entryDate: {
        gte: startDate,
        lte: endDate,
      },
      completed: true,
    },
  })

  // Calculate days in range
  const dayCount = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1

  const possible = habits.length * dayCount
  const completed = entries.length
  const rate = possible > 0 ? completed / possible : 0

  return { completed, possible, rate }
}

// Calculate weekly aggregation
export async function getWeeklyStats(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<WeeklyStats[]> {
  const habits = await prisma.habit.count({
    where: { userId, active: true },
  })

  if (habits === 0) {
    return []
  }

  const entries = await prisma.habitEntry.findMany({
    where: {
      userId,
      entryDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { entryDate: 'asc' },
  })

  // Group by week
  const weeklyMap = new Map<string, { completed: number; total: number }>()

  let currentWeekStart = startOfWeek(startDate)
  while (currentWeekStart <= endDate) {
    const weekKey = formatDate(currentWeekStart)
    weeklyMap.set(weekKey, { completed: 0, total: 0 })
    currentWeekStart = addDays(currentWeekStart, 7)
  }

  for (const entry of entries) {
    const weekStart = startOfWeek(new Date(entry.entryDate))
    const weekKey = formatDate(weekStart)
    
    const stats = weeklyMap.get(weekKey)
    if (stats) {
      stats.total++
      if (entry.completed) {
        stats.completed++
      }
    }
  }

  return Array.from(weeklyMap.entries()).map(([weekStart, stats]) => ({
    weekStart,
    completed: stats.completed,
    possible: habits * 7, // 7 days per week
    completionRate: stats.total > 0 ? stats.completed / (habits * 7) : 0,
  }))
}

// Calculate streak for a habit
export async function getHabitStreak(
  habitId: string,
  userId: string,
  today: Date = new Date()
): Promise<{ currentStreak: number; longestStreak: number }> {
  const entries = await prisma.habitEntry.findMany({
    where: {
      habitId,
      userId,
      completed: true,
    },
    orderBy: { entryDate: 'asc' },
    select: { entryDate: true },
  })

  if (entries.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  // Convert to date strings for easier comparison
  const completedDates = entries.map((e) =>
    formatDate(new Date(e.entryDate))
  )

  // Calculate longest streak using group logic
  let longestStreak = 1
  let currentRunLength = 1

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = new Date(completedDates[i - 1])
    const currDate = new Date(completedDates[i])
    
    const diffDays = Math.round(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 1) {
      currentRunLength++
      longestStreak = Math.max(longestStreak, currentRunLength)
    } else {
      currentRunLength = 1
    }
  }

  // Calculate current streak (must include today or yesterday)
  const todayStr = formatDate(today)
  const yesterdayStr = formatDate(addDays(today, -1))
  
  let currentStreak = 0
  const lastCompletedDate = completedDates[completedDates.length - 1]

  if (lastCompletedDate === todayStr || lastCompletedDate === yesterdayStr) {
    currentStreak = 1
    let checkDate = new Date(lastCompletedDate)
    
    for (let i = completedDates.length - 2; i >= 0; i--) {
      checkDate = addDays(checkDate, -1)
      const checkDateStr = formatDate(checkDate)
      
      if (completedDates[i] === checkDateStr) {
        currentStreak++
      } else {
        break
      }
    }
  }

  return { currentStreak, longestStreak }
}

// Get top habits by completion rate
export async function getTopHabits(
  userId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<TopHabit[]> {
  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
    include: {
      entries: {
        where: {
          entryDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    },
  })

  const dayCount = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1

  const habitsWithStats = await Promise.all(
    habits.map(async (habit) => {
      const completedCount = habit.entries.filter((e) => e.completed).length
      const completionRate = completedCount / dayCount
      const streakInfo = await getHabitStreak(habit.id, userId)

      return {
        habitId: habit.id,
        title: habit.title,
        color: habit.color,
        completionRate,
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
      }
    })
  )

  return habitsWithStats
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, limit)
}

// Get full insights summary
export async function getInsightsSummary(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<InsightsSummary> {
  const [completionStats, weeklyStats, topHabits] = await Promise.all([
    getCompletionRate(userId, startDate, endDate),
    getWeeklyStats(userId, startDate, endDate),
    getTopHabits(userId, startDate, endDate),
  ])

  // Get habit summaries
  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
    include: {
      entries: {
        where: {
          entryDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    },
  })

  const habitSummaries: HabitSummary[] = habits.map((habit) => {
    const entries = habit.entries.filter((e) => e.completed)
    const sumValue = entries.reduce((sum, e) => sum + (e.value || 0), 0)
    
    return {
      habitId: habit.id,
      title: habit.title,
      countLogged: entries.length,
      sumValue,
      avgPerActiveDay: entries.length > 0 ? sumValue / entries.length : 0,
    }
  })

  return {
    userId,
    period: {
      start: formatDate(startDate),
      end: formatDate(endDate),
    },
    overallCompletionRate: completionStats.rate,
    totalCompleted: completionStats.completed,
    totalPossible: completionStats.possible,
    weekly: weeklyStats,
    topHabits,
    habitSummaries,
  }
}

// Get all streaks for a user
export async function getAllStreaks(userId: string): Promise<StreakInfo[]> {
  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
  })

  const streaks = await Promise.all(
    habits.map(async (habit) => {
      const streakInfo = await getHabitStreak(habit.id, userId)
      const lastEntry = await prisma.habitEntry.findFirst({
        where: { habitId: habit.id, userId, completed: true },
        orderBy: { entryDate: 'desc' },
      })

      return {
        habitId: habit.id,
        title: habit.title,
        ...streakInfo,
        lastCompletedDate: lastEntry
          ? formatDate(new Date(lastEntry.entryDate))
          : null,
      }
    })
  )

  return streaks
}

// Generate CSV export data
export async function generateCSVExport(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<string> {
  const entries = await prisma.habitEntry.findMany({
    where: {
      userId,
      entryDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      habit: {
        select: { title: true, category: true },
      },
    },
    orderBy: { entryDate: 'asc' },
  })

  const headers = ['Date', 'Habit', 'Category', 'Completed', 'Value', 'Notes']
  const rows = entries.map((entry) => [
    formatDate(new Date(entry.entryDate)),
    entry.habit.title,
    entry.habit.category || '',
    entry.completed ? 'Yes' : 'No',
    entry.value?.toString() || '',
    entry.notes || '',
  ])

  return [headers, ...rows].map((row) => row.join(',')).join('\n')
}
