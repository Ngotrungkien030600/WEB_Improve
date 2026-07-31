/**
 * Motivation popup — hiện lâu lâu (mặc định 1 lần/ngày, tối thiểu cách 6h).
 * Không spam, không làm phiền: nút đóng + "không hiện lại hôm nay".
 */
(function () {
  const LS_KEY = 'skillforge_motivation_state';
  const MIN_INTERVAL_HOURS = 6;   // tối thiểu 6h giữa 2 lần hiện
  const DAY_MS = 24 * 60 * 60 * 1000;

  function getState() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || {};
    } catch (e) { return {}; }
  }
  function setState(s) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {}
  }

  function shouldShow() {
    const s = getState();
    // "Không hiện lại hôm nay" chỉ có hiệu lực 24h
    if (s.dismissedToday && s.dismissedAt) {
      if (Date.now() - s.dismissedAt < DAY_MS) return false;
    }
    if (!s.lastShown) return true;                 // lần đầu
    const elapsed = Date.now() - s.lastShown;
    return elapsed >= MIN_INTERVAL_HOURS * 60 * 60 * 1000;
  }

  function pickQuote() {
    const quotes = window.motivationQuotes || [];
    if (quotes.length === 0) return null;
    // Lấy quote khác lần trước (tránh lặp liên tiếp)
    const s = getState();
    let candidates = quotes.filter(q => q.text !== s.lastQuote);
    if (candidates.length === 0) candidates = quotes;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function showPopup() {
    const quote = pickQuote();
    if (!quote) return;

    const el = document.createElement('div');
    el.className = 'moti-popup';
    el.setAttribute('role', 'dialog');
    const authorLine = quote.author
      ? `<div class="moti-author">${quote.author}${quote.role ? ` — ${quote.role}` : ''}</div>`
      : '';
    el.innerHTML = `
      <button class="moti-close" title="Đóng">✕</button>
      <div class="moti-icon">⚡</div>
      <blockquote class="moti-text">“${quote.text}”</blockquote>
      ${authorLine}
      <div class="moti-actions">
        <button class="moti-btn moti-btn-primary">💪 Bắt đầu ngay</button>
        <button class="moti-btn moti-btn-ghost">Không hiện lại hôm nay</button>
      </div>
    `;
    document.body.appendChild(el);

    // Ghi nhận đã hiện ngay lập tức (kể cả user không click gì)
    const now = Date.now();
    setState({ ...getState(), lastShown: now, lastQuote: quote.text });

    function markShown() {
      setState({
        ...getState(),
        lastShown: Date.now(),
        dismissedToday: false,
      });
    }
    function dismissToday() {
      setState({
        ...getState(),
        dismissedToday: true,
        dismissedAt: Date.now(),
      });
    }
    function close(updateFn) {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
      if (updateFn) updateFn();
    }

    el.querySelector('.moti-close').addEventListener('click', () => close(markShown));
    el.querySelector('.moti-btn-ghost').addEventListener('click', () => close(dismissToday));
    el.querySelector('.moti-btn-primary').addEventListener('click', () => {
      close(markShown);
      // Scroll nhẹ về đầu trang — user bắt đầu phiên học
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    requestAnimationFrame(() => el.classList.add('show'));
  }

  function init() {
    if (shouldShow()) {
      // Hiện sau 1.5s để không giật lúc trang vừa load
      setTimeout(showPopup, 1500);
    }
  }

  // Chờ DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
