# 📄 PHẦN 19 — PROJECT MẪU 

---

## 1. Mô tả project

**Hệ thống quản lý đơn hàng (Order Management System):**
- User đăng ký/đăng nhập (JWT).
- Tạo đơn hàng, xem lịch sử.
- Admin quản lý sản phẩm, đơn hàng.
- Thông báo qua Kafka khi đơn hàng mới tạo.
- Deploy bằng Docker + CI/CD.

---

## 2. Tech Stack

| Tầng | Công nghệ |
|---|---|
| Backend | Java 17, Spring Boot |
| Database | PostgreSQL |
| Cache | Redis |
| Message Broker | Kafka |
| Auth | JWT, Spring Security |
| Build | Maven |
| Container | Docker, Docker Compose |
| Cloud | AWS EC2/ECS, RDS, S3, SQS |
| CI/CD | GitHub Actions |

---

## 3. Cấu trúc project

```
order-service/
├── src/main/java/com/example/order/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── mapper/
│   ├── config/
│   ├── exception/
│   └── security/
├── src/main/resources/
│   └── application.yml
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## 4. Tính năng nổi bật để nói trong phỏng vấn

- Phân quyền ROLE_USER / ROLE_ADMIN.
- Validation input với Jakarta Validation.
- Xử lý exception chung bằng `@RestControllerAdvice`.
- Gửi event `OrderCreated` lên Kafka.
- Consumer gửi email thông báo.
- Cache danh sách sản phẩm với Redis.
- Unit test repository, service với JUnit + Mockito.

---

## 5. Cách trình bày project

1. **Mục đích:** Hệ thống quản lý đơn hàng.
2. **Tech stack:** Java, Spring Boot, PostgreSQL, Redis, Kafka.
3. **Vai trò:** Backend developer.
4. **Tính năng chính:** CRUD, auth, async notification, caching.
5. **Thách thức:** N+1 query, concurrency, idempotency.
6. **Kết quả:** Hệ thống chạy ổn định, dễ mở rộng.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Giới thiệu project của bạn?**
> "Em làm hệ thống quản lý đơn hàng bằng Spring Boot. User đăng nhập bằng JWT, tạo đơn hàng. Khi đơn hàng được tạo, service gửi event lên Kafka, notification service nhận và gửi email. Dùng Redis cache sản phẩm, PostgreSQL làm chính, Docker để triển khai. Em viết unit test cho service và repository."

---

## ✅ CHECKLIST PHẦN 19

- [ ] Chuẩn bị mô tả project rõ ràng.
- [ ] Liệt kê tech stack hợp lý.
- [ ] Trình bày vai trò cá nhân.
- [ ] Nêu tính năng nổi bật.
- [ ] Chuẩn bị câu trả lởi ngắn gọn 60 giây.
