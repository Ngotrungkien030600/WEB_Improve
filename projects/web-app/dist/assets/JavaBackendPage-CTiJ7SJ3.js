import{_ as e,c as t,f as n,g as r,l as i,n as a,p as o,s,w as c}from"./index-C1FpBSPw.js";import{t as l}from"./navigate-B3_TyOtb.js";var u=[{id:`sql`,num:`1`,title:`SQL & Database`},{id:`nosql`,num:`2`,title:`NoSQL`},{id:`mq`,num:`3`,title:`Message Queue`},{id:`docker`,num:`4`,title:`Docker`},{id:`k8s`,num:`5`,title:`Kubernetes`},{id:`cicd`,num:`6`,title:`CI/CD`},{id:`design`,num:`7`,title:`System Design`},{id:`perf`,num:`8`,title:`Performance`},{id:`arch`,num:`9`,title:`Architecture Patterns`},{id:`interview`,num:`10`,title:`Câu hỏi phỏng vấn`}],d={name:`JavaBackendPage`,data(){return{tocSections:u}},methods:{handleNav(e){l(e)},scrollTo(e){let t=document.getElementById(e);t&&t.scrollIntoView({behavior:`smooth`,block:`start`})}}},f={class:`backend-page`,style:{"--color-accent":`#f59e0b`}},p={class:`page`},m={class:`topbar`},h={class:`links`},g={class:`toc`},_=[`onClick`],v={class:`section`,id:`interview`},y={class:`section-body`},b={class:`interview-link`};function x(a,l,u,d,x,S){return r(),n(`div`,f,[i(`div`,p,[i(`div`,m,[l[3]||=i(`div`,null,[i(`h1`,null,`⚙️ Backend Engineering`),i(`p`,{class:`desc`},`Database, Message Queue, Docker, K8s, CI/CD, System Design, Performance`)],-1),i(`div`,h,[i(`a`,{href:`#`,onClick:l[0]||=s(e=>S.handleNav(`/java/hub`),[`prevent`])},`← Java`),i(`a`,{href:`#`,onClick:l[1]||=s(e=>S.handleNav(`/`),[`prevent`])},`Trang chủ`)])]),i(`div`,g,[(r(!0),n(t,null,e(x.tocSections,e=>(r(),n(`a`,{key:e.id,href:`#`,onClick:s(t=>S.scrollTo(e.id),[`prevent`])},c(e.num)+`. `+c(e.title),9,_))),128))]),l[6]||=o(`<div class="section" id="sql" data-v-5ae6ea4b><div class="section-title" data-v-5ae6ea4b>1. SQL &amp; Database</div><div class="section-body" data-v-5ae6ea4b><h3 data-v-5ae6ea4b>ACID Properties</h3><div class="grid-2" data-v-5ae6ea4b><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Atomicity</h4><p data-v-5ae6ea4b>Toàn bộ hoặc không gì cả. Transaction commit → all changes. Rollback → không thay đổi nào.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Consistency</h4><p data-v-5ae6ea4b>Dữ liệu từ trạng thái hợp lệ này sang hợp lệ khác. Ràng buộc (FK, unique, check) luôn được đảm bảo.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Isolation</h4><p data-v-5ae6ea4b>Transaction không ảnh hưởng lẫn nhau. Các mức: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Durability</h4><p data-v-5ae6ea4b>Dữ liệu đã commit được lưu vĩnh viễn. Dùng WAL (Write-Ahead Log) để phục hồi khi crash.</p></div></div><h3 data-v-5ae6ea4b>Index chi tiết</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>-- B-Tree index (mặc định) — tốt cho =, &gt;, &lt;, BETWEEN, LIKE &#39;abc%&#39;
CREATE INDEX idx_email ON users(email);

-- Composite index — áp dụng left-most prefix
CREATE INDEX idx_name_age ON users(last_name, first_name, age);
-- Dùng được: WHERE last_name=&#39;Nguyen&#39;
-- KHÔNG dùng được: WHERE first_name=&#39;An&#39;  (thiếu last_name)

-- Unique index
CREATE UNIQUE INDEX idx_email_unique ON users(email);

-- Partial index (PostgreSQL)
CREATE INDEX idx_active_users ON users(email) WHERE status = &#39;ACTIVE&#39;;

-- Covering index
CREATE INDEX idx_covering ON users(email) INCLUDE (name, avatar_url);</code></pre><h3 data-v-5ae6ea4b>Transaction &amp; Locking</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>-- Pessimistic Lock
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query(&quot;SELECT o FROM Order o WHERE o.id = :id&quot;)
Optional&lt;Order&gt; findByIdForUpdate(@Param(&quot;id&quot;) Long id);

-- Optimistic Lock — dùng version column
@Entity
public class Product {
    @Version
    private Long version;
}

-- Deadlock fix: luôn lock theo cùng thứ tự (id 1 → 2)</code></pre><h3 data-v-5ae6ea4b>Query Optimization</h3><ul data-v-5ae6ea4b><li data-v-5ae6ea4b><strong data-v-5ae6ea4b>EXPLAIN ANALYZE:</strong> xem seq scan vs index scan</li><li data-v-5ae6ea4b><strong data-v-5ae6ea4b>N+1:</strong> dùng JOIN FETCH, @EntityGraph</li><li data-v-5ae6ea4b><strong data-v-5ae6ea4b>Chỉ SELECT cần thiết:</strong> không SELECT *</li><li data-v-5ae6ea4b><strong data-v-5ae6ea4b>Pagination:</strong> keyset pagination thay vì OFFSET</li><li data-v-5ae6ea4b><strong data-v-5ae6ea4b>Connection pool:</strong> HikariCP size ~ 2*CPU + 1</li></ul></div></div><div class="section" id="nosql" data-v-5ae6ea4b><div class="section-title" data-v-5ae6ea4b>2. NoSQL Databases</div><div class="section-body" data-v-5ae6ea4b><div class="grid-2" data-v-5ae6ea4b><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Redis</h4><p data-v-5ae6ea4b>In-memory key-value. Cache, session, rate limiter, distributed lock, pub/sub.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>MongoDB</h4><p data-v-5ae6ea4b>Document DB (JSON-like). Flexible schema, nested data.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Cassandra</h4><p data-v-5ae6ea4b>Wide-column, write-optimized. Time-series, IoT, event logging.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Elasticsearch</h4><p data-v-5ae6ea4b>Full-text search + analytics. Logging, search engine.</p></div></div><h3 data-v-5ae6ea4b>Redis Patterns</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>// Cache Aside
public User getUser(Long id) {
    String key = &quot;user:&quot; + id;
    String cached = redis.opsForValue().get(key);
    if (cached != null) return deserialize(cached);
    User user = userRepo.findById(id).orElse(null);
    if (user != null) redis.opsForValue().set(key, serialize(user), 1, TimeUnit.HOURS);
    return user;
}

// Distributed Lock (Redis + Lua script)
// SET lock:order:123 uuid NX PX 30000

// Rate Limiter (Token Bucket)
// Lưu tokens + last_refill_time trong Redis Hash</code></pre></div></div><div class="section" id="mq" data-v-5ae6ea4b><div class="section-title" data-v-5ae6ea4b>3. Message Queue (Kafka &amp; RabbitMQ)</div><div class="section-body" data-v-5ae6ea4b><div class="grid-2" data-v-5ae6ea4b><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>🐇 RabbitMQ</h4><p data-v-5ae6ea4b>Message broker cổ điển. Exchange types: Direct, Topic, Fanout. Dùng cho: task queue, RPC, pub/sub.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>📊 Kafka</h4><p data-v-5ae6ea4b>Distributed event streaming. Topic, Partition, Consumer Group, Offset. Dùng cho: event sourcing, stream processing.</p></div></div><h3 data-v-5ae6ea4b>Spring Kafka</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>@RestController
public class OrderController {
    @Autowired private KafkaTemplate&lt;String, OrderEvent&gt; kafka;

    @PostMapping(&quot;/orders&quot;)
    public Order create(@RequestBody @Valid CreateOrderRequest req) {
        Order order = orderService.create(req);
        kafka.send(&quot;order-events&quot;, new OrderEvent(order.getId(), &quot;CREATED&quot;));
        return order;
    }
}

@Component
public class OrderEventHandler {
    @KafkaListener(topics = &quot;order-events&quot;, groupId = &quot;notification-service&quot;)
    public void handleOrderCreated(OrderEvent event) {
        if (event.getType().equals(&quot;CREATED&quot;)) {
            emailService.sendOrderConfirmation(event.getOrderId());
        }
    }
}</code></pre><h3 data-v-5ae6ea4b>Kafka Streams</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>StreamsBuilder builder = new StreamsBuilder();
KStream&lt;String, OrderEvent&gt; stream = builder.stream(&quot;order-events&quot;);

KTable&lt;Long, Long&gt; countPerMinute = stream
    .filter((k, v) -&gt; &quot;CREATED&quot;.equals(v.getType()))
    .groupBy((k, v) -&gt; v.getProductId())
    .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
    .count();</code></pre></div></div><div class="section" id="docker" data-v-5ae6ea4b><div class="section-title" data-v-5ae6ea4b>4. Docker</div><div class="section-body" data-v-5ae6ea4b><h3 data-v-5ae6ea4b>Dockerfile cho Spring Boot</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b># Multi-stage build
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ src/
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S app &amp;&amp; adduser -S app -G app
USER app
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1
ENTRYPOINT [&quot;java&quot;, &quot;-jar&quot;, &quot;app.jar&quot;]</code></pre><h3 data-v-5ae6ea4b>docker-compose</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>version: &#39;3.8&#39;
services:
  app:
    build: .
    ports: [&quot;8080:8080&quot;]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/skillforge
    depends_on:
      db: { condition: service_healthy }

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: skillforge
      POSTGRES_PASSWORD: secret
    volumes: [&quot;pgdata:/var/lib/postgresql/data&quot;]
    healthcheck:
      test: [&quot;CMD-SHELL&quot;, &quot;pg_isready -U postgres&quot;]</code></pre></div></div><div class="section" id="k8s" data-v-5ae6ea4b><div class="section-title" data-v-5ae6ea4b>5. Kubernetes</div><div class="section-body" data-v-5ae6ea4b><h3 data-v-5ae6ea4b>Deployment &amp; Service</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b># deployment.yml
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
              cpu: &quot;500m&quot;
              memory: &quot;512Mi&quot;
            limits:
              cpu: &quot;1000m&quot;
              memory: &quot;1Gi&quot;</code></pre><h3 data-v-5ae6ea4b>ConfigMap &amp; Secret</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yml: |
    app:
      name: user-service
    spring:
      datasource:
        url: jdbc:postgresql://postgres:5432/users</code></pre><h3 data-v-5ae6ea4b>Horizontal Pod Autoscaler</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>apiVersion: autoscaling/v2
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
          averageUtilization: 70</code></pre></div></div><div class="section" id="cicd" data-v-5ae6ea4b><div class="section-title" data-v-5ae6ea4b>6. CI/CD</div><div class="section-body" data-v-5ae6ea4b><h3 data-v-5ae6ea4b>GitHub Actions</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: &#39;17&#39; }
      - run: ./mvnw verify

  build-and-deploy:
    needs: test
    steps:
      - uses: actions/checkout@v4
      - run: |
          docker build -t registry.example.com/app:\${{ github.sha }} .
          docker push registry.example.com/app:\${{ github.sha }}
      - run: kubectl set image deployment/app app=registry.example.com/app:\${{ github.sha }}</code></pre><h3 data-v-5ae6ea4b>Git Flow</h3><div class="grid-2" data-v-5ae6ea4b><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>main</h4><p data-v-5ae6ea4b>Production-ready. Chỉ merge từ release/hotfix.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>develop</h4><p data-v-5ae6ea4b>Tích hợp feature branches.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>feature/xxx</h4><p data-v-5ae6ea4b>Nhánh từ develop. Tên theo ticket.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>release/v1.2</h4><p data-v-5ae6ea4b>Chuẩn bị release. Chỉ fix bug.</p></div></div><h3 data-v-5ae6ea4b>Code Quality Gates</h3><ul data-v-5ae6ea4b><li data-v-5ae6ea4b><strong data-v-5ae6ea4b>SonarQube:</strong> code smell, bug, coverage gate</li><li data-v-5ae6ea4b><strong data-v-5ae6ea4b>Checkstyle/PMD:</strong> coding convention</li><li data-v-5ae6ea4b><strong data-v-5ae6ea4b>OWASP Dependency Check:</strong> scan CVE</li><li data-v-5ae6ea4b><strong data-v-5ae6ea4b>Trivy:</strong> scan Docker image vulnerabilities</li></ul></div></div><div class="section" id="design" data-v-5ae6ea4b><div class="section-title" data-v-5ae6ea4b>7. System Design</div><div class="section-body" data-v-5ae6ea4b><h3 data-v-5ae6ea4b>CAP Theorem</h3><div class="diagram" data-v-5ae6ea4b> CAP Theorem<br data-v-5ae6ea4b> Consistency vs Availability<br data-v-5ae6ea4b> Partition Tolerance is mandatory </div><p data-v-5ae6ea4b>Trong distributed system, khi có network partition (P), bạn chỉ chọn được C (consistency) hoặc A (availability). Không có hệ thống nào có cả 3 cùng lúc.</p><h3 data-v-5ae6ea4b>Common Design Questions</h3><div class="grid-2" data-v-5ae6ea4b><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>URL Shortener</h4><p data-v-5ae6ea4b>Base62 encoding. Redis cache. DB sharding. 301 redirect.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Rate Limiter</h4><p data-v-5ae6ea4b>Token Bucket + Redis. Headers: X-RateLimit-Remaining.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Chat System</h4><p data-v-5ae6ea4b>WebSocket Gateway. Kafka message queue. Redis pub/sub.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Notification System</h4><p data-v-5ae6ea4b>Kafka → Push Worker, Email Worker, SMS Worker.</p></div></div><h3 data-v-5ae6ea4b>Estimation Cheat Sheet</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>1 request/second = 86,400 requests/day ≈ 2.5M/month
1M requests/day ≈ 12 requests/second
PostgreSQL: ~5k writes/s, ~50k reads/s (single node)
Redis: ~100k ops/s (single node)
Network latency: data center 0.5ms, same region 5ms</code></pre></div></div><div class="section" id="perf" data-v-5ae6ea4b><div class="section-title" data-v-5ae6ea4b>8. Performance Optimization</div><div class="section-body" data-v-5ae6ea4b><h3 data-v-5ae6ea4b>Caching Layers</h3><div class="diagram" data-v-5ae6ea4b> Client → CDN → Reverse Proxy → App Cache → Distributed Cache → Database </div><h3 data-v-5ae6ea4b>Application Optimization</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>// 1. Async xử lý non-critical tasks
@Async
public CompletableFuture&lt;Void&gt; sendEmail(User user) { ... }

// 2. Cache expensive operations
@Cacheable(value = &quot;products&quot;, unless = &quot;#result == null&quot;)
public Product getProduct(Long id) { ... }

// 3. Batch processing
public void importUsers(List&lt;User&gt; users) {
    userRepo.saveAll(users);  // 1 batch insert
}

// 4. Pagination
Page&lt;User&gt; page = userRepo.findAll(PageRequest.of(0, 20));</code></pre><h3 data-v-5ae6ea4b>JVM Tuning</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b># Docker memory limits
-XX:+UseContainerSupport
-XX:MaxRAMPercentage=75.0
-Xss512k
-XX:+UseG1GC
-XX:+HeapDumpOnOutOfMemoryError</code></pre></div></div><div class="section" id="arch" data-v-5ae6ea4b><div class="section-title" data-v-5ae6ea4b>9. Architecture Patterns</div><div class="section-body" data-v-5ae6ea4b><div class="grid-2" data-v-5ae6ea4b><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Monolithic</h4><p data-v-5ae6ea4b>1 ứng dụng, 1 DB. Đơn giản, dễ develop. Giới hạn: scaling.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Microservices</h4><p data-v-5ae6ea4b>Nhiều service nhỏ, độc lập. Cần: API Gateway, service discovery.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>CQRS + Event Sourcing</h4><p data-v-5ae6ea4b>Tách read/write model. Lưu events thay vì state.</p></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>Event-Driven</h4><p data-v-5ae6ea4b>Service giao tiếp qua events (Kafka). Saga pattern.</p></div></div><h3 data-v-5ae6ea4b>Outbox Pattern</h3><pre data-v-5ae6ea4b><code data-v-5ae6ea4b>@Transactional
public Order createOrder(CreateOrderRequest req) {
    Order order = orderRepo.save(toEntity(req));
    outboxRepo.save(new OutboxEvent(&quot;order&quot;, order.getId(), &quot;OrderCreated&quot;, serialize(req)));
    return order;
}
// CDC Worker — Debezium capture changes từ outbox → publish lên Kafka</code></pre></div></div>`,9),i(`div`,v,[l[5]||=i(`div`,{class:`section-title`},`10. Câu hỏi phỏng vấn Backend`,-1),i(`div`,y,[l[4]||=o(`<div class="grid-2" data-v-5ae6ea4b><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>🌱 Junior</h4><ul data-v-5ae6ea4b><li data-v-5ae6ea4b>ACID là gì?</li><li data-v-5ae6ea4b>INNER JOIN vs LEFT JOIN?</li><li data-v-5ae6ea4b>INDEX hoạt động thế nào?</li><li data-v-5ae6ea4b>Transaction isolation levels?</li><li data-v-5ae6ea4b>GET vs POST?</li></ul></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>📈 Middle</h4><ul data-v-5ae6ea4b><li data-v-5ae6ea4b>N+1 problem + fix?</li><li data-v-5ae6ea4b>Optimistic vs Pessimistic lock?</li><li data-v-5ae6ea4b>Redis dùng để làm gì?</li><li data-v-5ae6ea4b>Kafka partition?</li><li data-v-5ae6ea4b>Docker multi-stage build?</li></ul></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>🎯 Senior</h4><ul data-v-5ae6ea4b><li data-v-5ae6ea4b>CAP theorem?</li><li data-v-5ae6ea4b>Saga pattern?</li><li data-v-5ae6ea4b>Distributed caching?</li><li data-v-5ae6ea4b>Circuit Breaker?</li></ul></div><div class="card" data-v-5ae6ea4b><h4 data-v-5ae6ea4b>🏗️ Architect</h4><ul data-v-5ae6ea4b><li data-v-5ae6ea4b>Design URL shortener?</li><li data-v-5ae6ea4b>Design chat 10M users?</li><li data-v-5ae6ea4b>CQRS + Event Sourcing?</li></ul></div></div>`,1),i(`div`,b,[i(`a`,{href:`#`,onClick:l[2]||=s(e=>S.handleNav(`/salary-interview`),[`prevent`])},`💰 Luyện phỏng vấn theo mức lương →`)])])])])])}var S=a(d,[[`render`,x],[`__scopeId`,`data-v-5ae6ea4b`]]);export{S as default};