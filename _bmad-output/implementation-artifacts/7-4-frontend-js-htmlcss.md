# Story 7.4 — Frontend JavaScript & HTML/CSS

## Header

- **Story:** 7.4 — Frontend JavaScript & HTML/CSS
- **Epic:** 7 — Complete Vue Port
- **Status:** backlog
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

### Routes
- `/frontend/javascript`
- `/frontend/html-css`

---

## Acceptance Criteria

### AC1: FrontendJavaScriptPage.vue
- [ ] Convert from `frontend/javascript.html`
- [ ] Route: `/frontend/javascript`
- [ ] Build passes

### AC2: FrontendHtmlCssPage.vue
- [ ] Convert from `frontend/html-css.html`
- [ ] Route: `/frontend/html-css`
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
