<template>
  <div class="page-root" style="--color-accent: #f472b6">
    <div class="container">
      <header class="ai-topbar">
        <div class="topbar-left">
          <h1>🤖 Học AI Agent</h1>
          <p>Agent — Tools — Token — Quota — AI at Edge</p>
        </div>
        <div class="topbar-right">
          <ForgeTimer />
          <button class="home-btn" @click="handleNavigate('/')">🏠</button>
        </div>
      </header>

      <nav class="ai-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="ai-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </nav>

      <!-- LEARN: Flashcards -->
      <section v-if="activeTab === 'learn'" class="ai-section active">
        <div class="ai-card-filter">
          <select v-model="filterCategory">
            <option value="all">📂 Tất cả chủ đề</option>
            <option value="agent">🤖 Agent Fundamentals</option>
            <option value="tools">🔧 Tools & MCP</option>
            <option value="token">🔢 Token & Context</option>
            <option value="quota">⏳ Quota & Cost</option>
            <option value="edge">📡 AI at Edge</option>
          </select>
        </div>

        <div class="ai-card" :class="{ flipped: isFlipped }" @click="isFlipped = !isFlipped">
          <div class="ai-card-inner">
            <div class="ai-card-front">
              <span class="ai-card-category">{{ currentCard?.category?.toUpperCase() }}</span>
              <div class="ai-card-en">{{ currentCard?.en }}</div>
              <div class="ai-card-vi">{{ currentCard?.vi }}</div>
              <div class="ai-card-def">{{ currentCard?.definition }}</div>
            </div>
            <div class="ai-card-back">
              <span class="ai-card-category">VÍ DỤ</span>
              <div class="ai-card-ex">{{ currentCard?.example }}</div>
              <p class="flip-hint">🔄 Click để xem lại mặt trước</p>
            </div>
          </div>
        </div>

        <p class="ai-card-counter">{{ currentIndex + 1 }} / {{ filteredCards.length }}</p>
        <div class="ai-card-controls">
          <button class="ai-card-btn" @click="prevCard">⬅️ Trước</button>
          <button class="ai-card-btn" @click="isFlipped = !isFlipped">🔄 Lật</button>
          <button class="ai-card-btn" @click="nextCard">Tiếp ➡️</button>
        </div>
      </section>

      <!-- QUIZ: Stub -->
      <section v-if="activeTab === 'quiz'" class="ai-section">
        <div class="quiz-placeholder">
          <h3>🎯 Quiz AI Agent</h3>
          <p>Tính năng quiz đang được phát triển. Hiện tại bạn có thể học flashcards và bài học.</p>
          <p class="quiz-categories">
            <span class="quiz-cat-tag" @click="activeTab = 'learn'">📚 Học flashcards</span>
            <span class="quiz-cat-tag" @click="activeTab = 'lessons'">📖 Bài học</span>
          </p>
        </div>
      </section>

      <!-- LESSONS -->
      <section v-if="activeTab === 'lessons'" class="ai-section">
        <div class="ai-lesson-layout">
          <aside class="ai-lesson-sidebar">
            <h3>📚 Bài học</h3>
            <ul class="ai-lesson-list">
              <li
                v-for="(lesson, i) in lessons"
                :key="i"
                class="ai-lesson-item"
                :class="{ active: selectedLesson === i }"
                @click="selectedLesson = i"
              >
                <span>{{ lesson.title?.replace(/^📄 /, '') }}</span>
                <span class="ai-lesson-stat">{{ getLessonProgress(i) }}</span>
              </li>
            </ul>
            <div class="ai-lesson-progress">
              <span>{{ lessonProgress.done }} / {{ lessonProgress.total }}</span>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: lessonProgress.percent + '%' }"></div>
              </div>
            </div>
          </aside>
          <div class="ai-lesson-content">
            <div class="ai-lesson-card">
              <h2>{{ lessons[selectedLesson]?.title }}</h2>
              <div class="lesson-body" v-html="renderedLesson"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import { aiAgentConcepts, aiAgentLessons } from '@legacy/js/data/ai-agent-data.js';
import ForgeTimer from '../components/ForgeTimer.vue';

const STORAGE_KEY = 'aiAgentChecklist';

