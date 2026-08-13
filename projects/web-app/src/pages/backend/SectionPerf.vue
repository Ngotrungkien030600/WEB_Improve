<template>
  <div class="bs-section">
    <h3>Caching Layers — dữ liệu nóng phục vụ nhanh hơn</h3>
    <div class="diagram">
      Client → CDN → Reverse Proxy → App Cache → Distributed Cache → Database
    </div>
    <p class="section-text">Mỗi lớp cache chặn request trước khi chạm tới tầng chậm hơn. <strong>Nguyên tắc:</strong> cache càng gần client càng nhanh, DB là nơi cuối cùng phải chịu tải. Cache hợp lý có thể giảm 80-90% tải DB — nhưng nhớ xử lý <strong>cache invalidation</strong> (dữ liệu cũ) và <strong>cache stampede</strong> (nhiều request cùng lúc miss).</p>

    <h3>Application Optimization — 4 kỹ thuật cốt lõi</h3>
    <p class="section-text"><strong>@Async</strong> đẩy việc chậm ra nền, <strong>@Cacheable</strong> cache kết quả method, <strong>batch insert</strong> thay vì ghi từng dòng, <strong>pagination</strong> thay vì load toàn bộ. Bốn kỹ thuật này giải quyết đa số bài toán hiệu năng app Java.</p>
    <CodeBlock :code="perfCode" language="java" />

    <h3>JVM Tuning — ép container dùng đúng RAM</h3>
    <p class="section-text">Khi chạy JVM trong container, JVM mặc định nhìn RAM của host — có thể dùng quá limit container và bị kill. <code>MaxRAMPercentage</code> giới hạn JVM dùng 75% RAM container. <code>G1GC</code> cho latency thấp, <code>HeapDumpOnOutOfMemoryError</code> để capture heap khi crash.</p>
    <CodeBlock :code="jvmCode" language="bash" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

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

export default {
  name: 'BackendSectionPerf',
  components: { CodeBlock },
  data() {
    return { perfCode, jvmCode };
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
