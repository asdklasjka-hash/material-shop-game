import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Coins,
  Heart,
  Music,
  Paintbrush,
  RotateCcw,
  Sparkles,
  Store,
  Volume2,
  VolumeX,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { ACHIEVEMENTS } from './data/achievements';
import { ANIMALS, pickShiftCustomers } from './data/customers';
import {
  DEFAULT_EQUIPPED,
  DEFAULT_OWNED_IDS,
  SHOP_TIERS,
  getShopTier,
} from './data/decorations';
import { MATERIAL_LIST, MATERIALS } from './data/materials';
import {
  AchievementItem,
  AnimalId,
  CustomerRequest,
  DaySummary,
  DecorationItem,
  MaterialId,
  SaveState,
  ScreenMode,
} from './types/game';
import { soundEngine } from './utils/sound';
import { AnimalAvatar } from './components/AnimalAvatar';
import { DecorateView } from './components/DecorateView';
import { MaterialCard } from './components/MaterialCard';
import {
  AchievementsModal,
  EncyclopediaModal,
  ResetConfirmModal,
} from './components/Modals';
import { ShopScene } from './components/ShopScene';
import coverImage from './assets/images/shop_storybook_cover_1794638451753.jpg';

const STORAGE_KEY = 'material_shop_grade3_save_v1';
const CUSTOMERS_PER_DAY = 5;
const COVER_IMAGE_PATH = coverImage;

const INITIAL_SAVE: SaveState = {
  coins: 0,
  totalRevenue: 0,
  dayCount: 1,
  totalCustomersServed: 0,
  totalFirstTryCorrect: 0,
  ownedDecorations: [...DEFAULT_OWNED_IDS],
  equippedDecorations: { ...DEFAULT_EQUIPPED },
  soldMaterials: [],
  bestStreak: 0,
  currentStreak: 0,
  unlockedAchievements: [],
  bgmEnabled: true,
  sfxEnabled: true,
};

function loadSaveState(): SaveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SAVE;
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    return {
      ...INITIAL_SAVE,
      ...parsed,
      equippedDecorations: {
        ...DEFAULT_EQUIPPED,
        ...(parsed.equippedDecorations || {}),
      },
      ownedDecorations: Array.isArray(parsed.ownedDecorations)
        ? Array.from(new Set([...DEFAULT_OWNED_IDS, ...parsed.ownedDecorations]))
        : [...DEFAULT_OWNED_IDS],
      soldMaterials: Array.isArray(parsed.soldMaterials) ? parsed.soldMaterials : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements)
        ? parsed.unlockedAchievements
        : [],
    };
  } catch {
    return INITIAL_SAVE;
  }
}

