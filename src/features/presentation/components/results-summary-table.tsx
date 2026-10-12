import React from 'react';
import { Flame, CheckCircle2, Award, Crown } from 'lucide-react';

export interface SummaryRoundItem {
  questionId: string;
  questionNumber: number;
  photoUrl: string;
  femaleName: string;
  assignedUserName: string | null;
  totalCorrectGuesses: number;
  totalGuesses: number;
  selectionReason: 'FASTEST_CORRECT' | 'FASTEST_INCORRECT' | 'MANUAL' | 'NO_VOTES';
}

export interface ResultsSummaryTableProps {
  rounds: SummaryRoundItem[];
  onSelectRound: (index: number) => void;
}

export function ResultsSummaryTable({ rounds, onSelectRound }: ResultsSummaryTableProps) {
  const totalVotes = rounds.reduce((acc, r) => acc + r.totalGuesses, 0);
  const totalCorrect = rounds.reduce((acc, r) => acc + r.totalCorrectGuesses, 0);
  const totalAssignedCouples = rounds.filter((r) => r.assignedUserName !== null).length;

  return (
    <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-4 flex-1 flex flex-col justify-start overflow-y-auto">
      {/* Top Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/60 text-[#DC2626] flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-bold uppercase">Tổng Lượt Đoán</span>
            <p className="font-headline text-2xl font-black text-white">{totalVotes}</p>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-950/60 text-green-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-bold uppercase">Tổng Câu Đúng</span>
            <p className="font-headline text-2xl font-black text-green-400">{totalCorrect}</p>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-bold uppercase">Cặp Đã Phân Bổ (D4)</span>
            <p className="font-headline text-2xl font-black text-amber-400">
              {totalAssignedCouples} / {rounds.length}
            </p>
          </div>
        </div>
      </div>

      {/* 14 Assigned Pairs Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <span className="font-headline text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            Bảng 14 Cặp Trao Quà Astar 20/10
          </span>
          <span className="text-xs text-zinc-400">Thuật toán loại trừ độc nhất D4</span>
        </div>

        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-950 text-zinc-400 uppercase font-bold sticky top-0 z-10 border-b border-zinc-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-4"># Ảnh</th>
                <th className="py-2.5 px-4">Bạn Nữ Astar</th>
                <th className="py-2.5 px-4">Người Trao Quà (Nam)</th>
                <th className="py-2.5 px-4 text-center">Tỷ Lệ Đúng</th>
                <th className="py-2.5 px-4">Lý Do Chọn (D4)</th>
                <th className="py-2.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {rounds.map((r, idx) => (
                <tr key={r.questionId} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-black text-[#DC2626]">#{r.questionNumber}</td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.photoUrl}
                        alt={r.femaleName}
                        className="w-7 h-7 rounded-lg object-cover border border-zinc-700"
                      />
                      <span className="font-bold text-white">{r.femaleName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    {r.assignedUserName ? (
                      <span className="font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/50 inline-flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        {r.assignedUserName}
                      </span>
                    ) : (
                      <span className="text-zinc-500 italic">Chưa có lượt vote</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-center font-semibold">
                    <span className="text-green-400">{r.totalCorrectGuesses}</span>
                    <span className="text-zinc-500"> / {r.totalGuesses}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {r.selectionReason === 'FASTEST_CORRECT' && '⚡ Đoán đúng nhanh nhất'}
                      {r.selectionReason === 'FASTEST_INCORRECT' && '🔥 Đoán sai dũng cảm nhất'}
                      {r.selectionReason === 'MANUAL' && '👑 MC chỉ định'}
                      {r.selectionReason === 'NO_VOTES' && '— Chưa vote'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectRound(idx)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-[#DC2626] text-white text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Chiếu Slide
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
