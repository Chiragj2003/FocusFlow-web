'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  CelebrationEvent,
  ToastEvent,
  onCelebrate,
  onToast,
} from '@/lib/celebrate'
import { Mascot } from './Mascot'
import { Trophy, Flame, Clock, CheckCircle2, Sparkles, Star, AlertCircle, Info, X } from 'lucide-react'

const CONFETTI_COLORS = ['#f97316', '#fbbf24', '#fde68a', '#fb923c', '#ef4444', '#ffffff']

function ConfettiPiece({ index }: { index: number }) {
  const seed = useMemo(() => ({
    left: `${Math.random() * 100}%`,
    drift: (Math.random() - 0.5) * 120,
    delay: Math.random() * 300,
    duration: 1800 + Math.random() * 1200,
    rotate: 360 + Math.random() * 540,
    w: 7 + Math.random() * 6,
    h: 12 + Math.random() * 8,
    round: index % 3 === 0,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  }), [index])

  return (
    <div
      className="pointer-events-none fixed top-0 animate-confetti-fall"
      style={{
        left: seed.left,
        width: seed.round ? seed.w : seed.w,
        height: seed.round ? seed.w : seed.h,
        borderRadius: seed.round ? '999px' : '2px',
        backgroundColor: seed.color,
        animationDelay: `${seed.delay}ms`,
        animationDuration: `${seed.duration}ms`,
        zIndex: 99999,
      }}
    />
  )
}

const ICON_MAP = {
  flame: Flame,
  trophy: Trophy,
  time: Clock,
  checkmark: CheckCircle2,
  sparkles: Sparkles,
  star: Star,
}

export function CelebrationModal() {
  const [celebration, setCelebration] = useState<CelebrationEvent | null>(null)
  const [toastItem, setToastItem] = useState<ToastEvent | null>(null)

  useEffect(() => {
    const unsubCeleb = onCelebrate((event) => {
      setCelebration(event)
    })
    const unsubToast = onToast((event) => {
      setToastItem(event)
      const timer = setTimeout(() => {
        setToastItem(null)
      }, 4000)
      return () => clearTimeout(timer)
    })

    return () => {
      unsubCeleb()
      unsubToast()
    }
  }, [])

  const closeCelebration = useCallback(() => {
    setCelebration(null)
  }, [])

  const HighlightIcon = celebration?.highlightIcon ? ICON_MAP[celebration.highlightIcon] ?? Flame : Flame

  return (
    <>
      {/* Toast Alert */}
      {toastItem && (
        <div className="fixed top-6 right-6 z-[100000] flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#131316] border border-[#232328] shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-white animate-slide-in-right max-w-sm">
          {toastItem.tone === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          ) : toastItem.tone === 'info' ? (
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-sm font-medium flex-1">{toastItem.message}</span>
          <button
            onClick={() => setToastItem(null)}
            className="text-zinc-500 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Celebration Modal */}
      {celebration && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          {/* Confetti */}
          {Array.from({ length: 32 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}

          {/* Celebration Card */}
          <div className="relative w-full max-w-md bg-[#131316] border border-[#232328] rounded-3xl p-6 md:p-8 flex flex-col items-center text-center shadow-[0_0_60px_rgba(249,115,22,0.25)] animate-scale-up z-10">
            {/* Close Button */}
            <button
              onClick={closeCelebration}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/40 hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mascot or Custom Image */}
            <div className="mb-2">
              <Mascot
                mood={celebration.mood ?? 'celebrate'}
                source={celebration.image}
                size={160}
              />
            </div>

            {/* Highlight Pill */}
            {celebration.highlight && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-bold mb-3 shadow-[0_0_12px_rgba(249,115,22,0.2)]">
                <HighlightIcon className="w-4 h-4" />
                <span>{celebration.highlight}</span>
              </div>
            )}

            {/* Title & Message */}
            <h2 className="text-2xl font-black text-white tracking-tight">
              {celebration.title}
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mt-2 mb-6">
              {celebration.message}
            </p>

            {/* Week Strip (Duolingo style) */}
            {celebration.week && (
              <div className="w-full flex justify-between bg-zinc-900/70 border border-zinc-800/60 rounded-2xl p-3 mb-6">
                {celebration.week.map((d, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <span
                      className={`text-xs font-bold mb-1.5 ${
                        d.today ? 'text-orange-400' : 'text-zinc-400'
                      }`}
                    >
                      {d.label}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${
                        d.done
                          ? 'bg-orange-500'
                          : 'border-2 border-zinc-700 bg-transparent'
                      }`}
                    >
                      {d.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={closeCelebration}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base shadow-[0_4px_20px_rgba(249,115,22,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {celebration.cta ?? 'Keep going'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
