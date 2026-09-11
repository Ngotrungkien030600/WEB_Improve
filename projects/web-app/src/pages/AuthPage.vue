<template>
  <div class="auth-page">
    <div class="auth-card">
      <button class="auth-back" @click="goHome">← Trang chủ</button>

      <h1 class="auth-title">{{ isLogin ? 'Đăng nhập để vào web' : 'Tạo tài khoản SkillForge' }}</h1>
      <p class="auth-sub">Lưu tiến độ học tiếng Anh &amp; Java trên mọi thiết bị. Miễn phí, không cần thẻ.</p>

      <div class="auth-tabs">
        <button
          type="button"
          class="auth-tab"
          :class="{ active: isLogin }"
          @click="switchMode('login')"
        >Đăng nhập</button>
        <button
          type="button"
          class="auth-tab"
          :class="{ active: !isLogin }"
          @click="switchMode('register')"
        >Đăng ký</button>
      </div>

      <p v-if="loggedInUser" class="auth-success auth-logged">
        <span>Bạn đang đăng nhập là <strong>{{ loggedInUser.email }}</strong>.</span>
        <span class="auth-logged-actions">
          <button type="button" class="auth-link" @click="continueToWeb">Vào web</button>
          <button type="button" class="auth-link" @click="switchAccount">Đăng xuất</button>
        </span>
      </p>
      <p v-if="intro" class="auth-notice">{{ intro }}</p>
      <p v-if="nextLabel" class="auth-context">Sau khi đăng nhập, quay lại: <strong>{{ nextLabel }}</strong></p>
      <p v-if="needNotice" class="auth-notice">{{ needNotice }}</p>
      <p v-if="success" class="auth-success">{{ success }}</p>

      <form v-if="isLogin" class="auth-form" @submit.prevent="submitLogin">
        <label class="auth-label" for="auth-email">Email</label>
        <input
          id="auth-email"
          v-model="email"
          class="auth-input"
          :class="{ invalid: loginErrors.email }"
          type="email"
          autocomplete="email"
          placeholder="ban@example.com"
        />
        <p v-if="loginErrors.email" class="auth-error">{{ loginErrors.email }}</p>

        <label class="auth-label" for="auth-password">Mật khẩu</label>
        <div class="auth-password">
          <input
            id="auth-password"
            v-model="password"
            class="auth-input"
            :class="{ invalid: loginErrors.password }"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Ít nhất 8 ký tự"
          />
          <button type="button" class="auth-eye" @click="showPassword = !showPassword">
            {{ showPassword ? 'Ẩn' : 'Hiện' }}
          </button>
        </div>
        <p v-if="loginErrors.password" class="auth-error">{{ loginErrors.password }}</p>

        <div class="auth-row">
          <label class="auth-check">
            <input v-model="remember" type="checkbox" />
            Ghi nhớ đăng nhập
          </label>
          <button type="button" class="auth-link" @click="forgot">Quên mật khẩu?</button>
        </div>

        <p v-if="info" class="auth-info">{{ info }}</p>
        <p v-if="formError" class="auth-banner">{{ formError }}</p>

        <button class="auth-submit" type="submit" :disabled="busy">
          {{ busy ? 'Đang kiểm tra…' : 'Đăng nhập' }}
        </button>
      </form>

      <form v-else-if="!onboarding" class="auth-form" @submit.prevent="submitRegister">
        <label class="auth-label" for="reg-email">Email</label>
        <input
          id="reg-email"
          v-model="regEmail"
          class="auth-input"
          :class="{ invalid: registerErrors.email }"
          type="email"
          autocomplete="email"
          placeholder="ban@example.com"
        />
        <p v-if="registerErrors.email" class="auth-error">{{ registerErrors.email }}</p>

        <label class="auth-label" for="reg-password">Mật khẩu</label>
        <div class="auth-password">
          <input
            id="reg-password"
            v-model="regPassword"
            class="auth-input"
            :class="{ invalid: registerErrors.password }"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Ít nhất 8 ký tự"
          />
          <button type="button" class="auth-eye" @click="showPassword = !showPassword">
            {{ showPassword ? 'Ẩn' : 'Hiện' }}
          </button>
        </div>
        <div v-if="regPassword" class="auth-meter">
          <span
            v-for="n in 3"
            :key="n"
            class="auth-seg"
            :class="[{ on: n <= strength.score }, `lv-${strength.score}`]"
          />
          <span class="auth-hint">{{ strength.label }} — {{ strength.hint }}</span>
        </div>
        <p v-if="registerErrors.password" class="auth-error">{{ registerErrors.password }}</p>

        <label class="auth-label" for="reg-confirm">Nhập lại mật khẩu</label>
        <input
          id="reg-confirm"
          v-model="regConfirm"
          class="auth-input"
          :class="{ invalid: registerErrors.confirm }"
          type="password"
          autocomplete="new-password"
          placeholder="Nhập lại mật khẩu"
        />
        <p v-if="registerErrors.confirm" class="auth-error">{{ registerErrors.confirm }}</p>

        <label class="auth-check">
          <input v-model="agreed" type="checkbox" />
          Tôi đồng ý Điều khoản &amp; Chính sách bảo mật
        </label>
        <p v-if="registerErrors.terms" class="auth-error">{{ registerErrors.terms }}</p>

        <p v-if="formError" class="auth-banner">{{ formError }}</p>

        <button class="auth-submit" type="submit" :disabled="busy">
          {{ busy ? 'Đang tạo tài khoản…' : 'Tạo tài khoản' }}
        </button>
      </form>

      <div v-else class="auth-form">
        <p class="onb-intro">Cá nhân hoá lộ trình — 3 câu hỏi nhanh để gợi ý bài học và mục tiêu mỗi ngày.</p>

        <div class="onb-block">
          <p class="onb-q">1. Mục tiêu của bạn là gì?</p>
          <div class="onb-options">
            <button
              v-for="option in GOALS"
              :key="option.value"
              type="button"
              class="onb-option"
              :class="{ active: goal === option.value }"
              @click="goal = option.value"
            >{{ option.label }}</button>
          </div>
        </div>

        <div class="onb-block">
          <p class="onb-q">2. Trình độ hiện tại?</p>
          <div class="onb-options">
            <button
              v-for="option in LEVELS"
              :key="option.value"
              type="button"
              class="onb-option"
              :class="{ active: level === option.value }"
              @click="level = option.value"
            >{{ option.label }}</button>
          </div>
        </div>

        <div class="onb-block">
          <p class="onb-q">3. Mỗi ngày bạn học được bao lâu?</p>
          <div class="onb-options">
            <button
              v-for="minutes in MINUTES"
              :key="minutes"
              type="button"
              class="onb-option"
              :class="{ active: minutesPerDay === minutes }"
              @click="minutesPerDay = minutes"
            >{{ minutes }} phút</button>
          </div>
        </div>

        <button class="auth-submit" type="button" @click="finishOnboarding">Hoàn tất đăng ký</button>
      </div>

      <button v-if="!onboarding" class="auth-google" type="button" disabled title="Sắp có">
        {{ isLogin ? 'Tiếp tục với Google' : 'Đăng ký bằng Google' }}
        <span class="auth-soon">Sắp có</span>
      </button>

      <p v-if="!onboarding" class="auth-switch">
        <template v-if="isLogin">
          Chưa có tài khoản?
          <button type="button" class="auth-link" @click="switchMode('register')">Đăng ký miễn phí</button>
        </template>
        <template v-else>
          Đã có tài khoản?
          <button type="button" class="auth-link" @click="switchMode('login')">Đăng nhập</button>
        </template>
      </p>
      <p class="auth-demo">Bản xem trước giao diện: tài khoản lưu ngay trên máy bạn, chưa gửi lên máy chủ.</p>
    </div>

    <CImportProgress
      :visible="showImport"
      :summary="summary"
      :user-email="authState.user?.email || ''"
      @import="confirmImport"
      @skip="skipImport"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CImportProgress from '../components/CImportProgress.vue';
