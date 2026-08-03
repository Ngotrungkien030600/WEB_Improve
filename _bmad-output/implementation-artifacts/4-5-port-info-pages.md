# Story 4.5: Port Info Pages — ai-agent, accelerator, salary-interview

## Header

- **Epic:** 4 — Port toàn bộ 23 trang còn lại
- **Story ID:** 4.5
- **Status:** review
- **Created:** 2026-08-03

---

**Implemented:** dev-story (2026-08-03) — 7 files

---

## User Story

As a người dùng,
I want truy cập các info pages (AI Agent, Accelerator 30-Day, Phỏng vấn theo lương) trên bản Vue,
So that không cần quay về bản Legacy để học AI Agent, làm Accelerator hay luyện phỏng vấn theo mức lương.

---

## Acceptance Criteria

### AC1: AI Agent page hoạt động

**Given** ai-agent page đã port sang Vue
**When** người dùng mở `/ai/agent`
**Then** hiển thị Forge Timer ở top bar
**And** hiển thị 3 tab: Học (flashcards), Thi (quiz), Bài học (lessons)
**And** tab Học có filter chủ đề (agent, tools, token, quota, edge) và flip card
**And** tab Bài học có sidebar danh sách bài + content area
**And** chuyển tab/filter đều hoạt động (không crash, không sót state)

### AC2: Accelerator page hoạt động (TASK HUB mode)

**Given** accelerator page đã port sang Vue
**When** người dùng mở `/accelerator`
**Then** hiển thị Day 01 với technical concept, practice, vocab chips, system design, key takeaway
**And** có nút điều hướng Trước/Sau giữa các day (1→30)
**And** hiển thị progress bar (X/30 ngày hoàn thành) + XP + streak
**And** nút "Hoàn thành ngày này" chuyển trạng thái completed, lưu localStorage
**And** session timer (Bắt đầu 1h) hiển thị countdown

**Lưu ý quan trọng:** Đây là TASK HUB — không port typing AI real-time, speech recognition, hay SSE streaming. Tạo page vừa đủ dùng, các tính năng phụ trời (typing area, vocab chips, listening) hiển thị nội dung tĩnh nhưng không yêu cầu tương tác real-time.

### AC3: Salary Interview page hoạt động

**Given** salary-interview page đã port sang Vue
**When** người dùng mở `/salary-interview`
**Then** hiển thị grid 4 tier lương (Junior, Mid, Senior, Lead)
**And** hiển thị input số lương tùy chỉnh + custom request
**And** nút "Tạo câu hỏi" gọi API `/api/salary-interview` và render danh sách câu hỏi
**And** mỗi câu hỏi có details/summary với sample answer + keywords
**And** nếu API lỗi → vẫn hiển thị câu hỏi từ data tĩnh (graceful fallback)

---

## Technical Notes

### Legacy Files

- `web-en/pages/ai-agent.html` — 3 tabs (Learn flashcards, Quiz, Lessons) + Forge Timer
- `web-en/pages/accelerator.html` — 30-day path với day navigation, session timer, AI streaming
- `web-en/pages/salary-interview.html` — tier buttons + AI-generated questions

### Strategy

**ai-agent.html:** Phức tạp (3 tabs, flip card, quiz, lesson list, forge timer). Tương tự EnglishPage — chia 3 tab trong 1 page, dùng `v-if` từng section. Data từ `@legacy/js/data/ai-agent-data.js` (window.aiAgentConcepts). Quiz tab có thể làm stub hiển thị thông báo "Quizz UI chưa port" — chỉ cần Learn + Lessons tab hoạt động đầy đủ.

**accelerator.html:** Rất phức tạp (typing AI streaming, SSE, speech recognition, BroadcastChannel). **TASK HUB mode** — chỉ port phần điều hướng giữa các day + hiển thị nội dung. Tái dùng `accelerator-logic.js` cho state (`getCurrentDay`, `setCurrentDay`, `completeDay`, `getProgress`). Phần typing AI, speech, transcript → hiển thị placeholder "Tính năng real-time chưa port".

**salary-interview.html:** Đơn giản hơn. Data từ `@legacy/js/data/salary-interview-data.js` (window.salaryInterviewData). Tái dùng các method `getTier`, `getNextTier`. Nút "Tạo câu hỏi" gọi API nhưng fallback về data tĩnh nếu lỗi.

### Data Access

- **ai-agent-data.js:** `window.aiAgentConcepts` — array concepts. File đã có `export` (cần verify) hoặc dùng vite-plugin-legacy-strip-export.
- **accelerator-data.js:** `ACCELERATOR_DAYS` — array 30 days. **Verify file có export** trước khi port.
- **salary-interview-data.js:** `window.salaryInterviewData` — object chứa tiers. Plugin tự strip.
- **accelerator-logic.js:** ES module sẵn — import vào page.

### No R6 Data (chỉ accelerator có localStorage)

