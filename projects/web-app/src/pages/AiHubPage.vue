<template>
  <div class="ai-hub-page" style="--color-accent: #764ba2">
    <div class="page">
      <div class="topbar">
        <div class="topbar-left">
          <h1>🤖 Học AI</h1>
          <p>Kiến thức AI/ML — Thi trắc nghiệm — Phỏng vấn</p>
        </div>
        <a class="back-btn" href="#" @click.prevent="handleBack">🏠</a>
      </div>

      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >{{ tab.icon }} {{ tab.label }}</button>
      </div>

      <!-- ===== LEARN ===== -->
      <section v-if="activeTab === 'learn'" class="section">
        <div class="filter-row">
          <select v-model="selectedCategory" @change="filterCards">
            <option value="all">📂 Tất cả chủ đề</option>
            <option value="ml">🤖 Machine Learning</option>
            <option value="dl">🧠 Deep Learning</option>
            <option value="nlp">🗣️ NLP</option>
            <option value="cv">👁️ Computer Vision</option>
            <option value="genai">✨ GenAI & LLM</option>
          </select>
        </div>

        <div class="flashcard" :class="{ flipped: isFlipped }" @click="flipCard">
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <span class="flashcard-category">{{ currentCard?.category?.toUpperCase() }}</span>
              <div class="flashcard-en">{{ currentCard?.en }}</div>
              <div class="flashcard-vi">{{ currentCard?.vi }}</div>
              <div class="flashcard-def">{{ currentCard?.definition }}</div>
            </div>
            <div class="flashcard-back">
              <span class="flashcard-category">VÍ DỤ</span>
              <div class="flashcard-ex">{{ currentCard?.example }}</div>
              <p class="flip-hint">🔄 Click để xem lại mặt trước</p>
            </div>
          </div>
        </div>

        <p class="flashcard-counter">{{ filteredCards.length > 0 ? currentIndex + 1 : 0 }} / {{ filteredCards.length }}</p>

        <div class="flashcard-controls">
          <button class="flashcard-btn" @click="prevCard" :disabled="filteredCards.length === 0">⬅️ Trước</button>
          <button class="flashcard-btn" @click="flipCard" :disabled="filteredCards.length === 0">🔄 Lật</button>
          <button class="flashcard-btn" @click="nextCard" :disabled="filteredCards.length === 0">Tiếp ➡️</button>
        </div>
      </section>

      <!-- ===== QUIZ ===== -->
      <section v-if="activeTab === 'quiz'" class="section">
        <div class="quiz-config" v-if="!quizActive">
          <div class="quiz-type-tabs">
            <button
              v-for="type in quizTypes"
              :key="type"
              class="quiz-type-tab"
              :class="{ active: selectedQuizType === type }"
              @click="selectedQuizType = type"
            >{{ typeLabels[type] }}</button>
          </div>
          <select v-model="quizCount">
            <option :value="5">5 câu</option>
            <option :value="10">10 câu</option>
            <option :value="15">15 câu</option>
          </select>
          <select v-model="quizTime">
            <option :value="10">10s</option>
            <option :value="15">15s</option>
            <option :value="20">20s</option>
            <option :value="30">30s</option>
          </select>
          <button class="quiz-start-btn" @click="startQuiz">▶️ Bắt đầu</button>
        </div>

        <div class="quiz-timer-bar" :class="{ active: quizActive }">
          <div class="quiz-timer-fill" :style="{ width: timerBarWidth + '%' }"></div>
        </div>
        <p class="quiz-timer-text" :class="{ active: quizActive }">{{ timerBarWidth > 0 ? timerBarWidth + '%' : '--' }}</p>

        <div class="quiz-card" v-if="quizActive && currentQuestion">
          <span class="quiz-badge">{{ typeLabels[selectedQuizType] }}</span>
          <span class="quiz-progress">Câu {{ quizIndex + 1 }} / {{ quizQuestions.length }}</span>
          <h2 class="quiz-question">{{ currentQuestion.question }}</h2>
          <div class="quiz-options">
            <button
              v-for="(option, idx) in currentQuestion.options"
              :key="idx"
              class="quiz-option"
              :class="getOptionClass(idx)"
              :disabled="quizAnswered"
              @click="selectAnswer(idx)"
            >{{ option }}</button>
          </div>
          <div class="quiz-feedback" :class="[feedbackClass, { show: quizAnswered }]">
            {{ feedbackText }}
          </div>
          <button class="quiz-next" v-if="quizAnswered" @click="nextQuestion">
            {{ quizIndex < quizQuestions.length - 1 ? 'Câu tiếp theo ➡️' : 'Xem kết quả' }}
          </button>
        </div>

        <div class="quiz-results" v-if="quizFinished">
          <div class="quiz-stats">
            <div><span class="stat-value">{{ quizScore }}</span><span class="stat-label">Đúng</span></div>
            <div><span class="stat-value">{{ quizQuestions.length }}</span><span class="stat-label">Tổng</span></div>
            <div><span class="stat-value">{{ quizPct }}%</span><span class="stat-label">Tỉ lệ</span></div>
            <div><span class="stat-value">{{ quizLevel }}</span><span class="stat-label">Trình độ</span></div>
          </div>
          <button class="quiz-start-btn" @click="resetQuiz">🔄 Thi lại</button>
        </div>
      </section>

      <!-- ===== INTERVIEW ===== -->
      <section v-if="activeTab === 'interview'" class="section">
        <div class="interview-layout">
          <aside class="interview-sidebar">
            <p class="interview-progress">Tiến độ: {{ completedCount }} / {{ totalCount }}</p>
            <ul class="interview-list">
              <li
                v-for="(topic, idx) in interviewTopics"
                :key="idx"
                class="interview-item"
                :class="{ active: selectedTopic === idx }"
                @click="selectedTopic = idx"
              >
                <span>{{ topic.title }}</span>
                <span class="interview-item-stat">
                  {{ completedTopics[idx] ? '✅' : `${topic.checklist.length}` }}
                </span>
              </li>
            </ul>
          </aside>
          <div class="interview-content" v-if="selectedTopic !== null">
            <h2>{{ interviewTopics[selectedTopic].title }}</h2>
            <ul class="checklist">
              <li
                v-for="(item, i) in interviewTopics[selectedTopic].checklist"
                :key="i"
                class="checklist-item"
                :class="{ checked: isTopicItemChecked(selectedTopic, i) }"
                @click="toggleTopicItem(selectedTopic, i)"
              >
                <input type="checkbox" :checked="isTopicItemChecked(selectedTopic, i)" readonly />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          <div class="interview-content" v-else>
            <h2>Chọn chủ đề</h2>
            <p>Click vào một chủ đề bên trái để xem câu hỏi.</p>
          </div>
        </div>
      </section>

      <!-- ===== PROJECTS ===== -->
      <section v-if="activeTab === 'projects'" class="section">
        <div class="projects-grid" v-if="!selectedProject">
          <div
            v-for="project in projects"
            :key="project.id"
            class="project-card"
            @click="selectedProject = project"
          >
            <h3 class="project-title">{{ project.title }}</h3>
            <div class="project-meta">
              <span class="project-level" :class="getLevelClass(project.level)">{{ project.level }}</span>
              <span>{{ project.tech }}</span>
              <span>{{ project.time }}</span>
            </div>
            <p class="project-desc">{{ project.desc }}</p>
          </div>
        </div>

        <div class="project-detail" v-if="selectedProject">
          <button class="project-back" @click="selectedProject = null">← Quay lại danh sách</button>
          <h2>{{ selectedProject.title }}</h2>
          <div class="project-meta">
            <span class="project-level" :class="getLevelClass(selectedProject.level)">{{ selectedProject.level }}</span>
            <span>{{ selectedProject.tech }}</span>
            <span>{{ selectedProject.time }}</span>
          </div>
          <p class="project-desc">{{ selectedProject.desc }}</p>
          <h3>Các bước thực hiện</h3>
          <ol class="project-steps">
            <li v-for="(step, i) in selectedProject.steps" :key="i">{{ step }}</li>
          </ol>
          <h3>Mã nguồn mẫu</h3>
          <pre class="project-code"><code>{{ selectedProject.code }}</code></pre>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import { aiConcepts, aiQuizData, aiInterviewTopics, aiProjects } from '@legacy/js/data/ai-data.js';

