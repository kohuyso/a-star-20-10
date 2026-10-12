---
name: sqlite-store
description: Manages SQLite database with Prisma ORM, migrations, seed operations, and transactional constraints for Astar 20/10 offline game.
---

# SQLite Store Skill

## 1. Mục Đích
Skill này chịu trách nhiệm quản lý toàn bộ tầng dữ liệu cục bộ (Local Persistence) bằng Prisma ORM v6 và SQLite trên máy tính chủ cho sự kiện Astar 20/10:
- **Schema & Data Models**: Quản lý các thực thể `User`, `FemaleProfile`, `Question`, `Vote`, `GameState`, `RoundResult`.
- **Ràng Buộc Nghiệp Vụ Tại DB**: Ngăn chặn người chơi chọn trùng tên bạn nữ giữa các câu, ngăn nộp 2 lần cho 1 câu, và tối ưu hóa index tìm kiếm tốc độ cao.
- **Dữ Liệu Khởi Tạo (Seeding)**: Tự động seed tài khoản Admin, 14 bạn nữ kèm gợi ý hint, và danh sách nam kèm mật khẩu ngày sinh (`DDMM`) đã băm bcrypt.
- **Sao Lưu & Giao Dịch An Toàn (ACID Transactions)**: Đảm bảo thao tác ghi phiếu bầu và reset phiên thử nghiệm diễn ra an toàn, cô lập.

---

## 2. Cấu Trúc Module & Tệp Nguồn
- `prisma/schema.prisma`: Định nghĩa mô hình dữ liệu SQLite, quan hệ khóa ngoại, unique constraints và index tối ưu hóa.
- `prisma/seed.ts`: Script khởi tạo sẵn 14 bạn nữ, tài khoản Admin và danh sách người chơi nam kèm mật khẩu ngày sinh.
- `prisma/dev.db`: Tệp cơ sở dữ liệu SQLite cục bộ (lưu trữ trực tiếp trên máy chủ).
- `src/lib/prisma.ts`: Singleton PrismaClient an toàn trong môi trường Next.js.

---

## 3. Sơ Đồ Thực Thể Quan Hệ (ERD) & Ràng Buộc Cơ Sở Dữ Liệu

```prisma
model User {
  id           String        @id @default(uuid())
  username     String        @unique
  passwordHash String
  fullName     String
  role         String        @default("PLAYER") // "PLAYER" | "ADMIN"
  createdAt    DateTime      @default(now())
  votes        Vote[]
  wonRounds    RoundResult[]
}

model FemaleProfile {
  id          String        @id @default(uuid())
  name        String        @unique
  avatarUrl   String?
  hint        String?
  orderIndex  Int           @default(0)
  questions   Question[]
  roundResult RoundResult?
}

model Question {
  id              String        @id @default(uuid())
  questionNumber  Int           @unique
  femaleProfileId String
  photoUrl        String
  isActive        Boolean       @default(true)
  femaleProfile   FemaleProfile @relation(fields: [femaleProfileId], references: [id], onDelete: Cascade)
  votes           Vote[]
}

model Vote {
  id           String   @id @default(uuid())
  userId       String
  questionId   String
  selectedName String
  isCorrect    Boolean  @default(false)
  answeredAt   DateTime @default(now())

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  question Question @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@unique([userId, questionId])
  @@unique([userId, selectedName])
  @@index([questionId, isCorrect, answeredAt])
}

model GameState {
  id                    String    @id @default("default")
  status                String    @default("LOBBY") // "LOBBY" | "VOTING" | "CLOSED" | "REVEAL"
  currentQuestionNumber Int       @default(1)
  isQuestionActive      Boolean   @default(false)
  timerDurationSec      Int       @default(20)
  timerStartedAt        DateTime?
  currentSlideIndex     Int       @default(0)
  activeRevealRound     Int       @default(0)
  slideDurationSec      Int       @default(15)
  updatedAt             DateTime  @updatedAt
}

model RoundResult {
  id                  String   @id @default(uuid())
  femaleProfileId     String   @unique
  assignedUserId      String?
  totalCorrectGuesses Int      @default(0)
  totalGuesses        Int      @default(0)
  selectionReason     String   @default("FASTEST_CORRECT")
  revealedAt          DateTime @default(now())

  femaleProfile FemaleProfile @relation(fields: [femaleProfileId], references: [id], onDelete: Cascade)
  assignedUser  User?         @relation(fields: [assignedUserId], references: [id], onDelete: SetNull)
}
```

### Các Ràng Buộc Bắt Buộc (Critical DB Constraints)
1. **Ràng buộc chọn duy nhất mỗi bạn nữ cho từng user**:
   ```prisma
   @@unique([userId, selectedName])
   ```
   *Mục đích:* Ngăn chặn tuyệt đối người chơi chọn cùng 1 tên cho 2 câu hỏi khác nhau ở cấp độ cơ sở dữ liệu.

2. **Ràng buộc mỗi user chỉ vote 1 lần cho mỗi câu**:
   ```prisma
   @@unique([userId, questionId])
   ```
   *Mục đích:* Ngăn chặn double-click hoặc nộp lại câu hỏi đã hoàn thành.

3. **Index tối ưu hóa truy vấn tốc độ**:
   ```prisma
   @@index([questionId, isCorrect, answeredAt])
   ```
   *Mục đích:* Giúp truy vấn tìm người đoán đúng/sai nhanh nhất cho từng câu chạy với độ trễ `< 1ms`.

---

## 4. Hướng Dẫn Thao Tác & Quy Chuẩn Lập Trình

### 4.1. Khởi Tạo & Cập Nhật Database
```bash
# Đẩy schema trực tiếp vào SQLite (dev.db)
npx prisma db push

# Chạy seed dữ liệu 14 bạn nữ & tài khoản người chơi nam
yarn seed
# hoặc
npx tsx prisma/seed.ts
```

### 4.2. Giao Dịch Reset Phiên Chơi Thử Nghiệm An Toàn
```typescript
import { prisma } from '@/src/lib/prisma';

export async function resetGameSession() {
  await prisma.$transaction([
    prisma.vote.deleteMany(),
    prisma.roundResult.deleteMany(),
    prisma.gameState.update({
      where: { id: 'default' },
      data: {
        status: 'LOBBY',
        currentQuestionNumber: 1,
        isQuestionActive: false,
        timerStartedAt: null,
        currentSlideIndex: 0,
        activeRevealRound: 0,
      },
    }),
  ]);
}
```

### 4.3. Quy Chuẩn Vận Hành Offline (LAN Mode)
- Tệp database SQLite mặc định được lưu trữ tại `prisma/dev.db`.
- Không sử dụng các dịch vụ Cloud bên ngoài để đảm bảo ứng dụng chạy mượt mà 100% trong mạng nội bộ Wi-Fi.
- Khi cần sao lưu khẩn cấp trước sự kiện: `cp prisma/dev.db prisma/dev.backup.db`.
