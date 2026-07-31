# ⚒️ SkillForge — Lò rèn kỹ năng

**SkillForge** là nền tảng học tập toàn diện dành cho lập trình viên Việt Nam, tích hợp AI để hỗ trợ học tiếng Anh, lập trình Java, Frontend, AI/ML, AWS Cloud, Backend Engineering và luyện phỏng vấn — tất cả chạy local, miễn phí, không cần internet cho AI.

---

## ✨ Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 📖 **Tiếng Anh** | 220+ từ vựng, 70+ idioms, 12 thì, truyện song ngữ, thi thử, 3 games |
| ☕ **Java** | 10 bài học code + Spring Boot chuyên sâu + 39 cheat sheet phỏng vấn + 2 guide thực chiến |
| 🧠 **AI/ML** | 48 concepts flashcard, 50+ quiz, 60+ câu phỏng vấn, 8 projects thực hành |
| 🌐 **Frontend** | HTML/CSS, JavaScript, React/Vue/Angular, Responsive, phỏng vấn UI/FE |
| ⚙️ **Backend Engineering** | SQL/NoSQL, Kafka, Docker, K8s, CI/CD, System Design, Performance |
| ☁️ **AWS Cloud** | IAM, VPC, EC2, Lambda, ECS, S3, RDS, DynamoDB, CodePipeline, kiến trúc, best practices |
| 🤖 **BMAD Agents** | 7 AI agent chuyên gia: Mary (BA), Paige (Writer), John (PM), Sally (UX), Winston (Architect), Amelia (Developer), Quinn (QA) |
| 💰 **Phỏng vấn theo lương** | Chọn mức lương (8-150 triệu) → câu hỏi phù hợp + AI bổ sung |
| 🇬🇧 **English Interview** | 30-day lộ trình tiếng Anh cho Java Backend interview |
| 📊 **Skill Tracker** | Theo dõi XP, streak, kỹ năng |
| 📈 **Dashboard** | Thống kê học tập, lịch sử thi, tổng quan tiến độ |
| 🗺️ **Lộ trình học** | Beginner → Intermediate → Advanced cho English, Java, AI |
| ⏱️ **Focus Timer** | SVG ring timer với streak tracking, session history, forge theme |

---

## 🏗️ Kiến trúc dự án

