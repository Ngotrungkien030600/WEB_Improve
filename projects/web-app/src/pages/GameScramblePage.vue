<template>
  <div class="game-page">
    <CTopbar
      title="🔀 Xếp chữ"
      back-label="⬅ Tiếng Anh"
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
          <button id="scramble-check" @click="checkAnswer">✅ Kiểm tra</button>
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
      const result = undoLetter();
      if (result) {
        this.letters = result.letters;
        this.answer = result.answer;
      }
    },

    checkAnswer() {
      if (this.answer.length === 0) return;
      const result = checkAnswerLogic();
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
      this.hint = `👆 Bấm vào chữ để xếp — từ này nghĩa là: ${next.word.vi}`;
      const prog = getProgress();
      this.current = prog.current;
      this.total = prog.total;
    },

    handleBack() {
      navigate('/english/hub');
    },
  },
};
</script>

<style scoped>
@import '@legacy/css/variables.css';
@import '@legacy/css/subpage.css';
@import '@legacy/css/components.css';

.game-page {
  min-height: 100vh;
  background: var(--color-bg);
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
  color: var(--color-accent);
}

.scramble-card {
  max-width: 500px;
  margin: 0 auto;
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.scramble-hint {
  text-align: center;
  margin-bottom: var(--space-3);
  color: var(--color-text2);
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
  background: var(--color-surface2);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.scramble-tile:hover {
  border-color: var(--color-accent);
  transform: scale(1.05);
}

.scramble-tile.placed {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.scramble-meaning {
  text-align: center;
  margin: var(--space-3) 0;
  font-size: var(--font-base);
  color: var(--color-text);
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
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.practice-actions button:first-child {
  background: var(--color-accent);
  color: white;
}

.practice-actions button:last-child {
  background: var(--color-surface2);
  color: var(--color-text);
}

.practice-actions button:hover {
  opacity: 0.9;
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
  color: var(--color-success, #2e7d32);
}

.practice-feedback.wrong {
  color: var(--color-error, #c62828);
}
</style>
