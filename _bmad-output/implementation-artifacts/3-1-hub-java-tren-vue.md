# Story 3.1 — Hub Java chạy trên Vue, giữ màu nhấn khu vực

**Epic:** Epic 3 — Màn có logic chạy trên bản Vue, tiến độ cũ còn nguyên
**Story ID:** 3-1-hub-java-tren-vue
**Status:** ready-for-dev
**Mode:** hard
**Hardened:** hard (2026-08-03) — 8 AC, 11 cases (happy 3 / biên 3 / lỗi 2 / invariant 3), guard=n/a (manual FR-6)
**Implemented:** dev-story (2026-08-03) — 3 files (CTopbar.vue, CHubCard.vue, JavaHubPage.vue) + router + registry

---

## As a

Người dùng,
I want hub Java trên bản Vue trông đúng như cũ, kể cả màu hổ phách riêng của khu vực Java,
So that việc chuyển sang Vue không làm mất dấu hiệu nhận biết khu vực mà tôi đã quen.

---

## Nguồn thực tế

**ĐỌC FILE GỐC TRƯỚC KHI CODE:**

- `projects/web-en/pages/java/hub.html` — Legacy hub (layout, 7 cards, accent color)
- `projects/web-app/src/components/CCard.vue` — CCard component hiện có
- `projects/web-app/src/components/CGrid.vue` — CGrid component hiện có
- `projects/web-app/src/utils/ported-pages.js` — registry cần update
- `projects/web-app/src/router/index.js` — router cần update
- `projects/web-app/src/pages/` — chưa có JavaHubPage.vue

---

## Acceptance Criteria

### AC-1: Hub Java port đầy đủ content

**Given** `pages/java/hub.html` bản Legacy có thanh tiêu đề "☕ Java", một dòng mô tả, và lưới 7 cards
**When** hub được dựng trên bản Vue
**Then** hiển thị đủ thanh tiêu đề, dòng mô tả, 7 cards
**And** 7 cards hiển thị: Học Code, Spring Boot, Thực chiến, Backend Engineering, Phỏng vấn Backend, Phỏng vấn theo lương, English Interview (đúng icon, title, description)

### AC-2: Vỏ trang ghép từ component dùng chung (R1)

**Given** hub cần vỏ: topbar + grid
**When** kiểm `JavaHubPage.vue`
**Then** dùng `CTopbar` (chưa có → tạo mới) cho thanh tiêu đề
**And** dùng `CGrid` cho lưới cards
**And** dùng `CCard` cho từng card
**And** trang **không** tự viết markup bố cục khung nào (AD-12)

### AC-3: Accent color override qua token (AD-17)

**Given** hub Java dùng accent `#f59e0b` (amber)
**When** kiểm cách màu nhấn được đặt
**Then** `CTopbar` và `CCard` tham chiếu token `--color-accent` (duy nhất, không phải `--color-accent-java`)
**And** `JavaHubPage.vue` ghi đè `--color-accent: #f59e0b` trên root element
**And** không có token mới nào trong `variables.css` cho khu vực Java (AD-17)

### AC-4: Không hex trong style scoped (R8)

**Given** Vue page đã viết
**When** kiểm `<style scoped>`
**Then** không có hex color nào trong `<style scoped>` (màu đi qua token)
**And** không có `px` cứng trong `<style scoped>` (dùng token/spacing)

### AC-5: Navigation qua ported-pages registry (R7)

**Given** hub Java đã port và thêm vào registry
**When** kiểm `ported-pages.js`
**Then** `/java/hub` có trong `PORTED_PAGES`
**And** `PORTED_PAGE_LABELS` có label "Java" cho `/java/hub`

### AC-6: Router đúng route

**Given** hub Java đã port
**When** kiểm router
**Then** route `/java/hub` dùng `JavaHubPage.vue`, không còn `HubPlaceholder`
**And** HubPlaceholder được gỡ khỏi route này

### AC-7: Card navigation đúng đích (AD-7, AD-14)

**Given** 7 cards có href
**When** kiểm navigation logic
**Then** cards trong danh sách ported-pages → Vue router (link nội bộ)
**And** cards ngoài danh sách → window.location tương đối sang Legacy
**And** `spring-boot.html`, `backend.html` → Legacy (trang nội dung dài không port — AD-14)

### AC-8: Giao diện khớp bản Legacy (FR6, NFR5)

**Given** hai bản hub Java đặt cạnh nhau
**When** so đúng **năm mục**: bố cục khối, màu, khoảng cách, cỡ/kiểu chữ, trạng thái hover
**Then** năm mục đều khớp
**And** border khi hover card đổi sang màu amber `#f59e0b`

---

## Case List

### Happy path

