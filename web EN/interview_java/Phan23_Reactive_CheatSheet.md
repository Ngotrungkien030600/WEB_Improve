# 📄 PHẦN 23 — REACTIVE PROGRAMMING (WebFlux + R2DBC)

---

## 1. Reactive Programming là gì?

Lập trình **bất đồng bộ, non-blocking**, dùng stream dữ liệu với **backpressure**.

**Blocking vs Reactive:**

```java
// Blocking — thread chờ
String result = restTemplate.getForObject(url, String.class);

// Reactive — thread không block
Mono<String> result = webClient.get().uri(url).retrieve().bodyToMono(String.class);
result.subscribe(data -> System.out.println(data));
```

---

## 2. Reactive Streams Specification

| Thành phần | Vai trò |
|---|---|
| **Publisher** | Phát dữ liệu (`Mono`, `Flux`) |
| **Subscriber** | Nhận dữ liệu |
| **Subscription** | Kết nối Publisher ↔ Subscriber, hỗ trợ `request(n)` |
| **Processor** | Vừa là Publisher vừa là Subscriber |

**Backpressure:** Subscriber kiểm soát tốc độ bằng `request(n)`.

---

## 3. Mono vs Flux

| Mono<T> | Flux<T> |
|---|---|
| 0 hoặc 1 item | 0..N items |
| `Mono.just("Hello")` | `Flux.just("A", "B", "C")` |
| Dùng cho single result API | Dùng cho list, stream |

---

## 4. WebFlux — Reactive REST API

**Dependency:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

**Controller:**
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @GetMapping
    public Flux<ProductDto> getAll() {
        return productService.findAll();  // trả về Flux
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ProductDto>> getById(@PathVariable Long id) {
        return productService.findById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ProductDto> create(@RequestBody ProductDto dto) {
        return productService.create(dto);
    }
}
```

---

## 5. R2DBC — Reactive Database

**Dependency:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-r2dbc</artifactId>
</dependency>
```

**Repository:**
```java
public interface ProductRepository extends ReactiveCrudRepository<Product, Long> {
    Flux<Product> findByCategory(String category);
    Mono<Product> findByName(String name);
}
```

---

## 6. WebClient (thay thế RestTemplate)

```java
WebClient client = WebClient.create("https://api.example.com");

Mono<UserResponse> result = client.get()
    .uri("/users/{id}", userId)
    .header("Authorization", "Bearer " + token)
    .retrieve()
    .bodyToMono(UserResponse.class);
```

**RestTemplate bị deprecated từ Spring 5**, thay bằng WebClient.

---

## 7. Error Handling trong Reactive

```java
public Mono<ProductDto> findById(Long id) {
    return repository.findById(id)
        .switchIfEmpty(Mono.error(new ProductNotFoundException(id)))
        .onErrorResume(DataIntegrityViolationException.class,
            e -> Mono.error(new BadRequestException("Data integrity error")))
        .timeout(Duration.ofSeconds(5))
        .retry(3);
}
```

---

## 8. Marble Diagram (hiểu luồng)

```
Flux.fromIterable(users)
  .filter(u -> u.isActive())       // lọc
  .flatMap(u -> findOrders(u.id())) // gọi async → flatten
  .groupBy(Order::getStatus)        // nhóm
  .flatMap(group -> group.collectList()) // gom list
  .subscribe(System.out::println);
```

**Toán tử hay dùng:** `map`, `flatMap`, `filter`, `doOnNext`, `switchIfEmpty`, `timeout`, `retry`, `zip`, `merge`.

---

## 9. Threading Model

- **Event Loop:** 1 thread trên mỗi CPU core (như Node.js).
- **Scheduler:** `Schedulers.boundedElastic()` cho blocking code, `Schedulers.parallel()` cho CPU-bound.

```java
Mono.fromCallable(() -> heavyComputation())
    .subscribeOn(Schedulers.boundedElastic());
```

---

## 💬 Câu trả lời mẫu 60 giây

**Câu: Reactive Programming khác gì với blocking?**
> "Blocking: thread chờ I/O → lãng phí tài nguyên. Reactive: dùng event loop, thread không chờ — khi có data thì callback. WebFlux dùng non-blocking I/O, giúp xử lý nhiều request hơn với ít thread hơn."

**Câu: Khi nào dùng WebFlux?**
> "Khi ứng dụng có nhiều I/O (gọi API, DB) và cần scale nhiều kết nối. Ví dụ API Gateway, streaming service. Nếu ứng dụng đơn giản, CRUD ít request thì MVC vẫn ổn."

**Câu: FlatMap vs Map trong Reactor?**
> "Map biến đổi đồng bộ 1:1. FlatMap biến đổi bất đồng bộ và flatten (1:N), dùng để gọi API/DB trong stream."

---

## ✅ CHECKLIST PHẦN 23
- [ ] Giải thích Reactive Programming và Event Loop.
- [ ] Phân biệt Mono vs Flux.
- [ ] Viết Controller WebFlux cơ bản.
- [ ] Viết Repository R2DBC.
- [ ] Dùng WebClient gọi API.
- [ ] Xử lý lỗi với switchIfEmpty / onErrorResume.
- [ ] Phân biệt map vs flatMap trong Reactor.
- [ ] Biết threading model và Schedulers.