- ai-agent: light mode (no localStorage)
- accelerator: có `sf_accelerator_state` localStorage — progress, streak, XP. Tái dùng qua `@legacy/js/features/accelerator/accelerator-logic.js`.
- salary-interview: light mode (no localStorage)

### Accent Color

- **ai-agent:** Hub hiện tại `accent: #f472b6` (pink) — giữ nguyên cho consistency.
- **accelerator:** Không có accent đặc biệt — dùng token mặc định.
- **salary-interview:** Accent `#7c5cfc` (purple) — đã có sẵn trong inline style Legacy.

### Components Reuse

- `CTopbar` cho top bar
- `CGrid` cho grid layout (ai-agent lessons, salary tier buttons)
- `CHubCard` không phù hợp — Accelerator dùng day cards riêng, salary-interview dùng tier buttons riêng

### No New CSS Tokens

- Không thêm biến CSS mới vào `web-en/css/variables.css`
- Accent colors đặt qua `style="--color-accent: ..."` inline trên root element (AD-17)

---

## Files to Create/Modify

### Create
- `src/pages/AiAgentPage.vue` — AI Agent page (3 tabs)
- `src/pages/AcceleratorPage.vue` — Accelerator 30-day page (TASK HUB mode)
- `src/pages/SalaryInterviewPage.vue` — Salary Interview page

### Modify
- `src/router/index.js` — thêm 3 routes mới
- `src/utils/ported-pages.js` — thêm 3 entries
- `src/pages/JavaHubPage.vue` — link `/salary-interview` chuyển sang được (đã có sẵn)
- `src/pages/FrontendHubPage.vue` / `src/pages/HomePage.vue` — link `/accelerator` chuyển sang được (đã có sẵn từ story 4.4)

### Verify
- `web-en/js/data/ai-agent-data.js` — có `export const aiAgentConcepts = window.aiAgentConcepts;` chưa?
- `web-en/js/data/accelerator-data.js` — có `export const ACCELERATOR_DAYS = window.ACCELERATOR_DAYS;` chưa?
- Nếu chưa → thêm dòng export (theo AD-16, group (d) của AD-15).

---

## Non-Functional Requirements

- **NFR1:** Legacy app luôn chạy được — port song song, không tháo bản Legacy
- **NFR3:** Dùng `CTopbar`, `CGrid` (component reuse) — không viết lại markup khung
- **AD-3:** Import qua `@legacy` alias — không `../web-en/`
- **AD-8:** Không hex cứng trong components — chỉ inline trên root element của page
- **AD-10:** `<style scoped>` cho page components
- **AD-12:** Vỏ trang ghép từ `CTopbar` + content
- **AD-17:** Accent đặt qua inline `--color-accent` — không thêm token mới
- **NFR5:** Kiểm thủ công 5 mục (bố cục, màu, khoảng cách, cỡ chữ, hover) — không viết test UI

---

## Learnings từ Story 4.4

- EnglishPage + FrontendHubPage dùng `style="--color-accent: #XXX"` inline trên root, sau đó `CTopbar`/`CHubCard` đọc qua `var(--color-accent)`. Áp dụng pattern tương tự.
- Story 4.4 fix 3 issues: (1) rgba trong `<style scoped>` không có CSS fallback → thay bằng `var(--color-X, rgba(...))`; (2) link thừa; (3) import thừa. Tránh lặp lại.
- File `LearningsPage` dùng `@import '@legacy/css/variables.css'` trong `<style scoped>` — pattern ok, dùng lại.
- Nên dùng `handleNavigate(path)` qua `navigate()` util — không gọi `router.push` trực tiếp từ page.

---

## Out of Scope

- **accelerator:** KHÔNG port typing AI streaming, SSE event source, speech recognition, BroadcastChannel realtime sync. Chỉ port phần điều hướng + progress.
- **ai-agent:** Quiz tab có thể stub đơn giản (hiển thị "tab này chưa port" hoặc render câu hỏi dạng list không có timer). Hoặc port quiz UI đầy đủ nếu thời gian cho phép — không bắt buộc.
- **salary-interview:** Không cần persistence lịch sử câu hỏi AI đã tạo.

---

## Acceptance Verification

Sau khi dev xong, kiểm tra:

1. `npm run dev` chạy OK, mở `/ai/agent`, `/accelerator`, `/salary-interview`
2. Từ HomePage, click "🚀 Accelerator 30-Day" → tới `/accelerator` (router, không phải Legacy)
3. Từ JavaHubPage, click "💰 Phỏng vấn theo lương" → tới `/salary-interview` (router)
4. Từ AI hub (nếu có link), click "🤖 AI Agent" → tới `/ai/agent`
5. So 5 mục thủ công (bố cục, màu, khoảng cách, cỡ chữ, hover) với Legacy
6. Legacy app vẫn chạy bình thường (NFR1)
