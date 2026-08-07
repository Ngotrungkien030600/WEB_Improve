<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="handleOverlayClick">
        <div class="modal-container" :class="`modal--${size}`" role="dialog" aria-modal="true">
          <div v-if="showHeader" class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button v-if="closable" class="modal-close" @click="close" aria-label="Đóng">
              ✕
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg', 'xl'].includes(v)
  },
  closable: { type: Boolean, default: true },
  closeOnOverlay: { type: Boolean, default: true },
  showHeader: { type: Boolean, default: true }
});

const emit = defineEmits(['update:modelValue', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleOverlayClick = () => {
  if (props.closeOnOverlay) close();
};

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.modelValue && props.closable) {
    close();
  }
};

watch(() => props.modelValue, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});

onMounted(() => document.addEventListener('keydown', handleEscape));
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4, 1rem);
  z-index: 9999;
}

.modal-container {
  background: var(--forge-bg2, #0d0d1a);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius, 16px);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Sizes */
.modal--sm { width: min(400px, 90vw); }
.modal--md { width: min(500px, 90vw); }
.modal--lg { width: min(700px, 90vw); }
.modal--xl { width: min(900px, 90vw); }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4, 1rem) var(--space-5, 1.25rem);
  border-bottom: 1px solid var(--forge-glass-border);
}

.modal-title {
  font-size: var(--font-lg, 1.125rem);
  font-weight: 700;
  color: var(--forge-text);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--forge-text3);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.modal-close:hover {
  color: var(--forge-text);
}

.modal-body {
  padding: var(--space-5, 1.25rem);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: var(--space-4, 1rem) var(--space-5, 1.25rem);
  border-top: 1px solid var(--forge-glass-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3, 0.75rem);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
