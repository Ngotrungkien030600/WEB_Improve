// Test logic Phòng luyện code + tự kiểm chứng ngân hàng đề bài.
import {   deepEqual, judgeTest, summarize, scoreOf, maxScoreOf, rankOf, formatDuration,
  runTests, gradeRun, runSync, serialize, previewArgs, previewValue,
  filterProblems, categoriesOf, normalizeText, highlightJs, escapeHtml,
  saveSolution, readSolutions, readDrafts, saveDraft, resetProblem, progressOf,
  findDifficulty, findVerdict, speedBonus, DIFFICULTIES, RANKS,
  CODE_LANGUAGES, findCodeLanguage, functionNameFor, highlightCode, solutionFor, starterFor,
} from '../projects/web-app/src/logic/code-lab-logic.js';
import { CODE_PROBLEMS } from '../projects/web-app/src/data/code-problems.js';

const results = [];
function check(name, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push(pass);
  if (!pass) console.log(`FAIL | ${name} | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`);
  else console.log(`PASS | ${name}`);
}
const ok = (name, cond) => check(name, Boolean(cond), true);

// localStorage giả để test phần lưu bài
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

// ── 1. So khớp ──────────────────────────────────────────────────────────────
check('so khớp số', deepEqual(3, 3), true);
check('sai số', deepEqual(3, 4), false);
check('số thập phân lệch nhỏ vẫn đạt', deepEqual(0.1 + 0.2, 0.3), true);
check('mảng khác thứ tự thì sai (exact)', deepEqual([1, 2], [2, 1]), false);
check('mảng lồng nhau', deepEqual([[1, 2]], [[1, 2]]), true);
check('object khác khoá', deepEqual({ a: 1 }, { a: 2 }), false);
check('null và undefined khác nhau', deepEqual(null, undefined), false);
check('NaN bằng NaN', deepEqual(NaN, NaN), true);
check('không phân biệt thứ tự (unordered)', judgeTest([0, 1], [1, 0], 'unordered'), true);
check('unordered vẫn bắt sai độ dài', judgeTest([0, 1], [1], 'unordered'), false);
check('set-of-sets bỏ thứ tự cả hai tầng', judgeTest([['eat', 'tea'], ['bat']], [['bat'], ['tea', 'eat']], 'set-of-sets'), true);
check('set-of-sets phát hiện nhóm sai', judgeTest([['eat'], ['bat']], [['eat', 'bat']], 'set-of-sets'), false);
check('sorted-rows sắp theo phần tử đầu', judgeTest([[1, 6], [8, 10]], [[8, 10], [1, 6]], 'sorted-rows'), true);
check('sorted-rows bắt sai giá trị', judgeTest([[1, 6]], [[1, 7]], 'sorted-rows'), false);
check('sai kiểu dữ liệu', judgeTest('3', 3), false);

// ── 2. Tổng kết & điểm ─────────────────────────────────────────────────────
const verdictCases = summarize([
  { passed: true }, { passed: true }, { passed: true },
], 3);
check('đạt hết → AC', verdictCases.verdict, 'AC');
check('đếm số test đạt', verdictCases.passed, 3);
check('trượt → WA', summarize([{ passed: true }, { passed: false }], 2).verdict, 'WA');
check('có lỗi runtime → RE', summarize([{ passed: true, error: 'boom' }, { passed: false }], 2).verdict, 'RE');
check('có test bị bỏ → TLE', summarize([{ passed: true }, { skipped: true }], 2).verdict, 'TLE');
check('điểm dễ đạt hết', scoreOf({ difficulty: 'easy', passed: 5, total: 5, ms: 60 }), 112);
check('điểm trung bình đạt hết nhanh', scoreOf({ difficulty: 'medium', passed: 5, total: 5, ms: 120 }), 212);
check('điểm khó đạt 2/5', scoreOf({ difficulty: 'hard', passed: 2, total: 5, ms: 10 }), 120);
check('trượt hết thì 0 điểm', scoreOf({ difficulty: 'hard', passed: 0, total: 5, ms: 10 }), 0);
check('chạy chậm không có thưởng tốc độ', speedBonus(5000, true), 0);
check('trượt thì không có thưởng', speedBonus(10, false), 0);
check('điểm tối đa mỗi bài', [maxScoreOf({ difficulty: 'easy' }), maxScoreOf({ difficulty: 'hard' })], [120, 320]);
check('xếp hạng tân binh', rankOf(0).label, 'Tân binh');
check('xếp hạng thợ rèn', rankOf(900).label, 'Thợ rèn');
check('xếp hạng bậc thầy', rankOf(9999).label, 'Bậc thầy');
check('xếp hạng kế tiếp', rankOf(0).next.label, 'Tập sự');
check('hết hạng thì không còn hạng kế', rankOf(9999).next, undefined);
check('định dạng ms', formatDuration(12), '12 ms');
check('định dạng giây', formatDuration(1500), '1.50 s');
check('định dạng rỗng', formatDuration(null), '—');
check('độ khó mặc định khi id lạ', findDifficulty('xyz').id, 'easy');
check('verdict mặc định khi id lạ', findVerdict('xyz').id, 'WA');
check('có 3 mức độ khó', DIFFICULTIES.map((d) => d.id), ['easy', 'medium', 'hard']);
ok('có ít nhất 5 xếp hạng', RANKS.length >= 5);

