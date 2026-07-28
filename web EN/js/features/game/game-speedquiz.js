/**
 * Speed Quiz — trắc nghiệm nhanh từ vựng
 */
import { vocabList } from '../../data/vocabulary.js';
import { idiomsList } from '../../data/idioms.js';
import { shuffle } from '../../utils/helpers.js';

const fullList = [...vocabList, ...idiomsList];
let questions = [];
let current = 0;
let score = 0;
let answered = false;
let timerInterval = null;
let seconds = 0;
const TIME_LIMIT = 10;

function pickQuestions() {
  const shuffled = shuffle(fullList);
  questions = [];
  for (let i = 0; i < 10; i++) {
    const correct = shuffled[i];
    const wrongPool = fullList.filter(w => w.en !== correct.en);
    const wrongs = shuffle(wrongPool).slice(0, 3);
    const options = shuffle([
      { text: correct.en, correct: true },
      { text: wrongs[0].en, correct: false },
      { text: wrongs[1].en, correct: false },
      { text: wrongs[2].en, correct: false }
    ]);
    questions.push({
      word: correct,
      question: `"${correct.vi}" nghĩa là gì?`,
      options
    });
  }
  current = 0;
  score = 0;
}

export function initSpeedQuiz() {
  pickQuestions();
  answered = false;
  return { question: questions[0], current: 0, total: 10 };
}

export function getCurrentQuestion() {
  if (current >= questions.length) return null;
  return { ...questions[current], index: current, total: questions.length };
}

export function submitAnswer(selectedText) {
  if (answered) return null;
  answered = true;
  const q = questions[current];
  const correct = q.options.find(o => o.correct);
  const isCorrect = selectedText === correct.text;
  if (isCorrect) score += 10;
  return { correct: isCorrect, answer: correct.text, score };
}

export function nextQuestion() {
  if (current + 1 >= questions.length) return null;
  current++;
  answered = false;
  return { question: questions[current], current, total: questions.length };
}

export function getScore() {
  return score;
}

export function getProgress() {
  return { current: current + 1, total: questions.length };
}

export function isGameOver() {
  return current + 1 >= questions.length;
}

export function startTimer(onTick, onEnd) {
  stopTimer();
  seconds = TIME_LIMIT;
  timerInterval = setInterval(() => {
    seconds--;
    if (onTick) onTick(seconds);
    if (seconds <= 0) {
      stopTimer();
      if (onEnd) onEnd();
    }
  }, 1000);
}

export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

export { TIME_LIMIT };
