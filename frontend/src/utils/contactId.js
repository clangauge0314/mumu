/** 연락처 미입력 시 Firestore 저장값 */
export const CONTACT_PLACEHOLDER = '***'

export function normalizeStoredContactId(value) {
  const trimmed = String(value ?? '').trim()
  return trimmed || CONTACT_PLACEHOLDER
}

/** 프로필/폼 입력용 — placeholder는 빈 칸으로 표시 */
export function contactIdForInput(stored) {
  const v = String(stored ?? '').trim()
  if (!v || v === CONTACT_PLACEHOLDER) return ''
  return v
}

export function isContactPlaceholder(value) {
  return String(value ?? '').trim() === CONTACT_PLACEHOLDER
}
