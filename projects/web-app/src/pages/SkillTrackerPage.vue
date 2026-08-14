<template>
  <div class="skill-page" style="--color-accent: #667eea">
    <CTopbar
      title="📊 Skill Tracker"
      back-label="Tiếng Anh"
      @go-home="handleBack"
    />

    <div class="subpage-content">
      <!-- Stats overview -->
      <section class="subpage-card skill-stats">
        <div class="skill-stat">
          <span class="skill-stat-value">{{ todayMinutes }}m</span>
          <span class="skill-stat-label">Hôm nay</span>
        </div>
        <div class="skill-stat">
          <span class="skill-stat-value">{{ streak }}🔥</span>
          <span class="skill-stat-label">Streak</span>
        </div>
        <div class="skill-stat">
          <span class="skill-stat-value">{{ totalSkills }}</span>
          <span class="skill-stat-label">Đã rèn</span>
        </div>
      </section>

      <!-- Category tabs -->
      <div class="skill-category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="skill-cat-tab"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>

      <!-- Skills list -->
      <section class="subpage-card skill-list-card">
        <div
          v-for="skill in filteredSkills"
          :key="skill.id"
          class="skill-item"
        >
          <div class="skill-info">
            <span class="skill-icon">{{ skill.icon }}</span>
            <div class="skill-details">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-desc">{{ skill.description }}</span>
            </div>
          </div>
          <div class="skill-progress">
            <div class="skill-level">Lv.{{ skill.level }}</div>
            <div class="skill-bar">
              <div
                class="skill-fill"
                :style="{
                  width: getProgressPercent(skill.xp) + '%',
                  background: getCategoryColor(skill.category)
                }"
              ></div>
            </div>
            <div class="skill-xp">{{ skill.xp }} XP</div>
          </div>
          <button class="skill-add-btn" @click="openLogModal(skill)">
            + Thực hành
          </button>
        </div>
      </section>

      <!-- Heatmap -->
      <section class="subpage-card skill-heatmap">
        <h3>🔥 Heatmap 7 ngày</h3>
        <div class="heatmap-grid">
          <div
            v-for="day in heatmap"
            :key="day.date"
            class="heatmap-cell"
            :class="getHeatClass(day.minutes)"
            :title="day.date + ': ' + day.minutes + 'm'"
          >
            <span class="heatmap-day">{{ formatDay(day.date) }}</span>
            <span class="heatmap-min">{{ day.minutes }}m</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Log practice modal -->
    <div v-if="showLogModal" class="modal-overlay" @click.self="closeLogModal">
      <div class="modal-card">
        <h3>📝 Ghi nhận thực hành</h3>
        <p class="modal-skill-name">
          {{ selectedSkill?.icon }} {{ selectedSkill?.name }}
        </p>
        <div class="modal-input-group">
          <label>Thời gian (phút):</label>
          <input
            v-model.number="logDuration"
            type="number"
            min="1"
            max="480"
            class="modal-input"
          />
        </div>
        <div class="modal-input-group">
          <label>Ghi chú (tùy chọn):</label>
          <input
            v-model="logNote"
            type="text"
            maxlength="200"
            class="modal-input"
          />
        </div>
        <div class="modal-actions">
          <button class="modal-btn-cancel" @click="closeLogModal">Hủy</button>
          <button class="modal-btn-confirm" @click="confirmLog">Lưu</button>
        </div>
        <div v-if="levelUpMessage" class="level-up-msg">
          🎉 {{ levelUpMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import { navigate } from '../utils/navigate.js';
import {
  SKILL_CATEGORIES,
  loadSkills,
  logPractice,
  calcStreak,
  getHeatmap,
  getTodayMinutes
} from '@legacy/js/features/skill-tracker/skill-logic.js';

export default {
  name: 'SkillTrackerPage',
  components: { CTopbar },

  data() {
    return {
      categories: SKILL_CATEGORIES,
      skills: [],
      selectedCategory: 'frontend',
      streak: 0,
      todayMinutes: 0,
      heatmap: [],

      showLogModal: false,
      selectedSkill: null,
      logDuration: 15,
      logNote: '',
      levelUpMessage: '',
    };
  },

  computed: {
    filteredSkills() {
      return this.skills.filter(s => s.category === this.selectedCategory);
    },
    totalSkills() {
      return this.skills.filter(s => s.level > 0).length;
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    handleBack() {
      navigate('/english');
    },

    loadData() {
      this.skills = loadSkills();
      this.streak = calcStreak();
      this.heatmap = getHeatmap();
      this.todayMinutes = getTodayMinutes();
    },

    getCategoryColor(categoryId) {
      const cat = this.categories.find(c => c.id === categoryId);
      return cat ? cat.color : 'var(--color-accent)';
    },

    getProgressPercent(xp) {
      return Math.min(100, (xp % 200) / 2);
    },

    getHeatClass(minutes) {
      if (minutes === 0) return 'heat-0';
      if (minutes < 15) return 'heat-1';
      if (minutes < 30) return 'heat-2';
      if (minutes < 60) return 'heat-3';
      return 'heat-4';
    },

    formatDay(dateStr) {
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const d = new Date(dateStr);
      return days[d.getDay()];
    },

    openLogModal(skill) {
      this.selectedSkill = skill;
      this.logDuration = 15;
      this.logNote = '';
      this.levelUpMessage = '';
      this.showLogModal = true;
    },

    closeLogModal() {
      this.showLogModal = false;
      this.selectedSkill = null;
    },

    confirmLog() {
      if (!this.selectedSkill) return;

      const result = logPractice(
        this.selectedSkill.id,
        this.logDuration,
        this.logNote
      );

      if (result) {
        this.loadData();

        if (result.leveledUp) {
          this.levelUpMessage = `Lên level ${result.skill.level}!`;
        }
      }

      if (!this.levelUpMessage) {
        this.closeLogModal();
      }
    },
  },
};
</script>

<style scoped>
/* CSS variables inherited from main.css */
@import '@legacy/css/subpage.css';

.skill-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 2.5rem 1.5rem;
}

.skill-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--space-4);
}

