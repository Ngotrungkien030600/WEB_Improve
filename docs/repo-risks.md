# Repo Risks — WEB_Improve

**Nguồn:** Architecture Spine (AD-1..AD-17) + Epics.md + Known Bugs

**Mục đích:** Surface invariant mà mọi story phải bảo toàn. Story chạm R1-R8 → mode **Hard** (bắt buộc).

---

## Invariant Surfaces

### R1 — Layer boundary
`pages/` import từ `components/` + `storage/` + `api/` + `@legacy/`. `components/` **chỉ** import token. `storage/`/`api/` import **không gì** từ Vue.

### R2 — Single origin
Không hardcode host/cổng trong source. Mọi path giữa 2 app là relative. Vite proxy `/api` và `/pages/**`.

### R3 — `@legacy` là đường DUY NHẤT và một chiều vào Legacy
Không import từ `../web-en/` (tương đối). Không copy file logic. Legacy **không được biết** Vue tồn tại.

### R4 — Business logic framework-free
`@legacy/features/**` không import `vue`. Thích nghi ở tầng `pages/`.

### R5 — Không gán `window.*` mới trong `web-app/`
Logic đọc `window.*` phải nhận qua tham số, có default giữ đường cũ.

### R6 — Storage ownership cố định
10 key `localStorage` + 2 IndexedDB giữ nguyên owner. Một nơi lưu, đúng một người ghi. Vue đi qua module Legacy để ghi/đọc, không adapter song song.

### R7 — Ported page registry
Một file khai danh sách trang đã chuyển. Mọi điều hướng qua helper đọc file đó. Trong-danh-sách → router. Ngoài → Legacy.

### R8 — Token là nguồn DUY NHẤT
Import `web-en/css/variables.css`. Không hex, không `px` cứng trong `components/`.

---

## Known Bugs (chưa fix)

| ID | Severity | Location | Issue | Story |
|----|----------|----------|-------|-------|
| S1 | HIGH | server/index.js | Path traversal | ✅ 1.1 (done) |
| S2 | MEDIUM | server/index.js | 4 AI endpoints không auth | — |
| S3 | LOW | server/index.js | Request body unlimited | — |
| S4 | LOW | handleSalaryInterview | Dead variable | — |
| S5 | LOW | config.js + agents-config.js | System prompt lặp | — |
| C1 | HIGH | js/agents/bmad-chat.js:7 | `fetch(undefined)` | 1.2 |
| C2 | MEDIUM | css/agents/bmad-chat.css | Orphan CSS | 1.2 |
| C3 | LOW | js/home-ai.js | Dead code | — |
| C4 | LOW | js/utils/markdown.js | 2 parser version | — |

---

## AC Quality Rules

Mỗi AC phải thỏa:

1. **Input → Output rõ ràng.** "User làm X → thấy Y" — không "nên", "có thể".
2. **Happy path + error path.** AC happy path là cửa vào, nhưng phải có ít nhất 1 AC cho error/edge.
3. **Invariant reminder.** Nếu story chạm R1-R8, AC phải nhắc invariant đó.
4. **Không mơ hồ.** "Hoạt động tốt" không phải AC. "Không crash", "Không 404" là AC.

---

## Code Standards

### Đặt tên
- Identifier: **Tiếng Anh**
- UI string, comment, message: **Tiếng Việt**

### Feature modules (Legacy)
`<name>-logic.js` (hàm thuần) + `<name>-ui.js` (DOM)

### Vue components
- Shared: `CPascalCase.vue` (role-based: `CCard`, `CButton`, `CTopbar`)
- Page: `PascalCasePage.vue`
- `<style scoped>` cho page components

### Ternary
≤2 tầng — tách `if/else`

### Error handling
Một shape chuẩn từ `api/`. Network error không im lặng.

### Test
Dự án **chưa có test tự động**. FR-6 acceptance là **kiểm thủ công** theo 5 mục (bố cục khối, màu, khoảng cách, cỡ/kiểu chữ, trạng thái hover).

---

## Sprint Conventions

- **dev-story** → implement → stamp `**Implemented:**` → status `review`
- **code-review** → check → stamp `**Hardened:**` → status `done`
- Sprint status: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story file: `_bmad-output/implementation-artifacts/<story-key>.md`
