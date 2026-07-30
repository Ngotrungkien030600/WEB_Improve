---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-web-improve-2026-07-30/prd.md
  - _bmad-output/planning-artifacts/prds/prd-web-improve-2026-07-30/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-web-improve-2026-07-30/ARCHITECTURE-SPINE.md
  - docs/component-inventory-client.md
---

# SkillForge — port sang Vue 3 + Vite - Epic Breakdown

## Overview

Tài liệu này chia nhỏ toàn bộ công việc port SkillForge từ vanilla sang Vue 3 + Vite thành epic và story có thể thực hiện được, dẫn nguồn từ PRD (9 FR), architecture spine (16 AD), và kiểm kê component.

Không có UX design contract — PRD §5 Non-Goals loại thẳng việc thiết kế lại giao diện. Mục tiêu là **tái tạo** giao diện đang có, nên không có UX-DR nào; yêu cầu về component đến từ kiểm kê component chứ không từ một bản thiết kế mới.

## Requirements Inventory

### Functional Requirements

FR1: Vue app chạy được độc lập — khởi động bằng một lệnh, mở được trong browser, không cần Legacy app chạy trước.
FR2: Vue app gọi được 4 endpoint AI của API server mà không cần cấu hình CORS hay hardcode host.
FR3: Điều hướng hai chiều giữa trang đã chuyển và trang chưa port, không trang trắng, không 404.
FR4: Design token là nguồn duy nhất cho quyết định thị giác — đổi một token, mọi trang đã chuyển đổi theo.
FR5: Component dùng chung phủ được các khối lặp nhiều nhất — dựng trang mới không phải viết CSS mới.
FR6: Trang đã chuyển giữ nguyên giao diện và hành vi; tiến độ đã lưu vẫn đọc được.
FR7: Logic nghiệp vụ được tái dùng, không viết lại, không fork thành hai bản lệch.
FR8: API server không phục vụ file ngoài phạm vi và không phục vụ file bí mật.
FR9: Màn chat 6 persona hoạt động — gửi được tin nhắn, nhận được trả lời, có style.

### NonFunctional Requirements

PRD không có mục NFR riêng (mức độ cá nhân/học tập, cố tình gọn). Các NFR dưới đây trích từ ràng buộc phát ngôn tường minh trong PRD §1/§5 và spine — không phải do suy diễn thêm.

NFR1: Legacy app tại `projects/web-en` **luôn chạy được** trong suốt cuộc port. Không có ngày nào sản phẩm nằm im. *(PRD §1)*
NFR2: Legacy app **chỉ chạy localhost** cho tới khi FR8 xong. Không bind `0.0.0.0`, không mở port ra LAN. *(spine Deferred, docs S1)*
NFR3: API server giữ **zero dependency** — không thêm package nào vào `web-en/`. *(PRD §5, spine Stack)*
NFR4: Không TypeScript, không thư viện component ngoài (Vuetify/PrimeVue/Element Plus), không SSR/SSG. *(PRD §5)*
NFR5: Nghiệm thu FR6 là **kiểm thủ công** theo đúng danh mục 5 mục (bố cục khối, màu, khoảng cách, cỡ/kiểu chữ, trạng thái hover) — dự án chưa có test tự động. *(PRD FR-6, §6.2)*
NFR6: Không thiết kế lại giao diện. Component tái tạo cái đang có, không đổi thẩm mỹ. *(PRD §4.2 Out of Scope, §5)*

### Additional Requirements

**Starter template: KHÔNG có.** Architecture spine không chỉ định starter hay scaffold nào (`npm create vue` không được dùng) — stack là 4 package ghim phiên bản, lắp tay. Epic 1 Story 1 phải dựng cấu trúc từ đầu theo §Structural Seed của spine, không chạy generator.

Yêu cầu kỹ thuật từ architecture spine (16 AD) ảnh hưởng tới story:

