# Hướng dẫn phát triển

## Yêu cầu

| Thành phần | Bắt buộc? | Ghi chú |
|---|---|---|
| Node.js | ✓ | Phiên bản **không được khai báo** ở đâu (không `package.json`, không `.nvmrc`). Code dùng optional chaining + `Promise.allSettled` → tối thiểu Node 12.9, thực tế nên Node 18+ |
| Ollama | tuỳ chọn | Chỉ cần khi muốn chạy AI offline. `start.bat` tự bật |
| Khoá API | tuỳ chọn | `GEMINI_API_KEY` hoặc `OPENAI_API_KEY` trong `projects/web-en/.env` |

**Không cần `npm install`** — dự án zero dependency.

## Chạy local

**Windows (cách chính thức):**
```
start.bat
```
Script này: bật Ollama serve ở nền → chờ 3 giây → mở `http://localhost:8080` → chạy `node server/index.js`.

**Mọi hệ điều hành:**
```bash
cd "projects/web-en"
node server/index.js
# → http://localhost:8080
```

⚠ **Chỉ chạy trên localhost.** Static handler của server có lỗ path traversal và trả được `.env` qua HTTP (lỗi S1 trong [architecture-server.md](./architecture-server.md)). Đừng bind ra `0.0.0.0` hay mở port ra LAN cho tới khi vá.

## Cấu hình

Tạo `projects/web-en/.env` (đã nằm trong `.gitignore`):

```
GEMINI_API_KEY=***
OPENAI_API_KEY=***
OLLAMA_MODEL=qwen2.5:7b
PORT=8080
```

Thứ tự ưu tiên provider trong `ai-service.js:callAI()`: **Gemini → OpenAI → Ollama**. Không có khoá nào thì rơi về Ollama local.

`.env` được parse **thủ công** tại `server/index.js:10-27`, không dùng `dotenv`. Biến môi trường có sẵn của hệ thống thắng giá trị trong file.

## Build

Chỉ có **một** build step trong toàn dự án, và phải chạy tay:

```bash
cd "projects/web-en"
node build-interview-data.js    # interview_java/*.md → js/data/interview-data.js
```

Chạy lại mỗi khi sửa file trong `interview_java/`. Không có watcher.

Ngoài ra không có bundler, không transpile, không minify. Sửa file JS/CSS là refresh browser thấy ngay (server gửi `Cache-Control: no-store`).

## Test

**Chưa có test nào.** Không test runner, không file test, không CI.

Nếu dựng test, chỗ đáng bắt đầu là `js/features/**/*-logic.js` — các file này là hàm thuần, không chạm DOM, chạy được trong Node trực tiếp:

```js
// ví dụ: quiz-logic.js export 26 hàm, không có lời gọi DOM nào
import { … } from './js/features/quiz/quiz-logic.js';
```

Node 18+ có sẵn `node --test`, không cần thêm dependency — giữ được nguyên tắc zero-dep của dự án.

## Quy ước code hiện hành

Quan sát từ codebase (chưa có tài liệu quy ước chính thức nào):

| Khía cạnh | Quy ước thực tế |
|---|---|
| Ngôn ngữ định danh | Tiếng Anh cho biến/hàm/file |
| Ngôn ngữ UI & comment | Tiếng Việt |
| Đặt tên file | `kebab-case.js` |
| Cấu trúc tính năng | `<tên>-logic.js` (hàm thuần) + `<tên>-ui.js` (DOM) — **theo khuôn này cho code mới** |
| Đặt tên CSS | Hiện là `<prefix-trang>-<phần tử>`; đích đến là tên theo vai trò — xem [component-inventory-client.md](./component-inventory-client.md) |
| Escape HTML | Dùng `escapeHtml()` từ `js/utils/helpers.js` trước khi nhét vào `innerHTML` |
| Module | ESM cho code mới. Không thêm `window.*` toàn cục mới |

## Việc thường làm

**Thêm một trang mới:** tạo HTML trong `pages/`, link `variables.css` + `base.css` trước, rồi CSS riêng. Nếu trang cần JS, nạp đúng thứ tự 5 file prelude (`timer.js` → `data-meta.js` → `search-index.js` → `spaced-repetition.js` → `progress-db.js`) trước script chính — đây là hợp đồng ngầm, sai thứ tự là vỡ im lặng.

**Thêm một tính năng:** tạo `js/features/<tên>/` với cặp `-logic.js` + `-ui.js`, `import` từ entry của trang.

**Sửa nội dung phỏng vấn:** sửa `interview_java/*.md` rồi chạy lại `build-interview-data.js`.

**Sửa persona agent:** nguồn sự thật là `server/config.js:AGENTS`. Bản sao trong `js/agents/agents-config.js` hiện không được gửi lên server và đã lệch — xem lỗi S5.

## Bẫy đã biết

1. `pages/bmad-agents.html` hỏng (lỗi C1 + C2) — sửa trước khi đụng vào.
2. `js/home-ai.js` là code chết, không trang nào load.
3. `css/agents/bmad-chat.css` không được link ở đâu.
4. Ba nơi cùng lưu lịch sử bài làm: `quizHistory`, `skillforge_exam_history`, `progressDB.sessions`.
5. Default Ollama model lệch: `config.js` ghi `qwen2.5:1.5b`, `start.bat` và thông báo lỗi ghi `qwen2.5:7b`.
