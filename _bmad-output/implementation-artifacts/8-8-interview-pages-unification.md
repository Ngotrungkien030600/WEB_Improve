---
title: "Epic 8 - Story 8.8: Interview Pages Unification"
type: story
status: backlog
epic: "Epic 8: Unify & Elevate Design System"
story_id: "8.8"
created: "2026-08-05"
updated: "2026-08-06"
hardened: light (2026-08-06) — 17 cases (9 happy, 6 edge, 2 browser)
implemented: dev-story (2026-08-06) — 3 files
source_artifacts:
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/prd.md
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/epics.md
---

# Story 8.8: Interview Pages Unification

## Story Header

**Story ID:** 8.8
**Epic:** Epic 8: Unify & Elevate Design System
**Status:** backlog
**Created:** 2026-08-05

## Story Statement

**As a** người dùng,
**I want** interview pages với Forge design,
**So that** interview practice feel polished và professional.

## Story Goal

Unify 3 interview pages sang Forge design system:
- `InterviewPage.vue`
- `SalaryInterviewPage.vue`
- `InterviewEnglishPage.vue`

---

## Story Requirements

### FR-11: Interview Pages Unification

Interview pages dùng Forge design.

**Consequences:**
- Cards: CCard/CHubCard component
- Buttons: CButton component
- Progress indicators: unified style
- Tables: CTable component (if applicable)

---

## InterviewPage.vue

### Current State
- Topic list with checklist
- Progress tracking per topic
- Navigation between topics
- Sidebar + content layout

### Required Changes
| Element | Current | Target |
|---|---|---|
| Background | white | `--forge-bg` |
| Sidebar | white card | `--forge-glass` |
| Topic list | white items | glassmorphism |
| Checkboxes | default styled | accent color |
| Progress | inline bar | unified style |
| Active topic | accent border | `--forge-accent` |

### CSS Pattern
```css
.interview-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.interview-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  padding: 1.25rem;
}

.interview-item {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--forge-text2);
  transition: all var(--transition-base);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.interview-item:hover {
  background: var(--forge-glass-hover);
  color: var(--forge-text);
}

.interview-item.active {
  background: var(--forge-glass-hover);
  border: 1px solid var(--forge-accent);
  color: var(--forge-accent);
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.625rem 0;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.checklist-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--forge-success);
  margin-top: 2px;
}

.checklist-item.checked span {
  text-decoration: line-through;
  color: var(--forge-text3);
}
```

---

## SalaryInterviewPage.vue

### Current State
- Salary range selector (dropdown)
- Question list based on salary
- AI supplementation feature
- Filter/sort options

### Required Changes
| Element | Current | Target |
|---|---|---|
| Background | white | `--forge-bg` |
| Selector | default styled | glassmorphism |
| Cards | white cards | `--forge-glass` |
| Buttons | default | CButton |
| AI button | accent | `--forge-fire` gradient |

### CSS Pattern
```css
.salary-selector {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.salary-selector select {
  background: var(--forge-glass-hover);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 0.625rem 1rem;
  font-size: 0.95rem;
  color: var(--forge-text);
  cursor: pointer;
  width: 100%;
}

.salary-selector select:focus {
  border-color: var(--forge-accent);
  outline: none;
}

.question-card {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all var(--transition-base);
}

.question-card:hover {
  border-color: var(--forge-glass-hover-border);
}
```

---

## InterviewEnglishPage.vue

### Current State
- English interview questions
- Day-by-day roadmap
- Progress tracking
- AI conversation feature

### Required Changes
| Element | Current | Target |
|---|---|---|
| Background | white | `--forge-bg` |
| Day cards | white | `--forge-glass` |
| Progress | legacy | unified style |
| Tables | if exists | CTable |
| Active day | accent border | `--forge-accent` |

