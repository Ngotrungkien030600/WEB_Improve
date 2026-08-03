# Story 1.2: Màn chat 6 persona gửi và nhận được tin nhắn

Status: ready-for-dev

| Field | Value |
|-------|-------|
| **Story ID** | `1-2-man-chat-6-persona` |
| **Epic** | Epic 1: Legacy app không rò file bí mật, màn chat hoạt động |
| **Depends on** | **1.1** (S1 path traversal đã vá, gỡ NFR2) |
| **Nguồn** | epics.md §Epic 1 Story 1.2 |
| **AD Scope** | AD-15 nhóm (b): `js/agents/bmad-chat.js` (endpoint) + `pages/bmad-agents.html` (CSS link) |

## Story

As a **người dùng muốn hỏi ý kiến các persona**,
I want **mở màn chat, gõ một câu và nhận được trả lời hiển thị đúng**,
so that **tính năng này dùng được thật thay vì im lặng thất bại như hiện nay**.

## Bối cảnh

- `server/config.js:AGENTS` là nguồn sự thật duy nhất cho system prompt.
- `js/agents/agents-config.js` là bản sao — **không** gửi lên server.
- `css/agents/bmad-chat.css` tồn tại 342 dòng nhưng **chưa được link** trong HTML.
- Hiện tại: request đi tới `/undefined`, CSS không load → DOM trần.

## Acceptance Criteria

1. **Chat solo agent (happy path)** — Given server Legacy đang chạy và có khoá AI hợp lệ (hoặc Ollama), When mở `pages/bmad-agents.html`, chọn một agent ở chế độ solo và gửi một tin nhắn, Then request đi tới `/api/bmad/chat` (hiện trạng: `/undefined`), And trả lời hiển thị trong khung chat, And không có lỗi JSON parse trong console.

2. **CSS loaded (happy path)** — Given màn chat được mở, When xem giao diện, Then `css/agents/bmad-chat.css` được nạp và các class `.bmad-agent-card`, `.chat-msg`, `.chat-bubble`, `.bmad-mode-btn` đều có style (hiện trạng: 342 dòng CSS mồ côi, DOM trần).

3. **Party mode multi-agent** — Given chế độ party với từ 2 agent trở lên, When gửi một tin nhắn, Then mỗi agent được chọn đều trả về một mục trong `replies`, And agent nào lỗi thì hiện được cho người dùng chứ không mất tăm.

4. **Error when server down** — Given server Legacy **không** chạy, When gửi tin nhắn, Then người dùng thấy thông báo lỗi rõ ràng, không phải khung chat treo im lặng.

5. **Phạm vi sửa đổi** — Given thay đổi đã xong, When kiểm phạm vi, Then chỉ `js/agents/bmad-chat.js` (tên khoá endpoint) và `pages/bmad-agents.html` (thẻ link CSS) bị sửa — đúng nhóm (b) của AD-15, And `server/config.js:AGENTS` vẫn là nguồn sự thật; bản sao `js/agents/agents-config.js` không được gửi lên server.

## Điểm neo source

- `projects/web-en/js/agents/bmad-chat.js` — file cần sửa (endpoint key)
- `projects/web-en/pages/bmad-agents.html` — file cần sửa (CSS link)
- `projects/web-en/css/agents/bmad-chat.css` — CSS đã tồn tại, chỉ cần link
- `projects/web-en/server/config.js:AGENTS` — nguồn system prompt, không sửa
- `projects/web-en/server/index.js:API_PATHS` — kiểm `BMAD_CHAT` path
- `projects/web-en/js/agents/agents-config.js` — bản sao, không sửa

## Dev Notes

### Bug hiện tại (đã tái hiện: `GET /api/bmad/chat` → 404)

Tìm chỗ `bmad-chat.js` hardcode URL. Endpoint đúng là `API_PATHS.BMAD_CHAT` (kiểm `server/index.js`).

### CSS link

Thêm `<link rel="stylesheet" href="/css/agents/bmad-chat.css">` vào `<head>` của `bmad-agents.html`. Không copy CSS, không đổi tên class.

### Party mode

