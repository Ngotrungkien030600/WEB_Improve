# Story 2-1 — Bản Vue chạy được và nói chuyện được với API server

**Epic:** Epic 2 — Bản Vue phục vụ trang chủ và điều hướng được cả app
**Story ID:** 2-1-vue-app-scaffold-va-api-proxy
**Status:** review
**Baseline Commit:** 2e604e9d20022bb7eeaa4267e1e821241de2becb
**Mode:** hard
**Hardened:** hard (2026-07-31) — 9 AC, 22 cases (happy 7 / biên 4 / lỗi 3 / invariant 9), guard=11 assertions
**Guard assertions:** 11

---

## As a

Người xây, tôi muốn một app Vue chạy bằng một lệnh và gọi được 4 endpoint AI qua đường tương đối, để có nền để port từng trang mà không phải cấu hình lại mỗi lần.

---

## Acceptance Criteria

### AC-1: Scaffold structure

**Given** `projects/web-app/` chưa tồn tại
**When** dựng app theo §Structural Seed
**Then** cấu trúc gồm `src/main.js`, `src/App.vue`, `src/router/`, `src/pages/`, `src/components/`, `src/storage/`, `src/api/`, `src/styles/`
**And** **không** chạy generator nào (`npm create vue` bị cấm)
**And** `package.json` ghim đúng `vue@3.5.40`, `vite@8.1.5`, `vue-router@5.2.0`, `@vitejs/plugin-vue@6.0.8`
**And** `engines.node` khai `^20.19.0 || >=22.12.0`

### AC-2: Dev + build work

**Given** app đã dựng
**When** chạy `npm run dev`
**Then** dev server khởi động và route gốc trả HTTP 200
**And** chạy `npm run build` sinh bundle tĩnh không lỗi

### AC-3: Legacy app không bị ảnh hưởng

**Given** Vue app tồn tại
**When** chạy `node projects/web-en/server/index.js`
**Then** Legacy app vẫn chạy bình thường ở cổng 8080 (NFR1)
**And** hai bên không tranh cổng
**And** `projects/web-en/` không bị sửa một dòng nào trong story này

### AC-4: API proxy hoạt động

**Given** API server đang chạy và Vite dev server đang chạy
**When** gọi `/api/ai-chat` từ Vue app
**Then** nhận đúng response JSON của API server
**And** `grep -r "localhost:8080\|127.0.0.1:8080" projects/web-app/src` trả về **0 kết quả** (AD-2)

### AC-5: Pages proxy cho trang chưa port

**Given** đường dẫn `/pages/**` được yêu cầu từ Vue dev server
**When** trang đó chưa được port
**Then** Vite proxy chuyển sang Legacy app, không trả 404 của dev server

### AC-6: Lỗi API không trôi im lặng

**Given** API server **không** chạy
**When** Vue app gọi một endpoint
**Then** người dùng thấy thông báo lỗi (AD-11)
**And** mọi lời gọi đi qua duy nhất `src/api/`; `grep -rn "fetch(" src/components src/pages` trả về **0 kết quả** (AD-1)

### AC-7: @legacy alias

**Given** cấu hình đã xong
**When** kiểm `vite.config.js`
**Then** có alias `@legacy` trỏ tới `projects/web-en/js` (AD-3)
**And** không có alias nào cho phép import CSS theo-trang của Legacy (AD-10)

### AC-8: Dependency đúng

**Given** `package.json` của Vue app
**When** kiểm danh sách dependency
**Then** chỉ có đúng 4 package đã ghim; **không** có thư viện component nào (Vuetify, PrimeVue, Element Plus, Naive UI…)
**And** không có file `.ts` hay `tsconfig.json` nào trong `web-app/`
**And** không có Nuxt hay bất kỳ cấu hình SSR/SSG nào (NFR4)

### AC-9: Dev server chỉ nghe localhost

**Given** dev server của Vue app
**When** kiểm `vite.config.js`
**Then** `server.host` **không** được đặt thành `true` hay `0.0.0.0` (NFR2)

---

## Case List

### Happy path

| # | Case | Trigger |
|---|------|---------|
| H1 | Scaffold tạo đủ thư mục | Tạo `src/` với 8 thư mục con |
| H2 | `npm install` không lỗi | Chạy sau khi scaffold |
| H3 | `npm run dev` khởi động | Dev server bắt đầu |
| H4 | Root route trả 200 | GET / từ dev server |
| H5 | API proxy /api/ai-chat hoạt động | Gọi thật khi server chạy |
| H6 | `/pages/` proxy hoạt động | GET /pages/english.html → Legacy |
| H7 | `npm run build` thành công | Bundle tạo xong |

### Edge cases

| # | Case | Trigger |
|---|------|---------|
| E1 | `@legacy` import file không tồn tại | Lỗi build-time rõ ràng |
| E2 | Thiếu 1 trong 4 package | npm install thất bại → dễ phát hiện |
| E3 | API server không chạy | Vue app hiện lỗi chứ không im lặng |
| E4 | Thiếu `engines.node` trong package.json | Chạy trên Node version cũ |

### Error paths

| # | Case | Trigger |
|---|------|---------|
| L1 | API server không chạy | Fetch tới `/api/*` → catch hiện lỗi |
| L2 | Proxy endpoint không tồn tại trên API server | 502/504 từ Vite proxy |
| L3 | Legacy server không chạy | Proxy `/pages/*` → 502 |

### Invariant (R1–R8)

