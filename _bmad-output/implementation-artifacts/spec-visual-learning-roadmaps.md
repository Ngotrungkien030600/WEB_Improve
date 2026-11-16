---
title: 'Thêm sơ đồ roadmap tổng quan và theo từng công nghệ'
type: 'feature'
created: '2026-11-16'
status: 'in-review'
review_loop_iteration: 0
baseline_commit: 'ecfabe37a338cf4ec9c9829405ffdcb627fbd899'
context:
  - '{project-root}/docs/lo-trinh-hoc.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Người học hiện phải ghép các trang và chặng học rời rạc để hình dung thứ tự học từ tổng quan đến từng công nghệ.

**Approach:** Thêm một sơ đồ roadmap chung vào trang `/learning-paths`, cùng sơ đồ trực quan riêng ở các hub và trang nội dung công nghệ hiện có. Dùng SVG responsive ngay trong giao diện; giữ dữ liệu, liên kết và tiến độ hiện hữu làm nguồn sự thật.

## Boundaries & Constraints

**Always:** Roadmap chung phản ánh năm track hiện có (Java Backend, English, Frontend, DevOps & Cloud, AI), thể hiện nền tảng/chặng chung và nhánh đi tiếp, không ép mọi người theo một đường duy nhất. Roadmap riêng phải phù hợp đúng công nghệ và trang hiện tại; mỗi nút dẫn tới route thật khi có nội dung tương ứng. Dùng một component SVG dùng chung, có nhãn/accessible title, co giãn trên mobile, không thêm dependency hoặc ảnh raster. Chỉ bổ sung phần sơ đồ; không thay nội dung bài học, logic hoàn thành, tiến độ lưu trữ, route hay trải nghiệm các tính năng hiện tại. Phạm vi gồm các trang Java/Backend, Frontend, AI Engineer và AI Agent, Go, Cloud, DevOps và sáu trang công cụ AWS, Docker, Kubernetes, Terraform, CI/CD, Monitoring. Giữ nguyên thay đổi sẵn có trong `projects/web-app/dist/`; không stage hoặc sửa chúng.

**Ask First:** Thay đổi thứ tự/chất lượng nội dung lộ trình hiện hữu; tạo route công nghệ mới hoặc đổi nội dung các bài học.

