# Story 4.4: Port Hub Pages — english, learning-paths, frontend

## Header

- **Epic:** 4 — Port toàn bộ 23 trang còn lại
- **Story ID:** 4.4
- **Status:** review
- **Hardened:** light (2026-08-03) — 3 AC
- **Implemented:** dev-story (2026-08-03)
- **Created:** 2026-08-03

---

## User Story

As a người dùng,
I want truy cập hub pages (English, Lộ trình, Frontend) trên bản Vue,
So that không cần quay về bản Legacy để sử dụng các hub này.

---

## Acceptance Criteria

### AC1: English Hub đầy đủ

**Given** English Hub page đã port sang Vue
**When** người dùng mở `/english`
**Then** hiển thị hub card English (với tất cả sub-links: vocab, tense, story, practice, exam, tracker, games)
**And** sub-links trỏ về bản Vue đã port hoặc Legacy chưa port

### AC2: Learning Paths page hoạt động

**Given** Learning Paths page đã port
**When** người dùng mở `/learning-paths`
**Then** hiển thị 4 path cards (English, Trung Cấp, Java, AI/ML)
**And** mỗi card có milestone steps
**And** nút "Bắt đầu" navigate đúng

### AC3: Frontend Hub hoạt động

**Given** Frontend Hub đã port
**When** người dùng mở `/frontend/hub`
**Then** hiển thị 5 hub cards (HTML/CSS, JS, Frameworks, Responsive, UI Interview)
**And** hiển thị Forge Timer widget

---

## Technical Notes

### Legacy Files

- `web-en/pages/english.html` — complex page với 4 tabs (vocab, tense, story, game), flip card, forge timer
- `web-en/pages/learning-paths.html` — static cards với milestones
- `web-en/pages/frontend/hub.html` — hub cards + forge timer

### Strategy

**english.html:** Phức tạp (flip card, drag-drop, forge timer). Vì các sub-pages vocab/tense/story chưa port, giữ English Hub làm hub chuyển tiếp. Chỉ port hub view (như JavaHubPage). Sub-links vocab/tense/story → Legacy.

**learning-paths.html:** Static content. Port trực tiếp thành Vue page với milestone layout.

**frontend/hub.html:** Hub cards + forge timer. Port thành Vue page với CHubCard components.

### No R6 Data

Không dùng localStorage → light mode story.

---

## Files to Create/Modify

### Create
- `src/pages/EnglishPage.vue` — Hub view cho English
- `src/pages/LearningPathsPage.vue` — Static path cards
- `src/pages/FrontendHubPage.vue` — Hub với forge timer

### Modify
- `src/router/index.js` — thêm 3 routes
- `src/utils/ported-pages.js` — thêm entries
- `src/pages/HomePage.vue` — cập nhật links

---

## Non-Functional Requirements

- NFR1: Legacy app luôn chạy được
- NFR3: Dùng CTopbar, CGrid, CHubCard (component reuse)
- AD-8: Không hex cứng trong components
- AD-10: `<style scoped>` cho page components
