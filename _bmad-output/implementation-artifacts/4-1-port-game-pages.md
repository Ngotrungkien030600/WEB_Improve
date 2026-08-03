# Story 4.1: Port 3 game pages (memory, scramble, speedquiz)

## Header

- **Epic:** 4 — Port toàn bộ 23 trang còn lại
- **Story ID:** 4.1
- **Status:** review
- **Hardened:** hard (2026-08-03) — 25 cases (14 happy/5 edge/1 error/5 invariant), guard=25 assertions
- **Implemented:** dev-story (2026-08-03)

---

## Case List Summary

### Happy Path (14 cases)
- **Memory:** H1 flip, H2 match, H3 mismatch, H4 game over
- **Scramble:** H5 click letter, H6 correct, H7 wrong, H8 next word, H9 game over
- **SpeedQuiz:** H10 start, H11 correct, H12 wrong, H13 timeout
- **Navigation:** H14 back to hub

### Edge Cases (5 cases)
- **Memory:** E1 double click, E2 click while locked
- **Scramble:** E3 empty answer, E4 all letters
- **SpeedQuiz:** E5 click during feedback

### Error Cases (1 case)
- **L1:** Missing legacy data graceful handling

### Invariant Cases (5 cases)
- **I1:** R1 Layer boundary (pages/→components/)
- **I2:** R5 No window.* assignments
- **I3:** R7 Ported registry (3 routes)
- **I4:** R8 Token import (no hex)
- **I5:** R4 Framework-free logic (@legacy)
- **Created:** 2026-08-03

---

## User Story

As a người dùng,
I want chơi được 3 game (memory, scramble, speedquiz) trên bản Vue,
So that không cần quay về bản Legacy để chơi game.

---

## Acceptance Criteria

### AC1: Memory Game hoạt động đúng

**Given** memory game đã port sang Vue
**When** người dùng mở game từ hub
**Then** hiển thị lưới thẻ với các icon/cặp
**And** click vào thẻ lật thẻ lên
**And** click vào 2 thẻ giống nhau → thẻ biến mất hoặc đánh dấu
**And** click vào 2 thẻ khác nhau → thẻ úp xuống lại
**And** hoàn thành tất cả cặp → hiển thị thông báo chiến thắng

### AC2: Scramble Game hoạt động đúng

**Given** scramble game đã port sang Vue
**When** người dùng mở game
**Then** hiển thị từ đã xáo trộn chữ cái
**And** người dùng nhập đáp án đúng → hiển thị đúng
**And** người dùng nhập sai → hiển thị thông báo sai
**And** có thể nhận hint (hiện 1 chữ cái)

### AC3: Speed Quiz Game hoạt động đúng

**Given** speed quiz đã port sang Vue
**When** người dùng bắt đầu game
**Then** hiển thị câu hỏi với timer đếm ngược
**And** người dùng chọn đáp án đúng → cộng điểm
**And** hết giờ hoặc chọn sai → mất điểm hoặc kết thúc
**And** kết thúc → hiển thị điểm số

### AC4: Điểm số được lưu đúng

**Given** game đã chơi xong và có điểm số
**When** game ghi điểm vào localStorage
**Then** dùng đúng key theo Legacy (R6: storage ownership)
**And** khi reload trang → đọc được điểm cũ (nếu game có high score)

### AC5: Điều hướng hoạt động

**Given** game pages đã port
**When** từ hub bấm vào game card
**Then** điều hướng qua Vue router (/game-memory, /game-scramble, /game-speedquiz)
**And** bấm "Quay về" → về hub đúng

### AC6: UI khớp Legacy (FR-6 five-point check)

**Given** game đang chạy trên Vue
**When** so sánh với Legacy
**Then** Block layout: khối xếp đúng vị trí
**And** Color: màu khớp (dùng token)
**And** Spacing: khoảng cách khớp
**And** Font/size: cỡ/kiểu chữ khớp
**And** Hover state: trạng thái hover khớp

---

## Technical Notes

### Game Logic Pattern

Các game pages có logic phức tạp hơn hub pages. Pattern:

```vue
<template>
  <div class="game-page">
    <CTopbar title="🎮 Memory Game" @go-home="navigate('/')" />
    <div class="game-container">
      <!-- Game UI từ legacy -->
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';
// Import game logic từ Legacy
import { initGame, saveScore } from '@legacy/features/game-memory.js';

export default {
  name: 'GameMemoryPage',
  components: { CTopbar },
  mounted() {
    initGame(this.$el.querySelector('.game-container'));
  },
  methods: {
    navigate,
  },
};
</script>
```

### R6 - Storage Keys

Các game cần kiểm tra localStorage keys:
- Memory: `memoryHighScore` hoặc tương tự
- Scramble: `scrambleHighScore` hoặc tương tự
- SpeedQuiz: `speedQuizHighScore` hoặc tương tự

Kiểm tra trong source file trước khi implement.

### R2 - Proxy Setup

Vite proxy đã cấu hình trong story 2.1:
- `/api` → API server
- `/pages/**` → Legacy app

Game pages không cần API call đặc biệt.

---

## Files to Create/Modify

### Create
- `src/pages/GameMemoryPage.vue`
- `src/pages/GameScramblePage.vue`
- `src/pages/GameSpeedQuizPage.vue`

### Modify
- `src/router/index.js` — thêm 3 routes
- `src/utils/ported-pages.js` — thêm 3 entries

### Legacy (read-only theo AD-15)
- `web-en/pages/game-memory.html`
- `web-en/pages/game-scramble.html`
- `web-en/pages/game-speedquiz.html`
- `web-en/js/features/game-memory/` (nếu có)
- `web-en/js/features/game-scramble/` (nếu có)
- `web-en/js/features/game-speedquiz/` (nếu có)

---

## Files Created/Modified

### Created
- `projects/web-app/src/pages/GameMemoryPage.vue`
- `projects/web-app/src/pages/GameScramblePage.vue`
- `projects/web-app/src/pages/GameSpeedQuizPage.vue`

### Modified
- `projects/web-app/src/router/index.js` — thêm 3 routes
- `projects/web-app/src/utils/ported-pages.js` — thêm 3 entries
- `projects/web-app/src/pages/EnglishHubPage.vue` — cập nhật game paths

---

## Non-Functional Requirements

- NFR1: Legacy app luôn chạy được
- NFR3: Component dùng chung (CTopbar, CGrid) được tái sử dụng
- NFR4: Logic được tái sử dụng qua @legacy (AD-3, AD-4)
- AD-8: Không hex cứng trong components
- AD-10: `<style scoped>` cho page components

---

## Status

**Implemented:** dev-story (2026-08-03)
**Status:** review
**Build:** ✅ pass