- **AD-1** Phụ thuộc chảy một chiều: chỉ `pages/` import từ nhiều lớp; `components/` chỉ import token; `storage/`+`api/` không import gì thuộc Vue.
- **AD-2** Một origin duy nhất. Mọi đường dẫn giữa hai app là đường tương đối, không chứa host/cổng. Dev: Vite proxy `/api` sang API server. **Hệ quả cho nghiệm thu:** dev server ở cổng riêng LÀ origin khác nên storage không chia sẻ ở dev — FR6 chỉ nghiệm thu được khi cùng origin.
- **AD-3** `@legacy` là đường duy nhất và một chiều vào Legacy app. Không import `../web-en/`, không copy file logic. Legacy app không được biết Vue app tồn tại.
- **AD-4** Logic nghiệp vụ giữ framework-free: `@legacy/features/**` không import `vue`. Thích nghi diễn ra ở tầng `pages/`.
- **AD-5** Không gán `window.*` mới trong `web-app/`. Logic đọc `window.*` (hiện `interview-logic.js:20`) phải nhận dữ liệu qua tham số, có giá trị mặc định giữ đường cũ.
- **AD-6** Legacy app có **10 khoá `localStorage`** (2 khoá khai qua hằng số nên dễ đếm sót: `interviewChecklist` ở `interview-logic.js:5`, `skillforge_timer_history` ở `timer.js:6`) + **2 IndexedDB**. Mọi khoá giữ nguyên chủ hiện tại. Ba nơi **chồng lấn nhau** (quiz→`quizHistory`, đề→`skillforge_exam_history`, phiên→store `sessions` của `SkillForgeProgress`) giữ y nguyên sự chồng lấn ở đợt này. **Một nơi lưu, đúng một người ghi** — nơi nào logic Legacy đã ghi (`quiz-logic.js:70,82`, `skill-logic.js:44,52,58`, `interview-logic.js:9,16`) thì Vue đi qua chính module đó, không dựng adapter song song.
- **AD-7** Một file khai danh sách trang đã chuyển; mọi điều hướng qua một helper đọc file đó.
- **AD-8** Token **import** thẳng `web-en/css/variables.css`, không sao chép. Không hex, không `px` cứng trong `components/`.
- **AD-9** Component dùng chung thuần trình bày, tên theo vai trò, tiền tố `C`; không gọi storage/API/router.
- **AD-10** Cách ly style: component tự mang style, page dùng `<style scoped>`, CSS toàn cục chỉ gồm token + reset. Không import CSS theo-trang của Legacy.
- **AD-11** Mọi lời gọi API qua một module `api/`; không `fetch` trong `components/` hay `pages/`; lỗi mạng không được trôi qua im lặng.
- **AD-12** Mỗi trang đã chuyển dựng vỏ từ component dùng chung; không page nào tự viết markup bố cục khung.
- **AD-13** Route giữ nguyên hình dạng đường dẫn Legacy của trang đó.
- **AD-14** Đúng **6** trang nội dung dài chứa code sample không port (`cloud.html` 1.121 dòng/32 `<pre>`, `java/spring-boot.html` 741/26, `java/backend.html` 656/16, `frontend/html-css.html` 160/7, `frontend/frameworks.html` 158/4, `frontend/responsive.html` 128/7 — tổng 2.964 dòng). Tiêu chí là *nội dung dài*, KHÔNG phải *0 chỗ tương tác*. **5 hub + `learning-paths.html` thì PHẢI port** — chúng là bộ xương điều hướng, 39–79 dòng, 0 `<pre>`.
- **AD-15** Sửa `web-en/` chỉ trong 4 nhóm: (a) vá static handler, (b) sửa khoá endpoint + nạp CSS chat, (c) sửa chữ ký hàm theo AD-5, (d) thêm `export` vào file dữ liệu theo AD-16. Ngoài đó là read-only.
- **AD-16** Vue lấy dữ liệu Legacy **chỉ** bằng `import` ESM từ `@legacy/data/…`; file chưa `export` thì thêm dòng `export` cạnh phép gán `window.*`. Cấm `?raw`, `eval`, khai lại dữ liệu.
- **AD-17** Màu nhấn theo khu vực là **token ghi đè ở tầng trang**, không phải hex trong `<style scoped>` và cũng không phải token mới trong file dùng chung. 4 trang (`ai/hub`, `english/hub`, `java/hub`, `learning-paths`) tự khai `:root` inline với bảng tên **không trùng một chữ nào** với `variables.css`; phép ánh xạ hai bảng ghi **một lần** ở tầng kiến trúc. Màu nhấn `#f472b6`/`#34d399`/`#f59e0b`/`#7c5cfc` là chủ ý phân biệt khu vực, phải giữ.

Stack ghim (đã kiểm registry npm 2026-07-30): `vue@3.5.40` · `vite@8.1.5` · `vue-router@5.2.0` · `@vitejs/plugin-vue@6.0.8`. Node tối thiểu `^20.19.0 || >=22.12.0`.

Số đo trùng lặp cần triệt (từ kiểm kê component): 285 CSS selector · `class="card"` 121 lần / 39 selector `*card*` · 18 selector `*btn*` · 6 biến thể `*topbar*` · 22/28 trang có `<style>` inline (~730 dòng) · 1 file CSS mồ côi 342 dòng.

### UX Design Requirements

Không áp dụng — không có UX design contract, và PRD loại thẳng việc thiết kế lại giao diện (NFR6). Yêu cầu component đến từ `docs/component-inventory-client.md` và đã nằm trong Additional Requirements.

