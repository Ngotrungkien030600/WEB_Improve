/**
 * Forge Timer Logic — pure JS, localStorage, zero framework dependency.
 * Ported from Legacy timer.js IIFE. Handles countdown state + history.
 */
const STATE_KEY = 'skillforge_timer_state';
const HISTORY_KEY = 'skillforge_timer_history';

export const TIMER_MODES = [
  { id: 'focus', label: 'Tập trung', emoji: '⚒️', defaultMinutes: 30, color: '#8b5cf6' },
  { id: 'short', label: 'Nghỉ ngắn', emoji: '☕', defaultMinutes: 5, color: '#34d399' },
  { id: 'long', label: 'Nghỉ dài', emoji: '🌿', defaultMinutes: 15, color: '#38bdf8' },
];

export const FOCUS_PRESETS = [15, 25, 30, 45, 60];

export function findMode(id) {
  return TIMER_MODES.find((mode) => mode.id === id) || TIMER_MODES[0];
}

export function minutesOf(state) {
  if (!state || !state.total) return findMode(state?.mode).defaultMinutes;
  return Math.round(state.total / 60);
}

// ── Storage ──────────────────────────────────────────────────────────────────

export function getState() {
  try {
    const r = localStorage.getItem(STATE_KEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}

export function setState(s) {
  localStorage.setItem(STATE_KEY, JSON.stringify(s));
}

// ── History ─────────────────────────────────────────────────────────────────

export function getHistory() {
  try {
    const r = localStorage.getItem(HISTORY_KEY);
    const h = r ? JSON.parse(r) : {
      totalMinutes: 0, sessions: 0, streak: 0,
      lastDate: null, dates: {}
    };
    if (h.lastDate) {
      const diff = Math.floor((Date.now() - new Date(h.lastDate).getTime()) / 86400000);
      if (diff > 1) h.streak = 0;
    }
    return h;
  } catch {
    return { totalMinutes: 0, sessions: 0, streak: 0, lastDate: null, dates: {} };
  }
}

export function recordSession(minutes) {
  const h = getHistory();
  const today = getTodayKey();
  h.totalMinutes += minutes;
  h.sessions += 1;
  h.dates[today] = (h.dates[today] || 0) + minutes;
  h.sessionDates = h.sessionDates || {};
  h.sessionDates[today] = (h.sessionDates[today] || 0) + 1;
  if (h.lastDate !== today) {
    const prev = h.lastDate;
    h.lastDate = today;
    if (prev) {
      const diff = Math.floor((new Date(today) - new Date(prev)) / 86400000);
      if (diff === 1) h.streak += 1;
      else if (diff > 1) h.streak = 1;
    } else {
      h.streak = 1;
    }
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  return h;
}

export function todayStats(history, key = getTodayKey()) {
  const h = history || {};
  return {
    minutes: (h.dates && h.dates[key]) || 0,
    sessions: (h.sessionDates && h.sessionDates[key]) || 0,
  };
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ── Time formatting ───────────────────────────────────────────────────────────

export function formatTime(sec) {
  const safe = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(safe / 60).toString().padStart(2, '0');
  const s = (safe % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function calcRatio(remaining, total) {
  return total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 1;
}

export function circumferenceOf(radius) {
  return 2 * Math.PI * radius;
}

export function ringOffsetOf(remaining, total, circumference) {
  return circumference * (1 - calcRatio(remaining, total));
}

export function toneOf(remaining, running) {
  if (!running || remaining <= 0) return '';
  if (remaining <= 60) return 'danger';
  if (remaining <= 300) return 'warning';
  return '';
}

// ── Timer controls (stateless helpers for Vue reactive state) ────────────────

export function buildInitialState(durationMinutes = 30, mode = 'focus') {
  const total = durationMinutes * 60;
  return { mode, total, remaining: total, running: false, lastUpdated: Date.now() };
}

export function buildTimerState({ mode = 'focus', minutes, sound = true } = {}) {
  const resolved = minutes || findMode(mode).defaultMinutes;
  return { ...buildInitialState(resolved, mode), sound };
}

export function tickState(s) {
  if (!s) return null;
  const now = Date.now();
  const elapsed = Math.floor((now - s.lastUpdated) / 1000);
  const remaining = Math.max(0, s.remaining - elapsed);
  return { ...s, remaining, lastUpdated: now };
}

export function finishState(s) {
  const minutes = Math.round((s?.total || 1800) / 60);
  const next = {
    ...s,
    total: s?.total || 1800,
    remaining: 0,
    running: false,
    lastUpdated: Date.now()
  };
  setState(next);
  const h = recordSession(minutes);
  return { state: next, history: h, minutes };
}

export function startState(s, durationMinutes) {
  const total = durationMinutes * 60;
  if (!s || s.total !== total) {
    return { ...s, mode: s?.mode || 'focus', total, remaining: total, running: true, lastUpdated: Date.now() };
  }
  if (s.remaining <= 0) {
    return { ...s, total, remaining: total, running: true, lastUpdated: Date.now() };
  }
  return { ...s, running: true, lastUpdated: Date.now() };
}

export function pauseState(s) {
  if (!s) return s;
  const now = Date.now();
  const elapsed = Math.floor((now - s.lastUpdated) / 1000);
  return {
    ...s,
    remaining: Math.max(0, s.remaining - elapsed),
    running: false,
    lastUpdated: now
  };
}

export function resetState(durationMinutes, extra = {}) {
  const total = durationMinutes * 60;
  return { ...extra, total, remaining: total, running: false, lastUpdated: Date.now() };
}

export function switchModeState(s, modeId, minutes) {
  const mode = findMode(modeId);
  const resolved = minutes || mode.defaultMinutes;
  const total = resolved * 60;
  return { ...s, mode: mode.id, total, remaining: total, running: false, lastUpdated: Date.now() };
}

export function setMinutesState(s, minutes) {
  const total = minutes * 60;
  return { ...s, total, remaining: total, running: false, lastUpdated: Date.now() };
}

export function toggleSoundState(s) {
  return { ...s, sound: !(s?.sound !== false) };
}

/**
 * Tính lại trạng thái khi mở lại trang. Tab đóng giữa lúc đang chạy vẫn phải đúng giờ,
 * và phiên đã hết trong lúc vắng mặt phải được ghi nhận thay vì mắc ở 00:00.
 */
export function stateAfterRestore(state, now = Date.now()) {
  if (!state) return null;
  const remaining = Math.max(0, state.remaining || 0);
  if (!state.running) return { remaining, running: false, finished: false };
  const elapsed = Math.floor((now - (state.lastUpdated || now)) / 1000);
  const left = Math.max(0, remaining - elapsed);
  return { remaining: left, running: left > 0, finished: left === 0 };
}
