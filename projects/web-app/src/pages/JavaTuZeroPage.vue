<template>
  <div class="tu-zero-page">
    <header class="tz-header">
      <button class="tz-back" @click="goHub">← Java</button>
      <div class="tz-heading">
        <h1>🌱 Java Từ 0 — mất gốc → đi làm</h1>
        <p>
          Dành cho người yếu Java và tư duy lập trình: 6 chương nền tảng + quiz,
          {{ JAVA_TU_ZERO.exercises.length }} bài tập có lời giải từng bước,
          {{ JAVA_TU_ZERO.readCode.length }} bài đọc-code đoán kết quả.
        </p>
      </div>
    </header>

    <!-- Tab điều hướng -->
    <nav class="tz-tabs">
      <button
        v-for="ch in JAVA_TU_ZERO.chapters"
        :key="ch.id"
        class="tz-tab"
        :class="{ active: activeTab === ch.id }"
        @click="activeTab = ch.id"
      >
        {{ ch.emoji }} {{ ch.title }}
      </button>
      <button
        class="tz-tab"
        :class="{ active: activeTab === 'exercises' }"
        @click="activeTab = 'exercises'"
      >
        💪 Bài tập
      </button>
      <button
        class="tz-tab"
        :class="{ active: activeTab === 'readcode' }"
        @click="activeTab = 'readcode'"
      >
        🔍 Đọc code
      </button>
    </nav>

    <!-- ===== Chương lý thuyết ===== -->
    <template v-if="activeTab.startsWith('ch')">
      <section v-for="ch in chapters" :key="ch.id" v-show="activeTab === ch.id" class="tz-section">
        <div class="tz-chapter-head">
          <h2>{{ ch.emoji }} {{ ch.title }}</h2>
          <span class="tz-time">⏱️ {{ ch.time }}</span>
        </div>
        <p class="tz-intro">{{ ch.intro }}</p>

        <div v-for="lesson in ch.lessons" :key="lesson.title" class="tz-lesson">
          <h3>{{ lesson.title }}</h3>
          <p v-for="(para, index) in lesson.paragraphs" :key="index" class="tz-para">{{ para }}</p>
          <div v-for="code in lesson.codes" :key="code.title" class="code-card">
            <div class="code-title">{{ code.title }}</div>
            <pre><code>{{ code.code }}</code></pre>
          </div>
        </div>

        <!-- Quiz cuối chương -->
        <div v-if="ch.quiz && ch.quiz.length" class="tz-quiz">
          <h3>✅ Kiểm tra nhanh — hiểu rồi mới sang bài sau</h3>
          <div v-for="(item, qi) in ch.quiz" :key="qi" class="quiz-item">
            <p class="quiz-q">{{ item.q }}</p>
            <div class="quiz-options">
              <button
                v-for="(opt, oi) in item.options"
                :key="oi"
                class="quiz-opt"
                :class="optionClass(ch.id, qi, oi, item.answer)"
                :disabled="chapterAnswers[quizKey(ch.id, qi)] !== undefined"
                @click="pickChapterAnswer(ch.id, qi, oi)"
              >
                {{ opt }}
              </button>
            </div>
            <p v-if="chapterAnswers[quizKey(ch.id, qi)] !== undefined" class="quiz-why">
              {{ chapterAnswers[quizKey(ch.id, qi)] === item.answer ? '✅ Đúng. ' : '❌ Chưa đúng. ' }}
              {{ item.why }}
            </p>
          </div>
        </div>
      </section>
    </template>

    <!-- ===== Bài tập coding ===== -->
    <section v-else-if="activeTab === 'exercises'" class="tz-section">
      <div class="tz-chapter-head">
        <h2>💪 Bài tập luyện tư duy</h2>
        <span class="tz-time">{{ JAVA_TU_ZERO.exercises.length }} bài · Dễ → Khó</span>
      </div>
      <p class="tz-intro">
        Quy tắc vàng: tự viết 20–30 phút KHÔNG được thì mới xem gợi ý; viết tiếp vẫn bí mới xem đáp án.
        Chép đáp án không rèn được tư duy — hiểu "vì sao" mới là mục tiêu.
      </p>

      <div v-for="ex in JAVA_TU_ZERO.exercises" :key="ex.id" class="ex-card">
        <div class="ex-head">
          <span class="ex-level" :class="'lv-' + ex.level"> {{ levelLabel(ex.level) }} </span>
          <h3>{{ ex.title }}</h3>
        </div>
        <div class="ex-task">
          <strong>Đề bài:</strong> {{ ex.task }}
        </div>
        <div class="ex-buttons">
          <button class="ex-btn" @click="toggleHint(ex.id)">
            {{ openState[ex.id] && openState[ex.id].hint ? 'Ẩn gợi ý' : '💡 Xem gợi ý' }}
          </button>
          <button class="ex-btn primary" @click="toggleAnswer(ex.id)">
            {{ openState[ex.id] && openState[ex.id].answer ? 'Ẩn đáp án' : '✅ Xem đáp án' }}
          </button>
        </div>
        <div v-if="openState[ex.id] && openState[ex.id].hint" class="ex-hint">
          <strong>Cách nghĩ:</strong> {{ ex.hint }}
        </div>
        <div v-if="openState[ex.id] && openState[ex.id].answer" class="ex-answer">
          <div class="code-card">
            <div class="code-title">Lời giải</div>
            <pre><code>{{ ex.solution }}</code></pre>
          </div>
          <p class="ex-explain"><strong>Vì sao:</strong> {{ ex.explain }}</p>
        </div>
      </div>
    </section>

    <!-- ===== Đọc code đoán kết quả ===== -->
    <section v-else class="tz-section">
      <div class="tz-chapter-head">
        <h2>🔍 Đọc code — đoán kết quả</h2>
        <span class="tz-time">{{ JAVA_TU_ZERO.readCode.length }} câu hỏi bẫy</span>
      </div>
      <p class="tz-intro">
        Cách rèn "tư duy lập trình" nhanh nhất: đọc code như máy tính, chạy từng dòng trong đầu rồi đoán output.
        Sai bao nhiêu cũng được — đọc kỹ phần giải thích.
      </p>

      <div v-for="(item, index) in JAVA_TU_ZERO.readCode" :key="index" class="rc-card">
        <span class="rc-index">Câu {{ index + 1 }}</span>
        <div class="code-card">
          <pre><code>{{ item.code }}</code></pre>
        </div>
        <p class="quiz-q">{{ item.question }}</p>
        <div class="quiz-options">
          <button
            v-for="(opt, oi) in item.options"
            :key="oi"
            class="quiz-opt"
            :class="optionClass('rc', index, oi, item.answer)"
            :disabled="readAnswers['rc-' + index] !== undefined"
            @click="pickReadAnswer(index, oi)"
          >
            {{ opt }}
          </button>
        </div>
        <p v-if="readAnswers['rc-' + index] !== undefined" class="quiz-why">
          {{ readAnswers['rc-' + index] === item.answer ? '✅ Đúng. ' : '❌ Chưa đúng. ' }}
          {{ item.explain }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { navigate } from '../utils/navigate.js';
import { JAVA_TU_ZERO } from '../utils/java-tu-zero-content.js';

const chapters = computed(() => JAVA_TU_ZERO.chapters);

const activeTab = ref('ch1');
const chapterAnswers = reactive({});
const readAnswers = reactive({});
const openState = reactive({});

function quizKey(chId, qi) {
  return chId + '-' + qi;
}

function answerStore(key) {
  if (key.startsWith('rc-')) return readAnswers;
  return chapterAnswers;
}

function optionClass(keyPrefix, qi, oi, answer) {
  const key = keyPrefix === 'rc' ? 'rc-' + qi : quizKey(keyPrefix, qi);
  const store = answerStore(key);
  const answered = store[key];
  if (answered === undefined) {
    return {};
  }
  if (oi === answer) {
    return { correct: true };
  }
  if (oi === answered) {
    return { wrong: true };
  }
  return {};
}

function pickChapterAnswer(chId, qi, oi) {
  const key = quizKey(chId, qi);
  if (chapterAnswers[key] === undefined) {
    chapterAnswers[key] = oi;
  }
}

function pickReadAnswer(index, oi) {
  const key = 'rc-' + index;
  if (readAnswers[key] === undefined) {
    readAnswers[key] = oi;
  }
}

function toggleHint(id) {
  if (!openState[id]) openState[id] = { hint: false, answer: false };
  openState[id].hint = !openState[id].hint;
}

function toggleAnswer(id) {
  if (!openState[id]) openState[id] = { hint: false, answer: false };
  openState[id].answer = !openState[id].answer;
}

function levelLabel(level) {
  if (level === 'easy') return 'Dễ';
  if (level === 'medium') return 'Trung bình';
  return 'Khó';
}

function goHub() {
  navigate('/java/hub');
}
</script>

<style scoped>
.tu-zero-page {
  --forge-accent: var(--accent-java, #d9480f);
  background: var(--forge-bg);
  min-height: 100vh;
  padding: 2rem 1.25rem 4rem;
  color: var(--forge-text);
}

.tz-header {
  max-width: 860px;
  margin: 0 auto 1.25rem;
}

.tz-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
  padding: 0.45rem 0.95rem;
  border: 1px solid var(--forge-border);
  border-radius: 10px;
  background: var(--forge-surface);
  color: var(--forge-text2);
  font-size: 0.875rem;
  cursor: pointer;
}

.tz-back:hover {
  border-color: var(--forge-accent);
  color: var(--forge-text);
}

.tz-heading h1 {
  margin: 0 0 0.5rem;
  font-size: 1.6rem;
}

.tz-heading p {
  margin: 0;
  color: var(--forge-text3);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Tabs */
.tz-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  max-width: 860px;
  margin: 0 auto 1.5rem;
}

.tz-tab {
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--forge-border);
  border-radius: 999px;
  background: var(--forge-surface);
  color: var(--forge-text2);
  font-size: 0.85rem;
  cursor: pointer;
}

