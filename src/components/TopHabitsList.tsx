'use client'

import { Flame, Trophy } from 'lucide-react'

interface TopHabit {
  habitId: string
  title: string
  color: string
  completionRate: number
  currentStreak: number
  longestStreak: number
}

interface TopHabitsListProps {
  habits: TopHabit[]
  showStreaks?: boolean
}

export function TopHabitsList({ habits, showStreaks = true }: TopHabitsListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No habits to display
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {habits.map((habit, index) => {
        const percentage = Math.round(habit.completionRate * 100)

        return (
          <div
            key={habit.habitId}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-border transition-colors"
          >
            {/* Rank */}
            <div className="shrink-0 w-6 h-6 rounded-full bg-border flex items-center justify-center text-xs font-medium text-muted-foreground">
              {index + 1}
            </div>

            {/* Color indicator */}
            <div
              className="shrink-0 w-3 h-3 rounded-full"
              style={{ backgroundColor: habit.color }}
            />

            {/* Title and progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-card-foreground truncate">
                  {habit.title}
                </span>
                <span className="text-sm font-semibold text-card-foreground ml-2">
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: habit.color,
                  }}
                />
              </div>
            </div>

            {/* Streak info */}
            {showStreaks && habit.currentStreak > 0 && (
              <div className="shrink-0 flex items-center gap-1 text-orange-500">
                <Flame size={14} />
                <span className="text-xs font-medium">{habit.currentStreak}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

interface StreakCardProps {
  title: string
  currentStreak: number
  longestStreak: number
  icon?: 'flame' | 'trophy'
}

export function StreakCard({
  title,
  currentStreak,
  longestStreak,
  icon = 'flame',
}: StreakCardProps) {
  const Icon = icon === 'flame' ? Flame : Trophy

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-orange-500" />
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-card-foreground">{currentStreak}</span>
        <span className="text-sm text-muted-foreground">days</span>
      </div>
      
      {longestStreak > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          Best: {longestStreak} days
        </div>
      )}
    </div>
  )
}
