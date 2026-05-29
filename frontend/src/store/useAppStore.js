import { create } from 'zustand'
import { isPlaceholderRoom } from '../utils/roomNumber'
import { scrollToTop } from '../utils/scrollToTop'
import { useAuthStore } from './useAuthStore'

export const useAppStore = create((set) => ({
  page: 'home',
  fabMenuOpen: false,
  listingModalOpen: false,
  editingListing: null,
  selectedListingId: null,

  setFabMenuOpen: (fabMenuOpen) => set({ fabMenuOpen }),

  /** 신규 출품 시 000호면 false 반환 후 마이페이지로 이동 */
  openListingModal: (listing = null) => {
    const isCreate = !listing?.id
    if (isCreate) {
      const user = useAuthStore.getState().user
      if (user && isPlaceholderRoom(user.location)) {
        set({
          page: 'profile',
          fabMenuOpen: false,
          listingModalOpen: false,
          editingListing: null,
          selectedListingId: null,
        })
        scrollToTop()
        return false
      }
    }
    set({ listingModalOpen: true, editingListing: listing, fabMenuOpen: false })
    return true
  },

  closeListingModal: () =>
    set({ listingModalOpen: false, editingListing: null }),

  setPage: (page) => {
    set({ page })
    scrollToTop()
  },

  goHome: () => {
    set({ page: 'home', fabMenuOpen: false, selectedListingId: null })
    scrollToTop()
  },

  openProfile: () => {
    set({ page: 'profile', fabMenuOpen: false, selectedListingId: null })
    scrollToTop()
  },

  openListingDetail: (listingId) => {
    set({ page: 'listing', selectedListingId: listingId, fabMenuOpen: false })
    scrollToTop()
  },

  closeListingDetail: () => {
    set({ page: 'home', selectedListingId: null })
    scrollToTop()
  },
}))
