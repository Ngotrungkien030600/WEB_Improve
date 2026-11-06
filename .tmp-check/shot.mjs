// Chụp ảnh thật các trang để xem có trắng/trống không + bắt lỗi tài nguyên 404.
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9340;
const BASE = process.env.SHOT_BASE || 'http://localhost:8080';
const OUT = 'C:\\Users\\Admin\\Downloads\\WEB_Improve\\.tmp-check';

const profile = mkdtempSync(join(tmpdir(), 'dsh-shot-'));
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

const wsUrl = await getTarget();
const ws = new WebSocket(wsUrl);
let nextId = 1;
const pending = new Map();
const failures = [];
const consoleErrors = [];
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
  } else if (msg.method === 'Network.loadingFailed') {
    failures.push(`${msg.params.type} ${msg.params.errorText}`);
  } else if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400) {
    failures.push(`HTTP ${msg.params.response.status} ${msg.params.response.url}`);
  } else if (msg.method === 'Runtime.exceptionThrown') {
    consoleErrors.push('EXCEPTION: ' + (msg.params?.exceptionDetails?.exception?.description || msg.params?.exceptionDetails?.text || ''));
  } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    consoleErrors.push('CONSOLE: ' + msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
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
  return result.result.value;
};

await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');

for (const path of ['/', '/login', '/register', '/dashboard']) {
  const started = Date.now();
  failures.length = 0;
  consoleErrors.length = 0;
  await send('Page.navigate', { url: BASE + path });
  await sleep(2500);
  const info = await evaluate(`JSON.stringify({
    path: location.pathname + location.search,
    title: document.title,
    textLen: (document.body.innerText || '').trim().length,
    htmlLen: document.body.innerHTML.length,
    rootChildren: document.getElementById('app') ? document.getElementById('app').children.length : -1,
    firstText: (document.body.innerText || '').trim().slice(0, 120)
  })`);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const name = path.replace(/[^a-z]/gi, '') || 'root';
  writeFileSync(join(OUT, `shot-${name}.png`), Buffer.from(shot.data, 'base64'));
  console.log(`\n=== ${path} (${Date.now() - started} ms) ===`);
  console.log(info);
  if (failures.length) console.log('Tài nguyên lỗi:', failures.join(' | '));
  if (consoleErrors.length) console.log('Lỗi console:', consoleErrors.join(' | '));
}

ws.close();
chrome.kill();
