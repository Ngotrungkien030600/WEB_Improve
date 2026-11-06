// Kiểm chứng bộ chấm đa ngôn ngữ: sinh harness + chạy thật javac/node/py.
import * as judgeModule from '../projects/web-en/server/code-judge.js';

const { snakeCase, javaLiteral, isLoopback, isCodeRunAllowed, buildSources, judgeOnServer, probeLanguages } = judgeModule;

const results = [];
function check(name, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`);
}
const ok = (name, cond) => check(name, Boolean(cond), true);

// ── 1. Hàm thuần ────────────────────────────────────────────────────────────
check('đổi tên hàm sang snake_case', snakeCase('lengthOfLongestSubstring'), 'length_of_longest_substring');
check('snake_case giữ nguyên tên ngắn', snakeCase('twoSum'), 'two_sum');
check('snake_case với chữ số', snakeCase('merge2Intervals'), 'merge2_intervals');
check('literal int', javaLiteral(9, 'int'), '9');
check('literal int cắt phần thập phân', javaLiteral(9.7, 'int'), '9');
check('literal boolean', javaLiteral(true, 'boolean'), 'true');
check('literal String có escape', javaLiteral('a"b\\c', 'String'), '"a\\"b\\\\c"');
check('literal int[]', javaLiteral([2, 7, 11], 'int[]'), 'new int[]{2, 7, 11}');
check('literal String[]', javaLiteral(['eat', 'tea'], 'String[]'), 'new String[]{"eat", "tea"}');
check('literal int[][]', javaLiteral([[1, 3], [2, 6]], 'int[][]'), 'new int[][]{new int[]{1, 3}, new int[]{2, 6}}');
check('literal String[][]', javaLiteral([['a'], ['b', 'c']], 'String[][]'), 'new String[][]{new String[]{"a"}, new String[]{"b", "c"}}');
check('kiểu lạ thì báo lỗi', (() => { try { javaLiteral(1, 'float'); return 'khong-loi'; } catch (err) { return 'co-loi'; } })(), 'co-loi');
check('loopback 127.0.0.1', isLoopback('127.0.0.1'), true);
check('loopback ::1', isLoopback('::1'), true);
check('loopback dạng IPv4-mapped', isLoopback('::ffff:127.0.0.1'), true);
check('IP ngoài không phải loopback', isLoopback('203.0.113.9'), false);
check('địa chỉ rỗng không phải loopback', isLoopback(''), false);
check('localhost thì cho chạy', isCodeRunAllowed({ remoteAddress: '127.0.0.1' }), true);
check('IP ngoài thì từ chối', isCodeRunAllowed({ remoteAddress: '203.0.113.9' }), false);
check('IP ngoài nhưng bật cờ thì cho chạy', isCodeRunAllowed({ remoteAddress: '203.0.113.9', allowFlag: true }), true);

const sources = buildSources({
  language: 'java',
  code: 'public static int add(int a, int b) { return a + b; }',
  functionName: 'add',
  tests: [{ args: [1, 2], expected: 3 }],
  params: ['int', 'int'],
  returns: 'int',
});
ok('harness Java sinh ra tệp Main.java', Boolean(sources['Main.java']));
ok('harness Java gọi đúng hàm', sources['Main.java'].includes('add(1, 2)'));
ok('harness Java in cờ __RESULT__', sources['Main.java'].includes('__RESULT__'));
const nodeSources = buildSources({ language: 'nodejs', code: 'x', functionName: 'add', tests: [] });
ok('harness Node dùng lại logic chấm của web-app', nodeSources['harness.mjs'].includes('gradeRun'));
const pySources = buildSources({ language: 'python', code: 'def add(a, b):\n    return a + b', functionName: 'add', tests: [] });
ok('harness Python sinh 2 tệp', Boolean(pySources['runner.py'] && pySources['solution.py']));
ok('harness Python gọi tên snake_case', pySources['runner.py'].includes("getattr(module, \"add\""));

// ── 2. Chạy thật bằng 3 ngôn ngữ ────────────────────────────────────────────
const addTests = [{ args: [1, 2], expected: 3 }, { args: [10, 5], expected: 15 }];
const sumTests = [{ args: [[2, 7, 11, 15], 9], expected: [0, 1], }, { args: [[3, 3], 6], expected: [0, 1] }];

const cases = [
  {
    language: 'nodejs',
    label: 'Node.js',
    good: 'function add(a, b) { return a + b; }',
    bad: 'function add(a, b) { return a - b; }',
    broken: 'function add(a, b) { return a + ; }',
    thrower: "function add() { throw new Error('hỏng'); }",
    looper: 'function add() { while (true) {} }',
  },
  {
    language: 'java',
    label: 'Java',
    good: 'public static int add(int a, int b) { return a + b; }',
    bad: 'public static int add(int a, int b) { return a - b; }',
    broken: 'public static int add(int a, int b) { return a + ; }',
    thrower: 'public static int add(int a, int b) { throw new RuntimeException("hỏng"); }',
    looper: 'public static int add(int a, int b) { while (true) {} }',
  },
  {
    language: 'python',
    label: 'Python',
    good: 'def add(a, b):\n    return a + b',
    bad: 'def add(a, b):\n    return a - b',
    broken: 'def add(a, b)\n    return a + b',
    thrower: 'def add(a, b):\n    raise RuntimeError("hỏng")',
    looper: 'def add(a, b):\n    while True:\n        pass',
  },
];

for (const item of cases) {
  const base = { language: item.language, functionName: 'add', tests: addTests, params: ['int', 'int'], returns: 'int' };
  const good = await judgeOnServer({ ...base, code: item.good });
  check(`${item.label}: code đúng → Đạt hết`, good.verdict, 'AC');
  check(`${item.label}: đếm đủ 2 test`, [good.passed, good.total], [2, 2]);
  const bad = await judgeOnServer({ ...base, code: item.bad });
  check(`${item.label}: code sai → Sai kết quả`, bad.verdict, 'WA');
  ok(`${item.label}: giữ kết quả thực tế để hiển thị`, bad.results[0].actual !== undefined);
  const broken = await judgeOnServer({ ...base, code: item.broken });
  check(`${item.label}: sai cú pháp → Lỗi cú pháp`, broken.verdict, 'CE');
  ok(`${item.label}: có thông báo lỗi`, broken.compileError.length > 0);
  const thrower = await judgeOnServer({ ...base, code: item.thrower });
  check(`${item.label}: ném lỗi → Lỗi khi chạy`, thrower.verdict, 'RE');
  const looper = await judgeOnServer({ ...base, code: item.looper });
  check(`${item.label}: vòng lặp vô hạn → Quá thời gian`, looper.verdict, 'TLE');
  const missing = await judgeOnServer({ ...base, code: item.language === 'java' ? 'public static int other() { return 1; }' : (item.language === 'python' ? 'def other():\n    return 1' : 'function other() { return 1; }') });
  check(`${item.label}: thiếu hàm → Lỗi cú pháp`, missing.verdict, 'CE');
}

// ── 3. So khớp không phân biệt thứ tự trên từng ngôn ngữ ────────────────────
const unorderedCases = [
  { language: 'nodejs', code: 'function twoSum(nums, target) { return [1, 0]; }' },
  { language: 'java', code: 'public static int[] twoSum(int[] nums, int target) { return new int[]{1, 0}; }' },
  { language: 'python', code: 'def two_sum(nums, target):\n    return [1, 0]' },
];
for (const item of unorderedCases) {
  const outcome = await judgeOnServer({
    language: item.language,
    code: item.code,
    functionName: 'twoSum',
    tests: [{ args: [[2, 7], 9], expected: [0, 1] }],
    params: ['int[]', 'int'],
    returns: 'int[]',
    compare: 'unordered',
  });
  check(`${item.language}: trả [1,0] cho đáp án [0,1] vẫn đạt (unordered)`, outcome.verdict, 'AC');
}

const setOfSets = await judgeOnServer({
  language: 'python',
  code: "def group_anagrams(words):\n    return [['bat'], ['tea', 'eat']]",
  functionName: 'groupAnagrams',
  tests: [{ args: [['eat', 'tea', 'bat']], expected: [['eat', 'tea'], ['bat']] }],
  params: ['String[]'],
  returns: 'String[][]',
  compare: 'set-of-sets',
});
check('Python: nhóm đảo chữ đổi thứ tự vẫn đạt (set-of-sets)', setOfSets.verdict, 'AC');

const sortedRows = await judgeOnServer({
  language: 'java',
  code: 'public static int[][] mergeIntervals(int[][] intervals) { return new int[][]{new int[]{8, 10}, new int[]{1, 6}}; }',
  functionName: 'mergeIntervals',
  tests: [{ args: [[[1, 3], [2, 6], [8, 10]]], expected: [[1, 6], [8, 10]] }],
  params: ['int[][]'],
  returns: 'int[][]',
  compare: 'sorted-rows',
});
check('Java: gộp khoảng đổi thứ tự vẫn đạt (sorted-rows)', sortedRows.verdict, 'AC');

// ── 4. Bắt console.log và từ chối ngôn ngữ không hợp lệ ────────────────────
const logged = await judgeOnServer({
  language: 'nodejs',
  code: 'function add(a, b) { console.log("tổng là", a + b); return a + b; }',
  functionName: 'add',
  tests: addTests,
  params: ['int', 'int'],
  returns: 'int',
});
ok('Node: bắt được console.log', (logged.logs || []).some((line) => line.includes('tổng là')));
const badLang = await judgeOnServer({ language: 'ruby', code: 'puts 1', functionName: 'x', tests: addTests });
check('ngôn ngữ lạ bị từ chối', badLang.verdict, 'CE');
const browserLang = await judgeOnServer({ language: 'javascript', code: 'x', functionName: 'add', tests: addTests });
check('JavaScript không gọi bộ chấm máy chủ', browserLang.compileError.includes('trình duyệt'), true);

// ── 5. Dò ngôn ngữ ─────────────────────────────────────────────────────────
const languages = await probeLanguages();
console.log('  ↳ máy chủ này có:', JSON.stringify(languages));
check('JavaScript luôn khả dụng', languages.javascript.available, true);
check('Node khả dụng', languages.nodejs.available, true);
check('Java khả dụng', languages.java.available, true);
check('Python khả dụng', languages.python.available, true);
ok('Java có số phiên bản', languages.java.version.length > 0);

const failed = results.filter((r) => !r).length;
console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS`);
process.exitCode = failed ? 1 : 0;
