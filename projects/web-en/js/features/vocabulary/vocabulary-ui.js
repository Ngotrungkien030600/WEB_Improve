/**
 * Vocabulary — DOM / UI Layer
 * Binds DOM elements, renders the card, attaches events.
 */
import { getCurrentWord, getTotal, getCurrentIndex, next, prev, filterByCategory } from './vocabulary-logic.js';
import { speakText } from '../../utils/helpers.js';

export function initVocabularyUI() {
  const vocabCard = document.getElementById('vocab-card');
  const vocabEn = document.getElementById('vocab-en');
  const vocabPhonetic = document.getElementById('vocab-phonetic');
  const vocabTag = document.getElementById('vocab-tag');
  const vocabVi = document.getElementById('vocab-vi');
  const vocabExampleEn = document.getElementById('vocab-example-en');
  const vocabExampleVi = document.getElementById('vocab-example-vi');
  const vocabCounter = document.getElementById('vocab-counter');
  const vocabCategory = document.getElementById('vocab-category');
  const vocabSpeak = document.getElementById('vocab-speak');

  function render() {
    const word = getCurrentWord();
    vocabEn.textContent = word.en;
    vocabPhonetic.textContent = word.phonetic;
    vocabTag.textContent = word.category;
    vocabVi.textContent = word.vi;
    vocabExampleEn.textContent = `"${word.exampleEn}"`;
    vocabExampleVi.textContent = `"${word.exampleVi}"`;
    vocabCounter.textContent = `${getCurrentIndex() + 1} / ${getTotal()}`;
    vocabCard.classList.remove('flipped');
  }

  function handleNext() { next(); render(); }
  function handlePrev() { prev(); render(); }
  function handleFlip() { vocabCard.classList.toggle('flipped'); }

  function handleFilter() {
    filterByCategory(vocabCategory.value);
    render();
  }

  // Event listeners
  vocabCategory.addEventListener('change', handleFilter);
  document.getElementById('vocab-next').addEventListener('click', handleNext);
  document.getElementById('vocab-prev').addEventListener('click', handlePrev);
  document.getElementById('vocab-flip').addEventListener('click', handleFlip);
  vocabCard.addEventListener('click', (e) => {
    if (e.target.closest('#vocab-speak')) return;
    handleFlip();
  });
  vocabSpeak.addEventListener('click', (e) => {
    e.stopPropagation();
    speakText(getCurrentWord().en);
  });

  // Initial render (logic layer already initialized)
  render();

  return {
    onArrowRight: handleNext,
    onArrowLeft: handlePrev,
    onSpaceEnter: (e) => { e.preventDefault(); handleFlip(); }
  };
}
