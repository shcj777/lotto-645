import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { LottoBall } from './LottoBall';
import { SAMPLE_WINNING_DRAWS, evaluateMatches, LottoGame } from '../utils/lotto';
import { soundManager } from '../utils/audio';

interface SimulationModalProps {
  currentDraw: { numbers: number[]; bonus: number } | null;
  fiveGames: LottoGame[];
  onClose: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  currentDraw,
  fiveGames,
  onClose,
}) => {
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
  const winningDraw = SAMPLE_WINNING_DRAWS[selectedRoundIndex];

  // Evaluate single draw if available
  const singleResult = currentDraw
    ? evaluateMatches(currentDraw.numbers, winningDraw.numbers, winningDraw.bonus)
    : null;

  // Evaluate 5 games
  const fiveGamesResults = fiveGames.map((game) => ({
    game,
    result: evaluateMatches(game.numbers, winningDraw.numbers, winningDraw.bonus),
  }));

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              당첨 모의 시뮬레이션
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Round Selector */}
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">대조할 회차 선택</span>
            <div className="flex items-center gap-1">
              {SAMPLE_WINNING_DRAWS.map((draw, idx) => (
                <button
                  key={draw.round}
                  onClick={() => {
                    setSelectedRoundIndex(idx);
                    soundManager.playClick();
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedRoundIndex === idx
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {draw.round}회
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>추첨일: {winningDraw.date}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{winningDraw.round}회 공식 당첨번호</span>
          </div>

          {/* Official Winning Balls */}
          <div className="flex items-center gap-2 flex-wrap justify-center py-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            {winningDraw.numbers.map((n) => (
              <LottoBall key={n} number={n} size="md" />
            ))}
            <span className="text-lg font-bold text-slate-400 px-1">+</span>
            <LottoBall number={winningDraw.bonus} size="md" isBonus />
          </div>
        </div>

        {/* Results scroll area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
            내 번호 매칭 결과
          </h4>

          {/* 5 Games results */}
          {fiveGamesResults.map(({ game, result }) => {
            const isWinner = result.rank > 0;
            const rankBadge = {
              1: 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700',
              2: 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
              3: 'bg-sky-100 dark:bg-sky-950/70 text-sky-900 dark:text-sky-300 border-sky-300 dark:border-sky-700',
              4: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
              5: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
              0: 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800',
            }[result.rank];

            return (
              <div
                key={game.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {game.label}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${rankBadge}`}
                    >
                      {result.prizeName}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                    일치: {result.matchCount}개 {result.hasBonus ? '+ 보너스' : ''}
                  </span>
                </div>

                {/* Number balls with matching highlight */}
                <div className="flex items-center gap-2 flex-wrap">
                  {game.numbers.map((num) => {
                    const isMatched = result.matchedNumbers.includes(num);
                    return (
                      <LottoBall
                        key={num}
                        number={num}
                        size="sm"
                        highlight={isMatched}
                        dimmed={!isMatched}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
