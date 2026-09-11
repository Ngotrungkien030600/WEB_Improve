// Logic thuần cho đăng ký/đăng nhập: kiểm tra dữ liệu, độ mạnh mật khẩu, băm mật khẩu.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

const PROGRESS_KEY_LABELS = {
  sf_timer_state: 'Trạng thái Pomodoro',
  sf_timer_history: 'Lịch sử Pomodoro',
  sf_exam_history: 'Lịch sử thi thử',
  sf_quiz_history: 'Lịch sử quiz',
  skillforge_motivation_state: 'Động lực học',
  skillforge_skills: 'Danh sách kỹ năng',
  skillforge_skill_state: 'Tiến độ kỹ năng',
  skillforge_timer_state: 'Trạng thái Pomodoro (bản cũ)',
  skillforge_timer_history: 'Lịch sử Pomodoro (bản cũ)',
  skillforge_exam_history: 'Lịch sử thi (bản cũ)',
  skillforge_log: 'Nhật ký học',
  quizHistory: 'Lịch sử quiz (bản cũ)',
  aiChecklist: 'Checklist AI',
  learnChecklist: 'Checklist lộ trình',
  interviewChecklist: 'Checklist phỏng vấn',
};

const STRENGTH_LABELS = ['Yếu', 'Yếu', 'Trung bình', 'Mạnh'];
const STRENGTH_HINTS = [
  'Mật khẩu nên có ít nhất 8 ký tự.',
  'Thêm chữ hoa và số để mật khẩu chắc hơn.',
  'Khá tốt — thêm ký tự đặc biệt để đạt mức Mạnh.',
  'Mật khẩu tốt.',
];

export function validateEmail(value) {
  const email = (value || '').trim();
  if (!email) return 'Vui lòng nhập email.';
  if (!EMAIL_PATTERN.test(email)) return 'Email chưa đúng định dạng.';
  return '';
}

export function validatePassword(value) {
  if (!value) return 'Vui lòng nhập mật khẩu.';
  if (value.length < 8) return 'Mật khẩu cần ít nhất 8 ký tự.';
  return '';
}

export function validateConfirm(password, confirm) {
  if (!confirm) return 'Vui lòng nhập lại mật khẩu.';
  if (confirm !== password) return 'Mật khẩu nhập lại không khớp.';
  return '';
}

export function passwordStrength(value) {
  const pw = value || '';
  if (!pw) return { score: 0, label: '', hint: STRENGTH_HINTS[0] };
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += 1;
  return { score, label: STRENGTH_LABELS[score], hint: STRENGTH_HINTS[score] };
}

export function normalizeEmail(value) {
  return (value || '').trim().toLowerCase();
}

export function displayNameFromEmail(email) {
  const local = normalizeEmail(email).split('@')[0] || 'bạn';
  return local;
}

export function makeSalt() {
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password, salt) {
  const text = `${salt}:${password}`;
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 33) ^ text.charCodeAt(i);
  return (hash >>> 0).toString(16);
}

export function isProgressKey(key) {
  if (key.startsWith('sf_auth')) return false;
  if (Object.prototype.hasOwnProperty.call(PROGRESS_KEY_LABELS, key)) return true;
  return key.startsWith('sf_') || key.startsWith('skillforge_');
}

export function progressKeyLabel(key) {
  return PROGRESS_KEY_LABELS[key] || key;
}

export function summarizeProgress(entries) {
  return entries
    .filter((entry) => isProgressKey(entry.key))
    .map((entry) => ({ key: entry.key, size: entry.size, label: progressKeyLabel(entry.key) }));
}
