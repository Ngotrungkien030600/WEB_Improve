---
title: 'Tích hợp lộ trình AI Engineer vào trang Học AI'
type: 'feature'
created: '2026-11-16'
status: 'done'
review_loop_iteration: 0
baseline_commit: 'd8cf61084e5fcc0ed2b427fa7431ccb64028d509'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Nội dung Học AI và lộ trình AI Engineer đang nằm ở hai trang, khiến người học phải rời Hub và có nhiều lối vào trùng nhau.

**Approach:** Đưa lộ trình thành tab thứ năm ngay trong trang `/ai`, gỡ thẻ quảng bá trong Hub và thẻ riêng ở trang chủ. Giữ `/ai/engineer` làm route chuyển tiếp tới `/ai?tab=engineer` để bookmark hoặc link cũ vẫn mở đúng tab.

## Boundaries & Constraints

**Always:** Giữ nguyên bốn tab hiện tại Học, Thi, Phỏng vấn, Làm Project và toàn bộ nội dung/tiến độ của chúng. Tab AI Engineer giữ đủ nội dung vai trò, CS vs Data Science, 5 chặng học, portfolio, thực tế công việc và tiêu chí ứng tuyển. Vào `/ai?tab=engineer` hoặc route chuyển tiếp phải mở đúng tab; tải lại trang vẫn giữ tab đó. Dùng Vue/router và CSS hiện có; responsive; không sửa các file `projects/web-app/dist/` đang có thay đổi.

**Ask First:** Thay đổi nội dung lộ trình ngoài điều chỉnh bố cục cần để đặt vào tab; đổi hành vi hoặc nội dung bốn tab AI hiện hữu.

**Never:** Xóa tính năng Học AI; tạo trang lộ trình riêng thứ hai; giữ card trang chủ hoặc banner điều hướng trùng lặp; làm URL `/ai/engineer` thành trang độc lập sau khi tích hợp.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Chọn tab | Bấm AI Engineer trong `/ai` | Hiện nội dung lộ trình trong cùng trang, các tab còn lại không bị đổi nội dung | Không tải route độc lập |
| Deep link/tab reload | Mở `/ai?tab=engineer`, refresh hoặc mở `/ai/engineer` cũ | Hiện đúng tab lộ trình | Query tab không hợp lệ quay về tab Học |
| Màn hình hẹp | Mở tab lộ trình trên điện thoại | Nội dung một cột, không tràn ngang | Giữ hành vi responsive hiện có |

</frozen-after-approval>

## Code Map

- `projects/web-app/src/pages/AiHubPage.vue` -- thêm tab lộ trình và hiển thị component nội dung trong hub.
- `projects/web-app/src/pages/AiEngineerRoadmapTab.vue` -- component nội dung lộ trình nhúng trong tab, không còn vỏ trang riêng.
- `projects/web-app/src/router/index.js` -- đổi route cũ thành redirect tương thích.
- `projects/web-app/src/utils/ported-pages.js` -- giữ alias cũ cho điều hướng sau đăng nhập và ghi rõ đích tích hợp.
- `projects/web-app/src/pages/HomePage.vue` -- bỏ card lối vào riêng đã được thay bằng tab trong Học AI.

## Tasks & Acceptance

**Execution:**
- [x] `projects/web-app/src/pages/AiEngineerRoadmapTab.vue` -- chuyển nội dung thành tab nhúng được, giữ nguyên các phần học và responsive.
- [x] `projects/web-app/src/pages/AiHubPage.vue` -- thêm tab thứ năm và đồng bộ deep link query mà không ảnh hưởng bốn tab cũ.
- [x] `projects/web-app/src/router/index.js` và `projects/web-app/src/utils/ported-pages.js` -- chuyển route cũ thành redirect tới tab trong Hub.
- [x] `projects/web-app/src/pages/HomePage.vue` -- gỡ thẻ lối vào riêng để tránh trùng điều hướng.

**Acceptance Criteria:**
- Given người học ở `/ai`, when chọn tab AI Engineer, then lộ trình hiển thị ngay trong Hub và đủ các nội dung đã có.
- Given người học mở `/ai?tab=engineer` hoặc `/ai/engineer`, when trang tải, then tab AI Engineer được chọn; refresh không làm mất tab.
- Given người học dùng bốn tab AI cũ, when chuyển đổi và thao tác như trước, then flashcard, quiz, phỏng vấn và project giữ nguyên hành vi.
- Given trang chủ hiển thị nhóm AI, when thay đổi hoàn tất, then chỉ còn một thẻ Học AI và không còn thẻ lộ trình trùng.
- Given viewport điện thoại, when dùng tab lộ trình, then nội dung không tràn ngang.

## Design Notes

Giữ route `/ai/engineer` dưới dạng redirect tương thích thay vì xóa URL hoàn toàn; nội dung chỉ có một nguồn trong tab AI Hub. Query `tab=engineer` giúp liên kết trực tiếp và lưu trạng thái khi tải lại.

## Verification

**Commands:**
- `npm run build -- --outDir "$env:TEMP/web-improve-ai-roadmap-build"` trong `projects/web-app` -- expected: build thành công mà không ghi đè các thay đổi đang có trong `dist/`.
- `git diff --check` -- expected: không có whitespace errors.

**Manual checks:**
- Build thành công; `git diff --check` không phát hiện lỗi whitespace ở các file đã sửa.
- `/ai?tab=engineer` hiển thị đủ 5 phần và vẫn chọn đúng tab sau refresh; `/ai/engineer` chuyển tới cùng tab.
- Cả năm tab hiển thị đúng nội dung; trang chủ không còn lối vào AI Engineer riêng.
- Ở viewport 390px, tab lộ trình không tràn ngang; session kiểm tra tạm đã được xóa.

## Suggested Review Order

**Điều hướng và trạng thái tab**

- Bắt đầu tại bộ tab để thấy điểm tích hợp ngay trong Học AI.
  [`AiHubPage.vue:12`](../../projects/web-app/src/pages/AiHubPage.vue#L12)

- Khởi tạo đúng tab khi mở deep link hoặc tải lại trang.
  [`AiHubPage.vue:231`](../../projects/web-app/src/pages/AiHubPage.vue#L231)

- Đồng bộ lựa chọn tab với query mà không làm mất query khác.
  [`AiHubPage.vue:329`](../../projects/web-app/src/pages/AiHubPage.vue#L329)

**Tương thích URL và lối vào**

- Chuyển URL cũ tới tab tích hợp thay vì giữ trang độc lập.
  [`index.js:38`](../../projects/web-app/src/router/index.js#L38)

- Giữ alias sau đăng nhập và mô tả đúng đích mới.
  [`ported-pages.js:61`](../../projects/web-app/src/utils/ported-pages.js#L61)

- Giữ duy nhất lối vào Học AI trên trang chủ.
  [`HomePage.vue:106`](../../projects/web-app/src/pages/HomePage.vue#L106)

**Nội dung nhúng và responsive**

- Đặt lộ trình trong component dùng lại được bên trong Hub.
  [`AiEngineerRoadmapTab.vue:3`](../../projects/web-app/src/pages/AiEngineerRoadmapTab.vue#L3)

- Giữ năm phần nội dung có anchor để điều hướng trong lộ trình.
  [`AiEngineerRoadmapTab.vue:28`](../../projects/web-app/src/pages/AiEngineerRoadmapTab.vue#L28)

- Thu gọn bố cục cho màn hình hẹp.
  [`AiEngineerRoadmapTab.vue:632`](../../projects/web-app/src/pages/AiEngineerRoadmapTab.vue#L632)
