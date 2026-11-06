// Test logic đồng hồ Pomodoro (hàm thuần, không cần trình duyệt).
import {
  TIMER_MODES,
  FOCUS_PRESETS,
  findMode,
  minutesOf,
  formatTime,
  calcRatio,
  circumferenceOf,
  ringOffsetOf,
  toneOf,
  buildInitialState,
  buildTimerState,
  tickState,
  startState,
  pauseState,
  resetState,
  switchModeState,
  setMinutesState,
  stateAfterRestore,
  todayStats,
} from '../projects/web-app/src/logic/forge-timer-logic.js';

const results = [];
function check(name, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name}${pass ? '' : ` | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`}`);
}
const ok = (name, cond) => check(name, Boolean(cond), true);

// 1. Chế độ & mốc thời lượng
check('có 3 chế độ', TIMER_MODES.map((m) => m.id), ['focus', 'short', 'long']);
check('mốc thời lượng', FOCUS_PRESETS, [15, 25, 30, 45, 60]);
check('tìm chế độ theo id', findMode('short').label, 'Nghỉ ngắn');
check('id lạ thì về mặc định', findMode('khong-co').id, 'focus');
check('phút của trạng thái', minutesOf({ total: 2700 }), 45);
check('phút khi chưa có trạng thái', minutesOf({ mode: 'long' }), 15);

// 2. Định dạng thời gian
check('00:00 khi hết giờ', formatTime(0), '00:00');
check('định dạng phút:giây', formatTime(1800), '30:00');
check('làm tròn xuống giây lẻ', formatTime(65.9), '01:05');
check('số âm về 00:00', formatTime(-5), '00:00');
check('giá trị rỗng về 00:00', formatTime(undefined), '00:00');

// 3. Vòng tiến độ
check('tỉ lệ khi còn đủ', calcRatio(1800, 1800), 1);
check('tỉ lệ khi hết', calcRatio(0, 1800), 0);
check('tỉ lệ khi còn một nửa', calcRatio(900, 1800), 0.5);
check('tỉ lệ không vượt 1', calcRatio(2000, 1800), 1);
check('tỉ lệ không âm', calcRatio(-10, 1800), 0);
ok('chu vi bán kính 19 ≈ 119.4', Math.abs(circumferenceOf(19) - 119.38) < 0.05);
check('vòng đầy khi còn đủ giờ', Math.round(ringOffsetOf(1800, 1800, 188.5)), 0);
check('vòng cạn khi hết giờ', Math.round(ringOffsetOf(0, 1800, 188.5)), 189);
check('vòng còn nửa', Math.round(ringOffsetOf(900, 1800, 188.5)), 94);

// 4. Màu cảnh báo
check('bình thường không đổi màu', toneOf(1200, true), '');
check('còn 5 phút → cảnh báo', toneOf(300, true), 'warning');
check('còn 1 phút → nguy hiểm', toneOf(60, true), 'danger');
check('đang tạm dừng thì không cảnh báo', toneOf(30, false), '');
check('hết giờ không cảnh báo', toneOf(0, true), '');

// 5. Trạng thái khởi tạo
const init = buildInitialState(30);
check('khởi tạo 30 phút', init.remaining, 1800);
check('khởi tạo chưa chạy', init.running, false);
check('khởi tạo chế độ focus', init.mode, 'focus');
const built = buildTimerState({ mode: 'short' });
check('tạo theo chế độ nghỉ 5 phút', built.remaining, 300);
check('tạo kèm công tắc âm thanh', built.sound, true);
const builtMuted = buildTimerState({ mode: 'focus', minutes: 45, sound: false });
check('tạo với 45 phút và tắt tiếng', [builtMuted.total, builtMuted.sound], [2700, false]);

// 6. Chạy / tạm dừng / đặt lại
const running = startState(buildTimerState({ minutes: 30 }), 30);
check('bắt đầu thì chạy', running.running, true);
check('bắt đầu giữ nguyên thời lượng', running.remaining, 1800);
const midway = { ...running, remaining: 1500, lastUpdated: Date.now() - 10000 };
const paused = pauseState(midway);
check('tạm dừng trừ thời gian đã trôi', paused.remaining <= 1490 && paused.remaining >= 1489, true);
check('tạm dừng dừng chạy', paused.running, false);
const afterTick = tickState(midway);
check('tick trừ đúng số giây', afterTick.remaining <= 1490 && afterTick.remaining >= 1489, true);
check('tick không xuống dưới 0', tickState({ ...running, remaining: 2, lastUpdated: Date.now() - 60000 }).remaining, 0);
const reset = resetState(25, { mode: 'focus', sound: false });
check('đặt lại về đủ thời lượng', reset.remaining, 1500);
check('đặt lại giữ chế độ và âm thanh', [reset.mode, reset.sound], ['focus', false]);
const restarted = startState({ ...running, remaining: 0 }, 30);
check('hết giờ mà bấm chạy lại thì đầy lại', restarted.remaining, 1800);
const switched = switchModeState(running, 'long');
check('chuyển sang nghỉ dài 15 phút', [switched.mode, switched.total, switched.running], ['long', 900, false]);
const changed = setMinutesState(running, 60);
check('đổi mốc thời lượng', [changed.total, changed.remaining, changed.running], [3600, 3600, false]);

// 7. Mở lại trang: tab đóng giữa lúc chạy (lỗi cũ làm mất phiên)
const now = Date.now();
const wasRunning = { mode: 'focus', total: 1800, remaining: 1800, running: true, lastUpdated: now - 60000 };
const resumed = stateAfterRestore(wasRunning, now);
check('mở lại sau 60 giây → còn 1740', resumed.remaining, 1740);
check('mở lại vẫn đang chạy', resumed.running, true);
check('chưa hết giờ thì chưa ghi phiên', resumed.finished, false);
const expired = stateAfterRestore({ ...wasRunning, remaining: 30 }, now);
check('hết giờ trong lúc vắng → remaining 0', expired.remaining, 0);
check('hết giờ trong lúc vắng → đánh dấu đã xong', expired.finished, true);
check('hết giờ trong lúc vắng → không chạy tiếp', expired.running, false);
const pausedWhileAway = stateAfterRestore({ ...wasRunning, running: false, remaining: 900 }, now);
check('đang tạm dừng thì không trừ thời gian', [pausedWhileAway.remaining, pausedWhileAway.finished], [900, false]);
check('không có trạng thái thì trả null', stateAfterRestore(null), null);
check('trạng thái thiếu trường vẫn an toàn', stateAfterRestore({ running: false }, now).remaining, 0);

// 8. Thống kê theo ngày
const history = { dates: { '2026-09-11': 45 }, sessionDates: { '2026-09-11': 2 }, sessions: 9, streak: 3 };
check('số phút hôm nay', todayStats(history, '2026-09-11').minutes, 45);
check('số phiên hôm nay', todayStats(history, '2026-09-11').sessions, 2);
check('ngày chưa học → 0', todayStats(history, '2026-09-12'), { minutes: 0, sessions: 0 });
check('lịch sử rỗng vẫn an toàn', todayStats(null, '2026-09-11'), { minutes: 0, sessions: 0 });
check('lịch sử cũ chưa có sessionDates vẫn an toàn', todayStats({ dates: {} }, 'x'), { minutes: 0, sessions: 0 });

const failed = results.filter((r) => !r).length;
console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS`);
process.exitCode = failed ? 1 : 0;
