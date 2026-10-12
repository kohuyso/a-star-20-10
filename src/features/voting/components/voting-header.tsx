import React from 'react';
import { Flame, CheckCircle2, Lock, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface VotingHeaderProps {
  currentQuestionNumber: number;
  totalQuestions: number;
  playerName: string;
  isQuestionVoting: boolean;
  timeLeft: number;
  hasAnsweredCurrent: boolean;
  timerDurationSec?: number;
  onLogout: () => void;
}

export function VotingHeader({
  currentQuestionNumber,
  totalQuestions,
  playerName,
  isQuestionVoting,
  timeLeft,
  hasAnsweredCurrent,
  timerDurationSec = 20,
  onLogout,
}: VotingHeaderProps) {
  return (
    <div className="flex flex-col gap-2.5 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="px-3 py-1 text-xs shadow-md shadow-red-600/30">
            CÂU {currentQuestionNumber} / {totalQuestions}
          </Badge>
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[130px]">
            {playerName}
          </span>
        </div>

        {/* Live Countdown Timer Badge */}
        <div className="flex items-center gap-2">
          {isQuestionVoting ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-[#DC2626] dark:text-red-400 font-headline font-black text-xs animate-pulse">
              <Flame className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          ) : hasAnsweredCurrent ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã nộp</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-bold text-[11px]">
              <Lock className="w-3.5 h-3.5" />
              <span>Chờ bắt đầu</span>
            </div>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Animated Timer Progress Bar */}
      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#DC2626] to-amber-500 h-full transition-all duration-300 rounded-full"
          style={{
            width: isQuestionVoting
              ? `${(timeLeft / timerDurationSec) * 100}%`
              : hasAnsweredCurrent
              ? '100%'
              : '0%',
          }}
        />
      </div>
    </div>
  );
}