const STORAGE_KEY = 'skillforge_ai_interview';
const CHECKLIST_KEY = 'aiChecklist';

export default {
  name: 'AiHubPage',

  data() {
    return {
      tabs: [
        { id: 'learn', label: 'Học', icon: '📚' },
        { id: 'quiz', label: 'Thi', icon: '🎯' },
        { id: 'interview', label: 'Phỏng vấn', icon: '💼' },
        { id: 'projects', label: 'Làm Project', icon: '🛠️' },
      ],
      activeTab: 'learn',

      // Learn tab
      selectedCategory: 'all',
      filteredCards: [],
      currentIndex: 0,
      isFlipped: false,

      // Quiz tab
      quizTypes: ['general', 'algorithms', 'frameworks'],
      typeLabels: {
        general: '📝 Kiến thức chung',
        algorithms: '🔬 Thuật toán',
        frameworks: '🛠️ Framework',
      },
      selectedQuizType: 'general',
      quizCount: 10,
      quizTime: 15,
      quizActive: false,
      quizQuestions: [],
      quizIndex: 0,
      quizScore: 0,
      quizAnswered: false,
      selectedAnswer: null,
      quizFinished: false,
      timerBarWidth: 100,
      timerInterval: null,

      // Interview tab
      interviewTopics: aiInterviewTopics,
      selectedTopic: null,
      interviewProgress: {},
      checklist: {},

      // Projects tab
      projects: aiProjects,
      selectedProject: null,
    };
  },

  computed: {
    currentCard() {
      return this.filteredCards[this.currentIndex] || null;
    },
    currentQuestion() {
      return this.quizQuestions[this.quizIndex] || null;
    },
    quizPct() {
      if (this.quizQuestions.length === 0) return 0;
      return Math.round((this.quizScore / this.quizQuestions.length) * 100);
    },
    quizLevel() {
      const pct = this.quizPct;
      if (pct >= 90) return '🌟';
      if (pct >= 75) return '✅';
      if (pct >= 50) return '⚠️';
      return '❌';
    },
    feedbackClass() {
      if (!this.quizAnswered) return '';
      return this.selectedAnswer === this.currentQuestion.correct ? 'correct' : 'wrong';
    },
    feedbackText() {
      if (!this.quizAnswered) return '';
      return this.selectedAnswer === this.currentQuestion.correct ? '✅ Chính xác!' : '❌ Chưa đúng';
    },
    completedCount() {
      return Object.values(this.interviewProgress).filter(v => v).length;
    },
    totalCount() {
      return this.interviewTopics.reduce((sum, t) => sum + t.checklist.length, 0);
    },
    completedTopics() {
      const result = {};
      this.interviewTopics.forEach((_, idx) => {
        const topicKey = `topic_${idx}`;
        const checked = this.interviewProgress[topicKey] || [];
        result[idx] = checked.length === this.interviewTopics[idx].checklist.length;
      });
      return result;
    },
  },

  mounted() {
    this.filterCards();
    this.loadInterviewProgress();
    this.loadChecklist();
  },

  beforeUnmount() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  },

  methods: {
    handleBack() {
      navigate('/');
    },

    // ===== CHECKLIST (migrated from Legacy aiChecklist) =====
    loadChecklist() {
      try {
        const raw = localStorage.getItem(CHECKLIST_KEY);
        if (raw) {
          this.checklist = JSON.parse(raw);
        }
      } catch (e) {
        this.checklist = {};
      }
    },
    saveChecklist() {
      try {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(this.checklist));
      } catch (e) {}
    },
    toggleChecklistItem(item, checked) {
      this.checklist[item] = checked;
      this.saveChecklist();
    },

    // ===== LEARN =====
    filterCards() {
      if (this.selectedCategory === 'all') {
        this.filteredCards = aiConcepts;
      } else {
        this.filteredCards = aiConcepts.filter(c => c.category === this.selectedCategory);
      }
      this.currentIndex = 0;
      this.isFlipped = false;
    },

    flipCard() {
      if (this.filteredCards.length === 0) return;
      this.isFlipped = !this.isFlipped;
    },

    prevCard() {
      if (this.filteredCards.length === 0) return;
      this.isFlipped = false;
      this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.filteredCards.length - 1;
    },

    nextCard() {
      if (this.filteredCards.length === 0) return;
      this.isFlipped = false;
      this.currentIndex = (this.currentIndex + 1) % this.filteredCards.length;
    },

    // ===== QUIZ =====
    startQuiz() {
      const pool = aiQuizData[this.selectedQuizType] || [];
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      this.quizQuestions = shuffled.slice(0, this.quizCount);
      this.quizIndex = 0;
      this.quizScore = 0;
      this.quizAnswered = false;
      this.selectedAnswer = null;
      this.quizFinished = false;
      this.quizActive = true;
      this.startTimer();
    },

    startTimer() {
      this.timerBarWidth = 100;
      if (this.timerInterval) clearInterval(this.timerInterval);

      const duration = this.quizTime * 1000;
      const interval = 100;
      const decrement = (100 / (duration / interval));

      this.timerInterval = setInterval(() => {
        this.timerBarWidth -= decrement;
        if (this.timerBarWidth <= 0) {
          this.timerBarWidth = 0;
          clearInterval(this.timerInterval);
          if (!this.quizAnswered) {
            this.quizAnswered = true;
            this.selectedAnswer = -1;
          }
        }
      }, interval);
    },

    selectAnswer(idx) {
      if (this.quizAnswered) return;
      this.quizAnswered = true;
      this.selectedAnswer = idx;
      clearInterval(this.timerInterval);

      if (idx === this.currentQuestion.correct) {
        this.quizScore++;
      }
    },

    nextQuestion() {
      if (this.quizIndex < this.quizQuestions.length - 1) {
        this.quizIndex++;
        this.quizAnswered = false;
        this.selectedAnswer = null;
        this.startTimer();
      } else {
        this.quizFinished = true;
        clearInterval(this.timerInterval);
      }
    },

    resetQuiz() {
      this.quizActive = false;
      this.quizFinished = false;
      this.quizQuestions = [];
    },

    getOptionClass(idx) {
      if (!this.quizAnswered) return '';
      if (idx === this.currentQuestion.correct) return 'correct';
      if (idx === this.selectedAnswer) return 'wrong';
      return '';
    },

    // ===== INTERVIEW =====
    loadInterviewProgress() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          this.interviewProgress = JSON.parse(raw);
        }
      } catch (e) {
        console.warn('AiHub: interview progress load failed', e);
        this.interviewProgress = {};
      }
    },

    saveInterviewProgress() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.interviewProgress));
      } catch (e) {
        console.warn('AiHub: interview progress save failed', e);
      }
    },

    isTopicItemChecked(topicIdx, itemIdx) {
      const key = `topic_${topicIdx}`;
      const checked = this.interviewProgress[key] || [];
      return checked.includes(itemIdx);
    },

    toggleTopicItem(topicIdx, itemIdx) {
      const key = `topic_${topicIdx}`;
      if (!this.interviewProgress[key]) {
        this.interviewProgress[key] = [];
      }
      const idx = this.interviewProgress[key].indexOf(itemIdx);
      if (idx >= 0) {
        this.interviewProgress[key].splice(idx, 1);
      } else {
        this.interviewProgress[key].push(itemIdx);
      }
      this.saveInterviewProgress();
    },

    // ===== PROJECTS =====
    getLevelClass(level) {
      const map = {
        'Cơ bản': 'beginner',
        'Trung bình': 'intermediate',
        'Nâng cao': 'advanced',
      };
      return map[level] || 'beginner';
    },
  },
};
</script>

<style scoped>
/* CSS variables inherited from main.css */
@import '@legacy/css/subpage.css';

.ai-hub-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.topbar-left h1 {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.topbar-left p {
  font-size: 1rem;
  opacity: 0.9;
  color: rgba(255,255,255,0.9);
  margin-top: 0.2rem;
}

.back-btn {
  background: white;
  color: var(--color-accent);
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.85rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}

.tab {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 30px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  background: rgba(255,255,255,0.35);
}

.tab.active {
  background: white;
  color: var(--color-accent);
  border-color: white;
}

.section {
  margin-bottom: 2rem;
}

/* ===== FLASHCARD ===== */
.filter-row {
  margin-bottom: 1rem;
}

.filter-row select {
  padding: 0.45rem 0.8rem;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
}

.flashcard {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  perspective: 1000px;
  cursor: pointer;
  min-height: 280px;
  position: relative;
}

.flashcard-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flashcard.flipped .flashcard-inner {
  transform: rotateY(180deg);
}

.flashcard-front, .flashcard-back {
  backface-visibility: hidden;
}

.flashcard-back {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transform: rotateY(180deg);
}

.flashcard-category {
  display: inline-block;
  background: var(--color-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  margin-bottom: 0.8rem;
  letter-spacing: 0.5px;
}

.flashcard-en {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-accent);
  margin-bottom: 0.3rem;
}

.flashcard-vi {
  font-size: 1.3rem;
  color: var(--color-text2);
  font-weight: 600;
  margin-bottom: 1rem;
}

.flashcard-def {
  font-size: 1.05rem;
  color: var(--color-text);
  line-height: 1.6;
}

.flashcard-ex {
  font-size: 0.95rem;
  color: var(--text-tertiary);
  font-style: italic;
  margin-top: 1rem;
  padding: 0.8rem;
  background: var(--color-bg-white);
  border-radius: var(--radius-sm);
}

.flip-hint {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: center;
  margin-top: 1rem;
}

.flashcard-counter {
  color: rgba(255,255,255,0.85);
  text-align: center;
  margin-top: 0.6rem;
  font-weight: 600;
}

.flashcard-controls {
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1rem;
}

.flashcard-btn {
  background: rgba(255,255,255,0.9);
  color: var(--color-accent);
  border: none;
  border-radius: 12px;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.flashcard-btn:hover:not(:disabled) {
  transform: scale(1.05);
  background: white;
}

.flashcard-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== QUIZ ===== */
.quiz-config {
  background: white;
  border-radius: var(--radius-md);
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.7rem;
}

.quiz-config select {
  padding: 0.4rem 0.7rem;
  border: 1.5px solid var(--color-border-subtle);
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.quiz-type-tabs {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0;
  width: 100%;
}

.quiz-type-tab {
  background: rgba(255,255,255,0.2);
  color: var(--color-text);
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 20px;
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.quiz-type-tab.active {
  background: white;
  color: var(--color-accent);
  border-color: white;
}

.quiz-start-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.4rem 1rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  margin-left: auto;
}

.quiz-timer-bar {
  height: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 0.3rem;
  display: none;
}

.quiz-timer-bar.active {
  display: block;
}

.quiz-timer-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-warning), var(--color-error));
  transition: width 1s linear;
}

