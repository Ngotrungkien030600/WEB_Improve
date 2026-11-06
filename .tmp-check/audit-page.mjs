// Soi kỹ một trang: liệt kê khối, chữ bị cắt, tương phản màu thấp, phần tử tràn.
// Dùng: node .tmp-check/audit-page.mjs /frontend/ui-interview [base]
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = Number(process.env.SHOT_PORT || 9353);
const BASE = process.argv[3] || 'http://localhost:8080';
const ROUTE = process.argv[2] || '/';

const profile = mkdtempSync(join(tmpdir(), 'dsh-audit-'));
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

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: BASE + '/login' });
  await sleep(1500);
  await evaluate(`localStorage.setItem('sf_auth_session', JSON.stringify({ user: { id: 'audit', email: 'audit@example.com', displayName: 'audit', plan: 'free' } }))`);
  await send('Page.navigate', { url: BASE + ROUTE });
  await sleep(3000);

  const out = JSON.parse(await evaluate(`JSON.stringify((() => {
    const parse = (c) => {
      const m = (c || '').match(/rgba?\\(([^)]+)\\)/);
      if (!m) return null;
      const p = m[1].split(',').map((v) => parseFloat(v));
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };
    const lum = (c) => {
      const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    };
    const bgOf = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0.5) return c;
        node = node.parentElement;
      }
      return parse(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
    };
    const ratio = (a, b) => {
      const l1 = lum(a);
      const l2 = lum(b);
      const hi = Math.max(l1, l2);
      const lo = Math.min(l1, l2);
      return Math.round(((hi + 0.05) / (lo + 0.05)) * 10) / 10;
    };

    const blocks = [];
    const clipped = [];
    const lowContrast = [];
    const nodes = Array.from(document.querySelectorAll('#app > *, #app > * *'));
    for (const el of nodes) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const cls = (el.className || el.tagName).toString().replace(/\\s+/g, '.').slice(0, 48);
      const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').slice(0, 40);
      if (r.width > 30 && r.height > 8) {
        blocks.push({
          cls,
          box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
          fs: cs.fontSize,
          color: cs.color,
          bg: cs.backgroundColor,
          pos: cs.position,
          z: cs.zIndex,
          ov: cs.overflow,
          txt: own
        });
      }
      if (el.scrollHeight > el.clientHeight + 3 && cs.overflowY !== 'visible' && el.clientHeight > 0) {
        clipped.push({ cls, client: el.clientHeight, scroll: el.scrollHeight, ov: cs.overflowY });
      }
      if (own.length > 3) {
        const fg = parse(cs.color);
        const bg = bgOf(el);
        if (fg && bg) {
          if (fg.a < 0.85) {
            lowContrast.push({ cls, ratio: 'mờ ' + fg.a, color: cs.color, bg: 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')', txt: own });
          } else {
            const cr = ratio(fg, bg);
            if (cr < 3) lowContrast.push({ cls, ratio: cr, color: cs.color, bg: 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')', txt: own });
          }
        }
      }
    }
    return {
      path: location.pathname,
      viewport: [window.innerWidth, window.innerHeight],
      docHeight: document.documentElement.scrollHeight,
      blocks: blocks.slice(0, 70),
      clipped,
      lowContrast
    };
  })())`));

  console.log(`\n=== ${out.path} | khung nhìn ${out.viewport.join('x')} | cao ${out.docHeight}px ===`);
  console.log('\n-- Khối (x, y, w, h | cỡ chữ | màu | nền) --');
  for (const b of out.blocks) {
    console.log(`  ${b.cls.padEnd(34)} ${String(b.box.join(',')).padEnd(22)} fs=${b.fs.padEnd(6)} ${b.pos.padEnd(8)} z=${String(b.z).padEnd(5)} ${b.color} | ${b.bg}${b.txt ? ' | "' + b.txt + '"' : ''}`);
  }
  console.log('\n-- Chữ bị cắt --');
  console.log(out.clipped.length ? out.clipped.map((c) => `  ${c.cls}: hiện ${c.client}px / cần ${c.scroll}px (${c.ov})`).join('\n') : '  (không có)');
  console.log('\n-- Tương phản thấp (khó đọc) --');
  console.log(out.lowContrast.length ? out.lowContrast.map((c) => `  ${c.cls}: ${c.ratio}:1 ${c.color} trên ${c.bg} — "${c.txt}"`).join('\n') : '  (không có)');
} catch (err) {
  console.error('LỖI:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
