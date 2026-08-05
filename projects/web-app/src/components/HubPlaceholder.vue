<template>
  <div class="hub-placeholder">
    <h1>{{ label }}</h1>
    <p>Trang đang được port sang Vue — quay lại sau.</p>
    <button class="back-btn" type="button" @click="goHome">← Về trang chủ</button>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import { PORTED_PAGE_LABELS } from '../utils/ported-pages.js';

export default {
  name: 'HubPlaceholder',
  props: {
    hubPath: { type: String, required: true },
  },
  computed: {
    label() {
      return PORTED_PAGE_LABELS[this.hubPath] || this.hubPath;
    },
  },
  methods: {
    goHome() {
      navigate('/');
    },
  },
};
</script>

<style scoped>
.hub-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
  text-align: center;
}

.hub-placeholder h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--forge-text) 0%, var(--forge-ember) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hub-placeholder p {
  color: var(--forge-text2);
  font-size: 1rem;
}

.back-btn {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  color: var(--forge-text);
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--forge-glass-hover);
  border-color: var(--forge-glass-hover-border);
}
</style>
