import{C as e,S as t,_ as n,c as r,f as i,g as a,l as o,n as s,s as c,w as l}from"./index-Bo0rls2t.js";import{t as u}from"./navigate-DAm3_qS0.js";import{t as d}from"./markdown-RpJYUkAQ.js";window.learnTopics=[{file:`README.md`,title:`📚 Học Code — Tổng quan`,content:`Tổng hợp các bài học lập trình cơ bản và nâng cao.

## 📑 Danh sách bài học

1. [Bài 1 — Biến & Kiểu dữ liệu Java](#)
2. [Bài 2 — Câu điều kiện & Vòng lặp](#)
3. [Bài 3 — Mảng & Chuỗi](#)
4. [Bài 4 — Hướng đối tượng OOP](#)
5. [Bài 5 — Collection & Generic](#)
6. [Bài 6 — Cấu trúc dữ liệu cơ bản](#)
7. [Bài 7 — Giải thuật tìm kiếm & sắp xếp](#)
8. [Bài 8 — SQL cơ bản](#)
9. [Bài 9 — JDBC & Database](#)
10. [Bài 10 — Git cơ bản](#)

## 🎯 Mục tiêu

- Nắm vững kiến thức nền tảng lập trình Java
- Thực hành code mẫu qua từng bài
- Làm quen với database, Git`,checklist:[]},{file:`Bai1_Bien_KieuDuLieu.md`,title:`📄 BÀI 1 — BIẾN & KIỂU DỮ LIỆU`,content:`---

## 1. Biến trong Java

Biến là vùng nhớ lưu trữ dữ liệu, mỗi biến có kiểu dữ liệu xác định.

\`\`\`java
int soNguyen = 10;
double soThuc = 3.14;
String chuoi = "Hello";
boolean dungSai = true;
\`\`\`

## 2. Kiểu dữ liệu nguyên thủy (Primitive)

| Kiểu | Kích thước | Giá trị mặc định | Ví dụ |
|---|---|---|---|
| \`byte\` | 1 byte | 0 | \`byte b = 100;\` |
| \`short\` | 2 byte | 0 | \`short s = 1000;\` |
| \`int\` | 4 byte | 0 | \`int i = 100000;\` |
| \`long\` | 8 byte | 0L | \`long l = 100000L;\` |
| \`float\` | 4 byte | 0.0f | \`float f = 3.14f;\` |
| \`double\` | 8 byte | 0.0d | \`double d = 3.14;\` |
| \`char\` | 2 byte | '\\u0000' | \`char c = 'A';\` |
| \`boolean\` | 1 bit | false | \`boolean b = true;\` |

## 3. Kiểu dữ liệu tham chiếu (Reference)

Bao gồm: **String, Array, Class, Interface**.

Khác biệt:
- **Primitive**: Lưu trực tiếp giá trị trên Stack
- **Reference**: Lưu địa chỉ vùng nhớ trên Heap

\`\`\`java
String str = "Java";           // Reference
int[] numbers = {1, 2, 3};     // Array (Reference)
\`\`\`

## 4. Ép kiểu (Type Casting)

**Ép kiểu ngầm (Implicit):** Tự động, từ nhỏ → lớn
\`\`\`java
int i = 100;
long l = i;       // int → long (OK)
double d = i;     // int → double (OK)
\`\`\`

**Ép kiểu tường minh (Explicit):** Cần chỉ định, từ lớn → nhỏ
\`\`\`java
double d = 9.78;
int i = (int) d;  // 9 (mất phần thập phân)
\`\`\`

## 5. Hằng số (final)

\`\`\`java
final double PI = 3.14159;
// PI = 3.0; // ❌ Lỗi! Không thể gán lại
\`\`\`

## 📝 Checklist

- [ ] Khai báo được biến với các kiểu primitive
- [ ] Phân biệt primitive vs reference
- [ ] Biết cách ép kiểu
- [ ] Dùng final để khai báo hằng số`,checklist:[`Khai báo được biến với các kiểu primitive`,`Phân biệt primitive vs reference`,`Biết cách ép kiểu implicit và explicit`,`Dùng final để khai báo hằng số`]},{file:`Bai2_CauDieuKien_VongLap.md`,title:`📄 BÀI 2 — CÂU ĐIỀU KIỆN & VÒNG LẶP`,content:`---

## 1. Câu điều kiện if-else

\`\`\`java
int diem = 85;

if (diem >= 90) {
    System.out.println("Xuất sắc");
} else if (diem >= 75) {
    System.out.println("Khá");
} else if (diem >= 50) {
    System.out.println("Trung bình");
} else {
    System.out.println("Cần cố gắng");
}
\`\`\`

## 2. switch-case

\`\`\`java
int day = 2;
String dayName;
switch (day) {
    case 1: dayName = "Chủ nhật"; break;
    case 2: dayName = "Thứ hai"; break;
    case 3: dayName = "Thứ ba"; break;
    default: dayName = "Không hợp lệ";
}
// Java 14+: switch expression
String res = switch (day) {
    case 1 -> "Chủ nhật";
    case 2 -> "Thứ hai";
    default -> "Không rõ";
};
\`\`\`

## 3. Vòng lặp for

\`\`\`java
// For thường
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// For-each
int[] nums = {10, 20, 30};
for (int n : nums) {
    System.out.println(n);
}
\`\`\`

## 4. Vòng lặp while / do-while

\`\`\`java
// While — kiểm tra trước khi chạy
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}

// Do-while — chạy ít nhất 1 lần
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 5);
\`\`\`

## 5. break & continue

\`\`\`java
for (int i = 0; i < 10; i++) {
    if (i == 3) continue; // bỏ qua i=3
    if (i == 7) break;    // dừng khi i=7
    System.out.println(i); // in: 0,1,2,4,5,6
}
\`\`\`

## 📝 Checklist

- [ ] Viết được if-else và switch-case
- [ ] Viết được for, while, do-while
- [ ] Biết khi nào dùng break, continue`,checklist:[`Viết được if-else và switch-case`,`Viết được for, while, do-while`,`Biết khi nào dùng break, continue`]},{file:`Bai3_Mang_Chuoi.md`,title:`📄 BÀI 3 — MẢNG & CHUỖI`,content:`---

## 1. Mảng (Array)

Mảng lưu nhiều giá trị cùng kiểu, kích thước cố định.

\`\`\`java
// Khai báo và khởi tạo
int[] numbers = new int[5];       // {0,0,0,0,0}
int[] values = {10, 20, 30, 40};
String[] names = {"An", "Bình", "Chi"};

// Duyệt mảng
for (int i = 0; i < values.length; i++) {
    System.out.println(values[i]);
}

// Mảng 2 chiều
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};
System.out.println(matrix[1][2]); // 6
\`\`\`

## 2. String — Chuỗi trong Java

**String là immutable** — không thể thay đổi sau khi tạo.

\`\`\`java
String s1 = "Hello";
String s2 = "Hello";        // Cùng String Pool
String s3 = new String("Hello"); // Heap

// So sánh
System.out.println(s1 == s2);        // true (cùng reference)
System.out.println(s1 == s3);        // false
System.out.println(s1.equals(s3));   // true (so sánh nội dung)
\`\`\`

## 3. Các phương thức String thông dụng

\`\`\`java
String s = "  Java Programming  ";
s.length();              // 19
s.charAt(0);             // 'J'
s.substring(0, 4);       // "Java"
s.trim();                // "Java Programming"
s.toLowerCase();         // "java programming"
s.split(" ");            // ["Java", "Programming"]
s.contains("Java");     // true
s.replace("Java", "Python");  // "Python Programming"
\`\`\`

## 4. StringBuilder & StringBuffer

\`\`\`java
// Nối chuỗi hiệu quả
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
String result = sb.toString();  // "Hello World"
\`\`\`

## 📝 Checklist

- [ ] Khai báo và duyệt mảng 1 chiều, 2 chiều
- [ ] Phân biệt String Pool và new String
- [ ] Dùng các phương thức String cơ bản
- [ ] Biết StringBuilder và khi nào dùng`,checklist:[`Khai báo và duyệt mảng 1 chiều, 2 chiều`,`Phân biệt String Pool và new String`,`Dùng các phương thức String cơ bản`,`Biết StringBuilder và khi nào dùng`]},{file:`Bai4_OOP.md`,title:`📄 BÀI 4 — HƯỚNG ĐỐI TƯỢNG OOP`,content:`---

## 1. Class & Object

\`\`\`java
public class SinhVien {
    // Thuộc tính (fields)
    private String maSV;
    private String hoTen;
    private double diemTB;

    // Constructor
    public SinhVien(String maSV, String hoTen) {
        this.maSV = maSV;
        this.hoTen = hoTen;
    }

    // Phương thức (methods)
    public void hienThi() {
        System.out.println(maSV + " - " + hoTen);
    }

    // Getter / Setter
    public double getDiemTB() { return diemTB; }
    public void setDiemTB(double d) { this.diemTB = d; }
}

// Sử dụng
SinhVien sv = new SinhVien("SV001", "Nguyễn Văn A");
sv.setDiemTB(8.5);
sv.hienThi();
\`\`\`

## 2. 4 Tính chất OOP

| Tính chất | Ý nghĩa | Ví dụ |
|---|---|---|
| **Đóng gói** | Ẩn dữ liệu, chỉ truy cập qua getter/setter | \`private\`, \`public\` |
| **Kế thừa** | Class con kế thừa class cha | \`extends\` |
| **Đa hình** | Cùng method nhưng hành vi khác nhau | Overriding, Overloading |
| **Trừu tượng** | Chỉ định nghĩa, không implement chi tiết | \`abstract class\`, \`interface\` |

## 3. Kế thừa (Inheritance)

\`\`\`java
public class Nguoi {
    protected String ten;
    protected int tuoi;
}

public class SinhVien extends Nguoi {
    private String maSV;

    public void hienThi() {
        System.out.println(ten + " - " + maSV);
    }
}
\`\`\`

## 4. Đa hình (Polymorphism)

**Overloading** — cùng tên, khác tham số:
\`\`\`java
public int cong(int a, int b) { return a + b; }
public double cong(double a, double b) { return a + b; }
\`\`\`

**Overriding** — class con ghi đè method class cha:
\`\`\`java
@Override
public String toString() {
    return "SinhVien{" + maSV + "}";
}
\`\`\`

## 5. Interface & Abstract Class

\`\`\`java
// Interface
interface MayBay {
    void bay();  // abstract method
}

// Abstract class
abstract class DongVat {
    abstract void keu();
    void an() { System.out.println("Ăn..."); }
}

class Cho extends DongVat implements MayBay {
    @Override
    void keu() { System.out.println("Gâu gâu"); }
    @Override
    public void bay() { System.out.println(...
}
\`\`\`

## 6. Từ khóa static & final

\`\`\`java
public class MathUtils {
    public static final double PI = 3.14159;
    public static int count = 0;

    public static int cong(int a, int b) {
        return a + b;
    }
}
// Gọi: MathUtils.cong(1, 2)
\`\`\`

## 📝 Checklist

- [ ] Viết được class với fields, constructor, methods
- [ ] Áp dụng đóng gói (private + getter/setter)
- [ ] Dùng kế thừa (extends) và ghi đè (Override)
- [ ] Phân biệt Overloading vs Overriding
- [ ] Biết Interface và Abstract Class khác nhau thế nào`,checklist:[`Viết được class với fields, constructor, methods`,`Áp dụng đóng gói (private + getter/setter)`,`Dùng kế thừa (extends) và ghi đè (Override)`,`Phân biệt Overloading vs Overriding`,`Biết Interface và Abstract Class khác nhau thế nào`]},{file:`Bai5_Collection_Generic.md`,title:`📄 BÀI 5 — COLLECTION & GENERIC`,content:`---

## 1. Collection Framework

\`\`\`
Collection
├── List (có thứ tự, cho phép trùng)
│   ├── ArrayList
│   └── LinkedList
├── Set (không trùng)
│   ├── HashSet
│   └── TreeSet
└── Queue (hàng đợi)
    └── PriorityQueue

Map (key-value)
├── HashMap
└── TreeMap
\`\`\`

## 2. ArrayList — Danh sách động

\`\`\`java
List<String> list = new ArrayList<>();
list.add("Java");
list.add("Python");
list.add(1, "C++");  // chèn vào vị trí 1
String s = list.get(0);  // "Java"
list.remove(0);
list.size();  // 2
\`\`\`

## 3. HashMap — Lưu key-value

\`\`\`java
Map<String, Integer> map = new HashMap<>();
map.put("Apple", 100);
map.put("Banana", 50);
int price = map.get("Apple");  // 100

for (Map.Entry<String, Integer> e : map.entrySet()) {
    System.out.println(e.getKey() + " = " + e.getValue());
}
\`\`\`

## 4. Generic — Kiểu tổng quát

\`\`\`java
// Lớp generic
public class Box<T> {
    private T value;
    public void set(T v) { this.value = v; }
    public T get() { return value; }
}

Box<Integer> intBox = new Box<>();
intBox.set(100);

Box<String> strBox = new Box<>();
strBox.set("Hello");
\`\`\`

## 5. Duyệt Collection với for-each & Stream

\`\`\`java
List<String> list = Arrays.asList("Java", "Python", "Go");

// For-each
for (String s : list) {
    System.out.println(s);
}

// Stream API
list.stream()
    .filter(s -> s.startsWith("J"))
    .forEach(System.out::println);
\`\`\`

## 📝 Checklist

- [ ] Dùng ArrayList để lưu danh sách động
- [ ] Dùng HashMap để lưu key-value
- [ ] Viết được lớp generic
- [ ] Duyệt collection với for-each và Stream`,checklist:[`Dùng ArrayList để lưu danh sách động`,`Dùng HashMap để lưu key-value`,`Viết được lớp generic`,`Duyệt collection với for-each và Stream`]},{file:`Bai6_CauTrucDuLieu.md`,title:`📄 BÀI 6 — CẤU TRÚC DỮ LIỆU CƠ BẢN`,content:`---

## 1. Stack (Ngăn xếp) — LIFO

Vào sau ra trước. Dùng: undo, call stack, duyệt cây.

\`\`\`java
Deque<String> stack = new ArrayDeque<>();
stack.push("A");   // thêm vào đỉnh
stack.push("B");
stack.push("C");
String top = stack.pop();  // "C" (lấy ra từ đỉnh)
\`\`\`

## 2. Queue (Hàng đợi) — FIFO

Vào trước ra trước. Dùng: lịch in, xử lý tác vụ.

\`\`\`java
Queue<String> queue = new LinkedList<>();
queue.offer("A");   // thêm vào cuối
queue.offer("B");
queue.offer("C");
String first = queue.poll();  // "A" (lấy ra từ đầu)
\`\`\`

## 3. Linked List

Danh sách liên kết, mỗi phần tử chứa dữ liệu + link đến phần tử kế.

\`\`\`java
class Node {
    int data;
    Node next;

    Node(int data) { this.data = data; }
}

Node head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);
\`\`\`

## 4. Binary Tree

\`\`\`java
class TreeNode {
    int value;
    TreeNode left, right;

    TreeNode(int v) { this.value = v; }
}

//        1
//       / \\
//      2   3
//     / \\
//    4   5
TreeNode root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
\`\`\`

## 📝 Checklist

- [ ] Biết stack (LIFO) và queue (FIFO)
- [ ] Dùng Deque và Queue trong Java
- [ ] Cài đặt Linked List cơ bản
- [ ] Biết cấu trúc Binary Tree`,checklist:[`Biết stack (LIFO) và queue (FIFO)`,`Dùng Deque và Queue trong Java`,`Cài đặt Linked List cơ bản`,`Biết cấu trúc Binary Tree`]},{file:`Bai7_ThuatToan.md`,title:`📄 BÀI 7 — GIẢI THUẬT CƠ BẢN`,content:`---

## 1. Tìm kiếm tuyến tính (Linear Search)

\`\`\`java
int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
// O(n)
\`\`\`

## 2. Tìm kiếm nhị phân (Binary Search)

**Mảng phải được sắp xếp trước.**

\`\`\`java
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
// O(log n)
\`\`\`

## 3. Bubble Sort

\`\`\`java
void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}
// O(n²)
\`\`\`

## 4. Selection Sort

\`\`\`java
void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        int minIdx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}
// O(n²)
\`\`\`

## 5. Đệ quy (Recursion)

\`\`\`java
// Giai thừa
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Fibonacci
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}
\`\`\`

## 📝 Checklist

- [ ] Viết được Linear Search và Binary Search
- [ ] Viết được Bubble Sort và Selection Sort
- [ ] Hiểu độ phức tạp O(n), O(log n), O(n²)
- [ ] Viết được hàm đệ quy`,checklist:[`Viết được Linear Search và Binary Search`,`Viết được Bubble Sort và Selection Sort`,`Hiểu độ phức tạp O(n), O(log n), O(n²)`,`Viết được hàm đệ quy`]},{file:`Bai8_SQL.md`,title:`📄 BÀI 8 — SQL CƠ BẢN`,content:`---

## 1. SELECT — Truy vấn dữ liệu

\`\`\`sql
SELECT * FROM sinh_vien;
SELECT ma_sv, ho_ten FROM sinh_vien WHERE diem_tb >= 5;
SELECT * FROM sinh_vien ORDER BY diem_tb DESC LIMIT 10;
\`\`\`

## 2. INSERT — Thêm dữ liệu

\`\`\`sql
INSERT INTO sinh_vien (ma_sv, ho_ten, diem_tb)
VALUES ('SV001', 'Nguyễn Văn A', 8.5);
\`\`\`

## 3. UPDATE & DELETE — Cập nhật & Xóa

\`\`\`sql
UPDATE sinh_vien SET diem_tb = 9.0 WHERE ma_sv = 'SV001';
DELETE FROM sinh_vien WHERE ma_sv = 'SV001';
\`\`\`

## 4. JOIN — Kết nối bảng

\`\`\`sql
SELECT sv.ho_ten, lh.ten_lop
FROM sinh_vien sv
JOIN lop_hoc lh ON sv.ma_lop = lh.ma_lop;
\`\`\`

## 5. GROUP BY & HAVING

\`\`\`sql
SELECT ma_lop, COUNT(*) AS so_luong, AVG(diem_tb) AS diem_tb
FROM sinh_vien
GROUP BY ma_lop
HAVING AVG(diem_tb) > 5;
\`\`\`

## 📝 Checklist

- [ ] Viết SELECT, INSERT, UPDATE, DELETE
- [ ] Dùng JOIN để kết nối bảng
- [ ] Dùng GROUP BY và HAVING`,checklist:[`Viết SELECT, INSERT, UPDATE, DELETE`,`Dùng JOIN để kết nối bảng`,`Dùng GROUP BY và HAVING`]},{file:`Bai9_JDBC_Database.md`,title:`📄 BÀI 9 — JDBC & DATABASE`,content:`---

## 1. Kết nối Database với JDBC

\`\`\`java
String url = "jdbc:mysql://localhost:3306/quanly";
String user = "root";
String pass = "password";

Connection conn = DriverManager.getConnection(url, user, pass);
\`\`\`

## 2. Truy vấn với Statement

\`\`\`java
Statement stmt = conn.createStatement();

// SELECT
ResultSet rs = stmt.executeQuery("SELECT * FROM sinh_vien");
while (rs.next()) {
    System.out.println(rs.getString("ho_ten"));
}

// INSERT / UPDATE / DELETE
int rows = stmt.executeUpdate("DELETE FROM sinh_vien WHERE ma_sv='SV001'");
\`\`\`

## 3. PreparedStatement — Chống SQL Injection

\`\`\`java
String sql = "INSERT INTO sinh_vien (ma_sv, ho_ten) VALUES (?, ?)";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, "SV002");
ps.setString(2, "Trần Văn B");
ps.executeUpdate();
\`\`\`

## 4. DAO Pattern

\`\`\`java
public class SinhVienDAO {
    private Connection conn;

    public List<SinhVien> getAll() {
        List<SinhVien> list = new ArrayList<>();
        String sql = "SELECT * FROM sinh_vien";
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                SinhVien sv = new SinhVien(
                    rs.getString("ma_sv"),
                    rs.getString("ho_ten")
                );
                list.add(sv);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}
\`\`\`

## 📝 Checklist

- [ ] Kết nối JDBC với database
- [ ] Dùng Statement và ResultSet
- [ ] Dùng PreparedStatement chống SQL Injection
- [ ] Áp dụng DAO Pattern`,checklist:[`Kết nối JDBC với database`,`Dùng Statement và ResultSet`,`Dùng PreparedStatement chống SQL Injection`,`Áp dụng DAO Pattern`]},{file:`Bai10_GitCoBan.md`,title:`📄 BÀI 10 — GIT CƠ BẢN`,content:`---

## 1. Git là gì?

Hệ thống quản lý phiên bản phân tán, theo dõi lịch sử thay đổi code.

## 2. Cấu hình ban đầu

\`\`\`bash
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
\`\`\`

## 3. Các lệnh cơ bản

\`\`\`bash
git init          # Khởi tạo repository
git clone <url>   # Clone repo từ xa
git add .         # Stage tất cả thay đổi
git commit -m "msg"  # Tạo commit
git push          # Đẩy lên remote
git pull          # Kéo từ remote
git status        # Xem trạng thái
git log --oneline # Xem lịch sử commit
\`\`\`

## 4. Branch (Nhánh)

\`\`\`bash
git branch          # Xem danh sách branch
git branch feature-x  # Tạo branch mới
git checkout feature-x    # Chuyển sang branch
git checkout -b feature-x # Tạo + chuyển

git merge feature-x   # Merge vào branch hiện tại
git branch -d feature-x  # Xóa branch
\`\`\`

## 5. Git Flow cơ bản

\`\`\`bash
# Làm việc với feature
git checkout -b feature/login
git add .
git commit -m "Thêm chức năng login"
git checkout main
git merge feature/login
git push
\`\`\`

## 6. .gitignore

File chứa danh sách file/thư mục Git bỏ qua:

\`\`\`
node_modules/
*.log
.env
target/
.idea/
\`\`\`

## 📝 Checklist

- [ ] Cấu hình git lần đầu (user.name, user.email)
- [ ] Tạo commit và push code lên GitHub
- [ ] Tạo branch mới và merge
- [ ] Viết .gitignore cơ bản`,checklist:[`Cấu hình git lần đầu (user.name, user.email)`,`Tạo commit và push code lên GitHub`,`Tạo branch mới và merge`,`Viết .gitignore cơ bản`]},{file:`Bai11_SpringBoot.md`,title:`📄 BÀI 11 — SPRING BOOT`,content:`---

## 1. Spring Boot là gì?

Spring Boot là framework giúp xây dựng ứng dụng Spring nhanh chóng với cấu hình tối thiểu (auto-configuration).

**Ưu điểm:**
- Tự động cấu hình (Auto-configuration)
- Embedded server (Tomcat, Jetty)
- Starter dependencies — giảm thiểu việc quản lý version
- Production-ready (metrics, health check)

## 2. IoC & DI (Inversion of Control & Dependency Injection)

**IoC**: Spring container quản lý vòng đời của các object (bean).
**DI**: Spring tự động inject dependency thay vì new thủ công.

\`\`\`java
@Component
public class EmailService {
    public void send(String to, String msg) {
        System.out.println("Gửi email tới: " + to);
    }
}

@Service
public class UserService {
    @Autowired
    private EmailService emailService;

    public void register(String email) {
        System.out.println("Đăng ký user: " + email);
        emailService.send(email, "Chào mừng bạn!");
    }
}
\`\`\`

## 3. @SpringBootApplication

Annotation chính, kết hợp 3 annotation:
- \`@Configuration\` — đánh dấu class chứa bean
- \`@EnableAutoConfiguration\` — tự động cấu hình
- \`@ComponentScan\` — quét component trong package

\`\`\`java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
\`\`\`

## 4. Spring Boot Starters

Starters là các dependency bundle cho từng tính năng:

| Starter | Mục đích |
|---|---|
| \`spring-boot-starter-web\` | Xây dựng REST API, nhúng Tomcat |
| \`spring-boot-starter-data-jpa\` | JPA + Hibernate |
| \`spring-boot-starter-security\` | Spring Security |
| \`spring-boot-starter-test\` | JUnit 5, Mockito, Testcontainers |
| \`spring-boot-starter-validation\` | Bean Validation (@Valid) |

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
\`\`\`

## 5. Cấu trúc project Spring Boot

\`\`\`
src/main/java/com/example/
├── Application.java          # Main class
├── controller/                # REST controllers
├── service/                   # Business logic
├── repository/                # Database access
├── model/entity/              # JPA entities
├── config/                    # Configuration classes
└── dto/                       # Data Transfer Objects

src/main/resources/
├── application.properties     # Cấu hình
└── static/                    # Static resources
\`\`\`

## 6. application.properties

\`\`\`properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=123456
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
\`\`\`

## 📝 Checklist

- [ ] Tạo được Spring Boot project với Spring Initializr
- [ ] Hiểu IoC và cách DI hoạt động
- [ ] Biết các starter phổ biến
- [ ] Cấu hình application.properties cơ bản
- [ ] Biết cấu trúc thư mục project Spring Boot`,checklist:[`Tạo được Spring Boot project với Spring Initializr`,`Hiểu IoC và cách DI hoạt động`,`Biết các starter phổ biến`,`Cấu hình application.properties cơ bản`,`Biết cấu trúc thư mục project Spring Boot`]},{file:`Bai12_REST_API.md`,title:`📄 BÀI 12 — REST API VỚI SPRING BOOT`,content:`---

## 1. REST API là gì?

REST (Representational State Transfer) — kiến trúc API dùng HTTP method để thao tác tài nguyên.

| HTTP Method | Chức năng | SQL tương ứng |
|---|---|---|
| \`GET\` | Lấy dữ liệu | SELECT |
| \`POST\` | Tạo mới | INSERT |
| \`PUT\` | Cập nhật toàn bộ | UPDATE |
| \`PATCH\` | Cập nhật một phần | UPDATE |
| \`DELETE\` | Xóa | DELETE |

## 2. @RestController

\`\`\`java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> getAllUsers() {
        // GET /api/users
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        // GET /api/users/1
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        // POST /api/users
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        // PUT /api/users/1
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        // DELETE /api/users/1
    }
}
\`\`\`

## 3. Request Parameters & Path Variables

\`\`\`java
// Path variable: /api/users/5
@GetMapping("/{id}")
public User getById(@PathVariable Long id)

// Query param: /api/users?page=1&size=10
@GetMapping
public List<User> getAll(@RequestParam(defaultValue = "0") int page,
                         @RequestParam(defaultValue = "10") int size)
\`\`\`

## 4. HTTP Status Codes với ResponseEntity

\`\`\`java
@PostMapping
public ResponseEntity<User> create(@RequestBody User user) {
    User saved = userService.save(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}

@GetMapping("/{id}")
public ResponseEntity<User> get(@PathVariable Long id) {
    return userService.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
}
\`\`\`

| Status Code | Ý nghĩa |
|---|---|
| \`200 OK\` | Thành công |
| \`201 Created\` | Tạo mới thành công |
| \`400 Bad Request\` | Dữ liệu không hợp lệ |
| \`404 Not Found\` | Không tìm thấy tài nguyên |
| \`500 Internal Server Error\` | Lỗi server |

## 5. Validation với @Valid

\`\`\`java
public class UserDTO {
    @NotBlank(message = "Tên không được để trống")
    private String name;

    @Email(message = "Email không hợp lệ")
    private String email;

    @Min(value = 18, message = "Tuổi phải >= 18")
    private int age;
}

@PostMapping
public ResponseEntity<User> create(@Valid @RequestBody UserDTO dto) {
    // Spring tự động validate trước khi vào method
}
\`\`\`

## 6. Exception Handling với @ExceptionHandler

\`\`\`java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
}
\`\`\`

## 📝 Checklist

- [ ] Viết REST API với @RestController
- [ ] Dùng đúng HTTP methods (GET, POST, PUT, DELETE)
- [ ] Xử lý path variable và query param
- [ ] Trả về HTTP status code phù hợp với ResponseEntity
- [ ] Validate request body với @Valid`,checklist:[`Viết REST API với @RestController`,`Dùng đúng HTTP methods (GET, POST, PUT, DELETE)`,`Xử lý path variable và query param`,`Trả về HTTP status code phù hợp với ResponseEntity`,`Validate request body với @Valid`]},{file:`Bai13_JPA_Hibernate.md`,title:`📄 BÀI 13 — JPA & HIBERNATE`,content:`---

## 1. JPA & Hibernate là gì?

- **JPA** (Java Persistence API) — specification, chuẩn ORM trong Java
- **Hibernate** — implementation phổ biến nhất của JPA

**ORM** (Object-Relational Mapping): ánh xạ Java object ↔ database table.

## 2. Entity — Ánh xạ bảng

\`\`\`java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true)
    private String email;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Getters & Setters
}
\`\`\`

## 3. Quan hệ giữa các Entity

\`\`\`java
// One-to-Many: User có nhiều Post
@Entity
public class User {
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts;
}

// Many-to-One: Mỗi Post thuộc về một User
@Entity
public class Post {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}

// Many-to-Many: User có nhiều Role
@Entity
public class User {
    @ManyToMany
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;
}
\`\`\`

## 4. Repository — Truy vấn dữ liệu

\`\`\`java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Query methods — Spring Data JPA tự sinh SQL
    Optional<User> findByEmail(String email);
    List<User> findByFullNameContaining(String keyword);
    boolean existsByEmail(String email);

    // JPQL — custom query
    @Query("SELECT u FROM User u WHERE u.email LIKE %:domain%")
    List<User> findByEmailDomain(@Param("domain") String domain);

    // Native SQL
    @Query(value = "SELECT * FROM users WHERE age > :minAge", nativeQuery = true)
    List<User> findAdultUsers(@Param("minAge") int minAge);
}
\`\`\`

## 5. Fetch Types — Lazy vs Eager

| Fetch Type | Hành vi | Khi nào dùng |
|---|---|---|
| \`EAGER\` | Load ngay tất cả dữ liệu liên quan | Quan hệ nhỏ, luôn cần |
| \`LAZY\` | Chỉ load khi được truy cập (proxy) | Quan hệ lớn, ít khi dùng đến |

\`\`\`java
// N+1 Problem: Khi LAZY load từng entity → n+1 câu query
// Giải pháp: JOIN FETCH
@Query("SELECT u FROM User u JOIN FETCH u.posts")
List<User> findAllWithPosts();
\`\`\`

## 6. N+1 Query Problem

**Vấn đề:**
\`\`\`java
List<User> users = userRepository.findAll();  // 1 query
for (User u : users) {
    System.out.println(u.getPosts().size());  // N query!
}
// Tổng: 1 + N queries
\`\`\`

**Giải pháp:**
- \`JOIN FETCH\` trong JPQL
- \`@EntityGraph\`
- \`@BatchSize(size = 10)\`

\`\`\`java
@EntityGraph(attributePaths = {"posts"})
@Query("SELECT u FROM User u")
List<User> findAllWithPosts();
\`\`\`

## 📝 Checklist

- [ ] Định nghĩa Entity và các annotation cơ bản
- [ ] Thiết lập quan hệ One-to-Many, Many-to-One, Many-to-Many
- [ ] Viết Repository với Spring Data JPA
- [ ] Phân biệt LAZY và EAGER fetch
- [ ] Hiểu và tránh N+1 query problem`,checklist:[`Định nghĩa Entity và các annotation cơ bản`,`Thiết lập quan hệ One-to-Many, Many-to-One, Many-to-Many`,`Viết Repository với Spring Data JPA`,`Phân biệt LAZY và EAGER fetch`,`Hiểu và tránh N+1 query problem`]},{file:`Bai14_Transaction.md`,title:`📄 BÀI 14 — TRANSACTION MANAGEMENT`,content:`---

## 1. Transaction là gì?

Transaction là một nhóm thao tác được thực hiện như một đơn vị — **tất cả thành công hoặc tất cả rollback**.

**ACID:**
| Tính chất | Ý nghĩa |
|---|---|
| **Atomicity** | Toàn bộ hoặc không gì cả |
| **Consistency** | Dữ liệu luôn hợp lệ |
| **Isolation** | Các transaction không ảnh hưởng lẫn nhau |
| **Durability** | Kết quả được lưu vĩnh viễn |

## 2. @Transactional trong Spring

\`\`\`java
@Service
public class PaymentService {

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        Account from = accountRepository.findById(fromId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
        Account to = accountRepository.findById(toId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        from.setBalance(from.getBalance().subtract(amount));
        accountRepository.save(from);

        to.setBalance(to.getBalance().add(amount));
        accountRepository.save(to);

        // Nếu có lỗi xảy ra, cả 2 lệnh save đều rollback
    }
}
\`\`\`

## 3. Transaction Propagation

Xác định cách transaction hoạt động khi method này gọi method khác.

| Propagation | Hành vi |
|---|---|
| \`REQUIRED\` (default) | Dùng transaction hiện tại, tạo mới nếu chưa có |
| \`REQUIRES_NEW\` | Luôn tạo transaction mới, tạm dừng transaction cũ |
| \`NESTED\` | Tạo sub-transaction, rollback độc lập |
| \`MANDATORY\` | Phải có transaction, không có thì ném lỗi |
| \`NEVER\` | Không được chạy trong transaction |
| \`SUPPORTS\` | Có hay không cũng được |
| \`NOT_SUPPORTED\` | Tạm dừng transaction hiện tại, chạy không transaction |

\`\`\`java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void logAudit(String action) {
    // Luôn chạy trong transaction riêng, không bị ảnh hưởng bởi rollback bên ngoài
}
\`\`\`

## 4. Transaction Isolation

Kiểm soát mức độ ảnh hưởng giữa các transaction đồng thời.

| Isolation | Dirty Read | Non-repeatable Read | Phantom Read |
|---|---|---|---|
| \`READ_UNCOMMITTED\` | ✅ Có | ✅ Có | ✅ Có |
| \`READ_COMMITTED\` (default) | ❌ Không | ✅ Có | ✅ Có |
| \`REPEATABLE_READ\` | ❌ Không | ❌ Không | ✅ Có |
| \`SERIALIZABLE\` | ❌ Không | ❌ Không | ❌ Không |

\`\`\`java
@Transactional(isolation = Isolation.SERIALIZABLE)
public void processPayment(Long orderId) {
    // Chạy ở mức isolation cao nhất, tránh mọi vấn đề đồng thời
}
\`\`\`

## 5. Rollback Rules

\`\`\`java
// Chỉ rollback khi có RuntimeException (mặc định)
@Transactional
public void doSomething() { }

// Rollback với checked exception
@Transactional(rollbackFor = SQLException.class)
public void doSomething() { }

// Không rollback với exception cụ thể
@Transactional(noRollbackFor = BusinessException.class)
public void doSomething() { }

// Rollback với tên exception
@Transactional(rollbackForClassName = {"java.sql.SQLException"})
public void doSomething() { }
\`\`\`

## 6. @Transactional(readOnly = true)

\`\`\`java
@Transactional(readOnly = true)
public List<User> getAllUsers() {
    // Tối ưu: Hibernate tắt dirty checking
    // DB có thể tối ưu đường truyền (read-only connection)
    return userRepository.findAll();
}
\`\`\`

## 📝 Checklist

- [ ] Hiểu khái niệm transaction và ACID
- [ ] Dùng @Transactional quản lý transaction
- [ ] Phân biệt các mức propagation
- [ ] Phân biệt các mức isolation
- [ ] Biết cách cấu hình rollback và readOnly`,checklist:[`Hiểu khái niệm transaction và ACID`,`Dùng @Transactional quản lý transaction`,`Phân biệt các mức propagation`,`Phân biệt các mức isolation`,`Biết cách cấu hình rollback và readOnly`]},{file:`Bai15_Security_JWT.md`,title:`📄 BÀI 15 — SPRING SECURITY & JWT`,content:`---

## 1. Spring Security là gì?

Framework bảo mật cho ứng dụng Spring — xử lý authentication (xác thực) và authorization (phân quyền).

## 2. JWT (JSON Web Token)

JWT là token dạng JSON dùng để xác thực, gồm 3 phần:
- **Header**: algorithm & type
- **Payload**: dữ liệu (claims)
- **Signature**: chữ ký xác thực

\`\`\`
header.payload.signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIzIn0.abc123def456
\`\`\`

## 3. Authentication Flow với JWT

\`\`\`
1. Client gửi POST /api/auth/login (username + password)
2. Server xác thực, sinh JWT token và trả về
3. Client lưu token (localStorage / cookie)
4. Client gửi token trong header: Authorization: Bearer <token>
5. Server xác thực token qua Filter
6. Nếu hợp lệ → request được xử lý tiếp
\`\`\`

## 4. Cấu hình Security Filter Chain

\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter();
    }
}
\`\`\`

## 5. JWT Filter

\`\`\`java
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userDetailsService.loadUserByUsername(username);
                if (jwtService.validateToken(token, user)) {
                    UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                            user, null, user.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }
        chain.doFilter(request, response);
    }
}
\`\`\`

## 6. @PreAuthorize — Phân quyền method

\`\`\`java
@EnableMethodSecurity
@SpringBootApplication
public class Application { }

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        // Chỉ ADMIN mới truy cập được
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_USER')")
    public void deleteUser(@PathVariable Long id) {
        // Chỉ user có quyền DELETE_USER mới xóa được
    }
}
\`\`\`

## 📝 Checklist

- [ ] Hiểu luồng xác thực JWT
- [ ] Cấu hình SecurityFilterChain cơ bản
- [ ] Viết JWT filter để xác thực request
- [ ] Dùng @PreAuthorize để phân quyền
- [ ] Phân biệt hasRole vs hasAuthority`,checklist:[`Hiểu luồng xác thực JWT`,`Cấu hình SecurityFilterChain cơ bản`,`Viết JWT filter để xác thực request`,`Dùng @PreAuthorize để phân quyền`,`Phân biệt hasRole vs hasAuthority`]},{file:`Bai16_Docker.md`,title:`📄 BÀI 16 — DOCKER`,content:`---

## 1. Docker là gì?

Docker là nền tảng đóng gói và chạy ứng dụng trong container — môi trường nhẹ, cô lập, di động.

| Khái niệm | Giải thích |
|---|---|
| **Image** | Bản snapshot (template) chứa code, OS, thư viện — chỉ đọc |
| **Container** | Instance chạy từ image — có thể đọc/ghi |
| **Dockerfile** | File hướng dẫn cách build image |
| **Volume** | Lưu dữ liệu persistent, chia sẻ giữa host và container |
| **Network** | Kết nối các container với nhau |

## 2. Dockerfile

\`\`\`dockerfile
# Base image
FROM openjdk:17-jdk-slim

# Thông tin tác giả
LABEL author="Học Code"

# Thư mục làm việc
WORKDIR /app

# Copy JAR vào container
COPY target/app.jar app.jar

# Expose port
EXPOSE 8080

# Lệnh chạy
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

Build và chạy:
\`\`\`bash
docker build -t my-app .
docker run -d -p 8080:8080 --name my-app-container my-app
\`\`\`

## 3. Docker Compose

Docker Compose quản lý nhiều container cùng lúc (ví dụ: app + database).

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/mydb
      SPRING_DATASOURCE_PASSWORD: root123
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: mydb
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
\`\`\`

Chạy toàn bộ:
\`\`\`bash
docker-compose up -d        # Khởi động
docker-compose down         # Dừng và xóa container
docker-compose logs -f      # Xem log
\`\`\`

## 4. Docker commands cơ bản

\`\`\`bash
# Image
docker images                    # Xem danh sách image
docker pull nginx                # Tải image từ Docker Hub
docker rmi nginx                 # Xóa image

# Container
docker ps                        # Container đang chạy
docker ps -a                     # Tất cả container
docker stop <id>                 # Dừng container
docker start <id>                # Khởi động lại
docker rm <id>                   # Xóa container
docker exec -it <id> bash        # Vào container

# Logs & inspect
docker logs -f <id>              # Xem log
docker inspect <id>              # Thông tin chi tiết
\`\`\`

## 5. Multi-stage build (tối ưu image)

\`\`\`dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Run
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

## 📝 Checklist

- [ ] Phân biệt Image vs Container
- [ ] Viết Dockerfile cho Spring Boot app
- [ ] Build và chạy container
- [ ] Dùng Docker Compose cho app + database
- [ ] Biết các lệnh Docker cơ bản`,checklist:[`Phân biệt Image vs Container`,`Viết Dockerfile cho Spring Boot app`,`Build và chạy container`,`Dùng Docker Compose cho app + database`,`Biết các lệnh Docker cơ bản`]},{file:`Bai17_Testing.md`,title:`📄 BÀI 17 — TESTING (JUnit 5 & Mockito)`,content:`---

## 1. Tại sao cần Testing?

- Đảm bảo code hoạt động đúng
- Phát hiện lỗi sớm
- Tự tin refactor code
- Tài liệu sống cho code

**Kim tự tháp Testing:**
\`\`\`
      /\\
     /  \\      E2E Tests (chậm, ít)
    /    \\
   /------\\    Integration Tests
  /        \\
 /----------\\  Unit Tests (nhanh, nhiều)
\`\`\`

## 2. JUnit 5 — Unit Test cơ bản

\`\`\`java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    private Calculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }

    @Test
    void testAddition() {
        assertEquals(5, calculator.add(2, 3));
    }

    @Test
    void testDivisionByZero() {
        assertThrows(ArithmeticException.class,
            () -> calculator.divide(10, 0));
    }

    @Test
    @Disabled("Sẽ fix sau")
    void testNotReady() {
        // Test này bị bỏ qua
    }
}
\`\`\`

## 3. Mockito — Mock dependencies

\`\`\`java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testFindByEmail() {
        // Arrange
        User mockUser = new User(1L, "test@example.com", "Test");
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(mockUser));

        // Act
        User result = userService.findByEmail("test@example.com");

        // Assert
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }
}
\`\`\`

## 4. @WebMvcTest — Test Controller

\`\`\`java
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void testGetAllUsers() throws Exception {
        List<User> users = Arrays.asList(
            new User(1L, "Alice"),
            new User(2L, "Bob")
        );
        when(userService.getAll()).thenReturn(users);

        mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.size()").value(2))
            .andExpect(jsonPath("$[0].name").value("Alice"));
    }

    @Test
    void testCreateUser_Invalid() throws Exception {
        String invalidJson = "{\\"name\\":\\"\\"}";

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest());
    }
}
\`\`\`

## 5. TDD (Test-Driven Development)

**Quy trình TDD — Red-Green-Refactor:**

1. 🔴 **Red** — Viết test trước, test fail
2. 🟢 **Green** — Viết code tối thiểu để test pass
3. 🔵 **Refactor** — Tối ưu code, test vẫn pass

\`\`\`java
// Bước 1 — RED: Viết test
@Test
void testIsPalindrome() {
    assertTrue(StringUtils.isPalindrome("racecar"));
    assertFalse(StringUtils.isPalindrome("hello"));
}

// Bước 2 — GREEN: Viết code tối thiểu
public static boolean isPalindrome(String s) {
    return new StringBuilder(s).reverse().toString().equals(s);
}

// Bước 3 — REFACTOR: Tối ưu (nếu cần)
\`\`\`

## 📝 Checklist

- [ ] Viết unit test với JUnit 5 (@Test, assertThrows, @BeforeEach)
- [ ] Mock dependency với Mockito (@Mock, @InjectMocks, when/verify)
- [ ] Test REST Controller với @WebMvcTest và MockMvc
- [ ] Hiểu quy trình TDD: Red-Green-Refactor
- [ ] Biết các loại test: Unit, Integration, E2E`,checklist:[`Viết unit test với JUnit 5 (@Test, assertThrows, @BeforeEach)`,`Mock dependency với Mockito (@Mock, @InjectMocks, when/verify)`,`Test REST Controller với @WebMvcTest và MockMvc`,`Hiểu quy trình TDD: Red-Green-Refactor`,`Biết các loại test: Unit, Integration, E2E`]},{file:`Bai18_DesignPatterns.md`,title:`📄 BÀI 18 — DESIGN PATTERNS`,content:`---

## 1. Design Pattern là gì?

Các giải pháp chuẩn hóa cho những vấn đề phổ biến trong thiết kế phần mềm.

**3 nhóm:**
| Nhóm | Mục đích | Ví dụ |
|---|---|---|
| **Creational** | Khởi tạo object | Singleton, Builder, Factory |
| **Structural** | Cấu trúc class/object | Adapter, Decorator, Proxy |
| **Behavioral** | Tương tác giữa các object | Strategy, Observer |

## 2. Singleton — Chỉ một instance duy nhất

\`\`\`java
public class DatabaseConnection {
    private static volatile DatabaseConnection instance;

    private DatabaseConnection() { }

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
}

// Usage
DatabaseConnection db = DatabaseConnection.getInstance();
\`\`\`

## 3. Builder — Xây dựng object phức tạp

\`\`\`java
public class User {
    private final String name;    // required
    private final String email;   // required
    private final int age;        // optional
    private final String phone;   // optional

    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.age = builder.age;
        this.phone = builder.phone;
    }

    public static class Builder {
        private final String name;
        private final String email;
        private int age;
        private String phone;

        public Builder(String name, String email) {
            this.name = name;
            this.email = email;
        }

        public Builder age(int age) { this.age = age; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }

        public User build() { return new User(this); }
    }
}

// Usage
User user = new User.Builder("Alice", "alice@example.com")
    .age(25)
    .phone("0123456789")
    .build();
\`\`\`

## 4. Factory — Tạo object mà không lộ logic khởi tạo

\`\`\`java
// Interface
interface Payment {
    void pay(double amount);
}

// Implementations
class CreditCardPayment implements Payment {
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + " bằng thẻ tín dụng");
    }
}
class PayPalPayment implements Payment {
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + " qua PayPal");
    }
}

// Factory
class PaymentFactory {
    public static Payment create(String type) {
        return switch (type) {
            case "credit" -> new CreditCardPayment();
            case "paypal" -> new PayPalPayment();
            default -> throw new IllegalArgumentException("Unknown: " + type);
        };
    }
}

// Usage
Payment payment = PaymentFactory.create("credit");
payment.pay(100.0);
\`\`\`

## 5. Strategy — Thay đổi thuật toán linh hoạt

\`\`\`java
// Strategy interface
interface SortStrategy {
    void sort(int[] arr);
}

// Concrete strategies
class BubbleSortStrategy implements SortStrategy {
    public void sort(int[] arr) {
        System.out.println("Sắp xếp bằng Bubble Sort");
        // Bubble sort implementation
    }
}
class QuickSortStrategy implements SortStrategy {
    public void sort(int[] arr) {
        System.out.println("Sắp xếp bằng Quick Sort");
        // Quick sort implementation
    }
}

// Context
class Sorter {
    private SortStrategy strategy;

    public void setStrategy(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void executeSort(int[] arr) {
        strategy.sort(arr);
    }
}

// Usage
Sorter sorter = new Sorter();
sorter.setStrategy(new QuickSortStrategy());
sorter.executeSort(data);
\`\`\`

## 6. Observer — Thông báo khi có thay đổi

\`\`\`java
import java.util.*;

// Observer interface
interface Observer {
    void update(String message);
}

// Subject
class NewsAgency {
    private List<Observer> observers = new ArrayList<>();
    private String news;

    public void addObserver(Observer o) { observers.add(o); }

    public void setNews(String news) {
        this.news = news;
        notifyAllObservers();
    }

    private void notifyAllObservers() {
        for (Observer o : observers) {
            o.update(news);
        }
    }
}

// Concrete observers
class EmailChannel implements Observer {
    public void update(String msg) {
        System.out.println("Email: " + msg);
    }
}
class SMSChannel implements Observer {
    public void update(String msg) {
        System.out.println("SMS: " + msg);
    }
}

// Usage
NewsAgency agency = new NewsAgency();
agency.addObserver(new EmailChannel());
agency.addObserver(new SMSChannel());
agency.setNews("Học Code được nâng cấp!");
// Output:
// Email: Học Code được nâng cấp!
// SMS: Học Code được nâng cấp!
\`\`\`

## 📝 Checklist

- [ ] Hiểu 3 nhóm Design Pattern: Creational, Structural, Behavioral
- [ ] Implement Singleton pattern
- [ ] Implement Builder pattern
- [ ] Implement Factory và Strategy pattern
- [ ] Implement Observer pattern`,checklist:[`Hiểu 3 nhóm Design Pattern: Creational, Structural, Behavioral`,`Implement Singleton pattern`,`Implement Builder pattern`,`Implement Factory và Strategy pattern`,`Implement Observer pattern`]},{file:`Bai19_Kafka.md`,title:`📄 BÀI 19 — KAFKA CƠ BẢN`,content:`---

## 1. Kafka là gì?

Apache Kafka là nền tảng streaming phân tán — publish/subscribe message system, xử lý hàng triệu message/giây.

**Các khái niệm chính:**
| Khái niệm | Giải thích |
|---|---|
| **Producer** | Ứng dụng gửi message |
| **Consumer** | Ứng dụng nhận message |
| **Topic** | Kênh phân loại message |
| **Partition** | Chia nhỏ topic để scale |
| **Broker** | Server Kafka |
| **Consumer Group** | Nhóm consumer cùng xử lý topic |

## 2. Kiến trúc Kafka

\`\`\`
Producer1 ---|
             |---> [Topic A / Partition 0] ---> Consumer Group X
Producer2 ---|                                    |-- Consumer 1
             |---> [Topic A / Partition 1] -------|-- Consumer 2
                                                  |-- Consumer 3
\`\`\`

## 3. Cài đặt Kafka với Docker

\`\`\`yaml
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
\`\`\`

## 4. Producer — Gửi message

\`\`\`java
@Configuration
public class KafkaConfig {

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
            StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
            StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(props);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}

@Service
public class MessageProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message);
        System.out.println("Đã gửi: " + message + " tới topic: " + topic);
    }

    public void sendWithKey(String topic, String key, String message) {
        kafkaTemplate.send(topic, key, message);
        // Cùng key → cùng partition → đảm bảo thứ tự
    }
}
\`\`\`

## 5. Consumer — Nhận message

\`\`\`java
@Service
public class MessageConsumer {

    @KafkaListener(topics = "notification", groupId = "notification-group")
    public void listen(String message) {
        System.out.println("Nhận được: " + message);
        // Xử lý message
    }

    @KafkaListener(topics = "order-events", groupId = "order-group")
    public void listenWithHeaders(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_KEY) String key,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {
        System.out.printf("Key: %s, Partition: %d, Offset: %d%n",
            key, partition, offset);
        System.out.println("Message: " + message);
    }
}
\`\`\`

## 6. Topic & Partition

**Tạo topic:**
\`\`\`bash
docker exec -it kafka kafka-topics --create \\
  --topic notification \\
  --bootstrap-server localhost:9092 \\
  --partitions 3 \\
  --replication-factor 1
\`\`\`

**Key insights về Partition:**
- Partition cho phép Kafka scale ngang
- Message cùng key luôn vào cùng partition → giữ đúng thứ tự
- Consumer trong cùng group được chia đều partition
- Số consumer trong group không được vượt quá số partition

\`\`\`java
// Cấu hình consumer group
@KafkaListener(topics = "notification", groupId = "email-group")
// Mỗi consumer trong group nhận một partition khác nhau
\`\`\`

## 📝 Checklist

- [ ] Hiểu kiến trúc Kafka: Producer, Consumer, Topic, Partition
- [ ] Cài đặt Kafka bằng Docker Compose
- [ ] Viết Producer gửi message
- [ ] Viết Consumer nhận message với @KafkaListener
- [ ] Biết cách partition hoạt động và ảnh hưởng đến consumer group`,checklist:[`Hiểu kiến trúc Kafka: Producer, Consumer, Topic, Partition`,`Cài đặt Kafka bằng Docker Compose`,`Viết Producer gửi message`,`Viết Consumer nhận message với @KafkaListener`,`Biết cách partition hoạt động và ảnh hưởng đến consumer group`]},{file:`Bai20_Microservices.md`,title:`📄 BÀI 20 — MICROSERVICES`,content:`---

## 1. Microservices là gì?

Microservices là kiến trúc chia ứng dụng thành các service nhỏ, độc lập, mỗi service đảm nhận một nghiệp vụ cụ thể.

**So sánh Monolithic vs Microservices:**

| Tiêu chí | Monolithic | Microservices |
|---|---|---|
| Triển khai | Một đơn vị duy nhất | Nhiều service riêng lẻ |
| Công nghệ | Đồng nhất | Đa dạng (mỗi service có thể dùng tech khác nhau) |
| Scale | Scale toàn bộ | Scale từng service riêng |
| Độ phức tạp | Thấp (ban đầu) | Cao (cần orchestration) |
| Phát triển | Một team lớn | Nhiều team nhỏ, độc lập |

## 2. Service Discovery

Service Discovery giúp các service tìm thấy nhau trong môi trường động.

\`\`\`yaml
# application.yml — Eureka Server
server:
  port: 8761

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
\`\`\`

\`\`\`java
@EnableEurekaServer
@SpringBootApplication
public class DiscoveryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServiceApplication.class, args);
    }
}

// Service client — đăng ký vào Eureka
@EnableEurekaClient
@SpringBootApplication
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
\`\`\`

## 3. API Gateway

API Gateway là điểm vào duy nhất cho tất cả request, routing đến service phù hợp.

\`\`\`yaml
# application.yml — Spring Cloud Gateway
server:
  port: 8080

spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
        - id: notification-service
          uri: lb://notification-service
          predicates:
            - Path=/api/notifications/**
\`\`\`

\`\`\`java
@EnableDiscoveryClient
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
\`\`\`

## 4. Circuit Breaker (Resilience4j)

Circuit Breaker ngăn lỗi lan truyền khi một service bị lỗi.

\`\`\`java
@Service
public class OrderService {

    @Autowired
    private RestTemplate restTemplate;

    @CircuitBreaker(name = "userService", fallbackMethod = "getDefaultUser")
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            "http://user-service/api/users/" + userId, User.class);
    }

    // Fallback — được gọi khi circuit breaker mở
    public User getDefaultUser(Long userId, Throwable t) {
        System.out.println("User service unavailable, using fallback");
        return new User(userId, "Unknown", "N/A");
    }
}
\`\`\`

**Circuit Breaker states:**
\`\`\`
  CLOSED (bình thường)
    │
    ├── Lỗi vượt ngưỡng → OPEN (từ chối request)
    │
    ├── Sau timeout → HALF_OPEN (thử lại)
    │
    ├── Thử thành công → CLOSED (trở lại bình thường)
    └── Thử thất bại → OPEN (tiếp tục từ chối)
\`\`\`

## 5. Các thành phần khác trong Microservices

| Thành phần | Vai trò | Công nghệ |
|---|---|---|
| **Config Server** | Quản lý cấu hình tập trung | Spring Cloud Config |
| **Distributed Tracing** | Theo dõi request qua nhiều service | Zipkin, Micrometer |
| **Message Queue** | Giao tiếp bất đồng bộ giữa services | Kafka, RabbitMQ |
| **API Gateway** | Routing, rate limiting, auth | Spring Cloud Gateway, Kong |
| **Service Mesh** | Quản lý giao tiếp giữa services | Istio, Linkerd |

\`\`\`java
// Distributed Tracing với Micrometer
@Bean
public ObservationRegistry observationRegistry() {
    return ObservationRegistry.create();
}
\`\`\`

## 📝 Checklist

- [ ] Hiểu sự khác biệt Monolithic vs Microservices
- [ ] Cấu hình Service Discovery với Eureka
- [ ] Cấu hình API Gateway với Spring Cloud Gateway
- [ ] Implement Circuit Breaker với Resilience4j
- [ ] Biết các thành phần khác: Config Server, Tracing, Message Queue`,checklist:[`Hiểu sự khác biệt Monolithic vs Microservices`,`Cấu hình Service Discovery với Eureka`,`Cấu hình API Gateway với Spring Cloud Gateway`,`Implement Circuit Breaker với Resilience4j`,`Biết các thành phần khác: Config Server, Tracing, Message Queue`]}];var f=window.learnTopics,p=`learnChecklist`;function m(){try{return JSON.parse(localStorage.getItem(p)||`{}`)}catch{return{}}}function h(e){try{localStorage.setItem(p,JSON.stringify(e))}catch{}}function g(e,t,n){let r={...n,[e]:t};return h(r),r}function _(e,t){let n=0,r=0;return e.forEach(e=>{e.checklist&&e.checklist.forEach(e=>{n++,t[e]&&r++})}),{done:r,total:n,percent:n>0?Math.round(r/n*100):0}}function v(e,t){let n={0:{done:0,total:0}};return e.forEach((e,r)=>{let i=r+1,a=e.checklist?e.checklist.filter(e=>t[e]).length:0,o=e.checklist?e.checklist.length:0;n[i]={done:a,total:o}}),n}var y={name:`CodeLearnPage`,data(){return{topics:f||[],currentIndex:0,checklist:{}}},computed:{currentTopic(){return this.currentIndex===0?this.topics[0]||null:this.topics[this.currentIndex-1]||null},renderedContent(){if(!this.currentTopic)return``;let e=``;return this.currentTopic.content&&(e+=d(this.currentTopic.content)),this.currentTopic.checklist&&this.currentTopic.checklist.length>0&&(e+=`<h3>📝 Checklist</h3>`,this.currentTopic.checklist.forEach(t=>{let n=!!this.checklist[t],r=t.replace(/"/g,`&quot;`);e+=`
            <label class="checklist-item ${n?`checked`:``}">
              <input type="checkbox" ${n?`checked`:``} data-item="${r}">
              <span>${t}</span>
            </label>`})),e},progress(){return _(this.topics,this.checklist)},topicStats(){return v(this.topics,this.checklist)}},mounted(){this.checklist=m(),this.$nextTick(()=>{this.bindChecklistEvents()})},updated(){this.$nextTick(()=>{this.bindChecklistEvents()})},methods:{selectTopic(e){this.currentIndex=e,this.scrollCardToTop()},scrollCardToTop(){let e=document.getElementById(`learn-card`);e&&(e.scrollTop=0)},goHome(){u(`/`)},bindChecklistEvents(){document.querySelectorAll(`#learn-topic-body input[type="checkbox"]`).forEach(e=>{e._bound||(e._bound=!0,e.addEventListener(`change`,()=>{this.handleToggle(e.dataset.item,e.checked)}))})},handleToggle(e,t){this.checklist=g(e,t,this.checklist);let n=document.querySelector(`input[data-item="${e}"]`)?.closest(`.checklist-item`);n&&n.classList.toggle(`checked`,t)}}},b={class:`learn-page-root`},x={class:`learn-page-container`},S={class:`learn-topbar`},C={style:{display:`flex`,"align-items":`center`,gap:`0.8rem`,"flex-wrap":`wrap`}},w={class:`learn-progress`},T={id:`learn-progress-text`},E={class:`learn-progress-bar`},D={class:`learn-layout`},O={class:`learn-sidebar`},k={class:`learn-topic-list`,id:`learn-topic-list`},A=[`data-index`,`onClick`],j={class:`topic-status`},M={class:`learn-content-wrapper`},N={class:`learn-card`,id:`learn-card`},P={id:`learn-topic-title`},F=[`innerHTML`];function I(s,u,d,f,p,m){return a(),i(`div`,b,[o(`div`,x,[o(`header`,S,[o(`div`,C,[u[2]||=o(`h1`,null,`💻 Học Code`,-1),o(`a`,{class:`back-link`,href:`#`,onClick:u[0]||=c((...e)=>m.goHome&&m.goHome(...e),[`prevent`])},`⬅ Quay lại Trang chủ`)]),o(`div`,w,[o(`span`,T,`Tiến độ: `+l(m.progress.done)+` / `+l(m.progress.total),1),o(`div`,E,[o(`div`,{id:`learn-progress-fill`,style:e({width:m.progress.percent+`%`})},null,4)])])]),o(`div`,D,[o(`aside`,O,[u[3]||=o(`h3`,null,`📚 Bài học`,-1),o(`ul`,k,[o(`li`,{class:t([`intro-item`,{active:p.currentIndex===0}]),onClick:u[1]||=e=>m.selectTopic(0)},`📋 Danh sách bài học`,2),(a(!0),i(r,null,n(p.topics,(e,n)=>(a(),i(`li`,{key:n,"data-index":n+1,class:t({active:p.currentIndex===n+1}),onClick:e=>m.selectTopic(n+1)},[o(`span`,null,l(e.title.replace(/^📄 /,``)),1),o(`span`,j,l(m.topicStats[n+1].done)+`/`+l(m.topicStats[n+1].total),1)],10,A))),128))])]),o(`div`,M,[o(`div`,N,[o(`h2`,P,l(m.currentTopic?m.currentTopic.title:`Chọn một bài học`),1),o(`div`,{id:`learn-topic-body`,innerHTML:m.renderedContent},null,8,F)])])]),u[4]||=o(`footer`,{class:`app-footer`},[o(`p`,null,`© 2026 SkillForge — Học Code`)],-1)])])}var L=s(y,[[`render`,I],[`__scopeId`,`data-v-25471b52`]]);export{L as default};