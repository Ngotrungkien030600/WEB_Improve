<template>
  <div class="home-page">
    <!-- Ambient ember particles -->
    <div class="ember-particles">
      <div class="ember"></div>
      <div class="ember"></div>
      <div class="ember"></div>
      <div class="ember"></div>
      <div class="ember"></div>
      <div class="ember"></div>
      <div class="ember"></div>
      <div class="ember"></div>
      <div class="ember"></div>
      <div class="ember"></div>
    </div>

    <div class="container">
      <CHomeHeader>
        <CHomeTimer />
      </CHomeHeader>

      <section class="hero-section">
        <h2 class="hero-title">Rèn kỹ năng,<br />tự tin chinh phục</h2>
        <p class="hero-subtitle">Từ Java, AWS Cloud đến Frontend, AI — học có lộ trình, thực hành có bài bản, ôn luyện có hệ thống.</p>
        <CHeroStats
          value1="50+"
          label1="Chủ đề"
          value2="300+"
          label2="Bài học"
          value3="7"
          label3="AI Agents"
        />
      </section>

      <div class="section-label">Khám phá</div>

      <CGrid>
        <CCard
          v-for="card in cards"
          :key="card.title"
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
          :path="card.path"
          @navigate="navigate"
        />
      </CGrid>

      <footer class="app-footer">
        <p>© 2026 SkillForge — Lò rèn kỹ năng của bạn</p>
      </footer>
    </div>
  </div>
</template>

<script>
import CCard from '../components/CCard.vue';
import CGrid from '../components/CGrid.vue';
import CHomeHeader from '../components/CHomeHeader.vue';
import CHomeTimer from '../components/CHomeTimer.vue';
import CHeroStats from '../components/CHeroStats.vue';
import { navigate } from '../utils/navigate.js';

const cards = [
  { icon: '🚀', title: 'Accelerator 30-Day', description: 'Lộ trình cấp tốc — 1h/ngày — 30 ngày lên Senior. Technical + English real-time.', path: '/accelerator' },
  { icon: '🗺️', title: 'Lộ trình', description: 'Lộ trình học có mục tiêu rõ ràng từ cơ bản đến nâng cao.', path: '/learning-paths' },
  { icon: '🧠', title: 'Học AI', description: 'AI/ML — kiến thức, thi trắc nghiệm, câu hỏi phỏng vấn, 8 dự án thực hành.', path: '/ai/hub' },
  { icon: '☕', title: 'Java', description: 'Code Java, Spring Boot, phỏng vấn backend (tiếng Việt & English).', path: '/java/hub' },
  { icon: '⚙️', title: 'Backend Engineering', description: 'SQL/NoSQL, Kafka, Docker, K8s, CI/CD, System Design, Performance.', path: '/backend' },
  { icon: '🌐', title: 'Frontend', description: 'HTML/CSS, JavaScript, React/Vue/Angular, Responsive, phỏng vấn UI/FE', path: '/frontend/hub' },
  { icon: '☁️', title: 'AWS Cloud', description: 'IAM, VPC, EC2, Lambda, ECS, S3, RDS, DynamoDB, CodePipeline, kiến trúc, best practices', path: '/cloud/hub' },
  { icon: '📖', title: 'English', description: 'Từ vựng, ngữ pháp, đọc truyện, luyện thi & game ghép cặp.', path: '/english/hub' },
  { icon: '🗣️', title: 'BMAD Agents', description: '7 trợ lý AI chuyên gia — phân tích, thiết kế, code, test, Party Mode', path: '/bmad-agents' },
  { icon: '📊', title: 'Skill Tracker', description: 'Theo dõi kỹ năng, XP, streak — biến việc học thành game.', path: '/skill-tracker' },
  { icon: '📈', title: 'Dashboard', description: 'Thống kê học tập, lịch sử thi, tổng quan tiến độ.', path: '/dashboard' },
];

