# Story 7.1 — AI & Cloud Hubs (Root Pages)

## Header

- **Story:** 7.1 — AI & Cloud Hubs (Root Pages)
- **Epic:** 7 — Complete Vue Port
- **Status:** ready-for-dev → **in-progress** → **review**
- **Created:** 2026-08-04

---

## User Story

As a user,
I want to access AI Hub and Cloud Hub from the Vue app,
So that I don't need to switch to legacy app for these pages.

---

## Context

### Source files (ROOT pages, không trong subfolder)
- `projects/web-en/pages/ai.html` → `/ai` → `AiHubPage.vue`
- `projects/web-en/pages/cloud.html` → `/cloud` → `CloudHubPage.vue`

### Current state (VU router)
- Route `/ai/hub` → `AiHubPage.vue` (placeholder/component sẵn)
- Route `/cloud/hub` → `HubPlaceholder.vue` (cần thay thế)

### IMPORTANT: Route correction
- Legacy `ai.html` ở root → `/ai` (KHÔNG phải `/ai/hub`)
- Legacy `cloud.html` ở root → `/cloud` (KHÔNG phải `/cloud/hub`)
- Cần UPDATE router và ported-pages để dùng `/ai`, `/cloud`

### Existing Hub pages pattern (tham khảo)
- `JavaHubPage.vue` — CTopbar + CGrid + CHubCard pattern
- `FrontendHubPage.vue` — same pattern

### Token Source
- `projects/web-en/css/variables.css`
- Import: `@import '@legacy/css/variables.css';`

---

## Acceptance Criteria

### AC1: AiHubPage.vue
- [ ] Convert from `projects/web-en/pages/ai.html`
- [ ] Route: `/ai` (UPDATE router: `/ai/hub` → `/ai`)
- [ ] Pattern: Hub page (CTopbar + CGrid + CHubCard hoặc tương tự)
- [ ] Accent color: `#764ba2` (purple, từ ai.css)
- [ ] R8: 0 hex hardcoded, dùng CSS tokens
- [ ] Build passes: `npm run build`

### AC2: CloudHubPage.vue
- [ ] Convert from `projects/web-en/pages/cloud.html`
- [ ] Route: `/cloud` (UPDATE router: `/cloud/hub` → `/cloud`)
- [ ] Pattern: Content-rich page với TOC, sections, code blocks
- [ ] Accent color: `#ff9900` (AWS orange, inline style)
- [ ] R8: 0 hex hardcoded trong `<style scoped>`
- [ ] Build passes: `npm run build`

### AC3: Router Update
- [ ] Route `/ai` (từ `/ai/hub`)
- [ ] Route `/cloud` (từ `/cloud/hub`)
- [ ] AiHubPage.vue component path updated

### AC4: PORTED_PAGES Update
- [ ] Add `/ai` → `'Học AI'`
- [ ] Add `/cloud` → `'AWS Cloud'`
- [ ] Remove `/ai/hub` và `/cloud/hub` nếu không dùng

### AC5: Navigation Links
- [ ] HomePage cards link to `/ai`, `/cloud`
- [ ] Các hub khác link đúng
- [ ] No redirects to legacy

### AC6: FR-6 Five-Point Comparison
- [ ] Block layout — khớp legacy
- [ ] Color — dùng token, khớp legacy
- [ ] Spacing — khớp legacy
- [ ] Font/size — khớp legacy
- [ ] Hover state — khớp legacy

---

## Invariant Compliance

| Invariant | Status | Notes |
|-----------|--------|-------|
| R1 (Layer) | ✅ | pages/ import from components/ + @legacy/ |
| R2 (Single origin) | ✅ | No localhost:8080 hardcoded |
| R3 (@legacy) | ✅ | Import từ @legacy/css/variables.css |
| R7 (Registry) | ✅ | Update PORTED_PAGES |
| R8 (Tokens) | ✅ | 0 hex, dùng CSS variables |

---

## Story Type: LIGHT

**Reasoning:**
- Story port 2 hub pages đơn giản
- Không chạm R1-R8 invariant violations
- Không có business logic phức tạp
- Pattern đã có sẵn (JavaHubPage, FrontendHubPage)

---

## **Hardened:** light (2026-08-04) — 6 AC, 8 cases (happy/biên/lỗi/invariant), guard=n/a

**Cases (8 total):**

**Happy path (2):**
1. AiHubPage renders correctly với `/ai`
2. CloudHubPage renders correctly với `/cloud`

**Biên (2):**
3. Empty state — không có data
4. Long content — cloud.html có 1100+ lines

**Lỗi (2):**
5. Build fails — hex hardcoded trong style
6. Route conflict — `/ai/hub` vs `/ai`

**Invariant (2):**
7. R7: Page không có trong PORTED_PAGES → redirect loop
8. R8: Hex hardcoded → lint fail

---

## **Implemented:** dev-story (2026-08-04) — 5 files

**Files changed:**
- `src/pages/CloudHubPage.vue` (new)
- `src/router/index.js` (updated routes)
- `src/utils/ported-pages.js` (updated registry)
- `src/pages/HomePage.vue` (updated links)
- `src/pages/LearningPathsPage.vue` (updated link)
