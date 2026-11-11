---
title: 'Mở rộng lộ trình 10 bài Backend thành bài học chuyên sâu'
type: 'feature'
created: '2026-11-11'
status: 'done'
review_loop_iteration: 0
baseline_commit: '77ca58fc0efba457bb99705bedc257826fdfb2f6'
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-web-improve-2026-07-30/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Trang nhập môn Backend hiện dồn 10 chủ đề vào một lần cuộn, mỗi chủ đề chỉ có giải thích và ví dụ ngắn nên người học khó nắm luồng làm việc thực tế. CRUD mới chỉ xuất hiện thoáng qua, chưa giải thích đủ bốn thao tác và cách chúng liên quan tới API, database, validation và quyền truy cập.

**Approach:** Chuyển trang hiện tại thành mục lục lộ trình và mở từng chủ đề trên một route bài học riêng. Làm sâu cả 10 bài theo ví dụ xuyên suốt về API quản lý đơn hàng, có hướng dẫn từng bước, đoạn code chú giải, lỗi thường gặp, checklist và bài tập nhỏ; CRUD phải được dạy đầy đủ trong chủ đề API và dữ liệu.

## Boundaries & Constraints

**Always:** Nội dung tiếng Việt, dễ hiểu cho người mới nhưng kỹ thuật chính xác. Giữ 10 chủ đề hiện có theo thứ tự. Mỗi bài có mục tiêu, giải thích khái niệm và luồng hoạt động, ví dụ áp dụng có chú giải, lỗi thường gặp, checklist và bài tập tự làm. Ví dụ CRUD phải có Create/Read/Update/Delete, method/endpoint, dữ liệu vào-ra, status cơ bản và liên hệ với SQL. Có mục lục, điều hướng bài trước/sau và quay về danh sách; responsive, giữ Vue router và token hiện có.

**Ask First:** Đổi danh sách hoặc thứ tự 10 chủ đề, thêm framework/backend stack làm trọng tâm bắt buộc, hoặc đưa nội dung sang Legacy.

**Never:** Giữ 10 bài ngắn gọn trên cùng một trang dài; bỏ CRUD; sửa `projects/web-en/`; thêm dependency hoặc lưu tiến độ học.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Vào lộ trình | Mở `/java/backend-basics` | Hiển thị mục lục 10 bài, mô tả và liên kết tới từng bài | Không có trạng thái lỗi |
| Mở bài học | Mở `/java/backend-basics/:lessonId` với ID hợp lệ | Hiển thị nội dung đầy đủ, bài trước/sau và đường về mục lục | Không có trạng thái lỗi |
| ID không hợp lệ | Mở route bài học với ID không nằm trong 10 bài | Chuyển về mục lục lộ trình | Dùng điều hướng Vue hiện có |
| Màn hình nhỏ | Viewport điện thoại | Nội dung một cột, code cuộn hoặc xuống dòng an toàn; điều hướng vẫn dùng được | Không có tràn ngang |

</frozen-after-approval>

## Code Map

- `projects/web-app/src/pages/BackendBasicsPage.vue` -- trang hiện tại; chuyển thành landing/mục lục.
- `projects/web-app/src/pages/BackendBasicsLessonPage.vue` -- khung dùng chung để hiển thị một bài theo route.
- `projects/web-app/src/data/backend-basics-lessons.js` -- dữ liệu và nội dung chi tiết của đúng 10 bài.
- `projects/web-app/src/router/index.js` -- thêm route tham số cho bài học, giữ route landing hiện tại.
- `projects/web-app/src/pages/JavaHubPage.vue` -- thẻ hiện có dẫn tới landing, giữ nguyên liên kết.

## Tasks & Acceptance

