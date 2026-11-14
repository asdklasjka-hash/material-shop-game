import { DecorationCategory, DecorationItem, ShopTier } from '../types/game';

export const CATEGORY_LABELS: Record<DecorationCategory, string> = {
  sign: '예쁜 간판',
  wallpaper: '알록달록 벽지',
  chair: '귀여운 의자',
  plant: '꽃과 화분',
  lighting: '새로운 조명',
  ornament: '동물 장식품',
  exterior: '가게 외관',
};

export const DECORATIONS: DecorationItem[] = [
  // Signboards
  {
    id: 'sign_wood',
    category: 'sign',
    categoryLabel: '예쁜 간판',
    name: '통나무 숲 간판',
    description: '기본으로 걸려 있는 소박하고 정겨운 나무 간판이에요.',
    price: 0,
    unlockRevenue: 0,
    swatchHex: '#A16227',
  },
  {
    id: 'sign_flower',
    category: 'sign',
    categoryLabel: '예쁜 간판',
    name: '꽃잎 리본 간판',
    description: '봄꽃 장식이 달린 화사한 파스텔 톤 간판이에요.',
    price: 180,
    unlockRevenue: 0,
    swatchHex: '#F472B6',
  },
  {
    id: 'sign_star',
    category: 'sign',
    categoryLabel: '예쁜 간판',
    name: '반짝 별빛 무지개 간판',
    description: '무지개와 별이 반짝이는 동화 속 명품 간판이에요.',
    price: 380,
    unlockRevenue: 600,
    swatchHex: '#F59E0B',
  },

  // Wallpapers
  {
    id: 'wall_cream',
    category: 'wallpaper',
    categoryLabel: '알록달록 벽지',
    name: '따뜻한 크림 벽지',
    description: '포근하고 아늑한 기본 크림색 나무 벽지예요.',
    price: 0,
    unlockRevenue: 0,
    swatchHex: '#FAF3E3',
  },
  {
    id: 'wall_mint',
    category: 'wallpaper',
    categoryLabel: '알록달록 벽지',
    name: '상큼 민트 줄무늬 벽지',
    description: '가게가 시원하고 산뜻해 보이는 민트빛 줄무늬 벽지예요.',
    price: 150,
    unlockRevenue: 0,
    swatchHex: '#A7F3D0',
  },
  {
    id: 'wall_sky',
    category: 'wallpaper',
    categoryLabel: '알록달록 벽지',
    name: '구름 둥실 하늘 벽지',
    description: '몽글몽글 구름이 떠 있는 꿈같은 하늘색 벽지예요.',
    price: 320,
    unlockRevenue: 450,
    swatchHex: '#BAE6FD',
  },

  // Chairs
  {
    id: 'chair_none',
    category: 'chair',
    categoryLabel: '귀여운 의자',
    name: '빈 공간',
    description: '손님 대기 공간이 아직 비어 있어요.',
    price: 0,
    unlockRevenue: 0,
    swatchHex: '#E5E7EB',
  },
  {
    id: 'chair_stool',
    category: 'chair',
    categoryLabel: '귀여운 의자',
    name: '동글 원목 의자',
    description: '동물 손님들이 잠깐 쉬어 갈 수 있는 귀여운 나무 의자예요.',
    price: 160,
    unlockRevenue: 0,
    swatchHex: '#C28246',
  },
  {
    id: 'chair_bear',
    category: 'chair',
    categoryLabel: '귀여운 의자',
    name: '곰돌이 쿠션 의자',
    description: '폭신한 곰돌이 귀 모양 쿠션이 달린 인기 만점 의자예요.',
    price: 340,
    unlockRevenue: 500,
    swatchHex: '#FDBA74',
  },

  // Plants
  {
    id: 'plant_none',
    category: 'plant',
    categoryLabel: '꽃과 화분',
    name: '화분 없음',
    description: '아직 창가에 화분이 없어요.',
    price: 0,
    unlockRevenue: 0,
    swatchHex: '#E5E7EB',
  },
  {
    id: 'plant_sunflower',
    category: 'plant',
    categoryLabel: '꽃과 화분',
    name: '햇살 해바라기 화분',
    description: '보기만 해도 기분이 환해지는 노란 해바라기 화분이에요.',
    price: 140,
    unlockRevenue: 0,
    swatchHex: '#FACC15',
  },
  {
    id: 'plant_tulip',
    category: 'plant',
    categoryLabel: '꽃과 화분',
    name: '알록달록 튤립 꽃밭',
    description: '창가를 가득 채우는 향기로운 튤립과 꽃 화분이에요.',
    price: 280,
    unlockRevenue: 350,
    swatchHex: '#FB7185',
  },

  // Lighting
  {
    id: 'light_basic',
    category: 'lighting',
    categoryLabel: '새로운 조명',
    name: '아침 햇살 창문',
    description: '은은한 자연 빛이 들어오는 기본 조명이에요.',
    price: 0,
    unlockRevenue: 0,
    swatchHex: '#FEF3C7',
  },
  {
    id: 'light_lantern',
    category: 'lighting',
    categoryLabel: '새로운 조명',
    name: '포근한 종이 등불',
    description: '가게 안을 노랗고 따뜻하게 비춰 주는 귀여운 등불이에요.',
    price: 200,
    unlockRevenue: 0,
    swatchHex: '#FBBF24',
  },
  {
    id: 'light_garland',
    category: 'lighting',
    categoryLabel: '새로운 조명',
    name: '별빛 가랜드 전구',
    description: '천장에 반짝이는 별 전구가 주렁주렁 걸리는 축제 조명이에요.',
    price: 360,
    unlockRevenue: 700,
    swatchHex: '#FDE047',
  },

  // Ornaments
  {
    id: 'ornament_none',
    category: 'ornament',
    categoryLabel: '동물 장식품',
    name: '장식품 없음',
    description: '선반 위가 아직 깔끔하게 비어 있어요.',
    price: 0,
    unlockRevenue: 0,
    swatchHex: '#E5E7EB',
  },
  {
    id: 'ornament_cat',
    category: 'ornament',
    categoryLabel: '동물 장식품',
    name: '복을 부르는 고양이 인형',
    description: '손을 흔들며 손님들을 반겨 주는 귀여운 도자기 고양이예요.',
    price: 220,
    unlockRevenue: 200,
    swatchHex: '#F97316',
  },
  {
    id: 'ornament_owl',
    category: 'ornament',
    categoryLabel: '동물 장식품',
    name: '똑똑이 나무 부엉이 시계',
    description: '척척박사 부엉이가 시간을 알려 주는 멋진 장식품이에요.',
    price: 400,
    unlockRevenue: 900,
    swatchHex: '#854D0E',
  },

  // Shop Exterior & Counter
  {
    id: 'ext_hut',
    category: 'exterior',
    categoryLabel: '가게 외관',
    name: '작은 오두막 가게',
    description: '막 시작하는 아담하고 정겨운 첫 번째 가게 모습이에요.',
    price: 0,
    unlockRevenue: 0,
    swatchHex: '#B45309',
  },
  {
    id: 'ext_bakery',
    category: 'exterior',
    categoryLabel: '가게 외관',
    name: '줄무늬 차양 동화 가게',
    description: '알록달록 지붕 차양과 넓은 원목 진열대가 생겨나요.',
    price: 420,
    unlockRevenue: 500,
    swatchHex: '#EF4444',
  },
  {
    id: 'ext_palace',
    category: 'exterior',
    categoryLabel: '가게 외관',
    name: '황금 지붕 물질 백화점',
    description: '숲속 마을 모두가 찾아오는 가장 크고 화려한 가게예요!',
    price: 750,
    unlockRevenue: 1200,
    swatchHex: '#EAB308',
  },
];

