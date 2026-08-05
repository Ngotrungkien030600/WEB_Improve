<template>
  <div class="dashboard-page">
    <div class="page">
      <CTopbar
        title="📊 Dashboard"
        back-label="← Trang chủ"
        @go-home="handleNavigate('/')"
      />

      <div class="stat-grid">
        <CStatCard
          :value="totalXp"
          label="Tổng XP"
          icon="⭐"
          accent-color="var(--forge-ember)"
        />
        <CStatCard
          :value="streak"
          label="Streak (ngày)"
          icon="🔥"
          accent-color="var(--forge-fire)"
        />
        <CStatCard
          :value="level"
          label="Level"
          icon="🏆"
          accent-color="var(--forge-success)"
        />
      </div>

      <div class="section">
        <h2 class="section-title">🎯 Kỹ năng</h2>
        <div v-if="skills.length === 0" class="empty-state">
          <div class="icon">📝</div>
          <p>Chưa có dữ liệu. Học để tích XP!</p>
        </div>
        <CTable v-else :columns="skillColumns" :data="skills">
          <template #cell-name="{ row }">
            <span class="skill-name">{{ row.icon || '📌' }} {{ row.name }}</span>
          </template>
          <template #cell-progress="{ row }">
            <div class="skill-bar">
              <div class="skill-bar-fill">
                <div :style="{ width: getSkillPct(row) + '%' }"></div>
              </div>
              <span class="skill-xp">{{ row.xp || 0 }} XP</span>
            </div>
          </template>
        </CTable>
      </div>

      <div class="section">
        <h2 class="section-title">📝 Lịch sử thi</h2>
        <div v-if="examHistory.length === 0" class="empty-state">
          <div class="icon">📝</div>
          <p>Chưa có bài thi nào.</p>
        </div>
        <CTable v-else :columns="examColumns" :data="examHistory" />
      </div>

      <div class="section">
        <h2 class="section-title">🔥 Streak 7 ngày</h2>
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
import CTopbar from '../components/CTopbar.vue';
import CStatCard from '../components/CStatCard.vue';
import CTable from '../components/CTable.vue';

export default {
  name: 'DashboardPage',
  components: { CTopbar, CStatCard, CTable },

  data() {
    return {
      skills: [],
      examHistory: [],
      streak: 0,
      streakDays: [],
      skillColumns: [
        { key: 'name', label: 'Kỹ năng' },
        { key: 'level', label: 'Level' },
        { key: 'xp', label: 'XP' },
        { key: 'progress', label: 'Tiến độ' },
      ],
      examColumns: [
        { key: 'date', label: 'Ngày' },
        { key: 'correct', label: 'Đúng' },
        { key: 'total', label: 'Tổng' },
        { key: 'pct', label: '%' },
        { key: 'label', label: 'ĐG' },
      ],
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
    handleNavigate(path) {
      navigate(path);
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
          this.examHistory = parsed.slice().reverse().slice(0, 20).map(exam => ({
            ...exam,
            date: this.formatDate(exam.date || exam.completedAt),
            pct: exam.total > 0 ? Math.round((exam.correct / exam.total) * 100) : 0,
            label: this.getExamLabel(exam),
          }));
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
.dashboard-page {
  background: var(--forge-bg);
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.page {
  max-width: 960px;
  margin: 0 auto;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--forge-glass-border);
  color: var(--forge-text);
}

.skill-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skill-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skill-bar-fill {
  height: 6px;
  border-radius: 3px;
  flex: 1;
  max-width: 120px;
  background: var(--forge-glass);
  overflow: hidden;
}

.skill-bar-fill div {
  height: 100%;
  border-radius: 3px;
  background: var(--forge-ember);
  transition: width 0.3s;
}

.skill-xp {
  font-size: 0.8rem;
  color: var(--forge-text3);
  min-width: 50px;
}

.streak-box {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.streak-day {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  background: var(--forge-glass);
  border: 2px solid transparent;
  color: var(--forge-text3);
  transition: all var(--transition-spring);
}

.streak-day.active {
  background: var(--forge-fire);
  color: white;
}

.streak-day.today {
  border-color: var(--forge-ember);
  color: var(--forge-ember);
}

.streak-day.active.today {
  border-color: var(--forge-ember);
  box-shadow: 0 0 16px rgba(249, 115, 22, 0.4);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
}

.empty-state .icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: var(--forge-text3);
  font-size: 0.95rem;
}

@media (max-width: 600px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }

  .streak-day {
    width: 36px;
    height: 36px;
    font-size: 0.7rem;
  }
}
</style>
