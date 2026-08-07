<template>
  <div class="backend-page">
    <!-- Sticky Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-nav">
          <button class="nav-btn" @click="handleNav('/java/hub')">
            <span>←</span>
            <span>Java</span>
          </button>
          <button class="nav-btn" @click="handleNav('/')">
            <span>🏠</span>
            <span>Trang chủ</span>
          </button>
        </div>
        <div class="header-title">
          <h1>⚙️ Backend Engineering</h1>
          <p class="desc">Database, Message Queue, Docker, K8s, CI/CD, System Design, Performance</p>
        </div>
      </div>
    </header>

    <div class="page-content">
      <!-- Sticky Sidebar TOC -->
      <aside class="sidebar-toc">
        <div class="toc-container">
          <h3 class="toc-title">Mục lục</h3>
          <nav class="toc-nav">
            <a
              v-for="section in tocSections"
              :key="section.id"
              href="#"
              class="toc-link"
              :class="{ active: activeSection === section.id }"
              @click.prevent="scrollTo(section.id)"
            >
              <span class="toc-num">{{ section.num }}.</span>
              <span class="toc-text">{{ section.title }}</span>
            </a>
          </nav>
          <div class="toc-progress">
            <span class="progress-label">Tiến độ</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${scrollProgress}%` }" />
            </div>
            <span class="progress-value">{{ Math.round(scrollProgress) }}%</span>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- 1. SQL & Database -->
        <section id="sql" class="content-section" ref="sectionRefs">
          <div class="section-header">
            <span class="section-num">01</span>
            <h2 class="section-title">SQL & Database</h2>
          </div>
          <div class="section-body">
            <h3>ACID Properties</h3>
            <div class="cards-grid">
              <div class="info-card">
                <h4>Atomicity</h4>
                <p>Toàn bộ hoặc không gì cả. Transaction commit → all changes. Rollback → không thay đổi nào.</p>
              </div>
              <div class="info-card">
                <h4>Consistency</h4>
                <p>Dữ liệu từ trạng thái hợp lệ này sang hợp lệ khác. Ràng buộc (FK, unique, check) luôn được đảm bảo.</p>
              </div>
              <div class="info-card">
                <h4>Isolation</h4>
                <p>Transaction không ảnh hưởng lẫn nhau. Các mức: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE.</p>
              </div>
              <div class="info-card">
                <h4>Durability</h4>
                <p>Dữ liệu đã commit được lưu vĩnh viễn. Dùng WAL (Write-Ahead Log) để phục hồi khi crash.</p>
              </div>
            </div>

            <h3>Index chi tiết</h3>
            <CodeBlock :code="indexCode" language="sql" />

            <h3>Transaction & Locking</h3>
            <CodeBlock :code="transactionCode" language="java" />

            <h3>Query Optimization</h3>
            <ul class="tips-list">
              <li><strong>EXPLAIN ANALYZE:</strong> xem seq scan vs index scan</li>
              <li><strong>N+1:</strong> dùng JOIN FETCH, @EntityGraph</li>
              <li><strong>Chỉ SELECT cần thiết:</strong> không SELECT *</li>
              <li><strong>Pagination:</strong> keyset pagination thay vì OFFSET</li>
              <li><strong>Connection pool:</strong> HikariCP size ~ 2*CPU + 1</li>
            </ul>
          </div>
        </section>

        <!-- 2. NoSQL -->
        <section id="nosql" class="content-section">
          <div class="section-header">
            <span class="section-num">02</span>
            <h2 class="section-title">NoSQL Databases</h2>
          </div>
          <div class="section-body">
            <div class="cards-grid cols-4">
              <div class="info-card">
                <h4>Redis</h4>
                <p>In-memory key-value. Cache, session, rate limiter, distributed lock, pub/sub.</p>
              </div>
              <div class="info-card">
                <h4>MongoDB</h4>
                <p>Document DB (JSON-like). Flexible schema, nested data.</p>
              </div>
              <div class="info-card">
                <h4>Cassandra</h4>
                <p>Wide-column, write-optimized. Time-series, IoT, event logging.</p>
              </div>
              <div class="info-card">
                <h4>Elasticsearch</h4>
                <p>Full-text search + analytics. Logging, search engine.</p>
              </div>
            </div>

            <h3>Redis Patterns</h3>
            <CodeBlock :code="redisCode" language="java" />
          </div>
        </section>

        <!-- 3. Message Queue -->
        <section id="mq" class="content-section">
          <div class="section-header">
            <span class="section-num">03</span>
            <h2 class="section-title">Message Queue (Kafka & RabbitMQ)</h2>
          </div>
          <div class="section-body">
            <div class="cards-grid cols-2">
              <div class="info-card">
                <h4>🐇 RabbitMQ</h4>
                <p>Message broker cổ điển. Exchange types: Direct, Topic, Fanout. Dùng cho: task queue, RPC, pub/sub.</p>
              </div>
              <div class="info-card">
                <h4>📊 Kafka</h4>
                <p>Distributed event streaming. Topic, Partition, Consumer Group, Offset. Dùng cho: event sourcing, stream processing.</p>
              </div>
            </div>

            <h3>Spring Kafka</h3>
            <CodeBlock :code="kafkaCode" language="java" />

            <h3>Kafka Streams</h3>
            <CodeBlock :code="kafkaStreamsCode" language="java" />
          </div>
        </section>

        <!-- 4. Docker -->
        <section id="docker" class="content-section">
          <div class="section-header">
            <span class="section-num">04</span>
            <h2 class="section-title">Docker</h2>
          </div>
          <div class="section-body">
            <h3>Dockerfile cho Spring Boot</h3>
            <CodeBlock :code="dockerfileCode" language="dockerfile" />

            <h3>docker-compose</h3>
            <CodeBlock :code="dockerComposeCode" language="yaml" />
          </div>
        </section>

        <!-- 5. Kubernetes -->
        <section id="k8s" class="content-section">
          <div class="section-header">
            <span class="section-num">05</span>
            <h2 class="section-title">Kubernetes</h2>
          </div>
          <div class="section-body">
            <h3>Deployment & Service</h3>
            <CodeBlock :code="k8sDeploymentCode" language="yaml" />

            <h3>ConfigMap & Secret</h3>
            <CodeBlock :code="k8sConfigMapCode" language="yaml" />

            <h3>Horizontal Pod Autoscaler</h3>
            <CodeBlock :code="k8sHpaCode" language="yaml" />
          </div>
        </section>

        <!-- 6. CI/CD -->
        <section id="cicd" class="content-section">
          <div class="section-header">
            <span class="section-num">06</span>
            <h2 class="section-title">CI/CD</h2>
          </div>
          <div class="section-body">
            <h3>GitHub Actions</h3>
            <CodeBlock :code="githubActionsCode" language="yaml" />

            <h3>Git Flow</h3>
            <div class="cards-grid cols-4">
              <div class="info-card"><h4>main</h4><p>Production-ready. Chỉ merge từ release/hotfix.</p></div>
              <div class="info-card"><h4>develop</h4><p>Tích hợp feature branches.</p></div>
              <div class="info-card"><h4>feature/xxx</h4><p>Nhánh từ develop. Tên theo ticket.</p></div>
              <div class="info-card"><h4>release/v1.2</h4><p>Chuẩn bị release. Chỉ fix bug.</p></div>
            </div>

            <h3>Code Quality Gates</h3>
            <ul class="tips-list">
              <li><strong>SonarQube:</strong> code smell, bug, coverage gate</li>
              <li><strong>Checkstyle/PMD:</strong> coding convention</li>
              <li><strong>OWASP Dependency Check:</strong> scan CVE</li>
              <li><strong>Trivy:</strong> scan Docker image vulnerabilities</li>
            </ul>
          </div>
        </section>

        <!-- 7. System Design -->
        <section id="design" class="content-section">
          <div class="section-header">
            <span class="section-num">07</span>
            <h2 class="section-title">System Design</h2>
          </div>
          <div class="section-body">
            <h3>CAP Theorem</h3>
            <div class="diagram">
              CAP Theorem<br>
              Consistency vs Availability<br>
              Partition Tolerance is mandatory
            </div>
            <p class="section-text">Trong distributed system, khi có network partition (P), bạn chỉ chọn được C (consistency) hoặc A (availability). Không có hệ thống nào có cả 3 cùng lúc.</p>

            <h3>Common Design Questions</h3>
            <div class="cards-grid cols-4">
              <div class="info-card"><h4>URL Shortener</h4><p>Base62 encoding. Redis cache. DB sharding. 301 redirect.</p></div>
              <div class="info-card"><h4>Rate Limiter</h4><p>Token Bucket + Redis. Headers: X-RateLimit-Remaining.</p></div>
              <div class="info-card"><h4>Chat System</h4><p>WebSocket Gateway. Kafka message queue. Redis pub/sub.</p></div>
              <div class="info-card"><h4>Notification System</h4><p>Kafka → Push Worker, Email Worker, SMS Worker.</p></div>
            </div>

            <h3>Estimation Cheat Sheet</h3>
            <CodeBlock :code="estimationCode" language="bash" />
          </div>
        </section>

        <!-- 8. Performance -->
        <section id="perf" class="content-section">
          <div class="section-header">
            <span class="section-num">08</span>
            <h2 class="section-title">Performance Optimization</h2>
          </div>
          <div class="section-body">
            <h3>Caching Layers</h3>
            <div class="diagram">
              Client → CDN → Reverse Proxy → App Cache → Distributed Cache → Database
            </div>

            <h3>Application Optimization</h3>
            <CodeBlock :code="perfCode" language="java" />

            <h3>JVM Tuning</h3>
            <CodeBlock :code="jvmCode" language="bash" />
          </div>
        </section>

        <!-- 9. Architecture Patterns -->
        <section id="arch" class="content-section">
          <div class="section-header">
            <span class="section-num">09</span>
            <h2 class="section-title">Architecture Patterns</h2>
          </div>
          <div class="section-body">
            <div class="cards-grid cols-4">
              <div class="info-card"><h4>Monolithic</h4><p>1 ứng dụng, 1 DB. Đơn giản, dễ develop. Giới hạn: scaling.</p></div>
              <div class="info-card"><h4>Microservices</h4><p>Nhiều service nhỏ, độc lập. Cần: API Gateway, service discovery.</p></div>
              <div class="info-card"><h4>CQRS + Event Sourcing</h4><p>Tách read/write model. Lưu events thay vì state.</p></div>
              <div class="info-card"><h4>Event-Driven</h4><p>Service giao tiếp qua events (Kafka). Saga pattern.</p></div>
            </div>

            <h3>Outbox Pattern</h3>
            <CodeBlock :code="outboxCode" language="java" />
          </div>
        </section>

        <!-- 10. Interview Questions -->
        <section id="interview" class="content-section">
          <div class="section-header">
            <span class="section-num">10</span>
            <h2 class="section-title">Câu hỏi phỏng vấn Backend</h2>
          </div>
          <div class="section-body">
            <div class="cards-grid cols-4">
              <div class="info-card level-junior"><h4>🌱 Junior</h4><ul><li>ACID là gì?</li><li>INNER JOIN vs LEFT JOIN?</li><li>INDEX hoạt động thế nào?</li><li>Transaction isolation levels?</li><li>GET vs POST?</li></ul></div>
              <div class="info-card level-middle"><h4>📈 Middle</h4><ul><li>N+1 problem + fix?</li><li>Optimistic vs Pessimistic lock?</li><li>Redis dùng để làm gì?</li><li>Kafka partition?</li><li>Docker multi-stage build?</li></ul></div>
              <div class="info-card level-senior"><h4>🎯 Senior</h4><ul><li>CAP theorem?</li><li>Saga pattern?</li><li>Distributed caching?</li><li>Circuit Breaker?</li></ul></div>
              <div class="info-card level-architect"><h4>🏗️ Architect</h4><ul><li>Design URL shortener?</li><li>Design chat 10M users?</li><li>CQRS + Event Sourcing?</li></ul></div>
            </div>
            <div class="interview-cta">
              <a href="#" @click.prevent="handleNav('/salary-interview')">💰 Luyện phỏng vấn theo mức lương →</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { navigate } from '../utils/navigate.js';
import CodeBlock from '../components/CodeBlock.vue';

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

const activeSection = ref('');
const scrollProgress = ref(0);
const sectionRefs = ref([]);

const handleNav = (path) => navigate(path);

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  // Update active section
  for (const section of tocSections) {
    const el = document.getElementById(section.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom > 150) {
        activeSection.value = section.id;
        break;
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Code snippets
const indexCode = `-- B-Tree index (mặc định) — tốt cho =, >, <, BETWEEN, LIKE 'abc%'
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
CREATE INDEX idx_covering ON users(email) INCLUDE (name, avatar_url);`;

const transactionCode = `-- Pessimistic Lock
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT o FROM Order o WHERE o.id = :id")
Optional<Order> findByIdForUpdate(@Param("id") Long id);

