<template>
  <div class="hub-topbar">
    <h1>{{ title }}</h1>
    <nav class="page-nav-actions" aria-label="Điều hướng trang">
      <button
        class="back-link"
        type="button"
        :aria-label="isHomeDestination ? 'Về trang chủ' : 'Quay lại ' + backLabel"
        @click="goHome"
      >
        <svg class="back-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path v-if="isHomeDestination" d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7" />
          <path v-else d="M15 18l-6-6 6-6" />
        </svg>
        <span>{{ backLabel }}</span>
      </button>
      <button
        v-if="!isHomeDestination"
        class="home-link"
        type="button"
        aria-label="Về trang chủ"
        title="Về trang chủ"
        @click="goToHome"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-7h6v7" />
        </svg>
      </button>
    </nav>
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
  computed: {
    isHomeDestination() {
      return ['Trang chủ', 'Home'].includes(this.backLabel.replace(/^←\s*/, '').trim());
    },
  },
  methods: {
    goHome() {
      this.$emit('go-home', this.backPath);
    },
    goToHome() {
      this.$router.push('/');
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

.page-nav-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
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
  min-height: 42px;
  padding: 0.55rem 1rem;
  background: var(--forge-glass, rgba(255, 255, 255, 0.06));
  border: 1px solid var(--forge-glass-border, rgba(255, 255, 255, 0.1));
  border-radius: 999px;
  color: var(--forge-text2, #94a3b8);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-base);
  user-select: none;
}

.home-link {
  display: inline-grid;
  place-items: center;
  width: 42px;
  height: 42px;
  padding: 0;
  color: var(--forge-text2, #94a3b8);
  background: transparent;
  border: 1px solid var(--forge-glass-border, rgba(255, 255, 255, 0.1));
  border-radius: 13px;
  cursor: pointer;
  transition: color var(--transition-base), background var(--transition-base), border-color var(--transition-base), transform var(--transition-base);
}

.home-link svg {
  width: 19px;
  height: 19px;
}

.home-link:hover {
  color: var(--forge-text, #f8fafc);
  background: var(--forge-glass-hover, rgba(255, 255, 255, 0.12));
  border-color: var(--forge-accent, var(--forge-fire));
  transform: translateY(-1px);
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

.back-link:focus-visible,
.home-link:focus-visible {
  outline: 2px solid var(--forge-accent, var(--forge-fire));
  outline-offset: 3px;
}

@media (max-width: 560px) {
  .hub-topbar {
    align-items: flex-start;
  }

  .hub-topbar h1 {
    flex-basis: 100%;
  }

  .page-nav-actions {
    margin-left: 0;
  }

  .back-link {
    padding-inline: 0.8rem;
  }
}
</style>
