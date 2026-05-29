/** 상품 카테고리 — 필터·등록·목록 데이터의 단일 기준 */

export const categoryGroups = [
  {
    label: '디지털·가전',
    items: [
      { id: 'mobile', label: '휴대폰·태블릿' },
      { id: 'pc', label: '노트북·PC' },
      { id: 'display', label: '모니터·TV' },
      { id: 'audio', label: '이어폰·스피커' },
      { id: 'camera', label: '카메라' },
      { id: 'appliance', label: '생활가전' },
    ],
  },
  {
    label: '생활·가구',
    items: [
      { id: 'furniture', label: '가구' },
      { id: 'bedding', label: '침구·이불' },
      { id: 'kitchen', label: '주방·식기' },
      { id: 'storage', label: '수납·정리' },
      { id: 'lighting', label: '조명' },
    ],
  },
  {
    label: '패션·뷰티',
    items: [
      { id: 'clothing', label: '의류' },
      { id: 'shoes', label: '신발' },
      { id: 'bag', label: '가방·지갑' },
      { id: 'beauty', label: '뷰티·미용' },
    ],
  },
  {
    label: '학업·취미',
    items: [
      { id: 'books', label: '도서' },
      { id: 'study', label: '학용품' },
      { id: 'sports', label: '스포츠·운동' },
      { id: 'hobby', label: '취미·게임' },
    ],
  },
  {
    label: '기타',
    items: [
      { id: 'ticket', label: '티켓·교환권' },
      { id: 'etc', label: '기타' },
    ],
  },
]

export const productCategories = categoryGroups.flatMap((group) => group.items)

export const filterCategories = [
  { id: 'all', label: '전체' },
  ...productCategories,
]

export const defaultCategoryId = productCategories[0]?.id ?? 'etc'

export function getCategoryLabel(id) {
  if (id === 'all') return '전체'
  return productCategories.find((c) => c.id === id)?.label ?? '기타'
}
