import React from 'react';
import { Home, Sparkles, Flame, Lock, Eye, EyeOff, Maximize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface SlideHeaderProps {
  currentQuestionNumber: number;
  totalQuestions: number;
  isVoting: boolean;
  timeLeft: number;
  showHint: boolean;
  onToggleHint: () => void;
  onToggleFullScreen: () => void;
}

export function SlideHeader({
  currentQuestionNumber,
  totalQuestions,
  isVoting,
  timeLeft,
  showHint,
  onToggleHint,
  onToggleFullScreen,
}: SlideHeaderProps) {
  return (
    <header className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-zinc-800/80">
      <div className="flex items-center gap-3">
        <a
          href="/admin"
          className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors"
          title="Về trang Admin"
        >
          <Home className="w-4 h-4" />
        </a>
        <Badge variant="primary" className="gap-2 px-3 py-1 bg-red-950/80 border-red-800/60 text-red-400">
          <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
          <span>ASTAR 20/10 ARENA • MÁY CHIẾU</span>
        </Badge>
      </div>

      {/* Center Live Countdown Indicator */}
      <div className="flex items-center gap-3">
        {isVoting ? (
          <div className="flex items-center gap-2.5 px-6 py-2 rounded-2xl bg-gradient-to-r from-red-950/80 to-amber-950/80 border-2 border-red-500/60 shadow-lg shadow-red-600/30 animate-pulse">
            <Flame className="w-5 h-5 text-amber-400" />
            <span className="text-xs text-zinc-300 font-bold uppercase">Thời Gian Đoán:</span>
            <span className="font-headline text-3xl font-extrabold text-[#F59E0B] w-14 text-center">
              {timeLeft}s
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 text-xs font-bold">
            <Lock className="w-4 h-4 text-zinc-500" />
            <span>CHỜ ADMIN BẮT ĐẦU ĐẾM NGƯỢC</span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleHint}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            showHint
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
          }`}
          title="Bật/Tắt Gợi ý (Phím H)"
        >
          {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>Gợi ý</span>
        </button>

        <button
          type="button"
          onClick={onToggleFullScreen}
          className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="Toàn màn hình (F)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Current Question Number */}
      <div className="font-headline text-lg font-extrabold text-white flex items-center gap-1">
        <span className="text-zinc-400 text-sm">CÂU</span>
        <span className="text-[#DC2626] text-3xl font-black">#{currentQuestionNumber}</span>
        <span className="text-zinc-500 font-normal text-sm"> / {totalQuestions}</span>
      </div>
    </header>
  );
}
