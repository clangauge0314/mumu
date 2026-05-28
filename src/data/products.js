const productTemplates = [
  {
    title: '아이패드 프로 11 M2',
    price: 850000,
    category: 'digital',
    location: '강남구 역삼동',
    time: '3분 전',
    likes: 12,
    seed: 'mumu1',
  },
  {
    title: '무신사 스탠다드 후드집업 M',
    price: 35000,
    category: 'fashion',
    location: '마포구 합정동',
    time: '12분 전',
    likes: 5,
    seed: 'mumu2',
  },
  {
    title: '허먼밀러 에어론 체어 B',
    price: 1200000,
    category: 'furniture',
    location: '서초구 서초동',
    time: '1시간 전',
    likes: 28,
    seed: 'mumu3',
  },
  {
    title: '닌텐도 스위치 OLED 화이트',
    price: 280000,
    category: 'digital',
    location: '송파구 잠실동',
    time: '2시간 전',
    likes: 9,
    seed: 'mumu4',
  },
  {
    title: '캠핑 의자 2개 세트',
    price: 45000,
    category: 'sports',
    location: '용산구 이태원동',
    time: '어제',
    likes: 3,
    seed: 'mumu5',
  },
  {
    title: '에어팟 프로 2세대',
    price: 190000,
    category: 'digital',
    location: '성동구 성수동',
    time: '어제',
    likes: 15,
    seed: 'mumu6',
  },
  {
    title: '북유럽 스탠드 조명',
    price: 52000,
    category: 'furniture',
    location: '종로구 혜화동',
    time: '2일 전',
    likes: 7,
    seed: 'mumu7',
  },
  {
    title: '자전거 픽시 52',
    price: 320000,
    category: 'sports',
    location: '관악구 신림동',
    time: '3일 전',
    likes: 11,
    seed: 'mumu8',
  },
  {
    title: '이사 정리 책장 (무료나눔)',
    price: 0,
    category: 'furniture',
    location: '강남구 역삼동',
    time: '30분 전',
    likes: 4,
    seed: 'mumu9',
  },
  {
    title: '유아용 장난감 세트',
    price: 0,
    category: 'etc',
    location: '마포구 연남동',
    time: '1시간 전',
    likes: 6,
    seed: 'mumu10',
  },
  {
    title: '맥북 에어 M1 256GB',
    price: 650000,
    category: 'digital',
    location: '서대문구 연희동',
    time: '5분 전',
    likes: 18,
    seed: 'mumu11',
  },
  {
    title: '나이키 덩크 로우 270',
    price: 89000,
    category: 'fashion',
    location: '용산구 한남동',
    time: '20분 전',
    likes: 22,
    seed: 'mumu12',
  },
]

const TOTAL_PRODUCTS = 48

export const products = Array.from({ length: TOTAL_PRODUCTS }, (_, i) => {
  const t = productTemplates[i % productTemplates.length]
  const batch = Math.floor(i / productTemplates.length) + 1
  return {
    id: i + 1,
    title: batch > 1 ? `${t.title} · ${batch}` : t.title,
    price: t.price,
    category: t.category,
    location: t.location,
    time: t.time,
    likes: t.likes + (i % 5),
    image: `https://picsum.photos/seed/${t.seed}-${i}/400/400`,
  }
})

export function formatPrice(price) {
  if (price === 0) return '나눔'
  return price.toLocaleString('ko-KR') + '원'
}
