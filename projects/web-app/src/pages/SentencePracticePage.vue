<template>
  <div class="practice-page" style="--color-accent: #34d399">
    <CTopbar
      title="🗣️ Luyện nói & Viết lại"
      back-label="⬅ Tiếng Anh"
      @go-home="handleBack"
    />

    <div class="page">
      <p class="desc">Xem tiếng Việt → tự viết tiếng Anh → kiểm tra. Mỗi câu đúng giúp bạn nhớ lâu hơn. 500+ câu từ 13 chủ đề.</p>

      <!-- Category tabs -->
      <div class="cat-grid">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-btn"
          :class="{ active: currentCategory === cat.id }"
          @click="switchCategory(cat.id)"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>

      <!-- Progress bar -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <!-- Stats -->
      <div class="p-stats">
        <span>✅ <strong>{{ correctCount }}</strong></span>
        <span>❌ <strong>{{ wrongCount }}</strong></span>
        <span>📊 <strong>{{ totalCount }}</strong></span>
      </div>

      <!-- Practice card -->
      <div class="practice-card">
        <!-- Completion summary -->
        <template v-if="isCompleted">
          <div class="p-vi">🎉 Hoàn thành!</div>
          <div class="p-summary">
            <p>✅ Đúng: <strong>{{ correctCount }}</strong></p>
            <p>❌ Sai: <strong>{{ wrongCount }}</strong></p>
            <p>
              📊 Tỉ lệ đúng:
              <strong>
                {{ (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0 }}%
              </strong>
            </p>
          </div>
          <div class="p-actions">
            <button class="btn-next" @click="nextSentence">🔄 Luyện lại</button>
          </div>
        </template>

        <template v-else>
          <div class="p-counter">{{ currentIndex + 1 }} / {{ pool.length }}</div>
          <div class="p-vi">{{ currentSentence?.vi }}</div>
          <div class="p-hint">💡 {{ currentSentence?.note }}</div>
          <input
            v-model="userAnswer"
            class="p-input"
            :class="{
              correct: showResult && isCorrect,
              wrong: showResult && !isCorrect
            }"
            placeholder="Gõ câu tiếng Anh của bạn..."
            autocomplete="off"
            spellcheck="false"
            :disabled="showResult"
            @keydown.enter="handleEnter"
          />
          <div class="p-result" :class="{ show: showResult, good: isCorrect, bad: !isCorrect }">
            <template v-if="isCorrect">
              <div>✅ <span class="correct-en">{{ currentSentence?.en }}</span></div>
            </template>
            <template v-else>
              <div>Bạn viết: <span class="wrong-text">{{ userAnswer.trim() || '(trống)' }}</span></div>
              <div class="correct-en">✅ Đúng: {{ currentSentence?.en }}</div>
            </template>
          </div>
          <div class="p-actions">
            <button
              v-if="!showResult"
              class="btn-check"
              @click="checkAnswer"
            >
              ✅ Kiểm tra
            </button>
            <button
              v-else
              class="btn-next"
              @click="nextSentence"
            >
              ➡️ Câu tiếp
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import { navigate } from '../utils/navigate.js';
import { sentencePractice } from '@legacy/js/data/sentence-practice.js';

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, '');
}

