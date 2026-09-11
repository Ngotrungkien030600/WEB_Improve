<template>
  <div class="interview-page">
    <div class="wrap">
      <CTopbar
        title="💼 Phỏng vấn UI/FE"
        back-label="← Frontend"
        back-path="/frontend/hub"
        @go-home="go"
      />

      <header class="intro">
        <h2 class="intro-title">Ôn phỏng vấn Frontend theo cấp độ</h2>
        <p class="intro-text">
          {{ totalQuestions }} câu hỏi chia theo 3 cấp độ, kèm câu trả lời mẫu có ví dụ code.
          Bấm vào câu hỏi để mở đáp án, đánh dấu “đã xem” để biết mình còn thiếu phần nào.
        </p>
        <div class="stats">
          <div class="stat">
            <span class="stat-num">{{ totalQuestions }}</span>
            <span class="stat-label">câu hỏi</span>
          </div>
          <div class="stat">
            <span class="stat-num">{{ totalTopics }}</span>
            <span class="stat-label">chủ đề</span>
          </div>
          <div class="stat">
            <span class="stat-num">{{ seenCount }}</span>
            <span class="stat-label">đã xem</span>
          </div>
        </div>
        <div class="progress" role="progressbar" :aria-valuenow="seenPercent" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-fill" :style="{ width: seenPercent + '%' }"></div>
        </div>
      </header>

      <section class="controls">
        <div ref="tabs" class="tier-tabs" role="tablist" aria-label="Chọn cấp độ" @keydown="onTabsKeydown">
          <button
            v-for="tier in tiers"
            :key="tier.id"
            type="button"
            class="tier-tab"
            :class="{ active: tier.id === currentTier }"
            :style="{ '--tier': tier.color }"
            role="tab"
            :aria-selected="tier.id === currentTier ? 'true' : 'false'"
            @click="selectTier(tier.id)"
          >
            <span class="tier-emoji" aria-hidden="true">{{ tier.emoji }}</span>
            <span class="tier-main">
              <span class="tier-label">{{ tier.label }}</span>
              <span class="tier-range">{{ tier.range }}</span>
            </span>
            <span class="tier-count">{{ countFor(tier.id) }}</span>
          </button>
        </div>

        <p class="tier-hint">{{ currentTierData.hint }}</p>

        <div class="search">
          <span class="search-icon" aria-hidden="true">🔍</span>
          <input
            v-model="query"
            class="search-input"
            type="search"
            aria-label="Tìm câu hỏi"
            placeholder="Tìm theo câu hỏi, chủ đề hoặc nội dung trả lời…"
          />
          <button v-if="query" type="button" class="search-clear" aria-label="Xoá tìm kiếm" @click="clearQuery">✕</button>
        </div>
      </section>

      <p class="result-line">
        <template v-if="query">
          Tìm thấy <strong>{{ filtered.length }}</strong> câu khớp “{{ query }}” trong cấp {{ currentTierData.label }}
        </template>
        <template v-else>
          <strong>{{ filtered.length }}</strong> câu hỏi — {{ currentTierData.label }}
        </template>
        <span v-if="totalPages > 1"> · trang {{ page }}/{{ totalPages }}</span>
      </p>

      <ul v-if="pageItems.length" class="q-list">
        <li
          v-for="item in pageItems"
          :key="item.id"
          class="q-card"
          :class="{ open: openId === item.id, seen: isSeen(item.id) }"
          :style="{ '--tier': currentTierData.color }"
        >
          <h3 class="q-head-wrap">
            <button
              type="button"
              class="q-head"
              :aria-expanded="openId === item.id ? 'true' : 'false'"
              :aria-controls="answerId(item.id)"
              @click="toggle(item.id)"
            >
              <span class="q-index" aria-hidden="true">{{ item.number }}</span>
              <span class="q-main">
                <span class="q-topic">{{ item.topic }}</span>
                <span class="q-text" v-html="highlight(item.q)"></span>
              </span>
              <span v-if="isSeen(item.id)" class="q-seen" title="Đã xem">✓</span>
              <span class="q-chevron" aria-hidden="true">▾</span>
            </button>
          </h3>

          <div v-show="openId === item.id" :id="answerId(item.id)" class="q-body">
            <div class="q-answer" v-html="answerHtml(item)"></div>
            <div class="q-foot">
              <button type="button" class="seen-btn" :class="{ active: isSeen(item.id) }" @click="toggleSeen(item.id)">
                {{ isSeen(item.id) ? '✓ Đã xem' : 'Đánh dấu đã xem' }}
              </button>
              <span class="q-foot-tip">Tiến độ lưu trên máy này</span>
            </div>
          </div>
        </li>
      </ul>

      <div v-else class="empty">
        <span class="empty-icon" aria-hidden="true">🔍</span>
        <p class="empty-title">Không tìm thấy câu hỏi nào khớp “{{ query }}”</p>
        <p class="empty-text">Thử từ khoá ngắn hơn (ví dụ: <em>flex</em>, <em>promise</em>, <em>xss</em>) hoặc xoá ô tìm kiếm.</p>
        <button type="button" class="empty-btn" @click="clearQuery">Xoá tìm kiếm</button>
      </div>

      <nav v-if="totalPages > 1" class="pager" aria-label="Phân trang">
        <button type="button" class="pager-btn" :disabled="page === 1" @click="goPage(page - 1)">← Trước</button>
        <button
          v-for="(num, i) in numbers"
          :key="i"
          type="button"
          class="pager-btn"
          :class="{ active: num === page, gap: num === '...' }"
          :disabled="num === '...'"
          @click="goPage(num)"
        >{{ num }}</button>
        <button type="button" class="pager-btn" :disabled="page === totalPages" @click="goPage(page + 1)">Sau →</button>
      </nav>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import { navigate } from '../utils/navigate.js';