```
projects/web-en/
├── index.html                    # Trang chủ
├── css/                          # Style system (15 files)
│   ├── variables.css             # Design tokens (colors, shadows, spacing)
│   ├── base.css                  # Reset + global utilities + scrollbar
│   ├── forge-tokens.css          # Forge design tokens (forge-* variables)
│   ├── home.css                  # Home page
│   ├── subpage.css               # Sub-page layout (forge dark theme)
│   ├── interview.css             # Interview page
│   ├── components.css            # Shared components (tabs, cards, quiz, game)
│   ├── hub.css                   # Hub pages layout
│   ├── learn.css                 # Learn code page
│   ├── timer.css                 # Focus timer
│   ├── ai.css                    # AI learning page
│   ├── exam.css                  # Exam page
│   ├── accelerator.css           # Accelerator page
│   └── agents/bmad-chat.css      # BMAD multi-agent chat styles
├── js/
│   ├── data/                     # All learning data (18 files)
│   │   ├── interview-data.js     # 39 cheat sheet topics
│   │   ├── salary-interview-data.js
│   │   ├── vocabulary.js, idioms.js, tenses.js
│   │   ├── learn-data.js, ai-data.js
│   │   ├── stories.js, practice.js
│   │   ├── progress-db.js, spaced-repetition.js
│   │   └── ...
│   ├── features/                 # Feature modules (logic + UI pattern)
│   │   ├── interview/            # Interview Q&A (interview-logic + interview-ui)
│   │   ├── quiz/                 # Quiz engine
│   │   ├── vocabulary/           # Vocabulary flashcards
│   │   ├── practice/             # Practice exercises
│   │   ├── stories/              # Story viewer
│   │   ├── tenses/               # Grammar tenses
│   │   ├── game/                 # Games (memory, scramble, speedquiz)
│   │   ├── accelerator/          # 30-day bootcamp
│   │   ├── learn/                # Code learning
│   │   └── skill-tracker/        # Skill tracking
│   ├── agents/                   # BMAD multi-agent chat system
│   ├── utils/                    # Timer, markdown, helpers
│   └── *.app.js                  # App entry points
├── pages/                        # All pages (22 files)
│   ├── java/
│   │   ├── hub.html              # Java Hub
│   │   ├── spring-boot.html      # Spring Boot deep-dive
│   │   ├── backend.html          # Backend Engineering deep-dive
│   │   ├── api-guide.html        # [MỚI] Hướng dẫn viết API thực chiến
│   │   └── integration-guide.html# [MỚI] Kết nối UI với API
│   ├── english/hub.html          # English Hub
│   ├── ai/hub.html               # AI Hub
│   ├── frontend/hub.html         # Frontend Hub (+ html-css, javascript, frameworks, responsive, ui-interview)
│   ├── cloud/hub.html            # AWS Cloud Hub
│   ├── interview.html            # 39 cheat sheet phỏng vấn Java Backend
│   ├── interview-english.html    # English interview 30-day prep
│   ├── salary-interview.html     # Phỏng vấn theo lương
│   ├── bmad-agents.html          # 7 AI agents
│   ├── accelerator.html          # 30-day bootcamp
│   ├── learning-paths.html       # Lộ trình học
│   ├── skill-tracker.html        # Skill Tracker
│   ├── dashboard.html            # Dashboard
│   └── ... (english, exam, games...)
├── server/                       # Node.js backend
│   ├── index.js                  # HTTP server + API routes
│   ├── config.js                 # Configuration
│   └── ai-service.js             # AI service (Ollama / OpenAI / Gemini)
└── start.bat                     # Windows launcher
```

---

## 🚀 Cách chạy

### Yêu cầu

- **Node.js** v18+
- **Ollama** (khuyến nghị) — để dùng AI local, free
- Hoặc API key **OpenAI** / **Gemini** (tuỳ chọn)

### Chạy nhanh (Windows)

```bash
start.bat
```

Script tự động:
1. Khởi động Ollama server
2. Mở trình duyệt tại `http://localhost:8080`
3. Chạy Node.js web server

### Chạy thủ công

```bash
cd "projects/web-en"
node server/index.js
```

