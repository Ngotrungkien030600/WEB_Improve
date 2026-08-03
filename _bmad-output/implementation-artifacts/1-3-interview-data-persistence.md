# Story 1.3: Fix interview data persistence (localStorage → IndexedDB)

Status: ready-for-dev

<!-- Bugfix: checklist bị mất khi reload page -->

## Story

As a user practicing Java backend interview questions,
I want my checklist progress to persist after page reload,
so that I don't lose my learning progress.

## Problem Statement

User thấy checklist trên trang `interview.html` bị reset về empty sau khi reload. Bug xảy ra vì `interview-logic.js` dùng localStorage trực tiếp, vi phạm invariant R6 ("mỗi key có 1 owner duy nhất") và cơ chế migration đã có sẵn.

## Root Cause Analysis

| Layer | File | Issue |
|-------|------|-------|
| Logic | `js/features/interview/interview-logic.js:5` | `STORAGE_KEY = 'interviewChecklist'` — dùng localStorage |
| ProgressDB | `js/data/progress-db.js` | IndexedDB `'SkillForgeProgress'` đã có sẵn |
| Invariant | `docs/repo-risks.md:27` | R6 bị vi phạm — checklist owner không rõ |

**Data flow hiện tại (BROKEN):**
```
interview-logic.js → localStorage['interviewChecklist'] → MẤT SAU RELOAD
```

**Data flow mong muốn (FIXED):**
```
interview-logic.js → progressDB (IndexedDB) → PERSISTENT
```

## Acceptance Criteria

1. [AC-1] Checklist item được lưu vào IndexedDB qua `progressDB.markCompleted()` sau khi check/uncheck
2. [AC-2] Checklist state được đọc từ IndexedDB qua `progressDB.isCompleted()` khi load page
3. [AC-3] Progress bar hiển thị đúng số item đã check dựa trên data từ IndexedDB
4. [AC-4] Timer stats (forge-stats) dùng `progressDB` thay vì localStorage riêng
5. [AC-5] Không có localStorage call nào trong `interview-logic.js` sau khi fix
6. [AC-6] Data cũ từ localStorage được migrate sang IndexedDB khi init ✅

## Tasks / Subtasks

- [ ] Task 1 (AC: #1, #2, #3) — Migrate `interview-logic.js` sang dùng `progressDB`
  - [ ] Thay `loadChecklist()` → gọi `progressDB.isCompleted()` cho mỗi item
  - [ ] Thay `toggleChecklistItem()` → gọi `progressDB.markCompleted()`
  - [ ] Thay `saveChecklist()` → remove (progressDB tự save)
- [ ] Task 2 (AC: #4) — Migrate timer stats sang `progressDB`
  - [ ] Thay `getHistory()` → `progressDB.getRecentSessions()`
  - [ ] Thay `recordSession()` → `progressDB.logSession()`
  - [ ] Thay `getStreak()` → `progressDB.getStreak()`
- [ ] Task 3 (AC: #5) — Remove localStorage calls khỏi interview module
  - [ ] Xóa `const STORAGE_KEY` và `saveChecklist()`
  - [ ] Xóa import localStorage helpers từ timer.js
- [ ] Task 4 (AC: #6) — Migration từ localStorage
  - [ ] Gọi `progressDB.migrateFromLocalStorage()` trong init
  - [ ] Xóa localStorage key `'interviewChecklist'` sau khi migrate thành công

## Dev Notes

### Baseline Commit

`ed11880` (refactor: dựng khung BMAD ở gốc)

### Source Files (cần đọc trước khi dev)

| File | Reason |
|------|--------|
| `projects/web-en/js/features/interview/interview-logic.js` | Đổi từ localStorage sang progressDB |
| `projects/web-en/js/features/interview/interview-ui.js` | Gọi logic mới — KHÔNG SỬA |
| `projects/web-en/js/data/progress-db.js` | IndexedDB API đã có sẵn |
| `projects/web-en/js/utils/timer.js` | Stats dùng localStorage — cần migrate |

### progressDB API Reference

```javascript
// Mark item completed
await progressDB.markCompleted(itemId, 'interview', 'checklist', { title: itemText });

// Check if completed
await progressDB.isCompleted(itemId, 'checklist');

// Get all completed
await progressDB.getCompletedByType('checklist');

// Log session
await progressDB.logSession({ type: 'focus', itemId: 'pomodoro', duration: 25 });
```

### Invariant Compliance

- **R6**: Storage ownership — checklist owner chuyển từ `interview-logic.js` (localStorage) sang `progressDB` (IndexedDB)
- **AD-15**: Chỉ sửa signature/endpoint/CSS link — KHÔNG rewrite toàn bộ logic

### Change Log

- `js/features/interview/interview-logic.js` — rewrite to use progressDB (IndexedDB) + migration
- `js/features/interview/interview-ui.js` — async init + await toggle
- `js/utils/timer.js` — stats via progressDB + Promise.all + error handling
- `js/data/progress-db.js` — added `uncomplete()` method
- `js/data/interview-data.js` — restored 41 topics from good commit

### Baseline Commit

`ed11880` (refactor: dựng khung BMAD ở gốc)

### **Implemented:** dev-story (2026-08-03) — 3 files changed
