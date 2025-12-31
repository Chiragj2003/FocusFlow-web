'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface DayData {
  dayOfWeek: number // 0 = Sunday, 6 = Saturday
  completionRate: number
  totalCompleted: number
  totalPossible: number
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

export function DayAnalysis({ entries, habitsCount: _habitsCount }: DayAnalysisProps) {
  const dayData = useMemo(() => {
    const data: DayData[] = DAYS.map((_, i) => ({
      dayOfWeek: i,
      completionRate: 0,
      totalCompleted: 0,
      totalPossible: 0,
    }))

    // Group entries by day of week
    entries.forEach((entry) => {
      const date = new Date(entry.entryDate)
      const dayOfWeek = date.getDay()
      data[dayOfWeek].totalPossible++
      if (entry.completed) {
        data[dayOfWeek].totalCompleted++
      }
    })

    // Calculate completion rates
    data.forEach((d) => {
      d.completionRate = d.totalPossible > 0 
        ? (d.totalCompleted / d.totalPossible) * 100 
        : 0
    })

    return data
  }, [entries])

  const bestDay = useMemo(() => {
    return dayData.reduce((best, current) => 
      current.completionRate > best.completionRate ? current : best
    , dayData[0])
  }, [dayData])

  const worstDay = useMemo(() => {
    const daysWithData = dayData.filter(d => d.totalPossible > 0)
    if (daysWithData.length === 0) return dayData[0]
    return daysWithData.reduce((worst, current) => 
      current.completionRate < worst.completionRate ? current : worst
    , daysWithData[0])
  }, [dayData])

  const maxRate = Math.max(...dayData.map(d => d.completionRate), 1)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-xs text-green-400 mb-1">Best Day</p>
          <p className="text-lg font-bold text-white">{FULL_DAYS[bestDay.dayOfWeek]}</p>
          <p className="text-sm text-zinc-400">{bestDay.completionRate.toFixed(0)}% completion</p>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-xs text-red-400 mb-1">Needs Work</p>
          <p className="text-lg font-bold text-white">{FULL_DAYS[worstDay.dayOfWeek]}</p>
          <p className="text-sm text-zinc-400">{worstDay.completionRate.toFixed(0)}% completion</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-3">
        {dayData.map((day, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="w-10 text-sm text-zinc-400 font-medium">{DAYS[i]}</span>
            <div className="flex-1 h-8 bg-zinc-800 rounded-lg overflow-hidden relative">
              <div
                className={cn(
                  'h-full rounded-lg transition-all duration-500',
                  day.dayOfWeek === bestDay.dayOfWeek
                    ? 'bg-green-500'
                    : day.dayOfWeek === worstDay.dayOfWeek && day.totalPossible > 0
                    ? 'bg-red-500'
                    : 'bg-white/20'
                )}
                style={{ width: `${(day.completionRate / maxRate) * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center px-3 text-sm font-medium text-white">
                {day.completionRate.toFixed(0)}%
              </span>
            </div>
            <span className="w-16 text-xs text-zinc-500 text-right">
              {day.totalCompleted}/{day.totalPossible}
            </span>
          </div>
        ))}
      </div>

      {/* Insights */}
      {bestDay.completionRate > 0 && (
        <div className="p-4 bg-zinc-800/50 rounded-xl">
          <p className="text-sm text-zinc-300">
            💡 <span className="font-medium">Insight:</span> You perform best on{' '}
            <span className="text-white font-medium">{FULL_DAYS[bestDay.dayOfWeek]}s</span>
            {worstDay.totalPossible > 0 && bestDay.dayOfWeek !== worstDay.dayOfWeek && (
              <>
                {' '}and tend to slip on{' '}
                <span className="text-white font-medium">{FULL_DAYS[worstDay.dayOfWeek]}s</span>
              </>
            )}.
            {bestDay.dayOfWeek === 0 || bestDay.dayOfWeek === 6
              ? ' Weekends work well for you!'
              : ' Weekdays are your strong suit!'}
          </p>
        </div>
      )}
    </div>
  )
}
