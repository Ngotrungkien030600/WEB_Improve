/**
 * Stories — State & Business Logic
 * Manages story index and word-highlighting.
 */
import { stories } from '../../data/stories.js';

let currentIndex = 0;

export function getCurrentStory() {
  return stories[currentIndex];
}

export function getTotal() {
  return stories.length;
}

export function getCurrentIndex() {
  return currentIndex;
}

export function next() {
  currentIndex = (currentIndex + 1) % stories.length;
  return getCurrentStory();
}

export function prev() {
  currentIndex = (currentIndex - 1 + stories.length) % stories.length;
  return getCurrentStory();
}

export function getWordPairs(story) {
  return story.paragraphs.flatMap((para, lineIdx) => {
    const enWords = para.en.split(/\s+/).filter(w => w.length > 0);
    const viWords = para.vi.split(/\s+/).filter(w => w.length > 0);
    return enWords.map((_, wordIdx) => ({ lineIdx, wordIdx }));
  });
}
