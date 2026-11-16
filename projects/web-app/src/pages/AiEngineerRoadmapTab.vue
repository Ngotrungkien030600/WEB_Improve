<template>
  <div class="ai-engineer-roadmap-tab" style="--forge-accent: var(--accent-ai)">
    <header class="page-header">
      <div class="page-shell">
        <p class="eyebrow">TỪ CHƯA BIẾT AI ĐẾN TỰ XÂY SẢN PHẨM</p>
        <h2 class="hero-title">Bạn không cần bắt đầu bằng việc tạo ra một mô hình AI.</h2>
        <p class="hero-copy">
          AI Engineer là người biến mô hình thành sản phẩm có ích: kết nối dữ liệu, xây ứng dụng,
          đo chất lượng và vận hành ổn định. Hãy bắt đầu bằng lập trình căn bản, rồi học AI qua
          những dự án nhỏ có thể chạy được.
        </p>
        <div class="hero-actions">
          <a class="primary-link" href="#roadmap">Xem các chặng học <span aria-hidden="true">↓</span></a>
          <span class="reality-note">Không có mốc thời gian bảo đảm việc làm — tiến độ tùy nền tảng và thời gian thực hành.</span>
        </div>
      </div>
    </header>

    <main class="page-shell page-content">
      <nav class="section-nav" aria-label="Mục lục lộ trình">
        <a href="#role">AI Engineer làm gì?</a>
        <a href="#foundations">CS hay Data Science?</a>
        <a href="#roadmap">Lộ trình học</a>
        <a href="#projects">Dự án portfolio</a>
        <a href="#reality">Đi làm thực tế</a>
      </nav>

      <section id="role" class="content-section">
        <div class="section-heading">
          <p class="eyebrow">01 · HIỂU ĐÚNG NGHỀ</p>
          <h2>AI Engineer khác gì các vai trò gần bên?</h2>
          <p>Ranh giới giữa các vị trí thay đổi theo công ty, nhưng trọng tâm công việc thường khác nhau.</p>
        </div>
        <div class="role-grid">
          <article class="info-card role-card role-highlight">
            <span class="card-kicker">XÂY SẢN PHẨM AI</span>
            <h3>AI Engineer</h3>
            <p>Kết nối mô hình với ứng dụng và dữ liệu; xây API, retrieval, đánh giá chất lượng, tối ưu chi phí/độ trễ và theo dõi khi chạy thật.</p>
            <p class="example-line"><strong>Ví dụ:</strong> trợ lý trả lời dựa trên tài liệu công ty, có kiểm tra câu trả lời và ghi nhận lỗi.</p>
          </article>
          <article class="info-card">
            <span class="card-kicker">PHÂN TÍCH DỮ LIỆU</span>
            <h3>Data Scientist</h3>
            <p>Tìm insight từ dữ liệu, thiết kế thí nghiệm, phân tích hành vi và xây mô hình dự đoán để hỗ trợ quyết định.</p>
          </article>
          <article class="info-card">
            <span class="card-kicker">NGHIÊN CỨU</span>
            <h3>AI Researcher</h3>
            <p>Đề xuất hoặc cải tiến phương pháp/mô hình mới; thường cần nền tảng toán, nghiên cứu và đọc paper sâu hơn.</p>
          </article>
        </div>
        <p class="callout">
          Phần lớn người mới nên nhắm tới năng lực <strong>làm ứng dụng AI đáng tin cậy</strong> trước,
          không cần tự huấn luyện mô hình lớn hay phát minh thuật toán mới.
        </p>
      </section>

      <section id="foundations" class="content-section">
        <div class="section-heading">
          <p class="eyebrow">02 · NỀN TẢNG VỪA ĐỦ</p>
          <h2>Có cần học Computer Science hay Data Science?</h2>
          <p>Có ích ở những phần phù hợp — nhưng bạn không cần học trọn một chương trình đại học rồi mới được bắt đầu.</p>
        </div>
        <div class="foundation-grid">
          <article class="info-card">
            <h3>Học trước từ Computer Science</h3>
            <ul>
              <li>Python: biến, điều kiện, vòng lặp, hàm, cấu trúc dữ liệu và đọc lỗi.</li>
              <li>Git, terminal, môi trường Python, cách cài thư viện và chạy chương trình.</li>
              <li>HTTP/API, JSON, SQL cơ bản, kiểm thử và cấu trúc một ứng dụng nhỏ.</li>
              <li>Độ phức tạp và cấu trúc dữ liệu ở mức chọn được cách làm hợp lý.</li>
            </ul>
            <p class="card-foot">Chưa cần học sâu compiler, hệ điều hành hay thuật toán thi đấu để làm project đầu tiên.</p>
          </article>
          <article class="info-card">
            <h3>Học Data Science & toán theo nhu cầu</h3>
            <ul>
              <li>Thống kê, xác suất, cách chia tập dữ liệu và đọc metric để biết mô hình sai ở đâu.</li>
              <li>NumPy/Pandas để làm sạch, kiểm tra và biến đổi dữ liệu.</li>
              <li>Vector, ma trận và gradient ở mức hiểu embedding và quá trình học mô hình.</li>
              <li>Đào sâu đại số tuyến tính, giải tích hoặc thiết kế thí nghiệm khi công việc yêu cầu.</li>
            </ul>
            <p class="card-foot">Mục tiêu là hiểu kết quả, giới hạn và cách đánh giá — không phải thuộc công thức.</p>
          </article>
        </div>
        <div class="learning-order" aria-label="Thứ tự học khuyến nghị">
          <span>Viết được chương trình</span><span aria-hidden="true">→</span>
          <span>Xử lý dữ liệu và API</span><span aria-hidden="true">→</span>
          <span>Hiểu mô hình và metric</span><span aria-hidden="true">→</span>
          <span>Đưa AI vào sản phẩm</span>
        </div>
      </section>

      <section id="roadmap" class="content-section">
        <div class="section-heading">
          <p class="eyebrow">03 · LỘ TRÌNH TỪNG CHẶNG</p>
          <h2>Đi theo năng lực đầu ra, không chạy theo danh sách tool</h2>
          <p>Mỗi chặng có một việc bạn phải tự làm được. Chuyển tiếp khi giải thích được cách làm và tự sửa được lỗi cơ bản.</p>
        </div>
        <CRoadmapDiagram roadmap-id="ai-engineer" />
        <ol class="roadmap-list">
          <li class="roadmap-item">
            <span class="stage-number">1</span>
            <div>
              <p class="stage-label">LẬP TRÌNH CĂN BẢN</p>
              <h3>Python, Git và thói quen gỡ lỗi</h3>
              <p>Viết script nhỏ, đọc/ghi file, dùng hàm và thư viện, tạo môi trường riêng, commit bằng Git và tra lỗi có phương pháp.</p>
              <p class="outcome"><strong>Đầu ra:</strong> chương trình đọc dữ liệu đầu vào, xử lý và xuất kết quả; giải thích được từng phần code.</p>
            </div>
            <span class="stage-tag">Chạy được code</span>
          </li>
          <li class="roadmap-item">
            <span class="stage-number">2</span>
            <div>
              <p class="stage-label">KỸ NĂNG KỸ SƯ PHẦN MỀM</p>
              <h3>CS căn bản, SQL, HTTP và test</h3>
              <p>Hiểu cấu trúc dữ liệu phổ biến, query SQL, request/response, API, logging và kiểm thử để code không chỉ chạy trên máy của mình.</p>
              <p class="outcome"><strong>Đầu ra:</strong> viết API đơn giản, lưu/đọc dữ liệu và kiểm tra hành vi bằng test.</p>
            </div>
            <span class="stage-tag">Xây được ứng dụng</span>
          </li>
          <li class="roadmap-item">
            <span class="stage-number">3</span>
            <div>
              <p class="stage-label">DỮ LIỆU VÀ MACHINE LEARNING</p>
              <h3>Học cách đo mô hình, không chỉ gọi hàm predict</h3>
              <p>Làm sạch dữ liệu, tạo baseline, chia train/validation/test, thử mô hình cơ bản và chọn metric phù hợp với bài toán.</p>
              <p class="outcome"><strong>Đầu ra:</strong> so sánh được baseline với mô hình, nhận ra data leakage và giải thích false positive/negative.</p>
            </div>
            <span class="stage-tag">Đánh giá được AI</span>
          </li>
          <li class="roadmap-item">
            <span class="stage-number">4</span>
            <div>
              <p class="stage-label">DEEP LEARNING VÀ LLM</p>
              <h3>Hiểu mô hình nền, sau đó làm ứng dụng</h3>
              <p>Nắm ý tưởng neural network, token, embedding và transformer; thực hành gọi model, thiết kế prompt, retrieval/RAG và đánh giá đầu ra trên bộ câu hỏi mẫu.</p>
              <p class="outcome"><strong>Đầu ra:</strong> giải thích được khi nào dùng tìm kiếm/RAG, khi nào không; đo độ đúng nguồn và xử lý câu trả lời thiếu căn cứ.</p>
            </div>
            <span class="stage-tag">Làm được ứng dụng AI</span>
          </li>
          <li class="roadmap-item">
            <span class="stage-number">5</span>
            <div>
              <p class="stage-label">ĐƯA VÀO VẬN HÀNH</p>
              <h3>API, triển khai, quan sát và cải tiến</h3>
              <p>Đóng gói dịch vụ, quản lý cấu hình an toàn, xử lý lỗi/timeout, theo dõi chất lượng, độ trễ và chi phí; biết cập nhật hệ thống khi dữ liệu hoặc model đổi.</p>
              <p class="outcome"><strong>Đầu ra:</strong> người khác có thể chạy demo, hiểu giới hạn và biết cách bạn phát hiện lỗi khi sử dụng.</p>
            </div>
            <span class="stage-tag">Sẵn sàng làm project thật</span>
          </li>
        </ol>
      </section>

      <section id="projects" class="content-section">
        <div class="section-heading">
          <p class="eyebrow">04 · PORTFOLIO CÓ BẰNG CHỨNG</p>
          <h2>Làm ít dự án hơn, nhưng giải thích được quyết định</h2>
          <p>Đừng chỉ chụp giao diện chatbot. Cho thấy dữ liệu, cách đánh giá và giới hạn của hệ thống.</p>
        </div>
        <div class="project-grid">
          <article class="info-card project-card">
            <span class="project-number">01</span>
            <h3>Phân tích dữ liệu và dự đoán</h3>
            <p>Chọn dữ liệu công khai, làm sạch, tạo baseline và giải thích metric. Viết README về dữ liệu, giả định và lỗi còn lại.</p>
            <span class="project-signal">Chứng minh: Python · SQL/data · ML cơ bản</span>
          </article>
          <article class="info-card project-card">
            <span class="project-number">02</span>
            <h3>Hỏi đáp trên một bộ tài liệu</h3>
            <p>Xây ingest → chia đoạn → truy xuất → sinh câu trả lời có dẫn nguồn. Tạo câu hỏi kiểm thử và ghi nhận câu trả lời sai.</p>
            <span class="project-signal">Chứng minh: RAG · API · đánh giá</span>
          </article>
          <article class="info-card project-card">
            <span class="project-number">03</span>
            <h3>Hoàn thiện một ứng dụng AI</h3>
            <p>Thêm xác thực phù hợp, xử lý timeout, log không lộ dữ liệu nhạy cảm, đo độ trễ/chi phí và viết hướng dẫn chạy demo.</p>
            <span class="project-signal">Chứng minh: engineering · vận hành · trade-off</span>
          </article>
        </div>
        <p class="callout">
          Với mỗi project, hãy viết rõ: bài toán cho ai, dữ liệu đến từ đâu, dùng baseline nào,
          đo chất lượng ra sao, điều gì có thể sai và bạn sẽ cải thiện gì tiếp theo.
        </p>
      </section>

      <section id="reality" class="content-section reality-section">
        <div class="section-heading">
          <p class="eyebrow">05 · CÔNG VIỆC THỰC TẾ</p>
          <h2>AI Engineer không chỉ ngồi viết prompt</h2>
          <p>Một ticket nhỏ có thể đi qua nhiều bước trước khi thành tính năng dùng được.</p>
        </div>
        <div class="work-flow" aria-label="Luồng công việc AI Engineer">
          <div><strong>Hiểu nhu cầu</strong><span>Ai dùng, vấn đề nào cần giải quyết?</span></div>
          <span aria-hidden="true">→</span>
          <div><strong>Kiểm tra dữ liệu</strong><span>Đủ quyền, đủ sạch, cập nhật chưa?</span></div>
          <span aria-hidden="true">→</span>
          <div><strong>Thử giải pháp</strong><span>Baseline, model, retrieval hay kết hợp?</span></div>
          <span aria-hidden="true">→</span>
          <div><strong>Đo và triển khai</strong><span>Đúng, nhanh, an toàn, chi phí hợp lý?</span></div>
        </div>
        <div class="reality-grid">
          <article class="reality-card">
            <h3>Những việc thường ngày</h3>
            <ul>
              <li>Đọc yêu cầu, hỏi lại tiêu chí thành công và kiểm tra dữ liệu.</li>
              <li>Viết code/test, tích hợp model với API hoặc sản phẩm hiện có.</li>
              <li>Điều tra kết quả sai, lỗi tích hợp, độ trễ hoặc chi phí tăng.</li>
              <li>Trao đổi với Product, Backend, Data và người dùng về trade-off.</li>
            </ul>
          </article>
          <article class="reality-card">
            <h3>Điều người mới nên biết</h3>
            <ul>
              <li>Nhiều bài toán giải tốt bằng tìm kiếm, SQL hoặc quy tắc — không cần AI.</li>
              <li>Demo chạy được chưa chứng minh sản phẩm đáng tin cậy.</li>
              <li>Vị trí “AI Engineer” khác nhau; đọc yêu cầu tuyển dụng để chọn nhánh học.</li>
              <li>Nhà tuyển dụng cần bằng chứng bạn tự làm, kiểm thử và giải thích quyết định.</li>
            </ul>
          </article>
        </div>
        <div class="readiness-card">
          <h3>Tự kiểm tra trước khi ứng tuyển</h3>
          <ul class="readiness-list">
            <li>Tự viết Python và API nhỏ; dùng Git, SQL và test cơ bản.</li>
            <li>Trình bày được cách đo chất lượng, lỗi có thể gặp và giới hạn dữ liệu/model.</li>
            <li>Có ít nhất một project chạy được, README rõ ràng và lịch sử code do chính bạn làm.</li>
            <li>Đọc được JD mục tiêu và chỉ ra phần đã đáp ứng, phần còn thiếu.</li>
          </ul>
        </div>
      </section>

      <footer class="page-footer">
        <p>Học nền tảng đủ để tự xây một thứ nhỏ, rồi dùng dự án để nhận ra mình cần học sâu phần nào tiếp theo.</p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import CRoadmapDiagram from '../components/CRoadmapDiagram.vue';
