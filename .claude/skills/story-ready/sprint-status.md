# sprint-status — rule auto-maintain

Reference cho `story-ready` (step 1a) và `dev-story`. File: `_bmad-output/implementation-artifacts/sprint-status.yaml`.

Auto-maintain — **không phải việc user phải yêu cầu**.

---

## Tạo file nếu chưa có

- Dùng template từ `bmad-sprint-planning`
- Giữ nguyên block comment STATUS DEFINITIONS
- `project` lấy từ `_bmad/bmm/config.yaml`
- `generated` + `last_updated` = ngày hôm nay

## Upsert mỗi story

- Story key = `<epic>-<num>-<slug>` (vd `1-2-man-chat-6-persona`)
- `development_status[<key>] = ready-for-dev` (story-ready) → `in-progress` → `review` → `done` (dev-story)
- Thêm `epic-<n>: in-progress` và `epic-<n>-retrospective: optional` nếu thiếu
- **Order theo dependency**: story phụ thuộc story khác phải đứng sau
- Bump `last_updated` mỗi lần đổi
- **Không duplicate key** — update tại chỗ

## Trạng thái dùng trong pipeline

```
backlog → ready-for-dev (story-ready stamp) → in-progress (dev-story start) → review → done (code-review)
```

## Epic Status

- `backlog`: Epic chưa bắt đầu
- `in-progress`: Epic đang được làm
- `done`: Mọi story trong epic đã `done`

## Known Story Dependencies

```
Epic 1:
  1.1 (done) → 1.2 (ready-for-dev)

Epic 2:
  2.1 (backlog) → 2.2 → 2.3 → 2.4

Epic 3:
  3.1 (backlog) → 3.2 → 3.3
```

## Tracker File

```
_bmad-output/implementation-artifacts/sprint-status.yaml
```
