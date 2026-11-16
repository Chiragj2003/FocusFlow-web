/* ==================== ORIGINAL CODE START ====================
'use client'

import { createContext, useContext, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    // Get saved theme from localStorage, default to 'system'
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setThemeState(savedTheme)
    } else {
      // Set system as default if no theme saved
      setThemeState('system')
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark')
        setResolvedTheme('dark')
      } else {
        root.classList.remove('dark')
        setResolvedTheme('light')
      }
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mediaQuery.matches)

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      applyTheme(theme === 'dark')
    }
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
==================== ORIGINAL CODE END ==================== */

'use client'

import { createContext, useContext, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * FocusFlow is permanently dark mode across the entire app.
 * Light mode has been removed per brand guidelines.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: Theme = 'dark'
  const resolvedTheme = 'dark' as const

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
    localStorage.setItem('theme', 'dark')
  }, [])

  const setTheme = (_newTheme: Theme) => {
    // Permanent dark mode enforced
    const root = document.documentElement
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
    localStorage.setItem('theme', 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    return {
      theme: 'dark' as Theme,
      setTheme: () => {},
      resolvedTheme: 'dark' as const,
    }
  }
  return context
}
