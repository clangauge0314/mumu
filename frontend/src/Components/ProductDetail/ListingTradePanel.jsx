import { Loader2, MessageCircle, PackageCheck, ShoppingBag } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import {
  LISTING_STATUS,
  canRequestPurchase,
  normalizeListingStatus,
} from '../../config/listingStatus'
import ListingStatusBadge from '../ListingStatus/ListingStatusBadge'

function ListingTradePanel({
  listing,
  userId,
  isOwner,
  onRequestPurchase,
  onUpdateStatus,
  pending = false,
}) {
  const { t } = useTranslation()
  const status = normalizeListingStatus(listing?.status)
  const isBuyer = Boolean(userId && listing?.buyerId === userId)
  const canRequest = canRequestPurchase(listing, userId)

  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('tradeStatusTitle')}
        </h2>
        <ListingStatusBadge status={status} />
      </div>

      {status === LISTING_STATUS.PURCHASE_REQUESTED && listing.buyerNickname && (
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
          {t('tradeBuyerLabel', { name: listing.buyerNickname })}
        </p>
      )}

      {isOwner && status === LISTING_STATUS.PURCHASE_REQUESTED && (
        <button
          type="button"
          disabled={pending}
          onClick={() => onUpdateStatus(LISTING_STATUS.IN_PROGRESS)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b76fb] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1667d8] disabled:opacity-60"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
          {t('tradeActionStart')}
        </button>
      )}

      {isOwner && status === LISTING_STATUS.IN_PROGRESS && (
        <button
          type="button"
          disabled={pending}
          onClick={() => onUpdateStatus(LISTING_STATUS.COMPLETED)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <PackageCheck size={16} />}
          {t('tradeActionComplete')}
        </button>
      )}

      {canRequest && (
        <button
          type="button"
          disabled={pending}
          onClick={onRequestPurchase}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b76fb] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1667d8] disabled:opacity-60"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
          {t('tradeActionRequest')}
        </button>
      )}

      {isBuyer && status === LISTING_STATUS.PURCHASE_REQUESTED && (
        <p className="text-center text-sm font-medium text-amber-700 dark:text-amber-300">
          {t('tradeRequestSent')}
        </p>
      )}

      {!isOwner &&
        !canRequest &&
        !isBuyer &&
        status === LISTING_STATUS.PURCHASE_REQUESTED && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('tradeAlreadyRequested')}
          </p>
        )}

      {status === LISTING_STATUS.COMPLETED && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('tradeCompletedHint')}</p>
      )}

      {status === LISTING_STATUS.AVAILABLE && !isOwner && !userId && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('tradeLoginToRequest')}</p>
      )}
    </div>
  )
}

export default ListingTradePanel
