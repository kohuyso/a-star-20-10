import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface VotingActionDeckProps {
  currentQuestionNumber: number;
  selectedName: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function VotingActionDeck({
  currentQuestionNumber,
  selectedName,
  isSubmitting,
  onSubmit,
}: VotingActionDeckProps) {
  return (
    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-1.5">
      <Button
        variant="primary"
        size="lg"
        disabled={!selectedName || isSubmitting}
        isLoading={isSubmitting}
        onClick={onSubmit}
        className="w-full py-3.5 rounded-2xl"
      >
        <span>XÁC NHẬN ĐÁP ÁN CÂU #{currentQuestionNumber}</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
