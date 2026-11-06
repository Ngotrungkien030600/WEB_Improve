// Kiểm chứng lộ trình học làm lại trên app thật:
// 5 trục, tiến độ thật từ Phòng luyện code / quiz Java / Thực chiến, cảnh báo tiên quyết mềm,
// thẻ "hôm nay học gì", nhắc ôn tập, lưu qua tải lại, màn hình hẹp, không lỗi JS.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = Number(process.env.SHOT_PORT || 9368);
const BASE = process.argv[2] || 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-paths-'));
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
const errors = [];
const failed = [];
await new Promise((res) => ws.addEventListener('open', res));
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); return; }
  if (m.method === 'Runtime.exceptionThrown') {
    errors.push(m.params?.exceptionDetails?.exception?.description?.split('\n')[0] || 'exception');
  }
  if (m.method === 'Network.loadingFailed') {
    const url = m.params?.requestId || '';
    if (!m.params?.canceled) failed.push(`${url} ${m.params?.errorText || ''}`);
  }
  if (m.method === 'Network.responseReceived' && m.params?.response?.status >= 400) {
    const url = m.params.response.url;
    if (!url.includes('favicon')) failed.push(`${m.params.response.status} ${url}`);
  }
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
const ok = (name, cond, extra = '') => check(name + (extra ? ` (${extra})` : ''), Boolean(cond), true);
const json = async (expr) => JSON.parse(await evaluate(`JSON.stringify(${expr})`));
const text = (sel) => evaluate(`(document.querySelector(${JSON.stringify(sel)})?.textContent || '').trim()`);
const clickText = (sel, needle) => evaluate(`(() => {
  const el = Array.from(document.querySelectorAll(${JSON.stringify(sel)})).find((x) => x.textContent.trim().includes(${JSON.stringify(needle)}));
  if (!el) return 'KHONG_THAY';
  el.click();
  return 'ok';
})()`);
const storage = (key) => evaluate(`localStorage.getItem(${JSON.stringify(key)})`);
const seed = async (key, value) => evaluate(`localStorage.setItem(${JSON.stringify(key)}, ${JSON.stringify(JSON.stringify(value))})`);
const go = async (path, wait = 2200) => { await send('Page.navigate', { url: BASE + path }); await sleep(wait); };

// Đáp án đúng của quiz Java từ 0 để gieo vào localStorage (đạt chuẩn cần ≥ 80% câu đúng)
const { JAVA_TU_ZERO } = await import('../projects/web-app/src/utils/java-tu-zero-content.js');
const correctQuiz = { chapter: {}, read: {} };
(JAVA_TU_ZERO.chapters || []).forEach((ch) => {
  (ch.quiz || []).forEach((item, qi) => { correctQuiz.chapter[`${ch.id}-${qi}`] = item.answer; });
});
(JAVA_TU_ZERO.readCode || []).forEach((item, index) => { correctQuiz.read[`rc-${index}`] = item.answer; });
console.log(`# quiz Java từ 0: ${Object.keys(correctQuiz.chapter).length} câu chương + ${Object.keys(correctQuiz.read).length} câu đọc code`);

const stageSnapshot = () => json(`Array.from(document.querySelectorAll('.stage-card')).map((card) => ({
  title: card.querySelector('h3')?.textContent.trim() || '',
  percent: card.querySelector('.stage-percent')?.textContent.trim() || '',
  count: card.querySelector('.stage-count')?.textContent.trim() || '',
  warn: card.querySelector('.stage-warn')?.textContent.trim() || '',
  groups: Array.from(card.querySelectorAll('.stage-group h4')).map((h) => h.textContent.trim()),
  items: Array.from(card.querySelectorAll('.item')).map((li) => ({
    done: li.classList.contains('done'),
    label: (li.querySelector('.item-label') || li.querySelector('.item-link'))?.textContent.trim() || '',
    link: li.querySelector('.item-link') ? 'co-link' : 'khong-link',
    detail: li.querySelector('.item-detail')?.textContent.trim() || ''
  })),
  project: card.querySelector('.stage-project')?.textContent.trim() || '',
  review: card.querySelector('.stage-review')?.textContent.trim() || '',
  mark: card.querySelector('.btn-mark')?.textContent.trim() || '',
  date: card.querySelector('.stage-date')?.textContent.trim() || ''
}))`);

