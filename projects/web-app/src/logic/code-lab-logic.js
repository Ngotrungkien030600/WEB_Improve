/**
 * Phòng luyện code — logic thuần, không phụ thuộc framework.
 * Chạy code người học bằng new Function trong Web Worker (xem workers/code-worker.js),
 * so khớp kết quả và tính điểm ở đây để test được bằng Node.
 */

export const DIFFICULTIES = [
  { id: 'easy', label: 'Dễ', color: '#34d399', points: 100 },
  { id: 'medium', label: 'Trung bình', color: '#f59e0b', points: 200 },
  { id: 'hard', label: 'Khó', color: '#f472b6', points: 300 },
];

export const VERDICTS = {
  AC: { id: 'AC', label: 'Đạt hết', emoji: '✅', tone: 'ok' },
  WA: { id: 'WA', label: 'Sai kết quả', emoji: '❌', tone: 'bad' },
  TLE: { id: 'TLE', label: 'Quá thời gian', emoji: '⏱️', tone: 'warn' },
  RE: { id: 'RE', label: 'Lỗi khi chạy', emoji: '💥', tone: 'bad' },
  CE: { id: 'CE', label: 'Lỗi cú pháp', emoji: '🚫', tone: 'bad' },
};

export const RANKS = [
  { min: 0, label: 'Tân binh', emoji: '🌱' },
  { min: 300, label: 'Tập sự', emoji: '⚒️' },
  { min: 800, label: 'Thợ rèn', emoji: '🔨' },
  { min: 1500, label: 'Kiếm sĩ', emoji: '⚔️' },
  { min: 2400, label: 'Cao thủ', emoji: '🏆' },
  { min: 3600, label: 'Bậc thầy', emoji: '👑' },
];

export const SOLUTIONS_KEY = 'sf_code_lab_solutions';
export const DRAFTS_KEY = 'sf_code_lab_drafts';

export function findDifficulty(id) {
  return DIFFICULTIES.find((item) => item.id === id) || DIFFICULTIES[0];
}

export function findVerdict(id) {
  return VERDICTS[id] || VERDICTS.WA;
}

// ── So khớp kết quả ─────────────────────────────────────────────────────────

const TOLERANCE = 1e-6;

export function deepEqual(a, b, tolerance = TOLERANCE) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b;
    return Math.abs(a - b) <= tolerance;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index], tolerance));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a).sort();
    const keysB = Object.keys(b).sort();
    if (keysA.length !== keysB.length) return false;
    if (!keysA.every((key, index) => key === keysB[index])) return false;
    return keysA.every((key) => deepEqual(a[key], b[key], tolerance));
  }
  return a === b;
}

function sortRows(rows) {
  return [...rows].map((row) => (Array.isArray(row) ? [...row] : [row])).sort((x, y) => {
    const first = String(x[0]).localeCompare(String(y[0]), 'en', { numeric: true });
    return first !== 0 ? first : String(x[1]).localeCompare(String(y[1]), 'en', { numeric: true });
  });
}

/**
 * compare: 'exact' (mặc định) | 'unordered' (mảng không phân biệt thứ tự)
 *        | 'set-of-sets' (mảng các mảng, cả trong lẫn ngoài không phân biệt thứ tự)
 *        | 'sorted-rows' (mảng các cặp, sắp theo phần tử đầu)
 */
export function judgeTest(expected, actual, compare = 'exact') {
  if (compare === 'unordered') {
    if (!Array.isArray(expected) || !Array.isArray(actual)) return deepEqual(expected, actual);
    if (expected.length !== actual.length) return false;
    const left = [...expected].map((item) => JSON.stringify(item)).sort();
    const right = [...actual].map((item) => JSON.stringify(item)).sort();
    return left.every((item, index) => item === right[index]);
  }
  if (compare === 'set-of-sets') {
    if (!Array.isArray(expected) || !Array.isArray(actual)) return false;
    if (expected.length !== actual.length) return false;
    const norm = (rows) => rows
      .map((row) => (Array.isArray(row) ? [...row].map((x) => JSON.stringify(x)).sort() : [JSON.stringify(row)]))
      .map((row) => JSON.stringify(row))
      .sort();
    const left = norm(expected);
    const right = norm(actual);
    return left.every((item, index) => item === right[index]);
  }
  if (compare === 'sorted-rows') {
    if (!Array.isArray(expected) || !Array.isArray(actual)) return false;
    return deepEqual(sortRows(expected), sortRows(actual));
  }
  return deepEqual(expected, actual);
}

