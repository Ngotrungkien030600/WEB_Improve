<template>
  <div class="bs-section">
    <h3>Architecture Patterns — chọn kiến trúc theo bài toán</h3>
    <div class="cards-grid cols-4">
      <div class="info-card"><h4>Monolithic</h4><p>1 ứng dụng, 1 DB. Đơn giản, dễ develop. Giới hạn: scaling — phải scale cả app khi chỉ 1 module nóng.</p></div>
      <div class="info-card"><h4>Microservices</h4><p>Nhiều service nhỏ, độc lập. Cần: API Gateway, service discovery. Phức tạp hơn nhưng scale và deploy độc lập.</p></div>
      <div class="info-card"><h4>CQRS + Event Sourcing</h4><p>Tách read/write model. Lưu events thay vì state. Read model tối ưu riêng cho query.</p></div>
      <div class="info-card"><h4>Event-Driven</h4><p>Service giao tiếp qua events (Kafka). Saga pattern. Tách rời, chịu lỗi tốt nhưng khó debug hơn.</p></div>
    </div>

    <h3>Thiết kế một hệ thống enterprise bằng Spring Boot</h3>
    <p class="section-text">Bài toán xuyên suốt: khách hàng doanh nghiệp cần tạo đơn hàng, thanh toán và theo dõi trạng thái. Bắt đầu bằng một modular monolith Spring Boot với các module <code>order</code>, <code>payment</code>, <code>inventory</code>; chỉ tách service khi có nhu cầu deploy, scale hoặc sở hữu dữ liệu độc lập. Mỗi service sở hữu database của mình, giao tiếp qua API có version hoặc event; tránh để service này đọc trực tiếp database của service khác.</p>
    <div class="cards-grid cols-4">
      <div class="info-card"><h4>REST</h4><p>Dùng cho command và resource có contract ổn định: <code>POST /orders</code>, <code>GET /orders/{id}</code>. Dễ cache, quan sát và tích hợp với đối tác.</p></div>
      <div class="info-card"><h4>GraphQL</h4><p>Hợp khi nhiều client cần chọn các trường hoặc quan hệ khác nhau. Đặt giới hạn độ sâu/chi phí query, kiểm soát N+1 và quyền ở từng field.</p></div>
      <div class="info-card"><h4>Async events</h4><p>Dùng event như <code>OrderCreated</code> khi consumer không cần phản hồi tức thời. Thiết kế idempotency, retry có giới hạn, dead-letter và eventual consistency.</p></div>
      <div class="info-card"><h4>Spring Boot production</h4><p>Giữ service stateless; cấu hình connection pool, timeout, health/readiness, metrics và structured logs. Scale theo số liệu thực tế, không chỉ tăng replica.</p></div>
    </div>

    <h3>Luồng thực tế và các điểm phải quyết định</h3>
    <ol class="steps-list">
      <li><strong>POST /orders:</strong> Spring controller kiểm tra DTO, service xác thực quyền và quy tắc tồn kho, ghi order cùng outbox trong transaction.</li>
      <li><strong>Thanh toán:</strong> worker phát event; payment service gọi nhà cung cấp với timeout và idempotency key. Không giữ transaction database mở trong lúc gọi mạng.</li>
      <li><strong>Nhất quán phân tán:</strong> nếu thanh toán thất bại, Saga điều phối trạng thái hoặc hành động bù; API trả trạng thái có thể theo dõi thay vì giả vờ mọi bước hoàn tất đồng bộ.</li>
      <li><strong>Vận hành:</strong> CI/CD chạy test và scan, tạo image bất biến, triển khai staging trước production trên Kubernetes/AWS; Terraform quản lý hạ tầng và rollback dùng image/version trước.</li>
      <li><strong>Quyết định tách service:</strong> đo bottleneck, tần suất release và ranh giới sở hữu dữ liệu trước. Microservices tăng độ phức tạp về network, tracing, bảo mật và xử lý lỗi.</li>
    </ol>
    <p class="section-text"><strong>Cách phối hợp với khách hàng quốc tế:</strong> xác nhận acceptance criteria và API contract bằng văn bản; làm rõ múi giờ, deadline, dữ liệu nhạy cảm và hành vi lỗi; thống nhất với frontend, QA, product và DevOps trước khi chia task. Khi có trade-off, trình bày lựa chọn, rủi ro và đề xuất bằng ngôn ngữ dễ hiểu.</p>

    <h3>Outbox Pattern — đảm bảo "ghi DB + gửi event" cùng xảy ra</h3>
    <p class="section-text">Vấn đề: ghi Order vào DB xong gửi event lên Kafka — nếu gửi event fail, dữ liệu ghi rồi nhưng hệ thống khác không biết (mất event). <strong>Outbox Pattern:</strong> ghi event vào bảng <code>outbox</code> <strong>trong cùng transaction</strong> với Order. Sau đó CDC Worker (Debezium) đọc bảng outbox và publish lên Kafka — đảm bảo không mất event, không trùng.</p>
    <CodeBlock :code="outboxCode" language="java" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const outboxCode = `@Transactional
public Order createOrder(CreateOrderRequest req) {
    Order order = orderRepo.save(toEntity(req));
    outboxRepo.save(new OutboxEvent("order", order.getId(), "OrderCreated", serialize(req)));
    return order;
}
// CDC Worker — Debezium capture changes từ outbox → publish lên Kafka`;

export default {
  name: 'BackendSectionArch',
  components: { CodeBlock },
  data() {
    return { outboxCode };
  },
};
</script>

<style scoped>
.bs-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--forge-fire);
}

.bs-section h3:first-child {
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

.steps-list {
  margin: 1rem 0;
  padding-left: 1.4rem;
  color: var(--forge-text2);
}

.steps-list li {
  padding: 0.45rem 0;
  line-height: 1.65;
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

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
