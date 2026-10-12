import React from 'react';
import { Users, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface PlayerSummaryData {
  totalPlayers: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  totalQuestions: number;
}

export interface RosterMetricsGridProps {
  summary: PlayerSummaryData | null;
}

export function RosterMetricsGrid({ summary }: RosterMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {/* 1. Tổng Người Chơi */}
      <Card className="rounded-3xl p-5 border border-[#27303F] shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-200 flex items-center justify-center border border-zinc-700">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
            Tổng Người Chơi
          </span>
          <p className="font-headline text-3xl font-black text-white mt-0.5">
            {summary?.totalPlayers || 0}
          </p>
        </div>
      </Card>

      {/* 2. Đã Hoàn Thành */}
      <Card className="rounded-3xl p-5 border border-[#27303F] shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center border border-emerald-800/80">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
            Đã Hoàn Thành (14/14)
          </span>
          <p className="font-headline text-3xl font-black text-emerald-400 mt-0.5">
            {summary?.completedCount || 0}
          </p>
        </div>
      </Card>

      {/* 3. Đang Tham Gia */}
      <Card className="rounded-3xl p-5 border border-[#27303F] shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-950/60 text-amber-400 flex items-center justify-center border border-amber-800/80">
          <Clock className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
            Đang Tham Gia
          </span>
          <p className="font-headline text-3xl font-black text-amber-400 mt-0.5">
            {summary?.inProgressCount || 0}
          </p>
        </div>
      </Card>

      {/* 4. Chưa Tham Gia */}
      <Card className="rounded-3xl p-5 border border-[#27303F] shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-950/60 text-red-400 flex items-center justify-center border border-red-800/80">
          <RefreshCw className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
            Chưa Tham Gia
          </span>
          <p className="font-headline text-3xl font-black text-red-400 mt-0.5">
            {summary?.notStartedCount || 0}
          </p>
        </div>
      </Card>
    </div>
  );
}
