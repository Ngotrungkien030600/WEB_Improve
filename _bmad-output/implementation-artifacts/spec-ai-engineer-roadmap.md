---
title: 'Lộ trình AI Engineer từ số 0 tới năng lực ứng tuyển'
type: 'feature'
created: '2026-11-16'
status: 'done'
review_loop_iteration: 0
baseline_commit: '0d458e43a03a2ff8300cba45dab9c4f92acfd4a0'
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-web-improve-2026-07-30/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Người mới muốn chuyển sang AI Engineering thường khó phân biệt AI Engineer với Data Scientist/Researcher, không biết nên học Computer Science hay Data Science trước, và khó hình dung công việc thực tế cần làm.

**Approach:** Tạo một trang tiếng Việt duy nhất, dẫn dắt từ chưa biết AI Engineering tới năng lực làm dự án và chuẩn bị ứng tuyển. Trang giải thích vai trò, kiến thức nền cần thiết, thứ tự học, sản phẩm thực hành và thực tế tuyển dụng mà không hứa hẹn một thời hạn đổi nghề cố định.

## Boundaries & Constraints

**Always:** Viết dễ hiểu cho người mới nhưng chính xác; giải thích AI Engineer thiên về xây dựng, tích hợp, đánh giá và vận hành hệ thống AI, phân biệt với Data Scientist và AI Researcher. Trả lời trực tiếp Computer Science cần học gì và Data Science giúp gì: nêu phần nền tảng cần thiết, phần có thể học theo nhu cầu, không yêu cầu bằng cấp hay học toàn bộ giáo trình CS/DS trước khi bắt đầu. Lộ trình theo thứ tự có mục tiêu đầu ra: Python và công cụ lập trình; nền tảng CS/API/SQL; toán và thống kê vừa đủ; ML/DL căn bản; LLM/RAG và đánh giá; triển khai, theo dõi và portfolio. Có ví dụ dự án tăng dần độ khó, mô tả một ngày/công việc thực tế, tiêu chí sẵn sàng ứng tuyển và những kỳ vọng/thách thức thực tế. Bố cục một trang có mục lục/điểm nhảy, responsive, dùng Vue Router và CSS token hiện có; thêm lối vào dễ tìm từ AI Hub.

**Ask First:** Bắt buộc chọn một ngôn ngữ/framework/cloud provider hoặc giới hạn lộ trình vào một nhánh tuyển dụng cụ thể; chuyển trang sang Legacy.

**Never:** Hứa chắc có việc sau một số tuần/tháng; ám chỉ phải học hết Computer Science hoặc Data Science mới được làm AI Engineer; biến trang thành các bài học route riêng, quiz, theo dõi tiến độ hoặc khóa học trả phí; sửa `projects/web-en/` hay các trang AI hiện hữu ngoài việc thêm liên kết cần thiết.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Vào lộ trình | Mở `/ai/engineer` hoặc đi từ AI Hub | Hiển thị trang lộ trình từ số 0, các phần có thể tới trực tiếp qua mục lục | Route do Vue Router xử lý |
| Đường dẫn chưa đăng ký | Mở `/ai/engineer/unknown` | Không chiếm nhầm trang lộ trình; hành vi theo catch-all/router hiện có | Không thêm fallback im lặng |
| Màn hình nhỏ | Viewport điện thoại, mục dài hoặc code dài | Một cột, không tràn ngang; các liên kết nội bộ vẫn hoạt động | Code/chuỗi dài được cuộn hoặc ngắt an toàn |

</frozen-after-approval>

## Code Map

- `projects/web-app/src/pages/AiEngineerRoadmapPage.vue` -- trang một màn hình cuộn với nội dung, mục lục và điều hướng về AI Hub.
- `projects/web-app/src/router/index.js` -- route mới `/ai/engineer`.
- `projects/web-app/src/utils/ported-pages.js` -- đăng ký route để điều hướng nội bộ đi qua Vue.
- `projects/web-app/src/pages/AiHubPage.vue` -- thêm liên kết dễ thấy tới lộ trình, không thay đổi hoạt động các tab.

## Tasks & Acceptance

**Execution:**
- [x] `projects/web-app/src/pages/AiEngineerRoadmapPage.vue` -- xây dựng nội dung lộ trình một trang có thứ tự học rõ, mục tiêu đầu ra, dự án gợi ý, thực tế công việc và tiêu chí ứng tuyển.
- [x] `projects/web-app/src/router/index.js` và `projects/web-app/src/utils/ported-pages.js` -- đăng ký `/ai/engineer` theo quy ước router và điều hướng của Vue app.
- [x] `projects/web-app/src/pages/AiHubPage.vue` -- thêm đường dẫn tới lộ trình mà không làm đổi hành vi hiện tại của hub.

