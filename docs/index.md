# Chỉ mục tài liệu — SkillForge (WEB_Improve)

> Đây là **điểm vào chính** cho mọi công việc có AI hỗ trợ trên repo này. Khi chạy `bmad-prd`, `bmad-architecture` hay `bmad-create-epics-and-stories`, hãy trỏ vào file này.

**Sinh ngày:** 2026-07-30 · **Chế độ quét:** initial_scan / exhaustive · **Ngôn ngữ tài liệu:** Tiếng Việt

## Tổng quan

- **Loại repo:** multi-part — `client` (web) + `server` (Node built-in), chạy chung một tiến trình
- **Sản phẩm:** SkillForge — web tự học tiếng Anh + luyện phỏng vấn Java backend
- **Ngôn ngữ chính:** JavaScript (không TypeScript)
- **Kiến trúc:** Vue 3 + Vite là **app chính** (cutover 2026-09-09, story 12-1); `web-en/` giữ làm fallback, không còn phục vụ trực tiếp
- **Quy mô:** ~17.700 dòng / 95 file code (2 app)

## Tham chiếu nhanh

| Part | Loại | Stack | Gốc | Điểm vào |
|---|---|---|---|---|
| `web-app` | **app chính** | Vue 3 + Vite SPA, history mode | `projects/web-app/` | `src/main.js`, `src/router/index.js` |
| `server` | backend + serve build | Node.js `http`/`fs` — **zero dependency** | `projects/web-en/server/` | `server/index.js` |
| `web-en` | fallback (MPA cũ) | Vanilla JS + CSS thuần, IndexedDB | `projects/web-en/` | giữ nguyên, URL `/pages/*.html` đã 301 sang Vue |

**Chạy bản Vue (cách 1 — dev):** `cd projects/web-app && npm run dev` → http://localhost:5173 (`/api` proxy sang :8080)

**Chạy bản Vue (cách 2 — 1 server cùng origin):** `start.bat` hoặc `cd "projects/web-en" && node server/index.js` → http://localhost:8080 — root trả bản build Vue (`web-app/dist`), SPA fallback cho route deep-link, URL legacy `/pages/*.html` đã 301 sang route Vue. Server bind `127.0.0.1`, không mở LAN.

## Tài liệu đã sinh

- [Tổng quan dự án](./project-overview.md) — bắt đầu từ đây
- [Phân tích cây nguồn](./source-tree-analysis.md) — bản đồ thư mục có chú giải
- [Kiến trúc — client](./architecture-client.md) — hai chuẩn module cùng tồn tại, lỗi C1–C4
- [Kiến trúc — server](./architecture-server.md) — 4 route + static, lỗi S1–S5
- [Hợp đồng API](./api-contracts-server.md) — 4 endpoint POST, request/response đầy đủ
- [Mô hình dữ liệu](./data-models-client.md) — 2 IndexedDB, 8 khoá localStorage
- [Kiểm kê component](./component-inventory-client.md) — **nền cho refactor chuẩn hoá component**
- [Hướng dẫn phát triển](./development-guide.md) — chạy, cấu hình, quy ước, bẫy đã biết
- [Hướng dẫn triển khai](./deployment-guide.md) — hiện chưa deploy được, điều kiện tối thiểu
- [Kiến trúc tích hợp](./integration-architecture.md) — 11 điểm tích hợp
- [PRD — Nền tảng đa người dùng M1](./prd-multi-user-m1.md) — **kế hoạch mở cho mọi người dùng** (auth + đồng bộ dữ liệu + quota AI) — chờ duyệt
- [project-parts.json](./project-parts.json) — metadata máy đọc + danh sách 9 lỗi đã xác nhận

## Tài liệu sẵn có trong repo

- [README.md](../README.md) — mô tả sản phẩm của tác giả
- `projects/web-en/interview_java/*.md` — 30 cheatsheet Java (232KB), là **nội dung sản phẩm**, không phải tài liệu kỹ thuật

## Chín lỗi — trạng thái sau story 11.1 (2026-09-09)

Bảng dưới xác minh lại trên code hiện tại, không tin bản cũ. Chi tiết cách sửa: `_bmad-output/implementation-artifacts/11-1-fix-legacy-bugs-con-lai.md`.

