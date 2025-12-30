'use client'

import { useState } from 'react'
import { X, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HABIT_TEMPLATES, getTemplateCategories, type HabitTemplate } from '@/lib/templates'

interface TemplatePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (template: HabitTemplate) => void
}

export function TemplatePicker({ isOpen, onClose, onSelect }: TemplatePickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [addedTemplates, setAddedTemplates] = useState<Set<string>>(new Set())

  const categories = getTemplateCategories()
  const filteredTemplates = selectedCategory
    ? HABIT_TEMPLATES.filter((t) => t.category === selectedCategory)
    : HABIT_TEMPLATES

  const handleSelect = (template: HabitTemplate) => {
    onSelect(template)
    setAddedTemplates((prev) => new Set(prev).add(template.id))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Habit Templates</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filter */}
        <div className="px-6 py-3 border-b border-zinc-800 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                !selectedCategory
                  ? 'bg-white text-zinc-900'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  selectedCategory === cat
                    ? 'bg-white text-zinc-900'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTemplates.map((template) => {
              const isAdded = addedTemplates.has(template.id)
              
              return (
                <button
                  key={template.id}
                  onClick={() => !isAdded && handleSelect(template)}
                  disabled={isAdded}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border text-left transition-all',
                    isAdded
                      ? 'bg-zinc-800/30 border-zinc-700/50 cursor-default'
                      : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800'
                  )}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={cn(
                        'font-medium truncate',
                        isAdded ? 'text-zinc-500' : 'text-white'
                      )}>
                        {template.title}
                      </h3>
                      {isAdded && (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: `${template.color}20`,
                          color: template.color 
                        }}
                      >
                        {template.category}
                      </span>
                      {template.goalType !== 'binary' && (
                        <span className="text-xs text-zinc-500">
                          {template.goalTarget} {template.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
          <p className="text-xs text-zinc-500 text-center">
            Click a template to add it as a new habit. You can customize it later.
          </p>
        </div>
      </div>
    </div>
  )
}
