<template>
  <div class="exam-page">
    <CTopbar
      title="📝 Thi Tiếng Anh"
      back-label="⬅ Tiếng Anh"
      @go-home="handleBack"
    />

    <div class="exam-wrap">
      <!-- Config section -->
      <section v-if="!started" class="exam-panel exam-config">
        <div class="exam-config-head">
          <h2 class="exam-config-title">Cấu hình bài thi</h2>
          <p class="exam-config-sub">Chọn chủ đề và thời gian rồi bắt đầu</p>
        </div>

        <div class="exam-config-row">
          <span class="exam-config-label">Chủ đề</span>
          <div class="exam-topic-tabs" role="tablist" aria-label="Chọn chủ đề">
            <button
              v-for="tab in quizTypes"
              :key="tab.value"
              class="exam-topic-tab"
              :class="{ active: selectedType === tab.value }"
              role="tab"
              :aria-selected="selectedType === tab.value"
              @click="selectedType = tab.value"
            >
              <span class="exam-topic-icon">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="exam-config-grid">
          <label class="exam-field">
            <span class="exam-config-label">Số câu</span>
            <select v-model="questionCount">
              <option value="5">5 câu</option>
              <option value="10">10 câu</option>
              <option value="15">15 câu</option>
              <option value="20">20 câu</option>
            </select>
          </label>
          <label class="exam-field">
            <span class="exam-config-label">Chế độ thời gian</span>
            <select v-model="timeMode">
              <option value="per-question">Theo từng câu</option>
              <option value="total">Tổng toàn bài</option>
              <option value="unlimited">Không giới hạn</option>
            </select>
          </label>
          <label v-if="timeMode !== 'unlimited'" class="exam-field">
            <span class="exam-config-label">Giới hạn</span>
            <select v-model="timeLimit">
              <option value="10">10 giây</option>
              <option value="15">15 giây</option>
              <option value="20">20 giây</option>
              <option value="30">30 giây</option>
            </select>
          </label>
        </div>

        <button class="exam-btn-start" @click="startExam">
          <span class="exam-btn-icon">▶</span>
          Bắt đầu thi
        </button>
      </section>

      <!-- Active exam -->
      <template v-else>
        <!-- Timer bar -->
        <div class="exam-timer-bar">
          <div
            class="exam-timer-fill"
            :class="{ warning: timerPercent < 35 }"
            :style="{ width: timerPercent + '%' }"
          ></div>
        </div>
        <div class="exam-timer-row">
          <span class="exam-timer-text" :class="{ urgent: timerPercent < 35 && timeMode !== 'unlimited' }">
            ⏱ {{ timeMode === 'unlimited' ? 'Không giới hạn' : `Còn ${timerText}` }}
          </span>
        </div>

        <!-- Result screen -->
        <section v-if="finished" class="exam-panel exam-result">
          <div class="exam-result-ring" :class="resultRingClass">
            <span class="exam-result-pct">{{ percent }}%</span>
          </div>
          <h2 class="exam-result-title">{{ resultTitle }}</h2>
          <p class="exam-result-sub">{{ resultSub }}</p>
          <div class="exam-result-stats">
            <div class="exam-stat">
              <span class="exam-stat-value">{{ score }}</span>
              <span class="exam-stat-label">Đúng</span>
            </div>
            <div class="exam-stat">
              <span class="exam-stat-value">{{ total }}</span>
              <span class="exam-stat-label">Tổng</span>
            </div>
            <div class="exam-stat">
              <span class="exam-stat-value">{{ levelText }}</span>
              <span class="exam-stat-label">Trình độ</span>
            </div>
          </div>
          <div class="exam-result-actions">
            <button class="exam-btn-ghost" @click="backToConfig">⬅ Cấu hình</button>
            <button class="exam-btn-start" @click="startExam">🔄 Thi lại</button>
          </div>
        </section>

        <!-- Question screen -->
        <section v-else class="exam-panel exam-card">
          <div class="exam-card-header">
            <span class="exam-badge">{{ currentLabel }}</span>
            <span class="exam-progress">Câu {{ currentIndex + 1 }} / {{ totalQuestions || questionCount }}</span>
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
              <span class="exam-option-key">{{ String.fromCharCode(65 + i) }}</span>
              <span class="exam-option-text">{{ choice }}</span>
              <span v-if="answered && choice === correctAnswer" class="exam-option-mark">✓</span>
              <span v-else-if="answered && selectedAnswer === choice && choice !== correctAnswer" class="exam-option-mark">✗</span>
            </button>
          </div>
          <div class="exam-feedback" :class="{ good: feedbackClass === 'good', bad: feedbackClass === 'bad' }">
            {{ feedbackText }}
          </div>
          <div v-if="answered" class="exam-actions">
            <button class="exam-btn-start" @click="nextQuestion">
              {{ isLastQuestion ? 'Xem kết quả' : 'Câu tiếp theo' }} →
            </button>
          </div>
        </section>
      </template>

      <!-- History -->
      <section v-if="!started" class="exam-panel exam-history">
        <div class="exam-history-head">
          <h3>Lịch sử thi</h3>
          <span class="exam-history-count">{{ history.length }} lần</span>
        </div>
        <ul v-if="displayedHistory.length > 0" class="history-list">
          <li v-for="(item, i) in displayedHistory" :key="i" class="history-item">
            <span class="history-type">{{ getTypeLabel(item.type) }}</span>
            <span class="history-score">{{ item.score }}/{{ item.total }}</span>
            <span class="history-pct" :class="getPctClass(item.percent)">{{ item.percent }}%</span>
            <span class="history-date">{{ item.date }}</span>
          </li>
        </ul>
        <div v-else class="history-empty">
          <span class="history-empty-icon">📭</span>
          <p>Chưa có lịch sử thi nào.</p>
          <p class="history-empty-sub">Hoàn thành một bài thi để lưu kết quả ở đây.</p>
        </div>
        <button
          v-if="hasMoreHistory"
          class="exam-btn-more"
          @click="loadMoreHistory"
        >
          Xem thêm lịch sử
        </button>
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
  getPoolLength,
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
      totalQuestions: 0,
      currentQuestion: '',
      currentHint: '',
      currentLabel: '',
      choices: [],
      correctAnswer: '',
      selectedAnswer: null,
      answered: false,
      feedbackText: '',
      feedbackClass: '',
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
      timerStartedTotal: false,

      history: [],
      historyPage: 1,
      historyPageSize: 10,
    };
  },

  computed: {
    isLastQuestion() {
      return this.currentIndex >= this.totalQuestions - 1;
    },
    displayedHistory() {
      return this.history.slice(0, this.historyPage * this.historyPageSize);
    },
    hasMoreHistory() {
      return this.displayedHistory.length < this.history.length;
    },
    resultRingClass() {
      if (this.percent >= 80) return 'ring-high';
      if (this.percent >= 60) return 'ring-mid';
      return 'ring-low';
    },
    resultTitle() {
      if (this.percent >= 90) return 'Xuất sắc';
      if (this.percent >= 80) return 'Rất tốt';
      if (this.percent >= 70) return 'Khá ổn';
      if (this.percent >= 60) return 'Tạm được';
      return 'Cần cố gắng hơn';
    },
    resultSub() {
      if (this.percent >= 90) return 'Bạn nắm rất vững kiến thức, tiếp tục phát huy nhé.';
      if (this.percent >= 70) return 'Kết quả tốt, ôn thêm vài chỗ là sẽ hoàn hảo.';
      if (this.percent >= 50) return 'Còn khá nhiều chỗ cần ôn lại, đừng bỏ cuộc.';
      return 'Hãy xem lại phần lý thuyết rồi thử lại lần nữa nhé.';
    },
  },

  mounted() {
    this.loadHistoryData();
  },

  beforeUnmount() {
    this.stopTimer();
  },

  methods: {
    handleBack() {
      navigate('/english');
    },

    loadHistoryData() {
      try {
        const fresh = loadHistory();
        this.history.splice(0, this.history.length, ...fresh);
      } catch (e) {
        console.warn('loadHistory failed:', e);
        this.history = [];
      }
      this.historyPage = 1;
    },

    backToConfig() {
      this.stopTimer();
      this.started = false;
      this.finished = false;
      this.loadHistoryData();
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
      this.timerStartedTotal = false;
      this.totalQuestions = getPoolLength();

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
      this.feedbackClass = '';

      this.updateStats();
      this.startTimer();
    },

    selectAnswer(choice) {
      if (this.answered) return;

      this.stopTimer();
      this.selectedAnswer = choice;
      const result = submitAnswer(choice);
      this.answered = true;

      if (result && result.isCorrect) {
        this.feedbackText = 'Đúng!';
        this.feedbackClass = 'good';
      } else {
        this.feedbackText = `Sai! Đáp án: ${this.correctAnswer}`;
        this.feedbackClass = 'bad';
      }

      // Refresh from the legacy state — it already counted score/total
      this.updateStats();
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
      // Ensure final stats are reflected before saving
      this.updateStats();
      this.feedbackText = `Hoàn thành! Điểm: ${this.score}/${this.total} (${this.percent}%)`;
      saveToHistory();
      this.loadHistoryData();
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

    loadMoreHistory() {
      this.historyPage++;
    },

    startTimer() {
      this.stopTimer();

      if (this.timeMode === 'unlimited') {
        this.timerText = '∞';
        this.timerPercent = 100;
        return;
      }

      const limit = parseInt(this.timeLimit);
      // In "total" mode the countdown spans the whole exam (questions × limit),
      // starting once at the first question and never resetting per question.
      if (this.timeMode === 'total') {
        if (this.currentIndex === 0 && !this.timerStartedTotal) {
          this.timerRemaining = limit * parseInt(this.questionCount);
          this.timerMax = this.timerRemaining;
          this.timerStartedTotal = true;
        }
        // Keep the current remaining time across questions
        this.timerPercent = this.timerMax > 0 ? (this.timerRemaining / this.timerMax) * 100 : 0;
      } else {
        this.timerRemaining = limit;
        this.timerMax = limit;
        this.timerPercent = 100;
      }
      this.timerText = this.timerRemaining + 's';

      this.timerInterval = setInterval(() => {
        this.timerRemaining--;
        this.timerPercent = Math.max(0, (this.timerRemaining / this.timerMax) * 100);
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
/* Exam page — dark utility, border-led, green accent (AD-17 English) */
.exam-page {
  color-scheme: dark;

  --exam-accent: var(--accent-english, #34d399);
  --exam-accent-dim: rgba(52, 211, 153, 0.14);
  --exam-accent-glow: rgba(52, 211, 153, 0.35);

  min-height: 100vh;
  background:
    radial-gradient(1200px 500px at 50% -10%, rgba(52, 211, 153, 0.06), transparent 60%),
    var(--forge-bg);
  padding: 2.5rem 1.5rem 4rem;
}

.exam-wrap {
  max-width: 720px;
  margin: 0 auto;
}

/* ============ Panels ============ */
.exam-panel {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

.exam-config {
  margin-bottom: var(--space-6);
}

/* ============ Config ============ */
.exam-config-head {
  margin-bottom: var(--space-5);
}

.exam-config-title {
  margin: 0;
  font-size: var(--font-xl);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--forge-text);
}

.exam-config-sub {
  margin: var(--space-1) 0 0;
  font-size: var(--font-sm);
  color: var(--forge-text3);
}

.exam-config-row {
  margin-bottom: var(--space-4);
}

.exam-config-label {
  display: block;
  font-size: var(--font-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--forge-text3);
  margin-bottom: var(--space-2);
}

.exam-topic-tabs {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.exam-topic-tab {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: 999px;
  color: var(--forge-text2);
  font-size: var(--font-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.exam-topic-tab:hover {
  background: var(--forge-glass-hover);
  border-color: var(--forge-glass-hover-border);
  color: var(--forge-text);
}

.exam-topic-tab.active {
  background: var(--exam-accent-dim);
  border-color: var(--exam-accent);
  color: var(--exam-accent);
}

.exam-topic-icon {
  font-size: 1rem;
  line-height: 1;
}

.exam-config-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.exam-field select {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  color: var(--forge-text);
  font-size: var(--font-base);
  font-family: inherit;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.exam-field select:hover {
  border-color: var(--forge-glass-hover-border);
}

.exam-field select:focus-visible {
  outline: none;
  border-color: var(--exam-accent);
}

/* ============ Buttons ============ */
.exam-btn-start {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-3) var(--space-5);
  background: linear-gradient(135deg, #34d399, #10b981);
  color: #052e16;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-base);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 4px 20px var(--exam-accent-glow);
}

.exam-btn-start:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 28px var(--exam-accent-glow);
  filter: brightness(1.05);
}

.exam-btn-start:active {
  transform: scale(0.98);
}

.exam-btn-icon {
  font-size: 0.75rem;
}

.exam-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: transparent;
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-lg);
  color: var(--forge-text2);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.exam-btn-ghost:hover {
  background: var(--forge-glass);
  color: var(--forge-text);
  border-color: var(--forge-glass-hover-border);
}

.exam-btn-ghost:active {
  transform: scale(0.98);
}

/* ============ Timer ============ */
.exam-timer-bar {
  height: 6px;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: var(--space-3);
}

.exam-timer-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--exam-accent), #10b981);
  border-radius: 999px;
  transition: width 0.6s ease;
}

.exam-timer-fill.warning {
  background: linear-gradient(90deg, #f59e0b, #ef4444);
}

.exam-timer-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-4);
}

.exam-timer-text {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--forge-text2);
  font-variant-numeric: tabular-nums;
}

.exam-timer-text.urgent {
  color: var(--forge-error);
}

/* ============ Question card ============ */
.exam-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
}

.exam-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  background: var(--exam-accent-dim);
  border: 1px solid var(--exam-accent);
  border-radius: 999px;
  color: var(--exam-accent);
  font-size: var(--font-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.exam-progress {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--forge-text3);
  font-variant-numeric: tabular-nums;
}

.exam-question {
  margin: 0 0 var(--space-2);
  font-size: var(--font-3xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
  color: var(--forge-text);
  line-height: 1.25;
}

.exam-hint {
  margin: 0 0 var(--space-5);
  font-size: var(--font-base);
  color: var(--forge-text2);
  text-align: center;
}

.exam-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.exam-option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-lg);
  color: var(--forge-text);
  font-size: var(--font-base);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-base);
}

.exam-option:hover:not(:disabled) {
  background: var(--forge-glass-hover);
  border-color: var(--exam-accent);
  transform: translateX(4px);
}

.exam-option:active:not(:disabled) {
  transform: scale(0.99);
}

.exam-option:disabled {
  cursor: default;
}

.exam-option-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-xs);
  font-weight: 700;
  color: var(--forge-text3);
  background: var(--forge-surface);
  transition: all var(--transition-base);
}

