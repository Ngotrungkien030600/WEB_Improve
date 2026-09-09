# PRD — Milestone 1: Nền tảng đa người dùng (SkillForge)

**Version:** 1.0 · **Ngày:** 2026-09-09 · **Trạng thái:** chờ duyệt (review)
**Tác giả:** AI agent (với chủ repo) · **Đối tượng:** học viên Việt Nam · **Quy mô mục tiêu:** 100–500 user tháng đầu
**Mô hình kinh doanh:** Freemium + subscription (thanh toán thuộc Milestone 2)

---

## 1. Bối cảnh và ràng buộc hiện tại (đã kiểm chứng)

- App chính là **Vue 3 SPA** (`projects/web-app`, 39 trang), serve cùng origin bởi **Node server zero-dependency** (`projects/web-en/server/index.js`) + bản build `dist/`; đã live trên Render free.
- **Toàn bộ dữ liệu người dùng nằm trong browser**, không có server DB:
  - IndexedDB `SkillForgeProgress` (stores: `sessions`, `completed`, `stats`, `goals`, `bookmarks`)
  - IndexedDB `SkillForgeSRS` (store `reviewHistory` — spaced repetition)
  - 10 khoá localStorage: `skillforge_skills`, `skillforge_skill_state`, `skillforge_timer_state`, `skillforge_timer_history`, `skillforge_exam_history`, `skillforge_log`, `quizHistory`, `aiChecklist`, `learnChecklist`, `interviewChecklist`
- Nội dung học (vocabulary, interview topics, cheatsheet Java…) là **dữ liệu tĩnh trong repo** — M1 không cần đưa lên DB.
- AI: 5 endpoint POST gọi Gemini→OpenAI (config `server/config.js` + `ai-service.js`); **chưa có quota theo user**; Ollama local không dùng ở cloud.
- Chưa có: auth, test, CI/CD, log tập trung, analytics, trang pháp lý, domain riêng.

## 2. Ai là người dùng & việc họ cần làm

| Persona | Công việc | Đau điểm nếu không có M1 |
|---|---|---|
| Học viên VN (mới) | Học tiếng Anh/luyện phỏng vấn Java trên nhiều thiết bị | Mất tiến độ khi đổi máy; không có tài khoản |
| Học viên quay lại | Tiếp tục lộ trình, SRS, streak | Dữ liệu theo trình duyệt, không nhớ ai là ai |
| Chủ sản phẩm (bạn) | Đo người dùng, giới hạn chi phí AI | Không biết ai dùng gì; hết budget AI vì người lạ dùng khoá |

## 3. Mục tiêu M1 (Definition of Done cấp milestone)

1. Người dùng **đăng ký/đăng nhập** (email + Google), có hồ sơ.
2. Tiến độ, SRS, bookmark, checklist, lịch sử thi/quiz **đồng bộ lên server** theo tài khoản và khôi phục khi đăng nhập máy khác.
3. Endpoint AI **yêu cầu đăng nhập**, giới hạn lượt/ngày theo user (free 20), có **log mỗi lần gọi AI** + breaker tổng (dừng khi vượt ngân sách ngày) — bảo vệ chi phí.
4. Chạy production: Docker, `GET /health`, log JSON, CI chạy build+test, domain riêng + HTTPS, backup DB hằng ngày.
5. Legacy `web-en/` vẫn chạy được (luật repo); dữ liệu cũ trong máy local **không tự migrate** (quyết định §9).

## 4. Ngoài phạm vi M1 (làm M2/M3)

Thanh toán (VNPay/Stripe) & gói Pro · admin dashboard · CMS nội dung · migrate dữ liệu local cũ · SSR/SEO trang công khai · đa vùng · thuật toán SRS mới · analytics nâng cao.

## 5. Kiến trúc mục tiêu

```
Vue SPA ──HTTPS──▶ API Node (server/index.js, Docker)        [Supabase Cloud - Singapore]
                     ├─ verify JWT (service-role)            ├─ Postgres (dữ liệu user)
                     ├─ quota AI (ai_usage)                  ├─ Auth (email + Google)
                     └─ log ai_calls                         └─ Storage (sau, cho upload)
Client: @supabase/supabase-js (auth) + layer sync offline-first (localStorage vẫn là cache)
```

### Quyết định kiến trúc (AD)

- **AD-1 — Auth + DB = Supabase** (Postgres + Auth + Storage một nơi, PITR backup ở Pro). Không tự viết auth/password (rủi ro bảo mật cao, phí thời gian). Client dùng anon key + supabase-js; **server chỉ tin JWT do Supabase cấp**, verify qua `auth.getUser(token)` với service-role key (key nằm trong env Render, không vào repo).
- **AD-2 — Giữ 1 service Node** (zero-dep giữ được, thêm dependency tối thiểu: chỉ supabase-js phía server khi cần + resend sau). Không tách microservice.
- **AD-3 — Đồng bộ offline-first**: giữ localStorage/IndexedDB làm cache + ghi nhanh; **sync engine** trong `web-app` đẩy lên server (flush sau ghi / 60s / trước khi đóng tab) và kéo về khi đăng nhập + focus. Tranh chấp ghi: phiên bản **updated_at gần nhất thắng** (M1). Giới hạn thừa nhận: eventual consistency.
- **AD-4 — Quota AI trong DB**: bảng `ai_usage(user_id, day, count)` PK(user_id, day), reset theo ngày UTC. Free = 20 lượt chat/ngày. Breaker tổng: env `AI_DAILY_CALL_CAP` (mặc định 5000) dừng toàn bộ AI trong ngày khi vượt + log.
- **AD-5 — Content giữ tĩnh trong repo** (M1), không đưa lên DB — tránh phình phạm vi.

