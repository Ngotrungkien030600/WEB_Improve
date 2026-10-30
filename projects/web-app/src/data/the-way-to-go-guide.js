export const THE_WAY_TO_GO_PARTS = [
  {
    id: 'getting-started',
    title: { vi: 'Phần 1 · Vì sao học Go, bắt đầu thế nào', en: 'Part 1 · Why Go and how to start' },
    chapters: [
      {
        id: 'chapter-1', page: '26',
        title: { vi: 'Nguồn gốc, bối cảnh và sự phổ biến của Go', en: 'Origins, context, and popularity of Go' },
        summary: {
          vi: 'Chương mở đầu đặt Go vào bối cảnh: ngôn ngữ được tạo để làm phần mềm hệ thống và dịch vụ mạng dễ build, dễ đọc, dễ vận hành trong môi trường nhiều lập trình viên. Điểm đáng học không chỉ là tốc độ, mà là các lựa chọn thiết kế: cú pháp gọn, kiểu tĩnh, thư viện chuẩn mạnh, interface ngầm và concurrency tích hợp.',
          en: 'This chapter places Go in context: it was designed to make systems and network services easier to build, read, and operate across large teams. The lesson is not simply speed; it is the design trade-offs: compact syntax, static types, a strong standard library, implicit interfaces, and built-in concurrency primitives.',
        },
        terms: [
          { term: 'Static typing', vi: 'Kiểu được kiểm tra khi biên dịch, giúp bắt nhiều lỗi trước khi chạy.', en: 'Types are checked at compile time, catching many errors before execution.' },
          { term: 'Simplicity', vi: 'Giảm số cách biểu đạt tương đương để code nhóm dễ thống nhất.', en: 'Fewer equivalent ways to express code make team conventions easier.' },
          { term: 'Trade-off', vi: 'Mỗi ưu điểm đổi lấy giới hạn; hãy nêu cả hai khi chọn công nghệ.', en: 'Every benefit has a cost; state both when choosing a technology.' },
        ],
        example: `// Chọn Go vì yêu cầu vận hành, không chỉ vì benchmark.
serviceNeeds := []string{"fast startup", "simple deployment", "network I/O"}
fmt.Println(serviceNeeds)`,
        result: { vi: 'Chương trình in ba yêu cầu. Đây là ví dụ về cách bắt đầu từ nhu cầu sản phẩm rồi đánh giá Go có phù hợp không.', en: 'The program prints three requirements. Start with product needs, then assess whether Go fits them.' },
        exercise: { vi: 'Viết ba yêu cầu của một dịch vụ bạn định xây. Chỉ ra yêu cầu nào khiến Go phù hợp và yêu cầu nào cần kiểm chứng bằng thử nghiệm.', en: 'List three requirements for a service you plan to build. Identify which favor Go and which need measurement.' },
      },
      {
        id: 'chapter-2', page: '36',
        title: { vi: 'Cài đặt và môi trường chạy', en: 'Installation and runtime environment' },
        summary: {
          vi: 'Chương giới thiệu compiler, kiến trúc máy và runtime. Khi học hiện nay, tập trung vào cài Go chính thức, kiểm tra `go version`, hiểu `GOROOT`/`GOPATH` ở mức cần thiết và tạo module bằng `go mod init`. Hướng dẫn cài theo hệ điều hành trong sách có thể đã cũ; luôn đối chiếu tài liệu Go hiện hành.',
          en: 'This chapter introduces the compiler, target architectures, and runtime. For current practice, install Go from the official source, verify it with `go version`, understand `GOROOT`/`GOPATH` as needed, and create a module with `go mod init`. OS-specific installation instructions in an older edition may be outdated; check current Go documentation.',
        },
        terms: [
          { term: 'Compiler', vi: 'Dịch source Go thành chương trình có thể chạy trên target.', en: 'Translates Go source into a runnable program for a target.' },
          { term: 'Runtime', vi: 'Thành phần hỗ trợ goroutine, garbage collection và các dịch vụ lúc chạy.', en: 'Provides runtime support such as goroutines and garbage collection.' },
          { term: 'Module', vi: 'Đơn vị quản lý dependency, khai báo trong `go.mod`.', en: 'A dependency-management unit declared by `go.mod`.' },
        ],
        example: `go version
go env GOROOT GOPATH
go mod init example.com/hello`,
        result: { vi: 'Hai lệnh đầu cho biết phiên bản và cấu hình. Lệnh cuối tạo `go.mod` trong thư mục dự án.', en: 'The first commands show version and configuration. The last creates `go.mod` in the project directory.' },
        exercise: { vi: 'Tạo module mới và ghi lại phiên bản Go. Không chép đường dẫn cài đặt từ sách cũ; kiểm tra theo hệ điều hành hiện tại.', en: 'Create a new module and record the Go version. Use current installation instructions for your OS, not an old path from the book.' },
        note: { vi: 'GOROOT/GOPATH là khái niệm lịch sử quan trọng, nhưng quản lý dependency hiện đại dùng Go Modules.', en: 'GOROOT/GOPATH matter historically, but modern dependency management uses Go Modules.' },
      },
      {
        id: 'chapter-3', page: '53',
        title: { vi: 'Editor, IDE và công cụ phát triển', en: 'Editors, IDEs, and development tools' },
        summary: {
          vi: 'Mục tiêu là tạo vòng lặp phản hồi nhanh: format, chạy, test, đọc tài liệu và debug. Dùng `gofmt`, `go test`, `go vet`, `go doc`; benchmark bằng `go test -bench` và profile bằng pprof khi đã có số đo. Danh sách editor/debugger trong sách thuộc thời kỳ cũ, nhưng thói quen dùng toolchain thì vẫn còn giá trị.',
          en: 'The goal is a fast feedback loop: format, run, test, read documentation, and debug. Use `gofmt`, `go test`, `go vet`, and `go doc`; benchmark with `go test -bench` and profile with pprof after measuring. The editor/debugger list is dated, but the toolchain habits remain useful.',
        },
        terms: [
          { term: 'gofmt', vi: 'Formatter chuẩn, loại bỏ tranh luận về style.', en: 'The standard formatter that removes style debates.' },
          { term: 'go test', vi: 'Chạy unit test và benchmark trong package/module.', en: 'Runs package/module tests and benchmarks.' },
          { term: 'pprof', vi: 'Công cụ tìm nơi CPU hoặc memory đang được tiêu thụ.', en: 'Profiles where CPU time or memory is being spent.' },
        ],
        example: `gofmt -w .
go test ./...
go vet ./...
go doc net/http.ServeMux`,
        result: { vi: 'Nếu thành công, các lệnh kết thúc không có lỗi; `go doc` in tài liệu API của ServeMux.', en: 'On success, commands finish without errors; `go doc` prints the ServeMux API documentation.' },
        exercise: { vi: 'Tạo một function và test đơn giản, chạy lần lượt format, test, vet. Ghi rõ mỗi lệnh phát hiện loại vấn đề nào.', en: 'Create a small function and test, then run format, test, and vet. Note what each command catches.' },
      },
    ],
  },
  {
    id: 'core-language',
    title: { vi: 'Phần 2 · Cấu trúc và kỹ thuật cốt lõi', en: 'Part 2 · Core constructs and techniques' },
    chapters: [
      {
        id: 'chapter-4', page: '74',
        title: { vi: 'Cấu trúc cơ bản và kiểu dữ liệu', en: 'Basic constructs and elementary data types' },
        summary: {
          vi: 'Từ package/import và visibility đến biến, hằng, kiểu số, string, rune, pointer và chuyển kiểu. Hãy chú ý rằng string trong Go là byte bất biến thường chứa UTF-8; index string lấy byte, còn `range` giải mã rune. Đây là khác biệt quan trọng khi xử lý tiếng Việt.',
          en: 'Covers packages/imports and visibility, variables/constants, numeric types, strings, runes, pointers, and conversions. A Go string is immutable bytes, commonly UTF-8; indexing reads a byte, while `range` decodes runes. This distinction matters for Unicode text.',
        },
        terms: [
          { term: 'Zero value', vi: 'Giá trị mặc định hợp lệ như 0, false, chuỗi rỗng hoặc nil.', en: 'A valid default such as 0, false, empty string, or nil.' },
          { term: 'Rune', vi: 'Một Unicode code point, kiểu alias của `int32`.', en: 'A Unicode code point, an alias of `int32`.' },
          { term: 'Pointer', vi: 'Giữ địa chỉ để truy cập/thay đổi một giá trị.', en: 'Holds an address to access or mutate a value.' },
        ],
        example: `text := "Go ✓"
fmt.Println(len(text))
fmt.Println(utf8.RuneCountInString(text))`,
        result: { vi: 'Kết quả là `6` byte và `4` rune. Dấu ✓ chiếm nhiều byte UTF-8 nhưng là một rune.', en: 'The result is `6` bytes and `4` runes. The check mark uses multiple UTF-8 bytes but is one rune.' },
        exercise: { vi: 'Viết hàm đếm số rune của tên tiếng Việt có dấu; so sánh với `len` để thấy khác biệt.', en: 'Count runes in an accented Vietnamese name and compare the result with `len`.' },
      },
      {
        id: 'chapter-5', page: '126',
        title: { vi: 'Cấu trúc điều khiển', en: 'Control structures' },
        summary: {
          vi: 'Go dùng `if`, `switch`, `for`, `range`, `break` và `continue`. Function có thể trả nhiều giá trị, thường là `(value, error)`, nên xử lý lỗi nằm ngay trong luồng điều khiển. Viết nhánh sớm và ít lồng giúp người đọc nhìn rõ đường thành công/lỗi.',
          en: 'Go uses `if`, `switch`, `for`, `range`, `break`, and `continue`. Functions can return multiple values, commonly `(value, error)`, making error handling explicit in control flow. Early returns and shallow nesting make success and failure paths easier to follow.',
        },
        terms: [
          { term: 'range', vi: 'Duyệt phần tử của slice, array, map, string hoặc channel.', en: 'Iterates over slices, arrays, maps, strings, or channels.' },
          { term: 'Early return', vi: 'Thoát sớm khi điều kiện lỗi, giữ luồng chính thẳng.', en: 'Returns early on failure to keep the main path clear.' },
        ],
        example: `for _, name := range []string{"An", "Bình"} {
    if name == "" {
        continue
    }
    fmt.Println(name)
}`,
        result: { vi: 'In `An` rồi `Bình`; nhánh `continue` bỏ qua phần tử rỗng nếu có.', en: 'Prints `An` then `Bình`; `continue` skips an empty value if present.' },
        exercise: { vi: 'Duyệt slice số, chỉ in số dương và trả error nếu slice nil theo contract bạn chọn.', en: 'Iterate over integers, print only positive values, and define whether a nil slice is an error.' },
      },
      {
        id: 'chapter-6', page: '151',
        title: { vi: 'Hàm, defer và closure', en: 'Functions, defer, and closures' },
        summary: {
          vi: 'Học tham số/return, variadic function, named return, recursion, `defer` và closure. Closure giữ được biến từ scope bên ngoài; khi chạy đồng thời phải cẩn thận biến loop bị chia sẻ. `defer` chạy theo LIFO lúc function return, hữu ích để đóng file/unlock.',
          en: 'Covers parameters/returns, variadic functions, named returns, recursion, `defer`, and closures. A closure retains variables from an outer scope; concurrent code must avoid accidentally sharing loop variables. Deferred calls run LIFO when a function returns and are useful for closing files or unlocking.',
        },
        terms: [
          { term: 'defer', vi: 'Đặt cleanup chạy khi function kết thúc.', en: 'Schedules cleanup when the function exits.' },
          { term: 'Closure', vi: 'Function literal có thể capture biến ở scope ngoài.', en: 'A function literal that can capture outer-scope variables.' },
        ],
        example: `func makeCounter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}
next := makeCounter()
fmt.Println(next(), next())`,
        result: { vi: 'In `1 2`; hai lần gọi dùng chung biến `count` đã được closure capture.', en: 'Prints `1 2`; both calls share the captured `count` variable.' },
        exercise: { vi: 'Viết closure tạo bộ đếm riêng cho mỗi người dùng; xác định khi nào cần mutex nếu nhiều goroutine cùng gọi.', en: 'Create a separate counter closure per user; decide when a mutex is needed for concurrent calls.' },
      },
      {
        id: 'chapter-7', page: '182',
        title: { vi: 'Array và slice', en: 'Arrays and slices' },
        summary: {
          vi: 'Array có độ dài nằm trong kiểu; slice là descriptor trỏ vào backing array, gồm pointer/len/cap. `append` có thể dùng lại backing array hoặc cấp cái mới, nên luôn nhận giá trị trả về và không giả định hai slice độc lập. Cắt một vùng nhỏ có thể giữ cả backing array lớn trong memory.',
          en: 'Array length is part of its type; a slice is a descriptor pointing to a backing array with pointer/len/cap. `append` may reuse the backing array or allocate a new one, so always use its return value and do not assume slices are independent. A small subslice can keep a large backing array alive.',
        },
        terms: [
          { term: 'Backing array', vi: 'Vùng nhớ thực chứa phần tử mà slice đang nhìn vào.', en: 'The actual storage that a slice views.' },
          { term: 'Capacity', vi: 'Số phần tử slice có thể mở rộng trước khi cần array mới.', en: 'How far a slice can grow before needing new storage.' },
        ],
        example: `values := []int{1, 2}
view := values[:1]
view[0] = 9
fmt.Println(values)`,
        result: { vi: 'In `[9 2]`: `view` và `values` chia sẻ cùng backing array.', en: 'Prints `[9 2]`: `view` and `values` share a backing array.' },
        exercise: { vi: 'Tạo slice con rồi sửa phần tử; thử copy sang slice mới để tránh aliasing.', en: 'Mutate a subslice, then copy it into a new slice to avoid aliasing.' },
      },
      {
        id: 'chapter-8', page: '210',
        title: { vi: 'Map', en: 'Maps' },
        summary: {
          vi: 'Map ánh xạ key sang value; iteration không có thứ tự ổn định. Dạng `value, ok := m[key]` phân biệt key thiếu với zero value. Map nil đọc được nhưng không ghi được; concurrent read/write cần đồng bộ.',
          en: 'A map associates keys with values; iteration order is unspecified. The `value, ok := m[key]` form distinguishes a missing key from a zero value. A nil map can be read but not written; concurrent reads/writes require synchronization.',
        },
        terms: [
          { term: 'Comma-ok', vi: 'Cặp kết quả cho biết key có tồn tại hay không.', en: 'A two-result form that reports whether a key exists.' },
          { term: 'Map literal', vi: 'Cách khởi tạo map với key/value ban đầu.', en: 'A way to initialize a map with key/value pairs.' },
        ],
        example: `counts := map[string]int{}
counts["go"]++
value, ok := counts["go"]
fmt.Println(value, ok)`,
        result: { vi: 'In `1 true`; key tồn tại và count là 1.', en: 'Prints `1 true`; the key exists and its count is 1.' },
        exercise: { vi: 'Đếm tần suất từ trong đoạn văn rồi in theo alphabet để output ổn định.', en: 'Count word frequencies, then sort keys alphabetically for deterministic output.' },
      },
      {
        id: 'chapter-9', page: '221',
        title: { vi: 'Package và thư viện', en: 'Packages and libraries' },
        summary: {
          vi: 'Package tạo ranh giới tên và visibility; identifier viết hoa được export. Chương nói về standard library, package riêng, tài liệu, cài đặt và kiểm thử. Cách cài package trong sách thuộc thời kỳ GOPATH; hiện đại dùng module path và `go get`/`go mod tidy` theo mục đích.',
          en: 'Packages define name and visibility boundaries; uppercase identifiers are exported. The chapter covers the standard library, custom packages, docs, installation, and tests. Its GOPATH-era installation instructions are dated; modern projects use module paths and current `go get`/`go mod tidy` workflows.',
        },
        terms: [
          { term: 'Exported identifier', vi: 'Tên bắt đầu bằng chữ hoa, truy cập được từ package khác.', en: 'An uppercase-starting name accessible from other packages.' },
          { term: 'Standard library', vi: 'Các package có sẵn như `fmt`, `net/http`, `encoding/json`.', en: 'Built-in packages such as `fmt`, `net/http`, and `encoding/json`.' },
        ],
        example: `package greeting

func Hello(name string) string {
    return "Hello, " + name
}`,
        result: { vi: 'Package khác import module path và gọi `greeting.Hello("Go")`; chữ hoa giúp hàm được export.', en: 'Another package imports the module path and calls `greeting.Hello("Go")`; the uppercase name is exported.' },
        exercise: { vi: 'Tách hàm format greeting thành package riêng và gọi từ package main.', en: 'Move the greeting formatter to its own package and call it from package main.' },
        note: { vi: 'Các bước `go install`/GOPATH trong sách cần đối chiếu với Go Modules hiện nay.', en: 'The book’s GOPATH/`go install` steps should be compared with current Go Modules behavior.' },
      },
      {
        id: 'chapter-10', page: '249',
        title: { vi: 'Struct và method', en: 'Structs and methods' },
        summary: {
          vi: 'Struct gom dữ liệu; method gắn hành vi với receiver. Go thiên composition/embedding thay vì class inheritance. Chọn value receiver cho semantics copy; pointer receiver khi cần mutation hoặc tránh copy. Struct tags hỗ trợ encoding/decoding.',
          en: 'Structs group data; methods attach behavior to receivers. Go favors composition/embedding over class inheritance. Use value receivers for copy semantics and pointer receivers for mutation or avoiding copies. Struct tags support encoding/decoding.',
        },
        terms: [
          { term: 'Receiver', vi: 'Giá trị mà method được gọi trên đó.', en: 'The value a method is invoked on.' },
          { term: 'Embedding', vi: 'Cách ghép field/method từ kiểu khác, không phải inheritance đầy đủ.', en: 'A way to compose fields/methods, not full inheritance.' },
        ],
        example: `type Counter struct { Value int }
func (c *Counter) Add(n int) { c.Value += n }
c := Counter{}
c.Add(2)
fmt.Println(c.Value)`,
        result: { vi: 'In `2`; pointer receiver cập nhật struct gốc.', en: 'Prints `2`; the pointer receiver mutates the original struct.' },
        exercise: { vi: 'Thiết kế `BankAccount` với method Deposit và kiểm tra amount âm.', en: 'Design a `BankAccount` with Deposit and reject negative amounts.' },
      },
      {
        id: 'chapter-11', page: '288',
        title: { vi: 'Interface và reflection', en: 'Interfaces and reflection' },
        summary: {
          vi: 'Interface được implement ngầm theo method set; dùng để mô tả hành vi caller cần, ví dụ `io.Reader`. Type assertion/type switch kiểm tra dynamic type. Reflection có ích cho framework/serialization nhưng làm code khó kiểm tra hơn, chỉ dùng khi giải pháp tĩnh không phù hợp.',
          en: 'Interfaces are implemented implicitly through method sets and should describe behavior a caller needs, such as `io.Reader`. Type assertions/switches inspect dynamic types. Reflection can help frameworks/serialization but reduces static clarity; use it only when static alternatives do not fit.',
        },
        terms: [
          { term: 'Implicit implementation', vi: 'Không cần khai báo `implements`; đủ method là thỏa interface.', en: 'No `implements` declaration; providing the methods satisfies the interface.' },
          { term: 'Type assertion', vi: 'Lấy giá trị cụ thể từ interface, thường dùng dạng comma-ok để an toàn.', en: 'Extracts a concrete value from an interface; comma-ok is the safe form.' },
        ],
        example: `type Stringer interface { String() string }
func describe(v any) {
    if s, ok := v.(Stringer); ok { fmt.Println(s.String()) }
}`,
        result: { vi: 'Nếu giá trị implement `Stringer`, in nội dung String; nếu không, không panic vì dùng comma-ok.', en: 'If the value implements `Stringer`, its text is printed; otherwise comma-ok avoids a panic.' },
        exercise: { vi: 'Tạo interface một method cho nơi gọi cần lưu log, rồi viết implementation console.', en: 'Define a one-method logging interface for a consumer and implement it for console output.' },
        note: { vi: 'Reflection là mục nâng cao; ưu tiên interface/type switch nếu giải được bài toán.', en: 'Reflection is advanced; prefer interfaces/type switches when they solve the problem.' },
      },
    ],
  },
  {
    id: 'advanced-go',
    title: { vi: 'Phần 3 · Go nâng cao', en: 'Part 3 · Advanced Go' },
    chapters: [
      {
        id: 'chapter-12', page: '338',
        title: { vi: 'Đọc và ghi dữ liệu', en: 'Reading and writing' },
        summary: {
          vi: 'Làm việc với stdin, file, buffer, command-line flags, JSON/XML và serialization. Mẫu quan trọng là đóng resource bằng `defer` sau khi mở thành công, giới hạn dữ liệu đọc, kiểm tra error và dùng `io.Reader`/`io.Writer` để code dễ tái sử dụng.',
          en: 'Works with stdin, files, buffers, command-line flags, JSON/XML, and serialization. Important habits include deferring close after a successful open, limiting input size, checking errors, and using `io.Reader`/`io.Writer` for reusable code.',
        },
        terms: [
          { term: 'Buffered I/O', vi: 'Đọc/ghi theo khối để giảm số lần gọi hệ thống.', en: 'Reads/writes in chunks to reduce system calls.' },
          { term: 'Serialization', vi: 'Chuyển dữ liệu giữa struct và format truyền/lưu như JSON.', en: 'Converts data between structs and transport/storage formats such as JSON.' },
        ],
        example: `data, err := io.ReadAll(io.LimitReader(r, 1<<20))
if err != nil { return err }
fmt.Println(len(data))`,
        result: { vi: 'Đọc tối đa 1 MiB; input lớn hơn không bị đọc vô hạn.', en: 'Reads at most 1 MiB; larger input is not read without a bound.' },
        exercise: { vi: 'Đọc file JSON có giới hạn size, decode vào struct và báo lỗi rõ nếu JSON sai.', en: 'Read a size-limited JSON file into a struct and report malformed JSON clearly.' },
      },
      {
        id: 'chapter-13', page: '373',
        title: { vi: 'Xử lý lỗi và kiểm thử', en: 'Error handling and testing' },
        summary: {
          vi: 'Error là giá trị trả về tường minh; thêm ngữ cảnh bằng `%w`, phân loại bằng `errors.Is/As`. Chương cũng nói về panic, table-driven tests, benchmark và profiling. Panic dành cho trạng thái bất khả; lỗi dự kiến nên trả về để caller quyết định.',
          en: 'Errors are explicit return values; add context with `%w` and classify with `errors.Is/As`. The chapter also covers panic, table-driven tests, benchmarks, and profiling. Reserve panic for unrecoverable programmer states; return expected failures for callers to handle.',
        },
        terms: [
          { term: 'Error wrapping', vi: 'Bổ sung bối cảnh mà vẫn giữ nguyên lỗi gốc.', en: 'Adds context while preserving the original cause.' },
          { term: 'Table-driven test', vi: 'Chạy cùng một contract qua nhiều input/expected result.', en: 'Runs one contract across multiple inputs and expected results.' },
        ],
        example: `if err != nil {
    return fmt.Errorf("load user: %w", err)
}`,
        result: { vi: 'Caller có thể thêm bối cảnh và vẫn dùng `errors.Is/As` để kiểm tra lỗi gốc.', en: 'Callers can add context and still use `errors.Is/As` to inspect the cause.' },
        exercise: { vi: 'Viết test table cho input hợp lệ, input lỗi và kiểm tra `errors.Is` với sentinel error.', en: 'Write table tests for valid/invalid input and assert a sentinel error with `errors.Is`.' },
      },
      {
        id: 'chapter-14', page: '400',
        title: { vi: 'Goroutine và channel', en: 'Goroutines and channels' },
        summary: {
          vi: 'Từ concurrency/parallelism đến channel buffer, close, select, timeout, semaphore, worker pool và shutdown. Goroutine nhẹ hơn OS thread nhưng vẫn cần ownership, giới hạn tải, cancellation và đồng bộ dữ liệu; channel không tự làm mọi chương trình nhanh hơn.',
          en: 'From concurrency/parallelism to buffered channels, close, select, timeouts, semaphores, worker pools, and shutdown. Goroutines are lighter than OS threads but still need ownership, load limits, cancellation, and synchronization; channels do not automatically make every program faster.',
        },
        terms: [
          { term: 'Backpressure', vi: 'Giới hạn hoặc làm chậm producer khi consumer không theo kịp.', en: 'Limits/slows producers when consumers cannot keep up.' },
          { term: 'Select', vi: 'Chờ một trong nhiều channel operation hoặc context cancellation.', en: 'Waits for one of several channel operations or cancellation.' },
        ],
        example: `select {
case result := <-results:
    fmt.Println(result)
case <-ctx.Done():
    return ctx.Err()
}`,
        result: { vi: 'In kết quả nếu có trước; nếu context hết hạn/hủy thì trả lỗi context.', en: 'Prints a result if it arrives first; otherwise returns the context error on cancellation/deadline.' },
        exercise: { vi: 'Giới hạn worker ở mức 4, queue 20 job và đảm bảo shutdown không để goroutine chạy mãi.', en: 'Limit workers to 4, queue 20 jobs, and ensure shutdown leaves no goroutine running forever.' },
      },
      {
        id: 'chapter-15', page: '461',
        title: { vi: 'Networking và ứng dụng web', en: 'Networking and web applications' },
        summary: {
          vi: 'Chương đi từ TCP/server đơn giản tới web handler, template, RPC và WebSocket. Với Go hiện đại, học `net/http`, timeout, context, middleware vừa đủ và graceful shutdown; kiểm tra thư viện hiện hành trước khi dùng các kỹ thuật truyền thông cũ trong sách.',
          en: 'Moves from simple TCP servers to web handlers, templates, RPC, and WebSockets. For modern Go, focus on `net/http`, timeouts, context, minimal middleware, and graceful shutdown; verify current libraries before using older communication techniques from the book.',
        },
        terms: [
          { term: 'Handler', vi: 'Function xử lý request và ghi HTTP response.', en: 'A function that handles a request and writes an HTTP response.' },
          { term: 'WebSocket', vi: 'Kết nối hai chiều lâu dài; cần cân nhắc auth, ping/pong và reconnect.', en: 'A persistent bidirectional connection; consider auth, ping/pong, and reconnect.' },
        ],
        example: `mux := http.NewServeMux()
mux.HandleFunc("GET /healthz", healthHandler)
server := &http.Server{Addr: ":8080", Handler: mux, ReadHeaderTimeout: 5 * time.Second}`,
        result: { vi: 'Server có route health và timeout đọc header để giảm rủi ro client gửi header quá chậm.', en: 'The server exposes a health route and a header timeout to limit slow-client resource use.' },
        exercise: { vi: 'Thêm readiness endpoint; mô tả cách load balancer dùng readiness khi deploy nhiều instance.', en: 'Add a readiness endpoint and explain how a load balancer uses it across replicas.' },
      },
    ],
  },
  {
    id: 'applying-go',
    title: { vi: 'Phần 4 · Áp dụng Go', en: 'Part 4 · Applying Go' },
    chapters: [
      {
        id: 'chapter-16', page: '510',
        title: { vi: 'Pitfall thường gặp', en: 'Common Go pitfalls' },
        summary: {
          vi: 'Nhận diện shadowing do `:=`, nhầm byte với rune, defer trong loop, khác biệt `new`/`make`, pointer không cần thiết, closure capture và error handling kém. Học bằng cách dự đoán kết quả, chạy test/race detector rồi sửa để code thể hiện intent.',
          en: 'Covers shadowing with `:=`, byte/rune confusion, defers in loops, `new` versus `make`, unnecessary pointers, closure capture, and weak error handling. Learn by predicting behavior, running tests/race checks, then rewriting code to make intent clear.',
        },
        terms: [
          { term: 'Shadowing', vi: 'Biến trong scope trong che biến cùng tên ở scope ngoài.', en: 'An inner-scope variable hides an outer variable with the same name.' },
          { term: 'Aliasing', vi: 'Hai biến nhìn vào cùng vùng dữ liệu, thường gặp với slice/map.', en: 'Two values refer to the same underlying data, common with slices/maps.' },
        ],
        example: `value := 1
if true {
    value := 2
    fmt.Println(value)
}
fmt.Println(value)`,
        result: { vi: 'In `2` rồi `1`: `:=` trong block tạo biến mới và che biến ngoài.', en: 'Prints `2` then `1`: `:=` inside the block creates a new shadowing variable.' },
        exercise: { vi: 'Tìm một ví dụ shadowing trong code; sửa để biến bên ngoài được cập nhật hoặc đổi tên rõ ràng.', en: 'Find a shadowing case and fix it so the outer variable is updated or the name is clearer.' },
      },
      {
        id: 'chapter-17', page: '519',
        title: { vi: 'Các pattern ngôn ngữ Go', en: 'Go language patterns' },
        summary: {
          vi: 'Các idiom như comma-ok, defer và visibility giúp code ngắn mà vẫn rõ. Xem pattern như công cụ chứ không phải luật tuyệt đối: dùng comma-ok để phân biệt thiếu key; defer cho cleanup; export API tối thiểu cần thiết.',
          en: 'Idioms such as comma-ok, defer, and visibility keep code concise and clear. Treat patterns as tools, not absolute rules: use comma-ok to detect missing keys, defer for cleanup, and export only the API needed.',
        },
        terms: [
          { term: 'Comma-ok', vi: 'Nhận value cùng bool cho biết thao tác thành công/key tồn tại.', en: 'Returns a value plus a bool indicating success/key presence.' },
          { term: 'Visibility', vi: 'Chữ hoa export tên từ package; chữ thường giữ nội bộ.', en: 'Uppercase exports a package name; lowercase keeps it internal.' },
        ],
        example: `value, ok := settings["region"]
if !ok {
    value = "local"
}
fmt.Println(value)`,
        result: { vi: 'In `local` khi key region chưa được khai báo.', en: 'Prints `local` when the region key is absent.' },
        exercise: { vi: 'Đọc map cấu hình và fallback giá trị mặc định bằng comma-ok.', en: 'Read a config map and apply a default using comma-ok.' },
      },
      {
        id: 'chapter-18', page: '525',
        title: { vi: 'Code snippet và hiệu năng', en: 'Code snippets and performance advice' },
        summary: {
          vi: 'Chương gom mẹo cho string, slice, map, struct, interface, file, concurrency và network. Dùng như checklist tra cứu, không phải quy tắc tối ưu hóa mù quáng. Benchmark thực tế trước/sau; ưu tiên code dễ đọc nếu hiệu năng đã đạt yêu cầu.',
          en: 'Collects advice for strings, slices, maps, structs, interfaces, files, concurrency, and networking. Treat it as a reference checklist, not a mandate to micro-optimize. Benchmark representative workloads before/after; prefer clarity when performance already meets requirements.',
        },
        terms: [
          { term: 'Allocation', vi: 'Cấp phát bộ nhớ; đo bằng `-benchmem`/heap profile.', en: 'Memory allocation, measured with `-benchmem`/heap profiles.' },
          { term: 'Hot path', vi: 'Đường code chạy nhiều hoặc chiếm đáng kể latency/CPU.', en: 'A code path that runs often or dominates latency/CPU.' },
        ],
        example: `go test -bench . -benchmem ./...
go test -run '^$' -bench BenchmarkName -cpuprofile cpu.out`,
        result: { vi: 'Benchmark báo ns/op, B/op và allocs/op; CPU profile có thể mở bằng `go tool pprof cpu.out`.', en: 'Benchmarks report ns/op, B/op, and allocs/op; inspect a CPU profile with `go tool pprof cpu.out`.' },
        exercise: { vi: 'Benchmark một hàm trước/sau khi tối ưu; ghi lại môi trường và xác nhận test vẫn pass.', en: 'Benchmark a function before/after an optimization; record the environment and rerun tests.' },
      },
      {
        id: 'chapter-19', page: '534',
        title: { vi: 'Xây dựng ứng dụng hoàn chỉnh', en: 'Building a complete application' },
        summary: {
          vi: 'Sách theo một dự án URL shortener qua data model, web frontend, persistence và concurrency. Học cách nối package, HTTP handler, storage và giao diện; sau đó đánh giá lại persistence/error handling theo chuẩn hiện đại, thêm migration, tests và observability.',
          en: 'Follows a URL shortener through data modeling, web frontend, persistence, and concurrency. The key is connecting packages, HTTP handlers, storage, and UI; then revisit persistence/error handling with modern migrations, tests, and observability.',
        },
        terms: [
          { term: 'Persistence', vi: 'Lưu dữ liệu qua lần process restart.', en: 'Data survives process restarts.' },
          { term: 'Data model', vi: 'Cấu trúc biểu diễn dữ liệu và invariant của ứng dụng.', en: 'The structures representing application data and invariants.' },
        ],
        example: `POST /api/shorten {"url":"https://example.com"}
-> {"code":"a1b2c3"}
GET /a1b2c3
-> redirect to the original URL`,
        result: { vi: 'Ứng dụng nhận URL, trả mã ngắn và dùng mã đó để redirect. Trong thực tế cần uniqueness, validation, persistence và chống abuse.', en: 'The app accepts a URL, returns a short code, and redirects by that code. Production also needs uniqueness, validation, persistence, and abuse protection.' },
        exercise: { vi: 'Phác thảo package/API cho URL shortener; ghi rõ invariant nào phải giữ khi có hai request tạo cùng lúc.', en: 'Sketch packages/API for a URL shortener and state which invariants must hold under concurrent creation.' },
      },
      {
        id: 'chapter-20', page: '563',
        title: { vi: 'Go trên Google App Engine', en: 'Go on Google App Engine' },
        summary: {
          vi: 'Chương mô tả triển khai Go trên App Engine đời cũ: handler, config, datastore và deploy. Đây là nội dung lịch sử; không dùng các bước SDK/config làm hướng dẫn hiện hành. Học nguyên tắc portability, service boundary và cách đọc tài liệu cloud đang được hỗ trợ.',
          en: 'Describes an older Go App Engine workflow: handlers, configuration, datastore, and deployment. This is historical material; do not treat its SDK/config steps as current instructions. Focus on portability, service boundaries, and consulting currently supported cloud documentation.',
        },
        terms: [
          { term: 'Platform as a Service', vi: 'Nền tảng quản lý runtime/scale; ứng dụng tuân theo contract của nhà cung cấp.', en: 'A platform manages runtime/scaling; the app follows provider contracts.' },
          { term: 'Portability', vi: 'Tách business logic khỏi API độc quyền của cloud khi có thể.', en: 'Keep business logic decoupled from provider-specific APIs where possible.' },
        ],
        example: `// Keep HTTP handler logic separate from cloud storage adapters.
type URLStore interface {
    Save(ctx context.Context, code, target string) error
    }`,
        result: { vi: 'Interface cho phép thay adapter cloud/local mà không đổi business logic.', en: 'An interface allows cloud/local adapters to change without rewriting business logic.' },
        exercise: { vi: 'Liệt kê một API cloud độc quyền và đề xuất interface nhỏ để cô lập dependency đó.', en: 'Identify a provider-specific API and define a small interface to isolate it.' },
        note: { vi: 'Hướng dẫn SDK/deploy trong chương này có thể đã lỗi thời.', en: 'SDK/deployment instructions in this chapter may be obsolete.' },
      },
      {
        id: 'chapter-21', page: '584',
        title: { vi: 'Go trong thế giới thực', en: 'Go in the real world' },
        summary: {
          vi: 'Các case study cho thấy Go được dùng trong storage, voice systems, cluster management và content-addressable storage. Đọc để nhận diện trade-off kiến trúc, không xem hệ thống hay số liệu trong edition cũ là bản thiết kế hiện đại.',
          en: 'Case studies cover storage, voice systems, cluster management, and content-addressable storage. Read them to identify architectural trade-offs, not as current blueprints or performance claims.',
        },
        terms: [
          { term: 'Operational simplicity', vi: 'Ít thành phần cần cài/vận hành có thể giảm độ phức tạp triển khai.', en: 'Fewer runtime components can simplify deployment and operations.' },
          { term: 'Case study', vi: 'Ví dụ bối cảnh cụ thể; cần tách nguyên tắc bền vững khỏi chi tiết lịch sử.', en: 'A contextual example; separate enduring principles from historical details.' },
        ],
        example: `Requirement -> constraints -> architecture -> measurements
               -> failure modes -> operational plan`,
        result: { vi: 'Một lựa chọn công nghệ chỉ có ý nghĩa khi gắn với yêu cầu, constraint, failure mode và số đo.', en: 'A technology choice is meaningful only when tied to requirements, constraints, failure modes, and measurements.' },
        exercise: { vi: 'Chọn một case study; viết lại vấn đề, constraint và một trade-off bạn sẽ kiểm chứng ngày nay.', en: 'Choose a case study and restate its problem, constraints, and one trade-off you would revalidate today.' },
      },
    ],
  },
];
