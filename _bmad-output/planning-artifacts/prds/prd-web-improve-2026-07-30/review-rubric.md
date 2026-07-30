# PRD Quality Review — Port SkillForge sang Vue 3 + Vite

Chạy tại mức độ **cá nhân / học tập**, PRD dạng **brownfield / chain-top** (feed vào `bmad-architecture` → epics → stories). Rubric walker chạy trực tiếp trong parent (không có reviewer nào khai trong `finalize_reviewers`, và Discovery đã ghi override bỏ subagent).

## Overall verdict

PRD có thesis rõ và trung thực về đánh đổi: nó bán "tầng component" chứ không bán "dùng framework cho hiện đại", và counter-metric SM-C1 chặn đúng cái bẫy đua số trang. Chỗ yếu thật nằm ở **done-ness**: hai chỗ nghiệm thu bằng mắt và bằng cảm nhận, đúng loại ngôn ngữ mà story creation sẽ vấp. Ngoài ra Assumptions Index không khớp ngược với tag inline.

## Decision-readiness — strong

Quyết định được phát ngôn là quyết định, không núp dưới "cân nhắc": Vue chốt kèm bảng số đo chi phí port, và addendum §A ghi thẳng cái bị bỏ ("React mạnh hơn về hệ sinh thái và giá trị tuyển dụng — người xây đã cân và chọn chi phí port thấp"). Đó là đánh đổi có tên, không phải lời khen cả hai bên.

Bốn Open Questions đều mở thật — không câu nào có câu trả lời nằm ở câu sau. OQ#4 ("bản Legacy sống song song bao lâu là chấp nhận được") là câu khó chịu đúng chỗ, vì nó chất vấn chính chiến lược mà PRD đã chọn.

`[NOTE FOR PM]` đặt ở ba điểm căng thật: cách nối hai app khi deploy, S2 vô hại chỉ vì localhost, và không-có-test.

### Findings
Không có.

## Substance over theater — strong

Không có persona theater: một protagonist duy nhất (Giang), vì đây đúng là app một người dùng. Không có innovation theater — PRD không hề tuyên bố mới lạ.

NFR không bị bơm boilerplate — chỉ có một NFR đặc thù tính năng, và nó lại chính là chỗ yếu (xem dim 4). Vision không thể tráo sang PRD khác: nó nêu số cụ thể của chính codebase này (121 chỗ `class="card"`, 39 selector, 22 trang CSS inline).

### Findings
- **low** JTBD thứ tư có thể là mong muốn hơn là job (§2.1) — "có thứ đem đi phỏng vấn nói được" là thật với người xây, nhưng nó không lái quyết định nào trong PRD. *Fix:* giữ, nhưng biết rằng nếu mục tiêu portfolio lên hàng đầu thì test phải vào MVP (§6.2 đã ghi nhận tình huống đó) — tức là JTBD này có ngòi nổ, không phải trang trí.

## Strategic coherence — strong

Thesis phát ngôn được trong một câu: đổi lấy tầng component + hệ module tường minh + khuôn thêm trang rẻ. Bốn feature xếp đúng theo thesis — nền, rồi component (thứ trả giá trị lớn nhất), rồi trang mẫu để chứng minh, rồi vá lỗ trên bản còn chạy. Không có feature nào lọt vào vì "làm luôn cho tiện".

SM đo đúng thesis chứ không đo hoạt động: SM-1 đo *chi phí thêm một trang*, không đo số trang. SM-C1 nêu thẳng cách gian lận chỉ số và nói đừng.

MVP scope kind = problem-solving, và logic scope khớp: chứng minh khuôn trên 3–4 trang trước khi lặp ra 24 trang.

### Findings
Không có.

## Done-ness clarity — thin

Đây là chiều yếu nhất và đúng chỗ story creation sẽ dựa vào nhiều nhất.

FR-6 nghiệm thu bằng "khớp bản Legacy khi đặt cạnh nhau" — tức bằng mắt. Ở mức độ cá nhân thì chấp nhận được, nhưng phải nói rõ *ai* so, so *cái gì*, chứ không để mở. NFR của §4.3 tệ hơn: "không chậm hơn cảm nhận" là đúng loại tính từ mà rubric bảo phải gắn cờ mọi lần gặp.

Phần còn lại thì tốt: FR-8 có ngưỡng số thật (`GET /.env` → 404, kèm hiện trạng 200/192 byte để đối chứng), FR-1/FR-2/FR-3 đều có điều kiện kiểm được bằng lệnh.

