// Chẩn đoán: kích thước thật của hero/form + trạng thái sau khi đăng nhập.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9343;
const BASE = 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-diag-'));
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
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

await send('Page.enable');
await send('Runtime.enable');

await send('Page.navigate', { url: BASE + '/login' });
await sleep(2000);
console.log('LAYOUT:', await evaluate(`JSON.stringify((() => {
  const hero = document.querySelector('.auth-hero');
  const form = document.querySelector('#auth-form');
  const card = document.querySelector('.auth-card');
  const r = (el) => el ? { top: Math.round(el.getBoundingClientRect().top), abs: Math.round(el.getBoundingClientRect().top + window.scrollY), h: Math.round(el.getBoundingClientRect().height) } : null;
  return { scrollY: window.scrollY, innerH: window.innerHeight, docH: document.documentElement.scrollHeight, hero: r(hero), form: r(form), card: r(card) };
})())`));

await send('Page.navigate', { url: BASE + '/podcast' });
await sleep(1500);
console.log('SAU GUARD:', await evaluate('location.pathname + location.search'));
await evaluate("document.querySelectorAll('.auth-tab')[1].click()");
await sleep(300);
const setInput = (sel, val) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; s.call(el, ${JSON.stringify(val)}); el.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);
await setInput('#reg-email', 'diag@example.com');
await setInput('#reg-password', 'MatKhau123');
await setInput('#reg-confirm', 'MatKhau123');
await evaluate("document.querySelector('.auth-check input').click()");
await evaluate("document.querySelector('.auth-submit').click()");
await sleep(900);
await evaluate("document.querySelector('.auth-submit').click()");
await sleep(800);
console.log('SAU ONBOARDING:', await evaluate('location.pathname + location.search'));
console.log('next query:', await evaluate("new URLSearchParams(location.search).get('next')"));
console.log('localStorage keys:', await evaluate('JSON.stringify(Object.keys(localStorage))'));
await setInput('#auth-password', 'MatKhau123');
await evaluate("document.querySelector('.auth-submit').click()");
await sleep(1500);
console.log('SAU DANG NHAP:', await evaluate('location.pathname + location.search'));
console.log('có hộp thoại nhập tiến độ:', await evaluate("document.body.innerText.includes('Nhập tiến độ trên máy này')"));
console.log('nội dung đầu trang:', JSON.stringify(await evaluate("document.body.innerText.slice(0, 200)")));

ws.close();
chrome.kill();
