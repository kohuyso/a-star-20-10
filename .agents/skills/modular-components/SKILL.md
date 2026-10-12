---
name: modular-components
description: Architecture principles for component decomposition, reusability of existing design primitives, and feature-driven folder organization for Astar 20/10.
---

# Modular Components & Feature-Driven UI Skill

## 1. Mục Đích & Triết Lý Cốt Lõi
Skill này thiết lập quy chuẩn kiến trúc giao diện bắt buộc cho toàn bộ dự án Astar 20/10:
- **Luôn chia nhỏ Component (Component Decomposition)**: Tuyệt đối không viết các file Page nguyên khối (monolithic) dài hàng nghìn dòng. Mỗi file component chỉ đảm nhận một trách nhiệm duy nhất (Single Responsibility Principle), độ dài lý tưởng `< 150-200 dòng`.
- **Tái sử dụng Component có sẵn (Reusability First)**: Trước khi tạo UI mới, luôn kiểm tra và tái sử dụng các components trong `src/components/ui` và `src/components/shared`. Không lặp lại mã HTML hoặc class Tailwind thủ công.
- **Tổ chức theo Features (Feature-Driven Architecture)**: Gom nhóm các components, hooks, types và helpers có liên quan chặt chẽ vào thư mục tính năng tương ứng (`src/features/<feature>/`).
- **Page Orchestrator Pattern**: File `page.tsx` chỉ đóng vai trò "nhạc trưởng" lắp ráp các feature components, không chứa inline JSX phức tạp.

---

## 2. Mô Hình Phân Tầng Component (3-Tier Component Hierarchy)

```
src/
├── components/
│   ├── ui/                          # TIER 1: Design Primitives (Phi nghiệp vụ)
│   │   ├── button.tsx               # Nút bấm đa biến thể (Primary, Secondary, Gold, Outline)
│   │   ├── card.tsx                 # Khung thẻ nền sáng / tối (Crimson Card)
│   │   ├── badge.tsx                # Nhãn trạng thái (Active, Pending, Success, Closed)
│   │   ├── modal.tsx                # Hộp thoại xác nhận / popup
│   │   ├── input.tsx                # Ô nhập liệu có icon và thông báo lỗi
│   │   └── progress-bar.tsx         # Thanh tiến độ phần trăm
│   └── shared/                      # TIER 2: Shared Domain Components (Dùng chung cho sự kiện)
│       ├── tactical-portrait.tsx    # Khung ảnh 4 góc L-shaped đỏ đặc trưng Astar
│       ├── header-brand.tsx         # Thanh điều hướng thương hiệu Astar 20/10
│       ├── countdown-timer.tsx      # Bộ đếm ngược thời gian tròn / gauge
│       └── lan-qr-code.tsx          # Mã QR kết nối Wi-Fi nội bộ
│
├── features/                        # TIER 3: Feature-Specific Modules (Theo miền nghiệp vụ)
│   ├── auth/                        # Tính năng Đăng nhập & Xác thực
│   │   ├── components/              # LoginForm, BirthdayInput, SecurityBanner
│   │   ├── hooks/                   # useAuth
│   │   └── types/                   # AuthState, LoginCredentials
│   ├── voting/                      # Tính năng Bỏ phiếu Mobile (/vote)
│   │   ├── components/              # CandidateList, CandidateOptionRow, StickyActionDeck
│   │   ├── hooks/                   # useVoteSession, useCandidateFilter
│   │   └── types/                   # VoteProgress, RemainingCandidates
│   ├── presentation/                # Tính năng Chiếu máy chiếu (/slideshow, /results)
│   │   ├── components/              # SlideViewer, RevealCard, WinnerHighlight, ConfettiBurst
│   │   ├── hooks/                   # useSlideSync, useRevealRounds
│   │   └── types/                   # SlideState, RevealRound
│   └── admin/                       # Tính năng Bảng điều khiển Master (/admin)
│       ├── components/              # StateControlPanel, QuestionBroadcaster, RosterTable
│       ├── hooks/                   # useAdminOperations, useLiveRoster
│       └── types/                   # RosterItem, AdminGameState
│
└── app/                             # TIER 4: App Router Pages (Chỉ Orchestrate)
    ├── (auth)/login/page.tsx        # Lắp ráp: HeaderBrand + LoginForm
    ├── (player)/vote/page.tsx       # Lắp ráp: TacticalPortrait + CandidateList + StickyActionDeck
    ├── (presentation)/slideshow/    # Lắp ráp: SlideViewer + SlideTimerGauge
    ├── (presentation)/results/      # Lắp ráp: RevealCard + WinnerHighlight + ConfettiBurst
    └── admin/page.tsx               # Lắp ráp: StateControlPanel + QuestionBroadcaster + RosterTable
```

---

## 3. Quy Tắc & Tiêu Chí Phân Rã (Decomposition Guidelines)

