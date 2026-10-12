import React from 'react';
import { Home, Trophy, Layers, TableProperties, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface ResultsHeaderProps {
  viewMode: 'SLIDE' | 'SUMMARY';
  onChangeViewMode: (mode: 'SLIDE' | 'SUMMARY') => void;
  sortBy: 'QUESTION_NUMBER' | 'DIFFICULTY';
  onToggleSortBy: () => void;
  currentQuestionNumber: number;
  currentRoundIndex: number;
  totalRounds: number;
  onTriggerConfetti: () => void;
}

export function ResultsHeader({
  viewMode,
  onChangeViewMode,
  sortBy,
  onToggleSortBy,
  currentQuestionNumber,
  currentRoundIndex,
  totalRounds,
  onTriggerConfetti,
}: ResultsHeaderProps) {
  return (
    <header className="relative z-10 px-6 sm:px-8 py-3.5 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <a
          href="/admin"
          className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors"
          title="Về bảng Admin"
        >
          <Home className="w-4 h-4" />
        </a>
        <Badge variant="primary" className="gap-2 px-3 py-1 bg-red-950/80 border-red-800/60 text-red-400">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>LỄ CÔNG BỐ & TRAO QUÀ 20/10</span>
        </Badge>
      </div>

      {/* View Mode & Sort Controls */}
      <div className="flex items-center gap-2.5">
        {/* Toggle View Mode: Slide vs Summary Table */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => onChangeViewMode('SLIDE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'SLIDE'
                ? 'bg-[#DC2626] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Từng Câu (MC)</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('SUMMARY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'SUMMARY'
                ? 'bg-[#DC2626] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>Bảng Tổng Sắp</span>
          </button>
        </div>

        {/* Sort By Toggle Button */}
        {viewMode === 'SLIDE' && (
          <button
            type="button"
            onClick={onToggleSortBy}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold border border-zinc-700 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>{sortBy === 'QUESTION_NUMBER' ? 'Thứ Tự Câu 1 → 14' : 'Độ Khó (D4)'}</span>
          </button>
        )}

        {/* Current Index Badge */}
        {viewMode === 'SLIDE' && (
          <div className="flex items-center gap-1.5 font-headline bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-xl">
            <span className="text-[11px] text-zinc-400 uppercase font-bold">ẢNH:</span>
            <span className="text-lg font-black text-[#DC2626]">
              #{currentQuestionNumber}
            </span>
            <span className="text-zinc-500 text-xs">({currentRoundIndex + 1}/{totalRounds})</span>
          </div>
        )}

        {/* Confetti Trigger */}
        <button
          type="button"
          onClick={onTriggerConfetti}
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 transition-colors cursor-pointer"
          title="Bắn pháo hoa"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
