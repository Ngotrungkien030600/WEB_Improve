# Story 12-1 — Cutover: Vue là app chính, legacy giữ làm fallback

**Epic:** Epic 12 — Chuyển hẳn sang Vue
**Story ID:** 12-1-cutover-vue-app-chinh
**Status:** review
**Implemented:** dev-story (2026-09-09)

---

## Context

Port trang đã xong (registry `PORTED_PAGES` phủ 39/39 trang legacy). Người dùng yêu cầu "đổi tất cả qua Vue" → chốt 2 lựa chọn: (1) Vue là app chính, `web-en/` giữ làm fallback; (2) chạy bằng Vite dev 5173. Sau đó nghiệm thu thêm: 301 server-side cho `/pages/*.html`, start server :8080, cập nhật docs.

## Thay đổi

- **`web-app/src/utils/legacy-redirect.js`** (mới): nguồn ánh xạ duy nhất `file legacy → route Vue` (39 mục + quy ước mặc định `X.html ↔ /X` theo registry).
- **`web-app/src/components/CNavRedirect.vue`**: bỏ bảng cứng, dùng `legacyFileToRoute`, xử lý tiền tố `pages/`, `window.location.replace`.
- **`web-app/vite.config.js`**: plugin `legacyPageRedirect` — ở dev, `/pages/<đã port>.html` → 301 sang route Vue (chạy trước proxy `/pages`).
- **`web-app/src/utils/ported-pages.js`**: không đổi (đã đủ).
- **`web-en/server/config.js`**: export `VUE_DIST_DIR` → `../../web-app/dist`.
- **`web-en/server/index.js`**: root `/` + `/index.html` → serve `dist/index.html` (Vue); `/assets/*` từ `dist/`; SPA fallback khi ENOENT + `Accept: text/html`; handler 301 cho `GET /pages/*.html` sang route Vue (3 hub lệch quy ước: `ai/hub→/ai`, `cloud/hub→/cloud`, `devops/hub→/devops`, giữ query).
- **`web-app/dist/`**: rebuild (chore riêng).
- **Docs**: `docs/index.md` cập nhật phần chạy + trạng thái cutover.

## Verify (chạy thật 2026-09-09)

| Kiểm tra | Kết quả |
|---|---|
| Dev 5173: `/pages/english.html`, `/pages/devops/docker.html`, `/pages/bmad-agents.html` | 301 → `/english`, `/devops/docker`, `/bmad-agents` |
| Dev 5173: deep-link `/java/hub` | 200, body Vue (`#app`) |
| Node :8080: `GET /` | 200 — index Vue |
| Node :8080: `GET /english` (deep-link) | 200 — SPA fallback → Vue |
| Node :8080: `/pages/english.html`, `/pages/cloud/hub.html`, `/pages/devops/aws.html` | 301 → `/english`, `/cloud`, `/devops/aws` |
| Node :8080: `/.env`, API invalid body, `/js/agents/bmad-chat.js`, asset Vue | 404 / 400 / 200 / 200 |
| `npm run build` web-app | PASS |

## AC

- [x] Mở URL legacy `/pages/*.html` (dev + node server) → không bao giờ thấy MPA cũ, chỉ sang Vue.
- [x] Root/deep-link đều phục vụ bản Vue; localStorage chia sẻ (cùng origin).
- [x] Legacy `web-en/` không xoá gì — file còn nguyên làm fallback; `/js`, `/css`, `/api` vẫn chạy.
- [x] Không hardcode host/port mới; không thêm `window.*`; không thêm `export` vào source classic.

**Trạng thái:** review — chờ duyệt mắt UI toàn app trên bản Vue (5173 hoặc 8080) trước khi chốt `done`.
