import { useState } from 'react'
import { ChevronDown, ChevronUp, ImageOff, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { useMyListings } from '../../hooks/useMyListings'
import { useAppStore } from '../../store/useAppStore'
import { deleteListing } from '../../services/listingService'
import { i18nToast } from '../../utils/i18nToast'
import { formatProductPrice } from '../../utils/formatProductPrice'

const COMPACT_PREVIEW = 3

function MyListingsSection({ userId }) {
  const { t, locale } = useTranslation()
  const { listings, loaded } = useMyListings(userId)
  const openListingModal = useAppStore((s) => s.openListingModal)
  const openListingDetail = useAppStore((s) => s.openListingDetail)
  const [expanded, setExpanded] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const visibleListings = expanded ? listings : listings.slice(0, COMPACT_PREVIEW)
  const hasMore = listings.length > COMPACT_PREVIEW

  const handleDelete = async (listing) => {
    if (!window.confirm(t('listingDeleteConfirm'))) return
    setDeletingId(listing.id)
    try {
      await deleteListing(listing.id)
      i18nToast.success('listingDeletedSuccess')
    } catch {
      i18nToast.error('listingDeleteFailed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-50">
          {t('myListingsTitle')}
          {loaded && (
            <span className="ml-1.5 font-normal text-slate-500 dark:text-slate-400">
              ({listings.length})
            </span>
          )}
        </h2>
        {listings.length > 0 && hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[#1b76fb] hover:underline dark:text-[#5b9dff]"
          >
            {expanded ? (
              <>
                <ChevronUp size={14} />
                {t('myListingsCompact')}
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                {t('myListingsViewAll')}
              </>
            )}
          </button>
        )}
      </div>

      {!loaded ? (
        <p className="py-6 text-center text-sm text-slate-500">{t('loadingProducts')}</p>
      ) : listings.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {t('myListingsEmpty')}
        </p>
      ) : expanded ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {visibleListings.map((listing) => (
            <li
              key={listing.id}
              className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => openListingDetail(listing.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openListingDetail(listing.id)
                  }
                }}
                className="flex cursor-pointer gap-3 p-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                  {listing.image ? (
                    <img
                      src={listing.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <ImageOff size={20} />
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    <p
                      className="truncate text-sm font-medium text-slate-800 dark:text-slate-100"
                      title={listing.title}
                    >
                      {listing.title}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#1b76fb] dark:text-[#5b9dff]">
                      {formatProductPrice(listing.price, locale, t('freeShare'))}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{listing.time}</p>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openListingModal(listing)
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Pencil size={12} />
                      {t('listingEdit')}
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === listing.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(listing)
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-red-200 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <Trash2 size={12} />
                      {t('listingDelete')}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {visibleListings.map((listing) => (
            <li
              key={listing.id}
              role="button"
              tabIndex={0}
              onClick={() => openListingDetail(listing.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openListingDetail(listing.id)
                }
              }}
              className="flex cursor-pointer items-center gap-3 rounded-lg py-2.5 transition first:pt-0 last:pb-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                {listing.image ? (
                  <img src={listing.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <ImageOff size={16} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {listing.title}
                </p>
                <p className="text-xs font-semibold text-[#1b76fb] dark:text-[#5b9dff]">
                  {formatProductPrice(listing.price, locale, t('freeShare'))}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    openListingModal(listing)
                  }}
                  aria-label={t('listingEdit')}
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-[#1b76fb] dark:hover:bg-slate-800"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  disabled={deletingId === listing.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(listing)
                  }}
                  aria-label={t('listingDelete')}
                  className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default MyListingsSection
