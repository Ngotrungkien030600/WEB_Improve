import{A as e,E as t,O as n,c as r,ct as i,d as a,h as o,i as s,j as c,l,m as u,p as d,t as f,ut as p}from"./_plugin-vue_export-helper-mTPtt9wH.js";import{D as ee}from"./index-x94VOAi_.js";import{n as m}from"./navigate-y_9R8FD2.js";import{t as h}from"./CodeBlock-CsUHGuwr.js";var g=`// 1. Field injection (không khuyến nghị — khó test)
@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;
}

// 2. Constructor injection (khuyến nghị)
@Service
public class UserService {
    private final UserRepository userRepo;
    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }
}

// 3. Setter injection
@Service
public class UserService {
    private UserRepository userRepo;
    @Autowired
    public void setUserRepo(UserRepository userRepo) {
        this.userRepo = userRepo;
    }
}`,te=`@Component
@Scope("singleton")  // Mặc định — 1 instance cho toàn app
@Scope("prototype")  // Tạo mới mỗi lần getBean/inject
@Scope("request")    // 1 instance cho 1 HTTP request (Web)
@Scope("session")    // 1 instance cho 1 HTTP session
@Scope("application")// 1 instance cho ServletContext`,ne=`// Nhiều bean cùng type — chọn 1
@Primary
@Service
public class VnpayPayment implements PaymentService { }

@Qualifier("paypal")
@Service
public class PaypalPayment implements PaymentService { }

// Khi inject
public OrderService(@Qualifier("paypal") PaymentService payment) { }`,re={name:`SpringSectionCore`,components:{CodeBlock:h},data(){return{iocCode:g,scopeCode:te,qualifierCode:ne}}},ie={class:`ss-section`};function ae(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,ie,[i[0]||=d(`<h3 data-v-6e7c5db6>IoC Container là gì?</h3><p class="section-text" data-v-6e7c5db6>IoC Container (ApplicationContext) quản lý vòng đời của beans — tạo, cấu hình, inject dependencies. Thay vì tự tạo object (<code data-v-6e7c5db6>new UserService()</code>), bạn để Spring quản lý và inject khi cần.</p><h3 data-v-6e7c5db6>Các cách inject — chọn cái nào?</h3><div class="cards-grid cols-2" data-v-6e7c5db6><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>1. Field injection (@Autowired)</h4><p data-v-6e7c5db6>Ngắn gọn nhưng <strong data-v-6e7c5db6>khó test</strong> — không inject được dependency khác khi viết unit test, phải dùng reflection.</p></div><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>2. Constructor injection (khuyến nghị)</h4><p data-v-6e7c5db6>Biến dependency thành <code data-v-6e7c5db6>final</code> — bắt buộc cung cấp khi tạo object. <strong data-v-6e7c5db6>Dễ test, bất biến, tự detect vòng phụ thuộc.</strong> Spring khuyến nghị đây là chuẩn duy nhất.</p></div><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>3. Setter injection</h4><p data-v-6e7c5db6>Dùng khi dependency <strong data-v-6e7c5db6>tùy chọn</strong> hoặc cần thay đổi runtime. Ít dùng trong thực tế.</p></div><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>Quy tắc thực tế</h4><p data-v-6e7c5db6>Trong project thật, hầu hết bean dùng constructor injection. Khi có 1 constructor, Spring tự inject — không cần viết <code data-v-6e7c5db6>@Autowired</code>.</p></div></div>`,4),o(p,{code:l.iocCode,language:`java`},null,8,[`code`]),i[1]||=d(`<h3 data-v-6e7c5db6>@Component vs @Bean</h3><div class="cards-grid cols-2" data-v-6e7c5db6><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>@Component (@Service, @Repository, @Controller)</h4><p data-v-6e7c5db6>Dùng cho class tự viết. Spring scan package → tạo bean tự động.</p></div><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>@Bean</h4><p data-v-6e7c5db6>Dùng trong @Configuration class cho third-party classes (DataSource, RestTemplate).</p></div></div><h3 data-v-6e7c5db6>Bean Scopes — mỗi bean sống bao lâu?</h3><p class="section-text" data-v-6e7c5db6>Scope quyết định <strong data-v-6e7c5db6>số instance</strong> của một bean tồn tại trong app. Chọn sai scope là nguồn gốc của nhiều bug khó tìm: state dùng chung bất ngờ giữa các request, hoặc bean chứa state không thread-safe.</p>`,4),o(p,{code:l.scopeCode,language:`java`},null,8,[`code`]),i[2]||=r(`h3`,null,`@Primary & @Qualifier — khi có nhiều bean cùng loại`,-1),i[3]||=r(`p`,{class:`section-text`},[u(`Khi 2 bean cùng implement một interface (VD: 2 cổng thanh toán VNPay và PayPal), Spring không biết inject cái nào → báo lỗi. `),r(`code`,null,`@Primary`),u(` chọn mặc định, `),r(`code`,null,`@Qualifier`),u(` chọn theo tên khi cần bean khác — tránh sửa code mỗi lần đổi cổng thanh toán.`)],-1),o(p,{code:l.qualifierCode,language:`java`},null,8,[`code`])])}var _=f(re,[[`render`,ae],[`__scopeId`,`data-v-6e7c5db6`]]),v=`@RestController
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
}`,y=`@Service
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
}`,b=`public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Data cung cấp triển khai lúc chạy cho CRUD và phân trang.
    // Có thể thêm query method khi tên truy vấn còn dễ hiểu:
    List<Product> findByNameContainingIgnoreCase(String name);
}`,x=`POST /api/products HTTP/1.1
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
}`,S=`@RestControllerAdvice
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
public record ApiError(String code, String message) {}`,C={name:`SpringSectionWeb`,components:{CodeBlock:h},data(){return{controllerCode:v,serviceCode:y,repositoryCode:b,requestExample:x,exceptionCode:S}}},w={class:`ss-section`};function T(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,w,[i[0]||=d(`<h3 data-v-db9037bd>Mục tiêu: hiểu request đi qua hệ thống thế nào</h3><p class="section-text" data-v-db9037bd>REST API là cách client và server trao đổi tài nguyên qua HTTP. MVC là cách tổ chức xử lý request trong Spring MVC; hai khái niệm liên quan nhưng không đồng nghĩa: REST mô tả hợp đồng giao tiếp, MVC mô tả cách framework nhận và điều phối request.</p><div class="diagram" data-v-db9037bd>Client JSON → Filter/Security → DispatcherServlet → Controller → Service → Repository → Database<br data-v-db9037bd>Database → Repository → Service → Controller/ResponseEntity → JSON response</div><h3 data-v-db9037bd>MVC và trách nhiệm từng tầng</h3><div class="cards-grid cols-2" data-v-db9037bd><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Model</h4><p data-v-db9037bd>Dữ liệu và quy tắc nghiệp vụ. Trong ứng dụng Spring, domain/entity và các lớp nghiệp vụ thường tạo nên phần Model; Entity không nên mặc định là JSON contract.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>View</h4><p data-v-db9037bd>Phần trình bày. Với MVC server-rendered, View có thể là template HTML. Với REST API, response JSON là biểu diễn dữ liệu cho client, không phải trang HTML.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Controller</h4><p data-v-db9037bd>Biên HTTP: nhận path/query/body, gọi use case, chọn status/header và DTO trả về. Giữ controller mỏng; tránh nhét quy tắc nghiệp vụ và SQL vào đây.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Service</h4><p data-v-db9037bd>Thực hiện use case và quy tắc nghiệp vụ, phối hợp nhiều repository/dịch vụ, đặt transaction. Không phải CRUD nào cũng bắt buộc có service riêng, nhưng đây là chỗ rõ ràng khi logic bắt đầu có ý nghĩa.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Repository</h4><p data-v-db9037bd>Trừu tượng hóa truy vấn và lưu trữ. Spring Data có thể sinh triển khai từ interface hoặc method name. Repository không nên quyết định HTTP status hay thông điệp giao diện.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>DTO / Entity</h4><p data-v-db9037bd>DTO là hợp đồng request/response; Entity là mô hình lưu trữ. Tách chúng để validation, quyền truy cập và thay đổi schema không làm API vô tình đổi theo.</p></div></div><h3 data-v-db9037bd>Ví dụ xuyên suốt: tạo sản phẩm</h3><p class="section-text" data-v-db9037bd>Client gửi <code data-v-db9037bd>POST /api/products</code> với JSON. Spring chuyển JSON thành DTO, chạy validation, controller gọi service, service áp dụng quy tắc rồi gọi repository. Sau khi lưu, server trả <code data-v-db9037bd>201 Created</code>, header <code data-v-db9037bd>Location</code> trỏ đến resource mới và response DTO.</p>`,7),o(p,{code:l.controllerCode,language:`java`},null,8,[`code`]),o(p,{code:l.serviceCode,language:`java`},null,8,[`code`]),o(p,{code:l.repositoryCode,language:`java`},null,8,[`code`]),i[1]||=d(`<h3 data-v-db9037bd>API chỉnh chu gồm những gì?</h3><div class="cards-grid cols-2" data-v-db9037bd><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>URL nói về resource</h4><p data-v-db9037bd>Dùng danh từ số nhiều như <code data-v-db9037bd>/api/products</code>, <code data-v-db9037bd>/api/products/{id}</code>. Dùng HTTP method để diễn đạt hành động; query string dành cho lọc, sắp xếp và phân trang.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Status và header có ý nghĩa</h4><p data-v-db9037bd><code data-v-db9037bd>200</code> đọc/cập nhật thành công; <code data-v-db9037bd>201</code> tạo mới; <code data-v-db9037bd>204</code> xóa không có body; <code data-v-db9037bd>400</code> dữ liệu sai; <code data-v-db9037bd>404</code> không tìm thấy; <code data-v-db9037bd>409</code> xung đột; <code data-v-db9037bd>500</code> lỗi không dự kiến.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>PUT và PATCH</h4><p data-v-db9037bd><code data-v-db9037bd>PUT</code> thường thay toàn bộ biểu diễn và có tính idempotent. <code data-v-db9037bd>PATCH</code> cập nhật một phần; tính idempotent phụ thuộc phép cập nhật. Chọn một quy ước rõ và ghi trong API docs.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Validation và lỗi nhất quán</h4><p data-v-db9037bd>Validate ở biên request bằng DTO và <code data-v-db9037bd>@Valid</code>. Dùng <code data-v-db9037bd>@RestControllerAdvice</code> ánh xạ lỗi dự kiến thành mã/status ổn định; không trả stack trace hoặc chi tiết nội bộ.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Phân trang và vận hành</h4><p data-v-db9037bd>Giới hạn kích thước trang, hỗ trợ filter/sort cho bảng lớn. Cân nhắc authz, rate limit, timeout, logging có correlation ID và metric theo nhu cầu sản phẩm.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Hợp đồng có thể kiểm tra</h4><p data-v-db9037bd>Viết API docs/OpenAPI, ví dụ request-response và quy tắc tương thích ngược. Test status, validation, quyền truy cập và trường hợp không tìm thấy.</p></div></div>`,2),o(p,{code:l.requestExample,language:`http + json`},null,8,[`code`]),i[2]||=d(`<h3 data-v-db9037bd>Nếu bỏ Service thì sao? Các cách tổ chức khác</h3><div class="cards-grid cols-2" data-v-db9037bd><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Controller → Service → Repository</h4><p data-v-db9037bd>Layered architecture dễ đọc, hợp CRUD nghiệp vụ thông thường. Mỗi tầng có trách nhiệm rõ. Tránh tạo service chỉ để chuyển tiếp một lệnh nếu nó không tạo ranh giới hoặc giá trị nào.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Controller → Repository trực tiếp</h4><p data-v-db9037bd>Có thể hợp endpoint đọc rất đơn giản hoặc prototype nhỏ. Khi thêm kiểm tra quyền, transaction, nhiều bước nghiệp vụ hay tái sử dụng, controller dễ phình và logic khó kiểm thử; lúc đó tách use case/service.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Vertical slice / feature-first</h4><p data-v-db9037bd>Gom controller, use case, DTO và truy vấn theo từng tính năng như <code data-v-db9037bd>products</code> hay <code data-v-db9037bd>orders</code>, thay vì gom tất cả controller vào một thư mục. Hữu ích khi codebase lớn và team sở hữu theo feature.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>Ports and adapters / hexagonal</h4><p data-v-db9037bd>Use case phụ thuộc interface (port); database, HTTP client hay message broker là adapter bên ngoài. Dễ thay adapter và test nghiệp vụ độc lập, đổi lại cần thêm cấu trúc và abstraction.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>CQRS</h4><p data-v-db9037bd>Tách đường đọc và ghi khi nhu cầu truy vấn, tải hoặc mô hình dữ liệu khác biệt đáng kể. Không phải mặc định cho CRUD; nó làm tăng số thành phần cần đồng bộ và vận hành.</p></div><div class="info-card" data-v-db9037bd><h4 data-v-db9037bd>REST, GraphQL, gRPC, messaging</h4><p data-v-db9037bd>REST phổ biến cho resource qua HTTP; GraphQL cho client chọn dữ liệu; gRPC cho RPC typed hiệu năng cao giữa service; messaging cho xử lý bất đồng bộ. Đây là lựa chọn giao tiếp, độc lập với việc bên trong dùng layered hay hexagonal.</p></div></div><h3 data-v-db9037bd>Exception handling ở một nơi</h3><p class="section-text" data-v-db9037bd><code data-v-db9037bd>@RestControllerAdvice</code> gom cách chuyển lỗi thành HTTP response để mọi endpoint có cùng hợp đồng. Bắt exception cụ thể trước; lỗi 500 chỉ trả thông báo an toàn cho client và ghi chi tiết vào log có kiểm soát.</p>`,4),o(p,{code:l.exceptionCode,language:`java`},null,8,[`code`]),i[3]||=r(`h3`,null,`Tự kiểm tra bằng tình huống`,-1),i[4]||=r(`ul`,{class:`tips-list`},[r(`li`,null,[r(`strong`,null,`Tại sao không trả Entity trực tiếp?`),u(` Vì Entity là mô hình persistence; DTO giữ API ổn định và tránh lộ field nội bộ.`)]),r(`li`,null,[r(`strong`,null,`Controller đã gọi đúng một repository, service có cần không?`),u(` Hãy đánh giá use case: nếu có quy tắc, transaction, phối hợp hoặc cần ranh giới test thì service có giá trị; nếu chỉ proxy một lệnh đơn giản thì đừng thêm tầng máy móc.`)]),r(`li`,null,[r(`strong`,null,`Giá sản phẩm âm thì xử lý ở đâu?`),u(` Kiểm tra format/giá trị đầu vào ở DTO, nhưng quy tắc nghiệp vụ như giá phải dương cần được bảo vệ trong use case/domain vì có thể có nhiều nguồn gọi.`)]),r(`li`,null,[r(`strong`,null,`Tạo thành công thì trả gì?`),u(` Thường trả 201, Location của resource mới, và body nếu client cần dữ liệu vừa tạo.`)])],-1)])}var E=f(C,[[`render`,T],[`__scopeId`,`data-v-db9037bd`]]),D=`@Entity
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
}`,O=`public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
    Optional<User> findByIdWithOrders(@Param("id") Long id);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date, @Param("status") String status);
}`,k=`public interface ProductRepository extends JpaRepository<Product, Long> {
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
}`,A=`public interface ProductRepository extends JpaRepository<Product, Long> {
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
}`,j=`// Specification: điều kiện có thể ghép theo form tìm kiếm
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
    .and(p.stock.loe(maxStock));                        // <=`,M=`// Maven: mapstruct là API/annotations; mapstruct-processor sinh source
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
}`,N=`<properties>
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
</plugin></plugins></build>`,P=`@Service
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
}`,F=`// Fix 1: JOIN FETCH
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
}`,I={name:`SpringSectionJpa`,components:{CodeBlock:h},data(){return{entityCode:D,repositoryCode:O,derivedQueryCode:k,queryAnnotationCode:A,dynamicQueryCode:j,mapStructBuildCode:N,mapStructCode:M,mapStructServiceCode:P,n1Code:F}}},L={class:`ss-section`};function R(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,L,[i[0]||=r(`h3`,null,`Entity & Relationships — ánh xạ bảng DB thành object`,-1),i[1]||=r(`p`,{class:`section-text`},[r(`code`,null,`@Entity`),u(` đánh dấu class ánh xạ tới 1 bảng, mỗi field là 1 cột. Quan hệ quan trọng nhất: `),r(`code`,null,`@OneToMany`),u(` (1 user → nhiều order) và `),r(`code`,null,`@ManyToMany`),u(` (user ↔ role) qua bảng trung gian `),r(`code`,null,`user_roles`),u(`. Chọn đúng quan hệ + cascade quyết định cách Hibernate sinh SQL và quản lý dữ liệu liên quan.`)],-1),o(p,{code:l.entityCode,language:`java`},null,8,[`code`]),i[2]||=r(`h3`,null,`Repository — Spring Data JPA sinh sẵn query`,-1),i[3]||=r(`p`,{class:`section-text`},[r(`code`,null,`JpaRepository`),u(` cung cấp sẵn CRUD + paging (findAll, save, findById...). Chỉ cần `),r(`strong`,null,`khai báo method theo quy ước tên`),u(` (`),r(`code`,null,`findByEmail`),u(`) Spring tự implement. `),r(`code`,null,`@Query`),u(` dùng khi cần JPQL tùy biến — kèm `),r(`code`,null,`@Modifying`),u(` cho lệnh UPDATE/DELETE.`)],-1),o(p,{code:l.repositoryCode,language:`java`},null,8,[`code`]),i[4]||=r(`h3`,null,`Query derivation — Spring đọc tên method để tạo query`,-1),i[5]||=r(`p`,{class:`section-text`},[u(`Spring Data phân tích method lúc tạo repository: phần trước `),r(`code`,null,`By`),u(` xác định loại thao tác, phần sau mô tả property và điều kiện. Tên property phải khớp với field của Entity; sai tên thường làm ứng dụng báo lỗi khi khởi động, không phải Spring tự đoán ý mình. Ví dụ `),r(`code`,null,`findByPriceGreaterThanEqual`),u(` tương ứng điều kiện `),r(`code`,null,`price >= ?`),u(`.`)],-1),o(p,{code:l.derivedQueryCode,language:`java`},null,8,[`code`]),i[6]||=d(`<div class="cards-grid cols-2" data-v-185c7c2d><div class="info-card" data-v-185c7c2d><h4 data-v-185c7c2d>Đọc method như một câu</h4><p data-v-185c7c2d><code data-v-185c7c2d>findByCategoryNameAndPriceGreaterThanEqual</code> = tìm Product theo tên category và giá lớn hơn hoặc bằng giá truyền vào.</p></div><div class="info-card" data-v-185c7c2d><h4 data-v-185c7c2d>Khi nào ngừng dùng derived query?</h4><p data-v-185c7c2d>Nếu tên method quá dài, có nhiều nhánh OR, join/aggregation phức tạp hoặc khó kiểm soát projection, hãy chuyển sang <code data-v-185c7c2d>@Query</code>, Specification hoặc Querydsl.</p></div></div><h3 data-v-185c7c2d><code data-v-185c7c2d>@Query</code> — tự viết JPQL khi cần kiểm soát câu truy vấn</h3><p class="section-text" data-v-185c7c2d>Derived query phù hợp điều kiện đơn giản, còn <code data-v-185c7c2d>@Query</code> đặt truy vấn cạnh method repository. JPQL viết theo Entity và property Java, không phải tên bảng/cột SQL. Dùng <code data-v-185c7c2d>@Param</code> để tên tham số rõ ràng; native SQL chỉ dùng khi thật sự cần tính năng riêng của database.</p>`,3),o(p,{code:l.queryAnnotationCode,language:`java`},null,8,[`code`]),i[7]||=d(`<h3 data-v-185c7c2d>Dynamic filters — Specification và Querydsl là DSL khác nhau</h3><p class="section-text" data-v-185c7c2d><strong data-v-185c7c2d>Specification</strong> ghép các điều kiện Criteria khi bộ lọc đến từ form và có thể thiếu từng trường. <strong data-v-185c7c2d>Querydsl</strong> dùng kiểu Q như <code data-v-185c7c2d>QProduct.product</code> để viết điều kiện fluent, có kiểm tra kiểu lúc compile. <code data-v-185c7c2d>gt</code>/<code data-v-185c7c2d>goe</code> nghĩa là &gt;/≥; <code data-v-185c7c2d>lt</code>/<code data-v-185c7c2d>loe</code> nghĩa là &lt;/≤. Q-class của Querydsl cần được annotation processor tạo trong build.</p>`,2),o(p,{code:l.dynamicQueryCode,language:`java`},null,8,[`code`]),i[8]||=r(`h3`,null,`MapStruct — vì sao mapping không nhồi vào Service?`,-1),i[9]||=r(`p`,{class:`section-text`},[u(`Service vẫn gọi mapper; điều được tách ra là các quy tắc đổi hình dạng dữ liệu. Service điều phối nghiệp vụ (kiểm tra trùng email, lưu Entity, gọi mapper), còn Mapper mô tả Entity ↔ DTO. MapStruct chạy annotation processor khi compile và sinh class Java thường như `),r(`code`,null,`ProductMapperImpl`),u(`; lúc chạy ứng dụng không cần reflection để dò field. Vì code được sinh ra lúc build, lỗi kiểu dữ liệu hoặc mapping thiếu có thể bị phát hiện sớm hơn.`)],-1),o(p,{code:l.mapStructBuildCode,language:`xml`},null,8,[`code`]),o(p,{code:l.mapStructCode,language:`java`},null,8,[`code`]),i[10]||=r(`div`,{class:`cards-grid cols-2`},[r(`div`,{class:`info-card`},[r(`h4`,null,`Service làm gì?`),r(`p`,null,`Áp dụng quy tắc nghiệp vụ, gọi repository và gọi mapper tại ranh giới Entity/DTO. Service vẫn kiểm soát luồng xử lý.`)]),r(`div`,{class:`info-card`},[r(`h4`,null,`MapStruct làm gì?`),r(`p`,null,[u(`Sinh phần gán field lặp đi lặp lại, hỗ trợ đổi tên field và nested mapping. Quy tắc đặc biệt vẫn viết rõ bằng `),r(`code`,null,`@Mapping`),u(` hoặc method tùy chỉnh.`)])])],-1),o(p,{code:l.mapStructServiceCode,language:`java`},null,8,[`code`]),i[11]||=d(`<h3 data-v-185c7c2d>Đọc lỗi và kiểm chứng hành vi</h3><p class="section-text" data-v-185c7c2d>Đừng chỉ nhớ keyword. Hãy đoán query trước, chạy repository test với dữ liệu biên (giá bằng min, nhỏ hơn min, null, không có kết quả), bật SQL log và xem SQL/parameters thực tế. Với MapStruct, xem generated source trong thư mục build để hiểu interface được biến thành Java code nào.</p><h3 data-v-185c7c2d>N+1 Problem — cái bẫy hiệu năng kinh điển</h3><p class="section-text" data-v-185c7c2d><strong data-v-185c7c2d>N+1</strong>: lấy danh sách N record, rồi mỗi record lại query thêm quan hệ → tổng <strong data-v-185c7c2d>N+1 queries</strong> thay vì 1. Gây chậm rõ rệt khi dữ liệu lớn (1000 users → 1001 queries). Đây là lỗi hiệu năng phổ biến nhất khi dùng JPA, thường bị phát hiện muộn ở production.</p><div class="cards-grid cols-2" data-v-185c7c2d><div class="info-card" data-v-185c7c2d><h4 data-v-185c7c2d>Fix 1: JOIN FETCH</h4><p data-v-185c7c2d>Gộp 1 query lấy luôn dữ liệu quan hệ. Hiệu quả cho truy vấn cố định.</p></div><div class="info-card" data-v-185c7c2d><h4 data-v-185c7c2d>Fix 2: @EntityGraph</h4><p data-v-185c7c2d>Khai báo eager load các quan hệ theo tên — tái sử dụng được với nhiều query.</p></div><div class="info-card" data-v-185c7c2d><h4 data-v-185c7c2d>Fix 3: @BatchSize</h4><p data-v-185c7c2d>Gom N quan hệ vào 1 query IN (...). Giảm số query mà không phải sửa từng truy vấn.</p></div><div class="info-card" data-v-185c7c2d><h4 data-v-185c7c2d>Kiểm tra thực tế</h4><p data-v-185c7c2d>Bật <code data-v-185c7c2d>spring.jpa.show-sql</code> hoặc Hibernate Stats khi test — đếm số query phát sinh, bắt N+1 trước khi lên production.</p></div></div>`,5),o(p,{code:l.n1Code,language:`java`},null,8,[`code`])])}var z=f(I,[[`render`,R],[`__scopeId`,`data-v-185c7c2d`]]),B=`@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -> sm.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/actuator/health").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}`,V=`@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String auth = req.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            try {
                Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

                String email = claims.getSubject();
                UserDetails user = userDetailsService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException e) {
                res.setStatus(401);
                return;
            }
        }
        chain.doFilter(req, res);
    }
}`,H=`@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:3000"));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", config);
    return src;
}`,U=`// Resource Server: verify issuer and signing keys from IdP metadata/JWKS
@Bean
SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable()) // chỉ phù hợp API stateless dùng bearer header
        .sessionManagement(sm -> sm.sessionCreationPolicy(STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/actuator/health").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/admin/**")
                .hasAuthority("SCOPE_admin:read")
            .anyRequest().authenticated())
        .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
        .build();
}

// application.yml
spring.security.oauth2.resourceserver.jwt.issuer-uri: https://login.example.com/realms/app

// Add audience validation; issuer validation alone is not enough.
@Bean
JwtDecoder jwtDecoder() {
    String issuer = "https://login.example.com/realms/app";
    NimbusJwtDecoder decoder = NimbusJwtDecoder.withIssuerLocation(issuer).build();
    OAuth2TokenValidator<Jwt> issuerValidator = JwtValidators.createDefaultWithIssuer(issuer);
    OAuth2TokenValidator<Jwt> audienceValidator = jwt ->
        jwt.getAudience().contains("orders-api")
            ? OAuth2TokenValidatorResult.success()
            : OAuth2TokenValidatorResult.failure(
                new OAuth2Error("invalid_token", "Wrong audience", null));
    decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(issuerValidator, audienceValidator));
    return decoder;
}`,W=`{
  "iss": "https://login.example.com/realms/app",
  "sub": "user-123",
  "aud": ["orders-api"],
  "exp": 1980000000,
  "scope": "orders:read orders:write",
  "roles": ["CUSTOMER"]
}

// API must reject wrong issuer/audience, expired token and invalid signature.
// Never accept the payload before signature verification.`,G={name:`SpringSectionSecurity`,components:{CodeBlock:h},data(){return{securityConfigCode:B,jwtFilterCode:V,corsCode:H,resourceServerCode:U,tokenClaimsCode:W}}},K={class:`ss-section`};function q(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,K,[i[0]||=d(`<h3 data-v-ab4271ba>SecurityFilterChain — bức tường trước mọi request</h3><p class="section-text" data-v-ab4271ba>Đây là cấu hình trung tâm của Spring Security: quyết định <strong data-v-ab4271ba>request nào được phép, request nào phải xác thực</strong>. Với API stateless (SPA/React/Vue), ta tắt CSRF + session, và đặt JWT filter trước khi Spring xử lý username/password.</p><div class="cards-grid cols-2" data-v-ab4271ba><div class="info-card" data-v-ab4271ba><h4 data-v-ab4271ba>permitAll()</h4><p data-v-ab4271ba>Không cần đăng nhập: <code data-v-ab4271ba>/api/auth/**</code> (đăng ký, đăng nhập) và <code data-v-ab4271ba>/actuator/health</code>.</p></div><div class="info-card" data-v-ab4271ba><h4 data-v-ab4271ba>hasRole(&quot;ADMIN&quot;)</h4><p data-v-ab4271ba>Chỉ user có role ADMIN mới vào được <code data-v-ab4271ba>/api/admin/**</code> — phân quyền theo role.</p></div><div class="info-card" data-v-ab4271ba><h4 data-v-ab4271ba>anyRequest().authenticated()</h4><p data-v-ab4271ba>Mọi request còn lại phải có token hợp lệ. Nguyên tắc <strong data-v-ab4271ba>deny by default</strong> — an toàn hơn allow tất cả.</p></div><div class="info-card" data-v-ab4271ba><h4 data-v-ab4271ba>STATELESS</h4><p data-v-ab4271ba>Không lưu session server — mỗi request tự mang token (JWT). Cần thiết để scale ngang nhiều instance mà không mất phiên đăng nhập.</p></div></div>`,3),o(p,{code:l.securityConfigCode,language:`java`},null,8,[`code`]),i[1]||=r(`h3`,null,`JWT Filter — xác thực từng request`,-1),i[2]||=r(`p`,{class:`section-text`},[u(`Mỗi request gửi kèm header `),r(`code`,null,`Authorization: Bearer <token>`),u(`. Filter này: lấy token → `),r(`strong`,null,`xác minh chữ ký`),u(` (tránh token giả) → nạp user + quyền vào `),r(`code`,null,`SecurityContext`),u(` để các endpoint khác dùng. Token lỗi/sai chữ ký → trả `),r(`code`,null,`401`),u(` ngay.`)],-1),o(p,{code:l.jwtFilterCode,language:`java`},null,8,[`code`]),i[3]||=d(`<h3 data-v-ab4271ba>Password Encoding &amp; CORS</h3><p class="section-text" data-v-ab4271ba><strong data-v-ab4271ba>BCrypt</strong> mã hóa password 1 chiều (kèm salt) — không bao giờ lưu password dạng plaintext, kể cả khi DB bị lộ. <strong data-v-ab4271ba>CORS</strong> cho phép frontend ở domain khác (VD: <code data-v-ab4271ba>localhost:3000</code>) gọi API — nếu thiếu, trình duyệt chặn request.</p><div class="cards-grid cols-2" data-v-ab4271ba><div class="info-card" data-v-ab4271ba><h4 data-v-ab4271ba>BCryptPasswordEncoder</h4><p data-v-ab4271ba>Thuật toán hash mạnh, tự sinh salt mỗi lần hash — 2 lần hash cùng password cho 2 chuỗi khác nhau, chống rainbow table.</p></div><div class="info-card" data-v-ab4271ba><h4 data-v-ab4271ba>CORS đúng cách</h4><p data-v-ab4271ba>Chỉ allow đúng origin thật (không dùng <code data-v-ab4271ba>*</code> khi có credentials), giới hạn method + header cần thiết.</p></div></div>`,3),o(p,{code:l.corsCode,language:`java`},null,8,[`code`]),i[4]||=d(`<h3 data-v-ab4271ba>OAuth 2.0, OpenID Connect và JWT: mỗi thứ giải quyết việc gì?</h3><div class="cards-grid cols-2" data-v-ab4271ba><div class="info-card" data-v-ab4271ba><h4 data-v-ab4271ba>OAuth 2.0</h4><p data-v-ab4271ba>Framework ủy quyền: client xin quyền truy cập API thay mặt người dùng. Nó định nghĩa flow/token, không phải định dạng token.</p></div><div class="info-card" data-v-ab4271ba><h4 data-v-ab4271ba>OpenID Connect (OIDC)</h4><p data-v-ab4271ba>Lớp xác thực danh tính đặt trên OAuth 2.0. ID token nói client biết user là ai; access token dùng gọi API.</p></div><div class="info-card" data-v-ab4271ba><h4 data-v-ab4271ba>JWT</h4><p data-v-ab4271ba>Định dạng token có header, claims và chữ ký. JWT thường chỉ được ký, không được mã hóa; đừng đặt password/secret trong payload.</p></div><div class="info-card" data-v-ab4271ba><h4 data-v-ab4271ba>Authorization Code + PKCE</h4><p data-v-ab4271ba>Flow thường dùng cho web/mobile user login. PKCE ràng buộc code với client để giảm nguy cơ authorization code bị đánh cắp.</p></div></div><div class="diagram" data-v-ab4271ba>User → Client → Identity Provider (login + MFA)<br data-v-ab4271ba>Client nhận authorization code → đổi code + PKCE verifier lấy token<br data-v-ab4271ba>Client gửi access token → Resource Server kiểm chữ ký, issuer, audience, expiry và scope</div><p class="section-text" data-v-ab4271ba>Trong production, thường dùng Identity Provider (Cognito, Keycloak, Entra ID hoặc dịch vụ tương đương) để quản lý login/MFA/token lifecycle. API dùng Spring OAuth2 Resource Server để xác thực access token. Tự viết JWT filter giúp hiểu pipeline, nhưng không tự cung cấp OAuth/OIDC, refresh rotation hay key management.</p>`,4),o(p,{code:l.resourceServerCode,language:`java`},null,8,[`code`]),i[5]||=d(`<h3 data-v-ab4271ba>Token lifecycle: hết hạn, refresh, logout và thu hồi</h3><ol class="security-list" data-v-ab4271ba><li data-v-ab4271ba>Access token sống ngắn; API luôn kiểm tra chữ ký, <code data-v-ab4271ba>iss</code>, <code data-v-ab4271ba>aud</code>, <code data-v-ab4271ba>exp</code>, <code data-v-ab4271ba>nbf</code> và scope/authority.</li><li data-v-ab4271ba>Refresh token chỉ gửi tới authorization server. Dùng rotation: mỗi lần refresh phát token mới và vô hiệu token cũ; phát hiện reuse thì thu hồi cả token family.</li><li data-v-ab4271ba>Logout cần revoke refresh token/session. JWT access token đã phát thường còn hiệu lực tới khi hết hạn, trừ khi thêm denylist/introspection; cần cân bằng giữa khả năng thu hồi và tính stateless.</li><li data-v-ab4271ba>Không tin role hoặc user ID do client gửi. Quyền phải được xác nhận từ token đã verify hoặc dữ liệu server.</li></ol><div class="callout" data-v-ab4271ba><strong data-v-ab4271ba>Browser security:</strong> nếu lưu refresh token trong cookie thì đặt <code data-v-ab4271ba>HttpOnly</code>, <code data-v-ab4271ba>Secure</code>, <code data-v-ab4271ba>SameSite</code> phù hợp và có CSRF strategy. Nếu dùng BFF, browser giữ session cookie còn access/refresh token ở server. Không chọn nơi lưu token theo thói quen; xác định threat model trước.</div>`,3),o(p,{code:l.tokenClaimsCode,language:`json`},null,8,[`code`])])}var J=f(G,[[`render`,q],[`__scopeId`,`data-v-ab4271ba`]]),oe=`# application.yml
management:
  endpoints.web.exposure.include: health,info,metrics
  endpoint.health.show-details: when-authorized`,se={name:`SpringSectionBoot`,components:{CodeBlock:h},data(){return{actuatorCode:oe}}},ce={class:`ss-section`};function le(n,r,i,s,c,l){let u=e(`CodeBlock`);return t(),a(`div`,ce,[r[0]||=d(`<h3 data-v-4b1d0e45>Auto-configuration — vì sao chạy được ngay không cần cấu hình?</h3><p class="section-text" data-v-4b1d0e45>Thêm dependency (VD: spring-boot-starter-data-jpa) vào classpath, Spring Boot <strong data-v-4b1d0e45>tự phát hiện và cấu hình</strong> DataSource, EntityManager... Mỗi auto-config class chỉ hoạt động khi điều kiện đúng (<code data-v-4b1d0e45>@ConditionalOnClass</code>, <code data-v-4b1d0e45>@ConditionalOnMissingBean</code>) — đó là lý do app khởi động được ngay mà không cần config thủ công.</p><h3 data-v-4b1d0e45>Actuator — &quot;nhịp tim&quot; của ứng dụng</h3><p class="section-text" data-v-4b1d0e45><strong data-v-4b1d0e45>Actuator</strong> expose các endpoint giám sát app đang chạy: sức khỏe, metrics, môi trường. Đây là nền tảng để <strong data-v-4b1d0e45>Prometheus/Grafana scrape dữ liệu</strong> và Kubernetes health check — không có nó, team vận hành không biết app còn sống hay sắp chết.</p><div class="cards-grid cols-4" data-v-4b1d0e45><div class="info-card" data-v-4b1d0e45><h4 data-v-4b1d0e45>/actuator/health</h4><p data-v-4b1d0e45>Health check DB, disk, custom components — Kubernetes dùng để biết pod còn nhận traffic không.</p></div><div class="info-card" data-v-4b1d0e45><h4 data-v-4b1d0e45>/actuator/metrics</h4><p data-v-4b1d0e45>JVM (heap, thread, GC), HTTP request count/latency — nguồn cho Prometheus + Grafana dashboard.</p></div><div class="info-card" data-v-4b1d0e45><h4 data-v-4b1d0e45>/actuator/info</h4><p data-v-4b1d0e45>Custom info (version, build time, git commit) — biết chính xác build nào đang chạy.</p></div><div class="info-card" data-v-4b1d0e45><h4 data-v-4b1d0e45>/actuator/env</h4><p data-v-4b1d0e45>Environment properties (cần bảo vệ — có thể lộ secret).</p></div></div>`,5),o(u,{code:c.actuatorCode,language:`yaml`},null,8,[`code`])])}var Y=f(se,[[`render`,le],[`__scopeId`,`data-v-4b1d0e45`]]),ue=`@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

@Service
public class EmailService {
    @Async
    public CompletableFuture<Void> sendWelcomeEmail(User user) {
        emailClient.send(user.getEmail(), "Welcome!", template);
        return CompletableFuture.completedFuture(null);
    }
}`,de=`@Configuration
@EnableScheduling
public class SchedulingConfig {}

@Component
public class CleanupJob {
    // Mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanExpiredTokens() {
        tokenRepository.deleteExpired(LocalDateTime.now());
    }
}`,fe=`// Event
public record UserCreatedEvent(User user, Instant timestamp) {}

// Publisher
@Service
public class UserService {
    @Autowired private ApplicationEventPublisher publisher;
    public User create(CreateUserRequest req) {
        User user = userRepo.save(toEntity(req));
        publisher.publishEvent(new UserCreatedEvent(user, Instant.now()));
        return user;
    }
}

// Listener
@Component
public class UserEventListener {
    @Async
    @EventListener
    public void handleUserCreated(UserCreatedEvent event) {
        emailService.sendWelcome(event.user());
    }
}`,pe={name:`SpringSectionAsync`,components:{CodeBlock:h},data(){return{asyncCode:ue,scheduledCode:de,eventCode:fe}}},me={class:`ss-section`};function he(n,i,s,c,l,d){let f=e(`CodeBlock`);return t(),a(`div`,me,[i[0]||=r(`h3`,null,`@Async — chạy nền, không chặn response`,-1),i[1]||=r(`p`,{class:`section-text`},[r(`code`,null,`@Async`),u(` đẩy method chạy vào `),r(`strong`,null,`thread pool riêng`),u(`, trả response ngay lập tức. Áp dụng cho tác vụ chậm không cần đợi kết quả: gửi email welcome, gọi webhook, xử lý file. `),r(`strong`,null,`Bẫy phổ biến:`),u(` gọi @Async method từ bên trong cùng class sẽ không có tác dụng (proxy không đi qua).`)],-1),o(f,{code:l.asyncCode,language:`java`},null,8,[`code`]),i[2]||=r(`h3`,null,`@Scheduled — chạy tự động theo lịch`,-1),i[3]||=r(`p`,{class:`section-text`},[u(`Tác vụ định kỳ như dọn dữ liệu cũ, gửi báo cáo, chạy backup. Cron `),r(`code`,null,`0 0 2 * * ?`),u(` = mỗi ngày lúc 2h sáng. Khi chạy nhiều instance, cần khóa phân tán (ShedLock, Quartz) để tránh `),r(`strong`,null,`nhiều instance chạy cùng lúc`),u(`.`)],-1),o(f,{code:l.scheduledCode,language:`java`},null,8,[`code`]),i[4]||=r(`h3`,null,`@EventListener — tách rời các module`,-1),i[5]||=r(`p`,{class:`section-text`},[u(`Publisher `),r(`strong`,null,`phát event`),u(`, listener `),r(`strong`,null,`lắng nghe và xử lý`),u(` — hai module không biết về nhau. VD: UserService tạo user xong phát `),r(`code`,null,`UserCreatedEvent`),u(`, module email/notification tự phản ứng. Kết hợp `),r(`code`,null,`@Async`),u(` để không làm chậm luồng chính. Đây là nền tảng của kiến trúc `),r(`strong`,null,`event-driven`),u(`.`)],-1),o(f,{code:l.eventCode,language:`java`},null,8,[`code`])])}var X=f(pe,[[`render`,he],[`__scopeId`,`data-v-0200952d`]]),ge=`@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepo;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UserService userService;

    @Test
    void createUser_shouldReturn_whenValid() {
        when(passwordEncoder.encode("pass123")).thenReturn("encoded");
        when(userRepo.save(any())).thenReturn(entity);

        User result = userService.create(req);

        assertThat(result.getEmail()).isEqualTo("alice@email.com");
        verify(userRepo).save(any());
    }
}`,_e=`@SpringBootTest
@Testcontainers
class UserRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
    }

    @Autowired private UserRepository userRepo;

    @Test
    void findByEmail_shouldReturnUser() {
        userRepo.save(new User(null, "Alice", "alice@email.com"));
        Optional<User> result = userRepo.findByEmail("alice@email.com");
        assertThat(result).isPresent();
    }
}`,ve={name:`SpringSectionTest`,components:{CodeBlock:h},data(){return{unitTestCode:ge,integrationTestCode:_e}}},ye={class:`ss-section`};function be(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,ye,[i[0]||=d(`<h3 data-v-d45a1664>Các loại test — kiểm tra ở đúng tầng</h3><div class="cards-grid cols-4" data-v-d45a1664><div class="info-card" data-v-d45a1664><h4 data-v-d45a1664>Unit Test</h4><p data-v-d45a1664>Test 1 class độc lập, mock dependencies. Nhanh nhất, chạy mỗi lần commit. @ExtendWith(MockitoExtension.class).</p></div><div class="info-card" data-v-d45a1664><h4 data-v-d45a1664>Integration Test</h4><p data-v-d45a1664>Test tầng repository với DB thật. @DataJpaTest + Testcontainers.</p></div><div class="info-card" data-v-d45a1664><h4 data-v-d45a1664>Web Layer Test</h4><p data-v-d45a1664>@WebMvcTest — chỉ tầng controller, mock service — test HTTP + JSON serialize.</p></div><div class="info-card" data-v-d45a1664><h4 data-v-d45a1664>Full Integration</h4><p data-v-d45a1664>@SpringBootTest + Testcontainers — test từ controller đến DB. Chậm nhất, chạy trước khi release.</p></div></div><p class="section-text" data-v-d45a1664><strong data-v-d45a1664>Chiến lược thực tế:</strong> đa số là unit test (nhanh, rẻ), vài integration test cho repository/controller, số ít full flow. Kim tự tháp test — càng lên cao càng ít, càng xuống dưới càng nhiều.</p><h3 data-v-d45a1664>Unit Test với Mockito — test logic không cần DB</h3><p class="section-text" data-v-d45a1664><code data-v-d45a1664>@Mock</code> tạo &quot;bản sao giả&quot; của dependency (không chạm DB thật), <code data-v-d45a1664>@InjectMocks</code> đưa chúng vào class cần test. Kiểm tra: kết quả trả về đúng (<code data-v-d45a1664>assertThat</code>) và method được gọi đúng (<code data-v-d45a1664>verify</code>). Chạy trong mili-giây, lặp lại vô tận.</p>`,5),o(p,{code:l.unitTestCode,language:`java`},null,8,[`code`]),i[1]||=r(`h3`,null,`Integration Test với Testcontainers — DB thật nhưng tạm thời`,-1),i[2]||=r(`p`,{class:`section-text`},[r(`strong`,null,`Testcontainers`),u(` khởi động PostgreSQL thật trong Docker cho mỗi lần test — dữ liệu sạch, không phụ thuộc máy dev, không ô nhiễm DB thật. Bắt được lỗi mà mock bỏ sót: SQL sai, mapping Entity lệch schema, constraint vi phạm.`)],-1),o(p,{code:l.integrationTestCode,language:`java`},null,8,[`code`])])}var Z=f(ve,[[`render`,be],[`__scopeId`,`data-v-d45a1664`]]),xe=`// Service Registry (Eureka Server)
@SpringBootApplication
@EnableEurekaServer
public class ServiceRegistry { }

// Client
@SpringBootApplication
@EnableDiscoveryClient
public class UserService { }`,Se=`@Bean
public RouteLocator customRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("user-service", r -> r.path("/api/users/**")
            .filters(f -> f.circuitBreaker(config -> config
                .setName("userCircuitBreaker")
                .setFallbackUri("forward:/fallback/users")))
            .uri("lb://user-service"))
        .build();
}`,Ce=`# Config Server
@SpringBootApplication
@EnableConfigServer
public class ConfigServer { }

// Config Client — application.yml
spring:
  config:
    import: configserver:http://localhost:8888`,we={name:`SpringSectionCloud`,components:{CodeBlock:h},data(){return{eurekaCode:xe,gatewayCode:Se,configCode:Ce}}},Te={class:`ss-section`};function Ee(n,i,s,c,l,f){let p=e(`CodeBlock`);return t(),a(`div`,Te,[i[0]||=r(`h3`,null,`Service Discovery (Eureka) — các service tìm nhau thế nào?`,-1),i[1]||=r(`p`,{class:`section-text`},[u(`Trong microservices, service chạy ở nhiều instance với IP thay đổi liên tục (scale, deploy). `),r(`strong`,null,`Eureka Server`),u(` là "danh bạ" — mỗi service tự đăng ký (địa chỉ + port) khi khởi động, service khác tra danh bạ để gọi. Không có nó, phải hardcode địa chỉ — vỡ ngay khi scale.`)],-1),o(p,{code:l.eurekaCode,language:`java`},null,8,[`code`]),i[2]||=d(`<h3 data-v-e14e73f1>API Gateway — cửa ngõ duy nhất vào hệ thống</h3><p class="section-text" data-v-e14e73f1><strong data-v-e14e73f1>Gateway</strong> đứng trước mọi service: định tuyến (<code data-v-e14e73f1>/api/users/**</code> → user-service), xác thực, rate limiting, circuit breaker. Client chỉ gọi 1 địa chỉ, không cần biết hệ thống bên trong có bao nhiêu service. <code data-v-e14e73f1>lb://user-service</code> = load balancing qua Eureka.</p><div class="cards-grid cols-2" data-v-e14e73f1><div class="info-card" data-v-e14e73f1><h4 data-v-e14e73f1>Circuit Breaker</h4><p data-v-e14e73f1>Service con chết/đứng → gateway chuyển sang fallback thay vì giữ request chờ — ngăn lỗi leo thang lan cả hệ thống.</p></div><div class="info-card" data-v-e14e73f1><h4 data-v-e14e73f1>Lợi ích thực tế</h4><p data-v-e14e73f1>1 điểm duy nhất để áp security, CORS, logging, monitoring — thay vì lặp ở từng service.</p></div></div>`,3),o(p,{code:l.gatewayCode,language:`java`},null,8,[`code`]),i[3]||=r(`h3`,null,`Spring Cloud Config — cấu hình tập trung`,-1),i[4]||=r(`p`,{class:`section-text`},[u(`Cấu hình (DB url, secret, feature flag) nằm ở `),r(`strong`,null,`1 nơi duy nhất`),u(`, các service pull về khi khởi động. Đổi config không cần sửa code + deploy từng service — chỉ sửa ở Config Server rồi refresh. Tránh tình trạng config nằm rải rác, khác nhau giữa các service.`)],-1),o(p,{code:l.configCode,language:`yaml`},null,8,[`code`]),i[5]||=d(`<h3 data-v-e14e73f1>Best Practices Checklist</h3><ul class="tips-list" data-v-e14e73f1><li data-v-e14e73f1><strong data-v-e14e73f1>Package structure:</strong> controller → service → repository → entity/dto</li><li data-v-e14e73f1><strong data-v-e14e73f1>DTO riêng:</strong> không expose entity ra ngoài</li><li data-v-e14e73f1><strong data-v-e14e73f1>Exception handling:</strong> Global exception handler</li><li data-v-e14e73f1><strong data-v-e14e73f1>Logging:</strong> SLF4J + MDC (traceId, userId)</li><li data-v-e14e73f1><strong data-v-e14e73f1>Transaction:</strong> @Transactional trên service layer</li><li data-v-e14e73f1><strong data-v-e14e73f1>Security:</strong> JWT + HTTPS, không hardcode secret</li><li data-v-e14e73f1><strong data-v-e14e73f1>Monitoring:</strong> Actuator + Micrometer + Prometheus</li></ul>`,2)])}var Q=f(we,[[`render`,Ee],[`__scopeId`,`data-v-e14e73f1`]]),De=[{id:`core`,num:`01`,title:`IoC & Dependency Injection`,component:_},{id:`web`,num:`02`,title:`Spring MVC & REST API`,component:E},{id:`jpa`,num:`03`,title:`JPA & Hibernate`,component:z},{id:`security`,num:`04`,title:`Spring Security & JWT`,component:J},{id:`boot`,num:`05`,title:`Auto-config & Actuator`,component:Y},{id:`async`,num:`06`,title:`Async & Scheduling`,component:X},{id:`test`,num:`07`,title:`Testing`,component:Z},{id:`cloud`,num:`08`,title:`Spring Cloud & Microservices`,component:Q}],Oe={name:`SpringSectionPage`,components:{SectionCore:_,SectionWeb:E,SectionJpa:z,SectionSecurity:J,SectionBoot:Y,SectionAsync:X,SectionTest:Z,SectionCloud:Q},data(){return{sections:De}},computed:{currentId(){return this.$route.params.sectionId},current(){return this.sections.find(e=>e.id===this.currentId)||null},currentComponent(){return this.current?this.current.component:null},currentTitle(){return this.current?this.current.title:``},currentNum(){return this.current?this.current.num:``},currentIndex(){return this.sections.findIndex(e=>e.id===this.currentId)},prev(){let e=this.currentIndex;return e>0?this.sections[e-1]:null},next(){let e=this.currentIndex;return e>=0&&e<this.sections.length-1?this.sections[e+1]:null},prevTitle(){return this.prev?this.prev.title:``},nextTitle(){return this.next?this.next.title:``}},mounted(){this.ensureValid()},watch:{"$route.params.sectionId"(){this.ensureValid()}},methods:{ensureValid(){this.current?window.scrollTo({top:0,behavior:`smooth`}):m(`/java/spring-boot/core`,{target:`router`})},handleNav(e){m(e)},goTo(e){m(`/java/spring-boot/${e}`,{target:`router`})}}},ke={class:`spring-section-page`},Ae={class:`page-header`},je={class:`header-content`},Me={class:`header-nav`},Ne={class:`page-content`},Pe={class:`sidebar-toc`},Fe={class:`toc-container`},Ie={class:`toc-nav`},Le=[`onClick`],Re={class:`toc-num`},ze={class:`toc-text`},Be={class:`main-content`},Ve={class:`content-section`},$={class:`section-header`},He={class:`section-num`},Ue={class:`section-title`},We={class:`section-body`},Ge={class:`pager`},Ke=[`disabled`],qe=[`disabled`];function Je(e,o,u,d,f,m){return t(),a(`div`,ke,[r(`header`,Ae,[r(`div`,je,[r(`div`,Me,[r(`button`,{class:`nav-btn`,onClick:o[0]||=e=>m.handleNav(`/java/hub`)},[...o[4]||=[r(`span`,null,`←`,-1),r(`span`,null,`Java`,-1)]]),r(`button`,{class:`nav-btn`,onClick:o[1]||=e=>m.handleNav(`/`)},[...o[5]||=[r(`span`,null,`🏠`,-1),r(`span`,null,`Trang chủ`,-1)]])]),o[6]||=r(`div`,{class:`header-title`},[r(`h1`,null,`🍃 Spring Boot`),r(`p`,{class:`desc`},`Từ IoC/DI đến Microservices — code mẫu, kiến trúc, best practices`)],-1)])]),r(`div`,Ne,[r(`aside`,Pe,[r(`div`,Fe,[o[7]||=r(`h3`,{class:`toc-title`},`Các bài học`,-1),r(`nav`,Ie,[(t(!0),a(s,null,n(f.sections,e=>(t(),a(`a`,{key:e.id,href:`#`,class:i([`toc-link`,{active:e.id===m.currentId}]),onClick:ee(t=>m.goTo(e.id),[`prevent`])},[r(`span`,Re,p(e.num)+`.`,1),r(`span`,ze,p(e.title),1)],10,Le))),128))])])]),r(`main`,Be,[r(`section`,Ve,[r(`div`,$,[r(`span`,He,p(m.currentNum),1),r(`h2`,Ue,p(m.currentTitle),1)]),r(`div`,We,[(t(),l(c(m.currentComponent)))])]),r(`div`,Ge,[r(`button`,{class:`pager-btn`,disabled:!m.prev,onClick:o[2]||=e=>m.goTo(m.prev.id)},` ← `+p(m.prevTitle),9,Ke),r(`button`,{class:`pager-btn next`,disabled:!m.next,onClick:o[3]||=e=>m.goTo(m.next.id)},p(m.nextTitle)+` → `,9,qe)])])])])}var Ye=f(Oe,[[`render`,Je],[`__scopeId`,`data-v-2be5286a`]]);export{Ye as default};