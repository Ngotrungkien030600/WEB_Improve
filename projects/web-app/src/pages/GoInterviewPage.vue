<template>
  <main class="go-interview-page">
    <div class="wrap">
      <CTopbar title="🐹 Go Backend" back-label="← Trang chủ" @go-home="goHome" />

      <header class="intro">
        <div class="intro-copy">
          <p class="eyebrow">SKILLFORGE · GO BACKEND</p>
          <h2>{{ copy.title }}</h2>
          <p class="intro-text">{{ copy.description }}</p>
        </div>
        <div class="progress-panel">
          <div class="progress-heading">
            <span>{{ progressLabel }}</span>
            <strong>{{ progressCount }} / {{ progressTotal }}</strong>
          </div>
          <div class="progress-track" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
            <span class="progress-fill" :style="{ width: `${progressPercent}%` }"></span>
          </div>
          <p>{{ progressDetail }} · {{ progressPercent }}%</p>
        </div>
      </header>

      <div class="mode-row">
        <div class="mode-switch" role="tablist" :aria-label="copy.modes">
          <button type="button" role="tab" :aria-selected="mode === 'learn'" :class="{ active: mode === 'learn' }" @click="mode = 'learn'">
            <span aria-hidden="true">01</span>{{ copy.courseMode }}
          </button>
          <button type="button" role="tab" :aria-selected="mode === 'interview'" :class="{ active: mode === 'interview' }" @click="mode = 'interview'">
            <span aria-hidden="true">02</span>{{ copy.interviewMode }}
          </button>
        </div>
        <div class="language-switch" role="group" :aria-label="copy.language">
          <button type="button" :class="{ active: language === 'vi' }" :aria-pressed="language === 'vi'" @click="language = 'vi'">VI</button>
          <button type="button" :class="{ active: language === 'en' }" :aria-pressed="language === 'en'" @click="language = 'en'">EN</button>
        </div>
      </div>

      <section v-if="mode === 'learn'" class="course-layout">
        <aside class="course-nav" :aria-label="copy.courseContents">
          <div class="course-nav-heading">
            <span>{{ copy.courseContents }}</span>
            <span>{{ completedCount }}/{{ totalLessons }}</span>
          </div>
          <section v-for="(module, moduleIndex) in modules" :key="module.id" class="course-module">
            <h3>{{ module.title[language] }}</h3>
            <p>{{ module.summary[language] }}</p>
            <button
              v-for="(lesson, lessonIndex) in module.lessons"
              :key="lesson.id"
              type="button"
              class="lesson-nav-item"
              :class="{ active: lesson.id === currentLesson.id, done: completedLessons[lesson.id] }"
              :aria-current="lesson.id === currentLesson.id ? 'step' : undefined"
              @click="selectLesson(lesson.id)"
            >
              <span class="lesson-nav-number">{{ String(lessonNumber(moduleIndex, lessonIndex)).padStart(2, '0') }}</span>
              <span class="lesson-nav-title">{{ lesson.title[language] }}</span>
              <span v-if="completedLessons[lesson.id]" class="lesson-nav-check" aria-label="Completed">✓</span>
            </button>
          </section>
        </aside>

        <article class="lesson-sheet">
          <div class="lesson-kicker">
            <span>{{ currentModule.title[language] }}</span>
            <span>{{ copy.lessonLabel }} {{ currentLessonNumber }} / {{ totalLessons }}</span>
          </div>
          <h3 class="lesson-title">{{ currentLesson.title[language] }}</h3>
          <p class="lesson-outcome"><strong>{{ copy.goal }}:</strong> {{ currentLesson.outcome[language] }}</p>

          <section class="lesson-section">
            <h4>{{ copy.concept }}</h4>
            <div class="lesson-rich-text" v-html="renderAnswer(currentLesson.lesson[language])"></div>
          </section>

          <section class="lesson-section deep-dive-section">
            <h4>{{ copy.deepDive }}</h4>
            <div class="lesson-rich-text" v-html="renderAnswer(currentLesson.deepDive[language])"></div>
          </section>

          <section class="lesson-section">
            <h4>{{ copy.example }}</h4>
            <pre class="lesson-code"><code>{{ currentLesson.example }}</code></pre>
            <div class="example-output">
              <h5>{{ copy.exampleResult }}</h5>
              <div class="lesson-rich-text" v-html="renderAnswer(currentLesson.exampleOutput[language])"></div>
            </div>
            <div class="lesson-rich-text" v-html="renderAnswer(currentLesson.walkthrough[language])"></div>
          </section>

          <section class="lesson-section lesson-pitfalls">
            <h4>{{ copy.pitfalls }}</h4>
            <div class="lesson-rich-text" v-html="renderAnswer(currentLesson.pitfalls[language])"></div>
          </section>

          <section class="lesson-exercise">
            <div>
              <p class="exercise-label">{{ copy.tryIt }}</p>
              <p>{{ currentLesson.exercise[language] }}</p>
            </div>
            <button type="button" class="solution-toggle" :aria-expanded="showSolution" @click="showSolution = !showSolution">
              {{ showSolution ? copy.hideSolution : copy.checkSolution }}
            </button>
            <div v-if="showSolution" class="solution-content">
              <h4>{{ copy.solution }}</h4>
              <div class="lesson-rich-text" v-html="renderAnswer(currentLesson.solution[language])"></div>
            </div>
          </section>

          <footer class="lesson-footer">
            <button type="button" class="lesson-step-button" :disabled="currentLessonIndex === 0" @click="moveLesson(-1)">
              ← {{ copy.previous }}
            </button>
            <button type="button" class="complete-button" :class="{ complete: completedLessons[currentLesson.id] }" @click="toggleLessonComplete">
              {{ completedLessons[currentLesson.id] ? `✓ ${copy.completed}` : copy.markComplete }}
            </button>
            <button type="button" class="lesson-step-button next" :disabled="currentLessonIndex === totalLessons - 1" @click="moveLesson(1)">
              {{ copy.next }} →
            </button>
          </footer>
        </article>
      </section>

      <section v-else class="interview-mode">
        <div class="study-controls" aria-label="Interview study controls">
          <div class="control-row">
          <div class="tier-tabs" role="tablist" :aria-label="copy.levels">
            <button
              v-for="tier in tiers"
              :key="tier.id"
              type="button"
              role="tab"
              class="tier-tab"
              :class="{ active: selectedTier === tier.id }"
              :style="{ '--tier-color': tier.color }"
              :aria-selected="selectedTier === tier.id"
              @click="selectTier(tier.id)"
            >
              <span class="tier-name">{{ tier.label[language] }}</span>
              <span class="tier-range">{{ tier.range }}</span>
              <span class="tier-count">{{ bank[tier.id].length }}</span>
            </button>
          </div>
        </div>
        <p class="tier-hint">{{ currentTier.hint[language] }}</p>
        <label class="search-box">
          <span aria-hidden="true">⌕</span>
          <input v-model="query" type="search" :placeholder="copy.search" />
          <button v-if="query" type="button" :aria-label="copy.clear" @click="query = ''">×</button>
        </label>
        </div>

        <div class="result-line">
          <span>{{ filteredQuestions.length }} {{ copy.questionsIn }} {{ currentTier.label[language] }}</span>
          <button type="button" class="expand-all" @click="toggleAll">
            {{ allVisibleOpen ? copy.collapse : copy.expand }}
          </button>
        </div>

        <section v-if="filteredQuestions.length" class="question-list" :aria-label="copy.questions">
          <article
            v-for="(item, index) in filteredQuestions"
            :key="item.id"
            class="question-card"
            :class="{ open: openIds.includes(item.id), seen: seen[item.id] }"
          >
            <h3>
              <button
                type="button"
                class="question-trigger"
                :aria-expanded="openIds.includes(item.id)"
                :aria-controls="`answer-${item.id}`"
                @click="toggleQuestion(item.id)"
              >
                <span class="question-number">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="question-main">
                  <span class="question-topic">{{ item.topic[language] }}</span>
                  <span class="question-text">{{ item.q[language] }}</span>
                </span>
                <span v-if="seen[item.id]" class="seen-mark" :aria-label="copy.reviewed">✓</span>
                <span class="chevron" aria-hidden="true">⌄</span>
              </button>
            </h3>
            <div v-show="openIds.includes(item.id)" :id="`answer-${item.id}`" class="answer-panel">
              <div class="answer-content" v-html="renderAnswer(item.a[language])"></div>
              <div class="answer-footer">
                <span>{{ copy.answerHint }}</span>
                <button type="button" :class="{ marked: seen[item.id] }" @click="toggleSeen(item.id)">
                  {{ seen[item.id] ? `✓ ${copy.reviewed}` : copy.markReviewed }}
                </button>
              </div>
            </div>
          </article>
        </section>

        <div v-else class="empty-state">
          <span aria-hidden="true">⌕</span>
          <h3>{{ copy.emptyTitle }}</h3>
          <p>{{ copy.emptyText }}</p>
          <button type="button" @click="query = ''">{{ copy.clear }}</button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import CTopbar from '../components/CTopbar.vue';