import { featureNotice } from '../utils/auth-guard.js';
import {
  authState,
  getLocalProgressSummary,
  hasLocalAccount,
  loginUser,
  logoutUser,
  markProgressImported,
  needsProgressImport,
  registerUser,
  updateProfile,
} from '../utils/auth-store.js';
import {
  passwordStrength,
  validateConfirm,
  validateEmail,
  validatePassword,
} from '../utils/auth-logic.js';
import { navigate } from '../utils/navigate.js';
import { PORTED_PAGE_LABELS } from '../utils/ported-pages.js';

const GOALS = [
  { value: 'java', label: 'Phỏng vấn Java' },
  { value: 'english', label: 'Tiếng Anh giao tiếp' },
  { value: 'both', label: 'Cả hai' },
];
const LEVELS = [
  { value: 'new', label: 'Mới bắt đầu' },
  { value: 'basic', label: 'Đã có nền tảng' },
  { value: 'working', label: 'Đang đi làm, muốn nhảy việc' },
];
const MINUTES = [15, 30, 60];

const route = useRoute();
const router = useRouter();

const mode = ref('login');
const onboarding = ref(false);
const busy = ref(false);
const showPassword = ref(false);
const remember = ref(true);
const info = ref('');
const intro = ref('');
const success = ref('');
const formError = ref('');
const showImport = ref(false);
const skippedImport = ref(false);
const summary = ref({ items: [], total: 0, bytes: 0 });

