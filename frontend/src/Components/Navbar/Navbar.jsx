import { User } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useTranslation } from '../../hooks/useTranslation'
import { branding } from '../../config/branding'

function Navbar() {
  const { t } = useTranslation()
  const goHome = useAppStore((state) => state.goHome)
  const openProfile = useAppStore((state) => state.openProfile)
  const isFabMenuOpen = useAppStore((state) => state.fabMenuOpen)
  const user = useAuthStore((state) => state.user)
  const authReady = useAuthStore((state) => state.authReady)
  const openAuthModal = useAuthStore((state) => state.openAuthModal)

  const handleGoHome = (event) => {
    event.preventDefault()
    goHome()
  }

  const nickname = user?.nickname?.trim() || t('nickname')
  const location = user?.location?.trim() || t('roomUnregistered')

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-200 ${
        isFabMenuOpen
          ? 'border-slate-300 bg-slate-100/95 dark:border-slate-700 dark:bg-slate-800/95'
          : 'border-slate-200 bg-slate-50/95 dark:border-slate-700 dark:bg-slate-900/95'
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-14 items-center justify-between gap-3 sm:h-16">
          <a
            href="/"
            onClick={handleGoHome}
            className="shrink-0 text-xl font-extrabold tracking-tight text-[#1b76fb] transition hover:opacity-80 sm:text-[1.35rem]"
          >
            {branding.siteName}
          </a>

          {authReady && (
            <div className="flex min-w-0 items-center justify-end">
              {user ? (
                <button
                  type="button"
                  onClick={openProfile}
                  className="inline-flex max-w-[min(100%,14rem)] items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-200/70 sm:max-w-xs sm:px-3 dark:hover:bg-slate-800/70"
                  aria-label={t('myProfile')}
                >
                  <User
                    size={16}
                    className="shrink-0 text-[#1b76fb] dark:text-[#5b9dff]"
                    aria-hidden
                  />
                  <span className="min-w-0 truncate text-sm text-slate-700 dark:text-slate-200">
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {nickname}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400"> · {location}</span>
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#1b76fb] transition hover:bg-[#1b76fb]/10 dark:text-[#5b9dff] dark:hover:bg-[#1b76fb]/20"
                >
                  {t('login')}
                </button>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
