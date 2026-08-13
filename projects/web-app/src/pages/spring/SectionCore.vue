<template>
  <div class="ss-section">
    <h3>IoC Container là gì?</h3>
    <p class="section-text">IoC Container (ApplicationContext) quản lý vòng đời của beans — tạo, cấu hình, inject dependencies. Thay vì tự tạo object (<code>new UserService()</code>), bạn để Spring quản lý và inject khi cần.</p>

    <h3>Các cách inject — chọn cái nào?</h3>
    <div class="cards-grid cols-2">
      <div class="info-card"><h4>1. Field injection (@Autowired)</h4><p>Ngắn gọn nhưng <strong>khó test</strong> — không inject được dependency khác khi viết unit test, phải dùng reflection.</p></div>
      <div class="info-card"><h4>2. Constructor injection (khuyến nghị)</h4><p>Biến dependency thành <code>final</code> — bắt buộc cung cấp khi tạo object. <strong>Dễ test, bất biến, tự detect vòng phụ thuộc.</strong> Spring khuyến nghị đây là chuẩn duy nhất.</p></div>
      <div class="info-card"><h4>3. Setter injection</h4><p>Dùng khi dependency <strong>tùy chọn</strong> hoặc cần thay đổi runtime. Ít dùng trong thực tế.</p></div>
      <div class="info-card"><h4>Quy tắc thực tế</h4><p>Trong project thật, hầu hết bean dùng constructor injection. Khi có 1 constructor, Spring tự inject — không cần viết <code>@Autowired</code>.</p></div>
    </div>
    <CodeBlock :code="iocCode" language="java" />

    <h3>@Component vs @Bean</h3>
    <div class="cards-grid cols-2">
      <div class="info-card">
        <h4>@Component (@Service, @Repository, @Controller)</h4>
        <p>Dùng cho class tự viết. Spring scan package → tạo bean tự động.</p>
      </div>
      <div class="info-card">
        <h4>@Bean</h4>
        <p>Dùng trong @Configuration class cho third-party classes (DataSource, RestTemplate).</p>
      </div>
    </div>

    <h3>Bean Scopes — mỗi bean sống bao lâu?</h3>
    <p class="section-text">Scope quyết định <strong>số instance</strong> của một bean tồn tại trong app. Chọn sai scope là nguồn gốc của nhiều bug khó tìm: state dùng chung bất ngờ giữa các request, hoặc bean chứa state không thread-safe.</p>
    <CodeBlock :code="scopeCode" language="java" />

    <h3>@Primary & @Qualifier — khi có nhiều bean cùng loại</h3>
    <p class="section-text">Khi 2 bean cùng implement một interface (VD: 2 cổng thanh toán VNPay và PayPal), Spring không biết inject cái nào → báo lỗi. <code>@Primary</code> chọn mặc định, <code>@Qualifier</code> chọn theo tên khi cần bean khác — tránh sửa code mỗi lần đổi cổng thanh toán.</p>
    <CodeBlock :code="qualifierCode" language="java" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const iocCode = `// 1. Field injection (không khuyến nghị — khó test)
@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;
}

// 2. Constructor injection (khuyến nghị)
@Service
public class UserService {
    private final UserRepository userRepo;
    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }
}

// 3. Setter injection
@Service
public class UserService {
    private UserRepository userRepo;
    @Autowired
    public void setUserRepo(UserRepository userRepo) {
        this.userRepo = userRepo;
    }
}`;

const scopeCode = `@Component
@Scope("singleton")  // Mặc định — 1 instance cho toàn app
@Scope("prototype")  // Tạo mới mỗi lần getBean/inject
@Scope("request")    // 1 instance cho 1 HTTP request (Web)
@Scope("session")    // 1 instance cho 1 HTTP session
@Scope("application")// 1 instance cho ServletContext`;

const qualifierCode = `// Nhiều bean cùng type — chọn 1
@Primary
@Service
public class VnpayPayment implements PaymentService { }

@Qualifier("paypal")
@Service
public class PaypalPayment implements PaymentService { }

// Khi inject
public OrderService(@Qualifier("paypal") PaymentService payment) { }`;

export default {
  name: 'SpringSectionCore',
  components: { CodeBlock },
  data() {
    return { iocCode, scopeCode, qualifierCode };
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
