# 📄 PHẦN 21 — 100+ CÂU HỎI TỰ KIỂM TRA (CÓ ĐÁP ÁN)

---

## PHẦN 1 — Java Core

**1. Sự khác nhau giữa `==` và `.equals()`?**
> `==` so sánh reference (địa chỉ bộ nhớ) hoặc giá trị primitive. `.equals()` so sánh nội dung object, có thể override.

**2. `String` là immutable hay mutable? Tại sao?**
> Immutable. Giúp thread-safe, tiết kiệm bộ nhớ nhờ string pool, và an toàn khi dùng làm key trong HashMap.

**3. `StringBuilder` vs `StringBuffer`?**
> `StringBuilder` nhanh hơn nhưng không thread-safe. `StringBuffer` thread-safe nhờ `synchronized` nhưng chậm hơn.

**4. `final`, `finally`, `finalize` khác nhau thế nào?**
> `final`: keyword khai báo hằng, class/method không override. `finally`: khối luôn chạy sau try-catch. `finalize()`: method GC gọi trước khi thu hồi object.

**5. `static` method có thể override không? Tại sao?**
> Không. Static thuộc về class, không phải instance. Có thể "hide" bằng static method cùng tên ở subclass.

**6. `abstract class` vs `interface`?**
> Abstract class có constructor, state, method cụ thể. Interface (Java 8+) có default/static methods. Class extends abstract class, implements interface.

**7. `HashMap` hoạt động như thế nào?**
> Lưu entry dưới dạng key-value bucket dựa trên hashCode. Khi hash collision dùng linked list hoặc cây đỏ-đen (từ Java 8).

**8. `ArrayList` vs `LinkedList`?**
> `ArrayList`: truy cập index nhanh O(1), chèn/xóa chậm O(n). `LinkedList`: chèn/xóa nhanh O(1), truy cập chậm O(n).

**9. `Comparable` vs `Comparator`?**
> `Comparable` dùng để sắp xếp natural order trong class (`compareTo`). `Comparator` dùng để định nghĩa nhiều cách sắp xếp bên ngoài.

**10. `Iterator` vs `ListIterator`?**
> `Iterator` duyệt 1 chiều, remove. `ListIterator` duyệt 2 chiều, add/set, chỉ dùng cho List.

**11. Sự khác nhau giữa `throw` và `throws`?**
> `throw` ném exception. `throws` khai báo exception method có thể ném.

**12. `checked exception` vs `unchecked exception`?**
> Checked: extends Exception, bắt buộc handle hoặc throws. Unchecked: extends RuntimeException, không bắt buộc.

**13. `try-with-resources` dùng để làm gì?**
> Tự động đóng resource (Closeable/AutoCloseable) sau khối try, tránh leak.

**14. `Serializable` là gì?**
> Interface đánh dấu object có thể serialize (chuyển object thành byte stream) để lưu trữ hoặc truyền tải.

**15. `volatile` keyword có tác dụng gì?**
> Đảm bảo biến luôn đọc từ main memory, không dùng CPU cache. Không đảm bảo atomicity.

---

## PHẦN 2 — Java 8+

**16. Lambda expression là gì?**
> Cách viết anonymous function ngắn gọn, dùng với functional interface. Ví dụ: `list.forEach(x -> System.out.println(x))`.

**17. Functional interface là gì? Cho ví dụ.**
> Interface chỉ có 1 abstract method. Ví dụ: `Runnable`, `Callable`, `Comparator`, `Predicate`, `Function`, `Consumer`, `Supplier`.

**18. `Stream API` dùng để làm gì?**
> Xử lý collection theo hướng functional, hỗ trợ filter, map, reduce, collect, lazy evaluation.

**19. `map()` vs `flatMap()`?**
> `map()` biến đổi mỗi phần tử thành 1 giá trị. `flatMap()` biến đổi mỗi phần tử thành stream và "làm phẳng" thành 1 stream.

**20. `filter()`, `reduce()`, `collect()` dùng khi nào?**
> `filter()`: lọc phần tử. `reduce()`: gộp thành 1 giá trị. `collect()`: gom kết quả vào collection.

**21. `Optional` dùng để giải quyết vấn đề gì?**
> Tránh NullPointerException, buộc xử lý trường hợp value absent một cách rõ ràng.

**22. Method reference có mấy loại?**
> 4 loại: static (`Class::method`), instance of object (`obj::method`), instance of class (`Class::method`), constructor (`Class::new`).

**23. `default method` trong interface là gì?**
> Method có implementation trong interface, cho phép mở rộng interface mà không break class đã implement.

**24. `CompletableFuture` dùng để làm gì?**
> Xử lý async programming, kết hợp nhiều future, xử lý callback mà không block thread.

