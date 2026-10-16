'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  UserPlus,
  ShieldAlert,
  Search,
  CheckCircle2,
  Copy,
  LogIn,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  User,
  KeyRound,
  Sparkles,
  Users,
  Shield,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AccountItem {
  id: string;
  username: string;
  fullName: string;
  role: 'PLAYER' | 'ADMIN';
  gender: 'MALE' | 'FEMALE';
  createdAt: string;
  votesCount: number;
  wonRoundsCount: number;
}

export default function SecretRegisterPage() {
  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [role, setRole] = useState<'PLAYER' | 'ADMIN'>('PLAYER');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState<{
    username: string;
    fullName: string;
    passwordText: string;
    role: string;
    gender: string;
    token?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Accounts list states
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'PLAYER' | 'ADMIN'>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch accounts list
  const fetchAccounts = useCallback(async () => {
    setIsLoadingAccounts(true);
    try {
      const res = await fetch('/api/secret/users');
      const data = await res.json();
      if (res.ok && data.users) {
        setAccounts(data.users);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách tài khoản:', err);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Tạo username tự động khi gõ họ tên nếu ô username còn trống
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFullName(val);
  };

  // Nút sinh mã username ngẫu nhiên
  const handleGenerateUsername = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = gender === 'MALE' ? 'M' : 'F';
    setUsername(`${prefix}${randomNum}`);
  };

  // Nút sinh mật khẩu ngẫu nhiên
  const handleGeneratePassword = () => {
    if (username.trim()) {
      setPassword(username.trim()); // Đặt mật khẩu trùng username cho dễ nhớ
    } else {
      const randomPass = Math.floor(100000 + Math.random() * 900000).toString();
      setPassword(randomPass);
    }
  };

  // Submit tạo tài khoản
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessInfo(null);

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên');
      return;
    }
    if (!username.trim()) {
      setErrorMessage('Vui lòng nhập Tên tài khoản / Mã');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Vui lòng nhập Mật khẩu');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/secret/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim(),
          password: password.trim(),
          gender,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Tạo tài khoản không thành công');
        setIsSubmitting(false);
        return;
      }

      setSuccessInfo({
        username: data.user.username,
        fullName: data.user.fullName,
        passwordText: password.trim(),
        role: data.user.role,
        gender: data.user.gender,
        token: data.token,
      });

      // Reset form
      setFullName('');
      setUsername('');
      setPassword('');

      // Refresh list
      fetchAccounts();
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage('Lỗi kết nối máy chủ khi tạo tài khoản');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sao chép thông tin tài khoản
  const handleCopyInfo = () => {
    if (!successInfo) return;
    const text = `Tài khoản Astar 20/10:\n- Họ tên: ${successInfo.fullName}\n- Tên đăng nhập: ${successInfo.username}\n- Mật khẩu: ${successInfo.passwordText}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Đăng nhập trực tiếp bằng tài khoản vừa tạo
  const handleDirectLogin = (token?: string, userRole?: string) => {
    if (!token) return;
    localStorage.setItem('astar_token', token);
    const targetUrl = userRole === 'ADMIN' ? '/admin' : '/vote';
    window.location.href = `${targetUrl}?token=${encodeURIComponent(token)}`;
  };

  // Xóa tài khoản
  const handleDeleteUser = async (id: string, name: string, uName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa tài khoản "${name}" (${uName}) không?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/secret/users?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Không thể xóa tài khoản');
      } else {
        fetchAccounts();
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Lỗi kết nối khi xóa tài khoản');
    } finally {
      setDeletingId(null);
    }
  };

  // Lọc tài khoản hiển thị
  const filteredAccounts = accounts.filter((acc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || acc.fullName.toLowerCase().includes(q) || acc.username.toLowerCase().includes(q);
    const matchGender = genderFilter === 'ALL' || acc.gender === genderFilter;
    const matchRole = roleFilter === 'ALL' || acc.role === roleFilter;
    return matchQuery && matchGender && matchRole;
  });

  const maleCount = accounts.filter((a) => a.gender === 'MALE').length;
  const femaleCount = accounts.filter((a) => a.gender === 'FEMALE').length;
  const adminCount = accounts.filter((a) => a.role === 'ADMIN').length;

  return (
    <div className="min-h-screen bg-[#0F1218] text-[#F8FAFC] flex flex-col items-center px-3 sm:px-6 py-6 sm:py-10 relative overflow-x-hidden font-body selection:bg-red-500/30">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header Container */}
      <div className="w-full max-w-5xl mb-6 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27303F] pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-red-500/20 text-[#DC2626] border border-red-500/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black font-headline tracking-tight text-white flex items-center gap-2">
              Cổng Tạo Tài Khoản Ẩn
            </h1>
            <Badge variant="gold" className="text-[10px] px-2 py-0.5">
              URL Trực Tiếp
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Trang chuyên dụng nội bộ, không có nút điều hướng từ trang chủ • Khởi tạo người chơi hoặc Admin nhanh chóng
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/login', '_blank')}
            className="text-xs bg-zinc-900/60 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <LogIn className="w-3.5 h-3.5 mr-1" /> Mở trang Đăng nhập
          </Button>
        </div>
      </div>

      {/* Main Grid: Form + List */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Column: Form Tạo Tài Khoản (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <Card className="rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#27303F] bg-[#161B22]/90 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#DC2626]" />
                <h2 className="font-headline font-bold text-base text-white">Thêm Tài Khoản Mới</h2>
              </div>
              <span className="text-[11px] text-zinc-400">Tạo tức thì vào DB</span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-start gap-2 mb-4 animate-in fade-in">
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Họ và tên */}
              <div>
                <label className="block text-xs font-headline font-bold text-zinc-300 mb-1.5">
                  Họ và tên người chơi <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Ví dụ: Nguyễn Văn A, Khổng Vũ Huy..."
                  value={fullName}
                  onChange={handleFullNameChange}
                  icon={<User className="w-4 h-4" />}
                  className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500"
                  required
                />
              </div>

              {/* Username / Mã nhân viên */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-headline font-bold text-zinc-300">
                    Tên đăng nhập / Mã tài khoản <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateUsername}
                    className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Tự sinh mã
                  </button>
                </div>
                <Input
                  placeholder="Ví dụ: 00032, B05, nguyenvana..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<Shield className="w-4 h-4" />}
                  className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 font-mono"
                  required
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Người dùng có thể đăng nhập bằng Họ tên hoặc Mã này
                </span>
              </div>

              {/* Mật khẩu */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-headline font-bold text-zinc-300">
                    Mật khẩu đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Đặt trùng mã
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu hoặc mã code..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<KeyRound className="w-4 h-4" />}
                    className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 font-mono pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  (Trong hệ thống Astar, mật khẩu thường là mã nhân viên hoặc ngày sinh)
                </span>
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-xs font-headline font-bold text-zinc-300 mb-1.5">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('MALE')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold font-headline flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      gender === 'MALE'
                        ? 'bg-red-600/20 border-[#DC2626] text-white shadow-sm shadow-red-500/20'
                        : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <span>👨</span> Nam (Tặng quà)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('FEMALE')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold font-headline flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      gender === 'FEMALE'
                        ? 'bg-rose-600/20 border-rose-500 text-white shadow-sm shadow-rose-500/20'
                        : 'bg-zinc-900/50 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <span>👩</span> Nữ (Dự đoán)
                  </button>
                </div>
                <div className="mt-1.5 text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <span>
                    {gender === 'MALE'
                      ? 'Tài khoản Nam sẽ được bốc thăm ngẫu nhiên để tặng quà cho 14 bạn nữ.'
                      : 'Tài khoản Nữ tham gia trả lời và nhận quà từ các bạn Nam.'}
                  </span>
                </div>
              </div>

              {/* Vai trò */}
              <div>
                <label className="block text-xs font-headline font-bold text-zinc-300 mb-1.5">
                  Vai trò hệ thống <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('PLAYER')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold font-headline flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'PLAYER'
                        ? 'bg-zinc-800 border-zinc-500 text-white'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    🎮 Người chơi (PLAYER)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ADMIN')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold font-headline flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'ADMIN'
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    👑 Quản trị viên (ADMIN)
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full mt-2 rounded-2xl h-12 shadow-lg shadow-red-600/25 text-sm font-bold tracking-wide"
              >
                <UserPlus className="w-4 h-4 mr-1.5" /> Tạo Tài Khoản Ngay
              </Button>
            </form>
          </Card>

          {/* Hộp thoại Kết quả vừa tạo thành công */}
          {successInfo && (
            <Card className="rounded-3xl p-5 border border-emerald-500/50 bg-emerald-950/30 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-300 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-headline font-bold text-sm mb-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Đã Tạo Tài Khoản Thành Công!</span>
              </div>

              <div className="bg-zinc-900/90 rounded-2xl p-3.5 border border-zinc-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Họ và tên:</span>
                  <span className="font-semibold text-white">{successInfo.fullName}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Tài khoản:</span>
                  <span className="text-amber-400 font-bold">{successInfo.username}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Mật khẩu:</span>
                  <span className="text-red-400 font-bold">{successInfo.passwordText}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Giới tính:</span>
                  <span>{successInfo.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Vai trò:</span>
                  <span>{successInfo.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyInfo}
                  className="flex-1 bg-zinc-900 border-zinc-700 text-zinc-200 hover:text-white text-xs h-10 rounded-xl"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  {copied ? 'Đã sao chép!' : 'Sao chép thông tin'}
                </Button>
                {successInfo.token && (
                  <Button
                    type="button"
                    variant="gold"
                    size="sm"
                    onClick={() => handleDirectLogin(successInfo.token, successInfo.role)}
                    className="flex-1 text-xs h-10 rounded-xl"
                  >
                    <LogIn className="w-3.5 h-3.5 mr-1" /> Đăng nhập ngay
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Danh Sách Tài Khoản Trong DB (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card className="rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#27303F] bg-[#161B22]/90 backdrop-blur-md flex flex-col">
            {/* Header danh sách & Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="font-headline font-bold text-base text-white">
                    Danh Sách Tài Khoản ({accounts.length})
                  </h2>
                  <span className="text-[11px] text-zinc-400">Dữ liệu thực tế trong SQLite</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchAccounts}
                isLoading={isLoadingAccounts}
                className="bg-zinc-900 border-zinc-700 text-zinc-300 text-xs h-9 rounded-xl hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Làm mới
              </Button>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-2.5 text-center">
                <span className="text-[11px] text-zinc-400 block">👨 Nam</span>
                <span className="text-base font-black font-headline text-red-400">{maleCount}</span>
              </div>
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-2.5 text-center">
                <span className="text-[11px] text-zinc-400 block">👩 Nữ</span>
                <span className="text-base font-black font-headline text-rose-400">{femaleCount}</span>
              </div>
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-2.5 text-center">
                <span className="text-[11px] text-zinc-400 block">👑 Admin</span>
                <span className="text-base font-black font-headline text-amber-400">{adminCount}</span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Tìm theo tên hoặc mã tài khoản..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  className="bg-zinc-900/80 border-zinc-700 text-xs h-10 py-0"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as any)}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="ALL">Mọi giới tính</option>
                  <option value="MALE">Chỉ Nam</option>
                  <option value="FEMALE">Chỉ Nữ</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="ALL">Mọi vai trò</option>
                  <option value="PLAYER">Player</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            {/* Table or Cards List */}
            <div className="flex-1 overflow-y-auto max-h-[500px] rounded-2xl border border-zinc-800/80 divide-y divide-zinc-800/60 bg-zinc-900/40">
              {isLoadingAccounts ? (
                <div className="py-12 text-center text-xs text-zinc-500 flex flex-col items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-zinc-400" />
                  <span>Đang tải danh sách tài khoản...</span>
                </div>
              ) : filteredAccounts.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500">
                  Không tìm thấy tài khoản phù hợp với điều kiện tìm kiếm.
                </div>
              ) : (
                filteredAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          account.role === 'ADMIN'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : account.gender === 'FEMALE'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {account.gender === 'FEMALE' ? '👩' : account.role === 'ADMIN' ? '👑' : '👨'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-white truncate">
                            {account.fullName}
                          </span>
                          {account.role === 'ADMIN' && (
                            <Badge variant="gold" className="text-[9px] px-1.5 py-0">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
                          <span>ID: {account.username}</span>
                          <span>•</span>
                          <span>{account.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                          {account.votesCount > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400">{account.votesCount} lượt vote</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Nút xóa (chỉ hiển thị nếu không phải admin mặc định) */}
                      {account.username !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(account.id, account.fullName, account.username)}
                          disabled={deletingId === account.id}
                          className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-colors disabled:opacity-50 cursor-pointer"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 text-right text-[11px] text-zinc-500">
              Hiển thị {filteredAccounts.length} / {accounts.length} tài khoản
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="w-full max-w-5xl text-center text-xs text-zinc-500 mt-8 relative z-10 border-t border-zinc-900 pt-4">
        <span>Astar 20/10 Portal • Đường dẫn bảo mật: </span>
        <code className="text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded font-mono">/secret-register</code>
        <span className="ml-2">• Vui lòng không chia sẻ liên kết này ra ngoài ban tổ chức.</span>
      </div>
    </div>
  );
}
