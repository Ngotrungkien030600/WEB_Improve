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