.exam-option-text {
  flex: 1;
}

.exam-option-mark {
  font-weight: 800;
  font-size: 1.1rem;
}

.exam-option.selected:not(.correct):not(.wrong) {
  border-color: var(--exam-accent);
  background: var(--exam-accent-dim);
}

.exam-option.selected .exam-option-key {
  border-color: var(--exam-accent);
  color: var(--exam-accent);
}

.exam-option.correct {
  background: rgba(34, 197, 94, 0.12);
  border-color: var(--forge-success);
}

.exam-option.correct .exam-option-key {
  border-color: var(--forge-success);
  color: var(--forge-success);
}

.exam-option.correct .exam-option-mark {
  color: var(--forge-success);
}

.exam-option.wrong {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--forge-error);
}

.exam-option.wrong .exam-option-key {
  border-color: var(--forge-error);
  color: var(--forge-error);
}

.exam-option.wrong .exam-option-mark {
  color: var(--forge-error);
}

.exam-feedback {
  text-align: center;
  margin-top: var(--space-4);
  font-weight: 600;
  font-size: var(--font-base);
  min-height: 1.5em;
}

.exam-feedback.good {
  color: var(--forge-success);
}

.exam-feedback.bad {
  color: var(--forge-error);
}

.exam-actions {
  margin-top: var(--space-5);
}

