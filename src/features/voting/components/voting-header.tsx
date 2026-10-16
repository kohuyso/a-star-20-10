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
    <div className="w-full flex flex-col gap-2 pb-2 shrink-0">
      <div className="flex items-center justify-between">
        {/* Nhãn câu hỏi độc lập */}
        <div className="flex items-center">
          <Badge variant="primary" className="px-3 py-1 text-xs font-headline font-black shadow-md shadow-red-600/30">
            CÂU {currentQuestionNumber} / {totalQuestions}
          </Badge>
        </div>

        {/* Trạng thái đếm ngược & Thông tin người chơi đăng nhập */}
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

          {/* Badge nhận diện người chơi (Tránh nhầm với đáp án câu hỏi) */}
          <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 rounded-full bg-zinc-800/90 border border-zinc-700 text-zinc-300 max-w-[120px] shadow-sm" title={`Tài khoản đang đăng nhập: ${playerName}`}>
            <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
              {playerName[0] || 'U'}
            </div>
            <span className="truncate text-[11px] font-medium text-zinc-200">
              {playerName}
            </span>
          </div>

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
