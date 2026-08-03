# Development Guide — Vue App (web-app)

**App:** `projects/web-app/` — Vue 3 + Vite

**Phạm vi:** Port từng trang Vanilla → Vue. Giữ nguyên giao diện và hành vi (FR6).

---

## Project Setup

### Stack (pinned, verified npm registry 2026-07-30)

| Package | Version |
|---------|---------|
| vue | 3.5.40 |
| vite | 8.1.5 |
| vue-router | 5.2.0 |
| @vitejs/plugin-vue | 6.0.8 |

```
engines: "^20.19.0 || >=22.12.0"
```

### NO Starter Template
`npm create vue` is **forbidden**. Scaffold by hand per §Structural Seed in architecture spine.

### NO TypeScript
No `.ts` files, no `tsconfig.json`, no `@vue/tsconfig`.

### NO SSR/SSG
No Nuxt or any SSR/SSG framework.

### NO External Component Libraries
No Vuetify, PrimeVue, Element Plus, Naive UI.

---

## §Structural Seed (from architecture spine)

```
src/
  main.js           ← app entry
  App.vue            ← root component
  router/
    index.js        ← Vue Router setup
  pages/
    HomePage.vue    ← ported pages
    ...
  components/
    CCard.vue      ← shared components (C prefix)
    CButton.vue
    CTopbar.vue
    CGrid.vue
    ...
  storage/
    index.js        ← localStorage wrapper
  api/
    index.js        ← centralized API module
  styles/
    main.css        ← token import + reset only
```

---

## AD Rules (must follow)

### AD-1: Layer Dependency
- `pages/` import from `components/` + `storage/` + `api/` + `@legacy/`
- `components/` import **only** tokens
- `storage/`/`api/` import **nothing** from Vue

### AD-2: Single Origin
- No hardcoded host/port in source
- Vite proxy `/api` → API server
- Vite proxy `/pages/**` → Legacy app (for unported pages)
- `grep -r "localhost:8080\|127.0.0.1:8080" src` → **0 results**

### AD-3: @legacy Is One-Way
```js
// vite.config.js
resolve: {
  alias: {
    '@legacy': path.resolve(__dirname, '../web-en')
  }
}
```
- No relative imports like `../web-en/`
- No file copies from Legacy

### AD-4: Framework-Free Logic
`@legacy/features/**` files must **not** import `vue`. Adaptation happens in `pages/`.

### AD-5: No window.* Assignments
No `window.*` assignments in `web-app/`. Functions reading `window.*` must accept parameters with defaults.

### AD-6: Storage Ownership
- One storage, one writer
- Vue reads/writes through Legacy modules via `@legacy/features/…`
- Do NOT create parallel adapters

### AD-7: Ported Page Registry
```js
// src/utils/ported-pages.js
export const PORTED_PAGES = ['/', '/ai/hub', '/java/hub'];
```
- Navigation helper reads this list
- In-list → router, out-of-list → relative path to Legacy

### AD-8: Token Import Only
```js
@import '@legacy/css/variables.css';
/* OR in main.css */
@import '../../web-en/css/variables.css';
```
- **Do NOT copy** tokens to `web-app/`
- **Do NOT** hardcode hex colors in components
- `grep -nE "#[0-9a-fA-F]{3,6}|[0-9]+px" src/components` → **0 results**

### AD-9: Shared Components Are Pure Presentation
- Named by **role**, `C` prefix: `CCard`, `CButton`, `CTopbar`, `CGrid`
- **No** names containing `Home`, `Ai`, `Exam`
- No storage/API/router calls
- Props = nouns, emit = past-tense verbs

### AD-10: Style Isolation
- Shared components carry their own styles
- Page components use `<style scoped>`
- Global CSS = token import + reset **only**

### AD-11: API Through Central Module
```js
// src/api/index.js
export async function chat(agentId, message) {
  const res = await fetch('/api/bmad/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId, message })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```
- No `fetch()` in `components/` or `pages/`
- Network errors **must not** silently pass

### AD-12: Pages Build Shells From Shared Components
```html
<!-- ❌ Bad -->
<div class="page-header">
  <nav>...</nav>
</div>

<!-- ✅ Good -->
<CTopbar title="Java Hub" />
<CGrid>
  <CCard v-for="..." />
</CGrid>
```

