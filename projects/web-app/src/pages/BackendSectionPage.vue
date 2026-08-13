<template>
  <div class="backend-section-page">
    <!-- Sticky Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-nav">
          <button class="nav-btn" @click="handleNav('/java/hub')">
            <span>←</span>
            <span>Java</span>
          </button>
          <button class="nav-btn" @click="handleNav('/')">
            <span>🏠</span>
            <span>Trang chủ</span>
          </button>
        </div>
        <div class="header-title">
          <h1>⚙️ Backend Engineering</h1>
          <p class="desc">Database, Message Queue, Docker, K8s, CI/CD, System Design, Performance</p>
        </div>
      </div>
    </header>

    <div class="page-content">
      <!-- Section Nav -->
      <aside class="sidebar-toc">
        <div class="toc-container">
          <h3 class="toc-title">Các bài học</h3>
          <nav class="toc-nav">
            <a
              v-for="section in sections"
              :key="section.id"
              href="#"
              class="toc-link"
              :class="{ active: section.id === currentId }"
              @click.prevent="goTo(section.id)"
            >
              <span class="toc-num">{{ section.num }}.</span>
              <span class="toc-text">{{ section.title }}</span>
            </a>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <section class="content-section">
          <div class="section-header">
            <span class="section-num">{{ currentNum }}</span>
            <h2 class="section-title">{{ currentTitle }}</h2>
          </div>
          <div class="section-body">
            <component :is="currentComponent" />
          </div>
        </section>

        <div class="pager">
          <button
            class="pager-btn"
            :disabled="!prev"
            @click="goTo(prev.id)"
          >
            ← {{ prevTitle }}
          </button>
          <button
            class="pager-btn next"
            :disabled="!next"
            @click="goTo(next.id)"
          >
            {{ nextTitle }} →
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import SectionSql from './backend/SectionSql.vue';
import SectionNosql from './backend/SectionNosql.vue';
import SectionMq from './backend/SectionMq.vue';
import SectionDocker from './backend/SectionDocker.vue';
import SectionK8s from './backend/SectionK8s.vue';
import SectionCicd from './backend/SectionCicd.vue';
import SectionDesign from './backend/SectionDesign.vue';
import SectionPerf from './backend/SectionPerf.vue';
import SectionArch from './backend/SectionArch.vue';
import SectionInterview from './backend/SectionInterview.vue';

const sections = [
  { id: 'sql', num: '01', title: 'SQL & Database', component: SectionSql },
  { id: 'nosql', num: '02', title: 'NoSQL Databases', component: SectionNosql },
  { id: 'mq', num: '03', title: 'Message Queue', component: SectionMq },
  { id: 'docker', num: '04', title: 'Docker', component: SectionDocker },
  { id: 'k8s', num: '05', title: 'Kubernetes', component: SectionK8s },
  { id: 'cicd', num: '06', title: 'CI/CD', component: SectionCicd },
  { id: 'design', num: '07', title: 'System Design', component: SectionDesign },
  { id: 'perf', num: '08', title: 'Performance Optimization', component: SectionPerf },
  { id: 'arch', num: '09', title: 'Architecture Patterns', component: SectionArch },
  { id: 'interview', num: '10', title: 'Câu hỏi phỏng vấn', component: SectionInterview },
];

export default {
  name: 'BackendSectionPage',
  components: { SectionSql, SectionNosql, SectionMq, SectionDocker, SectionK8s, SectionCicd, SectionDesign, SectionPerf, SectionArch, SectionInterview },
  data() {
    return { sections };
  },
  computed: {
    currentId() {
      return this.$route.params.sectionId;
    },
    current() {
      return this.sections.find(s => s.id === this.currentId) || null;
    },
    currentComponent() {
      return this.current ? this.current.component : null;
    },
    currentTitle() {
      return this.current ? this.current.title : '';
    },
    currentNum() {
      return this.current ? this.current.num : '';
    },
    currentIndex() {
      return this.sections.findIndex(s => s.id === this.currentId);
    },
    prev() {
      const i = this.currentIndex;
      return i > 0 ? this.sections[i - 1] : null;
    },
    next() {
      const i = this.currentIndex;
      return i >= 0 && i < this.sections.length - 1 ? this.sections[i + 1] : null;
    },
    prevTitle() {
      return this.prev ? this.prev.title : '';
    },
    nextTitle() {
      return this.next ? this.next.title : '';
    },
  },
  mounted() {
    this.ensureValid();
  },
  watch: {
    '$route.params.sectionId'() {
      this.ensureValid();
    },
  },
  methods: {
    ensureValid() {
      if (!this.current) {
        navigate('/java/backend/sql', { target: 'router' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    handleNav(path) {
      navigate(path);
    },
    goTo(id) {
      navigate(`/java/backend/${id}`, { target: 'router' });
    },
  },
};
</script>

<style scoped>
.backend-section-page {
  background: var(--forge-bg);
  min-height: 100vh;
  color: var(--forge-text);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.7;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: linear-gradient(180deg, var(--forge-bg) 0%, var(--forge-bg) 70%, transparent 100%);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 960px;
  margin: 0 auto;
}

.header-nav {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  color: var(--forge-text2);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background: var(--forge-surface-hover);
  color: var(--forge-text);
  border-color: var(--forge-fire);
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.desc {
  color: var(--forge-text2);
  font-size: 0.9rem;
  margin: 0;
}

.page-content {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.sidebar-toc {
  position: relative;
}

.toc-container {
  position: sticky;
  top: 120px;
  padding: 1.25rem;
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.toc-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--forge-text3);
  margin: 0 0 1rem;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toc-link {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: var(--forge-text2);
  font-size: 0.85rem;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.toc-link:hover {
  background: var(--forge-surface-hover);
  color: var(--forge-text);
}

.toc-link.active {
  background: var(--forge-fire);
  color: white;
}

.toc-link.active .toc-num {
  opacity: 0.8;
}

.toc-num {
  font-weight: 600;
  opacity: 0.6;
}

.toc-text {
  flex: 1;
}

.main-content {
  min-width: 0;
}

.content-section {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--forge-glass-border);
}

.section-num {
  font-size: 2rem;
  font-weight: 900;
  font-family: var(--font-mono);
  color: var(--forge-fire);
  opacity: 0.3;
  line-height: 1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--forge-text);
}

.section-body {
  min-height: 200px;
}

/* Pager */
.pager {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--forge-glass-border);
}

.pager-btn {
  padding: 0.75rem 1.5rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-lg);
  color: var(--forge-text2);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.pager-btn:hover:not(:disabled) {
  border-color: var(--forge-fire);
  color: var(--forge-text);
}

.pager-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pager-btn.next {
  margin-left: auto;
}

@media (max-width: 1024px) {
  .page-content {
    grid-template-columns: 1fr;
  }
  .sidebar-toc {
    display: none;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.25rem;
  }
  .section-num {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .page-header {
    padding: 1rem;
  }
  .header-title h1 {
    font-size: 1.25rem;
  }
  .nav-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
  .pager {
    flex-direction: column;
  }
  .pager-btn.next {
    margin-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .content-section {
    animation: none;
  }
}
</style>
