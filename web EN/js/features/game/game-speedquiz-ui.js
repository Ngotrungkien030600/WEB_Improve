/**
 * Speed Quiz — UI layer
 */
import { initSpeedQuiz, getCurrentQuestion, submitAnswer, nextQuestion, getScore, startTimer, stopTimer, TIME_LIMIT } from './game-speedquiz.js';

export function initSpeedQuizUI() {
  const questionEl = document.getElementById('sq-question');
  const optionsEl = document.getElementById('sq-options');
  const feedbackEl = document.getElementById('sq-feedback');
  const scoreEl = document.getElementById('sq-score');
  const countEl = document.getElementById('sq-count');
  const startBtn = document.getElementById('sq-start');
  const timerFill = document.getElementById('sq-timer-fill');
  const timerText = document.getElementById('sq-timer-text');

  let data;

  function renderQuestion() {
    const q = getCurrentQuestion();
    if (!q) return;
    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => handleAnswer(btn, opt.text, q.index));
      optionsEl.appendChild(btn);
    });
    countEl.textContent = `${q.index + 1}/${q.total}`;
    scoreEl.textContent = getScore();
  }

  function handleAnswer(btn, selected, qIndex) {
    const result = submitAnswer(selected);
    if (!result) return;
    stopTimer();

    // Disable all options
    optionsEl.querySelectorAll('.option').forEach(b => b.style.pointerEvents = 'none');

    // Highlight correct/wrong
    optionsEl.querySelectorAll('.option').forEach(b => {
      if (b.textContent === result.answer) b.classList.add('correct');
      else if (b.textContent === selected && !result.correct) b.classList.add('wrong');
    });

    if (result.correct) {
      feedbackEl.textContent = '✅ Đúng! +10 điểm';
      feedbackEl.style.color = '#2e7d32';
    } else {
      feedbackEl.innerHTML = `❌ Sai! Đáp án: <strong>${result.answer}</strong>`;
      feedbackEl.style.color = '#c62828';
    }
    scoreEl.textContent = result.score;

    setTimeout(() => {
      const next = nextQuestion();
      if (!next) {
        questionEl.textContent = `🎉 Hoàn thành! Điểm: ${result.score}/100`;
        optionsEl.innerHTML = '';
        feedbackEl.textContent = '';
        timerText.textContent = '--';
        timerFill.style.width = '0%';
        return;
      }
      feedbackEl.textContent = '';
      renderQuestion();
      startTimerUI();
    }, 1500);
  }

  function onTimerTick(sec) {
    const pct = (sec / TIME_LIMIT) * 100;
    timerFill.style.width = `${pct}%`;
    timerFill.style.background = sec <= 3 ? '#f5576c' : '#667eea';
    timerText.textContent = `Thời gian: ${sec}s`;
    if (sec <= 0) {
      timerText.textContent = '⏰ Hết giờ!';
      // Auto-submit wrong
      submitAnswer('__timeout__');
      optionsEl.querySelectorAll('.option').forEach(b => {
        if (b.textContent === getCurrentQuestion()?.options.find(o => o.correct)?.text) b.classList.add('correct');
        b.style.pointerEvents = 'none';
      });
      feedbackEl.innerHTML = `⏰ Hết giờ! Đáp án: <strong>${getCurrentQuestion()?.options.find(o => o.correct)?.text}</strong>`;
      setTimeout(() => {
        const next = nextQuestion();
        if (!next) {
          questionEl.textContent = `🎉 Hoàn thành! Điểm: ${getScore()}/100`;
          optionsEl.innerHTML = '';
          return;
        }
        feedbackEl.textContent = '';
        renderQuestion();
        startTimerUI();
      }, 1500);
    }
  }

  function startTimerUI() {
    startTimer(onTimerTick, () => {});
  }

  function startNewGame() {
    stopTimer();
    data = initSpeedQuiz();
    feedbackEl.textContent = '';
    feedbackEl.style.color = '#333';
    renderQuestion();
    startTimerUI();
  }

  startBtn.addEventListener('click', startNewGame);
  startNewGame();
}
