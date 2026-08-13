# Story 10.4 — Port Terraform page

## Header

- **Story:** 10.4 — Port Terraform page
- **Epic:** 10 — Port 6 DevOps pages cuối cùng sang Vue
- **Status:** ready-for-dev
- **Created:** 2026-08-13

---

## User Story

As a người dùng,
I want xem nội dung Terraform trên bản Vue,
So that học IaC với UI đồng nhất.

---

## Context

### Source files
- `projects/web-en/pages/devops/terraform.html` → `/devops/terraform` → `DevopsTerraformPage.vue`

### Current state (Vue router)
- Route `/devops` → `DevopsHubPage.vue` (đã port)
- Các sub-pages DevOps còn thiếu: aws, docker, kubernetes, terraform, cicd, monitoring

### Accent Color
- `#7c3aed` (Terraform purple)

### Existing pattern (tham khảo các trang đã port)
- `SpringSectionPage.vue` — content page với sections, code blocks
- `DevopsSectionPage.vue` — DevOps section pattern

---

## Acceptance Criteria

### AC1: DevopsTerraformPage.vue component
- [ ] Convert from `projects/web-en/pages/devops/terraform.html`
- [ ] Route: `/devops/terraform`
- [ ] Pattern: Content page với TOC + sections + code blocks
- [ ] Accent color: `#7c3aed` (Terraform purple)
- [ ] R8: 0 hex hardcoded, dùng CSS variables hoặc `--color-accent` inline style
- [ ] Build passes: `npm run build`

### AC2: Content fidelity
- [ ] 8 sections hiển thị đúng: IaC, HCL, Workflow, State, Modules, Variables, Best Practices, Interview
- [ ] Code snippets trong `<pre><code>` hiển thị đúng (HCL/Terraform syntax)
- [ ] Tags (tag-basic, tag-adv, tag-interview) hiển thị đúng màu
- [ ] Grid layouts (grid-2, grid-3) hoạt động responsive

### AC3: Navigation
- [ ] CTopbar với title "🏗️ Terraform" và back link "← DevOps"
- [ ] TOC links hoạt động (smooth scroll to sections)
- [ ] Links trong content điều hướng đúng

### AC4: PORTED_PAGES Update
- [ ] Add `/devops/terraform` → `'Terraform'`
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
1. **IaC** — Imperative vs Declarative, tại sao Terraform
2. **HCL** — terraform block, provider, resource, data
3. **Workflow** — init → plan → apply lifecycle diagram
4. **State** — local vs remote state, S3 backend example
5. **Modules** — module example, registry
6. **Variables** — input variables, cách truyền giá trị
7. **Best Practices** — grid-2 nên/tránh, workspaces, CI/CD
8. **Interview** — 6 cards câu hỏi

### Tags used
- `tag-basic` (Terraform purple)
- `tag-adv` (AWS orange)
- `tag-interview` (red)

### Special elements
- Lifecycle diagram in section 3

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
1. DevopsTerraformPage renders correctly với `/devops/terraform`
2. All 8 sections display with correct content

**Biên (2):**
3. Empty state — not applicable (static content)
4. Long content — terraform.html có ~390 lines content

**Lỗi (2):**
5. Build fails — hex hardcoded trong style
6. Missing route — `/devops/terraform` not in router

**Invariant (2):**
7. R7: Page không có trong PORTED_PAGES → broken link từ hub
8. R8: Hex hardcoded → lint fail

---

## Files to Create/Modify

- `src/pages/DevopsTerraformPage.vue` (new)
- `src/router/index.js` (add route if not exists)
- `src/utils/ported-pages.js` (add entry)
- `src/pages/DevopsHubPage.vue` (update links if needed)
