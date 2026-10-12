<template>
  <div class="ss-section">
    <h3>Mục tiêu: hiểu request đi qua hệ thống thế nào</h3>
    <p class="section-text">REST API là cách client và server trao đổi tài nguyên qua HTTP. MVC là cách tổ chức xử lý request trong Spring MVC; hai khái niệm liên quan nhưng không đồng nghĩa: REST mô tả hợp đồng giao tiếp, MVC mô tả cách framework nhận và điều phối request.</p>
    <div class="diagram">Client JSON → Filter/Security → DispatcherServlet → Controller → Service → Repository → Database<br>Database → Repository → Service → Controller/ResponseEntity → JSON response</div>

    <h3>MVC và trách nhiệm từng tầng</h3>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>Model</h4><p>Dữ liệu và quy tắc nghiệp vụ. Trong ứng dụng Spring, domain/entity và các lớp nghiệp vụ thường tạo nên phần Model; Entity không nên mặc định là JSON contract.</p></div>
      <div class="info-card"><h4>View</h4><p>Phần trình bày. Với MVC server-rendered, View có thể là template HTML. Với REST API, response JSON là biểu diễn dữ liệu cho client, không phải trang HTML.</p></div>
      <div class="info-card"><h4>Controller</h4><p>Biên HTTP: nhận path/query/body, gọi use case, chọn status/header và DTO trả về. Giữ controller mỏng; tránh nhét quy tắc nghiệp vụ và SQL vào đây.</p></div>
      <div class="info-card"><h4>Service</h4><p>Thực hiện use case và quy tắc nghiệp vụ, phối hợp nhiều repository/dịch vụ, đặt transaction. Không phải CRUD nào cũng bắt buộc có service riêng, nhưng đây là chỗ rõ ràng khi logic bắt đầu có ý nghĩa.</p></div>
      <div class="info-card"><h4>Repository</h4><p>Trừu tượng hóa truy vấn và lưu trữ. Spring Data có thể sinh triển khai từ interface hoặc method name. Repository không nên quyết định HTTP status hay thông điệp giao diện.</p></div>
      <div class="info-card"><h4>DTO / Entity</h4><p>DTO là hợp đồng request/response; Entity là mô hình lưu trữ. Tách chúng để validation, quyền truy cập và thay đổi schema không làm API vô tình đổi theo.</p></div>
    </div>

    <h3>Ví dụ xuyên suốt: tạo sản phẩm</h3>
    <p class="section-text">Client gửi <code>POST /api/products</code> với JSON. Spring chuyển JSON thành DTO, chạy validation, controller gọi service, service áp dụng quy tắc rồi gọi repository. Sau khi lưu, server trả <code>201 Created</code>, header <code>Location</code> trỏ đến resource mới và response DTO.</p>
    <CodeBlock :code="controllerCode" language="java" />
    <CodeBlock :code="serviceCode" language="java" />
    <CodeBlock :code="repositoryCode" language="java" />

    <h3>API chỉnh chu gồm những gì?</h3>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>URL nói về resource</h4><p>Dùng danh từ số nhiều như <code>/api/products</code>, <code>/api/products/{id}</code>. Dùng HTTP method để diễn đạt hành động; query string dành cho lọc, sắp xếp và phân trang.</p></div>
      <div class="info-card"><h4>Status và header có ý nghĩa</h4><p><code>200</code> đọc/cập nhật thành công; <code>201</code> tạo mới; <code>204</code> xóa không có body; <code>400</code> dữ liệu sai; <code>404</code> không tìm thấy; <code>409</code> xung đột; <code>500</code> lỗi không dự kiến.</p></div>
      <div class="info-card"><h4>PUT và PATCH</h4><p><code>PUT</code> thường thay toàn bộ biểu diễn và có tính idempotent. <code>PATCH</code> cập nhật một phần; tính idempotent phụ thuộc phép cập nhật. Chọn một quy ước rõ và ghi trong API docs.</p></div>
      <div class="info-card"><h4>Validation và lỗi nhất quán</h4><p>Validate ở biên request bằng DTO và <code>@Valid</code>. Dùng <code>@RestControllerAdvice</code> ánh xạ lỗi dự kiến thành mã/status ổn định; không trả stack trace hoặc chi tiết nội bộ.</p></div>
      <div class="info-card"><h4>Phân trang và vận hành</h4><p>Giới hạn kích thước trang, hỗ trợ filter/sort cho bảng lớn. Cân nhắc authz, rate limit, timeout, logging có correlation ID và metric theo nhu cầu sản phẩm.</p></div>
      <div class="info-card"><h4>Hợp đồng có thể kiểm tra</h4><p>Viết API docs/OpenAPI, ví dụ request-response và quy tắc tương thích ngược. Test status, validation, quyền truy cập và trường hợp không tìm thấy.</p></div>
    </div>
    <CodeBlock :code="requestExample" language="http + json" />

    <h3>Nếu bỏ Service thì sao? Các cách tổ chức khác</h3>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>Controller → Service → Repository</h4><p>Layered architecture dễ đọc, hợp CRUD nghiệp vụ thông thường. Mỗi tầng có trách nhiệm rõ. Tránh tạo service chỉ để chuyển tiếp một lệnh nếu nó không tạo ranh giới hoặc giá trị nào.</p></div>
      <div class="info-card"><h4>Controller → Repository trực tiếp</h4><p>Có thể hợp endpoint đọc rất đơn giản hoặc prototype nhỏ. Khi thêm kiểm tra quyền, transaction, nhiều bước nghiệp vụ hay tái sử dụng, controller dễ phình và logic khó kiểm thử; lúc đó tách use case/service.</p></div>
      <div class="info-card"><h4>Vertical slice / feature-first</h4><p>Gom controller, use case, DTO và truy vấn theo từng tính năng như <code>products</code> hay <code>orders</code>, thay vì gom tất cả controller vào một thư mục. Hữu ích khi codebase lớn và team sở hữu theo feature.</p></div>
      <div class="info-card"><h4>Ports and adapters / hexagonal</h4><p>Use case phụ thuộc interface (port); database, HTTP client hay message broker là adapter bên ngoài. Dễ thay adapter và test nghiệp vụ độc lập, đổi lại cần thêm cấu trúc và abstraction.</p></div>
      <div class="info-card"><h4>CQRS</h4><p>Tách đường đọc và ghi khi nhu cầu truy vấn, tải hoặc mô hình dữ liệu khác biệt đáng kể. Không phải mặc định cho CRUD; nó làm tăng số thành phần cần đồng bộ và vận hành.</p></div>
      <div class="info-card"><h4>REST, GraphQL, gRPC, messaging</h4><p>REST phổ biến cho resource qua HTTP; GraphQL cho client chọn dữ liệu; gRPC cho RPC typed hiệu năng cao giữa service; messaging cho xử lý bất đồng bộ. Đây là lựa chọn giao tiếp, độc lập với việc bên trong dùng layered hay hexagonal.</p></div>
    </div>

    <h3>Exception handling ở một nơi</h3>
    <p class="section-text"><code>@RestControllerAdvice</code> gom cách chuyển lỗi thành HTTP response để mọi endpoint có cùng hợp đồng. Bắt exception cụ thể trước; lỗi 500 chỉ trả thông báo an toàn cho client và ghi chi tiết vào log có kiểm soát.</p>
    <CodeBlock :code="exceptionCode" language="java" />

    <h3>Tự kiểm tra bằng tình huống</h3>
    <ul class="tips-list">
      <li><strong>Tại sao không trả Entity trực tiếp?</strong> Vì Entity là mô hình persistence; DTO giữ API ổn định và tránh lộ field nội bộ.</li>
      <li><strong>Controller đã gọi đúng một repository, service có cần không?</strong> Hãy đánh giá use case: nếu có quy tắc, transaction, phối hợp hoặc cần ranh giới test thì service có giá trị; nếu chỉ proxy một lệnh đơn giản thì đừng thêm tầng máy móc.</li>
      <li><strong>Giá sản phẩm âm thì xử lý ở đâu?</strong> Kiểm tra format/giá trị đầu vào ở DTO, nhưng quy tắc nghiệp vụ như giá phải dương cần được bảo vệ trong use case/domain vì có thể có nhiều nguồn gọi.</li>
      <li><strong>Tạo thành công thì trả gì?</strong> Thường trả 201, Location của resource mới, và body nếu client cần dữ liệu vừa tạo.</li>
    </ul>
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const controllerCode = `@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody CreateProductRequest request) {
        ProductResponse created = service.create(request);
        URI location = URI.create("/api/products/" + created.id());
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable Long id) {
        return service.get(id);
    }
}`;

