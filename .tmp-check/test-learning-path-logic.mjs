// Kiểm chứng lộ trình học: cấu trúc dữ liệu, tiến độ thật, gợi ý việc tiếp theo, nhắc ôn tập.
import { readFileSync } from 'node:fs';

const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
};

const {
  collectSignals, countQuizResult, hoursLabel, markStage, markStageComplete, nextStep, prerequisiteWarnings,
  readQuizState, readTicks, reviewReminders, setItemTick, stageItems, trackProgress,
} = await import('../projects/web-app/src/logic/learning-path-logic.js');
const { LEARNING_TRACKS, PRIMARY_TRACK_ID, findTrack } = await import('../projects/web-app/src/data/learning-paths.js');

const results = [];
function check(name, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`);
}
const ok = (name, cond, extra = '') => check(name + (extra ? ` (${extra})` : ''), Boolean(cond), true);
const resetStorage = () => store.clear();

// ── 1. Route thật: mọi liên kết trong lộ trình phải tồn tại ─────────────────
const routerSource = readFileSync('projects/web-app/src/router/index.js', 'utf8');
const routePaths = [...routerSource.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);
const dynamicPrefixes = routePaths.filter((p) => p.includes(':')).map((p) => p.split('/:')[0]);
function routeExists(path) {
  if (routePaths.includes(path)) return true;
  return dynamicPrefixes.some((prefix) => prefix && path.startsWith(prefix + '/'));
}

const allPaths = [];
for (const track of LEARNING_TRACKS) {
  for (const stage of track.stages) {
    for (const item of [...(stage.lessons || []), ...(stage.practice || [])]) {
      if (item.path) allPaths.push({ track: track.id, stage: stage.id, path: item.path });
    }
  }
}
const brokenPaths = allPaths.filter((item) => !routeExists(item.path));
check('mọi liên kết trong lộ trình đều là route có thật', brokenPaths, []);
ok('lộ trình có ít nhất 25 liên kết thật', allPaths.length >= 25, `${allPaths.length} liên kết`);

// ── 2. Cấu trúc: mỗi chặng phải đủ 6 phần ──────────────────────────────────
check('có 5 trục lộ trình', LEARNING_TRACKS.map((t) => t.id), ['java-backend', 'english', 'frontend', 'devops-cloud', 'ai']);
check('trục chính là Java Backend', PRIMARY_TRACK_ID, 'java-backend');
const primary = findTrack('java-backend');
check('trục chính có 6 chặng', primary.stages.length, 6);
ok('trục chính ghi rõ mục tiêu cuối', primary.goal.length > 40);

const allStageIds = [];
for (const track of LEARNING_TRACKS) {
  ok(`${track.id}: có mục tiêu cuối`, String(track.goal || '').length > 30);
  ok(`${track.id}: có lý do chọn trục`, String(track.why || '').length > 20);
  ok(`${track.id}: có từ 3 chặng trở lên`, track.stages.length >= 3, `${track.stages.length} chặng`);
  for (const stage of track.stages) {
    allStageIds.push(stage.id);
    ok(`${stage.id}: có mục tiêu đo được`, String(stage.outcome || '').length > 40);
    ok(`${stage.id}: có ít nhất 1 bài học`, (stage.lessons || []).length >= 1);
    ok(`${stage.id}: có ít nhất 1 hoạt động luyện tập`, (stage.practice || []).length >= 1);
    ok(`${stage.id}: có điều kiện đạt chuẩn`, String(stage.checkpoint || '').length > 20);
    ok(`${stage.id}: có sản phẩm đầu ra`, String(stage.project || '').length > 20);
    ok(`${stage.id}: có cách ôn lại`, String(stage.review || '').length > 15);
    ok(`${stage.id}: có số giờ dự kiến`, Number(stage.hours) > 0);
    for (const pre of stage.prerequisites || []) {
      ok(`${stage.id}: tiên quyết ${pre} nằm trong cùng trục`, track.stages.some((s) => s.id === pre));
    }
  }
}
check('id chặng không trùng nhau', allStageIds.length, new Set(allStageIds).size);
const practiceKinds = new Set();
for (const track of LEARNING_TRACKS) {
  for (const stage of track.stages) for (const item of stage.practice || []) practiceKinds.add(item.kind || 'manual');
}
ok('có luyện tập tự chấm được (code/quiz/tasks/seen)', ['code', 'quiz', 'tasks', 'seen'].every((k) => practiceKinds.has(k)), [...practiceKinds].join(','));

// ── 3. Tiến độ từ dữ liệu thật ─────────────────────────────────────────────
resetStorage();
let ticks = readTicks();
check('chưa làm gì thì 0%', trackProgress(primary, collectSignals(), ticks).percent, 0);

const stage1 = primary.stages[0];
let items = stageItems(stage1, collectSignals(), ticks);
check('chặng 1 có 5 việc (2 bài học + 2 luyện tập + 1 đạt chuẩn)', items.length, 5);
check('chặng 1: việc code chưa đạt', items.find((i) => i.kind === 'code').done, false);

// Học viên giải 3 bài code dễ trong Phòng luyện code
store.set('sf_code_lab_solutions', JSON.stringify({
  'two-sum': { solved: true, score: 120 },
  'reverse-string': { solved: true, score: 120 },
  'is-palindrome': { solved: true, score: 120 },
  'valid-parentheses': { solved: false, attempts: 1 },
}));
let signals = collectSignals();
check('đọc được 3 bài đã giải từ Phòng luyện code', signals.solvedProblems.sort(), ['is-palindrome', 'reverse-string', 'two-sum']);
items = stageItems(stage1, signals, readTicks());
check('việc 3 bài code dễ đã đạt', items.find((i) => i.kind === 'code').done, true);
check('hiển thị tiến độ 3/3 bài', items.find((i) => i.kind === 'code').detail, '3/3 bài đạt hết test');
check('bài chưa giải không được tính', signals.solvedProblems.includes('valid-parentheses'), false);

// Trả lời quiz Java từ 0
store.set('sf_java_tuzero_quiz', JSON.stringify({ chapter: Object.fromEntries(Array.from({ length: 27 }, (_, i) => [`ch1-${i}`, 0])), read: {} }));
signals = collectSignals();
check('đếm được 27 câu quiz đã trả lời', signals.quizAnswered, 27);
check('việc quiz đã đạt', stageItems(stage1, signals, readTicks()).find((i) => i.kind === 'quiz').done, true);

// Điểm quiz: đạt chuẩn cần ≥ 80% câu đúng, không chỉ trả lời hết
const fakeContent = {
  chapters: [{ id: 'ch1', quiz: Array.from({ length: 27 }, () => ({ q: 'x', answer: 1 })) }],
  readCode: [],
};
const allCorrect = { chapter: Object.fromEntries(Array.from({ length: 27 }, (_, i) => [`ch1-${i}`, 1])), read: {} };
const lowScore = { chapter: Object.fromEntries(Array.from({ length: 27 }, (_, i) => [`ch1-${i}`, i < 20 ? 1 : 0])), read: {} };
check('chấm đúng 27/27 câu', countQuizResult(fakeContent, allCorrect), { answered: 27, correct: 27, total: 27 });
check('chấm đúng 20/27 câu', countQuizResult(fakeContent, lowScore), { answered: 27, correct: 20, total: 27 });
check('câu chưa trả lời không tính', countQuizResult(fakeContent, { chapter: { 'ch1-0': 1 }, read: {} }), { answered: 1, correct: 1, total: 27 });
check('trạng thái quiz đọc từ khoá lưu', Object.keys(readQuizState().chapter).length, 27);
const quizItemOf = (signalsIn) => stageItems(stage1, signalsIn, { items: {}, stages: {} }).find((i) => i.kind === 'quiz');
store.set('sf_java_tuzero_quiz', JSON.stringify(lowScore));
check('20 câu đúng thì chưa đạt chuẩn quiz', quizItemOf(collectSignals({ quizResult: countQuizResult(fakeContent, lowScore) })).done, false);
check('hiện rõ số câu đúng', quizItemOf(collectSignals({ quizResult: countQuizResult(fakeContent, lowScore) })).detail, '27/27 câu · 20 câu đúng');
store.set('sf_java_tuzero_quiz', JSON.stringify(allCorrect));
check('27 câu đúng thì đạt chuẩn quiz', quizItemOf(collectSignals({ quizResult: countQuizResult(fakeContent, allCorrect) })).done, true);
check('không truyền điểm thì chỉ đếm số câu đã trả lời', quizItemOf(collectSignals()).detail, '27/27 câu đã trả lời');
store.set('sf_java_tuzero_quiz', JSON.stringify({ chapter: Object.fromEntries(Array.from({ length: 27 }, (_, i) => [`ch1-${i}`, 0])), read: {} }));

// Đánh dấu đạt chuẩn chặng 1 (phải tick luôn 2 việc bài học còn trống)
ticks = markStageComplete(stage1, collectSignals(), true);
check('chặng 1 đã đánh dấu đạt chuẩn', Boolean(ticks.stages['jb-1']), true);
check('đạt chuẩn thì tick hết việc tự đánh giá', Object.keys(ticks.items).sort(), ['jb-1:0', 'jb-1:1', 'jb-1:checkpoint']);
const progress1 = trackProgress(primary, collectSignals(), readTicks());
check('chặng 1 xong 100%', progress1.stages[0].progress.percent, 100);
check('chặng 1 được tính là đã xong', progress1.doneStages, 1);
ok('tiến độ cả trục tăng lên', progress1.percent > 0, `${progress1.percent}%`);
check('chặng 1 ghi ngày hoàn thành', typeof progress1.stages[0].progress.completedAt, 'string');

// Việc tiếp theo phải nhảy sang chặng 2
const next = nextStep(primary, collectSignals(), readTicks());
check('việc tiếp theo nằm ở chặng 2', next.stage.id, 'jb-2');
ok('việc tiếp theo có nhãn cụ thể', String(next.item.label).length > 10);

// Task thực chiến
store.set('thucChien_done', JSON.stringify(Array.from({ length: 10 }, (_, i) => `task-${i}`)));
check('đếm được 10 task thực chiến đã xong', collectSignals().tasksDone, 10);
const stage5 = primary.stages[4];
check('chặng 5: việc 10 task đã đạt', stageItems(stage5, collectSignals(), readTicks()).find((i) => i.kind === 'tasks').done, true);

// Câu hỏi phỏng vấn UI/FE đã xem (trục Frontend)
const frontend = findTrack('frontend');
const feStage = frontend.stages[3];
check('trục Frontend: việc 36 câu chưa đạt', stageItems(feStage, collectSignals(), readTicks()).find((i) => i.kind === 'seen').done, false);
store.set('sf_ui_interview_seen', JSON.stringify(Array.from({ length: 36 }, (_, i) => `q${i}`)));
check('trục Frontend: xem đủ 36 câu thì đạt', stageItems(feStage, collectSignals(), readTicks()).find((i) => i.kind === 'seen').done, true);
check('đếm đúng số câu đã xem', collectSignals().interviewSeen, 36);

// Đánh dấu tay từng việc
const manualItem = stageItems(primary.stages[2], collectSignals(), readTicks())[0];
check('việc tay chưa đánh dấu', manualItem.done, false);
ticks = setItemTick(manualItem.key, true);
ok('đánh dấu tay thì việc đó xong', stageItems(primary.stages[2], collectSignals(), ticks)[0].done);
ticks = setItemTick(manualItem.key, false);
check('bỏ đánh dấu thì việc đó chưa xong', stageItems(primary.stages[2], collectSignals(), ticks)[0].done, false);

// ── 4. Cảnh báo tiên quyết (mềm) + nhắc ôn tập ────────────────────────────
const stage2 = primary.stages[1];
check('chặng 2 nhắc học sau chặng 1 khi chặng 1 chưa xong', prerequisiteWarnings(stage2, { stages: {} }), ['jb-1']);
check('hết cảnh báo khi chặng 1 đã xong', prerequisiteWarnings(stage2, { stages: { 'jb-1': new Date().toISOString() } }), []);
check('chặng 1 không có tiên quyết', prerequisiteWarnings(stage1, { stages: {} }), []);

const old = new Date(Date.now() - 9 * 86400000).toISOString();
const fresh = new Date(Date.now() - 2 * 86400000).toISOString();
const reminders = reviewReminders(primary, { items: {}, stages: { 'jb-1': old, 'jb-2': fresh } });
check('chỉ nhắc chặng đã xong ≥ 7 ngày', reminders.map((r) => r.stageId), ['jb-1']);
check('nhắc đúng số ngày', reminders[0].days, 9);
check('chặng xong 2 ngày chưa nhắc', reviewReminders(primary, { items: {}, stages: { 'jb-1': fresh } }).length, 0);

// ── 5. Thời gian học lấy từ Pomodoro ───────────────────────────────────────
check('chưa có phiên học', hoursLabel(0), 'chưa có phiên học nào');
check('dưới 10 giờ hiện 1 chữ số thập phân', hoursLabel(150), '2.5 giờ tập trung');
check('từ 10 giờ làm tròn', hoursLabel(756), '13 giờ tập trung');
store.set('sf_timer_history', JSON.stringify({ totalMinutes: 810, sessions: 27, streak: 4 }));
const timed = collectSignals();
check('đọc được tổng phút từ Pomodoro', timed.totalMinutes, 810);
check('đọc được streak', timed.streak, 4);
check('hiện tổng giờ trong thẻ hôm nay', hoursLabel(timed.totalMinutes), '14 giờ tập trung');

// ── 6. Dữ liệu hỏng không làm sập trang ────────────────────────────────────
store.set('sf_learning_progress', 'khong-phai-json');
check('ticks hỏng thì trả về rỗng', readTicks(), { items: {}, stages: {} });
store.set('sf_code_lab_solutions', '{{{');
check('dữ liệu code lab hỏng thì bỏ qua', collectSignals().solvedProblems, []);
store.set('thucChien_done', '"khong-phai-mang"');
check('task hỏng thì trả 0', collectSignals().tasksDone, 0);

const failed = results.filter((r) => !r).length;
console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS`);
process.exitCode = failed ? 1 : 0;
