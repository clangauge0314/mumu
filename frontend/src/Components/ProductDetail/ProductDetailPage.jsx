import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  ImageOff,
  Loader2,
  MapPin,
  Pencil,
  Tag,
  Trash2,
} from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuthStore } from '../../store/useAuthStore'
import { useAppStore } from '../../store/useAppStore'
import { getCategoryLabel } from '../../config/categories'
import { shouldShowSellerContact } from '../../config/listingStatus'
import {
  deleteListing,
  requestPurchase,
  subscribeListing,
  subscribeListingLike,
  toggleListingLike,
  updateListingTradeStatus,
} from '../../services/listingService'
import { formatProductPrice } from '../../utils/formatProductPrice'
import { i18nToast } from '../../utils/i18nToast'
import ListingStatusBadge from '../ListingStatus/ListingStatusBadge'
import ListingTradePanel from './ListingTradePanel'
import SellerContactSection from './SellerContactSection'

function ProductDetailPage() {
  const { t, locale } = useTranslation()
  const listingId = useAppStore((s) => s.selectedListingId)
  const closeListingDetail = useAppStore((s) => s.closeListingDetail)
  const openListingModal = useAppStore((s) => s.openListingModal)
  const user = useAuthStore((s) => s.user)
  const openAuthModal = useAuthStore((s) => s.openAuthModal)

  const [listing, setListing] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [likedByMe, setLikedByMe] = useState(false)
  const [likePending, setLikePending] = useState(false)
  const [tradePending, setTradePending] = useState(false)

  useEffect(() => {
    if (!listingId) return undefined

    setLoaded(false)
    const unsubscribe = subscribeListing(
      listingId,
      (item) => {
        setListing(item)
        setLoaded(true)
      },
      () => setLoaded(true),
    )
    return unsubscribe
  }, [listingId])

  useEffect(() => {
    if (!listingId || !user?.id) {
      setLikedByMe(false)
      return undefined
    }
    return subscribeListingLike(listingId, user.id, setLikedByMe)
  }, [listingId, user?.id])

  useEffect(() => {
    setActiveImage(0)
  }, [listingId])

  const isOwner = Boolean(user?.id && listing?.sellerId === user.id)
  const showContact = listing && shouldShowSellerContact(listing, user?.id)
  const images = listing?.imageUrls?.length
    ? listing.imageUrls
    : listing?.image
      ? [listing.image]
      : []
  const priceLabel = listing
    ? formatProductPrice(listing.price, locale, t('freeShare'))
    : ''

  const handleDelete = async () => {
    if (!listing || !window.confirm(t('listingDeleteConfirm'))) return
    setDeleting(true)
    try {
      await deleteListing(listing.id)
      i18nToast.success('listingDeletedSuccess')
      closeListingDetail()
    } catch {
      i18nToast.error('listingDeleteFailed')
    } finally {
      setDeleting(false)
    }
  }

  const handleLike = async (event) => {
    event.stopPropagation()
    if (!listing) return
    if (!user) {
      openAuthModal('login')
      return
    }
    if (likePending) return

    setLikePending(true)
    try {
      const likedAfter = await toggleListingLike(listing.id)
      i18nToast.success(likedAfter ? 'listingLikeSuccess' : 'listingUnlikeSuccess')
    } catch (err) {
      if (err?.message === 'LISTING_NOT_AUTHENTICATED') {
        openAuthModal('login')
      } else {
        i18nToast.error('listingLikeFailed')
      }
    } finally {
      setLikePending(false)
    }
  }

  const handleRequestPurchase = async () => {
    if (!listing) return
    if (!user) {
      openAuthModal('login')
      return
    }
    if (!window.confirm(t('tradeRequestConfirm'))) return

    setTradePending(true)
    try {
      await requestPurchase(listing.id, {
        buyerNickname: user.nickname,
        buyerLocation: user.location,
      })
      i18nToast.success('tradeRequestSuccess')
    } catch (err) {
      if (err?.message === 'LISTING_NOT_AUTHENTICATED') {
        openAuthModal('login')
      } else if (
        err?.message === 'LISTING_PERMISSION_DENIED' ||
        err?.code === 'permission-denied'
      ) {
        i18nToast.error('listingFirestorePermissionError')
      } else {
        i18nToast.error('tradeRequestFailed')
      }
    } finally {
      setTradePending(false)
    }
  }

  const handleUpdateStatus = async (status) => {
    if (!listing) return
    setTradePending(true)
    try {
      await updateListingTradeStatus(listing.id, status)
      i18nToast.success('tradeStatusUpdated')
    } catch {
      i18nToast.error('tradeStatusUpdateFailed')
    } finally {
      setTradePending(false)
    }
  }

  if (!listingId) {
    return (
      <section className="py-16 text-center">
        <p className="text-sm text-slate-500">{t('listingNotFound')}</p>
        <button
          type="button"
          onClick={closeListingDetail}
          className="mt-4 text-sm font-semibold text-[#1b76fb]"
        >
          {t('goHome')}
        </button>
      </section>
    )
  }

  if (!loaded) {
    return (
      <section className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-9 w-9 animate-spin text-[#1b76fb]" />
        <p className="mt-3 text-sm text-slate-500">{t('loadingProducts')}</p>
      </section>
    )
  }

  if (!listing) {
    return (
      <section className="py-16 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('listingNotFound')}
        </p>
        <button
          type="button"
          onClick={closeListingDetail}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1b76fb]"
        >
          <ArrowLeft size={16} />
          {t('goHome')}
        </button>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl"
    >
      <button
        type="button"
        onClick={closeListingDetail}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-[#1b76fb] dark:text-slate-400 dark:hover:text-[#5b9dff]"
      >
        <ArrowLeft size={16} />
        {t('detailBack')}
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="relative aspect-square bg-slate-100 sm:aspect-4/3 dark:bg-slate-800">
          {images.length > 0 ? (
            <img
              src={images[activeImage]}
              alt={listing.title}
              className="h-full w-full object-contain sm:object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <ImageOff size={48} strokeWidth={1.25} />
              <span className="text-sm">{t('noImage')}</span>
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span className="rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {listing.time}
            </span>
          </div>

          <button
            type="button"
            disabled={likePending}
            onClick={handleLike}
            aria-label={likedByMe ? t('detailLiked') : t('detailLike')}
            className={`absolute right-3 bottom-3 z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold shadow-lg backdrop-blur-md transition active:scale-95 disabled:opacity-60 ${
              likedByMe
                ? 'bg-red-500 text-white ring-2 ring-white/80'
                : 'bg-white/95 text-slate-700 ring-1 ring-slate-200/80 hover:bg-white dark:bg-slate-900/90 dark:text-slate-100 dark:ring-slate-600'
            }`}
          >
            {likePending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Heart size={18} className={likedByMe ? 'fill-current' : ''} />
            )}
            <span className="tabular-nums">{listing.likes}</span>
          </button>
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-b border-slate-100 p-3 dark:border-slate-800">
            {images.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  activeImage === index
                    ? 'border-[#1b76fb]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="mb-1 flex items-start justify-between gap-3">
            <h1
              className="min-w-0 flex-1 truncate text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50"
              title={listing.title}
            >
              {listing.title}
            </h1>
            <ListingStatusBadge status={listing.status} />
          </div>
          <p
            className={`mb-3 text-lg font-bold sm:text-xl ${
              listing.price === 0
                ? 'text-[#1b76fb] dark:text-[#5b9dff]'
                : 'text-slate-900 dark:text-slate-50'
            }`}
          >
            {priceLabel}
          </p>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="inline-flex max-w-full items-center gap-1 truncate">
              <MapPin size={14} className="shrink-0 text-[#1b76fb]" />
              <span className="truncate">
                {listing.locationLabel || t('roomUnregistered')}
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Tag size={14} />
              {getCategoryLabel(listing.category, t)}
            </span>
          </div>

          <ListingTradePanel
            listing={listing}
            userId={user?.id}
            isOwner={isOwner}
            onRequestPurchase={handleRequestPurchase}
            onUpdateStatus={handleUpdateStatus}
            pending={tradePending}
          />

          <div className="mb-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('detailDescription')}
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {listing.description?.trim() || t('detailNoDescription')}
            </p>
          </div>

          {showContact ? (
            <SellerContactSection
              sellerInstagram={listing.sellerInstagram}
              sellerLine={listing.sellerLine}
              isOwner={isOwner}
              ownerInstagram={user?.instagramId}
              ownerLine={user?.lineId}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('detailSellerContact')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {!user
                  ? t('detailContactLoginRequired')
                  : t('detailContactAfterRequest')}
              </p>
              {!user && (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="mt-3 rounded-lg bg-[#1b76fb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1667d8]"
                >
                  {t('login')}
                </button>
              )}
            </div>
          )}

          {isOwner && (
            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button
                type="button"
                onClick={() => openListingModal(listing)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#1b76fb]/40 hover:text-[#1b76fb] dark:border-slate-600 dark:text-slate-200"
              >
                <Pencil size={16} />
                {t('listingEdit')}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                {deleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {t('listingDelete')}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}

export default ProductDetailPage
