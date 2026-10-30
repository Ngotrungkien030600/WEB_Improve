<template>
  <main class="book-page">
    <div class="book-wrap">
      <CTopbar title="📚 The Way to Go" back-label="← Trang chủ" @go-home="goHome" />

      <header class="book-intro">
        <div>
          <p class="eyebrow">BILINGUAL READING COMPANION</p>
          <h2>The Way to Go</h2>
          <p class="book-subtitle">A Thorough Introduction to the Go Programming Language · Ivo Balbaert</p>
          <p class="book-description">{{ copy.description }}</p>
          <p class="edition-note">{{ copy.editionNote }}</p>
        </div>
        <aside class="reading-progress">
          <span>{{ copy.progress }}</span>
          <strong>{{ completedCount }} / {{ totalChapters }}</strong>
          <div class="progress-track" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
            <span :style="{ width: `${progressPercent}%` }"></span>
          </div>
          <small>{{ progressPercent }}% · {{ copy.chapters }}</small>
        </aside>
      </header>

      <div class="toolbar">
        <div class="language-switch" role="group" :aria-label="copy.language">
          <button type="button" :class="{ active: language === 'vi' }" :aria-pressed="language === 'vi'" @click="language = 'vi'">VI</button>
          <button type="button" :class="{ active: language === 'en' }" :aria-pressed="language === 'en'" @click="language = 'en'">EN</button>
        </div>
        <span class="toolbar-note">{{ copy.originalNote }}</span>
      </div>

      <div class="reader-layout">
        <aside class="toc" :aria-label="copy.contents">
          <label class="search-box">
            <span aria-hidden="true">⌕</span>
            <input v-model="query" type="search" :placeholder="copy.search" />
            <button v-if="query" type="button" :aria-label="copy.clear" @click="query = ''">×</button>
          </label>
          <div class="toc-heading">
            <span>{{ copy.contents }}</span>
            <span>{{ filteredCount }}/{{ totalChapters }}</span>
          </div>
          <section v-for="part in visibleParts" :key="part.id" class="toc-part">
            <h3>{{ part.title[language] }}</h3>
            <button
              v-for="chapter in part.chapters"
              :key="chapter.id"
              type="button"
              class="toc-chapter"
              :class="{ active: selectedChapterId === chapter.id, done: readChapters[chapter.id] }"
              :aria-current="selectedChapterId === chapter.id ? 'location' : undefined"
              @click="selectChapter(chapter.id)"
            >
              <span class="toc-page" :aria-label="`${copy.bookPage} ${chapter.page}`">{{ copy.pageShort }} {{ chapter.page }}</span>
              <span class="toc-title">{{ chapter.title[language] }}</span>
              <span v-if="readChapters[chapter.id]" class="toc-check" :aria-label="copy.read">✓</span>
            </button>
          </section>
          <p v-if="!visibleParts.length" class="toc-empty">{{ copy.noResults }}</p>
        </aside>

        <article class="chapter-sheet">
          <div class="chapter-meta">
            <span>{{ currentPart.title[language] }}</span>
            <span>{{ copy.chapter }} {{ currentIndex + 1 }} / {{ totalChapters }} · {{ copy.bookPage }} {{ currentChapter.page }}</span>
          </div>
          <h1>{{ currentChapter.title[language] }}</h1>

          <section class="chapter-section summary-section">
            <h2>{{ copy.summary }}</h2>
            <p>{{ currentChapter.summary[language] }}</p>
          </section>

          <section class="chapter-section">
            <h2>{{ copy.keyIdeas }}</h2>
            <dl class="terms-list">
              <div v-for="term in currentChapter.terms" :key="term.term" class="term-row">
                <dt>{{ term.term }}</dt>
                <dd>{{ term[language] }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="currentChapter.example" class="chapter-section">
            <h2>{{ copy.example }}</h2>
            <pre class="code-example"><code>{{ currentChapter.example }}</code></pre>
            <div class="result-block">
              <h3>{{ copy.result }}</h3>
              <p>{{ currentChapter.result[language] }}</p>
            </div>
          </section>

          <section class="study-task">
            <p class="task-label">{{ copy.tryIt }}</p>
            <p>{{ currentChapter.exercise[language] }}</p>
          </section>

          <aside v-if="currentChapter.note" class="edition-warning">
            <strong>{{ copy.versionNote }}</strong>
            <p>{{ currentChapter.note[language] }}</p>
          </aside>

          <footer class="chapter-actions">
            <button class="nav-chapter" type="button" :disabled="currentIndex === 0" @click="moveChapter(-1)">← {{ copy.previous }}</button>
            <button class="read-button" :class="{ done: readChapters[currentChapter.id] }" type="button" @click="toggleRead">
              {{ readChapters[currentChapter.id] ? `✓ ${copy.read}` : copy.markRead }}
            </button>
            <button class="nav-chapter next" type="button" :disabled="currentIndex === totalChapters - 1" @click="moveChapter(1)">{{ copy.next }} →</button>
          </footer>
        </article>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import CTopbar from '../components/CTopbar.vue';
import { THE_WAY_TO_GO_PARTS } from '../data/the-way-to-go-guide.js';
import { normalizeForSearch } from '../utils/interview-format.js';
import { navigate } from '../utils/navigate.js';

const STORAGE_KEY = 'sf_the_way_to_go_read_v1';
const parts = THE_WAY_TO_GO_PARTS;
const chapters = parts.flatMap((part) => part.chapters.map((chapter) => ({ ...chapter, partId: part.id })));
const language = ref('vi');
const selectedChapterId = ref(chapters[0].id);
const query = ref('');
const readChapters = ref(readProgress());

const copy = computed(() => language.value === 'vi' ? {
  description: 'Reading companion song ngữ theo đúng mục lục sách: ghi chú dễ hiểu, thuật ngữ, ví dụ Go và bài luyện cho từng chương.',
  editionNote: 'Một số hướng dẫn công cụ/cloud trong sách thuộc phiên bản cũ; page đánh dấu nơi cần đối chiếu tài liệu hiện hành.',
  progress: 'TIẾN ĐỘ ĐỌC', chapters: 'chương', language: 'Ngôn ngữ hiển thị', originalNote: 'Ghi chú diễn giải · Không phải bản dịch nguyên văn',
  contents: 'MỤC LỤC', search: 'Tìm chương hoặc thuật ngữ…', clear: 'Xóa tìm kiếm', noResults: 'Không tìm thấy chương phù hợp.',
  chapter: 'CHƯƠNG', bookPage: 'Trang sách', pageShort: 'tr.', summary: 'Ý chính', keyIdeas: 'Thuật ngữ cần nắm', example: 'Ví dụ Go', result: 'Kết quả / quan sát',
  tryIt: 'BÀI LUYỆN', versionNote: 'Ghi chú phiên bản', previous: 'Chương trước', next: 'Chương tiếp',
  read: 'Đã học', markRead: 'Đánh dấu đã học',
} : {
  description: 'A bilingual reading companion following the book’s table of contents: plain-language notes, terminology, Go examples, and practice for every chapter.',
  editionNote: 'Some tooling/cloud guidance reflects an older version; the companion flags topics to verify against current documentation.',
  progress: 'READING PROGRESS', chapters: 'chapters', language: 'Display language', originalNote: 'Original study notes · Not a verbatim translation',
  contents: 'CONTENTS', search: 'Search chapters or terms…', clear: 'Clear search', noResults: 'No matching chapters found.',
  chapter: 'CHAPTER', bookPage: 'Book page', pageShort: 'p.', summary: 'Key idea', keyIdeas: 'Terms to know', example: 'Go example', result: 'Result / observation',
  tryIt: 'PRACTICE', versionNote: 'Version note', previous: 'Previous chapter', next: 'Next chapter',
  read: 'Studied', markRead: 'Mark studied',
});

const currentIndex = computed(() => chapters.findIndex((chapter) => chapter.id === selectedChapterId.value));
const currentChapter = computed(() => chapters[currentIndex.value] || chapters[0]);
const currentPart = computed(() => parts.find((part) => part.id === currentChapter.value.partId) || parts[0]);
const totalChapters = chapters.length;
const completedCount = computed(() => chapters.filter((chapter) => readChapters.value[chapter.id]).length);
const progressPercent = computed(() => Math.round((completedCount.value / totalChapters) * 100));
const filteredParts = computed(() => {
  const search = normalizeForSearch(query.value).trim();
  if (!search) return parts;
  return parts.map((part) => ({
    ...part,
    chapters: part.chapters.filter((chapter) => normalizeForSearch([
      chapter.title.vi,
      chapter.title.en,
      chapter.summary.vi,
      chapter.summary.en,
      ...chapter.terms.flatMap((term) => [term.term, term.vi, term.en]),
    ].join(' ')).includes(search)),
  })).filter((part) => part.chapters.length);
});
const visibleParts = computed(() => filteredParts.value);
const filteredCount = computed(() => filteredParts.value.reduce((sum, part) => sum + part.chapters.length, 0));

watch(readChapters, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.keys(value).filter((id) => value[id])));
  } catch {
  }
}, { deep: true });

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? Object.fromEntries(saved.map((id) => [id, true])) : {};
  } catch {
    return {};
  }
}

