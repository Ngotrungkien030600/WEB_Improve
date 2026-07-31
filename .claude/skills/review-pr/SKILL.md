---
name: review-pr
description: Review một GitHub Pull Request của người khác gửi tới. Lấy diff qua gh, tìm bug và vấn đề chất lượng, trình bày tiếng Việt nhóm theo mức độ nghiêm trọng. Dùng khi user nói "review pr <số/URL>" hoặc "review pr này giúp".
---

# Review PR — Tiếng Việt

Skill này review PR trên GitHub (thường là của member khác gửi tới), khác với `code-review` vốn review diff local.

## Bước 0 — Xác định PR & lấy diff

1. Nhận target từ argument: số PR (`123`), URL PR, hoặc branch. Nếu user không đưa, HỎI lại số/URL PR trước khi tiếp tục — đừng đoán.
   - **Cờ `--post`**: nếu argument có `--post`, sau khi review xong sẽ **đăng thẳng kết quả lên PR** ở Bước 4 mà KHÔNG hỏi lại. Không có cờ này → mặc định chỉ hiển thị cho user, không đăng.
2. Đọc metadata PR để có context (title, mô tả, files, base branch):
   ```
   gh pr view <PR> --json number,title,body,author,baseRefName,headRefName,files,additions,deletions
   ```
3. Lấy diff để review:
   ```
   gh pr diff <PR>
   ```
   Đây là **phạm vi review**. Nếu diff quá lớn, ưu tiên các file có nhiều thay đổi nhất (từ trường `files`).
4. (Tùy chọn) Nếu cần đọc thêm ngữ cảnh xung quanh (toàn bộ function, caller/callee) mà diff không đủ, checkout PR về local:
   ```
   gh pr checkout <PR>
   ```
   rồi đọc file trực tiếp. Nhớ lưu lại branch hiện tại để checkout về sau nếu cần.

Nếu `gh` chưa auth (`gh auth status` lỗi) → báo user chạy `gh auth login` trước.

## Bước 1 — Tìm candidates (song song)

Chạy **5 angle** qua Agent tool, mỗi angle tìm tối đa 6 candidates với `file`, `line`, `summary`, `failure_scenario`. Truyền diff (và context PR ở Bước 0) cho từng agent. Angle E chạy độc lập, không gộp vào D:

> **Tận dụng CodeGraph nếu PR đã checkout về local (Bước 0):** khi PR đã checkout, CodeGraph auto-index working tree — prompt sẽ có `codegraph_context` (call flow + `Blast radius` + body symbol). **Tái dùng nó**, đừng để mỗi angle re-grep/re-Read lại; thiếu thì gọi `codegraph_explore` (projectPath = repo đã checkout). **Nếu chỉ review qua diff `gh` (chưa checkout)** → graph không phủ, dùng grep/Read như thường.

### Angle A — Quét từng dòng diff
Đọc từng hunk. Với mỗi hunk, lấy **body function chứa nó** — nếu PR đã checkout, ưu tiên `codegraph_context`/`codegraph_explore` (đúng symbol, không nạp cả file); chưa checkout thì đọc từ diff/Read. Hỏi: input/state/timing nào làm dòng này sai? Tìm: điều kiện ngược, off-by-one, null/undefined deref, thiếu `await`, falsy-zero, copy-paste sai biến, error bị nuốt trong catch.

### Angle B — Kiểm tra behavior bị xóa
Với mỗi dòng bị DELETE hoặc thay thế, xác định invariant nó bảo vệ. Tìm xem code mới có thiết lập lại invariant đó không. Nếu không → candidate: guard bị bỏ, error path bị drop, validation bị thu hẹp.

### Angle C — Kiểm tra callers/callees
Với mỗi function bị thay đổi, lấy callers: PR đã checkout → dùng **blast-radius CodeGraph** (`codegraph_explore`, bắt cả dynamic-dispatch grep sót + cờ `⚠️ no covering test`); chưa checkout → Grep sau khi checkout PR về local (Bước 0). Kiểm tra change có phá vỡ call site không: precondition mới, return shape thay đổi, exception mới, thứ tự dependencies. Caller không có test phủ → nâng mức nghi ngờ.

### Angle D — Dọn dẹp & hiệu quả
- **Trùng lặp**: code mới re-implement thứ đã có trong codebase
- **Phức tạp thừa**: state dư, copy-paste, nesting sâu, dead code
- **Lãng phí**: I/O lặp, computation dư, blocking ở hot path

### Angle E — Tuân thủ chuẩn project (BẮT GẮT — không du di)

Đây là angle mà `code-review` bỏ sót. Soi TỪNG dòng THÊM VÀO (`+`) trong diff, mọi vi phạm dưới đây là một finding riêng (mặc định 🟡, comment rác dày đặc hoặc phá clean-arch → 🔴):

