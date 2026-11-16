import React from 'react'
import Image from 'next/image'

export const FLAMES = {
  out: '/flames/flame-out.png',
  spark: '/flames/flame-1-spark.png',
  small: '/flames/flame-2-small.png',
  medium: '/flames/flame-3-medium.png',
  large: '/flames/flame-4-large.png',
  blue: '/flames/flame-5-blue.png',
  legendary: '/flames/flame-6-legendary.png',
  frozen: '/flames/flame-frozen.png',
}

/** The flame grows with the streak: out → spark → small → medium → large → blue → legendary. */
export function flameForStreak(days: number): string {
  if (days <= 0) return FLAMES.out
  if (days < 3) return FLAMES.spark
  if (days < 7) return FLAMES.small
  if (days < 14) return FLAMES.medium
  if (days < 30) return FLAMES.large
  if (days < 100) return FLAMES.blue
  return FLAMES.legendary
}

export const FROZEN_FLAME = FLAMES.frozen

export interface StreakFlameProps {
  days: number
  size?: number
  className?: string
}

export function StreakFlame({ days, size = 28, className = '' }: StreakFlameProps) {
  return (
    <Image
      src={flameForStreak(days)}
      alt={`${days} day streak flame`}
      width={size}
      height={size}
      className={`inline-block object-contain select-none shrink-0 ${className}`}
    />
  )
}

const MILESTONE_IMAGES: Record<number, string> = {
  3: '/milestones/m3.png',
  7: '/milestones/m7.png',
  14: '/milestones/m14.png',
  21: '/milestones/m21.png',
  30: '/milestones/m30.png',
  60: '/milestones/m60.png',
  100: '/milestones/m100.png',
  365: '/milestones/m365.png',
}

/** Milestone scene for an exact streak day (3, 7, 14, 21, 30, 60, 100, 365), else undefined. */
export function milestoneImage(days: number): string | undefined {
  return MILESTONE_IMAGES[days]
}

export const STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 100, 365]
