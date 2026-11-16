/* ==================== ORIGINAL CODE START ====================
'use client'

import { useState, useEffect } from 'react'
import { StatsCard } from '@/components/StatsCard'
import { DonutChart } from '@/components/DonutChart'
import { ChartLine } from '@/components/ChartLine'
import { WeeklyBars } from '@/components/WeeklyBars'
import { TopHabitsList, StreakCard } from '@/components/TopHabitsList'
import { BadgeDisplay } from '@/components/BadgeDisplay'
import { MotivationalQuote } from '@/components/MotivationalQuote'
import { LayoutGrid, Target, Flame, TrendingUp, Plus } from 'lucide-react'
import type { BadgeDefinition } from '@/lib/badges'
import type { Quote } from '@/lib/quotes'
import Link from 'next/link'

interface DashboardInsightsSummary {
  overallCompletionRate: number
  totalCompleted: number
  totalPossible: number
  topHabits: Array<{
    habitId: string
    title: string
    color: string
    completionRate: number
    completedCount: number
    totalDays: number
  }>
  weekly: Array<{
    day: string
    date: string
    completed: number
    total: number
    rate: number
  }>
}

interface DashboardClientProps {
  insights: DashboardInsightsSummary
  dailyData: { date: string; value: number }[]
  bestStreak: number
  currentBestStreak: number
  habitsCount: number
  userName?: string
  badges: { name: string; awardedAt: Date | string; definition?: BadgeDefinition }[]
  allBadges: BadgeDefinition[]
  dailyQuote: Quote
  streakMessage: string
}

export function DashboardClient({
  insights,
  dailyData,
  bestStreak,
  currentBestStreak,
  habitsCount,
  userName,
  badges,
  allBadges,
  dailyQuote,
  streakMessage,
}: DashboardClientProps) {
  const completionPercentage = Math.round(insights.overallCompletionRate * 100)
  const firstName = userName?.split(' ')[0] || 'there'
  const [todayString, setTodayString] = useState('')
  const weeklyBarsData = insights.weekly.map((week) => ({
    weekStart: week.date,
    completed: week.completed,
    possible: week.total,
    completionRate: week.rate,
  }))

  useEffect(() => {
    setTodayString(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }))
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-[72px] lg:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white truncate">Welcome back, {firstName}!</h1>
          <p className="text-zinc-400 mt-0.5 sm:mt-1 text-xs sm:text-base">
            Track your progress and stay motivated
          </p>
        </div>
        <Link
          href="/habits"
          className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-bold text-zinc-900 bg-white rounded-lg sm:rounded-xl hover:bg-zinc-100 transition-all hover:-translate-y-0.5 w-full sm:w-auto shrink-0"
        >
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          Add Habit
        </Link>
      </div>

      <MotivationalQuote 
        quote={dailyQuote} 
        streakMessage={streakMessage}
        currentStreak={currentBestStreak}
      />

      <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-1">
          <h2 className="text-base sm:text-lg font-bold text-white">Today&apos;s Progress</h2>
          <span className="text-xs sm:text-sm text-zinc-400">{todayString}</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          <div className="flex-1 w-full">
            <div className="h-2 sm:h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-zinc-400">{completionPercentage}% complete today</p>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-center">
            <div>
              <div className="flex items-center gap-1 text-orange-400">
                <Flame size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-xl sm:text-2xl font-black text-white">{currentBestStreak}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-500">Day streak</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-white">{Math.round(insights.overallCompletionRate * 100)}%</span>
              <p className="text-[10px] sm:text-xs text-zinc-500">Weekly rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatsCard
          title="Active Habits"
          value={habitsCount}
          subtitle="habits being tracked"
          icon={<LayoutGrid size={18} className="sm:w-5 sm:h-5" />}
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionPercentage}%`}
          subtitle="this month"
          icon={<Target size={18} className="sm:w-5 sm:h-5" />}
        />
        <StatsCard
          title="Current Streak"
          value={currentBestStreak}
          subtitle="days in a row"
          icon={<Flame size={18} className="sm:w-5 sm:h-5" />}
        />
        <StatsCard
          title="Best Streak"
          value={bestStreak}
          subtitle="personal record"
          icon={<TrendingUp size={18} className="sm:w-5 sm:h-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
              Monthly Trend
            </h2>
            <div className="block sm:hidden">
              <ChartLine data={dailyData} height={140} />
            </div>
            <div className="hidden sm:block">
              <ChartLine data={dailyData} height={200} />
            </div>
          </div>

          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
              Weekly Overview
            </h2>
            <div className="block sm:hidden">
              <WeeklyBars data={weeklyBarsData} height={120} />
            </div>
            <div className="hidden sm:block">
              <WeeklyBars data={weeklyBarsData} height={180} />
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
              Overall Progress
            </h2>
            <div className="flex justify-center">
              <div className="scale-[0.8] sm:scale-100 origin-center">
                <DonutChart
                  completed={insights.totalCompleted}
                  total={insights.totalPossible}
                  size={150}
                />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-zinc-400">
              {insights.totalCompleted} of {insights.totalPossible} habits completed
            </div>
          </div>

          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white">Top Habits</h2>
              <Link href="/habits" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">
                View all
              </Link>
            </div>
            <TopHabitsList
              habits={insights.topHabits.slice(0, 5).map((habit) => ({
                ...habit,
                currentStreak: 0,
                longestStreak: 0,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <StreakCard
              title="Current Best"
              currentStreak={currentBestStreak}
              longestStreak={bestStreak}
              icon="flame"
            />
            <StreakCard
              title="All-time Best"
              currentStreak={bestStreak}
              longestStreak={bestStreak}
              icon="trophy"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
        <BadgeDisplay 
          earnedBadges={badges} 
          allBadges={allBadges}
        />
      </div>
    </div>
  )
}
==================== ORIGINAL CODE END ==================== */

