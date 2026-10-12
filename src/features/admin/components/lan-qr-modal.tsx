import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export interface LanQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkInfo: { ip: string; port: number; joinUrl: string } | null;
}

export function LanQrModal({ isOpen, onClose, networkInfo }: LanQrModalProps) {
  if (!isOpen || !networkInfo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#161B26] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#27303F] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <h3 className="font-headline text-lg font-bold text-white mb-1">
          Quét Mã Để Vào Phòng Đấu
        </h3>
        <p className="text-xs text-zinc-400 mb-5">
          Đảm bảo điện thoại người chơi kết nối cùng mạng Wi-Fi LAN với laptop chủ.
        </p>

        <div className="p-4 bg-white rounded-2xl shadow-inner border border-zinc-200 mb-4">
          <QRCodeSVG value={networkInfo.joinUrl} size={190} level="M" />
        </div>

        <div className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 mb-4 truncate select-all">
          {networkInfo.joinUrl}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition-colors cursor-pointer border border-zinc-700"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
