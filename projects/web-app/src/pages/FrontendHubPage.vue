<template>
  <div class="frontend-hub-page">
    <div class="hub-container">
      <CTopbar
        title="🌐 Frontend"
        back-label="← Trang chủ"
        @go-home="handleNavigate('/')"
      />

      <p class="hub-description">Kiến thức frontend toàn diện — từ HTML/CSS cơ bản đến React, Vue, Angular. Có phỏng vấn UI/UX riêng.</p>

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
    icon: '🎨',
    title: 'HTML & CSS',
    description: 'HTML5 semantic, CSS Flexbox/Grid, Animation, Variables, BEM, Responsive, 25+ kỹ thuật',
    path: '/frontend/html-css',
  },
  {
    icon: '⚡',
    title: 'JavaScript',
    description: 'ES6+, DOM, Async/Await, Closure, Promise, Event Loop, Web API, Module, TypeScript cơ bản',
    path: '/frontend/javascript',
  },
  {
    icon: '⚛️',
    title: 'React / Vue / Angular',
    description: 'Component lifecycle, Hooks, State management, Router, Composition API, Directive, Signals',
    path: '/frontend/frameworks',
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    description: 'Media Queries, Container Queries, Mobile-first, Fluid typography, Breakpoint system',
    path: '/frontend/responsive',
  },
  {
    icon: '💼',
    title: 'Phỏng vấn UI/FE',
    description: 'Câu hỏi phỏng vấn Frontend theo cấp độ: Junior, Middle, Senior — kèm câu trả lời mẫu',
    path: '/frontend/ui-interview',
  },
];

export default {
  name: 'FrontendHubPage',
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
/* Frontend Hub uses blue accent per AD-17 */
.frontend-hub-page {
  --forge-accent: var(--accent-frontend);
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
