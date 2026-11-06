// Kiểm chứng: trang đăng nhập là TRANG ĐẦU TIÊN; giới thiệu ở trên, form ở dưới cùng; chưa đăng nhập thì chặn nội dung.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9342;
const BASE = 'http://localhost:8080';

const profile = mkdtempSync(join(tmpdir(), 'dsh-entry-'));
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
const events = [];
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
  } else if (msg.method === 'Runtime.exceptionThrown') {
    events.push('EXCEPTION: ' + (msg.params?.exceptionDetails?.exception?.description || msg.params?.exceptionDetails?.text || ''));
  } else if (msg.method === 'Log.entryAdded' && msg.params?.entry?.level === 'error') {
    events.push('LOG: ' + msg.params.entry.text);
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

async function goto(path) {
  await send('Page.navigate', { url: BASE + path });
  await sleep(1400);
}

const setInput = (selector, value) => `(() => {
  const el = document.querySelector(${JSON.stringify(selector)});
  if (!el) return 'KHONG_THAY';
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(el, ${JSON.stringify(value)});
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return 'OK';
})()`;
const clickSubmit = "document.querySelector('.auth-submit').click()";

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  // 1) Mở web chính khi chưa đăng nhập → bị đưa về trang đăng nhập
  await goto('/');
  check('mở / khi chưa đăng nhập → về trang đăng nhập', await evaluate('location.pathname'), '/login');
  check('giữ địa chỉ đã yêu cầu để quay lại sau', await evaluate('location.search'), '?next=/');
  check('Trang chủ KHÔNG render khi chưa đăng nhập', await evaluate("document.querySelector('.home-page') === null"), true);

  // 2) Các trang nội dung cũng bị chặn
  await goto('/podcast');
  check('/podcast → về trang đăng nhập kèm next', await evaluate('location.pathname + location.search'), '/login?next=/podcast');
  await goto('/java/tu-zero');
  check('/java/tu-zero → về trang đăng nhập', await evaluate('location.pathname'), '/login');
  await goto('/dashboard');
  check('/dashboard → về trang đăng nhập', await evaluate('location.pathname'), '/login');

  // 3) Trang đăng nhập là trang đầu tiên: giới thiệu ở TRÊN, form ở DƯỚI
  const layout = await evaluate(`JSON.stringify((() => {
    const hero = document.querySelector('.auth-hero');
    const form = document.querySelector('#auth-form');
    const card = document.querySelector('.auth-card');
    if (!hero || !form || !card) return { ok: false };
    const heroBox = hero.getBoundingClientRect();
    const formBox = form.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    return {
      ok: true,
      heroTop: Math.round(heroBox.top),
      heroBottom: Math.round(heroBox.bottom + window.scrollY),
      formTop: Math.round(formBox.top + window.scrollY),
      cardTop: Math.round(cardBox.top + window.scrollY),
      points: document.querySelectorAll('.hero-point').length,
      tabs: document.querySelectorAll('.auth-tab').length,
      heroText: (document.querySelector('.hero-title') || {}).textContent || ''
    };
  })())`);
  const info = JSON.parse(layout);
  check('có phần giới thiệu', info.ok, true);
  check('form nằm DƯỚI phần giới thiệu', info.cardTop > info.heroBottom, true);
  check('giới thiệu có 4 điểm nổi bật', info.points, 4);
  check('form vẫn 2 tab', info.tabs, 2);
  check('tiêu đề giới thiệu đúng', info.heroText.includes('Lò rèn kỹ năng'), true);

  // 4) Nút "Đăng nhập / Đăng ký ngay" cuộn xuống form
  await evaluate("window.scrollTo(0, 0)");
  await evaluate("document.querySelector('.hero-cta').click()");
  await sleep(1200);
  check('bấm nút mời → cuộn xuống form', await evaluate('window.scrollY > 100'), true);

  // 5) Đăng ký → onboarding → đăng nhập → quay lại đúng trang đã xin
  await goto('/podcast');
  await evaluate("document.querySelectorAll('.auth-tab')[1].click()");
  await sleep(400);
  await evaluate(setInput('#reg-email', 'kien4@example.com'));
  await evaluate(setInput('#reg-password', 'MatKhau123'));
  await evaluate(setInput('#reg-confirm', 'MatKhau123'));
  await evaluate("document.querySelector('.auth-check input').click()");
  await evaluate(clickSubmit);
  await sleep(900);
  check('đăng ký → onboarding', await evaluate("document.body.innerText.includes('Cá nhân hoá lộ trình')"), true);
  await evaluate(clickSubmit);
  await sleep(800);
  check('sau đăng ký → tab Đăng nhập', await evaluate("document.querySelector('.auth-tab.active')?.textContent?.trim()"), 'Đăng nhập');

  await evaluate(setInput('#auth-password', 'MatKhau123'));
  await evaluate(clickSubmit);
  await sleep(1200);
  check('đăng nhập → vào đúng trang đã xin (/podcast)', await evaluate('location.pathname'), '/podcast');
  check('trang nội dung render được', await evaluate('document.body.innerText.length > 200'), true);

  // 6) Đã đăng nhập thì vào thẳng web chính + đăng xuất quay về trang đăng nhập
  await goto('/');
  check('đã đăng nhập → vào được Trang chủ', await evaluate("Boolean(document.querySelector('.home-page'))"), true);
  await goto('/dashboard');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === 'Đăng xuất');
    if (btn) btn.click();
    return Boolean(btn);
  })()`);
  await sleep(900);
  check('đăng xuất → về trang đăng nhập', await evaluate('location.pathname'), '/login');

  const errors = events.filter((e) => !e.includes('favicon'));
  const failed = results.filter((r) => !r).length;
  console.log(`\nLỗi JS/console: ${errors.length}`);
  errors.slice(0, 5).forEach((e) => console.log('  ' + e));
  console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS`);
  process.exitCode = failed ? 1 : 0;
} catch (err) {
  console.error('LỖI KIỂM CHỨNG:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
