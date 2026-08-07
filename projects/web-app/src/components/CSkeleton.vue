<template>
  <div v-if="type === 'card'" class="skeleton skeleton--card" :style="cardStyle" />
  <div v-else-if="type === 'text'" class="skeleton skeleton--text" :style="textStyle" />
  <div v-else-if="type === 'circle'" class="skeleton skeleton--circle" :style="{ width: size, height: size }" />
  <div v-else class="skeleton skeleton--box" :style="boxStyle" />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'box',
    validator: v => ['box', 'card', 'text', 'circle'].includes(v)
  },
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' },
  borderRadius: { type: String, default: '' }
});

const cardStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.borderRadius || 'var(--forge-card-radius, 16px)'
}));

const textStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.borderRadius || 'var(--radius-sm, 6px)'
}));

const boxStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.borderRadius || 'var(--radius-md, 10px)'
}));
</script>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--forge-surface) 0%,
    var(--forge-surface-hover) 50%,
    var(--forge-surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton--card {
  border-radius: var(--forge-card-radius, 16px);
}

.skeleton--text {
  border-radius: var(--radius-sm, 6px);
}

.skeleton--circle {
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton--box {
  border-radius: var(--radius-md, 10px);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
