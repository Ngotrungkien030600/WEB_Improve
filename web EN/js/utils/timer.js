/**
 * Forge Timer — SVG progress ring + session tracking
 */
(function () {
  const STATE_KEY = 'skillforge_timer_state';
  const HISTORY_KEY = 'skillforge_timer_history';
  const CIRCUMFERENCE = 188.5; // 2π × 30

  /* ───── Storage helpers ───── */
  function getState() {
    try { const r = localStorage.getItem(STATE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
  }
  function setState(s) { localStorage.setItem(STATE_KEY, JSON.stringify(s)); }

  function getHistory() {
    try {
      const r = localStorage.getItem(HISTORY_KEY);
      const h = r ? JSON.parse(r) : { totalMinutes: 0, sessions: 0, streak: 0, lastDate: null, dates: {} };
      // Reset streak nếu miss >1 ngày
      if (h.lastDate) {
        const diff = Math.floor((Date.now() - new Date(h.lastDate).getTime()) / 86400000);
        if (diff > 1) h.streak = 0;
      }
      return h;
    } catch { return { totalMinutes: 0, sessions: 0, streak: 0, lastDate: null, dates: {} }; }
  }
  function saveHistory(h) { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); }

  function getTodayKey() { return new Date().toISOString().slice(0, 10); }

  function recordSession(minutes) {
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
    saveHistory(h);
    return h;
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function playAlarm() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      osc.start(); osc.stop(ctx.currentTime + 1);
    } catch (e) {}
  }

  /* ───── UI ───── */
  function updateRing(el, ratio, remaining) {
    const offset = CIRCUMFERENCE * (1 - ratio);
    el.style.strokeDashoffset = offset;
    el.classList.toggle('warning', remaining <= 300 && remaining > 60);
    el.classList.toggle('danger', remaining <= 60 && remaining > 0);
  }

  function updateStats() {
    const h = getHistory();
    const today = getTodayKey();
    const todayMin = h.dates[today] || 0;
    const elTotal = document.getElementById('stat-total');
    const elStreak = document.getElementById('stat-streak');
    const elToday = document.getElementById('stat-today');
    if (elTotal) elTotal.textContent = h.sessions;
    if (elStreak) elStreak.textContent = `${h.streak}🔥`;
    if (elToday) elToday.textContent = `${todayMin}m`;
  }

  /* ───── Modal ───── */
  function showCongrats(minutes) {
    playAlarm();
    const h = getHistory();
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="forge-modal-overlay">
        <div class="forge-modal">
          <div class="forge-modal-icon">⚒️</div>
          <h2>Rèn thành công!</h2>
          <div class="forge-modal-stats">
            Bạn đã hoàn thành <strong>${minutes} phút</strong> tập trung.<br>
            Hôm nay: <strong>${h.dates[getTodayKey()] || 0}m</strong> &middot; Streak: <strong>${h.streak}🔥</strong>
          </div>
          <button class="forge-modal-btn">Tiếp tục</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.forge-modal-btn').addEventListener('click', () => modal.remove());

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('SkillForge', { body: `⚒️ Rèn xong! ${minutes} phút tập trung. Streak: ${h.streak}🔥` });
    }
  }

  /* ───── Init ───── */
  function initTimer() {
    const ringEl = document.getElementById('forge-ring-progress');
    const timeEl = document.getElementById('forge-time');
    const selectEl = document.getElementById('forge-select');
    const toggleBtn = document.getElementById('forge-toggle');
    const resetBtn = document.getElementById('forge-reset');
    if (!ringEl || !timeEl || !selectEl || !toggleBtn || !resetBtn) return;

    let interval = null;

    function updateDisplay(remaining, running) {
      timeEl.textContent = formatTime(remaining);
      const ratio = 1; // mặc định
      // update ring — cần biết total
      const s = getState();
      if (s && s.total > 0) {
        const ratio = remaining / s.total;
        updateRing(ringEl, ratio, remaining);
      }
      timeEl.classList.toggle('warning', remaining <= 300 && remaining > 60);
      timeEl.classList.toggle('danger', remaining <= 60 && remaining > 0);
      document.title = running && remaining > 0
        ? `${formatTime(remaining)} — SkillForge`
        : 'SkillForge — Lò rèn kỹ năng';
    }

    function finish() {
      clearInterval(interval); interval = null;
      const s = getState();
      const minutes = s ? Math.round(s.total / 60) : 30;
      setState({ total: s ? s.total : 1800, remaining: 0, running: false, lastUpdated: Date.now() });
      updateRing(ringEl, 0, 0);
      timeEl.textContent = formatTime(0);
      timeEl.classList.remove('warning', 'danger');
      toggleBtn.textContent = '⚒️';
      document.title = 'SkillForge — Lò rèn kỹ năng';
      // Record session
      recordSession(minutes);
      updateStats();
      setTimeout(() => showCongrats(minutes), 300);
    }

    function tick() {
      const s = getState(); if (!s) return;
      const now = Date.now();
      const elapsed = Math.floor((now - s.lastUpdated) / 1000);
      const remaining = Math.max(0, s.remaining - elapsed);
      setState({ ...s, remaining, lastUpdated: now });
      updateDisplay(remaining, true);
      if (remaining === 0) finish();
    }

    function startTimer() {
      let s = getState();
      const total = parseInt(selectEl.value, 10) * 60;
      if (!s || s.total !== total) {
        s = { total, remaining: total, running: true, lastUpdated: Date.now() };
      } else if (s.remaining <= 0) {
        s = { total, remaining: total, running: true, lastUpdated: Date.now() };
      } else {
        s = { ...s, running: true, lastUpdated: Date.now() };
      }
      setState(s);
      if ('Notification' in window && Notification.permission !== 'granted') Notification.requestPermission();
      if (!interval) interval = setInterval(tick, 1000);
      toggleBtn.textContent = '⏸';
      updateDisplay(s.remaining, true);
    }

    function pauseTimer() {
      clearInterval(interval); interval = null;
      const s = getState();
      if (s) {
        const now = Date.now();
        const elapsed = Math.floor((now - s.lastUpdated) / 1000);
        setState({ ...s, remaining: Math.max(0, s.remaining - elapsed), running: false, lastUpdated: now });
      }
      toggleBtn.textContent = '▶';
      const s2 = getState();
      if (s2) updateDisplay(s2.remaining, false);
    }

    function resetTimer() {
      clearInterval(interval); interval = null;
      const total = parseInt(selectEl.value, 10) * 60;
      setState({ total, remaining: total, running: false, lastUpdated: Date.now() });
      toggleBtn.textContent = '⚒️';
      updateRing(ringEl, 1, total);
      timeEl.textContent = formatTime(total);
      timeEl.classList.remove('warning', 'danger');
    }

    toggleBtn.addEventListener('click', () => {
      const s = getState();
      if (s && s.running) pauseTimer();
      else startTimer();
    });

    resetBtn.addEventListener('click', resetTimer);

    selectEl.addEventListener('change', () => {
      const s = getState();
      if (!s || !s.running) resetTimer();
    });

    function restore() {
      const s = getState();
      if (!s) { resetTimer(); updateStats(); return; }
      const minutes = s.total / 60;
      if ([30, 60].includes(minutes)) selectEl.value = String(minutes);
      if (s.running) {
        const now = Date.now();
        const elapsed = Math.floor((now - s.lastUpdated) / 1000);
        const remaining = Math.max(0, s.remaining - elapsed);
        setState({ ...s, remaining, lastUpdated: now });
        if (remaining === 0) {
          finish();
        } else {
          toggleBtn.textContent = '⏸';
          updateDisplay(remaining, true);
          if (!interval) interval = setInterval(tick, 1000);
        }
      } else {
        updateRing(ringEl, s.total > 0 ? s.remaining / s.total : 1, s.remaining);
        timeEl.textContent = formatTime(s.remaining);
        toggleBtn.textContent = s.remaining < s.total && s.remaining > 0 ? '▶' : '⚒️';
      }
      updateStats();
    }

    restore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initTimer());
  } else {
    initTimer();
  }
})();
