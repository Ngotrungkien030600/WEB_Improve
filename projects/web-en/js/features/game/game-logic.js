/**
 * Game (Memory Match) — State & Business Logic
 * Manages card pairs, matching, score, moves, timer.
 */
import { vocabList } from '../../data/vocabulary.js';
import { idiomsList } from '../../data/idioms.js';
import { shuffle } from '../../utils/helpers.js';

const fullVocabList = [...vocabList, ...idiomsList];

let cards = [];
let flipped = [];
let matched = 0;
let moves = 0;
let score = 0;
let locked = false;
let onTimerTick = null;
let timerInterval = null;
let seconds = 0;

export function initGame() {
  const selected = shuffle(fullVocabList).slice(0, 8);
  const pairs = [];
  selected.forEach((word, idx) => {
    pairs.push({ id: idx, text: word.en, pairId: idx });
    pairs.push({ id: idx + 100, text: word.vi, pairId: idx });
  });
  cards = shuffle(pairs);
  flipped = [];
  matched = 0;
  moves = 0;
  score = 0;
  locked = false;
  seconds = 0;
  return cards;
}

export function getCards() {
  return cards;
}

export function getMoves() {
  return moves;
}

export function getScore() {
  return score;
}

export function getMatched() {
  return matched;
}

export function getSeconds() {
  return seconds;
}

export function isLocked() {
  return locked;
}

export function isGameOver() {
  return matched === 16;
}

export function flipCard(pairId, index) {
  if (locked) return null;
  const card = cards[index];
  if (!card || card.matched || card.flipped) return null;

  card.flipped = true;
  flipped.push({ pairId, index });

  if (flipped.length === 2) {
    moves++;
    return checkMatch();
  }
  return { status: 'flip', pairId };
}

function checkMatch() {
  const [a, b] = flipped;
  const cardA = cards[a.index];
  const cardB = cards[b.index];

  if (a.pairId === b.pairId && a.index !== b.index) {
    cardA.matched = true;
    cardB.matched = true;
    matched += 2;
    score += 10;
    flipped = [];
    return { status: 'match', pairIdA: a.pairId, pairIdB: b.pairId, gameOver: matched === 16 };
  }

  locked = true;
  return { status: 'mismatch', indexA: a.index, indexB: b.index };
}

export function unlock() {
  const [a, b] = flipped;
  cards[a.index].flipped = false;
  cards[b.index].flipped = false;
  flipped = [];
  locked = false;
}

export function startTimer(onTick) {
  stopTimer();
  onTimerTick = onTick;
  seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    if (onTimerTick) onTimerTick(seconds);
  }, 1000);
}

export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
