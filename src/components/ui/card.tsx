import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark' | 'glow-red' | 'glow-gold';
}

export function Card({ children, variant = 'default', className, ...props }: CardProps) {
  const variants = {
    default:
      'bg-[#161B26] border border-[#27303F] text-[#F8FAFC] shadow-xl rounded-3xl p-5',
    dark:
      'bg-[#161B26] border border-[#27303F] text-[#F8FAFC] shadow-xl rounded-3xl p-5',
    'glow-red':
      'bg-[#161B26] border border-red-500/40 text-[#F8FAFC] shadow-lg shadow-red-500/15 rounded-3xl p-5',
    'glow-gold':
      'bg-[#161B26] border border-amber-500/40 text-[#F8FAFC] shadow-lg shadow-amber-500/15 rounded-3xl p-5',
  };

  return (
    <div className={twMerge(clsx('transition-all', variants[variant], className))} {...props}>
      {children}
    </div>
  );
}