export default {
  name: 'HomePage',
  components: { CCard, CGrid, CHomeHeader, CHomeTimer, CHeroStats },
  data() {
    return { cards };
  },
  methods: {
    navigate(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
:root {
  --forge-bg: #08080e;
  --forge-bg2: #0d0d1a;
  --forge-surface: rgba(255, 255, 255, 0.04);
  --forge-surface-hover: rgba(255, 255, 255, 0.08);
  --forge-glass: rgba(255, 255, 255, 0.06);
  --forge-glass-border: rgba(255, 255, 255, 0.08);
  --forge-glass-hover: rgba(255, 255, 255, 0.12);
  --forge-glass-hover-border: rgba(255, 255, 255, 0.18);
  --forge-fire: #f97316;
  --forge-fire-glow: #ea580c;
  --forge-ember: #fbbf24;
  --forge-glow: rgba(249, 115, 22, 0.25);
  --forge-glow-strong: rgba(249, 115, 22, 0.4);
  --forge-text: #f1f5f9;
  --forge-text2: #94a3b8;
  --forge-text3: #64748b;
  --forge-card-radius: 16px;
}

.home-page {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--forge-bg);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  color: var(--forge-text);
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  position: relative;
}

/* Ambient forge glow */
.home-page::before {
  content: '';
  position: fixed;
  top: -40%;
  right: -20%;
  width: 80%;
  height: 80%;
  background: radial-gradient(ellipse at center, rgba(249, 115, 22, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  animation: ambientGlow 8s ease-in-out infinite alternate;
}

.home-page::after {
  content: '';
  position: fixed;
  bottom: -30%;
  left: -15%;
  width: 60%;
  height: 60%;
  background: radial-gradient(ellipse at center, rgba(251, 191, 36, 0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  animation: ambientGlow2 12s ease-in-out infinite alternate;
}

@keyframes ambientGlow {
  0% { opacity: 0.5; transform: translate(0, 0); }
  100% { opacity: 1; transform: translate(5%, 3%); }
}

@keyframes ambientGlow2 {
  0% { opacity: 0.3; transform: translate(0, 0); }
  100% { opacity: 0.8; transform: translate(-3%, -5%); }
}

/* Floating ember particles */
.ember-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.ember {
  position: absolute;
  width: 3px;
  height: 3px;
  background: var(--forge-fire);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--forge-glow), 0 0 12px var(--forge-glow);
  animation: emberFloat linear infinite;
  opacity: 0;
}

.ember:nth-child(1) { left: 15%; animation-duration: 7s; animation-delay: 0s; }
.ember:nth-child(2) { left: 35%; animation-duration: 9s; animation-delay: 2s; width: 2px; height: 2px; }
.ember:nth-child(3) { left: 55%; animation-duration: 6s; animation-delay: 4s; }
.ember:nth-child(4) { left: 75%; animation-duration: 11s; animation-delay: 1s; width: 4px; height: 4px; }
.ember:nth-child(5) { left: 90%; animation-duration: 8s; animation-delay: 3s; }
.ember:nth-child(6) { left: 25%; animation-duration: 10s; animation-delay: 5s; width: 2px; height: 2px; }
.ember:nth-child(7) { left: 50%; animation-duration: 7s; animation-delay: 6s; }
.ember:nth-child(8) { left: 65%; animation-duration: 12s; animation-delay: 2.5s; width: 3px; height: 3px; }
.ember:nth-child(9) { left: 10%; animation-duration: 9s; animation-delay: 7s; }
.ember:nth-child(10) { left: 80%; animation-duration: 6.5s; animation-delay: 4.5s; width: 2px; height: 2px; }

@keyframes emberFloat {
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}

/* Container */
.container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1240px;
  padding: 1.5rem 1.5rem 1rem;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 3.5rem;
  animation: heroFadeIn 0.8s ease-out;
}

@keyframes heroFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #f1f5f9 0%, #fbbf24 40%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--forge-text2);
  max-width: 600px;
  margin: 0 auto 0.5rem;
  line-height: 1.6;
  font-weight: 400;
}

/* Section label */
.section-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--forge-text3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--forge-glass-border) 0%, transparent 100%);
}

/* Footer */
.app-footer {
  text-align: center;
  padding: 1.5rem 0 0.5rem;
  color: var(--forge-text3);
  font-size: 0.8rem;
  border-top: 1px solid var(--forge-glass-border);
  letter-spacing: 0.02em;
}

/* Responsive */
@media (max-width: 768px) {
  .container { padding: 1rem; }
  .hero-title { font-size: 2.2rem; }
  .hero-subtitle { font-size: 1rem; }
  .home-page :deep(.home-card) { padding: 1.25rem 1rem; }
  .home-page :deep(.home-card .icon) { font-size: 2.2rem; }
  .home-page :deep(.home-card h2) { font-size: 1rem; }
  .home-page :deep(.home-card p) { font-size: 0.78rem; }
}

@media (max-width: 400px) {
  .hero-title { font-size: 1.8rem; }
  .home-page :deep(.home-header-row) { flex-direction: column; align-items: flex-start; }
}
</style>
