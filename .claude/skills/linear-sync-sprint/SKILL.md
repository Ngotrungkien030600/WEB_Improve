---
name: linear-sync-sprint
description: Đồng bộ 1 chiều từ BMAD sprint-status.yaml sang Linear (tạo/cập nhật issue theo story, map trạng thái sang cột Kanban). Idempotent theo story-id. Dùng khi user nói "sync sprint lên linear", "đồng bộ tiến độ linear", "cập nhật linear từ sprint".
---

# Sync Sprint → Linear (1 chiều)

Skill này đọc `_bmad-output/implementation-artifacts/sprint-status.yaml` (nguồn sự thật) và phản chiếu lên Linear để nhìn trực quan + kéo thả Kanban.

## Nguyên tắc xương sống (KHÔNG vi phạm)

- **Một chiều: YAML → Linear.** `sprint-status.yaml` là gốc. KHÔNG bao giờ đọc trạng thái từ Linear ghi ngược lại YAML.
- **Idempotent.** Chạy lại nhiều lần không tạo issue trùng. Khoá định danh = story-id (VD `12-10`) nằm trong tiêu đề issue dạng `[12-10] ...`.
- **Dry-run mặc định.** Không có cờ `--apply` → CHỈ in bảng dự kiến (sẽ tạo gì / cập nhật gì), KHÔNG ghi lên Linear. Có `--apply` mới thực sự ghi.
- **Không đụng issue người khác tạo tay** (issue không có marker `[<story-id>]` ở đầu title) → bỏ qua, không sửa.

## Điều kiện tiên quyết

1. Session phải có tool Linear (`mcp__*_Linear__*`). Nếu ToolSearch không thấy tool linear → báo user: MCP Linear chưa nạp, cần mở **chat mới** (config `.mcp.json` chỉ load lúc session bắt đầu). Dừng.
2. `sprint-status.yaml` tồn tại ở `_bmad-output/implementation-artifacts/`.

## Bước 0 — Nạp tool Linear + xác định team

1. Chạy ToolSearch query `select:Linear` (hoặc `linear list teams,linear create issue,linear update issue,linear list issues`) để nạp schema tool.
2. Gọi tool list-teams của Linear. Nếu >1 team:
   - Nếu argument có `--team <tên>` → dùng team đó.
   - Nếu chưa có → HỎI user chọn team (đừng đoán). Nhớ team-id đã chọn.
3. Lấy danh sách **workflow states** (cột) của team để map trạng thái ở Bước 2.
4. Đọc `linear-refs.md` (cạnh skill) — nguồn ID deterministic: team, project theo epic, label độ-khó/thời-gian, workflow states, assignee mặc định. Nếu team KHÁC "Bbf" hoặc ID không khớp (Linear đã tạo lại) → refresh bằng `list_projects`/`list_issue_labels` và cập nhật `linear-refs.md`.

## Bước 1 — Parse sprint-status.yaml

Đọc block `development_status:`. Với mỗi dòng dạng `  <story-id>: <status>` (VD `12-10-expected-return-events: ready-for-dev`):
- **story-id ngắn** = phần số đầu, VD `12-10` (để làm marker `[12-10]`).
- **tên đầy đủ** = phần slug còn lại, VD `expected-return-events`.
- **status BMAD** = giá trị sau dấu `:` (bỏ comment sau `#`).
- **epic** = số epic đầu story-id (VD `12`).

Bỏ qua các dòng `epic-N:` (trạng thái epic tổng, không phải story) — nhưng dùng để gắn context.

Ưu tiên sync story **chưa done** trước (backlog / ready-for-dev / in-progress / review / blocked). Cho phép cờ `--all` để sync cả done (đóng issue tương ứng).

**Phạm vi (mặc định = toàn bộ):**
- `$ARGUMENTS` có **story-id** (VD `/linear-sync-sprint 12-11 --apply`) → **CHỈ sync đúng story đó** (1 CREATE/UPDATE/SKIP). Dùng sau `/story-ready` hoặc `/dev-story` — đổi 1 story thì sync 1, khỏi quét cả bảng. `list_issues` filter theo query `[<story-id>]` cho nhẹ.
- Không có story-id → sync toàn bộ (reconcile đầy đủ, idempotent nên chỉ ghi cái lệch). Chạy định kỳ hoặc lần đầu.

## Bước 2 — Map trạng thái BMAD → cột Linear

| BMAD status      | Cột Linear (workflow state) |
|------------------|-----------------------------|
| `backlog`        | Backlog                     |
| `ready-for-dev`  | Todo                        |
| `in-progress`    | In Progress                 |
| `review`         | In Review (fallback: In Progress) |
| `done`           | Done                        |
| `blocked`        | Todo + label `blocked`      |

