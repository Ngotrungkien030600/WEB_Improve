<template>
  <div class="spring-boot-page" style="--color-accent: #22d3ee">
    <div class="page">
      <div class="topbar">
        <div>
          <h1>🍃 Spring Boot</h1>
          <p class="desc">Từ IoC/DI đến Microservices — code mẫu, kiến trúc, best practices</p>
        </div>
        <div class="links">
          <a href="#" @click.prevent="handleNav('/java/hub')">← Java</a>
          <a href="#" @click.prevent="handleNav('/')">Trang chủ</a>
        </div>
      </div>

      <!-- Table of Contents -->
      <div class="toc">
        <a v-for="section in tocSections" :key="section.id" href="#" @click.prevent="scrollTo(section.id)">
          {{ section.num }}. {{ section.title }}
        </a>
      </div>

      <!-- 1. IoC & DI -->
      <div class="section" id="core">
        <div class="section-title">1. IoC (Inversion of Control) &amp; Dependency Injection</div>
        <div class="section-body">
          <h3>IoC Container là gì?</h3>
          <p>IoC Container (ApplicationContext) quản lý vòng đời của beans — tạo, cấu hình, inject dependencies. Thay vì tự tạo object (<code>new UserService()</code>), bạn để Spring quản lý và inject khi cần.</p>

          <h3>Các cách inject</h3>
          <pre><code>// 1. Field injection (không khuyến nghị — khó test)
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
}</code></pre>

          <h3>@Component vs @Bean</h3>
          <div class="grid-2">
            <div class="card"><h4>@Component (@Service, @Repository, @Controller)</h4><p>Dùng cho class tự viết. Spring scan package → tạo bean tự động.</p></div>
            <div class="card"><h4>@Bean</h4><p>Dùng trong @Configuration class cho third-party classes (DataSource, RestTemplate).</p></div>
          </div>

          <h3>Bean Scopes</h3>
          <pre><code>@Component
@Scope("singleton")  // Mặc định — 1 instance cho toàn app
@Scope("prototype")  // Tạo mới mỗi lần getBean/inject
@Scope("request")    // 1 instance cho 1 HTTP request (Web)
@Scope("session")    // 1 instance cho 1 HTTP session
@Scope("application")// 1 instance cho ServletContext</code></pre>

          <h3>@Primary &amp; @Qualifier</h3>
          <pre><code>// Nhiều bean cùng type — chọn 1
@Primary
@Service
public class VnpayPayment implements PaymentService { }

@Qualifier("paypal")
@Service
public class PaypalPayment implements PaymentService { }