// ── 3. Chạy code ───────────────────────────────────────────────────────────
const sumTests = [{ args: [1, 2], expected: 3 }, { args: [5, 5], expected: 10 }];
const goodRun = runSync({ code: 'function add(a, b) { return a + b; }', functionName: 'add', tests: sumTests });
check('code đúng → AC', goodRun.verdict, 'AC');
check('đếm đúng test đạt', [goodRun.passed, goodRun.total], [2, 2]);
const wrongRun = runSync({ code: 'function add(a, b) { return a - b; }', functionName: 'add', tests: sumTests });
check('code sai → WA', wrongRun.verdict, 'WA');
check('giữ lại kết quả thực tế', wrongRun.results[0].actual, -1);
const throwRun = runSync({ code: 'function add() { throw new Error("hỏng"); }', functionName: 'add', tests: sumTests });
check('code ném lỗi → RE', throwRun.verdict, 'RE');
check('thông báo lỗi được giữ', throwRun.results[0].error.includes('hỏng'), true);
const syntaxRun = runSync({ code: 'function add(a, b) { return a +; }', functionName: 'add', tests: sumTests });
check('sai cú pháp → CE', syntaxRun.verdict, 'CE');
ok('CE có thông báo', syntaxRun.compileError.length > 0);
const missingRun = runSync({ code: 'const other = 1;', functionName: 'add', tests: sumTests });
check('thiếu hàm → CE', missingRun.verdict, 'CE');
check('báo đúng tên hàm còn thiếu', missingRun.compileError.includes('add'), true);
const arrowRun = runSync({ code: 'const add = (a, b) => a + b;', functionName: 'add', tests: sumTests });
check('nhận cả arrow function', arrowRun.verdict, 'AC');
const logRun = runSync({ code: 'function add(a, b) { console.log("đang cộng", a); return a + b; }', functionName: 'add', tests: sumTests });
check('bắt được console.log', logRun.logs[0], 'đang cộng 1');
check('console.log không phá kết quả', logRun.verdict, 'AC');
const timeoutRun = gradeRun({ tests: sumTests, raw: { ok: true, results: [], logs: [] }, timedOut: true, timeoutMs: 6000 });
check('quá thời gian → TLE', timeoutRun.verdict, 'TLE');
const skipRun = runSync({ code: 'function add(a, b) { return a + b; }', functionName: 'add', tests: sumTests, budgetMs: -1 });
check('vượt ngân sách thời gian → TLE', skipRun.verdict, 'TLE');
check('test bị bỏ không tính là đạt', skipRun.passed, 0);
const mutateRun = runSync({
  code: 'function add(a, b) { a.push(99); return a.length; }',
  functionName: 'add',
  tests: [{ args: [[1]], expected: 2 }],
});
check('test không bị code người học sửa dữ liệu gốc', mutateRun.results[0].passed, true);
check('serialize undefined', serialize(undefined), 'undefined');
check('serialize NaN', serialize(NaN), 'NaN');
check('serialize Infinity', serialize(Infinity), 'Infinity');
check('serialize function', serialize(() => {}), '[Function anonymous]');
check('serialize mảng', serialize([1, 2]), [1, 2]);
check('serialize bigint', serialize(10n), '10n');
check('serialize object lồng', serialize({ a: [1] }), { a: [1] });
const circular = {};
circular.self = circular;
ok('serialize vòng lặp không ném lỗi', typeof serialize(circular) === 'string' || serialize(circular) !== undefined);
check('xem trước tham số', previewArgs([[1, 2], 'abc']), '[1,2], "abc"');
check('cắt bớt tham số dài', previewArgs(['x'.repeat(80)]).endsWith('...'), true);
check('xem trước kết quả', previewValue([1, 2]), '[1,2]');

