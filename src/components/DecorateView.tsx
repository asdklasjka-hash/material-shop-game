import React, { useState } from 'react';
import { Check, Coins, Lock, Sparkles, ArrowLeft } from 'lucide-react';
import {
  CATEGORY_LABELS,
  DECORATIONS,
  getShopTier,
} from '../data/decorations';
import { DecorationCategory, DecorationItem, SaveState } from '../types/game';
import { ShopScene } from './ShopScene';

interface DecorateViewProps {
  saveState: SaveState;
  onBuy: (item: DecorationItem) => void;
  onEquip: (item: DecorationItem) => void;
  onBack: () => void;
  sparkleTrigger: number;
}

const CATEGORIES: Array<{ id: 'all' | DecorationCategory; label: string }> = [
  { id: 'all', label: '전체 보기' },
  { id: 'sign', label: CATEGORY_LABELS.sign },
  { id: 'wallpaper', label: CATEGORY_LABELS.wallpaper },
  { id: 'chair', label: CATEGORY_LABELS.chair },
  { id: 'plant', label: CATEGORY_LABELS.plant },
  { id: 'lighting', label: CATEGORY_LABELS.lighting },
  { id: 'ornament', label: CATEGORY_LABELS.ornament },
  { id: 'exterior', label: CATEGORY_LABELS.exterior },
];

export const DecorateView: React.FC<DecorateViewProps> = ({
  saveState,
  onBuy,
  onEquip,
  onBack,
  sparkleTrigger,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | DecorationCategory>('all');
  const currentTier = getShopTier(saveState.totalRevenue);

  const visibleItems = DECORATIONS.filter((item) => {
    if (item.price === 0 && !item.id.endsWith('_wood') && !item.id.endsWith('_cream') && !item.id.endsWith('_basic') && !item.id.endsWith('_hut')) {
      return false;
    }
    return selectedCategory === 'all' || item.category === selectedCategory;
  });

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5D8C5] pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D6C3A5] bg-[#FFFDF9] px-4 py-2 text-sm font-semibold text-[#4A3520] hover:bg-[#FAF2E4] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>돌아가기</span>
          </button>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-[#2F2419]">
              내 가게 꾸미기
            </h2>
            <p className="text-sm text-[#6E5641]">
              번 돈으로 예쁜 인테리어를 사고 바로 가게에 적용해 보세요
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-sm font-semibold text-[#4A3520]">
          <div className="flex items-center gap-1.5">
            <Coins className="h-5 w-5 text-amber-500" />
            <span>보유 금액:</span>
            <span className="font-num text-lg font-bold text-amber-700">
              {saveState.coins.toLocaleString()}원
            </span>
          </div>
          <span className="text-[#C8B69B]" aria-hidden="true">·</span>
          <div>
            누적 매출{' '}
            <span className="font-num font-bold text-[#2F2419]">
              {saveState.totalRevenue.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* Live Preview Stage */}
      <ShopScene
        equipped={saveState.equippedDecorations}
        shopTierName={currentTier.name}
        sparkleTrigger={sparkleTrigger}
        previewMode
      />

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-[#F2E8D7] p-1.5">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#FFFDF9] text-[#2F2419] shadow-sm font-semibold'
                  : 'text-[#6E5641] hover:text-[#2F2419]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Decoration Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleItems.map((item) => {
          const isOwned = saveState.ownedDecorations.includes(item.id);
          const isEquipped = saveState.equippedDecorations[item.category] === item.id;
          const isUnlocked = saveState.totalRevenue >= item.unlockRevenue;
          const canAfford = saveState.coins >= item.price;

          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-2xl border p-4 transition-colors ${
                isEquipped
                  ? 'border-emerald-400 bg-emerald-50/50'
                  : 'border-[#E2D4BE] bg-[#FFFDF9]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-5 w-5 shrink-0 rounded-md border border-black/15"
                      style={{ backgroundColor: item.swatchHex }}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium text-[#7B6248]">
                      {item.categoryLabel}
                    </span>
                  </div>
                  <span className="font-num text-sm font-bold text-amber-700 whitespace-nowrap">
                    {item.price === 0 ? '기본' : `${item.price.toLocaleString()}원`}
                  </span>
                </div>

                <h3 className="mt-2 font-display text-xl text-[#2F2419]">{item.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#624B36]">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EFE4D4] flex items-center justify-between gap-2">
                {!isUnlocked && !isOwned ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    <span>누적 매출 {item.unlockRevenue.toLocaleString()}원에 열림</span>
                  </div>
                ) : isOwned ? (
                  isEquipped ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                      <Check className="h-4 w-4" />
                      현재 가게에 적용 중
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onEquip(item)}
                      className="w-full rounded-xl border border-emerald-500 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      가게에 꾸미기
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => onBuy(item)}
                    className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                      canAfford
                        ? 'bg-amber-500 text-white hover:bg-amber-600 cursor-pointer'
                        : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{canAfford ? '구매하고 꾸미기' : `${item.price - saveState.coins}원 더 필요해요`}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
