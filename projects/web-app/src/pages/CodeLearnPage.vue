<template>
  <div class="page-root" style="--color-accent: #1565c0">
    <div class="container">
      <header class="page-topbar">
        <div class="topbar-left">
          <h1>💻 Học Code</h1>
          <p>Học lập trình từ cơ bản đến nâng cao</p>
        </div>
        <div class="topbar-right">
          <button class="home-btn" type="button" aria-label="Về trang chủ" title="Về trang chủ" @click="handleNavigate('/')">🏠</button>
        </div>
      </header>

      <div class="progress-bar-wrap">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress.percent + '%' }"></div>
        </div>
        <span class="progress-label">{{ progress.done }} / {{ progress.total }} bài hoàn thành</span>
      </div>

      <div class="main-layout">
        <aside class="sidebar">
          <h3>📚 Bài học</h3>
          <ul class="topic-list">
            <li
              class="topic-item"
              :class="{ active: currentIndex === 0 }"
              @click="selectTopic(0)"
            >
              <span>📋 Danh sách</span>
            </li>
            <li
              v-for="(topic, i) in topics"
              :key="i"
              class="topic-item"
              :class="{ active: currentIndex === i + 1 }"
              @click="selectTopic(i + 1)"
            >
              <span>{{ topic.title?.replace(/^📄 /, '') }}</span>
              <span class="topic-stat">{{ topicStats[i + 1]?.done }}/{{ topicStats[i + 1]?.total }}</span>
            </li>
          </ul>
        </aside>

        <div class="content-area">
          <div class="content-card">
            <h2>{{ currentTopic?.title || 'Chọn một bài học' }}</h2>
            <div class="content-body" v-html="renderedContent"></div>
          </div>
        </div>
      </div>
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
    // localStorage unavailable
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
    handleNavigate(path) {
      navigate(path);
    },
    selectTopic(index) {
      this.currentIndex = index;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    bindChecklistEvents() {
      document.querySelectorAll('.content-body input[type="checkbox"]').forEach(input => {
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
.page-root {
  min-height: 100vh;
  background: var(--color-bg, #0f0e17);
  color: var(--color-text, #e4e2f0);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.page-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border, #2d2b44);
}

.topbar-left h1 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.topbar-left p {
  font-size: 0.8rem;
  color: var(--color-text2, #9d9bb5);
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.home-btn {
  background: white;
  color: var(--color-accent, #1565c0);
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

.progress-bar-wrap {
  margin-bottom: 1.5rem;
}

.progress-track {
  height: 6px;
  background: var(--color-surface2, #22213a);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent, #1565c0);
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-label {
  font-size: 0.75rem;
  color: var(--color-text2, #9d9bb5);
}

.content-area {
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.main-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.5rem;
}

@media (max-width: 700px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
}

.sidebar {
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 12px;
  padding: 1rem;
  max-height: calc(100vh - 10rem);
  overflow-y: auto;
  position: sticky;
  top: 1rem;
}

.sidebar h3 {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--color-text2, #9d9bb5);
}

.topic-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.topic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  color: var(--color-text2, #9d9bb5);
  transition: background 0.2s, color 0.2s;
  margin-bottom: 0.2rem;
}

.topic-item:hover {
  background: var(--color-surface2, #22213a);
  color: var(--color-text);
}

.topic-item.active {
  background: rgba(21, 101, 192, 0.2);
  color: var(--color-accent, #1565c0);
  font-weight: 600;
}

.topic-stat {
  font-size: 0.7rem;
  opacity: 0.7;
}

.content-card {
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.content-card h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border, #2d2b44);
  color: var(--color-text);
}

.content-body {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text2, #9d9bb5);
}

.content-body :deep(h1),
.content-body :deep(h2),
.content-body :deep(h3) {
  color: var(--color-text);
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.content-body :deep(h2) {
  font-size: 1.05rem;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border, #2d2b44);
  padding-bottom: 0.4rem;
}

.content-body :deep(h3) {
  font-size: 0.95rem;
}

.content-body :deep(strong) {
  color: var(--color-accent, #1565c0);
}

.content-body :deep(p) {
  margin-bottom: 0.75rem;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  margin-bottom: 0.75rem;
  padding-left: 1.25rem;
}

.content-body :deep(li) {
  margin-bottom: 0.35rem;
}

.content-body :deep(pre) {
  background: var(--color-surface2, #22213a);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.content-body :deep(code) {
  font-family: 'Consolas', 'Monaco', monospace;
  background: var(--color-surface2, #22213a);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85em;
}

.content-body :deep(pre code) {
  background: transparent;
  padding: 0;
}

.content-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.content-body :deep(th),
.content-body :deep(td) {
  border: 1px solid var(--color-border, #2d2b44);
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.85rem;
}

.content-body :deep(th) {
  background: var(--color-surface2, #22213a);
  color: var(--color-accent, #1565c0);
  font-weight: 600;
}

.content-body :deep(.checklist-item) {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.5rem 0;
  cursor: pointer;
  font-size: 0.88rem;
}

.content-body :deep(.checklist-item input) {
  margin-top: 0.2rem;
  width: 18px;
  height: 18px;
  accent-color: var(--color-accent, #1565c0);
  cursor: pointer;
  flex-shrink: 0;
}

.content-body :deep(.checklist-item.checked > span) {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
