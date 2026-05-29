import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { formatRoomLocation, roomValidationMessage } from '../utils/roomNumber'

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

function buildFirestoreProfile(firebaseUser, { nickname, location, provider }) {
  const resolvedNickname = resolveNickname(firebaseUser, nickname)

  return {
    email: firebaseUser.email ?? '',
    nickname: resolvedNickname,
    location: location?.trim() || null,
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

  const profile = buildFirestoreProfile(firebaseUser, { provider })
  await saveUserProfile(firebaseUser.uid, profile, { isNew: true })
  return mapAppUser(firebaseUser, profile)
}

export async function signUpWithEmail({ email, password, nickname, location }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const displayName = resolveNickname(cred.user, nickname)

  await updateProfile(cred.user, { displayName })

  const profile = buildFirestoreProfile(cred.user, {
    nickname: displayName,
    location,
    provider: 'email',
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

export async function completeGoogleSignUp(firebaseUser, { nickname, location }) {
  const displayName = resolveNickname(firebaseUser, nickname)

  const profile = buildFirestoreProfile(firebaseUser, {
    nickname: displayName,
    location,
    provider: 'google',
  })

  await saveUserProfile(firebaseUser.uid, profile, { isNew: true })

  if (displayName !== firebaseUser.displayName) {
    await updateProfile(firebaseUser, { displayName })
  }

  return mapAppUser(firebaseUser, profile)
}

export async function ensureGoogleProfile(firebaseUser, { nickname, location }) {
  const existing = await getUserProfile(firebaseUser.uid)
  if (existing) return resolveAppUser(firebaseUser)

  return completeGoogleSignUp(firebaseUser, { nickname, location })
}

export async function updateUserProfile(uid, { nickname, location }) {
  const firebaseUser = auth.currentUser
  if (!firebaseUser || firebaseUser.uid !== uid) {
    throw new Error('로그인 상태를 확인할 수 없어요.')
  }

  const trimmedNickname = nickname.trim()
  const roomError = roomValidationMessage(location)
  if (!trimmedNickname) throw new Error('닉네임을 입력해 주세요.')
  if (roomError) throw new Error(roomError)

  const trimmedLocation = formatRoomLocation(location)
  if (!trimmedLocation) throw new Error('호실 번호는 숫자 3자리여야 해요.')

  const existing = await getUserProfile(uid)
  const provider = existing?.provider ?? 'email'

  const profile = buildFirestoreProfile(firebaseUser, {
    nickname: trimmedNickname,
    location: trimmedLocation,
    provider,
  })

  await saveUserProfile(uid, profile)
  await updateProfile(firebaseUser, { displayName: trimmedNickname })

  return mapAppUser(firebaseUser, profile)
}

export async function signOutUser() {
  await signOut(auth)
}

export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback)
}
