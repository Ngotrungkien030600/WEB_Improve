<template>
  <div class="spring-page">
    <!-- Sticky Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-nav">
          <button class="nav-btn" @click="handleNav('/java/hub')">
            <span>←</span>
            <span>Java</span>
          </button>
          <button class="nav-btn" @click="handleNav('/')">
            <span>🏠</span>
            <span>Trang chủ</span>
          </button>
        </div>
        <div class="header-title">
          <h1>🍃 Spring Boot</h1>
          <p class="desc">Từ IoC/DI đến Microservices — code mẫu, kiến trúc, best practices</p>
        </div>
      </div>
    </header>

    <div class="page-content">
      <!-- Sticky Sidebar TOC -->
      <aside class="sidebar-toc">
        <div class="toc-container">
          <h3 class="toc-title">Mục lục</h3>
          <nav class="toc-nav">
            <a
              v-for="section in tocSections"
              :key="section.id"
              href="#"
              class="toc-link"
              :class="{ active: activeSection === section.id }"
              @click.prevent="scrollTo(section.id)"
            >
              <span class="toc-num">{{ section.num }}.</span>
              <span class="toc-text">{{ section.title }}</span>
            </a>
          </nav>
          <div class="toc-progress">
            <span class="progress-label">Tiến độ</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${scrollProgress}%` }" />
            </div>
            <span class="progress-value">{{ Math.round(scrollProgress) }}%</span>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- 1. IoC & DI -->
        <section id="core" class="content-section">
          <div class="section-header">
            <span class="section-num">01</span>
            <h2 class="section-title">IoC (Inversion of Control) & Dependency Injection</h2>
          </div>
          <div class="section-body">
            <h3>IoC Container là gì?</h3>
            <p class="section-text">IoC Container (ApplicationContext) quản lý vòng đời của beans — tạo, cấu hình, inject dependencies. Thay vì tự tạo object (<code>new UserService()</code>), bạn để Spring quản lý và inject khi cần.</p>

            <h3>Các cách inject</h3>
            <CodeBlock :code="iocCode" language="java" />

            <h3>@Component vs @Bean</h3>
            <div class="cards-grid cols-2">
              <div class="info-card">
                <h4>@Component (@Service, @Repository, @Controller)</h4>
                <p>Dùng cho class tự viết. Spring scan package → tạo bean tự động.</p>
              </div>
              <div class="info-card">
                <h4>@Bean</h4>
                <p>Dùng trong @Configuration class cho third-party classes (DataSource, RestTemplate).</p>
              </div>
            </div>

            <h3>Bean Scopes</h3>
            <CodeBlock :code="scopeCode" language="java" />

            <h3>@Primary & @Qualifier</h3>
            <CodeBlock :code="qualifierCode" language="java" />
          </div>
        </section>

        <!-- 2. MVC & REST -->
        <section id="web" class="content-section">
          <div class="section-header">
            <span class="section-num">02</span>
            <h2 class="section-title">Spring MVC & REST API</h2>
          </div>
          <div class="section-body">
            <h3>Luồng xử lý request</h3>
            <div class="diagram">
              Request → DispatcherServlet → HandlerMapping → Controller → Service → Repository → DB<br>
              → ResponseEntity ← JSON ←
            </div>

            <h3>REST Controller</h3>
            <CodeBlock :code="restControllerCode" language="java" />

            <h3>Exception Handling</h3>
            <CodeBlock :code="exceptionCode" language="java" />

            <h3>DTO & Validation</h3>
            <CodeBlock :code="dtoCode" language="java" />
          </div>
        </section>

        <!-- 3. JPA -->
        <section id="jpa" class="content-section">
          <div class="section-header">
            <span class="section-num">03</span>
            <h2 class="section-title">JPA & Hibernate</h2>
          </div>
          <div class="section-body">
            <h3>Entity & Relationships</h3>
            <CodeBlock :code="entityCode" language="java" />

            <h3>Repository</h3>
            <CodeBlock :code="repositoryCode" language="java" />

            <h3>N+1 Problem</h3>
            <p class="section-text">Khi lấy 100 users + mỗi user có orders → 1 query users + 100 query orders = 101 queries.</p>
            <CodeBlock :code="n1Code" language="java" />
          </div>
        </section>

        <!-- 4. Security -->
        <section id="security" class="content-section">
          <div class="section-header">
            <span class="section-num">04</span>
            <h2 class="section-title">Spring Security & JWT</h2>
          </div>
          <div class="section-body">
            <h3>Cấu hình SecurityFilterChain</h3>
            <CodeBlock :code="securityConfigCode" language="java" />

            <h3>JWT Filter</h3>
            <CodeBlock :code="jwtFilterCode" language="java" />

            <h3>Password Encoding & CORS</h3>
            <CodeBlock :code="corsCode" language="java" />
          </div>
        </section>

        <!-- 5. Auto-config & Actuator -->
        <section id="boot" class="content-section">
          <div class="section-header">
            <span class="section-num">05</span>
            <h2 class="section-title">Auto-configuration & Actuator</h2>
          </div>
          <div class="section-body">
            <h3>Auto-configuration hoạt động thế nào?</h3>
            <p class="section-text">@EnableAutoConfiguration scan META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. Mỗi auto-config class có @Conditional annotation — chỉ active khi điều kiện đúng.</p>

            <h3>Actuator endpoints</h3>
            <div class="cards-grid cols-4">
              <div class="info-card"><h4>/actuator/health</h4><p>Health check DB, disk, custom components.</p></div>
              <div class="info-card"><h4>/actuator/metrics</h4><p>JVM (heap, thread, GC), HTTP request count/latency.</p></div>
              <div class="info-card"><h4>/actuator/info</h4><p>Custom info (version, build time, git commit).</p></div>
              <div class="info-card"><h4>/actuator/env</h4><p>Environment properties (cần bảo vệ).</p></div>
            </div>
            <CodeBlock :code="actuatorCode" language="yaml" />
          </div>
        </section>

        <!-- 6. Async & Scheduling -->
        <section id="async" class="content-section">
          <div class="section-header">
            <span class="section-num">06</span>
            <h2 class="section-title">Async & Scheduling</h2>
          </div>
          <div class="section-body">
            <h3>@Async</h3>
            <CodeBlock :code="asyncCode" language="java" />

            <h3>@Scheduled</h3>
            <CodeBlock :code="scheduledCode" language="java" />

            <h3>@EventListener</h3>
            <CodeBlock :code="eventCode" language="java" />
          </div>
        </section>

        <!-- 7. Testing -->
        <section id="test" class="content-section">
          <div class="section-header">
            <span class="section-num">07</span>
            <h2 class="section-title">Testing</h2>
          </div>
          <div class="section-body">
            <h3>Các loại test</h3>
            <div class="cards-grid cols-4">
              <div class="info-card"><h4>Unit Test</h4><p>Test 1 class độc lập, mock dependencies. @ExtendWith(MockitoExtension.class).</p></div>
              <div class="info-card"><h4>Integration Test</h4><p>Test tầng repository với DB thật. @DataJpaTest + Testcontainers.</p></div>
              <div class="info-card"><h4>Web Layer Test</h4><p>@WebMvcTest — chỉ tầng controller, mock service.</p></div>
              <div class="info-card"><h4>Full Integration</h4><p>@SpringBootTest + Testcontainers — test từ controller đến DB.</p></div>
            </div>

            <h3>Unit Test với Mockito</h3>
            <CodeBlock :code="unitTestCode" language="java" />

            <h3>Integration Test với Testcontainers</h3>
            <CodeBlock :code="integrationTestCode" language="java" />
          </div>
        </section>

        <!-- 8. Microservices -->
        <section id="cloud" class="content-section">
          <div class="section-header">
            <span class="section-num">08</span>
            <h2 class="section-title">Spring Cloud & Microservices</h2>
          </div>
          <div class="section-body">
            <h3>Service Discovery (Eureka)</h3>
            <CodeBlock :code="eurekaCode" language="java" />

            <h3>API Gateway (Spring Cloud Gateway)</h3>
            <CodeBlock :code="gatewayCode" language="java" />

            <h3>Spring Cloud Config</h3>
            <CodeBlock :code="configCode" language="yaml" />

            <h3>Best Practices Checklist</h3>
            <ul class="tips-list">
              <li><strong>Package structure:</strong> controller → service → repository → entity/dto</li>
              <li><strong>DTO riêng:</strong> không expose entity ra ngoài</li>
              <li><strong>Exception handling:</strong> Global exception handler</li>
              <li><strong>Logging:</strong> SLF4J + MDC (traceId, userId)</li>
              <li><strong>Transaction:</strong> @Transactional trên service layer</li>
              <li><strong>Security:</strong> JWT + HTTPS, không hardcode secret</li>
              <li><strong>Monitoring:</strong> Actuator + Micrometer + Prometheus</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { navigate } from '../utils/navigate.js';
import CodeBlock from '../components/CodeBlock.vue';

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

const activeSection = ref('');
const scrollProgress = ref(0);

const handleNav = (path) => navigate(path);

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  for (const section of tocSections) {
    const el = document.getElementById(section.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom > 150) {
        activeSection.value = section.id;
        break;
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Code snippets
const iocCode = `// 1. Field injection (không khuyến nghị — khó test)
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
}`;

const scopeCode = `@Component
@Scope("singleton")  // Mặc định — 1 instance cho toàn app
@Scope("prototype")  // Tạo mới mỗi lần getBean/inject
@Scope("request")    // 1 instance cho 1 HTTP request (Web)
@Scope("session")    // 1 instance cho 1 HTTP session
@Scope("application")// 1 instance cho ServletContext`;

