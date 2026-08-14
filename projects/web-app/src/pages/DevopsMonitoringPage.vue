<template>
  <div class="devops-page" style="--dp-accent: #eab308;">
    <div class="dp-wrap">
      <CTopbar title="📊 Monitoring &amp; Observability" back-label="DevOps" @go-home="handleBack" />

      <p class="dp-desc">
        Prometheus, Grafana, CloudWatch, metrics/logs/traces, alerting, golden signals — song ngữ EN-VI
      </p>

      <div class="dp-toc">
        <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="dp-toc-link">
          {{ s.title }}
        </a>
      </div>

      <section v-for="s in sections" :key="s.id" :id="s.id" class="dp-section">
        <div class="dp-section-title">{{ s.title }}</div>
        <div class="dp-section-body" v-html="s.html"></div>
      </section>

      <div class="dp-nav">
        <button class="dp-nav-btn" @click="handleBack">← DevOps Hub</button>
      </div>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import { devopsTopics } from '../data/devops-sections.js';

const TOPIC = devopsTopics.find(t => t.id === 'monitoring');

export default {
  name: 'DevopsMonitoringPage',
  components: { CTopbar },
  data() {
    return {
      sections: TOPIC ? TOPIC.sections : [],
    };
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  methods: {
    handleBack() {
      this.$router.push('/devops');
    },
  },
};
</script>

<style scoped>
.devops-page {
  color-scheme: dark;
  min-height: 100vh;
  background:
    radial-gradient(1200px 500px at 50% -10%, rgba(234, 179, 8, 0.08), transparent 60%),
    var(--forge-bg);
  padding: 2.5rem 1.5rem 4rem;
}

.dp-wrap {
  max-width: 820px;
  margin: 0 auto;
}

.dp-desc {
  color: var(--forge-text2);
  font-size: 0.95rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.dp-toc {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.dp-toc-link {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 0.7rem 1rem;
  text-decoration: none;
  color: var(--forge-text);
  font-size: 0.85rem;
  font-weight: 600;
  transition: border-color 0.2s, color 0.2s;
}

.dp-toc-link:hover {
  border-color: var(--dp-accent);
  color: var(--dp-accent);
}

.dp-section {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 2rem;
}

.dp-section-title {
  background: var(--forge-bg2);
  padding: 0.9rem 1.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-bottom: 1px solid var(--forge-glass-border);
  color: var(--forge-text);
}

.dp-section-body {
  padding: 1.5rem;
}

.dp-section-body :deep(h3) {
  font-size: 1rem;
  font-weight: 700;
  margin: 1.5rem 0 0.5rem;
  color: var(--dp-accent);
}

.dp-section-body :deep(h3:first-child) {
  margin-top: 0;
}

.dp-section-body :deep(h4) {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 1rem 0 0.4rem;
  color: var(--forge-text);
}

.dp-section-body :deep(p) {
  font-size: 0.9rem;
  color: var(--forge-text2);
  margin-bottom: 0.75rem;
  line-height: 1.7;
}

.dp-section-body :deep(ul) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.dp-section-body :deep(li) {
  font-size: 0.85rem;
  color: var(--forge-text2);
  margin-bottom: 0.3rem;
  line-height: 1.6;
}

.dp-section-body :deep(strong) {
  color: var(--forge-text);
}

.dp-section-body :deep(em) {
  color: var(--forge-text3);
  font-style: italic;
}

.dp-section-body :deep(pre) {
  background: var(--forge-bg2);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  font-size: 0.82rem;
  font-family: var(--font-mono);
  overflow-x: auto;
  margin: 0.75rem 0;
  line-height: 1.6;
  color: var(--forge-text2);
}

.dp-section-body :deep(code) {
  background: var(--forge-bg2);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: var(--font-mono);
  color: var(--forge-text2);
}

.dp-section-body :deep(pre code) {
  background: transparent;
  padding: 0;
}

.dp-section-body :deep(.diagram) {
  background: var(--forge-bg2);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  margin: 0.75rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: var(--dp-accent);
  font-weight: 600;
  line-height: 2;
  font-family: var(--font-mono);
  overflow-x: auto;
  white-space: pre-line;
}

.dp-section-body :deep(.grid-2) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 0.75rem 0;
}

.dp-section-body :deep(.grid-3) {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin: 0.75rem 0;
}

.dp-section-body :deep(.card) {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.dp-section-body :deep(.card h4) {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--forge-text);
}

.dp-section-body :deep(.card p),
.dp-section-body :deep(.card li) {
  font-size: 0.8rem;
  color: var(--forge-text2);
}

.dp-section-body :deep(.card ul) {
  padding-left: 1rem;
}

.dp-section-body :deep(.card li) {
  margin-bottom: 0.2rem;
}

.dp-section-body :deep(.tag) {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-right: 0.35rem;
}

.dp-section-body :deep(.tag-metrics) {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
  border: 1px solid rgba(234, 179, 8, 0.2);
}

.dp-section-body :deep(.tag-logs) {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.dp-section-body :deep(.tag-traces) {
  background: rgba(232, 121, 249, 0.1);
  color: #e879f9;
  border: 1px solid rgba(232, 121, 249, 0.2);
}

.dp-section-body :deep(.tag-interview) {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.dp-section-body :deep(.tag-adv) {
  background: rgba(255, 153, 0, 0.1);
  color: #ff9900;
  border: 1px solid rgba(255, 153, 0, 0.2);
}

.dp-nav {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.dp-nav-btn {
  padding: 0.75rem 1.5rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  color: var(--forge-text2);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.dp-nav-btn:hover {
  border-color: var(--dp-accent);
  color: var(--dp-accent);
}

@media (max-width: 700px) {
  .dp-section-body :deep(.grid-2),
  .dp-section-body :deep(.grid-3) {
    grid-template-columns: 1fr;
  }

  .dp-toc {
    grid-template-columns: 1fr;
  }
}
</style>