**Never:** Thay roadmap bằng ảnh tĩnh khó truy cập; tạo tiến độ hoặc nguồn dữ liệu chặng thứ hai; sửa file trong `projects/web-app/dist/` hay app fallback `projects/web-en/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Tổng quan | Mở `/learning-paths` | Sơ đồ có năm track hiện hành, nút tới đúng trang học | Thiếu track thì báo qua kiểm tra dữ liệu, không render đường dẫn giả |
| Trang công nghệ | Mở một trang thuộc phạm vi | Sơ đồ đúng tech, thứ tự dễ theo dõi, nút đi tới route hợp lệ | Chặng không có trang tương ứng hiển thị thông tin, không điều hướng hỏng |
| Màn hình hẹp | Mở sơ đồ trên viewport nhỏ | Sơ đồ đọc được, không tràn ngang | Tự chuyển bố cục sang chiều dọc |

</frozen-after-approval>

## Code Map

- `projects/web-app/src/pages/LearningPathsPage.vue` -- điểm đặt sơ đồ chung, giữ nguyên UI tiến độ theo track.
- `projects/web-app/src/data/learning-paths.js` -- nguồn năm track/chặng tổng quan hiện có.
- `projects/web-app/src/components/CRoadmapDiagram.vue` -- component SVG tái sử dụng, điều hướng có kiểm soát và hỗ trợ tiếp cận.
- `projects/web-app/src/data/technology-roadmaps.js` -- dữ liệu sơ đồ riêng theo route/công nghệ, liên kết tới bài học hiện có.
- `projects/web-app/src/pages/JavaHubPage.vue`, `JavaTuZeroPage.vue`, `JavaAdvancedCorePage.vue`, `JavaThucChienPage.vue`, `SpringSectionPage.vue`, `BackendBasicsPage.vue`, `BackendBasicsLessonPage.vue`, `BackendSectionPage.vue` -- nhóm Java/Backend.
- `projects/web-app/src/pages/FrontendHubPage.vue`, `FrontendDesignSystemPage.vue`, `FrontendFrameworksPage.vue`, `FrontendHtmlCssPage.vue`, `FrontendJavaScriptPage.vue`, `FrontendResponsivePage.vue`, `FrontendUiInterviewPage.vue` -- nhóm Frontend.
- `projects/web-app/src/pages/AiHubPage.vue`, `AiEngineerRoadmapTab.vue`, `AiHubSubPage.vue`, `AiAgentPage.vue` -- nhóm AI và công cụ AI; không đổi tab hay route cũ.
- `projects/web-app/src/pages/GoInterviewPage.vue`, `TheWayToGoPage.vue` -- nội dung Go hiện có.
- `projects/web-app/src/pages/CloudHubPage.vue`, `CloudHubSubPage.vue`, `CloudSectionPage.vue`, `CloudBackendDeployPage.vue` -- nhóm Cloud.
- `projects/web-app/src/pages/DevopsHubPage.vue`, `DevopsAwsPage.vue`, `DevopsDockerPage.vue`, `DevopsKubernetesPage.vue`, `DevopsTerraformPage.vue`, `DevopsCicdPage.vue`, `DevopsMonitoringPage.vue`, `DevopsSectionPage.vue` -- DevOps và từng công cụ.
- `projects/web-app/src/router/index.js` -- đối chiếu mọi URL sơ đồ với route có thật.

## Tasks & Acceptance

**Execution:**
- [x] `projects/web-app/src/data/technology-roadmaps.js` -- khai báo track chung và lộ trình từng route từ nội dung/data hiện hành; liên kết chỉ dùng route thật.
- [x] `projects/web-app/src/components/CRoadmapDiagram.vue` -- vẽ SVG có hướng đi, trạng thái/chặng, link bàn phím, nhãn screen reader và layout mobile.
- [x] `projects/web-app/src/pages/LearningPathsPage.vue` -- đặt sơ đồ chung trước chi tiết track, không nhân đôi hoặc ghi lại tiến độ.
- [x] Các trang Java/Backend, Frontend, AI/AI Agent, Go, Cloud và DevOps nêu trong Code Map -- nhúng roadmap công nghệ phù hợp, không thay đổi nội dung/logic sẵn có.
- [x] `projects/web-app/scripts/test-technology-roadmaps.mjs` -- kiểm tra route tồn tại, dữ liệu chặng hợp lệ và không có liên kết nội bộ hỏng.

**Acceptance Criteria:**
- Given người học mở `/learning-paths`, when xem sơ đồ chung, then thấy đủ năm track và đi được từ từng nhánh tới trang học tương ứng.
- Given người học mở một trang công nghệ trong phạm vi, when xem roadmap, then sơ đồ phù hợp trang đó và các nút chỉ tới route có thật.
- Given roadmap được dùng bằng bàn phím hoặc trình đọc màn hình, when lần lượt tới từng chặng, then tên và quan hệ thứ tự được công bố rõ ràng.
- Given viewport hẹp, when mở sơ đồ chung hoặc riêng, then nội dung không tràn ngang và các chặng vẫn đọc/điều hướng được.
- Given người học hoàn thành bài/chặng như trước, when mở lại roadmap hoặc tải lại trang, then tiến độ hiện hữu không bị thay đổi hay ghi đè.
- Given kiểm tra route/dữ liệu và build, when chạy lệnh xác minh, then mọi sơ đồ hợp lệ và app build thành công.

## Design Notes

Dùng SVG inline có cấu trúc dữ liệu khai báo, thay vì xuất file ảnh riêng: nhãn vẫn rõ ở nhiều kích cỡ, links hoạt động và component có thể tái dùng. Roadmap tổng quan là bản đồ các track, không thay thế các stage card và tín hiệu tiến độ đang hiển thị bên dưới.

## Verification

**Commands:**
- `node projects/web-app/scripts/test-technology-roadmaps.mjs` -- expected: tất cả route/chặng hợp lệ; liên kết đích tồn tại trong router.
- `npm run build -- --outDir .roadmap-build-output` trong `projects/web-app` -- expected: build thành công mà không ghi đè thay đổi có sẵn trong `dist/`.
- `git diff --check` trên các file thuộc feature -- expected: không có whitespace errors.

**Kết quả chạy (2026-11-16):**
- Route/data script: exit 0 — `Đã xác minh 15 roadmap, 68 chặng, 67 liên kết nội bộ và 32 route trang thuộc phạm vi.`
- Vite build: exit 0 với Vite 8.1.5, 268 modules transformed; output `.roadmap-build-output` đã được xoá sau khi kiểm tra, `dist/` không bị ghi.
- `git diff --check` trên các file feature: exit 0, không có whitespace errors; Git chỉ phát cảnh báo line ending LF → CRLF cho `LearningPathsPage.vue`.
- Browser smoke ở 390px: sơ đồ tổng quan có 5 liên kết nhánh, document rộng 382px và liên kết nhận focus bàn phím. 14 route đại diện (bao gồm sáu trang DevOps) đều render sơ đồ phù hợp, không tràn ngang; đã mở thử nhánh tổng quan `/java/hub` và chặng `/java/tu-zero`.
- Cấu trúc SVG có title/description và nhãn liên kết; chưa chạy kiểm thử bằng thiết bị đọc màn hình thật.

**Manual checks:**
- Mở sơ đồ chung, các trang đại diện mỗi nhóm công nghệ và sáu trang DevOps; thử mở các chặng liên kết.
- Dùng viewport 390px, bàn phím và trình đọc màn hình để xác nhận khả năng đọc/điều hướng.
- Xác nhận các tick/chặng/progress hiện có vẫn lưu và hiển thị như trước.

## Suggested Review Order

**Tích hợp theo route**

- Hiển thị roadmap phù hợp sau mỗi trang thuộc phạm vi mà không đổi component trang.
  [`App.vue:6`](../../projects/web-app/src/App.vue#L6)

- Bỏ sơ đồ App khi tab AI Engineer tự hiển thị sơ đồ trong nội dung tab.
  [`technology-roadmaps.js:345`](../../projects/web-app/src/data/technology-roadmaps.js#L345)

**Nguồn dữ liệu và SVG**

- Tái sử dụng năm track hiện hành và nội dung lộ trình công nghệ.
  [`technology-roadmaps.js:277`](../../projects/web-app/src/data/technology-roadmaps.js#L277)

- Công bố tiêu đề, mô tả, thứ tự và liên kết bàn phím trong SVG.
  [`CRoadmapDiagram.vue:9`](../../projects/web-app/src/components/CRoadmapDiagram.vue#L9)

- Chuyển nhánh tổng quan sang đọc như lựa chọn song song.
  [`CRoadmapDiagram.vue:165`](../../projects/web-app/src/components/CRoadmapDiagram.vue#L165)

**Trang đặc biệt và xác minh**

- Đặt bản đồ năm track trước chi tiết tiến độ hiện hữu.
  [`LearningPathsPage.vue:43`](../../projects/web-app/src/pages/LearningPathsPage.vue#L43)

- Thêm SVG vào tab AI Engineer mà không thay roadmap văn bản.
  [`AiEngineerRoadmapTab.vue:100`](../../projects/web-app/src/pages/AiEngineerRoadmapTab.vue#L100)

- Kiểm tra mapping trang, dữ liệu chặng và mọi liên kết nội bộ.
  [`test-technology-roadmaps.mjs:82`](../../projects/web-app/scripts/test-technology-roadmaps.mjs#L82)

## Review Status

Hai lượt review tự động chưa chạy được do lỗi kết nối dịch vụ. Prompt cho hai reviewer độc lập đã được tạo tại:

- `review-prompts/visual-learning-roadmaps-blind-hunter.md`
- `review-prompts/visual-learning-roadmaps-edge-case-hunter.md`

Tạm dừng trước khi đánh dấu hoàn tất hoặc commit cho đến khi nhận được kết quả review.
