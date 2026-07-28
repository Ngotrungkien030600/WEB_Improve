(function () {
  const STORAGE_KEY = 'skillforge_timer_state';
  const ALARM_SHOWN_KEY = 'skillforge_timer_alarm_shown';

  function getState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clearState() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ALARM_SHOWN_KEY);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function playAlarm() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 1);
    } catch (e) {}
  }

  function showCongrats() {
    localStorage.setItem(ALARM_SHOWN_KEY, '1');
    playAlarm();

    const modal = document.createElement('div');
    modal.id = 'timer-congrats-modal';
    modal.innerHTML = `
      <div class="timer-modal-overlay">
        <div class="timer-modal-content">
          <div class="timer-modal-icon">🎉</div>
          <h2>Chúc mừng bạn!</h2>
          <p>Bạn đã hoàn thành một phiên học tập tập trung.</p>
          <p class="timer-modal-quote">"Kiên trì mỗi ngày — thành công sẽ đến!"</p>
          <button class="timer-modal-btn">Tiếp tục</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.timer-modal-btn').addEventListener('click', () => {
      modal.remove();
    });

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('SkillForge', { body: 'Chúc mừng! Bạn đã hoàn thành phiên học 🎉' });
    }
  }

  function initTimer() {
    const timerDisplay = document.getElementById('timer-display');
    const timerSelect = document.getElementById('timer-select');
    const toggleBtn = document.getElementById('timer-toggle');
    const resetBtn = document.getElementById('timer-reset');
    if (!timerDisplay || !timerSelect || !toggleBtn || !resetBtn) return;

    let state = getState();
    let interval = null;

    function saveCurrentState() {
      const total = parseInt(timerSelect.value, 10) * 60;
      const remaining = total; // khi reset/pause không cần lưu remaining real-time ở đây vì interval tick sẽ lưu
      setState({
        total,
        remaining,
        running: false,
        lastUpdated: Date.now()
      });
    }

    function updateDisplay(remaining, running) {
      timerDisplay.textContent = formatTime(remaining);
      timerDisplay.classList.toggle('warning', remaining <= 300 && remaining > 0);
      document.title = running && remaining > 0
        ? `${formatTime(remaining)} — SkillForge`
        : 'SkillForge — Lò rèn kỹ năng';
    }

    function finish() {
      clearInterval(interval);
      interval = null;
      const total = parseInt(timerSelect.value, 10) * 60;
      setState({ total, remaining: 0, running: false, lastUpdated: Date.now() });
      updateDisplay(0, false);
      toggleBtn.textContent = 'Bắt đầu';
      timerDisplay.classList.remove('warning');
      showCongrats();
    }

    function tick() {
      const s = getState();
      if (!s) return;
      const now = Date.now();
      const elapsed = Math.floor((now - s.lastUpdated) / 1000);
      const remaining = Math.max(0, s.remaining - elapsed);

      setState({ ...s, remaining, lastUpdated: now });
      updateDisplay(remaining, true);

      if (remaining === 0) {
        finish();
      }
    }

    function startTimer() {
      let s = getState();
      const total = parseInt(timerSelect.value, 10) * 60;

      if (!s || s.total !== total) {
        s = { total, remaining: total, running: true, lastUpdated: Date.now() };
      } else if (s.remaining <= 0) {
        s = { total, remaining: total, running: true, lastUpdated: Date.now() };
      } else {
        s = { ...s, running: true, lastUpdated: Date.now() };
      }
      setState(s);

      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      if (!interval) {
        interval = setInterval(tick, 1000);
      }
      toggleBtn.textContent = 'Tạm dừng';
      updateDisplay(s.remaining, true);
    }

    function pauseTimer() {
      clearInterval(interval);
      interval = null;
      const s = getState();
      if (s) {
        const now = Date.now();
        const elapsed = Math.floor((now - s.lastUpdated) / 1000);
        setState({ ...s, remaining: Math.max(0, s.remaining - elapsed), running: false, lastUpdated: now });
      }
      toggleBtn.textContent = 'Tiếp tục';
      const s2 = getState();
      updateDisplay(s2 ? s2.remaining : 0, false);
    }

    function resetTimer() {
      clearInterval(interval);
      interval = null;
      const total = parseInt(timerSelect.value, 10) * 60;
      const now = Date.now();
      setState({ total, remaining: total, running: false, lastUpdated: now });
      toggleBtn.textContent = 'Bắt đầu';
      timerDisplay.classList.remove('warning');
      updateDisplay(total, false);
      localStorage.removeItem(ALARM_SHOWN_KEY);
    }

    toggleBtn.addEventListener('click', () => {
      const s = getState();
      if (s && s.running) {
        pauseTimer();
      } else {
        startTimer();
      }
    });

    resetBtn.addEventListener('click', resetTimer);

    timerSelect.addEventListener('change', () => {
      const s = getState();
      if (!s || !s.running) {
        resetTimer();
      }
    });

    // Khôi phục trạng thái khi load trang
    function restore() {
      const s = getState();
      if (!s) {
        resetTimer();
        return;
      }

      // Cập nhật select cho đúng với total đã lưu
      const minutes = s.total / 60;
      if ([30, 60].includes(minutes)) {
        timerSelect.value = String(minutes);
      }

      if (s.running) {
        const now = Date.now();
        const elapsed = Math.floor((now - s.lastUpdated) / 1000);
        const remaining = Math.max(0, s.remaining - elapsed);
        setState({ ...s, remaining, lastUpdated: now });
        updateDisplay(remaining, true);

        if (remaining === 0) {
          finish();
        } else {
          toggleBtn.textContent = 'Tạm dừng';
          if (!interval) interval = setInterval(tick, 1000);
        }
      } else {
        updateDisplay(s.remaining, false);
        toggleBtn.textContent = s.remaining < s.total && s.remaining > 0 ? 'Tiếp tục' : 'Bắt đầu';
      }
    }

    restore();
  }

  // Inject CSS modal nếu chưa có
  function injectStyles() {
    if (document.getElementById('timer-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'timer-modal-styles';
    style.textContent = `
      .timer-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      .timer-modal-content {
        background: white;
        border-radius: 24px;
        padding: 2.2rem 2.5rem;
        text-align: center;
        max-width: 420px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: scaleIn 0.3s ease;
      }
      .timer-modal-icon {
        font-size: 4rem;
        margin-bottom: 0.5rem;
      }
      .timer-modal-content h2 {
        color: #764ba2;
        font-size: 1.8rem;
        margin-bottom: 0.8rem;
      }
      .timer-modal-content p {
        color: #555;
        font-size: 1.15rem;
        line-height: 1.6;
        margin-bottom: 0.6rem;
      }
      .timer-modal-quote {
        font-style: italic;
        color: #667eea;
        font-weight: 600;
      }
      .timer-modal-btn {
        margin-top: 1.2rem;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 30px;
        padding: 0.8rem 2rem;
        font-size: 1.15rem;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .timer-modal-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(118, 75, 162, 0.35);
      }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scaleIn { from { transform: scale(0.9); } to { transform: scale(1); } }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { injectStyles(); initTimer(); });
  } else {
    injectStyles();
    initTimer();
  }
})();
