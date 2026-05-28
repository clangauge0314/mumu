import { create } from 'zustand'
import { languages } from '../config/locales'

const STORAGE_KEY = 'mumu-locale'

function readStoredLocale() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (languages.some((lang) => lang.id === value)) return value
  } catch {
    /* ignore */
  }
  return 'ko'
}

function applyHtmlLang(locale) {
  document.documentElement.lang =
    locale === 'zh-CN' ? 'zh-Hans' : locale === 'zh-TW' ? 'zh-Hant' : locale
}

const initialLocale = readStoredLocale()
applyHtmlLang(initialLocale)

export const useLanguageStore = create((set) => ({
  locale: initialLocale,
  languageModalOpen: false,

  setLocale: (locale) => {
    if (!languages.some((lang) => lang.id === locale)) return
    applyHtmlLang(locale)
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
    set({ locale })
  },

  openLanguageModal: () => set({ languageModalOpen: true }),
  closeLanguageModal: () => set({ languageModalOpen: false }),
}))
