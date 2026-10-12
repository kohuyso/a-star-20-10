'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminHeader } from '@/features/admin/components/admin-header';
import { LiveBroadcasterCard } from '@/features/admin/components/live-broadcaster-card';
import { RosterMetricsGrid, PlayerSummaryData } from '@/features/admin/components/roster-metrics-grid';
import { RosterPlayerTable, PlayerRosterItem } from '@/features/admin/components/roster-player-table';
import { LanQrModal } from '@/features/admin/components/lan-qr-modal';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<any>(null);
  const [summary, setSummary] = useState<PlayerSummaryData | null>(null);
  const [players, setPlayers] = useState<PlayerRosterItem[]>([]);
  const [networkInfo, setNetworkInfo] = useState<{ ip: string; port: number; joinUrl: string } | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(20);
  const isDurationInitialized = useRef(false);
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

  // 1. Tải toàn bộ dữ liệu quản trị
  const fetchAdminData = useCallback(async () => {
    try {
      const authHeaders = getAuthHeaders();
      const authRes = await fetch('/api/auth/me', { headers: authHeaders });
      const authData = await authRes.json();
      if (!authData.user || authData.user.role !== 'ADMIN') {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return;
      }

      // Game state
      const stateRes = await fetch('/api/game/state', { headers: authHeaders });
      const stateData = await stateRes.json();
      setGameState(stateData.gameState);
      if (!isDurationInitialized.current && stateData.gameState?.timerDurationSec) {
        setSelectedDuration(stateData.gameState.timerDurationSec);
        isDurationInitialized.current = true;
      }

      // Roster
      const rosterRes = await fetch('/api/admin/roster', { headers: authHeaders });
      const rosterData = await rosterRes.json();
      setSummary(rosterData.summary);
      setPlayers(rosterData.players || []);

      // Network
      const netRes = await fetch('/api/admin/network', { headers: authHeaders });
      const netData = await netRes.json();
      setNetworkInfo(netData);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 1000);
    return () => clearInterval(interval);
  }, [fetchAdminData]);

  // 2. Tính toán thời gian đếm ngược còn lại
  useEffect(() => {
    if (!gameState?.timerStartedAt || !gameState?.isQuestionActive) {
      setTimeLeft(0);
      return;
    }

    const timer = setInterval(() => {
      const startMs = new Date(gameState.timerStartedAt).getTime();
      const elapsed = Math.floor((Date.now() - startMs) / 1000);
      const remaining = Math.max(0, (gameState.timerDurationSec || 20) - elapsed);
      setTimeLeft(remaining);
    }, 500);

    return () => clearInterval(timer);
  }, [gameState?.timerStartedAt, gameState?.isQuestionActive, gameState?.timerDurationSec]);

  // 3. Thao tác điều khiển câu hỏi & đếm ngược
  const handleStartTimerForQuestion = async () => {
    setActionLoading(true);
    try {
      await fetch('/api/admin/state', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          startTimer: true,
          timerDurationSec: selectedDuration,
        }),
      });
      await fetchAdminData();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLockQuestion = async () => {
    setActionLoading(true);
    try {
      await fetch('/api/admin/state', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isQuestionActive: false }),
      });
      await fetchAdminData();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeQuestion = async (qNum: number) => {
    setActionLoading(true);
    try {
      await fetch('/api/admin/state', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentQuestionNumber: qNum,
          isQuestionActive: false,
        }),
      });
      await fetchAdminData();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeDuration = async (sec: number) => {
    setSelectedDuration(sec);
    isDurationInitialized.current = true;
    try {
      await fetch('/api/admin/state', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ timerDurationSec: sec }),
      });
    } catch (e) {
      console.error('Failed to update timer duration:', e);
    }
  };

  const handleNextQuestion = () => {
    const cur = gameState?.currentQuestionNumber || 1;
    if (cur < 14) handleChangeQuestion(cur + 1);
  };

  const handlePrevQuestion = () => {
    const cur = gameState?.currentQuestionNumber || 1;
    if (cur > 1) handleChangeQuestion(cur - 1);
  };

  const handleFinishToReveal = async () => {
    if (!window.confirm('Chuyển toàn bộ hệ thống sang màn hình CÔNG BỐ KẾT QUẢ (MC Reveal)?')) return;
    setActionLoading(true);
    try {
      await fetch('/api/admin/state', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'REVEAL', isQuestionActive: false }),
      });
      await fetchAdminData();
      router.push('/results');
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetGame = async () => {
    if (!window.confirm('⚠️ Bạn có chắc chắn muốn RESET toàn bộ kết quả bình chọn và đưa phòng về câu số 1?')) {
      return;
    }
    setActionLoading(true);
    try {
      await fetch('/api/admin/reset', { method: 'POST', headers: getAuthHeaders() });
      setSelectedDuration(20);
      await fetchAdminData();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('astar_token');
      localStorage.removeItem('astar_user');
    }
    await fetch('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() });
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1218] text-white flex flex-col items-center justify-center p-4 font-body">
        <Loader2 className="w-10 h-10 text-[#DC2626] animate-spin mb-4" />
        <p className="text-sm font-semibold text-zinc-300">
          Đang tải bảng điều khiển Quản trị...
        </p>
      </div>
    );
  }

  const currentQNum = gameState?.currentQuestionNumber || 1;
  const isVoting = gameState?.isQuestionActive && timeLeft > 0;

  return (
    <div className="min-h-screen bg-[#0F1218] text-[#F8FAFC] font-body pb-12">
      {/* 1. Admin Header Orchestrator */}
      <AdminHeader
        onOpenQR={() => setShowQRModal(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 flex flex-col gap-6">
        {/* 2. Slide Master Control Card */}
        <LiveBroadcasterCard
          currentQuestionNumber={currentQNum}
          isVoting={isVoting}
          timeLeft={timeLeft}
          actionLoading={actionLoading}
          selectedDuration={selectedDuration}
          onChangeDuration={handleChangeDuration}
          onChangeQuestion={handleChangeQuestion}
          onPrevQuestion={handlePrevQuestion}
          onNextQuestion={handleNextQuestion}
          onStartTimer={handleStartTimerForQuestion}
          onLockQuestion={handleLockQuestion}
          onFinishToReveal={handleFinishToReveal}
          onResetGame={handleResetGame}
        />

        {/* 3. Live Roster Metrics Grid */}
        <RosterMetricsGrid summary={summary} />

        {/* 4. Live Players Table */}
        <RosterPlayerTable
          players={players}
          onRefresh={fetchAdminData}
        />
      </main>

      {/* 5. LAN QR Code Modal */}
      <LanQrModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        networkInfo={networkInfo}
      />
    </div>
  );
}
