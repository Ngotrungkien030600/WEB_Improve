# 📄 PHẦN 17 — MICROSERVICES 

---

## 1. Microservices là gì?

Kiến trúc chia ứng dụng thành nhiều service nhỏ, độc lập, mỗi service đảm nhận một business capability.

---

## 2. Monolith vs Microservices

| Monolith | Microservices |
|---|---|
| Một codebase duy nhất | Nhiều service độc lập |
| Deploy toàn bộ cùng lúc | Deploy từng service |
| Scale cả app | Scale từng phần |
| Đơn giản khi nhỏ | Phức tạp hơn, cần quản lý nhiều service |

---

## 3. Giao tiếp giữa các service

- **Synchronous:** REST, gRPC.
- **Asynchronous:** Message queue (Kafka, RabbitMQ, SQS).

> Ưu tiên async để giảm coupling và tăng khả năng chịu lỗi.

---

## 4. Service Discovery

Các service cần tìm địa chỉ nhau động.

- **Netflix Eureka**
- **Consul**
- **Kubernetes DNS/Service**

---

## 5. API Gateway

- Điểm vào duy nhất cho client.
- Xử lý authentication, rate limiting, routing, load balancing.
- Công cụ: Spring Cloud Gateway, Kong, AWS API Gateway, NGINX.

---

## 6. Resilience Patterns

| Pattern | Mục đích |
|---|---|
| **Circuit Breaker** | Ngắt kết nối khi service xuống, tránh cascade failure |
| **Retry** | Thử lại khi lỗi tạm thờ |
| **Timeout** | Giới hạn thờ gian chờ |
| **Fallback** | Trả về giá trị dự phòng |
| **Bulkhead** | Giới hạn tài nguyên cho từng service |
| **Rate Limiter** | Giới hạn số request |

**Resilience4j:**
```java
@CircuitBreaker(name = "orderService", fallbackMethod = "fallback")
public Order getOrder(Long id) { ... }

public Order fallback(Long id, Exception ex) {
    return Order.empty();
}
```

---

## 7. Distributed Tracing

Theo dõi request đi qua nhiều service.

- **Sleuth + Zipkin**
- **OpenTelemetry + Jaeger**

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Ưu nhược điểm Microservices?**
> "Microservices giúp scale từng phần, deploy độc lập, team tự chủ. Nhược điểm là phức tạp: cần quản lý giao tiếp, transaction phân tán, logging, monitoring, service discovery."

**Câu: Circuit Breaker là gì?**
> "Khi service gọi service khác liên tục lỗi, circuit breaker chuyển sang trạng thái OPEN để không gọi nữa, tránh cascade failure. Sau một thờ gian thử HALF-OPEN, nếu OK thì CLOSE lại."

---

## ✅ CHECKLIST PHẦN 17

- [ ] Giải thích Microservices.
- [ ] Phân biệt Monolith vs Microservices.
- [ ] Biết cách service giao tiếp sync/async.
- [ ] Biết Service Discovery.
- [ ] Biết API Gateway.
- [ ] Biết Resilience Patterns: Circuit Breaker, Retry, Fallback.
- [ ] Biết Distributed Tracing.
