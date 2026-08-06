# Story 9-4: Exam History Bounded Storage

**Epic:** 9 - Pagination & Data Organization  
**Status:** backlog  
**Priority:** LOW  

## Context

Exam history trong IndexedDB grow unbounded. User làm nhiều exams → localStorage grows forever:
- Performance degradation over time
- Potential storage quota issues
- Hard to find specific history entry

## User Story

**AS A** learner tracking progress  
**I WANT** exam history to stay manageable  
**SO THAT** I can review past performance without performance issues

## Acceptance Criteria

- [ ] **AC-1:** Keep last 100 exam entries, auto-archive older
- [ ] **AC-2:** Entries older than 30 days auto-archived
- [ ] **AC-3:** Archive pagination: show recent 20 entries, link to archived
- [ ] **AC-4:** Export archive option (JSON download)
- [ ] **AC-5:** Storage stats shown in UI (e.g., "87/100 entries")
- [ ] **AC-6:** User can manually delete individual entries

## Technical Notes

- IndexedDB: examHistory store
- Add `archived` boolean flag + `archivedAt` timestamp
- Cron-like cleanup on app load (not interval-based)
- Export: `JSON.stringify` → Blob download

## Files to Modify

- `projects/web-en/js/data/progress-db.js` (IndexedDB operations)
- `projects/web-app/src/pages/DashboardPage.vue` (stats display)
- `projects/web-app/src/pages/ExamPage.vue` (history view)

## Dependencies

- None — standalone story

## Story Points

5