### FR Coverage Map

| FR | Epic | Ghi chú |
|---|---|---|
| FR1 Vue app chạy độc lập | Epic 2 | không có starter — dựng tay theo §Structural Seed |
| FR2 Gọi được API server | Epic 2 | AD-2 proxy, AD-11 một module |
| FR3 Điều hướng hai chiều | Epic 2 | AD-7 registry, AD-13 parity đường dẫn, AD-14 bỏ 6 trang nội dung dài (hub thì PHẢI port) |
| FR4 Design token một nguồn | Epic 2 | AD-8 import không sao chép |
| FR5 Component dùng chung | Epic 2 | tập ban đầu; mở rộng trong Epic 3 |
| FR6 Giữ nguyên giao diện + hành vi | **Epic 2 và Epic 3** | Epic 2: giao diện trang chủ · Epic 3: hành vi + tiến độ cũ đọc được |
| FR7 Tái dùng logic không fork | Epic 3 | AD-3, AD-4, AD-5, AD-16 |
| FR8 Static handler không rò file | Epic 1 | AD-15 nhóm (a) |
| FR9 Màn chat hoạt động | Epic 1 | AD-15 nhóm (b) |

FR6 nằm ở hai epic một cách có chủ ý. Mệnh đề "giữ nguyên giao diện" nghiệm thu được ngay khi trang chủ được chuyển (Epic 2); mệnh đề "tiến độ đã lưu vẫn đọc được" chỉ có nghĩa khi đã có màn ghi dữ liệu (Epic 3). Gán cứng vào một epic sẽ làm bản đồ đẹp hơn và sai hơn.

## Epic List

### Epic 1: Legacy app không rò file bí mật, màn chat hoạt động

Người dùng gửi được tin nhắn ở màn chat 6 persona và nhận được trả lời có style; server không còn phát tán `.env` hay file ngoài phạm vi qua HTTP.

**FRs covered:** FR8, FR9

**Standalone:** hoàn toàn độc lập — chỉ đụng `projects/web-en/`, không cần Vue app tồn tại.
**Vì sao đi trước:** epic này nằm trên code sống suốt cuộc port và **tháo bỏ NFR2** (ràng buộc chỉ-chạy-localhost). Để sau cùng nghĩa là mang lỗ path traversal suốt vài tuần trên bản dùng hằng ngày. Không phải "làm cái dễ trước" — mà là gỡ một ràng buộc đang giới hạn cách chạy app.
**Implementation notes:** giới hạn trong AD-15 nhóm (a) và (b). Không refactor cơ hội — codebase này không có test.

### Epic 2: Bản Vue phục vụ trang chủ và điều hướng được cả app

Người dùng mở bản Vue, thấy trang chủ y như bản cũ, và đi tới **mọi** trang khác được — trang đã chuyển do router lo, trang chưa port dẫn sang Legacy app.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6 (phần giao diện)

**Standalone:** đủ dùng ngay sau khi xong; không cần Epic 3 để hoạt động.
**Ghi chú thiết kế epic:** hạ tầng (Vite, token, tập component đầu tiên) nằm **bên trong** epic này, không thành epic riêng — tự chúng không cho người dùng làm được gì, và một epic tên "dựng component" là đúng ví dụ sai mà nguyên tắc thiết kế epic cảnh báo.
**Implementation notes:** không có starter template; dựng tay theo §Structural Seed của spine. AD-2 (một origin) phải được cài đúng ngay từ story đầu vì nó chi phối mọi story sau.

### Epic 3: Màn có logic chạy trên bản Vue, tiến độ cũ còn nguyên

Người dùng dùng được một hub và một màn tương tác thật trên bản Vue, với tiến độ đã lưu trước đó đọc được — chứng minh khuôn chịu được cả logic lẫn dữ liệu, không chỉ trang tĩnh.

**FRs covered:** FR7, FR6 (phần hành vi và dữ liệu)

**Standalone:** dựa trên Epic 2, nhưng Epic 2 không cần nó để hoạt động.
**Vì sao không gộp với Epic 2:** hai epic đụng cùng nhóm file `web-app/`, nhưng có **biên rủi ro thật** — Epic 2 là chỗ kiểm chứng alias `@legacy` và luật một-origin có sống được không. Nếu không sống, hướng của Epic 3 đổi hẳn. Đúng tiêu chí tách khi phản hồi sớm có thể đổi hướng epic sau.
**Implementation notes:** đây là epic đụng AD-5 và AD-16 — tức phải sửa `web-en/` theo nhóm (c) và (d) của AD-15. Nghiệm thu "tiến độ cũ đọc được" **chỉ hợp lệ khi hai app cùng origin** (AD-2); chạy ở dev server cổng riêng sẽ fail oan.

