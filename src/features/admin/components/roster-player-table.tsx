import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface PlayerRosterItem {
  id: string;
  username: string;
  fullName: string;
  gender?: string;
  answersCount: number;
  totalQuestions: number;
  correctCount: number;
  completed: boolean;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  lastAnsweredAt: string | null;
}

export interface RosterPlayerTableProps {
  players: PlayerRosterItem[];
  onRefresh: () => void;
  onToggleGender?: (userId: string, currentGender: string) => void;
}

export function RosterPlayerTable({ players, onRefresh, onToggleGender }: RosterPlayerTableProps) {
  return (
    <Card className="rounded-3xl p-6 shadow-xl border border-[#27303F]">
      <div className="flex items-center justify-between pb-4 border-b border-[#27303F]">
        <div>
          <h3 className="font-headline text-base font-extrabold text-white">
            Danh Sách Tiến Độ Người Chơi ({players.length})
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tự động cập nhật trực tiếp theo từng câu hỏi (nhấp vào giới tính để đổi Nam/Nữ)
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 text-zinc-400 hover:text-zinc-200 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Làm mới"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#27303F] text-zinc-400 font-headline font-bold text-[11px] tracking-wider uppercase">
              <th className="pb-3 px-3">HỌ VÀ TÊN</th>
              <th className="pb-3 px-3">GIỚI TÍNH</th>
              <th className="pb-3 px-3">MẬT KHẨU / MÃ</th>
              <th className="pb-3 px-3">SỐ CÂU ĐÃ TRẢ LỜI</th>
              <th className="pb-3 px-3">TRẠNG THÁI</th>
              <th className="pb-3 px-3">THỜI GIAN GẦN NHẤT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27303F]">
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-3 px-3 font-bold text-white">
                  {player.fullName}
                </td>
                <td className="py-3 px-3 font-medium">
                  <button
                    type="button"
                    onClick={() => onToggleGender && onToggleGender(player.id, player.gender || 'MALE')}
                    className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    title="Bấm để đổi Nam / Nữ"
                  >
                    {player.gender === 'FEMALE' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 hover:bg-pink-500/30">
                        Nữ ♀
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30">
                        Nam ♂
                      </span>
                    )}
                  </button>
                </td>
                <td className="py-3 px-3 text-zinc-400 font-medium">
                  @{player.username}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          player.completed ? 'bg-emerald-500' : 'bg-[#DC2626]'
                        }`}
                        style={{
                          width: `${(player.answersCount / player.totalQuestions) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="font-bold text-zinc-300">
                      {player.answersCount}/{player.totalQuestions}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  {player.status === 'COMPLETED' && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                      ✓ Đã xong 14/14
                    </span>
                  )}
                  {player.status === 'IN_PROGRESS' && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800 font-bold text-[10px]">
                      Đã trả lời {player.answersCount} câu
                    </span>
                  )}
                  {player.status === 'NOT_STARTED' && (
                    <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-medium text-[10px]">
                      Chưa bắt đầu
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">
                  {player.lastAnsweredAt
                    ? new Date(player.lastAnsweredAt).toLocaleTimeString('vi-VN')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
