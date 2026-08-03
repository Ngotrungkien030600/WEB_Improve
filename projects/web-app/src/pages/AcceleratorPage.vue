<template>
  <div class="page-root">
    <div class="acc-layout">
      <!-- Sidebar -->
      <aside class="acc-sidebar">
        <button class="sidebar-header" @click="handleNavigate('/')">
          <span class="icon">⚒️</span>
          <div>
            <h2>SkillForge</h2>
            <small>Accelerator</small>
          </div>
        </button>

        <div class="acc-progress-summary">
          <div class="acc-progress-row">
            <span>Tiến độ</span>
            <span class="val">{{ progress.completed }}/30 ({{ progress.percent }}%)</span>
          </div>
          <div class="acc-progress-bar-wrap">
            <div class="acc-progress-bar-fill" :style="{ width: progress.percent + '%' }"></div>
          </div>
          <div class="acc-progress-row">
            <span>⚡ XP</span>
            <span class="val">{{ progress.xp }} XP</span>
          </div>
          <div class="acc-progress-row">
            <span>🔥 Streak</span>
            <span class="val">{{ progress.streak }} ngày</span>
          </div>
        </div>

        <div class="acc-session-box">
          <div class="acc-session-ring-wrap">
            <svg viewBox="0 0 68 68" width="100" height="100">
              <circle class="acc-session-ring-bg" cx="34" cy="34" r="30" />
              <circle
                class="acc-session-ring-progress"
                :style="{ strokeDashoffset: sessionOffset }"
                cx="34"
                cy="34"
                r="30"
              />
            </svg>
            <div class="acc-session-time">{{ formattedSession }}</div>
          </div>
          <button class="acc-start-btn" @click="toggleSession">
            {{ sessionRunning ? '⏸ Dừng' : '⚒️ Bắt đầu 1h' }}
          </button>
        </div>

        <div class="acc-day-grid">
          <button
            v-for="day in days"
            :key="day.day"
            class="acc-day-btn"
            :class="{ active: day.day === currentDay, completed: isCompleted(day.day) }"
            @click="goToDay(day.day)"
          >
            {{ String(day.day).padStart(2, '0') }}
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="acc-main">
        <div class="acc-day-header">
          <div class="acc-day-title-row">
            <span class="acc-day-badge">Day {{ String(currentDay).padStart(2, '0') }}</span>
            <h1 class="acc-title">{{ currentDayData?.title }}</h1>
          </div>
          <div class="acc-nav-row">
            <button class="acc-nav-btn" @click="prevDay">◀ Trước</button>
            <button class="acc-nav-btn" @click="nextDay">Sau ▶</button>
          </div>
        </div>

        <div v-if="currentDayData" class="acc-cards">
          <div class="acc-card">
            <h3>💡 Technical Concept</h3>
            <p>{{ currentDayData.techConcept }}</p>
          </div>

          <div class="acc-card">
            <h3>🛠️ Practice</h3>
            <p>{{ currentDayData.techPractice }}</p>
          </div>

          <div class="acc-card">
            <h3>📝 English Vocabulary</h3>
            <div class="acc-vocab-chips">
              <span v-for="vocab in currentDayData.englishVocab" :key="vocab" class="vocab-chip">
                {{ vocab }}
              </span>
            </div>
          </div>

          <div class="acc-card">
            <h3>🎧 English Listening</h3>
            <p>{{ currentDayData.englishListening }}</p>
          </div>

          <div class="acc-card">
            <h3>🗣️ Speaking Practice</h3>
            <p>{{ currentDayData.englishPractice }}</p>
          </div>

          <div class="acc-card">
            <h3>🏛️ System Design</h3>
            <p>{{ currentDayData.systemDesignCase }}</p>
          </div>

          <div class="acc-card placeholder-card">
            <h3>✍️ Practice Your Answer</h3>
            <p class="placeholder-note">
              Tính năng typing AI real-time đang phát triển. Hiện tại bạn có thể học content bên trên.
            </p>
          </div>

          <div class="acc-card">
            <p class="key-takeaway">{{ currentDayData.keyTakeaway }}</p>
            <div class="acc-complete-row">
              <button
                class="acc-complete-btn"
                :class="{ completed: isCompleted(currentDay) }"
                @click="completeCurrentDay"
              >
                {{ isCompleted(currentDay) ? '✅ Đã hoàn thành' : '🎯 Hoàn thành ngày này' }}
              </button>
              <span v-if="completionMsg" class="acc-completion-msg">{{ completionMsg }}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import { ACCELERATOR_DAYS } from '@legacy/js/data/accelerator-data.js';
