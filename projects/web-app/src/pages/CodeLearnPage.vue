<template>
  <div class="learn-page-root">
    <div class="learn-page-container">
      <header class="learn-topbar">
        <div style="display:flex;align-items:center;gap:0.8rem;flex-wrap:wrap;">
          <h1>💻 Học Code</h1>
          <a class="back-link" href="#" @click.prevent="goHome">⬅ Quay lại Trang chủ</a>
        </div>
        <div class="learn-progress">
          <span id="learn-progress-text">Tiến độ: {{ progress.done }} / {{ progress.total }}</span>
          <div class="learn-progress-bar">
            <div id="learn-progress-fill" :style="{ width: progress.percent + '%' }"></div>
          </div>
        </div>
      </header>

      <div class="learn-layout">
        <aside class="learn-sidebar">
          <h3>📚 Bài học</h3>
          <ul class="learn-topic-list" id="learn-topic-list">
            <li
              class="intro-item"
              :class="{ active: currentIndex === 0 }"
              @click="selectTopic(0)"
            >📋 Danh sách bài học</li>
            <li
              v-for="(topic, i) in topics"
              :key="i"
              :data-index="i + 1"
              :class="{ active: currentIndex === i + 1 }"
              @click="selectTopic(i + 1)"
            >
              <span>{{ topic.title.replace(/^📄 /, '') }}</span>
              <span class="topic-status">{{ topicStats[i + 1].done }}/{{ topicStats[i + 1].total }}</span>
            </li>
          </ul>
        </aside>
        <div class="learn-content-wrapper">
          <div class="learn-card" id="learn-card">
            <h2 id="learn-topic-title">{{ currentTopic ? currentTopic.title : 'Chọn một bài học' }}</h2>
            <div id="learn-topic-body" v-html="renderedContent"></div>
          </div>
        </div>
      </div>

      <footer class="app-footer">
        <p>© 2026 SkillForge — Học Code</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import { learnTopics } from '@legacy/js/data/learn-data.js';
import { markdownToHTML } from '@legacy/js/utils/markdown.js';

const STORAGE_KEY = 'learnChecklist';

function loadChecklist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveChecklist(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable — continue session-only
  }
}

function toggleItem(item, checked, data) {
  const updated = { ...data, [item]: checked };
  saveChecklist(updated);
  return updated;
}

