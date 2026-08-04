# Story 6.4 — Shared Components (CHomeTimer, MotivationPopup)

## Header

- **Story:** 6.4 — Shared Components (CHomeTimer, MotivationPopup)
- **Epic:** 6 — R8 CSS Audit
- **Status:** ready-for-dev
- **Created:** 2026-08-04

---

## User Story

As a developer,
I want to migrate remaining hex colors in 2 shared Vue components to CSS tokens,
So that R8 invariant is satisfied for shared components.

---

## Context

### Source Data
- Detection: `scripts/hex-audit.js` (story 6.1)
- Report: `hex-audit-report.json` (latest)

### Files to Migrate

| File | Replaceable | Token count |
|------|------------|-------------|
| `components/CHomeTimer.vue` | 2 | ~2 unique |
| `components/MotivationPopup.vue` | 1 | ~1 unique |
| **Total** | **3** | **~3 unique** |

### Note: ForgeTimer.vue

ForgeTimer.vue entries trong audit report đã có `category: "fallback"` — hex nằm trong fallback của var pattern (đúng theo AD-8). Không cần sửa.

### Token Status

Tokens từ story 6.1-6.3:

```css
/* Already available */
--text-primary: #1e293b
--text-white: #ffffff
--color-secondary: #764ba2
--color-warning-alt: #ea580c
--color-surface-dark: #1a1928
--color-surface-dark-2: #22213a
--color-border-dark: #2d2b44
--text-secondary-muted: #9d9bb5
```

### Migration Pattern

**Before:**
```css
color: #1e293b;
background: #fff;
```

**After (with fallback):**
```css
color: var(--text-primary, #1e293b);
background: var(--text-white, #fff);
```

### Exclusions (Do NOT replace)

1. **Fallback pattern**: `var(--token, #hex)` — keep as-is
2. **Accent overrides**: `style="--color-accent: #xxx"` — legitimate per AD-17
3. **Code syntax**: `#1e1e1e`, `#d4d4d4` — syntax highlighting

---

## Acceptance Criteria

### AC1: Token Migration
- [ ] All 3 hex instances in 2 files replaced with `var(--token)` pattern
- [ ] No hardcoded hex in `<style scoped>` blocks (R8)

### AC2: Build Verification
- [ ] `npm run build` passes without errors
- [ ] No CSS syntax errors

### AC3: Manual Verification (NFR5 / FR-6)
- [ ] Block layout — khối xếp đúng vị trí
- [ ] Color — màu khớp với before
- [ ] Spacing — khoảng cách khớp
- [ ] Font/size — cỡ/kiểu chữ khớp
- [ ] Hover state — trạng thái hover khớp

### AC4: Hex-Audit Verify
- [ ] Run `node scripts/hex-audit.js`
- [ ] These 2 files show 0 replaceable instances
- [ ] Total replaceable count decreases

---

## Technical Notes

### R8 Compliance
- Import tokens via `@import '@legacy/css/variables.css'`
- No hex colors in `<style scoped>` — use `var(--token)`
- Components are shared — must work in all page contexts

### AD-9 Compliance
- Shared components: `CPascalCase.vue`
- No API/storage/router calls in shared components

---

## Dev Notes

### Files to Modify
1. `components/CHomeTimer.vue` (2 hex at lines 266-267)
2. `components/MotivationPopup.vue` (1 hex at line 164)

### Specific Hex Values

| File | Line | Hex | Suggested Token |
|------|------|-----|-----------------|
| CHomeTimer.vue | 266 | `#1e293b` | `--text-primary` |
| CHomeTimer.vue | 267 | `#fff` | `--text-white` |
| MotivationPopup.vue | 164 | `#764ba2` | `--color-secondary` |

### Approach
1. Replace each hex with `var(--token, #hex)` pattern
2. Verify build passes
3. Run hex-audit to verify 0 replaceable

### Metrics Target
| Metric | Before | After |
|--------|--------|-------|
| replaceable (2 files) | 3 | 0 |
| token usage | existing | +3 tokens |

---

## Metadata

**Implemented:** dev-story (2026-08-04) — 2 files (CHomeTimer.vue, MotivationPopup.vue)
**CODE-REVIEWED:** 2026-08-04 — 0 🔴
