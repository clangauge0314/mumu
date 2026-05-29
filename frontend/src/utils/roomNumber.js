/** 호실 번호: 숫자 3자리 → Firestore `101호` 형식 */

export function digitsFromRoom(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 3)
}

export function formatRoomLocation(roomNumber) {
  const digits = digitsFromRoom(roomNumber)
  if (digits.length !== 3) return null
  return `${digits}호`
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
