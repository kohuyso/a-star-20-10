---
name: theme-token-guard
description: Strict design token guidelines, Tailwind CSS v4 dark mode configuration, contrast safety, and anti-hardcoding color rules for Astar 20/10.
---

# Theme Token Guard Skill

## 1. Mục Đích & Nguyên Nhân Gốc Rễ (Root Cause)
Skill này sinh ra để triệt tiêu vĩnh viễn lỗi **Hardcoded Color Conflicts** & **Mất tương phản (Chữ trắng trên nền trắng hoặc chữ tối trên nền tối)**:
- **Nguyên nhân gốc rễ**: Khi sử dụng Tailwind CSS v4 (`@import "tailwindcss";`), chế độ dark mode mặc định chạy theo Media Query hệ điều hành `(prefers-color-scheme: dark)`. Nếu component hardcode màu chắp vá (ví dụ: Card có nền trắng `#FFFFFF` nhưng phần tử con lại có class `dark:text-white`), trên các thiết bị bật Dark Mode, toàn bộ chữ, số liệu và tiêu đề sẽ bị biến thành màu trắng trên nền thẻ trắng $\rightarrow$ **Nội dung bị tàng hình hoàn toàn**.
- **Mục tiêu của Skill**:
  1. Chuẩn hóa cấu hình Dark Mode chuẩn trong Tailwind CSS v4 (`@custom-variant dark`).
  2. Bắt buộc sử dụng Semantic Design Tokens thay vì mã màu ad-hoc / hex rời rạc.
  3. Đảm bảo quy tắc **Tương Phản Màu An Toàn (Contrast Safety)** trên 100% màn hình.

---

## 2. Cấu Hình Tailwind CSS v4 Dark Mode Bắt Buộc

Trong `src/app/globals.css`, BẮT BUỘC phải cấu hình class-based dark variant:
```css
@import "tailwindcss";

/* Kích hoạt chế độ Dark Mode theo class .dark trên thẻ cha/container */
@custom-variant dark (&:where(.dark, .dark *));
```

> [!CRITICAL]
> Nếu không có `@custom-variant dark (&:where(.dark, .dark *));`, Tailwind CSS v4 sẽ tự động kích hoạt `dark:*` khi hệ điều hành người dùng bật Dark Mode, làm vỡ hoàn toàn giao diện thẻ sáng!

---

## 3. Hệ Thống Semantic Design Tokens (`globals.css`)

Mọi màu sắc phải xuất phát từ CSS Variables ngữ nghĩa, tự động đổi giá trị tương phản đồng bộ giữa chế độ Sáng (Light) và Tối (Dark):

```css
:root {
  /* Surface & Page Background (Crimson Arena Dark Default) */
  --bg-page: #0F1218;
  --bg-card: #161B26;
  --bg-card-subtle: #1F2633;
  --border-card: #27303F;

  /* Typography Text Tokens */
  --text-main: #F8FAFC;       /* Chữ sáng nổi bật trên nền tối */
  --text-muted: #94A3B8;      /* Chữ phụ sáng dịu */
  --text-inverse: #0F172A;

  /* Brand Crimson Arena */
  --primary: #DC2626;
  --primary-hover: #B91C1C;
  --primary-dark: #991B1B;
  --primary-subtle: rgba(220, 38, 38, 0.18);
  --on-primary-subtle: #FCA5A5;

  /* Tertiary Golden Amber (Trao quà D4) */
  --tertiary: #F59E0B;
  --tertiary-hover: #D97706;
  --tertiary-dark: #B45309;
  --tertiary-subtle: rgba(245, 158, 11, 0.18);
  --on-tertiary-subtle: #FCD34D;
}

.dark {
  --bg-page: #0F1218;
  --bg-card: #161B26;
  --bg-card-subtle: #1F2633;
  --border-card: #27303F;

  --text-main: #F8FAFC;
  --text-muted: #94A3B8;
  --text-inverse: #0F172A;

  --primary-subtle: rgba(220, 38, 38, 0.18);
  --on-primary-subtle: #FCA5A5;
  --tertiary-subtle: rgba(245, 158, 11, 0.18);
  --on-tertiary-subtle: #FCD34D;
}
```

> [!IMPORTANT]
> **Đồng bộ hóa Root Layout**: Thẻ `<html className="... dark ...">` trong `src/app/layout.tsx` và biến `:root` bắt buộc phải là chế độ Dark Arena mặc định. Điều này đảm bảo rằng dù trình duyệt hay hệ điều hành bật/tắt Dark Mode, nền trang (`--bg-page`) và nền thẻ (`--bg-card`) luôn đồng bộ 100%, không bao giờ xuất hiện tình trạng lọt viền nền trắng hay thẻ tối lạc lõng trên nền sáng.


---

## 4. Các Quy Tắc Vàng Chống Lỗi Giao Diện (Anti-Patterns Checklist)

### 4.1. Quy tắc Khối Thẻ (Card Isolation Rule)
- Khi dùng `.crimson-card` hoặc `Card` component, thẻ **tự động mang `--bg-card` và chữ `--text-main`**.
- ❌ **CẤM:** Viết `className="crimson-card ... text-zinc-900 dark:text-white"`.
- ✅ **ĐÚNG:** Viết `className="crimson-card ... text-[var(--text-main)]"`, hoặc để Card tự thừa kế màu chữ chính.

### 4.2. Quy tắc Phân Định Màn Hình (Screen Theming Strategy)
1. **Màn hình Máy Chiếu Hội Trường (`/slideshow`, `/results`)**:
   - Luôn luôn đặt `className="dark bg-[#0A0D14] text-white ..."` ngay tại thẻ root của trang.
   - Các màn hình này cố định giao diện tối sân khấu để pháo hoa, ảnh chân dung và cúp vàng hiển thị rực rỡ nhất trên máy chiếu 1080p/4K.
2. **Màn hình Quản Trị & Người Chơi (`/admin`, `/login`, `/vote`)**:
   - Sử dụng hệ thống thẻ Crimson Arena sạch sẽ, đồng bộ.
   - Mọi container thẻ, bảng biểu và cột danh sách phải đổi màu **cả nền lẫn chữ** tương phản cùng lúc.

### 4.3. Quy tắc Nút Bấm & Badge Trạng Thái
- Không dùng cặp màu có độ tương phản kém (như chữ vàng `text-amber-400` trên nền vàng nhạt `bg-amber-50`).
- ✅ **ĐÚNG:**
  - Nút Amber: Nền `bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800`.
  - Nút Red: Nền `bg-red-100 text-red-900 border border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800`.
  - Nút Chọn số câu 1-14: Nền `bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700`.

---

## 5. Danh Mục Kiểm Tra Nhanh Trước Khi Hoàn Thành Code (PR Review)
- [ ] Không có bất kỳ thẻ con nào mang `dark:text-white` nằm trong thẻ cha có nền trắng cứng `bg-white`.
- [ ] File `globals.css` đã có `@custom-variant dark (&:where(.dark, .dark *));`.
- [ ] Các con số thống kê (Metrics Counter) luôn đọc được rõ ràng ở cả 2 chế độ sáng và tối.
- [ ] Bảng dữ liệu người chơi (Roster Table) hiển thị rõ tên, tài khoản và thời gian nộp mà không bị mờ/tàng hình.
