<template>
  <div class="cloud-section-page">
    <div class="cs-wrap">
      <CTopbar
        title="☁️ AWS Cloud"
        back-label="AWS Cloud"
        @go-home="handleBack"
      />

      <div class="cs-nav">
        <button
          v-for="(s, i) in cloudSections"
          :key="s.id"
          class="cs-nav-item"
          :class="{ active: s.id === currentId }"
          @click="goTo(s.id)"
        >
          {{ i + 1 }}
        </button>
      </div>

      <section class="cs-panel" v-if="current">
        <div class="cs-title">{{ current.title }}</div>
        <div class="cs-body" v-html="current.html"></div>
      </section>

      <div class="cs-pager">
        <button
          class="cs-pager-btn"
          :disabled="!prev"
          @click="goTo(prev.id)"
        >
          ← {{ prevTitle }}
        </button>
        <button
          class="cs-pager-btn next"
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
import { cloudSections } from '../data/cloud-sections.js';

export default {
  name: 'CloudSectionPage',
  components: { CTopbar },
  data() {
    return { cloudSections };
  },
  computed: {
    currentId() {
      return this.$route.params.sectionId;
    },
    current() {
      return this.cloudSections.find(s => s.id === this.currentId) || null;
    },
    currentIndex() {
      return this.cloudSections.findIndex(s => s.id === this.currentId);
    },
    prev() {
      const i = this.currentIndex;
      return i > 0 ? this.cloudSections[i - 1] : null;
    },
    next() {
      const i = this.currentIndex;
      return i >= 0 && i < this.cloudSections.length - 1 ? this.cloudSections[i + 1] : null;
    },
    prevTitle() {
      return this.prev ? this.prev.title.replace(/^\d+\.\s*/, '') : '';
    },
    nextTitle() {
      return this.next ? this.next.title.replace(/^\d+\.\s*/, '') : '';
    },
  },
  mounted() {
    // Redirect to first section if the id is unknown
    if (!this.current) {
      navigate('/cloud/iam', { target: 'router' });
    }
  },
  watch: {
    '$route.params.sectionId'() {
      if (!this.current) {
        navigate('/cloud/iam', { target: 'router' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
  },
  methods: {
    handleBack() {
      navigate('/cloud');
    },
    goTo(id) {
      navigate('/cloud/' + id, { target: 'router' });
    },
  },
};
</script>

<style scoped>
.cloud-section-page {
  --cs-accent: var(--accent-cloud, #7c5cfc);
  color-scheme: dark;

  min-height: 100vh;
  background:
    radial-gradient(1200px 500px at 50% -10%, rgba(124, 92, 252, 0.08), transparent 60%),
    var(--forge-bg);
  padding: 2.5rem 1.5rem 4rem;
}

.cs-wrap {
  max-width: 820px;
  margin: 0 auto;
}

/* Section number nav */
.cs-nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  padding: var(--space-3);
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.cs-nav-item {
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

.cs-nav-item:hover {
  border-color: var(--cs-accent);
  color: var(--forge-text);
}

.cs-nav-item.active {
  background: var(--cs-accent);
  border-color: var(--cs-accent);
  color: white;
}

/* Panel */
.cs-panel {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  overflow: hidden;
  margin-bottom: var(--space-5);
}

.cs-title {
  background: var(--forge-bg2);
  padding: var(--space-4) var(--space-5);
  font-size: var(--font-xl);
  font-weight: 700;
  border-bottom: 1px solid var(--forge-glass-border);
  color: var(--forge-text);
}

.cs-body {
  padding: var(--space-6);
  font-size: var(--font-sm);
  color: var(--forge-text2);
  line-height: 1.7;
}

.cs-body h3 {
  font-size: var(--font-base);
  font-weight: 700;
  margin: var(--space-5) 0 var(--space-2);
  color: var(--cs-accent);
}

.cs-body h3:first-child {
  margin-top: 0;
}

.cs-body h4 {
  font-size: var(--font-sm);
  font-weight: 700;
  margin: var(--space-4) 0 var(--space-1);
  color: var(--forge-text);
}

.cs-body p {
  font-size: var(--font-sm);
  color: var(--forge-text2);
  margin-bottom: var(--space-3);
}

.cs-body ul {
  padding-left: var(--space-5);
  margin-bottom: var(--space-3);
}

.cs-body li {
  font-size: var(--font-sm);
  color: var(--forge-text2);
  margin-bottom: var(--space-1);
}

.cs-body strong {
  color: var(--forge-text);
}

.cs-body pre {
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

.cs-body code {
  background: var(--forge-bg2);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: var(--font-mono);
  color: var(--forge-text2);
}

.cs-body pre code {
  background: transparent;
  padding: 0;
  color: inherit;
}

.cs-body .diagram {
  background: var(--forge-bg2);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin: var(--space-3) 0;
  text-align: center;
  font-size: var(--font-xs);
  color: var(--cs-accent);
  font-weight: 600;
  line-height: 2;
  font-family: var(--font-mono);
  overflow-x: auto;
  white-space: pre-line;
}

.cs-body .grid-2,
.cs-body .grid-3 {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-3) 0;
}

.cs-body .grid-2 {
  grid-template-columns: 1fr 1fr;
}

.cs-body .grid-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.cs-body .card {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.cs-body .card h4 {
  font-size: var(--font-sm);
  font-weight: 700;
  margin-bottom: var(--space-1);
  color: var(--forge-text);
}

.cs-body .card p,
.cs-body .card li {
  font-size: var(--font-xs);
  color: var(--forge-text3);
}

.cs-body .card ul {
  padding-left: var(--space-4);
}

.cs-body .card li {
  margin-bottom: 0.2rem;
}

.cs-body table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-3) 0;
  font-size: var(--font-xs);
}

.cs-body th,
.cs-body td {
  border: 1px solid var(--forge-glass-border);
  padding: var(--space-2);
  text-align: left;
}

.cs-body th {
  background: var(--forge-bg2);
  color: var(--cs-accent);
}

/* Pager */
.cs-pager {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}

.cs-pager-btn {
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

.cs-pager-btn:hover:not(:disabled) {
  border-color: var(--cs-accent);
  color: var(--forge-text);
}

.cs-pager-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cs-pager-btn.next {
  margin-left: auto;
}

@media (max-width: 700px) {
  .cs-body .grid-2,
  .cs-body .grid-3 {
    grid-template-columns: 1fr;
  }

  .cs-pager {
    flex-direction: column;
  }

  .cs-pager-btn.next {
    margin-left: 0;
  }
}
</style>
