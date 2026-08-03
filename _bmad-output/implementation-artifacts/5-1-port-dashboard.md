# Story 5.1: Port Dashboard page
## Header

- **Epic:** 5 — Complete Vue Port (final 3 pages)
- **Story ID:** 5.1
- **Status:** review
- **Hardened:** light (2026-08-03) — 3 AC, 15 cases (5 happy / 6 edge / 3 invariant)
- **Implemented:** dev-story (2026-08-03) — 4 files
- **Created:** 2026-08-03

---

## User Story

As a người dùng,
I want xem dashboard với stats XP, streak, level, kỹ năng, lịch sử thi trên bản Vue,
So that có cái nhìn tổng quan về tiến độ học tập mà không cần quay về Legacy.

---

## Acceptance Criteria

### AC1: Dashboard hiển thị đúng dữ liệu từ localStorage

**Given** dashboard đã port sang Vue
**When** người dùng mở `/dashboard`
**Then** hiển thị 3 stat cards: Tổng XP, Streak (ngày), Level
**And** XP được tính từ `skillforge_skills` (sum of all skill XP)
**And** Level = floor(totalXp / 200) + 1
**And** Streak được tính từ `skillforge_log` (consecutive days)

### AC2: Skills table hiển thị đúng

**Given** dashboard đã port
**When** người dùng xem section "Kỹ năng"
**Then** hiển thị table với columns: Kỹ năng, Level, XP, Tiến độ
**And** mỗi row có icon, name, progress bar (XP % 200)
**And** nếu không có data → hiển thị empty state

### AC3: Exam history và streak calendar

**Given** dashboard đã port
**When** người dùng xem "Lịch sử thi"
**Then** hiển thị table 20 bản ghi gần nhất từ `skillforge_exam_history`
**And** mỗi row: Ngày, Đúng, Tổng, %, ĐG (emoji: 🌟 ≥90%, ✅ ≥75%, ⚠️ ≥50%, ❌)
**And** streak 7 ngày calendar hiển thị đúng active days

---

## Technical Notes

### Legacy Files

- `web-en/pages/dashboard.html` — page source (đã đọc đầy đủ, 131 lines)
- `web-en/css/subpage.css` — shared subpage styles
- **Không có** data JS file riêng — logic inline trong `<script>` tag

### Data Sources (localStorage keys)

```js
// skillforge_skills — array of skill objects
skillforge_skills = [
  { name: "Java", xp: 450, level: 2, icon: "☕" },
  { name: "English", xp: 200, level: 1, icon: "🇬🇧" },
]

// skillforge_exam_history — array of exam results
skillforge_exam_history = [
  { date: "2026-08-01T10:00:00Z", correct: 8, total: 10, duration: 300 },
]

// skillforge_log — array of daily activity
skillforge_log = [
  { date: "2026-08-01T..." }, // ISO date string
]
```

### Logic to Preserve

**XP calculation:**
```js
const totalXp = skills.reduce((s, a) => s + (a.xp || 0), 0);
const level = Math.floor(totalXp / 200) + 1;
```

**Streak calculation:**
```js
const dates = [...new Set(log.map(e => e.date?.split('T')[0] || ''))]
  .filter(Boolean).sort().reverse();
let streak = 0;
let check = new Date(today);
for (const d of dates) {
  const ds = check.toISOString().split('T')[0];
  if (d === ds) { streak++; check.setDate(check.getDate() - 1); }
  else if (d === yesterday && streak === 0) { streak = 1; }
  else break;
}
```

**Exam history table:**
```js
ex.slice().reverse().slice(0, 20).forEach(e => {
  const pct = e.total > 0 ? Math.round((e.correct/e.total)*100) : 0;
  const label = pct >= 90 ? '🌟' : pct >= 75 ? '✅' : pct >= 50 ? '⚠️' : '❌';
});
```

### Strategy

- **Loại trang:** Logic page — data display từ localStorage, no interactive logic phức tạp
- Pattern: đọc localStorage → computed properties → template display
- Preserve tất cả logic tính toán y hệt Legacy
- Không cần ForgeTimer hay CHubCard (đây là data display page)

---

## Files to Create/Modify

### Create
- `src/pages/DashboardPage.vue`

### Modify
- `src/router/index.js` — thêm route `/dashboard`
- `src/utils/ported-pages.js` — thêm entry `'/dashboard'`
- `src/pages/HomePage.vue` — thêm link đến `/dashboard` trong home cards
- `PORTED_PAGE_LABELS` — thêm `'/dashboard': 'Dashboard'`

---

## Non-Functional Requirements

- **NFR1:** Legacy app luôn chạy được — không sửa dashboard.html
- **NFR3:** Dùng CTopbar cho navigation header
- **AD-8:** Không hex cứng — dùng CSS tokens từ `@legacy/css/variables.css`
- **AD-10:** `<style scoped>` cho page component
- **AD-17:** Accent token override trên root element (`--color-accent: #7c5cfc` — forge purple)
- Không tạo component mới — dùng CTopbar có sẵn
- Không tạo CSS file mới — dùng inline `<style scoped>` hoặc token import

---

## Dev Agent Guardrails

### ✅ PHẢI LÀM
- Preserve exact calculation logic cho XP, streak, level (đã test trong Legacy)
- Read `skillforge_skills`, `skillforge_exam_history`, `skillforge_log` từ localStorage
- Hiển thị empty state khi không có data
- 7-day streak calendar với today highlighted
- Exam history table với emoji indicators

### ❌ KHÔNG ĐƯỢC LÀM
- Không tạo component mới (chỉ dùng CTopbar có sẵn)
- Không copy data từ Legacy — read-only từ localStorage
- Không tạo CSS file mới
- Không hex cứng trong style

---

## Dev Agent Record

### Agent Model Used
composer-2.5 (Cursor)

### Debug Log
Build pass: `vite build` exit 0. DashboardPage.vue: 4.49 kB JS, 38.91 kB CSS. Dashboard link đã có trong HomePage từ Epic 4.

### Completion Notes
- DashboardPage.vue tạo với 3 sections: stat cards, skills table, exam history + streak calendar
- Route `/dashboard` thêm vào router
- Registry updated: PORTED_PAGES + PORTED_PAGE_LABELS
- Dashboard link đã tồn tại trong HomePage (Epic 4)
- Build verified ✅

### File List
- `src/pages/DashboardPage.vue` — NEW
- `src/router/index.js` — MODIFY (thêm route)
- `src/utils/ported-pages.js` — MODIFY (thêm entries)
- `src/pages/HomePage.vue` — VERIFY (link đã có)
