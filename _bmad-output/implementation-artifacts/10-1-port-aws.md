# Story 10.1 — Port AWS page

## Header

- **Story:** 10.1 — Port AWS page
- **Epic:** 10 — Port 6 DevOps pages cuối cùng sang Vue
- **Status:** ready-for-dev
- **Created:** 2026-08-13

---

## User Story

As a người dùng,
I want xem nội dung AWS Cloud trên bản Vue,
So that có trải nghiệm học tập đồng nhất.

---

## Context

### Source files
- `projects/web-en/pages/devops/aws.html` → `/devops/aws` → `DevopsAwsPage.vue`

### Current state (Vue router)
- Route `/devops` → `DevopsHubPage.vue` (đã port)
- Các sub-pages DevOps còn thiếu: aws, docker, kubernetes, terraform, cicd, monitoring

### Accent Color
- `#ff9900` (AWS orange)

### Existing pattern (tham khảo các trang đã port)
- `SpringSectionPage.vue` — content page với sections, code blocks
- `DevopsSectionPage.vue` — DevOps section pattern

---

## Acceptance Criteria

### AC1: DevopsAwsPage.vue component
- [ ] Convert from `projects/web-en/pages/devops/aws.html`
- [ ] Route: `/devops/aws`
- [ ] Pattern: Content page với TOC + sections + code blocks
- [ ] Accent color: `#ff9900` (AWS orange)
- [ ] R8: 0 hex hardcoded, dùng CSS variables hoặc `--color-accent` inline style
- [ ] Build passes: `npm run build`

### AC2: Content fidelity
- [ ] 6 sections hiển thị đúng: Overview, Compute, Storage, Network, DevOps, Interview
- [ ] Code snippets trong `<pre><code>` hiển thị đúng
- [ ] Tags (tag-compute, tag-storage, tag-db, tag-net, tag-sec) hiển thị đúng màu
- [ ] Grid layouts (grid-2, grid-3) hoạt động responsive

### AC3: Navigation
- [ ] CTopbar với title "☁️ AWS Cloud" và back link "← DevOps"
- [ ] TOC links hoạt động (smooth scroll to sections)
- [ ] Links trong content điều hướng đúng

### AC4: PORTED_PAGES Update
- [ ] Add `/devops/aws` → `'AWS Cloud'`
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

### Content Structure (6 sections)
1. **Overview** — grid-2 với 4 cards (Compute, Storage, Network, Security)
2. **Compute** — EC2, ECS/EKS, Lambda với code snippets
3. **Storage** — S3, RDS vs DynamoDB, grid-2 cards
4. **Network** — VPC structure diagram, Security Groups vs NACL, IAM
5. **DevOps** — CI/CD tools (CodePipeline, CodeBuild, CodeDeploy), IaC
6. **Interview** — 6 cards với câu hỏi phỏng vấn

### Tags used
- `tag-compute` (AWS orange)
- `tag-storage` (cyan)
- `tag-db` (green)
- `tag-net` (pink)
- `tag-sec` (yellow)

---

## Story Type: LIGHT

**Reasoning:**
- Story port 1 content page đơn giản
- Không chạm business logic
- Pattern đã có sẵn (SpringSectionPage, DevopsSectionPage)
- Content-heavy nhưng structure consistent

---

## **Hardened:** light (2026-08-13) — 5 AC, 8 cases (happy/biên/lỗi/invariant)

**Cases (8 total):**

**Happy path (2):**
1. DevopsAwsPage renders correctly với `/devops/aws`
2. All 6 sections display with correct content

**Biên (2):**
3. Empty state — not applicable (static content)
4. Long content — aws.html có ~240 lines content

**Lỗi (2):**
5. Build fails — hex hardcoded trong style
6. Missing route — `/devops/aws` not in router

**Invariant (2):**
7. R7: Page không có trong PORTED_PAGES → broken link từ hub
8. R8: Hex hardcoded → lint fail

---

## Files to Create/Modify

- `src/pages/DevopsAwsPage.vue` (new)
- `src/router/index.js` (add route if not exists)
- `src/utils/ported-pages.js` (add entry)
- `src/pages/DevopsHubPage.vue` (update links if needed)
