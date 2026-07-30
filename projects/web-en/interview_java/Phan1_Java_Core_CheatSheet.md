# 📄 PHẦN 1 — JAVA CORE 

---

## 1. JDK / JRE / JVM

| Thành phần | Chức năng |
|---|---|
| **JVM** | Môi trường thực thi bytecode (.class). Dịch bytecode thành machine code của OS. Java portable nhờ JVM. |
| **JRE** | = JVM + thư viện runtime cần thiết để chạy app. |
| **JDK** | = JRE + công cụ phát triển (javac, debugger, jar...). |

**Flow:** `Java Source (.java)` → `javac` → `Bytecode (.class)` → `JVM` → `Machine Code / OS`

---

## 2. Primitive vs Reference

| Primitive | Reference |
|---|---|
| Lưu giá trị trực tiếp: `int`, `long`, `boolean`, `double`, `char`, `byte`, `short`, `float` | Lưu địa chỉ tham chiếu đến object: `String`, `User`, `List`, `Object` |
| Nằm trên Stack | Reference trên Stack, object thực tế nằm trên Heap |

**Stack:** chứa call stack, local variables, references trong method scope.  
**Heap:** chứa object, được quản lý bởi Garbage Collector.

---

## 3. Pass by Value

Java **luôn pass by value**.

- Primitive: truyền bản sao giá trị.
- Object: truyền bản sao của reference → có thể thay đổi **state** object bên trong method, nhưng **không thay đổi reference** của biến bên ngoài.

```java
void change(User u) { u.setName("A"); }      // ✅ state thay đổi
void swap(User a, User b) { User tmp = a; a = b; b = tmp; } // ❌ không swap được
```

---

## 4. `==` vs `equals()`

| `==` | `equals()` |
|---|---|
| Primitive: so sánh giá trị | Object: so sánh nội dung (nếu override) |
| Object: so sánh reference | Mặc định của Object giống `==` |

**String immutable** vì:
- Hỗ trợ **String Pool** (tiết kiệm bộ nhớ).
- **Thread-safe** không cần đồng bộ.
- `hashCode()` ổn định → dùng làm key trong HashMap an toàn.

> Nối chuỗi bằng `+` tạo object mới. Dùng `StringBuilder` (không thread-safe, nhanh) hoặc `StringBuffer` (thread-safe, chậm hơn) khi cần nối nhiều.

---

## 5. `equals()` và `hashCode()`

**Quy tắc:**
- Nếu `a.equals(b) == true` → `a.hashCode() == b.hashCode()` (bắt buộc).
- Ngược lại không nhất thiết.

**Tại sao phải đi cùng nhau?**
- `HashMap`/`HashSet` dùng `hashCode()` để tìm bucket.
- Sau đó dùng `equals()` để xác nhận key đúng trong bucket.
- Override `equals()` mà quên `hashCode()` → object bị tìm/sắp xếp sai trong HashMap/HashSet.

---

## 6. OOP — 4 tính chất

| Tính chất | Ý nghĩa | Ví dụ thực tế |
|---|---|---|
| **Encapsulation** | Che giấu trạng thái, truy cập qua getter/setter | `private balance`, `public getBalance()` |
| **Inheritance** | Class con kế thừa thuộc tính/phương thức class cha | `class Dog extends Animal` |
| **Polymorphism** | Cùng method call, hành vi khác nhau | `Animal a = new Dog(); a.speak();` |
| **Abstraction** | Ẩn chi tiết, chỉ hiển thị chức năng cần thiết | `interface PaymentService` |

---

## 7. Overloading vs Overriding

| Overloading | Overriding |
|---|---|
| Cùng tên method, **khác tham số** | Class con định nghĩa lại method của cha |
| **Compile-time** polymorphism | **Runtime** polymorphism |
| Cùng class | Khác class (is-a) |

---

## 8. Interface vs Abstract Class

| Interface | Abstract Class |
|---|---|
| Định nghĩa **contract / capability** | Dùng khi có quan hệ **is-a** và chia sẻ state/behavior |
| Một class implement **nhiều interface** | Một class chỉ **extends 1 abstract class** |
| Java 8+: có default/static methods | Có constructor, instance variables |

---

## 9. Composition vs Inheritance

- **Inheritance:** is-a. Dễ bị tightly coupled với class cha.
- **Composition:** has-a. Linh hoạt hơn, giảm coupling.

> Ưu tiên **Composition over Inheritance** khi có thể.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Java pass by value hay pass by reference?**
> "Java luôn pass by value. Với object, giá trị truyền vào là bản sao của reference. Nên nếu trong method mình thay đổi state của object thì bên ngoài sẽ thấy, nhưng nếu gán lại object mới cho tham số thì reference bên ngoài không đổi."

**Câu: equals và hashCode tại sao phải đi cùng nhau?**
> "Vì HashMap dùng hashCode để xác định bucket, rồi dùng equals để kiểm tra key thực sự. Nếu hai object equals bằng nhau mà hashCode khác, HashMap sẽ tìm sai bucket và coi như khác nhau. Nên quy tắc là: equals true thì hashCode phải bằng nhau."

---

## ✅ CHECKLIST PHẦN 1

- [ ] Giải thích JDK / JRE / JVM và flow compile-run.
- [ ] Phân biệt Primitive vs Reference, Stack vs Heap.
- [ ] Giải thích pass by value với object.
- [ ] Phân biệt `==` vs `equals()`.
- [ ] Giải thích String immutable và String Pool.
- [ ] Giải thích quan hệ `equals()` / `hashCode()`.
- [ ] Nêu 4 tính chất OOP + ví dụ.
- [ ] Phân biệt Overloading / Overriding.
- [ ] Phân biệt Interface / Abstract Class.
- [ ] Giải thích Composition vs Inheritance.