import { GO_COURSE_MODULES } from '../data/go-learning-path.js';
import { GO_INTERVIEW_QUESTIONS, GO_INTERVIEW_TIERS } from '../data/go-interview-questions.js';
import { formatAnswer as renderAnswer, normalizeForSearch } from '../utils/interview-format.js';
import { navigate } from '../utils/navigate.js';

const STORAGE_KEY = 'sf_go_interview_seen_v1';
const COURSE_STORAGE_KEY = 'sf_go_course_completed_v1';
const tiers = GO_INTERVIEW_TIERS;
const modules = GO_COURSE_MODULES;
const bank = Object.fromEntries(tiers.map((tier) => [
  tier.id,
  GO_INTERVIEW_QUESTIONS[tier.id].map((question, index) => ({ ...question, id: `${tier.id}-${index + 1}` })),
]));

const language = ref('vi');
const mode = ref('learn');
const selectedTier = ref('junior');
const selectedLessonId = ref(modules[0].lessons[0].id);
const query = ref('');
const openIds = ref([]);
const showSolution = ref(false);
const seen = ref(readSeen());
const completedLessons = ref(readCompletedLessons());
const allLessons = modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, moduleId: module.id })));

const copy = computed(() => language.value === 'vi' ? {
  title: 'Học Go từng bước, hiểu từ gốc đến backend thực tế',
  description: 'Lộ trình đi từ cú pháp và kiểu dữ liệu đến concurrency, HTTP, Redis, Kafka và vận hành production. Mỗi bài có ví dụ, lỗi thường gặp và bài tự kiểm tra.',
  progress: 'TIẾN ĐỘ ÔN TẬP', topics: 'chủ đề', levels: 'Chọn cấp độ', language: 'Ngôn ngữ hiển thị',
  search: 'Tìm câu hỏi, chủ đề hoặc nội dung đáp án…', clear: 'Xóa tìm kiếm', questionsIn: 'câu hỏi trong cấp',
  questions: 'Câu hỏi phỏng vấn Go', expand: 'Mở đáp án', collapse: 'Thu gọn đáp án', reviewed: 'Đã ôn',
  answerHint: 'Đáp án mẫu · Hãy diễn đạt lại bằng trải nghiệm của bạn', markReviewed: 'Đánh dấu đã ôn',
  emptyTitle: 'Chưa tìm thấy câu phù hợp', emptyText: 'Thử từ khóa khác hoặc xóa nội dung tìm kiếm.',
  modes: 'Chế độ học', courseMode: 'Lộ trình học', interviewMode: 'Phỏng vấn', courseContents: 'NỘI DUNG HỌC',
  lessonLabel: 'BÀI', goal: 'Sau bài này', concept: 'Hiểu khái niệm', example: 'Xem code chạy thế nào',
  deepDive: 'Hiểu sâu hơn',
  exampleResult: 'Kết quả / diễn biến',
  pitfalls: 'Lỗi hay gặp', tryIt: 'ĐẾN LƯỢT BẠN', checkSolution: 'Xem gợi ý', hideSolution: 'Ẩn gợi ý',
  solution: 'Gợi ý / lời giải', previous: 'Bài trước', next: 'Bài tiếp', markComplete: 'Đánh dấu đã hiểu',
  completed: 'Đã hoàn thành', courseProgress: 'TIẾN ĐỘ HỌC', lessons: 'bài học', questionsProgress: 'Câu đã ôn',
} : {
  title: 'Learn Go step by step, from first principles to backend systems',
  description: 'Follow a path from syntax and data types to concurrency, HTTP, Redis, Kafka, and production operations. Every lesson includes examples, pitfalls, and a self-check.',
  progress: 'STUDY PROGRESS', topics: 'topics', levels: 'Choose a level', language: 'Display language',
  search: 'Search questions, topics, or answers…', clear: 'Clear search', questionsIn: 'questions in',
  questions: 'Go interview questions', expand: 'Expand answers', collapse: 'Collapse answers', reviewed: 'Reviewed',
  answerHint: 'Sample answer · Put it in your own words', markReviewed: 'Mark reviewed',
  emptyTitle: 'No matching questions', emptyText: 'Try another search term or clear your search.',
  modes: 'Study mode', courseMode: 'Learning path', interviewMode: 'Interview prep', courseContents: 'COURSE CONTENTS',
  lessonLabel: 'LESSON', goal: 'By the end', concept: 'Understand the concept', example: 'See how the code works',
  deepDive: 'Go deeper',
  exampleResult: 'Expected output / behavior',
  pitfalls: 'Common mistakes', tryIt: 'YOUR TURN', checkSolution: 'Show a hint', hideSolution: 'Hide the hint',
  solution: 'Hint / solution', previous: 'Previous', next: 'Next lesson', markComplete: 'Mark understood',
  completed: 'Completed', courseProgress: 'COURSE PROGRESS', lessons: 'lessons', questionsProgress: 'Reviewed',
});

