# 📄 PHẦN 25 — TESTING ADVANCED

---

## 1. TDD (Test-Driven Development)

**Red → Green → Refactor**

1. Viết test trước (đỏ)
2. Viết code tối thiểu để pass (xanh)
3. Refactor code

---

## 2. Unit Test với JUnit 5

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    @DisplayName("Should calculate total price correctly")
    void testCalculateTotal() {
        // Arrange
        Order order = new Order();
        order.addItem(new Item("Product A", BigDecimal.TEN));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act
        BigDecimal result = orderService.calculateTotal(1L);

        // Assert
        assertEquals(new BigDecimal("10.0"), result);
        verify(orderRepository).findById(1L);
    }
}
```

**Annotations:** `@Test`, `@ParameterizedTest`, `@DisplayName`, `@Nested`, `@Tag`.

---

## 3. Mockito — Mocking & Stubbing

```java
// Stub
when(repo.findById(1L)).thenReturn(Optional.of(user));
when(repo.save(any())).thenThrow(new DataIntegrityViolationException("..."));
doNothing().when(emailService).send(anyString());

// Verify
verify(repo, times(1)).save(any());
verify(repo, never()).delete(any());
verify(repo, timeout(100).times(1)).findById(1L);

// Argument matchers
any(), anyString(), anyLong(), eq("value"), argThat(arg -> arg > 0)

// Spy (partial mock)
@Spy
List<String> list = new ArrayList<>();
doReturn(100).when(list).size(); // override size()
```

---

## 4. Spring Boot Test — Slice Test

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Test
    void shouldReturn200() throws Exception {
        when(orderService.findById(1L))
            .thenReturn(new OrderDto(1L, "Product", BigDecimal.TEN));

        mockMvc.perform(get("/api/orders/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Product"))
            .andExpect(jsonPath("$.price").value(10.0));
    }
}
```

| Annotation | Test tầng |
|---|---|
| `@WebMvcTest` | Controller |
| `@DataJpaTest` | Repository |
| `@JsonTest` | JSON serialize |
| `@RestClientTest` | REST client |

---

## 5. Integration Test với Testcontainers

```java
@Testcontainers
@SpringBootTest
class OrderRepositoryIntegrationTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8")
        .withDatabaseName("testdb");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry reg) {
        reg.add("spring.datasource.url", mysql::getJdbcUrl);
        reg.add("spring.datasource.username", mysql::getUsername);
        reg.add("spring.datasource.password", mysql::getPassword);
    }

    @Autowired
    private OrderRepository repository;

    @Test
    void shouldSaveAndFindOrder() {
        Order order = new Order("Test");
        repository.save(order);
        assertThat(repository.findByName("Test")).isPresent();
    }
}
```

---

## 6. Contract Test với Spring Cloud Contract

Đảm bảo API contract giữa producer và consumer.

```groovy
// contracts/shouldReturnProduct.groovy
Contract.make {
    description "should return product by ID"
    request {
        method GET()
        url "/api/products/1"
    }
    response {
        status 200
        headers {
            contentType applicationJson()
        }
        body([
            id: 1,
            name: "Product",
            price: 100.00
        ])
    }
}
```

---

## 7. Performance Test

```java
@BenchmarkMode(Mode.Throughput)
@Measurement(iterations = 5, time = 1)
@Threads(4)
@Fork(1)
public class OrderServiceBenchmark {

    @Benchmark
    public void testFindAll(Blackhole hole) {
        hole.consume(orderService.findAll());
    }
}
```

**JMH** (Java Microbenchmark Harness) — đảm bảo đo đúng, không bị JVM warmup ảnh hưởng.

---

## 8. Mutation Testing với PITest

Kiểm tra chất lượng test bằng cách đột biến code.

```xml
<plugin>
    <groupId>org.pitest</groupId>
    <artifactId>pitest-maven</artifactId>
    <configuration>
        <targetClasses>
            <param>com.myapp.service.*</param>
        </targetClasses>
        <targetTests>
            <param>com.myapp.service.*</param>
        </targetTests>
    </configuration>
</plugin>
```

Mục tiêu: **> 80% mutation coverage**.

---

## 💬 Câu trả lời mẫu 60 giây

**Câu: @Mock vs @InjectMocks?**
> "@Mock tạo mock object. @InjectMocks tạo instance thật và inject các mock vào field tương ứng (constructor, setter, field)."

**Câu: Spring Boot slice test là gì?**
> "Chỉ load các bean cần thiết cho tầng đó. @WebMvcTest chỉ load Controller, không load Service thật (dùng @MockBean). Giúp test nhanh hơn integration test."

---

## ✅ CHECKLIST PHẦN 25
- [ ] Giải thích TDD: Red → Green → Refactor.
- [ ] Viết Unit Test với JUnit 5 + Mockito.
- [ ] Dùng @WebMvcTest cho Controller.
- [ ] Dùng Testcontainers cho Integration Test.
- [ ] Biết Contract Test với Spring Cloud Contract.
- [ ] Biết Performance Test với JMH.
- [ ] Biết Mutation Testing với PITest.
- [ ] Phân biệt @Mock, @MockBean, @InjectMocks.
