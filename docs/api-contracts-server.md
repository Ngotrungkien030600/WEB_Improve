# Hợp đồng API — Part `server`

**Base URL:** `http://localhost:8080` · **Xác thực:** không có · **CORS:** `Access-Control-Allow-Origin: *`

Cả 4 endpoint đều là `POST`, thân JSON, và đều không xác thực. Lỗi parse JSON → `400`; lỗi phía AI → `502`.

---

## `POST /api/ai-feedback`

Chấm điểm câu trả lời phỏng vấn Java. Định nghĩa tại `server/index.js:handleAiFeedback`.

**Request**
```json
{ "question": "string (bắt buộc)", "answer": "string (bắt buộc)", "topic": "string (tuỳ chọn, default 'Java Backend')" }
```

**Response 200** — server yêu cầu AI trả JSON và chuyển tiếp nguyên văn khối `{…}` khớp đầu tiên:
```json
{ "score": 8, "feedback": "nhận xét chi tiết", "suggestions": ["gợi ý 1", "gợi ý 2"] }
```
Nếu AI không trả JSON hợp lệ, fallback: `{ "score": 5, "feedback": "<toàn bộ text>", "suggestions": [] }`.

**Lỗi:** `400` thiếu `question`/`answer` hoặc JSON sai · `502` AI lỗi.
**max_tokens:** 800.

---

## `POST /api/ai-chat`

Chat tự do, có thể gắn vào một BMAD bundle. Định nghĩa tại `handleAiChat`.

**Request**
```json
{
  "messages": [{ "role": "user|assistant", "content": "string" }],
  "topic": "string (tuỳ chọn)",
  "bundleSlug": "string (tuỳ chọn — khớp slug trong data/bmad/bmad-bundles.json)"
}
```

`bundleSlug` được `buildSystemForBundle()` dịch thành system prompt lấy từ `defaultPersona.title` + `tagline` của bundle. Slug không tồn tại → prompt mặc định theo `topic`.

**Response 200:** `{ "reply": "string" }`
**Lỗi:** `400` `messages` thiếu hoặc rỗng · `502` AI lỗi.
**max_tokens:** 1000 (mặc định).

---

## `POST /api/bmad/chat`

Chat đa agent — hai chế độ trong cùng một endpoint. Định nghĩa tại `handleBmadChat`.

### Chế độ 1 — theo bundle (khi có `bundleSlug`)

**Request**
```json
{ "bundleSlug": "brainstorming-coach", "conversation": [{ "role": "user", "content": "…" }], "topic": "string (tuỳ chọn)" }
```

**Response 200**
```json
{ "replies": [{ "agentId": "<bundleSlug>", "name": "BMad", "icon": "🤖", "text": "…" }] }
```

**Lỗi:** `400` nếu `conversation` rỗng.

### Chế độ 2 — theo agent (khi không có `bundleSlug`)

**Request**
```json
{
  "agentIds": ["mary", "winston"],
  "messages": { "mary": [{ "role": "…", "content": "…" }], "winston": [...] },
  "userMessage": "string (tuỳ chọn — append vào cuối mỗi hội thoại)"
}
```

`agentIds` hợp lệ: `mary`, `paige`, `john`, `sally`, `winston`, `amelia`. Server gọi song song một request AI cho mỗi agent (`Promise.allSettled`), mỗi agent có system prompt riêng từ `server/config.js:AGENTS`.

**Response 200**
```json
{
  "replies": [{ "agentId": "mary", "name": "Mary", "icon": "📊", "text": "…" }],
  "errors": [{ "agentId": "unknown", "error": "…" }]
}
```
`errors` chỉ xuất hiện khi có agent lỗi. **Lưu ý hợp đồng:** khi một agent lỗi, `errors[].agentId` luôn là chuỗi `"unknown"` — `Promise.allSettled` không giữ lại agentId ở nhánh reject, nên client không biết agent nào thất bại.

**Lỗi:** `400` `agentIds` thiếu/rỗng. Agent không tồn tại **không** trả 400 — nó thành một phần tử trong `errors`.

⚠ **Endpoint này hiện không có client nào gọi đúng.** `js/agents/bmad-chat.js` fetch vào `undefined` (xem lỗi C1 trong [architecture-client.md](./architecture-client.md)). Chỉ `bmad-cli.js` gọi đúng đường dẫn.

---

## `POST /api/salary-interview`

Sinh câu hỏi phỏng vấn theo mức lương. Định nghĩa tại `handleSalaryInterview`.

**Request**
```json
{ "salary": 35, "topic": "string (tuỳ chọn)", "customRequest": "string (tuỳ chọn)" }
```

`salary` tính bằng triệu VND/tháng, quyết định độ khó trong system prompt:

| Khoảng | Cấp | Nội dung hỏi |
|---|---|---|
| `< 20` | Junior | core Java, OOP, SQL, Git, data structure cơ bản |
| `20–39` | Middle | Spring Boot, JPA, REST, Multithreading, Transaction, Security |
| `40–69` | Senior | Microservices, Docker, Kafka, Design Pattern, Cloud, Performance |
| `>= 70` | Architect | System Design, Distributed Systems, CAP, CQRS, Event Sourcing |

**Response 200**
```json
{
  "questions": [{ "id": "q1", "topic": "…", "question": "…", "sampleAnswer": "…" }],
  "fromAI": true
}
```
Fallback khi AI không trả JSON array: thêm `"note": "fallback parse"`, mọi phần tử có `id: "q-fallback"` (trùng nhau) và `sampleAnswer: "—"`.

**Lỗi:** `400` JSON sai · `502` AI lỗi. **max_tokens:** 1500.

---

## GET — file tĩnh

Mọi `GET` không khớp 4 route trên đều rơi vào static handler: `/` → `index.html`, còn lại map thẳng vào đường dẫn file dưới `projects/web-en/`.

⚠ Handler này **không chặn path traversal và không allowlist phần mở rộng** — `GET /.env` trả về file secret. Xem lỗi S1 trong [architecture-server.md](./architecture-server.md). Không mở server này ra ngoài localhost.

## Tổng hợp

| Method | Path | Handler | Auth | max_tokens |
|---|---|---|---|---|
| POST | `/api/ai-feedback` | `handleAiFeedback` | không | 800 |
| POST | `/api/ai-chat` | `handleAiChat` | không | 1000 |
| POST | `/api/bmad/chat` | `handleBmadChat` | không | 1000 |
| POST | `/api/salary-interview` | `handleSalaryInterview` | không | 1500 |
| GET | `/*` | static | không | — |
