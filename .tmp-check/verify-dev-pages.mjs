// Kiểm chứng trên DEV server: các trang import @legacy phải tải được (trước đây bị 403),
// không còn bấm menu mà màn hình đứng yên, và không hiện băng lỗi tải mã.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9350;
const BASE = process.argv[2] || 'http://localhost:5173';
const profile = mkdtempSync(join(tmpdir(), 'dsh-pages-'));
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
const bad = [];
const events = [];
await new Promise((res) => ws.addEventListener('open', res));
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  else if (m.method === 'Network.responseReceived') {
    const r = m.params.response;
    if (r.status >= 400 && !r.url.includes('favicon')) bad.push(`HTTP ${r.status} ${r.url.replace(BASE, '')}`);
  } else if (m.method === 'Runtime.exceptionThrown') {
    events.push(m.params?.exceptionDetails?.exception?.description?.split('\n')[0] || m.params?.exceptionDetails?.text || '');
  }
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
const setInput = (sel, val) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return 'KHONG_THAY'; const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; s.call(el, ${JSON.stringify(val)}); el.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);

try {
  await send('Page.enable');
  await send('Network.enable');
  await send('Runtime.enable');

  // Đăng ký + đăng nhập
  await send('Page.navigate', { url: BASE + '/register' });
  await sleep(3000);
  await evaluate("document.querySelectorAll('.auth-tab')[1]?.click()");
  await sleep(400);
  await setInput('#reg-email', 'devpages@example.com');
  await setInput('#reg-password', 'MatKhau123');
  await setInput('#reg-confirm', 'MatKhau123');
  await evaluate("document.querySelector('.auth-check input')?.click()");
  await evaluate("document.querySelector('.auth-submit')?.click()");
  await sleep(1200);
  await evaluate("document.querySelector('.auth-submit')?.click()");
  await sleep(1000);
  await setInput('#auth-password', 'MatKhau123');
  await evaluate("document.querySelector('.auth-submit')?.click()");
  await sleep(2200);
  if (await evaluate("Boolean(document.querySelector('.import-overlay'))")) {
    await evaluate("Array.from(document.querySelectorAll('.import-btn')).find((b) => b.textContent.includes('Bỏ qua')).click()");
    await sleep(1500);
  }
  check('đăng nhập vào Trang chủ', await evaluate("Boolean(document.querySelector('.home-page'))"), true);

  // Bấm từng mục trong menu tài khoản — trước đây màn hình đứng yên
  await evaluate("document.querySelector('.acct-trigger').click()");
  await sleep(400);
  await evaluate("Array.from(document.querySelectorAll('.acct-item')).find((b) => b.textContent.includes('Dashboard')).click()");
  await sleep(2500);
  check('menu → Dashboard: URL đổi', await evaluate('location.pathname'), '/dashboard');
  check('menu → Dashboard: nội dung hiện ra', (await evaluate("document.body.innerText.trim().length")) > 300, true);

  // Các trang nặng import @legacy (trước đây 403 ở dev)
  const routes = ['/ai', '/interview', '/salary-interview', '/bmad-agents', '/accelerator', '/code-learn', '/java/thuc-chien', '/sentence-practice', '/exam', '/game-memory', '/skill-tracker'];
  const markers = { '/game-memory': '.game-card' };
  for (const route of routes) {
    bad.length = 0;
    await send('Page.navigate', { url: BASE + route });
    await sleep(2600);
    const selector = markers[route];
    const state = JSON.parse(await evaluate(`JSON.stringify({
      path: location.pathname,
      children: document.getElementById('app')?.children.length ?? -1,
      text: document.body.innerText.trim().length,
      marker: ${selector ? `document.querySelectorAll(${JSON.stringify(selector)}).length` : 'null'},
      banner: Boolean(document.getElementById('sf-load-error'))
    })`));
    const loaded = state.path === route && state.children > 0 && state.text > 100 && !state.banner
      && (selector ? state.marker > 0 : true);
    check(`trang ${route} tải được trên dev`, loaded, true);
    if (!loaded) console.log(`      chi tiết: ${JSON.stringify(state)} | lỗi mạng: ${bad.slice(0, 3).join(' ; ') || 'không'}`);
    if (bad.length) console.log(`      HTTP lỗi: ${bad.slice(0, 3).join(' ; ')}`);
  }

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