const allQuestions = computed(() => tiers.flatMap((tier) => bank[tier.id]));
const totalQuestions = computed(() => allQuestions.value.length);
const totalTopics = computed(() => new Set(allQuestions.value.map((item) => item.topic.en)).size);
const seenCount = computed(() => allQuestions.value.filter((item) => seen.value[item.id]).length);
const seenPercent = computed(() => totalQuestions.value ? Math.round((seenCount.value / totalQuestions.value) * 100) : 0);
const currentTier = computed(() => tiers.find((tier) => tier.id === selectedTier.value));
const currentQuestions = computed(() => bank[selectedTier.value] || []);
const filteredQuestions = computed(() => {
  const search = normalizeForSearch(query.value).trim();
  if (!search) return currentQuestions.value;
  return currentQuestions.value.filter((item) => normalizeForSearch([
    item.topic.vi, item.topic.en, item.q.vi, item.q.en, item.a.vi, item.a.en,
  ].join(' ')).includes(search));
});
const allVisibleOpen = computed(() => filteredQuestions.value.length > 0 && filteredQuestions.value.every((item) => openIds.value.includes(item.id)));
const totalLessons = allLessons.length;
const completedCount = computed(() => allLessons.filter((lesson) => completedLessons.value[lesson.id]).length);
const currentLessonIndex = computed(() => allLessons.findIndex((lesson) => lesson.id === selectedLessonId.value));
const currentLesson = computed(() => allLessons[currentLessonIndex.value] || allLessons[0]);
const currentModule = computed(() => modules.find((module) => module.id === currentLesson.value.moduleId) || modules[0]);
const currentLessonNumber = computed(() => currentLessonIndex.value + 1);
const progressCount = computed(() => mode.value === 'learn' ? completedCount.value : seenCount.value);
const progressTotal = computed(() => mode.value === 'learn' ? totalLessons : totalQuestions.value);
const progressPercent = computed(() => progressTotal.value ? Math.round((progressCount.value / progressTotal.value) * 100) : 0);
const progressLabel = computed(() => mode.value === 'learn' ? copy.value.courseProgress : copy.value.progress);
const progressDetail = computed(() => mode.value === 'learn' ? copy.value.lessons : `${totalTopics.value} ${copy.value.topics}`);

