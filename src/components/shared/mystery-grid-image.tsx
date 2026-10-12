'use client';

import React, { useMemo } from 'react';

export interface MysteryGridImageProps {
  src: string;
  alt: string;
  questionNumber: number;
  isQuestionActive?: boolean;
  timeLeft?: number;
  timerDurationSec?: number;
  timerStartedAt?: string | null;
  gridSize?: number;
  className?: string;
  imageClassName?: string;
  forceRevealAll?: boolean;
}

// Hàm sinh số ngẫu nhiên có Seed (LCG) để đảm bảo đồng bộ 100% giữa máy chiếu và tất cả mobile
function seededShuffle(array: number[], seed: number): number[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    const j = Math.floor(rnd * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function MysteryGridImage({
  src,
  alt,
  questionNumber,
  isQuestionActive = false,
  timeLeft = 0,
  timerDurationSec = 20,
  timerStartedAt = null,
  gridSize = 5,
  className = '',
  imageClassName = '',
  forceRevealAll = false,
}: MysteryGridImageProps) {
  const totalTiles = gridSize * gridSize;

  // 1. Sinh danh sách thứ tự mở ô ngẫu nhiên cố định theo từng câu hỏi
  const revealOrder = useMemo(() => {
    const indices = Array.from({ length: totalTiles }, (_, i) => i);
    // Dùng questionNumber nhân số nguyên tố để tạo seed độc nhất cho từng ảnh
    return seededShuffle(indices, questionNumber * 7919 + 101);
  }, [totalTiles, questionNumber]);

  // 2. Tính số lượng ô được mở (revealedCount)
  // Quy tắc: Hoàn thành mở 100% trước 10s so với thời gian kết thúc phiên đoán.
  const revealedTilesSet = useMemo(() => {
    // 1. Nếu bắt buộc mở toàn bộ (ví dụ màn trao giải /results)
    if (forceRevealAll) {
      return new Set(revealOrder);
    }

    // 2. Nếu phiên CHƯA BẮT ĐẦU đếm ngược (timerStartedAt là null)
    // -> TUYỆT ĐỐI CHE KÍN 100%!
    if (!timerStartedAt) {
      return new Set<number>();
    }

    const duration = Math.max(1, timerDurationSec || 20);
    const revealTargetDuration = Math.max(1, duration - 10);

    // 3. Nếu phiên đang KHÔNG active (Admin chưa bấm bắt đầu hoặc đã bấm khóa):
    if (!isQuestionActive) {
      // Kiểm tra xem phiên này đã từng đếm ngược xong hết giờ hay chưa
      const startMs = new Date(timerStartedAt).getTime();
      const elapsed = Math.floor((Date.now() - startMs) / 1000);

      // Chỉ giữ nguyên trạng thái mở nếu phiên này đã thực sự đếm ngược kết thúc
      if (elapsed >= duration) {
        return new Set(revealOrder);
      }
      // Ngược lại: che kín 100%
      return new Set<number>();
    }

    // 4. Khi phiên ĐANG ACTIVE ĐẾM NGƯỢC (isQuestionActive === true):
    // Trong 10s cuối (timeLeft <= 10) hoặc hết giờ (timeLeft === 0):
    if (timeLeft <= 10) {
      return new Set(revealOrder);
    }

    // Khi còn > 10s: mở dần dần ngẫu nhiên từ lúc bắt đầu cho tới mốc 10s cuối:
    const elapsed = Math.max(0, duration - timeLeft);
    const progressRatio = Math.min(1, Math.max(0, elapsed / revealTargetDuration));
    const revealedCount = Math.floor(progressRatio * totalTiles);

    const revealed = new Set<number>();
    for (let i = 0; i < revealedCount; i++) {
      revealed.add(revealOrder[i]);
    }
    return revealed;
  }, [
    forceRevealAll,
    timerStartedAt,
    isQuestionActive,
    timerDurationSec,
    timeLeft,
    revealOrder,
    totalTiles,
  ]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-[#12161F] ${className}`}>
      {/* 1. Ảnh gốc bên dưới (ẩn opacity-0 khi chưa mở ô nào để chống lộ ảnh trước) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          revealedTilesSet.size === 0 ? 'opacity-0' : 'opacity-100'
        } ${imageClassName}`}
      />

      {/* 2. Lớp phủ lưới ô vuông (Mystery Grid Overlay) */}
      <div
        className="absolute inset-0 grid pointer-events-none"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: totalTiles }, (_, index) => {
          const isRevealed = revealedTilesSet.has(index);

          return (
            <div
              key={index}
              className={`relative w-full h-full border border-zinc-950 transition-all duration-700 ease-out flex items-center justify-center overflow-hidden ${
                isRevealed
                  ? 'opacity-0 scale-90 pointer-events-none'
                  : 'opacity-100 scale-100 bg-[#161B22] shadow-inner'
              }`}
              style={{
                background: isRevealed
                  ? 'transparent'
                  : 'linear-gradient(135deg, #1F242D 0%, #12161F 100%)',
              }}
            >
              {/* Họa tiết trang trí ô vuông công nghệ bí ẩn */}
              {!isRevealed && (
                <div className="flex flex-col items-center justify-center opacity-40 select-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 mb-0.5" />
                  <span className="text-[9px] font-mono text-zinc-400 font-bold tracking-tighter">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
