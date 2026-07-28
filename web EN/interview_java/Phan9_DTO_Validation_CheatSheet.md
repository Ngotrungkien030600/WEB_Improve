# 📄 PHẦN 9 — DTO & VALIDATION 

---

## 1. DTO là gì?

**Data Transfer Object:** Object dùng để truyền dữ liệu giữa các tầng (client ↔ controller ↔ service), tách biệt khỏi Entity.

**Ví dụ:**
```java
// Entity - map với database
@Entity
public class User {
    @Id @GeneratedValue
    private Long id;
    private String email;
    private String password;
}

// DTO - dùng cho API
public class UserResponse {
    private Long id;
    private String email;
}

public class UserRequest {
    private String email;
    private String password;
}
```

---

## 2. Tại sao dùng DTO?

- Không expose trực tiếp Entity ra ngoài.
- Kiểm soát dữ liệu trả về / nhận vào.
- Dễ validation.
- Tránh vòng lặp JSON khi entity có quan hệ.

---

## 3. MapStruct — Chuyển đổi Entity ↔ DTO

```java
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
    User toEntity(UserRequest request);
}
```

Hoặc dùng thủ công:
```java
public UserResponse toResponse(User user) {
    UserResponse dto = new UserResponse();
    dto.setId(user.getId());
    dto.setEmail(user.getEmail());
    return dto;
}
```

---

## 4. Validation với Jakarta Bean Validation

**Dependency:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

**Các annotation phổ biến:**

| Annotation | Ý nghĩa |
|---|---|
| `@NotNull` | Không được null |
| `@NotBlank` | Không null, không rỗng, không chỉ whitespace |
| `@NotEmpty` | Không null, không rỗng (chuỗi, collection) |
| `@Size(min, max)` | Độ dài trong khoảng |
| `@Min` / `@Max` | Giá trị số tối thiểu / tối đa |
| `@Email` | Định dạng email |
| `@Pattern(regexp)` | Khớp regex |

---

## 5. DTO Request với Validation

```java
public class UserRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @NotBlank
    @Email(message = "Email invalid")
    private String email;

    @NotBlank
    @Size(min = 6, message = "Password at least 6 characters")
    private String password;
}
```

**Controller:**
```java
@PostMapping
public ResponseEntity<UserResponse> create(@RequestBody @Valid UserRequest request) { ... }
```

---

## 6. Custom Validation Message

Dùng `message.properties`:
```properties
NotBlank.userRequest.email=Email không được để trống
Size.userRequest.password=Mật khẩu phải từ {min} đến {max} ký tự
```

---

## 7. Global Validation Handler

```java
@RestControllerAdvice
public class ValidationHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err ->
            errors.put(err.getField(), err.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }
}
```

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Tại sao dùng DTO?**
> "DTO giúp tách API model khỏi Entity, không expose trực tiếp cấu trúc database ra ngoài. Ví dụ entity User có password, mình chỉ trả về UserResponse gồm id và email. Ngoài ra DTO còn giúp validation dễ dàng hơn và tránh vòng lặp JSON với quan hệ entity."

**Câu: Validation trong Spring Boot?**
> "Dùng Jakarta Bean Validation với các annotation như @NotBlank, @Email, @Size. Controller nhận request bằng @Valid. Nếu sai validation, Spring ném MethodArgumentNotValidException, mình bắt bằng @RestControllerAdvice để trả về lỗi 400 rõ ràng."

---

## ✅ CHECKLIST PHẦN 9

- [ ] Giải thích DTO và lý do dùng.
- [ ] Phân biệt Entity và DTO.
- [ ] Biết cách chuyển đổi Entity ↔ DTO.
- [ ] Biết các annotation validation phổ biến.
- [ ] Dùng @Valid trong controller.
- [ ] Biết custom validation message.
- [ ] Biết xử lý MethodArgumentNotValidException.
