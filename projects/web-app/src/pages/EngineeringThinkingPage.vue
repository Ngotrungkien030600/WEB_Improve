<template>
  <div class="thinking-page">
    <div class="page-shell">
      <CTopbar title="🧠 Tư duy kỹ sư qua bài toán thật" back-label="Trang chủ" @go-home="goHome" />

      <header class="hero">
        <p class="eyebrow">HỌC KHÁI NIỆM TRONG NGỮ CẢNH</p>
        <h1>Đừng học công nghệ rời rạc.<br />Hãy lần theo một vấn đề đến khi giải quyết được.</h1>
        <p>Chọn tình huống, hiểu vấn đề trước, rồi xem từng khái niệm làm nhiệm vụ gì, vì sao cần nó, áp dụng ra sao và phải kiểm chứng kết quả thế nào.</p>
        <div class="hero-flow"><span>Vấn đề</span><b>→</b><span>Khái niệm</span><b>→</b><span>Triển khai</span><b>→</b><span>Đo kết quả</span></div>
      </header>

      <section class="case-picker" aria-label="Chọn tình huống thực tế">
        <button v-for="item in cases" :key="item.id" type="button" :class="{ active: item.id === currentCaseId }" @click="currentCaseId = item.id">
          <span>{{ item.icon }}</span><strong>{{ item.title }}</strong><small>{{ item.goal }}</small>
        </button>
      </section>

      <main v-if="currentCase" class="case-content">
        <section class="scenario panel">
          <div class="scenario-heading"><div><p class="eyebrow">TÌNH HUỐNG</p><h2>{{ currentCase.title }}</h2></div><div class="progress-chip">{{ completedSteps }}/{{ currentCase.steps.length }} bước đã học</div></div>
          <p>{{ currentCase.scenario }}</p>
          <div class="scenario-result"><strong>Đích cần đạt</strong><span>{{ currentCase.outcome }}</span></div>
        </section>

        <section class="steps" aria-label="Các bước giải quyết">
          <article v-for="(step, index) in currentCase.steps" :key="step.id" class="step panel" :class="{ complete: isDone(step.id) }">
            <div class="step-top">
              <span class="step-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="step-title"><p class="eyebrow">{{ step.kind }}</p><h3>{{ step.title }}</h3></div>
              <button class="step-check" type="button" :aria-pressed="isDone(step.id)" @click="toggleStep(step.id)">{{ isDone(step.id) ? '✓ Đã hiểu' : 'Đánh dấu đã hiểu' }}</button>
            </div>

            <div class="concept-grid">
              <section><h4>Khái niệm là gì?</h4><p>{{ step.what }}</p></section>
              <section><h4>Nó làm gì trong bài này?</h4><p>{{ step.role }}</p></section>
              <section><h4>Vì sao dùng?</h4><p>{{ step.why }}</p></section>
              <section><h4>Áp dụng và kiểm tra thế nào?</h4><p>{{ step.how }}</p></section>
            </div>

            <div class="tradeoff"><strong>Điều cần để ý</strong><span>{{ step.tradeoff }}</span></div>
            <div class="step-footer">
              <a v-if="step.path" class="deep-link" @click="navigate(step.path)">Học sâu phần này <span>→</span></a>
              <div class="say-it"><strong>Nói lại bằng tiếng Anh</strong><p>{{ step.english }}</p></div>
            </div>
          </article>
        </section>

        <section class="deliverable panel">
          <p class="eyebrow">SẢN PHẨM CUỐI BÀI</p>
          <h2>{{ currentCase.deliverable.title }}</h2>
          <ol><li v-for="task in currentCase.deliverable.tasks" :key="task">{{ task }}</li></ol>
          <p class="success-criteria"><strong>Tự kiểm tra:</strong> {{ currentCase.deliverable.check }}</p>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import { navigate } from '../utils/navigate.js';

const PROGRESS_KEY = 'sf_engineering_thinking_progress';

