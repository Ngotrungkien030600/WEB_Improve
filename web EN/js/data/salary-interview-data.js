/**
 * Salary-based Interview Questions
 * Mỗi mức lương gồm topics + câu hỏi tương ứng
 * AI có thể bổ sung động qua API
 */
window.salaryInterviewData = {
  // Các mức lương tham khảo (triệu đồng/tháng)
  tiers: [
    {
      id: 'junior',
      range: '10 - 20 triệu',
      min: 10, max: 20,
      label: 'Junior Developer',
      color: '#22c55e',
      icon: '🌱',
      description: 'Mới ra trường hoặc 1-2 năm kinh nghiệm. Cần nắm vững nền tảng.',
      topics: [
        'Java Core: JDK/JRE/JVM, OOP, Collections, Exception',
        'SQL cơ bản: SELECT, JOIN, GROUP BY, INDEX',
        'Cấu trúc dữ liệu: Array, List, Map, Stack, Queue',
        'Git cơ bản: commit, branch, merge'
      ],
      questions: [
        { id: 'j01', topic: 'Java Core', question: 'Giải thích JDK, JRE, JVM và flow compile-run của Java.', sampleAnswer: 'JDK gồm JRE + compiler, JRE gồm JVM + runtime lib. Source → bytecode → JVM → machine code.' },
        { id: 'j02', topic: 'Java Core', question: 'Phân biệt ArrayList và LinkedList. Khi nào dùng cái nào?', sampleAnswer: 'ArrayList: truy cập O(1), thêm giữa O(n). LinkedList: thêm/xóa đầu O(1), truy cập O(n).' },
        { id: 'j03', topic: 'OOP', question: '4 tính chất OOP là gì? Cho ví dụ từng cái.', sampleAnswer: 'Đóng gói, Kế thừa, Đa hình, Trừu tượng. Ví dụ: private fields (đóng gói), extends (kế thừa)...' },
        { id: 'j04', topic: 'Java Core', question: 'Phân biệt == và equals(). Tại sao cần override hashCode?', sampleAnswer: '== so sánh reference, equals so sánh nội dung. equals=true → hashCode phải bằng nhau.' },
        { id: 'j05', topic: 'Exception', question: 'Phân biệt Checked và Unchecked Exception. Cho ví dụ.', sampleAnswer: 'Checked: IOException, SQLException — bắt buộc try-catch. Unchecked: NullPointerException — không bắt buộc.' },
        { id: 'j06', topic: 'SQL', question: 'Viết câu SQL: lấy top 5 nhân viên có lương cao nhất mỗi phòng ban.', sampleAnswer: 'Dùng window function: ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC)' },
        { id: 'j07', topic: 'Data Structures', question: 'HashMap hoạt động thế nào? Xử lý collision ra sao?', sampleAnswer: 'hashCode → bucket → LinkedList/Tree nếu collision. Java 8+ dùng Tree khi ≥ 8 entries.' },
        { id: 'j08', topic: 'Git', question: 'Git merge và git rebase khác nhau thế nào?', sampleAnswer: 'Merge giữ lịch sử, tạo merge commit. Rebase làm thẳng lịch sử, thay đổi commit hash.' },
      ]
    },
    {
      id: 'middle',
      range: '20 - 40 triệu',
      min: 20, max: 40,
      label: 'Middle Developer',
      color: '#3b82f6',
      icon: '📈',
      description: '2-5 năm kinh nghiệm. Cần hiểu hệ thống và framework.',
      topics: [
        'Spring Boot: autoconfig, DI, AOP, Actuator',
        'REST API: thiết kế, validation, error handling',
        'JPA/Hibernate: N+1, caching, relationships',
        'Multithreading: thread pool, synchronized, deadlock',
        'Transaction: ACID, isolation levels, @Transactional',
        'Security: JWT, OAuth2, Spring Security'
      ],
      questions: [
        { id: 'm01', topic: 'Spring Boot', question: 'Spring Boot autoconfiguration hoạt động thế nào?', sampleAnswer: '@EnableAutoConfiguration scan spring.factories, điều kiện qua @Conditional. Ví dụ: có H2 trong classpath → auto config DataSource.' },
        { id: 'm02', topic: 'Spring Boot', question: 'Phân biệt @Component, @Service, @Repository, @Controller.', sampleAnswer: '@Component tổng quát. @Service cho business layer. @Repository cho DAO (có translation). @Controller cho web.' },
        { id: 'm03', topic: 'JPA', question: 'N+1 problem trong Hibernate là gì? Cách fix?', sampleAnswer: '1 query lấy N entities + N query lấy quan hệ. Fix: JOIN FETCH, @EntityGraph, batch fetching.' },
        { id: 'm04', topic: 'Multithreading', question: 'Synchronized hoạt động thế nào? Phân biệt với Lock?', sampleAnswer: 'synchronized là built-in, dùng intrinsic lock. Lock provides tryLock, lockInterruptibly — linh hoạt hơn.' },
        { id: 'm05', topic: 'Transaction', question: '4 isolation levels trong SQL? Minh họa vấn đề mỗi mức.', sampleAnswer: 'READ UNCOMMITTED (dirty read), READ COMMITTED (non-repeatable), REPEATABLE READ (phantom), SERIALIZABLE (chậm).' },
        { id: 'm06', topic: 'REST API', question: 'Thiết kế REST API cho tính năng "đặt hàng". Nêu endpoints.', sampleAnswer: 'POST /orders, GET /orders/{id}, GET /orders?status=, PUT /orders/{id}/cancel, GET /orders/{id}/items' },
        { id: 'm07', topic: 'Security', question: 'JWT gồm những phần nào? Cách refresh token?', sampleAnswer: 'Header.Payload.Signature. Dùng refresh token (lưu DB) để cấp access token mới. Blacklist expired tokens.' },
        { id: 'm08', topic: 'Spring Boot', question: 'Cấu hình nhiều datasource trong Spring Boot?', sampleAnswer: '@Primary + @Qualifier, tách riêng config class, mỗi datasource có riêng EntityManager và TransactionManager.' },
        { id: 'm09', topic: 'Multithreading', question: 'Deadlock là gì? 4 điều kiện và cách phòng tránh.', sampleAnswer: 'Mutual exclusion, hold & wait, no preemption, circular wait. Tránh: lock theo cùng thứ tự, dùng tryLock timeout.' },
      ]
    },
    {
      id: 'senior',
      range: '40 - 70 triệu',
      min: 40, max: 70,
      label: 'Senior Developer',
      color: '#8b5cf6',
      icon: '🎯',
      description: '5-8 năm kinh nghiệm. Cần hiểu kiến trúc và hệ thống phân tán.',
      topics: [
        'Microservices: tách service, giao tiếp, distributed transaction',
        'Docker & Kubernetes: container, orchestration, scaling',
        'Message Queue: Kafka, RabbitMQ, event-driven',
        'Cloud: AWS/GCP, S3, RDS, Lambda, load balancer',
        'Performance: caching, connection pool, query optimization',
        'Design Patterns: Singleton, Factory, Strategy, Observer'
      ],
      questions: [
        { id: 's01', topic: 'Microservices', question: 'Microservices giao tiếp với nhau thế nào? Ưu nhược điểm?', sampleAnswer: 'REST sync (đơn giản), gRPC (nhanh), message queue (async). REST: dễ debug. Queue: decouple, chậm hơn.' },
        { id: 's02', topic: 'Microservices', question: 'Saga pattern là gì? Choreography vs Orchestration?', sampleAnswer: 'Saga quản lý distributed transaction. Choreography: mỗi service emit event. Orchestration: coordinator điều phối.' },
        { id: 's03', topic: 'Docker', question: 'Dockerfile multi-stage dùng để làm gì?', sampleAnswer: 'Tách build environment khỏi runtime. Stage 1: build jar. Stage 2: copy jar vào alpine image nhỏ.' },
        { id: 's04', topic: 'Kubernetes', question: 'Kubernetes Pod, Service, Deployment khác nhau thế nào?', sampleAnswer: 'Pod: đơn vị chạy tối thiểu. Service: expose Pod. Deployment: quản lý replica, rolling update.' },
        { id: 's05', topic: 'Kafka', question: 'Kafka đảm bảo ordering trong partition thế nào?', sampleAnswer: 'Partition giữ message theo offset. Producer partition key → cùng key vào cùng partition → ordered.' },
        { id: 's06', topic: 'Performance', question: 'Caching strategy: Redis vs Local Cache? Cache aside vs Read through?', sampleAnswer: 'Redis: distributed, shared. Local: nhanh hơn, không đồng bộ. Cache aside: app tự manage cache miss.' },
        { id: 's07', topic: 'Design Patterns', question: 'Singleton pattern, thread-safe implementation trong Java?', sampleAnswer: 'enum (đơn giản nhất), Bill Pugh với inner static class, double-checked locking với volatile.' },
        { id: 's08', topic: 'Cloud', question: 'Thiết kế hệ thống upload file cho hàng triệu user.', sampleAnswer: 'S3 + CDN + presigned URL. API nhận metadata, trả URL. Client upload trực tiếp lên S3. Async processing.' },
      ]
    },
    {
      id: 'expert',
      range: '70 triệu +',
      min: 70, max: 200,
      label: 'Tech Lead / Architect',
      color: '#ef4444',
      icon: '🏗️',
      description: '8+ năm kinh nghiệm. Cần tầm nhìn kiến trúc và lãnh đạo kỹ thuật.',
      topics: [
        'System Design: scalability, availability, consistency trade-offs',
        'Distributed Systems: CAP theorem, consensus, distributed storage',
        'High Availability: failover, disaster recovery, SLI/SLO/SLA',
        'Tech Leadership: code review, mentoring, technical decision making',
        'System Design Patterns: CQRS, Event Sourcing, Circuit Breaker'
      ],
      questions: [
        { id: 'e01', topic: 'System Design', question: 'Thiết kế hệ thống URL shortener (như bit.ly).', sampleAnswer: 'API: POST /shorten, GET /{code}. DB: id (bigint) + code (unique). Hash: Base62 encoding. Cache: Redis cho hot URLs.' },
        { id: 'e02', topic: 'System Design', question: 'CAP theorem là gì? Chọn CP hay AP khi nào?', sampleAnswer: 'C: consistency, A: availability, P: partition tolerance — chỉ chọn 2/3. Banking: CP. Social: AP.' },
        { id: 'e03', topic: 'Distributed', question: 'Distributed transaction: 2PC vs Saga?', sampleAnswer: '2PC: coordinator + prepare/commit — blocking. Saga: async, bù trừ — eventual consistency.' },
        { id: 'e04', topic: 'System Design', question: 'Thiết kế real-time chat cho 10M concurrent users.', sampleAnswer: 'WebSocket gateway + Redis pub/sub. Horizontal scale gateway. Message queue cho offline. NoSQL cho history.' },
        { id: 'e05', topic: 'Leadership', question: 'Làm thế nào để đưa ra technical decision khi team disagree?', sampleAnswer: 'RFC document: context, options, trade-offs. Data-driven: POC/metrics. Cuối cùng: "disagree and commit".' },
        { id: 'e06', topic: 'High Availability', question: 'Tính availability? 99.9% vs 99.99% downtime khác nhau thế nào?', sampleAnswer: '99.9% = 8.7h/năm. 99.99% = 52 phút/năm. Chi phí tăng exponential với mỗi số 9.' },
        { id: 'e07', topic: 'System Design', question: 'CQRS và Event Sourcing là gì? Khi nào nên dùng?', sampleAnswer: 'CQRS: tách read/write model. Event Sourcing: lưu events thay vì state. Dùng cho audit log, complex workflows.' },
        { id: 'e08', topic: 'Distributed', question: 'Circuit Breaker pattern? Tại sao không chỉ dùng retry?', sampleAnswer: 'Circuit breaker: mở khi fail threshold, chờ recovery, nửa mở để test. Retry: không giải quyết dependency đang chết.' },
      ]
    }
  ],

  /** Lấy tier theo mức lương */
  getTier(salary) {
    for (const tier of this.tiers) {
      if (salary >= tier.min && salary <= tier.max) return tier;
    }
    return this.tiers[this.tiers.length - 1];
  },

  /** Lấy tier kế tiếp (để gợi ý target) */
  getNextTier(currentId) {
    const idx = this.tiers.findIndex(t => t.id === currentId);
    if (idx >= 0 && idx < this.tiers.length - 1) return this.tiers[idx + 1];
    return null;
  },

  /** Format salary range */
  formatSalary(min, max) {
    if (max >= 200) return `${min} triệu +`;
    return `${min} - ${max} triệu`;
  },

  /** Đếm tổng câu hỏi */
  getTotalQuestions() {
    return this.tiers.reduce((sum, t) => sum + t.questions.length, 0);
  }
};
