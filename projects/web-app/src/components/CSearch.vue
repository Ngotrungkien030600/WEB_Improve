<template>
  <div class="search-wrapper">
    <div class="search-box" :class="{ focused: isFocused, 'has-value': modelValue }">
      <span class="search-icon">{{ icon }}</span>
      <input
        ref="inputRef"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown.escape="clear"
        @keydown.enter="$emit('search', modelValue)"
      />
      <button
        v-if="modelValue"
        class="search-clear"
        @click="clear"
        tabindex="-1"
        aria-label="Xóa tìm kiếm"
      >
        ✕
      </button>
    </div>
    <div v-if="loading" class="search-loading">
      <span class="loading-spinner" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Tìm kiếm...' },
  icon: { type: String, default: '🔍' },
  loading: { type: Boolean, default: false },
  debounce: { type: Number, default: 300 }
});

const emit = defineEmits(['update:modelValue', 'search', 'clear']);
const inputRef = ref(null);
const isFocused = ref(false);
let debounceTimer = null;

const handleInput = (e) => {
  const value = e.target.value;
  emit('update:modelValue', value);

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search', value);
  }, props.debounce);
};

const clear = () => {
  emit('update:modelValue', '');
  emit('clear');
  inputRef.value?.focus();
};

const focus = () => inputRef.value?.focus();
defineExpose({ focus });
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  gap: var(--space-2, 0.5rem);
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-lg, 14px);
  padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
  transition: all var(--transition-fast);
}

.search-box.focused {
  border-color: var(--forge-accent, var(--forge-fire));
  box-shadow: 0 0 0 3px var(--forge-glow, rgba(249, 115, 22, 0.15));
}

.search-icon {
  font-size: 1rem;
  opacity: 0.6;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: var(--font-sm, 0.875rem);
  color: var(--forge-text);
  min-width: 0;
}

.search-input::placeholder {
  color: var(--forge-text3);
}

.search-clear {
  background: none;
  border: none;
  color: var(--forge-text3);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.75rem;
  border-radius: 50%;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.search-clear:hover {
  background: var(--forge-surface-hover);
  color: var(--forge-text);
}

.search-loading {
  position: absolute;
  right: var(--space-3, 0.75rem);
  top: 50%;
  transform: translateY(-50%);
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--forge-glass-border);
  border-top-color: var(--forge-accent, var(--forge-fire));
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
