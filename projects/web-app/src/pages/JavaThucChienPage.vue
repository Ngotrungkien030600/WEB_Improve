<template>
  <div class="thuc-chien-page" style="--color-accent: #f59e0b">
    <div class="page">
      <div class="topbar">
        <h1>⚔️ Thực chiến — Task thực tế khi đi làm</h1>
        <div class="links">
          <a href="#" @click.prevent="handleNav('/java/hub')">← Java Hub</a>
          <a href="#" @click.prevent="handleNav('/')">Trang chủ</a>
        </div>
      </div>
      <p class="desc">Đây là các <strong>task thực tế</strong> bạn sẽ nhận khi đi làm — từ ticket CRUD, tích hợp thanh toán, fix bug production cho đến microservices. Lọc theo độ khó hoặc lĩnh vực, bấm vào task để xem danh sách việc cần làm (<strong>deliverables</strong>).</p>

      <!-- Stats -->
      <div class="stats">
        <div class="stat">
          <div class="num">{{ totalTasks }}</div>
          <div class="label">Tổng task</div>
        </div>
        <div class="stat">
          <div class="num">{{ countByLevel[1] }}</div>
          <div class="label">Junior</div>
        </div>
        <div class="stat">
          <div class="num">{{ countByLevel[2] }}</div>
          <div class="label">Middle</div>
        </div>
        <div class="stat">
          <div class="num">{{ countByLevel[3] }}</div>
          <div class="label">Senior</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="🔍 Tìm task... (ví dụ: payment, jwt, cache, N+1)"
        />
        <div class="chip-group">
          <button
            v-for="level in levelFilters"
            :key="level.id"
            class="chip"
            :class="{ active: selectedLevel === level.id }"
            @click="selectLevel(level.id)"
          >
            {{ level.label }}
          </button>
        </div>
        <div class="chip-group">
          <button
            v-for="cat in categoryFilters"
            :key="cat.id"
            class="chip"
            :class="{ active: selectedCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Task Grid -->
      <div class="task-grid" ref="gridRef">
        <div class="task-grid-spacer" :style="{ height: totalHeight + 'px' }">
          <div
            class="task-grid-inner"
            :style="{ transform: `translateY(${offsetY}px)` }"
          >
            <div
              v-for="task in visibleTasks"
              :key="task.id"
              class="task-card"
              @click="openModal(task)"
            >
              <div class="top">
                <h3>{{ task.title }}</h3>
                <span class="badge" :class="'badge-lv' + task.level">{{ levelLabel(task.level) }}</span>
                <span class="badge badge-cat">{{ categoryLabel(task.category) }}</span>
              </div>
              <p class="summary">{{ task.summary }}</p>
              <div class="stack">
                <span v-for="s in task.stack" :key="s">{{ s }}</span>
              </div>
              <div class="foot">
                <span class="detail-link">Xem chi tiết →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTasks.length === 0" class="empty-state">
        <div class="icon">🔍</div>
        Không tìm thấy task phù hợp. Thử từ khóa khác hoặc xóa filter.
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" :class="{ open: showModal }" @click.self="closeModal">
      <div class="modal">
        <button class="close-btn" @click="closeModal" aria-label="Đóng">✕</button>
        <template v-if="selectedTask">
          <h2>{{ selectedTask.title }}</h2>
          <div class="meta">
            <span class="badge" :class="'badge-lv' + selectedTask.level">{{ levelLabel(selectedTask.level) }}</span>
            <span class="badge badge-cat">{{ categoryLabel(selectedTask.category) }}</span>
          </div>
          <p class="summary">{{ selectedTask.summary }}</p>
          <h4>🛠️ Tech Stack</h4>
          <div class="stack">
            <span v-for="s in selectedTask.stack" :key="s">{{ s }}</span>
          </div>
          <h4>📋 Deliverables — việc cần hoàn thành</h4>
          <ul>
            <li v-for="(d, i) in selectedTask.deliverables" :key="i">{{ d }}</li>
          </ul>
          <div class="keywords">
            <span v-for="k in selectedTask.keywords" :key="k">#{{ k }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import { thucChienTasks } from '@legacy/js/data/thuc-chien-data.js';

