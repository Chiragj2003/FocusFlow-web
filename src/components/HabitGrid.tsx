'use client'

import { cn, formatDate, isToday } from '@/lib/utils'
import { useState, useCallback } from 'react'
import { Check, Plus, Archive, MoreVertical, Trash2, AlertTriangle, X } from 'lucide-react'

interface Habit {
  id: string
  title: string
  color: string
  goalType: string
  goalTarget?: number | null
  unit?: string | null
  category?: string | null
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
  onArchiveHabit?: (habitId: string) => void
  onDeleteHabit?: (habitId: string) => void
}

export function HabitGrid({
  habits,
  entries,
  month,
  year,
  onToggleEntry,
  onAddHabit,
  onArchiveHabit,
  onDeleteHabit,
}: HabitGridProps) {
  const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set())
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ habitId: string; title: string; hasEntries: boolean } | null>(null)

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
    <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800/50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {monthName} {year}
        </h2>
        <button
          onClick={onAddHabit}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-200 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Habit
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-zinc-800/50">
              <th className="sticky left-0 bg-zinc-900/50 backdrop-blur-sm px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wide w-56">
                Habit
              </th>
              {days.map((day) => (
                <th
                  key={day.toISOString()}
                  className={cn(
                    'px-1 py-2 text-center text-xs font-medium w-8',
                    isToday(day)
                      ? 'text-white bg-white/10'
                      : 'text-zinc-500'
                  )}
                >
                  <div>{day.getDate()}</div>
                  <div className="text-[10px] uppercase">
                    {day.toLocaleDateString('en', { weekday: 'narrow' })}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 ? (
              <tr>
                <td
                  colSpan={days.length + 2}
                  className="px-4 py-12 text-center text-zinc-500"
                >
                  <p className="mb-2">No habits yet!</p>
                  <button
                    onClick={onAddHabit}
                    className="text-white hover:underline"
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
                    className="border-b border-zinc-800/30 hover:bg-zinc-800/30"
                  >
                    <td className="sticky left-0 bg-zinc-900/50 backdrop-blur-sm px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: habit.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate max-w-[120px]">
                              {habit.title}
                            </span>
                            {goalDisplay && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
                                {goalDisplay}
                              </span>
                            )}
                          </div>
                          {habit.category && (
                            <span className="text-xs text-zinc-500">{habit.category}</span>
                          )}
                        </div>
                        {/* Menu button */}
                        {onArchiveHabit && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setMenuOpen(menuOpen === habit.id ? null : habit.id)
                              }}
                              className="p-1 text-zinc-500 hover:text-white rounded transition-colors"
                            >
                              <MoreVertical size={14} />
                            </button>
                            {menuOpen === habit.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setMenuOpen(null)} 
                                />
                                <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 py-1 min-w-[120px]">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onArchiveHabit(habit.id)
                                      setMenuOpen(null)
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                                  >
                                    <Archive size={14} />
                                    Archive
                                  </button>
                                  {onDeleteHabit && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        const habitEntries = entries.filter(en => en.habitId === habit.id && en.completed)
                                        setDeleteConfirm({
                                          habitId: habit.id,
                                          title: habit.title,
                                          hasEntries: habitEntries.length > 0
                                        })
                                        setMenuOpen(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                                    >
                                      <Trash2 size={14} />
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
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
                            today && 'bg-white/5'
                          )}
                        >
                          <button
                            onClick={() => handleCellClick(habit.id, day)}
                            disabled={isFuture || isLoading}
                            className={cn(
                              'w-6 h-6 rounded-md flex items-center justify-center transition-all mx-auto',
                              entry?.completed
                                ? 'text-zinc-900'
                                : 'border border-zinc-700 hover:border-zinc-500',
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
                      <span className="text-sm font-medium text-white">
                        {completedCount}
                      </span>
                      <span className="text-sm text-zinc-500">
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
        <div className="px-6 py-4 bg-zinc-800/30 border-t border-zinc-800/50">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-400">Weekly completion:</span>
            {weeks.map((weekStart, i) => {
              const totalPossible = Math.min(7, daysInMonth - weekStart + 1) * habits.length
              const totalCompleted = habits.reduce(
                (sum, habit) => sum + getWeeklyCompletion(habit.id, weekStart),
                0
              )
              const percentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0

              return (
                <div key={weekStart} className="flex items-center gap-2">
                  <span className="text-zinc-500">W{i + 1}:</span>
                  <div className="w-16 h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-white font-medium">{percentage}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-white rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              {deleteConfirm.hasEntries ? (
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Habit</h3>
                <p className="text-sm text-zinc-400">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-zinc-300 mb-2">
                Are you sure you want to delete <span className="font-semibold text-white">&quot;{deleteConfirm.title}&quot;</span>?
              </p>
              {deleteConfirm.hasEntries && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-amber-400 text-sm flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <span>This habit has completed entries that will also be deleted!</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDeleteHabit) {
                    onDeleteHabit(deleteConfirm.habitId)
                  }
                  setDeleteConfirm(null)
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
              >
                Delete Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
