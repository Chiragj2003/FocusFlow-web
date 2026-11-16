/* ==================== ORIGINAL CODE START ====================
'use client'

import { useState, useEffect, useMemo } from 'react'
import { ALL_ACHIEVEMENTS, ALL_BADGES } from '@/lib/constants'
import { CheckCircle2, Lock, Star, Trophy, Target, Clock, Zap, Flame, Calendar as CalendarIcon, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges'>('achievements')
  const [joinedAchievements, setJoinedAchievements] = useState<string[]>([])
  
  // We simulate having some achievements completed and badges earned based on local storage
  useEffect(() => {
    const saved = localStorage.getItem('focusflow_joined_achievements')
    if (saved) {
      try {
        setJoinedAchievements(JSON.parse(saved))
      } catch (_e) {}
    }
  }, [])

  const handleJoin = (id: string) => {
    const newJoined = [...joinedAchievements, id]
    setJoinedAchievements(newJoined)
    localStorage.setItem('focusflow_joined_achievements', JSON.stringify(newJoined))
  }

  // Simulated earned badges for preview
  const earnedBadges = useMemo(() => {
    return ['first_habit', '3_day_streak', 'profile_setup', 'explorer']
  }, [])

  const groupedBadges = useMemo(() => {
    const groups: Record<string, typeof ALL_BADGES> = {}
    ALL_BADGES.forEach(badge => {
      if (!groups[badge.category]) groups[badge.category] = []
      groups[badge.category].push(badge)
    })
    return groups
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Rewards & Progress</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Track your milestones and collect badges</p>
        </div>
        
        <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('achievements')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
              activeTab === 'achievements' 
                ? "bg-white dark:bg-white text-zinc-900 shadow-sm" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
            )}
          >
            <Target className="w-4 h-4" />
            Challenges
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
              activeTab === 'badges' 
                ? "bg-white dark:bg-white text-zinc-900 shadow-sm" 
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
            )}
          >
            <Award className="w-4 h-4" />
            Badges
          </button>
        </div>
      </div>

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_ACHIEVEMENTS.map((ach) => {
            const isJoined = joinedAchievements.includes(ach.id)
            return (
              <div 
                key={ach.id} 
                className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-zinc-100 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                    {ach.type === 'focus' ? <Clock className="w-6 h-6 text-blue-500 dark:text-blue-400" /> :
                     ach.type === 'streak' ? <Flame className="w-6 h-6 text-orange-500 dark:text-orange-400" /> :
                     ach.type === 'quantity' ? <Zap className="w-6 h-6 text-yellow-500 dark:text-yellow-400" /> :
                     <Target className="w-6 h-6 text-purple-500 dark:text-purple-400" />}
                  </div>
                  <div className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {ach.reward} XP
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{ach.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 flex-1 leading-relaxed">{ach.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{ach.duration} Days</span>
                  </div>
                  
                  {isJoined ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm bg-emerald-100 dark:bg-emerald-400/10 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      Joined
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(ach.id)}
                      className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="space-y-12">
          {Object.entries(groupedBadges).map(([category, badges]) => {
            const unlockedInCategory = badges.filter(b => earnedBadges.includes(b.id)).length
            
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    {category}
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs px-2 py-1 rounded-md font-medium">
                      {unlockedInCategory} / {badges.length}
                    </span>
                  </h2>
                  <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1 ml-6"></div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {badges.map((badge) => {
                    const isUnlocked = earnedBadges.includes(badge.id)
                    
                    return (
                      <div 
                        key={badge.id}
                        className={cn(
                          "relative p-5 rounded-2xl border flex flex-col items-center text-center transition-all",
                          isUnlocked 
                            ? "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-700/50 shadow-sm dark:hover:bg-zinc-800/80 hover:border-zinc-300" 
                            : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 opacity-60 grayscale-[50%]"
                        )}
                        style={{
                          boxShadow: isUnlocked ? `inset 0 0 40px -20px ${badge.color}20` : 'none'
                        }}
                      >
                        {!isUnlocked && (
                          <div className="absolute top-3 right-3">
                            <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                          </div>
                        )}
                        
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border"
                          style={{
                            backgroundColor: isUnlocked ? `${badge.color}15` : 'transparent',
                            borderColor: isUnlocked ? `${badge.color}30` : 'var(--border)',
                            color: isUnlocked ? badge.color : 'var(--muted-foreground)'
                          }}
                        >
                          <Star className="w-8 h-8 fill-current opacity-80" />
                        </div>
                        
                        <h3 className={cn(
                          "font-bold text-sm mb-1.5",
                          isUnlocked ? "text-zinc-900 dark:text-white" : "text-zinc-500"
                        )}>
                          {badge.name}
                        </h3>
                        
                        <p className={cn(
                          "text-xs leading-relaxed",
                          isUnlocked ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-600"
                        )}>
                          {badge.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
==================== ORIGINAL CODE END ==================== */

