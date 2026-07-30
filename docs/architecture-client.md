# Kiến trúc — Part `client`

## Tóm tắt điều hành

Client là **multi-page application tĩnh**: 28 trang HTML độc lập, mỗi trang tự khai `<head>`, tự nạp CSS và JS của riêng nó. Không router, không bundler, không framework. Server chỉ đóng vai trò trả file — mọi thứ chạy trong browser.

Mô hình kiến trúc thực tế: **page-scoped module với hai chuẩn cùng tồn tại**. Một nửa codebase theo ES Module tách logic/UI rất kỷ luật; nửa còn lại giao tiếp bằng biến toàn cục `window.*` và thứ tự thẻ `<script>`. Đây là trục chính của mọi công việc refactor.

## Công nghệ

| Hạng mục | Chi tiết |
|---|---|
| Ngôn ngữ | JavaScript ES2020+ (optional chaining, async/await, destructuring) |
| Framework | không có — `document.querySelector` / `createElement` / `innerHTML` trực tiếp |
| Module | ESM ở `js/features/**`, `js/utils/helpers.js`, `js/utils/markdown.js`, 6 file `js/data/*`; phần còn lại là script cổ điển |
| CSS | CSS thuần + 58 custom property; không preprocessor, không CSS-in-JS |
| Font | Google Fonts Inter (CDN, `<link>` mỗi trang) |
| Lưu trữ | IndexedDB (2 db) + localStorage (8 khoá) |
| Speech | Web Speech API (`SpeechSynthesisUtterance`) cho đọc từ vựng |

## Mẫu kiến trúc: hai chuẩn cùng tồn tại

### Chuẩn A — `js/features/**` (đúng, nên nhân rộng)

```
js/features/<tính-năng>/
├── <tính-năng>-logic.js   # thuần hàm, KHÔNG chạm DOM, export nhiều hàm nhỏ
└── <tính-năng>-ui.js      # import logic, render DOM, bind event, export init<X>UI()
```

Ví dụ đo được: `quiz-logic.js` export 26 hàm và không có một lời gọi DOM nào; `quiz-ui.js` export duy nhất một `initQuizUI()`. `vocabulary-logic.js` export 8 hàm, `practice-logic.js` export 10, `game-logic.js` export 12.

Entry trang chỉ làm việc dây nối:

```js
// js/app.js
import { initVocabularyUI } from './features/vocabulary/vocabulary-ui.js';
document.addEventListener('DOMContentLoaded', () => { … initVocabularyUI(); … });
```

Đây là kiến trúc tốt. Nó testable (logic thuần), tách biệt rõ, và không cần framework để đạt được.

### Chuẩn B — phần còn lại (nợ kỹ thuật)

```js
// js/data/interview-data.js
window.interviewTopics = [ … ];

// js/agents/agent-constants.js
window.BMAD_CONSTANTS = { … };
```

Người tiêu thụ đọc trực tiếp `window.*`, phụ thuộc **thứ tự thẻ `<script>`** trong HTML. Không có khai báo dependency ở bất kỳ đâu. Các file thuộc nhóm này: `js/ai-app.js` (405 dòng), `js/home-ai.js`, `js/utils/timer.js` (259 dòng), `js/agents/**` (3 file), và 10 file trong `js/data/**`.

Hệ quả cụ thể: mọi trang có JS đều phải nạp đúng thứ tự 5 file prelude (`timer.js` → `data-meta.js` → `search-index.js` → `spaced-repetition.js` → `progress-db.js`) trước script chính. Đây là hợp đồng ngầm, không ai kiểm tra, và là nguyên nhân trang mới dễ hỏng.

## Quản lý trạng thái

Không có store tập trung. Ba tầng riêng biệt:

1. **Trạng thái phiên** — biến `let` trong closure của mỗi module UI (ví dụ `currentMode`, `selectedAgents` trong `bmad-chat.js`). Mất khi reload.
2. **localStorage** — 8 khoá phẳng: `skillforge_skills`, `skillforge_skill_state`, `skillforge_timer_state`, `skillforge_exam_history`, `skillforge_log`, `quizHistory`, `aiChecklist`, `learnChecklist`. Lưu ý 3 khoá cuối **không có tiền tố** `skillforge_` — không nhất quán.
3. **IndexedDB** — xem [data-models-client.md](./data-models-client.md).

## Tầng component: chưa tồn tại

Đo được:

