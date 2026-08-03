# Story 3.2 — Màn phỏng vấn chạy trên Vue, checklist cũ còn nguyên

**Epic:** Epic 3 — Màn có logic chạy trên bản Vue, tiến độ cũ còn nguyên
**Story ID:** 3-2-man-phong-van-tren-vue
**Status:** ready-for-dev
**Mode:** hard
**Hardened:** hard (2026-08-03) — 7 AC, 17 cases (happy 5 / biên 5 / lỗi 3 / invariant 4), guard=n/a (manual FR-6)
**Implemented:** dev-story (2026-08-03) — 5 files (interview-logic.js, interview-data.js, build-interview-data.js, InterviewPage.vue) + router + registry + CRLF fix in build script

---

## As a

Người đang ôn phỏng vấn,
I want mở màn phỏng vấn trên bản Vue và thấy checklist tôi đã tick từ trước,
So that tôi tin rằng chuyển sang Vue không làm mất tiến độ đã tích luỹ.

*Chọn màn này làm màn logic đầu tiên vì nó là màn duy nhất chạm cùng lúc ba invariant khó nhất: AD-5 (`interview-logic.js:20` đọc `window.interviewTopics`), AD-16 (`interview-data.js` xuất bằng `window.*`), AD-6 (`interview-logic.js:9,16` tự ghi `localStorage.interviewChecklist`).*

---

## Nguồn thực tế

**ĐỌC FILE GỐC TRƯỚC KHI CODE:**

- `projects/web-en/js/features/interview/interview-logic.js` — 6 hàm logic, đọc `window.interviewTopics` tại dòng 20
- `projects/web-en/js/data/interview-data.js` — dữ liệu gán `window.interviewTopics`, cần thêm `export`
- `projects/web-en/build-interview-data.js` — script sinh `interview-data.js`, cần giữ dòng `export` khi chạy lại
- `projects/web-en/js/features/interview/interview-ui.js` — UI layer, gọi 6 hàm logic
- `projects/web-en/pages/interview.html` — Legacy page
- `projects/web-en/css/interview.css` — styles
- `projects/web-en/js/utils/markdown.js` — `markdownToHTML` dùng trong `interview-ui.js`

---

## Invariants bị đụng

| Surface | Mô tả | Chi tiết |
|---------|--------|----------|
| AD-5 (R5) | `getTopics()` đọc `window.interviewTopics` | Dòng 20: `return window.interviewTopics \|\| []` |
| AD-16 (R8) | `interview-data.js` xuất bằng `window.*` | Không có `export` — Vue không import được |
| AD-6 (R6) | `interview-logic.js` tự ghi `localStorage.interviewChecklist` | Dòng 5, 9, 16 |
| R1 | Layer boundary | Vue page gọi logic qua `@legacy` |
| R3 | `@legacy` là đường DUY NHẤT | Không relative import `../web-en/` |
| R4 | Logic framework-free | `@legacy/features/**` không import `vue` |

---

## Acceptance Criteria

### AC-1: 6 hàm logic reuse qua @legacy (AD-3, FR7)

**Given** `interview-logic.js` export 6 hàm
**When** màn phỏng vấn bản Vue được dựng
**Then** cả 6 hàm được **dùng lại** qua alias `@legacy`, không hàm nào bị viết lại trong `web-app/`
**And** `grep -rn "interview-logic" projects/web-app/src` chỉ ra đường import qua `@legacy`, không có đường tương đối `../web-en/`
**And** không tồn tại file cùng tên trong `web-app/`

### AC-2: getTopics nhận dữ liệu qua tham số (AD-5)

**Given** `interview-logic.js:20` hiện đọc `window.interviewTopics`
**When** hàm được sửa để Vue dùng được
**Then** `getTopics` **nhận dữ liệu qua tham số**, không đọc `window.*`
**And** giá trị mặc định giữ đường cũ, nên màn phỏng vấn **bản Legacy vẫn chạy y như trước** (NFR1)
**And** `grep -rn "window\." projects/web-app/src` không có phép gán `window.*` mới nào

### AC-3: interview-data.js thêm export (AD-16)

