# Kiểm kê component — Part `client`

> Tài liệu này là **nền trực tiếp cho công việc chuẩn hoá component**. Nó liệt kê cái đang có, đo mức trùng lặp, và đề xuất tập component đích.

## Kết luận một dòng

**Chưa có tầng component nào tồn tại.** Có 285 class selector trong `css/`, gần như toàn bộ được đặt tên theo *trang* chứ theo *vai trò*. Cùng một khái niệm thị giác được cài lại 5–8 lần dưới 5–8 cái tên.

## Bằng chứng đo được

| Chỉ số | Giá trị |
|---|---|
| Class selector định nghĩa trong `css/` | 285 |
| Class name xuất hiện trong HTML | 290 |
| `class="card"` trong HTML | **121 lần** |
| Biến thể `*card*` định nghĩa trong CSS | **39 selector khác nhau** |
| Biến thể `*btn*` | **18 selector** |
| Biến thể `*topbar*` | **6 selector** (`topbar` 16 trang + 5 bản riêng) |
| Trang có `<style>` inline | **22 / 28** (~730 dòng) |
| Thuộc tính `style="..."` rải trong HTML | 40 |
| Design token có sẵn (`css/variables.css`) | 58 |
| CSS file mồ côi | 1 (`css/agents/bmad-chat.css`, 342 dòng) |

## Phân bố class theo tiền tố trang

```
ai-        93 selector      exam-      57      learn-     36      home-      30
sk-        61 selector      interview- 48      forge-     34      bmad-      25
quiz- 21 · game- 17 · hub- 13 · party- 12 · ember- 12 · focus- 11 · story- 9 · scramble- 8
```

Mỗi trang là một silo CSS riêng. Không có prefix nào mang nghĩa "dùng chung".

---

## Kiểm kê theo nhóm chức năng

### 1. Card — 39 biến thể cho cùng một ý tưởng

| Nhóm | Selector | Số dòng CSS |
|---|---|---|
| Card trang chủ | `.home-card` | 24 |
| Card phỏng vấn | `.interview-card` | 25 |
| Card học code | `.learn-card` | 16 |
| Card agent | `.bmad-agent-card` | 9 |
| Card hub | `.hub-card` | 6 |
| Card game | `.game-card`, `.sq-card`, `.scramble-card` | 6 |
| Card kỹ năng | `.sk-skill-card`, `.sk-category-card` | 4 |
| Card AI | `.ai-card` + 14 selector con (`-front`, `-back`, `-en`, `-vi`, `-def`, `-ex`, `-counter`, `-controls`, `-category`, `-inner`, `-btn`, `-filter`, `-vi`) | ~20 |
| Card lật | `.flip-card` + `-inner` `-front` `-back` | 8 |
| Khác | `.quiz-card`, `.practice-card`, `.exam-card`, `.ai-q-card`, `.ai-project-card` (+4 con), `.glass-card` | ~12 |

Thực tế chỉ có **3 kiểu card** khác nhau về hành vi: card tĩnh (hiển thị), card bấm được (điều hướng/chọn), card lật (flashcard). 39 selector đang phục vụ 3 kiểu.

### 2. Button — 18 biến thể

```
.forge-btn .forge-btn-primary .forge-btn-secondary .forge-btn-row .forge-modal-btn
.exam-btn-start .exam-btn-next .exam-back-btn
.bmad-mode-btn .bmad-back-btn .bmad-party-start-btn .bmad-party-select-all-btn
.ai-card-btn .ai-clear-btn .sk-btn .btn-next .btn-speak .btn-ripple
```

Chỉ có 2 vai trò thật: primary và secondary. Cộng thêm vài nút icon.

### 3. Topbar / header — 6 biến thể, không có template

`class="topbar"` dùng ở 16 trang; ngoài ra `ai-topbar`, `exam-topbar`, `hub-topbar`, `interview-topbar`, `learn-topbar` mỗi cái style riêng. Markup được **copy-paste**, không sinh ra từ đâu:

```html
<!-- pages/java/hub.html -->        <!-- pages/exam.html -->
<div class="topbar">                <header class="exam-topbar">
  <h1>☕ Java</h1>                    <div>
  <a class="back" href="…">← …</a>     <h1>📝 Thi Tiếng Anh</h1>
</div>                                 <p class="exam-subtitle">…</p>
```

