/**
 * Question Words (Wh-questions) — State & Business Logic
 * Manages: wh-word flashcards, sentence scramble, multiple-choice quiz.
 */
import { questionWords } from '../../data/question-words.js';
import { shuffle } from '../../utils/helpers.js';

// --- Flashcards (lý thuyết) ---
let whIndex = 0;

export function getWhWords() {
  return questionWords.whWords;
}

export function getCurrentWh() {
  return questionWords.whWords[whIndex];
}

export function getWhIndex() {
  return whIndex;
}

export function whNext() {
  whIndex = (whIndex + 1) % questionWords.whWords.length;
  return getCurrentWh();
}

export function whPrev() {
  whIndex = (whIndex - 1 + questionWords.whWords.length) % questionWords.whWords.length;
  return getCurrentWh();
}

// --- Scramble (sắp xếp từ) ---
let scrambleIndex = 0;
let shuffledWords = [];
let userAnswer = [];

export function getScrambleTotal() {
  return questionWords.scramble.length;
}

export function getScrambleIndex() {
  return scrambleIndex;
}

export function getCurrentScramble() {
  return questionWords.scramble[scrambleIndex];
}

export function getShuffledWords() {
  return shuffledWords;
}

export function getUserAnswer() {
  return userAnswer;
}

export function loadScramble(index) {
  scrambleIndex = index % questionWords.scramble.length;
  const s = questionWords.scramble[scrambleIndex];
  shuffledWords = shuffle(s.words);
  userAnswer = [];
  return s;
}

export function addScrambleWord(word) {
  const idx = shuffledWords.indexOf(word);
  if (idx !== -1) {
    shuffledWords.splice(idx, 1);
    userAnswer.push(word);
  }
}

export function removeScrambleWord(answerIndex) {
  if (answerIndex >= 0 && answerIndex < userAnswer.length) {
    const word = userAnswer.splice(answerIndex, 1)[0];
    shuffledWords.push(word);
  }
}

export function checkScramble() {
  const s = questionWords.scramble[scrambleIndex];
  const correct = s.words.join(' ');
  const given = userAnswer.join(' ');
  return {
    correct,
    given,
    isCorrect: given === correct,
    explain: s.explain,
    answer: s.answer
  };
}

export function nextScramble() {
  return loadScramble(scrambleIndex + 1);
}

// --- Quiz (trắc nghiệm chọn từ để hỏi) ---
let quizIndex = 0;
let quizAnswered = false;
let quizScore = 0;
let quizTotal = 0;
let quizPool = [];

export function getQuizTotal() {
  return questionWords.quiz.length;
}

export function getQuizPool() {
  return quizPool;
}

export function getQuizScore() {
  return quizScore;
}

export function getQuizTotalAnswered() {
  return quizTotal;
}

export function initQuizPool() {
  quizPool = shuffle(questionWords.quiz);
  quizIndex = 0;
  quizScore = 0;
  quizTotal = 0;
  quizAnswered = false;
  return quizPool;
}

export function getCurrentQuiz() {
  return quizPool[quizIndex];
}

export function submitQuizAnswer(selected) {
  const item = getCurrentQuiz();
  if (!item || quizAnswered) return null;
  quizAnswered = true;
  quizTotal++;
  const isCorrect = selected === item.correct;
  if (isCorrect) quizScore++;
  return {
    isCorrect,
    correct: item.correct,
    explain: item.explain
  };
}

export function nextQuiz() {
  if (quizIndex >= quizPool.length - 1) {
    return 'finish';
  }
  quizIndex++;
  quizAnswered = false;
  return 'next';
}

export function isQuizAnswered() {
  return quizAnswered;
}
