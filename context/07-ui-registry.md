# Crimson Arena – Design System & UI Registry

Hệ thống thiết kế giao diện **Crimson Arena** cho sự kiện Astar 20/10:

## 1. Bảng Màu Design Tokens (CSS Tokens)

```css
:root {
  /* Brand Crimson Palette */
  --primary: #DC2626;               /* Đỏ Crimson chủ đạo */
  --primary-container: #DC2626;
  --primary-hover: #B91C1C;
  --primary-dark: #991B1B;
  --primary-fixed: #FFDAD6;
  --on-primary-fixed: #410002;

  /* Secondary Burgundy Palette */
  --secondary: #991B1B;
  --secondary-container: #FF665C;
  --secondary-fixed: #FFDAD6;
  --on-secondary-fixed: #410002;

  /* Tertiary Golden Amber (Trao quà & Vinh danh) */
  --tertiary: #F59E0B;
  --tertiary-container: #A06500;
  --on-tertiary-container: #FFF7F1;
  --tertiary-fixed: #FFDDB8;
  --tertiary-fixed-dim: #FFB95F;

  /* Surface & Background Palette */
  --surface: #F9F9FF;
  --surface-container-lowest: #FFFFFF;
  --surface-container-low: #F0F3FF;
  --surface-container: #EAEEFA;
  --surface-container-high: #E4E8F4;
  --surface-container-highest: #DEE2EF;
  --surface-dim: #D6DAE6;

  /* Neutral Dark & Outline */
  --on-surface: #171C24;
  --on-surface-variant: #5C403C;
  --outline: #916F6B;
  --outline-variant: #E6BDB8;
  --inverse-surface: #2C313A;
  --inverse-on-surface: #ECF0FD;
}
```

---

## 2. Typography & Phông Chữ

- **Headlines, Display, Labels & Metrics:** `Plus Jakarta Sans`, sans-serif (Font-weight: 600, 700, 800)
- **Body Text & Ghi Chú:** `Inter`, sans-serif (Font-weight: 400, 500, 600)

---

## 3. Bản Đồ Giao Diện & UI Components Chuẩn

| Trang / Màn Hình | File Thiết Kế Mẫu | Component Đặc Trưng |
| :--- | :--- | :--- |
| **Đăng nhập (`/login`)** | [`design/sign-in.html`](file:///Users/Astar/Node/astar_20_10/design/sign-in.html) | • Biểu tượng Ngôi sao Đỏ nổi bật<br>• Input ngày sinh DDMM kèm icon hiện/ẩn<br>• Banner báo lỗi sai tên/mật khẩu<br>• Thẻ bảo đảm minh bạch |
| **Bình chọn (`/vote`)** | [`design/voting.html`](file:///Users/Astar/Node/astar_20_10/design/voting.html) | • Khung ảnh chân dung **4 góc L-shaped đỏ**<br>• Danh sách radio chọn tên bo tròn 12px<br>• Thanh tiến độ mỏng đỏ (CÂU 5/14)<br>• Sticky Action Deck bám đáy ngón cái |
| **Quản trị (`/admin`)** | [`design/manage.html`](file:///Users/Astar/Node/astar_20_10/design/manage.html) | • Stepper 4 bước có đường line kết nối<br>• Nút mở/đóng vote to bản có bóng đỏ<br>• Grid 3 cột chỉ số (Đã nộp, Đang làm, Chưa vào)<br>• Modal xác nhận Reset an toàn |
| **Công bố (`/results`)** | [`design/result.html`](file:///Users/Astar/Node/astar_20_10/design/result.html) | • Pill hiển thị Vòng 4/14<br>• Thẻ vinh danh người trao quà màu vàng kim<br>• Bảng xếp hạng tốc độ (#1 Nhanh nhất)<br>• Stepper 14 chấm tròn bám đáy |
