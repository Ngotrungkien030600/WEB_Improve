---
title: Port SkillForge sang Vue 3 + Vite
status: final
created: 2026-07-30
updated: 2026-07-30
---

# PRD: Port SkillForge sang Vue 3 + Vite

## 0. Mục đích tài liệu

PRD này dành cho chính người xây (Giang) và cho các workflow BMAD phía sau (`bmad-architecture`, `bmad-create-epics-and-stories`, `bmad-sprint-planning`). Nó mô tả **năng lực cần có**, không mô tả cách cài. Nền khảo sát là `docs/index.md` cùng 12 tài liệu sinh ngày 2026-07-30 — PRD này **không lặp lại** số đo ở đó, chỉ tham chiếu. Lý do chọn Vue thay React, và cơ chế strangler, nằm trong [addendum.md](./addendum.md).

Mức độ: **cá nhân / học tập**. Tài liệu cố tình ngắn; nghiệm thu là "tôi dùng được và không bỏ giữa đường", không phải bộ metric doanh nghiệp.

## 1. Vision

SkillForge đang chạy tốt như một web tĩnh vanilla 28 trang. Vấn đề không phải nó chạy sai — mà là **mỗi lần thêm một trang là một lần copy-paste**: 121 chỗ `class="card"` với 39 selector CSS khác nhau, 22 trang nhúng CSS inline, 5 file phải nạp đúng thứ tự thẻ `<script>` nếu không muốn trang vỡ im lặng.

Port sang Vue 3 + Vite để đổi lấy đúng ba thứ: **một tầng component dùng chung** thay cho 285 selector rời rạc, **một hệ module tường minh** thay cho biến `window.*` và thứ tự script, và **một khuôn thêm trang mới** rẻ đến mức không còn động lực copy-paste.

Điều kiện ràng buộc xuyên suốt: bản vanilla tại `projects/web-en` **phải luôn chạy được**. Không có ngày nào sản phẩm nằm im vì đang port.

`[ASSUMPTION]` Mục tiêu là **giữ nguyên giao diện**. Nếu thật ra bạn muốn nhân dịp này làm mới thẩm mỹ thì PRD sai hướng ngay từ Vision và cần chạy lại ở chế độ Update — không phải sửa vài dòng.

## 2. Đối tượng

### 2.1 Jobs To Be Done

- **Học tiếng Anh mỗi ngày mà không phải nghĩ** — mở trang là có flashcard, có bài luyện, có game ngắn.
- **Ôn phỏng vấn Java backend có hệ thống** — 30 cheatsheet, câu hỏi theo mức lương, được chấm điểm.
- **(người xây)** Có một codebase dám sửa — thêm màn mới trong một buổi tối, không sợ làm vỡ trang khác.
- **(người xây)** Có thứ đem đi phỏng vấn nói được: đã port một app 28 trang sang Vue theo lối strangler, và giải thích được vì sao.

### 2.2 Không phải đối tượng (v1)

- Người dùng ngoài. Không có đăng nhập, không đồng bộ nhiều máy, dữ liệu nằm trong browser.
- Người dùng mobile-first. Trang hiện responsive ở mức cơ bản; PRD này **không** hứa thiết kế lại cho mobile.

### 2.3 Hành trình chính

- **UJ-1. Giang mở trang chủ bản Vue và không nhận ra khác biệt.**
  Sau khi trang chủ được port, Giang mở `localhost:5173`. Thấy đúng bố cục cũ — cùng thẻ, cùng màu, cùng chữ. Anh bấm sang một trang chưa port, được chuyển thẳng sang bản vanilla ở `:8080` và vẫn dùng bình thường. Giá trị đến ở chỗ **không có gì hỏng**: port mà người dùng không nhận ra là port thành công.

- **UJ-2. Giang thêm một màn mới trong một buổi tối.**
  Cần thêm trang "luyện nghe". Anh tạo một file `.vue` trong `pages/`, dùng `CCard`, `CButton`, `CTopbar` có sẵn, khai một route. Không copy `<head>` từ trang khác, không nhớ thứ tự 5 file script, không đặt tên class mới. Giá trị đến khi trang mới trông đồng bộ với 27 trang kia mà anh không viết một dòng CSS nào.

- **UJ-3. Giang sửa màu chủ đạo một lần, cả app đổi theo.**
  Anh đổi một design token trong file token duy nhất. Mọi thẻ, mọi nút, mọi badge trên các trang đã port đổi theo. Trang chưa port vẫn dùng token cũ và không vỡ — vì token bản Vue được trích từ chính `variables.css` của bản vanilla.

## 3. Glossary

