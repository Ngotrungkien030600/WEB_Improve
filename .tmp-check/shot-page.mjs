// Chụp ảnh 1 trang đã đăng nhập + đo bố cục (tràn ngang, phần tử đè lên nhau, phần tử nổi).
// Dùng: node .tmp-check/shot-page.mjs /frontend/ui-interview [base] [outName]
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = Number(process.env.SHOT_PORT || 9352);
const BASE = process.argv[3] || process.env.SHOT_BASE || 'http://localhost:8080';
const ROUTE = process.argv[2] || '/frontend/ui-interview';
const OUT = 'C:\\Users\\Admin\\Downloads\\WEB_Improve\\.tmp-check';
const NAME = process.argv[4] || ROUTE.replace(/[^a-z0-9]/gi, '-').replace(/^-|-$/g, '');

const profile = mkdtempSync(join(tmpdir(), 'dsh-shotpage-'));
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
await new Promise((res) => ws.addEventListener('open', res));
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  else if (m.method === 'Network.responseReceived' && m.params.response.status >= 400 && !m.params.response.url.includes('favicon')) bad.push(`HTTP ${m.params.response.status} ${m.params.response.url.replace(BASE, '')}`);
});
const send = (method, params = {}) => new Promise((res) => { const i = id++; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};

try {
  await send('Page.enable');
  await send('Network.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: BASE + '/login' });
  await sleep(1500);
  await evaluate(`localStorage.setItem('sf_auth_session', JSON.stringify({ user: { id: 'shot-user', email: 'shot@example.com', displayName: 'shot', plan: 'free', createdAt: Date.now() } }))`);
  bad.length = 0;
  await send('Page.navigate', { url: BASE + ROUTE });
  await sleep(3200);

  if (process.env.SHOT_CLICK) {
    for (const selector of process.env.SHOT_CLICK.split(',')) {
      await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector.trim())}); if (el) el.click(); return Boolean(el); })()`);
      await sleep(700);
    }
  }

  const report = JSON.parse(await evaluate(`JSON.stringify((() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const root = document.querySelector('#app')?.firstElementChild;
    const all = Array.from(document.querySelectorAll('body *'));
    const overflow = all.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > vw + 1 || r.left < -1);
    }).slice(0, 12).map((el) => el.className || el.tagName);

    const boxes = all.map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { el, r, cs };
    }).filter((b) => b.r.width > 40 && b.r.height > 20 && b.cs.visibility !== 'hidden' && b.cs.display !== 'none');

    const overlaps = [];
    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const a = boxes[i];
        const b = boxes[j];
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
        const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (w <= 4 || h <= 4) continue;
        const area = w * h;
        const small = Math.min(a.r.width * a.r.height, b.r.width * b.r.height);
        if (area / small > 0.25 && area > 2500) {
          overlaps.push({
            a: (a.el.className || a.el.tagName).toString().slice(0, 60),
            b: (b.el.className || b.el.tagName).toString().slice(0, 60),
            ratio: Math.round((area / small) * 100),
          });
        }
      }
    }

    return {
      path: location.pathname,
      title: document.title,
      rootClass: root ? root.className : null,
      viewport: [vw, vh],
      docHeight: document.documentElement.scrollHeight,
      horizScroll: document.documentElement.scrollWidth > vw + 1,
      textLen: document.body.innerText.trim().length,
      topText: document.body.innerText.trim().slice(0, 160),
      overflow,
      overlaps: overlaps.slice(0, 12),
      floating: all.filter((el) => {
        const cs = getComputedStyle(el);
        return (cs.position === 'fixed' || cs.position === 'absolute') && el.getBoundingClientRect().width > 80;
      }).slice(0, 12).map((el) => {
        const r = el.getBoundingClientRect();
        return { cls: (el.className || el.tagName).toString().slice(0, 50), pos: getComputedStyle(el).position, z: getComputedStyle(el).zIndex, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] };
      })
    };
  })())`));

  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  writeFileSync(join(OUT, `page-${NAME}.png`), Buffer.from(shot.data, 'base64'));

  console.log(JSON.stringify(report, null, 2));
  if (bad.length) console.log('Tài nguyên lỗi:', [...new Set(bad)].slice(0, 6).join(' | '));
  console.log('Ảnh:', join(OUT, `page-${NAME}.png`));
  console.log('URL:', BASE + ROUTE);
} catch (err) {
  console.error('LỖI:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
