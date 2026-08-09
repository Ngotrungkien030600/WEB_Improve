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

  // Split off any hash so we match the route path, then re-append it
  const hashIndex = p.indexOf('#');
  const hash = hashIndex >= 0 ? p.slice(hashIndex) : '';
  const pathOnly = hashIndex >= 0 ? p.slice(0, hashIndex) : p;

  const target = options.target;
  if (target === 'router') {
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
  if (PORTED_PAGES.includes(pathOnly)) {
    router.push(p).catch(() => {});
  } else {
    window.location.href = '/pages/' + pathOnly.slice(1) + '.html' + hash;
  }
}