.quiz-timer-text {
  color: white;
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 0.8rem;
  display: none;
}

.quiz-timer-text.active {
  display: block;
}

.quiz-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  margin-bottom: 1rem;
}

.quiz-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  margin-bottom: 0.8rem;
}

.quiz-progress {
  float: right;
  font-size: 0.85rem;
  color: var(--color-text2);
  font-weight: 600;
}

.quiz-question {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text-dark);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.quiz-option {
  background: var(--color-bg-white);
  border: 2px solid var(--color-border-subtle);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  font-weight: 500;
  color: var(--color-text);
}

.quiz-option:hover:not(:disabled) {
  border-color: var(--color-accent-light);
  background: var(--color-accent-bg-light);
}

.quiz-option.correct {
  background: var(--color-success-bg);
  border-color: var(--color-success);
  color: var(--color-success-dark);
}

.quiz-option.wrong {
  background: var(--color-error-bg);
  border-color: var(--color-error);
  color: var(--color-error-dark);
}

.quiz-option:disabled {
  cursor: default;
}

.quiz-feedback {
  padding: 0.7rem 1rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: none;
}

.quiz-feedback.show {
  display: block;
}

.quiz-feedback.correct {
  background: var(--color-success-bg);
  color: var(--color-success-dark);
}

.quiz-feedback.wrong {
  background: var(--color-error-bg);
  color: var(--color-error-dark);
}