const qualifierCode = `// Nhiều bean cùng type — chọn 1
@Primary
@Service
public class VnpayPayment implements PaymentService { }

@Qualifier("paypal")
@Service
public class PaypalPayment implements PaymentService { }

// Khi inject
public OrderService(@Qualifier("paypal") PaymentService payment) { }`;

const restControllerCode = `@RestController
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
}`;

const exceptionCode = `@RestControllerAdvice
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
}`;

const dtoCode = `public record UserCreateRequest(
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 100)
    String name,

    @NotBlank @Email
    String email,

    @Pattern(regexp = "^(0|\\+84)[3-9][0-9]{8}$", message = "SĐT không hợp lệ")
    String phone
) {}`;

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

const securityConfigCode = `@Configuration
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
}`;

const jwtFilterCode = `@Component
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
}`;

const corsCode = `@Bean
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
}`;

const actuatorCode = `# application.yml
management:
  endpoints.web.exposure.include: health,info,metrics
  endpoint.health.show-details: when-authorized`;

const asyncCode = `@Configuration
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
}`;

const scheduledCode = `@Configuration
@EnableScheduling
public class SchedulingConfig {}

@Component
public class CleanupJob {
    // Mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanExpiredTokens() {
        tokenRepository.deleteExpired(LocalDateTime.now());
    }
}`;