---

## Epic 1: Legacy app không rò file bí mật, màn chat hoạt động

Người dùng gửi được tin nhắn ở màn chat 6 persona và nhận được trả lời có style; server không còn phát tán `.env` hay file ngoài phạm vi qua HTTP. Epic này tháo bỏ NFR2 — ràng buộc chỉ-chạy-localhost.

### Story 1.1: Chặn đường lấy file bí mật và file ngoài phạm vi

As a người tự chạy SkillForge trên máy mình,
I want server chỉ phục vụ đúng những file thuộc về web,
So that khoá API và file cấu hình của tôi không lấy được qua HTTP dù chỉ trên mạng nội bộ.

**Acceptance Criteria:**

**Given** server Legacy đang chạy
**When** gửi `GET /.env`
**Then** nhận HTTP 404
**And** không byte nào của nội dung file được trả về (hiện trạng: HTTP 200 kèm 192 byte)

**Given** server Legacy đang chạy
**When** gửi `GET /../README.md` với `--path-as-is`
**Then** nhận HTTP 404 (hiện trạng: HTTP 200 kèm 8.579 byte)
**And** mọi đường dẫn giải ra ngoài thư mục gốc `projects/web-en/` đều bị từ chối, kiểm bằng `path.resolve(filePath).startsWith(path.resolve(ROOT))`

**Given** server Legacy đang chạy
**When** gửi `GET` tới bất kỳ đường dẫn chứa thành phần bắt đầu bằng dấu chấm
**Then** nhận HTTP 404 mà không đọc file

**Given** server Legacy đang chạy
**When** gửi `GET /` và `GET /pages/english.html` và một file `.css`, `.js`, `.md`, `.woff2` hợp lệ
**Then** tất cả vẫn nhận HTTP 200 với đúng `Content-Type` như trước
**And** không có phần mở rộng hợp lệ nào bị vá quá tay thành 404

**Given** một request tới file có phần mở rộng không nằm trong allowlist
**When** server xử lý
**Then** trả 404 thay vì rơi vào fallback `application/octet-stream`

**Given** thay đổi đã xong
**When** kiểm `projects/web-en/`
**Then** không có package nào được thêm (NFR3 zero dependency còn nguyên)
**And** chỉ `server/index.js` bị sửa — đúng nhóm (a) của AD-15, không refactor gì khác

### Story 1.2: Màn chat 6 persona gửi và nhận được tin nhắn

As a người dùng muốn hỏi ý kiến các persona,
I want mở màn chat, gõ một câu và nhận được trả lời hiển thị đúng,
So that tính năng này dùng được thật thay vì im lặng thất bại như hiện nay.

**Acceptance Criteria:**

**Given** server Legacy đang chạy và có khoá AI hợp lệ (hoặc Ollama đang chạy)
**When** mở `pages/bmad-agents.html`, chọn một agent ở chế độ solo và gửi một tin nhắn
**Then** request đi tới `/api/bmad/chat` (hiện trạng: đi tới `/undefined`)
**And** trả lời của agent hiển thị trong khung chat
**And** không có lỗi JSON parse nào trong console

**Given** màn chat được mở
**When** xem giao diện
**Then** `css/agents/bmad-chat.css` được nạp và các class `.bmad-agent-card`, `.chat-msg`, `.chat-bubble`, `.bmad-mode-btn` đều có style (hiện trạng: 342 dòng CSS mồ côi, DOM trần)

**Given** chế độ party với từ 2 agent trở lên
**When** gửi một tin nhắn
**Then** mỗi agent được chọn đều trả về một mục trong `replies`
**And** agent nào lỗi thì hiện được cho người dùng chứ không mất tăm

**Given** server Legacy **không** chạy
**When** gửi tin nhắn
**Then** người dùng thấy thông báo lỗi rõ ràng, không phải khung chat treo im lặng

**Given** thay đổi đã xong
**When** kiểm phạm vi sửa
**Then** chỉ `js/agents/bmad-chat.js` (tên khoá endpoint) và `pages/bmad-agents.html` (thẻ link CSS) bị sửa — đúng nhóm (b) của AD-15
**And** `server/config.js:AGENTS` vẫn là nguồn sự thật duy nhất cho system prompt; bản sao trong `js/agents/agents-config.js` không được gửi lên server

---

## Epic 2: Bản Vue phục vụ trang chủ và điều hướng được cả app

Người dùng mở bản Vue, thấy trang chủ y như bản cũ, và đi tới mọi trang khác được — trang đã chuyển do router lo, trang chưa port dẫn sang Legacy app.

### Story 2.1: Bản Vue chạy được và nói chuyện được với API server

