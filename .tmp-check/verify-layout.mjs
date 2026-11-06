// Đo vị trí nút back so với khung nội dung ở các trang dùng CTopbar.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9336;
const BASE = 'http://localhost:8080';

const profile = mkdtempSync(join(tmpdir(), 'dsh-layout-'));
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
      // chờ
    }
    await sleep(250);
  }
  throw new Error('Không kết nối được Chrome CDP');
}

function createClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();
  const ready = new Promise((resolve, reject) => {
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
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  return { ready, send, close: () => ws.close() };
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error('Lỗi JS: ' + (result.exceptionDetails.exception?.description || result.exceptionDetails.text));
  return result.result.value;
}

const MEASURE = `(() => {
  const back = document.querySelector('a.back-link, .ez-back, .back-btn, .subpage-back, .ah-back, .ch-back, button.nav-btn, .dp-nav-btn, .tz-back');
  if (!back) return { error: 'không có nút back' };
  const b = back.getBoundingClientRect();
  // Khung nội dung: phần tử có max-width hữu hạn, diện tích lớn nhất (cột nội dung thật)
  const cands = Array.from(document.querySelectorAll('*')).filter((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.maxWidth !== 'none' && r.width >= 300 && r.height >= 100 && cs.position !== 'fixed';
  });
  let best = null;
  for (const el of cands) {
    const r = el.getBoundingClientRect();
    if (!best || r.width * r.height > best.area) best = { el, area: r.width * r.height, r };
  }
  const topbar = document.querySelector('.hub-topbar');
  const topbarRect = topbar ? topbar.getBoundingClientRect() : null;
  const contentRight = best ? Math.round(best.r.right) : null;
  const contentLeft = best ? Math.round(best.r.left) : null;
  return {
    backRight: Math.round(b.right),
    backTop: Math.round(b.top),
    backHeight: Math.round(b.height),
    backText: back.textContent.trim(),
    contentLeft,
    contentRight,
    contentWidth: best ? Math.round(best.r.width) : null,
    contentClass: best ? best.el.className : null,
    topbarWidth: topbarRect ? Math.round(topbarRect.width) : null,
    viewport: window.innerWidth,
    lechPhai: contentRight === null ? null : Math.round(b.right - contentRight),
  };
})()`;

try {
  const client = createClient(await getTarget());
  await client.ready;
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  const pages = ['/podcast', '/exam', '/english', '/dashboard', '/english/hub', '/cloud/iam', '/devops/docker', '/sentence-practice', '/learning-paths', '/skill-tracker', '/game-memory'];
  const VIEWPORTS = [1280, 390];
  for (const width of VIEWPORTS) {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    console.log(`\n=== viewport ${width}px — "lệch phải" = mép phải nút back − mép phải khung nội dung (px) ===`);
    for (const p of pages) {
      await client.send('Page.navigate', { url: BASE + p });
      await sleep(900);
      const m = await evaluate(client, MEASURE);
      if (m.error) {
        console.log(`${p.padEnd(24)} ${m.error}`);
        continue;
      }
      const flag = m.lechPhai === null ? '—' : (Math.abs(m.lechPhai) > 12 ? `LỆCH ${m.lechPhai}` : 'OK');
      console.log(`${p.padEnd(24)} nút="${m.backText}" | topbar=${m.topbarWidth}px | khung=${m.contentWidth}px (${m.contentLeft}→${m.contentRight}) | ${flag}`);
    }
  }

  client.close();
} catch (err) {
  console.error('LỖI:', err.message);
  process.exitCode = 2;
} finally {
  chrome.kill();
}
