import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { LISTING_STATUS, normalizeListingStatus } from '../config/listingStatus'
import { normalizeStoredContactId } from '../utils/contactId'
import { formatListingLocationLabel } from '../utils/listingDisplay'

const listingsRef = collection(db, 'listings')

function toText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function toPrice(value, isFreeShare) {
  if (isFreeShare) return 0
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) return 0
  return Math.floor(parsed)
}

function wrapFirestoreError(error) {
  if (error?.code === 'permission-denied') {
    const wrapped = new Error('LISTING_PERMISSION_DENIED')
    wrapped.code = 'permission-denied'
    wrapped.cause = error
    return wrapped
  }
  return error
}

export async function createListing({
  title,
  price,
  isFreeShare,
  category,
  description,
  imageUrls,
  seller,
}) {
  const firebaseUser = auth.currentUser
  if (!firebaseUser) {
    throw new Error('LISTING_NOT_AUTHENTICATED')
  }

  const trimmedTitle = toText(title)
  if (!trimmedTitle) throw new Error('LISTING_TITLE_REQUIRED')

  const sellerId = seller?.id ?? firebaseUser.uid
  if (sellerId !== firebaseUser.uid) {
    throw new Error('LISTING_SELLER_MISMATCH')
  }

  const payload = {
    title: trimmedTitle,
    price: toPrice(price, isFreeShare),
    category: toText(category) || 'all',
    description: toText(description),
    imageUrls: Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : [],
    sellerId,
    sellerNickname: toText(seller?.nickname) || '사용자',
    location: toText(seller?.location),
    sellerInstagram: normalizeStoredContactId(seller?.instagramId),
    sellerLine: normalizeStoredContactId(seller?.lineId),
    likes: 0,
    status: LISTING_STATUS.AVAILABLE,
    buyerId: null,
    buyerNickname: null,
    buyerLocation: null,
    purchaseRequestedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  try {
    const docRef = await addDoc(listingsRef, payload)
    return docRef.id
  } catch (error) {
    throw wrapFirestoreError(error)
  }
}

function relativeKo(date) {
  const diffSec = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000))
  if (diffSec < 60) return `${diffSec}초 전`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}시간 전`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay}일 전`
}

function mapListing(docSnap) {
  const data = docSnap.data()
  const createdAt = data.createdAt?.toDate?.()
  const location = data.location ?? ''
  const sellerNickname = data.sellerNickname ?? ''

  return {
    id: docSnap.id,
    sellerId: data.sellerId ?? '',
    title: data.title ?? '',
    price: Number.isFinite(data.price) ? data.price : 0,
    category: data.category ?? 'all',
    description: data.description ?? '',
    location,
    sellerNickname,
    sellerInstagram: normalizeStoredContactId(data.sellerInstagram),
    sellerLine: normalizeStoredContactId(data.sellerLine),
    locationLabel: formatListingLocationLabel(location, sellerNickname),
    time: createdAt ? relativeKo(createdAt) : '방금 전',
    likes: Number.isFinite(data.likes) ? data.likes : 0,
    status: normalizeListingStatus(data.status),
    buyerId: data.buyerId ?? null,
    buyerNickname: data.buyerNickname ?? null,
    buyerLocation: data.buyerLocation ?? null,
    buyerLabel: formatListingLocationLabel(
      data.buyerLocation,
      data.buyerNickname,
    ),
    imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
    image: data.imageUrls?.[0] || null,
    createdAtMs: createdAt ? createdAt.getTime() : 0,
  }
}

export async function updateListing(
  listingId,
  { title, price, isFreeShare, category, description, imageUrls, seller, status },
) {
  const firebaseUser = auth.currentUser
  if (!firebaseUser) throw new Error('LISTING_NOT_AUTHENTICATED')

  const trimmedTitle = toText(title)
  if (!trimmedTitle) throw new Error('LISTING_TITLE_REQUIRED')

  const payload = {
    title: trimmedTitle,
    price: toPrice(price, isFreeShare),
    category: toText(category) || 'all',
    description: toText(description),
    imageUrls: Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : [],
    sellerNickname: toText(seller?.nickname) || '사용자',
    location: toText(seller?.location),
    sellerInstagram: normalizeStoredContactId(seller?.instagramId),
    sellerLine: normalizeStoredContactId(seller?.lineId),
    updatedAt: serverTimestamp(),
  }

  if (status !== undefined) {
    const nextStatus = normalizeListingStatus(status)
    if (!Object.values(LISTING_STATUS).includes(nextStatus)) {
      throw new Error('LISTING_STATUS_INVALID')
    }
    payload.status = nextStatus
    if (nextStatus === LISTING_STATUS.AVAILABLE) {
      payload.buyerId = null
      payload.buyerNickname = null
      payload.buyerLocation = null
      payload.purchaseRequestedAt = null
    }
  }

  try {
    await updateDoc(doc(db, 'listings', listingId), payload)
  } catch (error) {
    throw wrapFirestoreError(error)
  }
}

