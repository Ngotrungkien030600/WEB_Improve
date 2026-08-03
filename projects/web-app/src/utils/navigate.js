import router from '../router/index.js';
import { PORTED_PAGES } from './ported-pages.js';

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

  const target = options.target;
  if (target === 'router') {
    router.push(p).catch(() => {});
    return;
  }
  if (target === 'window') {
    window.location.href = '/pages/' + p.slice(1) + '.html';
    return;
  }

  // Mặc định: quyết định theo registry
  if (PORTED_PAGES.includes(p)) {
    router.push(p).catch(() => {});
  } else {
    window.location.href = '/pages/' + p.slice(1) + '.html';
  }
}
