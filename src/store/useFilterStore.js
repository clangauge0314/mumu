import { create } from 'zustand'
import { defaultFilters } from '../config/filters'

export const useFilterStore = create((set) => ({
  ...defaultFilters,
  isFilterOpen: false,

  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  setMinPrice: (minPrice) => set({ minPrice, freeOnly: false }),
  setMaxPrice: (maxPrice) => set({ maxPrice, freeOnly: false }),
  setFreeOnly: (freeOnly) =>
    set({
      freeOnly,
      ...(freeOnly ? { minPrice: '', maxPrice: '' } : {}),
    }),
  setSort: (sort) => set({ sort }),
  setFilterOpen: (isFilterOpen) => set({ isFilterOpen }),

  toggleFilterOpen: () =>
    set((state) => ({ isFilterOpen: !state.isFilterOpen })),

  resetFilters: () => set({ ...defaultFilters }),
}))
