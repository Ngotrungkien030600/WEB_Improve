<template>
  <div class="devops-section-page">
    <div class="ds-wrap">
      <CTopbar
        title="🐳 DevOps"
        back-label="DevOps"
        @go-home="handleBack"
      />

      <!-- Topic tabs -->
      <div class="ds-topics">
        <button
          v-for="topic in devopsTopics"
          :key="topic.id"
          class="ds-topic-tab"
          :class="{ active: topic.id === currentTopicId }"
          @click="goToFirst(topic)"
        >
          {{ topicIcon(topic.id) }} {{ cleanTitle(topic.title) }}
        </button>
      </div>

      <!-- Section number nav -->
      <div class="ds-nav">
        <button
          v-for="(s, i) in currentSections"
          :key="s.id"
          class="ds-nav-item"
          :class="{ active: s.id === currentId }"
          @click="goTo(s.id)"
        >
          {{ i + 1 }}
        </button>
      </div>

      <section class="ds-panel" v-if="current">
        <div class="ds-title">{{ current.title }}</div>
        <div class="ds-body" v-html="current.html"></div>
      </section>

      <div class="ds-pager">
        <button
          class="ds-pager-btn"
          :disabled="!prev"
          @click="goTo(prev.id)"
        >
          ← {{ prevTitle }}
        </button>
        <button
          class="ds-pager-btn next"
          :disabled="!next"
          @click="goTo(next.id)"
        >
          {{ nextTitle }} →
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import { navigate } from '../utils/navigate.js';
import { devopsTopics } from '../data/devops-sections.js';

const TOPIC_ICONS = {
  docker: '🐳',
  kubernetes: '☸️',
  cicd: '🔄',
  terraform: '🏗️',
  monitoring: '📊',
  aws: '☁️',
};

