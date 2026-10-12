<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Astar 20/10 – Agent Operational Instructions

Mọi AI Agent khi làm việc trong repository này **BẮT BUỘC** phải đọc và tuân thủ các tài liệu trong các thư mục nội bộ sau:

## 1. Project Knowledge & Context (`context/`)
Agent phải tham khảo tài liệu trong `context/` trước khi thiết kế, sửa đổi schema hoặc thêm tính năng:
- [`context/01-product-spec.md`](file:///Users/Astar/Node/astar_20_10/context/01-product-spec.md): Đặc tả nghiệp vụ Astar 20/10, các Epics (A -> F), luồng vote, xử lý trạng thái.
- [`context/02-architecture-design.md`](file:///Users/Astar/Node/astar_20_10/context/02-architecture-design.md): Kiến trúc phân tầng Next.js App Router, Server Actions, SQLite.
- [`context/03-data-models-and-schema.md`](file:///Users/Astar/Node/astar_20_10/context/03-data-models-and-schema.md): Sơ đồ ERD, bảng SQLite, Unique constraints `(userId, selectedName)`.
- [`context/04-algorithm-and-rules.md`](file:///Users/Astar/Node/astar_20_10/context/04-algorithm-and-rules.md): Đặc tả thuật toán trao quà D4 và toàn bộ các trường hợp biên.
- [`context/05-network-and-deployment.md`](file:///Users/Astar/Node/astar_20_10/context/05-network-and-deployment.md): Hướng dẫn kết nối Wi-Fi LAN nội bộ và Checklist trước giờ G.
- [`context/06-progress-tracker.md`](file:///Users/Astar/Node/astar_20_10/context/06-progress-tracker.md): Tiến độ chi tiết, trạng thái từng Epic và nhật ký các phiên làm việc.
- [`context/07-ui-registry.md`](file:///Users/Astar/Node/astar_20_10/context/07-ui-registry.md): Bảng màu Crimson Arena Tokens (`#DC2626`, `#991B1B`, `#F59E0B`), typography và danh mục UI Component.

## 2. Standard Operating Procedures (`workflows/`)
Agent phải tuân theo các quy trình chuẩn khi thực thi nhiệm vụ:
- [`workflows/01-setup-and-seeding.md`](file:///Users/Astar/Node/astar_20_10/workflows/01-setup-and-seeding.md): Quy trình khởi tạo schema và seed dữ liệu 14 bạn nữ + tài khoản nam.
- [`workflows/02-game-operation-flow.md`](file:///Users/Astar/Node/astar_20_10/workflows/02-game-operation-flow.md): Kịch bản vận hành vòng chơi từ Slide -> Vote -> Reveal.
- [`workflows/03-testing-and-qa.md`](file:///Users/Astar/Node/astar_20_10/workflows/03-testing-and-qa.md): Quy trình kiểm thử đơn vị cho thuật toán D4 và type check.

## 3. Reusable Skills (`.agents/skills/`)
Agent sử dụng và bảo trì các module skill độc lập có file `SKILL.md`:
- [`.agents/skills/game-engine/SKILL.md`](file:///Users/Astar/Node/astar_20_10/.agents/skills/game-engine/SKILL.md): Thuật toán D4, bộ điều khiển state machine và exclusion logic.
- [`.agents/skills/sqlite-store/SKILL.md`](file:///Users/Astar/Node/astar_20_10/.agents/skills/sqlite-store/SKILL.md): Quản lý Prisma SQLite, migrations, seed và transactional queries.
- [`.agents/skills/server-api-auth/SKILL.md`](file:///Users/Astar/Node/astar_20_10/.agents/skills/server-api-auth/SKILL.md): Next.js Server Actions, Route Handlers, session auth, và LAN network IP resolver.
- [`.agents/skills/crimson-ui/SKILL.md`](file:///Users/Astar/Node/astar_20_10/.agents/skills/crimson-ui/SKILL.md): Hệ thống Design Tokens, Typography, quy chuẩn UX mobile-first và danh mục UI Component Crimson Arena.
- [`.agents/skills/presentation-engine/SKILL.md`](file:///Users/Astar/Node/astar_20_10/.agents/skills/presentation-engine/SKILL.md): Quản lý màn hình máy chiếu `/slideshow` & `/results`, canvas-confetti, live timer gauge và phím tắt điều khiển.
- [`.agents/skills/admin-operations/SKILL.md`](file:///Users/Astar/Node/astar_20_10/.agents/skills/admin-operations/SKILL.md): Bảng điều khiển Master `/admin`, quản trị game state lifecycle, roster monitoring và LAN QR code modal.
- [`.agents/skills/lan-deployment-qa/SKILL.md`](file:///Users/Astar/Node/astar_20_10/.agents/skills/lan-deployment-qa/SKILL.md): Triển khai mạng LAN Wi-Fi nội bộ, cấu hình Next.js 16 allowedDevOrigins, Vitest test suite và pre-flight QA checklist.
- [`.agents/skills/modular-components/SKILL.md`](file:///Users/Astar/Node/astar_20_10/.agents/skills/modular-components/SKILL.md): Nguyên tắc phân rã chia nhỏ component, tái sử dụng UI primitives có sẵn, và tổ chức file/component theo features.
- [`.agents/skills/theme-token-guard/SKILL.md`](file:///Users/Astar/Node/astar_20_10/.agents/skills/theme-token-guard/SKILL.md): Quy chuẩn Design Tokens, Tailwind v4 custom dark variant, chống hardcode màu và đảm bảo tương phản.

## 4. Slash Commands & Operational Modes (Vibe Coding)
Khi nhận lệnh hoặc thực thi nhiệm vụ, Agent tuân theo quy tắc:
- **`/architect`** (hoặc `/plan`): Thiết kế cấu trúc module/màn hình, xác định luồng dữ liệu và xin xác nhận trước khi viết code.
- **`/review`**: Rà soát chất lượng code, kiểm tra kiểu dữ liệu (`yarn tsc --noEmit`), chạy unit tests (`yarn vitest run`) và tuân thủ [07-ui-registry.md](file:///Users/Astar/Node/astar_20_10/context/07-ui-registry.md).
- **`/remember`**: Cập nhật tiến độ vừa hoàn thành và quyết định kỹ thuật mới vào [06-progress-tracker.md](file:///Users/Astar/Node/astar_20_10/context/06-progress-tracker.md).
- **`/recover`**: Đọc [06-progress-tracker.md](file:///Users/Astar/Node/astar_20_10/context/06-progress-tracker.md) khi bắt đầu phiên làm việc mới để nắm bắt bối cảnh ngay lập tức.
- **`/imprint`**: Cập nhật lại các tài liệu context liên quan khi có sự thay đổi lớn về schema, thuật toán hoặc UI components.

---

## 5. Technology Guidelines & Theme
- **Theme:** Crimson Arena (Primary: `#DC2626`, Secondary: `#991B1B`, Tertiary: `#F59E0B`, Slate Neutral: `#1F242D`).
- **Fonts:** Plus Jakarta Sans (Headlines/Labels) & Inter (Body).
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4.
- **Database:** Prisma ORM + SQLite (file local `prisma/dev.db`).
- **Commands:**
  ```bash
  yarn dev            # Chạy Next.js dev server
  yarn vitest run     # Chạy unit tests
  yarn tsc --noEmit   # Kiểm tra TypeScript typecheck
  ```


<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Ignore routine debugging and unverified changes. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Keep a qualifying candidate through the reporting pass even if you resolve or work around it. A successful fix changes the report outcome; it does not erase the friction that qualified it.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `node node_modules/next/dist/bin/next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