**Given** `interview-data.js` xuất bằng `window.interviewTopics`
**When** Vue app cần dữ liệu đó
**Then** một dòng `export` được **thêm** cạnh phép gán `window.*` đang có; phép gán cũ giữ nguyên
**And** Vue app lấy dữ liệu bằng `import` ESM từ `@legacy/data/interview-data.js`
**And** không dùng `?raw`, không `eval`, không khai lại dữ liệu trong `web-app/`
**And** `build-interview-data.js` được sửa để lần chạy sau vẫn giữ dòng `export`

### AC-4: Checklist cũ còn nguyên ở cùng origin (FR6, AD-6)

**Given** trước đó đã tick vài mục checklist ở bản Legacy, dữ liệu nằm trong `localStorage.interviewChecklist`
**When** mở màn phỏng vấn bản Vue ở **cùng origin**
**Then** đúng những mục đã tick hiện ra đã tick
**And** tick thêm một mục ở bản Vue rồi mở lại bản Legacy thì thấy mục đó đã tick — **một nơi lưu, một người ghi** (AD-6)
**And** Vue app **không** dựng adapter riêng cho `interviewChecklist`; nó đọc/ghi qua chính `interview-logic.js`

### AC-5: Giao diện + thao tác khớp bản Legacy (FR6, NFR5)

**Given** màn phỏng vấn bản Vue
**When** so với bản Legacy theo năm mục và thử mọi thao tác
**Then** năm mục khớp, và mọi thao tác làm được ở bản Legacy đều làm được ở bản Vue
**And** phần trăm tiến độ tính ra khớp nhau giữa hai bản

### AC-6: Phạm vi sửa web-en đúng nhóm (c) và (d) (AD-15)

**Given** thay đổi đã xong
**When** kiểm phạm vi sửa trên `web-en/`
**Then** chỉ đụng nhóm (c) và (d) của AD-15 — chữ ký `getTopics`, dòng `export` ở file dữ liệu, và `build-interview-data.js`
**And** không refactor cơ hội nào khác trên `web-en/`

### AC-7: Router + registry cập nhật (R7)

**Given** màn phỏng vấn đã port
**When** kiểm router và registry
**Then** route `/interview` dùng `InterviewPage.vue`
**And** `/interview` có trong `PORTED_PAGES`
**And** HubPlaceholder được gỡ khỏi route này

---

## Case List

### Happy path

| # | Case | Trigger |
|---|------|---------|
| H1 | Mở /interview → hiển thị sidebar + topic đầu tiên | Mở `/interview` → thấy topic list + content + progress |
| H2 | Tick checklist → lưu localStorage | Click checkbox → tick → tải lại → vẫn tick |
| H3 | Chuyển topic → hiển thị đúng topic | Click topic trong sidebar → body cập nhật |
| H4 | Progress bar cập nhật sau khi tick | Tick item → progress fill thay đổi |
| H5 | Điều hướng về trang chủ | Click "← Trang chủ" → về `/` |

### Edge cases

| # | Case | Trigger |
|---|------|---------|
| E1 | `window.interviewTopics` undefined (trước khi script load) | Gọi `getTopics()` khi data chưa load → trả `[]` thay vì crash |
| E2 | Topic đầu tiên (README) không có checklist | Click topic 0 → body hiển thị content, không crash |
| E3 | Topic không có checklist property | Click topic 10 → body hiển thị content, progress = 0/0 |
| E4 | Group collapsed → auto-select first topic | Click group header → expand → first topic auto-selected |
| E5 | Checklist item chứa ký tự đặc biệt trong title | Tick item với `"` trong title → không crash |

### Error paths

| # | Case | Trigger |
|---|------|---------|
| L1 | Vue chạy khác origin → localStorage không chia sẻ | Vue dev server ≠ Legacy origin → checklist hiển thị rỗng (ràng buộc đã biết) |
| L2 | `interview-data.js` chưa load mà gọi `getTopics()` | Kịch bản: script order sai → fallback `[]` |
| L3 | `localStorage` bị corrupt → JSON parse fail | `JSON.parse` fail → `{}` fallback |

### Invariant checks