Kiểm `bmad-chat.js` gọi party endpoint đúng hay sai. Cần gọi `BMAD_CHAT` với body chứa `agentIds: [...]` và `mode: 'party'`.

### Error handling

Thêm `.catch()` trên fetch để hiện lỗi UI thay vì im lặng. Dùng chính element hiện có trong DOM, không thêm thư viện.

### Verify

- Chạy server: `node projects/web-en/server/index.js`
- Mở `http://localhost:8080/pages/bmad-agents.html`
- Chọn 1 agent solo → gửi tin → nhận reply
- Mở DevTools Console → không có `fetch /undefined`
- CSS: inspect element → class `.chat-msg` có style

### Cases (story-ready 2026-07-31)

**Happy:**
1. Chat solo — chọn 1 agent, gửi tin → request `/api/bmad/chat`, reply hiển thị
2. CSS loaded — class `.bmad-agent-card`, `.chat-msg`, `.chat-bubble`, `.bmad-mode-btn` có style

**Edge:**
3. Party mode — chọn 2+ agents, gửi tin → mỗi agent trả 1 mục trong `replies`, body format `{agentIds:[...], mode:'party', message:'...'}`
4. Agent lỗi trong party — 1 agent fail nhưng agent khác vẫn hiện reply

**Error:**
5. Server không chạy → thông báo lỗi rõ ràng cho user
6. API trả error (200 nhưng có error field) → xử lý đúng
7. JSON parse error → thông báo thay vì crash

**Scope:**
8. Chỉ 2 file sửa — `bmad-chat.js` + `bmad-agents.html`

### **Hardened:** light (2026-07-31) — 5 AC, 8 cases (happy 2, edge 2, error 3, scope 1), guard=n/a

### **Implemented:** dev-story (2026-08-03) — 0 files changed (code đã thỏa AC từ ed11880)

## Tasks / Subtasks

- [ ] Task 1 (AC: #1) — Sửa endpoint key trong `bmad-chat.js` từ `/undefined` sang `API_PATHS.BMAD_CHAT`
  - [ ] Subtask: tìm chỗ hardcode URL, thay bằng biến hoặc gọi API_PATHS
- [ ] Task 2 (AC: #2) — Link CSS vào `bmad-agents.html`
  - [ ] Subtask: thêm `<link>` vào `<head>`
- [ ] Task 3 (AC: #3) — Kiểm party mode gọi đúng endpoint
  - [ ] Subtask: verify request body chứa `agentIds` và `mode`
- [ ] Task 4 (AC: #4) — Thêm error handling cho fetch
  - [ ] Subtask: `.catch()` hiện message lỗi rõ ràng
- [ ] Task 5 (AC: #5) — Verify phạm vi chỉ đụng 2 file
  - [ ] Subtask: `git diff` hoặc kiểm tay số file sửa

## Dev Agent Record

### Baseline Commit

`ed11880` (refactor: dựng khung BMAD ở gốc, dời code sản phẩm vào projects/web-en) — code đã đúng từ lúc tạo.

### Completion Notes

- AC #1: Endpoint `BMAD_API_ENDPOINT = '/api/bmad/chat'` — đúng từ commit ed11880, không phải `/undefined`
- AC #2: CSS `<link href="../css/agents/bmad-chat.css">` đã có từ ed11880
- AC #3: Party mode dùng `Promise.allSettled` + `replies[]`, agent error không mất reply
- AC #4: Error handling có `.catch()` + `resp.ok` + `data.error` checks
- AC #5: Chỉ 2 files trong scope (bmad-chat.js + bmad-agents.html)
- Bug C1 (`fetch(undefined)`): không tái hiện — `BMAD_API_ENDPOINT` luôn là string

### File List

```
projects/web-en/js/agents/bmad-chat.js       (verified — đúng từ ed11880)
projects/web-en/pages/bmad-agents.html       (verified — đúng từ ed11880)
```

### Change Log

_(không sửa gì — code đã thỏa mọi AC)_

### File List

```
projects/web-en/js/agents/bmad-chat.js       (sửa)
projects/web-en/pages/bmad-agents.html       (sửa)
```

### Change Log

_(chưa dev)_
