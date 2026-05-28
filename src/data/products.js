import { dormLocations } from '../config/branding'

const productTemplates = [
  {
    title: '아이패드 프로 11 M2',
    price: 850000,
    category: 'mobile',
    locationIndex: 0,
    time: '3분 전',
    likes: 12,
    seed: 'mumu1',
  },
  {
    title: '무신사 스탠다드 후드집업 M',
    price: 35000,
    category: 'clothing',
    locationIndex: 1,
    time: '12분 전',
    likes: 5,
    seed: 'mumu2',
  },
  {
    title: '허먼밀러 에어론 체어 B',
    price: 1200000,
    category: 'furniture',
    locationIndex: 2,
    time: '1시간 전',
    likes: 28,
    seed: 'mumu3',
  },
  {
    title: '닌텐도 스위치 OLED 화이트',
    price: 280000,
    category: 'hobby',
    locationIndex: 3,
    time: '2시간 전',
    likes: 9,
    seed: 'mumu4',
  },
  {
    title: '캠핑 의자 2개 세트',
    price: 45000,
    category: 'sports',
    locationIndex: 4,
    time: '어제',
    likes: 3,
    seed: 'mumu5',
  },
  {
    title: '에어팟 프로 2세대',
    price: 190000,
    category: 'audio',
    locationIndex: 5,
    time: '어제',
    likes: 15,
    seed: 'mumu6',
  },
  {
    title: '북유럽 스탠드 조명',
    price: 52000,
    category: 'lighting',
    locationIndex: 6,
    time: '2일 전',
    likes: 7,
    seed: 'mumu7',
  },
  {
    title: '자전거 픽시 52',
    price: 320000,
    category: 'sports',
    locationIndex: 7,
    time: '3일 전',
    likes: 11,
    seed: 'mumu8',
  },
  {
    title: '졸업 전 책장 (무료나눔)',
    price: 0,
    category: 'furniture',
    locationIndex: 8,
    time: '30분 전',
    likes: 4,
    seed: 'mumu9',
  },
  {
    title: '교재·문구 세트',
    price: 0,
    category: 'study',
    locationIndex: 9,
    time: '1시간 전',
    likes: 6,
    seed: 'mumu10',
  },
  {
    title: '맥북 에어 M1 256GB',
    price: 650000,
    category: 'pc',
    locationIndex: 10,
    time: '5분 전',
    likes: 18,
    seed: 'mumu11',
  },
  {
    title: '나이키 덩크 로우 270',
    price: 89000,
    category: 'shoes',
    locationIndex: 11,
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
    location: dormLocations[t.locationIndex % dormLocations.length],
    time: t.time,
    likes: t.likes + (i % 5),
    image: `https://picsum.photos/seed/${t.seed}-${i}/400/400`,
  }
})

export function formatPrice(price) {
  if (price === 0) return '나눔'
  return price.toLocaleString('ko-KR') + '원'
}
