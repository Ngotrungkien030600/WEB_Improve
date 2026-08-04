# Story 7.2 — Java Sub-pages

## Header

- **Story:** 7.2 — Java Sub-pages
- **Epic:** 7 — Complete Vue Port
- **Status:** backlog
- **Created:** 2026-08-04

---

## User Story

As a user,
I want to access Java sub-pages from the Vue app,
So that I can learn Java topics without leaving the Vue app.

---

## Context

### Source files
- `projects/web-en/pages/java/thuc-chien.html` → `projects/web-app/src/pages/JavaThucChienPage.vue`
- `projects/web-en/pages/java/spring-boot.html` → `projects/web-app/src/pages/JavaSpringBootPage.vue`
- `projects/web-en/pages/java/backend.html` → `projects/web-app/src/pages/JavaBackendPage.vue`

### Routes
- `/java/thuc-chien`
- `/java/spring-boot`
- `/java/backend`

---

## Acceptance Criteria

### AC1: JavaThucChienPage.vue
- [ ] Convert from `java/thuc-chien.html`
- [ ] Route: `/java/thuc-chien`
- [ ] Build passes

### AC2: JavaSpringBootPage.vue
- [ ] Convert from `java/spring-boot.html`
- [ ] Route: `/java/spring-boot`
- [ ] Build passes

### AC3: JavaBackendPage.vue
- [ ] Convert from `java/backend.html`
- [ ] Route: `/java/backend`
- [ ] Build passes

### AC4: Integration
- [ ] All 3 pages in Vue router
- [ ] Java hub card links point to Vue routes
- [ ] No redirects to legacy

---

## Technical Notes

### Token Source
- `projects/web-en/css/variables.css`
- Import: `@import '@legacy/css/variables.css';`

### R8 Invariant
- Dùng CSS tokens thay vì hex hardcoded
- Check: `npm run build` pass