As a người xây,
I want một app Vue chạy bằng một lệnh và gọi được 4 endpoint AI qua đường tương đối,
So that tôi có nền để port từng trang mà không phải cấu hình lại mỗi lần.

**Acceptance Criteria:**

**Given** `projects/web-app/` chưa tồn tại
**When** dựng app theo §Structural Seed của spine
**Then** cấu trúc gồm `src/main.js`, `src/App.vue`, `src/router/`, `src/pages/`, `src/components/`, `src/storage/`, `src/api/`, `src/styles/`
**And** **không** chạy generator nào (`npm create vue` bị cấm — không có starter template)
**And** `package.json` ghim đúng `vue@3.5.40`, `vite@8.1.5`, `vue-router@5.2.0`, `@vitejs/plugin-vue@6.0.8`
**And** `engines.node` khai `^20.19.0 || >=22.12.0`

**Given** app đã dựng
**When** chạy `npm run dev`
**Then** dev server khởi động và route gốc trả HTTP 200
**And** chạy `npm run build` sinh bundle tĩnh không lỗi

**Given** Vue app tồn tại
**When** chạy `node projects/web-en/server/index.js`
**Then** Legacy app vẫn chạy bình thường ở cổng 8080 (NFR1)
**And** hai bên không tranh cổng
**And** `projects/web-en/` không bị sửa một dòng nào trong story này

**Given** API server đang chạy và Vite dev server đang chạy
**When** gọi `/api/ai-chat` từ Vue app
**Then** nhận đúng response JSON của API server (proxy hoạt động — AD-2)
**And** `grep -r "localhost:8080\|127.0.0.1:8080" projects/web-app/src` trả về **0 kết quả** (AD-2)

**Given** đường dẫn `/pages/**` được yêu cầu từ Vue dev server
**When** trang đó chưa được port
**Then** Vite proxy chuyển sang Legacy app, không trả 404 của dev server
*(Không có mục này thì mọi liên kết sang trang chưa port sẽ chết ở chế độ dev, trong khi AD-2 cấm hardcode host.)*

**Given** API server **không** chạy
**When** Vue app gọi một endpoint
**Then** người dùng thấy thông báo lỗi; lỗi không trôi qua im lặng (AD-11)
**And** mọi lời gọi đi qua duy nhất `src/api/`; `grep -rn "fetch(" src/components src/pages` trả về 0 kết quả

**Given** cấu hình đã xong
**When** kiểm `vite.config.js`
**Then** có alias `@legacy` trỏ tới `projects/web-en/js` (AD-3)
**And** không có alias nào cho phép import CSS theo-trang của Legacy (AD-10)

**Given** `package.json` của Vue app
**When** kiểm danh sách dependency
**Then** chỉ có đúng 4 package đã ghim; **không** có thư viện component nào (Vuetify, PrimeVue, Element Plus, Naive UI…) và **không** có `typescript` hay `@vue/tsconfig` (NFR4)
**And** không có file `.ts` hay `tsconfig.json` nào trong `web-app/`
**And** không có Nuxt hay bất kỳ cấu hình SSR/SSG nào (NFR4)

**Given** dev server của Vue app
**When** kiểm `vite.config.js`
**Then** `server.host` **không** được đặt thành `true` hay `0.0.0.0` — dev server chỉ nghe localhost (NFR2)
*(Legacy app còn lỗ S1 cho tới khi Story 1.1 xong; phơi thêm một cổng ra mạng là mở rộng bề mặt tấn công mà không đổi lấy gì.)*

### Story 2.2: Trang chủ chạy trên bản Vue, giao diện khớp bản cũ

As a người dùng SkillForge,
I want mở bản Vue và thấy trang chủ đúng như bản cũ,
So that tôi không phải học lại gì và biết cuộc port không làm hỏng thứ đang dùng.

**Acceptance Criteria:**

**Given** trang chủ Legacy có 10 thẻ điều hướng, 3 ô số liệu hero, và một hàng số liệu
**When** trang chủ bản Vue được dựng
**Then** hiển thị đủ 10 thẻ, 3 ô số liệu, hàng số liệu — không thiếu, không thêm
**And** 10 thẻ dùng component dùng chung `CCard` biến thể bấm-được, **không** phải markup riêng của trang (AD-12)
**And** ô số liệu dùng component dùng chung, không phải markup cục bộ

**Given** hai bản đặt cạnh nhau
**When** so đúng **năm mục**: bố cục khối, màu, khoảng cách, cỡ/kiểu chữ, trạng thái hover
**Then** năm mục đều khớp
**And** đây là kiểm thủ công có chủ ý — dự án chưa có test tự động (NFR5); không mở rộng danh mục ngoài năm mục này
**And** phép so khớp này chính là cách cưỡng chế NFR6 (không thiết kế lại giao diện): bất kỳ "cải thiện" thẩm mỹ nào cũng làm story fail, kể cả khi trông đẹp hơn

