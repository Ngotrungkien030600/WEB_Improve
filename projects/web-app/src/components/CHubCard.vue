<template>
  <a class="hub-card" href="#" @click.prevent="handleClick">
    <span class="hub-card-icon">{{ icon }}</span>
    <div class="hub-card-body">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  </a>
</template>

<script>
export default {
  name: 'CHubCard',
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    path: { type: String, required: true },
  },
  emits: ['navigate'],
  methods: {
    handleClick() {
      this.$emit('navigate', this.path);
    },
  },
};
</script>

<style scoped>
.hub-card {
  background: var(--color-surface, var(--forge-surface, rgba(255, 255, 255, 0.04)));
  border: 1px solid var(--color-border, var(--forge-glass-border, rgba(255, 255, 255, 0.08)));
  border-radius: var(--border-radius, 10px);
  padding: 1.25rem;
  text-decoration: none;
  color: var(--color-text, var(--forge-text, #e4e2f0));
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: border-color 0.2s;
  cursor: pointer;
}

.hub-card:hover {
  border-color: var(--color-accent);
}

.hub-card-icon {
  font-size: 2rem;
  flex-shrink: 0;
  line-height: 1;
}

.hub-card-body h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.2rem 0;
  color: inherit;
}

.hub-card-body p {
  font-size: 0.85rem;
  color: var(--color-text2, var(--forge-text2, #9d9bb5));
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 600px) {
  .hub-card {
    flex-direction: column;
  }
}
</style>
