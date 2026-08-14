<template>
  <div class="devops-hub-page">
    <div class="hub-container">
      <CTopbar
        title="🐳 DevOps"
        back-label="Trang chủ"
        @go-home="handleNavigate('/')"
      />

      <p class="hub-description">
        Lộ trình DevOps đầy đủ — từ Docker, Kubernetes, CI/CD, Terraform đến AWS và Monitoring. Song ngữ EN-VI, có code mẫu, best practices và câu hỏi phỏng vấn.
      </p>

      <CGrid>
        <CHubCard
          v-for="topic in devopsTopics"
          :key="topic.id"
          :icon="topicIcon(topic.id)"
          :title="cleanTitle(topic.title)"
          :description="topic.description"
          :tags="[topic.sections.length + ' bài']"
          :path="`/devops/${topic.id}`"
          @navigate="handleNavigate"
        />
      </CGrid>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import CGrid from '../components/CGrid.vue';
import CHubCard from '../components/CHubCard.vue';
import { navigate } from '../utils/navigate.js';
import { devopsTopics } from '../data/devops-sections.js';

const TOPIC_ICONS = {
  docker: '🐳',
  kubernetes: '☸️',
  cicd: '🔄',
  terraform: '🏗️',
  monitoring: '📊',
  aws: '☁️',
};

export default {
  name: 'DevopsHubPage',
  components: { CTopbar, CGrid, CHubCard },
  data() {
    return { devopsTopics };
  },
  methods: {
    handleNavigate(path) {
      navigate(path);
    },
    topicIcon(id) {
      return TOPIC_ICONS[id] || '🐳';
    },
    cleanTitle(title) {
      return title.replace(/^[^\s]+\s/, '');
    },
  },
};
</script>

<style scoped>
.devops-hub-page {
  --forge-accent: #2496ed;
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
