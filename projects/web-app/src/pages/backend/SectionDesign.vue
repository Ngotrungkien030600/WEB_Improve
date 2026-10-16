<template>
  <div class="bs-section system-design">
    <div class="course-intro">
      <span class="course-kicker">BACKEND ENGINEERING · THỰC CHIẾN</span>
      <h3>System Design: thiết kế một hệ thống backend</h3>
      <p class="section-text">System Design là cách biến yêu cầu sản phẩm thành kiến trúc backend có thể chạy được: API, dữ liệu, luồng xử lý, cách mở rộng và cách hệ thống phản ứng khi có lỗi. Mục tiêu không phải vẽ thật nhiều service; mục tiêu là giải thích được lựa chọn và đánh đổi.</p>
      <div class="learning-outcomes">
        <span>Đọc yêu cầu và đặt câu hỏi đúng</span>
        <span>Vẽ request flow và data flow</span>
        <span>Chọn monolith hay microservices có lý do</span>
        <span>Phân tích lỗi, tải và trade-off</span>
      </div>
    </div>

    <h3>Khung trình bày một bài System Design</h3>
    <p class="section-text">Trong phỏng vấn hoặc lúc bắt đầu dự án, đi theo thứ tự này để không nhảy ngay vào chọn công nghệ:</p>
    <div class="design-steps">
      <article v-for="step in designSteps" :key="step.number" class="step-card">
        <span class="step-number">{{ step.number }}</span>
        <div><h4>{{ step.title }}</h4><p>{{ step.detail }}</p><small>{{ step.output }}</small></div>
      </article>
    </div>

    <h3>Case study: thiết kế luồng đặt hàng e-commerce</h3>
    <p class="section-text">Bài toán mẫu: khách xem giỏ hàng, đặt đơn, thanh toán qua cổng bên ngoài và nhận xác nhận. Nếu thanh toán timeout hoặc người dùng bấm nút hai lần, hệ thống vẫn phải tránh tạo giao dịch trùng và có thể khôi phục trạng thái.</p>

    <h4 class="subheading">1. Chốt phạm vi trước khi vẽ</h4>
    <div class="two-col">
      <div class="note-card"><strong>Functional requirements</strong><ul><li>Tạo đơn từ giỏ hàng và kiểm tra giá/tồn kho.</li><li>Thanh toán, xem trạng thái và hủy đơn theo điều kiện.</li><li>Gửi email/thông báo sau khi đơn được xác nhận.</li></ul></div>
      <div class="note-card"><strong>Non-functional requirements</strong><ul><li>Không tạo hai đơn hoặc thu tiền hai lần khi client retry.</li><li>Đơn hàng và thanh toán có trạng thái truy vết được.</li><li>Chấp nhận thông báo bất đồng bộ trễ vài giây.</li></ul></div>
    </div>

    <h4 class="subheading">2. Vẽ kiến trúc và lần theo request</h4>
    <div class="architecture" role="img" aria-label="Luồng đặt hàng qua API, order service, database, outbox, message broker và payment provider">
      <div class="arch-row"><span class="arch-node">Web / Mobile</span><b>→</b><span class="arch-node">API Gateway</span><b>→</b><span class="arch-node primary-node">Order API</span></div>
      <div class="arch-branches"><span>↓ transaction</span><span>↓ ghi event cùng transaction</span></div>
      <div class="arch-row"><span class="arch-node">Order DB</span><b>←</b><span class="arch-node">Outbox table</span><b>→</b><span class="arch-node">Outbox worker</span><b>→</b><span class="arch-node">Kafka / Queue</span></div>
      <div class="arch-row arch-secondary"><span class="arch-node">Payment worker → Payment Provider</span><span class="arch-node">Notification worker → Email</span></div>
    </div>
    <ol class="explain-list">
      <li>API xác thực người dùng, kiểm tra request và yêu cầu <code>Idempotency-Key</code>.</li>
      <li>Order service kiểm tra lại giá và tồn kho từ nguồn dữ liệu đáng tin cậy, rồi tạo đơn <code>PENDING_PAYMENT</code>.</li>
      <li>Cùng transaction, ghi event <code>OrderCreated</code> vào outbox. Worker phát event sang broker sau khi commit.</li>
      <li>Payment worker gọi payment provider với idempotency key riêng. Webhook cập nhật kết quả thanh toán.</li>
      <li>Khi thanh toán thành công, đơn chuyển sang <code>CONFIRMED</code>; notification worker gửi email độc lập.</li>
    </ol>

    <h4 class="subheading">3. API và dữ liệu cần nghĩ tới</h4>
    <CodeBlock :code="apiCode" language="http" />
    <CodeBlock :code="schemaCode" language="sql" />
    <div class="callout"><strong>Vì sao có outbox?</strong> Nếu ghi đơn vào database rồi publish event trực tiếp mà broker đang lỗi, đơn tồn tại nhưng event bị mất. Outbox ghi đơn và event trong cùng database transaction; worker phát event và retry sau. Consumer vẫn cần idempotent vì broker có thể giao lại message.</div>

    <h3>Monolith hay Microservices?</h3>
    <div class="two-col compare-grid">
      <div class="note-card"><h4>Modular monolith</h4><p>Một ứng dụng deploy, chia module rõ ràng: Order, Catalog, Inventory, Payment. Gọi nội bộ và dùng transaction DB dễ hơn. Phù hợp để bắt đầu khi team nhỏ, domain còn thay đổi.</p><p><strong>Rủi ro:</strong> module phụ thuộc lẫn nhau, deploy và scale toàn ứng dụng.</p></div>
      <div class="note-card"><h4>Microservices</h4><p>Tách service khi có ranh giới nghiệp vụ ổn định, nhu cầu scale/deploy độc lập hoặc team cần quyền sở hữu riêng. Mỗi service sở hữu dữ liệu của mình; giao tiếp qua API hoặc event.</p><p><strong>Chi phí:</strong> network failure, eventual consistency, tracing, versioning, vận hành và kiểm thử tích hợp.</p></div>
    </div>
    <p class="section-text">Một đường đi hợp lý cho bài toán này: bắt đầu bằng modular monolith với module và interface rõ; đo bottleneck và thay đổi tổ chức/team; chỉ tách Payment hoặc Notification khi có nhu cầu độc lập. Microservices không tự làm hệ thống nhanh hoặc dễ bảo trì hơn.</p>

    <h3>Payment là một distributed workflow, không phải một câu gọi API</h3>
    <div class="payment-flow"><span>Tạo Order: PENDING</span><b>→</b><span>Authorize / charge</span><b>→</b><span>Webhook xác nhận</span><b>→</b><span>CONFIRMED</span></div>
    <ul class="tips-list">
      <li><strong>Timeout không đồng nghĩa thất bại:</strong> provider có thể đã thu tiền nhưng response bị mất. Tra cứu giao dịch bằng provider reference trước khi thử lại.</li>
      <li><strong>Không giữ DB transaction khi gọi mạng:</strong> gọi provider bên ngoài có độ trễ và lỗi riêng; dùng trạng thái trung gian và xử lý kết quả bất đồng bộ.</li>
      <li><strong>Webhook phải xác thực và chống xử lý lặp:</strong> lưu event ID đã xử lý, kiểm tra chữ ký và cập nhật trạng thái theo transition hợp lệ.</li>
      <li><strong>Saga khi nhiều bước không thể chung transaction:</strong> định nghĩa action bù như release inventory hoặc refund; không giả định rollback distributed tự xảy ra.</li>
    </ul>

    <h3>Thiết kế cho lỗi và tăng tải</h3>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>Độ tin cậy</h4><p>Timeout có giới hạn, retry có exponential backoff và jitter, circuit breaker khi dependency hỏng, DLQ cho message lỗi kéo dài, và thao tác replay có kiểm soát.</p></div>
      <div class="info-card"><h4>Dữ liệu & nhất quán</h4><p>Giao dịch tiền cần trạng thái và audit rõ. Read model/cache có thể eventual consistent; ghi dữ liệu quan trọng vào nguồn sở hữu, tránh sửa chéo database giữa services.</p></div>
      <div class="info-card"><h4>Scale</h4><p>Ước lượng request/s và peak trước. Tối ưu query/index, phân trang, cache dữ liệu đọc phù hợp; thêm worker/consumer theo backlog trước khi nghĩ tới sharding.</p></div>
      <div class="info-card"><h4>Quan sát & bảo mật</h4><p>Correlation ID xuyên request và event; metrics latency/error/queue lag; log có cấu trúc, không log thẻ hoặc secret; phân quyền service và quản lý secret an toàn.</p></div>
    </div>

    <h3>Ước lượng tải: tính để biết câu hỏi cần hỏi</h3>
    <p class="section-text">Đây là ví dụ giả định để luyện phương pháp. Với 100 nghìn đơn/ngày, trung bình khoảng 1.2 đơn/giây; nếu giờ cao điểm gấp 10 lần thì khoảng 12 đơn/giây. Cần hỏi thêm tỷ lệ retry, số item mỗi đơn, traffic đọc/ghi, thời gian lưu và yêu cầu phục hồi trước khi chọn hạ tầng.</p>
    <CodeBlock :code="estimationCode" language="text" />

    <h3>Bài tập làm theo từng bước</h3>
    <div class="exercise-card">
      <strong>Hãy thiết kế backend đặt lịch khám</strong>
      <p>Bệnh nhân tìm bác sĩ và khung giờ, giữ chỗ trong 5 phút, thanh toán, sau đó nhận xác nhận. Nhiều người có thể chọn cùng một khung giờ.</p>
      <ol><li>Viết 5 câu hỏi làm rõ requirement và giả định tải.</li><li>Vẽ API, bảng dữ liệu và trạng thái appointment/payment.</li><li>Giải thích cách chống double booking và payment retry.</li><li>Nói rõ chọn modular monolith hay microservices ở phiên bản đầu và vì sao.</li><li>Mô tả điều gì xảy ra khi DB, queue hoặc payment provider bị lỗi.</li></ol>
      <p class="answer-frame"><strong>Khung trả lời phỏng vấn:</strong> “I’d first clarify… The core entities are… The request flow is… I’d choose … because… The main failure case is… I’d monitor…”</p>
    </div>

    <h3>CAP và bài toán thiết kế khác</h3>
    <p class="section-text">CAP chỉ nói về lựa chọn khi có network partition trong hệ thống phân tán: lúc đó không thể đồng thời đảm bảo mọi request đọc dữ liệu mới nhất và luôn trả lời thành công. Hãy nói rõ hành vi theo nghiệp vụ: số dư cần kiểm soát chặt; lượt xem hoặc feed có thể chấp nhận trễ ngắn.</p>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>URL Shortener</h4><p>Key generation, redirect, cache, collision và read-heavy traffic.</p></div>
      <div class="info-card"><h4>Rate Limiter</h4><p>Token bucket, atomic counter, giới hạn theo user/API key và multi-instance.</p></div>
      <div class="info-card"><h4>Chat</h4><p>WebSocket, lưu message, thứ tự trong conversation, offline delivery.</p></div>
      <div class="info-card"><h4>Notification</h4><p>Preference, template, retry, provider fallback và chống gửi lặp.</p></div>
    </div>
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const designSteps = [
  { number: '01', title: 'Làm rõ yêu cầu', detail: 'Ai dùng? Luồng chính và edge case nào thuộc phạm vi? Điều gì chưa cần làm?', output: 'Scope + giả định' },
  { number: '02', title: 'Chốt chất lượng cần đạt', detail: 'Consistency, latency, availability, security, audit và data retention quan trọng tới mức nào?', output: 'NFR + ưu tiên' },
  { number: '03', title: 'Ước lượng tải', detail: 'Số user/request, peak, read/write ratio, dữ liệu tăng mỗi ngày và thời gian lưu.', output: 'Con số gần đúng' },
  { number: '04', title: 'Thiết kế API & data', detail: 'Resource, trạng thái nghiệp vụ, schema, index, idempotency và transaction boundary.', output: 'Contract + data model' },
  { number: '05', title: 'Vẽ component & luồng', detail: 'Client, API, service, database, cache, queue và provider; lần theo một request cụ thể.', output: 'Architecture + sequence' },
  { number: '06', title: 'Tìm failure mode', detail: 'Timeout, retry, duplicate, partial failure, stale data, race condition và cách phục hồi.', output: 'Failure handling' },
  { number: '07', title: 'Nêu trade-off & tiến hóa', detail: 'Bắt đầu đơn giản thế nào? Dữ liệu nào chứng minh cần cache, partition hoặc tách service?', output: 'Lý do + next step' },
];

