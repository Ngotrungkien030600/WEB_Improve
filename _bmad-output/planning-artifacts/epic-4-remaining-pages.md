# Epic 4: Port toàn bộ 23 trang còn lại sang Vue

## Overview

Epic này hoàn thành việc port toàn bộ 23 trang vanilla JS còn lại trong `web-en/` sang Vue app (`web-app/`), đảm bảo:

1. Mỗi trang sau khi port đều chạy được trên Vue
2. Điều hướng 2 chiều giữa trang đã port và chưa port hoạt động
3. Logic nghiệp vụ được tái sử dụng theo AD-3, AD-4, AD-5, AD-16
4. Dữ liệu tiến độ cũ vẫn đọc được (AD-6)

## Pages cần port (23 trang)

### Game Pages (3 trang - interactive, medium complexity)
- `game-memory.html` — Memory card game
- `game-scramble.html` — Word scramble game  
- `game-speedquiz.html` — Speed quiz game

### Practice & Exam Pages (3 trang - interactive, high complexity)
- `exam.html` — Exam/quiz với timer, history
- `sentence-practice.html` — Practice sentences
- `skill-tracker.html` — Skill tracking

### Hub Pages (4 trang - navigation, low complexity)
- `english.html` — English hub
- `learning-paths.html` — Learning paths hub
- `frontend/frameworks.html` — Frontend frameworks
- `frontend/javascript.html` — JavaScript reference

### Info & Tool Pages (5 trang - static/mixed)
- `ai-agent.html` — AI agent playground
- `accelerator.html` — Skill accelerator
- `cloud.html` — Cloud knowledge (content-heavy, AD-14)
- `salary-interview.html` — Salary interview prep
- `code-learn.html` — Code learning (đang fix bug)

### Java Sub-pages (3 trang - content-heavy, AD-14 exempt)
- `java/backend.html` — Backend content (AD-14: không port)
- `java/spring-boot.html` — Spring Boot content (AD-14: không port)
- `java/thuc-chien.html` — Thực chiến (AD-14: không port)

### Frontend Sub-pages (2 trang - content-heavy, AD-14)
- `frontend/html-css.html` — HTML/CSS reference (AD-14: không port)
- `frontend/responsive.html` — Responsive design (AD-14: không port)

### Other Pages (3 trang)
- `interview-english.html` — English interview
- `bmad-agents.html` — BMAD agents (đã fix 1.2 nhưng chưa port sang Vue)
- `english.html` → hub đã list ở trên

## Stories

### Story 4.1: Port 3 game pages (memory, scramble, speedquiz)

As a người dùng,
I want chơi được 3 game (memory, scramble, speedquiz) trên bản Vue,
So that không cần quay về bản Legacy để chơi game.

**Acceptance Criteria:**

Given game pages đã port sang Vue
When người dùng mở game từ hub
Then game chạy đúng như bản Legacy về logic và UI
And điểm/score được lưu vào localStorage đúng key (AD-6)

Given game đang chạy trên Vue
When hoàn thành một round
Then hiển thị kết quả đúng
And timer hoạt động đúng (nếu có)

Given game đang chạy trên Vue
When reload trang
Then tiến độ game reset (không crash)

### Story 4.2: Port exam và skill-tracker pages

As a người dùng,
I want làm bài thi và theo dõi kỹ năng trên bản Vue,
So that tiến độ học tập của tôi được đồng bộ.

**Acceptance Criteria:**

Given exam page đã port
When người dùng làm bài thi
Then quiz history được lưu đúng key (AD-6)
And timer hoạt động đúng
And kết quả hiển thị đúng

Given skill-tracker đã port
When người dùng cập nhật skill
Then dữ liệu được ghi vào IndexedDB đúng store (AD-6)
And đọc được tiến độ từ bản Legacy (cùng origin)

### Story 4.3: Port sentence-practice page

As a người dùng,
I want luyện câu trên bản Vue,
So that có trải nghiệm học tập liền mạch.

**Acceptance Criteria:**

Given sentence-practice đã port
When người dùng nhập và kiểm tra câu
Then logic kiểm tra hoạt động đúng
And tiến độ được lưu (nếu có)

### Story 4.4: Port hub pages (english, learning-paths, 2 frontend)

As a người dùng,
I want điều hướng từ hub sang các trang con trên bản Vue,
So that không bị gián đoạn khi duyệt app.

**Acceptance Criteria:**

Given hub pages đã port
When người dùng bấm vào thẻ điều hướng
Then liên kết tới trang đã port đi qua Vue router
And liên kết tới trang chưa port (AD-14 exempt) đi sang Legacy app

Given hub pages đã port
When người dùng bấm nút quay về trang chủ
Then quay về trang chủ Vue

### Story 4.5: Port info pages (ai-agent, accelerator, salary-interview)

As a người dùng,
I want truy cập các trang thông tin trên bản Vue,
So that có cái nhìn tổng quan về app.

**Acceptance Criteria:**

Given ai-agent đã port
When người dùng sử dụng AI agent
Then API call hoạt động qua proxy (AD-2)
And response hiển thị đúng

Given accelerator/salary pages đã port
When người dùng xem nội dung
Then nội dung hiển thị đúng (AD-14: static content)

### Story 4.6: Port code-learn page

As a người dùng,
I want học code trên bản Vue,
So that có checklist tiến độ được đồng bộ.

**Acceptance Criteria:**

Given code-learn đã port
When người dùng chọn topic và tick checklist
Then tiến độ được lưu vào localStorage (AD-6)
And có thể chuyển giữa các topic

Given code-learn đã port
When người dùng mở lại trang
Then tiến độ checklist được khôi phục

### Story 4.7: Port interview-english và cập nhật bmad-agents

As a người dùng,
I want học English interview và sử dụng BMAD agents trên Vue,
So that mọi tính năng đều có trên bản Vue.

**Acceptance Criteria:**

Given interview-english đã port
When người dùng học English interview
Then nội dung và checklist hoạt động đúng

Given bmad-agents đã port sang Vue
When người dùng chat với agents
Then API call đi đúng endpoint (Story 1.2 đã fix)
And chat UI hiển thị đúng style

### Story 4.8: Cập nhật routing và verify cuối cùng

As a người dùng,
I want tất cả 23 trang đều chạy được trên Vue,
So that không còn trang nào phải quay về Legacy.

**Acceptance Criteria:**

Given tất cả stories đã hoàn thành
When kiểm tra navigation registry
Then tất cả 23 trang đã được thêm vào
And mọi liên kết từ hub đi đúng

Given test trên cùng origin
When so sánh Vue vs Legacy
Then 5 mục kiểm (bố cục, màu, khoảng cách, font, hover) khớp
And tiến độ cũ đọc được

## Non-Functional Requirements

NFR1: Legacy app tại `web-en/` luôn chạy được trong suốt quá trình port
NFR2: Không port 6 trang content-heavy (AD-14): cloud, java/backend, java/spring-boot, java/thuc-chien, frontend/html-css, frontend/responsive
NFR3: Component dùng chung từ Epic 2 được tái sử dụng tối đa
NFR4: Logic nghiệp vụ được tái sử dụng qua `@legacy` (AD-3, AD-4, AD-5, AD-16)

## Dependencies

- Epic 2 (Vue scaffold, routing, components) — phải xong trước
- Epic 3 (khuôn port trang) — đã hoàn thành, dùng làm template
- Story 1.2 (BMAD chat fix) — bmad-agents page cần endpoint đã fix