**25. `Record` trong Java 14+ là gì?**
> Class immutable tự động sinh constructor, getter, equals, hashCode, toString. Dùng cho data carrier.

---

## PHẦN 3 — OOP & Design Patterns

**26. 4 tính chất của OOP?**
> Encapsulation, Inheritance, Polymorphism, Abstraction.

**27. SOLID principles là gì?**
> S: Single Responsibility — 1 class 1 nhiệm vụ.
> O: Open/Closed — mở rộng, đóng sửa đổi.
> L: Liskov Substitution — subclass thay thế được base class.
> I: Interface Segregation — interface nhỏ, chuyên biệt.
> D: Dependency Inversion — phụ thuộc abstraction.

**28. Dependency Injection là gì?**
> Cung cấp dependency từ bên ngoài thay vì class tự tạo. Giúp loose coupling, dễ test.

**29. Singleton pattern là gì? Cách triển khai thread-safe?**
> Chỉ tạo 1 instance. Thread-safe bằng `enum`, hoặc `synchronized`, hoặc Bill Pugh Singleton (static inner class).

**30. Factory pattern dùng khi nào?**
> Khi cần tạo object mà không expose logic khởi tạo, hoặc tạo object dựa trên điều kiện runtime.

**31. Strategy pattern là gì?**
> Định nghĩa họ thuật toán, cho phép hoán đổi linh hoạt runtime.

**32. Observer pattern là gì?**
> Một subject thông báo đến nhiều observer khi có thay đổi trạng thái.

**33. Builder pattern dùng khi nào?**
> Khi object có nhiều thuộc tính, constructor quá dài, hoặc có tùy chọn optional.

**34. Repository pattern là gì?**
> Tầng trung gian giữa business logic và data access, ẩn chi tiết persistence.

**35. MVC vs layered architecture?**
> MVC chia thành Model-View-Controller. Layered architecture chia theo tầng: presentation, business, data access.

---

## PHẦN 4 — Multithreading

**36. `Process` vs `Thread`?**
> Process là chương trình độc lập có bộ nhớ riêng. Thread là đơn vị thực thi trong process, chia sẻ bộ nhớ.

**37. `Runnable` vs `Callable`?**
> `Runnable` không trả về kết quả, không throw checked exception. `Callable` trả về kết quả và có thể throw exception.

**38. `synchronized` keyword hoạt động thế nào?**
> Khóa monitor của object/class, chỉ cho phép 1 thread vào critical section.

**39. `ReentrantLock` khác gì `synchronized`?**
> ReentrantLock linh hoạt hơn: tryLock, lockInterruptibly, fair lock, nhiều condition variables. Cần unlock thủ công.

**40. `ExecutorService` là gì?**
> Framework quản lý pool thread, submit task, quản lý lifecycle.

**41. `ForkJoinPool` dùng khi nào?**
> Dùng cho divide-and-conquer task, ví dụ `RecursiveTask`, `RecursiveAction`, parallel streams.

**42. `CountDownLatch` vs `CyclicBarrier`?**
> `CountDownLatch` chờ N event hoàn thành, không reset. `CyclicBarrier` chờ N thread gặp nhau tại barrier, có thể reuse.

**43. `ConcurrentHashMap` khác gì `HashTable`?**
> `ConcurrentHashMap` lock ở mức bucket (Java 8 dùng CAS + synchronized), hiệu năng cao hơn. `HashTable` lock toàn bộ map.

**44. Race condition là gì?**
> Nhiều thread truy cập/chỉnh sửa dữ liệu chia sẻ, kết quả phụ thuộc thứ tự thực thi.

**45. Deadlock là gì? Cách tránh?**
> 2+ thread chờ lẫn nhau giữ tài nguyên. Tránh bằng cách định thứ tự lock nhất quán, dùng timeout, giảm phạm vi lock.

---

## PHẦN 5 — SQL & Database

**46. ACID là gì?**
> Atomicity, Consistency, Isolation, Durability.

**47. Index là gì? Tại sao cần index?**
> Cấu trúc dữ liệu giúp truy vấn nhanh hơn (thường là B-Tree). Giảm thờ gian tìm kiếm.

**48. Clustered index vs Non-clustered index?**
> Clustered: dữ liệu vật lý sắp xếp theo index. Non-clustered: chỉ lưu con trỏ đến dữ liệu.

**49. JOIN có mấy loại? Kể tên.**
> INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, SELF JOIN.

**50. `WHERE` vs `HAVING`?**
> `WHERE` lọc trước khi group. `HAVING` lọc sau khi group, dùng với aggregate.

