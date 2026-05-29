import { useState } from 'react'
import { Languages, LogIn, Menu, Plus, User, X } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { useLanguageStore } from '../../store/useLanguageStore'
import { motion, AnimatePresence } from 'framer-motion'
import { branding } from '../../config/branding'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'

function SellButton({ className = '', onClick, fullWidth = false, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1b76fb] font-semibold text-white transition hover:bg-[#1667d8] active:scale-[0.98] ${
        fullWidth ? 'w-full py-2.5 text-sm' : 'h-10 px-3 text-sm sm:px-4'
      } ${className}`}
    >
      <Plus size={18} className="shrink-0" />
      <span className={fullWidth ? 'inline' : 'hidden sm:inline'}>{label}</span>
    </button>
  )
}

function Navbar({ onOpenListingModal }) {
  const [isOpen, setIsOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const authReady = useAuthStore((state) => state.authReady)
  const openAuthModal = useAuthStore((state) => state.openAuthModal)
  const goHome = useAppStore((state) => state.goHome)
  const openProfile = useAppStore((state) => state.openProfile)
  const openLanguageModal = useLanguageStore((state) => state.openLanguageModal)
  const isLoggedIn = Boolean(user)
  const { t } = useTranslation()

  const locationLabel = user?.location || t('roomUnregistered')

  const closeMenu = () => setIsOpen(false)

  const handleOpenAuthModal = (mode = 'login') => {
    openAuthModal(mode)
    closeMenu()
  }

  const handleOpenListingModal = () => {
    onOpenListingModal?.()
    closeMenu()
  }

  const handleOpenProfile = () => {
    openProfile()
    closeMenu()
  }

  const handleGoHome = (event) => {
    event.preventDefault()
    goHome()
    closeMenu()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#1b76fb]/20 bg-white/95 backdrop-blur-md dark:border-[#1b76fb]/30 dark:bg-slate-900/95">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-14 items-center gap-4 sm:h-16">
          <a
            href="/"
            onClick={handleGoHome}
            className="shrink-0 text-xl font-extrabold tracking-tight text-[#1b76fb] transition hover:opacity-80 sm:text-[1.35rem]"
          >
            {branding.siteName}
          </a>

          <div className="flex-1" aria-hidden />

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            {!authReady ? (
              <span
                className="inline-block h-10 w-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
                aria-hidden
              />
            ) : isLoggedIn ? (
              <>
                <SellButton
                  className="hidden sm:inline-flex"
                  onClick={handleOpenListingModal}
                  label={t('listItem')}
                />
                <button
                  type="button"
                  onClick={handleOpenProfile}
                  className="hidden h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-sm font-medium text-slate-700 transition hover:border-[#1b76fb]/30 hover:bg-[#1b76fb]/10 sm:flex lg:px-3 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-[#1b76fb]/20"
                  aria-label={t('myProfile')}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b76fb] text-xs font-bold text-white">
                    {user.nickname.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[88px] truncate lg:inline">
                    {user.nickname}
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleOpenAuthModal('login')}
                  className="hidden h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:border-[#1b76fb]/40 hover:text-[#1b76fb] sm:inline-flex dark:border-slate-600 dark:text-slate-200 dark:hover:border-[#5b9dff]/50 dark:hover:text-[#5b9dff]"
                >
                  <LogIn size={16} />
                  {t('login')}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAuthModal('login')}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:border-[#1b76fb]/40 hover:text-[#1b76fb] sm:hidden dark:border-slate-600 dark:text-slate-200 dark:hover:border-[#5b9dff]/50 dark:hover:text-[#5b9dff]"
                >
                  <LogIn size={16} />
                  {t('login')}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={openLanguageModal}
              aria-label={t('language')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-[#1b76fb]/40 hover:text-[#1b76fb] sm:hidden dark:border-slate-600 dark:text-slate-200 dark:hover:border-[#5b9dff]/50 dark:hover:text-[#5b9dff]"
            >
              <Languages size={20} />
            </button>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-label={t('openMenu')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-slate-100 lg:hidden dark:border-slate-800"
          >
            <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                {!authReady ? null : isLoggedIn ? (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenProfile}
                      className="flex w-full items-center gap-3 rounded-lg bg-slate-50 px-3 py-3 text-left transition hover:bg-slate-100 sm:flex-1 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b76fb] text-sm font-bold text-white">
                        {user.nickname.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {user.nickname}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {locationLabel}
                          {user.profileError && ` · ${t('profileLoadFailed')}`}
                        </p>
                      </div>
                      <User size={18} className="shrink-0 text-[#1b76fb]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenProfile}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-[#1b76fb]/40 hover:text-[#1b76fb] sm:hidden dark:border-slate-600 dark:text-slate-300 dark:hover:text-[#5b9dff]"
                    >
                      <User size={16} />
                      {t('myProfile')}
                    </button>
                    <SellButton
                      fullWidth
                      className="sm:w-auto sm:min-w-[140px]"
                      onClick={handleOpenListingModal}
                      label={t('listItem')}
                    />
                  </>
                ) : (
                  <p className="text-center text-xs text-slate-500 sm:text-left dark:text-slate-400">
                    {t('loginHint')}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
