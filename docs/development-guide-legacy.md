# Development Guide — Legacy App (web-en)

**App:** `projects/web-en/` — Vanilla JS + Node.js static server

**Phạm vi:** Legacy app là nguồn sự thật cho giao diện và business logic. Chỉ sửa theo AD-15.

---

## AD-15: Allowed Change Groups

### (a) Fix static handler
`services/index.js`

- Block path traversal: `path.resolve(filePath).startsWith(path.resolve(ROOT))`
- Block dotfiles: reject paths containing `/.` or starting with `.`
- Allowlist extensions: `.html`, `.css`, `.js`, `.md`, `.woff2`
- Unknown extension → 404 (not `application/octet-stream` fallback)

### (b) Fix endpoint key names + load CSS
`js/agents/bmad-chat.js` + `pages/bmad-agents.html`

- Fix endpoint key: use `API_PATHS.BMAD_CHAT` (not hardcoded string)
- Add `<link rel="stylesheet" href="/css/agents/bmad-chat.css">` to `<head>`
- `server/config.js:AGENTS` is source of truth — never touch

### (c) Fix function signatures for AD-5
When Vue needs to call logic reading `window.*`

- Function must accept data via **parameter**, with **default** preserving old path
- `grep -rn "window\." projects/web-app/src` must show **0 new assignments**

### (d) Add export to data files for AD-16
When Vue needs to import data via `@legacy/data/…`

- Add one `export` line next to existing `window.*` assignment
- **Do not remove** the `window.*` assignment
- If data is generated: fix build script too, so `export` survives regeneration

---

## Features Structure

```
js/features/
  <name>/
    <name>-logic.js     ← Pure functions, no DOM
    <name>-ui.js        ← DOM manipulation
```

- `*-logic.js` files are **framework-free** — no Vue imports allowed
- Vue app calls these via `@legacy/features/…`

---

## Storage Keys (AD-6)

| Key | Owner | Notes |
|-----|-------|-------|
| `interviewChecklist` | interview-logic.js | Array |
| `skillforge_timer_history` | timer.js | Array |
| `quizHistory` | quiz-logic.js | See overlap note |
| `skillforge_exam_history` | skill-logic.js | See overlap note |
| `sessions` | SkillForgeProgress (IndexedDB) | See overlap note |

**Overlap (do not resolve):**
- quiz → `quizHistory`
- exam → `skillforge_exam_history`
- session → store `sessions` of `SkillForgeProgress`

These overlaps are intentional — keep as-is.

---

## Server Routes

```
GET  /                       → static (index.html)
GET  /pages/*.html           → static
GET  /css/*.css              → static
GET  /js/*.js               → static
GET  /api/bmad/chat         → POST AI chat
GET  /api/bmad/agents       → GET agent list
GET  /api/bmad/mode         → GET supported modes
GET  /api/health             → health check
```

Use `API_PATHS` constants from `js/agents/bmad-chat.js`, not hardcoded strings.

---

## Style Guidelines

- CSS in `css/` is **per-page** (e.g., `ai.css`, `exam.css`)
- Global tokens in `css/variables.css` — **import only**, do not copy
- No CSS import in `pages/*.html` from `css/` unless that page is the target

---

## No Dependency Addition (NFR3)

`projects/web-en/` must remain **zero-dependency**. Do not `npm install` anything in this directory.

---

## File Naming

- JavaScript: `kebab-case.js`
- Data files: `<feature>-data.js`
- HTML pages: `kebab-case.html`

---

## Error Handling

- Server: use `console.error` + return JSON `{ error: "message" }`
- Client: show user-visible error, never silently fail
- Network errors: `.catch()` on all `fetch()` calls
