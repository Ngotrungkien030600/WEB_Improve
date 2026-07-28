# 📄 PHẦN 18 — SYSTEM DESIGN 

---

## 1. Non-functional Requirements

| Yêu cầu | Ý nghĩa |
|---|---|
| **Scalability** | Khả năng mở rộng khi tải tăng |
| **Availability** | Hệ thống uptime cao |
| **Reliability** | Hoạt động đúng, ít lỗi |
| **Latency** | Thờ gian phản hồi thấp |
| **Consistency** | Dữ liệu đồng nhất |
| **Maintainability** | Dễ bảo trì, mở rộng |

---

## 2. Scale

- **Vertical scale:** Nâng cấp CPU/RAM máy chủ.
- **Horizontal scale:** Thêm nhiều máy chủ, dùng load balancer.

> Horizontal scale phổ biến hơn vì linh hoạt và rẻ hơn.

---

## 3. Load Balancer

Phân phối request đến nhiều server.

- **L4 (Transport):** dựa trên IP/port.
- **L7 (Application):** dựa trên URL, header, cookie.

Công cụ: NGINX, HAProxy, AWS ALB.

---

## 4. Caching

Lưu dữ liệu hot để giảm tải DB.

| Cache | Use case |
|---|---|
| **Redis** | Distributed cache, session, rate limit |
| **CDN** | Static assets, media |
| **Application cache** | Local cache (Caffeine, Guava) |

> Cache Aside: app đọc cache trước, nếu miss thì đọc DB và ghi lại cache.

---

## 5. Database Scaling

- **Read replica:** nhiều DB slave để đọc.
- **Sharding:** chia dữ liệu theo key (ví dụ user_id).
- **Partitioning:** chia bảng theo range/hash.

---

## 6. CAP Theorem

Hệ thống phân tán chỉ có thể đảm bảo 2 trong 3:

| C | Consistency | Dữ liệu đồng nhất mọi node |
| A | Availability | Luôn phản hồi |
| P | Partition Tolerance | Chịu được mất kết nối giữa các node |

> Trong thực tế thường chọn CP hoặc AP.

---

## 7. Rate Limiting

Giới hạn số request từ một client trong khoảng thờ gian.

- **Fixed window:** dễ nhưng có burst ở boundary.
- **Sliding window:** chính xác hơn.
- **Token bucket / Leaky bucket:** linh hoạt.

---

## 8. Design URL Shortener / Rate Limiter

**URL Shortener:**
```
POST /shorten {url} → {shortCode}
GET /{shortCode} → redirect
```
- Hash original URL → base62.
- Lưu mapping DB.
- Cache popular URLs.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Làm sao scale hệ thống?**
> "Đầu tiên dùng load balancer phân phối request đến nhiều app server. Thêm caching Redis cho dữ liệu hot. Dùng read replica cho database để giảm tải đọc. Nếu cần, sharding database theo user_id. Cuối cùng theo dõi metric qua monitoring."

---

## ✅ CHECKLIST PHẦN 18

- [ ] Biết các non-functional requirements.
- [ ] Phân biệt vertical vs horizontal scale.
- [ ] Giải thích load balancer.
- [ ] Biết caching strategies.
- [ ] Biết database scaling.
- [ ] Giải thích CAP theorem.
- [ ] Biết rate limiting.
- [ ] Thiết kế đượ1 hệ thống đơn giản (URL shortener).
