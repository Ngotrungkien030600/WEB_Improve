<template>
  <div class="java-hub-page">
    <div class="hub-container">
      <!-- Header -->
      <header class="hub-header">
        <div class="header-content">
          <button class="back-btn" @click="handleNavigate('/')">
            <span class="back-icon">←</span>
            <span>Trang chủ</span>
          </button>
          <h1 class="hub-title">
            <span class="title-icon">☕</span>
            <span>Java</span>
          </h1>
        </div>
        <p class="hub-description">
          Học lập trình Java và ôn luyện phỏng vấn backend chuyên sâu.
        </p>
      </header>

      <!-- Search & Filter -->
      <div class="hub-controls">
        <CSearch
          v-model="searchQuery"
          placeholder="Tìm kiếm bài học, chủ đề..."
          @search="handleSearch"
        />
        <CFilter
          v-model="activeCategory"
          :options="categoryOptions"
          @change="handleCategoryChange"
        />
      </div>

      <!-- Stats Overview -->
      <div class="stats-overview">
        <div class="stat-card">
          <span class="stat-icon">📚</span>
          <div class="stat-info">
            <span class="stat-value">{{ cards.length }}</span>
            <span class="stat-label">Bài học</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⏱️</span>
          <div class="stat-info">
            <span class="stat-value">~20h</span>
            <span class="stat-label">Thời lượng</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🎯</span>
          <div class="stat-info">
            <span class="stat-value">39+</span>
            <span class="stat-label">Cheat sheets</span>
          </div>
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="cards-grid">
        <TransitionGroup name="card-list">
          <CHubCard
            v-for="card in filteredCards"
            :key="card.title"
            :icon="card.icon"
            :title="card.title"
            :description="card.description"
            :badge="card.badge"
            :tags="card.tags"
            :path="card.path"
            @navigate="handleNavigate"
          />
        </TransitionGroup>
      </div>

      <!-- Empty State -->
      <CEmpty
        v-if="filteredCards.length === 0"
        icon="🔍"
        title="Không tìm thấy"
        :description="`Không có kết quả cho '${searchQuery}'`"
      >
        <template #action>
          <button class="reset-btn" @click="resetFilters">Xóa bộ lọc</button>
        </template>
      </CEmpty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { navigate } from '../utils/navigate.js';
import CSearch from '../components/CSearch.vue';
import CFilter from '../components/CFilter.vue';
import CHubCard from '../components/CHubCard.vue';
import CEmpty from '../components/CEmpty.vue';

const searchQuery = ref('');
const activeCategory = ref('all');

const allCards = [
  {
    icon: '💻',
    title: 'Học Code',
    description: '10 bài học từ biến, OOP, collection đến SQL, JDBC, Git',
    badge: '10 bài',
    tags: ['Java Core', 'OOP', 'SQL', 'Git'],
    category: 'learn',
    path: '/code-learn',
  },
  {
    icon: '🍃',
    title: 'Spring Boot',
    description: 'IoC/DI, REST, JPA, Security, Actuator, Async, Testing, Microservices',
    badge: '8 sections',
    tags: ['Spring', 'REST API', 'JPA', 'Security'],
    category: 'framework',
    path: '/java/spring-boot',
  },
  {
    icon: '⚔️',
    title: 'Thực chiến',
    description: '43 task thực tế khi đi làm — CRUD, Auth, thanh toán, fix bug, performance',
    badge: '43 tasks',
    tags: ['Backend', 'CRUD', 'Auth', 'Performance'],
    category: 'practice',
    path: '/java/thuc-chien',
  },
  {
    icon: '⚙️',
    title: 'Backend Engineering',
    description: 'SQL, Kafka, Docker, K8s, CI/CD, System Design, Performance',
    badge: '10 sections',
    tags: ['Database', 'Docker', 'K8s', 'CI/CD'],
    category: 'backend',
    path: '/java/backend',
  },
  {
    icon: '☕',
    title: 'Phỏng vấn Backend',
    description: '39 cheat sheet Java Core, Spring Boot, Microservices, System Design',
    badge: '39 sheets',
    tags: ['Interview', 'Java', 'Spring', 'Microservices'],
    category: 'interview',
    path: '/interview',
  },
  {
    icon: '💰',
    title: 'Phỏng vấn theo lương',
    description: 'Chọn mức lương → xem câu hỏi phù hợp. AI tự bổ sung',
    badge: 'AI-powered',
    tags: ['Salary', 'Interview', 'AI'],
    category: 'interview',
    path: '/salary-interview',
  },
  {
    icon: '🇬🇧',
    title: 'English Interview',
    description: '30-day lộ trình tiếng Anh cho Java Backend interview',
    badge: '30 days',
    tags: ['English', 'Interview', '30-day'],
    category: 'english',
    path: '/interview-english',
  },
];

const categoryOptions = [
  { value: 'all', label: 'Tất cả', icon: '📚' },
  { value: 'learn', label: 'Học Code', icon: '💻' },
  { value: 'framework', label: 'Framework', icon: '🍃' },
  { value: 'practice', label: 'Thực chiến', icon: '⚔️' },
  { value: 'backend', label: 'Backend', icon: '⚙️' },
  { value: 'interview', label: 'Phỏng vấn', icon: '🎯' },
  { value: 'english', label: 'English', icon: '🇬🇧' },
];

const cards = ref(allCards);

const filteredCards = computed(() => {
  let result = cards.value;

  // Filter by category
  if (activeCategory.value !== 'all') {
    result = result.filter(card => card.category === activeCategory.value);
  }

  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(card =>
      card.title.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query) ||
      card.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return result;
});

const handleNavigate = (path) => {
  navigate(path);
};

const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleCategoryChange = (category) => {
  activeCategory.value = category;
};

const resetFilters = () => {
  searchQuery.value = '';
  activeCategory.value = 'all';
};
</script>

<style scoped>
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

/* Header */
.hub-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  color: var(--forge-text2);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  background: var(--forge-surface-hover);
  color: var(--forge-text);
  border-color: var(--forge-accent, var(--forge-fire));
}

.back-icon {
  font-size: 1rem;
}

.hub-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 800;
  color: var(--forge-text);
  margin: 0;
  letter-spacing: -0.02em;
}

.title-icon {
  font-size: 2.5rem;
}

.hub-description {
  color: var(--forge-text2);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

/* Controls */
.hub-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  transition: all var(--transition-fast);
}

.stat-card:hover {
  background: var(--forge-glass-hover);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--forge-text);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--forge-text3);
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

/* Card list transitions */
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s ease;
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.card-list-move {
  transition: transform 0.3s ease;
}

/* Empty state */
.reset-btn {
  padding: 0.75rem 1.5rem;
  background: var(--forge-fire);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reset-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .java-hub-page {
    padding: 1.5rem 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .hub-title {
    font-size: 1.5rem;
  }

  .title-icon {
    font-size: 2rem;
  }

  .stats-overview {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stat-card,
  .back-btn,
  .reset-btn,
  .card-list-enter-active,
  .card-list-leave-active {
    animation: none;
    transition: none;
  }
}
</style>
