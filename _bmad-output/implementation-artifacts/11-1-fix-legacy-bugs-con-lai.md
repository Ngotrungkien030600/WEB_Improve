# Story 11.1: Fix các lỗi Legacy còn hiệu lực (S2–S5, C1–C4)

## Context

Bảng "Chín lỗi đã xác nhận" trong `docs/index.md` sinh ngày 2026-07-30 đã cũ so với code hiện tại. Story này **xác minh lại từng lỗi trên code thật rồi fix phần còn hiệu lực**, không sửa theo trí nhớ của tài liệu.

**Trạng thái đo được trên code hiện tại (2026-08-13+):**

| ID | Trạng thái thật | Bằng chứng |
|---|---|---|
| S1 | ✅ Đã vá (story 1.1) | `server/index.js` có `path.resolve().startsWith(ROOT)` + chặn dotfile + chặn ext lạ; probe thật `GET /.env`→404, `/../README.md`→404, `/test.xyz`→404 |
| C1 | ❌ **Vẫn hỏng, dạng mới** | `agent-constants.js`/`agents-config.js` có `export const` ở cuối nhưng `pages/bmad-agents.html` load bằng `<script src>` classic → SyntaxError → `window.BMAD_CONSTANTS`/`window.BMAD_AGENTS` không tồn tại → `bmad-chat.js` crash. (Lỗi gốc destructure thiếu key đã sửa: key `BMAD_API_ENDPOINT` nay tồn tại.) |
| C2 | ✅ Đã vá | `pages/bmad-agents.html:13` đã `<link>` `css/agents/bmad-chat.css` |
| C3 | ❌ Còn | `js/home-ai.js` không trang nào load (code chết, được thay bởi `bmad-chat.js`) |
| C4 | ❌ Còn | `bmad-chat.js:renderMd` (parser rút gọn ~10 dòng) song song với `js/utils/markdown.js` (parser đầy đủ, Vue dùng) |
| S2 | ❌ Còn | `server.listen(PORT)` bind mọi interface (thấy trong log: `address: '::'`); static trả `Access-Control-Allow-Origin: *`; 5 endpoint POST không rate limit |
| S3 | ❌ Còn | 5 handler `req.on('data', chunk => body += chunk)` không ngưỡng |
| S4 | ❌ Còn | `handleSalaryInterview` fallback: biến `qMatch` chết; mọi câu fallback cùng `id: 'q-fallback'` |
| S5 | ❌ Còn | `systemPrompt` trong `js/agents/agents-config.js` là bản copy chết, không code nào đọc (server dùng `server/config.js:AGENTS` làm nguồn) |

**Ràng buộc bảo toàn (từ `docs/repo-risks.md`):** `web-app/` build phải còn import được `@legacy/js/agents/*` (BmadAgentsPage.vue) và `@legacy/js/utils/markdown.js`. Legacy `web-en` luôn chạy được.

---

## Story A — S2: Server chỉ phục vụ localhost + không CORS mở + rate-limit

**Priority:** P1 | **Estimate:** 30 phút

**Problem:**
- `server.listen(PORT)` bind `::` → máy khác trong LAN gọi được cổng 8080, mỗi request POST tiêu token AI của chủ máy.
- Static file trả `Access-Control-Allow-Origin: *`.
- 5 endpoint POST không giới hạn tần suất.

**Solution:**
- `server.listen(PORT, '127.0.0.1', …)` — chỉ lắng nghe loopback.
- Bỏ header `Access-Control-Allow-Origin: *` ở static (mặc định same-origin; Vue dev đã proxy qua Vite nên không cần CORS).
- Thêm rate-limit đơn giản trong bộ nhớ: mỗi IP tối đa 60 request POST/phút, vượt → HTTP 429 JSON.
- Ghi chú trong code: app cá nhân chạy localhost, không auth.

**Acceptance Criteria:**
- [ ] `GET /index.html` → 200, response **không** có `Access-Control-Allow-Origin`.
- [ ] Server báo `listening on 127.0.0.1:PORT` (log) và không bind `::`.
- [ ] Gửi >60 POST/phút từ cùng IP → request 61+ trả 429 JSON.
- [ ] Legacy chat & Vue dev proxy vẫn gọi được POST (same-origin / proxy).

## Story B — S3: Giới hạn kích thước thân request

**Priority:** P1 | **Estimate:** 20 phút

**Problem:** 5 handler POST gộp body không ngưỡng → POST lớn nuốt RAM.

**Solution:** Helper `readJsonBody(req, res, onOk)` đọc tối đa `MAX_BODY_BYTES = 1 MB`, vượt → 413 JSON `{"error":"Request body too large"}`, JSON hỏng → 400. Thay 5 chỗ `req.on('data'...)` hiện có.

**AC:**
- [ ] POST body > 1 MB → 413 (không crash tiến trình).
- [ ] POST body JSON hỏng → 400 như cũ.
- [ ] POST hợp lệ nhỏ → handler chạy bình thường.

## Story C — S4: Dọn fallback parse trong `handleSalaryInterview`

**Priority:** P2 | **Estimate:** 10 phút

**Problem:** `qMatch` khai không dùng; fallback gán trùng `id: 'q-fallback'` cho mọi câu.

**Solution:** Bỏ `qMatch`; id fallback duy nhất theo chỉ số dòng: `q-fallback-<n>`.

**AC:**
- [ ] Không còn biến chết (đọc code).
- [ ] Fallback trả về mảng câu hỏi với id khác nhau từng phần tử.

## Story D — C1: Trang BMAD chat chạy lại (regression `export` trong script classic)

