export const GO_COURSE_MODULES = [
  {
    "id": "start",
    "title": {
      "vi": "1. Bắt đầu với Go",
      "en": "1. Getting started with Go"
    },
    "summary": {
      "vi": "Chạy chương trình đầu tiên và hiểu kiểu dữ liệu cơ bản.",
      "en": "Run your first program and understand basic types."
    },
    "lessons": [
      {
        "id": "program",
        "title": {
          "vi": "Chương trình Go đầu tiên",
          "en": "Your first Go program"
        },
        "outcome": {
          "vi": "Hiểu package, hàm main, module và cách chạy chương trình.",
          "en": "Understand packages, main, modules, and how to run a program."
        },
        "lesson": {
          "vi": "Go là ngôn ngữ biên dịch. Một chương trình bắt đầu từ package `main` và hàm `main`; các package khác cung cấp chức năng để tái sử dụng. Tên package viết thường và thường theo tên thư mục.\n\n`go.mod` khai báo module path và phiên bản Go. Module là đơn vị quản lý dependency; hãy tạo nó ở thư mục gốc thay vì gom toàn bộ mã vào một file lớn.\n\n`go run .` biên dịch rồi chạy package hiện tại. `go build ./...` kiểm tra build toàn module. `gofmt` định dạng code theo chuẩn chung, giúp nhóm không tranh luận về style.",
          "en": "Go is a compiled language. A program starts in package `main` and its `main` function; other packages provide reusable behavior. Package names are lowercase and usually follow the directory name.\n\n`go.mod` declares the module path and Go version. A module is the unit for dependency management; create it at the project root instead of putting the whole application in one large file.\n\n`go run .` compiles and runs the current package. `go build ./...` checks that the module builds. `gofmt` applies the standard formatting so teams do not need to debate style."
        },
        "deepDive": {
          "vi": "Khi build, Go đọc các file trong package, kiểm tra cú pháp và kiểu, resolve import rồi tạo executable. Vì package là đơn vị biên dịch/visibility, file cùng thư mục và cùng khai báo package có thể dùng tên không export của nhau; package khác chỉ truy cập identifier bắt đầu bằng chữ hoa. Module path là tên định danh dependency, không bắt buộc phải là URL đang hoạt động.\n\nTách package theo ranh giới trách nhiệm và hướng phụ thuộc, không theo từng file. `go run .` tiện cho vòng lặp học; `go test ./...` kiểm tra hành vi; `go build ./...` xác nhận các package build được. Khi dự án lớn, giữ `main` mỏng: đọc config, khởi tạo dependency và gọi application.",
          "en": "During a build, Go reads package files, checks syntax and types, resolves imports, and creates an executable. A package is a compilation and visibility unit: files in the same directory with the same package declaration can use one another’s unexported names; other packages can access only identifiers beginning with an uppercase letter. A module path identifies a dependency and does not have to be a live URL.\n\nSplit packages by responsibility and dependency direction, not by individual file. `go run .` is convenient while learning; `go test ./...` checks behavior; `go build ./...` verifies packages compile. In a larger project, keep `main` thin: load configuration, wire dependencies, and start the application."
        },
        "example": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, Go\")\n}",
        "exampleOutput": {
          "vi": "Terminal in ra đúng một dòng:\nHello, Go",
          "en": "The terminal prints one line:\nHello, Go"
        },
        "walkthrough": {
          "vi": "`package main` cho biết đây là executable package. `import` đưa package chuẩn `fmt` vào dùng. Go tìm hàm `main` làm điểm bắt đầu; `fmt.Println` in một dòng ra terminal.\n\nThử tạo project mới bằng `go mod init example.com/hello`, lưu code vào `main.go`, rồi chạy `go run .`.",
          "en": "`package main` identifies an executable package. `import` makes the standard `fmt` package available. Go starts at `main`; `fmt.Println` writes a line to the terminal.\n\nCreate a project with `go mod init example.com/hello`, save the code in `main.go`, then run `go run .`."
        },
        "pitfalls": {
          "vi": "- Tên file không quyết định tên package.\n- Chương trình executable cần `package main` và `func main()`.\n- Code dùng package ngoài phải khai báo dependency phù hợp trong module.",
          "en": "- A file name does not determine its package name.\n- An executable needs `package main` and `func main()`.\n- External packages must be declared as module dependencies."
        },
        "exercise": {
          "vi": "Tạo chương trình in tên bạn và dòng `I am learning Go`. Chạy chương trình bằng `go run .`.",
          "en": "Create a program that prints your name and `I am learning Go`. Run it with `go run .`."
        },
        "solution": {
          "vi": "Đáp án không cố định: tạo `main.go`, khai báo `package main`, import `fmt` và gọi `fmt.Println` hai lần. Điều quan trọng là tự chạy được bằng `go run .`.",
          "en": "There is no single fixed answer: create `main.go`, declare `package main`, import `fmt`, and call `fmt.Println` twice. The important part is running it with `go run .`."
        }
      },
      {
        "id": "values",
        "title": {
          "vi": "Biến, kiểu và zero value",
          "en": "Variables, types, and zero values"
        },
        "outcome": {
          "vi": "Chọn kiểu phù hợp và dự đoán giá trị của biến chưa khởi tạo.",
          "en": "Choose appropriate types and predict uninitialized variable values."
        },
        "lesson": {
          "vi": "Go là ngôn ngữ kiểu tĩnh: kiểu của biểu thức được kiểm tra khi compile. Dùng `var name string` để khai báo tường minh, hoặc `name := \"An\"` để compiler suy ra kiểu trong function. `:=` không dùng ở package scope.\n\nMỗi kiểu có zero value: số là `0`, bool là `false`, string là `\"\"`; pointer, map, slice, channel, function và interface có thể là `nil`. Zero value giúp nhiều kiểu dùng được ngay, nhưng map nil không ghi được và pointer nil không trỏ tới dữ liệu.\n\n`const` dành cho giá trị compile-time không đổi. Go không tự chuyển số giữa các kiểu: khi cần, hãy chuyển kiểu tường minh để phép tính dễ đọc.",
          "en": "Go is statically typed: expression types are checked at compile time. Use `var name string` for an explicit declaration, or `name := \"An\"` for type inference inside a function. `:=` is not available at package scope.\n\nEvery type has a zero value: numbers are `0`, bool is `false`, strings are `\"\"`; pointers, maps, slices, channels, functions, and interfaces may be `nil`. Zero values make many types ready to use, but a nil map cannot be written to and a nil pointer refers to no data.\n\nUse `const` for compile-time constants. Go does not implicitly convert numeric types: convert explicitly so the operation is clear."
        },
        "deepDive": {
          "vi": "Kiểu tĩnh nghĩa là compiler biết kiểu của từng biểu thức trước khi chạy; type inference chỉ giúp viết ngắn, không biến Go thành dynamic typing. Ví dụ `x := 3` tạo `int`; sau đó không thể gán string vào `x`. Đây là lỗi được phát hiện sớm, trước khi chương trình xử lý request thật.\n\nZero value là trạng thái khởi đầu do ngôn ngữ đảm bảo, nên thường không cần khởi tạo số về 0 hay bool về false. Nhưng cần phân biệt nil với giá trị rỗng: nil slice có len 0 và dùng được với append, còn nil map chỉ đọc được. `int` phù hợp index/độ dài; kiểu kích thước cố định như `int64` hữu ích khi contract dữ liệu yêu cầu rõ ràng. Ép kiểu phải có chủ đích vì có thể làm mất dữ liệu.",
          "en": "Static typing means the compiler knows each expression’s type before execution; inference shortens declarations but does not make Go dynamically typed. For example, `x := 3` creates an `int`; assigning a string to `x` later is rejected. This catches the mismatch before the program handles a real request.\n\nA zero value is a language-guaranteed starting state, so numbers and booleans rarely need explicit zero initialization. Distinguish nil from an initialized empty value: a nil slice has length zero and works with `append`, while a nil map can only be read. `int` is convenient for indexes and lengths; fixed-width types such as `int64` help when a data contract requires an explicit size. Conversions should be deliberate because they can lose information."
        },
        "example": "var retries int\nvar enabled bool\nname := \"Go\"\nconst maxAttempts = 3\n\nvar ratio float64 = 7.0 / 2\nfmt.Println(retries, enabled, name, ratio)",
        "exampleOutput": {
          "vi": "0 false Go 3.5\n\n`retries` nhận zero value 0; `enabled` nhận false; phép chia có toán hạng float cho ra 3.5.",
          "en": "0 false Go 3.5\n\n`retries` has the zero value 0; `enabled` is false; division with a floating-point operand produces 3.5."
        },
        "walkthrough": {
          "vi": "`retries` bắt đầu bằng 0, `enabled` bằng false. `name :=` suy ra string. `7.0 / 2` cho kết quả số thực vì một toán hạng là `float64`; nếu cả hai toán hạng là int, phép chia sẽ cắt phần thập phân.\n\nChọn kiểu theo miền giá trị và hành vi cần có, không chọn chỉ theo kích thước nhỏ nhất.",
          "en": "`retries` starts at 0 and `enabled` at false. `name :=` infers a string. `7.0 / 2` produces a floating-point result because one operand is `float64`; integer divided by integer truncates the fractional part.\n\nChoose a type for the domain and behavior you need, not merely for the smallest representation."
        },
        "pitfalls": {
          "vi": "- Dùng `:=` ngoài function sẽ không compile.\n- Chia hai số nguyên không tạo số thập phân.\n- Zero value của map là nil: đọc được nhưng không thể gán key.",
          "en": "- `:=` outside a function does not compile.\n- Dividing two integers does not produce a fractional result.\n- A map zero value is nil: readable, but not writable."
        },
        "exercise": {
          "vi": "Tạo `price` kiểu float64 bằng 12.5 và `quantity` kiểu int bằng 4; tính tổng tiền thành float64.",
          "en": "Create a float64 `price` of 12.5 and an int `quantity` of 4; calculate the total as float64."
        },
        "solution": {
          "vi": "Dùng `price := 12.5`, `quantity := 4`, sau đó `total := price * float64(quantity)`. Phép chuyển kiểu tường minh là bắt buộc.",
          "en": "Use `price := 12.5`, `quantity := 4`, then `total := price * float64(quantity)`. The explicit conversion is required."
        }
      },
      {
        "id": "flow",
        "title": {
          "vi": "Điều kiện, vòng lặp và function",
          "en": "Conditions, loops, and functions"
        },
        "outcome": {
          "vi": "Viết được luồng xử lý nhỏ, rõ ràng và trả nhiều kết quả.",
          "en": "Write clear small control flows and return multiple values."
        },
        "lesson": {
          "vi": "Go có `if`, `switch` và `for`; `for` đảm nhiệm cả vai trò của while. Không có ngoặc tròn bắt buộc quanh điều kiện. `if` có thể khai báo biến ngắn ngay trước điều kiện để giới hạn scope.\n\nFunction khai báo kiểu tham số và kiểu trả về. Một function có thể trả nhiều giá trị, thường dùng để trả kết quả cùng error. Quy ước là kiểm tra error ngay sau lời gọi trước khi dùng kết quả.\n\nĐặt tên function theo hành động, giữ mỗi function tập trung vào một nhiệm vụ, và truyền dependency cần thiết thay vì giấu trạng thái toàn cục.",
          "en": "Go has `if`, `switch`, and `for`; `for` also serves as a while loop. Parentheses around conditions are not required. An `if` can declare a short-lived variable before its condition to keep scope narrow.\n\nFunctions declare parameter and return types. A function can return multiple values, commonly a result and an error. The convention is to check the error immediately after the call and before using the result.\n\nName functions after their action, keep each focused on one task, and pass required dependencies instead of hiding global state."
        },
        "deepDive": {
          "vi": "Function trong Go nhận tham số theo value: biến scalar/struct được copy khi truyền vào. Slice và map là giá trị mô tả dữ liệu dùng chung phía sau, nên copy slice vẫn có thể nhìn cùng backing array; khi cần sửa receiver hoặc dữ liệu lớn, cân nhắc pointer với semantics rõ ràng. Return value không phải exception: `(value, error)` buộc caller nhìn thấy đường lỗi và tự quyết định xử lý.\n\n`if err != nil { return ... }` tạo luồng điều khiển tường minh, đổi lại có nhiều dòng kiểm tra. Đây là chủ ý của Go để lỗi không bị ẩn sau exception flow. `range` trả bản copy của phần tử; `for i := range items { items[i] = ... }` mới sửa phần tử slice tại chỗ. Scope ngắn trong `if`/`switch` giúp hạn chế biến tạm rò ra phần còn lại của function.",
          "en": "Go passes arguments by value: scalar and struct values are copied at the call boundary. A slice or map is itself a value describing shared backing data, so copying a slice can still refer to the same backing array. Use a pointer when mutation or avoiding a large copy is part of the intended semantics. Returning `(value, error)` is not an exception mechanism; it makes the failure path visible and lets the caller decide what to do.\n\n`if err != nil { return ... }` creates explicit control flow, at the cost of more checks. Go deliberately favors this so failures are not hidden in exception flow. `range` gives a copy of each element; use `for i := range items { items[i] = ... }` to modify slice elements in place. Short scopes in `if` and `switch` keep temporary values local."
        },
        "example": "func divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, errors.New(\"division by zero\")\n    }\n    return a / b, nil\n}\n\nresult, err := divide(10, 2)\nif err != nil {\n    return err\n}\nfmt.Println(result)",
        "exampleOutput": {
          "vi": "5\n\nNếu đổi mẫu số thành 0, function trả error và caller return sớm nên không in kết quả.",
          "en": "5\n\nIf the divisor is changed to 0, the function returns an error and the caller exits early without printing a result."
        },
        "walkthrough": {
          "vi": "Function trả một cặp `(float64, error)`. Khi mẫu số bằng 0, kết quả không hợp lệ nên trả error; thành công trả kết quả và `nil`. Caller phải kiểm tra error trước khi dùng `result`.\n\nDùng `for _, value := range values` để duyệt slice/map. Biến index/value trong range là bản copy; nếu cần sửa phần tử slice, dùng index để truy cập trực tiếp.",
          "en": "The function returns a `(float64, error)` pair. A zero denominator is invalid, so it returns an error; success returns the result and `nil`. The caller checks the error before using `result`.\n\nUse `for _, value := range values` to iterate over slices and maps. A range value is a copy; use the index to modify a slice element."
        },
        "pitfalls": {
          "vi": "- Không bỏ qua error chỉ vì function vẫn trả một giá trị.\n- `range` lấy bản copy của phần tử, không phải reference để sửa tại chỗ.\n- Tránh lồng nhiều cấp; dùng early return để luồng chính dễ đọc.",
          "en": "- Do not ignore an error just because the function also returned a value.\n- `range` gives you a copy of an element, not a reference for in-place mutation.\n- Prefer early returns to deeply nested control flow."
        },
        "exercise": {
          "vi": "Viết function nhận slice số nguyên và trả tổng. Với slice rỗng, kết quả nên là 0.",
          "en": "Write a function that accepts an integer slice and returns its sum. An empty slice should produce 0."
        },
        "solution": {
          "vi": "Khởi tạo `sum := 0`, duyệt `for _, n := range values { sum += n }`, sau đó `return sum`. Slice rỗng không cần nhánh riêng vì tổng ban đầu là 0.",
          "en": "Initialize `sum := 0`, iterate with `for _, n := range values { sum += n }`, then return `sum`. An empty slice needs no special branch because the initial sum is 0."
        }
      },
      {
        "id": "collections",
        "title": {
          "vi": "Array, slice và map",
          "en": "Arrays, slices, and maps"
        },
        "outcome": {
          "vi": "Biết slice chia sẻ backing array ra sao và xử lý map nil an toàn.",
          "en": "Understand slice backing arrays and use maps safely."
        },
        "lesson": {
          "vi": "Array có độ dài nằm trong kiểu và khi gán sẽ copy các phần tử. Slice là view gồm pointer, length, capacity trỏ vào backing array. Dùng slice hằng ngày vì có thể mở rộng linh hoạt. `append` có thể cấp backing array mới, nên luôn gán kết quả lại.\n\nSlice có thể chia sẻ backing array; thay đổi qua một slice có thể thấy ở slice khác. `len` là số phần tử hiện có, `cap` là sức chứa trước khi cần cấp phát mới.\n\nMap lưu key-value và không đảm bảo thứ tự duyệt. Dùng `value, ok := m[key]` để biết key có tồn tại. Map nil đọc được nhưng ghi thì panic; tạo map bằng `make` hoặc map literal trước khi ghi.",
          "en": "An array has a length in its type and assignment copies its elements. A slice is a view containing a pointer, length, and capacity into a backing array. Slices are used day to day because they can grow flexibly. `append` may allocate a new backing array, so always assign its result.\n\nSlices may share a backing array; a change through one may be visible through another. `len` is the current element count; `cap` is the capacity before a new allocation is needed.\n\nA map stores key-value pairs and has no guaranteed iteration order. Use `value, ok := m[key]` to check whether a key exists. A nil map can be read but writing panics; initialize it with `make` or a map literal."
        },
        "deepDive": {
          "vi": "Có thể hình dung slice là descriptor `(pointer, len, cap)`, không phải array tự co giãn. `s[:len(s)]` chỉ thay đổi view; `append` ghi vào phần capacity còn trống nếu có, nếu không thì cấp backing array khác. Vì vậy hai slice có thể alias ở lúc này nhưng tách nhau sau một lần append. Khi cần bản độc lập, dùng `copy`/`slices.Clone`; khi cần giới hạn khả năng append làm lộ vùng dữ liệu, full slice expression `s[:len(s):len(s)]` giới hạn cap.\n\nMap được tối ưu cho lookup theo key; không dùng thứ tự iteration như một contract. Dạng `v, ok := m[k]` quan trọng khi zero value có ý nghĩa thật, như phân biệt “chưa có counter” và “counter bằng 0”. Map thường không an toàn khi có ghi đồng thời; bảo vệ toàn bộ thao tác invariant bằng mutex hoặc chuyển ownership qua goroutine. `sync.Map` dành cho một số workload cụ thể, không phải lựa chọn mặc định.",
          "en": "Think of a slice as a descriptor `(pointer, len, cap)`, not as a self-resizing array. `s[:len(s)]` changes only the view; `append` writes into spare capacity when available, otherwise it allocates another backing array. Two slices may alias now and diverge after an append. Use `copy` or `slices.Clone` for an independent copy; a full slice expression such as `s[:len(s):len(s)]` limits the capacity exposed to a caller.\n\nMaps are optimized for key lookup; iteration order is not a contract. The `v, ok := m[k]` form matters when the zero value is meaningful, such as distinguishing a missing counter from a counter whose value is zero. Regular maps are not safe for concurrent writes; protect the full invariant with a mutex or transfer ownership through a goroutine. `sync.Map` serves specific workloads and is not the default choice."
        },
        "example": "scores := make(map[string]int)\nscores[\"Mai\"] = 90\nscore, found := scores[\"Mai\"]\n\nids := []int{10, 20}\nids = append(ids, 30)\nfmt.Println(score, found, len(ids))",
        "exampleOutput": {
          "vi": "90 true 3\n\nMap tìm thấy score 90; slice có 3 phần tử sau append. Capacity không in ra vì giá trị có thể phụ thuộc cách cấp phát.",
          "en": "90 true 3\n\nThe map lookup finds score 90; the slice has 3 elements after append. Capacity is omitted because its value can depend on allocation behavior."
        },
        "walkthrough": {
          "vi": "`make(map[string]int)` tạo map có thể ghi. Phép đọc trả về score và bool `found`. Slice `ids` được mở rộng bằng `append`; không giả định backing array giữ nguyên sau lệnh này.\n\nKhi chỉ cần đọc slice con nhưng dữ liệu gốc rất lớn, cân nhắc copy phần cần giữ để tránh giữ backing array lớn trong memory.",
          "en": "`make(map[string]int)` creates a writable map. A map lookup returns the score and a `found` boolean. `append` extends `ids`; do not assume the backing array remains the same.\n\nIf a small subslice must outlive a very large source slice, copy the needed elements so the large backing array can be reclaimed."
        },
        "pitfalls": {
          "vi": "- Quên gán lại kết quả `append`.\n- Ghi vào map nil sẽ panic.\n- Không dựa vào thứ tự map khi tạo output ổn định hoặc test.",
          "en": "- Forgetting to assign the result of `append`.\n- Writing to a nil map panics.\n- Do not depend on map iteration order for stable output or tests."
        },
        "exercise": {
          "vi": "Đếm số lần xuất hiện của từng từ trong slice string bằng map.",
          "en": "Count the occurrences of each word in a string slice using a map."
        },
        "solution": {
          "vi": "Tạo `counts := make(map[string]int)`, sau đó với mỗi từ `counts[word]++`. Đọc map trả 0 nếu key chưa có, nên không cần kiểm tra trước trong bài này.",
          "en": "Create `counts := make(map[string]int)`, then increment `counts[word]++` for every word. A missing map key reads as 0, so no prior existence check is needed here."
        }
      }
    ]
  },
  {
    "id": "design",
    "title": {
      "vi": "2. Kiểu dữ liệu và thiết kế Go",
      "en": "2. Go types and design"
    },
    "summary": {
      "vi": "Composition, interface và cách diễn đạt lỗi rõ ràng.",
      "en": "Composition, interfaces, and explicit error handling."
    },
    "lessons": [
      {
        "id": "struct-methods",
        "title": {
          "vi": "Struct, method và pointer",
          "en": "Structs, methods, and pointers"
        },
        "outcome": {
          "vi": "Mô hình hóa dữ liệu bằng struct và chọn receiver phù hợp.",
          "en": "Model data with structs and choose suitable receivers."
        },
        "lesson": {
          "vi": "Struct gom các field thành một kiểu có ý nghĩa nghiệp vụ. Go không dùng class inheritance; thường ghép các kiểu nhỏ bằng composition. Method là function có receiver, giúp đặt hành vi gần dữ liệu liên quan.\n\nPointer giữ địa chỉ của giá trị. Dùng pointer receiver khi cần thay đổi receiver, tránh copy struct lớn hoặc giữ receiver style nhất quán. Dùng value receiver cho giá trị nhỏ có semantics copy rõ ràng. Zero value nên hữu ích nếu thiết kế cho phép.",
          "en": "A struct groups fields into a meaningful domain type. Go does not use class inheritance; it commonly composes smaller types. A method is a function with a receiver, placing behavior near the relevant data.\n\nA pointer holds the address of a value. Use a pointer receiver when mutating the receiver, avoiding copies of large structs, or keeping receiver style consistent. Use a value receiver for small values with clear copy semantics. Design types so their zero value is useful when practical."
        },
        "deepDive": {
          "vi": "Struct giúp gom dữ liệu và invariant vào một domain type; method không bắt buộc nhưng giúp API thể hiện hành động hợp lệ trên kiểu đó. Composition thường dùng embedding hoặc giữ field dependency, nhưng embedding không phải kế thừa: method được promote theo quy tắc method set và không tạo quan hệ subtype tổng quát.\n\nChọn value receiver nếu method xem receiver như giá trị độc lập; pointer receiver nếu cần mutation hoặc tránh copy. Dùng một kiểu receiver nhất quán để interface satisfaction dễ đoán. Cẩn thận khi copy giá trị đã chứa `sync.Mutex`, `sync.Once` hoặc state đồng bộ khác: các kiểu này không được copy sau lần sử dụng đầu. Nếu zero value không đủ để tạo object hợp lệ, constructor như `NewClient` nên validate và giữ field nội bộ không cho caller phá invariant.",
          "en": "A struct groups data and invariants into a domain type. Methods are optional, but they make valid operations on that type visible in its API. Composition often uses embedding or dependency fields; embedding is not inheritance: method promotion follows method-set rules and does not create general subtype behavior.\n\nChoose a value receiver when the method treats the receiver as an independent value; choose a pointer receiver for mutation or to avoid copying. Keep receiver style consistent so interface satisfaction is predictable. Do not copy values containing `sync.Mutex`, `sync.Once`, or other synchronization state after first use. If the zero value cannot represent a valid object, a constructor such as `NewClient` should validate it and keep invariant-breaking fields private."
        },
        "example": "type Counter struct {\n    value int\n}\n\nfunc (c *Counter) Add(n int) {\n    c.value += n\n}\n\ncounter := Counter{}\ncounter.Add(2)\nfmt.Println(counter.value)",
        "exampleOutput": {
          "vi": "2\n\nMethod nhận pointer receiver nên cập nhật `counter.value` trên chính struct ban đầu.",
          "en": "2\n\nThe pointer-receiver method updates `counter.value` on the original struct."
        },
        "walkthrough": {
          "vi": "`Counter{}` hợp lệ nhờ zero value của int là 0. `Add` cần thay đổi field nên nhận `*Counter`. Khi gọi `counter.Add(2)`, compiler tự lấy địa chỉ của biến local có thể addressable.\n\nĐừng dùng pointer chỉ vì thấy ngôn ngữ khác dùng reference; hãy chọn semantics trước rồi tối ưu dựa trên số đo.",
          "en": "`Counter{}` is valid because an int zero value is 0. `Add` changes a field, so it uses `*Counter`. When calling `counter.Add(2)`, the compiler can take the address of this addressable local variable.\n\nDo not use pointers merely because another language uses references; choose the semantics first and optimize from measurements."
        },
        "pitfalls": {
          "vi": "- Copy một struct chứa `sync.Mutex` sau khi đã sử dụng là nguy hiểm.\n- Pointer nil cần được kiểm tra trước khi dereference.\n- Value receiver không thể cập nhật bản gốc.",
          "en": "- Copying a struct containing a `sync.Mutex` after use is unsafe.\n- Check a pointer for nil before dereferencing.\n- A value receiver cannot update the original value."
        },
        "exercise": {
          "vi": "Tạo `BankAccount` có balance và method `Deposit` tăng số dư.",
          "en": "Create a `BankAccount` with a balance and a `Deposit` method that increases it."
        },
        "solution": {
          "vi": "Dùng `type BankAccount struct { Balance int }` rồi định nghĩa `func (a *BankAccount) Deposit(amount int) { a.Balance += amount }`. Trong sản phẩm thực tế, cần kiểm tra amount hợp lệ và dùng kiểu số phù hợp tiền tệ.",
          "en": "Define `type BankAccount struct { Balance int }`, then `func (a *BankAccount) Deposit(amount int) { a.Balance += amount }`. In production, validate the amount and choose an appropriate monetary representation."
        }
      },
      {
        "id": "interfaces",
        "title": {
          "vi": "Interface và composition",
          "en": "Interfaces and composition"
        },
        "outcome": {
          "vi": "Thiết kế dependency theo hành vi nhỏ, không ghép chặt vào implementation.",
          "en": "Design dependencies around small behaviors, not concrete implementations."
        },
        "lesson": {
          "vi": "Một kiểu implement interface ngầm nếu method set của kiểu đó thỏa các method trong interface. Không cần khai báo `implements`. Điều này giúp package sử dụng định nghĩa contract nhỏ sát nhu cầu, rồi nhận concrete implementation từ bên ngoài.\n\nĐặt interface ở phía caller và chỉ đưa vào những method caller cần. Interface một method thường dễ fake trong unit test. Không tạo interface cho mọi struct nếu chưa có lợi ích rõ ràng.\n\nInterface có thể chứa dynamic type và dynamic value. Một interface giữ pointer nil vẫn khác nil nếu dynamic type của nó đã được đặt; đây là bẫy typed nil phổ biến.",
          "en": "A type implicitly implements an interface when its method set satisfies the interface. There is no `implements` declaration. This lets a consumer define a small contract matching its needs and receive a concrete implementation from outside.\n\nDefine interfaces near the caller and include only the methods it needs. A one-method interface is often easy to fake in a unit test. Do not create an interface for every struct without a clear benefit.\n\nAn interface can contain a dynamic type and dynamic value. An interface holding a nil pointer is still non-nil if its dynamic type is set; this is the common typed-nil pitfall."
        },
        "deepDive": {
          "vi": "Interface value có thể hiểu là cặp `(dynamic type, dynamic value)`. `var err error = (*MyError)(nil)` có dynamic type `*MyError`, nên cả interface không nil dù dynamic value nil. Đây là lý do phải cẩn thận khi function trả error từ pointer error.\n\nMethod set quyết định implement: method có receiver `T` thuộc method set của cả `T` và `*T`; method receiver `*T` chỉ thuộc method set của `*T`. Compiler có thể tự lấy địa chỉ ở một số lời gọi method trên biến addressable, nhưng không đổi luật gán vào interface. Generics constraint phục vụ kiểm tra kiểu ở compile time; interface value phục vụ polymorphism qua contract ở runtime. Giữ interface nhỏ ở phía consumer làm thay đổi implementation dễ hơn, nhưng abstraction quá sớm sẽ tạo type và mapping không cần thiết.",
          "en": "An interface value can be understood as a pair `(dynamic type, dynamic value)`. `var err error = (*MyError)(nil)` has dynamic type `*MyError`, so the interface itself is non-nil even though its dynamic value is nil. This is why functions returning pointer-based errors need care.\n\nMethod sets determine implementation: a method with receiver `T` belongs to the method sets of both `T` and `*T`; a method with receiver `*T` belongs only to `*T`. The compiler may take an address for some calls on addressable variables, but that does not change interface assignment rules. Generic constraints provide compile-time type relationships; interface values provide runtime polymorphism through behavior contracts. Small consumer-side interfaces ease implementation changes, while premature abstraction adds unnecessary types and mappings."
        },
        "example": "type UserStore interface {\n    Find(ctx context.Context, id string) (User, error)\n}\n\ntype UserService struct {\n    store UserStore\n}\n\nfunc (s UserService) Get(ctx context.Context, id string) (User, error) {\n    return s.store.Find(ctx, id)\n}",
        "exampleOutput": {
          "vi": "Không có dòng nào được in. Khi gọi `Get`, service gọi `Find` trên store đã truyền vào và trả nguyên kết quả/error cho caller.",
          "en": "Nothing is printed. Calling `Get` delegates to `Find` on the injected store and returns its result/error to the caller."
        },
        "walkthrough": {
          "vi": "`UserService` phụ thuộc vào hành vi `Find`, không phụ thuộc trực tiếp Postgres hay Redis. Production có thể truyền SQL store; test có thể truyền fake store. Nếu caller chỉ cần một method thì interface chỉ nên có một method đó.\n\n`context.Context` được truyền vào để thao tác lưu trữ có thể tôn trọng deadline/cancellation của request.",
          "en": "`UserService` depends on the `Find` behavior, not directly on Postgres or Redis. Production can pass a SQL store; a test can pass a fake. If the caller needs one method, keep the interface to that method.\n\n`context.Context` is passed so the storage operation can respect the request deadline and cancellation."
        },
        "pitfalls": {
          "vi": "- Interface quá lớn khiến mock khó và coupling tăng.\n- Interface không thay thế dependency injection; nó chỉ mô tả contract.\n- Trả pointer nil thông qua interface có thể tạo interface khác nil.",
          "en": "- Large interfaces make mocks difficult and increase coupling.\n- An interface does not replace dependency injection; it describes a contract.\n- Returning a nil pointer through an interface can produce a non-nil interface."
        },
        "exercise": {
          "vi": "Định nghĩa interface `Notifier` với method gửi thông báo, rồi để service phụ thuộc vào interface đó.",
          "en": "Define a `Notifier` interface with a send method, then make a service depend on it."
        },
        "solution": {
          "vi": "Ví dụ `type Notifier interface { Send(ctx context.Context, message string) error }`. Service giữ `notifier Notifier`; implementation email hoặc test fake thỏa interface ngầm chỉ cần có đúng method này.",
          "en": "For example: `type Notifier interface { Send(ctx context.Context, message string) error }`. The service stores a `Notifier`; an email implementation or test fake implicitly satisfies it by providing that method."
        }
      },
      {
        "id": "errors-tests",
        "title": {
          "vi": "Error, test và package",
          "en": "Errors, tests, and packages"
        },
        "outcome": {
          "vi": "Bổ sung ngữ cảnh cho lỗi và viết test có thể chạy lặp lại.",
          "en": "Add context to errors and write repeatable tests."
        },
        "lesson": {
          "vi": "Error thông thường là giá trị trả về tường minh. Caller quyết định xử lý, trả tiếp hay đổi thành lỗi ở tầng API. Dùng `fmt.Errorf(\"...: %w\", err)` để thêm ngữ cảnh mà vẫn giữ error chain; dùng `errors.Is` cho sentinel error và `errors.As` cho kiểu lỗi. Đừng so sánh nội dung chuỗi lỗi.\n\nGo test tìm file `*_test.go`; function test có dạng `func TestXxx(t *testing.T)`. Test nên độc lập, kiểm tra hành vi quan sát được, bao gồm cả nhánh lỗi. `go test ./...` chạy test của toàn module.\n\nChia package theo trách nhiệm và dependency; package con không nên import ngược package cha. Tên package ngắn, rõ, không lặp tên thư mục một cách thừa thãi.",
          "en": "An ordinary error is an explicit returned value. The caller decides whether to handle it, propagate it, or map it to an API error. Use `fmt.Errorf(\"...: %w\", err)` to add context while preserving the error chain; use `errors.Is` for sentinel errors and `errors.As` for typed errors. Do not compare error strings.\n\nGo test discovers `*_test.go`; a test function looks like `func TestXxx(t *testing.T)`. Tests should be independent and verify observable behavior, including failure paths. `go test ./...` runs tests throughout the module.\n\nOrganize packages by responsibility and dependency; a child package should not import its parent back. Use short, clear package names and avoid redundant directory-name repetition."
        },
        "deepDive": {
          "vi": "Thêm ngữ cảnh ở mỗi tầng chỉ khi tầng đó bổ sung thông tin hữu ích, ví dụ `load config: open file: ...`; giữ nguyên nguyên nhân bằng `%w` để tầng trên dùng `errors.Is/As` thay vì parse message. Chỉ chuyển lỗi thành HTTP status ở ranh giới transport; tầng domain không nên biết HTTP. Error message nên mô tả hành động thất bại, còn log kèm identifier có kiểm soát, không đưa secret.\n\nTable-driven test giúp chạy cùng contract trên nhiều input; test tốt kiểm tra kết quả và error semantics, không khóa vào chi tiết implementation. Test package ngoài (`package foo_test`) giúp xác minh API công khai. `go test -race` dò race trên đường test chạy; `go vet` phát hiện một số lỗi đáng ngờ nhưng không thay test. Package là boundary dependency: nếu hai package import lẫn nhau, cần xem lại ownership hoặc chuyển contract về package phù hợp.",
          "en": "Add context at each layer only when it contributes useful information, such as `load config: open file: ...`; preserve the cause with `%w` so callers use `errors.Is/As` instead of parsing text. Map errors to HTTP status only at the transport boundary; domain code should not know about HTTP. Error messages should describe the failed operation, while logs include controlled identifiers and never secrets.\n\nTable-driven tests run one contract against many inputs. Good tests assert results and error semantics rather than implementation details. An external test package (`package foo_test`) verifies the public API. `go test -race` detects races on executed paths; `go vet` catches some suspicious constructs but does not replace tests. Packages are dependency boundaries: mutual imports usually indicate unclear ownership or a contract placed in the wrong package."
        },
        "example": "func ParsePort(raw string) (int, error) {\n    port, err := strconv.Atoi(raw)\n    if err != nil {\n        return 0, fmt.Errorf(\"parse port %q: %w\", raw, err)\n    }\n    if port < 1 || port > 65535 {\n        return 0, fmt.Errorf(\"port out of range: %d\", port)\n    }\n    return port, nil\n}",
        "exampleOutput": {
          "vi": "`ParsePort(\"8080\")` trả `8080, nil`. `ParsePort(\"abc\")` trả port 0 cùng error có ngữ cảnh `parse port \"abc\"`; `errors.Is/As` vẫn truy vấn được lỗi gốc.",
          "en": "`ParsePort(\"8080\")` returns `8080, nil`. `ParsePort(\"abc\")` returns port 0 and an error contextualized as `parse port \"abc\"`; `errors.Is/As` can still inspect the underlying error."
        },
        "walkthrough": {
          "vi": "Lỗi chuyển đổi được wrap cùng input để người gọi biết bước nào thất bại. Lỗi ngoài miền được tạo mới vì không có lỗi nền cần giữ. Caller có thể hiển thị thông báo thân thiện mà log vẫn giữ đủ nguyên nhân.\n\nKhi test, bao gồm input hợp lệ, chuỗi không phải số, và số ngoài khoảng; đừng chỉ test happy path.",
          "en": "The conversion error is wrapped with the input so callers know which step failed. The out-of-range error is new because there is no underlying error to preserve. A caller can show a friendly message while logs retain the cause.\n\nTest a valid value, a non-numeric string, and an out-of-range number; do not test only the happy path."
        },
        "pitfalls": {
          "vi": "- Dùng `%v` thay `%w` làm mất khả năng truy vấn error chain.\n- Test phụ thuộc thứ tự hoặc đồng hồ thật dễ flaky.\n- Không log cùng một lỗi lặp ở mọi tầng; chọn tầng có đủ ngữ cảnh.",
          "en": "- Using `%v` instead of `%w` breaks error-chain inspection.\n- Tests depending on order or real clocks can be flaky.\n- Avoid logging the same error at every layer; log where enough context exists."
        },
        "exercise": {
          "vi": "Viết test cho `ParsePort`: kiểm tra `\"8080\"` thành công và `\"abc\"` trả lỗi.",
          "en": "Write tests for `ParsePort`: `\"8080\"` succeeds and `\"abc\"` returns an error."
        },
        "solution": {
          "vi": "Tạo test table gồm input và expected error. Với `\"8080\"`, kiểm tra port 8080 và err nil; với `\"abc\"`, kiểm tra err khác nil. Chạy `go test ./...`.",
          "en": "Create a table of inputs and expected error states. For `\"8080\"`, assert port 8080 and nil error; for `\"abc\"`, assert a non-nil error. Run `go test ./...`."
        }
      }
    ]
  },
  {
    "id": "concurrency",
    "title": {
      "vi": "3. Concurrency an toàn",
      "en": "3. Safe concurrency"
    },
    "summary": {
      "vi": "Goroutine, đồng bộ, cancellation và giới hạn tải.",
      "en": "Goroutines, synchronization, cancellation, and load limits."
    },
    "lessons": [
      {
        "id": "goroutines",
        "title": {
          "vi": "Goroutine và channel",
          "en": "Goroutines and channels"
        },
        "outcome": {
          "vi": "Khởi chạy công việc đồng thời và truyền kết quả có đồng bộ.",
          "en": "Start concurrent work and communicate results safely."
        },
        "lesson": {
          "vi": "Goroutine là đơn vị thực thi nhẹ do Go runtime lập lịch; nó không phải một OS thread riêng. Runtime multiplex nhiều goroutine trên các thread. Channel truyền dữ liệu và đồng bộ giữa goroutine.\n\nUnbuffered channel buộc send/receive gặp nhau mới tiếp tục. Buffered channel cho phép tối đa capacity phần tử chờ trước khi sender block. Dùng `select` để chờ nhiều channel hoặc cancellation.\n\nMỗi goroutine cần chủ sở hữu và điều kiện kết thúc. Khởi tạo goroutine rồi quên nó có thể gây leak, chạy mãi hoặc giữ tài nguyên sau khi request đã kết thúc.",
          "en": "A goroutine is a lightweight execution unit scheduled by the Go runtime; it is not its own OS thread. The runtime multiplexes many goroutines over threads. Channels transfer data and synchronize goroutines.\n\nAn unbuffered channel makes sender and receiver rendezvous. A buffered channel lets up to its capacity wait before the sender blocks. Use `select` to wait on several channels or cancellation.\n\nEvery goroutine needs an owner and a termination condition. Starting a goroutine and forgetting it can leak, run forever, or retain resources after a request ends."
        },
        "deepDive": {
          "vi": "Concurrency là tổ chức nhiều công việc có thể tiến triển chồng lấp; parallelism là thực sự chạy cùng lúc trên nhiều core. Goroutine nhẹ hơn việc tạo một OS thread riêng vì runtime multiplex chúng, nhưng không miễn phí: stack, queue, memory được giữ và downstream work đều có chi phí. Một goroutine cho mỗi request chỉ ổn khi server/load balancer và dependency có giới hạn phù hợp.\n\nSend/receive trên channel tạo đồng bộ giữa goroutine; channel buffer là queue hữu hạn, không phải kho vô hạn. Nếu sender nhanh hơn receiver, buffer đầy sẽ block và truyền backpressure. Close báo producer không gửi thêm; receiver có thể drain giá trị còn lại. Thông thường producer sở hữu quyền close. Mỗi goroutine phải có đường thoát rõ ràng: channel đóng, context cancel hoặc kết quả được tiêu thụ.",
          "en": "Concurrency organizes work so multiple tasks can make overlapping progress; parallelism means they actually run at the same time on multiple cores. Goroutines are lighter than creating a dedicated OS thread because the runtime multiplexes them, but they are not free: stacks, queued work, retained memory, and downstream operations all cost resources. One goroutine per request is safe only when the server, load balancer, and dependencies are appropriately bounded.\n\nChannel sends and receives synchronize goroutines; a buffered channel is a finite queue, not infinite storage. If producers outpace consumers, a full buffer blocks and applies backpressure. Closing signals that a producer will send no more; receivers can drain remaining values. Usually the producer owns closing. Every goroutine needs a clear exit path: a closed channel, context cancellation, or consumed result."
        },
        "example": "results := make(chan int)\ngo func() {\n    results <- 6 * 7\n}()\n\nvalue := <-results\nfmt.Println(value)",
        "exampleOutput": {
          "vi": "42\n\nGoroutine gửi `6 * 7` vào channel; goroutine hiện tại nhận rồi mới in kết quả.",
          "en": "42\n\nThe goroutine sends `6 * 7` through the channel; the current goroutine receives it before printing."
        },
        "walkthrough": {
          "vi": "Goroutine con gửi kết quả vào channel; goroutine hiện tại nhận kết quả. Channel unbuffered khiến thao tác gửi đợi tới khi có receiver, nên giá trị không bị mất.\n\nTrong ứng dụng thật, thay channel đơn giản bằng `select` có `ctx.Done()` để tránh đợi vô hạn khi caller hủy request.",
          "en": "The child goroutine sends its result to the channel; the current goroutine receives it. An unbuffered channel makes the send wait for a receiver, so the value is not lost.\n\nIn a real application, use `select` with `ctx.Done()` so a caller cancellation cannot leave work waiting forever."
        },
        "pitfalls": {
          "vi": "- Không đóng channel khi vẫn còn sender.\n- Channel đóng vẫn đọc được zero value; dùng dạng `value, ok`.\n- Channel không tự giới hạn tổng số goroutine bạn tạo.",
          "en": "- Do not close a channel while senders may still use it.\n- A closed channel still yields zero values; use the `value, ok` form.\n- Channels do not automatically bound the number of goroutines you create."
        },
        "exercise": {
          "vi": "Tạo hai goroutine tính hai số, gửi kết quả vào channel và cộng lại ở goroutine chính.",
          "en": "Start two goroutines to calculate two values, send them through a channel, and sum them in the main goroutine."
        },
        "solution": {
          "vi": "Dùng buffered channel capacity 2 hoặc unbuffered channel với hai lần receive. Mỗi goroutine gửi đúng một kết quả; goroutine nhận cộng đủ hai giá trị rồi kết thúc.",
          "en": "Use a buffered channel with capacity 2 or an unbuffered channel with two receives. Each goroutine sends exactly one result; the receiver sums both and exits."
        }
      },
      {
        "id": "sync",
        "title": {
          "vi": "Mutex, WaitGroup và race detector",
          "en": "Mutexes, WaitGroups, and the race detector"
        },
        "outcome": {
          "vi": "Bảo vệ trạng thái chia sẻ và đợi nhóm công việc kết thúc.",
          "en": "Protect shared state and wait for concurrent work to finish."
        },
        "lesson": {
          "vi": "Channel hợp với truyền dữ liệu và phối hợp; `sync.Mutex` hợp với bảo vệ trạng thái chia sẻ như map/counter. Mutex đồng bộ trong một process, không khóa được các instance khác. Chọn công cụ giúp ownership rõ nhất.\n\n`sync.WaitGroup` đếm tác vụ đang chạy. Gọi `Add` trước khi khởi chạy goroutine, rồi `Done` khi hoàn tất; goroutine chờ gọi `Wait`. Không copy WaitGroup sau khi sử dụng.\n\nData race là truy cập đồng thời lên cùng memory, có ít nhất một lần ghi mà thiếu đồng bộ. Chạy `go test -race ./...`; detector tìm race trên những luồng test thực sự chạy, không chứng minh mọi luồng đều an toàn.",
          "en": "Channels fit data transfer and coordination; `sync.Mutex` fits protecting shared state such as a map or counter. A mutex synchronizes within one process and cannot lock other instances. Choose the tool that makes ownership clearest.\n\n`sync.WaitGroup` counts active work. Call `Add` before starting goroutines, then `Done` as each finishes; the parent waits with `Wait`. Do not copy a WaitGroup after use.\n\nA data race is unsynchronized concurrent access to the same memory where at least one access writes. Run `go test -race ./...`; the detector finds races on executed paths but does not prove every path is safe."
        },
        "deepDive": {
          "vi": "Mutex bảo vệ invariant, không chỉ một dòng ghi. Nếu một thao tác đọc-check-rồi-ghi phải nguyên tử, lock cần bao quanh toàn bộ chuỗi đó. `RWMutex` chỉ có lợi khi đọc đồng thời nhiều, ghi ít và benchmark cho thấy contention; nó phức tạp hơn và không luôn nhanh hơn mutex thường. Atomic hợp cho primitive độc lập như counter/flag, không thay mutex cho nhiều field cần thay đổi cùng nhau.\n\nTheo Go memory model, unlock happens-before lock thành công tiếp theo trên cùng mutex; nhờ đó thread khác nhìn thấy cập nhật được bảo vệ. WaitGroup chỉ đợi completion, không tự bảo vệ dữ liệu chia sẻ. Race detector là công cụ động nên cần test nhiều interleaving đại diện. Distributed lock khác hẳn: nó điều phối process qua network và có lease/failure mode, không bảo vệ trực tiếp memory trong một process.",
          "en": "A mutex protects an invariant, not merely one write statement. If a read-check-write sequence must be atomic, the lock must cover the entire sequence. `RWMutex` helps only when reads are concurrent, writes are rare, and benchmarks show contention; it is more complex and is not always faster than a regular mutex. Atomics suit independent primitives such as a counter or flag, but do not replace a mutex when several fields must change together.\n\nUnder the Go memory model, an unlock happens before a later successful lock on the same mutex, making protected updates visible to the next owner. A WaitGroup waits for completion; it does not protect shared data. The race detector is dynamic, so tests should cover representative interleavings. A distributed lock is different: it coordinates processes over a network and has lease/failure modes; it does not directly protect in-process memory."
        },
        "example": "var mu sync.Mutex\ncounts := map[string]int{}\nvar wg sync.WaitGroup\n\nwg.Add(1)\ngo func() {\n    defer wg.Done()\n    mu.Lock()\n    counts[\"jobs\"]++\n    mu.Unlock()\n}()\nwg.Wait()\nfmt.Println(counts[\"jobs\"])",
        "exampleOutput": {
          "vi": "1\n\n`Wait` chỉ trở về sau `Done`; mutex bảo vệ lần tăng counter khỏi data race.",
          "en": "1\n\n`Wait` returns after `Done`; the mutex protects the counter increment from a data race."
        },
        "walkthrough": {
          "vi": "Mutex bảo vệ thao tác ghi lên map; nếu bỏ khóa, concurrent map writes có thể panic hoặc gây race. WaitGroup bảo đảm goroutine hoàn tất trước khi code đọc trạng thái sau đó.\n\nTrong code production, đặt `Unlock` bằng `defer` khi phạm vi đủ nhỏ để không quên unlock trên nhánh return.",
          "en": "The mutex protects the map write; without it, concurrent map writes can panic or race. The WaitGroup ensures the goroutine finishes before later code reads the state.\n\nIn production code, use `defer Unlock` when the critical section is small enough to make unlock reliable across returns."
        },
        "pitfalls": {
          "vi": "- Quên `Done` làm `Wait` treo.\n- Gọi `Add` sau khi goroutine đã có thể kết thúc gây race trong cách đếm.\n- Giữ lock khi gọi network hoặc code chậm làm tăng contention.",
          "en": "- Forgetting `Done` can block `Wait` forever.\n- Calling `Add` after a goroutine may finish creates a counting race.\n- Holding a lock during network or slow work increases contention."
        },
        "exercise": {
          "vi": "Viết counter được tăng từ 100 goroutine, sau đó chạy test với race detector.",
          "en": "Increment a counter from 100 goroutines, then run it with the race detector."
        },
        "solution": {
          "vi": "Dùng `sync.Mutex` quanh phép tăng hoặc `atomic.Int64`; dùng WaitGroup đợi tất cả xong. Chạy `go test -race ./...` và xác nhận không báo race.",
          "en": "Use `sync.Mutex` around the increment or `atomic.Int64`; use a WaitGroup to wait for completion. Run `go test -race ./...` and confirm no race is reported."
        }
      },
      {
        "id": "context-workers",
        "title": {
          "vi": "Context, cancellation và worker pool",
          "en": "Context, cancellation, and worker pools"
        },
        "outcome": {
          "vi": "Dừng công việc đúng hạn và giữ concurrency trong giới hạn.",
          "en": "Cancel work promptly and keep concurrency bounded."
        },
        "lesson": {
          "vi": "`context.Context` truyền deadline, tín hiệu hủy và metadata theo request. Đặt context làm tham số đầu tiên, truyền xuống I/O; tạo child context có timeout và gọi cancel. Worker phải quan sát `ctx.Done()` thì mới dừng được.\n\nKhông tạo một goroutine vô hạn cho mỗi input. Worker pool dùng số worker cố định và queue có capacity. Queue đầy phải có chính sách: block có deadline, từ chối, hoặc giảm tốc upstream. Đây là backpressure để bảo vệ memory và dependency.\n\nKhi shutdown, hủy context gốc, ngừng nhận việc mới, chờ worker hiện tại trong giới hạn rồi giải phóng resource.",
          "en": "`context.Context` carries request-scoped deadlines, cancellation, and metadata. Put it first in the parameter list, pass it through I/O, create child contexts with timeouts, and call cancel. A worker must observe `ctx.Done()` to stop.\n\nDo not create an unbounded goroutine per input. A worker pool uses a fixed worker count and bounded queue. When the queue is full, define a policy: block with a deadline, reject work, or slow the upstream. This backpressure protects memory and dependencies.\n\nDuring shutdown, cancel the root context, stop accepting new work, wait for current workers within a limit, and release resources."
        },
        "deepDive": {
          "vi": "Context truyền tín hiệu theo cây cha-con: cancel context cha sẽ hủy các context con. Deadline của context con không nên vượt deadline cha; timeout của request cần chia ngân sách cho DB, RPC và thời gian serialize response. Context không kill goroutine; code phải chủ động select trên `Done` và dependency phải nhận context. Không lưu context trong struct dùng lâu dài, và không dùng Value thay cho tham số function thông thường.\n\nWorker pool biến concurrency thành một giới hạn vận hành rõ. Queue hữu hạn giúp hệ thống có thể block, reject hoặc giảm tốc thay vì nhận vô hạn rồi hết memory. Chọn queue size từ thời gian chờ được phép và tốc độ xử lý; quan sát queue depth, thời gian chờ và số job bị từ chối. Khi shutdown, dừng producer trước, xử lý hoặc bỏ queue theo chính sách, rồi đợi worker bằng deadline.",
          "en": "Context cancellation flows through a parent-child tree: cancelling a parent cancels its descendants. A child deadline should not exceed the parent deadline; divide a request’s timeout budget among the database, RPC, and response serialization. Context does not kill a goroutine: code must select on `Done`, and dependencies must accept the context. Do not store a context in a long-lived struct or use context values instead of ordinary function parameters.\n\nA worker pool turns concurrency into an explicit operational limit. A bounded queue lets the system block, reject, or slow down instead of accepting infinite work and exhausting memory. Choose queue size from allowed wait time and processing rate; monitor depth, wait time, and rejected jobs. During shutdown, stop producers first, drain or discard queued work by policy, then wait for workers with a deadline."
        },
        "example": "func worker(ctx context.Context, jobs <-chan Job) error {\n    for {\n        select {\n        case <-ctx.Done():\n            return ctx.Err()\n        case job, ok := <-jobs:\n            if !ok {\n                return nil\n            }\n            if err := process(ctx, job); err != nil {\n                return err\n            }\n        }\n    }\n}",
        "exampleOutput": {
          "vi": "Nếu nhận được job: worker xử lý job rồi lặp tiếp. Nếu channel đóng và đã hết job: trả `nil`. Nếu context bị hủy: trả `context.Canceled` hoặc deadline error.",
          "en": "When a job arrives, the worker processes it and loops. When the channel is closed and drained, it returns `nil`. When the context is cancelled, it returns `context.Canceled` or a deadline error."
        },
        "walkthrough": {
          "vi": "Worker vừa chờ job vừa chờ cancellation. Khi queue đóng và đã hết job, `ok` false khiến worker thoát bình thường. Khi context bị hủy, worker trả lỗi context để caller điều phối shutdown.\n\nSố worker nên dựa vào CPU, latency và giới hạn dependency; không có một con số cố định phù hợp mọi ứng dụng.",
          "en": "The worker waits for either a job or cancellation. When the queue is closed and drained, `ok` is false and the worker exits normally. When the context is cancelled, it returns the context error so the caller can coordinate shutdown.\n\nChoose worker count based on CPU, latency, and dependency limits; there is no universal number."
        },
        "pitfalls": {
          "vi": "- Quên `cancel()` làm timer/context con tồn tại lâu hơn cần thiết.\n- Queue không giới hạn có thể biến overload thành memory exhaustion.\n- `context` không tự hủy goroutine nếu code không kiểm tra nó.",
          "en": "- Forgetting `cancel()` can retain child contexts and timers.\n- An unbounded queue can turn overload into memory exhaustion.\n- A context does not stop a goroutine unless the code checks it."
        },
        "exercise": {
          "vi": "Thiết kế worker pool 4 worker và queue capacity 20. Khi context hủy, worker phải thoát.",
          "en": "Design a worker pool with 4 workers and a queue capacity of 20. Workers must exit on context cancellation."
        },
        "solution": {
          "vi": "Tạo `jobs := make(chan Job, 20)`, khởi chạy đúng 4 worker với chung context, producer gửi job trong `select` giữa `jobs <- job` và `<-ctx.Done()`. Khi shutdown, cancel context và đợi worker bằng WaitGroup.",
          "en": "Create `jobs := make(chan Job, 20)`, start exactly 4 workers with a shared context, and have producers select between `jobs <- job` and `<-ctx.Done()`. On shutdown, cancel and wait for workers with a WaitGroup."
        }
      }
    ]
  },
  {
    "id": "backend",
    "title": {
      "vi": "4. Go trong backend",
      "en": "4. Go for backend services"
    },
    "summary": {
      "vi": "HTTP, database, cache, lock và message queue.",
      "en": "HTTP, databases, caching, locks, and message queues."
    },
    "lessons": [
      {
        "id": "http-db",
        "title": {
          "vi": "HTTP API và database/sql",
          "en": "HTTP APIs and database/sql"
        },
        "outcome": {
          "vi": "Tạo endpoint có timeout, context và transaction đúng ranh giới.",
          "en": "Build endpoints with timeouts, context, and well-scoped transactions."
        },
        "lesson": {
          "vi": "Thư viện chuẩn `net/http` đủ để tạo HTTP server. Handler nên validate input, đặt status code rõ ràng, truyền `r.Context()` xuống DB/RPC và không trả lỗi nội bộ nhạy cảm ra client. Cấu hình read/header/write/idle timeout cho server.\n\n`sql.DB` là handle quản lý connection pool an toàn cho nhiều goroutine, không phải một connection duy nhất. Tạo một handle dùng lại, cấu hình pool dựa trên giới hạn DB và số replica, rồi đo wait count/latency.\n\nDùng transaction khi nhiều thao tác cần giữ một invariant cùng nhau; giữ transaction ngắn, không gọi network bên trong. Đảm bảo mọi đường đi commit hoặc rollback và chỉ retry thao tác an toàn để lặp.",
          "en": "The standard `net/http` package is enough to build an HTTP server. A handler should validate input, choose clear status codes, pass `r.Context()` to database/RPC calls, and avoid returning sensitive internal errors to clients. Configure server read/header/write/idle timeouts.\n\n`sql.DB` is a concurrency-safe connection-pool handle, not one connection. Reuse a handle, configure the pool based on database limits and replica count, then measure wait counts and latency.\n\nUse a transaction when multiple operations must preserve one invariant. Keep it short and do not make network calls inside it. Ensure every path commits or rolls back, and retry only operations safe to repeat."
        },
        "deepDive": {
          "vi": "HTTP handler là boundary giữa không tin cậy và application: giới hạn body, parse/validate, xác thực quyền, gọi use case rồi map kết quả sang status code. Lỗi nội bộ nên được log có correlation ID nhưng response không lộ SQL, token hay stack. Timeout server và timeout dependency là hai lớp khác nhau; context request truyền cancellation xuống các lời gọi hỗ trợ context.\n\n`sql.DB` giữ pool, mở connection khi cần và tái sử dụng; pool quá nhỏ gây wait, quá lớn vượt giới hạn DB khi nhân số replica. `BeginTx` tạo transaction gắn với một connection cho tới commit/rollback. Transaction cần ngắn để tránh giữ lock/connection. Nếu DB commit thành công nhưng response mất, client có thể retry; idempotency key hoặc unique constraint giúp tránh tạo side effect trùng.",
          "en": "An HTTP handler is the boundary between untrusted input and the application: limit body size, parse and validate, authorize, call a use case, then map its result to a status code. Internal errors should be logged with a correlation ID, while responses must not expose SQL, tokens, or stacks. Server timeouts and dependency timeouts are separate layers; request context carries cancellation to calls that support it.\n\n`sql.DB` owns a pool, opening and reusing connections as needed. A pool that is too small causes waits; one that is too large can exceed database limits when multiplied across replicas. `BeginTx` holds a connection for the transaction until commit or rollback. Keep transactions short to avoid holding locks and connections. If a commit succeeds but the response is lost, a client may retry; idempotency keys or unique constraints prevent duplicate side effects."
        },
        "example": "func (s *Server) getUser(w http.ResponseWriter, r *http.Request) {\n    ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)\n    defer cancel()\n\n    user, err := s.store.FindUser(ctx, r.PathValue(\"id\"))\n    if err != nil {\n        http.Error(w, \"user unavailable\", http.StatusServiceUnavailable)\n        return\n    }\n    json.NewEncoder(w).Encode(user)\n}",
        "exampleOutput": {
          "vi": "Giả sử store trả `User{ID: \"u-42\", Name: \"An\"}`: response thành công có status 200 và body JSON của user. Nếu store lỗi: handler trả status 503 và body `user unavailable`.",
          "en": "If the store returns `User{ID: \"u-42\", Name: \"An\"}`, the response is status 200 with that user as JSON. If the store fails, the handler returns status 503 and body `user unavailable`."
        },
        "walkthrough": {
          "vi": "Timeout con giới hạn thời gian query nhưng vẫn kế thừa cancellation của request gốc. `defer cancel()` giải phóng timer. Handler chuyển lỗi nội bộ thành response phù hợp; production nên log lỗi có request ID và chỉ trả thông tin an toàn.\n\nDùng `json.Decoder` với giới hạn body và kiểm tra input thật kỹ khi nhận request ghi.",
          "en": "The child timeout limits the query while inheriting cancellation from the original request. `defer cancel()` releases its timer. The handler maps an internal error to a response; in production, log it with a request ID and return only safe details.\n\nUse `json.Decoder` with a body-size limit and validate input carefully for write requests."
        },
        "pitfalls": {
          "vi": "- Không để request DB chạy vô hạn khi client đã ngắt kết nối.\n- Không giữ transaction trong lúc gọi service ngoài.\n- Pool connection lớn hơn giới hạn tổng DB có thể làm lỗi lan rộng.",
          "en": "- Do not let database work run indefinitely after a client disconnects.\n- Do not hold a transaction while calling an external service.\n- A pool larger than the database’s total capacity can amplify failures."
        },
        "exercise": {
          "vi": "Thiết kế endpoint đọc sản phẩm theo ID: validate ID, timeout query, xử lý not found và lỗi DB.",
          "en": "Design an endpoint that reads a product by ID: validate the ID, time out the query, and handle not-found and database errors."
        },
        "solution": {
          "vi": "Handler parse ID trước, tạo context timeout, gọi repository có nhận context. Map not found thành 404, lỗi dependency thành 5xx an toàn; ghi log nội bộ có correlation ID. Đảm bảo query kết thúc khi request bị cancel.",
          "en": "Parse the ID first, create a timeout context, and call a repository method that accepts context. Map not-found to 404 and dependency errors to a safe 5xx; log internally with a correlation ID. Ensure the query stops when the request is cancelled."
        }
      },
      {
        "id": "redis-lock",
        "title": {
          "vi": "Redis cache và distributed lock",
          "en": "Redis caching and distributed locks"
        },
        "outcome": {
          "vi": "Phân biệt cache với nguồn dữ liệu chính, mutex cục bộ với khóa phân tán.",
          "en": "Distinguish a cache from the source of truth and local mutexes from distributed locks."
        },
        "lesson": {
          "vi": "Cache-aside: đọc Redis trước; miss thì đọc database, ghi kết quả vào cache với TTL rồi trả về. Khi cập nhật, ghi DB trước rồi invalidate hoặc refresh cache. Cache có thể stale/mất; database vẫn là nguồn dữ liệu chính.\n\n`sync.Mutex` bảo vệ memory trong một process; instance khác không nhìn thấy mutex đó. Distributed lock dùng Redis làm điểm phối hợp qua process, thường lấy bằng `SET key token NX PX ttl`. Release phải so token atomically để owner cũ không xóa lock mới.\n\nLease hết hạn trong khi owner còn làm việc có thể tạo hai owner cùng hành động. Với thao tác critical, cân nhắc fencing token, idempotency và DB constraint/transaction. Distributed lock không thay thế consistency hoặc transaction.",
          "en": "With cache-aside, read Redis first; on a miss, read the database, populate the cache with a TTL, and return the value. On updates, write the database first, then invalidate or refresh the cache. A cache can be stale or lost; the database remains the source of truth.\n\n`sync.Mutex` protects memory within one process; other instances cannot see it. A distributed lock coordinates across processes using Redis, commonly acquired with `SET key token NX PX ttl`. Release atomically only if the token matches so an old owner cannot delete a new lock.\n\nA lease can expire while its owner is still working, allowing two owners to act. For critical operations, consider fencing tokens, idempotency, and database constraints/transactions. A distributed lock does not replace consistency or transactions."
        },
        "deepDive": {
          "vi": "Cache làm giảm latency và tải nguồn dữ liệu nhưng thêm bài toán consistency. Cache-aside phổ biến vì application chủ động điều khiển key/TTL; write path thường commit DB rồi invalidate cache. Nếu invalidate thất bại, TTL giới hạn thời gian stale chứ không loại bỏ stale hoàn toàn. Stampede xảy ra khi key hết hạn và nhiều request đồng thời dồn vào DB; singleflight chỉ gộp trong một process, còn distributed lock để chống stampede lại thêm network/failure complexity.\n\n`sync.Mutex` phù hợp cho vùng nhớ process hiện tại; Redis lock phối hợp nhiều replica qua một lease, thường `SET resource token NX PX ttl`. Token nhận diện owner để release an toàn; fencing token bảo vệ downstream khỏi owner cũ chạy muộn sau khi lease hết hạn. Network timeout tạo trạng thái không chắc chắn: client có thể không biết lock đã được cấp hay chưa. Vì vậy khóa phân tán chỉ là cơ chế phối hợp, không thay database transaction, unique constraint hay idempotency cho invariant quan trọng.",
          "en": "Caching reduces latency and source load but introduces consistency decisions. Cache-aside is common because the application controls keys and TTLs; a write path often commits the database and then invalidates the cache. If invalidation fails, TTL bounds staleness but does not eliminate it. A stampede occurs when an expired key sends many requests to the database at once. Singleflight coalesces work only within one process; using a distributed lock for stampede prevention adds network and failure complexity.\n\n`sync.Mutex` fits memory in the current process; a Redis lock coordinates replicas through a lease, commonly `SET resource token NX PX ttl`. The token identifies the owner for safe release; a fencing token protects downstream systems from an old owner continuing after lease expiry. A network timeout creates uncertainty: the client may not know whether the lock was acquired. A distributed lock is coordination, not a replacement for database transactions, unique constraints, or idempotency around critical invariants."
        },
        "example": "value, err := redis.Get(ctx, key).Result()\nif errors.Is(err, redis.Nil) {\n    value, err = loadFromDatabase(ctx, id)\n    if err == nil {\n        _ = redis.Set(ctx, key, value, time.Minute).Err()\n    }\n}\nif err != nil {\n    return err\n}",
        "exampleOutput": {
          "vi": "Cache miss: đọc Redis → tải profile từ DB → ghi Redis với TTL 1 phút → trả profile. Lần đọc tiếp theo trước khi hết TTL có thể lấy từ cache, không cần query DB.",
          "en": "Cache miss: read Redis → load the profile from the database → cache it for one minute → return it. A later read before expiry can use the cache without querying the database."
        },
        "walkthrough": {
          "vi": "Đây là luồng cache-aside: miss thì load DB và ghi cache có TTL. Ví dụ rút gọn để thấy luồng; code thật cần phân biệt lỗi Redis với cache miss. Nếu Redis down, có thể fallback DB nhưng phải giới hạn concurrency để không làm DB quá tải.\n\nCache stampede xảy ra khi nhiều request đồng thời miss cùng key. Có thể gộp request cùng key bằng singleflight trong process, thêm TTL jitter hoặc dùng cơ chế stale-while-revalidate.",
          "en": "This is the cache-aside flow: on a miss, load from the database and set a TTL. The example is abbreviated; real code should distinguish Redis errors from a cache miss. If Redis is down, a database fallback may be appropriate, but bound concurrency to avoid overwhelming the database.\n\nA cache stampede occurs when many requests miss the same key at once. Coalesce same-key loads with singleflight within a process, add TTL jitter, or use stale-while-revalidate."
        },
        "pitfalls": {
          "vi": "- Không dùng cache làm nguồn chân lý cho số dư/tồn kho.\n- Không release lock chỉ bằng lệnh DEL không kiểm tra token.\n- TTL không giải quyết hết stale data; cần xác định chính sách invalidation.",
          "en": "- Do not use a cache as the source of truth for balances or inventory.\n- Do not release a lock with an unconditional DEL.\n- TTL alone does not solve all stale-data problems; define invalidation behavior."
        },
        "exercise": {
          "vi": "Thiết kế cache cho profile người dùng: ghi DB rồi invalidate cache; mô tả hành vi khi Redis không khả dụng.",
          "en": "Design a user-profile cache: write the database then invalidate the cache; describe behavior when Redis is unavailable."
        },
        "solution": {
          "vi": "Key dạng `user:v1:{id}`, TTL phù hợp. Update DB thành công rồi xóa cache; nếu xóa thất bại, TTL giới hạn thời gian stale và cần metric/alert. Với Redis outage, fallback DB theo giới hạn concurrency; không coi thao tác cache là commit nghiệp vụ.",
          "en": "Use a key such as `user:v1:{id}` with an appropriate TTL. Update the database, then delete the cache; if deletion fails, TTL bounds staleness and metrics/alerts surface the issue. During Redis outages, fall back to the database with bounded concurrency; cache operations are not the business commit."
        }
      },
      {
        "id": "kafka",
        "title": {
          "vi": "Kafka và xử lý message",
          "en": "Kafka and message processing"
        },
        "outcome": {
          "vi": "Hiểu partition, consumer group, offset và xử lý lặp an toàn.",
          "en": "Understand partitions, consumer groups, offsets, and safe duplicate handling."
        },
        "lesson": {
          "vi": "Kafka là distributed log có retention, không chỉ là queue xóa message sau ack. Producer ghi record vào topic; topic chia partition; consumer group chia partition cho các consumer. Ordering chỉ được đảm bảo trong một partition, nên key cần phản ánh đối tượng phải giữ thứ tự.\n\nConsumer commit offset để ghi nhớ vị trí đã xử lý. At-least-once thường có thể giao lặp nếu service chết sau khi làm side effect nhưng trước khi commit; handler cần idempotent bằng event ID/unique constraint. Retry có giới hạn; message độc hại nên chuyển dead-letter để không chặn partition.\n\nDB commit và Kafka publish không thành một transaction nguyên tử chung chỉ nhờ gọi tuần tự; transactional outbox giúp lưu event cùng transaction nghiệp vụ rồi publish sau. Trong Go, giới hạn số record đang xử lý và tôn trọng cancellation/shutdown.",
          "en": "Kafka is a retained distributed log, not merely a queue that deletes messages after acknowledgement. Producers write records to topics; topics are split into partitions; a consumer group distributes partitions among consumers. Ordering is guaranteed only within a partition, so choose a key representing the entity whose events must remain ordered.\n\nConsumers commit offsets to record their position. At-least-once processing can redeliver if a service performs a side effect and dies before committing; handlers need idempotency using event IDs or unique constraints. Bound retries; route poison messages to a dead-letter path so they do not block a partition.\n\nA database commit and Kafka publish do not become one atomic transaction just because they are called sequentially; a transactional outbox stores the event with the business transaction and publishes it later. In Go, bound in-flight records and honor cancellation/shutdown."
        },
        "deepDive": {
          "vi": "Partition vừa là đơn vị song song vừa quyết định ordering. Trong một consumer group, một partition tại một thời điểm thường được một consumer sở hữu; tăng consumer vượt số partition không tự tăng throughput. Key chọn partition nên phải cân bằng hai mục tiêu: giữ thứ tự theo entity và tránh hot partition. Consumer group khác nhau có thể đọc cùng log độc lập.\n\nOffset là vị trí đọc, không phải xác nhận business transaction. Auto-commit có thể commit trước khi side effect hoàn tất; commit sau xử lý tạo at-least-once và yêu cầu idempotency. Exactly-once thường chỉ áp dụng trong phạm vi transaction Kafka được cấu hình; side effect sang DB vẫn cần outbox/inbox hoặc idempotency. Retry cùng partition có thể chặn record sau đó; retry topic/DLQ cần giữ correlation, thứ tự mong muốn và chính sách replay. Trong Go, giới hạn in-flight để tránh commit offset vượt qua record chưa xong.",
          "en": "A partition is both a unit of parallelism and the boundary for ordering. Within a consumer group, one consumer typically owns a partition at a time; adding more consumers than partitions does not automatically increase throughput. The partition key must balance per-entity ordering with avoiding hot partitions. Different consumer groups can read the same log independently.\n\nAn offset is a read position, not confirmation of a business transaction. Auto-commit can advance before a side effect completes; committing after processing gives at-least-once behavior and requires idempotency. “Exactly once” generally applies only within configured Kafka transactions; database side effects still need an outbox/inbox or idempotency. Retrying on the same partition can block later records; retry topics/DLQs need clear correlation, ordering, and replay policies. In Go, bound in-flight work to avoid committing past unfinished records."
        },
        "example": "for {\n    record, err := reader.FetchMessage(ctx)\n    if err != nil {\n        return err\n    }\n    if err := handleIdempotently(ctx, record); err != nil {\n        return err // retry or route to a dead-letter policy\n    }\n    if err := reader.CommitMessages(ctx, record); err != nil {\n        return err\n    }\n}",
        "exampleOutput": {
          "vi": "Mỗi record đi theo thứ tự: fetch → xử lý idempotent thành công → commit offset. Nếu xử lý lỗi, offset chưa được commit để policy retry/DLQ quyết định bước tiếp theo.",
          "en": "Each record follows: fetch → successful idempotent processing → commit offset. If processing fails, the offset is not committed so the retry/DLQ policy can decide what happens next."
        },
        "walkthrough": {
          "vi": "Consumer fetch record, xử lý side effect idempotent rồi mới commit offset. Nếu commit thất bại sau khi side effect thành công, message có thể tới lại; idempotency ngăn ghi trùng. Cách commit cụ thể phụ thuộc Kafka client và thứ tự xử lý song song.\n\nTheo dõi consumer lag, thời gian xử lý và retry để biết backlog đang tăng hay consumer đang lỗi.",
          "en": "The consumer fetches a record, performs an idempotent side effect, and commits the offset afterward. If the commit fails after the side effect succeeds, the message may be delivered again; idempotency prevents duplicate writes. Exact commit behavior depends on the Kafka client and parallel processing order.\n\nMonitor consumer lag, processing time, and retries to detect growing backlogs or failing consumers."
        },
        "pitfalls": {
          "vi": "- Không giả định ordering toàn topic; chỉ có trong từng partition.\n- Commit trước xử lý có thể làm mất message khi process crash.\n- Retry vô hạn cho poison message khiến partition bị kẹt.",
          "en": "- Do not assume topic-wide ordering; it exists only within each partition.\n- Committing before processing can lose work if the process crashes.\n- Infinite retries on poison messages can stall a partition."
        },
        "exercise": {
          "vi": "Thiết kế consumer cập nhật trạng thái đơn hàng từ event: xử lý duplicate và giữ thứ tự event theo order ID.",
          "en": "Design a consumer that updates order state from events: handle duplicates and preserve event order per order ID."
        },
        "solution": {
          "vi": "Dùng order ID làm partition key, lưu event ID đã xử lý với unique constraint hoặc inbox table, rồi update trạng thái trong transaction. Commit offset sau khi transaction thành công; lỗi transient retry có giới hạn, lỗi vĩnh viễn đưa DLQ.",
          "en": "Use the order ID as the partition key, record processed event IDs with a unique constraint or inbox table, and update state in a transaction. Commit the offset after the transaction succeeds; bounded-retry transient errors and send permanent failures to a DLQ."
        }
      }
    ]
  },
  {
    "id": "production",
    "title": {
      "vi": "5. Nâng cao và production",
      "en": "5. Advanced and production"
    },
    "summary": {
      "vi": "Đo hiệu năng, hiểu runtime và thiết kế có khả năng vận hành.",
      "en": "Measure performance, understand the runtime, and design for operations."
    },
    "lessons": [
      {
        "id": "runtime-performance",
        "title": {
          "vi": "Scheduler, GC và đo hiệu năng",
          "en": "Scheduler, GC, and performance measurement"
        },
        "outcome": {
          "vi": "Hiểu G-M-P ở mức khái niệm và tối ưu bằng benchmark/profile.",
          "en": "Understand G-M-P conceptually and optimize with benchmarks and profiles."
        },
        "lesson": {
          "vi": "Mô hình khái niệm G-M-P: G là goroutine, M là OS thread, P là tài nguyên scheduler để M chạy Go code. Runtime ghép runnable G lên M có P. Chi tiết scheduler thay đổi theo phiên bản; điều cần nhớ là nhiều goroutine có thể được multiplex, không phải một goroutine tương ứng một thread.\n\nGo có garbage collector tracing đồng thời. GC giảm quản lý memory thủ công nhưng vẫn dùng CPU; allocation rate, heap size và object lifetime có thể ảnh hưởng latency. Escape analysis quyết định giá trị nào cần sống trên heap; đừng đoán dựa trên cú pháp pointer.\n\nBắt đầu bằng benchmark đại diện và `-benchmem`, sau đó dùng CPU/heap profile qua pprof. Tối ưu theo số đo và chạy lại benchmark để xác minh trade-off.",
          "en": "A conceptual G-M-P model has G for goroutine, M for OS thread, and P for the scheduler resource an M needs to execute Go code. The runtime schedules runnable Gs on Ms holding Ps. Scheduler details evolve; the key idea is that many goroutines can be multiplexed rather than mapping one-to-one to threads.\n\nGo has a concurrent tracing garbage collector. GC reduces manual memory management but still uses CPU; allocation rate, heap size, and object lifetime can affect latency. Escape analysis determines which values need to live on the heap; do not guess from pointer syntax.\n\nStart with representative benchmarks and `-benchmem`, then use CPU/heap profiles through pprof. Optimize from measurements and rerun benchmarks to verify trade-offs."
        },
        "deepDive": {
          "vi": "Trong mô hình G-M-P, G là goroutine runnable/waiting, M là OS thread, P cung cấp tài nguyên runtime để chạy Go code. `GOMAXPROCS` giới hạn số P có thể chạy đồng thời; nó không phải giới hạn goroutine. Goroutine chờ channel/network thường nhường chỗ cho G khác; syscall blocking có thể giữ M lâu hơn. Đây là mô hình để suy luận, còn scheduling chi tiết là implementation và thay đổi theo phiên bản.\n\nGC tracing tìm object còn reachable từ roots và thu hồi phần còn lại; allocation nhanh làm GC phải làm nhiều việc hơn, nhưng giảm allocation không phải lúc nào cũng cải thiện end-to-end latency. Escape analysis quyết định lifetime/memory placement; profile heap/CPU sẽ cho thấy chi phí thực. Benchmark cần input đại diện, tránh dead-code elimination và so sánh cùng môi trường. Dùng pprof để tìm hotspot trước khi refactor; xem cả p95/p99 và throughput khi tối ưu service.",
          "en": "In the G-M-P model, G is a runnable or waiting goroutine, M is an OS thread, and P supplies runtime resources to execute Go code. `GOMAXPROCS` limits how many Ps can run concurrently; it is not a goroutine limit. A goroutine waiting on a channel or network operation can yield to another G; a blocking syscall may hold an M longer. This is a reasoning model, while scheduler details are implementation-specific and evolve.\n\nA tracing GC finds objects reachable from roots and reclaims the rest. High allocation rates make the collector do more work, but reducing allocations does not always improve end-to-end latency. Escape analysis determines lifetime/memory placement; heap and CPU profiles reveal actual costs. Benchmarks need representative inputs, should avoid dead-code elimination, and must be compared in the same environment. Use pprof to find hotspots before refactoring, and measure p95/p99 as well as throughput for services."
        },
        "example": "func BenchmarkJoin(b *testing.B) {\n    for i := 0; i < b.N; i++ {\n        _ = strings.Join([]string{\"go\", \"backend\"}, \"-\")\n    }\n}\n\n// go test -bench BenchmarkJoin -benchmem",
        "exampleOutput": {
          "vi": "Kết quả có dạng `BenchmarkJoin-8 ... ns/op ... B/op ... allocs/op`. Con số phụ thuộc CPU, Go version và môi trường; so sánh hai lần chạy trong cùng điều kiện, không học thuộc một con số mẫu.",
          "en": "The output looks like `BenchmarkJoin-8 ... ns/op ... B/op ... allocs/op`. Values depend on CPU, Go version, and environment; compare runs under the same conditions rather than memorizing a sample number."
        },
        "walkthrough": {
          "vi": "Benchmark function nhận `*testing.B` và lặp theo `b.N`, số vòng được test framework điều chỉnh. `-benchmem` báo allocation/op; số này giúp so sánh các cách triển khai. Profile cho biết thời gian/memory thực sự nằm ở đâu.\n\nĐừng tối ưu microbenchmark không đại diện cho workload production; đo latency p95/p99 và throughput toàn luồng khi phù hợp.",
          "en": "A benchmark function receives `*testing.B` and loops for `b.N`, which the test framework calibrates. `-benchmem` reports allocations per operation and helps compare implementations. Profiles show where time and memory are actually spent.\n\nDo not optimize an unrepresentative microbenchmark; measure production-flow throughput and p95/p99 latency where appropriate."
        },
        "pitfalls": {
          "vi": "- Không khẳng định Go luôn nhanh hơn Java; workload và runtime configuration mới quyết định.\n- Profile có overhead; dùng đúng môi trường và thời điểm.\n- Giảm allocation có thể đổi lấy code khó hiểu; đánh giá lợi ích thực.",
          "en": "- Do not claim Go is always faster than Java; workload and runtime configuration matter.\n- Profiling has overhead; use it in the right environment and time window.\n- Fewer allocations can mean harder-to-read code; verify the real benefit."
        },
        "exercise": {
          "vi": "Viết benchmark cho một hàm xử lý chuỗi của bạn, ghi lại ns/op và allocs/op trước khi tối ưu.",
          "en": "Benchmark one of your string-processing functions and record ns/op and allocs/op before optimizing."
        },
        "solution": {
          "vi": "Tạo `BenchmarkXxx(b *testing.B)`, đặt input ngoài vòng lặp nếu input không đổi, chạy `go test -bench BenchmarkXxx -benchmem`. Thay đổi một yếu tố mỗi lần và so sánh cùng môi trường.",
          "en": "Create `BenchmarkXxx(b *testing.B)`, keep invariant input outside the loop, and run `go test -bench BenchmarkXxx -benchmem`. Change one factor at a time and compare in the same environment."
        }
      },
      {
        "id": "production-design",
        "title": {
          "vi": "Retry, graceful shutdown và chọn Go",
          "en": "Retries, graceful shutdown, and choosing Go"
        },
        "outcome": {
          "vi": "Kết hợp kiến thức thành dịch vụ có timeout, thoát an toàn và lý do chọn công nghệ.",
          "en": "Combine the concepts into a bounded service and justify technology choices."
        },
        "lesson": {
          "vi": "Một service production cần deadline tổng, timeout riêng cho dependency, retry có giới hạn với backoff/jitter, và idempotency cho thao tác ghi. Retry vô hạn/khuếch đại đồng loạt có thể làm sự cố nặng hơn. Giới hạn concurrency và queue để tạo backpressure.\n\nGraceful shutdown: đánh dấu instance không ready, ngừng nhận request mới, gọi `http.Server.Shutdown` với deadline, chờ request/worker hiện tại rồi đóng DB, cache và telemetry. Từng goroutine cần context hoặc tín hiệu kết thúc.\n\nGo phù hợp khi nhóm cần binary triển khai gọn, compile nhanh, thư viện network tốt và concurrency dễ diễn đạt. Java có ecosystem backend lớn, JVM/JIT trưởng thành và Java virtual threads cho I/O concurrency. Chọn theo workload đo được, ecosystem, vận hành và kỹ năng nhóm; không chọn chỉ theo benchmark chung.",
          "en": "A production service needs an overall deadline, per-dependency timeouts, bounded retries with backoff/jitter, and idempotency for writes. Infinite or synchronized retries can amplify an outage. Bound concurrency and queues to apply backpressure.\n\nFor graceful shutdown, mark the instance unready, stop accepting new requests, call `http.Server.Shutdown` with a deadline, wait for active requests/workers, then close the database, cache, and telemetry. Every goroutine needs a context or another exit signal.\n\nGo is a good fit when a team values compact binary deployment, fast compilation, strong networking libraries, and straightforward concurrency. Java offers a large backend ecosystem, a mature JVM/JIT, and virtual threads for I/O concurrency. Choose based on measured workload, ecosystem, operations, and team skills, not a generic benchmark."
        },
        "deepDive": {
          "vi": "Timeout cần chia ngân sách từ deadline request gốc; retry chỉ cho lỗi có khả năng hồi phục, có số lần tối đa, exponential backoff và jitter để các client không retry đồng bộ. Với write request, idempotency key giúp retry an toàn. Circuit breaker/load shedding có thể ngăn hệ thống tiếp tục gửi request tới dependency đang lỗi; cần metric để biết đang mở circuit hay reject bao nhiêu việc.\n\nGraceful shutdown là quy trình phối hợp: readiness false, ngừng nhận traffic/job, cho request đang chạy hoàn tất trong grace period, cancel worker, đợi goroutine, rồi đóng dependency. Nếu một bước hết deadline, cần fallback xác định thay vì treo process. Go so với Java không phải “nhẹ thắng nặng”: Go thường có footprint nhỏ và deploy binary đơn giản; Java có hệ sinh thái trưởng thành và virtual thread cho blocking I/O. Benchmark micro không thay thế test trên workload và điều kiện vận hành thật.",
          "en": "Timeouts divide the original request deadline into a budget. Retry only failures likely to recover, with a maximum attempt count, exponential backoff, and jitter so clients do not retry in lockstep. Idempotency keys make write retries safe. A circuit breaker or load shedding can stop sending work to a failing dependency; metrics should show breaker state and rejected work.\n\nGraceful shutdown is coordinated: mark readiness false, stop new traffic/jobs, let active requests finish within a grace period, cancel workers, wait for goroutines, then close dependencies. If a stage reaches its deadline, define a fallback instead of hanging the process. Go versus Java is not “light beats heavy”: Go often has a small footprint and simple binary deployment; Java has a mature ecosystem and virtual threads for blocking I/O. Microbenchmarks do not replace tests on real workloads and operating conditions."
        },
        "example": "ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)\ndefer cancel()\n\nif err := server.Shutdown(ctx); err != nil {\n    return fmt.Errorf(\"shutdown server: %w\", err)\n}",
        "exampleOutput": {
          "vi": "Khi server dừng trước deadline: `Shutdown` trả nil sau khi request đang chạy kết thúc. Nếu hết 10 giây: trả error để caller ghi log và chạy chính sách fallback.",
          "en": "If the server drains before the deadline, `Shutdown` returns nil after active requests finish. If 10 seconds elapse, it returns an error so the caller can log it and apply a fallback policy."
        },
        "walkthrough": {
          "vi": "Shutdown có deadline để process không chờ vô hạn. Nếu deadline hết, hệ thống cần chính sách fallback rõ ràng. Trong deploy nhiều replica, readiness/load balancer phải được phối hợp để drain đúng thứ tự.\n\nKhi giải thích lựa chọn Go/Java trong phỏng vấn, nêu yêu cầu, lựa chọn, trade-off và số đo; tránh nhận xét tuyệt đối kiểu “ngôn ngữ X luôn nhanh hơn”.",
          "en": "The shutdown deadline prevents the process from waiting forever. Define a clear fallback if it expires. In a multi-replica deployment, coordinate readiness and the load balancer so draining happens in the right order.\n\nWhen explaining a Go/Java choice in an interview, state the requirement, choice, trade-off, and measurements; avoid absolute claims such as “language X is always faster.”"
        },
        "pitfalls": {
          "vi": "- Không retry mọi lỗi; lỗi validation thường không tự hết.\n- Không shutdown DB trước khi request đang chạy kết thúc.\n- Chọn ngôn ngữ theo nhu cầu thật, không theo định kiến “light/heavy”.",
          "en": "- Do not retry every error; validation failures are usually not transient.\n- Do not shut down the database before active requests finish.\n- Choose a language for real requirements, not “light/heavy” stereotypes."
        },
        "exercise": {
          "vi": "Mô tả luồng shutdown cho API Go có worker nền và DB pool; chỉ ra thứ tự dừng và timeout.",
          "en": "Describe a shutdown sequence for a Go API with background workers and a DB pool; identify the stop order and deadlines."
        },
        "solution": {
          "vi": "Readiness false trước; ngừng nhận request; cancel context worker và ngừng nhận job; gọi HTTP Shutdown có deadline; đợi worker/request hoàn tất; cuối cùng đóng DB/cache và flush telemetry. Định nghĩa timeout/fallback cho từng bước để không treo vô hạn.",
          "en": "Mark readiness false; stop accepting requests; cancel worker contexts and stop accepting jobs; call HTTP Shutdown with a deadline; wait for requests/workers; finally close DB/cache and flush telemetry. Define a timeout/fallback for each stage so shutdown cannot hang forever."
        }
      }
    ]
  },
  {
    "id": "building-with-go",
    "title": {
      "vi": "6. Dùng Go làm sản phẩm",
      "en": "6. Building with Go"
    },
    "summary": {
      "vi": "Workflow hằng ngày, viết REST API, test và giải bài toán theo idiom Go.",
      "en": "Daily workflow, REST APIs, tests, and idiomatic problem solving."
    },
    "lessons": [
      {
        "id": "go-tool-workflow",
        "title": {
          "vi": "Workflow và công cụ Go",
          "en": "Go workflow and tools"
        },
        "outcome": {
          "vi": "Tạo module, format, test, vet và build project bằng toolchain chuẩn.",
          "en": "Create a module, format, test, vet, and build with the standard toolchain."
        },
        "lesson": {
          "vi": "Tạo module ở root bằng `go mod init`; dependency ngoài được ghi vào `go.mod`/`go.sum`. Sau khi thêm/bỏ import, chạy `go mod tidy`. Workflow thường ngày: `gofmt -w .` → `go test ./...` → `go vet ./...` → `go build ./...`. Khi nghi race, chạy `go test -race ./...`.\n\n`go run ./cmd/api` chạy executable; `go test -run TestName ./path` chạy một test. `go.mod` mô tả module và dependency; `go.sum` xác minh checksum dependency. Không cần framework hay nhiều abstraction để bắt đầu một project Go.",
          "en": "Initialize a module at the root with `go mod init`; external dependencies are recorded in `go.mod`/`go.sum`. After adding or removing imports, run `go mod tidy`. A common daily workflow is `gofmt -w .` → `go test ./...` → `go vet ./...` → `go build ./...`. When investigating races, run `go test -race ./...`.\n\n`go run ./cmd/api` starts an executable; `go test -run TestName ./path` runs one test. `go.mod` describes the module and dependencies; `go.sum` verifies dependency checksums. You do not need a framework or many abstractions to start a Go project."
        },
        "deepDive": {
          "vi": "Các bước bắt những lỗi khác nhau: format tạo style nhất quán; test xác nhận behavior; vet cảnh báo một số lỗi đáng ngờ; build xác nhận compile. Chúng bổ sung nhau chứ không thay thế nhau. Nếu project có nhiều chương trình, đặt entry point ở `cmd/<name>` và giữ package ứng dụng dùng chung bên ngoài `cmd`.",
          "en": "Each step catches different problems: formatting standardizes style; tests verify behavior; vet flags suspicious constructs; build checks compilation. They complement rather than replace one another. For multiple executables, put entry points under `cmd/<name>` and keep reusable application packages outside `cmd`."
        },
        "example": "go version\ngo mod init example.com/todos\ngofmt -w .\ngo test ./...\ngo vet ./...\ngo build ./...",
        "exampleOutput": {
          "vi": "Khi thành công, `go version` in phiên bản; `go mod init` tạo `go.mod`; các lệnh còn lại exit code 0. Test có thể in `ok example.com/todos/...`.",
          "en": "On success, `go version` prints the installed version; `go mod init` creates `go.mod`; the remaining commands exit with code 0. Tests may print `ok example.com/todos/...`."
        },
        "walkthrough": {
          "vi": "`go mod init` chạy một lần khi khởi tạo. Các lệnh format/test/vet/build chạy lại mỗi khi cần xác nhận thay đổi. Nếu test fail, thu hẹp bằng `-run`; nếu build local nhưng CI fail, so sánh Go version, OS/architecture và environment.",
          "en": "Run `go mod init` once when creating the project. Rerun format/test/vet/build to verify changes. Narrow failing tests with `-run`; when local builds pass but CI fails, compare Go version, OS/architecture, and environment."
        },
        "pitfalls": {
          "vi": "- Chạy `go mod init` lần nữa trong module đã có `go.mod`.\n- Chỉ chạy test package hiện tại mà quên `./...`.\n- Tưởng `go build` thay thế cho test.",
          "en": "- Running `go mod init` again in a module that already has `go.mod`.\n- Testing only the current package instead of `./...`.\n- Assuming `go build` replaces tests."
        },
        "exercise": {
          "vi": "Tạo module có một function và test; chạy đủ format, test, vet, build theo workflow.",
          "en": "Create a module with one function and a test; run format, test, vet, and build in order."
        },
        "solution": {
          "vi": "Chạy `go mod init example.com/hello`; viết function/test; chạy `gofmt -w .`, `go test ./...`, `go vet ./...`, `go build ./...`. Sửa lỗi tại bước phát hiện lỗi rồi chạy lại.",
          "en": "Run `go mod init example.com/hello`; write the function/test; run `gofmt -w .`, `go test ./...`, `go vet ./...`, and `go build ./...`. Fix failures where they are found and rerun."
        }
      },
      {
        "id": "first-rest-api",
        "title": {
          "vi": "Viết REST API đầu tiên",
          "en": "Write your first REST API"
        },
        "outcome": {
          "vi": "Tạo endpoint JSON có route, method, path parameter và kết quả HTTP.",
          "en": "Create a JSON endpoint with routing, method, path parameter, and an HTTP response."
        },
        "lesson": {
          "vi": "Trong Go 1.22+, `http.ServeMux` hiểu method-aware route như `GET /api/v1/hello/{name}`. Handler nhận `ResponseWriter` để ghi status/header/body và `*Request` để đọc input. `r.PathValue(\"name\")` lấy path parameter.\n\nĐặt `Content-Type` trước khi ghi body; nếu không gọi `WriteHeader`, status mặc định là 200. `json.NewEncoder(w).Encode(value)` serialize struct thành JSON. Server nên được khởi tạo tường minh để cấu hình timeout; ví dụ này chưa có database.",
          "en": "In Go 1.22+, `http.ServeMux` understands method-aware routes such as `GET /api/v1/hello/{name}`. A handler receives `ResponseWriter` to write status/headers/body and `*Request` to read input. `r.PathValue(\"name\")` retrieves a path parameter.\n\nSet `Content-Type` before writing the body; without `WriteHeader`, the status defaults to 200. `json.NewEncoder(w).Encode(value)` serializes a struct as JSON. Construct the server explicitly to configure timeouts; this example has no database."
        },
        "deepDive": {
          "vi": "Luồng HTTP: client gửi request → mux tìm route → handler validate và xử lý → ghi response. Handler có thể chạy đồng thời cho nhiều request, nên state dùng chung phải an toàn. Path/body là dữ liệu không tin cậy; validate theo domain và không ghép trực tiếp vào SQL/HTML. `ReadHeaderTimeout` hạn chế client gửi header quá lâu.",
          "en": "HTTP flow: client sends a request → mux selects a route → handler validates and processes it → response is written. Handlers can run concurrently, so shared state must be safe. Path/body data is untrusted; validate it for the domain and never concatenate directly into SQL/HTML. `ReadHeaderTimeout` limits slow header sends."
        },
        "example": "package main\n\nimport (\n    \"encoding/json\"\n    \"log\"\n    \"net/http\"\n    \"time\"\n)\n\ntype greeting struct {\n    Message string\n}\n\nfunc main() {\n    mux := http.NewServeMux()\n    mux.HandleFunc(\"GET /api/v1/hello/{name}\", func(w http.ResponseWriter, r *http.Request) {\n        w.Header().Set(\"Content-Type\", \"application/json; charset=utf-8\")\n        _ = json.NewEncoder(w).Encode(map[string]string{\"message\": \"Hello, \" + r.PathValue(\"name\")})\n    })\n\n    server := &http.Server{Addr: \":8080\", Handler: mux, ReadHeaderTimeout: 5 * time.Second}\n    log.Fatal(server.ListenAndServe())\n}",
        "exampleOutput": {
          "vi": "Chạy server rồi gọi `curl -i http://localhost:8080/api/v1/hello/Go`. Kết quả: status `200 OK`, content type JSON và body `json message Hello, Go`.",
          "en": "Start the server and call `curl -i http://localhost:8080/api/v1/hello/Go`. Result: status `200 OK`, JSON content type, and body `json message Hello, Go`."
        },
        "walkthrough": {
          "vi": "`HandleFunc` gắn method/path với handler. Route lấy `Go` từ URL rồi tạo JSON response; mux tự trả 405 nếu gọi POST vì route chỉ đăng ký GET. Chạy app trong terminal rồi dùng `curl -i` để quan sát status, header và body.",
          "en": "`HandleFunc` associates a method/path with a handler. The route reads `Go` from the URL and creates a JSON response; the mux returns 405 for POST because only GET is registered. Run the app and use `curl -i` to inspect status, headers, and body."
        },
        "pitfalls": {
          "vi": "- Method-aware route và `PathValue` cần Go 1.22+.\n- Ghi header sau khi body bắt đầu sẽ không đổi response.\n- API thật cần timeout, body limit, validation và graceful shutdown.",
          "en": "- Method-aware routes and `PathValue` require Go 1.22+.\n- Headers written after the body starts cannot change the response.\n- Real APIs need timeouts, body limits, validation, and graceful shutdown."
        },
        "exercise": {
          "vi": "Thêm `GET /healthz` trả `json status ok` và xác nhận POST không được chấp nhận.",
          "en": "Add `GET /healthz` returning `json status ok` and confirm POST is rejected."
        },
        "solution": {
          "vi": "Đăng ký `mux.HandleFunc(\"GET /healthz\", handler)`, đặt content type JSON và encode map có key `status`. Gọi POST để thấy 405.",
          "en": "Register `mux.HandleFunc(\"GET /healthz\", handler)`, set the JSON content type, and encode a map with a `status` key. Send POST to observe 405."
        }
      },
      {
        "id": "create-json-api",
        "title": {
          "vi": "POST API: nhận JSON và validate",
          "en": "POST API: decode and validate JSON"
        },
        "outcome": {
          "vi": "Nhận request body an toàn, validate dữ liệu và trả status/body đúng contract.",
          "en": "Safely decode request bodies, validate input, and return the correct status/body contract."
        },
        "lesson": {
          "vi": "Với endpoint tạo resource, dùng method POST và decode body JSON vào request struct riêng. Giới hạn body bằng `http.MaxBytesReader`; bật `DisallowUnknownFields` để bắt lỗi sai tên field; sau decode, validate quy tắc nghiệp vụ như title không rỗng.\n\nTrả 400 cho JSON hoặc input không hợp lệ, 201 Created khi tạo thành công. Response lỗi nên có schema ổn định, không trả stack trace hay lỗi database thô. Trong ứng dụng lớn, handler nên gọi service/use case rồi map lỗi domain sang HTTP, thay vì chứa toàn bộ nghiệp vụ.",
          "en": "For a resource-creation endpoint, use POST and decode the JSON body into a dedicated request struct. Limit the body with `http.MaxBytesReader`; enable `DisallowUnknownFields` to catch misspelled fields; after decoding, validate business rules such as a non-empty title.\n\nReturn 400 for malformed/invalid input and 201 Created on success. Error responses should have a stable schema and must not expose stack traces or raw database errors. In a larger application, the handler should call a service/use case and map domain errors to HTTP rather than containing all business logic."
        },
        "deepDive": {
          "vi": "Luồng xử lý: route match → body size limit → decode JSON → validate cú pháp/field → gọi service → ghi status và JSON đúng một lần. `ResponseWriter` commit header tại `WriteHeader` hoặc lần đầu ghi body; sau thời điểm đó không đổi status được. Vì vậy không ghi response thành công trước khi biết operation đã thành công.\n\nValidation ở handler giúp phản hồi nhanh, nhưng invariant cần đúng khi có request đồng thời (ví dụ email unique) vẫn phải được bảo vệ bằng unique constraint/transaction ở DB. POST không tự đảm bảo idempotency; client retry sau timeout có thể tạo hai resource, nên endpoint quan trọng có thể cần idempotency key.",
          "en": "Processing flow: route match → body-size limit → JSON decode → syntax/field validation → service call → write one status and JSON response. `ResponseWriter` commits headers at `WriteHeader` or the first body write; the status cannot be changed afterward. Do not write a success response before knowing the operation succeeded.\n\nHandler validation gives fast feedback, but invariants under concurrent requests (such as unique email) still require a database unique constraint/transaction. POST is not automatically idempotent; a client retry after a timeout may create a duplicate resource, so important endpoints may need an idempotency key."
        },
        "example": "type createTodoRequest struct {\n    Title string `json:\"title\"`\n}\n\nfunc createTodo(w http.ResponseWriter, r *http.Request) {\n    r.Body = http.MaxBytesReader(w, r.Body, 1<<20)\n    decoder := json.NewDecoder(r.Body)\n    decoder.DisallowUnknownFields()\n\n    var input createTodoRequest\n    if err := decoder.Decode(&input); err != nil {\n        http.Error(w, \"invalid JSON body\", http.StatusBadRequest)\n        return\n    }\n    input.Title = strings.TrimSpace(input.Title)\n    if input.Title == \"\" {\n        http.Error(w, \"title is required\", http.StatusBadRequest)\n        return\n    }\n\n    w.Header().Set(\"Content-Type\", \"application/json\")\n    w.WriteHeader(http.StatusCreated)\n    _ = json.NewEncoder(w).Encode(map[string]any{\n        \"title\": input.Title,\n        \"done\":  false,\n    })\n}",
        "exampleOutput": {
          "vi": "Request `POST /api/v1/todos` với body `json title Learn Go` trả `201 Created` và JSON `title: Learn Go, done: false`. Body sai hoặc title rỗng trả `400 Bad Request`.",
          "en": "A `POST /api/v1/todos` request with body `json title Learn Go` returns `201 Created` and JSON `title: Learn Go, done: false`. Malformed JSON or an empty title returns `400 Bad Request`."
        },
        "walkthrough": {
          "vi": "`MaxBytesReader` giới hạn body ở 1 MiB. Decoder từ chối field không biết; lỗi parse trả 400 trước khi chạy nghiệp vụ. `TrimSpace` xóa khoảng trắng rồi kiểm tra rỗng. Chỉ khi input hợp lệ mới trả 201. Đăng ký handler bằng `mux.HandleFunc(\"POST /api/v1/todos\", createTodo)`.",
          "en": "`MaxBytesReader` limits the body to 1 MiB. The decoder rejects unknown fields; parse errors return 400 before business logic. `TrimSpace` removes surrounding whitespace before checking for an empty title. Only valid input receives 201. Register it with `mux.HandleFunc(\"POST /api/v1/todos\", createTodo)`."
        },
        "pitfalls": {
          "vi": "- Không gọi `WriteHeader(201)` trước khi validate và tạo resource thành công.\n- Body limit không thay thế validation field.\n- Nếu thêm DB, không trả lỗi nội bộ trực tiếp cho client.",
          "en": "- Do not call `WriteHeader(201)` before validation and successful creation.\n- A body-size limit does not replace field validation.\n- If a database is added, do not expose internal errors to clients."
        },
        "exercise": {
          "vi": "Thêm giới hạn title 100 ký tự Unicode; title quá dài trả 400 với message dễ hiểu.",
          "en": "Add a 100-Unicode-code-point title limit; return 400 with a readable message when exceeded."
        },
        "solution": {
          "vi": "Sau `TrimSpace`, kiểm tra `len([]rune(input.Title)) > 100`. Nếu vượt, trả 400 với `title must be at most 100 characters` rồi return. Nếu contract giới hạn byte thay vì ký tự, dùng `len(input.Title)` và ghi rõ.",
          "en": "After `TrimSpace`, check `len([]rune(input.Title)) > 100`. If exceeded, return 400 with `title must be at most 100 characters`. If the contract limits bytes rather than characters, use `len(input.Title)` and document that explicitly."
        }
      },
      {
        "id": "api-validation-tests",
        "title": {
          "vi": "Test API bằng httptest",
          "en": "Test APIs with httptest"
        },
        "outcome": {
          "vi": "Kiểm tra status, header và JSON mà không cần mở cổng mạng.",
          "en": "Verify status, headers, and JSON without opening a network port."
        },
        "lesson": {
          "vi": "Body là input không tin cậy. Dùng `http.MaxBytesReader` giới hạn dung lượng; `json.Decoder` parse JSON; validate field theo nghiệp vụ. Lỗi input thường trả 400, tạo thành công trả 201, không tìm thấy trả 404, conflict trả 409. Không trả raw DB error hay stack trace cho client.\n\n`httptest.NewRequest` và `httptest.NewRecorder` cho phép gọi handler trong test mà không cần network thật. Kiểm tra contract bên ngoài: status, content type và JSON body. Handler nên nhận service/store qua dependency để test bằng fake thay vì phụ thuộc DB thật.",
          "en": "A request body is untrusted. Use `http.MaxBytesReader` to limit its size, `json.Decoder` to parse JSON, and validate fields against business rules. Invalid input commonly returns 400, successful creation 201, missing resources 404, and conflicts 409. Never expose raw DB errors or stack traces to clients.\n\n`httptest.NewRequest` and `httptest.NewRecorder` let tests invoke a handler without a real network. Verify the external contract: status, content type, and JSON body. Pass services/stores as dependencies so tests can use fakes instead of a real database."
        },
        "deepDive": {
          "vi": "Thứ tự handler dễ giữ đúng: giới hạn body → decode → validate → gọi use case → map error → ghi response đúng một lần. `ResponseWriter` gửi header khi `WriteHeader` hoặc lần ghi body đầu tiên; sau đó status không thể đổi. Validation format khác validation nghiệp vụ; invariant cạnh tranh như unique email vẫn phải được bảo vệ ở DB vì hai request có thể cùng vượt qua validation.\n\nUnit test xác nhận HTTP mapping; integration test mới xác nhận DB/broker thật. Dùng test table và `t.Run` cho các case hợp lệ, JSON lỗi, field thiếu, body quá lớn. Decode response thành struct thay vì so raw JSON nếu whitespace không phải contract.",
          "en": "A reliable handler order is: limit body → decode → validate → call the use case → map errors → write one response. `ResponseWriter` sends headers at `WriteHeader` or the first body write; after that, status cannot change. Format validation differs from business validation; race-sensitive invariants such as unique email must still be protected by the database because concurrent requests can both pass validation.\n\nUnit tests verify HTTP mapping; integration tests verify a real DB/broker. Use table tests and `t.Run` for valid input, malformed JSON, missing fields, and oversized bodies. Decode responses into structs rather than comparing raw JSON when whitespace is not part of the contract."
        },
        "example": "func TestCreateTodo(t *testing.T) {\n    body := strings.NewReader(\"{\\\"title\\\":\\\"Learn Go\\\"}\")\n    request := httptest.NewRequest(http.MethodPost, \"/api/v1/todos\", body)\n    response := httptest.NewRecorder()\n\n    createTodo(response, request)\n\n    if response.Code != http.StatusCreated {\n        t.Fatalf(\"status = %d, want 201\", response.Code)\n    }\n}",
        "exampleOutput": {
          "vi": "Test pass: `ok example.com/todos`. Nếu handler trả 400 thay vì 201, test báo `status = 400, want 201` mà không cần mở cổng HTTP.",
          "en": "Passing test: `ok example.com/todos`. If the handler returns 400 instead of 201, the test reports `status = 400, want 201` without opening an HTTP port."
        },
        "walkthrough": {
          "vi": "Request được tạo trong memory; recorder ghi response. Test gọi handler trực tiếp rồi assert status. Có thể decode `response.Body` để kiểm tra JSON và kiểm tra `Content-Type` bằng `response.Header()`.",
          "en": "The request is created in memory and the recorder captures the response. The test invokes the handler and asserts its status. Decode `response.Body` to check JSON and inspect `response.Header()` for content type."
        },
        "pitfalls": {
          "vi": "- Chỉ test status mà không kiểm tra body/header quan trọng.\n- Dùng sleep để đồng bộ thay vì channel/WaitGroup.\n- Gọi DB thật trong unit test cho handler mapping.",
          "en": "- Checking status while ignoring important body/headers.\n- Using sleeps for synchronization instead of channels/WaitGroups.\n- Calling a real database in a handler-mapping unit test."
        },
        "exercise": {
          "vi": "Thêm test cho request body sai JSON; xác nhận status 400 và error response có schema ổn định.",
          "en": "Add a test for malformed JSON; assert status 400 and a stable error response schema."
        },
        "solution": {
          "vi": "Dùng `strings.NewReader(\"{\")` làm body, gửi request POST đến handler, rồi kiểm tra status 400. Decode JSON response vào struct `apiError` và so sánh field Error.",
          "en": "Use `strings.NewReader(\"{\")` as the body, send a POST request to the handler, and assert status 400. Decode the JSON response into an `apiError` struct and compare its Error field."
        }
      },
      {
        "id": "go-problem-solving",
        "title": {
          "vi": "Giải bài toán theo idiom Go",
          "en": "Solve problems the Go way"
        },
        "outcome": {
          "vi": "Chọn cấu trúc dữ liệu đơn giản, xử lý lỗi rõ ràng và chỉ thêm concurrency khi có lợi.",
          "en": "Choose simple data structures, handle errors clearly, and add concurrency only when it helps."
        },
        "lesson": {
          "vi": "Cách làm thực dụng: làm rõ input/output → validate → chọn slice/map/struct đúng → viết vòng lặp dễ đọc → trả error ở nơi có thể xử lý. Bài nhỏ không cần class hierarchy hay abstraction tổng quát.\n\nDùng map cho lookup/đếm nhóm; slice cho danh sách có thứ tự; sort key trước khi in nếu cần output ổn định vì map không đảm bảo thứ tự. `io.Reader`/`io.Writer` giúp function làm việc với file, HTTP body hoặc memory buffer mà không gắn vào nguồn cụ thể.\n\nGiải tuần tự trước để có baseline đúng. Chỉ dùng goroutine khi tác vụ độc lập và có lợi ích rõ; sau đó thiết kế cancellation, giới hạn concurrency, đồng bộ kết quả và race test.",
          "en": "A practical approach is: clarify input/output → validate → choose the right slice/map/struct → write a readable loop → return errors where they can be handled. Small problems do not need a class hierarchy or general abstraction.\n\nUse a map for lookup/grouping/counting; a slice for ordered lists; sort keys when output must be stable because map order is unspecified. `io.Reader`/`io.Writer` let functions work with files, HTTP bodies, or memory buffers without depending on a specific source.\n\nSolve sequentially first for a correct baseline. Add goroutines only when tasks are independent and there is a clear benefit; then design cancellation, concurrency limits, result synchronization, and race tests."
        },
        "deepDive": {
          "vi": "Ví dụ tính tổng tiền theo customer: duyệt danh sách một lần để cập nhật map là O(n) trung bình; nếu cần báo cáo ổn định, lấy keys ra slice rồi sort O(k log k). Cách này thường rõ hơn dựng nhiều abstraction. Với dữ liệu lớn hơn memory, đọc dần qua `io.Reader` thay vì tải toàn bộ vào RAM.\n\nCPU-bound có thể chia việc theo số core; I/O-bound có thể overlap thời gian chờ nhưng vẫn cần worker pool/semaphore để bảo vệ dependency. Goroutine không làm O(n²) thành O(n), không tự retry và không đảm bảo thứ tự kết quả. Đo trước/sau; giữ phiên bản tuần tự nếu nó đơn giản và đủ nhanh.",
          "en": "For example, aggregate totals by customer: one pass updating a map is average O(n); for stable reporting, copy keys to a slice and sort in O(k log k). This is usually clearer than adding layers of abstraction. For data larger than memory, stream through `io.Reader` rather than loading everything into RAM.\n\nCPU-bound work can be partitioned near the core count; I/O-bound work can overlap waits but still needs a worker pool/semaphore to protect dependencies. Goroutines do not turn O(n²) into O(n), retry automatically, or guarantee result order. Measure before/after and keep the sequential version if it is simple and fast enough."
        },
        "example": "package main\n\nimport \"fmt\"\n\ntype Order struct {\n    Customer string\n    Amount   int\n}\n\nfunc main() {\n    orders := []Order{{\"An\", 20}, {\"Binh\", 15}, {\"An\", 5}}\n    totals := make(map[string]int)\n    for _, order := range orders {\n        totals[order.Customer] += order.Amount\n    }\n    fmt.Println(totals[\"An\"], totals[\"Binh\"])\n}",
        "exampleOutput": {
          "vi": "25 15\n\nMột lượt duyệt cộng doanh thu theo customer bằng map.",
          "en": "25 15\n\nOne pass aggregates revenue by customer using a map."
        },
        "walkthrough": {
          "vi": "Order đầu cộng 20 vào An, order thứ hai cộng 15 vào Binh, order cuối cộng thêm 5 cho An. Độ phức tạp trung bình O(n); nếu in toàn bộ map thì cần sort keys khi muốn output deterministic.",
          "en": "The first order adds 20 to An, the second adds 15 to Binh, and the last adds 5 more to An. Average complexity is O(n); sort keys before printing a whole map when deterministic output matters."
        },
        "pitfalls": {
          "vi": "- Không dựa vào thứ tự map.\n- Không tạo goroutine nếu chưa có bottleneck đo được.\n- Tiền thật cần kiểu và quy tắc làm tròn rõ ràng, không tùy tiện dùng float.",
          "en": "- Do not rely on map iteration order.\n- Do not add goroutines without a measured bottleneck.\n- Monetary values need explicit types and rounding rules; do not casually use float."
        },
        "exercise": {
          "vi": "Tính số đơn và tổng tiền theo customer; in theo tên tăng dần để kết quả ổn định.",
          "en": "Calculate order count and total per customer; print names in sorted order for stable output."
        },
        "solution": {
          "vi": "Dùng map từ customer đến struct `{Count, Total}`; duyệt orders một lần để cập nhật. Lấy keys ra slice, sort bằng `sort.Strings`, rồi in. Nếu Amount vượt miền int, chọn kiểu số phù hợp và validate.",
          "en": "Use a map from customer to a `{Count, Total}` struct; update it in one pass. Copy keys to a slice, sort with `sort.Strings`, and print. If Amount can exceed `int`, choose a suitable numeric type and validate."
        }
      }
    ]
  }
];
