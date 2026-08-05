import{_ as e,c as t,f as n,g as r,l as i,n as a,p as o,s,w as c}from"./index-CkmND2NX.js";import{t as l}from"./navigate-DMkXde2y.js";var u=[{id:`core`,num:`1`,title:`IoC & DI`},{id:`web`,num:`2`,title:`Spring MVC & REST`},{id:`jpa`,num:`3`,title:`JPA & Hibernate`},{id:`security`,num:`4`,title:`Security & JWT`},{id:`boot`,num:`5`,title:`Auto-config & Actuator`},{id:`async`,num:`6`,title:`Async & Scheduling`},{id:`test`,num:`7`,title:`Testing`},{id:`cloud`,num:`8`,title:`Microservices`}],d={name:`JavaSpringBootPage`,data(){return{tocSections:u}},methods:{handleNav(e){l(e)},scrollTo(e){let t=document.getElementById(e);t&&t.scrollIntoView({behavior:`smooth`,block:`start`})}}},f={class:`spring-boot-page`,style:{"--color-accent":`#22d3ee`}},p={class:`page`},m={class:`topbar`},h={class:`links`},g={class:`toc`},_=[`onClick`];function v(a,l,u,d,v,y){return r(),n(`div`,f,[i(`div`,p,[i(`div`,m,[l[2]||=i(`div`,null,[i(`h1`,null,`🍃 Spring Boot`),i(`p`,{class:`desc`},`Từ IoC/DI đến Microservices — code mẫu, kiến trúc, best practices`)],-1),i(`div`,h,[i(`a`,{href:`#`,onClick:l[0]||=s(e=>y.handleNav(`/java/hub`),[`prevent`])},`← Java`),i(`a`,{href:`#`,onClick:l[1]||=s(e=>y.handleNav(`/`),[`prevent`])},`Trang chủ`)])]),i(`div`,g,[(r(!0),n(t,null,e(v.tocSections,e=>(r(),n(`a`,{key:e.id,href:`#`,onClick:s(t=>y.scrollTo(e.id),[`prevent`])},c(e.num)+`. `+c(e.title),9,_))),128))]),l[3]||=o(`<div class="section" id="core" data-v-5a275584><div class="section-title" data-v-5a275584>1. IoC (Inversion of Control) &amp; Dependency Injection</div><div class="section-body" data-v-5a275584><h3 data-v-5a275584>IoC Container là gì?</h3><p data-v-5a275584>IoC Container (ApplicationContext) quản lý vòng đời của beans — tạo, cấu hình, inject dependencies. Thay vì tự tạo object (<code data-v-5a275584>new UserService()</code>), bạn để Spring quản lý và inject khi cần.</p><h3 data-v-5a275584>Các cách inject</h3><pre data-v-5a275584><code data-v-5a275584>// 1. Field injection (không khuyến nghị — khó test)
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
}</code></pre><h3 data-v-5a275584>@Component vs @Bean</h3><div class="grid-2" data-v-5a275584><div class="card" data-v-5a275584><h4 data-v-5a275584>@Component (@Service, @Repository, @Controller)</h4><p data-v-5a275584>Dùng cho class tự viết. Spring scan package → tạo bean tự động.</p></div><div class="card" data-v-5a275584><h4 data-v-5a275584>@Bean</h4><p data-v-5a275584>Dùng trong @Configuration class cho third-party classes (DataSource, RestTemplate).</p></div></div><h3 data-v-5a275584>Bean Scopes</h3><pre data-v-5a275584><code data-v-5a275584>@Component
@Scope(&quot;singleton&quot;)  // Mặc định — 1 instance cho toàn app
@Scope(&quot;prototype&quot;)  // Tạo mới mỗi lần getBean/inject
@Scope(&quot;request&quot;)    // 1 instance cho 1 HTTP request (Web)
@Scope(&quot;session&quot;)    // 1 instance cho 1 HTTP session
@Scope(&quot;application&quot;)// 1 instance cho ServletContext</code></pre><h3 data-v-5a275584>@Primary &amp; @Qualifier</h3><pre data-v-5a275584><code data-v-5a275584>// Nhiều bean cùng type — chọn 1
@Primary
@Service
public class VnpayPayment implements PaymentService { }

@Qualifier(&quot;paypal&quot;)
@Service
public class PaypalPayment implements PaymentService { }

// Khi inject
public OrderService(@Qualifier(&quot;paypal&quot;) PaymentService payment) { }</code></pre></div></div><div class="section" id="web" data-v-5a275584><div class="section-title" data-v-5a275584>2. Spring MVC &amp; REST API</div><div class="section-body" data-v-5a275584><h3 data-v-5a275584>Luồng xử lý request</h3><div class="diagram" data-v-5a275584> Request → DispatcherServlet → HandlerMapping → Controller → Service → Repository → DB<br data-v-5a275584> → ResponseEntity ← JSON ← </div><h3 data-v-5a275584>REST Controller</h3><pre data-v-5a275584><code data-v-5a275584>@RestController
@RequestMapping(&quot;/api/users&quot;)
public class UserController {

    @GetMapping
    public List&lt;User&gt; getAll(@RequestParam(defaultValue = &quot;0&quot;) int page) {
        return userService.findAll(page);
    }

    @GetMapping(&quot;/{id}&quot;)
    public ResponseEntity&lt;User&gt; getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity&lt;User&gt; create(@Valid @RequestBody UserCreateRequest req) {
        User created = userService.create(req);
        return ResponseEntity.created(URI.create(&quot;/api/users/&quot; + created.getId())).body(created);
    }

    @PutMapping(&quot;/{id}&quot;)
    public User update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest req) {
        return userService.update(id, req);
    }

    @DeleteMapping(&quot;/{id}&quot;)
    public ResponseEntity&lt;Void&gt; delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}</code></pre><h3 data-v-5a275584>Exception Handling</h3><pre data-v-5a275584><code data-v-5a275584>@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse(&quot;NOT_FOUND&quot;, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleValidation(MethodArgumentNotValidException ex) {
        List&lt;String&gt; errors = ex.getBindingResult().getFieldErrors()
            .stream().map(e -&gt; e.getField() + &quot;: &quot; + e.getDefaultMessage()).collect(Collectors.toList());
        return ResponseEntity.badRequest().body(new ErrorResponse(&quot;VALIDATION_FAILED&quot;, errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleGeneral(Exception ex) {
        return ResponseEntity.status(500).body(new ErrorResponse(&quot;INTERNAL_ERROR&quot;, &quot;Có lỗi xảy ra&quot;));
    }
}</code></pre><h3 data-v-5a275584>DTO &amp; Validation</h3><pre data-v-5a275584><code data-v-5a275584>public record UserCreateRequest(
    @NotBlank(message = &quot;Tên không được để trống&quot;)
    @Size(min = 2, max = 100)
    String name,

    @NotBlank @Email
    String email,

    @Pattern(regexp = &quot;^(0|\\+84)[3-9][0-9]{8}$&quot;, message = &quot;SĐT không hợp lệ&quot;)
    String phone
) {}</code></pre></div></div><div class="section" id="jpa" data-v-5a275584><div class="section-title" data-v-5a275584>3. JPA &amp; Hibernate</div><div class="section-body" data-v-5a275584><h3 data-v-5a275584>Entity &amp; Relationships</h3><pre data-v-5a275584><code data-v-5a275584>@Entity
@Table(name = &quot;users&quot;)
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true)
    private String email;

    @OneToMany(mappedBy = &quot;user&quot;, cascade = CascadeType.ALL, orphanRemoval = true)
    private List&lt;Order&gt; orders = new ArrayList&lt;&gt;();

    @ManyToMany
    @JoinTable(name = &quot;user_roles&quot;,
        joinColumns = @JoinColumn(name = &quot;user_id&quot;),
        inverseJoinColumns = @JoinColumn(name = &quot;role_id&quot;))
    private Set&lt;Role&gt; roles = new HashSet&lt;&gt;();
}</code></pre><h3 data-v-5a275584>Repository</h3><pre data-v-5a275584><code data-v-5a275584>public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    Optional&lt;User&gt; findByEmail(String email);

    @Query(&quot;SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id&quot;)
    Optional&lt;User&gt; findByIdWithOrders(@Param(&quot;id&quot;) Long id);

    @Modifying
    @Query(&quot;UPDATE User u SET u.status = :status WHERE u.lastLogin &lt; :date&quot;)
    int deactivateInactiveUsers(@Param(&quot;date&quot;) LocalDateTime date, @Param(&quot;status&quot;) String status);
}</code></pre><h3 data-v-5a275584>N+1 Problem</h3><p data-v-5a275584>Khi lấy 100 users + mỗi user có orders → 1 query users + 100 query orders = 101 queries.</p><pre data-v-5a275584><code data-v-5a275584>// Fix 1: JOIN FETCH
@Query(&quot;SELECT u FROM User u JOIN FETCH u.orders&quot;)
List&lt;User&gt; findAllWithOrders();

// Fix 2: @EntityGraph
@EntityGraph(attributePaths = {&quot;orders&quot;})
@Query(&quot;SELECT u FROM User u&quot;)
List&lt;User&gt; findAllWithOrders();

// Fix 3: @BatchSize
@Entity
public class User {
    @OneToMany(mappedBy = &quot;user&quot;)
    @BatchSize(size = 10)
    private List&lt;Order&gt; orders;
}</code></pre></div></div><div class="section" id="security" data-v-5a275584><div class="section-title" data-v-5a275584>4. Spring Security &amp; JWT</div><div class="section-body" data-v-5a275584><h3 data-v-5a275584>Cấu hình SecurityFilterChain</h3><pre data-v-5a275584><code data-v-5a275584>@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -&gt; sm.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -&gt; auth
                .requestMatchers(&quot;/api/auth/**&quot;, &quot;/actuator/health&quot;).permitAll()
                .requestMatchers(&quot;/api/admin/**&quot;).hasRole(&quot;ADMIN&quot;)
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}</code></pre><h3 data-v-5a275584>JWT Filter</h3><pre data-v-5a275584><code data-v-5a275584>@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String auth = req.getHeader(&quot;Authorization&quot;);
        if (auth != null &amp;&amp; auth.startsWith(&quot;Bearer &quot;)) {
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
}</code></pre><h3 data-v-5a275584>Password Encoding &amp; CORS</h3><pre data-v-5a275584><code data-v-5a275584>@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(&quot;http://localhost:3000&quot;));
    config.setAllowedMethods(List.of(&quot;GET&quot;,&quot;POST&quot;,&quot;PUT&quot;,&quot;DELETE&quot;,&quot;OPTIONS&quot;));
    config.setAllowedHeaders(List.of(&quot;*&quot;));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration(&quot;/**&quot;, config);
    return src;
}</code></pre></div></div><div class="section" id="boot" data-v-5a275584><div class="section-title" data-v-5a275584>5. Auto-configuration &amp; Actuator</div><div class="section-body" data-v-5a275584><h3 data-v-5a275584>Auto-configuration hoạt động thế nào?</h3><p data-v-5a275584>@EnableAutoConfiguration scan META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. Mỗi auto-config class có @Conditional annotation — chỉ active khi điều kiện đúng.</p><h3 data-v-5a275584>Actuator endpoints</h3><div class="grid-2" data-v-5a275584><div class="card" data-v-5a275584><h4 data-v-5a275584>/actuator/health</h4><p data-v-5a275584>Health check DB, disk, custom components.</p></div><div class="card" data-v-5a275584><h4 data-v-5a275584>/actuator/metrics</h4><p data-v-5a275584>JVM (heap, thread, GC), HTTP request count/latency.</p></div><div class="card" data-v-5a275584><h4 data-v-5a275584>/actuator/info</h4><p data-v-5a275584>Custom info (version, build time, git commit).</p></div><div class="card" data-v-5a275584><h4 data-v-5a275584>/actuator/env</h4><p data-v-5a275584>Environment properties (cần bảo vệ).</p></div></div><pre data-v-5a275584><code data-v-5a275584># application.yml
management:
  endpoints.web.exposure.include: health,info,metrics
  endpoint.health.show-details: when-authorized</code></pre></div></div><div class="section" id="async" data-v-5a275584><div class="section-title" data-v-5a275584>6. Async &amp; Scheduling</div><div class="section-body" data-v-5a275584><h3 data-v-5a275584>@Async</h3><pre data-v-5a275584><code data-v-5a275584>@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix(&quot;async-&quot;);
        executor.initialize();
        return executor;
    }
}

@Service
public class EmailService {
    @Async
    public CompletableFuture&lt;Void&gt; sendWelcomeEmail(User user) {
        emailClient.send(user.getEmail(), &quot;Welcome!&quot;, template);
        return CompletableFuture.completedFuture(null);
    }
}</code></pre><h3 data-v-5a275584>@Scheduled</h3><pre data-v-5a275584><code data-v-5a275584>@Configuration
@EnableScheduling
public class SchedulingConfig {}

@Component
public class CleanupJob {
    // Mỗi ngày lúc 2h sáng
    @Scheduled(cron = &quot;0 0 2 * * ?&quot;)
    public void cleanExpiredTokens() {
        tokenRepository.deleteExpired(LocalDateTime.now());
    }
}</code></pre><h3 data-v-5a275584>@EventListener</h3><pre data-v-5a275584><code data-v-5a275584>// Event
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
}</code></pre></div></div><div class="section" id="test" data-v-5a275584><div class="section-title" data-v-5a275584>7. Testing</div><div class="section-body" data-v-5a275584><h3 data-v-5a275584>Các loại test</h3><div class="grid-2" data-v-5a275584><div class="card" data-v-5a275584><h4 data-v-5a275584>Unit Test</h4><p data-v-5a275584>Test 1 class độc lập, mock dependencies. @ExtendWith(MockitoExtension.class).</p></div><div class="card" data-v-5a275584><h4 data-v-5a275584>Integration Test</h4><p data-v-5a275584>Test tầng repository với DB thật. @DataJpaTest + Testcontainers.</p></div><div class="card" data-v-5a275584><h4 data-v-5a275584>Web Layer Test</h4><p data-v-5a275584>@WebMvcTest — chỉ tầng controller, mock service.</p></div><div class="card" data-v-5a275584><h4 data-v-5a275584>Full Integration</h4><p data-v-5a275584>@SpringBootTest + Testcontainers — test từ controller đến DB.</p></div></div><h3 data-v-5a275584>Unit Test với Mockito</h3><pre data-v-5a275584><code data-v-5a275584>@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepo;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UserService userService;

    @Test
    void createUser_shouldReturn_whenValid() {
        when(passwordEncoder.encode(&quot;pass123&quot;)).thenReturn(&quot;encoded&quot;);
        when(userRepo.save(any())).thenReturn(entity);

        User result = userService.create(req);

        assertThat(result.getEmail()).isEqualTo(&quot;alice@email.com&quot;);
        verify(userRepo).save(any());
    }
}</code></pre><h3 data-v-5a275584>Integration Test với Testcontainers</h3><pre data-v-5a275584><code data-v-5a275584>@SpringBootTest
@Testcontainers
class UserRepositoryTest {

    @Container
    static PostgreSQLContainer&lt;?&gt; postgres = new PostgreSQLContainer&lt;&gt;(&quot;postgres:16&quot;);

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add(&quot;spring.datasource.url&quot;, postgres::getJdbcUrl);
    }

    @Autowired private UserRepository userRepo;

    @Test
    void findByEmail_shouldReturnUser() {
        userRepo.save(new User(null, &quot;Alice&quot;, &quot;alice@email.com&quot;));
        Optional&lt;User&gt; result = userRepo.findByEmail(&quot;alice@email.com&quot;);
        assertThat(result).isPresent();
    }
}</code></pre></div></div><div class="section" id="cloud" data-v-5a275584><div class="section-title" data-v-5a275584>8. Spring Cloud &amp; Microservices</div><div class="section-body" data-v-5a275584><h3 data-v-5a275584>Service Discovery (Eureka)</h3><pre data-v-5a275584><code data-v-5a275584>// Service Registry (Eureka Server)
@SpringBootApplication
@EnableEurekaServer
public class ServiceRegistry { }

// Client
@SpringBootApplication
@EnableDiscoveryClient
public class UserService { }</code></pre><h3 data-v-5a275584>API Gateway (Spring Cloud Gateway)</h3><pre data-v-5a275584><code data-v-5a275584>@Bean
public RouteLocator customRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
        .route(&quot;user-service&quot;, r -&gt; r.path(&quot;/api/users/**&quot;)
            .filters(f -&gt; f.circuitBreaker(config -&gt; config
                .setName(&quot;userCircuitBreaker&quot;)
                .setFallbackUri(&quot;forward:/fallback/users&quot;)))
            .uri(&quot;lb://user-service&quot;))
        .build();
}</code></pre><h3 data-v-5a275584>Spring Cloud Config</h3><pre data-v-5a275584><code data-v-5a275584>// Config Server
@SpringBootApplication
@EnableConfigServer
public class ConfigServer { }

// Config Client — application.yml
spring:
  config:
    import: configserver:http://localhost:8888</code></pre><h3 data-v-5a275584>Best Practices Checklist</h3><ul data-v-5a275584><li data-v-5a275584><strong data-v-5a275584>Package structure:</strong> controller → service → repository → entity/dto</li><li data-v-5a275584><strong data-v-5a275584>DTO riêng:</strong> không expose entity ra ngoài</li><li data-v-5a275584><strong data-v-5a275584>Exception handling:</strong> Global exception handler</li><li data-v-5a275584><strong data-v-5a275584>Logging:</strong> SLF4J + MDC (traceId, userId)</li><li data-v-5a275584><strong data-v-5a275584>Transaction:</strong> @Transactional trên service layer</li><li data-v-5a275584><strong data-v-5a275584>Security:</strong> JWT + HTTPS, không hardcode secret</li><li data-v-5a275584><strong data-v-5a275584>Monitoring:</strong> Actuator + Micrometer + Prometheus</li></ul></div></div>`,8)])])}var y=a(d,[[`render`,v],[`__scopeId`,`data-v-5a275584`]]);export{y as default};