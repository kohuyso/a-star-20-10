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
    <div className="w-full flex flex-col gap-2 shrink-0">
      <label className="w-full font-headline text-xs font-bold text-red-600 dark:text-red-400 flex items-center justify-between px-1">
        <span>CHỌN TÊN BẠN NỮ (CÒN {candidates.length} TÊN)</span>
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">Chỉ được chọn 1 lần</span>
      </label>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
        {candidates.map((name) => {
          const isSelected = selectedName === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectCandidate(name)}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer ${
                isSelected
                  ? 'bg-[#DC2626] border-[#DC2626] shadow-lg shadow-red-900/40 ring-2 ring-red-400 text-white'
                  : 'bg-white dark:bg-[#161B26] border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <span
                className={`text-sm ${
                  isSelected
                    ? 'text-white font-bold'
                    : 'text-slate-800 dark:text-zinc-200 font-semibold'
                }`}
              >
                {name}
              </span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-white bg-white'
                    : 'border-slate-300 dark:border-zinc-700 bg-transparent'
                }`}
              >
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
