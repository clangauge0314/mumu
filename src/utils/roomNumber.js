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

export function roomValidationMessage(roomNumber) {
  const digits = digitsFromRoom(roomNumber)
  if (!digits) return '호실 번호 3자리를 입력해 주세요.'
  if (digits.length !== 3) return '호실 번호는 숫자 3자리여야 해요.'
  return null
}
