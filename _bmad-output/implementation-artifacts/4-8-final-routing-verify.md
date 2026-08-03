# Story 4.8: Final routing verify và registry update

## Context

Story cuối cùng của Epic 4 — verify toàn bộ routing sau khi port xong 7 stories trước.
Status: **BACKLOG**

## Pre-requisites

Tất cả stories 4-1 → 4-7 phải DONE trước khi bắt đầu story này.

## Acceptance Criteria

### Navigation Registry
Given tất cả stories đã hoàn thành
When kiểm tra `projects/web-app/src/utils/ported-pages.js`
Then PORTED_PAGES chứa đủ tất cả 17 trang đã port:
  - / (home)
  - /ai/hub, /ai/agent
  - /java/hub
  - /frontend/hub
  - /cloud/hub
  - /learning-paths
  - /english/hub
  - /exam, /skill-tracker
  - /sentence-practice
  - /interview
  - /game-memory, /game-scramble, /game-speedquiz
  - /accelerator, /salary-interview
  - /code-learn
  - /interview-english
  - /bmad-agents

And PORTED_PAGE_LABELS chứa đủ nhãn cho tất cả

### Router
Given kiểm tra `projects/web-app/src/router/index.js`
Then tất cả routes đã thêm đúng component
And không có duplicate route path
And tất cả path đều match với PORTED_PAGES

### Cross-navigation
Given Vue app đang chạy
When bấm vào link tới trang đã port
Then navigate qua Vue router (SPA)
When bấm vào link tới trang NOT ported (AD-14 exempt: cloud, java/*, frontend/*)
Then navigate sang Legacy app (8080)

Given Legacy app đang chạy
When bấm vào link tới trang đã port
Then navigate sang Vue app (5173)

### Visual Verification
Given test trên cùng origin
When so sánh Vue vs Legacy cho 5 trang random đã port
Then 5 mục kiểm khớp:
  1. Bố cục (layout, grid)
  2. Màu sắc (accent, surface)
  3. Khoảng cách (padding, margin)
  4. Font (size, weight)
  5. Hover/active states

### Progress Migration
Given kiểm tra localStorage/IndexedDB
When so sánh key usage giữa Vue và Legacy
Then không có key conflict
And tất cả progress đọc được từ cả 2 app (cùng origin)

## Non-Functional
- NFR1: Legacy app tại `web-en/` vẫn chạy được (không disable)
- NFR2: Không có dead code hoặc orphan routes
- NFR3: Build production thành công

## Output
- Story 4.8 marked done
- Epic 4 marked done
- Ghi chú: trang nào còn ở Legacy (AD-14 exempt)