-- Optimistic Lock — dùng version column
@Entity
public class Product {
    @Version
    private Long version;
}

-- Deadlock fix: luôn lock theo cùng thứ tự (id 1 → 2)`;

const redisCode = `// Cache Aside
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
// Lưu tokens + last_refill_time trong Redis Hash`;

const kafkaCode = `@RestController
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
}`;

const kafkaStreamsCode = `StreamsBuilder builder = new StreamsBuilder();
KStream<String, OrderEvent> stream = builder.stream("order-events");

KTable<Long, Long> countPerMinute = stream
    .filter((k, v) -> "CREATED".equals(v.getType()))
    .groupBy((k, v) -> v.getProductId())
    .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
    .count();`;

const dockerfileCode = `# Multi-stage build
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
ENTRYPOINT ["java", "-jar", "app.jar"]`;

const dockerComposeCode = `version: '3.8'
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
      test: ["CMD-SHELL", "pg_isready -U postgres"]`;

const k8sDeploymentCode = `# deployment.yml
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
              memory: "1Gi"`;

const k8sConfigMapCode = `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yml: |
    app:
      name: user-service
    spring:
      datasource:
        url: jdbc:postgresql://postgres:5432/users`;

const k8sHpaCode = `apiVersion: autoscaling/v2
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
          averageUtilization: 70`;

