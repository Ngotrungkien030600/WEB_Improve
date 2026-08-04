<template>
  <div class="interview-page">
    <div class="interview-container">
      <header class="interview-topbar">
        <h1>☕ Java Backend Interview</h1>
        <div class="topbar-actions">
          <button class="back-btn" @click="goHome">⬅ Quay lại Trang chủ</button>
        </div>
      </header>

      <div class="interview-layout">
        <aside class="interview-sidebar">
          <h3>📑 Chủ đề</h3>
          <ul class="topic-list">
            <li
              class="topic-item intro-item"
              :class="{ active: currentIndex === 0 }"
              @click="selectTopic(0)"
            >📋 Tổng quan</li>

            <template v-for="group in GROUPS" :key="group.label">
              <li
                class="topic-item group-header"
                :class="{ collapsed: collapsedGroups[group.label] }"
                @click="toggleGroup(group)"
              >
                <span class="toggle-icon">{{ collapsedGroups[group.label] ? '▶' : '▼' }}</span>
                {{ group.label }}
              </li>
              <template v-if="!collapsedGroups[group.label]">
                <li
                  v-for="topicIdx in group.indices"
                  :key="topicIdx"
                  class="topic-item group-item"
                  :class="{ active: currentIndex === topicIdx }"
                  @click="selectTopic(topicIdx)"
                >
                  <span>{{ shortTitle(getTopic(topicIdx)?.title || '') }}</span>
                  <span class="topic-status">{{ getTopicStatus(topicIdx) }}</span>
                </li>
              </template>
            </template>
          </ul>

          <div class="progress-bar-wrap">
            <div class="progress-text">{{ progress.done }} / {{ progress.total }}</div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: progress.percent + '%' }"></div>
            </div>
          </div>
        </aside>

        <main class="interview-card" ref="cardRef">
          <h2 class="topic-title">{{ currentTopic?.title || '' }}</h2>
          <div class="topic-body" v-html="renderedContent"></div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { interviewTopics } from '@legacy/js/data/interview-data.js';
import {
  getTopics,
  getTopic,
  getChecklist,
  toggleChecklistItem,
  calcProgress,
  calcTopicProgress,
} from '@legacy/js/features/interview/interview-logic.js';
import { markdownToHTML } from '@legacy/js/utils/markdown.js';
import { navigate } from '../utils/navigate.js';

const GROUPS = [
  { label: '📘 Java Core', indices: [1, 2, 3, 4, 5] },
  { label: '🗄️ Database & Spring', indices: [6, 7, 8, 9, 10, 11, 12] },
  { label: '☁️ DevOps & Architecture', indices: [13, 14, 15, 16, 17, 18] },
  { label: '📝 Practice & Testing', indices: [19, 20, 21, 22, 23, 24, 25, 26, 27] },
  { label: '🔧 Advanced', indices: [28, 29, 30, 31] },
  { label: '🛠️ Dev Tools & Infrastructure', indices: [32, 33, 34] },
  { label: '📐 Clean Code & Soft Skills', indices: [35, 36] },
  { label: '🗄️ NoSQL & Best Practices', indices: [37, 38, 39] },
];

function shortTitle(title) {
  return title.replace(/^📄 /, '').replace(/^Phần (\d+) — /i, '$1 — ');
}

