/**
 * Bộ chấm code nhiều ngôn ngữ cho Phòng luyện code.
 *
 * Nguyên tắc an toàn: chỉ chạy code khi request đến từ localhost, trừ khi bật
 * SKILLFORGE_ALLOW_CODE_RUN=1. Mỗi lần chấm chạy trong thư mục tạm riêng, có
 * giới hạn thời gian, giới hạn dung lượng output, chỉ 1 bài chạy một lúc, và
 * tiến trình con chỉ nhận biến môi trường tối thiểu (không lộ .env của máy chủ).
 */
import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Dùng lại đúng logic của web-app để tên hàm, code khởi tạo, lời giải không lệch nhau
import { snakeCase, functionNameFor, starterFor, solutionFor } from '../../web-app/src/logic/code-lab-logic.js';

export { snakeCase, functionNameFor, starterFor, solutionFor };

export const CODE_RUN_FLAG = 'SKILLFORGE_ALLOW_CODE_RUN';
export const MAX_OUTPUT_BYTES = 64 * 1024;
const RUN_TIMEOUT_MS = 6000;
const COMPILE_TIMEOUT_MS = 15000;

const LOGIC_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../../web-app/src/logic/code-lab-logic.js');

export const LANGUAGE_SPECS = [
  { id: 'javascript', label: 'JavaScript', runtime: 'browser', hint: 'Chạy ngay trong trình duyệt' },
  { id: 'nodejs', label: 'Node.js', runtime: 'server', hint: 'Chạy trên máy chủ bằng Node' },
  { id: 'java', label: 'Java 17', runtime: 'server', hint: 'Biên dịch bằng javac rồi chạy' },
  { id: 'python', label: 'Python 3', runtime: 'server', hint: 'Chạy bằng trình thông dịch Python' },
];

export function findLanguage(id) {
  return LANGUAGE_SPECS.find((item) => item.id === id) || LANGUAGE_SPECS[0];
}

export function isLoopback(address) {
  if (!address) return false;
  return address === '::1' || address === '127.0.0.1' || address.startsWith('127.') || address === '::ffff:127.0.0.1';
}

export function isCodeRunAllowed({ remoteAddress, allowFlag = false } = {}) {
  return Boolean(allowFlag) || isLoopback(remoteAddress);
}

// ── Sinh mã nguồn harness ───────────────────────────────────────────────────

function javaString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

/** Đổi giá trị JSON thành literal Java theo kiểu đã khai báo trong đề bài. */
export function javaLiteral(value, type) {
  if (type === 'int') return String(Math.trunc(Number(value)));
  if (type === 'long') return `${Math.trunc(Number(value))}L`;
  if (type === 'double') return String(Number(value));
  if (type === 'boolean') return value ? 'true' : 'false';
  if (type === 'String') return javaString(value);
  if (type === 'int[]') return `new int[]{${(value || []).map((item) => javaLiteral(item, 'int')).join(', ')}}`;
  if (type === 'String[]') return `new String[]{${(value || []).map((item) => javaLiteral(item, 'String')).join(', ')}}`;
  if (type === 'int[][]') return `new int[][]{${(value || []).map((row) => javaLiteral(row, 'int[]')).join(', ')}}`;
  if (type === 'String[][]') return `new String[][]{${(value || []).map((row) => javaLiteral(row, 'String[]')).join(', ')}}`;
  throw new Error(`Kiểu Java chưa hỗ trợ: ${type}`);
}

