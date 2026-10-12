import React from 'react';

export interface SlideQuestionItem {
  id: string;
  questionNumber: number;
}

export interface SlideStepperFooterProps {
  questions: SlideQuestionItem[];
  currentQuestionNumber: number;
}

export function SlideStepperFooter({
  questions,
  currentQuestionNumber,
}: SlideStepperFooterProps) {
  return (
    <footer className="relative z-10 px-8 py-5 flex items-center justify-center border-t border-zinc-800/60">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {questions.map((q) => {
          const isCurrent = q.questionNumber === currentQuestionNumber;
          return (
            <div
              key={q.id}
              className={`w-9 h-9 rounded-xl font-headline font-extrabold text-xs flex items-center justify-center transition-all ${
                isCurrent
                  ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/50 scale-110 ring-2 ring-red-400'
                  : 'bg-zinc-900/80 text-zinc-500 border border-zinc-800'
              }`}
            >
              {q.questionNumber}
            </div>
          );
        })}
      </div>
    </footer>
  );
}
