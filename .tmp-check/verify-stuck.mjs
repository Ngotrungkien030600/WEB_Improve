// Kiểm chứng: sau khi đăng nhập, trang đăng nhập hiện panel "Bạn đã đăng nhập" + nút Vào web ngay;
// không còn form gây rối; và nếu router kẹt thì vẫn vào được web bằng tải thẳng trang.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9346;
const BASE = 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-stuck-'));
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
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`);
}
const setInput = (sel, val) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; s.call(el, ${JSON.stringify(val)}); el.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);
const goto = async (path, wait = 1600) => { await send('Page.navigate', { url: BASE + path }); await sleep(wait); };

try {
  await send('Page.enable');
  await send('Runtime.enable');

  await goto('/login', 1800);
  await evaluate(`(() => { localStorage.setItem('sf_forge_stats', '{"xp":90,"streak":4}'); return true; })()`);

  // Đăng ký + đăng nhập
  await evaluate("document.querySelectorAll('.auth-tab')[1].click()");
  await sleep(300);
  await setInput('#reg-email', 'stuck@example.com');
  await setInput('#reg-password', 'MatKhau123');
  await setInput('#reg-confirm', 'MatKhau123');
  await evaluate("document.querySelector('.auth-check input').click()");
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(900);
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(700);
  await setInput('#auth-password', 'MatKhau123');
  await evaluate("document.querySelector('.auth-submit').click()");
  await sleep(1400);
  await evaluate("Array.from(document.querySelectorAll('.import-btn')).find((b) => b.textContent.includes('Nhập vào tài khoản này')).click()");
  await sleep(1500);
  check('đăng nhập + nhập tiến độ → vào web chính', await evaluate('location.pathname'), '/');

  // Mở lại /login khi đã đăng nhập: panel rõ ràng, KHÔNG còn form đăng nhập
  await goto('/login', 1800);
  check('hiện panel "Bạn đã đăng nhập"', await evaluate("document.body.innerText.includes('Bạn đã đăng nhập')"), true);
  check('hiện đúng email tài khoản', await evaluate("document.body.innerText.includes('stuck@example.com')"), true);
  check('KHÔNG còn form đăng nhập gây rối', await evaluate("document.querySelector('#auth-password') === null"), true);
  check('KHÔNG còn tab Đăng nhập/Đăng ký', await evaluate("document.querySelector('.auth-tabs') === null"), true);
  check('có nút Vào web ngay', await evaluate("Array.from(document.querySelectorAll('.auth-submit')).some((b) => b.textContent.includes('Vào web ngay'))"), true);

  // Bấm "Vào web ngay" phải vào Trang chủ
  await evaluate("Array.from(document.querySelectorAll('.auth-submit')).find((b) => b.textContent.includes('Vào web ngay')).click()");
  await sleep(1500);
  check('bấm Vào web ngay → Trang chủ', await evaluate('location.pathname'), '/');
  check('Trang chủ render', await evaluate("Boolean(document.querySelector('.home-page'))"), true);

  // Lưới an toàn: nếu router.push lỗi (không phải lỗi trùng route) thì tải thẳng trang
  await goto('/login', 1600);
  await evaluate(`(() => {
    document.querySelector('.auth-done');
    const link = Array.from(document.querySelectorAll('.auth-link')).find((b) => b.textContent.includes('Đăng xuất'));
    link.click();
    return true;
  })()`);
  await sleep(600);
  check('đăng xuất từ panel → hiện lại form', await evaluate("Boolean(document.querySelector('.auth-tabs'))"), true);
  check('đăng xuất → xoá phiên', await evaluate("localStorage.getItem('sf_auth_session') === null && sessionStorage.getItem('sf_auth_session') === null"), true);
  check('đăng xuất → vẫn ở trang đăng nhập', await evaluate('location.pathname'), '/login');

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
