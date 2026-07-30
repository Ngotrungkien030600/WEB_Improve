# Addendum — Port SkillForge sang Vue 3 + Vite

Nội dung ở đây là chiều sâu **thuộc về tài liệu phía sau** (`bmad-architecture`, solution design) hoặc là lý do đằng sau một quyết định đã chốt. Nó không nằm trong PRD vì PRD nói *năng lực cần có*, không nói *cách làm*.

---

## A. Vì sao Vue 3 chứ không React

Bốn lựa chọn đã được đặt cạnh nhau: Vue 3 + Vite, React + Vite, Nuxt 3, Next.js. Chốt Vue 3 + Vite.

**Lý do quyết định — chi phí port đo được trên chính codebase này:**

| Yếu tố | Số đo | Vue | React |
|---|---|---|---|
| HTML phải chuyển | 5.308 dòng | vào thẳng `<template>`, chỉ đổi `@click`, `v-for`, `:class` | mọi dòng phải sửa: `class`→`className`, `for`→`htmlFor`, thẻ tự đóng |
| CSS inline rải rác | 730 dòng / 22 trang | `<style scoped>` nuốt trọn, chưa cần đặt lại tên class | phải chọn thêm giải pháp CSS (Modules/Tailwind/styled) |
| `style="..."` trong HTML | 40 chỗ | giữ nguyên chuỗi | phải đổi thành object |

Chênh lệch ước lượng: ~2–3 tuần công (Vue) so với ~3–5 tuần (React).

**Lý do bị bỏ qua có ý thức:** React mạnh hơn về hệ sinh thái và giá trị tuyển dụng — đáng kể vì SkillForge chính là app luyện phỏng vấn và có sẵn trang dạy về framework. Người xây đã cân và chọn chi phí port thấp.

**Vì sao không Nuxt/Next:** app là công cụ dùng riêng trên localhost, không cần SEO hay SSR. Routing theo file là thứ hay nhưng chưa trả lại giá trị tương xứng với độ phức tạp thêm vào ở mức độ cá nhân. Nếu về sau muốn public, Nuxt là đường nâng cấp tự nhiên từ Vue 3 — đó là một phần lý do chọn Vue thay React.

---

## B. Cơ chế strangler — vì sao chạy song song chứ không big-bang

Ba lựa chọn đã cân: từng phần chạy song song, port một lần dứt điểm, chỉ port phần động.

Chốt **từng phần chạy song song**, vì lý do nằm ở một số đo cụ thể: **không có test nào trong toàn dự án**. Big-bang cộng với không-test nghĩa là giữa chừng không có gì chạy được để so sánh, và không có lưới nào bắt lỗi. Rủi ro không đối xứng — strangler cho phép dừng ở bất kỳ điểm nào mà vẫn có sản phẩm chạy.

Nợ đi kèm mà PRD đã ghi nhận: hai app sống song song là bảo trì hai chiều. Câu hỏi mở #4 trong PRD hỏi đúng chuyện đó.

---

## C. Vì sao giữ nguyên API server

Server hiện tại 500 dòng, **zero dependency**, ba file tách lớp sạch (`config` không import gì, `ai-service` chỉ import `config`, `index` import cả hai, không phụ thuộc vòng). Nó chạy tốt và không phải nút thắt của cuộc port.

Viết lại bằng Express/Fastify sẽ thêm dependency mà không mua thêm năng lực nào PRD cần. Chuyển serverless thì giải quyết được lỗ S1 "miễn phí" (không còn static handler tự viết) — nhưng đó là đổi kiến trúc triển khai, thuộc câu hỏi mở #1, không thuộc MVP.

Trong đợt này server chỉ nhận đúng một thay đổi: vá S1 (FR-8).

---

## D. Chi tiết kỹ thuật của hai lỗi phải vá

### S1 — path traversal + rò file bí mật

Hai khiếm khuyết cộng lại: `path.join(ROOT, urlPath)` không kiểm tra kết quả có còn trong `ROOT`, và MIME fallback `application/octet-stream` cho phép trả bất kỳ loại file.

Đã tái hiện bằng chạy thật:
```
GET /.env            → 200 · application/octet-stream · 192 byte
GET /../README.md    → 200 · 8.579 byte   (ngoài ROOT)
GET /../.gitignore   → 200 · 291 byte     (ngoài ROOT)
GET /khong-ton-tai   → 404                (đối chứng)
```

Hướng vá (thuộc architecture, không thuộc PRD): sau `path.join`, kiểm `path.resolve(filePath).startsWith(path.resolve(ROOT))`; allowlist phần mở rộng thay vì fallback octet-stream; chặn tường minh mọi đường dẫn chứa dotfile.

### C1 — chat gọi vào `undefined`

`js/agents/bmad-chat.js:7` destructure `BMAD_API_ENDPOINT`, nhưng `js/agents/agent-constants.js:5` khai khoá là `BMAD_CHAT`. Biến thành `undefined`, `fetch(undefined)` thành URL tương đối `"undefined"`.

Đã tái hiện:
```
POST /undefined       → 404 · text/html          (client gọi resp.json() trên HTML này → ném lỗi)
POST /api/bmad/chat   → 400 · application/json   (endpoint thật vẫn sống)
```

Đi kèm C2: `css/agents/bmad-chat.css` 342 dòng không trang nào `<link>` tới — nên dù sửa được C1 thì màn chat vẫn là DOM trần. Hai lỗi phải vá cùng nhau mới ra một màn dùng được, nên FR-9 gộp cả hai.

---

## E. Nợ vocab và đặt tên (đầu vào cho architecture)

Legacy app đặt tên class theo **trang**; đích đến là đặt tên theo **vai trò**. Phân bố hiện tại cho thấy mức độ silo:

```
ai- 93 · sk- 61 · exam- 57 · interview- 48 · learn- 36 · forge- 34 · home- 30 · bmad- 25
quiz- 21 · game- 17 · hub- 13 · party- 12 · ember- 12 · focus- 11 · story- 9 · scramble- 8
```

Không prefix nào mang nghĩa "dùng chung". `css/components.css` đúng ra phải là tầng đó nhưng chỉ 3 trang game link tới.

Quy ước định danh của repo (đã ghi trong `CLAUDE.md`): định danh tiếng Anh, comment và chuỗi UI tiếng Việt. Nghĩa là component tên `CCard` chứ không `TheCard`/`TheThe`, và không được dịch tên component sang tiếng Việt.

---

## F. Ba nơi lưu chồng lấn — cần chốt ở architecture

Lịch sử làm bài hiện được ghi ở ba chỗ: `quizHistory` (localStorage, không tiền tố), `skillforge_exam_history` (localStorage), và store `sessions` trong IndexedDB `SkillForgeProgress`. Không có nguồn sự thật duy nhất.

FR-6 yêu cầu bản Vue dùng **cùng** store để tiến độ cũ đọc được. Nhưng "cùng store" nào, khi có ba? Đây là câu hỏi cho `bmad-architecture`, không phải cho PRD.

Kèm theo: `progress-db.js` đã tăng `dbVersion` lên 2 mà **không có code migrate** dữ liệu từ v1. Nếu port có đổi hình dạng dữ liệu thì phải viết nhánh migrate — dữ liệu nằm trong browser người dùng, không reset được từ xa.
