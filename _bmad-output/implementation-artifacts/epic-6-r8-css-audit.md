# Epic 6: R8 CSS Audit — Migrate hardcoded hex colors to CSS tokens
## Header

- **Epic:** 6 — R8 CSS Audit
- **Status:** backlog
- **Created:** 2026-08-04

---

## User Story

As a developer,
I want all hardcoded hex colors in Vue components migrated to CSS tokens,
So that the design system is consistent and maintainable (R8 invariant).

---

## Context

### Current State
- **259 hex color instances** across 25 Vue files
- Pattern: `#[0-9a-fA-F]{3,6}` scattered in `<style scoped>` blocks
- Violates R8 invariant: "Token import only — không copy, không hex trong components"

### Token Source
- `projects/web-en/css/variables.css` — design tokens (colors, spacing, radius)
- Pattern: `var(--color-name)` for colors, `var(--radius-sm/md)` for spacing

### Files with Most Violations

| File | Count | Type |
|------|-------|------|
| `AiAgentPage.vue` | 49 | Page |
| `SalaryInterviewPage.vue` | 37 | Page |
| `AcceleratorPage.vue` | 38 | Page |
| `CodeLearnPage.vue` | 20 | Page |
| `AiHubPage.vue` | 28 | Page |
| `ExamPage.vue` | 13 | Page |
| `InterviewPage.vue` | 6 | Page |
| `SkillTrackerPage.vue` | 7 | Page |
| `HomePage.vue` | 9 | Page |
| `GameSpeedQuizPage.vue` | 9 | Page |
| Components (CHomeTimer, ForgeTimer, etc.) | ~20 | Shared |

### Color Categories

1. **Utility colors** (slate/gray scale) — `#64748b`, `#1e293b`, `#f8fafc`
2. **Status colors** — success `#166534`, error `#991b1b`, warning `#92400e`
3. **Dark mode colors** — `#1a1928`, `#22213a`, `#2d2b44`
4. **Accent overrides** — page-specific `--color-accent: #xxx` (legitimate per AD-17)

---

## Technical Approach

### Strategy: Automated Detection + Manual Review

1. **Detection script** — grep all `.vue` files for hex patterns
2. **Classification** — categorize each hex:
   - **Replaceable**: utility colors → CSS tokens
   - **Fallback**: `var(--token, #hex)` pattern (acceptable)
   - **Accent**: `--color-accent: #xxx` inline style (legitimate per AD-17)
   - **Code block**: syntax highlighting colors (keep as-is)
3. **Token mapping** — create mapping table
4. **Batch replacement** — update files in groups
5. **Build verification** — ensure no regression

### Token Mapping (Priority)

```css
/* Utility tokens to add to variables.css if missing */
--color-slate-500: #64748b;   /* text-secondary */
--color-slate-400: #94a3b8;   /* muted text */
--color-slate-300: #94a3b8;   /* placeholder */
--color-gray-900: #1e293b;    /* headings */
--color-gray-100: #f8fafc;    /* card backgrounds */
--color-gray-50: #f8fafc;     /* hover states */

/* Status tokens */
--color-success-dark: #166534;
--color-error-dark: #991b1b;
--color-warning-dark: #92400e;
--color-success-light: #dcfce7;
--color-error-light: #fee2e2;
--color-warning-light: #fef3c7;

/* Surface tokens */
--color-surface-dark: #1a1928;
--color-surface-dark-2: #22213a;
--color-border-dark: #2d2b44;
```

### Exclusions (Do NOT replace)

1. **Code syntax highlighting** — `#1e1e1e` (VS Code dark theme)
2. **Accent overrides in template** — `style="--color-accent: #xxx"` (AD-17)
3. **Linear gradients** — `linear-gradient(135deg, #667eea, #764ba2)`
4. **rgba with opacity** — `rgba(0,0,0,0.15)`

---

## Stories Breakdown

### Story 6.1: Detection & Token Mapping
- Create detection script
- List all hex instances with categorization
- Create token mapping table
- Status: **backlog**

### Story 6.2: Page Components (Top 8)
- AiAgentPage.vue (49)
- SalaryInterviewPage.vue (37)
- AcceleratorPage.vue (38)
- CodeLearnPage.vue (20)
- AiHubPage.vue (28)
- ExamPage.vue (13)
- InterviewPage.vue (6)
- SkillTrackerPage.vue (7)
- Status: **backlog**

### Story 6.3: Remaining Pages
- HomePage.vue (9)
- GameSpeedQuizPage.vue (9)
- JavaHubPage.vue (7)
- EnglishPage.vue (3)
- Other pages with <5 instances
- Status: **backlog**

### Story 6.4: Shared Components
- CHomeTimer.vue (6)
- ForgeTimer.vue (10)
- MotivationPopup.vue (2)
- CTopbar.vue (1)
- CHubCard.vue (2)
- CHomeHeader.vue (1)
- Status: **backlog**

### Story 6.5: Build & Regression Test
- Run `npm run build`
- Manual smoke test on affected pages
- Verify no visual regressions
- Status: **backlog**

---

## Acceptance Criteria

### AC1: Detection
- [ ] Script finds all 259 hex instances
- [ ] Categorization matches expected buckets

### AC2: Token Coverage
- [ ] All utility colors have corresponding CSS token
- [ ] Tokens follow naming convention `--color-*`

### AC3: Replacement
- [ ] 0 hex colors in `<style scoped>` (excluding exclusions)
- [ ] Build passes
- [ ] Manual verification: affected pages render correctly

### AC4: No Regressions
- [ ] All pages load without errors
- [ ] Accent color overrides still work (AD-17)
- [ ] Code blocks preserve syntax highlighting

---

## Non-Functional Requirements

- **NFR1**: Zero production impact — legacy app unaffected
- **NFR2**: Build must pass after each story
- **NFR3**: CSS tokens must be defined in `variables.css`

---

## Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Hex instances | 259 | 0 |
| Files affected | 25 | 25 |
| Token additions | 0 | ~15 |
| Build status | Pass | Pass |
