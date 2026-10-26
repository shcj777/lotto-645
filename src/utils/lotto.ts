/**
 * Korean Lotto 6/45 Utilities & Generation Rules
 */

export interface LottoGame {
  id: string;
  label: string; // 'A', 'B', 'C', 'D', 'E'
  numbers: number[]; // 6 sorted numbers
  bonus?: number;
  timestamp: string;
}

export interface LottoStats {
  sum: number;
  oddCount: number;
  evenCount: number;
  lowCount: number; // 1-22
  highCount: number; // 23-45
  consecutivePairs: number;
}

export type GenerationMode = 'random' | 'balanced' | 'lucky';

export interface GenerationOptions {
  mode: GenerationMode;
  includeNumbers: number[]; // 고정수 (최대 5개)
  excludeNumbers: number[]; // 제외수
}

/**
 * Get official Lotto 6/45 ball styling based on number range:
 * 1-10: Yellow
 * 11-20: Blue
 * 21-30: Red
 * 31-40: Gray
 * 41-45: Green
 */
export function getBallColorInfo(num: number): {
  bg: string;
  border: string;
  glow: string;
  text: string;
  colorName: string;
} {
  if (num <= 10) {
    return {
      bg: 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500',
      border: 'border-amber-300/80',
      glow: 'shadow-amber-500/30',
      text: 'text-amber-950 font-bold',
      colorName: '노랑 (1~10)',
    };
  }
  if (num <= 20) {
    return {
      bg: 'bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600',
      border: 'border-sky-300/80',
      glow: 'shadow-sky-500/30',
      text: 'text-white font-bold',
      colorName: '파랑 (11~20)',
    };
  }
  if (num <= 30) {
    return {
      bg: 'bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600',
      border: 'border-rose-300/80',
      glow: 'shadow-rose-500/30',
      text: 'text-white font-bold',
      colorName: '빨강 (21~30)',
    };
  }
  if (num <= 40) {
    return {
      bg: 'bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600',
      border: 'border-slate-300/80',
      glow: 'shadow-slate-500/30',
      text: 'text-white font-bold',
      colorName: '회색 (31~40)',
    };
  }
  return {
    bg: 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600',
    border: 'border-emerald-300/80',
    glow: 'shadow-emerald-500/30',
    text: 'text-white font-bold',
    colorName: '초록 (41~45)',
  };
}

/**
 * Generate a single set of 6 numbers (+ optional bonus)
 */
export function generateSingleLotto(options: GenerationOptions): { numbers: number[]; bonus: number } {
  const { mode, includeNumbers, excludeNumbers } = options;

  // Available pool from 1 to 45 minus excluded
  const excludedSet = new Set(excludeNumbers);
  const includedSet = new Set(includeNumbers);

  const pool = Array.from({ length: 45 }, (_, i) => i + 1).filter(
    (n) => !excludedSet.has(n) && !includedSet.has(n)
  );

  const needed = 6 - includeNumbers.length;
  let attempts = 0;
  const maxAttempts = mode === 'balanced' ? 300 : 1;

  while (attempts < maxAttempts) {
    attempts++;
    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen = [...includeNumbers, ...shuffled.slice(0, needed)].sort((a, b) => a - b);

    if (mode === 'balanced') {
      const stats = calculateLottoStats(chosen);
      // Historical winning criteria: Sum 100~175, Odd:Even 2:4, 3:3, or 4:2
      const isSumOk = stats.sum >= 100 && stats.sum <= 180;
      const isOddEvenOk = stats.oddCount >= 2 && stats.oddCount <= 4;
      const isConsecutiveOk = stats.consecutivePairs <= 2;

      if (isSumOk && isOddEvenOk && isConsecutiveOk) {
        // Draw bonus from remaining numbers
        const remainingForBonus = Array.from({ length: 45 }, (_, i) => i + 1).filter(
          (n) => !chosen.includes(n) && !excludedSet.has(n)
        );
        const bonus = remainingForBonus[Math.floor(Math.random() * remainingForBonus.length)] || 7;
        return { numbers: chosen, bonus };
      }
    } else {
      // Pure random or lucky
      const remainingForBonus = Array.from({ length: 45 }, (_, i) => i + 1).filter(
        (n) => !chosen.includes(n) && !excludedSet.has(n)
      );
      const bonus = remainingForBonus[Math.floor(Math.random() * remainingForBonus.length)] || 7;
      return { numbers: chosen, bonus };
    }
  }

  // Fallback if balanced filter loop ran out of attempts
  const shuffledFallback = [...pool].sort(() => Math.random() - 0.5);
  const chosenFallback = [...includeNumbers, ...shuffledFallback.slice(0, needed)].sort((a, b) => a - b);
  const remainingFallback = Array.from({ length: 45 }, (_, i) => i + 1).filter(
    (n) => !chosenFallback.includes(n)
  );
  const bonus = remainingFallback[Math.floor(Math.random() * remainingFallback.length)] || 7;
  return { numbers: chosenFallback, bonus };
}

