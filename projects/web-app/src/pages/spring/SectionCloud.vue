<template>
  <div class="ss-section">
    <h3>Service Discovery (Eureka) — các service tìm nhau thế nào?</h3>
    <p class="section-text">Trong microservices, service chạy ở nhiều instance với IP thay đổi liên tục (scale, deploy). <strong>Eureka Server</strong> là "danh bạ" — mỗi service tự đăng ký (địa chỉ + port) khi khởi động, service khác tra danh bạ để gọi. Không có nó, phải hardcode địa chỉ — vỡ ngay khi scale.</p>
    <CodeBlock :code="eurekaCode" language="java" />

    <h3>API Gateway — cửa ngõ duy nhất vào hệ thống</h3>
    <p class="section-text"><strong>Gateway</strong> đứng trước mọi service: định tuyến (<code>/api/users/**</code> → user-service), xác thực, rate limiting, circuit breaker. Client chỉ gọi 1 địa chỉ, không cần biết hệ thống bên trong có bao nhiêu service. <code>lb://user-service</code> = load balancing qua Eureka.</p>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>Circuit Breaker</h4><p>Service con chết/đứng → gateway chuyển sang fallback thay vì giữ request chờ — ngăn lỗi leo thang lan cả hệ thống.</p></div>
      <div class="info-card"><h4>Lợi ích thực tế</h4><p>1 điểm duy nhất để áp security, CORS, logging, monitoring — thay vì lặp ở từng service.</p></div>
    </div>
    <CodeBlock :code="gatewayCode" language="java" />

    <h3>Spring Cloud Config — cấu hình tập trung</h3>
    <p class="section-text">Cấu hình (DB url, secret, feature flag) nằm ở <strong>1 nơi duy nhất</strong>, các service pull về khi khởi động. Đổi config không cần sửa code + deploy từng service — chỉ sửa ở Config Server rồi refresh. Tránh tình trạng config nằm rải rác, khác nhau giữa các service.</p>
    <CodeBlock :code="configCode" language="yaml" />

    <h3>Best Practices Checklist</h3>
    <ul class="tips-list">
      <li><strong>Package structure:</strong> controller → service → repository → entity/dto</li>
      <li><strong>DTO riêng:</strong> không expose entity ra ngoài</li>
      <li><strong>Exception handling:</strong> Global exception handler</li>
      <li><strong>Logging:</strong> SLF4J + MDC (traceId, userId)</li>
      <li><strong>Transaction:</strong> @Transactional trên service layer</li>
      <li><strong>Security:</strong> JWT + HTTPS, không hardcode secret</li>
      <li><strong>Monitoring:</strong> Actuator + Micrometer + Prometheus</li>
    </ul>
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const eurekaCode = `// Service Registry (Eureka Server)
@SpringBootApplication
@EnableEurekaServer
public class ServiceRegistry { }

// Client
@SpringBootApplication
@EnableDiscoveryClient
public class UserService { }`;

const gatewayCode = `@Bean
public RouteLocator customRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("user-service", r -> r.path("/api/users/**")
            .filters(f -> f.circuitBreaker(config -> config
                .setName("userCircuitBreaker")
                .setFallbackUri("forward:/fallback/users")))
            .uri("lb://user-service"))
        .build();
}`;

const configCode = `# Config Server
@SpringBootApplication
@EnableConfigServer
public class ConfigServer { }

// Config Client — application.yml
spring:
  config:
    import: configserver:http://localhost:8888`;

export default {
  name: 'SpringSectionCloud',
  components: { CodeBlock },
  data() {
    return { eurekaCode, gatewayCode, configCode };
  },
};
</script>

<style scoped>
.ss-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--forge-fire);
}

.ss-section h3:first-child {
  margin-top: 0;
}

.section-text {
  color: var(--forge-text2);
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 1rem 0;
}

.section-text code {
  background: var(--forge-surface);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.85em;
}

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
  border-color: var(--forge-fire);
  transform: translateY(-2px);
}

.info-card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--forge-text);
}

.info-card p {
  font-size: 0.8rem;
  color: var(--forge-text3);
  margin: 0;
  line-height: 1.5;
}

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

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
