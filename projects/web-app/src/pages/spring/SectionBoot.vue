<template>
  <div class="ss-section">
    <h3>Auto-configuration — vì sao chạy được ngay không cần cấu hình?</h3>
    <p class="section-text">Thêm dependency (VD: spring-boot-starter-data-jpa) vào classpath, Spring Boot <strong>tự phát hiện và cấu hình</strong> DataSource, EntityManager... Mỗi auto-config class chỉ hoạt động khi điều kiện đúng (<code>@ConditionalOnClass</code>, <code>@ConditionalOnMissingBean</code>) — đó là lý do app khởi động được ngay mà không cần config thủ công.</p>

    <h3>Actuator — "nhịp tim" của ứng dụng</h3>
    <p class="section-text"><strong>Actuator</strong> expose các endpoint giám sát app đang chạy: sức khỏe, metrics, môi trường. Đây là nền tảng để <strong>Prometheus/Grafana scrape dữ liệu</strong> và Kubernetes health check — không có nó, team vận hành không biết app còn sống hay sắp chết.</p>
    <div class="cards-grid cols-4">
      <div class="info-card"><h4>/actuator/health</h4><p>Health check DB, disk, custom components — Kubernetes dùng để biết pod còn nhận traffic không.</p></div>
      <div class="info-card"><h4>/actuator/metrics</h4><p>JVM (heap, thread, GC), HTTP request count/latency — nguồn cho Prometheus + Grafana dashboard.</p></div>
      <div class="info-card"><h4>/actuator/info</h4><p>Custom info (version, build time, git commit) — biết chính xác build nào đang chạy.</p></div>
      <div class="info-card"><h4>/actuator/env</h4><p>Environment properties (cần bảo vệ — có thể lộ secret).</p></div>
    </div>
    <CodeBlock :code="actuatorCode" language="yaml" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const actuatorCode = `# application.yml
management:
  endpoints.web.exposure.include: health,info,metrics
  endpoint.health.show-details: when-authorized`;

export default {
  name: 'SpringSectionBoot',
  components: { CodeBlock },
  data() {
    return { actuatorCode };
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

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
