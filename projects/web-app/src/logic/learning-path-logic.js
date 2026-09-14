/**
 * Logic thuần cho lộ trình học: đọc tiến độ thật từ dữ liệu các trang đã có,
 * tính % từng chặng, gợi ý việc tiếp theo và nhắc ôn tập.
 * Không import dữ liệu legacy để chạy được cả trong Node (xem .tmp-check).
 */

export const LEARNING_PROGRESS_KEY = 'sf_learning_progress';
export const QUIZ_KEY = 'sf_java_tuzero_quiz';
export const THUC_CHIEN_DONE_KEY = 'thucChien_done';
export const CODE_LAB_KEY = 'sf_code_lab_solutions';
export const UI_INTERVIEW_KEY = 'sf_ui_interview_seen';
export const TIMER_HISTORY_KEY = 'sf_timer_history';

export const REVIEW_GAP_DAYS = 7;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (err) {
    return fallback;
  }
}

export function readTicks() {
  const stored = readJson(LEARNING_PROGRESS_KEY, {});
  return {
    items: stored.items && typeof stored.items === 'object' ? stored.items : {},
    stages: stored.stages && typeof stored.stages === 'object' ? stored.stages : {},
  };
}

export function saveTicks(ticks) {
  try {
    localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(ticks));
  } catch (err) {
    // hết dung lượng thì bỏ qua, không làm hỏng trang
  }
}

export function setItemTick(itemKey, done) {
  const ticks = readTicks();
  if (done) ticks.items[itemKey] = new Date().toISOString();
  else delete ticks.items[itemKey];
  saveTicks(ticks);
  return ticks;
}

export function markStage(stageId, done) {
  const ticks = readTicks();
  if (done) ticks.stages[stageId] = new Date().toISOString();
  else delete ticks.stages[stageId];
  saveTicks(ticks);
  return ticks;
}

/**
 * Đạt chuẩn một chặng: tick luôn các việc tự đánh giá còn lại, để "đã đạt chuẩn"
 * và thanh tiến độ không bao giờ nói hai điều khác nhau.
 */
export function markStageComplete(stage, signals, done) {
  let ticks = markStage(stage.id, done);
  if (!done) return ticks;
  stageItems(stage, signals, ticks)
    .filter((item) => !item.auto && !item.done)
    .forEach((item) => {
      ticks = setItemTick(item.key, true);
    });
  return ticks;
}

/** Trạng thái quiz Java từ 0 đã lưu. */
export function readQuizState() {
  const quiz = readJson(QUIZ_KEY, {});
  return {
    chapter: quiz.chapter && typeof quiz.chapter === 'object' ? quiz.chapter : {},
    read: quiz.read && typeof quiz.read === 'object' ? quiz.read : {},
  };
}

/**
 * Đếm số câu đã trả lời và số câu đúng. Cần nội dung đề truyền vào để module này
 * không phải import dữ liệu, nhờ vậy test được trong Node.
 */
export function countQuizResult(content, quizState) {
  const chapter = quizState?.chapter || {};
  const read = quizState?.read || {};
  let answered = 0;
  let correct = 0;
  let total = 0;
  (content?.chapters || []).forEach((ch) => {
    (ch.quiz || []).forEach((item, qi) => {
      total += 1;
      const picked = chapter[`${ch.id}-${qi}`];
      if (picked === undefined || picked === null) return;
      answered += 1;
      if (picked === item.answer) correct += 1;
    });
  });
  (content?.readCode || []).forEach((item, index) => {
    total += 1;
    const picked = read[`rc-${index}`];
    if (picked === undefined || picked === null) return;
    answered += 1;
    if (picked === item.answer) correct += 1;
  });
  return { answered, correct, total };
}

/** Gộp mọi tín hiệu tiến độ thật mà app đang có. */
export function collectSignals(extra = {}) {
  const solutions = readJson(CODE_LAB_KEY, {});
  const solvedProblems = Object.keys(solutions).filter((id) => solutions[id] && solutions[id].solved);

  const quizState = readQuizState();
  const quizAnswers = { ...quizState.chapter, ...quizState.read };
  const quizResult = extra.quizResult || null;

  const tasks = readJson(THUC_CHIEN_DONE_KEY, []);
  const seen = readJson(UI_INTERVIEW_KEY, []);
  const timer = readJson(TIMER_HISTORY_KEY, {});

  return {
    solvedProblems,
    solvedSet: new Set(solvedProblems),
    quizAnswered: quizResult ? quizResult.answered : Object.keys(quizAnswers).length,
    quizCorrect: quizResult ? quizResult.correct : null,
    quizTotal: quizResult ? quizResult.total : null,
    tasksDone: Array.isArray(tasks) ? tasks.length : 0,
    interviewSeen: Array.isArray(seen) ? seen.length : 0,
    totalMinutes: Number(timer.totalMinutes) || 0,
    sessions: Number(timer.sessions) || 0,
    streak: Number(timer.streak) || 0,
  };
}

