# Story 13-1 — Chuẩn bị deploy lên Render (free tier)

**Epic:** Epic 13 — Production
**Story ID:** 13-1-chuan-bi-deploy-render
**Status:** in-progress (code xong; chờ thao tác deploy trên Render dashboard)
**Implemented:** dev-story (2026-09-09)

---

## Context

Người dùng muốn đưa web lên production. Chốt: **Render free tier**, subdomain `*.onrender.com`, người dùng tự đặt khoá AI thật trên dashboard. Kiến trúc giữ nguyên 1 service (Vue dist + `/api` + SPA fallback cùng origin).

## Thay đổi

- `projects/web-en/server/index.js`: bind host qua `process.env.HOST` (mặc định `127.0.0.1`; production đặt `0.0.0.0`).
- `projects/web-en/package.json` (mới): khai báo Node `>=18`, script `start`.
- `render.yaml` (mới, gốc repo): Blueprint web service `skillforge`, `rootDir: projects/web-en`, `plan: free`, `startCommand: node server/index.js`, `HOST=0.0.0.0`, `OPENAI_API_KEY`/`GEMINI_API_KEY` `sync: false`.
- `docs/deployment-guide.md`: viết lại thành runbook production (quy trình Blueprint, đặt env, hành vi free tier, redeploy theo push).

## Verify (chạy thật local)

- Boot với `HOST` mặc định + `PORT=8090`: root = Vue 200, `/.env` 404, `/pages/*.html` 301.
- Build Vue đã commit sẵn `dist/`.

## Việc còn lại (thao tác tay — không làm được từ agent)

1. Push lên GitHub (sau story này).
2. Render dashboard → New → Blueprint → chọn repo.
3. Đặt `OPENAI_API_KEY` / `GEMINI_API_KEY` trong Environment.
4. Mở `https://skillforge.onrender.com` nghiệm thu.
