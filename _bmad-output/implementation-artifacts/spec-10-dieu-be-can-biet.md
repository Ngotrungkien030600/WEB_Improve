---
title: 'Trang nhập môn 10 điều Backend cần biết'
type: 'feature'
created: '2026-11-11'
status: 'done'
review_loop_iteration: 0
baseline_commit: '8d45e881ebce1e25bca8c49de2c72ad2467c3e70'
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-web-improve-2026-07-30/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Người mới học Backend cần một trang nhập môn chọn lọc, giải thích có hệ thống những kiến thức nền tảng cần biết trước khi đi sâu vào các chủ đề như SQL, Kafka, Docker và System Design. Trang Backend hiện tại chủ yếu là tài liệu chuyên sâu và chưa đóng vai trò lộ trình nhập môn dễ theo dõi.

**Approach:** Tạo một trang Vue riêng gồm đúng 10 bài nền tảng, giải thích bằng tiếng Việt chi tiết, có mục lục nhảy đến bài, ví dụ thực tế, lỗi thường gặp và checklist tự kiểm tra. Thêm liên kết từ hub Java; giữ nguyên trang Backend Legacy và mọi nội dung hiện có.

## Boundaries & Constraints

**Always:** Dùng tiếng Việt cho nội dung; thiết kế responsive theo token và style hiện hành của Vue app; mỗi bài làm rõ khái niệm, lý do quan trọng, cách áp dụng, ví dụ, lỗi thường gặp và điều cần nhớ. Giữ nguyên Legacy, chỉ dùng Vue router cho trang mới và điều hướng theo cơ chế hiện có.

**Ask First:** Thay đổi phạm vi 10 chủ đề, thay trang Backend hiện có, hoặc sửa trang Legacy/kiến trúc điều hướng.

**Never:** Sửa hoặc chuyển nội dung từ `projects/web-en/`; không biến bài nhập môn thành một bản sao dài của tài liệu Backend hiện tại; không thêm thư viện phụ thuộc hoặc tính năng lưu tiến độ.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mở trang | Điều hướng từ hub Java hoặc URL trực tiếp | Hiển thị đủ 10 bài và mục lục; mỗi liên kết cuộn tới đúng bài | Không có trạng thái lỗi cần xử lý |
| Màn hình hẹp | Viewport điện thoại | Nội dung một cột, không tràn ngang; mục lục vẫn dùng được | Không có trạng thái lỗi cần xử lý |
| URL không tồn tại | Route không khớp router | Giữ nguyên hành vi trang not-found hiện có | Không thêm fallback riêng |

</frozen-after-approval>

## Code Map

- `projects/web-app/src/pages/JavaHubPage.vue` -- hub Java hiện tại, nơi thêm thẻ dẫn vào bài nhập môn.
- `projects/web-app/src/router/index.js` -- khai báo route Vue cho trang mới.
- `projects/web-app/src/pages/BackendSectionPage.vue` -- trang Backend chuyên sâu để tham khảo và tránh lặp nội dung.
- `projects/web-en/pages/java/backend.html` -- nguồn Legacy cần giữ nguyên, tham khảo phạm vi nội dung hiện có.
- `projects/web-app/src/styles/main.css` -- token toàn cục được trang Vue dùng gián tiếp.

## Tasks & Acceptance

**Execution:**
- [x] `projects/web-app/src/pages/BackendBasicsPage.vue` -- tạo trang nhập môn responsive với đúng 10 bài, mục lục neo và điều hướng về hub.
- [x] `projects/web-app/src/router/index.js` -- thêm route `/java/backend-basics` tới component mới, không đổi route hiện hữu.
- [x] `projects/web-app/src/pages/JavaHubPage.vue` -- thêm thẻ nhập môn Backend có mô tả và đường dẫn tới route mới.
- [x] Nội dung trong `BackendBasicsPage.vue` -- bao quát: HTTP và request/response; thiết kế API; mô hình dữ liệu và SQL; transaction/tính nhất quán; authentication và authorization; validation/lỗi; bảo mật; kiểm thử; hiệu năng/cache/xử lý bất đồng bộ; triển khai/quan sát vận hành. Mỗi chủ đề có khái niệm, ý nghĩa, cách áp dụng, ví dụ, lỗi phổ biến và checklist.

**Acceptance Criteria:**
- Given ứng dụng Vue đã khởi chạy, when người dùng chọn thẻ Backend nhập môn ở hub Java, then trang mới mở đúng route và có thể quay lại hub.
- Given người dùng mở trực tiếp `/java/backend-basics`, when trang tải xong, then có đúng 10 chủ đề bằng tiếng Việt và mục lục dẫn đúng đến từng chủ đề.
- Given nội dung được đọc trên điện thoại, when viewport hẹp, then văn bản và ví dụ không gây tràn ngang, các liên kết mục lục vẫn thao tác được.
- Given các trang Backend hiện có, when thêm trang nhập môn, then route cũ và nội dung Legacy không bị thay đổi.

## Design Notes

Giữ đây là một trang cuộn dài có mục lục neo, không tạo 10 route con hay thêm trạng thái tiến độ. Nội dung hướng tới người mới: dùng tình huống gần thực tế (đăng nhập, tạo đơn, thanh toán) để nối các khái niệm với nhau; chỉ dùng đoạn mã ngắn khi giúp minh họa rõ hơn.

## Verification

**Commands:**
- `npm run build` trong `projects/web-app` -- expected: build Vue thành công.

**Manual checks:**
- Mở hub Java, vào trang mới; kiểm tra đủ 10 mục lục, từng neo, link quay lại và bố cục điện thoại.
- Kiểm tra `projects/web-en/` và route `/java/backend/:sectionId` không bị thay đổi.

## Suggested Review Order

**Nội dung trang**

- Bắt đầu từ khung trang để nắm mục lục, điều hướng và cấu trúc mỗi bài.
  [`BackendBasicsPage.vue:1`](../../projects/web-app/src/pages/BackendBasicsPage.vue#L1)

- Đọc mảng dữ liệu để kiểm tra đủ 10 chủ đề và cách diễn giải thống nhất.
  [`BackendBasicsPage.vue:97`](../../projects/web-app/src/pages/BackendBasicsPage.vue#L97)

- Kiểm tra bố cục chuyển từ desktop sang một cột trên màn hình nhỏ.
  [`BackendBasicsPage.vue:529`](../../projects/web-app/src/pages/BackendBasicsPage.vue#L529)

**Điều hướng**

- Xem thẻ nhập môn mới cạnh nội dung Backend chuyên sâu trong hub Java.
  [`JavaHubPage.vue:160`](../../projects/web-app/src/pages/JavaHubPage.vue#L160)

- Xác nhận route riêng không thay đổi các route Backend hiện có.
  [`index.js:284`](../../projects/web-app/src/router/index.js#L284)
