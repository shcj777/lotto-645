import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { LottoBall } from './LottoBall';
import { GenerationOptions, generateSingleLotto } from '../utils/lotto';
import { soundManager } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';

interface LiveDrawMachineProps {
  options: GenerationOptions;
  onDrawComplete: (numbers: number[], bonus: number) => void;
  savedDraw?: { numbers: number[]; bonus: number } | null;
}

export const LiveDrawMachine: React.FC<LiveDrawMachineProps> = ({
  options,
  onDrawComplete,
  savedDraw,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnBalls, setDrawnBalls] = useState<number[]>([]);
  const [bonusBall, setBonusBall] = useState<number | null>(null);
  const [rollingCandidate, setRollingCandidate] = useState<number>(7);
  const [showBonus, setShowBonus] = useState(false);
  const rollingIntervalRef = useRef<number | null>(null);

  // Initialize with initial or saved numbers if available
  useEffect(() => {
    if (savedDraw && drawnBalls.length === 0 && !isDrawing) {
      setDrawnBalls(savedDraw.numbers);
      setBonusBall(savedDraw.bonus);
      setShowBonus(true);
    }
  }, [savedDraw]);

  // Rapid rolling animation for tumbler
  useEffect(() => {
    if (isDrawing) {
      rollingIntervalRef.current = window.setInterval(() => {
        setRollingCandidate(Math.floor(Math.random() * 45) + 1);
        soundManager.playRollingTick();
      }, 70);
    } else {
      if (rollingIntervalRef.current) clearInterval(rollingIntervalRef.current);
    }
    return () => {
      if (rollingIntervalRef.current) clearInterval(rollingIntervalRef.current);
    };
  }, [isDrawing]);

  const startLiveDraw = () => {
    if (isDrawing) return;

    setIsDrawing(true);
    setDrawnBalls([]);
    setBonusBall(null);
    setShowBonus(false);

    // Pre-determine the drawn numbers based on current strategy & filters
    const result = generateSingleLotto(options);
    const targetNumbers = result.numbers;
    const targetBonus = result.bonus;

    let currentIndex = 0;

    const drawInterval = setInterval(() => {
      if (currentIndex < 6) {
        const nextNum = targetNumbers[currentIndex];
        setDrawnBalls((prev) => [...prev, nextNum]);
        soundManager.playBallPop(currentIndex);
        currentIndex++;
      } else if (currentIndex === 6) {
        // Reveal bonus ball
        setBonusBall(targetBonus);
        setShowBonus(true);
        soundManager.playBallPop(6);
        currentIndex++;
      } else {
        // Complete
        clearInterval(drawInterval);
        setIsDrawing(false);
        soundManager.playFanfare();
        fireConfetti();
        onDrawComplete(targetNumbers, targetBonus);
      }
    }, 600);
  };

  const instantDraw = () => {
    if (isDrawing) return;
    const result = generateSingleLotto(options);
    setDrawnBalls(result.numbers);
    setBonusBall(result.bonus);
    setShowBonus(true);
    soundManager.playFanfare();
    fireConfetti();
    onDrawComplete(result.numbers, result.bonus);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual Lottery Tumbler Chamber */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col items-center overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Live Draw Sphere Window */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-slate-700/80 bg-radial from-slate-800/80 to-slate-950/90 shadow-inner flex items-center justify-center mb-6 overflow-hidden">
          {/* Glass glare effect */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-md pointer-events-none" />

          {isDrawing ? (
            <div className="flex flex-col items-center animate-bounce">
              <LottoBall number={rollingCandidate} size="xl" />
              <span className="text-[11px] font-semibold text-amber-300 mt-2 animate-pulse">
                볼 추첨 중...
              </span>
            </div>
          ) : drawnBalls.length === 6 ? (
            <div className="flex flex-col items-center text-center">
              <Sparkles className="w-10 h-10 text-amber-400 mb-2 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">추첨 완료!</span>
              <span className="text-[11px] text-slate-400 mt-0.5">행운을 빕니다</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 mb-2 shadow-sm">
                <Play className="w-5 h-5 ml-0.5" />
              </div>
              <span className="text-xs font-medium text-slate-400">
                추첨 버튼을 눌러주세요
              </span>
            </div>
          )}
        </div>

        {/* Drawn Result Balls Rack */}
        <div className="w-full flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center min-h-[64px] items-center">
            {drawnBalls.length === 0 && !isDrawing ? (
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-xs font-bold text-slate-600"
                  >
                    {idx}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {drawnBalls.map((num, i) => (
                  <div
                    key={i}
                    className="transform transition-all duration-300 animate-in zoom-in-75"
                  >
                    <LottoBall number={num} size="lg" />
                  </div>
                ))}

                {/* Placeholders for remaining balls */}
                {Array.from({ length: Math.max(0, 6 - drawnBalls.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-slate-700/80 flex items-center justify-center text-xs font-semibold text-slate-600"
                  >
                    ?
                  </div>
                ))}

                {/* Bonus Ball separator */}
                {showBonus && bonusBall !== null && (
                  <div className="flex items-center gap-2 ml-1 sm:ml-2 animate-in fade-in">
                    <span className="text-xl font-bold text-slate-400">+</span>
                    <LottoBall number={bonusBall} size="lg" isBonus />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Control Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={startLiveDraw}
            disabled={isDrawing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-base shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isDrawing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>추첨 진행 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>생생 추첨 시작</span>
              </>
            )}
          </button>

          <button
            onClick={instantDraw}
            disabled={isDrawing}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-sm font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>즉시 뽑기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
