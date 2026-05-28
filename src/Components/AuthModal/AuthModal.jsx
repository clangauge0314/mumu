import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

function AuthModal() {
  const isOpen = useAuthStore((state) => state.authModalOpen)
  const mode = useAuthStore((state) => state.authMode)
  const setAuthMode = useAuthStore((state) => state.setAuthMode)
  const closeAuthModal = useAuthStore((state) => state.closeAuthModal)
  const login = useAuthStore((state) => state.login)

  const [nickname, setNickname] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeAuthModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeAuthModal])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleSubmit = (event) => {
    event.preventDefault()
    login({
      nickname: nickname.trim() || (mode === 'signup' ? 'new_mumu' : 'mumu_user'),
      location:
        mode === 'signup'
          ? `${(roomNumber || '101').trim()}호`
          : '강남구 역삼동',
    })
  }

  const handleGoogleAuth = () => {
    login({
      nickname: mode === 'signup' ? 'google_new_user' : 'google_user',
      location: mode === 'signup' ? `${(roomNumber || '101').trim()}호` : '강남구 역삼동',
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4"
          onClick={closeAuthModal}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1b76fb]">
                  mumu
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {mode === 'login' ? '로그인' : '회원가입'}
                </h2>
              </div>
              <button
                type="button"
                aria-label="모달 닫기"
                onClick={closeAuthModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <motion.button
                layout
                type="button"
                onClick={() => setAuthMode('login')}
                className={`relative rounded-lg py-2 text-sm font-semibold transition ${
                  mode === 'login' ? 'text-[#1b76fb]' : 'text-slate-500'
                }`}
              >
                {mode === 'login' && (
                  <motion.span
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 rounded-lg bg-white shadow"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">로그인</span>
              </motion.button>
              <motion.button
                layout
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`relative rounded-lg py-2 text-sm font-semibold transition ${
                  mode === 'signup' ? 'text-[#1b76fb]' : 'text-slate-500'
                }`}
              >
                {mode === 'signup' && (
                  <motion.span
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 rounded-lg bg-white shadow"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">회원가입</span>
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#1b76fb]/40 hover:bg-[#1b76fb]/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.5-5.5 3.5-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.9 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.3-.2-2H12z"
                  />
                </svg>
                {mode === 'login'
                  ? 'Google로 로그인'
                  : 'Google로 회원가입'}
              </button>

              <div className="relative py-1">
                <span className="block h-px w-full bg-slate-200" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-400">
                  또는 이메일로 계속하기
                </span>
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? '비밀번호' : '비밀번호 (6자 이상)'}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20"
                required
                minLength={mode === 'signup' ? 6 : undefined}
              />
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="signup-extra-fields"
                    initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                    transition={{ duration: 0.24 }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="닉네임"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20"
                    />
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="방 번호 (예: 101)"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                layout
                type="submit"
                className="mt-2 w-full rounded-lg bg-[#1b76fb] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1667d8]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mode}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="inline-block"
                  >
                    {mode === 'login' ? '로그인하기' : '회원가입하고 시작하기'}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal
