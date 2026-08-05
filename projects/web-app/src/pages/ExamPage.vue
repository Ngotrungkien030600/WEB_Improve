<template>
  <div class="exam-page" style="--color-accent: #667eea">
    <CTopbar
      title="📝 Thi Tiếng Anh"
      back-label="⬅ Tiếng Anh"
      @go-home="handleBack"
    />

    <div class="subpage-content">
      <!-- Config section -->
      <section class="subpage-card exam-config">
        <div class="exam-config-row">
          <label>Chủ đề:</label>
          <div class="exam-topic-tabs">
            <button
              v-for="tab in quizTypes"
              :key="tab.value"
              class="exam-topic-tab"
              :class="{ active: selectedType === tab.value }"
              @click="selectedType = tab.value"
            >
              {{ tab.icon }} {{ tab.label }}
            </button>
          </div>
        </div>
        <div class="exam-config-row">
          <label>Số câu:</label>
          <select v-model="questionCount">
            <option value="5">5 câu</option>
            <option value="10">10 câu</option>
            <option value="15">15 câu</option>
            <option value="20">20 câu</option>
          </select>
          <label>Thời gian:</label>
          <select v-model="timeMode">
            <option value="per-question">Theo từng câu</option>
            <option value="total">Tổng toàn bài</option>
            <option value="unlimited">Không giới hạn</option>
          </select>
          <select v-model="timeLimit">
            <option value="10">10s</option>
            <option value="15">15s</option>
            <option value="20">20s</option>
            <option value="30">30s</option>
          </select>
          <button class="exam-btn-start" @click="startExam">▶️ Bắt đầu thi</button>
        </div>
      </section>

      <!-- Timer bar -->
      <div v-if="started" class="exam-timer-bar">
        <div class="exam-timer-fill" :style="{ width: timerPercent + '%' }"></div>
      </div>
      <p v-if="started" class="exam-timer-text">Thời gian còn lại: {{ timerText }}</p>

      <!-- Active exam -->
      <section v-if="started && !finished" class="subpage-card exam-card">
        <div class="exam-card-header">
          <span class="exam-badge">{{ currentLabel }}</span>
          <span class="exam-progress">Câu {{ currentIndex + 1 }} / {{ questionCount }}</span>
        </div>
        <h2 class="exam-question">{{ currentQuestion }}</h2>
        <p class="exam-hint">{{ currentHint }}</p>
        <div class="exam-options">
          <button
            v-for="(choice, i) in choices"
            :key="i"
            class="exam-option"
            :class="{
              selected: selectedAnswer === choice,
              correct: answered && choice === correctAnswer,
              wrong: answered && selectedAnswer === choice && choice !== correctAnswer
            }"
            :disabled="answered"
            @click="selectAnswer(choice)"
          >
            {{ choice }}
          </button>
        </div>
        <div class="exam-feedback">{{ feedbackText }}</div>
        <div v-if="answered" class="exam-actions">
          <button class="exam-btn-next" @click="nextQuestion">
            {{ isLastQuestion ? 'Xem kết quả ➡️' : 'Câu tiếp theo ➡️' }}
          </button>
        </div>
      </section>

      <!-- Stats -->
      <section v-if="started" class="subpage-card exam-stats">
        <div class="exam-stat">
          <span class="exam-stat-value">{{ score }}</span>
          <span class="exam-stat-label">Đúng</span>
        </div>
        <div class="exam-stat">
          <span class="exam-stat-value">{{ total }}</span>
          <span class="exam-stat-label">Tổng</span>
        </div>
        <div class="exam-stat">
          <span class="exam-stat-value">{{ percent }}%</span>
          <span class="exam-stat-label">Tỉ lệ</span>
        </div>
        <div class="exam-stat">
          <span class="exam-stat-value">{{ levelText }}</span>
          <span class="exam-stat-label">Trình độ</span>
        </div>
      </section>

      <!-- History -->
      <section v-if="!started" class="subpage-card exam-history">
        <h3>📜 Lịch sử thi</h3>
        <ul v-if="history.length > 0" class="history-list">
          <li v-for="(item, i) in history" :key="i" class="history-item">
            <span class="history-type">{{ getTypeLabel(item.type) }}</span>
            <span class="history-score">{{ item.score }}/{{ item.total }}</span>
            <span class="history-pct" :class="getPctClass(item.percent)">{{ item.percent }}%</span>
            <span class="history-date">{{ item.date }}</span>
          </li>
        </ul>
        <p v-else class="history-empty">Chưa có lịch sử thi. Hãy bắt đầu!</p>
      </section>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import { navigate } from '../utils/navigate.js';
