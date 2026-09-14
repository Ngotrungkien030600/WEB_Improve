/**
 * Web Worker chạy code người học. Code chạy trong luồng riêng nên vòng lặp vô hạn
 * không làm treo trang — luồng chính sẽ terminate worker khi quá hạn.
 */
import { gradeRun, runTests } from '../logic/code-lab-logic.js';

self.onmessage = (event) => {
  const payload = event.data || {};
  const tests = payload.tests || [];
  const raw = runTests({
    code: payload.code,
    functionName: payload.functionName,
    tests,
    budgetMs: payload.budgetMs || 2000,
  });
  self.postMessage(gradeRun({
    tests,
    compare: payload.compare || 'exact',
    raw,
    timeoutMs: payload.timeoutMs || 6000,
  }));
};
