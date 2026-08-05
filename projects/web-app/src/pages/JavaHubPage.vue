<template>
  <div class="java-hub-page">
    <div class="hub-container">
      <CTopbar
        title="☕ Java"
        back-label="← Trang chủ"
        @go-home="handleNavigate('/')"
      />

      <p class="hub-description">Học lập trình Java và ôn luyện phỏng vấn backend chuyên sâu.</p>

      <CGrid>
        <CCard
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
import CCard from '../components/CCard.vue';

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
  components: { CTopbar, CGrid, CCard },
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
/* Java Hub uses amber accent per AD-17 */
.java-hub-page {
  --forge-accent: var(--accent-java);
  background: var(--forge-bg);
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.hub-container {
  max-width: 960px;
  margin: 0 auto;
}

.hub-description {
  color: var(--forge-text2);
  margin-bottom: 2rem;
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
