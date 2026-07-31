---
name: story-ready
description: Harden a BMAD story BEFORE dev. Two modes — light (advanced-elicitation → checkpoint) for normal stories, hard (+ case enumeration → guard script → edge-case hunt) auto-triggered when the story touches a repo invariant. STOPS before implementation, stamps a Hardened marker. Use when the user says "/story-ready <story-id>", "make this story dev-ready", "harden story <id>".
argument-hint: <story id> [--light | --hard]
---

# story-ready — harden a story before dev

Đưa story tới mức dev-ready **trước khi viết code**, bằng cách điều phối các skill BMAD. Giao tiếp + viết artifact bằng **tiếng Việt**.

**Hard rule: skill này STOP trước dev.** KHÔNG gọi `bmad-dev-story`/`bmad-quick-dev` ở đây. Output = story dev-ready + case list đã duyệt + (mode hard) guard script + marker **`**Hardened:**`**. Dev chạy sau bằng `/dev-story <story>`.

**Reference:**
- **`docs/repo-risks.md`** — invariant surfaces (R1-R8) + AC quality rules + known bugs
- **`docs/development-guide-legacy.md`** — Legacy app (web-en) conventions
- **`docs/development-guide-vue.md`** — Vue app (web-app) conventions
- `sprint-status.md` (cạnh skill) — rule auto-maintain sprint-status

**Input:** story-id trong `$ARGUMENTS` (rỗng → hỏi user). Flag `--light`/`--hard` ép mode.

---

## Step 0 — Orchestrate

**`story-ready` là lệnh DUY NHẤT cần gọi trước `dev-story`.**

### 0.1 — Kiểm tra epic + story

- Đọc `_bmad-output/planning-artifacts/epics.md` để map story-id → epic.
- Kiểm tra `_bmad-output/implementation-artifacts/<story-id>.md` đã tồn tại chưa.
- **Chưa có → hỏi user** tạo trước hay chạy `bmad-create-story`.

### 0.2 — Chọn mode (Light vs Hard)

1. Đọc `docs/repo-risks.md`. Xác định story có chạm surface **R1–R8** không.
2. Chạm bất kỳ R1-R8 → đề xuất **Hard**; không chạm → **Light**.
3. Hỏi xác nhận (1 lần):
   `Mode đề xuất: HARD (story chạm R2 single-origin). Đồng ý? [hard / light]`
   Flag `--light`/`--hard` → bỏ qua hỏi.

- **Light** = story thường: elicit 1 vòng → checkpoint → STOP.
- **Hard** = chạm invariant: thêm case enumeration + guard + edge-case hunt.

---

## Step 1 — Enrich story (cả 2 mode)

1. Xác định app bị đụng:
   - `projects/web-en/` → đọc `docs/development-guide-legacy.md`
   - `projects/web-app/` → đọc `docs/development-guide-vue.md`
2. Fold convention/pattern vào AC.
3. Áp **AC quality rules** từ `docs/repo-risks.md`: mỗi AC `input → output`, có case lỗi, nhắc invariant nếu chạm R1-R8.

### Step 1a — Sprint-status (auto)

Upsert `development_status[<key>] = ready-for-dev`, bump `last_updated`. Tự động.

---

## Step 2 — Harden

### 2-LIGHT

1. Gọi `bmad-advanced-elicitation` 1 vòng trên story.
2. Fold kết quả vào story.
→ sang Step 3.

### 2-HARD

1. **Enumerate cases** từ story + cross-check `docs/repo-risks.md`:
   - Happy path
   - Edge cases (boundary, empty, missing)
   - Error paths (network, auth, invalid data)
   - Invariant violations (R1-R8)
2. Với mỗi surface R1-R8 story touches, thêm case bắt buộc.
→ sang Step 3.

---

## Step 3 — CHECKPOINT (cả 2 mode, KHÔNG skip)

Trình bày case list dạng checklist, nhóm: **happy / biên / lỗi / invariant**.

Hỏi: **"Danh sách case này đủ chưa? Thêm/sửa/bớt gì không? (duyệt = 'ok')"**

WAIT user. Fold chỉnh sửa. KHÔNG đi tiếp tới khi user duyệt.

**Light dừng ở đây** → sang Step 5.

---

## Step 4 — Guard script (CHỈ mode Hard)

Dự án chưa có test framework. Dùng **guard script** để verify.

Sinh `scripts/<story-slug>-guards.mjs` với assertions cho:
- DOM marker / class presence
- Invariant checks (R1-R8)
- Behavior assertions

```javascript
// Example guard script structure
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Case 1: Happy path
  await page.goto(`${BASE}/`);
  // assert...
  
  // Case 2: Edge case
  // ...
  
  await browser.close();
}

run().catch(console.error);
```

---

## Step 5 — Đóng marker + handoff

1. **Đóng marker** vào story file:
   `**Hardened:** light|hard (YYYY-MM-DD) — N AC, N cases (happy/biên/lỗi/invariant), guard=<n assertions hoặc n/a>`

2. Handoff:
   ```
   Story dev-ready (mode={light|hard}).
   - Story: _bmad-output/implementation-artifacts/<story-id>.md
   - Sprint: _bmad-output/implementation-artifacts/sprint-status.yaml
   - AC: N   Cases: N   Guard assertions: <n hoặc n/a>
   - Next: /dev-story <story-id>
   ```

3. KHÔNG implement gì.

---

## Notes

- Human checkpoint (Step 3) là gate chất lượng thật.
- WEB_Improve chưa có test framework — dùng guard script cho mode Hard.
- NFR5: FR-6 acceptance là **kiểm thủ công** theo 5 mục (bố cục, màu, khoảng cách, cỡ chữ, hover). Không viết automated test cho UI comparison.
