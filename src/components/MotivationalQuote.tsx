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
    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 rounded-xl sm:rounded-2xl border border-zinc-800/50 p-4 sm:p-6 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        {/* Streak Message */}
        {streakMessage && currentStreak !== undefined && (
          <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-zinc-800/50">
            <p className="text-sm sm:text-lg font-medium text-white flex items-center gap-2">
              {streakMessage} <span className="text-base sm:text-lg">🌱</span>
            </p>
            {currentStreak > 0 && (
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                🔥 {currentStreak} day streak
              </p>
            )}
          </div>
        )}
        
        {/* Quote */}
        <div className="flex gap-2 sm:gap-3">
          <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-600 flex-shrink-0 mt-0.5 sm:mt-1" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-[10px] sm:text-sm text-zinc-500 mt-1.5 sm:mt-2">
              — {quote.author}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
