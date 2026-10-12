import React from 'react';

export interface CandidateSelectorProps {
  candidates: string[];
  selectedName: string;
  onSelectCandidate: (name: string) => void;
}

export function CandidateSelector({
  candidates,
  selectedName,
  onSelectCandidate,
}: CandidateSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-headline text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center justify-between px-1">
        <span>CHỌN TÊN BẠN NỮ (CÒN {candidates.length} TÊN)</span>
        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal">Chỉ được chọn 1 lần</span>
      </label>

      <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
        {candidates.map((name) => {
          const isSelected = selectedName === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectCandidate(name)}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-50 dark:bg-red-950/60 border-[#DC2626] text-red-900 dark:text-red-200 shadow-sm ring-1 ring-[#DC2626]'
                  : 'bg-white dark:bg-[#161B26] border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  isSelected ? 'text-[#DC2626] dark:text-red-300 font-bold' : ''
                }`}
              >
                {name}
              </span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected
                    ? 'border-[#DC2626] bg-[#DC2626] text-white'
                    : 'border-slate-300 dark:border-zinc-700'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