### Findings
- **high** Nghiệm thu bằng mắt không có danh mục (§4.3 FR-6) — "khớp bản Legacy khi đặt cạnh nhau" không nói so cái gì, nên hai lần so hai kết quả. *Fix:* nêu danh mục hữu hạn cần so (bố cục, màu, khoảng cách, chữ, trạng thái hover) và ghi rõ đây là kiểm thủ công có chủ ý vì chưa có test.
- **high** NFR bằng tính từ (§4.3) — "không chậm hơn cảm nhận" không kiểm được. *Fix:* đổi thành ngưỡng thô kiểm được, hoặc bỏ hẳn NFR này vì ở mức độ cá nhân nó không mua thêm gì.
- **medium** FR-7 thiếu điều kiện kiểm cho mệnh đề then chốt — "sửa ở một bản dùng chung cho cả hai app" là ràng buộc mạnh nhất của FR nhưng không có consequence nào chứng minh được nó. *Fix:* thêm điều kiện kiểm dạng "không tồn tại hai file logic cùng tên ở hai app".

## Scope honesty — strong

Non-Goals làm việc thật, không phải danh sách lịch sự: nó chặn cả bốn hướng trôi có thật ở đúng dự án này — mượn thư viện component, nhân dịp làm đẹp, TypeScript, xoá Legacy sớm. Câu "bất kỳ ý muốn *nhân lúc port thì làm đẹp luôn* đều thuộc đợt sau — trộn vào đây là mất khả năng so sánh trước/sau" nêu được *lý do* chứ không chỉ nêu lệnh.

Mật độ open-items: 4 Open Questions + 4 assumption + 3 `[NOTE FOR PM]` trên một PRD mức cá nhân — hợp lý, không phải blocker.

### Findings
- **low** §6.2 dồn hai loại vào một chỗ — "24 trang còn lại" là hoãn theo trình tự, còn "test tự động" là hoãn theo đánh đổi rủi ro. Đọc lướt dễ tưởng cùng loại. *Fix:* không bắt buộc ở mức độ này.

## Downstream usability — adequate

Glossary có 7 danh từ và dùng nhất quán — "Legacy app", "Vue app", "đã chuyển" không bị trôi sang từ đồng nghĩa ở bất kỳ đâu. ID liên tục và không trùng: FR-1→FR-9, UJ-1→UJ-3, SM-1→SM-3 + SM-C1. Mọi cross-reference `Realizes UJ-x` đều giải được.

Ba câu hỏi dành riêng cho `bmad-architecture` được nêu tường minh (OQ#2 nơi đặt logic dùng chung, OQ#3 trang nội dung nặng, addendum §F ba nơi lưu chồng lấn) — đó là bàn giao sạch.

### Findings
- **medium** "hub" là danh từ miền chưa vào Glossary (§6.1, §4.3) — PRD dùng "một hub" như thể người đọc đã biết, trong khi Glossary định nghĩa 7 thuật ngữ khác. Downstream sẽ phải đoán "hub" là dạng trang gì. *Fix:* thêm vào Glossary.

## Shape fit — adequate

Hình dạng khớp: hobby/solo → rigor nhẹ, độ dài ~2 trang, SM một câu mỗi cái. Brownfield → tham chiếu code hiện có chính xác và có số đo thật, hai lỗi được nêu kèm bằng chứng chạy thật chứ không kèm phỏng đoán.

Điểm cần cân: ba UJ cho một app một-người-dùng là hơi nhiều theo rubric (single-operator tool thường không cần UJ). Nhưng ba UJ này làm việc thật — UJ-1 định nghĩa "port thành công là không ai nhận ra", UJ-2 và UJ-3 lần lượt là nguồn của SM-1 và FR-4. Không phải overhead.

### Findings
Không có.

## Mechanical notes

- **Assumptions Index không khớp ngược.** §9 liệt kê 4 assumption, nhưng tag `[ASSUMPTION]` inline chỉ tồn tại ở §4.2. Ba entry của §4.3 và §1 được index mà không có tag inline tương ứng. Roundtrip vỡ — cần thêm tag inline hoặc ghi rõ trong index rằng đó là assumption ở tầng tài liệu.
- **Lỗi chính tả xuyên tài liệu:** cụm "Mức đóc" (§0, §6.2, §7 và addendum) phải là "Mức độ". Xuất phát từ lỗi đánh máy trong câu hỏi Discovery của tôi, đã chảy vào tài liệu. **Đã vá.**
- ID continuity: sạch. Không gap, không trùng.
- UJ protagonist: cả ba đều có tên và mang ngữ cảnh inline.
- Section bắt buộc cho mức độ này: đủ. Không có section nào bị nhồi cho đẹp.
