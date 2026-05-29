import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, LogOut, Mail, User } from 'lucide-react'
import { i18nToast } from '../../utils/i18nToast'
import { useTranslation } from '../../hooks/useTranslation'
import { deleteUserAccount, updateUserProfile } from '../../services/authService'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'
import AuthFormField from '../AuthModal/AuthFormField'
import {
  digitsFromRoom,
  formatRoomLocation,
  parseRoomForInput,
  roomValidationMessage,
} from '../../utils/roomNumber'
import { contactIdForInput } from '../../utils/contactId'
import MyListingsSection from './MyListingsSection'

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1b76fb] focus:ring-2 focus:ring-[#1b76fb]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500'

function MyProfilePage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)

  const providerLabel = (provider) => {
    if (provider === 'google') return t('providerGoogle')
    if (provider === 'email') return t('providerEmail')
    return t('providerUnknown')
  }
  const setUser = useAuthStore((state) => state.setUser)
  const openAuthModal = useAuthStore((state) => state.openAuthModal)
  const logout = useAuthStore((state) => state.logout)
  const goHome = useAppStore((state) => state.goHome)

  const [nickname, setNickname] = useState('')
  const [location, setLocation] = useState('')
  const [instagramId, setInstagramId] = useState('')
  const [lineId, setLineId] = useState('')
  const [loading, setLoading] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [reauthPassword, setReauthPassword] = useState('')
  const [showReauthPassword, setShowReauthPassword] = useState(false)

  useEffect(() => {
    if (!user) return
    setNickname(user.nickname ?? '')
    setLocation(parseRoomForInput(user.location))
    setInstagramId(contactIdForInput(user.instagramId))
    setLineId(contactIdForInput(user.lineId))
  }, [user])

  useEffect(() => {
    if (user?.profileError) {
      i18nToast.warning(t('profileLoadWarn'))
    }
  }, [user?.profileError, user?.id, t])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!user) return

    const roomError = roomValidationMessage(location, t)
    if (roomError) {
      i18nToast.error(roomError)
      return
    }

    setLoading(true)

    try {
      const updated = await updateUserProfile(user.id, {
        nickname,
        location: formatRoomLocation(location),
        instagramId: instagramId.trim(),
        lineId: lineId.trim(),
      })
      setUser(updated)
      i18nToast.success(t('savedProfile'))
    } catch (err) {
      i18nToast.authError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      goHome()
      i18nToast.success(t('logoutSuccess'))
    } catch {
      i18nToast.error(t('logoutFailed'))
    } finally {
      setLoggingOut(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm(t('deleteAccountConfirm'))) return

    setDeletingAccount(true)
    try {
      await deleteUserAccount({
        password: showReauthPassword ? reauthPassword : undefined,
      })
      goHome()
      i18nToast.success(t('deleteAccountSuccess'))
    } catch (err) {
      if (err?.code === 'auth/requires-recent-login' || err?.key === 'authErrorReauthRequired') {
        setShowReauthPassword(true)
        i18nToast.warning(t('deleteAccountReauthHint'))
      } else {
        i18nToast.error(t('deleteAccountFailed'))
      }
    } finally {
      setDeletingAccount(false)
    }
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-lg py-12 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('loginRequiredProfile')}
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="mt-4 rounded-lg bg-[#1b76fb] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1667d8]"
        >
          {t('login')}
        </button>
        <button
          type="button"
          onClick={goHome}
          className="mt-3 block w-full text-sm text-slate-500 hover:text-[#1b76fb] dark:text-slate-400"
        >
          {t('goHomeBack')}
        </button>
      </section>
    )
  }

  const initial = user.nickname.charAt(0).toUpperCase()

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg"
    >
      <button
        type="button"
        onClick={goHome}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-[#1b76fb] dark:text-slate-400 dark:hover:text-[#5b9dff]"
      >
        <ArrowLeft size={16} />
        {t('goHome')}
      </button>

      <div className="mb-6 flex items-center gap-4">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="h-16 w-16 rounded-full object-cover ring-2 ring-[#1b76fb]/30"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1b76fb] text-xl font-bold text-white">
            {initial}
          </span>
        )}
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t('myInfoTitle')}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {t('dormName')}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30 sm:p-6">
        <dl className="mb-5 space-y-3 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="flex items-start gap-3 text-sm">
            <Mail size={16} className="mt-0.5 shrink-0 text-[#1b76fb]" />
            <div className="min-w-0">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t('email')}
              </dt>
              <dd className="truncate font-medium text-slate-800 dark:text-slate-100">
                {user.email || '—'}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <User size={16} className="mt-0.5 shrink-0 text-[#1b76fb]" />
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t('provider')}
              </dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">
                {providerLabel(user.provider)}
              </dd>
            </div>
          </div>
        </dl>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthFormField label={t('nickname')} required htmlFor="profile-nickname">
            <input
              id="profile-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={loading}
              required
              className={inputClass}
            />
          </AuthFormField>

          <AuthFormField label={t('roomLabel')} required htmlFor="profile-room">
            <input
              id="profile-room"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={3}
              value={location}
              onChange={(e) => setLocation(digitsFromRoom(e.target.value))}
              placeholder={t('roomPlaceholder')}
              disabled={loading}
              required
              className={inputClass}
            />
          </AuthFormField>

          <AuthFormField label={t('instagramLabel')} htmlFor="profile-instagram">
            <input
              id="profile-instagram"
              type="text"
              value={instagramId}
              onChange={(e) => setInstagramId(e.target.value)}
              placeholder={t('instagramPlaceholder')}
              disabled={loading}
              autoComplete="off"
              className={inputClass}
            />
          </AuthFormField>

          <AuthFormField label={t('lineLabel')} htmlFor="profile-line">
            <input
              id="profile-line"
              type="text"
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              placeholder={t('linePlaceholder')}
              disabled={loading}
              autoComplete="off"
              className={inputClass}
            />
          </AuthFormField>
          <button
            type="submit"
            disabled={loading || loggingOut}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b76fb] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1667d8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? t('saving') : t('save')}
          </button>
        </form>

        <div className="mt-2 space-y-2 border-t border-slate-100 pt-2 dark:border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading || loggingOut || deletingAccount}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {loggingOut ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            {loggingOut ? t('loggingOut') : t('logout')}
          </button>

          {showReauthPassword && user.provider === 'email' && (
            <input
              type="password"
              value={reauthPassword}
              onChange={(e) => setReauthPassword(e.target.value)}
              placeholder={t('password')}
              disabled={deletingAccount}
              className={inputClass}
              autoComplete="current-password"
            />
          )}

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={loading || loggingOut || deletingAccount}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            {deletingAccount && <Loader2 size={16} className="animate-spin" />}
            {deletingAccount ? t('deletingAccount') : t('deleteAccount')}
          </button>
        </div>
      </div>

      <MyListingsSection userId={user.id} />
    </motion.section>
  )
}

export default MyProfilePage
