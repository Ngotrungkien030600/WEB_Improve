import{C as e,M as t,N as n,S as r,_ as i,b as ee,g as a,j as te,k as o,l as s,n as ne,p as c,u as re,x as ie,y as l}from"./index-aMSIWpVY.js";import{t as ae}from"./navigate-CnLvr0yu.js";import{t as u}from"./CodeBlock-QJCt7W_U.js";var d={class:`backend-page`},f={class:`page-header`},p={class:`header-content`},m={class:`header-nav`},h={class:`page-content`},g={class:`sidebar-toc`},_={class:`toc-container`},v={class:`toc-nav`},y=[`onClick`],b={class:`toc-num`},x={class:`toc-text`},S={class:`toc-progress`},C={class:`progress-bar`},w={class:`progress-value`},T={class:`main-content`},E={class:`section-body`},D={id:`nosql`,class:`content-section`},O={class:`section-body`},k={id:`mq`,class:`content-section`},A={class:`section-body`},j={id:`docker`,class:`content-section`},M={class:`section-body`},N={id:`k8s`,class:`content-section`},P={class:`section-body`},F={id:`cicd`,class:`content-section`},I={class:`section-body`},L={id:`design`,class:`content-section`},R={class:`section-body`},oe={id:`perf`,class:`content-section`},z={class:`section-body`},B={id:`arch`,class:`content-section`},V={class:`section-body`},H={id:`interview`,class:`content-section`},U={class:`section-body`},W={class:`interview-cta`},G=`-- B-Tree index (mặc định) — tốt cho =, >, <, BETWEEN, LIKE 'abc%'
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
CREATE INDEX idx_covering ON users(email) INCLUDE (name, avatar_url);`,K=`-- Pessimistic Lock
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT o FROM Order o WHERE o.id = :id")
Optional<Order> findByIdForUpdate(@Param("id") Long id);

-- Optimistic Lock — dùng version column
@Entity
public class Product {
    @Version
    private Long version;
}

-- Deadlock fix: luôn lock theo cùng thứ tự (id 1 → 2)`,q=`// Cache Aside
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
// Lưu tokens + last_refill_time trong Redis Hash`,se=`@RestController
public class OrderController {
    @Autowired private KafkaTemplate<String, OrderEvent> kafka;

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
}`,ce=`StreamsBuilder builder = new StreamsBuilder();
KStream<String, OrderEvent> stream = builder.stream("order-events");

KTable<Long, Long> countPerMinute = stream
    .filter((k, v) -> "CREATED".equals(v.getType()))
    .groupBy((k, v) -> v.getProductId())
    .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
    .count();`,le=`# Multi-stage build
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
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]`,ue=`version: '3.8'
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
      test: ["CMD-SHELL", "pg_isready -U postgres"]`,de=`# deployment.yml
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
              memory: "1Gi"`,fe=`apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yml: |
    app:
      name: user-service
    spring:
      datasource:
        url: jdbc:postgresql://postgres:5432/users`,pe=`apiVersion: autoscaling/v2
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
          averageUtilization: 70`,me=`name: Build and Deploy
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
          docker build -t registry.example.com/app:\${{ github.sha }} .
          docker push registry.example.com/app:\${{ github.sha }}
      - run: kubectl set image deployment/app app=registry.example.com/app:\${{ github.sha }}`,he=`1 request/second = 86,400 requests/day ≈ 2.5M/month
1M requests/day ≈ 12 requests/second
PostgreSQL: ~5k writes/s, ~50k reads/s (single node)
Redis: ~100k ops/s (single node)
Network latency: data center 0.5ms, same region 5ms`,ge=`// 1. Async xử lý non-critical tasks
@Async
public CompletableFuture<Void> sendEmail(User user) { ... }

// 2. Cache expensive operations
@Cacheable(value = "products", unless = "#result == null")
public Product getProduct(Long id) { ... }

// 3. Batch processing
public void importUsers(List<User> users) {
    userRepo.saveAll(users);  // 1 batch insert
}

// 4. Pagination
Page<User> page = userRepo.findAll(PageRequest.of(0, 20));`,_e=`# Docker memory limits
-XX:+UseContainerSupport
-XX:MaxRAMPercentage=75.0
-Xss512k
-XX:+UseG1GC
-XX:+HeapDumpOnOutOfMemoryError`,ve=`@Transactional
public Order createOrder(CreateOrderRequest req) {
    Order order = orderRepo.save(toEntity(req));
    outboxRepo.save(new OutboxEvent("order", order.getId(), "OrderCreated", serialize(req)));
    return order;
}
// CDC Worker — Debezium capture changes từ outbox → publish lên Kafka`,J=ne({__name:`JavaBackendPage`,setup(ne){let J=[{id:`sql`,num:`1`,title:`SQL & Database`},{id:`nosql`,num:`2`,title:`NoSQL`},{id:`mq`,num:`3`,title:`Message Queue`},{id:`docker`,num:`4`,title:`Docker`},{id:`k8s`,num:`5`,title:`Kubernetes`},{id:`cicd`,num:`6`,title:`CI/CD`},{id:`design`,num:`7`,title:`System Design`},{id:`perf`,num:`8`,title:`Performance`},{id:`arch`,num:`9`,title:`Architecture Patterns`},{id:`interview`,num:`10`,title:`Câu hỏi phỏng vấn`}],Y=o(``),X=o(0),Z=o([]),Q=e=>ae(e),ye=e=>{let t=document.getElementById(e);t&&t.scrollIntoView({behavior:`smooth`,block:`start`})},$=()=>{let e=window.scrollY,t=document.documentElement.scrollHeight-window.innerHeight;X.value=t>0?e/t*100:0;for(let e of J){let t=document.getElementById(e.id);if(t){let n=t.getBoundingClientRect();if(n.top<=150&&n.bottom>150){Y.value=e.id;break}}}};return ee(()=>{window.addEventListener(`scroll`,$),$()}),ie(()=>{window.removeEventListener(`scroll`,$)}),(ee,o)=>(r(),a(`div`,d,[c(`header`,f,[c(`div`,p,[c(`div`,m,[c(`button`,{class:`nav-btn`,onClick:o[0]||=e=>Q(`/java/hub`)},[...o[3]||=[c(`span`,null,`←`,-1),c(`span`,null,`Java`,-1)]]),c(`button`,{class:`nav-btn`,onClick:o[1]||=e=>Q(`/`)},[...o[4]||=[c(`span`,null,`🏠`,-1),c(`span`,null,`Trang chủ`,-1)]])]),o[5]||=c(`div`,{class:`header-title`},[c(`h1`,null,`⚙️ Backend Engineering`),c(`p`,{class:`desc`},`Database, Message Queue, Docker, K8s, CI/CD, System Design, Performance`)],-1)])]),c(`div`,h,[c(`aside`,g,[c(`div`,_,[o[7]||=c(`h3`,{class:`toc-title`},`Mục lục`,-1),c(`nav`,v,[(r(),a(re,null,e(J,e=>c(`a`,{key:e.id,href:`#`,class:te([`toc-link`,{active:Y.value===e.id}]),onClick:s(t=>ye(e.id),[`prevent`])},[c(`span`,b,n(e.num)+`.`,1),c(`span`,x,n(e.title),1)],10,y)),64))]),c(`div`,S,[o[6]||=c(`span`,{class:`progress-label`},`Tiến độ`,-1),c(`div`,C,[c(`div`,{class:`progress-fill`,style:t({width:`${X.value}%`})},null,4)]),c(`span`,w,n(Math.round(X.value))+`%`,1)])])]),c(`main`,T,[c(`section`,{id:`sql`,class:`content-section`,ref_key:`sectionRefs`,ref:Z},[o[11]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`01`),c(`h2`,{class:`section-title`},`SQL & Database`)],-1),c(`div`,E,[o[8]||=i(`<h3 data-v-09bcb01a>ACID Properties</h3><div class="cards-grid" data-v-09bcb01a><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Atomicity</h4><p data-v-09bcb01a>Toàn bộ hoặc không gì cả. Transaction commit → all changes. Rollback → không thay đổi nào.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Consistency</h4><p data-v-09bcb01a>Dữ liệu từ trạng thái hợp lệ này sang hợp lệ khác. Ràng buộc (FK, unique, check) luôn được đảm bảo.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Isolation</h4><p data-v-09bcb01a>Transaction không ảnh hưởng lẫn nhau. Các mức: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Durability</h4><p data-v-09bcb01a>Dữ liệu đã commit được lưu vĩnh viễn. Dùng WAL (Write-Ahead Log) để phục hồi khi crash.</p></div></div><h3 data-v-09bcb01a>Index chi tiết</h3>`,3),l(u,{code:G,language:`sql`}),o[9]||=c(`h3`,null,`Transaction & Locking`,-1),l(u,{code:K,language:`java`}),o[10]||=i(`<h3 data-v-09bcb01a>Query Optimization</h3><ul class="tips-list" data-v-09bcb01a><li data-v-09bcb01a><strong data-v-09bcb01a>EXPLAIN ANALYZE:</strong> xem seq scan vs index scan</li><li data-v-09bcb01a><strong data-v-09bcb01a>N+1:</strong> dùng JOIN FETCH, @EntityGraph</li><li data-v-09bcb01a><strong data-v-09bcb01a>Chỉ SELECT cần thiết:</strong> không SELECT *</li><li data-v-09bcb01a><strong data-v-09bcb01a>Pagination:</strong> keyset pagination thay vì OFFSET</li><li data-v-09bcb01a><strong data-v-09bcb01a>Connection pool:</strong> HikariCP size ~ 2*CPU + 1</li></ul>`,2)])],512),c(`section`,D,[o[13]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`02`),c(`h2`,{class:`section-title`},`NoSQL Databases`)],-1),c(`div`,O,[o[12]||=i(`<div class="cards-grid cols-4" data-v-09bcb01a><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Redis</h4><p data-v-09bcb01a>In-memory key-value. Cache, session, rate limiter, distributed lock, pub/sub.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>MongoDB</h4><p data-v-09bcb01a>Document DB (JSON-like). Flexible schema, nested data.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Cassandra</h4><p data-v-09bcb01a>Wide-column, write-optimized. Time-series, IoT, event logging.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Elasticsearch</h4><p data-v-09bcb01a>Full-text search + analytics. Logging, search engine.</p></div></div><h3 data-v-09bcb01a>Redis Patterns</h3>`,2),l(u,{code:q,language:`java`})])]),c(`section`,k,[o[17]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`03`),c(`h2`,{class:`section-title`},`Message Queue (Kafka & RabbitMQ)`)],-1),c(`div`,A,[o[14]||=c(`div`,{class:`cards-grid cols-2`},[c(`div`,{class:`info-card`},[c(`h4`,null,`🐇 RabbitMQ`),c(`p`,null,`Message broker cổ điển. Exchange types: Direct, Topic, Fanout. Dùng cho: task queue, RPC, pub/sub.`)]),c(`div`,{class:`info-card`},[c(`h4`,null,`📊 Kafka`),c(`p`,null,`Distributed event streaming. Topic, Partition, Consumer Group, Offset. Dùng cho: event sourcing, stream processing.`)])],-1),o[15]||=c(`h3`,null,`Spring Kafka`,-1),l(u,{code:se,language:`java`}),o[16]||=c(`h3`,null,`Kafka Streams`,-1),l(u,{code:ce,language:`java`})])]),c(`section`,j,[o[20]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`04`),c(`h2`,{class:`section-title`},`Docker`)],-1),c(`div`,M,[o[18]||=c(`h3`,null,`Dockerfile cho Spring Boot`,-1),l(u,{code:le,language:`dockerfile`}),o[19]||=c(`h3`,null,`docker-compose`,-1),l(u,{code:ue,language:`yaml`})])]),c(`section`,N,[o[24]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`05`),c(`h2`,{class:`section-title`},`Kubernetes`)],-1),c(`div`,P,[o[21]||=c(`h3`,null,`Deployment & Service`,-1),l(u,{code:de,language:`yaml`}),o[22]||=c(`h3`,null,`ConfigMap & Secret`,-1),l(u,{code:fe,language:`yaml`}),o[23]||=c(`h3`,null,`Horizontal Pod Autoscaler`,-1),l(u,{code:pe,language:`yaml`})])]),c(`section`,F,[o[27]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`06`),c(`h2`,{class:`section-title`},`CI/CD`)],-1),c(`div`,I,[o[25]||=c(`h3`,null,`GitHub Actions`,-1),l(u,{code:me,language:`yaml`}),o[26]||=i(`<h3 data-v-09bcb01a>Git Flow</h3><div class="cards-grid cols-4" data-v-09bcb01a><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>main</h4><p data-v-09bcb01a>Production-ready. Chỉ merge từ release/hotfix.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>develop</h4><p data-v-09bcb01a>Tích hợp feature branches.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>feature/xxx</h4><p data-v-09bcb01a>Nhánh từ develop. Tên theo ticket.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>release/v1.2</h4><p data-v-09bcb01a>Chuẩn bị release. Chỉ fix bug.</p></div></div><h3 data-v-09bcb01a>Code Quality Gates</h3><ul class="tips-list" data-v-09bcb01a><li data-v-09bcb01a><strong data-v-09bcb01a>SonarQube:</strong> code smell, bug, coverage gate</li><li data-v-09bcb01a><strong data-v-09bcb01a>Checkstyle/PMD:</strong> coding convention</li><li data-v-09bcb01a><strong data-v-09bcb01a>OWASP Dependency Check:</strong> scan CVE</li><li data-v-09bcb01a><strong data-v-09bcb01a>Trivy:</strong> scan Docker image vulnerabilities</li></ul>`,4)])]),c(`section`,L,[o[29]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`07`),c(`h2`,{class:`section-title`},`System Design`)],-1),c(`div`,R,[o[28]||=i(`<h3 data-v-09bcb01a>CAP Theorem</h3><div class="diagram" data-v-09bcb01a> CAP Theorem<br data-v-09bcb01a> Consistency vs Availability<br data-v-09bcb01a> Partition Tolerance is mandatory </div><p class="section-text" data-v-09bcb01a>Trong distributed system, khi có network partition (P), bạn chỉ chọn được C (consistency) hoặc A (availability). Không có hệ thống nào có cả 3 cùng lúc.</p><h3 data-v-09bcb01a>Common Design Questions</h3><div class="cards-grid cols-4" data-v-09bcb01a><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>URL Shortener</h4><p data-v-09bcb01a>Base62 encoding. Redis cache. DB sharding. 301 redirect.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Rate Limiter</h4><p data-v-09bcb01a>Token Bucket + Redis. Headers: X-RateLimit-Remaining.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Chat System</h4><p data-v-09bcb01a>WebSocket Gateway. Kafka message queue. Redis pub/sub.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Notification System</h4><p data-v-09bcb01a>Kafka → Push Worker, Email Worker, SMS Worker.</p></div></div><h3 data-v-09bcb01a>Estimation Cheat Sheet</h3>`,6),l(u,{code:he,language:`bash`})])]),c(`section`,oe,[o[34]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`08`),c(`h2`,{class:`section-title`},`Performance Optimization`)],-1),c(`div`,z,[o[30]||=c(`h3`,null,`Caching Layers`,-1),o[31]||=c(`div`,{class:`diagram`},` Client → CDN → Reverse Proxy → App Cache → Distributed Cache → Database `,-1),o[32]||=c(`h3`,null,`Application Optimization`,-1),l(u,{code:ge,language:`java`}),o[33]||=c(`h3`,null,`JVM Tuning`,-1),l(u,{code:_e,language:`bash`})])]),c(`section`,B,[o[36]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`09`),c(`h2`,{class:`section-title`},`Architecture Patterns`)],-1),c(`div`,V,[o[35]||=i(`<div class="cards-grid cols-4" data-v-09bcb01a><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Monolithic</h4><p data-v-09bcb01a>1 ứng dụng, 1 DB. Đơn giản, dễ develop. Giới hạn: scaling.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Microservices</h4><p data-v-09bcb01a>Nhiều service nhỏ, độc lập. Cần: API Gateway, service discovery.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>CQRS + Event Sourcing</h4><p data-v-09bcb01a>Tách read/write model. Lưu events thay vì state.</p></div><div class="info-card" data-v-09bcb01a><h4 data-v-09bcb01a>Event-Driven</h4><p data-v-09bcb01a>Service giao tiếp qua events (Kafka). Saga pattern.</p></div></div><h3 data-v-09bcb01a>Outbox Pattern</h3>`,2),l(u,{code:ve,language:`java`})])]),c(`section`,H,[o[38]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`10`),c(`h2`,{class:`section-title`},`Câu hỏi phỏng vấn Backend`)],-1),c(`div`,U,[o[37]||=i(`<div class="cards-grid cols-4" data-v-09bcb01a><div class="info-card level-junior" data-v-09bcb01a><h4 data-v-09bcb01a>🌱 Junior</h4><ul data-v-09bcb01a><li data-v-09bcb01a>ACID là gì?</li><li data-v-09bcb01a>INNER JOIN vs LEFT JOIN?</li><li data-v-09bcb01a>INDEX hoạt động thế nào?</li><li data-v-09bcb01a>Transaction isolation levels?</li><li data-v-09bcb01a>GET vs POST?</li></ul></div><div class="info-card level-middle" data-v-09bcb01a><h4 data-v-09bcb01a>📈 Middle</h4><ul data-v-09bcb01a><li data-v-09bcb01a>N+1 problem + fix?</li><li data-v-09bcb01a>Optimistic vs Pessimistic lock?</li><li data-v-09bcb01a>Redis dùng để làm gì?</li><li data-v-09bcb01a>Kafka partition?</li><li data-v-09bcb01a>Docker multi-stage build?</li></ul></div><div class="info-card level-senior" data-v-09bcb01a><h4 data-v-09bcb01a>🎯 Senior</h4><ul data-v-09bcb01a><li data-v-09bcb01a>CAP theorem?</li><li data-v-09bcb01a>Saga pattern?</li><li data-v-09bcb01a>Distributed caching?</li><li data-v-09bcb01a>Circuit Breaker?</li></ul></div><div class="info-card level-architect" data-v-09bcb01a><h4 data-v-09bcb01a>🏗️ Architect</h4><ul data-v-09bcb01a><li data-v-09bcb01a>Design URL shortener?</li><li data-v-09bcb01a>Design chat 10M users?</li><li data-v-09bcb01a>CQRS + Event Sourcing?</li></ul></div></div>`,1),c(`div`,W,[c(`a`,{href:`#`,onClick:o[2]||=s(e=>Q(`/salary-interview`),[`prevent`])},`💰 Luyện phỏng vấn theo mức lương →`)])])])])])]))}},[[`__scopeId`,`data-v-09bcb01a`]]);export{J as default};