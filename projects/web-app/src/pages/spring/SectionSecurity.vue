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

export default {
  name: 'SpringSectionSecurity',
  components: { CodeBlock },
  data() {
    return { securityConfigCode, jwtFilterCode, corsCode };
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
