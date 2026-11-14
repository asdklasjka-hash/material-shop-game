import React from 'react';
import { AnimalId } from '../types/game';

interface AnimalAvatarProps {
  animalId: AnimalId | 'shopkeeper';
  mood?: 'normal' | 'happy' | 'hint';
  className?: string;
}

export const AnimalAvatar: React.FC<AnimalAvatarProps> = ({
  animalId,
  mood = 'normal',
  className = 'w-32 h-32',
}) => {
  const isHappy = mood === 'happy';
  const isHint = mood === 'hint';

  const renderEyes = (y = 58, xOffset = 14) => {
    if (isHappy) {
      return (
        <g stroke="#2F2419" strokeWidth="3.2" strokeLinecap="round" fill="none">
          <path d={`M ${50 - xOffset - 5} ${y + 1} Q ${50 - xOffset} ${y - 6} ${50 - xOffset + 5} ${y + 1}`} />
          <path d={`M ${50 + xOffset - 5} ${y + 1} Q ${50 + xOffset} ${y - 6} ${50 + xOffset + 5} ${y + 1}`} />
        </g>
      );
    }
    return (
      <g>
        <circle cx={50 - xOffset} cy={y} r="4.2" fill="#2F2419" />
        <circle cx={50 - xOffset - 1.3} cy={y - 1.4} r="1.4" fill="#FFFFFF" />
        <circle cx={50 + xOffset} cy={y} r="4.2" fill="#2F2419" />
        <circle cx={50 + xOffset - 1.3} cy={y - 1.4} r="1.4" fill="#FFFFFF" />
        {isHint && (
          <g stroke="#2F2419" strokeWidth="2.4" strokeLinecap="round">
            <line x1={50 - xOffset - 5} y1={y - 8} x2={50 - xOffset + 4} y2={y - 10} />
            <line x1={50 + xOffset - 4} y1={y - 10} x2={50 + xOffset + 5} y2={y - 8} />
          </g>
        )}
      </g>
    );
  };

  const renderMouth = (y = 70) => {
    if (isHappy) {
      return (
        <path
          d={`M 43 ${y - 1} Q 50 ${y + 9} 57 ${y - 1} Z`}
          fill="#FB7185"
          stroke="#2F2419"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      );
    }
    if (isHint) {
      return (
        <path
          d={`M 45 ${y + 2} Q 50 ${y - 1} 55 ${y + 2}`}
          fill="none"
          stroke="#2F2419"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    }
    return (
      <path
        d={`M 44 ${y} Q 47 ${y + 4} 50 ${y} Q 53 ${y + 4} 56 ${y}`}
        fill="none"
        stroke="#2F2419"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    );
  };

  const renderBlush = (y = 65) => (
    <g opacity={isHappy ? 0.85 : 0.55}>
      <ellipse cx="29" cy={y} rx="5.5" ry="3.2" fill="#FDA4AF" />
      <ellipse cx="71" cy={y} rx="5.5" ry="3.2" fill="#FDA4AF" />
    </g>
  );

  if (animalId === 'shopkeeper') {
    return (
      <svg viewBox="0 0 100 108" className={className} aria-label="가게 사장님">
        {/* Hair Back */}
        <circle cx="50" cy="46" r="29" fill="#5C3D2E" />
        {/* Apron & Shirt */}
        <path d="M 24 98 C 24 76 76 76 76 98 Z" fill="#FDE68A" stroke="#2F2419" strokeWidth="2.6" />
        <path d="M 33 80 L 33 98 L 67 98 L 67 80 Z" fill="#10B981" stroke="#2F2419" strokeWidth="2.4" />
        <rect x="42" y="86" width="16" height="9" rx="3" fill="#ECFDF5" stroke="#2F2419" strokeWidth="1.8" />
        {/* Face */}
        <circle cx="50" cy="52" r="24" fill="#FDE0C6" stroke="#2F2419" strokeWidth="2.6" />
        {/* Hair Bangs & Headband */}
        <path
          d="M 26 48 C 28 28 72 28 74 48 C 66 40 58 38 50 43 C 42 38 34 40 26 48 Z"
          fill="#5C3D2E"
          stroke="#2F2419"
          strokeWidth="2.4"
        />
        <path d="M 27 42 Q 50 28 73 42" fill="none" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
        {renderEyes(54, 11)}
        {renderBlush(61)}
        {renderMouth(64)}
      </svg>
    );
  }

  switch (animalId) {
    case 'rabbit':
      return (
        <svg viewBox="0 0 100 108" className={className} aria-label="토끼 손님">
          {/* Long Ears */}
          <ellipse cx="36" cy="24" rx="8.5" ry="21" transform="rotate(-8 36 24)" fill="#FFFDF9" stroke="#2F2419" strokeWidth="2.6" />
          <ellipse cx="36" cy="25" rx="4.2" ry="13" transform="rotate(-8 36 25)" fill="#FBCFE8" />
          <ellipse cx="64" cy="24" rx="8.5" ry="21" transform="rotate(8 64 24)" fill="#FFFDF9" stroke="#2F2419" strokeWidth="2.6" />
          <ellipse cx="64" cy="25" rx="4.2" ry="13" transform="rotate(8 64 25)" fill="#FBCFE8" />
          {/* Body */}
          <path d="M 26 98 C 28 76 72 76 74 98 Z" fill="#93C5FD" stroke="#2F2419" strokeWidth="2.6" />
          {/* Head */}
          <ellipse cx="50" cy="60" rx="28" ry="24" fill="#FFFDF9" stroke="#2F2419" strokeWidth="2.6" />
          {renderEyes(58, 13)}
          {renderBlush(65)}
          <ellipse cx="50" cy="64" rx="3.2" ry="2.2" fill="#F472B6" />
          {renderMouth(70)}
        </svg>
      );

    case 'bear':
      return (
        <svg viewBox="0 0 100 108" className={className} aria-label="곰 손님">
          {/* Round Ears */}
          <circle cx="27" cy="34" r="10" fill="#B47238" stroke="#2F2419" strokeWidth="2.6" />
          <circle cx="27" cy="34" r="5" fill="#FDE68A" />
          <circle cx="73" cy="34" r="10" fill="#B47238" stroke="#2F2419" strokeWidth="2.6" />
          <circle cx="73" cy="34" r="5" fill="#FDE68A" />
          {/* Body */}
          <path d="M 22 98 C 24 75 76 75 78 98 Z" fill="#65A30D" stroke="#2F2419" strokeWidth="2.6" />
          {/* Head */}
          <ellipse cx="50" cy="58" rx="29" ry="26" fill="#B47238" stroke="#2F2419" strokeWidth="2.6" />
          {/* Snout */}
          <ellipse cx="50" cy="66" rx="12" ry="9.5" fill="#FEF3C7" />
          {renderEyes(54, 14)}
          {renderBlush(62)}
          <ellipse cx="50" cy="62" rx="4.5" ry="3.2" fill="#2F2419" />
          {renderMouth(69)}
        </svg>
      );

    case 'fox':
      return (
        <svg viewBox="0 0 100 108" className={className} aria-label="여우 손님">
          {/* Pointy Ears */}
          <polygon points="22,48 26,18 44,36" fill="#EA580C" stroke="#2F2419" strokeWidth="2.6" strokeLinejoin="round" />
          <polygon points="26,42 28,24 38,36" fill="#FFFBEB" />
          <polygon points="78,48 74,18 56,36" fill="#EA580C" stroke="#2F2419" strokeWidth="2.6" strokeLinejoin="round" />
          <polygon points="74,42 72,24 62,36" fill="#FFFBEB" />
          {/* Body */}
          <path d="M 24 98 C 28 76 72 76 76 98 Z" fill="#F59E0B" stroke="#2F2419" strokeWidth="2.6" />
          {/* Head */}
          <ellipse cx="50" cy="59" rx="29" ry="24" fill="#EA580C" stroke="#2F2419" strokeWidth="2.6" />
          {/* White Cheeks */}
          <path d="M 21 60 Q 36 58 50 76 Q 64 58 79 60 Q 74 83 50 83 Q 26 83 21 60 Z" fill="#FFFBEB" />
          {renderEyes(55, 13)}
          {renderBlush(64)}
          <circle cx="50" cy="66" r="3.4" fill="#2F2419" />
          {renderMouth(72)}
        </svg>
      );

    case 'panda':
      return (
        <svg viewBox="0 0 100 108" className={className} aria-label="판다 손님">
          {/* Dark Ears */}
          <circle cx="27" cy="34" r="10.5" fill="#334155" stroke="#2F2419" strokeWidth="2.6" />
          <circle cx="73" cy="34" r="10.5" fill="#334155" stroke="#2F2419" strokeWidth="2.6" />
          {/* Body */}
          <path d="M 23 98 C 25 76 75 76 77 98 Z" fill="#334155" stroke="#2F2419" strokeWidth="2.6" />
          <ellipse cx="50" cy="92" rx="14" ry="8" fill="#FFFFFF" />
          {/* Head */}
          <ellipse cx="50" cy="58" rx="29" ry="25" fill="#FFFFFF" stroke="#2F2419" strokeWidth="2.6" />
          {/* Eye Patches */}
          <ellipse cx="36" cy="56" rx="9" ry="7.5" transform="rotate(-15 36 56)" fill="#334155" />
          <ellipse cx="64" cy="56" rx="9" ry="7.5" transform="rotate(15 64 56)" fill="#334155" />
          {isHappy ? (
            <g stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" fill="none">
              <path d="M 31 57 Q 36 51 41 57" />
              <path d="M 59 57 Q 64 51 69 57" />
            </g>
          ) : (
            <g>
              <circle cx="36" cy="56" r="3.2" fill="#FFFFFF" />
              <circle cx="64" cy="56" r="3.2" fill="#FFFFFF" />
            </g>
          )}
          {renderBlush(66)}
          <ellipse cx="50" cy="64" rx="4" ry="2.8" fill="#2F2419" />
          {renderMouth(70)}
        </svg>
      );

    case 'puppy':
      return (
        <svg viewBox="0 0 100 108" className={className} aria-label="강아지 손님">
          {/* Floppy Ears */}
          <ellipse cx="22" cy="56" rx="9" ry="18" transform="rotate(14 22 56)" fill="#92400E" stroke="#2F2419" strokeWidth="2.6" />
          <ellipse cx="78" cy="56" rx="9" ry="18" transform="rotate(-14 78 56)" fill="#92400E" stroke="#2F2419" strokeWidth="2.6" />
          {/* Body & Collar */}
          <path d="M 24 98 C 26 76 74 76 76 98 Z" fill="#F59E0B" stroke="#2F2419" strokeWidth="2.6" />
          <path d="M 35 80 Q 50 86 65 80" fill="none" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
          {/* Head */}
          <ellipse cx="50" cy="57" rx="28" ry="25" fill="#FDE68A" stroke="#2F2419" strokeWidth="2.6" />
          <ellipse cx="50" cy="65" rx="13" ry="9" fill="#FFFBEB" />
          {renderEyes(54, 13)}
          {renderBlush(62)}
          <ellipse cx="50" cy="62" rx="4.5" ry="3.2" fill="#2F2419" />
          {renderMouth(69)}
        </svg>
      );

    case 'cat':
      return (
        <svg viewBox="0 0 100 108" className={className} aria-label="고양이 손님">
          {/* Triangular Ears */}
          <polygon points="24,48 25,21 43,36" fill="#FDBA74" stroke="#2F2419" strokeWidth="2.6" strokeLinejoin="round" />
          <polygon points="28,43 28,27 38,37" fill="#FBCFE8" />
          <polygon points="76,48 75,21 57,36" fill="#FDBA74" stroke="#2F2419" strokeWidth="2.6" strokeLinejoin="round" />
          <polygon points="72,43 72,27 62,37" fill="#FBCFE8" />
          {/* Body */}
          <path d="M 24 98 C 26 76 74 76 76 98 Z" fill="#FB7185" stroke="#2F2419" strokeWidth="2.6" />
          {/* Head */}
          <ellipse cx="50" cy="58" rx="28" ry="24" fill="#FDE68A" stroke="#2F2419" strokeWidth="2.6" />
          {/* Forehead Stripes */}
          <g stroke="#EA580C" strokeWidth="2.8" strokeLinecap="round">
            <line x1="50" y1="36" x2="50" y2="43" />
            <line x1="43" y1="37" x2="45" y2="43" />
            <line x1="57" y1="37" x2="55" y2="43" />
          </g>
          {/* Whiskers */}
          <g stroke="#2F2419" strokeWidth="1.8" strokeLinecap="round">
            <line x1="16" y1="61" x2="27" y2="62" />
            <line x1="16" y1="67" x2="27" y2="66" />
            <line x1="84" y1="61" x2="73" y2="62" />
            <line x1="84" y1="67" x2="73" y2="66" />
          </g>
          {renderEyes(56, 13)}
          {renderBlush(64)}
          <polygon points="47,62 53,62 50,65" fill="#F472B6" />
          {renderMouth(69)}
        </svg>
      );

    case 'monkey':
      return (
        <svg viewBox="0 0 100 108" className={className} aria-label="원숭이 손님">
          {/* Big Round Ears */}
          <circle cx="20" cy="55" r="10" fill="#9A5B25" stroke="#2F2419" strokeWidth="2.6" />
          <circle cx="20" cy="55" r="5.5" fill="#FDE68A" />
          <circle cx="80" cy="55" r="10" fill="#9A5B25" stroke="#2F2419" strokeWidth="2.6" />
          <circle cx="80" cy="55" r="5.5" fill="#FDE68A" />
          {/* Body */}
          <path d="M 25 98 C 27 76 73 76 75 98 Z" fill="#14B8A6" stroke="#2F2419" strokeWidth="2.6" />
          {/* Head */}
          <ellipse cx="50" cy="57" rx="27" ry="25" fill="#9A5B25" stroke="#2F2419" strokeWidth="2.6" />
          {/* Face Mask */}
          <path
            d="M 29 53 C 29 41 44 41 50 48 C 56 41 71 41 71 53 C 73 71 65 79 50 79 C 35 79 27 71 29 53 Z"
            fill="#FDE68A"
          />
          {renderEyes(55, 11)}
          {renderBlush(63)}
          <circle cx="47.5" cy="63" r="1.4" fill="#2F2419" />
          <circle cx="52.5" cy="63" r="1.4" fill="#2F2419" />
          {renderMouth(69)}
        </svg>
      );

    case 'penguin':
      return (
        <svg viewBox="0 0 100 108" className={className} aria-label="펭귄 손님">
          {/* Body */}
          <path d="M 22 98 C 24 72 76 72 78 98 Z" fill="#334155" stroke="#2F2419" strokeWidth="2.6" />
          <path d="M 35 98 C 36 80 64 80 65 98 Z" fill="#FFFFFF" />
          {/* Scarf */}
          <path d="M 31 79 Q 50 86 69 79" fill="none" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
          {/* Head */}
          <ellipse cx="50" cy="56" rx="28" ry="26" fill="#334155" stroke="#2F2419" strokeWidth="2.6" />
          {/* White Face Heart */}
          <path
            d="M 27 56 C 27 42 44 42 50 50 C 56 42 73 42 73 56 C 73 72 62 79 50 79 C 38 79 27 72 27 56 Z"
            fill="#FFFFFF"
          />
          {renderEyes(55, 13)}
          {renderBlush(63)}
          {/* Orange Beak */}
          <polygon points="44,61 56,61 50,69" fill="#F59E0B" stroke="#2F2419" strokeWidth="2.2" strokeLinejoin="round" />
          {isHappy && (
            <path d="M 45 69 Q 50 74 55 69" fill="none" stroke="#2F2419" strokeWidth="2.2" strokeLinecap="round" />
          )}
        </svg>
      );
  }
};
