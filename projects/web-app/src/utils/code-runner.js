/**
 * Chạy code người học trong Web Worker và tự ngắt khi quá hạn.
 */

// Dữ liệu truyền sang worker phải là object thuần: proxy reactive của Vue
// (đề bài lấy từ data của component) không structured-clone được.
function toPlain(value, fallback) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (err) {
    return fallback;
  }
}

const FALLBACK = {
  verdict: 'CE',
  compileError: 'Trình duyệt này không chạy được code trong sandbox.',
  results: [],
  logs: [],
  totalMs: 0,
  passed: 0,
  total: 0,
};

export function runCode({
  code,
  functionName,
  tests = [],
  compare = 'exact',
  timeoutMs = 6000,
  budgetMs = 2000,
} = {}) {
  return new Promise((resolve) => {
    if (typeof Worker === 'undefined') {
      resolve({ ...FALLBACK, total: tests.length });
      return;
    }
    let worker = null;
    let settled = false;
    let timer = null;
    const finish = (payload) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (worker) {
        try {
          worker.terminate();
        } catch (err) {
          // worker đã chết → không cần làm gì
        }
      }
      resolve(payload);
    };

    timer = setTimeout(() => {
      finish({
        verdict: 'TLE',
        compileError: '',
        results: [],
        logs: [],
        totalMs: timeoutMs,
        passed: 0,
        total: tests.length,
      });
    }, timeoutMs + 300);

    try {
      worker = new Worker(new URL('../workers/code-worker.js', import.meta.url), { type: 'module' });
    } catch (err) {
      finish({ ...FALLBACK, total: tests.length, compileError: 'Không nạp được bộ chạy code.' });
      return;
    }

    worker.onmessage = (event) => finish(event.data);
    worker.onerror = (event) => {
      finish({
        ...FALLBACK,
        total: tests.length,
        compileError: event?.message || 'Bộ chạy code gặp lỗi không xác định.',
      });
    };
    try {
      worker.postMessage({
        code: String(code ?? ''),
        functionName: String(functionName || ''),
        tests: toPlain(tests, []) || [],
        compare,
        budgetMs,
        timeoutMs,
      });
    } catch (err) {
      finish({
        ...FALLBACK,
        total: tests.length,
        compileError: 'Không gửi được code sang bộ chạy: dữ liệu test không hợp lệ.',
      });
    }
  });
}