**Priority:** P0 | **Estimate:** 30 phút

**Problem:** `agent-constants.js` & `agents-config.js` kết thúc bằng `export const X = window.X;` (thêm để Vue import) — nhưng `pages/bmad-agents.html:50-51` load 2 file này bằng `<script src>` classic → SyntaxError cả file → chat BMAD chết.

**Solution (đúng cơ chế hai lớp của repo, xem `CLAUDE.md`):**
- Bỏ 2 dòng `export const` cuối file → source chỉ còn `window.X = …`, classic load an toàn.
- Mở rộng `vite-plugin-legacy-strip-export.js`: áp dụng inject `export const X = window.X;` cho cả thư mục `/web-en/js/agents/` (hiện chỉ `/web-en/js/data/`) → `BmadAgentsPage.vue` import `{ BMAD_AGENTS, BMAD_CONSTANTS }` vẫn build được.
- (Bản gốc destructure thiếu key `BMAD_API_ENDPOINT` đã được sửa bằng cách thêm key — giữ nguyên.)

**AC:**
- [ ] `pages/bmad-agents.html` load không còn lỗi parse (mở trang → grid 7 agent hiện, không console SyntaxError).
- [ ] Gửi tin nhắn solo → POST tới `/api/bmad/chat` (không còn `fetch(undefined)`).
- [ ] `npm run build` (web-app) pass, `BmadAgentsPage` import được 2 named export.

## Story E — C4: Một parser markdown duy nhất cho chat BMAD

**Priority:** P2 | **Estimate:** 30 phút

**Problem:** `bmad-chat.js` tự viết `renderMd()` (~10 dòng) song song với `js/utils/markdown.js` (parser đầy đủ, chính là bản Vue đang dùng) → hai hành vi lệch nhau.

**Solution:** Chuyển `bmad-chat.js` thành ES module (`<script type="module">` trong trang) và import `markdownToHTML` + `escapeHtml` từ `js/utils/`; bỏ `renderMd`, thay bằng `markdownToHTML(escapeHtml(text))` — giữ hành vi escape-trước như cũ, parser duy nhất là `markdown.js`.

**AC:**
- [ ] File `bmad-chat.js` không còn định nghĩa parser riêng (chỉ còn gọi `markdownToHTML`).
- [ ] Solo/Party hiển thị reply vẫn đúng bold/italic/code (so sánh trước-sau bằng mắt).
- [ ] Trang không vỡ console (không lỗi import).

## Story F — C3: Xoá code chết `js/home-ai.js`

**Priority:** P2 | **Estimate:** 5 phút

**Problem:** `js/home-ai.js` không trang nào load (đã grep toàn repo), header `bmad-chat.js` ghi "replaces home-ai.js".

**Solution:** Xoá file. (Đã được chủ repo xác nhận đồng ý xoá.)

**AC:**
- [ ] `home-ai.js` không còn tồn tại.
- [ ] Grep toàn repo không còn tham chiếu `home-ai.js`.

## Story G — S5: Bỏ bản `systemPrompt` chết ở client

**Priority:** P2 | **Estimate:** 15 phút

**Problem:** 7 `systemPrompt` trong `js/agents/agents-config.js` là copy chết (không code nào đọc — server dùng `server/config.js:AGENTS`); để lại thì lệch bản như lỗi S5 cũ.

**Solution:** Xoá field `systemPrompt` khỏi `agents-config.js` (giữ `role`/`title`/`shortDesc`/`welcome` cho UI). `server/config.js:AGENTS` thành nguồn duy nhất cho prompt LLM.

**AC:**
- [ ] Grep toàn repo: `systemPrompt` chỉ còn ở `server/config.js` (server) — không còn ở client.
- [ ] UI agent (tên/icon/welcome) không đổi.

---

## Ghi chú thực thi

- Không sửa hành vi LLM: prompt server giữ nguyên.
- Story 11.1 = 1 file duy nhất (plan này), các story A–G là các fix nhỏ trong cùng lượt; mỗi fix đều verify bằng chạy thật trước khi đóng.

---

## Implemented — 2026-09-09

- ✅ Story A (S2): `server/index.js` — `listen(PORT, '127.0.0.1')`, bỏ `Access-Control-Allow-Origin: *`, rate-limit 60 POST/phút/IP. Verify thật: 60×400 rồi 429; response static không còn header ACAO.
- ✅ Story B (S3): helper `readJsonBody` giới hạn 1 MB. Verify thật: body 1,3 MB → 413.
- ✅ Story C (S4): bỏ biến chết `qMatch`, fallback dùng `q-fallback-<n>` duy nhất.
- ✅ Story D (C1): xoá dòng `export const` cuối `agent-constants.js`/`agents-config.js` (classic-safe); mở rộng `vite-plugin-legacy-strip-export.js` inject export cho `/web-en/js/agents/`. Verify: `npm run build` (web-app) PASS — `BmadAgentsPage` import được.
- ✅ Story E (C4): `bmad-chat.js` thành ES module (`<script type="module">`), bỏ `renderMd` tự viết, dùng chung `markdownToHTML` từ `js/utils/markdown.js`.
- ✅ Story F (C3): đã xoá `js/home-ai.js`; grep toàn repo chỉ còn comment lịch sử trong `bmad-chat.js`.
- ✅ Story G (S5): `systemPrompt` không còn ở client; `server/config.js:AGENTS` là nguồn duy nhất.

**Trạng thái:** review — chờ duyệt mắt UI chat (renderMd → markdownToHTML đổi cách render list/heading) và code-review theo quy trình BMAD.
