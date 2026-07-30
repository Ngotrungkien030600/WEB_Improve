/**
 * Practice (Word Ordering) — State & Business Logic
 * Manages current sentence, shuffled words, answer tracking.
 */
import { practiceSentences } from '../../data/practice.js';
import { shuffle } from '../../utils/helpers.js';

let currentIndex = 0;
let shuffledWords = [];
let userAnswer = [];

export function getCurrentSentence() {
  return practiceSentences[currentIndex];
}

export function getTotal() {
  return practiceSentences.length;
}

export function getCurrentIndex() {
  return currentIndex;
}

export function getShuffledWords() {
  return shuffledWords;
}

export function getUserAnswer() {
  return userAnswer;
}

export function loadSentence(index) {
  currentIndex = index % practiceSentences.length;
  const s = practiceSentences[currentIndex];
  shuffledWords = shuffle(s.words);
  userAnswer = [];
  return s;
}

export function addWord(word) {
  const idx = shuffledWords.indexOf(word);
  if (idx !== -1) {
    shuffledWords.splice(idx, 1);
    userAnswer.push(word);
  }
}

export function removeWord(answerIndex) {
  if (answerIndex >= 0 && answerIndex < userAnswer.length) {
    const word = userAnswer.splice(answerIndex, 1)[0];
    shuffledWords.push(word);
  }
}

export function checkAnswer() {
  const s = practiceSentences[currentIndex];
  const correct = s.words.join(' ');
  const given = userAnswer.join(' ');
  return {
    correct,
    given,
    isCorrect: given === correct,
    explain: s.explain
  };
}

export function next() {
  return loadSentence(currentIndex + 1);
}