### AD-13: Route Keeps Legacy URL Shape
- `/pages/java/hub.html` → `/java/hub`
- Route shape must match Legacy URL structure

### AD-14: Skip 6 Long Content Pages
**Do NOT port:**
- `cloud.html` (1,121 lines, 32 `<pre>`)
- `java/spring-boot.html` (741 lines)
- `java/backend.html` (656 lines)
- `frontend/html-css.html` (160 lines)
- `frontend/frameworks.html` (158 lines)
- `frontend/responsive.html` (128 lines)

**Must port:**
- 5 hubs (ai, english, java, frontend, learning-paths)
- `learning-paths.html`

### AD-16: ESM Import From Legacy Data
```js
// Get data from Legacy
import interviewTopics from '@legacy/data/interview-data.js';
```
- Files without `export` → add one line next to `window.*` assignment
- **Do NOT** use `?raw`, `eval`, or re-declare data

### AD-17: Accent Color Token Override
```html
<!-- Page root overrides accent token -->
<div style="--color-accent: #f59e0b">
  <!-- CCard inherits --color-accent automatically -->
  <CCard />
</div>
```
- Shared component references **one** accent token name
- Page overrides value on its root element
- Do NOT add new tokens per area to shared token file

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Shared components | `CPascalCase.vue` | `CCard.vue` |
| Page components | `PascalCasePage.vue` | `JavaHubPage.vue` |
| JS modules | `kebab-case.js` | `chat-api.js` |
| CSS variables | `--kebab-case` | `--color-accent` |

---

## Identifier Language

- **Identifiers (variables/functions/files):** Tiếng Anh
- **UI strings, comments, error messages:** Tiếng Việt

---

## Acceptance Testing (FR-6)

FR-6 acceptance is **manual** per 5-item checklist:

1. **Block layout** — khối xếp đúng vị trí
2. **Color** — màu khớp
3. **Spacing** — khoảng cách khớp
4. **Font/size** — cỡ/kiểu chữ khớp
5. **Hover state** — trạng thái hover khớp

Compare Legacy vs Vue side-by-side. **No redesign** — any "improvement" is a story fail.

---

## Dev Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
```

---

## Vite Config Essentials

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@legacy': path.resolve(__dirname, '../web-en')
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/pages': 'http://localhost:8080'
    }
    // NO: server.host = true  ← NFR2: dev server only localhost
  }
});
```

---

## §Port Template — Thêm một trang mới

Mỗi trang port gồm 4 bước chính. Đọc khuôn này TRƯỚC KHI bắt đầu port.

### Bước 0 — Phân loại trang

| Loại | Pattern | Ví dụ |
|------|---------|--------|
| **Hub page** | `CTopbar` + `CGrid` + `CHubCard` | JavaHub, English hub, AI hub |
| **Logic page** | `@legacy` logic + localStorage + Markdown | Interview, Review |
| **Hybrid page** | Hub cards + logic content | Dashboard |

**Hub page → dùng pattern JavaHubPage. Logic page → dùng pattern InterviewPage.**

Nếu trang đang ở `HubPlaceholder` → route đã có trong router, chỉ cần thay component.

### Bước 1 — Tạo Page Component

**Vị trí:** `src/pages/<PascalName>Page.vue`

Pattern hub page (cấu trúc chuẩn):

```vue
<template>
  <div class="page-root">
    <div class="container">
      <CTopbar
        title="☕ Java"
        back-label="← Trang chủ"
        @go-home="handleNavigate('/')"
      />
      <p class="hub-description">Mô tả hub.</p>
      <CGrid>
        <CHubCard
          v-for="card in cards"
          :key="card.title"
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
          :path="card.path"
          @navigate="handleNavigate"
        />
      </CGrid>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';
import CGrid from '../components/CGrid.vue';
import CHubCard from '../components/CHubCard.vue';

const cards = [
  {
    icon: '💻',
    title: 'Học Code',
    description: 'Mô tả',
    path: '/code-learn',
  },
];

export default {
  name: 'XxxPage',
  components: { CTopbar, CGrid, CHubCard },
  methods: {
    handleNavigate(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
/* Hub page: không cần CSS mới nếu dùng CTopbar + CGrid + CHubCard */
</style>
```