> Nguồn chân lý: [docs/development-guide-api.md §10](../../../docs/development-guide-api.md) + ADR 0006 + `apps/api/modules/README.md`. Danh sách dưới là bản rút gọn high-signal; nếu nghi ngờ, mở §10 để đối chiếu.

**Comment rác (áp dụng cả `apps/api` `.py` LẪN FE `apps/oms`·`apps/web`·`packages/@bbf/ui` `.ts/.tsx`):**
- Comment **restate WHAT** code làm ("tăng biến đếm", "lấy user từ db", `# tạo batch` ngay trên `create_batch()`) → xóa. Chỉ giữ comment giải thích **WHY** (ràng buộc/quyết định/cạm bẫy non-obvious).
- Mọi **story-ref code** trong thân hàm, docstring, HOẶC message của error: `AC1`, `edge #6`, `AD-7`, `R3`, `Gap #`, `case N`, `Story`, `Epic`, prefix kiểu `18-11:` → finding. Ngoại lệ DUY NHẤT: ≤1 con trỏ kiến trúc trong file docstring (vd `see ADR 0006`).
- **Dead code, code comment-out, `TODO` rải rác** → finding.
- **Docstring thừa** (mô tả lại điều tên hàm/biến đã nói rõ) → finding. Docstring chỉ giữ khi tên chưa đủ rõ, 1–2 dòng, tiếng Việt.
- `__init__.py` có re-export thừa (không phải public API thật) → finding.
- Ví dụ nghiệp vụ (domain) rò vào component dùng chung `@bbf/ui` → finding.

**Clean-arch (ADR 0006):**
- `domain/` hoặc `application/` import `asyncpg`/`fastapi` → 🔴. SQL chỉ được nằm trong `infrastructure/`.
- Bất kỳ import nào từ legacy `routers/`·`services/` vào một module (kể cả symbol `_private`) → 🔴.
- **`SELECT`/ghi DB thẳng ở use-case hoặc interface** (không qua repository), hoặc dùng `v_*` view trong module → 🔴.
- Repo có hàm **business-named** (`mark_completed`, `ensure_*`, `lot_counts_by_po`) thay vì CRUD thuần đặt theo operation/column (`get/list/filter_*/count_by_*/create/bulk_create/delete_by_*/set_status`) → finding. Mọi quyết định nghiệp vụ (idempotency, cảnh báo ghi đè, thứ tự gọi) sống ở use-case, không ở repo.
- **Derivation (parse/tách/tính) nhét trong SQL của repo** thay vì ở `domain/` → finding. Repo nhận entity đã đủ cột rồi insert.
- **use-case trả `dict` trần** thay vì DTO Pydantic có kiểu, hoặc truyền `dict` trần giữa các layer cho dữ liệu đã định hình → finding. (`dict` chỉ chấp nhận cho input CHƯA validate, vd dòng thô từ parser.)
- Infra class (kể cả read-only) thiếu Port (Protocol) tương ứng ở `domain/` → finding.
- Interface layer tự build entity/validate/business thay vì chỉ adapt I/O → gọi use-case → finding.

**Interface I/O + response (endpoint mới):**
- Thiếu `response_model=` rõ ràng, hoặc trả `dict[str, Any]` trần → finding.
- Không dùng envelope chuẩn `ApiResponse{data, error, meta}` (`ApiResponse.ok`/`ApiResponse.fail`), hoặc trả `{detail}` trần của FastAPI → finding.

**Magic number / magic string:**
- Số/chuỗi "thần thánh" hardcode ở logic (ngưỡng, status literal, mã sàn, timeout, limit) thay vì hằng số/enum đặt tên → finding. Đặc biệt gắt với **status/mã sàn hardcode** (`if status == "delivered"`, `platform == "shopee"`) — phải qua map/enum ở `domain/`, không so chuỗi rải rác.
- Lặp cùng một literal ≥2 nơi → tách hằng số.

**Quy ước khác:** nested ternary ≥2 tầng (TS/JSX) → tách if/else; lộ secret/giá trị `.env` trong diff → 🔴.

## Bước 1.5 — Lint tự động (CHẠY THẬT, không đoán)

**Cần checkout PR về local trước** (`gh pr checkout <PR>` ở Bước 0). Nếu không checkout được → bỏ bước này, ghi "⚠️ chưa chạy lint (không checkout được PR)".

Chạy linter chuẩn của repo trên **các file đã đổi trong PR** (lấy từ trường `files`), rồi CHỈ giữ vi phạm nằm trên dòng `+` — bỏ lỗi có sẵn. Mỗi vi phạm còn lại là 1 finding 🟡 (lint rule → luôn hợp lệ, không cần verify ở Bước 2).