// ── 4. Lọc, tìm kiếm ───────────────────────────────────────────────────────
check('bỏ dấu tiếng Việt', normalizeText('Đảo ngược'), 'dao nguoc');
check('lọc theo độ khó', filterProblems(CODE_PROBLEMS, { difficulty: 'easy' }).length, 3);
check('lọc theo chủ đề', filterProblems(CODE_PROBLEMS, { category: 'Chuỗi' }).length >= 1, true);
check('tìm không dấu ra kết quả', filterProblems(CODE_PROBLEMS, { query: 'dao nguoc' }).map((p) => p.id), ['reverse-string']);
check('tìm theo mô tả ngắn', filterProblems(CODE_PROBLEMS, { query: 'kadane' }).map((p) => p.id), ['max-subarray']);
check('tìm theo tên bài', filterProblems(CODE_PROBLEMS, { query: 'palindrome' }).map((p) => p.id), ['is-palindrome']);
const solvedMap = { 'two-sum': { solved: true }, 'max-subarray': { solved: false } };
check('lọc bài đã giải', filterProblems(CODE_PROBLEMS, { status: 'solved', solutions: solvedMap }).map((p) => p.id), ['two-sum']);
check('lọc bài chưa giải', filterProblems(CODE_PROBLEMS, { status: 'unsolved', solutions: { 'two-sum': { solved: true } } }).length, CODE_PROBLEMS.length - 1);
check('không lọc gì thì trả hết', filterProblems(CODE_PROBLEMS).length, CODE_PROBLEMS.length);
ok('có danh sách chủ đề', categoriesOf(CODE_PROBLEMS).length >= 5);

// ── 5. Tô màu cú pháp ─────────────────────────────────────────────────────
check('escape HTML', escapeHtml('<b>&'), '&lt;b&gt;&amp;');
const colored = highlightJs('const a = "x"; // ghi chú\nfunction f() { return 1; }');
check('tô màu từ khoá', colored.includes('tk-kw">const'), true);
check('tô màu chuỗi', colored.includes('tk-str">"x"'), true);
check('tô màu ghi chú', colored.includes('tk-com">// ghi chú'), true);
check('tô màu số', colored.includes('tk-num">1'), true);
check('tô màu tên hàm', colored.includes('tk-fn">f'), true);
ok('code trong chuỗi không bị tô màu từ khoá', !highlightJs('const s = "return const";').includes('tk-kw">const</span> const'));
check('escape khi tô màu', highlightJs('<script>').includes('&lt;script&gt;'), true);
ok('giữ nguyên xuống dòng', highlightJs('a\nb').includes('\n'));

// ── 6. Lưu bài & tiến độ ──────────────────────────────────────────────────
store.clear();
saveDraft('two-sum', 'code nháp');
check('lưu bản nháp', readDrafts()['two-sum'], 'code nháp');
let record = saveSolution('two-sum', { verdict: 'WA', passed: 3, total: 5, score: 60, ms: 12 });
check('lần nộp đầu chưa giải được', record.solved, false);
check('đếm số lần nộp', record.attempts, 1);
record = saveSolution('two-sum', { verdict: 'AC', passed: 5, total: 5, score: 112, ms: 40 });
check('đạt hết thì đánh dấu đã giải', record.solved, true);
check('đếm số lần nộp lần hai', record.attempts, 2);
check('giữ điểm cao nhất', record.score, 112);
record = saveSolution('two-sum', { verdict: 'AC', passed: 5, total: 5, score: 106, ms: 20 });
check('không hạ điểm cao nhất', record.score, 112);
check('giữ thời gian chạy nhanh nhất', record.ms, 20);
check('lưu verdict gần nhất', record.lastVerdict, 'AC');
check('đọc lại lời giải', readSolutions()['two-sum'].solved, true);
const progress = progressOf(CODE_PROBLEMS, readSolutions());
check('đếm bài đã giải', progress.solved, 1);
check('tổng điểm', progress.score, 112);
check('phần trăm hoàn thành', progress.percent, Math.round((1 / CODE_PROBLEMS.length) * 100));
check('điểm tối đa toàn bộ', progress.maxScore, CODE_PROBLEMS.reduce((sum, p) => sum + maxScoreOf(p), 0));
check('thống kê theo độ khó', progress.byDifficulty.easy.solved, 1);
check('xếp hạng theo điểm', progress.rank.label, 'Tân binh');
resetProblem('two-sum');
check('xoá bài đã làm', readSolutions()['two-sum'], undefined);
check('xoá luôn bản nháp', readDrafts()['two-sum'], undefined);
check('tiến độ về 0', progressOf(CODE_PROBLEMS, readSolutions()).solved, 0);