function goHome() {
  navigate('/');
}

function selectChapter(id) {
  selectedChapterId.value = id;
}

function toggleRead() {
  readChapters.value = { ...readChapters.value, [currentChapter.value.id]: !readChapters.value[currentChapter.value.id] };
}

function moveChapter(direction) {
  const index = Math.min(Math.max(currentIndex.value + direction, 0), totalChapters - 1);
  selectChapter(chapters[index].id);
}
</script>

<style scoped>
.book-page {
  --book-bg: #111713;
  --book-surface: #1b241e;
  --book-line: #34443a;
  --book-text: #f4f7f1;
  --book-muted: #d3ddd2;
  --book-accent: #c5ee78;
  --book-secondary: #82d5c3;
  min-height: 100vh;
  color: var(--book-text);
  background: var(--book-bg);
  font-size: 16px;
}

.book-wrap {
  width: min(100% - 2.5rem, 1180px);
  margin: 0 auto;
  padding: 2rem 0 4rem;
}

.book-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  align-items: end;
  gap: 2rem;
  padding: 1.1rem 0 1.6rem;
  border-bottom: 1px solid var(--book-line);
}

.eyebrow {
  margin: 0 0 0.6rem;
  color: var(--book-accent);
  font-size: 0.76rem;
  font-weight: 800;
}

