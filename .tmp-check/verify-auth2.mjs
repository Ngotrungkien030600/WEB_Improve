// Kiểm chứng trang gộp /login (2 tab) + luồng: đăng ký → onboarding → đăng nhập lại → vào web.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9338;
const BASE = 'http://localhost:8080';

const profile = mkdtempSync(join(tmpdir(), 'dsh-auth2-'));
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

function createClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();
  const events = [];
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
    } else if (msg.method === 'Runtime.exceptionThrown') {
      events.push('EXCEPTION: ' + (msg.params?.exceptionDetails?.text || ''));
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
  return { ready, send, events, close: () => ws.close() };
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error('Lỗi JS: ' + (result.exceptionDetails.exception?.description || result.exceptionDetails.text));
  return result.result.value;
}

async function goto(client, path) {
  await client.send('Page.navigate', { url: BASE + path });
  await sleep(1000);
}

async function waitFor(client, selector, timeoutMs = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await evaluate(client, `Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return true;
    await sleep(200);
  }
  return false;
}

const results = [];
function check(name, actual, expected) {
  const pass = actual === expected;
  results.push({ name, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`);
}

const setInput = (selector, value) => `(() => {
  const el = document.querySelector(${JSON.stringify(selector)});
  if (!el) return 'KHONG_THAY';
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(el, ${JSON.stringify(value)});
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return 'OK';
})()`;

const clickText = (text) => `(() => {
  const all = Array.from(document.querySelectorAll('button, a, [role="button"]'));
  const hit = all.find((el) => (el.textContent || '').trim().includes(${JSON.stringify(text)}) && el.getBoundingClientRect().width > 0);
  if (!hit) return 'KHONG_THAY';
  hit.click();
  return 'DA_CLICK';
})()`;

const bodyText = 'document.body.innerText';
const activeTab = "document.querySelector('.auth-tab.active')?.textContent?.trim() || ''";
const clickSubmit = "document.querySelector('.auth-submit').click()";

try {
  const client = createClient(await getTarget());
  await client.ready;
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Log.enable');

  // 1) /register cũ phải chuyển sang trang gộp và mở đúng tab Đăng ký
  await goto(client, '/register');
  await waitFor(client, '.auth-tabs');
  check('/register → URL /login?tab=register', await evaluate(client, 'location.pathname + location.search'), '/login?tab=register');
  check('/register → tab Đăng ký đang mở', await evaluate(client, activeTab), 'Đăng ký');
  check('chỉ có 1 trang auth (2 tab)', await evaluate(client, "document.querySelectorAll('.auth-tab').length"), 2);

  // 2) Đổi tab qua lại không rời trang
  await evaluate(client, clickText('Đăng nhập'));
  await sleep(400);
  check('bấm tab Đăng nhập → form đăng nhập', await evaluate(client, activeTab), 'Đăng nhập');
  check('bấm tab Đăng nhập → URL sạch', await evaluate(client, 'location.pathname + location.search'), '/login');
  check('form đăng nhập có ô mật khẩu', await evaluate(client, "Boolean(document.querySelector('#auth-password'))"), true);

  await evaluate(client, clickText('Đăng ký'));
  await sleep(400);
  check('quay lại tab Đăng ký', await evaluate(client, activeTab), 'Đăng ký');

  // 3) Đăng ký → onboarding → KHÔNG tự đăng nhập
  await evaluate(client, "localStorage.setItem('sf_timer_state', '{\"a\":1}'); localStorage.setItem('skillforge_log', '[1,2]')");
  await evaluate(client, setInput('#reg-email', 'kien2@example.com'));
  await evaluate(client, setInput('#reg-password', 'MatKhau123'));
  await evaluate(client, setInput('#reg-confirm', 'MatKhau123'));
  await evaluate(client, "document.querySelector('.auth-check input').click()");
  await evaluate(client, clickSubmit);
  await sleep(900);
  check('đăng ký xong → onboarding', await evaluate(client, `${bodyText}.includes('Cá nhân hoá lộ trình')`), true);

  await evaluate(client, "document.querySelectorAll('.onb-options')[0].querySelector('button').click()");
  await evaluate(client, "document.querySelectorAll('.onb-options')[1].querySelector('button').click()");
  await evaluate(client, "document.querySelectorAll('.onb-options')[2].querySelector('button').click()");
  await evaluate(client, clickSubmit);
  await sleep(800);
  check('sau đăng ký → về tab Đăng nhập', await evaluate(client, activeTab), 'Đăng nhập');
  check('có thông báo đăng ký thành công', await evaluate(client, `${bodyText}.includes('Đăng ký thành công')`), true);
  check('email đã điền sẵn', await evaluate(client, "document.querySelector('#auth-email')?.value"), 'kien2@example.com');
  check('CHƯA tự đăng nhập (chưa có phiên)', await evaluate(client, "localStorage.getItem('sf_auth_session') === null && sessionStorage.getItem('sf_auth_session') === null"), true);
  check('chip tài khoản chưa hiện tên', await evaluate(client, "document.querySelector('.acct-name') === null"), true);

  // 4) Đăng nhập mới vào được web + nhập tiến độ
  await evaluate(client, setInput('#auth-password', 'SaiMatKhau9'));
  await evaluate(client, clickSubmit);
  await sleep(700);
  check('sai mật khẩu → báo lỗi chung', await evaluate(client, `${bodyText}.includes('Email hoặc mật khẩu không đúng')`), true);

  await evaluate(client, setInput('#auth-password', 'MatKhau123'));
  await evaluate(client, clickSubmit);
  await sleep(900);
  check('đăng nhập đúng → hộp thoại nhập tiến độ', await evaluate(client, `${bodyText}.includes('Nhập tiến độ trên máy này')`), true);
  check('đếm đúng 2 mục tiến độ', await evaluate(client, "document.querySelectorAll('.import-list li').length"), 2);

  await evaluate(client, clickText('Nhập vào tài khoản này'));
  await sleep(1000);
  check('nhập xong → vào web chính (/)', await evaluate(client, 'location.pathname'), '/');
  check('header hiện tên tài khoản', await evaluate(client, "Boolean(document.querySelector('.acct-name'))"), true);

  // 5) Link "Đăng ký" ở header vẫn mở đúng tab
  await evaluate(client, clickText('Đăng xuất'));
  await sleep(600);
  await evaluate(client, clickText('Đăng ký'));
  await sleep(800);
  check('nút Đăng ký ở header → tab Đăng ký', await evaluate(client, activeTab), 'Đăng ký');

  // 6) Guard AI vẫn hoạt động: mang theo next + need
  await goto(client, '/login?next=/podcast&need=ai');
  await waitFor(client, '.auth-tabs');
  check('hiện ngữ cảnh quay lại Podcast', await evaluate(client, `${bodyText}.includes('Podcast')`), true);
  check('hiện lý do cần đăng nhập', await evaluate(client, `${bodyText}.includes('tính năng AI')`), true);

  const errors = client.events.filter((e) => !e.includes('favicon'));
  const failed = results.filter((r) => !r.pass);
  console.log(`\nLỗi JS/console: ${errors.length}`);
  errors.slice(0, 6).forEach((e) => console.log('  ' + e));
  console.log(`\nTỔNG: ${results.length - failed.length}/${results.length} PASS`);
  client.close();
  process.exitCode = failed.length ? 1 : 0;
} catch (err) {
  console.error('LỖI KIỂM CHỨNG:', err.message);
  process.exitCode = 2;
} finally {
  chrome.kill();
}