const apiCode = `POST /api/v1/orders
Authorization: Bearer <access-token>
Idempotency-Key: 8db5b4c2-...
Content-Type: application/json

{
  "items": [
    { "productId": "p-123", "quantity": 2 }
  ],
  "shippingAddressId": "addr-456"
}

HTTP/1.1 202 Accepted
{
  "orderId": "ord-789",
  "status": "PENDING_PAYMENT",
  "statusUrl": "/api/v1/orders/ord-789"
}`;

const schemaCode = `orders(id, customer_id, status, total_amount, version, created_at)
order_items(id, order_id, product_id, quantity, unit_price)
payments(id, order_id, provider_ref, status, amount, idempotency_key)
outbox_events(id, aggregate_id, event_type, payload, created_at, published_at)

-- Một key chỉ được tạo đơn một lần cho cùng một user
CREATE UNIQUE INDEX uq_order_idempotency
  ON orders(customer_id, idempotency_key);

-- Worker tìm event chưa phát; production nên claim theo batch/lock
SELECT id, event_type, payload
FROM outbox_events
WHERE published_at IS NULL
ORDER BY created_at
LIMIT 100;`;

const estimationCode = `100,000 orders/day ÷ 86,400 ≈ 1.2 orders/second average
Peak x10 ≈ 12 order requests/second

If each order has 3 items:
300,000 order_items/day

Estimate storage only after asking:
- average row + index size
- retention period
- replicas / backups
- audit and event payload growth`;