**51. `DELETE` vs `TRUNCATE` vs `DROP`?**
> DELETE: xóa từng dòng, có thể rollback, chậm. TRUNCATE: xóa toàn bộ, nhanh, reset identity. DROP: xóa cả table.

**52. Normalization là gì? Có mấy dạng chuẩn?**
> Chia nhỏ bảng để giảm redundancy. Các dạng: 1NF, 2NF, 3NF, BCNF, 4NF, 5NF.

**53. N+1 query problem là gì? Cách giải quyết?**
> 1 query lấy parent + N query lấy child. Giải quyết bằng JOIN FETCH, Entity Graph, hoặc `@BatchSize`.

**54. Transaction isolation levels có mấy cấp?**
> READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.

**55. Optimistic locking vs Pessimistic locking?**
> Optimistic: kiểm tra version khi update. Pessimistic: khóa dòng ngay khi đọc.

---

## PHẦN 6 — Spring Boot

**56. Spring Boot là gì? Lợi ích?**
> Framework giúp xây dựng ứng dụng Spring nhanh với auto-configuration, starter dependencies, embedded server.

**57. `@SpringBootApplication` bao gồm những annotation nào?**
> `@Configuration`, `@EnableAutoConfiguration`, `@ComponentScan`.

**58. `@Component`, `@Service`, `@Repository`, `@Controller` khác nhau thế nào?**
> Tất cả đều là stereotype. `@Service` đánh dấu business logic. `@Repository` có exception translation. `@Controller` xử lý request.

**59. `@Autowired` inject theo cách nào?**
> Mặc định by type. Có thể kết hợp `@Qualifier` để by name.

**60. `@Qualifier` dùng để làm gì?**
> Chỉ định bean cụ thể khi có nhiều bean cùng type.

**61. Spring Bean lifecycle?**
> Instantiate → populate properties → aware interfaces → BeanPostProcessor before → init method → after → ready for use → destroy.

**62. `@Value` và `@ConfigurationProperties` khác nhau?**
> `@Value` inject từng giá trị. `@ConfigurationProperties` bind nhiều giá trị có tiền tố vào POJO.

**63. `@Transactional` hoạt động như thế nào?**
> Spring tạo proxy (JDK dynamic hoặc CGLIB), quản lý transaction begin/commit/rollback xung quanh method.

**64. Spring AOP là gì? Dùng khi nào?**
> Aspect-Oriented Programming, cắt ngang cross-cutting concerns như logging, transaction, security.

**65. Spring Boot Actuator dùng để làm gì?**
> Cung cấp endpoint giám sát health, metrics, info của ứng dụng.

---

## PHẦN 7 — REST API

**66. RESTful API là gì?**
> API tuân theo REST principles: stateless, resource-based, dùng HTTP methods và status code chuẩn.

**67. HTTP methods: GET, POST, PUT, DELETE, PATCH?**
> GET: lấy. POST: tạo. PUT: cập nhật toàn bộ. DELETE: xóa. PATCH: cập nhật một phần.

**68. HTTP status code: 200, 201, 204, 400, 401, 403, 404, 500?**
> 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error.

**69. Idempotency là gì? Methods nào idempotent?**
> Gọi nhiều lần cho cùng kết quả. GET, PUT, DELETE idempotent. POST thường không idempotent.

**70. `@RequestParam` vs `@PathVariable`?**
> `@RequestParam` lấy query parameter. `@PathVariable` lấy giá trị từ URL path.

**71. DTO là gì? Tại sao dùng DTO?**
> Data Transfer Object, dùng để truyền dữ liệu giữa layer. Giúp giấu entity, validate, format dữ liệu.

**72. `@Valid` và `@Validated` khác nhau?**
> `@Valid` hỗ trợ nested validation. `@Validated` hỗ trợ group validation.

**73. Global exception handling trong Spring?**
> Dùng `@RestControllerAdvice` + `@ExceptionHandler` để xử lý exception chung.

**74. Pagination trong Spring Data JPA?**
> Dùng `Pageable` parameter và trả về `Page<T>`. Ví dụ: `repository.findAll(PageRequest.of(0, 10))`.

**75. Versioning API có những cách nào?**
> URL path (`/v1/users`), request param, header (`Accept-Version`), media type versioning.

---

## PHẦN 8 — JPA / Hibernate

**76. JPA vs Hibernate?**
> JPA là specification. Hibernate là implementation phổ biến của JPA.

**77. `@Entity`, `@Table`, `@Id`, `@GeneratedValue`?**
> `@Entity`: đánh dấu class ánh xạ bảng. `@Table`: tên bảng. `@Id`: khóa chính. `@GeneratedValue`: tự động sinh ID.

