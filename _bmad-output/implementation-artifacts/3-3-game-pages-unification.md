---
title: "Epic 3 - Story 3.3: Game Pages Unification"
type: story
status: backlog
epic: "Epic 3: Inner Pages Port to Forge Design"
story_id: "3.3"
created: "2026-08-05"
updated: "2026-08-05"
source_artifacts:
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/prd.md
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/epics.md
---

# Story 3.3: Game Pages Unification

## Story Header

**Story ID:** 3.3
**Epic:** Epic 3: Inner Pages Port to Forge Design
**Status:** backlog
**Created:** 2026-08-05

## Story Statement

**As a** người dùng,
**I want** game pages (Memory, Scramble, Speed Quiz) với Forge design và unified components,
**So that** games feel cohesive với rest of app và animations mượt mà.

## Story Goal

Unify 3 game pages sang Forge design system:
- `GameMemoryPage.vue`
- `GameScramblePage.vue`
- `GameSpeedQuizPage.vue`

---

## Story Requirements

### Functional Requirements

#### FR-11: Game Pages Unification

**Description:** Game pages (Memory, Scramble, Speed Quiz) dùng Forge design.

**Consequences (testable):**
- Cards: CCard/CHubCard component
- Buttons: CButton component  
- Feedback states: success/error colors từ semantic tokens
- Animation timing: 0.35s spring

### Specific Page Requirements

#### 1. GameMemoryPage.vue

**Current State:**
- Dùng Legacy CSS với white backgrounds
- Card grid với emoji icons
- Flip animation khi click

**Required Changes:**
- Background: `--forge-bg`
- Card style: glassmorphism với `--forge-glass`
- Flip animation: giữ nguyên logic, đổi colors
- Success feedback: `--forge-success` (green)
- Wrong feedback: `--forge-error` (red)
- Timer/bar colors: dùng `--forge-fire` accent

#### 2. GameScramblePage.vue

**Current State:**
- Word scramble game
- Input field để nhập đáp án
- Score tracking

**Required Changes:**
- Background: `--forge-bg`
- Input styling: glassmorphism style
- Buttons: CButton component
- Feedback: `--forge-success`/`--forge-error`
- Card containers: `--forge-glass`

#### 3. GameSpeedQuizPage.vue

**Current State:**
- Quiz với timer
- Multiple choice options
- Score display

**Required Changes:**
- Background: `--forge-bg`
- Timer bar: gradient với `--forge-fire` → `--forge-error`
- Options: glassmorphism cards
- Correct/Wrong: semantic colors

---

## Acceptance Criteria

### GameMemoryPage

**Given** GameMemoryPage is opened
**When** card flip animation plays
**Then** card background uses `--forge-glass`
**And** success state shows green (`--forge-success`)
**And** wrong state shows red (`--forge-error`)

**Given** GameMemoryPage on mobile
**When** viewport < 400px
**Then** grid shows 2 columns instead of 4

### GameScramblePage

**Given** User types answer in scramble game
**When** answer is correct
**Then** feedback shows `--forge-success` color
**And** score updates

**Given** User types wrong answer
**When** submit
**Then** feedback shows `--forge-error` color
**And** shake animation plays

### GameSpeedQuizPage

**Given** Speed quiz is active
**When** timer counts down
**Then** progress bar uses gradient `--forge-fire` to `--forge-error`

**Given** User selects correct answer
**When** option is clicked
**Then** option background shows `--forge-success`
**And** score increments

---

## Technical Implementation Notes

### Files to Modify

| File | Action | Changes |
|---|---|---|
| `src/pages/GameMemoryPage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |
| `src/pages/GameScramblePage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |
| `src/pages/GameSpeedQuizPage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |

### Components to Use

- `CButton` - for all buttons (primary/secondary variants)
- `CHubCard` - for card containers if applicable
- Semantic tokens: `--forge-success`, `--forge-error`

### CSS Variables to Use

```css
--forge-bg: #08080e
--forge-glass: rgba(255, 255, 255, 0.06)
--forge-glass-hover: rgba(255, 255, 255, 0.12)
--forge-glass-border: rgba(255, 255, 255, 0.08)
--forge-success: #22c55e
--forge-error: #ef4444
--forge-fire: #f97316
--forge-ember: #fbbf24
--forge-text: #f1f5f9
--forge-text2: #94a3b8
--forge-text3: #64748b
--transition-spring: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Page Structure Pattern

```vue
<template>
  <div class="game-page">
    <div class="game-container">
      <!-- Title/Header -->
      <CTopbar title="🧠 Game" back-label="← Trang chủ" />
      
      <!-- Game UI -->
      <div class="game-content">
        <!-- Game-specific UI -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-page {
  --forge-accent: var(--forge-fire); /* or per-hub accent */
  background: var(--forge-bg);
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.game-container {
  max-width: 960px;
  margin: 0 auto;
}
</style>
```

---

## Dependencies

- Epic 2 (Component Library) must be complete
- CButton, CTopbar components must exist
- Design tokens in `main.css` must be loaded

## Non-Goals

- Don't change game logic/algorithms
- Don't add new game features
- Don't modify scoring mechanics

## Test Checklist

- [ ] GameMemoryPage loads with Forge design
- [ ] Card flip animation works
- [ ] Success/error feedback colors correct
- [ ] Mobile responsive grid works
- [ ] GameScramblePage loads with Forge design
- [ ] Input styling correct
- [ ] Shake animation on wrong answer
- [ ] GameSpeedQuizPage loads with Forge design
- [ ] Timer bar gradient correct
- [ ] Option selection feedback correct
- [ ] All three pages build without errors