- **Legacy app** — ứng dụng vanilla hiện hành tại `projects/web-en`. Luôn chạy được trong suốt quá trình port.
- **Vue app** — ứng dụng Vue 3 + Vite mới tại `projects/web-app`. Nơi mọi trang được port về.
- **Port một trang** — dựng lại một trang của Legacy app thành route trong Vue app, giữ nguyên giao diện và hành vi người dùng; xong thì trang đó được coi là **đã chuyển**.
- **Đã chuyển** — trạng thái của một trang khi Vue app phục vụ nó và Legacy app không còn là đường vào chính của nó.
- **Component dùng chung** — component Vue đặt tên theo *vai trò* (`CCard`, `CButton`…), dùng được ở nhiều trang. Đối lập với class CSS đặt tên theo *trang* (`ai-card`, `exam-card`…).
- **Design token** — biến CSS mô tả một quyết định thị giác (màu, khoảng cách, bán kính, chữ). Nguồn gốc là 58 custom property trong `variables.css` của Legacy app.
- **API server** — server Node zero-dependency tại `projects/web-en/server`, giữ nguyên trong đợt này. Vue app gọi nó qua proxy.
- **Hub** — trang chỉ làm nhiệm vụ điều hướng: một thanh tiêu đề, một lưới thẻ dẫn sang các trang con, không có logic tương tác. Legacy app có 5 hub (`ai/`, `english/`, `java/`, `cloud/`, `frontend/`).

## 4. Features

### 4.1 Nền Vue app

**Description:** Dựng `projects/web-app` thành một ứng dụng Vue 3 + Vite chạy được, đứng cạnh Legacy app, có router và có đường gọi API server. Đây là nền cho mọi việc port sau. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Vue app chạy được độc lập

Người xây có thể khởi động Vue app bằng một lệnh và mở được trong browser, không cần Legacy app chạy trước.

**Consequences (testable):**
- `npm run dev` trong `projects/web-app` mở được dev server và trả về HTTP 200 ở route gốc.
- `npm run build` sinh ra bundle tĩnh không lỗi.
- Legacy app vẫn chạy được bằng `node projects/web-en/server/index.js` sau khi Vue app tồn tại — hai bên không tranh cổng.

#### FR-2: Vue app gọi được API server

Vue app có thể gọi 4 endpoint AI của API server mà không cần cấu hình CORS hay hardcode host.

**Consequences (testable):**
- Gọi `/api/ai-chat` từ Vue app ở chế độ dev trả về đúng response JSON của API server.
- Đường dẫn API trong code Vue app là đường tương đối; không có `localhost:8080` nào nằm trong source.
- Khi API server không chạy, Vue app hiển thị lỗi cho người dùng chứ không treo im lặng.

#### FR-3: Điều hướng giữa trang đã chuyển và trang chưa port

Người dùng có thể đi từ trang đã chuyển sang trang chưa port và ngược lại, không gặp trang trắng hay 404.

**Consequences (testable):**
- Mọi liên kết trong Vue app trỏ tới trang chưa port đều dẫn tới Legacy app và mở được.
- Danh sách trang **đã chuyển** được khai ở **một chỗ duy nhất** — thêm một trang vào danh sách là đủ để điều hướng đổi theo.

**Notes:** `[NOTE FOR PM]` Cách nối hai app khi deploy thật (reverse proxy? build Vue vào thư mục Legacy?) chưa cần chốt ở MVP vì mức độ là cá nhân — nhưng đừng để quyết định nền chặn mất lối đó về sau.

---

### 4.2 Hệ design token và component dùng chung

**Description:** Rút các quyết định thị giác của Legacy app thành design token, và dựng tập component đặt tên theo vai trò để mọi trang port sau dùng lại. Đây là thứ trả lại giá trị lớn nhất của cả cuộc port. Realizes UJ-2, UJ-3.

**Functional Requirements:**

#### FR-4: Design token là nguồn duy nhất cho quyết định thị giác

Người xây có thể đổi một token và thấy mọi trang đã chuyển đổi theo, không phải đi sửa từng file.

**Consequences (testable):**
- Token của Vue app được trích từ `variables.css` của Legacy app; giá trị màu/khoảng cách/bán kính khớp nhau.
- Không có mã màu hex hay giá trị `px` cứng nào trong component dùng chung — chỉ tham chiếu token.
- Đổi một token và trang đã chuyển đổi theo, kiểm được bằng mắt hoặc bằng ảnh so sánh.

#### FR-5: Component dùng chung phủ được các khối lặp nhiều nhất

Người xây có thể dựng một trang mới bằng component có sẵn, không viết CSS mới cho các khối phổ biến.

**Consequences (testable):**
- Có component cho: thẻ (3 biến thể tĩnh/bấm được/lật), nút (primary/secondary/icon), thanh tiêu đề trang, lưới, badge, modal, ô nhập.
- Tên component nói lên **vai trò**, không nói tên trang — không có `AiCard`, `ExamCard`.
- Mỗi trang được port dùng lại component này thay vì tự khai class mới.
- Một trang mới dựng hoàn toàn từ component có sẵn không cần thêm file CSS nào.

