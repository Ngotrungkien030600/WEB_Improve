<template>
  <main class="advanced-core">
    <div class="course-wrap">
      <CTopbar title="☕ Java Core nâng cao" back-label="Java" @go-home="handleBack" />
      <header class="course-hero">
        <p class="eyebrow">JAVA BACKEND · SAU NỀN TẢNG OOP</p>
        <h1>Hiểu Java khi code chạy thật</h1>
        <p>Học các khái niệm Java Core qua tình huống trong backend: collection bị sai key, thread đua nhau cập nhật dữ liệu, async task thất bại và JVM thiếu bộ nhớ.</p>
      </header>

      <section class="lesson-grid">
        <article class="lesson-card">
          <span class="lesson-number">01</span><h2>equals, hashCode & HashMap</h2>
          <p>HashMap chọn bucket bằng <code>hashCode()</code>, sau đó dùng <code>equals()</code> để tìm đúng key. Hai object được coi bằng nhau phải có hash code bằng nhau. Nếu object mutable bị dùng làm key rồi field tham gia hash thay đổi, lookup có thể không tìm ra entry.</p>
          <CodeBlock :code="hashMapCode" language="java" />
          <p class="takeaway"><strong>Trong dự án:</strong> dùng key bất biến như UUID/record; viết contract tests cho custom key.</p>
        </article>

        <article class="lesson-card">
          <span class="lesson-number">02</span><h2>Collections và chọn cấu trúc đúng</h2>
          <p><code>ArrayList</code> hợp đọc theo index và append; <code>HashSet</code> hợp kiểm tra membership; <code>HashMap</code> tra cứu theo key; <code>TreeMap</code> giữ thứ tự. Đừng chọn cấu trúc chỉ vì Big-O: cần xem dữ liệu có thứ tự, duplicate và concurrency không.</p>
          <div class="mini-table"><span>List</span><span>thứ tự, có thể trùng</span><span>Set</span><span>không trùng</span><span>Map</span><span>key → value</span></div>
          <p class="takeaway"><strong>Trong API:</strong> dùng Set cho permission không trùng; Map cho lookup theo ID; trả List có sort/page rõ ràng.</p>
        </article>

        <article class="lesson-card">
          <span class="lesson-number">03</span><h2>Stream, Optional và side effects</h2>
          <p>Stream mô tả pipeline biến đổi dữ liệu; intermediate operations chạy lazy, terminal operation mới kích hoạt. Dùng stream cho transform/filter dễ đọc; tránh sửa state bên ngoài trong <code>map</code>/<code>forEach</code>. Optional hữu ích cho kết quả có thể thiếu, không nên dùng làm field/entity hoặc tham số mọi nơi.</p>
          <CodeBlock :code="streamCode" language="java" />
          <p class="takeaway"><strong>Trong service:</strong> phân biệt “không có dữ liệu” với lỗi hệ thống; không gọi <code>get()</code> mù quáng trên Optional.</p>
        </article>

        <article class="lesson-card">
          <span class="lesson-number">04</span><h2>Exception và ranh giới xử lý lỗi</h2>
          <p>Exception nên mang ý nghĩa nghiệp vụ hoặc lỗi kỹ thuật có thể xử lý. Đừng nuốt exception hoặc trả <code>null</code> khi lỗi. Ở API, map lỗi nghiệp vụ thành status/message ổn định; log stack trace ở server nhưng không lộ nội bộ cho client.</p>
          <CodeBlock :code="exceptionCode" language="java" />
          <p class="takeaway"><strong>Quy tắc:</strong> catch ở nơi có hành động phục hồi hoặc chuyển đổi; nếu không, để lỗi đi tới handler phù hợp.</p>
        </article>

        <article class="lesson-card">
          <span class="lesson-number">05</span><h2>Concurrency: race condition và visibility</h2>
          <p>Thread-safe không có nghĩa là method riêng lẻ không lỗi; cả chuỗi đọc → kiểm tra → ghi có thể bị xen kẽ. <code>volatile</code> đảm bảo visibility nhưng không biến phép cộng thành atomic. Dùng atomic type, lock hoặc database constraint/version tùy phạm vi đồng bộ.</p>
          <CodeBlock :code="concurrencyCode" language="java" />
          <p class="takeaway"><strong>Trong backend nhiều instance:</strong> <code>synchronized</code> chỉ khóa trong một JVM; dùng unique constraint/optimistic lock/distributed coordination khi cần bảo vệ dữ liệu chung.</p>
        </article>

        <article class="lesson-card">
          <span class="lesson-number">06</span><h2>Executor, CompletableFuture và lỗi async</h2>
          <p>Không tạo thread tùy tiện cho mỗi request. Thread pool giới hạn tài nguyên; cần timeout, queue limit và xử lý exception. Async chỉ giúp request không chờ tác vụ không quan trọng; nó không làm dependency chậm biến mất.</p>
          <CodeBlock :code="asyncCode" language="java" />
          <p class="takeaway"><strong>Trong Spring:</strong> cấu hình executor riêng cho workload, metric queue/rejection, truyền trace context và quyết định retry rõ ràng.</p>
        </article>

        <article class="lesson-card">
          <span class="lesson-number">07</span><h2>JVM memory, GC và điều tra OOM</h2>
          <p>Object thường được cấp phát trên heap; thread có stack riêng. Garbage Collector thu hồi object không còn reachable, không phải object “không dùng theo nghiệp vụ”. Memory leak vẫn xảy ra nếu collection/static cache giữ reference mãi.</p>
          <div class="mini-table"><span>Heap</span><span>object và dữ liệu dùng chung</span><span>Stack</span><span>call frame, biến cục bộ theo thread</span><span>Metaspace</span><span>metadata class</span></div>
          <p class="takeaway"><strong>Khi OOM:</strong> phân biệt heap/direct memory/thread exhaustion; lấy heap dump/metrics, tìm dominator và nguyên nhân giữ reference trước khi chỉ tăng RAM.</p>
        </article>

        <article class="lesson-card">
          <span class="lesson-number">08</span><h2>Immutability và thiết kế object an toàn</h2>
          <p>Object bất biến không đổi sau khi tạo: dễ chia sẻ giữa thread, dễ cache và ít trạng thái ẩn. Dùng <code>final</code>, constructor validation, không trả collection mutable trực tiếp; dùng record cho DTO giá trị khi phù hợp.</p>
          <CodeBlock :code="immutableCode" language="java" />
          <p class="takeaway"><strong>Trong domain:</strong> dùng BigDecimal cho tiền, kiểm soát scale/rounding, và không dùng double cho phép tính tiền tệ.</p>
        </article>
      </section>

      <section class="interview-box">
        <h2>Cách trả lời khi phỏng vấn</h2>
        <p>Đừng chỉ định nghĩa keyword. Nói theo 4 nhịp: <strong>khái niệm → vấn đề nó giải quyết → bẫy/thất bại có thể gặp → cách bạn áp dụng trong project</strong>.</p>
        <p class="sample-answer">Ví dụ: “HashMap dùng hashCode để chọn bucket rồi equals để xác định key. Vì vậy hai object bằng nhau phải cùng hash code. Nếu key mutable và field tham gia hash thay đổi sau khi put, mình có thể không lấy lại được value. Trong code thực tế mình ưu tiên key bất biến và kiểm tra equals/hashCode cùng nhau.”</p>
      </section>
    </div>
  </main>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import CodeBlock from '../components/CodeBlock.vue';