.skill-stat {
  text-align: center;
}

.skill-stat-value {
  display: block;
  font-size: var(--font-2xl);
  font-weight: 700;
  color: var(--color-accent);
}

.skill-stat-label {
  font-size: var(--font-sm);
  color: var(--color-text2);
}

.skill-category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.skill-cat-tab {
  padding: var(--space-1) var(--space-3);
  background: var(--color-surface2);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-sm);
  transition: all 0.15s ease;
}

.skill-cat-tab:hover {
  border-color: var(--color-accent);
}

.skill-cat-tab.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.skill-list-card {
  margin-bottom: var(--space-4);
}

.skill-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}

.skill-item:last-child {
  border-bottom: none;
}

.skill-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex: 1;
}

.skill-icon {
  font-size: var(--font-xl);
}

.skill-details {
  display: flex;
  flex-direction: column;
}

.skill-name {
  font-weight: 600;
}

.skill-desc {
  font-size: var(--font-sm);
  color: var(--color-text2);
}

.skill-progress {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 150px;
}

.skill-level {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--color-accent);
  min-width: 40px;
}

.skill-bar {
  flex: 1;
  height: 8px;
  background: var(--color-surface2);
  border-radius: 4px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.skill-xp {
  font-size: var(--font-xs);
  color: var(--color-text2);
  min-width: 50px;
  text-align: right;
}

.skill-add-btn {
  padding: var(--space-1) var(--space-3);
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.skill-add-btn:hover {
  border-color: var(--color-accent);
  background: var(--color-surface);
}

.skill-heatmap h3 {
  margin-bottom: var(--space-3);
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-2);
}

.heatmap-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--color-surface2);
}

.heatmap-day {
  font-size: var(--font-xs);
  color: var(--color-text2);
}

.heatmap-min {
  font-size: var(--font-sm);
  font-weight: 600;
}

.heat-0 { background: var(--color-surface2); }
.heat-1 { background: var(--color-success-bg, #dcfce7); }
.heat-2 { background: var(--color-success-light, #86efac); }
.heat-3 { background: var(--color-success, #22c55e); color: white; }
.heat-4 { background: var(--color-success-dark, #15803d); color: white; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-card h3 {
  margin-bottom: var(--space-2);
}

.modal-skill-name {
  font-size: var(--font-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.modal-input-group {
  margin-bottom: var(--space-3);
}

.modal-input-group label {
  display: block;
  font-size: var(--font-sm);
  color: var(--color-text2);
  margin-bottom: var(--space-1);
}

.modal-input {
  width: 100%;
  padding: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  background: var(--color-surface2);
}

.modal-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.modal-btn-cancel,
.modal-btn-confirm {
  flex: 1;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.modal-btn-cancel {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.modal-btn-confirm {
  background: var(--color-accent);
  border: none;
  color: white;
}

.modal-btn-cancel:hover,
.modal-btn-confirm:hover {
  opacity: 0.9;
}

.level-up-msg {
  text-align: center;
  margin-top: var(--space-3);
  padding: var(--space-2);
  background: var(--color-success-bg, #dcfce7);
  border-radius: var(--radius-md);
  color: var(--color-success-dark, #15803d);
  font-weight: 600;
}
</style>
