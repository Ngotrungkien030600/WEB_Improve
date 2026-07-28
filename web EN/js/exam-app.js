/**
 * Exam App — Thi Tiếng Anh
 * Standalone page: tách biệt khỏi english.html
 */
import {
  initPool, getCurrentItem, getCurrentType, getPoolLength, getCurrentIndex,
  getScore, getTotal, isAnswered, isStarted,
  submitAnswer, generateChoices, nextQuestion, reset,
  startTimer, tickTimer, getTimerRemaining, getTimerMax, isTimerUnlimited, setTimerInterval, stopTimer,
  setConfig, getConfig, loadHistory, getHistory, saveToHistory,
  QUIZ_TYPES
} from './features/quiz/quiz-logic.js';
import { getLevelText } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('exam-badge');
  const question = document.getElementById('exam-question');
  const hint = document.getElementById('exam-hint');
  const options = document.getElementById('exam-options');
  const feedback = document.getElementById('exam-feedback');
  const score = document.getElementById('exam-score');
  const total = document.getElementById('exam-total');
  const pct = document.getElementById('exam-pct');
  const level = document.getElementById('exam-level');
  const btnNext = document.getElementById('exam-btn-next');
  const progress = document.getElementById('exam-progress');
  const topicTabs = document.querySelectorAll('.exam-topic-tab');
  const questionCount = document.getElementById('exam-question-count');
  const timeMode = document.getElementById('exam-time-mode');
  const timeLimit = document.getElementById('exam-time-limit');
  const btnStart = document.getElementById('exam-start');
  const timerFill = document.getElementById('exam-timer-fill');
  const timerText = document.getElementById('exam-timer-text');
  const timerBar = document.getElementById('exam-timer-bar');
  const historyList = document.getElementById('exam-history-list');

  function renderHistory() {
    const h = getHistory();
    historyList.innerHTML = '';
    if (h.length === 0) {
      historyList.innerHTML = '<li>Chưa có lịch sử thi.</li>';
      return;
    }
    h.slice(0, 10).forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${entry.date}</span><span class="exam-history-score">${entry.score}/${entry.total} (${entry.percent}%) - ${getLevelText(entry.percent)}</span>`;
      historyList.appendChild(li);
    });
  }

  function renderStats() {
    score.textContent = getScore();
    total.textContent = getTotal();
    const p = getTotal() === 0 ? 0 : Math.round((getScore() / getTotal()) * 100);
    pct.textContent = `${p}%`;
    level.textContent = getLevelText(p);
  }

  function renderQuestion() {
    const data = generateChoices();
    const typeData = QUIZ_TYPES[getCurrentType()];
    badge.textContent = typeData.label;
    question.textContent = data.questionText;
    hint.textContent = data.hintText;
    progress.textContent = `Câu ${getCurrentIndex() + 1} / ${getPoolLength()}`;

    options.innerHTML = '';
    data.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'exam-option';
      btn.textContent = choice;
      btn.addEventListener('click', () => handleAnswer(btn, choice, data.correct));
      options.appendChild(btn);
    });

    btnNext.textContent = getCurrentIndex() >= getPoolLength() - 1 ? '🏁 Kết thúc' : 'Câu tiếp theo ➡️';
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
    const p = max > 0 ? (r / max) * 100 : 0;
    timerFill.style.width = `${p}%`;
    timerText.textContent = `Thời gian còn lại: ${r}s`;
    timerText.classList.remove('warning', 'danger');
    if (r <= 5) timerText.classList.add('danger');
    else if (r <= 10) timerText.classList.add('warning');
  }

  function handleAnswer(btn, selected, correct) {
    if (isAnswered()) return;
    stopTimer();
    const result = submitAnswer(selected);
    if (!result) return;

    document.querySelectorAll('.exam-option').forEach(opt => {
      opt.disabled = true;
      if (opt.textContent === correct) opt.classList.add('correct');
    });

    if (result.isCorrect) {
      feedback.textContent = '✅ Chính xác!';
      feedback.className = 'exam-feedback show correct';
    } else {
      btn.classList.add('wrong');
      feedback.textContent = `❌ Sai! Đáp án: ${correct}`;
      feedback.className = 'exam-feedback show wrong';
    }
    renderStats();
  }

  function handleTimeout() {
    if (isAnswered()) return;
    const data = generateChoices();
    submitAnswer('');
    document.querySelectorAll('.exam-option').forEach(opt => {
      opt.disabled = true;
      if (opt.textContent === data.correct) opt.classList.add('correct');
    });
    feedback.textContent = `⏰ Hết giờ! Đáp án: ${data.correct}`;
    feedback.className = 'exam-feedback show wrong';
    renderStats();
  }

  function handleNext() {
    if (!isAnswered()) {
      feedback.textContent = '⚠️ Chọn đáp án trước!';
      feedback.className = 'exam-feedback show wrong';
      return;
    }
    const nav = nextQuestion();
    if (nav === 'finish') {
      saveToHistory();
      const p = getTotal() === 0 ? 0 : Math.round((getScore() / getTotal()) * 100);
      feedback.innerHTML = `🏁 <strong>Hoàn thành!</strong> ${getScore()}/${getTotal()} (${p}%) — ${getLevelText(p)}`;
      feedback.className = 'exam-feedback show correct';
      reset();
      renderStats();
      timerBar.classList.remove('active');
      timerText.classList.remove('active');
      readConfig();
      initPool(getCurrentType());
      renderQuestion();
      startQuestionTimer();
      renderStats();
      renderHistory();
      return;
    }
    feedback.textContent = '';
    feedback.className = 'exam-feedback';
    renderQuestion();
    startQuestionTimer();
  }

  function handleTabClick(tab) {
    stopTimer();
    topicTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    reset();
    readConfig();
    initPool(tab.dataset.quiz);
    renderQuestion();
    startQuestionTimer();
    renderStats();
  }

  function readConfig() {
    const count = parseInt(questionCount.value, 10);
    const mode = timeMode.value;
    const limit = parseInt(timeLimit.value, 10);
    setConfig(count, mode, limit);
    if (mode === 'unlimited') {
      timerBar.classList.remove('active');
      timerText.classList.remove('active');
    } else {
      timerBar.classList.add('active');
      timerText.classList.add('active');
    }
  }

  // Events
  btnNext.addEventListener('click', handleNext);

  btnStart.addEventListener('click', () => {
    readConfig();
    reset();
    initPool(getCurrentType());
    renderQuestion();
    startQuestionTimer();
    renderStats();
  });

  topicTabs.forEach(tab => {
    tab.addEventListener('click', () => handleTabClick(tab));
  });

  [questionCount, timeMode, timeLimit].forEach(el => {
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

  // Init
  loadHistory();
  renderHistory();
  readConfig();
  initPool(getCurrentType());
  renderQuestion();
  startQuestionTimer();
  renderStats();
});