const CATEGORIES = [
  { id: 'crud', label: '🗄️ CRUD & Data' },
  { id: 'auth', label: '🔐 Auth' },
  { id: 'api', label: '🔌 API & Tích hợp' },
  { id: 'feature', label: '✨ Business Feature' },
  { id: 'bugfix', label: '🐛 Bugfix & Refactor' },
  { id: 'performance', label: '⚡ Performance' },
  { id: 'devops', label: '🚀 DevOps & Deploy' },
  { id: 'microservice', label: '🏗️ Microservices' },
];

const LEVELS = [
  { id: 1, label: '🌱 Junior' },
  { id: 2, label: '📗 Middle' },
  { id: 3, label: '🔥 Senior' },
];

export default {
  name: 'JavaThucChienPage',
  data() {
    return {
      tasks: thucChienTasks,
      searchKeyword: '',
      selectedLevel: 'all',
      selectedCategory: 'all',
      showModal: false,
      selectedTask: null,
      levelFilters: [{ id: 'all', label: '📊 Tất cả' }, ...LEVELS],
      categoryFilters: [{ id: 'all', label: '🗂️ Mọi lĩnh vực' }, ...CATEGORIES],
      scrollTop: 0,
      rowHeight: 180,
    };
  },
  computed: {
    totalTasks() {
      return this.tasks.length;
    },
    countByLevel() {
      const counts = { 1: 0, 2: 0, 3: 0 };
      this.tasks.forEach(t => {
        counts[t.level] = (counts[t.level] || 0) + 1;
      });
      return counts;
    },
    filteredTasks() {
      const kw = this.searchKeyword.trim().toLowerCase();
      return this.tasks.filter(t => {
        if (this.selectedLevel !== 'all' && t.level !== parseInt(this.selectedLevel, 10)) return false;
        if (this.selectedCategory !== 'all' && t.category !== this.selectedCategory) return false;
        if (kw) {
          const haystack = [t.title, t.summary, t.stack.join(' '), t.keywords.join(' ')].join(' ').toLowerCase();
          if (!haystack.includes(kw)) return false;
        }
        return true;
      });
    },
    colsCount() {
      if (typeof document === 'undefined') return 2;
      const el = this.$refs.gridRef;
      const gridWidth = el?.clientWidth || 1000;
      return Math.floor((gridWidth + 16) / 336);
    },
    rowsCount() {
      return Math.ceil(this.filteredTasks.length / this.colsCount);
    },
    totalHeight() {
      return this.rowsCount * this.rowHeight;
    },
    visibleStartRow() {
      return Math.max(0, Math.floor(this.scrollTop / this.rowHeight) - 2);
    },
    visibleEndRow() {
      const gridHeight = this.$refs.gridRef?.clientHeight || 600;
      return Math.min(this.rowsCount, Math.ceil((this.scrollTop + gridHeight) / this.rowHeight) + 2);
    },
    visibleTasks() {
      const start = this.visibleStartRow * this.colsCount;
      const end = this.visibleEndRow * this.colsCount;
      return this.filteredTasks.slice(start, end);
    },
    offsetY() {
      return this.visibleStartRow * this.rowHeight;
    },
  },
  updated() {
    this.$nextTick(() => {
      this.bindScroll();
    });
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
    this.bindScroll();
    window.addEventListener('resize', this.onResize);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    const el = this.$refs.gridRef;
    if (el) el.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    handleNav(path) {
      navigate(path);
    },
    bindScroll() {
      const el = this.$refs.gridRef;
      if (el && !el._scrollBound) {
        el.addEventListener('scroll', this.onScroll);
        el._scrollBound = true;
      }
    },
    onScroll() {
      const el = this.$refs.gridRef;
      if (el) this.scrollTop = el.scrollTop;
    },
    onResize() {
      this.scrollTop = 0;
    },
    selectLevel(id) {
      this.selectedLevel = id;
    },
    selectCategory(id) {
      this.selectedCategory = id;
    },
    levelLabel(lv) {
      const l = LEVELS.find(x => x.id === lv);
      return l ? l.label.split(' ')[1] : 'lv' + lv;
    },
    categoryLabel(id) {
      const c = CATEGORIES.find(x => x.id === id);
      return c ? c.label : id;
    },
    openModal(task) {
      this.selectedTask = task;
      this.showModal = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.showModal = false;
      this.selectedTask = null;
      document.body.style.overflow = '';
    },
    handleKeydown(e) {
      if (e.key === 'Escape') this.closeModal();
    },
  },
};
</script>