- **API (`projects/bbf/apps/api`, file `.py`):**
  ```
  cd projects/bbf/apps/api && uv run ruff check <file-đổi> && uv run ruff format --check <file-đổi>
  ```
  Cả `ruff check` LẪN `ruff format --check` (format-check hay bị quên → CI đỏ).
- **FE (`projects/bbf/apps/oms`·`apps/web`, file `.ts/.tsx`):**
  ```
  cd projects/bbf/apps/<app> && pnpm lint
  ```
  Nếu có script typecheck/`tsc --noEmit` thì chạy luôn.

Nhớ checkout về branch cũ sau khi xong. Nếu linter không chạy được → ghi lý do, KHÔNG bịa kết quả.

## Bước 2 — Verify (1 vote per candidate)

Dedup candidates trùng nhau. Với mỗi candidate còn lại, chạy 1 verifier agent — trả về **ĐÃ XÁC NHẬN / CÓ THỂ XẢY RA / KHÔNG CÓ**.

- **CÓ THỂ XẢY RA** với: race condition, nil trên error path hiếm, falsy-zero, off-by-one ở boundary
- **KHÔNG CÓ** chỉ khi: factually sai (dẫn dòng code), impossible về mặt type/constant, đã được handle trong diff này

Giữ lại **ĐÃ XÁC NHẬN** và **CÓ THỂ XẢY RA**. Loại **KHÔNG CÓ**.

**Ngoại lệ — Angle E (comment rác/clean-arch/quy ước):** không verify theo "có gây lỗi runtime không" (chúng không crash nhưng vẫn là vi phạm chuẩn). Chỉ cần verifier xác nhận **trích dẫn đúng dòng** (comment/import/tên hàm đó thật sự có trong diff) → giữ lại. Loại chỉ khi dẫn sai dòng hoặc thực chất là comment WHY hợp lệ / CRUD hợp lệ.

## Bước 3 — Trình bày kết quả bằng tiếng Việt

Sau khi có danh sách findings (tối đa 10, xếp theo mức nghiêm trọng), mở đầu bằng 1 dòng context PR rồi trình bày:

---

## Kết quả Review PR #<số> — <title>
*Tác giả: <author> · <additions>+ / <deletions>- · base: <baseRefName>*

---

### 🔴 Nghiêm trọng
*(Bug có thể crash, data corruption, security issue — cần sửa trước khi merge)*

Với mỗi finding nghiêm trọng:
**N. [Tên vấn đề ngắn gọn]**
[file:line](file#Lline)
Mô tả vấn đề bằng tiếng Việt, súc tích 1-2 câu.
> **Sửa:** gợi ý cụ thể

---

### 🟡 Cần cải thiện
*(Logic sai nhỏ, code dễ gây bug sau, performance issue)*

Tương tự format trên.

---

### 🟢 Gợi ý nhỏ
*(Trùng lặp, simplification, conventions — không bắt buộc)*

Tương tự format trên.

---

**Tổng kết:** X lỗi nghiêm trọng, Y cần cải thiện, Z gợi ý nhỏ.
**Đề xuất:** [Approve / Request changes / Comment] — 1 câu lý do.

---

## Bước 4 — Đăng lên PR

**Đăng khi:** argument có cờ `--post`, HOẶC user yêu cầu rõ ràng sau khi xem kết quả ("post lên PR", "request changes đi"). Nếu không có `--post` và user chưa yêu cầu → KHÔNG đăng, chỉ hiển thị kết quả.

Chọn hình thức theo dòng "Đề xuất" ở Bước 3:
- Approve → `gh pr review <PR> --approve --body-file <file>`
- Request changes → `gh pr review <PR> --request-changes --body-file <file>`
- Comment (trung tính) → `gh pr review <PR> --comment --body-file <file>`

Nội dung body chính là kết quả review tiếng Việt ở Bước 3 (ghi ra file tạm trong scratchpad rồi `--body-file`).

- Với `--post`: đăng luôn, không hỏi lại; sau khi đăng in ra URL PR để xác nhận.
- Không có `--post` (user yêu cầu miệng): hiển thị nội dung sắp đăng + hình thức (approve/request-changes/comment) để user confirm rồi mới chạy.

Lưu ý: comment/review sẽ hiện dưới tên account `gh` đang đăng nhập.

### Quy tắc trình bày BẮT BUỘC:
- **Toàn bộ output phải bằng tiếng Việt** — không trộn tiếng Anh vào mô tả
- Thuật ngữ kỹ thuật (null, await, race condition) được giữ nguyên nhưng phải có giải thích
- File path và line number dùng markdown link clickable: `[file.ts:42](file.ts#L42)`
- Nếu không có finding nào → viết: "Không phát hiện vấn đề nào trong PR này." và đề xuất Approve
- Không in JSON thô ra cho user
- KHÔNG tự đăng comment/approve lên GitHub khi user chưa yêu cầu
