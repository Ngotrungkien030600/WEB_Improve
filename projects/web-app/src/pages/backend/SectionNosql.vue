<template>
  <div class="bs-section">
    <h3>NoSQL — khi nào dùng thay SQL?</h3>
    <p class="section-text"><strong>NoSQL</strong> hy sinh transaction/join mạnh để đổi lấy <strong>scale ngang, độ trễ thấp, schema linh hoạt</strong>. Chọn theo bài toán: cache → Redis, document linh hoạt → MongoDB, ghi log khổng lồ → Cassandra, tìm kiếm → Elasticsearch. Không phải "NoSQL thay thế SQL" — mà mỗi loại giải quyết 1 lớp bài toán riêng.</p>
    <div class="cards-grid cols-4">
      <div class="info-card">
        <h4>Redis</h4>
        <p>In-memory key-value. Cache, session, rate limiter, distributed lock, pub/sub. Nhanh nhất (~100k ops/s) nhưng dữ liệu trong RAM.</p>
      </div>
      <div class="info-card">
        <h4>MongoDB</h4>
        <p>Document DB (JSON-like). Flexible schema, nested data. Hợp: catalog, content, user profile thay đổi thường xuyên.</p>
      </div>
      <div class="info-card">
        <h4>Cassandra</h4>
        <p>Wide-column, write-optimized. Time-series, IoT, event logging — ghi cực nhanh với khối lượng khổng lồ.</p>
      </div>
      <div class="info-card">
        <h4>Elasticsearch</h4>
        <p>Full-text search + analytics. Logging, search engine. Index tìm kiếm, không phải nguồn dữ liệu chính.</p>
      </div>
    </div>

    <h3>Redis Patterns — 3 pattern phổ biến nhất</h3>
    <p class="section-text"><strong>Cache Aside</strong> là pattern cơ bản nhất: đọc cache trước, miss thì đọc DB rồi ghi cache. <strong>Distributed Lock</strong> chống 2 instance xử lý cùng 1 task. <strong>Rate Limiter</strong> giới hạn request/giây chống abuse. Cả 3 đều là nền tảng của mọi hệ thống backend hiện đại.</p>
    <CodeBlock :code="redisCode" language="java" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

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

export default {
  name: 'BackendSectionNosql',
  components: { CodeBlock },
  data() {
    return { redisCode };
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
