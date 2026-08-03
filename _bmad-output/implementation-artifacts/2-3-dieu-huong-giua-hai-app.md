# Story 2-3 — Điều hướng giữa hai app

**Epic:** Epic 2 — Bản Vue phục vụ trang chủ và điều hướng được cả app
**Story ID:** 2-3-dieu-huong-giua-hai-app
**Status:** ready-for-dev
**Mode:** hard
**Hardened:** hard (2026-08-02) — 6 AC, 15 cases (happy 5 / biên 4 / lỗi 2 / invariant 4), guard=16 assertions
**Implemented:** dev-story (2026-08-02) — 7 files
**Code-Reviewed:** 2026-08-03 — 0 🔴 (1 gợi ý nhỏ đã fix convention)

---

## As a

Người dùng SkillForge, tôi muốn click vào thẻ điều hướng trên bản Vue và được chuyển đúng trang — trang đã port thì qua Vue Router, trang chưa port thì qua Vite proxy sang Legacy — để tôi thấy đúng nội dung dù đang ở bản nào.

---

## Nguồn thực tế

**ĐỌC FILE GỐC TRƯỚC KHI CODE:**

- Router hiện tại: `projects/web-app/src/router/index.js` — chỉ có route `/`
- Proxy đã có: `projects/web-app/vite.config.js` — `/pages/**` → `localhost:8080`
- HomePage cards: `projects/web-app/src/pages/HomePage.vue` — hardcoded `href="pages/xxx.html"`
- Dev guide: `docs/development-guide-vue.md` — AD-7 Ported Page Registry

---

## Acceptance Criteria

### AC-1: Ported Page Registry tồn tại và chính xác

**Given** chưa có `src/utils/ported-pages.js`
**When** implement story
**Then** tạo file `src/utils/ported-pages.js`
**And** export `PORTED_PAGES` là array chứa các path đã port: `['/', '/ai/hub', '/java/hub', '/frontend/hub', '/cloud/hub', '/english/hub']`
**And** export `PORTED_PAGE_LABELS` là object map path → label

### AC-2: Navigation helper quyết định đúng

**Given** có `PORTED_PAGES` registry
**When** gọi `navigate(path)`
**Then** nếu path trong `PORTED_PAGES` → dùng Vue Router `router.push(path)`
**And** nếu path không trong `PORTED_PAGES` → chuyển hướng qua `/pages/...` (Vite proxy)
**And** helper nhận `target` prop tùy chọn để override

### AC-3: HomePage dùng helper thay vì hardcoded href

**Given** HomePage có 11 cards với hardcoded `href`
**When** implement
**Then** thay `href` bằng `@click.prevent="navigate(card.path)"`
**And** bỏ `href` attribute (navigation hoàn toàn qua JS)
**And** cards data có `path` thay vì `href` (e.g. `/ai/hub` thay vì `pages/ai/hub.html`)

### AC-4: Hub pages có route Vue

**Given** các hub cần port trong Epic 3: ai, java, frontend, cloud, english
**When** implement navigation story
**Then** thêm route stubs cho 5 hub (lazy load, placeholder component)
**And** stub component render `<div class="placeholder-page">[Hub Name]</div>` — để đánh dấu đã có route, chưa có UI
**And** route path khớp PORTED_PAGES: `/ai/hub`, `/java/hub`, `/frontend/hub`, `/cloud/hub`, `/english/hub`

### AC-5: Redirect component cho unknown routes

**Given** user truy cập path không có trong router
**When** Vue Router không match được
**Then** render `<CNavRedirect />` component
**And** component đọc `window.location.pathname`, strip leading `/`, prefix `/pages/`, suffix `.html`
**And** redirect: `window.location.href = '/pages/' + page + '.html'`
**And** component không render gì trong Vue tree (chỉ side-effect redirect)

### AC-6: Invariants giữ nguyên

**When** kiểm
**Then** `grep -rn "fetch(" src/utils/` → 0 (navigate helper không fetch)
**And** `grep "localhost:8080" src/` → 0 (không hardcode)
**And** navigation helper không import Vue Router nếu dùng `window.location`

---

## Case List

### Happy path

