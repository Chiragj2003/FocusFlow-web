'use client'

import { useState, useCallback } from 'react'
import { HabitGrid } from '@/components/HabitGrid'
import { AddHabitModal } from '@/components/AddHabitModal'
import { MonthNavigator } from '@/components/MonthNavigator'
import { useRouter } from 'next/navigation'

interface Habit {
  id: string
  userId: string
  title: string
  description: string | null
  category: string | null
  color: string
  goalType: string
  goalTarget: number | null
  unit: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

interface Entry {
  id: string
  habitId: string
  userId: string
  entryDate: string
  completed: boolean
  value: number | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

interface HabitsClientProps {
  initialHabits: Habit[]
  initialEntries: Entry[]
  initialMonth: number
  initialYear: number
}

export function HabitsClient({
  initialHabits,
  initialEntries,
  initialMonth,
  initialYear,
}: HabitsClientProps) {
  const router = useRouter()
  const [habits, setHabits] = useState(initialHabits)
  const [entries, setEntries] = useState(initialEntries)
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Handle month change
  const handleMonthChange = useCallback(
    async (newMonth: number, newYear: number) => {
      setMonth(newMonth)
      setYear(newYear)

      // Fetch entries for the new month
      const startDate = new Date(newYear, newMonth, 1).toISOString().split('T')[0]
      const endDate = new Date(newYear, newMonth + 1, 0).toISOString().split('T')[0]

      try {
        const response = await fetch(
          `/api/entries?start=${startDate}&end=${endDate}`
        )
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
      }
    },
    []
  )

  // Toggle entry completion
  const handleToggleEntry = useCallback(
    async (habitId: string, date: string, completed: boolean) => {
      // Optimistic update
      const existingEntry = entries.find(
        (e) => e.habitId === habitId && e.entryDate === date
      )

      if (existingEntry) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === existingEntry.id ? { ...e, completed } : e
          )
        )
      } else {
        const tempId = `temp-${Date.now()}`
        setEntries((prev) => [
          ...prev,
          {
            id: tempId,
            habitId,
            userId: '',
            entryDate: date,
            completed,
            value: null,
            notes: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
      }

      // Send to API
      try {
        const response = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            habitId,
            entryDate: date,
            completed,
          }),
        })

        if (response.ok) {
          const newEntry = await response.json()
          setEntries((prev) =>
            prev.map((e) =>
              (e.habitId === habitId && e.entryDate === date) ||
              e.id.startsWith('temp-')
                ? {
                    ...newEntry,
                    entryDate: new Date(newEntry.entryDate)
                      .toISOString()
                      .split('T')[0],
                  }
                : e
            )
          )
        }
      } catch (error) {
        console.error('Failed to save entry:', error)
        // Revert on error
        router.refresh()
      }
    },
    [entries, router]
  )

  // Add new habit
  const handleAddHabit = useCallback(
    async (habitData: {
      title: string
      description?: string
      category?: string
      color: string
      goalType: 'binary' | 'duration' | 'quantity'
      goalTarget?: number
      unit?: string
    }) => {
      try {
        const response = await fetch('/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(habitData),
        })

        if (response.ok) {
          const newHabit = await response.json()
          setHabits((prev) => [
            ...prev,
            {
              ...newHabit,
              createdAt:
                typeof newHabit.createdAt === 'string'
                  ? newHabit.createdAt
                  : new Date(newHabit.createdAt).toISOString(),
              updatedAt:
                typeof newHabit.updatedAt === 'string'
                  ? newHabit.updatedAt
                  : new Date(newHabit.updatedAt).toISOString(),
            },
          ])
        }
      } catch (error) {
        console.error('Failed to create habit:', error)
      }
    },
    []
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Habits</h1>
          <p className="text-zinc-400 mt-1">
            Track your daily habits and build consistency
          </p>
        </div>
        <MonthNavigator
          month={month}
          year={year}
          onChange={handleMonthChange}
        />
      </div>

      {/* Habit Grid */}
      <HabitGrid
        habits={habits}
        entries={entries}
        month={month}
        year={year}
        onToggleEntry={handleToggleEntry}
        onAddHabit={() => setIsModalOpen(true)}
      />

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddHabit}
      />
    </div>
  )
}
