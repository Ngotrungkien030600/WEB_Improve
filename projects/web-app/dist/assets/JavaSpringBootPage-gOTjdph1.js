import{C as e,M as t,N as n,S as r,_ as i,b as ee,g as a,j as te,k as o,l as ne,n as s,p as c,u as re,v as l,x as ie,y as u}from"./index-C_d4KA2F.js";import{t as ae}from"./navigate-BWgxreJa.js";import{t as d}from"./CodeBlock-6P4Dstiz.js";var f={class:`spring-page`},p={class:`page-header`},m={class:`header-content`},h={class:`header-nav`},g={class:`page-content`},_={class:`sidebar-toc`},v={class:`toc-container`},y={class:`toc-nav`},b=[`onClick`],x={class:`toc-num`},S={class:`toc-text`},C={class:`toc-progress`},w={class:`progress-bar`},T={class:`progress-value`},E={class:`main-content`},D={id:`core`,class:`content-section`},O={class:`section-body`},k={id:`web`,class:`content-section`},A={class:`section-body`},j={id:`jpa`,class:`content-section`},M={class:`section-body`},N={id:`security`,class:`content-section`},P={class:`section-body`},F={id:`boot`,class:`content-section`},I={class:`section-body`},L={id:`async`,class:`content-section`},R={class:`section-body`},oe={id:`test`,class:`content-section`},z={class:`section-body`},B={id:`cloud`,class:`content-section`},V={class:`section-body`},H=`// 1. Field injection (không khuyến nghị — khó test)
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
}`,U=`@Component
@Scope("singleton")  // Mặc định — 1 instance cho toàn app
@Scope("prototype")  // Tạo mới mỗi lần getBean/inject
@Scope("request")    // 1 instance cho 1 HTTP request (Web)
@Scope("session")    // 1 instance cho 1 HTTP session
@Scope("application")// 1 instance cho ServletContext`,W=`// Nhiều bean cùng type — chọn 1
@Primary
@Service
public class VnpayPayment implements PaymentService { }

@Qualifier("paypal")
@Service
public class PaypalPayment implements PaymentService { }

// Khi inject
public OrderService(@Qualifier("paypal") PaymentService payment) { }`,G=`@RestController
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
}`,K=`@RestControllerAdvice
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
}`,q=`public record UserCreateRequest(
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 100)
    String name,

    @NotBlank @Email
    String email,

    @Pattern(regexp = "^(0|\\+84)[3-9][0-9]{8}$", message = "SĐT không hợp lệ")
    String phone
) {}`,se=`@Entity
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
}`,ce=`public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
    Optional<User> findByIdWithOrders(@Param("id") Long id);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date, @Param("status") String status);
}`,le=`// Fix 1: JOIN FETCH
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
}`,ue=`@Configuration
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
}`,de=`@Component
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
}`,fe=`@Bean
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
}`,pe=`# application.yml
management:
  endpoints.web.exposure.include: health,info,metrics
  endpoint.health.show-details: when-authorized`,me=`@Configuration
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
}`,he=`@Configuration
@EnableScheduling
public class SchedulingConfig {}

@Component
public class CleanupJob {
    // Mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanExpiredTokens() {
        tokenRepository.deleteExpired(LocalDateTime.now());
    }
}`,ge=`// Event
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
}`,_e=`@ExtendWith(MockitoExtension.class)
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
}`,ve=`@SpringBootTest
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
}`,J=`// Service Registry (Eureka Server)
@SpringBootApplication
@EnableEurekaServer
public class ServiceRegistry { }

// Client
@SpringBootApplication
@EnableDiscoveryClient
public class UserService { }`,ye=`@Bean
public RouteLocator customRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("user-service", r -> r.path("/api/users/**")
            .filters(f -> f.circuitBreaker(config -> config
                .setName("userCircuitBreaker")
                .setFallbackUri("forward:/fallback/users")))
            .uri("lb://user-service"))
        .build();
}`,be=`# Config Server
@SpringBootApplication
@EnableConfigServer
public class ConfigServer { }

// Config Client — application.yml
spring:
  config:
    import: configserver:http://localhost:8888`,Y=s({__name:`JavaSpringBootPage`,setup(s){let Y=[{id:`core`,num:`1`,title:`IoC & DI`},{id:`web`,num:`2`,title:`Spring MVC & REST`},{id:`jpa`,num:`3`,title:`JPA & Hibernate`},{id:`security`,num:`4`,title:`Security & JWT`},{id:`boot`,num:`5`,title:`Auto-config & Actuator`},{id:`async`,num:`6`,title:`Async & Scheduling`},{id:`test`,num:`7`,title:`Testing`},{id:`cloud`,num:`8`,title:`Microservices`}],X=o(``),Z=o(0),Q=e=>ae(e),xe=e=>{let t=document.getElementById(e);t&&t.scrollIntoView({behavior:`smooth`,block:`start`})},$=()=>{let e=window.scrollY,t=document.documentElement.scrollHeight-window.innerHeight;Z.value=t>0?e/t*100:0;for(let e of Y){let t=document.getElementById(e.id);if(t){let n=t.getBoundingClientRect();if(n.top<=150&&n.bottom>150){X.value=e.id;break}}}};return ee(()=>{window.addEventListener(`scroll`,$),$()}),ie(()=>{window.removeEventListener(`scroll`,$)}),(ee,o)=>(r(),a(`div`,f,[c(`header`,p,[c(`div`,m,[c(`div`,h,[c(`button`,{class:`nav-btn`,onClick:o[0]||=e=>Q(`/java/hub`)},[...o[2]||=[c(`span`,null,`←`,-1),c(`span`,null,`Java`,-1)]]),c(`button`,{class:`nav-btn`,onClick:o[1]||=e=>Q(`/`)},[...o[3]||=[c(`span`,null,`🏠`,-1),c(`span`,null,`Trang chủ`,-1)]])]),o[4]||=c(`div`,{class:`header-title`},[c(`h1`,null,`🍃 Spring Boot`),c(`p`,{class:`desc`},`Từ IoC/DI đến Microservices — code mẫu, kiến trúc, best practices`)],-1)])]),c(`div`,g,[c(`aside`,_,[c(`div`,v,[o[6]||=c(`h3`,{class:`toc-title`},`Mục lục`,-1),c(`nav`,y,[(r(),a(re,null,e(Y,e=>c(`a`,{key:e.id,href:`#`,class:te([`toc-link`,{active:X.value===e.id}]),onClick:ne(t=>xe(e.id),[`prevent`])},[c(`span`,x,n(e.num)+`.`,1),c(`span`,S,n(e.title),1)],10,b)),64))]),c(`div`,C,[o[5]||=c(`span`,{class:`progress-label`},`Tiến độ`,-1),c(`div`,w,[c(`div`,{class:`progress-fill`,style:t({width:`${Z.value}%`})},null,4)]),c(`span`,T,n(Math.round(Z.value))+`%`,1)])])]),c(`main`,E,[c(`section`,D,[o[14]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`01`),c(`h2`,{class:`section-title`},`IoC (Inversion of Control) & Dependency Injection`)],-1),c(`div`,O,[o[7]||=c(`h3`,null,`IoC Container là gì?`,-1),o[8]||=c(`p`,{class:`section-text`},[l(`IoC Container (ApplicationContext) quản lý vòng đời của beans — tạo, cấu hình, inject dependencies. Thay vì tự tạo object (`),c(`code`,null,`new UserService()`),l(`), bạn để Spring quản lý và inject khi cần.`)],-1),o[9]||=c(`h3`,null,`Các cách inject`,-1),u(d,{code:H,language:`java`}),o[10]||=c(`h3`,null,`@Component vs @Bean`,-1),o[11]||=c(`div`,{class:`cards-grid cols-2`},[c(`div`,{class:`info-card`},[c(`h4`,null,`@Component (@Service, @Repository, @Controller)`),c(`p`,null,`Dùng cho class tự viết. Spring scan package → tạo bean tự động.`)]),c(`div`,{class:`info-card`},[c(`h4`,null,`@Bean`),c(`p`,null,`Dùng trong @Configuration class cho third-party classes (DataSource, RestTemplate).`)])],-1),o[12]||=c(`h3`,null,`Bean Scopes`,-1),u(d,{code:U,language:`java`}),o[13]||=c(`h3`,null,`@Primary & @Qualifier`,-1),u(d,{code:W,language:`java`})])]),c(`section`,k,[o[20]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`02`),c(`h2`,{class:`section-title`},`Spring MVC & REST API`)],-1),c(`div`,A,[o[15]||=c(`h3`,null,`Luồng xử lý request`,-1),o[16]||=c(`div`,{class:`diagram`},[l(` Request → DispatcherServlet → HandlerMapping → Controller → Service → Repository → DB`),c(`br`),l(` → ResponseEntity ← JSON ← `)],-1),o[17]||=c(`h3`,null,`REST Controller`,-1),u(d,{code:G,language:`java`}),o[18]||=c(`h3`,null,`Exception Handling`,-1),u(d,{code:K,language:`java`}),o[19]||=c(`h3`,null,`DTO & Validation`,-1),u(d,{code:q,language:`java`})])]),c(`section`,j,[o[25]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`03`),c(`h2`,{class:`section-title`},`JPA & Hibernate`)],-1),c(`div`,M,[o[21]||=c(`h3`,null,`Entity & Relationships`,-1),u(d,{code:se,language:`java`}),o[22]||=c(`h3`,null,`Repository`,-1),u(d,{code:ce,language:`java`}),o[23]||=c(`h3`,null,`N+1 Problem`,-1),o[24]||=c(`p`,{class:`section-text`},`Khi lấy 100 users + mỗi user có orders → 1 query users + 100 query orders = 101 queries.`,-1),u(d,{code:le,language:`java`})])]),c(`section`,N,[o[29]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`04`),c(`h2`,{class:`section-title`},`Spring Security & JWT`)],-1),c(`div`,P,[o[26]||=c(`h3`,null,`Cấu hình SecurityFilterChain`,-1),u(d,{code:ue,language:`java`}),o[27]||=c(`h3`,null,`JWT Filter`,-1),u(d,{code:de,language:`java`}),o[28]||=c(`h3`,null,`Password Encoding & CORS`,-1),u(d,{code:fe,language:`java`})])]),c(`section`,F,[o[31]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`05`),c(`h2`,{class:`section-title`},`Auto-configuration & Actuator`)],-1),c(`div`,I,[o[30]||=i(`<h3 data-v-a7846fff>Auto-configuration hoạt động thế nào?</h3><p class="section-text" data-v-a7846fff>@EnableAutoConfiguration scan META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. Mỗi auto-config class có @Conditional annotation — chỉ active khi điều kiện đúng.</p><h3 data-v-a7846fff>Actuator endpoints</h3><div class="cards-grid cols-4" data-v-a7846fff><div class="info-card" data-v-a7846fff><h4 data-v-a7846fff>/actuator/health</h4><p data-v-a7846fff>Health check DB, disk, custom components.</p></div><div class="info-card" data-v-a7846fff><h4 data-v-a7846fff>/actuator/metrics</h4><p data-v-a7846fff>JVM (heap, thread, GC), HTTP request count/latency.</p></div><div class="info-card" data-v-a7846fff><h4 data-v-a7846fff>/actuator/info</h4><p data-v-a7846fff>Custom info (version, build time, git commit).</p></div><div class="info-card" data-v-a7846fff><h4 data-v-a7846fff>/actuator/env</h4><p data-v-a7846fff>Environment properties (cần bảo vệ).</p></div></div>`,4),u(d,{code:pe,language:`yaml`})])]),c(`section`,L,[o[35]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`06`),c(`h2`,{class:`section-title`},`Async & Scheduling`)],-1),c(`div`,R,[o[32]||=c(`h3`,null,`@Async`,-1),u(d,{code:me,language:`java`}),o[33]||=c(`h3`,null,`@Scheduled`,-1),u(d,{code:he,language:`java`}),o[34]||=c(`h3`,null,`@EventListener`,-1),u(d,{code:ge,language:`java`})])]),c(`section`,oe,[o[38]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`07`),c(`h2`,{class:`section-title`},`Testing`)],-1),c(`div`,z,[o[36]||=i(`<h3 data-v-a7846fff>Các loại test</h3><div class="cards-grid cols-4" data-v-a7846fff><div class="info-card" data-v-a7846fff><h4 data-v-a7846fff>Unit Test</h4><p data-v-a7846fff>Test 1 class độc lập, mock dependencies. @ExtendWith(MockitoExtension.class).</p></div><div class="info-card" data-v-a7846fff><h4 data-v-a7846fff>Integration Test</h4><p data-v-a7846fff>Test tầng repository với DB thật. @DataJpaTest + Testcontainers.</p></div><div class="info-card" data-v-a7846fff><h4 data-v-a7846fff>Web Layer Test</h4><p data-v-a7846fff>@WebMvcTest — chỉ tầng controller, mock service.</p></div><div class="info-card" data-v-a7846fff><h4 data-v-a7846fff>Full Integration</h4><p data-v-a7846fff>@SpringBootTest + Testcontainers — test từ controller đến DB.</p></div></div><h3 data-v-a7846fff>Unit Test với Mockito</h3>`,3),u(d,{code:_e,language:`java`}),o[37]||=c(`h3`,null,`Integration Test với Testcontainers`,-1),u(d,{code:ve,language:`java`})])]),c(`section`,B,[o[43]||=c(`div`,{class:`section-header`},[c(`span`,{class:`section-num`},`08`),c(`h2`,{class:`section-title`},`Spring Cloud & Microservices`)],-1),c(`div`,V,[o[39]||=c(`h3`,null,`Service Discovery (Eureka)`,-1),u(d,{code:J,language:`java`}),o[40]||=c(`h3`,null,`API Gateway (Spring Cloud Gateway)`,-1),u(d,{code:ye,language:`java`}),o[41]||=c(`h3`,null,`Spring Cloud Config`,-1),u(d,{code:be,language:`yaml`}),o[42]||=i(`<h3 data-v-a7846fff>Best Practices Checklist</h3><ul class="tips-list" data-v-a7846fff><li data-v-a7846fff><strong data-v-a7846fff>Package structure:</strong> controller → service → repository → entity/dto</li><li data-v-a7846fff><strong data-v-a7846fff>DTO riêng:</strong> không expose entity ra ngoài</li><li data-v-a7846fff><strong data-v-a7846fff>Exception handling:</strong> Global exception handler</li><li data-v-a7846fff><strong data-v-a7846fff>Logging:</strong> SLF4J + MDC (traceId, userId)</li><li data-v-a7846fff><strong data-v-a7846fff>Transaction:</strong> @Transactional trên service layer</li><li data-v-a7846fff><strong data-v-a7846fff>Security:</strong> JWT + HTTPS, không hardcode secret</li><li data-v-a7846fff><strong data-v-a7846fff>Monitoring:</strong> Actuator + Micrometer + Prometheus</li></ul>`,2)])])])])]))}},[[`__scopeId`,`data-v-a7846fff`]]);export{Y as default};