| # | Case | Trigger |
|---|------|---------|
| H1 | Click card đã port → Vue Router | Click "Học AI" → route `/ai/hub` |
| H2 | Click card chưa port → proxy | Click "Accelerator" → Legacy `/pages/accelerator.html` |
| H3 | Direct URL hub đã port → Vue | GET `/ai/hub` → Vue route |
| H4 | Direct URL hub chưa port → proxy | GET `/java/hub` → proxy → Legacy |
| H5 | URL không match router → redirect | GET `/unknown` → redirect to `/pages/unknown.html` |

### Edge cases

| # | Case | Trigger |
|---|------|---------|
| E1 | Empty path | `navigate('')` → không làm gì |
| E2 | Path không có `/` prefix | `navigate('ai/hub')` → tự thêm `/` prefix |
| E3 | Hub page stub hiển thị placeholder | GET `/frontend/hub` → "Frontend" placeholder |
| E4 | Path có `/` trùng lặp | `navigate('//ai/hub')` → normalize → `/ai/hub` |

### Error paths

| # | Case | Trigger |
|---|------|---------|
| L1 | Navigate sau khi unmount | Router push khi component đã unmount → no-op |
| L2 | Legacy server down → graceful | Proxy trả 404, không crash |

### Invariant checks (R1–R8)

| # | Invariant | Check |
|---|-----------|-------|
| I1 | Navigate helper không hardcode host | `grep "localhost" src/utils/` → 0 (R2) |
| I2 | Registry đúng nguồn duy nhất | `ported-pages.js` không import từ `router` (R7) |
| I3 | CNavRedirect không fetch | `grep "fetch" src/components/CNavRedirect.vue` → 0 (R1) |
| I4 | Stub routes có lazy load | Router dùng `() => import(...)` cho hub stubs |

---

## Dev Notes

### Cấu trúc cần tạo

```
src/
  utils/
    ported-pages.js     ← registry + labels
    navigate.js          ← navigation helper (router hoặc window.location)
  components/
    CNavRedirect.vue    ← redirect unknown routes
  router/
    index.js           ← update: thêm hub routes
```

### Navigation strategy

```
navigate(path)
  ├─ path ∈ PORTED_PAGES  → router.push(path)
  └─ path ∉ PORTED_PAGES → window.location.href = '/pages/' + path + '.html'
```

Proxy Vite: `/pages/**` → `http://localhost:8080` (giữ nguyên path)

Ví dụ:
- `navigate('/ai/hub')` → router → Vue route
- `navigate('/accelerator')` → proxy → `http://localhost:8080/pages/accelerator.html`

### Hub stubs — tại sao cần route?

- Route stubs đánh dấu hub ĐÃ có trong `PORTED_PAGES`
- Stub component placeholder cho thấy route tồn tại, UI chưa có
- Khi Epic 3 port hub, chỉ cần thay stub bằng real component — không cần sửa registry

### Stub component template

```vue
<template>
  <div class="hub-placeholder">
    <h1>{{ pageLabel }}</h1>
    <p>Trang đang được port sang Vue — quay lại sau.</p>
    <button @click="$router.push('/')">← Về trang chủ</button>
  </div>
</template>
```

---

## Tasks

- [ ] T-1: Tạo `src/utils/ported-pages.js` — PORTED_PAGES + PORTED_PAGE_LABELS
- [ ] T-2: Tạo `src/utils/navigate.js` — helper router/window.location
- [ ] T-3: Tạo `src/components/CNavRedirect.vue` — redirect unknown routes
- [ ] T-4: Update `src/router/index.js` — thêm 5 hub routes (lazy stubs)
- [ ] T-5: Update `HomePage.vue` cards data — `href` → `path`, dùng `navigate()`
- [ ] T-6: Verify invariants

---

## Guard Script Path

`scripts/2-3-dieu-huong-giua-hai-app-guards.mjs` — 16 assertions

---

## References

- [Source: projects/web-app/src/router/index.js] — router hiện tại
- [Source: projects/web-app/vite.config.js] — proxy `/pages/**`
- [Source: projects/web-app/src/pages/HomePage.vue] — cards navigation
- [Source: docs/development-guide-vue.md#AD-7] — Ported Page Registry
- [Source: _bmad-output/implementation-artifacts/2-2-trang-chu-tren-vue.md] — HomePage đã port
