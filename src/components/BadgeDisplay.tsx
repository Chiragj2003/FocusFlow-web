'use client'

import { useState } from 'react'
import { Award, ChevronRight, Lock } from 'lucide-react'
import type { BadgeDefinition } from '@/lib/badges'
import { cn } from '@/lib/utils'

interface BadgeDisplayProps {
  earnedBadges: {
    name: string
    awardedAt: Date | string
    definition?: BadgeDefinition
  }[]
  allBadges: BadgeDefinition[]
  showAll?: boolean
  compact?: boolean
}

export function BadgeDisplay({ 
  earnedBadges, 
  allBadges, 
  showAll = false,
  compact = false 
}: BadgeDisplayProps) {
  const [showAllBadges, setShowAllBadges] = useState(showAll)

  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.name))
  const displayBadges = showAllBadges ? allBadges : allBadges.filter((b) => earnedBadgeIds.has(b.id))

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {earnedBadges.slice(0, 5).map((badge) => (
          <div
            key={badge.name}
            className="group relative"
            title={badge.definition?.description}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-transform hover:scale-110"
              style={{ backgroundColor: `${badge.definition?.color}20` }}
            >
              {badge.definition?.icon || '🏅'}
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {badge.definition?.name}
            </div>
          </div>
        ))}
        {earnedBadges.length > 5 && (
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
            +{earnedBadges.length - 5}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">
            Badges ({earnedBadges.length}/{allBadges.length})
          </h3>
        </div>
        <button
          onClick={() => setShowAllBadges(!showAllBadges)}
          className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          {showAllBadges ? 'Show earned' : 'Show all'}
          <ChevronRight className={cn('w-4 h-4 transition-transform', showAllBadges && 'rotate-90')} />
        </button>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {displayBadges.map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id)
          const earnedBadge = earnedBadges.find((b) => b.name === badge.id)
          
          return (
            <div
              key={badge.id}
              className={cn(
                'relative p-4 rounded-xl border transition-all',
                isEarned
                  ? 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                  : 'bg-zinc-900/30 border-zinc-800/50 opacity-50'
              )}
            >
              {!isEarned && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-3 h-3 text-zinc-600" />
                </div>
              )}
              <div 
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto',
                  isEarned ? '' : 'grayscale'
                )}
                style={{ backgroundColor: isEarned ? `${badge.color}20` : '#27272a' }}
              >
                {badge.icon}
              </div>
              <h4 className={cn(
                'text-sm font-medium text-center mb-1',
                isEarned ? 'text-white' : 'text-zinc-500'
              )}>
                {badge.name}
              </h4>
              <p className="text-xs text-zinc-500 text-center line-clamp-2">
                {badge.description}
              </p>
              {isEarned && earnedBadge && (
                <p className="text-xs text-zinc-600 text-center mt-2">
                  {new Date(earnedBadge.awardedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {displayBadges.length === 0 && (
        <div className="text-center py-8 text-zinc-500">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No badges earned yet.</p>
          <p className="text-sm">Keep tracking your habits to earn badges!</p>
        </div>
      )}
    </div>
  )
}

// New Badge Notification
interface NewBadgeNotificationProps {
  badge: BadgeDefinition
  onClose: () => void
}

export function NewBadgeNotification({ badge, onClose }: NewBadgeNotificationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 rounded-2xl p-8 max-w-sm w-full text-center border border-zinc-700 animate-bounce-in">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-4xl animate-pulse"
            style={{ backgroundColor: `${badge.color}30`, boxShadow: `0 0 40px ${badge.color}50` }}
          >
            {badge.icon}
          </div>
        </div>
        <div className="mt-8">
          <p className="text-amber-400 text-sm font-medium mb-2">🎉 New Badge Unlocked!</p>
          <h3 className="text-2xl font-bold text-white mb-2">{badge.name}</h3>
          <p className="text-zinc-400 mb-6">{badge.description}</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-zinc-900 rounded-xl font-medium hover:bg-zinc-200 transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  )
}
