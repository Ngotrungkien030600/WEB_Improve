<template>
  <button
    :class="['forge-btn', `forge-btn-${variant}`, `forge-btn-${size}`, { loading, disabled }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot v-else />
  </button>
</template>

<script>
export default {
  name: 'CButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: v => ['primary', 'secondary', 'ghost'].includes(v),
    },
    size: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].includes(v),
    },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  emits: ['click'],
};
</script>

<style scoped>
.forge-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-spring);
  position: relative;
  overflow: hidden;
}

.forge-btn:focus {
  outline: 2px solid var(--forge-fire);
  outline-offset: 2px;
}

.forge-btn.disabled,
.forge-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Sizes */
.forge-btn-sm {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
}

.forge-btn-md {
  padding: 0.55rem 1.25rem;
  font-size: 0.9rem;
}

.forge-btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

/* Primary variant */
.forge-btn-primary {
  background: linear-gradient(135deg, var(--forge-fire), var(--forge-fire-glow));
  color: white;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.25);
}

.forge-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.35);
}

.forge-btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(249, 115, 22, 0.2);
}

/* Secondary variant */
.forge-btn-secondary {
  background: var(--forge-glass);
  color: var(--forge-text);
  border: 1px solid var(--forge-glass-border);
}

.forge-btn-secondary:hover:not(:disabled) {
  background: var(--forge-glass-hover);
  border-color: var(--forge-glass-hover-border);
  transform: translateY(-2px);
}

.forge-btn-secondary:active:not(:disabled) {
  transform: translateY(0);
}

/* Ghost variant */
.forge-btn-ghost {
  background: transparent;
  color: var(--forge-text2);
  border: 1px solid transparent;
}

.forge-btn-ghost:hover:not(:disabled) {
  background: var(--forge-glass);
  color: var(--forge-text);
}

.forge-btn-ghost:active:not(:disabled) {
  background: var(--forge-glass-hover);
}

/* Loading spinner */
.btn-spinner {
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
