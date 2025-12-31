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
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
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

  // Initialize audio
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

  // Timer logic
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

  // Track focus time
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleSaveAndClose}
      />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl max-w-md w-full p-8">
        {/* Close Button */}
        <button
          onClick={handleSaveAndClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-1">Focus Timer</h2>
          {habitTitle && (
            <p className="text-zinc-400 text-sm">Working on: {habitTitle}</p>
          )}
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-8 bg-zinc-800/50 p-1 rounded-xl">
          {[
            { key: 'focus', label: 'Focus' },
            { key: 'shortBreak', label: 'Short Break' },
            { key: 'longBreak', label: 'Long Break' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleModeChange(tab.key as TimerMode)}
              className={cn(
                'flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors',
                mode === tab.key
                  ? 'bg-white text-zinc-900'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="relative flex items-center justify-center mb-8">
          <svg className="w-56 h-56 -rotate-90">
            {/* Background Circle */}
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-zinc-800"
            />
            {/* Progress Circle */}
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
            <span className="text-5xl font-bold text-white font-mono">
              {formatTime(timeLeft)}
            </span>
            <span className="text-zinc-500 text-sm mt-2 capitalize">
              {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handleReset}
            className="p-3 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              'p-5 rounded-2xl transition-colors',
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            )}
          >
            {isRunning ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              'p-3 rounded-xl transition-colors',
              soundEnabled
                ? 'text-white bg-zinc-700'
                : 'text-zinc-500 bg-zinc-800 hover:bg-zinc-700'
            )}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-800/50 rounded-xl">
          <div className="text-center">
            <p className="text-zinc-500 text-xs mb-1">Sessions</p>
            <p className="text-xl font-bold text-white">{sessions}</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-500 text-xs mb-1">Total Focus</p>
            <p className="text-xl font-bold text-white">
              {Math.floor(totalFocusTime / 60)}m
            </p>
          </div>
        </div>

        {/* Save Button */}
        {totalFocusTime > 0 && (
          <button
            onClick={handleSaveAndClose}
            className="w-full mt-4 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Check size={18} />
            Save {Math.floor(totalFocusTime / 60)} minutes
          </button>
        )}
      </div>
    </div>
  )
}
