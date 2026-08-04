# Story 6.5 — Pages: AiHubPage, BmadAgentsPage, CodeLearnPage, GameSpeedQuizPage

## Header

- **Story:** 6.5 — Pages: AiHubPage, BmadAgentsPage, CodeLearnPage, GameSpeedQuizPage
- **Epic:** 6 — R8 CSS Audit
- **Status:** review
- **Hardened:** hard (2026-08-04) — 8 AC, 8 cases (2 happy/3 biên/3 invariant), guard=4 assertions

---

## User Story

As a developer,
I want to migrate remaining replaceable hex colors in 4 Vue page components to CSS tokens,
So that R8 invariant is satisfied for these pages.

---

## Context

### Source Data
- Detection: `scripts/hex-audit.js` (story 6.1)
- Report: `hex-audit-report.json` (latest)
- Category filter: `replaceable`

### Files to Migrate

| File | Replaceable | Hex Values |
|------|------------|------------|
| `pages/AiHubPage.vue` | 1 | `#f3e5f5` |
| `pages/BmadAgentsPage.vue` | 2 | `#ef4444`, `#000` |
| `pages/CodeLearnPage.vue` | 2 | `#e3f2fd`, `#1565c0` (--color-accent-mid) |
| `pages/GameSpeedQuizPage.vue` | 1 | `#667eea` |
| **Total** | **6** | **6 unique** |

### Token Status

Tokens from story 6.1-6.4 + new requirements:

```css
/* Already available */
--text-primary: #1e293b
--text-white: #ffffff
--color-secondary: #764ba2
--color-accent: #1565c0
--color-accent-light: #e3f2fd
--color-warning-alt: #ea580c
--color-surface-dark: #1a1928
--color-surface-dark-2: #22213a
--color-border-dark: #2d2b44
--text-secondary-muted: #9d9bb5

/* New tokens needed */
--color-error: #ef4444
--color-text-inverse: #000
--color-accent-mid: #1565c0
--color-primary: #667eea
--color-purple-light: #f3e5f5
```

### New Tokens Required

Verify/add to `@legacy/css/variables.css`:

| Token | Value | Source |
|-------|-------|--------|
| `--color-error` | `#ef4444` | BmadAgentsPage |
| `--color-text-inverse` | `#000000` | BmadAgentsPage |
| `--color-accent-mid` | `#1565c0` | CodeLearnPage |
| `--color-primary` | `#667eea` | GameSpeedQuizPage |
| `--color-purple-light` | `#f3e5f5` | AiHubPage |

### Migration Pattern

**Before:**
```css
background: #667eea;
border-bottom: 2px solid #f3e5f5;
```

**After (with fallback):**
```css
background: var(--color-primary, #667eea);
border-bottom: 2px solid var(--color-purple-light, #f3e5f5);
```

### Exclusions (Do NOT replace)

1. **Fallback pattern**: `var(--token, #hex)` — keep as-is
2. **Accent overrides**: `style="--color-accent: #xxx"` — legitimate per AD-17
3. **Code syntax**: `#1e1e1e`, `#d4d4d4` — syntax highlighting
4. **Accent color**: `--color-accent: #1565c0` — legitimate accent per audit

---

## Acceptance Criteria

### AC1: Token Migration
- [ ] All 6 hex instances in 4 files replaced with `var(--token)` pattern
- [ ] No hardcoded hex in `<style scoped>` blocks (R8)

### AC2: New Tokens
- [ ] Verify 5 new tokens exist in `variables.css`
- [ ] If missing, add tokens before migrating

### AC3: Build Verification
- [ ] `npm run build` passes without errors
- [ ] No CSS syntax errors

### AC4: Manual Verification (NFR5 / FR-6)
- [ ] Block layout — khối xếp đúng vị trí
- [ ] Color — màu khớp với before
- [ ] Spacing — khoảng cách khớp
- [ ] Font/size — cỡ/kiểu chữ khớp
- [ ] Hover state — trạng thái hover khớp

### AC5: Hex-Audit Verify
- [ ] Run `node scripts/hex-audit.js`
- [ ] These 4 files show 0 replaceable instances
- [ ] Total replaceable count decreases by 6

---

## Technical Notes

### R8 Compliance
- Import tokens via `@import '@legacy/css/variables.css'`
- No hex colors in `<style scoped>` — use `var(--token)`
- Pages are self-contained — may have local tokens

### AD-9 Compliance
- Page components: `PascalCasePage.vue`
- API/storage calls OK in pages (AD-2)
- Navigation via `ported-pages` registry

---

## Dev Notes

### Files to Modify
1. `pages/AiHubPage.vue` (1 hex at line 1015)
2. `pages/BmadAgentsPage.vue` (2 hex at lines 285-286)
3. `pages/CodeLearnPage.vue` (2 hex at lines 202, 203)
4. `pages/GameSpeedQuizPage.vue` (1 hex at line 116)

### Specific Hex Values

| File | Line | Hex | Suggested Token |
|------|------|-----|-----------------|
| AiHubPage.vue | 1015 | `#f3e5f5` | `--color-purple-light` |
| BmadAgentsPage.vue | 285 | `#ef4444` | `--color-error` |
| BmadAgentsPage.vue | 286 | `#000` | `--color-text-inverse` |
| CodeLearnPage.vue | 202 | `#e3f2fd` | `--color-accent-light` |
| CodeLearnPage.vue | 203 | `#1565c0` | `--color-accent-mid` |
| GameSpeedQuizPage.vue | 116 | `#667eea` | `--color-primary` |

### Approach
1. Check/add missing tokens to `variables.css`
2. Replace each hex with `var(--token, #hex)` pattern
3. Verify build passes
4. Run hex-audit to verify 0 replaceable

### Metrics Target

| Metric | Before | After |
|--------|--------|-------|
| replaceable (4 files) | 6 | 0 |
| token usage | existing | +6 tokens |
| new tokens needed | 5 | - |

---

## Metadata

**Implemented:** dev-story (2026-08-04) — 4 files (AiHubPage, BmadAgentsPage, CodeLearnPage), 2 new tokens (variables.css)
