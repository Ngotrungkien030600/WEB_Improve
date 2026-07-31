/**
 * AI Agent Learning App — Học, Thi & Bài học về AI Agent
 */
import { markdownToHTML } from './utils/markdown.js';

document.addEventListener('DOMContentLoaded', () => {

  // === Tab Switching ===
  const tabs = document.querySelectorAll('.ai-tab');
  const sections = {
    learn: document.getElementById('ai-learn'),
    quiz: document.getElementById('ai-quiz'),
    lessons: document.getElementById('ai-lessons'),
  };
  let activeTab = 'learn';

  function switchTab(mode) {
    activeTab = mode;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === mode));
    Object.values(sections).forEach(s => s.classList.remove('active'));
    if (sections[mode]) sections[mode].classList.add('active');
  }

  tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));

  // === Utility ===
  function escHtml(text) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ===================================================================
  // 1. FLASHCARD HỌC
  // ===================================================================
  const concepts = window.aiAgentConcepts || [];
  let cardIndex = 0;
  let cardFiltered = [...concepts];
  const cardEn = document.getElementById('ai-card-en');
  const cardVi = document.getElementById('ai-card-vi');
  const cardDef = document.getElementById('ai-card-def');
  const cardEx = document.getElementById('ai-card-ex');
  const cardCat = document.getElementById('ai-card-cat');
  const cardCounter = document.getElementById('ai-card-counter');
  const cardPrevBtn = document.getElementById('ai-card-prev');
  const cardNextBtn = document.getElementById('ai-card-next');
  const cardFlipBtn = document.getElementById('ai-card-flip');
  const cardBody = document.getElementById('ai-card-body');
  const cardFilter = document.getElementById('ai-card-filter');

  function renderCard() {
    const item = cardFiltered[cardIndex];
    if (!item) return;
    cardEn.textContent = item.en;
    cardVi.textContent = item.vi;
    cardDef.textContent = item.definition;
    cardEx.textContent = 'Ví dụ: ' + item.example;
    cardCat.textContent = item.category.toUpperCase();
    cardCounter.textContent = `${cardIndex + 1} / ${cardFiltered.length}`;
    cardBody.classList.remove('flipped');
  }

  function cardNext() {
    cardIndex = (cardIndex + 1) % cardFiltered.length;
    renderCard();
  }

  function cardPrev() {
    cardIndex = (cardIndex - 1 + cardFiltered.length) % cardFiltered.length;
    renderCard();
  }

  function cardFlip() {
    cardBody.classList.toggle('flipped');
  }

  function filterCards(category) {
    if (!category || category === 'all') {
      cardFiltered = [...concepts];
    } else {
      cardFiltered = concepts.filter(c => c.category === category);
    }
    cardIndex = 0;
    renderCard();
  }

  if (cardFilter) {
    cardFilter.addEventListener('change', () => filterCards(cardFilter.value));
  }
  if (cardPrevBtn) cardPrevBtn.addEventListener('click', cardPrev);
  if (cardNextBtn) cardNextBtn.addEventListener('click', cardNext);
  if (cardFlipBtn) cardFlipBtn.addEventListener('click', cardFlip);
  if (cardBody) cardBody.addEventListener('click', cardFlip);

  // ===================================================================
  // 2. QUIZ
  // ===================================================================
  const quizData = window.aiAgentQuizData || { general: [], token: [], quota: [], edge: [] };
  const QUIZ_KEYS = { general: 'Agent cơ bản', token: 'Token & Context', quota: 'Quota & Cost', edge: 'AI at Edge' };

  let qPool = [];
  let qIndex = 0;
  let qScore = 0;
  let qTotal = 0;
  let qAnswered = false;
  let qTimer = null;
  let qTime = 15;
  let qCount = 10;

  const qBadge = document.getElementById('ai-q-badge');
  const qQuestion = document.getElementById('ai-q-question');
  const qOptions = document.getElementById('ai-q-options');
  const qFeedback = document.getElementById('ai-q-feedback');
  const qScoreEl = document.getElementById('ai-q-score');
  const qTotalEl = document.getElementById('ai-q-total');
  const qPctEl = document.getElementById('ai-q-pct');
  const qLevelEl = document.getElementById('ai-q-level');
  const qProgress = document.getElementById('ai-q-progress');
  const qNextBtn = document.getElementById('ai-q-next');
  const qTimerFill = document.getElementById('ai-q-timer-fill');
  const qTimerText = document.getElementById('ai-q-timer-text');
  const qTimerBar = document.getElementById('ai-q-timer-bar');
  const qStartBtn = document.getElementById('ai-q-start');
  const qTopicBtns = document.querySelectorAll('.ai-q-tab');
  let qTopic = 'general';

  function initQuizPool(topic) {
    const pool = quizData[topic] || [];
    qPool = shuffle(pool).slice(0, qCount);
    qIndex = 0;
    qScore = 0;
    qTotal = 0;
    qAnswered = false;
  }

  function renderQuiz() {
    const item = qPool[qIndex];
    if (!item) return;
    qBadge.textContent = QUIZ_KEYS[qTopic] || qTopic;
    qQuestion.textContent = item.question;
    qProgress.textContent = `Câu ${qIndex + 1} / ${qPool.length}`;

    qOptions.innerHTML = '';
    item.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'ai-q-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => quizAnswer(btn, i, item.correct));
      qOptions.appendChild(btn);
    });

    qNextBtn.textContent = qIndex >= qPool.length - 1 ? '🏁 Kết thúc' : 'Câu tiếp ➡️';
    qFeedback.textContent = '';
    qFeedback.className = 'ai-q-feedback';
    startQuizTimer();
  }

  function startQuizTimer() {
    if (qTimer) clearInterval(qTimer);
    qTime = parseInt(document.getElementById('ai-q-time').value, 10);
    let remaining = qTime;
    qTimerBar.classList.add('active');
    qTimerText.textContent = `${remaining}s`;
    qTimerText.classList.add('active');
    qTimerFill.style.width = '100%';
    qTimer = setInterval(() => {
      remaining--;
      const pct = (remaining / qTime) * 100;
      qTimerFill.style.width = `${Math.max(0, pct)}%`;
      qTimerText.textContent = `${remaining}s`;
      if (remaining <= 5) qTimerText.style.color = '#ef4444';
      else if (remaining <= 10) qTimerText.style.color = '#f59e0b';
      else qTimerText.style.color = 'white';
      if (remaining <= 0) {
        clearInterval(qTimer);
        quizTimeout();
      }
    }, 1000);
  }

  function stopQuizTimer() {
    if (qTimer) { clearInterval(qTimer); qTimer = null; }
    qTimerBar.classList.remove('active');
    qTimerText.classList.remove('active');
  }

  function quizAnswer(btn, selected, correct) {
    if (qAnswered) return;
    qAnswered = true;
    qTotal++;
    clearInterval(qTimer);

    document.querySelectorAll('.ai-q-option').forEach(opt => opt.disabled = true);
    const btns = document.querySelectorAll('.ai-q-option');
    btns[correct].classList.add('correct');

    if (selected === correct) {
      qScore++;
      qFeedback.textContent = '✅ Chính xác!';
      qFeedback.className = 'ai-q-feedback show correct';
    } else {
      btn.classList.add('wrong');
      qFeedback.textContent = `❌ Sai! Đáp án: ${btns[correct].textContent}`;
      qFeedback.className = 'ai-q-feedback show wrong';
    }
    updateQuizStats();
  }

  function quizTimeout() {
    if (qAnswered) return;
    qAnswered = true;
    qTotal++;
    const item = qPool[qIndex];
    document.querySelectorAll('.ai-q-option').forEach(opt => opt.disabled = true);
    const btns = document.querySelectorAll('.ai-q-option');
    btns[item.correct].classList.add('correct');
    qFeedback.textContent = `⏰ Hết giờ! Đáp án: ${btns[item.correct].textContent}`;
    qFeedback.className = 'ai-q-feedback show wrong';
    updateQuizStats();
  }

  function updateQuizStats() {
    qScoreEl.textContent = qScore;
    qTotalEl.textContent = qTotal;
    const p = qTotal === 0 ? 0 : Math.round((qScore / qTotal) * 100);
    qPctEl.textContent = `${p}%`;
    let lv = p >= 90 ? '🌟 Xuất sắc' : p >= 75 ? '✅ Khá tốt' : p >= 50 ? '⚠️ Trung bình' : '❌ Cần cố gắng';
    qLevelEl.textContent = lv;
  }

  function quizNext() {
    if (!qAnswered) {
      qFeedback.textContent = '⚠️ Chọn đáp án trước!';
      qFeedback.className = 'ai-q-feedback show wrong';
      return;
    }
    if (qIndex >= qPool.length - 1) {
      const p = qTotal === 0 ? 0 : Math.round((qScore / qTotal) * 100);
      qFeedback.innerHTML = `🏁 <strong>Hoàn thành!</strong> ${qScore}/${qTotal} (${p}%)`;
      qFeedback.className = 'ai-q-feedback show correct';
      stopQuizTimer();
      initQuizPool(qTopic);
      renderQuiz();
      updateQuizStats();
      return;
    }
    qIndex++;
    qAnswered = false;
    renderQuiz();
  }

  function switchQuizTopic(topic) {
    qTopic = topic;
    qTopicBtns.forEach(b => b.classList.toggle('active', b.dataset.qt === topic));
    stopQuizTimer();
    qCount = parseInt(document.getElementById('ai-q-count').value, 10);
    initQuizPool(topic);
    renderQuiz();
    updateQuizStats();
  }

  qTopicBtns.forEach(btn => btn.addEventListener('click', () => switchQuizTopic(btn.dataset.qt)));
  if (qNextBtn) qNextBtn.addEventListener('click', quizNext);
  if (qStartBtn) qStartBtn.addEventListener('click', () => {
    qCount = parseInt(document.getElementById('ai-q-count').value, 10);
    initQuizPool(qTopic);
    renderQuiz();
    updateQuizStats();
  });

  // ===================================================================
  // 3. BÀI HỌC (sidebar + checklist)
  // ===================================================================
  const lessonTopics = window.aiAgentTopics || [];
  let currentLesson = 0;

  const lList = document.getElementById('ai-lesson-list');
  const lTitle = document.getElementById('ai-lesson-title');
  const lBody = document.getElementById('ai-lesson-body');
  const lProgressText = document.getElementById('ai-lesson-progress-text');
  const lProgressFill = document.getElementById('ai-lesson-progress-fill');

  function loadChecklist() {
    try { return JSON.parse(localStorage.getItem('aiAgentChecklist') || '{}'); }
    catch { return {}; }
  }
  function saveChecklist(data) {
    localStorage.setItem('aiAgentChecklist', JSON.stringify(data));
  }
  function toggleChecklistItem(item, checked) {
    const data = loadChecklist();
    data[item] = checked;
    saveChecklist(data);
    return data;
  }

  function calcProgress() {
    const checked = loadChecklist();
    let total = 0, done = 0;
    lessonTopics.forEach(topic => {
      if (topic.checklist) {
        topic.checklist.forEach(item => { total++; if (checked[item]) done++; });
      }
    });
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  function renderLessonSidebar() {
    if (!lList) return;
    lList.innerHTML = '';
    lessonTopics.forEach((topic, i) => {
      const checked = loadChecklist();
      const items = topic.checklist || [];
      const done = items.filter(it => checked[it]).length;
      const li = document.createElement('li');
      li.className = 'ai-lesson-item' + (i === currentLesson ? ' active' : '');
      li.innerHTML = `<span class="ai-lesson-item-title">${topic.title.replace(/^📄 /, '')}</span><span class="ai-lesson-item-stat">${done}/${items.length}</span>`;
      li.addEventListener('click', () => showLesson(i));
      lList.appendChild(li);
    });
    renderLessonProgress();
  }

  function renderLessonProgress() {
    const { done, total, percent } = calcProgress();
    if (lProgressText) lProgressText.textContent = `Tiến độ: ${done} / ${total}`;
    if (lProgressFill) lProgressFill.style.width = `${percent}%`;
  }

  function updateSidebarStatus() {
    const checked = loadChecklist();
    document.querySelectorAll('.ai-lesson-item').forEach((li, i) => {
      const topic = lessonTopics[i];
      if (!topic) return;
      const items = topic.checklist || [];
      const done = items.filter(it => checked[it]).length;
      const stat = li.querySelector('.ai-lesson-item-stat');
      if (stat) stat.textContent = `${done}/${items.length}`;
    });
  }

  function showLesson(index) {
    const topic = lessonTopics[index];
    if (!topic) return;
    currentLesson = index;
    document.querySelectorAll('.ai-lesson-item').forEach((li, i) => li.classList.toggle('active', i === index));

    lTitle.textContent = topic.title;
    let html = topic.content ? markdownToHTML(topic.content) : '';
    if (topic.checklist && topic.checklist.length > 0) {
      const checked = loadChecklist();
      html += '<h3>📝 Checklist</h3>';
      topic.checklist.forEach(item => {
        const isChecked = !!checked[item];
        html += `<label class="checklist-item ${isChecked ? 'checked' : ''}">
          <input type="checkbox" ${isChecked ? 'checked' : ''} data-item="${escHtml(item)}">
          <span>${escHtml(item)}</span>
        </label>`;
      });
    }
    lBody.innerHTML = html;

    lBody.querySelectorAll('.checklist-item input').forEach(input => {
      input.addEventListener('change', () => {
        toggleChecklistItem(input.dataset.item, input.checked);
        input.closest('.checklist-item').classList.toggle('checked', input.checked);
        renderLessonProgress();
        updateSidebarStatus();
      });
    });

    // Scroll lesson content to top
    const card = document.getElementById('ai-lesson-card');
    if (card) card.scrollTop = 0;
  }

  renderLessonSidebar();
  if (lessonTopics.length > 0) showLesson(0);
});