**Out of Scope:**
- Thiết kế lại giao diện. Component **tái tạo** cái đang có, không đổi thẩm mỹ.
- Thư viện component ngoài (Vuetify, PrimeVue, Element Plus). Xem Non-Goals.

**Notes:** `[ASSUMPTION]` Tập 14 component đề xuất trong `docs/component-inventory-client.md` là điểm khởi đầu, không phải danh sách chốt. Con số thật sẽ lộ ra sau 3–4 trang đầu; MVP chỉ cam kết các khối lặp nhiều nhất.

---

### 4.3 Port trang mẫu để chứng minh khuôn

**Description:** Port một nhóm nhỏ trang có tính chất khác nhau, đủ để chứng minh khuôn chịu được cả ba dạng trang của app: trang chủ nhiều thẻ, trang hub thuần điều hướng, và một màn có logic tương tác thật. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-6: Trang đã chuyển giữ nguyên giao diện và hành vi

Người dùng có thể dùng một trang đã chuyển và không phát hiện khác biệt so với bản Legacy.

**Consequences (testable):**
- Đặt hai bản cạnh nhau và so đúng **năm mục**, không mở rộng thêm: bố cục khối, màu, khoảng cách, cỡ/kiểu chữ, trạng thái hover. Đây là kiểm **thủ công có chủ ý** — MVP không có test tự động (§6.2), nên danh mục phải hữu hạn để hai lần so cho cùng một kết quả.
- Mọi thao tác người dùng làm được ở bản Legacy đều làm được ở bản Vue.
- Dữ liệu tiến độ đã lưu vẫn đọc được — bản Vue dùng **cùng** IndexedDB và cùng khoá localStorage, không tạo store mới song song.

#### FR-7: Logic nghiệp vụ được tái dùng, không viết lại

Người xây có thể port một màn có logic mà không phải cài lại thuật toán của màn đó.

**Consequences (testable):**
- Các hàm thuần trong `js/features/**/*-logic.js` của Legacy app được dùng lại, không copy-paste rồi sửa.
- Component Vue chỉ giữ phần hiển thị và tương tác; phép tính nằm ngoài component.
- Nếu một hàm logic phải sửa để dùng được, sửa ở **một** bản dùng chung cho cả hai app — không fork thành hai bản lệch nhau.
- Không tồn tại hai file cùng tên chứa cùng hàm logic ở hai app. Kiểm được bằng cách đối chiếu danh sách file logic của hai bên.

**Notes:**
`[ASSUMPTION]` Các hàm trong `js/features/**/*-logic.js` thực sự thuần và gọi được từ Vue không cần sửa. Đã kiểm bằng đọc code (không có lời gọi DOM nào), **chưa** kiểm bằng chạy thật từ phía Vue.
`[ASSUMPTION]` IndexedDB và localStorage dùng chung được giữa hai app vì cùng origin. Đúng khi cả hai chạy cùng host và cùng cổng; **cần xác minh** ở chế độ dev khi Vite nằm ở cổng khác — nếu sai thì FR-6 mất một consequence và phải có cách khác để tiến độ cũ đọc được.

---

### 4.4 Vá hai lỗ nghiêm trọng trên Legacy app

**Description:** Legacy app còn chạy dài trong suốt cuộc port, nên hai lỗi mức Cao đã tái hiện được phải vá ngay tại đó, không đợi trang tương ứng được port. Bảy lỗi mức thấp còn lại sẽ tự tan khi trang chứa chúng được port.

**Functional Requirements:**

#### FR-8: API server không phục vụ file ngoài phạm vi và không phục vụ file bí mật

Người ngoài không thể lấy được file cấu hình hay file nằm ngoài thư mục gốc của Legacy app qua HTTP.

**Consequences (testable):**
- `GET /.env` trả về 404 (hiện tại: 200 kèm 192 byte nội dung).
- `GET /../README.md` trả về 404 (hiện tại: 200 kèm 8.579 byte).
- Mọi file dotfile bị từ chối.
- Các trang và tài nguyên hợp lệ vẫn phục vụ bình thường — không vá quá tay làm vỡ app.

#### FR-9: Màn chat 6 persona hoạt động

Người dùng có thể gửi tin nhắn ở màn chat và nhận được trả lời.

**Consequences (testable):**
- Gửi tin nhắn ở màn chat gọi đúng endpoint `/api/bmad/chat` (hiện tại gọi vào `/undefined`).
- Nhận và hiển thị được trả lời của agent.
- Màn chat có style — không còn là DOM trần vì file CSS không được nạp.

## 5. Non-Goals

