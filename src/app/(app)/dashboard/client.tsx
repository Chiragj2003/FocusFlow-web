'use client'

import { StatsCard } from '@/components/StatsCard'
import { DonutChart } from '@/components/DonutChart'
import { ChartLine } from '@/components/ChartLine'
import { WeeklyBars } from '@/components/WeeklyBars'
import { TopHabitsList, StreakCard } from '@/components/TopHabitsList'
import { LayoutGrid, Target, Flame, TrendingUp } from 'lucide-react'
import type { InsightsSummary } from '@/lib/analytics'

interface DashboardClientProps {
  insights: InsightsSummary
  dailyData: { date: string; value: number }[]
  bestStreak: number
  currentBestStreak: number
  habitsCount: number
}

export function DashboardClient({
  insights,
  dailyData,
  bestStreak,
  currentBestStreak,
  habitsCount,
}: DashboardClientProps) {
  const completionPercentage = Math.round(insights.overallCompletionRate * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and stay motivated
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Monthly Trend
            </h2>
            <ChartLine data={dailyData} height={250} />
          </div>

          {/* Weekly Overview */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Weekly Overview
            </h2>
            <WeeklyBars data={insights.weekly} height={200} />
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Donut Chart */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Overall Progress
            </h2>
            <div className="flex justify-center">
              <DonutChart
                completed={insights.totalCompleted}
                total={insights.totalPossible}
                size={180}
              />
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {insights.totalCompleted} of {insights.totalPossible} habits completed
            </div>
          </div>

          {/* Top Habits */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Top Habits
            </h2>
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
    </div>
  )
}
