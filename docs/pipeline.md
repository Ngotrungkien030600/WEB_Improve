# 🏗️ SkillForge Pipeline & Architecture

## 1. Request Flow (User → Page)

```
User Browser
    │
    ├──→ index.html (Trang chủ)
    │       │
    │       ├─── pages/java/hub.html ─── ├─── pages/java/spring-boot.html
    │       │                            ├─── pages/java/backend.html
    │       │                            ├─── pages/java/api-guide.html
    │       │                            ├─── pages/java/integration-guide.html
    │       │                            ├─── pages/interview.html
    │       │                            ├─── pages/interview-english.html
    │       │                            └─── pages/salary-interview.html
    │       │
    │       ├─── pages/english/hub.html ─── sub-pages (vocab, tenses, stories, exam, games...)
    │       ├─── pages/ai/hub.html ──── sub-pages
    │       ├─── pages/frontend/hub.html ─── sub-pages
    │       ├─── pages/cloud/hub.html
    │       ├─── pages/bmad-agents.html
    │       ├─── pages/accelerator.html
    │       ├─── pages/learning-paths.html
    │       ├─── pages/skill-tracker.html
    │       └─── pages/dashboard.html
    │
    ├──→ css/ (styles for each page)
    ├──→ js/ (logic + data)
    └──→ /api/* (AJAX calls to Node.js server)
```

**Mỗi trang hoạt động độc lập:**
1. Browser request HTML file → Node.js server đọc file từ disk → trả về
2. HTML load CSS → render layout
3. HTML load JS → JS render nội dung động
4. Nếu cần AI → JS gọi API endpoint → server xử lý → response

---

## 2. API Flow

```
Browser JS                        Node.js Server
    │                                    │
    │  POST /api/bmad/chat               │
    │─────────────────────────────────►   │
    │  { agentIds, messages }             │
    │                                    │
    │                           ┌─────────┴──────────┐
    │                           │  ai-service.js     │
    │                           │  ├── Ollama (local) │
    │                           │  ├── OpenAI         │
    │                           │  └── Gemini         │
    │                           └─────────┬──────────┘
    │                                    │
    │  { replies: [{agentId, text}] }     │
    │◄──────────────────────────────────  │
    │                                    │
    │  render UI (chat bubbles)           │
```

**AI Service chọn model:**
```
ai-service.js
    │
    ├── GEMINI_API_KEY exists? ──► Google Gemini
    ├── OPENAI_API_KEY exists? ──► OpenAI
    └── else ──────────────────► Ollama (local, qwen2.5:1.5b)
```

**API Endpoints:**
| Method | Path | Input | Output | Dùng bởi |
|--------|------|-------|--------|----------|
| POST | `/api/ai-feedback` | question, answer, level | score, feedback, tips | interview.html |
| POST | `/api/ai-chat` | messages | reply text | AI chat |
| POST | `/api/bmad/chat` | agentIds, messages | multi-agent replies | bmad-agents.html |
| POST | `/api/salary-interview` | salary, request | interview questions | salary-interview.html |

---

## 3. Component Architecture (JS Module)

```
interview-app.js
    │
    ├── import { initInterviewUI } from './features/interview/interview-ui.js'
    │       │
    │       ├── import { getTopics, ... } from './features/interview/interview-logic.js'
    │       │       └── window.interviewTopics (data from interview-data.js)
    │       │
    │       └── import { markdownToHTML } from './utils/markdown.js'
    │
    └── initInterviewUI()
            │
            ├── renderSidebar() ──── GROUPS (7 nhóm, 39 topics)
            ├── selectTopic(index) ──► renderBody(topic)
            └── renderProgress() ─── calc từ checklist
```

**Pattern chung cho tất cả feature:**
```
<feature>-app.js → import <feature>-ui.js → import <feature>-logic.js
                    (DOM render)         (state + data + business logic)
```

---

## 4. Data Layer

```
js/data/
├── interview-data.js         # 39 cheat sheet topics (đọc trực tiếp từ array)
├── salary-interview-data.js  # Câu hỏi phỏng vấn theo mức lương
├── vocabulary.js             # 220+ từ vựng tiếng Anh
├── idioms.js                 # 70+ idioms
├── tenses.js                 # 12 thì tiếng Anh
├── stories.js                # Truyện song ngữ
├── practice.js               # Bài tập thực hành
├── ai-data.js                # AI/ML concepts, quiz, interview
├── learn-data.js             # Bài học code
├── learning-path-data.js     # Lộ trình học
├── progress-db.js            # IndexedDB wrapper (lưu tiến độ)
├── spaced-repetition.js      # Thuật toán spaced repetition
└── search-index.js           # Index tìm kiếm toàn bộ nội dung
```

**Lưu trữ persistent:**
- **localStorage**: checklist phỏng vấn, settings, preferences
- **IndexedDB** (qua progress-db.js): XP, streak, lịch sử học, kết quả thi

---

## 5. Build Pipeline

```
interview_java/*.md (markdown gốc)
    │
    ├── projects/web-en/build-interview-data.js
    │       │
    │       └── parse markdown files → generate interview-data.js
    │               │
    │               └── projects/web-en/js/data/interview-data.js
    │
    └── Đọc trực tiếp bởi JS runtime (không cần build step cho dev)
```

**Hiện tại:** `interview-data.js` được generate từ markdown files bằng `build-interview-data.js`, nhưng cũng có thể edit thủ công.

---

## 6. Sơ đồ kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────┐
│                     Browser                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ index.html│  │interview │  │    bmad-agents.html   │  │
│  │ (home)    │  │ .html    │  │    (7 AI agents)      │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
│       │              │                   │              │
│  ┌────┴─────┐  ┌────┴─────┐  ┌──────────┴───────────┐  │
│  │ CSS      │  │ JS       │  │ JS modules            │  │
│  │ (themes) │  │ (logic)  │  │ (feature + data)      │  │
│  └──────────┘  └────┬─────┘  └──────────────────────┘  │
│                      │                                  │
│              ┌───────┴───────┐                          │
│              │  fetch(/api/) │                          │
│              └───────┬───────┘                          │
└──────────────────────┼──────────────────────────────────┘
                       │
                       │ HTTP
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 Node.js Server                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Static files  │  │ API Router   │  │ AI Service   │  │
│  │ (HTML/CSS/JS) │  │ (4 endpoints)│  │ (Ollama/     │  │
│  └──────────────┘  └──────┬───────┘  │  OpenAI/Gemini)│  │
│                           │           └──────────────┘  │
│                    ┌──────┴──────┐                      │
│                    │ Config / ENV │                     │
│                    └─────────────┘                      │
└─────────────────────────────────────────────────────────┘
```
