<template>
  <div class="bs-section">
    <h3>Câu hỏi theo level — bạn đang ở đâu?</h3>
    <p class="section-text">Các câu hỏi phỏng vấn backend thường tăng dần theo level: Junior hỏi nền tảng, Middle hỏi vận hành, Senior hỏi thiết kế & xử lý sự cố, Architect hỏi kiến trúc hệ thống. Luyện từ level của bạn trở lên để sẵn sàng.</p>
    <div class="cards-grid cols-4">
      <div class="info-card level-junior"><h4>🌱 Junior</h4><ul><li>ACID là gì?</li><li>INNER JOIN vs LEFT JOIN?</li><li>INDEX hoạt động thế nào?</li><li>Transaction isolation levels?</li><li>GET vs POST?</li></ul></div>
      <div class="info-card level-middle"><h4>📈 Middle</h4><ul><li>N+1 problem + fix?</li><li>Optimistic vs Pessimistic lock?</li><li>Redis dùng để làm gì?</li><li>Kafka partition?</li><li>Docker multi-stage build?</li></ul></div>
      <div class="info-card level-senior"><h4>🎯 Senior</h4><ul><li>CAP theorem?</li><li>Saga pattern?</li><li>Distributed caching?</li><li>Circuit Breaker?</li></ul></div>
      <div class="info-card level-architect"><h4>🏗️ Architect</h4><ul><li>Design URL shortener?</li><li>Design chat 10M users?</li><li>CQRS + Event Sourcing?</li></ul></div>
    </div>
    <div class="interview-cta">
      <a href="#" @click.prevent="handleNav('/salary-interview')">💰 Luyện phỏng vấn theo mức lương →</a>
    </div>
  </div>
</template>

<script>
import { navigate } from '../../utils/navigate.js';

export default {
  name: 'BackendSectionInterview',
  methods: {
    handleNav(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
.bs-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--forge-fire);
}

.bs-section h3:first-child {
  margin-top: 0;
}

.section-text {
  color: var(--forge-text2);
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 1rem 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.cards-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.info-card {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  transition: all var(--transition-fast);
}

.info-card:hover {
  border-color: var(--forge-fire);
  transform: translateY(-2px);
}

.info-card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--forge-text);
}

.info-card p,
.info-card li {
  font-size: 0.8rem;
  color: var(--forge-text3);
  margin: 0;
  line-height: 1.5;
}

.info-card ul {
  padding-left: 1rem;
  margin: 0.25rem 0 0;
}

.info-card li {
  margin-bottom: 0.2rem;
}

.level-junior { border-left: 3px solid #22c55e; }
.level-middle { border-left: 3px solid #3b82f6; }
.level-senior { border-left: 3px solid #f59e0b; }
.level-architect { border-left: 3px solid #ef4444; }

.interview-cta {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(251, 191, 36, 0.1));
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: var(--forge-card-radius);
  text-align: center;
}

.interview-cta a {
  color: var(--forge-ember);
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
}

.interview-cta a:hover {
  text-decoration: underline;
}

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
