import React from 'react';
import {
  Flame,
  Lock,
  Presentation,
  ExternalLink,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface LiveBroadcasterCardProps {
  currentQuestionNumber: number;
  isVoting: boolean;
  timeLeft: number;
  actionLoading: boolean;
  selectedDuration: number;
  onChangeDuration: (sec: number) => void;
  onChangeQuestion: (q: number) => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onStartTimer: () => void;
  onLockQuestion: () => void;
  onFinishToReveal: () => void;
  onResetGame: () => void;
}

export function LiveBroadcasterCard({
  currentQuestionNumber,
  isVoting,
  timeLeft,
  actionLoading,
  selectedDuration,
  onChangeDuration,
  onChangeQuestion,
  onPrevQuestion,
  onNextQuestion,
  onStartTimer,
  onLockQuestion,
  onFinishToReveal,
  onResetGame,
}: LiveBroadcasterCardProps) {
  return (
    <Card className="rounded-3xl p-6 shadow-xl border border-[#27303F]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27303F]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Màn Hình Chiếu Hiện Tại
          </span>
          <h2 className="font-headline text-2xl font-extrabold text-white flex items-center gap-2 mt-0.5">
            <span>ẢNH SỐ {currentQuestionNumber} / 14</span>
            {isVoting ? (
              <span className="px-3 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800 text-xs font-bold animate-pulse flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                ĐANG MỞ BÌNH CHỌN ({timeLeft}s)
              </span>
            ) : (
              <span className="px-3 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                ĐÃ KHÓA ĐÁP ÁN
              </span>
            )}
          </h2>
        </div>

        {/* Presentation View Links */}
        <div className="flex items-center gap-2">
          <a
            href="/slideshow"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 text-xs font-bold transition-all shadow-xs"
          >
            <Presentation className="w-4 h-4 text-amber-300" />
            <span>Mở Màn Máy Chiếu Slide</span>
            <ExternalLink className="w-3 h-3 ml-0.5 text-amber-400" />
          </a>
          <a
            href="/results"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-700/60 text-red-300 text-xs font-bold transition-all shadow-xs"
          >
            <Award className="w-4 h-4 text-red-400" />
            <span>Màn Công Bố MC (D4)</span>
            <ExternalLink className="w-3 h-3 ml-0.5 text-red-400" />
          </a>
        </div>
      </div>

      {/* 14 Question Select Buttons */}
      <div className="flex flex-col gap-2 py-4">
        <span className="text-xs font-bold text-zinc-400 uppercase">
          CHỌN CÂU HỎI ĐỂ CHIẾU:
        </span>
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
          {Array.from({ length: 14 }).map((_, idx) => {
            const q = idx + 1;
            const isSelected = q === currentQuestionNumber;
            return (
              <button
                key={q}
                type="button"
                disabled={actionLoading}
                onClick={() => onChangeQuestion(q)}
                className={`h-11 rounded-2xl font-headline font-extrabold text-sm flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#DC2626] to-[#991B1B] text-white shadow-lg shadow-red-600/40 scale-105 ring-2 ring-red-400'
                    : 'bg-[#1F2633] text-zinc-300 hover:bg-[#27303F] border border-[#27303F]'
                }`}
              >
                <span>{q}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timer & Action Bar */}
      <div className="bg-[#111622] rounded-2xl p-4 border border-[#27303F] flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        {/* Timer setting selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            Thời gian đoán:
          </span>
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-700">
            {[15, 20, 30, 45].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => onChangeDuration(sec)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedDuration === sec
                    ? 'bg-[#DC2626] text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Master Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={actionLoading}
            onClick={onPrevQuestion}
            className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Câu Trước</span>
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={onStartTimer}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:brightness-110 text-white text-xs font-extrabold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>BẮT ĐẦU ĐẾM NGƯỢC CÂU {currentQuestionNumber} ({selectedDuration}s)</span>
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={onLockQuestion}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Khóa Đáp Án</span>
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={onNextQuestion}
            className="px-3.5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>Câu Sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Finish & Reset Buttons */}
      <div className="pt-4 flex items-center justify-between border-t border-[#27303F] mt-4">
        <button
          type="button"
          onClick={onFinishToReveal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-headline text-xs font-extrabold shadow-md transition-all cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>KẾT THÚC VÀ CHUYỂN SANG CÔNG BỐ KẾT QUẢ (/results)</span>
        </button>

        <button
          type="button"
          disabled={actionLoading}
          onClick={onResetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-400 hover:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset dữ liệu chơi thử</span>
        </button>
      </div>
    </Card>
  );
}