.quiz-next {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.6rem 1.8rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  transition: transform 0.1s;
}

.quiz-next:hover {
  transform: scale(1.03);
}

.quiz-results {
  text-align: center;
}

.quiz-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  text-align: center;
  background: white;
  border-radius: var(--radius-md);
  padding: 1rem;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.stat-value {
  display: block;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-accent);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text2);
}

/* ===== INTERVIEW ===== */
.interview-layout {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.interview-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: white;
  border-radius: var(--radius-md);
  padding: 1rem;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.interview-progress {
  font-size: 0.85rem;
  color: var(--color-text2);
  margin-bottom: 1rem;
  font-weight: 600;
}

.interview-list {
  list-style: none;
}

.interview-item {
  padding: 0.6rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  transition: background 0.15s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}

.interview-item:hover {
  background: var(--color-accent-bg);
}

.interview-item.active {
  background: var(--color-accent);
  color: white;
}

.interview-item-stat {
  font-size: 0.8rem;
  color: var(--color-text2);
}

.interview-item.active .interview-item-stat {
  color: rgba(255,255,255,0.7);
}

.interview-content {
  flex: 1;
  background: white;
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  min-height: 300px;
}

.interview-content h2 {
  color: var(--color-accent);
  font-size: 1.4rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-accent-bg, #f3e5f5);
}

.checklist {
  list-style: none;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--color-text-darker);
}

