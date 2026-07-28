/**
 * Word Scramble — xếp chữ từ vựng Anh
 */
import { vocabList } from '../../data/vocabulary.js';
import { idiomsList } from '../../data/idioms.js';
import { shuffle } from '../../utils/helpers.js';

const fullList = [...vocabList, ...idiomsList];
let words = [];
let current = 0;
let score = 0;
let letters = [];
let answer = [];

function pickWords() {
  const shuffled = shuffle(fullList);
  words = shuffled.slice(0, 10);
  current = 0;
  score = 0;
}

function getCurrentWord() {
  return words[current];
}

function scrambleWord(word) {
  const arr = word.toUpperCase().split('');
  let s = shuffle(arr);
  while (s.join('') === word.toUpperCase() && s.length > 1) {
    s = shuffle(arr);
  }
  return s;
}

export function initScramble() {
  pickWords();
  const w = getCurrentWord();
  letters = scrambleWord(w.en);
  answer = [];
  return { word: w, letters, current, total: words.length };
}

export function getProgress() {
  return { current: current + 1, total: words.length, score };
}

export function clickLetter(index) {
  if (index < 0 || index >= letters.length) return null;
  const ch = letters.splice(index, 1)[0];
  answer.push(ch);
  return { letters: [...letters], answer: [...answer] };
}

export function undoLetter() {
  if (answer.length === 0) return null;
  const ch = answer.pop();
  letters.push(ch);
  return { letters: [...letters], answer: [...answer] };
}

export function checkAnswer() {
  const w = getCurrentWord();
  const userAns = answer.join('');
  const correct = userAns === w.en.toUpperCase();
  if (correct) score += 10;
  return {
    correct,
    expected: w.en.toUpperCase(),
    meaning: w.vi,
    score
  };
}

export function nextWord() {
  if (current + 1 >= words.length) return null;
  current++;
  const w = getCurrentWord();
  letters = scrambleWord(w.en);
  answer = [];
  return { word: w, letters, current, total: words.length };
}

export function isGameOver() {
  return current + 1 >= words.length;
}
