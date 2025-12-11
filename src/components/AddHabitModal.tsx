'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddHabitModalProps {
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

const PRESET_COLORS = [
  '#FFB4A2', // Peach (Primary)
  '#CDE7E4', // Teal (Accent)
  '#E2D6FF', // Lavender
  '#FFE5B4', // Peach cream
  '#B4E4FF', // Sky blue
  '#FFD6D0', // Pink
  '#D4EDDA', // Mint
  '#FFF3CD', // Cream
]

const CATEGORIES = [
  'Health',
  'Fitness',
  'Mindfulness',
  'Learning',
  'Productivity',
  'Social',
  'Creative',
  'Other',
]

export function AddHabitModal({ isOpen, onClose, onSubmit }: AddHabitModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [goalType, setGoalType] = useState<'binary' | 'duration' | 'quantity'>('binary')
  const [goalTarget, setGoalTarget] = useState<number | undefined>(undefined)
  const [unit, setUnit] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
        color,
        goalType,
        goalTarget: goalType !== 'binary' ? goalTarget : undefined,
        unit: goalType !== 'binary' ? unit : undefined,
      })
      
      // Reset form
      setTitle('')
      setDescription('')
      setCategory('')
      setColor(PRESET_COLORS[0])
      setGoalType('binary')
      setGoalTarget(undefined)
      setUnit('')
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">Add New Habit</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">
              Habit Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Meditation"
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-card-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={2}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none text-card-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-card-foreground"
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all',
                    color === c
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Goal Type */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Goal Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'binary', label: 'Yes/No', desc: 'Did it or not' },
                { value: 'duration', label: 'Duration', desc: 'Time based' },
                { value: 'quantity', label: 'Quantity', desc: 'Count based' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setGoalType(type.value as typeof goalType)}
                  className={cn(
                    'px-3 py-2.5 rounded-lg border text-left transition-colors',
                    goalType === type.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-muted-foreground'
                  )}
                >
                  <div className="text-sm font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target & Unit (for non-binary) */}
          {goalType !== 'binary' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">
                  Target
                </label>
                <input
                  type="number"
                  value={goalTarget || ''}
                  onChange={(e) => setGoalTarget(Number(e.target.value) || undefined)}
                  placeholder="e.g., 30"
                  min={1}
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-card-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1.5">
                  Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder={goalType === 'duration' ? 'minutes' : 'times'}
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-card-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