.tz-tab.active {
  background: var(--forge-accent);
  border-color: var(--forge-accent);
  color: #fff;
}

.tz-section {
  max-width: 860px;
  margin: 0 auto;
}

.tz-chapter-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}

.tz-chapter-head h2 {
  margin: 0;
  font-size: 1.3rem;
}

.tz-time {
  font-size: 0.8rem;
  color: var(--forge-text3);
}

.tz-intro {
  margin: 0 0 1.4rem;
  padding: 0.8rem 1rem;
  border-left: 4px solid var(--forge-accent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--forge-accent) 8%, var(--forge-surface));
  color: var(--forge-text2);
  line-height: 1.6;
}

/* Bài học */
.tz-lesson {
  margin-bottom: 1.75rem;
}

.tz-lesson h3 {
  margin: 0 0 0.6rem;
  font-size: 1.05rem;
}

.tz-para {
  margin: 0 0 0.6rem;
  line-height: 1.7;
  color: var(--forge-text2);
  font-size: 0.95rem;
}

.code-card {
  margin: 0.7rem 0 1rem;
  border: 1px solid var(--forge-border);
  border-radius: 10px;
  overflow: hidden;
  background: #111827;
}

.code-title {
  padding: 0.4rem 0.9rem;
  font-size: 0.75rem;
  color: #9ca3af;
  background: #1f2937;
  border-bottom: 1px solid #374151;
}

