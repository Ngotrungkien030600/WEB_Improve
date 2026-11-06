// Kiểm chứng đồng hồ Pomodoro làm lại: pill ở header, chạy/tạm dừng, bảng điều khiển,
// mốc thời lượng, chế độ nghỉ, lưu trạng thái qua tải lại, phiên hết giờ lúc đóng tab, màn hình hẹp.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = Number(process.env.SHOT_PORT || 9355);
const BASE = process.argv[2] || 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-timer-'));
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
  else if (m.method === 'Runtime.exceptionThrown') events.push(m.params?.exceptionDetails?.exception?.description?.split('\n')[0] || 'exception');
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
const clock = () => evaluate("document.querySelector('.pill-clock').textContent.trim()");
const state = () => evaluate("JSON.parse(localStorage.getItem('skillforge_timer_state') || 'null')");
const history = () => evaluate("JSON.parse(localStorage.getItem('skillforge_timer_history') || 'null')");
const clickText = (text, sel) => evaluate(`(() => {
  const el = Array.from(document.querySelectorAll(${JSON.stringify(sel)})).find((x) => x.textContent.trim().includes(${JSON.stringify(text)}));
  if (!el) return 'KHONG_THAY';
  el.click();
  return 'ok';
})()`);

try {
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: BASE + '/login' });
  await sleep(1500);
  await evaluate("localStorage.clear(); localStorage.setItem('sf_auth_session', JSON.stringify({ user: { id: 'timer', email: 'timer@example.com', displayName: 'timer', plan: 'free' } }))");
  await send('Page.navigate', { url: BASE + '/' });
  await sleep(2600);

  // 1. Pill trong header
  const pill = JSON.parse(await evaluate(`JSON.stringify((() => {
    const wrap = document.querySelector('.forge-timer-wrap');
    if (!wrap) return { ok: false };
    const inHeader = Boolean(document.querySelector('.home-header .forge-timer-wrap'));
    const ring = document.querySelector('.pill-ring svg circle.ring-progress');
    const cs = ring ? getComputedStyle(ring) : null;
    return {
      ok: true,
      inHeader,
      clock: document.querySelector('.pill-clock').textContent.trim(),
      mode: document.querySelector('.pill-mode').textContent.trim(),
      sub: document.querySelector('.pill-sub').textContent.trim(),
      action: document.querySelector('.pill-action').textContent.trim(),
      ringStroke: cs ? cs.stroke : '',
      dashArray: ring ? ring.getAttribute('stroke-dasharray') || '' : '',
      panelOpen: Boolean(document.querySelector('.timer-panel'))
    };
  })())`));
  check('pill nằm trong header trang chủ', pill.inHeader, true);
  check('hiện 30:00 mặc định', pill.clock, '30:00');
  check('hiện chế độ tập trung', pill.mode.includes('Tập trung'), true);
  check('phụ đề là thời lượng', pill.sub, '30 phút');
  check('nút hành động là ▶', pill.action, '▶');
  check('vòng tiến độ có màu', pill.ringStroke !== 'none' && pill.ringStroke !== '', true);
  check('bảng điều khiển đang đóng', pill.panelOpen, false);

  // 2. Bắt đầu chạy
  await evaluate("document.querySelector('.pill-action').click()");
  await sleep(2300);
  const running = JSON.parse(await evaluate(`JSON.stringify({
    clock: document.querySelector('.pill-clock').textContent.trim(),
    action: document.querySelector('.pill-action').textContent.trim(),
    title: document.title,
    pillRunning: document.querySelector('.timer-pill').classList.contains('running')
  })`));
  check('đồng hồ đếm lùi', (() => {
    const [m, s] = running.clock.split(':').map(Number);
    const left = m * 60 + s;
    return left < 1800 && left >= 1793;
  })(), true);
  check('nút đổi thành ⏸', running.action, '⏸');
  check('thẻ pill báo đang chạy', running.pillRunning, true);
  check('tiêu đề tab hiện giờ', running.title.includes(running.clock), true);
  const st1 = await state();
  check('trạng thái lưu running=true', st1.running, true);
  check('trạng thái lưu tổng 1800 giây', st1.total, 1800);

  // 3. Tạm dừng
  await evaluate("document.querySelector('.pill-action').click()");
  await sleep(300);
  const pausedClock = await clock();
  await sleep(1600);
  check('tạm dừng thì đồng hồ đứng', await clock(), pausedClock);
  check('trạng thái lưu running=false', (await state()).running, false);
  check('tiêu đề tab trả lại như cũ', await evaluate('document.title'), 'SkillForge');

  // 4. Mở bảng điều khiển
  await evaluate("document.querySelector('.pill-main').click()");
  await sleep(500);
  const panel = JSON.parse(await evaluate(`JSON.stringify((() => {
    const box = document.querySelector('.timer-panel');
    if (!box) return { ok: false };
    const r = box.getBoundingClientRect();
    return {
      ok: true,
      insideViewport: r.left >= 0 && r.right <= window.innerWidth + 1,
      ring: Math.round(document.querySelector('.panel-ring').getBoundingClientRect().width),
      clock: document.querySelector('.ring-clock').textContent.trim(),
      status: document.querySelector('.ring-status').textContent.trim(),
      actions: Array.from(document.querySelectorAll('.act')).map((b) => b.textContent.trim()),
      presets: Array.from(document.querySelectorAll('.preset')).map((b) => b.textContent.trim()),
      activePreset: document.querySelector('.preset.active') ? document.querySelector('.preset.active').textContent.trim() : '',
      stats: Array.from(document.querySelectorAll('.panel-stat')).map((s) => s.textContent.trim()),
      hasSound: Boolean(document.querySelector('.panel-sound input')),
      expanded: document.querySelector('.pill-main').getAttribute('aria-expanded')
    };
  })())`));
  check('bảng điều khiển mở ra', panel.ok, true);
  check('bảng nằm trong màn hình', panel.insideViewport, true);
  check('vòng lớn ~150px', panel.ring >= 145 && panel.ring <= 155, true);
  check('bảng hiện đồng hồ', panel.clock === pausedClock, true);
  check('trạng thái là tạm dừng', panel.status, 'tạm dừng');
  check('đủ 3 nút điều khiển', panel.actions.length, 3);
  check('có nút Đặt lại', panel.actions.some((t) => t.includes('Đặt lại')), true);
  check('có nút chuyển sang Nghỉ', panel.actions.some((t) => t.includes('Nghỉ')), true);
  check('đủ 5 mốc thời lượng', panel.presets, ['15p', '25p', '30p', '45p', '60p']);
  check('mốc 30p đang được chọn', panel.activePreset, '30p');
  check('đủ 4 ô thống kê', panel.stats.length, 4);
  check('có công tắc âm thanh', panel.hasSound, true);
  check('aria-expanded = true', panel.expanded, 'true');

  // 5. Đổi mốc thời lượng
  await clickText('15p', '.preset');
  await sleep(400);
  check('chọn 15p → đồng hồ 15:00', await clock(), '15:00');
  check('trạng thái lưu 900 giây', (await state()).total, 900);
  check('đổi mốc thì dừng chạy', (await state()).running, false);

  // 6. Chuyển chế độ nghỉ rồi quay lại
  await clickText('Nghỉ 5p', '.act');
  await sleep(400);
  check('sang chế độ nghỉ ngắn', await evaluate("document.querySelector('.pill-mode').textContent.trim()"), '☕ Nghỉ ngắn');
  check('nghỉ ngắn 05:00', await clock(), '05:00');
  check('ẩn mốc thời lượng khi nghỉ', await evaluate("document.querySelectorAll('.preset').length"), 0);
  await clickText('Tập trung', '.act');
  await sleep(400);
  check('quay lại tập trung 30:00', await clock(), '30:00');

  // 7. Đóng bảng: bấm ra ngoài và ESC
  await evaluate("document.querySelector('.brand').click()");
  await sleep(400);
  check('bấm ra ngoài → đóng bảng', await evaluate("document.querySelector('.timer-panel') === null"), true);
  await evaluate("document.querySelector('.pill-main').click()");
  await sleep(300);
  await evaluate("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))");
  await sleep(300);
  check('ESC → đóng bảng', await evaluate("document.querySelector('.timer-panel') === null"), true);

  // 8. Lưu trạng thái qua tải lại (đang chạy dở)
  await evaluate("document.querySelector('.pill-main').click()");
  await sleep(300);
  await clickText('45p', '.preset');
  await sleep(300);
  await evaluate("document.querySelector('.pill-action').click()");
  await sleep(2400);
  const beforeReload = await clock();
  await send('Page.navigate', { url: BASE + '/' });
  await sleep(2600);
  const afterReload = JSON.parse(await evaluate(`JSON.stringify({
    clock: document.querySelector('.pill-clock').textContent.trim(),
    action: document.querySelector('.pill-action').textContent.trim(),
    running: JSON.parse(localStorage.getItem('skillforge_timer_state')).running
  })`));
  check('tải lại vẫn đang chạy', afterReload.action, '⏸');
  check('tải lại giữ đúng thời gian còn lại', afterReload.clock < beforeReload && afterReload.clock >= '44:40', true);
  check('tải lại vẫn running=true', afterReload.running, true);

  // 9. Phiên hết giờ trong lúc đóng tab → phải được ghi nhận (lỗi cũ: mất phiên, kẹt 00:00)
  const histBefore = await history();
  await evaluate(`(() => {
    const past = Date.now() - 120000;
    localStorage.setItem('skillforge_timer_state', JSON.stringify({ mode: 'focus', total: 900, remaining: 30, running: true, lastUpdated: past, sound: true }));
    return 'ok';
  })()`);
  await send('Page.navigate', { url: BASE + '/' });
  await sleep(2600);
  const expired = JSON.parse(await evaluate(`JSON.stringify({
    clock: document.querySelector('.pill-clock').textContent.trim(),
    mode: document.querySelector('.pill-mode').textContent.trim(),
    action: document.querySelector('.pill-action').textContent.trim(),
    note: document.querySelector('.panel-note') ? document.querySelector('.panel-note').textContent.trim() : ''
  })`));
  const histAfter = await history();
  check('hết giờ lúc vắng → không kẹt ở trạng thái chạy', expired.action, '▶');
  check('hết giờ lúc vắng → tự gợi ý nghỉ ngắn', expired.mode.includes('Nghỉ ngắn'), true);
  check('hết giờ lúc vắng → ghi nhận thêm 1 phiên', (histAfter.sessions || 0) - (histBefore?.sessions || 0), 1);
  check('hết giờ lúc vắng → cộng 15 phút cho hôm nay', ((histAfter.dates || {})[new Date().toISOString().slice(0, 10)] || 0) - ((histBefore?.dates || {})[new Date().toISOString().slice(0, 10)] || 0), 15);
  await evaluate("document.querySelector('.pill-main').click()");
  await sleep(400);
  check('bảng hiện lời nhắc hoàn thành', (await evaluate("document.querySelector('.panel-note') ? document.querySelector('.panel-note').textContent : ''")).includes('Xong'), true);
  const statsAfter = await evaluate("Array.from(document.querySelectorAll('.panel-stat')).map((s) => s.textContent.trim()).join(' | ')");
  check('thống kê hôm nay đã cập nhật', statsAfter.includes('15') || statsAfter.includes('45'), true);

  // 10. Công tắc âm thanh được nhớ
  await evaluate("document.querySelector('.panel-sound input').click()");
  await sleep(400);
  check('tắt tiếng → lưu sound=false', (await state()).sound, false);
  await send('Page.navigate', { url: BASE + '/' });
  await sleep(2400);
  await evaluate("document.querySelector('.pill-main').click()");
  await sleep(400);
  check('tải lại vẫn nhớ tắt tiếng', await evaluate("document.querySelector('.panel-sound input').checked"), false);

  // 11. Màn hình hẹp
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 780, deviceScaleFactor: 2, mobile: true });
  await sleep(700);
  const narrow = JSON.parse(await evaluate(`JSON.stringify((() => {
    const box = document.querySelector('.timer-panel');
    const r = box ? box.getBoundingClientRect() : null;
    return {
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      pillVisible: document.querySelector('.pill-ring').getBoundingClientRect().width > 30,
      panelInside: r ? r.left >= -1 && r.right <= window.innerWidth + 1 : false,
      panelWidth: r ? Math.round(r.width) : 0
    };
  })())`));
  check('màn hình 390px: không tràn ngang', narrow.overflowX, false);
  check('màn hình 390px: vẫn thấy vòng đồng hồ', narrow.pillVisible, true);
  check('màn hình 390px: bảng điều khiển nằm gọn', narrow.panelInside, true);
  await send('Emulation.clearDeviceMetricsOverride');

  const failed = results.filter((r) => !r).length;
  console.log(`\nLỗi JS: ${events.length}`);
  [...new Set(events)].slice(0, 5).forEach((e) => console.log('  ' + e));
  console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS  (cổng: ${BASE})`);
  process.exitCode = failed ? 1 : 0;
} catch (err) {
  console.error('LỖI KIỂM CHỨNG:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
