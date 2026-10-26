import React from 'react';
import { getBallColorInfo } from '../utils/lotto';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isBonus?: boolean;
  highlight?: boolean;
  dimmed?: boolean;
}

export const LottoBall: React.FC<LottoBallProps> = ({
  number,
  size = 'md',
  isBonus = false,
  highlight = false,
  dimmed = false,
}) => {
  const colorInfo = getBallColorInfo(number);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-extrabold',
    lg: 'w-13 h-13 text-base sm:text-lg font-black',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl font-black',
  }[size];

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      <div
        className={`
          ${sizeClasses}
          ${colorInfo.bg}
          ${colorInfo.text}
          rounded-full flex items-center justify-center
          shadow-md ${colorInfo.glow}
          border border-white/40
          relative overflow-hidden
          transition-all duration-300 ease-out
          ${highlight ? 'ring-4 ring-amber-400 ring-offset-2 scale-110 z-10' : ''}
          ${dimmed ? 'opacity-35 grayscale' : ''}
        `}
      >
        {/* Realistic top glossy sphere highlight */}
        <div className="absolute top-1 left-2 w-3/5 h-2/5 rounded-full bg-white/40 blur-[0.5px] pointer-events-none" />
        
        {/* Subtle bottom shadow highlight */}
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-black/15 rounded-full pointer-events-none" />

        <span className="relative z-10 font-mono tracking-tighter drop-shadow-xs">
          {number}
        </span>
      </div>

      {isBonus && (
        <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">
          보너스
        </span>
      )}
    </div>
  );
};