.checklist-item input {
  margin-top: 0.25rem;
  width: 18px;
  height: 18px;
  accent-color: var(--color-accent);
  cursor: pointer;
}

.checklist-item.checked span {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

/* ===== PROJECTS ===== */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.project-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 1.2rem;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
}

.project-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-dark);
  margin-bottom: 0.5rem;
}

.project-meta {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-tertiary);
  align-items: center;
}

.project-level {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}

.project-level.beginner {
  background: var(--color-success-bg);
  color: var(--color-success-dark);
}

.project-level.intermediate {
  background: var(--color-warning-bg);
  color: var(--color-warning-dark);
}

.project-level.advanced {
  background: var(--color-error-bg);
  color: var(--color-error-dark);
}

.project-desc {
  font-size: 0.9rem;
  color: var(--color-text2);
  line-height: 1.5;
}

.project-detail {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
}

.project-back {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.15s;
}

.project-back:hover {
  background: var(--color-accent-bg);
}

.project-detail h2 {
  color: var(--color-accent);
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

.project-detail h3 {
  color: var(--color-accent);
  font-size: 1.1rem;
  margin: 1.2rem 0 0.6rem;
}

.project-steps {
  padding-left: 1.5rem;
}

.project-steps li {
  padding: 0.4rem 0;
  font-size: 0.95rem;
  color: var(--color-text2);
  line-height: 1.5;
}

.project-code {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 12px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
}

.project-code code {
  background: transparent;
  color: inherit;
  padding: 0;
}

@media (max-width: 700px) {
  .interview-layout {
    flex-direction: column;
  }
  .interview-sidebar {
    width: 100%;
  }
  .quiz-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
