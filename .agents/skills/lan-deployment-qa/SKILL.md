---
name: lan-deployment-qa
description: Local Wi-Fi network deployment, Next.js 16 LAN security configuration, Vitest test suite, and pre-flight QA checklist for Astar 20/10.
---

# LAN Deployment & QA Skill

## 1. Mục Đích
Skill này chuẩn hóa toàn bộ quy trình kiểm thử chất lượng phần mềm (QA) và vận hành hạ tầng mạng nội bộ Wi-Fi cục bộ (On-premises LAN Deployment) mà không cần kết nối Internet hoặc Cloud server:
- **Cấu hình Mạng LAN Wi-Fi**: Trích xuất IP máy tính host, bind cổng `0.0.0.0:3000`, xử lý chặn chéo nguồn (CORS / Cross-origin) trên Next.js 16.
- **Bảo Vệ Tường Lửa & Router**: Vượt qua cơ chế chặn AP Isolation của router Wi-Fi văn phòng và tường lửa hệ điều hành macOS.
- **Kiểm Thử Tự Động (Automated QA)**: Chạy Vitest kiểm thử 100% trường hợp biên của thuật toán D4, typecheck TypeScript không lỗi.
- **Kiểm Thử Thực Tế Thiết Bị (Device Smoke Testing)**: Quy trình xác minh tương thích trên Safari iOS và Chrome Android.
- **Sao Lưu & Khôi Phục Dữ Liệu Khẩn Cấp**: Quy trình sao lưu file database SQLite `prisma/dev.db`.

---

## 2. Kiến Trúc Mạng Cục Bộ (Local Deployment Topology)

```
                       [ BỘ PHÁT WI-FI VĂN PHÒNG ]
                        (SSID: "Astar_Event_2.4G")
                                    |
          +-------------------------+-------------------------+
          |                                                   |
[ LAPTOP ADMIN / MC ]                              [ 30-40 SMARTPHONE ]
- Host: macOS / Next.js                            - iPhone (iOS Safari)
- LAN IP: 192.168.1.15:3000                        - Android (Chrome)
- SQLite Database Local: prisma/dev.db             - Quét mã QR vào phòng
- Cắm HDMI ra Máy chiếu / TV 4K
```

---

## 3. Cấu Trúc Kiểm Thử Tự Động (Automated Testing)

### 3.1. Các Lệnh Kiểm Thử Tiêu Chuẩn
```bash
# 1. Chạy toàn bộ Unit Tests bằng Vitest
yarn test
# hoặc
yarn vitest run

# 2. Kiểm tra tính toàn vẹn kiểu dữ liệu TypeScript (Strict Typecheck)
yarn tsc --noEmit

# 3. Quét lỗi cú pháp và quy chuẩn code ESLint
yarn lint
```

### 3.2. Tiêu Chí Đánh Giá Thuật Toán D4 (`src/lib/game-engine.test.ts`)
Bộ unit test bắt buộc phải vượt qua 5/5 trường hợp:
1. `sắp xếp thứ tự công bố`: Bạn nữ có ít người đoán đúng nhất được đưa lên trước (tạo kịch tính).
2. `ưu tiên 1 (FASTEST_CORRECT)`: Chọn người đoán đúng sớm nhất tính theo timestamp server.
3. `loại trừ người đã nhận quà`: Không trao quà 2 lần cho cùng 1 người chơi nam; tự động chuyển sang người đúng nhanh kế tiếp.
4. `ưu tiên 2 (FASTEST_INCORRECT)`: Nếu không ai đoán đúng, trao cho người đoán sai sớm nhất (may mắn/an ủi).
5. `ưu tiên 3 (MANUAL)`: Khi toàn bộ người tham gia câu đó đều đã nhận quà ở câu khác, trả về trạng thái chỉ định tay cho MC.

---

## 4. Cấu Hình Hạ Tầng Mạng LAN Trên Next.js 16

### 4.1. Khởi Chạy Lắng Nghe Mọi Giao Diện Mạng (`0.0.0.0`)
Trong `package.json`:
```json
"scripts": {
  "dev": "next dev -H 0.0.0.0 -p 3000"
}
```

### 4.2. Cấu Hình Chống Chặn 403 Forbidden (`next.config.ts`)
> [!IMPORTANT]
> Next.js 16 mặc định kích hoạt bảo mật `blockCrossSiteDEV`, chặn toàn bộ file JS bundle và WebSocket hot-reload khi client truy cập bằng IP mạng LAN (khác `localhost`). Cần khai báo dải IP cục bộ trong `allowedDevOrigins` và `experimental.serverActions.allowedOrigins`:

```typescript
// next.config.ts
import type { NextConfig } from "next";
import os from "os";

function getLocalIpAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
}

const localIps = getLocalIpAddresses();

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    ...localIps,
    "192.168.1.*",
    "192.168.*.*",
    "10.*.*.*",
    "localhost",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        ...localIps.map((ip) => `${ip}:3000`),
        ...localIps,
        "192.168.1.*:3000",
        "192.168.*.*:3000",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;
```

---

## 5. Checklist Trước Giờ G (Pre-flight Checklist)

| STT | Hạng mục kiểm tra | Lệnh / Thao tác | Trạng thái đạt |
| :---: | :--- | :--- | :---: |
| 1 | **Xác định IP LAN máy chủ** | Chạy `ipconfig getifaddr en0` (hoặc `en1`) trên macOS | Trả về IP dạng `192.168.x.x` |
| 2 | **Cấu hình Firewall macOS** | Cài đặt hệ thống $\rightarrow$ Mạng $\rightarrow$ Tường lửa | Cho phép ứng dụng Node nhận kết nối đến |
| 3 | **Kiểm tra AP Isolation** | Dùng 1 điện thoại kết nối cùng Wi-Fi mở Safari vào `http://<LAN-IP>:3000` | Trang `/login` tải mượt mà trong `< 1s` |
| 4 | **Smoke Test Đa Thiết Bị** | 1 máy iPhone Safari + 1 máy Android Chrome cùng nộp thử 1 câu | Dữ liệu xuất hiện ngay trên `/admin` |
| 5 | **Sao lưu Database ban đầu** | Chạy lệnh copy file SQLite: `cp prisma/dev.db prisma/dev.backup.db` | File backup sẵn sàng phục hồi |

---

## 6. Kế Hoạch Ứng Phó Sự Cố Khẩn Cấp (Disaster Recovery)

### 6.1. Khi người chơi không thể tải được trang (Timeout / Connection Refused)
1. **Kiểm tra xem laptop có đổi IP không**: Nếu chuyển từ Wi-Fi này sang Wi-Fi khác, IP LAN sẽ đổi. Vào `/admin` để cập nhật lại mã QR theo IP mới.
2. **Kiểm tra AP Isolation của Router**: Một số Wi-Fi khách sạn/văn phòng chặn giao tiếp giữa các máy nội bộ.
   - *Cách giải quyết tức thì:* Dùng 1 điện thoại phụ bật **Điểm phát sóng di động (4G Hotspot)** và cho Laptop Admin cùng các máy người chơi kết nối vào đó.

### 6.2. Phục hồi cơ sở dữ liệu bị lỗi
```bash
# Khôi phục file database từ bản backup
cp prisma/dev.backup.db prisma/dev.db
# Khởi động lại ứng dụng
yarn dev
```