'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { ACTIVE_ACHIEVEMENTS, ALL_BADGES, SHOW_CHALLENGES } from '@/lib/constants'
import {
  CheckCircle2,
  Lock,
  Trophy,
  Target,
  Calendar as CalendarIcon,
  Award,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Mascot } from '@/components/ui/Mascot'
import { celebrate, toast } from '@/lib/celebrate'

// Maps badge id to the 3D medal asset images in /badges/
const BADGE_IMAGES: Record<string, { unlocked: string; locked: string }> = {
  first_habit: { unlocked: '/badges/first-habit.png', locked: '/badges/first-habit-locked.png' },
  '3_day_streak': { unlocked: '/badges/streak-3.png', locked: '/badges/streak-3-locked.png' },
  week_warrior: { unlocked: '/badges/streak-7.png', locked: '/badges/streak-7-locked.png' },
  '10_day_streak': { unlocked: '/badges/streak-7.png', locked: '/badges/streak-7-locked.png' },
  two_week_titan: { unlocked: '/badges/streak-14.png', locked: '/badges/streak-14-locked.png' },
  '21_day_streak': { unlocked: '/badges/streak-21.png', locked: '/badges/streak-21-locked.png' },
  monthly_master: { unlocked: '/badges/streak-30.png', locked: '/badges/streak-30-locked.png' },
  '40_day_streak': { unlocked: '/badges/streak-30.png', locked: '/badges/streak-30-locked.png' },
  streak_50: { unlocked: '/badges/streak-60.png', locked: '/badges/streak-60-locked.png' },
  '60_day_streak': { unlocked: '/badges/streak-60.png', locked: '/badges/streak-60-locked.png' },
  '75_day_streak': { unlocked: '/badges/streak-60.png', locked: '/badges/streak-60-locked.png' },
  '90_day_streak': { unlocked: '/badges/streak-90.png', locked: '/badges/streak-90-locked.png' },
  streak_100: { unlocked: '/badges/century-100.png', locked: '/badges/century-100-locked.png' },
  streak_180: { unlocked: '/badges/streak-180.png', locked: '/badges/streak-180-locked.png' },
  streak_365: { unlocked: '/badges/streak-365.png', locked: '/badges/streak-365-locked.png' },
  century_club: { unlocked: '/badges/century-100.png', locked: '/badges/century-100-locked.png' },
  perfect_week: { unlocked: '/badges/perfect-week.png', locked: '/badges/perfect-week-locked.png' },
  perfect_month: { unlocked: '/badges/perfect-month.png', locked: '/badges/perfect-month-locked.png' },
  perfect_quarter: { unlocked: '/badges/perfect-quarter.png', locked: '/badges/perfect-quarter-locked.png' },
  weekend_warrior: { unlocked: '/badges/weekend-warrior.png', locked: '/badges/weekend-warrior-locked.png' },
  triple_threat: { unlocked: '/badges/triple-threat.png', locked: '/badges/triple-threat-locked.png' },
}

function getBadgeArt(badgeId: string, isUnlocked: boolean): string {
  const match = BADGE_IMAGES[badgeId]
  if (match) {
    return isUnlocked ? match.unlocked : match.locked
  }
  return isUnlocked ? '/badges/first-habit.png' : '/badges/first-habit-locked.png'
}

interface UserChallengeItem {
  id: string
  challengeId: string
  progress: number
  completed: boolean
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges'>(SHOW_CHALLENGES ? 'achievements' : 'badges')
  const [userChallenges, setUserChallenges] = useState<UserChallengeItem[]>([])
  const [loadingChallenges, setLoadingChallenges] = useState<boolean>(true)
  const [isJoiningId, setIsJoiningId] = useState<string | null>(null)