.book-intro h2 {
  margin: 0;
  color: var(--book-text);
  font-size: 2.5rem;
  line-height: 1.15;
}

.book-subtitle {
  margin: 0.35rem 0 0;
  color: var(--book-secondary);
  font-size: 0.95rem;
}

.book-description {
  max-width: 70ch;
  margin: 0.8rem 0 0;
  color: var(--book-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.edition-note {
  max-width: 80ch;
  margin: 0.55rem 0 0;
  color: #f1cf8b;
  font-size: 0.88rem;
  line-height: 1.6;
}

.reading-progress {
  display: grid;
  gap: 0.45rem;
  padding: 0.9rem 1rem;
  border-left: 3px solid var(--book-accent);
  background: var(--book-surface);
}

.reading-progress > span,
.reading-progress small {
  color: var(--book-muted);
  font-size: 0.82rem;
}

.reading-progress strong {
  color: var(--book-accent);
  font-size: 1.25rem;
}

.progress-track {
  height: 6px;
  overflow: hidden;
  background: #39443d;
}

.progress-track span {
  display: block;
  height: 100%;
  background: var(--book-accent);
  transition: width 180ms ease;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0 0.25rem;
}

.language-switch {
  display: inline-flex;
  gap: 3px;
  padding: 3px;
  border: 1px solid var(--book-line);
  background: var(--book-surface);
}

.language-switch button {
  min-width: 42px;
  min-height: 38px;
  border: 0;
  color: var(--book-muted);
  background: transparent;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.language-switch button.active {
  color: #17200c;
  background: var(--book-accent);
}

.toolbar-note {
  color: var(--book-muted);
  font-size: 0.84rem;
}

.reader-layout {
  display: grid;
  grid-template-columns: minmax(255px, 0.75fr) minmax(0, 1.8fr);
  align-items: start;
  gap: 2rem;
  padding-top: 1.1rem;
}

.toc {
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding-right: 0.75rem;
  scrollbar-color: #50654f transparent;
  scrollbar-width: thin;
}

.search-box {
  display: flex;
  align-items: center;
  min-height: 44px;
  gap: 0.6rem;
  padding: 0 0.75rem;
  border: 1px solid var(--book-line);
  background: var(--book-surface);
}

.search-box span {
  color: var(--book-accent);
  font-size: 1.3rem;
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--book-text);
  background: transparent;
  font: inherit;
  font-size: 0.92rem;
}

.search-box input::placeholder {
  color: #bbc8bc;
}

.search-box button {
  border: 0;
  color: var(--book-accent);
  background: transparent;
  font: inherit;
  font-size: 1.2rem;
  cursor: pointer;
}

.toc-heading {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--book-line);
  color: var(--book-accent);
  font-size: 0.78rem;
  font-weight: 850;
}

.toc-heading span:last-child {
  color: var(--book-muted);
}

.toc-part {
  padding: 0.9rem 0 0.2rem;
}

.toc-part h3 {
  margin: 0 0 0.45rem;
  color: var(--book-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.toc-chapter {
  display: grid;
  width: 100%;
  grid-template-columns: 3.1rem minmax(0, 1fr) 0.8rem;
  align-items: center;
  gap: 0.5rem;
  min-height: 42px;
  padding: 0.4rem 0.5rem;
  border: 0;
  border-left: 2px solid transparent;
  color: var(--book-muted);
  background: transparent;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.toc-chapter:hover {
  color: var(--book-text);
  background: rgba(255, 255, 255, 0.055);
}

.toc-chapter.active {
  border-left-color: var(--book-accent);
  color: var(--book-text);
  background: rgba(197, 238, 120, 0.09);
}

.toc-page {
  color: #c0ceb8;
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}

.toc-title {
  font-size: 0.9rem;
  line-height: 1.45;
}

.toc-chapter.active .toc-page,
.toc-check {
  color: var(--book-accent);
}

.toc-check {
  font-weight: 900;
}

.toc-empty {
  color: var(--book-muted);
  font-size: 0.9rem;
}

.chapter-sheet {
  min-width: 0;
  padding-left: 1.6rem;
  border-left: 1px solid var(--book-line);
}

.chapter-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  color: var(--book-secondary);
  font-size: 0.77rem;
  font-weight: 800;
}

.chapter-meta span:last-child {
  color: var(--book-muted);
  white-space: nowrap;
}

.chapter-sheet h1 {
  margin: 0.6rem 0 0;
  color: var(--book-text);
  font-size: 1.9rem;
  line-height: 1.25;
}

.chapter-section {
  padding: 1.1rem 0;
  border-top: 1px solid var(--book-line);
}

.summary-section {
  margin-top: 1.1rem;
}

.chapter-section h2 {
  margin: 0 0 0.6rem;
  color: var(--book-secondary);
  font-size: 1.05rem;
}

.summary-section p,
.term-row dd,
.result-block p,
.study-task > p:last-child,
.edition-warning p {
  margin: 0;
  color: var(--book-muted);
  font-size: 1rem;
  line-height: 1.8;
}

.terms-list {
  display: grid;
  gap: 0.65rem;
  margin: 0;
}

.term-row {
  display: grid;
  grid-template-columns: minmax(130px, 0.65fr) minmax(0, 1.5fr);
  gap: 1rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
}

.term-row dt {
  color: var(--book-accent);
  font-size: 0.95rem;
  font-weight: 800;
}

.term-row dd {
  font-size: 0.95rem;
}

.code-example {
  max-width: 100%;
  overflow: auto;
  margin: 0.75rem 0;
  padding: 0.9rem 1rem;
  border: 1px solid #3b4a3e;
  border-radius: 5px;
  color: #e4eedc;
  background: #0c110e;
  font-size: 0.9rem;
  line-height: 1.75;
  tab-size: 4;
}

.result-block {
  padding: 0.75rem 0.9rem;
  border-left: 3px solid var(--book-accent);
  background: rgba(197, 238, 120, 0.07);
}

.result-block h3 {
  margin: 0 0 0.3rem;
  color: var(--book-accent);
  font-size: 0.86rem;
}

.result-block p {
  color: var(--book-text);
  font-size: 0.95rem;
}

.study-task {
  margin: 0.5rem 0 1rem;
  padding: 1rem;
  border-left: 3px solid #f1c77f;
  background: rgba(241, 199, 127, 0.07);
}

.study-task .task-label {
  margin: 0 0 0.4rem;
  color: #f1c77f;
  font-size: 0.76rem;
  font-weight: 850;
}

.edition-warning {
  margin: 1rem 0;
  padding: 0.85rem 0;
  border-top: 1px solid #796742;
  border-bottom: 1px solid #796742;
}

.edition-warning strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #f1c77f;
  font-size: 0.86rem;
}

.chapter-actions {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.3rem;
  padding-top: 1rem;
  border-top: 1px solid var(--book-line);
}

.nav-chapter,
.read-button {
  min-height: 42px;
  padding: 0.45rem 0.7rem;
  border: 0;
  color: var(--book-muted);
  background: transparent;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 750;
  cursor: pointer;
}

.nav-chapter.next {
  justify-self: end;
  color: var(--book-text);
}

.nav-chapter:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.read-button {
  border: 1px solid var(--book-accent);
  border-radius: 4px;
  color: #17200c;
  background: var(--book-accent);
}

.read-button.done {
  color: var(--book-accent);
  background: transparent;
}

button:focus-visible,
.search-box:focus-within {
  outline: 2px solid var(--book-accent);
  outline-offset: 2px;
}

@media (max-width: 760px) {
  .book-wrap {
    width: min(100% - 1.5rem, 1180px);
    padding-top: 1.25rem;
  }

  .book-intro {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .book-intro h2 {
    font-size: 2rem;
  }

  .reading-progress {
    max-width: 360px;
  }

  .reader-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .toc {
    position: static;
    max-height: 360px;
    padding-right: 0.25rem;
    border-bottom: 1px solid var(--book-line);
  }

  .chapter-sheet {
    padding-left: 0;
    border-left: 0;
  }
}

@media (max-width: 480px) {
  .toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .term-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .chapter-sheet h1 {
    font-size: 1.55rem;
  }

  .chapter-actions {
    grid-template-columns: 1fr 1fr;
  }

  .read-button {
    grid-column: 1 / -1;
    grid-row: 1;
    justify-self: center;
  }

  .nav-chapter {
    grid-row: 2;
  }
}
</style>