| # | Invariant | Check |
|---|-----------|-------|
| I1 | R3 — @legacy là đường DUY NHẤT | `grep -rn "interview-logic\|interview-data" projects/web-app/src` → tất cả import qua `@legacy` |
| I2 | R4 — Logic framework-free | `interview-logic.js` không import vue |
| I3 | R5 — Không gán window.* trong Vue | `grep -rn "window\." projects/web-app/src` → 0 kết quả |
| I4 | AD-6 — Storage ownership | Vue dùng `interview-logic.js` để đọc/ghi checklist, không adapter riêng |

---

## Dev Notes

### 1. Sửa interview-logic.js — AD-5 (group c)

Thay `getTopics()` đọc `window.interviewTopics` bằng nhận qua tham số:

```js
// TRƯỚC (dòng 19-21):
export function getTopics() {
  return window.interviewTopics || [];
}

// SAU:
export function getTopics(topics) {
  return topics || window.interviewTopics || [];
}
```

Tất cả hàm gọi `getTopics()` cần truyền `interviewTopics` khi dùng trong Vue. Legacy page (`interview-ui.js`) không cần sửa vì `window.interviewTopics` vẫn tồn tại.

### 2. Thêm export vào interview-data.js — AD-16 (group d)

Thêm dòng sau dòng 1 (`// Auto-generated...`):

```js
// Auto-generated from interview_java/*.md
export const interviewTopics = window.interviewTopics;
window.interviewTopics = interviewTopics;
```

**Lưu ý:** Đảm bảo export nằm sau `window.interviewTopics = ...` để giá trị đã có sẵn.

### 3. Sửa build-interview-data.js — giữ export khi regenerate

Script `build-interview-data.js` hiện ghi đè toàn bộ file. Cần thêm dòng `export` vào template output:

```js
const output = `// Auto-generated from interview_java/*.md
export const interviewTopics = window.interviewTopics;
window.interviewTopics = interviewTopics;
${JSON.stringify(topics, null, 2)};`;
```

### 4. Tạo InterviewPage.vue

Cần:
- Import dữ liệu: `import { interviewTopics } from '@legacy/data/interview-data.js'`
- Import logic: `import { getTopics, getTopic, getChecklist, toggleChecklistItem, calcProgress, calcTopicProgress } from '@legacy/features/interview/interview-logic.js'`
- Import markdown: `import { markdownToHTML } from '@legacy/utils/markdown.js'`
- Sidebar với 8 groups (GROUPS constant từ `interview-ui.js`)
- Body với content + checklist + progress bar
- Timer component (từ `timer.js` — nhưng cần xử lý AD-5 nếu timer đọc `window.*`)

### 5. Về timer

`interview.html` có timer với `skillforge_timer_history` localStorage key. Timer logic cần kiểm tra xem có đọc `window.*` không trước khi port.

### 6. CSS

Dùng `interview.css` cho reference. Không import trực tiếp (AD-10) — tái dựng bằng CSS trong `<style scoped>`.

---

## Tasks

- [ ] T-1: Sửa `getTopics()` trong `interview-logic.js` — thêm tham số (AD-5)
- [ ] T-2: Thêm `export` vào `interview-data.js` (AD-16)
- [ ] T-3: Sửa `build-interview-data.js` — giữ export khi regenerate
- [ ] T-4: Kiểm timer.js — có đọc `window.*` không? Sửa nếu cần
- [ ] T-5: Tạo `src/pages/InterviewPage.vue`
- [ ] T-6: Tạo component nếu cần (sidebar, body, checklist item)
- [ ] T-7: Update router + registry
- [ ] T-8: Verify invariants (R3, R4, R5, AD-6)
- [ ] T-9: FR-6 manual acceptance

---

## References

- [Source: projects/web-en/js/features/interview/interview-logic.js]
- [Source: projects/web-en/js/data/interview-data.js]
- [Source: projects/web-en/build-interview-data.js]
- [Source: projects/web-en/js/features/interview/interview-ui.js]
- [Source: projects/web-en/js/utils/markdown.js]
- [Source: projects/web-en/pages/interview.html]
- [Source: epics.md#Story-3.2]
