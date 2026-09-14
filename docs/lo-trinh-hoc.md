# Lộ trình học — cách tổ chức và cách tính tiến độ

> Trang `/learning-paths` được làm lại ngày 2026-09-14. Tài liệu này nói **vì sao**, **dữ liệu nằm ở đâu** và **cách thêm một chặng** mà không phá tiến độ.

## 1. Vấn đề của bản cũ

| Vấn đề | Bằng chứng |
|---|---|
| Chỉ 4 thẻ tĩnh, 12 dòng mốc chữ, 3 đích đến (`/english`, `/java/hub`, `/ai`) trong khi app có 46 route | `src/pages/LearningPathsPage.vue` (bản cũ) |
| Bản legacy giàu hơn bản Vue: có `objective`, `finalProject`, `prerequisites`, `lessons`, `getPathProgress()` — port sang Vue đã bỏ hết | `web-en/js/data/learning-path-data.js` |
| Mốc không tick được, không %, không link tới bài học cụ thể, không "bước tiếp theo" | bản cũ |
| Không có điều kiện đạt chuẩn, không có dự án đầu ra, không nhắc ôn tập | bản cũ |
| Quiz "Java từ 0" chỉ giữ câu trả lời trong RAM → tải lại mất sạch | `JavaTuZeroPage.vue` |
| 43 task "Thực chiến" chỉ lưu bộ lọc, không lưu task đã làm | `JavaThucChienPage.vue` |

## 2. Cấu trúc mới

**5 trục**: `java-backend` (trục chính, 6 chặng, 12 tuần), `english`, `frontend`, `devops-cloud`, `ai`.

Mỗi chặng bắt buộc đủ **6 phần**:

| Phần | Trường dữ liệu | Vì sao bắt buộc |
|---|---|---|
| Mục tiêu đo được | `outcome` | Học để *làm được gì*, không phải để "đã đọc" |
| Bài học | `lessons[]` (mỗi mục có `path` thật) | Chỉ tới đúng nội dung, không mô tả chung |
| Luyện tập có chấm | `practice[]` (`kind`: `code`/`quiz`/`tasks`/`seen`/mặc định tay) | Học chủ động + phản hồi tức thì |
| Điều kiện đạt chuẩn | `checkpoint` | Đo bằng năng lực, không bằng số ngày |
| Sản phẩm | `project` | Chuyển giao ra ngoài bài học (transfer) |
| Cách ôn lại | `review` | Chống quên theo mốc 1-3-7 ngày |

Thêm `weeks`, `hours` và `prerequisites[]` (tiên quyết **chỉ cảnh báo mềm**, không chặn).

## 3. Hai file chính

- Dữ liệu: `projects/web-app/src/data/learning-paths.js` — `LEARNING_TRACKS`, `PRIMARY_TRACK_ID`, `findTrack()`.
- Logic thuần: `projects/web-app/src/logic/learning-path-logic.js` — đọc tín hiệu, tính %, việc tiếp theo, nhắc ôn. **Không import dữ liệu legacy** để chạy được trong Node.

## 4. Tiến độ lấy từ đâu (không tự khai)

| Nguồn thật | Khoá localStorage | Việc được tính |
|---|---|---|
| Phòng luyện code | `sf_code_lab_solutions` | `kind: 'code'` — đủ danh sách `target.problems` đạt hết test ẩn |
| Quiz Java từ 0 | `sf_java_tuzero_quiz` | `kind: 'quiz'` — đủ `answered` **và** đủ `correct` (≥ 80%) |
| Trang Thực chiến | `thucChien_done` | `kind: 'tasks'` — số task đã đánh dấu xong (`target.min`) |
| Phỏng vấn UI/FE | `sf_ui_interview_seen` | `kind: 'seen'` — số câu đã xem (`target.min`) |
| Pomodoro | `sf_timer_history` | tổng giờ tập trung + số ngày liên tiếp ở thẻ "Hôm nay học gì" |
| Đánh dấu của người học | `sf_learning_progress` | việc tay (`{ items, stages }`) và ngày đạt chuẩn từng chặng |

