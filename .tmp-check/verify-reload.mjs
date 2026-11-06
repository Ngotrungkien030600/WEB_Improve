// Kiểm chứng bản vá chống màn hình trắng: khi chunk cũ 404 (tab mở từ build trước) phải tự tải lại trang.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9341;
const BASE = 'http://localhost:8080';

const profile = mkdtempSync(join(tmpdir(), 'dsh-reload-'));
const chrome = spawn(
  CHROME,
  ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--mute-audio', '--window-size=1280,900', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'],
  { stdio: 'ignore' },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (err) {
      // chờ Chrome
    }
    await sleep(250);
  }
  throw new Error('Không kết nối được Chrome CDP');
}

const ws = new WebSocket(await getTarget());
let nextId = 1;
const pending = new Map();
const reloads = [];
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve);
  ws.addEventListener('error', () => reject(new Error('WS lỗi')));
});
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  } else if (msg.method === 'Page.frameNavigated' && msg.params.frame.parentId === undefined) {
    reloads.push(msg.params.frame.url);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
};

const results = [];
function check(name, actual, expected) {
  const pass = actual === expected;
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`);
}

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: BASE + '/' });
  await sleep(2000);
  check('trang chủ render bình thường', await evaluate("Boolean(document.querySelector('.auth-page'))"), true);

  const before = reloads.length;
  await evaluate("window.dispatchEvent(new Event('vite:preloadError', { cancelable: true }))");
  await sleep(2500);
  check('chunk lỗi → tự tải lại trang', reloads.length > before, true);
  check('đã ghi dấu chống lặp vô hạn', await evaluate("Boolean(sessionStorage.getItem('sf_chunk_reload_at'))"), true);
  check('sau khi tải lại vẫn render', await evaluate("Boolean(document.querySelector('.auth-page'))"), true);

  const before2 = reloads.length;
  await evaluate("window.dispatchEvent(new Event('vite:preloadError', { cancelable: true }))");
  await sleep(1500);
  check('lỗi lặp lại ngay → KHÔNG tải lại liên tục', reloads.length === before2, true);

  const failed = results.filter((r) => !r).length;
  console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS`);
  process.exitCode = failed ? 1 : 0;
} catch (err) {
  console.error('LỖI KIỂM CHỨNG:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
