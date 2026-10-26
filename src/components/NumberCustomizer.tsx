import React, { useState } from 'react';
import { Sparkles, Filter, RotateCcw } from 'lucide-react';
import { GenerationOptions, GenerationMode, getBallColorInfo } from '../utils/lotto';
import { soundManager } from '../utils/audio';

interface NumberCustomizerProps {
  options: GenerationOptions;
  onChangeOptions: (updated: GenerationOptions) => void;
}

export const NumberCustomizer: React.FC<NumberCustomizerProps> = ({
  options,
  onChangeOptions,
}) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'include' | 'exclude'>('strategy');

  const toggleInclude = (num: number) => {
    soundManager.playClick();
    const current = new Set(options.includeNumbers);
    if (current.has(num)) {
      current.delete(num);
    } else {
      if (current.size >= 5) {
        alert('고정수는 최대 5개까지만 선택할 수 있습니다.');
        return;
      }
      const newExclude = options.excludeNumbers.filter((n) => n !== num);
      current.add(num);
      onChangeOptions({
        ...options,
        includeNumbers: Array.from(current).sort((a, b) => a - b),
        excludeNumbers: newExclude,
      });
      return;
    }
    onChangeOptions({
      ...options,
      includeNumbers: Array.from(current).sort((a, b) => a - b),
    });
  };

  const toggleExclude = (num: number) => {
    soundManager.playClick();
    const current = new Set(options.excludeNumbers);
    if (current.has(num)) {
      current.delete(num);
    } else {
      if (current.size >= 39) {
        alert('최소 6개의 번호는 남아있어야 합니다.');
        return;
      }
      const newInclude = options.includeNumbers.filter((n) => n !== num);
      current.add(num);
      onChangeOptions({
        ...options,
        excludeNumbers: Array.from(current).sort((a, b) => a - b),
        includeNumbers: newInclude,
      });
      return;
    }
    onChangeOptions({
      ...options,
      excludeNumbers: Array.from(current).sort((a, b) => a - b),
    });
  };

  const resetFilters = () => {
    soundManager.playReset();
    onChangeOptions({
      ...options,
      includeNumbers: [],
      excludeNumbers: [],
    });
  };

  const setMode = (mode: GenerationMode) => {
    soundManager.playClick();
    onChangeOptions({ ...options, mode });
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 flex flex-col transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            맞춤 추첨 전략 & 필터 설정
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            고정수(반드시 포함)와 제외수를 설정하고 번호 추출 알고리즘을 선택하세요.
          </p>
        </div>

        {(options.includeNumbers.length > 0 || options.excludeNumbers.length > 0) && (
          <button
            onClick={resetFilters}
            className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1 self-start sm:self-auto cursor-pointer border border-rose-200 dark:border-rose-900"
          >
            <RotateCcw className="w-3 h-3" />
            <span>필터 초기화</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-5">
        <button
          onClick={() => setActiveTab('strategy')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'strategy'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          추첨 알고리즘 ({options.mode === 'balanced' ? '황금 밸런스' : '순수 무작위'})
        </button>

        <button
          onClick={() => setActiveTab('include')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'include'
              ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>고정수</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 rounded-full font-bold">
            {options.includeNumbers.length}/5
          </span>
        </button>

        <button
          onClick={() => setActiveTab('exclude')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'exclude'
              ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span>제외수</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 rounded-full font-bold">
            {options.excludeNumbers.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Strategy Mode */}
      {activeTab === 'strategy' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setMode('balanced')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              options.mode === 'balanced'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                황금 밸런스 필터 (추천)
              </span>
              {options.mode === 'balanced' && (
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">선택됨</span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              역대 1등 당첨 통계 기준, 가장 자주 출현하는 총합 구간(100~180)과 홀짝 비율(2:4~4:2)을 만족하는 번호만 추출합니다.
            </p>
          </div>

          <div
            onClick={() => setMode('random')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              options.mode === 'random'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                순수 무작위 추출
              </span>
              {options.mode === 'random' && (
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">선택됨</span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              수학적 100% 완전 무작위 균등 난수를 통해 모든 숫자가 동등한 확률로 추출됩니다.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Fixed Numbers (고정수) 1-45 Grid */}
      {activeTab === 'include' && (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-3">
            <span>추첨 시 무조건 포함할 번호를 클릭하세요 (최대 5개)</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {options.includeNumbers.length}개 선택됨
            </span>
          </div>
          <div className="grid grid-cols-9 sm:grid-cols-15 gap-1.5">
            {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
              const isIncluded = options.includeNumbers.includes(num);
              const isExcluded = options.excludeNumbers.includes(num);

              return (
                <button
                  key={num}
                  onClick={() => toggleInclude(num)}
                  className={`h-9 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${
                    isIncluded
                      ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-400 scale-105'
                      : isExcluded
                      ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-800 line-through'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Excluded Numbers (제외수) 1-45 Grid */}
      {activeTab === 'exclude' && (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-3">
            <span>추첨에서 제외할 비선호 번호를 클릭하세요</span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
              {options.excludeNumbers.length}개 제외됨
            </span>
          </div>
          <div className="grid grid-cols-9 sm:grid-cols-15 gap-1.5">
            {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
              const isIncluded = options.includeNumbers.includes(num);
              const isExcluded = options.excludeNumbers.includes(num);

              return (
                <button
                  key={num}
                  onClick={() => toggleExclude(num)}
                  className={`h-9 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${
                    isExcluded
                      ? 'bg-rose-500 text-white border-rose-600 scale-105'
                      : isIncluded
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-400 border-indigo-200 dark:border-indigo-900'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