### 3.1. Khi nào BẮT BUỘC phải tách Component?
Tách ngay một đoạn JSX thành sub-component độc lập khi:
1. **File vượt quá 180 dòng code**: Cần rà soát và tách các section con (ví dụ: Modal, Header, List Item, Footer Action Deck).
2. **Có logic state độc lập**: Một component có timer riêng, form validation riêng, hoặc animation riêng nên được cô lập để tránh re-render cả trang.
3. **Mẫu UI xuất hiện từ 2 lần trở lên**: Ví dụ `CandidateOptionRow` xuất hiện 14 lần cho 14 ứng viên $\rightarrow$ tách thành component riêng.
4. **Các phần giao diện có thể kiểm thử đơn vị hoặc tái sử dụng**: Button, Input, Modal, Badge.

### 3.2. Quy Chuẩn Đặt Tên & Định Dạng File
- **Tên file:** Kebab-case (chữ thường nối gạch ngang): `tactical-portrait.tsx`, `candidate-option.tsx`, `roster-table.tsx`.
- **Tên Component:** PascalCase khớp với tên file: `TacticalPortrait`, `CandidateOption`, `RosterTable`.
- **Named Exports:** Luôn sử dụng `export function ComponentName(...)`, không dùng `export default` cho các sub-components (trừ các file `page.tsx` của Next.js).
- **Props Interface:** Định nghĩa interface rõ ràng ngay phía trên component hoặc trong file `types`:
  ```typescript
  export interface CandidateOptionProps {
    name: string;
    isSelected: boolean;
    disabled?: boolean;
    onSelect: () => void;
  }
  ```

---

## 4. Danh Mục Component Mẫu Chuẩn

### 4.1. Design Primitive: `Button` (`src/components/ui/button.tsx`)
```tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const variants = {
    primary: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-md shadow-red-500/20',
    secondary: 'bg-[#991B1B] hover:bg-[#7F1D1D] text-white',
    gold: 'bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-md shadow-amber-500/20',
    outline: 'border-2 border-slate-200 hover:border-slate-300 text-slate-700 bg-white',
    ghost: 'hover:bg-slate-100 text-slate-600',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2.5 h-11 gap-2',
    lg: 'text-base px-6 py-3.5 h-13 gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
```

### 4.2. Shared Domain Component: `TacticalPortrait` (`src/components/shared/tactical-portrait.tsx`)
```tsx
import React from 'react';

export interface TacticalPortraitProps {
  src: string;
  alt: string;
  tagText?: string;
  className?: string;
}

export function TacticalPortrait({ src, alt, tagText, className = '' }: TacticalPortraitProps) {
  return (
    <div className={`relative w-full max-w-[340px] mx-auto aspect-[4/5] rounded-[20px] bg-white shadow-md overflow-hidden p-2 flex flex-col justify-end ${className}`}>
      {/* 4 Góc L-shaped đỏ nhận diện Crimson Arena */}
      <svg className="absolute top-3.5 left-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 16 16"><path d="M1 11V1H11" /></svg>
      <svg className="absolute top-3.5 right-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 16 16"><path d="M5 1H15V11" /></svg>
      <svg className="absolute bottom-3.5 left-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 16 16"><path d="M1 5V15H11" /></svg>
      <svg className="absolute bottom-3.5 right-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 16 16"><path d="M5 15H15V5" /></svg>

      <img src={src} alt={alt} className="w-full h-full object-cover rounded-[16px]" />

      {tagText && (
        <div className="absolute inset-x-2 bottom-2 h-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-b-[16px] pointer-events-none flex items-end px-3 py-2.5">
          <span className="text-white text-xs font-bold tracking-wide">{tagText}</span>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Quy Trình Làm Việc Khi Xây Dựng UI Mới (Workflow Checklist)

1. **Bước 1: Rà soát kho tái sử dụng (Reusability Check)**
   - Kiểm tra `src/components/ui/` xem đã có Primitive cần dùng chưa (Button, Card, Input...).
   - Kiểm tra `src/components/shared/` xem có Component Domain phù hợp không (Portrait, Timer, Header...).
2. **Bước 2: Phân loại phạm vi Component**
   - Nếu dùng chung toàn app $\rightarrow$ Đặt vào `src/components/ui/` hoặc `src/components/shared/`.
   - Nếu chỉ phục vụ 1 tính năng cụ thể $\rightarrow$ Đặt vào `src/features/<feature>/components/`.
3. **Bước 3: Tách nhỏ & Đóng gói**
   - Tách từng khối chức năng thành file riêng.
   - Viết interface props rõ ràng, không hard-code dữ liệu nghiệp vụ vào component dùng chung.
4. **Bước 4: Lắp ráp tại `page.tsx`**
   - File trang chỉ import và điều phối luồng dữ liệu (State / Server Actions) xuống các components con.
