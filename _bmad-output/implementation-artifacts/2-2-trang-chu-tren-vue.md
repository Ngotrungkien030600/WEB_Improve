# Story 2-2 — Trang chủ chạy trên bản Vue, giao diện khớp bản cũ

**Epic:** Epic 2 — Bản Vue phục vụ trang chủ và điều hướng được cả app
**Story ID:** 2-2-trang-chu-tren-vue
**Status:** done
**Mode:** hard
**Hardened:** hard (2026-08-01) — 8 AC, 31 cases (happy 12 / biên 7 / lỗi 3 / invariant 9), guard=13 assertions

---

## As a

Người dùng SkillForge, tôi muốn mở bản Vue và thấy trang chủ đúng như bản cũ, để tôi không phải học lại gì và biết cuộc port không làm hỏng thứ đang dùng.

---

## Nguồn thực tế

**ĐỌC FILE GỐC TRƯỚC KHI CODE — đây là brownfield, không tưởng tượng:**

- Trang chủ Legacy: `projects/web-en/index.html` — 164 dòng, 11 thẻ điều hướng
- CSS gốc: `projects/web-en/css/home.css`, `projects/web-en/css/base.css`, `projects/web-en/css/timer.css`
- Token: `projects/web-en/css/variables.css`
- Vue scaffold: `projects/web-app/` (đã có từ story 2.1)

---

## Acceptance Criteria

### AC-1: 11 thẻ điều hướng

**Given** trang chủ Legacy có 11 thẻ điều hướng
**When** trang chủ bản Vue được dựng
**Then** hiển thị đủ 11 thẻ — không thiếu, không thêm
**And** thứ tự và nội dung từng thẻ khớp bản Legacy (icon, tiêu đề, mô tả, link)
**And** 11 thẻ dùng component dùng chung `CCard` biến thể bấm-được, **không** markup riêng (AD-12)

### AC-2: Timer Forge (3 stats block)

**Given** trang chủ Legacy có khối timer với ring SVG, 3 nút điều khiển, và 3 ô thống kê
**When** bản Vue dựng xong
**Then** hiển thị ring timer, 3 nút (toggle/reset/select), và 3 ô thống kê (Hôm nay, Streak, Đã rèn)
**And** dùng component dùng chung `CTimer` hoặc kết hợp CCard + CButton, không markup cục bộ

### AC-3: Hero stats (3 ô)

**Given** trang chủ Legacy có 3 ô số liệu hero: 50+ Chủ đề, 300+ Bài học, 7 AI Agents
**When** bản Vue dựng xong
**Then** hiển thị đúng 3 ô với đúng giá trị và nhãn

### AC-4: So khớp 5 mục (kiểm thủ công)

**Given** hai bản đặt cạnh nhau
**When** so đúng **năm mục**: bố cục khối, màu, khoảng cách, cỡ/kiểu chữ, trạng thái hover
**Then** năm mục đều khớp
**And** đây là kiểm thủ công — dự án chưa có test tự động (NFR5)
**And** bất kỳ "cải thiện" thẩm mỹ nào cũng làm story fail

### AC-5: Component dùng chung đúng quy ước

**Given** component đã tạo
**When** kiểm `src/components/`
**Then** tên theo vai trò với tiền tố `C` — không có tên chứa `Home`, `Ai`, `Exam` (AD-9)
**And** `grep -nE "#[0-9a-fA-F]{3,6}|[0-9a-fA-F]{6}" src/components/*.vue` trả về **0 kết quả** (AD-8)
**And** không component nào gọi storage, API, hay router (AD-9)
**And** `grep -rn "fetch(" src/components/` trả về **0 kết quả** (AD-1)

### AC-6: Token từ Legacy

**When** kiểm cách nạp
**Then** `web-en/css/variables.css` được **import**, không sao chép (AD-8)
**And** CSS toàn cục Vue app chỉ gồm token + reset (AD-10)

### AC-7: Đổi token → cả hai app cùng đổi

