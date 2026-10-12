import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface VoteDetailItem {
  userId: string;
  userName: string;
  selectedName: string;
  isCorrect: boolean;
  answeredAt: string;
  wasPreviouslyAssigned: boolean;
}

export interface VotesBreakdownCardProps {
  votes: VoteDetailItem[];
}

export function VotesBreakdownCard({ votes }: VotesBreakdownCardProps) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
        <span className="text-[11px] font-bold text-zinc-400 uppercase">
          Lượt dự đoán của các bạn nam ({votes.length})
        </span>
        <span className="text-[10px] text-zinc-500">Xếp theo thứ tự nộp bài</span>
      </div>
      <div className="max-h-28 overflow-y-auto divide-y divide-zinc-800/50 pr-1 text-xs">
        {votes.length === 0 ? (
          <p className="text-[11px] text-zinc-500 italic py-2 text-center">
            Chưa có dữ liệu dự đoán trong phiên này
          </p>
        ) : (
          votes.map((v) => (
            <div key={v.userId} className="py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-200">{v.userName}</span>
                {v.wasPreviouslyAssigned && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                    Đã trúng ở câu khác
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={v.isCorrect ? 'text-green-400 font-semibold' : 'text-zinc-400'}>
                  {v.selectedName}
                </span>
                {v.isCorrect ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
