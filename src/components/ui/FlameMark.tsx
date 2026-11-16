import React from 'react'

interface FlameMarkProps {
  size?: number
  className?: string
  /** 'brand' = orange gradient, otherwise a solid color (e.g. '#ffffff') */
  color?: 'brand' | string
}

/**
 * The FocusFlow flame-check mark: a flame rising out of a checkmark.
 * Drawn as crisp vector SVG matching the mobile app.
 */
export function FlameMark({ size = 32, className = '', color = 'brand' }: FlameMarkProps) {
  const fill = color === 'brand' ? 'url(#ffFlameWeb)' : color
  const fillCheck = color === 'brand' ? 'url(#ffCheckWeb)' : color

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient id="ffFlameWeb" x1="0.2" y1="1" x2="0.6" y2="0">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="ffCheckWeb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Flame */}
      <path
        d="M52 6c3 14-6 20-12 28-7 9-9 17-7 26l14 13 27-27c2-10-2-19-9-26 1 8-2 13-6 15 3-11-1-21-7-29z"
        fill={fill}
      />
      {/* Inner flame tongue */}
      <path
        d="M64 30c6 7 8 14 6 21l-9 9c2-6 1-12-3-17 4-3 6-8 6-13z"
        fill={fill}
        opacity={0.75}
      />
      {/* Checkmark */}
      <path
        d="M14 54c3-3 8-3 11 0l17 17 37-37c3-3 8-3 11 0s3 8 0 11L48 87c-3 3-8 3-11 0L14 65c-3-3-3-8 0-11z"
        fill={fillCheck}
      />
    </svg>
  )
}
