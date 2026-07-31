/**
 * Forge Timer Logic — pure JS, localStorage, zero framework dependency.
 * Ported from Legacy timer.js IIFE. Handles countdown state + history.
 */
const STATE_KEY = 'skillforge_timer_state';
const HISTORY_KEY = 'skillforge_timer_history';
const CIRCUMFERENCE = 188.5; // 2π × 30

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

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ── Time formatting ───────────────────────────────────────────────────────────

export function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function calcRatio(remaining, total) {
  return total > 0 ? remaining / total : 1;
}

// ── Timer controls (stateless helpers for Vue reactive state) ────────────────

export function buildInitialState(durationMinutes = 30) {
  const total = durationMinutes * 60;
  return { total, remaining: total, running: false, lastUpdated: Date.now() };
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
    return { total, remaining: total, running: true, lastUpdated: Date.now() };
  }
  if (s.remaining <= 0) {
    return { total, remaining: total, running: true, lastUpdated: Date.now() };
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

export function resetState(durationMinutes) {
  const total = durationMinutes * 60;
  return { total, remaining: total, running: false, lastUpdated: Date.now() };
}
