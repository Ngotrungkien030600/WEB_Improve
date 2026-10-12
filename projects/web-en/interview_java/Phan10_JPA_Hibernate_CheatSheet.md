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

---

## 8. Query Derivation — Spring đọc tên method

Spring Data không đoán ý từ câu tiếng Anh bất kỳ. Nó phân tích method theo quy ước: phần giới thiệu như `find...By`/`exists...By` là subject; sau `By` là điều kiện dựa trên property của Entity. Spring kiểm tra property path khi tạo repository; viết sai tên field thường làm ứng dụng lỗi lúc khởi động.

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByPriceGreaterThan(BigDecimal price);       // price > ?
    List<Product> findByPriceGreaterThanEqual(BigDecimal price);  // price >= ?
    List<Product> findByPriceLessThan(BigDecimal price);          // price < ?
    List<Product> findByPriceLessThanEqual(BigDecimal price);     // price <= ?
    List<Product> findByPriceBetween(BigDecimal min, BigDecimal max);
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findTop5ByOrderByPriceDesc();
}
```

Đọc `findByCategoryNameAndPriceGreaterThanEqual(categoryName, minPrice)` thành: tìm Product có `category.name` bằng categoryName VÀ `price >= minPrice`. `And`, `Or`, `Between`, `Containing`, `IgnoreCase`, `OrderBy`, `Top` là các keyword có ý nghĩa. Chúng phải ứng với property và kiểu dữ liệu hợp lệ. Khi path lồng nhau có thể mơ hồ, `_` đánh dấu điểm tách, ví dụ `findByAddress_City`.

### Bên dưới lớp vỏ: proxy và query

Repository là interface nhưng Spring Data tạo một proxy cho interface đó. Proxy định tuyến lời gọi CRUD tới base implementation (JPA thường dùng `SimpleJpaRepository`) và lời gọi query method tới query executor. Method name được parse để tạo store-specific query; database vẫn thực thi SQL sau khi JPA/Hibernate chuyển JPQL/criteria thành SQL. Đây là runtime repository proxy, khác với MapStruct sinh source Java ở compile time.

### Khi nào derived query không còn phù hợp?

- Dùng khi filter ngắn, đọc được ngay và bám property đơn giản.
- Dùng `@Query` khi cần join, projection, aggregate hoặc muốn đặt JPQL cạnh method.
- Dùng `Specification` khi form tìm kiếm có nhiều filter tùy chọn và cần ghép predicate.
- Dùng Querydsl khi cần DSL fluent có kiểm tra kiểu; Q-types được sinh bởi annotation processor.
- Tránh method dài kiểu `findByAAndBOrCAndD...` vì ngoặc logic và ý định khó nhìn; tách predicate hoặc viết query tường minh.

---

## 9. `@Query`, JPQL và native SQL

JPQL truy vấn Entity/property (`Product`, `price`), không truy vấn tên table/column. `nativeQuery = true` mới là SQL phụ thuộc database.

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("select p from Product p " +
           "where p.price >= :min and p.price < :max " +
           "and lower(p.name) like lower(concat('%', :keyword, '%'))")
    List<Product> search(@Param("min") BigDecimal min,
                         @Param("max") BigDecimal max,
                         @Param("keyword") String keyword);

    @Query(value = "select * from products where price >= :min",
           nativeQuery = true)
    List<Product> nativeSearch(@Param("min") BigDecimal min);
}
```

`@Query` làm query rõ ràng hơn khi method-name parser khiến tên quá dài. Với `UPDATE`/`DELETE`, dùng `@Modifying` và transaction phù hợp. Luôn bind parameter; không nối trực tiếp chuỗi user vào JPQL/SQL.

---

## 10. DSL tìm kiếm động: Specification và Querydsl

DSL là cách biểu diễn điều kiện bằng API thay vì ráp chuỗi SQL. Specification dựa trên JPA Criteria; Querydsl là thư viện DSL riêng dùng Q-type.

