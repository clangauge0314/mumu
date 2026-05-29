import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe, Moon, PackagePlus, Plus, Sun, X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useLanguageStore } from '../../store/useLanguageStore'
import { useThemeStore } from '../../store/useThemeStore'
import { useTranslation } from '../../hooks/useTranslation'

function ActionFab({ onOpenListingModal }) {
  const { t } = useTranslation()
  const fabMenuOpen = useAppStore((state) => state.fabMenuOpen)
  const setFabMenuOpen = useAppStore((state) => state.setFabMenuOpen)
  const user = useAuthStore((state) => state.user)
  const openAuthModal = useAuthStore((state) => state.openAuthModal)
  const openLanguageModal = useLanguageStore((state) => state.openLanguageModal)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const isDark = theme === 'dark'

  useEffect(() => {
    if (!fabMenuOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setFabMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [fabMenuOpen, setFabMenuOpen])

  const closeMenu = () => setFabMenuOpen(false)

  const handleToggle = () => setFabMenuOpen(!fabMenuOpen)

  const handleListItem = () => {
    closeMenu()
    if (!user) {
      openAuthModal('login')
      return
    }
    onOpenListingModal?.()
  }

  const handleLanguage = () => {
    closeMenu()
    openLanguageModal()
  }

  const handleTheme = () => {
    toggleTheme()
  }

  const menuItems = [
    {
      id: 'list',
      label: t('listItem'),
      icon: PackagePlus,
      onClick: handleListItem,
    },
    {
      id: 'language',
      label: t('language'),
      icon: Globe,
      onClick: handleLanguage,
    },
    {
      id: 'theme',
      label: isDark ? t('themeToLight') : t('themeToDark'),
      icon: isDark ? Sun : Moon,
      onClick: handleTheme,
    },
  ]

  return (
    <>
      <AnimatePresence>
        {fabMenuOpen && (
          <motion.button
            type="button"
            aria-label={t('closeModal')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[1px] dark:bg-black/40"
          />
        )}
      </AnimatePresence>

      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {fabMenuOpen &&
            menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 16, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.9 }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 26,
                  delay: index * 0.04,
                }}
                onClick={item.onClick}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-lg transition hover:border-[#1b76fb]/40 hover:text-[#1b76fb] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:shadow-black/30 dark:hover:text-[#5b9dff]"
              >
                <span>{item.label}</span>
                <item.icon size={18} />
              </motion.button>
            ))}
        </AnimatePresence>

        <motion.button
          type="button"
          aria-expanded={fabMenuOpen}
          aria-label={fabMenuOpen ? t('closeModal') : t('openMenu')}
          onClick={handleToggle}
          whileTap={{ scale: 0.92 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1b76fb] text-white shadow-lg shadow-[#1b76fb]/30 transition hover:bg-[#1667d8] dark:shadow-black/40"
        >
          <motion.span
            animate={{ rotate: fabMenuOpen ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          >
            {fabMenuOpen ? <X size={24} /> : <Plus size={24} />}
          </motion.span>
        </motion.button>
      </div>
    </>
  )
}

export default ActionFab
