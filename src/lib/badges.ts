// Badge System - Definitions and Logic
import prisma from './db'

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: 'streak' | 'completion' | 'milestone' | 'special'
  requirement: number // The threshold to earn this badge
}

// All available badges
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Streak Badges
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7 day streak on any habit',
    icon: '🔥',
    color: '#f59e0b',
    category: 'streak',
    requirement: 7,
  },
  {
    id: 'streak_14',
    name: 'Fortnight Fighter',
    description: '14 day streak on any habit',
    icon: '⚡',
    color: '#f97316',
    category: 'streak',
    requirement: 14,
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: '30 day streak on any habit',
    icon: '🏆',
    color: '#eab308',
    category: 'streak',
    requirement: 30,
  },
  {
    id: 'streak_60',
    name: 'Habit Hero',
    description: '60 day streak on any habit',
    icon: '💎',
    color: '#06b6d4',
    category: 'streak',
    requirement: 60,
  },
  {
    id: 'streak_100',
    name: 'Century Champion',
    description: '100 day streak on any habit',
    icon: '👑',
    color: '#a855f7',
    category: 'streak',
    requirement: 100,
  },
  {
    id: 'streak_365',
    name: 'Year Legend',
    description: '365 day streak on any habit',
    icon: '🌟',
    color: '#ec4899',
    category: 'streak',
    requirement: 365,
  },

  // Completion Badges
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: '100% completion for 7 consecutive days',
    icon: '✨',
    color: '#22c55e',
    category: 'completion',
    requirement: 7,
  },
  {
    id: 'perfect_month',
    name: 'Perfect Month',
    description: '100% completion for an entire month',
    icon: '🌙',
    color: '#3b82f6',
    category: 'completion',
    requirement: 30,
  },

  // Milestone Badges
  {
    id: 'first_habit',
    name: 'First Step',
    description: 'Created your first habit',
    icon: '🚀',
    color: '#10b981',
    category: 'milestone',
    requirement: 1,
  },
  {
    id: 'five_habits',
    name: 'Habit Builder',
    description: 'Created 5 habits',
    icon: '🎯',
    color: '#6366f1',
    category: 'milestone',
    requirement: 5,
  },
  {
    id: 'ten_habits',
    name: 'Habit Architect',
    description: 'Created 10 habits',
    icon: '🏗️',
    color: '#8b5cf6',
    category: 'milestone',
    requirement: 10,
  },
  {
    id: 'completions_50',
    name: 'Getting Started',
    description: 'Completed 50 habit entries',
    icon: '📈',
    color: '#14b8a6',
    category: 'milestone',
    requirement: 50,
  },
  {
    id: 'completions_100',
    name: 'Centurion',
    description: 'Completed 100 habit entries',
    icon: '💯',
    color: '#f43f5e',
    category: 'milestone',
    requirement: 100,
  },
  {
    id: 'completions_500',
    name: 'Dedication',
    description: 'Completed 500 habit entries',
    icon: '🎖️',
    color: '#d946ef',
    category: 'milestone',
    requirement: 500,
  },
  {
    id: 'completions_1000',
    name: 'Habit Master',
    description: 'Completed 1000 habit entries',
    icon: '🏅',
    color: '#fbbf24',
    category: 'milestone',
    requirement: 1000,
  },

  // Special Badges
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Joined FocusFlow',
    icon: '🐦',
    color: '#0ea5e9',
    category: 'special',
    requirement: 1,
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Resumed tracking after 7+ days break',
    icon: '💪',
    color: '#84cc16',
    category: 'special',
    requirement: 7,
  },
]

// Get badge definition by ID
export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.id === id)
}

// Get all badges for a user
export async function getUserBadges(userId: string) {
  const badges = await prisma.badge.findMany({
    where: { userId },
    orderBy: { awardedAt: 'desc' },
  })

  return badges.map((badge: { id: string; userId: string; name: string; metadata: unknown; awardedAt: Date }) => ({
    ...badge,
    definition: getBadgeById(badge.name),
  }))
}

