import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ResultsStepperFooterProps {
  currentRoundIndex: number;
  totalRounds: number;
  questionNumbers: number[];
  onPrevRound: () => void;
  onNextRound: () => void;
  onSelectRound: (index: number) => void;
}

export function ResultsStepperFooter({
  currentRoundIndex,
  totalRounds,
  questionNumbers,
  onPrevRound,
  onNextRound,
  onSelectRound,
}: ResultsStepperFooterProps) {
  return (
    <footer className="relative z-10 px-6 sm:px-8 pt-2.5 flex items-center justify-between max-w-6xl mx-auto w-full border-t border-zinc-800/60">
      <button
        type="button"
        disabled={currentRoundIndex === 0}
        onClick={onPrevRound}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-30"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Câu Trước</span>
      </button>

      {/* 14 Question Quick Selector Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {questionNumbers.map((num, idx) => (
          <button
            key={num}
            type="button"
            onClick={() => onSelectRound(idx)}
            className={`w-8 h-8 rounded-xl font-headline font-extrabold text-xs flex items-center justify-center transition-all cursor-pointer ${
              idx === currentRoundIndex
                ? 'bg-[#DC2626] text-white scale-110 shadow-md shadow-red-600/50 ring-2 ring-red-400'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={currentRoundIndex === totalRounds - 1}
        onClick={onNextRound}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-30"
      >
        <span>Câu Sau</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </footer>
  );
}
