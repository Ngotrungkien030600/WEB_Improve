/**
 * SkillForge — English Learning App
 * Entry point — wires UI modules from each feature.
 */
import { initVocabularyUI } from './features/vocabulary/vocabulary-ui.js';
import { initTensesUI } from './features/tenses/tenses-ui.js';
import { initPracticeUI } from './features/practice/practice-ui.js';
import { initStoriesUI } from './features/stories/stories-ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  const sections = {
    vocab: document.getElementById('vocab-section'),
    tense: document.getElementById('tense-section'),
    story: document.getElementById('story-section'),
    game: document.getElementById('game-section'),
  };

  let activeMode = 'vocab';

  function setMode(mode) {
    activeMode = mode;
    tabs.forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.tab[data-mode="${mode}"]`);
    if (activeTab) activeTab.classList.add('active');
    Object.values(sections).forEach(s => s?.classList.remove('active'));
    if (sections[mode]) sections[mode].classList.add('active');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  // Support anchor hash for direct tab access (#vocab, #tense, #story, #game)
  const hash = window.location.hash.replace('#', '');
  if (hash && sections[hash]) {
    setMode(hash);
  }

  // Initialize feature UIs
  const { onArrowRight: vocabRight, onArrowLeft: vocabLeft, onSpaceEnter: vocabEnter } = initVocabularyUI();
  const { onArrowRight: tenseRight, onArrowLeft: tenseLeft, onSpaceEnter: tenseEnter } = initTensesUI();
  initPracticeUI();
  initStoriesUI();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const section = sections[activeMode];
    if (!section || !section.classList.contains('active')) return;

    if (activeMode === 'vocab') {
      if (e.key === 'ArrowRight') vocabRight();
      else if (e.key === 'ArrowLeft') vocabLeft();
      else if (e.key === ' ' || e.key === 'Enter') vocabEnter(e);
    } else if (activeMode === 'tense') {
      if (e.key === 'ArrowRight') tenseRight();
      else if (e.key === 'ArrowLeft') tenseLeft();
      else if (e.key === ' ' || e.key === 'Enter') tenseEnter(e);
    }
  });
});
