import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import {
  deleteAllListingsBySeller,
  syncListingsSellerProfile,
} from './listingService'
import { createAppError } from '../utils/firebaseAuthErrors'
import { normalizeStoredContactId } from '../utils/contactId'
import {
  defaultGoogleSignupLocation,
  formatRoomLocation,
  getRoomValidationErrorKey,
} from '../utils/roomNumber'

const googleProvider = new GoogleAuthProvider()

function emailLocalPart(email) {
  if (!email) return ''
  return email.split('@')[0] || ''
}

function resolveNickname(firebaseUser, nickname) {
  return (
    nickname?.trim() ||
    firebaseUser.displayName?.trim() ||
    emailLocalPart(firebaseUser.email) ||
    '사용자'
  )
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export async function saveUserProfile(uid, data, { isNew = false } = {}) {
  const payload = {
    ...data,
    uid,
    updatedAt: serverTimestamp(),
  }

  if (isNew && !payload.createdAt) {
    payload.createdAt = serverTimestamp()
  }

  await setDoc(doc(db, 'users', uid), payload, { merge: true })
}

function buildFirestoreProfile(
  firebaseUser,
  { nickname, location, provider, instagramId, lineId },
) {
  const resolvedNickname = resolveNickname(firebaseUser, nickname)

  return {
    email: firebaseUser.email ?? '',
    nickname: resolvedNickname,
    location: location?.trim() || null,
    instagramId: normalizeStoredContactId(instagramId),
    lineId: normalizeStoredContactId(lineId),
    photoURL: firebaseUser.photoURL ?? null,
    provider,
  }
}

export function mapAppUser(firebaseUser, profile, { profileError = false } = {}) {
  const nickname = resolveNickname(firebaseUser, profile?.nickname)

  const location = profile?.location?.trim() || null
  const hasProfile = Boolean(profile?.nickname && profile?.location)

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    nickname,
    location,
    photoURL: profile?.photoURL ?? firebaseUser.photoURL ?? null,
    provider: profile?.provider ?? null,
    instagramId: normalizeStoredContactId(profile?.instagramId),
    lineId: normalizeStoredContactId(profile?.lineId),
    hasProfile,
    profileError,
  }
}

export async function resolveAppUser(firebaseUser) {
  try {
    const profile = await getUserProfile(firebaseUser.uid)
    return mapAppUser(firebaseUser, profile)
  } catch {
    return mapAppUser(firebaseUser, null, { profileError: true })
  }
}

/** 로그인 시 문서가 없으면 생성, 있으면 이메일·사진만 동기화 */
export async function ensureUserDocument(firebaseUser, provider) {
  const existing = await getUserProfile(firebaseUser.uid)

  if (existing) {
    await saveUserProfile(firebaseUser.uid, {
      email: firebaseUser.email ?? existing.email,
      photoURL: firebaseUser.photoURL ?? existing.photoURL ?? null,
    })
    return resolveAppUser(firebaseUser)
  }

  const profile = buildFirestoreProfile(firebaseUser, {
    provider,
    location: provider === 'google' ? defaultGoogleSignupLocation() : null,
    instagramId: null,
    lineId: null,
  })
  await saveUserProfile(firebaseUser.uid, profile, { isNew: true })
  return mapAppUser(firebaseUser, profile)
}

export async function signUpWithEmail({
  email,
  password,
  nickname,
  location,
  instagramId,
  lineId,
}) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const displayName = resolveNickname(cred.user, nickname)

  await updateProfile(cred.user, { displayName })

  const profile = buildFirestoreProfile(cred.user, {
    nickname: displayName,
    location,
    provider: 'email',
    instagramId,
    lineId,
  })

  await saveUserProfile(cred.user.uid, profile, { isNew: true })

  return mapAppUser(cred.user, profile)
}

export async function signInWithEmail({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return ensureUserDocument(cred.user, 'email')
}

export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider)
  return cred.user
}

