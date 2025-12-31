'use client'

import { DonutChart } from '@/components/DonutChart'
import { WeeklyBars } from '@/components/WeeklyBars'
import { TopHabitsList } from '@/components/TopHabitsList'
import { Heatmap } from '@/components/Heatmap'
import { DayAnalysis } from '@/components/DayAnalysis'
import { Flame, Trophy, Calendar, BarChart3 } from 'lucide-react'
import type { InsightsSummary, StreakInfo } from '@/lib/analytics'

interface HeatmapData {
  date: string
  value: number
  count: number
}

interface InsightsClientProps {
  insights: InsightsSummary
  streaks: StreakInfo[]
  habits: { id: string; title: string; color: string }[]
  month: number
  year: number
  heatmapData?: HeatmapData[]
  yearEntries?: { entryDate: string; completed: boolean }[]
}

export function InsightsClient({
  insights,
  streaks,
  habits,
  month,
  year,
  heatmapData = [],
  yearEntries = [],
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
        <h1 className="text-2xl font-bold text-white">Insights</h1>
        <p className="text-zinc-400 mt-1">
          Detailed analytics for {monthName}
        </p>
      </div>

      {/* Yearly Heatmap */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar size={20} className="text-green-400" />
          <h2 className="text-lg font-semibold text-white">
            {year} Activity
          </h2>
        </div>
        <Heatmap data={heatmapData} year={year} colorScheme="green" />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
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
                <p className="text-sm text-zinc-400">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {insights.totalCompleted}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total Possible</p>
                <p className="text-2xl font-bold text-white">
                  {insights.totalPossible}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Habits Tracked</p>
                <p className="text-2xl font-bold text-white">
                  {habits.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Weekly Performance
          </h2>
          <WeeklyBars data={insights.weekly} height={220} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Habits */}
        <div className="lg:col-span-2 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Top Performing Habits
          </h2>
          <TopHabitsList habits={insights.topHabits} showStreaks={true} />
        </div>

        {/* Streaks */}
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Current Streaks
          </h2>
          {topStreaks.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8">
              No active streaks
            </p>
          ) : (
            <div className="space-y-3">
              {topStreaks.map((streak) => (
                <div
                  key={streak.habitId}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50"
                >
                  <span className="text-sm font-medium text-white truncate">
                    {streak.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <Flame size={14} className="text-orange-400" />
                    <span className="text-sm font-bold text-white">
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
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Habit Details
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase">
                  Habit
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-zinc-400 uppercase">
                  Days Logged
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-zinc-400 uppercase">
                  Total Value
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-zinc-400 uppercase">
                  Avg/Day
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-zinc-400 uppercase">
                  Current Streak
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-zinc-400 uppercase">
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
                    className="border-b border-zinc-800/30 hover:bg-zinc-800/30"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: habit?.color }}
                        />
                        <span className="text-sm font-medium text-white">
                          {summary.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-zinc-400">
                      {summary.countLogged}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-zinc-400">
                      {summary.sumValue > 0 ? summary.sumValue.toFixed(0) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-zinc-400">
                      {summary.avgPerActiveDay > 0
                        ? summary.avgPerActiveDay.toFixed(1)
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {streak && streak.currentStreak > 0 ? (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-400">
                          <Flame size={12} />
                          {streak.currentStreak}
                        </span>
                      ) : (
                        <span className="text-sm text-zinc-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {streak && streak.longestStreak > 0 ? (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-400">
                          <Trophy size={12} />
                          {streak.longestStreak}
                        </span>
                      ) : (
                        <span className="text-sm text-zinc-500">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Day Analysis */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 size={20} className="text-blue-400" />
          <h2 className="text-lg font-semibold text-white">
            Best Performing Days
          </h2>
        </div>
        <DayAnalysis entries={yearEntries} habitsCount={habits.length} />
      </div>
    </div>
  )
}
