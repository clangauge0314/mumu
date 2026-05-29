import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { i18nToast } from '../../utils/i18nToast'
import { languages } from '../../config/locales'
import { useTranslation } from '../../hooks/useTranslation'
import { useLanguageStore } from '../../store/useLanguageStore'

function LanguageModal() {
  const isOpen = useLanguageStore((state) => state.languageModalOpen)
  const locale = useLanguageStore((state) => state.locale)
  const setLocale = useLanguageStore((state) => state.setLocale)
  const closeLanguageModal = useLanguageStore((state) => state.closeLanguageModal)
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeLanguageModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeLanguageModal])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleSelect = (id) => {
    if (id === locale) {
      closeLanguageModal()
      return
    }
    setLocale(id)
    closeLanguageModal()
    i18nToast.successForLocale(id, 'languageChanged')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-end justify-center bg-black/45 px-4 pb-6 sm:items-center sm:pb-0"
          onClick={closeLanguageModal}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 dark:shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {t('languageTitle')}
              </h2>
              <button
                type="button"
                onClick={closeLanguageModal}
                aria-label={t('closeModal')}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <ul className="space-y-1">
              {languages.map((lang) => {
                const selected = locale === lang.id
                return (
                  <li key={lang.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(lang.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-medium transition ${
                        selected
                          ? 'bg-[#1b76fb]/10 text-[#1b76fb] dark:bg-[#1b76fb]/20 dark:text-[#5b9dff]'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {lang.label}
                      {selected && <Check size={18} className="shrink-0" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LanguageModal
