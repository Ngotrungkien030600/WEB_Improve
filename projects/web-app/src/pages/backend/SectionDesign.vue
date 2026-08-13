<template>
  <div class="bs-section">
    <h3>CAP Theorem — chọn gì khi hệ thống phân mảnh?</h3>
    <div class="diagram">
      CAP Theorem<br>
      Consistency vs Availability<br>
      Partition Tolerance is mandatory
    </div>
    <p class="section-text">Khi network partition (P) xảy ra — 2 máy không liên lạc được — bạn <strong>bắt buộc chọn</strong>: hoặc dữ liệu nhất quán (C, chặn ghi để tránh sai lệch) hoặc luôn phục vụ (A, chấp nhận dữ liệu có thể lệch tạm thời). Không hệ thống nào có cả 3. <strong>Áp dụng thực tế:</strong> ngân hàng chọn C, social feed chọn A.</p>

    <h3>Bài toán thiết kế kinh điển</h3>
    <div class="cards-grid cols-4">
      <div class="info-card"><h4>URL Shortener</h4><p>Base62 encoding. Redis cache. DB sharding. 301 redirect. Hỏi: collision xử lý sao? scale đọc/ghi?</p></div>
      <div class="info-card"><h4>Rate Limiter</h4><p>Token Bucket + Redis. Headers: X-RateLimit-Remaining. Hỏi: distributed + consistent?</p></div>
      <div class="info-card"><h4>Chat System</h4><p>WebSocket Gateway. Kafka message queue. Redis pub/sub. Hỏi: message order, offline message?</p></div>
      <div class="info-card"><h4>Notification System</h4><p>Kafka → Push Worker, Email Worker, SMS Worker. Hỏi: retry khi worker chết?</p></div>
    </div>

    <h3>Ước lượng nhanh — cheat sheet</h3>
    <p class="section-text">Khi thiết kế hệ thống, nhà phỏng vấn muốn bạn ước lượng được tải: QPS, dung lượng, băng thông. Ghi nhớ các con số chuẩn này để trả lời nhanh.</p>
    <CodeBlock :code="estimationCode" language="bash" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const estimationCode = `1 request/second = 86,400 requests/day ≈ 2.5M/month
1M requests/day ≈ 12 requests/second
PostgreSQL: ~5k writes/s, ~50k reads/s (single node)
Redis: ~100k ops/s (single node)
Network latency: data center 0.5ms, same region 5ms`;

export default {
  name: 'BackendSectionDesign',
  components: { CodeBlock },
  data() {
    return { estimationCode };
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

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
