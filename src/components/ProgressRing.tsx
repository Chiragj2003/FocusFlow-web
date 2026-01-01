'use client'

// cn utility available if needed for future styling
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
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#27272a"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
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
                {/* Background circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#27272a"
                  strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
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
      {/* Legend */}
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