const githubActionsCode = `name: Build and Deploy
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
      - run: kubectl set image deployment/app app=registry.example.com/app:\${{ github.sha }}`;

const estimationCode = `1 request/second = 86,400 requests/day ≈ 2.5M/month
1M requests/day ≈ 12 requests/second
PostgreSQL: ~5k writes/s, ~50k reads/s (single node)
Redis: ~100k ops/s (single node)
Network latency: data center 0.5ms, same region 5ms`;

const perfCode = `// 1. Async xử lý non-critical tasks
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
Page<User> page = userRepo.findAll(PageRequest.of(0, 20));`;

const jvmCode = `# Docker memory limits
-XX:+UseContainerSupport
-XX:MaxRAMPercentage=75.0
-Xss512k
-XX:+UseG1GC
-XX:+HeapDumpOnOutOfMemoryError`;

const outboxCode = `@Transactional
public Order createOrder(CreateOrderRequest req) {
    Order order = orderRepo.save(toEntity(req));
    outboxRepo.save(new OutboxEvent("order", order.getId(), "OrderCreated", serialize(req)));
    return order;
}
// CDC Worker — Debezium capture changes từ outbox → publish lên Kafka`;
</script>

<style scoped>
.backend-page {
  background: var(--forge-bg);
  min-height: 100vh;
  color: var(--forge-text);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.7;
}

