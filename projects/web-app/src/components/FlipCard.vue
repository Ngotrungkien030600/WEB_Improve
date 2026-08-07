<template>
  <div
    class="flip-card"
    :class="[`flip-card--${variant}`, { flipped }]"
    @click="$emit('flip')"
  >
    <div class="flip-card-inner">
      <!-- Front -->
      <div class="flip-card-face flip-card-front">
        <div class="card-content">
          <span v-if="front.title" class="card-title">{{ front.title }}</span>
          <span v-if="front.subtitle" class="card-subtitle">{{ front.subtitle }}</span>
          <p v-if="front.content" class="card-text">{{ front.content }}</p>
          <span v-if="front.hint" class="card-hint">{{ front.hint }}</span>
        </div>
      </div>

      <!-- Back -->
      <div class="flip-card-face flip-card-back">
        <div class="card-content">
          <template v-if="back.content || back.subcontent">
            <p v-if="back.content" class="card-text">{{ back.content }}</p>
            <p v-if="back.subcontent" class="card-subtext">{{ back.subcontent }}</p>
          </template>
          
          <template v-else-if="back.meaning">
            <div class="detail-section">
              <span class="detail-label">📖 Nghĩa</span>
              <p class="detail-value">{{ back.meaning }}</p>
            </div>
            <div class="detail-section">
              <span class="detail-label">💡 Dùng khi</span>
              <p class="detail-value">{{ back.usage }}</p>
            </div>
            <div class="detail-section">
              <span class="detail-label">🔧 Công thức</span>
              <p class="detail-value formula">{{ back.formula }}</p>
            </div>
            <div v-if="back.examples && back.examples.length" class="detail-section">
              <span class="detail-label">📝 Ví dụ</span>
              <div class="examples">
                <p v-for="(ex, i) in back.examples" :key="i" class="example">{{ ex }}</p>
              </div>
            </div>
          </template>

          <p v-if="back.note" class="card-note">{{ back.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  front: {
    type: Object,
    required: true,
    default: () => ({})
  },
  back: {
    type: Object,
    required: true,
    default: () => ({})
  },
  flipped: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'large'].includes(v)
  }
});

defineEmits(['flip']);
</script>

<style scoped>
.flip-card {
  background: transparent;
  perspective: 1000px;
  cursor: pointer;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  min-height: 280px;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 2rem;
  min-height: 280px;
}

.flip-card-front {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  border: 2px solid rgba(99, 102, 241, 0.3);
}

.flip-card-back {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  transform: rotateY(180deg);
  color: white;
}

/* Large variant */
.flip-card--large .flip-card-inner {
  min-height: 350px;
}

.flip-card--large .flip-card-face {
  min-height: 350px;
  padding: 2.5rem;
}

/* Card Content */
.card-content {
  text-align: center;
  width: 100%;
}

.card-title {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-subtitle {
  display: block;
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.card-text {
  font-size: 1rem;
  color: #e2e8f0;
  line-height: 1.6;
  margin: 0.5rem 0;
}

.card-subtext {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  margin-top: 0.5rem;
}

.card-hint {
  display: block;
  font-size: 1.25rem;
  margin-top: 1rem;
  opacity: 0.6;
}

.card-note {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 1rem;
  font-style: italic;
}

/* Detail sections for back */
.detail-section {
  margin-bottom: 1rem;
  text-align: left;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 0.9rem;
  color: white;
  line-height: 1.5;
  margin: 0;
}

.detail-value.formula {
  font-family: 'JetBrains Mono', monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
}

.examples {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.example {
  background: rgba(255, 255, 255, 0.1);
  border-left: 3px solid rgba(255, 255, 255, 0.5);
  padding: 0.5rem 0.75rem;
  border-radius: 0 8px 8px 0;
  font-size: 0.8rem;
  font-style: italic;
  margin: 0;
}

/* Hover effect */
.flip-card:hover .flip-card-inner {
  transform: scale(1.02);
}

.flip-card.flipped:hover .flip-card-inner {
  transform: rotateY(180deg) scale(1.02);
}

/* Responsive */
@media (max-width: 600px) {
  .flip-card-inner {
    min-height: 250px;
  }
  
  .flip-card-face {
    min-height: 250px;
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
}
</style>
