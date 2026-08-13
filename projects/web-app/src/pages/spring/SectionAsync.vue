<template>
  <div class="ss-section">
    <h3>@Async — chạy nền, không chặn response</h3>
    <p class="section-text"><code>@Async</code> đẩy method chạy vào <strong>thread pool riêng</strong>, trả response ngay lập tức. Áp dụng cho tác vụ chậm không cần đợi kết quả: gửi email welcome, gọi webhook, xử lý file. <strong>Bẫy phổ biến:</strong> gọi @Async method từ bên trong cùng class sẽ không có tác dụng (proxy không đi qua).</p>
    <CodeBlock :code="asyncCode" language="java" />

    <h3>@Scheduled — chạy tự động theo lịch</h3>
    <p class="section-text">Tác vụ định kỳ như dọn dữ liệu cũ, gửi báo cáo, chạy backup. Cron <code>0 0 2 * * ?</code> = mỗi ngày lúc 2h sáng. Khi chạy nhiều instance, cần khóa phân tán (ShedLock, Quartz) để tránh <strong>nhiều instance chạy cùng lúc</strong>.</p>
    <CodeBlock :code="scheduledCode" language="java" />

    <h3>@EventListener — tách rời các module</h3>
    <p class="section-text">Publisher <strong>phát event</strong>, listener <strong>lắng nghe và xử lý</strong> — hai module không biết về nhau. VD: UserService tạo user xong phát <code>UserCreatedEvent</code>, module email/notification tự phản ứng. Kết hợp <code>@Async</code> để không làm chậm luồng chính. Đây là nền tảng của kiến trúc <strong>event-driven</strong>.</p>
    <CodeBlock :code="eventCode" language="java" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const asyncCode = `@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

@Service
public class EmailService {
    @Async
    public CompletableFuture<Void> sendWelcomeEmail(User user) {
        emailClient.send(user.getEmail(), "Welcome!", template);
        return CompletableFuture.completedFuture(null);
    }
}`;

const scheduledCode = `@Configuration
@EnableScheduling
public class SchedulingConfig {}

@Component
public class CleanupJob {
    // Mỗi ngày lúc 2h sáng
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanExpiredTokens() {
        tokenRepository.deleteExpired(LocalDateTime.now());
    }
}`;

const eventCode = `// Event
public record UserCreatedEvent(User user, Instant timestamp) {}

// Publisher
@Service
public class UserService {
    @Autowired private ApplicationEventPublisher publisher;
    public User create(CreateUserRequest req) {
        User user = userRepo.save(toEntity(req));
        publisher.publishEvent(new UserCreatedEvent(user, Instant.now()));
        return user;
    }
}

// Listener
@Component
public class UserEventListener {
    @Async
    @EventListener
    public void handleUserCreated(UserCreatedEvent event) {
        emailService.sendWelcome(event.user());
    }
}`;

export default {
  name: 'SpringSectionAsync',
  components: { CodeBlock },
  data() {
    return { asyncCode, scheduledCode, eventCode };
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
