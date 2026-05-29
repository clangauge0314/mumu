/** 메인 검색·필터 UI 설정 */

export const sortOptionIds = ['latest', 'priceAsc', 'priceDesc', 'likes']

export function getSortOptions(t) {
  return sortOptionIds.map((id) => ({
    id,
    label: t(`sort_${id}`),
  }))
}

export const defaultFilters = {
  query: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  freeOnly: false,
  sort: 'latest',
}