| ID | Mức | Vị trí | Vấn đề gốc | Trạng thái |
|---|---|---|---|---|
| **S1** | Cao | `server/index.js` | Path traversal + MIME fallback → rò file secret | ✅ Đã vá (story 1.1) — probe lại: `/.env`, `/../README.md`, ext lạ đều 404 |
| **C1** | Cao | `js/agents/bmad-chat.js` | Destructure sai key → `fetch(undefined)`; về sau tái phát dạng regression `export` trong script classic | ✅ Đã vá (1.1/1.2) + story 11.1 sửa regression: 2 file agents classic-safe, plugin Vite inject export cho `js/agents/` |
| **C2** | Vừa | `css/agents/bmad-chat.css` | CSS mồ côi, không trang link | ✅ Đã vá — `pages/bmad-agents.html` đã `<link>` |
| **S2** | Vừa | `server/index.js` | 4 endpoint AI không auth, không rate limit, CORS `*`, bind mọi interface | ✅ Story 11.1 — bind `127.0.0.1`, bỏ CORS `*`, rate-limit 60 POST/phút/IP (đã verify: 60×400 → 429) |
| **S3** | Thấp | `server/index.js` | Thân request không giới hạn kích thước | ✅ Story 11.1 — giới hạn 1 MB → 413 (đã verify) |
| **S4** | Thấp | `handleSalaryInterview` | Biến `qMatch` chết; fallback gán trùng `id` | ✅ Story 11.1 — bỏ biến chết, id `q-fallback-<n>` duy nhất |
| **S5** | Thấp | `config.js` + `agents-config.js` | System prompt hai bản lệch nhau | ✅ Story 11.1 — xoá bản chết `systemPrompt` ở client; server là nguồn duy nhất |
| **C3** | Thấp | `js/home-ai.js` | Code chết, không trang nào load | ✅ Story 11.1 — đã xoá file |
| **C4** | Thấp | `js/utils/markdown.js` | Hai bản parser markdown song song | ✅ Story 11.1 — `bmad-chat.js` thành module, dùng chung `markdownToHTML` |

## Trạng thái chuyển sang Vue (cutover 2026-09-09 — story 12-1)

- 39/39 trang legacy (`projects/web-en/pages/**`) đều có bản Vue trong registry `src/utils/ported-pages.js` và bảng ánh xạ `src/utils/legacy-redirect.js`.
- Root (`/`), `/index.html` và route deep-link → bản Vue (node server serve `web-app/dist` + SPA fallback; dev Vite 5173 dùng middleware redirect).
- URL cũ `/pages/<trang>.html` → **301** sang route Vue: ở dev (Vite middleware) và ở node server (handler 301, 3 hub lệch quy ước: `ai/hub`, `cloud/hub`, `devops/hub`).
- `web-en/` giữ nguyên trên đĩa làm fallback; chỉ còn `/js`, `/css`, `/api` được serve từ đó.

## Bắt đầu từ đâu

**Nếu bạn định refactor chuẩn hoá component** (mục tiêu đã nêu):
1. Đọc [component-inventory-client.md](./component-inventory-client.md) — có số đo và tập 14 component đích
2. Đọc mục "Rủi ro kiến trúc" trong [architecture-client.md](./architecture-client.md) — R1 (không test) là rủi ro chặn
3. Chạy `bmad-prd` với file index này làm input để chốt phạm vi

**Nếu bạn định sửa lỗi trước:** S1 và C1 là hai cái đáng làm ngay, mỗi cái sửa vài dòng.

**Nếu bạn định thêm tính năng:** theo khuôn `js/features/<tên>/<tên>-logic.js` + `<tên>-ui.js`. Đừng thêm biến `window.*` toàn cục mới.

## Điều cần biết trước khi tin tài liệu này

- Tài liệu sinh từ đọc code ngày 2026-07-30, tại commit local `cfdf237`.
- Số dòng và số đếm selector lấy từ đo thật bằng shell, không ước lượng.
- **S1 và C1 đã tái hiện bằng chạy thật**, không chỉ đọc code: `GET /.env` → HTTP 200 / 192 byte / `application/octet-stream`; `GET /../README.md` → HTTP 200 / 8.579 byte (thoát ra ngoài `ROOT`); `POST /undefined` → 404 `text/html` trong khi `POST /api/bmad/chat` → 400 `application/json` vẫn sống.
- 7 lỗi còn lại (S2–S5, C2–C4) mới xác nhận bằng đọc code, chưa tái hiện.
- Ước lượng công sức refactor trong `component-inventory-client.md` là ước lượng thô theo khối lượng, chưa qua bước chia story.