export default {
  name: 'InterviewPage',
  data() {
    return {
      currentIndex: 0,
      collapsedGroups: Object.fromEntries(GROUPS.map(g => [g.label, true])),
      GROUPS,
    };
  },
  computed: {
    topics() {
      return getTopics(interviewTopics);
    },
    currentTopic() {
      return getTopic(this.currentIndex);
    },
    renderedContent() {
      if (!this.currentTopic) return '';
      let html = '';
      if (this.currentTopic.content) {
        html += markdownToHTML(this.currentTopic.content);
      }
      if (this.currentTopic.checklist && this.currentTopic.checklist.length > 0) {
        html += '<h3>📝 Checklist kiến thức cần nhớ</h3>';
        const checked = getChecklist();
        this.currentTopic.checklist.forEach(item => {
          const isChecked = !!checked[item];
          html += `
            <label class="checklist-item ${isChecked ? 'checked' : ''}">
              <input type="checkbox" ${isChecked ? 'checked' : ''} data-item="${item.replace(/"/g, '&quot;')}">
              <span>${item}</span>
            </label>
          `;
        });
      }
      return html;
    },
    progress() {
      return calcProgress(interviewTopics);
    },
  },
  mounted() {
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
    shortTitle,
    goHome() {
      navigate('/');
    },
    selectTopic(index) {
      this.currentIndex = index;
      this.scrollToTop();
    },
    scrollToTop() {
      const card = this.$refs.cardRef;
      if (card) card.scrollIntoView({ block: 'start' });
    },
    toggleGroup(group) {
      const wasCollapsed = !!this.collapsedGroups[group.label];
      this.collapsedGroups[group.label] = !wasCollapsed;
      if (wasCollapsed) {
        const firstIdx = group.indices[0];
        if (firstIdx !== undefined) this.selectTopic(firstIdx);
      }
    },
    getTopic(idx) {
      return this.topics[idx] || null;
    },
    getTopicStatus(idx) {
      const topic = this.getTopic(idx);
      if (!topic) return '0/0';
      const { done, total } = calcTopicProgress(topic);
      return `${done}/${total}`;
    },
    bindChecklistEvents() {
      const card = this.$refs.cardRef;
      if (!card) return;
      card.querySelectorAll('.checklist-item input').forEach(input => {
        if (input.__vue__) return;
        input.__vue__ = true;
        input.addEventListener('change', () => {
          const item = input.dataset.item;
          const checked = input.checked;
          toggleChecklistItem(item, checked);
          input.closest('.checklist-item').classList.toggle('checked', checked);
          this.$forceUpdate();
          this.scrollToTop();
        });
      });
      card.querySelectorAll('.topic-link').forEach(a => {
        if (a.__vue__) return;
        a.__vue__ = true;
        a.addEventListener('click', e => {
          e.preventDefault();
          const targetFile = a.dataset.topicFile;
          const idx = this.topics.findIndex(t => t.file === targetFile);
          if (idx >= 0) this.selectTopic(idx);
        });
      });
    },
  },
};
</script>

<style scoped>
.interview-page {
  --forge-bg: var(--color-bg-page, #08080e);
  --forge-bg-card: rgba(255, 255, 255, 0.04);
  --forge-border: rgba(255, 255, 255, 0.08);
  --forge-text: var(--text-secondary-muted, #e4e2f0);
  --forge-text-secondary: var(--text-secondary-muted, #9d9bb5);
  --forge-ember: var(--color-warning, #fbbf24);
  --forge-fire: var(--color-warning-alt, #f97316);
  --forge-surface: rgba(255, 255, 255, 0.04);
  --forge-surface-hover: rgba(255, 255, 255, 0.08);
  --forge-radius-sm: 8px;
  --forge-radius-lg: 14px;
  --forge-space-xl: 1.25rem;
  --forge-space-lg: 2.5rem;
  --forge-transition-fast: 0.15s ease;

  background: var(--color-bg-surface-dark, #0f0e17);
  min-height: 100vh;
  padding: 1rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--forge-text);
}

.interview-container {
  max-width: 1200px;
  margin: 0 auto;
}

.interview-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--forge-text);
  padding: 0.5rem 0;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.interview-topbar h1 {
  font-size: 1.85rem;
  margin: 0;
}

.back-btn {
  background: var(--forge-surface);
  border: 1px solid var(--forge-border);
  color: var(--forge-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background: var(--forge-surface-hover);
}

.interview-layout {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.interview-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--forge-bg-card);
  border: 1px solid var(--forge-border);
  border-radius: var(--forge-radius-lg);
  padding: var(--forge-space-xl);
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
  position: sticky;
  top: 1rem;
}

.interview-sidebar::-webkit-scrollbar { width: 4px; }
.interview-sidebar::-webkit-scrollbar-track { background: transparent; }
.interview-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

.interview-sidebar h3 {
  color: var(--forge-ember);
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: var(--forge-space-lg);
}

.topic-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.topic-item {
  padding: 0.5rem 0.7rem;
  border-radius: var(--forge-radius-sm);
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--forge-text-secondary);
  font-weight: 500;
  transition: all var(--forge-transition-fast);
  margin-bottom: 0.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topic-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--forge-text);
}

.topic-item.active {
  background: rgba(249, 115, 22, 0.15);
  color: var(--forge-fire);
  font-weight: 600;
}

.topic-item.group-header {
  color: var(--forge-ember);
  font-weight: 700;
  margin-top: 0.5rem;
}

.toggle-icon {
  font-size: 0.7rem;
  margin-right: 0.3rem;
}

.topic-status {
  font-size: 0.75rem;
  opacity: 0.7;
}

.progress-bar-wrap {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--forge-border);
}

.progress-text {
  font-size: 0.8rem;
  color: var(--forge-text-secondary);
  margin-bottom: 0.4rem;
}

.progress-track {
  height: 6px;
  background: var(--forge-surface);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--forge-fire);
  border-radius: 3px;
  transition: width 0.3s;
}

