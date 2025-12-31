'use client'

import { useState, useCallback, useMemo } from 'react'
import { HabitGrid } from '@/components/HabitGrid'
import { AddHabitModal } from '@/components/AddHabitModal'
import { AddHabitWithAI } from '@/components/AddHabitWithAI'
import { MonthNavigator } from '@/components/MonthNavigator'
import { TemplatePicker } from '@/components/TemplatePicker'
import { useRouter } from 'next/navigation'
import { Filter, SortAsc, Archive, RotateCcw, Sparkles, X, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HabitTemplate } from '@/lib/templates'

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
  archivedHabits?: Habit[]
}

type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'category'
type FilterCategory = string | null

export function HabitsClient({
  initialHabits,
  initialEntries,
  initialMonth,
  initialYear,
  archivedHabits: initialArchivedHabits = [],
}: HabitsClientProps) {
  const router = useRouter()
  const [habits, setHabits] = useState(initialHabits)
  const [archivedHabits, setArchivedHabits] = useState(initialArchivedHabits)
  const [entries, setEntries] = useState(initialEntries)
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  
  // Filter and Sort states
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterCategory, setFilterCategory] = useState<FilterCategory>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Get unique categories from habits
  const categories = useMemo(() => {
    const cats = new Set<string>()
    habits.forEach((h) => h.category && cats.add(h.category))
    return Array.from(cats)
  }, [habits])

  // Filter and sort habits
  const filteredAndSortedHabits = useMemo(() => {
    let result = [...habits]
    
    // Apply category filter
    if (filterCategory) {
      result = result.filter((h) => h.category === filterCategory)
    }
    
    // Apply sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'category':
        result.sort((a, b) => (a.category || '').localeCompare(b.category || ''))
        break
    }
    
    return result
  }, [habits, filterCategory, sortBy])

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

  // Add habit from template
  const handleAddFromTemplate = useCallback(
    async (template: HabitTemplate) => {
      await handleAddHabit({
        title: template.title,
        description: template.description,
        category: template.category,
        color: template.color,
        goalType: template.goalType,
        goalTarget: template.goalTarget,
        unit: template.unit,
      })
    },
    [handleAddHabit]
  )

  // Archive habit
  const handleArchiveHabit = useCallback(
    async (habitId: string) => {
      try {
        const response = await fetch(`/api/habits/${habitId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: false }),
        })

        if (response.ok) {
          const habit = habits.find((h) => h.id === habitId)
          if (habit) {
            setHabits((prev) => prev.filter((h) => h.id !== habitId))
            setArchivedHabits((prev) => [...prev, { ...habit, active: false }])
          }
        }
      } catch (error) {
        console.error('Failed to archive habit:', error)
      }
    },
    [habits]
  )

  // Restore habit
  const handleRestoreHabit = useCallback(
    async (habitId: string) => {
      try {
        const response = await fetch(`/api/habits/${habitId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: true }),
        })

        if (response.ok) {
          const habit = archivedHabits.find((h) => h.id === habitId)
          if (habit) {
            setArchivedHabits((prev) => prev.filter((h) => h.id !== habitId))
            setHabits((prev) => [...prev, { ...habit, active: true }])
          }
        }
      } catch (error) {
        console.error('Failed to restore habit:', error)
      }
    },
    [archivedHabits]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Habits</h1>
          <p className="text-zinc-400 mt-1">
            Track your daily habits and build consistency
          </p>
        </div>
        <div className="flex items-center gap-3">
          <MonthNavigator
            month={month}
            year={year}
            onChange={handleMonthChange}
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* AI Create Button */}
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-violet-400 bg-violet-500/10 rounded-lg hover:bg-violet-500/20 transition-colors"
        >
          <Wand2 size={16} />
          Add with AI
        </button>

        {/* Template Button */}
        <button
          onClick={() => setIsTemplatePickerOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-400 bg-amber-400/10 rounded-lg hover:bg-amber-400/20 transition-colors"
        >
          <Sparkles size={16} />
          Templates
        </button>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            showFilters || filterCategory
              ? 'text-white bg-zinc-700'
              : 'text-zinc-400 bg-zinc-800 hover:text-white'
          )}
        >
          <Filter size={16} />
          Filter
          {filterCategory && (
            <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded">1</span>
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              const options: SortOption[] = ['newest', 'oldest', 'alphabetical', 'category']
              const currentIndex = options.indexOf(sortBy)
              setSortBy(options[(currentIndex + 1) % options.length])
            }}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-400 bg-zinc-800 rounded-lg hover:text-white transition-colors"
          >
            <SortAsc size={16} />
            {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          </button>
        </div>

        {/* Archive Toggle */}
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            showArchived
              ? 'text-white bg-zinc-700'
              : 'text-zinc-400 bg-zinc-800 hover:text-white'
          )}
        >
          <Archive size={16} />
          Archived ({archivedHabits.length})
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <span className="text-sm text-zinc-400">Category:</span>
          <button
            onClick={() => setFilterCategory(null)}
            className={cn(
              'px-3 py-1 text-sm rounded-lg transition-colors',
              !filterCategory
                ? 'bg-white text-zinc-900'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                'px-3 py-1 text-sm rounded-lg transition-colors',
                filterCategory === cat
                  ? 'bg-white text-zinc-900'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              )}
            >
              {cat}
            </button>
          ))}
          {filterCategory && (
            <button
              onClick={() => setFilterCategory(null)}
              className="p-1 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Archived Habits Section */}
      {showArchived && archivedHabits.length > 0 && (
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Archive size={18} />
            Archived Habits
          </h3>
          <div className="space-y-2">
            {archivedHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="text-zinc-300">{habit.title}</span>
                  {habit.category && (
                    <span className="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded">
                      {habit.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRestoreHabit(habit.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 rounded-lg transition-colors"
                >
                  <RotateCcw size={14} />
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Habit Grid */}
      <HabitGrid
        habits={filteredAndSortedHabits}
        entries={entries}
        month={month}
        year={year}
        onToggleEntry={handleToggleEntry}
        onAddHabit={() => setIsModalOpen(true)}
        onArchiveHabit={handleArchiveHabit}
      />

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddHabit}
      />

      {/* AI Habit Creator Modal */}
      <AddHabitWithAI
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSubmit={handleAddHabit}
      />

      {/* Template Picker */}
      <TemplatePicker
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        onSelect={handleAddFromTemplate}
      />
    </div>
  )
}
