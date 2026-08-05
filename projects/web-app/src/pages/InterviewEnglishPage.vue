<template>
  <div class="subpage">
    <div class="subpage-container">
      <header class="subpage-topbar">
        <div class="subpage-topbar-left">
          <span class="icon">🇬🇧</span>
          <div>
            <h1>English Interview Preparation</h1>
            <div class="subtitle">30-day lộ trình luyện tiếng Anh phỏng vấn Java Backend</div>
          </div>
        </div>
        <div class="subpage-topbar-right">
          <a class="subpage-back" href="#" @click.prevent="goHome">← Trang chủ</a>
          <a class="subpage-back" href="#" @click.prevent="navigate('/interview')">☕ Java Interview</a>
        </div>
      </header>

      <p class="page-desc">30-day lộ trình luyện tiếng Anh phỏng vấn Java Backend — mỗi ngày 30-45 phút. Kết hợp kỹ thuật + English.</p>

      <!-- Week 1 -->
      <div class="week-card">
        <h2>📅 Week 1: Java Core & OOP</h2>
        <div class="day-list">
          <div class="day-item"><strong>Day 1</strong>Introduce Yourself + OOP concepts</div>
          <div class="day-item"><strong>Day 2</strong>Encapsulation, Inheritance, Polymorphism</div>
          <div class="day-item"><strong>Day 3</strong>Abstract Class vs Interface</div>
          <div class="day-item"><strong>Day 4</strong>Collection Framework vocabulary</div>
          <div class="day-item"><strong>Day 5</strong>HashMap & equals/hashCode</div>
          <div class="day-item"><strong>Day 6</strong>Exception Handling in English</div>
          <div class="day-item"><strong>Day 7</strong>Review + Mock interview (Java Core)</div>
        </div>

        <h3>🎯 Key Vocabulary</h3>
        <div class="qa-block">
          <div class="q">Q: Can you explain OOP principles?</div>
          <div class="a">"Object-Oriented Programming has four main principles. First, Encapsulation means hiding internal data and only exposing public methods. Second, Inheritance allows a class to reuse fields and methods from a parent class. Third, Polymorphism enables a single method to behave differently based on the object. Fourth, Abstraction hides implementation details and shows only essential features."</div>
        </div>
        <div class="qa-block">
          <div class="q">Q: What is the difference between an Interface and an Abstract Class?</div>
          <div class="a">"An interface defines a contract — it only declares methods (and default methods since Java 8). A class can implement multiple interfaces. An abstract class can have both abstract and concrete methods, can hold state with fields, and a class can only extend one abstract class. Use interfaces for defining behavior, abstract classes for sharing common code."</div>
        </div>
      </div>

      <!-- Week 2 -->
      <div class="week-card">
        <h2>📅 Week 2: Spring Boot & Database</h2>
        <div class="day-list">
          <div class="day-item"><strong>Day 8</strong>Spring Boot, IoC, DI explained</div>
          <div class="day-item"><strong>Day 9</strong>REST API design in English</div>
          <div class="day-item"><strong>Day 10</strong>JPA & Hibernate relationships</div>
          <div class="day-item"><strong>Day 11</strong>SQL, JOIN, Index in English</div>
          <div class="day-item"><strong>Day 12</strong>Transaction & ACID properties</div>
          <div class="day-item"><strong>Day 13</strong>Security, JWT, Authentication</div>
          <div class="day-item"><strong>Day 14</strong>Review + Mock interview (Spring)</div>
        </div>

        <h3>🎯 Key Vocabulary</h3>
        <div class="qa-block">
          <div class="q">Q: What is Dependency Injection?</div>
          <div class="a">"Dependency Injection is a design pattern where dependencies are provided to an object rather than the object creating them itself. The Spring IoC container manages this. Constructor injection is the recommended approach because it makes dependencies explicit, enables immutability, and simplifies testing. Instead of using 'new' keyword, we let the framework inject the required beans."</div>
        </div>
        <div class="qa-block">
          <div class="q">Q: Can you explain the difference between PUT and PATCH?</div>
          <div class="a">"PUT is used to update an entire resource — you send the full object. PATCH is for partial updates — you only send the fields you want to change. PUT is idempotent, meaning calling it multiple times produces the same result. PATCH is generally not idempotent. For example, if a user has 10 fields, PUT requires all 10, but PATCH only needs the fields that changed."</div>
        </div>
      </div>

      <!-- Week 3 -->
      <div class="week-card">
        <h2>📅 Week 3: Advanced Topics</h2>
        <div class="day-list">
          <div class="day-item"><strong>Day 15</strong>Microservices & Kafka explained</div>
          <div class="day-item"><strong>Day 16</strong>Docker & CI/CD vocabulary</div>
          <div class="day-item"><strong>Day 17</strong>Cloud (AWS) basics in English</div>
          <div class="day-item"><strong>Day 18</strong>System Design: URL Shortener</div>
          <div class="day-item"><strong>Day 19</strong>N+1 problem & optimization</div>
          <div class="day-item"><strong>Day 20</strong>Design Patterns (Singleton, Strategy)</div>
          <div class="day-item"><strong>Day 21</strong>Review + Mock interview (System Design)</div>
        </div>

        <h3>🎯 Key Vocabulary</h3>
        <div class="qa-block">
          <div class="q">Q: What is the N+1 problem in Hibernate?</div>
          <div class="a">"The N+1 problem occurs when you fetch a list of N parent entities and each one triggers an additional query for its associated children. So you end up with 1 query for the parents plus N queries for the children. We can solve it using JOIN FETCH in JPQL, which loads everything in a single query. Another approach is enabling batch fetching or using DTO projections."</div>
        </div>
        <div class="qa-block">
          <div class="q">Q: How do microservices communicate?</div>
          <div class="a">"There are two main patterns: synchronous and asynchronous. For synchronous communication, services use REST or gRPC. For asynchronous, they use message brokers like Kafka or RabbitMQ. I prefer async communication for decoupling — for example, when an order is created, the order service emits an event to Kafka, and other services consume it independently."</div>
        </div>
      </div>

      <!-- Week 4 -->
      <div class="week-card">
        <h2>📅 Week 4: Mock Interview & Polish</h2>
        <div class="day-list">
          <div class="day-item"><strong>Day 22</strong>Behavioral questions (STAR method)</div>
          <div class="day-item"><strong>Day 23</strong>Project presentation in English</div>
          <div class="day-item"><strong>Day 24</strong>Common coding questions (English)</div>
          <div class="day-item"><strong>Day 25</strong>Full mock interview Round 1</div>
          <div class="day-item"><strong>Day 26</strong>Weak areas review</div>
          <div class="day-item"><strong>Day 27</strong>Full mock interview Round 2</div>
          <div class="day-item"><strong>Day 28-30</strong>Final review + Confidence building</div>
        </div>

        <h3>🎯 Key Vocabulary</h3>
        <div class="qa-block">
          <div class="q">Q: Tell me about a challenging project you worked on.</div>
          <div class="a">"In my recent project, I built an order management system using Spring Boot and microservices. The biggest challenge was handling the N+1 query problem and ensuring data consistency across services. I solved the N+1 problem by using JOIN FETCH and batch fetching. For consistency, I implemented the Saga pattern with Kafka for event-driven communication. The result was a scalable system that handles thousands of orders per day."</div>
        </div>
        <div class="qa-block">
          <div class="q">Q: What are your strengths and weaknesses?</div>
          <div class="a">"My main strength is my strong foundation in Java and Spring Boot. I write clean, testable code with proper exception handling and validation. I'm also good at debugging — I can analyze logs, use profilers, and optimize performance. My weakness is that I sometimes spend too much time on code perfection. I'm learning to balance quality with delivery speed by focusing on critical paths first."</div>
        </div>
      </div>

      <!-- English Skills -->
      <div class="week-card">
        <h2>📊 English Skills Assessment</h2>
        <div class="skill-grid">
          <div class="skill-card">
            <h5>🗣️ Speaking</h5>
            <p>Luyện nói technical terms, describe architecture, answer behavioral questions. Ghi âm và nghe lại.</p>
          </div>
          <div class="skill-card">
            <h5>👂 Listening</h5>
            <p>Xem tech talks (Spring Tips, Java Brains), podcast (Java Pub House). Note key terms.</p>
          </div>
          <div class="skill-card">
            <h5>📖 Reading</h5>
            <p>Đọc technical documentation (Spring docs, Baeldung), blog posts. Focus on sentence structure.</p>
          </div>
          <div class="skill-card">
            <h5>✍️ Writing</h5>
            <p>Viết technical answers, code comments, commit messages bằng tiếng Anh. Review grammar.</p>
          </div>
        </div>

        <h3>📝 Common Interview Questions — English Version</h3>
        <div class="qa-block">
          <div class="q">Q: Why did you choose Java?</div>
          <div class="a">"I chose Java because of its strong ecosystem, platform independence through the JVM, and excellent tooling. Java has a vast community, reliable frameworks like Spring Boot, and is widely used in enterprise environments. The combination of performance, scalability, and backward compatibility makes it a solid choice for building production-grade applications."</div>
        </div>
        <div class="qa-block">
          <div class="q">Q: Where do you see yourself in 5 years?</div>
          <div class="a">"In 5 years, I see myself as a senior backend engineer with deep expertise in distributed systems and cloud architecture. I want to mentor junior developers, contribute to system design decisions, and lead technical projects. I'm also interested in learning more about event-driven architecture and Kubernetes."</div>
        </div>
      </div>

      <!-- Resources -->
      <div class="week-card">
        <h2>📚 Resources</h2>
        <p><strong>Books:</strong> "Effective Java" (Joshua Bloch), "Spring in Action"</p>
        <p><strong>Websites:</strong> Baeldung, Medium, LeetCode (solving + explaining in English)</p>
        <p><strong>YouTube:</strong> Java Brains, Spring Tips, Amigoscode</p>
        <p><strong>Practice:</strong> Record yourself answering, join English tech communities, find a speaking partner</p>
        <hr>
        <p class="resources-note">📌 Tài liệu tham khảo từ: <code>30_day_english_plan_java_interview.pdf</code> và <code>English_Skill.docx</code></p>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

