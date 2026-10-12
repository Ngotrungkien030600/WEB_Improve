<template>
  <div class="ss-section">
    <h3>Entity & Relationships — ánh xạ bảng DB thành object</h3>
    <p class="section-text"><code>@Entity</code> đánh dấu class ánh xạ tới 1 bảng, mỗi field là 1 cột. Quan hệ quan trọng nhất: <code>@OneToMany</code> (1 user → nhiều order) và <code>@ManyToMany</code> (user ↔ role) qua bảng trung gian <code>user_roles</code>. Chọn đúng quan hệ + cascade quyết định cách Hibernate sinh SQL và quản lý dữ liệu liên quan.</p>
    <CodeBlock :code="entityCode" language="java" />

    <h3>Repository — Spring Data JPA sinh sẵn query</h3>
    <p class="section-text"><code>JpaRepository</code> cung cấp sẵn CRUD + paging (findAll, save, findById...). Chỉ cần <strong>khai báo method theo quy ước tên</strong> (<code>findByEmail</code>) Spring tự implement. <code>@Query</code> dùng khi cần JPQL tùy biến — kèm <code>@Modifying</code> cho lệnh UPDATE/DELETE.</p>
    <CodeBlock :code="repositoryCode" language="java" />

    <h3>Query derivation — Spring đọc tên method để tạo query</h3>
    <p class="section-text">Spring Data phân tích method lúc tạo repository: phần trước <code>By</code> xác định loại thao tác, phần sau mô tả property và điều kiện. Tên property phải khớp với field của Entity; sai tên thường làm ứng dụng báo lỗi khi khởi động, không phải Spring tự đoán ý mình. Ví dụ <code>findByPriceGreaterThanEqual</code> tương ứng điều kiện <code>price &gt;= ?</code>.</p>
    <CodeBlock :code="derivedQueryCode" language="java" />
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>Đọc method như một câu</h4><p><code>findByCategoryNameAndPriceGreaterThanEqual</code> = tìm Product theo tên category và giá lớn hơn hoặc bằng giá truyền vào.</p></div>
      <div class="info-card"><h4>Khi nào ngừng dùng derived query?</h4><p>Nếu tên method quá dài, có nhiều nhánh OR, join/aggregation phức tạp hoặc khó kiểm soát projection, hãy chuyển sang <code>@Query</code>, Specification hoặc Querydsl.</p></div>
    </div>

    <h3><code>@Query</code> — tự viết JPQL khi cần kiểm soát câu truy vấn</h3>
    <p class="section-text">Derived query phù hợp điều kiện đơn giản, còn <code>@Query</code> đặt truy vấn cạnh method repository. JPQL viết theo Entity và property Java, không phải tên bảng/cột SQL. Dùng <code>@Param</code> để tên tham số rõ ràng; native SQL chỉ dùng khi thật sự cần tính năng riêng của database.</p>
    <CodeBlock :code="queryAnnotationCode" language="java" />

    <h3>Dynamic filters — Specification và Querydsl là DSL khác nhau</h3>
    <p class="section-text"><strong>Specification</strong> ghép các điều kiện Criteria khi bộ lọc đến từ form và có thể thiếu từng trường. <strong>Querydsl</strong> dùng kiểu Q như <code>QProduct.product</code> để viết điều kiện fluent, có kiểm tra kiểu lúc compile. <code>gt</code>/<code>goe</code> nghĩa là &gt;/≥; <code>lt</code>/<code>loe</code> nghĩa là &lt;/≤. Q-class của Querydsl cần được annotation processor tạo trong build.</p>
    <CodeBlock :code="dynamicQueryCode" language="java" />

    <h3>MapStruct — vì sao mapping không nhồi vào Service?</h3>
    <p class="section-text">Service vẫn gọi mapper; điều được tách ra là các quy tắc đổi hình dạng dữ liệu. Service điều phối nghiệp vụ (kiểm tra trùng email, lưu Entity, gọi mapper), còn Mapper mô tả Entity ↔ DTO. MapStruct chạy annotation processor khi compile và sinh class Java thường như <code>ProductMapperImpl</code>; lúc chạy ứng dụng không cần reflection để dò field. Vì code được sinh ra lúc build, lỗi kiểu dữ liệu hoặc mapping thiếu có thể bị phát hiện sớm hơn.</p>
    <CodeBlock :code="mapStructBuildCode" language="xml" />
    <CodeBlock :code="mapStructCode" language="java" />
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>Service làm gì?</h4><p>Áp dụng quy tắc nghiệp vụ, gọi repository và gọi mapper tại ranh giới Entity/DTO. Service vẫn kiểm soát luồng xử lý.</p></div>
      <div class="info-card"><h4>MapStruct làm gì?</h4><p>Sinh phần gán field lặp đi lặp lại, hỗ trợ đổi tên field và nested mapping. Quy tắc đặc biệt vẫn viết rõ bằng <code>@Mapping</code> hoặc method tùy chỉnh.</p></div>
    </div>
    <CodeBlock :code="mapStructServiceCode" language="java" />

    <h3>Đọc lỗi và kiểm chứng hành vi</h3>
    <p class="section-text">Đừng chỉ nhớ keyword. Hãy đoán query trước, chạy repository test với dữ liệu biên (giá bằng min, nhỏ hơn min, null, không có kết quả), bật SQL log và xem SQL/parameters thực tế. Với MapStruct, xem generated source trong thư mục build để hiểu interface được biến thành Java code nào.</p>

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

