# Story 9-3: Java Thực Chiến — Virtualized Grid

**Epic:** 9 - Pagination & Data Organization
**Status:** ready-for-dev
**Priority:** MEDIUM

## Context

JavaThucChienPage render 43 task cards cùng lúc bằng CSS grid. 43 DOM nodes gây:
- Initial render chậm
- Scroll lag (mỗi card có nhiều elements con)
- Memory pressure không cần thiết

**Sprint:** web-app

## User Story

**AS A** junior/middle developer browsing real-world Java tasks
**I WANT** to scroll through 43 task cards smoothly
**SO THAT** the page stays fast even on low-end devices

## Acceptance Criteria

- [ ] **AC-1:** Grid renders only visible rows (intersection-observer based virtual scroll)
- [ ] **AC-2:** Estimated row height: 180px, buffer: 2 rows above/below viewport
- [ ] **AC-3:** Stats bar (totalTasks, countByLevel) updates when filtered
- [ ] **AC-4:** Filters (searchKeyword, selectedLevel, selectedCategory) work with virtual scroll
- [ ] **AC-5:** Empty state shows when filtered count = 0
- [ ] **AC-6:** Smooth scroll position maintained on filter change

## Technical Notes

- Use `IntersectionObserver` với sentinel elements
- Total height spacer div để preserve scrollbar
- Only render ~2-3 screens of items at a time
- Scroll position → recalculate visible range → update rendered slice
- Keep existing modal, filters, search behavior unchanged

## Files to Modify

- `projects/web-app/src/pages/JavaThucChienPage.vue`

## Dependencies

- None — pure Vue, no library needed

## AC Quality Rules

1. **AC-1 Measurement:** DOM node count trong `.task-grid` phải < 25 khi scroll ở giữa (43 items)
2. **AC-4 Edge:** Search clears → re-virtualize from full list
3. **AC-6 Constraint:** filter change KHÔNG reset scroll position về top (chỉ re-layout)

---

**Hardened:** light (2026-08-07) — 6 AC, 3 cases (happy/error/edge), guard=n/a

**Implemented:** dev-story (2026-08-07) — 1 file

## Case List (for checkpoint)

### Happy Path
- [ ] Initial load: only visible rows rendered
- [ ] Scroll down → new rows load, old rows removed from DOM
- [ ] Apply filter → virtual list re-renders subset

### Edge Cases
- [ ] Filter returns 0 items → empty state shown
- [ ] All filters cleared → full 43-item list virtualized

### Error Cases
- [ ] N/A (virtual scroll is robust, no error states needed)

---

*Checkpoint: Danh sách case này đủ chưa? Thêm/sửa/bớt gì không? (duyệt = 'ok')*
