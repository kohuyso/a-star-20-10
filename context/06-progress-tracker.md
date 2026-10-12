# Astar 20/10 – Nhật Ký Tiến Độ (Progress Tracker)

## Trạng Thái Các Module

| Module / Epic | Nội dung | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Context & Architecture** | Tài liệu đặc tả 01-07, UI Registry Crimson Arena | 🟢 Hoàn thành | Đầy đủ kiến trúc & token |
| **Database & Schema** | Prisma + SQLite, Models, Live Timer Sync Fields | 🟢 Hoàn thành | Đã push schema & seed 14 bạn nữ + nam |
| **Core Game Engine (D4)** | Thuật toán chọn người tặng quà + Unit Tests | 🟢 Hoàn thành | 5/5 Vitest Unit Tests Passed |
| **Epic A: Đăng nhập** | Login user/admin, Server Action, Quick select | 🟢 Hoàn thành | `/login`, Server Action, Mobile-optimized |
| **Epic B: Chiếu ảnh Live** | Slideshow 14 ảnh đồng bộ theo Admin | 🟢 Hoàn thành | `/slideshow`, Live Timer, Synchronized slide |
| **Epic C: Bỏ phiếu Live** | Mobile UI từng câu, loại trừ tên, đếm ngược | 🟢 Hoàn thành | `/vote`, 1s polling, Kahoot-style slide sync |
| **Epic D: Công bố (/results)**| MC Reveal Flow, Winner highlight, Animation | 🟢 Hoàn thành | `/results`, `/api/results`, D4 engine, Confetti |
| **Epic E: Admin Master** | Điều khiển chiếu từng ảnh, set timer 15s-45s | 🟢 Hoàn thành | `/admin`, Slide Master, Live submission roster |
| **Epic F: Chạy Local Wifi** | Tự động lấy Local IP, hiển thị QR, Checklist, Cấp phép LAN Origin | 🟢 Hoàn thành | `src/lib/network.ts`, QR modal, `allowedDevOrigins` in `next.config.ts` |

---

## Nhật Ký Phiên Làm Việc (Session Log)
- **2026-10-09**:
  - Khởi tạo toàn bộ bộ tài liệu dự án chuẩn CashMate (`context/01` $\rightarrow$ `07`, `workflows/01` $\rightarrow$ `03`, `.agents/skills/`).
  - Thiết lập Theme **Crimson Arena** (Primary `#DC2626`, Secondary `#991B1B`, Tertiary `#F59E0B`, Dark Neutral `#1F242D`, Fonts: Plus Jakarta Sans & Inter).
  - Hoàn thành Prisma SQLite schema với các ràng buộc duy nhất `(userId, selectedName)` và `(userId, questionId)`.
  - Cài đặt và chạy script seed (`prisma/seed.ts`) cho 14 bạn nữ và danh sách tài khoản người chơi nam.
  - Viết thuật toán chọn người trao quà Epic D4 (`src/lib/game-engine.ts`) và hoàn thành bộ Unit Tests (`src/lib/game-engine.test.ts`) đạt 100% test passing (5/5 tests).
  - **Nâng Cấp Chế Độ Trò Chơi Đồng Bộ Trực Tiếp (Live Kahoot/Quiz Show Mode)**:
    - Admin làm chủ phòng (`/admin`): Chọn chiếu từng ảnh từ Câu 1 $\rightarrow$ 14, tùy chọn thời gian đoán (15s, 20s, 30s, 45s), bấm "Bắt đầu đếm ngược" và "Khóa câu trả lời".
    - Màn hình Máy chiếu (`/slideshow`): Tự động đồng bộ hiển thị đúng ảnh câu hỏi mà Admin đang chọn cùng đồng hồ đếm ngược trực tiếp.
    - Màn hình Điện thoại Người chơi (`/vote`): Tự động nhảy sang câu hỏi tương ứng, hiển thị danh sách tên chưa từng chọn ở các câu trước, mở cổng nộp đáp án trong thời gian quy định, và tự khóa khi hết giờ.
    - Chuyển sang màn hình Công bố MC (`/results`) vinh danh người trao quà theo thuật toán D4 khi hoàn thành 14 câu.
  - **Sửa lỗi truy cập mạng LAN qua IP máy chủ (`192.168.1.22:3000`)**: Cấu hình `allowedDevOrigins` và `experimental.serverActions.allowedOrigins` trong `next.config.ts` để Next.js 16 không chặn (403 Forbidden) các tài nguyên JS chunks và WebSockets khi người chơi truy cập từ IP mạng nội bộ.
