<template>
  <div v-if="lesson" class="backend-lesson-page">
    <header class="page-header">
      <div class="page-shell">
        <CTopbar
          :title="lesson.title"
          back-label="Lộ trình"
          back-path="/java/backend-basics"
          @go-home="navigate"
        />
        <div class="lesson-heading">
          <p class="eyebrow">BÀI {{ lessonNumber }} / {{ backendBasicsLessons.length }}</p>
          <h2>{{ lesson.title }}</h2>
          <p class="lesson-summary">{{ lesson.summary }}</p>
        </div>
      </div>
    </header>

    <div class="page-shell lesson-layout">
      <aside class="lesson-toc" aria-label="Mục lục bài học">
        <div class="toc-card">
          <a
            class="roadmap-link"
            href="/java/backend-basics"
            @click.prevent="navigate('/java/backend-basics')"
          >
            ← Quay về lộ trình
          </a>
          <h2>Trong bài này</h2>
          <nav>
            <a v-for="section in sections" :key="section.id" :href="`#${section.id}`">
              {{ section.label }}
            </a>
          </nav>
        </div>
      </aside>

      <main class="lesson-content">
        <section id="goals" class="content-section">
          <h2>Mục tiêu học tập</h2>
          <ul>
            <li v-for="goal in lesson.goals" :key="goal">{{ goal }}</li>
          </ul>
        </section>

        <section id="prerequisites" class="content-section">
          <h2>Kiến thức cần có</h2>
          <ul>
            <li v-for="item in lesson.prerequisites" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section id="concept" class="content-section">
          <h2>Giải thích khái niệm</h2>
          <p v-for="paragraph in lesson.concept" :key="paragraph">{{ paragraph }}</p>
        </section>

        <section id="flow" class="content-section">
          <h2>Luồng xử lý từng bước</h2>
          <ol class="flow-list">
            <li v-for="step in lesson.flow" :key="step">{{ step }}</li>
          </ol>
        </section>

        <section id="design" class="content-section">
          <h2>Hướng dẫn thiết kế và áp dụng</h2>
          <ul>
            <li v-for="item in lesson.designGuidance" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section id="example" class="content-section example-section">
          <h2>Ví dụ thực hành có chú giải</h2>
          <p>{{ lesson.example.introduction }}</p>
          <pre class="code-example"><code>{{ lesson.example.code }}</code></pre>
          <ul class="annotation-list">
            <li v-for="annotation in lesson.example.annotations" :key="annotation">
              {{ annotation }}
            </li>
          </ul>
        </section>

        <section id="pitfalls" class="content-section">
          <h2>Lỗi thường gặp</h2>
          <ul>
            <li v-for="pitfall in lesson.pitfalls" :key="pitfall">{{ pitfall }}</li>
          </ul>
        </section>

        <section id="checklist" class="content-section">
          <h2>Tự kiểm tra</h2>
          <ul class="checklist">
            <li v-for="item in lesson.checklist" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section id="exercise" class="content-section exercise-section">
          <h2>Bài tập nhỏ</h2>
          <p>{{ lesson.exercise }}</p>
        </section>

        <nav class="lesson-pager" aria-label="Điều hướng bài học">
          <a
            v-if="previousLesson"
            class="pager-link previous-link"
            :href="`/java/backend-basics/${previousLesson.id}`"
            @click.prevent="openLesson(previousLesson.id)"
          >
            <span class="pager-direction">Bài trước</span>
            <span class="pager-title">← {{ previousLesson.title }}</span>
          </a>
          <span v-else class="pager-spacer" aria-hidden="true"></span>
          <a
            v-if="nextLesson"
            class="pager-link next-link"
            :href="`/java/backend-basics/${nextLesson.id}`"
            @click.prevent="openLesson(nextLesson.id)"
          >
            <span class="pager-direction">Bài tiếp theo</span>
            <span class="pager-title">{{ nextLesson.title }} →</span>
          </a>
          <a
            v-else
            class="pager-link next-link"
            href="/java/backend-basics"
            @click.prevent="navigate('/java/backend-basics')"
          >
            <span class="pager-direction">Hoàn thành lộ trình</span>
            <span class="pager-title">Quay về danh sách →</span>
          </a>
        </nav>
      </main>
    </div>
  </div>
  <div v-else class="invalid-lesson" role="status">
    Đang quay về lộ trình Backend…
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CTopbar from '../components/CTopbar.vue';
import { backendBasicsLessons } from '../data/backend-basics-lessons.js';
import { navigate } from '../utils/navigate.js';

const route = useRoute();
const router = useRouter();
const lesson = computed(() => backendBasicsLessons.find((item) => item.id === route.params.lessonId));
const lessonIndex = computed(() => backendBasicsLessons.findIndex((item) => item.id === route.params.lessonId));
const lessonNumber = computed(() => String(lessonIndex.value + 1).padStart(2, '0'));
const previousLesson = computed(() => backendBasicsLessons[lessonIndex.value - 1] || null);
const nextLesson = computed(() => backendBasicsLessons[lessonIndex.value + 1] || null);
const sections = [
  { id: 'goals', label: 'Mục tiêu' },
  { id: 'prerequisites', label: 'Kiến thức cần có' },
  { id: 'concept', label: 'Khái niệm' },
  { id: 'flow', label: 'Luồng xử lý' },
  { id: 'design', label: 'Thiết kế và áp dụng' },
  { id: 'example', label: 'Ví dụ thực hành' },
  { id: 'pitfalls', label: 'Lỗi thường gặp' },
  { id: 'checklist', label: 'Tự kiểm tra' },
  { id: 'exercise', label: 'Bài tập nhỏ' },
];

