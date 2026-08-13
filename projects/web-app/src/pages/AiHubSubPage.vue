<template>
  <div class="ai-hub-page">
    <div class="ah-container">
      <div class="ah-topbar">
        <div class="ah-topbar-left">
          <span class="ah-icon">🧠</span>
          <h1>AI/ML</h1>
        </div>
        <div class="ah-topbar-right">
          <a class="ah-back" href="/" @click.prevent="handleBack">← Trang chủ</a>
        </div>
      </div>

      <p class="ah-desc">Học Artificial Intelligence & Machine Learning từ concepts đến thực hành.</p>

      <div class="ah-grid">
        <a class="ah-card" href="/ai/agent" @click.prevent="handleNavigate('/ai/agent')">
          <div class="ah-card-icon">🤖</div>
          <div class="ah-card-body">
            <h3>AI Agent</h3>
            <p>Agent, Tools, Function Calling, Token, Quota & Cost, AI at Edge</p>
          </div>
        </a>

        <a class="ah-card" href="/ai" @click.prevent="handleNavigate('/ai')">
          <div class="ah-card-icon">📚</div>
          <div class="ah-card-body">
            <h3>Học Concepts</h3>
            <p>48 khái niệm AI/ML flashcard: ML, DL, NLP, CV, GenAI</p>
          </div>
        </a>

        <a class="ah-card" href="/ai" @click.prevent="handleNavigate('/ai')">
          <div class="ah-card-icon">🎯</div>
          <div class="ah-card-body">
            <h3>Trắc nghiệm</h3>
            <p>50+ câu hỏi ML/DL/NLP — kiểm tra có thời gian</p>
          </div>
        </a>

        <a class="ah-card" href="/ai" @click.prevent="handleNavigate('/ai')">
          <div class="ah-card-icon">💼</div>
          <div class="ah-card-body">
            <h3>Phỏng vấn AI</h3>
            <p>60+ câu hỏi chia chủ đề, kèm checklist</p>
          </div>
        </a>

        <a class="ah-card" href="/ai" @click.prevent="handleNavigate('/ai')">
          <div class="ah-card-icon">🛠️</div>
          <div class="ah-card-body">
            <h3>Projects</h3>
            <p>8 dự án: Regression, CNN, RAG, Stable Diffusion</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

export default {
  name: 'AiHubPageSub',
  methods: {
    handleBack() {
      navigate('/');
    },
    handleNavigate(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
.ai-hub-page {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 100vh;
  padding: 2rem 1.5rem;
}

.ah-container {
  max-width: 960px;
  margin: 0 auto;
}

.ah-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.ah-topbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ah-icon {
  font-size: 2rem;
}

.ah-topbar h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  margin: 0;
}

.ah-topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ah-back {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}

.ah-back:hover {
  color: white;
}

.ah-desc {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.ah-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.ah-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.25rem;
  text-decoration: none;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
}

.ah-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.ah-card-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.ah-card-body h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 0.25rem 0;
}

.ah-card-body p {
  font-size: 0.85rem;
  color: #555;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .ah-grid {
    grid-template-columns: 1fr;
  }
}
</style>