export default {
  name: 'BackendSectionDesign',
  components: { CodeBlock },
  data() {
    return { designSteps, apiCode, schemaCode, estimationCode };
  },
};
</script>

<style scoped>
.bs-section h3 { font-size: 1rem; font-weight: 700; margin: 1.7rem 0 .75rem; color: var(--forge-fire); }
.bs-section h3:first-child { margin-top: 0; }
.course-intro { margin: 0 0 1.5rem; padding: 1.25rem; border: 1px solid var(--forge-glass-border); border-radius: var(--radius-md); background: linear-gradient(135deg, rgba(245,158,11,.09), rgba(255,255,255,.02)); }
.course-intro h3 { margin: .5rem 0; color: var(--forge-text); font-size: 1.3rem; }
.course-kicker { color: var(--forge-fire); font-size: .68rem; font-weight: 850; letter-spacing: .12em; }
.section-text { color: var(--forge-text2); font-size: .9rem; line-height: 1.7; margin: .8rem 0; }
.learning-outcomes { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1rem; }
.learning-outcomes span { border: 1px solid var(--forge-glass-border); border-radius: 999px; padding: .4rem .65rem; color: var(--forge-text2); font-size: .72rem; }
.design-steps { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .65rem; margin: 1rem 0 1.5rem; }
.step-card { display: flex; gap: .75rem; padding: .85rem; border: 1px solid var(--forge-glass-border); border-radius: var(--radius-md); background: var(--forge-surface); }
.step-number { flex: 0 0 2rem; color: var(--forge-fire); font: 800 .78rem var(--font-mono); }
.step-card h4,.note-card h4 { margin: 0 0 .35rem; color: var(--forge-text); font-size: .84rem; }
.step-card p,.note-card p { margin: 0; color: var(--forge-text2); font-size: .78rem; line-height: 1.55; }
.step-card small { display: block; margin-top: .4rem; color: var(--forge-fire); font-size: .68rem; }
.subheading { margin: 1.25rem 0 .65rem; color: var(--forge-text); font-size: .9rem; }
.two-col { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: .8rem; margin: .8rem 0; }
.note-card { padding: 1rem; border: 1px solid var(--forge-glass-border); border-radius: var(--radius-md); background: var(--forge-surface); }
.note-card > strong { color: var(--forge-fire); font-size: .8rem; }
.note-card ul { display: grid; gap: .4rem; padding-left: 1.1rem; margin: .6rem 0 0; color: var(--forge-text2); font-size: .78rem; line-height: 1.55; }
.architecture { display: grid; gap: .6rem; padding: 1rem; margin: .85rem 0; overflow-x: auto; border: 1px solid var(--forge-glass-border); border-radius: var(--radius-md); background: var(--forge-surface); }
.arch-row { display: flex; align-items: center; justify-content: center; gap: .55rem; min-width: 650px; }
.arch-row b,.arch-branches { color: var(--forge-fire); }
.arch-node { padding: .55rem .7rem; border: 1px solid var(--forge-glass-border); border-radius: 9px; color: var(--forge-text); background: rgba(255,255,255,.035); font-size: .72rem; text-align: center; }
.primary-node { border-color: var(--forge-fire); color: var(--forge-fire); }
.arch-branches { display: flex; justify-content: space-around; min-width: 650px; font: .68rem var(--font-mono); }
.arch-secondary { justify-content: space-evenly; }
.explain-list,.tips-list { display: grid; gap: .55rem; padding-left: 1.25rem; color: var(--forge-text2); font-size: .82rem; line-height: 1.65; }
.explain-list li::marker { color: var(--forge-fire); font-weight: 800; }
.bs-section code { padding: .1rem .3rem; border-radius: 4px; background: var(--forge-surface); font: .9em var(--font-mono); }
.callout { margin: 1rem 0; padding: 1rem; border-left: 3px solid var(--forge-fire); border-radius: 0 10px 10px 0; color: var(--forge-text2); background: rgba(245,158,11,.08); font-size: .82rem; line-height: 1.65; }
.callout strong { color: var(--forge-text); }
.compare-grid .note-card { padding: 1rem; }
.compare-grid p + p { margin-top: .65rem; }
.cards-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: .8rem; margin: 1rem 0; }
.info-card { padding: 1rem; border: 1px solid var(--forge-glass-border); border-radius: var(--radius-md); background: var(--forge-surface); transition: border-color var(--transition-fast), transform var(--transition-fast); }
.info-card:hover { border-color: var(--forge-fire); transform: translateY(-2px); }
.info-card h4 { margin: 0 0 .45rem; color: var(--forge-text); font-size: .85rem; }
.info-card p { margin: 0; color: var(--forge-text2); font-size: .78rem; line-height: 1.55; }
.payment-flow { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: .55rem; padding: 1rem; border: 1px solid var(--forge-glass-border); border-radius: var(--radius-md); background: var(--forge-surface); }
.payment-flow span { padding: .55rem .7rem; border-radius: 8px; color: var(--forge-text); background: rgba(255,255,255,.045); font-size: .74rem; }
.payment-flow b { color: var(--forge-fire); }
.exercise-card { padding: 1rem; border: 1px solid rgba(245,158,11,.28); border-radius: var(--radius-md); background: rgba(245,158,11,.055); color: var(--forge-text2); font-size: .82rem; line-height: 1.65; }
.exercise-card > strong { color: var(--forge-text); }
.exercise-card ol { display: grid; gap: .35rem; padding-left: 1.2rem; }
.answer-frame { padding: .75rem; border-radius: 8px; background: var(--forge-surface); }
.answer-frame strong { color: var(--forge-fire); }
@media (max-width: 700px) { .design-steps,.two-col,.cards-grid { grid-template-columns: 1fr; }.arch-row { justify-content: flex-start; }.payment-flow { justify-content: flex-start; } }
</style>
