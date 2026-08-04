# Story 5.2: Port AI Hub page (thay HubPlaceholder)
## Header

- **Epic:** 5 — Complete Vue Port (final 3 pages)
- **Story ID:** 5.2
- **Status:** ready-for-dev
- **Hardened:** light (2026-08-03) — 4 AC, 25 cases (verified)

**Implemented:** dev-story (2026-08-03) — 3 files (AiHubPage.vue, router/index.js, ai-data.js)
**Code-Reviewed:** 2026-08-04 — 0 🔴, 1 🟡 (R8: ~30 hardcoded hex in scoped CSS — accepted, see Epic 6)
- **Created:** 2026-08-03

---

## User Story

As a người dùng,
I want truy cập trang AI Hub với 4 tabs (Học flashcard, Thi trắc nghiệm, Phỏng vấn, Làm Project) trên bản Vue,
So that học AI/ML mà không cần quay về bản Legacy.

---

## Acceptance Criteria

### AC1: AI Hub page với 4 tabs hoạt động đúng

**Given** AI Hub đã port sang Vue (thay HubPlaceholder)
**When** người dùng mở `/ai/hub`
**Then** hiển thị 4 tabs: Học, Thi, Phỏng vấn, Làm Project
**And** tab đầu (Học) active mặc định
**And** bấm tab → switch section đúng

### AC2: Learn tab (flashcard)

**Given** Learn tab active
**When** người dùng xem flashcard
**Then** hiển thị category filter (All, ML, DL, NLP, CV, GenAI)
**And** flashcard với front (tiếng Anh), back (tiếng Việt + definition + example)
**And** nút Prev/Flip/Next hoạt động
**And** counter "1 / 30"
**And** spaced repetition data được preserve

### AC3: Quiz tab

**Given** Quiz tab active
**When** người dùng bấm "Bắt đầu"
**Then** hiển thị quiz với timer bar, question, 4 options
**And** khi hết thời gian hoặc chọn đáp án → hiển thị feedback
**And** hiển thị score stats (Đúng, Tổng, %, Trình độ)
**And** config: số câu (5/10/15), thời gian (10/15/20/30s)

### AC4: Interview tab

**Given** Interview tab active
**When** người dùng chọn chủ đề
**Then** hiển thị sidebar với danh sách chủ đề + progress
**And** main content với nội dung câu hỏi/phần trả lời
**And** progress tracking được lưu

---

## Technical Notes

### Legacy Files

- `web-en/pages/ai.html` — page source (179 lines, 4 sections)
- `web-en/js/data/ai-data.js` — AI vocabulary flashcard data (30+ cards)
- `web-en/js/data/data-meta.js` — category metadata (đã đọc, có export)
- `web-en/js/data/spaced-repetition.js` — SRS system (đã đọc, có export)
- `web-en/js/data/progress-db.js` — progress tracking (đã đọc, có export)
- `web-en/js/utils/timer.js` — forge timer
- `web-en/js/ai-app.js` — main app logic

### Data Layer (AD-16)

```js
// Thêm export vào cuối file nếu chưa có:
// window.aiCards = [...];
// export const aiCards = window.aiCards;
```

Import trong Vue:
```js
import { aiCards } from '@legacy/js/data/ai-data.js';
import { srsSystem } from '@legacy/js/data/spaced-repetition.js';
import { progressDB } from '@legacy/js/data/progress-db.js';
import { dataMeta } from '@legacy/js/data/data-meta.js';
```

### Key Components

**Flashcard state:**
```js
{
  currentIndex: 0,
  isFlipped: false,
  selectedCategory: 'all',
  totalCards: 30
}
```

**Quiz state:**
```js
{
  questions: [],      // shuffled from ai-data
  currentQ: 0,
  score: 0,
  timeLeft: 15,
  isActive: false,
  answers: []
}
```

**Timer ring (ForgeTimer):**
- Dùng `ForgeTimer.vue` component đã có trong web-app
- Hoặc preserve inline timer ring SVG từ `ai.html`

### Strategy

- **Loại trang:** Logic page — complex state management, multiple tabs
- 4 sections: Learn, Quiz, Interview, Projects
- Preserve flashcard flip animation (CSS 3D transform)
- Preserve quiz timer (SVG ring animation)
- Dùng existing components: CTopbar, ForgeTimer (nếu tương thích)

---

## Files to Create/Modify

### Create
- `src/pages/AiHubPage.vue` — main page component
- Hoặc chia thành sub-components nếu cần:
  - `src/components/ai/AiFlashcard.vue`
  - `src/components/ai/AiQuiz.vue`
  - `src/components/ai/AiInterview.vue`
  - `src/components/ai/AiProjects.vue`

### Modify
- `src/router/index.js` — thay HubPlaceholder bằng AiHubPage tại route `/ai/hub`
- `src/utils/ported-pages.js` — entry `'/ai/hub'` đã có (không cần thêm)
- `web-en/js/data/ai-data.js` — thêm ESM export (AD-16)

---

## Non-Functional Requirements

- **NFR1:** Legacy app luôn chạy được — không sửa ai.html
- **NFR2:** Preserve data layer từ `web-en/js/data/`
- **AD-8:** Không hex cứng — dùng CSS tokens
- **AD-10:** `<style scoped>` cho page và sub-components
- **AD-17:** Accent token override (`--color-accent: #764ba2` — purple theme)

---

## Dev Agent Guardrails

### ✅ PHẢI LÀM
- Preserve flashcard flip animation (CSS transform: rotateY)
- Preserve quiz timer ring animation (SVG stroke-dashoffset)
- Preserve spaced repetition logic từ `srsSystem`
- Preserve category filter cho flashcard
- Preserve quiz config (số câu, thời gian)
- Preserve progress tracking qua IndexedDB

### ❌ KHÔNG ĐƯỢC LÀM
- Không tạo sub-components mới trong `components/` trừ khi cần reuse nhiều trang
- Không copy data — dùng `@legacy` import
- Không hex cứng
- Không tạo CSS file mới

### 🎯 Priority Order
1. Learn tab (flashcard) — core feature
2. Quiz tab — interactive feature
3. Interview tab — content display
4. Projects tab — grid display
