/** 상품 카테고리 ID — 필터·등록·목록 데이터의 단일 기준 */

export const categoryGroups = [
  {
    id: 'digital',
    items: [
      { id: 'mobile' },
      { id: 'pc' },
      { id: 'display' },
      { id: 'audio' },
      { id: 'camera' },
      { id: 'appliance' },
    ],
  },
  {
    id: 'living',
    items: [
      { id: 'furniture' },
      { id: 'bedding' },
      { id: 'kitchen' },
      { id: 'storage' },
      { id: 'lighting' },
    ],
  },
  {
    id: 'fashion',
    items: [
      { id: 'clothing' },
      { id: 'shoes' },
      { id: 'bag' },
      { id: 'beauty' },
    ],
  },
  {
    id: 'study',
    items: [
      { id: 'books' },
      { id: 'study' },
      { id: 'sports' },
      { id: 'hobby' },
    ],
  },
  {
    id: 'other',
    items: [{ id: 'ticket' }, { id: 'etc' }],
  },
]

export const productCategories = categoryGroups.flatMap((group) => group.items)

export const defaultCategoryId = productCategories[0]?.id ?? 'etc'

export function getCategoryLabel(id, t) {
  if (id === 'all') return t('all')
  return t(`cat_${id}`)
}

export function getCategoryGroupLabel(groupId, t) {
  return t(`catGroup_${groupId}`)
}
