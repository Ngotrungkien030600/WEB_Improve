<template>
  <div ref="root" class="forge-timer-wrap" :style="{ '--timer-color': mode.color }">
    <div class="timer-pill" :class="{ running: isRunning, done: isDone }">
      <button
        type="button"
        class="pill-main"
        :aria-expanded="open ? 'true' : 'false'"
        aria-haspopup="dialog"
        :aria-label="`Đồng hồ ${mode.label} ${displayTime} — mở bảng điều khiển`"
        @click="togglePanel"
      >
        <span class="pill-ring" aria-hidden="true">
          <svg viewBox="0 0 44 44">
            <circle class="ring-bg" cx="22" cy="22" r="19" />
            <circle
              class="ring-progress"
              :class="toneClass"
              cx="22" cy="22" r="19"
              :style="{ strokeDashoffset: ringOffset(19) }"
            />
          </svg>
          <span class="pill-clock">{{ displayTime }}</span>
        </span>
        <span class="pill-text">
          <span class="pill-mode">{{ mode.emoji }} {{ mode.label }}</span>
          <span class="pill-sub">{{ statusText }}</span>
        </span>
        <span class="pill-chevron" aria-hidden="true">▾</span>
      </button>

      <button
        type="button"
        class="pill-action"
        :aria-label="isRunning ? 'Tạm dừng đồng hồ' : 'Bắt đầu đồng hồ'"
        @click="onToggle"
      >{{ isRunning ? '⏸' : '▶' }}</button>
    </div>

    <transition name="panel-fade">
      <div v-if="open" class="timer-panel" role="dialog" aria-label="Đồng hồ tập trung">
        <div class="panel-head">
          <span class="panel-mode">{{ mode.emoji }} {{ mode.label }}</span>
          <button type="button" class="panel-close" aria-label="Đóng bảng điều khiển" @click="closePanel">✕</button>
        </div>

        <div class="panel-ring" :class="toneClass">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle class="ring-bg" cx="60" cy="60" r="52" />
            <circle
              class="ring-progress"
              cx="60" cy="60" r="52"
              :style="{ strokeDashoffset: ringOffset(52) }"
            />
          </svg>
          <div class="ring-center">
            <span class="ring-clock">{{ displayTime }}</span>
            <span class="ring-status">{{ statusText }}</span>
          </div>
        </div>

        <p v-if="sessionNote" class="panel-note">{{ sessionNote }}</p>

        <div class="panel-actions">
          <button type="button" class="act act-primary" @click="onToggle">
            {{ isRunning ? '⏸ Tạm dừng' : (isDone ? '▶ Phiên mới' : '▶ Bắt đầu') }}
          </button>
          <button type="button" class="act" @click="onReset">↻ Đặt lại</button>
          <button type="button" class="act" @click="switchMode(otherModeId)">
            {{ mode.id === 'focus' ? '☕ Nghỉ 5p' : '⚒️ Tập trung' }}
          </button>
        </div>

        <div v-if="mode.id === 'focus'" class="panel-presets">
          <span class="presets-label">Thời lượng</span>
          <div class="preset-row">
            <button
              v-for="value in presets"
              :key="value"
              type="button"
              class="preset"
              :class="{ active: minutes === value }"
              @click="setMinutes(value)"
            >{{ value }}p</button>
          </div>
        </div>

        <div class="panel-stats">
          <div class="panel-stat">
            <span class="stat-val">{{ today.minutes }}<small>p</small></span>
            <span class="stat-key">Hôm nay</span>
          </div>
          <div class="panel-stat">
            <span class="stat-val">{{ today.sessions }}</span>
            <span class="stat-key">Phiên hôm nay</span>
          </div>
          <div class="panel-stat">
            <span class="stat-val">{{ history.streak }}<small>🔥</small></span>
            <span class="stat-key">Chuỗi ngày</span>
          </div>
          <div class="panel-stat">
            <span class="stat-val">{{ history.sessions }}</span>
            <span class="stat-key">Tổng phiên</span>
          </div>
        </div>

        <label class="panel-sound">
          <input type="checkbox" :checked="soundOn" @change="onToggleSound" />
          <span>Tiếng báo khi hết giờ</span>
        </label>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  FOCUS_PRESETS,
  TIMER_MODES,
  buildTimerState,
  findMode,
  finishState,
  getHistory,
  getState,
  pauseState,
  resetState,
  ringOffsetOf,
  setMinutesState,
  setState,
  startState,
  stateAfterRestore,
  switchModeState,
  tickState,
  todayStats,
  toneOf,
  formatTime,
} from '../logic/forge-timer-logic.js';

