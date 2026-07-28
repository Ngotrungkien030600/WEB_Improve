/**
 * Interview — DOM / UI Layer
 * Renders the sidebar, topic content, checklist, and progress bar.
 */
import { getTopics, getTopic, getChecklist, toggleChecklistItem, calcProgress, calcTopicProgress } from './interview-logic.js';
import { markdownToHTML } from '../../utils/markdown.js';

let currentIndex = 0;

const GROUPS = [
  { label: '📘 Java Core', indices: [1, 2, 3, 4, 5] },
  { label: '🗄️ Database & Spring', indices: [6, 7, 8, 9, 10, 11, 12] },
  { label: '☁️ DevOps & Architecture', indices: [13, 14, 15, 16, 17, 18] },
  { label: '📝 Practice & Testing', indices: [19, 20, 21, 22, 23, 24, 25, 26, 27] },
];

function shortTitle(title) {
  return title.replace(/^📄 /, '').replace(/^Phần (\d+) — /i, '$1 — ');
}

export function initInterviewUI() {
  const topicList = document.getElementById('interview-topic-list');
  const topicTitle = document.getElementById('interview-topic-title');
  const topicBody = document.getElementById('interview-topic-body');
  const progressText = document.getElementById('interview-progress-text');
  const progressFill = document.getElementById('interview-progress-fill');

  function renderSidebar() {
    const topics = getTopics();
    if (!topicList || !topics.length) return;

    topicList.innerHTML = '';
    // README intro — always shown at top
    const introLi = document.createElement('li');
    introLi.className = 'intro-item';
    introLi.innerHTML = '📋 Tổng quan';
    if (currentIndex === 0) introLi.classList.add('active');
    introLi.addEventListener('click', () => selectTopic(0));
    topicList.appendChild(introLi);

    GROUPS.forEach((group, gi) => {
      // Section header
      const header = document.createElement('li');
      header.className = 'group-header';
      header.innerHTML = `<span class="group-toggle">▶</span> ${group.label}`;
      const isCollapsed = true; // start collapsed for compact view
      if (isCollapsed) header.classList.add('collapsed');
      header.addEventListener('click', () => {
        header.classList.toggle('collapsed');
        const ul = header.nextElementSibling;
        ul.classList.toggle('hidden');
        header.querySelector('.group-toggle').textContent = ul.classList.contains('hidden') ? '▶' : '▼';
      });
      topicList.appendChild(header);

      // Topic items inside this group
      const ul = document.createElement('ul');
      ul.className = 'group-items';
      if (isCollapsed) ul.classList.add('hidden');
      group.indices.forEach((topicIdx) => {
        const topic = topics[topicIdx];
        if (!topic) return;
        const { done, total } = calcTopicProgress(topic);
        const li = document.createElement('li');
        li.dataset.index = topicIdx;
        li.innerHTML = `<span>${shortTitle(topic.title)}</span><span class="topic-status">${done}/${total}</span>`;
        if (currentIndex === topicIdx) li.classList.add('active');
        li.addEventListener('click', () => selectTopic(topicIdx));
        ul.appendChild(li);
      });
      topicList.appendChild(ul);
    });
    renderProgress();
  }

  function renderProgress() {
    const { done, total, percent } = calcProgress();
    progressText.textContent = `Tiến độ: ${done} / ${total}`;
    progressFill.style.width = `${percent}%`;
  }

  function renderBody(topic) {
    if (!topicTitle || !topicBody) return;
    topicTitle.textContent = topic.title;

    let html = '';
    if (topic.content) html += markdownToHTML(topic.content);

    if (topic.checklist && topic.checklist.length > 0) {
      const checked = getChecklist();
      html += '<h3>📝 Checklist kiến thức cần nhớ</h3>';
      topic.checklist.forEach(item => {
        const isChecked = !!checked[item];
        html += `
          <label class="checklist-item ${isChecked ? 'checked' : ''}">
            <input type="checkbox" ${isChecked ? 'checked' : ''} data-item="${item.replace(/"/g, '&quot;')}">
            <span>${item}</span>
          </label>
        `;
      });
    }

    topicBody.innerHTML = html;

    // Bind internal topic links (e.g. [Phan1](./Phan1_Java_Core_CheatSheet.md))
    topicBody.querySelectorAll('.topic-link').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const targetFile = a.dataset.topicFile;
        const topics = getTopics();
        const idx = topics.findIndex(t => t.file === targetFile);
        if (idx >= 0) selectTopic(idx);
      });
    });

    // Bind checklist events
    topicBody.querySelectorAll('.checklist-item input').forEach(input => {
      input.addEventListener('change', () => {
        toggleChecklistItem(input.dataset.item, input.checked);
        input.closest('.checklist-item').classList.toggle('checked', input.checked);
        renderProgress();
        // Update the status count for the active topic's group
        const activeLi = document.querySelector(`.interview-topic-list li[data-index="${currentIndex}"]`);
        if (activeLi) {
          const topic = getTopic(currentIndex);
          if (topic) {
            const { done, total } = calcTopicProgress(topic);
            activeLi.querySelector('.topic-status').textContent = `${done}/${total}`;
          }
        }
      });
    });
  }

  function updateActiveItem(index) {
    const items = document.querySelectorAll('.interview-topic-list li[data-index]');
    items.forEach(li => li.classList.toggle('active', parseInt(li.dataset.index) === index));
    const intro = document.querySelector('.interview-topic-list .intro-item');
    if (intro) intro.classList.toggle('active', index === 0);
  }

  function selectTopic(index) {
    const topic = getTopic(index);
    if (!topic) return;
    currentIndex = index;
    updateActiveItem(index);
    renderBody(topic);
    // Scroll content card to top
    const card = document.getElementById('interview-card');
    if (card) card.scrollTop = 0;
  }

  // Init — render sidebar once, then show first topic
  renderSidebar();
  selectTopic(0);
}
