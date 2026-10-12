import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  label?: string;
}

export function Input({ icon, error, label, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="font-headline text-xs font-bold text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3.5 text-zinc-400 pointer-events-none">{icon}</div>}
        <input
          id={id}
          className={twMerge(
            clsx(
              'w-full py-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent transition-all',
              icon ? 'pl-10 pr-4' : 'px-4',
              error && 'border-red-500 focus:ring-red-500',
              className
            )
          )}
          {...props}
        />
      </div>
      {error && <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">{error}</span>}
    </div>
  );
}
