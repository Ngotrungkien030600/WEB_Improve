# 📄 PHẦN 26 — PERFORMANCE OPTIMIZATION & TROUBLESHOOTING

---

## 1. JVM Memory Model

```
Heap                            Metaspace
├── Young Gen                   Class metadata
│   ├── Eden                   (không giới hạn mặc định)
│   └── Survivor (S0, S1)
├── Old Gen (Tenured)
└── (từ Java 8+ không có PermGen)
```

**JVM flags:**
```bash
-Xms512m -Xmx2g                    # Initial / Max heap
-XX:MetaspaceSize=256m              # Metaspace
-XX:+UseG1GC                        # G1GC (mặc định từ Java 9)
-XX:+PrintGCDetails                 # Log GC
-XX:+HeapDumpOnOutOfMemoryError     # Auto dump heap khi OOM
```

---

## 2. Garbage Collection Algorithms

| GC | Mô tả | Khi nào dùng |
|---|---|---|
| **Serial** | 1 thread, stop-the-world | App nhỏ, single-core |
| **Parallel** | Nhiều thread, throughput cao | Batch processing, high throughput |
| **G1GC** | Region-based, pause time predictable | Mặc định Java 9+, ứng dụng lớn |
| **ZGC** | Low-latency < 10ms | Hệ thống real-time, heap lớn > 100GB |
| **Shenandoah** | Concurrent compaction | Latency-sensitive |

---

## 3. Profiling & Monitoring

**Công cụ:**
- **JProfiler / YourKit** — trả phí, mạnh nhất
- **VisualVM** — free, đủ dùng
- **Async Profiler** — low overhead sampling
- **JDK Mission Control (JMC)** — flight recorder, free từ Oracle

**Cách profile:**
```bash
# CPU sampling
async-profiler -e cpu -d 30 -o flamegraph output.svg <pid>

# Heap dump
jmap -dump:format=b,file=heap.hprof <pid>

# GC log analysis
gceasy.io (upload GC log)
```

---

## 4. Database Performance

| Vấn đề | Giải pháp |
|---|---|
| Query chậm | `EXPLAIN`, tạo index, dùng covering index |
| N+1 query | `JOIN FETCH`, `@EntityGraph`, batch fetching |
| Connection pool full | Tuning HikariCP: `maximumPoolSize`, `connectionTimeout` |
| Deadlock | Đảm bảo thứ tự lock, transaction ngắn |
| Slow bulk insert | `hibernate.jdbc.batch_size`, rewriteBatchedStatements |

**HikariCP config:**
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000
      max-lifetime: 1200000
```

---

## 5. Caching Strategy

```java
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("products", "users");
    }
}

@Service
public class ProductService {
    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) { ... }

    @CacheEvict(value = "products", key = "#product.id")
    public Product update(Product product) { ... }

    @CachePut(value = "products", key = "#result.id")
    public Product create(Product product) { ... }
}
```

**Redis Cache:**
```yaml
spring:
  cache:
    type: redis
  redis:
    host: localhost
    port: 6379
```

**Cache Aside Pattern:** App đọc cache trước, miss thì đọc DB + ghi cache.

---

## 6. Connection Pool Tuning

| Pool | Max | Ideal |
|---|---|---|
| HikariCP (DB) | 20-50 | 2-4 core × 2 |
| Tomcat (HTTP) | 200 | Tùy traffic |
| Kafka Consumer | Số partition | 1 thread / partition max |

**Công thức:** `PoolSize = Tp * (C - Cm)` với `Tp = max threads in parallel`, `C = core count`.

---

## 7. Common Performance Issues

| Triệu chứng | Nguyên nhân | Cách fix |
|---|---|---|
| High CPU | Infinite loop, GC storm | Heap dump + thread dump |
| High Memory | Memory leak, large objects | Heap dump → MAT (Eclipse Memory Analyzer) |
| Slow response | DB query chậm, external API slow | Trace, index, cache, timeout |
| Thread stuck | Deadlock, connection pool full | Thread dump, increase pool |
| Disk I/O high | Logging quá nhiều | Log level, async appender |

**Thread dump command:**
```bash
jstack <pid> > threaddump.txt
# Hoặc kill -3 <pid> (Unix)
```

---

## 8. Spring Boot Performance Tuning

```yaml
# application.yaml
server:
  tomcat:
    max-threads: 200
    max-connections: 10000
    accept-count: 100
    connection-timeout: 5000

spring:
  jpa:
    properties:
      hibernate:
        jdbc.batch_size: 30
        order_inserts: true
        order_updates: true
        generate_statistics: true  # chỉ dùng dev
```

---

## 💬 Câu trả lời mẫu 60 giây

**Câu: Ứng dụng chạy chậm, bạn làm gì?**
> "1) Kiểm tra monitoring/metric (CPU, memory, GC, DB). 2) Xác định bottleneck: dùng profiler. 3) Nếu DB chậm → check query, index. 4) Nếu code → optimize, cache. 5) Verify sau fix."

**Câu: Memory leak trong Java?**
> "Object không được GC vì vẫn còn reference. Dùng heap dump + Eclipse MAT để tìm object chiếm nhiều memory. Nguyên nhân thường: không đóng resource, static collection, ThreadLocal, listener không unregister."

**Câu: G1GC hoạt động thế nào?**
> "G1 chia heap thành các region. Concurrent marking để tìm garbage. Ưu tiên thu thập region chứa nhiều garbage nhất (garbage-first). Mục tiêu đạt pause time target (mặc định 200ms)."

---

## ✅ CHECKLIST PHẦN 26
- [ ] Giải thích JVM Memory Model.
- [ ] Phân biệt các GC algorithms.
- [ ] Dùng profiler để tìm bottleneck.
- [ ] Fix N+1 query, tối ưu index.
- [ ] Cấu hình caching (@Cacheable, Redis).
- [ ] Tuning connection pool.
- [ ] Đọc và phân tích thread dump.
- [ ] Đọc và phân tích heap dump.
- [ ] Tuning Spring Boot application.
