import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LoginHeader() {
  return (
    <div className="w-full max-w-md flex flex-col items-center pt-2 relative z-10">
      <div className="relative w-16 h-16 flex items-center justify-center mb-3">
        <div className="absolute inset-0 bg-[#DC2626]/20 rounded-full blur-xl transform scale-110" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DC2626] via-[#B91C1C] to-[#991B1B] flex items-center justify-center shadow-lg shadow-red-600/30 border border-white/20">
          <Sparkles className="w-7 h-7 text-white drop-shadow-md" />
        </div>
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white dark:border-zinc-900 shadow-sm animate-pulse" />
      </div>

      <Badge variant="primary" className="gap-1.5 px-3 py-0.5 mb-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span className="tracking-wider uppercase text-[10px]">Astar 20/10 Arena</span>
      </Badge>

      <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white text-center tracking-tight">
        Mini Game 20/10
      </h1>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-1 max-w-xs">
        Đoán ảnh 14 bạn nữ – Tranh suất tặng quà phái đẹp
      </p>
    </div>
  );
}