**Acceptance Criteria:**
- Given người học không biết AI Engineering, when đọc phần mở đầu, then hiểu vai trò này làm gì và khác Data Scientist/Researcher ra sao.
- Given người học chưa biết nên học CS hay DS, when đọc phần nền tảng, then biết kỹ năng nào cần học trước, phần nào chỉ cần học theo nhu cầu và vì sao.
- Given người học muốn chuyển nghề, when theo lộ trình, then thấy thứ tự các chặng, năng lực đầu ra và dự án thực hành phù hợp cho từng mức.
- Given người học xem phần thực tế nghề nghiệp, when cân nhắc chuyển ngành, then thấy ví dụ công việc thực tế, thách thức và tiêu chí ứng tuyển mà không bị hứa hẹn việc làm/thời hạn thiếu căn cứ.
- Given người học truy cập qua AI Hub hoặc URL trực tiếp, when trang mở, then tới đúng trang mới; các route/tab AI hiện có tiếp tục hoạt động.
- Given viewport hẹp, when đọc trang và dùng mục lục, then nội dung không tràn ngang và các liên kết nội bộ dùng được.

## Design Notes

Lộ trình nên giúp người mới bắt đầu làm sản phẩm nhỏ sớm thay vì đặt toán nâng cao làm cổng vào. Ví dụ xuyên suốt có thể tiến từ Python xử lý dữ liệu, một mô hình phân loại đơn giản, tới trợ lý hỏi đáp tài liệu có retrieval, đánh giá chất lượng, API và theo dõi chi phí/độ trễ. Nêu rõ đây là các lớp năng lực có thể chồng lấp; tên vị trí và yêu cầu tuyển dụng khác nhau theo công ty.

## Verification

**Commands:**
- `npm run build` trong `projects/web-app` -- passed; Vite production build hoàn tất.
- `git diff --check` -- passed.

**Manual checks:**
- Với phiên test tạm thời, `/ai/engineer` render đủ 5 phần; mục lục nhảy tới `#foundations`; liên kết AI Hub đổi route sang `/ai/engineer`.
- Kiểm tra viewport desktop và 390px: `scrollWidth` bằng `clientWidth`, không tràn ngang. Đã xóa session test sau kiểm tra.
- Khi chưa đăng nhập, router chuyển về `/login?next=...` theo guard có sẵn; chưa xác nhận trực quan sau đăng nhập bằng tài khoản người dùng.

## Suggested Review Order

**Nội dung và lộ trình**

- Bắt đầu từ lời dẫn để nắm mục tiêu trang và cách định vị nghề.
  [`AiEngineerRoadmapPage.vue:13`](../../projects/web-app/src/pages/AiEngineerRoadmapPage.vue#L13)

- Đối chiếu câu trả lời CS hay Data Science và các nền tảng cần thiết.
  [`AiEngineerRoadmapPage.vue:65`](../../projects/web-app/src/pages/AiEngineerRoadmapPage.vue#L65)

- Theo dõi thứ tự học qua mục tiêu đầu ra của từng chặng.
  [`AiEngineerRoadmapPage.vue:101`](../../projects/web-app/src/pages/AiEngineerRoadmapPage.vue#L101)

- Kiểm tra portfolio, thực tế công việc và tiêu chí sẵn sàng ứng tuyển.
  [`AiEngineerRoadmapPage.vue:161`](../../projects/web-app/src/pages/AiEngineerRoadmapPage.vue#L161)

**Điều hướng và giao diện**

- Xác nhận route lười tải cho trang lộ trình mới.
  [`index.js:38`](../../projects/web-app/src/router/index.js#L38)

- Kiểm tra cả route và nhãn trong registry điều hướng.
  [`ported-pages.js:6`](../../projects/web-app/src/utils/ported-pages.js#L6)

- Rà soát lối vào từ AI Hub tới lộ trình.
  [`AiHubPage.vue:12`](../../projects/web-app/src/pages/AiHubPage.vue#L12)

- Kết thúc bằng các breakpoint cho màn hình hẹp.
  [`AiEngineerRoadmapPage.vue:650`](../../projects/web-app/src/pages/AiEngineerRoadmapPage.vue#L650)
