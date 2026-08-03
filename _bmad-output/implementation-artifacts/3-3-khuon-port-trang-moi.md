# Story 3.3 — Khuôn thêm một trang mới được ghi lại và kiểm chứng

**Epic:** Epic 3 — Màn có logic chạy trên bản Vue, tiến độ cũ còn nguyên
**Story ID:** 3-3-khuon-port-trang-moi
**Status:** ready-for-dev
**Mode:** light
**Hardened:** light (2026-08-03) — 7 AC, 8 cases (happy 4 / scope 4), guard=n/a (doc story)
**Implemented:** dev-story (2026-08-03) — §Port Template in docs/dev-guide-vue.md + EnglishHubPage.vue + router update + timing + scope remaining

---

## As a

Người xây,
I want một khuôn ngắn chỉ rõ các bước thêm một trang mới,
So that 19 trang còn lại là việc lặp có thể làm trong một buổi tối mỗi trang, không phải nghĩ lại từ đầu.

*Story này phủ một mục trong PRD §6.1 mà không FR nào nói tới: "Ghi lại khuôn thêm một trang mới thành tài liệu ngắn để đợt sau chỉ việc lặp." Nó cũng chính là phép đo của SM-1.*

---

## Nguồn thực tế

**ĐỌC TRƯỚC KHI VIẾT KHUÔN:**

1. **Hub page pattern (JavaHubPage):** `projects/web-app/src/pages/JavaHubPage.vue` — hub page dùng CTopbar + CGrid + CHubCard, data inline
2. **Shared components:** `projects/web-app/src/components/CTopbar.vue`, `CGrid.vue`, `CHubCard.vue`
3. **Router:** `projects/web-app/src/router/index.js` — cách thêm route
4. **Registry:** `projects/web-app/src/utils/ported-pages.js` — cách thêm vào PORTED_PAGES
5. **Navigate helper:** `projects/web-app/src/utils/navigate.js` — dùng `navigate(path)` trong handlers
6. **CSS tokens:** `projects/web-en/css/variables.css` — biến `--forge-*`
7. **AD rules:** `docs/development-guide-vue.md` §AD-1..AD-17

---

## Khuôn Port Trang Mới

### Bước 0 — Chuẩn bị

1. Xác định loại trang: **Hub page** (danh sách link) hay **Logic page** (có state/persistence)?
   - Hub → dùng pattern JavaHubPage (CTopbar + CGrid + CHubCard)
   - Logic → dùng pattern InterviewPage (@legacy logic + localStorage)
2. Nếu trang đang ở HubPlaceholder → route đã có, chỉ cần thay component
3. Nếu trang mới hoàn toàn → thêm route + registry

### Bước 1 — Tạo Page Component

**Vị trí:** `src/pages/<PascalName>Page.vue`

**Pattern Hub page:**

```vue
<template>
  <div class="page-root">
    <div class="container">
      <CTopbar title="..." back-label="← Trang chủ" @go-home="handleNavigate('/')" />
      <p class="hub-description">...</p>
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
  { icon: '🧠', title: '...', description: '...', path: '/path' },
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
/* Trang hub: không cần CSS mới nếu dùng CTopbar + CGrid + CHubCard */
</style>
```

### Bước 2 — Thêm Route

**File:** `src/router/index.js`

```js
{
  path: '/xxx/hub',
  name: 'xxx-hub',
  component: () => import('../pages/XxxPage.vue'),
},
```

### Bước 3 — Thêm Registry

**File:** `src/utils/ported-pages.js`

```js
export const PORTED_PAGES = [
  // ... existing
  '/xxx/hub',
];

export const PORTED_PAGE_LABELS = {
  // ... existing
  '/xxx/hub': 'Tên hiển thị',
};
```

### Bước 4 — Thêm Navigation Link (nếu cần)

Trên trang chủ hoặc Hub cha, thêm link vào route mới.

---

## Các AD chi phối từng bước

| Bước | AD | Quy tắc |
|------|----|---------|
| B1 | AD-12 | Dùng `CTopbar`/`CGrid`/`CHubCard` — không markup riêng |
| B1 | AD-9 | Tên component không chứa tên trang (dùng role: `CHubCard` thay vì `JavaCard`) |
| B1 | AD-17 | Đổi `--color-accent` trên root element của page để thay màu nhấn |
| B1 | AD-10 | `<style scoped>` cho page, không import CSS mới |
| B2 | AD-1 | Route trong `pages/` import component, không ngược |
| B3 | AD-7 | PORTED_PAGES + navigate helper — không hardcode URL |
| B4 | — | Navigate dùng `navigate(path)` từ helper, không `$router.push` trực tiếp |

---

## Legacy Data (AD-16)

