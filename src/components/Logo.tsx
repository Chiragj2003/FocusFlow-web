/* ==================== ORIGINAL CODE START ====================
'use client'

import Image from 'next/image'
import { useTheme } from '@/lib/theme'

interface LogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export function Logo({ size = 40, className = '', showText = true }: LogoProps) {
  const { resolvedTheme } = useTheme()
  
  // Use light logo for light theme and dark logo for dark theme
  const logoSrc = resolvedTheme === 'dark' ? '/dark.png' : '/light.png'
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src={logoSrc}
        alt="FocusFlow Logo"
        width={size}
        height={size}
        className="rounded-xl"
        priority
      />
      {showText && (
        <span className="font-bold text-xl text-foreground">FocusFlow</span>
      )}
    </div>
  )
}

// Static logo for server components (shows gradient fallback initially)
export function LogoStatic({ size = 40, className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/light.png"
        alt="FocusFlow Logo"
        width={size}
        height={size}
        className="rounded-xl dark:hidden"
        priority
      />
      <Image
        src="/dark.png"
        alt="FocusFlow Logo"
        width={size}
        height={size}
        className="rounded-xl hidden dark:block"
        priority
      />
      {showText && (
        <span className="font-bold text-xl text-foreground">FocusFlow</span>
      )}
    </div>
  )
}
==================== ORIGINAL CODE END ==================== */

'use client'

import React from 'react'
import { FlameMark } from './ui/FlameMark'

interface LogoProps {
  size?: number
  className?: string
  showText?: boolean
}

/**
 * FocusFlow Brand Logo: FlameMark + two-color wordmark (Focus in base text, Flow in primary orange).
 */
export function Logo({ size = 32, className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <FlameMark size={size} />
      {showText && (
        <span className="font-extrabold text-xl tracking-tight text-foreground">
          Focus<span className="text-orange-500">Flow</span>
        </span>
      )}
    </div>
  )
}

export function LogoStatic({ size = 32, className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <FlameMark size={size} />
      {showText && (
        <span className="font-extrabold text-xl tracking-tight text-foreground">
          Focus<span className="text-orange-500">Flow</span>
        </span>
      )}
    </div>
  )
}
