'use client';

import React, { useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Loader2 } from 'lucide-react';
import { ResultsHeader } from '@/features/presentation/components/results-header';
import { RevealPhotoCard } from '@/features/presentation/components/reveal-photo-card';
import { WinnerSpotlightCard } from '@/features/presentation/components/winner-spotlight-card';
import { VotesBreakdownCard } from '@/features/presentation/components/votes-breakdown-card';
import { ResultsSummaryTable } from '@/features/presentation/components/results-summary-table';
import { ResultsStepperFooter } from '@/features/presentation/components/results-stepper-footer';

interface VoteDetail {
  userId: string;
  userName: string;
  selectedName: string;
  isCorrect: boolean;
  answeredAt: string;
  wasPreviouslyAssigned: boolean;
}

interface RevealRound {
  femaleProfileId: string;
  femaleName: string;
  orderIndex: number;
  questionId: string;
  questionNumber: number;
  photoUrl: string;
  femaleHint?: string | null;
  totalCorrectGuesses: number;
  totalGuesses: number;
  assignedUserId: string | null;
  assignedUserName: string | null;
  selectionReason: 'FASTEST_CORRECT' | 'FASTEST_INCORRECT' | 'LUCKY_FALLBACK' | 'MANUAL' | 'NO_VOTES';
  answeredAt: string | null;
  allVotes: VoteDetail[];
}

export default function ResultsPage() {
  const [rounds, setRounds] = useState<RevealRound[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 2-Step Reveal States per slide
  const [revealedFemale, setRevealedFemale] = useState(false);
  const [revealedWinner, setRevealedWinner] = useState(false);

  // View Modes: Single Slide Reveal vs Full Summary Table
  const [viewMode, setViewMode] = useState<'SLIDE' | 'SUMMARY'>('SLIDE');
  const [sortBy, setSortBy] = useState<'QUESTION_NUMBER' | 'DIFFICULTY'>('QUESTION_NUMBER');

  // 1. Tải kết quả
  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch(`/api/results?sortBy=${sortBy}`);
      const data = await res.json();
      if (data.rounds) {
        setRounds(data.rounds);
      }
    } catch (e) {
      console.error('Failed to load results:', e);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Bắn pháo hoa Confetti khi reveal
  const triggerConfetti = () => {
    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#DC2626', '#F59E0B', '#10B981', '#ffffff', '#EC4899'],
    });
  };

  const handleRevealFemale = () => {
    setRevealedFemale(true);
  };

  const handleRevealWinner = () => {
    setRevealedFemale(true);
    setRevealedWinner(true);
    triggerConfetti();
  };

  const handleRevealAll = () => {
    setRevealedFemale(true);
    setRevealedWinner(true);
    triggerConfetti();
  };

  const handleNextRound = () => {
    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex((prev) => prev + 1);
      setRevealedFemale(false);
      setRevealedWinner(false);
    }
  };

  const handlePrevRound = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex((prev) => prev - 1);
      setRevealedFemale(false);
      setRevealedWinner(false);
    }
  };

  const handleSelectRound = (idx: number) => {
    setCurrentRoundIndex(idx);
    setRevealedFemale(false);
    setRevealedWinner(false);
  };

  if (loading || rounds.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F1218] text-white flex flex-col items-center justify-center font-body">
        <Loader2 className="w-10 h-10 text-[#DC2626] animate-spin mb-4" />
        <p className="text-sm font-semibold">Đang tổng hợp kết quả bình chọn theo thuật toán D4...</p>
      </div>
    );
  }

  const currentRound = rounds[currentRoundIndex];

  return (
    <div className="dark min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between select-none relative overflow-hidden font-body pb-6">
      {/* Background Glows */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#DC2626]/15 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#F59E0B]/15 blur-[140px] pointer-events-none" />

      {/* 1. Header Bar Orchestrator */}
      <ResultsHeader
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        sortBy={sortBy}
        onToggleSortBy={() => {
          setSortBy(sortBy === 'QUESTION_NUMBER' ? 'DIFFICULTY' : 'QUESTION_NUMBER');
          setCurrentRoundIndex(0);
          setRevealedFemale(false);
          setRevealedWinner(false);
        }}
        currentQuestionNumber={currentRound.questionNumber}
        currentRoundIndex={currentRoundIndex}
        totalRounds={rounds.length}
        onTriggerConfetti={triggerConfetti}
      />

      {/* 2. Main Body: Single Slide vs Summary Table */}
      {viewMode === 'SLIDE' ? (
        <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-4 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Female Identity */}
            <RevealPhotoCard
              photoUrl={currentRound.photoUrl}
              questionNumber={currentRound.questionNumber}
              femaleName={currentRound.femaleName}
              femaleHint={currentRound.femaleHint}
              revealedFemale={revealedFemale}
              onRevealFemale={handleRevealFemale}
            />

            {/* Right Column: Winner Spotlight & Guess Breakdown */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <WinnerSpotlightCard
                totalCorrectGuesses={currentRound.totalCorrectGuesses}
                totalGuesses={currentRound.totalGuesses}
                selectionReason={currentRound.selectionReason}
                assignedUserName={currentRound.assignedUserName}
                answeredAt={currentRound.answeredAt}
                revealedWinner={revealedWinner}
                onRevealWinner={handleRevealWinner}
                onRevealAll={handleRevealAll}
              />

              <VotesBreakdownCard votes={currentRound.allVotes} />
            </div>
          </div>
        </main>
      ) : (
        <ResultsSummaryTable
          rounds={rounds}
          onSelectRound={(idx) => {
            setCurrentRoundIndex(idx);
            setViewMode('SLIDE');
            setRevealedFemale(true);
            setRevealedWinner(true);
          }}
        />
      )}

      {/* 3. Bottom Stepper Controls Orchestrator */}
      {viewMode === 'SLIDE' && (
        <ResultsStepperFooter
          currentRoundIndex={currentRoundIndex}
          totalRounds={rounds.length}
          questionNumbers={rounds.map((r) => r.questionNumber)}
          onPrevRound={handlePrevRound}
          onNextRound={handleNextRound}
          onSelectRound={handleSelectRound}
        />
      )}
    </div>
  );
}
