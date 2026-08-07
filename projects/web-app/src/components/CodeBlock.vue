<template>
  <div class="code-block">
    <div class="code-header">
      <span class="code-lang">{{ language }}</span>
      <div class="code-actions">
        <button class="copy-btn" @click="copyCode" :class="{ copied }">
          <span v-if="copied">✓ Đã copy</span>
          <span v-else>📋 Copy</span>
        </button>
      </div>
    </div>
    <pre class="code-content"><code>{{ code }}</code></pre>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: 'code' }
});

const copied = ref(false);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<style scoped>
.code-block {
  margin: 1rem 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--forge-surface-hover);
  border-bottom: 1px solid var(--forge-glass-border);
}

.code-lang {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--forge-text3);
  font-family: var(--font-mono);
}

.code-actions {
  display: flex;
  gap: 0.5rem;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-sm);
  color: var(--forge-text2);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.copy-btn:hover {
  background: var(--forge-surface-hover);
  border-color: var(--forge-accent, var(--forge-fire));
  color: var(--forge-text);
}

.copy-btn.copied {
  background: rgba(34, 197, 94, 0.15);
  border-color: #22c55e;
  color: #4ade80;
}

.code-content {
  margin: 0;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--forge-text);
  overflow-x: auto;
  white-space: pre;
}

.code-content code {
  background: transparent;
  padding: 0;
}
</style>
