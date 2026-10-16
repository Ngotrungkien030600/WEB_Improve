<template>
  <div class="ss-section">
    <h3>SecurityFilterChain — bức tường trước mọi request</h3>
    <p class="section-text">Đây là cấu hình trung tâm của Spring Security: quyết định <strong>request nào được phép, request nào phải xác thực</strong>. Với API stateless (SPA/React/Vue), ta tắt CSRF + session, và đặt JWT filter trước khi Spring xử lý username/password.</p>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>permitAll()</h4><p>Không cần đăng nhập: <code>/api/auth/**</code> (đăng ký, đăng nhập) và <code>/actuator/health</code>.</p></div>
      <div class="info-card"><h4>hasRole("ADMIN")</h4><p>Chỉ user có role ADMIN mới vào được <code>/api/admin/**</code> — phân quyền theo role.</p></div>
      <div class="info-card"><h4>anyRequest().authenticated()</h4><p>Mọi request còn lại phải có token hợp lệ. Nguyên tắc <strong>deny by default</strong> — an toàn hơn allow tất cả.</p></div>
      <div class="info-card"><h4>STATELESS</h4><p>Không lưu session server — mỗi request tự mang token (JWT). Cần thiết để scale ngang nhiều instance mà không mất phiên đăng nhập.</p></div>
    </div>
    <CodeBlock :code="securityConfigCode" language="java" />

    <h3>JWT Filter — xác thực từng request</h3>
    <p class="section-text">Mỗi request gửi kèm header <code>Authorization: Bearer &lt;token&gt;</code>. Filter này: lấy token → <strong>xác minh chữ ký</strong> (tránh token giả) → nạp user + quyền vào <code>SecurityContext</code> để các endpoint khác dùng. Token lỗi/sai chữ ký → trả <code>401</code> ngay.</p>
    <CodeBlock :code="jwtFilterCode" language="java" />

    <h3>Password Encoding & CORS</h3>
    <p class="section-text"><strong>BCrypt</strong> mã hóa password 1 chiều (kèm salt) — không bao giờ lưu password dạng plaintext, kể cả khi DB bị lộ. <strong>CORS</strong> cho phép frontend ở domain khác (VD: <code>localhost:3000</code>) gọi API — nếu thiếu, trình duyệt chặn request.</p>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>BCryptPasswordEncoder</h4><p>Thuật toán hash mạnh, tự sinh salt mỗi lần hash — 2 lần hash cùng password cho 2 chuỗi khác nhau, chống rainbow table.</p></div>
      <div class="info-card"><h4>CORS đúng cách</h4><p>Chỉ allow đúng origin thật (không dùng <code>*</code> khi có credentials), giới hạn method + header cần thiết.</p></div>
    </div>
    <CodeBlock :code="corsCode" language="java" />

    <h3>OAuth 2.0, OpenID Connect và JWT: mỗi thứ giải quyết việc gì?</h3>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>OAuth 2.0</h4><p>Framework ủy quyền: client xin quyền truy cập API thay mặt người dùng. Nó định nghĩa flow/token, không phải định dạng token.</p></div>
      <div class="info-card"><h4>OpenID Connect (OIDC)</h4><p>Lớp xác thực danh tính đặt trên OAuth 2.0. ID token nói client biết user là ai; access token dùng gọi API.</p></div>
      <div class="info-card"><h4>JWT</h4><p>Định dạng token có header, claims và chữ ký. JWT thường chỉ được ký, không được mã hóa; đừng đặt password/secret trong payload.</p></div>
      <div class="info-card"><h4>Authorization Code + PKCE</h4><p>Flow thường dùng cho web/mobile user login. PKCE ràng buộc code với client để giảm nguy cơ authorization code bị đánh cắp.</p></div>
    </div>
    <div class="diagram">User → Client → Identity Provider (login + MFA)<br>Client nhận authorization code → đổi code + PKCE verifier lấy token<br>Client gửi access token → Resource Server kiểm chữ ký, issuer, audience, expiry và scope</div>
    <p class="section-text">Trong production, thường dùng Identity Provider (Cognito, Keycloak, Entra ID hoặc dịch vụ tương đương) để quản lý login/MFA/token lifecycle. API dùng Spring OAuth2 Resource Server để xác thực access token. Tự viết JWT filter giúp hiểu pipeline, nhưng không tự cung cấp OAuth/OIDC, refresh rotation hay key management.</p>
    <CodeBlock :code="resourceServerCode" language="java" />

    <h3>Token lifecycle: hết hạn, refresh, logout và thu hồi</h3>
    <ol class="security-list">
      <li>Access token sống ngắn; API luôn kiểm tra chữ ký, <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nbf</code> và scope/authority.</li>
      <li>Refresh token chỉ gửi tới authorization server. Dùng rotation: mỗi lần refresh phát token mới và vô hiệu token cũ; phát hiện reuse thì thu hồi cả token family.</li>
      <li>Logout cần revoke refresh token/session. JWT access token đã phát thường còn hiệu lực tới khi hết hạn, trừ khi thêm denylist/introspection; cần cân bằng giữa khả năng thu hồi và tính stateless.</li>
      <li>Không tin role hoặc user ID do client gửi. Quyền phải được xác nhận từ token đã verify hoặc dữ liệu server.</li>
    </ol>
    <div class="callout"><strong>Browser security:</strong> nếu lưu refresh token trong cookie thì đặt <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code> phù hợp và có CSRF strategy. Nếu dùng BFF, browser giữ session cookie còn access/refresh token ở server. Không chọn nơi lưu token theo thói quen; xác định threat model trước.</div>
    <CodeBlock :code="tokenClaimsCode" language="json" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

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

const resourceServerCode = `// Resource Server: verify issuer and signing keys from IdP metadata/JWKS
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
}`;

const tokenClaimsCode = `{
  "iss": "https://login.example.com/realms/app",
  "sub": "user-123",
  "aud": ["orders-api"],
  "exp": 1980000000,
  "scope": "orders:read orders:write",
  "roles": ["CUSTOMER"]
}

// API must reject wrong issuer/audience, expired token and invalid signature.
// Never accept the payload before signature verification.`;

export default {
  name: 'SpringSectionSecurity',
  components: { CodeBlock },
  data() {
    return { securityConfigCode, jwtFilterCode, corsCode, resourceServerCode, tokenClaimsCode };
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

.diagram, .callout { margin: 1rem 0; padding: 1rem; border: 1px solid var(--forge-glass-border); border-radius: var(--radius-md); background: var(--forge-surface); color: var(--forge-text2); font-size: .82rem; line-height: 1.8; }
.security-list { display: grid; gap: .55rem; padding-left: 1.25rem; color: var(--forge-text2); font-size: .84rem; line-height: 1.65; }
.security-list li::marker { color: var(--forge-fire); font-weight: 800; }
.callout { border-left: 3px solid var(--forge-fire); background: rgba(245,158,11,.07); }
.callout strong { color: var(--forge-text); }

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
