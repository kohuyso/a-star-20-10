import React from 'react';
import { HelpCircle } from 'lucide-react';
import { TacticalPortrait } from '@/components/shared/tactical-portrait';

export interface QuestionPhotoCardProps {
  photoUrl: string;
  questionNumber: number;
  hint?: string | null;
  isQuestionActive?: boolean;
  timeLeft?: number;
  timerDurationSec?: number;
  timerStartedAt?: string | null;
  hasAnswered?: boolean;
}

export function QuestionPhotoCard({
  photoUrl,
  questionNumber,
  hint,
  isQuestionActive = false,
  timeLeft = 0,
  timerDurationSec = 20,
  timerStartedAt = null,
  hasAnswered = false,
}: QuestionPhotoCardProps) {
  return (
    <div className="w-full flex flex-col gap-2.5 shrink-0">
      {/* Tactical Portrait with L-shaped red corners & Mystery Grid */}
      <TacticalPortrait
        src={photoUrl}
        alt={`Ảnh câu hỏi ${questionNumber}`}
        tagText={`ẢNH #${questionNumber}`}
        questionNumber={questionNumber}
        isQuestionActive={isQuestionActive}
        timeLeft={timeLeft}
        timerDurationSec={timerDurationSec}
        timerStartedAt={timerStartedAt}
        forceRevealAll={false}
        className="w-full shadow-lg border-2 border-white dark:border-zinc-800"
      />

      {/* Hint if available */}
      {hint && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs">
          <HelpCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <span className="italic">{hint}</span>
        </div>
      )}
    </div>
  );
}
