'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { VotingHeader } from '@/features/voting/components/voting-header';
import { LobbyWaitingCard } from '@/features/voting/components/lobby-waiting-card';
import { RevealWaitingCard } from '@/features/voting/components/reveal-waiting-card';
import { QuestionPhotoCard } from '@/features/voting/components/question-photo-card';
import { VotingStatusCard } from '@/features/voting/components/voting-status-card';
import { CandidateSelector } from '@/features/voting/components/candidate-selector';
import { VotingActionDeck } from '@/features/voting/components/voting-action-deck';

interface QuestionData {
  id: string;
  questionNumber: number;
  photoUrl: string;
  hint?: string | null;
}

interface ProgressData {
  gameState: 'LOBBY' | 'VOTING' | 'CLOSED' | 'REVEAL';
  currentQuestionNumber: number;
  isQuestionActive: boolean;
  timerDurationSec: number;
  timerStartedAt: string | null;
  totalQuestions: number;
  currentQuestion: QuestionData | null;
  userAnswerForCurrentQuestion: {
    selectedName: string;
    answeredAt: string;
  } | null;
  selectedNames: string[];
  remainingFemaleNames: string[];
  answersCount: number;
}

export default function VotePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<ProgressData | null>(null);
  const [selectedName, setSelectedName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const token = urlToken || localStorage.getItem('astar_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['x-astar-token'] = token;
      }
    }
    return headers;
  }, []);

  // Trích xuất token từ URL param nếu có
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken) {
        localStorage.setItem('astar_token', urlToken);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // 1. Tải thông tin người chơi và tiến độ câu hỏi
  const loadProgress = useCallback(async () => {
    try {
      const authHeaders = getAuthHeaders();
      const authRes = await fetch('/api/auth/me', { headers: authHeaders });
      const authData = await authRes.json();
      if (!authData.user) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return;
      }
      setCurrentUser(authData.user);

      const res = await fetch('/api/vote/progress', { headers: authHeaders });
      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return;
      }
      const progressData: ProgressData = await res.json();
      setData(progressData);
    } catch (err) {
      console.error('Failed to load progress:', err);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    loadProgress();
    const interval = setInterval(loadProgress, 1000);
    return () => clearInterval(interval);
  }, [loadProgress]);

  // 2. Tính toán đếm ngược thời gian tức thì và đồng bộ
  const calculateRealRemaining = useCallback(() => {
    if (!data?.timerStartedAt || !data?.isQuestionActive) {
      return 0;
    }
    const startMs = new Date(data.timerStartedAt).getTime();
    if (isNaN(startMs)) return 0;
    const duration = data.timerDurationSec || 20;
    const elapsed = Math.floor((Date.now() - startMs) / 1000);
    return Math.max(0, duration - elapsed);
  }, [data?.timerStartedAt, data?.isQuestionActive, data?.timerDurationSec]);

  useEffect(() => {
    if (!data?.timerStartedAt || !data?.isQuestionActive) {
      setTimeLeft(0);
      return;
    }

    const startMs = new Date(data.timerStartedAt).getTime();
    const duration = data.timerDurationSec || 20;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startMs) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
    };

    tick();
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [data?.timerStartedAt, data?.isQuestionActive, data?.timerDurationSec]);

  // 3. Reset tên đang chọn và bộ đếm ngược khi chuyển câu mới
  useEffect(() => {
    setSelectedName('');
    setErrorMessage('');
    setTimeLeft(0);
  }, [data?.currentQuestionNumber]);

  // 4. Submit câu trả lời cho câu hiện tại
  const handleSubmitVote = async () => {
    if (!selectedName || !data?.currentQuestion) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/vote/submit', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          questionId: data.currentQuestion.id,
          selectedName,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        setErrorMessage(resData.error || 'Nộp câu trả lời thất bại');
        setSubmitting(false);
        return;
      }

      await loadProgress();
    } catch {
      setErrorMessage('Lỗi kết nối khi gửi câu trả lời. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // 5. Đăng xuất
  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('astar_token');
      localStorage.removeItem('astar_user');
    }
    await fetch('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  if (loading || !data || !currentUser) {
    return (
      <div className="min-h-screen bg-[#0F1218] text-[#F8FAFC] flex flex-col items-center justify-center p-4 font-body">
        <Loader2 className="w-10 h-10 text-[#DC2626] animate-spin mb-4" />
        <p className="font-headline text-sm font-semibold text-zinc-300">
          Đang kết nối phòng đấu...
        </p>
      </div>
    );
  }

  // TRƯỜNG HỢP 1: Phòng đang ở LOBBY
  if (data?.gameState === 'LOBBY') {
    return (
      <LobbyWaitingCard
        playerName={currentUser.fullName}
        username={currentUser.username}
        onLogout={handleLogout}
      />
    );
  }

  // TRƯỜNG HỢP 2: Đã chuyển sang màn công bố kết quả
  if (data?.gameState === 'REVEAL') {
    return (
      <RevealWaitingCard
        playerName={currentUser.fullName}
        onLogout={handleLogout}
      />
    );
  }

  // TRƯỜNG HỢP 3: PHIÊN THI ĐẤU THEO TỪNG CÂU
  const currentQ = data.currentQuestion;
  const currentQNum = data.currentQuestionNumber || 1;
  const hasAnsweredCurrent = !!data.userAnswerForCurrentQuestion;

  // Thời gian còn lại chuẩn xác tức thì, loại bỏ 1 frame delay của useState
  const currentRemaining = data.isQuestionActive
    ? (timeLeft > 0 ? timeLeft : calculateRealRemaining())
    : 0;

  const isQuestionVoting = data.isQuestionActive && currentRemaining > 0;
  const isTimeOver = data.isQuestionActive && currentRemaining === 0;

  return (
    <div className="w-full min-h-screen bg-[#0F1218] text-[#F8FAFC] flex flex-col justify-between px-2.5 sm:px-4 py-3 sm:py-4 max-w-md mx-auto font-body">
      {/* 1. Header Bar Orchestrator */}
      <VotingHeader
        currentQuestionNumber={currentQNum}
        totalQuestions={data.totalQuestions}
        playerName={currentUser.fullName}
        isQuestionVoting={isQuestionVoting}
        timeLeft={currentRemaining}
        hasAnsweredCurrent={hasAnsweredCurrent}
        timerDurationSec={data.timerDurationSec}
        onLogout={handleLogout}
      />

      {/* 2. Photo & Candidate Selector Container */}
      <div className="w-full flex-1 flex flex-col gap-3 my-1 overflow-y-auto pb-2">
        {currentQ && (
          <QuestionPhotoCard
            key={`question-card-${currentQ.questionNumber}`}
            photoUrl={currentQ.photoUrl}
            questionNumber={currentQ.questionNumber}
            hint={currentQ.hint}
            isQuestionActive={data.isQuestionActive}
            timeLeft={currentRemaining}
            timerDurationSec={data.timerDurationSec}
            timerStartedAt={data.timerStartedAt}
            hasAnswered={hasAnsweredCurrent}
          />
        )}

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 3. Status Display or Candidate Selector */}
        {hasAnsweredCurrent ? (
          <VotingStatusCard
            type="answered"
            selectedName={data.userAnswerForCurrentQuestion?.selectedName}
            questionNumber={currentQNum}
          />
        ) : isTimeOver ? (
          <VotingStatusCard
            type="time-over"
            questionNumber={currentQNum}
          />
        ) : !data.isQuestionActive ? (
          <VotingStatusCard
            type="locked"
            questionNumber={currentQNum}
          />
        ) : (
          <CandidateSelector
            candidates={data.remainingFemaleNames}
            selectedName={selectedName}
            onSelectCandidate={setSelectedName}
          />
        )}
      </div>

      {/* 4. Action Deck Orchestrator */}
      {isQuestionVoting && !hasAnsweredCurrent && (
        <VotingActionDeck
          currentQuestionNumber={currentQNum}
          selectedName={selectedName}
          isSubmitting={submitting}
          onSubmit={handleSubmitVote}
        />
      )}
    </div>
  );
}
