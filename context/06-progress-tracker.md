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
- **2026-10-16**:
  - **Tải và tích hợp 14 ảnh chính thức từ Google Drive (`1GlCpSyEEJtaR-j9COZClXXy2vmEOh2DD`)**:
    - Tải toàn bộ 14 ảnh từ thư mục Google Drive của ban tổ chức về `public/images/female/`.
    - Chuẩn hóa định dạng và đặt tên có số thứ tự câu hỏi: `01-nguyen-thi-nhat-anh.png` $\rightarrow$ `14-dang-quynh-chi.png`.
    - Ghép nối chuẩn xác 100% 14 bạn nữ theo đúng thứ tự file vào bảng `FemaleProfile` và `Question` (Câu 1 đến Câu 14) tương ứng với tài khoản người dùng `User` trong database.
    - Cập nhật script `prisma/seed.ts` và chạy nạp dữ liệu vào SQLite.
    - Sửa giới tính tài khoản `00021` (Bùi Hồng Nhật) thành Nam (MALE).
    - **Khắc phục triệt để lỗi ảnh bị cắt (Dynamic Aspect Ratio Box)**: Thay vì chỉ dùng CSS `object-contain` tĩnh (vốn bị lỗi cyclic height trong flexbox khiến ảnh dài bị bung kích thước tự nhiên và bị `overflow-hidden` cắt mất đầu/chân), đã nâng cấp `MysteryGridImage` tự động đọc `naturalWidth` / `naturalHeight` từ ảnh gốc để thiết lập thuộc tính CSS `aspectRatio` chính xác cho khung chứa. Nhờ đó, cả trên máy chiếu (`/slideshow`) lẫn điện thoại (`/vote`), ảnh dọc (9:16, 9:20), ảnh vuông (1:1) hay ảnh ngang đều hiển thị trọn vẹn 100% từ đầu đến chân, lưới 25 ô che phủ vừa khít từng pixel của bức ảnh và không bị cắt xén bất kỳ chi tiết nào.
    - **Tối ưu padding 2 bên trên màn hình điện thoại (Mobile-First Polish)**: Giảm padding ngang của màn hình vote (`/vote`), màn chờ (`LobbyWaitingCard`, `RevealWaitingCard`), khung chân dung (`TacticalPortrait`) và màn đăng nhập (`/login`) từ `px-4`/`p-6` xuống `px-2.5 sm:px-4`/`p-4 sm:p-6`, giúp nội dung bung rộng tối đa trên màn hình hẹp, loại bỏ khoảng trống đen thừa 2 bên mép điện thoại.
    - Toàn bộ kiểm thử: `yarn tsc --noEmit` **0 errors**, `yarn vitest run` **13/13 tests passed (100%)**, `yarn build` **Compiled successfully in 1.4s**.


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
  - **Cập nhật font banner trang đích (`/`) sang Dancing Script**:
    - **Yêu cầu**: Thay đổi câu chúc *"Tôn vinh vẻ đẹp và giá trị của chị em Astar Group"* trong poster/banner trang chủ sang font **Dancing Script** mềm mại, uyển chuyển.
    - **Thực hiện**:
      - Xử lý inpaint nền poster hoa hồng đỏ trắng tại `public/landing/women-day-20-10.png` để xóa sạch chữ cũ không để lại vết tì.
      - Tái dựng dòng chữ 2 dòng với font Google `Dancing Script` (SemiBold 600, tone màu đỏ rượu vang `#460C10` hài hòa với màu đỏ Crimson Arena).
      - Đăng ký Google font `Dancing_Script` vào `src/app/layout.tsx` (`--font-dancing-script`) và `src/app/globals.css` (`.font-script`).
      - Typecheck `yarn tsc --noEmit` và unit test `yarn vitest run` 12/12 pass.
