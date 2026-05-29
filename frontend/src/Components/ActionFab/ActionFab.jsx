import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Globe,
  LogIn,
  LogOut,
  Menu,
  Moon,
  PackagePlus,
  Sun,
  User,
  X,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useLanguageStore } from '../../store/useLanguageStore'
import { useThemeStore } from '../../store/useThemeStore'
import { useTranslation } from '../../hooks/useTranslation'
import { i18nToast } from '../../utils/i18nToast'

function ActionFab() {
  const { t } = useTranslation()
  const fabMenuOpen = useAppStore((state) => state.fabMenuOpen)
  const setFabMenuOpen = useAppStore((state) => state.setFabMenuOpen)
  const openListingModal = useAppStore((state) => state.openListingModal)
  const goHome = useAppStore((state) => state.goHome)
  const openProfile = useAppStore((state) => state.openProfile)
  const user = useAuthStore((state) => state.user)
  const authReady = useAuthStore((state) => state.authReady)
  const openAuthModal = useAuthStore((state) => state.openAuthModal)
  const logout = useAuthStore((state) => state.logout)
  const openLanguageModal = useLanguageStore((state) => state.openLanguageModal)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const isDark = theme === 'dark'
  const isLoggedIn = Boolean(user)
  const backdropGuardRef = useRef(false)

  useEffect(() => {
    if (!fabMenuOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setFabMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [fabMenuOpen, setFabMenuOpen])

  const closeMenu = () => setFabMenuOpen(false)

  const openMenu = () => {
    backdropGuardRef.current = true
    setFabMenuOpen(true)
    window.setTimeout(() => {
      backdropGuardRef.current = false
    }, 320)
  }

  const handleToggle = () => {
    if (fabMenuOpen) {
      closeMenu()
      return
    }
    openMenu()
  }

  const handleBackdropClose = () => {
    if (backdropGuardRef.current) return
    closeMenu()
  }

  const handleLogin = () => {
    closeMenu()
    openAuthModal('login')
  }

  const handleProfile = () => {
    closeMenu()
    openProfile()
  }

  const handleLogout = async () => {
    closeMenu()
    try {
      await logout()
      goHome()
      i18nToast.success(t('logoutSuccess'))
    } catch {
      i18nToast.error(t('logoutFailed'))
    }
  }

  const handleListItem = () => {
    closeMenu()
    if (!user) {
      openAuthModal('login')
      return
    }
    if (openListingModal() === false) {
      i18nToast.warning('listingRoomPlaceholderWarn')
    }
  }

  const handleLanguage = () => {
    closeMenu()
    openLanguageModal()
  }

  const handleTheme = () => {
    toggleTheme()
    closeMenu()
  }

  /** 위 → 아래: 테마 · 언어 · 계정 · 출품(맨 아래, 파란 CTA) */
  const menuItems = [
    {
      id: 'theme',
      label: isDark ? t('themeToLight') : t('themeToDark'),
      icon: isDark ? Sun : Moon,
      onClick: handleTheme,
    },
    {
      id: 'language',
      label: t('language'),
      icon: Globe,
      onClick: handleLanguage,
    },
  ]

  if (authReady) {
    if (isLoggedIn) {
      menuItems.push(
        {
          id: 'profile',
          label: t('myProfile'),
          icon: User,
          onClick: handleProfile,
        },
        {
          id: 'logout',
          label: t('logout'),
          icon: LogOut,
          onClick: handleLogout,
        },
      )
    } else {
      menuItems.push({
        id: 'login',
        label: t('login'),
        icon: LogIn,
        onClick: handleLogin,
      })
    }
  }

  menuItems.push({
    id: 'list',
    label: t('listItem'),
    icon: PackagePlus,
    onClick: handleListItem,
  })

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <AnimatePresence>
        {fabMenuOpen && (
          <motion.div
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClose}
            className="fixed inset-0 z-[200] bg-slate-900/25 backdrop-blur-[1px] dark:bg-black/40"
          />
        )}
      </AnimatePresence>

      <div className="fixed right-4 bottom-4 z-[210] flex flex-col items-end gap-3">
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
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold shadow-lg transition dark:shadow-black/30 ${
                  item.id === 'list'
                    ? 'border-[#1b76fb] bg-[#1b76fb] text-white hover:bg-[#1667d8]'
                    : item.id === 'logout'
                      ? 'border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/40'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-[#1b76fb]/40 hover:text-[#1b76fb] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-[#5b9dff]'
                }`}
              >
                <span>{item.label}</span>
                <item.icon size={18} />
              </motion.button>
            ))}
        </AnimatePresence>

        <button
          type="button"
          aria-expanded={fabMenuOpen}
          aria-label={fabMenuOpen ? t('closeDrawer') : t('openDrawer')}
          onClick={handleToggle}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1b76fb] text-white shadow-lg shadow-[#1b76fb]/30 transition hover:bg-[#1667d8] active:scale-95 dark:shadow-black/40"
        >
          {fabMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </>,
    document.body,
  )
}

export default ActionFab
