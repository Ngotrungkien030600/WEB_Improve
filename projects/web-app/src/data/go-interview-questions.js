export const GO_INTERVIEW_TIERS = [
  {
    id: 'junior',
    label: { vi: 'Nền tảng', en: 'Fundamentals' },
    range: '0-2 năm',
    color: '#b7df69',
    hint: {
      vi: 'Tập trung vào cách Go biểu diễn dữ liệu, xử lý lỗi và thiết kế bằng composition.',
      en: 'Focus on how Go represents data, handles errors, and favors composition.',
    },
  },
  {
    id: 'middle',
    label: { vi: 'Thực chiến', en: 'Working Go' },
    range: '2-5 năm',
    color: '#f0b35b',
    hint: {
      vi: 'Giải thích được trade-off trong concurrency, API và vòng đời của request.',
      en: 'Explain trade-offs in concurrency, APIs, and request lifecycles.',
    },
  },
  {
    id: 'senior',
    label: { vi: 'Nâng cao', en: 'Advanced' },
    range: '5+ năm',
    color: '#77c9b2',
    hint: {
      vi: 'Đi sâu vào runtime, hiệu năng và cách thiết kế dịch vụ có giới hạn tài nguyên rõ ràng.',
      en: 'Go deeper into the runtime, performance, and resource-bounded service design.',
    },
  },
];

