---
name: server-api-auth
description: Next.js Server Actions, Route Handlers, session auth, and LAN network IP resolver for Astar 20/10 offline game.
---

# Server API & Auth Skill

## 1. Mục Đích
Skill này quản lý toàn bộ các điểm chạm giao tiếp phía Backend (Server-side) của ứng dụng Next.js 16 App Router:
- **Xác thực & Phiên làm việc (Session Auth)**: Đăng nhập bằng tên và ngày sinh (`DDMM`), băm mật khẩu với `bcryptjs`, cấp phát HttpOnly Cookie an toàn `astar_session`, phân quyền `PLAYER` và `ADMIN`.
- **Server Actions & Route Handlers**: Xử lý nộp phiếu bầu 1 chiều, lấy tiến trình làm bài dở dang, kiểm soát chuyển đổi trạng thái game.
- **Tự động nhận diện IP Wi-Fi nội bộ (LAN Resolver)**: Trích xuất IP mạng Wi-Fi của máy laptop chủ (`os.networkInterfaces()`) để tự động tạo URL và mã QR cho người chơi quét vào phòng.
- **Cấu hình Bảo mật Next.js 16**: Cấp phép truy cập chéo nguồn mạng LAN qua `allowedDevOrigins` và `serverActions.allowedOrigins`.

---

## 2. Cấu Trúc Module Backend

```
src/
├── actions/
│   └── auth.actions.ts              # Server Action đăng nhập form login
├── app/
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts       # POST: Đăng nhập, cấp cookie session
│       │   ├── logout/route.ts      # POST: Xóa cookie session
│       │   └── me/route.ts          # GET: Kiểm tra thông tin phiên hiện tại
│       ├── game/
│       │   └── state/route.ts       # GET: Smart polling trạng thái phòng & timer
│       ├── results/
│       │   └── route.ts             # GET: Lấy/tính toán kết quả 14 vòng D4
│       ├── vote/
│       │   ├── submit/route.ts      # POST: Nộp câu trả lời, lưu answeredAt
│       │   └── progress/route.ts    # GET: Lấy tiến độ câu đang làm dở & tên còn lại
│       └── admin/
│           ├── state/route.ts       # POST: Đổi trạng thái (LOBBY/SLIDESHOW/VOTING...)
│           ├── roster/route.ts      # GET: Danh sách tiến độ 40 người chơi
│           ├── reset/route.ts       # POST: Reset dữ liệu chơi thử
│           └── network/route.ts     # GET: Lấy IP LAN nội bộ máy chủ
└── lib/
    ├── auth.ts                      # Helpers băm bcrypt & mã hóa cookie session
    ├── network.ts                   # Trích xuất địa chỉ IP LAN (IPv4)
    └── prisma.ts                    # Singleton kết nối database SQLite
```

---

## 3. Danh Sách API Contracts

### 3.1. Xác thực (`/api/auth`)
- **`POST /api/auth/login`**:
  - *Body:* `{ username: string, password: string (DDMM) }`
  - *Response:* `{ success: true, user: { id, username, fullName, role } }`
  - *Cookie:* Cấp cookie `astar_session` (HttpOnly, SameSite=Lax, Path=/).
- **`GET /api/auth/me`**:
  - *Response:* Trả về user hiện tại từ cookie, hoặc `{ user: null }` nếu chưa đăng nhập.
- **`POST /api/auth/logout`**:
  - *Response:* Xóa cookie `astar_session` và chuyển hướng về `/login`.

### 3.2. Bỏ phiếu (`/api/vote`)
- **`GET /api/vote/progress`**:
  - *Response:*
    ```json
    {
      "currentQuestionIndex": 5,
      "totalQuestions": 14,
      "completed": false,
      "selectedNames": ["Nguyễn Thị A", "Trần Thị B", "Lê Thị C", "Phạm Thị D"],
      "remainingFemaleNames": ["Hoàng Thị E", "Vũ Thị F", "..."],
      "currentQuestion": {
        "id": "q5",
        "questionNumber": 5,
        "photoUrl": "/photos/5.jpg"
      }
    }
    ```
