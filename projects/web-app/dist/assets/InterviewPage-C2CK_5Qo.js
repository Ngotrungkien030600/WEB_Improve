import{C as e,M as t,N as n,P as r,S as i,g as a,h as o,n as s,p as c,u as l,v as u}from"./index-DsBKoE__.js";import{t as d}from"./navigate-DCY_BOLb.js";import{t as f}from"./markdown-RpJYUkAQ.js";window.interviewTopics=[{file:`README.md`,title:`📚 Java Backend Interview Master Guide — Cheat Sheets`,content:`Tổng hợp 20 cheat sheet (mỗi phần ~1 trang A4) để ôn tập Java Backend Interview.

## 📑 Danh sách phần

1. [Phần 1 — Java Core](./Phan1_Java_Core_CheatSheet.md)
2. [Phần 2 — Collections](./Phan2_Collections_CheatSheet.md)
3. [Phần 3 — Exception](./Phan3_Exception_CheatSheet.md)
4. [Phần 4 — Java 8+](./Phan4_Java8_CheatSheet.md)
5. [Phần 5 — Multithreading](./Phan5_Multithreading_CheatSheet.md)
6. [Phần 6 — SQL & Database](./Phan6_SQL_Database_CheatSheet.md)
7. [Phần 7 — Spring Boot](./Phan7_SpringBoot_CheatSheet.md)
8. [Phần 8 — REST API](./Phan8_REST_API_CheatSheet.md)
9. [Phần 9 — DTO & Validation](./Phan9_DTO_Validation_CheatSheet.md)
10. [Phần 10 — JPA/Hibernate](./Phan10_JPA_Hibernate_CheatSheet.md)
11. [Phần 11 — Transaction](./Phan11_Transaction_CheatSheet.md)
12. [Phần 12 — Security & JWT](./Phan12_Security_JWT_CheatSheet.md)
13. [Phần 13 — Docker](./Phan13_Docker_CheatSheet.md)
14. [Phần 14 — Kafka](./Phan14_Kafka_CheatSheet.md)
15. [Phần 15 — AWS](./Phan15_AWS_CheatSheet.md)
16. [Phần 16 — CI/CD](./Phan16_CICD_CheatSheet.md)
17. [Phần 17 — Microservices](./Phan17_Microservices_CheatSheet.md)
18. [Phần 18 — System Design](./Phan18_SystemDesign_CheatSheet.md)
19. [Phần 19 — Project Mẫu](./Phan19_Project_Mau_CheatSheet.md)
20. [Phần 20 — Câu Hỏi Tình Huống](./Phan20_Cau_Hoi_Tinh_Huong_CheatSheet.md)
21. [Phần 21 — 100+ Câu Hỏi Tự Kiểm Tra](./Phan21_100_Cau_Hoi_Tu_Kiem_Tra.md)
22. [Phần 21 — Đáp án chi tiết](./Phan21_100_Cau_Hoi_Tu_Kiem_Tra_Tra_Loi.md)

## 🎯 Cách dùng

- Mỗi file là một chủ đề riêng, đủ để in ra 1 trang A4.
- Mỗi phần có code mẫu, câu trả lởi 60 giây và checklist tự kiểm tra.
- Đi qua từng phần, đánh dấu checklist khi đã nắm chắc.

## ✅ Lộ trình ôn tập đề xuất

**Tuần 1:** Java Core → Collections → Exception → Java 8+ → Multithreading
**Tuần 2:** SQL & Database → Spring Boot → REST API → DTO & Validation → JPA/Hibernate
**Tuần 3:** Transaction → Security & JWT → Docker → Kafka → AWS
**Tuần 4:** CI/CD → Microservices → System Design → Project → Câu hỏi tình huống → 100+ câu hỏi tự kiểm tra → đối chiếu đáp án

Chúc bạn thi phỏng vấn thành công! 🚀`,checklist:[]},{file:`Phan1_Java_Core_CheatSheet.md`,title:`📄 PHẦN 1 — JAVA CORE`,content:`---

## 1. JDK / JRE / JVM

| Thành phần | Chức năng |
|---|---|
| **JVM** | Môi trường thực thi bytecode (.class). Dịch bytecode thành machine code của OS. Java portable nhờ JVM. |
| **JRE** | = JVM + thư viện runtime cần thiết để chạy app. |
| **JDK** | = JRE + công cụ phát triển (javac, debugger, jar...). |

**Flow:** \`Java Source (.java)\` → \`javac\` → \`Bytecode (.class)\` → \`JVM\` → \`Machine Code / OS\`

---

## 2. Primitive vs Reference

| Primitive | Reference |
|---|---|
| Lưu giá trị trực tiếp: \`int\`, \`long\`, \`boolean\`, \`double\`, \`char\`, \`byte\`, \`short\`, \`float\` | Lưu địa chỉ tham chiếu đến object: \`String\`, \`User\`, \`List\`, \`Object\` |
| Nằm trên Stack | Reference trên Stack, object thực tế nằm trên Heap |

**Stack:** chứa call stack, local variables, references trong method scope.  
**Heap:** chứa object, được quản lý bởi Garbage Collector.

---

## 3. Pass by Value

Java **luôn pass by value**.

- Primitive: truyền bản sao giá trị.
- Object: truyền bản sao của reference → có thể thay đổi **state** object bên trong method, nhưng **không thay đổi reference** của biến bên ngoài.

\`\`\`java
void change(User u) { u.setName("A"); }      // ✅ state thay đổi
void swap(User a, User b) { User tmp = a; a = b; b = tmp; } // ❌ không swap được
\`\`\`

---

## 4. \`==\` vs \`equals()\`

| \`==\` | \`equals()\` |
|---|---|
| Primitive: so sánh giá trị | Object: so sánh nội dung (nếu override) |
| Object: so sánh reference | Mặc định của Object giống \`==\` |

**String immutable** vì:
- Hỗ trợ **String Pool** (tiết kiệm bộ nhớ).
- **Thread-safe** không cần đồng bộ.
- \`hashCode()\` ổn định → dùng làm key trong HashMap an toàn.

> Nối chuỗi bằng \`+\` tạo object mới. Dùng \`StringBuilder\` (không thread-safe, nhanh) hoặc \`StringBuffer\` (thread-safe, chậm hơn) khi cần nối nhiều.

---

## 5. \`equals()\` và \`hashCode()\`

**Quy tắc:**
- Nếu \`a.equals(b) == true\` → \`a.hashCode() == b.hashCode()\` (bắt buộc).
- Ngược lại không nhất thiết.

**Tại sao phải đi cùng nhau?**
- \`HashMap\`/\`HashSet\` dùng \`hashCode()\` để tìm bucket.
- Sau đó dùng \`equals()\` để xác nhận key đúng trong bucket.
- Override \`equals()\` mà quên \`hashCode()\` → object bị tìm/sắp xếp sai trong HashMap/HashSet.

---

## 6. OOP — 4 tính chất

| Tính chất | Ý nghĩa | Ví dụ thực tế |
|---|---|---|
| **Encapsulation** | Che giấu trạng thái, truy cập qua getter/setter | \`private balance\`, \`public getBalance()\` |
| **Inheritance** | Class con kế thừa thuộc tính/phương thức class cha | \`class Dog extends Animal\` |
| **Polymorphism** | Cùng method call, hành vi khác nhau | \`Animal a = new Dog(); a.speak();\` |
| **Abstraction** | Ẩn chi tiết, chỉ hiển thị chức năng cần thiết | \`interface PaymentService\` |

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

## ✅ CHECKLIST PHẦN 1`,checklist:[`Giải thích JDK / JRE / JVM và flow compile-run.`,`Phân biệt Primitive vs Reference, Stack vs Heap.`,`Giải thích pass by value với object.`,"Phân biệt `==` vs `equals()`.",`Giải thích String immutable và String Pool.`,"Giải thích quan hệ `equals()` / `hashCode()`.",`Nêu 4 tính chất OOP + ví dụ.`,`Phân biệt Overloading / Overriding.`,`Phân biệt Interface / Abstract Class.`,`Giải thích Composition vs Inheritance.`]},{file:`Phan2_Collections_CheatSheet.md`,title:`📄 PHẦN 2 — COLLECTIONS`,content:`---

## 1. ArrayList vs LinkedList

| | **ArrayList** | **LinkedList** |
|---|---|---|
| **Cấu trúc** | Dynamic array | Doubly linked list |
| **Truy cập index** | O(1) | O(n) |
| **Thêm/xóa cuối** | O(1) amortized, resize O(n) | O(1) nếu có node |
| **Thêm/xóa giữa** | O(n) vì phải dịch | O(1) nếu đã có node (còn tìm node O(n)) |
| **Bộ nhớ** | Ít overhead hơn | Nhiều overhead vì node, next, prev |

**Ví dụ:**
\`\`\`java
List<String> a = new ArrayList<>();    // random access nhiều
List<String> b = new LinkedList<>();   // chèn/xóa đầu/cuối liên tục
\`\`\`

---

## 2. HashSet vs TreeSet

| | **HashSet** | **TreeSet** |
|---|---|---|
| **Thứ tự** | Không đảm bảo | Sắp xếp tự nhiên |
| **Tốc độ** | O(1) trung bình | O(log n) |
| **Dựa trên** | HashMap | Red-Black Tree |
| **Null** | Cho phép 1 null | Không cho null |

**Ví dụ:**
\`\`\`java
Set<String> h = new HashSet<>();    // unique, không cần thứ tự
Set<String> t = new TreeSet<>();   // unique, sắp xếp tự nhiên
\`\`\`

---

## 3. HashMap hoạt động thế nào?

1. Tính \`hashCode()\` của key.
2. Xác định **bucket index** bằng \`(n - 1) & hash\`.
3. Nếu bucket trống → lưu entry.
4. Nếu bucket có dữ liệu → dùng \`equals()\` để tìm key đúng (xử lý collision).

**Ví dụ:**
\`\`\`java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 100);   // hash("apple") → bucket
map.get("apple");        // hash → bucket → equals
\`\`\`

---

## 4. Collision trong HashMap

Collision xảy ra khi 2 key khác nhau có hash trùng bucket.

- **Java 8 trước:** Linked List.
- **Java 8+:** Linked List, nếu ≥ 8 entries thì chuyển sang **Red-Black Tree** (nếu key implement Comparable).

**Ví dụ:**
\`\`\`java
Map<String, Integer> map = new HashMap<>();
// Nhiều key khác nhau nhưng hashCode trùng bucket
// HashMap tự chuyển sang Tree ở bucket đó để tìm kiếm nhanh hơn
\`\`\`

---

## 5. HashMap có thread-safe không?

**Không.** Nếu nhiều thread đọc/ghi cùng lúc có thể mất dữ liệu hoặc treo vòng lặp vô hạn.

**Giải pháp:**
- \`Collections.synchronizedMap(new HashMap<>())\` — khóa toàn bộ map.
- \`ConcurrentHashMap\` — khóa theo segment/bucket, hiệu quả hơn.
- \`Hashtable\` — legacy, không nên dùng.

**Ví dụ:**
\`\`\`java
Map<String, Integer> safeMap = new ConcurrentHashMap<>();
\`\`\`

---

## 6. ConcurrentHashMap

- **Thread-safe** mà không khóa toàn bộ map.
- Java 7: khóa **segment**.
- Java 8+: khóa **bucket node** bằng synchronized hoặc CAS.
- Phù hợp đa luồng, throughput cao.

---

## 7. Comparable vs Comparator

| | **Comparable** | **Comparator** |
|---|---|---|
| **Định nghĩa** | Trong class cần sort | Bên ngoài class |
| **Method** | \`int compareTo(T o)\` | \`int compare(T o1, T o2)\` |
| **Số chiến lược** | 1 natural order | Nhiều comparator |
| **Class implement** | \`class User implements Comparable<User>\` | Không cần implement |

**Ví dụ:**
\`\`\`java
// Comparable
class User implements Comparable<User> {
    public int compareTo(User other) { return this.age - other.age; }
}

// Comparator
Comparator<User> byName = Comparator.comparing(u -> u.name);
List<User> users = new ArrayList<>();
users.sort(byName);
\`\`\`

---

## 8. \`HashMap\` resize

- **Load factor** mặc định = 0.75.
- Khi số entry > \`capacity * load factor\` → capacity **gấp đôi** và **rehash** toàn bộ entry.
- Resize tốn chi phí nên nên ước lượng initial capacity nếu biết trước kích thước.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: HashMap hoạt động thế nào?**
> "HashMap lưu dữ liệu theo bucket. Khi put(key, value), nó tính hashCode của key để xác định bucket. Nếu bucket trống thì lưu trực tiếp. Nếu có nhiều key rơi vào cùng bucket (collision), HashMap dùng equals để tìm đúng key. Java 8 trở đi, nếu số phần tử trong bucket ≥ 8 thì chuyển sang Tree để tìm kiếm nhanh hơn."

**Câu: HashMap có thread-safe không?**
> "Không. Để dùng đa luồng, nên dùng ConcurrentHashMap. Nó khóa theo bucket nên hiệu năng tốt hơn nhiều so với Collections.synchronizedMap."

---

## ✅ CHECKLIST PHẦN 2`,checklist:[`Phân biệt ArrayList vs LinkedList.`,`Phân biệt HashSet vs TreeSet.`,`Giải thích HashMap hoạt động (hash → bucket → equals).`,`Giải thích collision và cách xử lý.`,`Giải thích HashMap không thread-safe và ConcurrentHashMap.`,`Phân biệt Comparable vs Comparator.`,`Nói được load factor, resize, rehash.`]},{file:`Phan3_Exception_CheatSheet.md`,title:`📄 PHẦN 3 — EXCEPTION`,content:`---

## 1. Exception Hierarchy

\`\`\`
Throwable
├── Error                    (Không nên catch: OutOfMemoryError, StackOverflowError)
└── Exception
    ├── Checked Exception    (Compiler bắt buộc xử lý: IOException, SQLException)
    └── RuntimeException     (Unchecked: NullPointerException, IllegalArgumentException)
\`\`\`

---

## 2. Checked vs Unchecked Exception

| | **Checked Exception** | **Unchecked Exception** |
|---|---|---|
| **Kế thừa** | \`Exception\` (trừ RuntimeException) | \`RuntimeException\` |
| **Compiler kiểm tra** | Có | Không |
| **Xử lý** | Bắt buộc \`try-catch\` hoặc \`throws\` | Không bắt buộc |
| **Ví dụ** | \`IOException\`, \`SQLException\`, \`FileNotFoundException\` | \`NullPointerException\`, \`IndexOutOfBoundsException\` |
| **Ý nghĩa** | Lỗi ngoại viên, không kiểm soát hoàn toàn | Lỗi logic, dữ liệu không hợp lệ |

**Ví dụ:**
\`\`\`java
// Checked
public void readFile() throws IOException { ... }

// Unchecked
int x = nullValue.length(); // NullPointerException
\`\`\`

---

## 3. \`throw\` vs \`throws\`

| \`throw\` | \`throws\` |
|---|---|
| Ném một exception cụ thể tại dòng code | Khai báo method có thể ném exception |
| Dùng bên trong method | Dùng trong khai báo method |

**Ví dụ:**
\`\`\`java
public void withdraw(double amount) throws InsufficientBalanceException {
    if (balance < amount) {
        throw new InsufficientBalanceException("Not enough money");
    }
}
\`\`\`

---

## 4. \`try-catch-finally\`

\`\`\`java
try {
    // code có thể lỗi
} catch (SpecificException e) {
    // xử lý cụ thể
} finally {
    // luôn chạy, dùng để đóng resource
}
\`\`\`

**Ví dụ try-with-resources (Java 7+):**
\`\`\`java
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    return br.readLine();
} // auto close
\`\`\`

---

## 5. Custom Exception

Tạo exception riêng cho lỗi business, giúp code rõ ràng và dễ xử lý.

**Ví dụ:**
\`\`\`java
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
\`\`\`

---

## 6. Có nên catch \`Exception\` chung?

**Không nên** nếu không có cách xử lý rõ ràng.

- Làm khó debug.
- Có thể nuốt lỗi nghiêm trọng.
- Nên catch exception cụ thể.

**Ví dụ xấu:**
\`\`\`java
try {
    // something
} catch (Exception e) {  // ❌ quá rộng
    e.printStackTrace();
}
\`\`\`

**Ví dụ tốt:**
\`\`\`java
try {
    // something
} catch (UserNotFoundException e) {
    return ResponseEntity.status(404).body(e.getMessage());
} catch (IllegalArgumentException e) {
    return ResponseEntity.status(400).body(e.getMessage());
}
\`\`\`

---

## 7. Global Exception Handler trong Spring Boot

\`\`\`java
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
\`\`\`

---

## 8. \`final\`, \`finally\`, \`finalize\`

| Từ khóa | Ý nghĩa |
|---|---|
| \`final\` | Biến không đổi, method không override, class không kế thừa |
| \`finally\` | Khối code luôn chạy sau try-catch |
| \`finalize()\` | Method của Object, GC gọi trước khi thu hồi. **Không nên dùng.** |

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Checked vs Unchecked Exception?**
> "Checked Exception kế thừa Exception nhưng không phải RuntimeException, compiler bắt buộc phải xử lý bằng try-catch hoặc throws, ví dụ IOException. Unchecked Exception kế thừa RuntimeException, thường do lỗi logic như NullPointerException, compiler không bắt buộc xử lý."

**Câu: Custom Exception có tác dụng gì?**
> "Giúp code rõ ràng hơn khi xử lý lỗi business. Ví dụ thay vì ném RuntimeException chung chung, mình tạo UserNotFoundException để controller bắt và trả về 404 cụ thể."

---

## ✅ CHECKLIST PHẦN 3`,checklist:[`Phân biệt Checked vs Unchecked Exception.`,"Phân biệt `throw` vs `throws`.","Biết cách viết `try-catch-finally` và `try-with-resources`.",`Biết tạo Custom Exception.`,`Biết tại sao không nên catch Exception quá rộng.`,`Biết Global Exception Handler trong Spring Boot.`,"Phân biệt `final`, `finally`, `finalize`."]},{file:`Phan4_Java8_CheatSheet.md`,title:`📄 PHẦN 4 — JAVA 8+`,content:`---

## 1. Functional Interface

Interface chỉ có **duy nhất một abstract method**, có thể dùng với Lambda.

| Interface | Method | Input | Output | Dùng khi |
|---|---|---|---|---|
| \`Predicate<T>\` | \`test(T)\` | T | boolean | Kiểm tra điều kiện |
| \`Function<T, R>\` | \`apply(T)\` | T | R | Biến đổi dữ liệu |
| \`Consumer<T>\` | \`accept(T)\` | T | void | Xử lý, in, lưu |
| \`Supplier<T>\` | \`get()\` | void | T | Cung cấp giá trị |

**Ví dụ:**
\`\`\`java
Predicate<Integer> isEven = x -> x % 2 == 0;
Function<String, Integer> length = s -> s.length();
Consumer<String> print = System.out::println;
Supplier<Double> random = Math::random;
\`\`\`

---

## 2. Lambda Expression

Cách viết ngắn gọn cho anonymous class của functional interface.

**Ví dụ:**
\`\`\`java
// Trước Java 8
Runnable r = new Runnable() {
    public void run() { System.out.println("run"); }
};

// Java 8+
Runnable r = () -> System.out.println("run");
\`\`\`

---

## 3. Stream API Pipeline

Stream xử lý collection theo pipeline: **Source → Intermediate → Terminal**.

\`\`\`java
List<Integer> result = numbers.stream()
    .filter(x -> x % 2 == 0)   // intermediate
    .map(x -> x * 2)            // intermediate
    .sorted()                   // intermediate
    .distinct()                 // intermediate
    .collect(Collectors.toList()); // terminal
\`\`\`

**Intermediate operations:** lazy, trả về Stream (\`filter\`, \`map\`, \`sorted\`, \`distinct\`, \`flatMap\`).  
**Terminal operations:** kết thúc pipeline (\`collect\`, \`forEach\`, \`reduce\`, \`findFirst\`, \`anyMatch\`).

---

## 4. \`map\` vs \`flatMap\`

| \`map\` | \`flatMap\` |
|---|---|
| Biến đổi từng phần tử thành 1 giá trị | Biến đổi rồi **flatten** các Stream lồng nhau |
| \`Stream<T>\` → \`Stream<R>\` | \`Stream<Stream<T>>\` → \`Stream<T>\` |

**Ví dụ:**
\`\`\`java
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4)
);

// map: Stream<List<Integer>>
nested.stream().map(x -> x);           // [[1,2], [3,4]]

// flatMap: Stream<Integer>
nested.stream().flatMap(List::stream)  // [1, 2, 3, 4]
               .collect(Collectors.toList());
\`\`\`

---

## 5. Optional

Biểu diễn giá trị có thể tồn tại hoặc không, tránh \`NullPointerException\` và \`null\` check lồng nhau.

**Ví dụ:**
\`\`\`java
Optional<String> name = Optional.ofNullable(findNameById(id));

name.ifPresent(n -> System.out.println(n));

String result = name
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .orElse("UNKNOWN");
\`\`\`

**Anti-pattern:**
\`\`\`java
Optional<User> user = Optional.ofNullable(getUser());  // ❌ không cần wrap nếu vừa mới check null
String name = user.get().getName();                    // ❌ .get() dễ ném NoSuchElementException
\`\`\`

---

## 6. Method Reference

\`\`\`java
List<String> names = Arrays.asList("a", "b", "c");
names.forEach(System.out::println);  // method reference

// Tương đương
names.forEach(s -> System.out.println(s));
\`\`\`

**4 loại:**
- Static method: \`ClassName::method\`
- Instance method của object cụ thể: \`obj::method\`
- Instance method của class: \`ClassName::method\`
- Constructor: \`ClassName::new\`

---

## 7. Default Method & Static Method trong Interface (Java 8)

\`\`\`java
interface Logger {
    void log(String msg);                    // abstract

    default void logInfo(String msg) {       // default method
        log("[INFO] " + msg);
    }

    static void print(String msg) {          // static method
        System.out.println(msg);
    }
}
\`\`\`

> Giúp bổ sung method mà không phá vỡ class đã implement interface.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Stream API là gì?**
> "Stream API giúp xử lý collection theo cách khai báo, gồm các bước filter, map, collect. Ví dụ tôi có list số, muốn lấy số chẵn nhân đôi rồi thu thập thành list mới, tôi viết numbers.stream().filter(x -> x % 2 == 0).map(x -> x * 2).toList()."

**Câu: Optional dùng để làm gì?**
> "Optional giúp thể hiện rõ một giá trị có thể null, tránh null check lồng nhau. Ví dụ Optional.ofNullable(user).map(User::getName).orElse('Unknown'). Tuy nhiên không nên dùng Optional chỉ để wrap rồi .get() ngay, hoặc dùng trong field/parameter thông thường."

---

## ✅ CHECKLIST PHẦN 4`,checklist:[`Giải thích Functional Interface và 4 loại phổ biến.`,`Viết Lambda expression.`,`Giải thích Stream API pipeline.`,`Phân biệt intermediate vs terminal operations.`,"Phân biệt `map` vs `flatMap`.","Dùng `Optional` đúng cách và biết anti-pattern.",`Biết Method Reference.`,`Biết default method và static method trong interface.`]},{file:`Phan5_Multithreading_CheatSheet.md`,title:`📄 PHẦN 5 — MULTITHREADING`,content:`---

## 1. Thread vs Process

| | **Process** | **Thread** |
|---|---|---|
| **Định nghĩa** | Chương trình đang chạy, có bộ nhớ riêng | Đơn vị thực thi nhỏ trong process |
| **Bộ nhớ** | Có heap và memory space riêng | Chia sẻ heap của process, có stack riêng |
| **Giao tiếp** | IPC (inter-process communication) | Dùng shared memory |
| **Tạo mới** | Tốn kém | Nhẹ hơn |

**Ví dụ:**
\`\`\`java
Thread t = new Thread(() -> System.out.println("Running in new thread"));
t.start();
\`\`\`

---

## 2. Race Condition

Nhiều thread cùng truy cập và thay đổi **shared data**, kết quả phụ thuộc vào thứ tự thực thi.

**Ví dụ:**
\`\`\`java
class Counter {
    int count = 0;
    void increment() { count++; } // ❌ không thread-safe
}
\`\`\`

Cách giải quyết:
- \`synchronized\`
- \`ReentrantLock\`
- \`AtomicInteger\`

---

## 3. \`synchronized\`

Đảm bảo một vùng code chỉ được một thread truy cập tại một thởi điểm.

**Ví dụ:**
\`\`\`java
class Counter {
    private int count = 0;

    public synchronized void increment() {  // khóa object instance
        count++;
    }
}
\`\`\`

Hoặc khối:
\`\`\`java
public void increment() {
    synchronized (this) {
        count++;
    }
}
\`\`\`

---

## 4. Deadlock

Các thread giữ resource và chờ resource của nhau, không thread nào tiếp tục được.

**Điều kiện:**
- Mutual exclusion
- Hold and wait
- No preemption
- Circular wait

**Ví dụ:**
\`\`\`java
Thread 1: lock A → đợi lock B
Thread 2: lock B → đợi lock A
\`\`\`

**Cách phòng tránh:**
- Luôn lock theo cùng thứ tự.
- Dùng timeout (\`tryLock\`).
- Hạn chế số lượng lock.

---

## 5. ExecutorService & Thread Pool

Quản lý thread pool, tránh tạo thread thủ công cho từng task.

**Ví dụ:**
\`\`\`java
ExecutorService executor = Executors.newFixedThreadPool(4);

for (int i = 0; i < 10; i++) {
    executor.submit(() -> System.out.println("Task"));
}

executor.shutdown();
\`\`\`

| Loại pool | Đặc điểm |
|---|---|
| \`newFixedThreadPool(n)\` | Cố định n thread |
| \`newCachedThreadPool()\` | Tự động tạo thread khi cần |
| \`newSingleThreadExecutor()\` | 1 thread duy nhất |
| \`newScheduledThreadPool(n)\` | Chạy task định kỳ |

---

## 6. JVM Memory Model (đơn giản)

\`\`\`
JVM Memory
├── Heap          (objects, shared by all threads)
│   ├── Young Generation (Eden, Survivor)
│   └── Old Generation
├── Stack         (mỗi thread có stack riêng, local variables)
├── Metaspace     (class metadata)
├── Program Counter (thread hiện tại đang thực thi dòng nào)
└── Native Method Stack
\`\`\`

---

## 7. Garbage Collection

GC tự động thu hồi object không còn reference để giải phóng bộ nhớ.

**Cách GC xác định object cần thu hồi:**
- Reference counting (ít dùng vì circular reference).
- Reachability analysis: object không reachable từ GC Roots.

**GC Roots:**
- Local variables trong stack.
- Static fields.
- JNI references.

**Ví dụ:**
\`\`\`java
User u = new User();  // u là GC Root
u = null;             // object User không còn reachable → GC thu hồi
\`\`\`

---

## 8. \`volatile\`

Đảm bảo giá trị biến luôn đọc/ghi từ **main memory**, không dùng cache của thread.

\`\`\`java
private volatile boolean running = true;
\`\`\`

> \`volatile\` không thay thế \`synchronized\` cho compound operations như \`i++\`.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Race condition là gì?**
> "Race condition xảy ra khi nhiều thread cùng truy cập và thay đổi shared data. Kết quả cuối cùng phụ thuộc vào thứ tự thực thi của các thread. Ví dụ nhiều thread cùng increment một biến count mà không đồng bộ, kết quả cuối cùng sẽ sai. Cách xử lý là dùng synchronized, ReentrantLock hoặc AtomicInteger."

**Câu: Deadlock là gì, cách phòng tránh?**
> "Deadlock là tình trạng các thread giữ lock và chờ lock của nhau, không ai tiến thêm được. Ví dụ thread A giữ lock 1 đợi lock 2, thread B giữ lock 2 đợi lock 1. Để tránh, mình luôn lock theo cùng một thứ tự, hoặc dùng tryLock với timeout."

---

## ✅ CHECKLIST PHẦN 5`,checklist:[`Phân biệt Thread vs Process.`,`Giải thích Race Condition.`,"Dùng `synchronized` đúng cách.",`Giải thích Deadlock và cách phòng tránh.`,`Dùng ExecutorService & Thread Pool.`,`Biết JVM Memory Model cơ bản.`,`Giải thích Garbage Collection.`,"Biết `volatile`."]},{file:`Phan6_SQL_Database_CheatSheet.md`,title:`📄 PHẦN 6 — SQL & DATABASE`,content:`---

## 1. JOIN

| JOIN | Mô tả |
|---|---|
| \`INNER JOIN\` | Chỉ lấy dòng có match ở cả 2 bảng |
| \`LEFT JOIN\` | Lấy tất cả từ bảng trái, null nếu không match |
| \`RIGHT JOIN\` | Lấy tất cả từ bảng phải |
| \`FULL OUTER JOIN\` | Lấy tất cả từ cả 2 bảng |

**Ví dụ:**
\`\`\`sql
SELECT u.name, o.order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
\`\`\`

---

## 2. GROUP BY & HAVING

\`\`\`sql
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 5000;
\`\`\`

- \`WHERE\` lọc trước khi group.
- \`HAVING\` lọc sau khi group.

---

## 3. INDEX

Cấu trúc dữ liệu (thường B-Tree) giúp truy vấn WHERE nhanh hơn.

**Ví dụ:**
\`\`\`sql
CREATE INDEX idx_email ON users(email);
\`\`\`

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

- Kiểm tra \`EXPLAIN\` / execution plan.
- Thêm index cho cột trong WHERE, JOIN, ORDER BY.
- Tránh \`SELECT *\`.
- Phân trang thay vì load toàn bộ.
- Tối ưu subquery → JOIN.
- Tăng connection pool nếu cần.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Index là gì, khi nào dùng?**
> "Index là cấu trúc dữ liệu giúp tìm kiếm nhanh, giống như mục lục sách. Ví dụ tạo index trên cột email để tìm user theo email nhanh. Nhược điểm là insert/update/delete chậm hơn và tốn dung lượng. Không nên index cột có ít giá trị khác nhau như gender."

---

## ✅ CHECKLIST PHẦN 6`,checklist:[`Giải thích 4 loại JOIN.`,`Dùng GROUP BY, HAVING, WHERE đúng.`,`Giải thích INDEX, ưu/nhược điểm.`,`Nói được ACID.`,`Phân biệt 4 isolation levels.`,`Biết normalization cơ bản.`,`Biết cách optimize query chậm.`]},{file:`Phan7_SpringBoot_CheatSheet.md`,title:`📄 PHẦN 7 — SPRING BOOT`,content:`---

## 1. Spring IoC Container

**Inversion of Control (IoC):** Thay vì tự tạo object, Spring Container tạo và quản lý object (bean).

**Ví dụ:**
\`\`\`java
@Service
public class UserService { ... }

// Spring tự tạo UserService, không cần new UserService()
\`\`\`

---

## 2. Dependency Injection (DI)

Spring inject bean vào bean khác thông qua constructor, setter, hoặc field.

**Khuyến nghị: Constructor Injection**
\`\`\`java
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
\`\`\`

Ưu điểm:
- Dễ test.
- Không cần \`@Autowired\`.
- Bắt buộc cung cấp dependency.

---

## 3. \`@Component\`, \`@Service\`, \`@Repository\`, \`@Controller\`

| Annotation | Ý nghĩa |
|---|---|
| \`@Component\` | Bean chung |
| \`@Service\` | Tầng business logic |
| \`@Repository\` | Tầng truy cập dữ liệu, tự đổi SQLException thành DataAccessException |
| \`@Controller\` / \`@RestController\` | Xử lý request HTTP |

> \`@RestController\` = \`@Controller\` + \`@ResponseBody\`

---

## 4. Spring Boot Auto-Configuration

Spring Boot tự động cấu hình bean dựa trên classpath và properties.

**Ví dụ:**
- Có \`spring-boot-starter-data-jpa\` + H2/MySQL trong classpath → tự cấu hình \`DataSource\`, \`EntityManagerFactory\`.
- Có \`spring-boot-starter-web\` → tự cấu hình embedded Tomcat.

---

## 5. Spring Boot Starter

Starter là dependency tổng hợp nhiều dependency liên quan.

**Ví dụ \`pom.xml\`:**
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
\`\`\`

---

## 6. \`@SpringBootApplication\`

\`\`\`java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
\`\`\`

Tương đương:
- \`@Configuration\`
- \`@EnableAutoConfiguration\`
- \`@ComponentScan\`

---

## 7. Application Properties

\`\`\`properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/db
spring.datasource.username=root
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=update
\`\`\`

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Dependency Injection là gì?**
> "Dependency Injection là cách Spring cung cấp object mà một class cần thay vì class tự tạo. Ví dụ UserService cần UserRepository, mình inject qua constructor. Ưu điểm là dễ test vì có thể truyền mock repository vào, và dependency rõ ràng ngay từ constructor."

**Câu: Spring Boot auto-configuration là gì?**
> "Spring Boot tự động cấu hình bean dựa trên classpath và properties. Ví dụ nếu có spring-boot-starter-data-jpa và MySQL driver trong classpath, Spring Boot tự tạo DataSource và EntityManagerFactory mà mình không cần cấu hình thủ công."

---

## ✅ CHECKLIST PHẦN 7`,checklist:[`Giải thích IoC Container.`,`Giải thích DI và Constructor Injection.`,`Phân biệt @Component, @Service, @Repository, @Controller.`,`Giải thích @RestController.`,`Giải thích Auto-Configuration.`,`Biết Spring Boot Starter.`,`Giải thích @SpringBootApplication.`,`Biết cấu hình application.properties.`]},{file:`Phan8_REST_API_CheatSheet.md`,title:`📄 PHẦN 8 — REST API`,content:`---

## 1. HTTP Methods

| Method | Dùng để | Idempotent |
|---|---|---|
| \`GET\` | Lấy dữ liệu | ✅ Có |
| \`POST\` | Tạo mới | ❌ Không |
| \`PUT\` | Cập nhật toàn bộ / replace | ✅ Có |
| \`PATCH\` | Cập nhật một phần | ❌ Không (thường) |
| \`DELETE\` | Xóa | ✅ Có |

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
- \`GET /products/1\` gọi 10 lần vẫn trả về cùng product.
- \`PUT /products/1\` với cùng body thay thế object, kết quả cuối cùng như nhau.
- \`POST /orders\` gọi 2 lần → tạo 2 đơn hàng, **không idempotent**.

**Xử lý POST idempotent:** dùng idempotency key.

---

## 4. REST URL Design

\`\`\`
GET    /api/products         # danh sách
GET    /api/products?page=1&size=10   # phân trang
GET    /api/products/{id}    # chi tiết
POST   /api/products         # tạo mới
PUT    /api/products/{id}   # cập nhật toàn bộ
PATCH  /api/products/{id}   # cập nhật một phần
DELETE /api/products/{id}   # xóa
\`\`\`

---

## 5. Spring Boot REST Controller

\`\`\`java
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
\`\`\`

---

## 6. Pagination

\`\`\`java
@GetMapping
public Page<ProductDto> list(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    return service.findAll(PageRequest.of(page, size));
}
\`\`\`

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: GET vs POST?**
> "GET dùng để lấy dữ liệu, idempotent, không có body. POST dùng để tạo mới, không idempotent, có thể có body."

**Câu: 401 vs 403?**
> "401 là Unauthorized, nghĩa là request chưa xác thực hoặc token sai. 403 là Forbidden, request đã xác thực nhưng user không có quyền truy cập resource."

---

## ✅ CHECKLIST PHẦN 8`,checklist:[`Phân biệt 5 HTTP methods và idempotency.`,`Biết status code phổ biến.`,`Phân biệt 401 vs 403.`,`Giải thích idempotency.`,`Thiết kế REST URL đúng chuẩn.`,`Viết @RestController cơ bản.`,`Biết pagination với Spring Data.`]},{file:`Phan9_DTO_Validation_CheatSheet.md`,title:`📄 PHẦN 9 — DTO & VALIDATION`,content:`---

## 1. DTO là gì?

**Data Transfer Object:** Object dùng để truyền dữ liệu giữa các tầng (client ↔ controller ↔ service), tách biệt khỏi Entity.

**Ví dụ:**
\`\`\`java
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
\`\`\`

---

## 2. Tại sao dùng DTO?

- Không expose trực tiếp Entity ra ngoài.
- Kiểm soát dữ liệu trả về / nhận vào.
- Dễ validation.
- Tránh vòng lặp JSON khi entity có quan hệ.

---

## 3. MapStruct — Chuyển đổi Entity ↔ DTO

\`\`\`java
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
    User toEntity(UserRequest request);
}
\`\`\`

Hoặc dùng thủ công:
\`\`\`java
public UserResponse toResponse(User user) {
    UserResponse dto = new UserResponse();
    dto.setId(user.getId());
    dto.setEmail(user.getEmail());
    return dto;
}
\`\`\`

---

## 4. Validation với Jakarta Bean Validation

**Dependency:**
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
\`\`\`

**Các annotation phổ biến:**

| Annotation | Ý nghĩa |
|---|---|
| \`@NotNull\` | Không được null |
| \`@NotBlank\` | Không null, không rỗng, không chỉ whitespace |
| \`@NotEmpty\` | Không null, không rỗng (chuỗi, collection) |
| \`@Size(min, max)\` | Độ dài trong khoảng |
| \`@Min\` / \`@Max\` | Giá trị số tối thiểu / tối đa |
| \`@Email\` | Định dạng email |
| \`@Pattern(regexp)\` | Khớp regex |

---

## 5. DTO Request với Validation

\`\`\`java
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
\`\`\`

**Controller:**
\`\`\`java
@PostMapping
public ResponseEntity<UserResponse> create(@RequestBody @Valid UserRequest request) { ... }
\`\`\`

---

## 6. Custom Validation Message

Dùng \`message.properties\`:
\`\`\`properties
NotBlank.userRequest.email=Email không được để trống
Size.userRequest.password=Mật khẩu phải từ {min} đến {max} ký tự
\`\`\`

---

## 7. Global Validation Handler

\`\`\`java
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
\`\`\`

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Tại sao dùng DTO?**
> "DTO giúp tách API model khỏi Entity, không expose trực tiếp cấu trúc database ra ngoài. Ví dụ entity User có password, mình chỉ trả về UserResponse gồm id và email. Ngoài ra DTO còn giúp validation dễ dàng hơn và tránh vòng lặp JSON với quan hệ entity."

**Câu: Validation trong Spring Boot?**
> "Dùng Jakarta Bean Validation với các annotation như @NotBlank, @Email, @Size. Controller nhận request bằng @Valid. Nếu sai validation, Spring ném MethodArgumentNotValidException, mình bắt bằng @RestControllerAdvice để trả về lỗi 400 rõ ràng."

---

## ✅ CHECKLIST PHẦN 9`,checklist:[`Giải thích DTO và lý do dùng.`,`Phân biệt Entity và DTO.`,`Biết cách chuyển đổi Entity ↔ DTO.`,`Biết các annotation validation phổ biến.`,`Dùng @Valid trong controller.`,`Biết custom validation message.`,`Biết xử lý MethodArgumentNotValidException.`]},{file:`Phan10_JPA_Hibernate_CheatSheet.md`,title:`📄 PHẦN 10 — JPA/HIBERNATE`,content:`---

## 1. JPA vs Hibernate

| JPA | Hibernate |
|---|---|
| Specification (chuẩn Java) | Implementation của JPA |
| \`javax.persistence\` / \`jakarta.persistence\` | \`org.hibernate\` |
| Định nghĩa Entity, Repository, Query | Cung cấp engine ORM thực tế |

> Spring Data JPA giúp việc dùng JPA dễ dàng hơn qua \`JpaRepository\`.

---

## 2. Entity cơ bản

\`\`\`java
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
\`\`\`

---

## 3. Lazy vs Eager

| | **LAZY** | **EAGER** |
|---|---|---|
| Load quan hệ | Khi nào gọi getter mới load | Load ngay khi load entity |
| Hiệu năng | Tốt hơn | Dễ load thừa dữ liệu |
| Mặc định | \`@OneToMany\`, \`@ManyToMany\` | \`@ManyToOne\`, \`@OneToOne\` |

**Ví dụ:**
\`\`\`java
@ManyToOne(fetch = FetchType.LAZY)   // khuyến nghị
private Category category;
\`\`\`

---

## 4. N+1 Query Problem

**Vấn đề:** Load 1 list entity, sau đó vòng lặp gọi thêm N câu query cho quan hệ.

**Giải pháp:**
- Dùng \`EntityGraph\`.
- Dùng \`JOIN FETCH\` trong JPQL.
- Dùng \`@Query\` với native SQL hoặc JPQL.

**Ví dụ:**
\`\`\`java
@Query("SELECT p FROM Product p JOIN FETCH p.category")
List<Product> findAllWithCategory();
\`\`\`

---

## 5. Persistence Context & Dirty Checking

- **Persistence Context:** Vùng cache của EntityManager chứa managed entities.
- **Dirty Checking:** Hibernate tự động so sánh entity khi transaction commit, chỉ update những field thay đổi.

**Ví dụ:**
\`\`\`java
@Transactional
public void updatePrice(Long id, BigDecimal newPrice) {
    Product p = repo.findById(id).orElseThrow();
    p.setPrice(newPrice);  // không cần save, Hibernate tự flush
}
\`\`\`

---

## 6. Spring Data JPA Repository

\`\`\`java
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryName(String categoryName);

    @Query("SELECT p FROM Product p WHERE p.price > :price")
    List<Product> findExpensive(@Param("price") BigDecimal price);
}
\`\`\`

---

## 7. Cascade & Orphan Removal

\`\`\`java
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List<OrderItem> items;
\`\`\`

- \`CascadeType.ALL\`: thao tác order sẽ lan xuống items.
- \`orphanRemoval = true\`: xóa item khỏi list sẽ xóa trong DB.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Lazy vs Eager?**
> "Lazy chỉ load dữ liệu quan hệ khi gọi getter, giúp tránh load thừa. Eager load ngay khi load entity, dễ gây chậm nếu quan hệ lớn. Mặc định ManyToOne là Eager, nhưng mình thường đổi thành Lazy để tối ưu."

**Câu: N+1 query là gì?**
> "N+1 là khi load N entity rồi trong vòng lặp lại gọi thêm N câu query cho quan hệ. Ví dụ load list Product rồi gọi product.getCategory() sẽ sinh ra nhiều query. Cách xử lý là dùng JOIN FETCH hoặc EntityGraph để load trong 1 query."

---

## ✅ CHECKLIST PHẦN 10`,checklist:[`Phân biệt JPA, Hibernate, Spring Data JPA.`,`Viết Entity cơ bản.`,`Phân biệt Lazy vs Eager.`,`Giải thích N+1 query và cách fix.`,`Giải thích Persistence Context & Dirty Checking.`,`Viết Spring Data JPA Repository.`,`Biết Cascade và Orphan Removal.`]},{file:`Phan11_Transaction_CheatSheet.md`,title:`📄 PHẦN 11 — TRANSACTION`,content:`---

## 1. @Transactional

Đánh dấu method/class để Spring quản lý transaction. Tự động \`begin\`, \`commit\`, hoặc \`rollback\` khi có RuntimeException.

\`\`\`java
@Service
public class OrderService {

    @Transactional
    public void createOrder(OrderRequest request) {
        // nếu có RuntimeException ở đây, toàn bộ sẽ rollback
        orderRepo.save(order);
        paymentService.charge(order);
    }
}
\`\`\`

---

## 2. Propagation

| Propagation | Ý nghĩa |
|---|---|
| \`REQUIRED\` (mặc định) | Dùng transaction hiện tại nếu có, nếu không tạo mới |
| \`REQUIRES_NEW\` | Luôn tạo transaction mới, suspend transaction cũ |
| \`SUPPORTS\` | Dùng transaction nếu có, không bắt buộc |
| \`MANDATORY\` | Bắt buộc phải có transaction cha, nếu không lỗi |
| \`NEVER\` | Không được có transaction |
| \`NOT_SUPPORTED\` | Chạy không transaction, suspend transaction cha |
| \`NESTED\` | Transaction lồng (savepoint) |

**Ví dụ:**
\`\`\`java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void logAudit(Audit audit) {
    auditRepo.save(audit);  // luôn lưu dù method cha lỗi
}
\`\`\`

---

## 3. Isolation

\`\`\`java
@Transactional(isolation = Isolation.READ_COMMITTED)
\`\`\`

> Xem chi tiết ở PHẦN 6 — SQL & Database.

---

## 4. Rollback Behavior

- Mặc định rollback khi **RuntimeException** hoặc **Error**.
- **Không rollback** với **Checked Exception**.
- Có thể tùy chỉnh:
\`\`\`java
@Transactional(rollbackFor = SQLException.class,
               noRollbackFor = IllegalStateException.class)
\`\`\`

---

## 5. @Transactional trong class vs method

- Đặt trên class → áp dụng cho tất cả public methods.
- Đặt trên method → ghi đè class-level.

---

## 6. Lưu ý quan trọng

- \`@Transactional\` chỉ hoạt động khi method được gọi **từ bên ngoài class** (proxy).
- Gọi method có \`@Transactional\` từ chính trong class → không có hiệu lực.

**Ví dụ lỗi:**
\`\`\`java
@Service
public class OrderService {
    public void process() {
        createOrder();  // ❌ @Transactional không hoạt động do self-invocation
    }

    @Transactional
    public void createOrder() { ... }
}
\`\`\`

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: @Transactional propagation?**
> "REQUIRED là mặc định, dùng transaction hiện có hoặc tạo mới. REQUIRES_NEW luôn tạo transaction mới, rất hữu ích cho audit log hoặc notification vì dù method cha lỗi thì dữ liệu vẫn được lưu."

**Câu: Tại sao @Transactional không hoạt động khi gọi từ chính class?**
> "Vì Spring dùng proxy để wrap bean. Khi gọi từ bên ngoài, proxy mới can thiệp và mở transaction. Khi gọi từ bên trong class, proxy không bắt được, nên @Transactional bị bỏ qua."

---

## ✅ CHECKLIST PHẦN 11`,checklist:[`Biết cách dùng @Transactional.`,`Phân biệt các propagation (REQUIRED, REQUIRES_NEW).`,`Biết isolation level.`,`Biết rollback mặc định và cách tùy chỉnh.`,`Biết self-invocation problem.`,`Biết khi nào dùng REQUIRES_NEW cho audit/log.`]},{file:`Phan12_Security_JWT_CheatSheet.md`,title:`📄 PHẦN 12 — SECURITY & JWT`,content:`---

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
\`\`\`
header.payload.signature
\`\`\`

| Phần | Nội dung |
|---|---|
| **Header** | Algorithm, token type |
| **Payload** | Claims: userId, roles, exp, iat |
| **Signature** | Mã hóa header + payload bằng secret key |

**Ví dụ token:**
\`\`\`
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGVzIjpbIlVTRVIiXX0.signature
\`\`\`

---

## 3. JWT Flow

\`\`\`
Client → POST /login (username/password)
Server → trả JWT
Client → gửi JWT trong Header: Authorization: Bearer <token>
Server → verify signature → lấy user info từ claims
\`\`\`

---

## 4. Spring Security Filter Chain

\`\`\`
Request → JWT Filter → Authentication → Authorization → Controller
\`\`\`

**Cấu hình cơ bản:**
\`\`\`java
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
\`\`\`

---

## 5. JWT Filter đọc token

\`\`\`java
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
\`\`\`

---

## 6. Role-based Authorization

\`\`\`java
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) { ... }
}
\`\`\`

> Cần bật \`@EnableMethodSecurity\`.

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

## ✅ CHECKLIST PHẦN 12`,checklist:[`Phân biệt Authentication vs Authorization.`,`Giải thích cấu trúc JWT.`,`Nói được JWT flow.`,`Biết Spring Security Filter Chain.`,`Biết cấu hình permitAll, hasRole.`,`Biết @PreAuthorize.`,`Biết lưu ý bảo mật JWT.`]},{file:`Phan13_Docker_CheatSheet.md`,title:`📄 PHẦN 13 — DOCKER`,content:`---

## 1. Image vs Container

| **Image** | **Container** |
|---|---|
| Template read-only chứa app + dependencies | Instance đang chạy của image |
| Giống class | Giống object |
| Lưu trữ được, push/pull từ registry | Chạy, dừng, xóa |

---

## 2. Dockerfile

\`\`\`dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

**Giải thích:**
- \`FROM\`: base image.
- \`WORKDIR\`: thư mục làm việc.
- \`COPY\`: copy file vào image.
- \`EXPOSE\`: cổng lắng nghe.
- \`ENTRYPOINT\`: lệnh chạy khi container khởi động.

---

## 3. Docker Compose

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/db
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: db
    ports:
      - "3306:3306"
\`\`\`

---

## 4. Lệnh Docker thường dùng

\`\`\`bash
docker build -t myapp:1.0 .
docker run -p 8080:8080 myapp:1.0
docker ps
docker stop <container_id>
docker rm <container_id>
docker images
\`\`\`

---

## 5. Tại sao dùng Docker?

- Đóng gói app + môi trường chạy.
- Chạy giống nhau ở dev, test, production.
- Dễ scale, triển khai.

---

## 6. Container Registry

Nơi lưu Docker image:
- Docker Hub.
- Amazon ECR.
- GitHub Container Registry.
- Private registry.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Docker Image vs Container?**
> "Image là template read-only chứa ứng dụng và dependencies. Container là instance đang chạy của image. Một image có thể tạo nhiều container."

---

## ✅ CHECKLIST PHẦN 13`,checklist:[`Phân biệt Image vs Container.`,`Viết Dockerfile cơ bản.`,`Biết Docker Compose.`,`Biết các lệnh Docker thường dùng.`,`Giải thích lợi ích Docker.`,`Biết Container Registry.`]},{file:`Phan14_Kafka_CheatSheet.md`,title:`📄 PHẦN 14 — KAFKA`,content:`---

## 1. Kafka là gì?

Hệ thống **message broker phân tán**, dùng để streaming dữ liệu real-time theo mô hình publish-subscribe.

---

## 2. Core Concepts

| Khái niệm | Ý nghĩa |
|---|---|
| **Producer** | Gửi message |
| **Consumer** | Nhận message |
| **Broker** | Server Kafka lưu và phân phối message |
| **Topic** | Kênh phân loại message |
| **Partition** | Phân đoạn trong topic, cho phép parallel |
| **Offset** | Vị trí message trong partition |
| **Consumer Group** | Nhóm consumer chia sẻ load |

---

## 3. Producer & Consumer (Spring Kafka)

**Dependency:**
\`\`\`xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
\`\`\`

**Producer:**
\`\`\`java
@Service
public class KafkaProducer {
    @Autowired private KafkaTemplate<String, String> kafkaTemplate;

    public void send(String topic, String message) {
        kafkaTemplate.send(topic, message);
    }
}
\`\`\`

**Consumer:**
\`\`\`java
@Component
public class KafkaConsumer {
    @KafkaListener(topics = "orders", groupId = "order-group")
    public void listen(String message) {
        System.out.println("Received: " + message);
    }
}
\`\`\`

---

## 4. Khi nào dùng Kafka?

- Xử lý event-driven.
- Giải coupling giữa các service.
- Log aggregation.
- Real-time analytics.
- Buffer khi traffic cao.

---

## 5. At-least-once vs At-most-once vs Exactly-once

| Semantics | Mô tả |
|---|---|
| At-most-once | Có thể mất message |
| At-least-once | Có thể trùng, nhưng không mất |
| Exactly-once | Không mất, không trùng (khó, cần idempotency) |

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Kafka dùng để làm gì?**
> "Kafka là message broker phân tán, giúp các service giao tiếp bất đồng bộ qua topic. Ví dụ service Order gửi event order-created, các service Inventory, Notification subscribe để xử lý. Giúp giảm coupling và chịu tải cao."

---

## ✅ CHECKLIST PHẦN 14`,checklist:[`Giải thích Kafka là gì.`,`Biết Producer, Consumer, Topic, Partition, Offset, Consumer Group.`,`Viết Producer & Consumer cơ bản với Spring Kafka.`,`Biết use case của Kafka.`,`Phân biệt delivery semantics.`]},{file:`Phan15_AWS_CheatSheet.md`,title:`📄 PHẦN 15 — AWS`,content:`---

## 1. Các dịch vụ AWS phổ biến

| Dịch vụ | Dùng để |
|---|---|
| **EC2** | Máy chủ ảo |
| **S3** | Lưu trữ object (file, backup, static assets) |
| **RDS** | Database managed (MySQL, PostgreSQL) |
| **ElastiCache** | Managed Redis/Memcached |
| **SQS** | Message queue |
| **SNS** | Push notification / pub-sub |
| **Lambda** | Serverless function |
| **CloudWatch** | Giám sát log, metric |
| **IAM** | Quản lý user, role, permission |
| **VPC** | Mạng riêng ảo |
| **ELB / ALB** | Load balancer |
| **EKS / ECS** | Chạy container / Kubernetes |
| **Route 53** | DNS |

---

## 2. EC2 vs ECS vs EKS

| | EC2 | ECS | EKS |
|---|---|---|---|
| Quản lý | Tự quản lý server | Container managed service | Kubernetes managed |
| Scale | Tự cấu hình | Dễ scale container | Dễ scale, phức tạp hơn |
| Phù hợp | Legacy, cần kiểm soát cao | App container đơn giản | Microservices lớn |

---

## 3. S3

- Object storage: file, image, backup.
- Bucket name globally unique.
- Storage classes: Standard, IA, Glacier.
- Có thể cấu hình public/private, versioning, lifecycle.

---

## 4. RDS

- Managed relational database.
- Hỗ trợ MySQL, PostgreSQL, MariaDB, SQL Server, Oracle.
- Tự động backup, patching, multi-AZ failover.
- Read replica để scale read.

---

## 5. SQS

- Message queue fully managed.
- Hàng đợi giúp giải coupling, xử lý async.
- Visibility timeout, dead-letter queue (DLQ).

---

## 6. IAM Best Practices

- Không dùng root user cho daily tasks.
- Dùng IAM Role cho EC2/Lambda thay vì hardcode key.
- Áp dụng least privilege.
- Bật MFA.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: EC2 vs ECS?**
> "EC2 là máy chủ ảo, mình tự quản lý OS và app. ECS là dịch vụ quản lý container, mình chỉ cần định nghĩa task và service, AWS lo việc chạy container trên cluster."

**Câu: Dùng S3 để làm gì?**
> "S3 là object storage dùng để lưu file, hình ảnh, backup. Nó durable, scalable, có nhiều storage class để tối ưu chi phí."

---

## ✅ CHECKLIST PHẦN 15`,checklist:[`Liệt kê các dịch vụ AWS phổ biến.`,`Phân biệt EC2, ECS, EKS.`,`Biết use case của S3, RDS, SQS.`,`Biết IAM best practices.`,`Giải thích high availability, multi-AZ, read replica.`]},{file:`Phan16_CICD_CheatSheet.md`,title:`📄 PHẦN 16 — CI/CD`,content:`---

## 1. CI/CD là gì?

| CI (Continuous Integration) | CD (Continuous Delivery/Deployment) |
|---|---|
| Tự động build, test khi code thay đổi | Tự động triển khai lên môi trường target |

---

## 2. Pipeline cơ bản

\`\`\`
Source Code → Build → Test → Package → Deploy
   (push)    (mvn)  (junit) (docker)  (ecs/k8s)
\`\`\`

---

## 3. Công cụ phổ biến

| Công cụ | Mô tả |
|---|---|
| **GitHub Actions** | CI/CD tích hợp GitHub |
| **GitLab CI** | CI/CD tích hợp GitLab |
| **Jenkins** | Self-hosted, linh hoạt |
| **CircleCI / Travis** | Cloud CI/CD |
| **ArgoCD** | GitOps continuous deployment cho K8s |

---

## 4. GitHub Actions cơ bản

\`\`\`yaml
name: Java CI
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - run: mvn clean test
      - run: mvn package -DskipTests
\`\`\`

---

## 5. Docker trong CI/CD

\`\`\`yaml
- name: Build Docker image
  run: docker build -t myapp:\${{ github.sha }} .

- name: Push to ECR
  run: |
    aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>
    docker push myapp:\${{ github.sha }}
\`\`\`

---

## 6. CI/CD Best Practices

- Chạy unit test trước khi merge.
- Không commit secret vào repo.
- Build once, deploy many (cùng image đến nhiều môi trường).
- Phân biệt staging và production.
- Rollback nhanh khi lỗi.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: CI/CD là gì?**
> "CI là tự động build và test khi developer push code. CD là tự động triển khai lên staging hoặc production. Ví dụ push lên main thì GitHub Actions chạy mvn test, build Docker image, push lên ECR và deploy lên ECS."

---

## ✅ CHECKLIST PHẦN 16`,checklist:[`Giải thích CI và CD.`,`Biết các công cụ CI/CD.`,`Viết pipeline cơ bản với GitHub Actions.`,`Biết tích hợp Docker trong CI/CD.`,`Biết CI/CD best practices.`]},{file:`Phan17_Microservices_CheatSheet.md`,title:`📄 PHẦN 17 — MICROSERVICES`,content:`---

## 1. Microservices là gì?

Kiến trúc chia ứng dụng thành nhiều service nhỏ, độc lập, mỗi service đảm nhận một business capability.

---

## 2. Monolith vs Microservices

| Monolith | Microservices |
|---|---|
| Một codebase duy nhất | Nhiều service độc lập |
| Deploy toàn bộ cùng lúc | Deploy từng service |
| Scale cả app | Scale từng phần |
| Đơn giản khi nhỏ | Phức tạp hơn, cần quản lý nhiều service |

---

## 3. Giao tiếp giữa các service

- **Synchronous:** REST, gRPC.
- **Asynchronous:** Message queue (Kafka, RabbitMQ, SQS).

> Ưu tiên async để giảm coupling và tăng khả năng chịu lỗi.

---

## 4. Service Discovery

Các service cần tìm địa chỉ nhau động.

- **Netflix Eureka**
- **Consul**
- **Kubernetes DNS/Service**

---

## 5. API Gateway

- Điểm vào duy nhất cho client.
- Xử lý authentication, rate limiting, routing, load balancing.
- Công cụ: Spring Cloud Gateway, Kong, AWS API Gateway, NGINX.

---

## 6. Resilience Patterns

| Pattern | Mục đích |
|---|---|
| **Circuit Breaker** | Ngắt kết nối khi service xuống, tránh cascade failure |
| **Retry** | Thử lại khi lỗi tạm thờ |
| **Timeout** | Giới hạn thờ gian chờ |
| **Fallback** | Trả về giá trị dự phòng |
| **Bulkhead** | Giới hạn tài nguyên cho từng service |
| **Rate Limiter** | Giới hạn số request |

**Resilience4j:**
\`\`\`java
@CircuitBreaker(name = "orderService", fallbackMethod = "fallback")
public Order getOrder(Long id) { ... }

public Order fallback(Long id, Exception ex) {
    return Order.empty();
}
\`\`\`

---

## 7. Distributed Tracing

Theo dõi request đi qua nhiều service.

- **Sleuth + Zipkin**
- **OpenTelemetry + Jaeger**

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Ưu nhược điểm Microservices?**
> "Microservices giúp scale từng phần, deploy độc lập, team tự chủ. Nhược điểm là phức tạp: cần quản lý giao tiếp, transaction phân tán, logging, monitoring, service discovery."

**Câu: Circuit Breaker là gì?**
> "Khi service gọi service khác liên tục lỗi, circuit breaker chuyển sang trạng thái OPEN để không gọi nữa, tránh cascade failure. Sau một thờ gian thử HALF-OPEN, nếu OK thì CLOSE lại."

---

## ✅ CHECKLIST PHẦN 17`,checklist:[`Giải thích Microservices.`,`Phân biệt Monolith vs Microservices.`,`Biết cách service giao tiếp sync/async.`,`Biết Service Discovery.`,`Biết API Gateway.`,`Biết Resilience Patterns: Circuit Breaker, Retry, Fallback.`,`Biết Distributed Tracing.`]},{file:`Phan18_SystemDesign_CheatSheet.md`,title:`📄 PHẦN 18 — SYSTEM DESIGN`,content:`---

## 1. Non-functional Requirements

| Yêu cầu | Ý nghĩa |
|---|---|
| **Scalability** | Khả năng mở rộng khi tải tăng |
| **Availability** | Hệ thống uptime cao |
| **Reliability** | Hoạt động đúng, ít lỗi |
| **Latency** | Thờ gian phản hồi thấp |
| **Consistency** | Dữ liệu đồng nhất |
| **Maintainability** | Dễ bảo trì, mở rộng |

---

## 2. Scale

- **Vertical scale:** Nâng cấp CPU/RAM máy chủ.
- **Horizontal scale:** Thêm nhiều máy chủ, dùng load balancer.

> Horizontal scale phổ biến hơn vì linh hoạt và rẻ hơn.

---

## 3. Load Balancer

Phân phối request đến nhiều server.

- **L4 (Transport):** dựa trên IP/port.
- **L7 (Application):** dựa trên URL, header, cookie.

Công cụ: NGINX, HAProxy, AWS ALB.

---

## 4. Caching

Lưu dữ liệu hot để giảm tải DB.

| Cache | Use case |
|---|---|
| **Redis** | Distributed cache, session, rate limit |
| **CDN** | Static assets, media |
| **Application cache** | Local cache (Caffeine, Guava) |

> Cache Aside: app đọc cache trước, nếu miss thì đọc DB và ghi lại cache.

---

## 5. Database Scaling

- **Read replica:** nhiều DB slave để đọc.
- **Sharding:** chia dữ liệu theo key (ví dụ user_id).
- **Partitioning:** chia bảng theo range/hash.

---

## 6. CAP Theorem

Hệ thống phân tán chỉ có thể đảm bảo 2 trong 3:

| C | Consistency | Dữ liệu đồng nhất mọi node |
| A | Availability | Luôn phản hồi |
| P | Partition Tolerance | Chịu được mất kết nối giữa các node |

> Trong thực tế thường chọn CP hoặc AP.

---

## 7. Rate Limiting

Giới hạn số request từ một client trong khoảng thờ gian.

- **Fixed window:** dễ nhưng có burst ở boundary.
- **Sliding window:** chính xác hơn.
- **Token bucket / Leaky bucket:** linh hoạt.

---

## 8. Design URL Shortener / Rate Limiter

**URL Shortener:**
\`\`\`
POST /shorten {url} → {shortCode}
GET /{shortCode} → redirect
\`\`\`
- Hash original URL → base62.
- Lưu mapping DB.
- Cache popular URLs.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Làm sao scale hệ thống?**
> "Đầu tiên dùng load balancer phân phối request đến nhiều app server. Thêm caching Redis cho dữ liệu hot. Dùng read replica cho database để giảm tải đọc. Nếu cần, sharding database theo user_id. Cuối cùng theo dõi metric qua monitoring."

---

## ✅ CHECKLIST PHẦN 18`,checklist:[`Biết các non-functional requirements.`,`Phân biệt vertical vs horizontal scale.`,`Giải thích load balancer.`,`Biết caching strategies.`,`Biết database scaling.`,`Giải thích CAP theorem.`,`Biết rate limiting.`,`Thiết kế đượ1 hệ thống đơn giản (URL shortener).`]},{file:`Phan19_Project_Mau_CheatSheet.md`,title:`📄 PHẦN 19 — PROJECT MẪU`,content:`---

## 1. Mô tả project

**Hệ thống quản lý đơn hàng (Order Management System):**
- User đăng ký/đăng nhập (JWT).
- Tạo đơn hàng, xem lịch sử.
- Admin quản lý sản phẩm, đơn hàng.
- Thông báo qua Kafka khi đơn hàng mới tạo.
- Deploy bằng Docker + CI/CD.

---

## 2. Tech Stack

| Tầng | Công nghệ |
|---|---|
| Backend | Java 17, Spring Boot |
| Database | PostgreSQL |
| Cache | Redis |
| Message Broker | Kafka |
| Auth | JWT, Spring Security |
| Build | Maven |
| Container | Docker, Docker Compose |
| Cloud | AWS EC2/ECS, RDS, S3, SQS |
| CI/CD | GitHub Actions |

---

## 3. Cấu trúc project

\`\`\`
order-service/
├── src/main/java/com/example/order/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── mapper/
│   ├── config/
│   ├── exception/
│   └── security/
├── src/main/resources/
│   └── application.yml
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml
\`\`\`

---

## 4. Tính năng nổi bật để nói trong phỏng vấn

- Phân quyền ROLE_USER / ROLE_ADMIN.
- Validation input với Jakarta Validation.
- Xử lý exception chung bằng \`@RestControllerAdvice\`.
- Gửi event \`OrderCreated\` lên Kafka.
- Consumer gửi email thông báo.
- Cache danh sách sản phẩm với Redis.
- Unit test repository, service với JUnit + Mockito.

---

## 5. Cách trình bày project

1. **Mục đích:** Hệ thống quản lý đơn hàng.
2. **Tech stack:** Java, Spring Boot, PostgreSQL, Redis, Kafka.
3. **Vai trò:** Backend developer.
4. **Tính năng chính:** CRUD, auth, async notification, caching.
5. **Thách thức:** N+1 query, concurrency, idempotency.
6. **Kết quả:** Hệ thống chạy ổn định, dễ mở rộng.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Giới thiệu project của bạn?**
> "Em làm hệ thống quản lý đơn hàng bằng Spring Boot. User đăng nhập bằng JWT, tạo đơn hàng. Khi đơn hàng được tạo, service gửi event lên Kafka, notification service nhận và gửi email. Dùng Redis cache sản phẩm, PostgreSQL làm chính, Docker để triển khai. Em viết unit test cho service và repository."

---

## ✅ CHECKLIST PHẦN 19`,checklist:[`Chuẩn bị mô tả project rõ ràng.`,`Liệt kê tech stack hợp lý.`,`Trình bày vai trò cá nhân.`,`Nêu tính năng nổi bật.`,`Chuẩn bị câu trả lởi ngắn gọn 60 giây.`]},{file:`Phan20_Cau_Hoi_Tinh_Huong_CheatSheet.md`,title:`📄 PHẦN 20 — CÂU HỎI TÌNH HUỐNG`,content:`---

## 1. API chậm — debug thế nào?

1. Kiểm tra log và metric (CloudWatch, Prometheus).
2. Xác định bottleneck: DB, network, external API.
3. Dùng APM (New Relic, Datadog) hoặc log thờ gian xử lý.
4. Kiểm tra N+1 query, thiếu index.
5. Kiểm tra external API timeout.
6. Scale hoặc cache nếu cần.

---

## 2. Production bug — xử lý thế nào?

1. Không panic, reproduce lỗi ở local/staging.
2. Rollback nếu lỗi nghiêm trọng.
3. Tìm root cause qua log, trace.
4. Fix và test kỹ.
5. Deploy lại, monitor.
6. Viết post-mortem.

---

## 3. Xung đột code khi merge

1. Hiểu rõ thay đổi của 2 branch.
2. Thảo luận với teammate nếu cùng sửa 1 chỗ.
3. Resolve conflict, giữ logic đúng.
4. Build và test lại.
5. Merge.

---

## 4. Làm việc với requirement không rõ

1. Hỏi lại để làm rõ.
2. Xác nhận scope và acceptance criteria.
3. Làm prototype nếu cần.
4. Báo cáo tiến độ thường xuyên.

---

## 5. Deadlock trong database

1. Phát hiện qua log.
2. Đảm bảo thứ tự lock nhất quán.
3. Giảm thờ gian transaction.
4. Dùng retry với exponential backoff.

---

## 6. Memory leak

1. Monitor heap memory.
2. Dump heap (\`jmap -dump\`).
3. Phân tích bằng Eclipse MAT.
4. Tìm object không được giải phóng.
5. Fix: đóng resource, xóa reference, dùng weak reference.

---

## 7. Conflict với đồng nghiệp

1. Lắng nghe quan điểm đối phương.
2. Trình bày lập trường dựa trên dữ liệu.
3. Tìm giải pháp win-win.
4. Nếu không thống nhất, nhờ lead/team quyết định.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: API chậm, bạn xử lý thế nào?**
> "Đầu tiên em kiểm tra log và metric để xác định bottleneck. Nếu là DB thì kiểm tra query, index, N+1. Nếu là external API thì kiểm tra timeout và circuit breaker. Nếu cần thì thêm cache hoặc scale. Cuối cùng verify hiệu năng sau fix."

**Câu: Production có bug nghiêm trọng?**
> "Em sẽ rollback nếu cần để giảm ảnh hưởng. Sau đó reproduce ở local, phân tích log để tìm root cause, fix và test kỹ, deploy lại và monitor. Cuối cùng viết post-mortem để rút kinh nghiệm."

---

## ✅ CHECKLIST PHẦN 20`,checklist:[`Biết cách debug API chậm.`,`Biết cách xử lý production bug.`,`Biết cách resolve merge conflict.`,`Biết xử lý requirement mơ hồ.`,`Biết cách xử lý deadlock.`,`Biết cách phân tích memory leak.`,`Biết cách xử lý conflict trong team.`]},{file:`Phan21_100_Cau_Hoi_Tu_Kiem_Tra_Tra_Loi.md`,title:`📄 PHẦN 21 — 100+ CÂU HỎI TỰ KIỂM TRA (CÓ ĐÁP ÁN)`,content:`---

## PHẦN 1 — Java Core

**1. Sự khác nhau giữa \`==\` và \`.equals()\`?**
> \`==\` so sánh reference (địa chỉ bộ nhớ) hoặc giá trị primitive. \`.equals()\` so sánh nội dung object, có thể override.

**2. \`String\` là immutable hay mutable? Tại sao?**
> Immutable. Giúp thread-safe, tiết kiệm bộ nhớ nhờ string pool, và an toàn khi dùng làm key trong HashMap.

**3. \`StringBuilder\` vs \`StringBuffer\`?**
> \`StringBuilder\` nhanh hơn nhưng không thread-safe. \`StringBuffer\` thread-safe nhờ \`synchronized\` nhưng chậm hơn.

**4. \`final\`, \`finally\`, \`finalize\` khác nhau thế nào?**
> \`final\`: keyword khai báo hằng, class/method không override. \`finally\`: khối luôn chạy sau try-catch. \`finalize()\`: method GC gọi trước khi thu hồi object.

**5. \`static\` method có thể override không? Tại sao?**
> Không. Static thuộc về class, không phải instance. Có thể "hide" bằng static method cùng tên ở subclass.

**6. \`abstract class\` vs \`interface\`?**
> Abstract class có constructor, state, method cụ thể. Interface (Java 8+) có default/static methods. Class extends abstract class, implements interface.

**7. \`HashMap\` hoạt động như thế nào?**
> Lưu entry dưới dạng key-value bucket dựa trên hashCode. Khi hash collision dùng linked list hoặc cây đỏ-đen (từ Java 8).

**8. \`ArrayList\` vs \`LinkedList\`?**
> \`ArrayList\`: truy cập index nhanh O(1), chèn/xóa chậm O(n). \`LinkedList\`: chèn/xóa nhanh O(1), truy cập chậm O(n).

**9. \`Comparable\` vs \`Comparator\`?**
> \`Comparable\` dùng để sắp xếp natural order trong class (\`compareTo\`). \`Comparator\` dùng để định nghĩa nhiều cách sắp xếp bên ngoài.

**10. \`Iterator\` vs \`ListIterator\`?**
> \`Iterator\` duyệt 1 chiều, remove. \`ListIterator\` duyệt 2 chiều, add/set, chỉ dùng cho List.

**11. Sự khác nhau giữa \`throw\` và \`throws\`?**
> \`throw\` ném exception. \`throws\` khai báo exception method có thể ném.

**12. \`checked exception\` vs \`unchecked exception\`?**
> Checked: extends Exception, bắt buộc handle hoặc throws. Unchecked: extends RuntimeException, không bắt buộc.

**13. \`try-with-resources\` dùng để làm gì?**
> Tự động đóng resource (Closeable/AutoCloseable) sau khối try, tránh leak.

**14. \`Serializable\` là gì?**
> Interface đánh dấu object có thể serialize (chuyển object thành byte stream) để lưu trữ hoặc truyền tải.

**15. \`volatile\` keyword có tác dụng gì?**
> Đảm bảo biến luôn đọc từ main memory, không dùng CPU cache. Không đảm bảo atomicity.

---

## PHẦN 2 — Java 8+

**16. Lambda expression là gì?**
> Cách viết anonymous function ngắn gọn, dùng với functional interface. Ví dụ: \`list.forEach(x -> System.out.println(x))\`.

**17. Functional interface là gì? Cho ví dụ.**
> Interface chỉ có 1 abstract method. Ví dụ: \`Runnable\`, \`Callable\`, \`Comparator\`, \`Predicate\`, \`Function\`, \`Consumer\`, \`Supplier\`.

**18. \`Stream API\` dùng để làm gì?**
> Xử lý collection theo hướng functional, hỗ trợ filter, map, reduce, collect, lazy evaluation.

**19. \`map()\` vs \`flatMap()\`?**
> \`map()\` biến đổi mỗi phần tử thành 1 giá trị. \`flatMap()\` biến đổi mỗi phần tử thành stream và "làm phẳng" thành 1 stream.

**20. \`filter()\`, \`reduce()\`, \`collect()\` dùng khi nào?**
> \`filter()\`: lọc phần tử. \`reduce()\`: gộp thành 1 giá trị. \`collect()\`: gom kết quả vào collection.

**21. \`Optional\` dùng để giải quyết vấn đề gì?**
> Tránh NullPointerException, buộc xử lý trường hợp value absent một cách rõ ràng.

**22. Method reference có mấy loại?**
> 4 loại: static (\`Class::method\`), instance of object (\`obj::method\`), instance of class (\`Class::method\`), constructor (\`Class::new\`).

**23. \`default method\` trong interface là gì?**
> Method có implementation trong interface, cho phép mở rộng interface mà không break class đã implement.

**24. \`CompletableFuture\` dùng để làm gì?**
> Xử lý async programming, kết hợp nhiều future, xử lý callback mà không block thread.

**25. \`Record\` trong Java 14+ là gì?**
> Class immutable tự động sinh constructor, getter, equals, hashCode, toString. Dùng cho data carrier.

---

## PHẦN 3 — OOP & Design Patterns

**26. 4 tính chất của OOP?**
> Encapsulation, Inheritance, Polymorphism, Abstraction.

**27. SOLID principles là gì?**
> S: Single Responsibility — 1 class 1 nhiệm vụ.
> O: Open/Closed — mở rộng, đóng sửa đổi.
> L: Liskov Substitution — subclass thay thế được base class.
> I: Interface Segregation — interface nhỏ, chuyên biệt.
> D: Dependency Inversion — phụ thuộc abstraction.

**28. Dependency Injection là gì?**
> Cung cấp dependency từ bên ngoài thay vì class tự tạo. Giúp loose coupling, dễ test.

**29. Singleton pattern là gì? Cách triển khai thread-safe?**
> Chỉ tạo 1 instance. Thread-safe bằng \`enum\`, hoặc \`synchronized\`, hoặc Bill Pugh Singleton (static inner class).

**30. Factory pattern dùng khi nào?**
> Khi cần tạo object mà không expose logic khởi tạo, hoặc tạo object dựa trên điều kiện runtime.

**31. Strategy pattern là gì?**
> Định nghĩa họ thuật toán, cho phép hoán đổi linh hoạt runtime.

**32. Observer pattern là gì?**
> Một subject thông báo đến nhiều observer khi có thay đổi trạng thái.

**33. Builder pattern dùng khi nào?**
> Khi object có nhiều thuộc tính, constructor quá dài, hoặc có tùy chọn optional.

**34. Repository pattern là gì?**
> Tầng trung gian giữa business logic và data access, ẩn chi tiết persistence.

**35. MVC vs layered architecture?**
> MVC chia thành Model-View-Controller. Layered architecture chia theo tầng: presentation, business, data access.

---

## PHẦN 4 — Multithreading

**36. \`Process\` vs \`Thread\`?**
> Process là chương trình độc lập có bộ nhớ riêng. Thread là đơn vị thực thi trong process, chia sẻ bộ nhớ.

**37. \`Runnable\` vs \`Callable\`?**
> \`Runnable\` không trả về kết quả, không throw checked exception. \`Callable\` trả về kết quả và có thể throw exception.

**38. \`synchronized\` keyword hoạt động thế nào?**
> Khóa monitor của object/class, chỉ cho phép 1 thread vào critical section.

**39. \`ReentrantLock\` khác gì \`synchronized\`?**
> ReentrantLock linh hoạt hơn: tryLock, lockInterruptibly, fair lock, nhiều condition variables. Cần unlock thủ công.

**40. \`ExecutorService\` là gì?**
> Framework quản lý pool thread, submit task, quản lý lifecycle.

**41. \`ForkJoinPool\` dùng khi nào?**
> Dùng cho divide-and-conquer task, ví dụ \`RecursiveTask\`, \`RecursiveAction\`, parallel streams.

**42. \`CountDownLatch\` vs \`CyclicBarrier\`?**
> \`CountDownLatch\` chờ N event hoàn thành, không reset. \`CyclicBarrier\` chờ N thread gặp nhau tại barrier, có thể reuse.

**43. \`ConcurrentHashMap\` khác gì \`HashTable\`?**
> \`ConcurrentHashMap\` lock ở mức bucket (Java 8 dùng CAS + synchronized), hiệu năng cao hơn. \`HashTable\` lock toàn bộ map.

**44. Race condition là gì?**
> Nhiều thread truy cập/chỉnh sửa dữ liệu chia sẻ, kết quả phụ thuộc thứ tự thực thi.

**45. Deadlock là gì? Cách tránh?**
> 2+ thread chờ lẫn nhau giữ tài nguyên. Tránh bằng cách định thứ tự lock nhất quán, dùng timeout, giảm phạm vi lock.

---

## PHẦN 5 — SQL & Database

**46. ACID là gì?**
> Atomicity, Consistency, Isolation, Durability.

**47. Index là gì? Tại sao cần index?**
> Cấu trúc dữ liệu giúp truy vấn nhanh hơn (thường là B-Tree). Giảm thờ gian tìm kiếm.

**48. Clustered index vs Non-clustered index?**
> Clustered: dữ liệu vật lý sắp xếp theo index. Non-clustered: chỉ lưu con trỏ đến dữ liệu.

**49. JOIN có mấy loại? Kể tên.**
> INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, SELF JOIN.

**50. \`WHERE\` vs \`HAVING\`?**
> \`WHERE\` lọc trước khi group. \`HAVING\` lọc sau khi group, dùng với aggregate.

**51. \`DELETE\` vs \`TRUNCATE\` vs \`DROP\`?**
> DELETE: xóa từng dòng, có thể rollback, chậm. TRUNCATE: xóa toàn bộ, nhanh, reset identity. DROP: xóa cả table.

**52. Normalization là gì? Có mấy dạng chuẩn?**
> Chia nhỏ bảng để giảm redundancy. Các dạng: 1NF, 2NF, 3NF, BCNF, 4NF, 5NF.

**53. N+1 query problem là gì? Cách giải quyết?**
> 1 query lấy parent + N query lấy child. Giải quyết bằng JOIN FETCH, Entity Graph, hoặc \`@BatchSize\`.

**54. Transaction isolation levels có mấy cấp?**
> READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.

**55. Optimistic locking vs Pessimistic locking?**
> Optimistic: kiểm tra version khi update. Pessimistic: khóa dòng ngay khi đọc.

---

## PHẦN 6 — Spring Boot

**56. Spring Boot là gì? Lợi ích?**
> Framework giúp xây dựng ứng dụng Spring nhanh với auto-configuration, starter dependencies, embedded server.

**57. \`@SpringBootApplication\` bao gồm những annotation nào?**
> \`@Configuration\`, \`@EnableAutoConfiguration\`, \`@ComponentScan\`.

**58. \`@Component\`, \`@Service\`, \`@Repository\`, \`@Controller\` khác nhau thế nào?**
> Tất cả đều là stereotype. \`@Service\` đánh dấu business logic. \`@Repository\` có exception translation. \`@Controller\` xử lý request.

**59. \`@Autowired\` inject theo cách nào?**
> Mặc định by type. Có thể kết hợp \`@Qualifier\` để by name.

**60. \`@Qualifier\` dùng để làm gì?**
> Chỉ định bean cụ thể khi có nhiều bean cùng type.

**61. Spring Bean lifecycle?**
> Instantiate → populate properties → aware interfaces → BeanPostProcessor before → init method → after → ready for use → destroy.

**62. \`@Value\` và \`@ConfigurationProperties\` khác nhau?**
> \`@Value\` inject từng giá trị. \`@ConfigurationProperties\` bind nhiều giá trị có tiền tố vào POJO.

**63. \`@Transactional\` hoạt động như thế nào?**
> Spring tạo proxy (JDK dynamic hoặc CGLIB), quản lý transaction begin/commit/rollback xung quanh method.

**64. Spring AOP là gì? Dùng khi nào?**
> Aspect-Oriented Programming, cắt ngang cross-cutting concerns như logging, transaction, security.

**65. Spring Boot Actuator dùng để làm gì?**
> Cung cấp endpoint giám sát health, metrics, info của ứng dụng.

---

## PHẦN 7 — REST API

**66. RESTful API là gì?**
> API tuân theo REST principles: stateless, resource-based, dùng HTTP methods và status code chuẩn.

**67. HTTP methods: GET, POST, PUT, DELETE, PATCH?**
> GET: lấy. POST: tạo. PUT: cập nhật toàn bộ. DELETE: xóa. PATCH: cập nhật một phần.

**68. HTTP status code: 200, 201, 204, 400, 401, 403, 404, 500?**
> 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error.

**69. Idempotency là gì? Methods nào idempotent?**
> Gọi nhiều lần cho cùng kết quả. GET, PUT, DELETE idempotent. POST thường không idempotent.

**70. \`@RequestParam\` vs \`@PathVariable\`?**
> \`@RequestParam\` lấy query parameter. \`@PathVariable\` lấy giá trị từ URL path.

**71. DTO là gì? Tại sao dùng DTO?**
> Data Transfer Object, dùng để truyền dữ liệu giữa layer. Giúp giấu entity, validate, format dữ liệu.

**72. \`@Valid\` và \`@Validated\` khác nhau?**
> \`@Valid\` hỗ trợ nested validation. \`@Validated\` hỗ trợ group validation.

**73. Global exception handling trong Spring?**
> Dùng \`@RestControllerAdvice\` + \`@ExceptionHandler\` để xử lý exception chung.

**74. Pagination trong Spring Data JPA?**
> Dùng \`Pageable\` parameter và trả về \`Page<T>\`. Ví dụ: \`repository.findAll(PageRequest.of(0, 10))\`.

**75. Versioning API có những cách nào?**
> URL path (\`/v1/users\`), request param, header (\`Accept-Version\`), media type versioning.

---

## PHẦN 8 — JPA / Hibernate

**76. JPA vs Hibernate?**
> JPA là specification. Hibernate là implementation phổ biến của JPA.

**77. \`@Entity\`, \`@Table\`, \`@Id\`, \`@GeneratedValue\`?**
> \`@Entity\`: đánh dấu class ánh xạ bảng. \`@Table\`: tên bảng. \`@Id\`: khóa chính. \`@GeneratedValue\`: tự động sinh ID.

**78. \`@OneToMany\`, \`@ManyToOne\`, \`@ManyToMany\`?**
> Định nghĩa quan hệ 1-n, n-1, n-n giữa entity.

**79. \`FetchType.LAZY\` vs \`FetchType.EAGER\`?**
> LAZY: load dữ liệu liên quan khi truy cập. EAGER: load ngay lập tức cùng entity chính.

**80. \`cascade\` là gì? Các loại cascade?**
> Tự động áp dụng operation cho entity liên quan. Các loại: PERSIST, MERGE, REMOVE, REFRESH, DETACH, ALL.

**81. \`orphanRemoval\` là gì?**
> Tự động xóa entity con khi bị loại khỏi collection của parent.

**82. \`@Column\`, \`@JoinColumn\`?**
> \`@Column\`: ánh xạ cột thường. \`@JoinColumn\`: ánh xạ khóa ngoại.

**83. JPQL vs native query?**
> JPQL truy vấn entity và thuộc tính, database-independent. Native query viết SQL thuần túy.

**84. First-level cache vs second-level cache?**
> First-level cache: mặc định theo EntityManager/Session. Second-level cache: cache toàn cục, cần cấu hình provider (Ehcache, Caffeine).

**85. \`@Query\` và \`@Modifying\`?**
> \`@Query\`: custom query. \`@Modifying\`: đánh dấu query là INSERT/UPDATE/DELETE trong \`@Transactional\`.

---

## PHẦN 9 — Security & JWT

**86. Authentication vs Authorization?**
> Authentication: xác minh "ai bạn là". Authorization: xác định "bạn đượ phép làm gì".

**87. JWT gồm mấy phần?**
> 3 phần: Header, Payload, Signature, ngăn cách bằng dấu chấm.

**88. Cách bảo mật JWT?**
> Dùng secret mạnh, HS256/RS256, set expiration ngắn, lưu trữ an toàn, dùng refresh token, HTTPS.

**89. OAuth2 flow cơ bản?**
> Client yêu cầu authorization → User đồng ý → Authorization server cấp access token → Client dùng token gọi resource server.

**90. Spring Security filter chain?**
> Chuỗi filter xử lý request: authentication, authorization, CSRF, session, exception handling.

**91. \`BCryptPasswordEncoder\` dùng để làm gì?**
> Hash password với salt tự động, chậm và an toàn.

**92. CSRF là gì? Cách chống?**
> Cross-Site Request Forgery: kẻ tấn công lừa user thực hiện request. Chống bằng CSRF token, SameSite cookie.

**93. CORS là gì? Cách cấu hình?**
> Cross-Origin Resource Sharing. Cấu hình allowed origins, methods, headers trong Spring bằng \`CorsRegistry\`.

**94. HTTPS hoạt động như thế nào?**
> Dùng TLS/SSL để mã hóa dữ liệu giữa client và server qua handshake và certificate.

**95. Session-based auth vs Token-based auth?**
> Session: server lưu session, client giữ session ID. Token: server không lưu trạng thái, client gửi token mỗi request.

---

## PHẦN 10 — DevOps & Cloud

**96. Docker image vs container?**
> Image là template read-only. Container là instance đang chạy của image.

**97. Docker Compose dùng để làm gì?**
> Định nghĩa và chạy nhiều container cùng lúc qua file YAML.

**98. CI/CD là gì?**
> Continuous Integration: tự động build/test khi code thay đổi. Continuous Deployment/Delivery: tự động triển khai.

**99. Kafka dùng để làm gì?**
> Message broker phân tán, streaming dữ liệu real-time, giải coupling giữa services.

**100. AWS EC2 vs ECS vs EKS?**
> EC2: máy chủ ảo tự quản lý. ECS: dịch vụ quản lý container. EKS: Kubernetes managed.

**101. Load balancer L4 vs L7?**
> L4 dựa trên IP/port. L7 dựa trên nội dung request như URL, header, cookie.

**102. Redis dùng để làm gì?**
> In-memory data store, dùng làm cache, session, rate limit, pub/sub, leaderboard.

**103. CAP theorem là gì?**
> Hệ thống phân tán chỉ đảm bảo 2/3: Consistency, Availability, Partition Tolerance.

**104. Rate limiting là gì?**
> Giới hạn số request từ một client trong khoảng thờ gian nhất định.

**105. Blue-green deployment là gì?**
> Triển khai 2 môi trường giống hệt nhau, chuyển traffic từ blue sang green để giảm downtime và dễ rollback.

---

## ✅ CHECKLIST PHẦN 21`,checklist:[`Đọc và hiểu từng câu trả lởi.`,`Tự trả lởi lại bằng lờ của mình.`,`Đánh dấu câu nào chưa chắc để ôn lại.`,`Luyện nói ngắn gọn, rõ ràng, có ví dụ.`]},{file:`Phan21_100_Cau_Hoi_Tu_Kiem_Tra.md`,title:`📄 PHẦN 21 — 100 CÂU HỎI TỰ KIỂM TRA`,content:"---\n\nDùng danh sách này để tự đánh giá trình độ. Nếu trả lởi đượ dưới 70 câu, nên quay lại ôn các phần tương ứng.\n\n---\n\n## PHẦN 1 — Java Core\n\n1. Sự khác nhau giữa `==` và `.equals()`?\n2. `String` là immutable hay mutable? Tại sao?\n3. `StringBuilder` vs `StringBuffer`?\n4. `final`, `finally`, `finalize` khác nhau thế nào?\n5. `static` method có thể override không? Tại sao?\n6. `abstract class` vs `interface`?\n7. `HashMap` hoạt động như thế nào?\n8. `ArrayList` vs `LinkedList`?\n9. `Comparable` vs `Comparator`?\n10. `Iterator` vs `ListIterator`?\n11. Sự khác nhau giữa `throw` và `throws`?\n12. `checked exception` vs `unchecked exception`?\n13. `try-with-resources` dùng để làm gì?\n14. `Serializable` là gì?\n15. `volatile` keyword có tác dụng gì?\n\n## PHẦN 2 — Java 8+\n\n16. Lambda expression là gì?\n17. Functional interface là gì? Cho ví dụ.\n18. `Stream API` dùng để làm gì?\n19. `map()` vs `flatMap()`?\n20. `filter()`, `reduce()`, `collect()` dùng khi nào?\n21. `Optional` dùng để giải quyết vấn đề gì?\n22. Method reference có mấy loại?\n23. `default method` trong interface là gì?\n24. `CompletableFuture` dùng để làm gì?\n25. `Record` trong Java 14+ là gì?\n\n## PHẦN 3 — OOP & Design Patterns\n\n26. 4 tính chất của OOP?\n27. SOLID principles là gì? Giải thích từng chữ.\n28. Dependency Injection là gì?\n29. Singleton pattern là gì? Cách triển khai thread-safe?\n30. Factory pattern dùng khi nào?\n31. Strategy pattern là gì?\n32. Observer pattern là gì?\n33. Builder pattern dùng khi nào?\n34. Repository pattern là gì?\n35. MVC vs layered architecture?\n\n## PHẦN 4 — Multithreading\n\n36. `Process` vs `Thread`?\n37. `Runnable` vs `Callable`?\n38. `synchronized` keyword hoạt động thế nào?\n39. `ReentrantLock` khác gì `synchronized`?\n40. `ExecutorService` là gì?\n41. `ForkJoinPool` dùng khi nào?\n42. `CountDownLatch` vs `CyclicBarrier`?\n43. `ConcurrentHashMap` khác gì `HashTable`?\n44. Race condition là gì?\n45. Deadlock là gì? Cách tránh?\n\n## PHẦN 5 — SQL & Database\n\n46. ACID là gì?\n47. Index là gì? Tại sao cần index?\n48. Clustered index vs Non-clustered index?\n49. JOIN có mấy loại? Kể tên.\n50. `WHERE` vs `HAVING`?\n51. `DELETE` vs `TRUNCATE` vs `DROP`?\n52. Normalization là gì? Có mấy dạng chuẩn?\n53. N+1 query problem là gì? Cách giải quyết?\n54. Transaction isolation levels có mấy cấp?\n55. Optimistic locking vs Pessimistic locking?\n\n## PHẦN 6 — Spring Boot\n\n56. Spring Boot là gì? Lợi ích?\n57. `@SpringBootApplication` bao gồm những annotation nào?\n58. `@Component`, `@Service`, `@Repository`, `@Controller` khác nhau thế nào?\n59. `@Autowired` inject theo cách nào?\n60. `@Qualifier` dùng để làm gì?\n61. Spring Bean lifecycle?\n62. `@Value` và `@ConfigurationProperties` khác nhau?\n63. `@Transactional` hoạt động như thế nào?\n64. Spring AOP là gì? Dùng khi nào?\n65. Spring Boot Actuator dùng để làm gì?\n\n## PHẦN 7 — REST API\n\n66. RESTful API là gì?\n67. HTTP methods: GET, POST, PUT, DELETE, PATCH?\n68. HTTP status code: 200, 201, 204, 400, 401, 403, 404, 500?\n69. Idempotency là gì? Methods nào idempotent?\n70. `@RequestParam` vs `@PathVariable`?\n71. DTO là gì? Tại sao dùng DTO?\n72. `@Valid` và `@Validated` khác nhau?\n73. Global exception handling trong Spring?\n74. Pagination trong Spring Data JPA?\n75. Versioning API có những cách nào?\n\n## PHẦN 8 — JPA / Hibernate\n\n76. JPA vs Hibernate?\n77. `@Entity`, `@Table`, `@Id`, `@GeneratedValue`?\n78. `@OneToMany`, `@ManyToOne`, `@ManyToMany`?\n79. `FetchType.LAZY` vs `FetchType.EAGER`?\n80. `cascade` là gì? Các loại cascade?\n81. `orphanRemoval` là gì?\n82. `@Column`, `@JoinColumn`?\n83. JPQL vs native query?\n84. First-level cache vs second-level cache?\n85. `@Query` và `@Modifying`?\n\n## PHẦN 9 — Security & JWT\n\n86. Authentication vs Authorization?\n87. JWT gồm mấy phần?\n88. Cách bảo mật JWT?\n89. OAuth2 flow cơ bản?\n90. Spring Security filter chain?\n91. `BCryptPasswordEncoder` dùng để làm gì?\n92. CSRF là gì? Cách chống?\n93. CORS là gì? Cách cấu hình?\n94. HTTPS hoạt động như thế nào?\n95. Session-based auth vs Token-based auth?\n\n## PHẦN 10 — DevOps & Cloud\n\n96. Docker image vs container?\n97. Docker Compose dùng để làm gì?\n98. CI/CD là gì?\n99. Kafka dùng để làm gì?\n100. AWS EC2 vs ECS vs EKS?\n101. Load balancer L4 vs L7?\n102. Redis dùng để làm gì?\n103. CAP theorem là gì?\n104. Rate limiting là gì?\n105. Blue-green deployment là gì?\n\n---\n\n## ✅ CHECKLIST PHẦN 21",checklist:[`Trả lởi đượ ít nhất 70/105 câu.`,`Xác định đượ các chủ đề còn yếu.`,`Quay lại ôn lại các phần tương ứng.`,`Luyện nói câu trả lởi ngắn gọn rõ ràng.`]},{file:`Phan22_DesignPatterns_CheatSheet.md`,title:`📄 PHẦN 22 — DESIGN PATTERNS NÂNG CAO`,content:`---

## 1. Singleton (Đảm bảo duy nhất 1 instance)

\`\`\`java
public enum Singleton {
    INSTANCE;
    public void doSomething() { ... }
}
\`\`\`

**Thread-safe ngay từ đầu**, không reflection attack được.

---

## 2. Factory Method vs Abstract Factory

| Factory Method | Abstract Factory |
|---|---|
| 1 method tạo 1 loại object | 1 factory tạo family object |
| Subclass quyết định concrete class | Factory interface có nhiều implementation |
| \`Document createDocument()\` | \`GuiFactory.createButton(), createCheckbox()\` |

**Ví dụ Spring:** \`BeanFactory\` là Abstract Factory, mỗi \`@Bean\` method là Factory Method.

---

## 3. Builder Pattern

Dùng khi object có nhiều optional field, cần immutable.

\`\`\`java
User user = User.builder()
    .name("John")
    .age(30)
    .email("john@email.com")
    .build();
\`\`\`

**Lombok:** \`@Builder\` tự sinh Builder class.

---

## 4. Strategy Pattern

Cho phép thay đổi thuật toán tại runtime. Tuân thủ Open/Closed.

\`\`\`java
public interface PaymentStrategy {
    void pay(BigDecimal amount);
}

@Service
public class CreditCardPayment implements PaymentStrategy { ... }
@Service
public class PayPalPayment implements PaymentStrategy { ... }
\`\`\`

---

## 5. Observer Pattern (Event-Driven)

Khi 1 object thay đổi state → notify tất cả observer.

**Spring:** \`@EventListener\`, \`ApplicationEventPublisher\`.

\`\`\`java
@Component
public class OrderCreatedListener {
    @EventListener
    public void handle(OrderCreatedEvent event) { ... }
}
\`\`\`

---

## 6. Decorator Pattern

Wrapper linh hoạt — thêm behavior mà không sửa class gốc.

**Java I/O:** \`BufferedReader br = new BufferedReader(new FileReader("file.txt"));\`

---

## 7. Proxy Pattern

Object đại diện kiểm soát truy cập đến object thật.

\`\`\`java
@Entity
public class Product {
    @ManyToOne(fetch = FetchType.LAZY)
    private Category category; // Hibernate proxy
}
\`\`\`

**Spring AOP:** \`@Transactional\` tạo proxy tự động.

---

## 8. Template Method Pattern

Định nghĩa khung thuật toán, để subclass implement chi tiết.

\`\`\`java
public abstract class DataProcessor {
    public final void process() {
        read();
        processData();
        save();
    }
    protected abstract void read();
    protected abstract void processData();
    protected abstract void save();
}
\`\`\`

**Spring:** \`JdbcTemplate\`, \`RestTemplate\`, \`JpaRepository<T, ID>\`.

---

## 9. Dependency Injection & IoC

**IoC (Inversion of Control):** Thay vì tự tạo object, DI container làm việc đó.

**Spring DI:** Constructor Injection được khuyến nghị.

\`\`\`java
@Service
public class OrderService {
    private final OrderRepository repo;

    public OrderService(OrderRepository repo) { // Spring tự inject
        this.repo = repo;
    }
}
\`\`\`

---

## 10. SOLID Principles

| Principle | Ý nghĩa | Ví dụ vi phạm |
|---|---|---|
| **S**RP — 1 class 1 lý do thay đổi | \`UserService\` không nên gửi email | Tách \`EmailService\` |
| **O**CP — Mở rộng, đóng sửa | Thêm strategy, không sửa controller | Dùng interface |
| **L**SP — Subclass thay được cha | \`Square extends Rectangle\` → sai | Dùng interface chung |
| **I**SP — Nhiều interface nhỏ | \`Worker { eat(), work() }\` tách thành 2 | \`Eatable\`, \`Workable\` |
| **D**IP — Phụ thuộc abstraction | \`Service\` phụ thuộc \`Repository\` interface | Không phụ thuộc \`JdbcRepositoryImpl\` |

---

## 💬 Câu trả lời mẫu 60 giây

**Câu: Singleton pattern và thread-safety?**
> "Cách an toàn nhất là dùng enum Singleton của Java. Hoặc dùng static inner class — JVM tự đảm bảo thread-safety khi load class. Không dùng double-checked locking trừ khi thực sự cần."

**Câu: Khi nào dùng Strategy vs Decorator?**
> "Strategy dùng khi muốn thay đổi thuật toán (cách làm). Decorator dùng khi muốn thêm behavior cho object (wrap thêm). Strategy = interchangeable algorithm, Decorator = dynamic wrapper."

**Câu: DI/IoC giúp gì?**
> "Giảm coupling, dễ test (mock), dễ thay đổi implementation. Spring quản lý lifecycle của bean."

---

## ✅ CHECKLIST PHẦN 22`,checklist:[`Viết Singleton thread-safe với enum.`,`Phân biệt Factory Method vs Abstract Factory.`,`Dùng Builder cho object nhiều field.`,`Implement Strategy Pattern.`,`Dùng @EventListener cho event-driven.`,`Giải thích Proxy Pattern trong Hibernate/Spring AOP.`,`Giải thích Template Method với Spring template classes.`,`Trình bày SOLID và ví dụ từng principle.`,`Giải thích IoC và Constructor Injection.`]},{file:`Phan23_Reactive_CheatSheet.md`,title:`📄 PHẦN 23 — REACTIVE PROGRAMMING (WebFlux + R2DBC)`,content:`---

## 1. Reactive Programming là gì?

Lập trình **bất đồng bộ, non-blocking**, dùng stream dữ liệu với **backpressure**.

**Blocking vs Reactive:**

\`\`\`java
// Blocking — thread chờ
String result = restTemplate.getForObject(url, String.class);

// Reactive — thread không block
Mono<String> result = webClient.get().uri(url).retrieve().bodyToMono(String.class);
result.subscribe(data -> System.out.println(data));
\`\`\`

---

## 2. Reactive Streams Specification

| Thành phần | Vai trò |
|---|---|
| **Publisher** | Phát dữ liệu (\`Mono\`, \`Flux\`) |
| **Subscriber** | Nhận dữ liệu |
| **Subscription** | Kết nối Publisher ↔ Subscriber, hỗ trợ \`request(n)\` |
| **Processor** | Vừa là Publisher vừa là Subscriber |

**Backpressure:** Subscriber kiểm soát tốc độ bằng \`request(n)\`.

---

## 3. Mono vs Flux

| Mono<T> | Flux<T> |
|---|---|
| 0 hoặc 1 item | 0..N items |
| \`Mono.just("Hello")\` | \`Flux.just("A", "B", "C")\` |
| Dùng cho single result API | Dùng cho list, stream |

---

## 4. WebFlux — Reactive REST API

**Dependency:**
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
\`\`\`

**Controller:**
\`\`\`java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @GetMapping
    public Flux<ProductDto> getAll() {
        return productService.findAll();  // trả về Flux
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ProductDto>> getById(@PathVariable Long id) {
        return productService.findById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ProductDto> create(@RequestBody ProductDto dto) {
        return productService.create(dto);
    }
}
\`\`\`

---

## 5. R2DBC — Reactive Database

**Dependency:**
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-r2dbc</artifactId>
</dependency>
\`\`\`

**Repository:**
\`\`\`java
public interface ProductRepository extends ReactiveCrudRepository<Product, Long> {
    Flux<Product> findByCategory(String category);
    Mono<Product> findByName(String name);
}
\`\`\`

---

## 6. WebClient (thay thế RestTemplate)

\`\`\`java
WebClient client = WebClient.create("https://api.example.com");

Mono<UserResponse> result = client.get()
    .uri("/users/{id}", userId)
    .header("Authorization", "Bearer " + token)
    .retrieve()
    .bodyToMono(UserResponse.class);
\`\`\`

**RestTemplate bị deprecated từ Spring 5**, thay bằng WebClient.

---

## 7. Error Handling trong Reactive

\`\`\`java
public Mono<ProductDto> findById(Long id) {
    return repository.findById(id)
        .switchIfEmpty(Mono.error(new ProductNotFoundException(id)))
        .onErrorResume(DataIntegrityViolationException.class,
            e -> Mono.error(new BadRequestException("Data integrity error")))
        .timeout(Duration.ofSeconds(5))
        .retry(3);
}
\`\`\`

---

## 8. Marble Diagram (hiểu luồng)

\`\`\`
Flux.fromIterable(users)
  .filter(u -> u.isActive())       // lọc
  .flatMap(u -> findOrders(u.id())) // gọi async → flatten
  .groupBy(Order::getStatus)        // nhóm
  .flatMap(group -> group.collectList()) // gom list
  .subscribe(System.out::println);
\`\`\`

**Toán tử hay dùng:** \`map\`, \`flatMap\`, \`filter\`, \`doOnNext\`, \`switchIfEmpty\`, \`timeout\`, \`retry\`, \`zip\`, \`merge\`.

---

## 9. Threading Model

- **Event Loop:** 1 thread trên mỗi CPU core (như Node.js).
- **Scheduler:** \`Schedulers.boundedElastic()\` cho blocking code, \`Schedulers.parallel()\` cho CPU-bound.

\`\`\`java
Mono.fromCallable(() -> heavyComputation())
    .subscribeOn(Schedulers.boundedElastic());
\`\`\`

---

## 💬 Câu trả lời mẫu 60 giây

**Câu: Reactive Programming khác gì với blocking?**
> "Blocking: thread chờ I/O → lãng phí tài nguyên. Reactive: dùng event loop, thread không chờ — khi có data thì callback. WebFlux dùng non-blocking I/O, giúp xử lý nhiều request hơn với ít thread hơn."

**Câu: Khi nào dùng WebFlux?**
> "Khi ứng dụng có nhiều I/O (gọi API, DB) và cần scale nhiều kết nối. Ví dụ API Gateway, streaming service. Nếu ứng dụng đơn giản, CRUD ít request thì MVC vẫn ổn."

**Câu: FlatMap vs Map trong Reactor?**
> "Map biến đổi đồng bộ 1:1. FlatMap biến đổi bất đồng bộ và flatten (1:N), dùng để gọi API/DB trong stream."

---

## ✅ CHECKLIST PHẦN 23`,checklist:[`Giải thích Reactive Programming và Event Loop.`,`Phân biệt Mono vs Flux.`,`Viết Controller WebFlux cơ bản.`,`Viết Repository R2DBC.`,`Dùng WebClient gọi API.`,`Xử lý lỗi với switchIfEmpty / onErrorResume.`,`Phân biệt map vs flatMap trong Reactor.`,`Biết threading model và Schedulers.`]},{file:`Phan24_Kubernetes_CheatSheet.md`,title:`📄 PHẦN 24 — KUBERNETES & CLOUD NATIVE`,content:`---

## 1. Kubernetes là gì?

Hệ thống orchestration container, tự động **deploy, scale, manage** container.

---

## 2. Core Concepts

| Khái niệm | Ý nghĩa |
|---|---|
| **Pod** | Đơn vị nhỏ nhất — 1 hoặc nhiều container chạy cùng nhau |
| **Deployment** | Quản lý replica Pod, rollout, rollback |
| **Service** | Stable endpoint để Pod giao tiếp (ClusterIP, NodePort, LoadBalancer) |
| **Ingress** | Router HTTP/HTTPS vào Service |
| **ConfigMap / Secret** | Lưu cấu hình / nhạy cảm |
| **PersistentVolume** | Lưu trữ dữ liệu bền vững |

---

## 3. Kubernetes Architecture

\`\`\`
Control Plane (Master)
├── API Server (kube-apiserver)
├── Scheduler (kube-scheduler)
├── Controller Manager (kube-controller-manager)
└── etcd (distributed key-value store)

Worker Node
├── Kubelet (agent)
├── Kube-proxy (network)
└── Container Runtime (Docker / containerd)
\`\`\`

---

## 4. Deployment cơ bản

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:1.0.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "k8s"
\`\`\`

---

## 5. Service & Ingress

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: ClusterIP
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80
\`\`\`

---

## 6. Kubernetes với Spring Boot

**application-k8s.yaml:**
\`\`\`yaml
spring:
  datasource:
    url: jdbc:mysql://mysql-service:3306/db
  config:
    import: configmap:app-config
\`\`\`

**Health check:** Spring Actuator \`/actuator/health\` → liveness + readiness.

---

## 7. Helm — Package Manager

\`\`\`bash
helm create mychart
helm install myapp ./mychart
helm upgrade myapp ./mychart --set image.tag=1.1.0
helm rollback myapp 1
\`\`\`

**Values file:**
\`\`\`yaml
replicaCount: 3
image:
  repository: myapp
  tag: "1.0.0"
service:
  port: 80
\`\`\`

---

## 8. kubectl commands hay dùng

\`\`\`bash
kubectl get pods -w
kubectl logs -f deployment/myapp
kubectl exec -it pod-name -- /bin/sh
kubectl describe pod pod-name
kubectl port-forward svc/myapp-service 8080:80
kubectl apply -f deployment.yaml
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp
\`\`\`

---

## 9. Auto-scaling

\`\`\`bash
kubectl autoscale deployment myapp --cpu-percent=70 --min=2 --max=10
\`\`\`

**Horizontal Pod Autoscaler (HPA):** Tự động tăng/giảm replicas dựa trên CPU/memory.

---

## 💬 Câu trả lời mẫu 60 giây

**Câu: Pod vs Deployment?**
> "Pod là instance nhỏ nhất. Deployment quản lý nhiều Pod replica, hỗ trợ rolling update và rollback. Không tạo Pod trực tiếp, luôn qua Deployment."

**Câu: Service dùng để gì?**
> "Pod trong K8s có IP tạm thời, có thể restart → đổi IP. Service cung cấp IP/DNS ổn định và load balance traffic đến Pod."

**Câu: Liveness vs Readiness probe?**
> "Liveness kiểm tra container còn sống không — nếu fail thì restart. Readiness kiểm tra container sẵn sàng nhận traffic — nếu fail thì remove khỏi Service."

---

## ✅ CHECKLIST PHẦN 24`,checklist:[`Giải thích Pod, Deployment, Service, Ingress.`,`Viết Deployment YAML cơ bản.`,`Cấu hình Service và Ingress.`,`Cấu hình Spring Boot trên K8s.`,`Dùng Helm triển khai.`,`Biết các lệnh kubectl cơ bản.`,`Giải thích HPA auto-scaling.`,`Phân biệt liveness vs readiness probe.`]},{file:`Phan25_TestingAdvanced_CheatSheet.md`,title:`📄 PHẦN 25 — TESTING ADVANCED`,content:`---

## 1. TDD (Test-Driven Development)

**Red → Green → Refactor**

1. Viết test trước (đỏ)
2. Viết code tối thiểu để pass (xanh)
3. Refactor code

---

## 2. Unit Test với JUnit 5

\`\`\`java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    @DisplayName("Should calculate total price correctly")
    void testCalculateTotal() {
        // Arrange
        Order order = new Order();
        order.addItem(new Item("Product A", BigDecimal.TEN));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act
        BigDecimal result = orderService.calculateTotal(1L);

        // Assert
        assertEquals(new BigDecimal("10.0"), result);
        verify(orderRepository).findById(1L);
    }
}
\`\`\`

**Annotations:** \`@Test\`, \`@ParameterizedTest\`, \`@DisplayName\`, \`@Nested\`, \`@Tag\`.

---

## 3. Mockito — Mocking & Stubbing

\`\`\`java
// Stub
when(repo.findById(1L)).thenReturn(Optional.of(user));
when(repo.save(any())).thenThrow(new DataIntegrityViolationException("..."));
doNothing().when(emailService).send(anyString());

// Verify
verify(repo, times(1)).save(any());
verify(repo, never()).delete(any());
verify(repo, timeout(100).times(1)).findById(1L);

// Argument matchers
any(), anyString(), anyLong(), eq("value"), argThat(arg -> arg > 0)

// Spy (partial mock)
@Spy
List<String> list = new ArrayList<>();
doReturn(100).when(list).size(); // override size()
\`\`\`

---

## 4. Spring Boot Test — Slice Test

\`\`\`java
@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Test
    void shouldReturn200() throws Exception {
        when(orderService.findById(1L))
            .thenReturn(new OrderDto(1L, "Product", BigDecimal.TEN));

        mockMvc.perform(get("/api/orders/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Product"))
            .andExpect(jsonPath("$.price").value(10.0));
    }
}
\`\`\`

| Annotation | Test tầng |
|---|---|
| \`@WebMvcTest\` | Controller |
| \`@DataJpaTest\` | Repository |
| \`@JsonTest\` | JSON serialize |
| \`@RestClientTest\` | REST client |

---

## 5. Integration Test với Testcontainers

\`\`\`java
@Testcontainers
@SpringBootTest
class OrderRepositoryIntegrationTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8")
        .withDatabaseName("testdb");

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry reg) {
        reg.add("spring.datasource.url", mysql::getJdbcUrl);
        reg.add("spring.datasource.username", mysql::getUsername);
        reg.add("spring.datasource.password", mysql::getPassword);
    }

    @Autowired
    private OrderRepository repository;

    @Test
    void shouldSaveAndFindOrder() {
        Order order = new Order("Test");
        repository.save(order);
        assertThat(repository.findByName("Test")).isPresent();
    }
}
\`\`\`

---

## 6. Contract Test với Spring Cloud Contract

Đảm bảo API contract giữa producer và consumer.

\`\`\`groovy
// contracts/shouldReturnProduct.groovy
Contract.make {
    description "should return product by ID"
    request {
        method GET()
        url "/api/products/1"
    }
    response {
        status 200
        headers {
            contentType applicationJson()
        }
        body([
            id: 1,
            name: "Product",
            price: 100.00
        ])
    }
}
\`\`\`

---

## 7. Performance Test

\`\`\`java
@BenchmarkMode(Mode.Throughput)
@Measurement(iterations = 5, time = 1)
@Threads(4)
@Fork(1)
public class OrderServiceBenchmark {

    @Benchmark
    public void testFindAll(Blackhole hole) {
        hole.consume(orderService.findAll());
    }
}
\`\`\`

**JMH** (Java Microbenchmark Harness) — đảm bảo đo đúng, không bị JVM warmup ảnh hưởng.

---

## 8. Mutation Testing với PITest

Kiểm tra chất lượng test bằng cách đột biến code.

\`\`\`xml
<plugin>
    <groupId>org.pitest</groupId>
    <artifactId>pitest-maven</artifactId>
    <configuration>
        <targetClasses>
            <param>com.myapp.service.*</param>
        </targetClasses>
        <targetTests>
            <param>com.myapp.service.*</param>
        </targetTests>
    </configuration>
</plugin>
\`\`\`

Mục tiêu: **> 80% mutation coverage**.

---

## 💬 Câu trả lời mẫu 60 giây

**Câu: @Mock vs @InjectMocks?**
> "@Mock tạo mock object. @InjectMocks tạo instance thật và inject các mock vào field tương ứng (constructor, setter, field)."

**Câu: Spring Boot slice test là gì?**
> "Chỉ load các bean cần thiết cho tầng đó. @WebMvcTest chỉ load Controller, không load Service thật (dùng @MockBean). Giúp test nhanh hơn integration test."

---

## ✅ CHECKLIST PHẦN 25`,checklist:[`Giải thích TDD: Red → Green → Refactor.`,`Viết Unit Test với JUnit 5 + Mockito.`,`Dùng @WebMvcTest cho Controller.`,`Dùng Testcontainers cho Integration Test.`,`Biết Contract Test với Spring Cloud Contract.`,`Biết Performance Test với JMH.`,`Biết Mutation Testing với PITest.`,`Phân biệt @Mock, @MockBean, @InjectMocks.`]},{file:`Phan26_Performance_CheatSheet.md`,title:`📄 PHẦN 26 — PERFORMANCE OPTIMIZATION & TROUBLESHOOTING`,content:`---

## 1. JVM Memory Model

\`\`\`
Heap                            Metaspace
├── Young Gen                   Class metadata
│   ├── Eden                   (không giới hạn mặc định)
│   └── Survivor (S0, S1)
├── Old Gen (Tenured)
└── (từ Java 8+ không có PermGen)
\`\`\`

**JVM flags:**
\`\`\`bash
-Xms512m -Xmx2g                    # Initial / Max heap
-XX:MetaspaceSize=256m              # Metaspace
-XX:+UseG1GC                        # G1GC (mặc định từ Java 9)
-XX:+PrintGCDetails                 # Log GC
-XX:+HeapDumpOnOutOfMemoryError     # Auto dump heap khi OOM
\`\`\`

---

## 2. Garbage Collection Algorithms

| GC | Mô tả | Khi nào dùng |
|---|---|---|
| **Serial** | 1 thread, stop-the-world | App nhỏ, single-core |
| **Parallel** | Nhiều thread, throughput cao | Batch processing, high throughput |
| **G1GC** | Region-based, pause time predictable | Mặc định Java 9+, ứng dụng lớn |
| **ZGC** | Low-latency < 10ms | Hệ thống real-time, heap lớn > 100GB |
| **Shenandoah** | Concurrent compaction | Latency-sensitive |

---

## 3. Profiling & Monitoring

**Công cụ:**
- **JProfiler / YourKit** — trả phí, mạnh nhất
- **VisualVM** — free, đủ dùng
- **Async Profiler** — low overhead sampling
- **JDK Mission Control (JMC)** — flight recorder, free từ Oracle

**Cách profile:**
\`\`\`bash
# CPU sampling
async-profiler -e cpu -d 30 -o flamegraph output.svg <pid>

# Heap dump
jmap -dump:format=b,file=heap.hprof <pid>

# GC log analysis
gceasy.io (upload GC log)
\`\`\`

---

## 4. Database Performance

| Vấn đề | Giải pháp |
|---|---|
| Query chậm | \`EXPLAIN\`, tạo index, dùng covering index |
| N+1 query | \`JOIN FETCH\`, \`@EntityGraph\`, batch fetching |
| Connection pool full | Tuning HikariCP: \`maximumPoolSize\`, \`connectionTimeout\` |
| Deadlock | Đảm bảo thứ tự lock, transaction ngắn |
| Slow bulk insert | \`hibernate.jdbc.batch_size\`, rewriteBatchedStatements |

**HikariCP config:**
\`\`\`yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000
      max-lifetime: 1200000
\`\`\`

---

## 5. Caching Strategy

\`\`\`java
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("products", "users");
    }
}

@Service
public class ProductService {
    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) { ... }

    @CacheEvict(value = "products", key = "#product.id")
    public Product update(Product product) { ... }

    @CachePut(value = "products", key = "#result.id")
    public Product create(Product product) { ... }
}
\`\`\`

**Redis Cache:**
\`\`\`yaml
spring:
  cache:
    type: redis
  redis:
    host: localhost
    port: 6379
\`\`\`

**Cache Aside Pattern:** App đọc cache trước, miss thì đọc DB + ghi cache.

---

## 6. Connection Pool Tuning

| Pool | Max | Ideal |
|---|---|---|
| HikariCP (DB) | 20-50 | 2-4 core × 2 |
| Tomcat (HTTP) | 200 | Tùy traffic |
| Kafka Consumer | Số partition | 1 thread / partition max |

**Công thức:** \`PoolSize = Tp * (C - Cm)\` với \`Tp = max threads in parallel\`, \`C = core count\`.

---

## 7. Common Performance Issues

| Triệu chứng | Nguyên nhân | Cách fix |
|---|---|---|
| High CPU | Infinite loop, GC storm | Heap dump + thread dump |
| High Memory | Memory leak, large objects | Heap dump → MAT (Eclipse Memory Analyzer) |
| Slow response | DB query chậm, external API slow | Trace, index, cache, timeout |
| Thread stuck | Deadlock, connection pool full | Thread dump, increase pool |
| Disk I/O high | Logging quá nhiều | Log level, async appender |

**Thread dump command:**
\`\`\`bash
jstack <pid> > threaddump.txt
# Hoặc kill -3 <pid> (Unix)
\`\`\`

---

## 8. Spring Boot Performance Tuning

\`\`\`yaml
# application.yaml
server:
  tomcat:
    max-threads: 200
    max-connections: 10000
    accept-count: 100
    connection-timeout: 5000

spring:
  jpa:
    properties:
      hibernate:
        jdbc.batch_size: 30
        order_inserts: true
        order_updates: true
        generate_statistics: true  # chỉ dùng dev
\`\`\`

---

## 💬 Câu trả lời mẫu 60 giây

**Câu: Ứng dụng chạy chậm, bạn làm gì?**
> "1) Kiểm tra monitoring/metric (CPU, memory, GC, DB). 2) Xác định bottleneck: dùng profiler. 3) Nếu DB chậm → check query, index. 4) Nếu code → optimize, cache. 5) Verify sau fix."

**Câu: Memory leak trong Java?**
> "Object không được GC vì vẫn còn reference. Dùng heap dump + Eclipse MAT để tìm object chiếm nhiều memory. Nguyên nhân thường: không đóng resource, static collection, ThreadLocal, listener không unregister."

**Câu: G1GC hoạt động thế nào?**
> "G1 chia heap thành các region. Concurrent marking để tìm garbage. Ưu tiên thu thập region chứa nhiều garbage nhất (garbage-first). Mục tiêu đạt pause time target (mặc định 200ms)."

---

## ✅ CHECKLIST PHẦN 26`,checklist:[`Giải thích JVM Memory Model.`,`Phân biệt các GC algorithms.`,`Dùng profiler để tìm bottleneck.`,`Fix N+1 query, tối ưu index.`,`Cấu hình caching (@Cacheable, Redis).`,`Tuning connection pool.`,`Đọc và phân tích thread dump.`,`Đọc và phân tích heap dump.`,`Tuning Spring Boot application.`]}];var p=window.interviewTopics,m={};async function h(e,t){return t?await window.progressDB.markCompleted(e,`interview`,`checklist`,{title:e}):await window.progressDB.uncomplete(e,`checklist`),m[e]=t,m}function g(e){return e||window.interviewTopics||[]}function _(e){return g()[e]||null}function v(){return m}function y(e){let t=g(e),n=0,r=0;return t.forEach(e=>{e.checklist&&e.checklist.forEach(e=>{n++,m[e]&&r++})}),{done:r,total:n,percent:n>0?Math.round(r/n*100):0}}function b(e){let t=e.checklist?e.checklist.length:0;return{done:e.checklist?e.checklist.filter(e=>m[e]).length:0,total:t}}var x=[{label:`📘 Java Core`,indices:[1,2,3,4,5]},{label:`🗄️ Database & Spring`,indices:[6,7,8,9,10,11,12]},{label:`☁️ DevOps & Architecture`,indices:[13,14,15,16,17,18]},{label:`📝 Practice & Testing`,indices:[19,20,21,22,23,24,25,26,27]}];function S(e){return e.replace(/^📄 /,``).replace(/^Phần (\d+) — /i,`$1 — `)}var C={name:`InterviewPage`,data(){return{currentIndex:0,collapsedGroups:Object.fromEntries(x.map(e=>[e.label,!0])),GROUPS:x}},computed:{topics(){return g(p)},currentTopic(){return _(this.currentIndex)},renderedContent(){if(!this.currentTopic)return``;let e=``;if(this.currentTopic.content&&(e+=f(this.currentTopic.content)),this.currentTopic.checklist&&this.currentTopic.checklist.length>0){e+=`<h3>📝 Checklist kiến thức cần nhớ</h3>`;let t=v();this.currentTopic.checklist.forEach(n=>{let r=!!t[n];e+=`
            <label class="checklist-item ${r?`checked`:``}">
              <input type="checkbox" ${r?`checked`:``} data-item="${n.replace(/"/g,`&quot;`)}">
              <span>${n}</span>
            </label>
          `})}return e},progress(){return y(p)}},mounted(){this.$nextTick(()=>{this.bindChecklistEvents()})},updated(){this.$nextTick(()=>{this.bindChecklistEvents()})},methods:{shortTitle:S,goHome(){d(`/`)},selectTopic(e){this.currentIndex=e,this.scrollToTop()},scrollToTop(){let e=this.$refs.cardRef;e&&e.scrollIntoView({block:`start`})},toggleGroup(e){let t=!!this.collapsedGroups[e.label];if(this.collapsedGroups[e.label]=!t,t){let t=e.indices[0];t!==void 0&&this.selectTopic(t)}},getTopic(e){return this.topics[e]||null},getTopicStatus(e){let t=this.getTopic(e);if(!t)return`0/0`;let{done:n,total:r}=b(t);return`${n}/${r}`},bindChecklistEvents(){let e=this.$refs.cardRef;e&&(e.querySelectorAll(`.checklist-item input`).forEach(e=>{e.__vue__||(e.__vue__=!0,e.addEventListener(`change`,()=>{let t=e.dataset.item,n=e.checked;h(t,n),e.closest(`.checklist-item`).classList.toggle(`checked`,n),this.$forceUpdate(),this.scrollToTop()}))}),e.querySelectorAll(`.topic-link`).forEach(e=>{e.__vue__||(e.__vue__=!0,e.addEventListener(`click`,t=>{t.preventDefault();let n=e.dataset.topicFile,r=this.topics.findIndex(e=>e.file===n);r>=0&&this.selectTopic(r)}))}))}}},w={class:`interview-page`},T={class:`interview-container`},E={class:`interview-topbar`},D={class:`topbar-actions`},O={class:`interview-layout`},k={class:`interview-sidebar`},A={class:`topic-list`},j=[`onClick`],M={class:`toggle-icon`},N=[`onClick`],P={class:`topic-status`},F={class:`progress-bar-wrap`},I={class:`progress-text`},L={class:`progress-track`},R={class:`interview-card`,ref:`cardRef`},z={class:`topic-title`},B=[`innerHTML`];function V(s,d,f,p,m,h){return i(),a(`div`,w,[c(`div`,T,[c(`header`,E,[d[2]||=c(`h1`,null,`☕ Java Backend Interview`,-1),c(`div`,D,[c(`button`,{class:`back-btn`,onClick:d[0]||=(...e)=>h.goHome&&h.goHome(...e)},`⬅ Quay lại Trang chủ`)])]),c(`div`,O,[c(`aside`,k,[d[3]||=c(`h3`,null,`📑 Chủ đề`,-1),c(`ul`,A,[c(`li`,{class:t([`topic-item intro-item`,{active:m.currentIndex===0}]),onClick:d[1]||=e=>h.selectTopic(0)},`📋 Tổng quan`,2),(i(!0),a(l,null,e(m.GROUPS,n=>(i(),a(l,{key:n.label},[c(`li`,{class:t([`topic-item group-header`,{collapsed:m.collapsedGroups[n.label]}]),onClick:e=>h.toggleGroup(n)},[c(`span`,M,r(m.collapsedGroups[n.label]?`▶`:`▼`),1),u(` `+r(n.label),1)],10,j),m.collapsedGroups[n.label]?o(``,!0):(i(!0),a(l,{key:0},e(n.indices,e=>(i(),a(`li`,{key:e,class:t([`topic-item group-item`,{active:m.currentIndex===e}]),onClick:t=>h.selectTopic(e)},[c(`span`,null,r(h.shortTitle(h.getTopic(e)?.title||``)),1),c(`span`,P,r(h.getTopicStatus(e)),1)],10,N))),128))],64))),128))]),c(`div`,F,[c(`div`,I,r(h.progress.done)+` / `+r(h.progress.total),1),c(`div`,L,[c(`div`,{class:`progress-fill`,style:n({width:h.progress.percent+`%`})},null,4)])])]),c(`main`,R,[c(`h2`,z,r(h.currentTopic?.title||``),1),c(`div`,{class:`topic-body`,innerHTML:h.renderedContent},null,8,B)],512)])])])}var H=s(C,[[`render`,V],[`__scopeId`,`data-v-869e75c4`]]);export{H as default};