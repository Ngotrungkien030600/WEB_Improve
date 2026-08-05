<template>
  <div class="learning-paths-page" style="--color-accent: #7c5cfc">
    <CTopbar
      title="🗺️ Lộ trình học"
      back-label="← Trang chủ"
      @go-home="handleNavigate('/')"
    />

    <div class="page">
      <p class="desc">Lộ trình học có mục tiêu rõ ràng từ cơ bản đến nâng cao.</p>

      <div
        v-for="path in paths"
        :key="path.title"
        class="path-card"
      >
        <h2>{{ path.icon }} {{ path.title }}</h2>
        <p class="meta">{{ path.duration }} • {{ path.level }}</p>
        <p class="desc-txt">{{ path.description }}</p>

        <div
          v-for="(milestone, i) in path.milestones"
          :key="i"
          class="milestone"
        >
          <div class="num">{{ i + 1 }}</div>
          <div class="info">
            <strong>{{ milestone.title }}</strong>
            <p>{{ milestone.desc }}</p>
          </div>
        </div>

        <a class="btn-start" @click="handleNavigate(path.link)">Bắt đầu →</a>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';

const paths = [
  {
    title: 'Tiếng Anh Cơ Bản',
    icon: '🌱',
    duration: '14 ngày',
    level: 'Người mới bắt đầu',
    description: 'Xây dựng nền tảng vững chắc với từ vựng và ngữ pháp cơ bản.',
    link: '/english',
    milestones: [
      { title: 'Chào hỏi & Giới thiệu', desc: '20+ từ greetings, giới thiệu bản thân, thì Present Simple' },
      { title: 'Sinh hoạt hàng ngày', desc: '25+ từ daily routine, adverbs of frequency' },
      { title: 'Ẩm thực & Mua sắm', desc: '25+ từ food/shopping, some/any' },
      { title: 'Thời tiết & Cảm xúc', desc: '20+ từ weather/emotion, It is + adjective' },
    ],
  },
  {
    title: 'Tiếng Anh Trung Cấp',
    icon: '📈',
    duration: '21 ngày',
    level: 'Đã có nền tảng',
    description: 'Mở rộng vốn từ và tự tin giao tiếp trong du lịch, công sở.',
    link: '/english',
    milestones: [
      { title: 'Du lịch & Định hướng', desc: '20+ từ travel, Past Simple, Can/Could' },
      { title: 'Sức khỏe & Trường học', desc: '25+ từ health/school, Present Perfect' },
      { title: 'Công sở & Công nghệ', desc: '25+ từ work/technology, Present Perfect Continuous' },
      { title: 'Ý kiến & Thảo luận', desc: '20+ từ opinion, Conditionals, Passive Voice' },
    ],
  },
  {
    title: 'Java Cơ Bản',
    icon: '☕',
    duration: '14 ngày',
    level: 'Người mới bắt đầu',
    description: 'Nắm vững nền tảng Java: biến, OOP, collections.',
    link: '/java/hub',
    milestones: [
      { title: 'Biến & Kiểu dữ liệu', desc: 'Primitive vs Reference, ép kiểu, final' },
      { title: 'Điều kiện & Vòng lặp', desc: 'if-else, switch-case, for, while' },
      { title: 'Mảng & Chuỗi', desc: 'Array, String, StringBuilder' },
      { title: 'OOP', desc: '4 tính chất OOP, Interface vs Abstract' },
    ],
  },
  {
    title: 'AI/ML Cơ Bản',
    icon: '🤖',
    duration: '14 ngày',
    level: 'Người mới bắt đầu',
    description: 'Nắm vững concepts Machine Learning cốt lõi.',
    link: '/ai',
    milestones: [
      { title: 'ML Concepts', desc: 'Supervised/Unsupervised/Reinforcement Learning' },
      { title: 'Deep Learning', desc: 'Neural Network, Backpropagation, CNN, Transformer' },
      { title: 'NLP cơ bản', desc: 'Tokenization, Embedding, BERT, GPT' },
      { title: 'Dự án thực hành', desc: 'Linear Regression, RAG Chatbot' },
    ],
  },
];

export default {
  name: 'LearningPathsPage',
  components: { CTopbar },

  data() {
    return { paths };
  },

  methods: {
    handleNavigate(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
@import '@legacy/css/variables.css';
@import '@legacy/css/forge-tokens.css';

.learning-paths-page {
  background: var(--color-bg);
  min-height: 100vh;
}

.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem 2.5rem;
}

.desc {
  color: var(--color-text2);
  margin-bottom: 2rem;
  font-size: var(--font-base);
}

.path-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
  transition: border-color 0.2s;
}

.path-card:hover {
  border-color: var(--color-accent);
}

.path-card h2 {
  font-size: var(--font-lg);
  font-weight: 700;
  margin-bottom: var(--space-1);
}

.meta {
  font-size: var(--font-xs);
  color: var(--color-text2);
  margin-bottom: var(--space-2);
}

.desc-txt {
  font-size: var(--font-sm);
  color: var(--color-text2);
  line-height: 1.6;
  margin-bottom: var(--space-4);
}

.milestone {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}

.milestone:last-of-type {
  border-bottom: none;
}

.num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-surface2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-xs);
  font-weight: 700;
  color: var(--color-accent);
  flex-shrink: 0;
}

.info {
  flex: 1;
}

.info strong {
  font-size: var(--font-sm);
  font-weight: 600;
  display: block;
  margin-bottom: 2px;
}

.info p {
  font-size: var(--font-xs);
  color: var(--color-text2);
  margin: 0;
}

.btn-start {
  display: inline-block;
  margin-top: var(--space-3);
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-sm);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-start:hover {
  opacity: 0.9;
}
</style>
