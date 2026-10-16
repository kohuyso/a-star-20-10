import React from 'react';
import { HelpCircle } from 'lucide-react';
import { MysteryGridImage } from '@/components/shared/mystery-grid-image';

export interface SlidePhotoDisplayProps {
  photoUrl: string;
  questionNumber: number;
  hint?: string | null;
  showHint: boolean;
  isQuestionActive?: boolean;
  timeLeft?: number;
  timerDurationSec?: number;
  timerStartedAt?: string | null;
}

export function SlidePhotoDisplay({
  photoUrl,
  questionNumber,
  hint,
  showHint,
  isQuestionActive = false,
  timeLeft = 0,
  timerDurationSec = 20,
  timerStartedAt = null,
}: SlidePhotoDisplayProps) {
  return (
    <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full">
      <div className="relative h-[72vh] max-h-[72vh] max-w-5xl w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-800/80 bg-zinc-950 flex items-center justify-center p-2 sm:p-4">
        <MysteryGridImage
          src={photoUrl}
          alt={`Ảnh bí ẩn #${questionNumber}`}
          questionNumber={questionNumber}
          isQuestionActive={isQuestionActive}
          timeLeft={timeLeft}
          timerDurationSec={timerDurationSec}
          timerStartedAt={timerStartedAt}
          gridSize={5}
          className="w-full h-full"
        />

        {/* Hint Overlay */}
        {showHint && hint && (
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-amber-500/40 text-amber-300 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300 shadow-xl z-20">
            <HelpCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-headline text-xs font-bold text-amber-400 uppercase tracking-wider">
                GỢI Ý TỪ BAN TỔ CHỨC
              </span>
              <span className="text-sm font-medium text-white italic">{hint}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
