'use client'

import { useState } from 'react'
import { X, Sparkles, Check, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HABIT_TEMPLATES, getTemplateCategories, type HabitTemplate } from '@/lib/templates'

interface TemplatePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (template: HabitTemplate) => void
}

export function TemplatePicker({ isOpen, onClose, onSelect }: TemplatePickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set())
  const [addedTemplates, setAddedTemplates] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)

  const categories = getTemplateCategories()
  const filteredTemplates = selectedCategory
    ? HABIT_TEMPLATES.filter((t) => t.category === selectedCategory)
    : HABIT_TEMPLATES

  const handleToggleTemplate = (template: HabitTemplate) => {
    if (addedTemplates.has(template.id)) return
    setSelectedTemplates((prev) => {
      const next = new Set(prev)
      if (next.has(template.id)) {
        next.delete(template.id)
      } else {
        next.add(template.id)
      }
      return next
    })
  }

  const handleSaveSelected = async () => {
    if (selectedTemplates.size === 0) return

    setIsSaving(true)
    try {
      const templatesToAdd = HABIT_TEMPLATES.filter((t) => selectedTemplates.has(t.id))
      for (const template of templatesToAdd) {
        await onSelect(template)
        setAddedTemplates((prev) => new Set(prev).add(template.id))
      }
      setSelectedTemplates(new Set())
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setSelectedTemplates(new Set())
    onClose()
  }

  if (!isOpen) return null

  const selectedCount = selectedTemplates.size

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl mx-1 sm:mx-4 max-h-[90vh] sm:max-h-[85vh] overflow-hidden border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-semibold text-white">Habit Templates</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-zinc-800 overflow-x-auto">
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
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
                  'px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
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
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[45vh] sm:max-h-[50vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {filteredTemplates.map((template) => {
              const isAdded = addedTemplates.has(template.id)
              const isSelected = selectedTemplates.has(template.id)
              
              return (
                <button
                  key={template.id}
                  onClick={() => handleToggleTemplate(template)}
                  disabled={isAdded}
                  className={cn(
                    'flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border text-left transition-all',
                    isAdded
                      ? 'bg-zinc-800/30 border-zinc-700/50 cursor-default opacity-50'
                      : isSelected
                        ? 'bg-amber-400/10 border-amber-400/50 ring-1 ring-amber-400/30'
                        : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800'
                  )}
                >
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl shrink-0"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={cn(
                        'text-sm sm:text-base font-medium truncate',
                        isAdded ? 'text-zinc-500' : 'text-white'
                      )}>
                        {template.title}
                      </h3>
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 shrink-0" />
                      ) : isSelected ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-amber-400 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-900" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 border-zinc-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-zinc-500 line-clamp-2 mt-0.5">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                      <span
                        className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: `${template.color}20`,
                          color: template.color 
                        }}
                      >
                        {template.category}
                      </span>
                      {template.goalType !== 'binary' && (
                        <span className="text-[10px] sm:text-xs text-zinc-500">
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

        {/* Footer with Save Button */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] sm:text-xs text-zinc-500">
              {selectedCount > 0 
                ? `${selectedCount} template${selectedCount > 1 ? 's' : ''} selected`
                : 'Select templates to add as habits'}
            </p>
            <button
              onClick={handleSaveSelected}
              disabled={selectedCount === 0 || isSaving}
              className={cn(
                'inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all',
                selectedCount > 0 && !isSaving
                  ? 'bg-amber-400 text-zinc-900 hover:bg-amber-300 shadow-lg shadow-amber-400/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Save {selectedCount > 0 ? `(${selectedCount})` : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
