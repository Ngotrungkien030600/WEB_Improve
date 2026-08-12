/**
 * Skill Tracker — Data model & business logic
 * Lưu trữ trong localStorage, tính toán XP, level, streak
 */

const SKILL_CATEGORIES = [
  { id: 'frontend', name: 'Frontend', icon: '💻', color: '#3b82f6' },
  { id: 'backend', name: 'Backend', icon: '☕', color: '#f59e0b' },
  { id: 'ai', name: 'AI/ML', icon: '🤖', color: '#8b5cf6' },
  { id: 'english', name: 'English', icon: '🇬🇧', color: '#10b981' },
  { id: 'devops', name: 'DevOps', icon: '🐳', color: '#ef4444' },
];

const DEFAULT_SKILLS = [
  // Frontend
  { id: 'html', category: 'frontend', name: 'HTML & CSS', icon: '🌐', description: 'Cấu trúc và style web', level: 1, xp: 0 },
  { id: 'js', category: 'frontend', name: 'JavaScript', icon: '⚡', description: 'Ngôn ngữ lập trình web', level: 1, xp: 0 },
  { id: 'react', category: 'frontend', name: 'React / Vue', icon: '⚛️', description: 'Framework frontend', level: 0, xp: 0 },
  { id: 'responsive', category: 'frontend', name: 'Responsive', icon: '📱', description: 'Thiết kế đa thiết bị', level: 0, xp: 0 },
  // Backend
  { id: 'java', category: 'backend', name: 'Java Core', icon: '☕', description: 'Lập trình Java căn bản', level: 1, xp: 0 },
  { id: 'spring', category: 'backend', name: 'Spring Boot', icon: '🍃', description: 'Framework Java EE', level: 0, xp: 0 },
  { id: 'sql', category: 'backend', name: 'SQL & Database', icon: '🗄️', description: 'Truy vấn và thiết kế DB', level: 1, xp: 0 },
  { id: 'api', category: 'backend', name: 'REST API', icon: '🔗', description: 'Thiết kế API', level: 0, xp: 0 },
  // AI
  { id: 'ml-basics', category: 'ai', name: 'ML Basics', icon: '📊', description: 'Machine Learning căn bản', level: 0, xp: 0 },
  { id: 'llm', category: 'ai', name: 'LLM & Prompt', icon: '🧠', description: 'Prompt engineering & LLM', level: 1, xp: 0 },
  { id: 'python', category: 'ai', name: 'Python', icon: '🐍', description: 'Ngôn ngữ Python', level: 0, xp: 0 },
  // English
  { id: 'vocab', category: 'english', name: 'Từ vựng', icon: '📝', description: 'Vocabulary building', level: 2, xp: 0 },
  { id: 'grammar', category: 'english', name: 'Ngữ pháp', icon: '📖', description: 'English grammar', level: 1, xp: 0 },
  { id: 'speaking', category: 'english', name: 'Speaking', icon: '🎤', description: 'Luyện nói', level: 0, xp: 0 },
  // DevOps
  { id: 'git', category: 'devops', name: 'Git', icon: '🔀', description: 'Version control', level: 1, xp: 0 },
  { id: 'docker', category: 'devops', name: 'Docker', icon: '🐳', description: 'Containerization', level: 0, xp: 0 },
  { id: 'kubernetes', category: 'devops', name: 'Kubernetes', icon: '☸️', description: 'Container orchestration', level: 0, xp: 0 },
  { id: 'cicd', category: 'devops', name: 'CI/CD', icon: '🔄', description: 'Automated pipelines', level: 0, xp: 0 },
  { id: 'terraform', category: 'devops', name: 'Terraform', icon: '🏗️', description: 'Infrastructure as Code', level: 0, xp: 0 },
  { id: 'monitoring', category: 'devops', name: 'Monitoring', icon: '📊', description: 'Observability & alerting', level: 0, xp: 0 },
  { id: 'aws', category: 'devops', name: 'AWS Cloud', icon: '☁️', description: 'Cloud computing platform', level: 0, xp: 0 },
];

const XP_PER_LEVEL = 200;
const STREAK_DAYS = 7;

/** Lấy dữ liệu skills từ localStorage, nếu chưa có thì dùng default */
function loadSkills() {
  try {
    const raw = localStorage.getItem('skillforge_skills');
    if (raw) return JSON.parse(raw);
  } catch (e) { /* fall through */ }
  return JSON.parse(JSON.stringify(DEFAULT_SKILLS));
}

/** Lưu skills vào localStorage */
function saveSkills(skills) {
  localStorage.setItem('skillforge_skills', JSON.stringify(skills));
}

/** Lấy practice log */
function loadLog() {
  try {
    const raw = localStorage.getItem('skillforge_log');
    if (raw) return JSON.parse(raw);
  } catch (e) { /* fall through */ }
  return [];
}

/** Lưu practice log */
function saveLog(log) {
  localStorage.setItem('skillforge_log', JSON.stringify(log));
}

/** Tính level từ XP */
function calcLevel(xp) {
  return Math.min(5, Math.floor(xp / XP_PER_LEVEL));
}

/** Thêm XP cho 1 skill */
function addXP(skillId, amount = 10) {
  const skills = loadSkills();
  const skill = skills.find(s => s.id === skillId);
  if (!skill) return null;

  skill.xp += amount;
  const newLevel = calcLevel(skill.xp);
  const leveledUp = newLevel > skill.level;
  skill.level = newLevel;
  saveSkills(skills);
  return { skill, leveledUp };
}

/** Ghi practice log */
function logPractice(skillId, duration, note = '') {
  const log = loadLog();
  log.push({
    date: new Date().toISOString().split('T')[0],
    skillId,
    duration: parseInt(duration, 10) || 15,
    note: note.substring(0, 200),
  });
  saveLog(log);
  return addXP(skillId, Math.round(parseInt(duration, 10) || 15));
}

/** Tính streak (số ngày gần nhất có practice) */
function calcStreak() {
  const log = loadLog();
  if (log.length === 0) return 0;

  const dates = [...new Set(log.map(e => e.date))].sort().reverse();
  let streak = 1;
  const today = new Date().toISOString().split('T')[0];
  if (dates[0] !== today && dates[0] !== getYesterday()) return 0;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev - curr) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

/** Thống kê theo category */
function getCategoryStats() {
  const skills = loadSkills();
  const stats = {};

  SKILL_CATEGORIES.forEach(cat => {
    const catSkills = skills.filter(s => s.category === cat.id);
    const totalXP = catSkills.reduce((sum, s) => sum + s.xp, 0);
    const avgLevel = catSkills.length > 0 ? (catSkills.reduce((sum, s) => sum + s.level, 0) / catSkills.length).toFixed(1) : 0;
    stats[cat.id] = { totalXP, avgLevel, count: catSkills.length };
  });

  return stats;
}

/** Heatmap data: số phút practice 7 ngày gần nhất */
function getHeatmap() {
  const log = loadLog();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const totalMin = log.filter(e => e.date === dateStr).reduce((sum, e) => sum + (parseInt(e.duration, 10) || 0), 0);
    days.push({ date: dateStr, minutes: totalMin });
  }
  return days;
}

function getTodayMinutes() {
  const today = new Date().toISOString().split('T')[0];
  return loadLog().filter(e => e.date === today).reduce((sum, e) => sum + (parseInt(e.duration, 10) || 0), 0);
}

export {
  SKILL_CATEGORIES,
  loadSkills, saveSkills,
  loadLog, saveLog,
  addXP, logPractice,
  calcStreak, calcLevel,
  getCategoryStats, getHeatmap, getTodayMinutes,
};