export const SHOP_TIERS: ShopTier[] = [
  {
    level: 1,
    name: '새싹 물질 가게',
    minRevenue: 0,
    description: '동물 친구들이 하나둘 찾아오기 시작한 따뜻한 작은 가게예요.',
  },
  {
    level: 2,
    name: '무지개 공방 가게',
    minRevenue: 400,
    description: '입소문이 퍼져서 더 많은 손님이 찾아오는 아기자기한 가게예요!',
  },
  {
    level: 3,
    name: '인기 만점 동화 가게',
    minRevenue: 900,
    description: '숲속 마을에서 가장 친절하고 똑똑한 물질 가게로 소문났어요!',
  },
  {
    level: 4,
    name: '최고의 반짝 물질 백화점',
    minRevenue: 1600,
    description: '모든 동물 친구들이 믿고 찾는 전설의 물질 박사 가게예요!',
  },
];

export function getShopTier(totalRevenue: number): ShopTier {
  let current = SHOP_TIERS[0];
  for (const tier of SHOP_TIERS) {
    if (totalRevenue >= tier.minRevenue) {
      current = tier;
    }
  }
  return current;
}

export const DEFAULT_EQUIPPED: Record<DecorationCategory, string> = {
  sign: 'sign_wood',
  wallpaper: 'wall_cream',
  chair: 'chair_none',
  plant: 'plant_none',
  lighting: 'light_basic',
  ornament: 'ornament_none',
  exterior: 'ext_hut',
};

export const DEFAULT_OWNED_IDS = Object.values(DEFAULT_EQUIPPED);
