/**
 * Guard script — Story 2-1
 * Bản Vue scaffold + API proxy
 *
 * Chạy: node scripts/2-1-vue-app-scaffold-va-api-proxy-guards.mjs
 * Env:   BASE_URL (default http://localhost:5173)
 *        LEGACY_URL (default http://localhost:8080)
 *        API_URL    (default http://localhost:8080)
 *
 * Prerequisites:
 *   1. Legacy server:  node projects/web-en/server/index.js
 *   2. API server:    node projects/web-en/server/index.js (same process)
 *   3. Vue dev:       cd projects/web-app && npm run dev
 */

const BASE   = process.env.BASE_URL     || 'http://localhost:5173';
const LEGACY = process.env.LEGACY_URL   || 'http://localhost:8080';
const API    = process.env.API_URL      || 'http://localhost:8080';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.error(`  FAIL  ${label}`);
    failed++;
  }
}

async function run() {
  console.log('\n=== Guard: 2-1-vue-app-scaffold-va-api-proxy ===\n');

  // 1. Scaffold structure
  console.log('[SCAFFOLD]');
  const fs = await import('fs');
  const path = await import('path');
  const root = path.resolve('projects/web-app/src');
  const dirs = ['main.js','App.vue','router','pages','components','storage','api','styles'];
  for (const d of dirs) {
    assert(fs.existsSync(path.join(root, d)), `src/${d} exists`);
  }
  const pkg = JSON.parse(fs.readFileSync('projects/web-app/package.json', 'utf8'));
  assert(pkg.dependencies?.vue === '3.5.40', 'vue pinned to 3.5.40');
  assert(pkg.devDependencies?.vite === '8.1.5', 'vite pinned to 8.1.1');
  assert(pkg.devDependencies?.['vue-router'] === '5.2.0', 'vue-router pinned to 5.2.0');
  assert(pkg.devDependencies?.['@vitejs/plugin-vue'] === '6.0.8', '@vitejs/plugin-vue pinned to 6.0.8');
  assert(!pkg.devDependencies?.typescript && !fs.existsSync('projects/web-app/tsconfig.json'), 'no TypeScript');
  assert(!pkg.dependencies?.vuetify && !pkg.dependencies?.primevue, 'no component libs');

  // 2. Layer invariants (grep simulation via content check)
  const viteConfig = fs.readFileSync('projects/web-app/vite.config.js', 'utf8');
  assert(viteConfig.includes('@legacy') && viteConfig.includes("'../web-en'"), '@legacy alias present');
  assert(!viteConfig.includes('localhost:8080') && !viteConfig.includes('127.0.0.1:8080'), 'no hardcoded host in vite.config.js');
  assert(!viteConfig.includes('host: true') && !viteConfig.includes('host: "0.0.0.0"'), 'server.host not exposed');

  // 3. Dev server HTTP checks
  console.log('\n[DEV SERVER]');
  try {
    const rootResp = await fetch(BASE, { signal: AbortSignal.timeout(5000) });
    assert(rootResp.ok, `GET / → HTTP ${rootResp.status}`);
  } catch {
    assert(false, 'Dev server unreachable');
  }

  // 4. API proxy works (only if servers running)
  console.log('\n[API PROXY]');
  try {
    const apiResp = await fetch(`${BASE}/api/ai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentIds: [], messages: {} }),
      signal: AbortSignal.timeout(8000),
    });
    // We expect JSON (success or error) not a proxy error page
    const ct = apiResp.headers.get('content-type') || '';
    assert(apiResp.headers.get('content-type')?.includes('application/json'), `API proxy returns JSON (not HTML proxy error), got ${apiResp.status}`);
    void ct; // suppress unused
  } catch (e) {
    assert(false, `API proxy test failed: ${e.message}`);
  }

  // 5. Pages proxy works (only if servers running)
  console.log('\n[PAGES PROXY]');
  try {
    const pagesResp = await fetch(`${BASE}/pages/index.html`, { signal: AbortSignal.timeout(5000) });
    assert(pagesResp.ok, `GET /pages/index.html → ${pagesResp.status} (should not be 404 from Vite)`);
  } catch {
    assert(false, 'Pages proxy unreachable');
  }

  // 6. No fetch() in components/pages
  console.log('\n[LAYER INVARIANTS]');
  const componentsDir = path.join(root, 'components');
  const pagesDir = path.join(root, 'pages');
  for (const dir of [componentsDir, pagesDir]) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue') || f.endsWith('.js'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        assert(!content.includes('fetch(') && !content.includes('fetch ('), `No fetch() in ${file}`);
      }
    }
  }

  // Summary
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => {
  console.error('Guard script error:', e.message);
  process.exit(1);
});
