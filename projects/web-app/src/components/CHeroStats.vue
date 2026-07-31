<template>
  <div class="hero-stats">
    <div class="hero-stat">
      <div class="hero-stat-value">{{ value1 }}</div>
      <div class="hero-stat-label">{{ label1 }}</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-value">{{ value2 }}</div>
      <div class="hero-stat-label">{{ label2 }}</div>
    </div>
    <div class="hero-stat">
      <div class="hero-stat-value">{{ value3 }}</div>
      <div class="hero-stat-label">{{ label3 }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CHeroStats',
  props: {
    value1: { type: String, required: true },
    label1: { type: String, required: true },
    value2: { type: String, required: true },
    label2: { type: String, required: true },
    value3: { type: String, required: true },
    label3: { type: String, required: true },
  },
};
</script>

<style scoped>
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.hero-stat {
  text-align: center;
}

.hero-stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--forge-ember);
  line-height: 1;
}

.hero-stat-label {
  font-size: 0.8rem;
  color: var(--forge-text3);
  font-weight: 500;
  margin-top: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

@media (max-width: 768px) {
  .hero-stats { gap: 1.5rem; }
  .hero-stat-value { font-size: 1.4rem; }
}
</style>
