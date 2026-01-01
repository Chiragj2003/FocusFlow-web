'use client'

import dynamic from 'next/dynamic'
import { Flame, Trophy, Calendar, BarChart3, TrendingUp, PieChart, Target } from 'lucide-react'
import type { InsightsSummary, StreakInfo } from '@/lib/analytics'
import { useMemo } from 'react'

// Dynamic imports for heavy chart components - reduces initial bundle size
const DonutChart = dynamic(() => import('@/components/DonutChart').then(m => ({ default: m.DonutChart })), {
  loading: () => <div className="h-48 bg-zinc-800/50 rounded-xl animate-pulse" />,
  ssr: false,
})
const WeeklyBars = dynamic(() => import('@/components/WeeklyBars').then(m => ({ default: m.WeeklyBars })), {
  loading: () => <div className="h-48 bg-zinc-800/50 rounded-xl animate-pulse" />,
  ssr: false,
})
const TopHabitsList = dynamic(() => import('@/components/TopHabitsList').then(m => ({ default: m.TopHabitsList })), {
  loading: () => <div className="h-48 bg-zinc-800/50 rounded-xl animate-pulse" />,
})
const Heatmap = dynamic(() => import('@/components/Heatmap').then(m => ({ default: m.Heatmap })), {
  loading: () => <div className="h-32 bg-zinc-800/50 rounded-xl animate-pulse" />,
  ssr: false,
})
const DayAnalysis = dynamic(() => import('@/components/DayAnalysis').then(m => ({ default: m.DayAnalysis })), {
  loading: () => <div className="h-48 bg-zinc-800/50 rounded-xl animate-pulse" />,
})
const TrendChart = dynamic(() => import('@/components/TrendChart').then(m => ({ default: m.TrendChart })), {
  loading: () => <div className="h-64 bg-zinc-800/50 rounded-xl animate-pulse" />,
  ssr: false,
})
const CategoryRadar = dynamic(() => import('@/components/CategoryRadar').then(m => ({ default: m.CategoryRadar })), {
  loading: () => <div className="h-64 bg-zinc-800/50 rounded-xl animate-pulse" />,
  ssr: false,
})
const _ProgressRing = dynamic(() => import('@/components/ProgressRing').then(m => ({ default: m.ProgressRing })), {
  loading: () => <div className="h-20 w-20 bg-zinc-800/50 rounded-full animate-pulse" />,
})
const MultiProgressRings = dynamic(() => import('@/components/ProgressRing').then(m => ({ default: m.MultiProgressRings })), {
  loading: () => <div className="h-48 bg-zinc-800/50 rounded-xl animate-pulse" />,
})

interface HeatmapData {
  date: string
  value: number
  count: number
}

interface InsightsClientProps {
  insights: InsightsSummary
  streaks: StreakInfo[]
  habits: { id: string; title: string; color: string; category?: string | null }[]
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

