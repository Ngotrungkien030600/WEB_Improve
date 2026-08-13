<template>
  <div class="bs-section">
    <h3>Message Queue — tại sao cần?</h3>
    <p class="section-text">MQ giúp tách rời các service: producer gửi tin <strong>không cần biết ai nhận</strong>, consumer xử lý khi sẵn sàng. Lợi ích: <strong>giảm tải đột biến</strong> (queue hấp thụ), <strong>retry</strong> khi consumer lỗi, <strong>đảm bảo không mất tin</strong>. Nếu không có MQ, khi đặt hàng bạn phải gọi thẳng email + SMS + notification — một service chậm sẽ làm chậm cả luồng.</p>
    <div class="cards-grid cols-2">
      <div class="info-card">
        <h4>🐇 RabbitMQ</h4>
        <p>Message broker cổ điển. Exchange types: Direct, Topic, Fanout. Dùng cho: task queue, RPC, pub/sub. Hợp khi cần routing linh hoạt.</p>
      </div>
      <div class="info-card">
        <h4>📊 Kafka</h4>
        <p>Distributed event streaming. Topic, Partition, Consumer Group, Offset. Dùng cho: event sourcing, stream processing. Hợp khi cần throughput khổng lồ + replay.</p>
      </div>
    </div>

    <h3>Spring Kafka — producer & consumer</h3>
    <p class="section-text">Producer dùng <code>KafkaTemplate</code> gửi tin vào topic, consumer dùng <code>@KafkaListener</code> xử lý bất đồng bộ. <strong>Consumer Group</strong> đảm bảo mỗi tin chỉ được xử lý 1 lần trong group — mở rộng bằng cách thêm instance vào group.</p>
    <CodeBlock :code="kafkaCode" language="java" />

    <h3>Kafka Streams — xử lý dữ liệu ngay trong Kafka</h3>
    <p class="section-text">Thay vì kéo dữ liệu ra ngoài xử lý, <strong>Kafka Streams</strong> xử lý ngay trong luồng: lọc, group, đếm theo cửa sổ thời gian. VD: đếm số đơn hàng mỗi phút theo sản phẩm — phục vụ real-time analytics mà không cần hệ thống riêng.</p>
    <CodeBlock :code="kafkaStreamsCode" language="java" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

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

export default {
  name: 'BackendSectionMq',
  components: { CodeBlock },
  data() {
    return { kafkaCode, kafkaStreamsCode };
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