- **285** class selector định nghĩa trong `css/`, phân bố theo tiền tố trang: `ai-` (93), `sk-` (61), `exam-` (57), `interview-` (48), `learn-` (36), `forge-` (34), `home-` (30), `bmad-` (25)…
- **290** class name khác nhau xuất hiện trong HTML.
- `class="card"` dùng **121 lần** nhưng mỗi trang tự style lại theo prefix riêng.
- **22/28 trang** nhúng `<style>` inline, tổng ~730 dòng.
- `css/components.css` đúng ra phải là tầng dùng chung, thực tế chỉ 3 trang game link tới.

Nghĩa là: cùng một khái niệm thị giác (thẻ, nút, badge, modal) được cài lại nhiều lần dưới nhiều tên. Chi tiết và phương án gom ở [component-inventory-client.md](./component-inventory-client.md).

## Lỗi đã xác nhận trong part này

### C1 — Trang BMAD chat hỏng hoàn toàn (nghiêm trọng)

`js/agents/bmad-chat.js:7`:
```js
const { BMAD_API_ENDPOINT } = window.BMAD_CONSTANTS.API_ENDPOINTS;
```
Nhưng `js/agents/agent-constants.js:5` khai:
```js
API_ENDPOINTS: { AI_FEEDBACK: '/api/ai-feedback', AI_CHAT: '/api/ai-chat', BMAD_CHAT: '/api/bmad/chat' }
```

Không có khoá `BMAD_API_ENDPOINT` → biến là `undefined` → `bmad-chat.js:227` và `:266` gọi `fetch(undefined)`. Browser diễn giải thành URL tương đối `"undefined"` → `POST /undefined` → server không khớp route nào, rơi vào static handler → trả HTML 404 → `resp.json()` ném lỗi. Người dùng gửi tin nhắn và không bao giờ nhận được trả lời.

**Sửa:** đổi dòng 7 thành `const { BMAD_CHAT: BMAD_API_ENDPOINT } = …`, hoặc đổi tên khoá trong constants. Một dòng.

### C2 — CSS của chính trang đó mồ côi (nghiêm trọng vừa)

`css/agents/bmad-chat.css` — 342 dòng, style cho `.bmad-agent-card`, `.chat-msg`, `.chat-bubble`, `.bmad-mode-btn`… **Không trang HTML nào `<link>` tới nó.** `pages/bmad-agents.html` chỉ có 56 dòng `<style>` inline. Toàn bộ class mà `bmad-chat.js` gán vào DOM đều không có style.

**Sửa:** thêm `<link rel="stylesheet" href="../css/agents/bmad-chat.css">` vào `pages/bmad-agents.html`.

### C3 — `js/home-ai.js` là code chết (nhỏ)

Comment đầu `bmad-chat.js` ghi "replaces home-ai.js". Không trang nào load `home-ai.js`. Nên xoá.

### C4 — Parser markdown tự viết, hai bản khác nhau (nhỏ)

`js/utils/markdown.js` (77 dòng, ESM, có escape HTML, hỗ trợ bảng/code block/link nội bộ) và `renderMd()` trong `bmad-chat.js:37` (bản rút gọn 10 dòng). Hai cài đặt song song cho cùng việc. `bmad-chat.js` không import được vì không phải module.

## Chiến lược test

**Không có test nào.** 0 file khớp `*.test.*` / `*.spec.*`, không thư mục `__tests__`, không test runner (không có `package.json`).

Điểm đáng nói: `js/features/**/*-logic.js` là hàm thuần, **đã sẵn sàng để test** mà không cần jsdom hay mock. Đây là chỗ nên đặt test đầu tiên nếu muốn dựng lưới an toàn trước refactor.

## Rủi ro kiến trúc khi refactor

| # | Rủi ro | Mức |
|---|---|---|
| R1 | Không có test → mọi refactor là mù, không biết đã làm vỡ gì | Cao |
| R2 | Dependency ngầm qua thứ tự `<script>` → đổi thứ tự/đổi sang module là vỡ im lặng | Cao |
| R3 | 730 dòng CSS inline rải 22 trang → gom vào component sẽ đụng cascade, dễ lệch giao diện | Trung bình |
| R4 | Không `package.json` → thêm bất kỳ tooling nào là quyết định kiến trúc mới, không phải cài thêm thư viện | Trung bình |
| R5 | 121 chỗ `class="card"` không đồng nhất → gom sai sẽ đổi giao diện ở trang không ngờ tới | Trung bình |
