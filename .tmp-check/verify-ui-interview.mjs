// Kiểm chứng trang Phỏng vấn UI/FE làm lại: bố cục, tương phản tab đang bật, accordion,
// tìm kiếm + tô sáng, đổi cấp độ, phân trang, đánh dấu đã xem, màn hình hẹp.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = Number(process.env.SHOT_PORT || 9354);
const BASE = process.argv[2] || 'http://localhost:8080';
const ROUTE = '/frontend/ui-interview';
const profile = mkdtempSync(join(tmpdir(), 'dsh-uiv-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--mute-audio', '--window-size=1280,900', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function target() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const p = list.find((t) => t.type === 'page');
      if (p?.webSocketDebuggerUrl) return p.webSocketDebuggerUrl;
    } catch (err) { /* chờ */ }
    await sleep(250);
  }
  throw new Error('no cdp');
}

const ws = new WebSocket(await target());
let id = 1;
const pending = new Map();
const events = [];
await new Promise((res) => ws.addEventListener('open', res));
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  else if (m.method === 'Runtime.exceptionThrown') events.push(m.params?.exceptionDetails?.exception?.description?.split('\n')[0] || 'exception');
});
const send = (method, params = {}) => new Promise((res) => { const i = id++; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
const results = [];
function check(name, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`);
}
const typeSearch = (val) => evaluate(`(() => {
  const el = document.querySelector('.search-input');
  if (!el) return 'KHONG_THAY';
  const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  set.call(el, ${JSON.stringify(val)});
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return 'ok';
})()`);

try {
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: BASE + '/login' });
  await sleep(1500);
  await evaluate(`localStorage.removeItem('sf_ui_interview_seen'); localStorage.setItem('sf_auth_session', JSON.stringify({ user: { id: 'uiv', email: 'uiv@example.com', displayName: 'uiv', plan: 'free' } }))`);
  await send('Page.navigate', { url: BASE + ROUTE });
  await sleep(3000);

  // 1. Trang dựng đúng, không có phần tử che nội dung
  const base = JSON.parse(await evaluate(`JSON.stringify({
    path: location.pathname,
    cards: document.querySelectorAll('.q-card').length,
    tabs: document.querySelectorAll('.tier-tab').length,
    hasAnswerVisible: Boolean(document.querySelector('.q-card.open')),
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    fixedCovering: Array.from(document.querySelectorAll('body *')).filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed' && cs.position !== 'absolute') return false;
      const r = el.getBoundingClientRect();
      return r.width > window.innerWidth * 0.6 && r.height > window.innerHeight * 0.6;
    }).length,
    textLen: document.body.innerText.trim().length
  })`));
  check('mở đúng trang', base.path, ROUTE);
  check('hiện 8 câu mỗi trang', base.cards, 8);
  check('có 3 tab cấp độ', base.tabs, 3);
  check('mặc định chưa mở đáp án', base.hasAnswerVisible, false);
  check('không tràn ngang', base.overflowX, false);
  check('không có lớp phủ che toàn trang', base.fixedCovering, 0);
  check('có nội dung chữ', base.textLen > 600, true);

  // 2. Tab đang bật phải ĐỌC ĐƯỢC (lỗi cũ: chữ trùng màu nền)
  const tabContrast = JSON.parse(await evaluate(`JSON.stringify((() => {
    const parse = (c) => { const m = (c || '').match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(parseFloat); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
    const lum = (c) => { const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const el = document.querySelector('.tier-tab.active');
    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    const bg = parse(cs.backgroundColor);
    const ratio = (() => { const l1 = lum(fg); const l2 = lum(bg); const hi = Math.max(l1, l2); const lo = Math.min(l1, l2); return Math.round(((hi + 0.05) / (lo + 0.05)) * 10) / 10; })();
    return { fgAlpha: fg.a, ratio, label: el.textContent.trim() };
  })())`));
  check('chữ tab đang bật đục hoàn toàn', tabContrast.fgAlpha, 1);
  check('tương phản tab đang bật ≥ 4.5:1', tabContrast.ratio >= 4.5, true);
  check('tab đang bật có nhãn', tabContrast.label.includes('Junior'), true);

  // 3. Accordion: mở, có đáp án, chỉ một câu mở
  await evaluate("document.querySelectorAll('.q-head')[0].click()");
  await sleep(500);
  const opened = JSON.parse(await evaluate(`JSON.stringify({
    openCards: document.querySelectorAll('.q-card.open').length,
    expanded: document.querySelectorAll('.q-head')[0].getAttribute('aria-expanded'),
    items: document.querySelectorAll('.q-card.open .q-answer li').length,
    hasCode: Boolean(document.querySelector('.q-card.open .q-answer code')),
    boxDiffers: document.querySelectorAll('.q-card.open .q-body')[0].getBoundingClientRect().height > 40
  })`));
  check('mở được đáp án', opened.openCards, 1);
  check('aria-expanded = true', opened.expanded, 'true');
  check('đáp án có gạch đầu dòng', opened.items >= 3, true);
  check('đáp án có code', opened.hasCode, true);
  check('khung đáp án có chiều cao thật', opened.boxDiffers, true);

  await evaluate("document.querySelectorAll('.q-head')[1].click()");
  await sleep(400);
  check('mở câu khác thì câu cũ đóng', await evaluate("document.querySelectorAll('.q-card.open').length"), 1);
  await evaluate("document.querySelectorAll('.q-head')[1].click()");
  await sleep(400);
  check('bấm lại thì đóng', await evaluate("document.querySelectorAll('.q-card.open').length"), 0);

  // 4. Tìm kiếm + tô sáng + không dấu ("closure" nằm ở cấp Middle nên phải tìm ở đây)
  await typeSearch('box model');
  await sleep(600);
  const searched = JSON.parse(await evaluate(`JSON.stringify({
    cards: document.querySelectorAll('.q-card').length,
    marks: document.querySelectorAll('.q-text mark').length,
    line: document.querySelector('.result-line').textContent.trim()
  })`));
  check('tìm “box model” ra 1 câu', searched.cards, 1);
  check('từ khoá được tô sáng', searched.marks >= 1, true);
  check('dòng kết quả nói rõ số câu', searched.line.includes('Tìm thấy'), true);

  await typeSearch('ep kieu');
  await sleep(500);
  check('tìm không dấu vẫn ra kết quả', await evaluate("document.querySelectorAll('.q-card').length"), 1);

  await typeSearch('hop dong');
  await sleep(500);
  check('không khớp thì hiện trạng thái rỗng', await evaluate("Boolean(document.querySelector('.empty'))"), true);
  await evaluate("document.querySelector('.empty-btn').click()");
  await sleep(600);
  check('nút xoá tìm kiếm hoạt động', await evaluate("document.querySelectorAll('.q-card').length"), 8);

  await typeSearch('kien truc'); // tìm không dấu trong cấp junior → không có
  await sleep(500);
  await evaluate("document.querySelectorAll('.tier-tab')[2].click()");
  await sleep(600);
  check('đổi cấp độ giữ từ khoá và lọc đúng', await evaluate("document.querySelectorAll('.q-card').length"), 1);

  await evaluate("document.querySelector('.search-clear').click()");
  await sleep(600);
  check('xoá tìm kiếm về đủ 8 câu', await evaluate("document.querySelectorAll('.q-card').length"), 8);

  // 5. Phân trang
  const pagerInfo = JSON.parse(await evaluate(`JSON.stringify({
    buttons: Array.from(document.querySelectorAll('.pager-btn')).map((b) => b.textContent.trim()),
    page: document.querySelector('.q-index') ? document.querySelector('.q-index').textContent.trim() : ''
  })`));
  check('có nút phân trang', pagerInfo.buttons.length >= 4, true);
  check('trang 1 bắt đầu từ câu 1', pagerInfo.page, '1');
  await evaluate("Array.from(document.querySelectorAll('.pager-btn')).find((b) => b.textContent.trim() === 'Sau →').click()");
  await sleep(700);
  const page2 = JSON.parse(await evaluate(`JSON.stringify({
    page: document.querySelector('.q-index').textContent.trim(),
    active: document.querySelector('.pager-btn.active').textContent.trim()
  })`));
  check('sang trang 2 thì bắt đầu câu 9', page2.page, '9');
  check('nút trang 2 được đánh dấu', page2.active, '2');

  // 6. Đánh dấu đã xem + lưu vào máy
  await evaluate("document.querySelectorAll('.q-head')[0].click()");
  await sleep(400);
  await evaluate("document.querySelector('.q-card.open .seen-btn').click()");
  await sleep(500);
  const seen = JSON.parse(await evaluate(`JSON.stringify({
    mark: Boolean(document.querySelector('.q-card .q-seen')),
    stored: JSON.parse(localStorage.getItem('sf_ui_interview_seen') || '[]').length,
    counter: Array.from(document.querySelectorAll('.stat-num')).map((s) => s.textContent.trim())
  })`));
  check('câu được đánh dấu ✓', seen.mark, true);
  check('đã lưu vào localStorage', seen.stored, 1);
  check('bộ đếm “đã xem” tăng', seen.counter[2], '1');

  await send('Page.navigate', { url: BASE + ROUTE });
  await sleep(2500);
  const afterReload = JSON.parse(await evaluate(`JSON.stringify({
    stored: JSON.parse(localStorage.getItem('sf_ui_interview_seen') || '[]').length,
    stat: Array.from(document.querySelectorAll('.stat-num'))[2].textContent.trim(),
    barWidth: document.querySelector('.progress-fill').style.width
  })`));
  check('tải lại trang vẫn nhớ đã xem (localStorage)', afterReload.stored, 1);
  check('bộ đếm sau khi tải lại vẫn là 1', afterReload.stat, '1');
  check('thanh tiến độ đã nhích', afterReload.barWidth !== '0%', true);

  // 7. Màn hình hẹp (điện thoại)
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 780, deviceScaleFactor: 2, mobile: true });
  await sleep(700);
  const narrow = JSON.parse(await evaluate(`JSON.stringify({
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    tabsRow: document.querySelector('.tier-tabs').getBoundingClientRect().width <= window.innerWidth,
    cardInside: document.querySelector('.q-card').getBoundingClientRect().right <= window.innerWidth + 1
  })`));
  check('màn hình 390px: không tràn ngang', narrow.overflowX, false);
  check('màn hình 390px: tab nằm gọn', narrow.tabsRow, true);
  check('màn hình 390px: thẻ nằm gọn', narrow.cardInside, true);
  await send('Emulation.clearDeviceMetricsOverride');

  const failed = results.filter((r) => !r).length;
  console.log(`\nLỗi JS: ${events.length}`);
  [...new Set(events)].slice(0, 5).forEach((e) => console.log('  ' + e));
  console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS  (cổng: ${BASE})`);
  process.exitCode = failed ? 1 : 0;
} catch (err) {
  console.error('LỖI KIỂM CHỨNG:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
