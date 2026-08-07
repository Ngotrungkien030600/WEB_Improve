<template>
  <article
    class="hub-card"
    :class="[`hub-card--${variant}`, { 'hub-card--clickable': clickable }]"
    role="button"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <div class="hub-card-icon" v-if="icon">{{ icon }}</div>
    <div class="hub-card-content">
      <div class="hub-card-header">
        <h3 class="hub-card-title">{{ title }}</h3>
        <div v-if="badge" class="hub-card-badge">{{ badge }}</div>
      </div>
      <p v-if="description" class="hub-card-description">{{ description }}</p>
      <div v-if="progress !== undefined" class="hub-card-progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progress}%` }" />
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>
      <div v-if="tags && tags.length" class="hub-card-tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
    <div v-if="showArrow" class="hub-card-arrow">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  icon: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  badge: { type: [String, Number], default: '' },
  progress: { type: Number, default: undefined },
  tags: { type: Array, default: () => [] },
  path: { type: String, default: '' },
  clickable: { type: Boolean, default: true },
  showArrow: { type: Boolean, default: true },
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'compact', 'featured'].includes(v)
  }
});

const emit = defineEmits(['navigate', 'click']);

const handleClick = () => {
  emit('click');
  if (props.path) {
    emit('navigate', props.path);
  }
};
</script>

<style scoped>
.hub-card {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius, 16px);
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all var(--transition-spring);
  cursor: default;
  animation: cardAppear 0.5s ease-out backwards;
}

/* Clickable state */
.hub-card--clickable {
  cursor: pointer;
}

.hub-card--clickable:hover {
  background: var(--forge-glass-hover);
  border-color: var(--forge-accent, var(--forge-fire));
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.hub-card--clickable:hover .hub-card-icon {
  transform: scale(1.15);
}

.hub-card--clickable:hover .hub-card-title {
  color: var(--forge-accent, var(--forge-fire));
}

.hub-card--clickable:hover .hub-card-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Icon */
.hub-card-icon {
  font-size: 2rem;
  flex-shrink: 0;
  line-height: 1;
  transition: transform var(--transition-spring);
}

/* Content */
.hub-card-content {
  flex: 1;
  min-width: 0;
}

.hub-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.hub-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--forge-text);
  margin: 0;
  letter-spacing: -0.01em;
  transition: color var(--transition-fast);
}

.hub-card-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  background: var(--forge-accent, var(--forge-fire));
  color: white;
  border-radius: 99px;
}

.hub-card-description {
  font-size: 0.82rem;
  color: var(--forge-text3);
  line-height: 1.6;
  margin: 0;
}

/* Progress bar */
.hub-card-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.hub-card-progress .progress-track {
  flex: 1;
  height: 6px;
  background: var(--forge-surface);
  border-radius: 99px;
  overflow: hidden;
}

.hub-card-progress .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--forge-fire), var(--forge-ember));
  border-radius: 99px;
  transition: width 0.4s ease-out;
}

.hub-card-progress .progress-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--forge-accent, var(--forge-ember));
  min-width: 2.5rem;
  text-align: right;
}

/* Tags */
.hub-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.75rem;
}

.hub-card-tags .tag {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  background: var(--forge-surface);
  color: var(--forge-text3);
  border-radius: 99px;
  border: 1px solid var(--forge-glass-border);
}

/* Arrow */
.hub-card-arrow {
  flex-shrink: 0;
  color: var(--forge-text3);
  opacity: 0.5;
  transition: all var(--transition-fast);
  transform: translateX(-4px);
  align-self: center;
}

.hub-card--clickable .hub-card-arrow {
  opacity: 0;
}

/* Compact variant */
.hub-card--compact {
  padding: 1rem;
  gap: 0.75rem;
}

.hub-card--compact .hub-card-icon {
  font-size: 1.5rem;
}

.hub-card--compact .hub-card-title {
  font-size: 0.9rem;
}

.hub-card--compact .hub-card-description {
  font-size: 0.75rem;
}

/* Featured variant */
.hub-card--featured {
  background: linear-gradient(135deg, var(--forge-glass) 0%, var(--forge-surface-hover) 100%);
  border-color: var(--forge-accent, var(--forge-fire));
}

/* Animation */
@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hub-card:nth-child(1) { animation-delay: 0.05s; }
.hub-card:nth-child(2) { animation-delay: 0.1s; }
.hub-card:nth-child(3) { animation-delay: 0.15s; }
.hub-card:nth-child(4) { animation-delay: 0.2s; }
.hub-card:nth-child(5) { animation-delay: 0.25s; }
.hub-card:nth-child(6) { animation-delay: 0.3s; }
.hub-card:nth-child(7) { animation-delay: 0.35s; }
.hub-card:nth-child(8) { animation-delay: 0.4s; }
.hub-card:nth-child(9) { animation-delay: 0.45s; }
.hub-card:nth-child(10) { animation-delay: 0.5s; }

/* Responsive */
@media (max-width: 600px) {
  .hub-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hub-card-progress {
    flex-direction: column;
    gap: 0.5rem;
  }

  .hub-card-progress .progress-text {
    text-align: center;
  }

  .hub-card-tags {
    justify-content: center;
  }

  .hub-card-arrow {
    display: none;
  }

  .hub-card--clickable .hub-card-arrow {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hub-card,
  .hub-card--clickable:hover,
  .hub-card-icon {
    animation: none;
    transition: none;
  }
}
</style>
