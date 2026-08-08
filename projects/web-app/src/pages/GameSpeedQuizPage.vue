<template>
  <div class="game-page">
    <CTopbar
      title="⚡ Trắc nghiệm nhanh"
      back-label="⬅ Tiếng Anh"
      @go-home="handleBack"
    />

    <div class="subpage-content">
      <div class="quiz-timer-bar" id="sq-timer-bar">
        <div id="sq-timer-fill" :style="{ width: timerWidth + '%', background: timerColor }"></div>
      </div>
      <p class="quiz-timer-text" id="sq-timer-text">Thời gian: {{ timerText }}</p>

      <div class="sq-card">
        <p class="sq-question" id="sq-question">{{ question }}</p>

        <div class="options" id="sq-options">
          <button
            v-for="(option, index) in options"
            :key="index"
            class="option"
            :class="{
              correct: option.state === 'correct',
              wrong: option.state === 'wrong'
            }"
            :disabled="answered || feedbackShown"
            @click="handleAnswer(option)"
          >
            {{ option.text }}
          </button>
        </div>

        <div class="quiz-feedback" id="sq-feedback">{{ feedback }}</div>
      </div>

      <div style="text-align:center;">
        <button class="btn-restart" @click="startGame">▶️ Bắt đầu</button>
      </div>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import { navigate } from '../utils/navigate.js';
import {
  initSpeedQuiz,
  getCurrentQuestion,
  submitAnswer,
  nextQuestion,
  getScore,
  startTimer,
  stopTimer,
  TIME_LIMIT
} from '@legacy/js/features/game/game-speedquiz.js';

export default {
  name: 'GameSpeedQuizPage',
  components: { CTopbar },

  data() {
    return {
      question: 'Chọn đáp án đúng',
      options: [],
      feedback: '',
      score: 0,
      timerText: '--',
      timerWidth: 100,
      timerColor: 'var(--forge-fire)',
      answered: false,
      feedbackShown: false,
      timerInterval: null,
      currentSeconds: TIME_LIMIT,
    };
  },

  mounted() {
    this.startGame();
  },

  beforeUnmount() {
    this.stopMyTimer();
  },

  methods: {
    startGame() {
      this.stopMyTimer();
      initSpeedQuiz();
      this.feedback = '';
      this.answered = false;
      this.feedbackShown = false;
      this.renderQuestion();
      this.startMyTimer();
    },

    renderQuestion() {
      const q = getCurrentQuestion();
      if (!q) return;

      this.question = q.question;
      this.options = q.options.map(opt => ({
        text: opt.text,
        correct: opt.correct,
        state: ''
      }));
      this.score = getScore();
      this.answered = false;
      this.feedbackShown = false;
    },

    startMyTimer() {
      this.stopMyTimer();
      this.currentSeconds = TIME_LIMIT;
      this.timerWidth = 100;
      this.timerColor = 'var(--forge-fire)';

      this.timerInterval = setInterval(() => {
        this.currentSeconds--;
        const pct = (this.currentSeconds / TIME_LIMIT) * 100;
        this.timerWidth = pct;
        this.timerText = `${this.currentSeconds}s`;
        this.timerColor = this.currentSeconds <= 3 ? 'var(--forge-error)' : 'var(--forge-fire)';

        if (this.currentSeconds <= 0) {
          this.timerText = '⏰ Hết giờ!';
          this.handleTimeout();
        }
      }, 1000);
    },

    stopMyTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    handleTimeout() {
      this.stopMyTimer();
      submitAnswer('__timeout__');
      this.answered = true;
      this.feedbackShown = true;

      // Highlight correct answer
      const q = getCurrentQuestion();
      if (q) {
        const correctOpt = q.options.find(o => o.correct);
        this.options = this.options.map(opt => ({
          ...opt,
          state: opt.text === correctOpt.text ? 'correct' : opt.state
        }));
        this.feedback = `⏰ Hết giờ! Đáp án: ${correctOpt.text}`;
      }

      setTimeout(() => {
        this.proceedToNext();
      }, 1500);
    },

    handleAnswer(option) {
      if (this.answered || this.feedbackShown) return;

      const result = submitAnswer(option.text);
      if (!result) return;

      this.stopMyTimer();
      this.answered = true;
      this.feedbackShown = true;
      this.score = result.score;

      // Highlight all options
      this.options = this.options.map(opt => {
        if (opt.text === result.answer) {
          return { ...opt, state: 'correct' };
        }
        if (opt.text === option.text && !result.correct) {
          return { ...opt, state: 'wrong' };
        }
        return opt;
      });

      if (result.correct) {
        this.feedback = '✅ Đúng! +10 điểm';
      } else {
        this.feedback = `❌ Sai! Đáp án: ${result.answer}`;
      }

      setTimeout(() => {
        this.proceedToNext();
      }, 1500);
    },

    proceedToNext() {
      const next = nextQuestion();
      if (!next) {
        // Game over — ensure final score is up to date
        this.score = getScore();
        this.question = `🎉 Hoàn thành! Điểm: ${this.score}/100`;
        this.options = [];
        this.feedback = '';
        this.timerText = '--';
        this.timerWidth = 0;
        return;
      }
      this.feedback = '';
      this.feedbackShown = false;
      this.renderQuestion();
      this.startMyTimer();
    },

    handleBack() {
      navigate('/english');
    },
  },
};
</script>

<style scoped>
.game-page {
  background: var(--forge-bg);
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.quiz-timer-bar {
  height: 8px;
  background: var(--forge-glass);
  border-radius: 4px;
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto var(--space-2);
}

.quiz-timer-bar div {
  height: 100%;
  background: linear-gradient(90deg, var(--forge-fire), var(--forge-error));
  transition: width 0.1s linear;
}

.quiz-timer-text {
  text-align: center;
  margin-bottom: var(--space-3);
  font-size: var(--font-sm);
  color: var(--forge-text2);
}

.sq-card {
  max-width: 500px;
  margin: 0 auto;
  padding: var(--space-4);
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.sq-question {
  text-align: center;
  font-size: var(--font-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--forge-text);
}

.options {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.option {
  padding: var(--space-3) var(--space-4);
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  cursor: pointer;
  transition: all var(--transition-spring);
  text-align: left;
  color: var(--forge-text);
}

.option:hover:not(:disabled) {
  border-color: var(--forge-accent);
  background: var(--forge-glass-hover);
}

.option:disabled {
  cursor: default;
}

.option.correct {
  background: rgba(34, 197, 94, 0.15);
  border-color: var(--forge-success);
  color: var(--forge-success);
}

.option.wrong {
  background: rgba(239, 68, 68, 0.15);
  border-color: var(--forge-error);
  color: var(--forge-error);
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.quiz-feedback {
  text-align: center;
  margin-top: var(--space-4);
  font-weight: 500;
  min-height: 1.5em;
  color: var(--forge-text);
}

.btn-restart {
  margin-top: var(--space-4);
  padding: var(--space-2) var(--space-4);
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  color: var(--forge-text);
  border-radius: var(--forge-card-radius);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-restart:hover {
  background: var(--forge-glass-hover);
  border-color: var(--forge-accent);
}
</style>
