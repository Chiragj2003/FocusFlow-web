'use client'

import { useState } from 'react'
import { X, Sparkles, Wand2, Loader2, Check, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GeneratedHabit {
  title: string
  description: string
  category: string
  color: string
  goalType: 'binary' | 'duration' | 'quantity'
  goalTarget?: number
  unit?: string
}

interface AddHabitWithAIProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (habit: {
    title: string
    description?: string
    category?: string
    color: string
    goalType: 'binary' | 'duration' | 'quantity'
    goalTarget?: number
    unit?: string
  }) => void
}

const EXAMPLE_PROMPTS = [
  'Drink 8 glasses of water daily',
  'Meditate for 10 minutes every morning',
  'Read for 30 minutes before bed',
  'Exercise for 45 minutes',
  'Write in my gratitude journal',
  'Take a 10000 steps walk',
  'Practice yoga for 20 minutes',
  'Learn a new language for 15 minutes',
]

export function AddHabitWithAI({ isOpen, onClose, onSubmit }: AddHabitWithAIProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedHabit, setGeneratedHabit] = useState<GeneratedHabit | null>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError('')
    setGeneratedHabit(null)

    try {
      const response = await fetch('/api/habits/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate habit')
      }

      const habit = await response.json()
      setGeneratedHabit(habit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async () => {
    if (!generatedHabit) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: generatedHabit.title,
        description: generatedHabit.description,
        category: generatedHabit.category,
        color: generatedHabit.color,
        goalType: generatedHabit.goalType,
        goalTarget: generatedHabit.goalTarget,
        unit: generatedHabit.unit,
      })
      
      // Reset and close
      setPrompt('')
      setGeneratedHabit(null)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
    setGeneratedHabit(null)
    setError('')
  }

  const handleReset = () => {
    setGeneratedHabit(null)
    setError('')
  }

  const handleClose = () => {
    setPrompt('')
    setGeneratedHabit(null)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Habit Creator</h2>
              <p className="text-xs text-zinc-500">Describe your habit and let AI do the rest</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Input Section */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Describe your habit
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
                    e.preventDefault()
                    handleGenerate()
                  }
                }}
                placeholder="e.g., I want to drink 8 glasses of water every day..."
                rows={3}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors resize-none text-white placeholder:text-zinc-500"
              />
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    prompt.trim() && !isGenerating
                      ? 'bg-violet-600 text-white hover:bg-violet-500'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  )}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          {/* Example Prompts */}
          {!generatedHabit && (
            <div>
              <p className="text-xs text-zinc-500 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.slice(0, 4).map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example)}
                    className="px-3 py-1.5 text-xs bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generated Habit Preview */}
          {generatedHabit && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Generated Habit</h3>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <RefreshCw size={12} />
                  Regenerate
                </button>
              </div>
              
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 space-y-3">
                {/* Title & Category */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${generatedHabit.color}20` }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: generatedHabit.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white">{generatedHabit.title}</h4>
                    <p className="text-sm text-zinc-400 mt-0.5">{generatedHabit.description}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-700">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ 
                      backgroundColor: `${generatedHabit.color}20`,
                      color: generatedHabit.color 
                    }}
                  >
                    {generatedHabit.category}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 bg-zinc-700 rounded-lg text-xs text-zinc-300">
                    {generatedHabit.goalType === 'binary' 
                      ? 'Yes/No' 
                      : generatedHabit.goalType === 'duration'
                        ? `${generatedHabit.goalTarget} ${generatedHabit.unit}`
                        : `${generatedHabit.goalTarget} ${generatedHabit.unit}`
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-sm font-medium text-zinc-400 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            {generatedHabit ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Add Habit
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Habit
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
