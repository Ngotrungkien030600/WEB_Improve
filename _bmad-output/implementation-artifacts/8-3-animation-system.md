---
title: "Epic 8 - Story 8.3: Animation System"
type: story
status: ready-for-dev
epic: "Epic 8: Unify & Elevate Design System"
story_id: "8.3"
created: "2026-08-05"
updated: "2026-08-05"
source_artifacts:
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/prd.md
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/epics.md
hardened: light (2026-08-05) — 6 AC, 12 cases (6 happy/edge, 6 accessibility/browser)
---

# Story 8.3: Animation System

**Hardened:** light (2026-08-05) — 6 AC, 12 cases

**Implemented:** dev-story (2026-08-05) — 3 files (App.vue, CHubCard.vue, CCard.vue)

---

## Story Header

**Story ID:** 8.3
**Epic:** Epic 8: Unify & Elevate Design System
**Status:** ready-for-dev
**Mode:** Light

---

## Story Statement

**As a** người dùng,
**I want** animations mượt mà nhưng không overwhelming,
**So that** app cảm thấy responsive và polished.

---

## Story Goal

Setup animation system với:
- Page transitions
- Card stagger animations
- Micro-interactions
- Reduced motion support

---

## Story Requirements

### FR-12: Page Transition Animations

Pages fade in với subtle translate.

**Consequences:**
- Duration: 0.4s ease
- Keyframes: opacity 0→1, translateY 12px→0
- Applied on `<router-view>` transition
- MotivationPopup giữ nguyên, không thêm transition

### FR-13: Card Stagger Animations

Cards appear với staggered delay.

**Consequences:**
- Base delay: 0.05s per card
- Max delay: 0.55s (11th card)
- Mobile (<768px): stagger disabled for performance
- Keyframes: opacity 0→1, translateY 24px→0, scale 0.97→1

### FR-14: Micro-interactions

Hover effects và button feedback nhất quán.

**Consequences:**
- Card hover: translateY(-4px) + shadow + border highlight
- Button hover: translateY(-2px) + glow
- Focus states: outline với accent color (dùng `var(--forge-accent)`)

### FR-14.1: Animation Guard (Reduced Motion)

**Consequences:**
- Respects `prefers-reduced-motion: reduce` media query
- Page transitions: instant (no fade)
- Card animations: disabled
- Hover effects: kept but simplified (no transform)

---

## Acceptance Criteria

### Page Transitions (AC-1)

**Given** User navigates between pages
**When** router-view transition plays
**Then** content fades in with opacity 0→1
**And** translateY 12px→0
**And** duration is 0.4s

### Page Transitions - Reduced Motion (AC-2)

**Given** User prefers reduced motion (browser setting)
**When** navigating
**Then** transition is instant (no fade)
**And** translateY is skipped

### Card Stagger (AC-3)

**Given** Hub page loads with cards
**When** cards appear
**Then** card 1 delays 0.05s, card 2 delays 0.1s...
**And** max delay is 0.55s (for 11th card)

### Card Stagger - Mobile (AC-4)

**Given** Viewport < 768px
**When** hub page loads
**Then** stagger animation is disabled
**And** cards appear immediately

### Card Stagger - Reduced Motion (AC-5)

**Given** User prefers reduced motion
**When** cards load
**Then** stagger animation is disabled

### Micro-interactions (AC-6)

**Given** Card is hovered
**When** user moves mouse over
**Then** card translates -4px on Y axis
**And** border highlights with accent color
**And** shadow increases

---

## Technical Implementation

### Files to Modify

| File | Action | Changes |
|---|---|---|
| `src/App.vue` | UPDATE | Add router-view transition |
| `src/components/CHubCard.vue` | UPDATE | Add reduced-motion guard + stagger to 11 |
| `src/components/CCard.vue` | UPDATE | Add mobile stagger disable |

### App.vue - Add Router Transition

```vue
<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
  <MotivationPopup />
</template>

<script>
import MotivationPopup from './components/MotivationPopup.vue';

export default {
  name: 'App',
  components: { MotivationPopup },
};
</script>

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

### CHubCard.vue - Add Guards

Add to end of `<style scoped>`:

```css
/* Stagger for up to 11 cards */
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

@media (max-width: 768px) {
  .hub-card {
    animation-delay: 0s !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hub-card {
    animation: none !important;
  }
}
```

### CCard.vue - Add Guards

Add to end of `<style scoped>`:

```css
@media (max-width: 768px) {
  .home-card {
    animation-delay: 0s !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-card {
    animation: none !important;
  }
}
```

---

## Case List (12 cases)

### Happy Path

| ID | Case | Method |
|---|---|---|
| H1 | Page transition fade-in works | Navigate between pages, observe fade |
| H2 | Page transition translateY works | Check content moves 12px |
| H3 | Card stagger delays correct | Hub page loads, cards appear with delay |
| H4 | Card hover translateY(-4px) | Hover card, observe lift |
| H5 | Button hover translateY(-2px) | Hover button, observe lift |
| H6 | Focus outline visible | Tab to button, see outline |

### Edge Cases

| ID | Case | Method |
|---|---|---|
| E1 | 11+ cards stagger capped | Grid with 12 cards, delay stays 0.55s |
| E2 | Rapid navigation | Fast page switches, no transition overlap |
| E3 | Same page re-navigate | No unnecessary transition |

### Accessibility

| ID | Case | Method |
|---|---|---|
| A1 | Reduced motion: no fade | Browser setting on, navigate, no fade |
| A2 | Reduced motion: no stagger | Browser setting on, cards appear instantly |
| A3 | Reduced motion: hover kept | Hover still works, just no transform |

### Browser/Device

| ID | Case | Method |
|---|---|---|
| B1 | Mobile stagger disabled | <768px, cards appear immediately |
| B2 | Webkit backdrop-filter | Safari, blur effects work |

---

## Test Checklist

- [ ] AC-1: Page transitions work on navigation
- [ ] AC-2: Reduced motion disables page transition
- [ ] AC-3: Card stagger works (11 cards max)
- [ ] AC-4: Mobile disables stagger (<768px)
- [ ] AC-5: Reduced motion disables stagger
- [ ] AC-6: Card hover micro-interactions work
- [ ] Build passes

---

## Dependencies

- None (system-level story)

## Non-Goals

- Don't add animation to MotivationPopup
- Don't change component logic (only CSS layer)
- Don't add ember particles (per NFR1)