'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { DonutChart } from '@/components/DonutChart'
import { ChartLine } from '@/components/ChartLine'
import { WeeklyBars } from '@/components/WeeklyBars'
import { TopHabitsList } from '@/components/TopHabitsList'
import { BadgeDisplay } from '@/components/BadgeDisplay'
import { Mascot, type MascotMood } from '@/components/ui/Mascot'
import { StreakFlame } from '@/components/ui/StreakFlame'
import { ProgressRing } from '@/components/ProgressRing'
import { celebrate, toast } from '@/lib/celebrate'
import { messages } from '@/lib/messages'
import {
  Sparkles,
  CheckCircle2,
  BarChart3,
  Trophy,
  Plus,
  ChevronRight,
  Heart,
  Dumbbell,
  Book,
  Flower2,
  Laptop,
  Users,
  Palette,
  Check,
} from 'lucide-react'
import type { BadgeDefinition } from '@/lib/badges'
import type { Quote } from '@/lib/quotes'
import Link from 'next/link'

interface HabitItem {
  id: string
  title: string
  description?: string | null
  color?: string
  category?: string | null
  active?: boolean
}

interface EntryItem {
  id: string
  habitId: string
  entryDate: string
  completed: boolean
}

interface DashboardInsightsSummary {
  overallCompletionRate: number
  totalCompleted: number
  totalPossible: number
  topHabits: Array<{
    habitId: string
    title: string
    color: string
    completionRate: number
    completedCount: number
    totalDays: number
  }>
  weekly: Array<{
    day: string
    date: string
    completed: number
    total: number
    rate: number
  }>
}

interface DashboardClientProps {
  insights: DashboardInsightsSummary
  dailyData: { date: string; value: number }[]
  bestStreak: number
  currentBestStreak: number
  habitsCount: number
  userName?: string
  userImageUrl?: string
  badges: { name: string; awardedAt: Date | string; definition?: BadgeDefinition }[]
  allBadges: BadgeDefinition[]
  dailyQuote: Quote
  streakMessage: string
  initialHabits?: HabitItem[]
  initialEntries?: EntryItem[]
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  health: Heart,
  fitness: Dumbbell,
  learning: Book,
  mindfulness: Flower2,
  productivity: Laptop,
  social: Users,
  creative: Palette,
}