```java
// Specification: mỗi filter chỉ thêm khi người dùng có nhập
public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> { }

Specification<Product> spec = Specification.where(null);
if (minPrice != null) {
    spec = spec.and((root, query, cb) ->
        cb.greaterThanOrEqualTo(root.get("price"), minPrice));
}
if (keyword != null && !keyword.isBlank()) {
    spec = spec.and((root, query, cb) ->
        cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
}
List<Product> result = repository.findAll(spec);

// Querydsl: QProduct được generate khi build; các phép so sánh có kiểu
QProduct p = QProduct.product;
BooleanExpression condition = p.price.goe(minPrice) // greater-or-equal: >=
    .and(p.price.lt(maxPrice))                       // less-than: <
    .and(p.stock.gt(0))                               // greater-than: >
    .and(p.stock.loe(maxStock));                      // less-or-equal: <=
```

Nhớ mapping chính xác: Querydsl `gt` = `>`, `goe` = `>=`, `lt` = `<`, `loe` = `<=`. Không có method Querydsl tên `gte`; “greater than or equal” được viết là `goe`.

---

## 11. MapStruct: vì sao mapper được generate?

### MapStruct làm gì?

`@Mapper` đánh dấu interface. Annotation processor của MapStruct chạy trong quá trình compile, đọc source/target types và sinh class implementation Java (thường là `ProductMapperImpl`) vào generated-sources. Implementation gọi getter/setter/constructor trực tiếp; MapStruct không cần dò field bằng reflection mỗi lần map.

```java
@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ProductMapper {
    @Mapping(target = "id", ignore = true)
    Product toEntity(ProductCreateRequest request);

    ProductResponse toResponse(Product product);
}
```

Với field cùng tên và kiểu tương thích, MapStruct tự map theo convention. Tên khác nhau thì khai báo `@Mapping(source = "...", target = "...")`; field không rõ cách đổi kiểu có thể cần method mapping riêng. `unmappedTargetPolicy = ERROR` giúp build báo lỗi nếu target còn field chưa được xử lý.

### Tại sao không viết hết mapping trong Service?

Service vẫn gọi Mapper. Service nên điều phối use case và business rules; Mapper giữ quy tắc chuyển Entity ↔ DTO. Nếu rải `dto.setX(entity.getX())` trong nhiều service/controller thì mapping bị lặp, khó review và dễ quên field. Với một DTO rất nhỏ và chỉ dùng một chỗ, mapping thủ công vẫn hoàn toàn ổn; MapStruct hữu ích khi mapping lặp lại hoặc nhiều field.

```java
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repository;
    private final ProductMapper mapper;

    @Transactional
    public ProductResponse create(ProductCreateRequest request) {
        if (repository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateProductException(request.getName());
        }
        Product entity = mapper.toEntity(request); // chuyển hình dạng dữ liệu
        Product saved = repository.save(entity);   // lưu trữ
        return mapper.toResponse(saved);           // trả API DTO
    }
}
```

### MapStruct khác Spring Data query generation thế nào?

| Cơ chế | Đầu vào | Khi nào xử lý | Đầu ra |
|---|---|---|---|
| Derived query | Tên method repository + Entity properties | Spring Data tạo/khởi tạo repository proxy | Query object/JPQL hoặc store-specific query để chạy qua JPA |
| MapStruct | Mapper interface + `@Mapping` | Java annotation processing lúc compile | Source Java `*MapperImpl` được compile cùng ứng dụng |
| Querydsl Q-types | Entity/model + Querydsl annotation processor | Compile/build | Class Q có API DSL an toàn kiểu |

---

## 12. Bài thực hành: tìm sản phẩm trong màn hình tìm kiếm

### Bối cảnh

Màn hình có ba filter tùy chọn: category, giá min/max, và từ khóa. Kết quả cần phân trang, không trả Entity trực tiếp ra API.

### Tự làm theo từng bước

1. Viết 3 derived methods ngắn cho trường hợp category, min price, và keyword.
2. Viết một method `@Query` cho điều kiện `price >= min AND price < max`.
3. Giải thích tại sao 3 filter tùy chọn nên dùng Specification hoặc Querydsl thay vì tạo 8 method cho mọi tổ hợp có/không có filter.
4. Map `ProductCreateRequest` sang Entity và Entity sang `ProductResponse` bằng MapStruct.
5. Đặt duplicate-name check trong Service, không đặt trong Mapper. Giải thích vì sao đó là business rule.
6. Thêm test với giá bằng min, giá bằng max, keyword không khớp, category thiếu và kết quả rỗng.
7. Xem SQL/parameters thực tế và kiểm tra query có trả đúng trang hay vô tình load hết dữ liệu.