import {
  initPool,
  setConfig,
  getCurrentItem,
  generateChoices,
  getCurrentType,
  getCurrentIndex,
  getScore,
  getTotal,
  submitAnswer,
  nextQuestion as getNextQuestion,
  reset,
  loadHistory,
  saveToHistory,
  getHistory,
  QUIZ_TYPES
} from '@legacy/js/features/quiz/quiz-logic.js';

export default {
  name: 'ExamPage',
  components: { CTopbar },

  data() {
    return {
      quizTypes: [
        { value: 'vocab', label: 'Từ vựng', icon: '📝' },
        { value: 'sentence', label: 'Đặt câu', icon: '✍️' },
        { value: 'tense', label: 'Nhận diện thì', icon: '⏰' },
      ],
      selectedType: 'vocab',
      questionCount: '10',
      timeMode: 'per-question',
      timeLimit: '15',

      started: false,
      finished: false,
      currentQuestion: '',
      currentHint: '',
      currentLabel: '',
      choices: [],
      correctAnswer: '',
      selectedAnswer: null,
      answered: false,
      feedbackText: '',
      currentIndex: 0,
      score: 0,
      total: 0,
      percent: 0,
      levelText: '--',

      timerPercent: 100,
      timerText: '--',
      timerInterval: null,
      timerRemaining: 0,
      timerMax: 0,

      history: [],
    };
  },

  computed: {
    isLastQuestion() {
      return this.currentIndex >= parseInt(this.questionCount) - 1;
    },
  },

  mounted() {
    this.history = loadHistory();
  },

  beforeUnmount() {
    this.stopTimer();
  },

  methods: {
    handleBack() {
      navigate('/english/hub');
    },

    startExam() {
      reset();
      setConfig(
        parseInt(this.questionCount),
        this.timeMode,
        parseInt(this.timeLimit)
      );
      initPool(this.selectedType);

      this.started = true;
      this.finished = false;
      this.score = 0;
      this.total = 0;
      this.percent = 0;
      this.currentIndex = 0;

      this.loadQuestion();
    },

    loadQuestion() {
      const result = generateChoices();
      this.currentQuestion = result.questionText;
      this.currentHint = result.hintText;
      this.currentLabel = result.label;
      this.choices = result.choices;
      this.correctAnswer = result.correct;
      this.selectedAnswer = null;
      this.answered = false;
      this.feedbackText = '';

      this.updateStats();
      this.startTimer();
    },

    selectAnswer(choice) {
      if (this.answered) return;

      this.stopTimer();
      this.selectedAnswer = choice;
      const result = submitAnswer(choice);
      this.answered = true;

      if (result.isCorrect) {
        this.score++;
        this.feedbackText = '✅ Đúng!';
      } else {
        this.feedbackText = `❌ Sai! Đáp án: ${this.correctAnswer}`;
      }

      this.total++;
      this.percent = this.total === 0 ? 0 : Math.round((this.score / this.total) * 100);
      this.levelText = this.getLevelText(this.percent);
    },

    nextQuestion() {
      const result = getNextQuestion();
      if (result === 'finish' || this.isLastQuestion) {
        this.finishExam();
      } else {
        this.currentIndex++;
        this.loadQuestion();
      }
    },

    finishExam() {
      this.stopTimer();
      this.finished = true;
      this.feedbackText = `🎉 Hoàn thành! Điểm: ${this.score}/${this.total} (${this.percent}%)`;
      saveToHistory();
      this.history = getHistory();
    },

    updateStats() {
      this.score = getScore();
      this.total = getTotal();
      this.currentIndex = getCurrentIndex();
      this.percent = this.total === 0 ? 0 : Math.round((this.score / this.total) * 100);
      this.levelText = this.getLevelText(this.percent);
    },

    getLevelText(pct) {
      if (pct >= 90) return 'Xuất sắc';
      if (pct >= 80) return 'Giỏi';
      if (pct >= 70) return 'Khá';
      if (pct >= 60) return 'Trung bình';
      if (pct >= 50) return 'Yếu';
      return 'Kém';
    },

    getTypeLabel(type) {
      const map = { vocab: '📝 Từ vựng', sentence: '✍️ Đặt câu', tense: '⏰ Nhận diện thì' };
      return map[type] || type;
    },

    getPctClass(pct) {
      if (pct >= 80) return 'pct-high';
      if (pct >= 60) return 'pct-mid';
      return 'pct-low';
    },

    startTimer() {
      this.stopTimer();

      if (this.timeMode === 'unlimited') {
        this.timerText = '∞';
        this.timerPercent = 100;
        return;
      }

      const limit = parseInt(this.timeLimit);
      this.timerRemaining = limit;
      this.timerMax = limit;
      this.timerPercent = 100;

      this.timerInterval = setInterval(() => {
        this.timerRemaining--;
        this.timerPercent = (this.timerRemaining / this.timerMax) * 100;
        this.timerText = this.timerRemaining + 's';

        if (this.timerRemaining <= 0) {
          this.stopTimer();
          if (!this.answered) {
            this.selectAnswer('__timeout__');
          }
        }
      }, 1000);
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
  },
};
</script>

<style scoped>
/* CSS variables inherited from main.css */
@import '@legacy/css/subpage.css';
@import '@legacy/css/exam.css';

.exam-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.exam-config {
  margin-bottom: var(--space-4);
}

.exam-config-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.exam-config-row:last-child {
  margin-bottom: 0;
}

.exam-config-row label {
  font-weight: 500;
  font-size: var(--font-sm);
  color: var(--color-text2);
}

.exam-topic-tabs {
  display: flex;
  gap: var(--space-2);
}

.exam-topic-tab {
  padding: var(--space-1) var(--space-3);
  background: var(--color-surface2);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-sm);
  transition: all 0.15s ease;
}

