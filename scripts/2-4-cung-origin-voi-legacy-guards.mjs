/**
 * Guard script for Story 2-4 — Bản Vue cùng origin với Legacy app
 * Usage: node scripts/2-4-cung-origin-voi-legacy-guards.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

function walkDir(dir, extensions) {
  const results = [];
  const items = readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = `${dir}/${item.name}`;
    if (item.isDirectory()) {
      results.push(...walkDir(full, extensions));
    } else if (extensions.some(ext => item.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

async function run() {
  console.log('\n=== Story 2-4 Guards ===\n');

  // ─── H1: npm run build thành công ───────────────────────────────────────
  console.log('[H1] npm run build...');
  try {
    execSync('npm run build', { cwd: './projects/web-app', stdio: 'pipe' });
    assert(true, 'npm run build không lỗi');
  } catch (e) {
    assert(false, `npm run build lỗi`);
  }

  // ─── H2: dist/ có index.html và assets/ ─────────────────────────────────
  console.log('\n[H2] dist/ output...');
  assert(existsSync('./projects/web-app/dist/index.html'), 'dist/index.html tồn tại');
  assert(existsSync('./projects/web-app/dist/assets'), 'dist/assets/ tồn tại');

  const distIndex = './projects/web-app/dist/index.html';
  if (existsSync(distIndex)) {
    const html = readFileSync(distIndex, 'utf8');

    // ─── E1: Bundle asset path tuyệt đối ──────────────────────────────────
    console.log('\n[E1] Asset paths trong index.html...');
    assert(html.includes('/assets/'), 'index.html dùng absolute path /assets/...');
    assert(html.includes('<div id="app">'), 'index.html có #app mount point');
    assert(html.includes('.js'), 'index.html link đến JS bundle');
  }

  // ─── I1: No hardcoded host/port trong dist bundle (R2) ──────────────────
  console.log('\n[I1] Không hardcoded host/port trong bundle (R2)...');
  const jsFiles = walkDir('./projects/web-app/dist/assets', ['.js']);
  let hasHardcodedHost = false;
  for (const file of jsFiles) {
    const content = readFileSync(file, 'utf8');
    if (/localhost|127\.0\.0\.1/.test(content)) {
      hasHardcodedHost = true;
      break;
    }
  }
  assert(!hasHardcodedHost, 'Bundle .js không chứa hardcoded localhost/127.0.0.1');

  // ─── I3: No hex color trong bundle CSS (R8) ────────────────────────────
  console.log('\n[I3] Không hex color rải rác trong bundle CSS (R8)...');
  const cssFiles = walkDir('./projects/web-app/dist/assets', ['.css']);
  let hexCount = 0;
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf8');
    const matches = content.match(/#[0-9a-fA-F]{3,6}/g) || [];
    hexCount += matches.length;
  }
  assert(hexCount === 0, `Bundle CSS không chứa hex color (tìm thấy ${hexCount} hex)`);

  // ─── I2: Vue đọc localStorage trực tiếp (R6) ─────────────────────────
  console.log('\n[I2] Vue đọc localStorage trực tiếp (R6)...');
  const srcFiles = walkDir('./projects/web-app/src', ['.js', '.vue']);
  let hasAdapter = false;
  for (const file of srcFiles) {
    const content = readFileSync(file, 'utf8');
    if (content.includes('LocalStorageAdapter') || content.includes('StorageService')) {
      hasAdapter = true;
      break;
    }
  }
  assert(!hasAdapter, 'Không có localStorage adapter riêng — đọc trực tiếp');

  // ─── E2: SPA fallback config ────────────────────────────────────────────
  console.log('\n[E2] SPA fallback config...');
  const viteConfig = readFileSync('./projects/web-app/vite.config.js', 'utf8');
  assert(
    viteConfig.includes('proxy') || viteConfig.includes('historyApiFallback'),
    'vite.config.js có proxy hoặc historyApiFallback'
  );

  // ─── Summary ────────────────────────────────────────────────────────────
  console.log(`\n=== Kết quả: ${passed} passed, ${failed} failed ===\n`);
  if (failed > 0) {
    console.error('Guard FAILED — cần fix trước khi merge');
    process.exit(1);
  } else {
    console.log('Tất cả guards passed ✓');
  }
}

run().catch(err => {
  console.error('Guard script error:', err.message);
  process.exit(1);
});
