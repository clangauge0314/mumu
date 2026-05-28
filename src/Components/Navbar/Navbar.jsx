import { useState } from 'react'
import { LogIn, LogOut, Menu, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore'

const publicNavItems = [
  { label: '홈', href: '#' },
  { label: '동네생활', href: '#' },
]

const authNavItems = [
  { label: '홈', href: '#' },
  { label: '동네생활', href: '#' },
  { label: '채팅', href: '#' },
  { label: '나의 mumu', href: '#' },
]

function SellButton({ className = '', onClick, fullWidth = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1b76fb] font-semibold text-white transition hover:bg-[#1667d8] active:scale-[0.98] ${
        fullWidth ? 'w-full py-2.5 text-sm' : 'h-10 px-3 text-sm sm:px-4'
      } ${className}`}
    >
      <Plus size={18} className="shrink-0" />
      <span className={fullWidth ? 'inline' : 'hidden sm:inline'}>판매하기</span>
    </button>
  )
}

function Navbar({ onOpenListingModal }) {
  const [isOpen, setIsOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const openAuthModal = useAuthStore((state) => state.openAuthModal)
  const isLoggedIn = Boolean(user)

  const navItems = isLoggedIn ? authNavItems : publicNavItems
  const closeMenu = () => setIsOpen(false)

  const handleOpenAuthModal = (mode = 'login') => {
    openAuthModal(mode)
    closeMenu()
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  const handleOpenListingModal = () => {
    onOpenListingModal?.()
    closeMenu()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#1b76fb]/20 bg-white/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-14 items-center gap-4 sm:h-16">
          <a
            href="#"
            className="shrink-0 text-xl font-extrabold tracking-tight text-[#1b76fb] sm:text-[1.35rem]"
          >
            mumu
          </a>

          <div className="flex-1" aria-hidden />

          <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="whitespace-nowrap text-sm font-medium text-slate-600 transition-colors hover:text-[#1b76fb]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            {isLoggedIn ? (
              <>
                <SellButton
                  className="hidden sm:inline-flex"
                  onClick={handleOpenListingModal}
                />
                <button
                  type="button"
                  className="hidden h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-sm font-medium text-slate-700 transition hover:border-[#1b76fb]/30 hover:bg-[#1b76fb]/10 sm:flex lg:px-3"
                  aria-label="내 프로필"
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
                  className="hidden h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:border-[#1b76fb]/40 hover:text-[#1b76fb] sm:inline-flex"
                >
                  <LogIn size={16} />
                  로그인
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAuthModal('login')}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:border-[#1b76fb]/40 hover:text-[#1b76fb] sm:hidden"
                >
                  <LogIn size={16} />
                  로그인
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-label="메뉴 열기"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
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
            className="overflow-hidden border-t border-slate-100 lg:hidden"
          >
            <div className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6">
              <ul>
                {navItems.map((item) => (
                  <li key={`mobile-${item.label}`}>
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      className="flex py-3.5 text-sm font-medium text-slate-700 transition hover:text-[#1b76fb]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-3 sm:flex-1">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b76fb] text-sm font-bold text-white">
                        {user.nickname.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {user.nickname}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {user.location}
                        </p>
                      </div>
                    </div>
                    <SellButton
                      fullWidth
                      className="sm:w-auto sm:min-w-[140px]"
                      onClick={handleOpenListingModal}
                    />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:shrink-0"
                    >
                      <LogOut size={16} />
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-center text-xs text-slate-500 sm:text-left">
                      로그인 후 판매하기를 이용할 수 있어요
                    </p>
                  </>
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
