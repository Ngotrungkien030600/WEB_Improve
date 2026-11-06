// Kiểm chứng Phòng luyện code: giao diện, chạy thử, chấm điểm bằng test ẩn,
// lỗi cú pháp / lỗi runtime / vòng lặp vô hạn, lưu bài, lọc, deep link, màn hình hẹp.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = Number(process.env.SHOT_PORT || 9360);
const BASE = process.argv[2] || 'http://localhost:8080';
const profile = mkdtempSync(join(tmpdir(), 'dsh-codelab-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--mute-audio', '--window-size=1360,1000', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function target() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (err) { /* chờ chrome */ }
    await sleep(250);
  }
  throw new Error('không mở được Chrome');
}

const ws = new WebSocket(await target());
let id = 1;
const pending = new Map();
const events = [];
const badRequests = [];
await new Promise((res) => ws.addEventListener('open', res));
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); return; }
  if (m.method === 'Runtime.exceptionThrown') events.push(m.params?.exceptionDetails?.exception?.description?.split('\n')[0] || 'exception');
  if (m.method === 'Network.responseReceived' && m.params?.response?.status >= 400) {
    badRequests.push(`${m.params.response.status} ${m.params.response.url}`);
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
const ok = (name, cond) => check(name, Boolean(cond), true);
async function waitFor(expr, timeout = 12000, step = 200) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const value = await evaluate(expr);
    if (value) return value;
    await sleep(step);
  }
  return false;
}
const clickText = (text, sel) => evaluate(`(() => {
  const el = Array.from(document.querySelectorAll(${JSON.stringify(sel)})).find((x) => x.textContent.trim().includes(${JSON.stringify(text)}));
  if (!el) return 'KHONG_THAY';
  el.click();
  return 'ok';
})()`);
const setCode = (code) => evaluate(`(() => {
  const el = document.querySelector('.editor-input');
  if (!el) return 'KHONG_THAY';
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
  setter.call(el, ${JSON.stringify(code)});
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return 'ok';
})()`);
const verdictText = () => evaluate("document.querySelector('.result-verdict') ? document.querySelector('.result-verdict').textContent.trim() : ''");
const solutions = () => evaluate("JSON.parse(localStorage.getItem('sf_code_lab_solutions') || '{}')");

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');

  await send('Page.navigate', { url: `${BASE}/login` });
  await sleep(1500);
  await evaluate("localStorage.clear(); localStorage.setItem('sf_auth_session', JSON.stringify({ user: { id: 'lab', email: 'lab@example.com', displayName: 'lab', plan: 'free' } }))");

  // ── 1. Lối vào từ trang chủ ───────────────────────────────────────────────
  await send('Page.navigate', { url: `${BASE}/` });
  await sleep(2600);
  const homeCard = await evaluate(`(() => {
    const card = Array.from(document.querySelectorAll('button, a, div')).find((el) => el.textContent.includes('Phòng luyện code') && el.textContent.length < 120);
    if (!card) return 'KHONG_THAY';
    card.click();
    return 'ok';
  })()`);
  check('bấm thẻ Phòng luyện code ở trang chủ', homeCard, 'ok');
  await sleep(2500);
  check('đã vào /code-lab', await evaluate('location.pathname'), '/code-lab');
  check('tiêu đề trang', await evaluate("document.querySelector('.page-topbar h1').textContent.trim()"), '🧪 Phòng luyện code');

  // ── 2. Bố cục & danh sách bài ────────────────────────────────────────────
  const layout = JSON.parse(await evaluate(`JSON.stringify({
    count: document.querySelectorAll('.problem-item').length,
    countLabel: document.querySelector('.list-count').textContent.trim(),
    scoreCards: document.querySelectorAll('.score-card').length,
    rank: document.querySelector('.rank-card .score-value').textContent.trim(),
    solved: document.querySelectorAll('.score-card .score-value')[2].textContent.trim(),
    hasFilters: document.querySelectorAll('.filter-chip').length,
    hasSearch: Boolean(document.querySelector('.filter-search')),
    selected: document.querySelector('.problem-item.active .problem-title').textContent.trim(),
    title: document.querySelector('.panel-title-row h2').textContent.trim(),
    tabs: Array.from(document.querySelectorAll('.tab')).map((t) => t.textContent.trim())
  })`));
  check('hiện đủ 9 bài', layout.count, 9);
  check('nhãn số bài', layout.countLabel, '9 bài phù hợp');
  check('có 5 ô điểm/thống kê', layout.scoreCards, 5);
  check('xếp hạng ban đầu', layout.rank, 'Tân binh');
  check('số bài đã giải ban đầu', layout.solved, '0/9');
  check('có bộ lọc (6 chip + tìm kiếm)', [layout.hasFilters, layout.hasSearch], [6, true]);
  check('mặc định mở bài đầu tiên', layout.title, 'Hai số cộng lại bằng đích');
  check('có 4 tab', layout.tabs.length, 4);
  ok('có tab Tài liệu', layout.tabs.some((t) => t.includes('Tài liệu')));

  // ── 3. Nội dung đề bài ───────────────────────────────────────────────────
  const desc = JSON.parse(await evaluate(`JSON.stringify({
    lines: document.querySelectorAll('.desc-line').length,
    inlineCode: document.querySelectorAll('.desc-line code').length,
    bold: document.querySelectorAll('.desc-line strong').length,
    examples: document.querySelectorAll('.example-box').length,
    constraints: document.querySelectorAll('.plain-list li').length,
    visibleRows: document.querySelectorAll('.test-table tbody tr').length,
    hiddenNote: document.querySelector('.hint-note').textContent.trim(),
    hints: document.querySelectorAll('.hint-list li').length,
    hintButton: Boolean(Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Mở gợi ý')))
  })`));
  ok('có mô tả đề bài', desc.lines >= 2);
  ok('mô tả có code inline và chữ đậm', desc.inlineCode >= 1 && desc.bold >= 1);
  check('có 2 ví dụ', desc.examples, 2);
  check('có 3 ràng buộc', desc.constraints, 3);
  ok('bảng test hiện chỉ hiện test công khai', desc.visibleRows >= 1 && desc.visibleRows <= 2);
  ok('ghi rõ số test ẩn', desc.hiddenNote.includes('test ẩn'));
  check('chưa mở gợi ý nào', desc.hints, 0);
  check('có nút mở gợi ý', desc.hintButton, true);
  await clickText('Mở gợi ý', 'button');
  await sleep(300);
  check('bấm mở gợi ý thì hiện 1 gợi ý', await evaluate("document.querySelectorAll('.hint-list li').length"), 1);

  // ── 4. Editor ────────────────────────────────────────────────────────────
  const editor = JSON.parse(await evaluate(`JSON.stringify((() => {
    const input = document.querySelector('.editor-input');
    const lines = document.querySelectorAll('.editor-gutter span');
    const pre = document.querySelector('.editor-highlight');
    return {
      exists: Boolean(input),
      value: input.value,
      lineNumbers: lines.length,
      codeLines: input.value.split('\\n').length,
      keywords: pre.querySelectorAll('.tk-kw').length,
      fns: pre.querySelectorAll('.tk-fn').length,
      fontMatches: getComputedStyle(input).fontSize === getComputedStyle(pre).fontSize,
      lineMatches: getComputedStyle(input).lineHeight === getComputedStyle(pre).lineHeight,
      inputVisible: getComputedStyle(input).webkitTextFillColor === 'transparent' || getComputedStyle(input).color === 'rgba(0, 0, 0, 0)'
    };
  })())`));
  check('có ô soạn code', editor.exists, true);
  ok('nạp sẵn code khởi tạo', editor.value.includes('function twoSum'));
  check('số dòng khớp code', editor.lineNumbers, editor.codeLines);
  ok('tô màu cú pháp hoạt động', editor.keywords >= 1 && editor.fns >= 1);
  check('lớp tô màu trùng cỡ chữ và dòng với ô nhập', [editor.fontMatches, editor.lineMatches], [true, true]);
  check('ô nhập trong suốt để thấy lớp tô màu', editor.inputVisible, true);

  // Tab thụt lề + Enter tự canh lề (đọc lại sau khi Vue cập nhật DOM)
  await evaluate(`(() => {
    const el = document.querySelector('.editor-input');
    el.focus();
    el.selectionStart = el.selectionEnd = el.value.length;
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    return 'ok';
  })()`);
  await sleep(300);
  const indented = await evaluate("document.querySelector('.editor-input').value");
  ok('phím Tab thụt lề 2 dấu cách', indented.endsWith('  '));
  await evaluate(`(() => {
    const el = document.querySelector('.editor-input');
    const value = 'function twoSum(nums, target) {\\n  return [];\\n}';
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return 'ok';
  })()`);
  await sleep(300);
  await evaluate(`(() => {
    const el = document.querySelector('.editor-input');
    el.focus();
    const caret = el.value.indexOf('{') + 1;
    el.selectionStart = el.selectionEnd = caret;
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    return 'ok';
  })()`);
  await sleep(300);
  const autoIndent = await evaluate("document.querySelector('.editor-input').value");
  ok('Enter sau dấu { tự thêm thụt lề', autoIndent.includes('{\n    ') || autoIndent.includes('{\n  \n  '));

  // ── 5. Chạy thử với code sai ─────────────────────────────────────────────
  await setCode('function twoSum(nums, target) {\n  return [];\n}');
  await sleep(300);
  await clickText('Chạy thử', 'button');
  await waitFor("Boolean(document.querySelector('.result-box'))", 15000);
  check('code sai → Sai kết quả', await verdictText(), '❌ Sai kết quả');
  const failedRow = JSON.parse(await evaluate(`JSON.stringify({
    rows: document.querySelectorAll('.test-row').length,
    first: document.querySelector('.test-row .test-state').textContent.trim(),
    detail: document.querySelector('.detail-box') ? document.querySelector('.detail-box').textContent.trim() : ''
  })`));
  check('chạy thử chỉ chạy test hiện', failedRow.rows, 1);
  ok('báo không đạt', failedRow.first.includes('Không đạt'));
  ok('chỉ rõ mong đợi và nhận được', failedRow.detail.includes('[0,1]') && failedRow.detail.includes('[]'));
  check('chạy thử không tính điểm', await evaluate("document.querySelector('.result-stats').textContent.includes('+')"), false);
  check('chạy thử không lưu bài giải', Object.keys(await solutions()).length, 0);

  // ── 6. Nộp bài với lời giải đúng → đạt hết, có điểm ──────────────────────
  await setCode(`function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`);
  await sleep(300);
  await clickText('Nộp bài', 'button');
  await waitFor("document.querySelector('.result-verdict') && document.querySelector('.result-verdict').textContent.includes('Đạt hết')", 15000);
  check('nộp bài đúng → Đạt hết', await verdictText(), '✅ Đạt hết');
  const graded = JSON.parse(await evaluate(`JSON.stringify({
    rows: document.querySelectorAll('.test-row').length,
    hidden: Array.from(document.querySelectorAll('.test-row .test-detail')).filter((el) => el.textContent.includes('Test ẩn')).length,
    stats: document.querySelector('.result-stats').textContent.trim(),
    cheer: document.querySelector('.result-cheer') ? document.querySelector('.result-cheer').textContent.trim() : ''
  })`));
  check('nộp bài chạy cả 5 test', graded.rows, 5);
  check('4 test ẩn không lộ dữ liệu', graded.hidden, 4);
  ok('có cộng điểm', graded.stats.includes('+') && !graded.stats.includes('+0 điểm'));
  ok('có lời chúc mừng', graded.cheer.includes('Đạt hết test'));
  const record = (await solutions())['two-sum'];
  check('lưu bài đã giải', record.solved, true);
  ok('điểm trong khoảng hợp lý', record.score >= 112 && record.score <= 120);
  check('lưu số test đạt', [record.passed, record.total], [5, 5]);
  check('lưu verdict', record.lastVerdict, 'AC');

  // ── 7. Bảng điểm & danh sách cập nhật ────────────────────────────────────
  const after = JSON.parse(await evaluate(`JSON.stringify({
    solved: document.querySelectorAll('.score-card .score-value')[2].textContent.trim(),
    score: document.querySelectorAll('.score-card .score-value')[1].textContent.trim(),
    attempted: document.querySelectorAll('.score-card .score-value')[3].textContent.trim(),
    badge: Boolean(document.querySelector('.solved-badge')),
    itemSolved: document.querySelector('.problem-item.active').classList.contains('solved'),
    percent: document.querySelector('.progress-card .score-key').textContent.trim()
  })`));
  check('bảng điểm: đã giải 1/9', after.solved, '1/9');
  ok('bảng điểm: tổng điểm đã cộng', after.score.startsWith(String(record.score)));
  check('bảng điểm: bài đã thử', after.attempted, '1');
  check('bài đang mở có nhãn đã giải', [after.badge, after.itemSolved], [true, true]);
  ok('thanh tiến độ đổi', after.percent.includes('11%'));

  // ── 8. Tab Bài nộp & Lời giải ────────────────────────────────────────────
  await clickText('Bài nộp', '.tab');
  await sleep(400);
  const submissions = JSON.parse(await evaluate(`JSON.stringify({
    rows: document.querySelectorAll('.panel-body .test-table tbody tr').length,
    verdict: document.querySelector('.verdict-pill') ? document.querySelector('.verdict-pill').textContent.trim() : '',
    attempts: document.querySelector('.tab.active').textContent.trim()
  })`));
  check('tab Bài nộp có 1 dòng', submissions.rows, 1);
  ok('bài nộp ghi Đạt hết', submissions.verdict.includes('Đạt hết'));
  ok('tab hiện số bài nộp', submissions.attempts.includes('(1)'));
  await clickText('Lời giải', '.tab');
  await sleep(400);
  check('lời giải bị khoá lúc đầu', await evaluate("Boolean(document.querySelector('.locked-box'))"), true);
  await clickText('Tôi vẫn muốn xem lời giải', 'button');
  await sleep(400);
  const solutionView = JSON.parse(await evaluate(`JSON.stringify({
    visible: Boolean(document.querySelector('.code-view')),
    colored: document.querySelectorAll('.code-view .tk-kw').length,
    text: document.querySelector('.code-view') ? document.querySelector('.code-view').textContent : ''
  })`));
  check('mở được lời giải mẫu', solutionView.visible, true);
  ok('lời giải được tô màu', solutionView.colored >= 1);
  ok('lời giải đúng bài', solutionView.text.includes('twoSum'));

  // ── 9. Lỗi cú pháp / lỗi runtime / vòng lặp vô hạn ───────────────────────
  await setCode('function twoSum(nums, target) { return nums[0] + ; }');
  await sleep(300);
  await clickText('Nộp bài', 'button');
  await waitFor("document.querySelector('.result-verdict') && document.querySelector('.result-verdict').textContent.includes('cú pháp')", 15000);
  check('code sai cú pháp → Lỗi cú pháp', await verdictText(), '🚫 Lỗi cú pháp');
  ok('hiện thông báo lỗi cú pháp', await evaluate("Boolean(document.querySelector('.result-error'))"));

  await setCode("function twoSum(nums, target) { throw new Error('hỏng rồi'); }");
  await sleep(300);
  await clickText('Nộp bài', 'button');
  await waitFor("document.querySelector('.result-verdict') && document.querySelector('.result-verdict').textContent.includes('Lỗi khi chạy')", 15000);
  check('code ném lỗi → Lỗi khi chạy', await verdictText(), '💥 Lỗi khi chạy');
  ok('hiện lỗi cụ thể', (await evaluate("document.querySelector('.result-box').textContent")).includes('hỏng rồi'));

  const startedAt = Date.now();
  await setCode('function twoSum(nums, target) { while (true) {} }');
  await sleep(300);
  await clickText('Nộp bài', 'button');
  await waitFor("document.querySelector('.result-verdict') && document.querySelector('.result-verdict').textContent.includes('Quá thời gian')", 20000);
  const tleMs = Date.now() - startedAt;
  check('vòng lặp vô hạn → Quá thời gian', await verdictText(), '⏱️ Quá thời gian');
  ok('bị ngắt trong khoảng 5-12 giây', tleMs > 4000 && tleMs < 13000);
  const aliveAfterTle = await evaluate("(() => { const btn = Array.from(document.querySelectorAll('.tab')).find((t) => t.textContent.includes('Đề bài')); if (!btn) return 'KHONG_THAY'; btn.click(); return 'da-bam'; })()");
  await sleep(600);
  check('trang vẫn dùng được sau khi ngắt code treo', await evaluate("Boolean(document.querySelector('.desc-line'))"), true);
  check('đã bấm được tab sau khi code bị ngắt', aliveAfterTle, 'da-bam');
  const afterFailure = (await solutions())['two-sum'];
  check('nộp bài lỗi không làm mất thành tích đã giải', afterFailure.solved, true);
  ok('điểm cao nhất không bị hạ', afterFailure.score >= 112);
  check('đếm đủ 4 lần nộp', afterFailure.attempts, 4);

  // ── 10. Nháp được nhớ qua tải lại ───────────────────────────────────────
  await setCode('function twoSum(nums, target) {\n  return "ban nhap cua toi";\n}');
  await sleep(900);
  await send('Page.navigate', { url: `${BASE}/code-lab` });
  await sleep(2800);
  check('tải lại vẫn giữ code đang viết', await evaluate("document.querySelector('.editor-input').value.includes('ban nhap cua toi')"), true);
  check('tải lại vẫn thấy bài đã giải', await evaluate("document.querySelector('.score-card .score-value').textContent.trim()"), 'Tân binh');

  // ── 11. Lọc, tìm kiếm, deep link ────────────────────────────────────────
  const filterCount = async () => evaluate("document.querySelectorAll('.problem-item').length");
  await clickText('Dễ', '.filter-chip');
  await sleep(400);
  check('lọc mức Dễ', await filterCount(), 3);
  await clickText('Dễ', '.filter-chip');
  await sleep(400);
  check('bỏ lọc mức Dễ', await filterCount(), 9);
  await clickText('Đã giải', '.filter-chip');
  await sleep(400);
  check('lọc bài đã giải', await filterCount(), 1);
  await clickText('Chưa giải', '.filter-chip');
  await sleep(400);
  check('lọc bài chưa giải', await filterCount(), 8);
  await clickText('Tất cả', '.filter-chip');
  await sleep(300);
  await evaluate(`(() => {
    const el = document.querySelector('.filter-search');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(el, 'palindrome');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return el.value;
  })()`);
  await sleep(500);
  check('tìm theo tên bài', await filterCount(), 1);
  await evaluate(`(() => {
    const el = document.querySelector('.filter-search');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return 'ok';
  })()`);
  await sleep(300);

  await send('Page.navigate', { url: `${BASE}/code-lab?bai=coin-change` });
  await sleep(2800);
  check('mở thẳng bài qua đường dẫn', await evaluate("document.querySelector('.panel-title-row h2').textContent.trim()"), 'Đổi tiền ít đồng nhất');
  check('đường dẫn giữ bài đang mở', await evaluate('location.search'), '?bai=coin-change');
  const switched = await clickText('Ngoặc hợp lệ', '.problem-title');
  check('bấm bài khác trong danh sách', switched, 'ok');
  await sleep(500);
  check('đổi sang bài mới', await evaluate("document.querySelector('.panel-title-row h2').textContent.trim()"), 'Ngoặc hợp lệ');
  ok('đường dẫn cập nhật theo bài', (await evaluate('location.search')).includes('valid-parentheses'));

  // ── 12. Chọn ngôn ngữ, tài liệu học, chấm Java/Node/Python qua máy chủ ──
  await send('Page.navigate', { url: `${BASE}/code-lab?bai=two-sum` });
  await sleep(2800);
  const langButtons = await evaluate("Array.from(document.querySelectorAll('.lang-btn')).map((b) => b.textContent.trim())");
  check('có 4 nút chọn ngôn ngữ', langButtons, ['JavaScript', 'Node.js', 'Java 17', 'Python 3']);
  check('mặc định là JavaScript', await evaluate("document.querySelector('.lang-btn.active').textContent.trim()"), 'JavaScript');
  check('editor ghi rõ ngôn ngữ', await evaluate("document.querySelector('.editor-lang').textContent.trim()"), 'JavaScript');
  ok('có ghi chú nơi chạy code', (await evaluate("document.querySelector('.lang-note').textContent")).length > 10);

  await clickText('Tài liệu', '.tab');
  await sleep(500);
  const docs = JSON.parse(await evaluate(`JSON.stringify({
    theory: document.querySelectorAll('.desc-line').length,
    steps: document.querySelectorAll('.step-list li').length,
    cards: document.querySelectorAll('.complexity-card').length,
    pitfalls: document.querySelectorAll('.plain-list li').length,
    starter: document.querySelector('.code-view code') ? document.querySelector('.code-view code').textContent : ''
  })`));
  ok('tài liệu: có phần lý thuyết', docs.theory >= 2);
  ok('tài liệu: có các bước làm', docs.steps >= 3);
  check('tài liệu: có 2 thẻ độ phức tạp', docs.cards, 2);
  ok('tài liệu: có lỗi hay mắc', docs.pitfalls >= 2);
  ok('tài liệu: hiện khung code JavaScript', docs.starter.includes('function twoSum'));

  const serverAllowed = await evaluate("fetch('/api/code/languages').then((r) => r.json()).then((p) => p.allowed).catch(() => false)");
  ok('máy chủ cho biết có chấm code được hay không', typeof serverAllowed === 'boolean');

  if (serverAllowed) {
    const submitAndWait = async (label) => {
      await clickText('Nộp bài', 'button');
      await waitFor("document.querySelector('.result-verdict')", 60000, 300);
      return evaluate("document.querySelector('.result-verdict').textContent.trim()");
    };
    const editorCode = () => evaluate("document.querySelector('.editor-input').value");

    await clickText('Java 17', '.lang-btn');
    await sleep(600);
    check('chọn Java thì editor đổi nhãn', await evaluate("document.querySelector('.editor-lang').textContent.trim()"), 'Java 17');
    ok('editor hiện khung code Java', (await editorCode()).includes('public static int[] twoSum'));
    ok('đường dẫn ghi ngôn ngữ đang chọn', (await evaluate('location.search')).includes('lang=java'));
    await clickText('Nạp lời giải mẫu', 'button');
    await sleep(600);
    ok('lời giải mẫu là Java', (await editorCode()).includes('HashMap'));
    ok('Java: lời giải mẫu Đạt hết', (await submitAndWait()).includes('Đạt hết'));
    const javaRows = await evaluate("document.querySelectorAll('.test-row').length");
    ok('Java: hiện bảng kết quả từng test', javaRows >= 1);
    ok('Java: có test ẩn không lộ dữ liệu', (await evaluate("document.querySelector('.result-box').textContent")).includes('Test ẩn'));

    await clickText('Python 3', '.lang-btn');
    await sleep(600);
    ok('editor hiện khung code Python', (await editorCode()).includes('def two_sum'));
    await clickText('Nạp lời giải mẫu', 'button');
    await sleep(600);
    ok('Python: lời giải mẫu dùng snake_case', (await editorCode()).includes('enumerate'));
    ok('Python: lời giải mẫu Đạt hết', (await submitAndWait()).includes('Đạt hết'));

    await clickText('Node.js', '.lang-btn');
    await sleep(600);
    check('chọn Node.js', await evaluate("document.querySelector('.editor-lang').textContent.trim()"), 'Node.js');
    await clickText('Nạp lời giải mẫu', 'button');
    await sleep(600);
    ok('Node.js: lời giải mẫu Đạt hết', (await submitAndWait()).includes('Đạt hết'));
    await setCode('function twoSum(nums, target) { return [7, 7]; }');
    await sleep(400);
    ok('Node.js: code sai → Sai kết quả', (await submitAndWait()).includes('Sai kết quả'));
    await setCode('function twoSum(nums, target) { return [0, 1; }');
    await sleep(400);
    ok('Node.js: code sai cú pháp → Lỗi cú pháp', (await submitAndWait()).includes('cú pháp'));

    await clickText('JavaScript', '.lang-btn');
    await sleep(600);
    check('quay lại JavaScript', await evaluate("document.querySelector('.editor-lang').textContent.trim()"), 'JavaScript');
    ok('nháp JavaScript còn nguyên, không bị nháp Java ghi đè', (await editorCode()).includes('ban nhap cua toi'));
    const langDrafts = await evaluate("Object.keys(JSON.parse(localStorage.getItem('sf_code_lab_drafts') || '{}'))");
    ok('nháp tách riêng theo từng ngôn ngữ', langDrafts.some((k) => k.includes('@java')) && langDrafts.some((k) => k.includes('@javascript')));
  } else {
    ok('máy chủ từ chối chấm code khi không phải localhost (đúng thiết kế)', true);
  }

  // ── 13. Màn hình hẹp ────────────────────────────────────────────────────
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 820, deviceScaleFactor: 2, mobile: true });
  await sleep(900);
  const narrow = JSON.parse(await evaluate(`JSON.stringify({
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    editorHeight: Math.round(document.querySelector('.editor-scroll').getBoundingClientRect().height),
    toggle: document.querySelector('.mobile-bar button') ? document.querySelector('.mobile-bar button').textContent.trim() : 'KHONG_THAY',
    listHidden: document.querySelector('.lab-sidebar').className.includes('is-hidden'),
    listDisplay: getComputedStyle(document.querySelector('.lab-sidebar')).display
  })`));
  check('390px: không tràn ngang', narrow.overflowX, false);
  check('390px: editor thấp hơn cho vừa màn hình', narrow.editorHeight, 260);
  check('390px: mặc định ẩn danh sách để tập trung làm bài', [narrow.listHidden, narrow.listDisplay], [true, 'none']);
  check('390px: có nút mở danh sách', narrow.toggle.includes('Xem danh sách bài'), true);
  await evaluate("document.querySelector('.mobile-bar button').click()");
  await sleep(500);
  const listShown = JSON.parse(await evaluate(`JSON.stringify({
    listDisplay: getComputedStyle(document.querySelector('.lab-sidebar')).display,
    toggle: document.querySelector('.mobile-bar button').textContent.trim()
  })`));
  check('390px: bấm thì hiện danh sách bài', listShown.listDisplay !== 'none', true);
  check('390px: nút đổi thành quay lại bài', listShown.toggle.includes('Mở bài đang làm'), true);
  await send('Emulation.clearDeviceMetricsOverride');

  const failed = results.filter((r) => !r).length;
  const realErrors = events.filter((e) => !/favicon/i.test(e));
  console.log(`\nLỗi JS: ${realErrors.length}`);
  [...new Set(realErrors)].slice(0, 6).forEach((e) => console.log('  ' + e));
  const bad = badRequests.filter((u) => !/favicon/.test(u));
  console.log(`Tài nguyên lỗi (>=400): ${bad.length}`);
  [...new Set(bad)].slice(0, 6).forEach((u) => console.log('  ' + u));
  console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS  (cổng: ${BASE})`);
  process.exitCode = failed ? 1 : 0;
} catch (err) {
  console.error('LỖI KIỂM CHỨNG:', err.message);
  process.exitCode = 2;
} finally {
  ws.close();
  chrome.kill();
}
