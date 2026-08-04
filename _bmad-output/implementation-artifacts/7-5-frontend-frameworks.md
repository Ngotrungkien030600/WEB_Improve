# Story 7.5 — Frontend Frameworks

## Header

- **Story:** 7.5 — Frontend Frameworks
- **Epic:** 7 — Complete Vue Port
- **Status:** backlog
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
- [ ] Build passes

### AC2: Integration
- [ ] Page in Vue router
- [ ] Frontend hub card link points to Vue route
- [ ] No redirect to legacy

---

## Technical Notes

### Token Source
- `projects/web-en/css/variables.css`
- Import: `@import '@legacy/css/variables.css';`

### R8 Invariant
- Dùng CSS tokens thay vì hex hardcoded
- Check: `npm run build` pass
