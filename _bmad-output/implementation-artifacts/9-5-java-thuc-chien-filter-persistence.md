# Story 9-5: Java Thực Chiến — Filter State Persistence

**Epic:** 9 - Pagination & Data Organization
**Status:** ready-for-dev
**Priority:** LOW

## Context

`JavaThucChienPage.vue` có filter state (`searchKeyword`, `selectedLevel`, `selectedCategory`) nhưng không persist. Mỗi lần user quay lại, filter reset về default.

**Sprint:** web-app

## User Story

**AS A** learner who filters Java tasks
**I WANT** my filter settings to persist across page visits
**SO THAT** I don't have to re-select my preferred filters every time

## Acceptance Criteria

- [ ] **AC-1:** `searchKeyword` persists to localStorage (key: `thucChien_search`)
- [ ] **AC-2:** `selectedLevel` persists to localStorage (key: `thucChien_level`)
- [ ] **AC-3:** `selectedCategory` persists to localStorage (key: `thucChien_cat`)
- [ ] **AC-4:** Filters restore from localStorage on `mounted()`
- [ ] **AC-5:** Filter changes auto-save to localStorage

## Technical Notes

- Save on every change (watch/computed setter or direct save on select)
- Use try/catch for localStorage errors
- Keys namespaced with prefix to avoid collisions
- Restore in `mounted()` before render

## Files to Modify

- `projects/web-app/src/pages/JavaThucChienPage.vue`

## Dependencies

- None

## AC Quality Rules

1. **AC-1 Measurement:** Set `searchKeyword` to "payment", reload page, verify value restored
2. **AC-2 Measurement:** Select "Junior" level, reload, verify level selected
3. **AC-3 Measurement:** Select "API & Tích hợp" category, reload, verify category selected

---

**Hardened:** light (2026-08-07) — 5 AC, 2 cases (happy/error), guard=n/a
**Implemented:** dev-story (2026-08-07) — 1 file

## Case List (for checkpoint)

### Happy Path
- [ ] Set all filters → reload → all filters restored
- [ ] Clear filters → reload → filters at default (empty/alls)

### Error Cases
- [ ] localStorage unavailable → filters default, no crash

---

*Checkpoint: Danh sách case này đủ chưa? Thêm/sửa/bớt gì không? (duyệt = 'ok')*
