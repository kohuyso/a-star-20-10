import React from 'react';
import { ShieldAlert, Wifi, LogOut } from 'lucide-react';

export interface AdminHeaderProps {
  onOpenQR: () => void;
  onLogout: () => void;
}

export function AdminHeader({ onOpenQR, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-[#161B26] border-b border-[#27303F] sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#DC2626] to-[#991B1B] text-white flex items-center justify-center shadow-md shadow-red-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-base font-extrabold tracking-tight text-white">
                Quản Trị Chiếu Slide & Bình Chọn Astar 20/10
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-400 text-[10px] font-bold border border-red-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-ping" />
                LIVE CONTROL
              </span>
            </div>
            <p className="text-xs text-zinc-400">Máy chủ SQLite • Đồng bộ thời gian thực</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQR}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer border border-zinc-700"
          >
            <Wifi className="w-3.5 h-3.5 text-green-400" />
            <span>QR Wi-Fi LAN</span>
          </button>
          <button
            onClick={onLogout}
            className="p-2 text-zinc-400 hover:text-red-400 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
