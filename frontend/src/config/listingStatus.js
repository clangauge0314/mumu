export const LISTING_STATUS = {
  AVAILABLE: 'available',
  PURCHASE_REQUESTED: 'purchase_requested',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
}

const LEGACY_ACTIVE = 'active'

export function normalizeListingStatus(status) {
  if (!status || status === LEGACY_ACTIVE) return LISTING_STATUS.AVAILABLE
  if (Object.values(LISTING_STATUS).includes(status)) return status
  return LISTING_STATUS.AVAILABLE
}

export function getListingStatusLabelKey(status) {
  const normalized = normalizeListingStatus(status)
  return `tradeStatus_${normalized}`
}

/** 구매 요청 이후에만 판매자 연락처 공개 */
export function shouldShowSellerContact(listing, userId) {
  const status = normalizeListingStatus(listing?.status)
  if (
    status !== LISTING_STATUS.PURCHASE_REQUESTED &&
    status !== LISTING_STATUS.IN_PROGRESS
  ) {
    return false
  }
  if (!userId) return false
  const isOwner = listing.sellerId === userId
  const isBuyer = listing.buyerId === userId
  return isOwner || isBuyer
}

export function canRequestPurchase(listing, userId) {
  if (!listing || !userId) return false
  if (listing.sellerId === userId) return false
  return normalizeListingStatus(listing.status) === LISTING_STATUS.AVAILABLE
}
