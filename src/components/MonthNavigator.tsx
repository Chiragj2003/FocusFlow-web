'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthNavigatorProps {
  month: number
  year: number
  onChange: (month: number, year: number) => void
}

export function MonthNavigator({ month, year, onChange }: MonthNavigatorProps) {
  const monthName = new Date(year, month).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })

  const goToPrevMonth = () => {
    if (month === 0) {
      onChange(11, year - 1)
    } else {
      onChange(month - 1, year)
    }
  }

  const goToNextMonth = () => {
    if (month === 11) {
      onChange(0, year + 1)
    } else {
      onChange(month + 1, year)
    }
  }

  const goToToday = () => {
    const today = new Date()
    onChange(today.getMonth(), today.getFullYear())
  }

  const isCurrentMonth =
    month === new Date().getMonth() && year === new Date().getFullYear()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={goToPrevMonth}
        className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="text-lg font-semibold text-white min-w-[180px] text-center">
        {monthName}
      </span>

      <button
        onClick={goToNextMonth}
        className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        aria-label="Next month"
      >
        <ChevronRight size={20} />
      </button>

      {!isCurrentMonth && (
        <button
          onClick={goToToday}
          className="ml-2 px-3 py-1.5 text-sm font-medium text-zinc-900 bg-white rounded-xl hover:bg-zinc-200 transition-colors"
        >
          Today
        </button>
      )}
    </div>
  )
}
