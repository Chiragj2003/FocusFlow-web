'use client'

import { StatsCard } from '@/components/StatsCard'
import { DonutChart } from '@/components/DonutChart'
import { ChartLine } from '@/components/ChartLine'
import { WeeklyBars } from '@/components/WeeklyBars'
import { TopHabitsList, StreakCard } from '@/components/TopHabitsList'
import { BadgeDisplay } from '@/components/BadgeDisplay'
import { MotivationalQuote } from '@/components/MotivationalQuote'
import { LayoutGrid, Target, Flame, TrendingUp, Plus } from 'lucide-react'
import type { InsightsSummary } from '@/lib/analytics'
import type { BadgeDefinition } from '@/lib/badges'
import type { Quote } from '@/lib/quotes'
import Link from 'next/link'

interface DashboardClientProps {
  insights: InsightsSummary
  dailyData: { date: string; value: number }[]
  bestStreak: number
  currentBestStreak: number
  habitsCount: number
  userName?: string
  badges: { name: string; awardedAt: Date; definition?: BadgeDefinition }[]
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

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-14 lg:pt-0">
      {/* Header */}
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

      {/* Motivational Quote */}
      <MotivationalQuote 
        quote={dailyQuote} 
        streakMessage={streakMessage}
        currentStreak={currentBestStreak}
      />

      {/* Today's Progress Card */}
      <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-1">
          <h2 className="text-base sm:text-lg font-bold text-white">Today&apos;s Progress</h2>
          <span className="text-xs sm:text-sm text-zinc-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
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

      {/* Stats Grid */}
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

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Monthly Trend */}
          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
              Monthly Trend
            </h2>
            <ChartLine data={dailyData} height={200} />
          </div>

          {/* Weekly Overview */}
          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
              Weekly Overview
            </h2>
            <WeeklyBars data={insights.weekly} height={180} />
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-4 sm:space-y-6">
          {/* Donut Chart */}
          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
              Overall Progress
            </h2>
            <div className="flex justify-center">
              <DonutChart
                completed={insights.totalCompleted}
                total={insights.totalPossible}
                size={150}
              />
            </div>
            <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-zinc-400">
              {insights.totalCompleted} of {insights.totalPossible} habits completed
            </div>
          </div>

          {/* Top Habits */}
          <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white">Top Habits</h2>
              <Link href="/habits" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">
                View all
              </Link>
            </div>
            <TopHabitsList habits={insights.topHabits.slice(0, 5)} />
          </div>

          {/* Streaks */}
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

      {/* Badges Section */}
      <div className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm">
        <BadgeDisplay 
          earnedBadges={badges} 
          allBadges={allBadges}
        />
      </div>
    </div>
  )
}