/**
 * Generate 5 games (A, B, C, D, E)
 */
export function generateFiveGames(options: GenerationOptions): LottoGame[] {
  const labels = ['A', 'B', 'C', 'D', 'E'];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return labels.map((label) => {
    const { numbers, bonus } = generateSingleLotto(options);
    return {
      id: Math.random().toString(36).substring(2, 9),
      label: `게임 ${label}`,
      numbers,
      bonus,
      timestamp: now,
    };
  });
}

/**
 * Statistical analysis of a number set
 */
export function calculateLottoStats(numbers: number[]): LottoStats {
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  let oddCount = 0;
  let evenCount = 0;
  let lowCount = 0;
  let highCount = 0;
  let consecutivePairs = 0;

  numbers.forEach((num, idx) => {
    if (num % 2 === 0) evenCount++;
    else oddCount++;

    if (num <= 22) lowCount++;
    else highCount++;

    if (idx > 0 && num === numbers[idx - 1] + 1) {
      consecutivePairs++;
    }
  });

  return { sum, oddCount, evenCount, lowCount, highCount, consecutivePairs };
}

/**
 * Winning Rank Evaluation against a winning ticket
 */
export interface MatchResult {
  matchCount: number;
  hasBonus: boolean;
  rank: 1 | 2 | 3 | 4 | 5 | 0; // 0 = 낙첨
  prizeName: string;
  matchedNumbers: number[];
}

export function evaluateMatches(
  playerNumbers: number[],
  winningNumbers: number[],
  bonusNumber: number
): MatchResult {
  const winningSet = new Set(winningNumbers);
  const matchedNumbers = playerNumbers.filter((n) => winningSet.has(n));
  const matchCount = matchedNumbers.length;
  const hasBonus = playerNumbers.includes(bonusNumber);

  let rank: 1 | 2 | 3 | 4 | 5 | 0 = 0;
  let prizeName = '낙첨 (아쉽습니다)';

  if (matchCount === 6) {
    rank = 1;
    prizeName = '1등 당첨! (약 20억원)';
  } else if (matchCount === 5 && hasBonus) {
    rank = 2;
    prizeName = '2등 당첨! (약 5,000만원)';
  } else if (matchCount === 5) {
    rank = 3;
    prizeName = '3등 당첨! (약 150만원)';
  } else if (matchCount === 4) {
    rank = 4;
    prizeName = '4등 당첨! (고정 5만원)';
  } else if (matchCount === 3) {
    rank = 5;
    prizeName = '5등 당첨! (고정 5천원)';
  }

  return { matchCount, hasBonus, rank, prizeName, matchedNumbers };
}

/**
 * Sample historical winning number presets for simulation
 */
export const SAMPLE_WINNING_DRAWS = [
  { round: 1140, date: '2024-10-05', numbers: [7, 11, 12, 21, 26, 35], bonus: 20 },
  { round: 1139, date: '2024-09-28', numbers: [5, 12, 15, 30, 37, 40], bonus: 18 },
  { round: 1138, date: '2024-09-21', numbers: [14, 16, 19, 20, 29, 34], bonus: 40 },
  { round: 1137, date: '2024-09-14', numbers: [4, 9, 12, 15, 33, 45], bonus: 26 },
];
