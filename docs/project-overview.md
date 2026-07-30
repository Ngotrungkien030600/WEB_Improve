# SkillForge — Tổng quan dự án

**Ngày quét:** 2026-07-30 · **Chế độ:** initial_scan / exhaustive · **Loại repo:** multi-part (client + server)

## Dự án này là gì

SkillForge (`projects/web-en/`) là web app tự học **không framework**, phục vụ hai mảng nội dung:

1. **Tiếng Anh** — flashcard từ vựng, 12 thì, luyện câu, kể chuyện, 3 mini-game (memory, scramble, speed-quiz).
2. **Phỏng vấn kỹ thuật** — 30 cheatsheet Java backend (232KB markdown), sinh câu hỏi theo mức lương, chấm điểm câu trả lời bằng AI, lộ trình học, theo dõi kỹ năng.

Cộng thêm một màn **chat 6 persona** đặt tên theo agent BMAD (Mary/Paige/John/Sally/Winston/Amelia). Đây là **tính năng sản phẩm**, không phải BMAD framework — persona là prompt viết tay trong `js/agents/agents-config.js` và `server/config.js`. BMAD thật của repo nằm ở `_bmad/` + `.claude/skills/`, tách biệt hoàn toàn.

## Bảng công nghệ

| Hạng mục | Công nghệ | Phiên bản | Ghi chú |
|---|---|---|---|
| Ngôn ngữ | JavaScript (ES2020+) | — | không TypeScript |
| Framework FE | **không có** | — | DOM API thuần |
| Bundler / build | **không có** | — | không `package.json`, không build step |
| Module | ES Modules **lai** script cổ điển | — | 8 trang `type="module"`, 62 thẻ `<script src>` |
| CSS | CSS thuần + custom properties | — | 58 biến trong `css/variables.css` |
| Server | Node.js `http`/`https`/`fs`/`path` | built-in | **zero dependency** |
| Lưu trữ | IndexedDB + localStorage | — | 2 database, 8 khoá localStorage |
| AI provider | Gemini / OpenAI / Ollama | — | chọn theo biến môi trường |
| Test | **không có** | — | 0 file test |
| CI/CD | **không có** | — | không `.github/workflows` |
| Khởi chạy | `start.bat` (Windows) | — | bật Ollama → mở browser → `node server/index.js` |

## Khối lượng code

| Tầng | Số file | Số dòng |
|---|---|---|
| HTML | 28 | 5.308 |
| JS client | 52 | ~7.600 |
| JS server | 3 | ~500 |
| CSS | 12 | 4.282 |
| Markdown nội dung | 29 | 4.044 |
| **Tổng code** | **95** | **~17.700** |

## Kiến trúc: hai nửa không đồng đều

Codebase chia làm hai vùng chất lượng rất khác nhau — đây là phát hiện quan trọng nhất của lần quét này:

**Vùng đã chuẩn** — `js/features/**` (14 file): tách sạch `*-logic.js` (thuần hàm, không DOM) khỏi `*-ui.js` (chỉ render + bind event), giao tiếp bằng ES Module `import`/`export`. Đây là khuôn mẫu để nhân rộng.

**Vùng chưa chuẩn** — mọi thứ còn lại: `js/agents/**`, `js/ai-app.js`, `js/home-ai.js`, `js/utils/timer.js`, một nửa `js/data/**` dùng biến toàn cục `window.*`, không export. 22/28 trang HTML nhúng CSS inline. Không có tầng component dùng chung.

## Ba lỗi thật đã phát hiện

1. **Trang BMAD chat hỏng hoàn toàn.** `js/agents/bmad-chat.js:7` destructure `BMAD_API_ENDPOINT`, nhưng `js/agents/agent-constants.js:5` khai là `BMAD_CHAT`. Biến thành `undefined` → `fetch(undefined)` POST vào `/undefined` → server trả HTML 404 → JSON parse lỗi.
2. **CSS của trang đó cũng mồ côi.** `css/agents/bmad-chat.css` (342 dòng) không trang nào `<link>` tới. `pages/bmad-agents.html` chỉ có 56 dòng CSS inline.
3. **Server có lỗ path traversal.** `server/index.js` ghép `path.join(ROOT, urlPath)` không chặn `..`, và MIME fallback `application/octet-stream` cho phép tải file không phần mở rộng — nghĩa là `GET /.env` trả về file secret qua HTTP.

Chi tiết ở [architecture-client.md](./architecture-client.md), [architecture-server.md](./architecture-server.md), [component-inventory-client.md](./component-inventory-client.md).

## Liên kết

- [Phân tích cây nguồn](./source-tree-analysis.md)
- [Kiến trúc client](./architecture-client.md) · [Kiến trúc server](./architecture-server.md)
- [Hợp đồng API](./api-contracts-server.md)
- [Mô hình dữ liệu](./data-models-client.md)
- [Kiểm kê component](./component-inventory-client.md) ← nền cho refactor
- [Hướng dẫn phát triển](./development-guide.md) · [Triển khai](./deployment-guide.md)
- [Kiến trúc tích hợp](./integration-architecture.md)