export default {
  name: 'InterviewEnglishPage',
  methods: {
    goHome() { navigate('/'); },
    navigate(path) { navigate(path); },
  },
};
</script>

<style scoped>
/* CSS variables inherited from main.css */
@import '@legacy/css/subpage.css';
@import '@legacy/css/forge-tokens.css';

.page-desc {
  color: var(--forge-text-secondary);
  margin-bottom: 2rem;
  font-size: var(--forge-text-base, 1rem);
  line-height: 1.6;
}

.week-card {
  background: var(--forge-bg-card);
  border: 1px solid var(--forge-border);
  border-radius: var(--forge-radius-lg);
  padding: var(--forge-space-2xl);
  margin-bottom: var(--forge-space-2xl);
}

.week-card h2 {
  color: var(--forge-ember);
  font-size: var(--forge-text-xl);
  font-weight: 700;
  margin-bottom: var(--forge-space-lg);
  padding-bottom: var(--forge-space-md);
  border-bottom: 1px solid var(--forge-border-light);
}

.week-card h3 {
  color: var(--forge-text);
  font-size: var(--forge-text-lg);
  font-weight: 600;
  margin: var(--forge-space-xl) 0 var(--forge-space-md);
}

.week-card p,
.week-card li {
  color: var(--forge-text-secondary);
  line-height: 1.7;
  font-size: var(--forge-text-base);
  margin-bottom: var(--forge-space-md);
}

