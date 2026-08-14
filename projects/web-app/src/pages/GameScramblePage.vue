<template>
  <div class="game-page">
    <CTopbar
      title="🔀 Xếp chữ"
      back-label="Tiếng Anh"
      @go-home="handleBack"
    />

    <div class="subpage-content">
      <div class="game-header">
        <h2>🔀 Xếp chữ</h2>
        <div class="game-stats">
          <span>Điểm: <strong id="scramble-score">{{ score }}</strong></span>
          <span>Đã làm: <strong id="scramble-count">{{ current }}/{{ total }}</strong></span>
        </div>
      </div>

      <div class="scramble-card">
        <p class="scramble-hint" id="scramble-hint">{{ hint }}</p>

        <div class="scramble-letters" id="scramble-letters">
          <button
            v-for="(letter, index) in letters"
            :key="'letter-' + index"
            class="scramble-tile"
            @click="handleLetterClick(index)"
          >
            {{ letter }}
          </button>
        </div>

        <div class="scramble-answer" id="scramble-answer">
          <button
            v-for="(letter, index) in answer"
            :key="'answer-' + index"
            class="scramble-tile placed"
            @click="handleAnswerClick(index)"
          >
            {{ letter }}
          </button>
        </div>

        <p class="scramble-meaning" id="scramble-meaning">{{ meaning }}</p>

        <div class="practice-actions">
          <button id="scramble-check" :disabled="answered" @click="checkAnswer">✅ Kiểm tra</button>
          <button id="scramble-next" @click="nextWord">Tiếp ➡️</button>
        </div>

        <div class="practice-feedback" :class="feedbackClass">{{ feedback }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import { navigate } from '../utils/navigate.js';
import {
  initScramble,
  getProgress,
  clickLetter,
  undoLetter,
  checkAnswer as checkAnswerLogic,
  nextWord as nextWordLogic,
  isGameOver
} from '@legacy/js/features/game/game-scramble.js';

export default {
  name: 'GameScramblePage',
  components: { CTopbar },

  data() {
    return {
      letters: [],
      answer: [],
      score: 0,
      current: 1,
      total: 10,
      hint: '',
      meaning: '',
      feedback: '',
      feedbackClass: 'practice-feedback',
      currentWord: null,
      answered: false,
    };
  },

  mounted() {
    this.loadRound();
  },

  methods: {
    loadRound() {
      const data = initScramble();
      this.currentWord = data.word;
      this.letters = data.letters;
      this.answer = [];
      this.hint = `👆 Bấm vào chữ để xếp — từ này nghĩa là: ${data.word.vi}`;
      this.meaning = '';
      this.feedback = '';
      this.feedbackClass = 'practice-feedback';
      this.answered = false;
      const prog = getProgress();
      this.score = prog.score;
      this.current = prog.current;
      this.total = prog.total;
    },

    handleLetterClick(index) {
      if (index < 0 || index >= this.letters.length) return;
      const result = clickLetter(index);
      if (result) {
        this.letters = result.letters;
        this.answer = result.answer;
      }
    },

    handleAnswerClick(index) {
      const result = undoLetter(index);
      if (result) {
        this.letters = result.letters;
        this.answer = result.answer;
      }
    },

    checkAnswer() {
      if (this.answer.length === 0 || this.answered) return;
      const result = checkAnswerLogic();
      this.answered = true;
      this.score = result.score;

      if (result.correct) {
        this.feedback = '✅ Đúng! +10 điểm';
        this.feedbackClass = 'practice-feedback show correct';
        this.meaning = `📖 ${result.expected} — ${result.meaning}`;
      } else {
        this.feedback = `❌ Sai! Đáp án: ${result.expected} — ${result.meaning}`;
        this.feedbackClass = 'practice-feedback show wrong';
        this.meaning = '';
      }
    },

    nextWord() {
      const next = nextWordLogic();
      if (!next) {
        const prog = getProgress();
        this.feedback = `🎉 Hoàn thành! Điểm: ${prog.score}`;
        this.feedbackClass = 'practice-feedback show correct';
        return;
      }
      this.currentWord = next.word;
      this.letters = next.letters;
      this.answer = [];
      this.meaning = '';
      this.feedback = '';
      this.feedbackClass = 'practice-feedback';
      this.answered = false;
      this.hint = `👆 Bấm vào chữ để xếp — từ này nghĩa là: ${next.word.vi}`;
      const prog = getProgress();
      this.current = prog.current;
      this.total = prog.total;
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

.game-header {
  text-align: center;
  margin-bottom: var(--space-4);
}

.game-header h2 {
  margin-bottom: var(--space-3);
}

.game-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  font-size: var(--font-sm);
}

.game-stats strong {
  color: var(--forge-accent);
}

.scramble-card {
  max-width: 500px;
  margin: 0 auto;
  padding: var(--space-4);
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.scramble-hint {
  text-align: center;
  margin-bottom: var(--space-3);
  color: var(--forge-text2);
}

.scramble-letters,
.scramble-answer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
  margin: var(--space-3) 0;
  min-height: 60px;
}

.scramble-tile {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-xl);
  font-weight: 700;
  background: var(--forge-glass);
  border: 2px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  user-select: none;
  color: var(--forge-text);
}

.scramble-tile:hover {
  border-color: var(--forge-accent);
  transform: scale(1.05);
}

.scramble-tile.placed {
  background: var(--forge-accent);
  border-color: var(--forge-accent);
  color: var(--forge-bg);
}

.scramble-meaning {
  text-align: center;
  margin: var(--space-3) 0;
  font-size: var(--font-base);
  color: var(--forge-text);
  min-height: 1.5em;
}

.practice-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.practice-actions button {
  padding: var(--space-2) var(--space-4);
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--forge-text);
}

.practice-actions button:first-child {
  background: var(--forge-accent);
  border-color: var(--forge-accent);
  color: var(--forge-bg);
}

.practice-actions button:hover {
  background: var(--forge-glass-hover);
  border-color: var(--forge-accent);
}

.practice-actions button:first-child:hover {
  opacity: 0.9;
}

.practice-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.practice-feedback {
  text-align: center;
  margin-top: var(--space-3);
  font-weight: 500;
  min-height: 1.5em;
  display: none;
}

.practice-feedback.show {
  display: block;
}

.practice-feedback.correct {
  color: var(--forge-success);
}

.practice-feedback.wrong {
  color: var(--forge-error);
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
