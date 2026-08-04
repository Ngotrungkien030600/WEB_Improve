# Story 6.1: Detection & Token Mapping for CSS Audit
## Header

- **Epic:** 6 — R8 CSS Audit
- **Story ID:** 6.1
- **Status:** ready-for-dev
- **Created:** 2026-08-04

---

## User Story

As a developer,
I want to know exactly which hex colors exist and which CSS tokens to create,
So that I can systematically replace them in subsequent stories.

---

## Acceptance Criteria

### AC1: Detection Script
- [ ] Script finds all hex color instances in `.vue` files
- [ ] Output: file, line number, hex value (JSON format)
- [ ] Excludes: comments, template inline styles (accent overrides)
- [ ] Handles uppercase: `#FFF`, `#ABCDEF`

### AC2: Categorization
- [ ] **Replaceable**: utility colors → CSS tokens
- [ ] **Fallback**: `var(--token, #hex)` pattern (keep as-is)
- [ ] **Accent**: `--color-accent: #xxx` (keep as-is per AD-17)
- [ ] **Code**: syntax highlighting colors (keep as-is)
- [ ] **Gradient**: `linear-gradient` colors (keep as-is)
- [ ] **Exclusion manifest**: file liệt kê tất cả exclusions
- [ ] Sum of buckets = total detected (verify tota = 259)

### AC3: Token Mapping Table
- [ ] List all new tokens needed
- [ ] Map hex values to semantic token names
- [ ] Use `--text-*` for typography, `--color-*` for semantic/utility
- [ ] Verify new tokens không trùng với existing tokens
- [ ] Update `variables.css` with new tokens

### AC4: Token Collision Report
- [ ] Hex nào trùng với existing token → cần map chuẩn
- [ ] Duplicate hex detector: cùng 1 hex ở nhiều file

### AC5: Edge Cases Handled
- [ ] Uppercase hex: #FFF, #ABCDEF
- [ ] Multiple hex per line
- [ ] Hex trong string/template literal
- [ ] Skip: CSS comment, JS comment, HTML comment
- [ ] Skip: CSS custom property definition (`--my-var: #xxx`)
- [ ] Skip: URL-encoded hex (`%23xxx`)

### AC6: Report
- [ ] Total count before/after categorization
- [ ] Files with most violations (top 10)
- [ ] Token additions required
- [ ] Before/after snapshot

---

## Exclusions (Do NOT replace)

| Exclusion | Pattern | Reason |
|-----------|---------|--------|
| CSS custom property | `^--[\w-]+:\s*#[0-9a-fA-F]{3,6}` | Token definition |
| Accent overrides | `style="--color-accent: #xxx"` | AD-17 |
| Code syntax | `#1e1e1e`, `#d4d4d4` | Syntax highlighting |
| Gradients | `linear-gradient(..., #xxx, ...)` | Complex value |
| RGBA | `rgba(..., #xxx, ...)` | Alpha channel |
| URL-encoded | `%23[0-9a-fA-F]` | HTML encoding |

---

## Token Naming Convention

**Follow existing pattern in variables.css:**

```css
/* Typography — dùng --text-* prefix */
--text-primary: #1e293b;       /* heading */
--text-secondary: #475569;      /* body */
--text-muted: #94a3b8;         /* placeholder */

/* Semantic/Utility — dùng --color-* prefix */
--color-success: #22c55e;
--color-error: #ef4444;
--color-warning: #f59e0b;
--color-info: #3b82f6;

/* Status backgrounds */
--color-success-bg: #dcfce7;
--color-error-bg: #fee2e2;
--color-warning-bg: #fef3c7;

/* Surface */
--surface-card: rgba(255, 255, 255, 0.96);
```

**→ NOT `--color-text-muted` (dùng `--text-muted` đã có)**

---

## Technical Notes

### Detection Script
```bash
# In projects/web-app/src:
grep -rEn "#[0-9a-fA-F]{3,6}" --include="*.vue" | \
  grep -v "^[^\:]*:[0-9]*:.*//" | \   # skip JS comments
  grep -v "<!--" | \                    # skip HTML comments
  grep -v "\/\*" | \                    # skip CSS comments
  grep -v "style=\"--color-accent" | \ # skip accent
  grep -v "linear-gradient" | \        # skip gradients
  grep -v "^--[\w-]+:" | \              # skip CSS var def
  grep -v "%23"                          # skip URL-encoded
```

### Script Output Format (JSON)
```json
{
  "file": "src/pages/AiAgentPage.vue",
  "line": 259,
  "column": 15,
  "hex": "#0f0e17",
  "context": "background: var(--color-bg, #0f0e17);",
  "category": "fallback"
}
```

---

## Deliverables

1. **Detection script** — identifies all hex instances
2. **Categorized report** — bucketed by replacement type
3. **Token mapping** — semantic names for new tokens
4. **Updated variables.css** — with new token definitions
5. **Exclusion manifest** — all exclusions documented
6. **Collision report** — duplicates across files
7. **Before/after snapshot** — hex count change

---

## Effort Estimate

- Detection script: 15 min
- Categorization + verification: 30 min
- Token mapping + collision: 45 min
- **Total: ~1.5 hours**

---

## Next Story

6.2 — Page Components (Top 8 files with most violations)

---

## Metadata

**Hardened:** light (2026-08-04) — 13 cases (happy/categorization/token/edge/reports), guard=n/a
**Elicitation:** advanced (2026-08-04)
**Checkpoint:** approved by user (2026-08-04)
**Implemented:** dev-story (2026-08-04) — 7 files
