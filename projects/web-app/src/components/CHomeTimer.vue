<template>
  <div class="forge-timer-wrap">
    <div class="forge-timer-ring">
      <svg viewBox="0 0 68 68">
        <circle class="forge-ring-bg" cx="34" cy="34" r="30" />
        <circle
          class="forge-ring-progress"
          :class="ringClass"
          cx="34" cy="34" r="30"
          :style="{ strokeDashoffset: ringOffset }"
        />
      </svg>
      <div class="forge-time" :class="timeClass">{{ displayTime }}</div>
    </div>

    <div class="forge-controls">
      <select v-model="selectedDuration" @change="onDurationChange">
        <option value="30">30p</option>
        <option value="60">1h</option>
      </select>
      <div class="forge-btn-row">
        <button class="forge-btn forge-btn-primary" @click="onToggle">
          {{ isRunning ? '⏸' : '⚒️' }}
        </button>
        <button class="forge-btn forge-btn-secondary" @click="onReset">↻</button>
      </div>
    </div>

    <div class="forge-stats">
      <div class="forge-stat-row">📋 Hôm nay <span class="val fire">{{ todayMinutes }}m</span></div>
      <div class="forge-stat-row">🔥 Streak <span class="val">{{ history.streak }}🔥</span></div>
      <div class="forge-stat-row">📦 Đã rèn <span class="val">{{ history.sessions }}</span></div>
    </div>
  </div>
</template>

<script>
import {
  getState, setState,
  getHistory,
  formatTime, calcRatio,
  buildInitialState, tickState, finishState,
  startState, pauseState, resetState
} from '../logic/forge-timer-logic.js';

const CIRCUMFERENCE = 188.5;

export default {
  name: 'CHomeTimer',
  data() {
    return {
      duration: 30,
      remaining: 0,
      isRunning: false,
      history: { todayMinutes: 0, streak: 0, sessions: 0 },
      intervalId: null,
    };
  },
  computed: {
    total() { return this.duration * 60; },
    displayTime() { return formatTime(this.remaining); },
    ratio() { return calcRatio(this.remaining, this.total); },
    ringOffset() { return CIRCUMFERENCE * (1 - this.ratio); },
    timeClass() {
      if (this.remaining <= 60 && this.remaining > 0) return 'danger';
      if (this.remaining <= 300 && this.remaining > 0) return 'warning';
      return '';
    },
    ringClass() {
      if (this.remaining <= 60 && this.remaining > 0) return 'danger';
      if (this.remaining <= 300 && this.remaining > 0) return 'warning';
      return '';
    },
    todayMinutes() { return this.history.dates?.[this.todayKey] || 0; },
    todayKey() { return new Date().toISOString().slice(0, 10); },
    selectedDuration: {
      get() { return String(this.duration); },
      set(val) { this.duration = parseInt(val, 10); }
    },
  },
  created() { this.restore(); },
  beforeUnmount() { this.clearInterval(); },
  methods: {
    restore() {
      const s = getState();
      if (!s) {
        const init = buildInitialState(this.duration);
        this.remaining = init.remaining;
        setState(init);
      } else {
        this.duration = Math.round(s.total / 60);
        if (s.running) {
          const now = Date.now();
          const elapsed = Math.floor((now - s.lastUpdated) / 1000);
          this.remaining = Math.max(0, s.remaining - elapsed);
          this.isRunning = true;
          if (this.remaining > 0) this.startInterval();
        } else {
          this.remaining = s.remaining;
          this.isRunning = false;
        }
      }
      this.refreshHistory();
    },
    refreshHistory() {
      const h = getHistory();
      const today = this.todayKey;
      this.history = { ...h, todayMinutes: h.dates?.[today] || 0 };
    },
    startInterval() {
      this.clearInterval();
      this.intervalId = setInterval(() => this.tick(), 1000);
    },
    clearInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    tick() {
      const s = tickState(getState());
      setState(s);
      this.remaining = s.remaining;
      if (s.remaining === 0) {
        this.clearInterval();
        this.onFinish();
      }
    },
    onFinish() {
      this.isRunning = false;
      const { history } = finishState(getState());
      this.history = { ...history, todayMinutes: history.dates?.[this.todayKey] || 0 };
    },
    onToggle() {
      if (this.isRunning) {
        const s = pauseState(getState());
        setState(s);
        this.remaining = s.remaining;
        this.isRunning = false;
        this.clearInterval();
      } else {
        const s = startState(getState(), this.duration);
        setState(s);
        this.remaining = s.remaining;
        this.isRunning = true;
        this.startInterval();
      }
    },
    onReset() {
      this.clearInterval();
      const s = resetState(this.duration);
      setState(s);
      this.remaining = s.remaining;
      this.isRunning = false;
    },
    onDurationChange() {
      const s = getState();
      if (!s || !s.running) {
        this.onReset();
      }
    },
  },
};
</script>

<style scoped>
.forge-timer-wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.forge-timer-ring {
  position: relative;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
}

.forge-timer-ring svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.forge-ring-bg {
  fill: none;
  stroke: var(--forge-ring-bg);
  stroke-width: 4;
}

.forge-ring-progress {
  fill: none;
  stroke: var(--forge-ring-progress);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 188.5;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.5s ease, stroke 0.5s ease;
  filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.4));
}

.forge-ring-progress.warning {
  stroke: var(--forge-ring-warning);
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.4));
}

.forge-ring-progress.danger {
  stroke: var(--forge-ring-danger);
  filter: drop-shadow(0 0 12px rgba(220, 38, 38, 0.5));
  animation: ringPulse 1s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.4)); }
  50% { filter: drop-shadow(0 0 18px rgba(220, 38, 38, 0.7)); }
}

.forge-time {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--forge-time-color, #ffffff);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
  transition: color 0.4s ease;
}

.forge-time.warning { color: var(--forge-time-warning, #fca5a5); }
.forge-time.danger { color: var(--forge-time-danger, #f87171); }

.forge-controls {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.forge-controls select {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0.15rem 0.4rem;
  font-size: 0.7rem;
  cursor: pointer;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  width: 42px;
  text-align: center;
  transition: background 0.2s;
  appearance: none;
  -webkit-appearance: none;
}

.forge-controls select:hover {
  background: rgba(255, 255, 255, 0.15);
}

.forge-controls select option {
  color: var(--text-primary, #1e293b);
  background: var(--text-white, #fff);
}

.forge-btn-row {
  display: flex;
  gap: 0.2rem;
}

.forge-btn {
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.forge-btn-primary {
  background: linear-gradient(135deg, var(--forge-btn-primary-start, #8b5cf6), var(--forge-btn-primary-end, #7c3aed));
  color: var(--forge-btn-primary-color, white);
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.4);
}

.forge-btn-primary:hover {
  transform: scale(1.12);
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
}

.forge-btn-primary:active {
  transform: scale(0.92);
}

.forge-btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.forge-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.18);
  color: white;
  transform: scale(1.08);
}

.forge-btn-secondary:active {
  transform: scale(0.92);
}

.forge-stats {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-left: 0.75rem;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.forge-stat-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
}

.forge-stat-row .val {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  min-width: 2.2rem;
}

.forge-stat-row .val.fire {
  color: var(--forge-ember);
}

@media (max-width: 768px) {
  .forge-timer-ring { width: 60px; height: 60px; }
  .forge-time { font-size: 0.95rem; }
  .forge-btn { width: 26px; height: 26px; font-size: 0.65rem; }
  .forge-controls select { width: 36px; font-size: 0.65rem; }
  .forge-stats { display: none; }
}
</style>
