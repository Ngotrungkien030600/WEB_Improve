---
title: Unify & Elevate Design System
type: prd
status: draft
created: 2026-08-05
updated: 2026-08-05
---

# PRD: Unify & Elevate Design System

## 0. Mục đích tài liệu

PRD này dành cho việc **unify UI** từ hai design system đang tồn tại (Forge và Legacy) thành một. Tài liệu này **bổ sung** PRD hiện tại về port Vue (`prd-web-improve-2026-07-30`), không thay thế nó.

PRD này phục vụ:
- **Người dùng cuối**: muốn trải nghiệm nhất quán, professional
- **Người xây (Giang)**: muốn codebase có design system rõ ràng, maintainable
- **Downstream workflows**: `bmad-ux`, `bmad-architecture`, `bmad-create-epics-and-stories`

## 1. Vision

SkillForge hiện có **hai design system song song**: Forge (trang chủ HomePage) với glassmorphism và fire/ember palette, và Legacy (các trang con) với surface/border nhẹ và per-page accent colors. Người dùng vào trang chủ thấy "đẹp, hiện đại" nhưng vào trang con thì contrast shock — cảm giác như web khác.

**Mục tiêu:** Unify tất cả UI lên Forge design language — dark theme với glassmorphism, ember/fire accent palette, staggered animations. Trang chủ vẫn giữ vai trò flagship, nhưng inner pages không còn "rẻ tiền" so với nó.

**Giá trị kinh doanh:** Giữ chân user tốt hơn qua visual consistency. Tạo professional portfolio piece.

## 2. Đối tượng

### 2.1 Jobs To Be Done

- **Là người học**, tôi muốn mở bất kỳ trang nào cũng thấy "app này được thiết kế cẩn thận" — không phải mix của hai aesthetic.
- **Là người học**, tôi muốn navigation giữa các trang không có visual jump.
- **Là người xây**, tôi muốn thêm feature mới mà không phải chọn "dùng Forge style hay Legacy style".
- **Là người xây**, tôi muốn design system document để onboarding dev mới nhanh.

### 2.2 Non-Users (v1)

- Người dùng mobile-first — responsive design đạt mức basic, không có mobile-specific redesign.
- Người dùng offline-first — design system không thay đổi behavior khi offline.

### 2.3 Key User Journeys

- **UJ-1. Giang mở trang con và không thấy contrast shock.**
  Giang đang học Java trên `java/hub`. Anh bấm sang Dashboard. Cả hai trang đều dùng dark glassmorphism, cùng card hover effect, cùng animation timing. Anh không nhận ra mình đang ở "trang đã port" hay "trang chưa port".

- **UJ-2. Giang thêm feature mới mà không phải chọn style.**
  Giang cần thêm trang "Luyện nói". Anh dùng `CButton`, `CCard`, `CTopbar` có sẵn. Component đã unified nên trang mới tự động match với toàn app. Không phải suy nghĩ "Forge hay Legacy".

- **UJ-3. User mới mở app lần đầu.**
  Minh, sinh viên năm 3, tìm thấy SkillForge. Mở trang chủ → thấy đẹp. Click vào "Frontend Hub" → vẫn đẹp. Thử "Dashboard" → vẫn nhất quán. Cô ấy tin tưởng app này và tiếp tục sử dụng.

## 3. Glossary

