/**
 * Question Words (Wh-questions) — DOM / UI Layer
 * Renders: wh-word flashcards (learn), scramble practice, MC quiz.
 */
import {
  getCurrentWh, getWhIndex, getWhWords, whNext, whPrev,
  getScrambleTotal, getScrambleIndex, getCurrentScramble,
  getShuffledWords, getUserAnswer, loadScramble, addScrambleWord,
  removeScrambleWord, checkScramble, nextScramble,
  getQuizPool, getQuizScore, getQuizTotalAnswered, initQuizPool,
  getCurrentQuiz, submitQuizAnswer, nextQuiz, isQuizAnswered
} from './question-words-logic.js';

export function initQuestionWordsUI() {
  // === Sub-tab switching (learn / practice) ===
  const subtabs = document.querySelectorAll('.question-subtab');
  const panels = {
    learn: document.getElementById('qw-learn'),
    practice: document.getElementById('qw-practice'),
  };

  function switchSubTab(mode) {
    subtabs.forEach(t => t.classList.toggle('active', t.dataset.questionMode === mode));
    Object.values(panels).forEach(p => p?.classList.remove('active'));
    if (panels[mode]) panels[mode].classList.add('active');
  }
  subtabs.forEach(tab => tab.addEventListener('click', () => switchSubTab(tab.dataset.questionMode)));

  // ===================================================================
  // 1. FLASHCARD — Lý thuyết từ để hỏi
  // ===================================================================
  const qwCard = document.getElementById('qw-card');
  const qwWord = document.getElementById('qw-word');
  const qwUsage = document.getElementById('qw-usage');
  const qwStructure = document.getElementById('qw-structure');
  const qwExampleQ = document.getElementById('qw-example-q');
  const qwExampleVi = document.getElementById('qw-example-vi');
  const qwExampleA = document.getElementById('qw-example-a');
  const qwCounter = document.getElementById('qw-counter');
  const qwPrevBtn = document.getElementById('qw-prev');
  const qwFlipBtn = document.getElementById('qw-flip');
  const qwNextBtn = document.getElementById('qw-next');

  function renderWh() {
    const w = getCurrentWh();
    qwWord.textContent = w.word;
    qwUsage.textContent = w.usage;
    qwStructure.textContent = w.structure;
    const ex = w.examples[0];
    qwExampleQ.textContent = `❓ ${ex.q}`;
    qwExampleVi.textContent = ex.vi;
    qwExampleA.textContent = `💬 ${ex.a}`;
    qwCounter.textContent = `${getWhIndex() + 1} / ${getWhWords().length}`;
    qwCard.classList.remove('flipped');
  }

  function qwFlip() {
    qwCard.classList.toggle('flipped');
  }
  function qwGoNext() {
    whNext();
    renderWh();
  }
  function qwGoPrev() {
    whPrev();
    renderWh();
  }

  if (qwPrevBtn) qwPrevBtn.addEventListener('click', qwGoPrev);
  if (qwFlipBtn) qwFlipBtn.addEventListener('click', qwFlip);
  if (qwNextBtn) qwNextBtn.addEventListener('click', qwGoNext);
  if (qwCard) qwCard.addEventListener('click', qwFlip);

  // ===================================================================
  // 2. SCRAMBLE — Sắp xếp từ thành câu hỏi
  // ===================================================================
  const qwScrambleLabel = document.getElementById('qw-scramble-label');
  const qwScrambleCounter = document.getElementById('qw-scramble-counter');
  const qwPracticeVi = document.getElementById('qw-practice-vi');
  const qwDropzone = document.getElementById('qw-dropzone');
  const qwWords = document.getElementById('qw-words');
  const qwFeedback = document.getElementById('qw-feedback');
  const qwCheckBtn = document.getElementById('qw-check');
  const qwResetBtn = document.getElementById('qw-reset');
  const qwNextScrambleBtn = document.getElementById('qw-next-scramble');

  function renderScrambleWords() {
    qwWords.innerHTML = '';
    getShuffledWords().forEach(word => {
      const chip = document.createElement('button');
      chip.className = 'word-chip';
      chip.textContent = word;
      chip.addEventListener('click', () => {
        addScrambleWord(word);
        chip.remove();
        renderScrambleDropzone();
      });
      qwWords.appendChild(chip);
    });
  }

  function renderScrambleDropzone() {
    qwDropzone.innerHTML = '';
    getUserAnswer().forEach((word, idx) => {
      const chip = document.createElement('button');
      chip.className = 'word-chip in-dropzone';
      chip.textContent = word;
      chip.addEventListener('click', () => {
        removeScrambleWord(idx);
        renderScrambleDropzone();
        renderScrambleWords();
      });
      qwDropzone.appendChild(chip);
    });
  }

  function renderScramble() {
    const s = getCurrentScramble();
    qwScrambleLabel.textContent = s.wh;
    qwScrambleCounter.textContent = `${getScrambleIndex() + 1} / ${getScrambleTotal()}`;
    qwPracticeVi.textContent = s.vi;
    qwDropzone.innerHTML = '';
    qwDropzone.classList.remove('correct', 'wrong');
    qwFeedback.textContent = '';
    qwFeedback.classList.remove('show', 'correct', 'wrong');
    renderScrambleWords();
    qwCheckBtn.disabled = false;
  }

  function handleScrambleCheck() {
    const result = checkScramble();
    qwDropzone.classList.remove('correct', 'wrong');
    qwFeedback.classList.remove('correct', 'wrong');

    if (result.isCorrect) {
      qwDropzone.classList.add('correct');
      qwFeedback.innerHTML = `<strong>✅ Chính xác!</strong> ${result.explain}<br><br><strong>💬 Câu trả lời mẫu:</strong> "${result.answer}"`;
      qwFeedback.classList.add('correct', 'show');
    } else {
      qwDropzone.classList.add('wrong');
      qwFeedback.innerHTML = `<strong>❌ Sai rồi!</strong> Câu đúng: "${result.correct}"<br><br><strong>Giải thích:</strong> ${result.explain}<br><br><strong>💬 Câu trả lời mẫu:</strong> "${result.answer}"`;
      qwFeedback.classList.add('wrong', 'show');
    }
  }

  function handleScrambleReset() {
    loadScramble(getScrambleIndex());
    renderScramble();
  }

  function handleScrambleNext() {
    nextScramble();
    renderScramble();
  }

  if (qwCheckBtn) qwCheckBtn.addEventListener('click', handleScrambleCheck);
  if (qwResetBtn) qwResetBtn.addEventListener('click', handleScrambleReset);
  if (qwNextScrambleBtn) qwNextScrambleBtn.addEventListener('click', handleScrambleNext);

  // ===================================================================
  // 3. QUIZ — Trắc nghiệm chọn từ để hỏi
  // ===================================================================
  const qwQuizQuestion = document.getElementById('qw-quiz-question');
  const qwQuizOptions = document.getElementById('qw-quiz-options');
  const qwQuizFeedback = document.getElementById('qw-quiz-feedback');
  const qwQuizNext = document.getElementById('qw-quiz-next');
  const qwQuizProgress = document.getElementById('qw-quiz-progress');
  const qwQuizScore = document.getElementById('qw-quiz-score');

  function renderQuiz() {
    const item = getCurrentQuiz();
    if (!item) return;
    qwQuizQuestion.textContent = item.question;
    qwQuizProgress.textContent = `${quizIndexOf(item) + 1} / ${getQuizPool().length}`;
    qwQuizOptions.innerHTML = '';
    item.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleQuizAnswer(btn, i));
      qwQuizOptions.appendChild(btn);
    });
    qwQuizFeedback.textContent = '';
    qwQuizFeedback.className = 'quiz-feedback';
    qwQuizNext.textContent = 'Câu tiếp ➡️';
    qwQuizScore.textContent = getQuizScore();
  }

  function quizIndexOf(item) {
    return getQuizPool().indexOf(item);
  }

  function handleQuizAnswer(btn, selected) {
    const result = submitQuizAnswer(selected);
    if (!result) return;
    document.querySelectorAll('#qw-quiz-options .option').forEach(opt => opt.disabled = true);
    const btns = document.querySelectorAll('#qw-quiz-options .option');
    btns[result.correct].classList.add('correct');
    if (result.isCorrect) {
      qwQuizFeedback.innerHTML = `<strong>✅ Chính xác!</strong> ${result.explain}`;
      qwQuizFeedback.className = 'quiz-feedback correct show';
    } else {
      btn.classList.add('wrong');
      qwQuizFeedback.innerHTML = `<strong>❌ Sai!</strong> Đáp án: "${btns[result.correct].textContent}". ${result.explain}`;
      qwQuizFeedback.className = 'quiz-feedback wrong show';
    }
    qwQuizScore.textContent = getQuizScore();
  }

  function handleQuizNext() {
    if (!isQuizAnswered()) {
      qwQuizFeedback.innerHTML = '⚠️ Chọn đáp án trước!';
      qwQuizFeedback.className = 'quiz-feedback wrong show';
      return;
    }
    const status = nextQuiz();
    if (status === 'finish') {
      const score = getQuizScore();
      const total = getQuizTotalAnswered();
      qwQuizFeedback.innerHTML = `🏁 <strong>Hoàn thành!</strong> Bạn đúng ${score}/${total}.`;
      qwQuizFeedback.className = 'quiz-feedback correct show';
      initQuizPool();
      renderQuiz();
      return;
    }
    renderQuiz();
  }

  if (qwQuizNext) qwQuizNext.addEventListener('click', handleQuizNext);

  // ===================================================================
  // Keyboard controls (flashcard phần lý thuyết)
  // ===================================================================
  function onArrowRight() {
    if (panels.learn?.classList.contains('active')) qwGoNext();
  }
  function onArrowLeft() {
    if (panels.learn?.classList.contains('active')) qwGoPrev();
  }
  function onSpaceEnter(e) {
    if (panels.learn?.classList.contains('active')) {
      e.preventDefault();
      qwFlip();
    }
  }

  // Initial load
  renderWh();
  loadScramble(0);
  renderScramble();
  initQuizPool();
  renderQuiz();

  return { onArrowRight, onArrowLeft, onSpaceEnter };
}
