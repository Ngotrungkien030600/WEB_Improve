# Story 10.7 — Verify DevOps routing

## Header

- **Story:** 10.7 — Verify DevOps routing
- **Epic:** 10 — Port 6 DevOps pages cuối cùng sang Vue
- **Status:** ready-for-dev
- **Created:** 2026-08-13

---

## User Story

As a người dùng,
I want tất cả 6 DevOps pages đều điều hướng đúng từ DevopsHubPage,
So that không có broken links.

---

## Context

### Pre-requisites
- Stories 10.1 → 10.6 đã hoàn thành
- Tất cả 6 Vue components đã được tạo

### Routes expected
- `/devops/aws` → `DevopsAwsPage.vue`
- `/devops/docker` → `DevopsDockerPage.vue`
- `/devops/kubernetes` → `DevopsKubernetesPage.vue`
- `/devops/terraform` → `DevopsTerraformPage.vue`
- `/devops/cicd` → `DevopsCicdPage.vue`
- `/devops/monitoring` → `DevopsMonitoringPage.vue`

---

## Acceptance Criteria

### AC1: All routes registered
- [ ] `/devops/aws` route exists và points to DevopsAwsPage.vue
- [ ] `/devops/docker` route exists và points to DevopsDockerPage.vue
- [ ] `/devops/kubernetes` route exists và points to DevopsKubernetesPage.vue
- [ ] `/devops/terraform` route exists và points to DevopsTerraformPage.vue
- [ ] `/devops/cicd` route exists và points to DevopsCicdPage.vue
- [ ] `/devops/monitoring` route exists và points to DevopsMonitoringPage.vue

### AC2: PORTED_PAGES complete
- [ ] All 6 DevOps routes entries exist in ported-pages.js
- [ ] No duplicate entries
- [ ] Labels match hub navigation

### AC3: DevopsHubPage links
- [ ] All 6 card links point to correct Vue routes
- [ ] No links pointing to legacy app (web-en)
- [ ] Accent colors applied correctly per section

### AC4: Build verification
- [ ] `npm run build` passes without errors
- [ ] All 6 components compile successfully

### AC5: Epic completion
- [ ] All 6 stories marked as "done" in sprint-status.yaml
- [ ] Epic 10 status updated to "done"

---

## Invariant Compliance

| Invariant | Status | Notes |
|-----------|--------|-------|
| R1 (Layer) | ✅ | All components follow R1 |
| R2 (Single origin) | ✅ | No localhost hardcoded |
| R3 (@legacy) | ✅ | CSS variables imported |
| R7 (Registry) | ✅ | PORTED_PAGES complete |
| R8 (Tokens) | ✅ | All components R8 compliant |

---

## Story Type: LIGHT

**Reasoning:**
- Verification-only story
- Không có logic mới
- Chỉ kiểm tra links và routes

---

## **Hardened:** light (2026-08-13) — 5 AC, 8 cases

**Cases (8 total):**

**Happy path (2):**
1. All 6 routes registered correctly
2. All navigation links work

**Biên (2):**
3. Deep linking — direct URL to `/devops/aws` works
4. Browser back/forward navigation works

**Lỗi (2):**
5. Missing route — component not registered
6. Wrong path — link points to wrong route

**Invariant (2):**
7. R7: Missing entry in PORTED_PAGES → redirect loop
8. Build fail — missing component import

---

## Files to Verify/Modify

- `src/router/index.js` (verify all 6 routes)
- `src/utils/ported-pages.js` (verify all 6 entries)
- `src/pages/DevopsHubPage.vue` (verify links)
- `sprint-status.yaml` (update epic status)