function calcProgress(topics, checked) {
  let total = 0, done = 0;
  topics.forEach(topic => {
    if (topic.checklist) {
      topic.checklist.forEach(item => {
        total++;
        if (checked[item]) done++;
      });
    }
  });
  return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function calcTopicStats(topics, checked) {
  const stats = { 0: { done: 0, total: 0 } };
  topics.forEach((topic, i) => {
    const idx = i + 1;
    const done = topic.checklist ? topic.checklist.filter(item => checked[item]).length : 0;
    const total = topic.checklist ? topic.checklist.length : 0;
    stats[idx] = { done, total };
  });
  return stats;
}

export default {
  name: 'CodeLearnPage',
  data() {
    return {
      topics: learnTopics || [],
      currentIndex: 0,
      checklist: {},
    };
  },
  computed: {
    currentTopic() {
      if (this.currentIndex === 0) {
        return this.topics[0] || null;
      }
      return this.topics[this.currentIndex - 1] || null;
    },
    renderedContent() {
      if (!this.currentTopic) return '';
      let html = '';
      if (this.currentTopic.content) {
        html += markdownToHTML(this.currentTopic.content);
      }
      if (this.currentTopic.checklist && this.currentTopic.checklist.length > 0) {
        html += '<h3>📝 Checklist</h3>';
        this.currentTopic.checklist.forEach(item => {
          const isChecked = !!this.checklist[item];
          const safeItem = item.replace(/"/g, '&quot;');
          html += `
            <label class="checklist-item ${isChecked ? 'checked' : ''}">
              <input type="checkbox" ${isChecked ? 'checked' : ''} data-item="${safeItem}">
              <span>${item}</span>
            </label>`;
        });
      }
      return html;
    },
    progress() {
      return calcProgress(this.topics, this.checklist);
    },
    topicStats() {
      return calcTopicStats(this.topics, this.checklist);
    },
  },
  mounted() {
    this.checklist = loadChecklist();
    this.$nextTick(() => {
      this.bindChecklistEvents();
    });
  },
  updated() {
    this.$nextTick(() => {
      this.bindChecklistEvents();
    });
  },
  methods: {
    selectTopic(index) {
      this.currentIndex = index;
      this.scrollCardToTop();
    },
    scrollCardToTop() {
      const card = document.getElementById('learn-card');
      if (card) card.scrollTop = 0;
    },
    goHome() {
      navigate('/');
    },
    bindChecklistEvents() {
      document.querySelectorAll('#learn-topic-body input[type="checkbox"]').forEach(input => {
        if (input._bound) return;
        input._bound = true;
        input.addEventListener('change', () => {
          this.handleToggle(input.dataset.item, input.checked);
        });
      });
    },
    handleToggle(item, checked) {
      this.checklist = toggleItem(item, checked, this.checklist);
      const label = document.querySelector(`input[data-item="${item}"]`)?.closest('.checklist-item');
      if (label) {
        label.classList.toggle('checked', checked);
      }
    },
  },
};
</script>

<style scoped>
@import '@legacy/css/variables.css';
@import '@legacy/css/learn.css';

.learn-page-root {
  min-height: 100vh;
  background: linear-gradient(-45deg, #1a237e, #283593, #1565c0, #0d47a1);
  background-size: 400% 400%;
  animation: gradientMove 12s ease infinite;
  --color-accent: #1565c0;
  --color-accent-light: var(--color-info-bg, #e3f2fd);
  --color-accent-mid: var(--color-accent-mid, #1565c0);
}

@keyframes gradientMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.learn-page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.learn-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 0.5rem 0;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.learn-topbar h1 {
  font-size: 1.85rem;
  color: white;
}

.learn-topbar .back-link {
  background: white;
  color: var(--color-accent);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1rem;
  transition: background 0.2s;
  cursor: pointer;
}

.learn-topbar .back-link:hover {
  background: var(--color-accent-light);
}

.learn-progress {
  text-align: right;
  color: white;
}

.learn-progress span {
  font-size: 1.1rem;
  font-weight: 600;
}

.learn-layout {
  gap: 1rem;
  flex: 1;
  min-height: 0;
  align-items: flex-start;
}

.learn-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: white;
  border-radius: 20px;
  padding: 1.2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
  position: sticky;
  top: 1rem;
}

.learn-sidebar h3 {
  color: var(--color-accent);
  font-size: 1.35rem;
  margin-bottom: 1rem;
}

.learn-topic-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.learn-topic-list .intro-item,
.learn-topic-list li {
  padding: 0.7rem 0.8rem;
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
  font-size: 1.15rem;
  color: var(--text-primary, #333);
  transition: background 0.2s;
  margin-bottom: 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.learn-topic-list .intro-item {
  font-size: 1.25rem;
  font-weight: 600;
}

.learn-topic-list .intro-item:hover,
.learn-topic-list li:hover {
  background: var(--color-accent-light);
}

.learn-topic-list .intro-item.active {
  background: var(--color-accent);
  color: white;
}

.learn-topic-list li.active {
  background: var(--color-accent);
  color: white;
}

.learn-topic-list li .topic-status {
  font-size: 1rem;
}

.learn-progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-border-light);
  border-radius: var(--radius-sm, 8px);
  overflow: hidden;
}

#learn-progress-fill {
  height: 100%;
  width: 0%;
  background: var(--color-accent);
  transition: width 0.3s;
}

.learn-content-wrapper {
  flex: 1;
  min-width: 0;
}

.learn-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-height: 70vh;
  overflow-y: auto;
}

.learn-card h2 {
  color: var(--color-accent);
  font-size: 2rem;
  margin-bottom: 1.2rem;
  padding-bottom: 0.7rem;
  border-bottom: 2px solid var(--color-accent-light);
}

.learn-card h3 {
  color: var(--color-accent);
  font-size: 1.6rem;
  margin: 1.5rem 0 0.8rem;
}

.learn-card h4 {
  color: var(--text-secondary, #666);
  font-size: 1.35rem;
  margin: 1.2rem 0 0.5rem;
}

.learn-card :deep(p),
.learn-card :deep(li) {
  color: var(--text-primary, #333);
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.learn-card :deep(ul) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.learn-card :deep(pre) {
  background: var(--surface-code, #1e1e1e);
  color: #d4d4d4;
  padding: 1.2rem;
  border-radius: 12px;
  overflow-x: auto;
  margin-bottom: 1rem;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 1.15rem;
}

.learn-card :deep(code) {
  font-family: 'Consolas', 'Monaco', monospace;
  background: var(--color-accent-light, #e3f2fd);
  color: var(--color-accent);
  padding: 0.15rem 0.4rem;
  border-radius: 5px;
  font-size: 1.05em;
}

.learn-card :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.learn-card :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.learn-card :deep(th),
.learn-card :deep(td) {
  border: 1px solid var(--color-border-light);
  padding: 0.7rem 0.9rem;
  text-align: left;
  vertical-align: top;
}

.learn-card :deep(th) {
  background: var(--color-accent-light, #e3f2fd);
  color: var(--color-accent);
  font-weight: 700;
}

.learn-card :deep(tr:nth-child(even)) {
  background: var(--color-bg-white, #fafafa);
}

.learn-card :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border-subtle);
  margin: 1.2rem 0;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.65rem 0;
  cursor: pointer;
  color: var(--color-text-darker);
  font-size: 1.2rem;
}

.checklist-item :deep(input) {
  margin-top: 0.35rem;
  width: 22px;
  height: 22px;
  accent-color: var(--color-accent);
  cursor: pointer;
}

.checklist-item :deep(span) {
  flex: 1;
  line-height: 1.6;
}

.checklist-item.checked :deep(span) {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.app-footer {
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

@media (max-width: 800px) {
  .learn-layout {
    flex-direction: column;
  }
  .learn-sidebar {
    width: 100%;
    max-height: 35vh;
  }
  .learn-card {
    padding: 1.2rem;
  }
  .learn-card h2 {
    font-size: 1.6rem;
  }
  .learn-card :deep(p),
  .learn-card :deep(li),
  .checklist-item {
    font-size: 1.1rem;
  }
}
</style>