export function summarize(results, total) {
  const judged = results.filter((item) => !item.skipped);
  const passed = judged.filter((item) => item.passed).length;
  const hasError = judged.some((item) => item.error);
  const skipped = results.some((item) => item.skipped);
  let verdict = 'WA';
  if (skipped) verdict = 'TLE';
  else if (passed === total && total > 0) verdict = 'AC';
  else if (hasError) verdict = 'RE';
  return { passed, total, verdict, hasError, skipped };
}

// ── Điểm số ─────────────────────────────────────────────────────────────────

export function speedBonus(ms, allPassed) {
  if (!allPassed) return 0;
  if (ms <= 50) return 20;
  if (ms <= 200) return 12;
  if (ms <= 600) return 6;
  return 0;
}

export function scoreOf({ difficulty, passed, total, ms = 0 }) {
  const base = findDifficulty(difficulty).points;
  if (!total) return 0;
  const allPassed = passed === total;
  const earned = Math.round((base * passed) / total);
  return earned + speedBonus(ms, allPassed);
}

export function maxScoreOf(problem) {
  return findDifficulty(problem.difficulty).points + speedBonus(0, true);
}

export function rankOf(score) {
  let current = RANKS[0];
  RANKS.forEach((rank) => {
    if (score >= rank.min) current = rank;
  });
  const next = RANKS.find((rank) => rank.min > score);
  return { ...current, next };
}

