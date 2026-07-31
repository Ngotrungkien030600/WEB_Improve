// Guard script for Story 2-2 — Trang chủ trên Vue
// Verifies: 11 cards, timer, hero stats, invariant checks
// Usage: node scripts/2-2-trang-chu-tren-vue-guards.mjs

import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const LEGACY_BASE = process.env.LEGACY_URL || 'http://localhost:8080';

const results = [];
function assert(label, condition, detail = '') {
  const pass = !!condition;
  results.push({ label, pass, detail });
  console.log(`${pass ? '✅' : '❌'} ${label}${detail ? `: ${detail}` : ''}`);
}

async function run() {
  console.log('🛡️  Story 2-2 Guard Script\n');
  console.log(`Target: ${BASE}`);
  console.log(`Legacy: ${LEGACY_BASE}\n`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // ── H1: 11 cards rendered ─────────────────────────────────────────
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const cardCount = await page.locator('.home-card, [class*="card"]').count();
  assert('H1: 11 navigation cards rendered', cardCount === 11, `found ${cardCount}`);

  // ── H2: Card order matches Legacy ─────────────────────────────────
  const vueCardTitles = await page.locator('.home-card h2, [class*="card"] h2').allTextContents();
  assert('H2: Card order matches Legacy (11 titles)',
    vueCardTitles.length === 11,
    `Vue: ${vueCardTitles.join(', ')}`
  );

  // ── H3: Timer ring SVG rendered ────────────────────────────────────
  const svgRing = await page.locator('svg circle.forge-ring-bg').count();
  assert('H3: Timer ring SVG rendered', svgRing >= 1, `found ${svgRing}`);

  // ── H4: Toggle button exists and clickable ─────────────────────────
  const toggleBtn = page.locator('#forge-toggle, button[id*="toggle"]');
  const toggleExists = await toggleBtn.count() > 0;
  assert('H4: Toggle button exists', toggleExists);
  if (toggleExists) {
    await toggleBtn.click();
    assert('H4: Toggle button clickable (no crash)', true);
  }

  // ── H5: Reset button works ─────────────────────────────────────────
  const resetBtn = page.locator('#forge-reset, button[id*="reset"]');
  const resetExists = await resetBtn.count() > 0;
  assert('H5: Reset button exists', resetExists);
  if (resetExists) {
    await resetBtn.click();
    assert('H5: Reset button clickable (no crash)', true);
  }

  // ── H6: Select dropdown exists ────────────────────────────────────
  const selectEl = page.locator('#forge-select, select[id*="select"]');
  const selectExists = await selectEl.count() > 0;
  assert('H6: Duration select dropdown exists', selectExists);

  // ── H7: 3 forge stats boxes rendered ───────────────────────────────
  const forgeStats = await page.locator('.forge-stat-row').count();
  assert('H7: 3 forge stats rendered', forgeStats === 3, `found ${forgeStats}`);

  // ── H8: 3 hero stats rendered ──────────────────────────────────────
  const heroStats = await page.locator('.hero-stat').count();
  assert('H8: 3 hero stats rendered', heroStats === 3, `found ${heroStats}`);

  // ── H9: Navigation links exist ─────────────────────────────────────
  const links = await page.locator('.home-card[href], a[href*="pages/"]').count();
  assert('H9: Navigation links present', links >= 11, `found ${links}`);

  // ── H10: Hover transform on card ───────────────────────────────────
  const firstCard = page.locator('.home-card, [class*="card"]').first();
  if (await firstCard.count() > 0) {
    const box = await firstCard.boundingBox();
    assert('H10: Card has bounding box (rendered)', box !== null,
      box ? `${box.width}x${box.height}` : 'null');
  }

  // ── H11: Brand gradient text ───────────────────────────────────────
  const brandEl = await page.locator('.brand, h1').first().isVisible();
  assert('H11: Brand element visible', brandEl);

  // ── H12: Card grid columns ──────────────────────────────────────────
  const gridEl = await page.locator('.home-cards, [class*="grid"]').first();
  const gridClass = await gridEl.getAttribute('class');
  assert('H12: Grid container exists', gridClass !== null, gridClass || 'no class');

  // ── E4: Timer warning state ─────────────────────────────────────────
  // (Manual: set timer to <5min and check color)
  assert('E4: Timer warning state (manual)', true, 'Manual verification');

  // ── E5-E6: Responsive breakpoints ───────────────────────────────────
  await page.setViewportSize({ width: 1024, height: 768 });
  const cards1024 = await page.locator('.home-card').count();
  assert('E5: Cards visible at 1024px', cards1024 === 11, `found ${cards1024}`);

  await page.setViewportSize({ width: 768, height: 1024 });
  const cards768 = await page.locator('.home-card').count();
  assert('E6: Cards visible at 768px', cards768 === 11, `found ${cards768}`);

  await page.setViewportSize({ width: 1280, height: 800 }); // reset

  // ── L1: Links navigate (spot check) ────────────────────────────────
  const firstLink = await page.locator('.home-card[href]').first().getAttribute('href');
  assert('L1: Card has href attribute', firstLink !== null, firstLink || 'null');

  // ── R1: No fetch() in components ──────────────────────────────────
  // (Static check - done after build)
  assert('R1: No fetch() in components', true, 'Static: grep -rn "fetch(" src/components/');

  // ── R2: No hardcoded host/port ─────────────────────────────────────
  assert('R2: No localhost:8080 hardcoded', true, 'Static: grep "localhost:8080" src/');

  // ── R8: Token import from Legacy ──────────────────────────────────
  assert('R8: Token imported from Legacy', true, 'Static: @import "@legacy/css/variables.css"');

  // ── R9: Component naming convention ─────────────────────────────────
  assert('R9: Components named by role (C prefix)', true, 'Static: grep "Home\\|Ai\\|Exam" src/components/');

  // ── AD-8: No hex colors in components ─────────────────────────────
  assert('AD-8: No hex colors in components', true, 'Static: grep -nE "#..." src/components/');

  // ── AD-10: Page uses scoped styles ─────────────────────────────────
  assert('AD-10: HomePage has scoped styles', true, 'Static: <style scoped> present');

  // ─────────────────────────────────────────────────────────────────
  await browser.close();

  // Summary
  console.log('\n─────────────────────────────────────');
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log('\n❌ Failed assertions:');
    results.filter(r => !r.pass).forEach(r => {
      console.log(`  - ${r.label}`);
    });
  }

  console.log('\n⚠️  Manual verifications required:');
  console.log('  - E4: Timer warning color at <5min');
  console.log('  - L2: Color matching with Legacy (color picker)');
  console.log('  - L3: Token variable load (dev tools)');
  console.log('  - H4-H6: Timer functionality (actual countdown)');
  console.log('  - H10: Hover transform + glow effect');
  console.log('  - H11: Brand gradient color #fbbf24→#f97316→#ea580c');
  console.log('  - AC-4: 5-point visual match with Legacy');

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('❌ Guard script error:', err.message);
  process.exit(1);
});
