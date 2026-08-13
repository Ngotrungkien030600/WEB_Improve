<template>
  <div class="ss-section">
    <h3>Luồng xử lý request</h3>
    <div class="diagram">
      Request → DispatcherServlet → HandlerMapping → Controller → Service → Repository → DB<br>
      → ResponseEntity ← JSON ←
    </div>

    <h3>REST Controller là gì?</h3>
    <p class="section-text"><code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code> — mỗi method ánh xạ một HTTP request (GET/POST/PUT/DELETE) và trả về dữ liệu dạng <strong>JSON</strong> (không phải view HTML). Đây là nơi tiếp nhận request, gọi xuống Service, rồi trả response cho client.</p>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>@GetMapping / @PostMapping / @PutMapping / @DeleteMapping</h4><p>Ánh xạ method tới HTTP verb + URL. CRUD chuẩn: GET đọc, POST tạo, PUT sửa, DELETE xóa.</p></div>
      <div class="info-card"><h4>@PathVariable vs @RequestParam</h4><p><code>@PathVariable</code> lấy giá trị trong URL (<code>/users/123</code>). <code>@RequestParam</code> lấy từ query string (<code>?page=0</code>).</p></div>
      <div class="info-card"><h4>@RequestBody</h4><p>Đọc JSON từ body request, tự deserialize thành object Java — kèm <code>@Valid</code> để validate trước khi vào business logic.</p></div>
      <div class="info-card"><h4>ResponseEntity</h4><p>Trả về response kèm HTTP status code chuẩn: <code>200 OK</code>, <code>201 Created</code>, <code>204 No Content</code>, <code>404</code>... — giúp client hiểu kết quả mà không cần đoán.</p></div>
    </div>
    <p class="section-text"><strong>Thực tế áp dụng:</strong> Đây là chuẩn giao tiếp giữa frontend (SPA/React/Vue) hoặc mobile app với backend. Trả về <code>201 Created</code> kèm URI của resource mới (thay vì 200) giúp client có thể GET lại resource đó — đúng nguyên tắc RESTful và dễ maintain khi API lớn.</p>
    <CodeBlock :code="restControllerCode" language="java" />

    <h3>Exception Handling — tại sao cần?</h3>
    <p class="section-text">Nếu không xử lý tập trung, mỗi lỗi sẽ trả về <strong>stacktrace hoặc lỗi 500 mặc định</strong> — khó hiểu với client và lộ chi tiết nội bộ. <code>@RestControllerAdvice</code> gom toàn bộ xử lý lỗi vào <strong>một nơi duy nhất</strong>: bắt exception, chuyển thành <code>ErrorResponse</code> JSON với mã lỗi + message rõ ràng.</p>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>@ExceptionHandler(ResourceNotFoundException.class)</h4><p>Bắt lỗi "không tìm thấy" → trả <code>404 NOT_FOUND</code>. Client biết resource không tồn tại.</p></div>
      <div class="info-card"><h4>@ExceptionHandler(MethodArgumentNotValidException.class)</h4><p>Bắt lỗi validate từ <code>@Valid</code> → trả <code>400</code> kèm <strong>danh sách field lỗi cụ thể</strong> (field nào, message gì) — UI hiển thị ngay dưới từng ô input.</p></div>
      <div class="info-card"><h4>@ExceptionHandler(Exception.class)</h4><p>Handler cuối cùng bắt mọi lỗi còn lại → <code>500</code> với message chung chung, <strong>không lộ chi tiết nội bộ</strong>. Chi tiết thật đi vào log server.</p></div>
      <div class="info-card"><h4>Lợi ích thực tế</h4><p>API contract ổn định (client luôn nhận <code>{ code, message }</code>), log tập trung, dễ thêm monitoring/alerting khi lỗi xảy ra.</p></div>
    </div>
    <CodeBlock :code="exceptionCode" language="java" />

    <h3>DTO & Validation — vì sao không trả thẳng Entity?</h3>
    <p class="section-text"><strong>DTO (Data Transfer Object)</strong> là object trung gian chuyên chở dữ liệu vào/ra API. Trả thẳng Entity ra ngoài rất rủi ro: lộ các field nhạy cảm (password, token), và khi Entity thay đổi thì API contract cũng vỡ theo.</p>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>An toàn</h4><p>Chỉ expose đúng field cần thiết cho client — không lộ password, internal fields. Tách request DTO (đầu vào) và response DTO (đầu ra) khi cần.</p></div>
      <div class="info-card"><h4>Validate tại biên giới</h4><p>Dữ liệu sai bị chặn ngay khi vào hệ thống bằng <code>@NotBlank</code>, <code>@Email</code>, <code>@Size</code>, <code>@Pattern</code> — không để dữ liệu rác lọt xuống DB.</p></div>
      <div class="info-card"><h4>API contract ổn định</h4><p>Entity đổi (thêm cột) không làm hỏng API. DTO dùng <code>record</code> (Java 16+) — gọn, immutable, tự sinh getter/constructor.</p></div>
      <div class="info-card"><h4>Thực tế áp dụng</h4><p>Số điện thoại Việt Nam validate bằng regex <code>^(0|\+84)[3-9][0-9]{8}$</code> — chặn format sai ngay từ đầu thay vì phải sửa dữ liệu sau này.</p></div>
    </div>
    <CodeBlock :code="dtoCode" language="java" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const restControllerCode = `@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> getAll(@RequestParam(defaultValue = "0") int page) {
        return userService.findAll(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<User> create(@Valid @RequestBody UserCreateRequest req) {
        User created = userService.create(req);
        return ResponseEntity.created(URI.create("/api/users/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest req) {
        return userService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}`;

const exceptionCode = `@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
            .stream().map(e -> e.getField() + ": " + e.getDefaultMessage()).collect(Collectors.toList());
        return ResponseEntity.badRequest().body(new ErrorResponse("VALIDATION_FAILED", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        return ResponseEntity.status(500).body(new ErrorResponse("INTERNAL_ERROR", "Có lỗi xảy ra"));
    }
}`;

const dtoCode = `public record UserCreateRequest(
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 100)
    String name,

    @NotBlank @Email
    String email,

    @Pattern(regexp = "^(0|\\+84)[3-9][0-9]{8}$", message = "SĐT không hợp lệ")
    String phone
) {}`;

export default {
  name: 'SpringSectionWeb',
  components: { CodeBlock },
  data() {
    return { restControllerCode, exceptionCode, dtoCode };
  },
};
</script>

<style scoped>
.ss-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--forge-fire);
}

.ss-section h3:first-child {
  margin-top: 0;
}

.section-text {
  color: var(--forge-text2);
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 1rem 0;
}

.section-text code {
  background: var(--forge-surface);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.85em;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.cards-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.info-card {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  transition: all var(--transition-fast);
}

.info-card:hover {
  border-color: var(--forge-fire);
  transform: translateY(-2px);
}

.info-card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--forge-text);
}

.info-card p {
  font-size: 0.8rem;
  color: var(--forge-text3);
  margin: 0;
  line-height: 1.5;
}

.diagram {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  margin: 1rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: var(--forge-fire);
  font-weight: 600;
  line-height: 2;
  font-family: var(--font-mono);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.tips-list li {
  padding: 0.5rem 0.75rem;
  background: var(--forge-surface);
  border-radius: var(--radius-sm);
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--forge-text2);
}

.tips-list strong {
  color: var(--forge-fire);
}

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
