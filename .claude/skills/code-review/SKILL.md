---
name: code-review
description: Review diff hiện tại, tìm bug và vấn đề chất lượng. Trình bày kết quả bằng tiếng Việt, nhóm theo mức độ nghiêm trọng.
argument-hint: <story-id hoặc --all>
---

# Code Review — WEB_Improve

## Bước 0 — Lấy diff

Chạy `git diff @{upstream}...HEAD`. Nếu rỗng, thử `git diff main...HEAD`, rồi `git diff HEAD~1`. Nếu vẫn rỗng, lấy uncommitted: `git diff HEAD`.

Đây là phạm vi review.

## Bước 1 — Tìm candidates (song song)

Chạy **5 angle** qua Agent tool, mỗi angle tìm tối đa 6 candidates:

### Angle A — Quét từng dòng diff
Đọc từng hunk. Hỏi: input/state/timing nào làm dòng này sai?
Tìm: điều kiện ngược, off-by-one, null/undefined deref, thiếu `await`, falsy-zero, error bị nuốt trong catch.

### Angle B — Kiểm tra behavior bị xóa
Với dòng bị DELETE/REPLACE, xác định invariant nó bảo vệ. Tìm xem code mới có thiết lập lại invariant không.

### Angle C — Kiểm tra callers/callees
Với function bị thay đổi, kiểm tra change có phá vỡ call site không: precondition mới, return shape thay đổi, exception mới.

### Angle D — Dọn dẹp & hiệu quả
- **Trùng lặp**: code mới re-implement thứ đã có
- **Phức tạp thừa**: state dư, copy-paste, nesting sâu, dead code
- **Lãng phí**: I/O lặp, computation dư

### Angle E — Tuân thủ chuẩn project (BẮT BUỘC)

Soi TỪNG dòng THÊM VÀO (`+`) trong diff. Mọi vi phạm dưới đây là một finding riêng.

**Nguồn chân lý:**
- `docs/repo-risks.md` — invariant surfaces R1-R8
- `docs/development-guide-legacy.md` — Legacy app conventions
- `docs/development-guide-vue.md` — Vue app conventions

**Comment rác (áp dụng cả `.js` LẪN `.vue`):**
- Comment **restate WHAT** ("lấy user", "tăng biến đếm") → xóa. Chỉ giữ comment giải thích **WHY** (ràng buộc/quyết định/cạm bẫy).
- **Story-ref trong code**: `AC1`, `case #N`, `R3`, `Story`, `Epic` prefix → finding. Ngoại lệ: ≤1 con trỏ trong file docstring.
- **Dead code, comment-out, `TODO` rải rác** → finding.
- Docstring thừa (mô tả lại điều tên hàm đã nói rõ) → finding.

**AD compliance (R1-R8):**
- R1: Layer violation — `components/` import từ `pages/` hoặc `storage/` → finding
- R2: Hardcoded host/port (`localhost:8080`, `127.0.0.1:8080`) → finding 🔴
- R3: Relative import `../web-en/` hoặc copy file từ Legacy → finding 🔴
- R4: `@legacy/features/**` import `vue` → finding 🔴
- R5: Gán `window.*` trong `web-app/` → finding 🔴
- R7: Navigation không qua ported-pages registry → finding
- R8: Hex color trong `<style scoped>` hoặc copy token → finding

**Vue conventions:**
- Component không có `CPascalCase` prefix → finding
- `<style>` không có `scoped` trên page component → finding
- `fetch()` trong `components/` hoặc `pages/` → finding 🔴

**Error handling:**
- `fetch()` không có `.catch()` → finding 🟡
- Error bị nuốt trong catch mà không log → finding

**Naming:**
- Identifier không phải English → finding
- UI string không phải Tiếng Việt → finding

## Bước 2 — Verify

Dedup candidates. Với mỗi candidate:
- **ĐÃ XÁC NHẬN**: xác minh bằng đọc code/dẫn dòng
- **CÓ THỂ XẢY RA**: race condition, nil trên error path hiếm
- **KHÔNG CÓ**: loại bỏ

Angle E (comment rác/AD compliance/convention): chỉ cần xác nhận dòng đó thật sự có trong diff.

## Bước 3 — Trình bày kết quả

---

## Kết quả Code Review

---

### 🔴 Nghiêm trọng
*(Bug có thể crash, data corruption, security issue — cần sửa trước khi merge)*

Với mỗi finding:
**N. [Tên vấn đề ngắn gọn]**
[file:line](file#Lline)
Mô tả vấn đề bằng tiếng Việt, 1-2 câu.
> **Sửa:** gợi ý cụ thể

---

### 🟡 Cần cải thiện
*(Logic sai nhỏ, code dễ gây bug sau, convention vi phạm)*

---

### 🟢 Gợi ý nhỏ
*(Trùng lặp nhẹ, simplification tùy chọn)*

---

**Tổng kết:** X lỗi nghiêm trọng, Y cần cải thiện, Z gợi ý nhỏ.

---

## Bước 4 — Sửa convention + lint (BẮT BUỘC)

Finding thuộc **Angle E** (comment rác, AD compliance, convention) là **vi phạm chuẩn — BẮT BUỘC sửa NGAY** trong session.

1. Sửa hết findings này trên file trong diff
2. Giữ nguyên hành vi runtime

**Ngoại lệ — KHÔNG tự sửa:**
- Finding **logic/bug** (🔴/🟡 từ A/B/C/D) làm đổi hành vi → nêu cách sửa, hỏi user

## Bước 5 — Cập nhật sprint-status

Sau khi trình bày, cập nhật `_bmad-output/implementation-artifacts/sprint-status.yaml`:

1. Xác định story đang review (từ argument hoặc git branch)
2. Đổi `development_status[<key>]`:
   - **hết 🔴** → `done`
   - **còn 🔴 chưa fix** → giữ `review`
3. Cập nhật comment sau dòng story:
   - `✅ CODE-REVIEWED <YYYY-MM-DD>` — không còn 🔴
   - `✅ CODE-REVIEWED <YYYY-MM-DD> (còn N 🔴 chưa fix)` — còn lỗi
4. Bump `last_updated`

## Notes

- Toàn bộ output = tiếng Việt
- Không in JSON thô
- File path dùng markdown link clickable: `[file:42](file#L42)`
- Không phát hiện vấn đề nào → "Không phát hiện vấn đề nào trong diff này."