import { UI_INTERVIEW_QUESTIONS, UI_INTERVIEW_TIERS } from '../data/ui-interview-questions.js';
import {
  filterQuestions,
  formatAnswer,
  highlightText,
  pageCount,
  pageNumbers,
  pageSlice,
  countTopics,
} from '../utils/interview-format.js';

const SEEN_KEY = 'sf_ui_interview_seen';
const PAGE_SIZE = 8;

function readSeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return {};
    return parsed.reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {});
  } catch (err) {
    return {};
  }
}

function writeSeen(map) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(Object.keys(map)));
  } catch (err) {
    // chế độ riêng tư chặn localStorage → tiến độ chỉ giữ trong phiên
  }
}

function buildBank() {
  const bank = {};
  for (const tier of UI_INTERVIEW_TIERS) {
    const list = UI_INTERVIEW_QUESTIONS[tier.id] || [];
    bank[tier.id] = list.map((item, index) => ({
      ...item,
      id: `${tier.id}-${index}`,
      number: index + 1,
    }));
  }
  return bank;
}

export default {
  name: 'FrontendUiInterviewPage',
  components: { CTopbar },
  data() {
    const bank = buildBank();
    return {
      tiers: UI_INTERVIEW_TIERS,
      bank,
      currentTier: UI_INTERVIEW_TIERS[0].id,
      query: '',
      page: 1,
      pageSize: PAGE_SIZE,
      openId: '',
      seen: readSeen(),
    };
  },
  computed: {
    currentTierData() {
      return this.tiers.find((tier) => tier.id === this.currentTier);
    },
    currentList() {
      return this.bank[this.currentTier] || [];
    },
    filtered() {
      return filterQuestions(this.currentList, this.query);
    },
    totalPages() {
      return pageCount(this.filtered.length, this.pageSize);
    },
    pageItems() {
      return pageSlice(this.filtered, this.page, this.pageSize);
    },
    numbers() {
      return pageNumbers(this.page, this.totalPages);
    },
    allQuestions() {
      return this.tiers.flatMap((tier) => this.bank[tier.id] || []);
    },
    totalQuestions() {
      return this.allQuestions.length;
    },
    totalTopics() {
      return countTopics(this.allQuestions);
    },
    seenCount() {
      return this.allQuestions.filter((item) => this.seen[item.id]).length;
    },
    seenPercent() {
      if (!this.totalQuestions) return 0;
      return Math.round((this.seenCount / this.totalQuestions) * 100);
    },
  },
  watch: {
    query() {
      this.page = 1;
    },
    currentTier() {
      this.page = 1;
      this.openId = '';
    },
  },
  methods: {
    go(path) {
      navigate(path);
    },
    answerId(id) {
      return `answer-${id}`;
    },
    countFor(tierId) {
      return (this.bank[tierId] || []).length;
    },
    highlight(text) {
      return highlightText(text, this.query);
    },
    answerHtml(item) {
      return formatAnswer(item.a, this.query);
    },
    isSeen(id) {
      return Boolean(this.seen[id]);
    },
    toggle(id) {
      this.openId = this.openId === id ? '' : id;
    },
    toggleSeen(id) {
      const next = { ...this.seen };
      if (next[id]) delete next[id];
      else next[id] = true;
      this.seen = next;
      writeSeen(next);
    },
    selectTier(id) {
      this.currentTier = id;
    },
    clearQuery() {
      this.query = '';
      this.page = 1;
    },
    goPage(target) {
      if (typeof target !== 'number') return;
      const next = Math.min(Math.max(1, target), this.totalPages);
      if (next === this.page) return;
      this.page = next;
      this.openId = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onTabsKeydown(event) {
      const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const ids = this.tiers.map((tier) => tier.id);
      const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
      const index = ids.indexOf(this.currentTier);
      const nextIndex = (index + step + ids.length) % ids.length;
      this.selectTier(ids[nextIndex]);
      const buttons = this.$refs.tabs ? Array.from(this.$refs.tabs.querySelectorAll('.tier-tab')) : [];
      if (buttons[nextIndex]) buttons[nextIndex].focus();
    },
  },
};
</script>

<style scoped>
.interview-page {
  --page-accent: var(--accent-frontend, #f472b6);
  background: var(--forge-bg, #0c0a1d);
  min-height: 100vh;
  color: var(--forge-text, #f8fafc);
}

.wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.25rem 1.25rem 4rem;
}

.intro {
  margin-bottom: 1.75rem;
}

.intro-title {
  font-size: 1.55rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
}

.intro-text {
  color: var(--forge-text2, #cbd5e1);
  font-size: 0.95rem;
  margin: 0 0 1.25rem;
  max-width: 62ch;
}

.stats {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 0.9rem;
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: var(--forge-glass, rgba(139, 92, 246, 0.1));
  border: 1px solid var(--forge-glass-border, rgba(139, 92, 246, 0.2));
}

.stat-num {
  font-size: 1rem;
  font-weight: 800;
  color: var(--page-accent);
}

.stat-label {
  font-size: 0.78rem;
  color: var(--forge-text3, #94a3b8);
  font-weight: 600;
}

.progress {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  max-width: 420px;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--forge-fire, #8b5cf6), var(--page-accent));
  transition: width var(--transition-base, 0.25s ease);
}

.controls {
  margin-bottom: 1.25rem;
}

.tier-tabs {
  display: flex;
  gap: 0.4rem;
  padding: 0.3rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.tier-tab {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: var(--forge-text2, #cbd5e1);
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast, 0.15s ease), color var(--transition-fast, 0.15s ease), border-color var(--transition-fast, 0.15s ease);
}

.tier-tab:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--forge-text, #f8fafc);
}

.tier-tab.active {
  background: var(--tier);
  border-color: var(--tier);
  color: #10101c;
}

.tier-tab:focus-visible {
  outline: 2px solid var(--page-accent);
  outline-offset: 2px;
}

.tier-emoji {
  font-size: 1.05rem;
}

.tier-main {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  min-width: 0;
}

.tier-label {
  font-size: 0.9rem;
}

.tier-range {
  font-size: 0.72rem;
  font-weight: 600;
  opacity: 0.75;
}

.tier-count {
  margin-left: auto;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.tier-tab.active .tier-count {
  background: rgba(0, 0, 0, 0.18);
}

.tier-hint {
  margin: 0.7rem 0 1rem;
  font-size: 0.85rem;
  color: var(--forge-text3, #94a3b8);
}

.search {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.9rem;
  font-size: 0.9rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.6rem;
  border: 1px solid var(--forge-glass-border, rgba(139, 92, 246, 0.2));
  border-radius: 12px;
  background: var(--forge-surface, rgba(139, 92, 246, 0.08));
  color: var(--forge-text, #f8fafc);
  font-family: inherit;
  font-size: 0.92rem;
}

.search-input::placeholder {
  color: var(--forge-text3, #94a3b8);
}

.search-input:focus {
  outline: none;
  border-color: var(--page-accent);
  box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.18);
}

.search-input::-webkit-search-cancel-button {
  display: none;
}

.search-clear {
  position: absolute;
  right: 0.6rem;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: var(--forge-text2, #cbd5e1);
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1;
}

.search-clear:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--forge-text, #f8fafc);
}

.result-line {
  margin: 0 0 0.9rem;
  font-size: 0.85rem;
  color: var(--forge-text3, #94a3b8);
}

.result-line strong {
  color: var(--forge-text, #f8fafc);
}

.q-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.q-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background: var(--forge-surface, rgba(139, 92, 246, 0.08));
  overflow: hidden;
  transition: border-color var(--transition-fast, 0.15s ease), background var(--transition-fast, 0.15s ease);
}

.q-card:hover {
  border-color: rgba(255, 255, 255, 0.16);
}

.q-card.open {
  border-color: color-mix(in srgb, var(--tier) 55%, transparent);
  background: rgba(255, 255, 255, 0.05);
}

.q-head-wrap {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
}

.q-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border: none;
  background: transparent;
  color: inherit;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.q-index {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 800;
  color: #10101c;
  background: var(--tier);
}

.q-main {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.q-topic {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--tier);
}

.q-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--forge-text, #f8fafc);
  line-height: 1.45;
}

.q-seen {
  margin-left: auto;
  flex-shrink: 0;
  color: var(--forge-success, #22c55e);
  font-weight: 800;
  font-size: 0.9rem;
}

.q-chevron {
  flex-shrink: 0;
  color: var(--forge-text3, #94a3b8);
  font-size: 0.8rem;
  transition: transform var(--transition-base, 0.25s ease);
}

.q-head:hover .q-chevron {
  color: var(--forge-text, #f8fafc);
}

.q-card.open .q-chevron {
  transform: rotate(180deg);
}

.q-body {
  padding: 0 1rem 1rem 3.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 0.9rem;
}

.q-answer {
  color: var(--forge-text2, #cbd5e1);
  font-size: 0.92rem;
  line-height: 1.65;
}

.q-answer :deep(p) {
  margin: 0 0 0.6rem;
}

.q-answer :deep(p:last-child) {
  margin-bottom: 0;
}

.q-answer :deep(ul) {
  margin: 0 0 0.7rem;
  padding-left: 1.15rem;
}

.q-answer :deep(li) {
  margin-bottom: 0.35rem;
}

.q-answer :deep(strong) {
  color: var(--forge-text, #f8fafc);
  font-weight: 700;
}

.q-answer :deep(code) {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.85em;
  padding: 0.12rem 0.38rem;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.09);
  color: #fbcfe8;
}

.q-answer :deep(pre) {
  margin: 0.7rem 0;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow-x: auto;
}

.q-answer :deep(pre code) {
  background: transparent;
  padding: 0;
  color: var(--forge-text2, #cbd5e1);
  font-size: 0.82rem;
  line-height: 1.6;
}

.q-answer :deep(mark) {
  background: rgba(251, 191, 36, 0.35);
  color: #fff7ed;
  border-radius: 4px;
  padding: 0 0.15rem;
}

.q-foot {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.9rem;
  flex-wrap: wrap;
}

.seen-btn {
  padding: 0.42rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--forge-glass-border, rgba(139, 92, 246, 0.2));
  background: transparent;
  color: var(--forge-text2, #cbd5e1);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.seen-btn:hover {
  border-color: var(--page-accent);
  color: var(--forge-text, #f8fafc);
}

.seen-btn.active {
  background: rgba(34, 197, 94, 0.18);
  border-color: rgba(34, 197, 94, 0.5);
  color: #bbf7d0;
}

.q-foot-tip {
  font-size: 0.74rem;
  color: var(--forge-text3, #94a3b8);
}

.empty {
  text-align: center;
  padding: 3rem 1rem;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  border-radius: 14px;
}

.empty-icon {
  font-size: 1.6rem;
}

.empty-title {
  margin: 0.6rem 0 0.3rem;
  font-weight: 700;
}

.empty-text {
  margin: 0 0 1rem;
  color: var(--forge-text3, #94a3b8);
  font-size: 0.88rem;
}

.empty-btn {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, var(--forge-fire, #8b5cf6), var(--page-accent));
  color: #fff;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
}

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.35rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.pager-btn {
  min-width: 36px;
  padding: 0.45rem 0.7rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: var(--forge-text2, #cbd5e1);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.pager-btn:hover:not(:disabled) {
  border-color: var(--page-accent);
  color: var(--forge-text, #f8fafc);
}

.pager-btn.active {
  background: var(--page-accent);
  border-color: var(--page-accent);
  color: #10101c;
}

.pager-btn.gap {
  background: transparent;
  border-color: transparent;
  cursor: default;
}

.pager-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .wrap {
    padding: 1.5rem 0.9rem 3rem;
  }

  .tier-range {
    display: none;
  }

  .tier-tab {
    padding: 0.55rem 0.5rem;
    gap: 0.35rem;
  }

  .q-body {
    padding-left: 1rem;
  }

  .q-index {
    width: 22px;
    height: 22px;
    font-size: 0.72rem;
  }

  .intro-title {
    font-size: 1.3rem;
  }
}
</style>