const todaySnapshot = () => json(`({
  head: document.querySelector('.today-head h2')?.textContent.trim() || '',
  track: document.querySelector('.today-track')?.textContent.trim() || '',
  stage: document.querySelector('.today-stage')?.textContent.trim() || '',
  task: document.querySelector('.today-task')?.textContent.trim() || '',
  detail: document.querySelector('.today-detail')?.textContent.trim() || '',
  cta: document.querySelector('.btn-start')?.textContent.trim() || '',
  foot: document.querySelector('.today-foot')?.textContent.trim() || '',
  nudge: document.querySelector('.review-nudge')?.textContent.trim() || ''
})`);

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');

  await go('/login', 1400);
  await evaluate("localStorage.clear(); localStorage.setItem('sf_auth_session', JSON.stringify({ user: { id: 'paths', email: 'paths@example.com', displayName: 'paths', plan: 'free' } }))");

  // ── 1. Trang lộ trình hiện ra với 5 trục ─────────────────────────────────
  await go('/learning-paths');
  check('tiêu đề trang là Lộ trình học', await text('.hub-topbar h1'), '🗺️ Lộ trình học');
  const tabs = await json(`Array.from(document.querySelectorAll('.track-tab')).map((b) => b.textContent.trim())`);
  check('có 5 trục lộ trình', tabs, ['☕ Java Backend đi làm', '📖 Tiếng Anh', '🌐 Frontend', '🐳 DevOps & Cloud', '🤖 AI & AI Agent']);
  ok('trục chính được đánh dấu sao', await evaluate("Boolean(document.querySelector('.track-tab.primary'))"));
  ok('tab đang chọn chứa Java Backend', (await text('.track-tab.active')).includes('Java Backend'));

  const cards0 = await stageSnapshot();
  check('trục Java Backend có 6 chặng', cards0.length, 6);
  check('chặng 1 đúng tên', cards0[0].title, 'Java nền tảng');
  check('chưa học gì thì chặng 1 là 0%', cards0[0].percent, '0%');
  check('mỗi chặng có 5 việc', cards0[0].items.length, 5);
  check('chặng có 3 nhóm việc', cards0[0].groups.length, 3);
  ok('nhóm bài học hiện ra', cards0[0].groups[0].includes('Bài học'), cards0[0].groups[0]);
  ok('nhóm luyện tập có chấm', cards0[0].groups[1].includes('Luyện tập'), cards0[0].groups[1]);
  ok('nhóm điều kiện đạt chuẩn', cards0[0].groups[2].includes('đạt chuẩn'), cards0[0].groups[2]);
  ok('việc bài học có link thật', cards0[0].items.some((i) => i.link === 'co-link'));
  ok('chặng nêu sản phẩm đầu ra', cards0[0].project.includes('Sản phẩm'));
  ok('chặng nêu cách ôn lại', cards0[0].review.includes('Ôn lại'));
  ok('chặng nêu mục tiêu đo được', (await text('.stage-outcome')).includes('Làm được gì'));

  // ── 2. Thẻ "hôm nay học gì" ──────────────────────────────────────────────
  const today0 = await todaySnapshot();
  check('thẻ hôm nay có tiêu đề', today0.head, '🎯 Hôm nay học gì');
  ok('thẻ hôm nay ghi trục đang học', today0.track.includes('Java Backend'));
  ok('thẻ hôm nay ghi chặng 1/6', today0.stage.includes('Chặng 1/6'), today0.stage);
  ok('thẻ hôm nay nêu việc tiếp theo', today0.task.includes('Việc tiếp theo'), today0.task);
  ok('có nút làm ngay', today0.cta.includes('Làm ngay'));
  ok('có dòng thời gian học', today0.foot.includes('Tổng thời gian học'), today0.foot);
  ok('có nút quay về trang chủ', (await text('.hub-topbar .back-link')).includes('Trang chủ'));
  await evaluate("document.querySelector('.btn-start').click()");
  await sleep(1400);
  check('nút Làm ngay mở đúng bài học đầu tiên', await evaluate('location.pathname'), '/java/tu-zero');
  await go('/learning-paths');

  // ── 3. Cảnh báo tiên quyết là cảnh báo mềm ──────────────────────────────
  ok('chặng 2 nhắc nên học sau chặng 1', cards0[1].warn.includes('Java nền tảng'), cards0[1].warn);
  check('chặng 1 không có cảnh báo', cards0[0].warn, '');
  check('không chặn cứng chặng thiếu tiên quyết', await evaluate("document.querySelectorAll('.stage-card.locked, .stage-card[aria-disabled=\"true\"]').length"), 0);
  ok('vẫn bấm được vào chặng 2 dù thiếu tiên quyết', cards0[1].items.some((i) => i.link === 'co-link'));

  // ── 4. Tiến độ thật từ Phòng luyện code + quiz Java ─────────────────────
  await seed('sf_code_lab_solutions', {
    'two-sum': { solved: true, score: 120 },
    'reverse-string': { solved: true, score: 120 },
    'is-palindrome': { solved: true, score: 120 },
  });
  await seed('sf_java_tuzero_quiz', correctQuiz);
  await go('/learning-paths');
  const cards1 = await stageSnapshot();
  const codeItem = cards1[0].items.find((i) => i.detail.includes('bài đạt hết test'));
  ok('việc code hiện 3/3 bài đạt', codeItem && codeItem.detail === '3/3 bài đạt hết test', codeItem?.detail);
  ok('việc code được tick tự động', codeItem?.done === true);
  const quizItem = cards1[0].items.find((i) => i.detail.includes('câu đúng'));
  check('việc quiz hiện 27/27 câu và 27 câu đúng', quizItem?.detail, '27/27 câu · 27 câu đúng');
  ok('việc quiz được tick tự động', quizItem?.done === true);
  check('chặng 1 tăng lên 40% (2 việc tự chấm xong)', cards1[0].percent, '40%');
  ok('việc tự chấm không có nút tick tay', cards1[0].items.filter((i) => i.detail.includes('bài đạt hết test')).every((i) => i.link === 'co-link'));

  // ── 5. Đánh dấu đạt chuẩn chặng: 100%, mở khoá chặng sau ────────────────
  await clickText('.stage-card .btn-mark', 'Đạt chuẩn chặng này');
  await sleep(700);
  const cards2 = await stageSnapshot();
  check('chặng 1 đạt 100%', cards2[0].percent, '100%');
  check('chặng 1 xong 5/5 việc', cards2[0].count, '5/5 việc');
  ok('nút chuyển thành đã đạt chuẩn', cards2[0].mark.includes('Đã đạt chuẩn chặng'), cards2[0].mark);
  ok('có ghi ngày hoàn thành', cards2[0].date.startsWith('xong '), cards2[0].date);
  ok('thẻ chặng xong được tô khác', await evaluate("document.querySelector('.stage-card').classList.contains('done')"));
  check('cảnh báo tiên quyết chặng 2 biến mất', cards2[1].warn, '');
  const today2 = await todaySnapshot();
  ok('thẻ hôm nay nhảy sang chặng 2', today2.stage.includes('Chặng 2/6'), today2.stage);
  ok('tiến độ cả trục cập nhật', today2.foot.length > 0);

  // ── 6. Lưu qua tải lại ──────────────────────────────────────────────────
  await go('/learning-paths');
  const cards3 = await stageSnapshot();
  check('sau tải lại chặng 1 vẫn 100%', cards3[0].percent, '100%');
  check('sau tải lại việc vẫn tick đủ', cards3[0].count, '5/5 việc');

  // ── 7. Bỏ tick một việc thì tiến độ tụt xuống ───────────────────────────
  await evaluate("document.querySelector('.stage-card .item-check').click()");
  await sleep(600);
  const cards4 = await stageSnapshot();
  check('bỏ tick thì chặng 1 còn 80%', cards4[0].percent, '80%');
  ok('chặng 1 vẫn giữ đánh dấu đạt chuẩn', cards4[0].mark.includes('Đã đạt chuẩn'), cards4[0].mark);

  // ── 8. Nhắc ôn tập sau 7 ngày ───────────────────────────────────────────
  const nineDaysAgo = new Date(Date.now() - 9 * 86400000).toISOString();
  await seed('sf_learning_progress', {
    items: { 'jb-1:0': nineDaysAgo },
    stages: { 'jb-1': nineDaysAgo },
  });
  await seed('sf_timer_history', { totalMinutes: 810, sessions: 27, streak: 4 });
  await go('/learning-paths');
  const today3 = await todaySnapshot();
  ok('có nhắc ôn lại chặng cũ', today3.nudge.includes('Nên ôn lại'), today3.nudge);
  ok('nhắc đúng số ngày', today3.nudge.includes('9 ngày trước'), today3.nudge);
  ok('hiện tổng thời gian học từ Pomodoro', today3.foot.includes('14 giờ tập trung'), today3.foot);
  ok('hiện số ngày liên tiếp', today3.foot.includes('4 ngày liên tiếp'), today3.foot);

  // ── 9. Đổi trục lộ trình ────────────────────────────────────────────────
  await clickText('.track-tab', 'Tiếng Anh');
  await sleep(900);
  const enCards = await stageSnapshot();
  check('trục Tiếng Anh có 3 chặng', enCards.length, 3);
  ok('tab Tiếng Anh đang chọn', (await text('.track-tab.active')).includes('Tiếng Anh'));
  const enToday = await todaySnapshot();
  ok('thẻ hôm nay đổi theo trục', enToday.stage.includes('Chặng 1/3'), enToday.stage);
  await clickText('.track-tab', 'DevOps');
  await sleep(800);
  check('trục DevOps có 4 chặng', (await stageSnapshot()).length, 4);
  await clickText('.track-tab', 'Java Backend');
  await sleep(800);
  check('quay lại trục Java có 6 chặng', (await stageSnapshot()).length, 6);

  // ── 10. Quy tắc học hiệu quả ────────────────────────────────────────────
  const rules = await json(`Array.from(document.querySelectorAll('.rules-card li')).map((li) => li.textContent.trim())`);
  check('có 6 quy tắc học hiệu quả', rules.length, 6);
  ok('quy tắc nói về ôn ngắt quãng', rules.some((r) => r.includes('Ôn ngắt quãng')));
  ok('quy tắc nói về học chủ động', rules.some((r) => r.includes('Học chủ động')));

  // ── 11. Quiz Java từ 0 không mất khi tải lại ────────────────────────────
  await seed('sf_java_tuzero_quiz', { chapter: {}, read: {} });
  await go('/java/tu-zero');
  const quizPick = await evaluate(`(() => {
    const btn = document.querySelector('.tz-quiz .quiz-opt:not(:disabled)');
    if (!btn) return 'KHONG_THAY';
    btn.click();
    return 'ok';
  })()`);
  check('bấm được đáp án quiz Java từ 0', quizPick, 'ok');
  await sleep(400);
  const savedQuiz = JSON.parse(await storage('sf_java_tuzero_quiz') || '{}');
  check('quiz được lưu ngay vào localStorage', Object.keys(savedQuiz.chapter || {}).length, 1);
  await go('/java/tu-zero');
  const quizAfter = await json(`({
    answered: document.querySelectorAll('.tz-quiz .quiz-opt:disabled').length,
    why: Array.from(document.querySelectorAll('.tz-quiz .quiz-why')).map((x) => x.textContent.trim()).join(' | ')
  })`);
  ok('sau tải lại đáp án vẫn còn', quizAfter.answered >= 4, `disabled=${quizAfter.answered}`);
  ok('sau tải lại vẫn hiện đúng/chưa đúng', quizAfter.why.includes('Đúng') || quizAfter.why.includes('Chưa đúng'), quizAfter.why);

  // ── 12. Task Thực chiến lưu được ────────────────────────────────────────
  await go('/java/thuc-chien');
  const beforeDone = await text('.stat-done .num');
  await evaluate("document.querySelectorAll('.done-btn')[0].click()");
  await sleep(500);
  const afterDone = await text('.stat-done .num');
  check('bấm đánh dấu thì bộ đếm tăng 1', Number(afterDone) - Number(beforeDone), 1);
  check('lưu danh sách task đã làm', JSON.parse(await storage('thucChien_done') || '[]').length, Number(afterDone));
  await go('/java/thuc-chien');
  check('sau tải lại vẫn giữ task đã làm', await text('.stat-done .num'), afterDone);
  await evaluate("document.querySelectorAll('.done-btn')[0].click()");
  await sleep(400);
  check('bỏ đánh dấu thì bộ đếm giảm', Number(await text('.stat-done .num')), Number(afterDone) - 1);

  // ── 13. Lộ trình đọc được tiến độ Thực chiến ────────────────────────────
  await seed('thucChien_done', Array.from({ length: 10 }, (_, i) => `task-${i}`));
  await go('/learning-paths');
  const cards5 = await stageSnapshot();
  const taskItem = cards5[4].items.find((i) => i.detail.includes('task đã đánh dấu xong'));
  ok('chặng Thực chiến đọc được 10 task', taskItem && taskItem.detail === '10 task đã đánh dấu xong', taskItem?.detail);
  ok('việc 10 task được tick', taskItem?.done === true);

  // ── 14. Quay về trang chủ ───────────────────────────────────────────────
  await evaluate("document.querySelector('.hub-topbar .back-link').click()");
  await sleep(1400);
  check('nút quay về đưa tới trang chủ', await evaluate('location.pathname'), '/');

  // ── 15. Màn hình hẹp không tràn ngang ───────────────────────────────────
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await go('/learning-paths', 1800);
  const mobile = await json(`({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    tabsVisible: document.querySelectorAll('.track-tab').length,
    todayVisible: Boolean(document.querySelector('.today-card'))
  })`);
  ok('390px không tràn ngang', mobile.overflow <= 1, `overflow=${mobile.overflow}px`);
  check('390px vẫn hiện đủ 5 tab trục', mobile.tabsVisible, 5);
  check('390px vẫn hiện thẻ hôm nay', mobile.todayVisible, true);
  await send('Emulation.clearDeviceMetricsOverride');

  // ── 16. Không lỗi JS, không tài nguyên lỗi ──────────────────────────────
  check('không có lỗi JS', errors, []);
  check('không có tài nguyên lỗi', failed, []);
} finally {
  const bad = results.filter((r) => !r).length;
  console.log(`\nTỔNG: ${results.length - bad}/${results.length} PASS`);
  ws.close();
  chrome.kill();
  process.exitCode = bad ? 1 : 0;
}
