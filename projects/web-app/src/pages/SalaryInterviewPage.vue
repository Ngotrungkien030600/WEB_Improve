<template>
  <div class="page-root" style="--color-accent: #7c5cfc">
    <div class="page">
      <div class="topbar">
        <h1>💰 Phỏng vấn theo lương</h1>
        <button class="back" @click="handleNavigate('/')">← Trang chủ</button>
      </div>
      <p class="desc">Chọn mức lương mong muốn — hệ thống hiển thị câu hỏi phù hợp. Câu trả lời mẫu chi tiết kèm từ khóa. AI bổ sung theo yêu cầu.</p>

      <div class="salary-card">
        <h2>Chọn mức lương</h2>
        <p>Bấm vào mức lương phù hợp — mỗi mức có bộ câu hỏi riêng. Bạn cũng có thể nhập số tùy chỉnh bên dưới.</p>

        <div class="tier-grid">
          <div
            v-for="tier in tiers"
            :key="tier.id"
            class="tier-btn"
            :class="{ active: activeSalary >= tier.min && activeSalary <= tier.max }"
            @click="selectTier(tier)"
          >
            <span class="tier-icon">{{ tier.icon }}</span>
            <span class="tier-label">{{ tier.label }}</span>
            <span class="tier-range">{{ tier.range }}</span>
            <span class="tier-check">✓</span>
          </div>
        </div>

        <div class="custom-salary-row">
          <span class="custom-label">Hoặc nhập số:</span>
          <input
            type="number"
            v-model.number="customSalary"
            min="8"
            max="200"
            class="custom-input"
          />
          <span class="custom-label">triệu/tháng</span>
        </div>

        <div class="salary-tag" :style="{ background: activeTier?.color }">
          {{ activeTier?.icon }} {{ activeTier?.label }}: {{ activeTier?.range }}
        </div>

        <div class="q-count" v-if="activeTier">
          📋 {{ activeTier.questions.length }} câu hỏi
        </div>

        <input
          type="text"
          class="custom-input full"
          v-model="customRequest"
          placeholder="Yêu cầu riêng? VD: focus Spring Boot & Microservices — AI bổ sung câu hỏi"
          @keydown.enter="generate"
        />

        <div class="actions">
          <button class="gen-btn" :disabled="isGenerating" @click="generate">
            {{ isGenerating ? '⏳ Đang tạo...' : '🎯 Tạo câu hỏi' }}
          </button>
        </div>
      </div>

      <div v-if="questions.length" class="questions-container">
        <h2 class="questions-header">📋 {{ questions.length }} câu hỏi — {{ activeTier?.range }}</h2>
        <p class="questions-desc">{{ activeTier?.icon }} {{ activeTier?.description }}</p>

        <div v-for="(q, i) in questions" :key="q.id" class="question">
          <div class="q-head">
            <span class="q-topic">{{ q.topic || 'Java' }}{{ q.fromAI ? ' 🤖AI' : '' }}</span>
            <span v-if="q.difficulty" class="q-diff">{{ stars(q.difficulty) }}</span>
          </div>
          <div class="q-text">{{ i + 1 }}. {{ q.question }}</div>
          <details class="q-answer">
            <summary>📝 Xem câu trả lời mẫu</summary>
            <p class="answer-text">{{ q.sampleAnswer || '—' }}</p>
            <div v-if="q.keywords?.length" class="keywords">
              <span v-for="kw in q.keywords" :key="kw" class="kw">{{ kw }}</span>
            </div>
          </details>
        </div>

        <div v-if="activeTier?.topics" class="badge">
          📌 Chủ đề: {{ activeTier.topics.join(' • ') }}
        </div>

        <div v-if="nextTier" class="next-tier">
          💡 Mục tiêu: <strong :style="{ color: nextTier.color }">{{ nextTier.label }} ({{ nextTier.range }})</strong> — {{ nextTier.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import { salaryInterviewData } from '@legacy/js/data/salary-interview-data.js';

export default {
  name: 'SalaryInterviewPage',
  data() {
    return {
      tiers: salaryInterviewData.tiers,
      activeSalary: 20,
      customSalary: 20,
      customRequest: '',
      isGenerating: false,
      questions: [],
    };
  },
  computed: {
    activeTier() {
      return salaryInterviewData.getTier(this.activeSalary);
    },
    nextTier() {
      return salaryInterviewData.getNextTier(this.activeTier?.id);
    },
  },
  methods: {
    handleNavigate(path) {
      navigate(path);
    },
    selectTier(tier) {
      this.activeSalary = tier.min;
      this.customSalary = tier.min;
      this.questions = [];
    },
    stars(d) {
      return '⭐'.repeat(Math.min(d, 5)) + '○'.repeat(Math.max(0, 5 - d));
    },
    async generate() {
      this.isGenerating = true;
      const salary = this.activeSalary;
      const tier = this.activeTier;
      const custom = this.customRequest.trim();

      let all = [...(tier?.questions || [])];

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const resp = await fetch('/api/salary-interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ salary, customRequest: custom || '', topic: 'Java Backend' }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (resp.ok) {
          const d = await resp.json();
          if (d.questions?.length) {
            all = [...all, ...d.questions.map((q, i) => ({ ...q, id: 'ai-' + i, fromAI: true }))];
          }
        }
      } catch (e) {
        console.warn('Salary interview API error:', e);
      }

      this.questions = all;
      this.isGenerating = false;
    },
  },
  watch: {
    customSalary(val) {
      const v = Math.max(8, Math.min(200, val || 8));
      this.activeSalary = v;
      this.questions = [];
    },
  },
};
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  background: var(--color-bg, #0f0e17);
  color: var(--color-text, #e4e2f0);
}

.page {
  max-width: 860px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.topbar h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.back {
  background: none;
  border: none;
  color: var(--color-accent, #7c5cfc);
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}

.desc {
  color: var(--color-text2, #9d9bb5);
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.salary-card {
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 10px;
  padding: 1.75rem;
  margin-bottom: 2rem;
}

.salary-card h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.salary-card > p {
  font-size: 0.85rem;
  color: var(--color-text2, #9d9bb5);
  margin-bottom: 1.25rem;
}

.tier-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

@media (max-width: 500px) {
  .tier-grid {
    grid-template-columns: 1fr;
  }
}

.tier-btn {
  background: var(--color-surface2, #22213a);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.tier-btn:hover {
  border-color: var(--color-accent, #7c5cfc);
  transform: translateY(-2px);
}

.tier-btn.active {
  border-color: var(--color-accent, #7c5cfc);
  background: rgba(124, 92, 252, 0.1);
}

.tier-icon {
  font-size: 1.5rem;
  display: block;
}

.tier-label {
  font-size: 0.9rem;
  font-weight: 600;
  display: block;
}

.tier-range {
  font-size: 0.75rem;
  color: var(--color-text2, #9d9bb5);
  display: block;
  margin-top: 0.15rem;
}

.tier-check {
  display: inline-block;
  margin-top: 0.4rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--color-text2, #9d9bb5);
  line-height: 16px;
  font-size: 0.65rem;
  color: transparent;
}

.tier-btn.active .tier-check {
  border-color: var(--color-accent, #7c5cfc);
  background: var(--color-accent, #7c5cfc);
  color: white;
}

.custom-salary-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.custom-label {
  font-size: 0.85rem;
  color: var(--color-text2, #9d9bb5);
}

.custom-input {
  padding: 0.55rem 0.85rem;
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 10px;
  font-size: 0.85rem;
  font-family: inherit;
  background: var(--color-surface2, #22213a);
  color: var(--color-text);
  width: 80px;
  text-align: center;
}

.custom-input:focus {
  outline: none;
  border-color: var(--color-accent, #7c5cfc);
}

.custom-input.full {
  width: 100%;
  text-align: left;
  margin-top: 1rem;
  box-sizing: border-box;
}

.salary-tag {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  margin: 0.75rem 0 0.5rem;
}

.q-count {
  font-size: 0.75rem;
  color: var(--color-text2, #9d9bb5);
  margin-bottom: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.gen-btn {
  background: var(--color-accent, #7c5cfc);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.3rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.gen-btn:hover {
  background: var(--forge-purple-dark, #6b4de0);
}

.gen-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.questions-container {
  margin-top: 1rem;
}

.questions-header {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.questions-desc {
  font-size: 0.82rem;
  color: var(--color-text2, #9d9bb5);
  margin-bottom: 1rem;
}

.question {
  background: var(--color-surface, #1a1928);
  border: 1px solid var(--color-border, #2d2b44);
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 0.75rem;
}

.q-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
  flex-wrap: wrap;
}

.q-topic {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-accent, #7c5cfc);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: rgba(124, 92, 252, 0.1);
}

.q-diff {
  font-size: 0.7rem;
  color: var(--color-text2, #9d9bb5);
}

.q-text {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  line-height: 1.55;
}

.q-answer {
  font-size: 0.82rem;
  color: var(--color-text2, #9d9bb5);
  line-height: 1.6;
  padding: 0.65rem;
  background: var(--color-surface2, #22213a);
  border-radius: 10px;
}

.q-answer summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--color-text2, #9d9bb5);
  font-size: 0.78rem;
}

.q-answer[open] {
  border: 1px solid var(--color-border, #2d2b44);
  margin-top: 0.4rem;
}

.q-answer[open] summary {
  color: var(--color-accent, #7c5cfc);
  margin-bottom: 0.4rem;
}

.answer-text {
  margin-top: 0.5rem;
}

.keywords {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.kw {
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: rgba(124, 92, 252, 0.08);
  color: var(--color-accent, #7c5cfc);
  border: 1px solid rgba(124, 92, 252, 0.15);
}

.badge {
  font-size: 0.75rem;
  color: var(--color-text2, #9d9bb5);
  padding: 0.5rem 0;
}

.next-tier {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--color-surface2, #22213a);
  border-radius: 10px;
  font-size: 0.82rem;
  color: var(--color-text2, #9d9bb5);
}
</style>
