// Soi vì sao bấm "Chạy thử" không ra kết quả.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9366;
const BASE = process.argv[2] || 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-diagcl-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--mute-audio', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function target() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (err) { /* chờ */ }
    await sleep(250);
  }
  throw new Error('no chrome');
}

const ws = new WebSocket(await target());
let id = 1;
const pending = new Map();
await new Promise((res) => ws.addEventListener('open', res));
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); return; }
  if (m.method === 'Runtime.exceptionThrown') console.log('  [JS ERROR]', m.params?.exceptionDetails?.exception?.description?.split('\n').slice(0, 3).join(' | '));
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params?.type)) {
    console.log(`  [console.${m.params.type}]`, (m.params.args || []).map((a) => a.value ?? a.description).join(' ').slice(0, 300));
  }
});
const send = (method, params = {}) => new Promise((res) => { const i = id++; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) return `EXC: ${r.exceptionDetails.exception?.description?.split('\n')[0]}`;
  return r.result.value;
};

await send('Page.enable');
await send('Runtime.enable');
await send('Page.navigate', { url: `${BASE}/login` });
await sleep(1500);
await evaluate("localStorage.clear(); localStorage.setItem('sf_auth_session', JSON.stringify({ user: { id: 'lab', email: 'lab@example.com', displayName: 'lab', plan: 'free' } }))");
await send('Page.navigate', { url: `${BASE}/code-lab` });
await sleep(3000);

console.log('nút trong thanh công cụ:');
console.log(' ', await evaluate("Array.from(document.querySelectorAll('.editor-toolbar button')).map((b) => `${b.className}:${b.textContent.trim()}:disabled=${b.disabled}`).join(' || ')"));

const clicked = await evaluate(`(() => {
  const btn = Array.from(document.querySelectorAll('.editor-toolbar button')).find((b) => b.textContent.includes('Chạy thử'));
  if (!btn) return 'KHONG_THAY';
  btn.click();
  return 'da bam';
})()`);
console.log('bấm Chạy thử →', clicked);

for (let i = 0; i < 14; i += 1) {
  await sleep(1000);
  const state = await evaluate(`JSON.stringify({
    result: Boolean(document.querySelector('.result-box')),
    verdict: document.querySelector('.result-verdict') ? document.querySelector('.result-verdict').textContent.trim() : '',
    error: document.querySelector('.result-error') ? document.querySelector('.result-error').textContent.trim().slice(0, 160) : '',
    running: document.querySelector('.run-btn').disabled,
    chip: document.querySelector('.timer-chip').textContent.trim(),
    rows: document.querySelectorAll('.test-row').length
  })`);
  console.log(`+${i + 1}s`, state);
  if (JSON.parse(state).result) break;
}

console.log('thuộc tính editor:', await evaluate("JSON.stringify({ value: (document.querySelector('.editor-input')||{}).value?.slice(0,60), readOnly: (document.querySelector('.editor-input')||{}).readOnly })"));
ws.close();
chrome.kill();
