import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { i18nToast } from '../../utils/i18nToast'
import { useTranslation } from '../../hooks/useTranslation'
import {
  ensureGoogleProfile,
  ensureUserDocument,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '../../services/authService'
import { useAuthStore } from '../../store/useAuthStore'
import {
  digitsFromRoom,
  formatRoomLocation,
  roomValidationMessage,
} from '../../utils/roomNumber'

function AuthModal() {
  const { t } = useTranslation()
  const isOpen = useAuthStore((state) => state.authModalOpen)
  const mode = useAuthStore((state) => state.authMode)
  const setAuthMode = useAuthStore((state) => state.setAuthMode)
  const closeAuthModal = useAuthStore((state) => state.closeAuthModal)
  const setUser = useAuthStore((state) => state.setUser)

  const [nickname, setNickname] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    if (!isOpen) return
    setLoading(false)
  }, [isOpen, mode])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signup') {
        const roomError = roomValidationMessage(roomNumber, t)
        if (roomError) {
          i18nToast.error(roomError)
          return
        }
        const location = formatRoomLocation(roomNumber)

        const appUser = await signUpWithEmail({
          email: email.trim(),
          password,
          nickname: nickname.trim(),
          location,
        })
        setUser(appUser)
        i18nToast.success(t('signupSuccess'))
      } else {
        const appUser = await signInWithEmail({
          email: email.trim(),
          password,
        })
        setUser(appUser)
        i18nToast.success(t('loginSuccess'))
      }
      closeAuthModal()
    } catch (err) {
      i18nToast.authError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)

    try {
      const firebaseUser = await signInWithGoogle()

      if (mode === 'signup') {
        const roomError = roomValidationMessage(roomNumber, t)
        if (roomError) {
          i18nToast.error(roomError)
          return
        }
        const location = formatRoomLocation(roomNumber)

        const existing = await ensureGoogleProfile(firebaseUser, {
          nickname: nickname.trim(),
          location,
        })
        setUser(existing)
        i18nToast.success(t('signupSuccess'))
      } else {
        const appUser = await ensureUserDocument(firebaseUser, 'google')
        setUser(appUser)
        i18nToast.success(t('loginSuccess'))
      }

      closeAuthModal()
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        i18nToast.authError(err)
      }
    } finally {
      setLoading(false)
    }
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
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6 dark:bg-slate-900 dark:shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1b76fb]">
                  {t('dormName')}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50">
                  {mode === 'login' ? t('login') : t('signup')}
                </h2>
              </div>
              <button
                type="button"
                aria-label={t('closeModal')}
                onClick={closeAuthModal}
                disabled={loading}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <motion.button
                layout
                type="button"
                disabled={loading}
                onClick={() => setAuthMode('login')}
                className={`relative rounded-lg py-2 text-sm font-semibold transition disabled:opacity-50 ${
                  mode === 'login' ? 'text-[#1b76fb]' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {mode === 'login' && (
                  <motion.span
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 rounded-lg bg-white shadow dark:bg-slate-700 dark:shadow-black/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{t('loginTab')}</span>
              </motion.button>
              <motion.button
                layout
                type="button"
                disabled={loading}
                onClick={() => setAuthMode('signup')}
                className={`relative rounded-lg py-2 text-sm font-semibold transition disabled:opacity-50 ${
                  mode === 'signup' ? 'text-[#1b76fb]' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {mode === 'signup' && (
                  <motion.span
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 rounded-lg bg-white shadow dark:bg-slate-700 dark:shadow-black/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{t('signupTab')}</span>
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleAuth}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#1b76fb]/40 hover:bg-[#1b76fb]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-[#1b76fb]/20"
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
                {loading
                  ? t('processing')
                  : mode === 'login'
                    ? t('googleLogin')
                    : t('googleSignup')}
              </button>

              <div className="relative py-1">
                <span className="block h-px w-full bg-slate-200 dark:bg-slate-700" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                  {t('orEmail')}
                </span>
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('email')}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? t('password') : t('passwordSignup')}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
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
                      placeholder={t('nickname')}
                      disabled={loading}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={3}
                      value={roomNumber}
                      onChange={(e) =>
                        setRoomNumber(digitsFromRoom(e.target.value))
                      }
                      placeholder={t('roomPlaceholder')}
                      disabled={loading}
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                layout
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-[#1b76fb] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1667d8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={loading ? 'loading' : mode}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="inline-block"
                  >
                    {loading
                      ? t('processing')
                      : mode === 'login'
                        ? t('loginSubmit')
                        : t('signupSubmit')}
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
