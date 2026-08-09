import{C as e,M as t,N as n,S as r,g as i,h as a,j as o,n as s,p as c,u as l,v as u}from"./index-Cp2Sqq2y.js";import{t as d}from"./navigate-CcK9ConP.js";import{t as f}from"./markdown-RpJYUkAQ.js";window.interviewTopics=[{file:`README.md`,title:`📄 📚 Java Backend Interview Master Guide — Cheat Sheets`,content:`# 📚 Java Backend Interview Master Guide — Cheat Sheets\r
\r
Tổng hợp 20 cheat sheet (mỗi phần ~1 trang A4) để ôn tập Java Backend Interview.\r
\r
## 📑 Danh sách phần\r
\r
1. [Phần 1 — Java Core](./Phan1_Java_Core_CheatSheet.md)\r
2. [Phần 2 — Collections](./Phan2_Collections_CheatSheet.md)\r
3. [Phần 3 — Exception](./Phan3_Exception_CheatSheet.md)\r
4. [Phần 4 — Java 8+](./Phan4_Java8_CheatSheet.md)\r
5. [Phần 5 — Multithreading](./Phan5_Multithreading_CheatSheet.md)\r
6. [Phần 6 — SQL & Database](./Phan6_SQL_Database_CheatSheet.md)\r
7. [Phần 7 — Spring Boot](./Phan7_SpringBoot_CheatSheet.md)\r
8. [Phần 8 — REST API](./Phan8_REST_API_CheatSheet.md)\r
9. [Phần 9 — DTO & Validation](./Phan9_DTO_Validation_CheatSheet.md)\r
10. [Phần 10 — JPA/Hibernate](./Phan10_JPA_Hibernate_CheatSheet.md)\r
11. [Phần 11 — Transaction](./Phan11_Transaction_CheatSheet.md)\r
12. [Phần 12 — Security & JWT](./Phan12_Security_JWT_CheatSheet.md)\r
13. [Phần 13 — Docker](./Phan13_Docker_CheatSheet.md)\r
14. [Phần 14 — Kafka](./Phan14_Kafka_CheatSheet.md)\r
15. [Phần 15 — AWS](./Phan15_AWS_CheatSheet.md)\r
16. [Phần 16 — CI/CD](./Phan16_CICD_CheatSheet.md)\r
17. [Phần 17 — Microservices](./Phan17_Microservices_CheatSheet.md)\r
18. [Phần 18 — System Design](./Phan18_SystemDesign_CheatSheet.md)\r
19. [Phần 19 — Project Mẫu](./Phan19_Project_Mau_CheatSheet.md)\r
20. [Phần 20 — Câu Hỏi Tình Huống](./Phan20_Cau_Hoi_Tinh_Huong_CheatSheet.md)\r
21. [Phần 21 — 100+ Câu Hỏi Tự Kiểm Tra](./Phan21_100_Cau_Hoi_Tu_Kiem_Tra.md)\r
22. [Phần 21 — Đáp án chi tiết](./Phan21_100_Cau_Hoi_Tu_Kiem_Tra_Tra_Loi.md)\r
\r
## 🎯 Cách dùng\r
\r
- Mỗi file là một chủ đề riêng, đủ để in ra 1 trang A4.\r
- Mỗi phần có code mẫu, câu trả lởi 60 giây và checklist tự kiểm tra.\r
- Đi qua từng phần, đánh dấu checklist khi đã nắm chắc.\r
\r
## ✅ Lộ trình ôn tập đề xuất\r
\r
**Tuần 1:** Java Core → Collections → Exception → Java 8+ → Multithreading\r
**Tuần 2:** SQL & Database → Spring Boot → REST API → DTO & Validation → JPA/Hibernate\r
**Tuần 3:** Transaction → Security & JWT → Docker → Kafka → AWS\r
**Tuần 4:** CI/CD → Microservices → System Design → Project → Câu hỏi tình huống → 100+ câu hỏi tự kiểm tra → đối chiếu đáp án\r
\r
Chúc bạn thi phỏng vấn thành công! 🚀`,checklist:[]},{file:`Phan1_Java_Core_CheatSheet.md`,title:`📄 📄 PHẦN 1 — JAVA CORE`,content:`# 📄 PHẦN 1 — JAVA CORE \r
\r
---\r
\r
## 1. JDK / JRE / JVM\r
\r
| Thành phần | Chức năng |\r
|---|---|\r
| **JVM** | Môi trường thực thi bytecode (.class). Dịch bytecode thành machine code của OS. Java portable nhờ JVM. |\r
| **JRE** | = JVM + thư viện runtime cần thiết để chạy app. |\r
| **JDK** | = JRE + công cụ phát triển (javac, debugger, jar...). |\r
\r
**Flow:** \`Java Source (.java)\` → \`javac\` → \`Bytecode (.class)\` → \`JVM\` → \`Machine Code / OS\`\r
\r
---\r
\r
## 2. Primitive vs Reference\r
\r
| Primitive | Reference |\r
|---|---|\r
| Lưu giá trị trực tiếp: \`int\`, \`long\`, \`boolean\`, \`double\`, \`char\`, \`byte\`, \`short\`, \`float\` | Lưu địa chỉ tham chiếu đến object: \`String\`, \`User\`, \`List\`, \`Object\` |\r
| Nằm trên Stack | Reference trên Stack, object thực tế nằm trên Heap |\r
\r
**Stack:** chứa call stack, local variables, references trong method scope.  \r
**Heap:** chứa object, được quản lý bởi Garbage Collector.\r
\r
---\r
\r
## 3. Pass by Value\r
\r
Java **luôn pass by value**.\r
\r
- Primitive: truyền bản sao giá trị.\r
- Object: truyền bản sao của reference → có thể thay đổi **state** object bên trong method, nhưng **không thay đổi reference** của biến bên ngoài.\r
\r
\`\`\`java\r
void change(User u) { u.setName("A"); }      // ✅ state thay đổi\r
void swap(User a, User b) { User tmp = a; a = b; b = tmp; } // ❌ không swap được\r
\`\`\`\r
\r
---\r
\r
## 4. \`==\` vs \`equals()\`\r
\r
| \`==\` | \`equals()\` |\r
|---|---|\r
| Primitive: so sánh giá trị | Object: so sánh nội dung (nếu override) |\r
| Object: so sánh reference | Mặc định của Object giống \`==\` |\r
\r
**String immutable** vì:\r
- Hỗ trợ **String Pool** (tiết kiệm bộ nhớ).\r
- **Thread-safe** không cần đồng bộ.\r
- \`hashCode()\` ổn định → dùng làm key trong HashMap an toàn.\r
\r
> Nối chuỗi bằng \`+\` tạo object mới. Dùng \`StringBuilder\` (không thread-safe, nhanh) hoặc \`StringBuffer\` (thread-safe, chậm hơn) khi cần nối nhiều.\r
\r
---\r
\r
## 5. \`equals()\` và \`hashCode()\`\r
\r
**Quy tắc:**\r
- Nếu \`a.equals(b) == true\` → \`a.hashCode() == b.hashCode()\` (bắt buộc).\r
- Ngược lại không nhất thiết.\r
\r
**Tại sao phải đi cùng nhau?**\r
- \`HashMap\`/\`HashSet\` dùng \`hashCode()\` để tìm bucket.\r
- Sau đó dùng \`equals()\` để xác nhận key đúng trong bucket.\r
- Override \`equals()\` mà quên \`hashCode()\` → object bị tìm/sắp xếp sai trong HashMap/HashSet.\r
\r
---\r
\r
## 6. OOP — 4 tính chất\r
\r
| Tính chất | Ý nghĩa | Ví dụ thực tế |\r
|---|---|---|\r
| **Encapsulation** | Che giấu trạng thái, truy cập qua getter/setter | \`private balance\`, \`public getBalance()\` |\r
| **Inheritance** | Class con kế thừa thuộc tính/phương thức class cha | \`class Dog extends Animal\` |\r
| **Polymorphism** | Cùng method call, hành vi khác nhau | \`Animal a = new Dog(); a.speak();\` |\r
| **Abstraction** | Ẩn chi tiết, chỉ hiển thị chức năng cần thiết | \`interface PaymentService\` |\r
\r
---\r
\r
## 7. Overloading vs Overriding\r
\r
| Overloading | Overriding |\r
|---|---|\r
| Cùng tên method, **khác tham số** | Class con định nghĩa lại method của cha |\r
| **Compile-time** polymorphism | **Runtime** polymorphism |\r
| Cùng class | Khác class (is-a) |\r
\r
---\r
\r
## 8. Interface vs Abstract Class\r
\r
| Interface | Abstract Class |\r
|---|---|\r
| Định nghĩa **contract / capability** | Dùng khi có quan hệ **is-a** và chia sẻ state/behavior |\r
| Một class implement **nhiều interface** | Một class chỉ **extends 1 abstract class** |\r
| Java 8+: có default/static methods | Có constructor, instance variables |\r
\r
---\r
\r
## 9. Composition vs Inheritance\r
\r
- **Inheritance:** is-a. Dễ bị tightly coupled với class cha.\r
- **Composition:** has-a. Linh hoạt hơn, giảm coupling.\r
\r
> Ưu tiên **Composition over Inheritance** khi có thể.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Java pass by value hay pass by reference?**\r
> "Java luôn pass by value. Với object, giá trị truyền vào là bản sao của reference. Nên nếu trong method mình thay đổi state của object thì bên ngoài sẽ thấy, nhưng nếu gán lại object mới cho tham số thì reference bên ngoài không đổi."\r
\r
**Câu: equals và hashCode tại sao phải đi cùng nhau?**\r
> "Vì HashMap dùng hashCode để xác định bucket, rồi dùng equals để kiểm tra key thực sự. Nếu hai object equals bằng nhau mà hashCode khác, HashMap sẽ tìm sai bucket và coi như khác nhau. Nên quy tắc là: equals true thì hashCode phải bằng nhau."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 1\r
\r
- [ ] Giải thích JDK / JRE / JVM và flow compile-run.\r
- [ ] Phân biệt Primitive vs Reference, Stack vs Heap.\r
- [ ] Giải thích pass by value với object.\r
- [ ] Phân biệt \`==\` vs \`equals()\`.\r
- [ ] Giải thích String immutable và String Pool.\r
- [ ] Giải thích quan hệ \`equals()\` / \`hashCode()\`.\r
- [ ] Nêu 4 tính chất OOP + ví dụ.\r
- [ ] Phân biệt Overloading / Overriding.\r
- [ ] Phân biệt Interface / Abstract Class.\r
- [ ] Giải thích Composition vs Inheritance.`,checklist:[`Giải thích JDK / JRE / JVM và flow compile-run.`,`Phân biệt Primitive vs Reference, Stack vs Heap.`,`Giải thích pass by value với object.`,"Phân biệt `==` vs `equals()`.",`Giải thích String immutable và String Pool.`,"Giải thích quan hệ `equals()` / `hashCode()`.",`Nêu 4 tính chất OOP + ví dụ.`,`Phân biệt Overloading / Overriding.`,`Phân biệt Interface / Abstract Class.`,`Giải thích Composition vs Inheritance.`]},{file:`Phan2_Collections_CheatSheet.md`,title:`📄 📄 PHẦN 2 — COLLECTIONS`,content:`# 📄 PHẦN 2 — COLLECTIONS \r
\r
---\r
\r
## 1. ArrayList vs LinkedList\r
\r
| | **ArrayList** | **LinkedList** |\r
|---|---|---|\r
| **Cấu trúc** | Dynamic array | Doubly linked list |\r
| **Truy cập index** | O(1) | O(n) |\r
| **Thêm/xóa cuối** | O(1) amortized, resize O(n) | O(1) nếu có node |\r
| **Thêm/xóa giữa** | O(n) vì phải dịch | O(1) nếu đã có node (còn tìm node O(n)) |\r
| **Bộ nhớ** | Ít overhead hơn | Nhiều overhead vì node, next, prev |\r
\r
**Ví dụ:**\r
\`\`\`java\r
List<String> a = new ArrayList<>();    // random access nhiều\r
List<String> b = new LinkedList<>();   // chèn/xóa đầu/cuối liên tục\r
\`\`\`\r
\r
---\r
\r
## 2. HashSet vs TreeSet\r
\r
| | **HashSet** | **TreeSet** |\r
|---|---|---|\r
| **Thứ tự** | Không đảm bảo | Sắp xếp tự nhiên |\r
| **Tốc độ** | O(1) trung bình | O(log n) |\r
| **Dựa trên** | HashMap | Red-Black Tree |\r
| **Null** | Cho phép 1 null | Không cho null |\r
\r
**Ví dụ:**\r
\`\`\`java\r
Set<String> h = new HashSet<>();    // unique, không cần thứ tự\r
Set<String> t = new TreeSet<>();   // unique, sắp xếp tự nhiên\r
\`\`\`\r
\r
---\r
\r
## 3. HashMap hoạt động thế nào?\r
\r
1. Tính \`hashCode()\` của key.\r
2. Xác định **bucket index** bằng \`(n - 1) & hash\`.\r
3. Nếu bucket trống → lưu entry.\r
4. Nếu bucket có dữ liệu → dùng \`equals()\` để tìm key đúng (xử lý collision).\r
\r
**Ví dụ:**\r
\`\`\`java\r
Map<String, Integer> map = new HashMap<>();\r
map.put("apple", 100);   // hash("apple") → bucket\r
map.get("apple");        // hash → bucket → equals\r
\`\`\`\r
\r
---\r
\r
## 4. Collision trong HashMap\r
\r
Collision xảy ra khi 2 key khác nhau có hash trùng bucket.\r
\r
- **Java 8 trước:** Linked List.\r
- **Java 8+:** Linked List, nếu ≥ 8 entries thì chuyển sang **Red-Black Tree** (nếu key implement Comparable).\r
\r
**Ví dụ:**\r
\`\`\`java\r
Map<String, Integer> map = new HashMap<>();\r
// Nhiều key khác nhau nhưng hashCode trùng bucket\r
// HashMap tự chuyển sang Tree ở bucket đó để tìm kiếm nhanh hơn\r
\`\`\`\r
\r
---\r
\r
## 5. HashMap có thread-safe không?\r
\r
**Không.** Nếu nhiều thread đọc/ghi cùng lúc có thể mất dữ liệu hoặc treo vòng lặp vô hạn.\r
\r
**Giải pháp:**\r
- \`Collections.synchronizedMap(new HashMap<>())\` — khóa toàn bộ map.\r
- \`ConcurrentHashMap\` — khóa theo segment/bucket, hiệu quả hơn.\r
- \`Hashtable\` — legacy, không nên dùng.\r
\r
**Ví dụ:**\r
\`\`\`java\r
Map<String, Integer> safeMap = new ConcurrentHashMap<>();\r
\`\`\`\r
\r
---\r
\r
## 6. ConcurrentHashMap\r
\r
- **Thread-safe** mà không khóa toàn bộ map.\r
- Java 7: khóa **segment**.\r
- Java 8+: khóa **bucket node** bằng synchronized hoặc CAS.\r
- Phù hợp đa luồng, throughput cao.\r
\r
---\r
\r
## 7. Comparable vs Comparator\r
\r
| | **Comparable** | **Comparator** |\r
|---|---|---|\r
| **Định nghĩa** | Trong class cần sort | Bên ngoài class |\r
| **Method** | \`int compareTo(T o)\` | \`int compare(T o1, T o2)\` |\r
| **Số chiến lược** | 1 natural order | Nhiều comparator |\r
| **Class implement** | \`class User implements Comparable<User>\` | Không cần implement |\r
\r
**Ví dụ:**\r
\`\`\`java\r
// Comparable\r
class User implements Comparable<User> {\r
    public int compareTo(User other) { return this.age - other.age; }\r
}\r
\r
// Comparator\r
Comparator<User> byName = Comparator.comparing(u -> u.name);\r
List<User> users = new ArrayList<>();\r
users.sort(byName);\r
\`\`\`\r
\r
---\r
\r
## 8. \`HashMap\` resize\r
\r
- **Load factor** mặc định = 0.75.\r
- Khi số entry > \`capacity * load factor\` → capacity **gấp đôi** và **rehash** toàn bộ entry.\r
- Resize tốn chi phí nên nên ước lượng initial capacity nếu biết trước kích thước.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: HashMap hoạt động thế nào?**\r
> "HashMap lưu dữ liệu theo bucket. Khi put(key, value), nó tính hashCode của key để xác định bucket. Nếu bucket trống thì lưu trực tiếp. Nếu có nhiều key rơi vào cùng bucket (collision), HashMap dùng equals để tìm đúng key. Java 8 trở đi, nếu số phần tử trong bucket ≥ 8 thì chuyển sang Tree để tìm kiếm nhanh hơn."\r
\r
**Câu: HashMap có thread-safe không?**\r
> "Không. Để dùng đa luồng, nên dùng ConcurrentHashMap. Nó khóa theo bucket nên hiệu năng tốt hơn nhiều so với Collections.synchronizedMap."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 2\r
\r
- [ ] Phân biệt ArrayList vs LinkedList.\r
- [ ] Phân biệt HashSet vs TreeSet.\r
- [ ] Giải thích HashMap hoạt động (hash → bucket → equals).\r
- [ ] Giải thích collision và cách xử lý.\r
- [ ] Giải thích HashMap không thread-safe và ConcurrentHashMap.\r
- [ ] Phân biệt Comparable vs Comparator.\r
- [ ] Nói được load factor, resize, rehash.`,checklist:[`Phân biệt ArrayList vs LinkedList.`,`Phân biệt HashSet vs TreeSet.`,`Giải thích HashMap hoạt động (hash → bucket → equals).`,`Giải thích collision và cách xử lý.`,`Giải thích HashMap không thread-safe và ConcurrentHashMap.`,`Phân biệt Comparable vs Comparator.`,`Nói được load factor, resize, rehash.`]},{file:`Phan3_Exception_CheatSheet.md`,title:`📄 📄 PHẦN 3 — EXCEPTION`,content:`# 📄 PHẦN 3 — EXCEPTION \r
\r
---\r
\r
## 1. Exception Hierarchy\r
\r
\`\`\`\r
Throwable\r
├── Error                    (Không nên catch: OutOfMemoryError, StackOverflowError)\r
└── Exception\r
    ├── Checked Exception    (Compiler bắt buộc xử lý: IOException, SQLException)\r
    └── RuntimeException     (Unchecked: NullPointerException, IllegalArgumentException)\r
\`\`\`\r
\r
---\r
\r
## 2. Checked vs Unchecked Exception\r
\r
| | **Checked Exception** | **Unchecked Exception** |\r
|---|---|---|\r
| **Kế thừa** | \`Exception\` (trừ RuntimeException) | \`RuntimeException\` |\r
| **Compiler kiểm tra** | Có | Không |\r
| **Xử lý** | Bắt buộc \`try-catch\` hoặc \`throws\` | Không bắt buộc |\r
| **Ví dụ** | \`IOException\`, \`SQLException\`, \`FileNotFoundException\` | \`NullPointerException\`, \`IndexOutOfBoundsException\` |\r
| **Ý nghĩa** | Lỗi ngoại viên, không kiểm soát hoàn toàn | Lỗi logic, dữ liệu không hợp lệ |\r
\r
**Ví dụ:**\r
\`\`\`java\r
// Checked\r
public void readFile() throws IOException { ... }\r
\r
// Unchecked\r
int x = nullValue.length(); // NullPointerException\r
\`\`\`\r
\r
---\r
\r
## 3. \`throw\` vs \`throws\`\r
\r
| \`throw\` | \`throws\` |\r
|---|---|\r
| Ném một exception cụ thể tại dòng code | Khai báo method có thể ném exception |\r
| Dùng bên trong method | Dùng trong khai báo method |\r
\r
**Ví dụ:**\r
\`\`\`java\r
public void withdraw(double amount) throws InsufficientBalanceException {\r
    if (balance < amount) {\r
        throw new InsufficientBalanceException("Not enough money");\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 4. \`try-catch-finally\`\r
\r
\`\`\`java\r
try {\r
    // code có thể lỗi\r
} catch (SpecificException e) {\r
    // xử lý cụ thể\r
} finally {\r
    // luôn chạy, dùng để đóng resource\r
}\r
\`\`\`\r
\r
**Ví dụ try-with-resources (Java 7+):**\r
\`\`\`java\r
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {\r
    return br.readLine();\r
} // auto close\r
\`\`\`\r
\r
---\r
\r
## 5. Custom Exception\r
\r
Tạo exception riêng cho lỗi business, giúp code rõ ràng và dễ xử lý.\r
\r
**Ví dụ:**\r
\`\`\`java\r
public class UserNotFoundException extends RuntimeException {\r
    public UserNotFoundException(String message) {\r
        super(message);\r
    }\r
}\r
\r
// Sử dụng\r
public User findById(Long id) {\r
    return repo.findById(id)\r
        .orElseThrow(() -> new UserNotFoundException("User not found: " + id));\r
}\r
\`\`\`\r
\r
---\r
\r
## 6. Có nên catch \`Exception\` chung?\r
\r
**Không nên** nếu không có cách xử lý rõ ràng.\r
\r
- Làm khó debug.\r
- Có thể nuốt lỗi nghiêm trọng.\r
- Nên catch exception cụ thể.\r
\r
**Ví dụ xấu:**\r
\`\`\`java\r
try {\r
    // something\r
} catch (Exception e) {  // ❌ quá rộng\r
    e.printStackTrace();\r
}\r
\`\`\`\r
\r
**Ví dụ tốt:**\r
\`\`\`java\r
try {\r
    // something\r
} catch (UserNotFoundException e) {\r
    return ResponseEntity.status(404).body(e.getMessage());\r
} catch (IllegalArgumentException e) {\r
    return ResponseEntity.status(400).body(e.getMessage());\r
}\r
\`\`\`\r
\r
---\r
\r
## 7. Global Exception Handler trong Spring Boot\r
\r
\`\`\`java\r
@RestControllerAdvice\r
public class GlobalExceptionHandler {\r
\r
    @ExceptionHandler(UserNotFoundException.class)\r
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException e) {\r
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());\r
    }\r
\r
    @ExceptionHandler(Exception.class)\r
    public ResponseEntity<String> handleGeneric(Exception e) {\r
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)\r
                             .body("Internal error");\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 8. \`final\`, \`finally\`, \`finalize\`\r
\r
| Từ khóa | Ý nghĩa |\r
|---|---|\r
| \`final\` | Biến không đổi, method không override, class không kế thừa |\r
| \`finally\` | Khối code luôn chạy sau try-catch |\r
| \`finalize()\` | Method của Object, GC gọi trước khi thu hồi. **Không nên dùng.** |\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Checked vs Unchecked Exception?**\r
> "Checked Exception kế thừa Exception nhưng không phải RuntimeException, compiler bắt buộc phải xử lý bằng try-catch hoặc throws, ví dụ IOException. Unchecked Exception kế thừa RuntimeException, thường do lỗi logic như NullPointerException, compiler không bắt buộc xử lý."\r
\r
**Câu: Custom Exception có tác dụng gì?**\r
> "Giúp code rõ ràng hơn khi xử lý lỗi business. Ví dụ thay vì ném RuntimeException chung chung, mình tạo UserNotFoundException để controller bắt và trả về 404 cụ thể."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 3\r
\r
- [ ] Phân biệt Checked vs Unchecked Exception.\r
- [ ] Phân biệt \`throw\` vs \`throws\`.\r
- [ ] Biết cách viết \`try-catch-finally\` và \`try-with-resources\`.\r
- [ ] Biết tạo Custom Exception.\r
- [ ] Biết tại sao không nên catch Exception quá rộng.\r
- [ ] Biết Global Exception Handler trong Spring Boot.\r
- [ ] Phân biệt \`final\`, \`finally\`, \`finalize\`.`,checklist:[`Phân biệt Checked vs Unchecked Exception.`,"Phân biệt `throw` vs `throws`.","Biết cách viết `try-catch-finally` và `try-with-resources`.",`Biết tạo Custom Exception.`,`Biết tại sao không nên catch Exception quá rộng.`,`Biết Global Exception Handler trong Spring Boot.`,"Phân biệt `final`, `finally`, `finalize`."]},{file:`Phan4_Java8_CheatSheet.md`,title:`📄 📄 PHẦN 4 — JAVA 8+`,content:`# 📄 PHẦN 4 — JAVA 8+ \r
\r
---\r
\r
## 1. Functional Interface\r
\r
Interface chỉ có **duy nhất một abstract method**, có thể dùng với Lambda.\r
\r
| Interface | Method | Input | Output | Dùng khi |\r
|---|---|---|---|---|\r
| \`Predicate<T>\` | \`test(T)\` | T | boolean | Kiểm tra điều kiện |\r
| \`Function<T, R>\` | \`apply(T)\` | T | R | Biến đổi dữ liệu |\r
| \`Consumer<T>\` | \`accept(T)\` | T | void | Xử lý, in, lưu |\r
| \`Supplier<T>\` | \`get()\` | void | T | Cung cấp giá trị |\r
\r
**Ví dụ:**\r
\`\`\`java\r
Predicate<Integer> isEven = x -> x % 2 == 0;\r
Function<String, Integer> length = s -> s.length();\r
Consumer<String> print = System.out::println;\r
Supplier<Double> random = Math::random;\r
\`\`\`\r
\r
---\r
\r
## 2. Lambda Expression\r
\r
Cách viết ngắn gọn cho anonymous class của functional interface.\r
\r
**Ví dụ:**\r
\`\`\`java\r
// Trước Java 8\r
Runnable r = new Runnable() {\r
    public void run() { System.out.println("run"); }\r
};\r
\r
// Java 8+\r
Runnable r = () -> System.out.println("run");\r
\`\`\`\r
\r
---\r
\r
## 3. Stream API Pipeline\r
\r
Stream xử lý collection theo pipeline: **Source → Intermediate → Terminal**.\r
\r
\`\`\`java\r
List<Integer> result = numbers.stream()\r
    .filter(x -> x % 2 == 0)   // intermediate\r
    .map(x -> x * 2)            // intermediate\r
    .sorted()                   // intermediate\r
    .distinct()                 // intermediate\r
    .collect(Collectors.toList()); // terminal\r
\`\`\`\r
\r
**Intermediate operations:** lazy, trả về Stream (\`filter\`, \`map\`, \`sorted\`, \`distinct\`, \`flatMap\`).  \r
**Terminal operations:** kết thúc pipeline (\`collect\`, \`forEach\`, \`reduce\`, \`findFirst\`, \`anyMatch\`).\r
\r
---\r
\r
## 4. \`map\` vs \`flatMap\`\r
\r
| \`map\` | \`flatMap\` |\r
|---|---|\r
| Biến đổi từng phần tử thành 1 giá trị | Biến đổi rồi **flatten** các Stream lồng nhau |\r
| \`Stream<T>\` → \`Stream<R>\` | \`Stream<Stream<T>>\` → \`Stream<T>\` |\r
\r
**Ví dụ:**\r
\`\`\`java\r
List<List<Integer>> nested = Arrays.asList(\r
    Arrays.asList(1, 2),\r
    Arrays.asList(3, 4)\r
);\r
\r
// map: Stream<List<Integer>>\r
nested.stream().map(x -> x);           // [[1,2], [3,4]]\r
\r
// flatMap: Stream<Integer>\r
nested.stream().flatMap(List::stream)  // [1, 2, 3, 4]\r
               .collect(Collectors.toList());\r
\`\`\`\r
\r
---\r
\r
## 5. Optional\r
\r
Biểu diễn giá trị có thể tồn tại hoặc không, tránh \`NullPointerException\` và \`null\` check lồng nhau.\r
\r
**Ví dụ:**\r
\`\`\`java\r
Optional<String> name = Optional.ofNullable(findNameById(id));\r
\r
name.ifPresent(n -> System.out.println(n));\r
\r
String result = name\r
    .filter(n -> n.length() > 3)\r
    .map(String::toUpperCase)\r
    .orElse("UNKNOWN");\r
\`\`\`\r
\r
**Anti-pattern:**\r
\`\`\`java\r
Optional<User> user = Optional.ofNullable(getUser());  // ❌ không cần wrap nếu vừa mới check null\r
String name = user.get().getName();                    // ❌ .get() dễ ném NoSuchElementException\r
\`\`\`\r
\r
---\r
\r
## 6. Method Reference\r
\r
\`\`\`java\r
List<String> names = Arrays.asList("a", "b", "c");\r
names.forEach(System.out::println);  // method reference\r
\r
// Tương đương\r
names.forEach(s -> System.out.println(s));\r
\`\`\`\r
\r
**4 loại:**\r
- Static method: \`ClassName::method\`\r
- Instance method của object cụ thể: \`obj::method\`\r
- Instance method của class: \`ClassName::method\`\r
- Constructor: \`ClassName::new\`\r
\r
---\r
\r
## 7. Default Method & Static Method trong Interface (Java 8)\r
\r
\`\`\`java\r
interface Logger {\r
    void log(String msg);                    // abstract\r
\r
    default void logInfo(String msg) {       // default method\r
        log("[INFO] " + msg);\r
    }\r
\r
    static void print(String msg) {          // static method\r
        System.out.println(msg);\r
    }\r
}\r
\`\`\`\r
\r
> Giúp bổ sung method mà không phá vỡ class đã implement interface.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Stream API là gì?**\r
> "Stream API giúp xử lý collection theo cách khai báo, gồm các bước filter, map, collect. Ví dụ tôi có list số, muốn lấy số chẵn nhân đôi rồi thu thập thành list mới, tôi viết numbers.stream().filter(x -> x % 2 == 0).map(x -> x * 2).toList()."\r
\r
**Câu: Optional dùng để làm gì?**\r
> "Optional giúp thể hiện rõ một giá trị có thể null, tránh null check lồng nhau. Ví dụ Optional.ofNullable(user).map(User::getName).orElse('Unknown'). Tuy nhiên không nên dùng Optional chỉ để wrap rồi .get() ngay, hoặc dùng trong field/parameter thông thường."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 4\r
\r
- [ ] Giải thích Functional Interface và 4 loại phổ biến.\r
- [ ] Viết Lambda expression.\r
- [ ] Giải thích Stream API pipeline.\r
- [ ] Phân biệt intermediate vs terminal operations.\r
- [ ] Phân biệt \`map\` vs \`flatMap\`.\r
- [ ] Dùng \`Optional\` đúng cách và biết anti-pattern.\r
- [ ] Biết Method Reference.\r
- [ ] Biết default method và static method trong interface.`,checklist:[`Giải thích Functional Interface và 4 loại phổ biến.`,`Viết Lambda expression.`,`Giải thích Stream API pipeline.`,`Phân biệt intermediate vs terminal operations.`,"Phân biệt `map` vs `flatMap`.","Dùng `Optional` đúng cách và biết anti-pattern.",`Biết Method Reference.`,`Biết default method và static method trong interface.`]},{file:`Phan5_Multithreading_CheatSheet.md`,title:`📄 📄 PHẦN 5 — MULTITHREADING`,content:`# 📄 PHẦN 5 — MULTITHREADING \r
\r
---\r
\r
## 1. Thread vs Process\r
\r
| | **Process** | **Thread** |\r
|---|---|---|\r
| **Định nghĩa** | Chương trình đang chạy, có bộ nhớ riêng | Đơn vị thực thi nhỏ trong process |\r
| **Bộ nhớ** | Có heap và memory space riêng | Chia sẻ heap của process, có stack riêng |\r
| **Giao tiếp** | IPC (inter-process communication) | Dùng shared memory |\r
| **Tạo mới** | Tốn kém | Nhẹ hơn |\r
\r
**Ví dụ:**\r
\`\`\`java\r
Thread t = new Thread(() -> System.out.println("Running in new thread"));\r
t.start();\r
\`\`\`\r
\r
---\r
\r
## 2. Race Condition\r
\r
Nhiều thread cùng truy cập và thay đổi **shared data**, kết quả phụ thuộc vào thứ tự thực thi.\r
\r
**Ví dụ:**\r
\`\`\`java\r
class Counter {\r
    int count = 0;\r
    void increment() { count++; } // ❌ không thread-safe\r
}\r
\`\`\`\r
\r
Cách giải quyết:\r
- \`synchronized\`\r
- \`ReentrantLock\`\r
- \`AtomicInteger\`\r
\r
---\r
\r
## 3. \`synchronized\`\r
\r
Đảm bảo một vùng code chỉ được một thread truy cập tại một thởi điểm.\r
\r
**Ví dụ:**\r
\`\`\`java\r
class Counter {\r
    private int count = 0;\r
\r
    public synchronized void increment() {  // khóa object instance\r
        count++;\r
    }\r
}\r
\`\`\`\r
\r
Hoặc khối:\r
\`\`\`java\r
public void increment() {\r
    synchronized (this) {\r
        count++;\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 4. Deadlock\r
\r
Các thread giữ resource và chờ resource của nhau, không thread nào tiếp tục được.\r
\r
**Điều kiện:**\r
- Mutual exclusion\r
- Hold and wait\r
- No preemption\r
- Circular wait\r
\r
**Ví dụ:**\r
\`\`\`java\r
Thread 1: lock A → đợi lock B\r
Thread 2: lock B → đợi lock A\r
\`\`\`\r
\r
**Cách phòng tránh:**\r
- Luôn lock theo cùng thứ tự.\r
- Dùng timeout (\`tryLock\`).\r
- Hạn chế số lượng lock.\r
\r
---\r
\r
## 5. ExecutorService & Thread Pool\r
\r
Quản lý thread pool, tránh tạo thread thủ công cho từng task.\r
\r
**Ví dụ:**\r
\`\`\`java\r
ExecutorService executor = Executors.newFixedThreadPool(4);\r
\r
for (int i = 0; i < 10; i++) {\r
    executor.submit(() -> System.out.println("Task"));\r
}\r
\r
executor.shutdown();\r
\`\`\`\r
\r
| Loại pool | Đặc điểm |\r
|---|---|\r
| \`newFixedThreadPool(n)\` | Cố định n thread |\r
| \`newCachedThreadPool()\` | Tự động tạo thread khi cần |\r
| \`newSingleThreadExecutor()\` | 1 thread duy nhất |\r
| \`newScheduledThreadPool(n)\` | Chạy task định kỳ |\r
\r
---\r
\r
## 6. JVM Memory Model (đơn giản)\r
\r
\`\`\`\r
JVM Memory\r
├── Heap          (objects, shared by all threads)\r
│   ├── Young Generation (Eden, Survivor)\r
│   └── Old Generation\r
├── Stack         (mỗi thread có stack riêng, local variables)\r
├── Metaspace     (class metadata)\r
├── Program Counter (thread hiện tại đang thực thi dòng nào)\r
└── Native Method Stack\r
\`\`\`\r
\r
---\r
\r
## 7. Garbage Collection\r
\r
GC tự động thu hồi object không còn reference để giải phóng bộ nhớ.\r
\r
**Cách GC xác định object cần thu hồi:**\r
- Reference counting (ít dùng vì circular reference).\r
- Reachability analysis: object không reachable từ GC Roots.\r
\r
**GC Roots:**\r
- Local variables trong stack.\r
- Static fields.\r
- JNI references.\r
\r
**Ví dụ:**\r
\`\`\`java\r
User u = new User();  // u là GC Root\r
u = null;             // object User không còn reachable → GC thu hồi\r
\`\`\`\r
\r
---\r
\r
## 8. \`volatile\`\r
\r
Đảm bảo giá trị biến luôn đọc/ghi từ **main memory**, không dùng cache của thread.\r
\r
\`\`\`java\r
private volatile boolean running = true;\r
\`\`\`\r
\r
> \`volatile\` không thay thế \`synchronized\` cho compound operations như \`i++\`.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Race condition là gì?**\r
> "Race condition xảy ra khi nhiều thread cùng truy cập và thay đổi shared data. Kết quả cuối cùng phụ thuộc vào thứ tự thực thi của các thread. Ví dụ nhiều thread cùng increment một biến count mà không đồng bộ, kết quả cuối cùng sẽ sai. Cách xử lý là dùng synchronized, ReentrantLock hoặc AtomicInteger."\r
\r
**Câu: Deadlock là gì, cách phòng tránh?**\r
> "Deadlock là tình trạng các thread giữ lock và chờ lock của nhau, không ai tiến thêm được. Ví dụ thread A giữ lock 1 đợi lock 2, thread B giữ lock 2 đợi lock 1. Để tránh, mình luôn lock theo cùng một thứ tự, hoặc dùng tryLock với timeout."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 5\r
\r
- [ ] Phân biệt Thread vs Process.\r
- [ ] Giải thích Race Condition.\r
- [ ] Dùng \`synchronized\` đúng cách.\r
- [ ] Giải thích Deadlock và cách phòng tránh.\r
- [ ] Dùng ExecutorService & Thread Pool.\r
- [ ] Biết JVM Memory Model cơ bản.\r
- [ ] Giải thích Garbage Collection.\r
- [ ] Biết \`volatile\`.`,checklist:[`Phân biệt Thread vs Process.`,`Giải thích Race Condition.`,"Dùng `synchronized` đúng cách.",`Giải thích Deadlock và cách phòng tránh.`,`Dùng ExecutorService & Thread Pool.`,`Biết JVM Memory Model cơ bản.`,`Giải thích Garbage Collection.`,"Biết `volatile`."]},{file:`Phan6_SQL_Database_CheatSheet.md`,title:`📄 📄 PHẦN 6 — SQL & DATABASE`,content:`# 📄 PHẦN 6 — SQL & DATABASE \r
\r
---\r
\r
## 1. JOIN\r
\r
| JOIN | Mô tả |\r
|---|---|\r
| \`INNER JOIN\` | Chỉ lấy dòng có match ở cả 2 bảng |\r
| \`LEFT JOIN\` | Lấy tất cả từ bảng trái, null nếu không match |\r
| \`RIGHT JOIN\` | Lấy tất cả từ bảng phải |\r
| \`FULL OUTER JOIN\` | Lấy tất cả từ cả 2 bảng |\r
\r
**Ví dụ:**\r
\`\`\`sql\r
SELECT u.name, o.order_date\r
FROM users u\r
LEFT JOIN orders o ON u.id = o.user_id;\r
\`\`\`\r
\r
---\r
\r
## 2. GROUP BY & HAVING\r
\r
\`\`\`sql\r
SELECT department, AVG(salary) AS avg_salary\r
FROM employees\r
GROUP BY department\r
HAVING AVG(salary) > 5000;\r
\`\`\`\r
\r
- \`WHERE\` lọc trước khi group.\r
- \`HAVING\` lọc sau khi group.\r
\r
---\r
\r
## 3. INDEX\r
\r
Cấu trúc dữ liệu (thường B-Tree) giúp truy vấn WHERE nhanh hơn.\r
\r
**Ví dụ:**\r
\`\`\`sql\r
CREATE INDEX idx_email ON users(email);\r
\`\`\`\r
\r
| Ưu điểm | Nhược điểm |\r
|---|---|\r
| Tìm kiếm nhanh hơn | Tốn dung lượng |\r
| ORDER BY nhanh hơn | INSERT/UPDATE/DELETE chậm hơn vì cập nhật index |\r
\r
> Không nên tạo index cho cột có cardinality thấp (ví dụ: gender).\r
\r
---\r
\r
## 4. Transaction & ACID\r
\r
| Thuộc tính | Ý nghĩa |\r
|---|---|\r
| **A**tomicity | Toàn bộ hoặc không gì cả |\r
| **C**onsistency | Dữ liệu chuyển từ trạng thái hợp lệ này sang trạng thái hợp lệ khác |\r
| **I**solation | Các transaction không ảnh hưởng lẫn nhau |\r
| **D**urability | Dữ liệu đã commit được lưu vĩnh viễn |\r
\r
---\r
\r
## 5. Isolation Levels\r
\r
| Level | Dirty Read | Non-repeatable Read | Phantom Read |\r
|---|---|---|---|\r
| READ UNCOMMITTED | Có thể | Có thể | Có thể |\r
| READ COMMITTED | Không | Có thể | Có thể |\r
| REPEATABLE READ | Không | Không | Có thể (MySQL InnoDB mặc định, ngăn phantom) |\r
| SERIALIZABLE | Không | Không | Không |\r
\r
---\r
\r
## 6. Normalization\r
\r
Tách bảng để giảm dư thừa dữ liệu và tránh anomaly.\r
\r
| Dạng | Mô tả ngắn |\r
|---|---|\r
| 1NF | Mỗi cột chỉ chứa giá trị nguyên tử |\r
| 2NF | 1NF + không có partial dependency |\r
| 3NF | 2NF + không có transitive dependency |\r
\r
---\r
\r
## 7. Query chậm → optimize\r
\r
- Kiểm tra \`EXPLAIN\` / execution plan.\r
- Thêm index cho cột trong WHERE, JOIN, ORDER BY.\r
- Tránh \`SELECT *\`.\r
- Phân trang thay vì load toàn bộ.\r
- Tối ưu subquery → JOIN.\r
- Tăng connection pool nếu cần.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Index là gì, khi nào dùng?**\r
> "Index là cấu trúc dữ liệu giúp tìm kiếm nhanh, giống như mục lục sách. Ví dụ tạo index trên cột email để tìm user theo email nhanh. Nhược điểm là insert/update/delete chậm hơn và tốn dung lượng. Không nên index cột có ít giá trị khác nhau như gender."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 6\r
\r
- [ ] Giải thích 4 loại JOIN.\r
- [ ] Dùng GROUP BY, HAVING, WHERE đúng.\r
- [ ] Giải thích INDEX, ưu/nhược điểm.\r
- [ ] Nói được ACID.\r
- [ ] Phân biệt 4 isolation levels.\r
- [ ] Biết normalization cơ bản.\r
- [ ] Biết cách optimize query chậm.`,checklist:[`Giải thích 4 loại JOIN.`,`Dùng GROUP BY, HAVING, WHERE đúng.`,`Giải thích INDEX, ưu/nhược điểm.`,`Nói được ACID.`,`Phân biệt 4 isolation levels.`,`Biết normalization cơ bản.`,`Biết cách optimize query chậm.`]},{file:`Phan7_SpringBoot_CheatSheet.md`,title:`📄 📄 PHẦN 7 — SPRING BOOT`,content:`# 📄 PHẦN 7 — SPRING BOOT \r
\r
---\r
\r
## 1. Spring IoC Container\r
\r
**Inversion of Control (IoC):** Thay vì tự tạo object, Spring Container tạo và quản lý object (bean).\r
\r
**Ví dụ:**\r
\`\`\`java\r
@Service\r
public class UserService { ... }\r
\r
// Spring tự tạo UserService, không cần new UserService()\r
\`\`\`\r
\r
---\r
\r
## 2. Dependency Injection (DI)\r
\r
Spring inject bean vào bean khác thông qua constructor, setter, hoặc field.\r
\r
**Khuyến nghị: Constructor Injection**\r
\`\`\`java\r
@Service\r
public class UserService {\r
    private final UserRepository userRepository;\r
\r
    public UserService(UserRepository userRepository) {\r
        this.userRepository = userRepository;\r
    }\r
}\r
\`\`\`\r
\r
Ưu điểm:\r
- Dễ test.\r
- Không cần \`@Autowired\`.\r
- Bắt buộc cung cấp dependency.\r
\r
---\r
\r
## 3. \`@Component\`, \`@Service\`, \`@Repository\`, \`@Controller\`\r
\r
| Annotation | Ý nghĩa |\r
|---|---|\r
| \`@Component\` | Bean chung |\r
| \`@Service\` | Tầng business logic |\r
| \`@Repository\` | Tầng truy cập dữ liệu, tự đổi SQLException thành DataAccessException |\r
| \`@Controller\` / \`@RestController\` | Xử lý request HTTP |\r
\r
> \`@RestController\` = \`@Controller\` + \`@ResponseBody\`\r
\r
---\r
\r
## 4. Spring Boot Auto-Configuration\r
\r
Spring Boot tự động cấu hình bean dựa trên classpath và properties.\r
\r
**Ví dụ:**\r
- Có \`spring-boot-starter-data-jpa\` + H2/MySQL trong classpath → tự cấu hình \`DataSource\`, \`EntityManagerFactory\`.\r
- Có \`spring-boot-starter-web\` → tự cấu hình embedded Tomcat.\r
\r
---\r
\r
## 5. Spring Boot Starter\r
\r
Starter là dependency tổng hợp nhiều dependency liên quan.\r
\r
**Ví dụ \`pom.xml\`:**\r
\`\`\`xml\r
<dependency>\r
    <groupId>org.springframework.boot</groupId>\r
    <artifactId>spring-boot-starter-web</artifactId>\r
</dependency>\r
\r
<dependency>\r
    <groupId>org.springframework.boot</groupId>\r
    <artifactId>spring-boot-starter-data-jpa</artifactId>\r
</dependency>\r
\`\`\`\r
\r
---\r
\r
## 6. \`@SpringBootApplication\`\r
\r
\`\`\`java\r
@SpringBootApplication\r
public class DemoApplication {\r
    public static void main(String[] args) {\r
        SpringApplication.run(DemoApplication.class, args);\r
    }\r
}\r
\`\`\`\r
\r
Tương đương:\r
- \`@Configuration\`\r
- \`@EnableAutoConfiguration\`\r
- \`@ComponentScan\`\r
\r
---\r
\r
## 7. Application Properties\r
\r
\`\`\`properties\r
server.port=8080\r
spring.datasource.url=jdbc:mysql://localhost:3306/db\r
spring.datasource.username=root\r
spring.datasource.password=secret\r
spring.jpa.hibernate.ddl-auto=update\r
\`\`\`\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Dependency Injection là gì?**\r
> "Dependency Injection là cách Spring cung cấp object mà một class cần thay vì class tự tạo. Ví dụ UserService cần UserRepository, mình inject qua constructor. Ưu điểm là dễ test vì có thể truyền mock repository vào, và dependency rõ ràng ngay từ constructor."\r
\r
**Câu: Spring Boot auto-configuration là gì?**\r
> "Spring Boot tự động cấu hình bean dựa trên classpath và properties. Ví dụ nếu có spring-boot-starter-data-jpa và MySQL driver trong classpath, Spring Boot tự tạo DataSource và EntityManagerFactory mà mình không cần cấu hình thủ công."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 7\r
\r
- [ ] Giải thích IoC Container.\r
- [ ] Giải thích DI và Constructor Injection.\r
- [ ] Phân biệt @Component, @Service, @Repository, @Controller.\r
- [ ] Giải thích @RestController.\r
- [ ] Giải thích Auto-Configuration.\r
- [ ] Biết Spring Boot Starter.\r
- [ ] Giải thích @SpringBootApplication.\r
- [ ] Biết cấu hình application.properties.`,checklist:[`Giải thích IoC Container.`,`Giải thích DI và Constructor Injection.`,`Phân biệt @Component, @Service, @Repository, @Controller.`,`Giải thích @RestController.`,`Giải thích Auto-Configuration.`,`Biết Spring Boot Starter.`,`Giải thích @SpringBootApplication.`,`Biết cấu hình application.properties.`]},{file:`Phan8_REST_API_CheatSheet.md`,title:`📄 📄 PHẦN 8 — REST API`,content:`# 📄 PHẦN 8 — REST API \r
\r
---\r
\r
## 1. HTTP Methods\r
\r
| Method | Dùng để | Idempotent |\r
|---|---|---|\r
| \`GET\` | Lấy dữ liệu | ✅ Có |\r
| \`POST\` | Tạo mới | ❌ Không |\r
| \`PUT\` | Cập nhật toàn bộ / replace | ✅ Có |\r
| \`PATCH\` | Cập nhật một phần | ❌ Không (thường) |\r
| \`DELETE\` | Xóa | ✅ Có |\r
\r
---\r
\r
## 2. HTTP Status Codes\r
\r
| Code | Ý nghĩa |\r
|---|---|\r
| 200 OK | Thành công |\r
| 201 Created | Tạo thành công |\r
| 400 Bad Request | Request sai định dạng / validation |\r
| 401 Unauthorized | Chưa xác thực |\r
| 403 Forbidden | Đã xác thực nhưng không có quyền |\r
| 404 Not Found | Không tìm thấy resource |\r
| 500 Internal Server Error | Lỗi server |\r
\r
> **401 vs 403:** 401 = chưa đăng nhập / token sai; 403 = đã đăng nhập nhưng không đủ quyền.\r
\r
---\r
\r
## 3. Idempotency\r
\r
Gọi nhiều lần với cùng input cho kết quả giống nhau và không gây side effect lặp.\r
\r
**Ví dụ:**\r
- \`GET /products/1\` gọi 10 lần vẫn trả về cùng product.\r
- \`PUT /products/1\` với cùng body thay thế object, kết quả cuối cùng như nhau.\r
- \`POST /orders\` gọi 2 lần → tạo 2 đơn hàng, **không idempotent**.\r
\r
**Xử lý POST idempotent:** dùng idempotency key.\r
\r
---\r
\r
## 4. REST URL Design\r
\r
\`\`\`\r
GET    /api/products         # danh sách\r
GET    /api/products?page=1&size=10   # phân trang\r
GET    /api/products/{id}    # chi tiết\r
POST   /api/products         # tạo mới\r
PUT    /api/products/{id}   # cập nhật toàn bộ\r
PATCH  /api/products/{id}   # cập nhật một phần\r
DELETE /api/products/{id}   # xóa\r
\`\`\`\r
\r
---\r
\r
## 5. Spring Boot REST Controller\r
\r
\`\`\`java\r
@RestController\r
@RequestMapping("/api/products")\r
public class ProductController {\r
\r
    @GetMapping("/{id}")\r
    public ResponseEntity<ProductDto> get(@PathVariable Long id) { ... }\r
\r
    @PostMapping\r
    public ResponseEntity<ProductDto> create(@RequestBody @Valid ProductRequest request) { ... }\r
\r
    @PutMapping("/{id}")\r
    public ResponseEntity<ProductDto> update(@PathVariable Long id,\r
                                            @RequestBody ProductRequest request) { ... }\r
\r
    @DeleteMapping("/{id}")\r
    public ResponseEntity<Void> delete(@PathVariable Long id) { ... }\r
}\r
\`\`\`\r
\r
---\r
\r
## 6. Pagination\r
\r
\`\`\`java\r
@GetMapping\r
public Page<ProductDto> list(\r
    @RequestParam(defaultValue = "0") int page,\r
    @RequestParam(defaultValue = "10") int size) {\r
    return service.findAll(PageRequest.of(page, size));\r
}\r
\`\`\`\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: GET vs POST?**\r
> "GET dùng để lấy dữ liệu, idempotent, không có body. POST dùng để tạo mới, không idempotent, có thể có body."\r
\r
**Câu: 401 vs 403?**\r
> "401 là Unauthorized, nghĩa là request chưa xác thực hoặc token sai. 403 là Forbidden, request đã xác thực nhưng user không có quyền truy cập resource."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 8\r
\r
- [ ] Phân biệt 5 HTTP methods và idempotency.\r
- [ ] Biết status code phổ biến.\r
- [ ] Phân biệt 401 vs 403.\r
- [ ] Giải thích idempotency.\r
- [ ] Thiết kế REST URL đúng chuẩn.\r
- [ ] Viết @RestController cơ bản.\r
- [ ] Biết pagination với Spring Data.`,checklist:[`Phân biệt 5 HTTP methods và idempotency.`,`Biết status code phổ biến.`,`Phân biệt 401 vs 403.`,`Giải thích idempotency.`,`Thiết kế REST URL đúng chuẩn.`,`Viết @RestController cơ bản.`,`Biết pagination với Spring Data.`]},{file:`Phan9_DTO_Validation_CheatSheet.md`,title:`📄 📄 PHẦN 9 — DTO & VALIDATION`,content:`# 📄 PHẦN 9 — DTO & VALIDATION \r
\r
---\r
\r
## 1. DTO là gì?\r
\r
**Data Transfer Object:** Object dùng để truyền dữ liệu giữa các tầng (client ↔ controller ↔ service), tách biệt khỏi Entity.\r
\r
**Ví dụ:**\r
\`\`\`java\r
// Entity - map với database\r
@Entity\r
public class User {\r
    @Id @GeneratedValue\r
    private Long id;\r
    private String email;\r
    private String password;\r
}\r
\r
// DTO - dùng cho API\r
public class UserResponse {\r
    private Long id;\r
    private String email;\r
}\r
\r
public class UserRequest {\r
    private String email;\r
    private String password;\r
}\r
\`\`\`\r
\r
---\r
\r
## 2. Tại sao dùng DTO?\r
\r
- Không expose trực tiếp Entity ra ngoài.\r
- Kiểm soát dữ liệu trả về / nhận vào.\r
- Dễ validation.\r
- Tránh vòng lặp JSON khi entity có quan hệ.\r
\r
---\r
\r
## 3. MapStruct — Chuyển đổi Entity ↔ DTO\r
\r
\`\`\`java\r
@Mapper(componentModel = "spring")\r
public interface UserMapper {\r
    UserResponse toResponse(User user);\r
    User toEntity(UserRequest request);\r
}\r
\`\`\`\r
\r
Hoặc dùng thủ công:\r
\`\`\`java\r
public UserResponse toResponse(User user) {\r
    UserResponse dto = new UserResponse();\r
    dto.setId(user.getId());\r
    dto.setEmail(user.getEmail());\r
    return dto;\r
}\r
\`\`\`\r
\r
---\r
\r
## 4. Validation với Jakarta Bean Validation\r
\r
**Dependency:**\r
\`\`\`xml\r
<dependency>\r
    <groupId>org.springframework.boot</groupId>\r
    <artifactId>spring-boot-starter-validation</artifactId>\r
</dependency>\r
\`\`\`\r
\r
**Các annotation phổ biến:**\r
\r
| Annotation | Ý nghĩa |\r
|---|---|\r
| \`@NotNull\` | Không được null |\r
| \`@NotBlank\` | Không null, không rỗng, không chỉ whitespace |\r
| \`@NotEmpty\` | Không null, không rỗng (chuỗi, collection) |\r
| \`@Size(min, max)\` | Độ dài trong khoảng |\r
| \`@Min\` / \`@Max\` | Giá trị số tối thiểu / tối đa |\r
| \`@Email\` | Định dạng email |\r
| \`@Pattern(regexp)\` | Khớp regex |\r
\r
---\r
\r
## 5. DTO Request với Validation\r
\r
\`\`\`java\r
public class UserRequest {\r
\r
    @NotBlank(message = "Name is required")\r
    @Size(max = 100)\r
    private String name;\r
\r
    @NotBlank\r
    @Email(message = "Email invalid")\r
    private String email;\r
\r
    @NotBlank\r
    @Size(min = 6, message = "Password at least 6 characters")\r
    private String password;\r
}\r
\`\`\`\r
\r
**Controller:**\r
\`\`\`java\r
@PostMapping\r
public ResponseEntity<UserResponse> create(@RequestBody @Valid UserRequest request) { ... }\r
\`\`\`\r
\r
---\r
\r
## 6. Custom Validation Message\r
\r
Dùng \`message.properties\`:\r
\`\`\`properties\r
NotBlank.userRequest.email=Email không được để trống\r
Size.userRequest.password=Mật khẩu phải từ {min} đến {max} ký tự\r
\`\`\`\r
\r
---\r
\r
## 7. Global Validation Handler\r
\r
\`\`\`java\r
@RestControllerAdvice\r
public class ValidationHandler {\r
\r
    @ExceptionHandler(MethodArgumentNotValidException.class)\r
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {\r
        Map<String, String> errors = new HashMap<>();\r
        ex.getBindingResult().getFieldErrors().forEach(err ->\r
            errors.put(err.getField(), err.getDefaultMessage())\r
        );\r
        return ResponseEntity.badRequest().body(errors);\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Tại sao dùng DTO?**\r
> "DTO giúp tách API model khỏi Entity, không expose trực tiếp cấu trúc database ra ngoài. Ví dụ entity User có password, mình chỉ trả về UserResponse gồm id và email. Ngoài ra DTO còn giúp validation dễ dàng hơn và tránh vòng lặp JSON với quan hệ entity."\r
\r
**Câu: Validation trong Spring Boot?**\r
> "Dùng Jakarta Bean Validation với các annotation như @NotBlank, @Email, @Size. Controller nhận request bằng @Valid. Nếu sai validation, Spring ném MethodArgumentNotValidException, mình bắt bằng @RestControllerAdvice để trả về lỗi 400 rõ ràng."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 9\r
\r
- [ ] Giải thích DTO và lý do dùng.\r
- [ ] Phân biệt Entity và DTO.\r
- [ ] Biết cách chuyển đổi Entity ↔ DTO.\r
- [ ] Biết các annotation validation phổ biến.\r
- [ ] Dùng @Valid trong controller.\r
- [ ] Biết custom validation message.\r
- [ ] Biết xử lý MethodArgumentNotValidException.`,checklist:[`Giải thích DTO và lý do dùng.`,`Phân biệt Entity và DTO.`,`Biết cách chuyển đổi Entity ↔ DTO.`,`Biết các annotation validation phổ biến.`,`Dùng @Valid trong controller.`,`Biết custom validation message.`,`Biết xử lý MethodArgumentNotValidException.`]},{file:`Phan10_JPA_Hibernate_CheatSheet.md`,title:`📄 📄 PHẦN 10 — JPA/HIBERNATE`,content:`# 📄 PHẦN 10 — JPA/HIBERNATE \r
\r
---\r
\r
## 1. JPA vs Hibernate\r
\r
| JPA | Hibernate |\r
|---|---|\r
| Specification (chuẩn Java) | Implementation của JPA |\r
| \`javax.persistence\` / \`jakarta.persistence\` | \`org.hibernate\` |\r
| Định nghĩa Entity, Repository, Query | Cung cấp engine ORM thực tế |\r
\r
> Spring Data JPA giúp việc dùng JPA dễ dàng hơn qua \`JpaRepository\`.\r
\r
---\r
\r
## 2. Entity cơ bản\r
\r
\`\`\`java\r
@Entity\r
@Table(name = "products")\r
public class Product {\r
\r
    @Id\r
    @GeneratedValue(strategy = GenerationType.IDENTITY)\r
    private Long id;\r
\r
    @Column(nullable = false)\r
    private String name;\r
\r
    private BigDecimal price;\r
\r
    @ManyToOne(fetch = FetchType.LAZY)\r
    @JoinColumn(name = "category_id")\r
    private Category category;\r
}\r
\`\`\`\r
\r
---\r
\r
## 3. Lazy vs Eager\r
\r
| | **LAZY** | **EAGER** |\r
|---|---|---|\r
| Load quan hệ | Khi nào gọi getter mới load | Load ngay khi load entity |\r
| Hiệu năng | Tốt hơn | Dễ load thừa dữ liệu |\r
| Mặc định | \`@OneToMany\`, \`@ManyToMany\` | \`@ManyToOne\`, \`@OneToOne\` |\r
\r
**Ví dụ:**\r
\`\`\`java\r
@ManyToOne(fetch = FetchType.LAZY)   // khuyến nghị\r
private Category category;\r
\`\`\`\r
\r
---\r
\r
## 4. N+1 Query Problem\r
\r
**Vấn đề:** Load 1 list entity, sau đó vòng lặp gọi thêm N câu query cho quan hệ.\r
\r
**Giải pháp:**\r
- Dùng \`EntityGraph\`.\r
- Dùng \`JOIN FETCH\` trong JPQL.\r
- Dùng \`@Query\` với native SQL hoặc JPQL.\r
\r
**Ví dụ:**\r
\`\`\`java\r
@Query("SELECT p FROM Product p JOIN FETCH p.category")\r
List<Product> findAllWithCategory();\r
\`\`\`\r
\r
---\r
\r
## 5. Persistence Context & Dirty Checking\r
\r
- **Persistence Context:** Vùng cache của EntityManager chứa managed entities.\r
- **Dirty Checking:** Hibernate tự động so sánh entity khi transaction commit, chỉ update những field thay đổi.\r
\r
**Ví dụ:**\r
\`\`\`java\r
@Transactional\r
public void updatePrice(Long id, BigDecimal newPrice) {\r
    Product p = repo.findById(id).orElseThrow();\r
    p.setPrice(newPrice);  // không cần save, Hibernate tự flush\r
}\r
\`\`\`\r
\r
---\r
\r
## 6. Spring Data JPA Repository\r
\r
\`\`\`java\r
public interface ProductRepository extends JpaRepository<Product, Long> {\r
\r
    List<Product> findByCategoryName(String categoryName);\r
\r
    @Query("SELECT p FROM Product p WHERE p.price > :price")\r
    List<Product> findExpensive(@Param("price") BigDecimal price);\r
}\r
\`\`\`\r
\r
---\r
\r
## 7. Cascade & Orphan Removal\r
\r
\`\`\`java\r
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)\r
private List<OrderItem> items;\r
\`\`\`\r
\r
- \`CascadeType.ALL\`: thao tác order sẽ lan xuống items.\r
- \`orphanRemoval = true\`: xóa item khỏi list sẽ xóa trong DB.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Lazy vs Eager?**\r
> "Lazy chỉ load dữ liệu quan hệ khi gọi getter, giúp tránh load thừa. Eager load ngay khi load entity, dễ gây chậm nếu quan hệ lớn. Mặc định ManyToOne là Eager, nhưng mình thường đổi thành Lazy để tối ưu."\r
\r
**Câu: N+1 query là gì?**\r
> "N+1 là khi load N entity rồi trong vòng lặp lại gọi thêm N câu query cho quan hệ. Ví dụ load list Product rồi gọi product.getCategory() sẽ sinh ra nhiều query. Cách xử lý là dùng JOIN FETCH hoặc EntityGraph để load trong 1 query."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 10\r
\r
- [ ] Phân biệt JPA, Hibernate, Spring Data JPA.\r
- [ ] Viết Entity cơ bản.\r
- [ ] Phân biệt Lazy vs Eager.\r
- [ ] Giải thích N+1 query và cách fix.\r
- [ ] Giải thích Persistence Context & Dirty Checking.\r
- [ ] Viết Spring Data JPA Repository.\r
- [ ] Biết Cascade và Orphan Removal.`,checklist:[`Phân biệt JPA, Hibernate, Spring Data JPA.`,`Viết Entity cơ bản.`,`Phân biệt Lazy vs Eager.`,`Giải thích N+1 query và cách fix.`,`Giải thích Persistence Context & Dirty Checking.`,`Viết Spring Data JPA Repository.`,`Biết Cascade và Orphan Removal.`]},{file:`Phan11_Transaction_CheatSheet.md`,title:`📄 📄 PHẦN 11 — TRANSACTION`,content:`# 📄 PHẦN 11 — TRANSACTION \r
\r
---\r
\r
## 1. @Transactional\r
\r
Đánh dấu method/class để Spring quản lý transaction. Tự động \`begin\`, \`commit\`, hoặc \`rollback\` khi có RuntimeException.\r
\r
\`\`\`java\r
@Service\r
public class OrderService {\r
\r
    @Transactional\r
    public void createOrder(OrderRequest request) {\r
        // nếu có RuntimeException ở đây, toàn bộ sẽ rollback\r
        orderRepo.save(order);\r
        paymentService.charge(order);\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 2. Propagation\r
\r
| Propagation | Ý nghĩa |\r
|---|---|\r
| \`REQUIRED\` (mặc định) | Dùng transaction hiện tại nếu có, nếu không tạo mới |\r
| \`REQUIRES_NEW\` | Luôn tạo transaction mới, suspend transaction cũ |\r
| \`SUPPORTS\` | Dùng transaction nếu có, không bắt buộc |\r
| \`MANDATORY\` | Bắt buộc phải có transaction cha, nếu không lỗi |\r
| \`NEVER\` | Không được có transaction |\r
| \`NOT_SUPPORTED\` | Chạy không transaction, suspend transaction cha |\r
| \`NESTED\` | Transaction lồng (savepoint) |\r
\r
**Ví dụ:**\r
\`\`\`java\r
@Transactional(propagation = Propagation.REQUIRES_NEW)\r
public void logAudit(Audit audit) {\r
    auditRepo.save(audit);  // luôn lưu dù method cha lỗi\r
}\r
\`\`\`\r
\r
---\r
\r
## 3. Isolation\r
\r
\`\`\`java\r
@Transactional(isolation = Isolation.READ_COMMITTED)\r
\`\`\`\r
\r
> Xem chi tiết ở PHẦN 6 — SQL & Database.\r
\r
---\r
\r
## 4. Rollback Behavior\r
\r
- Mặc định rollback khi **RuntimeException** hoặc **Error**.\r
- **Không rollback** với **Checked Exception**.\r
- Có thể tùy chỉnh:\r
\`\`\`java\r
@Transactional(rollbackFor = SQLException.class,\r
               noRollbackFor = IllegalStateException.class)\r
\`\`\`\r
\r
---\r
\r
## 5. @Transactional trong class vs method\r
\r
- Đặt trên class → áp dụng cho tất cả public methods.\r
- Đặt trên method → ghi đè class-level.\r
\r
---\r
\r
## 6. Lưu ý quan trọng\r
\r
- \`@Transactional\` chỉ hoạt động khi method được gọi **từ bên ngoài class** (proxy).\r
- Gọi method có \`@Transactional\` từ chính trong class → không có hiệu lực.\r
\r
**Ví dụ lỗi:**\r
\`\`\`java\r
@Service\r
public class OrderService {\r
    public void process() {\r
        createOrder();  // ❌ @Transactional không hoạt động do self-invocation\r
    }\r
\r
    @Transactional\r
    public void createOrder() { ... }\r
}\r
\`\`\`\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: @Transactional propagation?**\r
> "REQUIRED là mặc định, dùng transaction hiện có hoặc tạo mới. REQUIRES_NEW luôn tạo transaction mới, rất hữu ích cho audit log hoặc notification vì dù method cha lỗi thì dữ liệu vẫn được lưu."\r
\r
**Câu: Tại sao @Transactional không hoạt động khi gọi từ chính class?**\r
> "Vì Spring dùng proxy để wrap bean. Khi gọi từ bên ngoài, proxy mới can thiệp và mở transaction. Khi gọi từ bên trong class, proxy không bắt được, nên @Transactional bị bỏ qua."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 11\r
\r
- [ ] Biết cách dùng @Transactional.\r
- [ ] Phân biệt các propagation (REQUIRED, REQUIRES_NEW).\r
- [ ] Biết isolation level.\r
- [ ] Biết rollback mặc định và cách tùy chỉnh.\r
- [ ] Biết self-invocation problem.\r
- [ ] Biết khi nào dùng REQUIRES_NEW cho audit/log.`,checklist:[`Biết cách dùng @Transactional.`,`Phân biệt các propagation (REQUIRED, REQUIRES_NEW).`,`Biết isolation level.`,`Biết rollback mặc định và cách tùy chỉnh.`,`Biết self-invocation problem.`,`Biết khi nào dùng REQUIRES_NEW cho audit/log.`]},{file:`Phan12_Security_JWT_CheatSheet.md`,title:`📄 📄 PHẦN 12 — SECURITY & JWT`,content:`# 📄 PHẦN 12 — SECURITY & JWT \r
\r
---\r
\r
## 1. Authentication vs Authorization\r
\r
| Authentication | Authorization |\r
|---|---|\r
| Xác thực "bạn là ai" | Phân quyền "bạn được làm gì" |\r
| Login, password, token | Role, permission |\r
\r
**Ví dụ:**\r
- Login thành công → Authentication.\r
- ADMIN có quyền xóa user, USER không có → Authorization.\r
\r
---\r
\r
## 2. JWT (JSON Web Token)\r
\r
JWT gồm 3 phần:\r
\`\`\`\r
header.payload.signature\r
\`\`\`\r
\r
| Phần | Nội dung |\r
|---|---|\r
| **Header** | Algorithm, token type |\r
| **Payload** | Claims: userId, roles, exp, iat |\r
| **Signature** | Mã hóa header + payload bằng secret key |\r
\r
**Ví dụ token:**\r
\`\`\`\r
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGVzIjpbIlVTRVIiXX0.signature\r
\`\`\`\r
\r
---\r
\r
## 3. JWT Flow\r
\r
\`\`\`\r
Client → POST /login (username/password)\r
Server → trả JWT\r
Client → gửi JWT trong Header: Authorization: Bearer <token>\r
Server → verify signature → lấy user info từ claims\r
\`\`\`\r
\r
---\r
\r
## 4. Spring Security Filter Chain\r
\r
\`\`\`\r
Request → JWT Filter → Authentication → Authorization → Controller\r
\`\`\`\r
\r
**Cấu hình cơ bản:**\r
\`\`\`java\r
@Configuration\r
@EnableWebSecurity\r
public class SecurityConfig {\r
\r
    @Bean\r
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\r
        http\r
            .csrf(csrf -> csrf.disable())\r
            .authorizeHttpRequests(auth -> auth\r
                .requestMatchers("/api/auth/**").permitAll()\r
                .requestMatchers("/api/admin/**").hasRole("ADMIN")\r
                .anyRequest().authenticated()\r
            )\r
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\r
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);\r
        return http.build();\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 5. JWT Filter đọc token\r
\r
\`\`\`java\r
@Component\r
public class JwtFilter extends OncePerRequestFilter {\r
\r
    @Override\r
    protected void doFilterInternal(HttpServletRequest request,\r
                                    HttpServletResponse response,\r
                                    FilterChain chain) throws ServletException, IOException {\r
        String header = request.getHeader("Authorization");\r
        if (header != null && header.startsWith("Bearer ")) {\r
            String token = header.substring(7);\r
            // verify token, extract username/roles\r
            // set Authentication vào SecurityContext\r
        }\r
        chain.doFilter(request, response);\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 6. Role-based Authorization\r
\r
\`\`\`java\r
@RestController\r
@RequestMapping("/api/admin")\r
public class AdminController {\r
\r
    @PreAuthorize("hasRole('ADMIN')")\r
    @DeleteMapping("/users/{id}")\r
    public void deleteUser(@PathVariable Long id) { ... }\r
}\r
\`\`\`\r
\r
> Cần bật \`@EnableMethodSecurity\`.\r
\r
---\r
\r
## 7. Lưu ý bảo mật\r
\r
- JWT không thể thu hồi sớm → cần short expiry + refresh token.\r
- Bảo vệ secret key, không commit lên git.\r
- Không lưu thông tin nhạy cảm trong payload (vì base64 decode được).\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Authentication vs Authorization?**\r
> "Authentication là xác thực ngườ dùng là ai, ví dụ đăng nhập. Authorization là kiểm tra ngườ dùng có quyền gì, ví dụ ADMIN mới được xóa user còn USER thì không."\r
\r
**Câu: JWT hoạt động thế nào?**\r
> "JWT gồm header, payload, signature. Server ký bằng secret. Sau login, server trả token, client gửi kèm trong header Authorization: Bearer token. Server verify signature và đọc claims để biết user và quyền."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 12\r
\r
- [ ] Phân biệt Authentication vs Authorization.\r
- [ ] Giải thích cấu trúc JWT.\r
- [ ] Nói được JWT flow.\r
- [ ] Biết Spring Security Filter Chain.\r
- [ ] Biết cấu hình permitAll, hasRole.\r
- [ ] Biết @PreAuthorize.\r
- [ ] Biết lưu ý bảo mật JWT.`,checklist:[`Phân biệt Authentication vs Authorization.`,`Giải thích cấu trúc JWT.`,`Nói được JWT flow.`,`Biết Spring Security Filter Chain.`,`Biết cấu hình permitAll, hasRole.`,`Biết @PreAuthorize.`,`Biết lưu ý bảo mật JWT.`]},{file:`Phan13_Docker_CheatSheet.md`,title:`📄 📄 PHẦN 13 — DOCKER`,content:`# 📄 PHẦN 13 — DOCKER \r
\r
---\r
\r
## 1. Image vs Container\r
\r
| **Image** | **Container** |\r
|---|---|\r
| Template read-only chứa app + dependencies | Instance đang chạy của image |\r
| Giống class | Giống object |\r
| Lưu trữ được, push/pull từ registry | Chạy, dừng, xóa |\r
\r
---\r
\r
## 2. Dockerfile\r
\r
\`\`\`dockerfile\r
FROM eclipse-temurin:17-jdk-alpine\r
WORKDIR /app\r
COPY target/app.jar app.jar\r
EXPOSE 8080\r
ENTRYPOINT ["java", "-jar", "app.jar"]\r
\`\`\`\r
\r
**Giải thích:**\r
- \`FROM\`: base image.\r
- \`WORKDIR\`: thư mục làm việc.\r
- \`COPY\`: copy file vào image.\r
- \`EXPOSE\`: cổng lắng nghe.\r
- \`ENTRYPOINT\`: lệnh chạy khi container khởi động.\r
\r
---\r
\r
## 3. Docker Compose\r
\r
\`\`\`yaml\r
version: '3.8'\r
services:\r
  app:\r
    build: .\r
    ports:\r
      - "8080:8080"\r
    environment:\r
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/db\r
    depends_on:\r
      - db\r
\r
  db:\r
    image: mysql:8\r
    environment:\r
      MYSQL_ROOT_PASSWORD: secret\r
      MYSQL_DATABASE: db\r
    ports:\r
      - "3306:3306"\r
\`\`\`\r
\r
---\r
\r
## 4. Lệnh Docker thường dùng\r
\r
\`\`\`bash\r
docker build -t myapp:1.0 .\r
docker run -p 8080:8080 myapp:1.0\r
docker ps\r
docker stop <container_id>\r
docker rm <container_id>\r
docker images\r
\`\`\`\r
\r
---\r
\r
## 5. Tại sao dùng Docker?\r
\r
- Đóng gói app + môi trường chạy.\r
- Chạy giống nhau ở dev, test, production.\r
- Dễ scale, triển khai.\r
\r
---\r
\r
## 6. Container Registry\r
\r
Nơi lưu Docker image:\r
- Docker Hub.\r
- Amazon ECR.\r
- GitHub Container Registry.\r
- Private registry.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Docker Image vs Container?**\r
> "Image là template read-only chứa ứng dụng và dependencies. Container là instance đang chạy của image. Một image có thể tạo nhiều container."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 13\r
\r
- [ ] Phân biệt Image vs Container.\r
- [ ] Viết Dockerfile cơ bản.\r
- [ ] Biết Docker Compose.\r
- [ ] Biết các lệnh Docker thường dùng.\r
- [ ] Giải thích lợi ích Docker.\r
- [ ] Biết Container Registry.`,checklist:[`Phân biệt Image vs Container.`,`Viết Dockerfile cơ bản.`,`Biết Docker Compose.`,`Biết các lệnh Docker thường dùng.`,`Giải thích lợi ích Docker.`,`Biết Container Registry.`]},{file:`Phan14_Kafka_CheatSheet.md`,title:`📄 📄 PHẦN 14 — KAFKA`,content:`# 📄 PHẦN 14 — KAFKA \r
\r
---\r
\r
## 1. Kafka là gì?\r
\r
Hệ thống **message broker phân tán**, dùng để streaming dữ liệu real-time theo mô hình publish-subscribe.\r
\r
---\r
\r
## 2. Core Concepts\r
\r
| Khái niệm | Ý nghĩa |\r
|---|---|\r
| **Producer** | Gửi message |\r
| **Consumer** | Nhận message |\r
| **Broker** | Server Kafka lưu và phân phối message |\r
| **Topic** | Kênh phân loại message |\r
| **Partition** | Phân đoạn trong topic, cho phép parallel |\r
| **Offset** | Vị trí message trong partition |\r
| **Consumer Group** | Nhóm consumer chia sẻ load |\r
\r
---\r
\r
## 3. Producer & Consumer (Spring Kafka)\r
\r
**Dependency:**\r
\`\`\`xml\r
<dependency>\r
    <groupId>org.springframework.kafka</groupId>\r
    <artifactId>spring-kafka</artifactId>\r
</dependency>\r
\`\`\`\r
\r
**Producer:**\r
\`\`\`java\r
@Service\r
public class KafkaProducer {\r
    @Autowired private KafkaTemplate<String, String> kafkaTemplate;\r
\r
    public void send(String topic, String message) {\r
        kafkaTemplate.send(topic, message);\r
    }\r
}\r
\`\`\`\r
\r
**Consumer:**\r
\`\`\`java\r
@Component\r
public class KafkaConsumer {\r
    @KafkaListener(topics = "orders", groupId = "order-group")\r
    public void listen(String message) {\r
        System.out.println("Received: " + message);\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 4. Khi nào dùng Kafka?\r
\r
- Xử lý event-driven.\r
- Giải coupling giữa các service.\r
- Log aggregation.\r
- Real-time analytics.\r
- Buffer khi traffic cao.\r
\r
---\r
\r
## 5. At-least-once vs At-most-once vs Exactly-once\r
\r
| Semantics | Mô tả |\r
|---|---|\r
| At-most-once | Có thể mất message |\r
| At-least-once | Có thể trùng, nhưng không mất |\r
| Exactly-once | Không mất, không trùng (khó, cần idempotency) |\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Kafka dùng để làm gì?**\r
> "Kafka là message broker phân tán, giúp các service giao tiếp bất đồng bộ qua topic. Ví dụ service Order gửi event order-created, các service Inventory, Notification subscribe để xử lý. Giúp giảm coupling và chịu tải cao."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 14\r
\r
- [ ] Giải thích Kafka là gì.\r
- [ ] Biết Producer, Consumer, Topic, Partition, Offset, Consumer Group.\r
- [ ] Viết Producer & Consumer cơ bản với Spring Kafka.\r
- [ ] Biết use case của Kafka.\r
- [ ] Phân biệt delivery semantics.`,checklist:[`Giải thích Kafka là gì.`,`Biết Producer, Consumer, Topic, Partition, Offset, Consumer Group.`,`Viết Producer & Consumer cơ bản với Spring Kafka.`,`Biết use case của Kafka.`,`Phân biệt delivery semantics.`]},{file:`Phan15_AWS_CheatSheet.md`,title:`📄 📄 PHẦN 15 — AWS`,content:`# 📄 PHẦN 15 — AWS \r
\r
---\r
\r
## 1. Các dịch vụ AWS phổ biến\r
\r
| Dịch vụ | Dùng để |\r
|---|---|\r
| **EC2** | Máy chủ ảo |\r
| **S3** | Lưu trữ object (file, backup, static assets) |\r
| **RDS** | Database managed (MySQL, PostgreSQL) |\r
| **ElastiCache** | Managed Redis/Memcached |\r
| **SQS** | Message queue |\r
| **SNS** | Push notification / pub-sub |\r
| **Lambda** | Serverless function |\r
| **CloudWatch** | Giám sát log, metric |\r
| **IAM** | Quản lý user, role, permission |\r
| **VPC** | Mạng riêng ảo |\r
| **ELB / ALB** | Load balancer |\r
| **EKS / ECS** | Chạy container / Kubernetes |\r
| **Route 53** | DNS |\r
\r
---\r
\r
## 2. EC2 vs ECS vs EKS\r
\r
| | EC2 | ECS | EKS |\r
|---|---|---|---|\r
| Quản lý | Tự quản lý server | Container managed service | Kubernetes managed |\r
| Scale | Tự cấu hình | Dễ scale container | Dễ scale, phức tạp hơn |\r
| Phù hợp | Legacy, cần kiểm soát cao | App container đơn giản | Microservices lớn |\r
\r
---\r
\r
## 3. S3\r
\r
- Object storage: file, image, backup.\r
- Bucket name globally unique.\r
- Storage classes: Standard, IA, Glacier.\r
- Có thể cấu hình public/private, versioning, lifecycle.\r
\r
---\r
\r
## 4. RDS\r
\r
- Managed relational database.\r
- Hỗ trợ MySQL, PostgreSQL, MariaDB, SQL Server, Oracle.\r
- Tự động backup, patching, multi-AZ failover.\r
- Read replica để scale read.\r
\r
---\r
\r
## 5. SQS\r
\r
- Message queue fully managed.\r
- Hàng đợi giúp giải coupling, xử lý async.\r
- Visibility timeout, dead-letter queue (DLQ).\r
\r
---\r
\r
## 6. IAM Best Practices\r
\r
- Không dùng root user cho daily tasks.\r
- Dùng IAM Role cho EC2/Lambda thay vì hardcode key.\r
- Áp dụng least privilege.\r
- Bật MFA.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: EC2 vs ECS?**\r
> "EC2 là máy chủ ảo, mình tự quản lý OS và app. ECS là dịch vụ quản lý container, mình chỉ cần định nghĩa task và service, AWS lo việc chạy container trên cluster."\r
\r
**Câu: Dùng S3 để làm gì?**\r
> "S3 là object storage dùng để lưu file, hình ảnh, backup. Nó durable, scalable, có nhiều storage class để tối ưu chi phí."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 15\r
\r
- [ ] Liệt kê các dịch vụ AWS phổ biến.\r
- [ ] Phân biệt EC2, ECS, EKS.\r
- [ ] Biết use case của S3, RDS, SQS.\r
- [ ] Biết IAM best practices.\r
- [ ] Giải thích high availability, multi-AZ, read replica.`,checklist:[`Liệt kê các dịch vụ AWS phổ biến.`,`Phân biệt EC2, ECS, EKS.`,`Biết use case của S3, RDS, SQS.`,`Biết IAM best practices.`,`Giải thích high availability, multi-AZ, read replica.`]},{file:`Phan16_CICD_CheatSheet.md`,title:`📄 📄 PHẦN 16 — CI/CD`,content:`# 📄 PHẦN 16 — CI/CD \r
\r
---\r
\r
## 1. CI/CD là gì?\r
\r
| CI (Continuous Integration) | CD (Continuous Delivery/Deployment) |\r
|---|---|\r
| Tự động build, test khi code thay đổi | Tự động triển khai lên môi trường target |\r
\r
---\r
\r
## 2. Pipeline cơ bản\r
\r
\`\`\`\r
Source Code → Build → Test → Package → Deploy\r
   (push)    (mvn)  (junit) (docker)  (ecs/k8s)\r
\`\`\`\r
\r
---\r
\r
## 3. Công cụ phổ biến\r
\r
| Công cụ | Mô tả |\r
|---|---|\r
| **GitHub Actions** | CI/CD tích hợp GitHub |\r
| **GitLab CI** | CI/CD tích hợp GitLab |\r
| **Jenkins** | Self-hosted, linh hoạt |\r
| **CircleCI / Travis** | Cloud CI/CD |\r
| **ArgoCD** | GitOps continuous deployment cho K8s |\r
\r
---\r
\r
## 4. GitHub Actions cơ bản\r
\r
\`\`\`yaml\r
name: Java CI\r
on:\r
  push:\r
    branches: [main]\r
\r
jobs:\r
  build:\r
    runs-on: ubuntu-latest\r
    steps:\r
      - uses: actions/checkout@v4\r
      - uses: actions/setup-java@v4\r
        with:\r
          java-version: '17'\r
          distribution: 'temurin'\r
      - run: mvn clean test\r
      - run: mvn package -DskipTests\r
\`\`\`\r
\r
---\r
\r
## 5. Docker trong CI/CD\r
\r
\`\`\`yaml\r
- name: Build Docker image\r
  run: docker build -t myapp:\${{ github.sha }} .\r
\r
- name: Push to ECR\r
  run: |\r
    aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>\r
    docker push myapp:\${{ github.sha }}\r
\`\`\`\r
\r
---\r
\r
## 6. CI/CD Best Practices\r
\r
- Chạy unit test trước khi merge.\r
- Không commit secret vào repo.\r
- Build once, deploy many (cùng image đến nhiều môi trường).\r
- Phân biệt staging và production.\r
- Rollback nhanh khi lỗi.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: CI/CD là gì?**\r
> "CI là tự động build và test khi developer push code. CD là tự động triển khai lên staging hoặc production. Ví dụ push lên main thì GitHub Actions chạy mvn test, build Docker image, push lên ECR và deploy lên ECS."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 16\r
\r
- [ ] Giải thích CI và CD.\r
- [ ] Biết các công cụ CI/CD.\r
- [ ] Viết pipeline cơ bản với GitHub Actions.\r
- [ ] Biết tích hợp Docker trong CI/CD.\r
- [ ] Biết CI/CD best practices.`,checklist:[`Giải thích CI và CD.`,`Biết các công cụ CI/CD.`,`Viết pipeline cơ bản với GitHub Actions.`,`Biết tích hợp Docker trong CI/CD.`,`Biết CI/CD best practices.`]},{file:`Phan17_Microservices_CheatSheet.md`,title:`📄 📄 PHẦN 17 — MICROSERVICES`,content:`# 📄 PHẦN 17 — MICROSERVICES \r
\r
---\r
\r
## 1. Microservices là gì?\r
\r
Kiến trúc chia ứng dụng thành nhiều service nhỏ, độc lập, mỗi service đảm nhận một business capability.\r
\r
---\r
\r
## 2. Monolith vs Microservices\r
\r
| Monolith | Microservices |\r
|---|---|\r
| Một codebase duy nhất | Nhiều service độc lập |\r
| Deploy toàn bộ cùng lúc | Deploy từng service |\r
| Scale cả app | Scale từng phần |\r
| Đơn giản khi nhỏ | Phức tạp hơn, cần quản lý nhiều service |\r
\r
---\r
\r
## 3. Giao tiếp giữa các service\r
\r
- **Synchronous:** REST, gRPC.\r
- **Asynchronous:** Message queue (Kafka, RabbitMQ, SQS).\r
\r
> Ưu tiên async để giảm coupling và tăng khả năng chịu lỗi.\r
\r
---\r
\r
## 4. Service Discovery\r
\r
Các service cần tìm địa chỉ nhau động.\r
\r
- **Netflix Eureka**\r
- **Consul**\r
- **Kubernetes DNS/Service**\r
\r
---\r
\r
## 5. API Gateway\r
\r
- Điểm vào duy nhất cho client.\r
- Xử lý authentication, rate limiting, routing, load balancing.\r
- Công cụ: Spring Cloud Gateway, Kong, AWS API Gateway, NGINX.\r
\r
---\r
\r
## 6. Resilience Patterns\r
\r
| Pattern | Mục đích |\r
|---|---|\r
| **Circuit Breaker** | Ngắt kết nối khi service xuống, tránh cascade failure |\r
| **Retry** | Thử lại khi lỗi tạm thờ |\r
| **Timeout** | Giới hạn thờ gian chờ |\r
| **Fallback** | Trả về giá trị dự phòng |\r
| **Bulkhead** | Giới hạn tài nguyên cho từng service |\r
| **Rate Limiter** | Giới hạn số request |\r
\r
**Resilience4j:**\r
\`\`\`java\r
@CircuitBreaker(name = "orderService", fallbackMethod = "fallback")\r
public Order getOrder(Long id) { ... }\r
\r
public Order fallback(Long id, Exception ex) {\r
    return Order.empty();\r
}\r
\`\`\`\r
\r
---\r
\r
## 7. Distributed Tracing\r
\r
Theo dõi request đi qua nhiều service.\r
\r
- **Sleuth + Zipkin**\r
- **OpenTelemetry + Jaeger**\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Ưu nhược điểm Microservices?**\r
> "Microservices giúp scale từng phần, deploy độc lập, team tự chủ. Nhược điểm là phức tạp: cần quản lý giao tiếp, transaction phân tán, logging, monitoring, service discovery."\r
\r
**Câu: Circuit Breaker là gì?**\r
> "Khi service gọi service khác liên tục lỗi, circuit breaker chuyển sang trạng thái OPEN để không gọi nữa, tránh cascade failure. Sau một thờ gian thử HALF-OPEN, nếu OK thì CLOSE lại."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 17\r
\r
- [ ] Giải thích Microservices.\r
- [ ] Phân biệt Monolith vs Microservices.\r
- [ ] Biết cách service giao tiếp sync/async.\r
- [ ] Biết Service Discovery.\r
- [ ] Biết API Gateway.\r
- [ ] Biết Resilience Patterns: Circuit Breaker, Retry, Fallback.\r
- [ ] Biết Distributed Tracing.`,checklist:[`Giải thích Microservices.`,`Phân biệt Monolith vs Microservices.`,`Biết cách service giao tiếp sync/async.`,`Biết Service Discovery.`,`Biết API Gateway.`,`Biết Resilience Patterns: Circuit Breaker, Retry, Fallback.`,`Biết Distributed Tracing.`]},{file:`Phan18_SystemDesign_CheatSheet.md`,title:`📄 📄 PHẦN 18 — SYSTEM DESIGN`,content:`# 📄 PHẦN 18 — SYSTEM DESIGN \r
\r
---\r
\r
## 1. Non-functional Requirements\r
\r
| Yêu cầu | Ý nghĩa |\r
|---|---|\r
| **Scalability** | Khả năng mở rộng khi tải tăng |\r
| **Availability** | Hệ thống uptime cao |\r
| **Reliability** | Hoạt động đúng, ít lỗi |\r
| **Latency** | Thờ gian phản hồi thấp |\r
| **Consistency** | Dữ liệu đồng nhất |\r
| **Maintainability** | Dễ bảo trì, mở rộng |\r
\r
---\r
\r
## 2. Scale\r
\r
- **Vertical scale:** Nâng cấp CPU/RAM máy chủ.\r
- **Horizontal scale:** Thêm nhiều máy chủ, dùng load balancer.\r
\r
> Horizontal scale phổ biến hơn vì linh hoạt và rẻ hơn.\r
\r
---\r
\r
## 3. Load Balancer\r
\r
Phân phối request đến nhiều server.\r
\r
- **L4 (Transport):** dựa trên IP/port.\r
- **L7 (Application):** dựa trên URL, header, cookie.\r
\r
Công cụ: NGINX, HAProxy, AWS ALB.\r
\r
---\r
\r
## 4. Caching\r
\r
Lưu dữ liệu hot để giảm tải DB.\r
\r
| Cache | Use case |\r
|---|---|\r
| **Redis** | Distributed cache, session, rate limit |\r
| **CDN** | Static assets, media |\r
| **Application cache** | Local cache (Caffeine, Guava) |\r
\r
> Cache Aside: app đọc cache trước, nếu miss thì đọc DB và ghi lại cache.\r
\r
---\r
\r
## 5. Database Scaling\r
\r
- **Read replica:** nhiều DB slave để đọc.\r
- **Sharding:** chia dữ liệu theo key (ví dụ user_id).\r
- **Partitioning:** chia bảng theo range/hash.\r
\r
---\r
\r
## 6. CAP Theorem\r
\r
Hệ thống phân tán chỉ có thể đảm bảo 2 trong 3:\r
\r
| C | Consistency | Dữ liệu đồng nhất mọi node |\r
| A | Availability | Luôn phản hồi |\r
| P | Partition Tolerance | Chịu được mất kết nối giữa các node |\r
\r
> Trong thực tế thường chọn CP hoặc AP.\r
\r
---\r
\r
## 7. Rate Limiting\r
\r
Giới hạn số request từ một client trong khoảng thờ gian.\r
\r
- **Fixed window:** dễ nhưng có burst ở boundary.\r
- **Sliding window:** chính xác hơn.\r
- **Token bucket / Leaky bucket:** linh hoạt.\r
\r
---\r
\r
## 8. Design URL Shortener / Rate Limiter\r
\r
**URL Shortener:**\r
\`\`\`\r
POST /shorten {url} → {shortCode}\r
GET /{shortCode} → redirect\r
\`\`\`\r
- Hash original URL → base62.\r
- Lưu mapping DB.\r
- Cache popular URLs.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Làm sao scale hệ thống?**\r
> "Đầu tiên dùng load balancer phân phối request đến nhiều app server. Thêm caching Redis cho dữ liệu hot. Dùng read replica cho database để giảm tải đọc. Nếu cần, sharding database theo user_id. Cuối cùng theo dõi metric qua monitoring."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 18\r
\r
- [ ] Biết các non-functional requirements.\r
- [ ] Phân biệt vertical vs horizontal scale.\r
- [ ] Giải thích load balancer.\r
- [ ] Biết caching strategies.\r
- [ ] Biết database scaling.\r
- [ ] Giải thích CAP theorem.\r
- [ ] Biết rate limiting.\r
- [ ] Thiết kế đượ1 hệ thống đơn giản (URL shortener).`,checklist:[`Biết các non-functional requirements.`,`Phân biệt vertical vs horizontal scale.`,`Giải thích load balancer.`,`Biết caching strategies.`,`Biết database scaling.`,`Giải thích CAP theorem.`,`Biết rate limiting.`,`Thiết kế đượ1 hệ thống đơn giản (URL shortener).`]},{file:`Phan19_Project_Mau_CheatSheet.md`,title:`📄 📄 PHẦN 19 — PROJECT MẪU`,content:`# 📄 PHẦN 19 — PROJECT MẪU \r
\r
---\r
\r
## 1. Mô tả project\r
\r
**Hệ thống quản lý đơn hàng (Order Management System):**\r
- User đăng ký/đăng nhập (JWT).\r
- Tạo đơn hàng, xem lịch sử.\r
- Admin quản lý sản phẩm, đơn hàng.\r
- Thông báo qua Kafka khi đơn hàng mới tạo.\r
- Deploy bằng Docker + CI/CD.\r
\r
---\r
\r
## 2. Tech Stack\r
\r
| Tầng | Công nghệ |\r
|---|---|\r
| Backend | Java 17, Spring Boot |\r
| Database | PostgreSQL |\r
| Cache | Redis |\r
| Message Broker | Kafka |\r
| Auth | JWT, Spring Security |\r
| Build | Maven |\r
| Container | Docker, Docker Compose |\r
| Cloud | AWS EC2/ECS, RDS, S3, SQS |\r
| CI/CD | GitHub Actions |\r
\r
---\r
\r
## 3. Cấu trúc project\r
\r
\`\`\`\r
order-service/\r
├── src/main/java/com/example/order/\r
│   ├── controller/\r
│   ├── service/\r
│   ├── repository/\r
│   ├── entity/\r
│   ├── dto/\r
│   ├── mapper/\r
│   ├── config/\r
│   ├── exception/\r
│   └── security/\r
├── src/main/resources/\r
│   └── application.yml\r
├── Dockerfile\r
├── docker-compose.yml\r
└── .github/workflows/ci.yml\r
\`\`\`\r
\r
---\r
\r
## 4. Tính năng nổi bật để nói trong phỏng vấn\r
\r
- Phân quyền ROLE_USER / ROLE_ADMIN.\r
- Validation input với Jakarta Validation.\r
- Xử lý exception chung bằng \`@RestControllerAdvice\`.\r
- Gửi event \`OrderCreated\` lên Kafka.\r
- Consumer gửi email thông báo.\r
- Cache danh sách sản phẩm với Redis.\r
- Unit test repository, service với JUnit + Mockito.\r
\r
---\r
\r
## 5. Cách trình bày project\r
\r
1. **Mục đích:** Hệ thống quản lý đơn hàng.\r
2. **Tech stack:** Java, Spring Boot, PostgreSQL, Redis, Kafka.\r
3. **Vai trò:** Backend developer.\r
4. **Tính năng chính:** CRUD, auth, async notification, caching.\r
5. **Thách thức:** N+1 query, concurrency, idempotency.\r
6. **Kết quả:** Hệ thống chạy ổn định, dễ mở rộng.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: Giới thiệu project của bạn?**\r
> "Em làm hệ thống quản lý đơn hàng bằng Spring Boot. User đăng nhập bằng JWT, tạo đơn hàng. Khi đơn hàng được tạo, service gửi event lên Kafka, notification service nhận và gửi email. Dùng Redis cache sản phẩm, PostgreSQL làm chính, Docker để triển khai. Em viết unit test cho service và repository."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 19\r
\r
- [ ] Chuẩn bị mô tả project rõ ràng.\r
- [ ] Liệt kê tech stack hợp lý.\r
- [ ] Trình bày vai trò cá nhân.\r
- [ ] Nêu tính năng nổi bật.\r
- [ ] Chuẩn bị câu trả lởi ngắn gọn 60 giây.`,checklist:[`Chuẩn bị mô tả project rõ ràng.`,`Liệt kê tech stack hợp lý.`,`Trình bày vai trò cá nhân.`,`Nêu tính năng nổi bật.`,`Chuẩn bị câu trả lởi ngắn gọn 60 giây.`]},{file:`Phan20_Cau_Hoi_Tinh_Huong_CheatSheet.md`,title:`📄 📄 PHẦN 20 — CÂU HỎI TÌNH HUỐNG`,content:`# 📄 PHẦN 20 — CÂU HỎI TÌNH HUỐNG \r
\r
---\r
\r
## 1. API chậm — debug thế nào?\r
\r
1. Kiểm tra log và metric (CloudWatch, Prometheus).\r
2. Xác định bottleneck: DB, network, external API.\r
3. Dùng APM (New Relic, Datadog) hoặc log thờ gian xử lý.\r
4. Kiểm tra N+1 query, thiếu index.\r
5. Kiểm tra external API timeout.\r
6. Scale hoặc cache nếu cần.\r
\r
---\r
\r
## 2. Production bug — xử lý thế nào?\r
\r
1. Không panic, reproduce lỗi ở local/staging.\r
2. Rollback nếu lỗi nghiêm trọng.\r
3. Tìm root cause qua log, trace.\r
4. Fix và test kỹ.\r
5. Deploy lại, monitor.\r
6. Viết post-mortem.\r
\r
---\r
\r
## 3. Xung đột code khi merge\r
\r
1. Hiểu rõ thay đổi của 2 branch.\r
2. Thảo luận với teammate nếu cùng sửa 1 chỗ.\r
3. Resolve conflict, giữ logic đúng.\r
4. Build và test lại.\r
5. Merge.\r
\r
---\r
\r
## 4. Làm việc với requirement không rõ\r
\r
1. Hỏi lại để làm rõ.\r
2. Xác nhận scope và acceptance criteria.\r
3. Làm prototype nếu cần.\r
4. Báo cáo tiến độ thường xuyên.\r
\r
---\r
\r
## 5. Deadlock trong database\r
\r
1. Phát hiện qua log.\r
2. Đảm bảo thứ tự lock nhất quán.\r
3. Giảm thờ gian transaction.\r
4. Dùng retry với exponential backoff.\r
\r
---\r
\r
## 6. Memory leak\r
\r
1. Monitor heap memory.\r
2. Dump heap (\`jmap -dump\`).\r
3. Phân tích bằng Eclipse MAT.\r
4. Tìm object không được giải phóng.\r
5. Fix: đóng resource, xóa reference, dùng weak reference.\r
\r
---\r
\r
## 7. Conflict với đồng nghiệp\r
\r
1. Lắng nghe quan điểm đối phương.\r
2. Trình bày lập trường dựa trên dữ liệu.\r
3. Tìm giải pháp win-win.\r
4. Nếu không thống nhất, nhờ lead/team quyết định.\r
\r
---\r
\r
## 💬 Câu trả lởi mẫu 60 giây\r
\r
**Câu: API chậm, bạn xử lý thế nào?**\r
> "Đầu tiên em kiểm tra log và metric để xác định bottleneck. Nếu là DB thì kiểm tra query, index, N+1. Nếu là external API thì kiểm tra timeout và circuit breaker. Nếu cần thì thêm cache hoặc scale. Cuối cùng verify hiệu năng sau fix."\r
\r
**Câu: Production có bug nghiêm trọng?**\r
> "Em sẽ rollback nếu cần để giảm ảnh hưởng. Sau đó reproduce ở local, phân tích log để tìm root cause, fix và test kỹ, deploy lại và monitor. Cuối cùng viết post-mortem để rút kinh nghiệm."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 20\r
\r
- [ ] Biết cách debug API chậm.\r
- [ ] Biết cách xử lý production bug.\r
- [ ] Biết cách resolve merge conflict.\r
- [ ] Biết xử lý requirement mơ hồ.\r
- [ ] Biết cách xử lý deadlock.\r
- [ ] Biết cách phân tích memory leak.\r
- [ ] Biết cách xử lý conflict trong team.`,checklist:[`Biết cách debug API chậm.`,`Biết cách xử lý production bug.`,`Biết cách resolve merge conflict.`,`Biết xử lý requirement mơ hồ.`,`Biết cách xử lý deadlock.`,`Biết cách phân tích memory leak.`,`Biết cách xử lý conflict trong team.`]},{file:`Phan21_100_Cau_Hoi_Tu_Kiem_Tra.md`,title:`📄 📄 PHẦN 21 — 100 CÂU HỎI TỰ KIỂM TRA`,content:"# 📄 PHẦN 21 — 100 CÂU HỎI TỰ KIỂM TRA\r\n\r\n---\r\n\r\nDùng danh sách này để tự đánh giá trình độ. Nếu trả lởi đượ dưới 70 câu, nên quay lại ôn các phần tương ứng.\r\n\r\n---\r\n\r\n## PHẦN 1 — Java Core\r\n\r\n1. Sự khác nhau giữa `==` và `.equals()`?\r\n2. `String` là immutable hay mutable? Tại sao?\r\n3. `StringBuilder` vs `StringBuffer`?\r\n4. `final`, `finally`, `finalize` khác nhau thế nào?\r\n5. `static` method có thể override không? Tại sao?\r\n6. `abstract class` vs `interface`?\r\n7. `HashMap` hoạt động như thế nào?\r\n8. `ArrayList` vs `LinkedList`?\r\n9. `Comparable` vs `Comparator`?\r\n10. `Iterator` vs `ListIterator`?\r\n11. Sự khác nhau giữa `throw` và `throws`?\r\n12. `checked exception` vs `unchecked exception`?\r\n13. `try-with-resources` dùng để làm gì?\r\n14. `Serializable` là gì?\r\n15. `volatile` keyword có tác dụng gì?\r\n\r\n## PHẦN 2 — Java 8+\r\n\r\n16. Lambda expression là gì?\r\n17. Functional interface là gì? Cho ví dụ.\r\n18. `Stream API` dùng để làm gì?\r\n19. `map()` vs `flatMap()`?\r\n20. `filter()`, `reduce()`, `collect()` dùng khi nào?\r\n21. `Optional` dùng để giải quyết vấn đề gì?\r\n22. Method reference có mấy loại?\r\n23. `default method` trong interface là gì?\r\n24. `CompletableFuture` dùng để làm gì?\r\n25. `Record` trong Java 14+ là gì?\r\n\r\n## PHẦN 3 — OOP & Design Patterns\r\n\r\n26. 4 tính chất của OOP?\r\n27. SOLID principles là gì? Giải thích từng chữ.\r\n28. Dependency Injection là gì?\r\n29. Singleton pattern là gì? Cách triển khai thread-safe?\r\n30. Factory pattern dùng khi nào?\r\n31. Strategy pattern là gì?\r\n32. Observer pattern là gì?\r\n33. Builder pattern dùng khi nào?\r\n34. Repository pattern là gì?\r\n35. MVC vs layered architecture?\r\n\r\n## PHẦN 4 — Multithreading\r\n\r\n36. `Process` vs `Thread`?\r\n37. `Runnable` vs `Callable`?\r\n38. `synchronized` keyword hoạt động thế nào?\r\n39. `ReentrantLock` khác gì `synchronized`?\r\n40. `ExecutorService` là gì?\r\n41. `ForkJoinPool` dùng khi nào?\r\n42. `CountDownLatch` vs `CyclicBarrier`?\r\n43. `ConcurrentHashMap` khác gì `HashTable`?\r\n44. Race condition là gì?\r\n45. Deadlock là gì? Cách tránh?\r\n\r\n## PHẦN 5 — SQL & Database\r\n\r\n46. ACID là gì?\r\n47. Index là gì? Tại sao cần index?\r\n48. Clustered index vs Non-clustered index?\r\n49. JOIN có mấy loại? Kể tên.\r\n50. `WHERE` vs `HAVING`?\r\n51. `DELETE` vs `TRUNCATE` vs `DROP`?\r\n52. Normalization là gì? Có mấy dạng chuẩn?\r\n53. N+1 query problem là gì? Cách giải quyết?\r\n54. Transaction isolation levels có mấy cấp?\r\n55. Optimistic locking vs Pessimistic locking?\r\n\r\n## PHẦN 6 — Spring Boot\r\n\r\n56. Spring Boot là gì? Lợi ích?\r\n57. `@SpringBootApplication` bao gồm những annotation nào?\r\n58. `@Component`, `@Service`, `@Repository`, `@Controller` khác nhau thế nào?\r\n59. `@Autowired` inject theo cách nào?\r\n60. `@Qualifier` dùng để làm gì?\r\n61. Spring Bean lifecycle?\r\n62. `@Value` và `@ConfigurationProperties` khác nhau?\r\n63. `@Transactional` hoạt động như thế nào?\r\n64. Spring AOP là gì? Dùng khi nào?\r\n65. Spring Boot Actuator dùng để làm gì?\r\n\r\n## PHẦN 7 — REST API\r\n\r\n66. RESTful API là gì?\r\n67. HTTP methods: GET, POST, PUT, DELETE, PATCH?\r\n68. HTTP status code: 200, 201, 204, 400, 401, 403, 404, 500?\r\n69. Idempotency là gì? Methods nào idempotent?\r\n70. `@RequestParam` vs `@PathVariable`?\r\n71. DTO là gì? Tại sao dùng DTO?\r\n72. `@Valid` và `@Validated` khác nhau?\r\n73. Global exception handling trong Spring?\r\n74. Pagination trong Spring Data JPA?\r\n75. Versioning API có những cách nào?\r\n\r\n## PHẦN 8 — JPA / Hibernate\r\n\r\n76. JPA vs Hibernate?\r\n77. `@Entity`, `@Table`, `@Id`, `@GeneratedValue`?\r\n78. `@OneToMany`, `@ManyToOne`, `@ManyToMany`?\r\n79. `FetchType.LAZY` vs `FetchType.EAGER`?\r\n80. `cascade` là gì? Các loại cascade?\r\n81. `orphanRemoval` là gì?\r\n82. `@Column`, `@JoinColumn`?\r\n83. JPQL vs native query?\r\n84. First-level cache vs second-level cache?\r\n85. `@Query` và `@Modifying`?\r\n\r\n## PHẦN 9 — Security & JWT\r\n\r\n86. Authentication vs Authorization?\r\n87. JWT gồm mấy phần?\r\n88. Cách bảo mật JWT?\r\n89. OAuth2 flow cơ bản?\r\n90. Spring Security filter chain?\r\n91. `BCryptPasswordEncoder` dùng để làm gì?\r\n92. CSRF là gì? Cách chống?\r\n93. CORS là gì? Cách cấu hình?\r\n94. HTTPS hoạt động như thế nào?\r\n95. Session-based auth vs Token-based auth?\r\n\r\n## PHẦN 10 — DevOps & Cloud\r\n\r\n96. Docker image vs container?\r\n97. Docker Compose dùng để làm gì?\r\n98. CI/CD là gì?\r\n99. Kafka dùng để làm gì?\r\n100. AWS EC2 vs ECS vs EKS?\r\n101. Load balancer L4 vs L7?\r\n102. Redis dùng để làm gì?\r\n103. CAP theorem là gì?\r\n104. Rate limiting là gì?\r\n105. Blue-green deployment là gì?\r\n\r\n---\r\n\r\n## ✅ CHECKLIST PHẦN 21\r\n\r\n- [ ] Trả lởi đượ ít nhất 70/105 câu.\r\n- [ ] Xác định đượ các chủ đề còn yếu.\r\n- [ ] Quay lại ôn lại các phần tương ứng.\r\n- [ ] Luyện nói câu trả lởi ngắn gọn rõ ràng.",checklist:[`Trả lởi đượ ít nhất 70/105 câu.`,`Xác định đượ các chủ đề còn yếu.`,`Quay lại ôn lại các phần tương ứng.`,`Luyện nói câu trả lởi ngắn gọn rõ ràng.`]},{file:`Phan21_100_Cau_Hoi_Tu_Kiem_Tra_Tra_Loi.md`,title:`📄 📄 PHẦN 21 — 100+ CÂU HỎI TỰ KIỂM TRA (CÓ ĐÁP ÁN)`,content:`# 📄 PHẦN 21 — 100+ CÂU HỎI TỰ KIỂM TRA (CÓ ĐÁP ÁN)\r
\r
---\r
\r
## PHẦN 1 — Java Core\r
\r
**1. Sự khác nhau giữa \`==\` và \`.equals()\`?**\r
> \`==\` so sánh reference (địa chỉ bộ nhớ) hoặc giá trị primitive. \`.equals()\` so sánh nội dung object, có thể override.\r
\r
**2. \`String\` là immutable hay mutable? Tại sao?**\r
> Immutable. Giúp thread-safe, tiết kiệm bộ nhớ nhờ string pool, và an toàn khi dùng làm key trong HashMap.\r
\r
**3. \`StringBuilder\` vs \`StringBuffer\`?**\r
> \`StringBuilder\` nhanh hơn nhưng không thread-safe. \`StringBuffer\` thread-safe nhờ \`synchronized\` nhưng chậm hơn.\r
\r
**4. \`final\`, \`finally\`, \`finalize\` khác nhau thế nào?**\r
> \`final\`: keyword khai báo hằng, class/method không override. \`finally\`: khối luôn chạy sau try-catch. \`finalize()\`: method GC gọi trước khi thu hồi object.\r
\r
**5. \`static\` method có thể override không? Tại sao?**\r
> Không. Static thuộc về class, không phải instance. Có thể "hide" bằng static method cùng tên ở subclass.\r
\r
**6. \`abstract class\` vs \`interface\`?**\r
> Abstract class có constructor, state, method cụ thể. Interface (Java 8+) có default/static methods. Class extends abstract class, implements interface.\r
\r
**7. \`HashMap\` hoạt động như thế nào?**\r
> Lưu entry dưới dạng key-value bucket dựa trên hashCode. Khi hash collision dùng linked list hoặc cây đỏ-đen (từ Java 8).\r
\r
**8. \`ArrayList\` vs \`LinkedList\`?**\r
> \`ArrayList\`: truy cập index nhanh O(1), chèn/xóa chậm O(n). \`LinkedList\`: chèn/xóa nhanh O(1), truy cập chậm O(n).\r
\r
**9. \`Comparable\` vs \`Comparator\`?**\r
> \`Comparable\` dùng để sắp xếp natural order trong class (\`compareTo\`). \`Comparator\` dùng để định nghĩa nhiều cách sắp xếp bên ngoài.\r
\r
**10. \`Iterator\` vs \`ListIterator\`?**\r
> \`Iterator\` duyệt 1 chiều, remove. \`ListIterator\` duyệt 2 chiều, add/set, chỉ dùng cho List.\r
\r
**11. Sự khác nhau giữa \`throw\` và \`throws\`?**\r
> \`throw\` ném exception. \`throws\` khai báo exception method có thể ném.\r
\r
**12. \`checked exception\` vs \`unchecked exception\`?**\r
> Checked: extends Exception, bắt buộc handle hoặc throws. Unchecked: extends RuntimeException, không bắt buộc.\r
\r
**13. \`try-with-resources\` dùng để làm gì?**\r
> Tự động đóng resource (Closeable/AutoCloseable) sau khối try, tránh leak.\r
\r
**14. \`Serializable\` là gì?**\r
> Interface đánh dấu object có thể serialize (chuyển object thành byte stream) để lưu trữ hoặc truyền tải.\r
\r
**15. \`volatile\` keyword có tác dụng gì?**\r
> Đảm bảo biến luôn đọc từ main memory, không dùng CPU cache. Không đảm bảo atomicity.\r
\r
---\r
\r
## PHẦN 2 — Java 8+\r
\r
**16. Lambda expression là gì?**\r
> Cách viết anonymous function ngắn gọn, dùng với functional interface. Ví dụ: \`list.forEach(x -> System.out.println(x))\`.\r
\r
**17. Functional interface là gì? Cho ví dụ.**\r
> Interface chỉ có 1 abstract method. Ví dụ: \`Runnable\`, \`Callable\`, \`Comparator\`, \`Predicate\`, \`Function\`, \`Consumer\`, \`Supplier\`.\r
\r
**18. \`Stream API\` dùng để làm gì?**\r
> Xử lý collection theo hướng functional, hỗ trợ filter, map, reduce, collect, lazy evaluation.\r
\r
**19. \`map()\` vs \`flatMap()\`?**\r
> \`map()\` biến đổi mỗi phần tử thành 1 giá trị. \`flatMap()\` biến đổi mỗi phần tử thành stream và "làm phẳng" thành 1 stream.\r
\r
**20. \`filter()\`, \`reduce()\`, \`collect()\` dùng khi nào?**\r
> \`filter()\`: lọc phần tử. \`reduce()\`: gộp thành 1 giá trị. \`collect()\`: gom kết quả vào collection.\r
\r
**21. \`Optional\` dùng để giải quyết vấn đề gì?**\r
> Tránh NullPointerException, buộc xử lý trường hợp value absent một cách rõ ràng.\r
\r
**22. Method reference có mấy loại?**\r
> 4 loại: static (\`Class::method\`), instance of object (\`obj::method\`), instance of class (\`Class::method\`), constructor (\`Class::new\`).\r
\r
**23. \`default method\` trong interface là gì?**\r
> Method có implementation trong interface, cho phép mở rộng interface mà không break class đã implement.\r
\r
**24. \`CompletableFuture\` dùng để làm gì?**\r
> Xử lý async programming, kết hợp nhiều future, xử lý callback mà không block thread.\r
\r
**25. \`Record\` trong Java 14+ là gì?**\r
> Class immutable tự động sinh constructor, getter, equals, hashCode, toString. Dùng cho data carrier.\r
\r
---\r
\r
## PHẦN 3 — OOP & Design Patterns\r
\r
**26. 4 tính chất của OOP?**\r
> Encapsulation, Inheritance, Polymorphism, Abstraction.\r
\r
**27. SOLID principles là gì?**\r
> S: Single Responsibility — 1 class 1 nhiệm vụ.\r
> O: Open/Closed — mở rộng, đóng sửa đổi.\r
> L: Liskov Substitution — subclass thay thế được base class.\r
> I: Interface Segregation — interface nhỏ, chuyên biệt.\r
> D: Dependency Inversion — phụ thuộc abstraction.\r
\r
**28. Dependency Injection là gì?**\r
> Cung cấp dependency từ bên ngoài thay vì class tự tạo. Giúp loose coupling, dễ test.\r
\r
**29. Singleton pattern là gì? Cách triển khai thread-safe?**\r
> Chỉ tạo 1 instance. Thread-safe bằng \`enum\`, hoặc \`synchronized\`, hoặc Bill Pugh Singleton (static inner class).\r
\r
**30. Factory pattern dùng khi nào?**\r
> Khi cần tạo object mà không expose logic khởi tạo, hoặc tạo object dựa trên điều kiện runtime.\r
\r
**31. Strategy pattern là gì?**\r
> Định nghĩa họ thuật toán, cho phép hoán đổi linh hoạt runtime.\r
\r
**32. Observer pattern là gì?**\r
> Một subject thông báo đến nhiều observer khi có thay đổi trạng thái.\r
\r
**33. Builder pattern dùng khi nào?**\r
> Khi object có nhiều thuộc tính, constructor quá dài, hoặc có tùy chọn optional.\r
\r
**34. Repository pattern là gì?**\r
> Tầng trung gian giữa business logic và data access, ẩn chi tiết persistence.\r
\r
**35. MVC vs layered architecture?**\r
> MVC chia thành Model-View-Controller. Layered architecture chia theo tầng: presentation, business, data access.\r
\r
---\r
\r
## PHẦN 4 — Multithreading\r
\r
**36. \`Process\` vs \`Thread\`?**\r
> Process là chương trình độc lập có bộ nhớ riêng. Thread là đơn vị thực thi trong process, chia sẻ bộ nhớ.\r
\r
**37. \`Runnable\` vs \`Callable\`?**\r
> \`Runnable\` không trả về kết quả, không throw checked exception. \`Callable\` trả về kết quả và có thể throw exception.\r
\r
**38. \`synchronized\` keyword hoạt động thế nào?**\r
> Khóa monitor của object/class, chỉ cho phép 1 thread vào critical section.\r
\r
**39. \`ReentrantLock\` khác gì \`synchronized\`?**\r
> ReentrantLock linh hoạt hơn: tryLock, lockInterruptibly, fair lock, nhiều condition variables. Cần unlock thủ công.\r
\r
**40. \`ExecutorService\` là gì?**\r
> Framework quản lý pool thread, submit task, quản lý lifecycle.\r
\r
**41. \`ForkJoinPool\` dùng khi nào?**\r
> Dùng cho divide-and-conquer task, ví dụ \`RecursiveTask\`, \`RecursiveAction\`, parallel streams.\r
\r
**42. \`CountDownLatch\` vs \`CyclicBarrier\`?**\r
> \`CountDownLatch\` chờ N event hoàn thành, không reset. \`CyclicBarrier\` chờ N thread gặp nhau tại barrier, có thể reuse.\r
\r
**43. \`ConcurrentHashMap\` khác gì \`HashTable\`?**\r
> \`ConcurrentHashMap\` lock ở mức bucket (Java 8 dùng CAS + synchronized), hiệu năng cao hơn. \`HashTable\` lock toàn bộ map.\r
\r
**44. Race condition là gì?**\r
> Nhiều thread truy cập/chỉnh sửa dữ liệu chia sẻ, kết quả phụ thuộc thứ tự thực thi.\r
\r
**45. Deadlock là gì? Cách tránh?**\r
> 2+ thread chờ lẫn nhau giữ tài nguyên. Tránh bằng cách định thứ tự lock nhất quán, dùng timeout, giảm phạm vi lock.\r
\r
---\r
\r
## PHẦN 5 — SQL & Database\r
\r
**46. ACID là gì?**\r
> Atomicity, Consistency, Isolation, Durability.\r
\r
**47. Index là gì? Tại sao cần index?**\r
> Cấu trúc dữ liệu giúp truy vấn nhanh hơn (thường là B-Tree). Giảm thờ gian tìm kiếm.\r
\r
**48. Clustered index vs Non-clustered index?**\r
> Clustered: dữ liệu vật lý sắp xếp theo index. Non-clustered: chỉ lưu con trỏ đến dữ liệu.\r
\r
**49. JOIN có mấy loại? Kể tên.**\r
> INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, SELF JOIN.\r
\r
**50. \`WHERE\` vs \`HAVING\`?**\r
> \`WHERE\` lọc trước khi group. \`HAVING\` lọc sau khi group, dùng với aggregate.\r
\r
**51. \`DELETE\` vs \`TRUNCATE\` vs \`DROP\`?**\r
> DELETE: xóa từng dòng, có thể rollback, chậm. TRUNCATE: xóa toàn bộ, nhanh, reset identity. DROP: xóa cả table.\r
\r
**52. Normalization là gì? Có mấy dạng chuẩn?**\r
> Chia nhỏ bảng để giảm redundancy. Các dạng: 1NF, 2NF, 3NF, BCNF, 4NF, 5NF.\r
\r
**53. N+1 query problem là gì? Cách giải quyết?**\r
> 1 query lấy parent + N query lấy child. Giải quyết bằng JOIN FETCH, Entity Graph, hoặc \`@BatchSize\`.\r
\r
**54. Transaction isolation levels có mấy cấp?**\r
> READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.\r
\r
**55. Optimistic locking vs Pessimistic locking?**\r
> Optimistic: kiểm tra version khi update. Pessimistic: khóa dòng ngay khi đọc.\r
\r
---\r
\r
## PHẦN 6 — Spring Boot\r
\r
**56. Spring Boot là gì? Lợi ích?**\r
> Framework giúp xây dựng ứng dụng Spring nhanh với auto-configuration, starter dependencies, embedded server.\r
\r
**57. \`@SpringBootApplication\` bao gồm những annotation nào?**\r
> \`@Configuration\`, \`@EnableAutoConfiguration\`, \`@ComponentScan\`.\r
\r
**58. \`@Component\`, \`@Service\`, \`@Repository\`, \`@Controller\` khác nhau thế nào?**\r
> Tất cả đều là stereotype. \`@Service\` đánh dấu business logic. \`@Repository\` có exception translation. \`@Controller\` xử lý request.\r
\r
**59. \`@Autowired\` inject theo cách nào?**\r
> Mặc định by type. Có thể kết hợp \`@Qualifier\` để by name.\r
\r
**60. \`@Qualifier\` dùng để làm gì?**\r
> Chỉ định bean cụ thể khi có nhiều bean cùng type.\r
\r
**61. Spring Bean lifecycle?**\r
> Instantiate → populate properties → aware interfaces → BeanPostProcessor before → init method → after → ready for use → destroy.\r
\r
**62. \`@Value\` và \`@ConfigurationProperties\` khác nhau?**\r
> \`@Value\` inject từng giá trị. \`@ConfigurationProperties\` bind nhiều giá trị có tiền tố vào POJO.\r
\r
**63. \`@Transactional\` hoạt động như thế nào?**\r
> Spring tạo proxy (JDK dynamic hoặc CGLIB), quản lý transaction begin/commit/rollback xung quanh method.\r
\r
**64. Spring AOP là gì? Dùng khi nào?**\r
> Aspect-Oriented Programming, cắt ngang cross-cutting concerns như logging, transaction, security.\r
\r
**65. Spring Boot Actuator dùng để làm gì?**\r
> Cung cấp endpoint giám sát health, metrics, info của ứng dụng.\r
\r
---\r
\r
## PHẦN 7 — REST API\r
\r
**66. RESTful API là gì?**\r
> API tuân theo REST principles: stateless, resource-based, dùng HTTP methods và status code chuẩn.\r
\r
**67. HTTP methods: GET, POST, PUT, DELETE, PATCH?**\r
> GET: lấy. POST: tạo. PUT: cập nhật toàn bộ. DELETE: xóa. PATCH: cập nhật một phần.\r
\r
**68. HTTP status code: 200, 201, 204, 400, 401, 403, 404, 500?**\r
> 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error.\r
\r
**69. Idempotency là gì? Methods nào idempotent?**\r
> Gọi nhiều lần cho cùng kết quả. GET, PUT, DELETE idempotent. POST thường không idempotent.\r
\r
**70. \`@RequestParam\` vs \`@PathVariable\`?**\r
> \`@RequestParam\` lấy query parameter. \`@PathVariable\` lấy giá trị từ URL path.\r
\r
**71. DTO là gì? Tại sao dùng DTO?**\r
> Data Transfer Object, dùng để truyền dữ liệu giữa layer. Giúp giấu entity, validate, format dữ liệu.\r
\r
**72. \`@Valid\` và \`@Validated\` khác nhau?**\r
> \`@Valid\` hỗ trợ nested validation. \`@Validated\` hỗ trợ group validation.\r
\r
**73. Global exception handling trong Spring?**\r
> Dùng \`@RestControllerAdvice\` + \`@ExceptionHandler\` để xử lý exception chung.\r
\r
**74. Pagination trong Spring Data JPA?**\r
> Dùng \`Pageable\` parameter và trả về \`Page<T>\`. Ví dụ: \`repository.findAll(PageRequest.of(0, 10))\`.\r
\r
**75. Versioning API có những cách nào?**\r
> URL path (\`/v1/users\`), request param, header (\`Accept-Version\`), media type versioning.\r
\r
---\r
\r
## PHẦN 8 — JPA / Hibernate\r
\r
**76. JPA vs Hibernate?**\r
> JPA là specification. Hibernate là implementation phổ biến của JPA.\r
\r
**77. \`@Entity\`, \`@Table\`, \`@Id\`, \`@GeneratedValue\`?**\r
> \`@Entity\`: đánh dấu class ánh xạ bảng. \`@Table\`: tên bảng. \`@Id\`: khóa chính. \`@GeneratedValue\`: tự động sinh ID.\r
\r
**78. \`@OneToMany\`, \`@ManyToOne\`, \`@ManyToMany\`?**\r
> Định nghĩa quan hệ 1-n, n-1, n-n giữa entity.\r
\r
**79. \`FetchType.LAZY\` vs \`FetchType.EAGER\`?**\r
> LAZY: load dữ liệu liên quan khi truy cập. EAGER: load ngay lập tức cùng entity chính.\r
\r
**80. \`cascade\` là gì? Các loại cascade?**\r
> Tự động áp dụng operation cho entity liên quan. Các loại: PERSIST, MERGE, REMOVE, REFRESH, DETACH, ALL.\r
\r
**81. \`orphanRemoval\` là gì?**\r
> Tự động xóa entity con khi bị loại khỏi collection của parent.\r
\r
**82. \`@Column\`, \`@JoinColumn\`?**\r
> \`@Column\`: ánh xạ cột thường. \`@JoinColumn\`: ánh xạ khóa ngoại.\r
\r
**83. JPQL vs native query?**\r
> JPQL truy vấn entity và thuộc tính, database-independent. Native query viết SQL thuần túy.\r
\r
**84. First-level cache vs second-level cache?**\r
> First-level cache: mặc định theo EntityManager/Session. Second-level cache: cache toàn cục, cần cấu hình provider (Ehcache, Caffeine).\r
\r
**85. \`@Query\` và \`@Modifying\`?**\r
> \`@Query\`: custom query. \`@Modifying\`: đánh dấu query là INSERT/UPDATE/DELETE trong \`@Transactional\`.\r
\r
---\r
\r
## PHẦN 9 — Security & JWT\r
\r
**86. Authentication vs Authorization?**\r
> Authentication: xác minh "ai bạn là". Authorization: xác định "bạn đượ phép làm gì".\r
\r
**87. JWT gồm mấy phần?**\r
> 3 phần: Header, Payload, Signature, ngăn cách bằng dấu chấm.\r
\r
**88. Cách bảo mật JWT?**\r
> Dùng secret mạnh, HS256/RS256, set expiration ngắn, lưu trữ an toàn, dùng refresh token, HTTPS.\r
\r
**89. OAuth2 flow cơ bản?**\r
> Client yêu cầu authorization → User đồng ý → Authorization server cấp access token → Client dùng token gọi resource server.\r
\r
**90. Spring Security filter chain?**\r
> Chuỗi filter xử lý request: authentication, authorization, CSRF, session, exception handling.\r
\r
**91. \`BCryptPasswordEncoder\` dùng để làm gì?**\r
> Hash password với salt tự động, chậm và an toàn.\r
\r
**92. CSRF là gì? Cách chống?**\r
> Cross-Site Request Forgery: kẻ tấn công lừa user thực hiện request. Chống bằng CSRF token, SameSite cookie.\r
\r
**93. CORS là gì? Cách cấu hình?**\r
> Cross-Origin Resource Sharing. Cấu hình allowed origins, methods, headers trong Spring bằng \`CorsRegistry\`.\r
\r
**94. HTTPS hoạt động như thế nào?**\r
> Dùng TLS/SSL để mã hóa dữ liệu giữa client và server qua handshake và certificate.\r
\r
**95. Session-based auth vs Token-based auth?**\r
> Session: server lưu session, client giữ session ID. Token: server không lưu trạng thái, client gửi token mỗi request.\r
\r
---\r
\r
## PHẦN 10 — DevOps & Cloud\r
\r
**96. Docker image vs container?**\r
> Image là template read-only. Container là instance đang chạy của image.\r
\r
**97. Docker Compose dùng để làm gì?**\r
> Định nghĩa và chạy nhiều container cùng lúc qua file YAML.\r
\r
**98. CI/CD là gì?**\r
> Continuous Integration: tự động build/test khi code thay đổi. Continuous Deployment/Delivery: tự động triển khai.\r
\r
**99. Kafka dùng để làm gì?**\r
> Message broker phân tán, streaming dữ liệu real-time, giải coupling giữa services.\r
\r
**100. AWS EC2 vs ECS vs EKS?**\r
> EC2: máy chủ ảo tự quản lý. ECS: dịch vụ quản lý container. EKS: Kubernetes managed.\r
\r
**101. Load balancer L4 vs L7?**\r
> L4 dựa trên IP/port. L7 dựa trên nội dung request như URL, header, cookie.\r
\r
**102. Redis dùng để làm gì?**\r
> In-memory data store, dùng làm cache, session, rate limit, pub/sub, leaderboard.\r
\r
**103. CAP theorem là gì?**\r
> Hệ thống phân tán chỉ đảm bảo 2/3: Consistency, Availability, Partition Tolerance.\r
\r
**104. Rate limiting là gì?**\r
> Giới hạn số request từ một client trong khoảng thờ gian nhất định.\r
\r
**105. Blue-green deployment là gì?**\r
> Triển khai 2 môi trường giống hệt nhau, chuyển traffic từ blue sang green để giảm downtime và dễ rollback.\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 21\r
\r
- [ ] Đọc và hiểu từng câu trả lởi.\r
- [ ] Tự trả lởi lại bằng lờ của mình.\r
- [ ] Đánh dấu câu nào chưa chắc để ôn lại.\r
- [ ] Luyện nói ngắn gọn, rõ ràng, có ví dụ.`,checklist:[`Đọc và hiểu từng câu trả lởi.`,`Tự trả lởi lại bằng lờ của mình.`,`Đánh dấu câu nào chưa chắc để ôn lại.`,`Luyện nói ngắn gọn, rõ ràng, có ví dụ.`]},{file:`Phan22_DesignPatterns_CheatSheet.md`,title:`📄 📄 PHẦN 22 — DESIGN PATTERNS NÂNG CAO`,content:`# 📄 PHẦN 22 — DESIGN PATTERNS NÂNG CAO\r
\r
---\r
\r
## 1. Singleton (Đảm bảo duy nhất 1 instance)\r
\r
\`\`\`java\r
public enum Singleton {\r
    INSTANCE;\r
    public void doSomething() { ... }\r
}\r
\`\`\`\r
\r
**Thread-safe ngay từ đầu**, không reflection attack được.\r
\r
---\r
\r
## 2. Factory Method vs Abstract Factory\r
\r
| Factory Method | Abstract Factory |\r
|---|---|\r
| 1 method tạo 1 loại object | 1 factory tạo family object |\r
| Subclass quyết định concrete class | Factory interface có nhiều implementation |\r
| \`Document createDocument()\` | \`GuiFactory.createButton(), createCheckbox()\` |\r
\r
**Ví dụ Spring:** \`BeanFactory\` là Abstract Factory, mỗi \`@Bean\` method là Factory Method.\r
\r
---\r
\r
## 3. Builder Pattern\r
\r
Dùng khi object có nhiều optional field, cần immutable.\r
\r
\`\`\`java\r
User user = User.builder()\r
    .name("John")\r
    .age(30)\r
    .email("john@email.com")\r
    .build();\r
\`\`\`\r
\r
**Lombok:** \`@Builder\` tự sinh Builder class.\r
\r
---\r
\r
## 4. Strategy Pattern\r
\r
Cho phép thay đổi thuật toán tại runtime. Tuân thủ Open/Closed.\r
\r
\`\`\`java\r
public interface PaymentStrategy {\r
    void pay(BigDecimal amount);\r
}\r
\r
@Service\r
public class CreditCardPayment implements PaymentStrategy { ... }\r
@Service\r
public class PayPalPayment implements PaymentStrategy { ... }\r
\`\`\`\r
\r
---\r
\r
## 5. Observer Pattern (Event-Driven)\r
\r
Khi 1 object thay đổi state → notify tất cả observer.\r
\r
**Spring:** \`@EventListener\`, \`ApplicationEventPublisher\`.\r
\r
\`\`\`java\r
@Component\r
public class OrderCreatedListener {\r
    @EventListener\r
    public void handle(OrderCreatedEvent event) { ... }\r
}\r
\`\`\`\r
\r
---\r
\r
## 6. Decorator Pattern\r
\r
Wrapper linh hoạt — thêm behavior mà không sửa class gốc.\r
\r
**Java I/O:** \`BufferedReader br = new BufferedReader(new FileReader("file.txt"));\`\r
\r
---\r
\r
## 7. Proxy Pattern\r
\r
Object đại diện kiểm soát truy cập đến object thật.\r
\r
\`\`\`java\r
@Entity\r
public class Product {\r
    @ManyToOne(fetch = FetchType.LAZY)\r
    private Category category; // Hibernate proxy\r
}\r
\`\`\`\r
\r
**Spring AOP:** \`@Transactional\` tạo proxy tự động.\r
\r
---\r
\r
## 8. Template Method Pattern\r
\r
Định nghĩa khung thuật toán, để subclass implement chi tiết.\r
\r
\`\`\`java\r
public abstract class DataProcessor {\r
    public final void process() {\r
        read();\r
        processData();\r
        save();\r
    }\r
    protected abstract void read();\r
    protected abstract void processData();\r
    protected abstract void save();\r
}\r
\`\`\`\r
\r
**Spring:** \`JdbcTemplate\`, \`RestTemplate\`, \`JpaRepository<T, ID>\`.\r
\r
---\r
\r
## 9. Dependency Injection & IoC\r
\r
**IoC (Inversion of Control):** Thay vì tự tạo object, DI container làm việc đó.\r
\r
**Spring DI:** Constructor Injection được khuyến nghị.\r
\r
\`\`\`java\r
@Service\r
public class OrderService {\r
    private final OrderRepository repo;\r
\r
    public OrderService(OrderRepository repo) { // Spring tự inject\r
        this.repo = repo;\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 10. SOLID Principles\r
\r
| Principle | Ý nghĩa | Ví dụ vi phạm |\r
|---|---|---|\r
| **S**RP — 1 class 1 lý do thay đổi | \`UserService\` không nên gửi email | Tách \`EmailService\` |\r
| **O**CP — Mở rộng, đóng sửa | Thêm strategy, không sửa controller | Dùng interface |\r
| **L**SP — Subclass thay được cha | \`Square extends Rectangle\` → sai | Dùng interface chung |\r
| **I**SP — Nhiều interface nhỏ | \`Worker { eat(), work() }\` tách thành 2 | \`Eatable\`, \`Workable\` |\r
| **D**IP — Phụ thuộc abstraction | \`Service\` phụ thuộc \`Repository\` interface | Không phụ thuộc \`JdbcRepositoryImpl\` |\r
\r
---\r
\r
## 💬 Câu trả lời mẫu 60 giây\r
\r
**Câu: Singleton pattern và thread-safety?**\r
> "Cách an toàn nhất là dùng enum Singleton của Java. Hoặc dùng static inner class — JVM tự đảm bảo thread-safety khi load class. Không dùng double-checked locking trừ khi thực sự cần."\r
\r
**Câu: Khi nào dùng Strategy vs Decorator?**\r
> "Strategy dùng khi muốn thay đổi thuật toán (cách làm). Decorator dùng khi muốn thêm behavior cho object (wrap thêm). Strategy = interchangeable algorithm, Decorator = dynamic wrapper."\r
\r
**Câu: DI/IoC giúp gì?**\r
> "Giảm coupling, dễ test (mock), dễ thay đổi implementation. Spring quản lý lifecycle của bean."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 22\r
- [ ] Viết Singleton thread-safe với enum.\r
- [ ] Phân biệt Factory Method vs Abstract Factory.\r
- [ ] Dùng Builder cho object nhiều field.\r
- [ ] Implement Strategy Pattern.\r
- [ ] Dùng @EventListener cho event-driven.\r
- [ ] Giải thích Proxy Pattern trong Hibernate/Spring AOP.\r
- [ ] Giải thích Template Method với Spring template classes.\r
- [ ] Trình bày SOLID và ví dụ từng principle.\r
- [ ] Giải thích IoC và Constructor Injection.`,checklist:[`Viết Singleton thread-safe với enum.`,`Phân biệt Factory Method vs Abstract Factory.`,`Dùng Builder cho object nhiều field.`,`Implement Strategy Pattern.`,`Dùng @EventListener cho event-driven.`,`Giải thích Proxy Pattern trong Hibernate/Spring AOP.`,`Giải thích Template Method với Spring template classes.`,`Trình bày SOLID và ví dụ từng principle.`,`Giải thích IoC và Constructor Injection.`]},{file:`Phan23_Reactive_CheatSheet.md`,title:`📄 📄 PHẦN 23 — REACTIVE PROGRAMMING (WebFlux + R2DBC)`,content:`# 📄 PHẦN 23 — REACTIVE PROGRAMMING (WebFlux + R2DBC)\r
\r
---\r
\r
## 1. Reactive Programming là gì?\r
\r
Lập trình **bất đồng bộ, non-blocking**, dùng stream dữ liệu với **backpressure**.\r
\r
**Blocking vs Reactive:**\r
\r
\`\`\`java\r
// Blocking — thread chờ\r
String result = restTemplate.getForObject(url, String.class);\r
\r
// Reactive — thread không block\r
Mono<String> result = webClient.get().uri(url).retrieve().bodyToMono(String.class);\r
result.subscribe(data -> System.out.println(data));\r
\`\`\`\r
\r
---\r
\r
## 2. Reactive Streams Specification\r
\r
| Thành phần | Vai trò |\r
|---|---|\r
| **Publisher** | Phát dữ liệu (\`Mono\`, \`Flux\`) |\r
| **Subscriber** | Nhận dữ liệu |\r
| **Subscription** | Kết nối Publisher ↔ Subscriber, hỗ trợ \`request(n)\` |\r
| **Processor** | Vừa là Publisher vừa là Subscriber |\r
\r
**Backpressure:** Subscriber kiểm soát tốc độ bằng \`request(n)\`.\r
\r
---\r
\r
## 3. Mono vs Flux\r
\r
| Mono<T> | Flux<T> |\r
|---|---|\r
| 0 hoặc 1 item | 0..N items |\r
| \`Mono.just("Hello")\` | \`Flux.just("A", "B", "C")\` |\r
| Dùng cho single result API | Dùng cho list, stream |\r
\r
---\r
\r
## 4. WebFlux — Reactive REST API\r
\r
**Dependency:**\r
\`\`\`xml\r
<dependency>\r
    <groupId>org.springframework.boot</groupId>\r
    <artifactId>spring-boot-starter-webflux</artifactId>\r
</dependency>\r
\`\`\`\r
\r
**Controller:**\r
\`\`\`java\r
@RestController\r
@RequestMapping("/api/products")\r
public class ProductController {\r
\r
    @GetMapping\r
    public Flux<ProductDto> getAll() {\r
        return productService.findAll();  // trả về Flux\r
    }\r
\r
    @GetMapping("/{id}")\r
    public Mono<ResponseEntity<ProductDto>> getById(@PathVariable Long id) {\r
        return productService.findById(id)\r
            .map(ResponseEntity::ok)\r
            .defaultIfEmpty(ResponseEntity.notFound().build());\r
    }\r
\r
    @PostMapping\r
    public Mono<ProductDto> create(@RequestBody ProductDto dto) {\r
        return productService.create(dto);\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 5. R2DBC — Reactive Database\r
\r
**Dependency:**\r
\`\`\`xml\r
<dependency>\r
    <groupId>org.springframework.boot</groupId>\r
    <artifactId>spring-boot-starter-data-r2dbc</artifactId>\r
</dependency>\r
\`\`\`\r
\r
**Repository:**\r
\`\`\`java\r
public interface ProductRepository extends ReactiveCrudRepository<Product, Long> {\r
    Flux<Product> findByCategory(String category);\r
    Mono<Product> findByName(String name);\r
}\r
\`\`\`\r
\r
---\r
\r
## 6. WebClient (thay thế RestTemplate)\r
\r
\`\`\`java\r
WebClient client = WebClient.create("https://api.example.com");\r
\r
Mono<UserResponse> result = client.get()\r
    .uri("/users/{id}", userId)\r
    .header("Authorization", "Bearer " + token)\r
    .retrieve()\r
    .bodyToMono(UserResponse.class);\r
\`\`\`\r
\r
**RestTemplate bị deprecated từ Spring 5**, thay bằng WebClient.\r
\r
---\r
\r
## 7. Error Handling trong Reactive\r
\r
\`\`\`java\r
public Mono<ProductDto> findById(Long id) {\r
    return repository.findById(id)\r
        .switchIfEmpty(Mono.error(new ProductNotFoundException(id)))\r
        .onErrorResume(DataIntegrityViolationException.class,\r
            e -> Mono.error(new BadRequestException("Data integrity error")))\r
        .timeout(Duration.ofSeconds(5))\r
        .retry(3);\r
}\r
\`\`\`\r
\r
---\r
\r
## 8. Marble Diagram (hiểu luồng)\r
\r
\`\`\`\r
Flux.fromIterable(users)\r
  .filter(u -> u.isActive())       // lọc\r
  .flatMap(u -> findOrders(u.id())) // gọi async → flatten\r
  .groupBy(Order::getStatus)        // nhóm\r
  .flatMap(group -> group.collectList()) // gom list\r
  .subscribe(System.out::println);\r
\`\`\`\r
\r
**Toán tử hay dùng:** \`map\`, \`flatMap\`, \`filter\`, \`doOnNext\`, \`switchIfEmpty\`, \`timeout\`, \`retry\`, \`zip\`, \`merge\`.\r
\r
---\r
\r
## 9. Threading Model\r
\r
- **Event Loop:** 1 thread trên mỗi CPU core (như Node.js).\r
- **Scheduler:** \`Schedulers.boundedElastic()\` cho blocking code, \`Schedulers.parallel()\` cho CPU-bound.\r
\r
\`\`\`java\r
Mono.fromCallable(() -> heavyComputation())\r
    .subscribeOn(Schedulers.boundedElastic());\r
\`\`\`\r
\r
---\r
\r
## 💬 Câu trả lời mẫu 60 giây\r
\r
**Câu: Reactive Programming khác gì với blocking?**\r
> "Blocking: thread chờ I/O → lãng phí tài nguyên. Reactive: dùng event loop, thread không chờ — khi có data thì callback. WebFlux dùng non-blocking I/O, giúp xử lý nhiều request hơn với ít thread hơn."\r
\r
**Câu: Khi nào dùng WebFlux?**\r
> "Khi ứng dụng có nhiều I/O (gọi API, DB) và cần scale nhiều kết nối. Ví dụ API Gateway, streaming service. Nếu ứng dụng đơn giản, CRUD ít request thì MVC vẫn ổn."\r
\r
**Câu: FlatMap vs Map trong Reactor?**\r
> "Map biến đổi đồng bộ 1:1. FlatMap biến đổi bất đồng bộ và flatten (1:N), dùng để gọi API/DB trong stream."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 23\r
- [ ] Giải thích Reactive Programming và Event Loop.\r
- [ ] Phân biệt Mono vs Flux.\r
- [ ] Viết Controller WebFlux cơ bản.\r
- [ ] Viết Repository R2DBC.\r
- [ ] Dùng WebClient gọi API.\r
- [ ] Xử lý lỗi với switchIfEmpty / onErrorResume.\r
- [ ] Phân biệt map vs flatMap trong Reactor.\r
- [ ] Biết threading model và Schedulers.`,checklist:[`Giải thích Reactive Programming và Event Loop.`,`Phân biệt Mono vs Flux.`,`Viết Controller WebFlux cơ bản.`,`Viết Repository R2DBC.`,`Dùng WebClient gọi API.`,`Xử lý lỗi với switchIfEmpty / onErrorResume.`,`Phân biệt map vs flatMap trong Reactor.`,`Biết threading model và Schedulers.`]},{file:`Phan24_Kubernetes_CheatSheet.md`,title:`📄 📄 PHẦN 24 — KUBERNETES & CLOUD NATIVE`,content:`# 📄 PHẦN 24 — KUBERNETES & CLOUD NATIVE\r
\r
---\r
\r
## 1. Kubernetes là gì?\r
\r
Hệ thống orchestration container, tự động **deploy, scale, manage** container.\r
\r
---\r
\r
## 2. Core Concepts\r
\r
| Khái niệm | Ý nghĩa |\r
|---|---|\r
| **Pod** | Đơn vị nhỏ nhất — 1 hoặc nhiều container chạy cùng nhau |\r
| **Deployment** | Quản lý replica Pod, rollout, rollback |\r
| **Service** | Stable endpoint để Pod giao tiếp (ClusterIP, NodePort, LoadBalancer) |\r
| **Ingress** | Router HTTP/HTTPS vào Service |\r
| **ConfigMap / Secret** | Lưu cấu hình / nhạy cảm |\r
| **PersistentVolume** | Lưu trữ dữ liệu bền vững |\r
\r
---\r
\r
## 3. Kubernetes Architecture\r
\r
\`\`\`\r
Control Plane (Master)\r
├── API Server (kube-apiserver)\r
├── Scheduler (kube-scheduler)\r
├── Controller Manager (kube-controller-manager)\r
└── etcd (distributed key-value store)\r
\r
Worker Node\r
├── Kubelet (agent)\r
├── Kube-proxy (network)\r
└── Container Runtime (Docker / containerd)\r
\`\`\`\r
\r
---\r
\r
## 4. Deployment cơ bản\r
\r
\`\`\`yaml\r
apiVersion: apps/v1\r
kind: Deployment\r
metadata:\r
  name: myapp\r
spec:\r
  replicas: 3\r
  selector:\r
    matchLabels:\r
      app: myapp\r
  template:\r
    metadata:\r
      labels:\r
        app: myapp\r
    spec:\r
      containers:\r
      - name: myapp\r
        image: myapp:1.0.0\r
        ports:\r
        - containerPort: 8080\r
        resources:\r
          requests:\r
            memory: "256Mi"\r
            cpu: "250m"\r
          limits:\r
            memory: "512Mi"\r
            cpu: "500m"\r
        livenessProbe:\r
          httpGet:\r
            path: /actuator/health\r
            port: 8080\r
        env:\r
        - name: SPRING_PROFILES_ACTIVE\r
          value: "k8s"\r
\`\`\`\r
\r
---\r
\r
## 5. Service & Ingress\r
\r
\`\`\`yaml\r
apiVersion: v1\r
kind: Service\r
metadata:\r
  name: myapp-service\r
spec:\r
  type: ClusterIP\r
  selector:\r
    app: myapp\r
  ports:\r
  - port: 80\r
    targetPort: 8080\r
---\r
apiVersion: networking.k8s.io/v1\r
kind: Ingress\r
metadata:\r
  name: myapp-ingress\r
spec:\r
  rules:\r
  - host: myapp.example.com\r
    http:\r
      paths:\r
      - path: /\r
        pathType: Prefix\r
        backend:\r
          service:\r
            name: myapp-service\r
            port:\r
              number: 80\r
\`\`\`\r
\r
---\r
\r
## 6. Kubernetes với Spring Boot\r
\r
**application-k8s.yaml:**\r
\`\`\`yaml\r
spring:\r
  datasource:\r
    url: jdbc:mysql://mysql-service:3306/db\r
  config:\r
    import: configmap:app-config\r
\`\`\`\r
\r
**Health check:** Spring Actuator \`/actuator/health\` → liveness + readiness.\r
\r
---\r
\r
## 7. Helm — Package Manager\r
\r
\`\`\`bash\r
helm create mychart\r
helm install myapp ./mychart\r
helm upgrade myapp ./mychart --set image.tag=1.1.0\r
helm rollback myapp 1\r
\`\`\`\r
\r
**Values file:**\r
\`\`\`yaml\r
replicaCount: 3\r
image:\r
  repository: myapp\r
  tag: "1.0.0"\r
service:\r
  port: 80\r
\`\`\`\r
\r
---\r
\r
## 8. kubectl commands hay dùng\r
\r
\`\`\`bash\r
kubectl get pods -w\r
kubectl logs -f deployment/myapp\r
kubectl exec -it pod-name -- /bin/sh\r
kubectl describe pod pod-name\r
kubectl port-forward svc/myapp-service 8080:80\r
kubectl apply -f deployment.yaml\r
kubectl rollout status deployment/myapp\r
kubectl rollout undo deployment/myapp\r
\`\`\`\r
\r
---\r
\r
## 9. Auto-scaling\r
\r
\`\`\`bash\r
kubectl autoscale deployment myapp --cpu-percent=70 --min=2 --max=10\r
\`\`\`\r
\r
**Horizontal Pod Autoscaler (HPA):** Tự động tăng/giảm replicas dựa trên CPU/memory.\r
\r
---\r
\r
## 💬 Câu trả lời mẫu 60 giây\r
\r
**Câu: Pod vs Deployment?**\r
> "Pod là instance nhỏ nhất. Deployment quản lý nhiều Pod replica, hỗ trợ rolling update và rollback. Không tạo Pod trực tiếp, luôn qua Deployment."\r
\r
**Câu: Service dùng để gì?**\r
> "Pod trong K8s có IP tạm thời, có thể restart → đổi IP. Service cung cấp IP/DNS ổn định và load balance traffic đến Pod."\r
\r
**Câu: Liveness vs Readiness probe?**\r
> "Liveness kiểm tra container còn sống không — nếu fail thì restart. Readiness kiểm tra container sẵn sàng nhận traffic — nếu fail thì remove khỏi Service."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 24\r
- [ ] Giải thích Pod, Deployment, Service, Ingress.\r
- [ ] Viết Deployment YAML cơ bản.\r
- [ ] Cấu hình Service và Ingress.\r
- [ ] Cấu hình Spring Boot trên K8s.\r
- [ ] Dùng Helm triển khai.\r
- [ ] Biết các lệnh kubectl cơ bản.\r
- [ ] Giải thích HPA auto-scaling.\r
- [ ] Phân biệt liveness vs readiness probe.`,checklist:[`Giải thích Pod, Deployment, Service, Ingress.`,`Viết Deployment YAML cơ bản.`,`Cấu hình Service và Ingress.`,`Cấu hình Spring Boot trên K8s.`,`Dùng Helm triển khai.`,`Biết các lệnh kubectl cơ bản.`,`Giải thích HPA auto-scaling.`,`Phân biệt liveness vs readiness probe.`]},{file:`Phan25_TestingAdvanced_CheatSheet.md`,title:`📄 📄 PHẦN 25 — TESTING ADVANCED`,content:`# 📄 PHẦN 25 — TESTING ADVANCED\r
\r
---\r
\r
## 1. TDD (Test-Driven Development)\r
\r
**Red → Green → Refactor**\r
\r
1. Viết test trước (đỏ)\r
2. Viết code tối thiểu để pass (xanh)\r
3. Refactor code\r
\r
---\r
\r
## 2. Unit Test với JUnit 5\r
\r
\`\`\`java\r
@ExtendWith(MockitoExtension.class)\r
class OrderServiceTest {\r
\r
    @Mock\r
    private OrderRepository orderRepository;\r
\r
    @InjectMocks\r
    private OrderService orderService;\r
\r
    @Test\r
    @DisplayName("Should calculate total price correctly")\r
    void testCalculateTotal() {\r
        // Arrange\r
        Order order = new Order();\r
        order.addItem(new Item("Product A", BigDecimal.TEN));\r
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));\r
\r
        // Act\r
        BigDecimal result = orderService.calculateTotal(1L);\r
\r
        // Assert\r
        assertEquals(new BigDecimal("10.0"), result);\r
        verify(orderRepository).findById(1L);\r
    }\r
}\r
\`\`\`\r
\r
**Annotations:** \`@Test\`, \`@ParameterizedTest\`, \`@DisplayName\`, \`@Nested\`, \`@Tag\`.\r
\r
---\r
\r
## 3. Mockito — Mocking & Stubbing\r
\r
\`\`\`java\r
// Stub\r
when(repo.findById(1L)).thenReturn(Optional.of(user));\r
when(repo.save(any())).thenThrow(new DataIntegrityViolationException("..."));\r
doNothing().when(emailService).send(anyString());\r
\r
// Verify\r
verify(repo, times(1)).save(any());\r
verify(repo, never()).delete(any());\r
verify(repo, timeout(100).times(1)).findById(1L);\r
\r
// Argument matchers\r
any(), anyString(), anyLong(), eq("value"), argThat(arg -> arg > 0)\r
\r
// Spy (partial mock)\r
@Spy\r
List<String> list = new ArrayList<>();\r
doReturn(100).when(list).size(); // override size()\r
\`\`\`\r
\r
---\r
\r
## 4. Spring Boot Test — Slice Test\r
\r
\`\`\`java\r
@WebMvcTest(OrderController.class)\r
class OrderControllerTest {\r
\r
    @Autowired\r
    private MockMvc mockMvc;\r
\r
    @MockBean\r
    private OrderService orderService;\r
\r
    @Test\r
    void shouldReturn200() throws Exception {\r
        when(orderService.findById(1L))\r
            .thenReturn(new OrderDto(1L, "Product", BigDecimal.TEN));\r
\r
        mockMvc.perform(get("/api/orders/1"))\r
            .andExpect(status().isOk())\r
            .andExpect(jsonPath("$.name").value("Product"))\r
            .andExpect(jsonPath("$.price").value(10.0));\r
    }\r
}\r
\`\`\`\r
\r
| Annotation | Test tầng |\r
|---|---|\r
| \`@WebMvcTest\` | Controller |\r
| \`@DataJpaTest\` | Repository |\r
| \`@JsonTest\` | JSON serialize |\r
| \`@RestClientTest\` | REST client |\r
\r
---\r
\r
## 5. Integration Test với Testcontainers\r
\r
\`\`\`java\r
@Testcontainers\r
@SpringBootTest\r
class OrderRepositoryIntegrationTest {\r
\r
    @Container\r
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8")\r
        .withDatabaseName("testdb");\r
\r
    @DynamicPropertySource\r
    static void properties(DynamicPropertyRegistry reg) {\r
        reg.add("spring.datasource.url", mysql::getJdbcUrl);\r
        reg.add("spring.datasource.username", mysql::getUsername);\r
        reg.add("spring.datasource.password", mysql::getPassword);\r
    }\r
\r
    @Autowired\r
    private OrderRepository repository;\r
\r
    @Test\r
    void shouldSaveAndFindOrder() {\r
        Order order = new Order("Test");\r
        repository.save(order);\r
        assertThat(repository.findByName("Test")).isPresent();\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 6. Contract Test với Spring Cloud Contract\r
\r
Đảm bảo API contract giữa producer và consumer.\r
\r
\`\`\`groovy\r
// contracts/shouldReturnProduct.groovy\r
Contract.make {\r
    description "should return product by ID"\r
    request {\r
        method GET()\r
        url "/api/products/1"\r
    }\r
    response {\r
        status 200\r
        headers {\r
            contentType applicationJson()\r
        }\r
        body([\r
            id: 1,\r
            name: "Product",\r
            price: 100.00\r
        ])\r
    }\r
}\r
\`\`\`\r
\r
---\r
\r
## 7. Performance Test\r
\r
\`\`\`java\r
@BenchmarkMode(Mode.Throughput)\r
@Measurement(iterations = 5, time = 1)\r
@Threads(4)\r
@Fork(1)\r
public class OrderServiceBenchmark {\r
\r
    @Benchmark\r
    public void testFindAll(Blackhole hole) {\r
        hole.consume(orderService.findAll());\r
    }\r
}\r
\`\`\`\r
\r
**JMH** (Java Microbenchmark Harness) — đảm bảo đo đúng, không bị JVM warmup ảnh hưởng.\r
\r
---\r
\r
## 8. Mutation Testing với PITest\r
\r
Kiểm tra chất lượng test bằng cách đột biến code.\r
\r
\`\`\`xml\r
<plugin>\r
    <groupId>org.pitest</groupId>\r
    <artifactId>pitest-maven</artifactId>\r
    <configuration>\r
        <targetClasses>\r
            <param>com.myapp.service.*</param>\r
        </targetClasses>\r
        <targetTests>\r
            <param>com.myapp.service.*</param>\r
        </targetTests>\r
    </configuration>\r
</plugin>\r
\`\`\`\r
\r
Mục tiêu: **> 80% mutation coverage**.\r
\r
---\r
\r
## 💬 Câu trả lời mẫu 60 giây\r
\r
**Câu: @Mock vs @InjectMocks?**\r
> "@Mock tạo mock object. @InjectMocks tạo instance thật và inject các mock vào field tương ứng (constructor, setter, field)."\r
\r
**Câu: Spring Boot slice test là gì?**\r
> "Chỉ load các bean cần thiết cho tầng đó. @WebMvcTest chỉ load Controller, không load Service thật (dùng @MockBean). Giúp test nhanh hơn integration test."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 25\r
- [ ] Giải thích TDD: Red → Green → Refactor.\r
- [ ] Viết Unit Test với JUnit 5 + Mockito.\r
- [ ] Dùng @WebMvcTest cho Controller.\r
- [ ] Dùng Testcontainers cho Integration Test.\r
- [ ] Biết Contract Test với Spring Cloud Contract.\r
- [ ] Biết Performance Test với JMH.\r
- [ ] Biết Mutation Testing với PITest.\r
- [ ] Phân biệt @Mock, @MockBean, @InjectMocks.`,checklist:[`Giải thích TDD: Red → Green → Refactor.`,`Viết Unit Test với JUnit 5 + Mockito.`,`Dùng @WebMvcTest cho Controller.`,`Dùng Testcontainers cho Integration Test.`,`Biết Contract Test với Spring Cloud Contract.`,`Biết Performance Test với JMH.`,`Biết Mutation Testing với PITest.`,`Phân biệt @Mock, @MockBean, @InjectMocks.`]},{file:`Phan26_Performance_CheatSheet.md`,title:`📄 📄 PHẦN 26 — PERFORMANCE OPTIMIZATION & TROUBLESHOOTING`,content:`# 📄 PHẦN 26 — PERFORMANCE OPTIMIZATION & TROUBLESHOOTING\r
\r
---\r
\r
## 1. JVM Memory Model\r
\r
\`\`\`\r
Heap                            Metaspace\r
├── Young Gen                   Class metadata\r
│   ├── Eden                   (không giới hạn mặc định)\r
│   └── Survivor (S0, S1)\r
├── Old Gen (Tenured)\r
└── (từ Java 8+ không có PermGen)\r
\`\`\`\r
\r
**JVM flags:**\r
\`\`\`bash\r
-Xms512m -Xmx2g                    # Initial / Max heap\r
-XX:MetaspaceSize=256m              # Metaspace\r
-XX:+UseG1GC                        # G1GC (mặc định từ Java 9)\r
-XX:+PrintGCDetails                 # Log GC\r
-XX:+HeapDumpOnOutOfMemoryError     # Auto dump heap khi OOM\r
\`\`\`\r
\r
---\r
\r
## 2. Garbage Collection Algorithms\r
\r
| GC | Mô tả | Khi nào dùng |\r
|---|---|---|\r
| **Serial** | 1 thread, stop-the-world | App nhỏ, single-core |\r
| **Parallel** | Nhiều thread, throughput cao | Batch processing, high throughput |\r
| **G1GC** | Region-based, pause time predictable | Mặc định Java 9+, ứng dụng lớn |\r
| **ZGC** | Low-latency < 10ms | Hệ thống real-time, heap lớn > 100GB |\r
| **Shenandoah** | Concurrent compaction | Latency-sensitive |\r
\r
---\r
\r
## 3. Profiling & Monitoring\r
\r
**Công cụ:**\r
- **JProfiler / YourKit** — trả phí, mạnh nhất\r
- **VisualVM** — free, đủ dùng\r
- **Async Profiler** — low overhead sampling\r
- **JDK Mission Control (JMC)** — flight recorder, free từ Oracle\r
\r
**Cách profile:**\r
\`\`\`bash\r
# CPU sampling\r
async-profiler -e cpu -d 30 -o flamegraph output.svg <pid>\r
\r
# Heap dump\r
jmap -dump:format=b,file=heap.hprof <pid>\r
\r
# GC log analysis\r
gceasy.io (upload GC log)\r
\`\`\`\r
\r
---\r
\r
## 4. Database Performance\r
\r
| Vấn đề | Giải pháp |\r
|---|---|\r
| Query chậm | \`EXPLAIN\`, tạo index, dùng covering index |\r
| N+1 query | \`JOIN FETCH\`, \`@EntityGraph\`, batch fetching |\r
| Connection pool full | Tuning HikariCP: \`maximumPoolSize\`, \`connectionTimeout\` |\r
| Deadlock | Đảm bảo thứ tự lock, transaction ngắn |\r
| Slow bulk insert | \`hibernate.jdbc.batch_size\`, rewriteBatchedStatements |\r
\r
**HikariCP config:**\r
\`\`\`yaml\r
spring:\r
  datasource:\r
    hikari:\r
      maximum-pool-size: 20\r
      minimum-idle: 5\r
      idle-timeout: 300000\r
      connection-timeout: 20000\r
      max-lifetime: 1200000\r
\`\`\`\r
\r
---\r
\r
## 5. Caching Strategy\r
\r
\`\`\`java\r
@Configuration\r
@EnableCaching\r
public class CacheConfig {\r
    @Bean\r
    public CacheManager cacheManager() {\r
        return new ConcurrentMapCacheManager("products", "users");\r
    }\r
}\r
\r
@Service\r
public class ProductService {\r
    @Cacheable(value = "products", key = "#id")\r
    public Product findById(Long id) { ... }\r
\r
    @CacheEvict(value = "products", key = "#product.id")\r
    public Product update(Product product) { ... }\r
\r
    @CachePut(value = "products", key = "#result.id")\r
    public Product create(Product product) { ... }\r
}\r
\`\`\`\r
\r
**Redis Cache:**\r
\`\`\`yaml\r
spring:\r
  cache:\r
    type: redis\r
  redis:\r
    host: localhost\r
    port: 6379\r
\`\`\`\r
\r
**Cache Aside Pattern:** App đọc cache trước, miss thì đọc DB + ghi cache.\r
\r
---\r
\r
## 6. Connection Pool Tuning\r
\r
| Pool | Max | Ideal |\r
|---|---|---|\r
| HikariCP (DB) | 20-50 | 2-4 core × 2 |\r
| Tomcat (HTTP) | 200 | Tùy traffic |\r
| Kafka Consumer | Số partition | 1 thread / partition max |\r
\r
**Công thức:** \`PoolSize = Tp * (C - Cm)\` với \`Tp = max threads in parallel\`, \`C = core count\`.\r
\r
---\r
\r
## 7. Common Performance Issues\r
\r
| Triệu chứng | Nguyên nhân | Cách fix |\r
|---|---|---|\r
| High CPU | Infinite loop, GC storm | Heap dump + thread dump |\r
| High Memory | Memory leak, large objects | Heap dump → MAT (Eclipse Memory Analyzer) |\r
| Slow response | DB query chậm, external API slow | Trace, index, cache, timeout |\r
| Thread stuck | Deadlock, connection pool full | Thread dump, increase pool |\r
| Disk I/O high | Logging quá nhiều | Log level, async appender |\r
\r
**Thread dump command:**\r
\`\`\`bash\r
jstack <pid> > threaddump.txt\r
# Hoặc kill -3 <pid> (Unix)\r
\`\`\`\r
\r
---\r
\r
## 8. Spring Boot Performance Tuning\r
\r
\`\`\`yaml\r
# application.yaml\r
server:\r
  tomcat:\r
    max-threads: 200\r
    max-connections: 10000\r
    accept-count: 100\r
    connection-timeout: 5000\r
\r
spring:\r
  jpa:\r
    properties:\r
      hibernate:\r
        jdbc.batch_size: 30\r
        order_inserts: true\r
        order_updates: true\r
        generate_statistics: true  # chỉ dùng dev\r
\`\`\`\r
\r
---\r
\r
## 💬 Câu trả lời mẫu 60 giây\r
\r
**Câu: Ứng dụng chạy chậm, bạn làm gì?**\r
> "1) Kiểm tra monitoring/metric (CPU, memory, GC, DB). 2) Xác định bottleneck: dùng profiler. 3) Nếu DB chậm → check query, index. 4) Nếu code → optimize, cache. 5) Verify sau fix."\r
\r
**Câu: Memory leak trong Java?**\r
> "Object không được GC vì vẫn còn reference. Dùng heap dump + Eclipse MAT để tìm object chiếm nhiều memory. Nguyên nhân thường: không đóng resource, static collection, ThreadLocal, listener không unregister."\r
\r
**Câu: G1GC hoạt động thế nào?**\r
> "G1 chia heap thành các region. Concurrent marking để tìm garbage. Ưu tiên thu thập region chứa nhiều garbage nhất (garbage-first). Mục tiêu đạt pause time target (mặc định 200ms)."\r
\r
---\r
\r
## ✅ CHECKLIST PHẦN 26\r
- [ ] Giải thích JVM Memory Model.\r
- [ ] Phân biệt các GC algorithms.\r
- [ ] Dùng profiler để tìm bottleneck.\r
- [ ] Fix N+1 query, tối ưu index.\r
- [ ] Cấu hình caching (@Cacheable, Redis).\r
- [ ] Tuning connection pool.\r
- [ ] Đọc và phân tích thread dump.\r
- [ ] Đọc và phân tích heap dump.\r
- [ ] Tuning Spring Boot application.`,checklist:[`Giải thích JVM Memory Model.`,`Phân biệt các GC algorithms.`,`Dùng profiler để tìm bottleneck.`,`Fix N+1 query, tối ưu index.`,`Cấu hình caching (@Cacheable, Redis).`,`Tuning connection pool.`,`Đọc và phân tích thread dump.`,`Đọc và phân tích heap dump.`,`Tuning Spring Boot application.`]}];var p=window.interviewTopics,m={};async function h(e,t){return t?await window.progressDB.markCompleted(e,`interview`,`checklist`,{title:e}):await window.progressDB.uncomplete(e,`checklist`),m[e]=t,m}function g(e){return e||window.interviewTopics||[]}function _(e){return g()[e]||null}function v(){return m}function y(e){let t=g(e),n=0,r=0;return t.forEach(e=>{e.checklist&&e.checklist.forEach(e=>{n++,m[e]&&r++})}),{done:r,total:n,percent:n>0?Math.round(r/n*100):0}}function b(e){let t=e.checklist?e.checklist.length:0;return{done:e.checklist?e.checklist.filter(e=>m[e]).length:0,total:t}}var x=[{label:`📘 Java Core`,indices:[1,2,3,4,5]},{label:`🗄️ Database & Spring`,indices:[6,7,8,9,10,11,12]},{label:`☁️ DevOps & Architecture`,indices:[13,14,15,16,17,18]},{label:`📝 Practice & Testing`,indices:[19,20,21,22,23,24,25,26,27]}];function S(e){return e.replace(/^📄 /,``).replace(/^Phần (\d+) — /i,`$1 — `)}var C={name:`InterviewPage`,data(){return{currentIndex:0,collapsedGroups:Object.fromEntries(x.map(e=>[e.label,!0])),GROUPS:x}},computed:{topics(){return g(p)},currentTopic(){return _(this.currentIndex)},renderedContent(){if(!this.currentTopic)return``;let e=``;if(this.currentTopic.content&&(e+=f(this.currentTopic.content)),this.currentTopic.checklist&&this.currentTopic.checklist.length>0){e+=`<h3>📝 Checklist kiến thức cần nhớ</h3>`;let t=v();this.currentTopic.checklist.forEach(n=>{let r=!!t[n];e+=`
            <label class="checklist-item ${r?`checked`:``}">
              <input type="checkbox" ${r?`checked`:``} data-item="${n.replace(/"/g,`&quot;`)}">
              <span>${n}</span>
            </label>
          `})}return e},progress(){return y(p)}},mounted(){this.$nextTick(()=>{this.bindChecklistEvents()})},updated(){this.$nextTick(()=>{this.bindChecklistEvents()})},methods:{shortTitle:S,goHome(){d(`/`)},selectTopic(e){this.currentIndex=e,this.scrollToTop()},scrollToTop(){let e=this.$refs.cardRef;e&&e.scrollIntoView({block:`start`})},toggleGroup(e){let t=!!this.collapsedGroups[e.label];if(this.collapsedGroups[e.label]=!t,t){let t=e.indices[0];t!==void 0&&this.selectTopic(t)}},getTopic(e){return this.topics[e]||null},getTopicStatus(e){let t=this.getTopic(e);if(!t)return`0/0`;let{done:n,total:r}=b(t);return`${n}/${r}`},bindChecklistEvents(){let e=this.$refs.cardRef;e&&(e.querySelectorAll(`.checklist-item input`).forEach(e=>{e.__vue__||(e.__vue__=!0,e.addEventListener(`change`,()=>{let t=e.dataset.item,n=e.checked;h(t,n),e.closest(`.checklist-item`).classList.toggle(`checked`,n),this.$forceUpdate(),this.scrollToTop()}))}),e.querySelectorAll(`.topic-link`).forEach(e=>{e.__vue__||(e.__vue__=!0,e.addEventListener(`click`,t=>{t.preventDefault();let n=e.dataset.topicFile,r=this.topics.findIndex(e=>e.file===n);r>=0&&this.selectTopic(r)}))}))}}},w={class:`interview-page`},T={class:`interview-container`},E={class:`interview-topbar`},D={class:`topbar-actions`},O={class:`interview-layout`},k={class:`interview-sidebar`},A={class:`topic-list`},j=[`onClick`],M={class:`toggle-icon`},N=[`onClick`],P={class:`topic-status`},F={class:`progress-bar-wrap`},I={class:`progress-text`},L={class:`progress-track`},R={class:`interview-card`,ref:`cardRef`},z={class:`topic-title`},B=[`innerHTML`];function V(s,d,f,p,m,h){return r(),i(`div`,w,[c(`div`,T,[c(`header`,E,[d[2]||=c(`h1`,null,`☕ Java Backend Interview`,-1),c(`div`,D,[c(`button`,{class:`back-btn`,onClick:d[0]||=(...e)=>h.goHome&&h.goHome(...e)},`⬅ Quay lại Trang chủ`)])]),c(`div`,O,[c(`aside`,k,[d[3]||=c(`h3`,null,`📑 Chủ đề`,-1),c(`ul`,A,[c(`li`,{class:o([`topic-item intro-item`,{active:m.currentIndex===0}]),onClick:d[1]||=e=>h.selectTopic(0)},`📋 Tổng quan`,2),(r(!0),i(l,null,e(m.GROUPS,t=>(r(),i(l,{key:t.label},[c(`li`,{class:o([`topic-item group-header`,{collapsed:m.collapsedGroups[t.label]}]),onClick:e=>h.toggleGroup(t)},[c(`span`,M,n(m.collapsedGroups[t.label]?`▶`:`▼`),1),u(` `+n(t.label),1)],10,j),m.collapsedGroups[t.label]?a(``,!0):(r(!0),i(l,{key:0},e(t.indices,e=>(r(),i(`li`,{key:e,class:o([`topic-item group-item`,{active:m.currentIndex===e}]),onClick:t=>h.selectTopic(e)},[c(`span`,null,n(h.shortTitle(h.getTopic(e)?.title||``)),1),c(`span`,P,n(h.getTopicStatus(e)),1)],10,N))),128))],64))),128))]),c(`div`,F,[c(`div`,I,n(h.progress.done)+` / `+n(h.progress.total),1),c(`div`,L,[c(`div`,{class:`progress-fill`,style:t({width:h.progress.percent+`%`})},null,4)])])]),c(`main`,R,[c(`h2`,z,n(h.currentTopic?.title||``),1),c(`div`,{class:`topic-body`,innerHTML:h.renderedContent},null,8,B)],512)])])])}var H=s(C,[[`render`,V],[`__scopeId`,`data-v-869e75c4`]]);export{H as default};