'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Calendar, Target, Award, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DayData {
  dayOfWeek: number // 0 = Sunday, 6 = Saturday
  completionRate: number
  totalCompleted: number
  totalPossible: number
  avgPerDay: number
}

interface DayAnalysisProps {
  entries: {
    entryDate: string
    completed: boolean
  }[]
  habitsCount: number
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_EMOJIS = ['☀️', '💼', '📊', '🔥', '⚡', '🎉', '🌟']

export function DayAnalysis({ entries, habitsCount: _habitsCount }: DayAnalysisProps) {
  const dayData = useMemo(() => {
    const data: DayData[] = DAYS.map((_, i) => ({
      dayOfWeek: i,
      completionRate: 0,
      totalCompleted: 0,
      totalPossible: 0,
      avgPerDay: 0,
    }))

    // Count unique dates per day of week
    const datesPerDay: Set<string>[] = DAYS.map(() => new Set())

    // Group entries by day of week
    entries.forEach((entry) => {
      const date = new Date(entry.entryDate)
      const dayOfWeek = date.getDay()
      data[dayOfWeek].totalPossible++
      datesPerDay[dayOfWeek].add(entry.entryDate)
      if (entry.completed) {
        data[dayOfWeek].totalCompleted++
      }
    })

    // Calculate completion rates and averages
    data.forEach((d, i) => {
      d.completionRate = d.totalPossible > 0 
        ? (d.totalCompleted / d.totalPossible) * 100 
        : 0
      const uniqueDays = datesPerDay[i].size
      d.avgPerDay = uniqueDays > 0 ? d.totalCompleted / uniqueDays : 0
    })

    return data
  }, [entries])

  const stats = useMemo(() => {
    const daysWithData = dayData.filter(d => d.totalPossible > 0)
    if (daysWithData.length === 0) {
      return {
        bestDay: dayData[0],
        worstDay: dayData[0],
        weekdayAvg: 0,
        weekendAvg: 0,
        consistency: 0,
        totalTracked: 0,
      }
    }

    const bestDay = daysWithData.reduce((best, current) => 
      current.completionRate > best.completionRate ? current : best
    , daysWithData[0])

    const worstDay = daysWithData.reduce((worst, current) => 
      current.completionRate < worst.completionRate ? current : worst
    , daysWithData[0])

    // Weekday vs Weekend analysis
    const weekdays = dayData.filter((_, i) => i >= 1 && i <= 5)
    const weekends = dayData.filter((_, i) => i === 0 || i === 6)
    
    const weekdayTotal = weekdays.reduce((sum, d) => sum + d.totalCompleted, 0)
    const weekdayPossible = weekdays.reduce((sum, d) => sum + d.totalPossible, 0)
    const weekendTotal = weekends.reduce((sum, d) => sum + d.totalCompleted, 0)
    const weekendPossible = weekends.reduce((sum, d) => sum + d.totalPossible, 0)

    const weekdayAvg = weekdayPossible > 0 ? (weekdayTotal / weekdayPossible) * 100 : 0
    const weekendAvg = weekendPossible > 0 ? (weekendTotal / weekendPossible) * 100 : 0

    // Consistency score (how evenly distributed across days)
    const rates = daysWithData.map(d => d.completionRate)
    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length
    const variance = rates.reduce((sum, r) => sum + Math.pow(r - avgRate, 2), 0) / rates.length
    const stdDev = Math.sqrt(variance)
    const consistency = Math.max(0, 100 - stdDev)

    const totalTracked = dayData.reduce((sum, d) => sum + d.totalCompleted, 0)

    return { bestDay, worstDay, weekdayAvg, weekendAvg, consistency, totalTracked }
  }, [dayData])

  const maxRate = Math.max(...dayData.map(d => d.completionRate), 1)
  const hasData = entries.length > 0

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="p-3 sm:p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20 rounded-lg sm:rounded-xl">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <TrendingUp size={14} className="text-green-400 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs text-green-400 font-medium">Best Day</span>
          </div>
          <p className="text-base sm:text-xl font-bold text-white">{FULL_DAYS[stats.bestDay.dayOfWeek]}</p>
          <p className="text-[10px] sm:text-sm text-zinc-400">{stats.bestDay.completionRate.toFixed(0)}% success</p>
        </div>
        
        <div className="p-3 sm:p-4 bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/20 rounded-lg sm:rounded-xl">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <TrendingDown size={14} className="text-red-400 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs text-red-400 font-medium">Needs Focus</span>
          </div>
          <p className="text-base sm:text-xl font-bold text-white">{FULL_DAYS[stats.worstDay.dayOfWeek]}</p>
          <p className="text-[10px] sm:text-sm text-zinc-400">{stats.worstDay.completionRate.toFixed(0)}% success</p>
        </div>

        <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 rounded-lg sm:rounded-xl">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <Calendar size={14} className="text-blue-400 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs text-blue-400 font-medium">Weekdays</span>
          </div>
          <p className="text-base sm:text-xl font-bold text-white">{stats.weekdayAvg.toFixed(0)}%</p>
          <p className="text-[10px] sm:text-sm text-zinc-400">Mon - Fri avg</p>
        </div>

        <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/20 rounded-lg sm:rounded-xl">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <Target size={14} className="text-purple-400 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs text-purple-400 font-medium">Weekends</span>
          </div>
          <p className="text-base sm:text-xl font-bold text-white">{stats.weekendAvg.toFixed(0)}%</p>
          <p className="text-[10px] sm:text-sm text-zinc-400">Sat - Sun avg</p>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="bg-zinc-800/30 rounded-lg sm:rounded-xl p-3 sm:p-5 border border-zinc-700/50">
        <h4 className="text-xs sm:text-sm font-medium text-zinc-400 mb-3 sm:mb-4 flex items-center gap-2">
          <Award size={14} className="sm:w-4 sm:h-4" />
          Performance by Day
        </h4>
        <div className="space-y-2 sm:space-y-3">
          {dayData.map((day, i) => {
            const isBest = hasData && day.dayOfWeek === stats.bestDay.dayOfWeek && day.totalPossible > 0
            const isWorst = hasData && day.dayOfWeek === stats.worstDay.dayOfWeek && day.totalPossible > 0 && stats.bestDay.dayOfWeek !== stats.worstDay.dayOfWeek
            
            return (
              <div key={i} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2 w-12 sm:w-16">
                  <span className="text-sm sm:text-lg">{DAY_EMOJIS[i]}</span>
                  <span className={cn(
                    'text-xs sm:text-sm font-medium',
                    isBest ? 'text-green-400' : isWorst ? 'text-red-400' : 'text-zinc-400'
                  )}>
                    {DAYS[i]}
                  </span>
                </div>
                <div className="flex-1 h-8 sm:h-10 bg-zinc-800 rounded-lg overflow-hidden relative group">
                  <div
                    className={cn(
                      'h-full rounded-lg transition-all duration-700 ease-out',
                      isBest
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                        : isWorst
                        ? 'bg-gradient-to-r from-red-500 to-orange-400'
                        : 'bg-gradient-to-r from-zinc-600 to-zinc-500'
                    )}
                    style={{ width: `${Math.max((day.completionRate / maxRate) * 100, day.totalPossible > 0 ? 5 : 0)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-3">
                    <span className={cn(
                      'text-xs sm:text-sm font-bold',
                      day.completionRate > 50 ? 'text-white' : 'text-zinc-300'
                    )}>
                      {day.completionRate.toFixed(0)}%
                    </span>
                    <span className="text-[10px] sm:text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                      {day.totalCompleted} / {day.totalPossible} completed
                    </span>
                  </div>
                </div>
                {isBest && (
                  <span className="text-green-400 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-500/10 rounded-full hidden sm:inline">
                    🏆 Best
                  </span>
                )}
                {isWorst && (
                  <span className="text-red-400 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500/10 rounded-full hidden sm:inline">
                    📍 Focus
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Insights Section */}
      {hasData && (
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          {/* Pattern Insight */}
          <div className="p-3 sm:p-4 bg-zinc-800/50 rounded-lg sm:rounded-xl border border-zinc-700/50">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <span className="text-base sm:text-xl">💡</span>
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-medium text-white mb-0.5 sm:mb-1">Weekly Pattern</h5>
                <p className="text-[10px] sm:text-sm text-zinc-400">
                  {stats.weekdayAvg > stats.weekendAvg + 10
                    ? `You're ${(stats.weekdayAvg - stats.weekendAvg).toFixed(0)}% more productive on weekdays. Consider setting weekend reminders!`
                    : stats.weekendAvg > stats.weekdayAvg + 10
                    ? `Weekends are your power time! You're ${(stats.weekendAvg - stats.weekdayAvg).toFixed(0)}% more consistent than weekdays.`
                    : 'Great balance! Your performance is consistent across the week.'}
                </p>
              </div>
            </div>
          </div>

          {/* Improvement Tip */}
          <div className="p-3 sm:p-4 bg-zinc-800/50 rounded-lg sm:rounded-xl border border-zinc-700/50">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-blue-400 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-medium text-white mb-0.5 sm:mb-1">Improvement Tip</h5>
                <p className="text-[10px] sm:text-sm text-zinc-400">
                  {stats.worstDay.completionRate < 50 && stats.worstDay.totalPossible > 0
                    ? `${FULL_DAYS[stats.worstDay.dayOfWeek]}s need attention. Try scheduling your easiest habits for this day.`
                    : stats.consistency > 80
                    ? 'Excellent consistency! Keep maintaining your routine across all days.'
                    : `Focus on making ${FULL_DAYS[stats.worstDay.dayOfWeek]}s stronger to boost overall consistency.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consistency Score */}
      {hasData && (
        <div className="p-3 sm:p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-lg sm:rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-violet-400 font-medium mb-0.5 sm:mb-1">Weekly Consistency Score</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{stats.consistency.toFixed(0)}%</p>
              <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 sm:mt-1">
                {stats.consistency >= 80 ? 'Excellent - Very consistent!' : 
                 stats.consistency >= 60 ? 'Good - Room for improvement' : 
                 'Building - Focus on weak days'}
              </p>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-violet-500/30 flex items-center justify-center">
              <span className="text-xl sm:text-2xl">
                {stats.consistency >= 80 ? '🌟' : stats.consistency >= 60 ? '📈' : '💪'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
