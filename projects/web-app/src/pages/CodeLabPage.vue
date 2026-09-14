<template>
  <div class="page-root" style="--color-accent: #8b5cf6">
    <div class="container">
      <header class="page-topbar">
        <div class="topbar-left">
          <h1>🧪 Phòng luyện code</h1>
          <p>Viết code, chạy thật, chấm điểm bằng test ẩn — như LeetCode nhưng tiếng Việt</p>
        </div>
        <div class="topbar-right">
          <button class="home-btn" type="button" aria-label="Về trang chủ" title="Về trang chủ" @click="handleNavigate('/')">🏠</button>
        </div>
      </header>

      <section class="score-strip">
        <div class="score-card rank-card">
          <span class="score-emoji">{{ progress.rank.emoji }}</span>
          <div class="score-text">
            <span class="score-value">{{ progress.rank.label }}</span>
            <span class="score-key">{{ progress.next ? `Còn ${progress.next.min - progress.score} điểm để lên ${progress.next.label}` : 'Hạng cao nhất rồi!' }}</span>
          </div>
        </div>
        <div class="score-card">
          <span class="score-value">{{ progress.score }}<small>/{{ progress.maxScore }}</small></span>
          <span class="score-key">Tổng điểm</span>
        </div>
        <div class="score-card">
          <span class="score-value">{{ progress.solved }}<small>/{{ progress.total }}</small></span>
          <span class="score-key">Bài đã giải</span>
        </div>
        <div class="score-card">
          <span class="score-value">{{ progress.attempted }}</span>
          <span class="score-key">Bài đã thử</span>
        </div>
        <div class="score-card progress-card">
          <div class="progress-track"><div class="progress-fill" :style="{ width: `${progress.percent}%` }"></div></div>
          <span class="score-key">Hoàn thành {{ progress.percent }}%</span>
        </div>
      </section>

      <div class="lab-layout">
        <aside class="lab-sidebar" :class="{ 'is-hidden': mobileView === 'problem' }">
          <div class="filter-box">
            <input
              v-model="query"
              class="filter-search"
              type="search"
              placeholder="🔍 Tìm bài (không cần dấu)..."
              aria-label="Tìm bài theo tên hoặc chủ đề"
            />
            <div class="filter-row">
              <button
                v-for="level in difficulties"
                :key="level.id"
                type="button"
                class="filter-chip"
                :class="{ active: difficulty === level.id }"
                :style="{ '--chip': level.color }"
                @click="difficulty = difficulty === level.id ? 'all' : level.id"
              >{{ level.label }}</button>
            </div>
            <div class="filter-row">
              <button
                v-for="option in statusOptions"
                :key="option.id"
                type="button"
                class="filter-chip"
                :class="{ active: status === option.id }"
                @click="status = option.id"
              >{{ option.label }}</button>
            </div>
            <select v-model="category" class="filter-select" aria-label="Lọc theo chủ đề">
              <option value="all">Mọi chủ đề</option>
              <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <p class="list-count">{{ filtered.length }} bài phù hợp</p>

          <ul class="problem-list">
            <li
              v-for="problem in filtered"
              :key="problem.id"
              class="problem-item"
              :class="{ active: problem.id === currentId, solved: isSolved(problem.id) }"
              :style="{ '--level': levelOf(problem).color }"
            >
              <button type="button" class="problem-btn" @click="selectProblem(problem.id)">
                <span class="problem-status">{{ isSolved(problem.id) ? '✅' : (recordOf(problem.id) ? '🕒' : '⬜') }}</span>
                <span class="problem-main">
                  <span class="problem-title">{{ problem.title }}</span>
                  <span class="problem-meta">{{ problem.category }} · {{ levelOf(problem).label }}</span>
                </span>
                <span class="problem-points">{{ pointsOf(problem) }}đ</span>
              </button>
            </li>
          </ul>
          <p v-if="!filtered.length" class="list-empty">Không có bài nào khớp bộ lọc.</p>
        </aside>

        <main class="lab-main">
          <div v-if="!current" class="empty-state">
            <span class="empty-emoji">👈</span>
            <p>Chọn một bài ở cột bên trái để bắt đầu.</p>
          </div>

          <template v-else>
            <div class="mobile-bar">
              <button type="button" class="ghost-btn" @click="mobileView = mobileView === 'list' ? 'problem' : 'list'">
                {{ mobileView === 'list' ? '📝 Mở bài đang làm' : '📚 Xem danh sách bài' }}
              </button>
            </div>

            <article class="panel problem-panel">
              <header class="panel-head">
                <div class="panel-title-row">
                  <span class="level-badge" :style="{ '--level': levelOf(current).color }">{{ levelOf(current).label }}</span>
                  <h2>{{ current.title }}</h2>
                  <span v-if="isSolved(current.id)" class="solved-badge">✅ Đã giải</span>
                </div>
                <p class="panel-sub">{{ current.summary }} · {{ current.category }} · tối đa {{ pointsOf(current) }} điểm</p>
                <div class="tabs" role="tablist">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    type="button"
                    role="tab"
                    class="tab"
                    :class="{ active: activeTab === tab.id }"
                    :aria-selected="activeTab === tab.id ? 'true' : 'false'"
                    @click="activeTab = tab.id"
                  >{{ tab.label }}</button>
                </div>
              </header>

              <div v-if="activeTab === 'desc'" class="panel-body">
                <p v-for="(line, index) in current.description" :key="index" class="desc-line" v-html="formatText(line)"></p>

                <h3 class="block-title">Ví dụ</h3>
                <div v-for="(example, index) in current.examples" :key="index" class="example-box">
                  <div class="example-row"><span class="example-key">Đầu vào</span><code>{{ example.input }}</code></div>
                  <div class="example-row"><span class="example-key">Kết quả</span><code>{{ example.output }}</code></div>
                  <div v-if="example.explain" class="example-explain">→ {{ example.explain }}</div>
                </div>

                <h3 class="block-title">Ràng buộc</h3>
                <ul class="plain-list">
                  <li v-for="(item, index) in current.constraints" :key="index"><code>{{ item }}</code></li>
                </ul>

                <h3 class="block-title">Test hiện (bạn thấy được)</h3>
                <table class="test-table">
                  <thead><tr><th>#</th><th>Đầu vào</th><th>Mong đợi</th></tr></thead>
                  <tbody>
                    <tr v-for="(test, index) in visibleTests" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td><code>{{ previewArgs(test.args) }}</code></td>
                      <td><code>{{ previewValue(test.expected) }}</code></td>
                    </tr>
                  </tbody>
                </table>
                <p class="hint-note">Còn {{ hiddenCount }} test ẩn sẽ chạy khi bạn bấm <strong>Nộp bài</strong>.</p>

                <h3 class="block-title">Gợi ý</h3>
                <p v-if="!revealedHints" class="hint-note">Chưa mở gợi ý nào. Tự nghĩ trước sẽ nhớ lâu hơn.</p>
                <ol class="hint-list">
                  <li v-for="(hint, index) in current.hints.slice(0, revealedHints)" :key="index">{{ hint }}</li>
                </ol>
                <button
                  v-if="revealedHints < current.hints.length"
                  type="button"
                  class="ghost-btn"
                  @click="revealedHints += 1"
                >💡 Mở gợi ý {{ revealedHints + 1 }}/{{ current.hints.length }}</button>
              </div>

              <div v-else-if="activeTab === 'solution'" class="panel-body">
                <div v-if="!solutionUnlocked" class="locked-box">
                  <p>Hãy tự giải trước khi xem lời giải — xem sớm rất dễ quên.</p>
                  <button type="button" class="ghost-btn" @click="solutionUnlocked = true">Tôi vẫn muốn xem lời giải</button>
                </div>
                <div v-else>
                  <p class="hint-note">Lời giải tham khảo — so sánh với cách của bạn để học thêm.</p>
                  <pre class="code-view"><code v-html="solutionHtml"></code></pre>
                </div>
              </div>

              <div v-else class="panel-body">
                <p v-if="!submissions.length" class="hint-note">Chưa có bài nộp nào cho bài này.</p>
                <table v-else class="test-table">
                  <thead><tr><th>#</th><th>Kết quả</th><th>Test đạt</th><th>Điểm</th><th>Thời gian</th></tr></thead>
                  <tbody>
                    <tr v-for="(item, index) in submissions" :key="index">
                      <td>{{ submissions.length - index }}</td>
                      <td><span class="verdict-pill" :class="verdictOf(item.verdict).tone">{{ verdictOf(item.verdict).emoji }} {{ verdictOf(item.verdict).label }}</span></td>
                      <td>{{ item.passed }}/{{ item.total }}</td>
                      <td>{{ item.score }}</td>
                      <td>{{ formatDuration(item.ms) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article class="panel editor-panel">
              <CCodeEditor
                v-model="code"
                :aria-label="`Soạn code cho bài ${current.title}`"
                @run="runVisible"
                @submit="submit"
                @change="queueDraft"
              />

              <div class="editor-toolbar">
                <button type="button" class="run-btn" :disabled="running" @click="runVisible">
                  {{ running && runMode === 'run' ? '⏳ Đang chạy...' : '▶ Chạy thử' }}
                </button>
                <button type="button" class="submit-btn" :disabled="running" @click="submit">
                  {{ running && runMode === 'submit' ? '⏳ Đang chấm...' : '📤 Nộp bài' }}
                </button>
                <button type="button" class="ghost-btn" :disabled="running" @click="resetCode">↻ Đặt lại code</button>
                <button type="button" class="ghost-btn" :disabled="running" @click="loadSolutionCode">📋 Nạp lời giải mẫu</button>
                <span class="timer-chip" :class="{ live: running }">⏱ {{ busyLabel }}</span>
              </div>

              <section v-if="result" class="result-box" :class="verdictOf(result.verdict).tone">
                <div class="result-head">
                  <span class="result-verdict">{{ verdictOf(result.verdict).emoji }} {{ verdictOf(result.verdict).label }}</span>
                  <span class="result-stats">
                    {{ result.passed }}/{{ result.total }} test đạt · {{ formatDuration(result.totalMs) }}
                    <template v-if="runMode === 'submit'"> · +{{ lastScore }} điểm</template>
                  </span>
                </div>
                <p v-if="result.compileError" class="result-error">{{ result.compileError }}</p>
                <p v-else-if="result.verdict === 'TLE'" class="result-error">Code chạy quá lâu (quá {{ timeoutLabel }}) nên bị ngắt. Kiểm tra vòng lặp hoặc thuật toán chậm.</p>
                <ul class="test-results">
                  <li v-for="item in result.results" :key="item.index" class="test-row" :class="{ pass: item.passed, fail: !item.passed }">
                    <span class="test-index">#{{ item.index + 1 }}</span>
                    <span class="test-state">{{ testStateOf(item) }}</span>
                    <span class="test-detail">
                      <template v-if="item.visible">{{ previewArgs(item.args) }}</template>
                      <template v-else>Test ẩn — không hiện dữ liệu</template>
                    </span>
                    <span class="test-time">{{ formatDuration(item.ms) }}</span>
                  </li>
                </ul>
                <div v-if="failedDetails.length" class="detail-box">
                  <p v-for="item in failedDetails" :key="item.index" class="detail-line">
                    <strong>#{{ item.index + 1 }}</strong> mong đợi <code>{{ previewValue(item.expected) }}</code>
                    nhưng nhận <code>{{ previewValue(item.actual) }}</code>
                  </p>
                </div>
                <pre v-if="result.logs.length" class="console-box">{{ result.logs.join('\n') }}</pre>
                <p v-if="result.verdict === 'AC' && runMode === 'submit'" class="result-cheer">
                  🎉 Đạt hết test! Bạn được {{ lastScore }} điểm cho bài này (tốt nhất: {{ bestScoreOf(current.id) }} điểm).
                </p>
              </section>
            </article>
          </template>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import CCodeEditor from '../components/CCodeEditor.vue';
import { navigate } from '../utils/navigate.js';
import { CODE_PROBLEMS } from '../data/code-problems.js';
import { runCode } from '../utils/code-runner.js';
import {
  DIFFICULTIES,
  escapeHtml,
  filterProblems,
  categoriesOf,
  findDifficulty,
  findVerdict,
  formatDuration,
  highlightJs,
  maxScoreOf,
  previewArgs,
  previewValue,
  progressOf,
  readDrafts,
  readSolutions,
  resetProblem,
  saveDraft,
  saveSolution,
  scoreOf,
} from '../logic/code-lab-logic.js';

const RUN_TIMEOUT = 6000;

export default {
  name: 'CodeLabPage',
  components: { CCodeEditor },
  data() {
    return {
      problems: CODE_PROBLEMS,
      difficulties: DIFFICULTIES,
      statusOptions: [
        { id: 'all', label: 'Tất cả' },
        { id: 'unsolved', label: 'Chưa giải' },
        { id: 'solved', label: 'Đã giải' },
      ],
      query: '',
      difficulty: 'all',
      category: 'all',
      status: 'all',
      currentId: '',
      activeTab: 'desc',
      mobileView: 'problem',
      code: '',
      solutions: {},
      drafts: {},
      running: false,
      runMode: 'run',
      result: null,
      lastScore: 0,
      revealedHints: 0,
      solutionUnlocked: false,
      draftTimer: null,
      elapsed: 0,
      elapsedTimer: null,
    };
  },
  computed: {
    current() {
      return this.problems.find((item) => item.id === this.currentId) || null;
    },
    categories() {
      return categoriesOf(this.problems);
    },
    filtered() {
      return filterProblems(this.problems, {
        query: this.query,
        difficulty: this.difficulty,
        category: this.category,
        status: this.status,
        solutions: this.solutions,
      });
    },
    progress() {
      return progressOf(this.problems, this.solutions);
    },
    tabs() {
      return [
        { id: 'desc', label: '📄 Đề bài' },
        { id: 'solution', label: '💡 Lời giải' },
        { id: 'submissions', label: `📜 Bài nộp${this.submissions.length ? ` (${this.submissions.length})` : ''}` },
      ];
    },
    submissions() {
      if (!this.current) return [];
      const record = this.solutions[this.current.id];
      return record?.history || [];
    },
    visibleTests() {
      return (this.current?.tests || []).filter((test) => test.visible);
    },
    hiddenCount() {
      return (this.current?.tests || []).length - this.visibleTests.length;
    },
    solutionHtml() {
      return highlightJs(this.current?.solution || '');
    },
    failedDetails() {
      return (this.result?.results || []).filter((item) => !item.passed && item.visible && !item.error);
    },
    timeoutLabel() {
      return formatDuration(RUN_TIMEOUT);
    },
    busyLabel() {
      if (this.running) return `${this.elapsed.toFixed(1)}s`;
      if (!this.current) return '0.0s';
      const record = this.solutions[this.current.id];
      if (record?.ms) return `nhanh nhất ${formatDuration(record.ms)}`;
      return 'chưa chạy';
    },
  },
  created() {
    this.solutions = readSolutions();
    this.drafts = readDrafts();
    this.openFromRoute();
  },
  mounted() {
    window.addEventListener('beforeunload', this.flushDraft);
  },
  beforeUnmount() {
    this.flushDraft();
    window.removeEventListener('beforeunload', this.flushDraft);
    this.stopElapsed();
  },
  watch: {
    '$route.query.bai': function onQueryChange() {
      this.openFromRoute();
    },
  },
  methods: {
    handleNavigate(path) {
      navigate(path, this.$router);
    },
    verdictOf(id) {
      return findVerdict(id);
    },
    levelOf(problem) {
      return findDifficulty(problem.difficulty);
    },
    pointsOf(problem) {
      return maxScoreOf(problem);
    },
    previewArgs,
    previewValue,
    formatDuration,
    isSolved(problemId) {
      return Boolean(this.solutions[problemId]?.solved);
    },
    recordOf(problemId) {
      return this.solutions[problemId] || null;
    },
    bestScoreOf(problemId) {
      return this.solutions[problemId]?.score || 0;
    },
    formatText(line) {
      return escapeHtml(line)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    },
    testStateOf(item) {
      if (item.skipped) return '⏱ Bỏ qua (quá thời gian)';
      if (item.error) return `💥 ${item.error}`;
      return item.passed ? '✅ Đạt' : '❌ Không đạt';
    },
    openFromRoute() {
      const id = this.$route?.query?.bai;
      const found = this.problems.some((problem) => problem.id === id);
      this.currentId = found ? id : (this.problems[0]?.id || '');
      this.loadProblem();
    },
    loadProblem() {
      const problem = this.current;
      if (!problem) return;
      this.code = this.drafts[problem.id] ?? problem.starter;
      this.result = null;
      this.lastScore = 0;
      this.revealedHints = 0;
      this.solutionUnlocked = false;
      this.activeTab = 'desc';
      this.mobileView = 'problem';
      this.stopElapsed();
    },
    selectProblem(id) {
      if (id === this.currentId) {
        this.mobileView = 'problem';
        return;
      }
      this.flushDraft();
      this.currentId = id;
      this.drafts = readDrafts();
      this.loadProblem();
      if (this.$route?.query?.bai !== id) {
        this.$router.replace({ query: { ...this.$route.query, bai: id } }).catch(() => {});
      }
    },
    queueDraft(value) {
      this.code = value;
      if (this.draftTimer) clearTimeout(this.draftTimer);
      this.draftTimer = setTimeout(() => {
        if (this.current) saveDraft(this.current.id, this.code);
      }, 500);
    },
    flushDraft() {
      if (this.draftTimer) {
        clearTimeout(this.draftTimer);
        this.draftTimer = null;
      }
      if (this.current) saveDraft(this.current.id, this.code);
    },
    resetCode() {
      if (!this.current) return;
      resetProblem(this.current.id);
      this.code = this.current.starter;
      this.result = null;
      this.lastScore = 0;
      this.solutions = readSolutions();
      this.drafts = readDrafts();
    },
    loadSolutionCode() {
      if (!this.current) return;
      this.code = this.current.solution;
      this.queueDraft(this.code);
    },
    testsFor(mode) {
      const tests = this.current?.tests || [];
      if (mode === 'run') return tests.filter((test) => test.visible);
      return tests;
    },
    async execute(mode) {
      const problem = this.current;
      if (!problem || this.running) return;
      const tests = this.testsFor(mode);
      this.running = true;
      this.runMode = mode;
      this.result = null;
      this.elapsed = 0;
      this.startElapsed();
      let outcome = null;
      try {
        outcome = await runCode({
          code: this.code,
          functionName: problem.functionName,
          tests,
          compare: problem.compare || 'exact',
          timeoutMs: RUN_TIMEOUT,
        });
        if (mode === 'submit') {
          const gradedScore = scoreOf({
            difficulty: problem.difficulty,
            passed: outcome.passed,
            total: outcome.total,
            ms: outcome.totalMs,
          });
          this.lastScore = outcome.verdict === 'AC' ? gradedScore : 0;
          saveSolution(problem.id, {
            verdict: outcome.verdict,
            passed: outcome.passed,
            total: outcome.total,
            score: this.lastScore,
            ms: outcome.totalMs,
          });
          this.solutions = readSolutions();
        } else {
          this.lastScore = 0;
        }
        this.flushDraft();
      } catch (err) {
        this.result = {
          verdict: 'CE',
          compileError: `Không chạy được code: ${(err && err.message) || err}`,
          results: [],
          logs: [],
          totalMs: 0,
          passed: 0,
          total: tests.length,
        };
      } finally {
        this.stopElapsed();
        this.running = false;
      }
      if (outcome) this.result = outcome;
    },
    runVisible() {
      return this.execute('run');
    },
    submit() {
      return this.execute('submit');
    },
    startElapsed() {
      this.stopElapsed();
      const startedAt = Date.now();
      this.elapsedTimer = setInterval(() => {
        this.elapsed = (Date.now() - startedAt) / 1000;
      }, 100);
    },
    stopElapsed() {
      if (this.elapsedTimer) {
        clearInterval(this.elapsedTimer);
        this.elapsedTimer = null;
      }
    },
  },
};
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  padding: 1.5rem 0 3rem;
}

.lab-layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
}

