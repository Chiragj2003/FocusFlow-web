import React from 'react'
import Image from 'next/image'

export type MascotMood =
  | 'idle'
  | 'happy' // waving hello
  | 'celebrate' // jumping cheer
  | 'proud'
  | 'streak' // proud, used for streak moments
  | 'checklist' // proud, used for "all done"
  | 'thinking'
  | 'sad'
  | 'sleeping'
  | 'focus'

const POSES: Record<string, string> = {
  idle: '/sparky/idle.png',
  wave: '/sparky/wave-hello.png',
  cheer: '/sparky/jump-cheer.png',
  proud: '/sparky/proud.png',
  thinking: '/sparky/thinking.png',
  sad: '/sparky/sad.png',
  sleeping: '/sparky/sleeping.png',
  focus: '/sparky/focus.png',
}

const MOOD_POSE: Record<MascotMood, string> = {
  idle: POSES.idle,
  happy: POSES.wave,
  celebrate: POSES.cheer,
  proud: POSES.proud,
  streak: POSES.proud,
  checklist: POSES.proud,
  thinking: POSES.thinking,
  sad: POSES.sad,
  sleeping: POSES.sleeping,
  focus: POSES.focus,
}

interface MascotProps {
  mood?: MascotMood
  size?: number
  className?: string
  animated?: boolean
  source?: string
  alt?: string
}

export function Mascot({
  mood = 'happy',
  size = 120,
  className = '',
  animated = true,
  source,
  alt = 'Sparky Mascot',
}: MascotProps) {
  const imgSrc = source || MOOD_POSE[mood] || POSES.idle

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        animated ? 'hover:scale-105 transition-transform duration-300' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imgSrc}
        alt={alt}
        width={size}
        height={size}
        className={`object-contain ${animated ? 'animate-sparky-bob' : ''}`}
        priority
      />
    </div>
  )
}
