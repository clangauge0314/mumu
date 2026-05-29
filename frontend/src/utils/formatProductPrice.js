/** 물품 가격: 엔(円) 단위, 3자리마다 콤마 */

export function parsePriceDigits(value) {
  return String(value ?? '').replace(/\D/g, '')
}

/** 입력 필드용 — 숫자만 받아 콤마 포맷 */
export function formatPriceInput(value) {
  const digits = parsePriceDigits(value)
  if (!digits) return ''
  return Number(digits).toLocaleString('ja-JP')
}

export function formatPriceAmount(amount) {
  const num = Number(amount)
  if (!Number.isFinite(num)) return ''
  return `${num.toLocaleString('ja-JP')}円`
}

export function formatProductPrice(price, _locale, freeLabel) {
  if (price === 0) return freeLabel
  return formatPriceAmount(price)
}
