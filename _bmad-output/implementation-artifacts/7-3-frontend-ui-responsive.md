# Story 7.3 — Frontend UI & Responsive

## Header

- **Story:** 7.3 — Frontend UI & Responsive
- **Epic:** 7 — Complete Vue Port
- **Status:** backlog
- **Created:** 2026-08-04

---

## User Story

As a user,
I want to access Frontend UI Interview and Responsive pages from the Vue app,
So that I can learn frontend topics without leaving the Vue app.

---

## Context

### Source files
- `projects/web-en/pages/frontend/ui-interview.html` → `projects/web-app/src/pages/FrontendUiInterviewPage.vue`
- `projects/web-en/pages/frontend/responsive.html` → `projects/web-app/src/pages/FrontendResponsivePage.vue`

### Routes
- `/frontend/ui-interview`
- `/frontend/responsive`

---

## Acceptance Criteria

### AC1: FrontendUiInterviewPage.vue
- [ ] Convert from `frontend/ui-interview.html`
- [ ] Route: `/frontend/ui-interview`
- [ ] Build passes

### AC2: FrontendResponsivePage.vue
- [ ] Convert from `frontend/responsive.html`
- [ ] Route: `/frontend/responsive`
- [ ] Build passes

### AC3: Integration
- [ ] Both pages in Vue router
- [ ] Frontend hub card links point to Vue routes
- [ ] No redirects to legacy

---

## Technical Notes

### Token Source
- `projects/web-en/css/variables.css`
- Import: `@import '@legacy/css/variables.css';`

### R8 Invariant
- Dùng CSS tokens thay vì hex hardcoded
- Check: `npm run build` pass
