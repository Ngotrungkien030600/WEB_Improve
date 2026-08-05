---
title: "Epic 8 - Story 8.7: Game Pages Unification"
type: story
status: ready-for-dev
epic: "Epic 8: Unify & Elevate Design System"
story_id: "8.7"
created: "2026-08-05"
updated: "2026-08-05"
hardened: light (2026-08-06) — 8 AC, 14 cases (6 happy, 6 edge, 2 browser)
implemented: dev-story (2026-08-06) — 3 files
source_artifacts:
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/prd.md
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/epics.md
---

# Story 8.7: Game Pages Unification

## Story Header

**Story ID:** 8.7
**Epic:** Epic 8: Unify & Elevate Design System
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

### FR-11: Game Pages Unification

Game pages (Memory, Scramble, Speed Quiz) dùng Forge design.

**Consequences:**
- Cards: CCard/CHubCard component
- Buttons: CButton component
- Feedback states: success/error colors từ semantic tokens
- Animation timing: 0.35s spring

---

## GameMemoryPage.vue

### Current State
- Card grid với emoji icons
- Flip animation khi click
- Match counter
- Timer

### Required Changes
| Element | Current | Target |
|---|---|---|
| Background | white | `--forge-bg` |
| Card | white bg, gray border | `--forge-glass` bg, accent border |
| Success | green text | `--forge-success` |
| Wrong | red text | `--forge-error` |
| Match count | legacy style | unified stat |

### CSS Pattern
```css
.game-memory-page {
  background: var(--forge-bg);
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.memory-card {
  background: var(--forge-glass);
  border: 2px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  aspect-ratio: 1;
  transition: all var(--transition-spring);
}

.memory-card:hover {
  border-color: var(--forge-accent);
  transform: scale(1.02);
}

.memory-card.matched {
  background: rgba(34, 197, 94, 0.15);
  border-color: var(--forge-success);
}

.memory-card.wrong {
  background: rgba(239, 68, 68, 0.15);
  border-color: var(--forge-error);
}
```

---

## GameScramblePage.vue

### Current State
- Word scramble display
- Input field để nhập đáp án
- Score tracking
- Hint button

### Required Changes
| Element | Current | Target |
|---|---|---|
| Background | legacy | `--forge-bg` |
| Scrambled word | white card | `--forge-glass` |
| Input | legacy styled | glassmorphism styled |
| Buttons | legacy | CButton |
| Feedback | legacy | semantic colors |

### CSS Pattern
```css
.scramble-word {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  padding: 1.5rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--forge-accent);
}

.scramble-input {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--forge-text);
  transition: all var(--transition-base);
}

.scramble-input:focus {
  border-color: var(--forge-accent);
  outline: none;
}

.feedback-correct {
  color: var(--forge-success);
}

.feedback-wrong {
  color: var(--forge-error);
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

---

## GameSpeedQuizPage.vue

### Current State
- Quiz với countdown timer
- Multiple choice options
- Score display
- Results screen

### Required Changes
| Element | Current | Target |
|---|---|---|
| Background | legacy | `--forge-bg` |
| Timer bar | gradient | `--forge-fire` → `--forge-error` |
| Options | white cards | `--forge-glass` |
| Correct | green | `--forge-success` |
| Wrong | red | `--forge-error` |
| Score | legacy | unified stat |

### CSS Pattern
```css
.speed-quiz-page {
  background: var(--forge-bg);
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.timer-bar {
  height: 8px;
  background: var(--forge-glass);
  border-radius: 4px;
  overflow: hidden;
}

.timer-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--forge-fire), var(--forge-error));
  transition: width 0.1s linear;
}

.quiz-option {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  cursor: pointer;
  transition: all var(--transition-spring);
}

.quiz-option:hover:not(:disabled) {
  background: var(--forge-glass-hover);
  border-color: var(--forge-accent);
}

.quiz-option.selected-correct {
  background: rgba(34, 197, 94, 0.15);
  border-color: var(--forge-success);
}

.quiz-option.selected-wrong {
  background: rgba(239, 68, 68, 0.15);
  border-color: var(--forge-error);
}
```

---

## Acceptance Criteria

### GameMemoryPage

**Given** GameMemoryPage is opened
**When** card flip animation plays
**Then** card uses `--forge-glass` background
**And** matched cards show `--forge-success` border
**And** wrong attempts show `--forge-error` border

**Given** GameMemoryPage on mobile
**When** viewport < 400px
**Then** grid shows 3 columns instead of 4

### GameScramblePage

**Given** User types correct answer
**When** submit
**Then** feedback shows `--forge-success` color
**And** score increments

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
**Then** option shows `--forge-success` styling
**And** score increments

---

## Technical Implementation

### Files to Modify

| File | Action | Changes |
|---|---|---|
| `src/pages/GameMemoryPage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |
| `src/pages/GameScramblePage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |
| `src/pages/GameSpeedQuizPage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |

### Common Page Structure

```vue
<template>
  <div class="game-page">
    <div class="game-container">
      <CTopbar title="🎮 Game" back-label="← Trang chủ" />
      
      <div class="game-content">
        <!-- Game UI -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-page {
  --forge-accent: var(--forge-fire);
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

### Happy Path (H1-H7)
- [ ] H1: GameMemoryPage loads with Forge design — card flip animation with glass styling
- [ ] H2: Matched cards show `--forge-success` border
- [ ] H3: Wrong attempts show `--forge-error` border
- [ ] H4: Scramble correct answer → success feedback + score increment
- [ ] H5: Scramble wrong answer → shake animation + error color
- [ ] H6: SpeedQuiz timer bar uses `--forge-fire` to `--forge-error` gradient
- [ ] H7: SpeedQuiz correct option → success styling

### Edge Cases (E1-E6)
- [ ] E1: Memory mobile < 400px → 3 columns grid
- [ ] E2: Memory all cards matched → win state triggers
- [ ] E3: Scramble empty input submission → handled
- [ ] E4: Scramble case sensitivity → consistent behavior
- [ ] E5: SpeedQuiz timer expires → auto-fail or next question
- [ ] E6: SpeedQuiz all questions answered → results screen

### Browser/Device (B1-B2)
- [ ] B1: Desktop 1440px — full layout correct
- [ ] B2: Mobile 375px — stacked layout, 3-column grid

### Build Verification
- [ ] All three pages build without errors
- [ ] Card flip animation works
- [ ] Matched/wrong states show correct colors
- [ ] Mobile responsive grid works
- [ ] GameScramblePage loads with Forge design
- [ ] Input styling correct
- [ ] Shake animation on wrong answer
- [ ] GameSpeedQuizPage loads with Forge design
- [ ] Timer bar gradient correct
- [ ] Option selection feedback correct
- [ ] All three pages build without errors
