/* ==================== ORIGINAL CODE START ====================
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, RotateCcw, Check, X, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FocusTimerProps {
  isOpen: boolean
  onClose: () => void
  habitId?: string
  habitTitle?: string
  targetMinutes?: number
  onComplete?: (duration: number) => void
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

const TIMER_PRESETS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

export function FocusTimer({
  isOpen,
  onClose,
  habitId: _habitId,
  habitTitle,
  targetMinutes = 25,
  onComplete,
}: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus')
  const [timeLeft, setTimeLeft] = useState(targetMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [sessions, setSessions] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3')
    return () => {
      audioRef.current = null
    }
  }, [])

  const handleTimerComplete = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }

    if (mode === 'focus') {
      setSessions((prev) => prev + 1)
      const focusDuration = TIMER_PRESETS.focus / 60
      setTotalFocusTime((prev) => prev + focusDuration * 60)
    }
  }, [mode, soundEnabled])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, handleTimerComplete])

  useEffect(() => {
    if (isRunning && mode === 'focus' && !startTimeRef.current) {
      startTimeRef.current = Date.now()
    } else if (!isRunning && startTimeRef.current && mode === 'focus') {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setTotalFocusTime((prev) => prev + elapsed)
      startTimeRef.current = null
    }
  }, [isRunning, mode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    if (newMode === 'focus') {
      setTimeLeft(targetMinutes * 60)
    } else {
      setTimeLeft(TIMER_PRESETS[newMode])
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    if (mode === 'focus') {
      setTimeLeft(targetMinutes * 60)
    } else {
      setTimeLeft(TIMER_PRESETS[mode])
    }
  }

  const handleSaveAndClose = () => {
    if (onComplete && totalFocusTime > 0) {
      onComplete(Math.floor(totalFocusTime / 60))
    }
    onClose()
  }

  const progress = mode === 'focus' 
    ? ((targetMinutes * 60 - timeLeft) / (targetMinutes * 60)) * 100
    : ((TIMER_PRESETS[mode] - timeLeft) / TIMER_PRESETS[mode]) * 100

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleSaveAndClose}
      />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-5 sm:p-8 mx-2">
        <button
          onClick={handleSaveAndClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-zinc-500 hover:text-white rounded-lg transition-colors"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Focus Timer</h2>
          {habitTitle && (
            <p className="text-zinc-400 text-xs sm:text-sm truncate px-4">Working on: {habitTitle}</p>
          )}
        </div>

        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 bg-zinc-800/50 p-1 rounded-xl">
          {[
            { key: 'focus', label: 'Focus' },
            { key: 'shortBreak', label: 'Short' },
            { key: 'longBreak', label: 'Long' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleModeChange(tab.key as TimerMode)}
              className={cn(
                'flex-1 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-lg transition-colors',
                mode === tab.key
                  ? 'bg-white text-zinc-900'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex items-center justify-center mb-6 sm:mb-8">
          <svg className="w-44 h-44 sm:w-56 sm:h-56 -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-zinc-800"
            />
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke={mode === 'focus' ? '#22c55e' : '#3b82f6'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - progress / 100)}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-bold text-white font-mono">
              {formatTime(timeLeft)}
            </span>
            <span className="text-zinc-500 text-xs sm:text-sm mt-1.5 sm:mt-2 capitalize">
              {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={handleReset}
            className="p-2.5 sm:p-3 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
          >
            <RotateCcw size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              'p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-colors',
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            )}
          >
            {isRunning ? <Pause size={24} className="sm:w-7 sm:h-7" /> : <Play size={24} className="sm:w-7 sm:h-7" />}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              'p-2.5 sm:p-3 rounded-xl transition-colors',
              soundEnabled
                ? 'text-white bg-zinc-700'
                : 'text-zinc-500 bg-zinc-800 hover:bg-zinc-700'
            )}
          >
            {soundEnabled ? <Volume2 size={18} className="sm:w-5 sm:h-5" /> : <VolumeX size={18} className="sm:w-5 sm:h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-800/50 rounded-xl">
          <div className="text-center">
            <p className="text-zinc-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1">Sessions</p>
            <p className="text-lg sm:text-xl font-bold text-white">{sessions}</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1">Total Focus</p>
            <p className="text-lg sm:text-xl font-bold text-white">
              {Math.floor(totalFocusTime / 60)}m
            </p>
          </div>
        </div>

        {totalFocusTime > 0 && (
          <button
            onClick={handleSaveAndClose}
            className="w-full mt-3 sm:mt-4 py-2.5 sm:py-3 px-4 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
            Save {Math.floor(totalFocusTime / 60)} minutes
          </button>
        )}
      </div>
    </div>
  )
}
==================== ORIGINAL CODE END ==================== */

