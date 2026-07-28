/**
 * Interview — DOM / UI Layer
 * Renders the sidebar, topic content, checklist, and progress bar.
 */
import { getTopics, getTopic, getChecklist, toggleChecklistItem, calcProgress, calcTopicProgress } from './interview-logic.js';
import { markdownToHTML } from '../../utils/markdown.js';

let currentIndex = 0;

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
    topics.forEach((topic, index) => {
      const { done, total } = calcTopicProgress(topic);
      const li = document.createElement('li');
      li.dataset.index = index;
      li.innerHTML = `<span>${topic.title}</span><span class="topic-status">${done}/${total}</span>`;
      if (currentIndex === index) li.classList.add('active');
      li.addEventListener('click', () => selectTopic(index));
      topicList.appendChild(li);
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

    // Bind checklist events
    topicBody.querySelectorAll('.checklist-item input').forEach(input => {
      input.addEventListener('change', () => {
        toggleChecklistItem(input.dataset.item, input.checked);
        input.closest('.checklist-item').classList.toggle('checked', input.checked);
        renderSidebar();
      });
    });
  }

  function selectTopic(index) {
    const topic = getTopic(index);
    if (!topic) return;
    currentIndex = index;
    renderSidebar();
    renderBody(topic);
  }

  // Init — select first topic
  selectTopic(0);
}
