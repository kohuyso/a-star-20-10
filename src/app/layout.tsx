import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-headline',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Astar 20/10 – Chinh Phục Thử Thách & Tặng Quà Phái Đẹp',
  description: 'Mini-game đoán hình ảnh 14 bạn nữ và trao quà sự kiện 20/10 công ty Astar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${inter.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0F1218] text-[#F8FAFC] font-body selection:bg-[#DC2626] selection:text-white">
        {children}
      </body>
    </html>
  );
}
