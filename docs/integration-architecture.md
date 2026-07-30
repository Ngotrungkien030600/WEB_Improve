# Kiến trúc tích hợp

Dự án có 2 part chạy cùng một tiến trình Node: `client` (tài nguyên tĩnh) và `server` (4 endpoint AI + static handler). Chúng không phải hai dịch vụ tách rời — `server` vừa phục vụ file của `client`, vừa làm proxy AI.

## Sơ đồ luồng

```
┌─ Browser ─────────────────────────────┐
│  28 trang HTML · JS · CSS · IndexedDB │
└───────────────┬───────────────────────┘
                │  HTTP :8080
                ▼
┌─ server/index.js (Node built-in) ─────┐
│  POST /api/ai-feedback                │
│  POST /api/ai-chat                    │
│  POST /api/bmad/chat                  │
│  POST /api/salary-interview           │
│  GET  /*  → static từ projects/web-en/ │
└───────────────┬───────────────────────┘
                │  server/ai-service.js: callAI()
                ▼
     ┌──────────┴──────────┬─────────────────┐
     ▼                     ▼                 ▼
  Gemini API          OpenAI API        Ollama local
  (nếu có             (nếu có           127.0.0.1:11434
  GEMINI_API_KEY)     OPENAI_API_KEY)   (fallback)
```

## Điểm tích hợp

| # | Từ | Đến | Giao thức | Chi tiết |
|---|---|---|---|---|
| I1 | client (`js/interview-app.js`) | server `/api/ai-feedback` | HTTP POST JSON | chấm điểm câu trả lời |
| I2 | client (`js/ai-app.js`) | server `/api/ai-chat` | HTTP POST JSON | chat + bundle |
| I3 | client (`js/agents/bmad-chat.js`) | server `/api/bmad/chat` | HTTP POST JSON | ⚠ **ĐỨT** — fetch vào `undefined`, xem lỗi C1 |
| I4 | `bmad-cli.js` (CLI, ngoài browser) | server `/api/bmad/chat` | HTTP POST JSON | đường duy nhất còn hoạt động tới endpoint này |
| I5 | client (`pages/salary-interview.html`) | server `/api/salary-interview` | HTTP POST JSON | sinh câu hỏi theo lương |
| I6 | client | server `GET /*` | HTTP | mọi HTML/CSS/JS/font/md |
| I7 | server | Gemini `generativelanguage.googleapis.com` | HTTPS | model `gemini-2.0-flash` |
| I8 | server | OpenAI `api.openai.com` | HTTPS | model `gpt-4o-mini` |
| I9 | server | Ollama `127.0.0.1:11434` | HTTP | model `qwen2.5:1.5b` (config) / `qwen2.5:7b` (start.bat) — **lệch** |
| I10 | client | Google Fonts | HTTPS | `<link>` Inter ở mỗi trang |
| I11 | server | `data/bmad/bmad-bundles.json` | fs đọc lúc khởi động | metadata bundle cho `buildSystemForBundle()` |

## Hợp đồng dữ liệu giữa 2 part

Định dạng hội thoại kiểu OpenAI được dùng làm chuẩn chung xuyên suốt:

```js
[{ role: 'system' | 'user' | 'assistant', content: string }]
```

Nhánh Gemini map lại ở `ai-service.js`: `assistant` → `model`, `content` → `parts[{text}]`. Client không biết provider nào đang chạy — đó là chi tiết nội bộ của server.

## Trạng thái: không chia sẻ

Không có phiên (session), không cookie, không token. Server **hoàn toàn stateless** giữa các request. Toàn bộ trạng thái người dùng nằm trong browser (IndexedDB + localStorage) và **không bao giờ** gửi lên server — xem [data-models-client.md](./data-models-client.md).

Hệ quả tốt: không có vấn đề đồng bộ, không cần database. Hệ quả xấu: dữ liệu học mất khi đổi máy hoặc xoá browser data, và không có đường sao lưu.

## Phụ thuộc ngầm cần biết

1. **Prompt agent tồn tại hai bản** — `server/config.js:AGENTS` (server dùng thật) và `js/agents/agents-config.js` (client giữ, không gửi). Hai bản đã lệch nội dung. Nguồn sự thật là bản server.
2. **Thứ tự thẻ `<script>`** là hợp đồng tích hợp không được khai báo — 5 file prelude phải nạp trước script chính của mỗi trang.
3. **`bmad-bundles.json` đọc một lần lúc khởi động server.** Sửa file phải restart server mới có hiệu lực. File cũng tham chiếu `knowledgeFiles: ["SKILL.md", "brain-methods.csv"]` — **hai file này không tồn tại trong repo**, nên metadata bundle là mô tả suông, không có nội dung tri thức đi kèm.
