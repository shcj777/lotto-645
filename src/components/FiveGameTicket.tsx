import React from 'react';
import { Copy, RefreshCw, Bookmark, BookmarkCheck, Check } from 'lucide-react';
import { LottoBall } from './LottoBall';
import { LottoGame, calculateLottoStats } from '../utils/lotto';
import { soundManager } from '../utils/audio';

interface FiveGameTicketProps {
  games: LottoGame[];
  onRerollGame: (gameId: string) => void;
  onSaveGame?: (game: LottoGame) => void;
  isSaved?: (gameId: string) => boolean;
}

export const FiveGameTicket: React.FC<FiveGameTicketProps> = ({
  games,
  onRerollGame,
  onSaveGame,
  isSaved,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [copiedAll, setCopiedAll] = React.useState(false);

  const copyGameNumbers = (game: LottoGame) => {
    const text = `${game.label}: ${game.numbers.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(game.id);
    soundManager.playClick();
    setTimeout(() => setCopiedId(null), 1800);
  };

  const copyAllGames = () => {
    const text = games
      .map((g) => `${g.label}: ${g.numbers.join(', ')}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    soundManager.playClick();
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Ticket Slip Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <h2 className="text-sm font-bold text-slate-800">로또 6/45 자동 5게임 슬립</h2>
        </div>
        <button
          onClick={copyAllGames}
          className="text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {copiedAll ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">전체 복사됨!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>5게임 전체 복사</span>
            </>
          )}
        </button>
      </div>

      {/* 5 Games Rows */}
      <div className="divide-y divide-slate-100">
        {games.map((game) => {
          const stats = calculateLottoStats(game.numbers);
          const saved = isSaved ? isSaved(game.id) : false;

          return (
            <div
              key={game.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
            >
              {/* Game Label & Stats */}
              <div className="flex items-center gap-3">
                <span className="w-14 text-xs font-black text-slate-800 tracking-tight shrink-0 font-mono">
                  {game.label}
                </span>

                {/* 6 Lotto Balls */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  {game.numbers.map((num) => (
                    <LottoBall key={num} number={num} size="md" />
                  ))}
                </div>
              </div>

              {/* Auxiliary Info & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 pt-2 sm:pt-0 border-t border-slate-100 sm:border-0">
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span>합계 {stats.sum}</span>
                  <span>·</span>
                  <span>홀:짝 {stats.oddCount}:{stats.evenCount}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onRerollGame(game.id)}
                    title="이 게임 다시 뽑기"
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-md transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => copyGameNumbers(game)}
                    title="번호 복사"
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedId === game.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {onSaveGame && (
                    <button
                      onClick={() => onSaveGame(game)}
                      title="보관함에 저장"
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-md transition-colors cursor-pointer"
                    >
                      {saved ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