/* Page Header */
.page-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: linear-gradient(180deg, var(--forge-bg) 0%, var(--forge-bg) 70%, transparent 100%);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 960px;
  margin: 0 auto;
}

.header-nav {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  color: var(--forge-text2);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background: var(--forge-surface-hover);
  color: var(--forge-text);
  border-color: var(--forge-accent, var(--forge-fire));
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.desc {
  color: var(--forge-text2);
  font-size: 0.9rem;
  margin: 0;
}

/* Page Content Layout */
.page-content {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Sidebar TOC */
.sidebar-toc {
  position: relative;
}

.toc-container {
  position: sticky;
  top: 120px;
  padding: 1.25rem;
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.toc-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--forge-text3);
  margin: 0 0 1rem;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toc-link {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: var(--forge-text2);
  font-size: 0.85rem;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.toc-link:hover {
  background: var(--forge-surface-hover);
  color: var(--forge-text);
}

.toc-link.active {
  background: var(--forge-fire);
  color: white;
}

.toc-link.active .toc-num {
  opacity: 0.8;
}

.toc-num {
  font-weight: 600;
  opacity: 0.6;
}

.toc-text {
  flex: 1;
}

.toc-progress {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--forge-glass-border);
}

.progress-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--forge-text3);
}

.progress-bar {
  height: 4px;
  background: var(--forge-surface);
  border-radius: 99px;
  margin: 0.5rem 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--forge-fire), var(--forge-ember));
  border-radius: 99px;
  transition: width 0.3s ease;
}