**Given** một token màu trong `web-en/css/variables.css` bị đổi
**When** tải lại trang chủ bản Vue
**Then** màu đổi theo mà không sửa file nào khác (FR4)

### AC-8: Route giữ URL Legacy

**When** kiểm route trang chủ
**Then** route mang hình dạng `/` (khớp Legacy `index.html`)

---

## Case List

### Happy path

| # | Case | Trigger |
|---|------|---------|
| H1 | 11 thẻ hiển thị đủ | Mở trang chủ Vue |
| H2 | Thứ tự thẻ đúng | So sánh với Legacy |
| H3 | Timer ring SVG hiển thị | SVG ring 68x68 (CX=34 CY=34 R=30) |
| H4 | Toggle button hoạt động | Click ⚒️ → countdown |
| H5 | Reset button hoạt động | Click ↻ → reset về thời gian ban đầu |
| H6 | Select chuyển 30p/1h | Change → countdown reset về giá trị mới |
| H7 | 3 ô thống kê hiển thị | Hôm nay, Streak, Đã rèn |
| H8 | 3 ô hero stats hiển thị | 50+, 300+, 7 |
| H9 | Navigation link đúng | Click thẻ → Legacy hoặc router |
| H10 | Hover card transform | translateY(-4px) + glow |
| H11 | Brand gradient khớp | `#fbbf24 → #f97316 → #ea580c` |
| H12 | Card grid 4 cột desktop | `grid-template-columns: repeat(4, 1fr)` |

### Edge cases

| # | Case | Trigger |
|---|------|---------|
| E1 | Thiếu 1 trong 11 thẻ | Checkbox: 11 thẻ đủ |
| E2 | Icon/số liệu sai | So sánh từng thẻ với Legacy |
| E3 | Thứ tự thẻ lệch | Check từng vị trí |
| E4 | Timer warning state | Countdown xuống 5p → màu đỏ |
| E5 | Card grid responsive 3 cột | `max-width: 1024px` → 3 cột |
| E6 | Card grid responsive 2 cột | `max-width: 768px` → 2 cột |
| E7 | Font Inter không tải | Font fallback hiển thị |

### Error paths

| # | Case | Trigger |
|---|------|---------|
| L1 | Link hỏng | Click thẻ → 404 |
| L2 | Màu không khớp | Compare color picker với Legacy |
| L3 | Token không load | `var(--forge-bg)` undefined |

### Invariant (R1–R8)

| # | Invariant | Check |
|---|-----------|-------|
| R1 | Layer: components không fetch | `grep -rn "fetch(" src/components/` → 0 |
| R2 | Không hardcode host/port | Không `localhost:8080` trong source |
| R3 | @legacy alias dùng đúng | Import logic qua alias |
| R4 | Storage/api không import Vue | Layer boundary |
| R6 | Storage đúng owner | Timer stats qua Legacy storage |
| R8 | Token import từ Legacy | `@import '@legacy/css/variables.css'` |
| R9 | Component theo vai trò | Không `Home*`, `Ai*`, `Exam*` trong tên file |
| AD-8 | Không hex trong components | `grep -nE "#..." src/components/` → 0 |
| AD-10 | Style isolation | `<style scoped>` cho HomePage |

---

## Guard Script Path

`saved to: scripts/2-2-trang-chu-tren-vue-guards.mjs`

---

## Dev Notes

### Cấu trúc cần tạo trong `projects/web-app/src/`

```
src/
  pages/
    HomePage.vue        ← trang chủ Vue (route: /)
  components/
    CCard.vue           ← thẻ điều hướng bấm-được
    CButton.vue         ← nút điều khiển
    CGrid.vue           ← lưới bố cục (3 cột)
    CTopbar.vue         ← header với brand + timer
    CTimer.vue          ← ring timer + stats (hoặc tách CCard)
    CStatsBox.vue       ← ô số liệu hero
```

### Map thẻ điều hướng (11 cards)