/* ============ Result ============ */
.exam-result {
  text-align: center;
  padding: var(--space-8) var(--space-6);
}

.exam-result-ring {
  width: 140px;
  height: 140px;
  margin: 0 auto var(--space-5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid;
}

.exam-result-ring.ring-high {
  border-color: var(--forge-success);
  color: var(--forge-success);
  box-shadow: 0 0 40px rgba(34, 197, 94, 0.25);
}

.exam-result-ring.ring-mid {
  border-color: var(--forge-warning);
  color: var(--forge-warning);
  box-shadow: 0 0 40px rgba(245, 158, 11, 0.25);
}

.exam-result-ring.ring-low {
  border-color: var(--forge-error);
  color: var(--forge-error);
  box-shadow: 0 0 40px rgba(239, 68, 68, 0.25);
}

.exam-result-pct {
  font-size: var(--font-4xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.exam-result-title {
  margin: 0 0 var(--space-2);
  font-size: var(--font-2xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--forge-text);
}

.exam-result-sub {
  margin: 0 0 var(--space-6);
  font-size: var(--font-base);
  color: var(--forge-text2);
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.exam-result-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-10);
  margin-bottom: var(--space-6);
}

.exam-stat {
  text-align: center;
}

.exam-stat-value {
  display: block;
  font-size: var(--font-2xl);
  font-weight: 800;
  color: var(--forge-text);
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}

.exam-stat-label {
  font-size: var(--font-sm);
  color: var(--forge-text3);
}

.exam-result-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}

.exam-result-actions .exam-btn-start {
  width: auto;
  padding-left: var(--space-6);
  padding-right: var(--space-6);
}

/* ============ History ============ */
.exam-history-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.exam-history-head h3 {
  margin: 0;
  font-size: var(--font-lg);
  font-weight: 700;
  color: var(--forge-text);
}

.exam-history-count {
  font-size: var(--font-xs);
  font-weight: 600;
  color: var(--forge-text3);
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  padding: var(--space-1) var(--space-2);
  border-radius: 999px;
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
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--forge-glass-border);
}