// Khi inject
public OrderService(@Qualifier("paypal") PaymentService payment) { }</code></pre>
        </div>
      </div>

      <!-- 2. MVC & REST -->
      <div class="section" id="web">
        <div class="section-title">2. Spring MVC &amp; REST API</div>
        <div class="section-body">
          <h3>Luồng xử lý request</h3>
          <div class="diagram">
            Request → DispatcherServlet → HandlerMapping → Controller → Service → Repository → DB<br>
                                              → ResponseEntity ← JSON ←
          </div>

          <h3>REST Controller</h3>
          <pre><code>@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List&lt;User&gt; getAll(@RequestParam(defaultValue = "0") int page) {
        return userService.findAll(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity&lt;User&gt; getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity&lt;User&gt; create(@Valid @RequestBody UserCreateRequest req) {
        User created = userService.create(req);
        return ResponseEntity.created(URI.create("/api/users/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest req) {
        return userService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity&lt;Void&gt; delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}</code></pre>

          <h3>Exception Handling</h3>
          <pre><code>@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleValidation(MethodArgumentNotValidException ex) {
        List&lt;String&gt; errors = ex.getBindingResult().getFieldErrors()
            .stream().map(e -> e.getField() + ": " + e.getDefaultMessage()).collect(Collectors.toList());
        return ResponseEntity.badRequest().body(new ErrorResponse("VALIDATION_FAILED", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleGeneral(Exception ex) {
        return ResponseEntity.status(500).body(new ErrorResponse("INTERNAL_ERROR", "Có lỗi xảy ra"));
    }
}</code></pre>

          <h3>DTO &amp; Validation</h3>
          <pre><code>public record UserCreateRequest(
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 100)
    String name,

    @NotBlank @Email
    String email,

    @Pattern(regexp = "^(0|\+84)[3-9][0-9]{8}$", message = "SĐT không hợp lệ")
    String phone
) {}</code></pre>
        </div>
      </div>

      <!-- 3. JPA -->
      <div class="section" id="jpa">
        <div class="section-title">3. JPA &amp; Hibernate</div>
        <div class="section-body">
          <h3>Entity &amp; Relationships</h3>
          <pre><code>@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List&lt;Order&gt; orders = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set&lt;Role&gt; roles = new HashSet<>();
}</code></pre>

          <h3>Repository</h3>
          <pre><code>public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    Optional&lt;User&gt; findByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
    Optional&lt;User&gt; findByIdWithOrders(@Param("id") Long id);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.lastLogin &lt; :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date, @Param("status") String status);
}</code></pre>

          <h3>N+1 Problem</h3>
          <p>Khi lấy 100 users + mỗi user có orders → 1 query users + 100 query orders = 101 queries.</p>
          <pre><code>// Fix 1: JOIN FETCH
@Query("SELECT u FROM User u JOIN FETCH u.orders")
List&lt;User&gt; findAllWithOrders();

// Fix 2: @EntityGraph
@EntityGraph(attributePaths = {"orders"})
@Query("SELECT u FROM User u")
List&lt;User&gt; findAllWithOrders();

// Fix 3: @BatchSize
@Entity
public class User {
    @OneToMany(mappedBy = "user")
    @BatchSize(size = 10)
    private List&lt;Order&gt; orders;
}</code></pre>
        </div>
      </div>

      <!-- 4. Security -->
      <div class="section" id="security">
        <div class="section-title">4. Spring Security &amp; JWT</div>
        <div class="section-body">
          <h3>Cấu hình SecurityFilterChain</h3>
          <pre><code>@Configuration
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
}</code></pre>

          <h3>JWT Filter</h3>
          <pre><code>@Component
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
}</code></pre>

          <h3>Password Encoding &amp; CORS</h3>
          <pre><code>@Bean
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
}</code></pre>
        </div>
      </div>

      <!-- 5. Auto-config & Actuator -->
      <div class="section" id="boot">
        <div class="section-title">5. Auto-configuration &amp; Actuator</div>
        <div class="section-body">
          <h3>Auto-configuration hoạt động thế nào?</h3>
          <p>@EnableAutoConfiguration scan META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. Mỗi auto-config class có @Conditional annotation — chỉ active khi điều kiện đúng.</p>

          <h3>Actuator endpoints</h3>
          <div class="grid-2">
            <div class="card"><h4>/actuator/health</h4><p>Health check DB, disk, custom components.</p></div>
            <div class="card"><h4>/actuator/metrics</h4><p>JVM (heap, thread, GC), HTTP request count/latency.</p></div>
            <div class="card"><h4>/actuator/info</h4><p>Custom info (version, build time, git commit).</p></div>
            <div class="card"><h4>/actuator/env</h4><p>Environment properties (cần bảo vệ).</p></div>
          </div>
          <pre><code># application.yml
management:
  endpoints.web.exposure.include: health,info,metrics
  endpoint.health.show-details: when-authorized</code></pre>
        </div>
      </div>

      <!-- 6. Async & Scheduling -->
      <div class="section" id="async">
        <div class="section-title">6. Async &amp; Scheduling</div>
        <div class="section-body">
          <h3>@Async</h3>
          <pre><code>@Configuration
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
    public CompletableFuture&lt;Void&gt; sendWelcomeEmail(User user) {
        emailClient.send(user.getEmail(), "Welcome!", template);
        return CompletableFuture.completedFuture(null);
    }
}</code></pre>

          <h3>@Scheduled</h3>
          <pre><code>@Configuration
@EnableScheduling
public class SchedulingConfig {}

@Component
public class CleanupJob {
    // Mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanExpiredTokens() {
        tokenRepository.deleteExpired(LocalDateTime.now());
    }
}</code></pre>

          <h3>@EventListener</h3>
          <pre><code>// Event
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
}</code></pre>
        </div>
      </div>

      <!-- 7. Testing -->
      <div class="section" id="test">
        <div class="section-title">7. Testing</div>
        <div class="section-body">
          <h3>Các loại test</h3>
          <div class="grid-2">
            <div class="card"><h4>Unit Test</h4><p>Test 1 class độc lập, mock dependencies. @ExtendWith(MockitoExtension.class).</p></div>
            <div class="card"><h4>Integration Test</h4><p>Test tầng repository với DB thật. @DataJpaTest + Testcontainers.</p></div>
            <div class="card"><h4>Web Layer Test</h4><p>@WebMvcTest — chỉ tầng controller, mock service.</p></div>
            <div class="card"><h4>Full Integration</h4><p>@SpringBootTest + Testcontainers — test từ controller đến DB.</p></div>
          </div>

          <h3>Unit Test với Mockito</h3>
          <pre><code>@ExtendWith(MockitoExtension.class)
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
}</code></pre>

          <h3>Integration Test với Testcontainers</h3>
          <pre><code>@SpringBootTest
@Testcontainers
class UserRepositoryTest {

