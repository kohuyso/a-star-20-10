import React from 'react';
import { Hourglass, Sparkles, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface LobbyWaitingCardProps {
  playerName: string;
  username: string;
  onLogout: () => void;
}

export function LobbyWaitingCard({ playerName, username, onLogout }: LobbyWaitingCardProps) {
  return (
    <div className="w-full min-h-screen bg-[#0F1218] text-[#F8FAFC] flex flex-col justify-between items-center px-2.5 sm:px-4 py-6 sm:py-8 max-w-md mx-auto font-body">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-[#27303F]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-950/60 text-[#DC2626] flex items-center justify-center font-bold text-xs border border-red-800/60">
            {playerName[0] || 'U'}
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">
              {playerName}
            </p>
            <p className="text-[10px] text-zinc-400">@{username}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="p-2 text-zinc-400 hover:text-red-400 rounded-xl transition-colors cursor-pointer"
          title="Đăng xuất"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Waiting Card */}
      <Card className="my-auto w-full flex flex-col items-center text-center py-7 px-4 sm:px-6 rounded-3xl shadow-2xl border border-[#27303F]">
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg text-white">
            <Hourglass className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 mb-3 text-xs font-bold">
          <span>Đang Chờ Khởi Động Vòng Chơi</span>
        </div>

        <h2 className="font-headline text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">
          Chào Mừng {playerName}!
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
          Admin sẽ chiếu từng ảnh trên màn hình lớn và mở thời gian đoán. Hãy hướng về máy chiếu và sẵn sàng phản xạ nhanh!
        </p>

        <div className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-left flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200">
            <Sparkles className="w-4 h-4 text-[#DC2626]" />
            <span>Quy tắc quan trọng:</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
            • Tên bạn nữ đã chọn ở câu trước sẽ <strong>bị loại trừ</strong> khỏi các câu sau.
            <br />• Người đoán <strong>đúng và nhanh nhất</strong> sẽ được trao quyền tặng quà!
          </p>
        </div>
      </Card>

      <p className="text-xs text-zinc-400 text-center">Astar 20/10 • Màn hình sẽ tự động cập nhật khi bắt đầu</p>
    </div>
  );
}