export default function App() {
  const [saveState, setSaveState] = useState<SaveState>(() => loadSaveState());
  const [screen, setScreen] = useState<ScreenMode>('START');
  const [decorateReturnTo, setDecorateReturnTo] = useState<ScreenMode>('START');

  // Active shift state
  const [shiftCustomers, setShiftCustomers] = useState<CustomerRequest[]>([]);
  const [customerIdx, setCustomerIdx] = useState(0);
  const [wrongTried, setWrongTried] = useState<MaterialId[]>([]);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [soldMaterialId, setSoldMaterialId] = useState<MaterialId | null>(null);
  const [lastEarnedCoins, setLastEarnedCoins] = useState(0);
  const [lastBonusCoins, setLastBonusCoins] = useState(0);
  const [dayEarnedCoins, setDayEarnedCoins] = useState(0);
  const [dayFirstTryCount, setDayFirstTryCount] = useState(0);
  const [daySatisfactionSum, setDaySatisfactionSum] = useState(0);
  const [daySummary, setDaySummary] = useState<DaySummary | null>(null);
  const [lastShiftAnimals, setLastShiftAnimals] = useState<AnimalId[]>([]);

  // Visual / UI triggers
  const [sparkleTrigger, setSparkleTrigger] = useState(0);
  const [coinAnimKey, setCoinAnimKey] = useState(0);
  const [coverImgError, setCoverImgError] = useState(false);
  const [openModal, setOpenModal] = useState<
    'encyclopedia' | 'achievements' | 'reset' | null
  >(null);
  const [toastAchievement, setToastAchievement] = useState<AchievementItem | null>(null);

  // Persist save state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
    } catch {
      // Ignore quota issues cleanly
    }
  }, [saveState]);

  // Sync audio settings
  useEffect(() => {
    soundEngine.setSettings(saveState.bgmEnabled, saveState.sfxEnabled);
  }, [saveState.bgmEnabled, saveState.sfxEnabled]);

  useEffect(() => {
    if (!toastAchievement) return;
    const timer = window.setTimeout(() => setToastAchievement(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toastAchievement]);

  const evaluateAchievements = (nextState: SaveState): { updated: SaveState; newlyUnlocked: AchievementItem[] } => {
    const newlyUnlocked: AchievementItem[] = [];
    let rewardSum = 0;

    for (const ach of ACHIEVEMENTS) {
      if (!nextState.unlockedAchievements.includes(ach.id) && ach.isCompleted(nextState)) {
        newlyUnlocked.push({
          id: ach.id,
          title: ach.title,
          description: ach.description,
          rewardCoins: ach.rewardCoins,
        });
        rewardSum += ach.rewardCoins;
      }
    }

    if (newlyUnlocked.length === 0) {
      return { updated: nextState, newlyUnlocked: [] };
    }

    const updated: SaveState = {
      ...nextState,
      coins: nextState.coins + rewardSum,
      totalRevenue: nextState.totalRevenue + rewardSum,
      unlockedAchievements: [
        ...nextState.unlockedAchievements,
        ...newlyUnlocked.map((a) => a.id),
      ],
    };
    return { updated, newlyUnlocked };
  };

  const startShift = () => {
    soundEngine.unlock();
    soundEngine.playDoorbell();
    const chosen = pickShiftCustomers(CUSTOMERS_PER_DAY, lastShiftAnimals);
    setShiftCustomers(chosen);
    setLastShiftAnimals(chosen.map((c) => c.animalId));
    setCustomerIdx(0);
    setWrongTried([]);
    setHintMessage(null);
    setSoldMaterialId(null);
    setDayEarnedCoins(0);
    setDayFirstTryCount(0);
    setDaySatisfactionSum(0);
    setDaySummary(null);
    setScreen('SHOP_PLAY');
  };

  const currentCustomer = shiftCustomers[customerIdx];
  const currentAnimal = currentCustomer ? ANIMALS[currentCustomer.animalId] : undefined;

  const handleSelectMaterial = (materialId: MaterialId) => {
    if (!currentCustomer || soldMaterialId) return;
    soundEngine.unlock();

    const isCorrect = currentCustomer.acceptedMaterials.includes(materialId);
    if (isCorrect) {
      soundEngine.playSuccess();
      window.setTimeout(() => soundEngine.playCoin(), 220);

      const firstTry = wrongTried.length === 0;
      const newStreak = firstTry ? saveState.currentStreak + 1 : 0;
      const baseCoins = 100;
      const streakBonus = firstTry && newStreak >= 2 ? 30 : 0;
      const earned = baseCoins + streakBonus;
      const customerSat = Math.max(60, 100 - wrongTried.length * 15);

      setSoldMaterialId(materialId);
      setHintMessage(null);
      setLastEarnedCoins(baseCoins);
      setLastBonusCoins(streakBonus);
      setCoinAnimKey((k) => k + 1);

      setDayEarnedCoins((prev) => prev + earned);
      if (firstTry) setDayFirstTryCount((prev) => prev + 1);
      setDaySatisfactionSum((prev) => prev + customerSat);

      setSaveState((prev) => {
        const nextSold = prev.soldMaterials.includes(materialId)
          ? prev.soldMaterials
          : [...prev.soldMaterials, materialId];
        const candidate: SaveState = {
          ...prev,
          coins: prev.coins + earned,
          totalRevenue: prev.totalRevenue + earned,
          totalCustomersServed: prev.totalCustomersServed + 1,
          totalFirstTryCorrect: prev.totalFirstTryCorrect + (firstTry ? 1 : 0),
          soldMaterials: nextSold,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
        };
        const { updated, newlyUnlocked } = evaluateAchievements(candidate);
        if (newlyUnlocked.length > 0) {
          setToastAchievement(newlyUnlocked[0]);
        }
        return updated;
      });
    } else {
      soundEngine.playGentleHint();
      if (!wrongTried.includes(materialId)) {
        setWrongTried((prev) => [...prev, materialId]);
      }
      setSaveState((prev) => ({
        ...prev,
        currentStreak: 0,
      }));
      const specificHint = currentCustomer.wrongHints[materialId];
      setHintMessage(
        specificHint ||
          `아쉽네요! ${currentAnimal?.title || '손님'}은 "${currentCustomer.keyClue}"가 필요하다고 했어요. 다른 막대를 골라 볼까요?`
      );
    }
  };

  const handleNextCustomer = () => {
    soundEngine.playClick();
    if (customerIdx + 1 < shiftCustomers.length) {
      setCustomerIdx((idx) => idx + 1);
      setWrongTried([]);
      setHintMessage(null);
      setSoldMaterialId(null);
      soundEngine.playDoorbell();
    } else {
      // End of shift
      soundEngine.playCelebration();
      const satisfactionRate = Math.round(daySatisfactionSum / CUSTOMERS_PER_DAY);
      const finishedDay = saveState.dayCount;

      setSaveState((prev) => ({
        ...prev,
        dayCount: prev.dayCount + 1,
      }));

      setDaySummary({
        dayNumber: finishedDay,
        customersServed: CUSTOMERS_PER_DAY,
        firstTryCount: dayFirstTryCount,
        coinsEarned: dayEarnedCoins,
        satisfactionRate,
        newlyUnlockedAchievements: [],
      });
      setScreen('DAY_RESULT');
    }
  };

  const handleBuyDecoration = (item: DecorationItem) => {
    if (saveState.coins < item.price || saveState.ownedDecorations.includes(item.id)) {
      return;
    }
    soundEngine.unlock();
    soundEngine.playSparkle();
    setSparkleTrigger((t) => t + 1);

    setSaveState((prev) => {
      const candidate: SaveState = {
        ...prev,
        coins: prev.coins - item.price,
        ownedDecorations: [...prev.ownedDecorations, item.id],
        equippedDecorations: {
          ...prev.equippedDecorations,
          [item.category]: item.id,
        },
      };
      const { updated, newlyUnlocked } = evaluateAchievements(candidate);
      if (newlyUnlocked.length > 0) {
        setToastAchievement(newlyUnlocked[0]);
      }
      return updated;
    });
  };

  const handleEquipDecoration = (item: DecorationItem) => {
    if (!saveState.ownedDecorations.includes(item.id)) return;
    soundEngine.playClick();
    setSparkleTrigger((t) => t + 1);
    setSaveState((prev) => ({
      ...prev,
      equippedDecorations: {
        ...prev.equippedDecorations,
        [item.category]: item.id,
      },
    }));
  };

  const handleResetGame = () => {
    soundEngine.playClick();
    localStorage.removeItem(STORAGE_KEY);
    setSaveState(INITIAL_SAVE);
    setOpenModal(null);
    setScreen('START');
  };

  const openDecorate = (returnScreen: ScreenMode) => {
    soundEngine.unlock();
    soundEngine.playClick();
    setDecorateReturnTo(returnScreen);
    setScreen('DECORATE');
  };

  const currentTier = useMemo(
    () => getShopTier(saveState.totalRevenue),
    [saveState.totalRevenue]
  );

  const nextTier = useMemo(
    () => SHOP_TIERS.find((t) => t.minRevenue > saveState.totalRevenue) || null,
    [saveState.totalRevenue]
  );

  const satisfactionDisplay = useMemo(() => {
    if (shiftCustomers.length === 0) return 100;
    const completed = soldMaterialId ? customerIdx + 1 : customerIdx;
    if (completed === 0) {
      return Math.max(60, 100 - wrongTried.length * 15);
    }
    const ongoing = soldMaterialId ? 0 : Math.max(60, 100 - wrongTried.length * 15);
    const total = daySatisfactionSum + ongoing;
    const denom = soldMaterialId ? completed : completed + 1;
    return Math.round(total / denom);
  }, [shiftCustomers.length, soldMaterialId, customerIdx, wrongTried.length, daySatisfactionSum]);

  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#2F2419] flex flex-col">
      {/* Top 3-Zone Header Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E5D8C5] bg-[#FFFDF9]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setScreen('START');
            }}
            className="font-display text-lg sm:text-xl text-[#2F2419] hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            물질 가게를 열어봐요!
          </button>

          {/* Zone 2: Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5C4631]">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setOpenModal('encyclopedia');
              }}
              className="inline-flex items-center gap-1.5 hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span>물질 도감</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setOpenModal('achievements');
              }}
              className="inline-flex items-center gap-1.5 hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>도전 과제 ({saveState.unlockedAchievements.length}/{ACHIEVEMENTS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => openDecorate(screen === 'DECORATE' ? decorateReturnTo : screen)}
              className="inline-flex items-center gap-1.5 hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Paintbrush className="h-4 w-4" />
              <span>가게 꾸미기</span>
            </button>
          </nav>

          {/* Zone 3: Coins & Sound Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#4A3520] mr-1">
              <Coins className="h-4 w-4 text-amber-500" />
              <span className="font-num font-bold text-amber-700 whitespace-nowrap">
                {saveState.coins.toLocaleString()}원
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.unlock();
                setSaveState((prev) => ({ ...prev, bgmEnabled: !prev.bgmEnabled }));
              }}
              aria-label={saveState.bgmEnabled ? '배경음악 끄기' : '배경음악 켜기'}
              title={saveState.bgmEnabled ? '배경음악 켜짐' : '배경음악 꺼짐'}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                saveState.bgmEnabled
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : 'border-[#DFD1BC] bg-white text-stone-500'
              }`}
            >
              <Music className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{saveState.bgmEnabled ? '배경음' : '음소거'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.unlock();
                setSaveState((prev) => ({ ...prev, sfxEnabled: !prev.sfxEnabled }));
              }}
              aria-label={saveState.sfxEnabled ? '효과음 끄기' : '효과음 켜기'}
              title={saveState.sfxEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                saveState.sfxEnabled
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : 'border-[#DFD1BC] bg-white text-stone-500'
              }`}
            >
              {saveState.sfxEnabled ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{saveState.sfxEnabled ? '효과음' : '끔'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Quick Links */}
        <div className="flex md:hidden items-center justify-around border-t border-[#EFE4D4] px-3 py-1.5 text-xs font-medium text-[#5C4631]">
          <button
            type="button"
            onClick={() => setOpenModal('encyclopedia')}
            className="inline-flex items-center gap-1 py-1 cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>물질 도감</span>
          </button>
          <button
            type="button"
            onClick={() => setOpenModal('achievements')}
            className="inline-flex items-center gap-1 py-1 cursor-pointer"
          >
            <Award className="h-3.5 w-3.5" />
            <span>도전 과제 ({saveState.unlockedAchievements.length}/{ACHIEVEMENTS.length})</span>
          </button>
          <button
            type="button"
            onClick={() => openDecorate(screen === 'DECORATE' ? decorateReturnTo : screen)}
            className="inline-flex items-center gap-1 py-1 cursor-pointer"
          >
            <Paintbrush className="h-3.5 w-3.5" />
            <span>가게 꾸미기</span>
          </button>
        </div>
      </header>

      {/* Achievement Toast */}
      {toastAchievement && (
        <div className="fixed bottom-5 right-5 z-40 max-w-sm rounded-2xl border-2 border-amber-400 bg-[#FFFDF9] p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <Award className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
            <div>
              <div className="text-xs font-semibold text-amber-700">새로운 도전 과제 달성!</div>
              <div className="font-display text-lg text-[#2F2419]">{toastAchievement.title}</div>
              <div className="text-xs text-[#624B36]">
                보상 +{toastAchievement.rewardCoins}원이 지급되었어요!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 py-6 sm:py-8">
        {/* SCREEN 1: START SCREEN */}
        {screen === 'START' && (
          <div className="space-y-8 my-auto">
            <section className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-8 rounded-3xl border-2 border-[#E2D4BE] bg-[#FFFDF9] p-6 sm:p-8 shadow-sm">
              {/* Left Column: Title, Rules, CTA */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-[#7A6147]">
                    초등학교 3학년 과학 · 물질의 성질
                  </div>

                  <h1 className="font-display text-4xl sm:text-5xl text-[#2F2419] leading-tight [text-wrap:balance]">
                    물질 가게를 열어봐요!
                  </h1>

                  <p className="text-base sm:text-lg leading-relaxed text-[#523F2D]">
                    동화 속 막대 가게 사장님이 되어 보세요! 찾아오는 귀여운 동물 손님들의
                    이야기를 듣고, 5가지 물질 중 딱 알맞은 막대를 골라 판매해요.
                  </p>

                  {/* 3-Step Simple Guide */}
                  <div className="space-y-2.5 pt-2 text-sm text-[#4A3520]">
                    <div className="flex items-start gap-2.5">
                      <span className="font-num font-bold text-amber-700">01.</span>
                      <span>동물 손님이 어떤 성질의 막대를 찾는지 꼼꼼히 읽어요.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="font-num font-bold text-amber-700">02.</span>
                      <span>나무·플라스틱·철·유리·고무 막대 중 알맞은 카드를 눌러요.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="font-num font-bold text-amber-700">03.</span>
                      <span>판매로 모은 돈으로 간판·벽지·화분·가게 외관을 예쁘게 꾸며요!</span>
                    </div>
                  </div>
                </div>

                {/* Current Shop Status & Action Buttons */}
                <div className="space-y-4 pt-2 border-t border-[#EFE4D4]">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6E5641]">
                    <span className="font-semibold text-[#2F2419]">{currentTier.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>영업 {saveState.dayCount}일차 준비</span>
                    <span aria-hidden="true">·</span>
                    <span>누적 손님 {saveState.totalCustomersServed}명</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={startShift}
                      className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-7 py-3.5 font-display text-xl text-white shadow-sm hover:bg-amber-600 active:translate-y-0.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Store className="h-5 w-5" />
                      <span>
                        {saveState.dayCount > 1
                          ? `${saveState.dayCount}일차 가게 문 열기`
                          : '가게 문 열기'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openDecorate('START')}
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#D6C3A5] bg-white px-5 py-3.5 font-semibold text-[#4A3520] hover:bg-[#FAF2E4] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Paintbrush className="h-4 w-4" />
                      <span>가게 꾸미기</span>
                    </button>

                    {saveState.totalCustomersServed > 0 && (
                      <button
                        type="button"
                        onClick={() => setOpenModal('reset')}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#7A6147] hover:text-rose-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>처음부터 다시 하기</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Generated Storybook Cover + Animal Cast */}
              <div className="lg:col-span-6 flex flex-col justify-between gap-4">
                <div className="relative flex-1 min-h-[240px] overflow-hidden rounded-2xl border-2 border-[#E2D4BE] bg-[#FAF2E4]">
                  {!coverImgError ? (
                    <img
                      src={COVER_IMAGE_PATH}
                      alt="동화 속 물질 가게 앞 동물 친구들과 사장님"
                      referrerPolicy="no-referrer"
                      onError={() => setCoverImgError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                      <AnimalAvatar animalId="shopkeeper" mood="happy" className="w-28 h-28" />
                      <p className="mt-2 font-display text-xl text-[#4A3520]">
                        어서 오세요, 동화 속 물질 가게!
                      </p>
                    </div>
                  )}
                </div>

                {/* Cute Animal Friends Strip */}
                <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#EAE0D0] bg-[#FAF4E8] px-4 py-2.5">
                  <span className="text-xs font-semibold text-[#624B36] whitespace-nowrap">
                    단골 손님들
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto">
                    {(['rabbit', 'bear', 'fox', 'panda', 'puppy', 'cat', 'monkey', 'penguin'] as AnimalId[]).map(
                      (id) => (
                        <div key={id} className="flex flex-col items-center shrink-0">
                          <AnimalAvatar animalId={id} className="w-9 h-9 sm:w-10 sm:h-10" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* SCREEN 2: ACTIVE SHOP PLAY */}
        {screen === 'SHOP_PLAY' && currentCustomer && currentAnimal && (
          <div className="mx-auto w-full max-w-5xl space-y-5">
            {/* Compact Shop Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E2D4BE] bg-[#FFFDF9] px-4 sm:px-5 py-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-[#523F2D]">
                <span className="font-display text-base text-[#2F2419]">
                  영업 {saveState.dayCount}일차
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  손님{' '}
                  <strong className="font-num text-[#2F2419]">
                    {customerIdx + 1} / {shiftCustomers.length}
                  </strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  연속 만족{' '}
                  <strong className="font-num text-amber-700">
                    {saveState.currentStreak}명
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-rose-700">
                  <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                  <span>손님 만족도</span>
                  <span className="font-num font-bold">{satisfactionDisplay}%</span>
                </div>
                <div className="h-2.5 w-24 overflow-hidden rounded-full bg-rose-100">
                  <div
                    className="h-full rounded-full bg-rose-500 transition-all duration-300"
                    style={{ width: `${satisfactionDisplay}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Decorated Shop Stage */}
            <div className="relative">
              <ShopScene
                equipped={saveState.equippedDecorations}
                visitorAnimalId={currentCustomer.animalId}
                visitorMood={soldMaterialId ? 'happy' : hintMessage ? 'hint' : 'normal'}
                shopkeeperMood={soldMaterialId ? 'happy' : 'normal'}
                shopTierName={currentTier.name}
                sparkleTrigger={sparkleTrigger}
              />

              {/* Coin Pop Animation on Sale */}
              {soldMaterialId && (
                <div
                  key={coinAnimKey}
                  className="pointer-events-none absolute right-6 sm:right-14 top-1/2 z-30 animate-coin-rise font-num text-xl sm:text-2xl font-extrabold text-amber-600 drop-shadow-sm"
                >
                  +{lastEarnedCoins + lastBonusCoins}원!
                </div>
              )}
            </div>

            {/* Customer Speech Bubble OR Sale Success Explanation */}
            {!soldMaterialId ? (
              <div className="rounded-2xl border-2 border-[#D6C3A5] bg-[#FFFDF9] p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-xl text-[#2F2419]">
                    {currentAnimal.title}
                  </span>
                  <span className="text-xs font-medium text-[#7A6147]">
                    {currentCustomer.greeting}
                  </span>
                </div>

                <p className="mt-2 text-lg sm:text-xl font-medium leading-relaxed text-[#2F2419]">
                  “{currentCustomer.dialogue}”
                </p>

                {hintMessage && (
                  <div
                    role="status"
                    className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm sm:text-base text-amber-950"
                  >
                    <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-medium leading-relaxed">{hintMessage}</p>
                      <p className="mt-1 text-xs font-semibold text-amber-800">
                        중요한 힌트: {currentCustomer.keyClue}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* SCREEN 3: SALE SUCCESS FEEDBACK */
              <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/85 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    <h2 className="font-display text-2xl text-emerald-950">
                      판매 성공! {currentAnimal.title}이 아주 기뻐해요!
                    </h2>
                  </div>
                  <div className="font-num text-lg font-bold text-amber-700">
                    +{lastEarnedCoins}원
                    {lastBonusCoins > 0 && (
                      <span className="ml-2 text-sm text-emerald-700">
                        (연속 보너스 +{lastBonusCoins}원!)
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center rounded-xl border border-emerald-200 bg-white p-4">
                  <div className="md:col-span-3 flex items-center gap-3 md:flex-col md:text-center">
                    <img
                      src={MATERIALS[soldMaterialId].image}
                      alt={MATERIALS[soldMaterialId].name}
                      referrerPolicy="no-referrer"
                      className="h-20 w-20 rounded-xl border border-[#E2D4BE] object-cover bg-[#FAF4E8]"
                    />
                    <span className="font-display text-lg text-[#2F2419]">
                      {MATERIALS[soldMaterialId].name}
                    </span>
                  </div>

                  <div className="md:col-span-9 space-y-2 text-sm sm:text-base text-[#3D2E1E]">
                    <p className="font-semibold text-emerald-900">
                      왜 알맞았을까요? — {currentCustomer.whyItFits}
                    </p>
                    <p className="text-sm leading-relaxed text-[#5A4632]">
                      <strong>물질의 성질 배우기:</strong>{' '}
                      {MATERIALS[soldMaterialId].scienceTip}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextCustomer}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-display text-lg text-white hover:bg-emerald-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>
                      {customerIdx + 1 < shiftCustomers.length
                        ? '다음 손님 맞이하기'
                        : '오늘 영업 결과 보기'}
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* 5 Material Rod Cards */}
            <section aria-label="판매할 막대 고르기" className="space-y-2.5">
              <div className="flex items-center justify-between text-sm text-[#6E5641]">
                <span className="font-semibold text-[#4A3520]">
                  손님에게 건네줄 막대를 골라 보세요
                </span>
                <span>총 5가지 물질 막대</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                {MATERIAL_LIST.map((mat) => (
                  <MaterialCard
                    key={mat.id}
                    material={mat}
                    onSelect={handleSelectMaterial}
                    disabled={Boolean(soldMaterialId)}
                    isWrongTried={wrongTried.includes(mat.id)}
                    isSuccessSelected={soldMaterialId === mat.id}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* SCREEN 4: DAY SUMMARY RESULT */}
        {screen === 'DAY_RESULT' && daySummary && (
          <div className="mx-auto w-full max-w-3xl my-auto rounded-3xl border-2 border-[#D6C3A5] bg-[#FFFDF9] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
                <Sparkles className="h-4 w-4" />
                <span>영업 {daySummary.dayNumber}일차 마감!</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-[#2F2419]">
                오늘도 멋진 막대 가게였어요!
              </h2>
              <p className="text-sm sm:text-base text-[#624B36]">
                동물 손님들에게 물질의 성질에 꼭 맞는 막대를 선물해 주었어요.
              </p>
            </div>

            {/* 4 Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-[#EAE0D0] bg-[#FAF4E8] p-4 text-center">
                <div className="text-xs font-medium text-[#6E5641]">응대한 손님</div>
                <div className="mt-1 font-num text-2xl font-bold text-[#2F2419]">
                  {daySummary.customersServed}명
                </div>
              </div>
              <div className="rounded-2xl border border-[#EAE0D0] bg-[#FAF4E8] p-4 text-center">
                <div className="text-xs font-medium text-[#6E5641]">한 번에 맞힌 수</div>
                <div className="mt-1 font-num text-2xl font-bold text-emerald-700">
                  {daySummary.firstTryCount}명
                </div>
              </div>
              <div className="rounded-2xl border border-[#EAE0D0] bg-[#FAF4E8] p-4 text-center">
                <div className="text-xs font-medium text-[#6E5641]">오늘 번 돈</div>
                <div className="mt-1 font-num text-2xl font-bold text-amber-700">
                  +{daySummary.coinsEarned.toLocaleString()}원
                </div>
              </div>
              <div className="rounded-2xl border border-[#EAE0D0] bg-[#FAF4E8] p-4 text-center">
                <div className="text-xs font-medium text-[#6E5641]">손님 만족도</div>
                <div className="mt-1 font-num text-2xl font-bold text-rose-600">
                  {daySummary.satisfactionRate}%
                </div>
              </div>
            </div>

            {/* Shop Growth Progress */}
            <div className="rounded-2xl border border-[#E2D4BE] bg-[#FAF6EE] p-5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-[#7A6147]">우리 가게 성장 단계</span>
                  <h3 className="font-display text-xl text-[#2F2419]">
                    Lv.{currentTier.level} {currentTier.name}
                  </h3>
                </div>
                <div className="text-right text-sm">
                  <span className="text-[#6E5641]">총 누적 매출 </span>
                  <strong className="font-num text-[#2F2419]">
                    {saveState.totalRevenue.toLocaleString()}원
                  </strong>
                </div>
              </div>

              <p className="text-sm text-[#5A4632]">{currentTier.description}</p>

              {nextTier ? (
                <div className="space-y-1.5 pt-1">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[#E8DCC9]">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            ((saveState.totalRevenue - currentTier.minRevenue) /
                              (nextTier.minRevenue - currentTier.minRevenue)) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-[#6E5641]">
                    다음 단계 <strong>{nextTier.name}</strong>까지{' '}
                    <span className="font-num font-bold text-amber-700">
                      {(nextTier.minRevenue - saveState.totalRevenue).toLocaleString()}원
                    </span>{' '}
                    남았어요!
                  </div>
                </div>
              ) : (
                <div className="text-xs font-semibold text-emerald-700">
                  최고 단계 가게를 달성했어요! 정말 대단해요!
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openDecorate('DAY_RESULT')}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 font-display text-xl text-white hover:bg-amber-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Paintbrush className="h-5 w-5" />
                <span>번 돈으로 가게 꾸미기 ({saveState.coins.toLocaleString()}원)</span>
              </button>
              <button
                type="button"
                onClick={startShift}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#D6C3A5] bg-white px-6 py-3.5 font-display text-xl text-[#2F2419] hover:bg-[#FAF2E4] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Store className="h-5 w-5" />
                <span>{saveState.dayCount}일차 영업 시작</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: DECORATE SHOP */}
        {screen === 'DECORATE' && (
          <DecorateView
            saveState={saveState}
            onBuy={handleBuyDecoration}
            onEquip={handleEquipDecoration}
            onBack={() => {
              soundEngine.playClick();
              setScreen(decorateReturnTo);
            }}
            sparkleTrigger={sparkleTrigger}
          />
        )}
      </main>

      {/* Modals */}
      {openModal === 'encyclopedia' && (
        <EncyclopediaModal
          saveState={saveState}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'achievements' && (
        <AchievementsModal
          saveState={saveState}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'reset' && (
        <ResetConfirmModal
          onClose={() => setOpenModal(null)}
          onConfirm={handleResetGame}
        />
      )}
    </div>
  );
}