export default {
  name: 'DevopsSectionPage',
  components: { CTopbar },
  data() {
    return { devopsTopics };
  },
  computed: {
    currentTopicId() {
      return this.$route.params.topicId;
    },
    currentTopic() {
      return this.devopsTopics.find(t => t.id === this.currentTopicId) || null;
    },
    currentSections() {
      return this.currentTopic ? this.currentTopic.sections : [];
    },
    currentId() {
      return this.$route.params.sectionId;
    },
    current() {
      return this.currentSections.find(s => s.id === this.currentId) || null;
    },
    currentIndex() {
      return this.currentSections.findIndex(s => s.id === this.currentId);
    },
    prev() {
      const i = this.currentIndex;
      return i > 0 ? this.currentSections[i - 1] : null;
    },
    next() {
      const i = this.currentIndex;
      return i >= 0 && i < this.currentSections.length - 1 ? this.currentSections[i + 1] : null;
    },
    prevTitle() {
      return this.prev ? this.prev.title.replace(/^\d+\.\s*/, '') : '';
    },
    nextTitle() {
      return this.next ? this.next.title.replace(/^\d+\.\s*/, '') : '';
    },
  },
  mounted() {
    this.ensureValid();
  },
  watch: {
    '$route.params'() {
      this.ensureValid();
    },
  },
  methods: {
    ensureValid() {
      if (!this.currentTopic || !this.current) {
        navigate(`/devops/${this.devopsTopics[0].id}/${this.devopsTopics[0].sections[0].id}`, { target: 'router' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    handleBack() {
      navigate('/devops');
    },
    goTo(id) {
      navigate(`/devops/${this.currentTopicId}/${id}`, { target: 'router' });
    },
    goToFirst(topic) {
      navigate(`/devops/${topic.id}/${topic.sections[0].id}`, { target: 'router' });
    },
    topicIcon(id) {
      return TOPIC_ICONS[id] || '🐳';
    },
    cleanTitle(title) {
      return title.replace(/^[^\s]+\s/, '');
    },
  },
};
</script>

<style scoped>
.devops-section-page {
  --ds-accent: #2496ed;
  color-scheme: dark;

  min-height: 100vh;
  background:
    radial-gradient(1200px 500px at 50% -10%, rgba(36, 150, 237, 0.08), transparent 60%),
    var(--forge-bg);
  padding: 2.5rem 1.5rem 4rem;
}

.ds-wrap {
  max-width: 820px;
  margin: 0 auto;
}

/* Topic tabs */
.ds-topics {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.ds-topic-tab {
  padding: var(--space-2) var(--space-4);
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: 99px;
  color: var(--forge-text2);
  font-size: var(--font-xs);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ds-topic-tab:hover {
  border-color: var(--ds-accent);
  color: var(--forge-text);
}

.ds-topic-tab.active {
  background: var(--ds-accent);
  border-color: var(--ds-accent);
  color: white;
}

/* Section number nav */
.ds-nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  padding: var(--space-3);
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.ds-nav-item {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  color: var(--forge-text2);
  font-size: var(--font-sm);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ds-nav-item:hover {
  border-color: var(--ds-accent);
  color: var(--forge-text);
}

.ds-nav-item.active {
  background: var(--ds-accent);
  border-color: var(--ds-accent);
  color: white;
}

/* Panel */
.ds-panel {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  overflow: hidden;
  margin-bottom: var(--space-5);
}

.ds-title {
  background: var(--forge-bg2);
  padding: var(--space-4) var(--space-5);
  font-size: var(--font-xl);
  font-weight: 700;
  border-bottom: 1px solid var(--forge-glass-border);
  color: var(--forge-text);
}

.ds-body {
  padding: var(--space-6);
  font-size: var(--font-sm);
  color: var(--forge-text2);
  line-height: 1.7;
}

.ds-body h3 {
  font-size: var(--font-base);
  font-weight: 700;
  margin: var(--space-5) 0 var(--space-2);
  color: var(--ds-accent);
}

.ds-body h3:first-child {
  margin-top: 0;
}

.ds-body h4 {
  font-size: var(--font-sm);
  font-weight: 700;
  margin: var(--space-4) 0 var(--space-1);
  color: var(--forge-text);
}

.ds-body p {
  font-size: var(--font-sm);
  color: var(--forge-text2);
  margin-bottom: var(--space-3);
}

.ds-body ul {
  padding-left: var(--space-5);
  margin-bottom: var(--space-3);
}

.ds-body li {
  font-size: var(--font-sm);
  color: var(--forge-text2);
  margin-bottom: var(--space-1);
}

.ds-body strong {
  color: var(--forge-text);
}

.ds-body pre {
  background: var(--forge-bg2);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-size: var(--font-xs);
  font-family: var(--font-mono);
  overflow-x: auto;
  margin: var(--space-3) 0;
  line-height: 1.6;
  color: var(--forge-text2);
}

.ds-body code {
  background: var(--forge-bg2);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: var(--font-mono);
  color: var(--forge-text2);
}

.ds-body pre code {
  background: transparent;
  padding: 0;
  color: inherit;
}

.ds-body .diagram {
  background: var(--forge-bg2);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin: var(--space-3) 0;
  text-align: center;
  font-size: var(--font-xs);
  color: var(--ds-accent);
  font-weight: 600;
  line-height: 2;
  font-family: var(--font-mono);
  overflow-x: auto;
  white-space: pre-line;
}

.ds-body .grid-2,
.ds-body .grid-3 {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-3) 0;
}

.ds-body .grid-2 {
  grid-template-columns: 1fr 1fr;
}

.ds-body .grid-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.ds-body .card {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.ds-body .card h4 {
  font-size: var(--font-sm);
  font-weight: 700;
  margin-bottom: var(--space-1);
  color: var(--forge-text);
}

.ds-body .card p,
.ds-body .card li {
  font-size: var(--font-xs);
  color: var(--forge-text3);
}

.ds-body .card ul {
  padding-left: var(--space-4);
}

.ds-body .card li {
  margin-bottom: 0.2rem;
}

.ds-body table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-3) 0;
  font-size: var(--font-xs);
}

.ds-body th,
.ds-body td {
  border: 1px solid var(--forge-glass-border);
  padding: var(--space-2);
  text-align: left;
}

.ds-body th {
  background: var(--forge-bg2);
  color: var(--ds-accent);
}

/* Pager */
.ds-pager {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}

.ds-pager-btn {
  padding: var(--space-3) var(--space-5);
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-lg);
  color: var(--forge-text2);
  font-size: var(--font-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.ds-pager-btn:hover:not(:disabled) {
  border-color: var(--ds-accent);
  color: var(--forge-text);
}

.ds-pager-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ds-pager-btn.next {
  margin-left: auto;
}

@media (max-width: 700px) {
  .ds-body .grid-2,
  .ds-body .grid-3 {
    grid-template-columns: 1fr;
  }

  .ds-pager {
    flex-direction: column;
  }

  .ds-pager-btn.next {
    margin-left: 0;
  }
}
</style>
