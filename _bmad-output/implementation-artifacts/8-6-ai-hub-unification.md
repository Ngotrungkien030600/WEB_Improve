---
title: "Epic 8 - Story 8.6: AiHub Page Unification"
type: story
status: review
epic: "Epic 8: Unify & Elevate Design System"
story_id: "8.6"
created: "2026-08-05"
updated: "2026-08-06"
source_artifacts:
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/prd.md
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/epics.md
hardened: light (2026-08-06) — 8 AC pending checkpoint
---

# Story 8.6: AiHub Page Unification

**Hardened:** light (2026-08-06) — 8 AC, 14 cases (6 happy, 6 edge, 2 browser), clarifications applied

---

## Story Header

**Story ID:** 8.6
**Epic:** Epic 8: Unify & Elevate Design System
**Status:** ready-for-dev
**Mode:** Light

---

## Story Statement

**As a** người dùng,
**I want** AiHub page với Forge design và tabs navigation,
**So that** AI learning hub feel cohesive với rest of app.

---

## Story Goal

Unify `AiHubPage.vue` sang Forge design system:
- Thay Legacy variables → Forge tokens
- Background dark (`--forge-bg`)
- Accent color AI (`--accent-ai` = #f472b6)
- Remove `@import @legacy/css/subpage.css`

---

## Story Requirements

### CSS Migration Map

| Legacy Token | Forge Token | Example Selector |
|---|---|---|
| `var(--color-bg)` | `var(--forge-bg)` | `.ai-hub-page` |
| `var(--color-text)` | `var(--forge-text)` | `.flashcard-def` |
| `var(--color-text2)` | `var(--forge-text2)` | `.flashcard-vi` |
| `var(--color-accent)` | `var(--accent-ai)` | `.flashcard-en` |
| `rgba(255,255,255,0.2)` | `var(--forge-glass)` | `.tab` |
| `rgba(255,255,255,0.35)` | `var(--forge-glass-hover)` | `.tab:hover` |
| `white` | `var(--forge-glass)` | `.flashcard` |
| `rgba(0,0,0,0.15)` | `var(--forge-shadow)` | `.flashcard` shadow |

### Components to Update

1. **Tab Navigation** — glassmorphism buttons
2. **Flashcard** — white card on dark bg, accent category badge
3. **Quiz Options** — glassmorphism with success/error states
4. **Quiz Timer** — gradient fire→error
5. **Interview Sidebar** — glassmorphism with accent border
6. **Project Cards** — glassmorphism with hover lift

---

## Acceptance Criteria

### General (AC-1)

**Given** AiHubPage is opened
**When** page loads
**Then** `@import @legacy/css/subpage.css` is removed
**And** background uses `var(--forge-bg)` (#08080e)
**And** no Legacy CSS variables remain in scoped styles

### Tab Navigation (AC-2)

**Given** AiHubPage is loaded
**When** tabs are displayed
**Then** inactive tabs use `var(--forge-glass)` background
**And** active tab uses `var(--forge-glass-hover)` with `var(--accent-ai)` border
**And** hover state shows `var(--forge-glass-hover)` background

### Learn Tab - Flashcard (AC-3)

**Given** Learn tab is active
**When** flashcard is displayed
**Then** card has white/dark-glass background contrasting dark page
**And** category badge uses `var(--accent-ai)` (#f472b6)
**And** English term uses `var(--accent-ai)` color

### Quiz Tab - Options (AC-4)

**Given** Quiz tab is active
**When** options are displayed
**Then** options use `var(--forge-glass)` style
**And** correct answer shows `var(--forge-success)` (#22c55e)
**And** wrong answer shows `var(--forge-error)` (#ef4444)

### Quiz Tab - Timer (AC-5)

**Given** Quiz is active
**When** timer bar is visible
**Then** gradient flows from `var(--forge-fire)` to `var(--forge-error)`
**And** fill decreases from 100% to 0%

### Interview Tab (AC-6)

**Given** Interview tab is active
**When** topics are displayed
**Then** sidebar uses `var(--forge-glass)` background
**And** active topic has `var(--accent-ai)` border
**And** checkmarks use `var(--forge-success)`

### Projects Tab (AC-7)

**Given** Projects tab is active
**When** project cards are displayed
**Then** cards use `var(--forge-glass)` style
**And** hover shows translateY(-3px) with `var(--accent-ai)` border highlight

### Build (AC-8)

**Given** Changes are complete
**When** `npm run build` runs
**Then** build passes without errors
**And** no `grep -r "@legacy/css" src/pages/AiHubPage.vue` returns results

---

## Technical Implementation

### Files to Modify

| File | Action | Changes |
|---|---|---|
| `src/pages/AiHubPage.vue` | UPDATE | Remove @import, replace CSS variables |

### CSS Variable Replacement Pattern

```css
/* BEFORE (Legacy) */
background: white;
color: var(--color-text);
border-color: var(--color-accent);

/* AFTER (Forge) */
background: var(--forge-glass);
color: var(--forge-text);
border-color: var(--accent-ai);
```

### Token Hierarchy

```
--forge-bg: #08080e (dark background)
--forge-glass: rgba(255, 255, 255, 0.06)
--forge-glass-hover: rgba(255, 255, 255, 0.12)
--forge-glass-border: rgba(255, 255, 255, 0.08)
--forge-text: #f1f5f9
--forge-text2: #94a3b8
--forge-text3: #64748b
--forge-success: #22c55e
--forge-error: #ef4444
--forge-fire: #f97316
--forge-ember: #fbbf24
--accent-ai: #f472b6 (AI hub accent - pink)
```

---

## Important Clarifications (from advanced elicitation)

### Tab Active State: Glass-hover pattern

```css
.tab.active {
  background: var(--forge-glass-hover);
  border-color: var(--accent-ai);
  color: var(--accent-ai);
}
```

### Flashcard: Glass card (not white)

```css
.flashcard {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  box-shadow: none; /* no rgba(0,0,0,...) on dark bg */
}
```

### Box-shadow Policy

**Remove all `rgba(0,0,0,...)` shadows** — invisible on dark `#08080e` bg. Replace with:
- `border: 1px solid var(--forge-glass-border)`
- Optional accent glow: `box-shadow: 0 0 20px rgba(244,114,182,0.2)`

### Root Element

```html
<!-- BEFORE -->
<div style="--color-accent: #764ba2">

<!-- AFTER -->
<div style="--forge-accent: var(--accent-ai)">
```

### CSS Token Complete Map

| Legacy | Forge |
|---|---|
| `var(--color-text-dark)`, `var(--color-text)` | `var(--forge-text)` |
| `var(--color-text2)` | `var(--forge-text2)` |
| `var(--text-tertiary)`, `var(--text-muted)` | `var(--forge-text3)` |
| `var(--color-bg-white)` | `var(--forge-glass)` |
| `var(--color-border-subtle)` | `var(--forge-glass-border)` |
| `var(--color-primary)`, `var(--color-accent)` | `var(--accent-ai)` |
| `var(--color-accent-light)` | `rgba(244,114,182,0.1)` |
| `var(--color-warning)` | `var(--forge-fire)` |
| `var(--color-error)` | `var(--forge-error)` |
| `var(--color-success)` | `var(--forge-success)` |
| `linear-gradient(..., var(--color-primary), var(--color-accent))` | `linear-gradient(..., var(--forge-fire), var(--accent-ai))` |

---

## Case List

### Happy Path

| ID | Case | Method |
|---|---|---|
| H1 | Tab navigation | Click each tab, active uses glass-hover + accent border |
| H2 | Flashcard front | Glass card, accent-ai badge + term |
| H3 | Quiz options | Glassmorphism, correct=success, wrong=error |
| H4 | Timer gradient | Fire→error gradient, visible on dark bg |
| H5 | Interview sidebar | Glassmorphism, accent-ai border on active |
| H6 | Project cards | Glassmorphism, hover lift + accent border |

### Edge Cases

| ID | Case | Method |
|---|---|---|
| E1 | Empty category | No cards → counter shows 0/0 |
| E2 | All items checked | Progress shows 100% |
| E3 | Long project title | Text wraps correctly |
| E4 | Timer bar bg on dark | Timer bar uses `var(--forge-glass)` not rgba |
| E5 | Flashcard back face | "VÍ DỤ" badge uses accent-ai treatment |
| E6 | Quiz nested tabs | `.quiz-type-tab` uses same glassmorphism |

### Browser/Device

| ID | Case | Method |
|---|---|---|
| B1 | Mobile interview | <700px → sidebar stacks vertically |
| B2 | Mobile quiz stats | <700px → 2 columns instead of 4 |

---

**Tổng: 6 happy, 6 edge, 2 browser = 14 cases**

---

## Dependencies

- Epic 2 (Component Library) must be complete
- CTopbar component must exist
- Design tokens in `main.css` must include `--accent-ai`
- Story 8-3 (Animation System) completed (stagger for cards)

## Non-Goals

- Don't change game logic/algorithms
- Don't modify flashcard flip logic
- Don't change quiz question data
- Don't change interview/project content
- Don't add animations (story 8-3 handles this)

## Test Checklist

- [x] AC-1: @import removed, no Legacy variables
- [x] AC-2: Tab navigation styled correctly
- [x] AC-3: Flashcard styled with accent-ai
- [x] AC-4: Quiz options glassmorphism
- [x] AC-5: Timer gradient fire→error
- [x] AC-6: Interview sidebar glassmorphism
- [x] AC-7: Project cards glassmorphism + hover
- [x] AC-8: Build passes
- [ ] Manual: Compare with Legacy design (NFR5 5-point check)
