<template>
  <div class="ss-section">
    <h3>Entity & Relationships — ánh xạ bảng DB thành object</h3>
    <p class="section-text"><code>@Entity</code> đánh dấu class ánh xạ tới 1 bảng, mỗi field là 1 cột. Quan hệ quan trọng nhất: <code>@OneToMany</code> (1 user → nhiều order) và <code>@ManyToMany</code> (user ↔ role) qua bảng trung gian <code>user_roles</code>. Chọn đúng quan hệ + cascade quyết định cách Hibernate sinh SQL và quản lý dữ liệu liên quan.</p>
    <CodeBlock :code="entityCode" language="java" />

    <h3>Repository — Spring Data JPA sinh sẵn query</h3>
    <p class="section-text"><code>JpaRepository</code> cung cấp sẵn CRUD + paging (findAll, save, findById...). Chỉ cần <strong>khai báo method theo quy ước tên</strong> (<code>findByEmail</code>) Spring tự implement. <code>@Query</code> dùng khi cần JPQL tùy biến — kèm <code>@Modifying</code> cho lệnh UPDATE/DELETE.</p>
    <CodeBlock :code="repositoryCode" language="java" />

    <h3>N+1 Problem — cái bẫy hiệu năng kinh điển</h3>
    <p class="section-text"><strong>N+1</strong>: lấy danh sách N record, rồi mỗi record lại query thêm quan hệ → tổng <strong>N+1 queries</strong> thay vì 1. Gây chậm rõ rệt khi dữ liệu lớn (1000 users → 1001 queries). Đây là lỗi hiệu năng phổ biến nhất khi dùng JPA, thường bị phát hiện muộn ở production.</p>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>Fix 1: JOIN FETCH</h4><p>Gộp 1 query lấy luôn dữ liệu quan hệ. Hiệu quả cho truy vấn cố định.</p></div>
      <div class="info-card"><h4>Fix 2: @EntityGraph</h4><p>Khai báo eager load các quan hệ theo tên — tái sử dụng được với nhiều query.</p></div>
      <div class="info-card"><h4>Fix 3: @BatchSize</h4><p>Gom N quan hệ vào 1 query IN (...). Giảm số query mà không phải sửa từng truy vấn.</p></div>
      <div class="info-card"><h4>Kiểm tra thực tế</h4><p>Bật <code>spring.jpa.show-sql</code> hoặc Hibernate Stats khi test — đếm số query phát sinh, bắt N+1 trước khi lên production.</p></div>
    </div>
    <CodeBlock :code="n1Code" language="java" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const entityCode = `@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
}`;

const repositoryCode = `public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
    Optional<User> findByIdWithOrders(@Param("id") Long id);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date, @Param("status") String status);
}`;

const n1Code = `// Fix 1: JOIN FETCH
@Query("SELECT u FROM User u JOIN FETCH u.orders")
List<User> findAllWithOrders();

// Fix 2: @EntityGraph
@EntityGraph(attributePaths = {"orders"})
@Query("SELECT u FROM User u")
List<User> findAllWithOrders();

// Fix 3: @BatchSize
@Entity
public class User {
    @OneToMany(mappedBy = "user")
    @BatchSize(size = 10)
    private List<Order> orders;
}`;

export default {
  name: 'SpringSectionJpa',
  components: { CodeBlock },
  data() {
    return { entityCode, repositoryCode, n1Code };
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
