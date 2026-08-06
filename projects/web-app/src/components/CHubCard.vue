<template>
  <a class="hub-card" href="#" @click.prevent="handleClick">
    <span class="hub-card-icon">{{ card.icon }}</span>
    <div class="hub-card-body">
      <h3>{{ card.title }}</h3>
      <p>{{ card.description }}</p>
    </div>
  </a>
</template>

<script>
export default {
  name: 'CHubCard',
  props: {
    card: { type: Object, required: true },
  },
  emits: ['navigate'],
  methods: {
    handleClick() {
      this.$emit('navigate', this.card);
    },
  },
};
</script>

<style scoped>
.hub-card {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius, 16px);
  padding: 1.25rem;
  text-decoration: none;
  color: var(--forge-text);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all var(--transition-spring);
  cursor: pointer;
  animation: cardAppear 0.5s ease-out backwards;
}

.hub-card:hover {
  background: var(--forge-glass-hover);
  border-color: var(--forge-accent, var(--color-accent, var(--forge-fire)));
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.hub-card-icon {
  font-size: 2rem;
  flex-shrink: 0;
  line-height: 1;
  transition: transform var(--transition-spring);
}

.hub-card:hover .hub-card-icon {
  transform: scale(1.15);
}

.hub-card-body {
  flex: 1;
  min-width: 0;
}

.hub-card-body h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.2rem 0;
  color: var(--forge-text);
  letter-spacing: -0.01em;
  transition: color var(--transition-fast);
}

.hub-card:hover .hub-card-body h3 {
  color: var(--forge-accent, var(--color-accent, var(--forge-ember)));
}

.hub-card-body p {
  font-size: 0.82rem;
  color: var(--forge-text3);
  line-height: 1.6;
  margin: 0;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation for child cards */
.hub-card:nth-child(1) { animation-delay: 0.05s; }
.hub-card:nth-child(2) { animation-delay: 0.1s; }
.hub-card:nth-child(3) { animation-delay: 0.15s; }
.hub-card:nth-child(4) { animation-delay: 0.2s; }
.hub-card:nth-child(5) { animation-delay: 0.25s; }
.hub-card:nth-child(6) { animation-delay: 0.3s; }
.hub-card:nth-child(7) { animation-delay: 0.35s; }
.hub-card:nth-child(8) { animation-delay: 0.4s; }
.hub-card:nth-child(9) { animation-delay: 0.45s; }
.hub-card:nth-child(10) { animation-delay: 0.5s; }
.hub-card:nth-child(11) { animation-delay: 0.55s; }

@media (max-width: 768px) {
  .hub-card {
    animation-delay: 0s !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hub-card {
    animation: none !important;
  }
}

@media (max-width: 600px) {
  .hub-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
