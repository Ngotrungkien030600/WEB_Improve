<template>
  <div class="error-state">
    <div class="error-icon">⚠️</div>
    <h3 class="error-title">{{ title }}</h3>
    <p v-if="message" class="error-message">{{ message }}</p>
    <div class="error-actions">
      <button class="error-btn" @click="$emit('retry')">
        🔄 Thử lại
      </button>
      <button v-if="showHome" class="error-btn error-btn--secondary" @click="$emit('home')">
        🏠 Về trang chủ
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Đã xảy ra lỗi' },
  message: { type: String, default: '' },
  showHome: { type: Boolean, default: false }
});
defineEmits(['retry', 'home']);
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-10, 2.5rem);
  text-align: center;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4, 1rem);
}

.error-title {
  font-size: var(--font-xl, 1.25rem);
  font-weight: 600;
  color: var(--forge-error, #ef4444);
  margin: 0 0 var(--space-2, 0.5rem);
}

.error-message {
  font-size: var(--font-sm, 0.875rem);
  color: var(--forge-text3);
  margin: 0 0 var(--space-4, 1rem);
  max-width: 400px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: var(--space-3, 0.75rem);
  flex-wrap: wrap;
  justify-content: center;
}

.error-btn {
  padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
  border: none;
  border-radius: var(--radius-md, 10px);
  font-size: var(--font-sm, 0.875rem);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s ease);
  background: var(--forge-fire, #f97316);
  color: white;
}

.error-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.error-btn--secondary {
  background: var(--forge-surface);
  color: var(--forge-text);
  border: 1px solid var(--forge-glass-border);
}

.error-btn--secondary:hover {
  background: var(--forge-surface-hover);
}
</style>
