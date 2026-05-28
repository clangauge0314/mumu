const localeMap = {
  ko: 'ko-KR',
  en: 'en-US',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  de: 'de-DE',
}

export function formatProductPrice(price, locale, freeLabel) {
  if (price === 0) return freeLabel
  const tag = localeMap[locale] || 'ko-KR'
  return new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price)
}