</script>

<style scoped>
.ai-engineer-roadmap-tab {
  color: var(--forge-text);
  background: var(--forge-bg);
}

.page-shell {
  width: min(100% - 2rem, 76rem);
  margin-inline: auto;
}

.page-header {
  padding: 0 0 2rem;
  border-bottom: 1px solid var(--forge-glass-border);
  background:
    radial-gradient(ellipse at 85% 12%, var(--forge-glow), transparent 40%),
    var(--forge-bg2);
}

.eyebrow,
.stage-label,
.card-kicker {
  margin: 0 0 0.6rem;
  color: var(--forge-accent);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.hero-title {
  max-width: 55rem;
  margin: 0;
  font-size: clamp(2.1rem, 5vw, 4.2rem);
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.hero-copy {
  max-width: 54rem;
  margin: 1.25rem 0 0;
  color: var(--forge-text2);
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.25rem;
  margin-top: 1.75rem;
}

.primary-link,
.page-footer a {
  color: var(--forge-text);
  font-weight: 750;
  text-decoration: none;
}

.primary-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.15rem;
  background: var(--forge-accent);
  border-radius: 999px;
}

.primary-link:hover,
.primary-link:focus-visible {
  filter: brightness(1.08);
}

.reality-note {
  max-width: 35rem;
  color: var(--forge-text3);
  font-size: 0.85rem;
  line-height: 1.5;
}

.page-content {
  padding-block: 1.5rem 4rem;
}

.section-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  padding: 0.75rem;
  background: var(--forge-bg2);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.section-nav a {
  padding: 0.5rem 0.75rem;
  color: var(--forge-text2);
  font-size: 0.88rem;
  text-decoration: none;
  border-radius: 999px;
}

.section-nav a:hover,
.section-nav a:focus-visible {
  color: var(--forge-text);
  background: var(--forge-glass-hover);
}

.content-section {
  padding-top: 4.5rem;
  scroll-margin-top: 1rem;
}

.section-heading {
  max-width: 52rem;
  margin-bottom: 1.5rem;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(1.65rem, 3.2vw, 2.5rem);
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.section-heading > p:last-child {
  margin: 0.75rem 0 0;
  color: var(--forge-text2);
  line-height: 1.7;
}

.role-grid,
.foundation-grid,
.project-grid,
.reality-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.foundation-grid,
.reality-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.info-card,
.reality-card,
.readiness-card {
  padding: 1.35rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.role-highlight {
  border-color: var(--forge-accent);
  box-shadow: 0 0 0 1px var(--forge-glow);
}

.info-card h3,
.reality-card h3,
.readiness-card h3 {
  margin: 0 0 0.7rem;
  font-size: 1.15rem;
}

.info-card p,
.reality-card li,
.readiness-card li {
  color: var(--forge-text2);
  line-height: 1.65;
}

.info-card p {
  margin: 0;
}

.info-card .example-line,
.info-card .card-foot {
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--forge-glass-border);
  font-size: 0.9rem;
}

.card-kicker {
  display: block;
  margin-bottom: 0.7rem;
  font-size: 0.67rem;
}

.callout {
  margin: 1rem 0 0;
  padding: 1rem 1.2rem;
  color: var(--forge-text2);
  line-height: 1.7;
  background: var(--forge-bg2);
  border-left: 3px solid var(--forge-accent);
  border-radius: 0 var(--forge-card-radius) var(--forge-card-radius) 0;
}

.foundation-grid ul,
.reality-card ul,
.readiness-list {
  display: grid;
  gap: 0.65rem;
  padding-left: 1.2rem;
  margin: 1rem 0 0;
}

.info-card .card-foot {
  color: var(--forge-text3);
}

.learning-order {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1rem;
  padding: 1rem;
  color: var(--forge-text2);
  background: var(--forge-bg2);
  border-radius: var(--forge-card-radius);
}

.learning-order span:nth-child(even) {
  color: var(--forge-accent);
  font-weight: 800;
}

.roadmap-list {
  display: grid;
  gap: 0.85rem;
  padding: 0;
  margin: 0;
  list-style: none;
  counter-reset: stage;
}

.roadmap-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: 1rem;
  padding: 1.3rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.stage-number {
  display: grid;
  place-items: center;
  width: 2.4rem;
  aspect-ratio: 1;
  color: var(--forge-bg);
  font-weight: 850;
  background: var(--forge-accent);
  border-radius: 50%;
}

.stage-label {
  margin-bottom: 0.35rem;
  font-size: 0.65rem;
}

.roadmap-item h3 {
  margin: 0;
  font-size: 1.15rem;
}

.roadmap-item p:not(.stage-label) {
  margin: 0.55rem 0 0;
  color: var(--forge-text2);
  line-height: 1.65;
}

.roadmap-item .outcome {
  color: var(--forge-text);
  font-size: 0.92rem;
}

.stage-tag {
  align-self: start;
  padding: 0.4rem 0.65rem;
  color: var(--forge-accent);
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--forge-bg2);
  border-radius: 999px;
}

.project-number {
  display: inline-block;
  margin-bottom: 0.8rem;
  color: var(--forge-accent);
  font-size: 0.8rem;
  font-weight: 850;
}

.project-card {
  display: flex;
  flex-direction: column;
}

.info-card .project-signal {
  display: block;
  margin-top: auto;
  padding-top: 1rem;
  color: var(--forge-accent);
  font-size: 0.82rem;
  font-weight: 700;
}

.work-flow {
  display: grid;
  grid-template-columns: repeat(7, auto);
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  padding: 1rem;
  background: var(--forge-bg2);
  border-radius: var(--forge-card-radius);
}

.work-flow > div {
  display: grid;
  gap: 0.4rem;
  min-width: 0;
}

.work-flow strong {
  font-size: 0.9rem;
}

.work-flow span:not([aria-hidden]) {
  color: var(--forge-text3);
  font-size: 0.8rem;
  line-height: 1.5;
}

.work-flow > span {
  color: var(--forge-accent);
  font-weight: 800;
}

.reality-grid {
  margin-top: 1rem;
}

.reality-card h3,
.readiness-card h3 {
  margin-bottom: 0.6rem;
}

.reality-card ul {
  margin-top: 0;
}

.readiness-card {
  margin-top: 1rem;
  border-color: var(--forge-accent);
}

.readiness-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--forge-glass-border);
}

.page-footer p {
  max-width: 45rem;
  margin: 0;
  color: var(--forge-text2);
  line-height: 1.6;
}

.page-footer a {
  flex-shrink: 0;
  color: var(--forge-accent);
}

@media (max-width: 760px) {
  .role-grid,
  .project-grid {
    grid-template-columns: 1fr;
  }

  .work-flow {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .work-flow > span {
    transform: rotate(90deg);
  }
}

@media (max-width: 600px) {
  .section-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .section-nav a {
    padding-inline: 0.45rem;
    font-size: 0.8rem;
  }

  .foundation-grid,
  .reality-grid,
  .readiness-list {
    grid-template-columns: 1fr;
  }

  .roadmap-item {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .stage-tag {
    grid-column: 2;
    justify-self: start;
  }

  .learning-order {
    justify-content: flex-start;
  }

  .page-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
