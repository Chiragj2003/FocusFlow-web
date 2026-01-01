'use client'

import { useState, useCallback, useMemo } from 'react'
import { HabitGrid } from '@/components/HabitGrid'
import { AddHabitModal } from '@/components/AddHabitModal'
import { AddHabitWithAI } from '@/components/AddHabitWithAI'
import { MonthNavigator } from '@/components/MonthNavigator'
import { TemplatePicker } from '@/components/TemplatePicker'
import { FocusTimer } from '@/components/FocusTimer'
import { ChallengeBrowser } from '@/components/ChallengeBrowser'
import { useRouter } from 'next/navigation'
import { Filter, SortAsc, Archive, RotateCcw, Sparkles, X, Wand2, Timer, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HabitTemplate } from '@/lib/templates'
import type { ChallengeTemplate } from '@/lib/challenges'

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
  const [isTimerOpen, setIsTimerOpen] = useState(false)
  const [timerHabit, setTimerHabit] = useState<Habit | null>(null)
  const [isChallengeBrowserOpen, setIsChallengeBrowserOpen] = useState(false)
  
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

      // Fetch entries for the new month - use local date formatting
      const startYear = newYear
      const startMonth = String(newMonth + 1).padStart(2, '0')
      const startDate = `${startYear}-${startMonth}-01`
      const lastDay = new Date(newYear, newMonth + 1, 0).getDate()
      const endDate = `${startYear}-${startMonth}-${String(lastDay).padStart(2, '0')}`

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
                  : new Date(e.entryDate).toLocaleDateString('en-CA'), // 'en-CA' gives YYYY-MM-DD format
            }))
          )
        }
      } catch (error) {
        console.error('Failed to fetch entries:', error)
      }
    },
    []
  )

  // Toggle entry completion - optimized for instant feedback
  const handleToggleEntry = useCallback(
    (habitId: string, date: string, completed: boolean) => {
      // Instant optimistic update - no async wait
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

      // Fire-and-forget API call - don't wait for response
      fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitId,
          entryDate: date,
          completed,
        }),
      }).catch((error) => {
        console.error('Failed to save entry:', error)
        // Revert on error
        router.refresh()
      })
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

  // Start a challenge - add all habits from the challenge
  const handleStartChallenge = useCallback(
    async (challenge: ChallengeTemplate) => {
      for (const habit of challenge.habits) {
        await handleAddHabit({
          title: habit.title,
          description: habit.description,
          category: habit.category,
          color: habit.color,
          goalType: habit.goalType,
          goalTarget: habit.goalTarget,
          unit: habit.unit,
        })
      }
    },
    [handleAddHabit]
  )

  // Handle timer completion
  const handleTimerComplete = useCallback(
    async (duration: number) => {
      if (!timerHabit) return
      
      const today = new Date().toISOString().split('T')[0]
      try {
        await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            habitId: timerHabit.id,
            entryDate: today,
            completed: true,
            value: duration,
            duration: duration,
          }),
        })
        router.refresh()
      } catch (error) {
        console.error('Failed to save timer entry:', error)
      }
    },
    [timerHabit, router]
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

  // Delete habit permanently
  const handleDeleteHabit = useCallback(
    async (habitId: string) => {
      try {
        const response = await fetch(`/api/habits/${habitId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setHabits((prev) => prev.filter((h) => h.id !== habitId))
          setArchivedHabits((prev) => prev.filter((h) => h.id !== habitId))
          // Also remove entries for this habit from state
          setEntries((prev) => prev.filter((e) => e.habitId !== habitId))
        }
      } catch (error) {
        console.error('Failed to delete habit:', error)
      }
    },
    []
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
    <div className="space-y-4 sm:space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Habits</h1>
          <p className="text-zinc-400 mt-0.5 sm:mt-1 text-xs sm:text-base">
            Track your daily habits and build consistency
          </p>
        </div>
        <div className="flex items-center">
          <MonthNavigator
            month={month}
            year={year}
            onChange={handleMonthChange}
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* AI Create Button */}
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-violet-400 bg-violet-500/10 rounded-lg hover:bg-violet-500/20 transition-colors"
        >
          <Wand2 size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Add with</span> AI
        </button>

        {/* Template Button */}
        <button
          onClick={() => setIsTemplatePickerOpen(true)}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-amber-400 bg-amber-400/10 rounded-lg hover:bg-amber-400/20 transition-colors"
        >
          <Sparkles size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Templates</span>
        </button>

        {/* Challenges Button */}
        <button
          onClick={() => setIsChallengeBrowserOpen(true)}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-emerald-400 bg-emerald-400/10 rounded-lg hover:bg-emerald-400/20 transition-colors"
        >
          <Trophy size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Challenges</span>
        </button>

        {/* Focus Timer Button */}
        <button
          onClick={() => {
            // Use first duration-based habit or just open generic timer
            const durationHabit = habits.find(h => h.goalType === 'duration')
            setTimerHabit(durationHabit || null)
            setIsTimerOpen(true)
          }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-rose-400 bg-rose-400/10 rounded-lg hover:bg-rose-400/20 transition-colors"
        >
          <Timer size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Timer</span>
        </button>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors',
            showFilters || filterCategory
              ? 'text-white bg-zinc-700'
              : 'text-zinc-400 bg-zinc-800 hover:text-white'
          )}
        >
          <Filter size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Filter</span>
          {filterCategory && (
            <span className="px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs bg-white/20 rounded">1</span>
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
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-400 bg-zinc-800 rounded-lg hover:text-white transition-colors"
          >
            <SortAsc size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
          </button>
        </div>

        {/* Archive Toggle */}
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={cn(
            'inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors',
            showArchived
              ? 'text-white bg-zinc-700'
              : 'text-zinc-400 bg-zinc-800 hover:text-white'
          )}
        >
          <Archive size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Archived</span> ({archivedHabits.length})
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <span className="text-xs sm:text-sm text-zinc-400">Category:</span>
          <button
            onClick={() => setFilterCategory(null)}
            className={cn(
              'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors',
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
                'px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors',
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
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      )}

      {/* Archived Habits Section */}
      {showArchived && archivedHabits.length > 0 && (
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Archive size={16} className="sm:w-[18px] sm:h-[18px]" />
            Archived Habits
          </h3>
          <div className="space-y-2">
            {archivedHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-2 sm:p-3 bg-zinc-800/50 rounded-lg gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="text-xs sm:text-sm text-zinc-300 truncate">{habit.title}</span>
                  {habit.category && (
                    <span className="hidden sm:inline text-xs text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded shrink-0">
                      {habit.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRestoreHabit(habit.id)}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 rounded-lg transition-colors shrink-0"
                >
                  <RotateCcw size={12} className="sm:w-[14px] sm:h-[14px]" />
                  <span className="hidden sm:inline">Restore</span>
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
        onDeleteHabit={handleDeleteHabit}
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

      {/* Focus Timer Modal */}
      <FocusTimer
        isOpen={isTimerOpen}
        onClose={() => {
          setIsTimerOpen(false)
          setTimerHabit(null)
        }}
        habitId={timerHabit?.id}
        habitTitle={timerHabit?.title}
        onComplete={handleTimerComplete}
      />

      {/* Challenge Browser Modal */}
      <ChallengeBrowser
        isOpen={isChallengeBrowserOpen}
        onClose={() => setIsChallengeBrowserOpen(false)}
        onStartChallenge={handleStartChallenge}
      />
    </div>
  )
}
