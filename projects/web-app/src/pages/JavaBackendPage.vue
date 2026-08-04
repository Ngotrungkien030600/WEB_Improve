<template>
  <div class="backend-page" style="--color-accent: #f59e0b">
    <div class="page">
      <div class="topbar">
        <div>
          <h1>⚙️ Backend Engineering</h1>
          <p class="desc">Database, Message Queue, Docker, K8s, CI/CD, System Design, Performance</p>
        </div>
        <div class="links">
          <a href="#" @click.prevent="handleNav('/java/hub')">← Java</a>
          <a href="#" @click.prevent="handleNav('/')">Trang chủ</a>
        </div>
      </div>

      <!-- Table of Contents -->
      <div class="toc">
        <a v-for="section in tocSections" :key="section.id" href="#" @click.prevent="scrollTo(section.id)">
          {{ section.num }}. {{ section.title }}
        </a>
      </div>

      <!-- 1. SQL & Database -->
      <div class="section" id="sql">
        <div class="section-title">1. SQL &amp; Database</div>
        <div class="section-body">
          <h3>ACID Properties</h3>
          <div class="grid-2">
            <div class="card"><h4>Atomicity</h4><p>Toàn bộ hoặc không gì cả. Transaction commit → all changes. Rollback → không thay đổi nào.</p></div>
            <div class="card"><h4>Consistency</h4><p>Dữ liệu từ trạng thái hợp lệ này sang hợp lệ khác. Ràng buộc (FK, unique, check) luôn được đảm bảo.</p></div>
            <div class="card"><h4>Isolation</h4><p>Transaction không ảnh hưởng lẫn nhau. Các mức: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE.</p></div>
            <div class="card"><h4>Durability</h4><p>Dữ liệu đã commit được lưu vĩnh viễn. Dùng WAL (Write-Ahead Log) để phục hồi khi crash.</p></div>
          </div>

          <h3>Index chi tiết</h3>
          <pre><code>-- B-Tree index (mặc định) — tốt cho =, >, &lt;, BETWEEN, LIKE 'abc%'
CREATE INDEX idx_email ON users(email);

-- Composite index — áp dụng left-most prefix
CREATE INDEX idx_name_age ON users(last_name, first_name, age);
-- Dùng được: WHERE last_name='Nguyen'
-- KHÔNG dùng được: WHERE first_name='An'  (thiếu last_name)

-- Unique index
CREATE UNIQUE INDEX idx_email_unique ON users(email);

-- Partial index (PostgreSQL)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'ACTIVE';

-- Covering index
CREATE INDEX idx_covering ON users(email) INCLUDE (name, avatar_url);</code></pre>

          <h3>Transaction &amp; Locking</h3>
          <pre><code>-- Pessimistic Lock
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT o FROM Order o WHERE o.id = :id")
Optional&lt;Order&gt; findByIdForUpdate(@Param("id") Long id);

-- Optimistic Lock — dùng version column
@Entity
public class Product {
    @Version
    private Long version;
}

-- Deadlock fix: luôn lock theo cùng thứ tự (id 1 → 2)</code></pre>

          <h3>Query Optimization</h3>
          <ul>
            <li><strong>EXPLAIN ANALYZE:</strong> xem seq scan vs index scan</li>
            <li><strong>N+1:</strong> dùng JOIN FETCH, @EntityGraph</li>
            <li><strong>Chỉ SELECT cần thiết:</strong> không SELECT *</li>
            <li><strong>Pagination:</strong> keyset pagination thay vì OFFSET</li>
            <li><strong>Connection pool:</strong> HikariCP size ~ 2*CPU + 1</li>
          </ul>
        </div>
      </div>

      <!-- 2. NoSQL -->
      <div class="section" id="nosql">
        <div class="section-title">2. NoSQL Databases</div>
        <div class="section-body">
          <div class="grid-2">
            <div class="card"><h4>Redis</h4><p>In-memory key-value. Cache, session, rate limiter, distributed lock, pub/sub.</p></div>
            <div class="card"><h4>MongoDB</h4><p>Document DB (JSON-like). Flexible schema, nested data.</p></div>
            <div class="card"><h4>Cassandra</h4><p>Wide-column, write-optimized. Time-series, IoT, event logging.</p></div>
            <div class="card"><h4>Elasticsearch</h4><p>Full-text search + analytics. Logging, search engine.</p></div>
          </div>

          <h3>Redis Patterns</h3>
          <pre><code>// Cache Aside
