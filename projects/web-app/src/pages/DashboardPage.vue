<template>
  <div class="dashboard-page" style="--color-accent: #7c5cfc">
    <div class="page">
      <div class="topbar">
        <h1>📊 Dashboard</h1>
        <a class="back" href="#" @click.prevent="handleBack">← Trang chủ</a>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="val">{{ totalXp }}</div>
          <div class="lbl">Tổng XP</div>
        </div>
        <div class="stat-card">
          <div class="val">{{ streak }}</div>
          <div class="lbl">Streak (ngày)</div>
        </div>
        <div class="stat-card">
          <div class="val">{{ level }}</div>
          <div class="lbl">Level</div>
        </div>
      </div>

      <div class="section">
        <h2>🎯 Kỹ năng</h2>
        <div v-if="skills.length === 0" class="empty-state">
          <div class="icon">📝</div>
          <p>Chưa có dữ liệu. Học để tích XP!</p>
        </div>
        <table v-else>
          <thead>
            <tr>
              <th>Kỹ năng</th>
              <th>Level</th>
              <th>XP</th>
              <th>Tiến độ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in skills" :key="skill.name">
              <td>{{ skill.icon || '📌' }} {{ skill.name }}</td>
              <td>{{ skill.level || 0 }}</td>
              <td>{{ skill.xp || 0 }}</td>
              <td>
                <div class="skill-bar">
                  <div class="skill-bar-fill">
                    <div :style="{ width: getSkillPct(skill) + '%' }"></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>📝 Lịch sử thi</h2>
        <div v-if="examHistory.length === 0" class="empty-state">
          <div class="icon">📝</div>
          <p>Chưa có bài thi nào.</p>
        </div>
        <table v-else>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Đúng</th>
              <th>Tổng</th>
              <th>%</th>
              <th>ĐG</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(exam, i) in examHistory" :key="i">
              <td>{{ formatDate(exam.date || exam.completedAt) }}</td>
              <td>{{ exam.correct || 0 }}</td>
              <td>{{ exam.total || 0 }}</td>
              <td>{{ getExamPct(exam) }}%</td>
              <td>{{ getExamLabel(exam) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>🔥 Streak 7 ngày</h2>
        <div class="streak-box">
          <div
            v-for="(day, i) in streakDays"
            :key="i"
            class="streak-day"
            :class="{
              active: day.active,
              today: day.isToday
            }"
          >{{ day.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

export default {
  name: 'DashboardPage',

  data() {
    return {
      skills: [],
      examHistory: [],
      streak: 0,
      streakDays: [],
    };
  },

  computed: {
    totalXp() {
      return this.skills.reduce((sum, s) => sum + (s.xp || 0), 0);
    },
    level() {
      return Math.floor(this.totalXp / 200) + 1;
    },
  },

  mounted() {
    this.loadSkills();
    this.loadExamHistory();
    this.loadStreak();
    this.buildStreakDays();
  },

  methods: {
    handleBack() {
      navigate('/');
    },

    loadSkills() {
      try {
        const raw = localStorage.getItem('skillforge_skills');
        if (raw) this.skills = JSON.parse(raw);
      } catch (e) {
        console.warn('Dashboard: skills parse failed', e);
        this.skills = [];
      }
    },

    loadExamHistory() {
      try {
        const raw = localStorage.getItem('skillforge_exam_history');
        if (raw) {
          const parsed = JSON.parse(raw);
          this.examHistory = parsed.slice().reverse().slice(0, 20);
        }
      } catch (e) {
        console.warn('Dashboard: exam history parse failed', e);
        this.examHistory = [];
      }
    },

    loadStreak() {
      try {
        const raw = localStorage.getItem('skillforge_log');
        if (!raw) { this.streak = 0; return; }

        const log = JSON.parse(raw);
        const dates = [...new Set(
          log.map(e => (e.date || '').split('T')[0])
        )].filter(Boolean).sort().reverse();

        if (dates.length === 0) { this.streak = 0; return; }

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let count = 0;
        let check = new Date(today);

        for (const d of dates) {
          const ds = check.toISOString().split('T')[0];
          if (d === ds) {
            count++;
            check.setDate(check.getDate() - 1);
          } else if (d === yesterday && count === 0) {
            count = 1;
          } else {
            break;
          }
        }
        this.streak = count;
      } catch (e) {
        console.warn('Dashboard: streak load failed', e);
        this.streak = 0;
      }
    },

    buildStreakDays() {
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const today = new Date().getDay();
      this.streakDays = [];

      let activeDates = new Set();
      try {
        const raw = localStorage.getItem('skillforge_log');
        if (raw) {
          const log = JSON.parse(raw);
          log.forEach(e => {
            const d = (e.date || '').split('T')[0];
            if (d) activeDates.add(d);
          });
        }
      } catch (e) {
        console.warn('Dashboard: streak days parse failed', e);
      }

      for (let i = 6; i >= 0; i--) {
        const idx = (today - i + 7) % 7;
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        this.streakDays.push({
          label: days[idx],
          active: activeDates.has(dateStr),
          isToday: i === 0,
        });
      }
    },

    getSkillPct(skill) {
      return ((skill.xp || 0) % 200) / 200 * 100;
    },

    getExamPct(exam) {
      return exam.total > 0 ? Math.round((exam.correct / exam.total) * 100) : 0;
    },

    getExamLabel(exam) {
      const pct = this.getExamPct(exam);
      if (pct >= 90) return '🌟';
      if (pct >= 75) return '✅';
      if (pct >= 50) return '⚠️';
      return '❌';
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN');
    },
  },
};
</script>

<style scoped>
@import '@legacy/css/variables.css';
@import '@legacy/css/subpage.css';

.dashboard-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.topbar h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.back {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-align: center;
}

.stat-card .val {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-accent);
}

.stat-card .lbl {
  font-size: 0.85rem;
  color: var(--color-text2);
  margin-top: 0.25rem;
}

.section {
  margin-bottom: 2rem;
}

.section h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text2);
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

td {
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

tr:hover td {
  background: var(--color-surface2);
}

.skill-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skill-bar-fill {
  height: 6px;
  border-radius: 3px;
  flex: 1;
  background: var(--color-surface2);
  overflow: hidden;
}

.skill-bar-fill div {
  height: 100%;
  border-radius: 3px;
  background: var(--color-accent);
  transition: width 0.3s;
}

.streak-box {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.streak-day {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--color-surface2);
  color: var(--color-text2);
}

.streak-day.active {
  background: var(--color-accent);
  color: white;
}

.streak-day.today {
  border: 2px solid var(--color-accent);
}

.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--color-text2);
}

.empty-state .icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 600px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
