---
title: "Epic 3 - Story 3.4: Interview Pages Unification"
type: story
status: backlog
epic: "Epic 3: Inner Pages Port to Forge Design"
story_id: "3.4"
created: "2026-08-05"
updated: "2026-08-05"
source_artifacts:
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/prd.md
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/epics.md
---

# Story 3.4: Interview Pages Unification

## Story Header

**Story ID:** 3.4
**Epic:** Epic 3: Inner Pages Port to Forge Design
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

### Functional Requirements

#### FR-11: Interview Pages Unification

**Description:** Interview pages dùng Forge design.

**Consequences (testable):**
- Cards: CCard/CHubCard component
- Buttons: CButton component
- Progress indicators: unified style
- Tables: CTable component (if applicable)

### Specific Page Requirements

#### 1. InterviewPage.vue

**Current State:**
- Topic list with checklist
- Progress tracking per topic
- Navigation between topics

**Required Changes:**
- Background: `--forge-bg`
- Topic cards: glassmorphism style
- Checklist items: use semantic colors
- Progress bars: `--forge-glass` background, accent fill
- Navigation: use CTopbar

#### 2. SalaryInterviewPage.vue

**Current State:**
- Salary range selector
- Question list based on salary
- AI supplementation feature

**Required Changes:**
- Background: `--forge-bg`
- Cards: glassmorphism
- Selector: custom styled select with Forge colors
- Buttons: CButton component

#### 3. InterviewEnglishPage.vue

**Current State:**
- English interview questions
- Day-by-day roadmap
- Progress tracking

**Required Changes:**
- Background: `--forge-bg`
- Day cards: glassmorphism
- Progress indicators: unified style
- Tables: CTable if question table exists

---

## Acceptance Criteria

### InterviewPage

**Given** InterviewPage is opened
**When** displaying topics
**Then** topic cards use `--forge-glass` background
**And** active topic has accent border

**Given** User checks a checklist item
**When** item state changes
**Then** checkbox uses `--forge-success` for checked
**And** progress bar updates with `--forge-ember`

### SalaryInterviewPage

**Given** SalaryInterviewPage is opened
**When** salary range is selected
**Then** dropdown styled with `--forge-glass`
**And** selected option highlighted with accent

**Given** Questions are displayed
**When** user views question list
**Then** cards use `--forge-glass` background
**And** AI button uses `--forge-fire` gradient

### InterviewEnglishPage

**Given** InterviewEnglishPage is opened
**When** displaying roadmap
**Then** day cards use `--forge-glass`
**And** active day has accent border

**Given** User completes a day
**When** marking done
**Then** checkmark uses `--forge-success`
**And** day card shows completion state

---

## Technical Implementation Notes

### Files to Modify

| File | Action | Changes |
|---|---|---|
| `src/pages/InterviewPage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |
| `src/pages/SalaryInterviewPage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |
| `src/pages/InterviewEnglishPage.vue` | UPDATE | Replace Legacy CSS, use Forge tokens |

### Components to Use

- `CTopbar` - for page headers
- `CButton` - for all buttons
- `CHubCard` - for topic/question cards
- `CStatCard` - for stats display (if applicable)
- `CTable` - for question tables (if applicable)
- Semantic tokens: `--forge-success`, `--forge-error`, `--forge-warning`

### CSS Variables to Use

```css
--forge-bg: #08080e
--forge-glass: rgba(255, 255, 255, 0.06)
--forge-glass-hover: rgba(255, 255, 255, 0.12)
--forge-glass-border: rgba(255, 255, 255, 0.08)
--forge-glass-hover-border: rgba(255, 255, 255, 0.18)
--forge-success: #22c55e
--forge-error: #ef4444
--forge-warning: #f59e0b
--forge-fire: #f97316
--forge-ember: #fbbf24
--forge-text: #f1f5f9
--forge-text2: #94a3b8
--forge-text3: #64748b
--forge-card-radius: 16px
--transition-spring: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Common Interview Page Structure

```vue
<template>
  <div class="interview-page">
    <div class="page-container">
      <CTopbar 
        title="💼 Interview" 
        back-label="← Trang chủ" 
      />
      
      <!-- Stats/Progress -->
      <div class="stats-row">
        <CStatCard value="X" label="Completed" />
        <CStatCard value="Y" label="Remaining" />
      </div>
      
      <!-- Topic/Question List -->
      <div class="topic-list">
        <CHubCard 
          v-for="topic in topics"
          :key="topic.id"
          :icon="topic.icon"
          :title="topic.title"
          :description="topic.description"
        />
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

.topic-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
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

## Test Checklist

- [ ] InterviewPage loads with Forge design
- [ ] Topic cards styled correctly
- [ ] Checklist interaction works
- [ ] Progress tracking displays correctly
- [ ] SalaryInterviewPage loads with Forge design
- [ ] Salary selector styled correctly
- [ ] Question cards styled correctly
- [ ] InterviewEnglishPage loads with Forge design
- [ ] Day cards styled correctly
- [ ] Progress indicators correct
- [ ] All three pages build without errors
