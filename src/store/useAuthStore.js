import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  authModalOpen: false,
  authMode: 'login',

  login: ({ nickname = 'mumu_user', location = '강남구 역삼동' } = {}) =>
    set({
      user: {
        id: 1,
        nickname,
        location,
      },
      authModalOpen: false,
    }),

  logout: () => set({ user: null }),

  openAuthModal: (mode = 'login') =>
    set({ authModalOpen: true, authMode: mode }),

  closeAuthModal: () => set({ authModalOpen: false }),

  setAuthMode: (mode) => set({ authMode: mode }),
}))
