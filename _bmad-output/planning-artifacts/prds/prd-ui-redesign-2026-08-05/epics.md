---
stepsCompleted: [
  'step-01-validate-prerequisites',
  'step-02-design-epics',
  'step-03-create-stories',
  'implemented'
]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-ui-redesign-2026-08-05/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-web-improve-2026-07-30/ARCHITECTURE-SPINE.md
---

# SkillForge — Unify & Elevate Design System - Epic Breakdown

## Overview

Tài liệu này chia nhỏ công việc unify UI từ hai design system (Forge và Legacy) thành epic và story có thể thực hiện được. Dẫn nguồn từ PRD UI Redesign và Architecture spine hiện tại.

## Requirements Inventory

### Functional Requirements

FR1: Unified Color Palette — Forge color system được extend với semantic colors cho mọi UI state.
FR2: Unified Spacing & Typography Scale — Spacing và typography nhất quán xuyên app.
FR3: Component State Tokens — Mỗi component state (default, hover, active, disabled) có token riêng.
FR4: CCard — Unified Card Component với glassmorphism style và hover effects.
FR5: CButton — Unified Button Component với multiple variants và states.
FR6: CTopbar — Unified Topbar Component với blur glass effect.
FR7: CStatCard — Unified Stat Display cho dashboard và metrics.
FR8: CTable — Unified Table Component với hover rows và consistent styling.
FR9: Hub Pages Unification — 5 hub pages (ai/, english/, java/, cloud/, frontend/) dùng Forge design.
FR10: Dashboard Unification — Dashboard page dùng Forge design.
FR11: Game & Interview Pages Unification — Game pages và interview pages dùng Forge design.
FR12: Page Transition Animations — Pages fade in với subtle translate.
FR13: Card Stagger Animations — Cards appear với staggered delay.
FR14: Micro-interactions — Hover effects và button feedback nhất quán.
FR15: Unified Breakpoints — Breakpoints nhất quán cho responsive.
FR16: Mobile Touch Optimization — Touch targets và spacing tối ưu cho mobile.

### NonFunctional Requirements

NFR1: Ember particles và ambient glow effects chỉ用在 HomePage — inner pages không cần.
NFR2: Component library lean (5 components) — thêm khi cần thật.
NFR3: Port pages trước để reveal component needs — không over-engineer trước.
NFR4: Timeline 3-4 sprints (6-8 tuần) realistic cho solo dev với full-time job.
NFR5: Animation system light — chỉ fade-in, stagger, hover effects.
NFR6: Per-hub accent colors theo AD-17.

### Additional Requirements (from Architecture Spine)

AD-8: Token import thẳng `web-en/css/variables.css`, không sao chép.
AD-9: Component dùng chung thuần trình bày, tên theo vai trò, tiền tố `C`.
AD-10: Cách ly style: component tự mang style, page dùng `<style scoped>`.
AD-12: Mỗi trang đã chuyển dựng vỏ từ component dùng chung.
AD-17: Màu nhấn theo khu vực là token ghi đè ở tầng trang. 4 hub colors: AI `#f472b6`, English `#34d399`, Java `#f59e0b`, Cloud `#7c5cfc`, Frontend `#60a5fa`.

### FR Coverage Map

| FR | Epic | Ghi chú |
|---|---|---|
| FR1-FR3 (Design Tokens) | Epic 1 | Token system foundation |
| FR4-FR8 (Component Library) | Epic 2 | CCard, CButton, CTopbar, CStatCard, CTable |
| FR9-FR11 (Pages) | Epic 3 | Hub pages, Dashboard, Games/Interviews |
| FR12-FR16 (Animation/Responsive) | Epic 3 | Cross-cutting, applied during page port |

## Epic List

### Epic 1: Forge Design System Foundation

Tạo nền tảng design system: CSS tokens mở rộng, component state tokens, animation system cơ bản.

**FRs covered:** FR1, FR2, FR3, FR12, FR13, FR14, FR15, FR16

### Epic 2: Component Library Unification

Component library dùng chung với unified Forge design: CCard, CButton, CTopbar, CStatCard, CTable.

**FRs covered:** FR4, FR5, FR6, FR7, FR8

### Epic 3: Inner Pages Port to Forge Design

Port tất cả inner pages (hubs, dashboard, games, interviews) sang Forge design system.

**FRs covered:** FR9, FR10, FR11

---

## Epic 1: Forge Design System Foundation

### Story 1.1: Extend Forge Color Palette với Semantic Tokens

As a người xây,
I want một bảng semantic color tokens đầy đủ,
So that mọi component dùng cùng một bảng màu thay vì mỗi trang tự chọn.

**Acceptance Criteria:**