- **`POST /api/vote/submit`**:
  - *Body:* `{ questionId: string, selectedName: string }`
  - *Logic:* Ghi nhận `answeredAt = new Date()` (giờ server). Trả về câu hỏi tiếp theo và danh sách tên còn lại đã trừ đi `selectedName`.

### 3.3. Trạng thái phòng & Kết quả (`/api/game`, `/api/results`)
- **`GET /api/game/state`**:
  - *Response:* Trả về `{ status, currentQuestionNumber, isQuestionActive, timerDurationSec, timerStartedAt }` phục vụ polling 1s từ client.
- **`GET /api/results`**:
  - *Response:* Trả về danh sách 14 vòng Reveal kết quả D4, tính toán hoặc đọc từ `RoundResult`.

### 3.4. Quản trị & Mạng Wi-Fi (`/api/admin`)
- **`GET /api/admin/network`**:
  - *Response:* `{ ip: "192.168.1.15", port: 3000, joinUrl: "http://192.168.1.15:3000" }`
- **`GET /api/admin/roster`**:
  - *Response:* Trả về thống kê (Tổng người chơi, đã nộp xong 14/14, đang làm, chưa vào) và danh sách thời gian chi tiết của từng người.
- **`POST /api/admin/state`**:
  - *Body:* `{ status?, currentQuestionNumber?, isQuestionActive?, timerDurationSec?, triggerTimer? }`
- **`POST /api/admin/reset`**:
  - *Logic:* Reset phiên chơi thử, xóa bảng `Vote` và `RoundResult`.

---

## 4. Code Mẫu Triển Khai Thực Tế

### 4.1. Tự động lấy IP mạng LAN Wi-Fi (`src/lib/network.ts`)
```typescript
import os from 'os';

export function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Bỏ qua địa chỉ loopback (127.0.0.1) và chỉ lấy IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}
```

### 4.2. Xử lý Nộp Phiếu Bầu An Toàn (`src/app/api/vote/submit/route.ts`)
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getCurrentUser } from '@/src/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  }

  // Kiểm tra trạng thái phòng game
  const gameState = await prisma.gameState.findUnique({ where: { id: 'default' } });
  if (gameState?.status !== 'VOTING') {
    return NextResponse.json({ error: 'Cổng bình chọn hiện đang đóng' }, { status: 403 });
  }

  const { questionId, selectedName } = await req.json();

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { femaleProfile: true },
  });

  if (!question) {
    return NextResponse.json({ error: 'Câu hỏi không tồn tại' }, { status: 404 });
  }

  const isCorrect = question.femaleProfile.name.trim() === selectedName.trim();

  // Ghi nhận phiếu bầu với timestamp server
  const vote = await prisma.vote.create({
    data: {
      userId: user.id,
      questionId,
      selectedName: selectedName.trim(),
      isCorrect,
      answeredAt: new Date(),
    },
  });

  return NextResponse.json({ success: true, voteId: vote.id });
}
```

---

## 5. Nguyên Tắc Bảo Mật & Toàn Vẹn Dữ Liệu
1. **Chống gian lận thời gian:** Không bao giờ chấp nhận `client_timestamp` gửi từ trình duyệt điện thoại. Luôn lấy `new Date()` của máy tính server làm mốc `answered_at`.
2. **Khóa cổng vote tức thì:** Mọi request submit khi `gameState.status !== 'VOTING'` đều bị từ chối với HTTP 403.
3. **Phân quyền Admin:** Các endpoint `/api/admin/*` kiểm tra `user.role === 'ADMIN'` trước khi xử lý.
4. **Cấp quyền truy cập qua mạng LAN (Next.js 16 `allowedDevOrigins`):**
   Trong `next.config.ts`, khai báo dải IP để Next.js 16 không chặn 403 Forbidden các tài nguyên JS chunks và WebSockets khi client truy cập bằng IP mạng nội bộ.
