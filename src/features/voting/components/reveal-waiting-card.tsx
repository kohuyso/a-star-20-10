import React from 'react';
import { Trophy, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface RevealWaitingCardProps {
  playerName: string;
  onLogout: () => void;
}

export function RevealWaitingCard({ playerName, onLogout }: RevealWaitingCardProps) {
  return (
    <div className="min-h-screen bg-[#0F1218] text-[#F8FAFC] flex flex-col justify-between items-center px-4 py-8 max-w-md mx-auto font-body">
      <div className="w-full flex items-center justify-between pb-4 border-b border-[#27303F]">
        <p className="text-xs font-bold text-white">{playerName}</p>
        <button
          type="button"
          onClick={onLogout}
          className="p-2 text-zinc-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <Card className="my-auto w-full flex flex-col items-center text-center py-8 px-6 rounded-3xl shadow-2xl border border-[#27303F]">
        <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 animate-bounce">
          <Trophy className="w-9 h-9" />
        </div>
        <h2 className="font-headline text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">
          Đang Công Bố Kết Quả!
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          MC đang tiến hành lật mở từng bạn nữ và xướng tên các chàng trai trao quà trên màn hình lớn. Hãy cùng theo dõi nhé!
        </p>
      </Card>

      <p className="text-xs text-zinc-400 text-center">Astar 20/10 • Chúc bạn may mắn trúng giải!</p>
    </div>
  );
}