function javaComparator(compare, returns) {
  const arrayType = returns === 'int[]' ? 'int[]' : 'String[]';
  if (compare === 'unordered') {
    return `  static boolean __cmp(Object a, Object b) {
    if (!(a instanceof ${arrayType}) || !(b instanceof ${arrayType})) return false;
    ${arrayType} left = (${arrayType}) a;
    ${arrayType} right = (${arrayType}) b;
    if (left.length != right.length) return false;
    ${arrayType} x = left.clone();
    ${arrayType} y = right.clone();
    java.util.Arrays.sort(x);
    java.util.Arrays.sort(y);
    return java.util.Arrays.equals(x, y);
  }`;
  }
  if (compare === 'set-of-sets') {
    return `  static boolean __cmp(Object a, Object b) {
    if (!(a instanceof String[][]) || !(b instanceof String[][])) return false;
    return java.util.Arrays.equals(__key((String[][]) a), __key((String[][]) b));
  }

  static String[] __key(String[][] rows) {
    String[] keys = new String[rows.length];
    for (int i = 0; i < rows.length; i++) {
      String[] row = rows[i].clone();
      java.util.Arrays.sort(row);
      keys[i] = String.join(",", row);
    }
    java.util.Arrays.sort(keys);
    return keys;
  }`;
  }
  if (compare === 'sorted-rows') {
    return `  static boolean __cmp(Object a, Object b) {
    if (!(a instanceof int[][]) || !(b instanceof int[][])) return false;
    return java.util.Arrays.deepEquals(__sort((int[][]) a), __sort((int[][]) b));
  }

  static int[][] __sort(int[][] rows) {
    int[][] copy = new int[rows.length][];
    for (int i = 0; i < rows.length; i++) copy[i] = rows[i].clone();
    java.util.Arrays.sort(copy, (x, y) -> x[0] != y[0] ? Integer.compare(x[0], y[0]) : Integer.compare(x[1], y[1]));
    return copy;
  }`;
  }
  if (returns === 'int[]' || returns === 'String[]') {
    return `  static boolean __cmp(Object a, Object b) {
    if (!(a instanceof ${arrayType}) || !(b instanceof ${arrayType})) return false;
    return java.util.Arrays.equals((${arrayType}) a, (${arrayType}) b);
  }`;
  }
  if (returns === 'int[][]' || returns === 'String[][]') {
    return `  static boolean __cmp(Object a, Object b) {
    if (!(a instanceof ${returns}) || !(b instanceof ${returns})) return false;
    return java.util.Arrays.deepEquals((${returns}) a, (${returns}) b);
  }`;
  }
  return `  static boolean __cmp(Object a, Object b) {
    return java.util.Objects.equals(a, b);
  }`;
}

function javaJsonHelper() {
  return `  static String __json(Object value) {
    if (value == null) return "null";
    if (value instanceof Object[]) return __jsonArray((Object[]) value);
    if (value instanceof int[]) {
      StringBuilder sb = new StringBuilder("[");
      int[] items = (int[]) value;
      for (int i = 0; i < items.length; i++) {
        if (i > 0) sb.append(",");
        sb.append(items[i]);
      }
      return sb.append("]").toString();
    }
    if (value instanceof String[]) return __jsonArray((String[]) value);
    if (value instanceof String) return "\\"" + ((String) value).replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\"";
    return String.valueOf(value);
  }

  static String __jsonArray(Object[] items) {
    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < items.length; i++) {
      if (i > 0) sb.append(",");
      sb.append(__json(items[i]));
    }
    return sb.append("]").toString();
  }`;
}

/**
 * Sinh mã Java hoàn chỉnh: code người học + harness chấm từng test.
 * Người học viết hàm static đúng chữ ký trong code khởi tạo.
 */
export function buildJavaHarness({ code, functionName, tests, params = [], returns = 'int', compare = 'exact' }) {
  const calls = tests.map((test, index) => {
    const args = (test.args || []).map((value, position) => javaLiteral(value, params[position] || 'int')).join(', ');
    const expected = javaLiteral(test.expected, returns);
    return `    __run(${index}, ${expected}, () -> ${functionName}(${args}));`;
  }).join('\n');

  return `import java.util.*;

public class Main {
${code}

${javaComparator(compare, returns)}

${javaJsonHelper()}

  static final StringBuilder __lines = new StringBuilder();

  static void __run(int index, Object expected, java.util.function.Supplier<Object> call) {
    long started = System.currentTimeMillis();
    Object actual = null;
    String error = null;
    try {
      actual = call.get();
    } catch (Throwable err) {
      error = err.getClass().getSimpleName() + ": " + String.valueOf(err.getMessage());
    }
    long ms = System.currentTimeMillis() - started;
    boolean passed = error == null && __cmp(expected, actual);
    __lines.append("{\\"index\\":").append(index)
      .append(",\\"passed\\":").append(passed)
      .append(",\\"ms\\":").append(ms)
      .append(",\\"actual\\":").append(error == null ? __json(actual) : "null")
      .append(",\\"error\\":").append(error == null ? "null" : "\\"" + error.replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"").replace("\\n", " ") + "\\"")
      .append("}\\n");
  }

  public static void main(String[] args) {
    long started = System.currentTimeMillis();
${calls}
    System.out.println("__RESULT__" + "{\\"results\\":[" + __lines.toString().trim().replace("\\n", ",") + "],\\"totalMs\\":" + (System.currentTimeMillis() - started) + "}");
  }
}
`;
}

