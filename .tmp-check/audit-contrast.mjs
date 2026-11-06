// Quét độ tương phản thật trên nhiều trang: tìm chữ không đọc được trên nền tối.
// Có pha trộn nền trong suốt (alpha) theo chuỗi tổ tiên nên số đo đúng với mắt nhìn.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = Number(process.env.SHOT_PORT || 9371);
const BASE = process.argv[2] || 'http://localhost:8080';
const ROUTES = (process.argv[3] || '/code-lab').split(',');
const profile = mkdtempSync(join(tmpdir(), 'dsh-contrast-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--mute-audio', '--window-size=1440,1000', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
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

const PROBE = `(() => {
  const parse = (value) => {
    const m = /rgba?\\(([^)]+)\\)/.exec(value || '');
    if (!m) return null;
    const p = m[1].split(',').map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1
  });
  const effectiveBg = (el) => {
    const chain = [];
    let node = el;
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0.001) chain.push(c);
      node = node.parentElement;
    }
    let acc = parse(getComputedStyle(document.body).backgroundColor) || { r: 12, g: 10, b: 29, a: 1 };
    for (let i = chain.length - 1; i >= 0; i -= 1) acc = over(chain[i], acc);
    return acc;
  };
  const lum = ({ r, g, b }) => {
    const f = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (fg, bg) => {
    const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
    return (a + 0.05) / (b + 0.05);
  };
  const path = (el) => {
    const parts = [];
    let node = el;
    while (node && node.tagName !== 'BODY' && parts.length < 4) {
      let part = node.tagName.toLowerCase();
      if (node.className && typeof node.className === 'string') part += '.' + node.className.trim().split(/\\s+/).slice(0, 2).join('.');
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };
  const bad = [];
  const gradient = [];
  let checked = 0;
  document.querySelectorAll('body *').forEach((el) => {
    const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.15) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;
    const fg = parse(cs.color);
    if (!fg) return;
    // Nền là ảnh/gradient thì không suy ra được màu nền từ backgroundColor → bỏ qua, cần xem ảnh
    if (cs.backgroundImage && cs.backgroundImage !== 'none') {
      gradient.push({ sel: path(el), text: (el.textContent || '').trim().slice(0, 44) });
      return;
    }
    const bg = effectiveBg(el);
    checked += 1;
    const r = ratio(fg, bg);
    const size = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    if (r < need) {
      bad.push({
        sel: path(el),
        text: (el.textContent || '').trim().slice(0, 44),
        ratio: Number(r.toFixed(2)),
        need,
        color: cs.color,
        bg: 'rgb(' + Math.round(bg.r) + ', ' + Math.round(bg.g) + ', ' + Math.round(bg.b) + ')',
        font: cs.fontSize + '/' + cs.fontWeight
      });
    }
  });
  return { checked, bad, gradient: gradient.length };
})()`;

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: BASE + '/login' });
  await sleep(1300);
  await evaluate("localStorage.clear(); localStorage.setItem('sf_auth_session', JSON.stringify({ user: { id: 'audit', email: 'audit@example.com', displayName: 'audit', plan: 'free' } }))");

  let totalBad = 0;
  for (const route of ROUTES) {
    await send('Page.navigate', { url: BASE + route });
    await sleep(2200);
    const { checked, bad, gradient } = await evaluate(PROBE);
    totalBad += bad.length;
    const mark = bad.length ? `❌ ${bad.length} chỗ kém` : '✅ đạt';
    console.log(`\n=== ${route} — ${checked} phần tử có chữ (bỏ qua ${gradient} chỗ nền gradient), ${mark}`);
    bad.slice(0, 12).forEach((row) => {
      console.log(`   ${String(row.ratio).padStart(5)}:1 (cần ${row.need}) | ${row.font} | ${row.sel}`);
      console.log(`         chữ ${row.color} trên nền ${row.bg} | "${row.text}"`);
    });
    if (bad.length > 12) console.log(`   ... còn ${bad.length - 12} chỗ nữa`);
  }
  console.log(`\nTỔNG chỗ tương phản kém: ${totalBad}`);
  process.exitCode = totalBad ? 1 : 0;
} finally {
  ws.close();
  chrome.kill();
}