const email = ref('');
const password = ref('');
const loginErrors = ref({ email: '', password: '' });

const regEmail = ref('');
const regPassword = ref('');
const regConfirm = ref('');
const agreed = ref(false);
const registerErrors = ref({ email: '', password: '', confirm: '', terms: '' });

const goal = ref('');
const level = ref('');
const minutesPerDay = ref(0);

const isLogin = computed(() => mode.value === 'login');
const loggedInUser = computed(() => authState.user);
const strength = computed(() => passwordStrength(regPassword.value));
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

onMounted(() => {
  // Máy đã có tài khoản → mở sẵn form đăng nhập; máy mới → mở form đăng ký.
  // Query ?tab=... luôn được ưu tiên (link cũ /register, nút Đăng ký ở Dashboard).
  if (route.query.tab === 'register') {
    mode.value = 'register';
    return;
  }
  if (route.query.tab === 'login') {
    mode.value = 'login';
    return;
  }
  mode.value = hasLocalAccount() ? 'login' : 'register';
  if (mode.value === 'register') {
    intro.value = 'Lần đầu bạn vào SkillForge? Tạo tài khoản để lưu tiến độ học trên mọi thiết bị.';
  }
});

function goHome() {
  navigate('/');
}

function switchMode(next) {
  mode.value = next;
  onboarding.value = false;
  formError.value = '';
  info.value = '';
  success.value = '';
  queryTab(next);
}

function queryTab(next) {
  const query = { ...route.query };
  if (next === 'register') query.tab = 'register';
  else delete query.tab;
  router.replace({ path: '/login', query }).catch(() => {});
}

function finish() {
  navigate(nextPath.value || '/');
}

function continueToWeb() {
  finish();
}

function switchAccount() {
  logoutUser();
  success.value = '';
  intro.value = 'Đã đăng xuất. Đăng nhập bằng tài khoản khác, hoặc tạo tài khoản mới ở tab Đăng ký.';
}

function forgot() {
  info.value = 'Khi nối máy chủ: nếu email này có tài khoản, hệ thống gửi link đặt lại mật khẩu (hết hạn sau 15 phút).';
}

