// Trạng thái đăng nhập phía client. Bản xem trước: tài khoản lưu trong localStorage của máy,
// khi nối máy chủ (Supabase/Node) chỉ cần thay phần đọc-ghi trong file này.
import { reactive } from 'vue';
import {
  displayNameFromEmail,
  hashPassword,
  makeSalt,
  normalizeEmail,
  summarizeProgress,
  validateEmail,
  validatePassword,
} from './auth-logic.js';

const ACCOUNTS_KEY = 'sf_auth_accounts';
const SESSION_KEY = 'sf_auth_session';
const IMPORTED_KEY = 'sf_auth_imported_for';

export const authState = reactive({
  user: null,
  ready: false,
});

function readJson(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Bộ nhớ trình duyệt bị chặn — bỏ qua, phiên đăng nhập chỉ mất khi tải lại trang.
  }
}

function readAccounts() {
  return readJson(localStorage, ACCOUNTS_KEY, []);
}

function writeAccounts(accounts) {
  writeJson(localStorage, ACCOUNTS_KEY, accounts);
}

function publicUser(account) {
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    plan: account.plan,
    createdAt: account.createdAt,
    profile: account.profile,
  };
}

function saveSession(user, remember) {
  authState.user = user;
  const payload = { user };
  try {
    if (remember) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    }
  } catch {
    // Bỏ qua — vẫn giữ phiên trong bộ nhớ của tab hiện tại.
  }
}

export function initAuth() {
  const fromLocal = readJson(localStorage, SESSION_KEY, null);
  const fromSession = readJson(sessionStorage, SESSION_KEY, null);
  const saved = fromLocal || fromSession;
  if (saved?.user) authState.user = saved.user;
  authState.ready = true;
}

export function isLoggedIn() {
  return Boolean(authState.user);
}

export function currentUser() {
  return authState.user;
}

// Máy này đã từng tạo tài khoản chưa — dùng để trang đăng nhập tự chọn form phù hợp.
export function hasLocalAccount() {
  return readAccounts().length > 0;
}

export function knownEmails() {
  return readAccounts().map((account) => account.email);
}

export async function registerUser({ email, password, displayName, profile }) {
  const cleanEmail = normalizeEmail(email);
  const emailError = validateEmail(cleanEmail);
  if (emailError) return { ok: false, error: emailError };
  const passwordError = validatePassword(password);
  if (passwordError) return { ok: false, error: passwordError };

  const accounts = readAccounts();
  if (accounts.some((acc) => acc.email === cleanEmail)) {
    return { ok: false, error: 'Email này đã được đăng ký. Bạn muốn đăng nhập?' };
  }

  const salt = makeSalt();
  const account = {
    id: `local-${Date.now().toString(36)}`,
    email: cleanEmail,
    displayName: displayName?.trim() || displayNameFromEmail(cleanEmail),
    salt,
    hash: await hashPassword(password, salt),
    plan: 'free',
    createdAt: new Date().toISOString(),
    profile: profile || { goal: '', level: '', minutesPerDay: 0 },
  };
  writeAccounts([...accounts, account]);
  return { ok: true, user: publicUser(account) };
}

export async function loginUser({ email, password, remember }) {
  const cleanEmail = normalizeEmail(email);
  const emailError = validateEmail(cleanEmail);
  if (emailError) return { ok: false, error: emailError };
  if (!password) return { ok: false, error: 'Vui lòng nhập mật khẩu.' };

  const accounts = readAccounts();
  const account = accounts.find((acc) => acc.email === cleanEmail);
  if (!account) return { ok: false, error: 'Email hoặc mật khẩu không đúng.' };

  const hash = await hashPassword(password, account.salt);
  if (hash !== account.hash) {
    return { ok: false, error: 'Email hoặc mật khẩu không đúng.' };
  }
  saveSession(publicUser(account), remember !== false);
  return { ok: true, user: authState.user };
}

export function logoutUser() {
  authState.user = null;
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Bỏ qua.
  }
}

export function updateProfile(patch) {
  if (!authState.user) return;
  const accounts = readAccounts();
  const next = accounts.map((acc) => {
    if (acc.id !== authState.user.id) return acc;
    return { ...acc, profile: { ...acc.profile, ...patch } };
  });
  writeAccounts(next);
  authState.user = { ...authState.user, profile: { ...authState.user.profile, ...patch } };
}

export function getLocalProgressSummary() {
  const entries = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key) || '';
      entries.push({ key, size: value.length });
    }
  } catch {
    return { items: [], total: 0, bytes: 0 };
  }
  const items = summarizeProgress(entries);
  const bytes = items.reduce((sum, item) => sum + item.size, 0);
  return { items, total: items.length, bytes };
}

export function needsProgressImport() {
  if (!authState.user) return false;
  let importedFor = '';
  try {
    importedFor = localStorage.getItem(IMPORTED_KEY) || '';
  } catch {
    return false;
  }
  return importedFor !== authState.user.id;
}

export function markProgressImported() {
  if (!authState.user) return;
  try {
    localStorage.setItem(IMPORTED_KEY, authState.user.id);
  } catch {
    // Bỏ qua.
  }
}
