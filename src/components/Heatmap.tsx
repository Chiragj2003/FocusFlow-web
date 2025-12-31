'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface HeatmapData {
  date: string
  value: number // 0-4 intensity level
  count?: number
}

interface HeatmapProps {
  data: HeatmapData[]
  year?: number
  colorScheme?: 'green' | 'blue' | 'purple' | 'orange'
}

const COLOR_SCHEMES = {
  green: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  blue: ['#161b22', '#0a3069', '#0550ae', '#1f7cda', '#58a6ff'],
  purple: ['#161b22', '#3b0764', '#5b21b6', '#7c3aed', '#a78bfa'],
  orange: ['#161b22', '#7c2d12', '#c2410c', '#ea580c', '#fb923c'],
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function Heatmap({ data, year, colorScheme = 'green' }: HeatmapProps) {
  const currentYear = year || new Date().getFullYear()
  const colors = COLOR_SCHEMES[colorScheme]

  // Generate all dates for the year
  const { weeks, monthLabels } = useMemo(() => {
    const startDate = new Date(currentYear, 0, 1)
    const endDate = new Date(currentYear, 11, 31)
    
    // Adjust start to the first Sunday
    const firstDay = startDate.getDay()
    startDate.setDate(startDate.getDate() - firstDay)
    
    const dataMap = new Map(data.map((d) => [d.date, d]))
    const weeks: { date: Date; value: number; count: number }[][] = []
    const monthLabels: { month: string; weekIndex: number }[] = []
    
    const currentDate = new Date(startDate)
    let currentWeek: { date: Date; value: number; count: number }[] = []
    let lastMonth = -1

    while (currentDate <= endDate || currentWeek.length > 0) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayData = dataMap.get(dateStr)
      
      currentWeek.push({
        date: new Date(currentDate),
        value: dayData?.value || 0,
        count: dayData?.count || 0,
      })

      // Track month labels
      if (currentDate.getMonth() !== lastMonth && currentDate.getFullYear() === currentYear) {
        monthLabels.push({
          month: MONTHS[currentDate.getMonth()],
          weekIndex: weeks.length,
        })
        lastMonth = currentDate.getMonth()
      }

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentDate.setDate(currentDate.getDate() + 1)
      
      if (currentDate > endDate && currentWeek.length === 0) break
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return { weeks, monthLabels }
  }, [data, currentYear])

  // Calculate stats
  const stats = useMemo(() => {
    const totalDays = data.filter((d) => d.value > 0).length
    const totalValue = data.reduce((sum, d) => sum + (d.count || 0), 0)
    const maxStreak = calculateMaxStreak(data)
    const currentStreak = calculateCurrentStreak(data)
    
    return { totalDays, totalValue, maxStreak, currentStreak }
  }, [data])

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-zinc-500">Active Days: </span>
          <span className="text-white font-medium">{stats.totalDays}</span>
        </div>
        <div>
          <span className="text-zinc-500">Total Completions: </span>
          <span className="text-white font-medium">{stats.totalValue}</span>
        </div>
        <div>
          <span className="text-zinc-500">Best Streak: </span>
          <span className="text-white font-medium">{stats.maxStreak} days</span>
        </div>
        <div>
          <span className="text-zinc-500">Current Streak: </span>
          <span className="text-white font-medium">{stats.currentStreak} days</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month Labels */}
          <div className="flex mb-2 ml-8">
            {monthLabels.map((label, i) => (
              <div
                key={i}
                className="text-xs text-zinc-500"
                style={{
                  marginLeft: i === 0 ? 0 : `${(label.weekIndex - (monthLabels[i - 1]?.weekIndex || 0)) * 14 - 24}px`,
                }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 pr-2">
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className={cn(
                    'h-3 text-xs text-zinc-500 flex items-center',
                    i % 2 === 0 ? 'visible' : 'invisible'
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const isCurrentYear = day.date.getFullYear() === currentYear
                  const isToday = day.date.toDateString() === new Date().toDateString()
                  
                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        'w-3 h-3 rounded-sm transition-colors',
                        isToday && 'ring-1 ring-white',
                        !isCurrentYear && 'opacity-30'
                      )}
                      style={{ backgroundColor: colors[day.value] }}
                      title={`${day.date.toLocaleDateString()}: ${day.count} completions`}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500">
            <span>Less</span>
            {colors.map((color, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateMaxStreak(data: HeatmapData[]): number {
  const sortedDates = [...data]
    .filter((d) => d.value > 0)
    .map((d) => new Date(d.date))
    .sort((a, b) => a.getTime() - b.getTime())

  if (sortedDates.length === 0) return 0

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return maxStreak
}

function calculateCurrentStreak(data: HeatmapData[]): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const sortedDates = [...data]
    .filter((d) => d.value > 0)
    .map((d) => {
      const date = new Date(d.date)
      date.setHours(0, 0, 0, 0)
      return date
    })
    .sort((a, b) => b.getTime() - a.getTime())

  if (sortedDates.length === 0) return 0

  // Check if the most recent date is today or yesterday
  const mostRecent = sortedDates[0]
  const diffFromToday = (today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)
  
  if (diffFromToday > 1) return 0

  let streak = 1
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i - 1].getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}