/** Harness Node: dùng lại đúng logic chấm của trình duyệt để hai nơi không lệch nhau. */
export function buildNodeHarness({ code, functionName, tests, compare = 'exact', budgetMs = 2000 }) {
  return `import { gradeRun, runTests } from ${JSON.stringify(pathToFileURL(LOGIC_PATH).href)};

const payload = {
  code: ${JSON.stringify(code)},
  functionName: ${JSON.stringify(functionName)},
  tests: ${JSON.stringify(tests)},
  compare: ${JSON.stringify(compare)},
  budgetMs: ${budgetMs},
};

const graded = gradeRun({ tests: payload.tests, compare: payload.compare, raw: runTests(payload) });
process.stdout.write('__RESULT__' + JSON.stringify({
  results: graded.results.map((item) => ({
    index: item.index,
    passed: item.passed,
    ms: item.ms,
    actual: item.actual === undefined ? null : item.actual,
    error: item.error || null,
  })),
  compileError: graded.compileError,
  logs: graded.logs,
  totalMs: graded.totalMs,
}));
`;
}

function pythonCompare(compare) {
  if (compare === 'unordered') {
    return `def __cmp(expected, actual):
    if not isinstance(actual, list) or not isinstance(expected, list):
        return False
    return sorted(expected, key=__key) == sorted(actual, key=__key)`;
  }
  if (compare === 'set-of-sets') {
    return `def __cmp(expected, actual):
    if not isinstance(actual, list) or not isinstance(expected, list):
        return False
    return sorted([sorted(row) for row in expected]) == sorted([sorted(row) for row in actual])`;
  }
  if (compare === 'sorted-rows') {
    return `def __cmp(expected, actual):
    if not isinstance(actual, list) or not isinstance(expected, list):
        return False
    return sorted(expected, key=lambda row: (row[0], row[1])) == sorted(actual, key=lambda row: (row[0], row[1]))`;
  }
  return `def __cmp(expected, actual):
    return expected == actual`;
}

export function buildPythonHarness({ code, functionName, tests, compare = 'exact' }) {
  const name = snakeCase(functionName);
  return `import contextlib
import importlib.util
import io
import json
import os
import time

__SOLUTION = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'solution.py')

${pythonCompare(compare)}

${compare === 'unordered' ? `def __key(value):
    return json.dumps(value, sort_keys=True)` : ''}

def __safe(value):
    try:
        json.dumps(value)
        return value
    except Exception:
        return str(value)


def __main():
    spec = importlib.util.spec_from_file_location('solution', __SOLUTION)
    module = importlib.util.module_from_spec(spec)
    capture = io.StringIO()
    started = time.time()
    try:
        with contextlib.redirect_stdout(capture):
            spec.loader.exec_module(module)
        target = getattr(module, ${JSON.stringify(name)}, None)
    except Exception as err:
        print('__RESULT__' + json.dumps({'results': [], 'compileError': f'{type(err).__name__}: {err}', 'logs': [], 'totalMs': 0}))
        return

    if not callable(target):
        print('__RESULT__' + json.dumps({'results': [], 'compileError': 'Không tìm thấy hàm ${name} trong bài làm.', 'logs': [], 'totalMs': 0}))
        return

    tests = json.loads(${JSON.stringify(JSON.stringify(tests))})
    results = []
    for index, test in enumerate(tests):
        step = time.time()
        actual = None
        error = None
        try:
            with contextlib.redirect_stdout(capture):
                actual = target(*test['args'])
        except Exception as err:
            error = f'{type(err).__name__}: {err}'
        passed = error is None and __cmp(test['expected'], actual)
        results.append({
            'index': index,
            'passed': passed,
            'ms': int((time.time() - step) * 1000),
            'actual': None if error else __safe(actual),
            'error': error,
        })

    print('__RESULT__' + json.dumps({
        'results': results,
        'compileError': '',
        'logs': capture.getvalue().splitlines()[:200],
        'totalMs': int((time.time() - started) * 1000),
    }))


__main()
`;
}

export function buildSources({ language, code, functionName, tests, compare = 'exact', params = [], returns = 'int', pythonFile = 'solution.py' }) {
  if (language === 'java') {
    return { 'Main.java': buildJavaHarness({ code, functionName, tests, compare, params, returns }) };
  }
  if (language === 'python') {
    return { 'runner.py': buildPythonHarness({ code, functionName, tests, compare }), [pythonFile]: code };
  }
  if (language === 'nodejs') {
    return { 'harness.mjs': buildNodeHarness({ code, functionName, tests, compare }) };
  }
  throw new Error(`Ngôn ngữ chưa hỗ trợ: ${language}`);
}

// ── Chạy thật ───────────────────────────────────────────────────────────────

