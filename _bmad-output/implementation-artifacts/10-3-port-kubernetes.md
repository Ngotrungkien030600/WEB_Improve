# Story 10.3 — Port Kubernetes page

## Header

- **Story:** 10.3 — Port Kubernetes page
- **Epic:** 10 — Port 6 DevOps pages cuối cùng sang Vue
- **Status:** ready-for-dev
- **Created:** 2026-08-13

---

## User Story

As a người dùng,
I want xem nội dung Kubernetes trên bản Vue,
So that học K8s với UI đồng nhất.

---

## Context

### Source files
- `projects/web-en/pages/devops/kubernetes.html` → `/devops/kubernetes` → `DevopsKubernetesPage.vue`

### Current state (Vue router)
- Route `/devops` → `DevopsHubPage.vue` (đã port)
- Các sub-pages DevOps còn thiếu: aws, docker, kubernetes, terraform, cicd, monitoring

### Accent Color
- `#326ce5` (Kubernetes blue)

### Existing pattern (tham khảo các trang đã port)
- `SpringSectionPage.vue` — content page với sections, code blocks
- `DevopsSectionPage.vue` — DevOps section pattern

---

## Acceptance Criteria

### AC1: DevopsKubernetesPage.vue component
- [ ] Convert from `projects/web-en/pages/devops/kubernetes.html`
- [ ] Route: `/devops/kubernetes`
- [ ] Pattern: Content page với TOC + sections + code blocks
- [ ] Accent color: `#326ce5` (K8s blue)
- [ ] R8: 0 hex hardcoded, dùng CSS variables hoặc `--color-accent` inline style
- [ ] Build passes: `npm run build`

### AC2: Content fidelity
- [ ] 8 sections hiển thị đúng: Overview, Pod, Deployment, Service, ConfigMap/Secret, HPA, Namespace, Interview
- [ ] Code snippets trong `<pre><code>` hiển thị đúng (YAML manifests)
- [ ] Tags (tag-core, tag-adv, tag-interview) hiển thị đúng màu
- [ ] Grid layouts (grid-2, grid-3) hoạt động responsive

### AC3: Navigation
- [ ] CTopbar với title "☸️ Kubernetes" và back link "← DevOps"
- [ ] TOC links hoạt động (smooth scroll to sections)
- [ ] Links trong content điều hướng đúng

### AC4: PORTED_PAGES Update
- [ ] Add `/devops/kubernetes` → `'Kubernetes'`
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
1. **Overview** — K8s architecture diagram, Control Plane vs Worker Nodes
2. **Pod** — Pod YAML, commands
3. **Deployment** — Deployment YAML, rolling update, rollback
4. **Service & Ingress** — ClusterIP, NodePort, LoadBalancer, Ingress YAML
5. **ConfigMap & Secret** — YAML examples, cách dùng trong Pod
6. **Autoscaling** — HPA YAML, requests vs limits
7. **Namespace & kubectl** — commands, Helm
8. **Interview** — 6 cards câu hỏi

### Tags used
- `tag-core` (K8s blue)
- `tag-adv` (AWS orange)
- `tag-interview` (red)

### Special elements
- ASCII diagram in section 1 (Control Plane architecture)
- Diagram boxes showing deployment flow

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
1. DevopsKubernetesPage renders correctly với `/devops/kubernetes`
2. All 8 sections display with correct content

**Biên (2):**
3. Empty state — not applicable (static content)
4. Long content — kubernetes.html có ~400 lines content

**Lỗi (2):**
5. Build fails — hex hardcoded trong style
6. Missing route — `/devops/kubernetes` not in router

**Invariant (2):**
7. R7: Page không có trong PORTED_PAGES → broken link từ hub
8. R8: Hex hardcoded → lint fail

---

## Files to Create/Modify

- `src/pages/DevopsKubernetesPage.vue` (new)
- `src/router/index.js` (add route if not exists)
- `src/utils/ported-pages.js` (add entry)
- `src/pages/DevopsHubPage.vue` (update links if needed)
