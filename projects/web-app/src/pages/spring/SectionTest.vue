<template>
  <div class="ss-section">
    <h3>Các loại test — kiểm tra ở đúng tầng</h3>
    <div class="cards-grid cols-4">
      <div class="info-card"><h4>Unit Test</h4><p>Test 1 class độc lập, mock dependencies. Nhanh nhất, chạy mỗi lần commit. @ExtendWith(MockitoExtension.class).</p></div>
      <div class="info-card"><h4>Integration Test</h4><p>Test tầng repository với DB thật. @DataJpaTest + Testcontainers.</p></div>
      <div class="info-card"><h4>Web Layer Test</h4><p>@WebMvcTest — chỉ tầng controller, mock service — test HTTP + JSON serialize.</p></div>
      <div class="info-card"><h4>Full Integration</h4><p>@SpringBootTest + Testcontainers — test từ controller đến DB. Chậm nhất, chạy trước khi release.</p></div>
    </div>
    <p class="section-text"><strong>Chiến lược thực tế:</strong> đa số là unit test (nhanh, rẻ), vài integration test cho repository/controller, số ít full flow. Kim tự tháp test — càng lên cao càng ít, càng xuống dưới càng nhiều.</p>

    <h3>Unit Test với Mockito — test logic không cần DB</h3>
    <p class="section-text"><code>@Mock</code> tạo "bản sao giả" của dependency (không chạm DB thật), <code>@InjectMocks</code> đưa chúng vào class cần test. Kiểm tra: kết quả trả về đúng (<code>assertThat</code>) và method được gọi đúng (<code>verify</code>). Chạy trong mili-giây, lặp lại vô tận.</p>
    <CodeBlock :code="unitTestCode" language="java" />

    <h3>Integration Test với Testcontainers — DB thật nhưng tạm thời</h3>
    <p class="section-text"><strong>Testcontainers</strong> khởi động PostgreSQL thật trong Docker cho mỗi lần test — dữ liệu sạch, không phụ thuộc máy dev, không ô nhiễm DB thật. Bắt được lỗi mà mock bỏ sót: SQL sai, mapping Entity lệch schema, constraint vi phạm.</p>
    <CodeBlock :code="integrationTestCode" language="java" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const unitTestCode = `@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepo;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UserService userService;

    @Test
    void createUser_shouldReturn_whenValid() {
        when(passwordEncoder.encode("pass123")).thenReturn("encoded");
        when(userRepo.save(any())).thenReturn(entity);

        User result = userService.create(req);

        assertThat(result.getEmail()).isEqualTo("alice@email.com");
        verify(userRepo).save(any());
    }
}`;

const integrationTestCode = `@SpringBootTest
@Testcontainers
class UserRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
    }

    @Autowired private UserRepository userRepo;

    @Test
    void findByEmail_shouldReturnUser() {
        userRepo.save(new User(null, "Alice", "alice@email.com"));
        Optional<User> result = userRepo.findByEmail("alice@email.com");
        assertThat(result).isPresent();
    }
}`;

export default {
  name: 'SpringSectionTest',
  components: { CodeBlock },
  data() {
    return { unitTestCode, integrationTestCode };
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

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
