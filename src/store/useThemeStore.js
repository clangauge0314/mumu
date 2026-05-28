import { create } from 'zustand'

const STORAGE_KEY = 'mumu-theme'

function readStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    /* ignore */
  }
  return 'light'
}

function applyThemeClass(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

const initialTheme = readStoredTheme()
applyThemeClass(initialTheme)

export const useThemeStore = create((set, get) => ({
  theme: initialTheme,

  setTheme: (theme) => {
    if (theme !== 'light' && theme !== 'dark') return
    applyThemeClass(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
    set({ theme })
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(next)
  },
}))
