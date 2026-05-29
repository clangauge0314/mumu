import { filterCategories } from './categories'

/** 메인 검색·필터 UI 설정 — 여기서 옵션을 추가·수정하면 됩니다 */
export const filterConfig = {
  categories: filterCategories,

  sortOptions: [    { id: 'latest', label: '최신순' },
    { id: 'priceAsc', label: '낮은 가격순' },
    { id: 'priceDesc', label: '높은 가격순' },
    { id: 'likes', label: '인기순' },
  ],

  price: {
    freeOnlyLabel: '무료나눔만',
    minPlaceholder: '최소 가격',
    maxPlaceholder: '최대 가격',
  },
}

export const defaultFilters = {
  query: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  freeOnly: false,
  sort: 'latest',
}