const eventCode = `// Event
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
}`;

const unitTestCode = `@ExtendWith(MockitoExtension.class)
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
}`;

const integrationTestCode = `@SpringBootTest
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
}`;

const eurekaCode = `// Service Registry (Eureka Server)
@SpringBootApplication
@EnableEurekaServer
public class ServiceRegistry { }

// Client
@SpringBootApplication
@EnableDiscoveryClient
public class UserService { }`;

const gatewayCode = `@Bean
public RouteLocator customRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("user-service", r -> r.path("/api/users/**")
            .filters(f -> f.circuitBreaker(config -> config
                .setName("userCircuitBreaker")
                .setFallbackUri("forward:/fallback/users")))
            .uri("lb://user-service"))
        .build();
}`;

const configCode = `# Config Server
@SpringBootApplication
@EnableConfigServer
public class ConfigServer { }

// Config Client — application.yml
spring:
  config:
    import: configserver:http://localhost:8888`;
</script>

<style scoped>
.spring-page {
  background: var(--forge-bg);
  min-height: 100vh;
  color: var(--forge-text);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.7;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: linear-gradient(180deg, var(--forge-bg) 0%, var(--forge-bg) 70%, transparent 100%);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 960px;
  margin: 0 auto;
}

.header-nav {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  color: var(--forge-text2);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background: var(--forge-surface-hover);
  color: var(--forge-text);
  border-color: var(--forge-fire);
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.desc {
  color: var(--forge-text2);
  font-size: 0.9rem;
  margin: 0;
}

.page-content {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.sidebar-toc {
  position: relative;
}

.toc-container {
  position: sticky;
  top: 120px;
  padding: 1.25rem;
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.toc-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--forge-text3);
  margin: 0 0 1rem;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toc-link {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: var(--forge-text2);
  font-size: 0.85rem;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.toc-link:hover {
  background: var(--forge-surface-hover);
  color: var(--forge-text);
}

.toc-link.active {
  background: var(--forge-fire);
  color: white;
}

.toc-link.active .toc-num {
  opacity: 0.8;
}

.toc-num {
  font-weight: 600;
  opacity: 0.6;
}

.toc-text {
  flex: 1;
}

.toc-progress {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--forge-glass-border);
}

.progress-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--forge-text3);
}

.progress-bar {
  height: 4px;
  background: var(--forge-surface);
  border-radius: 99px;
  margin: 0.5rem 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--forge-fire), var(--forge-ember));
  border-radius: 99px;
  transition: width 0.3s ease;
}

.progress-value {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--forge-ember);
}

.main-content {
  min-width: 0;
}

.content-section {
  margin-bottom: 3rem;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--forge-glass-border);
}

.section-num {
  font-size: 2rem;
  font-weight: 900;
  font-family: var(--font-mono);
  color: var(--forge-fire);
  opacity: 0.3;
  line-height: 1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--forge-text);
}

.section-body h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--forge-fire);
}

.section-body h3:first-child {
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

@media (max-width: 1024px) {
  .page-content {
    grid-template-columns: 1fr;
  }
  .sidebar-toc {
    display: none;
  }
}

@media (max-width: 768px) {
  .cards-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  .section-title {
    font-size: 1.25rem;
  }
  .section-num {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
  .page-header {
    padding: 1rem;
  }
  .header-title h1 {
    font-size: 1.25rem;
  }
  .nav-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .content-section,
  .info-card {
    animation: none;
    transition: none;
  }
}
</style>
