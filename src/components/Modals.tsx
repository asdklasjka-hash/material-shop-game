import React from 'react';
import { Award, BookOpen, CheckCircle2, X } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { MATERIAL_LIST } from '../data/materials';
import { SaveState } from '../types/game';

interface ModalProps {
  onClose: () => void;
}

export const EncyclopediaModal: React.FC<ModalProps & { saveState: SaveState }> = ({
  onClose,
  saveState,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="물질 성질 도감"
    >
      <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border-2 border-[#D6C3A5] bg-[#FFFDF9] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#EFE4D4] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <h2 className="font-display text-2xl text-[#2F2419]">사장님의 물질 성질 도감</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-lg p-1.5 text-[#6E5641] hover:bg-[#F3E8D7] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-[#624B36]">
          우리 가게에서 판매하는 5가지 막대는 물질마다 서로 다른 성질을 가지고 있어요.
        </p>

        <div className="mt-4 space-y-3">
          {MATERIAL_LIST.map((mat) => {
            const hasSold = saveState.soldMaterials.includes(mat.id);
            return (
              <div
                key={mat.id}
                className="flex flex-col sm:flex-row items-start gap-4 rounded-xl border border-[#E6D9C5] bg-[#FAF5EC] p-4"
              >
                <img
                  src={mat.image}
                  alt={mat.name}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 shrink-0 rounded-xl border border-[#DFD0B8] object-cover bg-white"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-xl text-[#2F2419]">{mat.name}</h3>
                    <span className="text-xs font-medium text-[#7A6147]">
                      · {hasSold ? '판매해 본 막대' : '아직 판매 전'}
                    </span>
                  </div>
                  <ul className="mt-1.5 list-disc pl-5 text-sm text-[#4A3520] space-y-0.5">
                    {mat.properties.map((prop) => (
                      <li key={prop}>{prop}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-[#6E5641]">{mat.scienceTip}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors cursor-pointer"
          >
            확인했어요
          </button>
        </div>
      </div>
    </div>
  );
};

export const AchievementsModal: React.FC<ModalProps & { saveState: SaveState }> = ({
  onClose,
  saveState,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="도전 과제"
    >
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-2 border-[#D6C3A5] bg-[#FFFDF9] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#EFE4D4] pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-600" />
            <h2 className="font-display text-2xl text-[#2F2419]">가게 도전 과제</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-lg p-1.5 text-[#6E5641] hover:bg-[#F3E8D7] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-[#624B36]">
          도전 과제를 달성하면 가게 꾸미기에 쓸 수 있는 보너스 돈을 받아요!
        </p>

        <div className="mt-4 space-y-3">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = saveState.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`flex items-start justify-between gap-4 rounded-xl border p-4 ${
                  unlocked
                    ? 'border-emerald-300 bg-emerald-50/70'
                    : 'border-[#E6D9C5] bg-[#FAF5EC]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      unlocked ? 'text-emerald-600' : 'text-stone-400'
                    }`}
                  />
                  <div>
                    <h3 className="font-display text-lg text-[#2F2419]">{ach.title}</h3>
                    <p className="text-sm text-[#624B36]">{ach.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`font-num text-sm font-bold ${
                      unlocked ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    +{ach.rewardCoins}원
                  </span>
                  <div className="text-xs font-medium text-[#6E5641]">
                    {unlocked ? '달성 완료' : '진행 중'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export const ResetConfirmModal: React.FC<
  ModalProps & { onConfirm: () => void }
> = ({ onClose, onConfirm }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="가게 기록 초기화"
    >
      <div className="w-full max-w-md rounded-2xl border-2 border-[#D6C3A5] bg-[#FFFDF9] p-6 shadow-xl">
        <h2 className="font-display text-2xl text-[#2F2419]">처음부터 다시 시작할까요?</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#624B36]">
          지금까지 모은 돈과 구매한 가게 인테리어, 도전 과제 기록이 모두 처음 상태로 돌아가요.
        </p>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#D6C3A5] bg-white px-4 py-2 text-sm font-semibold text-[#4A3520] hover:bg-[#FAF2E4] transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer"
          >
            처음부터 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};
