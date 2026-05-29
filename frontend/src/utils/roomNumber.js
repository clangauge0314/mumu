/** 호실 번호: 숫자 3자리 → Firestore `101호` 형식 */

export function digitsFromRoom(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 3)
}

export function formatRoomLocation(roomNumber) {
  const digits = digitsFromRoom(roomNumber)
  if (digits.length !== 3) return null
  return `${digits}호`
}

/** Google 가입 시 호실 미입력 → 프로필에서 수정 */
export const GOOGLE_SIGNUP_DEFAULT_ROOM_DIGITS = '000'

export function defaultGoogleSignupLocation() {
  return formatRoomLocation(GOOGLE_SIGNUP_DEFAULT_ROOM_DIGITS)
}

/** Google 가입 임시 호실(000호) — 출품 전 프로필 수정 필요 */
export function isPlaceholderRoom(location) {
  return digitsFromRoom(location) === GOOGLE_SIGNUP_DEFAULT_ROOM_DIGITS
}

export function parseRoomForInput(location) {
  return digitsFromRoom(location)
}

export function getRoomValidationErrorKey(roomNumber) {
  const digits = digitsFromRoom(roomNumber)
  if (!digits) return 'roomErrorRequired'
  if (digits.length !== 3) return 'roomErrorInvalid'
  return null
}

export function roomValidationMessage(roomNumber, t) {
  const key = getRoomValidationErrorKey(roomNumber)
  return key ? t(key) : null
}