Mở trình duyệt: [http://localhost:8080](http://localhost:8080)

### Cấu hình AI

Dự án tự động ưu tiên theo thứ tự:
1. **Gemini API** — nếu có biến môi trường `GEMINI_API_KEY`
2. **OpenAI API** — nếu có `OPENAI_API_KEY`
3. **Ollama** (local, mặc định) — model `qwen2.5:1.5b`

Cấu hình trong file `.env` hoặc `.env.bat`:

```bash
# Dùng Gemini (miễn phí có hạn)
GEMINI_API_KEY=your_key_here

# Dùng OpenAI
OPENAI_API_KEY=your_key_here

# Dùng Ollama với model khác
OLLAMA_MODEL=qwen2.5:7b
```

---

## 🧭 Hướng dẫn sử dụng

### Từ trang chủ → Hub page → Chi tiết

```
Trang chủ
├── ☕ Java → Java Hub
│   ├── 💻 Học Code
│   ├── 🍃 Spring Boot
│   ├── 📖 Hướng dẫn viết API (thực chiến)
│   ├── 🔗 Kết nối UI với API (thực chiến)
│   ├── 💰 Phỏng vấn theo lương
│   ├── 🇬🇧 English Interview
│   └── ☕ Phỏng vấn Backend (39 cheat sheet)
├── ⚙️ Backend Engineering (SQL/NoSQL, Kafka, Docker, K8s, CI/CD, System Design)
├── 📖 English → English Hub
│   ├── 📝 Từ vựng & Idioms
│   ├── ⏰ Các thì & Practice
│   ├── 📖 Đọc truyện
│   ├── 📝 Thi thử
│   └── Games (Memory, Scramble, Speed Quiz)
├── 🧠 Học AI → AI Hub
│   ├── 📚 Học Concepts
│   ├── 🎯 Trắc nghiệm
│   ├── 💼 Phỏng vấn AI
│   └── 🛠️ Projects
├── 🌐 Frontend → Frontend Hub
│   ├── 🎨 HTML & CSS
│   ├── ⚡ JavaScript
│   ├── ⚛️ React/Vue/Angular
│   ├── 📱 Responsive
│   └── 💼 Phỏng vấn UI/FE
├── ☁️ AWS Cloud (IAM, VPC, EC2, Lambda, ECS, S3, RDS, DynamoDB, CodePipeline)
├── 🗣️ BMAD Agents (7 AI chuyên gia)
├── 📊 Skill Tracker (XP, streak, kỹ năng)
├── 📈 Dashboard (thống kê, lịch sử)
├── 🗺️ Lộ trình học
└── 🔥 Focus Timer (SVG ring + streak tracking)
```

---

## 🔌 API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/ai-feedback` | Chấm điểm câu trả lời phỏng vấn Java |
| POST | `/api/ai-chat` | Chat với AI |
| POST | `/api/bmad/chat` | Multi-agent chat (BMAD) |
| POST | `/api/salary-interview` | Sinh câu hỏi phỏng vấn theo mức lương |

---

## 🎯 Tính năng nổi bật

### 39 Cheat Sheet Phỏng Vấn ☕
Trang `interview.html` tổng hợp 39 chủ đề từ Java Core, Spring Boot, Hibernate, Microservices đến Git, Linux, Redis, Clean Code, MongoDB, Monitoring và Soft Skills. Mỗi phần có code mẫu, checklist tự kiểm tra và câu trả lời mẫu.

### Hướng dẫn thực chiến 📖
- **api-guide.html**: Từ requirement → Entity → DTO → Mapper → Repository → Service → Controller → Exception Handler → Testing → Swagger. Ví dụ CRUD Product A-Z.
- **integration-guide.html**: Kết nối Frontend với Backend — API Contract, Authentication, State Management, Pagination, File Upload, WebSocket.

### Phỏng vấn theo lương 💰
Chọn mức lương mong muốn (8-150 triệu/tháng), hệ thống tự động hiển thị câu hỏi phỏng vấn phù hợp và gợi ý trả lời. AI tự động bổ sung câu hỏi theo yêu cầu.

### BMAD Multi-Agent 🤖
7 AI agent với 7 chuyên môn khác nhau:
- **📊 Mary** — Business Analyst
- **📚 Paige** — Technical Writer
- **📋 John** — Product Manager
- **🎨 Sally** — UX Designer
- **🏗️ Winston** — System Architect
- **💻 Amelia** — Senior Developer
- **🧪 Quinn** — QA Engineer

Có thể chat 1-1 hoặc Party Mode (nhiều agent thảo luận cùng lúc).

---

## 🎨 Design Theme

**Dark Forge** — nền tối `#08080e` với ánh lửa cam:
- Glassmorphism cards với `backdrop-filter: blur`
- SVG vòng lửa timer với streak tracking
- Gradient cam logo + hero text
- Ambient glow radial gradients nền
- Consistent forge design tokens (`--forge-*` variables)

## 📚 Công nghệ sử dụng

- **Frontend:** HTML5, CSS3 (Flexbox, Grid, Custom Properties, Animations), Vanilla JS (ES Modules)
- **Backend:** Node.js (HTTP server thuần, không framework)
- **AI:** Ollama (local), OpenAI API, Google Gemini API
- **Lưu trữ:** localStorage, IndexedDB
- **Fonts:** Inter, JetBrains Mono

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh. Hãy tạo issue hoặc pull request.

## 📄 Giấy phép

© 2026 SkillForge. Dự án cá nhân — phi thương mại.