.history-item:last-child {
  border-bottom: none;
}

.history-type {
  flex: 1;
  font-size: var(--font-sm);
  color: var(--forge-text2);
}

.history-score {
  font-weight: 700;
  color: var(--forge-text);
  font-variant-numeric: tabular-nums;
}

.history-pct {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: var(--font-xs);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.history-pct.pct-high {
  background: rgba(34, 197, 94, 0.14);
  color: var(--forge-success);
}

.history-pct.pct-mid {
  background: rgba(245, 158, 11, 0.14);
  color: var(--forge-warning);
}

.history-pct.pct-low {
  background: rgba(239, 68, 68, 0.12);
  color: var(--forge-error);
}

.history-date {
  font-size: var(--font-sm);
  color: var(--forge-text3);
  font-variant-numeric: tabular-nums;
}

.history-empty {
  text-align: center;
  padding: var(--space-6) var(--space-4);
}

.history-empty-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: var(--space-2);
}

.history-empty p {
  margin: 0;
  font-weight: 600;
  color: var(--forge-text2);
}

.history-empty-sub {
  margin-top: var(--space-1) !important;
  font-weight: 400 !important;
  font-size: var(--font-sm);
  color: var(--forge-text3) !important;
}

.exam-btn-more {
  display: block;
  width: 100%;
  padding: var(--space-3);
  margin-top: var(--space-4);
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-lg);
  color: var(--exam-accent);
  font-size: var(--font-sm);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
}

.exam-btn-more:hover {
  background: var(--forge-glass-hover);
  border-color: var(--exam-accent);
}

/* ============ Responsive ============ */
@media (max-width: 640px) {
  .exam-page {
    padding: 1.5rem 1rem 3rem;
  }

  .exam-panel {
    padding: var(--space-5);
  }

  .exam-config-grid {
    grid-template-columns: 1fr;
  }

  .exam-question {
    font-size: var(--font-2xl);
  }

  .exam-result-stats {
    gap: var(--space-6);
  }

  .exam-result-actions {
    flex-direction: column;
  }

  .exam-result-actions .exam-btn-start,
  .exam-result-actions .exam-btn-ghost {
    width: 100%;
  }

  .history-item {
    flex-wrap: wrap;
    row-gap: var(--space-1);
  }

  .history-type {
    flex-basis: 100%;
  }
}
</style>
