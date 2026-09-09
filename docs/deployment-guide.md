# Hướng dẫn triển khai production (Render — free tier)

> Cập nhật 2026-09-09. Các rào chặn bảo mật cũ (S1–S4) đã vá và verify: dotfile/traversal → 404, body >1 MB → 413, rate-limit 60 POST/phút/IP, không CORS `*`, bind loopback mặc định. Tài liệu này thay cho bản cũ ghi "chưa deploy được".
>
> ✅ **Đã deploy live:** https://skillforge-cuw1.onrender.com (Render free, Blueprint, 2026-09-09 — verified root Vue 200, `/english` SPA 200, `/pages/*.html` 301, `/.env` 404).

## Kiến trúc production

1 service duy nhất (cùng origin, giữ localStorage chia sẻ):

| Thành phần | Nguồn |
|---|---|
| Vue SPA (build) | `projects/web-app/dist/` — commit sẵn vào repo, serve ở root |
| `/api/*` (5 endpoint AI) | `projects/web-en/server/index.js` — zero-dependency Node |
| Legacy fallback | `web-en/` giữ nguyên; `/pages/*.html` đã 301 sang Vue |
| Dữ liệu người dùng | localStorage/IndexedDB **trong browser** — mỗi máy mỗi bản, không có DB dùng chung |
| Dữ liệu tĩnh server | `web-en/data/bmad/bmad-bundles.json` (trong repo) |

## Các file đã chuẩn bị sẵn trong repo

- `render.yaml` — Render Blueprint: web service `skillforge`, `rootDir: projects/web-en`, `startCommand: node server/index.js`, env `HOST=0.0.0.0`, `OPENAI_API_KEY`/`GEMINI_API_KEY` (sync: false → đặt tay trên dashboard).
- `projects/web-en/package.json` — khai báo `engines.node >= 18` + script `start`.
- Server đọc `process.env.HOST` (mặc định `127.0.0.1` cho local; Render set `0.0.0.0`), `process.env.PORT` (Render tự inject).
- Khoá AI đọc từ `process.env.OPENAI_API_KEY` / `GEMINI_API_KEY`; file `.env` local chỉ nạp khi biến env chưa tồn tại → env của nền tảng luôn thắng.

## Quy trình deploy (làm 1 lần)

1. **Push** repo này lên GitHub (đã sẵn `main`).
2. Mở https://dashboard.render.com → **New → Blueprint** → chọn repo `WEB_Improve`.
3. Render nhận `render.yaml`, tạo service `skillforge` (plan free). Build ~1–2 phút.
4. Service chạy → truy cập `https://skillforge.onrender.com` (subdomain mặc định; HTTPS tự động).

> Nếu không dùng Blueprint: **New → Web Service** → chọn repo → *Root Directory* = `projects/web-en` → *Build Command* = `npm install` → *Start Command* = `node server/index.js` → *Instance Type* = Free.

## Đặt khoá AI (bắt buộc cho tính năng chat)

Dashboard → service `skillforge` → **Environment** → thêm 2 biến (khoá thật của bạn, không commit lên git):

| Key | Ghi chú |
|---|---|
| `OPENAI_API_KEY` | bắt buộc nếu dùng OpenAI làm provider |
| `GEMINI_API_KEY` | bắt buộc nếu dùng Gemini (app thử Gemini trước) |

Sau khi lưu, Render tự redeploy. Nếu thiếu cả 2, các endpoint chat trả lỗi cấu hình (web vẫn chạy).

## Nâng cấp & redeploy

- Mỗi lần **push lên `main`** → Render tự build lại (nếu đã deploy kiểu Blueprint/GitHub hook).
- Nhớ chạy `npm run build` (trong `projects/web-app`) khi đổi source Vue rồi commit `dist/` — server serve đúng bản build đã commit.

## Hành vi free tier cần biết

- Service **ngủ** sau ~15 phút không có request; lần truy cập đầu tiên mất **~30–60 giây** để wake.
- Giới hạn 750 giờ/tháng (đủ nếu không bật 24/7); nếu cần luôn bật → upgrade instance (trả phí) hoặc chuyển VPS.
- Không có Ollama trên cloud (mặc định trỏ `127.0.0.1:11434`) — chỉ dùng provider OpenAI/Gemini ở production.

## Chạy local (không đổi)

`start.bat` (Windows, kèm Ollama) hoặc `cd projects/web-en && node server/index.js` → http://localhost:8080. Mặc định bind `127.0.0.1`; muốn mở ra mạng cục bộ thì đặt `HOST=0.0.0.0` (tự chịu trách nhiệm, có firewall).

## Nợ cần ghi nhận

- `web-en/.env` từng bị commit (khoá giả, đã gỡ khỏi index, có `.gitignore`). **Đừng** tạo `.env` chứa khoá thật trong thư mục đã clone; khoá production chỉ nằm trong dashboard Render.
- Không có tài khoản/đồng bộ dữ liệu giữa các máy — nếu cần, phải thêm backend + database (ngoài phạm vi hiện tại).
