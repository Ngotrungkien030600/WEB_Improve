<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <div v-if="$slots.action" class="empty-action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '📭' },
  title: { type: String, default: 'Không có dữ liệu' },
  description: { type: String, default: '' }
});
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-10, 2.5rem);
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4, 1rem);
  opacity: 0.8;
}

.empty-title {
  font-size: var(--font-xl, 1.25rem);
  font-weight: 600;
  color: var(--forge-text);
  margin: 0 0 var(--space-2, 0.5rem);
}

.empty-description {
  font-size: var(--font-sm, 0.875rem);
  color: var(--forge-text3);
  margin: 0 0 var(--space-4, 1rem);
  max-width: 300px;
  line-height: 1.6;
}

.empty-action {
  margin-top: var(--space-2, 0.5rem);
}
</style>
