# 📄 PHẦN 14 — KAFKA 

---

## 1. Kafka là gì?

Hệ thống **message broker phân tán**, dùng để streaming dữ liệu real-time theo mô hình publish-subscribe.

---

## 2. Core Concepts

| Khái niệm | Ý nghĩa |
|---|---|
| **Producer** | Gửi message |
| **Consumer** | Nhận message |
| **Broker** | Server Kafka lưu và phân phối message |
| **Topic** | Kênh phân loại message |
| **Partition** | Phân đoạn trong topic, cho phép parallel |
| **Offset** | Vị trí message trong partition |
| **Consumer Group** | Nhóm consumer chia sẻ load |

---

## 3. Producer & Consumer (Spring Kafka)

**Dependency:**
```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

**Producer:**
```java
@Service
public class KafkaProducer {
    @Autowired private KafkaTemplate<String, String> kafkaTemplate;

    public void send(String topic, String message) {
        kafkaTemplate.send(topic, message);
    }
}
```

**Consumer:**
```java
@Component
public class KafkaConsumer {
    @KafkaListener(topics = "orders", groupId = "order-group")
    public void listen(String message) {
        System.out.println("Received: " + message);
    }
}
```

---

## 4. Khi nào dùng Kafka?

- Xử lý event-driven.
- Giải coupling giữa các service.
- Log aggregation.
- Real-time analytics.
- Buffer khi traffic cao.

---

## 5. At-least-once vs At-most-once vs Exactly-once

| Semantics | Mô tả |
|---|---|
| At-most-once | Có thể mất message |
| At-least-once | Có thể trùng, nhưng không mất |
| Exactly-once | Không mất, không trùng (khó, cần idempotency) |

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Kafka dùng để làm gì?**
> "Kafka là message broker phân tán, giúp các service giao tiếp bất đồng bộ qua topic. Ví dụ service Order gửi event order-created, các service Inventory, Notification subscribe để xử lý. Giúp giảm coupling và chịu tải cao."

---

## ✅ CHECKLIST PHẦN 14

- [ ] Giải thích Kafka là gì.
- [ ] Biết Producer, Consumer, Topic, Partition, Offset, Consumer Group.
- [ ] Viết Producer & Consumer cơ bản với Spring Kafka.
- [ ] Biết use case của Kafka.
- [ ] Phân biệt delivery semantics.
