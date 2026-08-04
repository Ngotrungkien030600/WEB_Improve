# Story 7.5 — Frontend Frameworks

## Header

- **Story:** 7.5 — Frontend Frameworks
- **Epic:** 7 — Complete Vue Port
- **Status:** ready-for-dev
- **Created:** 2026-08-04

---

## User Story

As a user,
I want to access Frontend Frameworks page from the Vue app,
So that I can learn frontend frameworks without leaving the Vue app.

---

## Context

### Source file
- `projects/web-en/pages/frontend/frameworks.html` → `projects/web-app/src/pages/FrontendFrameworksPage.vue`

### Route
- `/frontend/frameworks`

---

## Acceptance Criteria

### AC1: FrontendFrameworksPage.vue
- [ ] Convert from `frontend/frameworks.html`
- [ ] Route: `/frontend/frameworks`
- [ ] R8: CSS tokens via `@import '@legacy/css/variables.css'` — 0 hex in style
- [ ] Build passes

### AC2: Integration
- [ ] Page in Vue router (`/frontend/frameworks`)
- [ ] Frontend hub card link points to Vue route
- [ ] No redirect to legacy

### AC3: Page Features
- [ ] 6 sections rendered with pre/code blocks
- [ ] Links: "← Frontend" → `/frontend/hub`, "Trang chủ" → `/`
- [ ] compare grid (3 columns) for framework comparison
- [ ] grid-2 for State Management section (4 cards)

### AC4: FR-6 Five-Point Comparison
- [ ] Block layout — khớp legacy (grid, sections)
- [ ] Color — dùng token, khớp legacy
- [ ] Spacing — khớp legacy (margin, padding, gap)
- [ ] Font/size — khớp legacy (Inter, 0.85rem-1.5rem)
- [ ] Hover state — khớp legacy (pre/code, links)

---

## Invariant Compliance

| Invariant | Status | Notes |
|-----------|--------|-------|
| R1 (Layer) | ✅ | pages/ import from components/ + @legacy/ |
| R2 (Single origin) | ✅ | No localhost:8080 hardcoded |
| R3 (@legacy) | ✅ | Import từ @legacy/css/variables.css |
| R8 (Tokens) | ✅ | 0 hex, dùng CSS variables |

---

## Story Type: LIGHT

**Reasoning:**
- 1 content page đơn giản, pattern giống FrontendJavaScriptPage/FrontendHtmlCssPage đã port
- Static content với code snippets — không có business logic
- Chỉ chạm R8 (CSS tokens), không R1-R7

---

## Cases

**Happy path (2):**
1. FrontendFrameworksPage renders correctly với 6 sections, pre/code blocks, compare grid
2. Page accessible via Vue router from FrontendHubPage

**Biên (1):**
3. Empty state — không có crash (pure static, no data fetch)

**Lỗi (1):**
4. Build fails — hex hardcoded trong `<style scoped>` (R8 violation)

**Invariant (1):**
5. R8: Hex hardcoded → lint/build fail

---

## **Hardened:** light (2026-08-05) — 4 AC, 5 cases (happy/biên/lỗi/invariant), guard=n/a

## **Implemented:** dev-story (2026-08-05) — 2 files (FrontendFrameworksPage.vue, router/index.js)