export default {
  name: 'CHomeTimer',
  data() {
    return {
      open: false,
      mode: TIMER_MODES[0],
      remaining: 0,
      total: 1800,
      isRunning: false,
      isDone: false,
      soundOn: true,
      sessionNote: '',
      history: { sessions: 0, streak: 0 },
      today: { minutes: 0, sessions: 0 },
      intervalId: null,
      baseTitle: '',
    };
  },
  computed: {
    presets() {
      return FOCUS_PRESETS;
    },
    minutes() {
      return Math.round(this.total / 60);
    },
    displayTime() {
      return formatTime(this.remaining);
    },
    toneClass() {
      return toneOf(this.remaining, this.isRunning);
    },
    statusText() {
      if (this.isRunning) return 'đang chạy';
      if (this.isDone) return 'đã xong phiên';
      if (this.remaining === this.total) return `${this.minutes} phút`;
      return 'tạm dừng';
    },
    otherModeId() {
      return this.mode.id === 'focus' ? 'short' : 'focus';
    },
  },
  created() {
    this.restore();
  },
  mounted() {
    this.baseTitle = document.title;
    document.addEventListener('click', this.onDocumentClick);
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    this.clearTick();
    document.removeEventListener('click', this.onDocumentClick);
    window.removeEventListener('keydown', this.onKeydown);
    if (this.baseTitle) document.title = this.baseTitle;
  },
  methods: {
    restore() {
      const saved = getState();
      if (!saved) {
        this.applyState(buildTimerState({ mode: 'focus' }));
        return;
      }
      this.mode = findMode(saved.mode);
      this.total = saved.total || this.mode.defaultMinutes * 60;
      this.soundOn = saved.sound !== false;
      const restored = stateAfterRestore(saved);
      this.remaining = restored.remaining;
      this.isRunning = restored.running;
      if (restored.finished) {
        this.completeSession();
        return;
      }
      if (this.isRunning) this.startTick();
      this.refreshStats();
    },
    applyState(state, options = {}) {
      this.remaining = state.remaining;
      this.total = state.total;
      this.isRunning = Boolean(state.running);
      this.isDone = Boolean(options.done);
      if (state.mode) this.mode = findMode(state.mode);
      if (typeof state.sound === 'boolean') this.soundOn = state.sound;
      setState(state);
      this.refreshStats();
    },
    refreshStats() {
      const history = getHistory();
      this.history = history;
      this.today = todayStats(history);
    },
    startTick() {
      this.clearTick();
      this.intervalId = setInterval(this.tick, 1000);
    },
    clearTick() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    tick() {
      const next = tickState(getState());
      if (!next) return;
      setState(next);
      this.remaining = next.remaining;
      if (next.remaining === 0) {
        this.clearTick();
        this.completeSession();
        return;
      }
      this.syncTitle();
    },
    completeSession() {
      this.isRunning = false;
      this.isDone = true;
      document.title = this.baseTitle || document.title;
      const { history, minutes } = finishState(getState());
      this.history = history;
      this.today = todayStats(history);
      this.sessionNote = this.mode.id === 'focus'
        ? `Xong ${minutes} phút tập trung — nghỉ 5 phút rồi làm tiếp nhé.`
        : 'Hết giờ nghỉ — quay lại bàn học thôi.';
      this.playChime();
      if (this.mode.id === 'focus') {
        const next = switchModeState(getState(), 'short');
        setState(next);
        this.mode = findMode(next.mode);
        this.total = next.total;
        this.remaining = next.remaining;
      }
    },
    onToggle() {
      if (this.isRunning) {
        const next = pauseState(getState());
        setState(next);
        this.remaining = next.remaining;
        this.isRunning = false;
        this.clearTick();
        document.title = this.baseTitle || document.title;
        return;
      }
      const next = startState(getState(), this.minutes);
      setState(next);
      this.remaining = next.remaining;
      this.total = next.total;
      this.isRunning = true;
      this.isDone = false;
      this.sessionNote = '';
      this.startTick();
      this.syncTitle();
    },
    onReset() {
      this.clearTick();
      const next = resetState(this.minutes, { mode: this.mode.id, sound: this.soundOn });
      this.applyState(next);
      this.isRunning = false;
      this.isDone = false;
      this.sessionNote = '';
      document.title = this.baseTitle || document.title;
    },
    setMinutes(value) {
      this.clearTick();
      const next = setMinutesState(getState(), value);
      this.applyState(next);
      this.isRunning = false;
      this.isDone = false;
      this.sessionNote = '';
    },
    switchMode(modeId) {
      this.clearTick();
      const next = switchModeState(getState(), modeId);
      this.applyState(next);
      this.isRunning = false;
      this.isDone = false;
      this.sessionNote = '';
      document.title = this.baseTitle || document.title;
    },
    onToggleSound(event) {
      this.soundOn = Boolean(event.target.checked);
      const base = getState() || buildTimerState({ mode: this.mode.id, minutes: this.minutes, sound: this.soundOn });
      setState({ ...base, sound: this.soundOn });
    },
    togglePanel() {
      this.open = !this.open;
    },
    closePanel() {
      this.open = false;
    },
    onDocumentClick(event) {
      if (!this.open) return;
      if (this.$refs.root && !this.$refs.root.contains(event.target)) this.open = false;
    },
    onKeydown(event) {
      if (event.key === 'Escape') this.open = false;
    },
    ringOffset(radius) {
      const circumference = 2 * Math.PI * radius;
      return ringOffsetOf(this.remaining, this.total, circumference);
    },
    syncTitle() {
      document.title = `${this.displayTime} · ${this.mode.label} — ${this.baseTitle || 'SkillForge'}`;
    },
    playChime() {
      if (!this.soundOn) return;
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const start = ctx.currentTime;
        const notes = [660, 880, 990];
        notes.forEach((freq, index) => {
          const at = start + index * 0.18;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(0.16, at + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(at);
          osc.stop(at + 0.2);
        });
        setTimeout(() => {
          if (typeof ctx.close === 'function') ctx.close();
        }, 1000);
      } catch (err) {
        // trình duyệt chặn phát âm thanh → bỏ qua, không làm hỏng đồng hồ
      }
    },
  },
};
</script>