export async function requestPurchase(listingId, { buyerNickname, buyerLocation }) {
  const firebaseUser = auth.currentUser
  if (!firebaseUser) throw new Error('LISTING_NOT_AUTHENTICATED')

  try {
    await updateDoc(doc(db, 'listings', listingId), {
      status: LISTING_STATUS.PURCHASE_REQUESTED,
      buyerId: firebaseUser.uid,
      buyerNickname: toText(buyerNickname) || '사용자',
      buyerLocation: toText(buyerLocation) || null,
      purchaseRequestedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    throw wrapFirestoreError(error)
  }
}

export async function updateListingTradeStatus(listingId, status) {
  const firebaseUser = auth.currentUser
  if (!firebaseUser) throw new Error('LISTING_NOT_AUTHENTICATED')

  const nextStatus = normalizeListingStatus(status)
  if (!Object.values(LISTING_STATUS).includes(nextStatus)) {
    throw new Error('LISTING_STATUS_INVALID')
  }

  try {
    await updateDoc(doc(db, 'listings', listingId), {
      status: nextStatus,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    throw wrapFirestoreError(error)
  }
}

export async function deleteListing(listingId) {
  const firebaseUser = auth.currentUser
  if (!firebaseUser) throw new Error('LISTING_NOT_AUTHENTICATED')

  try {
    await deleteDoc(doc(db, 'listings', listingId))
  } catch (error) {
    throw wrapFirestoreError(error)
  }
}

const FIRESTORE_BATCH_LIMIT = 500

/** 회원 탈퇴 시 해당 판매자의 모든 물품 삭제 */
export async function deleteAllListingsBySeller(sellerId) {
  if (!sellerId) return 0

  const q = query(listingsRef, where('sellerId', '==', sellerId))
  const snapshot = await getDocs(q)

  if (snapshot.empty) return 0

  const docs = snapshot.docs
  let deleted = 0

  for (let i = 0; i < docs.length; i += FIRESTORE_BATCH_LIMIT) {
    const batch = writeBatch(db)
    const chunk = docs.slice(i, i + FIRESTORE_BATCH_LIMIT)
    chunk.forEach((docSnap) => batch.delete(docSnap.ref))
    await batch.commit()
    deleted += chunk.length
  }

  return deleted
}

/** 프로필(닉네임·호실) 변경 시 내 물품 카드 표시도 맞춤 */
export async function syncListingsSellerProfile(
  sellerId,
  { nickname, location, instagramId, lineId },
) {
  const q = query(listingsRef, where('sellerId', '==', sellerId))
  const snapshot = await getDocs(q)

  if (snapshot.empty) return 0

  const batch = writeBatch(db)
  const sellerNickname = toText(nickname) || '사용자'
  const trimmedLocation = toText(location)

  snapshot.docs.forEach((docSnap) => {
    batch.update(docSnap.ref, {
      sellerNickname,
      location: trimmedLocation,
      sellerInstagram: normalizeStoredContactId(instagramId),
      sellerLine: normalizeStoredContactId(lineId),
      updatedAt: serverTimestamp(),
    })
  })

  await batch.commit()
  return snapshot.size
}

export function subscribeListingLike(listingId, userId, callback, onError) {
  if (!listingId || !userId) {
    callback(false)
    return () => {}
  }

  return onSnapshot(
    doc(db, 'listings', listingId, 'likes', userId),
    (snap) => callback(snap.exists()),
    (error) => onError?.(wrapFirestoreError(error)),
  )
}

/** 로그인 사용자 좋아요 토글 — listings/{id}/likes/{uid} + likes 카운트 */
export async function toggleListingLike(listingId) {
  const firebaseUser = auth.currentUser
  if (!firebaseUser) throw new Error('LISTING_NOT_AUTHENTICATED')

  const listingRef = doc(db, 'listings', listingId)
  const likeRef = doc(db, 'listings', listingId, 'likes', firebaseUser.uid)

  let likedAfter = false

  await runTransaction(db, async (transaction) => {
    const likeSnap = await transaction.get(likeRef)
    const listingSnap = await transaction.get(listingRef)
    if (!listingSnap.exists()) throw new Error('LISTING_NOT_FOUND')

    const currentLikes = Number.isFinite(listingSnap.data().likes)
      ? listingSnap.data().likes
      : 0

    if (likeSnap.exists()) {
      transaction.delete(likeRef)
      transaction.update(listingRef, {
        likes: Math.max(0, currentLikes - 1),
      })
      likedAfter = false
    } else {
      transaction.set(likeRef, { createdAt: serverTimestamp() })
      transaction.update(listingRef, { likes: currentLikes + 1 })
      likedAfter = true
    }
  })

  return likedAfter
}

export function subscribeListing(listingId, callback, onError) {
  if (!listingId) {
    callback(null)
    return () => {}
  }

  return onSnapshot(
    doc(db, 'listings', listingId),
    (snap) => {
      callback(snap.exists() ? mapListing(snap) : null)
    },
    (error) => {
      onError?.(wrapFirestoreError(error))
    },
  )
}

export function subscribeListings(callback, onError) {
  const q = query(listingsRef, orderBy('createdAt', 'desc'), limit(120))
  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map(mapListing))
    },
    (error) => {
      onError?.(wrapFirestoreError(error))
    },
  )
}

export function subscribeMyListings(sellerId, callback, onError) {
  if (!sellerId) {
    callback([])
    return () => {}
  }

  const q = query(
    listingsRef,
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc'),
    limit(50),
  )

  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map(mapListing))
    },
    (error) => {
      onError?.(wrapFirestoreError(error))
    },
  )
}
