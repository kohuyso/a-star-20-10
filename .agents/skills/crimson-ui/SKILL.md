---
name: crimson-ui
description: Design system tokens, layout standards, and component patterns for the Crimson Arena theme (Astar 20/10).
---

# Crimson Arena UI Skill

## 1. Mục Đích
Skill này quy chuẩn toàn bộ hệ thống giao diện **Crimson Arena**, bao gồm bảng màu tokens, typography, quy tắc bố cục Mobile-first / Projector, các hiệu ứng tương tác vi mô (micro-interactions), và danh mục UI Component chuẩn được áp dụng trên toàn bộ ứng dụng:
- **Mobile Player Views**: `/login`, `/vote`.
- **Large Screen Presentation Views**: `/slideshow`, `/results`.
- **Operations Dashboard**: `/admin`.

---

## 2. Cấu Trúc Bảng Màu & Design Tokens

### 2.1. Biến CSS & Tokens (`src/app/globals.css`)
```css
:root {
  /* Crimson Arena Theme Colors */
  --primary: #DC2626;
  --primary-hover: #B91C1C;
  --primary-dark: #991B1B;

  --secondary: #991B1B;
  --secondary-light: #EF4444;

  --tertiary: #F59E0B;
  --tertiary-hover: #D97706;
  --tertiary-dark: #B45309;

  --neutral-bg: #F3F5F9;
  --neutral-card: #FFFFFF;
  --neutral-dark: #1F242D;
  --neutral-border: #E2E8F0;
  --neutral-muted: #64748B;

  --text-main: #0F172A;
  --text-muted: #64748B;
  --text-inverse: #FFFFFF;
}
```

### 2.2. Utility Classes Tùy Biến
- `.crimson-card`: Thẻ bo góc 1.25rem với bóng đỏ viền nhẹ.
- `.crimson-card-dark`: Thẻ giao diện tối (`#181D26`) cho máy chiếu và màn hình kết quả.
- `.crimson-glow`: Hiệu ứng phát sáng đỏ chiến binh (`box-shadow: 0 0 35px -5px rgba(220, 38, 38, 0.4)`).
- `.gold-glow`: Hiệu ứng ánh vàng hoàng kim vinh danh (`box-shadow: 0 0 35px -5px rgba(245, 158, 11, 0.45)`).

---

## 3. Quy Chuẩn Typography & Phông Chữ

| Phông chữ | Nhóm áp dụng | Trọng số (Weight) | Lớp CSS (Tailwind) |
| :--- | :--- | :--- | :--- |
| **Plus Jakarta Sans** | Tiêu đề lớn, Tên ứng viên, Nhãn nút CTA, Số liệu đếm | Bold (700), ExtraBold (800) | `font-headline font-bold` |
| **Inter** | Nội dung mô tả, Gợi ý hint, Thẻ trạng thái, Hướng dẫn | Regular (400), Medium (500) | `font-body font-normal` |

---

## 4. Danh Mục Component Tái Sử Dụng (Core UI Patterns)

### 4.1. Khung Ảnh Chân Dung Tactical (L-Shaped Corner Portrait)
Áp dụng cho màn hình `/vote` và `/results`:
```tsx
export function TacticalPortrait({ src, alt, tagText }: { src: string; alt: string; tagText?: string }) {
  return (
    <div className="relative w-full max-w-[340px] mx-auto aspect-[4/5] rounded-[20px] bg-white shadow-md overflow-hidden p-2 flex flex-col justify-end">
      {/* 4 Góc L-shaped màu đỏ đặc trưng */}
      <svg className="absolute top-3.5 left-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 16 16"><path d="M1 11V1H11" /></svg>
      <svg className="absolute top-3.5 right-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 16 16"><path d="M5 1H15V11" /></svg>
      <svg className="absolute bottom-3.5 left-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 16 16"><path d="M1 5V15H11" /></svg>
      <svg className="absolute bottom-3.5 right-3.5 w-4 h-4 pointer-events-none text-[#DC2626] z-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 16 16"><path d="M5 15H15V5" /></svg>
      
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-[16px]" />
      
      {tagText && (
        <div className="absolute inset-x-2 bottom-2 h-20 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-b-[16px] pointer-events-none flex items-end px-3 py-2.5">
          <span className="text-white text-xs font-semibold">{tagText}</span>
        </div>
      )}
    </div>
  );
}
```