export function formatDuration(ms) {
  if (ms === null || ms === undefined) return '—';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

// ── Chạy code ───────────────────────────────────────────────────────────────

export function serialize(value) {
  if (value === undefined) return 'undefined';
  if (value === null) return null;
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return 'NaN';
    if (!Number.isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';
    return value;
  }
  if (typeof value === 'bigint') return `${value.toString()}n`;
  if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`;
  if (typeof value === 'symbol') return value.toString();
  if (typeof value === 'string' || typeof value === 'boolean') return value;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (err) {
    return String(value);
  }
}

export function friendlyError(error) {
  const message = (error && error.message) || String(error);
  if (/Maximum call stack/i.test(message)) return 'Gọi đệ quy quá sâu (stack overflow). Kiểm tra điều kiện dừng.';
  if (/is not a function/i.test(message)) return `${message} — kiểm tra lại tên hàm và cách gọi.`;
  if (/Cannot read (properties|property) of (undefined|null)/i.test(message)) return `${message} — có thể bạn đang truy cập phần tử không tồn tại.`;
  if (/is not defined/i.test(message)) return `${message} — biến chưa được khai báo.`;
  return message;
}

export function cloneArgs(args) {
  try {
    return JSON.parse(JSON.stringify(args || []));
  } catch (err) {
    return args || [];
  }
}

/**
 * Chạy code người học với danh sách test. Trả về kết quả thô (chưa chấm đạt/sai)
 * để phần chấm điểm dùng lại được ở cả Web Worker lẫn Node.
 */
export function runTests({ code, functionName, tests = [], budgetMs = 2000 } = {}) {
  const logs = [];
  const results = [];
  const originalLog = console.log;
  const startedAt = Date.now();

  let fn = null;
  try {
    const source = `${code}\n;return typeof ${functionName} === 'function' ? ${functionName} : undefined;`;
    fn = new Function(source)();
  } catch (err) {
    return { ok: false, compileError: friendlyError(err), results: [], logs, totalMs: 0 };
  }
  if (typeof fn !== 'function') {
    return {
      ok: false,
      compileError: `Không tìm thấy hàm ${functionName}. Đừng đổi tên hàm trong đề bài.`,
      results: [],
      logs,
      totalMs: 0,
    };
  }

  console.log = (...args) => {
    if (logs.length < 200) logs.push(args.map((item) => serialize(item)).join(' '));
  };
  try {
    for (let index = 0; index < tests.length; index += 1) {
      if (Date.now() - startedAt > budgetMs) {
        results.push({ index, skipped: true });
        continue;
      }
      const started = Date.now();
      try {
        const actual = fn(...cloneArgs(tests[index].args));
        results.push({ index, actual: serialize(actual), ms: Date.now() - started });
      } catch (err) {
        results.push({ index, error: friendlyError(err), ms: Date.now() - started });
      }
    }
  } finally {
    console.log = originalLog;
  }
  return { ok: true, results, logs, totalMs: Date.now() - startedAt };
}

/** Ghép kết quả thô với test gốc để biết test nào đạt. */
export function gradeRun({ tests = [], compare = 'exact', raw = {}, timeoutMs = 6000, timedOut = false }) {
  const results = (raw.results || []).map((item) => {
    const test = tests[item.index] || {};
    const passed = !item.skipped && !item.error && judgeTest(test.expected, item.actual, compare);
    return {
      index: item.index,
      visible: Boolean(test.visible),
      args: test.args || [],
      expected: test.expected,
      actual: item.actual,
      error: item.error || '',
      skipped: Boolean(item.skipped),
      ms: item.ms || 0,
      passed,
    };
  });
  if (timedOut) {
    return {
      verdict: 'TLE',
      compileError: '',
      results,
      logs: raw.logs || [],
      totalMs: timeoutMs,
      passed: results.filter((item) => item.passed).length,
      total: tests.length,
    };
  }
  if (raw.ok === false) {
    return {
      verdict: 'CE',
      compileError: raw.compileError || 'Code không chạy được.',
      results,
      logs: raw.logs || [],
      totalMs: raw.totalMs || 0,
      passed: 0,
      total: tests.length,
    };
  }
  const summary = summarize(results, tests.length);
  return {
    verdict: summary.verdict,
    compileError: '',
    results,
    logs: raw.logs || [],
    totalMs: raw.totalMs || 0,
    passed: summary.passed,
    total: tests.length,
  };
}

export function runSync({ code, functionName, tests, compare = 'exact', budgetMs = 2000 }) {
  return gradeRun({ tests, compare, raw: runTests({ code, functionName, tests, budgetMs }) });
}

// ── Lưu bài giải & tiến độ ──────────────────────────────────────────────────

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // hết dung lượng hoặc trình duyệt chặn → bỏ qua, không làm hỏng trang
  }
}

export function readSolutions() {
  return readJson(SOLUTIONS_KEY);
}

export function readDrafts() {
  return readJson(DRAFTS_KEY);
}

export function saveDraft(problemId, code) {
  const drafts = readDrafts();
  drafts[problemId] = code;
  writeJson(DRAFTS_KEY, drafts);
}

export function clearDraft(problemId) {
  const drafts = readDrafts();
  delete drafts[problemId];
  writeJson(DRAFTS_KEY, drafts);
}

export function saveSolution(problemId, record) {
  const solutions = readSolutions();
  const previous = solutions[problemId] || {};
  const attempts = (previous.attempts || 0) + 1;
  const solved = Boolean(previous.solved) || record.passed === record.total;
  const bestScore = Math.max(previous.score || 0, record.score || 0);
  const bestMs = record.passed === record.total
    ? Math.min(previous.ms || Number.MAX_SAFE_INTEGER, record.ms || Number.MAX_SAFE_INTEGER)
    : previous.ms || null;
  const next = {
    ...previous,
    attempts,
    solved,
    score: bestScore,
    ms: bestMs === Number.MAX_SAFE_INTEGER ? null : bestMs,
    lastVerdict: record.verdict,
    passed: record.passed,
    total: record.total,
    solvedAt: solved ? previous.solvedAt || new Date().toISOString() : previous.solvedAt || null,
    history: [
      {
        verdict: record.verdict,
        passed: record.passed,
        total: record.total,
        score: record.score || 0,
        ms: record.ms || 0,
        at: record.at || new Date().toISOString(),
      },
      ...(previous.history || []),
    ].slice(0, 10),
  };
  solutions[problemId] = next;
  writeJson(SOLUTIONS_KEY, solutions);
  return next;
}

export function resetProblem(problemId) {
  const solutions = readSolutions();
  delete solutions[problemId];
  writeJson(SOLUTIONS_KEY, solutions);
  clearDraft(problemId);
}

export function progressOf(problems = [], solutions = {}) {
  const byDifficulty = {};
  DIFFICULTIES.forEach((item) => {
    byDifficulty[item.id] = { solved: 0, total: 0, score: 0 };
  });
  let solved = 0;
  let score = 0;
  let attempted = 0;
  problems.forEach((problem) => {
    const bucket = byDifficulty[problem.difficulty];
    if (bucket) bucket.total += 1;
    const record = solutions[problem.id];
    if (!record) return;
    attempted += 1;
    score += record.score || 0;
    if (record.solved) {
      solved += 1;
      if (bucket) {
        bucket.solved += 1;
        bucket.score += record.score || 0;
      }
    }
  });
  const maxScore = problems.reduce((sum, problem) => sum + maxScoreOf(problem), 0);
  return {
    solved,
    attempted,
    total: problems.length,
    score,
    maxScore,
    percent: problems.length ? Math.round((solved / problems.length) * 100) : 0,
    byDifficulty,
    rank: rankOf(score),
  };
}

// ── Tìm kiếm & lọc ──────────────────────────────────────────────────────────

export function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export function categoriesOf(problems = []) {
  const found = [];
  problems.forEach((problem) => {
    if (problem.category && !found.includes(problem.category)) found.push(problem.category);
  });
  return found.sort((a, b) => a.localeCompare(b, 'vi'));
}

export function filterProblems(problems = [], { query = '', difficulty = 'all', category = 'all', status = 'all', solutions = {} } = {}) {
  const needle = normalizeText(query);
  return problems.filter((problem) => {
    if (difficulty !== 'all' && problem.difficulty !== difficulty) return false;
    if (category !== 'all' && problem.category !== category) return false;
    const record = solutions[problem.id];
    if (status === 'solved' && !record?.solved) return false;
    if (status === 'unsolved' && record?.solved) return false;
    if (!needle) return true;
    const haystack = normalizeText([
      problem.title,
      problem.id,
      problem.category,
      problem.summary,
      ...(problem.tags || []),
    ].join(' '));
    return haystack.includes(needle);
  });
}

export function previewArgs(args = []) {
  return args
    .map((item) => {
      const text = typeof item === 'string' ? `"${item}"` : JSON.stringify(item);
      return text && text.length > 60 ? `${text.slice(0, 57)}...` : text;
    })
    .join(', ');
}

export function previewValue(value) {
  const text = typeof value === 'string' ? `"${value}"` : JSON.stringify(value);
  if (text === undefined) return 'undefined';
  return text.length > 90 ? `${text.slice(0, 87)}...` : text;
}

// ── Ngôn ngữ ────────────────────────────────────────────────────────────────

export const CODE_LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', runtime: 'browser', hint: 'Chạy ngay trong trình duyệt' },
  { id: 'nodejs', label: 'Node.js', runtime: 'server', hint: 'Chạy trên máy chủ bằng Node' },
  { id: 'java', label: 'Java 17', runtime: 'server', hint: 'Biên dịch bằng javac rồi chạy' },
  { id: 'python', label: 'Python 3', runtime: 'server', hint: 'Chạy bằng trình thông dịch Python' },
];

export function findCodeLanguage(id) {
  return CODE_LANGUAGES.find((item) => item.id === id) || CODE_LANGUAGES[0];
}

export function snakeCase(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
}

export function functionNameFor(problem, language) {
  if (language === 'python') return snakeCase(problem.functionName);
  return problem.functionName;
}

export function starterFor(problem, language) {
  if (!problem) return '';
  if (language === 'java') return problem.javaStarter || '';
  if (language === 'python') return problem.pythonStarter || '';
  return problem.starter || '';
}

export function solutionFor(problem, language) {
  if (!problem) return '';
  if (language === 'java') return problem.javaSolution || '';
  if (language === 'python') return problem.pythonSolution || '';
  return problem.solution || '';
}

// ── Tô màu cú pháp ─────────────────────────────────────────────────────────

const JS_KEYWORDS = 'const|let|var|function|return|if|else|for|while|do|break|continue|new|class|extends|super|this|typeof|instanceof|in|of|try|catch|finally|throw|switch|case|default|null|undefined|true|false|async|await|yield|delete|void|static|get|set|import|export|from';
const JAVA_KEYWORDS = 'public|private|protected|static|final|abstract|class|interface|enum|record|extends|implements|new|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|finally|throw|throws|void|int|long|double|float|boolean|char|byte|short|String|null|true|false|this|super|import|package|instanceof|synchronized|var|yield';
const PYTHON_KEYWORDS = 'def|return|if|elif|else|for|while|in|not|and|or|import|from|as|class|try|except|finally|raise|with|lambda|None|True|False|pass|break|continue|global|yield|is|assert|del|nonlocal|async|await';
const PYTHON_BUILTINS = 'print|len|range|int|str|float|bool|list|dict|set|tuple|max|min|sum|sorted|enumerate|zip|map|filter|abs|round|input|isinstance';

// Mọi ngôn ngữ dùng chung 7 nhóm bắt buộc theo đúng thứ tự này, nhóm không dùng thì để
// (?! ) — không bao giờ khớp — để hàm thay thế không phải phân nhánh theo ngôn ngữ.
function buildTokenRegex(keywords, comment, string, typeLookahead = true, builtins = '') {
  const never = '((?!))';
  const builtinGroup = builtins ? `(${builtins})` : never;
  const typeGroup = typeLookahead ? '([A-Z][\\w$]*)' : never;
  return new RegExp(
    `(${comment})|(${string})|\\b(${keywords})\\b|${builtinGroup}|\\b(\\d+(?:\\.\\d+)?(?:e[+-]?\\d+)?|0x[0-9a-fA-F]+)\\b|\\b([A-Za-z_$][\\w$]*)\\b(?=\\s*\\()|\\b${typeGroup}\\b`,
    'g',
  );
}

const JS_TOKEN = buildTokenRegex(JS_KEYWORDS, '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/', "'(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\"|`(?:\\\\.|[^`\\\\])*`");
const JAVA_TOKEN = buildTokenRegex(JAVA_KEYWORDS, '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/', '"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'');
const PYTHON_TOKEN = buildTokenRegex(
  PYTHON_KEYWORDS,
  '#[^\\n]*',
  '"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'',
  false,
  PYTHON_BUILTINS,
);

function applyTokens(escaped, regex) {
  return escaped
    .replace(regex, (match, comment, str, keyword, builtin, num, fn, type) => {
      if (comment) return `<span class="tk-com">${comment}</span>`;
      if (str) return `<span class="tk-str">${str}</span>`;
      if (keyword) return `<span class="tk-kw">${keyword}</span>`;
      if (builtin) return `<span class="tk-fn">${builtin}</span>`;
      if (num) return `<span class="tk-num">${num}</span>`;
      if (fn) return `<span class="tk-fn">${fn}</span>`;
      if (type) return `<span class="tk-type">${type}</span>`;
      return match;
    })
    .replace(/\n$/, '\n ');
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function highlightJs(code) {
  return applyTokens(escapeHtml(code), JS_TOKEN);
}

export function highlightCode(code, language) {
  if (language === 'java') return applyTokens(escapeHtml(code), JAVA_TOKEN);
  if (language === 'python') return applyTokens(escapeHtml(code), PYTHON_TOKEN);
  return highlightJs(code);
}