**Given** component dùng chung đã tạo
**When** kiểm nội dung `src/components/`
**Then** tên component theo vai trò với tiền tố `C` — không có tên chứa `Home`, `Ai`, `Exam` (AD-9)
**And** `grep -nE "#[0-9a-fA-F]{3,6}|[0-9]+px" src/components/*.vue` trả về **0 kết quả** (AD-8)
**And** không component nào gọi storage, API, hay router (AD-9)

**Given** token được lấy từ Legacy app
**When** kiểm cách nạp
**Then** `web-en/css/variables.css` được **import**, không có bản sao nào trong `web-app/` (AD-8)
**And** CSS toàn cục của Vue app chỉ gồm token + reset; không có file global thứ ba (AD-10)

**Given** một token màu trong `web-en/css/variables.css` bị đổi giá trị
**When** tải lại trang chủ bản Vue
**Then** màu tương ứng đổi theo mà không sửa file nào khác (FR4)
**And** trang chủ bản Legacy cũng đổi theo — cùng một nguồn token

**Given** trang chủ bản Vue
**When** kiểm route của nó
**Then** route mang hình dạng đường dẫn Legacy của trang chủ (AD-13)

### Story 2.3: Đi lại được giữa trang đã chuyển và trang chưa port

As a người dùng,
I want bấm bất kỳ liên kết nào trên bản Vue và tới được đích,
So that tôi dùng app như một thứ liền mạch chứ không phải hai app rời rạc.

**Acceptance Criteria:**

**Given** một file khai danh sách trang **đã chuyển**
**When** kiểm cách điều hướng hoạt động
**Then** mọi điều hướng đi qua **một** helper đọc danh sách đó (AD-7)
**And** trang trong danh sách đi bằng router; trang ngoài danh sách đi bằng đường tương đối sang Legacy app
**And** không page component nào tự quyết đích đến của một liên kết

**Given** trang chủ bản Vue có 10 liên kết ra ngoài
**When** bấm từng liên kết
**Then** cả 10 đều mở được — không trang trắng, không 404 (FR3)
**And** liên kết tới `pages/java/backend.html` dẫn sang Legacy app, vì đó là một trong 6 trang nội dung dài không bao giờ port (AD-14)

**Given** một trang mới vừa được port
**When** thêm nó vào danh sách trang đã chuyển
**Then** **chỉ** thay đổi đó là đủ để mọi liên kết tới trang đó chuyển sang router (AD-7)
**And** không phải sửa bất kỳ page component nào khác

**Given** người dùng đang ở một trang Legacy chưa port
**When** bấm liên kết trở về trang chủ
**Then** tới được trang chủ (bản Vue nếu cùng origin, bản Legacy nếu không) — không đường nào dẫn tới 404

**Given** helper điều hướng
**When** kiểm mã nguồn
**Then** không chứa host hay số cổng nào (AD-2)

### Story 2.4: Bản Vue phục vụ được từ cùng origin với Legacy app

As a người dùng đã có tiến độ học,
I want bản Vue chạy cùng địa chỉ với bản cũ,
So that tiến độ tôi đã tích luỹ vẫn còn nguyên khi trang được chuyển sang Vue.

**Acceptance Criteria:**

**Given** `npm run build` đã sinh bundle tĩnh
**When** bundle được phục vụ từ cùng origin với Legacy app
**Then** mở trang chủ bản Vue ở origin đó hoạt động bình thường
**And** các trang Legacy chưa port vẫn mở được ở cùng origin đó

**Given** trước đó đã có dữ liệu trong `localStorage` và IndexedDB `SkillForgeProgress` do bản Legacy ghi
**When** mở bản Vue ở **cùng origin**
**Then** đọc được đúng dữ liệu đó (điều kiện tiên quyết của FR6, và là nền cho Epic 3)

**Given** bản Vue chạy ở Vite dev server tại cổng riêng
**When** đọc `localStorage` hay IndexedDB
**Then** **không** thấy dữ liệu của Legacy app — vì đó là origin khác
**And** hành vi này được ghi lại là **ràng buộc đã biết** (AD-2), không phải lỗi cần vá; nghiệm thu tiến độ-cũ-đọc-được chỉ thực hiện ở chế độ cùng origin

**Given** cách nối hai app khi triển khai thật chưa được chốt
**When** hoàn thành story này
**Then** cách đã dùng được ghi lại, nhưng **không** khoá mất lựa chọn khác (spine §Deferred giữ mục này mở)
**And** không có host hay cổng nào bị hardcode vào source (AD-2)

---

## Epic 3: Màn có logic chạy trên bản Vue, tiến độ cũ còn nguyên

