<template>
  <div class="english-hub-page">
    <div class="hub-container">
      <CTopbar
        title="📖 Tiếng Anh"
        back-label="Trang chủ"
        @go-home="handleNavigate('/')"
      />

      <p class="hub-description">Từ vựng, ngữ pháp, đọc truyện, thi thử và games — tất cả trong một.</p>

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
    icon: '🎧',
    title: 'Podcast',
    description: 'Nghe podcast tiếng Anh',
    path: '/podcast',
  },
  {
    icon: '📝',
    title: 'Từ vựng & Idioms',
    description: '86 từ 14 chủ đề, 48 idioms & phrasal verbs, flashcard lật',
    path: '/english#vocab',
  },
  {
    icon: '⏰',
    title: 'Các thì & Practice',
    description: '12 thì, 31 câu sắp xếp từ',
    path: '/english#tense',
  },
  {
    icon: '📖',
    title: 'Đọc truyện',
    description: '10 câu chuyện truyền cảm hứng — Ronaldo, Messi, Steve Jobs...',
    path: '/english#story',
  },
  {
    icon: '🗣️',
    title: 'Luyện nói & Viết',
    description: '400+ câu ngắn — xem Việt, viết Anh, kiểm tra, thuộc lâu',
    path: '/sentence-practice',
  },
  {
    icon: '📝',
    title: 'Thi thử',
    description: 'Bài thi tổng hợp, chấm điểm, lưu sử',
    path: '/exam',
  },
  {
    icon: '📊',
    title: 'Skill Tracker',
    description: 'Theo dõi kỹ năng, XP, streak',
    path: '/skill-tracker',
  },
  {
    icon: '🃏',
    title: 'Memory Game',
    description: 'Ghép từ vựng với nghĩa',
    path: '/game-memory',
  },
  {
    icon: '🔀',
    title: 'Xếp chữ',
    description: 'Sắp xếp từ thành câu',
    path: '/game-scramble',
  },
  {
    icon: '⚡',
    title: 'Speed Quiz',
    description: 'Trắc nghiệm nhanh có thời gian',
    path: '/game-speedquiz',
  },
];

export default {
  name: 'EnglishHubPage',
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
/* English Hub uses green accent per AD-17 */
.english-hub-page {
  --forge-accent: var(--accent-english);
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
