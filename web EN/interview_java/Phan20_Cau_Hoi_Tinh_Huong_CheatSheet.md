# 📄 PHẦN 20 — CÂU HỎI TÌNH HUỐNG 

---

## 1. API chậm — debug thế nào?

1. Kiểm tra log và metric (CloudWatch, Prometheus).
2. Xác định bottleneck: DB, network, external API.
3. Dùng APM (New Relic, Datadog) hoặc log thờ gian xử lý.
4. Kiểm tra N+1 query, thiếu index.
5. Kiểm tra external API timeout.
6. Scale hoặc cache nếu cần.

---

## 2. Production bug — xử lý thế nào?

1. Không panic, reproduce lỗi ở local/staging.
2. Rollback nếu lỗi nghiêm trọng.
3. Tìm root cause qua log, trace.
4. Fix và test kỹ.
5. Deploy lại, monitor.
6. Viết post-mortem.

---

## 3. Xung đột code khi merge

1. Hiểu rõ thay đổi của 2 branch.
2. Thảo luận với teammate nếu cùng sửa 1 chỗ.
3. Resolve conflict, giữ logic đúng.
4. Build và test lại.
5. Merge.

---

## 4. Làm việc với requirement không rõ

1. Hỏi lại để làm rõ.
2. Xác nhận scope và acceptance criteria.
3. Làm prototype nếu cần.
4. Báo cáo tiến độ thường xuyên.

---

## 5. Deadlock trong database

1. Phát hiện qua log.
2. Đảm bảo thứ tự lock nhất quán.
3. Giảm thờ gian transaction.
4. Dùng retry với exponential backoff.

---

## 6. Memory leak

1. Monitor heap memory.
2. Dump heap (`jmap -dump`).
3. Phân tích bằng Eclipse MAT.
4. Tìm object không được giải phóng.
5. Fix: đóng resource, xóa reference, dùng weak reference.

---

## 7. Conflict với đồng nghiệp

1. Lắng nghe quan điểm đối phương.
2. Trình bày lập trường dựa trên dữ liệu.
3. Tìm giải pháp win-win.
4. Nếu không thống nhất, nhờ lead/team quyết định.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: API chậm, bạn xử lý thế nào?**
> "Đầu tiên em kiểm tra log và metric để xác định bottleneck. Nếu là DB thì kiểm tra query, index, N+1. Nếu là external API thì kiểm tra timeout và circuit breaker. Nếu cần thì thêm cache hoặc scale. Cuối cùng verify hiệu năng sau fix."

**Câu: Production có bug nghiêm trọng?**
> "Em sẽ rollback nếu cần để giảm ảnh hưởng. Sau đó reproduce ở local, phân tích log để tìm root cause, fix và test kỹ, deploy lại và monitor. Cuối cùng viết post-mortem để rút kinh nghiệm."

---

## ✅ CHECKLIST PHẦN 20

- [ ] Biết cách debug API chậm.
- [ ] Biết cách xử lý production bug.
- [ ] Biết cách resolve merge conflict.
- [ ] Biết xử lý requirement mơ hồ.
- [ ] Biết cách xử lý deadlock.
- [ ] Biết cách phân tích memory leak.
- [ ] Biết cách xử lý conflict trong team.
