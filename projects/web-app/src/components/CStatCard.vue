<template>
  <div class="stat-card">
    <span v-if="icon" class="stat-icon">{{ icon }}</span>
    <div class="stat-value" :style="{ color: accentColor || 'var(--forge-ember)' }">
      {{ value }}
    </div>
    <div class="stat-label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'CStatCard',
  props: {
    value: { type: [String, Number], required: true },
    label: { type: String, required: true },
    icon: { type: String, default: '' },
    accentColor: { type: String, default: '' },
  },
};
</script>

<style scoped>
.stat-card {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all var(--transition-spring);
}

.stat-card:hover {
  background: var(--forge-glass-hover);
  border-color: var(--forge-glass-hover-border);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--forge-text3);
  font-weight: 500;
}
</style>