import {
  loadState,
  getCurrentDay,
  setCurrentDay,
  completeDay,
  startSession,
  endSession,
  getSessionElapsed,
  isDayCompleted,
  getProgress,
} from '@legacy/js/features/accelerator/accelerator-logic.js';

export default {
  name: 'AcceleratorPage',
  data() {
    return {
      days: ACCELERATOR_DAYS,
      currentDay: 1,
      progress: { completed: 0, total: 30, percent: 0, xp: 0, streak: 0, currentDay: 1 },
      sessionRunning: false,
      sessionElapsed: 0,
      sessionInterval: null,
      completionMsg: '',
    };
  },
  computed: {
    currentDayData() {
      return this.days.find(d => d.day === this.currentDay) || null;
    },
    formattedSession() {
      const s = this.sessionElapsed;
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    },
    sessionOffset() {
      const total = 60 * 60;
      const progress = Math.min(this.sessionElapsed / total, 1);
      return 2 * Math.PI * 30 * (1 - progress);
    },
  },
  methods: {
    handleNavigate(path) {
      navigate(path);
    },
    load() {
      loadState();
      this.currentDay = getCurrentDay();
      this.progress = getProgress();
    },
    goToDay(day) {
      this.currentDay = day;
      setCurrentDay(day);
      this.completionMsg = '';
    },
    prevDay() {
      if (this.currentDay > 1) this.goToDay(this.currentDay - 1);
    },
    nextDay() {
      if (this.currentDay < 30) this.goToDay(this.currentDay + 1);
    },
    isCompleted(day) {
      return isDayCompleted(day);
    },
    completeCurrentDay() {
      if (this.isCompleted(this.currentDay)) return;
      const result = completeDay(this.currentDay, 60, 0);
      this.progress = getProgress();
      this.completionMsg = this.currentDayData?.completionMessage || '✅ Hoàn thành!';
      if (result.newDay && result.newDay !== this.currentDay) {
        setTimeout(() => this.goToDay(result.newDay), 1500);
      }
    },
    toggleSession() {
      if (this.sessionRunning) {
        this.sessionRunning = false;
        if (this.sessionInterval) {
          clearInterval(this.sessionInterval);
          this.sessionInterval = null;
        }
        endSession();
      } else {
        this.sessionRunning = true;
        startSession();
        this.sessionElapsed = getSessionElapsed();
        this.sessionInterval = setInterval(() => {
          this.sessionElapsed = getSessionElapsed();
        }, 1000);
      }
    },
  },
  mounted() {
    this.load();
  },
  beforeUnmount() {
    if (this.sessionInterval) clearInterval(this.sessionInterval);
    if (this.sessionRunning) endSession();
  },
};
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  background: var(--color-bg, #0f0e17);
  color: var(--color-text, #e4e2f0);
}

.acc-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

@media (max-width: 800px) {
  .acc-layout {
    grid-template-columns: 1fr;
  }
}

.acc-sidebar {
  background: var(--color-surface, #1a1928);
  border-right: 1px solid var(--color-border, #2d2b44);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  text-align: left;
  padding: 0.5rem;
  border-radius: 8px;
  width: 100%;
}

.sidebar-header:hover {
  background: var(--color-surface2, #22213a);
}

.sidebar-header .icon {
  font-size: 1.5rem;
}

.sidebar-header h2 {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0;
}

.sidebar-header small {
  font-size: 0.7rem;
  color: var(--color-text2, #9d9bb5);
}

.acc-progress-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.acc-progress-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: var(--color-text2, #9d9bb5);
}

.acc-progress-row .val {
  font-weight: 700;
  color: var(--color-text);
}

.acc-progress-bar-wrap {
  height: 6px;
  background: var(--color-border, #2d2b44);
  border-radius: 3px;
  overflow: hidden;
}

.acc-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent, #f472b6), var(--forge-purple, #7c3aed));
  border-radius: 3px;
  transition: width 0.3s;
}

.acc-session-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.acc-session-ring-wrap {
  position: relative;
  width: 68px;
  height: 68px;
}

.acc-session-ring-wrap svg {
  transform: rotate(-90deg);
}

.acc-session-ring-bg {
  fill: none;
  stroke: var(--color-border, #2d2b44);
  stroke-width: 4;
}

.acc-session-ring-progress {
  fill: none;
  stroke: var(--color-accent, #f472b6);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 188.5;
  transition: stroke-dashoffset 1s linear;
}

.acc-session-time {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-text);
}

.acc-start-btn {
  background: var(--color-surface2, #22213a);
  border: 1px solid var(--color-border, #2d2b44);
  color: var(--color-text);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.acc-start-btn:hover {
  border-color: var(--color-accent, #f472b6);
  color: var(--color-accent, #f472b6);
}

.acc-day-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.35rem;
}

.acc-day-btn {
  background: var(--color-surface2, #22213a);
  border: 1px solid var(--color-border, #2d2b44);
  color: var(--color-text2, #9d9bb5);
  padding: 0.4rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.acc-day-btn:hover {
  border-color: var(--color-accent, #f472b6);
  color: var(--color-text);
}

.acc-day-btn.active {
  background: rgba(244, 114, 182, 0.15);
  border-color: var(--color-accent, #f472b6);
  color: var(--color-accent, #f472b6);
}

.acc-day-btn.completed {
  background: rgba(34, 197, 94, 0.1);
  border-color: var(--color-success, #22c55e);
  color: var(--color-success, #22c55e);
}

.acc-main {
  padding: 2rem;
  overflow-y: auto;
}

.acc-day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.acc-day-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.acc-day-badge {
  background: linear-gradient(135deg, var(--color-accent, #f472b6), var(--forge-purple, #7c3aed));
  color: white;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.acc-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}

.acc-nav-row {
  display: flex;
  gap: 0.5rem;
}

.acc-nav-btn {
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  color: var(--color-text2, #9d9bb5);
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}

.acc-nav-btn:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.acc-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.acc-card {
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 12px;
  padding: 1.25rem;
}

.acc-card h3 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.acc-card p {
  font-size: 0.85rem;
  color: var(--color-text2, #9d9bb5);
  line-height: 1.6;
  margin: 0;
}

.acc-vocab-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.vocab-chip {
  background: var(--color-surface2, #22213a);
  border: 1px solid var(--color-border, #2d2b44);
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: var(--color-text2, #9d9bb5);
}

.placeholder-card {
  opacity: 0.6;
}

.placeholder-note {
  font-size: 0.82rem;
  color: var(--color-text2, #9d9bb5);
}

.key-takeaway {
  font-style: italic;
  color: var(--color-accent, #7c5cfc) !important;
  margin-bottom: 1rem;
}

.acc-complete-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.acc-complete-btn {
  background: linear-gradient(135deg, var(--color-accent, #f472b6), var(--forge-purple, #7c3aed));
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.acc-complete-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.acc-complete-btn.completed {
  background: var(--color-success, #22c55e);
  cursor: default;
}

.acc-complete-btn.completed:hover {
  filter: none;
  transform: none;
}

.acc-completion-msg {
  font-size: 0.82rem;
  color: var(--color-success, #22c55e);
}
</style>