**Given** Forge color system hiện tại (backgrounds, accents, text)
**When** mở rộng tokens
**Then** có semantic colors: `--forge-success` (#22c55e), `--forge-error` (#ef4444), `--forge-warning` (#f59e0b), `--forge-info` (#3b82f6)
**And** glass surfaces: `--forge-glass` rgba(255,255,255,0.06), `--forge-glass-hover` rgba(255,255,255,0.12)
**And** glass borders: `--forge-glass-border` rgba(255,255,255,0.08), `--forge-glass-hover-border` rgba(255,255,255,0.18)

**Given** tokens đã extend
**When** kiểm `projects/web-en/css/variables.css`
**Then** tất cả tokens mới được thêm vào file gốc (AD-8: không sao chép)
**And** `grep -rn "#[0-9a-fA-F]{3,6}" projects/web-app/src/components` trả về 0 kết quả

### Story 1.2: Create Component State Tokens

As a người xây,
I want component state tokens cho button, card, input,
So that hover/active/disabled states nhất quán xuyên app.

**Acceptance Criteria:**

**Given** cần định nghĩa component states
**When** tạo tokens
**Then** button states: `--btn-bg`, `--btn-bg-hover`, `--btn-border`, `--btn-border-hover`
**And** card states: `--card-bg`, `--card-bg-hover`, `--card-border`, `--card-border-hover`, `--card-shadow-hover`
**And** input states: `--input-bg`, `--input-border`, `--input-border-focus`

**Given** tokens đã tạo
**When** kiểm cách dùng
**Then** components tham chiếu tokens thay vì hardcoded values
**And** không có hex color trong `<style scoped>` của page components

### Story 1.3: Animation System Setup

As a người dùng,
I want animations mượt mà nhưng không overwhelming,
So that app cảm thấy responsive và polished.

**Acceptance Criteria:**

**Given** animation cơ bản
**When** setup
**Then** page transitions: 0.4s ease, opacity 0→1, translateY 12px→0
**And** card stagger: 0.05s delay per card, max 0.55s
**And** micro-interactions: card hover translateY(-4px), button hover translateY(-2px)

**Given** `prefers-reduced-motion` user
**When** page loaded
**Then** animations disabled hoặc simplified
**And** page transitions instant, card animations skipped

**Given** animation system
**When** kiểm breakpoint behaviors
**Then** animations nhất quán trên mọi breakpoint
**And** touch devices có tap feedback thay vì hover effects

---

## Epic 2: Component Library Unification

### Story 2.1: CCard — Unified Card Component

As a người dùng,
I want cards có glassmorphism effect và hover animation,
So that UI thấy hiện đại và responsive khi tương tác.

**Acceptance Criteria:**

**Given** CCard component
**When** được dùng
**Then** default state: glass bg rgba(255,255,255,0.04), border rgba(255,255,255,0.08), radius 16px
**And** hover state: bg rgba(255,255,255,0.08), border rgba(255,255,255,0.18), translateY(-4px), shadow + glow
**And** transition: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)

**Given** CCard props
**When** kiểm interface
**Then** hỗ trợ: `icon`, `title`, `description`, `href`, `accentColor` (optional)
**And** accentColor override được truyền qua CSS variable

**Given** CCard trên mobile
**When** viewport < 400px
**Then** grid chuyển sang 1 column
**And** touch target đủ lớn (full card clickable)

### Story 2.2: CButton — Unified Button Component

As a người dùng,
I want buttons có variants khác nhau cho mỗi use case,
So that UI có hierarchy rõ ràng và feedback tức thì.

**Acceptance Criteria:**

**Given** CButton component
**When** được dùng
**Then** variants: primary (fire gradient), secondary (glass), ghost (transparent)
**And** sizes: sm, md, lg
**And** states: default, hover (lift + glow), active (press), disabled (opacity 0.5)

**Given** CButton props
**When** kiểm interface
**Then** hỗ trợ: `variant`, `size`, `disabled`, `loading`, `@click`
**And** loading state hiển thị spinner

**Given** button interaction
**When** clicked
**Then** emit event `@click`
**And** disabled state prevent interaction

### Story 2.3: CTopbar — Unified Topbar Component

As a người dùng,
I want topbar với blur glass effect và back navigation,
So that navigation feel seamless và modern.

**Acceptance Criteria:**

**Given** CTopbar component
**When** được dùng
**Then** blur glass bg: backdrop-filter blur(12px)
**And** left: title (h1, 1.5rem, weight 700)
**And** right: back link với accent color, underline on hover
**And** props: `title`, `accentColor` (optional)

**Given** CTopbar với accentColor
**When** hiển thị
**Then** back link dùng accent color đó
**And** không ảnh hưởng component khác

### Story 2.4: CStatCard — Unified Stat Display

As a người dùng,
I want stat cards hiển thị metrics với visual hierarchy rõ,
So that dashboard có professional look.

**Acceptance Criteria:**

**Given** CStatCard component
**When** được dùng
**Then** large value: 2.2rem, weight 800, accent color
**And** small label: 0.9rem, muted color
**And** icon optional
**And** props: `value`, `label`, `icon`, `accentColor`

**Given** CStatCard grid
**When** hiển thị nhiều cards
**Then** responsive: 4 columns → 2 columns → 1 column