.progress-value {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--forge-ember);
}

/* Main Content */
.main-content {
  min-width: 0;
}

/* Content Section */
.content-section {
  margin-bottom: 3rem;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--forge-glass-border);
}

.section-num {
  font-size: 2rem;
  font-weight: 900;
  font-family: var(--font-mono);
  color: var(--forge-fire);
  opacity: 0.3;
  line-height: 1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--forge-text);
}

.section-body h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--forge-fire);
}

.section-body h3:first-child {
  margin-top: 0;
}

.section-text {
  color: var(--forge-text2);
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 1rem 0;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.cards-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.info-card {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  transition: all var(--transition-fast);
}

.info-card:hover {
  border-color: var(--forge-accent, var(--forge-fire));
  transform: translateY(-2px);
}

.info-card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--forge-text);
}

.info-card p,
.info-card li {
  font-size: 0.8rem;
  color: var(--forge-text3);
  margin: 0;
  line-height: 1.5;
}

.info-card ul {
  padding-left: 1rem;
  margin: 0.25rem 0 0;
}

.info-card li {
  margin-bottom: 0.2rem;
}

/* Level cards */
.level-junior { border-left: 3px solid #22c55e; }
.level-middle { border-left: 3px solid #3b82f6; }
.level-senior { border-left: 3px solid #f59e0b; }
.level-architect { border-left: 3px solid #ef4444; }

/* Tips List */
.tips-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.tips-list li {
  padding: 0.5rem 0.75rem;
  background: var(--forge-surface);
  border-radius: var(--radius-sm);
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--forge-text2);
}

.tips-list strong {
  color: var(--forge-fire);
}

/* Diagram */
.diagram {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  margin: 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: var(--forge-fire);
  font-weight: 600;
  line-height: 2;
  font-family: var(--font-mono);
}

/* Interview CTA */
.interview-cta {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(251, 191, 36, 0.1));
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: var(--forge-card-radius);
  text-align: center;
}

.interview-cta a {
  color: var(--forge-ember);
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
}

.interview-cta a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 1024px) {
  .page-content {
    grid-template-columns: 1fr;
  }

  .sidebar-toc {
    display: none;
  }
}

@media (max-width: 768px) {
  .cards-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-title {
    font-size: 1.25rem;
  }

  .section-num {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }

  .page-header {
    padding: 1rem;
  }

  .header-title h1 {
    font-size: 1.25rem;
  }

  .nav-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .content-section,
  .info-card {
    animation: none;
    transition: none;
  }
}
</style>