Người dùng dùng được một hub và một màn tương tác thật trên bản Vue, với tiến độ đã lưu trước đó đọc được — chứng minh khuôn chịu được cả logic lẫn dữ liệu, không chỉ trang tĩnh.

### Story 3.1: Một hub chạy trên bản Vue, giữ màu nhấn riêng của khu vực

As a người dùng,
I want hub Java trên bản Vue trông đúng như cũ, kể cả màu hổ phách riêng của khu vực Java,
So that việc chuyển sang Vue không làm mất dấu hiệu nhận biết khu vực mà tôi đã quen.

**Acceptance Criteria:**

**Given** `pages/java/hub.html` bản Legacy có thanh tiêu đề, một dòng mô tả, và lưới 4 thẻ
**When** hub được dựng trên bản Vue
**Then** hiển thị đủ thanh tiêu đề, dòng mô tả, 4 thẻ với icon và mô tả từng thẻ
**And** vỏ trang ghép **hoàn toàn** từ component dùng chung — `CTopbar` cho thanh tiêu đề, `CGrid` cho lưới, `CCard` cho thẻ (AD-12)
**And** trang **không** tự viết markup bố cục khung nào

**Given** hub Java dùng màu nhấn `#f59e0b` hổ phách, còn `ai/hub` dùng `#f472b6`, `english/hub` dùng `#34d399`, `learning-paths` dùng `#7c5cfc`
**When** kiểm cách màu nhấn được đặt
**Then** component dùng chung tham chiếu **một** tên token màu nhấn duy nhất (AD-17)
**And** trang ghi đè giá trị token đó trên phần tử gốc của chính nó
**And** **không** thêm token mới vào file token dùng chung cho mỗi khu vực
**And** `grep -nE "#[0-9a-fA-F]{3,6}" src/pages/*.vue` không tìm thấy hex trong `<style scoped>` — màu nhấn đi qua token, không phải hex rải rác

**Given** 4 trang điều hướng bản Legacy tự khai `:root` inline với bảng tên `--bg`/`--surface`/`--surface2`/`--border`/`--text`/`--text2`/`--accent`/`--radius`, không trùng một chữ nào với `variables.css`
**When** hub đầu tiên được port
**Then** phép ánh xạ từ bảng tên inline sang tên chuẩn của `variables.css` được ghi lại **một lần** ở nơi mọi trang sau dùng lại (AD-17)
**And** hub được port **không** tự ánh xạ riêng cho mình

**Given** hai bản hub đặt cạnh nhau
**When** so đúng năm mục: bố cục khối, màu, khoảng cách, cỡ/kiểu chữ, trạng thái hover
**Then** năm mục đều khớp, kể cả màu viền khi hover thẻ (`border-color` đổi sang màu nhấn)

**Given** hub đã chuyển
**When** thêm nó vào danh sách trang đã chuyển
**Then** liên kết tới hub từ trang chủ tự động đi bằng router, không phải sửa trang chủ (AD-7)
**And** 4 liên kết **ra** từ hub vẫn tới đích đúng, trong đó `spring-boot.html` dẫn sang Legacy app vì là trang nội dung dài không port (AD-14)

### Story 3.2: Màn phỏng vấn chạy trên bản Vue, checklist cũ còn nguyên

As a người đang ôn phỏng vấn,
I want mở màn phỏng vấn trên bản Vue và thấy checklist tôi đã tick từ trước,
So that tôi tin rằng chuyển sang Vue không làm mất tiến độ đã tích luỹ.

*Chọn màn này làm màn logic đầu tiên vì nó là màn duy nhất chạm cùng lúc ba invariant khó nhất: AD-5 (`interview-logic.js:20` đọc `window.interviewTopics`), AD-16 (`interview-data.js` xuất bằng `window.*`), AD-6 (`interview-logic.js:9,16` tự ghi `localStorage.interviewChecklist`). Màn quiz là lựa chọn thay thế nhưng chỉ chạm AD-6.*

**Acceptance Criteria:**

**Given** `interview-logic.js` export 6 hàm: `getTopics`, `getTopic`, `getChecklist`, `toggleChecklistItem`, `calcProgress`, `calcTopicProgress`
**When** màn phỏng vấn bản Vue được dựng
**Then** cả 6 hàm được **dùng lại** qua alias `@legacy`, không hàm nào bị viết lại trong `web-app/` (AD-3, FR7)
**And** `grep -rn "interview-logic" projects/web-app/src` chỉ ra đường import qua `@legacy`, không có đường tương đối `../web-en/`
**And** không tồn tại file cùng tên chứa cùng hàm trong `web-app/`

