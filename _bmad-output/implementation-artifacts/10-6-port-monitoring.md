# Story 10.6 — Port Monitoring page

## Header

- **Story:** 10.6 — Port Monitoring page
- **Epic:** 10 — Port 6 DevOps pages cuối cùng sang Vue
- **Status:** ready-for-dev
- **Created:** 2026-08-13

---

## User Story

As a người dùng,
I want xem nội dung Monitoring trên bản Vue,
So that học Observability với UI đồng nhất.

---

## Context

### Source files
- `projects/web-en/pages/devops/monitoring.html` → `/devops/monitoring` → `DevopsMonitoringPage.vue`

### Current state (Vue router)
- Route `/devops` → `DevopsHubPage.vue` (đã port)
- Các sub-pages DevOps còn thiếu: aws, docker, kubernetes, terraform, cicd, monitoring

### Accent Color
- `#eab308` (Monitoring yellow)

### Existing pattern (tham khảo các trang đã port)
- `SpringSectionPage.vue` — content page với sections, code blocks
- `DevopsSectionPage.vue` — DevOps section pattern

---

## Acceptance Criteria

### AC1: DevopsMonitoringPage.vue component
- [ ] Convert from `projects/web-en/pages/devops/monitoring.html`
- [ ] Route: `/devops/monitoring`
- [ ] Pattern: Content page với TOC + sections + code blocks
- [ ] Accent color: `#eab308` (Monitoring yellow)
- [ ] R8: 0 hex hardcoded, dùng CSS variables hoặc `--color-accent` inline style
- [ ] Build passes: `npm run build`

### AC2: Content fidelity
- [ ] 8 sections hiển thị đúng: Concept, 3 Pillars, Golden Signals, Prometheus, Grafana, CloudWatch, Alerting, Interview
- [ ] Code snippets trong `<pre><code>` hiển thị đúng (PromQL, YAML)
- [ ] Tags (tag-metrics, tag-logs, tag-traces) hiển thị đúng màu
- [ ] Grid layouts (grid-2, grid-3) hoạt động responsive

### AC3: Navigation
- [ ] CTopbar với title "📊 Monitoring & Observability" và back link "← DevOps"
- [ ] TOC links hoạt động (smooth scroll to sections)
- [ ] Links trong content điều hướng đúng

### AC4: PORTED_PAGES Update
- [ ] Add `/devops/monitoring` → `'Monitoring'`
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
1. **Concept** — Monitoring vs Observability, tại sao quan trọng
2. **3 Pillars** — Metrics, Logs, Traces với diagram
3. **Golden Signals** — Latency, Traffic, Errors, Saturation
4. **Prometheus** — metric types, PromQL examples
5. **Grafana** — dashboards, alerting, docker-compose example
6. **CloudWatch** — metrics, logs, alarms, dashboards
7. **Alerting** — best practices, Prometheus rules, incident flow
8. **Interview** — 6 cards câu hỏi

### Tags used
- `tag-metrics` (yellow)
- `tag-logs` (blue)
- `tag-traces` (pink)

### Special elements
- ASCII trace diagram in section 2
- Golden signals distribution example in section 3

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
1. DevopsMonitoringPage renders correctly với `/devops/monitoring`
2. All 8 sections display with correct content

**Biên (2):**
3. Empty state — not applicable (static content)
4. Long content — monitoring.html có ~315 lines content

**Lỗi (2):**
5. Build fails — hex hardcoded trong style
6. Missing route — `/devops/monitoring` not in router

**Invariant (2):**
7. R7: Page không có trong PORTED_PAGES → broken link từ hub
8. R8: Hex hardcoded → lint fail

---

## Files to Create/Modify

- `src/pages/DevopsMonitoringPage.vue` (new)
- `src/router/index.js` (add route if not exists)
- `src/utils/ported-pages.js` (add entry)
- `src/pages/DevopsHubPage.vue` (update links if needed)
