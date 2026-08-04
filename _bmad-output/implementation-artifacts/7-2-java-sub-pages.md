# Story 7.2 — Java Sub-pages

## Header

- **Story:** 7.2 — Java Sub-pages
- **Epic:** 7 — Complete Vue Port
- **Status:** backlog
- **Created:** 2026-08-04
- **Override:** AD-14 skip list (user decision)

---

## User Story

As a user,
I want to access Java sub-pages from the Vue app,
So that I can learn Java topics without leaving the Vue app.

---

## Context

### Source files
- `projects/web-en/pages/java/thuc-chien.html` → `/java/thuc-chien` → `JavaThucChienPage.vue`
- `projects/web-en/pages/java/spring-boot.html` → `/java/spring-boot` → `JavaSpringBootPage.vue`
- `projects/web-en/pages/java/backend.html` → `/java/backend` → `JavaBackendPage.vue`

### Routes
- `/java/thuc-chien`
- `/java/spring-boot`
- `/java/backend`

### Token Source
- `projects/web-en/css/variables.css`
- Import: `@import '@legacy/css/variables.css';`

### Accent Color
- Amber: `--color-accent: #f59e0b` (từ legacy variables.css)

---

## Acceptance Criteria

### AC1: JavaThucChienPage.vue
- [ ] Convert from `java/thuc-chien.html`
- [ ] Route: `/java/thuc-chien`
- [ ] Features: Stats, filters (difficulty, category), task grid, task detail panel
- [ ] R8: 0 hex hardcoded, dùng CSS tokens
- [ ] Build passes

### AC2: JavaSpringBootPage.vue
- [ ] Convert from `java/spring-boot.html` (741 lines)
- [ ] Route: `/java/spring-boot`
- [ ] Features: Topic sections, code blocks, cheatsheets
- [ ] R8: 0 hex hardcoded, dùng CSS tokens
- [ ] Build passes

### AC3: JavaBackendPage.vue
- [ ] Convert from `java/backend.html` (656 lines)
- [ ] Route: `/java/backend`
- [ ] Features: Backend topics, SQL, DevOps, System Design
- [ ] R8: 0 hex hardcoded, dùng CSS tokens
- [ ] Build passes

### AC4: Router Integration
- [ ] All 3 routes registered in Vue router
- [ ] No conflicts with existing routes

### AC5: Navigation Links
- [ ] JavaHubPage cards link to new routes
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
| R7 (Registry) | ✅ | Update PORTED_PAGES khi cần |
| R8 (Tokens) | ✅ | 0 hex, dùng CSS variables |

---

## Story Type: LIGHT (override AD-14)

**Reasoning:**
- 3 content pages đơn giản, không có business logic phức tạp
- Pattern đã có sẵn (AiHubPage, CloudHubPage)
- Content-rich pages tương tự CloudHubPage đã port thành công

---

## **Hardened:** light (2026-08-04) — 6 AC, 6 cases (happy/biên/lỗi/invariant), guard=n/a

**Cases (6 total):**

**Happy path (3):**
1. JavaThucChienPage renders correctly với filters và task grid
2. JavaSpringBootPage renders correctly với topic sections
3. JavaBackendPage renders correctly với backend content

**Biên (1):**
4. Empty state — không có task nào sau filter

**Lỗi (1):**
5. Build fails — hex hardcoded trong style

**Invariant (1):**
6. R8: Hex hardcoded → lint fail

---

## **Implemented:** dev-story (2026-08-04) — 3 pages + routes

- `JavaThucChienPage.vue` — /java/thuc-chien
- `JavaSpringBootPage.vue` — /java/spring-boot
- `JavaBackendPage.vue` — /java/backend
- Routes added to `router/index.js`

## **Code-Reviewed:** 2026-08-04 — 0 🔴, 1 🟡 (unused handler removed)

