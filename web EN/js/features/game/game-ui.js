/**
 * Game (Memory Match) — DOM / UI Layer
 */
import { initGame, getCards, getMoves, getScore, getMatched, getSeconds, flipCard, unlock, startTimer, stopTimer, isGameOver } from './game-logic.js';

export function initGameUI() {
  const gameBoard = document.getElementById('game-board');
  const gameScoreEl = document.getElementById('game-score');
  const gameMovesEl = document.getElementById('game-moves');
  const gameTimeEl = document.getElementById('game-time');
  const btnRestart = document.getElementById('game-restart');
  const gameFeedback = document.getElementById('game-feedback');

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function renderBoard() {
    gameBoard.innerHTML = '';
    getCards().forEach((card, index) => {
      const btn = document.createElement('button');
      btn.className = 'game-card';
      if (card.flipped || card.matched) {
        btn.classList.add(card.matched ? 'matched' : 'flipped');
        btn.textContent = card.text;
      } else {
        btn.textContent = '?';
      }
      btn.dataset.index = index;
      btn.dataset.pairId = card.pairId;
      btn.addEventListener('click', () => handleFlip(btn));
      gameBoard.appendChild(btn);
    });
  }

  function updateStats() {
    gameScoreEl.textContent = getScore();
    gameMovesEl.textContent = getMoves();
  }

  function handleFlip(btn) {
    const index = parseInt(btn.dataset.index, 10);
    const pairId = parseInt(btn.dataset.pairId, 10);
    const result = flipCard(pairId, index);
    if (!result) return;

    // Show the flipped card
    const card = getCards()[index];
    btn.classList.add('flipped');
    btn.textContent = card.text;

    if (result.status === 'match') {
      gameFeedback.textContent = '✅ Đúng rồi! +10 điểm';
      // Mark both matched visually
      document.querySelectorAll(`[data-pair-id="${result.pairIdA}"]`).forEach(el => {
        el.classList.remove('flipped');
        el.classList.add('matched');
      });
      updateStats();

      if (result.gameOver) {
        stopTimer();
        gameFeedback.innerHTML = `<strong>🎉 Chiến thắng!</strong><br>Điểm: ${getScore()} | Bước: ${getMoves()} | Thời gian: ${gameTimeEl.textContent}`;
      }
    } else if (result.status === 'mismatch') {
      gameFeedback.textContent = '❌ Sai rồi, thử lại nhé!';
      updateStats();
      setTimeout(() => {
        const btns = gameBoard.querySelectorAll('.game-card');
        btns[result.indexA].classList.remove('flipped');
        btns[result.indexA].textContent = '?';
        btns[result.indexB].classList.remove('flipped');
        btns[result.indexB].textContent = '?';
        unlock();
      }, 800);
    }
  }

  function startNewGame() {
    initGame();
    startTimer((sec) => {
      gameTimeEl.textContent = formatTime(sec);
    });
    renderBoard();
    updateStats();
    gameFeedback.textContent = 'Tìm các cặp từ vựng Anh - Việt!';
    gameTimeEl.textContent = '00:00';
  }

  btnRestart.addEventListener('click', startNewGame);
  startNewGame();
}
