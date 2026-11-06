// Soi trạng thái giao diện Phòng luyện code khi giả lập màn hình điện thoại.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9367;
const BASE = process.argv[2] || 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-diagm-'));
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
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
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

for (const width of [390, 420, 700, 899, 900, 901, 1280]) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 820, deviceScaleFactor: 2, mobile: width <= 420 });
  await sleep(700);
  const info = await evaluate(`JSON.stringify((() => {
    const bar = document.querySelector('.mobile-bar');
    const button = document.querySelector('.mobile-bar button');
    const sidebar = document.querySelector('.lab-sidebar');
    return {
      innerWidth: window.innerWidth,
      clientWidth: document.documentElement.clientWidth,
      matches900: window.matchMedia('(max-width: 900px)').matches,
      barExists: Boolean(bar),
      buttonText: button ? button.textContent.trim() : 'KHONG_CO_NUT',
      barDisplay: bar ? getComputedStyle(bar).display : 'khong-co-bar',
      sidebarClass: sidebar ? sidebar.className : 'khong-co',
      sidebarDisplay: sidebar ? getComputedStyle(sidebar).display : 'khong-co',
      editorHeight: Math.round(document.querySelector('.editor-scroll').getBoundingClientRect().height),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1
    };
  })())`);
  console.log(`width=${width}`, info);
}
await send('Emulation.clearDeviceMetricsOverride');
ws.close();
chrome.kill();
