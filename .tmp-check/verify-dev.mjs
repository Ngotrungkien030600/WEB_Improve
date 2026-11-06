// Tái hiện lỗi trên DEV server 5173: sau khi đăng nhập bấm "Vào web ngay" -> trang trắng?
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9347;
const BASE = process.argv[2] || 'http://localhost:5173';
const profile = mkdtempSync(join(tmpdir(), 'dsh-dev-'));
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
const failedRequests = [];
await new Promise((res) => ws.addEventListener('open', res));
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  else if (m.method === 'Runtime.exceptionThrown') {
    events.push('EXCEPTION: ' + (m.params?.exceptionDetails?.exception?.description || m.params?.exceptionDetails?.text || ''));
  } else if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) {
    events.push(m.params.type.toUpperCase() + ': ' + m.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
  } else if (m.method === 'Log.entryAdded' && m.params?.entry?.level === 'error') {
    events.push('LOG: ' + m.params.entry.text);
  } else if (m.method === 'Network.loadingFailed') {
    failedRequests.push(`${m.params.type} ${m.params.errorText}`);
  } else if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) {
    failedRequests.push(`HTTP ${m.params.response.status} ${m.params.response.url}`);
  }
});
const send = (method, params = {}) => new Promise((res) => { const i = id++; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
const setInput = (sel, val) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return 'KHONG_THAY'; const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; s.call(el, ${JSON.stringify(val)}); el.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);

await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
await send('Network.enable');

console.log(`=== DEV server: ${BASE} ===`);

// Đăng ký + đăng nhập qua UI (không có tiến độ -> vào thẳng web)
await send('Page.navigate', { url: BASE + '/register' });
await sleep(2500);
await evaluate("document.querySelectorAll('.auth-tab')[1]?.click()");
await sleep(400);
await setInput('#reg-email', 'devtest@example.com');
await setInput('#reg-password', 'MatKhau123');
await setInput('#reg-confirm', 'MatKhau123');
await evaluate("document.querySelector('.auth-check input')?.click()");
await evaluate("document.querySelector('.auth-submit')?.click()");
await sleep(1200);
await evaluate("document.querySelector('.auth-submit')?.click()");
await sleep(1000);
await setInput('#auth-password', 'MatKhau123');
await evaluate("document.querySelector('.auth-submit')?.click()");
await sleep(2000);
console.log('sau đăng nhập:', await evaluate('location.pathname + location.search'));
console.log('panel hiện:', await evaluate("document.body.innerText.includes('Bạn đã đăng nhập')"));
console.log('form ẩn:', await evaluate("document.querySelector('#auth-password') === null"));

// Bấm "Vào web ngay" (nếu còn) và ghi lại TOÀN BỘ lỗi từ đầu
const clicked = await evaluate(`(() => {
  const b = Array.from(document.querySelectorAll('.auth-submit')).find((x) => x.textContent.includes('Vào web ngay'));
  if (!b) return 'KHONG_THAY_NUT';
  b.click();
  return 'DA_CLICK';
})()`);
console.log('bấm "Vào web ngay":', clicked);
await sleep(3000);
console.log('URL sau khi bấm:', await evaluate('location.pathname + location.search'));
console.log('số phần tử trong #app:', await evaluate("document.getElementById('app')?.children.length ?? -1"));
console.log('độ dài chữ trên trang:', await evaluate("document.body.innerText.trim().length"));
console.log('có .home-page:', await evaluate("Boolean(document.querySelector('.home-page'))"));
console.log('có overlay lỗi của Vite:', await evaluate("Boolean(document.querySelector('vite-error-overlay'))"));
console.log('ảnh chụp HTML #app:', JSON.stringify(await evaluate("document.getElementById('app')?.innerHTML.slice(0, 300) ?? ''")));

// Mở thẳng / một lần nữa để chắc chắn
await send('Page.navigate', { url: BASE + '/' });
await sleep(3000);
console.log('\n--- Mở thẳng / ---');
console.log('URL:', await evaluate('location.pathname'));
console.log('số phần tử trong #app:', await evaluate("document.getElementById('app')?.children.length ?? -1"));
console.log('độ dài chữ:', await evaluate("document.body.innerText.trim().length"));

if (failedRequests.length) console.log('\nYêu cầu lỗi:\n  ' + failedRequests.slice(0, 15).join('\n  '));
if (events.length) console.log('\nLỗi JS:\n  ' + events.slice(0, 10).join('\n  '));
else console.log('\nKhông có lỗi JS nào được ghi nhận.');

ws.close();
chrome.kill();
