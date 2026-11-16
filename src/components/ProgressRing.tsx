/* ==================== ORIGINAL CODE START ====================
'use client'

import { cn as _cn } from '@/lib/utils'

interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
  showValue?: boolean
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#8b5cf6',
  label,
  sublabel,
  showValue = true,
}: ProgressRingProps) {
  const percentage = Math.min(100, (value / max) * 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#27272a"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <div className="text-center">
          <p className="text-sm font-medium text-white">{label}</p>
          {sublabel && (
            <p className="text-xs text-zinc-500">{sublabel}</p>
          )}
        </div>
      )}
    </div>
  )
}

interface MultiProgressRingsProps {
  rings: {
    value: number
    max?: number
    color: string
    label: string
  }[]
  size?: number
}

export function MultiProgressRings({
  rings,
  size = 160,
}: MultiProgressRingsProps) {
  const baseStrokeWidth = 10
  const gap = 4

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {rings.map((ring, idx) => {
            const strokeWidth = baseStrokeWidth
            const offset = idx * (baseStrokeWidth + gap)
            const radius = (size - strokeWidth) / 2 - offset
            const circumference = radius * 2 * Math.PI
            const percentage = Math.min(100, (ring.value / (ring.max || 100)) * 100)
            const dashOffset = circumference - (percentage / 100) * circumference

            return (
              <g key={idx}>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#27272a"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-500 ease-out"
                />
              </g>
            )
          })}
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {rings.map((ring, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: ring.color }}
            />
            <span className="text-xs text-zinc-400">
              {ring.label}: {Math.round(ring.value)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
==================== ORIGINAL CODE END ==================== */

'use client'

import React from 'react'

export interface ProgressRingProps {
  value?: number
  max?: number
  progress?: number // alternative: 0..1
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
  sublabel?: string
  showValue?: boolean
  knob?: boolean
  children?: React.ReactNode
}

/**
 * Orange→amber gradient progress ring with an optional glowing end knob.
 * Replicates focusflow-expo's signature glowing ring.
 */
export function ProgressRing({
  value,
  max = 100,
  progress,
  size = 120,
  strokeWidth = 10,
  color,
  trackColor = '#27272a',
  label,
  sublabel,
  showValue = true,
  knob = false,
  children,
}: ProgressRingProps) {
  const p = progress !== undefined ? Math.max(0, Math.min(1, progress)) : Math.max(0, Math.min(1, (value ?? 0) / max))
  const percentage = Math.round(p * 100)
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const cx = size / 2

  // Knob position (ring starts at 12 o'clock, clockwise)
  const angle = p * 2 * Math.PI - Math.PI / 2
  const kx = cx + r * Math.cos(angle)
  const ky = cx + r * Math.sin(angle)

  const gradId = `ffRingGrad-${size}-${strokeWidth}`

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative select-none" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          {p > 0 && (
            <circle
              cx={cx}
              cy={cx}
              r={r}
              fill="none"
              stroke={color || `url(#${gradId})`}
              strokeWidth={strokeWidth}
              strokeDasharray={`${c} ${c}`}
              strokeDashoffset={c * (1 - p)}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cx})`}
              className="transition-all duration-500 ease-out"
            />
          )}

          {/* Glowing knob at the tip */}
          {knob && p > 0 && p < 1 && (
            <g className="transition-all duration-500">
              <circle cx={kx} cy={ky} r={strokeWidth * 0.95} fill="#fbbf24" opacity="0.3" />
              <circle cx={kx} cy={ky} r={strokeWidth * 0.55} fill="#fde68a" />
            </g>
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {children ? (
            children
          ) : showValue ? (
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {percentage}%
            </span>
          ) : null}
        </div>
      </div>

      {label && (
        <div className="text-center">
          <p className="text-sm font-semibold text-white">{label}</p>
          {sublabel && <p className="text-xs text-zinc-400">{sublabel}</p>}
        </div>
      )}
    </div>
  )
}

interface MultiProgressRingsProps {
  rings: {
    value: number
    max?: number
    color: string
    label: string
  }[]
  size?: number
}

export function MultiProgressRings({
  rings,
  size = 160,
}: MultiProgressRingsProps) {
  const baseStrokeWidth = 10
  const gap = 4

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 overflow-visible">
          {rings.map((ring, idx) => {
            const strokeWidth = baseStrokeWidth
            const offset = idx * (baseStrokeWidth + gap)
            const radius = (size - strokeWidth) / 2 - offset
            const circumference = radius * 2 * Math.PI
            const percentage = Math.min(100, (ring.value / (ring.max || 100)) * 100)
            const dashOffset = circumference - (percentage / 100) * circumference

            return (
              <g key={idx}>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#27272a"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-500 ease-out"
                />
              </g>
            )
          })}
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {rings.map((ring, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: ring.color }}
            />
            <span className="text-xs text-zinc-400">
              {ring.label}: {Math.round(ring.value)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