watch(seen, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.keys(value).filter((id) => value[id])));
  } catch {
  }
}, { deep: true });

watch(completedLessons, (value) => {
  try {
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(Object.keys(value).filter((id) => value[id])));
  } catch {
  }
}, { deep: true });

function readSeen() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? Object.fromEntries(saved.map((id) => [id, true])) : {};
  } catch {
    return {};
  }
}

function readCompletedLessons() {
  try {
    const saved = JSON.parse(localStorage.getItem(COURSE_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? Object.fromEntries(saved.map((id) => [id, true])) : {};
  } catch {
    return {};
  }
}

function goHome() {
  navigate('/');
}

function lessonNumber(moduleIndex, lessonIndex) {
  return modules.slice(0, moduleIndex).reduce((count, module) => count + module.lessons.length, lessonIndex + 1);
}

function selectLesson(id) {
  selectedLessonId.value = id;
  showSolution.value = false;
}

function moveLesson(direction) {
  const nextIndex = Math.min(Math.max(currentLessonIndex.value + direction, 0), totalLessons - 1);
  selectLesson(allLessons[nextIndex].id);
}

function toggleLessonComplete() {
  completedLessons.value = { ...completedLessons.value, [currentLesson.value.id]: !completedLessons.value[currentLesson.value.id] };
}

function selectTier(id) {
  selectedTier.value = id;
  openIds.value = [];
}

function toggleQuestion(id) {
  openIds.value = openIds.value.includes(id)
    ? openIds.value.filter((openId) => openId !== id)
    : [...openIds.value, id];
}

function toggleSeen(id) {
  seen.value = { ...seen.value, [id]: !seen.value[id] };
}

function toggleAll() {
  openIds.value = allVisibleOpen.value ? [] : filteredQuestions.value.map((item) => item.id);
}

</script>

<style scoped>
.go-interview-page {
  --go-accent: #c5ee78;
  --go-text: #f5f7f1;
  --go-muted: #d7dfd5;
  min-height: 100vh;
  color: var(--go-text);
  background: #111713;
  font-size: 16px;
}

.wrap {
  width: min(100% - 2.5rem, 940px);
  margin: 0 auto;
  padding: 2rem 0 4.5rem;
}

.intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 230px;
  align-items: end;
  gap: 2rem;
  padding: 1.1rem 0 1.7rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--go-accent);
  font-size: 0.69rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.intro h2 {
  max-width: 700px;
  margin: 0;
  font-size: 2.3rem;
  line-height: 1.14;
}

.intro-text {
  max-width: 65ch;
  margin: 0.8rem 0 0;
  color: var(--go-muted);
  font-size: 0.93rem;
  line-height: 1.7;
}

.progress-panel {
  padding: 0.95rem 1rem;
  border-left: 2px solid var(--go-accent);
  background: rgba(183, 223, 105, 0.06);
}

.progress-heading {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
}

.progress-heading span,
.progress-panel p {
  color: var(--go-muted);
}

.progress-heading strong {
  color: var(--go-accent);
}

.progress-track {
  height: 5px;
  margin: 0.65rem 0 0.45rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.12);
}

