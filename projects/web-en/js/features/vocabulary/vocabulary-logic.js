/**
 * Vocabulary — State & Business Logic
 * Manages vocab list, filtering, shuffle, navigation index.
 */
import { vocabList } from '../../data/vocabulary.js';
import { idiomsList } from '../../data/idioms.js';
import { shuffle } from '../../utils/helpers.js';

const fullVocabList = [...vocabList, ...idiomsList];

let currentIndex = 0;
let filteredList = [...fullVocabList];

export function getCurrentIndex() {
  return currentIndex;
}

export function getFilteredList() {
  return filteredList;
}

export function getCurrentWord() {
  return filteredList[currentIndex];
}

export function getTotal() {
  return filteredList.length;
}

export function next() {
  currentIndex = (currentIndex + 1) % filteredList.length;
  return getCurrentWord();
}

export function prev() {
  currentIndex = (currentIndex - 1 + filteredList.length) % filteredList.length;
  return getCurrentWord();
}

export function filterByCategory(category) {
  const source = category === 'all' ? [...fullVocabList] : fullVocabList.filter(w => w.category === category);
  filteredList = shuffle(source);
  currentIndex = 0;
  return getCurrentWord();
}

export function getAllCategories() {
  const all = [...fullVocabList];
  return [...new Set(all.map(w => w.category))];
}