import { navigate } from '../utils/navigate.js';

const hashMapCode = `record UserKey(String tenantId, String email) {}

Map<UserKey, Long> users = new HashMap<>();
users.put(new UserKey("acme", "dev@example.com"), 42L);

// Record tự sinh equals() và hashCode() theo component.
Long userId = users.get(new UserKey("acme", "dev@example.com"));`;

const streamCode = `List<String> activeEmails = users.stream()
    .filter(User::isActive)
    .map(User::getEmail)
    .filter(Objects::nonNull)
    .toList();

Optional<User> user = repository.findByEmail(email);
UserResponse response = user
    .map(mapper::toResponse)
    .orElseThrow(() -> new UserNotFoundException(email));`;

const exceptionCode = `public UserResponse getUser(long id) {
    User user = repository.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
    return mapper.toResponse(user);
}

// @RestControllerAdvice map UserNotFoundException → 404
// Không trả stack trace hoặc SQL detail cho client.`;

const concurrencyCode = `// Sai: read-modify-write không atomic
if (inventory.get() > 0) {
    inventory.set(inventory.get() - 1);
}

// Atomic cho counter trong một JVM
AtomicInteger requests = new AtomicInteger();
int current = requests.incrementAndGet();

// Tồn kho dùng chung giữa nhiều app instance:
// UPDATE products SET stock = stock - 1
// WHERE id = ? AND stock > 0; kiểm tra số row được update.`;