**Given** `interview-logic.js:20` hiện đọc `window.interviewTopics`
**When** hàm được sửa để Vue dùng được
**Then** `getTopics` **nhận dữ liệu qua tham số**, không đọc `window.*` (AD-5)
**And** giá trị mặc định giữ đường cũ, nên màn phỏng vấn **bản Legacy vẫn chạy y như trước** (NFR1)
**And** `grep -rn "window\." projects/web-app/src` không có phép gán `window.*` mới nào

**Given** `interview-data.js` xuất bằng `window.interviewTopics`
**When** Vue app cần dữ liệu đó
**Then** một dòng `export` được **thêm** cạnh phép gán `window.*` đang có; phép gán cũ giữ nguyên (AD-16)
**And** Vue app lấy dữ liệu bằng `import` ESM từ `@legacy/data/interview-data.js`
**And** không dùng `?raw`, không `eval`, không khai lại dữ liệu trong `web-app/`
**And** `interview-data.js` là file sinh tự động từ `build-interview-data.js` — script sinh phải được sửa để lần chạy sau vẫn giữ dòng `export`, nếu không thay đổi sẽ bị ghi đè mất

**Given** trước đó đã tick vài mục checklist ở bản Legacy, dữ liệu nằm trong `localStorage.interviewChecklist`
**When** mở màn phỏng vấn bản Vue ở **cùng origin**
**Then** đúng những mục đã tick hiện ra đã tick (FR6)
**And** tick thêm một mục ở bản Vue rồi mở lại bản Legacy thì thấy mục đó đã tick — **một nơi lưu, một người ghi** (AD-6)
**And** Vue app **không** dựng adapter riêng cho `interviewChecklist`; nó đọc/ghi qua chính `interview-logic.js` (AD-6)

**Given** màn phỏng vấn bản Vue
**When** so với bản Legacy theo năm mục và thử mọi thao tác
**Then** năm mục khớp, và mọi thao tác làm được ở bản Legacy đều làm được ở bản Vue (FR6)
**And** phần trăm tiến độ tính ra khớp nhau giữa hai bản

**Given** thay đổi đã xong
**When** kiểm phạm vi sửa trên `web-en/`
**Then** chỉ đụng nhóm (c) và (d) của AD-15 — chữ ký `getTopics`, dòng `export` ở file dữ liệu, và `build-interview-data.js`
**And** không refactor cơ hội nào khác trên `web-en/`

### Story 3.3: Khuôn thêm một trang mới được ghi lại và kiểm chứng

As a người xây,
I want một khuôn ngắn chỉ rõ các bước thêm một trang mới,
So that 19 trang còn lại là việc lặp có thể làm trong một buổi tối mỗi trang, không phải nghĩ lại từ đầu.

*Story này phủ một mục trong PRD §6.1 mà không FR nào nói tới: "Ghi lại khuôn thêm một trang mới thành tài liệu ngắn để đợt sau chỉ việc lặp." Nó cũng chính là phép đo của SM-1.*

**Acceptance Criteria:**

**Given** đã port xong trang chủ, một hub, và một màn logic
**When** khuôn được viết
**Then** nó liệt kê các bước theo đúng trình tự, mỗi bước dẫn chiếu AD chi phối bước đó
**And** nói rõ khi nào **được** tạo component mới và khi nào phải thêm biến thể vào component có sẵn (AD-12)
**And** nói rõ cách xử lý màu nhấn theo khu vực (AD-17), dữ liệu Legacy (AD-16), và logic đọc `window.*` (AD-5)
**And** nêu danh mục năm mục dùng để so giao diện (NFR5)

**Given** khuôn đã viết
**When** dùng nó để thêm **một** trang điều hướng nữa (ví dụ `english/hub`)
**Then** trang mới dựng xong **không cần viết file CSS mới nào** (FR5)
**And** không cần thêm component mới nào — dùng lại `CTopbar`/`CGrid`/`CCard` đã có
**And** thời gian thực tế được ghi lại để đối chiếu với SM-1 ("dưới một buổi tối")

**Given** khuôn được kiểm bằng một trang thật
**When** phát hiện bước nào thiếu hoặc gây nhầm
**Then** khuôn được sửa ngay trong story này, không để lại cho đợt lặp
**And** nếu việc dựng trang thứ hai lộ ra một AD còn hở, ghi lại thành đầu vào cho lần cập nhật spine — **không** tự nới AD trong story

**Given** MVP hoàn tất
**When** đối chiếu với phạm vi PRD §6.1
**Then** cả 5 mục "Trong phạm vi" đều có story phủ
**And** ghi rõ phần **chưa** làm: 19 trang còn lại, 7 lỗi mức thấp, test tự động, và các mục §Deferred của spine — để không ai hiểu MVP là hoàn tất refactor