watch(
  () => route.params.lessonId,
  (lessonId) => {
    if (!backendBasicsLessons.some((item) => item.id === lessonId)) {
      router.replace({ name: 'java-backend-basics' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  { immediate: true },
);

function openLesson(lessonId) {
  router.push({ name: 'java-backend-basics-lesson', params: { lessonId } });
}
</script>

<style scoped>
.backend-lesson-page {
  min-height: 100vh;
  color: var(--forge-text);
  background: var(--forge-bg);
}

.page-shell {
  width: min(100% - 2rem, 76rem);
  margin-inline: auto;
}

.page-header {
  padding: 2rem 0 2.5rem;
  background: var(--forge-bg2);
  border-bottom: 1px solid var(--forge-glass-border);
}

.page-header :deep(.hub-topbar) {
  margin-bottom: 2rem;
}

.lesson-heading {
  max-width: 58rem;
}

.eyebrow {
  margin: 0 0 0.5rem;
  color: var(--forge-fire);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.lesson-heading h2 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.lesson-summary {
  margin: 0.85rem 0 0;
  color: var(--forge-text2);
  font-size: 1.05rem;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.lesson-layout {
  display: grid;
  grid-template-columns: minmax(13rem, 17rem) minmax(0, 1fr);
  align-items: start;
  gap: 2rem;
  padding-block: 2rem 4rem;
}

.lesson-toc {
  position: sticky;
  top: 1rem;
  min-width: 0;
}

.toc-card {
  padding: 1rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.roadmap-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--forge-fire);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
}

.roadmap-link:hover,
.toc-card nav a:hover {
  text-decoration: underline;
}

.toc-card h2 {
  margin: 0 0 0.65rem;
  font-size: 1rem;
}

.toc-card nav {
  display: grid;
  gap: 0.2rem;
}

.toc-card nav a {
  padding: 0.45rem 0.5rem;
  color: var(--forge-text2);
  font-size: 0.87rem;
  line-height: 1.4;
  text-decoration: none;
  border-radius: 0.5rem;
  overflow-wrap: anywhere;
}

.toc-card nav a:focus-visible,
.roadmap-link:focus-visible,
.pager-link:focus-visible {
  outline: 2px solid var(--forge-fire);
  outline-offset: 3px;
}

.lesson-content {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.content-section {
  min-width: 0;
  padding: clamp(1rem, 3vw, 1.5rem);
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  scroll-margin-top: 1rem;
}

.content-section h2 {
  margin: 0 0 0.85rem;
  font-size: clamp(1.15rem, 2.5vw, 1.45rem);
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.content-section p,
.content-section li {
  color: var(--forge-text2);
  line-height: 1.75;
  overflow-wrap: anywhere;
}

.content-section p {
  margin: 0 0 0.9rem;
}

.content-section p:last-child {
  margin-bottom: 0;
}

.content-section ul,
.content-section ol {
  display: grid;
  gap: 0.65rem;
  padding-left: 1.3rem;
  margin: 0;
}

.flow-list li::marker {
  color: var(--forge-fire);
  font-weight: 800;
}

.code-example {
  max-width: 100%;
  margin: 1rem 0;
  padding: 1rem;
  color: var(--forge-text);
  background: var(--forge-bg);
  border: 1px solid var(--forge-glass-border);
  border-radius: 0.75rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.86rem;
  line-height: 1.65;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  tab-size: 2;
}

.code-example code {
  font: inherit;
  white-space: pre;
}

.annotation-list {
  padding-left: 1.3rem;
}

.exercise-section {
  border-left: 0.25rem solid var(--forge-fire);
}

.lesson-pager {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
}

.pager-link {
  display: grid;
  align-content: center;
  gap: 0.4rem;
  min-width: 0;
  min-height: 5rem;
  padding: 1rem;
  color: var(--forge-text);
  text-decoration: none;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.pager-link:hover {
  border-color: var(--forge-fire);
}

.next-link {
  text-align: right;
}

.pager-direction {
  color: var(--forge-text3);
  font-size: 0.8rem;
}

.pager-title {
  color: var(--forge-fire);
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.invalid-lesson {
  padding: 2rem;
  color: var(--forge-text2);
  text-align: center;
}

@media (max-width: 52rem) {
  .lesson-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
  }

  .lesson-toc {
    position: static;
  }

  .toc-card nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 36rem) {
  .page-header {
    padding-top: 1.25rem;
  }

  .toc-card nav {
    grid-template-columns: minmax(0, 1fr);
  }

  .lesson-pager {
    grid-template-columns: minmax(0, 1fr);
  }

  .next-link {
    text-align: left;
  }

  .pager-spacer {
    display: none;
  }
}
</style>