| # | Case | Trigger |
|---|------|---------|
| H1 | Render hub đầy đủ | Mở `/java/hub` → hiển thị title + mô tả + 7 cards |
| H2 | Accent amber hiển thị | Hover card → border đổi sang amber |
| H3 | Navigate về trang chủ | Click "← Trang chủ" → về `/` |

### Edge cases

| # | Case | Trigger |
|---|------|---------|
| E1 | CTopbar chưa có → tạo mới | `src/components/CTopbar.vue` chưa tồn tại → tạo |
| E2 | 4 cột grid (Legacy) | `CGrid` dùng `auto-fill, minmax(260px,1fr)` → xấp xỉ 4 cột desktop |
| E3 | Card icon là emoji | Card dùng emoji icon (💻🍃⚔️⚙️☕💰🇬🇧) — CCard nhận prop icon |

### Error paths

| # | Case | Trigger |
|---|------|---------|
| L1 | Card dẫn tới trang nội dung dài | Click Spring Boot card → Legacy (`spring-boot.html`) |
| L2 | Hub không có trong registry | Truy cập `/java/hub` khi chưa thêm registry → redirect qua CNavRedirect |

### Invariant checks (R1, R7, R8)

| # | Invariant | Check |
|---|-----------|-------|
| I1 | R1 — Layer boundary | `JavaHubPage.vue` không import từ `pages/`, không gọi storage/api trực tiếp |
| I2 | R7 — Ported registry | Navigation dùng `ported-pages.js` helper, không hardcode href |
| I3 | R8 — Token import | `<style scoped>` không chứa hex color rải rác |

---

## Dev Notes

### CTopbar — chưa có, cần tạo

`CTopbar.vue` cần hỗ trợ:
- `title` prop (string) — text hiển thị
- `backLink` prop (string, default '/') — href nút "← Trang chủ"
- Layout: flex, justify-between, gap, flex-wrap
- Style: font size 1.5rem, font-weight 700

Tham chiếu CSS từ Legacy `hub.html`:
```css
.topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:0.5rem; }
.topbar h1 { font-size:1.5rem; font-weight:700; }
.topbar .back { color:var(--accent); text-decoration:none; font-size:0.9rem; }
.topbar .back:hover { text-decoration:underline; }
```

### CCard variant cho hub

CCard hiện tại dùng cho trang chủ (icon trên, title, description, center). Hub cards cần layout khác:
- Icon bên trái
- Title + description bên phải
- Left-aligned, horizontal layout

Có 2 lựa chọn:
1. **Tạo `CHubCard.vue`** — hub variant riêng (AD-12: tạo variant khi cần)
2. **Thêm prop layout vào `CCard.vue`** — `layout: 'vertical' | 'horizontal'`

→ Chọn option 1 (variant riêng) để CCard trang chủ không bị ảnh hưởng.

### Card navigation data

| Card | href Legacy | Ported? |
|------|-----------|---------|
| Học Code | `../code-learn.html` | ❌ (port rồi → router) |
| Spring Boot | `spring-boot.html` | ❌ (AD-14) |
| Thực chiến | `thuc-chien.html` | ❌ |
| Backend Engineering | `backend.html` | ❌ (AD-14) |
| Phỏng vấn Backend | `../interview.html` | ❌ |
| Phỏng vấn theo lương | `../salary-interview.html` | ❌ |
| English Interview | `../interview-english.html` | ❌ |

**Tất cả 7 cards đều ngoài danh sách ported-pages** → dùng `window.location` tương đối. Không card nào là hub đã port.

### Accent token mapping (AD-17)

Legacy hub dùng inline `:root`:
```css
:root { --accent: #f59e0b; }
```

→ Vue page ghi đè:
```html
<div style="--color-accent: #f59e0b;">
```

Nhưng `CCard` và `CTopbar` dùng `var(--color-accent)`. Cần verify hai tên token này tương thích với `variables.css`.

---

## Tasks

- [ ] T-1: Tạo `src/components/CTopbar.vue`
- [ ] T-2: Tạo `src/components/CHubCard.vue` (horizontal variant)
- [ ] T-3: Tạo `src/pages/JavaHubPage.vue`
- [ ] T-4: Update `src/router/index.js` — `/java/hub` → `JavaHubPage.vue`
- [ ] T-5: Update `src/utils/ported-pages.js` — thêm `/java/hub`
- [ ] T-6: FR-6 manual acceptance — năm mục so sánh Legacy vs Vue
- [ ] T-7: Verify invariants (R1, R7, R8)

---

## References

- [Source: projects/web-en/pages/java/hub.html] — Legacy hub
- [Source: projects/web-app/src/components/CCard.vue] — CCard hiện có
- [Source: projects/web-app/src/components/CGrid.vue] — CGrid hiện có
- [Source: projects/web-app/src/utils/ported-pages.js] — registry
- [Source: epics.md#Story-3.1] — spec gốc
