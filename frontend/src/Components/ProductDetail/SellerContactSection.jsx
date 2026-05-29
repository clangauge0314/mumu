import { ExternalLink } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuthStore } from '../../store/useAuthStore'
import {
  formatContactDisplay,
  instagramProfileUrl,
  lineProfileUrl,
} from '../../utils/contactLinks'
import { isContactPlaceholder } from '../../utils/contactId'

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function LineIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.039 1.085l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  )
}

function ContactRow({ icon: Icon, label, value, href, unavailableLabel }) {
  const display = formatContactDisplay(value)

  if (!display || !href) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/40">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">{unavailableLabel}</p>
        </div>
      </div>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition hover:border-[#1b76fb]/40 hover:bg-[#1b76fb]/5 dark:border-slate-600 dark:bg-slate-800/80 dark:hover:border-[#5b9dff]/40 dark:hover:bg-[#1b76fb]/10"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1b76fb]/10 text-[#1b76fb] dark:bg-[#1b76fb]/20 dark:text-[#5b9dff]">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {display}
        </p>
      </div>
      <ExternalLink size={16} className="shrink-0 text-slate-400" />
    </a>
  )
}

function resolveSellerContact(isOwner, profileValue, listingValue) {
  if (isOwner && profileValue && !isContactPlaceholder(profileValue)) {
    return profileValue
  }
  return listingValue
}

function SellerContactSection({
  sellerInstagram,
  sellerLine,
  isOwner = false,
  ownerInstagram,
  ownerLine,
}) {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const openAuthModal = useAuthStore((s) => s.openAuthModal)

  const instagram = resolveSellerContact(
    isOwner,
    ownerInstagram ?? user?.instagramId,
    sellerInstagram,
  )
  const line = resolveSellerContact(isOwner, ownerLine ?? user?.lineId, sellerLine)

  if (!user && !isOwner) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('detailSellerContact')}
        </h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
          {t('detailContactLoginRequired')}
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="rounded-lg bg-[#1b76fb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1667d8]"
        >
          {t('login')}
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {isOwner ? t('detailMyContact') : t('detailSellerContact')}
      </h2>
      {isOwner && (
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {t('detailContactOwnerHint')}
        </p>
      )}
      <div className="space-y-2">
        <ContactRow
          icon={InstagramIcon}
          label={t('instagramLabel')}
          value={instagram}
          href={instagramProfileUrl(instagram)}
          unavailableLabel={t('detailContactUnavailable')}
        />
        <ContactRow
          icon={LineIcon}
          label={t('lineLabel')}
          value={line}
          href={lineProfileUrl(line)}
          unavailableLabel={t('detailContactUnavailable')}
        />
      </div>
    </div>
  )
}

export default SellerContactSection
