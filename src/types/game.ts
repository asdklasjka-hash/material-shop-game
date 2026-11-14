export type MaterialId = 'wood' | 'plastic' | 'iron' | 'glass' | 'rubber';

export type AnimalId =
  | 'rabbit'
  | 'bear'
  | 'fox'
  | 'panda'
  | 'puppy'
  | 'cat'
  | 'monkey'
  | 'penguin';

export type ScreenMode = 'START' | 'SHOP_PLAY' | 'DAY_RESULT' | 'DECORATE';

export interface MaterialInfo {
  id: MaterialId;
  name: string;
  shortLabel: string;
  image: string;
  accentHex: string;
  softBgClass: string;
  borderClass: string;
  textClass: string;
  properties: string[];
  scienceTip: string;
  compareNote: string;
}

export interface AnimalProfile {
  id: AnimalId;
  name: string;
  title: string;
  furPrimary: string;
  furSecondary: string;
  accentHex: string;
}

export interface CustomerRequest {
  id: string;
  animalId: AnimalId;
  greeting: string;
  dialogue: string;
  keyClue: string;
  acceptedMaterials: MaterialId[];
  wrongHints: Record<MaterialId, string>;
  whyItFits: string;
}

export type DecorationCategory =
  | 'sign'
  | 'wallpaper'
  | 'chair'
  | 'plant'
  | 'lighting'
  | 'ornament'
  | 'exterior';

export interface DecorationItem {
  id: string;
  category: DecorationCategory;
  categoryLabel: string;
  name: string;
  description: string;
  price: number;
  unlockRevenue: number;
  swatchHex: string;
}

export interface ShopTier {
  level: number;
  name: string;
  minRevenue: number;
  description: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
}

export interface SaveState {
  coins: number;
  totalRevenue: number;
  dayCount: number;
  totalCustomersServed: number;
  totalFirstTryCorrect: number;
  ownedDecorations: string[];
  equippedDecorations: Record<DecorationCategory, string>;
  soldMaterials: MaterialId[];
  bestStreak: number;
  currentStreak: number;
  unlockedAchievements: string[];
  bgmEnabled: boolean;
  sfxEnabled: boolean;
}

export interface DaySummary {
  dayNumber: number;
  customersServed: number;
  firstTryCount: number;
  coinsEarned: number;
  satisfactionRate: number;
  newlyUnlockedAchievements: AchievementItem[];
}
