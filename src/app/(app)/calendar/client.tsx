'use client'

import { useState, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

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
}

interface CalendarClientProps {
  initialHabits: Habit[]
  initialEntries: Entry[]
  initialYear: number
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function CalendarClient({
  initialHabits,
  initialEntries,
  initialYear,
}: CalendarClientProps) {
  const [habits] = useState(initialHabits)
  const [entries, setEntries] = useState(initialEntries)
  const [year, setYear] = useState(initialYear)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch entries for the year
  const fetchYearEntries = useCallback(async (targetYear: number) => {
    setIsLoading(true)
    try {
      const startDate = `${targetYear}-01-01`
      const endDate = `${targetYear}-12-31`
      const response = await fetch(`/api/entries?start=${startDate}&end=${endDate}`)
      if (response.ok) {
        const data = await response.json()
        setEntries(
          data.map((e: { id: string; habitId: string; entryDate: string | Date; completed: boolean }) => ({
            ...e,
            entryDate:
              typeof e.entryDate === 'string'
                ? e.entryDate.split('T')[0]
                : new Date(e.entryDate).toISOString().split('T')[0],
          }))
        )
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle year change
  const handleYearChange = useCallback(
    (delta: number) => {
      const newYear = year + delta
      setYear(newYear)
      fetchYearEntries(newYear)
    },
    [year, fetchYearEntries]
  )

  // Calculate daily progress for each day
  const dailyProgress = useMemo(() => {
    const progressMap: Record<string, { completed: number; total: number }> = {}
    
    // Get all unique dates from entries
    const entryDates = new Set<string>()
    entries.forEach((e) => {
      const dateStr = typeof e.entryDate === 'string' 
        ? e.entryDate.split('T')[0] 
        : formatDate(new Date(e.entryDate))
      entryDates.add(dateStr)
    })

    // Calculate progress for each date
    entryDates.forEach((dateStr) => {
      const dayEntries = entries.filter((e) => {
        const entryDate = typeof e.entryDate === 'string' 
          ? e.entryDate.split('T')[0] 
          : formatDate(new Date(e.entryDate))
        return entryDate === dateStr
      })
      
      const completed = dayEntries.filter((e) => e.completed).length
      progressMap[dateStr] = { completed, total: habits.length }
    })

    return progressMap
  }, [entries, habits.length])

  // Generate calendar data for a month
  const generateMonthDays = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay() // 0 = Sunday
    
    const days: (Date | null)[] = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, monthIndex, i))
    }
    
    return days
  }

  // Get progress color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return 'bg-muted'
    if (percentage < 25) return 'bg-red-400'
    if (percentage < 50) return 'bg-orange-400'
    if (percentage < 75) return 'bg-yellow-400'
    if (percentage < 100) return 'bg-green-400'
    return 'bg-green-500'
  }

  const today = new Date()
  const todayStr = formatDate(today)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar View</h1>
          <p className="text-muted-foreground mt-1">
            View your yearly habit progress at a glance
          </p>
        </div>
        
        {/* Year Navigator */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleYearChange(-1)}
            disabled={isLoading}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-semibold text-foreground min-w-20 text-center">
            {year}
          </span>
          <button
            onClick={() => handleYearChange(1)}
            disabled={isLoading || year >= today.getFullYear()}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-6 text-sm">
          <span className="text-muted-foreground">Progress:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-muted" />
            <span className="text-muted-foreground">0%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-red-400" />
            <span className="text-muted-foreground">1-24%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-orange-400" />
            <span className="text-muted-foreground">25-49%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <span className="text-muted-foreground">50-74%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-muted-foreground">75-99%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-muted-foreground">100%</span>
          </div>
        </div>
      </div>

      {/* Year Calendar Grid */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        isLoading && "opacity-50"
      )}>
        {MONTHS.map((monthName, monthIndex) => {
          const days = generateMonthDays(monthIndex)
          
          return (
            <div 
              key={monthName} 
              className="bg-card rounded-xl border border-border p-4"
            >
              {/* Month Header */}
              <h3 className="text-sm font-semibold text-card-foreground mb-3">
                {monthName}
              </h3>
              
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div 
                    key={i} 
                    className="text-[10px] text-muted-foreground text-center font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                  if (!day) {
                    return <div key={`empty-${i}`} className="w-6 h-6" />
                  }
                  
                  const dateStr = formatDate(day)
                  const progress = dailyProgress[dateStr]
                  const isFuture = day > today
                  const isToday = dateStr === todayStr
                  
                  let percentage = 0
                  if (progress && progress.total > 0) {
                    percentage = Math.round((progress.completed / progress.total) * 100)
                  }
                  
                  return (
                    <div
                      key={dateStr}
                      className={cn(
                        "relative w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all",
                        isFuture 
                          ? "text-muted-foreground/30" 
                          : "text-card-foreground",
                        isToday && "ring-2 ring-primary ring-offset-1 ring-offset-card"
                      )}
                      title={progress ? `${progress.completed}/${progress.total} habits (${percentage}%)` : undefined}
                    >
                      {/* Progress Circle Background */}
                      {!isFuture && habits.length > 0 && (
                        <div 
                          className={cn(
                            "absolute inset-0 rounded-full",
                            getProgressColor(percentage)
                          )}
                          style={{
                            opacity: percentage > 0 ? 0.3 + (percentage / 100) * 0.7 : 0.2
                          }}
                        />
                      )}
                      
                      {/* Progress Ring */}
                      {!isFuture && percentage > 0 && percentage < 100 && (
                        <svg 
                          className="absolute inset-0 w-6 h-6 -rotate-90"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary"
                            strokeDasharray={`${(percentage / 100) * 62.83} 62.83`}
                          />
                        </svg>
                      )}
                      
                      {/* Day Number */}
                      <span className="relative z-10 font-medium">
                        {day.getDate()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats Summary */}
      {habits.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            {year} Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-2xl font-bold text-card-foreground">
                {Object.keys(dailyProgress).length}
              </p>
              <p className="text-sm text-muted-foreground">Active Days</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-2xl font-bold text-card-foreground">
                {entries.filter(e => e.completed).length}
              </p>
              <p className="text-sm text-muted-foreground">Habits Completed</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-2xl font-bold text-card-foreground">
                {Object.values(dailyProgress).filter(p => p.completed === p.total && p.total > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Perfect Days</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-2xl font-bold text-primary">
                {habits.length > 0 && Object.keys(dailyProgress).length > 0
                  ? Math.round(
                      (entries.filter(e => e.completed).length / 
                      (Object.keys(dailyProgress).length * habits.length)) * 100
                    )
                  : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Average Completion</p>
            </div>
          </div>
        </div>
      )}

      {/* No habits message */}
      {habits.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground mb-2">No habits created yet!</p>
          <a href="/habits" className="text-primary hover:underline">
            Create your first habit
          </a>
        </div>
      )}
    </div>
  )
}
