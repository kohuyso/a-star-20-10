import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface LoginFormProps {
  username: string;
  onChangeUsername: (value: string) => void;
  password: string;
  onChangePassword: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
}

export function LoginForm({
  username,
  onChangeUsername,
  password,
  onChangePassword,
  onSubmit,
  isLoading,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Username Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="usernameInput"
          className="font-headline text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
        >
          <span>TÀI KHOẢN / HỌ VÀ TÊN</span>
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
            <User className="w-4 h-4" />
          </div>
          <input
            id="usernameInput"
            name="username"
            type="text"
            value={username}
            onChange={(e) => onChangeUsername(e.target.value)}
            placeholder="Nhập họ và tên hoặc tài khoản..."
            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition-all"
            autoComplete="username"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="passwordInput"
          className="font-headline text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
        >
          <span>MẬT KHẨU</span>
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="passwordInput"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            placeholder="Nhập mật khẩu..."
            className="w-full pl-10 pr-11 py-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition-all"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            title="Hiện/Ẩn mật khẩu"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button (Reusing Button Primitive) */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="mt-2 w-full py-3.5 rounded-2xl"
      >
        <span>VÀO PHÒNG ĐẤU</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </form>
  );
}
