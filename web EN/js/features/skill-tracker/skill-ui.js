/**
 * Skill Tracker — UI rendering
 */
import {
  SKILL_CATEGORIES, loadSkills, loadLog, saveLog, logPractice,
  calcStreak, calcLevel, getCategoryStats, getHeatmap, getTodayMinutes,
  addXP,
} from './skill-logic.js';

export function initSkillUI() {
  renderHeader();
  renderCategoryGrid();
  renderAllSkills();
  renderPracticeForm();
  renderHeatmap();
  renderLog();
}

function renderHeader() {
  const streak = calcStreak();
  const todayMin = getTodayMinutes();
  const totalXP = loadSkills().reduce((s, sk) => s + sk.xp, 0);

  document.getElementById('sk-total-xp').textContent = totalXP;
  document.getElementById('sk-streak').textContent = `🔥 ${streak} ngày`;
  document.getElementById('sk-today').textContent = `⏱ ${todayMin} phút`;
}

function renderCategoryGrid() {
  const grid = document.getElementById('sk-category-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const stats = getCategoryStats();

  SKILL_CATEGORIES.forEach(cat => {
    const s = stats[cat.id] || { totalXP: 0, avgLevel: 0, count: 0 };
    const card = document.createElement('div');
    card.className = 'sk-category-card';
    card.style.setProperty('--cat-color', cat.color);
    card.innerHTML = `
      <span class="sk-cat-icon">${cat.icon}</span>
      <span class="sk-cat-name">${cat.name}</span>
      <span class="sk-cat-level">Lv ${s.avgLevel}</span>
      <span class="sk-cat-xp">${s.totalXP} XP</span>
      <div class="sk-cat-bar"><div class="sk-cat-bar-fill" style="width:${Math.min(100, (parseFloat(s.avgLevel) / 5) * 100)}%"></div></div>
    `;
    grid.appendChild(card);
  });
}

function renderAllSkills() {
  const container = document.getElementById('sk-skills-container');
  if (!container) return;
  container.innerHTML = '';
  const skills = loadSkills();

  SKILL_CATEGORIES.forEach(cat => {
    const catSkills = skills.filter(s => s.category === cat.id);
    if (catSkills.length === 0) return;

    const section = document.createElement('div');
    section.className = 'sk-cat-section';
    section.innerHTML = `<h3 class="sk-cat-title" style="border-left:4px solid ${cat.color}">${cat.icon} ${cat.name}</h3>`;
    const grid = document.createElement('div');
    grid.className = 'sk-skill-grid';

    catSkills.forEach(skill => {
      const pct = Math.min(100, (skill.xp / ((skill.level + 1) * 200)) * 100);
      const card = document.createElement('div');
      card.className = 'sk-skill-card';
      card.innerHTML = `
        <div class="sk-skill-header">
          <span class="sk-skill-icon">${skill.icon}</span>
          <span class="sk-skill-name">${skill.name}</span>
          <span class="sk-skill-level">Lv ${skill.level}</span>
        </div>
        <div class="sk-skill-bar"><div class="sk-skill-bar-fill" style="width:${pct}%"></div></div>
        <p class="sk-skill-desc">${skill.description}</p>
      `;
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function renderPracticeForm() {
  const form = document.getElementById('sk-practice-form');
  if (!form) return;
  form.innerHTML = `
    <h3>📝 Hôm nay học gì?</h3>
    <div class="sk-form-row">
      <select id="sk-practice-skill" class="sk-input"></select>
      <input type="number" id="sk-practice-duration" class="sk-input" value="15" min="1" max="480" style="width:80px" />
      <span>phút</span>
    </div>
    <input type="text" id="sk-practice-note" class="sk-input" placeholder="Ghi chú (vd: học Spring Boot phần 1)" />
    <button id="sk-practice-save" class="sk-btn">✅ Lưu</button>
    <div id="sk-practice-feedback" class="sk-feedback"></div>
  `;

  // Populate skill select
  const select = document.getElementById('sk-practice-skill');
  loadSkills().forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.icon} ${s.name} (Lv ${s.level})`;
    select.appendChild(opt);
  });

  document.getElementById('sk-practice-save').addEventListener('click', () => {
    const skillId = select.value;
    const duration = document.getElementById('sk-practice-duration').value;
    const note = document.getElementById('sk-practice-note').value;
    const fb = document.getElementById('sk-practice-feedback');

    if (!skillId) { fb.textContent = '⚠️ Chọn kỹ năng!'; return; }

    const result = logPractice(skillId, duration, note);
    document.getElementById('sk-practice-note').value = '';

    if (result && result.leveledUp) {
      fb.innerHTML = `🎉 <strong>Level up!</strong> ${result.skill.name} lên Lv ${result.skill.level}!`;
    } else {
      fb.textContent = `✅ Đã lưu! (+${Math.round(parseInt(duration, 10) || 15)} XP)`;
    }
    fb.className = 'sk-feedback show';

    // Refresh all
    renderHeader();
    renderAllSkills();
    renderCategoryGrid();
    renderHeatmap();
    renderLog();
  });
}

function renderHeatmap() {
  const container = document.getElementById('sk-heatmap');
  if (!container) return;
  const data = getHeatmap();
  container.innerHTML = '<h3>📊 7 ngày gần đây</h3><div class="sk-heatmap-row"></div>';
  const row = container.querySelector('.sk-heatmap-row');

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const maxMin = Math.max(...data.map(d => d.minutes), 1);

  data.forEach(d => {
    const day = new Date(d.date).getDay();
    const intensity = maxMin > 0 ? d.minutes / maxMin : 0;
    const cell = document.createElement('div');
    cell.className = 'sk-heatmap-cell';
    cell.style.setProperty('--intensity', intensity);
    cell.title = `${d.date}: ${d.minutes} phút`;
    cell.innerHTML = `<span class="sk-heatmap-label">${dayNames[day]}</span><span class="sk-heatmap-val">${d.minutes}p</span>`;
    row.appendChild(cell);
  });
}

function renderLog() {
  const container = document.getElementById('sk-log');
  if (!container) return;
  const log = loadLog();
  const skills = loadSkills();
  const recent = log.slice(-10).reverse();

  container.innerHTML = '<h3>📜 Lịch sử</h3>';
  if (recent.length === 0) {
    container.innerHTML += '<p class="sk-empty">Chưa có hoạt động nào.</p>';
    return;
  }

  const list = document.createElement('div');
  list.className = 'sk-log-list';
  recent.forEach(entry => {
    const skill = skills.find(s => s.id === entry.skillId);
    const item = document.createElement('div');
    item.className = 'sk-log-item';
    item.innerHTML = `
      <span class="sk-log-date">${entry.date}</span>
      <span class="sk-log-skill">${skill ? skill.icon : '📌'} ${skill ? skill.name : entry.skillId}</span>
      <span class="sk-log-duration">${entry.duration}p</span>
      ${entry.note ? `<span class="sk-log-note">${entry.note}</span>` : ''}
    `;
    list.appendChild(item);
  });
  container.appendChild(list);
}
