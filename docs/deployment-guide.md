# Hướng dẫn triển khai

## Hiện trạng: chưa có triển khai nào

| Hạng mục | Trạng thái |
|---|---|
| Dockerfile / docker-compose | không có |
| CI/CD (`.github/workflows`, GitLab CI, Jenkins) | không có |
| Infrastructure as Code | không có |
| Cấu hình môi trường (staging/prod) | không có |
| Process manager (pm2, systemd) | không có |
| Reverse proxy / TLS | không có |

Cách chạy duy nhất tồn tại là `start.bat` trên máy Windows cá nhân.

## `start.bat` làm gì

```bat
cd /d "%~dp0projects\web-en"
start /b "" "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve   # bật Ollama nền
timeout /t 3                                                    # chờ 3 giây
start "" "http://localhost:8080"                                # mở browser
node server/index.js                                            # chạy server (foreground)
```

Phụ thuộc cứng vào đường dẫn cài Ollama mặc định của Windows. Không có bản `.sh` cho Linux/macOS — trên các hệ đó phải chạy tay `node server/index.js`.

## Chặn đường lên internet

Server **không được deploy công khai ở trạng thái hiện tại**. Ba lý do, theo thứ tự nghiêm trọng:

1. **`GET /.env` trả về file secret.** Static handler không chặn dotfile và fallback MIME `application/octet-stream` cho mọi phần mở rộng lạ. Ai biết URL là lấy được khoá API.
2. **Path traversal.** `path.join(ROOT, urlPath)` không kiểm tra kết quả có còn trong `ROOT` — `..` đi qua được.
3. **API AI mở toang.** 4 endpoint POST không xác thực, không rate limit, `Access-Control-Allow-Origin: *`. Mỗi request tiêu tiền khoá API của chủ máy.

Chi tiết ở [architecture-server.md](./architecture-server.md) mục S1 và S2.

## Điều kiện tối thiểu nếu muốn deploy

Phải làm đủ, không bỏ mục nào:

1. Vá S1 — chuẩn hoá đường dẫn (`path.resolve(...).startsWith(ROOT)`), allowlist phần mở rộng, chặn tường minh dotfile.
2. Vá S2 — thêm xác thực cho 4 endpoint POST và rate limit theo IP.
3. Vá S3 — giới hạn kích thước thân request.
4. Đưa secret ra biến môi trường của nền tảng, bỏ hẳn đường đọc file `.env` ở production.
5. Đặt TLS (reverse proxy) — hiện chỉ có HTTP thuần.
6. Khai báo phiên bản Node (`package.json` `engines` hoặc `.nvmrc`) để môi trường chạy xác định.

## Ghi chú về hosting

Phần client là **static thuần** — 28 HTML + CSS + JS, không cần server để phục vụ. Có thể tách:

- **Client** → bất kỳ static host nào (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
- **Server** → chỉ còn 4 endpoint AI, đóng gói thành serverless function hoặc container nhỏ.

Tách như vậy sẽ loại bỏ hoàn toàn lỗ S1 (static host không có custom file handler để mà traversal) và thu hẹp bề mặt tấn công về đúng 4 endpoint cần bảo vệ. Đây là hướng đáng cân nhắc nếu dự án có ý định lên internet.

## Nợ cần ghi nhận

`projects/web-en/.env` **đã từng được commit** lên GitHub và secret vẫn nằm trong lịch sử git, kể cả sau khi đã `git rm --cached`. Người dùng xác nhận đây là khoá giả nên không cần revoke. Nếu về sau thay bằng khoá thật, phải đảm bảo `.gitignore` (đã thêm) chặn được trước khi tạo file.
