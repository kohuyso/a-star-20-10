import React from 'react';
import { UserCheck } from 'lucide-react';

export interface PlayerOption {
  username: string;
  fullName: string;
  dob: string;
}

export interface PlayerQuickSelectProps {
  playerOptions: PlayerOption[];
  selectedUsername: string;
  onSelectPlayer: (player: PlayerOption) => void;
}

export function PlayerQuickSelect({
  playerOptions,
  selectedUsername,
  onSelectPlayer,
}: PlayerQuickSelectProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <span className="font-headline text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
        <span>CHẠM TÊN CỦA BẠN ĐỂ ĐĂNG NHẬP NHANH:</span>
        <UserCheck className="w-3.5 h-3.5 text-green-500" />
      </span>
      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
        {playerOptions.map((p) => {
          const isSelected = selectedUsername === p.username;
          return (
            <button
              key={p.username}
              type="button"
              onClick={() => onSelectPlayer(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#DC2626] text-white shadow-md scale-105 ring-2 ring-red-400'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {p.fullName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
