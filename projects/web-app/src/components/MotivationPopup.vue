<template>
  <Teleport to="body">
    <Transition name="moti">
      <div v-if="visible" class="moti-popup" role="dialog" aria-modal="true">
        <button class="moti-close" title="Đóng" @click="handleClose">✕</button>
        <div class="moti-icon">⚡</div>
        <blockquote class="moti-text">"{{ currentQuote?.text }}"</blockquote>
        <div v-if="currentQuote?.author" class="moti-author">
          {{ currentQuote.author }}{{ currentQuote.role ? ` — ${currentQuote.role}` : '' }}
        </div>
        <div class="moti-actions">
          <button class="moti-btn moti-btn-primary" @click="handleStart">💪 Bắt đầu ngay</button>
          <button class="moti-btn moti-btn-ghost" @click="handleDismissToday">Không hiện lại hôm nay</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { getMotivationState, setMotivationState } from '../storage/index.js';

const QUOTES = [
  { text: 'Học mỗi ngày một chút, cuối năm bất ngờ ngồi nhìn thành quả', author: 'SkillForge Team' },
  { text: 'Code hôm nay, debug ngày mai, deploy ngày kia — thành công không chờ đợi ai', author: 'SkillForge Team' },
  { text: 'Mỗi bug được fix là một bài học được ghi nhận', author: 'SkillForge Team' },
  { text: 'Không có đường tắt đến thành công, chỉ có con đường kiên trì', author: 'SkillForge Team' },
  { text: '30 phút mỗi ngày = 182.5 giờ mỗi năm. Đủ để giỏi bất kỳ kỹ năng nào', author: 'SkillForge Team' },
];

const DAY_MS = 24 * 60 * 60 * 1000;

export default {
  name: 'MotivationPopup',
  props: {
    minIntervalHours: {
      type: Number,
      default: 6,
    },
  },
  data() {
    return {
      visible: false,
      currentQuote: null,
    };
  },
  mounted() {
    if (this.shouldShow()) {
      this.currentQuote = this.pickQuote();
      setTimeout(() => { this.visible = true; }, 1500);
      const state = getMotivationState();
      setMotivationState({
        ...state,
        lastShown: Date.now(),
        lastQuote: this.currentQuote?.text,
      });
    }
  },
  methods: {
    shouldShow() {
      const state = getMotivationState();
      if (state.dismissedToday && state.dismissedAt) {
        if (Date.now() - state.dismissedAt < DAY_MS) return false;
      }
      if (!state.lastShown) return true;
      const elapsed = Date.now() - state.lastShown;
      return elapsed >= this.minIntervalHours * 60 * 60 * 1000;
    },
    pickQuote() {
      const state = getMotivationState();
      let candidates = QUOTES.filter(q => q.text !== state.lastQuote);
      if (candidates.length === 0) candidates = QUOTES;
      return candidates[Math.floor(Math.random() * candidates.length)];
    },
    handleClose() {
      this.visible = false;
      const state = getMotivationState();
      setMotivationState({ ...state, lastShown: Date.now(), dismissedToday: false });
    },
    handleDismissToday() {
      this.visible = false;
      const state = getMotivationState();
      setMotivationState({ ...state, dismissedToday: true, dismissedAt: Date.now() });
    },
    handleStart() {
      this.visible = false;
      const state = getMotivationState();
      setMotivationState({ ...state, lastShown: Date.now(), dismissedToday: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
};
</script>

<style>
.moti-popup {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  max-width: 380px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  font-family: system-ui, -apple-system, sans-serif;
}

.moti-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.moti-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.moti-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.moti-text {
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.5;
  margin: 0 0 0.5rem;
  font-style: normal;
}

.moti-author {
  font-size: 0.85rem;
  opacity: 0.85;
  margin-bottom: 1.25rem;
}

.moti-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.moti-btn {
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.moti-btn-primary {
  background: white;
  color: var(--color-secondary, #764ba2);
}

.moti-btn-primary:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.moti-btn-ghost {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.moti-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Transition */
.moti-enter-active {
  transition: all 0.4s ease-out;
}

.moti-leave-active {
  transition: all 0.3s ease-in;
}

.moti-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.moti-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 480px) {
  .moti-popup {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}
</style>
