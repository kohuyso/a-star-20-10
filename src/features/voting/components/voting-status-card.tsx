import React from 'react';
import { CheckCircle2, Clock, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface VotingStatusCardProps {
  type: 'answered' | 'time-over' | 'locked';
  selectedName?: string;
  questionNumber: number;
}

export function VotingStatusCard({ type, selectedName, questionNumber }: VotingStatusCardProps) {
  if (type === 'answered') {
    return (
      <Card className="w-full p-5 rounded-3xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 flex flex-col items-center text-center my-auto">
        <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center mb-2 shadow-md shadow-green-600/30">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <span className="text-xs text-green-700 dark:text-green-300 font-bold uppercase tracking-wider">
          BẠN ĐÃ DỰ ĐOÁN
        </span>
        <h3 className="font-headline text-xl font-extrabold text-green-900 dark:text-white mt-0.5">
          {selectedName}
        </h3>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
          ⏳ Vui lòng nhìn lên màn hình lớn và chờ Admin chuyển câu tiếp theo!
        </p>
      </Card>
    );
  }

  if (type === 'time-over') {
    return (
      <Card className="w-full p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex flex-col items-center text-center my-auto">
        <Clock className="w-10 h-10 text-amber-500 mb-2 animate-bounce" />
        <span className="text-xs text-amber-700 dark:text-amber-300 font-bold uppercase">
          ĐÃ HẾT THỜI GIAN
        </span>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 font-medium">
          Bạn chưa kịp gửi đáp án cho câu #{questionNumber}. Đừng lo, hãy chuẩn bị cho câu tiếp theo!
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full p-5 rounded-3xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex flex-col items-center text-center my-auto">
      <Lock className="w-9 h-9 text-zinc-400 mb-2" />
      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase">
        CHỜ MỞ CỔNG BÌNH CHỌN
      </span>
      <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 font-medium">
        Admin đang giới thiệu ảnh #{questionNumber}. Khi đồng hồ bắt đầu chạy, bạn sẽ chọn tên!
      </p>
    </Card>
  );
}
