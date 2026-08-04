# Story 6.2 — Page Components (Top 8 files)

## Header

- **Story:** 6.2 — Page Components (Top 8 files)
- **Epic:** 6 — R8 CSS Audit
- **Status:** backlog
- **Created:** 2026-08-04

---

## User Story

As a developer,
I want to migrate hardcoded hex colors in the top 8 Vue page files to CSS tokens,
So that R8 invariant is satisfied for these high-violation files.

---

## Context

### Source Data
- Detection: `scripts/hex-audit.js` (story 6.1)
- Report: `hex-audit-report.json`
- Token mapping: `hex-token-mapping.md`

### Files to Migrate (Top 8 by violations)

| Rank | File | Replaceable | Total |
|------|------|-------------|-------|
| 1 | `pages/AiAgentPage.vue` | 48 | 48 |
| 2 | `pages/SalaryInterviewPage.vue` | 36 | 36 |
| 3 | `pages/AcceleratorPage.vue` | 35 | 35 |
| 4 | `pages/AiHubPage.vue` | 27 | 27 |
| 5 | `pages/CodeLearnPage.vue` | 19 | 19 |
| 6 | `pages/ExamPage.vue` | 12 | 12 |
| 7 | `components/ForgeTimer.vue` | 10 | 10 |
| 8 | `pages/GameSpeedQuizPage.vue` | 10 | 10 |

**Total: 197 hex instances to migrate**

### Token Mapping (from story 6.1)

Existing tokens available:
```css
--text-primary: #1e293b
--text-muted: #94a3b8
--color-primary: #667eea
--color-secondary: #764ba2
--color-error: #ef4444
--color-warning: #f59e0b
--text-white: #ffffff
```

New tokens added (story 6.1):
```css
/* Dark mode */
--color-bg-page: #08080e
--color-bg-page-alt: #0d0d1a
--color-bg-surface-dark: #0f0e17
--color-surface-dark: #1a1928
--color-surface-dark-2: #22213a
--color-border-dark: #2d2b44

/* Text */
--text-tertiary: #64748b
--text-secondary-muted: #9d9bb5

/* Semantic */
--color-link: #1565c0
--color-warning-dark: #92400e
--color-warning-alt: #ea580c
--color-accent-light: #a78bfa

/* Background */
--color-bg-subtle: #f1f5f9
--color-info-bg: #e3f2fd
--color-warning-bg: #fef3c7
--color-accent-bg: #f3e5f5

/* Border */
--color-border-light: #e0e0e0
--color-border-subtle: #e2e8f0
```

### Migration Pattern

**Before:**
```css
background: #08080e;
```

**After:**
```css
background: var(--color-bg-page);
```

**With fallback (recommended for production safety):**
```css
background: var(--color-bg-page, #08080e);
```

### Exclusions (Do NOT replace)

1. **Fallback pattern**: `var(--token, #hex)` — keep as-is
2. **Accent overrides**: `style="--color-accent: #xxx"` — legitimate per AD-17
3. **Code syntax**: `#1e1e1e`, `#d4d4d4` — syntax highlighting
4. **Linear gradients**: keep complex gradients as-is

---

## Acceptance Criteria

### AC1: Token Migration
- [ ] All 197 hex instances in 8 files replaced with `var(--token)` pattern
- [ ] No hardcoded hex in `<style scoped>` blocks
- [ ] Tokens from `hex-token-mapping.md` used consistently

### AC2: Build Verification
- [ ] `npm run build` passes without errors
- [ ] No CSS syntax errors

### AC3: Manual Verification (FR-6 / NFR5)
- [ ] Block layout — khối xếp đúng vị trí
- [ ] Color — màu khớp với before
- [ ] Spacing — khoảng cách khớp
- [ ] Font/size — cỡ/kiểu chữ khớp
- [ ] Hover state — trạng thái hover khớp

### AC4: No Regressions
- [ ] All 8 pages load without errors
- [ ] Interactive elements (buttons, forms) work correctly
- [ ] No visual regressions compared to before

---

## Technical Notes

### R8 Compliance
- Import tokens via `@import '@legacy/css/variables.css'` or equivalent
- No hex colors in `<style scoped>` — use `var(--token)`
- No `px` values in components — use spacing tokens

### AD-8 Compliance
- Design token import: `var(--token)` pattern
- No copy tokens to `web-app/` — use `@legacy` alias

---

## Dev Notes

### Files to Modify
1. `projects/web-app/src/pages/AiAgentPage.vue`
2. `projects/web-app/src/pages/SalaryInterviewPage.vue`
3. `projects/web-app/src/pages/AcceleratorPage.vue`
4. `projects/web-app/src/pages/AiHubPage.vue`
5. `projects/web-app/src/pages/CodeLearnPage.vue`
6. `projects/web-app/src/pages/ExamPage.vue`
7. `projects/web-app/src/components/ForgeTimer.vue`
8. `projects/web-app/src/pages/GameSpeedQuizPage.vue`

### Approach
1. For each file, read the JSON report entries
2. Replace hex with corresponding token
3. Add fallback for safety: `var(--token, #hex)`
4. Verify build passes
5. Manual smoke test on affected pages

### Metrics Target
| Metric | Before | After |
|--------|--------|-------|
| Hex instances in 8 files | 197 | 0 |
| Token usage | 0 | ~20 unique tokens |
| Build status | Pass | Pass |

---

## Metadata

**Implemented:** dev-story (2026-08-04) — 3 files (AiHubPage, CodeLearnPage, variables.css)
**Elicitation:** skipped (straightforward migration)
**Checkpoint:** approved by user (2026-08-04)