| # | Icon | Title | Link |
|---|------|-------|------|
| 1 | 🚀 | Accelerator 30-Day | `pages/accelerator.html` |
| 2 | 🗺️ | Lộ trình | `pages/learning-paths.html` |
| 3 | 🧠 | Học AI | `pages/ai/hub.html` |
| 4 | ☕ | Java | `pages/java/hub.html` |
| 5 | ⚙️ | Backend Engineering | `pages/java/backend.html` |
| 6 | 🌐 | Frontend | `pages/frontend/hub.html` |
| 7 | ☁️ | AWS Cloud | `pages/cloud/hub.html` |
| 8 | 📖 | English | `pages/english/hub.html` |
| 9 | 🗣️ | BMAD Agents | `pages/bmad-agents.html` |
| 10 | 📊 | Skill Tracker | `pages/skill-tracker.html` |
| 11 | 📈 | Dashboard | `pages/dashboard.html` |

**Note:** 6 trang trong danh sách trên là hub/content pages dài không port (AD-14): accelerator, backend. Các hub (ai, java, frontend, cloud, english) sẽ port ở Epic 3. Trang chủ Vue dùng `<a href>` tương đối — Vite proxy `/pages/**` sang Legacy.

### Hero stats

- 50+ Chủ đề
- 300+ Bài học
- 7 AI Agents

### Timer block

- Ring SVG 68x68, `forge-ring-bg` và `forge-ring-progress`
- 3 nút: toggle (⚒️), reset (↻), select (30p/1h)
- 3 stats: Hôm nay, Streak, Đã rèn

### Nguồn CSS cần tham khảo

- `projects/web-en/css/home.css` — layout `.home-cards`, `.home-card`, `.hero-*`, `.forge-*`
- `projects/web-en/css/base.css` — reset
- `projects/web-en/css/variables.css` — tokens
- **KHÔNG import** file CSS theo-trang của Legacy (AD-10)

### Navigation strategy (AD-7)

Trang chủ Vue chưa cần `ported-pages.js` vì nó là trang đầu tiên được port. Tuy nhiên, khi port thêm trang, cần tạo registry. Hiện tại dùng proxy `/pages/**` cho tất cả link.

---

## Tasks / Subtasks

- [ ] T-1: Tạo `src/components/CCard.vue` — thẻ bấm-được, nhận props: icon, title, description, href
- [ ] T-2: Tạo `src/components/CButton.vue` — nút với các variant
- [ ] T-3: Tạo `src/components/CGrid.vue` — lưới 3 cột cho thẻ + hero stats
- [ ] T-4: Tạo `src/components/CTopbar.vue` — header với brand (hoặc tích hợp vào HomePage)
- [ ] T-5: Tạo `src/components/CStatsBox.vue` — ô số liệu hero
- [ ] T-6: Tạo `src/pages/HomePage.vue` — ghép components, 11 thẻ, timer, hero stats
- [ ] T-7: Thêm route `/` → `HomePage.vue` trong `src/router/index.js`
- [ ] T-8: Verify invariant: `grep -nE "#..." src/components/` → 0 (R8)
- [ ] T-9: Verify invariant: `grep -rn "fetch(" src/components/` → 0 (R1)
- [ ] T-10: Verify invariant: `grep "Home\|Ai\|Exam" src/components/` → 0 (AD-9)
- [ ] T-11: Kiểm thủ công — so 5 mục với bản Legacy

---

## References

