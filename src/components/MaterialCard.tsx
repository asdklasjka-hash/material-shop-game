import React, { useState } from 'react';
import { MaterialInfo } from '../types/game';

interface MaterialCardProps {
  material: MaterialInfo;
  onSelect: (id: MaterialInfo['id']) => void;
  disabled?: boolean;
  isWrongTried?: boolean;
  isSuccessSelected?: boolean;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onSelect,
  disabled = false,
  isWrongTried = false,
  isSuccessSelected = false,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelect(material.id)}
      disabled={disabled}
      className={`group relative flex flex-col items-center rounded-2xl border-2 p-2.5 sm:p-3 text-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/70 ${
        isSuccessSelected
          ? 'border-emerald-500 bg-emerald-50 -translate-y-1 shadow-md'
          : isWrongTried
          ? 'border-stone-300 bg-stone-100/80 opacity-60'
          : 'border-[#DCCBB1] bg-[#FFFDF9] hover:-translate-y-1 hover:border-amber-500 hover:shadow-md active:translate-y-0 cursor-pointer'
      }`}
    >
      <div className="relative w-full aspect-square max-w-[112px] overflow-hidden rounded-xl border border-[#EAE0D0] bg-[#FAF4E8] flex items-center justify-center">
        {!imgError ? (
          <img
            src={material.image}
            alt={material.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-2">
            <div
              className="h-14 w-3.5 rounded-full border-2 border-[#2F2419]"
              style={{ backgroundColor: material.accentHex }}
            />
            <span className="mt-1 text-xs font-semibold text-[#5C3D2E]">
              {material.shortLabel}
            </span>
          </div>
        )}
      </div>

      <span className="mt-2 font-display text-base sm:text-lg text-[#2F2419] whitespace-nowrap">
        {material.name}
      </span>

      {isWrongTried && (
        <span className="mt-0.5 text-xs font-medium text-stone-500">다시 생각해 보기</span>
      )}
    </button>
  );
};
