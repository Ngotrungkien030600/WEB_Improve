<template>
  <div class="bs-section">
    <h3>ACID — tại sao transaction đáng tin cậy?</h3>
    <p class="section-text">ACID là 4 đặc tính đảm bảo dữ liệu <strong>không bao giờ sai dù app crash, server tắt đột ngột, hay nhiều người ghi cùng lúc</strong>. Đây là lý do SQL vẫn là lựa chọn số 1 cho dữ liệu tiền bạc, đơn hàng, giao dịch.</p>
    <div class="cards-grid">
      <div class="info-card">
        <h4>Atomicity</h4>
        <p>Toàn bộ hoặc không gì cả. Transaction commit → all changes. Rollback → không thay đổi nào. VD: chuyển tiền phải trừ A + cộng B cùng xảy ra, không thể chỉ trừ.</p>
      </div>
      <div class="info-card">
        <h4>Consistency</h4>
        <p>Dữ liệu từ trạng thái hợp lệ này sang hợp lệ khác. Ràng buộc (FK, unique, check) luôn được đảm bảo. DB không bao giờ ở trạng thái "nửa chừng".</p>
      </div>
      <div class="info-card">
        <h4>Isolation</h4>
        <p>Transaction không ảnh hưởng lẫn nhau. Các mức: READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE. Mức cao hơn → an toàn hơn nhưng chậm hơn.</p>
      </div>
      <div class="info-card">
        <h4>Durability</h4>
        <p>Dữ liệu đã commit được lưu vĩnh viễn. Dùng WAL (Write-Ahead Log) để phục hồi khi crash. Không mất dữ liệu khi mất điện.</p>
      </div>
    </div>

    <h3>Index — tại sao query nhanh?</h3>
    <p class="section-text">Không có index, DB phải <strong>quét toàn bộ bảng</strong> (full scan) để tìm dữ liệu — hàng triệu dòng = chậm. Index (thường là B-Tree) giống mục lục sách: tìm theo <code>=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>BETWEEN</code> trong log(n) thay vì n. <strong>Chi phí:</strong> mỗi index làm INSERT/UPDATE chậm hơn một chút — nên index đúng cột hay được query.</p>
    <CodeBlock :code="indexCode" language="sql" />

    <h3>Transaction & Locking — tránh race condition</h3>
    <p class="section-text">Khi 2 request cùng sửa 1 record, cần <strong>lock</strong>: <em>Pessimistic</em> khóa record ngay (chắc chắn, chậm hơn), <em>Optimistic</em> dùng cột <code>@Version</code> — ai commit trước thắng, ai sau bị lỗi và phải thử lại. <strong>Deadlock</strong> xảy ra khi 2 transaction giữ lock chờ nhau — fix bằng cách luôn lock theo cùng thứ tự.</p>
    <CodeBlock :code="transactionCode" language="java" />

    <h3>Query Optimization — chiến thuật thực tế</h3>
    <ul class="tips-list">
      <li><strong>EXPLAIN ANALYZE:</strong> xem seq scan vs index scan — bắt query chạy chậm</li>
      <li><strong>N+1:</strong> dùng JOIN FETCH, @EntityGraph</li>
      <li><strong>Chỉ SELECT cần thiết:</strong> không SELECT *</li>
      <li><strong>Pagination:</strong> keyset pagination thay vì OFFSET (OFFSET chậm khi page lớn)</li>
      <li><strong>Connection pool:</strong> HikariCP size ~ 2*CPU + 1</li>
    </ul>

    <h3>Đọc query plan: index có được dùng thật không?</h3>
    <p class="section-text">Đừng thêm index chỉ vì một query trông có vẻ chậm. Với PostgreSQL, <code>EXPLAIN (ANALYZE, BUFFERS)</code> chạy query thật và cho biết actual time, số rows, loops, buffers cùng cách planner truy cập. So estimated rows với actual rows; lệch lớn có thể làm planner chọn plan kém.</p>
    <CodeBlock :code="explainCode" language="sql" />
    <div class="info-card"><h4>Cách đọc nhanh</h4><p><strong>Seq Scan</strong> chưa chắc sai nếu bảng nhỏ hoặc trả về nhiều dòng. <strong>Index Scan</strong> cũng chưa chắc nhanh nếu phải fetch quá nhiều row. Tối ưu theo query thực tế, độ chọn lọc, thứ tự cột và write cost; kiểm tra lại bằng plan sau khi sửa.</p></div>

    <h3>Schema migration, backup và phục hồi</h3>
    <p class="section-text">Schema production cần thay đổi có version và review cùng code. Flyway chạy migration theo thứ tự; migration đã áp dụng nên được xem là immutable. Với thay đổi lớn, dùng cách expand → deploy code tương thích cũ/mới → backfill → switch → contract để tránh downtime.</p>
    <CodeBlock :code="migrationCode" language="sql / yaml" />
    <ul class="tips-list">
      <li><strong>Backward compatible:</strong> thêm cột nullable/default trước; deploy ứng dụng đọc/ghi tương thích rồi mới xóa field cũ ở release sau.</li>
      <li><strong>Backup:</strong> xác định RPO/RTO, retention, mã hóa và quyền truy cập; snapshot/backup cần được restore thử định kỳ.</li>
      <li><strong>Khôi phục:</strong> tài liệu hóa ai quyết định, restore vào đâu, kiểm tra consistency thế nào và chuyển traffic ra sao.</li>
      <li><strong>Data migration lớn:</strong> chạy batch có checkpoint, giới hạn tải DB, đo tiến độ và có cách dừng/tiếp tục.</li>
    </ul>
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

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

const explainCode = `-- Tìm đơn mới nhất của một user
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

-- Kiểm tra lại plan và write overhead sau khi tạo index.`;

const migrationCode = `-- src/main/resources/db/migration/V014__index_orders_for_history.sql
CREATE INDEX idx_orders_customer_status_created
    ON orders(customer_id, status, created_at DESC);

-- application.yml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration

-- Migration áp dụng rồi không sửa lại; tạo V015 cho thay đổi tiếp theo.
-- Production: chạy migration có kiểm soát, theo dõi lock/time và có rollback plan.`;

export default {
  name: 'BackendSectionSql',
  components: { CodeBlock },
  data() {
    return { indexCode, transactionCode, explainCode, migrationCode };
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

.level-junior { border-left: 3px solid #22c55e; }
.level-middle { border-left: 3px solid #3b82f6; }
.level-senior { border-left: 3px solid #f59e0b; }
.level-architect { border-left: 3px solid #ef4444; }

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
