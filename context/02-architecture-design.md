# Astar 20/10 – Kiến Trúc Hệ Thống (Architecture Design)

## 1. Mô Hình Tổng Thể

```
+---------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                    |
|   +-------------------+  +-------------------+  +----------------------------+  |
|   | Mobile Player UI  |  | Large Screen / MC |  | Admin Operations Dashboard |  |
|   | (/login, /vote)   |  | (/slideshow,      |  | (/admin)                   |  |
|   |                   |  |  /results)        |  |                            |  |
|   +-------------------+  +-------------------+  +----------------------------+  |
+----------------------------------------+----------------------------------------+
                                         | Next.js App Router (HTTP / Route Handlers)
+----------------------------------------v----------------------------------------+
|                                APPLICATION LAYER                                |
|   +-------------------------------------------------------------------------+   |
|   | App Libs & Route Handlers:                                              |   |
|   | - Auth: /api/auth/login, /api/auth/me, /api/auth/logout (HttpOnly Cookie)|   |
|   | - Vote: /api/vote/progress, /api/vote/submit (Exclusion & Timestamp)    |   |
|   | - Game Engine: /api/results (Thuật toán D4, Ranking, Phân quyền)        |   |
|   | - Admin: /api/admin/state, /api/admin/roster, /api/admin/reset, network |   |
|   +-------------------------------------------------------------------------+   |
+----------------------------------------+----------------------------------------+
                                         | Prisma Client
+----------------------------------------v----------------------------------------+
|                              PERSISTENCE & STORAGE                              |
|   +-------------------------------------------------------------------------+   |
|   | SQLite Database (prisma/dev.db) - WAL Mode, Local file                  |   |
|   | Static Assets: public/photos/ (Ảnh chân dung 14 bạn nữ)                 |   |
|   +-------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------+
```

## 2. Phân Tách Trách Nhiệm Chi Tiết

- **Client Components (`'use client'`)**:
  - `src/app/(auth)/login/page.tsx`: Giao diện đăng nhập, form input, hiển thị thông báo lỗi tức thì.
  - `src/app/(player)/vote/page.tsx`: Tiến trình 14 câu hỏi Mobile-first, radio selector tên còn lại, polling trạng thái phòng đấu.
  - `src/app/(presentation)/slideshow/page.tsx`: Màn hình máy chiếu chiếu tuần tự 14 slide với timer đếm ngược 15s và phím tắt bàn phím (`Space`, `Arrows`, `H`, `F`).
  - `src/app/(presentation)/results/page.tsx`: Màn hình công bố MC, mở khóa người trao quà D4 và kích hoạt hiệu ứng pháo hoa `canvas-confetti`.
  - `src/app/admin/page.tsx`: Bảng điều khiển quản trị, pipeline chuyển trạng thái, live roster giám sát toàn bộ người chơi và modal mã QR mạng LAN.

- **Backend API & Helpers (`src/lib/`, `src/app/api/`)**:
  - `src/lib/auth.ts`: Quản lý cookie HttpOnly `astar_session`, mã hóa base64url payload, so khớp bcrypt ngày sinh.
  - `src/lib/network.ts`: Trích xuất địa chỉ IP IPv4 nội bộ mạng Wi-Fi LAN (`os.networkInterfaces()`).
  - `src/lib/game-engine.ts`: Thuật toán D4 chọn người trao quà dựa trên tốc độ và độ chính xác (5/5 Unit Tests Passed).
  - `src/lib/prisma.ts`: Prisma Client singleton kết nối SQLite database `prisma/dev.db`.

- **SQLite Database**:
  - Đảm bảo tính toàn vẹn dữ liệu cục bộ, không phụ thuộc kết nối Internet bên ngoài.
