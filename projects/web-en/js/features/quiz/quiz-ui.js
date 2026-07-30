/**
 * Quiz — DOM / UI Layer
 * Binds all quiz DOM elements, renders questions, handles events.
 */
import {
  initPool, getCurrentItem, getCurrentType, getPoolLength, getCurrentIndex,
  getScore, getTotal, isAnswered, isStarted,
  submitAnswer, generateChoices, nextQuestion, reset,
  startTimer, tickTimer, getTimerRemaining, getTimerMax, isTimerUnlimited, setTimerInterval, stopTimer,
  setConfig, getConfig, loadHistory, getHistory, saveToHistory,
  QUIZ_TYPES
} from './quiz-logic.js';
import { getLevelText } from '../../utils/helpers.js';

const $ = id => document.getElementById(id);

export function initQuizUI() {
  // DOM refs
  const quizLabel = $('quiz-label');
  const quizQuestion = $('quiz-question');
  const quizHint = $('quiz-hint');
  const optionsEl = $('options');
  const feedbackEl = $('quiz-feedback');
  const scoreEl = $('score');
  const totalEl = $('total');
  const btnNext = $('btn-next-quiz');
  const quizTabs = document.querySelectorAll('.quiz-tab');
  const quizLevelEl = $('quiz-level');
  const quizProgressEl = $('quiz-progress');
  const historyList = $('quiz-history-list');
  const questionCountEl = $('quiz-question-count');
  const timeModeEl = $('quiz-time-mode');
  const timeLimitEl = $('quiz-time-limit');
  const btnStart = $('quiz-start');
  const timerFill = $('quiz-timer-fill');
  const timerText = $('quiz-timer-text');
  const timerBar = document.querySelector('.quiz-timer-bar');

  // --- Render helpers ---
  function renderHistory() {
    if (!historyList) return;
    const h = getHistory();
    historyList.innerHTML = '';
    if (h.length === 0) {
      historyList.innerHTML = '<li>Chưa có lịch sử thi.</li>';
      return;
    }
    h.slice(0, 10).forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${entry.date}</span><span><strong>${entry.score}/${entry.total}</strong> (${entry.percent}%) - ${getLevelText(entry.percent)}</span>`;
      historyList.appendChild(li);
    });
  }

  function renderStats() {
    scoreEl.textContent = getScore();
    totalEl.textContent = getTotal();
    const pct = getTotal() === 0 ? 0 : Math.round((getScore() / getTotal()) * 100);
    quizLevelEl.textContent = `Trình độ: ${pct}% - ${getLevelText(pct)}`;
    const progress = Math.round(((getCurrentIndex() + 1) / getPoolLength()) * 100);
    quizProgressEl.textContent = `Tiến độ: ${progress}%`;
  }

  function renderQuestion() {
    const data = generateChoices();

    const typeData = QUIZ_TYPES[getCurrentType()];
    quizLabel.textContent = typeData.label;
    quizQuestion.textContent = data.questionText;
    quizHint.textContent = data.hintText;

    optionsEl.innerHTML = '';
    data.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = choice;
      btn.addEventListener('click', () => handleAnswer(btn, choice, data.correct));
      optionsEl.appendChild(btn);
    });

    const progress = Math.round((getCurrentIndex() / getPoolLength()) * 100);
    quizProgressEl.textContent = `Tiến độ: ${progress}%`;
    btnNext.textContent = getCurrentIndex() >= getPoolLength() - 1 ? '🏁 Kết thúc bài thi' : 'Câu tiếp theo ➡️';
  }

  function startQuestionTimer() {
    const remaining = startTimer();
    if (remaining === undefined) return;
    updateTimerDisplay();
    setTimerInterval(() => {
      const r = tickTimer();
      updateTimerDisplay();
      if (r <= 0) {
        stopTimer();
        handleTimeout();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    if (isTimerUnlimited()) return;
    const max = getTimerMax();
    const r = getTimerRemaining();
    const pct = max > 0 ? (r / max) * 100 : 0;
    timerFill.style.width = `${pct}%`;
    timerText.textContent = `Thời gian còn lại: ${r}s`;
    timerText.classList.remove('warning', 'danger');
    if (r <= 5) timerText.classList.add('danger');
    else if (r <= 10) timerText.classList.add('warning');
  }

  // --- Handlers ---
  function handleAnswer(btn, selected, correct) {
    if (isAnswered()) return;
    stopTimer();

    const result = submitAnswer(selected);
    if (!result) return;

    document.querySelectorAll('.option').forEach(opt => {
      opt.disabled = true;
      if (opt.textContent === correct) opt.classList.add('correct');
    });

    if (result.isCorrect) {
      feedbackEl.textContent = '✅ Chính xác! Tuyệt vời!';
      feedbackEl.classList.add('correct');
    } else {
      btn.classList.add('wrong');
      feedbackEl.textContent = `❌ Sai rồi! Đáp án đúng là: ${correct}`;
      feedbackEl.classList.add('wrong');
    }
    renderStats();
  }

  function handleTimeout() {
    if (isAnswered()) return;
    const data = generateChoices();
    submitAnswer('');

    document.querySelectorAll('.option').forEach(opt => {
      opt.disabled = true;
      if (opt.textContent === data.correct) opt.classList.add('correct');
    });

    feedbackEl.textContent = `⏰ Hết thời gian! Đáp án đúng là: ${data.correct}`;
    feedbackEl.classList.add('wrong');
    renderStats();
  }

  function handleNext() {
    if (!isAnswered()) {
      feedbackEl.textContent = '⚠️ Hãy chọn một đáp án trước!';
      feedbackEl.className = 'quiz-feedback wrong';
      return;
    }

    const nav = nextQuestion();
    if (nav === 'finish') {
      saveToHistory();
      const pct = getTotal() === 0 ? 0 : Math.round((getScore() / getTotal()) * 100);
      feedbackEl.innerHTML = `<strong>🏁 Kết thúc bài thi!</strong><br>Điểm: ${getScore()}/${getTotal()} (${pct}%)<br>${getLevelText(pct)}`;
      feedbackEl.classList.add('show');
      reset();
      renderStats();
      timerBar.classList.remove('active');
      timerText.classList.remove('active');
      // Start new session
      readConfig();
      initPool(getCurrentType());
      renderQuestion();
      startQuestionTimer();
      renderStats();
      return;
    }

    feedbackEl.textContent = '';
    feedbackEl.className = 'quiz-feedback';
    renderQuestion();
    startQuestionTimer();
  }

  function handleTabClick(tab) {
    stopTimer();
    quizTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    reset();
    readConfig();
    initPool(tab.dataset.quiz);
    renderQuestion();
    startQuestionTimer();
    renderStats();
  }

  function readConfig() {
    const count = parseInt(questionCountEl.value, 10);
    const mode = timeModeEl.value;
    const limit = parseInt(timeLimitEl.value, 10);
    setConfig(count, mode, limit);

    if (mode === 'unlimited') {
      timerBar.classList.remove('active');
      timerText.classList.remove('active');
    } else {
      timerBar.classList.add('active');
      timerText.classList.add('active');
    }
  }

  // --- Events ---
  btnNext.addEventListener('click', handleNext);

  btnStart.addEventListener('click', () => {
    readConfig();
    reset();
    initPool(getCurrentType());
    renderQuestion();
    startQuestionTimer();
    renderStats();
  });

  quizTabs.forEach(tab => {
    tab.addEventListener('click', () => handleTabClick(tab));
  });

  [questionCountEl, timeModeEl, timeLimitEl].forEach(el => {
    el.addEventListener('change', () => {
      if (isStarted()) {
        readConfig();
        reset();
        initPool(getCurrentType());
        renderQuestion();
        startQuestionTimer();
        renderStats();
      }
    });
  });

  // --- Init ---
  loadHistory();
  renderHistory();
  readConfig();
  initPool(getCurrentType());
  renderQuestion();
  startQuestionTimer();
  renderStats();
}
