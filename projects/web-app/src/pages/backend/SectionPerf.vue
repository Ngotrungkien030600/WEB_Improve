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

    <h3>Redis cache-aside trong Spring Boot</h3>
    <p class="section-text">Cache-aside: service thử đọc cache; miss thì đọc DB rồi lưu kết quả với TTL. Khi cập nhật dữ liệu, invalidate key liên quan sau khi DB transaction commit. Cache là bản sao có thể xây lại, không phải nơi duy nhất lưu dữ liệu quan trọng.</p>
    <CodeBlock :code="redisConfigCode" language="java / yaml" />
    <CodeBlock :code="cacheAsideCode" language="java" />
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>Chọn TTL và key</h4><p>TTL theo mức chấp nhận stale data; thêm jitter để tránh nhiều key hết hạn cùng lúc. Key phải gồm tenant/user nếu dữ liệu cá nhân hóa, ví dụ <code>product:tenant-7:42</code>.</p></div>
      <div class="info-card"><h4>Chống stampede</h4><p>Khi key nóng hết hạn, nhiều request có thể cùng query DB. Dùng TTL jitter, single-flight/lock có giới hạn hoặc refresh nền; luôn đặt timeout và fallback hợp lý.</p></div>
      <div class="info-card"><h4>Invalidate đúng lúc</h4><p>Evict sau commit để tránh request khác đọc lại giá trị cũ trong khi transaction chưa lưu. Khi có nhiều app instance, invalidation phải tới cùng cache dùng chung.</p></div>
      <div class="info-card"><h4>Đo hiệu quả</h4><p>Theo dõi hit/miss ratio, Redis latency, evictions, memory, DB QPS và stale-data incidents. Nếu hit thấp hoặc dữ liệu đổi liên tục thì cache có thể làm hệ thống phức tạp hơn.</p></div>
    </div>

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

const redisConfigCode = `// Dependency: spring-boot-starter-data-redis
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
// never commit credentials in application.yml.`;

const cacheAsideCode = `@Service
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

// Chỉ publish ProductChanged trong transaction sau khi update thành công.`;

export default {
  name: 'BackendSectionPerf',
  components: { CodeBlock },
  data() {
    return { perfCode, jvmCode, redisConfigCode, cacheAsideCode };
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

.cards-grid.cols-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin: 1rem 0; }
.info-card { padding: 1rem; border: 1px solid var(--forge-glass-border); border-radius: var(--radius-md); background: var(--forge-surface); }
.info-card h4 { margin: 0 0 .5rem; color: var(--forge-text); font-size: .9rem; }
.info-card p { margin: 0; color: var(--forge-text2); font-size: .8rem; line-height: 1.55; }

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