- **2026-10-12**:
  - Quét toàn bộ Tech Stack dự án: Next.js 16.4.0 (App Router), React 19.3.0, React Compiler, Turbopack, Tailwind CSS v4, Prisma v6 + SQLite WAL, Vitest v5, Canvas Confetti, QR Code.
  - Xây dựng và hoàn thiện trọn bộ 7 skills chuẩn hóa độc lập trong `.agents/skills/`:
    1. [`crimson-ui`](file:///Users/Astar/Node/astar_20_10/.agents/skills/crimson-ui/SKILL.md): Tokens, typography, mobile-first UX và danh mục UI Component.
    2. [`game-engine`](file:///Users/Astar/Node/astar_20_10/.agents/skills/game-engine/SKILL.md): Thuật toán D4, game state machine, loại trừ tên 1 chiều và edge cases.
    3. [`server-api-auth`](file:///Users/Astar/Node/astar_20_10/.agents/skills/server-api-auth/SKILL.md): Next.js Server Actions, Route Handlers, cookie session, bcrypt và LAN resolver.
    4. [`sqlite-store`](file:///Users/Astar/Node/astar_20_10/.agents/skills/sqlite-store/SKILL.md): Prisma SQLite models, constraints, index, seed và ACID transaction reset.
    5. [`presentation-engine`](file:///Users/Astar/Node/astar_20_10/.agents/skills/presentation-engine/SKILL.md): Màn hình máy chiếu `/slideshow` & `/results`, canvas-confetti, live timer gauge và phím tắt.
    6. [`admin-operations`](file:///Users/Astar/Node/astar_20_10/.agents/skills/admin-operations/SKILL.md): Bảng điều khiển Master `/admin`, live roster, timer countdown, QR modal và reset khẩn cấp.
    7. [`lan-deployment-qa`](file:///Users/Astar/Node/astar_20_10/.agents/skills/lan-deployment-qa/SKILL.md): Mạng LAN Wi-Fi nội bộ, cấu hình `allowedDevOrigins`, Vitest test suite, smoke test di động và checklist trước giờ G.
    8. [`modular-components`](file:///Users/Astar/Node/astar_20_10/.agents/skills/modular-components/SKILL.md): Nguyên tắc phân rã chia nhỏ component, tái sử dụng UI primitives có sẵn, và tổ chức file/component theo features.
  - Khởi tạo bộ UI Primitives & Shared Components: `Button`, `Card`, `Badge`, `Input`, `Modal`, `TacticalPortrait`.
  - **Refactor toàn bộ 5 màn hình monolithic theo chuẩn Feature-Driven & Component Decomposition**:
    - `auth`: Tách `LoginHeader`, `PlayerQuickSelect`, `LoginForm` $\rightarrow$ [`/login`](file:///Users/Astar/Node/astar_20_10/src/app/(auth)/login/page.tsx) chỉ còn 125 dòng.
    - `voting`: Tách `VotingHeader`, `LobbyWaitingCard`, `RevealWaitingCard`, `QuestionPhotoCard`, `VotingStatusCard`, `CandidateSelector`, `VotingActionDeck` $\rightarrow$ [`/vote`](file:///Users/Astar/Node/astar_20_10/src/app/(player)/vote/page.tsx) từ 517 xuống 240 dòng.
    - `presentation`: Tách `SlideHeader`, `SlidePhotoDisplay`, `SlideStepperFooter` $\rightarrow$ [`/slideshow`](file:///Users/Astar/Node/astar_20_10/src/app/(presentation)/slideshow/page.tsx); Tách `ResultsHeader`, `RevealPhotoCard`, `WinnerSpotlightCard`, `VotesBreakdownCard`, `ResultsSummaryTable`, `ResultsStepperFooter` $\rightarrow$ [`/results`](file:///Users/Astar/Node/astar_20_10/src/app/(presentation)/results/page.tsx) từ 620 xuống 180 dòng.
    - `admin`: Tách `AdminHeader`, `LiveBroadcasterCard`, `RosterMetricsGrid`, `RosterPlayerTable`, `LanQrModal` $\rightarrow$ [`/admin`](file:///Users/Astar/Node/astar_20_10/src/app/admin/page.tsx) từ 653 xuống 220 dòng.
  - Toàn bộ các file `page.tsx` trở thành **Page Orchestrators** tinh gọn, 100% tái sử dụng các primitives và shared components.
  - Kiểm tra toàn diện: `yarn tsc --noEmit` **0 errors**, `yarn vitest run` **5/5 tests passed**.
  - **Khắc phục triệt để lỗi màu chữ tàng hình (Trắng trên Trắng) & Ban hành Skill Theme Token Guard**:
    - **Nguyên nhân cốt lõi**: Trong Tailwind CSS v4, khi thiếu khai báo `@custom-variant dark (&:where(.dark, .dark *));`, Tailwind tự kích hoạt class `dark:*` theo media query `(prefers-color-scheme: dark)` của trình duyệt/hệ điều hành. Trong khi đó, component card bị hardcode nền trắng (`background: #FFFFFF`), khiến text chuyển màu trắng trên nền trắng (tàng hình).
    - **Xây dựng Skill mới**: [`theme-token-guard`](file:///Users/Astar/Node/astar_20_10/.agents/skills/theme-token-guard/SKILL.md) chuẩn hóa dark mode CSS variant, thiết lập bộ CSS tokens đối xứng (`--bg-page`, `--bg-card`, `--text-main`, `--text-muted`, `--border-card`), nguyên tắc luôn ghép đôi Background & Text, và checklist cấm kỵ (Anti-patterns).
    - **Sửa chữa toàn diện**:
      - `globals.css`: Khai báo `@custom-variant dark`, thiết lập giá trị mặc định của `:root` và `.dark` thành bảng màu tối chuẩn Crimson Arena (`--bg-page: #0F1218`, `--bg-card: #161B26`, `--border-card: #27303F`, `--text-main: #F8FAFC`).
      - `layout.tsx`: Gán trực tiếp class `dark` lên thẻ `<html>` và áp dụng `bg-[#0F1218] text-[#F8FAFC]` cho `<body>` để loại bỏ hoàn toàn viền trắng / nền canvas trắng bị hở ngoài các card.
      - `card.tsx`: Thiết lập nền thẻ mặc định thành `bg-[#161B26]` với viền `border-[#27303F]` và chữ `text-[#F8FAFC]`.
      - Toàn bộ các component Admin (`LiveBroadcasterCard`, `RosterMetricsGrid`, `RosterPlayerTable`, `AdminHeader`, `LanQrModal`): Đồng bộ phong cách Dark Arena, nhãn `text-zinc-400`, tiêu đề `text-white`, nút bấm và badge trạng thái tương phản sắc nét tuyệt đối.
      - Màn chiếu máy chiếu (`/slideshow`, `/results`), `/login`, `/vote`: Đồng bộ 100% theme Crimson Arena nguyên bản.
    - Kiểm tra typecheck và unit test: `yarn tsc --noEmit` **0 errors**, `yarn vitest run` **5/5 tests passed (100%)**.
  - **Sửa lỗi chọn thời gian đếm ngược bị nhảy về 20s (`/admin`)**:
    - **Nguyên nhân cốt lõi**: Hàm `fetchAdminData()` polling mỗi 1000ms gọi `setSelectedDuration(stateData.gameState.timerDurationSec)`. Khi Admin nhấn chọn nút 30s trên giao diện, giá trị chỉ cập nhật vào local state mà chưa kịp lưu vào DB (hoặc trước khi DB lưu), khiến nhịp poll tiếp theo (sau 1s) đọc lại giá trị cũ từ DB (20s) và ghi đè ngược lại làm nút nhảy từ 30s về 20s.
    - **Giải pháp**:
      - Sử dụng `isDurationInitialized` (`useRef`) để chỉ đồng bộ `selectedDuration` từ server trong lần tải đầu tiên (initial load).
  - **Triển khai hiệu ứng Lưới ô vuông bí ẩn lật mở ngẫu nhiên (Mystery Grid Reveal)**:
    - **Yêu cầu nghiệp vụ**: Hình ảnh câu hỏi được che bởi lưới các ô vuông. Khi phiên đếm ngược bắt đầu, các ô vuông dần dần biến mất một cách ngẫu nhiên và **mở trọn vẹn 100% trước 10s so với thời điểm kết thúc phiên đoán** (để người chơi có 10 giây cuối nhìn rõ ảnh và chốt đáp án). Hiệu ứng áp dụng đồng bộ trên cả màn hình máy chiếu (`/slideshow`) và điện thoại người chơi (`/vote`).
    - **Thiết kế & Giải thuật**:
      - Tạo component dùng chung [`MysteryGridImage`](file:///Users/Astar/Node/astar_20_10/src/components/shared/mystery-grid-image.tsx) với lưới $5 \times 5 = 25$ ô vuông phong cách Slate Neutral Crimson Arena (`#1F242D` / `#12161F`).
      - Sử dụng hàm sinh số ngẫu nhiên có Seed (LCG) cố định theo `questionNumber`, bảo đảm thứ tự mở ô giữa máy chiếu và tất cả người chơi hoàn toàn trùng khớp 100%, không bị lệch ô khi F5 tải lại trang.
      - Công thức mở: Hoàn thành mở toàn bộ 25 ô khi $T_{left} \le 10$s. Với tổng thời gian $T$, thời lượng mở là $T_{reveal} = \max(1, T - 10)$. Tiến độ mở $\text{progress} = \Delta t / T_{reveal}$.
    - **Tích hợp Components**:
      - Máy chiếu: Tích hợp vào [`SlidePhotoDisplay`](file:///Users/Astar/Node/astar_20_10/src/features/presentation/components/slide-photo-display.tsx) và truyền props thời gian từ [`slideshow/page.tsx`](file:///Users/Astar/Node/astar_20_10/src/app/(presentation)/slideshow/page.tsx).
      - Mobile: Tích hợp vào [`TacticalPortrait`](file:///Users/Astar/Node/astar_20_10/src/components/shared/tactical-portrait.tsx), [`QuestionPhotoCard`](file:///Users/Astar/Node/astar_20_10/src/features/voting/components/question-photo-card.tsx) và truyền props thời gian từ [`vote/page.tsx`](file:///Users/Astar/Node/astar_20_10/src/app/(player)/vote/page.tsx).
    - **Kiểm thử**: Viết unit test [`mystery-grid-image.test.ts`](file:///Users/Astar/Node/astar_20_10/src/components/shared/mystery-grid-image.test.ts), kiểm tra tính tất định của seed, độ phân kỳ giữa các câu hỏi, và tiến độ mở 100% khi còn 10s. Chạy `yarn tsc --noEmit` 0 errors, `yarn vitest run` 12/12 tests passed (100%).
  - **Khắc phục triệt để lỗi lộ ảnh trước khi bấm bắt đầu đếm ngược**:
    - **Nguyên nhân**:
      1. Trong `MysteryGridImage`, điều kiện `if (timeLeft <= 10)` vô tình match khi `timeLeft = 0` (lúc câu hỏi chưa active hoặc chưa bắt đầu đếm ngược), khiến 100% ô mở ngay từ đầu.
      2. Khi Admin chuyển câu hỏi, API `POST /api/admin/state` chưa reset `timerStartedAt = null`, khiến timestamp cũ trong DB làm hệ thống hiểu nhầm phiên đã đếm ngược xong và lật mở ảnh.
      3. Thẻ `<img>` gốc hiển thị bên dưới không có `opacity-0` khi số ô mở bằng 0.
    - **Khắc phục**:
      1. Sửa `api/admin/state/route.ts` & `api/admin/reset/route.ts`: Luôn reset `timerStartedAt = null` và `isQuestionActive = false` khi Admin chuyển câu hỏi hoặc reset phòng.
      2. Sửa `MysteryGridImage.tsx`: Nếu `timerStartedAt = null` $\rightarrow$ Tuyệt đối 0 ô mở (che kín 100%). Nếu `isQuestionActive = false` mà chưa đếm ngược xong $\rightarrow$ Che kín 100%. Thẻ `<img>` gán `opacity-0` khi `revealedTilesSet.size === 0` để chống lộ ảnh tuyệt đối.
      3. Bỏ `forceRevealAll={hasAnswered}` trên mobile để người chơi nộp sớm không bị lộ ảnh sớm cho người bên cạnh nhìn trộm.
  - **Sửa lỗi production build (`yarn build`)**:
    - **Nguyên nhân**:
      1. Cấu hình `cacheComponents: true` và `partialPrefetching: true` (PPR) của Next.js 16 thử nghiệm tĩnh hóa tất cả trang & route handler. Khi gặp `cookies()` ngoài `<Suspense>`, Next.js trả về hanging promise và reject với `HANGING_PROMISE_REJECTION`.
      2. Trong [src/lib/auth.ts](file:///Users/Astar/Node/astar_20_10/src/lib/auth.ts), hàm `getCurrentUser` bọc `try/catch` vô tình nuốt lỗi internal của Next.js khiến React không bắt được lỗi và worker build dừng đột ngột.
      3. Trang root [src/app/page.tsx](file:///Users/Astar/Node/astar_20_10/src/app/page.tsx) là trang chuyển hướng dựa trên cookie người dùng nên không thể build tĩnh.
    - **Khắc phục**:
      1. Bỏ cờ thử nghiệm `cacheComponents` & `partialPrefetching` trong [next.config.ts](file:///Users/Astar/Node/astar_20_10/next.config.ts) để quay về mô hình Dynamic Rendering chuẩn cho ứng dụng mạng LAN.
      2. Khai báo `export const dynamic = 'force-dynamic'` tại [src/app/page.tsx](file:///Users/Astar/Node/astar_20_10/src/app/page.tsx).
      3. Trong [src/lib/auth.ts](file:///Users/Astar/Node/astar_20_10/src/lib/auth.ts), rethrow các lỗi internal có `digest` của Next.js thay vì swallow và ghi log lỗi giả.
      4. Kiểm tra: `yarn build` thành công 100% trong ~3 giây, `yarn tsc --noEmit` và `yarn test` 12/12 unit tests pass.
