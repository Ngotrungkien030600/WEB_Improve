<template>
  <div class="spring-section-page">
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
          <h1>🍃 Spring Boot</h1>
          <p class="desc">Từ IoC/DI đến Microservices — code mẫu, kiến trúc, best practices</p>
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
import SectionCore from './spring/SectionCore.vue';
import SectionWeb from './spring/SectionWeb.vue';
import SectionJpa from './spring/SectionJpa.vue';
import SectionSecurity from './spring/SectionSecurity.vue';
import SectionBoot from './spring/SectionBoot.vue';
import SectionAsync from './spring/SectionAsync.vue';
import SectionTest from './spring/SectionTest.vue';
import SectionCloud from './spring/SectionCloud.vue';

const sections = [
  { id: 'core', num: '01', title: 'IoC & Dependency Injection', component: SectionCore },
  { id: 'web', num: '02', title: 'Spring MVC & REST API', component: SectionWeb },
  { id: 'jpa', num: '03', title: 'JPA & Hibernate', component: SectionJpa },
  { id: 'security', num: '04', title: 'Spring Security & JWT', component: SectionSecurity },
  { id: 'boot', num: '05', title: 'Auto-config & Actuator', component: SectionBoot },
  { id: 'async', num: '06', title: 'Async & Scheduling', component: SectionAsync },
  { id: 'test', num: '07', title: 'Testing', component: SectionTest },
  { id: 'cloud', num: '08', title: 'Spring Cloud & Microservices', component: SectionCloud },
];

export default {
  name: 'SpringSectionPage',
  components: { SectionCore, SectionWeb, SectionJpa, SectionSecurity, SectionBoot, SectionAsync, SectionTest, SectionCloud },
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
        navigate('/java/spring-boot/core', { target: 'router' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    handleNav(path) {
      navigate(path);
    },
    goTo(id) {
      navigate(`/java/spring-boot/${id}`, { target: 'router' });
    },
  },
};
</script>

<style scoped>
.spring-section-page {
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