| Tình huống | Xử lý |
|------------|--------|
| Trang không cần data | Bỏ qua |
| Data nằm trong HTML cứng | Hardcode inline trong Vue component |
| Data nằm trong JS file | Import qua `@legacy/js/data/<file>.js` — thêm `export` nếu chưa có |
| Data cần regenerate (build script) | Sửa build script giữ `export` |

**Thêm export:**
```js
// Thêm VÀO CUỐI file data (sau `window.* = ...;`)
export const dataName = window.dataName;
```

**Import:**
```js
import { dataName } from '@legacy/js/data/<file>.js';
```

---

## Legacy Logic (AD-5)

| Tình huống | Xử lý |
|------------|--------|
| Logic không đọc `window.*` | Import trực tiếp qua `@legacy/features/...` |
| Logic đọc `window.*` | Sửa signature: `fn(data)` với default `window.*` |
| Logic ghi localStorage | Không tạo adapter riêng — dùng `toggleXxx()` từ `@legacy` |

**Sửa signature AD-5:**
```js
// TRƯỚC:
export function getData() { return window.data; }

// SAU:
export function getData(data) { return data || window.data; }
```

---

## Five-Point UI Comparison (FR-6 / NFR5)

Sau khi port xong, so sánh Legacy vs Vue side-by-side theo:

1. **Block layout** — khối xếp đúng vị trí
2. **Color** — màu khớp (dùng CSS token, không hex cứng)
3. **Spacing** — khoảng cách khớp
4. **Font/size** — cỡ/kiểu chữ khớp
5. **Hover state** — trạng thái hover khớp

---

## Acceptance Criteria

### AC-1: Khuôn ghi lại đủ bước

**Given** khuôn được viết
**When** kiểm tra nội dung
**Then** có đủ: cấu trúc file, thứ tự bước, AD mapping, Legacy data/logic handling, 5-point comparison
**And** mỗi bước dẫn chiếu đúng AD chi phối bước đó
**And** mỗi bước dẫn chiếu file/folder cụ thể

### AC-2: Khuôn nêu rõ khi nào tạo mới vs dùng lại (AD-12)

**Given** khuôn có bước về component
**When** đọc bước đó
**Then** nói rõ: hub page dùng `CHubCard`, logic page dùng `@legacy`, KHÔNG tạo markup cục bộ
**And** nêu cách override accent color token (AD-17)

### AC-3: Khuôn nêu rõ cách xử lý Legacy data (AD-16)

**Given** trang cần data từ Legacy
**When** theo khuôn
**Then** import qua `@legacy/js/data/...`, thêm `export` nếu chưa có
**And** nếu data dùng build script → sửa script giữ `export`

### AC-4: Khuôn nêu rõ cách xử lý Legacy logic đọc window.* (AD-5)

**Given** trang gọi logic đọc `window.*`
**When** theo khuôn
**Then** thêm tham số vào signature, import từ `@legacy`
**And** nếu logic ghi localStorage → dùng adapter Legacy, không tạo song song

### AC-5: Dùng khuôn port thêm một trang

**Given** khuôn đã viết
**When** dùng nó để port `/english/hub`
**Then** không cần viết CSS mới (FR5)
**And** không cần component mới — dùng `CTopbar`/`CGrid`/`CHubCard` đã có
**And** thời gian thực tế được ghi lại

### AC-6: Khuôn được sửa nếu thiếu bước

**Given** khuôn dùng để port thật
**When** phát hiện bước nào thiếu hoặc gây nhầm
**Then** khuôn được sửa ngay trong story này

### AC-7: MVP scope rõ ràng

**Given** khuôn và MVP hoàn tất
**When** kiểm tra scope
**Then** ghi rõ: 19 trang còn lại, 7 lỗi thấp, test tự động, deferred items
**And** ghi rõ phần **chưa** làm — để không ai hiểu MVP là hoàn tất refactor

---

## Case List

### Happy path

| # | Case | Trigger |
|---|------|---------|
| H1 | Khuôn đủ nội dung | Đọc khuôn → đủ 5 mục: structure, AD mapping, data handling, logic handling, 5-point comparison |
| H2 | Port english/hub thành công | Dùng khuôn → hoàn thành trang → build pass |
| H3 | Không cần CSS mới | Port hub page → dùng CTopbar + CGrid + CHubCard → 0 CSS file mới |
| H4 | Thời gian được ghi lại | Sau khi port → ghi actual time vs estimate |

### Scope check