export async function completeGoogleSignUp(
  firebaseUser,
  { nickname, location, instagramId, lineId },
) {
  const displayName = resolveNickname(firebaseUser, nickname)

  const profile = buildFirestoreProfile(firebaseUser, {
    nickname: displayName,
    location: location?.trim() || defaultGoogleSignupLocation(),
    provider: 'google',
    instagramId,
    lineId,
  })

  await saveUserProfile(firebaseUser.uid, profile, { isNew: true })

  if (displayName !== firebaseUser.displayName) {
    await updateProfile(firebaseUser, { displayName })
  }

  return mapAppUser(firebaseUser, profile)
}

export async function ensureGoogleProfile(
  firebaseUser,
  { nickname, location, instagramId, lineId },
) {
  const existing = await getUserProfile(firebaseUser.uid)
  if (existing) return resolveAppUser(firebaseUser)

  return completeGoogleSignUp(firebaseUser, {
    nickname,
    location,
    instagramId,
    lineId,
  })
}

export async function updateUserProfile(uid, { nickname, location, instagramId, lineId }) {
  const firebaseUser = auth.currentUser
  if (!firebaseUser || firebaseUser.uid !== uid) {
    throw createAppError('authErrorNotLoggedIn')
  }

  const trimmedNickname = nickname.trim()
  const roomErrorKey = getRoomValidationErrorKey(location)
  if (!trimmedNickname) throw createAppError('nicknameRequired')
  if (roomErrorKey) throw createAppError(roomErrorKey)

  const trimmedLocation = formatRoomLocation(location)
  if (!trimmedLocation) throw createAppError('roomErrorInvalid')

  const existing = await getUserProfile(uid)
  const provider = existing?.provider ?? 'email'

  const profile = buildFirestoreProfile(firebaseUser, {
    nickname: trimmedNickname,
    location: trimmedLocation,
    provider,
    instagramId,
    lineId,
  })

  await saveUserProfile(uid, profile)
  await updateProfile(firebaseUser, { displayName: trimmedNickname })
  await syncListingsSellerProfile(uid, {
    nickname: trimmedNickname,
    location: trimmedLocation,
    instagramId: profile.instagramId,
    lineId: profile.lineId,
  })

  return mapAppUser(firebaseUser, profile)
}

export async function signOutUser() {
  await signOut(auth)
}

async function deleteFirestoreProfile(uid) {
  await deleteDoc(doc(db, 'users', uid))
}

async function reauthenticateCurrentUser({ password } = {}) {
  const firebaseUser = auth.currentUser
  if (!firebaseUser) throw createAppError('authErrorNotLoggedIn')

  const usesGoogle = firebaseUser.providerData.some(
    (p) => p.providerId === 'google.com',
  )

  if (usesGoogle) {
    await reauthenticateWithPopup(firebaseUser, googleProvider)
    return
  }

  if (!password?.trim() || !firebaseUser.email) {
    throw createAppError('authErrorReauthRequired')
  }

  const credential = EmailAuthProvider.credential(
    firebaseUser.email,
    password.trim(),
  )
  await reauthenticateWithCredential(firebaseUser, credential)
}

export async function deleteUserAccount({ password } = {}) {
  const firebaseUser = auth.currentUser
  if (!firebaseUser) throw createAppError('authErrorNotLoggedIn')

  const runDelete = async (user) => {
    await deleteAllListingsBySeller(user.uid)
    await deleteFirestoreProfile(user.uid)
    await deleteUser(user)
  }

  try {
    await runDelete(firebaseUser)
  } catch (err) {
    if (err?.code !== 'auth/requires-recent-login') throw err

    await reauthenticateCurrentUser({ password })

    const refreshedUser = auth.currentUser
    if (!refreshedUser) throw createAppError('authErrorNotLoggedIn')

    await runDelete(refreshedUser)
  }
}

export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback)
}
