<template>
  <div class="home-page">
    <div class="container">
      <CHomeHeader>
        <div class="header-tools">
          <CHomeTimer />
          <CAccountMenu />
        </div>
      </CHomeHeader>

      <section class="hero-section">
        <h2 class="hero-title">Rèn kỹ năng,<br />tự tin chinh phục</h2>
        <p class="hero-subtitle">
          Ưu tiên tiếng Anh phỏng vấn, Full-stack/Backend, nghiệp vụ sản phẩm và triển khai thực tế — học theo lộ trình rõ ràng.
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
import CAccountMenu from '../components/CAccountMenu.vue';
import MotivationPopup from '../components/MotivationPopup.vue';
import { navigate } from '../utils/navigate.js';

const groups = [
  {
    icon: '🎯',
    title: 'Bắt đầu & lộ trình học',
    items: [
      { icon: '🗺️', title: 'Lộ trình học', description: 'Chọn mục tiêu đi làm, theo dõi các chặng và điều kiện hoàn thành.', path: '/learning-paths' },
      { icon: '🧠', title: 'Tư duy kỹ sư qua bài toán thật', description: 'Học thuật toán, backend, database, vận hành và tiếng Anh trong cùng tình huống thực tế.', path: '/engineering-thinking' },
      { icon: '🚀', title: 'Accelerator 30-Day', description: 'Kế hoạch luyện tập cấp tốc 1 giờ mỗi ngày trong 30 ngày.', path: '/accelerator' },
    ],
  },
  {
    icon: '🎤',
    title: 'Phỏng vấn & tiếng Anh đi làm',
    items: [
      { icon: '🗣️', title: 'Phỏng vấn bằng tiếng Anh', description: 'Luyện giới thiệu bản thân, dự án và câu hỏi kỹ thuật bằng tiếng Anh.', path: '/interview-english' },
      { icon: '🧑‍💼', title: 'Phỏng vấn kỹ thuật', description: 'Câu hỏi Java, Spring, database, kiến trúc và kinh nghiệm dự án.', path: '/interview' },
      { icon: '💬', title: 'Luyện nói & Viết', description: 'Luyện tạo câu hoàn chỉnh và diễn đạt ý trong công việc.', path: '/sentence-practice' },
      { icon: '📖', title: 'Tiếng Anh thực hành', description: 'Từ vựng, ngữ pháp và bài học theo chủ đề.', path: '/english' },
      { icon: '🎓', title: 'Thi thử', description: 'Kiểm tra kiến thức và từ vựng theo chủ đề.', path: '/exam' },
      { icon: '🎧', title: 'Podcast', description: 'Luyện nghe tiếng Anh khi cần bài học nhẹ hơn.', path: '/podcast' },
    ],
  },
  {
    icon: '💻',
    title: 'Full-stack, Backend & nghiệp vụ sản phẩm',
    items: [
      { icon: '⚙️', title: 'Backend Engineering', description: 'REST API, SQL, Kafka, Docker, CI/CD và System Design.', path: '/java/backend' },
      { icon: '☕', title: 'Java & Spring Boot', description: 'Java core, Spring Boot, thực chiến và phỏng vấn backend.', path: '/java/hub' },
      { icon: '🐹', title: 'Phỏng vấn Go', description: 'Ôn Go từ nền tảng đến concurrency, runtime và system design. Song ngữ Việt - Anh.', path: '/go/interview' },
      { icon: '📚', title: 'The Way to Go', description: 'Đọc sách Go theo 21 chương với ghi chú Việt - Anh, ví dụ và tiến độ riêng.', path: '/books/the-way-to-go' },
      { icon: '🌐', title: 'Frontend', description: 'HTML/CSS, JavaScript, framework và responsive UI.', path: '/frontend/hub' },
      { icon: '🧭', title: 'Business Domains', description: 'Học business object và quy trình IT trong banking, media, healthcare, e-commerce, energy, logistics.', path: '/business-domains' },
      { icon: '🧪', title: 'Phòng luyện code', description: 'Viết code, chạy thật và luyện tư duy giải quyết bài toán.', path: '/code-lab' },
    ],
  },
  {
    icon: '☁️',
    title: 'Cloud, DevOps & triển khai',
    items: [
      { icon: '☁️', title: 'AWS Cloud', description: 'IAM, VPC, EC2, Lambda, S3, RDS và kiến trúc cloud.', path: '/cloud' },
      { icon: '🐳', title: 'DevOps & CI/CD', description: 'Docker, Kubernetes, pipeline, Terraform và monitoring.', path: '/devops' },
    ],
  },
  {
    icon: '🧠',
    title: 'AI & công cụ phát triển',
    items: [
      { icon: '🤖', title: 'Học AI', description: 'AI/ML, kiến thức nền, quiz và dự án thực hành.', path: '/ai' },
      { icon: '⚡', title: 'AI Agent', description: 'CodeGraph, MCP, Skills, Jira/Wiki và cách dùng token hiệu quả.', path: '/ai/agent' },
      { icon: '🗣️', title: 'BMAD Agents', description: 'Khám phá quy trình làm việc với nhóm trợ lý AI chuyên biệt.', path: '/bmad-agents' },
    ],
  },
  {
    icon: '📊',
    title: 'Theo dõi tiến độ',
    items: [
      { icon: '📊', title: 'Skill Tracker', description: 'Theo dõi kỹ năng, XP và streak học tập.', path: '/skill-tracker' },
      { icon: '📈', title: 'Dashboard', description: 'Xem thống kê và tổng quan tiến độ học.', path: '/dashboard' },
    ],
  },
];

export default {
  name: 'HomePage',
  components: { CHubCard, CGrid, CHomeHeader, CHomeTimer, CAccountMenu, MotivationPopup },
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
.header-tools {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

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
