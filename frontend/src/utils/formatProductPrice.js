const localeMap = {
  ko: 'ko-KR',
  en: 'en-US',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  ja: 'ja-JP',
  de: 'de-DE',
}

export function formatPriceAmount(amount, locale) {
  const tag = localeMap[locale] || 'ko-KR'
  return new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatProductPrice(price, locale, freeLabel) {
  if (price === 0) return freeLabel
  return formatPriceAmount(price, locale)
}
