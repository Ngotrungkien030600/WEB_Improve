/**
 * Practice (Word Ordering) — DOM / UI Layer
 */
import { getCurrentSentence, getTotal, getCurrentIndex, getUserAnswer, getShuffledWords, loadSentence, addWord, removeWord, checkAnswer } from './practice-logic.js';

export function initPracticeUI() {
  const practiceTenseLabel = document.getElementById('practice-tense-label');
  const practiceCounter = document.getElementById('practice-counter');
  const practiceVietnamese = document.getElementById('practice-vietnamese');
  const practiceDropzone = document.getElementById('practice-dropzone');
  const practiceWords = document.getElementById('practice-words');
  const practiceFeedback = document.getElementById('practice-feedback');
  const btnPracticeCheck = document.getElementById('practice-check');
  const btnPracticeReset = document.getElementById('practice-reset');
  const btnPracticeNext = document.getElementById('practice-next');

  function renderWordChips() {
    practiceWords.innerHTML = '';
    getShuffledWords().forEach(word => {
      const chip = document.createElement('button');
      chip.className = 'word-chip';
      chip.textContent = word;
      chip.addEventListener('click', () => {
        addWord(word);
        chip.remove();
        renderDropzone();
      });
      practiceWords.appendChild(chip);
    });
  }

  function renderDropzone() {
    practiceDropzone.innerHTML = '';
    getUserAnswer().forEach((word, idx) => {
      const chip = document.createElement('button');
      chip.className = 'word-chip in-dropzone';
      chip.textContent = word;
      chip.addEventListener('click', () => {
        removeWord(idx);
        renderDropzone();
        renderWordChips();
      });
      practiceDropzone.appendChild(chip);
    });
  }

  function render() {
    const s = getCurrentSentence();
    practiceTenseLabel.textContent = s.tense;
    practiceCounter.textContent = `${getCurrentIndex() + 1} / ${getTotal()}`;
    practiceVietnamese.textContent = s.vi;
    practiceDropzone.innerHTML = '';
    practiceDropzone.classList.remove('correct', 'wrong');
    practiceFeedback.textContent = '';
    practiceFeedback.classList.remove('show', 'correct', 'wrong');
    renderWordChips();
    btnPracticeCheck.disabled = false;
  }

  function handleCheck() {
    const result = checkAnswer();
    practiceDropzone.classList.remove('correct', 'wrong');
    practiceFeedback.classList.remove('correct', 'wrong');

    if (result.isCorrect) {
      practiceDropzone.classList.add('correct');
      practiceFeedback.innerHTML = `<strong>✅ Chính xác!</strong> ${result.explain}`;
      practiceFeedback.classList.add('correct', 'show');
    } else {
      practiceDropzone.classList.add('wrong');
      practiceFeedback.innerHTML = `<strong>❌ Sai rồi!</strong> Câu đúng: "${result.correct}"<br><br><strong>Giải thích:</strong> ${result.explain}`;
      practiceFeedback.classList.add('wrong', 'show');
    }
  }

  function handleReset() {
    loadSentence(getCurrentIndex());
    render();
  }

  function handleNext() {
    loadSentence(getCurrentIndex() + 1);
    render();
  }

  btnPracticeCheck.addEventListener('click', handleCheck);
  btnPracticeReset.addEventListener('click', handleReset);
  btnPracticeNext.addEventListener('click', handleNext);

  // Initial load
  loadSentence(0);
  render();
}
