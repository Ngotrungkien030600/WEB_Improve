/**
 * Quiz — State & Business Logic
 * Manages quiz types, question pools, scoring, timers, history.
 */
import { vocabList } from '../../data/vocabulary.js';
import { idiomsList } from '../../data/idioms.js';
import { practiceSentences } from '../../data/practice.js';
import { shuffle } from '../../utils/helpers.js';

const fullVocabList = [...vocabList, ...idiomsList];

// --- Build question pools from source data ---
const tenseIdentifyQuestions = practiceSentences.map(s => ({
  question: s.words.join(' '),
  correct: s.tense
}));

const sentenceBuildQuestions = practiceSentences.map(s => ({
  question: s.vi,
  correct: s.words.join(' '),
  wrongPool: practiceSentences.filter(x => x !== s)
}));

export const QUIZ_TYPES = {
  vocab: {
    label: 'Từ vựng',
    pool: fullVocabList,
    questionText: item => item.en,
    correctText: item => item.vi,
    hintText: item => `Ví dụ: ${item.exampleEn}`,
    wrongFilter: (item, x) => x.en !== item.en
  },
  tense: {
    label: 'Nhận diện thì',
    pool: tenseIdentifyQuestions,
    questionText: item => item.question,
    correctText: item => item.correct,
    hintText: () => 'Chọn thì phù hợp với câu trên.',
    wrongFilter: (item, x) => x.correct !== item.correct
  },
  sentence: {
    label: 'Đặt câu',
    pool: sentenceBuildQuestions,
    questionText: item => item.question,
    correctText: item => item.correct,
    hintText: () => 'Chọn câu tiếng Anh đúng với nghĩa tiếng Việt.',
    wrongFilter: () => true
  }
};

// --- State ---
let currentType = 'vocab';
let currentIndex = 0;
let score = 0;
let total = 0;
let answered = false;
let pool = [];
let questionCount = 10;
let timeMode = 'per-question';
let timeLimit = 15;
let timerRemaining = 0;
let timerTotal = 0;
let timerInterval = null;
let started = false;
let history = [];

// --- Init ---
export function loadHistory() {
  try {
    history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
  } catch {
    history = [];
  }
  return history;
}

export function saveToHistory() {
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);
  const entry = { type: currentType, score, total, percent, date: new Date().toLocaleString('vi-VN') };
  history.unshift(entry);

  const MAX_HISTORY = 50;
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }

  try {
    localStorage.setItem('quizHistory', JSON.stringify(history));
  } catch (e) {
    console.warn('quizHistory: localStorage quota exceeded, skipping save', e);
  }
}

export function getHistory() {
  return history;
}

// --- Config ---
export function setConfig(count, mode, limit) {
  questionCount = count;
  timeMode = mode;
  timeLimit = limit;
}

export function getConfig() {
  return { questionCount, timeMode, timeLimit };
}

// --- Pool ---
export function initPool(type) {
  currentType = type;
  const config = QUIZ_TYPES[type];
  pool = shuffle(config.pool).slice(0, questionCount);
  currentIndex = 0;
  score = 0;
  total = 0;
  answered = false;
  started = true;
  timerTotal = timeMode === 'total' ? questionCount * timeLimit : 0;
  return pool;
}

export function getCurrentItem() {
  return pool[currentIndex];
}

export function getCurrentType() {
  return currentType;
}

export function getPoolLength() {
  return pool.length;
}

export function getCurrentIndex() {
  return currentIndex;
}

export function getScore() {
  return score;
}

export function getTotal() {
  return total;
}

export function isAnswered() {
  return answered;
}

export function isStarted() {
  return started;
}

// --- Answer ---
export function submitAnswer(selected) {
  if (answered) return null;
  answered = true;
  total++;

  const config = QUIZ_TYPES[currentType];
  const item = pool[currentIndex];
  const correct = config.correctText(item);
  const isCorrect = selected === correct;
  if (isCorrect) score++;

  return { isCorrect, correct };
}

// --- Timer ---
export function startTimer() {
  stopTimer();
  if (timeMode === 'unlimited') return;
  timerRemaining = timeMode === 'per-question' ? timeLimit : timerTotal;
  return timerRemaining;
}

export function tickTimer() {
  timerRemaining--;
  return timerRemaining;
}

export function getTimerRemaining() {
  return timerRemaining;
}

export function getTimerMax() {
  return timeMode === 'total' ? timerTotal : timeLimit;
}

export function isTimerUnlimited() {
  return timeMode === 'unlimited';
}

export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

export function setTimerInterval(fn, ms) {
  stopTimer();
  timerInterval = setInterval(fn, ms);
}

// --- Navigation ---
export function nextQuestion() {
  if (!answered) return null;
  if (currentIndex >= pool.length - 1) return 'finish';
  currentIndex++;
  answered = false;
  return 'next';
}

export function reset() {
  stopTimer();
  currentIndex = 0;
  score = 0;
  total = 0;
  answered = false;
  started = false;
}

// --- Choices generation ---
export function generateChoices() {
  const config = QUIZ_TYPES[currentType];
  const item = pool[currentIndex];
  const correct = config.correctText(item);
  let choices;

  if (currentType === 'sentence') {
    const wrong = shuffle(item.wrongPool).slice(0, 3).map(x => x.words.join(' '));
    choices = shuffle([correct, ...wrong]);
  } else {
    const wrongAnswers = config.pool
      .filter(x => config.wrongFilter(item, x))
      .map(x => config.correctText(x));
    choices = shuffle([correct, ...shuffle(wrongAnswers).slice(0, 3)]);
  }

  return { choices, correct, questionText: config.questionText(item), hintText: config.hintText(item), label: config.label };
}
