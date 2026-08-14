<template>
  <div class="hub-topbar">
    <h1>{{ title }}</h1>
    <a class="back-link" href="#" @click.prevent="goHome">
      <svg class="back-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span>{{ backLabel }}</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'CTopbar',
  props: {
    title: { type: String, required: true },
    backLabel: { type: String, default: '← Trang chủ' },
    backPath: { type: String, default: '/' },
  },
  emits: ['go-home'],
  methods: {
    goHome() {
      this.$emit('go-home', this.backPath);
    },
  },
};
</script>

<style scoped>
.hub-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hub-topbar h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--forge-text);
  margin: 0;
  letter-spacing: -0.02em;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1.05rem;
  background: var(--forge-glass, rgba(255, 255, 255, 0.06));
  border: 1px solid var(--forge-glass-border, rgba(255, 255, 255, 0.1));
  border-radius: 999px;
  color: var(--forge-text2, #94a3b8);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  user-select: none;
}

.back-arrow {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.back-link:hover {
  background: var(--forge-glass-hover, rgba(255, 255, 255, 0.12));
  border-color: var(--forge-accent, var(--forge-fire));
  color: var(--forge-text, #f8fafc);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px var(--forge-glow, rgba(139, 92, 246, 0.2));
}

.back-link:hover .back-arrow {
  transform: translateX(-2px);
}

.back-link:active {
  transform: translateY(0) scale(0.97);
}
</style>
