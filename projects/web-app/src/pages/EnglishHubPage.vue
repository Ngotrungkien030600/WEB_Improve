<template>
  <div class="page-root" style="--color-accent: #34d399">
    <div class="container">
      <CTopbar
        title="📖 Tiếng Anh"
        back-label="← Trang chủ"
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
    icon: '📝',
    title: 'Từ vựng & Idioms',
    description: '209 từ 14 chủ đề, 70+ idioms, flashcard lật',
    path: '/pages/english.html#vocab',
  },
  {
    icon: '⏰',
    title: 'Các thì & Practice',
    description: '12 thì, 16+ câu sắp xếp từ',
    path: '/pages/english.html#tense',
  },
  {
    icon: '📖',
    title: 'Đọc truyện',
    description: '10 câu chuyện truyền cảm hứng — Ronaldo, Messi, Steve Jobs...',
    path: '/pages/english.html#story',
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
