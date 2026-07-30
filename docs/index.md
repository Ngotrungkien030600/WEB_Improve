# Chỉ mục tài liệu — SkillForge (WEB_Improve)

> Đây là **điểm vào chính** cho mọi công việc có AI hỗ trợ trên repo này. Khi chạy `bmad-prd`, `bmad-architecture` hay `bmad-create-epics-and-stories`, hãy trỏ vào file này.

**Sinh ngày:** 2026-07-30 · **Chế độ quét:** initial_scan / exhaustive · **Ngôn ngữ tài liệu:** Tiếng Việt

## Tổng quan

- **Loại repo:** multi-part — `client` (web tĩnh) + `server` (Node built-in), chạy chung một tiến trình
- **Sản phẩm:** SkillForge — web tự học tiếng Anh + luyện phỏng vấn Java backend
- **Ngôn ngữ chính:** JavaScript (không TypeScript)
- **Kiến trúc:** Multi-page application tĩnh, không framework, không bundler
- **Quy mô:** ~17.700 dòng / 95 file code

## Tham chiếu nhanh

| Part | Loại | Stack | Gốc | Điểm vào |
|---|---|---|---|---|
| `client` | web | Vanilla JS + CSS thuần, IndexedDB | `projects/web-en/` | `index.html`, 7 file `*-app.js` |
| `server` | backend | Node.js `http`/`fs` — **zero dependency** | `projects/web-en/server/` | `server/index.js` |

**Chạy:** `start.bat` (Windows) hoặc `cd "projects/web-en" && node server/index.js` → http://localhost:8080

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
- [project-parts.json](./project-parts.json) — metadata máy đọc + danh sách 9 lỗi đã xác nhận

## Tài liệu sẵn có trong repo

- [README.md](../README.md) — mô tả sản phẩm của tác giả
- `projects/web-en/interview_java/*.md` — 30 cheatsheet Java (232KB), là **nội dung sản phẩm**, không phải tài liệu kỹ thuật

## Chín lỗi đã xác nhận

Xếp theo mức nghiêm trọng. Chi tiết và cách sửa nằm trong tài liệu kiến trúc tương ứng.

| ID | Mức | Vị trí | Vấn đề |
|---|---|---|---|
| **S1** | Cao | `server/index.js` | Path traversal + MIME fallback → `GET /.env` trả file secret qua HTTP |
| **C1** | Cao | `js/agents/bmad-chat.js:7` | Destructure sai tên khoá → `fetch(undefined)` → trang BMAD chat hỏng hoàn toàn |
| **S2** | Vừa | `server/index.js` | 4 endpoint AI không auth, không rate limit, CORS `*` |
| **C2** | Vừa | `css/agents/bmad-chat.css` | 342 dòng CSS mồ côi, không trang nào link |
| **S3** | Thấp | `server/index.js` | Thân request không giới hạn kích thước |
| **S4** | Thấp | `handleSalaryInterview` | Biến `qMatch` chết; fallback gán trùng `id` |
| **S5** | Thấp | `config.js` + `agents-config.js` | 6 system prompt hai bản đã lệch nhau |
| **C3** | Thấp | `js/home-ai.js` | Code chết, không trang nào load |
| **C4** | Thấp | `js/utils/markdown.js` | Hai bản parser markdown song song |

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
