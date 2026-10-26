import React from 'react';
import { Bookmark, Trash2, Copy, Printer, Check } from 'lucide-react';
import { LottoBall } from './LottoBall';
import { LottoGame } from '../utils/lotto';
import { soundManager } from '../utils/audio';

interface SavedNumbersModalProps {
  savedGames: LottoGame[];
  onRemoveGame: (gameId: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const SavedNumbersModal: React.FC<SavedNumbersModalProps> = ({
  savedGames,
  onRemoveGame,
  onClearAll,
  onClose,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyNumbers = (game: LottoGame) => {
    navigator.clipboard.writeText(`${game.label}: ${game.numbers.join(', ')}`);
    setCopiedId(game.id);
    soundManager.playClick();
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              보관된 행운 번호 ({savedGames.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1">
          {savedGames.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs">
              <Bookmark className="w-8 h-8 mb-2 text-slate-300" />
              <span>보관된 번호가 없습니다.</span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                5게임 슬립에서 북마크 아이콘을 눌러 저장해보세요.
              </span>
            </div>
          ) : (
            savedGames.map((game) => (
              <div
                key={game.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-700 w-12 font-mono">
                    {game.label}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {game.numbers.map((n) => (
                      <LottoBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyNumbers(game)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                    title="복사"
                  >
                    {copiedId === game.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      onRemoveGame(game.id);
                      soundManager.playClick();
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {savedGames.length > 0 && (
              <>
                <button
                  onClick={onClearAll}
                  className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                >
                  전체 삭제
                </button>
                <span className="text-slate-300">·</span>
                <button
                  onClick={handlePrint}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  인쇄하기
                </button>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-xl cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
