# 📄 PHẦN 2 — COLLECTIONS 

---

## 1. ArrayList vs LinkedList

| | **ArrayList** | **LinkedList** |
|---|---|---|
| **Cấu trúc** | Dynamic array | Doubly linked list |
| **Truy cập index** | O(1) | O(n) |
| **Thêm/xóa cuối** | O(1) amortized, resize O(n) | O(1) nếu có node |
| **Thêm/xóa giữa** | O(n) vì phải dịch | O(1) nếu đã có node (còn tìm node O(n)) |
| **Bộ nhớ** | Ít overhead hơn | Nhiều overhead vì node, next, prev |

**Ví dụ:**
```java
List<String> a = new ArrayList<>();    // random access nhiều
List<String> b = new LinkedList<>();   // chèn/xóa đầu/cuối liên tục
```

---

## 2. HashSet vs TreeSet

| | **HashSet** | **TreeSet** |
|---|---|---|
| **Thứ tự** | Không đảm bảo | Sắp xếp tự nhiên |
| **Tốc độ** | O(1) trung bình | O(log n) |
| **Dựa trên** | HashMap | Red-Black Tree |
| **Null** | Cho phép 1 null | Không cho null |

**Ví dụ:**
```java
Set<String> h = new HashSet<>();    // unique, không cần thứ tự
Set<String> t = new TreeSet<>();   // unique, sắp xếp tự nhiên
```

---

## 3. HashMap hoạt động thế nào?

1. Tính `hashCode()` của key.
2. Xác định **bucket index** bằng `(n - 1) & hash`.
3. Nếu bucket trống → lưu entry.
4. Nếu bucket có dữ liệu → dùng `equals()` để tìm key đúng (xử lý collision).

**Ví dụ:**
```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 100);   // hash("apple") → bucket
map.get("apple");        // hash → bucket → equals
```

---

## 4. Collision trong HashMap

Collision xảy ra khi 2 key khác nhau có hash trùng bucket.

- **Java 8 trước:** Linked List.
- **Java 8+:** Linked List, nếu ≥ 8 entries thì chuyển sang **Red-Black Tree** (nếu key implement Comparable).

**Ví dụ:**
```java
Map<String, Integer> map = new HashMap<>();
// Nhiều key khác nhau nhưng hashCode trùng bucket
// HashMap tự chuyển sang Tree ở bucket đó để tìm kiếm nhanh hơn
```

---

## 5. HashMap có thread-safe không?

**Không.** Nếu nhiều thread đọc/ghi cùng lúc có thể mất dữ liệu hoặc treo vòng lặp vô hạn.

**Giải pháp:**
- `Collections.synchronizedMap(new HashMap<>())` — khóa toàn bộ map.
- `ConcurrentHashMap` — khóa theo segment/bucket, hiệu quả hơn.
- `Hashtable` — legacy, không nên dùng.

**Ví dụ:**
```java
Map<String, Integer> safeMap = new ConcurrentHashMap<>();
```

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
| **Method** | `int compareTo(T o)` | `int compare(T o1, T o2)` |
| **Số chiến lược** | 1 natural order | Nhiều comparator |
| **Class implement** | `class User implements Comparable<User>` | Không cần implement |

**Ví dụ:**
```java
// Comparable
class User implements Comparable<User> {
    public int compareTo(User other) { return this.age - other.age; }
}

// Comparator
Comparator<User> byName = Comparator.comparing(u -> u.name);
List<User> users = new ArrayList<>();
users.sort(byName);
```

---

## 8. `HashMap` resize

- **Load factor** mặc định = 0.75.
- Khi số entry > `capacity * load factor` → capacity **gấp đôi** và **rehash** toàn bộ entry.
- Resize tốn chi phí nên nên ước lượng initial capacity nếu biết trước kích thước.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: HashMap hoạt động thế nào?**
> "HashMap lưu dữ liệu theo bucket. Khi put(key, value), nó tính hashCode của key để xác định bucket. Nếu bucket trống thì lưu trực tiếp. Nếu có nhiều key rơi vào cùng bucket (collision), HashMap dùng equals để tìm đúng key. Java 8 trở đi, nếu số phần tử trong bucket ≥ 8 thì chuyển sang Tree để tìm kiếm nhanh hơn."

**Câu: HashMap có thread-safe không?**
> "Không. Để dùng đa luồng, nên dùng ConcurrentHashMap. Nó khóa theo bucket nên hiệu năng tốt hơn nhiều so với Collections.synchronizedMap."

---

## ✅ CHECKLIST PHẦN 2

- [ ] Phân biệt ArrayList vs LinkedList.
- [ ] Phân biệt HashSet vs TreeSet.
- [ ] Giải thích HashMap hoạt động (hash → bucket → equals).
- [ ] Giải thích collision và cách xử lý.
- [ ] Giải thích HashMap không thread-safe và ConcurrentHashMap.
- [ ] Phân biệt Comparable vs Comparator.
- [ ] Nói được load factor, resize, rehash.
