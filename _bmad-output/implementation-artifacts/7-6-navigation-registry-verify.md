# Story 7.6 — Navigation Registry & Final Verify

## Header

- **Story:** 7.6 — Navigation Registry & Final Verify
- **Epic:** 7 — Complete Vue Port
- **Status:** backlog
- **Created:** 2026-08-04

---

## User Story

As a developer,
I want to verify all 10 pages are accessible and navigation works,
So that Epic 7 is complete and the Vue app is fully functional.

---

## Context

### Stories 7.1-7.5 vừa hoàn thành
- 7.1: AI Hub, Cloud Hub ✅
- 7.2: Java sub-pages ✅
- 7.3: Frontend UI & Responsive ✅
- 7.4: Frontend JS & HTML/CSS ✅
- 7.5: Frontend Frameworks ✅

### Epic 7 Goal
- Vue app hoàn chỉnh
- User chỉ cần chạy 1 server
- Legacy app có thể tắt

---

## Acceptance Criteria

### AC1: Routes Complete
- [ ] All 10 new routes registered in Vue router
- [ ] Routes match legacy URLs

### AC2: PORTED_PAGES Updated
- [ ] All 10 pages added to `ported-pages.js`
- [ ] Labels correct

### AC3: Navigation Links
- [ ] Hub pages link to new Vue routes
- [ ] No broken links to legacy

### AC4: Build Verification
- [ ] `npm run build` passes
- [ ] No console errors
- [ ] All pages render

### AC5: Single App Goal
- [ ] Verify: run `npm run dev`
- [ ] Access all pages from http://localhost:5173
- [ ] Legacy app not needed

### AC6: Epic Sign-off
- [ ] Epic 7 status → `done`
- [ ] Sprint summary

---

## Technical Notes

### Verify Command
```bash
cd projects/web-app && npm run build
```

### Check PORTED_PAGES
File: `src/utils/ported-pages.js`
