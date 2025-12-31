'use client'

import { useState } from 'react'
import { X, Trophy, Clock, Target, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHALLENGE_TEMPLATES, type ChallengeTemplate } from '@/lib/challenges'

interface ChallengeBrowserProps {
  isOpen: boolean
  onClose: () => void
  onStartChallenge: (challenge: ChallengeTemplate) => void
}

const DIFFICULTY_COLORS = {
  easy: 'text-green-400 bg-green-500/10',
  medium: 'text-yellow-400 bg-yellow-500/10',
  hard: 'text-red-400 bg-red-500/10',
}

const CATEGORIES = [
  'All',
  'Fitness',
  'Health',
  'Mindfulness',
  'Learning',
  'Productivity',
  'Nutrition',
  'Creative',
  'Social',
]

export function ChallengeBrowser({
  isOpen,
  onClose,
  onStartChallenge,
}: ChallengeBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeTemplate | null>(null)

  const filteredChallenges = selectedCategory === 'All'
    ? CHALLENGE_TEMPLATES
    : CHALLENGE_TEMPLATES.filter((c) => c.category === selectedCategory)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Trophy size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Challenges</h2>
              <p className="text-sm text-zinc-400">Start a structured journey to build habits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filter */}
        <div className="px-6 py-4 border-b border-zinc-800/50 overflow-x-auto">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
                  selectedCategory === cat
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedChallenge ? (
            // Challenge Detail View
            <div className="space-y-6">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-sm text-zinc-400 hover:text-white flex items-center gap-1"
              >
                ← Back to challenges
              </button>

              <div className="flex items-start gap-4">
                <div className="text-5xl">{selectedChallenge.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedChallenge.title}
                  </h3>
                  <p className="text-zinc-400 mb-4">{selectedChallenge.description}</p>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      'px-3 py-1 text-xs font-medium rounded-full',
                      DIFFICULTY_COLORS[selectedChallenge.difficulty]
                    )}>
                      {selectedChallenge.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-zinc-400">
                      <Clock size={14} />
                      {selectedChallenge.duration} days
                    </span>
                    <span className="flex items-center gap-1 text-sm text-zinc-400">
                      <Target size={14} />
                      {selectedChallenge.habits.length} habits
                    </span>
                  </div>
                </div>
              </div>

              {/* Habits List */}
              <div>
                <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">
                  Habits in this challenge
                </h4>
                <div className="space-y-3">
                  {selectedChallenge.habits.map((habit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-white">{habit.title}</p>
                        <p className="text-sm text-zinc-400">{habit.description}</p>
                      </div>
                      {habit.goalType !== 'binary' && (
                        <span className="text-sm px-3 py-1 bg-zinc-700 rounded-lg text-zinc-300">
                          {habit.goalTarget} {habit.unit}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => {
                  onStartChallenge(selectedChallenge)
                  onClose()
                }}
                className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                Start {selectedChallenge.duration}-Day Challenge
              </button>
            </div>
          ) : (
            // Challenge Grid View
            <div className="grid md:grid-cols-2 gap-4">
              {filteredChallenges.map((challenge) => (
                <button
                  key={challenge.id}
                  onClick={() => setSelectedChallenge(challenge)}
                  className="text-left p-5 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 rounded-xl transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{challenge.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {challenge.title}
                        </h3>
                        <ChevronRight
                          size={16}
                          className="text-zinc-500 group-hover:text-white transition-colors shrink-0"
                        />
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full',
                          DIFFICULTY_COLORS[challenge.difficulty]
                        )}>
                          {challenge.difficulty}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {challenge.duration} days
                        </span>
                        <span className="text-xs text-zinc-500">
                          {challenge.habits.length} habits
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
