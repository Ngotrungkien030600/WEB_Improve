/**
 * Tenses — DOM / UI Layer
 * Renders the tense flip-card and handles sub-tab switching.
 */
import { getCurrentTense, getTotal, getCurrentIndex, next, prev } from './tenses-logic.js';

export function initTensesUI() {
  const tenseCard = document.getElementById('tense-card');
  const tenseName = document.getElementById('tense-name');
  const tenseTitle = document.getElementById('tense-title');
  const tenseForm = document.getElementById('tense-form');
  const tenseUsage = document.getElementById('tense-usage');
  const tenseSignal = document.getElementById('tense-signal');
  const tenseExampleEn = document.getElementById('tense-example-en');
  const tenseExampleVi = document.getElementById('tense-example-vi');
  const tenseCounter = document.getElementById('tense-counter');
  const tenseNote = document.getElementById('tense-note');

  // Sub-tab switching
  const tenseSubtabs = document.querySelectorAll('.tense-subtab');
  const tensePanels = {
    learn: document.getElementById('tense-learn'),
    practice: document.getElementById('tense-practice')
  };

  function setTenseMode(mode) {
    tenseSubtabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tense-mode="${mode}"]`).classList.add('active');
    Object.values(tensePanels).forEach(p => p.classList.remove('active'));
    tensePanels[mode].classList.add('active');
  }

  tenseSubtabs.forEach(tab => {
    tab.addEventListener('click', () => setTenseMode(tab.dataset.tenseMode));
  });

  function render() {
    const t = getCurrentTense();
    tenseName.textContent = t.name;
    tenseTitle.textContent = t.title;
    tenseForm.textContent = t.form;
    tenseUsage.textContent = t.usage;
    tenseSignal.textContent = t.signal;
    tenseExampleEn.textContent = `"${t.exampleEn}"`;
    tenseExampleVi.textContent = `"${t.exampleVi}"`;
    tenseNote.textContent = t.note;
    tenseCounter.textContent = `${getCurrentIndex() + 1} / ${getTotal()}`;
    tenseCard.classList.remove('flipped');
  }

  function handleNext() { next(); render(); }
  function handlePrev() { prev(); render(); }
  function handleFlip() { tenseCard.classList.toggle('flipped'); }

  document.getElementById('tense-next').addEventListener('click', handleNext);
  document.getElementById('tense-prev').addEventListener('click', handlePrev);
  document.getElementById('tense-flip').addEventListener('click', handleFlip);
  tenseCard.addEventListener('click', handleFlip);

  render();

  return {
    onArrowRight: handleNext,
    onArrowLeft: handlePrev,
    onSpaceEnter: (e) => { e.preventDefault(); handleFlip(); }
  };
}