### Story 2.5: CTable — Unified Table Component

As a người dùng,
I want tables với hover rows và consistent styling,
So that data tables dễ đọc và professional.

**Acceptance Criteria:**

**Given** CTable component
**When** được dùng
**Then** hover row: bg tint với --forge-glass-hover
**And** borders: subtle rgba(255,255,255,0.06) between rows
**And** header: weight 600, uppercase label
**And** props: `columns`, `data`, `onRowClick`

**Given** CTable interaction
**When** row clicked và onRowClick provided
**Then** emit row click event

---

## Epic 3: Inner Pages Port to Forge Design

### Story 3.1: Hub Pages Unification (AI, English, Java, Cloud, Frontend)

As a người dùng,
I want mỗi hub page có unified Forge design với per-hub accent color,
So that tôi biết đang ở hub nào qua visual identity.

**Acceptance Criteria:**

**Given** 5 hub pages
**When** ported to Forge design
**Then** background: --forge-bg
**And** cards: glassmorphism CCard style
**And** topbar: CTopbar component
**And** grid: 2 columns → 1 column on mobile

**Given** per-hub accent colors (AD-17)
**When** kiểm mỗi hub
**Then** AI hub: #f472b6 (pink)
**And** English hub: #34d399 (green)
**And** Java hub: #f59e0b (amber)
**And** Cloud hub: #7c5cfc (purple)
**And** Frontend hub: #60a5fa (blue)

**Given** accent color implementation
**When** kiểm cách đặt
**Then** component tham chiếu một token màu nhấn duy nhất (AD-17)
**And** trang ghi đè giá trị token đó trên phần tử gốc
**And** không thêm token mới vào file dùng chung cho mỗi hub

**Given** hub cards
**When** hover
**Then** border color đổi sang hub accent color

### Story 3.2: Dashboard Unification

As a người dùng,
I want dashboard với Forge design và unified stat/table components,
So that stats dễ đọc và nhất quán với rest of app.

**Acceptance Criteria:**

**Given** Dashboard page
**When** ported to Forge design
**Then** background: --forge-bg
**And** stat cards: CStatCard component
**And** tables: CTable component
**And** skill bars: unified progress bar style với --forge-glass
**And** streak display: circular badges với accent colors

**Given** Dashboard components
**When** kiểm responsive
**Then** stat cards: responsive grid
**And** tables: horizontal scroll on mobile

### Story 3.3: Game Pages Unification

As a người dùng,
I want game pages (Memory, Scramble, Speed Quiz) với Forge design,
So that games feel cohesive với rest of app.

**Acceptance Criteria:**

**Given** 3 game pages
**When** ported to Forge design
**Then** cards: CCard component
**And** buttons: CButton component
**And** feedback states: success/error colors từ semantic tokens

**Given** game feedback
**When** correct answer
**Then** green success feedback với --forge-success
**And** wrong answer: red error feedback với --forge-error

### Story 3.4: Interview Pages Unification

As a người dùng,
I want interview pages với Forge design,
So that interview practice feel polished và professional.

**Acceptance Criteria:**

**Given** interview pages (Interview Hub, Salary Interview, English Interview)
**When** ported to Forge design
**Then** cards: CCard component
**And** buttons: CButton component
**And** progress indicators: unified style

**Given** interview interactions
**When** kiểm states
**Then** hover effects consistent với other pages
**And** animation timing nhất quán (0.35s spring)

---

## Appendix: Design Token Reference

### Color Tokens

```
--forge-bg: #08080e
--forge-bg2: #0d0d1a
--forge-surface: rgba(255,255,255,0.04)
--forge-surface-hover: rgba(255,255,255,0.08)
--forge-glass: rgba(255,255,255,0.06)
--forge-glass-border: rgba(255,255,255,0.08)
--forge-glass-hover: rgba(255,255,255,0.12)
--forge-glass-hover-border: rgba(255,255,255,0.18)
--forge-ember: #fbbf24
--forge-fire: #f97316
--forge-fire-glow: #ea580c
--forge-text: #f1f5f9
--forge-text2: #94a3b8
--forge-text3: #64748b
--forge-success: #22c55e
--forge-error: #ef4444
--forge-warning: #f59e0b
--forge-info: #3b82f6
```

### Spacing Tokens

```
--space-xs: 6px
--space-sm: 12px
--space-md: 20px
--space-lg: 40px
```

### Border Radius Tokens

```
--radius-sm: 8px
--radius-md: 14px
--radius-lg: 16px
--radius-pill: 20px
```

### Transition Tokens

```
--transition-fast: 0.15s ease
--transition-base: 0.25s ease
--transition-spring: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Breakpoints

```
--bp-mobile: 400px
--bp-tablet: 768px
--bp-desktop: 1024px
```

### Per-Hub Accent Colors

```
--accent-ai: #f472b6
--accent-english: #34d399
--accent-java: #f59e0b
--accent-cloud: #7c5cfc
--accent-frontend: #60a5fa
```
