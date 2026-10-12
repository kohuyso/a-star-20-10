import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'neutral' | 'success';
}

export function Badge({ children, variant = 'primary', className, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-headline select-none';

  const variants = {
    primary: 'bg-red-100 text-red-700 border border-red-200',
    secondary: 'bg-rose-100 text-rose-800 border border-rose-200',
    gold: 'bg-amber-100 text-amber-800 border border-amber-300',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </span>
  );
}