Điểm quiz được chấm bằng `countQuizResult(JAVA_TU_ZERO, readQuizState())` — logic không tự import nội dung đề, nhờ vậy test được trong Node.

## 5. Luật dữ liệu

1. **Mọi `path` phải là route có thật.** `test-learning-path-logic.mjs` đọc `src/router/index.js` và đối chiếu — thêm chặng mà quên route là test đỏ ngay.
2. Mỗi chặng phải có đủ 6 phần, `hours > 0`, và `prerequisites` phải trỏ tới chặng cùng trục.
3. `id` chặng không được trùng toàn app (`jb-1`, `en-1`, `fe-1`, `do-1`, `ai-1`…).
4. Không thêm khoá localStorage mới nếu đã có nguồn tương đương.

## 6. Đạt chuẩn, tiên quyết, ôn tập

- `markStageComplete(stage, signals, done)`: đánh dấu đạt chuẩn thì **tick luôn các việc tự đánh giá còn lại**, để "đã đạt chuẩn" và thanh % không bao giờ nói hai điều khác nhau.
- Việc tự chấm (`code`/`quiz`/`tasks`/`seen`) không có nút tick tay; việc bài học và điều kiện đạt chuẩn thì có.
- `prerequisiteWarnings()` chỉ trả về tên chặng còn thiếu để hiện cảnh báo vàng "Nên học sau…"; không khoá, không ẩn, không vô hiệu hoá liên kết.
- `reviewReminders(track, ticks)` nhắc chặng đã xong từ `REVIEW_GAP_DAYS = 7` ngày trở lên, kèm số ngày.

## 7. Sửa kèm trong cùng đợt

- `JavaTuZeroPage.vue`: câu trả lời quiz lưu vào `sf_java_tuzero_quiz` (`{ chapter, read }`) ngay khi bấm, tự nạp lại khi mở trang.
- `JavaThucChienPage.vue`: thêm `thucChien_done` + nút "⬜ Đánh dấu xong" trên từng task và trong modal + ô đếm "Đã làm xong".
- `src/utils/auth-logic.js`: bổ sung nhãn cho 3 khoá mới để hộp nhập/xuất tiến độ hiện đúng tên.

## 8. Kiểm chứng (script chỉ chạy local, không commit)

```powershell
node .tmp-check/test-learning-path-logic.mjs          # 226 kiểm: dữ liệu, route thật, %, việc tiếp theo, nhắc ôn, dữ liệu hỏng
node .tmp-check/verify-learning-paths.mjs http://localhost:8080
```

`verify-learning-paths.mjs` chạy app thật: 5 trục, 6 chặng, 3 nhóm việc, cảnh báo tiên quyết mềm, tiến độ nhảy khi giải bài code / trả lời quiz / đánh dấu task, lưu qua tải lại, nhắc ôn sau 9 ngày, đổi trục, quiz Java từ 0 không mất, 390px không tràn ngang, 0 lỗi JS.

## 9. Chưa làm (nợ kỹ thuật, biết để không tưởng nhầm là đã có)

- **Chưa có hệ thống ôn tập ngắt quãng thật** (SRS): hiện chỉ là dòng nhắc theo mốc ngày, chưa có lịch ôn từng thẻ kiến thức.
- **Dashboard vẫn đọc khoá legacy** (`skillforge_skills`, `skillforge_exam_history`, `skillforge_log`) nên chưa thấy việc làm ở Code Lab / Pomodoro / lộ trình. Hai hệ tên khoá vẫn song song.
- `sf_exam_history`, `sf_quiz_history`, `sf_forge_daily` vẫn chỉ có nhãn trong hộp nhập/xuất, chưa trang nào ghi.
- Quiz chỉ chấm được điểm của **Java từ 0**; các quiz khác trong app chưa lưu kết quả nên chưa gắn được vào điều kiện đạt chuẩn.
- `hours` của chặng là dự kiến; chưa đối chiếu với giờ thật đã học từ Pomodoro.
