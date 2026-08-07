<template>
  <span class="badge" :class="[`badge--${variant}`, `badge--${size}`]">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'success', 'warning', 'error', 'info', 'outline'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v)
  }
});
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  border-radius: 99px;
  white-space: nowrap;
}

/* Sizes */
.badge--sm {
  padding: 0.125rem 0.5rem;
  font-size: 0.7rem;
}

.badge--md {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
}

.badge--lg {
  padding: 0.375rem 1rem;
  font-size: 0.9rem;
}

/* Variants */
.badge--default {
  background: var(--forge-surface);
  color: var(--forge-text2);
  border: 1px solid var(--forge-glass-border);
}

.badge--success {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge--warning {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge--error {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge--info {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge--outline {
  background: transparent;
  color: var(--forge-text2);
  border: 1px solid var(--forge-glass-border);
}

.badge--outline:hover {
  border-color: var(--forge-accent, var(--forge-fire));
  color: var(--forge-accent, var(--forge-fire));
}
</style>
