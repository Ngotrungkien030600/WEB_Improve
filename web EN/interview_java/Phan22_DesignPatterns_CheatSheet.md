# 📄 PHẦN 22 — DESIGN PATTERNS NÂNG CAO

---

## 1. Singleton (Đảm bảo duy nhất 1 instance)

```java
public enum Singleton {
    INSTANCE;
    public void doSomething() { ... }
}
```

**Thread-safe ngay từ đầu**, không reflection attack được.

---

## 2. Factory Method vs Abstract Factory

| Factory Method | Abstract Factory |
|---|---|
| 1 method tạo 1 loại object | 1 factory tạo family object |
| Subclass quyết định concrete class | Factory interface có nhiều implementation |
| `Document createDocument()` | `GuiFactory.createButton(), createCheckbox()` |

**Ví dụ Spring:** `BeanFactory` là Abstract Factory, mỗi `@Bean` method là Factory Method.

---

## 3. Builder Pattern

Dùng khi object có nhiều optional field, cần immutable.

```java
User user = User.builder()
    .name("John")
    .age(30)
    .email("john@email.com")
    .build();
```

**Lombok:** `@Builder` tự sinh Builder class.

---

## 4. Strategy Pattern

Cho phép thay đổi thuật toán tại runtime. Tuân thủ Open/Closed.

```java
public interface PaymentStrategy {
    void pay(BigDecimal amount);
}

@Service
public class CreditCardPayment implements PaymentStrategy { ... }
@Service
public class PayPalPayment implements PaymentStrategy { ... }
```

---

## 5. Observer Pattern (Event-Driven)

Khi 1 object thay đổi state → notify tất cả observer.

**Spring:** `@EventListener`, `ApplicationEventPublisher`.

```java
@Component
public class OrderCreatedListener {
    @EventListener
    public void handle(OrderCreatedEvent event) { ... }
}
```

---

## 6. Decorator Pattern

Wrapper linh hoạt — thêm behavior mà không sửa class gốc.

**Java I/O:** `BufferedReader br = new BufferedReader(new FileReader("file.txt"));`

---

## 7. Proxy Pattern

Object đại diện kiểm soát truy cập đến object thật.

```java
@Entity
public class Product {
    @ManyToOne(fetch = FetchType.LAZY)
    private Category category; // Hibernate proxy
}
```

**Spring AOP:** `@Transactional` tạo proxy tự động.

---

## 8. Template Method Pattern

Định nghĩa khung thuật toán, để subclass implement chi tiết.

```java
public abstract class DataProcessor {
    public final void process() {
        read();
        processData();
        save();
    }
    protected abstract void read();
    protected abstract void processData();
    protected abstract void save();
}
```

**Spring:** `JdbcTemplate`, `RestTemplate`, `JpaRepository<T, ID>`.

---

## 9. Dependency Injection & IoC

**IoC (Inversion of Control):** Thay vì tự tạo object, DI container làm việc đó.

**Spring DI:** Constructor Injection được khuyến nghị.

```java
@Service
public class OrderService {
    private final OrderRepository repo;

    public OrderService(OrderRepository repo) { // Spring tự inject
        this.repo = repo;
    }
}
```

---

## 10. SOLID Principles

| Principle | Ý nghĩa | Ví dụ vi phạm |
|---|---|---|
| **S**RP — 1 class 1 lý do thay đổi | `UserService` không nên gửi email | Tách `EmailService` |
| **O**CP — Mở rộng, đóng sửa | Thêm strategy, không sửa controller | Dùng interface |
| **L**SP — Subclass thay được cha | `Square extends Rectangle` → sai | Dùng interface chung |
| **I**SP — Nhiều interface nhỏ | `Worker { eat(), work() }` tách thành 2 | `Eatable`, `Workable` |
| **D**IP — Phụ thuộc abstraction | `Service` phụ thuộc `Repository` interface | Không phụ thuộc `JdbcRepositoryImpl` |

---

## 💬 Câu trả lời mẫu 60 giây

**Câu: Singleton pattern và thread-safety?**
> "Cách an toàn nhất là dùng enum Singleton của Java. Hoặc dùng static inner class — JVM tự đảm bảo thread-safety khi load class. Không dùng double-checked locking trừ khi thực sự cần."

**Câu: Khi nào dùng Strategy vs Decorator?**
> "Strategy dùng khi muốn thay đổi thuật toán (cách làm). Decorator dùng khi muốn thêm behavior cho object (wrap thêm). Strategy = interchangeable algorithm, Decorator = dynamic wrapper."

**Câu: DI/IoC giúp gì?**
> "Giảm coupling, dễ test (mock), dễ thay đổi implementation. Spring quản lý lifecycle của bean."

---

## ✅ CHECKLIST PHẦN 22
- [ ] Viết Singleton thread-safe với enum.
- [ ] Phân biệt Factory Method vs Abstract Factory.
- [ ] Dùng Builder cho object nhiều field.
- [ ] Implement Strategy Pattern.
- [ ] Dùng @EventListener cho event-driven.
- [ ] Giải thích Proxy Pattern trong Hibernate/Spring AOP.
- [ ] Giải thích Template Method với Spring template classes.
- [ ] Trình bày SOLID và ví dụ từng principle.
- [ ] Giải thích IoC và Constructor Injection.
