import{A as e,E as t,O as n,c as r,ct as i,d as a,h as o,i as s,j as c,l,m as u,p as d,t as f,ut as p}from"./_plugin-vue_export-helper-mTPtt9wH.js";import{D as m}from"./index-x94VOAi_.js";import{n as h}from"./navigate-y_9R8FD2.js";import{t as g}from"./CodeBlock-CsUHGuwr.js";var ee=`-- B-Tree index (mặc định) — tốt cho =, >, <, BETWEEN, LIKE 'abc%'
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

-- Deadlock fix: luôn lock theo cùng thứ tự (id 1 → 2)`,v=`-- Tìm đơn mới nhất của một user
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, created_at
FROM orders
WHERE customer_id = 42
  AND status = 'PAID'
ORDER BY created_at DESC
LIMIT 20;

-- Index theo equality filters trước, rồi cột sort/range
CREATE INDEX idx_orders_customer_status_created
  ON orders(customer_id, status, created_at DESC);

-- Kiểm tra lại plan và write overhead sau khi tạo index.`,y=`-- src/main/resources/db/migration/V014__index_orders_for_history.sql
CREATE INDEX idx_orders_customer_status_created
    ON orders(customer_id, status, created_at DESC);

-- application.yml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration

-- Migration áp dụng rồi không sửa lại; tạo V015 cho thay đổi tiếp theo.
-- Production: chạy migration có kiểm soát, theo dõi lock/time và có rollback plan.`,b={name:`BackendSectionSql`,components:{CodeBlock:g},data(){return{indexCode:ee,transactionCode:_,explainCode:v,migrationCode:y}}},x={class:`bs-section`};function te(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,x,[i[0]||=d(`<h3 data-v-ef0ba2f2>ACID — tại sao transaction đáng tin cậy?</h3><p class="section-text" data-v-ef0ba2f2>ACID là 4 đặc tính đảm bảo dữ liệu <strong data-v-ef0ba2f2>không bao giờ sai dù app crash, server tắt đột ngột, hay nhiều người ghi cùng lúc</strong>. Đây là lý do SQL vẫn là lựa chọn số 1 cho dữ liệu tiền bạc, đơn hàng, giao dịch.</p><div class="cards-grid" data-v-ef0ba2f2><div class="info-card" data-v-ef0ba2f2><h4 data-v-ef0ba2f2>Atomicity</h4><p data-v-ef0ba2f2>Toàn bộ hoặc không gì cả. Transaction commit → all changes. Rollback → không thay đổi nào. VD: chuyển tiền phải trừ A + cộng B cùng xảy ra, không thể chỉ trừ.</p></div><div class="info-card" data-v-ef0ba2f2><h4 data-v-ef0ba2f2>Consistency</h4><p data-v-ef0ba2f2>Dữ liệu từ trạng thái hợp lệ này sang hợp lệ khác. Ràng buộc (FK, unique, check) luôn được đảm bảo. DB không bao giờ ở trạng thái &quot;nửa chừng&quot;.</p></div><div class="info-card" data-v-ef0ba2f2><h4 data-v-ef0ba2f2>Isolation</h4><p data-v-ef0ba2f2>Transaction không ảnh hưởng lẫn nhau. Các mức: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE. Mức cao hơn → an toàn hơn nhưng chậm hơn.</p></div><div class="info-card" data-v-ef0ba2f2><h4 data-v-ef0ba2f2>Durability</h4><p data-v-ef0ba2f2>Dữ liệu đã commit được lưu vĩnh viễn. Dùng WAL (Write-Ahead Log) để phục hồi khi crash. Không mất dữ liệu khi mất điện.</p></div></div><h3 data-v-ef0ba2f2>Index — tại sao query nhanh?</h3><p class="section-text" data-v-ef0ba2f2>Không có index, DB phải <strong data-v-ef0ba2f2>quét toàn bộ bảng</strong> (full scan) để tìm dữ liệu — hàng triệu dòng = chậm. Index (thường là B-Tree) giống mục lục sách: tìm theo <code data-v-ef0ba2f2>=</code>, <code data-v-ef0ba2f2>&gt;</code>, <code data-v-ef0ba2f2>&lt;</code>, <code data-v-ef0ba2f2>BETWEEN</code> trong log(n) thay vì n. <strong data-v-ef0ba2f2>Chi phí:</strong> mỗi index làm INSERT/UPDATE chậm hơn một chút — nên index đúng cột hay được query.</p>`,5),o(p,{code:l.indexCode,language:`sql`},null,8,[`code`]),i[1]||=r(`h3`,null,`Transaction & Locking — tránh race condition`,-1),i[2]||=r(`p`,{class:`section-text`},[u(`Khi 2 request cùng sửa 1 record, cần `),r(`strong`,null,`lock`),u(`: `),r(`em`,null,`Pessimistic`),u(` khóa record ngay (chắc chắn, chậm hơn), `),r(`em`,null,`Optimistic`),u(` dùng cột `),r(`code`,null,`@Version`),u(` — ai commit trước thắng, ai sau bị lỗi và phải thử lại. `),r(`strong`,null,`Deadlock`),u(` xảy ra khi 2 transaction giữ lock chờ nhau — fix bằng cách luôn lock theo cùng thứ tự.`)],-1),o(p,{code:l.transactionCode,language:`java`},null,8,[`code`]),i[3]||=d(`<h3 data-v-ef0ba2f2>Query Optimization — chiến thuật thực tế</h3><ul class="tips-list" data-v-ef0ba2f2><li data-v-ef0ba2f2><strong data-v-ef0ba2f2>EXPLAIN ANALYZE:</strong> xem seq scan vs index scan — bắt query chạy chậm</li><li data-v-ef0ba2f2><strong data-v-ef0ba2f2>N+1:</strong> dùng JOIN FETCH, @EntityGraph</li><li data-v-ef0ba2f2><strong data-v-ef0ba2f2>Chỉ SELECT cần thiết:</strong> không SELECT *</li><li data-v-ef0ba2f2><strong data-v-ef0ba2f2>Pagination:</strong> keyset pagination thay vì OFFSET (OFFSET chậm khi page lớn)</li><li data-v-ef0ba2f2><strong data-v-ef0ba2f2>Connection pool:</strong> HikariCP size ~ 2*CPU + 1</li></ul><h3 data-v-ef0ba2f2>Đọc query plan: index có được dùng thật không?</h3><p class="section-text" data-v-ef0ba2f2>Đừng thêm index chỉ vì một query trông có vẻ chậm. Với PostgreSQL, <code data-v-ef0ba2f2>EXPLAIN (ANALYZE, BUFFERS)</code> chạy query thật và cho biết actual time, số rows, loops, buffers cùng cách planner truy cập. So estimated rows với actual rows; lệch lớn có thể làm planner chọn plan kém.</p>`,4),o(p,{code:l.explainCode,language:`sql`},null,8,[`code`]),i[4]||=r(`div`,{class:`info-card`},[r(`h4`,null,`Cách đọc nhanh`),r(`p`,null,[r(`strong`,null,`Seq Scan`),u(` chưa chắc sai nếu bảng nhỏ hoặc trả về nhiều dòng. `),r(`strong`,null,`Index Scan`),u(` cũng chưa chắc nhanh nếu phải fetch quá nhiều row. Tối ưu theo query thực tế, độ chọn lọc, thứ tự cột và write cost; kiểm tra lại bằng plan sau khi sửa.`)])],-1),i[5]||=r(`h3`,null,`Schema migration, backup và phục hồi`,-1),i[6]||=r(`p`,{class:`section-text`},`Schema production cần thay đổi có version và review cùng code. Flyway chạy migration theo thứ tự; migration đã áp dụng nên được xem là immutable. Với thay đổi lớn, dùng cách expand → deploy code tương thích cũ/mới → backfill → switch → contract để tránh downtime.`,-1),o(p,{code:l.migrationCode,language:`sql / yaml`},null,8,[`code`]),i[7]||=r(`ul`,{class:`tips-list`},[r(`li`,null,[r(`strong`,null,`Backward compatible:`),u(` thêm cột nullable/default trước; deploy ứng dụng đọc/ghi tương thích rồi mới xóa field cũ ở release sau.`)]),r(`li`,null,[r(`strong`,null,`Backup:`),u(` xác định RPO/RTO, retention, mã hóa và quyền truy cập; snapshot/backup cần được restore thử định kỳ.`)]),r(`li`,null,[r(`strong`,null,`Khôi phục:`),u(` tài liệu hóa ai quyết định, restore vào đâu, kiểm tra consistency thế nào và chuyển traffic ra sao.`)]),r(`li`,null,[r(`strong`,null,`Data migration lớn:`),u(` chạy batch có checkpoint, giới hạn tải DB, đo tiến độ và có cách dừng/tiếp tục.`)])],-1)])}var S=f(b,[[`render`,te],[`__scopeId`,`data-v-ef0ba2f2`]]),ne=`// Cache Aside
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
// Lưu tokens + last_refill_time trong Redis Hash`,re={name:`BackendSectionNosql`,components:{CodeBlock:g},data(){return{redisCode:ne}}},ie={class:`bs-section`};function ae(n,r,i,s,c,l){let u=e(`CodeBlock`);return t(),a(`div`,ie,[r[0]||=d(`<h3 data-v-5cabc4bc>NoSQL — khi nào dùng thay SQL?</h3><p class="section-text" data-v-5cabc4bc><strong data-v-5cabc4bc>NoSQL</strong> hy sinh transaction/join mạnh để đổi lấy <strong data-v-5cabc4bc>scale ngang, độ trễ thấp, schema linh hoạt</strong>. Chọn theo bài toán: cache → Redis, document linh hoạt → MongoDB, ghi log khổng lồ → Cassandra, tìm kiếm → Elasticsearch. Không phải &quot;NoSQL thay thế SQL&quot; — mà mỗi loại giải quyết 1 lớp bài toán riêng.</p><div class="cards-grid cols-4" data-v-5cabc4bc><div class="info-card" data-v-5cabc4bc><h4 data-v-5cabc4bc>Redis</h4><p data-v-5cabc4bc>In-memory key-value. Cache, session, rate limiter, distributed lock, pub/sub. Nhanh nhất (~100k ops/s) nhưng dữ liệu trong RAM.</p></div><div class="info-card" data-v-5cabc4bc><h4 data-v-5cabc4bc>MongoDB</h4><p data-v-5cabc4bc>Document DB (JSON-like). Flexible schema, nested data. Hợp: catalog, content, user profile thay đổi thường xuyên.</p></div><div class="info-card" data-v-5cabc4bc><h4 data-v-5cabc4bc>Cassandra</h4><p data-v-5cabc4bc>Wide-column, write-optimized. Time-series, IoT, event logging — ghi cực nhanh với khối lượng khổng lồ.</p></div><div class="info-card" data-v-5cabc4bc><h4 data-v-5cabc4bc>Elasticsearch</h4><p data-v-5cabc4bc>Full-text search + analytics. Logging, search engine. Index tìm kiếm, không phải nguồn dữ liệu chính.</p></div></div><h3 data-v-5cabc4bc>Redis Patterns — 3 pattern phổ biến nhất</h3><p class="section-text" data-v-5cabc4bc><strong data-v-5cabc4bc>Cache Aside</strong> là pattern cơ bản nhất: đọc cache trước, miss thì đọc DB rồi ghi cache. <strong data-v-5cabc4bc>Distributed Lock</strong> chống 2 instance xử lý cùng 1 task. <strong data-v-5cabc4bc>Rate Limiter</strong> giới hạn request/giây chống abuse. Cả 3 đều là nền tảng của mọi hệ thống backend hiện đại.</p>`,5),o(u,{code:c.redisCode,language:`java`},null,8,[`code`])])}var C=f(re,[[`render`,ae],[`__scopeId`,`data-v-5cabc4bc`]]),w=`@RestController
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
}`,T=`StreamsBuilder builder = new StreamsBuilder();
KStream<String, OrderEvent> stream = builder.stream("order-events");

KTable<Long, Long> countPerMinute = stream
    .filter((k, v) -> "CREATED".equals(v.getType()))
    .groupBy((k, v) -> v.getProductId())
    .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
    .count();`,E={name:`BackendSectionMq`,components:{CodeBlock:g},data(){return{kafkaCode:w,kafkaStreamsCode:T}}},D={class:`bs-section`};function O(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,D,[i[0]||=d(`<h3 data-v-b6715671>Message Queue — tại sao cần?</h3><p class="section-text" data-v-b6715671>MQ giúp tách rời các service: producer gửi tin <strong data-v-b6715671>không cần biết ai nhận</strong>, consumer xử lý khi sẵn sàng. Lợi ích: <strong data-v-b6715671>giảm tải đột biến</strong> (queue hấp thụ), <strong data-v-b6715671>retry</strong> khi consumer lỗi, <strong data-v-b6715671>đảm bảo không mất tin</strong>. Nếu không có MQ, khi đặt hàng bạn phải gọi thẳng email + SMS + notification — một service chậm sẽ làm chậm cả luồng.</p><div class="cards-grid cols-2" data-v-b6715671><div class="info-card" data-v-b6715671><h4 data-v-b6715671>🐇 RabbitMQ</h4><p data-v-b6715671>Message broker cổ điển. Exchange types: Direct, Topic, Fanout. Dùng cho: task queue, RPC, pub/sub. Hợp khi cần routing linh hoạt.</p></div><div class="info-card" data-v-b6715671><h4 data-v-b6715671>📊 Kafka</h4><p data-v-b6715671>Distributed event streaming. Topic, Partition, Consumer Group, Offset. Dùng cho: event sourcing, stream processing. Hợp khi cần throughput khổng lồ + replay.</p></div></div><h3 data-v-b6715671>Spring Kafka — producer &amp; consumer</h3><p class="section-text" data-v-b6715671>Producer dùng <code data-v-b6715671>KafkaTemplate</code> gửi tin vào topic, consumer dùng <code data-v-b6715671>@KafkaListener</code> xử lý bất đồng bộ. <strong data-v-b6715671>Consumer Group</strong> đảm bảo mỗi tin chỉ được xử lý 1 lần trong group — mở rộng bằng cách thêm instance vào group.</p>`,5),o(p,{code:l.kafkaCode,language:`java`},null,8,[`code`]),i[1]||=r(`h3`,null,`Kafka Streams — xử lý dữ liệu ngay trong Kafka`,-1),i[2]||=r(`p`,{class:`section-text`},[u(`Thay vì kéo dữ liệu ra ngoài xử lý, `),r(`strong`,null,`Kafka Streams`),u(` xử lý ngay trong luồng: lọc, group, đếm theo cửa sổ thời gian. VD: đếm số đơn hàng mỗi phút theo sản phẩm — phục vụ real-time analytics mà không cần hệ thống riêng.`)],-1),o(p,{code:l.kafkaStreamsCode,language:`java`},null,8,[`code`])])}var k=f(E,[[`render`,O],[`__scopeId`,`data-v-b6715671`]]),A=`# Multi-stage build
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
ENTRYPOINT ["java", "-jar", "app.jar"]`,j=`version: '3.8'
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
      test: ["CMD-SHELL", "pg_isready -U postgres"]`,M={name:`BackendSectionDocker`,components:{CodeBlock:g},data(){return{dockerfileCode:A,dockerComposeCode:j}}},N={class:`bs-section`};function P(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,N,[i[0]||=d(`<h3 data-v-2f60ffe5>Docker — tại sao mọi backend team cần?</h3><p class="section-text" data-v-2f60ffe5>Docker đóng gói app + môi trường (JDK, dependencies, config) vào 1 image chạy được ở <strong data-v-2f60ffe5>mọi nơi</strong>: máy dev, CI, server. Hết bài toán &quot;chạy được trên máy tôi&quot;. Đây là nền tảng cho microservices, K8s, và CI/CD — deploy cùng 1 image từ dev đến production.</p><h3 data-v-2f60ffe5>Dockerfile cho Spring Boot — multi-stage build</h3><p class="section-text" data-v-2f60ffe5>Multi-stage tách 2 giai đoạn: <strong data-v-2f60ffe5>build</strong> (đầy đủ JDK + Maven) và <strong data-v-2f60ffe5>runtime</strong> (chỉ JRE nhẹ). Image cuối nhỏ hơn nhiều, an toàn hơn. Chạy với <strong data-v-2f60ffe5>user non-root</strong> và <code data-v-2f60ffe5>HEALTHCHECK</code> — để K8s biết app còn sống không.</p>`,4),o(p,{code:l.dockerfileCode,language:`dockerfile`},null,8,[`code`]),i[1]||=r(`h3`,null,`docker-compose — chạy nhiều service cùng lúc`,-1),i[2]||=r(`p`,{class:`section-text`},[u(`Một file YAML khai báo toàn bộ stack: app + PostgreSQL + Redis... `),r(`code`,null,`depends_on + healthcheck`),u(` đảm bảo app chỉ start khi DB sẵn sàng — chuẩn cho local dev và cả staging.`)],-1),o(p,{code:l.dockerComposeCode,language:`yaml`},null,8,[`code`])])}var F=f(M,[[`render`,P],[`__scopeId`,`data-v-2f60ffe5`]]),I=`# deployment.yml
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
              memory: "1Gi"`,L=`apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yml: |
    app:
      name: user-service
    spring:
      datasource:
        url: jdbc:postgresql://postgres:5432/users`,R=`apiVersion: autoscaling/v2
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
          averageUtilization: 70`,z={name:`BackendSectionK8s`,components:{CodeBlock:g},data(){return{k8sDeploymentCode:I,k8sConfigMapCode:L,k8sHpaCode:R}}},B={class:`bs-section`};function V(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,B,[i[0]||=d(`<h3 data-v-c2e833ad>Kubernetes — tại sao cần khi đã có Docker?</h3><p class="section-text" data-v-c2e833ad>Docker chạy container, nhưng <strong data-v-c2e833ad>K8s quản lý hàng trăm container</strong>: tự deploy, scale, self-heal, load balance. Khi traffic tăng, K8s tự tạo thêm pod; pod chết thì tự tạo lại. Đây là lớp vận hành mà production thật cần — Docker chỉ giải quyết 1 container, K8s giải quyết cả hệ thống.</p><h3 data-v-c2e833ad>Deployment &amp; Service — khai báo trạng thái mong muốn</h3><p class="section-text" data-v-c2e833ad><strong data-v-c2e833ad>Deployment</strong> khai báo &quot;tôi muốn 3 replicas&quot; — K8s tự duy trì con số đó. <strong data-v-c2e833ad>RollingUpdate</strong> thay từng pod một, không downtime. <strong data-v-c2e833ad>Probes</strong> (liveness/readiness) giúp K8s biết pod sống và sẵn sàng nhận traffic — app phải expose <code data-v-c2e833ad>/actuator/health</code>.</p>`,4),o(p,{code:l.k8sDeploymentCode,language:`yaml`},null,8,[`code`]),i[1]||=r(`h3`,null,`ConfigMap & Secret — tách config khỏi image`,-1),i[2]||=r(`p`,{class:`section-text`},[r(`strong`,null,`ConfigMap`),u(` chứa cấu hình không nhạy cảm (application.yml), `),r(`strong`,null,`Secret`),u(` chứa dữ liệu mật (password, token). Tách ra để: đổi config không cần build lại image, và không bao giờ commit secret vào repo/image.`)],-1),o(p,{code:l.k8sConfigMapCode,language:`yaml`},null,8,[`code`]),i[3]||=r(`h3`,null,`HPA — tự scale theo tải`,-1),i[4]||=r(`p`,{class:`section-text`},[r(`strong`,null,`HorizontalPodAutoscaler`),u(` tự tăng/giảm số pod theo CPU/memory. Chạy 2 pod lúc thấp điểm, scale lên 10 khi cao điểm, rồi tự giảm về — không cần can thiệp tay, tiết kiệm chi phí.`)],-1),o(p,{code:l.k8sHpaCode,language:`yaml`},null,8,[`code`])])}var H=f(z,[[`render`,V],[`__scopeId`,`data-v-c2e833ad`]]),U=`name: Build and Deploy
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
      - run: kubectl set image deployment/app app=registry.example.com/app:\${{ github.sha }}`,W={name:`BackendSectionCicd`,components:{CodeBlock:g},data(){return{githubActionsCode:U}}},G={class:`bs-section`};function K(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,G,[i[0]||=r(`h3`,null,`CI/CD — tự động hóa từ commit đến production`,-1),i[1]||=r(`p`,{class:`section-text`},[r(`strong`,null,`CI (Continuous Integration):`),u(` mỗi commit được build + test tự động → phát hiện lỗi sớm. `),r(`strong`,null,`CD (Continuous Deployment):`),u(` artifact đạt chuẩn tự động deploy. Kết quả: deploy nhanh, ít lỗi do tay, và mọi người trong team đều thấy pipeline trạng thái như nhau.`)],-1),i[2]||=r(`h3`,null,`GitHub Actions — pipeline trong repo`,-1),i[3]||=r(`p`,{class:`section-text`},[u(`Workflow YAML nằm ngay trong repo: push lên `),r(`code`,null,`main`),u(` → chạy test → build Docker image → push registry → update K8s deployment. Toàn bộ tự động, có log, có thể review như code.`)],-1),o(p,{code:l.githubActionsCode,language:`yaml`},null,8,[`code`]),i[4]||=d(`<h3 data-v-615ef0c2>Git Flow — nhánh chuẩn cho team</h3><div class="cards-grid cols-4" data-v-615ef0c2><div class="info-card" data-v-615ef0c2><h4 data-v-615ef0c2>main</h4><p data-v-615ef0c2>Production-ready. Chỉ merge từ release/hotfix.</p></div><div class="info-card" data-v-615ef0c2><h4 data-v-615ef0c2>develop</h4><p data-v-615ef0c2>Tích hợp feature branches.</p></div><div class="info-card" data-v-615ef0c2><h4 data-v-615ef0c2>feature/xxx</h4><p data-v-615ef0c2>Nhánh từ develop. Tên theo ticket.</p></div><div class="info-card" data-v-615ef0c2><h4 data-v-615ef0c2>release/v1.2</h4><p data-v-615ef0c2>Chuẩn bị release. Chỉ fix bug.</p></div></div><h3 data-v-615ef0c2>Code Quality Gates — chặn code xấu trước khi vào production</h3><ul class="tips-list" data-v-615ef0c2><li data-v-615ef0c2><strong data-v-615ef0c2>SonarQube:</strong> code smell, bug, coverage gate</li><li data-v-615ef0c2><strong data-v-615ef0c2>Checkstyle/PMD:</strong> coding convention</li><li data-v-615ef0c2><strong data-v-615ef0c2>OWASP Dependency Check:</strong> scan CVE (lỗ hổng bảo mật trong thư viện)</li><li data-v-615ef0c2><strong data-v-615ef0c2>Trivy:</strong> scan Docker image vulnerabilities</li></ul>`,4)])}var q=f(W,[[`render`,K],[`__scopeId`,`data-v-615ef0c2`]]),J=[{number:`01`,title:`Làm rõ yêu cầu`,detail:`Ai dùng? Luồng chính và edge case nào thuộc phạm vi? Điều gì chưa cần làm?`,output:`Scope + giả định`},{number:`02`,title:`Chốt chất lượng cần đạt`,detail:`Consistency, latency, availability, security, audit và data retention quan trọng tới mức nào?`,output:`NFR + ưu tiên`},{number:`03`,title:`Ước lượng tải`,detail:`Số user/request, peak, read/write ratio, dữ liệu tăng mỗi ngày và thời gian lưu.`,output:`Con số gần đúng`},{number:`04`,title:`Thiết kế API & data`,detail:`Resource, trạng thái nghiệp vụ, schema, index, idempotency và transaction boundary.`,output:`Contract + data model`},{number:`05`,title:`Vẽ component & luồng`,detail:`Client, API, service, database, cache, queue và provider; lần theo một request cụ thể.`,output:`Architecture + sequence`},{number:`06`,title:`Tìm failure mode`,detail:`Timeout, retry, duplicate, partial failure, stale data, race condition và cách phục hồi.`,output:`Failure handling`},{number:`07`,title:`Nêu trade-off & tiến hóa`,detail:`Bắt đầu đơn giản thế nào? Dữ liệu nào chứng minh cần cache, partition hoặc tách service?`,output:`Lý do + next step`}],oe=`POST /api/v1/orders
Authorization: Bearer <access-token>
Idempotency-Key: 8db5b4c2-...
Content-Type: application/json

{
  "items": [
    { "productId": "p-123", "quantity": 2 }
  ],
  "shippingAddressId": "addr-456"
}

HTTP/1.1 202 Accepted
{
  "orderId": "ord-789",
  "status": "PENDING_PAYMENT",
  "statusUrl": "/api/v1/orders/ord-789"
}`,se=`orders(id, customer_id, status, total_amount, version, created_at)
order_items(id, order_id, product_id, quantity, unit_price)
payments(id, order_id, provider_ref, status, amount, idempotency_key)
outbox_events(id, aggregate_id, event_type, payload, created_at, published_at)

-- Một key chỉ được tạo đơn một lần cho cùng một user
CREATE UNIQUE INDEX uq_order_idempotency
  ON orders(customer_id, idempotency_key);

-- Worker tìm event chưa phát; production nên claim theo batch/lock
SELECT id, event_type, payload
FROM outbox_events
WHERE published_at IS NULL
ORDER BY created_at
LIMIT 100;`,ce=`100,000 orders/day ÷ 86,400 ≈ 1.2 orders/second average
Peak x10 ≈ 12 order requests/second

If each order has 3 items:
300,000 order_items/day

Estimate storage only after asking:
- average row + index size
- retention period
- replicas / backups
- audit and event payload growth`,le={name:`BackendSectionDesign`,components:{CodeBlock:g},data(){return{designSteps:J,apiCode:oe,schemaCode:se,estimationCode:ce}}},ue={class:`bs-section system-design`},de={class:`design-steps`},fe={class:`step-number`};function pe(i,c,l,u,f,m){let h=e(`CodeBlock`);return t(),a(`div`,ue,[c[0]||=d(`<div class="course-intro" data-v-5f91fe13><span class="course-kicker" data-v-5f91fe13>BACKEND ENGINEERING · THỰC CHIẾN</span><h3 data-v-5f91fe13>System Design: thiết kế một hệ thống backend</h3><p class="section-text" data-v-5f91fe13>System Design là cách biến yêu cầu sản phẩm thành kiến trúc backend có thể chạy được: API, dữ liệu, luồng xử lý, cách mở rộng và cách hệ thống phản ứng khi có lỗi. Mục tiêu không phải vẽ thật nhiều service; mục tiêu là giải thích được lựa chọn và đánh đổi.</p><div class="learning-outcomes" data-v-5f91fe13><span data-v-5f91fe13>Đọc yêu cầu và đặt câu hỏi đúng</span><span data-v-5f91fe13>Vẽ request flow và data flow</span><span data-v-5f91fe13>Chọn monolith hay microservices có lý do</span><span data-v-5f91fe13>Phân tích lỗi, tải và trade-off</span></div></div><h3 data-v-5f91fe13>Khung trình bày một bài System Design</h3><p class="section-text" data-v-5f91fe13>Trong phỏng vấn hoặc lúc bắt đầu dự án, đi theo thứ tự này để không nhảy ngay vào chọn công nghệ:</p>`,3),r(`div`,de,[(t(!0),a(s,null,n(f.designSteps,e=>(t(),a(`article`,{key:e.number,class:`step-card`},[r(`span`,fe,p(e.number),1),r(`div`,null,[r(`h4`,null,p(e.title),1),r(`p`,null,p(e.detail),1),r(`small`,null,p(e.output),1)])]))),128))]),c[1]||=d(`<h3 data-v-5f91fe13>Case study: thiết kế luồng đặt hàng e-commerce</h3><p class="section-text" data-v-5f91fe13>Bài toán mẫu: khách xem giỏ hàng, đặt đơn, thanh toán qua cổng bên ngoài và nhận xác nhận. Nếu thanh toán timeout hoặc người dùng bấm nút hai lần, hệ thống vẫn phải tránh tạo giao dịch trùng và có thể khôi phục trạng thái.</p><h4 class="subheading" data-v-5f91fe13>1. Chốt phạm vi trước khi vẽ</h4><div class="two-col" data-v-5f91fe13><div class="note-card" data-v-5f91fe13><strong data-v-5f91fe13>Functional requirements</strong><ul data-v-5f91fe13><li data-v-5f91fe13>Tạo đơn từ giỏ hàng và kiểm tra giá/tồn kho.</li><li data-v-5f91fe13>Thanh toán, xem trạng thái và hủy đơn theo điều kiện.</li><li data-v-5f91fe13>Gửi email/thông báo sau khi đơn được xác nhận.</li></ul></div><div class="note-card" data-v-5f91fe13><strong data-v-5f91fe13>Non-functional requirements</strong><ul data-v-5f91fe13><li data-v-5f91fe13>Không tạo hai đơn hoặc thu tiền hai lần khi client retry.</li><li data-v-5f91fe13>Đơn hàng và thanh toán có trạng thái truy vết được.</li><li data-v-5f91fe13>Chấp nhận thông báo bất đồng bộ trễ vài giây.</li></ul></div></div><h4 class="subheading" data-v-5f91fe13>2. Vẽ kiến trúc và lần theo request</h4>`,5),c[2]||=r(`div`,{class:`architecture`,role:`img`,"aria-label":`Luồng đặt hàng qua API, order service, database, outbox, message broker và payment provider`},[r(`div`,{class:`arch-row`},[r(`span`,{class:`arch-node`},`Web / Mobile`),r(`b`,null,`→`),r(`span`,{class:`arch-node`},`API Gateway`),r(`b`,null,`→`),r(`span`,{class:`arch-node primary-node`},`Order API`)]),r(`div`,{class:`arch-branches`},[r(`span`,null,`↓ transaction`),r(`span`,null,`↓ ghi event cùng transaction`)]),r(`div`,{class:`arch-row`},[r(`span`,{class:`arch-node`},`Order DB`),r(`b`,null,`←`),r(`span`,{class:`arch-node`},`Outbox table`),r(`b`,null,`→`),r(`span`,{class:`arch-node`},`Outbox worker`),r(`b`,null,`→`),r(`span`,{class:`arch-node`},`Kafka / Queue`)]),r(`div`,{class:`arch-row arch-secondary`},[r(`span`,{class:`arch-node`},`Payment worker → Payment Provider`),r(`span`,{class:`arch-node`},`Notification worker → Email`)])],-1),c[3]||=d(`<ol class="explain-list" data-v-5f91fe13><li data-v-5f91fe13>API xác thực người dùng, kiểm tra request và yêu cầu <code data-v-5f91fe13>Idempotency-Key</code>.</li><li data-v-5f91fe13>Order service kiểm tra lại giá và tồn kho từ nguồn dữ liệu đáng tin cậy, rồi tạo đơn <code data-v-5f91fe13>PENDING_PAYMENT</code>.</li><li data-v-5f91fe13>Cùng transaction, ghi event <code data-v-5f91fe13>OrderCreated</code> vào outbox. Worker phát event sang broker sau khi commit.</li><li data-v-5f91fe13>Payment worker gọi payment provider với idempotency key riêng. Webhook cập nhật kết quả thanh toán.</li><li data-v-5f91fe13>Khi thanh toán thành công, đơn chuyển sang <code data-v-5f91fe13>CONFIRMED</code>; notification worker gửi email độc lập.</li></ol><h4 class="subheading" data-v-5f91fe13>3. API và dữ liệu cần nghĩ tới</h4>`,2),o(h,{code:f.apiCode,language:`http`},null,8,[`code`]),o(h,{code:f.schemaCode,language:`sql`},null,8,[`code`]),c[4]||=d(`<div class="callout" data-v-5f91fe13><strong data-v-5f91fe13>Vì sao có outbox?</strong> Nếu ghi đơn vào database rồi publish event trực tiếp mà broker đang lỗi, đơn tồn tại nhưng event bị mất. Outbox ghi đơn và event trong cùng database transaction; worker phát event và retry sau. Consumer vẫn cần idempotent vì broker có thể giao lại message.</div><h3 data-v-5f91fe13>Monolith hay Microservices?</h3><div class="two-col compare-grid" data-v-5f91fe13><div class="note-card" data-v-5f91fe13><h4 data-v-5f91fe13>Modular monolith</h4><p data-v-5f91fe13>Một ứng dụng deploy, chia module rõ ràng: Order, Catalog, Inventory, Payment. Gọi nội bộ và dùng transaction DB dễ hơn. Phù hợp để bắt đầu khi team nhỏ, domain còn thay đổi.</p><p data-v-5f91fe13><strong data-v-5f91fe13>Rủi ro:</strong> module phụ thuộc lẫn nhau, deploy và scale toàn ứng dụng.</p></div><div class="note-card" data-v-5f91fe13><h4 data-v-5f91fe13>Microservices</h4><p data-v-5f91fe13>Tách service khi có ranh giới nghiệp vụ ổn định, nhu cầu scale/deploy độc lập hoặc team cần quyền sở hữu riêng. Mỗi service sở hữu dữ liệu của mình; giao tiếp qua API hoặc event.</p><p data-v-5f91fe13><strong data-v-5f91fe13>Chi phí:</strong> network failure, eventual consistency, tracing, versioning, vận hành và kiểm thử tích hợp.</p></div></div><p class="section-text" data-v-5f91fe13>Một đường đi hợp lý cho bài toán này: bắt đầu bằng modular monolith với module và interface rõ; đo bottleneck và thay đổi tổ chức/team; chỉ tách Payment hoặc Notification khi có nhu cầu độc lập. Microservices không tự làm hệ thống nhanh hoặc dễ bảo trì hơn.</p><h3 data-v-5f91fe13>Payment là một distributed workflow, không phải một câu gọi API</h3><div class="payment-flow" data-v-5f91fe13><span data-v-5f91fe13>Tạo Order: PENDING</span><b data-v-5f91fe13>→</b><span data-v-5f91fe13>Authorize / charge</span><b data-v-5f91fe13>→</b><span data-v-5f91fe13>Webhook xác nhận</span><b data-v-5f91fe13>→</b><span data-v-5f91fe13>CONFIRMED</span></div><ul class="tips-list" data-v-5f91fe13><li data-v-5f91fe13><strong data-v-5f91fe13>Timeout không đồng nghĩa thất bại:</strong> provider có thể đã thu tiền nhưng response bị mất. Tra cứu giao dịch bằng provider reference trước khi thử lại.</li><li data-v-5f91fe13><strong data-v-5f91fe13>Không giữ DB transaction khi gọi mạng:</strong> gọi provider bên ngoài có độ trễ và lỗi riêng; dùng trạng thái trung gian và xử lý kết quả bất đồng bộ.</li><li data-v-5f91fe13><strong data-v-5f91fe13>Webhook phải xác thực và chống xử lý lặp:</strong> lưu event ID đã xử lý, kiểm tra chữ ký và cập nhật trạng thái theo transition hợp lệ.</li><li data-v-5f91fe13><strong data-v-5f91fe13>Saga khi nhiều bước không thể chung transaction:</strong> định nghĩa action bù như release inventory hoặc refund; không giả định rollback distributed tự xảy ra.</li></ul><h3 data-v-5f91fe13>Thiết kế cho lỗi và tăng tải</h3><div class="cards-grid cols-2" data-v-5f91fe13><div class="info-card" data-v-5f91fe13><h4 data-v-5f91fe13>Độ tin cậy</h4><p data-v-5f91fe13>Timeout có giới hạn, retry có exponential backoff và jitter, circuit breaker khi dependency hỏng, DLQ cho message lỗi kéo dài, và thao tác replay có kiểm soát.</p></div><div class="info-card" data-v-5f91fe13><h4 data-v-5f91fe13>Dữ liệu &amp; nhất quán</h4><p data-v-5f91fe13>Giao dịch tiền cần trạng thái và audit rõ. Read model/cache có thể eventual consistent; ghi dữ liệu quan trọng vào nguồn sở hữu, tránh sửa chéo database giữa services.</p></div><div class="info-card" data-v-5f91fe13><h4 data-v-5f91fe13>Scale</h4><p data-v-5f91fe13>Ước lượng request/s và peak trước. Tối ưu query/index, phân trang, cache dữ liệu đọc phù hợp; thêm worker/consumer theo backlog trước khi nghĩ tới sharding.</p></div><div class="info-card" data-v-5f91fe13><h4 data-v-5f91fe13>Quan sát &amp; bảo mật</h4><p data-v-5f91fe13>Correlation ID xuyên request và event; metrics latency/error/queue lag; log có cấu trúc, không log thẻ hoặc secret; phân quyền service và quản lý secret an toàn.</p></div></div><h3 data-v-5f91fe13>Ước lượng tải: tính để biết câu hỏi cần hỏi</h3><p class="section-text" data-v-5f91fe13>Đây là ví dụ giả định để luyện phương pháp. Với 100 nghìn đơn/ngày, trung bình khoảng 1.2 đơn/giây; nếu giờ cao điểm gấp 10 lần thì khoảng 12 đơn/giây. Cần hỏi thêm tỷ lệ retry, số item mỗi đơn, traffic đọc/ghi, thời gian lưu và yêu cầu phục hồi trước khi chọn hạ tầng.</p>`,11),o(h,{code:f.estimationCode,language:`text`},null,8,[`code`]),c[5]||=d(`<h3 data-v-5f91fe13>Bài tập làm theo từng bước</h3><div class="exercise-card" data-v-5f91fe13><strong data-v-5f91fe13>Hãy thiết kế backend đặt lịch khám</strong><p data-v-5f91fe13>Bệnh nhân tìm bác sĩ và khung giờ, giữ chỗ trong 5 phút, thanh toán, sau đó nhận xác nhận. Nhiều người có thể chọn cùng một khung giờ.</p><ol data-v-5f91fe13><li data-v-5f91fe13>Viết 5 câu hỏi làm rõ requirement và giả định tải.</li><li data-v-5f91fe13>Vẽ API, bảng dữ liệu và trạng thái appointment/payment.</li><li data-v-5f91fe13>Giải thích cách chống double booking và payment retry.</li><li data-v-5f91fe13>Nói rõ chọn modular monolith hay microservices ở phiên bản đầu và vì sao.</li><li data-v-5f91fe13>Mô tả điều gì xảy ra khi DB, queue hoặc payment provider bị lỗi.</li></ol><p class="answer-frame" data-v-5f91fe13><strong data-v-5f91fe13>Khung trả lời phỏng vấn:</strong> “I’d first clarify… The core entities are… The request flow is… I’d choose … because… The main failure case is… I’d monitor…”</p></div><h3 data-v-5f91fe13>CAP và bài toán thiết kế khác</h3><p class="section-text" data-v-5f91fe13>CAP chỉ nói về lựa chọn khi có network partition trong hệ thống phân tán: lúc đó không thể đồng thời đảm bảo mọi request đọc dữ liệu mới nhất và luôn trả lời thành công. Hãy nói rõ hành vi theo nghiệp vụ: số dư cần kiểm soát chặt; lượt xem hoặc feed có thể chấp nhận trễ ngắn.</p><div class="cards-grid cols-2" data-v-5f91fe13><div class="info-card" data-v-5f91fe13><h4 data-v-5f91fe13>URL Shortener</h4><p data-v-5f91fe13>Key generation, redirect, cache, collision và read-heavy traffic.</p></div><div class="info-card" data-v-5f91fe13><h4 data-v-5f91fe13>Rate Limiter</h4><p data-v-5f91fe13>Token bucket, atomic counter, giới hạn theo user/API key và multi-instance.</p></div><div class="info-card" data-v-5f91fe13><h4 data-v-5f91fe13>Chat</h4><p data-v-5f91fe13>WebSocket, lưu message, thứ tự trong conversation, offline delivery.</p></div><div class="info-card" data-v-5f91fe13><h4 data-v-5f91fe13>Notification</h4><p data-v-5f91fe13>Preference, template, retry, provider fallback và chống gửi lặp.</p></div></div>`,5)])}var Y=f(le,[[`render`,pe],[`__scopeId`,`data-v-5f91fe13`]]),me=`// 1. Async xử lý non-critical tasks
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
Page<User> page = userRepo.findAll(PageRequest.of(0, 20));`,he=`# Docker memory limits
-XX:+UseContainerSupport
-XX:MaxRAMPercentage=75.0
-Xss512k
-XX:+UseG1GC
-XX:+HeapDumpOnOutOfMemoryError`,ge=`// Dependency: spring-boot-starter-data-redis
@Configuration
@EnableCaching
class CacheConfig {
    @Bean
    RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaults = RedisCacheConfiguration
            .defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(5))
            .disableCachingNullValues();
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(defaults)
            .withCacheConfiguration("products", defaults.entryTtl(Duration.ofMinutes(10)))
            .build();
    }
}

// spring.data.redis.host/password should come from environment/secret manager,
// never commit credentials in application.yml.`,_e=`@Service
@RequiredArgsConstructor
class ProductQueryService {
    private final ProductRepository repository;

    @Cacheable(cacheNames = "products", key = "#tenantId + ':' + #productId")
    public ProductResponse get(String tenantId, long productId) {
        return repository.findByTenantIdAndId(tenantId, productId)
            .map(ProductResponse::from)
            .orElseThrow(() -> new ProductNotFoundException(productId));
    }
}

record ProductChanged(String tenantId, long productId) {}

@Component
@RequiredArgsConstructor
class ProductCacheInvalidator {
    private final CacheManager cacheManager;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void afterProductCommit(ProductChanged event) {
        Cache cache = cacheManager.getCache("products");
        if (cache != null) cache.evict(event.tenantId() + ':' + event.productId());
    }
}

// Chỉ publish ProductChanged trong transaction sau khi update thành công.`,ve={name:`BackendSectionPerf`,components:{CodeBlock:g},data(){return{perfCode:me,jvmCode:he,redisConfigCode:ge,cacheAsideCode:_e}}},ye={class:`bs-section`};function be(n,i,s,c,l,u){let f=e(`CodeBlock`);return t(),a(`div`,ye,[i[0]||=d(`<h3 data-v-2079068c>Caching Layers — dữ liệu nóng phục vụ nhanh hơn</h3><div class="diagram" data-v-2079068c> Client → CDN → Reverse Proxy → App Cache → Distributed Cache → Database </div><p class="section-text" data-v-2079068c>Mỗi lớp cache chặn request trước khi chạm tới tầng chậm hơn. <strong data-v-2079068c>Nguyên tắc:</strong> cache càng gần client càng nhanh, DB là nơi cuối cùng phải chịu tải. Cache hợp lý có thể giảm 80-90% tải DB — nhưng nhớ xử lý <strong data-v-2079068c>cache invalidation</strong> (dữ liệu cũ) và <strong data-v-2079068c>cache stampede</strong> (nhiều request cùng lúc miss).</p><h3 data-v-2079068c>Application Optimization — 4 kỹ thuật cốt lõi</h3><p class="section-text" data-v-2079068c><strong data-v-2079068c>@Async</strong> đẩy việc chậm ra nền, <strong data-v-2079068c>@Cacheable</strong> cache kết quả method, <strong data-v-2079068c>batch insert</strong> thay vì ghi từng dòng, <strong data-v-2079068c>pagination</strong> thay vì load toàn bộ. Bốn kỹ thuật này giải quyết đa số bài toán hiệu năng app Java.</p>`,5),o(f,{code:l.perfCode,language:`java`},null,8,[`code`]),i[1]||=r(`h3`,null,`Redis cache-aside trong Spring Boot`,-1),i[2]||=r(`p`,{class:`section-text`},`Cache-aside: service thử đọc cache; miss thì đọc DB rồi lưu kết quả với TTL. Khi cập nhật dữ liệu, invalidate key liên quan sau khi DB transaction commit. Cache là bản sao có thể xây lại, không phải nơi duy nhất lưu dữ liệu quan trọng.`,-1),o(f,{code:l.redisConfigCode,language:`java / yaml`},null,8,[`code`]),o(f,{code:l.cacheAsideCode,language:`java`},null,8,[`code`]),i[3]||=d(`<div class="cards-grid cols-2" data-v-2079068c><div class="info-card" data-v-2079068c><h4 data-v-2079068c>Chọn TTL và key</h4><p data-v-2079068c>TTL theo mức chấp nhận stale data; thêm jitter để tránh nhiều key hết hạn cùng lúc. Key phải gồm tenant/user nếu dữ liệu cá nhân hóa, ví dụ <code data-v-2079068c>product:tenant-7:42</code>.</p></div><div class="info-card" data-v-2079068c><h4 data-v-2079068c>Chống stampede</h4><p data-v-2079068c>Khi key nóng hết hạn, nhiều request có thể cùng query DB. Dùng TTL jitter, single-flight/lock có giới hạn hoặc refresh nền; luôn đặt timeout và fallback hợp lý.</p></div><div class="info-card" data-v-2079068c><h4 data-v-2079068c>Invalidate đúng lúc</h4><p data-v-2079068c>Evict sau commit để tránh request khác đọc lại giá trị cũ trong khi transaction chưa lưu. Khi có nhiều app instance, invalidation phải tới cùng cache dùng chung.</p></div><div class="info-card" data-v-2079068c><h4 data-v-2079068c>Đo hiệu quả</h4><p data-v-2079068c>Theo dõi hit/miss ratio, Redis latency, evictions, memory, DB QPS và stale-data incidents. Nếu hit thấp hoặc dữ liệu đổi liên tục thì cache có thể làm hệ thống phức tạp hơn.</p></div></div><h3 data-v-2079068c>JVM Tuning — ép container dùng đúng RAM</h3><p class="section-text" data-v-2079068c>Khi chạy JVM trong container, JVM mặc định nhìn RAM của host — có thể dùng quá limit container và bị kill. <code data-v-2079068c>MaxRAMPercentage</code> giới hạn JVM dùng 75% RAM container. <code data-v-2079068c>G1GC</code> cho latency thấp, <code data-v-2079068c>HeapDumpOnOutOfMemoryError</code> để capture heap khi crash.</p>`,3),o(f,{code:l.jvmCode,language:`bash`},null,8,[`code`])])}var X=f(ve,[[`render`,be],[`__scopeId`,`data-v-2079068c`]]),xe=`@Transactional
public Order createOrder(CreateOrderRequest req) {
    Order order = orderRepo.save(toEntity(req));
    outboxRepo.save(new OutboxEvent("order", order.getId(), "OrderCreated", serialize(req)));
    return order;
}
// CDC Worker — Debezium capture changes từ outbox → publish lên Kafka`,Se={name:`BackendSectionArch`,components:{CodeBlock:g},data(){return{outboxCode:xe}}},Ce={class:`bs-section`};function we(n,r,i,s,c,l){let u=e(`CodeBlock`);return t(),a(`div`,Ce,[r[0]||=d(`<h3 data-v-2b793049>Architecture Patterns — chọn kiến trúc theo bài toán</h3><div class="cards-grid cols-4" data-v-2b793049><div class="info-card" data-v-2b793049><h4 data-v-2b793049>Monolithic</h4><p data-v-2b793049>1 ứng dụng, 1 DB. Đơn giản, dễ develop. Giới hạn: scaling — phải scale cả app khi chỉ 1 module nóng.</p></div><div class="info-card" data-v-2b793049><h4 data-v-2b793049>Microservices</h4><p data-v-2b793049>Nhiều service nhỏ, độc lập. Cần: API Gateway, service discovery. Phức tạp hơn nhưng scale và deploy độc lập.</p></div><div class="info-card" data-v-2b793049><h4 data-v-2b793049>CQRS + Event Sourcing</h4><p data-v-2b793049>Tách read/write model. Lưu events thay vì state. Read model tối ưu riêng cho query.</p></div><div class="info-card" data-v-2b793049><h4 data-v-2b793049>Event-Driven</h4><p data-v-2b793049>Service giao tiếp qua events (Kafka). Saga pattern. Tách rời, chịu lỗi tốt nhưng khó debug hơn.</p></div></div><h3 data-v-2b793049>Thiết kế một hệ thống enterprise bằng Spring Boot</h3><p class="section-text" data-v-2b793049>Bài toán xuyên suốt: khách hàng doanh nghiệp cần tạo đơn hàng, thanh toán và theo dõi trạng thái. Bắt đầu bằng một modular monolith Spring Boot với các module <code data-v-2b793049>order</code>, <code data-v-2b793049>payment</code>, <code data-v-2b793049>inventory</code>; chỉ tách service khi có nhu cầu deploy, scale hoặc sở hữu dữ liệu độc lập. Mỗi service sở hữu database của mình, giao tiếp qua API có version hoặc event; tránh để service này đọc trực tiếp database của service khác.</p><div class="cards-grid cols-4" data-v-2b793049><div class="info-card" data-v-2b793049><h4 data-v-2b793049>REST</h4><p data-v-2b793049>Dùng cho command và resource có contract ổn định: <code data-v-2b793049>POST /orders</code>, <code data-v-2b793049>GET /orders/{id}</code>. Dễ cache, quan sát và tích hợp với đối tác.</p></div><div class="info-card" data-v-2b793049><h4 data-v-2b793049>GraphQL</h4><p data-v-2b793049>Hợp khi nhiều client cần chọn các trường hoặc quan hệ khác nhau. Đặt giới hạn độ sâu/chi phí query, kiểm soát N+1 và quyền ở từng field.</p></div><div class="info-card" data-v-2b793049><h4 data-v-2b793049>Async events</h4><p data-v-2b793049>Dùng event như <code data-v-2b793049>OrderCreated</code> khi consumer không cần phản hồi tức thời. Thiết kế idempotency, retry có giới hạn, dead-letter và eventual consistency.</p></div><div class="info-card" data-v-2b793049><h4 data-v-2b793049>Spring Boot production</h4><p data-v-2b793049>Giữ service stateless; cấu hình connection pool, timeout, health/readiness, metrics và structured logs. Scale theo số liệu thực tế, không chỉ tăng replica.</p></div></div><h3 data-v-2b793049>Luồng thực tế và các điểm phải quyết định</h3><ol class="steps-list" data-v-2b793049><li data-v-2b793049><strong data-v-2b793049>POST /orders:</strong> Spring controller kiểm tra DTO, service xác thực quyền và quy tắc tồn kho, ghi order cùng outbox trong transaction.</li><li data-v-2b793049><strong data-v-2b793049>Thanh toán:</strong> worker phát event; payment service gọi nhà cung cấp với timeout và idempotency key. Không giữ transaction database mở trong lúc gọi mạng.</li><li data-v-2b793049><strong data-v-2b793049>Nhất quán phân tán:</strong> nếu thanh toán thất bại, Saga điều phối trạng thái hoặc hành động bù; API trả trạng thái có thể theo dõi thay vì giả vờ mọi bước hoàn tất đồng bộ.</li><li data-v-2b793049><strong data-v-2b793049>Vận hành:</strong> CI/CD chạy test và scan, tạo image bất biến, triển khai staging trước production trên Kubernetes/AWS; Terraform quản lý hạ tầng và rollback dùng image/version trước.</li><li data-v-2b793049><strong data-v-2b793049>Quyết định tách service:</strong> đo bottleneck, tần suất release và ranh giới sở hữu dữ liệu trước. Microservices tăng độ phức tạp về network, tracing, bảo mật và xử lý lỗi.</li></ol><p class="section-text" data-v-2b793049><strong data-v-2b793049>Cách phối hợp với khách hàng quốc tế:</strong> xác nhận acceptance criteria và API contract bằng văn bản; làm rõ múi giờ, deadline, dữ liệu nhạy cảm và hành vi lỗi; thống nhất với frontend, QA, product và DevOps trước khi chia task. Khi có trade-off, trình bày lựa chọn, rủi ro và đề xuất bằng ngôn ngữ dễ hiểu.</p><h3 data-v-2b793049>Outbox Pattern — đảm bảo &quot;ghi DB + gửi event&quot; cùng xảy ra</h3><p class="section-text" data-v-2b793049>Vấn đề: ghi Order vào DB xong gửi event lên Kafka — nếu gửi event fail, dữ liệu ghi rồi nhưng hệ thống khác không biết (mất event). <strong data-v-2b793049>Outbox Pattern:</strong> ghi event vào bảng <code data-v-2b793049>outbox</code> <strong data-v-2b793049>trong cùng transaction</strong> với Order. Sau đó CDC Worker (Debezium) đọc bảng outbox và publish lên Kafka — đảm bảo không mất event, không trùng.</p>`,10),o(u,{code:c.outboxCode,language:`java`},null,8,[`code`])])}var Z=f(Se,[[`render`,we],[`__scopeId`,`data-v-2b793049`]]),Te={name:`BackendSectionInterview`,methods:{handleNav(e){h(e)}}},Ee={class:`bs-section`},De={class:`interview-cta`};function Oe(e,n,i,o,s,c){return t(),a(`div`,Ee,[n[1]||=d(`<h3 data-v-9fa7f757>Câu hỏi theo level — bạn đang ở đâu?</h3><p class="section-text" data-v-9fa7f757>Các câu hỏi phỏng vấn backend thường tăng dần theo level: Junior hỏi nền tảng, Middle hỏi vận hành, Senior hỏi thiết kế &amp; xử lý sự cố, Architect hỏi kiến trúc hệ thống. Luyện từ level của bạn trở lên để sẵn sàng.</p><div class="cards-grid cols-4" data-v-9fa7f757><div class="info-card level-junior" data-v-9fa7f757><h4 data-v-9fa7f757>🌱 Junior</h4><ul data-v-9fa7f757><li data-v-9fa7f757>ACID là gì?</li><li data-v-9fa7f757>INNER JOIN vs LEFT JOIN?</li><li data-v-9fa7f757>INDEX hoạt động thế nào?</li><li data-v-9fa7f757>Transaction isolation levels?</li><li data-v-9fa7f757>GET vs POST?</li></ul></div><div class="info-card level-middle" data-v-9fa7f757><h4 data-v-9fa7f757>📈 Middle</h4><ul data-v-9fa7f757><li data-v-9fa7f757>N+1 problem + fix?</li><li data-v-9fa7f757>Optimistic vs Pessimistic lock?</li><li data-v-9fa7f757>Redis dùng để làm gì?</li><li data-v-9fa7f757>Kafka partition?</li><li data-v-9fa7f757>Docker multi-stage build?</li></ul></div><div class="info-card level-senior" data-v-9fa7f757><h4 data-v-9fa7f757>🎯 Senior</h4><ul data-v-9fa7f757><li data-v-9fa7f757>CAP theorem?</li><li data-v-9fa7f757>Saga pattern?</li><li data-v-9fa7f757>Distributed caching?</li><li data-v-9fa7f757>Circuit Breaker?</li></ul></div><div class="info-card level-architect" data-v-9fa7f757><h4 data-v-9fa7f757>🏗️ Architect</h4><ul data-v-9fa7f757><li data-v-9fa7f757>Design URL shortener?</li><li data-v-9fa7f757>Design chat 10M users?</li><li data-v-9fa7f757>CQRS + Event Sourcing?</li></ul></div></div>`,3),r(`div`,De,[r(`a`,{href:`#`,onClick:n[0]||=m(e=>c.handleNav(`/salary-interview`),[`prevent`])},`💰 Luyện phỏng vấn theo mức lương →`)])])}var Q=f(Te,[[`render`,Oe],[`__scopeId`,`data-v-9fa7f757`]]),ke=[{id:`sql`,num:`01`,title:`SQL & Database`,component:S},{id:`nosql`,num:`02`,title:`NoSQL Databases`,component:C},{id:`mq`,num:`03`,title:`Message Queue`,component:k},{id:`docker`,num:`04`,title:`Docker`,component:F},{id:`k8s`,num:`05`,title:`Kubernetes`,component:H},{id:`cicd`,num:`06`,title:`CI/CD`,component:q},{id:`design`,num:`07`,title:`System Design`,component:Y},{id:`perf`,num:`08`,title:`Performance Optimization`,component:X},{id:`arch`,num:`09`,title:`Architecture Patterns`,component:Z},{id:`interview`,num:`10`,title:`Câu hỏi phỏng vấn`,component:Q}],Ae={name:`BackendSectionPage`,components:{SectionSql:S,SectionNosql:C,SectionMq:k,SectionDocker:F,SectionK8s:H,SectionCicd:q,SectionDesign:Y,SectionPerf:X,SectionArch:Z,SectionInterview:Q},data(){return{sections:ke}},computed:{currentId(){return this.$route.params.sectionId},current(){return this.sections.find(e=>e.id===this.currentId)||null},currentComponent(){return this.current?this.current.component:null},currentTitle(){return this.current?this.current.title:``},currentNum(){return this.current?this.current.num:``},currentIndex(){return this.sections.findIndex(e=>e.id===this.currentId)},prev(){let e=this.currentIndex;return e>0?this.sections[e-1]:null},next(){let e=this.currentIndex;return e>=0&&e<this.sections.length-1?this.sections[e+1]:null},prevTitle(){return this.prev?this.prev.title:``},nextTitle(){return this.next?this.next.title:``}},mounted(){this.ensureValid()},watch:{"$route.params.sectionId"(){this.ensureValid()}},methods:{ensureValid(){this.current?window.scrollTo({top:0,behavior:`smooth`}):h(`/java/backend/sql`,{target:`router`})},handleNav(e){h(e)},goTo(e){h(`/java/backend/${e}`,{target:`router`})}}},je={class:`backend-section-page`},Me={class:`page-header`},Ne={class:`header-content`},Pe={class:`header-nav`},Fe={class:`page-content`},Ie={class:`sidebar-toc`},Le={class:`toc-container`},Re={class:`toc-nav`},ze=[`onClick`],Be={class:`toc-num`},Ve={class:`toc-text`},$={class:`main-content`},He={class:`content-section`},Ue={class:`section-header`},We={class:`section-num`},Ge={class:`section-title`},Ke={class:`section-body`},qe={class:`pager`},Je=[`disabled`],Ye=[`disabled`];function Xe(e,o,u,d,f,h){return t(),a(`div`,je,[r(`header`,Me,[r(`div`,Ne,[r(`div`,Pe,[r(`button`,{class:`nav-btn`,onClick:o[0]||=e=>h.handleNav(`/java/hub`)},[...o[4]||=[r(`span`,null,`←`,-1),r(`span`,null,`Java`,-1)]]),r(`button`,{class:`nav-btn`,onClick:o[1]||=e=>h.handleNav(`/`)},[...o[5]||=[r(`span`,null,`🏠`,-1),r(`span`,null,`Trang chủ`,-1)]])]),o[6]||=r(`div`,{class:`header-title`},[r(`h1`,null,`⚙️ Backend Engineering`),r(`p`,{class:`desc`},`Database, Message Queue, Docker, K8s, CI/CD, System Design, Performance`)],-1)])]),r(`div`,Fe,[r(`aside`,Ie,[r(`div`,Le,[o[7]||=r(`h3`,{class:`toc-title`},`Các bài học`,-1),r(`nav`,Re,[(t(!0),a(s,null,n(f.sections,e=>(t(),a(`a`,{key:e.id,href:`#`,class:i([`toc-link`,{active:e.id===h.currentId}]),onClick:m(t=>h.goTo(e.id),[`prevent`])},[r(`span`,Be,p(e.num)+`.`,1),r(`span`,Ve,p(e.title),1)],10,ze))),128))])])]),r(`main`,$,[r(`section`,He,[r(`div`,Ue,[r(`span`,We,p(h.currentNum),1),r(`h2`,Ge,p(h.currentTitle),1)]),r(`div`,Ke,[(t(),l(c(h.currentComponent)))])]),r(`div`,qe,[r(`button`,{class:`pager-btn`,disabled:!h.prev,onClick:o[2]||=e=>h.goTo(h.prev.id)},` ← `+p(h.prevTitle),9,Je),r(`button`,{class:`pager-btn next`,disabled:!h.next,onClick:o[3]||=e=>h.goTo(h.next.id)},p(h.nextTitle)+` → `,9,Ye)])])])])}var Ze=f(Ae,[[`render`,Xe],[`__scopeId`,`data-v-c42a4c37`]]);export{Ze as default};