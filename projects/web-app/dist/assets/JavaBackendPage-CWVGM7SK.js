import{_ as e,c as t,f as n,g as r,l as i,n as a,p as o,s,w as c}from"./index-Bw06dwPt.js";import{t as l}from"./navigate-CjdYr8GP.js";var u=[{id:`sql`,num:`1`,title:`SQL & Database`},{id:`nosql`,num:`2`,title:`NoSQL`},{id:`mq`,num:`3`,title:`Message Queue`},{id:`docker`,num:`4`,title:`Docker`},{id:`k8s`,num:`5`,title:`Kubernetes`},{id:`cicd`,num:`6`,title:`CI/CD`},{id:`design`,num:`7`,title:`System Design`},{id:`perf`,num:`8`,title:`Performance`},{id:`arch`,num:`9`,title:`Architecture Patterns`},{id:`interview`,num:`10`,title:`Câu hỏi phỏng vấn`}],d={name:`JavaBackendPage`,data(){return{tocSections:u}},methods:{handleNav(e){l(e)},scrollTo(e){let t=document.getElementById(e);t&&t.scrollIntoView({behavior:`smooth`,block:`start`})}}},f={class:`backend-page`,style:{"--color-accent":`#f59e0b`}},p={class:`page`},m={class:`topbar`},h={class:`links`},g={class:`toc`},_=[`onClick`],v={class:`section`,id:`interview`},y={class:`section-body`},b={class:`interview-link`};function x(a,l,u,d,x,S){return r(),n(`div`,f,[i(`div`,p,[i(`div`,m,[l[3]||=i(`div`,null,[i(`h1`,null,`⚙️ Backend Engineering`),i(`p`,{class:`desc`},`Database, Message Queue, Docker, K8s, CI/CD, System Design, Performance`)],-1),i(`div`,h,[i(`a`,{href:`#`,onClick:l[0]||=s(e=>S.handleNav(`/java/hub`),[`prevent`])},`← Java`),i(`a`,{href:`#`,onClick:l[1]||=s(e=>S.handleNav(`/`),[`prevent`])},`Trang chủ`)])]),i(`div`,g,[(r(!0),n(t,null,e(x.tocSections,e=>(r(),n(`a`,{key:e.id,href:`#`,onClick:s(t=>S.scrollTo(e.id),[`prevent`])},c(e.num)+`. `+c(e.title),9,_))),128))]),l[6]||=o(`<div class="section" id="sql" data-v-8ae616d5><div class="section-title" data-v-8ae616d5>1. SQL &amp; Database</div><div class="section-body" data-v-8ae616d5><h3 data-v-8ae616d5>ACID Properties</h3><div class="grid-2" data-v-8ae616d5><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Atomicity</h4><p data-v-8ae616d5>Toàn bộ hoặc không gì cả. Transaction commit → all changes. Rollback → không thay đổi nào.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Consistency</h4><p data-v-8ae616d5>Dữ liệu từ trạng thái hợp lệ này sang hợp lệ khác. Ràng buộc (FK, unique, check) luôn được đảm bảo.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Isolation</h4><p data-v-8ae616d5>Transaction không ảnh hưởng lẫn nhau. Các mức: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Durability</h4><p data-v-8ae616d5>Dữ liệu đã commit được lưu vĩnh viễn. Dùng WAL (Write-Ahead Log) để phục hồi khi crash.</p></div></div><h3 data-v-8ae616d5>Index chi tiết</h3><pre data-v-8ae616d5><code data-v-8ae616d5>-- B-Tree index (mặc định) — tốt cho =, &gt;, &lt;, BETWEEN, LIKE &#39;abc%&#39;
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
CREATE INDEX idx_covering ON users(email) INCLUDE (name, avatar_url);</code></pre><h3 data-v-8ae616d5>Transaction &amp; Locking</h3><pre data-v-8ae616d5><code data-v-8ae616d5>-- Pessimistic Lock
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query(&quot;SELECT o FROM Order o WHERE o.id = :id&quot;)
Optional&lt;Order&gt; findByIdForUpdate(@Param(&quot;id&quot;) Long id);

-- Optimistic Lock — dùng version column
@Entity
public class Product {
    @Version
    private Long version;
}

-- Deadlock fix: luôn lock theo cùng thứ tự (id 1 → 2)</code></pre><h3 data-v-8ae616d5>Query Optimization</h3><ul data-v-8ae616d5><li data-v-8ae616d5><strong data-v-8ae616d5>EXPLAIN ANALYZE:</strong> xem seq scan vs index scan</li><li data-v-8ae616d5><strong data-v-8ae616d5>N+1:</strong> dùng JOIN FETCH, @EntityGraph</li><li data-v-8ae616d5><strong data-v-8ae616d5>Chỉ SELECT cần thiết:</strong> không SELECT *</li><li data-v-8ae616d5><strong data-v-8ae616d5>Pagination:</strong> keyset pagination thay vì OFFSET</li><li data-v-8ae616d5><strong data-v-8ae616d5>Connection pool:</strong> HikariCP size ~ 2*CPU + 1</li></ul></div></div><div class="section" id="nosql" data-v-8ae616d5><div class="section-title" data-v-8ae616d5>2. NoSQL Databases</div><div class="section-body" data-v-8ae616d5><div class="grid-2" data-v-8ae616d5><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Redis</h4><p data-v-8ae616d5>In-memory key-value. Cache, session, rate limiter, distributed lock, pub/sub.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>MongoDB</h4><p data-v-8ae616d5>Document DB (JSON-like). Flexible schema, nested data.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Cassandra</h4><p data-v-8ae616d5>Wide-column, write-optimized. Time-series, IoT, event logging.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Elasticsearch</h4><p data-v-8ae616d5>Full-text search + analytics. Logging, search engine.</p></div></div><h3 data-v-8ae616d5>Redis Patterns</h3><pre data-v-8ae616d5><code data-v-8ae616d5>// Cache Aside
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
// Lưu tokens + last_refill_time trong Redis Hash</code></pre></div></div><div class="section" id="mq" data-v-8ae616d5><div class="section-title" data-v-8ae616d5>3. Message Queue (Kafka &amp; RabbitMQ)</div><div class="section-body" data-v-8ae616d5><div class="grid-2" data-v-8ae616d5><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>🐇 RabbitMQ</h4><p data-v-8ae616d5>Message broker cổ điển. Exchange types: Direct, Topic, Fanout. Dùng cho: task queue, RPC, pub/sub.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>📊 Kafka</h4><p data-v-8ae616d5>Distributed event streaming. Topic, Partition, Consumer Group, Offset. Dùng cho: event sourcing, stream processing.</p></div></div><h3 data-v-8ae616d5>Spring Kafka</h3><pre data-v-8ae616d5><code data-v-8ae616d5>@RestController
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
}</code></pre><h3 data-v-8ae616d5>Kafka Streams</h3><pre data-v-8ae616d5><code data-v-8ae616d5>StreamsBuilder builder = new StreamsBuilder();
KStream&lt;String, OrderEvent&gt; stream = builder.stream(&quot;order-events&quot;);

KTable&lt;Long, Long&gt; countPerMinute = stream
    .filter((k, v) -&gt; &quot;CREATED&quot;.equals(v.getType()))
    .groupBy((k, v) -&gt; v.getProductId())
    .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
    .count();</code></pre></div></div><div class="section" id="docker" data-v-8ae616d5><div class="section-title" data-v-8ae616d5>4. Docker</div><div class="section-body" data-v-8ae616d5><h3 data-v-8ae616d5>Dockerfile cho Spring Boot</h3><pre data-v-8ae616d5><code data-v-8ae616d5># Multi-stage build
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
ENTRYPOINT [&quot;java&quot;, &quot;-jar&quot;, &quot;app.jar&quot;]</code></pre><h3 data-v-8ae616d5>docker-compose</h3><pre data-v-8ae616d5><code data-v-8ae616d5>version: &#39;3.8&#39;
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
      test: [&quot;CMD-SHELL&quot;, &quot;pg_isready -U postgres&quot;]</code></pre></div></div><div class="section" id="k8s" data-v-8ae616d5><div class="section-title" data-v-8ae616d5>5. Kubernetes</div><div class="section-body" data-v-8ae616d5><h3 data-v-8ae616d5>Deployment &amp; Service</h3><pre data-v-8ae616d5><code data-v-8ae616d5># deployment.yml
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
              memory: &quot;1Gi&quot;</code></pre><h3 data-v-8ae616d5>ConfigMap &amp; Secret</h3><pre data-v-8ae616d5><code data-v-8ae616d5>apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yml: |
    app:
      name: user-service
    spring:
      datasource:
        url: jdbc:postgresql://postgres:5432/users</code></pre><h3 data-v-8ae616d5>Horizontal Pod Autoscaler</h3><pre data-v-8ae616d5><code data-v-8ae616d5>apiVersion: autoscaling/v2
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
          averageUtilization: 70</code></pre></div></div><div class="section" id="cicd" data-v-8ae616d5><div class="section-title" data-v-8ae616d5>6. CI/CD</div><div class="section-body" data-v-8ae616d5><h3 data-v-8ae616d5>GitHub Actions</h3><pre data-v-8ae616d5><code data-v-8ae616d5>name: Build and Deploy
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
      - run: kubectl set image deployment/app app=registry.example.com/app:\${{ github.sha }}</code></pre><h3 data-v-8ae616d5>Git Flow</h3><div class="grid-2" data-v-8ae616d5><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>main</h4><p data-v-8ae616d5>Production-ready. Chỉ merge từ release/hotfix.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>develop</h4><p data-v-8ae616d5>Tích hợp feature branches.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>feature/xxx</h4><p data-v-8ae616d5>Nhánh từ develop. Tên theo ticket.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>release/v1.2</h4><p data-v-8ae616d5>Chuẩn bị release. Chỉ fix bug.</p></div></div><h3 data-v-8ae616d5>Code Quality Gates</h3><ul data-v-8ae616d5><li data-v-8ae616d5><strong data-v-8ae616d5>SonarQube:</strong> code smell, bug, coverage gate</li><li data-v-8ae616d5><strong data-v-8ae616d5>Checkstyle/PMD:</strong> coding convention</li><li data-v-8ae616d5><strong data-v-8ae616d5>OWASP Dependency Check:</strong> scan CVE</li><li data-v-8ae616d5><strong data-v-8ae616d5>Trivy:</strong> scan Docker image vulnerabilities</li></ul></div></div><div class="section" id="design" data-v-8ae616d5><div class="section-title" data-v-8ae616d5>7. System Design</div><div class="section-body" data-v-8ae616d5><h3 data-v-8ae616d5>CAP Theorem</h3><div class="diagram" data-v-8ae616d5> CAP Theorem<br data-v-8ae616d5> Consistency vs Availability<br data-v-8ae616d5> Partition Tolerance is mandatory </div><p data-v-8ae616d5>Trong distributed system, khi có network partition (P), bạn chỉ chọn được C (consistency) hoặc A (availability). Không có hệ thống nào có cả 3 cùng lúc.</p><h3 data-v-8ae616d5>Common Design Questions</h3><div class="grid-2" data-v-8ae616d5><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>URL Shortener</h4><p data-v-8ae616d5>Base62 encoding. Redis cache. DB sharding. 301 redirect.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Rate Limiter</h4><p data-v-8ae616d5>Token Bucket + Redis. Headers: X-RateLimit-Remaining.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Chat System</h4><p data-v-8ae616d5>WebSocket Gateway. Kafka message queue. Redis pub/sub.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Notification System</h4><p data-v-8ae616d5>Kafka → Push Worker, Email Worker, SMS Worker.</p></div></div><h3 data-v-8ae616d5>Estimation Cheat Sheet</h3><pre data-v-8ae616d5><code data-v-8ae616d5>1 request/second = 86,400 requests/day ≈ 2.5M/month
1M requests/day ≈ 12 requests/second
PostgreSQL: ~5k writes/s, ~50k reads/s (single node)
Redis: ~100k ops/s (single node)
Network latency: data center 0.5ms, same region 5ms</code></pre></div></div><div class="section" id="perf" data-v-8ae616d5><div class="section-title" data-v-8ae616d5>8. Performance Optimization</div><div class="section-body" data-v-8ae616d5><h3 data-v-8ae616d5>Caching Layers</h3><div class="diagram" data-v-8ae616d5> Client → CDN → Reverse Proxy → App Cache → Distributed Cache → Database </div><h3 data-v-8ae616d5>Application Optimization</h3><pre data-v-8ae616d5><code data-v-8ae616d5>// 1. Async xử lý non-critical tasks
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
Page&lt;User&gt; page = userRepo.findAll(PageRequest.of(0, 20));</code></pre><h3 data-v-8ae616d5>JVM Tuning</h3><pre data-v-8ae616d5><code data-v-8ae616d5># Docker memory limits
-XX:+UseContainerSupport
-XX:MaxRAMPercentage=75.0
-Xss512k
-XX:+UseG1GC
-XX:+HeapDumpOnOutOfMemoryError</code></pre></div></div><div class="section" id="arch" data-v-8ae616d5><div class="section-title" data-v-8ae616d5>9. Architecture Patterns</div><div class="section-body" data-v-8ae616d5><div class="grid-2" data-v-8ae616d5><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Monolithic</h4><p data-v-8ae616d5>1 ứng dụng, 1 DB. Đơn giản, dễ develop. Giới hạn: scaling.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Microservices</h4><p data-v-8ae616d5>Nhiều service nhỏ, độc lập. Cần: API Gateway, service discovery.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>CQRS + Event Sourcing</h4><p data-v-8ae616d5>Tách read/write model. Lưu events thay vì state.</p></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>Event-Driven</h4><p data-v-8ae616d5>Service giao tiếp qua events (Kafka). Saga pattern.</p></div></div><h3 data-v-8ae616d5>Outbox Pattern</h3><pre data-v-8ae616d5><code data-v-8ae616d5>@Transactional
public Order createOrder(CreateOrderRequest req) {
    Order order = orderRepo.save(toEntity(req));
    outboxRepo.save(new OutboxEvent(&quot;order&quot;, order.getId(), &quot;OrderCreated&quot;, serialize(req)));
    return order;
}
// CDC Worker — Debezium capture changes từ outbox → publish lên Kafka</code></pre></div></div>`,9),i(`div`,v,[l[5]||=i(`div`,{class:`section-title`},`10. Câu hỏi phỏng vấn Backend`,-1),i(`div`,y,[l[4]||=o(`<div class="grid-2" data-v-8ae616d5><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>🌱 Junior</h4><ul data-v-8ae616d5><li data-v-8ae616d5>ACID là gì?</li><li data-v-8ae616d5>INNER JOIN vs LEFT JOIN?</li><li data-v-8ae616d5>INDEX hoạt động thế nào?</li><li data-v-8ae616d5>Transaction isolation levels?</li><li data-v-8ae616d5>GET vs POST?</li></ul></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>📈 Middle</h4><ul data-v-8ae616d5><li data-v-8ae616d5>N+1 problem + fix?</li><li data-v-8ae616d5>Optimistic vs Pessimistic lock?</li><li data-v-8ae616d5>Redis dùng để làm gì?</li><li data-v-8ae616d5>Kafka partition?</li><li data-v-8ae616d5>Docker multi-stage build?</li></ul></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>🎯 Senior</h4><ul data-v-8ae616d5><li data-v-8ae616d5>CAP theorem?</li><li data-v-8ae616d5>Saga pattern?</li><li data-v-8ae616d5>Distributed caching?</li><li data-v-8ae616d5>Circuit Breaker?</li></ul></div><div class="card" data-v-8ae616d5><h4 data-v-8ae616d5>🏗️ Architect</h4><ul data-v-8ae616d5><li data-v-8ae616d5>Design URL shortener?</li><li data-v-8ae616d5>Design chat 10M users?</li><li data-v-8ae616d5>CQRS + Event Sourcing?</li></ul></div></div>`,1),i(`div`,b,[i(`a`,{href:`#`,onClick:l[2]||=s(e=>S.handleNav(`/salary-interview`),[`prevent`])},`💰 Luyện phỏng vấn theo mức lương →`)])])])])])}var S=a(d,[[`render`,x],[`__scopeId`,`data-v-8ae616d5`]]);export{S as default};