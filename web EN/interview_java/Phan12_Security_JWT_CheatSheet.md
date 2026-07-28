# 📄 PHẦN 12 — SECURITY & JWT 

---

## 1. Authentication vs Authorization

| Authentication | Authorization |
|---|---|
| Xác thực "bạn là ai" | Phân quyền "bạn được làm gì" |
| Login, password, token | Role, permission |

**Ví dụ:**
- Login thành công → Authentication.
- ADMIN có quyền xóa user, USER không có → Authorization.

---

## 2. JWT (JSON Web Token)

JWT gồm 3 phần:
```
header.payload.signature
```

| Phần | Nội dung |
|---|---|
| **Header** | Algorithm, token type |
| **Payload** | Claims: userId, roles, exp, iat |
| **Signature** | Mã hóa header + payload bằng secret key |

**Ví dụ token:**
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGVzIjpbIlVTRVIiXX0.signature
```

---

## 3. JWT Flow

```
Client → POST /login (username/password)
Server → trả JWT
Client → gửi JWT trong Header: Authorization: Bearer <token>
Server → verify signature → lấy user info từ claims
```

---

## 4. Spring Security Filter Chain

```
Request → JWT Filter → Authentication → Authorization → Controller
```

**Cấu hình cơ bản:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

---

## 5. JWT Filter đọc token

```java
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            // verify token, extract username/roles
            // set Authentication vào SecurityContext
        }
        chain.doFilter(request, response);
    }
}
```

---

## 6. Role-based Authorization

```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) { ... }
}
```

> Cần bật `@EnableMethodSecurity`.

---

## 7. Lưu ý bảo mật

- JWT không thể thu hồi sớm → cần short expiry + refresh token.
- Bảo vệ secret key, không commit lên git.
- Không lưu thông tin nhạy cảm trong payload (vì base64 decode được).

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Authentication vs Authorization?**
> "Authentication là xác thực ngườ dùng là ai, ví dụ đăng nhập. Authorization là kiểm tra ngườ dùng có quyền gì, ví dụ ADMIN mới được xóa user còn USER thì không."

**Câu: JWT hoạt động thế nào?**
> "JWT gồm header, payload, signature. Server ký bằng secret. Sau login, server trả token, client gửi kèm trong header Authorization: Bearer token. Server verify signature và đọc claims để biết user và quyền."

---

## ✅ CHECKLIST PHẦN 12

- [ ] Phân biệt Authentication vs Authorization.
- [ ] Giải thích cấu trúc JWT.
- [ ] Nói được JWT flow.
- [ ] Biết Spring Security Filter Chain.
- [ ] Biết cấu hình permitAll, hasRole.
- [ ] Biết @PreAuthorize.
- [ ] Biết lưu ý bảo mật JWT.
