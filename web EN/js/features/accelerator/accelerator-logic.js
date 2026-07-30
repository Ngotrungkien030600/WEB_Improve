/**
 * Accelerator — Logic Module
 * 30-day learning path state, progress tracking, streak calc, XP
 * Lưu trữ: localStorage + BroadcastChannel cho real-time sync
 */

const STORAGE_KEY = 'sf_accelerator_state';
const BROADCAST_CHANNEL = 'skillforge-accelerator';

let currentState = null;

function getDefaultState() {
  return {
    currentDay: 1,
    completedDays: {},
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    sessionMinutes: 0,
    sessionStart: null,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      currentState = JSON.parse(raw);
      // Validate streak
      if (currentState.lastActiveDate) {
        const last = new Date(currentState.lastActiveDate);
        const today = new Date();
        const diffDays = Math.floor((today - last) / 86400000);
        if (diffDays > 1) currentState.streak = 0;
      }
      return currentState;
    }
  } catch (e) { /* fall through */ }
  currentState = getDefaultState();
  saveState();
  return currentState;
}

function saveState() {
  if (!currentState) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  // Broadcast change to other tabs
  try {
    const bc = new BroadcastChannel(BROADCAST_CHANNEL);
    bc.postMessage({ type: 'state-update', state: currentState });
    bc.close();
  } catch (e) { /* BroadcastChannel not supported */ }
}

export function getCurrentDay() {
  if (!currentState) loadState();
  return currentState.currentDay;
}

export function setCurrentDay(day) {
  if (!currentState) loadState();
  currentState.currentDay = Math.max(1, Math.min(30, day));
  saveState();
}

export function completeDay(day, duration, score) {
  if (!currentState) loadState();
  const today = new Date().toISOString().split('T')[0];
  currentState.completedDays[day] = {
    completed: true,
    date: today,
    duration: duration || 0,
    score: score || 0,
  };
  // Update streak
  if (currentState.lastActiveDate !== today) {
    const last = currentState.lastActiveDate;
    currentState.lastActiveDate = today;
    if (last) {
      const diff = Math.floor((new Date(today) - new Date(last)) / 86400000);
      if (diff === 1) currentState.streak += 1;
      else if (diff > 1) currentState.streak = 1;
    } else {
      currentState.streak = 1;
    }
  }
  // XP reward
  const xpReward = Math.round((duration || 60) * 2 + (score || 0) * 5);
  currentState.xp += xpReward;
  if (currentState.currentDay < 30) currentState.currentDay = day + 1;
  saveState();
  return { xpReward, streak: currentState.streak, newDay: currentState.currentDay };
}

export function startSession() {
  if (!currentState) loadState();
  currentState.sessionStart = Date.now();
  currentState.sessionMinutes = 0;
  saveState();
}

export function endSession() {
  if (!currentState) loadState();
  if (currentState.sessionStart) {
    const elapsed = Math.floor((Date.now() - currentState.sessionStart) / 60000);
    currentState.sessionMinutes += Math.max(1, elapsed);
    currentState.sessionStart = null;
    saveState();
    return currentState.sessionMinutes;
  }
  return 0;
}

export function getSessionElapsed() {
  if (!currentState || !currentState.sessionStart) return 0;
  return Math.floor((Date.now() - currentState.sessionStart) / 1000);
}

export function isDayCompleted(day) {
  if (!currentState) loadState();
  return currentState.completedDays[day]?.completed || false;
}

export function getProgress() {
  if (!currentState) loadState();
  const completed = Object.keys(currentState.completedDays).filter(k => currentState.completedDays[k].completed).length;
  return {
    completed,
    total: 30,
    percent: Math.round((completed / 30) * 100),
    xp: currentState.xp,
    streak: currentState.streak,
    currentDay: currentState.currentDay,
  };
}

export function getDayScore(day) {
  if (!currentState) loadState();
  return currentState.completedDays[day] || null;
}

export { BROADCAST_CHANNEL };
