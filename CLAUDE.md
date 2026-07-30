# CLAUDE.md — Luật cho repo WEB_Improve

## Cấu trúc: BMAD là khung, code nằm trong `projects/`

```
WEB_Improve/                 ← khung điều phối BMAD
├── _bmad/                   engine (installer sinh, KHÔNG sửa tay)
├── _bmad-output/            artifact planning + implementation
├── docs/                    project knowledge — điểm vào là docs/index.md
├── .claude/skills/          46 skill BMAD
├── package.json             dep bmad-method
└── projects/                ← MỌI CODE SẢN PHẨM nằm đây
    ├── web-en/              app vanilla hiện hành (đang chạy thật)
    └── web-app/             app Vue 3 + Vite (đang port dần)
```

Khác với `lado-core-design`: ở đó `projects/` bị gitignore vì code là repo git riêng. **Ở đây `projects/` được track** — code và tài liệu chung một repo.

Cập nhật BMAD bằng `npx bmad-method install --action update`. **Không** vendor source framework vào repo (đã từng xảy ra và đã gỡ ở commit `cfdf237`).

## Port sang Vue: chạy song song, không big-bang

`projects/web-en/` phải **luôn chạy được** trong suốt quá trình port. Port xong trang nào thì chuyển trang đó, không tháo dỡ bản cũ trước.

Nguồn sự thật khi port một trang: đọc HTML/CSS gốc trong `projects/web-en/`, không dựng lại theo trí nhớ. Design token lấy từ `projects/web-en/css/variables.css`.

## Bảo mật

- **KHÔNG** đọc, in, hay commit nội dung `.env` (mọi biến thể). Đã có trong `.gitignore`.
- Server `projects/web-en/server/index.js` có lỗ path traversal (lỗi S1, đã tái hiện: `GET /.env` → 200). **Chỉ chạy localhost** cho tới khi vá.
- Không mở port ra LAN/internet.

## Quy ước code

| Khía cạnh | Luật |
|---|---|
| Định danh (biến/hàm/file/component) | **Tiếng Anh** |
| Comment, chuỗi UI, tài liệu | **Tiếng Việt** |
| Comment | Chỉ giải thích **tại sao**, không mô tả lại code. Không tự thêm comment khi sửa file |
| Module | ESM. **Không** thêm biến `window.*` toàn cục mới |
| Ternary | Không lồng từ 2 tầng — tách `if/else` |
| Tên file | `kebab-case.js`, component Vue `PascalCase.vue` |
| Tính năng mới trong `web-en/` | Theo khuôn `<tên>-logic.js` (hàm thuần) + `<tên>-ui.js` (DOM) |

## Trước khi tin trạng thái nào đó

Kiểm chứng bằng chạy thật, đừng khẳng định từ artifact. 9 lỗi đã ghi trong `docs/index.md` — S1 và C1 đã tái hiện, 7 lỗi còn lại mới đọc code.
