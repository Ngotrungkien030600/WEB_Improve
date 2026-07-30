# 📄 PHẦN 11 — TRANSACTION 

---

## 1. @Transactional

Đánh dấu method/class để Spring quản lý transaction. Tự động `begin`, `commit`, hoặc `rollback` khi có RuntimeException.

```java
@Service
public class OrderService {

    @Transactional
    public void createOrder(OrderRequest request) {
        // nếu có RuntimeException ở đây, toàn bộ sẽ rollback
        orderRepo.save(order);
        paymentService.charge(order);
    }
}
```

---

## 2. Propagation

| Propagation | Ý nghĩa |
|---|---|
| `REQUIRED` (mặc định) | Dùng transaction hiện tại nếu có, nếu không tạo mới |
| `REQUIRES_NEW` | Luôn tạo transaction mới, suspend transaction cũ |
| `SUPPORTS` | Dùng transaction nếu có, không bắt buộc |
| `MANDATORY` | Bắt buộc phải có transaction cha, nếu không lỗi |
| `NEVER` | Không được có transaction |
| `NOT_SUPPORTED` | Chạy không transaction, suspend transaction cha |
| `NESTED` | Transaction lồng (savepoint) |

**Ví dụ:**
```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void logAudit(Audit audit) {
    auditRepo.save(audit);  // luôn lưu dù method cha lỗi
}
```

---

## 3. Isolation

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
```

> Xem chi tiết ở PHẦN 6 — SQL & Database.

---

## 4. Rollback Behavior

- Mặc định rollback khi **RuntimeException** hoặc **Error**.
- **Không rollback** với **Checked Exception**.
- Có thể tùy chỉnh:
```java
@Transactional(rollbackFor = SQLException.class,
               noRollbackFor = IllegalStateException.class)
```

---

## 5. @Transactional trong class vs method

- Đặt trên class → áp dụng cho tất cả public methods.
- Đặt trên method → ghi đè class-level.

---

## 6. Lưu ý quan trọng

- `@Transactional` chỉ hoạt động khi method được gọi **từ bên ngoài class** (proxy).
- Gọi method có `@Transactional` từ chính trong class → không có hiệu lực.

**Ví dụ lỗi:**
```java
@Service
public class OrderService {
    public void process() {
        createOrder();  // ❌ @Transactional không hoạt động do self-invocation
    }

    @Transactional
    public void createOrder() { ... }
}
```

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: @Transactional propagation?**
> "REQUIRED là mặc định, dùng transaction hiện có hoặc tạo mới. REQUIRES_NEW luôn tạo transaction mới, rất hữu ích cho audit log hoặc notification vì dù method cha lỗi thì dữ liệu vẫn được lưu."

**Câu: Tại sao @Transactional không hoạt động khi gọi từ chính class?**
> "Vì Spring dùng proxy để wrap bean. Khi gọi từ bên ngoài, proxy mới can thiệp và mở transaction. Khi gọi từ bên trong class, proxy không bắt được, nên @Transactional bị bỏ qua."

---

## ✅ CHECKLIST PHẦN 11

- [ ] Biết cách dùng @Transactional.
- [ ] Phân biệt các propagation (REQUIRED, REQUIRES_NEW).
- [ ] Biết isolation level.
- [ ] Biết rollback mặc định và cách tùy chỉnh.
- [ ] Biết self-invocation problem.
- [ ] Biết khi nào dùng REQUIRES_NEW cho audit/log.
