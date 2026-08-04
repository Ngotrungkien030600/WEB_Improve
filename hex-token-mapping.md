# Token Mapping Table — Story 6.1

## Summary

| Metric | Value |
|--------|-------|
| Total hex detected | 242 |
| Replaceable | 63 (36 unique values) |
| Fallback (var pattern) | 174 |
| Code/Gradient/Accent | 5 |

---

## Token Mapping

### Existing Tokens (no change needed)

| Hex | Existing Token | Usage |
|-----|---------------|-------|
| `#1e293b` | `--text-primary` | heading, text |
| `#94a3b8` | `--text-muted` | muted text |
| `#667eea` | `--color-primary` | primary |
| `#764ba2` | `--color-secondary` | secondary |
| `#ef4444` | `--color-error` | error text |
| `#f59e0b` | `--color-warning` | warning |
| `#fff`, `#ffffff` | `--text-white` | white text |

### New Tokens to Add

#### Dark Mode Surface Colors

| Hex | New Token | Rationale |
|-----|-----------|-----------|
| `#08080e` | `--color-bg-page` | Page background (dark) |
| `#0d0d1a` | `--color-bg-page-alt` | Alternate page bg |
| `#0f0e17` | `--color-bg-surface-dark` | Surface in dark mode |
| `#1a1928` | `--color-surface-dark` | Dark surface (ForgeTimer) |
| `#22213a` | `--color-surface-dark-2` | Dark surface 2 |
| `#2d2b44` | `--color-border-dark` | Dark border (ForgeTimer) |

#### Text Colors

| Hex | New Token | Rationale |
|-----|-----------|-----------|
| `#444` | `--text-tertiary` | Very muted text |
| `#999` | `--text-tertiary` | Very muted text |
| `#9d9bb5` | `--text-secondary-muted` | Secondary muted |

#### Accent & Status Colors

| Hex | New Token | Rationale |
|-----|-----------|-----------|
| `#1565c0` | `--color-link` | Link color (blue) |
| `#166534` | `--color-success-dark` | Success text (dark) |
| `#991b1b` | `--color-error-dark` | Error text (dark) |
| `#92400e` | `--color-warning-dark` | Warning text (dark) |
| `#a78bfa` | `--color-accent-light` | Light accent variant |
| `#ea580c` | `--color-warning-alt` | Orange warning |

#### Background Colors

| Hex | New Token | Rationale |
|-----|-----------|-----------|
| `#e3f2fd` | `--color-info-bg` | Info/links background |
| `#f1f5f9` | `--color-bg-subtle` | Subtle background |
| `#fafafa` | `--color-bg-subtle` | Subtle background |
| `#fef3c7` | `--color-warning-bg` | Warning background |
| `#f3e5f5` | `--color-accent-bg` | Accent background |
| `#f5f3ff` | `--color-accent-bg` | Accent background (purple) |

#### Border Colors

| Hex | New Token | Rationale |
|-----|-----------|-----------|
| `#e0e0e0` | `--color-border-light` | Light border |
| `#eee` | `--color-border-light` | Light border |
| `#e2e8f0` | `--color-border-subtle` | Subtle border |

---

## Files to Update

1. `projects/web-en/css/variables.css` — add missing tokens

---

## Token Count Summary

| Category | Count |
|----------|-------|
| Existing tokens used | 7 |
| New tokens to add | 21 |
| Total unique tokens | 28 |

---

## Before/After Snapshot

| Metric | Before | After |
|--------|--------|-------|
| Unique hex values | 36 | 0 (all mapped) |
| Hex in components | 63 | 0 |
| CSS tokens defined | ~25 | ~46 |
