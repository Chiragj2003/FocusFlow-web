'use client'

import { Quote } from 'lucide-react'
import type { Quote as QuoteType } from '@/lib/quotes'

interface MotivationalQuoteProps {
  quote: QuoteType
  streakMessage?: string
  currentStreak?: number
}

export function MotivationalQuote({ quote, streakMessage, currentStreak }: MotivationalQuoteProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 rounded-2xl border border-zinc-800/50 p-6 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        {/* Streak Message */}
        {streakMessage && currentStreak !== undefined && (
          <div className="mb-4 pb-4 border-b border-zinc-800/50">
            <p className="text-lg font-medium text-white">{streakMessage}</p>
            {currentStreak > 0 && (
              <p className="text-sm text-zinc-400 mt-1">
                🔥 {currentStreak} day streak
              </p>
            )}
          </div>
        )}
        
        {/* Quote */}
        <div className="flex gap-3">
          <Quote className="w-6 h-6 text-zinc-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-zinc-300 italic leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              — {quote.author}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
