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

### AC4: FrontendUiInterviewPage — Features
- [ ] Tier tabs (Junior/Middle/Senior) switch questions
- [ ] Click question to expand/collapse answer
- [ ] Question count per tier displayed
- [ ] Toggle text changes: "📝 Xem trả lời" ↔ "🙈 Ẩn trả lời"

### AC5: FrontendResponsivePage — Features
- [ ] Section content: Breakpoint, Mobile-first, Fluid Typography, Container Queries, Responsive Images, Touch & Pointer, Logical Properties
- [ ] R8: CSS tokens dùng thay vì hex hardcoded

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
| R8 (Tokens) | ✅ | 0 hex, dùng CSS variables |

---

## Story Type: LIGHT

**Reasoning:**
- 2 content pages đơn giản, pattern giống CloudHubPage đã port
- FrontendUiInterviewPage: tabs + expandable Q&A (tương tự InterviewPage đã port)
- FrontendResponsivePage: static content với code snippets
- Không có business logic phức tạp, không chạm R1-R8 invariant phức tạp

---

## **Implemented:** dev-story (2026-08-04) — 3 files

- `FrontendUiInterviewPage.vue` — /frontend/ui-interview
- `FrontendResponsivePage.vue` — /frontend/responsive
- Routes + hub links updated

## **Hardened:** light (2026-08-04) — 6 AC, 6 cases (happy/biên/lỗi/invariant), guard=n/a

**Cases (6 total):**

**Happy path (3):**
1. FrontendUiInterviewPage renders correctly với 3 tier tabs và questions
2. FrontendResponsivePage renders correctly với 7 sections và code snippets
3. Both pages accessible via Vue router from FrontendHubPage

**Biên (1):**
4. Empty state — không có questions hiển thị đúng khi không load được data

**Lỗi (1):**
5. Build fails — hex hardcoded trong style

**Invariant (1):**
6. R8: Hex hardcoded → lint fail