public User getUser(Long id) {
    String key = "user:" + id;
    String cached = redis.opsForValue().get(key);
    if (cached != null) return deserialize(cached);
    User user = userRepo.findById(id).orElse(null);
    if (user != null) redis.opsForValue().set(key, serialize(user), 1, TimeUnit.HOURS);
    return user;
}

// Distributed Lock (Redis + Lua script)
// SET lock:order:123 uuid NX PX 30000

// Rate Limiter (Token Bucket)
// Lưu tokens + last_refill_time trong Redis Hash</code></pre>
        </div>
      </div>

      <!-- 3. Message Queue -->
      <div class="section" id="mq">
        <div class="section-title">3. Message Queue (Kafka &amp; RabbitMQ)</div>
        <div class="section-body">
          <div class="grid-2">
            <div class="card"><h4>🐇 RabbitMQ</h4><p>Message broker cổ điển. Exchange types: Direct, Topic, Fanout. Dùng cho: task queue, RPC, pub/sub.</p></div>
            <div class="card"><h4>📊 Kafka</h4><p>Distributed event streaming. Topic, Partition, Consumer Group, Offset. Dùng cho: event sourcing, stream processing.</p></div>
          </div>

          <h3>Spring Kafka</h3>
          <pre><code>@RestController
public class OrderController {
    @Autowired private KafkaTemplate&lt;String, OrderEvent&gt; kafka;

    @PostMapping("/orders")
    public Order create(@RequestBody @Valid CreateOrderRequest req) {
        Order order = orderService.create(req);
        kafka.send("order-events", new OrderEvent(order.getId(), "CREATED"));
        return order;
    }
}

@Component
public class OrderEventHandler {
    @KafkaListener(topics = "order-events", groupId = "notification-service")
    public void handleOrderCreated(OrderEvent event) {
        if (event.getType().equals("CREATED")) {
            emailService.sendOrderConfirmation(event.getOrderId());
        }
    }
}</code></pre>

          <h3>Kafka Streams</h3>
          <pre><code>StreamsBuilder builder = new StreamsBuilder();
KStream&lt;String, OrderEvent&gt; stream = builder.stream("order-events");

KTable&lt;Long, Long&gt; countPerMinute = stream
    .filter((k, v) -> "CREATED".equals(v.getType()))
    .groupBy((k, v) -> v.getProductId())
    .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
    .count();</code></pre>
        </div>
      </div>

      <!-- 4. Docker -->
      <div class="section" id="docker">
        <div class="section-title">4. Docker</div>
        <div class="section-body">
          <h3>Dockerfile cho Spring Boot</h3>
          <pre><code># Multi-stage build
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ src/
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre>

          <h3>docker-compose</h3>
          <pre><code>version: '3.8'
