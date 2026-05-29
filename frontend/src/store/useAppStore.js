import { create } from 'zustand'
import { scrollToTop } from '../utils/scrollToTop'

export const useAppStore = create((set) => ({
  page: 'home',

  setPage: (page) => {
    set({ page })
    scrollToTop()
  },

  goHome: () => {
    set({ page: 'home' })
    scrollToTop()
  },

  openProfile: () => {
    set({ page: 'profile' })
    scrollToTop()
  },
}))
