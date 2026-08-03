# Story 2-4 — Bản Vue cùng origin với Legacy app

**Epic:** Epic 2 — Bản Vue phục vụ trang chủ và điều hướng được cả app
**Story ID:** 2-4-cung-origin-voi-legacy
**Status:** ready-for-dev
**Mode:** hard
**Hardened:** hard (2026-08-03) — 6 AC, 11 cases (happy 3 / biên 3 / lỗi 2 / invariant 3), guard=11 assertions
**Implemented:** dev-story (2026-08-03) — 0 files (documentation-only: build verify + strategy)

---

## As a

Người dùng đã có tiến độ học, tôi muốn bản Vue chạy cùng địa chỉ với bản cũ, để tiến độ tôi đã tích luỹ vẫn còn nguyên khi trang được chuyển sang Vue.

---

## Nguồn thực tế

**ĐỌC FILE GỐC TRƯỚC KHI CODE:**

- `projects/web-app/vite.config.js` — proxy hiện tại
- `projects/web-app/dist/index.html` — bundle đã build
- `projects/web-app/package.json` — scripts hiện có
- `projects/web-en/server/index.js` — cách Legacy serve static files
- Architecture spine §Deferred — các deployment options

---

## Acceptance Criteria

### AC-1: Bundle Vue build được không lỗi

**Given** `projects/web-app/` có đầy đủ source
**When** chạy `npm run build`
**Then** sinh `dist/` với `index.html` và `assets/`
**And** `npm run preview` serve được bundle đó

### AC-2: Có tài liệu deployment strategy

**Given** story hoàn tất
**When** kiểm `_bmad-output/implementation-artifacts/2-4-cung-origin-voi-legacy.md`
**Then** có section ghi lại **deployment strategy** đã dùng
**And** nêu rõ ưu/nhược từng option
**And** không lock cứng host/port nào trong source (R2)

### AC-3: Bundle serve từ cùng origin với Legacy

**Given** Legacy server chạy trên một port
**When** bundle Vue được serve từ cùng origin đó
**Then** Vue app hoạt động đúng
**And** `/pages/**` requests đi qua Vite proxy (dev) hoặc Legacy server (prod)
**And** `/api/**` requests đi qua proxy hoặc API server

### AC-4: localStorage chia sẻ giữa hai app

**Given** localStorage có dữ liệu từ Legacy
**When** mở Vue app cùng origin
**Then** đọc được dữ liệu đó
**And** Legacy app vẫn ghi/đọc localStorage bình thường (NFR1, FR6)

### AC-5: Dev mode origin mismatch được ghi rõ

**Given** Vue dev server chạy ở cổng riêng
**When** kiểm behavior
**Then** dev mode **không** chia sẻ localStorage với Legacy (origin khác)
**And** đây là **ràng buộc đã biết**, không phải bug
**And** có ghi chú trong tài liệu

### AC-6: Invariants giữ nguyên

**When** kiểm
**Then** không có host/port hardcoded trong source (R2)
**And** không có adapter localStorage riêng — đọc trực tiếp (R6)
**And** bundle không chứa hex color rải rác (R8)

---

## Case List

### Happy path

| # | Case | Trigger |
|---|------|---------|
| H1 | Build thành công | `npm run build` → `dist/` có index + assets |
| H2 | Preview serve được | `npm run preview` → trang chủ Vue hoạt động |
| H3 | Cùng origin — localStorage chia sẻ | Vue cùng origin với Legacy → đọc được dữ liệu cũ |

### Edge cases

| # | Case | Trigger |
|---|------|---------|
| E1 | Bundle asset path tuyệt đối | `index.html` dùng `/assets/...` (Vite default = absolute) |
| E2 | SPA fallback cần server config | Refresh trang con → cần rewrite về `index.html` |
| E3 | Proxy `/pages` ở dev vs prod khác nhau | Dev: Vite proxy. Prod: Legacy server serve cả hai |

### Error paths

| # | Case | Trigger |
|---|------|---------|
| L1 | Bundle path conflict với Legacy | Cả hai có `index.html` ở cùng root |
| L2 | API proxy fail ở prod | `/api` request không đến được API server |

### Invariant checks (R2, R6, R8)

| # | Invariant | Check |
|---|-----------|-------|
| I1 | No hardcoded host/port | `grep -r "localhost\|127.0.0.1\|:8080" dist/` → 0 |
| I2 | No localStorage adapter | Vue đọc `window.localStorage` trực tiếp |
| I3 | No hex in bundle | `grep -E "#[0-9a-fA-F]{3,6}" dist/assets/` → 0 |

---

## Deployment Strategy

### Option A — Legacy server serves Vue build (Recommended)

Legacy `server/index.js` thêm static handler cho `dist/`. Vue build được serve cùng Node process → **cùng origin**.

**Ưu:**
- Một process duy nhất
- Cùng port → cùng origin → FR6 nghiệm thu được
- Không cần infrastructure thêm

**Nhược:**
- Phải sửa `web-en/server/index.js` (AD-15 nhóm a)
- SPA fallback cần handler catch-all

**Code change (server/index.js):**
```javascript
// Sau các handler hiện có, thêm:
// Serve Vue build từ dist/
app.use(express.static(path.join(__dirname, '../../web-app/dist'), { index: 'index.html' }));
// SPA fallback - tất cả route không match về index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web-app/dist/index.html'));
});
```

### Option B — Sub-path deploy (Không khuyến nghị)

Vue ở `/app/`, Legacy ở `/`. Cần `vite.config.js`:
```javascript
export default defineConfig({
  base: '/app/',
  // ... routes trong router phải update prefix
});
```

**Nhược:** Route paths phải update, nhiều edge case, không justify effort ở giai đoạn này.

### Key constraint (AD-2)

**FR6 chỉ nghiệm thu được khi cùng origin.** Dev mode ở cổng riêng sẽ luôn fail — đây là ràng buộc đã biết từ AD-2, không phải bug.

### Chọn Option A

Triển khai Option A khi cần same-origin. Dev vẫn dùng Vite dev server riêng (localhost:5173) → origin khác → localStorage không chia sẻ → **ràng buộc đã biết**.

---

## Tasks

- [x] T-1: Chạy `npm run build` → verify `dist/` output
- [x] T-2: Kiểm `dist/index.html` asset paths
- [x] T-3: Nghiên cứu + chọn deployment strategy (Option A)
- [x] T-4: Viết tài liệu deployment vào story file
- [x] T-5: Verify invariants (R2, R6, R8)
- [ ] T-6: Cập nhật `docs/index.md` nếu cần (defer — constraint đã document ở đây)

---

## References

- [Source: projects/web-app/vite.config.js] — proxy hiện tại
- [Source: projects/web-app/dist/] — bundle đã build
- [Source: projects/web-en/server/index.js] — cách Legacy serve files
- [Source: Architecture Spine §Deferred] — deployment options
- [Source: epics.md#Story-2.4] — spec gốc
