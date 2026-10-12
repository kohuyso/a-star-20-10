'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { SlideHeader } from '@/features/presentation/components/slide-header';
import { SlidePhotoDisplay } from '@/features/presentation/components/slide-photo-display';
import { SlideStepperFooter } from '@/features/presentation/components/slide-stepper-footer';

interface QuestionItem {
  id: string;
  questionNumber: number;
  photoUrl: string;
  hint?: string | null;
}

export default function SlideshowPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [gameState, setGameState] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Tải danh sách toàn bộ câu hỏi
  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('/api/results');
        const data = await res.json();
        if (data.rounds) {
          const list: QuestionItem[] = data.rounds.map((r: any) => ({
            id: r.questionId,
            questionNumber: r.questionNumber,
            photoUrl: r.photoUrl,
            hint: r.femaleHint || null,
          }));
          list.sort((a, b) => a.questionNumber - b.questionNumber);
          setQuestions(list);
        }
      } catch (e) {
        console.error('Failed to load questions:', e);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  // 2. Polling trạng thái phòng từ Admin theo thời gian thực (1s)
  useEffect(() => {
    async function syncGameState() {
      try {
        const res = await fetch('/api/game/state');
        const data = await res.json();
        if (data.gameState) {
          setGameState(data.gameState);
        }
      } catch (e) {
        console.error('Failed to sync game state:', e);
      }
    }

    syncGameState();
    const interval = setInterval(syncGameState, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Tính toán đếm ngược thời gian
  useEffect(() => {
    if (!gameState?.timerStartedAt || !gameState?.isQuestionActive) {
      setTimeLeft(0);
      return;
    }

    const startMs = new Date(gameState.timerStartedAt).getTime();
    const duration = gameState.timerDurationSec || 20;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startMs) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
    };

    tick();
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [gameState?.timerStartedAt, gameState?.isQuestionActive, gameState?.timerDurationSec]);

  // Phím tắt bàn phím
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyH') {
        setShowHint((h) => !h);
      } else if (e.code === 'KeyF') {
        toggleFullScreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F1218] text-white flex flex-col items-center justify-center font-body">
        <Sparkles className="w-10 h-10 text-[#DC2626] animate-spin mb-4" />
        <p className="text-sm font-semibold">Đang đồng bộ màn hình máy chiếu...</p>
      </div>
    );
  }

  const currentQNum = gameState?.currentQuestionNumber || 1;
  const currentQ = questions.find((q) => q.questionNumber === currentQNum) || questions[0];
  const isVoting = gameState?.isQuestionActive && timeLeft > 0;

  return (
    <div className="dark min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between select-none relative overflow-hidden font-body">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#DC2626]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#F59E0B]/10 blur-[120px] pointer-events-none" />

      {/* 1. Header Bar Orchestrator */}
      <SlideHeader
        currentQuestionNumber={currentQ.questionNumber}
        totalQuestions={questions.length}
        isVoting={isVoting}
        timeLeft={timeLeft}
        showHint={showHint}
        onToggleHint={() => setShowHint(!showHint)}
        onToggleFullScreen={toggleFullScreen}
      />

      {/* 2. Main Photo Display Orchestrator */}
      <SlidePhotoDisplay
        photoUrl={currentQ.photoUrl}
        questionNumber={currentQ.questionNumber}
        hint={currentQ.hint}
        showHint={showHint}
        isQuestionActive={gameState?.isQuestionActive}
        timeLeft={timeLeft}
        timerDurationSec={gameState?.timerDurationSec}
        timerStartedAt={gameState?.timerStartedAt}
      />

      {/* 3. Footer Stepper Orchestrator */}
      <SlideStepperFooter
        questions={questions}
        currentQuestionNumber={currentQNum}
      />
    </div>
  );
}
