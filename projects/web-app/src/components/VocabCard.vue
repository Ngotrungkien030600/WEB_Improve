<template>
  <div class="vocab-card-wrapper">
    <!-- Category filter display -->
    <div class="category-display" v-if="vocab?.tag">
      <span class="category-icon">{{ getCategoryIcon(vocab.tag) }}</span>
      <span class="category-label">{{ getCategoryLabel(vocab.tag) }}</span>
    </div>

    <!-- Flip Card -->
    <div class="vocab-card" :class="{ flipped }" @click="$emit('flip')">
      <div class="vocab-card-inner">
        <!-- Front -->
        <div class="vocab-face vocab-front">
          <h2 class="vocab-en">{{ vocab?.en }}</h2>
          <button class="speak-btn" @click.stop="$emit('speak', vocab?.en)" title="Nghe phát âm">
            🔊
          </button>
          <p class="vocab-phonetic">{{ vocab?.phonetic }}</p>
          <span class="vocab-tag">{{ vocab?.tag }}</span>
        </div>

        <!-- Back -->
        <div class="vocab-face vocab-back">
          <h3 class="vocab-vi">{{ vocab?.vi }}</h3>
          <p class="vocab-example-en">{{ vocab?.exampleEn }}</p>
          <p class="vocab-example-vi">{{ vocab?.exampleVi }}</p>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="vocab-controls">
      <button class="control-btn" @click="$emit('prev')">⬅️ Trước</button>
      <button class="control-btn" @click="$emit('flip')">🔄 Lật</button>
      <button class="control-btn" @click="$emit('next')">Tiếp ➡️</button>
    </div>

    <!-- Counter -->
    <p class="vocab-counter">{{ index + 1 }} / {{ total }}</p>
  </div>
</template>

<script setup>
import { vocabCategories } from '../data/vocabulary.js';

defineProps({
  vocab: { type: Object, default: null },
  index: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  flipped: { type: Boolean, default: false }
});

defineEmits(['flip', 'prev', 'next', 'speak']);

const getCategoryIcon = (tag) => {
  return vocabCategories[tag]?.icon || '📚';
};

const getCategoryLabel = (tag) => {
  return vocabCategories[tag]?.label || tag;
};
</script>

<style scoped>
.vocab-card-wrapper {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
}

.category-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.category-icon {
  font-size: 1.25rem;
}

.category-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
}

.vocab-card {
  perspective: 1000px;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.vocab-card-inner {
  position: relative;
  width: 100%;
  height: 220px;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.vocab-card.flipped .vocab-card-inner {
  transform: rotateY(180deg);
}

.vocab-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 1.5rem;
}

.vocab-front {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  border: 2px solid rgba(99, 102, 241, 0.3);
}

.vocab-back {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  transform: rotateY(180deg);
  color: white;
}

.vocab-en {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.speak-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.25rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.speak-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.vocab-phonetic {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0 0 0.5rem;
}

.vocab-tag {
  background: rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.4);
}

.vocab-vi {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem;
}

.vocab-example-en {
  font-size: 0.9rem;
  font-style: italic;
  opacity: 0.9;
  margin: 0 0 0.5rem;
}

.vocab-example-vi {
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 0;
}

/* Controls */
.vocab-controls {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(99, 102, 241, 0.3);
  border-color: #6366f1;
  transform: translateY(-2px);
}

.vocab-counter {
  text-align: center;
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

/* Hover */
.vocab-card:hover .vocab-card-inner {
  transform: scale(1.02);
}

.vocab-card.flipped:hover .vocab-card-inner {
  transform: rotateY(180deg) scale(1.02);
}

/* Responsive */
@media (max-width: 600px) {
  .vocab-card-inner {
    height: 200px;
  }
  
  .vocab-en {
    font-size: 1.5rem;
  }
  
  .vocab-vi {
    font-size: 1.25rem;
  }
  
  .control-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