// ── 7. Kiểm chứng ngân hàng đề bài ────────────────────────────────────────
const ids = CODE_PROBLEMS.map((p) => p.id);
check('id không trùng', new Set(ids).size, ids.length);
CODE_PROBLEMS.forEach((problem) => {
  const label = `${problem.id}`;
  ok(`${label}: có mô tả`, problem.description.length > 0);
  ok(`${label}: có ví dụ`, problem.examples.length > 0);
  ok(`${label}: có gợi ý`, problem.hints.length > 0);
  ok(`${label}: có ràng buộc`, problem.constraints.length > 0);
  ok(`${label}: có test hiện`, problem.tests.some((t) => t.visible));
  ok(`${label}: ít nhất 4 test`, problem.tests.length >= 4);
  ok(`${label}: mọi test có expected`, problem.tests.every((t) => t.expected !== undefined));
  ok(`${label}: starter khai báo đúng tên hàm`, problem.starter.includes(`function ${problem.functionName}`));
  ok(`${label}: lời giải khai báo đúng tên hàm`, problem.solution.includes(`function ${problem.functionName}`));

  const solved = runSync({
    code: problem.solution,
    functionName: problem.functionName,
    tests: problem.tests,
    compare: problem.compare || 'exact',
  });
  if (solved.verdict !== 'AC') {
    const bad = solved.results.filter((r) => !r.passed).map((r) => `#${r.index} mong đợi ${JSON.stringify(r.expected)} nhận ${JSON.stringify(r.actual)}${r.error ? ` lỗi ${r.error}` : ''}`);
    console.log(`  ↳ ${problem.id} lời giải sai: ${bad.join(' | ')}`);
  }
  check(`${label}: lời giải mẫu đạt hết test`, solved.verdict, 'AC');

  const starter = runSync({
    code: problem.starter,
    functionName: problem.functionName,
    tests: problem.tests,
    compare: problem.compare || 'exact',
  });
  ok(`${label}: code khởi tạo chưa đạt`, starter.verdict !== 'AC');
});

// ── Tô màu theo ngôn ngữ + danh sách ngôn ngữ ───────────────────────────────
check('có 4 ngôn ngữ', CODE_LANGUAGES.map((item) => item.id), ['javascript', 'nodejs', 'java', 'python']);
check('JavaScript chạy ở trình duyệt', findCodeLanguage('javascript').runtime, 'browser');
check('Java chạy ở máy chủ', findCodeLanguage('java').runtime, 'server');
check('ngôn ngữ lạ trả về JavaScript', findCodeLanguage('ruby').id, 'javascript');

const javaSample = highlightCode('public static int add(int a, int b) { // cộng\n  return a + b;\n}', 'java');
ok('Java: tô màu từ khoá', javaSample.includes('<span class="tk-kw">public</span>'));
ok('Java: tô màu kiểu dữ liệu', javaSample.includes('<span class="tk-kw">int</span>'));
ok('Java: tô màu chú thích', javaSample.includes('<span class="tk-com">// cộng</span>'));
ok('Java: tô màu tên hàm', javaSample.includes('<span class="tk-fn">add</span>'));
const pySample = highlightCode('def add(a, b):\n    # cộng hai số\n    return a + b', 'python');
ok('Python: tô màu def', pySample.includes('<span class="tk-kw">def</span>'));
ok('Python: tô màu chú thích #', pySample.includes('<span class="tk-com"># cộng hai số</span>'));
ok('Python: tô màu hàm dựng sẵn', pySample.includes('<span class="tk-fn">add</span>'));
const pyString = highlightCode('s = "# không phải chú thích"', 'python');
ok('Python: dấu # trong chuỗi không thành chú thích', !pyString.includes('tk-com'));
const jsSample = highlightCode('function add(a, b) { return a + b; }', 'javascript');
ok('JavaScript: vẫn tô màu từ khoá', jsSample.includes('<span class="tk-kw">function</span>'));
ok('JavaScript: vẫn tô màu tên hàm', jsSample.includes('<span class="tk-fn">add</span>'));
ok('không có nhóm bắt nào rỗng làm hỏng tô màu', !javaSample.includes('><span'));

check('tên hàm Python đổi sang snake_case', functionNameFor({ functionName: 'twoSum' }, 'python'), 'two_sum');
check('tên hàm Java giữ nguyên', functionNameFor({ functionName: 'twoSum' }, 'java'), 'twoSum');
check('code khởi tạo Java', starterFor({ javaStarter: 'java-code', starter: 'js-code' }, 'java'), 'java-code');
check('code khởi tạo Python', starterFor({ pythonStarter: 'py-code', starter: 'js-code' }, 'python'), 'py-code');
check('code khởi tạo JavaScript', starterFor({ javaStarter: 'java-code', starter: 'js-code' }, 'javascript'), 'js-code');
check('lời giải Java', solutionFor({ javaSolution: 'java-sol', solution: 'js-sol' }, 'java'), 'java-sol');
check('lời giải Node dùng chung với JavaScript', solutionFor({ solution: 'js-sol' }, 'nodejs'), 'js-sol');

const failed = results.filter((r) => !r).length;
console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS`);
process.exitCode = failed ? 1 : 0;
