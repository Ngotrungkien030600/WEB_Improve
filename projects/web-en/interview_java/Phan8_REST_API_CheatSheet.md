# 📄 PHẦN 8 — REST API 

---

## 1. HTTP Methods

| Method | Dùng để | Idempotent |
|---|---|---|
| `GET` | Lấy dữ liệu | ✅ Có |
| `POST` | Tạo mới | ❌ Không |
| `PUT` | Cập nhật toàn bộ / replace | ✅ Có |
| `PATCH` | Cập nhật một phần | ❌ Không (thường) |
| `DELETE` | Xóa | ✅ Có |

---

## 2. HTTP Status Codes

| Code | Ý nghĩa |
|---|---|
| 200 OK | Thành công |
| 201 Created | Tạo thành công |
| 400 Bad Request | Request sai định dạng / validation |
| 401 Unauthorized | Chưa xác thực |
| 403 Forbidden | Đã xác thực nhưng không có quyền |
| 404 Not Found | Không tìm thấy resource |
| 500 Internal Server Error | Lỗi server |

> **401 vs 403:** 401 = chưa đăng nhập / token sai; 403 = đã đăng nhập nhưng không đủ quyền.

---

## 3. Idempotency

Gọi nhiều lần với cùng input cho kết quả giống nhau và không gây side effect lặp.

**Ví dụ:**
- `GET /products/1` gọi 10 lần vẫn trả về cùng product.
- `PUT /products/1` với cùng body thay thế object, kết quả cuối cùng như nhau.
- `POST /orders` gọi 2 lần → tạo 2 đơn hàng, **không idempotent**.

**Xử lý POST idempotent:** dùng idempotency key.

---

## 4. REST URL Design

```
GET    /api/products         # danh sách
GET    /api/products?page=1&size=10   # phân trang
GET    /api/products/{id}    # chi tiết
POST   /api/products         # tạo mới
PUT    /api/products/{id}   # cập nhật toàn bộ
PATCH  /api/products/{id}   # cập nhật một phần
DELETE /api/products/{id}   # xóa
```

---

## 5. Spring Boot REST Controller

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> get(@PathVariable Long id) { ... }

    @PostMapping
    public ResponseEntity<ProductDto> create(@RequestBody @Valid ProductRequest request) { ... }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> update(@PathVariable Long id,
                                            @RequestBody ProductRequest request) { ... }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { ... }
}
```

---

## 6. Pagination

```java
@GetMapping
public Page<ProductDto> list(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    return service.findAll(PageRequest.of(page, size));
}
```

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: GET vs POST?**
> "GET dùng để lấy dữ liệu, idempotent, không có body. POST dùng để tạo mới, không idempotent, có thể có body."

**Câu: 401 vs 403?**
> "401 là Unauthorized, nghĩa là request chưa xác thực hoặc token sai. 403 là Forbidden, request đã xác thực nhưng user không có quyền truy cập resource."

---

## ✅ CHECKLIST PHẦN 8

- [ ] Phân biệt 5 HTTP methods và idempotency.
- [ ] Biết status code phổ biến.
- [ ] Phân biệt 401 vs 403.
- [ ] Giải thích idempotency.
- [ ] Thiết kế REST URL đúng chuẩn.
- [ ] Viết @RestController cơ bản.
- [ ] Biết pagination với Spring Data.
