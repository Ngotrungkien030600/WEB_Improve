// Chặn tính năng cần tài khoản: nội dung học vẫn xem tự do, chỉ AI và đồng bộ tiến độ mới cần đăng nhập.
import router from '../router/index.js';
import { isLoggedIn } from './auth-store.js';

export const FEATURE_LABELS = {
  ai: 'tính năng AI',
  sync: 'đồng bộ tiến độ',
};

export function loginPath(nextPath, feature) {
  const query = { next: nextPath || '/' };
  if (feature) query.need = feature;
  return { path: '/login', query };
}

// Trả về true nếu đã đăng nhập; nếu chưa thì đưa người dùng sang trang đăng nhập kèm đường quay lại.
export function requireLogin(nextPath, feature) {
  if (isLoggedIn()) return true;
  router.push(loginPath(nextPath, feature)).catch(() => {});
  return false;
}

export function featureNotice(feature) {
  return FEATURE_LABELS[feature] || 'tính năng này';
}