- **Forge Design System** — design language hiện tại của HomePage: dark theme (#08080e), glassmorphism cards, ember/fire accent palette (#fbbf24, #f97316), staggered animations.
- **Legacy Design System** — design system cũ của inner pages: lighter surface colors, per-page accent overrides, minimal animations.
- **Design Token** — CSS custom property định nghĩa decision thị giác (màu, spacing, radius, shadow).
- **Unified Design System** — Forge Design System được extend để phủ tất cả UI, không còn Legacy style riêng.
- **Component Library** — tập Vue components dùng chung (`CCard`, `CButton`, `CTopbar`, `CStatCard`, `CTable`) dựa trên Unified Design System.

## 4. Features

### 4.1 Forge Design System Extension

**Description:** Extend Forge design tokens từ HomePage để cover tất cả UI elements cần thiết. Tạo semantic tokens cho component states.

**Functional Requirements:**

#### FR-1: Unified Color Palette

Forge color system được extend với semantic colors cho mọi UI state.

**Consequences (testable):**
- Background: `#08080e` (deep), `#0d0d1a` (alt)
- Text: `#f1f5f9` (primary), `#94a3b8` (secondary), `#64748b` (tertiary)
- Accent: `#fbbf24` (ember), `#f97316` (fire), `#ea580c` (fire-glow)
- Semantic: success `#22c55e`, error `#ef4444`, warning `#f59e0b`, info `#3b82f6`
- Glass surfaces: `rgba(255,255,255,0.04)` → `rgba(255,255,255,0.12)` hover
- Glass borders: `rgba(255,255,255,0.08)` → `rgba(255,255,255,0.18)` hover

#### FR-2: Unified Spacing & Typography Scale

Spacing và typography nhất quán xuyên app.

**Consequences (testable):**
- Spacing scale: 6px (xs), 12px (sm), 20px (md), 40px (lg)
- Container max-width: 1240px (home), 960px (subpage)
- Card padding: 24px
- Border radius: 8px (sm), 14px (md), 16px (lg)
- Font: Inter, weight 400-900
- Font sizes: 0.82rem - 3.2rem

#### FR-3: Component State Tokens

Mỗi component state (default, hover, active, disabled) có token riêng.

**Consequences (testable):**
- Button: `--btn-bg`, `--btn-bg-hover`, `--btn-border`, `--btn-border-hover`
- Card: `--card-bg`, `--card-bg-hover`, `--card-border`, `--card-border-hover`, `--card-shadow-hover`
- Input: `--input-bg`, `--input-border`, `--input-border-focus`

---

### 4.2 Component Library Unification

**Description:** All shared components (`CCard`, `CButton`, `CTopbar`, `CStatCard`, `CTable`) được rewrite để dùng Unified Design System. Component nào chưa có thì tạo mới.

**Functional Requirements:**

#### FR-4: CCard — Unified Card Component

Card component dùng glassmorphism style với hover effects.

**Consequences (testable):**
- Default: glass bg `rgba(255,255,255,0.04)`, border `rgba(255,255,255,0.08)`, radius 16px
- Hover: bg `rgba(255,255,255,0.08)`, border `rgba(255,255,255,0.18)`, translateY(-4px), shadow + glow
- Spring transition: `0.35s cubic-bezier(0.34, 1.56, 0.64, 1)`
- Props: `icon`, `title`, `description`, `href`, `accentColor` (optional override)

#### FR-5: CButton — Unified Button Component

Button với multiple variants và states.

**Consequences (testable):**
- Variants: primary (fire gradient), secondary (glass), ghost (transparent)
- States: default, hover (lift + glow), active (press), disabled (opacity 0.5)
- Sizes: sm, md, lg
- Props: `variant`, `size`, `disabled`, `loading`, `@click`

#### FR-6: CTopbar — Unified Topbar Component

Topbar với blur glass effect.

**Consequences (testable):**
- Blur glass bg: `backdrop-filter: blur(12px)`
- Left: title (h1, 1.5rem, weight 700)
- Right: back link (accent color, underline on hover)
- Optional: accent color override

#### FR-7: CStatCard — Unified Stat Display

Stat card cho dashboard và metrics.

**Consequences (testable):**
- Large value (2.2rem, weight 800, accent color)
- Small label below (0.9rem, muted)
- Icon optional
- Props: `value`, `label`, `icon`, `accentColor`

#### FR-8: CTable — Unified Table Component

Table với hover rows và consistent styling.

**Consequences (testable):**
- Hover row: bg tint với `--forge-glass-hover`
- Borders: subtle `rgba(255,255,255,0.06)` between rows
- Header: weight 600, uppercase label
- Props: `columns`, `data`, `onRowClick`

---

### 4.3 Inner Pages Port to Forge Design

**Description:** Tất cả inner pages (hub pages, dashboard, game pages, interview pages) được port sang Forge Design System. Mỗi hub giữ accent color riêng (định nghĩa trong AD-17 của Architecture).

**Functional Requirements:**

#### FR-9: Hub Pages Unification

5 hub pages (`ai/`, `english/`, `java/`, `cloud/`, `frontend/`) dùng Forge design.

**Consequences (testable):**
- Background: `--forge-bg`
- Cards: glassmorphism CCard style
- Topbar: CTopbar component
- Grid: 2 columns → responsive (1 column on mobile)
- Accent per hub: AI `#f472b6`, English `#34d399`, Java `#f59e0b`, Cloud `#7c5cfc`, Frontend `#60a5fa`

#### FR-10: Dashboard Unification

Dashboard page dùng Forge design.

**Consequences (testable):**
- Background: `--forge-bg`
- Stat cards: CStatCard
- Tables: CTable
- Skill bars: unified progress bar style với `--forge-glass`
- Streak display: circular badges với accent colors

#### FR-11: Game & Interview Pages Unification

Game pages và interview pages dùng Forge design.

**Consequences (testable):**
- Cards: CCard
- Buttons: CButton
- Feedback states: success/error colors từ semantic tokens
- Progress indicators: unified style

---

### 4.4 Animation & Motion System

**Description:** Animation system nhất quán với staggered reveals và micro-interactions. **Philosophy: Light touch** — inner pages dùng subtle animations, không ambient effects.

**Functional Requirements:**

#### FR-12: Page Transition Animations

Pages fade in với subtle translate.

**Consequences (testable):**
- Duration: 0.4s ease
- Keyframes: opacity 0→1, translateY 12px→0
- Applied on `<router-view>` transition

#### FR-13: Card Stagger Animations

Cards appear với staggered delay.

**Consequences (testable):**
- Base delay: 0.05s per card
- Max delay: 0.55s (11th card)
- Keyframes: opacity 0→1, translateY 24px→0, scale 0.97→1

#### FR-14: Micro-interactions

Hover effects và button feedback nhất quán.

**Consequences (testable):**
- Card hover: translateY(-4px) + shadow + border highlight
- Button hover: translateY(-2px) + glow
- Focus states: outline với accent color

#### FR-14.1: Animation Guard (Reduced Motion)

**Consequences (testable):**
- Respects `prefers-reduced-motion: reduce` media query
- Page transitions: instant (no fade)
- Card animations: disabled
- Hover effects: kept but simplified

---

### 4.5 Responsive Unification

**Description:** Responsive breakpoints và behavior nhất quán.

**Functional Requirements:**

#### FR-15: Unified Breakpoints

**Consequences (testable):**
- Desktop: > 1024px (4 columns grid)
- Tablet: 768px - 1024px (3 columns)
- Mobile landscape: 400px - 768px (2 columns)
- Mobile portrait: < 400px (1 column)

#### FR-16: Mobile Touch Optimization

Touch targets và spacing tối ưu cho mobile.

**Consequences (testable):**
- Min touch target: 44px
- Card tap area: full card clickable
- Navigation: accessible hamburger nếu needed

---

## 5. Non-Goals (Explicit)

- **Không redesign logo hoặc brand identity** — giữ nguyên "⚒️ SkillForge" và tagline.
- **Không thêm animation mới** — chỉ unify animation system hiện có.
- **Không thay đổi layout structure** — giữ nguyên navigation flow, chỉ unify visual style.
- **Không thêm dark/light mode toggle** — Forge dark theme là default và duy nhất.
- **Không viết lại logic nghiệp vụ** — chỉ change CSS, không change JS behavior.

## 6. MVP Scope

### 6.1 In Scope

**Phase 1: Hub Pages First (2 sprints)**
- Port 1 hub page as prototype (e.g., `frontend/hub`) để reveal component needs
- Extract/complete component library: CCard, CButton, CTopbar, CStatCard, CTable
- Document design tokens in `forge-design-system.css`
- Port remaining 4 hubs: AI, English, Java, Cloud

**Phase 2: Dashboard & Stats (1 sprint)**
- Dashboard page unified to Forge design
- CStatCard component for metrics
- CTable for data displays

**Phase 3: Game & Interview Pages (1 sprint)**
- Game pages: Memory, Scramble, Speed Quiz
- Interview pages: Interview Hub, Salary Interview, English Interview

### 6.2 Out of Scope for MVP

- Legacy HTML pages (sẽ được xóa khi port hoàn tất)
- New component designs (chỉ unify những gì đã có)
- Mobile-specific redesign (giữ responsive cơ bản)
- Accessibility audit (WCAG compliance)
- Design system documentation site (CSS comments + example file)
- Ember particles và ambient glow effects trên inner pages (chỉ用在 HomePage)

## 7. Success Metrics

**Primary**
- **SM-1**: Visual Consistency Score — 100% inner pages (hubs, dashboard, games, interviews) match Forge design language. Validates FR-9, FR-10, FR-11.
- **SM-2**: Zero contrast shock — user can navigate from HomePage → any inner page without noticing style change. Validates overall goal.

**Secondary**
- **SM-3**: Component reuse rate — >80% of UI elements use shared components (CCard, CButton, CTopbar, etc.). Validates FR-4, FR-5.

**Counter-metrics (do not optimize)**
- **SM-C1**: Số pages ported — đừng đua số. Port 1 page nhanh mà không unify component = 0 tiến triển thật.

**Timeline Target:** 3-4 sprints (6-8 tuần) cho MVP

## 8. Open Questions

1. **Hub accent colors** ✅ DECIDED — giữ per-hub accent theo AD-17. AI `#f472b6`, English `#34d399`, Java `#f59e0b`, Cloud `#7c5cfc`, Frontend `#60a5fa`.
2. **Animation intensity** ✅ DECIDED — Light mode. Chỉ fade-in, stagger, hover effects. Không particles/glow trên inner pages.
3. **Component library size** ✅ DECIDED — Lean (5 components). Thêm khi cần thật.
4. **Legacy CSS files** ✅ DECIDED — xóa `subpage.css` và Legacy CSS files sau khi tất cả pages đã port.
5. **Design system versioning** — dùng date-based versioning (e.g., `forge-v2026-08-05`).

## 9. Assumptions Index

- `[ASSUMPTION]` Forge design language là đúng direction — user đã confirm trong forge session.
- `[ASSUMPTION]` Per-hub accent colors nên giữ theo AD-17 — tạo visual identity riêng cho mỗi hub. ✅ DECIDED.
- `[ASSUMPTION]` Không cần dark/light mode toggle — app là personal tool, single theme acceptable.
- `[ASSUMPTION]` Animation system hiện có (ember particles, ambient glow) chỉ dùng trên HomePage — inner pages dùng staggered fade-in nhẹ. ✅ DECIDED.
- `[ASSUMPTION]` Component library lean (5 components) là đủ — thêm khi cần thật sự. ✅ DECIDED.
- `[ASSUMPTION]` Port 1 hub page prototype trước sẽ reveal component needs thực sự — không over-engineer trước. ✅ DECIDED.
- `[ASSUMPTION]` Timeline 3-4 sprints (6-8 tuần) realistic cho solo dev với full-time job. ✅ DECIDED.

---

## Appendix A: Design Token Reference

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
