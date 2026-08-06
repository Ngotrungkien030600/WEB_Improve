# Story 9-4: Exam History — Bounded Storage + Cursor Pagination

**Epic:** 9 - Pagination & Data Organization
**Status:** ready-for-dev
**Priority:** LOW

## Context

`quiz-logic.js:saveToHistory()` giới hạn `history` array trong memory (max 20 items) nhưng `localStorage` không bị trim. Sau nhiều lần thi, `localStorage` entry `quizHistory` có thể chứa > 20 items (vì trim chỉ chạy khi `history.length > 20`, không phải mỗi lần save).

**Sprint:** web-app

## User Story

**AS A** learner who takes many quizzes
**I WANT** my exam history to stay bounded in localStorage
**SO THAT** the app remains fast and doesn't consume excessive storage

## Acceptance Criteria

- [ ] **AC-1:** `saveToHistory()` trims localStorage to max 50 entries (trim old entries beyond limit)
- [ ] **AC-2:** History display uses cursor pagination (load 10 items initially, "Xem thêm" loads next 10)
- [ ] **AC-3:** History list shows newest first (`unshift`)
- [ ] **AC-4:** Empty history state handled (message + CTA)
- [ ] **AC-5:** localStorage read on mount uses try/catch for quota errors

## Technical Notes

- `saveToHistory()`: Keep 50 entries max in localStorage (trim from oldest)
- Cursor: `page` state (1, 2, 3...) + `displayedItems` computed slice
- "Xem thêm" increments `page`, shows next 10
- Guard: if `displayedItems.length === totalItems` → hide "Xem thêm"
- Existing `loadHistory()` still works (returns latest 50 from trimmed storage)

## Files to Modify

- `projects/web-en/js/features/quiz/quiz-logic.js` (bounded storage)
- `projects/web-app/src/pages/ExamPage.vue` (cursor pagination UI)

## Dependencies

- None

## AC Quality Rules

1. **AC-1 Measurement:** After 55 saves, `localStorage.getItem('quizHistory').length` should have at most 50 entries
2. **AC-2 Constraint:** "Xem thêm" button only shown when more items exist

---

**Hardened:** light (2026-08-07) — 5 AC, 3 cases (happy/error/edge), guard=n/a

**Implemented:** dev-story (2026-08-07) — 2 files

## Case List (for checkpoint)

### Happy Path
- [ ] First exam → history shows 1 entry
- [ ] Take 55 exams → localStorage keeps 50, display shows 10 (with "Xem thêm")
- [ ] Click "Xem thêm" → next 10 items appear

### Edge Cases
- [ ] Exactly 10 history items → "Xem thêm" not shown
- [ ] Empty history → empty state message shown

### Error Cases
- [ ] localStorage quota exceeded → gracefully handle (skip save, log warning)

---

*Checkpoint: Danh sách case này đủ chưa? Thêm/sửa/bớt gì không? (duyệt = 'ok')*