.code-card pre {
  margin: 0;
  padding: 0.9rem 1rem;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.55;
  color: #e5e7eb;
  font-family: 'Cascadia Code', Consolas, 'Courier New', monospace;
  white-space: pre;
}

/* Quiz */
.tz-quiz {
  margin-top: 1.5rem;
  padding: 1.1rem;
  border: 1px solid var(--forge-border);
  border-radius: 12px;
  background: var(--forge-surface);
}

.quiz-item {
  margin-bottom: 1.4rem;
}

.quiz-q {
  margin: 0 0 0.55rem;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: pre-line;
  line-height: 1.6;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.quiz-opt {
  text-align: left;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--forge-border);
  border-radius: 10px;
  background: var(--forge-bg);
  color: var(--forge-text);
  font-size: 0.9rem;
  cursor: pointer;
  line-height: 1.5;
}

.quiz-opt:not(:disabled):hover {
  border-color: var(--forge-accent);
}

.quiz-opt.correct {
  background: color-mix(in srgb, #16a34a 18%, transparent);
  border-color: #16a34a;
  color: var(--forge-text);
}

.quiz-opt.wrong {
  background: color-mix(in srgb, #dc2626 16%, transparent);
  border-color: #dc2626;
  color: var(--forge-text);
}

.quiz-why {
  margin: 0.55rem 0 0;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  background: color-mix(in srgb, var(--forge-accent) 8%, transparent);
  color: var(--forge-text2);
  font-size: 0.88rem;
  line-height: 1.6;
}

/* Bài tập */
.ex-card {
  margin-bottom: 1.25rem;
  padding: 1.1rem;
  border: 1px solid var(--forge-border);
  border-radius: 12px;
  background: var(--forge-surface);
}

.ex-head {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
}

.ex-head h3 {
  margin: 0;
  font-size: 1.05rem;
}

.ex-level {
  flex-shrink: 0;
  font-size: 0.72rem;
  padding: 0.18rem 0.6rem;
  border-radius: 999px;
  color: #fff;
}

.lv-easy {
  background: #16a34a;
}

.lv-medium {
  background: #d97706;
}

.lv-hard {
  background: #dc2626;
}

.ex-task {
  margin-bottom: 0.8rem;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  background: var(--forge-bg);
  line-height: 1.6;
  font-size: 0.92rem;
}

.ex-buttons {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.ex-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--forge-border);
  border-radius: 999px;
  background: var(--forge-bg);
  color: var(--forge-text2);
  font-size: 0.85rem;
  cursor: pointer;
}

.ex-btn.primary {
  background: var(--forge-accent);
  border-color: var(--forge-accent);
  color: #fff;
}

.ex-hint {
  margin-top: 0.8rem;
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  border-left: 3px solid #d97706;
  background: color-mix(in srgb, #d97706 10%, transparent);
  line-height: 1.6;
  font-size: 0.9rem;
}

.ex-answer {
  margin-top: 0.8rem;
}

.ex-explain {
  line-height: 1.6;
  font-size: 0.9rem;
  color: var(--forge-text2);
}

/* Đọc code */
.rc-card {
  margin-bottom: 1.25rem;
  padding: 1.1rem;
  border: 1px solid var(--forge-border);
  border-radius: 12px;
  background: var(--forge-surface);
}

.rc-index {
  display: inline-block;
  margin-bottom: 0.6rem;
  font-size: 0.75rem;
  color: var(--forge-accent);
  font-weight: 700;
}

@media (max-width: 640px) {
  .tu-zero-page {
    padding: 1.25rem 0.85rem 3rem;
  }

  .tz-heading h1 {
    font-size: 1.3rem;
  }
}
</style>
