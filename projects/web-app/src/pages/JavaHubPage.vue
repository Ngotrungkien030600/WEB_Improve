<template>
  <div class="java-hub-page">
    <div class="java-hub-container">
      <CTopbar title="☕ Java" back-label="← Trang chủ" @go-home="handleNavigate('/')" />

      <p class="hub-description">Học lập trình Java và ôn luyện phỏng vấn backend chuyên sâu.</p>

      <CGrid>
        <CHubCard
          v-for="card in cards"
          :key="card.title"
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
          :path="card.path"
          @navigate="handleNavigate"
        />
      </CGrid>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';
import CGrid from '../components/CGrid.vue';
import CHubCard from '../components/CHubCard.vue';

const cards = [
  {
    icon: '💻',
    title: 'Học Code',
    description: '10 bài học từ biến, OOP, collection đến SQL, JDBC, Git',
    path: '/code-learn',
  },
  {
    icon: '🍃',
    title: 'Spring Boot',
    description: 'IoC/DI, REST, JPA, Security, Actuator, Async, Testing, Microservices',
    path: '/java/spring-boot',
  },
  {
    icon: '⚔️',
    title: 'Thực chiến',
    description: '43 task thực tế khi đi làm — CRUD, Auth, thanh toán, fix bug, performance, microservices. Lọc theo độ khó',
    path: '/java/thuc-chien',
  },
  {
    icon: '⚙️',
    title: 'Backend Engineering',
    description: 'SQL, Kafka, Docker, K8s, CI/CD, System Design, Performance',
    path: '/java/backend',
  },
  {
    icon: '☕',
    title: 'Phỏng vấn Backend',
    description: '39 cheat sheet Java Core, Spring Boot, Microservices, System Design',
    path: '/interview',
  },
  {
    icon: '💰',
    title: 'Phỏng vấn theo lương',
    description: 'Chọn mức lương → xem câu hỏi phù hợp. AI tự bổ sung',
    path: '/salary-interview',
  },
  {
    icon: '🇬🇧',
    title: 'English Interview',
    description: '30-day lộ trình tiếng Anh cho Java Backend interview',
    path: '/interview-english',
  },
];

export default {
  name: 'JavaHubPage',
  components: { CTopbar, CGrid, CHubCard },
  data() {
    return { cards };
  },
  methods: {
    handleNavigate(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
/* Accent amber override — AD-17 */
.java-hub-page {
  --color-accent: #f59e0b;
  --color-surface: var(--color-surface-dark, #1a1928);
  --color-surface2: var(--color-surface-dark-2, #22213a);
  --color-border: var(--color-border-dark, #2d2b44);
  --color-text: var(--text-secondary-muted, #e4e2f0);
  --color-text2: var(--text-secondary-muted, #9d9bb5);
  --border-radius: 10px;

  background: var(--color-bg-surface-dark, #0f0e17);
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.java-hub-container {
  max-width: 960px;
  margin: 0 auto;
}

.hub-description {
  color: var(--color-text2);
  margin-bottom: 2rem;
  font-size: 0.95rem;
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