Cùng chức năng (tiêu đề + nút quay lại), ba cấu trúc DOM khác nhau.

### 4. Modal — 2 hệ song song

```
Hệ 1: .modal-overlay  .modal-box  .modal-close
Hệ 2: .forge-modal  .forge-modal-overlay  .forge-modal-icon  .forge-modal-btn
```

### 5. Badge / tag — thưa và lệch

`.tag`, `.word-chip`, `.exam-badge`, `.ai-q-badge` — 4 tên cho cùng một mẩu nhãn nhỏ.

### 6. Đã dùng chung được (giữ nguyên)

| Thành phần | Vị trí | Ghi chú |
|---|---|---|
| Design token | `css/variables.css` | 58 biến: 16 `color`, 7 `text`, 7 `font`, 5 `shadow`, 4 `space`, 3 `radius`, 3 `transition`, 3 `surface`, 3 `bg`, 4 `scrollbar` — nền tốt, cần mở rộng chứ không cần làm lại |
| Reset + typography | `css/base.css` | mọi trang có CSS đều link |
| Timer | `css/timer.css` + `js/utils/timer.js` | dùng ở 8 trang |

---

## Tập component đích đề xuất

Gom 285 selector về **~14 component** đặt tên theo vai trò, không theo trang:

| Component | Thay thế cho | Biến thể |
|---|---|---|
| `c-card` | 39 selector `*card*` | `--static`, `--clickable`, `--flip` |
| `c-button` | 18 selector `*btn*` | `--primary`, `--secondary`, `--icon`, `--ghost` |
| `c-topbar` | 6 selector `*topbar*` + markup copy-paste | có/không nút back |
| `c-modal` | 2 hệ modal | — |
| `c-badge` | `.tag`, `.word-chip`, `.exam-badge`, `.ai-q-badge` | `--info`, `--success`, `--warn` |
| `c-grid` | các `*-cards`, `*-grid` rời rạc | `--2`, `--3`, `--4` cột |
| `c-progress` | thanh tiến độ rải trong inline style | — |
| `c-stat` | ô số liệu ở dashboard/skill-tracker | — |
| `c-list` | danh sách checklist (`aiChecklist`, `learnChecklist`) | — |
| `c-tabs` | tab switching ở `app.js` + các bản chép | — |
| `c-input` / `c-textarea` | ô nhập chat/quiz | — |
| `c-chat-msg` | `.chat-msg`, `.chat-bubble`, `.chat-avatar` | `--user`, `--assistant` |
| `c-page` | layout khung trang (`.page`, `.ai-page`, `.exam-page`) | — |
| `c-empty` | trạng thái rỗng (hiện đang viết inline) | — |

## Thứ tự làm đề xuất

Đây là ước lượng thô theo khối lượng đo được, chưa phải kế hoạch chốt — kế hoạch chốt nên đi qua `bmad-prd` → `bmad-architecture` → `bmad-create-epics-and-stories`.

1. **Dựng lưới an toàn trước.** Chụp ảnh màn 28 trang làm mốc so sánh, và viết test cho `js/features/**/*-logic.js` (đã là hàm thuần, test được ngay, không cần jsdom). Không có bước này thì mọi việc sau là mù — xem rủi ro R1 trong [architecture-client.md](./architecture-client.md).
2. **Sửa 3 lỗi thật trước khi refactor** (C1, C2 ở client; S1 ở server). Refactor trên nền hỏng chỉ làm khó truy nguyên.
3. **Mở rộng design token** trong `variables.css` — đây là nền đã có, rẻ nhất.
4. **Rút CSS inline** từ 22 trang về file, chưa đổi tên class. Bước cơ học, ít rủi ro, làm lộ ra mức trùng lặp thật.
5. **Dựng `c-card` + `c-button` + `c-topbar`** — ba cái này chiếm phần lớn 285 selector.
6. **Chuyển từng trang sang component mới**, mỗi trang một lần, so ảnh chụp sau mỗi bước.
7. **Thống nhất module system** — chuyển `window.*` sang ESM. Việc này độc lập với CSS và có thể làm song song.

**Không** cần framework để đạt tất cả những điều trên. `js/features/**` đã chứng minh kiến trúc sạch làm được bằng vanilla. Port sang React/Vite là một quyết định khác, chỉ nên cân nhắc sau khi có tầng component và có test.
