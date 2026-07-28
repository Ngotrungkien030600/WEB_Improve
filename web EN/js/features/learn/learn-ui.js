/**
 * Learn Code — UI Layer
 */
import { markdownToHTML } from '../../utils/markdown.js';

let currentIndex = 0;

export function initLearnUI() {
  const topicList = document.getElementById('learn-topic-list');
  const topicTitle = document.getElementById('learn-topic-title');
  const topicBody = document.getElementById('learn-topic-body');
  const progressText = document.getElementById('learn-progress-text');
  const progressFill = document.getElementById('learn-progress-fill');

  function getTopics() { return window.learnTopics || []; }
  function getTopic(index) { return getTopics()[index] || null; }

  function loadChecklist() {
    try { return JSON.parse(localStorage.getItem('learnChecklist') || '{}'); }
    catch { return {}; }
  }
  function saveChecklist(data) {
    localStorage.setItem('learnChecklist', JSON.stringify(data));
  }
  function getChecklist() { return loadChecklist(); }
  function toggleChecklistItem(item, checked) {
    const data = loadChecklist();
    data[item] = checked;
    saveChecklist(data);
    return data;
  }

  function calcProgress() {
    const topics = getTopics();
    const checked = loadChecklist();
    let total = 0, done = 0;
    topics.forEach(topic => {
      if (topic.checklist) {
        topic.checklist.forEach(item => { total++; if (checked[item]) done++; });
      }
    });
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  function renderSidebar() {
    const topics = getTopics();
    if (!topicList || !topics.length) return;

    topicList.innerHTML = '';
    // Intro item
    const introLi = document.createElement('li');
    introLi.className = 'intro-item';
    introLi.innerHTML = '📋 Danh sách bài học';
    if (currentIndex === 0) introLi.classList.add('active');
    introLi.addEventListener('click', () => selectTopic(0));
    topicList.appendChild(introLi);

    // Topic items
    topics.forEach((topic, i) => {
      if (i === 0) return;
      const checked = loadChecklist();
      const done = topic.checklist ? topic.checklist.filter(item => checked[item]).length : 0;
      const total = topic.checklist ? topic.checklist.length : 0;
      const li = document.createElement('li');
      li.dataset.index = i;
      li.innerHTML = `<span>${topic.title.replace(/^📄 /, '')}</span><span class="topic-status">${done}/${total}</span>`;
      if (currentIndex === i) li.classList.add('active');
      li.addEventListener('click', () => selectTopic(i));
      topicList.appendChild(li);
    });
    renderProgress();
  }

  function renderProgress() {
    const { done, total, percent } = calcProgress();
    if (progressText) progressText.textContent = `Tiến độ: ${done} / ${total}`;
    if (progressFill) progressFill.style.width = `${percent}%`;
  }

  function renderBody(topic) {
    if (!topicTitle || !topicBody) return;
    topicTitle.textContent = topic.title;

    let html = '';
    if (topic.content) html += markdownToHTML(topic.content);
    if (topic.checklist && topic.checklist.length > 0) {
      const checked = getChecklist();
      html += '<h3>📝 Checklist</h3>';
      topic.checklist.forEach(item => {
        const isChecked = !!checked[item];
        html += `
          <label class="checklist-item ${isChecked ? 'checked' : ''}">
            <input type="checkbox" ${isChecked ? 'checked' : ''} data-item="${item.replace(/"/g, '&quot;')}">
            <span>${item}</span>
          </label>`;
      });
    }

    topicBody.innerHTML = html;

    // Checklist events
    topicBody.querySelectorAll('.checklist-item input').forEach(input => {
      input.addEventListener('change', () => {
        toggleChecklistItem(input.dataset.item, input.checked);
        input.closest('.checklist-item').classList.toggle('checked', input.checked);
        renderProgress();
        updateSidebarStatus();
      });
    });
  }

  function updateSidebarStatus() {
    const topics = getTopics();
    const checked = loadChecklist();
    document.querySelectorAll('.learn-topic-list li[data-index]').forEach(li => {
      const idx = parseInt(li.dataset.index);
      const topic = topics[idx];
      if (topic) {
        const done = topic.checklist ? topic.checklist.filter(item => checked[item]).length : 0;
        const total = topic.checklist ? topic.checklist.length : 0;
        const status = li.querySelector('.topic-status');
        if (status) status.textContent = `${done}/${total}`;
      }
    });
  }

  function updateActiveItem(index) {
    document.querySelectorAll('.learn-topic-list li[data-index]')
      .forEach(li => li.classList.toggle('active', parseInt(li.dataset.index) === index));
    const intro = document.querySelector('.learn-topic-list .intro-item');
    if (intro) intro.classList.toggle('active', index === 0);
  }

  function selectTopic(index) {
    const topic = getTopic(index);
    if (!topic) return;
    currentIndex = index;
    updateActiveItem(index);
    renderBody(topic);
    // Scroll card to top
    const card = document.getElementById('learn-card');
    if (card) card.scrollTop = 0;
  }

  renderSidebar();
  selectTopic(0);
}
