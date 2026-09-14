# Phòng luyện code (`/code-lab`)

Trang luyện code kiểu LeetCode: đọc đề, viết code, **chạy thật**, chấm bằng test ẩn và tính điểm.
Mã nguồn chính:

| Tệp | Vai trò |
|---|---|
| `projects/web-app/src/pages/CodeLabPage.vue` | Trang: danh sách đề, đề bài, tài liệu, editor, bảng điểm, lịch sử nộp |
| `projects/web-app/src/components/CCodeEditor.vue` | Editor tự viết: tô màu cú pháp, số dòng, Tab, Enter tự canh lề |
| `projects/web-app/src/logic/code-lab-logic.js` | Logic thuần: so khớp kết quả, chấm điểm, xếp hạng, lọc, tô màu, lưu bài giải |
| `projects/web-app/src/data/code-problems.js` | 9 đề bài: mô tả, ví dụ, ràng buộc, gợi ý, test hiện + test ẩn, lời giải JS |
| `projects/web-app/src/data/code-problems-multilang.js` | Bổ sung: kiểu tham số, code khởi tạo + lời giải Java/Python, tài liệu học từng đề |
| `projects/web-app/src/utils/code-runner.js` | Chạy JavaScript trong Web Worker (trình duyệt) |
| `projects/web-app/src/workers/code-worker.js` | Worker: gọi `runTests` rồi trả kết quả đã chấm |
| `projects/web-en/server/code-judge.js` | Bộ chấm máy chủ: sinh harness Java/Node/Python, chạy, giới hạn thời gian |

## Hai đường chấm

```
JavaScript  →  Web Worker trong trình duyệt   (chạy được cả trên bản deploy)
Node.js ┐
Java    ├→  POST /api/code/run  →  sinh harness  →  node / javac+java / py
Python  ┘
```

- **JavaScript**: chạy trong Web Worker, vượt thời gian thì luồng chính `terminate()` worker. Không cần máy chủ.
- **Node.js / Java / Python**: trang gửi `{ language, code, functionName, tests, compare, params, returns }`
  lên `/api/code/run`; máy chủ sinh mã harness tương ứng rồi chạy và trả về cùng cấu trúc kết quả
  (`verdict`, `passed`, `total`, `results`, `logs`, `totalMs`).

### Cách harness hoạt động

- **Java** (`buildJavaHarness`): sinh `Main.java` gồm `import java.util.*;` + code người học + comparator
  theo `compare` + `main()` gọi hàm với literal Java sinh từ test (`javaLiteral`). Hàm phải là `public static`
  đúng chữ ký trong code khởi tạo.
- **Node.js** (`buildNodeHarness`): sinh `harness.mjs` **import lại chính `code-lab-logic.js`** để hai nơi
  dùng chung một logic chấm, tránh lệch nhau.
- **Python** (`buildPythonHarness`): sinh `solution.py` (code người học) + `runner.py` nạp module bằng
  `importlib`, gọi hàm tên `snake_case` (ví dụ `lengthOfLongestSubstring` → `length_of_longest_substring`).

Mọi harness in kết quả một dòng có tiền tố `__RESULT__` + JSON; máy chủ lấy dòng cuối cùng nên
`console.log`/`System.out.println` của người học không phá kết quả.

## An toàn (đọc trước khi bật ở đâu khác)

Chạy code của người khác là việc nguy hiểm. Các chốt đang có:

1. **Chỉ localhost**: `isCodeRunAllowed()` chỉ cho chạy khi request đến từ loopback, trừ khi đặt
   `SKILLFORGE_ALLOW_CODE_RUN=1`. **Bản deploy Render cố tình từ chối** — JavaScript vẫn chấm bình thường
   vì chạy trong trình duyệt.
2. **Giới hạn thời gian**: chạy 6 giây, biên dịch Java 15 giây; hết giờ thì `taskkill /T /F` cả cây tiến trình
   (`py` trên Windows là trình khởi động nên kill tiến trình cha là chưa đủ).
3. **Thư mục tạm riêng** cho mỗi lần chấm, xoá sau khi xong.
4. **Môi trường tối thiểu**: tiến trình con chỉ nhận `PATH`, `TEMP`, `SystemRoot`... nên không đọc được
   biến môi trường của máy chủ (`.env`, API key). Giới hạn bộ nhớ bằng `JAVA_TOOL_OPTIONS=-Xmx256m`.
5. **1 bài một lúc** (`isBusy()` → 429) và output cắt ở 64KB.