**AD rules áp dụng:**
- **AD-12:** Không markup riêng — dùng `CTopbar`/`CGrid`/`CHubCard`
- **AD-9:** Tên component theo role, không chứa tên trang (`CHubCard` thay vì `EnglishCard`)
- **AD-17:** Override `--color-accent` trên `.page-root` để đổi màu nhấn (VD: `style="--color-accent: #34d399"` cho English hub)
- **AD-10:** `<style scoped>`, không import CSS file mới
- **AD-8:** Không hex cứng trong CSS

### Bước 2 — Thêm Route

**File:** `src/router/index.js`

```js
{
  path: '/xxx/hub',
  name: 'xxx-hub',
  component: () => import('../pages/XxxPage.vue'),
},
```

**AD-1:** Route trong `pages/` import component → đúng layer boundary.

### Bước 3 — Thêm Registry

**File:** `src/utils/ported-pages.js`

```js
export const PORTED_PAGES = [
  // ... existing entries
  '/xxx/hub',
];

export const PORTED_PAGE_LABELS = {
  // ... existing entries
  '/xxx/hub': 'Tên hiển thị',
};
```

**AD-7:** Navigation helper đọc PORTED_PAGES → trong-danh-sách → router, ngoài → Legacy.

### Bước 4 — Thêm Link (nếu cần)

Trên trang chủ hoặc hub cha, thêm entry vào `homeCards` (HomePage) hoặc `cards` array (hub cha).

Dùng `navigate(path)` từ helper, không `$router.push` trực tiếp.

---

### AD Mapping tổng hợp

| Bước | AD | Quy tắc |
|------|----|---------|
| B1 | AD-12 | `CTopbar`/`CGrid`/`CHubCard` — không markup riêng |
| B1 | AD-9 | Tên component theo role, không chứa tên trang |
| B1 | AD-17 | Override `--color-accent` trên root element |
| B1 | AD-10 | `<style scoped>`, 0 CSS file mới |
| B1 | AD-8 | Không hex cứng, dùng token |
| B2 | AD-1 | Layer boundary: pages/ import components/ |
| B3 | AD-7 | PORTED_PAGES + navigate helper |
| B4 | — | Dùng `navigate()` từ helper |

---

### Legacy Data & Logic

#### Data (AD-16)

| Tình huống | Xử lý |
|------------|--------|
| Data nằm trong HTML cứng | Hardcode inline trong Vue component |
| Data nằm trong JS file | Import qua `@legacy/js/data/<file>.js` — thêm `export` nếu chưa có |
| Data cần regenerate | Sửa build script giữ `export` |

```js
// Thêm export VÀO CUỐI file data (sau window.* = ...)
export const dataName = window.dataName;

// Import trong Vue
import { dataName } from '@legacy/js/data/<file>.js';
```

#### Logic (AD-5)

| Tình huống | Xử lý |
|------------|--------|
| Logic không đọc `window.*` | Import trực tiếp qua `@legacy/features/...` |
| Logic đọc `window.*` | Sửa signature: `fn(data)` với default `window.*` |
| Logic ghi localStorage | Dùng `toggleXxx()` từ `@legacy`, không tạo adapter riêng |

```js
// Sửa signature AD-5:
// TRƯỚC:
export function getData() { return window.data; }

// SAU:
export function getData(data) { return data || window.data; }
```

---

### Five-Point UI Comparison (FR-6 / NFR5)

Sau khi port xong, so sánh **Legacy vs Vue side-by-side**:

1. **Block layout** — khối xếp đúng vị trí
2. **Color** — màu khớp (dùng CSS token, không hex cứng)
3. **Spacing** — khoảng cách khớp
4. **Font/size** — cỡ/kiểu chữ khớp
5. **Hover state** — trạng thái hover khớp

---

### Timing Template

Ghi lại thời gian thực tế sau khi port:

```
| Bước | Estimate | Actual | Notes |
|-------|----------|--------|-------|
| Setup | 10p | — | — |
| Page component | 30p | — | — |
| Route + registry | 5p | — | — |
| Test (FR-6) | 15p | — | — |
| Total | 60p | — | — |
```

---

### Checklist trước khi commit

- [ ] Build pass: `npm run build`
- [ ] 0 CSS file mới được tạo
- [ ] 0 component mới được tạo
- [ ] Không hex cứng trong `<style>`
- [ ] Route + registry đã cập nhật
- [ ] Link đã thêm vào trang cha (nếu cần)
- [ ] FR-6 five-point comparison done
