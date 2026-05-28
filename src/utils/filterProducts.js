import { filterConfig } from '../config/filters'

export function parsePriceInput(value) {
  if (value === '' || value == null) return null
  const num = Number(String(value).replace(/,/g, ''))
  return Number.isFinite(num) && num >= 0 ? num : null
}

export function filterProducts(
  products,
  { query, category, minPrice, maxPrice, freeOnly, sort },
) {
  let result = [...products]

  if (query.trim()) {
    const q = query.trim().toLowerCase()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q),
    )
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
      result.sort((a, b) => a.id - b.id)
  }

  return result
}

export function getPriceFilterLabel(minPrice, maxPrice, freeOnly) {
  if (freeOnly) return filterConfig.price.freeOnlyLabel

  const min = parsePriceInput(minPrice)
  const max = parsePriceInput(maxPrice)

  if (min == null && max == null) return null
  if (min != null && max != null) {
    return `${min.toLocaleString('ko-KR')}원 ~ ${max.toLocaleString('ko-KR')}원`
  }
  if (min != null) return `${min.toLocaleString('ko-KR')}원 이상`
  if (max != null) return `${max.toLocaleString('ko-KR')}원 이하`
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
