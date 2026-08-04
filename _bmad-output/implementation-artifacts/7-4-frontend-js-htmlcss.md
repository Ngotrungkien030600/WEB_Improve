# Story 7.4 — Frontend JavaScript & HTML/CSS

## Header

- **Story:** 7.4 — Frontend JavaScript & HTML/CSS
- **Epic:** 7 — Complete Vue Port
- **Status:** review
- **Created:** 2026-08-04

---

## User Story

As a user,
I want to access Frontend JavaScript and HTML/CSS pages from the Vue app,
So that I can learn frontend fundamentals without leaving the Vue app.

---

## Context

### Source files
- `projects/web-en/pages/frontend/javascript.html` → `projects/web-app/src/pages/FrontendJavaScriptPage.vue`
- `projects/web-en/pages/frontend/html-css.html` → `projects/web-app/src/pages/FrontendHtmlCssPage.vue`

### Source analysis
- `javascript.html`: 135 lines, 8 sections (ES6+, Closure, Promise, Async, Event Loop, DOM, Array Methods, Web APIs, TypeScript) — static content
- `html-css.html`: 162 lines, 8 sections (Semantic, Box Model, Flexbox, Grid, Custom Properties, Animations, BEM, 25+ Techniques) — static content with grid-2 cards

### Routes
- `/frontend/javascript`
- `/frontend/html-css`

---

## Acceptance Criteria

### AC1: FrontendJavaScriptPage.vue
- [ ] Convert from `frontend/javascript.html`
- [ ] Route: `/frontend/javascript`
- [ ] R8: CSS tokens via `@import '@legacy/css/variables.css'` — 0 hex in style
- [ ] Build passes

### AC2: FrontendHtmlCssPage.vue
- [ ] Convert from `frontend/html-css.html`
- [ ] Route: `/frontend/html-css`
- [ ] R8: CSS tokens via `@import '@legacy/css/variables.css'` — 0 hex in style
- [ ] Build passes

### AC3: Integration
- [ ] Both pages in Vue router
- [ ] Frontend hub card links point to Vue routes (`/frontend/javascript`, `/frontend/html-css`)
- [ ] No redirects to legacy

### AC4: FrontendJavaScriptPage — Features
- [ ] 8 sections rendered with pre/code blocks
- [ ] Links: "← Frontend" → `/frontend/hub`, "Trang chủ" → `/`
- [ ] grid-2 layout for Web APIs section (4 cards)

### AC5: FrontendHtmlCssPage — Features
- [ ] 8 sections rendered with pre/code blocks
- [ ] Links: "← Frontend" → `/frontend/hub`, "Trang chủ" → `/`
- [ ] grid-2 layout for Semantic (6 cards) and 25+ Techniques (25 cards)

### AC6: FR-6 Five-Point Comparison
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
- 2 content pages đơn giản, pattern giống FrontendResponsivePage đã port
- Static content với code snippets — không có business logic
- Không chạm R1-R8 invariant phức tạp (chỉ R8 đơn giản)

---

## Cases

**Happy path (3):**
1. FrontendJavaScriptPage renders correctly với 8 sections và pre/code blocks
2. FrontendHtmlCssPage renders correctly với 8 sections và grid-2 cards
3. Both pages accessible via Vue router from FrontendHubPage

**Biên (1):**
4. Empty state — không có crash khi sections không load được data (pages là pure static, không fetch)

**Lỗi (1):**
5. Build fails — hex hardcoded trong `<style scoped>` (R8 violation)

**Invariant (1):**
6. R8: Hex hardcoded → lint/build fail

---

**Implemented:** 2026-08-05 — 2 pages (FrontendJavaScriptPage, FrontendHtmlCssPage), routes, build pass

---

## **Hardened:** light (2026-08-05) — 6 AC, 6 cases (happy/biên/lỗi/invariant), guard=n/a