function loadChecklist() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveChecklist(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function calcProgress(topics, checked) {
  let total = 0, done = 0;
  topics.forEach(topic => {
    if (topic.checklist) {
      topic.checklist.forEach(item => { total++; if (checked[item]) done++; });
    }
  });
  return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function calcTopicProgress(topic, checked) {
  const items = topic.checklist || [];
  const done = items.filter(item => checked[item]).length;
  return { done, total: items.length };
}

const tabs = [
  { id: 'learn', label: 'Học', icon: '📚' },
  { id: 'quiz', label: 'Thi', icon: '🎯' },
  { id: 'lessons', label: 'Bài học', icon: '📖' },
];

export default {
  name: 'AiAgentPage',
  components: { ForgeTimer },
  data() {
    return {
      tabs,
      activeTab: 'learn',
      filterCategory: 'all',
      currentIndex: 0,
      isFlipped: false,
      selectedLesson: 0,
      concepts: aiAgentConcepts,
      lessons: aiAgentLessons,
      checklist: {},
    };
  },
  computed: {
    filteredCards() {
      if (this.filterCategory === 'all') return this.concepts;
      return this.concepts.filter(c => c.category === this.filterCategory);
    },
    currentCard() {
      return this.filteredCards[this.currentIndex];
    },
    lessonProgress() {
      return calcProgress(this.lessons, this.checklist);
    },
    renderedLesson() {
      const topic = this.lessons[this.selectedLesson];
      if (!topic) return '';
      let html = topic.content ? this.renderMarkdown(topic.content) : '';
      if (topic.checklist && topic.checklist.length > 0) {
        html += '<h3>📝 Checklist</h3>';
        topic.checklist.forEach(item => {
          const isChecked = !!this.checklist[item];
          const safeItem = item.replace(/"/g, '&quot;');
          html += `
            <label class="checklist-item ${isChecked ? 'checked' : ''}">
              <input type="checkbox" ${isChecked ? 'checked' : ''} data-item="${safeItem}">
              <span>${item}</span>
            </label>`;
        });
      }
      return html;
    },
  },
  mounted() {
    this.checklist = loadChecklist();
    this.$nextTick(() => this.bindLessonEvents());
  },
  updated() {
    this.$nextTick(() => this.bindLessonEvents());
  },
  methods: {
    handleNavigate(path) {
      navigate(path);
    },
    filterCategory() {
      this.currentIndex = 0;
      this.isFlipped = false;
    },
    prevCard() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.isFlipped = false;
      }
    },
    nextCard() {
      if (this.currentIndex < this.filteredCards.length - 1) {
        this.currentIndex++;
        this.isFlipped = false;
      }
    },
    toggleLessonItem(item, checked) {
      this.checklist = { ...this.checklist, [item]: checked };
      saveChecklist(this.checklist);
    },
    getLessonProgress(idx) {
      const topic = this.lessons[idx];
      if (!topic) return '0/0';
      const { done, total } = calcTopicProgress(topic, this.checklist);
      return `${done}/${total}`;
    },
    bindLessonEvents() {
      document.querySelectorAll('.ai-lesson-content .checklist-item input').forEach(input => {
        if (input._bound) return;
        input._bound = true;
        input.addEventListener('change', () => {
          this.toggleLessonItem(input.dataset.item, input.checked);
          const label = input.closest('.checklist-item');
          if (label) label.classList.toggle('checked', input.checked);
        });
      });
    },
    renderMarkdown(text) {
      if (!text) return '';
      return text
        .replace(/^#{1,6} (.+)$/gm, (_, m) => `<h${m.length}>${m}</h${m.length}>`)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|p|u|o|l|b|c])(.+)$/gm, '<p>$1</p>')
        .replace(/<p><\/p>/g, '');
    },
  },
};
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  background: var(--color-bg, #0f0e17);
  color: var(--color-text, #e4e2f0);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.ai-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border, #2d2b44);
}

.topbar-left h1 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}

.topbar-left p {
  font-size: 0.8rem;
  color: var(--color-text2, #9d9bb5);
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.home-btn {
  background: white;
  color: var(--forge-purple, #764ba2);
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

.ai-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border, #2d2b44);
  padding-bottom: 0.5rem;
}

.ai-tab {
  background: none;
  border: none;
  color: var(--color-text2, #9d9bb5);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-tab:hover {
  color: var(--color-text);
  background: var(--color-surface, #1a1928);
}

.ai-tab.active {
  color: var(--color-accent, #f472b6);
  border-bottom: 2px solid var(--color-accent, #f472b6);
}

.ai-section {
  display: none;
}

.ai-section.active {
  display: block;
}

.ai-card-filter {
  margin-bottom: 1rem;
}

.ai-card-filter select {
  padding: 0.5rem 1rem;
  background: var(--color-surface, #1a1928);
  color: var(--color-text);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
}

.ai-card {
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 16px;
  padding: 2rem;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  perspective: 1000px;
  margin-bottom: 1rem;
  transition: transform 0.3s;
}

.ai-card-inner {
  width: 100%;
  text-align: center;
}

.ai-card-category {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-accent, #f472b6);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: rgba(244, 114, 182, 0.1);
  margin-bottom: 1rem;
}

.ai-card-en {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.ai-card-vi {
  font-size: 1.1rem;
  color: var(--color-accent, #f472b6);
  margin-bottom: 0.75rem;
}

.ai-card-def {
  font-size: 0.9rem;
  color: var(--color-text2, #9d9bb5);
  line-height: 1.6;
}

.ai-card-back .ai-card-ex {
  font-size: 0.9rem;
  color: var(--color-text2, #9d9bb5);
  line-height: 1.6;
}

.flip-hint {
  margin-top: 1rem;
  color: var(--color-text2, #94a3b8);
  font-size: 0.85rem;
}

.ai-card-counter {
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text2, #9d9bb5);
  margin-bottom: 1rem;
}

.ai-card-controls {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.ai-card-btn {
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  color: var(--color-text);
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.ai-card-btn:hover {
  border-color: var(--color-accent, #f472b6);
  color: var(--color-accent, #f472b6);
}

/* Quiz stub */
.quiz-placeholder {
  text-align: center;
  padding: 3rem 1rem;
  background: var(--color-surface, #1a1928);
  border-radius: 16px;
  border: 1px solid var(--color-border, #2d2b44);
}

.quiz-placeholder h3 {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.quiz-placeholder p {
  color: var(--color-text2, #9d9bb5);
  margin-bottom: 1rem;
}

.quiz-categories {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.quiz-cat-tag {
  background: var(--color-surface2, #22213a);
  border: 1px solid var(--color-border, #2d2b44);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quiz-cat-tag:hover {
  border-color: var(--color-accent, #f472b6);
  color: var(--color-accent, #f472b6);
}

/* Lessons */
.ai-lesson-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.5rem;
}

@media (max-width: 700px) {
  .ai-lesson-layout {
    grid-template-columns: 1fr;
  }
}

.ai-lesson-sidebar {
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 12px;
  padding: 1rem;
}

.ai-lesson-sidebar h3 {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--color-text2, #9d9bb5);
}

.ai-lesson-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ai-lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.82rem;
  cursor: pointer;
  color: var(--color-text2, #9d9bb5);
  transition: all 0.15s;
  margin-bottom: 0.25rem;
}

.ai-lesson-stat {
  font-size: 0.7rem;
  opacity: 0.7;
}

.ai-lesson-item:hover {
  background: var(--color-surface2, #22213a);
  color: var(--color-text);
}

.ai-lesson-item.active {
  background: rgba(244, 114, 182, 0.1);
  color: var(--color-accent, #f472b6);
}

.ai-lesson-progress {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--color-text2, #9d9bb5);
}

.progress-track {
  height: 4px;
  background: var(--color-surface2, #22213a);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.4rem;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent, #f472b6);
  border-radius: 2px;
  transition: width 0.3s;
}

.ai-lesson-card {
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 12px;
  padding: 1.5rem;
}

.ai-lesson-card h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--color-accent, #f472b6);
}

.lesson-body {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text2, #9d9bb5);
}

.lesson-body :deep(h1),
.lesson-body :deep(h2),
.lesson-body :deep(h3) {
  color: var(--color-text);
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.lesson-body :deep(strong) {
  color: var(--color-accent, #f472b6);
}

.lesson-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.lesson-body :deep(th),
.lesson-body :deep(td) {
  border: 1px solid var(--color-border, #2d2b44);
  padding: 0.5rem;
  text-align: left;
  font-size: 0.85rem;
}

.lesson-body :deep(th) {
  background: var(--color-surface2, #22213a);
}

.lesson-body :deep(.checklist-item) {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.4rem 0;
  cursor: pointer;
}

.lesson-body :deep(.checklist-item input) {
  margin-top: 0.15rem;
  accent-color: var(--color-accent, #f472b6);
  flex-shrink: 0;
}

.lesson-body :deep(.checklist-item.checked > span) {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