.week-card ul {
  padding-left: 1.25rem;
  margin-bottom: var(--forge-space-lg);
}

.week-card code {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  background: rgba(249, 115, 22, 0.1);
  color: var(--forge-accent);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.day-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.day-item {
  background: var(--forge-bg-glass);
  border: 1px solid var(--forge-border-light);
  border-radius: var(--forge-radius-sm);
  padding: 0.6rem 0.8rem;
  font-size: var(--forge-text-sm);
  color: var(--forge-text-secondary);
}

.day-item strong {
  color: var(--forge-text);
  display: block;
  margin-bottom: 0.2rem;
  font-size: var(--forge-text-base);
}

.qa-block {
  background: var(--forge-bg-glass);
  border-left: 3px solid var(--forge-accent);
  border-radius: 0 var(--forge-radius-sm) var(--forge-radius-sm) 0;
  padding: var(--forge-space-lg);
  margin-bottom: var(--forge-space-lg);
}

.qa-block .q {
  font-weight: 700;
  color: var(--forge-text);
  margin-bottom: 0.3rem;
}

.qa-block .a {
  color: var(--forge-text-secondary);
  line-height: 1.6;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.skill-card {
  background: var(--forge-bg-glass);
  border: 1px solid var(--forge-border-light);
  border-radius: var(--forge-radius-sm);
  padding: var(--forge-space-lg);
}

.skill-card h5 {
  color: var(--forge-text);
  font-size: var(--forge-text-base);
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.skill-card p {
  font-size: var(--forge-text-sm);
  color: var(--forge-text-muted);
  margin: 0;
}

.resources-note {
  color: var(--forge-text-muted);
  font-size: var(--forge-text-sm);
}

@media (max-width: 600px) {
  .day-list { grid-template-columns: 1fr; }
  .skill-grid { grid-template-columns: 1fr; }
}
</style>
