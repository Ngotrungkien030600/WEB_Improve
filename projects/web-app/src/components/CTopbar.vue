<template>
  <div class="hub-topbar">
    <h1>{{ title }}</h1>
    <a class="back-link" href="#" @click.prevent="goHome">{{ backLabel }}</a>
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
  color: var(--forge-accent, var(--forge-fire));
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--forge-ember);
  text-decoration: underline;
}
</style>
