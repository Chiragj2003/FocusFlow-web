import React from 'react'
import { FlameMark } from './FlameMark'

interface BrandMarkProps {
  size?: number
  className?: string
}

/**
 * The FocusFlow flame-check mark on a dark rounded tile with a warm glow (app-icon style).
 */
export function BrandMark({ size = 56, className = '' }: BrandMarkProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 border border-orange-500/30 bg-[#131316] shadow-[0_0_24px_rgba(249,115,22,0.35)] transition-transform duration-200 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
      }}
    >
      <FlameMark size={Math.round(size * 0.62)} />
    </div>
  )
}