<style scoped>
/* CSS variables inherited from main.css */

.thuc-chien-page {
  background: var(--color-bg);
  min-height: 100vh;
  color: var(--color-text);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.7;
}

.page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.topbar h1 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-text), #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.links a {
  color: #fbbf24;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
}

.links a:hover {
  text-decoration: underline;
}

.desc {
  color: var(--color-text2);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.stat {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 0.85rem 1rem;
  text-align: center;
}

.stat .num {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fbbf24;
}

.stat .label {
  font-size: 0.75rem;
  color: var(--color-text2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Filters */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters input[type="text"] {
  flex: 1;
  min-width: 200px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.55rem 0.9rem;
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: 'Inter', system-ui, sans-serif;
  outline: none;
}

.filters input[type="text"]:focus {
  border-color: var(--color-accent);
}

.filters input[type="text"]::placeholder {
  color: var(--color-text2);
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  color: var(--color-text2);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: 'Inter', system-ui, sans-serif;
  user-select: none;
}

.chip:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.chip.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}

/* Task Grid — virtualized */
.task-grid {
  height: calc(100vh - 340px);
  min-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}

.task-grid-spacer {
  position: relative;
}

.task-grid-inner {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.task-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.task-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.task-card .top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.task-card h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.4;
  flex: 1;
  min-width: 150px;
}

.badge {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.badge-lv1 {
  background: rgba(52, 211, 153, 0.12);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.15);
}

.badge-lv2 {
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.15);
}

.badge-lv3 {
  background: rgba(248, 113, 113, 0.12);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.15);
}

.badge-cat {
  background: rgba(249, 115, 22, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(249, 115, 22, 0.15);
}

.task-card .summary {
  color: var(--color-text2);
  font-size: 0.83rem;
  line-height: 1.55;
}

.task-card .stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.task-card .stack span {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.7rem;
  color: var(--color-text2);
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.15rem 0.45rem;
}

.task-card .foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.task-card .foot .detail-link {
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  color: var(--color-text2);
  padding: 3rem 1rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--color-radius);
}

.empty-state .icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  align-items: flex-start;
  justify-content: center;
  z-index: 100;
  padding: 2rem 1rem;
  overflow-y: auto;
}

.modal-overlay.open {
  display: flex;
}

.modal {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  max-width: 720px;
  width: 100%;
  padding: 1.75rem;
  position: relative;
  margin-top: 3rem;
  animation: modalIn 0.2s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.modal .close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  color: var(--color-text2);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.modal .close-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.modal h2 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #fbbf24;
  margin-bottom: 0.75rem;
  padding-right: 2.5rem;
  line-height: 1.4;
}

.modal .meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.modal .summary {
  color: var(--color-text2);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.modal h4 {
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.modal .stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
}

.modal .stack span {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.75rem;
  color: var(--color-text2);
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
}

.modal ul {
  list-style: none;
}

.modal ul li {
  color: var(--color-text2);
  font-size: 0.87rem;
  padding: 0.5rem 0 0.5rem 1.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
}

.modal ul li:last-child {
  border-bottom: none;
}

.modal ul li::before {
  content: '✅';
  position: absolute;
  left: 0;
  top: 0.5rem;
  font-size: 0.8rem;
}

.modal .keywords {
  margin-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.modal .keywords span {
  font-size: 0.7rem;
  color: var(--color-text2);
  background: rgba(249, 115, 22, 0.08);
  border-radius: 4px;
  padding: 0.15rem 0.5rem;
}

@media (max-width: 600px) {
  .task-grid {
    grid-template-columns: 1fr;
  }
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  .filters input[type="text"] {
    width: 100%;
  }
}
</style>
