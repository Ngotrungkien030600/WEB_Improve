import{D as e,I as t,O as n,P as r,S as i,T as a,_ as o,b as s,f as c,g as l,i as u,p as ee,w as d,x as f,y as p}from"./index-BlMSFQPt.js";import{t as m}from"./navigate-C5CJziDD.js";import{t as h}from"./CodeBlock-Vgh0XATd.js";var g=`// 1. Field injection (không khuyến nghị — khó test)
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
}`,_=`@Component
@Scope("singleton")  // Mặc định — 1 instance cho toàn app
@Scope("prototype")  // Tạo mới mỗi lần getBean/inject
@Scope("request")    // 1 instance cho 1 HTTP request (Web)
@Scope("session")    // 1 instance cho 1 HTTP session
@Scope("application")// 1 instance cho ServletContext`,te=`// Nhiều bean cùng type — chọn 1
@Primary
@Service
public class VnpayPayment implements PaymentService { }

@Qualifier("paypal")
@Service
public class PaypalPayment implements PaymentService { }

// Khi inject
public OrderService(@Qualifier("paypal") PaymentService payment) { }`,ne={name:`SpringSectionCore`,components:{CodeBlock:h},data(){return{iocCode:g,scopeCode:_,qualifierCode:te}}},re={class:`ss-section`};function ie(t,n,r,a,o,c){let u=e(`CodeBlock`);return d(),p(`div`,re,[n[0]||=s(`<h3 data-v-6e7c5db6>IoC Container là gì?</h3><p class="section-text" data-v-6e7c5db6>IoC Container (ApplicationContext) quản lý vòng đời của beans — tạo, cấu hình, inject dependencies. Thay vì tự tạo object (<code data-v-6e7c5db6>new UserService()</code>), bạn để Spring quản lý và inject khi cần.</p><h3 data-v-6e7c5db6>Các cách inject — chọn cái nào?</h3><div class="cards-grid cols-2" data-v-6e7c5db6><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>1. Field injection (@Autowired)</h4><p data-v-6e7c5db6>Ngắn gọn nhưng <strong data-v-6e7c5db6>khó test</strong> — không inject được dependency khác khi viết unit test, phải dùng reflection.</p></div><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>2. Constructor injection (khuyến nghị)</h4><p data-v-6e7c5db6>Biến dependency thành <code data-v-6e7c5db6>final</code> — bắt buộc cung cấp khi tạo object. <strong data-v-6e7c5db6>Dễ test, bất biến, tự detect vòng phụ thuộc.</strong> Spring khuyến nghị đây là chuẩn duy nhất.</p></div><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>3. Setter injection</h4><p data-v-6e7c5db6>Dùng khi dependency <strong data-v-6e7c5db6>tùy chọn</strong> hoặc cần thay đổi runtime. Ít dùng trong thực tế.</p></div><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>Quy tắc thực tế</h4><p data-v-6e7c5db6>Trong project thật, hầu hết bean dùng constructor injection. Khi có 1 constructor, Spring tự inject — không cần viết <code data-v-6e7c5db6>@Autowired</code>.</p></div></div>`,4),i(u,{code:o.iocCode,language:`java`},null,8,[`code`]),n[1]||=s(`<h3 data-v-6e7c5db6>@Component vs @Bean</h3><div class="cards-grid cols-2" data-v-6e7c5db6><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>@Component (@Service, @Repository, @Controller)</h4><p data-v-6e7c5db6>Dùng cho class tự viết. Spring scan package → tạo bean tự động.</p></div><div class="info-card" data-v-6e7c5db6><h4 data-v-6e7c5db6>@Bean</h4><p data-v-6e7c5db6>Dùng trong @Configuration class cho third-party classes (DataSource, RestTemplate).</p></div></div><h3 data-v-6e7c5db6>Bean Scopes — mỗi bean sống bao lâu?</h3><p class="section-text" data-v-6e7c5db6>Scope quyết định <strong data-v-6e7c5db6>số instance</strong> của một bean tồn tại trong app. Chọn sai scope là nguồn gốc của nhiều bug khó tìm: state dùng chung bất ngờ giữa các request, hoặc bean chứa state không thread-safe.</p>`,4),i(u,{code:o.scopeCode,language:`java`},null,8,[`code`]),n[2]||=l(`h3`,null,`@Primary & @Qualifier — khi có nhiều bean cùng loại`,-1),n[3]||=l(`p`,{class:`section-text`},[f(`Khi 2 bean cùng implement một interface (VD: 2 cổng thanh toán VNPay và PayPal), Spring không biết inject cái nào → báo lỗi. `),l(`code`,null,`@Primary`),f(` chọn mặc định, `),l(`code`,null,`@Qualifier`),f(` chọn theo tên khi cần bean khác — tránh sửa code mỗi lần đổi cổng thanh toán.`)],-1),i(u,{code:o.qualifierCode,language:`java`},null,8,[`code`])])}var v=u(ne,[[`render`,ie],[`__scopeId`,`data-v-6e7c5db6`]]),y=`@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> getAll(@RequestParam(defaultValue = "0") int page) {
        return userService.findAll(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<User> create(@Valid @RequestBody UserCreateRequest req) {
        User created = userService.create(req);
        return ResponseEntity.created(URI.create("/api/users/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest req) {
        return userService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}`,b=`@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
            .stream().map(e -> e.getField() + ": " + e.getDefaultMessage()).collect(Collectors.toList());
        return ResponseEntity.badRequest().body(new ErrorResponse("VALIDATION_FAILED", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        return ResponseEntity.status(500).body(new ErrorResponse("INTERNAL_ERROR", "Có lỗi xảy ra"));
    }
}`,x=`public record UserCreateRequest(
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 100)
    String name,

    @NotBlank @Email
    String email,

    @Pattern(regexp = "^(0|\\+84)[3-9][0-9]{8}$", message = "SĐT không hợp lệ")
    String phone
) {}`,S={name:`SpringSectionWeb`,components:{CodeBlock:h},data(){return{restControllerCode:y,exceptionCode:b,dtoCode:x}}},C={class:`ss-section`};function w(t,n,r,a,o,c){let l=e(`CodeBlock`);return d(),p(`div`,C,[n[0]||=s(`<h3 data-v-d94ff40f>Luồng xử lý request</h3><div class="diagram" data-v-d94ff40f> Request → DispatcherServlet → HandlerMapping → Controller → Service → Repository → DB<br data-v-d94ff40f> → ResponseEntity ← JSON ← </div><h3 data-v-d94ff40f>REST Controller là gì?</h3><p class="section-text" data-v-d94ff40f><code data-v-d94ff40f>@RestController</code> = <code data-v-d94ff40f>@Controller</code> + <code data-v-d94ff40f>@ResponseBody</code> — mỗi method ánh xạ một HTTP request (GET/POST/PUT/DELETE) và trả về dữ liệu dạng <strong data-v-d94ff40f>JSON</strong> (không phải view HTML). Đây là nơi tiếp nhận request, gọi xuống Service, rồi trả response cho client.</p><div class="cards-grid cols-2" data-v-d94ff40f><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>@GetMapping / @PostMapping / @PutMapping / @DeleteMapping</h4><p data-v-d94ff40f>Ánh xạ method tới HTTP verb + URL. CRUD chuẩn: GET đọc, POST tạo, PUT sửa, DELETE xóa.</p></div><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>@PathVariable vs @RequestParam</h4><p data-v-d94ff40f><code data-v-d94ff40f>@PathVariable</code> lấy giá trị trong URL (<code data-v-d94ff40f>/users/123</code>). <code data-v-d94ff40f>@RequestParam</code> lấy từ query string (<code data-v-d94ff40f>?page=0</code>).</p></div><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>@RequestBody</h4><p data-v-d94ff40f>Đọc JSON từ body request, tự deserialize thành object Java — kèm <code data-v-d94ff40f>@Valid</code> để validate trước khi vào business logic.</p></div><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>ResponseEntity</h4><p data-v-d94ff40f>Trả về response kèm HTTP status code chuẩn: <code data-v-d94ff40f>200 OK</code>, <code data-v-d94ff40f>201 Created</code>, <code data-v-d94ff40f>204 No Content</code>, <code data-v-d94ff40f>404</code>... — giúp client hiểu kết quả mà không cần đoán.</p></div></div><p class="section-text" data-v-d94ff40f><strong data-v-d94ff40f>Thực tế áp dụng:</strong> Đây là chuẩn giao tiếp giữa frontend (SPA/React/Vue) hoặc mobile app với backend. Trả về <code data-v-d94ff40f>201 Created</code> kèm URI của resource mới (thay vì 200) giúp client có thể GET lại resource đó — đúng nguyên tắc RESTful và dễ maintain khi API lớn.</p>`,6),i(l,{code:o.restControllerCode,language:`java`},null,8,[`code`]),n[1]||=s(`<h3 data-v-d94ff40f>Exception Handling — tại sao cần?</h3><p class="section-text" data-v-d94ff40f>Nếu không xử lý tập trung, mỗi lỗi sẽ trả về <strong data-v-d94ff40f>stacktrace hoặc lỗi 500 mặc định</strong> — khó hiểu với client và lộ chi tiết nội bộ. <code data-v-d94ff40f>@RestControllerAdvice</code> gom toàn bộ xử lý lỗi vào <strong data-v-d94ff40f>một nơi duy nhất</strong>: bắt exception, chuyển thành <code data-v-d94ff40f>ErrorResponse</code> JSON với mã lỗi + message rõ ràng.</p><div class="cards-grid cols-2" data-v-d94ff40f><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>@ExceptionHandler(ResourceNotFoundException.class)</h4><p data-v-d94ff40f>Bắt lỗi &quot;không tìm thấy&quot; → trả <code data-v-d94ff40f>404 NOT_FOUND</code>. Client biết resource không tồn tại.</p></div><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>@ExceptionHandler(MethodArgumentNotValidException.class)</h4><p data-v-d94ff40f>Bắt lỗi validate từ <code data-v-d94ff40f>@Valid</code> → trả <code data-v-d94ff40f>400</code> kèm <strong data-v-d94ff40f>danh sách field lỗi cụ thể</strong> (field nào, message gì) — UI hiển thị ngay dưới từng ô input.</p></div><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>@ExceptionHandler(Exception.class)</h4><p data-v-d94ff40f>Handler cuối cùng bắt mọi lỗi còn lại → <code data-v-d94ff40f>500</code> với message chung chung, <strong data-v-d94ff40f>không lộ chi tiết nội bộ</strong>. Chi tiết thật đi vào log server.</p></div><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>Lợi ích thực tế</h4><p data-v-d94ff40f>API contract ổn định (client luôn nhận <code data-v-d94ff40f>{ code, message }</code>), log tập trung, dễ thêm monitoring/alerting khi lỗi xảy ra.</p></div></div>`,3),i(l,{code:o.exceptionCode,language:`java`},null,8,[`code`]),n[2]||=s(`<h3 data-v-d94ff40f>DTO &amp; Validation — vì sao không trả thẳng Entity?</h3><p class="section-text" data-v-d94ff40f><strong data-v-d94ff40f>DTO (Data Transfer Object)</strong> là object trung gian chuyên chở dữ liệu vào/ra API. Trả thẳng Entity ra ngoài rất rủi ro: lộ các field nhạy cảm (password, token), và khi Entity thay đổi thì API contract cũng vỡ theo.</p><div class="cards-grid cols-2" data-v-d94ff40f><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>An toàn</h4><p data-v-d94ff40f>Chỉ expose đúng field cần thiết cho client — không lộ password, internal fields. Tách request DTO (đầu vào) và response DTO (đầu ra) khi cần.</p></div><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>Validate tại biên giới</h4><p data-v-d94ff40f>Dữ liệu sai bị chặn ngay khi vào hệ thống bằng <code data-v-d94ff40f>@NotBlank</code>, <code data-v-d94ff40f>@Email</code>, <code data-v-d94ff40f>@Size</code>, <code data-v-d94ff40f>@Pattern</code> — không để dữ liệu rác lọt xuống DB.</p></div><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>API contract ổn định</h4><p data-v-d94ff40f>Entity đổi (thêm cột) không làm hỏng API. DTO dùng <code data-v-d94ff40f>record</code> (Java 16+) — gọn, immutable, tự sinh getter/constructor.</p></div><div class="info-card" data-v-d94ff40f><h4 data-v-d94ff40f>Thực tế áp dụng</h4><p data-v-d94ff40f>Số điện thoại Việt Nam validate bằng regex <code data-v-d94ff40f>^(0|\\+84)[3-9][0-9]{8}$</code> — chặn format sai ngay từ đầu thay vì phải sửa dữ liệu sau này.</p></div></div>`,3),i(l,{code:o.dtoCode,language:`java`},null,8,[`code`])])}var T=u(S,[[`render`,w],[`__scopeId`,`data-v-d94ff40f`]]),E=`@Entity
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
}`,D=`public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
    Optional<User> findByIdWithOrders(@Param("id") Long id);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date, @Param("status") String status);
}`,O=`// Fix 1: JOIN FETCH
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
}`,k={name:`SpringSectionJpa`,components:{CodeBlock:h},data(){return{entityCode:E,repositoryCode:D,n1Code:O}}},A={class:`ss-section`};function j(t,n,r,a,o,c){let u=e(`CodeBlock`);return d(),p(`div`,A,[n[0]||=l(`h3`,null,`Entity & Relationships — ánh xạ bảng DB thành object`,-1),n[1]||=l(`p`,{class:`section-text`},[l(`code`,null,`@Entity`),f(` đánh dấu class ánh xạ tới 1 bảng, mỗi field là 1 cột. Quan hệ quan trọng nhất: `),l(`code`,null,`@OneToMany`),f(` (1 user → nhiều order) và `),l(`code`,null,`@ManyToMany`),f(` (user ↔ role) qua bảng trung gian `),l(`code`,null,`user_roles`),f(`. Chọn đúng quan hệ + cascade quyết định cách Hibernate sinh SQL và quản lý dữ liệu liên quan.`)],-1),i(u,{code:o.entityCode,language:`java`},null,8,[`code`]),n[2]||=l(`h3`,null,`Repository — Spring Data JPA sinh sẵn query`,-1),n[3]||=l(`p`,{class:`section-text`},[l(`code`,null,`JpaRepository`),f(` cung cấp sẵn CRUD + paging (findAll, save, findById...). Chỉ cần `),l(`strong`,null,`khai báo method theo quy ước tên`),f(` (`),l(`code`,null,`findByEmail`),f(`) Spring tự implement. `),l(`code`,null,`@Query`),f(` dùng khi cần JPQL tùy biến — kèm `),l(`code`,null,`@Modifying`),f(` cho lệnh UPDATE/DELETE.`)],-1),i(u,{code:o.repositoryCode,language:`java`},null,8,[`code`]),n[4]||=s(`<h3 data-v-1a64ab5a>N+1 Problem — cái bẫy hiệu năng kinh điển</h3><p class="section-text" data-v-1a64ab5a><strong data-v-1a64ab5a>N+1</strong>: lấy danh sách N record, rồi mỗi record lại query thêm quan hệ → tổng <strong data-v-1a64ab5a>N+1 queries</strong> thay vì 1. Gây chậm rõ rệt khi dữ liệu lớn (1000 users → 1001 queries). Đây là lỗi hiệu năng phổ biến nhất khi dùng JPA, thường bị phát hiện muộn ở production.</p><div class="cards-grid cols-2" data-v-1a64ab5a><div class="info-card" data-v-1a64ab5a><h4 data-v-1a64ab5a>Fix 1: JOIN FETCH</h4><p data-v-1a64ab5a>Gộp 1 query lấy luôn dữ liệu quan hệ. Hiệu quả cho truy vấn cố định.</p></div><div class="info-card" data-v-1a64ab5a><h4 data-v-1a64ab5a>Fix 2: @EntityGraph</h4><p data-v-1a64ab5a>Khai báo eager load các quan hệ theo tên — tái sử dụng được với nhiều query.</p></div><div class="info-card" data-v-1a64ab5a><h4 data-v-1a64ab5a>Fix 3: @BatchSize</h4><p data-v-1a64ab5a>Gom N quan hệ vào 1 query IN (...). Giảm số query mà không phải sửa từng truy vấn.</p></div><div class="info-card" data-v-1a64ab5a><h4 data-v-1a64ab5a>Kiểm tra thực tế</h4><p data-v-1a64ab5a>Bật <code data-v-1a64ab5a>spring.jpa.show-sql</code> hoặc Hibernate Stats khi test — đếm số query phát sinh, bắt N+1 trước khi lên production.</p></div></div>`,3),i(u,{code:o.n1Code,language:`java`},null,8,[`code`])])}var M=u(k,[[`render`,j],[`__scopeId`,`data-v-1a64ab5a`]]),N=`@Configuration
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
}`,P=`@Component
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
}`,F=`@Bean
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
}`,I={name:`SpringSectionSecurity`,components:{CodeBlock:h},data(){return{securityConfigCode:N,jwtFilterCode:P,corsCode:F}}},L={class:`ss-section`};function R(t,n,r,a,o,c){let u=e(`CodeBlock`);return d(),p(`div`,L,[n[0]||=s(`<h3 data-v-1b95e454>SecurityFilterChain — bức tường trước mọi request</h3><p class="section-text" data-v-1b95e454>Đây là cấu hình trung tâm của Spring Security: quyết định <strong data-v-1b95e454>request nào được phép, request nào phải xác thực</strong>. Với API stateless (SPA/React/Vue), ta tắt CSRF + session, và đặt JWT filter trước khi Spring xử lý username/password.</p><div class="cards-grid cols-2" data-v-1b95e454><div class="info-card" data-v-1b95e454><h4 data-v-1b95e454>permitAll()</h4><p data-v-1b95e454>Không cần đăng nhập: <code data-v-1b95e454>/api/auth/**</code> (đăng ký, đăng nhập) và <code data-v-1b95e454>/actuator/health</code>.</p></div><div class="info-card" data-v-1b95e454><h4 data-v-1b95e454>hasRole(&quot;ADMIN&quot;)</h4><p data-v-1b95e454>Chỉ user có role ADMIN mới vào được <code data-v-1b95e454>/api/admin/**</code> — phân quyền theo role.</p></div><div class="info-card" data-v-1b95e454><h4 data-v-1b95e454>anyRequest().authenticated()</h4><p data-v-1b95e454>Mọi request còn lại phải có token hợp lệ. Nguyên tắc <strong data-v-1b95e454>deny by default</strong> — an toàn hơn allow tất cả.</p></div><div class="info-card" data-v-1b95e454><h4 data-v-1b95e454>STATELESS</h4><p data-v-1b95e454>Không lưu session server — mỗi request tự mang token (JWT). Cần thiết để scale ngang nhiều instance mà không mất phiên đăng nhập.</p></div></div>`,3),i(u,{code:o.securityConfigCode,language:`java`},null,8,[`code`]),n[1]||=l(`h3`,null,`JWT Filter — xác thực từng request`,-1),n[2]||=l(`p`,{class:`section-text`},[f(`Mỗi request gửi kèm header `),l(`code`,null,`Authorization: Bearer <token>`),f(`. Filter này: lấy token → `),l(`strong`,null,`xác minh chữ ký`),f(` (tránh token giả) → nạp user + quyền vào `),l(`code`,null,`SecurityContext`),f(` để các endpoint khác dùng. Token lỗi/sai chữ ký → trả `),l(`code`,null,`401`),f(` ngay.`)],-1),i(u,{code:o.jwtFilterCode,language:`java`},null,8,[`code`]),n[3]||=s(`<h3 data-v-1b95e454>Password Encoding &amp; CORS</h3><p class="section-text" data-v-1b95e454><strong data-v-1b95e454>BCrypt</strong> mã hóa password 1 chiều (kèm salt) — không bao giờ lưu password dạng plaintext, kể cả khi DB bị lộ. <strong data-v-1b95e454>CORS</strong> cho phép frontend ở domain khác (VD: <code data-v-1b95e454>localhost:3000</code>) gọi API — nếu thiếu, trình duyệt chặn request.</p><div class="cards-grid cols-2" data-v-1b95e454><div class="info-card" data-v-1b95e454><h4 data-v-1b95e454>BCryptPasswordEncoder</h4><p data-v-1b95e454>Thuật toán hash mạnh, tự sinh salt mỗi lần hash — 2 lần hash cùng password cho 2 chuỗi khác nhau, chống rainbow table.</p></div><div class="info-card" data-v-1b95e454><h4 data-v-1b95e454>CORS đúng cách</h4><p data-v-1b95e454>Chỉ allow đúng origin thật (không dùng <code data-v-1b95e454>*</code> khi có credentials), giới hạn method + header cần thiết.</p></div></div>`,3),i(u,{code:o.corsCode,language:`java`},null,8,[`code`])])}var z=u(I,[[`render`,R],[`__scopeId`,`data-v-1b95e454`]]),B=`# application.yml
management:
  endpoints.web.exposure.include: health,info,metrics
  endpoint.health.show-details: when-authorized`,V={name:`SpringSectionBoot`,components:{CodeBlock:h},data(){return{actuatorCode:B}}},H={class:`ss-section`};function U(t,n,r,a,o,c){let l=e(`CodeBlock`);return d(),p(`div`,H,[n[0]||=s(`<h3 data-v-4b1d0e45>Auto-configuration — vì sao chạy được ngay không cần cấu hình?</h3><p class="section-text" data-v-4b1d0e45>Thêm dependency (VD: spring-boot-starter-data-jpa) vào classpath, Spring Boot <strong data-v-4b1d0e45>tự phát hiện và cấu hình</strong> DataSource, EntityManager... Mỗi auto-config class chỉ hoạt động khi điều kiện đúng (<code data-v-4b1d0e45>@ConditionalOnClass</code>, <code data-v-4b1d0e45>@ConditionalOnMissingBean</code>) — đó là lý do app khởi động được ngay mà không cần config thủ công.</p><h3 data-v-4b1d0e45>Actuator — &quot;nhịp tim&quot; của ứng dụng</h3><p class="section-text" data-v-4b1d0e45><strong data-v-4b1d0e45>Actuator</strong> expose các endpoint giám sát app đang chạy: sức khỏe, metrics, môi trường. Đây là nền tảng để <strong data-v-4b1d0e45>Prometheus/Grafana scrape dữ liệu</strong> và Kubernetes health check — không có nó, team vận hành không biết app còn sống hay sắp chết.</p><div class="cards-grid cols-4" data-v-4b1d0e45><div class="info-card" data-v-4b1d0e45><h4 data-v-4b1d0e45>/actuator/health</h4><p data-v-4b1d0e45>Health check DB, disk, custom components — Kubernetes dùng để biết pod còn nhận traffic không.</p></div><div class="info-card" data-v-4b1d0e45><h4 data-v-4b1d0e45>/actuator/metrics</h4><p data-v-4b1d0e45>JVM (heap, thread, GC), HTTP request count/latency — nguồn cho Prometheus + Grafana dashboard.</p></div><div class="info-card" data-v-4b1d0e45><h4 data-v-4b1d0e45>/actuator/info</h4><p data-v-4b1d0e45>Custom info (version, build time, git commit) — biết chính xác build nào đang chạy.</p></div><div class="info-card" data-v-4b1d0e45><h4 data-v-4b1d0e45>/actuator/env</h4><p data-v-4b1d0e45>Environment properties (cần bảo vệ — có thể lộ secret).</p></div></div>`,5),i(l,{code:o.actuatorCode,language:`yaml`},null,8,[`code`])])}var W=u(V,[[`render`,U],[`__scopeId`,`data-v-4b1d0e45`]]),G=`@Configuration
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
}`,K=`@Configuration
@EnableScheduling
public class SchedulingConfig {}

@Component
public class CleanupJob {
    // Mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanExpiredTokens() {
        tokenRepository.deleteExpired(LocalDateTime.now());
    }
}`,q=`// Event
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
}`,J={name:`SpringSectionAsync`,components:{CodeBlock:h},data(){return{asyncCode:G,scheduledCode:K,eventCode:q}}},Y={class:`ss-section`};function ae(t,n,r,a,o,s){let c=e(`CodeBlock`);return d(),p(`div`,Y,[n[0]||=l(`h3`,null,`@Async — chạy nền, không chặn response`,-1),n[1]||=l(`p`,{class:`section-text`},[l(`code`,null,`@Async`),f(` đẩy method chạy vào `),l(`strong`,null,`thread pool riêng`),f(`, trả response ngay lập tức. Áp dụng cho tác vụ chậm không cần đợi kết quả: gửi email welcome, gọi webhook, xử lý file. `),l(`strong`,null,`Bẫy phổ biến:`),f(` gọi @Async method từ bên trong cùng class sẽ không có tác dụng (proxy không đi qua).`)],-1),i(c,{code:o.asyncCode,language:`java`},null,8,[`code`]),n[2]||=l(`h3`,null,`@Scheduled — chạy tự động theo lịch`,-1),n[3]||=l(`p`,{class:`section-text`},[f(`Tác vụ định kỳ như dọn dữ liệu cũ, gửi báo cáo, chạy backup. Cron `),l(`code`,null,`0 0 2 * * ?`),f(` = mỗi ngày lúc 2h sáng. Khi chạy nhiều instance, cần khóa phân tán (ShedLock, Quartz) để tránh `),l(`strong`,null,`nhiều instance chạy cùng lúc`),f(`.`)],-1),i(c,{code:o.scheduledCode,language:`java`},null,8,[`code`]),n[4]||=l(`h3`,null,`@EventListener — tách rời các module`,-1),n[5]||=l(`p`,{class:`section-text`},[f(`Publisher `),l(`strong`,null,`phát event`),f(`, listener `),l(`strong`,null,`lắng nghe và xử lý`),f(` — hai module không biết về nhau. VD: UserService tạo user xong phát `),l(`code`,null,`UserCreatedEvent`),f(`, module email/notification tự phản ứng. Kết hợp `),l(`code`,null,`@Async`),f(` để không làm chậm luồng chính. Đây là nền tảng của kiến trúc `),l(`strong`,null,`event-driven`),f(`.`)],-1),i(c,{code:o.eventCode,language:`java`},null,8,[`code`])])}var X=u(J,[[`render`,ae],[`__scopeId`,`data-v-0200952d`]]),oe=`@ExtendWith(MockitoExtension.class)
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
}`,se=`@SpringBootTest
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
}`,ce={name:`SpringSectionTest`,components:{CodeBlock:h},data(){return{unitTestCode:oe,integrationTestCode:se}}},le={class:`ss-section`};function ue(t,n,r,a,o,c){let u=e(`CodeBlock`);return d(),p(`div`,le,[n[0]||=s(`<h3 data-v-d45a1664>Các loại test — kiểm tra ở đúng tầng</h3><div class="cards-grid cols-4" data-v-d45a1664><div class="info-card" data-v-d45a1664><h4 data-v-d45a1664>Unit Test</h4><p data-v-d45a1664>Test 1 class độc lập, mock dependencies. Nhanh nhất, chạy mỗi lần commit. @ExtendWith(MockitoExtension.class).</p></div><div class="info-card" data-v-d45a1664><h4 data-v-d45a1664>Integration Test</h4><p data-v-d45a1664>Test tầng repository với DB thật. @DataJpaTest + Testcontainers.</p></div><div class="info-card" data-v-d45a1664><h4 data-v-d45a1664>Web Layer Test</h4><p data-v-d45a1664>@WebMvcTest — chỉ tầng controller, mock service — test HTTP + JSON serialize.</p></div><div class="info-card" data-v-d45a1664><h4 data-v-d45a1664>Full Integration</h4><p data-v-d45a1664>@SpringBootTest + Testcontainers — test từ controller đến DB. Chậm nhất, chạy trước khi release.</p></div></div><p class="section-text" data-v-d45a1664><strong data-v-d45a1664>Chiến lược thực tế:</strong> đa số là unit test (nhanh, rẻ), vài integration test cho repository/controller, số ít full flow. Kim tự tháp test — càng lên cao càng ít, càng xuống dưới càng nhiều.</p><h3 data-v-d45a1664>Unit Test với Mockito — test logic không cần DB</h3><p class="section-text" data-v-d45a1664><code data-v-d45a1664>@Mock</code> tạo &quot;bản sao giả&quot; của dependency (không chạm DB thật), <code data-v-d45a1664>@InjectMocks</code> đưa chúng vào class cần test. Kiểm tra: kết quả trả về đúng (<code data-v-d45a1664>assertThat</code>) và method được gọi đúng (<code data-v-d45a1664>verify</code>). Chạy trong mili-giây, lặp lại vô tận.</p>`,5),i(u,{code:o.unitTestCode,language:`java`},null,8,[`code`]),n[1]||=l(`h3`,null,`Integration Test với Testcontainers — DB thật nhưng tạm thời`,-1),n[2]||=l(`p`,{class:`section-text`},[l(`strong`,null,`Testcontainers`),f(` khởi động PostgreSQL thật trong Docker cho mỗi lần test — dữ liệu sạch, không phụ thuộc máy dev, không ô nhiễm DB thật. Bắt được lỗi mà mock bỏ sót: SQL sai, mapping Entity lệch schema, constraint vi phạm.`)],-1),i(u,{code:o.integrationTestCode,language:`java`},null,8,[`code`])])}var Z=u(ce,[[`render`,ue],[`__scopeId`,`data-v-d45a1664`]]),de=`// Service Registry (Eureka Server)
@SpringBootApplication
@EnableEurekaServer
public class ServiceRegistry { }

// Client
@SpringBootApplication
@EnableDiscoveryClient
public class UserService { }`,fe=`@Bean
public RouteLocator customRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("user-service", r -> r.path("/api/users/**")
            .filters(f -> f.circuitBreaker(config -> config
                .setName("userCircuitBreaker")
                .setFallbackUri("forward:/fallback/users")))
            .uri("lb://user-service"))
        .build();
}`,pe=`# Config Server
@SpringBootApplication
@EnableConfigServer
public class ConfigServer { }

// Config Client — application.yml
spring:
  config:
    import: configserver:http://localhost:8888`,me={name:`SpringSectionCloud`,components:{CodeBlock:h},data(){return{eurekaCode:de,gatewayCode:fe,configCode:pe}}},he={class:`ss-section`};function ge(t,n,r,a,o,c){let u=e(`CodeBlock`);return d(),p(`div`,he,[n[0]||=l(`h3`,null,`Service Discovery (Eureka) — các service tìm nhau thế nào?`,-1),n[1]||=l(`p`,{class:`section-text`},[f(`Trong microservices, service chạy ở nhiều instance với IP thay đổi liên tục (scale, deploy). `),l(`strong`,null,`Eureka Server`),f(` là "danh bạ" — mỗi service tự đăng ký (địa chỉ + port) khi khởi động, service khác tra danh bạ để gọi. Không có nó, phải hardcode địa chỉ — vỡ ngay khi scale.`)],-1),i(u,{code:o.eurekaCode,language:`java`},null,8,[`code`]),n[2]||=s(`<h3 data-v-e14e73f1>API Gateway — cửa ngõ duy nhất vào hệ thống</h3><p class="section-text" data-v-e14e73f1><strong data-v-e14e73f1>Gateway</strong> đứng trước mọi service: định tuyến (<code data-v-e14e73f1>/api/users/**</code> → user-service), xác thực, rate limiting, circuit breaker. Client chỉ gọi 1 địa chỉ, không cần biết hệ thống bên trong có bao nhiêu service. <code data-v-e14e73f1>lb://user-service</code> = load balancing qua Eureka.</p><div class="cards-grid cols-2" data-v-e14e73f1><div class="info-card" data-v-e14e73f1><h4 data-v-e14e73f1>Circuit Breaker</h4><p data-v-e14e73f1>Service con chết/đứng → gateway chuyển sang fallback thay vì giữ request chờ — ngăn lỗi leo thang lan cả hệ thống.</p></div><div class="info-card" data-v-e14e73f1><h4 data-v-e14e73f1>Lợi ích thực tế</h4><p data-v-e14e73f1>1 điểm duy nhất để áp security, CORS, logging, monitoring — thay vì lặp ở từng service.</p></div></div>`,3),i(u,{code:o.gatewayCode,language:`java`},null,8,[`code`]),n[3]||=l(`h3`,null,`Spring Cloud Config — cấu hình tập trung`,-1),n[4]||=l(`p`,{class:`section-text`},[f(`Cấu hình (DB url, secret, feature flag) nằm ở `),l(`strong`,null,`1 nơi duy nhất`),f(`, các service pull về khi khởi động. Đổi config không cần sửa code + deploy từng service — chỉ sửa ở Config Server rồi refresh. Tránh tình trạng config nằm rải rác, khác nhau giữa các service.`)],-1),i(u,{code:o.configCode,language:`yaml`},null,8,[`code`]),n[5]||=s(`<h3 data-v-e14e73f1>Best Practices Checklist</h3><ul class="tips-list" data-v-e14e73f1><li data-v-e14e73f1><strong data-v-e14e73f1>Package structure:</strong> controller → service → repository → entity/dto</li><li data-v-e14e73f1><strong data-v-e14e73f1>DTO riêng:</strong> không expose entity ra ngoài</li><li data-v-e14e73f1><strong data-v-e14e73f1>Exception handling:</strong> Global exception handler</li><li data-v-e14e73f1><strong data-v-e14e73f1>Logging:</strong> SLF4J + MDC (traceId, userId)</li><li data-v-e14e73f1><strong data-v-e14e73f1>Transaction:</strong> @Transactional trên service layer</li><li data-v-e14e73f1><strong data-v-e14e73f1>Security:</strong> JWT + HTTPS, không hardcode secret</li><li data-v-e14e73f1><strong data-v-e14e73f1>Monitoring:</strong> Actuator + Micrometer + Prometheus</li></ul>`,2)])}var Q=u(me,[[`render`,ge],[`__scopeId`,`data-v-e14e73f1`]]),_e=[{id:`core`,num:`01`,title:`IoC & Dependency Injection`,component:v},{id:`web`,num:`02`,title:`Spring MVC & REST API`,component:T},{id:`jpa`,num:`03`,title:`JPA & Hibernate`,component:M},{id:`security`,num:`04`,title:`Spring Security & JWT`,component:z},{id:`boot`,num:`05`,title:`Auto-config & Actuator`,component:W},{id:`async`,num:`06`,title:`Async & Scheduling`,component:X},{id:`test`,num:`07`,title:`Testing`,component:Z},{id:`cloud`,num:`08`,title:`Spring Cloud & Microservices`,component:Q}],ve={name:`SpringSectionPage`,components:{SectionCore:v,SectionWeb:T,SectionJpa:M,SectionSecurity:z,SectionBoot:W,SectionAsync:X,SectionTest:Z,SectionCloud:Q},data(){return{sections:_e}},computed:{currentId(){return this.$route.params.sectionId},current(){return this.sections.find(e=>e.id===this.currentId)||null},currentComponent(){return this.current?this.current.component:null},currentTitle(){return this.current?this.current.title:``},currentNum(){return this.current?this.current.num:``},currentIndex(){return this.sections.findIndex(e=>e.id===this.currentId)},prev(){let e=this.currentIndex;return e>0?this.sections[e-1]:null},next(){let e=this.currentIndex;return e>=0&&e<this.sections.length-1?this.sections[e+1]:null},prevTitle(){return this.prev?this.prev.title:``},nextTitle(){return this.next?this.next.title:``}},mounted(){this.ensureValid()},watch:{"$route.params.sectionId"(){this.ensureValid()}},methods:{ensureValid(){this.current?window.scrollTo({top:0,behavior:`smooth`}):m(`/java/spring-boot/core`,{target:`router`})},handleNav(e){m(e)},goTo(e){m(`/java/spring-boot/${e}`,{target:`router`})}}},ye={class:`spring-section-page`},be={class:`page-header`},xe={class:`header-content`},Se={class:`header-nav`},Ce={class:`page-content`},we={class:`sidebar-toc`},Te={class:`toc-container`},Ee={class:`toc-nav`},De=[`onClick`],$={class:`toc-num`},Oe={class:`toc-text`},ke={class:`main-content`},Ae={class:`content-section`},je={class:`section-header`},Me={class:`section-num`},Ne={class:`section-title`},Pe={class:`section-body`},Fe={class:`pager`},Ie=[`disabled`],Le=[`disabled`];function Re(e,i,s,u,f,m){return d(),p(`div`,ye,[l(`header`,be,[l(`div`,xe,[l(`div`,Se,[l(`button`,{class:`nav-btn`,onClick:i[0]||=e=>m.handleNav(`/java/hub`)},[...i[4]||=[l(`span`,null,`←`,-1),l(`span`,null,`Java`,-1)]]),l(`button`,{class:`nav-btn`,onClick:i[1]||=e=>m.handleNav(`/`)},[...i[5]||=[l(`span`,null,`🏠`,-1),l(`span`,null,`Trang chủ`,-1)]])]),i[6]||=l(`div`,{class:`header-title`},[l(`h1`,null,`🍃 Spring Boot`),l(`p`,{class:`desc`},`Từ IoC/DI đến Microservices — code mẫu, kiến trúc, best practices`)],-1)])]),l(`div`,Ce,[l(`aside`,we,[l(`div`,Te,[i[7]||=l(`h3`,{class:`toc-title`},`Các bài học`,-1),l(`nav`,Ee,[(d(!0),p(ee,null,a(f.sections,e=>(d(),p(`a`,{key:e.id,href:`#`,class:r([`toc-link`,{active:e.id===m.currentId}]),onClick:c(t=>m.goTo(e.id),[`prevent`])},[l(`span`,$,t(e.num)+`.`,1),l(`span`,Oe,t(e.title),1)],10,De))),128))])])]),l(`main`,ke,[l(`section`,Ae,[l(`div`,je,[l(`span`,Me,t(m.currentNum),1),l(`h2`,Ne,t(m.currentTitle),1)]),l(`div`,Pe,[(d(),o(n(m.currentComponent)))])]),l(`div`,Fe,[l(`button`,{class:`pager-btn`,disabled:!m.prev,onClick:i[2]||=e=>m.goTo(m.prev.id)},` ← `+t(m.prevTitle),9,Ie),l(`button`,{class:`pager-btn next`,disabled:!m.next,onClick:i[3]||=e=>m.goTo(m.next.id)},t(m.nextTitle)+` → `,9,Le)])])])])}var ze=u(ve,[[`render`,Re],[`__scopeId`,`data-v-2be5286a`]]);export{ze as default};