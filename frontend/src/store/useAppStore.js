import { create } from 'zustand'
import { scrollToTop } from '../utils/scrollToTop'

export const useAppStore = create((set) => ({
  page: 'home',
  fabMenuOpen: false,

  setFabMenuOpen: (fabMenuOpen) => set({ fabMenuOpen }),

  setPage: (page) => {
    set({ page })
    scrollToTop()
  },

  goHome: () => {
    set({ page: 'home', fabMenuOpen: false })
    scrollToTop()
  },

  openProfile: () => {
    set({ page: 'profile', fabMenuOpen: false })
    scrollToTop()
  },
}))
