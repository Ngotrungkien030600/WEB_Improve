# Story 10.5 — Port CI/CD page

## Header

- **Story:** 10.5 — Port CI/CD page
- **Epic:** 10 — Port 6 DevOps pages cuối cùng sang Vue
- **Status:** ready-for-dev
- **Created:** 2026-08-13

---

## User Story

As a người dùng,
I want xem nội dung CI/CD trên bản Vue,
So that học DevOps với UI đồng nhất.

---

## Context

### Source files
- `projects/web-en/pages/devops/cicd.html` → `/devops/cicd` → `DevopsCicdPage.vue`

### Current state (Vue router)
- Route `/devops` → `DevopsHubPage.vue` (đã port)
- Các sub-pages DevOps còn thiếu: aws, docker, kubernetes, terraform, cicd, monitoring

### Accent Color
- `#34d399` (CI/CD green)

### Existing pattern (tham khảo các trang đã port)
- `SpringSectionPage.vue` — content page với sections, code blocks
- `DevopsSectionPage.vue` — DevOps section pattern

---

## Acceptance Criteria

### AC1: DevopsCicdPage.vue component
- [ ] Convert from `projects/web-en/pages/devops/cicd.html`
- [ ] Route: `/devops/cicd`
- [ ] Pattern: Content page với TOC + sections + code blocks
- [ ] Accent color: `#34d399` (CI/CD green)
- [ ] R8: 0 hex hardcoded, dùng CSS variables hoặc `--color-accent` inline style
- [ ] Build passes: `npm run build`

### AC2: Content fidelity
- [ ] 8 sections hiển thị đúng: Concept, Pipeline, GitHub Actions, Jenkins, Deploy Strategies, GitOps, Quality Gates, Interview
- [ ] Code snippets trong `<pre><code>` hiển thị đúng (YAML/Groovy)
- [ ] Tags (tag-basic, tag-adv, tag-interview) hiển thị đúng màu
- [ ] Grid layouts (grid-2, grid-3) hoạt động responsive

### AC3: Navigation
- [ ] CTopbar với title "🔄 CI/CD" và back link "← DevOps"
- [ ] TOC links hoạt động (smooth scroll to sections)
- [ ] Links trong content điều hướng đúng

### AC4: PORTED_PAGES Update
- [ ] Add `/devops/cicd` → `'CI/CD'`
- [ ] Update DevopsHubPage links nếu cần

### AC5: FR-6 Five-Point Comparison
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
| R8 (Tokens) | ✅ | 0 hex, dùng CSS variables hoặc --color-accent inline |

---

## Dev Notes

### Content Structure (8 sections)
1. **CI/CD Concept** — CI vs CD, benefits, diagram
2. **Pipeline** — 8 stages, pipeline as code
3. **GitHub Actions** — workflow YAML, CI/CD với Docker
4. **Jenkins** — Jenkinsfile, comparison với GHA
5. **Deploy Strategies** — Rolling, Blue/Green, Canary, A/B
6. **GitOps** — ArgoCD, Flux, benefits
7. **Quality Gates** — coverage, SonarQube, security scans
8. **Interview** — 6 cards câu hỏi

### Tags used
- `tag-basic` (CI/CD green)
- `tag-adv` (AWS orange)
- `tag-interview` (red)

### Special elements
- Comparison tables in sections 4 và 5

---

## Story Type: LIGHT

**Reasoning:**
- Story port 1 content page đơn giản
- Không chạm business logic
- Pattern đã có sẵn
- Content-heavy nhưng structure consistent

---

## **Hardened:** light (2026-08-13) — 5 AC, 8 cases (happy/biên/lỗi/invariant)

**Cases (8 total):**

**Happy path (2):**
1. DevopsCicdPage renders correctly với `/devops/cicd`
2. All 8 sections display with correct content

**Biên (2):**
3. Empty state — not applicable (static content)
4. Long content — cicd.html có ~320 lines content

**Lỗi (2):**
5. Build fails — hex hardcoded trong style
6. Missing route — `/devops/cicd` not in router

**Invariant (2):**
7. R7: Page không có trong PORTED_PAGES → broken link từ hub
8. R8: Hex hardcoded → lint fail

---

## Files to Create/Modify

- `src/pages/DevopsCicdPage.vue` (new)
- `src/router/index.js` (add route if not exists)
- `src/utils/ported-pages.js` (add entry)
- `src/pages/DevopsHubPage.vue` (update links if needed)
