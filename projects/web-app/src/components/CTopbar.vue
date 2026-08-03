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
  color: var(--color-text, var(--forge-text, #e4e2f0));
  margin: 0;
}

.back-link {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
