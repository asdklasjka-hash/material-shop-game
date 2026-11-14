import React from 'react';
import { AnimalId, DecorationCategory } from '../types/game';
import { AnimalAvatar } from './AnimalAvatar';

interface ShopSceneProps {
  equipped: Record<DecorationCategory, string>;
  visitorAnimalId?: AnimalId;
  visitorMood?: 'normal' | 'happy' | 'hint';
  shopkeeperMood?: 'normal' | 'happy' | 'hint';
  shopTierName: string;
  sparkleTrigger?: number;
  previewMode?: boolean;
}

export const ShopScene: React.FC<ShopSceneProps> = ({
  equipped,
  visitorAnimalId,
  visitorMood = 'normal',
  shopkeeperMood = 'normal',
  shopTierName,
  sparkleTrigger = 0,
  previewMode = false,
}) => {
  const wallId = equipped.wallpaper || 'wall_cream';
  const signId = equipped.sign || 'sign_wood';
  const lightId = equipped.lighting || 'light_basic';
  const chairId = equipped.chair || 'chair_none';
  const plantId = equipped.plant || 'plant_none';
  const ornamentId = equipped.ornament || 'ornament_none';
  const extId = equipped.exterior || 'ext_hut';

  // Wallpaper styling
  const wallBgStyle: React.CSSProperties =
    wallId === 'wall_mint'
      ? {
          backgroundColor: '#E6F7F0',
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(16,185,129,0.08) 0px, rgba(16,185,129,0.08) 28px, transparent 28px, transparent 56px)',
        }
      : wallId === 'wall_sky'
      ? {
          background: 'linear-gradient(180deg, #DDF2FE 0%, #F0F9FF 70%, #F9EFE2 100%)',
        }
      : {
          backgroundColor: '#FAF2E4',
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(180,130,75,0.06) 0px, rgba(180,130,75,0.06) 44px, transparent 44px, transparent 88px)',
        };

  // Counter & Exterior trim colors
  const counterColor =
    extId === 'ext_palace'
      ? 'bg-amber-800 border-amber-500'
      : extId === 'ext_bakery'
      ? 'bg-rose-800 border-rose-300'
      : 'bg-[#8B5A2B] border-[#5C3A1B]';

  const counterTopColor =
    extId === 'ext_palace'
      ? 'bg-amber-300 border-amber-600'
      : extId === 'ext_bakery'
      ? 'bg-amber-100 border-amber-400'
      : 'bg-[#DEB887] border-[#8B5A2B]';

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border-2 border-[#D6C3A5] shadow-sm select-none"
      style={wallBgStyle}
    >
      {/* Sky clouds if sky wallpaper equipped */}
      {wallId === 'wall_sky' && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-85">
          <svg viewBox="0 0 800 220" className="w-full h-36">
            <g fill="#FFFFFF">
              <circle cx="110" cy="65" r="22" />
              <circle cx="135" cy="58" r="26" />
              <circle cx="162" cy="66" r="20" />
              <rect x="108" y="65" width="56" height="22" rx="11" />

              <circle cx="620" cy="52" r="20" />
              <circle cx="645" cy="46" r="25" />
              <circle cx="672" cy="55" r="18" />
              <rect x="618" y="52" width="56" height="20" rx="10" />
            </g>
          </svg>
        </div>
      )}

      {/* Exterior Awning / Roof Trim */}
      {extId === 'ext_hut' && (
        <div className="relative z-10 h-5 w-full bg-[#9A6332] border-b-2 border-[#6B421E]" />
      )}
      {extId === 'ext_bakery' && (
        <div className="relative z-10 flex h-7 w-full overflow-hidden border-b-2 border-rose-400">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-b-lg ${i % 2 === 0 ? 'bg-rose-400' : 'bg-amber-50'}`}
            />
          ))}
        </div>
      )}
      {extId === 'ext_palace' && (
        <div className="relative z-10 flex h-8 w-full overflow-hidden border-b-2 border-amber-600 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-b-xl border-r border-amber-500/40 ${
                i % 2 === 0 ? 'bg-amber-400' : 'bg-teal-600'
              }`}
            />
          ))}
        </div>
      )}

      {/* Lighting Layer */}
      {lightId === 'light_lantern' && (
        <div className="pointer-events-none relative z-10 flex justify-between px-10 sm:px-20">
          {[0, 1].map((idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-amber-800" />
              <div className="w-10 h-11 rounded-full bg-amber-300 border-2 border-amber-600 shadow-[0_6px_22px_rgba(251,191,36,0.55)] flex items-center justify-center">
                <div className="w-5 h-7 rounded-full bg-amber-100/80" />
              </div>
            </div>
          ))}
        </div>
      )}
      {lightId === 'light_garland' && (
        <div className="pointer-events-none relative z-10 w-full px-4 pt-1">
          <svg viewBox="0 0 600 42" className="w-full h-9 overflow-visible">
            <path
              d="M 0 6 Q 150 36 300 10 Q 450 36 600 6"
              fill="none"
              stroke="#78350F"
              strokeWidth="2.5"
            />
            {[60, 140, 220, 300, 380, 460, 540].map((x, idx) => {
              const y = idx % 2 === 0 ? 18 : 22;
              return (
                <g key={x}>
                  <circle cx={x} cy={y} r="7" fill="#FDE047" opacity="0.45" />
                  <circle cx={x} cy={y} r="4.5" fill={idx % 2 === 0 ? '#FACC15' : '#FB923C'} stroke="#92400E" strokeWidth="1.2" />
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Main Interior Stage */}
      <div className={`relative z-10 px-4 sm:px-8 pt-3 ${previewMode ? 'pb-4' : 'pb-2'}`}>
        {/* Top Wall Elements: Window, Signboard, Shelf */}
        <div className="flex items-start justify-between gap-3">
          {/* Left Window + Plant */}
          <div className="hidden sm:flex flex-col items-center">
            <div className="w-28 h-24 rounded-xl border-4 border-[#9A6332] bg-sky-100 overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-amber-50/70" />
              <div className="absolute inset-x-0 top-1/2 h-1 bg-[#9A6332]" />
              <div className="absolute inset-y-0 left-1/2 w-1 bg-[#9A6332]" />
              {lightId === 'light_basic' && (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/45 to-transparent" />
              )}
            </div>
            {/* Plant on Window Sill */}
            <div className="w-32 h-2.5 rounded-sm bg-[#8B5A2B] border border-[#5C3A1B]" />
            {plantId === 'plant_sunflower' && (
              <div className="-mt-11 flex items-end gap-1">
                <svg viewBox="0 0 64 56" className="w-16 h-14">
                  <rect x="20" y="34" width="24" height="18" rx="3" fill="#D97706" stroke="#2F2419" strokeWidth="2" />
                  <rect x="17" y="31" width="30" height="5" rx="2" fill="#F59E0B" stroke="#2F2419" strokeWidth="2" />
                  <line x1="32" y1="31" x2="32" y2="16" stroke="#15803D" strokeWidth="3.5" />
                  <ellipse cx="25" cy="24" rx="5" ry="2.5" transform="rotate(-25 25 24)" fill="#22C55E" />
                  <circle cx="32" cy="13" r="9" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.8" />
                  <circle cx="32" cy="13" r="4.5" fill="#78350F" />
                </svg>
              </div>
            )}
            {plantId === 'plant_tulip' && (
              <div className="-mt-11">
                <svg viewBox="0 0 90 56" className="w-22 h-14">
                  <rect x="14" y="34" width="62" height="18" rx="3" fill="#FB7185" stroke="#2F2419" strokeWidth="2" />
                  <line x1="28" y1="34" x2="28" y2="16" stroke="#16A34A" strokeWidth="3" />
                  <line x1="45" y1="34" x2="45" y2="13" stroke="#16A34A" strokeWidth="3" />
                  <line x1="62" y1="34" x2="62" y2="17" stroke="#16A34A" strokeWidth="3" />
                  <path d="M 22 16 C 22 7 34 7 34 16 Z" fill="#F43F5E" />
                  <path d="M 39 13 C 39 4 51 4 51 13 Z" fill="#FACC15" />
                  <path d="M 56 17 C 56 8 68 8 68 17 Z" fill="#A855F7" />
                </svg>
              </div>
            )}
          </div>

          {/* Center Signboard */}
          <div className="mx-auto flex flex-col items-center">
            {signId === 'sign_wood' && (
              <div className="rounded-xl border-2 border-[#6B421E] bg-[#C68B59] px-5 py-2 shadow-sm text-center">
                <div className="font-display text-base sm:text-lg text-[#FFFBEB] tracking-wide">
                  물질 가게
                </div>
                <div className="text-[11px] font-medium text-[#FEF3C7]">{shopTierName}</div>
              </div>
            )}
            {signId === 'sign_flower' && (
              <div className="rounded-xl border-2 border-rose-300 bg-rose-50 px-6 py-2 shadow-sm text-center">
                <div className="font-display text-base sm:text-lg text-rose-800 tracking-wide">
                  ✿ 물질 가게 ✿
                </div>
                <div className="text-[11px] font-medium text-rose-600">{shopTierName}</div>
              </div>
            )}
            {signId === 'sign_star' && (
              <div className="rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-100 via-yellow-50 to-sky-100 px-6 py-2 shadow-sm text-center">
                <div className="font-display text-base sm:text-lg text-amber-900 tracking-wide">
                  ★ 반짝 물질 가게 ★
                </div>
                <div className="text-[11px] font-semibold text-amber-700">{shopTierName}</div>
              </div>
            )}
          </div>

          {/* Right Shelf + Rod Display Jars + Animal Ornament */}
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-end gap-3 px-2">
              {/* Decorative Display Rod Jar */}
              <svg viewBox="0 0 44 46" className="w-10 h-11">
                <rect x="10" y="18" width="24" height="25" rx="4" fill="#E0F2FE" fillOpacity="0.85" stroke="#475569" strokeWidth="2" />
                <line x1="17" y1="6" x2="19" y2="38" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
                <line x1="23" y1="4" x2="23" y2="38" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
                <line x1="29" y1="7" x2="27" y2="38" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              </svg>

              {/* Ornament Slot */}
              {ornamentId === 'ornament_cat' && (
                <svg viewBox="0 0 46 48" className="w-11 h-12" aria-label="고양이 장식품">
                  <polygon points="12,20 14,9 21,16" fill="#FFFFFF" stroke="#2F2419" strokeWidth="2" />
                  <polygon points="34,20 32,9 25,16" fill="#FFFFFF" stroke="#2F2419" strokeWidth="2" />
                  <ellipse cx="23" cy="30" rx="13" ry="14" fill="#FFFFFF" stroke="#2F2419" strokeWidth="2" />
                  <circle cx="19" cy="24" r="1.8" fill="#2F2419" />
                  <circle cx="27" cy="24" r="1.8" fill="#2F2419" />
                  <path d="M 16 32 Q 23 36 30 32" fill="none" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="23" cy="35" r="3" fill="#FACC15" />
                </svg>
              )}
              {ornamentId === 'ornament_owl' && (
                <svg viewBox="0 0 48 52" className="w-12 h-13" aria-label="부엉이 시계">
                  <ellipse cx="24" cy="28" rx="14" ry="18" fill="#9A5B25" stroke="#2F2419" strokeWidth="2" />
                  <circle cx="19" cy="18" r="5" fill="#FEF3C7" stroke="#2F2419" strokeWidth="1.5" />
                  <circle cx="29" cy="18" r="5" fill="#FEF3C7" stroke="#2F2419" strokeWidth="1.5" />
                  <circle cx="19" cy="18" r="2" fill="#2F2419" />
                  <circle cx="29" cy="18" r="2" fill="#2F2419" />
                  <polygon points="22,22 26,22 24,26" fill="#F59E0B" />
                  <circle cx="24" cy="35" r="7" fill="#FFFBEB" stroke="#2F2419" strokeWidth="1.6" />
                  <line x1="24" y1="35" x2="24" y2="30.5" stroke="#2F2419" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="24" y1="35" x2="27.5" y2="35" stroke="#2F2419" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div className="w-32 h-2.5 rounded-sm bg-[#8B5A2B] border border-[#5C3A1B]" />
          </div>
        </div>

        {/* Characters & Counter Floor Area */}
        <div className="mt-2 sm:mt-4 grid grid-cols-12 items-end gap-2">
          {/* Left: Shopkeeper behind counter */}
          <div className="col-span-4 sm:col-span-4 flex flex-col items-center justify-end">
            <div className="animate-float-gentle">
              <AnimalAvatar animalId="shopkeeper" mood={shopkeeperMood} className="w-24 h-24 sm:w-28 sm:h-28" />
            </div>
            <span className="mt-0.5 text-xs font-semibold text-[#5C3D2E]">사장님 (나)</span>
          </div>

          {/* Center/Right: Visiting Customer OR Chair preview */}
          <div className="col-span-5 sm:col-span-5 flex flex-col items-center justify-end min-h-[110px]">
            {visitorAnimalId ? (
              <div
                key={visitorAnimalId + visitorMood}
                className="flex flex-col items-center transition-transform duration-200"
              >
                <AnimalAvatar
                  animalId={visitorAnimalId}
                  mood={visitorMood}
                  className="w-28 h-28 sm:w-32 sm:h-32"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center text-xs text-[#6E5641]">
                <span>손님을 기다리는 중이에요</span>
              </div>
            )}
          </div>

          {/* Far Right: Cute Chair slot */}
          <div className="col-span-3 sm:col-span-3 flex flex-col items-center justify-end pb-1">
            {chairId === 'chair_stool' && (
              <svg viewBox="0 0 60 54" className="w-14 h-12" aria-label="동글 원목 의자">
                <line x1="18" y1="24" x2="14" y2="49" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
                <line x1="42" y1="24" x2="46" y2="49" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
                <line x1="30" y1="24" x2="30" y2="49" stroke="#92400E" strokeWidth="4.5" strokeLinecap="round" />
                <ellipse cx="30" cy="21" rx="20" ry="7" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
              </svg>
            )}
            {chairId === 'chair_bear' && (
              <svg viewBox="0 0 68 62" className="w-16 h-14" aria-label="곰돌이 쿠션 의자">
                <circle cx="20" cy="14" r="7" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.2" />
                <circle cx="48" cy="14" r="7" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.2" />
                <rect x="16" y="15" width="36" height="22" rx="10" fill="#FB923C" stroke="#9A3412" strokeWidth="2.2" />
                <line x1="20" y1="42" x2="17" y2="57" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
                <line x1="48" y1="42" x2="51" y2="57" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
                <rect x="13" y="34" width="42" height="10" rx="5" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.2" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Wooden Shop Counter Bar */}
      <div className={`relative z-20 h-3 border-t-2 ${counterTopColor}`} />
      <div className={`relative z-20 h-8 sm:h-10 border-t-2 ${counterColor} flex items-center justify-between px-6`}>
        <div className="flex items-center gap-2 text-xs font-medium text-amber-100/90">
          <span>나무 · 플라스틱 · 철 · 유리 · 고무 막대 전문점</span>
        </div>
        {extId === 'ext_palace' && (
          <span className="text-xs font-semibold text-amber-200">★ 명품 백화점 ★</span>
        )}
      </div>

      {/* Sparkle Overlay on Purchase */}
      {sparkleTrigger > 0 && (
        <div
          key={sparkleTrigger}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
        >
          <div className="animate-sparkle-pop text-4xl text-amber-400 drop-shadow">✦ ✧ ✦</div>
        </div>
      )}
    </div>
  );
};
