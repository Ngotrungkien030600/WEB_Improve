// Kiểm chứng menu tài khoản mới: avatar + tên, mở/đóng menu, đóng khi bấm ra ngoài / ESC, đăng xuất.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9349;
const BASE = process.argv[2] || 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-menu-'));
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
const events = [];
await new Promise((res) => ws.addEventListener('open', res));
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  else if (m.method === 'Runtime.exceptionThrown') events.push('EXCEPTION: ' + (m.params?.exceptionDetails?.exception?.description || m.params?.exceptionDetails?.text || ''));
});
const send = (method, params = {}) => new Promise((res) => { const i = id++; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
const results = [];
function check(name, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`);
}
const setInput = (sel, val) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return 'KHONG_THAY'; const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; s.call(el, ${JSON.stringify(val)}); el.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);

try {
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: BASE + '/register' });
  await sleep(2600);
  await evaluate("document.querySelectorAll('.auth-tab')[1]?.click()");
  await sleep(400);
  await setInput('#reg-email', 'trungkien.nguyen@example.com');
  await setInput('#reg-password', 'MatKhau123');
  await setInput('#reg-confirm', 'MatKhau123');
  await evaluate("document.querySelector('.auth-check input')?.click()");
  await evaluate("document.querySelector('.auth-submit')?.click()");
  await sleep(1100);
  await evaluate("document.querySelector('.auth-submit')?.click()");
  await sleep(900);
  await setInput('#auth-password', 'MatKhau123');
  await evaluate("document.querySelector('.auth-submit')?.click()");
  await sleep(2000);
  if (await evaluate("Boolean(document.querySelector('.import-overlay'))")) {
    await evaluate("Array.from(document.querySelectorAll('.import-btn')).find((b) => b.textContent.includes('Bỏ qua')).click()");
    await sleep(1400);
  }
  check('vào được Trang chủ', await evaluate("Boolean(document.querySelector('.home-page'))"), true);

  // 1) Nút tài khoản: avatar + tên + gói
  const trigger = JSON.parse(await evaluate(`JSON.stringify((() => {
    const t = document.querySelector('.acct-trigger');
    if (!t) return { ok: false };
    const cs = getComputedStyle(t);
    const av = document.querySelector('.acct-avatar');
    const acs = av ? getComputedStyle(av) : null;
    const box = t.getBoundingClientRect();
    return {
      ok: true,
      initials: av ? av.textContent.trim() : '',
      avatarRound: acs ? acs.borderRadius : '',
      avatarSize: av ? Math.round(av.getBoundingClientRect().width) : 0,
      avatarGradient: acs ? acs.backgroundImage.includes('gradient') : false,
      name: document.querySelector('.acct-name')?.textContent.trim() || '',
      plan: document.querySelector('.acct-plan')?.textContent.trim() || '',
      hasChevron: Boolean(document.querySelector('.acct-chevron')),
      radius: cs.borderRadius,
      height: Math.round(box.height)
    };
  })())`));
  check('có nút tài khoản', trigger.ok, true);
  check('avatar tròn', trigger.avatarRound, '50%');
  check('avatar có gradient', trigger.avatarGradient, true);
  check('avatar ~32px', trigger.avatarSize >= 30 && trigger.avatarSize <= 34, true);
  check('chữ cái đầu đúng (TN)', trigger.initials, 'TN');
  check('hiện tên người dùng', trigger.name, 'Trungkien.nguyen');
  check('hiện gói dịch vụ', trigger.plan, 'Gói miễn phí');
  check('có mũi tên chỉ xuống', trigger.hasChevron, true);
  check('nút bo tròn dạng viên thuốc', trigger.radius, '999px');
  check('cao vừa phải (36-48px)', trigger.height >= 36 && trigger.height <= 48, true);

  // Nút gọn lại trên màn hình hẹp (điện thoại)
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 780, deviceScaleFactor: 2, mobile: true });
  await sleep(600);
  const narrow = JSON.parse(await evaluate(`JSON.stringify((() => {
    const t = document.querySelector('.acct-trigger');
    const box = t.getBoundingClientRect();
    const text = document.querySelector('.acct-text');
    return {
      textHidden: text ? getComputedStyle(text).display === 'none' : null,
      insideViewport: box.right <= window.innerWidth + 1 && box.left >= 0,
      width: Math.round(box.width)
    };
  })())`));
  check('màn hình hẹp: ẩn chữ, chỉ còn avatar', narrow.textHidden, true);
  check('màn hình hẹp: nút nằm gọn trong màn hình', narrow.insideViewport, true);
  await send('Emulation.clearDeviceMetricsOverride');
  await sleep(500);

  // 2) Mở menu
  await evaluate("document.querySelector('.acct-trigger').click()");
  await sleep(600);
  const menu = JSON.parse(await evaluate(`JSON.stringify((() => {
    const m = document.querySelector('.acct-menu');
    if (!m) return { ok: false };
    const box = m.getBoundingClientRect();
    const items = Array.from(m.querySelectorAll('.acct-item')).map((b) => b.textContent.trim());
    const cs = getComputedStyle(m);
    const head = m.querySelector('.acct-menu-id');
    return {
      ok: true,
      items,
      rightAligned: Math.round(box.right) <= window.innerWidth && box.right > window.innerWidth / 2,
      insideViewport: box.left >= 0 && box.bottom <= window.innerHeight + 1,
      bg: cs.backgroundColor,
      shadow: cs.boxShadow !== 'none',
      headEmail: head ? head.textContent.trim() : '',
      expanded: document.querySelector('.acct-trigger').getAttribute('aria-expanded')
    };
  })())`));
  check('menu mở ra', menu.ok, true);
  check('menu đủ 3 mục', menu.items.length, 3);
  check('có mục Dashboard', menu.items.some((t) => t.includes('Dashboard')), true);
  check('có mục Trang tài khoản', menu.items.some((t) => t.includes('Trang tài khoản')), true);
  check('có mục Đăng xuất', menu.items.some((t) => t.includes('Đăng xuất')), true);
  check('menu nằm trong màn hình', menu.insideViewport, true);
  check('menu canh phải', menu.rightAligned, true);
  check('menu có nền đặc + đổ bóng', menu.bg !== 'rgba(0, 0, 0, 0)' && menu.shadow, true);
  check('menu hiện email', menu.headEmail.includes('trungkien.nguyen@example.com'), true);
  check('aria-expanded=true khi mở', menu.expanded, 'true');

  // 3) Bấm ra ngoài → đóng
  await evaluate("document.querySelector('.hero-title').click()");
  await sleep(500);
  check('bấm ra ngoài → đóng menu', await evaluate("document.querySelector('.acct-menu') === null"), true);

  // 4) ESC → đóng
  await evaluate("document.querySelector('.acct-trigger').click()");
  await sleep(400);
  await evaluate("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))");
  await sleep(400);
  check('ESC → đóng menu', await evaluate("document.querySelector('.acct-menu') === null"), true);

  // 5) Mục "Trang tài khoản" đi tới /login (khi đã đăng nhập hiện panel + Vào web)
  await evaluate("document.querySelector('.acct-trigger').click()");
  await sleep(400);
  await evaluate("Array.from(document.querySelectorAll('.acct-item')).find((b) => b.textContent.includes('Trang tài khoản')).click()");
  await sleep(1200);
  check('mục Trang tài khoản → /login', await evaluate('location.pathname'), '/login');
  check('hiện panel đã đăng nhập', await evaluate("document.body.innerText.includes('Bạn đã đăng nhập')"), true);

  // 6) Đăng xuất từ menu
  await send('Page.navigate', { url: BASE + '/' });
  await sleep(2000);
  await evaluate("document.querySelector('.acct-trigger').click()");
  await sleep(400);
  await evaluate("Array.from(document.querySelectorAll('.acct-item')).find((b) => b.textContent.includes('Đăng xuất')).click()");
  await sleep(1400);
  check('đăng xuất từ menu → về trang đăng nhập', await evaluate('location.pathname'), '/login');
  check('trang đăng nhập có 2 tab', await evaluate("document.querySelectorAll('.auth-tab').length"), 2);
  check('đã xoá phiên', await evaluate("localStorage.getItem('sf_auth_session') === null && sessionStorage.getItem('sf_auth_session') === null"), true);

  const failed = results.filter((r) => !r).length;
  console.log(`\nLỗi JS: ${events.length}`);
  events.slice(0, 5).forEach((e) => console.log('  ' + e));
  console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS  (cổng: ${BASE})`);
  process.exitCode = failed ? 1 : 0;
} catch (err) {
  console.error('LỖI KIỂM CHỨNG:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
