/**
 * Word Scramble — UI layer
 */
import { initScramble, getProgress, clickLetter, undoLetter, checkAnswer, nextWord, isGameOver } from './game-scramble.js';

export function initScrambleUI() {
  const lettersEl = document.getElementById('scramble-letters');
  const answerEl = document.getElementById('scramble-answer');
  const meaningEl = document.getElementById('scramble-meaning');
  const hintEl = document.getElementById('scramble-hint');
  const feedbackEl = document.getElementById('scramble-feedback');
  const scoreEl = document.getElementById('scramble-score');
  const countEl = document.getElementById('scramble-count');
  const checkBtn = document.getElementById('scramble-check');
  const nextBtn = document.getElementById('scramble-next');

  let data;

  function renderLetters() {
    lettersEl.innerHTML = '';
    data.letters.forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'scramble-tile';
      span.textContent = ch;
      span.addEventListener('click', () => {
        const res = clickLetter(i);
        if (res) { data.letters = res.letters; data.answer = res.answer; renderAll(); }
      });
      lettersEl.appendChild(span);
    });
  }

  function renderAnswer() {
    answerEl.innerHTML = '';
    data.answer.forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'scramble-tile placed';
      span.textContent = ch;
      span.addEventListener('click', () => {
        const res = undoLetter();
        if (res) { data.letters = res.letters; data.answer = res.answer; renderAll(); }
      });
      answerEl.appendChild(span);
    });
  }

  function renderAll() {
    renderLetters();
    renderAnswer();
    const prog = getProgress();
    scoreEl.textContent = prog.score;
    countEl.textContent = `${prog.current}/${prog.total}`;
  }

  function loadRound() {
    data = initScramble();
    meaningEl.textContent = '';
    feedbackEl.textContent = '';
    hintEl.textContent = `👆 Bấm vào chữ để xếp — từ này nghĩa là: ${data.word.vi}`;
    renderAll();
  }

  checkBtn.addEventListener('click', () => {
    if (data.answer.length === 0) return;
    const result = checkAnswer();
    feedbackEl.classList.add('show');
    if (result.correct) {
      feedbackEl.className = 'practice-feedback show correct';
      feedbackEl.innerHTML = '✅ Đúng! +10 điểm';
      meaningEl.textContent = `📖 ${result.expected} — ${result.meaning}`;
    } else {
      feedbackEl.className = 'practice-feedback show wrong';
      feedbackEl.innerHTML = `❌ Sai! Đáp án: <strong>${result.expected}</strong> — ${result.meaning}`;
    }
  });

  nextBtn.addEventListener('click', () => {
    const next = nextWord();
    if (!next) {
      const prog = getProgress();
      feedbackEl.className = 'practice-feedback show correct';
      feedbackEl.innerHTML = `🎉 Hoàn thành! Điểm: ${prog.score}`;
      return;
    }
    data = { word: next.word, letters: next.letters, answer: [] };
    meaningEl.textContent = '';
    feedbackEl.className = 'practice-feedback';
    feedbackEl.textContent = '';
    hintEl.textContent = `👆 Bấm vào chữ để xếp — từ này nghĩa là: ${next.word.vi}`;
    renderAll();
  });

  loadRound();
}