### 4.2. Hàng Chọn Tên Ứng Viên Bình Chọn (Candidate Option Row)
Trạng thái Active và Default có viền đỏ nhẹ, radio check và icon checkmark mượt mà:
```tsx
export function CandidateOption({ name, isSelected, onSelect }: { name: string; isSelected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex items-center justify-between w-full min-h-[54px] px-4 py-3 rounded-[12px] text-left transition-all active:scale-[0.98] ${
        isSelected ? 'bg-red-500/10 border border-red-500/30 shadow-sm' : 'bg-[#F0F3FF] shadow-none hover:bg-slate-100'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${isSelected ? 'bg-[#DC2626] shadow-sm' : 'bg-slate-200'}`}>
          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
        </div>
        <span className={`font-semibold text-sm truncate ${isSelected ? 'text-[#DC2626]' : 'text-slate-800'}`}>{name}</span>
      </div>
      {isSelected && <span className="text-[#DC2626] text-lg font-bold">✓</span>}
    </button>
  );
}
```

### 4.3. Thẻ Thông Báo Trao Quà (Golden Winner Banner)
Dành cho màn hình vinh danh MC `/results`:
```tsx
export function WinnerBanner({ winnerName, reason }: { winnerName: string; reason: string }) {
  return (
    <div className="w-full bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 relative overflow-hidden backdrop-blur-md">
      <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md text-xl">
        🎁
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-amber-950 dark:text-white text-base truncate">Mời {winnerName} lên tặng quà</h4>
        <p className="text-xs text-amber-700 dark:text-amber-300 truncate">{reason}</p>
      </div>
    </div>
  );
}
```

### 4.4. Thanh Điều Hướng Dính Đáy Mobile (Sticky Action Deck)
Tối ưu hóa tầm với của ngón cái trên màn hình di động:
```tsx
export function StickyActionDeck({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-5 pb-6 pt-3 bg-white/90 backdrop-blur-md shadow-2xl flex flex-col items-center border-t border-slate-100">
      {children}
    </div>
  );
}
```

---

## 5. Quy Tắc Trải Nghiệm & Safe Area (Mobile UX Guidelines)
1. **Khóa cuộn ngang & Overscroll bounce:** Mọi trang mobile đều có `overscroll-behavior-y: none;` để tránh bị giật khung nhìn khi vuốt.
2. **Safe Area Insets:** Luôn hỗ trợ `pt-safe` và `pb-safe` để tránh cấn tai thỏ / thanh điều hướng trên iPhone.
3. **Phản hồi xúc giác (Visual Feedback):** Mọi nút bấm khi chạm đều có hiệu ứng thu nhỏ nhẹ (`active:scale-[0.98]`).

---

## 6. Quy Tắc Phân Rã & Tái Sử Dụng Component
Mọi thiết kế và triển khai giao diện BẮT BUỘC tuân thủ các nguyên tắc tại [`.agents/skills/modular-components/SKILL.md`](file:///Users/Astar/Node/astar_20_10/.agents/skills/modular-components/SKILL.md):
1. **Luôn chia nhỏ component (Single Responsibility)**: Tách các section con (Card, Form, Header, Action Deck) thành các file riêng biệt, không viết file Page quá dài (> 180 dòng).
2. **Ưu tiên tái sử dụng (Reusability First)**: Sử dụng các Primitives có sẵn trong `src/components/ui/` (`Button`, `Card`, `Badge`) và Shared Domain trong `src/components/shared/` (`TacticalPortrait`). Không duplicate mã JSX/Tailwind thủ công.
3. **Tổ chức theo Features**: Chia components chuyên biệt theo miền nghiệp vụ tương ứng (`src/features/voting/`, `src/features/presentation/`, `src/features/admin/`, `src/features/auth/`).