services:
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/skillforge
    depends_on:
      db: { condition: service_healthy }

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: skillforge
      POSTGRES_PASSWORD: secret
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]</code></pre>
        </div>
      </div>

      <!-- 5. Kubernetes -->
      <div class="section" id="k8s">
        <div class="section-title">5. Kubernetes</div>
        <div class="section-body">
          <h3>Deployment &amp; Service</h3>
          <pre><code># deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    spec:
      containers:
        - name: app
          image: registry.example.com/user-service:1.2.3
          ports:
            - containerPort: 8080
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "1000m"
              memory: "1Gi"</code></pre>

          <h3>ConfigMap &amp; Secret</h3>
          <pre><code>apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yml: |
    app:
      name: user-service
    spring:
      datasource:
        url: jdbc:postgresql://postgres:5432/users</code></pre>

          <h3>Horizontal Pod Autoscaler</h3>
          <pre><code>apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70</code></pre>
        </div>
      </div>

      <!-- 6. CI/CD -->
      <div class="section" id="cicd">
        <div class="section-title">6. CI/CD</div>
        <div class="section-body">
          <h3>GitHub Actions</h3>
          <pre><code>name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '17' }
      - run: ./mvnw verify

  build-and-deploy:
    needs: test
    steps:
      - uses: actions/checkout@v4
      - run: |
          docker build -t registry.example.com/app:${{ github.sha }} .
          docker push registry.example.com/app:${{ github.sha }}
      - run: kubectl set image deployment/app app=registry.example.com/app:${{ github.sha }}</code></pre>

          <h3>Git Flow</h3>
          <div class="grid-2">
            <div class="card"><h4>main</h4><p>Production-ready. Chỉ merge từ release/hotfix.</p></div>
            <div class="card"><h4>develop</h4><p>Tích hợp feature branches.</p></div>
            <div class="card"><h4>feature/xxx</h4><p>Nhánh từ develop. Tên theo ticket.</p></div>
            <div class="card"><h4>release/v1.2</h4><p>Chuẩn bị release. Chỉ fix bug.</p></div>
          </div>

          <h3>Code Quality Gates</h3>
          <ul>
            <li><strong>SonarQube:</strong> code smell, bug, coverage gate</li>
            <li><strong>Checkstyle/PMD:</strong> coding convention</li>
            <li><strong>OWASP Dependency Check:</strong> scan CVE</li>
            <li><strong>Trivy:</strong> scan Docker image vulnerabilities</li>
          </ul>
        </div>
      </div>

      <!-- 7. System Design -->
      <div class="section" id="design">
        <div class="section-title">7. System Design</div>
        <div class="section-body">
          <h3>CAP Theorem</h3>
          <div class="diagram">
            CAP Theorem<br>
            Consistency vs Availability<br>
            Partition Tolerance is mandatory
          </div>
          <p>Trong distributed system, khi có network partition (P), bạn chỉ chọn được C (consistency) hoặc A (availability). Không có hệ thống nào có cả 3 cùng lúc.</p>

          <h3>Common Design Questions</h3>
          <div class="grid-2">
            <div class="card"><h4>URL Shortener</h4><p>Base62 encoding. Redis cache. DB sharding. 301 redirect.</p></div>
            <div class="card"><h4>Rate Limiter</h4><p>Token Bucket + Redis. Headers: X-RateLimit-Remaining.</p></div>
            <div class="card"><h4>Chat System</h4><p>WebSocket Gateway. Kafka message queue. Redis pub/sub.</p></div>
            <div class="card"><h4>Notification System</h4><p>Kafka → Push Worker, Email Worker, SMS Worker.</p></div>
          </div>

          <h3>Estimation Cheat Sheet</h3>
          <pre><code>1 request/second = 86,400 requests/day ≈ 2.5M/month
1M requests/day ≈ 12 requests/second
PostgreSQL: ~5k writes/s, ~50k reads/s (single node)
Redis: ~100k ops/s (single node)
Network latency: data center 0.5ms, same region 5ms</code></pre>
        </div>
      </div>

      <!-- 8. Performance -->
      <div class="section" id="perf">
        <div class="section-title">8. Performance Optimization</div>
        <div class="section-body">
          <h3>Caching Layers</h3>
          <div class="diagram">
            Client → CDN → Reverse Proxy → App Cache → Distributed Cache → Database
          </div>

          <h3>Application Optimization</h3>
          <pre><code>// 1. Async xử lý non-critical tasks
@Async
public CompletableFuture&lt;Void&gt; sendEmail(User user) { ... }

// 2. Cache expensive operations
@Cacheable(value = "products", unless = "#result == null")
public Product getProduct(Long id) { ... }

// 3. Batch processing
public void importUsers(List&lt;User&gt; users) {
    userRepo.saveAll(users);  // 1 batch insert
}

// 4. Pagination
Page&lt;User&gt; page = userRepo.findAll(PageRequest.of(0, 20));</code></pre>

          <h3>JVM Tuning</h3>
          <pre><code># Docker memory limits
-XX:+UseContainerSupport
-XX:MaxRAMPercentage=75.0
-Xss512k
-XX:+UseG1GC
-XX:+HeapDumpOnOutOfMemoryError</code></pre>
        </div>
      </div>

      <!-- 9. Architecture Patterns -->
      <div class="section" id="arch">
        <div class="section-title">9. Architecture Patterns</div>
        <div class="section-body">
          <div class="grid-2">
            <div class="card"><h4>Monolithic</h4><p>1 ứng dụng, 1 DB. Đơn giản, dễ develop. Giới hạn: scaling.</p></div>
            <div class="card"><h4>Microservices</h4><p>Nhiều service nhỏ, độc lập. Cần: API Gateway, service discovery.</p></div>
            <div class="card"><h4>CQRS + Event Sourcing</h4><p>Tách read/write model. Lưu events thay vì state.</p></div>
            <div class="card"><h4>Event-Driven</h4><p>Service giao tiếp qua events (Kafka). Saga pattern.</p></div>
          </div>

          <h3>Outbox Pattern</h3>
          <pre><code>@Transactional