'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  X,
  Volume2,
  VolumeX,
  Flame,
  Coffee,
  Leaf,
  Music,
  Check,
} from 'lucide-react'
import { ProgressRing } from './ProgressRing'
import { FlameMark } from './ui/FlameMark'
import { celebrate, toast } from '@/lib/celebrate'
import { messages } from '@/lib/messages'

interface FocusTimerProps {
  isOpen: boolean
  onClose: () => void
  habitId?: string
  habitTitle?: string
  targetMinutes?: number
  onComplete?: (duration: number) => void
}

type Mode = 'focus' | 'short' | 'long'
type TimerState = 'idle' | 'running' | 'paused'

const MODES: { id: Mode; label: string; icon: React.ComponentType<{ className?: string }>; minutes?: number }[] = [
  { id: 'focus', label: 'Focus', icon: Flame },
  { id: 'short', label: 'Short break', icon: Coffee, minutes: 5 },
  { id: 'long', label: 'Long break', icon: Leaf, minutes: 15 },
]

const FOCUS_PRESETS = [15, 25, 45, 60]

const SOUNDS = [
  { id: 'none', label: 'Silence', src: null },
  { id: 'rain', label: 'Rain', src: '/audio/rain.m4a' },
  { id: 'ocean', label: 'Ocean waves', src: '/audio/ocean.m4a' },
  { id: 'forest', label: 'Forest', src: '/audio/forest.m4a' },
  { id: 'cafe', label: 'Café', src: '/audio/cafe.m4a' },
  { id: 'brown_noise', label: 'Brown noise', src: '/audio/brown_noise.m4a' },
  { id: 'lofi_chill', label: 'Lo-fi chill', src: '/audio/lofi_chill.m4a' },
  { id: 'lofi_rain', label: 'Lo-fi rainy night', src: '/audio/lofi_rain.m4a' },
]