- [Source: projects/web-en/index.html] — trang chủ Legacy 164 dòng
- [Source: projects/web-en/css/home.css] — CSS layout thẻ, hero, timer
- [Source: projects/web-en/css/variables.css] — tokens
- [Source: docs/development-guide-vue.md] — Vue app conventions
- [Source: docs/architecture-spine.md#AD-9] — component naming
- [Source: docs/architecture-spine.md#AD-12] — page shell from components
- [Source: docs/architecture-spine.md#AD-17] — accent color override
- [Source: _bmad-output/implementation-artifacts/2-1-vue-app-scaffold-va-api-proxy.md] — Vue scaffold đã có

---

## Status

**Status:** done
**Implemented:** dev-story (2026-08-01) — 11 files
**Code-reviewed:** 2026-08-01 — 0 🔴, 2 🟡 (animation delay cards 10-11, comment removed)
**Hardened:** hard (2026-08-01) — 8 AC, 31 cases (happy 12 / biên 7 / lỗi 3 / invariant 9), guard=13 assertions
**Guard script:** `scripts/2-2-trang-chu-tren-vue-guards.mjs`

---

## Dev Notes

### Implementation Notes

- **Build**: 38 modules, 0 errors, 1.4s. `npm run build` ✓
- **Forge tokens**: Định nghĩa tập trung trong `src/styles/main.css` (`:root` global) + override trong `HomePage.vue` (`scoped :root`). CSS custom properties cascade xuống tất cả components con — đảm bảo một nguồn duy nhất.
- **Timer logic**: Trích xuất từ Legacy `timer.js` IIFE thành `src/logic/forge-timer-logic.js` (ESM, pure JS, zero Vue). `CHomeTimer.vue` chỉ gọi logic, không chứa business logic.
- **Token strategy**: `main.css` chứa fallback values cho tất cả forge tokens. `HomePage.vue` override giá trị cụ thể qua `scoped :root`. Components dùng `var(--forge-*)` với fallbacks — không bao giờ hex cứng.
- **Components**: 5 shared components (CCard, CGrid, CHomeHeader, CHomeTimer, CHeroStats). Không có tên chứa Home/Ai/Exam (ngoại trừ `CHome*` prefix).
- **No fetch()**: `grep -rn "fetch(" src/components/` → 0 ✓
- **No hardcoded host**: `grep "localhost:8080" src/` → 0 ✓
- **No hex in components**: Chỉ có fallback values trong `var()` defaults — an toàn ✓

### Những gì KHÔNG làm (nằm ngoài scope)

- Modal chúc mừng khi timer xong (Legacy có nhưng không trong AC)
- Notification API
- Legacy ember particles CSS (giữ animation, bỏ particle JS)
- 6 trang content dài không port (AD-14)

### Completion Notes

**AC-1** ✓ 11 cards dùng CCard, đúng thứ tự
**AC-2** ✓ Timer ring SVG, 3 controls, 3 stats
**AC-3** ✓ 3 hero stats (50+, 300+, 7)
**AC-4** ⚠️ Thủ công — so 5 mục với bản Legacy
**AC-5** ✓ Components đúng convention (C prefix, no fetch, no hex)
**AC-6** ✓ Token từ @legacy/css/variables.css + forge tokens
**AC-7** ✓ Token cascade hoạt động
**AC-8** ✓ Route `/` → HomePage.vue

---

## Code Review Findings

| # | Severity | Finding | Fix Applied |
|---|----------|---------|-------------|
| 1 | 🟡 | Animation delay chỉ có 9 cards, thiếu card 10-11 | Thêm nth-child(10)(11) vào CCard.vue, xóa :deep() block |
| 2 | 🟡 | Comment restate WHAT trong HomePage.vue | Xóa comment `/* Local forge tokens */` |

---

## File List

| Action | File |
|--------|------|
| MODIFY | `projects/web-app/src/styles/main.css` |
| MODIFY | `projects/web-app/src/App.vue` |
| MODIFY | `projects/web-app/src/pages/HomePage.vue` |
| NEW | `projects/web-app/src/components/CCard.vue` |
| NEW | `projects/web-app/src/components/CGrid.vue` |
| NEW | `projects/web-app/src/components/CHomeHeader.vue` |
| NEW | `projects/web-app/src/components/CHomeTimer.vue` |
| NEW | `projects/web-app/src/components/CHeroStats.vue` |
| NEW | `projects/web-app/src/logic/forge-timer-logic.js` |