const asyncCode = `CompletableFuture<Inventory> inventory =
    CompletableFuture.supplyAsync(
        () -> inventoryClient.get(productId), inventoryExecutor);

return inventory.orTimeout(800, TimeUnit.MILLISECONDS)
    .thenApply(mapper::toAvailability)
    .exceptionally(ex -> Availability.unknown());`;

const immutableCode = `public record Money(BigDecimal amount, Currency currency) {
    public Money {
        Objects.requireNonNull(amount);
        Objects.requireNonNull(currency);
        if (amount.scale() > currency.getDefaultFractionDigits()) {
            throw new IllegalArgumentException("Too many decimal places");
        }
    }
}`;

export default {
  name: 'JavaAdvancedCorePage',
  components: { CTopbar, CodeBlock },
  methods: {
    handleBack() {
      navigate('/java/hub');
    },
  },
};
</script>

<style scoped>
.advanced-core { min-height: 100vh; padding: 2rem 1.25rem 4rem; color: var(--forge-text); background: var(--forge-bg); }
.course-wrap { max-width: 1120px; margin: 0 auto; }
.course-hero { margin: 1.5rem 0; padding: 1.6rem; border: 1px solid var(--forge-glass-border); border-radius: 20px; background: linear-gradient(130deg, rgba(245,158,11,.14), rgba(124,92,252,.08)); }
.eyebrow { color: #fbbf24; font-size: .7rem; font-weight: 800; letter-spacing: .14em; }
.course-hero h1 { margin: .4rem 0; font-size: clamp(1.8rem,4vw,2.6rem); }
.course-hero p:last-child,.lesson-card p,.interview-box p { color: var(--forge-text2); font-size: .9rem; line-height: 1.7; }
.lesson-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 1rem; }
.lesson-card { position: relative; padding: 1.2rem; border: 1px solid var(--forge-glass-border); border-radius: 16px; background: var(--forge-surface); }
.lesson-number { display: inline-block; margin-bottom: .4rem; color: #fbbf24; font: 800 .72rem var(--font-mono); }
.lesson-card h2,.interview-box h2 { margin: 0; font-size: 1.08rem; }
.lesson-card code { color: #c4b5fd; }
.takeaway { padding: .75rem; border-left: 3px solid #fbbf24; border-radius: 0 8px 8px 0; background: rgba(245,158,11,.07); }
.mini-table { display: grid; grid-template-columns: minmax(80px,.55fr) 1.5fr; gap: .35rem .8rem; padding: .8rem; border-radius: 10px; background: rgba(255,255,255,.035); font-size: .8rem; }
.mini-table span:nth-child(odd) { color: #fbbf24; font-weight: 750; }
.interview-box { margin-top: 1rem; padding: 1.3rem; border: 1px solid rgba(124,92,252,.35); border-radius: 16px; background: rgba(124,92,252,.08); }
.sample-answer { padding: .85rem; border-radius: 10px; background: rgba(0,0,0,.16); }
@media(max-width:740px) { .lesson-grid { grid-template-columns: 1fr; }.advanced-core { padding: 1rem .8rem 3rem; } }
</style>
