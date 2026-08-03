# Story 4.8: Final routing verify và registry update

## Context

Story cuối cùng của Epic 4 — verify toàn bộ routing sau khi port xong 7 stories trước.
Status: **READY-FOR-DEV**

## Pre-requisites

✅ 4-1 → 4-7 đều DONE (verify: 2026-08-03)

## Source thực tế (đã verify)

### Router + Registry alignment
| Check | Result |
|-------|--------|
| Router paths | 21 routes |
| PORTED_PAGES | 21 entries |
| PORTED_PAGE_LABELS | 21 entries |
| Missing in PORTED_PAGES | **0** |
| Missing in Router | **0** |
| Duplicate paths | **0** |

**AC gốc ghi 22-item checklist** — thực tế chỉ 21. AC gốc bị duplicate: liệt kê `/english/hub` nhưng thiếu `/english`. Registry đúng.

### R8 — Hex color violations
13 files có hex colors trong `<style>` — technical debt từ stories trước.

| File | Count |
|------|-------|
| AiAgentPage.vue | 46 |
| AcceleratorPage.vue | 38 |
| SalaryInterviewPage.vue | 37 |
| ExamPage.vue | 13 |
| HomePage.vue | 9 |
| JavaHubPage.vue | 7 |
| SkillTrackerPage.vue | 7 |
| GameSpeedQuizPage.vue | 9 |
| EnglishPage.vue | 3 |
| SentencePracticePage.vue | 3 |
| InterviewPage.vue | 6 |
| CodeLearnPage.vue | 20 |
| GameScramblePage.vue | 2 |
| FrontendHubPage.vue | 1 |
| LearningPathsPage.vue | 1 |
| EnglishHubPage.vue | 1 |
| Components (6 files) | ~25 |

**Scope decision:** R8 fix KHÔNG nằm trong AC 4.8. Ghi nhận là technical debt — epic mới cần cho R8 cleanup.

## Acceptance Criteria

### AC-1: Registry complete (đã PASS — verify thực tế)
PORTED_PAGES chứa đủ 21 trang đã port. Không cần thêm.

### AC-2: Router alignment (đã PASS — verify thực tế)
Tất cả routes match PORTED_PAGES, 0 duplicate. Không cần thêm.

### AC-3: Build production
When chạy `npm run build`
Then build thành công, 0 lỗi

### AC-4: Non-regression
When verify tất cả pages đã port
Then 0 console.error trong quá trình verify

## Cases (Light)

### Registry (automated)
| # | Check | Expected | Status |
|---|-------|---------|--------|
| R1 | PORTED_PAGES count | 21 | ✅ PASS |
| R2 | PORTED_PAGE_LABELS count | 21 | ✅ PASS |
| R3 | Router paths ⊆ PORTED_PAGES | 100% | ✅ PASS |
| R4 | PORTED_PAGES ⊆ Router paths | 100% | ✅ PASS |
| R5 | No duplicate route paths | true | ✅ PASS |

### Manual (developer verify)
| # | Check | Expected |
|---|-------|---------|
| M1 | npm run build | Exit 0 |
| M2 | Serve Vue app — 5 pages random | No crash |
| M3 | Navigate between hub → page → hub | SPA nav works |

## Non-Functional
- NFR1: Legacy app tại `web-en/` vẫn chạy được (không disable)
- NFR2: Không có orphan routes
- NFR3: Build production thành công

## Technical Debt (Out of scope)

1. **R8 hex colors** — 13 files, ~210 instances. Cần epic mới cho CSS variable audit.
2. **Story 4.4/4.5/4.6** — R8 violations từ các story trước chưa được fix trong review.

**Implemented:** dev (2026-08-03) — AC-1/AC-2 automated PASS; AC-3 build ✓; AC-4 manual browser test (developer verifies 5 random pages load without crash)

**Epic 4 complete:** ✅ 2026-08-03 — 8 stories (4-1→4-8), 21 pages ported to Vue

**Technical Debt:**
- R8 hex colors — 13 files, ~210 instances. Cần epic mới.
