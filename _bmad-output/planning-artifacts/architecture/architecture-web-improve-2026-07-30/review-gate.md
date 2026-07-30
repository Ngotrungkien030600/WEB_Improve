# Reviewer Gate — SkillForge Vue port spine

Ba lens chạy trong parent: `lint_spine.py` (xác định), lens *version reality-check*, lens *adversarial*. Không dùng subagent (đã ghi direction trong memlog).

## 1. lint_spine.py — PASS

`total_findings: 0`. Frontmatter đủ, AD id liên tục không trùng, mermaid parse được, không còn comment template.

## 2. Version reality-check — PASS, kèm 2 ghi chú

Mọi phiên bản trong §Stack lấy từ registry npm ngày 2026-07-30, không từ trí nhớ. Kiểm chéo tương thích:

| Kiểm | Kết quả |
|---|---|
| `vue-router@5.2.0` peer `vue` | `^3.5.34 \|\| ^4.0.0` → `vue@3.5.40` **thoả** |
| `@vitejs/plugin-vue@6.0.8` peer `vite` | `^5 \|\| ^6 \|\| ^7 \|\| ^8` → `vite@8.1.5` **thoả** |
| `vite@8.1.5` engines `node` | `^20.19.0 \|\| >=22.12.0` → node cục bộ v22.23.1 **thoả** |
| `vue-router@5.2.0` peer `pinia`, `@pinia/colada`, `vite`, `@vue/compiler-sfc` | tất cả `optional: true` → **không** xung đột với việc Deferred hoãn Pinia |

### Ghi chú
- **low** Sàn peer của vue-router 5.2.0 là `vue ^3.5.34`, trong khi `vue@latest` là 3.5.40 — biên chỉ 6 patch. Nếu về sau ghim vue thấp hơn 3.5.34 thì router vỡ. Không phải vấn đề hôm nay.
- **low** `vue@3.6.0-rc.2` đang ở nhánh rc, `latest` vẫn là 3.5.40. Spine ghim đúng `latest`, không đuổi theo rc.

## 3. Adversarial — 2 LỖ, cả hai đã bịt

Cách tấn công: dựng hai đơn vị một tầng dưới, mỗi đơn vị tuân thủ **mọi** AD đúng từng chữ, rồi tìm chỗ chúng vẫn build lệch nhau.

### Lỗ A — AD-4 và AD-6 mâu thuẫn trực tiếp (severity: high)

`quiz-logic.js:70,82` gọi `localStorage` **trực tiếp**. AD-4 nói logic giữ nguyên, không viết lại. AD-6 nói "không code nào ngoài adapter gọi `localStorage` trực tiếp". Một builder port màn quiz sẽ đụng ngay: tuân AD-6 thì phải sửa logic (vi phạm AD-4); tuân AD-4 thì có hai đường ghi vào `quizHistory` — logic Legacy và adapter Vue.

Hai trang cùng tuân thủ mọi AD vẫn ra hai kết quả: trang X gọi logic (ghi qua logic), trang Y gọi adapter (ghi qua adapter). Cùng một sự kiện, hai hình dạng bản ghi.

**Đã bịt:** AD-6 siết lại — phạm vi "chỉ adapter chạm storage" áp cho code **trong `web-app/`**; logic Legacy giữ đường ghi của nó; và Vue app **không được** tạo adapter cho một nơi lưu mà logic Legacy đã ghi — nó đọc/ghi *qua chính module logic đó*. Một nơi lưu, một người ghi.

### Lỗ B — không AD nào chi phối cách Vue với tới *dữ liệu* của Legacy (severity: high)

AD-3 và AD-5 nói về **logic**. Nhưng 10 file trong `web-en/js/data/` xuất bằng `window.*` chứ không `export` — `interview-data.js`, `learn-data.js`, `ai-data.js`, `search-index.js`… Không AD nào nói Vue app lấy dữ liệu đó bằng cách nào.

Hai trang tuân thủ mọi AD vẫn chọn khác nhau: trang X import file bằng `?raw` rồi tự parse; trang Y khai lại một bản dữ liệu trong `web-app/`. Cả hai đều không gán `window.*` (AD-5 sạch), đều không copy *logic* (AD-3 sạch) — mà vẫn đẻ ra hai đường nạp dữ liệu, đúng thứ cuộc port muốn giết. Trang Y còn tạo bản dữ liệu thứ hai sẽ lệch dần.

**Đã bịt:** thêm AD-16 — Vue app lấy dữ liệu Legacy **chỉ** qua `import` ESM từ `@legacy/data/…`; file nào chưa `export` thì **thêm** một dòng `export` bên cạnh phép gán `window.*` đang có (Legacy app không đổi hành vi, Vue app có đường import). Cấm `?raw`, cấm eval, cấm khai lại dữ liệu trong `web-app/`. AD-15 mở rộng allowlist để cho phép đúng thao tác thêm `export` này.

### Các cặp đã thử mà không tìm ra lỗ

- Hai trang tự viết vỏ thanh tiêu đề khác nhau → AD-12 đã chặn.
- Hai trang hardcode `localhost:8080` khác cách → AD-2 đã chặn.
- Hai trang đặt route khác hình dạng đường dẫn → AD-13 đã chặn.
- Hai component tự gọi API → AD-9 + AD-11 đã chặn.
- Hai bảng token lệch nhau → AD-8 đã chặn (import, không sao chép).
- Hai cơ chế nhúng 12 trang tĩnh → AD-14 đã chặn ("một cơ chế duy nhất cho cả 12").

## Verdict

Spine đứng được sau khi bịt hai lỗ. Điểm mạnh: mọi AD đều nêu được *divergence cụ thể* nó ngăn, phần lớn dẫn chiếu số đo thật của codebase. Điểm còn phải theo: AD-6 và AD-16 đều sinh ra thao tác sửa file trên `web-en/` — tức allowlist của AD-15 giờ có 4 nhóm thay vì 3, và mỗi lần nới allowlist là một lần rủi ro trên codebase không có test.
