# 📄 PHẦN 3 — EXCEPTION 

---

## 1. Exception Hierarchy

```
Throwable
├── Error                    (Không nên catch: OutOfMemoryError, StackOverflowError)
└── Exception
    ├── Checked Exception    (Compiler bắt buộc xử lý: IOException, SQLException)
    └── RuntimeException     (Unchecked: NullPointerException, IllegalArgumentException)
```

---

## 2. Checked vs Unchecked Exception

| | **Checked Exception** | **Unchecked Exception** |
|---|---|---|
| **Kế thừa** | `Exception` (trừ RuntimeException) | `RuntimeException` |
| **Compiler kiểm tra** | Có | Không |
| **Xử lý** | Bắt buộc `try-catch` hoặc `throws` | Không bắt buộc |
| **Ví dụ** | `IOException`, `SQLException`, `FileNotFoundException` | `NullPointerException`, `IndexOutOfBoundsException` |
| **Ý nghĩa** | Lỗi ngoại viên, không kiểm soát hoàn toàn | Lỗi logic, dữ liệu không hợp lệ |

**Ví dụ:**
```java
// Checked
public void readFile() throws IOException { ... }

// Unchecked
int x = nullValue.length(); // NullPointerException
```

---

## 3. `throw` vs `throws`

| `throw` | `throws` |
|---|---|
| Ném một exception cụ thể tại dòng code | Khai báo method có thể ném exception |
| Dùng bên trong method | Dùng trong khai báo method |

**Ví dụ:**
```java
public void withdraw(double amount) throws InsufficientBalanceException {
    if (balance < amount) {
        throw new InsufficientBalanceException("Not enough money");
    }
}
```

---

## 4. `try-catch-finally`

```java
try {
    // code có thể lỗi
} catch (SpecificException e) {
    // xử lý cụ thể
} finally {
    // luôn chạy, dùng để đóng resource
}
```

**Ví dụ try-with-resources (Java 7+):**
```java
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    return br.readLine();
} // auto close
```

---

## 5. Custom Exception

Tạo exception riêng cho lỗi business, giúp code rõ ràng và dễ xử lý.

**Ví dụ:**
```java
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}

// Sử dụng
public User findById(Long id) {
    return repo.findById(id)
        .orElseThrow(() -> new UserNotFoundException("User not found: " + id));
}
```

---

## 6. Có nên catch `Exception` chung?

**Không nên** nếu không có cách xử lý rõ ràng.

- Làm khó debug.
- Có thể nuốt lỗi nghiêm trọng.
- Nên catch exception cụ thể.

**Ví dụ xấu:**
```java
try {
    // something
} catch (Exception e) {  // ❌ quá rộng
    e.printStackTrace();
}
```

**Ví dụ tốt:**
```java
try {
    // something
} catch (UserNotFoundException e) {
    return ResponseEntity.status(404).body(e.getMessage());
} catch (IllegalArgumentException e) {
    return ResponseEntity.status(400).body(e.getMessage());
}
```

---

## 7. Global Exception Handler trong Spring Boot

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Internal error");
    }
}
```

---

## 8. `final`, `finally`, `finalize`

| Từ khóa | Ý nghĩa |
|---|---|
| `final` | Biến không đổi, method không override, class không kế thừa |
| `finally` | Khối code luôn chạy sau try-catch |
| `finalize()` | Method của Object, GC gọi trước khi thu hồi. **Không nên dùng.** |

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Checked vs Unchecked Exception?**
> "Checked Exception kế thừa Exception nhưng không phải RuntimeException, compiler bắt buộc phải xử lý bằng try-catch hoặc throws, ví dụ IOException. Unchecked Exception kế thừa RuntimeException, thường do lỗi logic như NullPointerException, compiler không bắt buộc xử lý."

**Câu: Custom Exception có tác dụng gì?**
> "Giúp code rõ ràng hơn khi xử lý lỗi business. Ví dụ thay vì ném RuntimeException chung chung, mình tạo UserNotFoundException để controller bắt và trả về 404 cụ thể."

---

## ✅ CHECKLIST PHẦN 3

- [ ] Phân biệt Checked vs Unchecked Exception.
- [ ] Phân biệt `throw` vs `throws`.
- [ ] Biết cách viết `try-catch-finally` và `try-with-resources`.
- [ ] Biết tạo Custom Exception.
- [ ] Biết tại sao không nên catch Exception quá rộng.
- [ ] Biết Global Exception Handler trong Spring Boot.
- [ ] Phân biệt `final`, `finally`, `finalize`.