  // Load challenges from server API: GET /api/challenges/user
  const loadUserChallenges = useCallback(async () => {
    if (!SHOW_CHALLENGES) return
    try {
      setLoadingChallenges(true)
      const res = await fetch('/api/challenges/user')
      if (res.ok) {
        const data = await res.json()
        setUserChallenges(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('[Achievements] Failed to load challenges:', err)
    } finally {
      setLoadingChallenges(false)
    }
  }, [])

  useEffect(() => {
    if (SHOW_CHALLENGES) {
      loadUserChallenges()
    }
  }, [loadUserChallenges])

  // Join challenge via API: POST /api/challenges/join
  const handleJoin = async (id: string, title: string) => {
    if (!SHOW_CHALLENGES) return
    try {
      setIsJoiningId(id)
      const res = await fetch('/api/challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: id }),
      })

      if (res.ok) {
        celebrate({
          title: 'Challenge Accepted!',
          message: `Joined “${title}”. Give it your all!`,
          mood: 'celebrate',
          highlight: 'CHALLENGE ACTIVE',
          highlightIcon: 'trophy',
        })
        toast(`🎯 Joined challenge: “${title}”!`)
        await loadUserChallenges()
      } else {
        const data = await res.json().catch(() => ({}))
        if (res.status === 409) {
          toast(`Already joined “${title}”!`)
          await loadUserChallenges()
        } else {
          toast({ tone: 'error', message: (data as any)?.error || 'Failed to join challenge' })
        }
      }
    } catch (err) {
      console.error('[Achievements] Join error:', err)
      toast({ tone: 'error', message: 'Failed to join challenge. Please try again.' })
    } finally {
      setIsJoiningId(null)
    }
  }

  // Set of joined challenge IDs for quick lookup
  const joinedIds = useMemo(
    () => new Set(userChallenges.map((uc) => uc.challengeId)),
    [userChallenges]
  )

  // Map of challengeId -> progress
  const challengeMap = useMemo(() => {
    const map = new Map<string, UserChallengeItem>()
    userChallenges.forEach((uc) => map.set(uc.challengeId, uc))
    return map
  }, [userChallenges])

  // Simulated earned badges for preview
  const earnedBadges = useMemo(() => {
    return [
      'first_habit',
      '3_day_streak',
      'profile_setup',
      'explorer',
      'week_warrior',
      'two_week_titan',
    ]
  }, [])

  const groupedBadges = useMemo(() => {
    const groups: Record<string, typeof ALL_BADGES> = {}
    ALL_BADGES.forEach((badge) => {
      if (!groups[badge.category]) groups[badge.category] = []
      groups[badge.category].push(badge)
    })
    return groups
  }, [])

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
        {/* Sparky Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18181d] via-[#141418] to-[#101014] border border-[#232328] p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Achievements & Badges
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Rewards & Progress
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                {SHOW_CHALLENGES
                  ? 'Track your milestones, conquer multi-day challenges, and collect beautiful 3D medals as your fire grows.'
                  : 'Track your milestones and collect beautiful 3D medals as your fire grows.'}
              </p>
            </div>

            <div className="flex items-center justify-center shrink-0">
              <Mascot mood="proud" size={130} />
            </div>
          </div>
        </div>

        {/* Tabs / Header */}
        {SHOW_CHALLENGES ? (
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex bg-[#131316] p-1.5 rounded-2xl border border-[#232328]">
              <button
                onClick={() => setActiveTab('achievements')}
                className={cn(
                  'px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2',
                  activeTab === 'achievements'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_2px_12px_rgba(249,115,22,0.35)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                )}
              >
                <Target className="w-4 h-4" />
                Challenges ({userChallenges.length} Active)
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={cn(
                  'px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2',
                  activeTab === 'badges'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_2px_12px_rgba(249,115,22,0.35)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                )}
              >
                <Award className="w-4 h-4" />
                3D Badges
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Earn XP to rank up on the leaderboard</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#232328] pb-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-white">
              <Award className="w-5 h-5 text-orange-400" />
              <span>3D Badges & Medals</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Unlock badges to grow your streak and XP</span>
            </div>
          </div>
        )}

        {/* Tab: Challenges */}
        {SHOW_CHALLENGES && activeTab === 'achievements' && (
          <div>
            {loadingChallenges ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
                <p className="text-zinc-400 text-sm">Syncing challenges...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ACTIVE_ACHIEVEMENTS.map((ach) => {
                  const isJoined = joinedIds.has(ach.id)
                  const userRecord = challengeMap.get(ach.id)
                  const progressValue = userRecord ? Math.min(100, Math.round(userRecord.progress || 0)) : 0
                  const isBusy = isJoiningId === ach.id

                  return (
                    <div
                      key={ach.id}
                      className={cn(
                        'relative rounded-3xl p-6 flex flex-col transition-all duration-200 shadow-md',
                        isJoined
                          ? 'bg-[#131316] border-2 border-orange-500/50 shadow-[0_4px_24px_rgba(249,115,22,0.18)]'
                          : 'bg-[#131316] border border-[#232328] hover:border-orange-500/30 hover:-translate-y-0.5'
                      )}
                    >
                      <div className="flex justify-between items-start mb-4">
                        {/* Custom 3D art per challenge type (public/art/challenges) */}
                        <div className="bg-[#18181d] p-2 rounded-2xl border border-[#232328]">
                          <Image
                            src={`/art/challenges/${['focus', 'streak', 'quantity', 'completion'].includes(ach.type) ? ach.type : 'completion'}.png`}
                            alt=""
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <div className="bg-orange-500/10 text-orange-400 border border-orange-500/25 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(249,115,22,0.15)]">
                          <Image src="/art/challenges/xp.png" alt="" width={16} height={16} className="w-4 h-4 object-contain" />
                          {ach.reward} XP
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1.5">{ach.title}</h3>
                      <p className="text-zinc-400 text-sm mb-4 flex-1 leading-relaxed">
                        {ach.description}
                      </p>

                      {/* Progress bar if joined */}
                      {isJoined && (
                        <div className="mb-4 bg-[#18181d] p-3 rounded-2xl border border-[#232328] space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-orange-400">Challenge Active</span>
                            <span className="text-zinc-400 font-bold">{progressValue}%</span>
                          </div>
                          <div className="h-2 bg-[#232328] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(5, progressValue)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-[#232328]">
                        <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold">
                          <CalendarIcon className="w-4 h-4 text-orange-400" />
                          <span>{ach.duration} Days</span>
                        </div>

                        {isJoined ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                            <CheckCircle2 className="w-4 h-4" />
                            Active
                          </div>
                        ) : (
                          <button
                            onClick={() => handleJoin(ach.id, ach.title)}
                            disabled={isBusy}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition-transform hover:scale-105 shadow-[0_2px_10px_rgba(249,115,22,0.3)] disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isBusy ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Joining...
                              </>
                            ) : (
                              'Join Challenge'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Badges */}
        {(!SHOW_CHALLENGES || activeTab === 'badges') && (
          <div className="space-y-12">
            {Object.entries(groupedBadges).map(([category, badges]) => {
              const unlockedInCategory = badges.filter((b) => earnedBadges.includes(b.id)).length

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      {category}
                      <span className="bg-[#18181d] border border-[#232328] text-orange-400 text-xs px-2.5 py-1 rounded-full font-bold">
                        {unlockedInCategory} / {badges.length}
                      </span>
                    </h2>
                    <div className="h-px bg-[#232328] flex-1 ml-6"></div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {badges.map((badge) => {
                      const isUnlocked = earnedBadges.includes(badge.id)
                      const artSrc = getBadgeArt(badge.id, isUnlocked)

                      return (
                        <div
                          key={badge.id}
                          className={cn(
                            'relative p-5 rounded-3xl border flex flex-col items-center text-center transition-all duration-300',
                            isUnlocked
                              ? 'bg-[#131316] border-orange-500/30 shadow-[0_4px_24px_rgba(249,115,22,0.18)] hover:-translate-y-1 hover:border-orange-500/60'
                              : 'bg-[#101013] border-[#232328] opacity-60'
                          )}
                        >
                          {!isUnlocked && (
                            <div className="absolute top-3 right-3 p-1 rounded-full bg-black/50 border border-zinc-700">
                              <Lock className="w-3.5 h-3.5 text-zinc-400" />
                            </div>
                          )}

                          {/* 3D Medal Asset Image */}
                          <div className="relative w-20 h-20 mb-3 flex items-center justify-center select-none">
                            <Image
                              src={artSrc}
                              alt={badge.name}
                              width={80}
                              height={80}
                              className={`object-contain transition-transform duration-300 ${
                                isUnlocked
                                  ? 'drop-shadow-[0_4px_12px_rgba(249,115,22,0.4)] hover:scale-110'
                                  : 'grayscale'
                              }`}
                            />
                          </div>

                          <h3
                            className={cn(
                              'font-black text-sm mb-1',
                              isUnlocked ? 'text-white' : 'text-zinc-500'
                            )}
                          >
                            {badge.name}
                          </h3>

                          <p
                            className={cn(
                              'text-xs leading-relaxed',
                              isUnlocked ? 'text-zinc-400' : 'text-zinc-500'
                            )}
                          >
                            {badge.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