public Order createOrder(CreateOrderRequest req) {
    Order order = orderRepo.save(toEntity(req));
    outboxRepo.save(new OutboxEvent("order", order.getId(), "OrderCreated", serialize(req)));
    return order;
}
// CDC Worker — Debezium capture changes từ outbox → publish lên Kafka</code></pre>
        </div>
      </div>

      <!-- 10. Interview Questions -->
      <div class="section" id="interview">
        <div class="section-title">10. Câu hỏi phỏng vấn Backend</div>
        <div class="section-body">
          <div class="grid-2">
            <div class="card"><h4>🌱 Junior</h4><ul><li>ACID là gì?</li><li>INNER JOIN vs LEFT JOIN?</li><li>INDEX hoạt động thế nào?</li><li>Transaction isolation levels?</li><li>GET vs POST?</li></ul></div>
            <div class="card"><h4>📈 Middle</h4><ul><li>N+1 problem + fix?</li><li>Optimistic vs Pessimistic lock?</li><li>Redis dùng để làm gì?</li><li>Kafka partition?</li><li>Docker multi-stage build?</li></ul></div>
            <div class="card"><h4>🎯 Senior</h4><ul><li>CAP theorem?</li><li>Saga pattern?</li><li>Distributed caching?</li><li>Circuit Breaker?</li></ul></div>
            <div class="card"><h4>🏗️ Architect</h4><ul><li>Design URL shortener?</li><li>Design chat 10M users?</li><li>CQRS + Event Sourcing?</li></ul></div>
          </div>
          <div class="interview-link">
            <a href="#" @click.prevent="handleNav('/salary-interview')">💰 Luyện phỏng vấn theo mức lương →</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

const tocSections = [
  { id: 'sql', num: '1', title: 'SQL & Database' },
  { id: 'nosql', num: '2', title: 'NoSQL' },
  { id: 'mq', num: '3', title: 'Message Queue' },
  { id: 'docker', num: '4', title: 'Docker' },
  { id: 'k8s', num: '5', title: 'Kubernetes' },
  { id: 'cicd', num: '6', title: 'CI/CD' },
  { id: 'design', num: '7', title: 'System Design' },
  { id: 'perf', num: '8', title: 'Performance' },
  { id: 'arch', num: '9', title: 'Architecture Patterns' },
  { id: 'interview', num: '10', title: 'Câu hỏi phỏng vấn' },
];

export default {
  name: 'JavaBackendPage',
  data() {
    return { tocSections };
  },
  methods: {
    handleNav(path) {
      navigate(path);
    },
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
  },
};
</script>

<style scoped>
@import '@legacy/css/variables.css';

.backend-page {
  background: var(--color-bg);
  min-height: 100vh;
  color: var(--color-text);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.7;
}

.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.topbar h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.desc {
  color: var(--color-text2);
  margin-top: 0.3rem;
  font-size: 0.95rem;
}

.links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.links a {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.85rem;
}

.links a:hover {
  text-decoration: underline;
}

.toc {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.toc a {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 0.65rem 1rem;
  text-decoration: none;
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 500;
  transition: border-color 0.2s, color 0.2s;
}

.toc a:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.section {
  margin-bottom: 3rem;
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  overflow: hidden;
}

.section-title {
  background: var(--color-surface2);
  padding: 0.9rem 1.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-bottom: 1px solid var(--color-border);
}

.section-body {
  padding: 1.25rem;
}

.section-body h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.25rem 0 0.5rem;
  color: var(--color-accent);
}

.section-body h3:first-child {
  margin-top: 0;
}

.section-body p {
  font-size: 0.9rem;
  color: var(--color-text2);
  margin-bottom: 0.75rem;
}

.section-body ul {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.section-body li {
  font-size: 0.85rem;
  color: var(--color-text2);
  margin-bottom: 0.3rem;
}

.section-body strong {
  color: var(--color-text);
}

pre {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1rem;
  font-size: 0.82rem;
  overflow-x: auto;
  margin: 0.75rem 0;
  line-height: 1.6;
  color: var(--color-text);
}

code {
  background: var(--color-surface2);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85em;
}

pre code {
  background: transparent;
  padding: 0;
}

.diagram {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1rem;
  margin: 0.75rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-accent);
  font-weight: 600;
  line-height: 2;
  font-family: monospace;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.card {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1rem;
}

.card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card p,
.card li {
  font-size: 0.8rem;
  color: var(--color-text2);
}

.card ul {
  padding-left: 1rem;
}

.card li {
  margin-bottom: 0.2rem;
}

.interview-link {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-surface2);
  border-radius: var(--color-radius);
  text-align: center;
}

.interview-link a {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
}

.interview-link a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