.progress-fill {
  display: block;
  height: 100%;
  background: var(--go-accent);
  transition: width 180ms ease;
}

.progress-panel p {
  margin: 0;
  font-size: 0.7rem;
}

.study-controls {
  padding: 1.25rem 0 0.7rem;
}

.mode-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 0 0.25rem;
}

.mode-switch {
  display: inline-flex;
  gap: 0.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
}

.mode-switch button {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 43px;
  padding: 0.45rem 0.75rem;
  border: 0;
  border-bottom: 2px solid transparent;
  color: var(--go-muted);
  background: transparent;
  font: inherit;
  font-size: 0.86rem;
  font-weight: 750;
  cursor: pointer;
}

.mode-switch button > span {
  color: #a4ad97;
  font-size: 0.66rem;
  font-variant-numeric: tabular-nums;
}

.mode-switch button.active {
  border-bottom-color: var(--go-accent);
  color: var(--go-text);
}

.mode-switch button.active > span {
  color: var(--go-accent);
}

.course-layout {
  display: grid;
  grid-template-columns: minmax(225px, 0.72fr) minmax(0, 1.8fr);
  align-items: start;
  gap: 1.8rem;
  padding-top: 1.3rem;
}

.course-nav {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding-right: 0.8rem;
  scrollbar-color: rgba(183, 223, 105, 0.35) transparent;
  scrollbar-width: thin;
}

.course-nav-heading {
  display: flex;
  justify-content: space-between;
  gap: 0.7rem;
  padding: 0.2rem 0 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
  color: var(--go-accent);
  font-size: 0.67rem;
  font-weight: 800;
}

.course-nav-heading span:last-child {
  color: var(--go-muted);
  font-variant-numeric: tabular-nums;
}

.course-module {
  padding: 0.95rem 0 0.2rem;
}

.course-module h3 {
  margin: 0;
  color: var(--go-text);
  font-size: 0.85rem;
}

.course-module > p {
  margin: 0.25rem 0 0.55rem;
  color: var(--go-muted);
  font-size: 0.7rem;
  line-height: 1.5;
}

.lesson-nav-item {
  display: grid;
  width: 100%;
  grid-template-columns: 1.6rem minmax(0, 1fr) 0.8rem;
  align-items: center;
  gap: 0.45rem;
  min-height: 36px;
  padding: 0.38rem 0.45rem;
  border: 0;
  border-left: 2px solid transparent;
  color: var(--go-muted);
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: color 140ms ease, background 140ms ease, border-color 140ms ease;
}

.lesson-nav-item:hover {
  color: var(--go-text);
  background: rgba(255, 255, 255, 0.045);
}

.lesson-nav-item.active {
  border-left-color: var(--go-accent);
  color: var(--go-text);
  background: rgba(183, 223, 105, 0.09);
}

.lesson-nav-number {
  color: #a4ad97;
  font-size: 0.65rem;
  font-variant-numeric: tabular-nums;
}

.lesson-nav-item.active .lesson-nav-number,
.lesson-nav-check {
  color: var(--go-accent);
}

.lesson-nav-title {
  font-size: 0.75rem;
  line-height: 1.4;
}

.lesson-nav-check {
  font-size: 0.75rem;
  font-weight: 800;
}

.lesson-sheet {
  min-width: 0;
  padding: 0 0 0 1.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
}

.lesson-kicker {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  color: var(--go-accent);
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
}

.lesson-kicker span:last-child {
  color: var(--go-muted);
  white-space: nowrap;
}

.lesson-title {
  margin: 0.6rem 0 0;
  color: var(--go-text);
  font-size: 1.65rem;
  line-height: 1.25;
}