**Execution:**
- [x] `projects/web-app/src/pages/BackendBasicsPage.vue` -- thay trang cuộn dài bằng landing 10 bài có mô tả đủ rõ để chọn bài.
- [x] `projects/web-app/src/data/backend-basics-lessons.js` -- viết lại cả 10 nội dung sâu và nhất quán theo ví dụ xuyên suốt: HTTP/request-response; thiết kế API và CRUD; mô hình dữ liệu/SQL và CRUD; transaction; xác thực/phân quyền; validation/xử lý lỗi; bảo mật; kiểm thử; hiệu năng/cache/bất đồng bộ; triển khai/observability.
- [x] `projects/web-app/src/pages/BackendBasicsLessonPage.vue` -- tạo trang bài học có các phần mục tiêu, giải thích, luồng xử lý, ví dụ code chú giải, lỗi, checklist, bài tập và điều hướng trước/sau.
- [x] `projects/web-app/src/router/index.js` -- thêm route `/java/backend-basics/:lessonId`, bảo toàn route landing và các route Backend hiện có; ID không hợp lệ quay lại landing.

**Acceptance Criteria:**
- Given người học mở landing, when trang tải, then thấy đúng 10 thẻ bài có thể mở từng route riêng.
- Given bài học CRUD, when người học đọc phần thực hành, then phân biệt được Create/Read/Update/Delete và thấy ví dụ endpoint, method, request/response, status cơ bản cùng SQL tương ứng.
- Given bất kỳ bài nào, when người học mở, then bài có mục tiêu, khái niệm, giải thích luồng, ví dụ được chú giải, tối thiểu ba lỗi thường gặp, checklist và bài tập.
- Given người học đi hết bài hiện tại, when chọn bài trước/sau hoặc mục lục, then điều hướng tới đúng bài; route ID sai không làm trang lỗi.
- Given màn hình điện thoại, when xem mục lục, bài học và đoạn code, then bố cục không tràn ngang và các điều hướng vẫn thao tác được.
- Given ứng dụng đã có trang Backend và Legacy, when feature hoàn tất, then route/nội dung Backend cũ và toàn bộ `projects/web-en/` không đổi.

## Design Notes

Landing và bài học dùng chung dữ liệu bài để tránh hai mục lục lệch nhau. Route động tạo 10 URL rõ ràng nhưng chỉ cần một component bài học và một bộ dữ liệu có cấu trúc. Dùng ví dụ quản lý đơn hàng xuyên suốt: client gọi API, server kiểm tra quyền và dữ liệu, database lưu transaction, test xác nhận quy tắc, rồi theo dõi sau triển khai. Mỗi bài nên đủ để học riêng, không chỉ là phần mô tả một đoạn.

## Verification

**Commands:**
- `npm run build` trong `projects/web-app` -- expected: build thành công.

**Manual checks:**
- Mở landing và cả 10 route bài; xác nhận mục lục, CRUD, bài trước/sau, ID sai và link quay về.
- Kiểm tra bố cục hẹp, ví dụ code dài, route Backend cũ và `projects/web-en/` không thay đổi.

## Suggested Review Order

**Lộ trình và điều hướng**

- Bắt đầu từ landing 10 bài và cách giữ thao tác mở liên kết theo trình duyệt.
  [`BackendBasicsPage.vue:37`](../../projects/web-app/src/pages/BackendBasicsPage.vue#L37)

- Xem trang bài học dùng chung, mục lục nội bộ và điều hướng trước/sau.
  [`BackendBasicsLessonPage.vue:1`](../../projects/web-app/src/pages/BackendBasicsLessonPage.vue#L1)

- Kiểm tra route động và cách xử lý ID bài học không hợp lệ.
  [`index.js:290`](../../projects/web-app/src/router/index.js#L290)

**Nội dung và tính chính xác**

- Đọc CRUD đầy đủ từ endpoint và status tới SQL có tham số.
  [`backend-basics-lessons.js:76`](../../projects/web-app/src/data/backend-basics-lessons.js#L76)

- Đối chiếu schema, khóa ngoại cascade và các câu SQL CRUD.
  [`backend-basics-lessons.js:189`](../../projects/web-app/src/data/backend-basics-lessons.js#L189)

- Kiểm tra transaction, trạng thái thanh toán và dữ liệu đơn bắt buộc.
  [`backend-basics-lessons.js:306`](../../projects/web-app/src/data/backend-basics-lessons.js#L306)
