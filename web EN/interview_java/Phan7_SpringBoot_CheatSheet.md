# 📄 PHẦN 7 — SPRING BOOT 

---

## 1. Spring IoC Container

**Inversion of Control (IoC):** Thay vì tự tạo object, Spring Container tạo và quản lý object (bean).

**Ví dụ:**
```java
@Service
public class UserService { ... }

// Spring tự tạo UserService, không cần new UserService()
```

---

## 2. Dependency Injection (DI)

Spring inject bean vào bean khác thông qua constructor, setter, hoặc field.

**Khuyến nghị: Constructor Injection**
```java
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

Ưu điểm:
- Dễ test.
- Không cần `@Autowired`.
- Bắt buộc cung cấp dependency.

---

## 3. `@Component`, `@Service`, `@Repository`, `@Controller`

| Annotation | Ý nghĩa |
|---|---|
| `@Component` | Bean chung |
| `@Service` | Tầng business logic |
| `@Repository` | Tầng truy cập dữ liệu, tự đổi SQLException thành DataAccessException |
| `@Controller` / `@RestController` | Xử lý request HTTP |

> `@RestController` = `@Controller` + `@ResponseBody`

---

## 4. Spring Boot Auto-Configuration

Spring Boot tự động cấu hình bean dựa trên classpath và properties.

**Ví dụ:**
- Có `spring-boot-starter-data-jpa` + H2/MySQL trong classpath → tự cấu hình `DataSource`, `EntityManagerFactory`.
- Có `spring-boot-starter-web` → tự cấu hình embedded Tomcat.

---

## 5. Spring Boot Starter

Starter là dependency tổng hợp nhiều dependency liên quan.

**Ví dụ `pom.xml`:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

---

## 6. `@SpringBootApplication`

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

Tương đương:
- `@Configuration`
- `@EnableAutoConfiguration`
- `@ComponentScan`

---

## 7. Application Properties

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/db
spring.datasource.username=root
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=update
```

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Dependency Injection là gì?**
> "Dependency Injection là cách Spring cung cấp object mà một class cần thay vì class tự tạo. Ví dụ UserService cần UserRepository, mình inject qua constructor. Ưu điểm là dễ test vì có thể truyền mock repository vào, và dependency rõ ràng ngay từ constructor."

**Câu: Spring Boot auto-configuration là gì?**
> "Spring Boot tự động cấu hình bean dựa trên classpath và properties. Ví dụ nếu có spring-boot-starter-data-jpa và MySQL driver trong classpath, Spring Boot tự tạo DataSource và EntityManagerFactory mà mình không cần cấu hình thủ công."

---

## ✅ CHECKLIST PHẦN 7

- [ ] Giải thích IoC Container.
- [ ] Giải thích DI và Constructor Injection.
- [ ] Phân biệt @Component, @Service, @Repository, @Controller.
- [ ] Giải thích @RestController.
- [ ] Giải thích Auto-Configuration.
- [ ] Biết Spring Boot Starter.
- [ ] Giải thích @SpringBootApplication.
- [ ] Biết cấu hình application.properties.