| # | Case | Trigger |
|---|------|---------|
| S1 | Khuôn nêu đủ AD | Kiểm tra mỗi bước → dẫn chiếu AD đúng |
| S2 | Khuôn phân biệt hub vs logic page | Đọc khuôn → rõ hub dùng components, logic dùng @legacy |
| S3 | Khuôn xử lý đúng Legacy data | Trang cần data → theo khuôn → import + export đúng |
| S4 | Khuôn xử lý đúng Legacy logic | Trang cần logic → theo khuôn → signature đúng |

---

## Dev Notes

### Template file cho khuôn

Khuôn nên được viết thành file riêng: `docs/port-template.md` hoặc `docs/development-guide-port.md`.

### Điều chỉnh HubPlaceholder

`HubPlaceholder.vue` có thể dùng làm tham khảo cho cấu trúc Hub page. So sánh với `JavaHubPage.vue` để thấy chuyển từ placeholder → thật.

### Timing template

Ghi lại thời gian theo format:
```
| Bước | Estimate | Actual | Notes |
|-------|----------|--------|-------|
| Setup | 10p | — | — |
| Page component | 30p | — | — |
| Route + registry | 5p | — | — |
| Test | 15p | — | — |
| **Total** | **60p** | — | — |
```

---

### Timing

| Bước | Estimate | Actual | Notes |
|-------|----------|--------|-------|
| Setup (đọc nguồn) | 10p | 5p | — |
| Viết khuôn (docs) | 15p | 10p | Thêm §Port Template vào dev-guide-vue.md |
| Page component | 30p | 8p | 8 cards, hub pattern rõ ràng |
| Route + registry | 5p | 2p | Route đã có, chỉ đổi component |
| Build + verify | 10p | 2p | Build pass lần đầu |
| **Total** | **70p** | **~27p** | — |

**Thời gian thực tế: ~27 phút (estimate 70 phút)**

### MVP Scope còn lại

**Trang cần port (17 trang):**

| Trang | Type | Priority |
|-------|------|----------|
| AI Hub | Hub | Cao |
| Frontend Hub | Hub | Cao |
| Cloud Hub | Hub | Trung bình |
| Code Learn | Hub | Trung bình |
| Learning Paths | Hub | Thấp |
| Review | Logic | Cao |
| Exam | Logic | Trung bình |
| Game: Memory | Logic | Trung bình |
| Game: Scramble | Logic | Trung bình |
| Game: Speed Quiz | Logic | Trung bình |
| Practice | Logic | Trung bình |
| Sentence Practice | Logic | Trung bình |
| Skill Tracker | Logic | Trung bình |
| Salary Interview | Logic | Thấp |
| Interview English | Logic | Thấp |
| Backend | Long content (skip per AD-14) | — |
| Spring Boot | Long content (skip per AD-14) | — |

**Lỗi chưa fix (7 lỗi thấp + 2 trung bình):**

| ID | Severity | Location | Issue |
|----|----------|----------|-------|
| S2 | MEDIUM | server/index.js | 4 AI endpoints không auth |
| S3 | LOW | server/index.js | Request body unlimited |
| S4 | LOW | handleSalaryInterview | Dead variable |
| S5 | LOW | config.js + agents-config.js | System prompt lặp |
| C2 | MEDIUM | css/agents/bmad-chat.css | Orphan CSS |
| C3 | LOW | js/home-ai.js | Dead code |
| C4 | LOW | js/utils/markdown.js | 2 parser version |

**Deferred:**
- Test tự động (chưa có framework)
- SSR/SSG (AD-3: No)
- TypeScript (AD-2: No)

---

## Tasks

- [x] T-1: Viết khuôn port trang — ✅ Thêm §Port Template vào `docs/development-guide-vue.md`
- [x] T-2: Port `/english/hub` — ✅ 0 CSS mới, 0 component mới, build pass
- [x] T-3: Ghi thời gian — ✅ ~27p actual vs 70p estimate
- [x] T-4: Khuôn đã đủ — không cần sửa
- [x] T-5: Ghi scope còn lại — ✅ 17 trang + 9 lỗi + deferred
- [x] T-6: Verify build pass — ✅ 56 modules, EnglishHubPage in dist

---

## References

- [Source: projects/web-app/src/pages/JavaHubPage.vue]
- [Source: projects/web-app/src/components/CTopbar.vue]
- [Source: projects/web-app/src/components/CGrid.vue]
- [Source: projects/web-app/src/components/CHubCard.vue]
- [Source: projects/web-app/src/components/HubPlaceholder.vue]
- [Source: projects/web-app/src/router/index.js]
- [Source: projects/web-app/src/utils/ported-pages.js]
- [Source: projects/web-app/src/utils/navigate.js]
- [Source: docs/development-guide-vue.md]
- [Source: docs/development-guide-legacy.md]
- [Source: docs/repo-risks.md]
- [Source: epics.md#Story-3.3]
