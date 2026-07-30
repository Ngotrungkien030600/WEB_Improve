# Kiến trúc — Part `server`

## Tóm tắt điều hành

Server là một file `http.createServer` **500 dòng, zero dependency**, làm hai việc: proxy 4 endpoint AI, và trả file tĩnh. Không Express, không middleware, không `package.json`. Chạy bằng `node server/index.js`.

Thiết kế này hợp lý cho một app học tập chạy local — nhưng nó chứa **một lỗ bảo mật thật** khiến không được phép mở ra internet ở trạng thái hiện tại.

## Công nghệ

| Hạng mục | Chi tiết |
|---|---|
| Runtime | Node.js (phiên bản không khai báo — không có `.nvmrc`, không `engines`) |
| Phụ thuộc | **không có** — chỉ `http`, `https`, `fs`, `path` |
| Cấu hình | Tự parse `.env` bằng tay tại `index.js:10-27` (không dùng `dotenv`) |
| Cổng | `process.env.PORT` hoặc 8080 |
| AI provider | Gemini (ưu tiên) → OpenAI → Ollama (fallback local) |

## Ba file, ba vai trò

```
server/config.js      → hằng số thuần: PORT, API_PATHS, AI_CONFIG, MIME_TYPES,
                        AGENTS (6 system prompt), AGENT_INFO
server/ai-service.js  → callAI(messages, apiKey, maxTokens): Promise<string>
                        buildSystemForBundle(slug, topic): {role, content}
server/index.js       → 4 route handler + static file server + parse .env
```

Tách lớp khá sạch: `config` không import gì, `ai-service` chỉ import `config`, `index` import cả hai. Không có phụ thuộc vòng.

## Chọn AI provider

`ai-service.js:callAI()` quyết định theo biến môi trường, theo thứ tự:

```
GEMINI_API_KEY có          → Gemini (generativelanguage.googleapis.com, model gemini-2.0-flash)
OPENAI_API_KEY có          → OpenAI (api.openai.com, model gpt-4o-mini)
không khoá nào             → Ollama (127.0.0.1:11434, model qwen2.5:1.5b)
```

Ollama là fallback offline — thông báo lỗi tiếng Việt hướng dẫn `ollama run qwen2.5:7b` nếu không kết nối được. Lưu ý bất khớp: default model trong config là `qwen2.5:1.5b` nhưng thông báo lỗi và `start.bat` đều nói `qwen2.5:7b`.

Cả ba nhánh dùng lại một dạng hội thoại `[{role, content}]` kiểu OpenAI; nhánh Gemini map lại thành `contents[{role, parts}]` với `assistant` → `model`.

## Static file server

`index.js:server` — sau khi không khớp 4 route POST:

```js
let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
const contentType = MIME_TYPES[ext] || 'application/octet-stream';
fs.readFile(filePath, …)
```

Header trả về: `Access-Control-Allow-Origin: *` và `Cache-Control: no-cache, no-store, must-revalidate`.

## Lỗi đã xác nhận trong part này

### S1 — Path traversal + rò secret qua HTTP (NGHIÊM TRỌNG)

Hai khiếm khuyết cộng lại thành một lỗ thật:

1. `path.join(ROOT, urlPath)` **không kiểm tra** đường dẫn kết quả có còn nằm trong `ROOT`. `req.url` không được decode nhưng `..` thô vẫn đi qua: `GET /../package.json` → `path.join` chuẩn hoá thành thư mục cha của `ROOT` → đọc file ngoài phạm vi.
2. MIME fallback `application/octet-stream` cho phép trả **bất kỳ** loại file, kể cả không phần mở rộng.

Hệ quả trực tiếp: `GET /.env` trả về nội dung file `.env` — chính là nơi chứa `GEMINI_API_KEY` / `OPENAI_API_KEY`. Không cần traversal, chỉ cần biết tên file.

**Sửa:** sau khi `path.join`, kiểm tra `path.resolve(filePath).startsWith(path.resolve(ROOT))`; thêm allowlist phần mở rộng thay vì fallback octet-stream; chặn tường minh mọi đường dẫn có `/.` (dotfile).

Đây là lý do server hiện tại **chỉ được chạy trên `localhost`**, không mở ra LAN hay internet.

### S2 — Không xác thực, không rate limit (nghiêm trọng vừa)

4 endpoint POST đều nhận request từ bất kỳ ai, `Access-Control-Allow-Origin: *`. Mỗi request gọi API AI trả phí bằng khoá của chủ máy. Ai truy cập được cổng 8080 đều tiêu tiền của bạn. Chấp nhận được với `localhost`; không chấp nhận được nếu deploy.

### S3 — Thân request không giới hạn kích thước (nhỏ)

Cả 4 handler đều `req.on('data', chunk => body += chunk)` không có ngưỡng. Một POST lớn sẽ nuốt RAM tiến trình.

### S4 — `handleSalaryInterview` có biến chết (nhỏ)

`index.js` nhánh fallback parse: `const qMatch = trimmed.match(/[?"'](.+?)[?"']/);` — `qMatch` không được dùng ở đâu. Fallback thực tế chỉ dựa vào việc chuỗi có chứa "câu hỏi", và gán mọi câu vào cùng `id: 'q-fallback'` (trùng id).

### S5 — Prompt agent bị nhân đôi (nhỏ)

6 system prompt tồn tại **hai bản**: `server/config.js:AGENTS` (server dùng) và `js/agents/agents-config.js:systemPrompt` (client giữ nhưng không gửi lên). Hai bản đã lệch nhau — bản client có thêm nguyên tắc thứ 4 mà bản server không có. Nguồn sự thật duy nhất phải là server.

## Triển khai

Không có Dockerfile, không CI/CD, không cấu hình hạ tầng. Cách chạy duy nhất là `start.bat` trên Windows. Xem [deployment-guide.md](./deployment-guide.md).

## Chiến lược test

Không có test. Ba hàm đáng test nhất và dễ test nhất vì thuần logic:
- `buildSystemForBundle(slug, topic)` — nhánh bundle tồn tại / không tồn tại
- việc chọn provider trong `callAI` — theo biến môi trường
- chuẩn hoá đường dẫn của static handler — chính là lỗi S1