.lesson-outcome {
  margin: 0.65rem 0 1.4rem;
  color: var(--go-muted);
  font-size: 0.84rem;
  line-height: 1.6;
}

.lesson-outcome strong {
  color: var(--go-text);
}

.lesson-section {
  padding: 1.05rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.lesson-section h4,
.solution-content h4 {
  margin: 0 0 0.65rem;
  color: var(--go-text);
  font-size: 0.92rem;
}

.lesson-rich-text {
  color: var(--go-muted);
}

.lesson-rich-text :deep(p),
.lesson-rich-text :deep(li) {
  font-size: 0.84rem;
  line-height: 1.8;
}

.lesson-rich-text :deep(p) {
  margin: 0 0 0.8rem;
}

.lesson-rich-text :deep(p:last-child) {
  margin-bottom: 0;
}

.lesson-rich-text :deep(ul) {
  display: grid;
  gap: 0.35rem;
  padding-left: 1.2rem;
}

.lesson-rich-text :deep(code) {
  padding: 0.08rem 0.3rem;
  border-radius: 3px;
  color: #d7e6bd;
  background: rgba(183, 223, 105, 0.1);
  font-size: 0.9em;
}

.lesson-code {
  max-width: 100%;
  overflow: auto;
  margin: 0.75rem 0 0.85rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: #d7e6bd;
  background: #101510;
  font-size: 0.78rem;
  line-height: 1.7;
  tab-size: 4;
}

.example-output {
  margin: 0 0 0.9rem;
  padding: 0.75rem 0.9rem;
  border-left: 3px solid var(--go-accent);
  background: rgba(197, 238, 120, 0.07);
}

.example-output h5 {
  margin: 0 0 0.35rem;
  color: var(--go-accent);
  font-size: 0.82rem;
}

.example-output .lesson-rich-text {
  color: var(--go-text);
}

.example-output .lesson-rich-text :deep(p) {
  font-size: 0.92rem;
  line-height: 1.7;
}

.lesson-pitfalls h4 {
  color: #f0b35b;
}

.lesson-exercise {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(240, 179, 91, 0.28);
  border-left: 3px solid #f0b35b;
  background: rgba(240, 179, 91, 0.055);
}

.exercise-label {
  margin: 0 0 0.3rem;
  color: #f0b35b;
  font-size: 0.65rem;
  font-weight: 850;
}

.lesson-exercise > div:first-child > p:last-child {
  margin: 0;
  color: var(--go-text);
  font-size: 0.84rem;
  line-height: 1.65;
}

.solution-toggle,
.complete-button {
  width: fit-content;
  min-height: 38px;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgba(183, 223, 105, 0.55);
  border-radius: 4px;
  color: var(--go-accent);
  background: transparent;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
  cursor: pointer;
}

.solution-content {
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.lesson-footer {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.lesson-step-button {
  width: fit-content;
  min-height: 40px;
  padding: 0.45rem 0.6rem;
  border: 0;
  color: var(--go-muted);
  background: transparent;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.lesson-step-button.next {
  justify-self: end;
  color: var(--go-text);
}

.lesson-step-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.complete-button {
  color: #17200c;
  background: var(--go-accent);
}

.complete-button.complete {
  color: var(--go-accent);
  background: transparent;
}

.interview-mode {
  padding-top: 1.1rem;
}

.control-row {
  display: flex;
  align-items: stretch;
  gap: 0.65rem;
}

.tier-tabs {
  display: flex;
  flex: 1;
  gap: 0.4rem;
}

.tier-tab {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
  padding: 0.7rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: var(--go-muted);
  background: rgba(255, 255, 255, 0.035);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease, color 150ms ease;
}

.tier-tab:hover,
.tier-tab.active {
  border-color: var(--tier-color);
}

.tier-tab.active {
  color: var(--go-text);
  background: color-mix(in srgb, var(--tier-color) 12%, transparent);
}

.tier-name {
  font-size: 0.83rem;
  font-weight: 750;
}

.tier-range {
  margin-left: auto;
  color: var(--go-muted);
  font-size: 0.68rem;
  white-space: nowrap;
}

.tier-count {
  display: grid;
  width: 23px;
  height: 23px;
  flex: 0 0 23px;
  place-items: center;
  border-radius: 50%;
  color: var(--tier-color);
  background: rgba(255, 255, 255, 0.07);
  font-size: 0.68rem;
  font-weight: 800;
}

.language-switch {
  display: flex;
  align-items: center;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.035);
}

.language-switch button {
  min-width: 38px;
  min-height: 34px;
  border: 0;
  border-radius: 4px;
  color: var(--go-muted);
  background: transparent;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
}

.language-switch button.active {
  color: #17200c;
  background: var(--go-accent);
}

.tier-hint {
  margin: 0.65rem 0 0.9rem;
  color: var(--go-muted);
  font-size: 0.8rem;
}

.search-box {
  display: flex;
  align-items: center;
  min-height: 44px;
  gap: 0.65rem;
  padding: 0 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.035);
}

.search-box > span {
  color: var(--go-accent);
  font-size: 1.3rem;
  line-height: 1;
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--go-text);
  background: transparent;
  font: inherit;
  font-size: 0.86rem;
}

.search-box input::placeholder {
  color: var(--go-muted);
  opacity: 0.72;
}

.search-box button,
.expand-all {
  border: 0;
  color: var(--go-accent);
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.search-box button {
  font-size: 1.25rem;
}

.result-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0 0.55rem;
  color: var(--go-muted);
  font-size: 0.78rem;
}

.expand-all {
  padding: 0.3rem 0;
  font-size: 0.75rem;
  font-weight: 700;
}

.question-list {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.question-card {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 160ms ease;
}

.question-card.open {
  background: rgba(255, 255, 255, 0.025);
}

.question-card.seen .question-number {
  color: var(--go-accent);
}

.question-card h3 {
  margin: 0;
  font-size: inherit;
}

.question-trigger {
  display: grid;
  width: 100%;
  grid-template-columns: 2.35rem minmax(0, 1fr) 1rem 1rem;
  align-items: center;
  gap: 0.8rem;
  min-height: 76px;
  padding: 0.85rem 0.35rem;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.question-number {
  color: #aab0a0;
  font-size: 0.83rem;
  font-variant-numeric: tabular-nums;
  font-weight: 750;
}

.question-main {
  display: grid;
  min-width: 0;
  gap: 0.15rem;
}

.question-topic {
  color: var(--go-accent);
  font-size: 0.67rem;
  font-weight: 750;
  text-transform: uppercase;
}

.question-text {
  font-size: 0.91rem;
  line-height: 1.5;
}

.seen-mark {
  color: var(--go-accent);
  font-size: 0.85rem;
  font-weight: 900;
}

.chevron {
  color: var(--go-muted);
  font-size: 1.1rem;
  transition: transform 160ms ease;
}

.question-card.open .chevron {
  transform: rotate(180deg);
}

.answer-panel {
  margin: 0 2.6rem 1rem 3.5rem;
  padding: 1rem 1rem 0.2rem;
  border-left: 2px solid rgba(183, 223, 105, 0.65);
  color: var(--go-muted);
  background: rgba(255, 255, 255, 0.035);
}

.answer-content :deep(p),
.answer-content :deep(li) {
  font-size: 0.85rem;
  line-height: 1.75;
}

.answer-content :deep(p) {
  margin: 0 0 0.85rem;
}

.answer-content :deep(ul) {
  padding-left: 1.2rem;
}

.answer-content :deep(pre) {
  overflow-x: auto;
  margin: 0.75rem 0 1rem;
  padding: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: #d7e6bd;
  background: #101510;
  font-size: 0.8rem;
  line-height: 1.6;
}

.answer-content :deep(code) {
  padding: 0.08rem 0.28rem;
  border-radius: 3px;
  color: #d7e6bd;
  background: rgba(183, 223, 105, 0.1);
  font-size: 0.9em;
}

.answer-content :deep(pre code) {
  padding: 0;
  background: transparent;
}

.answer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.69rem;
}

.answer-footer button {
  flex: 0 0 auto;
  padding: 0.45rem 0.65rem;
  border: 1px solid rgba(183, 223, 105, 0.5);
  border-radius: 4px;
  color: var(--go-accent);
  background: transparent;
  font: inherit;
  font-weight: 750;
  cursor: pointer;
}

.answer-footer button.marked {
  color: #17200c;
  background: var(--go-accent);
}

.empty-state {
  padding: 3rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.empty-state > span {
  color: var(--go-accent);
  font-size: 2rem;
}

.empty-state h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.empty-state p {
  color: var(--go-muted);
  font-size: 0.85rem;
}

.empty-state button {
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(183, 223, 105, 0.5);
  border-radius: 4px;
  color: var(--go-accent);
  background: transparent;
  cursor: pointer;
}

button:focus-visible,
.search-box:focus-within {
  outline: 2px solid var(--go-accent);
  outline-offset: 2px;
}

@media (max-width: 700px) {
  .wrap {
    width: min(100% - 1.5rem, 940px);
    padding-top: 1.25rem;
  }

  .intro {
    grid-template-columns: 1fr;
    gap: 1.15rem;
  }

  .intro h2 {
    font-size: 1.8rem;
  }

  .progress-panel {
    max-width: 340px;
  }

  .course-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.2rem;
  }

  .course-nav {
    position: static;
    max-height: 360px;
    padding-right: 0.3rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.13);
  }

  .lesson-sheet {
    padding-left: 0;
    border-left: 0;
  }

  .lesson-title {
    font-size: 1.45rem;
  }

  .control-row {
    align-items: stretch;
    flex-direction: column;
  }

  .tier-tab {
    flex-wrap: wrap;
    gap: 0.25rem 0.45rem;
    padding: 0.6rem;
  }

  .tier-name {
    width: calc(100% - 28px);
    font-size: 0.75rem;
  }

  .tier-range {
    margin-left: 0;
    font-size: 0.62rem;
  }

  .tier-count {
    position: absolute;
    top: 0.45rem;
    right: 0.45rem;
  }

  .language-switch {
    align-self: flex-end;
  }

  .answer-panel {
    margin-right: 0;
    margin-left: 2.7rem;
  }
}

@media (max-width: 420px) {
  .mode-row {
    align-items: flex-start;
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  .mode-switch {
    width: 100%;
  }

  .mode-switch button {
    flex: 1;
    justify-content: center;
    padding-inline: 0.3rem;
    font-size: 0.76rem;
  }

  .lesson-kicker {
    font-size: 0.58rem;
  }

  .lesson-footer {
    grid-template-columns: 1fr 1fr;
  }

  .complete-button {
    grid-column: 1 / -1;
    grid-row: 1;
    justify-self: center;
  }

  .lesson-step-button {
    grid-row: 2;
  }

  .tier-tabs {
    gap: 0.25rem;
  }

  .tier-tab {
    align-content: start;
    min-height: 74px;
  }

  .question-trigger {
    grid-template-columns: 1.8rem minmax(0, 1fr) 0.8rem 0.8rem;
    gap: 0.45rem;
  }

  .answer-panel {
    margin-left: 0.5rem;
    padding-right: 0.7rem;
    padding-left: 0.7rem;
  }

  .answer-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

.go-interview-page :deep(.hub-topbar h1) {
  color: var(--go-text);
}

.go-interview-page :deep(.back-link) {
  border-color: #465448;
  color: var(--go-text);
  background: #202a23;
}

.intro-text {
  font-size: 1rem;
}

.progress-heading {
  font-size: 0.82rem;
}

.progress-panel p {
  font-size: 0.78rem;
}

.mode-switch button {
  font-size: 0.95rem;
}

.mode-switch button > span {
  font-size: 0.75rem;
}

.course-nav-heading {
  font-size: 0.76rem;
}

.course-module h3 {
  font-size: 0.96rem;
}

.course-module > p {
  font-size: 0.86rem;
  line-height: 1.6;
}

.lesson-nav-item {
  min-height: 42px;
}

.lesson-nav-number {
  font-size: 0.76rem;
}

.lesson-nav-title {
  font-size: 0.88rem;
  line-height: 1.45;
}

.lesson-kicker {
  font-size: 0.75rem;
}

.lesson-title {
  font-size: 1.8rem;
}

.lesson-outcome {
  font-size: 0.98rem;
  line-height: 1.7;
}

.lesson-section h4,
.solution-content h4 {
  font-size: 1.05rem;
}

.lesson-rich-text :deep(p),
.lesson-rich-text :deep(li) {
  font-size: 1rem;
  line-height: 1.85;
}

.lesson-code {
  font-size: 0.9rem;
  line-height: 1.75;
}

.exercise-label {
  font-size: 0.76rem;
}

.lesson-exercise > div:first-child > p:last-child {
  font-size: 0.98rem;
  line-height: 1.75;
}

.solution-toggle,
.complete-button,
.lesson-step-button {
  font-size: 0.88rem;
}

.tier-name {
  font-size: 0.92rem;
}

.tier-range,
.tier-count {
  font-size: 0.76rem;
}

.tier-hint {
  font-size: 0.9rem;
  line-height: 1.6;
}

.search-box input {
  font-size: 0.95rem;
}

.result-line {
  font-size: 0.88rem;
}

.expand-all {
  font-size: 0.85rem;
}

.question-number {
  font-size: 0.9rem;
}

.question-topic {
  font-size: 0.76rem;
}

.question-text {
  font-size: 1rem;
  line-height: 1.6;
}

.answer-content :deep(p),
.answer-content :deep(li) {
  font-size: 0.95rem;
  line-height: 1.8;
}

.answer-footer {
  font-size: 0.8rem;
}

@media (max-width: 700px) {
  .lesson-title {
    font-size: 1.6rem;
  }
}
</style>