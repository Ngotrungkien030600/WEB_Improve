<template>
  <div class="auth-page">
    <div class="auth-card">
      <button class="auth-back" @click="goHome">← Trang chủ</button>

      <h1 class="auth-title">Đăng nhập để tiếp tục</h1>
      <p v-if="nextLabel" class="auth-context">Quay lại: <strong>{{ nextLabel }}</strong></p>
      <p v-if="needNotice" class="auth-notice">{{ needNotice }}</p>

      <form class="auth-form" @submit.prevent="submit">
        <label class="auth-label" for="login-email">Email</label>
        <input
          id="login-email"
          v-model="email"
          class="auth-input"
          :class="{ invalid: errors.email }"
          type="email"
          autocomplete="email"
          placeholder="ban@example.com"
        />
        <p v-if="errors.email" class="auth-error">{{ errors.email }}</p>

        <label class="auth-label" for="login-password">Mật khẩu</label>
        <div class="auth-password">
          <input
            id="login-password"
            v-model="password"
            class="auth-input"
            :class="{ invalid: errors.password }"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Ít nhất 8 ký tự"
          />
          <button type="button" class="auth-eye" @click="showPassword = !showPassword">
            {{ showPassword ? 'Ẩn' : 'Hiện' }}
          </button>
        </div>
        <p v-if="errors.password" class="auth-error">{{ errors.password }}</p>

        <div class="auth-row">
          <label class="auth-check">
            <input v-model="remember" type="checkbox" />
            Ghi nhớ đăng nhập
          </label>
          <button type="button" class="auth-link" @click="forgot">Quên mật khẩu?</button>
        </div>

        <p v-if="info" class="auth-info">{{ info }}</p>
        <p v-if="formError" class="auth-banner">
          {{ formError }}
          <button v-if="showRegisterShortcut" type="button" class="auth-link" @click="goRegister">Đăng ký ngay</button>
        </p>

        <button class="auth-submit" type="submit" :disabled="busy">
          {{ busy ? 'Đang kiểm tra…' : 'Đăng nhập' }}
        </button>
      </form>

      <button class="auth-google" type="button" disabled title="Sắp có">
        Tiếp tục với Google
        <span class="auth-soon">Sắp có</span>
      </button>

      <p class="auth-switch">
        Chưa có tài khoản?
        <button type="button" class="auth-link" @click="goRegister">Đăng ký miễn phí</button>
      </p>
      <p class="auth-demo">Bản xem trước giao diện: tài khoản lưu ngay trên máy bạn, chưa gửi lên máy chủ.</p>
    </div>

    <CImportProgress
      :visible="showImport"
      :summary="summary"
      :user-email="userEmail"
      @import="confirmImport"
      @skip="skipImport"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import CImportProgress from '../components/CImportProgress.vue';
import { featureNotice } from '../utils/auth-guard.js';
import { authState, getLocalProgressSummary, loginUser, markProgressImported, needsProgressImport } from '../utils/auth-store.js';
import { validateEmail, validatePassword } from '../utils/auth-logic.js';
import { navigate } from '../utils/navigate.js';
import { PORTED_PAGE_LABELS } from '../utils/ported-pages.js';

const route = useRoute();

const email = ref('');
const password = ref('');
const remember = ref(true);
const showPassword = ref(false);
const errors = ref({ email: '', password: '' });
const formError = ref('');
const info = ref('');
const busy = ref(false);
const showImport = ref(false);
const skippedImport = ref(false);
const summary = ref({ items: [], total: 0, bytes: 0 });

const nextPath = computed(() => {
  const raw = route.query.next;
  return typeof raw === 'string' ? raw : '';
});
const nextLabel = computed(() => PORTED_PAGE_LABELS[nextPath.value] || '');
const needNotice = computed(() => {
  const need = route.query.need;
  if (typeof need !== 'string' || !need) return '';
  return `Bạn cần đăng nhập để dùng ${featureNotice(need)}.`;
});
const showRegisterShortcut = computed(() => formError.value.includes('đã được đăng ký'));
const userEmail = computed(() => authState.user?.email || '');

function goHome() {
  navigate('/');
}

function goRegister() {
  navigate('/register');
}

function forgot() {
  info.value = 'Khi nối máy chủ: nếu email này có tài khoản, hệ thống gửi link đặt lại mật khẩu (hết hạn sau 15 phút).';
}

function finish() {
  const target = nextPath.value || '/';
  navigate(target);
}

