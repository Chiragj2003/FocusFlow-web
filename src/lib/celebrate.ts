/**
 * App-wide event bus for celebrations and toasts in FocusFlow Web.
 * Call celebrate() or toast() from anywhere; CelebrationModal in root/layout renders them.
 */

export interface WeekDay {
  label: string // "M", "T", "W", "T", "F", "S", "S"
  done: boolean
  today: boolean
}

export type MascotMood =
  | 'idle'
  | 'happy'
  | 'celebrate'
  | 'proud'
  | 'streak'
  | 'checklist'
  | 'thinking'
  | 'sad'
  | 'sleeping'
  | 'focus'

export interface CelebrationEvent {
  title: string
  message: string
  mood?: MascotMood
  image?: string // e.g. "/flames/flame-6-legendary.png" or "/milestones/m7.png"
  week?: WeekDay[]
  highlight?: string
  highlightIcon?: 'flame' | 'trophy' | 'time' | 'checkmark' | 'sparkles' | 'star'
  cta?: string
}

export type ToastTone = 'success' | 'info' | 'error'

export interface ToastEvent {
  message: string
  tone?: ToastTone
}

type Listener<T> = (event: T) => void

const celebrationListeners = new Set<Listener<CelebrationEvent>>()
const toastListeners = new Set<Listener<ToastEvent>>()

export function celebrate(event: CelebrationEvent) {
  celebrationListeners.forEach((l) => l(event))
}

export function toast(event: ToastEvent | string) {
  const e = typeof event === 'string' ? { message: event } : event
  toastListeners.forEach((l) => l(e))
}

export function onCelebrate(listener: Listener<CelebrationEvent>) {
  celebrationListeners.add(listener)
  return () => {
    celebrationListeners.delete(listener)
  }
}

export function onToast(listener: Listener<ToastEvent>) {
  toastListeners.add(listener)
  return () => {
    toastListeners.delete(listener)
  }
}