// Check and award streak badges
export async function checkStreakBadges(
  userId: string,
  currentStreak: number,
  longestStreak: number
): Promise<BadgeDefinition[]> {
  const streakBadges = BADGE_DEFINITIONS.filter((b) => b.category === 'streak')
  const awarded: BadgeDefinition[] = []

  for (const badge of streakBadges) {
    if (longestStreak >= badge.requirement) {
      const exists = await prisma.badge.findFirst({
        where: { userId, name: badge.id },
      })

      if (!exists) {
        await prisma.badge.create({
          data: {
            userId,
            name: badge.id,
            metadata: { streak: longestStreak },
          },
        })
        awarded.push(badge)
      }
    }
  }

  return awarded
}

// Check and award milestone badges
export async function checkMilestoneBadges(userId: string): Promise<BadgeDefinition[]> {
  const awarded: BadgeDefinition[] = []

  // Check habit count badges
  const habitCount = await prisma.habit.count({ where: { userId } })
  const habitBadges = [
    { id: 'first_habit', requirement: 1 },
    { id: 'five_habits', requirement: 5 },
    { id: 'ten_habits', requirement: 10 },
  ]

  for (const { id, requirement } of habitBadges) {
    if (habitCount >= requirement) {
      const exists = await prisma.badge.findFirst({
        where: { userId, name: id },
      })

      if (!exists) {
        await prisma.badge.create({
          data: {
            userId,
            name: id,
            metadata: { habitCount },
          },
        })
        const badge = getBadgeById(id)
        if (badge) awarded.push(badge)
      }
    }
  }

  // Check completion count badges
  const completionCount = await prisma.habitEntry.count({
    where: { userId, completed: true },
  })
  const completionBadges = [
    { id: 'completions_50', requirement: 50 },
    { id: 'completions_100', requirement: 100 },
    { id: 'completions_500', requirement: 500 },
    { id: 'completions_1000', requirement: 1000 },
  ]

  for (const { id, requirement } of completionBadges) {
    if (completionCount >= requirement) {
      const exists = await prisma.badge.findFirst({
        where: { userId, name: id },
      })

      if (!exists) {
        await prisma.badge.create({
          data: {
            userId,
            name: id,
            metadata: { completionCount },
          },
        })
        const badge = getBadgeById(id)
        if (badge) awarded.push(badge)
      }
    }
  }

  return awarded
}

// Award early bird badge for new users
export async function awardEarlyBirdBadge(userId: string): Promise<boolean> {
  const exists = await prisma.badge.findFirst({
    where: { userId, name: 'early_bird' },
  })

  if (!exists) {
    await prisma.badge.create({
      data: {
        userId,
        name: 'early_bird',
        metadata: { joinedAt: new Date().toISOString() },
      },
    })
    return true
  }

  return false
}

// Check for perfect week/month badges
export async function checkPerfectBadges(userId: string): Promise<BadgeDefinition[]> {
  const awarded: BadgeDefinition[] = []
  const now = new Date()

  // Check for perfect week (last 7 days)
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const habits = await prisma.habit.findMany({
    where: { userId, active: true },
  })

  if (habits.length > 0) {
    const weekEntries = await prisma.habitEntry.findMany({
      where: {
        userId,
        completed: true,
        entryDate: { gte: weekAgo, lte: now },
      },
    })

    // Perfect week: all habits completed for 7 days
    const perfectWeekTarget = habits.length * 7
    if (weekEntries.length >= perfectWeekTarget) {
      const exists = await prisma.badge.findFirst({
        where: { userId, name: 'perfect_week' },
      })

      if (!exists) {
        await prisma.badge.create({
          data: {
            userId,
            name: 'perfect_week',
            metadata: { date: now.toISOString() },
          },
        })
        const badge = getBadgeById('perfect_week')
        if (badge) awarded.push(badge)
      }
    }
  }

  return awarded
}

// Run all badge checks for a user
export async function checkAllBadges(
  userId: string,
  streakData?: { currentStreak: number; longestStreak: number }
): Promise<BadgeDefinition[]> {
  const awarded: BadgeDefinition[] = []

  // Check streak badges if streak data provided
  if (streakData) {
    const streakBadges = await checkStreakBadges(
      userId,
      streakData.currentStreak,
      streakData.longestStreak
    )
    awarded.push(...streakBadges)
  }

  // Check milestone badges
  const milestoneBadges = await checkMilestoneBadges(userId)
  awarded.push(...milestoneBadges)

  // Check perfect badges
  const perfectBadges = await checkPerfectBadges(userId)
  awarded.push(...perfectBadges)

  return awarded
}
