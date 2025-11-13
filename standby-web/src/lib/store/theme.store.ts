'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ActiveTheme = 'light' | 'dark'

interface ThemeState {
  themeMode: ThemeMode
  activeTheme: ActiveTheme
  setThemeMode: (mode: ThemeMode) => void
  initTheme: () => void
}

const getSystemTheme = (): ActiveTheme => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getActiveTheme = (mode: ThemeMode): ActiveTheme => {
  if (mode === 'system') {
    return getSystemTheme()
  }
  return mode
}

const applyTheme = (theme: ActiveTheme) => {
  if (typeof window === 'undefined') return

  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      activeTheme: 'light',

      setThemeMode: (mode) => {
        const activeTheme = getActiveTheme(mode)
        set({ themeMode: mode, activeTheme })
        applyTheme(activeTheme)
      },

      initTheme: () => {
        const mode = get().themeMode
        const activeTheme = getActiveTheme(mode)
        set({ activeTheme })
        applyTheme(activeTheme)

        // Listen to system theme changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          const handleChange = () => {
            const currentMode = get().themeMode
            if (currentMode === 'system') {
              const newActiveTheme = getSystemTheme()
              set({ activeTheme: newActiveTheme })
              applyTheme(newActiveTheme)
            }
          }

          mediaQuery.addEventListener('change', handleChange)
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ themeMode: state.themeMode }),
    }
  )
)
