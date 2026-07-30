# ⚒️ SkillForge — Lò rèn kỹ năng

**SkillForge** là nền tảng học tập toàn diện dành cho lập trình viên Việt Nam, tích hợp AI để hỗ trợ học tiếng Anh, lập trình Java, frontend, AI/ML, AWS Cloud, Backend Engineering và luyện phỏng vấn — tất cả chạy local, miễn phí, không cần internet cho AI.

---

## 📸 Giao diện

> Dự án đang trong giai đoạn phát triển — giao diện được thiết kế tối giản, tối ưu cho trải nghiệm học tập.

---

## ✨ Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 📖 **Tiếng Anh** | 220+ từ vựng, 70+ idioms, 12 thì, truyện song ngữ, thi thử, 3 games |
| ☕ **Java** | 10 bài học code + Spring Boot chuyên sâu + phỏng vấn theo lương |
| 🧠 **AI/ML** | 48 concepts flashcard, 50+ quiz, 60+ câu phỏng vấn, 8 projects thực hành |
| 🌐 **Frontend** | HTML/CSS, JavaScript, React/Vue/Angular, Responsive, phỏng vấn UI/FE |
| ⚙️ **Backend Engineering** | SQL/NoSQL, Kafka, Docker, K8s, CI/CD, System Design, Performance |
| ☁️ **AWS Cloud** | IAM, VPC, EC2, Lambda, ECS, S3, RDS, DynamoDB, CodePipeline, kiến trúc, best practices |
| 🤖 **BMAD Agents** | 6 AI agent chuyên gia: Mary (BA), Paige (Writer), John (PM), Sally (UX), Winston (Architect), Amelia (Developer) |
| 📊 **Dashboard** | Thống kê XP, streak, lịch sử thi, kỹ năng |
| 🗺️ **Lộ trình học** | Beginner → Intermediate → Advanced cho English, Java, AI |
| ⏱️ **Focus Timer** | SVG ring timer với streak tracking, session history, forge theme |

---

## 🏗️ Kiến trúc dự án

```
projects/web-en/
├── index.html                    # Trang chủ
├── css/                          # Style system
│   ├── variables.css             # Design tokens (colors, shadows, spacing)
│   ├── base.css                  # Reset + global utilities + scrollbar
│   ├── home.css                  # Home page
│   ├── components.css            # Shared components (tabs, cards, quiz, game)
│   ├── hub.css                   # Hub pages layout
│   ├── timer.css                 # Focus timer
│   ├── interview.css             # Interview page
│   ├── learn.css                 # Learn code page
│   ├── ai.css                    # AI learning page
│   └── exam.css                  # Exam page
├── js/
│   ├── data/                     # All learning data (vocab, idioms, tenses...)
│   ├── features/                 # Feature modules (vocabulary, quiz, game...)
│   ├── agents/                   # BMAD multi-agent chat system
│   └── utils/                    # Timer, helpers, markdown
├── pages/                        # All pages
│   ├── english/
│   │   └── hub.html              # English hub
│   ├── java/
│   │   ├── hub.html              # Java hub
│   │   ├── spring-boot.html      # Spring Boot deep-dive
│   │   └── backend.html          # Backend Engineering deep-dive
│   ├── ai/
│   │   └── hub.html              # AI hub
│   ├── frontend/
│   │   ├── hub.html              # Frontend hub
│   │   ├── html-css.html
│   │   ├── javascript.html
│   │   ├── frameworks.html
│   │   ├── responsive.html
│   │   └── ui-interview.html
│   ├── cloud/
│   │   └── hub.html              # AWS Cloud hub
│   ├── cloud.html                # AWS Cloud deep-dive (IAM, VPC, Lambda, ECS...)
│   ├── bmad-agents.html          # BMAD agents page
│   ├── dashboard.html            # Progress dashboard
│   ├── learning-paths.html       # Learning paths
│   ├── salary-interview.html     # Salary-based interview questions
│   └── ... (english.html, exam.html, games...)
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
│   └── 💰 Phỏng vấn theo lương
├── ⚙️ Backend Engineering (chi tiết: SQL/NoSQL, Kafka, Docker, K8s, CI/CD, System Design, Performance)
├── 📖 English → English Hub
│   ├── 📝 Từ vựng & Idioms
│   ├── ⏰ Các thì & Practice
│   ├── 📖 Đọc truyện
│   ├── 📝 Thi thử
│   └── Games
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
├── ☁️ AWS Cloud (chi tiết: IAM, VPC, EC2, Lambda, ECS, S3, RDS, DynamoDB, CodePipeline)
├── 🗣️ BMAD Agents
├── 📊 Skill Tracker
├── 📈 Dashboard
├── 🗺️ Lộ trình học
└── 🔥 Forge Timer (SVG ring + streak tracking, góc phải header)
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

### Phỏng vấn theo lương 💰
Chọn mức lương mong muốn (8-150 triệu/tháng), hệ thống tự động hiển thị câu hỏi phỏng vấn phù hợp và gợi ý trả lời. AI tự động bổ sung câu hỏi theo yêu cầu.

### BMAD Multi-Agent 🤖
6 AI agent với 6 chuyên môn khác nhau:
- **📊 Mary** — Business Analyst
- **📚 Paige** — Technical Writer
- **📋 John** — Product Manager
- **🎨 Sally** — UX Designer
- **🏗️ Winston** — System Architect
- **💻 Amelia** — Senior Developer

Có thể chat 1-1 hoặc Party Mode (nhiều agent thảo luận cùng lúc).

### Lộ trình học 🗺️
Lộ trình có cấu trúc từ cơ bản đến nâng cao, mỗi mốc có mục tiêu rõ ràng.

---

## 🎨 Design Theme

**Dark Forge** — nền tối `#08080e` với ánh lửa cam:
- Glassmorphism cards với `backdrop-filter: blur`
- SVG vòng lửa timer với streak tracking
- Ember particles bay (CSS animation thuần)
- Gradient cam logo + hero text
- Ambient glow radial gradients nền

## 📚 Công nghệ sử dụng

- **Frontend:** HTML5, CSS3 (Flexbox, Grid, Custom Properties, Animations, backdrop-filter), Vanilla JS
- **Backend:** Node.js (HTTP server thuần, không framework)
- **AI:** Ollama (local), OpenAI API, Google Gemini API
- **Lưu trữ:** localStorage, IndexedDB
- **Fonts:** Inter, JetBrains Mono

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh. Hãy tạo issue hoặc pull request.

---

## 📄 Giấy phép

© 2026 SkillForge. Dự án cá nhân — phi thương mại.
