<template>
  <div v-if="visible" class="import-overlay" role="dialog" aria-modal="true" aria-labelledby="import-title">
    <div class="import-card">
      <div class="import-head">
        <span class="import-emoji" aria-hidden="true">📥</span>
        <div>
          <h3 id="import-title" class="import-title">Nhập tiến độ trên máy này?</h3>
          <p class="import-sub">Tài khoản: <strong>{{ userEmail }}</strong></p>
        </div>
      </div>

      <p class="import-desc">
        Trình duyệt này đang có <strong>{{ summary.total }} mục tiến độ học</strong>. Nhập để gắn chúng vào
        tài khoản của bạn — streak, XP và lịch sử sẽ được giữ nguyên.
      </p>

      <ul v-if="summary.total" class="import-list">
        <li v-for="item in summary.items" :key="item.key" class="import-item">
          <span class="import-item-dot" aria-hidden="true"></span>
          <span class="import-item-label">{{ item.label }}</span>
        </li>
      </ul>
      <p v-else class="import-empty">Chưa có dữ liệu học nào trên máy — bạn bắt đầu với trang trắng.</p>

      <div class="import-explain">
        <p><strong>Nhập vào tài khoản này</strong> — tiến độ cũ thuộc về tài khoản, đăng nhập máy khác vẫn thấy.</p>
        <p><strong>Bỏ qua</strong> — bắt đầu tính từ hôm nay; dữ liệu cũ vẫn nằm trên máy, không bị xoá.</p>
      </div>

      <div class="import-actions">
        <button class="import-btn import-btn-ghost" @click="$emit('skip')">Bỏ qua</button>
        <button class="import-btn" :disabled="!summary.total" @click="$emit('import')">
          Nhập vào tài khoản này
        </button>
      </div>
      <p class="import-note">Bản xem trước: dữ liệu chưa gửi lên máy chủ, chỉ gắn trong trình duyệt này.</p>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, watch } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  summary: { type: Object, default: () => ({ items: [], total: 0, bytes: 0 }) },
  userEmail: { type: String, default: '' },
});

const emit = defineEmits(['import', 'skip']);

function onKeydown(event) {
  if (event.key === 'Escape') emit('skip');
}

// Hộp thoại là modal: khoá cuộn trang nền để người dùng không thao tác nhầm phía sau.
watch(
  () => props.visible,
  (isVisible) => {
    document.body.style.overflow = isVisible ? 'hidden' : '';
    if (isVisible) window.addEventListener('keydown', onKeydown);
    else window.removeEventListener('keydown', onKeydown);
  },
  { immediate: true },
);

onUnmounted(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.import-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 3, 12, 0.92);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  z-index: 9999;
  overflow-y: auto;
}

.import-card {
  width: 100%;
  max-width: 480px;
  background: #171530;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
}

.import-head {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  margin-bottom: 0.85rem;
}

.import-emoji {
  font-size: 1.5rem;
  line-height: 1.2;
}

.import-title {
  margin: 0 0 0.2rem;
  font-size: 1.15rem;
  color: var(--forge-text, #f8fafc);
}

.import-sub {
  margin: 0;
  font-size: 0.8rem;
  color: var(--forge-text3, #8b98ad);
}

.import-sub strong {
  color: #c4b5fd;
}

.import-desc {
  margin: 0 0 1rem;
  color: var(--forge-text2, #a9b4c9);
  font-size: 0.9rem;
  line-height: 1.65;
}

.import-list {
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;
  max-height: 240px;
  overflow-y: auto;
  display: grid;
  gap: 0.35rem;
}

.import-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 0.55rem 0.8rem;
  font-size: 0.86rem;
  color: var(--forge-text, #f8fafc);
}

.import-item-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--forge-accent, #8b5cf6);
  flex-shrink: 0;
}

.import-empty {
  color: var(--forge-text2, #a9b4c9);
  font-size: 0.88rem;
  margin: 0 0 1rem;
}

.import-explain {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 0.75rem 0.9rem;
  margin-bottom: 1.1rem;
}

.import-explain p {
  margin: 0;
  font-size: 0.79rem;
  line-height: 1.6;
  color: var(--forge-text2, #a9b4c9);
}

.import-explain p + p {
  margin-top: 0.35rem;
}

.import-explain strong {
  color: var(--forge-text, #f8fafc);
}

.import-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.import-btn {
  padding: 0.6rem 1.15rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--forge-accent, #8b5cf6);
  color: #fff;
  font-weight: 600;
  font-size: 0.86rem;
  cursor: pointer;
}

.import-btn:hover:not(:disabled) {
  box-shadow: 0 10px 26px rgba(139, 92, 246, 0.35);
}

.import-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.import-btn-ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.18);
  color: var(--forge-text2, #a9b4c9);
}

.import-note {
  margin: 0.9rem 0 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--forge-text3, #8b98ad);
}
</style>
