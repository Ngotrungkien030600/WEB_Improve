// Đo màu chữ/nền thật của trang Phòng luyện code và tính độ tương phản WCAG, kèm ảnh chụp.
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = Number(process.env.SHOT_PORT || 9370);
const BASE = process.argv[2] || 'http://localhost:8080';
const TARGET = process.argv[3] || '/code-lab';
const profile = mkdtempSync(join(tmpdir(), 'dsh-labcolor-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--mute-audio', '--window-size=1280,900', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function target() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const p = list.find((t) => t.type === 'page');
      if (p?.webSocketDebuggerUrl) return p.webSocketDebuggerUrl;
    } catch (err) { /* chờ Chrome lên */ }
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

const SELECTORS = [
  '.page-topbar h1', '.page-topbar p', '.home-btn',
  '.score-strip', '.score-card', '.rank-card', '.score-emoji', '.score-value', '.score-key', '.progress-track',
  '.filter-search', '.filter-chip', '.list-count', '.problem-title', '.problem-meta', '.problem-points',
  '.panel-title-row h2', '.level-badge', '.panel-sub', '.tab', '.tab.active',
  '.block-title', '.desc-line', '.example-key', '.example-explain', '.test-table th', '.test-table td',
  '.hint-note', '.locked-box', '.lab-sidebar',
];

const toRgb = (value) => {
  const m = /rgba?\(([^)]+)\)/.exec(value || '');
  if (!m) return null;
  const parts = m[1].split(',').map((x) => parseFloat(x));
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
};
const lum = ({ r, g, b }) => {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (fg, bg) => {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: BASE + '/login' });
  await sleep(1300);
  await evaluate("localStorage.clear(); localStorage.setItem('sf_auth_session', JSON.stringify({ user: { id: 'diag', email: 'diag@example.com', displayName: 'diag', plan: 'free' } }))");
  await send('Page.navigate', { url: BASE + TARGET });
  await sleep(2600);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const out = '.tmp-check/lab-current.png';
  writeFileSync(out, Buffer.from(shot.data, 'base64'));
  console.log(`# ảnh: ${out}`);

  const rows = await evaluate(`(() => {
    const selectors = ${JSON.stringify(SELECTORS)};
    const bgOf = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        const parsed = /rgba?\\(([^)]+)\\)/.exec(bg);
        if (parsed) {
          const parts = parsed[1].split(',').map(Number);
          const alpha = parts.length > 3 ? parts[3] : 1;
          if (alpha > 0.05) return bg;
        }
        node = node.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    };
    return selectors.map((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, missing: true };
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        sel,
        text: (el.textContent || '').trim().slice(0, 40),
        color: cs.color,
        background: bgOf(el),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        border: cs.borderColor + ' / ' + cs.borderStyle + ' ' + cs.borderWidth,
        size: Math.round(rect.width) + 'x' + Math.round(rect.height)
      };
    });
  })()`);

  const problems = [];
  for (const row of rows) {
    if (row.missing) { console.log(`THIẾU   | ${row.sel}`); continue; }
    const fg = toRgb(row.color);
    const bg = toRgb(row.background);
    const ratio = fg && bg ? contrast(fg, bg) : 0;
    const big = parseFloat(row.fontSize) >= 18.66 || (parseFloat(row.fontSize) >= 14 && Number(row.fontWeight) >= 700);
    const need = big ? 3 : 4.5;
    const flag = ratio < need ? `KÉM (cần ${need})` : 'OK';
    if (ratio < need) problems.push(row.sel);
    console.log(`${flag.padEnd(12)} | ${row.sel.padEnd(22)} | ${ratio.toFixed(2).padStart(5)}:1 | chữ ${row.color.padEnd(20)} | nền ${row.background.padEnd(20)} | ${row.fontSize}/${row.fontWeight} | ${row.size} | "${row.text}"`);
  }
  console.log(`\n# selector tương phản kém: ${problems.length} -> ${problems.join(', ')}`);
  const unstyled = await evaluate(`(() => {
    const classes = ['container','page-topbar','topbar-left','topbar-right','home-btn','score-strip','score-card','rank-card','score-emoji','score-text','score-value','score-key','progress-card','progress-track','progress-fill'];
    return classes.map((name) => {
      const el = document.querySelector('.' + name);
      if (!el) return name + '=khong-co';
      const cs = getComputedStyle(el);
      return name + '=' + (cs.display === 'block' || cs.display === 'inline' ? 'MAC-DINH' : cs.display) + ',' + cs.borderStyle + ',' + cs.padding;
    });
  })()`);
  console.log('\n# class chưa có style (display mặc định, không viền, không padding):');
  console.log('   ' + unstyled.join('\n   '));
} finally {
  ws.close();
  chrome.kill();
}
