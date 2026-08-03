# Story 4.2: Port Exam & Skill Tracker pages

## Header

- **Epic:** 4 — Port toàn bộ 23 trang còn lại
- **Story ID:** 4.2
- **Status:** review
- **Hardened:** hard (2026-08-03) — 4 AC, 25 cases (13 happy/5 edge/2 error/5 invariant), guard=25 assertions
- **Implemented:** dev-story (2026-08-03)
- **Created:** 2026-08-03

---

## User Story

As a người dùng,
I want làm bài thi thử và theo dõi kỹ năng trên bản Vue,
So that không cần quay về bản Legacy để sử dụng các tính năng này.

---

## Acceptance Criteria

### AC1: Exam page hoạt động đúng

**Given** exam page đã port sang Vue
**When** người dùng mở trang thi thử
**Then** hiển thị danh sách đề thi
**And** người dùng chọn đề → hiển thị câu hỏi
**And** người dùng trả lời câu hỏi → tính điểm
**And** kết thúc bài thi → hiển thị kết quả và có thể lưu lịch sử

### AC2: Skill Tracker page hoạt động đúng

**Given** skill tracker đã port sang Vue
**When** người dùng mở trang
**Then** hiển thị danh sách kỹ năng với progress
**And** người dùng cập nhật progress → lưu vào localStorage
**And** hiển thị biểu đồ hoặc progress bar theo từng skill

### AC3: Điều hướng hoạt động

**Given** các trang đã port
**When** từ hub bấm vào link
**Then** điều hướng qua Vue router (/exam, /skill-tracker)
**And** bấm "Quay về" → về hub đúng

### AC4: UI khớp Legacy (FR-6 five-point check)

**Given** trang đang chạy trên Vue
**When** so sánh với Legacy
**Then** Block layout: khối xếp đúng vị trí
**And** Color: màu khớp (dùng token)
**And** Spacing: khoảng cách khớp
**And** Font/size: cỡ/kiểu chữ khớp
**And** Hover state: trạng thái hover khớp

---

## Technical Notes

### Exam Logic Analysis

**Legacy Files:**
- `web-en/js/features/quiz/quiz-logic.js` — business logic (portable, no window.*)
- `web-en/js/features/quiz/quiz-ui.js` — DOM logic (needs rewrite in Vue)
- `web-en/pages/exam.html` — page structure

**Storage Keys (R6 - Storage ownership):**
- `quizHistory` — lưu lịch sử thi (đọc/ghi bởi `quiz-logic.js:70,82`)

**Data Dependencies (AD-16):**
- `vocabList` từ `@legacy/js/data/vocabulary.js`
- `idiomsList` từ `@legacy/js/data/idioms.js`
- `practiceSentences` từ `@legacy/js/data/practice.js`

### Skill Tracker Logic Analysis

**Legacy Files:**
- `web-en/js/features/skill-tracker/skill-logic.js` — business logic
- `web-en/js/features/skill-tracker/skill-ui.js` — DOM logic
- `web-en/pages/skill-tracker.html` — page structure

**Storage Keys (R6 - Storage ownership):**
- `skillforge_skills` — lưu dữ liệu skills (đọc/ghi bởi `skill-logic.js:44,52`)
- `skillforge_log` — lưu practice log (đọc/ghi bởi `skill-logic.js:58,66`)

**Note:** `skill-logic.js` dùng internal functions (loadSkills, saveSkills, etc.) không export. Cần refactor để export hoặc wrap trong Vue.

---

## Files to Create/Modify

### Create
- `src/pages/ExamPage.vue`
- `src/pages/SkillTrackerPage.vue`

### Modify
- `src/router/index.js` — thêm 2 routes
- `src/utils/ported-pages.js` — thêm 2 entries

### Legacy (read-only theo AD-15)
- `web-en/pages/exam.html`
- `web-en/pages/skill-tracker.html`
- `web-en/js/features/quiz/` (logic)
- `web-en/js/features/skill/` (logic)

---

## Non-Functional Requirements

- NFR1: Legacy app luôn chạy được
- NFR3: Component dùng chung (CTopbar, CGrid) được tái sử dụng
- NFR4: Logic được tái sử dụng qua @legacy (AD-3, AD-4)
- AD-8: Không hex cứng trong components
- AD-10: `<style scoped>` cho page components

---

## Files Created/Modified

### Created
- `projects/web-app/src/pages/ExamPage.vue`
- `projects/web-app/src/pages/SkillTrackerPage.vue`

### Modified
- `projects/web-app/src/router/index.js` — thêm 2 routes
- `projects/web-app/src/utils/ported-pages.js` — thêm 2 entries
- `projects/web-app/src/pages/EnglishHubPage.vue` — cập nhật paths cho exam + skill tracker
