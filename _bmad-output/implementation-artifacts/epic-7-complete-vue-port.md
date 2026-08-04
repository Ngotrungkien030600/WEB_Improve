# Epic 7: Complete Vue Port — 10 pages còn lại

## Header

- **Epic:** 7 — Complete Vue Port
- **Status:** backlog
- **Created:** 2026-08-04

---

## User Story

As a user,
I want all pages to work from a single Vue app,
So that I only need to run one server and access everything at one URL.

---

## Context

### Current State
- **21 pages** đã port sang Vue (Epic 4-5)
- **10 pages** còn ở Legacy (`web-en/pages/`)
- Vue app chạy ở `http://localhost:5173`
- Legacy app chạy ở `http://localhost:8080`

### Pages cần port

| Trang | File | URL |
|-------|------|-----|
| AI Hub (root) | `ai.html` | /ai |
| Cloud Hub (root) | `cloud.html` | /cloud |
| Java Thực Chiến | `java/thuc-chien.html` | /java/thuc-chien |
| Java Spring Boot | `java/spring-boot.html` | /java/spring-boot |
| Java Backend | `java/backend.html` | /java/backend |
| Frontend UI Interview | `frontend/ui-interview.html` | /frontend/ui-interview |
| Frontend Responsive | `frontend/responsive.html` | /frontend/responsive |
| Frontend JavaScript | `frontend/javascript.html` | /frontend/javascript |
| Frontend HTML/CSS | `frontend/html-css.html` | /frontend/html-css |
| Frontend Frameworks | `frontend/frameworks.html` | /frontend/frameworks |

### Chưa port: ~10 trang

---

## Technical Approach

### Strategy: Batch Port by Category

1. **AI & Cloud Hub** — 2 pages (ai.html, cloud.html)
2. **Java sub-pages** — 3 pages (thuc-chien, spring-boot, backend)
3. **Frontend sub-pages** — 5 pages (ui-interview, responsive, javascript, html-css, frameworks)

### Port Pattern
1. Copy HTML structure từ `web-en/pages/` → `web-app/src/pages/`
2. Copy CSS dependencies (hoặc import từ variables.css)
3. Add routes vào Vue router
4. Update navigation registry
5. Add vào `PORTED_PAGES` trong `ported-pages.js`

### Token Source
- `projects/web-en/css/variables.css` — design tokens
- Import trong Vue: `@import '@legacy/css/variables.css';`

---

## Stories Breakdown

### Story 7.1: AI & Cloud Hubs
- `AiHubPage.vue` (từ `ai.html`)
- `CloudHubPage.vue` (từ `cloud.html`)
- Status: **backlog**

### Story 7.2: Java Sub-pages
- `JavaThucChienPage.vue` (từ `java/thuc-chien.html`)
- `JavaSpringBootPage.vue` (từ `java/spring-boot.html`)
- `JavaBackendPage.vue` (từ `java/backend.html`)
- Status: **backlog**

### Story 7.3: Frontend UI & Responsive
- `FrontendUiInterviewPage.vue` (từ `frontend/ui-interview.html`)
- `FrontendResponsivePage.vue` (từ `frontend/responsive.html`)
- Status: **backlog**

### Story 7.4: Frontend JavaScript & HTML/CSS
- `FrontendJavaScriptPage.vue` (từ `frontend/javascript.html`)
- `FrontendHtmlCssPage.vue` (từ `frontend/html-css.html`)
- Status: **backlog**

### Story 7.5: Frontend Frameworks
- `FrontendFrameworksPage.vue` (từ `frontend/frameworks.html`)
- Status: **backlog**

### Story 7.6: Navigation Registry & Final Verify
- Verify all 10 pages accessible
- Update `PORTED_PAGES` list
- Verify Vue app complete
- Status: **backlog**

---

## Acceptance Criteria

### AC1: All Pages Ported
- [ ] 10 pages hoạt động trên Vue app
- [ ] No redirects to legacy app
- [ ] All navigation links work

### AC2: Single App Goal
- [ ] User chỉ cần chạy `npm run dev`
- [ ] Access tất cả pages từ http://localhost:5173
- [ ] Legacy app có thể tắt

### AC3: No Regressions
- [ ] 21 pages đã port vẫn hoạt động
- [ ] Build passes
- [ ] No console errors

### AC4: Epic Complete
- [ ] Epic 7 status → `done`
- [ ] Sprint summary

---

## Non-Functional Requirements

- **NFR1**: Build phải pass sau mỗi story
- **NFR2**: R8 invariant — dùng CSS tokens thay vì hex hardcoded
- **NFR3**: Zero production impact — legacy app không bị ảnh hưởng

---

## Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Pages ported | 21 | 31 |
| Legacy pages | 10 | 0 |
| App URLs | 2 | 1 |