const cases = [
  {
    id: 'order', icon: '🛒', title: 'Đặt hàng không bán vượt tồn kho', goal: 'API · transaction · concurrency · message queue',
    scenario: 'Khách bấm Đặt hàng hai lần hoặc mạng timeout rồi gửi lại. Hai khách cuối cùng có thể cùng mua sản phẩm chỉ còn một chiếc. Sau khi tạo đơn, hệ thống còn phải gọi cổng thanh toán và gửi xác nhận.',
    outcome: 'Tạo đúng một đơn cho một lần mua, không bán âm tồn kho, và có thể phục hồi khi dịch vụ thanh toán hoặc queue tạm lỗi.',
    steps: [
      { id: 'api', kind: 'BACKEND · BƯỚC 1', title: 'REST API và DTO — nhận yêu cầu an toàn', what: 'API là hợp đồng để client gửi yêu cầu và nhận kết quả. DTO là cấu trúc dữ liệu dành riêng cho request/response, tách khỏi Entity trong database.', role: 'POST /api/orders nhận productId, quantity và địa chỉ; DTO kiểm tra dữ liệu trước khi business logic chạy.', why: 'Client có thể gửi thiếu field, quantity âm hoặc field không được phép sửa. Entity thường chứa field nội bộ như trạng thái thanh toán, nên trả thẳng Entity sẽ lộ dữ liệu và ghép chặt API với schema.', how: 'Tạo CreateOrderRequest có validation; Controller nhận DTO, gọi Service; Service xác minh giá và quyền sở hữu; trả OrderResponse với status 202 và orderId.', tradeoff: 'Validation ở API giúp trả lỗi sớm, nhưng quy tắc nghiệp vụ như tồn kho vẫn phải kiểm tra trong Service và database vì trạng thái có thể đổi đồng thời.', english: 'The API validates the request, while the service checks business rules such as price and stock.', path: '/java/spring-boot' },
      { id: 'transaction', kind: 'DATABASE · BƯỚC 2', title: 'Transaction và concurrency — giữ tồn kho đúng', what: 'Transaction gom nhiều thay đổi database thành một đơn vị commit/rollback. Concurrency control bảo vệ dữ liệu khi nhiều request cùng sửa một mặt hàng.', role: 'Tạo order item và giảm inventory phải thành công cùng nhau; hai request không được cùng đọc số lượng 1 rồi đều bán thành công.', why: 'Nếu chỉ đọc tồn kho rồi mới cập nhật, có race condition giữa hai bước. Dữ liệu tiền và inventory cần invariant được database bảo vệ.', how: 'Dùng transaction cùng conditional update: UPDATE inventory SET available = available - 1 WHERE product_id = ? AND available >= 1. Chỉ tạo đơn khi đúng một row được cập nhật; hoặc dùng optimistic locking với version và xử lý conflict.', tradeoff: 'Pessimistic lock giảm xung đột nhưng giữ khóa lâu có thể giảm throughput; optimistic lock hiệu quả khi xung đột ít nhưng cần retry có giới hạn.', english: 'I use a database transaction to keep the order and inventory changes consistent.', path: '/java/backend/sql' },
      { id: 'idempotency', kind: 'RELIABILITY · BƯỚC 3', title: 'Idempotency — retry không tạo đơn trùng', what: 'Một thao tác idempotent có thể được gửi lặp lại mà kết quả nghiệp vụ vẫn chỉ được áp dụng một lần.', role: 'Client gửi Idempotency-Key; backend lưu key cùng order/result. Request lặp lại nhận lại kết quả cũ thay vì tạo order mới.', why: 'Timeout không cho client biết server đã xử lý hay chưa. Retry là cần thiết cho độ tin cậy, nên server phải nhận diện lần gửi trùng.', how: 'Tạo unique constraint theo customer_id + idempotency_key; xử lý xung đột bằng cách đọc và trả order đã tạo cho key đó.', tradeoff: 'Key cần scope, thời hạn lưu và gắn với nội dung request; không dùng chung một key cho hai ý định mua hàng khác nhau.', english: 'The idempotency key lets the client retry safely without creating a duplicate order.', path: '/java/backend/design' },
      { id: 'outbox', kind: 'DISTRIBUTED SYSTEMS · BƯỚC 4', title: 'Outbox và queue — chuyển việc sang xử lý nền', what: 'Message queue lưu công việc để producer và consumer xử lý độc lập. Outbox ghi event vào cùng transaction với dữ liệu nghiệp vụ rồi worker mới publish.', role: 'Order API tạo order và OrderCreated trong một transaction. Worker phát event; payment và notification consumer xử lý riêng.', why: 'Ghi DB rồi publish Kafka trực tiếp tạo khoảng hở: DB commit xong nhưng broker lỗi thì mất event. Outbox giúp event không rời khỏi transaction của order.', how: 'Worker đọc outbox theo batch, publish rồi đánh dấu; consumer lưu event ID đã xử lý để chống giao lặp. Theo dõi retry, backlog và DLQ.', tradeoff: 'Queue làm trạng thái cuối cùng đến trễ và tăng chi phí vận hành. Chỉ tách xử lý nền khi chấp nhận được eventual consistency.', english: 'The outbox pattern prevents us from losing an event after the order transaction commits.', path: '/java/backend/mq' },
      { id: 'observe', kind: 'VẬN HÀNH · BƯỚC 5', title: 'Logs, metrics và tracing — biết request đang mắc ở đâu', what: 'Logs ghi sự kiện, metrics đo xu hướng theo thời gian, traces cho thấy một request đi qua những service nào.', role: 'Gắn correlation ID từ API tới worker và provider; đo latency, error rate, duplicate key và queue lag.', why: 'Khi khách báo đã bị trừ tiền nhưng chưa có order, chỉ nhìn một log hoặc một service sẽ không đủ để dựng lại luồng.', how: 'Tìm theo orderId/correlationId, so sánh timestamp ở API, worker và provider; dùng dashboard/alert theo tỷ lệ lỗi và p95 latency.', tradeoff: 'Log quá nhiều vừa tốn chi phí vừa có nguy cơ lộ dữ liệu; không ghi access token, thông tin thẻ hoặc secret.', english: 'I would trace the request ID across services and compare the payment and order events.', path: '/devops/monitoring' },
    ],
    deliverable: { title: 'Vẽ và giải thích luồng đặt hàng', tasks: ['Vẽ Client → API → Order Service → DB/Outbox → Queue → Payment Worker.', 'Ghi rõ transaction boundary và trạng thái order/payment.', 'Nêu điều xảy ra khi client retry, DB lỗi hoặc payment timeout.', 'Tạo một test hai request tranh mua chiếc hàng cuối cùng.'], check: 'Bạn giải thích được từng thành phần giải quyết vấn đề nào và chỉ ra được cách quan sát kết quả trong log/metrics.' },
  },
  {
    id: 'search', icon: '🔎', title: 'Tìm sản phẩm nhanh khi dữ liệu lớn', goal: 'Thuật toán · SQL index · pagination · cache',
    scenario: 'Trang catalog có hàng triệu sản phẩm. Người dùng lọc theo category, giá, trạng thái còn hàng và sắp xếp mới nhất. Endpoint đang chậm khi dữ liệu tăng.',
    outcome: 'Trả đúng trang kết quả với latency ổn định, biết chứng minh nút thắt nằm ở truy vấn hay ứng dụng trước khi tối ưu.',
    steps: [
      { id: 'filter', kind: 'ALGORITHM · BƯỚC 1', title: 'Chọn nơi lọc dữ liệu — đừng quét lặp vô ích', what: 'Thuật toán là cách biến input thành output; cấu trúc dữ liệu quyết định chi phí tìm, thêm và xóa phần tử.', role: 'Nếu dữ liệu đã ở trong ứng dụng, HashMap có thể tra cứu theo key gần O(1); nếu dữ liệu nằm trong DB thì lọc gần nguồn thay vì tải cả bảng về.', why: 'Tải toàn bộ sản phẩm rồi lọc trong Java làm tăng network, memory và thời gian xử lý khi dữ liệu lớn.', how: 'Đưa điều kiện category, price, availability vào SQL WHERE; dùng Map cho lookup lặp trong một batch đã tải. So sánh số record đọc với số record trả về.', tradeoff: 'HashMap không thay thế database index: nó chỉ giúp dữ liệu đang có trong memory và cần thêm RAM để giữ cấu trúc.', english: 'I filter the data in the database to avoid loading the entire catalog into application memory.', path: '/code-lab' },
      { id: 'index', kind: 'DATABASE · BƯỚC 2', title: 'Index — đổi chi phí ghi lấy tốc độ đọc', what: 'Index là cấu trúc phụ giúp database tìm row theo cột mà không phải quét toàn bộ bảng.', role: 'Index phù hợp có thể phục vụ điều kiện lọc và thứ tự sort của endpoint catalog.', why: 'Khi bảng lớn và query chọn ra một phần nhỏ dữ liệu, full scan đọc quá nhiều row không cần thiết.', how: 'Xem query thật và EXPLAIN ANALYZE; thử index theo điều kiện phổ biến, ví dụ (category_id, status, created_at). So sánh actual rows, buffers và latency trước/sau.', tradeoff: 'Index chiếm disk và làm INSERT/UPDATE/DELETE tốn thêm công. Thứ tự cột composite index phải khớp cách lọc/sort thường dùng.', english: 'I check the query plan before adding an index, then compare the latency and rows scanned.', path: '/java/backend/sql' },
      { id: 'pagination', kind: 'API · BƯỚC 3', title: 'Pagination — giới hạn công việc mỗi request', what: 'Pagination chia danh sách thành các phần nhỏ thay vì trả mọi kết quả một lượt.', role: 'API trả page/size hoặc cursor để UI tải dần; database chỉ cần tìm và trả một lượng có giới hạn.', why: 'Response quá lớn tăng memory, network time và có thể làm API/DB quá tải.', how: 'Bắt đầu với page/size có maximum; khi offset lớn gây chậm, cân nhắc keyset pagination theo created_at + id và giữ thứ tự ổn định.', tradeoff: 'Offset dễ nhảy trang nhưng trang sâu thường tốn hơn; cursor hiệu quả hơn nhưng khó nhảy tùy ý tới trang bất kỳ.', english: 'Pagination limits the amount of data returned by each request.', path: '/java/backend' },
      { id: 'cache', kind: 'PERFORMANCE · BƯỚC 4', title: 'Cache — chỉ thêm khi đã xác nhận đọc lặp là nút thắt', what: 'Cache giữ tạm kết quả có thể tính lại để các lần đọc sau không phải làm lại toàn bộ công việc.', role: 'Có thể cache danh mục hoặc filter phổ biến trong Redis sau khi đã đo query và biết dữ liệu ít đổi.', why: 'Cache giảm DB read và latency khi cùng một key được đọc thường xuyên; cache không sửa được query kém trong mọi trường hợp.', how: 'Cache-aside: GET cache → miss thì query DB → set với TTL. Khi cập nhật sản phẩm, invalidation hoặc version key cần được định nghĩa; đo hit ratio và DB load.', tradeoff: 'Dữ liệu stale, key explosion và cache stampede là các lỗi thực tế. Không cache dữ liệu nếu chưa xác định được yêu cầu freshness.', english: 'I would add a cache only after confirming that repeated reads are the actual bottleneck.', path: '/java/backend/perf' },
    ],
    deliverable: { title: 'Tối ưu một endpoint tìm kiếm', tasks: ['Viết filter/sort/page contract cho GET /api/products.', 'Chạy query với dữ liệu đủ lớn và lưu execution plan ban đầu.', 'Thử một index phù hợp rồi so actual rows, buffers và p95 latency.', 'Quyết định có cần cache dựa trên read pattern và yêu cầu freshness.'], check: 'Bạn giải thích được mỗi tối ưu xử lý số liệu nào; không thêm index hoặc cache chỉ vì nghe nói sẽ nhanh.' },
  },
  {
    id: 'incident', icon: '🚨', title: 'API chậm sau khi deploy', goal: 'Debug · query plan · CI/CD · rollback · giao tiếp',
    scenario: 'Sau lần deploy mới, p95 latency tăng từ 300 ms lên 2.4 s và một số request timeout. Bạn trực ca cùng QA và phải tìm nguyên nhân mà không làm tình hình tệ hơn.',
    outcome: 'Khoanh vùng bằng dữ liệu, giảm ảnh hưởng người dùng, sửa nguyên nhân và báo tiến độ rõ ràng.',
    steps: [
      { id: 'signal', kind: 'OBSERVABILITY · BƯỚC 1', title: 'Đọc tín hiệu trước khi sửa', what: 'Observability dùng metrics, logs và traces để suy ra trạng thái bên trong hệ thống từ dữ liệu vận hành.', role: 'Xác nhận thời điểm bắt đầu, endpoint/region/version bị ảnh hưởng, error rate, p95/p99 và dependency chậm.', why: 'Một symptom như “API chậm” có thể do query, downstream, thread pool hoặc deploy mới. Sửa theo phỏng đoán có thể che symptom mà giữ nguyên nguyên nhân.', how: 'So dashboard trước/sau deploy, lấy trace chậm, tìm exception và dependency timing; xác nhận có thể tái hiện trên một request cụ thể.', tradeoff: 'Metrics chỉ ra xu hướng nhưng thường không nêu row hay code cụ thể; kết hợp trace và log có correlation ID.', english: 'I would compare the latency and error rate before and after the deployment.', path: '/devops/monitoring' },
      { id: 'query', kind: 'DATABASE · BƯỚC 2', title: 'Kiểm tra query plan và N+1', what: 'Query plan cho biết DB đọc dữ liệu theo cách nào; N+1 là một query lấy danh sách rồi phát sinh thêm một query cho mỗi record.', role: 'Nếu trace cho thấy DB chiếm phần lớn 2.4 giây, kiểm tra query count, thời gian từng query và execution plan.', why: 'Một thay đổi ORM tưởng nhỏ có thể biến một query thành hàng trăm query; index mới cũng có thể làm write chậm hoặc planner chọn đường khác.', how: 'Dùng log SQL/APM và EXPLAIN ANALYZE trên query đại diện; so rows, loops, buffers, actual time với phiên bản trước.', tradeoff: 'Không chạy EXPLAIN ANALYZE tùy tiện trên query ghi ở production vì nó thực thi query thật.', english: 'The trace points to the database, so I would inspect the query count and execution plan.', path: '/java/backend/sql' },
      { id: 'mitigate', kind: 'RELEASE · BƯỚC 3', title: 'Giảm ảnh hưởng trước, rồi mới sửa lâu dài', what: 'Mitigation là hành động giảm tác động trong khi root cause đang được điều tra; rollback đưa hệ thống về artifact/config đã biết là ổn.', role: 'Nếu regression liên quan trực tiếp bản release và rollback an toàn, khôi phục service trước rồi tạo fix có kiểm chứng.', why: 'Khi người dùng đang bị ảnh hưởng, sửa nhanh trong production mà thiếu bằng chứng có thể tạo outage thứ hai.', how: 'Kiểm tra migration có tương thích ngược không, rollback qua pipeline đã duyệt, theo dõi p95/error rate rồi tái hiện lỗi ở staging.', tradeoff: 'Rollback code không tự rollback schema hoặc dữ liệu; migration cần chiến lược expand/contract và kế hoạch phục hồi riêng.', english: 'I would mitigate the impact first, then investigate the root cause and verify a permanent fix.', path: '/devops/cicd' },
      { id: 'communicate', kind: 'TEAMWORK · BƯỚC 4', title: 'Cập nhật tình hình bằng dữ kiện', what: 'Incident communication giúp các bên biết tác động, giả thuyết, hành động hiện tại và thời điểm cập nhật tiếp theo.', role: 'QA, product và khách hàng cần hiểu ai bị ảnh hưởng, workaround có không và khi nào có cập nhật tiếp.', why: 'Im lặng khiến nhóm khác tiếp tục deploy hoặc điều tra trùng; khẳng định root cause quá sớm làm mất niềm tin nếu sai.', how: 'Nêu impact đã xác nhận, điều đang kiểm tra, biện pháp giảm ảnh hưởng và mốc cập nhật tiếp theo. Sau incident ghi timeline và prevention action.', tradeoff: 'Tách sự kiện đã xác minh khỏi giả thuyết; không đưa thông tin nhạy cảm vào ticket/log công khai.', english: 'The new release is affecting checkout latency. We are checking the database traces and will update you in fifteen minutes.', path: '/interview-english' },
    ],
    deliverable: { title: 'Diễn tập incident trong 10 phút', tasks: ['Viết status update gồm impact, evidence, action và next update.', 'Chỉ ra dữ liệu cần xem để phân biệt DB chậm với downstream chậm.', 'Chọn rollback hoặc mitigation và nêu rủi ro migration.', 'Viết một prevention action có người phụ trách và cách xác minh.'], check: 'Bạn dùng evidence để chọn hành động, nêu được rủi ro rollback và tóm tắt incident bằng tiếng Anh rõ ràng.' },
  },
];

function readProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') || {}; }
  catch { return {}; }
}

export default {
  name: 'EngineeringThinkingPage',
  components: { CTopbar },
  data() {
    return { cases, currentCaseId: cases[0].id, progress: readProgress() };
  },
  computed: {
    currentCase() { return this.cases.find((item) => item.id === this.currentCaseId); },
    completedSteps() { return this.currentCase.steps.filter((step) => this.isDone(step.id)).length; },
  },
  methods: {
    goHome() { navigate('/'); },
    navigate(path) { navigate(path); },
    isDone(stepId) { return Boolean(this.progress[`${this.currentCaseId}:${stepId}`]); },
    toggleStep(stepId) {
      const key = `${this.currentCaseId}:${stepId}`;
      if (this.progress[key]) delete this.progress[key];
      else this.progress[key] = new Date().toISOString();
      try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(this.progress)); } catch { /* Progress stays available for this session. */ }
    },
  },
};
</script>

<style scoped>
.thinking-page { min-height: 100vh; padding: 1.5rem; background: var(--color-bg); color: var(--color-text); }
.page-shell { max-width: 1080px; margin: 0 auto; }
.hero, .panel { border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
.hero { margin: 1.25rem 0; padding: clamp(1.25rem, 4vw, 2.5rem); background: linear-gradient(130deg, rgba(124, 92, 252, .2), rgba(6, 182, 212, .08)); }
.eyebrow { margin: 0 0 .35rem; color: #a78bfa; font-size: .7rem; font-weight: 800; letter-spacing: .09em; }
.hero h1 { max-width: 760px; margin: 0; font-size: clamp(1.6rem, 4vw, 2.5rem); line-height: 1.16; }
.hero > p:not(.eyebrow) { max-width: 760px; color: var(--color-text2); line-height: 1.7; }
.hero-flow { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; margin-top: 1.2rem; }
.hero-flow span { padding: .4rem .7rem; border: 1px solid var(--color-border); border-radius: 999px; background: rgba(12, 10, 29, .38); font-size: .8rem; font-weight: 700; }
.hero-flow b { color: #a78bfa; }
.case-picker { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; margin-bottom: 1rem; }
.case-picker button { display: grid; grid-template-columns: auto 1fr; gap: .25rem .65rem; align-content: start; text-align: left; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); color: var(--color-text); cursor: pointer; }
.case-picker button > span { grid-row: span 2; font-size: 1.35rem; }
.case-picker button strong { font-size: .92rem; }
.case-picker button small { color: var(--color-text2); line-height: 1.45; }
.case-picker button.active { border-color: #8b5cf6; background: rgba(124, 92, 252, .15); box-shadow: 0 0 0 1px rgba(139, 92, 246, .18); }
.panel { padding: clamp(1rem, 3vw, 1.4rem); }
.scenario { margin-bottom: .85rem; }
.scenario-heading { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: .75rem; }
.scenario h2, .deliverable h2 { margin: 0; font-size: 1.25rem; }
.scenario > p { color: var(--color-text2); line-height: 1.7; }
.progress-chip { padding: .35rem .6rem; border: 1px solid rgba(52, 211, 153, .3); border-radius: 999px; color: #6ee7b7; font-size: .75rem; font-weight: 800; }
.scenario-result, .tradeoff { display: grid; grid-template-columns: 130px 1fr; gap: .75rem; padding: .8rem; border-radius: var(--radius-sm); background: rgba(6, 182, 212, .07); color: var(--color-text2); font-size: .88rem; line-height: 1.6; }
.scenario-result strong, .tradeoff strong { color: var(--color-text); }
.steps { display: grid; gap: .85rem; }
.step.complete { border-color: rgba(52, 211, 153, .5); }
.step-top { display: flex; align-items: center; gap: .75rem; }
.step-number { display: grid; place-items: center; width: 2.4rem; height: 2.4rem; flex: 0 0 auto; border-radius: 50%; background: rgba(139, 92, 246, .15); color: #c4b5fd; font-weight: 900; }
.step-title { flex: 1; }
.step-title h3 { margin: 0; font-size: 1.08rem; }
.step-check { padding: .45rem .7rem; border: 1px solid var(--color-border); border-radius: 999px; background: transparent; color: var(--color-text); font: inherit; font-size: .75rem; font-weight: 800; cursor: pointer; }
.step.complete .step-check { border-color: rgba(52, 211, 153, .5); color: #6ee7b7; }
.concept-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; margin: 1rem 0; }
.concept-grid section { padding: .8rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: rgba(12, 10, 29, .26); }
.concept-grid h4 { margin: 0 0 .35rem; color: #c4b5fd; font-size: .8rem; }
.concept-grid p { margin: 0; color: var(--color-text2); font-size: .85rem; line-height: 1.65; }
.step-footer { display: grid; grid-template-columns: minmax(150px, .6fr) 1.4fr; gap: .75rem; align-items: start; margin-top: .8rem; }
.deep-link { display: inline-flex; gap: .4rem; color: #c4b5fd; font-weight: 800; text-decoration: none; cursor: pointer; }
.deep-link:hover { color: #fff; }
.say-it { padding: .75rem; border-left: 3px solid #8b5cf6; background: rgba(139, 92, 246, .08); }
.say-it strong { font-size: .75rem; }
.say-it p { margin: .35rem 0 0; color: var(--color-text2); font-size: .85rem; line-height: 1.6; }
.deliverable { margin: .85rem 0 2rem; border-color: rgba(245, 158, 11, .3); }
.deliverable ol { display: grid; gap: .4rem; padding-left: 1.25rem; color: var(--color-text2); line-height: 1.6; }
.success-criteria { margin-bottom: 0; color: var(--color-text2); line-height: 1.6; }
.success-criteria strong { color: #fcd34d; }
@media (max-width: 760px) { .thinking-page { padding: .75rem; } .case-picker { grid-template-columns: 1fr; } .concept-grid { grid-template-columns: 1fr; } .step-footer { grid-template-columns: 1fr; } .scenario-result, .tradeoff { grid-template-columns: 1fr; gap: .25rem; } }
@media (max-width: 480px) { .step-top { align-items: flex-start; flex-wrap: wrap; } .step-title { min-width: calc(100% - 3.5rem); } .step-check { margin-left: 3.15rem; } }
</style>
