<template>
  <div class="forge-timer-wrap">
    <div class="forge-timer-ring">
      <svg viewBox="0 0 68 68">
        <circle class="forge-ring-bg" cx="34" cy="34" r="30" />
        <circle
          class="forge-ring-progress"
          :style="{ strokeDashoffset: dashOffset }"
          cx="34"
          cy="34"
          r="30"
        />
      </svg>
      <div class="forge-time">{{ formattedTime }}</div>
    </div>
    <div class="forge-controls">
      <select v-model="selectedDuration" @change="reset">
        <option value="30">30p</option>
        <option value="60">1h</option>
      </select>
      <div class="forge-btn-row">
        <button class="forge-btn forge-btn-primary" @click="toggle">
          {{ isRunning ? '⏸' : '⚒️' }}
        </button>
        <button class="forge-btn forge-btn-secondary" @click="reset">↻</button>
      </div>
    </div>
    <div class="forge-stats">
      <div class="forge-stat-row">📋 Hôm nay <span class="val fire">{{ todayMinutes }}m</span></div>
      <div class="forge-stat-row">🔥 Streak <span class="val">{{ streak }}🔥</span></div>
      <div class="forge-stat-row">📦 Đã rèn <span class="val">{{ total }}</span></div>
    </div>
  </div>
</template>

<script>
const STORAGE_KEY = 'sf_forge_stats';

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { todayMinutes: 0, todayDate: null, streak: 0, total: 0 };
}

function saveStats(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {}
}

export default {
  name: 'ForgeTimer',
  data() {
    const stats = loadStats();
    const today = new Date().toDateString();
    if (stats.todayDate !== today) {
      stats.todayMinutes = 0;
      stats.todayDate = today;
      saveStats(stats);
    }
    return {
      totalSeconds: 30 * 60,
      remaining: 30 * 60,
      isRunning: false,
      interval: null,
      selectedDuration: '30',
      streak: 0,
      total: 0,
    };
  },
  computed: {
    minutes() {
      return Math.floor(this.remaining / 60);
    },
    seconds() {
      return this.remaining % 60;
    },
    formattedTime() {
      return `${String(this.minutes).padStart(2, '0')}:${String(this.seconds).padStart(2, '0')}`;
    },
    progress() {
      return 1 - this.remaining / this.totalSeconds;
    },
    dashOffset() {
      return 2 * Math.PI * 30 * (1 - this.progress);
    },
    todayMinutes() {
      const stats = loadStats();
      const today = new Date().toDateString();
      if (stats.todayDate !== today) return 0;
      return stats.todayMinutes;
    },
  },
  methods: {
    toggle() {
      if (this.isRunning) {
        this.pause();
      } else {
        this.start();
      }
    },
    start() {
      if (this.isRunning || this.remaining <= 0) return;
      this.isRunning = true;
      this.interval = setInterval(() => {
        this.remaining--;
        if (this.remaining <= 0) {
          this.pause();
          this.remaining = 0;
          this.complete();
        }
      }, 1000);
    },
    pause() {
      this.isRunning = false;
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    reset() {
      this.pause();
      const mins = parseInt(this.selectedDuration) || 30;
      this.totalSeconds = mins * 60;
      this.remaining = this.totalSeconds;
    },
    complete() {
      const stats = loadStats();
      const today = new Date().toDateString();
      const mins = parseInt(this.selectedDuration) || 30;
      stats.todayMinutes = (stats.todayDate === today ? stats.todayMinutes : 0) + mins;
      stats.todayDate = today;
      stats.total = (stats.total || 0) + 1;
      if (stats.todayMinutes > mins && stats.todayMinutes < mins * 2) {
        stats.streak = (stats.streak || 0) + 1;
      }
      saveStats(stats);
      this.todayMinutes = stats.todayMinutes;
      this.streak = stats.streak;
      this.total = stats.total;
    },
  },
  beforeUnmount() {
    this.pause();
  },
};
</script>

<style scoped>
.forge-timer-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 16px;
  min-width: 180px;
}

.forge-timer-ring {
  position: relative;
  width: 68px;
  height: 68px;
}

.forge-timer-ring svg {
  transform: rotate(-90deg);
}

.forge-ring-bg {
  fill: none;
  stroke: var(--color-border, #2d2b44);
  stroke-width: 4;
}

.forge-ring-progress {
  fill: none;
  stroke: var(--color-accent, #f472b6);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 188.5;
  transition: stroke-dashoffset 1s linear;
}

.forge-time {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text);
  font-family: 'JetBrains Mono', monospace;
}

.forge-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.forge-controls select {
  padding: 0.2rem 0.5rem;
  background: var(--color-surface2, #22213a);
  color: var(--color-text);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

.forge-btn-row {
  display: flex;
  gap: 0.25rem;
}

.forge-btn {
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}

.forge-btn-primary {
  background: var(--color-accent, #f472b6);
  color: white;
}

.forge-btn-primary:hover {
  filter: brightness(1.1);
}

.forge-btn-secondary {
  background: var(--color-surface2, #22213a);
  color: var(--color-text);
}

.forge-btn-secondary:hover {
  background: var(--color-border);
}

.forge-stats {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
}

.forge-stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--color-text2, #9d9bb5);
}

.forge-stat-row .val {
  font-weight: 700;
  color: var(--color-text);
}

.forge-stat-row .fire {
  color: var(--color-fire, #f97316);
}
</style>