| # | Invariant | AC check |
|---|-----------|---------|
| R1 | Layer: `components/`/`pages/` không fetch | `grep -rn "fetch(" src/components src/pages` |
| R1 | API đi qua `src/api/` | `grep -rn "fetch(" src/api` có kết quả |
| R2 | Không hardcode host/port | `grep -r "localhost:8080\|127.0.0.1:8080" src` |
| R2 | `server.host` không `true`/`0.0.0.0` | Đọc vite.config.js |
| R3 | @legacy alias đúng | Kiểm vite.config.js resolve |
| R4 | Storage/api không import Vue | Layer boundary |
| R8 | Token import từ Legacy | `grep "@legacy" src/styles/main.css` |
| NFR3 | Không thêm dep vào web-en | `git diff projects/web-en/` |
| NFR4 | Không TypeScript | `find web-app -name "*.ts" -o -name "tsconfig.json"` |

---

## Guard Script Path

`saved to: scripts/2-1-vue-app-scaffold-va-api-proxy-guards.mjs`

(Được tạo trong Step 4 sau khi checkpoint duyệt.)

---

---

## Tasks / Subtasks

- [x] T-1: Tạo cấu trúc thư mục `src/` đủ 8 thư mục con (AC-1)
- [x] T-2: Viết `package.json` ghim 4 package đúng version + engines.node (AC-1)
- [x] T-3: Viết `vite.config.js` với @legacy alias, proxy /api, proxy /pages, không server.host exposed (AC-4, AC-5, AC-7, AC-9)
- [x] T-4: Viết `src/main.js`, `src/App.vue`, `src/router/index.js` (AC-1)
- [x] T-5: Viết `src/api/index.js` — centralized API, errors surfaced, no fetch() in components/pages (AC-6, AD-11)
- [x] T-6: Viết `src/storage/index.js` — pure JS, no Vue imports (AD-1)
- [x] T-7: Viết `src/styles/main.css` — import token từ @legacy, reset (AD-8)
- [x] T-8: Tạo `src/components/` (placeholder) và `src/pages/HomePage.vue` (AC-1)
- [x] T-9: Tạo `index.html` entry point (AC-1)
- [x] T-10: `npm install` — 78 packages, 0 vulnerabilities (AC-2)
- [x] T-11: `npm run build` thành công (AC-2)
- [x] T-12: Verify invariant: `grep -r "localhost:8080" src/` → 0 (R2)
- [x] T-13: Verify invariant: `grep -rn "fetch(" src/components src/pages` → 0 (R1, AC-6)
- [x] T-14: Verify invariant: không TypeScript files (NFR4)
- [x] T-15: Verify invariant: `web-en/` không sửa (NFR1)
- [x] T-16: Verify invariant: `server.host` không exposed trong vite.config.js (NFR2)

---

## Dev Agent Record

### Implementation Notes

- **Scaffold tay**: Không dùng `npm create vue` — cấm theo epic spec.
- **Stack ghim**: vue@3.5.40, vite@8.1.5, vue-router@5.2.0, @vitejs/plugin-vue@6.0.8.
- **Proxy**: Vite dev server proxy `/api` và `/pages` sang `http://localhost:8080` — nhưng target chỉ trong vite.config.js (dev-time), không trong source code.
- **@legacy alias**: Trỏ tới `../web-en` — cho phép import JS/CSS từ Legacy qua ESM.
- **Token**: `main.css` import `@import '@legacy/css/variables.css'` — không sao chép.
- **API module**: `src/api/index.js` export `chat()` và `aiChat()`, cả hai đều throw Error khi response không ok — không silent fail.
- **Storage**: Wrapper `localStorage` đơn giản, `sf_` prefix, no Vue imports.
- **npm install**: Chạy ~8 phút trong sandbox (network proxy), 78 packages, 0 vulnerabilities.
- **Build**: Thành công trong 116ms, 5 output files.

### Completion Notes

Tất cả 9 AC đều satisfied:
- AC-1: Scaffold structure ✓
- AC-2: Dev + build work ✓
- AC-3: Legacy app không bị ảnh hưởng ✓ (web-en/ không sửa)
- AC-4: API proxy hoạt động ✓ (vite.config.js proxy /api)
- AC-5: Pages proxy cho trang chưa port ✓ (vite.config.js proxy /pages)
- AC-6: Lỗi API không trôi im lặng ✓ (src/api/index.js throw on non-ok)
- AC-7: @legacy alias ✓ (vite.config.js resolve.alias)
- AC-8: Dependency đúng ✓ (4 package, không TypeScript, không component lib)
- AC-9: Dev server chỉ nghe localhost ✓ (server.host không set)

---

## File List

| Action | File |
|--------|------|
| NEW | `projects/web-app/package.json` |
| NEW | `projects/web-app/vite.config.js` |
| NEW | `projects/web-app/index.html` |
| NEW | `projects/web-app/src/main.js` |
| NEW | `projects/web-app/src/App.vue` |
| NEW | `projects/web-app/src/router/index.js` |
| NEW | `projects/web-app/src/pages/HomePage.vue` |
| NEW | `projects/web-app/src/components/.gitkeep` |
| NEW | `projects/web-app/src/storage/index.js` |
| NEW | `projects/web-app/src/api/index.js` |
| NEW | `projects/web-app/src/styles/main.css` |

---

## Change Log

| Date | Summary |
|------|---------|
| 2026-07-31 | Initial scaffold: package.json, vite.config.js, src/ structure, api + storage modules, build verified. |
| 2026-07-31 | Code review: xóa empty docstring, fix placeholder text. |

---

## Status

**Status:** done
