'use client'

import { useState } from 'react'
import { X, Smile, Meh, Frown, Zap, Battery, BatteryLow, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EntryNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { notes: string; mood: number | null; energy: number | null }) => void
  habitTitle: string
  date: string
  initialNotes?: string
  initialMood?: number | null
  initialEnergy?: number | null
}

const MOOD_OPTIONS = [
  { value: 1, icon: Frown, label: 'Bad', color: 'text-red-400' },
  { value: 2, icon: Frown, label: 'Low', color: 'text-orange-400' },
  { value: 3, icon: Meh, label: 'Okay', color: 'text-yellow-400' },
  { value: 4, icon: Smile, label: 'Good', color: 'text-lime-400' },
  { value: 5, icon: Smile, label: 'Great', color: 'text-green-400' },
]

const ENERGY_OPTIONS = [
  { value: 1, icon: BatteryLow, label: 'Exhausted', color: 'text-red-400' },
  { value: 2, icon: BatteryLow, label: 'Tired', color: 'text-orange-400' },
  { value: 3, icon: Battery, label: 'Normal', color: 'text-yellow-400' },
  { value: 4, icon: Zap, label: 'Energized', color: 'text-lime-400' },
  { value: 5, icon: Zap, label: 'Supercharged', color: 'text-green-400' },
]

export function EntryNoteModal({
  isOpen,
  onClose,
  onSave,
  habitTitle,
  date,
  initialNotes = '',
  initialMood = null,
  initialEnergy = null,
}: EntryNoteModalProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [mood, setMood] = useState<number | null>(initialMood)
  const [energy, setEnergy] = useState<number | null>(initialEnergy)

  const handleSave = () => {
    onSave({ notes, mood, energy })
    onClose()
  }

  if (!isOpen) return null

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Journal Entry</h2>
            <p className="text-sm text-zinc-400">
              {habitTitle} • {formattedDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mood Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-3">
            How are you feeling?
          </label>
          <div className="flex gap-2">
            {MOOD_OPTIONS.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => setMood(mood === option.value ? null : option.value)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all',
                    mood === option.value
                      ? 'border-white bg-white/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  )}
                >
                  <Icon
                    size={24}
                    className={cn(
                      mood === option.value ? option.color : 'text-zinc-500'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs',
                      mood === option.value ? 'text-white' : 'text-zinc-500'
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Energy Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-3">
            Energy level?
          </label>
          <div className="flex gap-2">
            {ENERGY_OPTIONS.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => setEnergy(energy === option.value ? null : option.value)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all',
                    energy === option.value
                      ? 'border-white bg-white/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  )}
                >
                  <Icon
                    size={24}
                    className={cn(
                      energy === option.value ? option.color : 'text-zinc-500'
                    )}
                  />
                  <span
                    className={cn(
                      'text-xs',
                      energy === option.value ? 'text-white' : 'text-zinc-500'
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Notes & Reflections
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it go? Any thoughts or reflections..."
            className="w-full h-32 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Send size={16} />
            Save Entry
          </button>
        </div>
      </div>
    </div>
  )
}