async function submit() {
  formError.value = '';
  info.value = '';
  errors.value = {
    email: validateEmail(email.value),
    password: validatePassword(password.value),
  };
  if (errors.value.email || errors.value.password) return;

  busy.value = true;
  const result = await loginUser({ email: email.value, password: password.value, remember: remember.value });
  busy.value = false;

  if (!result.ok) {
    formError.value = result.error;
    return;
  }
  if (!skippedImport.value && needsProgressImport()) {
    summary.value = getLocalProgressSummary();
    showImport.value = true;
    return;
  }
  finish();
}

function confirmImport() {
  markProgressImported();
  showImport.value = false;
  finish();
}

function skipImport() {
  skippedImport.value = true;
  showImport.value = false;
  finish();
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: radial-gradient(circle at 20% 0%, rgba(139, 92, 246, 0.18), transparent 55%), #0c0a1d;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--forge-surface, #171530);
  border: 1px solid var(--forge-glass-border, rgba(255, 255, 255, 0.12));
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
}

.auth-back {
  background: none;
  border: none;
  color: var(--forge-text3, #64748b);
  font-size: 0.82rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1rem;
}

.auth-back:hover {
  color: var(--forge-text, #f8fafc);
}

.auth-title {
  margin: 0 0 0.4rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--forge-text, #f8fafc);
  letter-spacing: -0.02em;
}

.auth-context {
  margin: 0 0 0.4rem;
  font-size: 0.85rem;
  color: var(--forge-text2, #94a3b8);
}

.auth-context strong {
  color: var(--forge-accent, #a78bfa);
}

.auth-notice {
  margin: 0 0 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  background: rgba(139, 92, 246, 0.14);
  color: var(--forge-text2, #cbd5f5);
  font-size: 0.83rem;
  line-height: 1.5;
}

.auth-form {
  display: block;
  margin-top: 1rem;
}

.auth-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--forge-text2, #94a3b8);
  margin-bottom: 0.35rem;
}

.auth-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--forge-glass-border, rgba(255, 255, 255, 0.14));
  background: rgba(255, 255, 255, 0.04);
  color: var(--forge-text, #f8fafc);
  font-size: 0.92rem;
  margin-bottom: 0.9rem;
  outline: none;
}

.auth-input:focus {
  border-color: var(--forge-accent, #8b5cf6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18);
}

.auth-input.invalid {
  border-color: #f87171;
}

.auth-password {
  position: relative;
}

.auth-password .auth-input {
  padding-right: 4rem;
}

.auth-eye {
  position: absolute;
  right: 0.6rem;
  top: 0.55rem;
  background: none;
  border: none;
  color: var(--forge-text3, #94a3b8);
  font-size: 0.78rem;
  cursor: pointer;
}

.auth-error {
  margin: -0.6rem 0 0.75rem;
  color: #fca5a5;
  font-size: 0.78rem;
}

.auth-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
  flex-wrap: wrap;
}

.auth-check {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--forge-text2, #94a3b8);
  font-size: 0.82rem;
}

.auth-link {
  background: none;
  border: none;
  color: var(--forge-accent, #a78bfa);
  font-size: 0.82rem;
  cursor: pointer;
  padding: 0;
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-info {
  margin: 0 0 0.75rem;
  color: #a5b4fc;
  font-size: 0.8rem;
  line-height: 1.5;
}

.auth-banner {
  margin: 0 0 0.85rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  background: rgba(248, 113, 113, 0.14);
  color: #fecaca;
  font-size: 0.83rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.auth-submit {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: none;
  background: var(--forge-accent, #8b5cf6);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base, 0.2s ease);
}

.auth-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 26px rgba(139, 92, 246, 0.35);
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-google {
  width: 100%;
  margin-top: 0.85rem;
  padding: 0.7rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--forge-glass-border, rgba(255, 255, 255, 0.14));
  background: transparent;
  color: var(--forge-text2, #94a3b8);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: not-allowed;
}

.auth-soon {
  margin-left: 0.4rem;
  font-size: 0.68rem;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.auth-switch {
  margin: 1.1rem 0 0;
  text-align: center;
  color: var(--forge-text2, #94a3b8);
  font-size: 0.85rem;
}

.auth-demo {
  margin: 0.85rem 0 0;
  text-align: center;
  color: var(--forge-text3, #64748b);
  font-size: 0.72rem;
  line-height: 1.5;
}
</style>
