# Astar 20/10 – Triển Khai Mạng Nội Bộ (LAN/Wi-Fi) & Checklist (Epic F)

## 1. Cơ Chế Kết Nối Cục Bộ (Local Area Network)

Hệ thống được thiết kế để chạy hoàn toàn offline / on-premises trên laptop của Admin mà không cần server cloud:

```
[ Laptop Admin / MC ]  <---> [ Wi-Fi Access Point ] <---> [ 20-30 Điện thoại người chơi ]
 (Next.js + SQLite :3000)                                   (Truy cập http://192.168.x.x:3000)
```

## 2. Checklist Trước Giờ G (Pre-flight Checklist)

- [ ] **1. Xác định địa chỉ IP tĩnh / LAN của Laptop**:
  - macOS: `ipconfig getifaddr en0` (hoặc `en1`).
  - Ví dụ: `http://192.168.1.15:3000`.
- [ ] **2. Tắt hoặc Cấu hình Firewall & Cấu hình Next.js Dev Server**:
  - Đảm bảo macOS Firewall cho phép Incoming connections vào cổng 3000 (Node.js).
  - File `next.config.ts` đã được cấu hình `allowedDevOrigins` và `experimental.serverActions.allowedOrigins` để tránh Next.js 16 chặn 403 Forbidden các JS bundle/WebSocket qua LAN IP.
- [ ] **3. Kiểm tra tính năng Client Isolation (AP Isolation) của Router Wi-Fi**:
  - Đảm bảo các thiết bị cùng mạng Wi-Fi có thể ping và kết nối trực tiếp đến IP của laptop.
- [ ] **4. Test thử nghiệm thiết bị thật (Smoke Test)**:
  - Dùng ít nhất 2 điện thoại khác nhau (iOS & Android) quét mã QR trên màn hình admin để vào trang `/login`.
- [ ] **5. Backup Database SQLite**:
  - File database lưu tại `prisma/dev.db` có thể copy lưu trữ bất kỳ lúc nào.

