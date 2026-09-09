import router from '../router/index.js';
import { PORTED_PAGES, PORTED_PREFIXES } from './ported-pages.js';

function normalize(path) {
  if (!path) return '';
  let p = path;
  if (!p.startsWith('/')) p = '/' + p;
  p = p.replace(/\/+/g, '/');
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

export function navigate(path, options = {}) {
  const p = normalize(path);

  // E1: empty path → no-op
  if (!p) return;

  // Split off any hash so we match the route path, then re-append it
  const hashIndex = p.indexOf('#');
  const hash = hashIndex >= 0 ? p.slice(hashIndex) : '';
  const pathOnly = hashIndex >= 0 ? p.slice(0, hashIndex) : p;

  const target = options.target;
  if (target === 'router') {
    rememberLastRoute(pathOnly);
    router.push(p).catch(() => {});
    return;
  }
  if (target === 'window') {
    window.location.href = '/pages/' + pathOnly.slice(1) + '.html' + hash;
    return;
  }
  if (target === 'legacy') {
    // Legacy pages are in /pages/ folder with .html extension
    const base = pathOnly.replace(/\/+/g, '/').replace(/^\//, '');
    window.location.href = '/pages/' + base + '.html' + hash;
    return;
  }

  // Mặc định: quyết định theo registry
  const isPorted = PORTED_PAGES.includes(pathOnly) || PORTED_PREFIXES.some(prefix => pathOnly.startsWith(prefix));
  if (isPorted) {
    rememberLastRoute(pathOnly);
    router.push(p).catch(() => {});
  } else {
    window.location.href = '/pages/' + pathOnly.slice(1) + '.html' + hash;
  }
}

// Nhớ trang đang đứng TRƯỚC khi rời đi, để các nút "quay lại" về đúng trang nguồn.
function rememberLastRoute(pathOnly) {
  try {
    const current = window.location.pathname;
    if (current && current !== pathOnly) {
      sessionStorage.setItem('dsh.lastRoute', current);
    }
  } catch (err) {
    // sessionStorage có thể bị chặn — bỏ qua, nút back vẫn có đường mặc định.
  }
}

// Đường về trang trước đó (nếu có trong phiên này), nếu không thì dùng đường mặc định.
export function backTo(defaultPath) {
  let previous = defaultPath;
  try {
    const saved = sessionStorage.getItem('dsh.lastRoute');
    if (saved && saved !== window.location.pathname) {
      previous = saved;
    }
  } catch (err) {
    // Bỏ qua — dùng đường mặc định.
  }
  navigate(previous);
}