async function submitLogin() {
  formError.value = '';
  info.value = '';
  loginErrors.value = {
    email: validateEmail(email.value),
    password: validatePassword(password.value),
  };
  if (loginErrors.value.email || loginErrors.value.password) return;

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

async function submitRegister() {
  formError.value = '';
  registerErrors.value = {
    email: validateEmail(regEmail.value),
    password: validatePassword(regPassword.value),
    confirm: validateConfirm(regPassword.value, regConfirm.value),
    terms: agreed.value ? '' : 'Bạn cần đồng ý điều khoản để tiếp tục.',
  };
  const hasError = Object.values(registerErrors.value).some((message) => message);
  if (hasError) return;

  busy.value = true;
  const result = await registerUser({ email: regEmail.value, password: regPassword.value });
  busy.value = false;

  if (!result.ok) {
    formError.value = result.error;
    return;
  }
  onboarding.value = true;
}

function finishOnboarding() {
  if (goal.value || level.value || minutesPerDay.value) {
    updateProfile({ goal: goal.value, level: level.value, minutesPerDay: minutesPerDay.value });
  }
  email.value = regEmail.value;
  password.value = '';
  regPassword.value = '';
  regConfirm.value = '';
  onboarding.value = false;
  mode.value = 'login';
  queryTab('login');
  success.value = 'Đăng ký thành công! Đăng nhập để vào web.';
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
  max-width: 440px;
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

.auth-sub {
  margin: 0 0 0.9rem;
  color: var(--forge-text2, #94a3b8);
  font-size: 0.87rem;
  line-height: 1.6;
}

.auth-tabs {
  display: flex;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.25rem;
  margin-bottom: 1rem;
}

.auth-tab {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: var(--forge-text2, #94a3b8);
  font-size: 0.87rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base, 0.2s ease);
}

.auth-tab.active {
  background: var(--forge-accent, #8b5cf6);
  color: #fff;
}

.auth-context {
  margin: 0 0 0.4rem;
  font-size: 0.84rem;
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

.auth-success {
  margin: 0 0 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  background: rgba(52, 211, 153, 0.14);
  color: #a7f3d0;
  font-size: 0.85rem;
  line-height: 1.5;
}

.auth-logged {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.auth-logged-actions {
  display: inline-flex;
  gap: 0.75rem;
}

.auth-form {
  display: block;
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

.auth-meter {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: -0.5rem 0 0.85rem;
  flex-wrap: wrap;
}

.auth-seg {
  width: 34px;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.auth-seg.on.lv-1 {
  background: #f87171;
}

.auth-seg.on.lv-2 {
  background: #fbbf24;
}

.auth-seg.on.lv-3 {
  background: #34d399;
}

.auth-hint {
  color: var(--forge-text3, #64748b);
  font-size: 0.74rem;
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
  gap: 0.45rem;
  color: var(--forge-text2, #94a3b8);
  font-size: 0.83rem;
  margin-bottom: 0.9rem;
}

.auth-banner {
  margin: 0 0 0.85rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  background: rgba(248, 113, 113, 0.14);
  color: #fecaca;
  font-size: 0.83rem;
}

.auth-info {
  margin: 0 0 0.75rem;
  color: #a5b4fc;
  font-size: 0.8rem;
  line-height: 1.5;
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

.onb-intro {
  margin: 0 0 1rem;
  color: var(--forge-text2, #94a3b8);
  font-size: 0.87rem;
  line-height: 1.6;
}

.onb-block {
  margin: 0 0 1rem;
}

.onb-q {
  margin: 0 0 0.5rem;
  color: var(--forge-text, #f8fafc);
  font-size: 0.88rem;
  font-weight: 600;
}

.onb-options {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.onb-option {
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--forge-glass-border, rgba(255, 255, 255, 0.14));
  background: rgba(255, 255, 255, 0.04);
  color: var(--forge-text2, #94a3b8);
  font-size: 0.83rem;
  cursor: pointer;
  transition: all var(--transition-base, 0.2s ease);
}

.onb-option:hover {
  color: var(--forge-text, #f8fafc);
}

.onb-option.active {
  background: rgba(139, 92, 246, 0.22);
  border-color: var(--forge-accent, #8b5cf6);
  color: var(--forge-text, #f8fafc);
  font-weight: 600;
}
</style>