## 6. Schema v1 (migration duy nhất `supabase/migrations/0001_init.sql`)

| Bảng | Cột chính | Nguồn |
|---|---|---|
| `profiles` | user_id (ref auth.users) PK, display_name, plan default 'free', created_at | Supabase trigger tạo khi signup |
| `progress_sessions` | id bigint, user_id, date, type, item_id, duration, score, total, percentage, payload jsonb | IDB `sessions` |
| `progress_completed` | id text, user_id, category, completed_at, payload jsonb | IDB `completed` |
| `progress_stats` | user_id, key, value jsonb, updated_at | IDB `stats` |
| `progress_goals` | id, user_id, due_date, status, payload jsonb | IDB `goals` |
| `bookmarks` | id, user_id, category, created_at, payload jsonb | IDB `bookmarks` |
| `srs_review_history` | id, user_id, due_date, category, difficulty, payload jsonb | IDB `reviewHistory` |
| `user_kv` | user_id, key, value jsonb, updated_at; PK(user_id,key) | 10 khoá localStorage |
| `ai_usage` | user_id, day date, count int; PK(user_id,day) | quota |
| `ai_calls` | id bigserial, user_id, ts, endpoint, model, prompt_tokens, completion_tokens | chi phí |

RLS: mọi bảng user-data bật Row Level Security, policy `user_id = auth.uid()`; service-role bypass cho server.

## 7. API mới (thêm vào `server/index.js`)

| Endpoint | Nội dung |
|---|---|
| `GET /api/me` | profile + `ai_usage` hôm nay + plan |
| `GET /api/me/progress` (sessions/completed/stats/goals/bookmarks theo nhóm `?scope=`) | kéo về khi đăng nhập |
| `PUT /api/me/progress` (batch upsert theo scope) | đẩy lên, trả conflicts theo updated_at |
| `GET/PUT /api/me/kv` | 10 khoá localStorage dạng map (bulk) |
| `GET/PUT /api/me/srs` | reviewHistory |
| POST chat cũ | **thêm auth**: 401 nếu chưa login; 429 kèm `{error:'daily_limit'}` khi hết lượt; ghi `ai_calls` |

Auth middleware: đọc `Authorization: Bearer <JWT>`, verify bằng service-role client, đính `req.userId`.

## 8. Story plan M1 (BMAD — ước lượng, tổng ~3–4 tuần dev)

| # | Story | Việc chính | Ước lượng |
|---|---|---|---|
| S1 | `14-1-supabase-init` | Tạo project, migration 0001, RLS, trigger profiles, env wiring | 1 ngày |
| S2 | `14-2-auth-ui` | Trang login/register, nút Google, profile menu, router guard, logout | 2–3 ngày |
| S3 | `14-3-auth-api` | Middleware JWT, `/api/me`, `/api/me/kv`, quota `ai_usage` | 2 ngày |
| S4 | `14-4-sync-progress-db` | Sync engine cho 5 store IDB Progress (sessions/completed/stats/goals/bookmarks): read-through + flush + pull | 3 ngày |
| S5 | `14-5-sync-srs-kv` | Sync reviewHistory + 10 khoá localStorage (map theo module sở hữu: timer/exam/interview/checklist…) | 2–3 ngày |
| S6 | `14-6-ai-quota-cost` | Gắn auth+quota vào 5 endpoint chat, log `ai_calls`, breaker tổng, lỗi chuẩn 401/429 | 1–2 ngày |
| S7 | `14-7-ops` | Dockerfile, `GET /health`, log JSON, GitHub Actions (build Vue + vitest, test server node:test, deploy hook), chuyển domain + HTTPS, backup check | 2 ngày |

Mỗi story sẽ có AC chi tiết + verify chạy thật khi làm (quy trình dev-story → review → hardened như repo).

## 9. Quyết định & rủi ro cần bạn xác nhận

1. **Dữ liệu local cũ không tự migrate sang tài khoản** — sau M1, máy bạn đăng nhập sẽ bắt đầu trống (cache local cũ vẫn còn nhưng không đẩy lên tránh trộn dữ liệu). Đồng ý? (Nếu muốn "import 1 lần" thì thêm story nhỏ.)
2. **Chat/BMI yêu cầu đăng nhập từ M1** — nội dung học xem tự do, chỉ tính năng ghi tiến độ + AI cần tài khoản. Đồng ý?
3. **Supabase vùng Singapore** + Render Starter Singapore (hoặc VPS SG) — chi phí ~$40–85/th như bảng ở trên. OK?
4. **Domain**: bạn sẽ mua domain nào (`skillforge.vn` / `skillforge.com` / khác)? Cần để chốt story S7.

## 10. AC tổng (kiểm chứng được khi kết thúc M1)

- [ ] Đăng ký bằng email mới + đăng nhập Google đều vào được; logout không vỡ route.
- [ ] Học 1 quiz/1 bài ở máy A (cùng tài khoản) → mở máy B: tiến độ, streak, bookmark, checklist hiện đúng.
- [ ] Chat khi chưa đăng nhập → 401; sau 20 lượt/ngày → 429 `daily_limit`; `ai_calls` có dòng log mỗi lần gọi.
- [ ] `GET /health` 200 trên production; backup DB tồn tại; CI xanh trên push.
- [ ] Legacy `web-en` local vẫn chạy; không secret nào trong repo; `.env` không bị stage.
