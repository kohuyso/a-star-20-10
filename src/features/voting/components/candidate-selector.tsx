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
      <label className="font-headline text-xs font-bold text-primary dark:text-primary-light flex items-center justify-between px-1">
        <span>CHỌN TÊN BẠN NỮ (CÒN {candidates.length} TÊN)</span>
        <span className="text-[10px] text-primary-subtle dark:text-primary-subtle font-normal">Chỉ được chọn 1 lần</span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
        {candidates.map((name) => {
          const isSelected = selectedName === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectCandidate(name)}
              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-md ring-2 ring-primary'
                  : 'bg-white dark:bg-[#161B26] border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  isSelected ? 'text-primary dark:text-primary-light font-bold' : ''
                }`}
              >
                {name}
              </span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-border-card dark:border-border-card-dark'
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
