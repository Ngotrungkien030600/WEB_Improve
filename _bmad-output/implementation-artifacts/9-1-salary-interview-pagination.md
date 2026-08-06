# Story 9-1: Salary Interview Pagination

**Epic:** 9 - Pagination & Data Organization  
**Status:** ready-for-dev  
**Priority:** HIGH  

## Context

SalaryInterviewPage hiện load 64 câu hỏi phỏng vấn (4 tiers × ~16 câu) trên 1 page sau khi user chọn tier. UX survey chỉ ra:
- 16 câu/tier trên 1 page = cognitive overload
- User khó tìm câu hỏi specific theo topic
- Topics hiện tại: Java Core, OOP, SQL, Git, Data Structures, Exception

**Sprint:** web-app

## User Story

**AS A** job seeker preparing for salary interviews  
**I WANT** to filter questions by topic and see them in manageable chunks  
**SO THAT** I can focus on specific question types and track my progress

## Acceptance Criteria

- [ ] **AC-1:** Tab filter bar với options: [All] + unique topics từ data (e.g., All, Java Core, OOP, SQL, Git, Data Structures, Exception)
- [ ] **AC-2:** Default view = All (tất cả questions của selected tier)
- [ ] **AC-3:** Pagination: 10 items/page, scrollable khi > 10 items
- [ ] **AC-4:** Pagination controls: ◀ Previous, page numbers, Next ▶ — chỉ hiện khi cần
- [ ] **AC-5:** Click question → expand detail view (giữ existing detail accordion)
- [ ] **AC-6:** Filter state resets when user selects different tier
- [ ] **AC-7:** Page navigation resets filter về "All" (không persist filter across page change trong same tier)
- [ ] **AC-8:** Progress tracking vẫn hoạt động (đánh dấu câu đã học)

## Data Structure

```javascript
tier.questions = [
  { id: 'j01', topic: 'Java Core', difficulty: 1, question: '...', sampleAnswer: '...', keywords: [...] },
  { id: 'j02', topic: 'OOP', difficulty: 1, question: '...', ... },
  // ...
]
```

Topics extracted từ: `Java Core`, `OOP`, `SQL`, `Git`, `Data Structures`, `Exception`

## Technical Notes

- Client-side pagination (data trong `salary-interview-data.js`)
- Use Vue computed: `filteredQuestions.slice(startIndex, endIndex)`
- Reactive state: `currentPage` (1-based), `activeTopic` ('all' | topic string)
- No new data files — modify existing `SalaryInterviewPage.vue`
- Follow Vue conventions: `<style scoped>`, CSS tokens, no hex

## Files to Modify

- `projects/web-app/src/pages/SalaryInterviewPage.vue`

## Dependencies

- None — standalone story

## AC Quality Rules

1. **AC-1 Input → Output:** User thấy filter tabs → filtered questions thay đổi
2. **AC-2 Error path:** Default phải là "All", không phải empty state
3. **AC-4 Edge:** Page 1 không hiện "Previous"; last page không hiện "Next"
4. **AC-5:** Detail expand không mất filter/pagination state
5. **AC-7:** Bug — filter + page change → page reset về 1

---

**Hardened:** light (2026-08-07) — 8 AC, 7 cases (happy/error/edge), guard=n/a

**Implemented:** dev-story (2026-08-07) — 1 file

## Case List (for checkpoint)

### Happy Path
- [ ] User selects tier → sees questions (filtered=All, page=1)
- [ ] User clicks topic filter → questions filter correctly
- [ ] User clicks page 2 → sees next 10 questions
- [ ] User clicks question → expands answer detail
- [ ] User selects different tier → reset filter/page

### Edge Cases
- [ ] Single page (≤10 items) → no pagination controls shown
- [ ] Topic filter with 0 results → empty state message
- [ ] Last page → no "Next" button
- [ ] First page → no "Previous" button

### Error Cases
- [ ] Data load fails → graceful error message

---

*Checkpoint: Danh sách case này đủ chưa? Thêm/sửa/bớt gì không? (duyệt = 'ok')*
