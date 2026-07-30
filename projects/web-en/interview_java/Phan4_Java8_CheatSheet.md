# 📄 PHẦN 4 — JAVA 8+ 

---

## 1. Functional Interface

Interface chỉ có **duy nhất một abstract method**, có thể dùng với Lambda.

| Interface | Method | Input | Output | Dùng khi |
|---|---|---|---|---|
| `Predicate<T>` | `test(T)` | T | boolean | Kiểm tra điều kiện |
| `Function<T, R>` | `apply(T)` | T | R | Biến đổi dữ liệu |
| `Consumer<T>` | `accept(T)` | T | void | Xử lý, in, lưu |
| `Supplier<T>` | `get()` | void | T | Cung cấp giá trị |

**Ví dụ:**
```java
Predicate<Integer> isEven = x -> x % 2 == 0;
Function<String, Integer> length = s -> s.length();
Consumer<String> print = System.out::println;
Supplier<Double> random = Math::random;
```

---

## 2. Lambda Expression

Cách viết ngắn gọn cho anonymous class của functional interface.

**Ví dụ:**
```java
// Trước Java 8
Runnable r = new Runnable() {
    public void run() { System.out.println("run"); }
};

// Java 8+
Runnable r = () -> System.out.println("run");
```

---

## 3. Stream API Pipeline

Stream xử lý collection theo pipeline: **Source → Intermediate → Terminal**.

```java
List<Integer> result = numbers.stream()
    .filter(x -> x % 2 == 0)   // intermediate
    .map(x -> x * 2)            // intermediate
    .sorted()                   // intermediate
    .distinct()                 // intermediate
    .collect(Collectors.toList()); // terminal
```

**Intermediate operations:** lazy, trả về Stream (`filter`, `map`, `sorted`, `distinct`, `flatMap`).  
**Terminal operations:** kết thúc pipeline (`collect`, `forEach`, `reduce`, `findFirst`, `anyMatch`).

---

## 4. `map` vs `flatMap`

| `map` | `flatMap` |
|---|---|
| Biến đổi từng phần tử thành 1 giá trị | Biến đổi rồi **flatten** các Stream lồng nhau |
| `Stream<T>` → `Stream<R>` | `Stream<Stream<T>>` → `Stream<T>` |

**Ví dụ:**
```java
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4)
);

// map: Stream<List<Integer>>
nested.stream().map(x -> x);           // [[1,2], [3,4]]

// flatMap: Stream<Integer>
nested.stream().flatMap(List::stream)  // [1, 2, 3, 4]
               .collect(Collectors.toList());
```

---

## 5. Optional

Biểu diễn giá trị có thể tồn tại hoặc không, tránh `NullPointerException` và `null` check lồng nhau.

**Ví dụ:**
```java
Optional<String> name = Optional.ofNullable(findNameById(id));

name.ifPresent(n -> System.out.println(n));

String result = name
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .orElse("UNKNOWN");
```

**Anti-pattern:**
```java
Optional<User> user = Optional.ofNullable(getUser());  // ❌ không cần wrap nếu vừa mới check null
String name = user.get().getName();                    // ❌ .get() dễ ném NoSuchElementException
```

---

## 6. Method Reference

```java
List<String> names = Arrays.asList("a", "b", "c");
names.forEach(System.out::println);  // method reference

// Tương đương
names.forEach(s -> System.out.println(s));
```

**4 loại:**
- Static method: `ClassName::method`
- Instance method của object cụ thể: `obj::method`
- Instance method của class: `ClassName::method`
- Constructor: `ClassName::new`

---

## 7. Default Method & Static Method trong Interface (Java 8)

```java
interface Logger {
    void log(String msg);                    // abstract

    default void logInfo(String msg) {       // default method
        log("[INFO] " + msg);
    }

    static void print(String msg) {          // static method
        System.out.println(msg);
    }
}
```

> Giúp bổ sung method mà không phá vỡ class đã implement interface.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Stream API là gì?**
> "Stream API giúp xử lý collection theo cách khai báo, gồm các bước filter, map, collect. Ví dụ tôi có list số, muốn lấy số chẵn nhân đôi rồi thu thập thành list mới, tôi viết numbers.stream().filter(x -> x % 2 == 0).map(x -> x * 2).toList()."

**Câu: Optional dùng để làm gì?**
> "Optional giúp thể hiện rõ một giá trị có thể null, tránh null check lồng nhau. Ví dụ Optional.ofNullable(user).map(User::getName).orElse('Unknown'). Tuy nhiên không nên dùng Optional chỉ để wrap rồi .get() ngay, hoặc dùng trong field/parameter thông thường."

---

## ✅ CHECKLIST PHẦN 4

- [ ] Giải thích Functional Interface và 4 loại phổ biến.
- [ ] Viết Lambda expression.
- [ ] Giải thích Stream API pipeline.
- [ ] Phân biệt intermediate vs terminal operations.
- [ ] Phân biệt `map` vs `flatMap`.
- [ ] Dùng `Optional` đúng cách và biết anti-pattern.
- [ ] Biết Method Reference.
- [ ] Biết default method và static method trong interface.
