<template>
  <div class="home-page">
    <div class="container">
      <CHomeHeader>
        <CHomeTimer />
      </CHomeHeader>

      <section class="hero-section">
        <h2 class="hero-title">Rèn kỹ năng,<br />tự tin chinh phục</h2>
        <p class="hero-subtitle">
          Từ Java, AWS Cloud đến Frontend, AI — học có lộ trình, thực hành có bài bản, ôn luyện có hệ thống.
        </p>
      </section>

      <section
        v-for="group in groups"
        :key="group.title"
        class="card-group"
      >
        <div class="section-label">
          <span class="section-icon">{{ group.icon }}</span>
          {{ group.title }}
        </div>
        <CGrid>
          <CHubCard
            v-for="card in group.items"
            :key="card.title"
            :icon="card.icon"
            :title="card.title"
            :description="card.description"
            :path="card.path"
            @navigate="navigate"
          />
        </CGrid>
      </section>

      <footer class="app-footer">
        <p>© 2026 SkillForge — Lò rèn kỹ năng của bạn</p>
      </footer>
    </div>

    <MotivationPopup />
  </div>
</template>

<script>
import CHubCard from '../components/CHubCard.vue';
import CGrid from '../components/CGrid.vue';
import CHomeHeader from '../components/CHomeHeader.vue';
import CHomeTimer from '../components/CHomeTimer.vue';
import MotivationPopup from '../components/MotivationPopup.vue';
import { navigate } from '../utils/navigate.js';

const groups = [
  {
    icon: '🧠',
    title: 'Trí tuệ nhân tạo',
    items: [
      { icon: '🤖', title: 'Học AI', description: 'AI/ML — kiến thức, quiz, phỏng vấn, dự án thực hành.', path: '/ai' },
      { icon: '⚡', title: 'AI Agent', description: 'Agent, Tools, Function Calling, Token & Cost.', path: '/ai/agent' },
      { icon: '🗣️', title: 'BMAD Agents', description: '7 trợ lý AI chuyên gia — Party Mode.', path: '/bmad-agents' },
    ],
  },
  {
    icon: '💻',
    title: 'Lập trình',
    items: [
      { icon: '☕', title: 'Java', description: 'Java core, Spring Boot, thực chiến, phỏng vấn backend.', path: '/java/hub' },
      { icon: '🌐', title: 'Frontend', description: 'HTML/CSS, JavaScript, framework, responsive.', path: '/frontend/hub' },
      { icon: '☁️', title: 'AWS Cloud', description: 'IAM, VPC, EC2, Lambda, S3, RDS, DevOps.', path: '/cloud' },
      { icon: '🐳', title: 'DevOps', description: 'Docker, Kubernetes, CI/CD, Terraform, Monitoring.', path: '/devops' },
      { icon: '⚙️', title: 'Backend Engineering', description: 'SQL, Kafka, Docker, K8s, CI/CD, System Design.', path: '/java/backend' },
    ],
  },
  {
    icon: '📖',
    title: 'Tiếng Anh',
    items: [
      { icon: '🗣️', title: 'Tiếng Anh', description: 'Từ vựng, ngữ pháp, truyện, luyện thi.', path: '/english' },
      { icon: '🎧', title: 'Podcast', description: 'Nghe podcast tiếng Anh.', path: '/podcast' },
      { icon: '🎓', title: 'Thi thử', description: 'Exam — kiểm tra trình độ theo chủ đề.', path: '/exam' },
      { icon: '💬', title: 'Luyện nói & Viết', description: 'Sentence Practice — luyện câu mỗi ngày.', path: '/sentence-practice' },
      { icon: '🎮', title: 'Game tiếng Anh', description: 'Ghép cặp, xếp chữ, trắc nghiệm nhanh.', path: '/game-memory' },
    ],
  },
  {
    icon: '🚀',
    title: 'Lộ trình & Công cụ',
    items: [
      { icon: '🚀', title: 'Accelerator 30-Day', description: 'Lộ trình cấp tốc — 1h/ngày — 30 ngày.', path: '/accelerator' },
      { icon: '🗺️', title: 'Lộ trình học', description: 'Học có mục tiêu rõ ràng từ cơ bản đến nâng cao.', path: '/learning-paths' },
      { icon: '📊', title: 'Skill Tracker', description: 'Theo dõi kỹ năng, XP, streak.', path: '/skill-tracker' },
      { icon: '📈', title: 'Dashboard', description: 'Thống kê học tập, tổng quan tiến độ.', path: '/dashboard' },
    ],
  },
];

export default {
  name: 'HomePage',
  components: { CHubCard, CGrid, CHomeHeader, CHomeTimer, MotivationPopup },
  data() {
    return { groups };
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
  --forge-bg: var(--color-bg-page, #0c0a1d);
  --forge-bg2: var(--color-bg-page-alt, #0f0c24);
  --forge-surface: rgba(139, 92, 246, 0.08);
  --forge-surface-hover: rgba(139, 92, 246, 0.15);
  --forge-glass: rgba(139, 92, 246, 0.1);
  --forge-glass-border: rgba(139, 92, 246, 0.2);
  --forge-glass-hover: rgba(139, 92, 246, 0.2);
  --forge-glass-hover-border: rgba(139, 92, 246, 0.35);
  --forge-fire: #8b5cf6;
  --forge-fire-glow: #7c3aed;
  --forge-ember: #06b6d4;
  --forge-glow: rgba(139, 92, 246, 0.25);
  --forge-glow-strong: rgba(139, 92, 246, 0.4);
  --forge-text: var(--text-primary-dark, #f8fafc);
  --forge-text2: var(--text-muted-dark, #cbd5e1);
  --forge-text3: var(--text-tertiary, #94a3b8);
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

.container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1240px;
  padding: 1.5rem 1.5rem 1rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 2.5rem;
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
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 400;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--forge-text2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.section-icon {
  font-size: 1rem;
}

.card-group {
  margin-bottom: 2.5rem;
}

.app-footer {
  text-align: center;
  padding: 1.5rem 0 0.5rem;
  color: var(--forge-text3);
  font-size: 0.8rem;
  border-top: 1px solid var(--forge-glass-border);
  letter-spacing: 0.02em;
}

@media (max-width: 768px) {
  .container { padding: 1rem; }
  .hero-title { font-size: 2.2rem; }
  .hero-subtitle { font-size: 1rem; }
}

@media (max-width: 400px) {
  .hero-title { font-size: 1.8rem; }
}
</style>
