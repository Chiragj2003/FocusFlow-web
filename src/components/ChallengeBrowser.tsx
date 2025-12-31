'use client'

import { useState } from 'react'
import { X, Trophy, Clock, Target, ChevronRight, Sparkles, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHALLENGE_TEMPLATES, type ChallengeTemplate, type ChallengeHabit } from '@/lib/challenges'

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

const HABIT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899',
]

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

type ViewMode = 'list' | 'detail' | 'create'

export function ChallengeBrowser({
  isOpen,
  onClose,
  onStartChallenge,
}: ChallengeBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeTemplate | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  
  // Custom challenge state
  const [customTitle, setCustomTitle] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  const [customDuration, setCustomDuration] = useState(30)
  const [customDifficulty, setCustomDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [customCategory, setCustomCategory] = useState('Productivity')
  const [customHabits, setCustomHabits] = useState<ChallengeHabit[]>([])
  
  // New habit form
  const [newHabitTitle, setNewHabitTitle] = useState('')
  const [newHabitDescription, setNewHabitDescription] = useState('')
  const [newHabitColor, setNewHabitColor] = useState(HABIT_COLORS[0])
  const [newHabitGoalType, setNewHabitGoalType] = useState<'binary' | 'duration' | 'quantity'>('binary')
  const [newHabitTarget, setNewHabitTarget] = useState(1)
  const [newHabitUnit, setNewHabitUnit] = useState('times')

  const filteredChallenges = selectedCategory === 'All'
    ? CHALLENGE_TEMPLATES
    : CHALLENGE_TEMPLATES.filter((c) => c.category === selectedCategory)

  const resetCustomForm = () => {
    setCustomTitle('')
    setCustomDescription('')
    setCustomDuration(30)
    setCustomDifficulty('medium')
    setCustomCategory('Productivity')
    setCustomHabits([])
    resetNewHabitForm()
  }

  const resetNewHabitForm = () => {
    setNewHabitTitle('')
    setNewHabitDescription('')
    setNewHabitColor(HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)])
    setNewHabitGoalType('binary')
    setNewHabitTarget(1)
    setNewHabitUnit('times')
  }

  const addHabitToChallenge = () => {
    if (!newHabitTitle.trim()) return
    
    const habit: ChallengeHabit = {
      title: newHabitTitle.trim(),
      description: newHabitDescription.trim() || `Track ${newHabitTitle.trim()} daily`,
      color: newHabitColor,
      category: customCategory,
      goalType: newHabitGoalType,
      ...(newHabitGoalType !== 'binary' && {
        goalTarget: newHabitTarget,
        unit: newHabitUnit,
      }),
    }
    
    setCustomHabits([...customHabits, habit])
    resetNewHabitForm()
  }

  const removeHabit = (index: number) => {
    setCustomHabits(customHabits.filter((_, i) => i !== index))
  }

  const startCustomChallenge = () => {
    if (!customTitle.trim() || customHabits.length === 0) return
    
    const challenge: ChallengeTemplate = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      description: customDescription.trim() || `A ${customDuration}-day custom challenge`,
      icon: '🎯',
      duration: customDuration,
      difficulty: customDifficulty,
      category: customCategory,
      habits: customHabits,
    }
    
    onStartChallenge(challenge)
    resetCustomForm()
    setViewMode('list')
    onClose()
  }

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
              <h2 className="text-xl font-bold text-white">
                {viewMode === 'create' ? 'Create Custom Challenge' : 'Challenges'}
              </h2>
              <p className="text-sm text-zinc-400">
                {viewMode === 'create' 
                  ? 'Design your own habit challenge'
                  : 'Start a structured journey to build habits'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === 'list' && (
              <button
                onClick={() => setViewMode('create')}
                className="px-4 py-2 text-sm font-medium text-violet-400 bg-violet-500/10 rounded-lg hover:bg-violet-500/20 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Custom
              </button>
            )}
            <button
              onClick={() => {
                if (viewMode !== 'list') {
                  setViewMode('list')
                  setSelectedChallenge(null)
                  resetCustomForm()
                } else {
                  onClose()
                }
              }}
              className="p-2 text-zinc-500 hover:text-white rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        {viewMode === 'list' && (
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
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'create' ? (
            // Custom Challenge Creator
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Challenge Title *
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g., My 30-Day Transformation"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Duration (days)
                  </label>
                  <select
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={21}>21 days</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Description
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Describe your challenge goals..."
                  rows={2}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Difficulty
                  </label>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setCustomDifficulty(diff)}
                        className={cn(
                          'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize',
                          customDifficulty === diff
                            ? DIFFICULTY_COLORS[diff]
                            : 'text-zinc-400 bg-zinc-800 hover:bg-zinc-700'
                        )}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add Habit Section */}
              <div className="border-t border-zinc-800 pt-6">
                <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">
                  Add Habits ({customHabits.length} added)
                </h4>
                
                <div className="p-4 bg-zinc-800/50 rounded-xl space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={newHabitTitle}
                      onChange={(e) => setNewHabitTitle(e.target.value)}
                      placeholder="Habit name *"
                      className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-violet-500"
                    />
                    <input
                      type="text"
                      value={newHabitDescription}
                      onChange={(e) => setNewHabitDescription(e.target.value)}
                      placeholder="Description (optional)"
                      className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Color picker */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Color:</span>
                      <div className="flex gap-1">
                        {HABIT_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewHabitColor(color)}
                            className={cn(
                              'w-6 h-6 rounded-full transition-transform',
                              newHabitColor === color && 'ring-2 ring-white ring-offset-2 ring-offset-zinc-800 scale-110'
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Goal type */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Type:</span>
                      <select
                        value={newHabitGoalType}
                        onChange={(e) => setNewHabitGoalType(e.target.value as 'binary' | 'duration' | 'quantity')}
                        className="px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-sm text-white"
                      >
                        <option value="binary">Yes/No</option>
                        <option value="quantity">Quantity</option>
                        <option value="duration">Duration</option>
                      </select>
                    </div>
                    
                    {newHabitGoalType !== 'binary' && (
                      <>
                        <input
                          type="number"
                          value={newHabitTarget}
                          onChange={(e) => setNewHabitTarget(Number(e.target.value))}
                          min={1}
                          className="w-20 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-sm text-white text-center"
                        />
                        <input
                          type="text"
                          value={newHabitUnit}
                          onChange={(e) => setNewHabitUnit(e.target.value)}
                          placeholder="unit"
                          className="w-24 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-sm text-white"
                        />
                      </>
                    )}
                    
                    <button
                      onClick={addHabitToChallenge}
                      disabled={!newHabitTitle.trim()}
                      className="ml-auto px-4 py-2 text-sm font-medium text-white bg-violet-500 rounded-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Added habits list */}
                {customHabits.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {customHabits.map((habit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg group"
                      >
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: habit.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{habit.title}</p>
                          <p className="text-xs text-zinc-400 truncate">{habit.description}</p>
                        </div>
                        {habit.goalType !== 'binary' && (
                          <span className="text-xs px-2 py-1 bg-zinc-700 rounded text-zinc-300 shrink-0">
                            {habit.goalTarget} {habit.unit}
                          </span>
                        )}
                        <button
                          onClick={() => removeHabit(i)}
                          className="p-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Start Custom Challenge Button */}
              <button
                onClick={startCustomChallenge}
                disabled={!customTitle.trim() || customHabits.length === 0}
                className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:from-zinc-600 disabled:to-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                Start {customDuration}-Day Challenge
                {customHabits.length > 0 && ` (${customHabits.length} habits)`}
              </button>
            </div>
          ) : selectedChallenge ? (
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