### CSS Pattern
```css
.day-card {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all var(--transition-spring);
}

.day-card:hover {
  background: var(--forge-glass-hover);
  border-color: var(--forge-glass-hover-border);
}

.day-card.active {
  border-color: var(--forge-accent);
  background: var(--forge-glass-hover);
}

.day-card.completed {
  opacity: 0.7;
}

.day-card.completed::after {
  content: '✓';
  color: var(--forge-success);
  font-weight: bold;
}
```

---

## Acceptance Criteria

### InterviewPage

**Given** InterviewPage is opened
**When** displaying topics
**Then** sidebar uses `--forge-glass` background
**And** active topic has `--forge-accent` border
**And** checked items show `--forge-success` checkmark

**Given** User checks a checklist item
**When** item state changes
**Then** checkbox uses `--forge-success` for checked
**And** text shows line-through
**And** progress updates

### SalaryInterviewPage

**Given** SalaryInterviewPage is opened
**When** salary range is selected
**Then** dropdown styled with `--forge-glass`
**And** selected option highlighted

**Given** Questions are displayed
**When** user views question list
**Then** cards use `--forge-glass` background
**And** AI button uses `--forge-fire` gradient

### InterviewEnglishPage

**Given** InterviewEnglishPage is opened
**When** displaying roadmap
**Then** day cards use `--forge-glass`
**And** active day has `--forge-accent` border
**And** completed days show checkmark

**Given** User completes a day
**When** marking done
**Then** checkmark uses `--forge-success`
**And** card shows completion state

---

## Technical Implementation

### Files to Modify

| File | Action | Changes |
|---|---|---|
| `src/pages/InterviewPage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |
| `src/pages/SalaryInterviewPage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |
| `src/pages/InterviewEnglishPage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |

### Common Page Structure

```vue
<template>
  <div class="interview-page">
    <div class="page-container">
      <CTopbar 
        title="💼 Interview" 
        back-label="← Trang chủ" 
      />
      
      <div class="stats-row">
        <CStatCard value="X" label="Completed" />
        <CStatCard value="Y" label="Remaining" />
      </div>
      
      <div class="content-area">
        <!-- Page-specific content -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.interview-page {
  background: var(--forge-bg);
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.page-container {
  max-width: 960px;
  margin: 0 auto;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
</style>
```

---

## Dependencies

- Epic 2 (Component Library) must be complete
- CTopbar, CButton, CStatCard, CTable components must exist
- Design tokens in `main.css` must be loaded

## Non-Goals

- Don't change interview content/questions
- Don't modify AI integration logic
- Don't add new interview features
- Don't change checklist/roadmap logic

## Test Checklist

### Happy Path (H1-H9)
- [ ] H1: InterviewPage loads with Forge design — sidebar uses `--forge-glass`
- [ ] H2: Active topic has `--forge-accent` border
- [ ] H3: Checked items show `--forge-success` checkmark
- [ ] H4: Checklist item checked → progress updates
- [ ] H5: SalaryInterviewPage loads with Forge design
- [ ] H6: Salary selector styled with `--forge-glass`
- [ ] H7: AI button uses `--forge-fire` gradient
- [ ] H8: InterviewEnglishPage loads with Forge design
- [ ] H9: Day cards use `--forge-glass`, completed show checkmark

### Edge Cases (E1-E6)
- [ ] E1: InterviewPage no topics selected → empty state handled
- [ ] E2: SalaryInterviewPage no salary range → default selection
- [ ] E3: InterviewEnglishPage no days completed → initial state
- [ ] E4: Progress persists after page refresh (localStorage)
- [ ] E5: Double-click checkbox → no race condition
- [ ] E6: AI button click → loading state shown

### Browser/Device (B1-B2)
- [ ] B1: Desktop 1440px — full layout correct
- [ ] B2: Mobile 375px — responsive layout

### Build Verification
- [ ] All three pages build without errors
- [ ] Checklist interaction works
- [ ] Progress tracking displays correctly
- [ ] Salary selector interaction works
- [ ] Day card selection works
