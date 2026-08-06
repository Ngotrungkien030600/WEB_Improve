# Story 9-2: Frontend UI Interview Pagination

**Epic:** 9 - Pagination & Data Organization
**Status:** ready-for-dev
**Priority:** MEDIUM

## Context

FrontendUiInterviewPage hiện có 30 expandable cards (10/tier). UX issues:
- 30 cards = cognitive overload
- Accordion expand/collapse lằng nhằng khi xem nhiều câu
- Không có search

**Sprint:** web-app

## User Story

**AS A** frontend developer practicing UI interview questions
**I WANT** to search and paginate through questions
**SO THAT** I can quickly find specific topics and review in chunks

## Acceptance Criteria

- [ ] **AC-1:** Search bar filter questions by keyword (title, topic, content)
- [ ] **AC-2:** Debounce search input 300ms
- [ ] **AC-3:** Pagination: 10 items/page, controls ◀ Trước / page numbers / Sau ▶
- [ ] **AC-4:** Click item → modal overlay với full content (topic, question, answer)
- [ ] **AC-5:** Search highlights matching text trong results
- [ ] **AC-6:** Empty state khi search không có kết quả
- [ ] **AC-7:** Tier switch resets search và pagination về default

## Data Structure

```javascript
data[tier].questions = [
  { topic: 'HTML', q: '...', a: '...' },
  // 10 questions per tier
]
```

Searchable fields: `topic`, `q` (question text), `a` (answer text)

## Technical Notes

- Client-side search + pagination
- Search debounce: 300ms
- Modal overlay: full-screen or centered, close on ESC or click outside
- Match highlight: wrap matching substring in `<mark>` tag
- Tier switch → `searchQuery = ''`, `currentPage = 1`

## Files to Modify

- `projects/web-app/src/pages/FrontendUiInterviewPage.vue`

## Dependencies

- None — standalone story

## AC Quality Rules

1. **AC-1 Input → Output:** User types → questions filter in real-time (debounced)
2. **AC-3 Edge:** Page 1 no "Trước"; last page no "Sau"
3. **AC-4:** Modal close không reset search/pagination state
4. **AC-5:** Highlight chỉ áp dụng cho matching text, không break HTML

---

**Hardened:** light (2026-08-07) — 7 AC, 6 cases (happy/error/edge), guard=n/a

**Implemented:** dev-story (2026-08-07) — 1 file

## Case List (for checkpoint)

### Happy Path
- [ ] User types search → results filter (debounced 300ms)
- [ ] User clicks page 2 → sees next 10 questions
- [ ] User clicks question → modal opens with full content
- [ ] User closes modal → stays on same page/search
- [ ] User switches tier → search + page reset

### Edge Cases
- [ ] ≤10 questions → no pagination shown
- [ ] Search matches 0 → empty state message
- [ ] Page 1 → no "Trước" button
- [ ] Last page → no "Sau" button

### Error Cases
- [ ] Modal: ESC key closes modal
- [ ] Modal: click outside closes modal

---

*Checkpoint: Danh sách case này đủ chưa? Thêm/sửa/bớt gì không? (duyệt = 'ok')*
