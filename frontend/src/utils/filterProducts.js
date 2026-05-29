import { formatPriceAmount, parsePriceDigits } from './formatProductPrice'

export function parsePriceInput(value) {
  const digits = parsePriceDigits(value)
  if (!digits) return null
  const num = Number(digits)
  return Number.isFinite(num) && num >= 0 ? num : null
}

export function filterProducts(
  products,
  { query, category, minPrice, maxPrice, freeOnly, sort },
) {
  let result = [...products]

  if (query.trim()) {
    const q = query.trim().toLowerCase()
    result = result.filter((p) => {
      const haystack = [
        p.title,
        p.location,
        p.sellerNickname,
        p.locationLabel,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }

  if (category !== 'all') {
    result = result.filter((p) => p.category === category)
  }

  if (freeOnly) {
    result = result.filter((p) => p.price === 0)
  } else {
    const min = parsePriceInput(minPrice)
    const max = parsePriceInput(maxPrice)

    if (min != null) {
      result = result.filter((p) => p.price >= min)
    }
    if (max != null) {
      result = result.filter((p) => p.price <= max)
    }
  }

  switch (sort) {
    case 'priceAsc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'priceDesc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'likes':
      result.sort((a, b) => b.likes - a.likes)
      break
    default:
      result.sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0))
  }

  return result
}

export function getPriceFilterLabel(minPrice, maxPrice, freeOnly, t, locale) {
  if (freeOnly) return t('freeShare')

  const min = parsePriceInput(minPrice)
  const max = parsePriceInput(maxPrice)

  if (min == null && max == null) return null
  if (min != null && max != null) {
    return t('priceRange', {
      min: formatPriceAmount(min),
      max: formatPriceAmount(max),
    })
  }
  if (min != null) {
    return t('priceMinOnly', { amount: formatPriceAmount(min) })
  }
  if (max != null) {
    return t('priceMaxOnly', { amount: formatPriceAmount(max) })
  }
  return null
}

export function hasPriceFilter(minPrice, maxPrice, freeOnly) {
  if (freeOnly) return true
  return parsePriceInput(minPrice) != null || parsePriceInput(maxPrice) != null
}

export function getActiveFilterCount(filters) {
  let count = 0
  if (filters.category !== 'all') count += 1
  if (hasPriceFilter(filters.minPrice, filters.maxPrice, filters.freeOnly)) {
    count += 1
  }
  if (filters.sort !== 'latest') count += 1
  return count
}
