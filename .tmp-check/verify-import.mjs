// Kiểm chứng hộp thoại "Nhập tiến độ": che kín trang nền, khoá cuộn, mỗi mục 1 dòng dễ hiểu, không lặp.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9344;
const BASE = 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-import-'));
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
  else if (m.method === 'Runtime.exceptionThrown') events.push('EXCEPTION: ' + (m.params?.exceptionDetails?.exception?.description || m.params?.exceptionDetails?.text || ''));
});
const send = (method, params = {}) => new Promise((res) => { const i = id++; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};

const results = [];
function check(name, actual, expected) {
  const pass = actual === expected;
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`);
}

const setInput = async (sel, val) => {
  const out = await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(sel)});
    if (!el) {
      return 'KHONG_THAY | tabs=' + Array.from(document.querySelectorAll('.auth-tab')).map((t) => t.textContent.trim()).join('/')
        + ' | inputs=' + Array.from(document.querySelectorAll('input')).map((i) => i.id || i.type).join(',')
        + ' | path=' + location.pathname + location.search;
    }
    const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    s.call(el, ${JSON.stringify(val)});
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return 'ok';
  })()`);
  if (out !== 'ok') throw new Error(`không điền được ${sel} → ${out}`);
  return out;
};

try {
  await send('Page.enable');
  await send('Runtime.enable');

  // Chuẩn bị: 7 mục tiến độ giống máy người dùng, gồm cả khoá cũ từng hiện trùng
  await send('Page.navigate', { url: BASE + '/login' });
  await sleep(1600);
  await evaluate(`(() => {
    const data = {
      skillforge_skills: '[1,2,3]',
      skillforge_timer_state: '{"mode":"work"}',
      sf_accelerator_state: '{"step":4}',
      skillforge_motivation_state: '{"last":"2026-09-11"}',
      sf_forge_stats: '{"xp":120,"streak":3}',
      skillforge_log: '[{"d":"2026-09-10"}]',
      skillforge_ai_interview: '[{"q":"JVM"}]'
    };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
    return Object.keys(data).length;
  })()`);

  // Đăng ký rồi đăng nhập
  await evaluate("document.querySelectorAll('.auth-tab')[1].click()");
  await sleep(300);
  await setInput('#reg-email', 'import@example.com');
  await setInput('#reg-password', 'MatKhau123');
  await setInput('#reg-confirm', 'MatKhau123');
  await evaluate("document.querySelector('.auth-check input').click()");
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(900);
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(800);
  await setInput('#auth-password', 'MatKhau123');
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(1400);

  check('hộp thoại nhập tiến độ hiện ra', await evaluate("Boolean(document.querySelector('.import-overlay'))"), true);

  const info = JSON.parse(await evaluate(`JSON.stringify((() => {
    const overlay = document.querySelector('.import-overlay');
    const card = document.querySelector('.import-card');
    const items = Array.from(document.querySelectorAll('.import-item'));
    const cs = getComputedStyle(overlay);
    const rect = overlay.getBoundingClientRect();
    const topLeft = document.elementFromPoint(3, 3);
    const mid = document.elementFromPoint(Math.round(window.innerWidth / 2), Math.round(window.innerHeight - 30));
    return {
      fixed: cs.position,
      zIndex: Number(cs.zIndex),
      bgAlpha: cs.backgroundColor,
      coversWidth: Math.round(rect.width) === window.innerWidth,
      coversHeight: Math.round(rect.height) === window.innerHeight,
      topLeftInsideOverlay: Boolean(topLeft && topLeft.closest('.import-overlay')),
      bottomInsideOverlay: Boolean(mid && mid.closest('.import-overlay')),
      bodyOverflow: document.body.style.overflow,
      cardOnTop: Boolean(card && document.elementFromPoint(Math.round(window.innerWidth / 2), Math.round(window.innerHeight / 2))?.closest('.import-card')),
      itemCount: items.length,
      labels: items.map((li) => li.innerText.trim()),
      linesPerItem: items.map((li) => li.innerText.trim().split('\\n').filter(Boolean).length),
      hasRawKeySpan: Boolean(document.querySelector('.import-item-key')),
      descText: (document.querySelector('.import-desc') || {}).innerText || '',
      explain: (document.querySelector('.import-explain') || {}).innerText || ''
    };
  })())`));

  check('overlay là lớp phủ toàn màn hình', info.fixed, 'fixed');
  check('overlay nằm trên cùng (z-index)', info.zIndex >= 9999, true);
  check('nền mờ gần kín (alpha >= 0.9)', /rgba?\([^)]*0\.9\d?\)/.test(info.bgAlpha), true);
  check('overlay phủ hết chiều ngang', info.coversWidth, true);
  check('overlay phủ hết chiều dọc', info.coversHeight, true);
  check('góc trên trái thuộc overlay (không bấm được trang nền)', info.topLeftInsideOverlay, true);
  check('đáy màn hình thuộc overlay', info.bottomInsideOverlay, true);
  check('khoá cuộn trang nền', info.bodyOverflow, 'hidden');
  check('hộp thoại nằm trên overlay', info.cardOnTop, true);
  check('đúng 7 mục tiến độ', info.itemCount, 7);
  check('mỗi mục chỉ 1 dòng (hết lặp nhãn + mã khoá)', info.linesPerItem.every((n) => n === 1), true);
  check('không còn hiện mã khoá thô', info.hasRawKeySpan, false);
  check('nhãn không trùng nhau', new Set(info.labels).size === info.labels.length, true);
  check('có nhãn tiếng Việt cho khoá Accelerator', info.labels.includes('Tiến độ Accelerator'), true);
  check('có nhãn cho khoá thống kê XP', info.labels.includes('Thống kê XP và streak'), true);
  check('có nhãn cho lịch sử phỏng vấn AI', info.labels.includes('Lịch sử phỏng vấn với AI'), true);
  check('câu mô tả nêu đúng số mục', info.descText.includes('7 mục tiến độ học'), true);
  check('có giải thích rõ Nhập vs Bỏ qua', info.explain.includes('Nhập vào tài khoản này') && info.explain.includes('Bỏ qua'), true);

  // Nhập → hộp thoại đóng, mở khoá cuộn, vào web chính
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('.import-btn')).find((b) => b.textContent.includes('Nhập vào tài khoản này'));
    btn.click();
    return true;
  })()`);
  await sleep(1200);
  check('nhập xong → hộp thoại đóng', await evaluate("document.querySelector('.import-overlay') === null"), true);
  check('nhập xong → mở khoá cuộn', await evaluate('document.body.style.overflow'), '');
  check('nhập xong → vào web chính', await evaluate('location.pathname'), '/');

  // Bỏ qua bằng ESC khi hộp thoại hiện lại (đăng xuất rồi đăng nhập lại)
  await send('Page.navigate', { url: BASE + '/login' });
  await sleep(1500);
  await evaluate("localStorage.removeItem('sf_auth_imported_for')");
  check('đang đăng nhập thì /login hiện bảng tài khoản', await evaluate("Boolean(document.querySelector('.auth-done'))"), true);
  const switched = await evaluate(`(() => {
    const link = Array.from(document.querySelectorAll('.auth-link')).find((x) => x.textContent.includes('Đăng xuất'));
    if (!link) return 'KHONG_THAY';
    link.click();
    return 'ok';
  })()`);
  check('bấm “Đăng xuất để dùng tài khoản khác” được', switched, 'ok');
  await sleep(800);
  await setInput('#auth-email', 'import@example.com');
  await setInput('#auth-password', 'MatKhau123');
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(1300);
  check('mở lại hộp thoại khi chưa nhập', await evaluate("Boolean(document.querySelector('.import-overlay'))"), true);
  await evaluate("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))");
  await sleep(900);
  check('bấm ESC → đóng hộp thoại (Bỏ qua)', await evaluate("document.querySelector('.import-overlay') === null"), true);
  check('ESC → mở khoá cuộn', await evaluate('document.body.style.overflow'), '');

  const failed = results.filter((r) => !r).length;
  console.log(`\nLỗi JS: ${events.length}`);
  events.slice(0, 5).forEach((e) => console.log('  ' + e));
  console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS`);
  process.exitCode = failed ? 1 : 0;
} catch (err) {
  console.error('LỖI KIỂM CHỨNG:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