.exam-topic-tab:hover {
  border-color: var(--color-accent);
}

.exam-topic-tab.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.exam-config-row select {
  padding: var(--space-1) var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-sm);
}

.exam-btn-start {
  padding: var(--space-2) var(--space-4);
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.exam-btn-start:hover {
  opacity: 0.9;
}

.exam-timer-bar {
  height: 6px;
  background: var(--color-surface2);
  border-radius: 3px;
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto var(--space-2);
}

.exam-timer-fill {
  height: 100%;
  background: var(--color-accent);
  transition: width 0.3s ease;
}

.exam-timer-text {
  text-align: center;
  margin-bottom: var(--space-3);
  font-size: var(--font-sm);
  color: var(--color-text2);
}

.exam-card {
  margin-bottom: var(--space-4);
}

.exam-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.exam-badge {
  background: var(--color-accent);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-sm);
  font-weight: 600;
}

.exam-progress {
  font-size: var(--font-sm);
  color: var(--color-text2);
}

.exam-question {
  font-size: var(--font-xl);
  font-weight: 600;
  margin-bottom: var(--space-2);
  text-align: center;
}

.exam-hint {
  font-size: var(--font-sm);
  color: var(--color-text2);
  margin-bottom: var(--space-3);
  text-align: center;
}

.exam-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.exam-option {
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface2);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.exam-option:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: var(--color-surface);
}

.exam-option:disabled {
  cursor: default;
}

.exam-option.selected:not(.correct):not(.wrong) {
  border-color: var(--color-accent);
  background: rgba(102, 126, 234, 0.1);
}

.exam-option.correct {
  background: var(--color-success-bg, #c8e6c9);
  border-color: var(--color-success, #2e7d32);
  color: var(--color-success-text, #1b5e20);
}

.exam-option.wrong {
  background: var(--color-error-bg, #ffcdd2);
  border-color: var(--color-error, #c62828);
  color: var(--color-error-text, #b71c1c);
}

.exam-feedback {
  text-align: center;
  margin-top: var(--space-3);
  font-weight: 500;
  min-height: 1.5em;
}

.exam-actions {
  text-align: center;
  margin-top: var(--space-3);
}

.exam-btn-next {
  padding: var(--space-2) var(--space-4);
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.exam-btn-next:hover {
  opacity: 0.9;
}

.exam-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--space-4);
}

.exam-stat {
  text-align: center;
}

.exam-stat-value {
  display: block;
  font-size: var(--font-2xl);
  font-weight: 700;
  color: var(--color-accent);
}

.exam-stat-label {
  font-size: var(--font-sm);
  color: var(--color-text2);
}

.exam-history h3 {
  margin-bottom: var(--space-3);
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border);
}

.history-item:last-child {
  border-bottom: none;
}

.history-type {
  flex: 1;
  font-size: var(--font-sm);
}

.history-score {
  font-weight: 600;
}

.history-pct {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-sm);
  font-weight: 600;
}

.history-pct.pct-high {
  background: var(--color-success-bg, #c8e6c9);
  color: var(--color-success, #2e7d32);
}

.history-pct.pct-mid {
  background: var(--color-warning-bg, #fff3e0);
  color: var(--color-warning, #e65100);
}

.history-pct.pct-low {
  background: var(--color-error-bg, #ffcdd2);
  color: var(--color-error, #c62828);
}

.history-date {
  font-size: var(--font-sm);
  color: var(--color-text2);
}

.history-empty {
  text-align: center;
  color: var(--color-text2);
  padding: var(--space-4);
}
</style>
