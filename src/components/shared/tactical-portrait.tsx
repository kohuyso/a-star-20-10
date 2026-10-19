import React from 'react';
import { MysteryGridImage } from './mystery-grid-image';

export interface TacticalPortraitProps {
  src: string;
  alt: string;
  tagText?: string;
  className?: string;
  questionNumber?: number;
  isQuestionActive?: boolean;
  timeLeft?: number;
  timerDurationSec?: number;
  timerStartedAt?: string | null;
  forceRevealAll?: boolean;
}

export function TacticalPortrait({
  src,
  alt,
  tagText,
  className = '',
  questionNumber,
  isQuestionActive = false,
  timeLeft = 0,
  timerDurationSec = 20,
  timerStartedAt = null,
  forceRevealAll = false,
}: TacticalPortraitProps) {
  return (
    <div
      className={`relative w-full mx-auto aspect-[4/5] rounded-[20px] bg-zinc-900 shadow-md overflow-hidden p-1.5 sm:p-2 flex flex-col justify-end shrink-0 ${className}`}
    >
      {/* 4 Góc L-shaped đỏ nhận diện thương hiệu Crimson Arena */}
      <svg
        className="absolute top-3.5 left-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-30"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
        viewBox="0 0 16 16"
      >
        <path d="M1 11V1H11" />
      </svg>
      <svg
        className="absolute top-3.5 right-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-30"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
        viewBox="0 0 16 16"
      >
        <path d="M5 1H15V11" />
      </svg>
      <svg
        className="absolute bottom-3.5 left-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-30"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
        viewBox="0 0 16 16"
      >
        <path d="M1 5V15H11" />
      </svg>
      <svg
        className="absolute bottom-3.5 right-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-30"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
        viewBox="0 0 16 16"
      >
        <path d="M5 15H15V5" />
      </svg>

      {/* Ảnh chân dung (hoặc Mystery Grid nếu có questionNumber) */}
      <div className="w-full h-full rounded-[16px] overflow-hidden flex items-center justify-center bg-zinc-950">
        {questionNumber !== undefined ? (
          <MysteryGridImage
            key={`mystery-grid-${questionNumber}`}
            src={src}
            alt={alt}
            questionNumber={questionNumber}
            isQuestionActive={isQuestionActive}
            timeLeft={timeLeft}
            timerDurationSec={timerDurationSec}
            timerStartedAt={timerStartedAt}
            forceRevealAll={forceRevealAll}
            gridSize={5}
            className="w-full h-full"
            imageClassName="rounded-[16px]"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={src} alt={alt} className="max-w-full max-h-full w-auto h-auto object-contain rounded-[16px]" />
        )}
      </div>

      {/* Nhãn tag hiển thị phía dưới nếu có */}
      {tagText && (
        <div className="absolute inset-x-2 bottom-2 h-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-b-[16px] pointer-events-none flex items-end px-3 py-2.5 z-20">
          <span className="text-white text-xs font-bold font-headline tracking-wide">{tagText}</span>
        </div>
      )}
    </div>
  );
}