    @Container
    static PostgreSQLContainer&lt;?&gt; postgres = new PostgreSQLContainer&lt;&gt;("postgres:16");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
    }

    @Autowired private UserRepository userRepo;

    @Test
    void findByEmail_shouldReturnUser() {
        userRepo.save(new User(null, "Alice", "alice@email.com"));
        Optional&lt;User&gt; result = userRepo.findByEmail("alice@email.com");
        assertThat(result).isPresent();
    }
}</code></pre>
        </div>
      </div>

      <!-- 8. Microservices -->
      <div class="section" id="cloud">
        <div class="section-title">8. Spring Cloud &amp; Microservices</div>
        <div class="section-body">
          <h3>Service Discovery (Eureka)</h3>
          <pre><code>// Service Registry (Eureka Server)
@SpringBootApplication
@EnableEurekaServer
public class ServiceRegistry { }

// Client
@SpringBootApplication
@EnableDiscoveryClient
public class UserService { }</code></pre>

          <h3>API Gateway (Spring Cloud Gateway)</h3>
          <pre><code>@Bean
public RouteLocator customRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("user-service", r -> r.path("/api/users/**")
            .filters(f -> f.circuitBreaker(config -> config
                .setName("userCircuitBreaker")
                .setFallbackUri("forward:/fallback/users")))
            .uri("lb://user-service"))
        .build();
}</code></pre>

          <h3>Spring Cloud Config</h3>
          <pre><code>// Config Server
@SpringBootApplication
@EnableConfigServer
public class ConfigServer { }

// Config Client — application.yml
spring:
  config:
    import: configserver:http://localhost:8888</code></pre>

          <h3>Best Practices Checklist</h3>
          <ul>
            <li><strong>Package structure:</strong> controller → service → repository → entity/dto</li>
            <li><strong>DTO riêng:</strong> không expose entity ra ngoài</li>
            <li><strong>Exception handling:</strong> Global exception handler</li>
            <li><strong>Logging:</strong> SLF4J + MDC (traceId, userId)</li>
            <li><strong>Transaction:</strong> @Transactional trên service layer</li>
            <li><strong>Security:</strong> JWT + HTTPS, không hardcode secret</li>
            <li><strong>Monitoring:</strong> Actuator + Micrometer + Prometheus</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

const tocSections = [
  { id: 'core', num: '1', title: 'IoC & DI' },
  { id: 'web', num: '2', title: 'Spring MVC & REST' },
  { id: 'jpa', num: '3', title: 'JPA & Hibernate' },
  { id: 'security', num: '4', title: 'Security & JWT' },
  { id: 'boot', num: '5', title: 'Auto-config & Actuator' },
  { id: 'async', num: '6', title: 'Async & Scheduling' },
  { id: 'test', num: '7', title: 'Testing' },
  { id: 'cloud', num: '8', title: 'Microservices' },
];

export default {
  name: 'JavaSpringBootPage',
  data() {
    return { tocSections };
  },
  methods: {
    handleNav(path) {
      navigate(path);
    },
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
  },
};
</script>

<style scoped>
@import '@legacy/css/variables.css';

.spring-boot-page {
  background: var(--color-bg);
  min-height: 100vh;
  color: var(--color-text);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.7;
}

.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.topbar h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.desc {
  color: var(--color-text2);
  margin-top: 0.3rem;
  font-size: 0.95rem;
}

.links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.links a {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.85rem;
}

.links a:hover {
  text-decoration: underline;
}

.toc {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.toc a {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 0.7rem 1rem;
  text-decoration: none;
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 500;
  transition: border-color 0.2s, color 0.2s;
}

.toc a:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.section {
  margin-bottom: 3rem;
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  overflow: hidden;
}

.section-title {
  background: var(--color-surface2);
  padding: 0.9rem 1.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-bottom: 1px solid var(--color-border);
}

.section-body {
  padding: 1.25rem;
}

.section-body h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.25rem 0 0.5rem;
  color: var(--color-accent);
}

.section-body h3:first-child {
  margin-top: 0;
}

.section-body p {
  font-size: 0.9rem;
  color: var(--color-text2);
  margin-bottom: 0.75rem;
}

.section-body ul {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.section-body li {
  font-size: 0.85rem;
  color: var(--color-text2);
  margin-bottom: 0.3rem;
}

.section-body strong {
  color: var(--color-text);
}

pre {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1rem;
  font-size: 0.82rem;
  overflow-x: auto;
  margin: 0.75rem 0;
  line-height: 1.6;
  color: var(--color-text);
}

code {
  background: var(--color-surface2);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85em;
}

pre code {
  background: transparent;
  padding: 0;
}

.diagram {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1rem;
  margin: 0.75rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-accent);
  font-weight: 600;
  line-height: 2;
  font-family: monospace;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.card {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1rem;
}

.card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card p,
.card li {
  font-size: 0.8rem;
  color: var(--color-text2);
}

.card ul {
  padding-left: 1rem;
}

.card li {
  margin-bottom: 0.2rem;
}

@media (max-width: 600px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