const serviceCode = `@Service
public class ProductService {
    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        if (request.price().signum() <= 0) {
            throw new InvalidProductException("Giá phải lớn hơn 0");
        }

        Product product = new Product(request.name().trim(), request.price());
        Product saved = repository.save(product);
        return new ProductResponse(saved.getId(), saved.getName(), saved.getPrice());
    }

    @Transactional(readOnly = true)
    public ProductResponse get(Long id) {
        Product product = repository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));
        return new ProductResponse(product.getId(), product.getName(), product.getPrice());
    }
}`;

const repositoryCode = `public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Data cung cấp triển khai lúc chạy cho CRUD và phân trang.
    // Có thể thêm query method khi tên truy vấn còn dễ hiểu:
    List<Product> findByNameContainingIgnoreCase(String name);
}`;

const requestExample = `POST /api/products HTTP/1.1
Content-Type: application/json

{
  "name": "Mechanical keyboard",
  "price": 89.90
}

HTTP/1.1 201 Created
Location: /api/products/42
Content-Type: application/json

{
  "id": 42,
  "name": "Mechanical keyboard",
  "price": 89.90
}`;

const exceptionCode = `@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ApiError> notFound(ProductNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiError("PRODUCT_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> invalidRequest(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest()
            .body(new ApiError("INVALID_REQUEST", "Kiểm tra lại dữ liệu gửi lên"));
    }
}

// DTO Java 17+; Java 11 có thể dùng class thường với constructor/getter.
public record CreateProductRequest(
    @NotBlank @Size(max = 120) String name,
    @NotNull @DecimalMin("0.01") BigDecimal price
) {}

public record ProductResponse(Long id, String name, BigDecimal price) {}
public record ApiError(String code, String message) {}`;

export default {
  name: 'SpringSectionWeb',
  components: { CodeBlock },
  data() {
    return { controllerCode, serviceCode, repositoryCode, requestExample, exceptionCode };
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
.ss-section h3:first-child { margin-top: 0; }
.section-text {
  color: var(--forge-text2);
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 1rem 0;
}
.section-text code, .info-card code, .tips-list code {
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
.info-card {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  transition: all var(--transition-fast);
}
.info-card:hover { border-color: var(--forge-fire); transform: translateY(-2px); }
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
  line-height: 1.6;
}
.diagram {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  margin: 1rem 0;
  text-align: center;
  font-size: 0.8rem;
  color: var(--forge-fire);
  font-weight: 600;
  line-height: 2;
  font-family: var(--font-mono);
  overflow-wrap: anywhere;
}
.tips-list { list-style: none; padding: 0; margin: 1rem 0; }
.tips-list li {
  padding: 0.65rem 0.75rem;
  background: var(--forge-surface);
  border-radius: var(--radius-sm);
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--forge-text2);
  line-height: 1.6;
}
.tips-list strong { color: var(--forge-fire); }
@media (max-width: 700px) { .cards-grid { grid-template-columns: 1fr; } }
</style>
