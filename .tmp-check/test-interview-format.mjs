// Test hàm thuần của trang Phỏng vấn UI/FE (không cần trình duyệt).
import {
  escapeHtml,
  normalizeForSearch,
  highlightText,
  formatInline,
  formatAnswer,
  matchesQuestion,
  filterQuestions,
  countTopics,
  pageSlice,
  pageCount,
  pageNumbers,
} from '../projects/web-app/src/utils/interview-format.js';
import { UI_INTERVIEW_QUESTIONS, UI_INTERVIEW_TIERS } from '../projects/web-app/src/data/ui-interview-questions.js';

const results = [];
function check(name, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name}${pass ? '' : ` | actual=${JSON.stringify(actual)} | expected=${JSON.stringify(expected)}`}`);
}
const contains = (name, haystack, needle) => {
  const pass = String(haystack).includes(needle);
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name}${pass ? '' : ` | không thấy ${JSON.stringify(needle)} trong ${JSON.stringify(String(haystack).slice(0, 160))}`}`);
};

// 1. Escape & chuẩn hoá tìm kiếm
check('escapeHtml chặn thẻ', escapeHtml('<b>&"\''), '&lt;b&gt;&amp;&quot;&#39;');
check('normalizeForSearch bỏ dấu tiếng Việt', normalizeForSearch('Lập Trình Đi'), 'lap trinh di');

// 2. Tô sáng
check('highlightText bọc <mark>', highlightText('Box model gồm gì?', 'box'), '<mark>Box</mark> model gồm gì?');
check('highlightText tìm được không dấu', highlightText('Lập trình viên', 'lap trinh'), '<mark>Lập trình</mark> viên');
check('highlightText không có từ khoá thì giữ nguyên', highlightText('Box model', ''), 'Box model');
check('highlightText nhiều lần khớp', highlightText('css và CSS', 'css'), '<mark>css</mark> và <mark>CSS</mark>');

// 3. Định dạng trong dòng
contains('formatInline đổi `code`', formatInline('Dùng `===` để so sánh'), '<code>===</code>');
contains('formatInline đổi **đậm**', formatInline('rất **quan trọng** đấy'), '<strong>quan trọng</strong>');
check('formatInline đậm + code cùng lúc', formatInline('**a** và `b`'), '<strong>a</strong> và <code>b</code>');
check('formatInline tô sáng bên trong đậm', formatInline('**Quan trọng**', 'quan'), '<strong><mark>Quan</mark> trọng</strong>');

// 4. Định dạng câu trả lời
check('formatAnswer gom gạch đầu dòng', formatAnswer('- a\n- b'), '<ul><li>a</li><li>b</li></ul>');
check('formatAnswer tách đoạn và khối code', formatAnswer('câu dẫn\n```\nconst a = 1;\n```'), '<p>câu dẫn</p><pre><code>const a = 1;</code></pre>');
check('formatAnswer bỏ dòng trống', formatAnswer('a\n\n\nb'), '<p>a</p><p>b</p>');
contains('formatAnswer tô sáng trong gạch đầu dòng', formatAnswer('- closure là gì', 'closure'), '<li><mark>closure</mark> là gì</li>');
contains('formatAnswer chặn XSS', formatAnswer('- <img src=x onerror=alert(1)>'), '&lt;img');
check('formatAnswer không sinh thẻ lạ', formatAnswer('- <script>bad()</script>').includes('<script'), false);

// 5. Tìm kiếm
const cssItem = { topic: 'CSS', q: 'Box model gồm những gì?', a: 'content padding border margin' };
check('khớp theo chủ đề', matchesQuestion(cssItem, 'css'), true);
check('khớp theo câu hỏi', matchesQuestion(cssItem, 'box model'), true);
check('khớp theo câu trả lời', matchesQuestion(cssItem, 'padding'), true);
check('khớp không dấu', matchesQuestion({ topic: 'Kiến trúc', q: 'Micro-frontend', a: '' }, 'kien truc'), true);
check('không khớp thì loại', matchesQuestion(cssItem, 'react'), false);
check('chuỗi rỗng khớp tất cả', matchesQuestion(cssItem, '   '), true);
check('filterQuestions lọc đúng', filterQuestions([cssItem, { topic: 'JS', q: 'this', a: '' }], 'js').length, 1);
check('countTopics đếm chủ đề', countTopics([cssItem, { topic: 'JS', q: 'a' }, { topic: 'JS', q: 'b' }]), 2);

// 6. Phân trang
check('pageSlice trang 2', pageSlice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2, 4), [5, 6, 7, 8]);
check('pageSlice quá trang thì rỗng', pageSlice([1, 2], 5, 4), []);
check('pageCount làm tròn lên', pageCount(10, 4), 3);
check('pageCount tối thiểu 1', pageCount(0, 4), 1);
check('pageNumbers ít trang', pageNumbers(1, 3), [1, 2, 3]);
check('pageNumbers trang đầu', pageNumbers(1, 10), [1, 2, 3, 4, '...', 10]);
check('pageNumbers giữa', pageNumbers(5, 10), [1, '...', 4, 5, 6, '...', 10]);
check('pageNumbers cuối', pageNumbers(10, 10), [1, '...', 7, 8, 9, 10]);

// 7. Dữ liệu thật
const tierIds = UI_INTERVIEW_TIERS.map((t) => t.id);
check('có 3 cấp độ', tierIds, ['junior', 'middle', 'senior']);
for (const tier of tierIds) {
  const list = UI_INTERVIEW_QUESTIONS[tier];
  check(`cấp ${tier} có câu hỏi`, list.length >= 10, true);
  check(`cấp ${tier} mọi câu đủ trường`, list.every((i) => i.topic && i.q && i.a), true);
  check(`cấp ${tier} không trùng câu hỏi`, new Set(list.map((i) => i.q)).size, list.length);
  check(`cấp ${tier} câu trả lời đủ sâu`, list.every((i) => i.a.length > 80), true);
}
const all = tierIds.flatMap((t) => UI_INTERVIEW_QUESTIONS[t]);
check('tổng số câu hỏi', all.length >= 30, true);
contains('có câu trả lời chứa code', formatAnswer(all.find((i) => i.a.includes('```')).a), '<pre><code>');
contains('câu trả lời dùng gạch đầu dòng', formatAnswer(all[0].a), '<ul><li>');

const failed = results.filter((r) => !r).length;
console.log(`\nTỔNG: ${results.length - failed}/${results.length} PASS`);
process.exitCode = failed ? 1 : 0;
