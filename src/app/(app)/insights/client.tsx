'use client'

import { DonutChart } from '@/components/DonutChart'
import { WeeklyBars } from '@/components/WeeklyBars'
import { TopHabitsList } from '@/components/TopHabitsList'
import { Flame, Trophy } from 'lucide-react'
import type { InsightsSummary, StreakInfo } from '@/lib/analytics'

interface InsightsClientProps {
  insights: InsightsSummary
  streaks: StreakInfo[]
  habits: { id: string; title: string; color: string }[]
  month: number
  year: number
}

export function InsightsClient({
  insights,
  streaks,
  habits,
  month,
  year,
}: InsightsClientProps) {
  const monthName = new Date(year, month).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })

  // Calculate best performers
  const sortedByStreak = [...streaks].sort(
    (a, b) => b.currentStreak - a.currentStreak
  )
  const topStreaks = sortedByStreak.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insights</h1>
        <p className="text-muted-foreground mt-1">
          Detailed analytics for {monthName}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-6">
            Monthly Overview
          </h2>
          <div className="flex items-center justify-center gap-8">
            <DonutChart
              completed={insights.totalCompleted}
              total={insights.totalPossible}
              size={200}
            />
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {insights.totalCompleted}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Possible</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {insights.totalPossible}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Habits Tracked</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {habits.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-6">
            Weekly Performance
          </h2>
          <WeeklyBars data={insights.weekly} height={220} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Habits */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Top Performing Habits
          </h2>
          <TopHabitsList habits={insights.topHabits} showStreaks={true} />
        </div>

        {/* Streaks */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Current Streaks
          </h2>
          {topStreaks.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No active streaks
            </p>
          ) : (
            <div className="space-y-3">
              {topStreaks.map((streak) => (
                <div
                  key={streak.habitId}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <span className="text-sm font-medium text-card-foreground truncate">
                    {streak.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <Flame size={14} className="text-orange-500" />
                    <span className="text-sm font-bold text-card-foreground">
                      {streak.currentStreak}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Habit Summaries Table */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          Habit Details
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Habit
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Days Logged
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Total Value
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Avg/Day
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Current Streak
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Longest Streak
                </th>
              </tr>
            </thead>
            <tbody>
              {insights.habitSummaries.map((summary) => {
                const streak = streaks.find((s) => s.habitId === summary.habitId)
                const habit = habits.find((h) => h.id === summary.habitId)

                return (
                  <tr
                    key={summary.habitId}
                    className="border-b border-border/50 hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: habit?.color }}
                        />
                        <span className="text-sm font-medium text-card-foreground">
                          {summary.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                      {summary.countLogged}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                      {summary.sumValue > 0 ? summary.sumValue.toFixed(0) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                      {summary.avgPerActiveDay > 0
                        ? summary.avgPerActiveDay.toFixed(1)
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {streak && streak.currentStreak > 0 ? (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-500">
                          <Flame size={12} />
                          {streak.currentStreak}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {streak && streak.longestStreak > 0 ? (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-500">
                          <Trophy size={12} />
                          {streak.longestStreak}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