export function FocusTimer({
  isOpen,
  onClose,
  habitId: _habitId,
  habitTitle,
  targetMinutes = 25,
  onComplete,
}: FocusTimerProps) {
  const [mode, setMode] = useState<Mode>('focus')
  const [focusMinutes, setFocusMinutes] = useState(targetMinutes || 25)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60)
  const [selectedSound, setSelectedSound] = useState(SOUNDS[0])
  const [soundMenuOpen, setSoundMenuOpen] = useState(false)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [sessionsCount, setSessionsCount] = useState(0)

  const endAtRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const durationSec = (mode === 'focus' ? focusMinutes : MODES.find((m) => m.id === mode)!.minutes!) * 60
  const progress = timerState === 'idle' ? 0 : 1 - timeLeft / durationSec

  // Keep display synchronized when idle
  useEffect(() => {
    if (timerState === 'idle') {
      setTimeLeft(durationSec)
    }
  }, [durationSec, timerState])

  // Audio control
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.loop = true
    }

    if (selectedSound.src) {
      audioRef.current.src = selectedSound.src
      if (timerState === 'running') {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    } else {
      audioRef.current.pause()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [selectedSound, timerState])

  const finishSession = useCallback(() => {
    endAtRef.current = null
    setTimerState('idle')

    if (mode !== 'focus') {
      celebrate({
        title: 'Break’s over',
        message: messages.breakDone(),
        mood: 'happy',
        cta: 'Let’s focus',
      })
      setMode('focus')
      return
    }

    const minutes = Math.round(durationSec / 60)
    setTotalFocusTime((prev) => prev + durationSec)
    setSessionsCount((prev) => prev + 1)

    // Trigger celebration
    celebrate({
      title: 'Session complete!',
      message: messages.focusDone(minutes),
      mood: 'focus',
      highlight: `${minutes} min focused`,
      highlightIcon: 'time',
      cta: 'Nice',
    })

    // If auto logging
    if (onComplete) {
      onComplete(minutes)
    }
  }, [mode, durationSec, onComplete])

  // Timer Tick
  useEffect(() => {
    if (timerState !== 'running') return
    const tick = () => {
      if (!endAtRef.current) return
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000))
      setTimeLeft(left)
      if (left === 0) {
        finishSession()
      }
    }
    tick()
    const interval = setInterval(tick, 500)
    return () => clearInterval(interval)
  }, [timerState, finishSession])

  const start = () => {
    const remaining = timerState === 'paused' ? timeLeft : durationSec
    endAtRef.current = Date.now() + remaining * 1000
    setTimerState('running')
  }

  const pause = () => {
    endAtRef.current = null
    setTimerState('paused')
  }

  const reset = () => {
    endAtRef.current = null
    setTimerState('idle')
    setTimeLeft(durationSec)
  }

  const skip = () => {
    endAtRef.current = null
    setTimerState('idle')
    if (mode !== 'focus') setMode('focus')
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    if (onComplete && totalFocusTime > 0) {
      onComplete(Math.floor(totalFocusTime / 60))
    }
    onClose()
  }

  if (!isOpen) return null

  const running = timerState === 'running'
  const statusLabel = running
    ? mode === 'focus'
      ? 'Focusing'
      : 'On a break'
    : timerState === 'paused'
    ? 'Paused'
    : 'Ready'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
      />
      <div className="relative bg-[#131316] border border-[#232328] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-lg w-full p-6 md:p-8 animate-scale-up z-10">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/40 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">Focus Timer</h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            {habitTitle ? `Working on: ${habitTitle}` : 'One task. Full attention.'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-[#18181d] border border-[#232328] p-1.5 rounded-full mb-6">
          {MODES.map((m) => {
            const active = mode === m.id
            const IconComp = m.icon
            return (
              <button
                key={m.id}
                disabled={timerState !== 'idle'}
                onClick={() => setMode(m.id)}
                className={`flex-1 py-2 px-3 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  active
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_2px_10px_rgba(249,115,22,0.35)]'
                    : 'text-zinc-400 hover:text-white'
                } ${timerState !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <IconComp className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            )
          })}
        </div>

        {/* Signature Glowing Ring */}
        <div className="flex flex-col items-center justify-center my-6">
          <div
            className="rounded-full transition-shadow duration-500"
            style={{
              boxShadow: `0 0 ${running ? 36 : 20}px rgba(249, 115, 22, ${running ? 0.35 : 0.15})`,
            }}
          >
            <ProgressRing
              size={220}
              strokeWidth={14}
              progress={progress}
              trackColor="#232328"
              knob
            >
              <div className="flex flex-col items-center">
                <FlameMark size={38} />
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter mt-1 tabular-nums font-mono">
                  {formatTime(timeLeft)}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mt-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      running
                        ? 'bg-emerald-400 animate-pulse'
                        : timerState === 'paused'
                        ? 'bg-amber-400'
                        : 'bg-orange-500'
                    }`}
                  />
                  <span>{statusLabel}</span>
                </div>
              </div>
            </ProgressRing>
          </div>
        </div>

        {/* Quick Length Chips (Focus mode, idle) */}
        {mode === 'focus' && timerState === 'idle' && (
          <div className="flex items-center gap-2 mb-6">
            {FOCUS_PRESETS.map((mins) => {
              const active = focusMinutes === mins
              return (
                <button
                  key={mins}
                  onClick={() => setFocusMinutes(mins)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    active
                      ? 'bg-orange-500/15 border-orange-500 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                      : 'bg-[#18181d] border-[#232328] text-zinc-400 hover:text-white'
                  }`}
                >
                  {mins}m
                </button>
              )
            })}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Reset */}
          <button
            onClick={reset}
            disabled={timerState === 'idle'}
            className="w-12 h-12 rounded-full bg-[#18181d] border border-[#232328] text-zinc-400 hover:text-white disabled:opacity-40 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Big Play / Pause button */}
          <button
            onClick={running ? pause : start}
            className="w-18 h-18 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center shadow-[0_0_24px_rgba(249,115,22,0.45)] transition-all hover:scale-105 active:scale-95"
            title={running ? 'Pause' : 'Start'}
          >
            {running ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          {/* Stop / Skip */}
          <button
            onClick={skip}
            disabled={timerState === 'idle'}
            className="w-12 h-12 rounded-full bg-[#18181d] border border-[#232328] text-zinc-400 hover:text-white disabled:opacity-40 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title={mode === 'focus' ? 'End session' : 'Skip break'}
          >
            <Square className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Sound Selector */}
        <div className="relative mb-5">
          <button
            type="button"
            onClick={() => setSoundMenuOpen(!soundMenuOpen)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#18181d] border border-[#232328] text-xs font-bold text-zinc-300 hover:border-orange-500/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              {selectedSound.id === 'none' ? (
                <VolumeX className="w-4 h-4 text-zinc-500" />
              ) : (
                <Music className="w-4 h-4 text-orange-400" />
              )}
              <span>Ambient Sound:</span>
              <span className="text-orange-400">{selectedSound.label}</span>
            </div>
            <Volume2 className="w-4 h-4 text-zinc-400" />
          </button>

          {soundMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-2xl bg-[#18181d] border border-[#232328] shadow-2xl space-y-1 max-h-48 overflow-y-auto z-20 animate-scale-up">
              {SOUNDS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSound(s)
                    setSoundMenuOpen(false)
                    toast(`🎵 Sound set to ${s.label}`)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedSound.id === s.id
                      ? 'bg-orange-500/15 text-orange-400 font-bold'
                      : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <span>{s.label}</span>
                  {selectedSound.id === s.id && <Check className="w-4 h-4 text-orange-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#18181d] border border-[#232328] text-center">
          <div>
            <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Completed Sessions</span>
            <p className="text-xl font-black text-white mt-0.5">{sessionsCount}</p>
          </div>
          <div>
            <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Total Focus Time</span>
            <p className="text-xl font-black text-white mt-0.5">
              {Math.floor(totalFocusTime / 60)} min
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
