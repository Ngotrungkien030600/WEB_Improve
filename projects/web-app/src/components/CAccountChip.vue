<template>
  <div class="acct-chip">
    <template v-if="user">
      <span class="acct-avatar">{{ initials }}</span>
      <span class="acct-name">{{ user.displayName }}</span>
      <button class="acct-btn acct-btn-ghost" @click="goDashboard">Dashboard</button>
      <button class="acct-btn acct-btn-ghost" @click="doLogout">Đăng xuất</button>
    </template>
    <template v-else>
      <button class="acct-btn acct-btn-ghost" @click="goRegister">Đăng ký</button>
      <button class="acct-btn" @click="goLogin">Đăng nhập</button>
    </template>
  </div>
</template>

<script>
import { authState, logoutUser } from '../utils/auth-store.js';
import { navigate } from '../utils/navigate.js';

export default {
  name: 'CAccountChip',
  computed: {
    user() {
      return authState.user;
    },
    initials() {
      const name = this.user?.displayName || this.user?.email || '?';
      return name.slice(0, 1).toUpperCase();
    },
  },
  methods: {
    goLogin() {
      navigate('/login');
    },
    goRegister() {
      navigate('/register');
    },
    goDashboard() {
      navigate('/dashboard');
    },
    doLogout() {
      logoutUser();
    },
  },
};
</script>

<style scoped>
.acct-chip {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.acct-avatar {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--forge-accent, #8b5cf6);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
}

.acct-name {
  color: var(--forge-text, #f8fafc);
  font-weight: 600;
  font-size: 0.85rem;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.acct-btn {
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--forge-accent, #8b5cf6);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base, 0.2s ease);
}

.acct-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px var(--forge-glow, rgba(139, 92, 246, 0.25));
}

.acct-btn-ghost {
  background: var(--forge-glass, rgba(255, 255, 255, 0.06));
  border-color: var(--forge-glass-border, rgba(255, 255, 255, 0.12));
  color: var(--forge-text2, #94a3b8);
}

.acct-btn-ghost:hover {
  color: var(--forge-text, #f8fafc);
  border-color: var(--forge-accent, #8b5cf6);
}
</style>
