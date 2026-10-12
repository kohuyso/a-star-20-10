'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LoginHeader } from '@/features/auth/components/login-header';
import { PlayerQuickSelect, PlayerOption } from '@/features/auth/components/player-quick-select';
import { LoginForm } from '@/features/auth/components/login-form';

const PLAYER_OPTIONS: PlayerOption[] = [
  { username: 'nguyen.nam', fullName: 'Nguyễn Hải Nam', dob: '15/03' },
  { username: 'tran.tuan', fullName: 'Trần Anh Tuấn', dob: '22/07' },
  { username: 'le.hoang', fullName: 'Lê Minh Hoàng', dob: '08/11' },
  { username: 'pham.duy', fullName: 'Phạm Đức Duy', dob: '30/01' },
  { username: 'hoang.bach', fullName: 'Hoàng Gia Bách', dob: '14/09' },
  { username: 'vu.long', fullName: 'Vũ Phi Long', dob: '05/05' },
  { username: 'dang.khoa', fullName: 'Đặng Đăng Khoa', dob: '19/12' },
  { username: 'bui.thanh', fullName: 'Bùi Tiến Thành', dob: '25/08' },
  { username: 'do.hung', fullName: 'Đỗ Mạnh Hùng', dob: '12/04' },
  { username: 'ngo.phuc', fullName: 'Ngô Hoàng Phúc', dob: '02/10' },
];

export default function LoginPage() {
  const [username, setUsername] = useState('nguyen.nam');
  const [password, setPassword] = useState('15/03');
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectPlayer = (p: PlayerOption) => {
    setUsername(p.username);
    setPassword(p.dob);
    setErrorMessage('');
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!username.trim()) {
      setErrorMessage('Vui lòng chọn hoặc nhập Họ tên tài khoản');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Vui lòng nhập Ngày sinh (Mật khẩu)');
      return;
    }

    setIsPending(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Đăng nhập không thành công');
        setIsPending(false);
        return;
      }

      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('astar_token', data.token);
        if (data.user) {
          localStorage.setItem('astar_user', JSON.stringify(data.user));
        }
      }

      const targetPath = data.user?.role === 'ADMIN' ? '/admin' : '/vote';
      const redirectUrl = data.token ? `${targetPath}?token=${encodeURIComponent(data.token)}` : targetPath;
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối Wi-Fi!');
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1218] text-[#F8FAFC] flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden font-body select-none">
      {/* Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-red-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      {/* Header Orchestrator */}
      <LoginHeader />

      {/* Login Card Orchestrator */}
      <div className="w-full max-w-md my-auto relative z-10 py-3">
        <Card className="rounded-3xl p-6 shadow-2xl border border-[#27303F]">
          {errorMessage && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 mb-4 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs leading-relaxed">
                <span className="font-semibold text-red-800 dark:text-red-200">Đăng nhập thất bại</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <PlayerQuickSelect
            playerOptions={PLAYER_OPTIONS}
            selectedUsername={username}
            onSelectPlayer={handleSelectPlayer}
          />

          <LoginForm
            username={username}
            onChangeUsername={setUsername}
            password={password}
            onChangePassword={setPassword}
            onSubmit={handleLogin}
            isLoading={isPending}
          />

          <div className="mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-1 text-center text-[11px] text-zinc-400">
            <span>
              Tài khoản Quản trị viên: <strong className="text-zinc-700 dark:text-zinc-300">admin</strong> / <strong className="text-zinc-700 dark:text-zinc-300">admin2010</strong>
            </span>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="w-full max-w-md text-center text-xs text-zinc-400 relative z-10 pt-2">
        <span>© 2026 Astar Network • Sự kiện 20/10 v1.0</span>
      </div>
    </div>
  );
}
