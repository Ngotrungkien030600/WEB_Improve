<template>
  <div class="frontend-hub-page" style="--color-accent: #60a5fa">
    <div class="subpage-container">
      <header class="subpage-topbar">
        <div class="subpage-topbar-left">
          <span class="icon">🌐</span>
          <h1>Frontend Development</h1>
        </div>
        <div class="subpage-topbar-right">
          <div class="forge-timer-wrap">
            <div class="forge-timer-ring">
              <svg viewBox="0 0 68 68" width="68" height="68">
                <circle class="forge-ring-bg" cx="34" cy="34" r="30" />
                <circle class="forge-ring-progress" cx="34" cy="34" r="30" :style="{ strokeDashoffset: ringOffset }" />
              </svg>
              <div class="forge-time">{{ formattedTime }}</div>
            </div>
            <div class="forge-controls">
              <select v-model="timerDuration" @change="resetTimer">
                <option value="30">30p</option>
                <option value="60">1h</option>
              </select>
              <div class="forge-btn-row">
                <button class="forge-btn forge-btn-primary" @click="toggleTimer">
                  {{ isRunning ? '⏸️' : '⚒️' }}
                </button>
                <button class="forge-btn forge-btn-secondary" @click="resetTimer">↻</button>
              </div>
            </div>
            <div class="forge-stats">
              <div class="forge-stat-row">📋 Hôm nay <span class="val fire">{{ todayMins }}m</span></div>
              <div class="forge-stat-row">🔥 Streak <span class="val">{{ streak }}🔥</span></div>
              <div class="forge-stat-row">📦 Đã rèn <span class="val">{{ total }}</span></div>
            </div>
          </div>
          <a class="subpage-back" href="/" @click.prevent="handleBack">← Trang chủ</a>
        </div>
      </header>

      <p class="hub-desc">Kiến thức frontend toàn diện — từ HTML/CSS cơ bản đến React, Vue, Angular. Có phỏng vấn UI/UX riêng.</p>

      <div class="hub-grid">
        <a
          v-for="card in cards"
          :key="card.title"
          class="hub-card"
          :href="card.path"
          @click.prevent="handleNavigate(card.path)"
        >
          <div class="hub-icon">{{ card.icon }}</div>
          <div class="hub-body">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

const cards = [
  {
    icon: '🎨',
    title: 'HTML & CSS',
    description: 'HTML5 semantic, CSS Flexbox/Grid, Animation, Variables, BEM, Responsive, 25+ kỹ thuật',
    path: '/frontend/html-css',
  },
  {
    icon: '⚡',
    title: 'JavaScript',
    description: 'ES6+, DOM, Async/Await, Closure, Promise, Event Loop, Web API, Module, TypeScript cơ bản',
    path: '/frontend/javascript',
  },
  {
    icon: '⚛️',
    title: 'React / Vue / Angular',
    description: 'Component lifecycle, Hooks, State management, Router, Composition API, Directive, Signals',
    path: '/frontend/frameworks',
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    description: 'Media Queries, Container Queries, Mobile-first, Fluid typography, Breakpoint system',
    path: '/frontend/responsive',
  },
  {
    icon: '💼',
    title: 'Phỏng vấn UI/FE',
    description: 'Câu hỏi phỏng vấn Frontend theo cấp độ: Junior, Middle, Senior — kèm câu trả lời mẫu',
    path: '/frontend/ui-interview',
  },
];

export default {
  name: 'FrontendHubPage',

  data() {
    return {
      cards,
      timerDuration: 30,
      timerSeconds: 30 * 60,
      isRunning: false,
      timerInterval: null,
      todayMins: 0,
      streak: 0,
      total: 0,
    };
  },

  computed: {
    formattedTime() {
      const mins = Math.floor(this.timerSeconds / 60);
      const secs = this.timerSeconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    ringOffset() {
      const circumference = 2 * Math.PI * 30;
      const total = this.timerDuration * 60;
      const fraction = this.timerSeconds / total;
      return circumference * fraction;
    },
  },

  methods: {
    handleBack() {
      navigate('/');
    },
    handleNavigate(path) {
      navigate(path);
    },
    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
      } else {
        this.timerInterval = setInterval(() => {
          if (this.timerSeconds > 0) {
            this.timerSeconds--;
          } else {
            clearInterval(this.timerInterval);
            this.isRunning = false;
          }
        }, 1000);
        this.isRunning = true;
      }
    },
    resetTimer() {
      clearInterval(this.timerInterval);
      this.timerSeconds = this.timerDuration * 60;
      this.isRunning = false;
    },
  },

  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
};
</script>

<style scoped>
/* CSS variables inherited from main.css */

.frontend-hub-page {
  background: var(--color-bg);
  min-height: 100vh;
}

/* Topbar */
.subpage-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
  gap: var(--space-3);
}

.subpage-topbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.subpage-topbar-left .icon {
  font-size: 1.5rem;
}

.subpage-topbar-left h1 {
  font-size: var(--font-lg);
  font-weight: 700;
  margin: 0;
}

.subpage-topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.subpage-back {
  color: var(--color-accent);
  text-decoration: none;
  font-size: var(--font-sm);
  cursor: pointer;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.subpage-back:hover {
  background: var(--color-surface2);
}

/* Hub Desc */
.hub-desc {
  max-width: 800px;
  margin: var(--space-5) auto var(--space-4);
  padding: 0 var(--space-6);
  color: var(--color-text2);
  font-size: var(--font-base);
  line-height: 1.6;
}

/* Hub Grid */
.hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 var(--space-6) var(--space-6);
}

.hub-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.2s;
}

.hub-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.hub-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.hub-body h3 {
  font-size: var(--font-base);
  font-weight: 700;
  margin-bottom: var(--space-1);
}

.hub-body p {
  font-size: var(--font-sm);
  color: var(--color-text2);
  line-height: 1.5;
  margin: 0;
}
</style>
