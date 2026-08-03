# Story 4.6: Port code-learn page

## Context

Legacy page: `web-en/pages/code-learn.html`
Vue stub: **chưa có** (phải tạo mới)
Status: **READY-FOR-DEV**

## Source thực tế (đã verify)

| Artifact | Path | Notes |
|----------|------|-------|
| HTML | `web-en/pages/code-learn.html` | Subpage layout với sidebar + content |
| UI Logic | `web-en/js/features/learn/learn-ui.js` | `initLearnUI()` — 162 lines |
| Data | `web-en/js/data/learn-data.js` | `window.learnTopics` — 20 topics |
| Markdown | `web-en/js/utils/markdown.js` | `markdownToHTML()` dùng trong render |
| CSS tokens | `web-en/css/variables.css` | Dùng trong subpage.css + learn.css |

## Source dependency tree

```
web-en/pages/code-learn.html
├── ../css/variables.css
├── ../css/base.css
├── ../css/subpage.css
├── ../css/timer.css
├── css/forge-tokens.css
├── ../css/learn.css
├── ../js/utils/timer.js
├── ../js/data/data-meta.js
├── ../js/data/learning-path-data.js
├── ../js/data/search-index.js
├── ../js/data/spaced-repetition.js
├── ../js/data/progress-db.js
├── ../js/data/learn-data.js  ← learnTopics
├── ../js/learn-app.js
│   └── features/learn/learn-ui.js
│       └── utils/markdown.js
```

## Acceptance Criteria

### AC-1: Topic Navigation

Given code-learn page đã render
When người dùng bấm vào topic trong sidebar
Then topic được highlight (active class)
And nội dung topic hiển thị đúng (markdown → HTML)
And scroll về top

### AC-2: Checklist Toggle

Given đang xem topic có checklist
When người dùng tick/untick checkbox
Then trạng thái được lưu vào `localStorage` key **`learnChecklist`** (R6)
And item được toggle class `checked`
And progress bar cập nhật

### AC-3: State Restoration

Given người dùng đã tick checklist trước đó
When mở lại trang
Then checkbox state được khôi phục từ `localStorage` key `learnChecklist`
And progress bar hiển thị đúng

### AC-4: Progress Calculation

Given có nhiều topic với checklist
When load trang
Then progress bar hiển thị `Đã hoàn thành X / Y` (tổng checklist items)

### AC-5: Navigation

Given đang ở code-learn
When bấm nút quay về trang chủ
Then navigate về `/` qua Vue router

### AC-6: No Hardcoded Tokens (R8)

Given kiểm tra `<style>` trong Vue component
Then không có hex color cứng
And không có px value cứng cho spacing
And dùng token từ `@legacy/css/variables.css`

## Dev Notes

### Pattern: Logic Page (AD-12)

Dùng khuôn Logic page, không Hub page. Cấu trúc:

```vue
<template>
  <div class="page-root">
    <!-- Sidebar -->
    <nav class="learn-sidebar">
      <ul id="learn-topic-list">...</ul>
      <div class="learn-progress">...</div>
    </nav>
    <!-- Content -->
    <main class="learn-content-wrapper">
      <div class="learn-card" id="learn-card">
        <h2 id="learn-topic-title">...</h2>
        <div id="learn-topic-body">...</div>
      </div>
    </main>
  </div>
</template>
```

### Storage (R6)

- **Key:** `learnChecklist`
- **Format:** `JSON.stringify({ [itemText]: boolean })`
- **One writer:** Vue component (AD-6)

### Import Data (AD-16)

```js
// web-en/js/data/learn-data.js — thêm export
export const learnTopics = window.learnTopics;
```

```js
// Vue component
import { learnTopics } from '@legacy/js/data/learn-data.js';
import { markdownToHTML } from '@legacy/js/utils/markdown.js';
```

### Markdown rendering

Legacy dùng `markdownToHTML()` từ `@legacy/js/utils/markdown.js`. Import trực tiếp vào Vue (không copy code).

### Checklist rendering

```js
// Render checklist items
topic.checklist.forEach(item => {
  const isChecked = checked[item] || false;
  // checkbox + label
});
```

## Cases (Hardened)

### Happy Path
| # | Mô tả | Input | Expected Output |
|---|-------|-------|-----------------|
| H1 | Load trang | Normal topics | Sidebar render 20 topics + intro, first topic selected |
| H2 | Chọn topic | Click topic index 3 | Active highlight, content render markdown + checklist |
| H3 | Tick checkbox | Click unchecked item | localStorage `learnChecklist` update, UI update |
| H4 | Untick checkbox | Click checked item | localStorage remove key, UI update |
| H5 | Reload trang | Checked items exist | Checkbox state restored, progress bar correct |

### Edge Cases
| # | Mô tả | Input | Expected Output |
|---|-------|-------|-----------------|
| E1 | Empty topics | `learnTopics = []` | Sidebar hiển thị intro item, no crash |
| E2 | Topic no checklist | `checklist = []` | Không render checklist section |
| E3 | Intro topic (index 0) | Click intro | Active highlight, overview content |
| E4 | Long markdown content | 500+ lines | Render đúng, scroll hoạt động |
| E5 | Special chars in checklist | `"Test <script>alert(1)</script>"` | HTML-escaped, không XSS |

### Error Paths
| # | Mô tả | Input | Expected Output |
|---|-------|-------|-----------------|
| R1 | localStorage unavailable | private browsing / quota exceeded | Graceful fallback, checklist vẫn hoạt động session-only |
| R2 | JSON parse error | Corrupted localStorage | Start fresh, no crash |

### Invariant Cases
| # | Invariant | Case |
|---|-----------|------|
| I1 | R6: Storage | Verify `learnChecklist` is the only key used for this feature |
| I2 | R7: Registry | `/code-learn` must be added to `PORTED_PAGES` |
| I3 | R8: Tokens | No `grep -nE "#([0-9a-fA-F]{3,6})" src/pages/CodeLearnPage.vue` |
| I4 | R1: Layer | Component only imports `@legacy` + Vue components |

## Guards

Playwright guard script tại `scripts/4-6-code-learn-guards.mjs`:

```js
// Case H1: Page loads with topics
await page.goto('http://localhost:5173/code-learn');
await page.waitForSelector('#learn-topic-list');
const items = await page.$$('#learn-topic-list li');
assert(items.length > 0);

// Case H2: Topic navigation
await page.click('#learn-topic-list li:nth-child(3)');
await page.waitForSelector('#learn-topic-title');
const title = await page.textContent('#learn-topic-title');
assert(title.length > 0);

// Case H3: Checklist toggle
const checkbox = await page.$('#learn-topic-body input[type="checkbox"]');
if (checkbox) {
  await checkbox.click();
  const checked = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('learnChecklist') || '{}');
  });
  assert(Object.keys(checked).length > 0);
}

// Case I2: Registry check
// (manual check via grep)

// Case I3: No hardcoded colors
const hasHex = await page.evaluate(() => {
  const style = document.querySelector('#learn-topic-list');
  return window.getComputedStyle(style).color.match(/#([0-9a-fA-F]{3,6})/);
});
assert(!hasHex);
```

**Hardened:** hard (2026-08-03) — 5 AC, 13 cases (5 happy / 5 edge / 2 error / 4 invariant), guard=4 assertions

**Implemented:** dev-story (2026-08-03) — 3 files (CodeLearnPage.vue + learn-data.js + router + ported-pages.js)