- **2026-10-13**:
  - **Cập nhật danh sách 57 người chơi chính thức & Mật khẩu**:
    - Nhập danh sách 57 thành viên công ty: Cột trái là mật khẩu (mã định danh `B01`..`B04`, `00001`..`00062`, `PT0029`..`PT0039`, `INT0035`..`INT0097`), cột phải là tài khoản / họ và tên.
    - Bổ sung trường `gender: String @default("MALE")` vào model `User` trong SQLite schema (`prisma/schema.prisma`).
    - Phân định chuẩn xác giới tính: 42 nam và 15 nữ (bao gồm bạn Bùi Hồng Nhật, Chu Yến Nhi, v.v.).
    - Tích hợp tính năng đổi giới tính 1-click trực tiếp trên bảng quản trị `/admin` (`POST /api/admin/player/gender`).
    - Seed toàn bộ vào cơ sở dữ liệu (`prisma/seed.ts`), mã hóa mật khẩu bcrypt theo mã code và dọn sạch các tài khoản test mock cũ.
  - **Ẩn gợi ý tài khoản ở màn hình Đăng nhập (`/login`)**:
    - Loại bỏ thẻ gợi ý `PlayerQuickSelect` và các ví dụ hardcode (`nguyen.nam`, `15/03`).
    - Cập nhật nhãn và placeholder trong `LoginForm`: "TÀI KHOẢN / HỌ VÀ TÊN" và "MẬT KHẨU".
    - Khởi tạo input rỗng an toàn, tránh lộ tài khoản người chơi khác.
    - Tối ưu hàm `authenticateUser` trong `src/lib/auth.ts`: Cho phép đăng nhập linh hoạt bằng họ tên có dấu, không dấu, chữ thường, hoặc mã nhân viên; xử lý trường hợp trùng tên (ví dụ: 2 người tên *Phạm Minh Tuấn* ứng với 2 mật khẩu khác nhau `00030` và `INT0097`).
  - **Quy tắc Trao quà chỉ dành cho Nam (Epic D4)**:
    - Cập nhật thuật toán `calculateRevealRounds` trong `src/lib/game-engine.ts`: Người chơi nữ vẫn tham gia dự đoán bình thường, thống kê lượt đoán và hiển thị trong danh sách người chơi; tuy nhiên khi chọn người trao quà cho bạn nữ (`selectedWinner`), bộ lọc loại trừ tuyệt đối tài khoản nữ (`user?.gender === 'FEMALE'`), chỉ chọn người chơi nam nhanh nhất.
    - Bổ sung unit test kiểm chứng quy tắc này trong `src/lib/game-engine.test.ts`.
