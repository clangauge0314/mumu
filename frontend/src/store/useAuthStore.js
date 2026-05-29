import { create } from 'zustand'
import { auth } from '../lib/firebase'
import { resolveAppUser, signOutUser } from '../services/authService'

export const useAuthStore = create((set) => ({
  user: null,
  authReady: false,
  authModalOpen: false,
  authMode: 'login',

  setUser: (user) => set({ user }),
  setAuthReady: (authReady) => set({ authReady }),

  refreshUser: async () => {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      set({ user: null })
      return null
    }
    const appUser = await resolveAppUser(firebaseUser)
    set({ user: appUser })
    return appUser
  },

  logout: async () => {
    await signOutUser()
  },

  openAuthModal: (mode = 'login') =>
    set({ authModalOpen: true, authMode: mode }),

  closeAuthModal: () => set({ authModalOpen: false }),

  setAuthMode: (mode) => set({ authMode: mode }),
}))