  // Calculate daily trend data from year entries
  const trendData = useMemo(() => {
    const last30Days: { date: string; value: number }[] = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayEntries = yearEntries.filter(e => e.entryDate === dateStr)
      const completed = dayEntries.filter(e => e.completed).length
      const total = habits.length
      
      last30Days.push({
        date: dateStr,
        value: total > 0 ? (completed / total) * 100 : 0,
      })
    }
    
    return last30Days
  }, [yearEntries, habits])

  // Calculate category data for radar chart
  const categoryData = useMemo(() => {
    const categories = new Map<string, { completed: number; total: number }>()
    
    habits.forEach(habit => {
      const cat = habit.category || 'Other'
      if (!categories.has(cat)) {
        categories.set(cat, { completed: 0, total: 0 })
      }
    })
    
    const habitSummaryMap = new Map(
      insights.habitSummaries.map(s => [s.habitId, s])
    )
    
    // Calculate days in the current month
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
    
    habits.forEach(habit => {
      const cat = habit.category || 'Other'
      const summary = habitSummaryMap.get(habit.id)
      const catData = categories.get(cat)!
      
      if (summary) {
        catData.completed += summary.countLogged
        catData.total += daysInCurrentMonth
      }
    })
    
    return Array.from(categories.entries())
      .map(([category, data]) => ({
        category,
        completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
        totalEntries: data.completed,
      }))
      .filter(d => d.totalEntries > 0)
  }, [habits, insights, year, month])

  // Calculate quick stats
  const quickStats = useMemo(() => {
    // Calculate days in the current month
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
    const avgDaily = insights.totalPossible > 0 
      ? (insights.totalCompleted / daysInCurrentMonth) 
      : 0
    const bestStreak = Math.max(...streaks.map(s => s.longestStreak), 0)
    const currentStreakTotal = streaks.reduce((sum, s) => sum + s.currentStreak, 0)
    
    return { avgDaily, bestStreak, currentStreakTotal }
  }, [insights, streaks, year, month])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Insights</h1>
        <p className="text-zinc-400 mt-1 text-sm sm:text-base">
          Detailed analytics for {monthName}
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-violet-400" />
            <span className="text-[10px] sm:text-xs text-violet-400 font-medium">Completion Rate</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">
            {insights.totalPossible > 0 
              ? Math.round((insights.totalCompleted / insights.totalPossible) * 100) 
              : 0}%
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={14} className="text-amber-400" />
            <span className="text-[10px] sm:text-xs text-amber-400 font-medium">Best Streak</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{quickStats.bestStreak} days</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/20 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">Daily Average</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{quickStats.avgDaily.toFixed(1)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/20 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={14} className="text-cyan-400" />
            <span className="text-[10px] sm:text-xs text-cyan-400 font-medium">Total Completed</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{insights.totalCompleted}</p>
        </div>
      </div>

      {/* Yearly Heatmap */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Calendar size={18} className="text-green-400 sm:w-5 sm:h-5" />
          <h2 className="text-base sm:text-lg font-semibold text-white">
            {year} Activity
          </h2>
        </div>
        <div className="overflow-x-auto -mx-2 px-2">
          <Heatmap data={heatmapData} year={year} colorScheme="green" />
        </div>
      </div>

      {/* 30-Day Trend Chart */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <TrendingUp size={18} className="text-violet-400 sm:w-5 sm:h-5" />
          <h2 className="text-base sm:text-lg font-semibold text-white">
            30-Day Trend
          </h2>
        </div>
        <TrendChart data={trendData} height={220} />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Overall Progress */}
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">
            Monthly Overview
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <DonutChart
              completed={insights.totalCompleted}
              total={insights.totalPossible}
              size={160}
            />
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-4 sm:space-y-4">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-zinc-400">Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {insights.totalCompleted}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-zinc-400">Total Possible</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {insights.totalPossible}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-zinc-400">Habits Tracked</p>
                <p className="text-lg sm:text-2xl font-bold text-white">
                  {habits.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">
            Weekly Performance
          </h2>
          <WeeklyBars data={insights.weekly} height={200} />
        </div>
      </div>

      {/* Category Radar & Streaks */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <div className="lg:col-span-2 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <PieChart size={18} className="text-purple-400 sm:w-5 sm:h-5" />
              <h2 className="text-base sm:text-lg font-semibold text-white">
                Category Performance
              </h2>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <CategoryRadar data={categoryData} size={240} />
              <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                {categoryData.slice(0, 6).map((cat) => (
                  <div 
                    key={cat.category}
                    className="p-3 bg-zinc-800/50 rounded-lg"
                  >
                    <p className="text-xs text-zinc-400 mb-1">{cat.category}</p>
                    <p className="text-lg font-bold text-white">
                      {Math.round(cat.completionRate)}%
                    </p>
                    <p className="text-[10px] text-zinc-500">{cat.totalEntries} entries</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Streaks */}
        <div className={`bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6 ${categoryData.length === 0 ? 'lg:col-span-3' : ''}`}>
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
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
                  <span className="text-xs sm:text-sm font-medium text-white truncate max-w-[120px] sm:max-w-none">
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

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Top Habits */}
        <div className="lg:col-span-2 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
            Top Performing Habits
          </h2>
          <TopHabitsList habits={insights.topHabits} showStreaks={true} />
        </div>

        {/* Progress Rings */}
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
            Overall Progress
          </h2>
          <MultiProgressRings
            rings={[
              {
                value: insights.totalPossible > 0 
                  ? (insights.totalCompleted / insights.totalPossible) * 100 
                  : 0,
                color: '#8b5cf6',
                label: 'Monthly',
              },
              {
                value: insights.weekly.length > 0 
                  ? insights.weekly[insights.weekly.length - 1].completionRate * 100 
                  : 0,
                color: '#22c55e',
                label: 'This Week',
              },
              {
                value: quickStats.bestStreak > 0 
                  ? Math.min((quickStats.bestStreak / 30) * 100, 100) 
                  : 0,
                color: '#f59e0b',
                label: 'Streak Goal',
              },
            ]}
            size={180}
          />
        </div>
      </div>

      {/* Habit Summaries Table */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
          Habit Details
        </h2>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-800/50">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-medium text-zinc-400 uppercase">
                  Habit
                </th>
                <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-medium text-zinc-400 uppercase">
                  Days Logged
                </th>
                <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-medium text-zinc-400 uppercase">
                  Total Value
                </th>
                <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-medium text-zinc-400 uppercase">
                  Avg/Day
                </th>
                <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-medium text-zinc-400 uppercase">
                  Current Streak
                </th>
                <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-medium text-zinc-400 uppercase">
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
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0"
                          style={{ backgroundColor: habit?.color }}
                        />
                        <span className="text-xs sm:text-sm font-medium text-white truncate max-w-[100px] sm:max-w-none">
                          {summary.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm text-zinc-400">
                      {summary.countLogged}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm text-zinc-400">
                      {summary.sumValue > 0 ? summary.sumValue.toFixed(0) : '-'}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm text-zinc-400">
                      {summary.avgPerActiveDay > 0
                        ? summary.avgPerActiveDay.toFixed(1)
                        : '-'}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                      {streak && streak.currentStreak > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-orange-400">
                          <Flame size={10} className="sm:w-3 sm:h-3" />
                          {streak.currentStreak}
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm text-zinc-500">-</span>
                      )}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                      {streak && streak.longestStreak > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-yellow-400">
                          <Trophy size={10} className="sm:w-3 sm:h-3" />
                          {streak.longestStreak}
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm text-zinc-500">-</span>
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
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <BarChart3 size={18} className="text-blue-400 sm:w-5 sm:h-5" />
          <h2 className="text-base sm:text-lg font-semibold text-white">
            Best Performing Days
          </h2>
        </div>
        <DayAnalysis entries={yearEntries} habitsCount={habits.length} />
      </div>
    </div>
  )
}