function minimalEnv() {
  const keys = ['PATH', 'Path', 'SystemRoot', 'SystemDrive', 'windir', 'TEMP', 'TMP', 'TMPDIR', 'LANG', 'HOME', 'USERPROFILE', 'PATHEXT', 'COMSPEC'];
  const env = {};
  keys.forEach((key) => {
    if (process.env[key] !== undefined) env[key] = process.env[key];
  });
  env.JAVA_TOOL_OPTIONS = '-Xmx256m -XX:+UseSerialGC';
  env.PYTHONIOENCODING = 'utf-8';
  env.NODE_OPTIONS = '--max-old-space-size=256';
  return env;
}

/**
 * Windows: `py` là trình khởi động nên kill tiến trình cha vẫn để lại tiến trình con
 * (bài `while True` sẽ chạy mãi và giữ luôn luồng chấm). Vì vậy phải kill cả cây.
 */
function killTree(child) {
  if (!child || !child.pid) return;
  try {
    child.kill('SIGKILL');
  } catch (err) {
    // tiến trình đã chết
  }
  if (process.platform === 'win32') {
    try {
      const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
      killer.unref();
    } catch (err) {
      // taskkill không có cũng không sao, đã thử kill trực tiếp
    }
  }
}

function spawnOnce(command, args, { cwd, timeoutMs, input = '' }) {
  return new Promise((resolvePromise) => {
    const started = Date.now();
    let stdout = '';
    let stderr = '';
    let settled = false;
    let child = null;
    const settle = (payload) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolvePromise(payload);
    };
    try {
      child = spawn(command, args, { cwd, env: minimalEnv(), windowsHide: true });
    } catch (err) {
      resolvePromise({ stdout: '', stderr: String(err.message || err), code: -1, timedOut: false, ms: 0 });
      return;
    }
    const timer = setTimeout(() => {
      killTree(child);
      try {
        child.stdout?.destroy();
        child.stderr?.destroy();
        child.unref();
      } catch (err) {
        // luồng đã đóng
      }
      settle({ stdout, stderr, code: -1, timedOut: true, ms: Date.now() - started });
    }, timeoutMs);
    const append = (target, chunk) => {
      const text = chunk.toString('utf8');
      if (target.length < MAX_OUTPUT_BYTES * 2) return target + text;
      return target;
    };
    child.stdout.on('data', (chunk) => { stdout = append(stdout, chunk); });
    child.stderr.on('data', (chunk) => { stderr = append(stderr, chunk); });
    child.on('error', (err) => {
      settle({ stdout, stderr: String(err.message || err), code: -1, timedOut: false, ms: Date.now() - started });
    });
    child.on('close', (code) => {
      settle({ stdout, stderr, code, timedOut: false, ms: Date.now() - started });
    });
    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}

/** JAVA_TOOL_OPTIONS làm Java in thêm dòng "Picked up ..." — bỏ đi cho thông báo sạch. */
export function stripNoise(text) {
  return String(text || '')
    .split(/\r?\n/)
    .filter((line) => !/^Picked up /.test(line.trim()))
    .join('\n')
    .trim();
}

export function parseResult(stdout) {
  const index = stdout.lastIndexOf('__RESULT__');
  if (index === -1) return null;
  const raw = stdout.slice(index + '__RESULT__'.length).trim().split('\n')[0];
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function emptyOutcome(message, total) {
  return {
    verdict: 'CE',
    compileError: message,
    results: [],
    logs: [],
    totalMs: 0,
    passed: 0,
    total,
  };
}

function toOutcome(parsed, total, runMs) {
  if (!parsed) {
    return emptyOutcome('Bộ chấm không trả về kết quả. Có thể code không chạy được.', total);
  }
  if (parsed.compileError) {
    return emptyOutcome(parsed.compileError, total);
  }
  const results = (parsed.results || []).map((item) => ({
    index: item.index,
    passed: Boolean(item.passed),
    ms: item.ms || 0,
    actual: item.actual === undefined ? null : item.actual,
    error: item.error || '',
  }));
  const passed = results.filter((item) => item.passed).length;
  let verdict = 'WA';
  if (passed === total && total > 0) verdict = 'AC';
  else if (results.some((item) => item.error)) verdict = 'RE';
  return {
    verdict,
    compileError: '',
    results,
    logs: parsed.logs || [],
    totalMs: parsed.totalMs || runMs,
    passed,
    total,
  };
}

let running = 0;

export function isBusy() {
  return running > 0;
}

/**
 * Chấm một bài bằng ngôn ngữ không phải JavaScript. Trả về cùng cấu trúc
 * outcome mà bộ chạy trong trình duyệt trả về để trang dùng chung một giao diện.
 */
export async function judgeOnServer({ language, code, functionName, tests = [], compare = 'exact', params = [], returns = 'int' }) {
  const spec = findLanguage(language);
  if (spec.runtime !== 'server') {
    return emptyOutcome('Ngôn ngữ này chạy trong trình duyệt, không cần bộ chấm máy chủ.', tests.length);
  }
  if (!existsSync(LOGIC_PATH)) {
    return emptyOutcome('Máy chủ thiếu tệp logic chấm điểm.', tests.length);
  }
  running += 1;
  const dir = await mkdtemp(join(tmpdir(), 'sf-code-'));
  try {
    const sources = buildSources({ language, code, functionName, tests, compare, params, returns });
    await Promise.all(Object.entries(sources).map(([name, content]) => writeFile(join(dir, name), content, 'utf8')));

    if (language === 'java') {
      const compiled = await spawnOnce('javac', ['-encoding', 'UTF-8', '-d', dir, join(dir, 'Main.java')], { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
      if (compiled.timedOut) return emptyOutcome('Biên dịch quá lâu.', tests.length);
      if (compiled.code !== 0) {
        return emptyOutcome(`Lỗi biên dịch Java:\n${stripNoise(compiled.stderr || compiled.stdout).slice(0, 1200)}`, tests.length);
      }
      const run = await spawnOnce('java', ['-cp', dir, 'Main'], { cwd: dir, timeoutMs: RUN_TIMEOUT_MS });
      if (run.timedOut) {
        return { verdict: 'TLE', compileError: '', results: [], logs: [], totalMs: RUN_TIMEOUT_MS, passed: 0, total: tests.length };
      }
      return toOutcome(parseResult(run.stdout), tests.length, run.ms);
    }

    if (language === 'nodejs') {
      const run = await spawnOnce(process.execPath, [join(dir, 'harness.mjs')], { cwd: dir, timeoutMs: RUN_TIMEOUT_MS });
      if (run.timedOut) {
        return { verdict: 'TLE', compileError: '', results: [], logs: [], totalMs: RUN_TIMEOUT_MS, passed: 0, total: tests.length };
      }
      return toOutcome(parseResult(run.stdout), tests.length, run.ms);
    }

    if (language === 'python') {
      const run = await spawnOnce(await pythonCommand(), [join(dir, 'runner.py')], { cwd: dir, timeoutMs: RUN_TIMEOUT_MS });
      if (run.timedOut) {
        return { verdict: 'TLE', compileError: '', results: [], logs: [], totalMs: RUN_TIMEOUT_MS, passed: 0, total: tests.length };
      }
      return toOutcome(parseResult(run.stdout), tests.length, run.ms);
    }

    return emptyOutcome('Ngôn ngữ chưa hỗ trợ.', tests.length);
  } catch (err) {
    return emptyOutcome(`Bộ chấm gặp lỗi: ${(err && err.message) || err}`, tests.length);
  } finally {
    running -= 1;
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

let pythonCache = null;

async function pythonCommand() {
  if (pythonCache) return pythonCache;
  const candidates = process.platform === 'win32' ? ['py', 'python', 'python3'] : ['python3', 'python'];
  for (const candidate of candidates) {
    const probe = await spawnOnce(candidate, ['--version'], { cwd: tmpdir(), timeoutMs: 4000 });
    if (probe.code === 0) {
      pythonCache = candidate;
      return candidate;
    }
  }
  pythonCache = 'python3';
  return pythonCache;
}

/** Dò xem máy chủ chấm được những ngôn ngữ nào. */
export async function probeLanguages() {
  const nodeProbe = { available: typeof process.execPath === 'string', version: process.version };
  const javaCompile = await spawnOnce('javac', ['-version'], { cwd: tmpdir(), timeoutMs: 5000 });
  const javaRun = javaCompile.code === 0 ? await spawnOnce('java', ['-version'], { cwd: tmpdir(), timeoutMs: 5000 }) : { code: -1, stderr: '' };
  const javaVersion = stripNoise(javaRun.stderr || javaRun.stdout).split('\n')[0];
  const python = await pythonCommand();
  const pythonProbe = await spawnOnce(python, ['--version'], { cwd: tmpdir(), timeoutMs: 5000 });
  const pythonVersion = (pythonProbe.stdout || pythonProbe.stderr || '').split('\n')[0].trim();
  return {
    javascript: { available: true, runtime: 'browser', version: 'trình duyệt' },
    nodejs: { available: nodeProbe.available, runtime: 'server', version: nodeProbe.version },
    java: { available: javaCompile.code === 0 && javaRun.code === 0, runtime: 'server', version: javaVersion || 'chưa cài' },
    python: { available: pythonProbe.code === 0, runtime: 'server', version: pythonVersion || 'chưa cài' },
  };
}