const derivedQueryCode = `public interface ProductRepository extends JpaRepository<Product, Long> {
    // price >= minPrice AND category.name = categoryName
    List<Product> findByCategoryNameAndPriceGreaterThanEqual(
        String categoryName,
        BigDecimal minPrice
    );

    // price BETWEEN min AND max, ORDER BY price ASC
    List<Product> findByPriceBetweenOrderByPriceAsc(
        BigDecimal min,
        BigDecimal max
    );

    // name LIKE %keyword%, không phân biệt hoa thường
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findTop5ByOrderByPriceDesc();
}`;

const queryAnnotationCode = `public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("select p from Product p " +
           "where p.price >= :minPrice and p.stock > 0 " +
           "and lower(p.name) like lower(concat('%', :keyword, '%')) " +
           "order by p.price asc")
    List<Product> searchAvailable(
        @Param("minPrice") BigDecimal minPrice,
        @Param("keyword") String keyword
    );

    // Native SQL chỉ khi cần cú pháp/tính năng đặc thù DB
    @Query(value = "select * from products where price >= :min",
           nativeQuery = true)
    List<Product> findNativeByMinPrice(@Param("min") BigDecimal min);
}`;

const dynamicQueryCode = `// Specification: điều kiện có thể ghép theo form tìm kiếm
public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> { }

Specification<Product> spec = Specification.where(null);
if (minPrice != null) {
    spec = spec.and((root, query, cb) ->
        cb.greaterThanOrEqualTo(root.<BigDecimal>get("price"), minPrice));
}
if (keyword != null && !keyword.isBlank()) {
    spec = spec.and((root, query, cb) ->
        cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
}
List<Product> result = repository.findAll(spec);

// Querydsl: QProduct cần được generate khi build
QProduct p = QProduct.product;
BooleanExpression priceFilter = p.price.goe(minPrice)   // >=
    .and(p.price.lt(maxPrice));                         // <
BooleanExpression stockFilter = p.stock.gt(0)          // >
    .and(p.stock.loe(maxStock));                        // <=`;

const mapStructCode = `// Maven: mapstruct là API/annotations; mapstruct-processor sinh source
// Cấu hình mapstruct-processor trong maven-compiler-plugin annotationProcessorPaths.
@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ProductMapper {
    @Mapping(target = "id", ignore = true)
    Product toEntity(ProductCreateRequest request);

    ProductResponse toResponse(Product product);
}

// Source minh họa được sinh trong target/generated-sources/annotations:
@Component
public class ProductMapperImpl implements ProductMapper {
    @Override
    public ProductResponse toResponse(Product product) {
        if (product == null) return null;
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        return response;
    }
}`;

const mapStructBuildCode = `<properties>
    <mapstruct.version>1.6.3</mapstruct.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>\${mapstruct.version}</version>
    </dependency>
</dependencies>

<build><plugins><plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration><annotationProcessorPaths><path>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>\${mapstruct.version}</version>
    </path></annotationProcessorPaths></configuration>
</plugin></plugins></build>`;

const mapStructServiceCode = `@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repository;
    private final ProductMapper mapper;

    @Transactional
    public ProductResponse create(ProductCreateRequest request) {
        if (repository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateProductException(request.getName());
        }

        Product entity = mapper.toEntity(request); // mapping ở Mapper
        Product saved = repository.save(entity);    // nghiệp vụ/lưu ở Service
        return mapper.toResponse(saved);
    }
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
    return { entityCode, repositoryCode, derivedQueryCode, queryAnnotationCode, dynamicQueryCode, mapStructBuildCode, mapStructCode, mapStructServiceCode, n1Code };
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
