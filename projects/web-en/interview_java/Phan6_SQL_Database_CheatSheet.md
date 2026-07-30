# 📄 PHẦN 6 — SQL & DATABASE 

---

## 1. JOIN

| JOIN | Mô tả |
|---|---|
| `INNER JOIN` | Chỉ lấy dòng có match ở cả 2 bảng |
| `LEFT JOIN` | Lấy tất cả từ bảng trái, null nếu không match |
| `RIGHT JOIN` | Lấy tất cả từ bảng phải |
| `FULL OUTER JOIN` | Lấy tất cả từ cả 2 bảng |

**Ví dụ:**
```sql
SELECT u.name, o.order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

---

## 2. GROUP BY & HAVING

```sql
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 5000;
```

- `WHERE` lọc trước khi group.
- `HAVING` lọc sau khi group.

---

## 3. INDEX

Cấu trúc dữ liệu (thường B-Tree) giúp truy vấn WHERE nhanh hơn.

**Ví dụ:**
```sql
CREATE INDEX idx_email ON users(email);
```

| Ưu điểm | Nhược điểm |
|---|---|
| Tìm kiếm nhanh hơn | Tốn dung lượng |
| ORDER BY nhanh hơn | INSERT/UPDATE/DELETE chậm hơn vì cập nhật index |

> Không nên tạo index cho cột có cardinality thấp (ví dụ: gender).

---

## 4. Transaction & ACID

| Thuộc tính | Ý nghĩa |
|---|---|
| **A**tomicity | Toàn bộ hoặc không gì cả |
| **C**onsistency | Dữ liệu chuyển từ trạng thái hợp lệ này sang trạng thái hợp lệ khác |
| **I**solation | Các transaction không ảnh hưởng lẫn nhau |
| **D**urability | Dữ liệu đã commit được lưu vĩnh viễn |

---

## 5. Isolation Levels

| Level | Dirty Read | Non-repeatable Read | Phantom Read |
|---|---|---|---|
| READ UNCOMMITTED | Có thể | Có thể | Có thể |
| READ COMMITTED | Không | Có thể | Có thể |
| REPEATABLE READ | Không | Không | Có thể (MySQL InnoDB mặc định, ngăn phantom) |
| SERIALIZABLE | Không | Không | Không |

---

## 6. Normalization

Tách bảng để giảm dư thừa dữ liệu và tránh anomaly.

| Dạng | Mô tả ngắn |
|---|---|
| 1NF | Mỗi cột chỉ chứa giá trị nguyên tử |
| 2NF | 1NF + không có partial dependency |
| 3NF | 2NF + không có transitive dependency |

---

## 7. Query chậm → optimize

- Kiểm tra `EXPLAIN` / execution plan.
- Thêm index cho cột trong WHERE, JOIN, ORDER BY.
- Tránh `SELECT *`.
- Phân trang thay vì load toàn bộ.
- Tối ưu subquery → JOIN.
- Tăng connection pool nếu cần.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Index là gì, khi nào dùng?**
> "Index là cấu trúc dữ liệu giúp tìm kiếm nhanh, giống như mục lục sách. Ví dụ tạo index trên cột email để tìm user theo email nhanh. Nhược điểm là insert/update/delete chậm hơn và tốn dung lượng. Không nên index cột có ít giá trị khác nhau như gender."

---

## ✅ CHECKLIST PHẦN 6

- [ ] Giải thích 4 loại JOIN.
- [ ] Dùng GROUP BY, HAVING, WHERE đúng.
- [ ] Giải thích INDEX, ưu/nhược điểm.
- [ ] Nói được ACID.
- [ ] Phân biệt 4 isolation levels.
- [ ] Biết normalization cơ bản.
- [ ] Biết cách optimize query chậm.
