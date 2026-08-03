# Story 4.3: Port Sentence Practice page

## Header

- **Epic:** 4 — Port toàn bộ 23 trang còn lại
- **Story ID:** 4.3
- **Status:** review
- **Hardened:** light (2026-08-03) — 3 AC, simplified case list
- **Implemented:** dev-story (2026-08-03)
- **Created:** 2026-08-03

---

## User Story

As a người dùng,
I want luyện nói và viết tiếng Anh trên bản Vue,
So that không cần quay về bản Legacy để sử dụng tính năng này.

---

## Acceptance Criteria

### AC1: Page hoạt động đúng

**Given** sentence practice page đã port sang Vue
**When** người dùng mở trang
**Then** hiển thị 13 category tabs
**And** hiển thị câu hỏi tiếng Việt đầu tiên
**And** người dùng gõ câu trả lời và bấm "Kiểm tra"
**Then** hiển thị kết quả đúng/sai
**And** cập nhật stats (đúng/sai)

### AC2: Điều hướng hoạt động

**Given** page đã port
**When** bấm "Quay về"
**Then** về English Hub

### AC3: UI khớp Legacy (FR-6 five-point check)

**Given** trang đang chạy trên Vue
**When** so sánh với Legacy
**Then** Block layout: khối xếp đúng vị trí
**And** Color: màu khớp (dùng token)
**And** Spacing: khoảng cách khớp
**And** Font/size: cỡ/kiểu chữ khớp
**And** Hover state: trạng thái hover khớp

---

## Technical Notes

### Legacy Files

- `web-en/pages/sentence-practice.html` — page structure + inline script
- `web-en/js/data/sentence-practice.js` — data (500+ sentences, 13 categories)

### Data Pattern

`sentence-practice.js` dùng `window.sentencePractice` — cần thêm export:

```js
window.sentencePractice = { ... };
export const sentencePractice = window.sentencePractice;
```

### Features

1. 13 category tabs (greetings, daily, work, travel, food, shopping, health, emotion, weather, time, technology, familysocial, expression)
2. Question card với tiếng Việt + hint
3. Input field để trả lời
4. Kiểm tra với case-insensitive comparison (bỏ dấu câu)
5. Stats: đúng/sai/tổng
6. Progress bar
7. Shuffle câu hỏi mỗi lần chọn category
8. Enter key để check/next

---

## Files to Create/Modify

### Create
- `src/pages/SentencePracticePage.vue`

### Modify
- `src/router/index.js` — thêm route
- `src/utils/ported-pages.js` — thêm entry
- `web-en/js/data/sentence-practice.js` — thêm export (AD-16)
- `EnglishHubPage.vue` — cập nhật path cho sentence-practice

---

## Non-Functional Requirements

- NFR1: Legacy app luôn chạy được
- NFR3: Component dùng chung (CTopbar) được tái sử dụng
- NFR4: Logic được tái dụng qua @legacy (AD-3, AD-4)
- AD-8: Không hex cứng trong components
- AD-10: `<style scoped>` cho page components
