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
