/**
 * DevOps Learn — UI Layer
 * Sidebar + checklist + progress (localStorage), collapsible topic groups.
 */
import { markdownToHTML } from '../../utils/markdown.js';

const GROUPS = [
  { label: '🐳 Container & Orchestration', indices: [2, 3] },
  { label: '🔄 CI/CD & Automation', indices: [4, 5] },
  { label: '📊 Monitoring', indices: [6] },
  { label: '☁️ AWS & Practice', indices: [7, 8] },
];

let currentIndex = 0;
const STORAGE_KEY = 'devopsChecklist';

function loadChecklist() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveChecklist(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function initDevopsUI() {
  const topicList = document.getElementById('devops-topic-list');
  const topicTitle = document.getElementById('devops-topic-title');
  const topicBody = document.getElementById('devops-topic-body');
  const progressText = document.getElementById('devops-progress-text');
  const progressFill = document.getElementById('devops-progress-fill');

  function getTopics() { return window.devopsTopics || []; }
  function getTopic(index) { return getTopics()[index] || null; }

  function calcProgress() {
    const checked = loadChecklist();
    let total = 0, done = 0;
    getTopics().forEach(topic => {
      if (topic.checklist) {
        topic.checklist.forEach(item => { total++; if (checked[item]) done++; });
      }
    });
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  function renderProgress() {
    const { done, total, percent } = calcProgress();
    if (progressText) progressText.textContent = `Tiến độ: ${done} / ${total}`;
    if (progressFill) progressFill.style.width = `${percent}%`;
  }

  function topicStatus(index) {
    const topic = getTopic(index);
    if (!topic || !topic.checklist || !topic.checklist.length) return '';
    const checked = loadChecklist();
    const done = topic.checklist.filter(item => checked[item]).length;
    return `<span class="topic-status">${done}/${topic.checklist.length}</span>`;
  }

  function renderSidebar() {
    const topics = getTopics();
    if (!topicList || !topics || !topics.length) return;
    topicList.innerHTML = '';

    const introLi = document.createElement('li');
    introLi.className = 'intro-item';
    introLi.innerHTML = '📋 Danh sách bài học';
    if (currentIndex === 0) introLi.classList.add('active');
    introLi.addEventListener('click', () => selectTopic(0));
    topicList.appendChild(introLi);

    GROUPS.forEach(group => {
      const header = document.createElement('li');
      header.className = 'group-header';
      header.innerHTML = `<span class="group-arrow">▶</span><span>${group.label}</span>`;
      const ul = document.createElement('ul');
      ul.className = 'group-items hidden';
      header.addEventListener('click', () => {
        const collapsed = ul.classList.toggle('hidden');
        header.querySelector('.group-arrow').textContent = collapsed ? '▶' : '▼';
      });
      group.indices.forEach(idx => {
        const topic = getTopic(idx);
        if (!topic) return;
        const li = document.createElement('li');
        li.dataset.index = idx;
        li.innerHTML = `<span>${topic.title.replace(/^📄 /, '')}</span>${topicStatus(idx)}`;
        li.addEventListener('click', () => {
          selectTopic(idx);
          ul.classList.remove('hidden');
          header.querySelector('.group-arrow').textContent = '▼';
        });
        ul.appendChild(li);
      });
      topicList.appendChild(header);
      topicList.appendChild(ul);
    });

    renderProgress();
  }

  function renderBody(topic) {
    if (!topicTitle || !topicBody) return;
    topicTitle.textContent = topic.title;

    let html = '';
    if (topic.content) {
      try {
        html += markdownToHTML(topic.content);
      } catch (e) {
        console.error('[DevopsUI] markdownToHTML error:', e);
        html += '<p>' + topic.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>';
      }
    }
    if (topic.checklist && topic.checklist.length > 0) {
      const checked = loadChecklist();
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

    topicBody.querySelectorAll('.checklist-item input').forEach(input => {
      input.addEventListener('change', () => {
        const data = loadChecklist();
        data[input.dataset.item] = input.checked;
        saveChecklist(data);
        input.closest('.checklist-item').classList.toggle('checked', input.checked);
        renderProgress();
        updateSidebarStatus();
      });
    });
  }

  function updateSidebarStatus() {
    const checked = loadChecklist();
    document.querySelectorAll('#devops-topic-list li[data-index]').forEach(li => {
      const idx = parseInt(li.dataset.index);
      const topic = getTopic(idx);
      if (topic && topic.checklist) {
        const done = topic.checklist.filter(item => checked[item]).length;
        const status = li.querySelector('.topic-status');
        if (status) status.textContent = `${done}/${topic.checklist.length}`;
      }
    });
  }

  function updateActiveItem(index) {
    document.querySelectorAll('#devops-topic-list li[data-index]')
      .forEach(li => li.classList.toggle('active', parseInt(li.dataset.index) === index));
    const intro = document.querySelector('#devops-topic-list .intro-item');
    if (intro) intro.classList.toggle('active', index === 0);
  }

  function selectTopic(index) {
    const topic = getTopic(index);
    if (!topic) return;
    currentIndex = index;
    updateActiveItem(index);
    renderBody(topic);
    const card = document.getElementById('devops-card');
    if (card) card.scrollTop = 0;
  }

  renderSidebar();
  selectTopic(0);
}
