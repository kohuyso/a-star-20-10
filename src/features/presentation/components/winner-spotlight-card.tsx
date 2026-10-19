import React from 'react';
import { Crown, CheckCircle2, XCircle, Clock, UserCheck, Inbox, Eye } from 'lucide-react';

export interface WinnerSpotlightCardProps {
  totalCorrectGuesses: number;
  totalGuesses: number;
  selectionReason?: 'FASTEST_CORRECT' | 'FASTEST_INCORRECT' | 'LUCKY_FALLBACK' | 'MANUAL' | 'NO_VOTES';
  assignedUserName?: string | null;
  answeredAt?: string | null;
  revealedWinner: boolean;
  onRevealWinner: () => void;
  onRevealAll: () => void;
}

export function WinnerSpotlightCard({
  totalCorrectGuesses,
  totalGuesses,
  selectionReason,
  assignedUserName,
  answeredAt,
  revealedWinner,
  onRevealWinner,
  onRevealAll,
}: WinnerSpotlightCardProps) {
  const correctPercent =
    totalGuesses > 0 ? Math.round((totalCorrectGuesses / totalGuesses) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-950/60 text-green-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-bold uppercase">Đoán Đúng</span>
            <p className="font-headline text-2xl font-black text-green-400">
              {totalCorrectGuesses}{' '}
              <span className="text-xs text-zinc-400 font-normal">
                ({totalGuesses > 0 ? `${correctPercent}%` : '0%'})
              </span>
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/60 text-red-400 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-bold uppercase">Đoán Sai</span>
            <p className="font-headline text-2xl font-black text-red-400">
              {totalGuesses - totalCorrectGuesses}
            </p>
          </div>
        </div>
      </div>

      {/* Winner Showcase Spotlight Card */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-red-600/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="font-headline text-xs font-extrabold text-amber-400 tracking-wider uppercase">
              QUYỀN TRAO QUÀ (THUẬT TOÁN D4)
            </span>
          </div>
          {revealedWinner && selectionReason && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
              {selectionReason === 'FASTEST_CORRECT' && '⚡ ĐOÁN ĐÚNG NHANH NHẤT'}
              {selectionReason === 'FASTEST_INCORRECT' && '🔥 NHANH NHẤT & DŨNG CẢM'}
              {selectionReason === 'LUCKY_FALLBACK' && '🎲 CHỌN MAY MẮN (CHƯA TẶNG)'}
              {selectionReason === 'MANUAL' && '👑 MC CHỈ ĐỊNH'}
              {selectionReason === 'NO_VOTES' && 'CHƯA CÓ LƯỢT ĐOÁN'}
            </span>
          )}
        </div>

        {/* Unrevealed vs Revealed State */}
        <div className="py-4 flex flex-col items-center justify-center min-h-[120px]">
          {!revealedWinner ? (
            <div className="flex flex-col items-center gap-2.5">
              <p className="text-xs text-zinc-400 text-center">
                Chàng trai nào may mắn nhận đặc quyền trao quà cho bạn nữ này?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRevealWinner}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white font-headline text-xs sm:text-sm font-extrabold shadow-lg shadow-red-600/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>LẬT MỞ NGƯỜI TRAO QUÀ</span>
                </button>
                <button
                  type="button"
                  onClick={onRevealAll}
                  className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all cursor-pointer"
                  title="Mở tất cả"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : assignedUserName ? (
            <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center font-black text-xl mb-1.5 shadow-lg shadow-amber-500/30">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl font-black text-white">
                {assignedUserName}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                {answeredAt
                  ? `Thời gian nộp: ${new Date(answeredAt).toLocaleTimeString('vi-VN')}`
                  : selectionReason === 'LUCKY_FALLBACK'
                  ? 'Đặc cách may mắn (Chưa trao quà lần nào)'
                  : 'Chỉ định từ ban tổ chức'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center text-zinc-400 py-2 animate-in zoom-in-95 duration-200">
              <Inbox className="w-8 h-8 text-zinc-600 mb-1" />
              <p className="text-xs font-semibold text-amber-400/90">
                {totalGuesses === 0 ? 'Chưa có ai gửi câu trả lời cho câu này' : 'Tất cả bạn nam đã nhận trao quà'}
              </p>
              <p className="text-[11px] text-zinc-500">MC có thể chỉ định người trao quà tiếp theo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