**78. `@OneToMany`, `@ManyToOne`, `@ManyToMany`?**
> Định nghĩa quan hệ 1-n, n-1, n-n giữa entity.

**79. `FetchType.LAZY` vs `FetchType.EAGER`?**
> LAZY: load dữ liệu liên quan khi truy cập. EAGER: load ngay lập tức cùng entity chính.

**80. `cascade` là gì? Các loại cascade?**
> Tự động áp dụng operation cho entity liên quan. Các loại: PERSIST, MERGE, REMOVE, REFRESH, DETACH, ALL.

**81. `orphanRemoval` là gì?**
> Tự động xóa entity con khi bị loại khỏi collection của parent.

**82. `@Column`, `@JoinColumn`?**
> `@Column`: ánh xạ cột thường. `@JoinColumn`: ánh xạ khóa ngoại.

**83. JPQL vs native query?**
> JPQL truy vấn entity và thuộc tính, database-independent. Native query viết SQL thuần túy.

**84. First-level cache vs second-level cache?**
> First-level cache: mặc định theo EntityManager/Session. Second-level cache: cache toàn cục, cần cấu hình provider (Ehcache, Caffeine).

**85. `@Query` và `@Modifying`?**
> `@Query`: custom query. `@Modifying`: đánh dấu query là INSERT/UPDATE/DELETE trong `@Transactional`.

---

## PHẦN 9 — Security & JWT

**86. Authentication vs Authorization?**
> Authentication: xác minh "ai bạn là". Authorization: xác định "bạn đượ phép làm gì".

**87. JWT gồm mấy phần?**
> 3 phần: Header, Payload, Signature, ngăn cách bằng dấu chấm.

**88. Cách bảo mật JWT?**
> Dùng secret mạnh, HS256/RS256, set expiration ngắn, lưu trữ an toàn, dùng refresh token, HTTPS.

**89. OAuth2 flow cơ bản?**
> Client yêu cầu authorization → User đồng ý → Authorization server cấp access token → Client dùng token gọi resource server.

**90. Spring Security filter chain?**
> Chuỗi filter xử lý request: authentication, authorization, CSRF, session, exception handling.

**91. `BCryptPasswordEncoder` dùng để làm gì?**
> Hash password với salt tự động, chậm và an toàn.

**92. CSRF là gì? Cách chống?**
> Cross-Site Request Forgery: kẻ tấn công lừa user thực hiện request. Chống bằng CSRF token, SameSite cookie.

**93. CORS là gì? Cách cấu hình?**
> Cross-Origin Resource Sharing. Cấu hình allowed origins, methods, headers trong Spring bằng `CorsRegistry`.

**94. HTTPS hoạt động như thế nào?**
> Dùng TLS/SSL để mã hóa dữ liệu giữa client và server qua handshake và certificate.

**95. Session-based auth vs Token-based auth?**
> Session: server lưu session, client giữ session ID. Token: server không lưu trạng thái, client gửi token mỗi request.

---

## PHẦN 10 — DevOps & Cloud

**96. Docker image vs container?**
> Image là template read-only. Container là instance đang chạy của image.

**97. Docker Compose dùng để làm gì?**
> Định nghĩa và chạy nhiều container cùng lúc qua file YAML.

**98. CI/CD là gì?**
> Continuous Integration: tự động build/test khi code thay đổi. Continuous Deployment/Delivery: tự động triển khai.

**99. Kafka dùng để làm gì?**
> Message broker phân tán, streaming dữ liệu real-time, giải coupling giữa services.

**100. AWS EC2 vs ECS vs EKS?**
> EC2: máy chủ ảo tự quản lý. ECS: dịch vụ quản lý container. EKS: Kubernetes managed.

**101. Load balancer L4 vs L7?**
> L4 dựa trên IP/port. L7 dựa trên nội dung request như URL, header, cookie.

**102. Redis dùng để làm gì?**
> In-memory data store, dùng làm cache, session, rate limit, pub/sub, leaderboard.

**103. CAP theorem là gì?**
> Hệ thống phân tán chỉ đảm bảo 2/3: Consistency, Availability, Partition Tolerance.

**104. Rate limiting là gì?**
> Giới hạn số request từ một client trong khoảng thờ gian nhất định.

**105. Blue-green deployment là gì?**
> Triển khai 2 môi trường giống hệt nhau, chuyển traffic từ blue sang green để giảm downtime và dễ rollback.

---

## ✅ CHECKLIST PHẦN 21

- [ ] Đọc và hiểu từng câu trả lởi.
- [ ] Tự trả lởi lại bằng lờ của mình.
- [ ] Đánh dấu câu nào chưa chắc để ôn lại.
- [ ] Luyện nói ngắn gọn, rõ ràng, có ví dụ.
