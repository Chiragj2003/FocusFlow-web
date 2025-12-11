'use client'

import { cn, formatDate, isToday } from '@/lib/utils'
import { useState, useCallback } from 'react'
import { Check, Plus } from 'lucide-react'

interface Habit {
  id: string
  title: string
  color: string
  goalType: string
  goalTarget?: number | null
  unit?: string | null
}

interface Entry {
  id: string
  habitId: string
  entryDate: string | Date
  completed: boolean
  value?: number | null
  notes?: string | null
}

interface HabitGridProps {
  habits: Habit[]
  entries: Entry[]
  month: number
  year: number
  onToggleEntry: (habitId: string, date: string, completed: boolean) => void
  onAddHabit: () => void
}

export function HabitGrid({
  habits,
  entries,
  month,
  year,
  onToggleEntry,
  onAddHabit,
}: HabitGridProps) {
  const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set())

  // Generate days for the month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(year, month, i + 1)
  })

  // Get entry for a specific habit and date
  const getEntry = useCallback(
    (habitId: string, date: Date) => {
      const dateStr = formatDate(date)
      return entries.find(
        (e) =>
          e.habitId === habitId &&
          formatDate(new Date(e.entryDate)) === dateStr
      )
    },
    [entries]
  )

  // Handle cell click
  const handleCellClick = async (habitId: string, date: Date) => {
    const dateStr = formatDate(date)
    const cellKey = `${habitId}-${dateStr}`

    // Don't allow future dates
    if (date > new Date()) return

    const entry = getEntry(habitId, date)
    const newCompleted = !entry?.completed

    setLoadingCells((prev) => new Set(prev).add(cellKey))

    try {
      await onToggleEntry(habitId, dateStr, newCompleted)
    } finally {
      setLoadingCells((prev) => {
        const next = new Set(prev)
        next.delete(cellKey)
        return next
      })
    }
  }

  // Calculate weekly completion for a habit
  const getWeeklyCompletion = (habitId: string, weekStart: number) => {
    let completed = 0
    for (let i = weekStart; i < Math.min(weekStart + 7, daysInMonth + 1); i++) {
      const date = new Date(year, month, i)
      const entry = getEntry(habitId, date)
      if (entry?.completed) completed++
    }
    return completed
  }

  // Get week boundaries
  const weeks: number[] = []
  for (let i = 1; i <= daysInMonth; i += 7) {
    weeks.push(i)
  }

  const monthName = new Date(year, month).toLocaleString('default', {
    month: 'long',
  })

  // Get short display for habit goal
  const getGoalDisplay = (habit: Habit) => {
    if (habit.goalType === 'binary') return '✓'
    if (habit.goalType === 'duration' && habit.goalTarget) {
      return `${habit.goalTarget}${habit.unit || 'min'}`
    }
    if (habit.goalType === 'quantity' && habit.goalTarget) {
      return `${habit.goalTarget}${habit.unit ? ` ${habit.unit}` : 'x'}`
    }
    return ''
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          {monthName} {year}
        </h2>
        <button
          onClick={onAddHabit}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Habit
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 bg-card px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide w-56">
                Habit
              </th>
              {days.map((day) => (
                <th
                  key={day.toISOString()}
                  className={cn(
                    'px-1 py-2 text-center text-xs font-medium w-8',
                    isToday(day)
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground'
                  )}
                >
                  <div>{day.getDate()}</div>
                  <div className="text-[10px] uppercase">
                    {day.toLocaleDateString('en', { weekday: 'narrow' })}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 ? (
              <tr>
                <td
                  colSpan={days.length + 2}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  <p className="mb-2">No habits yet!</p>
                  <button
                    onClick={onAddHabit}
                    className="text-primary hover:underline"
                  >
                    Create your first habit
                  </button>
                </td>
              </tr>
            ) : (
              habits.map((habit) => {
                const completedCount = entries.filter(
                  (e) => e.habitId === habit.id && e.completed
                ).length
                const goalDisplay = getGoalDisplay(habit)

                return (
                  <tr
                    key={habit.id}
                    className="border-b border-border/50 hover:bg-muted/50"
                  >
                    <td className="sticky left-0 bg-card px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: habit.color }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-card-foreground truncate max-w-[120px]">
                              {habit.title}
                            </span>
                            {goalDisplay && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                                {goalDisplay}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    {days.map((day) => {
                      const entry = getEntry(habit.id, day)
                      const dateStr = formatDate(day)
                      const cellKey = `${habit.id}-${dateStr}`
                      const isLoading = loadingCells.has(cellKey)
                      const isFuture = day > new Date()
                      const today = isToday(day)

                      return (
                        <td
                          key={day.toISOString()}
                          className={cn(
                            'px-1 py-2 text-center',
                            today && 'bg-primary/5'
                          )}
                        >
                          <button
                            onClick={() => handleCellClick(habit.id, day)}
                            disabled={isFuture || isLoading}
                            className={cn(
                              'w-6 h-6 rounded-md flex items-center justify-center transition-all mx-auto',
                              entry?.completed
                                ? 'text-white'
                                : 'border border-border hover:border-muted-foreground',
                              isFuture && 'opacity-30 cursor-not-allowed',
                              isLoading && 'animate-pulse'
                            )}
                            style={{
                              backgroundColor: entry?.completed
                                ? habit.color
                                : 'transparent',
                            }}
                          >
                            {entry?.completed && <Check size={14} />}
                          </button>
                        </td>
                      )
                    })}
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-card-foreground">
                        {completedCount}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /{daysInMonth}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Week summary footer */}
      {habits.length > 0 && (
        <div className="px-6 py-4 bg-muted border-t border-border">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Weekly completion:</span>
            {weeks.map((weekStart, i) => {
              const totalPossible = Math.min(7, daysInMonth - weekStart + 1) * habits.length
              const totalCompleted = habits.reduce(
                (sum, habit) => sum + getWeeklyCompletion(habit.id, weekStart),
                0
              )
              const percentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0

              return (
                <div key={weekStart} className="flex items-center gap-2">
                  <span className="text-muted-foreground">W{i + 1}:</span>
                  <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-card-foreground font-medium">{percentage}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
