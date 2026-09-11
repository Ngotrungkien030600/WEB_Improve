<template>
  <div ref="root" class="acct">
    <button
      type="button"
      class="acct-trigger"
      :class="{ open }"
      :aria-expanded="open ? 'true' : 'false'"
      aria-haspopup="menu"
      @click="toggle"
    >
      <span class="acct-avatar" aria-hidden="true">{{ initials }}</span>
      <span class="acct-text">
        <span class="acct-name">{{ displayName }}</span>
        <span class="acct-plan">{{ planLabel }}</span>
      </span>
      <span class="acct-chevron" aria-hidden="true">▾</span>
    </button>

    <transition name="acct-fade">
      <div v-if="open" class="acct-menu" role="menu">
        <div class="acct-menu-head">
          <span class="acct-avatar acct-avatar-sm" aria-hidden="true">{{ initials }}</span>
          <span class="acct-menu-id">
            <strong>{{ displayName }}</strong>
            <span>{{ email }}</span>
          </span>
        </div>

        <button type="button" class="acct-item" role="menuitem" @click="go('/dashboard')">
          <span class="acct-icon" aria-hidden="true">📊</span> Dashboard
        </button>
        <button type="button" class="acct-item" role="menuitem" @click="go('/login')">
          <span class="acct-icon" aria-hidden="true">⚙️</span> Trang tài khoản
        </button>
        <div class="acct-sep"></div>
        <button type="button" class="acct-item acct-item-danger" role="menuitem" @click="doLogout">
          <span class="acct-icon" aria-hidden="true">🚪</span> Đăng xuất
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { authState, logoutUser } from '../utils/auth-store.js';
import { navigate } from '../utils/navigate.js';

const open = ref(false);
const root = ref(null);

const email = computed(() => authState.user?.email || '');
const displayName = computed(() => {
  const name = authState.user?.displayName || email.value.split('@')[0] || 'Bạn';
  return name.charAt(0).toUpperCase() + name.slice(1);
});
const planLabel = computed(() => (authState.user?.plan === 'pro' ? 'Gói Pro' : 'Gói miễn phí'));
const initials = computed(() => {
  const source = authState.user?.displayName || email.value || '?';
  const parts = source.split(/[.\-_@\s]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
});

function toggle() {
  open.value = !open.value;
}

function close() {
  open.value = false;
}

function go(path) {
  close();
  navigate(path);
}

function doLogout() {
  close();
  logoutUser();
  navigate('/login');
}

function onDocumentClick(event) {
  if (!open.value) return;
  if (root.value && !root.value.contains(event.target)) close();
}

function onKeydown(event) {
  if (event.key === 'Escape') close();
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.acct {
  position: relative;
}

.acct-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.7rem 0.35rem 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--forge-glass-border, rgba(255, 255, 255, 0.12));
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.acct-trigger:hover,
.acct-trigger.open {
  border-color: rgba(139, 92, 246, 0.55);
  background: rgba(139, 92, 246, 0.14);
  transform: translateY(-1px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
}

.acct-trigger:focus-visible {
  outline: 2px solid var(--forge-accent, #8b5cf6);
  outline-offset: 2px;
}

.acct-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #fff;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 55%, #38bdf8 100%);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.45);
  flex-shrink: 0;
}

.acct-avatar-sm {
  width: 36px;
  height: 36px;
  font-size: 0.82rem;
}

.acct-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.acct-name {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--forge-text, #f8fafc);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.acct-plan {
  font-size: 0.68rem;
  color: var(--forge-text3, #8b98ad);
  font-weight: 500;
}

.acct-chevron {
  font-size: 0.7rem;
  color: var(--forge-text3, #8b98ad);
  transition: transform 0.2s ease;
}

.acct-trigger.open .acct-chevron {
  transform: rotate(180deg);
}

.acct-menu {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  min-width: 236px;
  padding: 0.4rem;
  border-radius: 16px;
  background: #171530;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  z-index: 80;
}

.acct-menu-head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.65rem 0.7rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 0.35rem;
}

.acct-menu-id {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.acct-menu-id strong {
  font-size: 0.85rem;
  color: var(--forge-text, #f8fafc);
}

.acct-menu-id span {
  font-size: 0.72rem;
  color: var(--forge-text3, #8b98ad);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 165px;
}

.acct-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.55rem 0.65rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--forge-text2, #a9b4c9);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.acct-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: var(--forge-text, #f8fafc);
}

.acct-icon {
  font-size: 0.95rem;
  width: 1.1rem;
  text-align: center;
}

.acct-item-danger {
  color: #fca5a5;
}

.acct-item-danger:hover {
  background: rgba(248, 113, 113, 0.14);
  color: #fecaca;
}

.acct-sep {
  height: 1px;
  margin: 0.3rem 0.35rem;
  background: rgba(255, 255, 255, 0.08);
}

.acct-fade-enter-active,
.acct-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.acct-fade-enter-from,
.acct-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 520px) {
  .acct-text {
    display: none;
  }

  .acct-trigger {
    padding: 0.3rem;
  }
}
</style>
