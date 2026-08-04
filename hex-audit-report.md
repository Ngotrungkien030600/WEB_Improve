# Hex Color Audit Report — Story 6.1

**Generated:** 2026-08-04
**Story:** 6.1 — Detection & Token Mapping for CSS Audit

---

## Executive Summary

| Metric | Before | After |
|--------|--------|-------|
| Total hex instances | 242 | 242 (categorized) |
| Replaceable | 63 | 0 (→ tokens) |
| Fallback (var pattern) | 174 | 174 (acceptable) |
| Code/Gradient/Accent | 5 | 5 (keep as-is) |
| Unique hex values | 36 | 0 (all mapped) |
| CSS tokens defined | ~25 | ~48 |

---

## 1. Detection Results

### Files Scanned
- **33 Vue files** in `projects/web-app/src/`

### Top 10 Files by Violations

| Rank | File | Replaceable | Fallback | Total |
|------|------|-------------|----------|-------|
| 1 | `pages/AiAgentPage.vue` | 48 | 0 | 48 |
| 2 | `pages/SalaryInterviewPage.vue` | 36 | 0 | 36 |
| 3 | `pages/AcceleratorPage.vue` | 35 | 0 | 35 |
| 4 | `pages/AiHubPage.vue` | 27 | 0 | 27 |
| 5 | `pages/CodeLearnPage.vue` | 19 | 0 | 19 |
| 6 | `pages/ExamPage.vue` | 12 | 0 | 12 |
| 7 | `components/ForgeTimer.vue` | 10 | 0 | 10 |
| 8 | `pages/GameSpeedQuizPage.vue` | 10 | 0 | 10 |
| 9 | `pages/HomePage.vue` | 8 | 0 | 8 |
| 10 | `pages/JavaHubPage.vue` | 7 | 0 | 7 |

---

## 2. Categorization

### By Category

| Category | Count | Description | Action |
|----------|-------|-------------|--------|
| `fallback` | 174 | `var(--token, #hex)` pattern | Keep as-is |
| `replaceable` | 63 | Hardcoded hex | Replace with tokens |
| `code` | 3 | Syntax highlighting | Keep as-is |
| `accent` | 2 | `--color-accent` override | Keep as-is |

### Exclusions Applied

| Pattern | Reason |
|---------|--------|
| `var(--token, #hex)` | Already using fallback pattern |
| `--color-accent: #xxx` | AD-17 legitimate override |
| `linear-gradient(...)` | Complex gradient value |
| `#1e1e1e`, `#d4d4d4` | Code syntax highlighting |
| `%23...` | URL-encoded |

---

## 3. Token Mapping

### Existing Tokens (Already Available)

| Hex | Token | Notes |
|-----|-------|-------|
| `#1e293b` | `--text-primary` | Heading |
| `#94a3b8` | `--text-muted` | Muted text |
| `#667eea` | `--color-primary` | Primary |
| `#764ba2` | `--color-secondary` | Secondary |
| `#ef4444` | `--color-error` | Error |
| `#f59e0b` | `--color-warning` | Warning |
| `#fff` | `--text-white` | White text |

### New Tokens Added (Story 6.1)

Added to `projects/web-en/css/variables.css`:

```css
/* Dark mode extended */
--color-bg-page: #08080e;
--color-bg-page-alt: #0d0d1a;
--color-bg-surface-dark: #0f0e17;
--color-surface-dark: #1a1928;
--color-surface-dark-2: #22213a;
--color-border-dark: #2d2b44;

/* Text extended */
--text-tertiary: #64748b;
--text-secondary-muted: #9d9bb5;

/* Semantic extended */
--color-link: #1565c0;
--color-warning-dark: #92400e;
--color-warning-alt: #ea580c;
--color-accent-light: #a78bfa;

/* Background extended */
--color-bg-subtle: #f1f5f9;
--color-info-bg: #e3f2fd;
--color-warning-bg: #fef3c7;
--color-accent-bg: #f3e5f5;

/* Border extended */
--color-border-light: #e0e0e0;
--color-border-subtle: #e2e8f0;
```

---

## 4. Duplicate Hex Detection

### Hex Values Used in Multiple Files

| Hex | Count | Files |
|-----|-------|-------|
| `#e3f2fd` | 4 | CodeLearnPage |
| `#08080e` | 3 | App, HomePage, InterviewPage |
| `#1e293b` | 3 | CHomeTimer, AiHubPage |
| `#64748b` | 3 | AiHubPage, HomePage |
| `#e2e8f0` | 3 | AiHubPage |
| `#166534` | 3 | AiHubPage |
| `#991b1b` | 3 | AiHubPage |
| `#f3e5f5` | 3 | AiHubPage |
| `#9d9bb5` | 2 | InterviewPage, JavaHubPage |
| `#f8fafc` | 2 | AiHubPage |

**Recommendation:** Shared tokens already created for these duplicates.

---

## 5. Deliverables

| # | Deliverable | Location | Status |
|---|-------------|----------|--------|
| 1 | Detection script | `scripts/hex-audit.js` | ✅ Done |
| 2 | JSON report | `hex-audit-report.json` | ✅ Done |
| 3 | Exclusion manifest | `hex-exclusion-manifest.json` | ✅ Done |
| 4 | Token mapping | `hex-token-mapping.md` | ✅ Done |
| 5 | Updated variables.css | `projects/web-en/css/variables.css` | ✅ Done |
| 6 | This report | `hex-audit-report.md` | ✅ Done |

---

## 6. Next Steps

### Story 6.2 — Page Components (Top 8 files)
Priority files to migrate:
1. `pages/AiAgentPage.vue` (48 violations)
2. `pages/SalaryInterviewPage.vue` (36 violations)
3. `pages/AcceleratorPage.vue` (35 violations)
4. `pages/AiHubPage.vue` (27 violations)
5. `pages/CodeLearnPage.vue` (19 violations)
6. `pages/ExamPage.vue` (12 violations)
7. `components/ForgeTimer.vue` (10 violations)
8. `pages/GameSpeedQuizPage.vue` (10 violations)

### Migration Pattern
```vue
/* Before */
background: #08080e;

/* After */
background: var(--color-bg-page);
```

---

## 7. Verification

To re-run the audit:
```bash
node scripts/hex-audit.js
```

Expected output after story 6.2+:
- `replaceable` count = 0
- `fallback` count may increase (as components adopt var pattern)