function getHabitIcon(habit: HabitItem) {
  const cat = (habit.category || '').toLowerCase()
  return CATEGORY_ICONS[cat] || Sparkles
}

export function DashboardClient({
  insights,
  dailyData,
  bestStreak,
  currentBestStreak,
  habitsCount: _habitsCount,
  userName,
  badges,
  allBadges,
  dailyQuote,
  initialHabits = [],
  initialEntries = [],
}: DashboardClientProps) {
  const firstName = userName?.split(' ')[0] || 'Friend'
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const [habits] = useState<HabitItem[]>(initialHabits)
  const [entries, setEntries] = useState<EntryItem[]>(initialEntries)

  const activeHabits = useMemo(
    () => habits.filter((h) => h.active !== false),
    [habits]
  )
  const todayTotal = activeHabits.length

  const doneToday = useMemo(() => {
    const ids = new Set(
      entries
        .filter((e) => e.completed && e.entryDate.split('T')[0] === today)
        .map((e) => e.habitId)
    )
    return ids
  }, [entries, today])

  const todayCompleted = activeHabits.filter((h) => doneToday.has(h.id)).length
  const progress = todayTotal > 0 ? todayCompleted / todayTotal : 0
  const monthRate = Math.round((insights.overallCompletionRate || 0) * 100)

  // Determine Sparky's mood following time of day and progress (like mobile app)
  const [hour, setHour] = useState(12)
  useEffect(() => {
    setHour(new Date().getHours())
  }, [])

  const mood: MascotMood = useMemo(() => {
    if (todayTotal > 0 && todayCompleted >= todayTotal) return 'celebrate'
    if (hour >= 22 || hour < 5) return 'sleeping'
    if (hour >= 18 && todayTotal > 0 && todayCompleted === 0) return 'sad'
    if (currentBestStreak >= 3) return 'streak'
    return 'happy'
  }, [todayTotal, todayCompleted, hour, currentBestStreak])

  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Toggle entry on web
  const handleToggle = useCallback(
    async (habit: HabitItem) => {
      const willBeCompleted = !doneToday.has(habit.id)

      // Optimistic update
      setEntries((prev) => {
        const existing = prev.find(
          (e) => e.habitId === habit.id && e.entryDate.split('T')[0] === today
        )
        if (existing) {
          return prev.map((e) =>
            e.id === existing.id ? { ...e, completed: willBeCompleted } : e
          )
        }
        return [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            habitId: habit.id,
            entryDate: today,
            completed: willBeCompleted,
          },
        ]
      })

      // If user completes the last habit of the day, trigger Duolingo-style celebration!
      if (willBeCompleted && todayCompleted + 1 >= todayTotal && todayTotal > 0) {
        celebrate({
          title: 'Flawless day!',
          message: messages.allDone(),
          mood: 'celebrate',
          highlight: `${todayTotal}/${todayTotal} Habits Done`,
          highlightIcon: 'checkmark',
        })
      } else if (willBeCompleted) {
        toast(`✨ Checked off “${habit.title}”`)
      }

      // API request to persist (no changes to API contract)
      try {
        await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            habitId: habit.id,
            entryDate: today,
            completed: willBeCompleted,
          }),
        })
      } catch (err) {
        console.error('Failed to toggle habit:', err)
      }
    },
    [doneToday, today, todayCompleted, todayTotal]
  )

  const weeklyBarsData = insights.weekly.map((week) => ({
    weekStart: week.date,
    completed: week.completed,
    possible: week.total,
    completionRate: week.rate,
  }))

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      {/* Warm Greeting Header with Sparky */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18181d] via-[#141418] to-[#101014] border border-[#232328] p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              FocusFlow Day Tracker
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {greeting},{' '}
              <span className="text-gradient">{firstName}</span> 👋
            </h1>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              {messages.greetingLine(todayCompleted, todayTotal)}
            </p>
          </div>

          <div className="flex items-center justify-center shrink-0 pr-2">
            <Mascot mood={mood} size={130} />
          </div>
        </div>
      </div>

      {/* Quick Stats Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Streak tile with dynamic flame asset */}
        <div className="rounded-2xl bg-[#131316] border border-[#232328] p-4 md:p-5 flex flex-col justify-between hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Day streak</span>
            <StreakFlame days={currentBestStreak} size={28} />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-white">
              {currentBestStreak}
            </span>
            <p className="text-xs text-orange-400/90 font-semibold mt-0.5">
              {currentBestStreak >= 3 ? 'Fire is blazingly hot!' : 'Keep showing up'}
            </p>
          </div>
        </div>

        {/* Today's habits */}
        <div className="rounded-2xl bg-[#131316] border border-[#232328] p-4 md:p-5 flex flex-col justify-between hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Today</span>
            <CheckCircle2 className="w-6 h-6 text-orange-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-white">
              {todayCompleted}/{todayTotal}
            </span>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              habits completed
            </p>
          </div>
        </div>

        {/* This month completion rate */}
        <div className="rounded-2xl bg-[#131316] border border-[#232328] p-4 md:p-5 flex flex-col justify-between hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">This month</span>
            <BarChart3 className="w-6 h-6 text-orange-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-white">
              {monthRate}%
            </span>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              overall rate
            </p>
          </div>
        </div>

        {/* Best streak */}
        <div className="rounded-2xl bg-[#131316] border border-[#232328] p-4 md:p-5 flex flex-col justify-between hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Best Record</span>
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-black text-white">
              {bestStreak} days
            </span>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              personal best
            </p>
          </div>
        </div>
      </div>

      {/* Today's Progress Card (Signature glowing ring + check dots) */}
      {todayTotal > 0 && (
        <div className="rounded-3xl bg-[#131316] border border-[#232328] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Daily Milestone</span>
              <h2 className="text-2xl font-black text-white mt-1">
                {todayCompleted} of {todayTotal} habits checked
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {todayCompleted === todayTotal
                  ? 'All completed! Outstanding work today.'
                  : `${todayTotal - todayCompleted} habit${todayTotal - todayCompleted > 1 ? 's' : ''} left to complete.`}
              </p>
            </div>

            {/* Check dots row */}
            <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap pt-1">
              {activeHabits.slice(0, 10).map((h) => {
                const isDone = doneToday.has(h.id)
                return (
                  <div
                    key={h.id}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                        : 'border-2 border-zinc-700 bg-transparent text-transparent'
                    }`}
                    title={h.title}
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                )
              })}
              {activeHabits.length > 10 && (
                <span className="text-xs text-zinc-500 font-bold ml-1">
                  +{activeHabits.length - 10}
                </span>
              )}
            </div>
          </div>

          <div className="relative shrink-0 flex items-center justify-center">
            <div
              className="rounded-full transition-shadow duration-500"
              style={{
                boxShadow: `0 0 ${16 + progress * 30}px rgba(249, 115, 22, ${0.15 + progress * 0.4})`,
              }}
            >
              <ProgressRing
                size={110}
                strokeWidth={12}
                progress={progress}
                trackColor="#232328"
                knob
              >
                <span className="text-xl font-black text-white">
                  {Math.round(progress * 100)}%
                </span>
              </ProgressRing>
            </div>
          </div>
        </div>
      )}

      {/* Your Habits Section (1-tap completion list) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">Your Habits</h2>
            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold">
              {activeHabits.length}
            </span>
          </div>
          <Link
            href="/habits"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-[0_2px_12px_rgba(249,115,22,0.3)] transition-transform hover:-translate-y-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Habit
          </Link>
        </div>

        {activeHabits.length === 0 ? (
          <div className="rounded-3xl bg-[#131316] border border-[#232328] p-8 flex flex-col items-center text-center space-y-3">
            <Mascot mood="sleeping" size={130} />
            <h3 className="text-lg font-bold text-white">No habits yet</h3>
            <p className="text-sm text-zinc-400 max-w-sm">
              Add one small habit to light your first spark with Sparky.
            </p>
            <Link
              href="/habits"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-[0_2px_12px_rgba(249,115,22,0.3)] transition-transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Create First Habit
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeHabits.map((habit) => {
              const isDone = doneToday.has(habit.id)
              const IconComp = getHabitIcon(habit)
              const color = habit.color || '#f97316'

              return (
                <div
                  key={habit.id}
                  onClick={() => handleToggle(habit)}
                  className={`group cursor-pointer rounded-2xl p-4 bg-[#131316] border transition-all duration-200 flex items-center justify-between gap-4 ${
                    isDone
                      ? 'border-[#232328] opacity-80'
                      : 'border-[#232328] hover:border-orange-500/40 hover:bg-[#18181d]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${color}20`,
                        color: color,
                      }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-base font-bold truncate transition-all ${
                          isDone ? 'line-through text-zinc-500' : 'text-white'
                        }`}
                      >
                        {habit.title}
                      </p>
                      {currentBestStreak > 0 && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <StreakFlame days={currentBestStreak} size={15} />
                          <span className="text-xs font-bold text-orange-400">
                            {currentBestStreak} day streak
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1-Tap Checkbox */}
                  <button
                    type="button"
                    aria-label={`Toggle ${habit.title}`}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      isDone
                        ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.45)]'
                        : 'border-2 border-zinc-700 hover:border-orange-500 text-transparent'
                    }`}
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Motivational Quote with Sparkles */}
      <div className="rounded-3xl bg-[#131316] border border-[#232328] p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 text-orange-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm md:text-base text-zinc-300 italic font-medium">
            “{dailyQuote.text}”
          </p>
          <p className="text-xs font-bold text-orange-400">— {dailyQuote.author}</p>
        </div>
      </div>

      {/* Main Content Grid: Charts & Analytics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Monthly Trend & Weekly Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#131316] rounded-3xl border border-[#232328] p-5 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-white mb-4">
              Monthly Trend
            </h2>
            <div className="block sm:hidden">
              <ChartLine data={dailyData} height={140} />
            </div>
            <div className="hidden sm:block">
              <ChartLine data={dailyData} height={200} />
            </div>
          </div>

          <div className="bg-[#131316] rounded-3xl border border-[#232328] p-5 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-white mb-4">
              Weekly Overview
            </h2>
            <div className="block sm:hidden">
              <WeeklyBars data={weeklyBarsData} height={120} />
            </div>
            <div className="hidden sm:block">
              <WeeklyBars data={weeklyBarsData} height={180} />
            </div>
          </div>
        </div>

        {/* Right Column: Donut progress & Top habits */}
        <div className="space-y-6">
          <div className="bg-[#131316] rounded-3xl border border-[#232328] p-5 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-white mb-4">
              Overall Progress
            </h2>
            <div className="flex justify-center">
              <DonutChart
                completed={insights.totalCompleted}
                total={insights.totalPossible}
                size={150}
              />
            </div>
            <div className="mt-4 text-center text-xs md:text-sm text-zinc-400 font-medium">
              {insights.totalCompleted} of {insights.totalPossible} habits completed
            </div>
          </div>

          <div className="bg-[#131316] rounded-3xl border border-[#232328] p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-white">Top Habits</h2>
              <Link
                href="/habits"
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
              >
                View all
              </Link>
            </div>
            <TopHabitsList
              habits={insights.topHabits.slice(0, 5).map((habit) => ({
                ...habit,
                currentStreak: 0,
                longestStreak: 0,
              }))}
            />
          </div>

          {/* Badges preview link */}
          <Link
            href="/achievements"
            className="group block rounded-3xl bg-[#131316] border border-[#232328] hover:border-orange-500/40 p-5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">Badges & Challenges</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {badges.length} of {allBadges.length} unlocked
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
          </Link>
        </div>
      </div>

      {/* Badges Display Section */}
      <div className="bg-[#131316] rounded-3xl border border-[#232328] p-6">
        <BadgeDisplay earnedBadges={badges} allBadges={allBadges} />
      </div>
    </div>
  )
}
