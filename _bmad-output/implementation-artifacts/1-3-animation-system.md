---
title: "Epic 1 - Story 1.3: Animation System Setup"
type: story
status: backlog
epic: "Epic 1: Forge Design System Foundation"
story_id: "1.3"
created: "2026-08-05"
updated: "2026-08-05"
source_artifacts:
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/prd.md
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/epics.md
---

# Story 1.3: Animation System Setup

## Story Header

**Story ID:** 1.3
**Epic:** Epic 1: Forge Design System Foundation
**Status:** backlog
**Created:** 2026-08-05

## Story Statement

**As a** người dùng,
**I want** animations mượt mà nhưng không overwhelming,
**So that** app cảm thấy responsive và polished.

## Story Goal

Setup animation system với:
- Page transitions
- Card stagger animations
- Micro-interactions
- Reduced motion support

---

## Story Requirements

### Functional Requirements

#### FR-12: Page Transition Animations

**Description:** Pages fade in với subtle translate.

**Consequences (testable):**
- Duration: 0.4s ease
- Keyframes: opacity 0→1, translateY 12px→0
- Applied on `<router-view>` transition

#### FR-13: Card Stagger Animations

**Description:** Cards appear với staggered delay.

**Consequences (testable):**
- Base delay: 0.05s per card
- Max delay: 0.55s (11th card)
- Keyframes: opacity 0→1, translateY 24px→0, scale 0.97→1

#### FR-14: Micro-interactions

**Description:** Hover effects và button feedback nhất quán.

**Consequences (testable):**
- Card hover: translateY(-4px) + shadow + border highlight
- Button hover: translateY(-2px) + glow
- Focus states: outline với accent color

#### FR-14.1: Animation Guard (Reduced Motion)

**Description:** Respects `prefers-reduced-motion` media query.

**Consequences (testable):**
- Page transitions: instant (no fade)
- Card animations: disabled
- Hover effects: kept but simplified

---

## Acceptance Criteria

### Page Transitions

**Given** User navigates between pages
**When** router-view transition plays
**Then** content fades in with opacity 0→1
**And** translateY 12px→0
**And** duration is 0.4s

**Given** User prefers reduced motion
**When** navigating
**Then** transition is instant (no fade)
**And** translateY is skipped

### Card Stagger

**Given** Hub page loads with 6 cards
**When** cards appear
**Then** card 1 delays 0.05s, card 2 delays 0.1s...
**And** max delay is 0.55s (for 11th card)

**Given** User prefers reduced motion
**When** cards load
**Then** stagger animation is disabled
**And** cards appear immediately

### Micro-interactions

**Given** Card is hovered
**When** user moves mouse over
**Then** card translates -4px on Y axis
**And** border highlights with accent color
**And** shadow increases

**Given** Button is hovered
**When** user moves mouse over
**Then** button translates -2px on Y axis
**And** glow effect appears

**Given** Button is focused
**When** tab navigation brings focus
**Then** outline appears with accent color

---

## Technical Implementation Notes

### Files to Modify

| File | Action | Changes |
|---|---|---|
| `src/App.vue` | UPDATE | Add router-view transition |
| `src/styles/main.css` | UPDATE | Add animation keyframes and tokens |

### Router View Transition

Add to `App.vue`:

```vue
<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
  
  .page-enter-from,
  .page-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
```

### Card Stagger Animation

Add stagger nth-child selectors to each card container:

```css
/* For hub pages with CHubCard */
.hub-card:nth-child(1) { animation-delay: 0.05s; }
.hub-card:nth-child(2) { animation-delay: 0.1s; }
.hub-card:nth-child(3) { animation-delay: 0.15s; }
.hub-card:nth-child(4) { animation-delay: 0.2s; }
.hub-card:nth-child(5) { animation-delay: 0.25s; }
.hub-card:nth-child(6) { animation-delay: 0.3s; }
.hub-card:nth-child(7) { animation-delay: 0.35s; }
.hub-card:nth-child(8) { animation-delay: 0.4s; }
.hub-card:nth-child(9) { animation-delay: 0.45s; }
.hub-card:nth-child(10) { animation-delay: 0.5s; }
.hub-card:nth-child(11) { animation-delay: 0.55s; }

@media (prefers-reduced-motion: reduce) {
  .hub-card {
    animation-delay: 0s !important;
  }
}
```

### Global Animation Keyframes

```css
@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### Components that need stagger

- `CHubCard` - already has animation, needs reduced-motion guard
- `CCard` - already has animation, needs reduced-motion guard
- Check `CGrid.vue` for wrapper class

---

## Dependencies

- None (standalone system-level story)

## Non-Goals

- Don't add ember particles to inner pages
- Don't add ambient glow effects to inner pages
- Don't change component logic (only animation layer)

## Test Checklist

- [ ] Page transitions work on navigation
- [ ] Card stagger works on hub pages
- [ ] Card hover micro-interactions work
- [ ] Button hover micro-interactions work
- [ ] Button focus states work
- [ ] Reduced motion media query respected
- [ ] All pages build without errors
