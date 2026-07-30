# 📄 PHẦN 5 — MULTITHREADING 

---

## 1. Thread vs Process

| | **Process** | **Thread** |
|---|---|---|
| **Định nghĩa** | Chương trình đang chạy, có bộ nhớ riêng | Đơn vị thực thi nhỏ trong process |
| **Bộ nhớ** | Có heap và memory space riêng | Chia sẻ heap của process, có stack riêng |
| **Giao tiếp** | IPC (inter-process communication) | Dùng shared memory |
| **Tạo mới** | Tốn kém | Nhẹ hơn |

**Ví dụ:**
```java
Thread t = new Thread(() -> System.out.println("Running in new thread"));
t.start();
```

---

## 2. Race Condition

Nhiều thread cùng truy cập và thay đổi **shared data**, kết quả phụ thuộc vào thứ tự thực thi.

**Ví dụ:**
```java
class Counter {
    int count = 0;
    void increment() { count++; } // ❌ không thread-safe
}
```

Cách giải quyết:
- `synchronized`
- `ReentrantLock`
- `AtomicInteger`

---

## 3. `synchronized`

Đảm bảo một vùng code chỉ được một thread truy cập tại một thởi điểm.

**Ví dụ:**
```java
class Counter {
    private int count = 0;

    public synchronized void increment() {  // khóa object instance
        count++;
    }
}
```

Hoặc khối:
```java
public void increment() {
    synchronized (this) {
        count++;
    }
}
```

---

## 4. Deadlock

Các thread giữ resource và chờ resource của nhau, không thread nào tiếp tục được.

**Điều kiện:**
- Mutual exclusion
- Hold and wait
- No preemption
- Circular wait

**Ví dụ:**
```java
Thread 1: lock A → đợi lock B
Thread 2: lock B → đợi lock A
```

**Cách phòng tránh:**
- Luôn lock theo cùng thứ tự.
- Dùng timeout (`tryLock`).
- Hạn chế số lượng lock.

---

## 5. ExecutorService & Thread Pool

Quản lý thread pool, tránh tạo thread thủ công cho từng task.

**Ví dụ:**
```java
ExecutorService executor = Executors.newFixedThreadPool(4);

for (int i = 0; i < 10; i++) {
    executor.submit(() -> System.out.println("Task"));
}

executor.shutdown();
```

| Loại pool | Đặc điểm |
|---|---|
| `newFixedThreadPool(n)` | Cố định n thread |
| `newCachedThreadPool()` | Tự động tạo thread khi cần |
| `newSingleThreadExecutor()` | 1 thread duy nhất |
| `newScheduledThreadPool(n)` | Chạy task định kỳ |

---

## 6. JVM Memory Model (đơn giản)

```
JVM Memory
├── Heap          (objects, shared by all threads)
│   ├── Young Generation (Eden, Survivor)
│   └── Old Generation
├── Stack         (mỗi thread có stack riêng, local variables)
├── Metaspace     (class metadata)
├── Program Counter (thread hiện tại đang thực thi dòng nào)
└── Native Method Stack
```

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
```java
User u = new User();  // u là GC Root
u = null;             // object User không còn reachable → GC thu hồi
```

---

## 8. `volatile`

Đảm bảo giá trị biến luôn đọc/ghi từ **main memory**, không dùng cache của thread.

```java
private volatile boolean running = true;
```

> `volatile` không thay thế `synchronized` cho compound operations như `i++`.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Race condition là gì?**
> "Race condition xảy ra khi nhiều thread cùng truy cập và thay đổi shared data. Kết quả cuối cùng phụ thuộc vào thứ tự thực thi của các thread. Ví dụ nhiều thread cùng increment một biến count mà không đồng bộ, kết quả cuối cùng sẽ sai. Cách xử lý là dùng synchronized, ReentrantLock hoặc AtomicInteger."

**Câu: Deadlock là gì, cách phòng tránh?**
> "Deadlock là tình trạng các thread giữ lock và chờ lock của nhau, không ai tiến thêm được. Ví dụ thread A giữ lock 1 đợi lock 2, thread B giữ lock 2 đợi lock 1. Để tránh, mình luôn lock theo cùng một thứ tự, hoặc dùng tryLock với timeout."

---

## ✅ CHECKLIST PHẦN 5

- [ ] Phân biệt Thread vs Process.
- [ ] Giải thích Race Condition.
- [ ] Dùng `synchronized` đúng cách.
- [ ] Giải thích Deadlock và cách phòng tránh.
- [ ] Dùng ExecutorService & Thread Pool.
- [ ] Biết JVM Memory Model cơ bản.
- [ ] Giải thích Garbage Collection.
- [ ] Biết `volatile`.
