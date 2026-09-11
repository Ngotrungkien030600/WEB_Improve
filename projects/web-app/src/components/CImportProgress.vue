<template>
  <div v-if="visible" class="import-overlay" role="dialog" aria-modal="true">
    <div class="import-card">
      <h3 class="import-title">Nhập tiến độ trên máy này?</h3>
      <p class="import-desc">
        Chúng tôi tìm thấy {{ summary.total }} mục tiến độ học lưu trên trình duyệt này. Nhập vào tài khoản
        <strong>{{ userEmail }}</strong> để không mất streak và lịch sử đang có.
      </p>

      <ul v-if="summary.total" class="import-list">
        <li v-for="item in summary.items" :key="item.key">
          <span class="import-item-label">{{ item.label }}</span>
          <span class="import-item-key">{{ item.key }}</span>
        </li>
      </ul>
      <p v-else class="import-empty">Chưa có dữ liệu học nào trên máy — bạn bắt đầu với trang trắng.</p>

      <div class="import-actions">
        <button class="import-btn import-btn-ghost" @click="$emit('skip')">Bỏ qua</button>
        <button class="import-btn" :disabled="!summary.total" @click="$emit('import')">
          Nhập vào tài khoản này
        </button>
      </div>
      <p class="import-note">Dữ liệu được gắn cho tài khoản này; đồng bộ lên máy chủ sẽ bật khi nối backend.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  summary: { type: Object, default: () => ({ items: [], total: 0, bytes: 0 }) },
  userEmail: { type: String, default: '' },
});

defineEmits(['import', 'skip']);
</script>

<style scoped>
.import-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 5, 16, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  z-index: 60;
}

.import-card {
  width: 100%;
  max-width: 460px;
  background: var(--forge-surface, #171530);
  border: 1px solid var(--forge-glass-border, rgba(255, 255, 255, 0.12));
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.import-title {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  color: var(--forge-text, #f8fafc);
}

.import-desc {
  margin: 0 0 1rem;
  color: var(--forge-text2, #94a3b8);
  font-size: 0.9rem;
  line-height: 1.6;
}

.import-list {
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;
  max-height: 220px;
  overflow-y: auto;
  display: grid;
  gap: 0.4rem;
}

.import-list li {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  background: var(--forge-glass, rgba(255, 255, 255, 0.05));
  border-radius: 10px;
  padding: 0.5rem 0.7rem;
  font-size: 0.82rem;
}

.import-item-label {
  color: var(--forge-text, #f8fafc);
}

.import-item-key {
  color: var(--forge-text3, #64748b);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
}

.import-empty {
  color: var(--forge-text2, #94a3b8);
  font-size: 0.88rem;
  margin: 0 0 1rem;
}

.import-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

.import-btn {
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--forge-accent, #8b5cf6);
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}

.import-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.import-btn-ghost {
  background: transparent;
  border-color: var(--forge-glass-border, rgba(255, 255, 255, 0.16));
  color: var(--forge-text2, #94a3b8);
}

.import-note {
  margin: 0.85rem 0 0;
  font-size: 0.75rem;
  color: var(--forge-text3, #64748b);
}
</style>