export default {
  name: 'SentencePracticePage',
  components: { CTopbar },

  data() {
    const categories = sentencePractice.categories.map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon
    }));

    const firstCat = categories[0];
    const pool = shuffle([...sentencePractice.categories[0].sentences]);

    return {
      categories,
      currentCategory: firstCat.id,
      pool,
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      userAnswer: '',
      showResult: false,
      isCorrect: false,
    };
  },

  computed: {
    currentSentence() {
      return this.pool[this.currentIndex];
    },
    totalCount() {
      return this.pool.length;
    },
    progressPercent() {
      return this.pool.length > 0
        ? (this.currentIndex / this.pool.length) * 100
        : 0;
    },
    isCompleted() {
      return this.currentIndex >= this.pool.length;
    },
  },

  methods: {
    handleBack() {
      navigate('/english');
    },

    switchCategory(catId) {
      this.currentCategory = catId;
      const cat = sentencePractice.categories.find(c => c.id === catId);
      if (!cat) return;

      this.pool = shuffle([...cat.sentences]);
      this.currentIndex = 0;
      this.correctCount = 0;
      this.wrongCount = 0;
      this.showResult = false;
      this.userAnswer = '';
    },

    checkAnswer() {
      if (this.showResult) return;

      const user = normalize(this.userAnswer);
      const correct = normalize(this.currentSentence.en);
      this.isCorrect = user === correct;
      this.showResult = true;

      if (this.isCorrect) {
        this.correctCount++;
      } else {
        this.wrongCount++;
      }
    },

    nextSentence() {
      if (this.isCompleted) {
        this.currentIndex = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.pool = shuffle([...this.pool]);
      } else if (this.currentIndex >= this.pool.length - 1) {
        // Last sentence: mark as completed so the user sees the summary
        this.currentIndex = this.pool.length;
      } else {
        this.currentIndex++;
      }

      this.showResult = false;
      this.userAnswer = '';
    },

    handleEnter() {
      if (!this.showResult) {
        this.checkAnswer();
      } else if (!this.isCompleted) {
        this.nextSentence();
      }
    },
  },
};
</script>

<style scoped>
/* CSS variables inherited from main.css */
@import '@legacy/css/subpage.css';

.practice-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.desc {
  color: var(--color-text2);
  margin-bottom: 1.5rem;
  font-size: var(--font-base);
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

@media (max-width: 600px) {
  .cat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.cat-btn {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-1);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: center;
  font-size: var(--font-xs);
  font-weight: 500;
  color: var(--color-text2);
}

.cat-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
}

.cat-btn.active {
  border-color: var(--color-accent);
  background: rgba(52, 211, 153, 0.1);
  color: var(--color-accent);
}

.progress-bar {
  height: 4px;
  background: var(--color-surface2);
  border-radius: 2px;
  margin-bottom: var(--space-4);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.p-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
  margin-bottom: var(--space-4);
  font-size: var(--font-sm);
  color: var(--color-text2);
}

.p-stats strong {
  color: var(--color-text);
}

.practice-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-bottom: var(--space-4);
}

.p-counter {
  font-size: var(--font-sm);
  color: var(--color-text2);
  margin-bottom: var(--space-2);
  text-align: center;
}

.p-vi {
  font-size: var(--font-xl);
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--space-1);
  color: var(--color-text);
}

.p-hint {
  font-size: var(--font-sm);
  color: var(--color-text2);
  text-align: center;
  margin-bottom: var(--space-4);
  font-style: italic;
}

.p-summary {
  text-align: center;
  margin: var(--space-4) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.p-summary p {
  margin: 0;
  font-size: var(--font-base);
  color: var(--color-text2);
}

.p-summary strong {
  color: var(--color-text);
}

.p-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  background: var(--color-surface2);
  color: var(--color-text);
  text-align: center;
  transition: border-color 0.2s ease;
}

.p-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.p-input.correct {
  border-color: var(--color-accent);
  background: rgba(52, 211, 153, 0.08);
}

.p-input.wrong {
  border-color: var(--color-error, #ef4444);
  background: var(--color-error-bg, rgba(239, 68, 68, 0.08));
}

.p-result {
  text-align: center;
  margin-top: var(--space-4);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  display: none;
}

.p-result.show {
  display: block;
}

.p-result.good {
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.p-result.bad {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.correct-en {
  font-weight: 600;
  color: var(--color-accent);
  font-size: var(--font-lg);
}

.wrong-text {
  color: var(--color-error, #ef4444);
}

.p-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
  flex-wrap: wrap;
}

.btn-check,
.btn-next {
  border: none;
  border-radius: 6px;
  padding: var(--space-2) var(--space-5);
  font-size: var(--font-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-check {
  background: var(--color-accent);
  color: var(--color-bg);
}

.btn-check:hover {
  opacity: 0.9;
}

.btn-next {
  background: var(--color-surface2);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-next:hover {
  border-color: var(--color-accent);
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .p-vi {
    font-size: var(--font-lg);
  }
}
</style>
