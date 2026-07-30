# Phân tích cây nguồn

## Cấu trúc thư mục có chú giải

```
WEB_Improve/
├── start.bat                    # Điểm khởi chạy Windows: Ollama → browser → node server
├── _bmad/                       # BMAD engine (installer sinh ra, KHÔNG sửa tay)
├── _bmad-output/                # Artifact planning + implementation của BMAD
├── docs/                        # ← tài liệu này (project_knowledge)
├── .claude/skills/              # 46 skill BMAD cho claude-code
│
└── projects/web-en/            # ★ TOÀN BỘ SẢN PHẨM nằm trong đây
    ├── .env                     # Khoá AI (đã untrack; secret vẫn còn trong git history)
    ├── index.html               # Trang chủ (Part: client — entry point)
    ├── bmad-cli.js              # CLI chat độc lập, gọi localhost:8080/api/bmad/chat
    ├── build-interview-data.js  # Script sinh js/data/interview-data.js từ interview_java/*.md
    │
    ├── server/                  # ★ Part: server — Node built-in, zero dependency
    │   ├── index.js             # Entry point: 4 route POST + static file server
    │   ├── config.js            # Hằng số: PORT, MIME, AI_CONFIG, 6 system prompt agent
    │   └── ai-service.js        # Tầng gọi AI: Gemini | OpenAI | Ollama + build prompt bundle
    │
    ├── js/                      # ★ Part: client
    │   ├── app.js               # Entry: trang english.html (tab vocab/tense/story/game)
    │   ├── ai-app.js            # Entry: trang ai.html (405 dòng, KHÔNG module)
    │   ├── exam-app.js          # Entry: trang exam.html
    │   ├── interview-app.js     # Entry: trang interview.html
    │   ├── learn-app.js         # Entry: trang code-learn.html
    │   ├── skill-app.js         # Entry: trang skill-tracker.html
    │   ├── home-ai.js           # ⚠ Bị bmad-chat.js thay thế — nghi chết, không trang nào load
    │   │
    │   ├── features/            # ✓ VÙNG ĐÃ CHUẨN — khuôn mẫu để nhân rộng
    │   │   ├── vocabulary/      #   *-logic.js (thuần hàm) + *-ui.js (chỉ DOM)
    │   │   ├── tenses/          #   cùng khuôn
    │   │   ├── practice/        #   cùng khuôn
    │   │   ├── stories/         #   cùng khuôn
    │   │   ├── quiz/            #   quiz-logic.js export 26 hàm — file logic lớn nhất
    │   │   ├── game/            #   3 game: logic + scramble + speedquiz, mỗi cái có *-ui
    │   │   ├── interview/       #   cùng khuôn
    │   │   ├── learn/           #   chỉ có learn-ui.js (thiếu tầng logic)
    │   │   └── skill-tracker/   #   cùng khuôn
    │   │
    │   ├── data/                # ⚠ VÙNG LAI — 6 file ESM export, 10 file window.*
    │   │   ├── progress-db.js   #   IndexedDB 'skillforge' 5 store — window.progressDB
    │   │   ├── spaced-repetition.js #  IndexedDB riêng, thuật toán SRS
    │   │   ├── vocabulary.js    #   ESM export
    │   │   ├── tenses.js        #   ESM export
    │   │   ├── stories.js       #   ESM export
    │   │   ├── practice.js      #   ESM export
    │   │   ├── interview-data.js#   window.* (sinh tự động từ build-interview-data.js)
    │   │   └── …                #   ai-data, learn-data, search-index, salary-interview-data…
    │   │
    │   ├── agents/              # ⚠ Chat 6 persona — HỎNG (xem architecture-client.md)
    │   │   ├── agent-constants.js  # window.BMAD_CONSTANTS
    │   │   ├── agents-config.js    # window.BMAD_AGENTS — 6 persona + systemPrompt
    │   │   └── bmad-chat.js        # 384 dòng, không module, fetch endpoint undefined
    │   │
    │   └── utils/
    │       ├── helpers.js       # ✓ shuffle, speakText, escapeHtml, getLevelText (ESM)
    │       ├── markdown.js      # ✓ markdownToHTML (ESM) — parser regex tự viết
    │       └── timer.js         # ⚠ 259 dòng, KHÔNG module, mọi trang đều load
    │
    ├── css/                     # 12 file, 285 class selector, KHÔNG tầng component
    │   ├── variables.css        # ✓ 58 custom property — nền design token duy nhất
    │   ├── base.css             # reset + typography
    │   ├── components.css       # ⚠ tên hứa nhiều hơn nội dung (chỉ 3 trang game dùng)
    │   ├── home.css hub.css     # theo trang
    │   ├── ai.css learn.css exam.css interview.css  # theo trang, prefix riêng
    │   ├── features/skill-tracker.css
    │   └── agents/bmad-chat.css # ⚠ 342 dòng MỒ CÔI — không trang nào link
    │
    ├── pages/                   # 27 trang HTML
    │   ├── english.html ai.html exam.html interview.html code-learn.html
    │   ├── skill-tracker.html learning-paths.html salary-interview.html
    │   ├── sentence-practice.html dashboard.html cloud.html bmad-agents.html
    │   ├── game-memory.html game-scramble.html game-speedquiz.html
    │   ├── ai/hub.html english/hub.html java/hub.html cloud/hub.html frontend/hub.html
    │   ├── java/backend.html java/spring-boot.html
    │   └── frontend/{html-css,javascript,frameworks,responsive,ui-interview}.html
    │
    ├── interview_java/          # 30 file .md — 232KB nội dung cheatsheet Java
    └── data/bmad/bmad-bundles.json  # Metadata bundle cho màn chat (9KB)
```

## Điểm vào ứng dụng

| Trang | Script entry | `type="module"` |
|---|---|---|
| `index.html` | `js/utils/timer.js` | không |
| `pages/english.html` | `js/app.js` | **có** |
| `pages/code-learn.html` | `js/learn-app.js` | **có** |
| `pages/exam.html` | `js/exam-app.js` | **có** |
| `pages/game-*.html` (3 trang) | inline module | **có** |
| `pages/ai.html` | `js/ai-app.js` | không |
| `pages/interview.html` | `js/interview-app.js` | không |
| `pages/skill-tracker.html` | `js/skill-app.js` | không |
| `pages/bmad-agents.html` | `js/agents/bmad-chat.js` | không |
| 16 trang còn lại | không có JS entry | — |

Mọi trang có JS đều load trước một "prelude" 5 file cố định: `timer.js`, `data-meta.js`, `search-index.js`, `spaced-repetition.js`, `progress-db.js`. Đây là dependency ngầm qua `window.*`, không khai báo ở đâu — nếu đổi thứ tự thẻ `<script>` là vỡ.

## Thư mục then chốt cần biết khi refactor

| Đường dẫn | Vai trò | Trạng thái |
|---|---|---|
| `js/features/**` | Logic + UI theo tính năng | ✓ Chuẩn, giữ nguyên khuôn |
| `css/variables.css` | Design token | ✓ Đã có nền, cần mở rộng |
| `css/` (11 file còn lại) | Style theo trang | ✗ Silo theo prefix, cần gom |
| `pages/**` inline `<style>` | ~730 dòng CSS rải 22 trang | ✗ Nợ lớn nhất |
| `js/data/**` | Nội dung + lưu trữ | ✗ Lai ESM/global |
| `js/agents/**` | Chat persona | ✗ Hỏng, cần sửa trước khi refactor |
