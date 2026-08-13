import{C as e,E as t,M as ee,P as n,S as r,T as i,_ as a,g as o,l as s,m as c,n as l,p as u,u as d,v as f,y as p}from"./index-DO2FyL4v.js";import{t as m}from"./navigate-BqqpeOlv.js";import{t as h}from"./CodeBlock-DUJcANml.js";var g=`-- B-Tree index (mặc định) — tốt cho =, >, <, BETWEEN, LIKE 'abc%'
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
CREATE INDEX idx_covering ON users(email) INCLUDE (name, avatar_url);`,_=`-- Pessimistic Lock
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT o FROM Order o WHERE o.id = :id")
Optional<Order> findByIdForUpdate(@Param("id") Long id);

-- Optimistic Lock — dùng version column
@Entity
public class Product {
    @Version
    private Long version;
}

-- Deadlock fix: luôn lock theo cùng thứ tự (id 1 → 2)`,v={name:`BackendSectionSql`,components:{CodeBlock:h},data(){return{indexCode:g,transactionCode:_}}},y={class:`bs-section`};function te(e,t,ee,n,s,c){let l=i(`CodeBlock`);return r(),o(`div`,y,[t[0]||=a(`<h3 data-v-52aff54f>ACID — tại sao transaction đáng tin cậy?</h3><p class="section-text" data-v-52aff54f>ACID là 4 đặc tính đảm bảo dữ liệu <strong data-v-52aff54f>không bao giờ sai dù app crash, server tắt đột ngột, hay nhiều người ghi cùng lúc</strong>. Đây là lý do SQL vẫn là lựa chọn số 1 cho dữ liệu tiền bạc, đơn hàng, giao dịch.</p><div class="cards-grid" data-v-52aff54f><div class="info-card" data-v-52aff54f><h4 data-v-52aff54f>Atomicity</h4><p data-v-52aff54f>Toàn bộ hoặc không gì cả. Transaction commit → all changes. Rollback → không thay đổi nào. VD: chuyển tiền phải trừ A + cộng B cùng xảy ra, không thể chỉ trừ.</p></div><div class="info-card" data-v-52aff54f><h4 data-v-52aff54f>Consistency</h4><p data-v-52aff54f>Dữ liệu từ trạng thái hợp lệ này sang hợp lệ khác. Ràng buộc (FK, unique, check) luôn được đảm bảo. DB không bao giờ ở trạng thái &quot;nửa chừng&quot;.</p></div><div class="info-card" data-v-52aff54f><h4 data-v-52aff54f>Isolation</h4><p data-v-52aff54f>Transaction không ảnh hưởng lẫn nhau. Các mức: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE. Mức cao hơn → an toàn hơn nhưng chậm hơn.</p></div><div class="info-card" data-v-52aff54f><h4 data-v-52aff54f>Durability</h4><p data-v-52aff54f>Dữ liệu đã commit được lưu vĩnh viễn. Dùng WAL (Write-Ahead Log) để phục hồi khi crash. Không mất dữ liệu khi mất điện.</p></div></div><h3 data-v-52aff54f>Index — tại sao query nhanh?</h3><p class="section-text" data-v-52aff54f>Không có index, DB phải <strong data-v-52aff54f>quét toàn bộ bảng</strong> (full scan) để tìm dữ liệu — hàng triệu dòng = chậm. Index (thường là B-Tree) giống mục lục sách: tìm theo <code data-v-52aff54f>=</code>, <code data-v-52aff54f>&gt;</code>, <code data-v-52aff54f>&lt;</code>, <code data-v-52aff54f>BETWEEN</code> trong log(n) thay vì n. <strong data-v-52aff54f>Chi phí:</strong> mỗi index làm INSERT/UPDATE chậm hơn một chút — nên index đúng cột hay được query.</p>`,5),p(l,{code:s.indexCode,language:`sql`},null,8,[`code`]),t[1]||=u(`h3`,null,`Transaction & Locking — tránh race condition`,-1),t[2]||=u(`p`,{class:`section-text`},[f(`Khi 2 request cùng sửa 1 record, cần `),u(`strong`,null,`lock`),f(`: `),u(`em`,null,`Pessimistic`),f(` khóa record ngay (chắc chắn, chậm hơn), `),u(`em`,null,`Optimistic`),f(` dùng cột `),u(`code`,null,`@Version`),f(` — ai commit trước thắng, ai sau bị lỗi và phải thử lại. `),u(`strong`,null,`Deadlock`),f(` xảy ra khi 2 transaction giữ lock chờ nhau — fix bằng cách luôn lock theo cùng thứ tự.`)],-1),p(l,{code:s.transactionCode,language:`java`},null,8,[`code`]),t[3]||=a(`<h3 data-v-52aff54f>Query Optimization — chiến thuật thực tế</h3><ul class="tips-list" data-v-52aff54f><li data-v-52aff54f><strong data-v-52aff54f>EXPLAIN ANALYZE:</strong> xem seq scan vs index scan — bắt query chạy chậm</li><li data-v-52aff54f><strong data-v-52aff54f>N+1:</strong> dùng JOIN FETCH, @EntityGraph</li><li data-v-52aff54f><strong data-v-52aff54f>Chỉ SELECT cần thiết:</strong> không SELECT *</li><li data-v-52aff54f><strong data-v-52aff54f>Pagination:</strong> keyset pagination thay vì OFFSET (OFFSET chậm khi page lớn)</li><li data-v-52aff54f><strong data-v-52aff54f>Connection pool:</strong> HikariCP size ~ 2*CPU + 1</li></ul>`,2)])}var b=l(v,[[`render`,te],[`__scopeId`,`data-v-52aff54f`]]),ne=`// Cache Aside
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
// Lưu tokens + last_refill_time trong Redis Hash`,re={name:`BackendSectionNosql`,components:{CodeBlock:h},data(){return{redisCode:ne}}},ie={class:`bs-section`};function ae(e,t,ee,n,s,c){let l=i(`CodeBlock`);return r(),o(`div`,ie,[t[0]||=a(`<h3 data-v-5cabc4bc>NoSQL — khi nào dùng thay SQL?</h3><p class="section-text" data-v-5cabc4bc><strong data-v-5cabc4bc>NoSQL</strong> hy sinh transaction/join mạnh để đổi lấy <strong data-v-5cabc4bc>scale ngang, độ trễ thấp, schema linh hoạt</strong>. Chọn theo bài toán: cache → Redis, document linh hoạt → MongoDB, ghi log khổng lồ → Cassandra, tìm kiếm → Elasticsearch. Không phải &quot;NoSQL thay thế SQL&quot; — mà mỗi loại giải quyết 1 lớp bài toán riêng.</p><div class="cards-grid cols-4" data-v-5cabc4bc><div class="info-card" data-v-5cabc4bc><h4 data-v-5cabc4bc>Redis</h4><p data-v-5cabc4bc>In-memory key-value. Cache, session, rate limiter, distributed lock, pub/sub. Nhanh nhất (~100k ops/s) nhưng dữ liệu trong RAM.</p></div><div class="info-card" data-v-5cabc4bc><h4 data-v-5cabc4bc>MongoDB</h4><p data-v-5cabc4bc>Document DB (JSON-like). Flexible schema, nested data. Hợp: catalog, content, user profile thay đổi thường xuyên.</p></div><div class="info-card" data-v-5cabc4bc><h4 data-v-5cabc4bc>Cassandra</h4><p data-v-5cabc4bc>Wide-column, write-optimized. Time-series, IoT, event logging — ghi cực nhanh với khối lượng khổng lồ.</p></div><div class="info-card" data-v-5cabc4bc><h4 data-v-5cabc4bc>Elasticsearch</h4><p data-v-5cabc4bc>Full-text search + analytics. Logging, search engine. Index tìm kiếm, không phải nguồn dữ liệu chính.</p></div></div><h3 data-v-5cabc4bc>Redis Patterns — 3 pattern phổ biến nhất</h3><p class="section-text" data-v-5cabc4bc><strong data-v-5cabc4bc>Cache Aside</strong> là pattern cơ bản nhất: đọc cache trước, miss thì đọc DB rồi ghi cache. <strong data-v-5cabc4bc>Distributed Lock</strong> chống 2 instance xử lý cùng 1 task. <strong data-v-5cabc4bc>Rate Limiter</strong> giới hạn request/giây chống abuse. Cả 3 đều là nền tảng của mọi hệ thống backend hiện đại.</p>`,5),p(l,{code:s.redisCode,language:`java`},null,8,[`code`])])}var x=l(re,[[`render`,ae],[`__scopeId`,`data-v-5cabc4bc`]]),S=`@RestController
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
}`,C=`StreamsBuilder builder = new StreamsBuilder();
KStream<String, OrderEvent> stream = builder.stream("order-events");

KTable<Long, Long> countPerMinute = stream
    .filter((k, v) -> "CREATED".equals(v.getType()))
    .groupBy((k, v) -> v.getProductId())
    .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
    .count();`,w={name:`BackendSectionMq`,components:{CodeBlock:h},data(){return{kafkaCode:S,kafkaStreamsCode:C}}},T={class:`bs-section`};function E(e,t,ee,n,s,c){let l=i(`CodeBlock`);return r(),o(`div`,T,[t[0]||=a(`<h3 data-v-b6715671>Message Queue — tại sao cần?</h3><p class="section-text" data-v-b6715671>MQ giúp tách rời các service: producer gửi tin <strong data-v-b6715671>không cần biết ai nhận</strong>, consumer xử lý khi sẵn sàng. Lợi ích: <strong data-v-b6715671>giảm tải đột biến</strong> (queue hấp thụ), <strong data-v-b6715671>retry</strong> khi consumer lỗi, <strong data-v-b6715671>đảm bảo không mất tin</strong>. Nếu không có MQ, khi đặt hàng bạn phải gọi thẳng email + SMS + notification — một service chậm sẽ làm chậm cả luồng.</p><div class="cards-grid cols-2" data-v-b6715671><div class="info-card" data-v-b6715671><h4 data-v-b6715671>🐇 RabbitMQ</h4><p data-v-b6715671>Message broker cổ điển. Exchange types: Direct, Topic, Fanout. Dùng cho: task queue, RPC, pub/sub. Hợp khi cần routing linh hoạt.</p></div><div class="info-card" data-v-b6715671><h4 data-v-b6715671>📊 Kafka</h4><p data-v-b6715671>Distributed event streaming. Topic, Partition, Consumer Group, Offset. Dùng cho: event sourcing, stream processing. Hợp khi cần throughput khổng lồ + replay.</p></div></div><h3 data-v-b6715671>Spring Kafka — producer &amp; consumer</h3><p class="section-text" data-v-b6715671>Producer dùng <code data-v-b6715671>KafkaTemplate</code> gửi tin vào topic, consumer dùng <code data-v-b6715671>@KafkaListener</code> xử lý bất đồng bộ. <strong data-v-b6715671>Consumer Group</strong> đảm bảo mỗi tin chỉ được xử lý 1 lần trong group — mở rộng bằng cách thêm instance vào group.</p>`,5),p(l,{code:s.kafkaCode,language:`java`},null,8,[`code`]),t[1]||=u(`h3`,null,`Kafka Streams — xử lý dữ liệu ngay trong Kafka`,-1),t[2]||=u(`p`,{class:`section-text`},[f(`Thay vì kéo dữ liệu ra ngoài xử lý, `),u(`strong`,null,`Kafka Streams`),f(` xử lý ngay trong luồng: lọc, group, đếm theo cửa sổ thời gian. VD: đếm số đơn hàng mỗi phút theo sản phẩm — phục vụ real-time analytics mà không cần hệ thống riêng.`)],-1),p(l,{code:s.kafkaStreamsCode,language:`java`},null,8,[`code`])])}var D=l(w,[[`render`,E],[`__scopeId`,`data-v-b6715671`]]),O=`# Multi-stage build
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
ENTRYPOINT ["java", "-jar", "app.jar"]`,k=`version: '3.8'
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
      test: ["CMD-SHELL", "pg_isready -U postgres"]`,A={name:`BackendSectionDocker`,components:{CodeBlock:h},data(){return{dockerfileCode:O,dockerComposeCode:k}}},j={class:`bs-section`};function M(e,t,ee,n,s,c){let l=i(`CodeBlock`);return r(),o(`div`,j,[t[0]||=a(`<h3 data-v-2f60ffe5>Docker — tại sao mọi backend team cần?</h3><p class="section-text" data-v-2f60ffe5>Docker đóng gói app + môi trường (JDK, dependencies, config) vào 1 image chạy được ở <strong data-v-2f60ffe5>mọi nơi</strong>: máy dev, CI, server. Hết bài toán &quot;chạy được trên máy tôi&quot;. Đây là nền tảng cho microservices, K8s, và CI/CD — deploy cùng 1 image từ dev đến production.</p><h3 data-v-2f60ffe5>Dockerfile cho Spring Boot — multi-stage build</h3><p class="section-text" data-v-2f60ffe5>Multi-stage tách 2 giai đoạn: <strong data-v-2f60ffe5>build</strong> (đầy đủ JDK + Maven) và <strong data-v-2f60ffe5>runtime</strong> (chỉ JRE nhẹ). Image cuối nhỏ hơn nhiều, an toàn hơn. Chạy với <strong data-v-2f60ffe5>user non-root</strong> và <code data-v-2f60ffe5>HEALTHCHECK</code> — để K8s biết app còn sống không.</p>`,4),p(l,{code:s.dockerfileCode,language:`dockerfile`},null,8,[`code`]),t[1]||=u(`h3`,null,`docker-compose — chạy nhiều service cùng lúc`,-1),t[2]||=u(`p`,{class:`section-text`},[f(`Một file YAML khai báo toàn bộ stack: app + PostgreSQL + Redis... `),u(`code`,null,`depends_on + healthcheck`),f(` đảm bảo app chỉ start khi DB sẵn sàng — chuẩn cho local dev và cả staging.`)],-1),p(l,{code:s.dockerComposeCode,language:`yaml`},null,8,[`code`])])}var N=l(A,[[`render`,M],[`__scopeId`,`data-v-2f60ffe5`]]),P=`# deployment.yml
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
              memory: "1Gi"`,F=`apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yml: |
    app:
      name: user-service
    spring:
      datasource:
        url: jdbc:postgresql://postgres:5432/users`,I=`apiVersion: autoscaling/v2
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
          averageUtilization: 70`,L={name:`BackendSectionK8s`,components:{CodeBlock:h},data(){return{k8sDeploymentCode:P,k8sConfigMapCode:F,k8sHpaCode:I}}},R={class:`bs-section`};function z(e,t,ee,n,s,c){let l=i(`CodeBlock`);return r(),o(`div`,R,[t[0]||=a(`<h3 data-v-c2e833ad>Kubernetes — tại sao cần khi đã có Docker?</h3><p class="section-text" data-v-c2e833ad>Docker chạy container, nhưng <strong data-v-c2e833ad>K8s quản lý hàng trăm container</strong>: tự deploy, scale, self-heal, load balance. Khi traffic tăng, K8s tự tạo thêm pod; pod chết thì tự tạo lại. Đây là lớp vận hành mà production thật cần — Docker chỉ giải quyết 1 container, K8s giải quyết cả hệ thống.</p><h3 data-v-c2e833ad>Deployment &amp; Service — khai báo trạng thái mong muốn</h3><p class="section-text" data-v-c2e833ad><strong data-v-c2e833ad>Deployment</strong> khai báo &quot;tôi muốn 3 replicas&quot; — K8s tự duy trì con số đó. <strong data-v-c2e833ad>RollingUpdate</strong> thay từng pod một, không downtime. <strong data-v-c2e833ad>Probes</strong> (liveness/readiness) giúp K8s biết pod sống và sẵn sàng nhận traffic — app phải expose <code data-v-c2e833ad>/actuator/health</code>.</p>`,4),p(l,{code:s.k8sDeploymentCode,language:`yaml`},null,8,[`code`]),t[1]||=u(`h3`,null,`ConfigMap & Secret — tách config khỏi image`,-1),t[2]||=u(`p`,{class:`section-text`},[u(`strong`,null,`ConfigMap`),f(` chứa cấu hình không nhạy cảm (application.yml), `),u(`strong`,null,`Secret`),f(` chứa dữ liệu mật (password, token). Tách ra để: đổi config không cần build lại image, và không bao giờ commit secret vào repo/image.`)],-1),p(l,{code:s.k8sConfigMapCode,language:`yaml`},null,8,[`code`]),t[3]||=u(`h3`,null,`HPA — tự scale theo tải`,-1),t[4]||=u(`p`,{class:`section-text`},[u(`strong`,null,`HorizontalPodAutoscaler`),f(` tự tăng/giảm số pod theo CPU/memory. Chạy 2 pod lúc thấp điểm, scale lên 10 khi cao điểm, rồi tự giảm về — không cần can thiệp tay, tiết kiệm chi phí.`)],-1),p(l,{code:s.k8sHpaCode,language:`yaml`},null,8,[`code`])])}var B=l(L,[[`render`,z],[`__scopeId`,`data-v-c2e833ad`]]),V=`name: Build and Deploy
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
      - run: kubectl set image deployment/app app=registry.example.com/app:\${{ github.sha }}`,H={name:`BackendSectionCicd`,components:{CodeBlock:h},data(){return{githubActionsCode:V}}},U={class:`bs-section`};function W(e,t,ee,n,s,c){let l=i(`CodeBlock`);return r(),o(`div`,U,[t[0]||=u(`h3`,null,`CI/CD — tự động hóa từ commit đến production`,-1),t[1]||=u(`p`,{class:`section-text`},[u(`strong`,null,`CI (Continuous Integration):`),f(` mỗi commit được build + test tự động → phát hiện lỗi sớm. `),u(`strong`,null,`CD (Continuous Deployment):`),f(` artifact đạt chuẩn tự động deploy. Kết quả: deploy nhanh, ít lỗi do tay, và mọi người trong team đều thấy pipeline trạng thái như nhau.`)],-1),t[2]||=u(`h3`,null,`GitHub Actions — pipeline trong repo`,-1),t[3]||=u(`p`,{class:`section-text`},[f(`Workflow YAML nằm ngay trong repo: push lên `),u(`code`,null,`main`),f(` → chạy test → build Docker image → push registry → update K8s deployment. Toàn bộ tự động, có log, có thể review như code.`)],-1),p(l,{code:s.githubActionsCode,language:`yaml`},null,8,[`code`]),t[4]||=a(`<h3 data-v-615ef0c2>Git Flow — nhánh chuẩn cho team</h3><div class="cards-grid cols-4" data-v-615ef0c2><div class="info-card" data-v-615ef0c2><h4 data-v-615ef0c2>main</h4><p data-v-615ef0c2>Production-ready. Chỉ merge từ release/hotfix.</p></div><div class="info-card" data-v-615ef0c2><h4 data-v-615ef0c2>develop</h4><p data-v-615ef0c2>Tích hợp feature branches.</p></div><div class="info-card" data-v-615ef0c2><h4 data-v-615ef0c2>feature/xxx</h4><p data-v-615ef0c2>Nhánh từ develop. Tên theo ticket.</p></div><div class="info-card" data-v-615ef0c2><h4 data-v-615ef0c2>release/v1.2</h4><p data-v-615ef0c2>Chuẩn bị release. Chỉ fix bug.</p></div></div><h3 data-v-615ef0c2>Code Quality Gates — chặn code xấu trước khi vào production</h3><ul class="tips-list" data-v-615ef0c2><li data-v-615ef0c2><strong data-v-615ef0c2>SonarQube:</strong> code smell, bug, coverage gate</li><li data-v-615ef0c2><strong data-v-615ef0c2>Checkstyle/PMD:</strong> coding convention</li><li data-v-615ef0c2><strong data-v-615ef0c2>OWASP Dependency Check:</strong> scan CVE (lỗ hổng bảo mật trong thư viện)</li><li data-v-615ef0c2><strong data-v-615ef0c2>Trivy:</strong> scan Docker image vulnerabilities</li></ul>`,4)])}var G=l(H,[[`render`,W],[`__scopeId`,`data-v-615ef0c2`]]),K=`1 request/second = 86,400 requests/day ≈ 2.5M/month
1M requests/day ≈ 12 requests/second
PostgreSQL: ~5k writes/s, ~50k reads/s (single node)
Redis: ~100k ops/s (single node)
Network latency: data center 0.5ms, same region 5ms`,q={name:`BackendSectionDesign`,components:{CodeBlock:h},data(){return{estimationCode:K}}},J={class:`bs-section`};function oe(e,t,ee,n,s,c){let l=i(`CodeBlock`);return r(),o(`div`,J,[t[0]||=a(`<h3 data-v-1777ed85>CAP Theorem — chọn gì khi hệ thống phân mảnh?</h3><div class="diagram" data-v-1777ed85> CAP Theorem<br data-v-1777ed85> Consistency vs Availability<br data-v-1777ed85> Partition Tolerance is mandatory </div><p class="section-text" data-v-1777ed85>Khi network partition (P) xảy ra — 2 máy không liên lạc được — bạn <strong data-v-1777ed85>bắt buộc chọn</strong>: hoặc dữ liệu nhất quán (C, chặn ghi để tránh sai lệch) hoặc luôn phục vụ (A, chấp nhận dữ liệu có thể lệch tạm thời). Không hệ thống nào có cả 3. <strong data-v-1777ed85>Áp dụng thực tế:</strong> ngân hàng chọn C, social feed chọn A.</p><h3 data-v-1777ed85>Bài toán thiết kế kinh điển</h3><div class="cards-grid cols-4" data-v-1777ed85><div class="info-card" data-v-1777ed85><h4 data-v-1777ed85>URL Shortener</h4><p data-v-1777ed85>Base62 encoding. Redis cache. DB sharding. 301 redirect. Hỏi: collision xử lý sao? scale đọc/ghi?</p></div><div class="info-card" data-v-1777ed85><h4 data-v-1777ed85>Rate Limiter</h4><p data-v-1777ed85>Token Bucket + Redis. Headers: X-RateLimit-Remaining. Hỏi: distributed + consistent?</p></div><div class="info-card" data-v-1777ed85><h4 data-v-1777ed85>Chat System</h4><p data-v-1777ed85>WebSocket Gateway. Kafka message queue. Redis pub/sub. Hỏi: message order, offline message?</p></div><div class="info-card" data-v-1777ed85><h4 data-v-1777ed85>Notification System</h4><p data-v-1777ed85>Kafka → Push Worker, Email Worker, SMS Worker. Hỏi: retry khi worker chết?</p></div></div><h3 data-v-1777ed85>Ước lượng nhanh — cheat sheet</h3><p class="section-text" data-v-1777ed85>Khi thiết kế hệ thống, nhà phỏng vấn muốn bạn ước lượng được tải: QPS, dung lượng, băng thông. Ghi nhớ các con số chuẩn này để trả lời nhanh.</p>`,7),p(l,{code:s.estimationCode,language:`bash`},null,8,[`code`])])}var Y=l(q,[[`render`,oe],[`__scopeId`,`data-v-1777ed85`]]),se=`// 1. Async xử lý non-critical tasks
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
Page<User> page = userRepo.findAll(PageRequest.of(0, 20));`,ce=`# Docker memory limits
-XX:+UseContainerSupport
-XX:MaxRAMPercentage=75.0
-Xss512k
-XX:+UseG1GC
-XX:+HeapDumpOnOutOfMemoryError`,le={name:`BackendSectionPerf`,components:{CodeBlock:h},data(){return{perfCode:se,jvmCode:ce}}},ue={class:`bs-section`};function de(e,t,ee,n,s,c){let l=i(`CodeBlock`);return r(),o(`div`,ue,[t[0]||=a(`<h3 data-v-4650de59>Caching Layers — dữ liệu nóng phục vụ nhanh hơn</h3><div class="diagram" data-v-4650de59> Client → CDN → Reverse Proxy → App Cache → Distributed Cache → Database </div><p class="section-text" data-v-4650de59>Mỗi lớp cache chặn request trước khi chạm tới tầng chậm hơn. <strong data-v-4650de59>Nguyên tắc:</strong> cache càng gần client càng nhanh, DB là nơi cuối cùng phải chịu tải. Cache hợp lý có thể giảm 80-90% tải DB — nhưng nhớ xử lý <strong data-v-4650de59>cache invalidation</strong> (dữ liệu cũ) và <strong data-v-4650de59>cache stampede</strong> (nhiều request cùng lúc miss).</p><h3 data-v-4650de59>Application Optimization — 4 kỹ thuật cốt lõi</h3><p class="section-text" data-v-4650de59><strong data-v-4650de59>@Async</strong> đẩy việc chậm ra nền, <strong data-v-4650de59>@Cacheable</strong> cache kết quả method, <strong data-v-4650de59>batch insert</strong> thay vì ghi từng dòng, <strong data-v-4650de59>pagination</strong> thay vì load toàn bộ. Bốn kỹ thuật này giải quyết đa số bài toán hiệu năng app Java.</p>`,5),p(l,{code:s.perfCode,language:`java`},null,8,[`code`]),t[1]||=u(`h3`,null,`JVM Tuning — ép container dùng đúng RAM`,-1),t[2]||=u(`p`,{class:`section-text`},[f(`Khi chạy JVM trong container, JVM mặc định nhìn RAM của host — có thể dùng quá limit container và bị kill. `),u(`code`,null,`MaxRAMPercentage`),f(` giới hạn JVM dùng 75% RAM container. `),u(`code`,null,`G1GC`),f(` cho latency thấp, `),u(`code`,null,`HeapDumpOnOutOfMemoryError`),f(` để capture heap khi crash.`)],-1),p(l,{code:s.jvmCode,language:`bash`},null,8,[`code`])])}var X=l(le,[[`render`,de],[`__scopeId`,`data-v-4650de59`]]),fe=`@Transactional
public Order createOrder(CreateOrderRequest req) {
    Order order = orderRepo.save(toEntity(req));
    outboxRepo.save(new OutboxEvent("order", order.getId(), "OrderCreated", serialize(req)));
    return order;
}
// CDC Worker — Debezium capture changes từ outbox → publish lên Kafka`,pe={name:`BackendSectionArch`,components:{CodeBlock:h},data(){return{outboxCode:fe}}},me={class:`bs-section`};function he(e,t,ee,n,s,c){let l=i(`CodeBlock`);return r(),o(`div`,me,[t[0]||=a(`<h3 data-v-18ae645f>Architecture Patterns — chọn kiến trúc theo bài toán</h3><div class="cards-grid cols-4" data-v-18ae645f><div class="info-card" data-v-18ae645f><h4 data-v-18ae645f>Monolithic</h4><p data-v-18ae645f>1 ứng dụng, 1 DB. Đơn giản, dễ develop. Giới hạn: scaling — phải scale cả app khi chỉ 1 module nóng.</p></div><div class="info-card" data-v-18ae645f><h4 data-v-18ae645f>Microservices</h4><p data-v-18ae645f>Nhiều service nhỏ, độc lập. Cần: API Gateway, service discovery. Phức tạp hơn nhưng scale và deploy độc lập.</p></div><div class="info-card" data-v-18ae645f><h4 data-v-18ae645f>CQRS + Event Sourcing</h4><p data-v-18ae645f>Tách read/write model. Lưu events thay vì state. Read model tối ưu riêng cho query.</p></div><div class="info-card" data-v-18ae645f><h4 data-v-18ae645f>Event-Driven</h4><p data-v-18ae645f>Service giao tiếp qua events (Kafka). Saga pattern. Tách rời, chịu lỗi tốt nhưng khó debug hơn.</p></div></div><h3 data-v-18ae645f>Outbox Pattern — đảm bảo &quot;ghi DB + gửi event&quot; cùng xảy ra</h3><p class="section-text" data-v-18ae645f>Vấn đề: ghi Order vào DB xong gửi event lên Kafka — nếu gửi event fail, dữ liệu ghi rồi nhưng hệ thống khác không biết (mất event). <strong data-v-18ae645f>Outbox Pattern:</strong> ghi event vào bảng <code data-v-18ae645f>outbox</code> <strong data-v-18ae645f>trong cùng transaction</strong> với Order. Sau đó CDC Worker (Debezium) đọc bảng outbox và publish lên Kafka — đảm bảo không mất event, không trùng.</p>`,4),p(l,{code:s.outboxCode,language:`java`},null,8,[`code`])])}var Z=l(pe,[[`render`,he],[`__scopeId`,`data-v-18ae645f`]]),ge={name:`BackendSectionInterview`,methods:{handleNav(e){m(e)}}},_e={class:`bs-section`},ve={class:`interview-cta`};function ye(e,t,ee,n,i,c){return r(),o(`div`,_e,[t[1]||=a(`<h3 data-v-9fa7f757>Câu hỏi theo level — bạn đang ở đâu?</h3><p class="section-text" data-v-9fa7f757>Các câu hỏi phỏng vấn backend thường tăng dần theo level: Junior hỏi nền tảng, Middle hỏi vận hành, Senior hỏi thiết kế &amp; xử lý sự cố, Architect hỏi kiến trúc hệ thống. Luyện từ level của bạn trở lên để sẵn sàng.</p><div class="cards-grid cols-4" data-v-9fa7f757><div class="info-card level-junior" data-v-9fa7f757><h4 data-v-9fa7f757>🌱 Junior</h4><ul data-v-9fa7f757><li data-v-9fa7f757>ACID là gì?</li><li data-v-9fa7f757>INNER JOIN vs LEFT JOIN?</li><li data-v-9fa7f757>INDEX hoạt động thế nào?</li><li data-v-9fa7f757>Transaction isolation levels?</li><li data-v-9fa7f757>GET vs POST?</li></ul></div><div class="info-card level-middle" data-v-9fa7f757><h4 data-v-9fa7f757>📈 Middle</h4><ul data-v-9fa7f757><li data-v-9fa7f757>N+1 problem + fix?</li><li data-v-9fa7f757>Optimistic vs Pessimistic lock?</li><li data-v-9fa7f757>Redis dùng để làm gì?</li><li data-v-9fa7f757>Kafka partition?</li><li data-v-9fa7f757>Docker multi-stage build?</li></ul></div><div class="info-card level-senior" data-v-9fa7f757><h4 data-v-9fa7f757>🎯 Senior</h4><ul data-v-9fa7f757><li data-v-9fa7f757>CAP theorem?</li><li data-v-9fa7f757>Saga pattern?</li><li data-v-9fa7f757>Distributed caching?</li><li data-v-9fa7f757>Circuit Breaker?</li></ul></div><div class="info-card level-architect" data-v-9fa7f757><h4 data-v-9fa7f757>🏗️ Architect</h4><ul data-v-9fa7f757><li data-v-9fa7f757>Design URL shortener?</li><li data-v-9fa7f757>Design chat 10M users?</li><li data-v-9fa7f757>CQRS + Event Sourcing?</li></ul></div></div>`,3),u(`div`,ve,[u(`a`,{href:`#`,onClick:t[0]||=s(e=>c.handleNav(`/salary-interview`),[`prevent`])},`💰 Luyện phỏng vấn theo mức lương →`)])])}var Q=l(ge,[[`render`,ye],[`__scopeId`,`data-v-9fa7f757`]]),be=[{id:`sql`,num:`01`,title:`SQL & Database`,component:b},{id:`nosql`,num:`02`,title:`NoSQL Databases`,component:x},{id:`mq`,num:`03`,title:`Message Queue`,component:D},{id:`docker`,num:`04`,title:`Docker`,component:N},{id:`k8s`,num:`05`,title:`Kubernetes`,component:B},{id:`cicd`,num:`06`,title:`CI/CD`,component:G},{id:`design`,num:`07`,title:`System Design`,component:Y},{id:`perf`,num:`08`,title:`Performance Optimization`,component:X},{id:`arch`,num:`09`,title:`Architecture Patterns`,component:Z},{id:`interview`,num:`10`,title:`Câu hỏi phỏng vấn`,component:Q}],xe={name:`BackendSectionPage`,components:{SectionSql:b,SectionNosql:x,SectionMq:D,SectionDocker:N,SectionK8s:B,SectionCicd:G,SectionDesign:Y,SectionPerf:X,SectionArch:Z,SectionInterview:Q},data(){return{sections:be}},computed:{currentId(){return this.$route.params.sectionId},current(){return this.sections.find(e=>e.id===this.currentId)||null},currentComponent(){return this.current?this.current.component:null},currentTitle(){return this.current?this.current.title:``},currentNum(){return this.current?this.current.num:``},currentIndex(){return this.sections.findIndex(e=>e.id===this.currentId)},prev(){let e=this.currentIndex;return e>0?this.sections[e-1]:null},next(){let e=this.currentIndex;return e>=0&&e<this.sections.length-1?this.sections[e+1]:null},prevTitle(){return this.prev?this.prev.title:``},nextTitle(){return this.next?this.next.title:``}},mounted(){this.ensureValid()},watch:{"$route.params.sectionId"(){this.ensureValid()}},methods:{ensureValid(){this.current?window.scrollTo({top:0,behavior:`smooth`}):m(`/java/backend/sql`,{target:`router`})},handleNav(e){m(e)},goTo(e){m(`/java/backend/${e}`,{target:`router`})}}},Se={class:`backend-section-page`},Ce={class:`page-header`},we={class:`header-content`},Te={class:`header-nav`},Ee={class:`page-content`},De={class:`sidebar-toc`},Oe={class:`toc-container`},ke={class:`toc-nav`},Ae=[`onClick`],je={class:`toc-num`},Me={class:`toc-text`},Ne={class:`main-content`},Pe={class:`content-section`},$={class:`section-header`},Fe={class:`section-num`},Ie={class:`section-title`},Le={class:`section-body`},Re={class:`pager`},ze=[`disabled`],Be=[`disabled`];function Ve(i,a,l,f,p,m){return r(),o(`div`,Se,[u(`header`,Ce,[u(`div`,we,[u(`div`,Te,[u(`button`,{class:`nav-btn`,onClick:a[0]||=e=>m.handleNav(`/java/hub`)},[...a[4]||=[u(`span`,null,`←`,-1),u(`span`,null,`Java`,-1)]]),u(`button`,{class:`nav-btn`,onClick:a[1]||=e=>m.handleNav(`/`)},[...a[5]||=[u(`span`,null,`🏠`,-1),u(`span`,null,`Trang chủ`,-1)]])]),a[6]||=u(`div`,{class:`header-title`},[u(`h1`,null,`⚙️ Backend Engineering`),u(`p`,{class:`desc`},`Database, Message Queue, Docker, K8s, CI/CD, System Design, Performance`)],-1)])]),u(`div`,Ee,[u(`aside`,De,[u(`div`,Oe,[a[7]||=u(`h3`,{class:`toc-title`},`Các bài học`,-1),u(`nav`,ke,[(r(!0),o(d,null,e(p.sections,e=>(r(),o(`a`,{key:e.id,href:`#`,class:ee([`toc-link`,{active:e.id===m.currentId}]),onClick:s(t=>m.goTo(e.id),[`prevent`])},[u(`span`,je,n(e.num)+`.`,1),u(`span`,Me,n(e.title),1)],10,Ae))),128))])])]),u(`main`,Ne,[u(`section`,Pe,[u(`div`,$,[u(`span`,Fe,n(m.currentNum),1),u(`h2`,Ie,n(m.currentTitle),1)]),u(`div`,Le,[(r(),c(t(m.currentComponent)))])]),u(`div`,Re,[u(`button`,{class:`pager-btn`,disabled:!m.prev,onClick:a[2]||=e=>m.goTo(m.prev.id)},` ← `+n(m.prevTitle),9,ze),u(`button`,{class:`pager-btn next`,disabled:!m.next,onClick:a[3]||=e=>m.goTo(m.next.id)},n(m.nextTitle)+` → `,9,Be)])])])])}var He=l(xe,[[`render`,Ve],[`__scopeId`,`data-v-c42a4c37`]]);export{He as default};