function autoProgress(item, signals) {
  if (item.kind === 'code') {
    const ids = item.target?.problems || [];
    const done = ids.filter((id) => signals.solvedSet.has(id)).length;
    return { done, total: ids.length, detail: `${done}/${ids.length} bài đạt hết test`, satisfied: ids.length > 0 && done === ids.length };
  }
  if (item.kind === 'quiz') {
    const need = item.target?.answered || 0;
    const needCorrect = item.target?.correct || 0;
    const correct = signals.quizCorrect;
    const scored = typeof correct === 'number' && needCorrect > 0;
    const detail = scored
      ? `${signals.quizAnswered}/${need} câu · ${correct} câu đúng`
      : `${signals.quizAnswered}/${need} câu đã trả lời`;
    const satisfied = signals.quizAnswered >= need && (!scored || correct >= needCorrect);
    return { done: Math.min(signals.quizAnswered, need), total: need, detail, satisfied };
  }
  if (item.kind === 'tasks') {
    const need = item.target?.min || 1;
    const done = Math.min(signals.tasksDone, need);
    return { done, total: need, detail: `${signals.tasksDone} task đã đánh dấu xong`, satisfied: signals.tasksDone >= need };
  }
  if (item.kind === 'seen') {
    const need = item.target?.min || 1;
    const done = Math.min(signals.interviewSeen, need);
    return { done, total: need, detail: `${signals.interviewSeen} câu đã xem`, satisfied: signals.interviewSeen >= need };
  }
  return { done: 0, total: 1, detail: '', satisfied: false };
}

export function itemKeyOf(stageId, index) {
  return `${stageId}:${index}`;
}

/** Danh sách việc của một chặng kèm trạng thái thật. */
export function stageItems(stage, signals, ticks) {
  const raw = [
    ...(stage.lessons || []).map((lesson) => ({ ...lesson, kind: lesson.kind || 'manual', group: 'lesson' })),
    ...(stage.practice || []).map((practice) => ({ ...practice, group: 'practice' })),
    { key: 'checkpoint', label: stage.checkpoint, kind: 'manual', group: 'checkpoint' },
  ];
  return raw.map((item, index) => {
    const key = item.key ? itemKeyOf(stage.id, item.key) : itemKeyOf(stage.id, index);
    const auto = autoProgress(item, signals);
    const ticked = Boolean(ticks.items[key]);
    const done = item.kind === 'manual' ? ticked : auto.satisfied;
    return {
      key,
      group: item.group,
      label: item.label,
      path: item.path || '',
      kind: item.kind,
      done,
      auto: item.kind !== 'manual',
      detail: auto.detail,
    };
  });
}

export function stageProgress(stage, signals, ticks) {
  const items = stageItems(stage, signals, ticks);
  const done = items.filter((item) => item.done).length;
  return {
    stageId: stage.id,
    items,
    done,
    total: items.length,
    percent: items.length ? Math.round((done / items.length) * 100) : 0,
    completed: Boolean(ticks.stages[stage.id]),
    completedAt: ticks.stages[stage.id] || '',
  };
}

export function trackProgress(track, signals, ticks) {
  const stages = (track.stages || []).map((stage) => ({ ...stage, progress: stageProgress(stage, signals, ticks) }));
  const totalItems = stages.reduce((sum, stage) => sum + stage.progress.total, 0);
  const doneItems = stages.reduce((sum, stage) => sum + stage.progress.done, 0);
  const doneStages = stages.filter((stage) => stage.progress.percent === 100).length;
  return {
    stages,
    totalItems,
    doneItems,
    doneStages,
    totalStages: stages.length,
    percent: totalItems ? Math.round((doneItems / totalItems) * 100) : 0,
  };
}

/** Chặng kế tiếp chưa xong + việc cụ thể cần làm trong chặng đó. */
export function nextStep(track, signals, ticks) {
  const progress = trackProgress(track, signals, ticks);
  const stage = progress.stages.find((item) => item.progress.percent < 100) || null;
  if (!stage) return { stage: null, item: null, progress };
  const item = stage.progress.items.find((entry) => !entry.done) || null;
  return { stage, item, progress };
}

/** Nhắc ôn lại chặng đã xong từ REVIEW_GAP_DAYS ngày trở lên. */
export function reviewReminders(track, ticks, now = Date.now()) {
  const stages = track.stages || [];
  return stages
    .map((stage) => {
      const at = ticks.stages[stage.id];
      if (!at) return null;
      const days = Math.floor((now - new Date(at).getTime()) / 86400000);
      if (!Number.isFinite(days) || days < REVIEW_GAP_DAYS) return null;
      return { stageId: stage.id, title: stage.title, days };
    })
    .filter(Boolean)
    .sort((a, b) => b.days - a.days);
}

/** Cảnh báo mềm: chặng này nên học sau những chặng chưa xong. */
export function prerequisiteWarnings(stage, ticks) {
  return (stage.prerequisites || []).filter((id) => !ticks.stages[id]);
}

export function stageById(track, stageId) {
  return (track.stages || []).find((stage) => stage.id === stageId) || null;
}

export function hoursLabel(totalMinutes) {
  if (!totalMinutes) return 'chưa có phiên học nào';
  const hours = totalMinutes / 60;
  return `${hours >= 10 ? Math.round(hours) : hours.toFixed(1)} giờ tập trung`;
}
