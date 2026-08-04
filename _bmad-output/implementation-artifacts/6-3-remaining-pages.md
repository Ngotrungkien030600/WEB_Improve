# Story 6.3 — Remaining Pages (Home, JavaHub, Interview, English)

## Header

- **Story:** 6.3 — Remaining Pages (Home, JavaHub, Interview, English)
- **Epic:** 6 — R8 CSS Audit
- **Status:** ready-for-dev
- **Created:** 2026-08-04

---

## User Story

As a developer,
I want to migrate remaining hex colors in 4 Vue page files to CSS tokens,
So that R8 invariant is satisfied for all remaining page files.

---

## Context

### Source Data
- Detection: `scripts/hex-audit.js` (story 6.1)
- Report: `hex-audit-report.json` (latest)
- Token mapping: already created in story 6.1

### Files to Migrate

| File | Replaceable | Token count |
|------|------------|-------------|
| `pages/HomePage.vue` | 8 | ~5 unique |
| `pages/JavaHubPage.vue` | 7 | ~4 unique |
| `pages/InterviewPage.vue` | 6 | ~3 unique |
| `pages/EnglishPage.vue` | ~2 | ~1 unique |
| **Total** | **~23** | **~13 unique** |

### Token Status

Tokens created in story 6.1 + 6.2:

```css
/* Existing from 6.1 */
--text-primary: #1e293b
--text-muted: #94a3b8
--color-primary: #667eea
--color-secondary: #764ba2
--color-error: #ef4444
--color-warning: #f59e0b

/* Dark mode extended (from 6.1) */
--color-bg-page: #08080e
--color-bg-page-alt: #0d0d1a
--color-bg-surface-dark: #0f0e17
--color-surface-dark: #1a1928
--color-surface-dark-2: #22213a
--color-border-dark: #2d2b44

/* Text extended (from 6.1) */
--text-tertiary: #64748b
--text-secondary-muted: #9d9bb5

/* Semantic extended (from 6.1) */
--color-link: #1565c0
--color-warning-dark: #92400e
--color-warning-alt: #ea580c
--color-accent-light: #a78bfa

/* Background extended (from 6.1 + 6.2) */
--color-bg-subtle: #f1f5f9
--color-bg-white: #f8fafc
--color-info-bg: #e3f2fd
--color-warning-bg: #fef3c7
--color-accent-bg: #f3e5f5
--color-accent-bg-light: #f5f3ff

/* Border extended (from 6.1) */
--color-border-light: #e0e0e0
--color-border-subtle: #e2e8f0

/* Text colors (from 6.2) */
--color-text-dark: #1e293b
--color-text-darker: #444444
--color-text-muted: #999999

/* Semantic (existing) */
--color-success: #22c55e
--color-error: #ef4444
--color-warning: #f59e0b
--color-success-bg: #dcfce7
--color-error-bg: #fee2e2
--color-success-dark: #15803d
--color-error-dark: #b91c1c
```

### Token Naming Convention

- `--text-*` — typography colors
- `--color-*` — semantic/utility colors
- `--color-*-bg` — background colors
- `--color-border-*` — border colors

### Migration Pattern

**Before:**
```css
background: #08080e;
```

**After (with fallback):**
```css
background: var(--color-bg-page, #08080e);
```

### Exclusions (Do NOT replace)

1. **Fallback pattern**: `var(--token, #hex)` — keep as-is
2. **Accent overrides**: `style="--color-accent: #xxx"` — legitimate per AD-17
3. **Code syntax**: `#1e1e1e`, `#d4d4d4` — syntax highlighting
4. **Gradient colors**: keep complex gradients as-is

---

## Acceptance Criteria

### AC1: Token Migration
- [ ] All ~23 hex instances in 4 files replaced with `var(--token)` pattern
- [ ] No hardcoded hex in `<style scoped>` blocks (R8)
- [ ] Tokens from story 6.1 mapping used consistently

### AC2: Build Verification
- [ ] `npm run build` passes without errors
- [ ] No CSS syntax errors

### AC3: Manual Verification (NFR5 / FR-6)
- [ ] Block layout — khối xếp đúng vị trí
- [ ] Color — màu khớp với before
- [ ] Spacing — khoảng cách khớp
- [ ] Font/size — cỡ/kiểu chữ khớp
- [ ] Hover state — trạng thái hover khớp

### AC4: No Regressions
- [ ] All 4 pages load without errors
- [ ] Interactive elements work correctly
- [ ] No visual regressions

### AC5: Hex-Audit Verify
- [ ] Run `node scripts/hex-audit.js`
- [ ] These 4 files show 0 replaceable instances
- [ ] Total replaceable count decreases

---

## Technical Notes

### R8 Compliance
- Import tokens via `@import '@legacy/css/variables.css'`
- No hex colors in `<style scoped>` — use `var(--token)`
- No `px` values in components — use spacing tokens

### AD-17 Compliance
- Accent overrides in pages are allowed: `style="--color-accent: #xxx"`
- These are legitimate per-area accent colors, not hardcoded hex

### AD-8 Compliance
- Design token import: `var(--token)` pattern
- No copy tokens to `web-app/` — use `@legacy` alias

---

## Dev Notes

### Files to Modify
1. `projects/web-app/src/pages/HomePage.vue` (8 hex)
2. `projects/web-app/src/pages/JavaHubPage.vue` (7 hex)
3. `projects/web-app/src/pages/InterviewPage.vue` (6 hex)
4. `projects/web-app/src/pages/EnglishPage.vue` (~2 hex)

### Approach
1. For each file, read the JSON report entries
2. Replace hex with corresponding token
3. Add fallback for safety: `var(--token, #hex)`
4. Verify build passes
5. Run hex-audit to verify 0 replaceable
6. Manual smoke test on affected pages

### Metrics Target
| Metric | Before | After |
|--------|--------|-------|
| replaceable (4 files) | ~23 | 0 |
| token usage | existing | +~5 new |

---

## Metadata

**Implemented:** dev-story (2026-08-04) — 3 files (HomePage, JavaHubPage, InterviewPage)
**CODE-REVIEWED:** 2026-08-04 — 0 🔴
**Elicitation:** skipped (straightforward migration)
**Checkpoint:** approved by user (2026-08-04)
