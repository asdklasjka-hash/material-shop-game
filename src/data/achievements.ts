import { AchievementItem, DecorationCategory, SaveState } from '../types/game';
import { DECORATIONS, DEFAULT_OWNED_IDS } from './decorations';

export interface AchievementDefinition extends AchievementItem {
  isCompleted: (state: SaveState) => boolean;
}

const DECORATION_CATEGORIES: DecorationCategory[] = [
  'sign',
  'wallpaper',
  'chair',
  'plant',
  'lighting',
  'ornament',
  'exterior',
];

export function countPurchasedCategories(ownedIds: string[]): number {
  const paidOwned = ownedIds.filter((id) => !DEFAULT_OWNED_IDS.includes(id));
  const covered = new Set<DecorationCategory>();
  for (const id of paidOwned) {
    const item = DECORATIONS.find((d) => d.id === id);
    if (item) covered.add(item.category);
  }
  return covered.size;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'streak_5',
    title: '단골을 부르는 친절왕',
    description: '손님 5명 연속으로 한 번에 알맞은 막대 판매하기',
    rewardCoins: 150,
    isCompleted: (state) => state.bestStreak >= 5,
  },
  {
    id: 'all_5_materials',
    title: '다섯 물질 척척박사',
    description: '나무, 플라스틱, 철, 유리, 고무 5가지 막대 모두 판매하기',
    rewardCoins: 150,
    isCompleted: (state) => state.soldMaterials.length >= 5,
  },
  {
    id: 'all_decor_categories',
    title: '동화 속 인테리어 장인',
    description: '7가지 모든 종류의 가게 인테리어(간판·벽지·의자·화분·조명·장식·외관) 구매하기',
    rewardCoins: 250,
    isCompleted: (state) =>
      countPurchasedCategories(state.ownedDecorations) >= DECORATION_CATEGORIES.length,
  },
  {
    id: 'revenue_1500',
    title: '숲속 마을 매출왕',
    description: '가게 누적 매출 1,500원 이상 달성하기',
    rewardCoins: 200,
    isCompleted: (state) => state.totalRevenue >= 1500,
  },
];