export const GO_INTERVIEW_QUESTIONS = {
  junior: [
    {
      topic: { vi: 'Ngôn ngữ & thiết kế', en: 'Language design' },
      q: {
        vi: 'Go được thiết kế cho những bài toán nào? Điểm khác biệt quan trọng so với ngôn ngữ hướng đối tượng truyền thống là gì?',
        en: 'What problems is Go designed to solve, and how does its design differ from traditional object-oriented languages?',
      },
      a: {
        vi: 'Go hướng tới phần mềm mạng, dịch vụ backend và công cụ cần build nhanh, triển khai gọn, dễ đọc và hỗ trợ concurrency. Go là ngôn ngữ biên dịch, kiểu tĩnh, có garbage collector và thư viện chuẩn mạnh.\n\nThay vì hệ thống class và kế thừa, Go ghép kiểu dữ liệu bằng struct, method và interface được implement ngầm. Goroutine và channel là công cụ trong thư viện/runtime để viết chương trình đồng thời; chúng không tự làm mọi chương trình nhanh hơn.\n\nKhi trả lời phỏng vấn, hãy nối đặc điểm với trade-off: cú pháp và build đơn giản, nhưng ít cơ chế trừu tượng hơn; cần thiết kế package và interface có chủ đích.',
        en: 'Go targets network software, backend services, and tools that benefit from fast builds, simple deployment, readable code, and built-in concurrency support. It is compiled and statically typed, has garbage collection, and ships with a strong standard library.\n\nInstead of classes and inheritance, Go combines structs, methods, and implicitly implemented interfaces. Goroutines and channels are runtime and library primitives for concurrent programs; they do not make every program faster by themselves.\n\nIn an interview, connect each feature to a trade-off: builds and syntax stay simple, while abstraction mechanisms are deliberately limited and package boundaries need care.',
      },
    },
    {
      topic: { vi: 'Biến & zero value', en: 'Variables & zero values' },
      q: {
        vi: 'Zero value trong Go là gì? Vì sao nó hữu ích, và khi nào vẫn cần khởi tạo tường minh?',
        en: 'What is a zero value in Go? Why is it useful, and when should you still initialize a value explicitly?',
      },
      a: {
        vi: 'Mỗi kiểu có giá trị mặc định hợp lệ: số là 0, bool là false, string là chuỗi rỗng; pointer, map, slice, channel, function và interface có thể là nil. Vì vậy biến khai báo nhưng chưa gán vẫn có giá trị xác định, giảm trạng thái chưa khởi tạo.\n\nZero value hữu ích khi kiểu được thiết kế để dùng ngay, ví dụ `sync.Mutex` không cần constructor. Nhưng map nil không nhận phép gán key và pointer nil không trỏ tới object; hãy khởi tạo map bằng `make` trước khi ghi.\n\n```go\nvar count int\nvar names []string\nlabels := make(map[string]string)\nlabels["env"] = "test"\n```',
        en: 'Every type has a defined default: numbers are 0, bool is false, and strings are empty; pointers, maps, slices, channels, functions, and interfaces may be nil. An unassigned variable therefore has a predictable value rather than uninitialized memory.\n\nZero values are useful when a type is ready to use as-is, such as `sync.Mutex`, which needs no constructor. A nil map cannot accept key assignments and a nil pointer does not refer to an object, so initialize a map with `make` before writing.\n\n```go\nvar count int\nvar names []string\nlabels := make(map[string]string)\nlabels["env"] = "test"\n```',
      },
    },
    {
      topic: { vi: 'Array & slice', en: 'Arrays & slices' },
      q: {
        vi: 'Array và slice khác nhau thế nào? Giải thích `len`, `cap`, `append` và một lỗi thường gặp khi dùng slice.',
        en: 'How do arrays and slices differ? Explain `len`, `cap`, `append`, and one common slice bug.',
      },
      a: {
        vi: 'Array có độ dài là một phần của kiểu và khi gán sẽ copy toàn bộ phần tử. Slice là descriptor gồm pointer tới backing array, length và capacity; bản thân slice không chứa toàn bộ dữ liệu.\n\n`len` là số phần tử đang nhìn thấy, `cap` là số phần tử có thể mở rộng trước khi cần backing array mới. `append` trả về slice mới vì có thể phải cấp phát backing array khác; luôn gán lại kết quả.\n\nHai slice có thể cùng chia sẻ backing array. Ghi qua slice này có thể làm slice kia đổi theo, và giữ một slice nhỏ có thể giữ cả mảng lớn trong bộ nhớ. Nếu cần độc lập, dùng `copy` hoặc `slices.Clone` phù hợp với phiên bản Go.\n\n```go\nitems := []int{1, 2}\nitems = append(items, 3)\n```',
        en: 'An array has a length that is part of its type and assignment copies all its elements. A slice is a descriptor containing a pointer to a backing array, a length, and a capacity; the slice itself does not hold all the data.\n\n`len` is the number of visible elements; `cap` is how far the slice can grow before it needs a new backing array. `append` returns a slice because it may allocate a different backing array, so always assign its result.\n\nTwo slices may share a backing array. A write through one can affect the other, and a small slice can keep a large array alive. Use `copy` or `slices.Clone` when an independent copy is required.\n\n```go\nitems := []int{1, 2}\nitems = append(items, 3)\n```',
      },
    },
    {
      topic: { vi: 'Map', en: 'Maps' },
      q: {
        vi: 'Map trong Go có những đặc tính nào? Có thể đọc map đồng thời không? Cách kiểm tra key tồn tại?',
        en: 'What are the key properties of Go maps? Can a map be read concurrently, and how do you check whether a key exists?',
      },
      a: {
        vi: 'Map là cấu trúc key-value; thứ tự duyệt không được đảm bảo. Đọc key chưa tồn tại trả zero value của kiểu value, nên dùng dạng hai kết quả để phân biệt key không có với key có giá trị zero. Map nil đọc được nhưng không ghi được.\n\nNhiều goroutine chỉ đọc map nếu không có ghi đồng thời là an toàn. Đọc/ghi đồng thời, hoặc nhiều ghi đồng thời, cần đồng bộ bằng `sync.Mutex`, `sync.RWMutex` hay một thiết kế sở hữu dữ liệu phù hợp. Không nên mặc định `sync.Map` là lựa chọn tốt hơn map thường.\n\n```go\nvalue, ok := counts["go"]\nif !ok {\n    value = 0\n}\n```',
        en: 'A map stores key-value pairs, and iteration order is unspecified. Reading a missing key returns the value type’s zero value, so use the two-result form to distinguish a missing key from a key holding that zero value. A nil map can be read but not written.\n\nConcurrent reads are safe when no goroutine writes. Concurrent reads and writes, or multiple writes, require synchronization such as `sync.Mutex`, `sync.RWMutex`, or an appropriate ownership design. `sync.Map` is not automatically a better choice than a regular map.\n\n```go\nvalue, ok := counts["go"]\nif !ok {\n    value = 0\n}\n```',
      },
    },
    {
      topic: { vi: 'Interface', en: 'Interfaces' },
      q: {
        vi: 'Interface được implement trong Go như thế nào? Giải thích lỗi “typed nil” khi trả interface.',
        en: 'How are interfaces implemented in Go? Explain the “typed nil” pitfall when returning an interface.',
      },
      a: {
        vi: 'Một kiểu implement interface nếu method set của nó thỏa interface; không cần khai báo `implements`. Điều này giúp package phụ thuộc vào hành vi nhỏ mà nó cần thay vì kiểu cụ thể. Nên định nghĩa interface ở phía caller và giữ interface vừa đủ nhỏ.\n\nInterface có thể hiểu là cặp dynamic type và dynamic value. Nếu trả một pointer nil được gán vào interface, dynamic type vẫn tồn tại nên interface khác nil.\n\n```go\nfunc load() error {\n    var err *MyError = nil\n    return err // interface error không nil\n}\n```\n\nCách tránh thường là trả `nil` trực tiếp khi không có lỗi, thay vì trả biến pointer nil dưới kiểu interface.',
        en: 'A type implements an interface when its method set satisfies that interface; there is no `implements` declaration. This lets a package depend on the small behavior it needs rather than a concrete type. Define interfaces near their callers and keep them focused.\n\nAn interface can be understood as a pair of dynamic type and dynamic value. If a nil pointer is assigned to an interface, its dynamic type is still present, so the interface is not nil.\n\n```go\nfunc load() error {\n    var err *MyError = nil\n    return err // the error interface is non-nil\n}\n```\n\nA common fix is to return `nil` directly when there is no error instead of returning a nil pointer through an interface value.',
      },
    },
    {
      topic: { vi: 'Xử lý lỗi', en: 'Error handling' },
      q: {
        vi: 'Go xử lý lỗi như thế nào? Khi nào nên wrap lỗi, và `errors.Is` khác so sánh chuỗi ra sao?',
        en: 'How does Go handle errors? When should you wrap an error, and how is `errors.Is` different from comparing strings?',
      },
      a: {
        vi: 'Lỗi thông thường là giá trị được trả về tường minh, thường ở kết quả cuối cùng. Caller quyết định xử lý, trả tiếp hay bổ sung ngữ cảnh. Cách này khiến luồng lỗi nhìn thấy ngay trong code.\n\nDùng `fmt.Errorf("...: %w", err)` để thêm ngữ cảnh nhưng vẫn giữ chuỗi lỗi gốc trong error chain. `errors.Is` kiểm tra một lỗi sentinel trong chain; `errors.As` tìm một giá trị có kiểu lỗi cụ thể. So sánh text bằng chuỗi dễ vỡ khi câu chữ thay đổi và không biểu diễn quan hệ lỗi.\n\n```go\nif err != nil {\n    return fmt.Errorf("load config: %w", err)\n}\n```',
        en: 'Ordinary errors are explicit values returned from functions, commonly as the final result. The caller decides whether to handle the error, return it, or add context. This keeps error paths visible in the code.\n\nUse `fmt.Errorf("...: %w", err)` to add context while preserving the original error in the chain. `errors.Is` checks for a sentinel error in that chain; `errors.As` finds a value of a particular error type. Comparing error text is fragile when wording changes and does not model error relationships.\n\n```go\nif err != nil {\n    return fmt.Errorf("load config: %w", err)\n}\n```',
      },
    },
  ],
  middle: [
    {
      topic: { vi: 'defer, panic & recover', en: 'defer, panic & recover' },
      q: {
        vi: '`defer` chạy khi nào? Thứ tự thực thi ra sao, và vì sao không nên dùng `panic` thay cho error?',
        en: 'When does `defer` run and in what order? Why should `panic` not replace ordinary errors?',
      },
      a: {
        vi: '`defer` được đăng ký khi hàm thực thi câu lệnh đó và chạy lúc hàm bao quanh sắp kết thúc, kể cả khi hàm return sớm. Nhiều defer chạy theo thứ tự LIFO. Đối số của lời gọi defer được đánh giá ngay lúc đăng ký, còn function literal có thể đọc biến tại thời điểm chạy.\n\nMẫu phổ biến là `defer file.Close()` sau khi mở thành công. `panic` dành cho trạng thái chương trình không thể tiếp tục bình thường; `recover` chỉ có tác dụng bên trong deferred function của cùng goroutine. Với lỗi dự kiến như input sai hay DB unavailable, hãy trả error để caller kiểm soát.\n\n```go\nfile, err := os.Open(name)\nif err != nil {\n    return err\n}\ndefer file.Close()\n```',
        en: '`defer` is registered when execution reaches it and runs as the surrounding function is about to return, including early returns. Multiple defers run in LIFO order. Arguments to a deferred call are evaluated at registration time, while a deferred closure can observe variables when it runs.\n\nA common pattern is `defer file.Close()` after a successful open. `panic` is for a state the program cannot reasonably continue from; `recover` only works in a deferred function in the same goroutine. For expected failures such as invalid input or an unavailable database, return an error so the caller can decide what to do.\n\n```go\nfile, err := os.Open(name)\nif err != nil {\n    return err\n}\ndefer file.Close()\n```',
      },
    },
    {
      topic: { vi: 'Method set & pointer receiver', en: 'Method sets & pointer receivers' },
      q: {
        vi: 'Khi nào dùng pointer receiver? Khác biệt method set của `T` và `*T` ảnh hưởng thế nào tới interface?',
        en: 'When should you use a pointer receiver? How can the method sets of `T` and `*T` affect interface implementation?',
      },
      a: {
        vi: 'Dùng pointer receiver khi method cần sửa receiver, khi struct lớn cần tránh copy, hoặc để nhất quán giữa các method. Value receiver phù hợp với giá trị nhỏ, bất biến và có ngữ nghĩa như value.\n\nMethod set của `T` chứa method có receiver `T`; method set của `*T` chứa method receiver `T` và `*T`. Vì vậy nếu interface cần method chỉ có receiver `*T`, thì `*T` implement interface nhưng `T` không. Compiler có thể tự lấy địa chỉ ở một số lời gọi method trên biến có thể addressable, nhưng điều đó không thay đổi quy tắc implement interface.\n\n```go\ntype Writer interface { Write([]byte) error }\ntype Buffer struct{}\nfunc (*Buffer) Write([]byte) error { return nil }\n```',
        en: 'Use a pointer receiver when the method must mutate the receiver, when copying a large struct would be wasteful, or to keep a type’s receiver style consistent. A value receiver fits small, immutable values with value semantics.\n\nThe method set of `T` contains methods with receiver `T`; the method set of `*T` contains methods with receiver `T` and `*T`. Therefore, if an interface requires a method defined only on `*T`, `*T` implements the interface but `T` does not. The compiler may take the address for some calls on addressable variables, but that does not change interface implementation rules.\n\n```go\ntype Writer interface { Write([]byte) error }\ntype Buffer struct{}\nfunc (*Buffer) Write([]byte) error { return nil }\n```',
      },
    },
    {
      topic: { vi: 'Goroutine & channel', en: 'Goroutines & channels' },
      q: {
        vi: 'Goroutine và channel giải quyết vấn đề gì? Phân biệt channel buffered và unbuffered, và lưu ý khi đóng channel.',
        en: 'What do goroutines and channels provide? Compare buffered and unbuffered channels, and explain when to close a channel.',
      },
      a: {
        vi: 'Goroutine là luồng thực thi nhẹ do Go runtime lập lịch; tạo goroutine rẻ hơn thread hệ điều hành nhưng vẫn tiêu thụ tài nguyên và phải có vòng đời rõ ràng. Channel truyền dữ liệu và tạo điểm đồng bộ giữa goroutine.\n\nUnbuffered channel đồng bộ send với receive: sender chờ tới khi receiver sẵn sàng. Buffered channel cho phép gửi tối đa capacity phần tử trước khi sender phải chờ. Đóng channel báo rằng không còn giá trị nào được gửi; thường chỉ bên gửi mới đóng, và không đóng nếu còn sender khác có thể gửi. Đọc channel đã đóng vẫn nhận các giá trị đã buffer rồi nhận zero value cùng `ok == false`.\n\n```go\nvalue, ok := <-results\nif !ok {\n    // channel đã đóng và hết dữ liệu\n}\n```',
        en: 'A goroutine is a lightweight execution unit scheduled by the Go runtime. Starting one is cheaper than an operating-system thread, but goroutines still consume resources and need a clear lifecycle. Channels pass values and provide synchronization points between goroutines.\n\nAn unbuffered channel synchronizes a send with a receive: the sender waits until a receiver is ready. A buffered channel accepts up to its capacity before senders block. Closing signals that no more values will be sent; normally only the sender closes it, and it should not be closed while another sender may still send. A receive from a closed channel drains buffered values, then returns the zero value with `ok == false`.\n\n```go\nvalue, ok := <-results\nif !ok {\n    // channel is closed and drained\n}\n```',
      },
    },
    {
      topic: { vi: 'Channel hay mutex', en: 'Channels or mutexes' },
      q: {
        vi: 'Khi nào nên dùng channel, khi nào nên dùng mutex? “Share memory by communicating” có nghĩa là bỏ mutex không?',
        en: 'When should you use a channel versus a mutex? Does “share memory by communicating” mean avoiding mutexes?',
      },
      a: {
        vi: 'Channel phù hợp để truyền dữ liệu, phối hợp công việc, báo hoàn thành hoặc chuyển quyền sở hữu giữa goroutine. Mutex phù hợp để bảo vệ trạng thái dùng chung khi thao tác cần cập nhật trực tiếp một cấu trúc dữ liệu.\n\nCâu nói “share memory by communicating” là nguyên tắc thiết kế, không phải lệnh cấm mutex. Chọn cách đơn giản nhất thể hiện rõ ownership và đồng bộ. Dùng channel cho một counter đơn giản có thể làm code vòng vèo; dùng mutex không đúng phạm vi lại gây race hoặc deadlock.\n\nDù chọn cách nào, hãy xác định ai sở hữu dữ liệu, thao tác nào được đồng bộ và goroutine kết thúc ra sao; xác nhận bằng `go test -race` khi có thể.',
        en: 'Channels fit data transfer, task coordination, completion signals, and transferring ownership between goroutines. A mutex fits protecting shared state when operations directly update a data structure.\n\n“Share memory by communicating” is a design principle, not a ban on mutexes. Choose the simplest approach that makes ownership and synchronization clear. Using a channel for a simple counter can add indirection; using a mutex with the wrong scope can still cause races or deadlocks.\n\nWhichever you choose, define who owns the data, which operations are synchronized, and how goroutines exit. Validate concurrent code with `go test -race` where practical.',
      },
    },
    {
      topic: { vi: 'Context & cancellation', en: 'Context & cancellation' },
      q: {
        vi: 'Context dùng để làm gì trong service Go? Quy tắc truyền context qua các tầng và lỗi thường gặp?',
        en: 'What is `context` for in a Go service? How should it flow across layers, and what are common mistakes?',
      },
      a: {
        vi: 'Context mang deadline, tín hiệu hủy và metadata theo phạm vi request. HTTP handler thường nhận context từ request, rồi truyền xuống query DB, RPC và các công việc cần dừng khi client rời đi hoặc timeout. Tạo child context với deadline hợp lý và luôn gọi cancel để giải phóng timer/tài nguyên.\n\nĐặt context làm tham số đầu tiên, thường tên `ctx`; không truyền nil và tránh lưu context lâu dài trong struct. Context không phải nơi chứa mọi tham số tùy chọn. Worker phải kiểm tra `ctx.Done()` để cancellation thực sự dừng việc; chỉ truyền context mà không quan sát nó là chưa đủ.\n\n```go\nctx, cancel := context.WithTimeout(parent, 2*time.Second)\ndefer cancel()\nresult, err := store.Load(ctx, id)\n```',
        en: '`context` carries a deadline, cancellation signal, and request-scoped metadata. An HTTP handler usually receives a request context and passes it to database queries, RPC calls, and work that should stop when the client disconnects or times out. Create child contexts with sensible deadlines and always call cancel to release timers and related resources.\n\nPass context as the first parameter, commonly named `ctx`; do not pass nil or keep it in a long-lived struct. It is not a general container for optional parameters. Workers must observe `ctx.Done()` for cancellation to stop work; merely passing a context is not enough.\n\n```go\nctx, cancel := context.WithTimeout(parent, 2*time.Second)\ndefer cancel()\nresult, err := store.Load(ctx, id)\n```',
      },
    },
    {
      topic: { vi: 'Data race & race detector', en: 'Data races & the race detector' },
      q: {
        vi: 'Data race là gì? Dùng race detector thế nào, và tại sao chương trình “chạy đúng trên máy tôi” chưa đủ?',
        en: 'What is a data race? How do you use the race detector, and why is “it works on my machine” insufficient?',
      },
      a: {
        vi: 'Data race xảy ra khi hai goroutine truy cập cùng vùng nhớ đồng thời, có ít nhất một thao tác ghi và không có đồng bộ phù hợp. Hành vi có race không đáng tin cậy; kết quả có thể thay đổi theo lịch chạy và tải.\n\nChạy test bằng `go test -race ./...` hoặc binary với `go run -race`. Detector phát hiện race trên các đường thực thi đã chạy, không chứng minh mọi đường đều an toàn. Vì vậy cần test tình huống đồng thời đại diện, xem xét ownership và đồng bộ, đồng thời chạy race detector trong CI ở phạm vi phù hợp.\n\n```sh\ngo test -race ./...\n```',
        en: 'A data race occurs when goroutines access the same memory concurrently, at least one access is a write, and there is no proper synchronization. Racy behavior is unreliable; results can vary with scheduling and load.\n\nRun tests with `go test -race ./...` or execute a binary with `go run -race`. The detector finds races on paths that actually execute; it does not prove that every path is safe. Test representative concurrent scenarios, review ownership and synchronization, and run the detector in CI where appropriate.\n\n```sh\ngo test -race ./...\n```',
      },
    },
    {
      topic: { vi: 'Generics', en: 'Generics' },
      q: {
        vi: 'Generics trong Go giải quyết nhu cầu nào? Khi nào dùng type parameter thay vì interface hoặc code riêng cho từng kiểu?',
        en: 'What problem do Go generics solve? When would you use type parameters instead of interfaces or type-specific code?',
      },
      a: {
        vi: 'Generics cho phép viết hàm hoặc kiểu dùng lại với nhiều kiểu dữ liệu mà vẫn giữ kiểm tra kiểu ở compile time. Constraint giới hạn các kiểu được chấp nhận và có thể yêu cầu method hoặc tập kiểu.\n\nDùng generics khi thuật toán/cấu trúc dữ liệu thực sự giống nhau qua nhiều kiểu, ví dụ hàm map/filter tổng quát hoặc container. Dùng interface khi cần đa hình theo hành vi ở runtime, đặc biệt khi các kiểu khác nhau cần cùng một contract. Dùng code cụ thể nếu chỉ có một trường hợp; abstraction quá tổng quát làm API khó hiểu hơn.\n\n```go\nfunc Contains[T comparable](items []T, target T) bool {\n    for _, item := range items {\n        if item == target { return true }\n    }\n    return false\n}\n```',
        en: 'Generics let functions or types work with multiple data types while retaining compile-time type checking. A constraint limits accepted types and can require methods or a type set.\n\nUse generics when the same algorithm or data structure genuinely applies across types, such as a reusable map/filter function or container. Use an interface for runtime polymorphism when different types need to satisfy the same behavior contract. Keep code concrete when there is only one case; an overly general abstraction can make an API harder to understand.\n\n```go\nfunc Contains[T comparable](items []T, target T) bool {\n    for _, item := range items {\n        if item == target { return true }\n    }\n    return false\n}\n```',
      },
    },
    {
      topic: { vi: 'Goroutine vs Java thread', en: 'Goroutines vs Java threads' },
      q: {
        vi: 'Vì sao thường nói goroutine nhẹ hơn Java platform thread? Mô hình scheduling khác nhau thế nào, và nhận định này có ngoại lệ gì?',
        en: 'Why are goroutines often described as lighter than Java platform threads? How does scheduling differ, and what is an important caveat?',
      },
      a: {
        vi: 'Goroutine là đơn vị chạy do Go runtime quản lý. Runtime multiplex nhiều goroutine (G) lên một số OS thread (M) thông qua scheduler; goroutine có stack nhỏ và tăng khi cần. Vì vậy tạo nhiều goroutine thường rẻ hơn việc tạo cùng số lượng OS thread, nhưng chúng vẫn tiêu thụ memory, CPU và cần giới hạn khi tải không ổn định.\n\nJava platform thread thường gắn với một OS thread, nên mỗi thread có chi phí tài nguyên và scheduling lớn hơn. Nhưng không nên kết luận “Java thread luôn nặng”: từ Java 21, virtual thread là thread nhẹ do JVM quản lý và multiplex lên platform thread, phù hợp với nhiều tác vụ blocking I/O.\n\nChọn Go không chỉ vì goroutine: cân nhắc runtime footprint, khởi động, triển khai binary, thư viện, hệ sinh thái, hiệu năng đã đo và kinh nghiệm nhóm. Nêu rõ đang so với Java platform thread hay virtual thread; concurrency cũng không đồng nghĩa với parallelism.',
        en: 'A goroutine is an execution unit managed by the Go runtime. The runtime multiplexes many goroutines (G) over a smaller number of OS threads (M) through its scheduler; goroutines start with small stacks that grow as needed. This usually makes creating many goroutines cheaper than creating the same number of OS threads, but they still consume memory and CPU and must be bounded under unstable load.\n\nA Java platform thread is generally tied to an OS thread, which has higher resource and scheduling costs. However, “Java threads are always heavy” is no longer accurate: since Java 21, virtual threads are lightweight JVM-managed threads multiplexed onto platform threads, and work well for many blocking I/O tasks.\n\nChoose Go for more than goroutines: consider runtime footprint, startup, binary deployment, libraries, ecosystem, measured performance, and team experience. State whether you mean Java platform or virtual threads; concurrency is also distinct from parallelism.',
      },
    },
    {
      topic: { vi: 'Mutex cục bộ vs distributed lock', en: 'Local mutex vs distributed lock' },
      q: {
        vi: 'Primitive lock như `sync.Mutex` khác distributed lock thế nào? Khi nào dùng Redis lock, và những lỗi nào cần phòng tránh?',
        en: 'How does a primitive lock such as `sync.Mutex` differ from a distributed lock? When would you use a Redis lock, and what failure modes matter?',
      },
      a: {
        vi: '`sync.Mutex` đồng bộ goroutine trong cùng process và bảo vệ vùng nhớ cục bộ. Nó nhanh, không phụ thuộc network, nhưng không phối hợp được hai instance service vì mỗi instance có mutex và memory riêng.\n\nDistributed lock dùng một hệ thống chung như Redis để các instance cùng tranh quyền sở hữu một key có lease. Mẫu cơ bản là `SET lock:resource token NX PX ttl`; token phải duy nhất, và khi release cần kiểm tra token rồi xóa atomically để không xóa lock mà instance khác đã lấy. Lease hết hạn trong lúc owner vẫn chạy có thể khiến hai worker cùng hành động; với thao tác quan trọng, cân nhắc fencing token tăng dần, idempotency và ràng buộc/transaction ở database.\n\nRedis lock không thay thế transaction và không tự bảo đảm mọi tình huống network partition. Chỉ dùng distributed lock khi cần phối hợp qua nhiều process; nếu dữ liệu chỉ nằm trong một process, dùng mutex. Với invariant tài chính hoặc tồn kho, DB constraint/transaction thường là nguồn bảo đảm cuối cùng.',
        en: '`sync.Mutex` synchronizes goroutines inside one process and protects local memory. It is fast and needs no network, but it cannot coordinate service instances because each instance has its own mutex and memory.\n\nA distributed lock uses a shared system such as Redis so multiple instances compete for a key with a lease. A basic form is `SET lock:resource token NX PX ttl`; use a unique token and release atomically only if the stored token still matches, so an old owner cannot delete a lock acquired by another instance. A lease can expire while its owner is still working, allowing overlapping work; for critical operations consider monotonically increasing fencing tokens, idempotency, and database constraints/transactions.\n\nA Redis lock does not replace transactions or guarantee correctness under every network partition. Use a distributed lock only when coordination must cross processes; use a mutex for state confined to one process. For financial or inventory invariants, database constraints/transactions are often the final authority.',
      },
    },
    {
      topic: { vi: 'Redis cache', en: 'Redis caching' },
      q: {
        vi: 'Bạn thiết kế cache-aside với Redis trong service Go như thế nào? Làm sao xử lý stale data, cache stampede và Redis bị lỗi?',
        en: 'How would you implement Redis cache-aside in a Go service? How would you handle stale data, cache stampedes, and Redis failures?',
      },
      a: {
        vi: 'Cache-aside: đọc cache trước; cache miss thì đọc nguồn dữ liệu, ghi kết quả vào cache với TTL rồi trả về. Khi cập nhật dữ liệu, thường cập nhật DB trước rồi invalidate hoặc refresh cache. Key cần có namespace/version, TTL cần phản ánh mức stale chấp nhận được. Cache là bản sao có thể mất hoặc cũ, không phải nguồn dữ liệu chính.\n\nGiảm stampede bằng singleflight/locking ngắn theo key, stale-while-revalidate hoặc jitter TTL; chọn biện pháp theo tải và tính đúng đắn. Timeout mọi lệnh Redis, giới hạn connection/pool và concurrency; khi Redis lỗi, fallback về DB có giới hạn để tránh dồn tải làm DB sập. Theo dõi hit rate, latency, eviction, lỗi và tải DB.\n\nVới Go có thể dùng `context` trong thao tác Redis và `singleflight` để gộp các lần tải cùng key trong một process. Cách này không phối hợp nhiều instance; distributed coordination cần thiết kế riêng.',
        en: 'With cache-aside, read the cache first; on a miss, read the source of truth, populate the cache with a TTL, and return the value. On writes, update the database first, then invalidate or refresh the cache. Use namespaced/versioned keys and choose TTLs based on acceptable staleness. A cache is a disposable, potentially stale copy, not the source of truth.\n\nMitigate stampedes with per-key singleflight or short-lived locking, stale-while-revalidate, or TTL jitter; choose based on workload and correctness requirements. Set timeouts for Redis calls and bound connection use and concurrency. If Redis fails, use a bounded database fallback so the fallback itself does not overload the database. Monitor hit rate, latency, evictions, errors, and database load.\n\nIn Go, pass `context` to Redis operations and use `singleflight` to coalesce loads for the same key within one process. That does not coordinate separate instances; distributed coordination needs separate design.',
      },
    },
    {
      topic: { vi: 'Kafka message queue', en: 'Kafka message queues' },
      q: {
        vi: 'Kafka khác queue truyền thống thế nào? Thiết kế Go consumer an toàn với at-least-once delivery, ordering, retry và backpressure ra sao?',
        en: 'How does Kafka differ from a traditional queue? How would you build a Go consumer for at-least-once delivery, ordering, retries, and backpressure?',
      },
      a: {
        vi: 'Kafka là distributed append-only log được chia partition và lưu theo retention; consumer đọc theo offset và có thể đọc lại. Queue truyền thống thường bỏ message sau khi ack, còn Kafka giữ log để nhiều consumer group độc lập xử lý. Ordering chỉ được đảm bảo trong một partition; chọn message key để các event cần đúng thứ tự đi cùng partition.\n\nAt-least-once nghĩa là có thể xử lý lặp. Consumer chỉ commit offset sau khi xử lý thành công theo semantics mong muốn, và handler phải idempotent (ví dụ unique event ID hoặc inbox table). Lỗi transient dùng retry có giới hạn/backoff; lỗi poison message cần dead-letter path và quan sát được.\n\nTrong Go, giới hạn số goroutine/records đang xử lý, tôn trọng context khi shutdown, và không commit offset vượt qua record chưa hoàn tất nếu cần giữ thứ tự. Kafka và DB không tự tạo một transaction nguyên tử chung; với DB write + publish, cân nhắc transactional outbox. Đo lag, throughput, retry, DLQ và thời gian xử lý.',
        en: 'Kafka is a distributed append-only log split into partitions and retained for a configured period; consumers read by offset and can replay. A traditional queue commonly removes a message after acknowledgement, whereas Kafka retains the log for independent consumer groups. Ordering is guaranteed only within a partition, so choose a key that places order-sensitive events in the same partition.\n\nAt-least-once delivery can repeat work. Commit offsets only after successful processing according to the required semantics, and make handlers idempotent (for example, with a unique event ID or inbox table). Use bounded retries/backoff for transient errors; route poison messages to an observable dead-letter path.\n\nIn Go, bound goroutines/in-flight records, honor context during shutdown, and avoid committing past unfinished records when ordering matters. Kafka and a database do not provide one shared atomic transaction by default; consider a transactional outbox for database writes plus event publishing. Monitor lag, throughput, retries, DLQ, and processing time.',
      },
    },
  ],
  senior: [
    {
      topic: { vi: 'Go scheduler', en: 'The Go scheduler' },
      q: {
        vi: 'Mô hình G-M-P mô tả scheduler Go thế nào? Vì sao một goroutine bị block không nhất thiết làm block cả process?',
        en: 'How does the G-M-P model describe the Go scheduler? Why does one blocked goroutine not necessarily block the process?',
      },
      a: {
        vi: 'Ở mức khái niệm, G là goroutine, M là OS thread, P là tài nguyên lập lịch cần để M chạy Go code. Runtime ghép runnable G với M đang có P; số P bị giới hạn bởi `GOMAXPROCS`, trong khi M có thể được tạo thêm trong một số tình huống.\n\nKhi goroutine chờ channel, timer hay thao tác runtime nhận biết được, runtime có thể đưa G sang trạng thái chờ và chạy G khác trên P. Syscall có thể block một M; runtime có thể để M khác tiếp tục với P. Chi tiết triển khai thay đổi theo phiên bản, nên khi phỏng vấn hãy trình bày mô hình và hệ quả thay vì khẳng định scheduler luôn hoạt động theo một lịch cố định.\n\nConcurrency giúp tiến triển nhiều tác vụ; parallelism là thực thi đồng thời trên nhiều core. `GOMAXPROCS` ảnh hưởng số luồng Go code có thể chạy song song, không phải giới hạn số goroutine.',
        en: 'At a conceptual level, G is a goroutine, M is an OS thread, and P is the scheduling resource an M needs to execute Go code. The runtime pairs runnable Gs with Ms that hold Ps; the number of Ps is bounded by `GOMAXPROCS`, while more Ms may be created in some situations.\n\nWhen a goroutine waits on a channel, timer, or runtime-aware operation, the runtime can park that G and run another on the P. A syscall may block an M while another M continues with a P. Implementation details evolve, so explain the model and its implications rather than claiming the scheduler always follows one fixed schedule.\n\nConcurrency enables progress across multiple tasks; parallelism means execution on multiple cores. `GOMAXPROCS` affects how many threads can execute Go code in parallel, not the number of goroutines.',
      },
    },
    {
      topic: { vi: 'GC & allocation', en: 'Garbage collection & allocation' },
      q: {
        vi: 'Go garbage collector và escape analysis ảnh hưởng hiệu năng ra sao? Bạn sẽ điều tra allocation tăng bằng cách nào?',
        en: 'How do Go’s garbage collector and escape analysis affect performance? How would you investigate rising allocations?',
      },
      a: {
        vi: 'Go dùng garbage collector tracing đồng thời để thu hồi object không còn reachable. GC giảm công việc quản lý bộ nhớ thủ công nhưng vẫn tốn CPU và có thể ảnh hưởng latency, đặc biệt khi allocation rate và heap lớn. Escape analysis của compiler quyết định giá trị có thể ở stack hay phải sống lâu hơn trên heap; đừng giả định pointer luôn gây heap allocation.\n\nBắt đầu bằng benchmark đại diện, `go test -bench . -benchmem`, CPU/heap profile qua `pprof`, rồi xem `go build -gcflags=-m` để đọc gợi ý escape. Tối ưu theo số đo: giảm allocation không cần thiết, tránh giữ object lớn lâu, chọn cấu trúc dữ liệu hợp lý. Không tối ưu chỉ dựa trên suy đoán hoặc cố ép mọi thứ lên stack.\n\n```sh\ngo test -bench . -benchmem ./...\ngo test -run=^$ -bench BenchmarkName -memprofile=mem.out\n```',
        en: 'Go uses a concurrent tracing garbage collector to reclaim objects that are no longer reachable. GC avoids manual memory management, but it still consumes CPU and can affect latency, especially with high allocation rates and a large heap. Compiler escape analysis decides whether a value can live on the stack or must outlive the stack frame on the heap; do not assume that every pointer causes a heap allocation.\n\nStart with representative benchmarks using `go test -bench . -benchmem`, CPU/heap profiles through `pprof`, and `go build -gcflags=-m` for escape-analysis diagnostics. Optimize from measurements: remove unnecessary allocations, avoid retaining large objects, and choose suitable data structures. Do not optimize from guesses or try to force everything onto the stack.\n\n```sh\ngo test -bench . -benchmem ./...\ngo test -run=^$ -bench BenchmarkName -memprofile=mem.out\n```',
      },
    },
    {
      topic: { vi: 'HTTP server & graceful shutdown', en: 'HTTP servers & graceful shutdown' },
      q: {
        vi: 'Thiết kế graceful shutdown cho HTTP service Go như thế nào để không làm mất request đang xử lý?',
        en: 'How would you implement graceful shutdown for a Go HTTP service without dropping in-flight requests?',
      },
      a: {
        vi: 'Chờ tín hiệu shutdown, ngừng nhận traffic mới ở tầng triển khai nếu có, rồi gọi `http.Server.Shutdown` với context có deadline. Shutdown đóng listener và chờ handler hiện tại kết thúc tới deadline; nếu hết thời gian cần chính sách fallback có kiểm soát.\n\nCần dừng các worker nền, hủy context gốc, flush telemetry/log nếu cần, và đóng dependency như DB sau khi request đã ngừng dùng chúng. Đặt timeout server-side cho header, read/write và idle để giảm kết nối treo. Hãy nghĩ tới readiness: đánh dấu instance không ready trước khi drain để load balancer ngừng gửi request mới.\n\n```go\nctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)\ndefer cancel()\nif err := server.Shutdown(ctx); err != nil {\n    return fmt.Errorf("graceful shutdown: %w", err)\n}\n```',
        en: 'Wait for a shutdown signal, stop new traffic at the deployment layer when available, and call `http.Server.Shutdown` with a deadline-bearing context. Shutdown closes the listener and waits for active handlers until the deadline; define a controlled fallback for timeouts.\n\nStop background workers, cancel the root context, flush telemetry/logs if required, and close dependencies such as the database after requests no longer use them. Configure server-side header, read/write, and idle timeouts to limit stuck connections. Consider readiness: mark the instance unready before draining so the load balancer stops sending new requests.\n\n```go\nctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)\ndefer cancel()\nif err := server.Shutdown(ctx); err != nil {\n    return fmt.Errorf("graceful shutdown: %w", err)\n}\n```',
      },
    },
    {
      topic: { vi: 'database/sql & transaction', en: 'database/sql & transactions' },
      q: {
        vi: '`sql.DB` đại diện cho gì? Bạn quản lý connection pool và transaction như thế nào trong service tải cao?',
        en: 'What does `sql.DB` represent? How would you manage its connection pool and transactions in a high-load service?',
      },
      a: {
        vi: '`sql.DB` là handle quản lý pool connection an toàn cho nhiều goroutine, không phải một connection đơn. Tạo một DB handle dùng lại, cấu hình `SetMaxOpenConns`, `SetMaxIdleConns`, `SetConnMaxLifetime` dựa trên giới hạn DB, số replica và tải thực tế; đo wait count/latency thay vì chọn con số tùy ý.\n\nDùng `BeginTx` với context, luôn đảm bảo commit hoặc rollback; pattern phổ biến là defer rollback và commit khi mọi bước thành công. Giữ transaction ngắn, tránh network call bên trong transaction, và xác định retry chỉ cho lỗi transient cùng thao tác an toàn để lặp. Tách transaction boundary theo invariant nghiệp vụ, không chỉ theo một HTTP handler dài.',
        en: '`sql.DB` is a concurrency-safe handle that manages a connection pool, not a single connection. Reuse one DB handle and configure `SetMaxOpenConns`, `SetMaxIdleConns`, and `SetConnMaxLifetime` based on database limits, replica count, and observed load; measure wait counts and latency rather than choosing arbitrary values.\n\nUse `BeginTx` with a context and ensure every path commits or rolls back; a common pattern defers rollback and commits only after all steps succeed. Keep transactions short, avoid network calls inside them, and retry only transient failures when the operation is safe to repeat. Set transaction boundaries around business invariants, not merely around a long HTTP handler.',
      },
    },
    {
      topic: { vi: 'Timeout, retry & idempotency', en: 'Timeouts, retries & idempotency' },
      q: {
        vi: 'Một service gọi dependency chậm nên kết hợp timeout, retry và idempotency thế nào để tránh khuếch đại sự cố?',
        en: 'How should a service combine timeouts, retries, and idempotency when a dependency is slow, without amplifying an outage?',
      },
      a: {
        vi: 'Đặt deadline tổng cho request và timeout riêng cho từng dependency sao cho còn thời gian xử lý/ghi response. Retry có giới hạn, exponential backoff kèm jitter, chỉ retry lỗi transient và tôn trọng deadline/cancellation. Retry vô hạn hoặc retry đồng loạt có thể làm dependency quá tải hơn.\n\nVới thao tác ghi, dùng idempotency key hoặc operation ID để request lặp không tạo side effect trùng; phía server lưu kết quả/trạng thái một cách nhất quán. Kết hợp circuit breaker hoặc load shedding khi phù hợp, giới hạn concurrency, và đưa timeout/retry metrics vào quan sát. Không retry lỗi validation hay mọi HTTP status một cách máy móc.',
        en: 'Set an overall request deadline and per-dependency timeouts that leave time to process and return a response. Retries should be bounded, use exponential backoff with jitter, target transient failures only, and respect deadlines and cancellation. Infinite or synchronized retries can overload an already struggling dependency.\n\nFor writes, use an idempotency key or operation ID so repeated requests do not create duplicate side effects; persist the result/state consistently on the server. Add a circuit breaker or load shedding where appropriate, bound concurrency, and expose timeout/retry metrics. Do not blindly retry validation failures or every HTTP status.',
      },
    },
    {
      topic: { vi: 'Bounded concurrency & backpressure', en: 'Bounded concurrency & backpressure' },
      q: {
        vi: 'Bạn thiết kế worker pool bằng Go thế nào để xử lý nhiều job nhưng vẫn giới hạn memory, goroutine và áp lực upstream?',
        en: 'How would you design a Go worker pool that handles many jobs while bounding memory, goroutines, and upstream pressure?',
      },
      a: {
        vi: 'Dùng queue có capacity hữu hạn và số worker giới hạn; khi queue đầy, phải có chính sách backpressure rõ ràng: block có deadline, reject, hoặc giảm tốc upstream. Tạo goroutine theo số worker thay vì một goroutine cho mỗi job nếu tải không được giới hạn.\n\nWorker cần nhận context, thoát khi cancellation/shutdown, và báo lỗi theo contract. Cần xác định semantics khi job đang chạy bị hủy, queue được drain hay bỏ, và cách retry/dead-letter. Đo queue depth, thời gian chờ, active workers và reject rate. Capacity là lựa chọn vận hành cần tính từ throughput, latency và bộ nhớ, không phải con số càng lớn càng tốt.',
        en: 'Use a bounded-capacity queue and a fixed number of workers. When the queue is full, define backpressure explicitly: block with a deadline, reject, or slow the upstream. Spawn goroutines according to the worker limit rather than creating one per job when input volume is unbounded.\n\nWorkers should accept a context, exit on cancellation/shutdown, and report errors through a clear contract. Define what happens to in-flight jobs on cancellation, whether queued jobs are drained or dropped, and how retries/dead letters work. Measure queue depth, wait time, active workers, and rejection rate. Capacity is an operational choice based on throughput, latency, and memory, not a number that should simply be maximized.',
      },
    },
  ],
};