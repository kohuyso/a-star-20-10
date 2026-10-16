import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

export interface RevealPhotoCardProps {
  photoUrl: string;
  questionNumber: number;
  femaleName: string;
  femaleHint?: string | null;
  revealedFemale: boolean;
  onRevealFemale: () => void;
}

export function RevealPhotoCard({
  photoUrl,
  questionNumber,
  femaleName,
  femaleHint,
  revealedFemale,
  onRevealFemale,
}: RevealPhotoCardProps) {
  return (
    <div className="lg:col-span-5 flex flex-col items-center">
      <div className="relative w-full max-w-md h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-800 bg-zinc-950 flex items-center justify-center p-3 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt="Ảnh thử thách"
          className={`max-w-full max-h-full w-auto h-auto object-contain select-none transition-all duration-500 rounded-2xl ${
            !revealedFemale ? 'brightness-95 contrast-105' : 'brightness-100'
          }`}
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-black border border-white/10">
          ẢNH THỬ THÁCH #{questionNumber}
        </div>

        {!revealedFemale && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
            <div className="flex items-center gap-2 text-amber-400">
              <HelpCircle className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-extrabold tracking-wider uppercase">
                DANH TÍNH BÍ ẨN
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Female Identity Box (Hidden vs Revealed) */}
      <div className="mt-4 w-full max-w-sm text-center">
        {!revealedFemale ? (
          <div className="bg-zinc-900/80 border border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
              BƯỚC 1: XÁC ĐỊNH BẠN NỮ
            </span>
            <button
              type="button"
              onClick={onRevealFemale}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-headline font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-zinc-950" />
              <span>LẬT MỞ DANH TÍNH BẠN NỮ</span>
            </button>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-300 bg-zinc-900/80 border border-red-600/40 rounded-2xl p-4 shadow-xl">
            <span className="text-[11px] uppercase tracking-widest text-red-400 font-bold">
              🌸 DANH TÍNH CHÍNH XÁC
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl font-black text-white mt-0.5">
              {femaleName}
            </h2>
            {femaleHint && (
              <p className="text-xs text-amber-300/90 italic mt-1 bg-zinc-950/60 py-1 px-3 rounded-lg border border-zinc-800">
                &ldquo;{femaleHint}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