.interview-card {
  flex: 1;
  min-width: 0;
  background: var(--forge-bg-card);
  border: 1px solid var(--forge-border);
  border-radius: var(--forge-radius-lg);
  padding: 1.5rem;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
}

.interview-card::-webkit-scrollbar { width: 4px; }
.interview-card::-webkit-scrollbar-track { background: transparent; }
.interview-card::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

.topic-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--forge-text);
  margin-top: 0;
  margin-bottom: 1rem;
}

.topic-body {
  color: var(--forge-text);
  line-height: 1.7;
  font-size: 0.95rem;
}

.topic-body :deep(h1),
.topic-body :deep(h2),
.topic-body :deep(h3),
.topic-body :deep(h4) {
  color: var(--forge-text);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.topic-body :deep(code) {
  background: var(--forge-surface);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.88em;
  font-family: 'JetBrains Mono', monospace;
}

.topic-body :deep(pre) {
  background: var(--forge-surface);
  padding: 1rem;
  border-radius: var(--forge-radius-sm);
  overflow-x: auto;
}

.topic-body :deep(pre code) {
  background: none;
  padding: 0;
}

.topic-body :deep(blockquote) {
  border-left: 3px solid var(--forge-ember);
  padding-left: 1rem;
  margin-left: 0;
  color: var(--forge-text-secondary);
}

.topic-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.topic-body :deep(th),
.topic-body :deep(td) {
  padding: 0.5rem;
  border: 1px solid var(--forge-border);
  text-align: left;
}

.topic-body :deep(th) {
  background: var(--forge-surface);
  font-weight: 600;
}

.topic-body :deep(ul),
.topic-body :deep(ol) {
  padding-left: 1.5rem;
}

.topic-body :deep(.checklist-item) {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.4rem 0.5rem;
  border-radius: var(--forge-radius-sm);
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 0.2rem;
}

.topic-body :deep(.checklist-item:hover) {
  background: var(--forge-surface-hover);
}

.topic-body :deep(.checklist-item input[type="checkbox"]) {
  margin-top: 0.15rem;
  accent-color: var(--forge-fire);
  cursor: pointer;
  flex-shrink: 0;
}

.topic-body :deep(.checklist-item.checked > span) {
  text-decoration: line-through;
  opacity: 0.6;
}

.topic-body :deep(a) {
  color: var(--forge-fire);
  text-decoration: none;
}

.topic-body :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 800px) {
  .interview-layout { flex-direction: column; }
  .interview-sidebar { width: 100%; max-height: none; position: static; }
  .interview-card { max-height: none; }
}
</style>