.lab-sidebar {
  position: sticky;
  top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.9rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-search,
.filter-select {
  width: 100%;
  padding: 0.5rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.25);
  color: var(--forge-text, #f8fafc);
  font-family: inherit;
  font-size: 0.8rem;
}

.filter-search::placeholder {
  color: #94a3b8;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.filter-chip {
  padding: 0.32rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: #cbd5e1;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.filter-chip:hover {
  border-color: var(--chip, #8b5cf6);
  color: #f8fafc;
}

.filter-chip.active {
  background: var(--chip, #8b5cf6);
  border-color: var(--chip, #8b5cf6);
  color: #10101c;
}

.list-count {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
}

.problem-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-height: 460px;
  overflow-y: auto;
}

.problem-item {
  border-radius: 10px;
  border: 1px solid transparent;
  border-left: 3px solid var(--level);
  background: rgba(255, 255, 255, 0.03);
}

.problem-item.active {
  background: rgba(139, 92, 246, 0.16);
  border-color: rgba(139, 92, 246, 0.6);
  border-left-color: var(--level);
}

.problem-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.6rem;
  border: none;
  background: transparent;
  color: inherit;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.problem-status {
  font-size: 0.8rem;
  flex-shrink: 0;
}

.problem-main {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
  flex: 1;
}

.problem-title {
  font-size: 0.83rem;
  font-weight: 700;
  color: #f8fafc;
}

.problem-meta {
  font-size: 0.68rem;
  font-weight: 600;
  color: #94a3b8;
}

.problem-points {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--level);
  flex-shrink: 0;
}

.list-empty {
  margin: 0;
  font-size: 0.78rem;
  color: #94a3b8;
}

.lab-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.panel {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.panel-head {
  padding: 1rem 1.1rem 0;
}

.panel-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.panel-title-row h2 {
  margin: 0;
  font-size: 1.15rem;
  color: #f8fafc;
}

.level-badge {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  background: color-mix(in srgb, var(--level) 22%, transparent);
  color: var(--level);
  border: 1px solid color-mix(in srgb, var(--level) 45%, transparent);
}

.solved-badge {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  background: rgba(52, 211, 153, 0.18);
  color: #6ee7b7;
}

.panel-sub {
  margin: 0.3rem 0 0.75rem;
  font-size: 0.78rem;
  color: #94a3b8;
}

.tabs {
  display: flex;
  gap: 0.3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab {
  padding: 0.5rem 0.75rem;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #94a3b8;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.tab:hover {
  color: #f8fafc;
}

.tab.active {
  color: #f8fafc;
  border-bottom-color: #8b5cf6;
}

.panel-body {
  padding: 0.9rem 1.1rem 1.1rem;
}

.desc-line {
  margin: 0 0 0.6rem;
  font-size: 0.86rem;
  line-height: 1.65;
  color: #cbd5e1;
}

.block-title {
  margin: 1rem 0 0.5rem;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #a78bfa;
}

.example-box {
  margin-bottom: 0.55rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.25);
  border-left: 3px solid rgba(139, 92, 246, 0.6);
}

.example-row {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  font-size: 0.8rem;
  color: #e2e8f0;
}

.example-key {
  flex: 0 0 68px;
  font-weight: 700;
  color: #94a3b8;
  font-size: 0.72rem;
}

.example-explain {
  margin-top: 0.3rem;
  font-size: 0.76rem;
  color: #94a3b8;
}

.plain-list {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.8rem;
  color: #cbd5e1;
}

.test-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}

.test-table th {
  text-align: left;
  padding: 0.35rem 0.5rem;
  color: #94a3b8;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.test-table td {
  padding: 0.4rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  vertical-align: top;
}

.hint-note {
  margin: 0.5rem 0 0;
  font-size: 0.76rem;
  color: #94a3b8;
}

.hint-list {
  margin: 0.3rem 0 0.6rem;
  padding-left: 1.1rem;
  font-size: 0.82rem;
  line-height: 1.6;
  color: #cbd5e1;
}

.locked-box {
  padding: 0.9rem;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
  font-size: 0.82rem;
  color: #fcd34d;
}

.code-view {
  margin: 0.6rem 0 0;
  padding: 0.85rem;
  border-radius: 12px;
  background: #0f0d1f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, Menlo, monospace;
  font-size: 13px;
  line-height: 20px;
  color: #e2e8f0;
}

.verdict-pill {
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.verdict-pill.ok { background: rgba(52, 211, 153, 0.18); color: #6ee7b7; }
.verdict-pill.bad { background: rgba(248, 113, 113, 0.18); color: #fca5a5; }
.verdict-pill.warn { background: rgba(245, 158, 11, 0.18); color: #fcd34d; }

.editor-panel {
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.run-btn,
.submit-btn {
  padding: 0.55rem 1rem;
  border-radius: 10px;
  border: none;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
}

.run-btn {
  background: rgba(139, 92, 246, 0.2);
  color: #ddd6fe;
  border: 1px solid rgba(139, 92, 246, 0.5);
}

.submit-btn {
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: #ffffff;
}

.run-btn:hover,
.submit-btn:hover {
  filter: brightness(1.12);
}

.run-btn:disabled,
.submit-btn:disabled,
.ghost-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.ghost-btn {
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.ghost-btn:hover {
  border-color: #8b5cf6;
  color: #f8fafc;
}

.timer-chip {
  margin-left: auto;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.3);
  font-size: 0.74rem;
  font-weight: 700;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

.timer-chip.live {
  color: #fcd34d;
}

.result-box {
  padding: 0.85rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.result-box.ok { border-color: rgba(52, 211, 153, 0.5); background: rgba(52, 211, 153, 0.09); }
.result-box.bad { border-color: rgba(248, 113, 113, 0.5); background: rgba(248, 113, 113, 0.09); }
.result-box.warn { border-color: rgba(245, 158, 11, 0.5); background: rgba(245, 158, 11, 0.09); }

.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.result-verdict {
  font-size: 0.92rem;
  font-weight: 800;
  color: #f8fafc;
}

.result-stats {
  font-size: 0.78rem;
  font-weight: 700;
  color: #cbd5e1;
}

.result-error {
  margin: 0.6rem 0 0;
  padding: 0.5rem 0.65rem;
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.3);
  font-family: 'SFMono-Regular', Consolas, Menlo, monospace;
  font-size: 0.76rem;
  color: #fca5a5;
  white-space: pre-wrap;
}

.test-results {
  list-style: none;
  margin: 0.7rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.test-row {
  display: grid;
  grid-template-columns: 34px minmax(120px, auto) minmax(0, 1fr) 70px;
  gap: 0.5rem;
  align-items: center;
  padding: 0.4rem 0.55rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.22);
  font-size: 0.77rem;
}

.test-row.pass { border-left: 3px solid #34d399; }
.test-row.fail { border-left: 3px solid #f87171; }

.test-index { color: #94a3b8; font-weight: 700; }
.test-state { color: #e2e8f0; font-weight: 700; }
.test-detail { color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.test-time { color: #94a3b8; text-align: right; font-variant-numeric: tabular-nums; }

.detail-box {
  margin-top: 0.6rem;
  padding: 0.5rem 0.65rem;
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.28);
}

.detail-line {
  margin: 0.15rem 0;
  font-size: 0.78rem;
  color: #e2e8f0;
}

.console-box {
  margin: 0.6rem 0 0;
  padding: 0.55rem 0.7rem;
  border-radius: 9px;
  background: #0b0a16;
  max-height: 150px;
  overflow: auto;
  font-family: 'SFMono-Regular', Consolas, Menlo, monospace;
  font-size: 0.75rem;
  color: #a5f3fc;
  white-space: pre-wrap;
}

.result-cheer {
  margin: 0.6rem 0 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: #6ee7b7;
}

.empty-state {
  padding: 3rem 1rem;
  text-align: center;
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  color: #94a3b8;
}

.empty-emoji {
  font-size: 1.6rem;
}

.mobile-bar {
  display: none;
}

@media (max-width: 900px) {
  .lab-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .lab-sidebar.is-hidden {
    display: none;
  }

  .lab-sidebar {
    position: static;
  }

  .mobile-bar {
    display: block;
  }

  .problem-list {
    max-height: none;
  }

  .test-row {
    grid-template-columns: 30px minmax(0, 1fr) 60px;
  }

  .test-detail {
    display: none;
  }
}
</style>
