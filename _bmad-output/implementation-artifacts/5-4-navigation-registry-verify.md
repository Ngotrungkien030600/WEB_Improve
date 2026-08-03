# Story 5.4: Navigation registry + final verify
## Header

- **Epic:** 5 — Complete Vue Port (final 3 pages)
- **Story ID:** 5.4
- **Status:** ready-for-dev
- **Hardened:** light (2026-08-03) — registry + verify, no new pages
- **Created:** 2026-08-03

---

## User Story

As a người dùng,
I want tất cả navigation links đi đúng nơi (Vue hoặc Legacy),
So that không có dead links hay redirects sai khi duyệt app.

---

## Acceptance Criteria

### AC1: Dashboard link từ HomePage

**Given** Dashboard đã port (Story 5.1)
**When** kiểm tra HomePage cards
**Then** có card/link đến `/dashboard`
**And** link đi qua Vue router (dùng `navigate('/dashboard')`)

### AC2: AI Hub link từ HomePage hoặc hub cha

**Given** AI Hub đã port (Story 5.2)
**When** kiểm tra navigation
**Then** HubPlaceholder tại `/ai/hub` đã được thay bằng AiHubPage
**And** link từ HomePage hoặc nav đi đến `/ai/hub`

### AC3: Cloud page route aligned

**Given** Cloud page đã port (Story 5.3)
**When** kiểm tra router
**Then** `/cloud` (hoặc `/cloud/hub`) route trỏ đến CloudPage.vue
**And** HubPlaceholder không còn được dùng cho cloud
**And** `PORTED_PAGES` và `PORTED_PAGE_LABELS` updated đúng

### AC4: Full navigation test

**Given** tất cả 3 pages đã port
**When** chạy automated test hoặc manual navigation test
**Then** tất cả routes `/dashboard`, `/ai/hub`, `/cloud` trả về 200
**And** no console errors
**And** `npm run build` pass

---

## Technical Notes

### Files to Check

**Router (`src/router/index.js`):**
```js
// Sau 5.1+5.2+5.3, router nên có:
{ path: '/dashboard', name: 'dashboard', component: () => import('../pages/DashboardPage.vue') },
{ path: '/ai/hub', name: 'ai-hub', component: () => import('../pages/AiHubPage.vue') },
{ path: '/cloud', name: 'cloud', component: () => import('../pages/CloudPage.vue') },
// Hoặc giữ /cloud/hub nếu Legacy URL shape được preserve
```

**Registry (`src/utils/ported-pages.js`):**
```js
export const PORTED_PAGES = [
  // ... existing 21 pages ...
  '/dashboard',
  '/ai/hub',    // thay HubPlaceholder
  '/cloud',     // hoặc '/cloud/hub'
];

export const PORTED_PAGE_LABELS = {
  // ... existing ...
  '/dashboard': 'Dashboard',
  '/ai/hub': 'Học AI',
  '/cloud': 'AWS Cloud',  // hoặc '/cloud/hub': 'AWS Cloud'
};
```

**Navigation (`src/pages/HomePage.vue`):**
- Kiểm tra `homeCards` array — thêm Dashboard card nếu chưa có
- Dashboard nên có icon `📊` và mô tả về XP, streak, level

### Automated Test (nếu có)

```js
// test/navigation.test.js
import { describe, it, expect } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import PORTED_PAGES from '../src/utils/ported-pages.js';

describe('Navigation Registry', () => {
  it('all ported pages have routes', () => {
    // Verify each entry in PORTED_PAGES has a corresponding route
  });
});
```

### Strategy

- Đây là **verify story** — không tạo feature mới
- Chạy sau khi 5.1, 5.2, 5.3 hoàn thành
- Kiểm tra tất cả navigation touch points
- Chạy build verify
- Ghi nhận R8 debt nếu còn hex colors

---

## Files to Create/Modify

### Modify
- `src/router/index.js` — verify routes đầy đủ
- `src/utils/ported-pages.js` — verify registry đầy đủ
- `src/pages/HomePage.vue` — thêm Dashboard link nếu cần
- Tạo `tests/navigation.test.js` nếu chưa có (vitest)

### Verify
- Chạy `npm run build` — phải pass
- Manual test: navigate đến `/dashboard`, `/ai/hub`, `/cloud`
- Kiểm tra CNavRedirect không còn redirect pages đã port

---

## Non-Functional Requirements

- **NFR1:** Legacy app luôn chạy được
- **AD-7:** Navigation helper phải đọc PORTED_PAGES đúng
- Build pass: `npm run build` → exit code 0

### R8 Debt Note

Epic 4 đã ghi nhận R8 hex colors debt (~210 instances trong 13 files). Story 5.4 này **KHÔNG** fix R8. Nếu phát hiện thêm trong 3 pages mới, ghi nhận vào story file.

---

## Dev Agent Guardrails

### ✅ PHẢI LÀM
- Verify Dashboard card trong HomePage
- Verify `/ai/hub` route → AiHubPage (không phải HubPlaceholder)
- Verify `/cloud` route → CloudPage (không phải HubPlaceholder)
- Verify `PORTED_PAGES` và `PORTED_PAGE_LABELS` updated
- Chạy `npm run build` và verify pass
- Kiểm tra no console errors khi navigate đến 3 routes mới

### ❌ KHÔNG ĐƯỢC LÀM
- Không tạo pages mới (đã làm trong 5.1, 5.2, 5.3)
- Không sửa logic của 3 pages mới
- Không fix R8 hex colors (chỉ ghi nhận nếu thấy)

### Output
- Story 5.4 hoàn thành khi:
  1. `npm run build` pass
  2. Tất cả 3 routes navigate đúng
  3. Sprint status updated: `epic-5: done`
