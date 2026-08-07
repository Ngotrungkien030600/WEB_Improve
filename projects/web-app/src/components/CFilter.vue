<template>
  <div class="filter-group">
    <span v-if="label" class="filter-label">{{ label }}</span>
    <div class="filter-chips">
      <button
        v-for="option in options"
        :key="option.value"
        class="filter-chip"
        :class="{ active: modelValue === option.value }"
        @click="select(option.value)"
      >
        <span v-if="option.icon" class="chip-icon">{{ option.icon }}</span>
        <span class="chip-label">{{ option.label }}</span>
        <span v-if="option.count !== undefined" class="chip-count">{{ option.count }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: null },
  options: {
    type: Array,
    required: true,
    validator: v => v.every(o => 'value' in o && 'label' in o)
  },
  label: { type: String, default: '' },
  allowClear: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'change']);

const select = (value) => {
  if (value === undefined) return;
  emit('update:modelValue', value);
  emit('change', value);
};
</script>

<style scoped>
.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2, 0.5rem);
}

.filter-label {
  font-size: var(--font-xs, 0.75rem);
  font-weight: 600;
  color: var(--forge-text3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2, 0.5rem);
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1, 0.25rem);
  padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: 99px;
  font-size: var(--font-sm, 0.875rem);
  font-weight: 500;
  color: var(--forge-text2);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.filter-chip:hover {
  background: var(--forge-surface-hover);
  border-color: var(--forge-glass-hover-border);
  color: var(--forge-text);
}

.filter-chip.active {
  background: linear-gradient(135deg, var(--forge-fire), var(--forge-fire-glow));
  border-color: transparent;
  color: white;
}

.filter-chip.active .chip-icon,
.filter-chip.active .chip-count {
  opacity: 0.9;
}

.chip-icon {
  font-size: 0.9rem;
}

.chip-count {
  font-size: var(--font-xs, 0.7rem);
  background: rgba(255, 255, 255, 0.15);
  padding: 0.1rem 0.4rem;
  border-radius: 99px;
}

.filter-chip.active .chip-count {
  background: rgba(255, 255, 255, 0.25);
}
</style>
