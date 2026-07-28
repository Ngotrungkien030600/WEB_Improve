/**
 * Tenses — State & Business Logic
 * Manages tense list and navigation index.
 */
import { tenses } from '../../data/tenses.js';

let currentIndex = 0;

export function getCurrentTense() {
  return tenses[currentIndex];
}

export function getTotal() {
  return tenses.length;
}

export function getCurrentIndex() {
  return currentIndex;
}

export function next() {
  currentIndex = (currentIndex + 1) % tenses.length;
  return getCurrentTense();
}

export function prev() {
  currentIndex = (currentIndex - 1 + tenses.length) % tenses.length;
  return getCurrentTense();
}
