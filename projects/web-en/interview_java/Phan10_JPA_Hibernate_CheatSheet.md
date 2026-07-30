# 📄 PHẦN 10 — JPA/HIBERNATE 

---

## 1. JPA vs Hibernate

| JPA | Hibernate |
|---|---|
| Specification (chuẩn Java) | Implementation của JPA |
| `javax.persistence` / `jakarta.persistence` | `org.hibernate` |
| Định nghĩa Entity, Repository, Query | Cung cấp engine ORM thực tế |

> Spring Data JPA giúp việc dùng JPA dễ dàng hơn qua `JpaRepository`.

---

## 2. Entity cơ bản

```java
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
}
```

---

## 3. Lazy vs Eager

| | **LAZY** | **EAGER** |
|---|---|---|
| Load quan hệ | Khi nào gọi getter mới load | Load ngay khi load entity |
| Hiệu năng | Tốt hơn | Dễ load thừa dữ liệu |
| Mặc định | `@OneToMany`, `@ManyToMany` | `@ManyToOne`, `@OneToOne` |

**Ví dụ:**
```java
@ManyToOne(fetch = FetchType.LAZY)   // khuyến nghị
private Category category;
```

---

## 4. N+1 Query Problem

**Vấn đề:** Load 1 list entity, sau đó vòng lặp gọi thêm N câu query cho quan hệ.

**Giải pháp:**
- Dùng `EntityGraph`.
- Dùng `JOIN FETCH` trong JPQL.
- Dùng `@Query` với native SQL hoặc JPQL.

**Ví dụ:**
```java
@Query("SELECT p FROM Product p JOIN FETCH p.category")
List<Product> findAllWithCategory();
```

---

## 5. Persistence Context & Dirty Checking

- **Persistence Context:** Vùng cache của EntityManager chứa managed entities.
- **Dirty Checking:** Hibernate tự động so sánh entity khi transaction commit, chỉ update những field thay đổi.

**Ví dụ:**
```java
@Transactional
public void updatePrice(Long id, BigDecimal newPrice) {
    Product p = repo.findById(id).orElseThrow();
    p.setPrice(newPrice);  // không cần save, Hibernate tự flush
}
```

---

## 6. Spring Data JPA Repository

```java
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryName(String categoryName);

    @Query("SELECT p FROM Product p WHERE p.price > :price")
    List<Product> findExpensive(@Param("price") BigDecimal price);
}
```

---

## 7. Cascade & Orphan Removal

```java
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List<OrderItem> items;
```

- `CascadeType.ALL`: thao tác order sẽ lan xuống items.
- `orphanRemoval = true`: xóa item khỏi list sẽ xóa trong DB.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Lazy vs Eager?**
> "Lazy chỉ load dữ liệu quan hệ khi gọi getter, giúp tránh load thừa. Eager load ngay khi load entity, dễ gây chậm nếu quan hệ lớn. Mặc định ManyToOne là Eager, nhưng mình thường đổi thành Lazy để tối ưu."

**Câu: N+1 query là gì?**
> "N+1 là khi load N entity rồi trong vòng lặp lại gọi thêm N câu query cho quan hệ. Ví dụ load list Product rồi gọi product.getCategory() sẽ sinh ra nhiều query. Cách xử lý là dùng JOIN FETCH hoặc EntityGraph để load trong 1 query."

---

## ✅ CHECKLIST PHẦN 10

- [ ] Phân biệt JPA, Hibernate, Spring Data JPA.
- [ ] Viết Entity cơ bản.
- [ ] Phân biệt Lazy vs Eager.
- [ ] Giải thích N+1 query và cách fix.
- [ ] Giải thích Persistence Context & Dirty Checking.
- [ ] Viết Spring Data JPA Repository.
- [ ] Biết Cascade và Orphan Removal.
