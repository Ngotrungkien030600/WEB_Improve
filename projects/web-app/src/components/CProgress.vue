<template>
  <div class="progress-bar" :class="[`progress--${variant}`, `progress--${size}`]">
    <div v-if="showLabel" class="progress-header">
      <span class="progress-label">{{ label }}</span>
      <span v-if="showPercent" class="progress-percent">{{ percent }}%</span>
    </div>
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{ width: `${clampedPercent}%` }"
        :class="{ animated: animate }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  label: { type: String, default: '' },
  showLabel: { type: Boolean, default: false },
  showPercent: { type: Boolean, default: false },
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'success', 'warning', 'error'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v)
  },
  animate: { type: Boolean, default: true }
});

const percent = computed(() => Math.round((props.value / props.max) * 100));
const clampedPercent = computed(() => Math.min(100, Math.max(0, percent.value)));
</script>

<style scoped>
.progress-bar {
  width: 100%;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-1, 0.25rem);
}

.progress-label {
  font-size: var(--font-xs, 0.75rem);
  font-weight: 600;
  color: var(--forge-text2);
}

.progress-percent {
  font-size: var(--font-xs, 0.75rem);
  font-weight: 700;
  color: var(--forge-text);
}

.progress-track {
  background: var(--forge-surface);
  border-radius: 99px;
  overflow: hidden;
}

/* Sizes */
.progress--sm .progress-track { height: 4px; }
.progress--md .progress-track { height: 8px; }
.progress--lg .progress-track { height: 12px; }

.progress-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s ease-out;
}

.progress-fill.animated {
  animation: progressShimmer 2s ease-in-out infinite;
  background-size: 200% 100%;
}

/* Variants */
.progress--default .progress-fill {
  background: linear-gradient(90deg, var(--forge-fire), var(--forge-ember));
}

.progress--success .progress-fill {
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

.progress--warning .progress-fill {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.progress--error .progress-fill {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

@keyframes progressShimmer {
  0% { background-position: 200% 0; }
  50% { background-position: -200% 0; }
  100% { background-position: -200% 0; }
}
</style>
