import { useAppStore } from '../../store/useAppStore'
import { branding } from '../../config/branding'

function Navbar() {
  const goHome = useAppStore((state) => state.goHome)
  const isFabMenuOpen = useAppStore((state) => state.fabMenuOpen)

  const handleGoHome = (event) => {
    event.preventDefault()
    goHome()
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-200 ${
        isFabMenuOpen
          ? 'border-slate-300 bg-slate-100/95 dark:border-slate-700 dark:bg-slate-800/95'
          : 'border-slate-200 bg-slate-50/95 dark:border-slate-700 dark:bg-slate-900/95'
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-14 items-center sm:h-16">
          <a
            href="/"
            onClick={handleGoHome}
            className="text-xl font-extrabold tracking-tight text-[#1b76fb] transition hover:opacity-80 sm:text-[1.35rem]"
          >
            {branding.siteName}
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