### Cách tự kiểm tra

Bạn hiểu bài khi có thể dự đoán điều kiện query bằng lời trước khi chạy, giải thích `gt/goe/lt/loe`, chỉ ra code do MapStruct generate, và giải thích tại sao Service gọi Mapper nhưng không chứa từng dòng gán field.

---

## 13. Câu hỏi phỏng vấn kỹ thuật — trả lời bằng hiểu biết và trade-off

**1. `findByPriceGreaterThanEqual` được tạo như thế nào?**

Spring Data parse subject và predicate của tên method, resolve `price` thành property của Product, nhận diện `GreaterThanEqual`, rồi tạo query cho store. Repository proxy chuyển lời gọi method sang query executor. Database chỉ chạy query khi method được gọi; Spring không tạo sẵn một file SQL source cho từng method.

**2. Khi nào chọn derived query, `@Query`, Specification hay Querydsl?**

Derived query cho predicate ngắn, dễ đọc. `@Query` cho query tường minh hoặc phức tạp vừa phải. Specification hợp filter tùy chọn dùng Criteria. Querydsl hợp DSL fluent và type safety khi dự án đã có cấu hình generate Q-types. Chọn cách dễ đọc, kiểm thử và tối ưu cho query cụ thể.

**3. Phân biệt `gt`, `goe`, `lt`, `loe`?**

Trong Querydsl: `gt` là `>`, `goe` là `>=`, `lt` là `<`, `loe` là `<=`. Trong tên derived query thường dùng `GreaterThan`, `GreaterThanEqual`, `LessThan`, `LessThanEqual`.

**4. MapStruct sinh code bằng cách nào?**

Annotation processor đọc mapper interface và model trong lúc compile, rồi ghi implementation Java vào generated-sources. Compiler compile implementation đó như source bình thường. Khi chạy, Spring inject implementation dưới dạng bean nếu dùng `componentModel = "spring"`.

**5. Vì sao không đặt mapping trong Service?**

Service vẫn gọi mapping, nhưng không nên lặp chi tiết sao chép field. Tách mapper giúp Service tập trung vào use case, còn mapping tập trung ở một nơi, dễ reuse và review. Nếu chỉ một mapping nhỏ dùng duy nhất một lần, viết thủ công cũng hợp lý.

**6. Query method khác MapStruct generation ở điểm nào?**

Query method được Spring Data phân tích theo quy ước để thiết lập query cho repository proxy. MapStruct dùng Java annotation processing để generate class implementation ở compile time. Một bên tạo cơ chế thực thi repository query; bên kia tạo source code chuyển DTO/entity.

**7. Tại sao tên `findByPriceGreaterThanEqualAndCategoryName...` có thể là code smell?**

Method quá dài làm lộ quá nhiều chi tiết lọc, dễ mơ hồ với `And`/`Or`, và khó thêm filter tùy chọn. Có thể chuyển sang Specification/Querydsl hoặc `@Query`, rồi thêm repository test để bảo đảm predicate đúng.

**8. `@Query` dùng JPQL hay SQL?**

Mặc định Spring Data JPA `@Query` viết JPQL, truy cập Entity/property. Chỉ khi bật `nativeQuery = true` mới viết SQL theo table/column cụ thể. JPQL thường portable hơn giữa database.

---

## ✅ CHECKLIST THỰC CHIẾN PHẦN BỔ SUNG

- [ ] Tự đọc một derived method và viết lại thành điều kiện logic.
- [ ] Phân biệt `GreaterThan`, `GreaterThanEqual`, `LessThan`, `LessThanEqual`.
- [ ] Biết lúc nào query method dài quá và chuyển sang `@Query`/DSL.
- [ ] Phân biệt JPQL với native SQL.
- [ ] Giải thích repository proxy mà không nói Spring generate một class SQL cho mỗi method.
- [ ] Phân biệt Specification và Querydsl; nhớ `gt/goe/lt/loe`.
- [ ] Giải thích annotation processor sinh `ProductMapperImpl` lúc compile.
- [ ] Nói được vì sao Service gọi Mapper nhưng vẫn giữ business rules trong Service.
- [ ] Làm bài filter sản phẩm và kiểm tra bằng test/SQL thực tế.
