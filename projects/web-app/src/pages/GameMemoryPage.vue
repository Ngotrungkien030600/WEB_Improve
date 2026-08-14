<template>
  <div class="game-page">
    <CTopbar
      title="🃏 Ghép cặp từ vựng"
      back-label="Tiếng Anh"
      @go-home="handleBack"
    />

    <div class="subpage-content">
      <div class="game-header">
        <h2>🃏 Ghép cặp từ vựng</h2>
        <div class="game-stats">
          <span>Điểm: <strong id="game-score">{{ score }}</strong></span>
          <span>Bước: <strong id="game-moves">{{ moves }}</strong></span>
          <span>Thời gian: <strong id="game-time">{{ formatTime(seconds) }}</strong></span>
        </div>
      </div>
      <p class="game-feedback" id="game-feedback">{{ feedback }}</p>

      <div class="game-board" id="game-board">
        <button
          v-for="(card, index) in cards"
          :key="index"
          class="game-card"
          :class="{
            flipped: card.flipped || card.matched,
            matched: card.matched
          }"
          :data-index="index"
          :data-pair-id="card.pairId"
          @click="handleFlip(index, card)"
        >
          {{ card.flipped || card.matched ? card.text : '?' }}
        </button>
      </div>

      <div style="text-align:center;">
        <button class="btn-restart" @click="restartGame">🔄 Chơi lại</button>
      </div>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import { navigate } from '../utils/navigate.js';
import {
  initGame,
  getCards,
  getMoves,
  getScore,
  getMatched,
  getSeconds,
  flipCard,
  unlock,
  startTimer,
  stopTimer,
  isGameOver
} from '@legacy/js/features/game/game-logic.js';

export default {
  name: 'GameMemoryPage',
  components: { CTopbar },

  data() {
    return {
      cards: [],
      score: 0,
      moves: 0,
      seconds: 0,
      feedback: 'Tìm các cặp từ vựng Anh - Việt!',
      locked: false,
      timerInterval: null,
    };
  },

  mounted() {
    this.initGame();
  },

  beforeUnmount() {
    this.stopMyTimer();
  },

  methods: {
    initGame() {
      this.cards = initGame();
      this.score = 0;
      this.moves = 0;
      this.seconds = 0;
      this.feedback = 'Tìm các cặp từ vựng Anh - Việt!';
      this.locked = false;
      this.startMyTimer();
    },

    startMyTimer() {
      this.stopMyTimer();
      this.timerInterval = setInterval(() => {
        this.seconds++;
      }, 1000);
    },

    stopMyTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    formatTime(s) {
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const sec = (s % 60).toString().padStart(2, '0');
      return `${m}:${sec}`;
    },

    handleFlip(index, card) {
      if (this.locked) return;
      if (card.flipped || card.matched) return;

      const result = flipCard(card.pairId, index);
      if (!result) return;

      // Update card state
      const cards = getCards();
      this.cards = cards.map((c, i) => ({ ...c, flipped: c.flipped || (i === index), matched: c.matched }));
      this.score = getScore();
      this.moves = getMoves();

      if (result.status === 'match') {
        this.feedback = '✅ Đúng rồi! +10 điểm';
        this.cards = getCards().map(c => ({ ...c }));
        this.score = getScore();

        if (result.gameOver) {
          this.stopMyTimer();
          this.feedback = `🎉 Chiến thắng! Điểm: ${this.score} | Bước: ${this.moves} | Thời gian: ${this.formatTime(this.seconds)}`;
        }
      } else if (result.status === 'mismatch') {
        this.feedback = '❌ Sai rồi, thử lại nhé!';
        this.locked = true;

        setTimeout(() => {
          unlock();
          this.cards = getCards().map(c => ({ ...c }));
          this.locked = false;
        }, 800);
      }
    },

    restartGame() {
      this.initGame();
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
  color: var(--forge-text);
  margin-bottom: var(--space-3);
}

.game-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  font-size: var(--font-sm);
  color: var(--forge-text2);
}

.game-stats strong {
  color: var(--forge-fire);
}

.game-feedback {
  text-align: center;
  margin: var(--space-4) 0;
  font-weight: 600;
  font-size: var(--font-base);
  color: var(--forge-text);
  min-height: 1.5em;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-4);
}

@media (max-width: 400px) {
  .game-board {
    grid-template-columns: repeat(3, 1fr);
  }
}

.game-card {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--forge-text);
  background: var(--forge-glass);
  border: 2px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  cursor: pointer;
  transition: all var(--transition-spring);
  user-select: none;
}

.game-card:hover:not(.flipped):not(.matched) {
  border-color: var(--forge-accent);
  transform: scale(1.02);
}

.game-card.flipped {
  background: var(--forge-glass-hover);
  border-color: var(--forge-accent);
}

.game-card.matched {
  background: rgba(34, 197, 94, 0.15);
  border-color: var(--forge-success);
  color: var(--forge-success);
  opacity: 0.8;
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
