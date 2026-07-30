# Mô hình dữ liệu — Part `client`

Không có database phía server. Toàn bộ dữ liệu người dùng nằm trong browser: **2 IndexedDB** + **8 khoá localStorage**. Nội dung học (từ vựng, câu hỏi, cheatsheet) là dữ liệu tĩnh nhúng trong file JS.

---

## IndexedDB 1 — `SkillForgeProgress` (version 2)

Định nghĩa tại `js/data/progress-db.js`, truy cập qua `window.progressDB`. Theo dõi tiến độ học.

### Store `sessions` — phiên học
`keyPath: 'id'` (autoIncrement) · index: `date`, `type`

| Field | Kiểu | Ghi chú |
|---|---|---|
| `id` | number | tự tăng |
| `date` | string | ISO 8601, sinh lúc ghi |
| `type` | string | loại hoạt động (quiz, vocab, exam…) |
| `itemId` | string \| null | mục cụ thể |
| `duration` | number | giây |
| `score` / `total` | number | điểm đạt / tổng |
| `percentage` | number | tự tính `round(score/total*100)`, 0 nếu `total = 0` |

### Store `completed` — mục đã hoàn thành
`keyPath: 'id'` · index: `category`, `completedAt`

### Store `stats` — điểm kỹ năng & streak
`keyPath: 'key'` — dạng key-value phẳng, không index.

### Store `goals` — mục tiêu
`keyPath: 'id'` (autoIncrement) · index: `dueDate`, `status`

### Store `bookmarks` — đánh dấu
`keyPath: 'id'` · index: `category`

---

## IndexedDB 2 — `SkillForgeSRS` (version 1)

Định nghĩa tại `js/data/spaced-repetition.js`, truy cập qua `window.srsSystem`. Cài thuật toán **SM-2** để giãn cách ôn tập từ vựng.

### Store `reviewHistory`
`keyPath: 'id'` · index: `dueDate`, `category`, `difficulty`

Tham số SM-2 (hardcode trong `srsSystem.params`):

| Tham số | Giá trị |
|---|---|
| `minInterval` | 1 ngày |
| `maxInterval` | 365 ngày |
| `easyBonus` | 1.3 |
| `initialInterval` | 1 ngày |
| `initialEase` | 2.5 |

---

## localStorage — 8 khoá

| Khoá | Nội dung | Có tiền tố |
|---|---|---|
| `skillforge_skills` | danh sách kỹ năng theo dõi | ✓ |
| `skillforge_skill_state` | trạng thái màn skill-tracker | ✓ |
| `skillforge_timer_state` | trạng thái đồng hồ pomodoro | ✓ |
| `skillforge_exam_history` | lịch sử làm đề | ✓ |
| `skillforge_log` | log hoạt động | ✓ |
| `quizHistory` | lịch sử quiz | ✗ |
| `aiChecklist` | checklist học AI | ✗ |
| `learnChecklist` | checklist code-learn | ✗ |

**Nợ nhất quán:** 3 khoá cuối không có tiền tố `skillforge_`. Rủi ro xung đột với script khác cùng origin, và không xoá được sạch bằng một vòng lặp theo prefix.

**Nợ trùng vai:** `quizHistory` và `skillforge_exam_history` cùng lưu lịch sử làm bài; `progressDB.sessions` cũng ghi việc đó ở IndexedDB. Ba nơi lưu chồng lấn, không có nguồn sự thật duy nhất.

---

## Dữ liệu nội dung (tĩnh, nhúng trong JS)

| File | Dòng | Xuất qua | Nội dung |
|---|---|---|---|
| `js/data/interview-data.js` | 384 | `window.interviewTopics` | câu hỏi phỏng vấn — **sinh tự động** từ `interview_java/*.md` bằng `build-interview-data.js` |
| `js/data/sentence-practice.js` | 370 | `window.*` | bài luyện câu |
| `js/data/salary-interview-data.js` | 348 | `window.*` | câu hỏi theo mức lương (bản offline) |
| `js/data/learn-data.js` | 238 | `window.learnTopics` | chủ đề code-learn |
| `js/data/vocabulary.js` | 213 | ESM `export` | từ vựng |
| `js/data/ai-data.js` | 208 | `window.aiConcepts`, `aiQuizData`, `aiProjects`, `aiInterviewTopics` | nội dung AI |
| `js/data/tenses.js` `stories.js` `practice.js` `idioms.js` `expanded-*.js` | — | ESM `export` | tiếng Anh |
| `js/data/search-index.js` | — | `window.searchIndex` | chỉ mục tìm kiếm |
| `js/data/data-meta.js` | — | `window.*` | metadata |

**Nợ nhất quán:** 6 file dùng `export` ESM, 10 file dùng `window.*`. Cùng một vai trò (nguồn dữ liệu tĩnh), hai cách xuất khác nhau — đây là ranh giới chia đôi codebase, xem [architecture-client.md](./architecture-client.md).

`interview_java/` chứa 30 file markdown (232KB) là nguồn gốc; `build-interview-data.js` biên dịch chúng thành `interview-data.js`. **Đây là build step duy nhất tồn tại trong dự án** và phải chạy tay.

---

## Chiến lược migration

Không có. `progress-db.js` dùng `onupgradeneeded` + `if (!db.objectStoreNames.contains(...))` — cộng thêm store mới thì được, nhưng **không có đường đổi hình dạng dữ liệu cũ**. `dbVersion: 2` đã tăng một lần mà không có code migrate dữ liệu từ v1.

Nếu refactor có đổi schema, phải viết nhánh migrate trong `onupgradeneeded` — dữ liệu người dùng nằm trong browser của họ, không reset được từ xa.
