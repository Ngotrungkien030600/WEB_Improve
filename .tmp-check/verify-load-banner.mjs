// Kiểm chứng lưới an toàn: khi tải mã thất bại lần nữa trong thời gian chờ, phải hiện băng báo
// kèm nút "Tải lại trang" thay vì im lặng (trước đây bấm menu mà màn hình đứng yên).
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9351;
const BASE = process.argv[2] || 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-banner-'));
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
await new Promise((res) => ws.addEventListener('open', res));
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
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

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: BASE + '/login' });
  await sleep(3000);

  // Giả lập: đã vừa thử tải lại 1 lần (còn trong thời gian chờ) và mã lại tải thất bại
  const before = await evaluate("Boolean(document.getElementById('sf-load-error'))");
  check('trước khi lỗi: chưa có băng', before, false);

  await evaluate(`(() => {
    sessionStorage.setItem('sf_chunk_reload_at', String(Date.now()));
    Promise.reject(new Error('Failed to fetch dynamically imported module: ${BASE}/assets/x.js'));
    return 'ok';
  })()`);
  await sleep(900);

  const banner = JSON.parse(await evaluate(`JSON.stringify((() => {
    const box = document.getElementById('sf-load-error');
    if (!box) return { ok: false };
    const btn = box.querySelector('button');
    const cs = getComputedStyle(box);
    const rect = box.getBoundingClientRect();
    return {
      ok: true,
      text: box.textContent.trim(),
      role: box.getAttribute('role'),
      button: btn ? btn.textContent.trim() : '',
      position: cs.position,
      zIndex: cs.zIndex,
      insideViewport: rect.top >= 0 && rect.bottom <= window.innerHeight + 1,
      stillRendersApp: Boolean(document.querySelector('.auth-hero'))
    };
  })())`));
  check('hiện băng báo lỗi tải mã', banner.ok, true);
  check('băng có vai trò alert', banner.role, 'alert');
  check('băng nói rõ nguyên nhân', banner.text.includes('Không tải được trang này'), true);
  check('có nút Tải lại trang', banner.button, 'Tải lại trang');
  check('băng cố định trên màn hình', banner.position, 'fixed');
  check('băng nằm trong màn hình', banner.insideViewport, true);
  check('ứng dụng vẫn render bình thường', banner.stillRendersApp, true);

  // Bấm nút → tải lại thật (mất băng, trang dựng lại)
  await evaluate("document.querySelector('#sf-load-error button').click()");
  await sleep(2500);
  check('bấm Tải lại trang → tải lại và dựng lại app', await evaluate("Boolean(document.querySelector('.auth-hero')) && !document.getElementById('sf-load-error')"), true);

  const failed = results.filter((r) => !r).length;
  console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS  (cổng: ${BASE})`);
  process.exitCode = failed ? 1 : 0;
} catch (err) {
  console.error('LỖI KIỂM CHỨNG:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
