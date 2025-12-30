'use client'

import { StatsCard } from '@/components/StatsCard'
import { DonutChart } from '@/components/DonutChart'
import { ChartLine } from '@/components/ChartLine'
import { WeeklyBars } from '@/components/WeeklyBars'
import { TopHabitsList, StreakCard } from '@/components/TopHabitsList'
import { BadgeDisplay } from '@/components/BadgeDisplay'
import { MotivationalQuote } from '@/components/MotivationalQuote'
import { LayoutGrid, Target, Flame, TrendingUp, Plus, Award } from 'lucide-react'
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Welcome back, {firstName}!</h1>
          <p className="text-zinc-400 mt-1">
            Track your progress and stay motivated
          </p>
        </div>
        <Link
          href="/habits"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-zinc-900 bg-white rounded-xl hover:bg-zinc-100 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} />
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
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Today&apos;s Progress</h2>
          <span className="text-sm text-zinc-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-zinc-400">{completionPercentage}% complete today</p>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
              <div className="flex items-center gap-1 text-orange-400">
                <Flame size={18} />
                <span className="text-2xl font-black text-white">{currentBestStreak}</span>
              </div>
              <p className="text-xs text-zinc-500">Day streak</p>
            </div>
            <div>
              <span className="text-2xl font-black text-white">{Math.round(insights.overallCompletionRate * 100)}%</span>
              <p className="text-xs text-zinc-500">Weekly rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Habits"
          value={habitsCount}
          subtitle="habits being tracked"
          icon={<LayoutGrid size={20} />}
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionPercentage}%`}
          subtitle="this month"
          icon={<Target size={20} />}
        />
        <StatsCard
          title="Current Streak"
          value={currentBestStreak}
          subtitle="days in a row"
          icon={<Flame size={20} />}
        />
        <StatsCard
          title="Best Streak"
          value={bestStreak}
          subtitle="personal record"
          icon={<TrendingUp size={20} />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Trend */}
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4">
              Monthly Trend
            </h2>
            <ChartLine data={dailyData} height={250} />
          </div>

          {/* Weekly Overview */}
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4">
              Weekly Overview
            </h2>
            <WeeklyBars data={insights.weekly} height={200} />
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Donut Chart */}
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4">
              Overall Progress
            </h2>
            <div className="flex justify-center">
              <DonutChart
                completed={insights.totalCompleted}
                total={insights.totalPossible}
                size={180}
              />
            </div>
            <div className="mt-4 text-center text-sm text-zinc-400">
              {insights.totalCompleted} of {insights.totalPossible} habits completed
            </div>
          </div>

          {/* Top Habits */}
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Top Habits</h2>
              <Link href="/habits" className="text-sm text-zinc-400 hover:text-white transition-colors">
                View all
              </Link>
            </div>
            <TopHabitsList habits={insights.topHabits.slice(0, 5)} />
          </div>

          {/* Streaks */}
          <div className="grid grid-cols-2 gap-4">
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
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm">
        <BadgeDisplay 
          earnedBadges={badges} 
          allBadges={allBadges}
        />
      </div>
    </div>
  )
}