Nếu team không có state khớp tên → chọn state cùng `type` gần nhất (`unstarted`/`started`/`completed`) và ghi log cảnh báo.

## Bước 2b — Enrich metadata cho story CREATE mới

Chỉ áp cho story **chưa có issue** (nhóm CREATE). Story đã có issue (UPDATE/SKIP) KHÔNG đụng — enrich đã set 1 lần, giữ nguyên.

- **Tên tiếng Việt**: đặt tên mô tả ngắn tiếng Việt từ ngữ cảnh YAML (slug + comment `#` của story). VD `12-11-expected-inbound-screen` → `Màn "Chờ về kho"`. Không chắc nghĩa → để slug English, không bịa.
- **Estimate (độ khó, Fibonacci)** — ước lượng từ tín hiệu scope trong comment YAML (số file, có migration, số vòng review, "module 4-layer" = nặng): `1` rất dễ (~0.5d) · `2` dễ (~1d) · `3` vừa (~1.5d) · `5` khó (~2.5d) · `8` rất khó (~4d) · `13` cực khó (~6d). Quy đổi thời gian cho cặp **1 dev + 1 Claude**. Chưa đủ tín hiệu → mặc định `3` (vừa).
- **Project**: map `epic` → projectId theo `linear-refs.md`. Epic chưa có project → tạo project mới `Epic N — <tên tiếng Việt epic>` (addTeams Bbf) rồi ghi id vào `linear-refs.md`.
- **Label**: `độ khó` + `thời gian` tương ứng estimate (map ở `linear-refs.md`) + (nếu blocked) `blocked`. **KHÔNG** gắn `epic-N` (Project đã thay vai).

## Bước 3 — Đối chiếu & lên kế hoạch (idempotent)

1. Lấy toàn bộ issue của team (list issues, kèm title + state + id).
2. Với mỗi story:
   - Tìm issue có title bắt đầu bằng `[<story-id>]`.
   - **Có** → so state hiện tại vs state đích. Khác → xếp vào nhóm **UPDATE**. Giống → **SKIP**.
   - **Chưa có** → xếp vào nhóm **CREATE**.
3. In **bảng tóm tắt** cho user duyệt (CREATE kèm metadata enrich từ Bước 2b):
   ```
   CREATE (n):  [12-11] Màn "Chờ về kho"      → Todo · Epic 12 · vừa/~1.5d (3pts)
   UPDATE (n):  [12-9]  ...                    In Progress → In Review
   SKIP   (n):  ...
   ```

## Bước 4 — Ghi lên Linear (chỉ khi có `--apply`)

- **CREATE**: tạo issue (kèm enrich Bước 2b)
  - title: `[<story-id>] <tên tiếng Việt>` (giữ marker `[id]` đầu title — khoá idempotent)
  - team: Bbf · **assignee**: mặc định (`linear-refs.md`)
  - state: theo map Bước 2
  - **estimate**: điểm Fibonacci (độ khó) từ Bước 2b
  - **project**: epic → projectId (`linear-refs.md`)
  - **label**: `độ khó` + `thời gian` (theo estimate) + (nếu blocked) `blocked`. KHÔNG gắn `epic-N`.
  - description: `⏱ Ước tính: ~Xd (1 dev + 1 Claude)` + `🔧 Độ khó: <mức> (<pts> pts) — <lý do ngắn>` + `Trạng thái BMAD: <status>` + link `sprint-status.yaml`
- **UPDATE**: chỉ đổi `stateId` (và label `blocked` nếu cần). **KHÔNG ghi đè** title/description/estimate/project/label độ-khó user đã enrich — chúng sống sót qua mọi lần sync.
- **SKIP**: không làm gì.

Sau khi ghi: in lại bảng kết quả thực tế (X created, Y updated, Z skipped) kèm link issue Linear.

## Ghi chú

- KHÔNG xoá issue. Story biến mất khỏi YAML → để user tự xử lý trên Linear (tránh mất dữ liệu ngoài ý muốn).
- Toàn bộ output tiếng Việt, gọn.
- Không đưa secret/token vào description hay log.
- **Gom epic = Project, KHÔNG dùng label `epic-N`** (đã gỡ khỏi toàn bộ issue 2026-07-07 vì trùng chip Project). Label cũ `epic-1..18` để trống — đừng gắn lại.
- **Enrich (tên Việt/estimate/độ khó/thời gian) là ước lượng thô** do skill sinh — user chỉnh tay tùy ý, sync sau KHÔNG đè. KHÔNG backfill các giá trị này ngược vào `sprint-status.yaml` (file đó chỉ giữ status).