Chưa có sandbox hệ điều hành: code vẫn có thể đọc/ghi tệp mà tiến trình được phép. **Không bật cờ
`SKILLFORGE_ALLOW_CODE_RUN` trên máy chủ công khai.**

## Chấm điểm

| Mức | Điểm gốc |
|---|---|
| Dễ | 100 |
| Trung bình | 200 |
| Khó | 300 |

`điểm = round(điểm_gốc × số_test_đạt / tổng_test) + thưởng_tốc_độ`, thưởng chỉ khi đạt hết:
`+20` nếu ≤ 50ms, `+12` nếu ≤ 200ms, `+6` nếu ≤ 600ms. Điểm lưu là **điểm cao nhất từng đạt**,
thời gian lưu là **thời gian nhanh nhất khi đạt hết**. Xếp hạng theo tổng điểm: Tân binh → Tập sự →
Thợ rèn → Kiếm sĩ → Cao thủ → Bậc thầy.

## Khoá lưu trữ

| Khoá | Nội dung |
|---|---|
| `sf_code_lab_solutions` | `{ [problemId]: { solved, score, ms, attempts, passed, total, lastVerdict, history[10] } }` |
| `sf_code_lab_drafts` | `{ [problemId]: code đang viết dở }` |

Cả hai đã có nhãn tiếng Việt trong `PROGRESS_KEY_LABELS` (`utils/auth-logic.js`) nên hiện đúng
khi xuất/nhập tiến độ. Lưu ý localStorage theo từng cổng: `5173` và `8080` là hai nơi lưu riêng.

## Thêm một đề bài

1. Thêm object vào `CODE_PROBLEMS` (`data/code-problems.js`): `id`, `title`, `summary`, `difficulty`,
   `category`, `tags`, `compare` (`exact` | `unordered` | `set-of-sets` | `sorted-rows`), `functionName`,
   `description`, `examples`, `constraints`, `hints`, `starter`, `solution`, `tests` (đánh dấu `visible: true`
   cho test công khai).
2. Thêm gói ngôn ngữ vào `PACKS` (`data/code-problems-multilang.js`): `params`, `returns`, `javaStarter`,
   `javaSolution`, `pythonStarter`, `pythonSolution`, `docs` (theory/steps/complexity/pitfalls).
3. Chạy `node .tmp-check/test-code-lab-languages.mjs` — bộ này **chạy thật** lời giải mẫu của cả 4 ngôn ngữ
   và bắt buộc code khởi tạo phải trượt, nên không thể thêm đề sai.

## Kiểm chứng

Các bộ kiểm dưới đây là script Node không phụ thuộc thư viện, nằm trong `.tmp-check/` ở máy phát triển
(**không commit** — chạy trực tiếp bằng `node .tmp-check/<tên>.mjs`).

| Bộ kiểm | Nội dung |
|---|---|
| `.tmp-check/test-code-lab-logic.mjs` | 227 test logic thuần, gồm cả tự kiểm chứng ngân hàng đề JS và tô màu từng ngôn ngữ |
| `.tmp-check/test-code-judge.mjs` | 66 test bộ chấm máy chủ: sinh harness, Đạt/Sai/Lỗi cú pháp/Lỗi chạy/Quá thời gian trên cả 3 ngôn ngữ, chốt localhost |
| `.tmp-check/test-code-lab-languages.mjs` | 9 đề × 4 ngôn ngữ: lời giải mẫu phải Đạt hết, code khởi tạo phải trượt |
| `.tmp-check/verify-code-lab.mjs` | 112 kiểm chứng giao diện thật bằng Chrome CDP, gồm chọn ngôn ngữ, tab Tài liệu và nộp bài Java/Node/Python qua máy chủ |

## Đã sửa trong quá trình làm

- Mảng test lấy từ `data` của component là **Proxy reactive của Vue** → `postMessage` ném `DataCloneError`
  và promise không bao giờ trả về (trang kẹt ở "Đang chạy..."). Vá bằng cách chuyển sang object thuần
  trước khi gửi worker, cộng `try/catch/finally` trong `execute()`.
- Chiều cao editor tính bằng computed đọc `window.innerWidth` một lần → không đổi khi xoay màn hình; đã
  chuyển sang media query CSS.
- `py` trên Windows là trình khởi động → hết giờ phải kill cả cây tiến trình, nếu không tiến trình con
  chạy mãi và giữ luôn luồng chấm.