- **2026-10-16**:
  - **Chuẩn hóa 14 ảnh chính thức từ Google Drive & Đổi thứ tự câu 7 và 13**:
    - Tải và ánh xạ 14 ảnh bạn nữ chất lượng cao về thư mục nội bộ `public/images/female/`.
    - Cập nhật hạt giống DB `prisma/seed.ts` theo đúng danh sách nhân sự thực tế, đổi chỗ Câu 7 (Lê Khánh Linh) và Câu 13 (Phạm Thị Ánh Tuyết), gán Bùi Hồng Nhật là Nam (`00021`).
    - Sắp xếp ngẫu nhiên/alphabetical danh sách ứng viên nữ trong `api/vote/progress/route.ts` để thứ tự trong danh sách chọn không làm lộ đáp án câu hỏi.
    - Xóa tên đáp án bị lộ trong gợi ý (hint) câu 13.
  - **Tách biệt thông tin người chơi và câu hỏi ở Header trang `/vote`**:
    - Đưa thông tin tài khoản đang đăng nhập (`playerName`) vào badge user profile riêng biệt với avatar chữ cái đầu ở góc phải, hoàn toàn tách rời khỏi badge `CÂU X / Y` ở góc trái.
  - **Khắc phục lỗi layout nhảy padding khi bấm bắt đầu đếm ngược (`/vote`)**:
    - **Nguyên nhân cốt lõi**:
      1. Trong `MysteryGridImage`, thẻ wrapper có `aspectRatio: naturalWidth / naturalHeight` khiến khi ảnh load xong hoặc bắt đầu đếm ngược, chiều rộng khung ảnh bị co cụm lại theo tỉ lệ dọc của ảnh, để lại khoảng trống màu đen lớn 2 bên khiến trông như padding tự to ra.
      2. Trong `TacticalPortrait` và `QuestionPhotoCard`, thiếu thuộc tính `shrink-0` (hoặc `flex-shrink-0`). Khi Admin bấm bắt đầu đếm ngược, component `CandidateSelector` và `VotingActionDeck` xuất hiện, flexbox tự động nén chiều cao của ảnh lại. Do ảnh có `aspect-[4/5]`, khi chiều cao bị nén, chiều rộng của ảnh cũng bị nén theo, khiến ảnh thu hẹp lại giữa màn hình và tạo ra khoảng cách lề (khoảng trống giả lập padding) đột ngột phình to.
    - **Khắc phục triệt để**:
      1. Sửa lỗi `mx-auto` thiếu `w-full` trên toàn bộ cây DOM (`vote/page.tsx`, `CandidateSelector`, `VotingActionDeck`, `VotingHeader`, `QuestionPhotoCard`, `LobbyWaitingCard`, `RevealWaitingCard`): Trong CSS Flexbox, khi một phần tử con có `mx-auto` mà không có `w-full`, trình duyệt hủy thuộc tính `align-items: stretch` và thu hẹp toàn bộ layout về `fit-content`. Khi bước vào giai đoạn đếm ngược, việc hoán đổi các component khiến toàn bộ trang co lại thành một cột hẹp ở giữa. Việc bổ sung `w-full` và `shrink-0` khóa cứng độ rộng toàn bộ layout 100% không bao giờ bị co lại.
      2. Bỏ giới hạn hẹp `max-w-[340px]` trên `TacticalPortrait` $\rightarrow$ Đặt `w-full` đồng bộ 100% với `CandidateSelector`, `VotingHeader` và `VotingActionDeck`. Mọi thành phần trên trang đều căn thẳng hàng với cùng padding 10px ở 2 bên mép màn hình.
      3. Tích hợp lớp nền Ambient Blurred Backdrop trong `MysteryGridImage`: Bên dưới ảnh gốc `object-contain`, bổ sung lớp ảnh mờ ảo `object-cover blur-2xl scale-125 opacity-35` lấp đầy 100% khung card từ góc này sang góc kia. Xóa bỏ hoàn toàn khoảng đen trống (khoảng hụt lề 2 bên) khi hiển thị các ảnh dọc tỉ lệ 9:16/3:4.
      4. Ảnh chính giữa giữ nguyên 100% chi tiết gốc không bao giờ bị cắt xén, đồng thời toàn khung card luôn lấp đầy màu sắc hài hòa đồng điệu.
  - **Tạo Trang Ẩn Đăng Ký Tài Khoản (/secret-register)**:
    - **Yêu cầu**: Xây dựng một trang bí mật để thêm tài khoản người chơi/admin tùy ý, hoàn toàn không hiển thị nút bấm hay đường link nào trên giao diện (chỉ truy cập bằng URL trực tiếp).
    - **Thực hiện**:
      1. Tạo Route Handler bí mật `src/app/api/secret/users/route.ts` hỗ trợ:
         - `GET`: Lấy danh sách toàn bộ tài khoản trong SQLite, số lượt votes, lọc theo Nam/Nữ/Admin/Player và tìm kiếm theo tên.
         - `POST`: Nhận thông tin họ tên, mã tài khoản, mật khẩu, giới tính (Nam/Nữ) và vai trò (Player/Admin); kiểm tra trùng lặp và mã hóa mật khẩu bằng `bcryptjs`; trả về tài khoản và token đăng nhập sẵn.
         - `DELETE`: Cho phép xóa nhanh các tài khoản thử nghiệm phát sinh (bảo vệ không xóa tài khoản admin gốc).
      2. Tạo giao diện trang ẩn `src/app/secret-register/page.tsx`:
         - Chủ đề Dark Crimson Arena (#0F1218, viền #27303F, màu nhấn #DC2626 & #F59E0B).
         - Form tạo tài khoản đầy đủ: Họ tên, Tên đăng nhập (kèm nút "Tự sinh mã"), Mật khẩu (kèm nút "Đặt trùng mã" & hiện/ẩn), Chọn Giới tính (Nam tặng quà / Nữ dự đoán), Chọn Vai trò (Player / Admin).
         - Card thông báo thành công kèm nút Sao chép thông tin tài khoản và nút Đăng nhập nhanh.
         - Bảng danh sách trực tiếp các tài khoản trong hệ thống kèm số liệu đếm (Tổng, Nam, Nữ, Admin), ô tìm kiếm và lọc tức thì.
      3. Hoàn toàn KHÔNG xuất hiện trên thanh điều hướng, footer, login hay bất kỳ trang nào khác. Chỉ truy cập khi gõ URL: `/secret-register`.
      4. Kiểm tra chất lượng: `yarn tsc --noEmit` 0 lỗi, `yarn vitest run` 13/13 tests passed.
  - **Khắc phục triệt để lỗi hình ảnh bị nháy lộ mặt khi Admin bắt đầu cho đoán**:
    - **Nguyên nhân cốt lõi**:
      1. Trong `src/app/(player)/vote/page.tsx` và `src/app/(presentation)/slideshow/page.tsx`, state `timeLeft` được khởi tạo là `0` (`useState(0)`). Khi Admin bấm "Bắt đầu đếm ngược", `data.isQuestionActive` chuyển sang `true`, nhưng `useEffect` tính `tick()` chỉ chạy sau khi lượt render đầu tiên hoàn thành. Do đó trong frame đầu tiên, `timeLeft` vẫn bằng `0`.
      2. Trong [MysteryGridImage](file:///Users/Astar/Node/astar_20_10/src/components/shared/mystery-grid-image.tsx), code cũ có điều kiện `if (timeLeft <= 10) return new Set(revealOrder);`. Do `timeLeft = 0` (0 <= 10), component hiểu nhầm là đã hết giờ hoặc đã đến 10s cuối, lập tức mở 100% toàn bộ 25 ô gạch che và bật `opacity-100` cho ảnh gốc.
      3. Sau 1 tick (khoảng 10-50ms), `useEffect` chạy xong và set `timeLeft = 20`, component re-render lại và đóng 25 ô gạch lại. Khoảng thời gian chớp nhoáng đó khiến toàn bộ ảnh bạn nữ bị nháy sáng và lộ rõ mồn một.
    - **Giải pháp xử lý triệt để**:
      1. **Bảo vệ chống nháy lộ ảnh trong `MysteryGridImage`**:
         - Tính toán `elapsed` thực tế trực tiếp từ `timerStartedAt`: `const elapsed = Math.max(0, Math.floor((Date.now() - startMs) / 1000));`.
         - Bổ sung chốt an toàn: Khi phiên vừa bắt đầu (`elapsed <= 0` và `timeLeft <= 0`), **tuyệt đối mở 0 ô (che kín 100%)**.
         - Điều kiện mở 100% trong 10s cuối bắt buộc phải thỏa mãn đồng thời: `effectiveRemaining <= 10` VÀ `elapsed >= Math.max(0, duration - 10)` (đảm bảo thời gian thực tế đã thực sự trôi qua tới 10s cuối, chứ không phải do bug `timeLeft = 0` lúc khởi tạo).
      2. **Tính thời gian tức thì đồng bộ trong `vote/page.tsx` & `slideshow/page.tsx`**:
         - Bổ sung hàm `calculateRealRemaining()` tính trực tiếp thời gian còn lại từ `timerStartedAt` và `timerDurationSec` ngay trong render cycle đầu tiên.
         - Loại bỏ hoàn toàn độ trễ 1 render cycle của `useState(0)`, ngăn chặn giật giao diện từ "Hết giờ" sang "Chọn ứng viên".
      3. **Unit Tests & QA Verification**:
         - Bổ sung test case kiểm chứng chống nháy lộ ảnh trong `src/components/shared/mystery-grid-image.test.ts`.
         - Kết quả: `yarn vitest run` 14/14 tests pass, `yarn tsc --noEmit` 0 errors. Đã kiểm tra trực tiếp qua browser subagent.

- **2026-10-19**:
  - **Khắc phục triệt để lỗi nháy ảnh lộ thông tin khi Admin chuyển sang câu hỏi/ảnh của người khác (`/vote`)**:
    - **Nguyên nhân cốt lõi**:
      1. Thiếu React `key` phụ thuộc vào `questionNumber`: Khi Admin chuyển câu hỏi (ví dụ từ câu 1 sang câu 2), React tái sử dụng cây DOM của `MysteryGridImage` và các thẻ tile `div`. Do các tile có CSS `transition-all duration-700 ease-out`, khi đổi trạng thái từ đã mở (`opacity-0`) về che kín (`opacity-100`), chúng mất tới 700ms để đen lại. Đồng thời thuộc tính `src` của thẻ `<img>` đổi sang ảnh mới ngay lập tức. Trong 700ms chuyển giao đó, ảnh người mới bị nhìn thấy rõ ràng dưới các ô mờ.
      2. Thẻ `<img>` và background ambient blur có CSS `transition-opacity duration-300`/`500`: Khi chuyển câu khiến `revealedTilesSet.size = 0`, ảnh mới fade out chậm trong 300ms thay vì ẩn lập tức.
      3. State `timeLeft` trong `vote/page.tsx` lưu giá trị `0` của câu trước khi Admin vừa chuyển câu mới.
    - **Giải pháp xử lý triệt để**:
      1. **Bổ sung React Key sạch**: Đặt `key={`mystery-grid-${questionNumber}`}` trên `MysteryGridImage`, `key={`tactical-portrait-${questionNumber}`}` trên `TacticalPortrait`, và `key={`question-card-${currentQ.questionNumber}`}` trên `QuestionPhotoCard` & `SlidePhotoDisplay`. Mỗi khi câu hỏi đổi, React unmount hoàn toàn DOM cũ và mount mới toanh ở trạng thái mặc định 100% che kín, triệt tiêu mọi di chứng animation cũ.
      2. **Tấm chắn bảo vệ tuyệt đối (Solid Blackout Curtain)**: Trong `MysteryGridImage`, khi `revealedTilesSet.size === 0 && !forceRevealAll`, kích hoạt lớp màn che đen cứng `#12161F` ở `z-30` (trên cả ảnh và các ô gạch) với huy hiệu `HỒ SƠ BÍ MẬT #${questionNumber}`. Ảnh mới 100% không thể lọt một pixel nào ra ngoài.
      3. **Khóa thẻ `<img>` khi che kín**: Khi `isFullyCovered`, thẻ `img` chính và ảnh ambient nhận class `opacity-0 invisible pointer-events-none` ngay lập tức, loại bỏ fade transition gây leak ảnh.
      4. **Reset `timeLeft` khi đổi câu**: Trong `vote/page.tsx`, thêm `setTimeLeft(0)` ngay trong hook lắng nghe `currentQuestionNumber`.
    - **Kiểm thử & Xác nhận**: `yarn tsc --noEmit` 0 lỗi, `yarn vitest run` 14/14 tests passing.
  - **Cập nhật Thuật toán D4: Bắt buộc chọn người trao quà (Fallback Nam chưa tặng lần nào)**:
    - **Yêu cầu**: Bắt buộc phải có 1 người lên tặng quà cho bạn nữ. Nếu với các điều kiện hiện tại (đoán đúng sớm nhất, đoán sai sớm nhất) không tìm ra ai (ví dụ chưa có ai vote câu đó hoặc mọi người vote câu đó đều đã được trao quà ở các câu khác), thì tự động chọn ra 1 bạn nam từ danh sách người chơi chưa lên tặng lần nào.
    - **Thực hiện**:
      1. Sửa thuật toán `calculateRevealRounds` trong `src/lib/game-engine.ts`: Khi cả Ưu tiên 1 (`FASTEST_CORRECT`) và Ưu tiên 2 (`FASTEST_INCORRECT`) đều không tìm được ứng viên, hệ thống lọc danh sách người chơi nam chưa từng được gán (`gender !== "FEMALE"` và `!assignedUserIds.has(user.id)`) và chọn ra bạn nam kế tiếp theo thứ tự sắp xếp deterministic. Lý do gán: `LUCKY_FALLBACK`.
      2. Cập nhật UI `WinnerSpotlightCard` và `ResultsSummaryTable`: Hiển thị huy hiệu `🎲 CHỌN MAY MẮN (CHƯA TẶNG)`, đồng thời hiển thị đầy đủ tên bạn nam được trao quà và ghi chú đặc cách may mắn thay vì báo rỗng.
      3. Bổ sung Unit Tests trong `src/lib/game-engine.test.ts` kiểm chứng đầy đủ các kịch bản: câu không ai vote vẫn chọn được bạn nam chưa tặng, câu đã hết người vote hợp lệ chọn được bạn nam chưa tặng, và chỉ khi toàn bộ nam trong phòng đều đã trao quà mới trả về `MANUAL`.
    - **Kiểm thử & QA**: `yarn tsc --noEmit` 0 lỗi, `yarn vitest run` 16/16 tests passing.
  - **Cập nhật Gợi ý (Hint) của 14 Bạn Nữ theo Đơn Vị/Team**:
    - **Yêu cầu**: Đổi gợi ý (hint) của 14 bạn nữ thành thông tin team/phòng ban làm việc tương ứng (PD: Product Delivery, BO: Back Office, astarX: A Star X).
    - **Thực hiện**:
      1. Cập nhật danh sách `femaleList` trong `prisma/seed.ts` với gợi ý team chuẩn xác:
         - Phạm Thị Ánh Tuyết, Ngô Thị Thu Hà, Trần Thanh Hằng, Đặng Quỳnh Chi: `Thuộc team Back Office`
         - Chu Yến Nhi, Bùi Thị Khánh Huyền, Hoàng Thùy Linh, Nguyễn Thị Minh Phương, Mai Thu Trang: `Thuộc team Product Delivery`
         - Trần Bảo Yến, Lê Hà Ngân, Lê Khánh Linh, Nguyễn Thị Nhật Anh, Nguyễn Nhật Linh: `Thuộc team A Star X`
      2. Cập nhật trực tiếp dữ liệu trường `hint` của 14 bạn nữ trong cơ sở dữ liệu SQLite hiện tại mà không làm ảnh hưởng đến các tài khoản hay trạng thái game.
    - **Kiểm thử**: `yarn tsc --noEmit` 0 lỗi, `yarn vitest run` 16/16 tests passing.
