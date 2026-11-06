// Tái hiện luồng người dùng: đăng ký → đăng nhập → nhập tiến độ → vào web chính,
// rồi TẢI LẠI trang và mở trang khác (chỗ dễ hỏng: cổng chặn đọc phiên lúc khởi động).
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9345;
const BASE = 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-login-'));
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
  else if (m.method === 'Log.entryAdded' && m.params?.entry?.level === 'error') events.push('LOG: ' + m.params.entry.text);
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
const setInput = (sel, val) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; s.call(el, ${JSON.stringify(val)}); el.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);
const goto = async (path, wait = 1500) => { await send('Page.navigate', { url: BASE + path }); await sleep(wait); };

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  await goto('/login', 1800);
  await evaluate(`(() => {
    ['skillforge_skills','skillforge_timer_state','sf_accelerator_state','skillforge_motivation_state','sf_forge_stats','skillforge_log','skillforge_ai_interview']
      .forEach((k, i) => localStorage.setItem(k, JSON.stringify({ seed: i })));
    return true;
  })()`);

  // 1) Đăng ký mới + đăng nhập lại (đúng luồng đã chốt)
  await evaluate("document.querySelectorAll('.auth-tab')[1].click()");
  await sleep(300);
  await setInput('#reg-email', 'trungkien08072000@gmail.com');
  await setInput('#reg-password', 'MatKhau123');
  await setInput('#reg-confirm', 'MatKhau123');
  await evaluate("document.querySelector('.auth-check input').click()");
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(900);
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(700);
  check('đăng ký xong → tab Đăng nhập', await evaluate("document.querySelector('.auth-tab.active').textContent.trim()"), 'Đăng nhập');
  check('email điền sẵn', await evaluate("document.querySelector('#auth-email').value"), 'trungkien08072000@gmail.com');

  await setInput('#auth-password', 'MatKhau123');
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(1400);
  check('đăng nhập → hộp thoại nhập tiến độ', await evaluate("Boolean(document.querySelector('.import-overlay'))"), true);
  check('phiên đăng nhập đã lưu', await evaluate("Boolean(localStorage.getItem('sf_auth_session'))"), true);

  // 2) Nhập tiến độ → phải vào được web chính
  await evaluate("Array.from(document.querySelectorAll('.import-btn')).find((b) => b.textContent.includes('Nhập vào tài khoản này')).click()");
  await sleep(1500);
  check('nhập tiến độ → vào web chính', await evaluate('location.pathname'), '/');
  check('Trang chủ render', await evaluate("Boolean(document.querySelector('.home-page'))"), true);

  // 3) Tải lại trang (F5) khi đã đăng nhập — cổng chặn phải đọc được phiên
  await send('Page.reload');
  await sleep(2200);
  check('F5 khi đã đăng nhập → vẫn ở Trang chủ', await evaluate('location.pathname'), '/');
  check('F5 → Trang chủ render', await evaluate("Boolean(document.querySelector('.home-page'))"), true);

  // 4) Mở thẳng trang nội dung khác sau khi đăng nhập
  await goto('/podcast', 2200);
  check('mở thẳng /podcast → vào được', await evaluate('location.pathname'), '/podcast');
  check('/podcast render nội dung', await evaluate("document.body.innerText.length > 300"), true);

  await goto('/java/tu-zero', 2200);
  check('mở thẳng /java/tu-zero → vào được', await evaluate('location.pathname'), '/java/tu-zero');

  await goto('/dashboard', 2200);
  check('mở thẳng /dashboard → vào được', await evaluate('location.pathname'), '/dashboard');

  // 5) Không nhớ đăng nhập (phiên theo tab) vẫn phải vào được
  await goto('/login', 1800);
  await evaluate("Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Đăng xuất'))?.click()");
  await sleep(900);
  check('đăng xuất → về trang đăng nhập', await evaluate('location.pathname'), '/login');
  check('đăng xuất → hiện lại form đăng nhập', await evaluate("Boolean(document.querySelector('.auth-form'))"), true);
  await evaluate("document.querySelector('.auth-check input').click()");
  await setInput('#auth-email', 'trungkien08072000@gmail.com');
  await setInput('#auth-password', 'MatKhau123');
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(1400);
  if (await evaluate("Boolean(document.querySelector('.import-overlay'))")) {
    await evaluate("Array.from(document.querySelectorAll('.import-btn')).find((b) => b.textContent.includes('Bỏ qua')).click()");
    await sleep(1200);
  }
  check('không nhớ đăng nhập → vẫn vào web chính', await evaluate('location.pathname'), '/');
  check('phiên nằm ở sessionStorage', await evaluate("Boolean(sessionStorage.getItem('sf_auth_session'))"), true);
  await goto('/english', 2200);
  check('không nhớ đăng nhập + mở /english → vào được', await evaluate('location.pathname'), '/english');

  const errors = events.filter((e) => !e.includes('favicon'));
  const failed = results.filter((r) => !r).length;
  console.log(`\nLỗi JS/console: ${errors.length}`);
  errors.slice(0, 6).forEach((e) => console.log('  ' + e));
  console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS`);
  process.exitCode = failed ? 1 : 0;
} catch (err) {
  console.error('LỖI KIỂM CHỨNG:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
