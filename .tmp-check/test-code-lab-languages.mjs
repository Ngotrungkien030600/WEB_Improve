// Chạy THẬT mọi lời giải mẫu của 9 đề bằng 4 ngôn ngữ để kiểm chứng ngân hàng đề.
import { runSync } from '../projects/web-app/src/logic/code-lab-logic.js';
import { CODE_PROBLEMS_FULL } from '../projects/web-app/src/data/code-problems-multilang.js';
import * as judgeModule from '../projects/web-en/server/code-judge.js';

const { judgeOnServer, starterFor, solutionFor, functionNameFor } = judgeModule;

const results = [];
function check(name, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`);
}
const ok = (name, cond, extra = '') => check(name + (extra ? ` (${extra})` : ''), Boolean(cond), true);

const LANGUAGES = ['javascript', 'nodejs', 'java', 'python'];

async function runOne(problem, language, code) {
  if (language === 'javascript') {
    return runSync({
      code,
      functionName: problem.functionName,
      tests: problem.tests,
      compare: problem.compare || 'exact',
    });
  }
  return judgeOnServer({
    language,
    code,
    functionName: problem.functionName,
    tests: problem.tests,
    compare: problem.compare || 'exact',
    params: problem.params,
    returns: problem.returns,
  });
}

for (const problem of CODE_PROBLEMS_FULL) {
  const pack = { params: problem.params, returns: problem.returns };
  ok(`${problem.id}: có kiểu tham số`, Array.isArray(pack.params) && pack.params.length > 0);
  ok(`${problem.id}: có kiểu trả về`, typeof pack.returns === 'string' && pack.returns.length > 0);
  ok(`${problem.id}: có tài liệu lý thuyết`, problem.docs.theory.length >= 2);
  ok(`${problem.id}: có các bước thuật toán`, problem.docs.steps.length >= 3);
  ok(`${problem.id}: có độ phức tạp`, Boolean(problem.docs.complexity.time && problem.docs.complexity.space));
  ok(`${problem.id}: có lỗi hay mắc`, problem.docs.pitfalls.length >= 2);
  ok(`${problem.id}: có code khởi tạo Java`, String(problem.javaStarter || '').includes('Viết code của bạn'));
  ok(`${problem.id}: có code khởi tạo Python`, String(problem.pythonStarter || '').includes('Viết code của bạn'));

  for (const language of LANGUAGES) {
    const solution = solutionFor(problem, language);
    const starter = starterFor(problem, language);
    const fnName = functionNameFor(problem, language);
    ok(`${problem.id}/${language}: có lời giải mẫu`, String(solution).trim().length > 0);
    ok(`${problem.id}/${language}: lời giải khai báo đúng tên hàm`, solution.includes(fnName), fnName);

    const solved = await runOne(problem, language, solution);
    if (solved.verdict !== 'AC') {
      const detail = (solved.results || [])
        .filter((item) => !item.passed)
        .map((item) => `#${item.index} mong đợi ${JSON.stringify(problem.tests[item.index]?.expected)} nhận ${JSON.stringify(item.actual)}${item.error ? ` lỗi ${item.error}` : ''}`)
        .join(' | ');
      console.log(`  ↳ ${problem.id}/${language} ${solved.verdict}: ${solved.compileError || detail}`);
    }
    check(`${problem.id}/${language}: lời giải mẫu đạt hết test`, solved.verdict, 'AC');
    check(`${problem.id}/${language}: đếm đủ test`, [solved.passed, solved.total], [problem.tests.length, problem.tests.length]);

    const started = await runOne(problem, language, starter);
    ok(`${problem.id}/${language}: code khởi tạo chưa đạt`, started.verdict !== 'AC', started.verdict);
  }
}

const failed = results.filter((r) => !r).length;
console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS`);
process.exitCode = failed ? 1 : 0;