<style scoped>
.forge-timer-wrap {
  position: relative;
  flex-shrink: 0;
}

.timer-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.45rem 0.3rem 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--forge-glass-border, rgba(255, 255, 255, 0.12));
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: border-color var(--transition-fast, 0.15s ease), background var(--transition-fast, 0.15s ease);
}

.timer-pill.running {
  border-color: color-mix(in srgb, var(--timer-color) 60%, transparent);
  background: color-mix(in srgb, var(--timer-color) 16%, transparent);
}

.timer-pill.done {
  border-color: rgba(34, 197, 94, 0.5);
}

.pill-main {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.1rem 0.2rem;
  border: none;
  background: transparent;
  color: inherit;
  font-family: inherit;
  cursor: pointer;
}

.pill-main:focus-visible,
.pill-action:focus-visible,
.act:focus-visible,
.preset:focus-visible,
.panel-close:focus-visible {
  outline: 2px solid var(--timer-color);
  outline-offset: 2px;
}

.pill-ring {
  position: relative;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
}

.pill-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 4;
}

.ring-progress {
  fill: none;
  stroke: var(--timer-color);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s linear, stroke 0.4s ease;
}

.ring-progress.warning {
  stroke: var(--forge-ring-warning, #f59e0b);
}

.ring-progress.danger {
  stroke: var(--forge-ring-danger, #f43f5e);
}

.pill-clock {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--forge-text, #f8fafc);
  font-variant-numeric: tabular-nums;
}

.pill-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.pill-mode {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--forge-text, #f8fafc);
  white-space: nowrap;
}

.pill-sub {
  font-size: 0.66rem;
  font-weight: 600;
  color: var(--forge-text3, #94a3b8);
  white-space: nowrap;
}

.pill-chevron {
  font-size: 0.62rem;
  color: var(--forge-text3, #94a3b8);
}

.pill-action {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: var(--timer-color);
  color: #10101c;
  font-size: 0.72rem;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
}

.pill-action:hover {
  filter: brightness(1.12);
}

.timer-panel {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  width: min(340px, calc(100vw - 2rem));
  padding: 1rem;
  border-radius: 18px;
  background: #171530;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  z-index: 90;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.panel-mode {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--forge-text, #f8fafc);
}

.panel-close {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: var(--forge-text2, #cbd5e1);
  font-size: 0.72rem;
  cursor: pointer;
}

.panel-close:hover {
  background: rgba(255, 255, 255, 0.18);
  color: var(--forge-text, #f8fafc);
}

.panel-ring {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 0.75rem;
}

.panel-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.panel-ring .ring-bg {
  stroke-width: 7;
}

.panel-ring .ring-progress {
  stroke-width: 7;
  filter: drop-shadow(0 0 8px color-mix(in srgb, var(--timer-color) 55%, transparent));
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
}

.ring-clock {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--forge-text, #f8fafc);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.ring-status {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--forge-text3, #94a3b8);
}

.panel-note {
  margin: 0 0 0.7rem;
  padding: 0.5rem 0.7rem;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.14);
  color: #bbf7d0;
  font-size: 0.78rem;
  font-weight: 600;
}

.panel-actions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.act {
  flex: 1;
  min-width: 88px;
  padding: 0.55rem 0.6rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: var(--forge-text2, #cbd5e1);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.act:hover {
  border-color: var(--timer-color);
  color: var(--forge-text, #f8fafc);
}

.act-primary {
  background: linear-gradient(135deg, var(--timer-color), color-mix(in srgb, var(--timer-color) 60%, #0c0a1d));
  border-color: transparent;
  color: #10101c;
}

.panel-presets {
  margin-top: 0.85rem;
}

.presets-label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--forge-text3, #94a3b8);
}

.preset-row {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.preset {
  flex: 1;
  min-width: 46px;
  padding: 0.4rem 0.2rem;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: var(--forge-text2, #cbd5e1);
  font-family: inherit;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
}

.preset:hover {
  border-color: var(--timer-color);
  color: var(--forge-text, #f8fafc);
}

.preset.active {
  background: var(--timer-color);
  border-color: var(--timer-color);
  color: #10101c;
}

.panel-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
  margin-top: 0.9rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}

.stat-val {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--forge-text, #f8fafc);
}

.stat-val small {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--forge-text3, #94a3b8);
  margin-left: 0.1rem;
}

.stat-key {
  font-size: 0.62rem;
  font-weight: 600;
  color: var(--forge-text3, #94a3b8);
  text-align: center;
}

.panel-sound {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.85rem;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--forge-text3, #94a3b8);
  cursor: pointer;
}

.panel-sound input {
  width: 15px;
  height: 15px;
  accent-color: var(--timer-color);
  cursor: pointer;
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 720px) {
  .pill-text {
    display: none;
  }

  .timer-panel {
    right: auto;
    left: 0;
  }
}

@media (max-width: 420px) {
  /* Trên điện thoại, bảng neo theo màn hình chứ không theo pill (pill hẹp nên left:50% bị lệch) */
  .timer-panel {
    position: fixed;
    left: 0.75rem;
    right: 0.75rem;
    bottom: 0.75rem;
    top: auto;
    width: auto;
    max-height: calc(100vh - 1.5rem);
    overflow-y: auto;
  }

  .panel-fade-enter-from,
  .panel-fade-leave-to {
    transform: translateY(10px);
  }

  .panel-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
