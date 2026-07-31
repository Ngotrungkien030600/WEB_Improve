---
name: dev-story
description: Implement a hardened BMAD story. Checks the Hardened marker (from /story-ready), guards against double-implementation, then runs bmad-dev-story and stamps results. Use when the user says "/dev-story <story-id>", "implement story <id>", or "dev the next story".
argument-hint: <story id or file> (empty = auto-pick next ready-for-dev)
---

# dev-story — implement a hardened story

Wrapper quanh `bmad-dev-story`. Đảm bảo story **đã harden** (`/story-ready`) và **chưa bị implement trùng** trước khi code. Giao tiếp tiếng Việt.

**Story target:** `$ARGUMENTS` (rỗng → auto-pick).

**Reference:**
- `docs/repo-risks.md` — invariant surfaces (R1-R8) + known bugs
- `docs/development-guide-legacy.md` — Legacy app conventions
- `docs/development-guide-vue.md` — Vue app conventions

---

## STEP 1 — Xác định story

```
$ARGUMENTS có → story_id = $ARGUMENTS; story_file = _bmad-output/implementation-artifacts/{story_id}*.md (fuzzy)
rỗng → đọc sprint-status.yaml, lấy entry `ready-for-dev` ĐẦU TIÊN top-down;
       hỏi user confirm "Story tiếp theo: <X>. Tiến hành?"
```

---

## STEP 2 — Hardened gate (soft-block)

Đọc story_file, tìm marker `**Hardened:** ...` trong Dev Notes.

```
CÓ marker  → "✓ Story đã harden (<mode>, <date>)." → STEP 3
KHÔNG      → ⚠ "Story chưa qua /story-ready — AC/case có thể chưa đủ.
              [S] Chạy /story-ready <story> trước (khuyến nghị)
              [Y] Dev luôn (tự chịu trách nhiệm)"
   [S] → invoke skill story-ready → HALT
   [Y] → "⚠ Bỏ qua harden gate." → STEP 3
```

---

## STEP 3 — Mutual-exclusion guard

Phát hiện "scope này đã implement chưa?":
- Story "Dev Agent Record → File List" đã liệt kê file
- Dev Notes có marker `**Implemented:** ...`
- sprint-status entry đã `in-progress`/`review`/`done`

```
CÓ dấu hiệu → ⚠ "Story <id> có vẻ ĐÃ được implement (File List/marker đã có).
                 Dev tiếp sẽ code TRÙNG / ghi đè.
                 [S] Dừng (khuyến nghị) — dùng /code-review review code đã có
                 [Y] Vẫn tiếp tục"
   [S] → STOP.   [Y] → STEP 4.
KHÔNG → STEP 4.
```

---

## STEP 4 — Implement

1. sprint-status: set `development_status[<key>] = in-progress`
2. Xác định app bị đụng:
   - `projects/web-en/` → đọc `docs/development-guide-legacy.md`
   - `projects/web-app/` → đọc `docs/development-guide-vue.md`
3. Invoke skill `bmad-dev-story`, target = story_file

**Quy chuẩn code (BẮT BUỘC):**

- **Comment chỉ giải thích TẠI SAO.** KHÔNG comment mô tả WHAT. KHÔNG rải `AC/case/invariant/R` trong code.
- **Đặt tên:**
  - Identifier: Tiếng Anh
  - UI string, message: Tiếng Việt
  - Vue component: `CPascalCase.vue` (shared), `PascalCasePage.vue` (page)
  - JS module: `kebab-case.js`

- **Legacy app (web-en):**
  - Chỉ sửa theo AD-15: (a) static handler, (b) endpoint key + CSS link, (c) function signature, (d) export line
  - Zero dependency — không npm install gì trong web-en

- **Vue app (web-app):**
  - No TypeScript
  - No external component library (Vuetify, etc.)
  - Design token: import từ `@legacy/css/variables.css`
  - API call: qua `src/api/index.js`, không `fetch` trong components/pages
  - Navigation: qua helper đọc ported-pages registry

- **Invariant surfaces (R1-R8):**
  - R1: Layer boundary — pages/ → components/ + storage/ + api/ + @legacy/
  - R2: Single origin — không hardcode host/port
  - R3: @legacy one-way — không relative import ../web-en/
  - R4: Framework-free logic — @legacy/features/** không import vue
  - R5: No window.* in Vue — accept via parameter
  - R6: Storage ownership — one writer per key
  - R7: Ported page registry — single source of truth
  - R8: Token import only — không copy, không hex trong components

---

## STEP 5 — Hoàn thành

1. Đóng marker story file:
   `**Implemented:** dev-story (YYYY-MM-DD) — <n files>`
2. sprint-status: set **`review`** (test/guard PASS) — KHÔNG `done`. `done` set ở `/code-review`.
3. Handoff:
   ```
   DEV COMPLETE — story <id>  (status → review)
   - Files: <n>
   Next: /code-review <story-id>
   ```
4. Nhắc kiểm thủ công (NFR5): FR-6 acceptance theo 5 mục:
   - Block layout
   - Color
   - Spacing
   - Font/size
   - Hover state

---

## Notes

- Gate order: **Hardened (soft) → exec-exclusion (soft) → dev**
- Bypass hoàn toàn = gọi `bmad-dev-story` trực tiếp
- WEB_Improve chưa có test framework — verify bằng kiểm thủ công + guard script (nếu có)
- NFR5: FR-6 acceptance là kiểm thủ công theo 5 mục, không có automated test