- **Không** dùng thư viện component ngoài. Mục đích của cuộc port là *có* tầng component của mình, không phải mượn tầng component của người khác.
- **Không** thiết kế lại giao diện. Bất kỳ ý muốn "nhân lúc port thì làm đẹp luôn" đều thuộc đợt sau — trộn vào đây là mất khả năng so sánh trước/sau.
- **Không** đổi ngôn ngữ sang TypeScript trong đợt này.
- **Không** viết lại API server, không thêm dependency cho nó, không chuyển serverless.
- **Không** thêm đăng nhập, đồng bộ nhiều máy, hay backend lưu dữ liệu.
- **Không** SSR/SSG (Nuxt) trong đợt này. App là công cụ dùng riêng, không cần SEO.
- **Không** xoá Legacy app cho tới khi **mọi** trang đã chuyển.

## 6. MVP Scope

### 6.1 Trong phạm vi

- Nền Vue app chạy được, có router, có đường gọi API server (FR-1 → FR-3).
- Design token trích từ Legacy app + tập component dùng chung phủ các khối lặp nhiều nhất (FR-4, FR-5).
- Port 3–4 trang mẫu gồm đủ ba dạng: trang chủ, một hub, một màn có logic (FR-6, FR-7).
- Vá S1 và C1 trên Legacy app (FR-8, FR-9).
- Ghi lại khuôn "thêm một trang mới" thành tài liệu ngắn để đợt sau chỉ việc lặp.

### 6.2 Ngoài phạm vi MVP

- 24 trang còn lại — đợi khuôn được chứng minh đã. Đây là việc lặp, không phải việc thiết kế.
- Bảy lỗi mức thấp (S2–S5, C2–C4) — sẽ tan dần theo tiến độ port. `[NOTE FOR PM]` S2 (API không auth, không rate limit) chỉ vô hại vì app chạy localhost; nếu có ý định deploy thì nó lập tức thành mức Cao.
- Test tự động. `[NOTE FOR PM]` Đây là mục đau: không có test thì mọi trang port là so sánh bằng mắt. Ở mức độ cá nhân thì chấp nhận được, nhưng nếu chuyển sang mục tiêu portfolio thì test phải vào MVP.
- CI/CD, deploy công khai, TypeScript, thiết kế lại mobile.

## 7. Success Metrics

Ở mức độ cá nhân, thành công đo bằng ba câu trả lời được:

- **SM-1**: Sau MVP, thêm một trang mới vào Vue app mất **dưới một buổi tối** và không cần viết CSS mới. Validates FR-5.
- **SM-2**: Không có ngày nào SkillForge không dùng được vì đang port. Validates FR-1, FR-3.
- **SM-3**: `GET /.env` trên Legacy app trả 404. Validates FR-8.

**Counter-metric (đừng tối ưu)**

- **SM-C1**: **Số trang đã port.** Đừng đua số. Port nhanh 24 trang bằng cách copy markup và tự khai class mới cho từng trang sẽ đạt chỉ số này trong khi phá đúng thứ cuộc port tồn tại để giải quyết. Đối trọng của SM-1.

## 8. Open Questions

1. Khi deploy thật, nối Legacy app và Vue app bằng cách nào — reverse proxy, hay build Vue vào thư mục tĩnh của Legacy? Chưa cần chốt ở MVP nhưng đừng để quyết định nền bít lối.
2. Logic thuần dùng chung cho cả hai app nên đặt ở đâu để không thành hai bản lệch nhau? Đây là câu hỏi cho `bmad-architecture`.
3. Trang nội dung nặng (`cloud.html` 1.121 dòng, `java/spring-boot.html` 741 dòng) — port thành component Vue, hay tách nội dung ra markdown rồi render? Ảnh hưởng lớn tới khối lượng 24 trang còn lại.
4. Bản Legacy sống song song bao lâu là chấp nhận được trước khi thành gánh nặng bảo trì hai chiều?

## 9. Assumptions Index

- §4.2 — Tập 14 component trong `docs/component-inventory-client.md` là điểm khởi đầu, không phải danh sách chốt; con số thật lộ ra sau 3–4 trang đầu.
- §4.3 — Giả định các hàm trong `js/features/**/*-logic.js` thực sự thuần và tái dùng được từ Vue không cần sửa. Đã kiểm bằng đọc code (không có lời gọi DOM nào), **chưa** kiểm bằng chạy thật từ phía Vue.
- §4.3 — Giả định IndexedDB và localStorage dùng chung được giữa hai app vì cùng origin. Đúng khi cả hai chạy cùng host+port; **cần xác minh** ở chế độ dev khi Vite ở cổng khác.
- §1 — Giả định mục tiêu là giữ nguyên giao diện. Nếu thật ra bạn muốn nhân dịp làm mới thẩm mỹ, PRD này sai hướng và cần Update.
