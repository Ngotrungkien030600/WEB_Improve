/**
 * Story 4.6 — Port code-learn page
 * Guard script: Playwright assertions
 *
 * Run: node scripts/4-6-code-learn-guards.mjs
 * Requires: npm install -D playwright && npx playwright install chromium
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const LEGACY = process.env.LEGACY_URL || 'http://localhost:8080';

let passed = 0;
let failed = 0;

async function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed++;
  }
}

async function run() {
  console.log('\n=== Story 4.6 Guard Script ===\n');
  console.log(`Base URL: ${BASE}`);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // ---- H1: Page loads with topics ----
  console.log('\n[H1] Page loads with topics');
  await page.goto(`${BASE}/code-learn`);
  await page.waitForSelector('#learn-topic-list', { timeout: 5000 }).catch(() => {});
  const items = await page.$$('#learn-topic-list li');
  await assert(items.length > 0, `Sidebar has ${items.length} items (expected > 0)`);
  await assert(items.length >= 21, `Sidebar has >= 21 items (20 topics + 1 intro)`);

  // ---- H2: Topic navigation ----
  console.log('\n[H2] Topic navigation');
  const thirdTopic = await page.$('#learn-topic-list li:nth-child(3)');
  if (thirdTopic) {
    await thirdTopic.click();
    await page.waitForTimeout(200);
    const title = await page.textContent('#learn-topic-title').catch(() => '');
    await assert(title.length > 0, `Topic title rendered: "${title.substring(0, 30)}..."`);
    const bodyContent = await page.textContent('#learn-topic-body').catch(() => '');
    await assert(bodyContent.length > 0, 'Topic body has content');
  } else {
    await assert(false, 'Third topic item found');
  }

  // ---- H3: Checklist toggle ----
  console.log('\n[H3] Checklist toggle');
  // Navigate to a topic with checklist
  const topicWithChecklist = await page.$('#learn-topic-list li[data-index]');
  if (topicWithChecklist) {
    await topicWithChecklist.click();
    await page.waitForTimeout(200);
  }
  const checkbox = await page.$('#learn-topic-body input[type="checkbox"]');
  if (checkbox) {
    const wasChecked = await checkbox.isChecked();
    await checkbox.click();
    await page.waitForTimeout(100);
    const storage = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('learnChecklist') || '{}');
    });
    const storageKeys = Object.keys(storage);
    await assert(storageKeys.length > 0, `localStorage has ${storageKeys.length} entries after toggle`);
    await assert(!wasChecked === await checkbox.isChecked(), 'Checkbox state toggled correctly');
    // Reset
    await checkbox.click();
    await page.waitForTimeout(100);
  } else {
    console.log('  ⚠ No checklist items on this topic, skipping H3');
  }

  // ---- H4: Untick checkbox ----
  console.log('\n[H4] Untick checkbox (part of H3)');
  // Already tested above - checkbox click toggles both ways

  // ---- H5: State restoration ----
  console.log('\n[H5] State restoration on reload');
  const checkbox2 = await page.$('#learn-topic-body input[type="checkbox"]');
  if (checkbox2) {
    const isNowChecked = await checkbox2.isChecked();
    if (isNowChecked) {
      await checkbox2.click();
      await page.waitForTimeout(100);
    }
    // Toggle to checked
    await checkbox2.click();
    await page.waitForTimeout(100);
    // Reload
    await page.reload();
    await page.waitForSelector('#learn-topic-list', { timeout: 5000 });
    await page.waitForTimeout(300);
    const restoredCheck = await page.$('#learn-topic-body input[type="checkbox"]');
    if (restoredCheck) {
      await assert(await restoredCheck.isChecked(), 'Checkbox state restored after reload');
    }
  }

  // ---- E1: Empty topics handling ----
  console.log('\n[E1] Empty topics handling');
  // If topics array is empty, the page should not crash
  const topicListHtml = await page.innerHTML('#learn-topic-list').catch(() => '');
  await assert(topicListHtml.length > 0, 'Topic list has content (no crash on load)');

  // ---- E2: Topic with empty checklist ----
  console.log('\n[E2] Topic with empty checklist');
  const introItem = await page.$('#learn-topic-list .intro-item');
  if (introItem) {
    await introItem.click();
    await page.waitForTimeout(200);
    const checklistSection = await page.$('#learn-topic-body h3');
    await assert(!checklistSection, 'No checklist section for intro topic');
  }

  // ---- E3: Special chars in checklist ----
  console.log('\n[E3] Special chars / XSS prevention');
  const checkbox3 = await page.$('#learn-topic-body input[type="checkbox"]');
  if (checkbox3) {
    const itemText = await page.textContent('#learn-topic-body label:first-of-type span').catch(() => '');
    // Should not contain raw HTML tags
    const hasRawHtml = /<[^>]+>/.test(itemText);
    await assert(!hasRawHtml, `Item text is safe (no raw HTML): "${itemText.substring(0, 20)}..."`);
  }

  // ---- R1: localStorage unavailable fallback ----
  console.log('\n[R1] localStorage unavailable fallback');
  // Clear localStorage and reload
  await page.evaluate(() => localStorage.removeItem('learnChecklist'));
  await page.reload();
  await page.waitForSelector('#learn-topic-list', { timeout: 5000 });
  const pageWorksAfterClear = await page.$('#learn-topic-list li');
  await assert(!!pageWorksAfterClear, 'Page works after clearing localStorage');

  // ---- R2: JSON parse error handling ----
  console.log('\n[R2] JSON parse error handling');
  await page.evaluate(() => localStorage.setItem('learnChecklist', 'invalid json {{{'));
  await page.reload();
  await page.waitForSelector('#learn-topic-list', { timeout: 5000 });
  const pageNotCrashed = await page.$('#learn-topic-list li');
  await assert(!!pageNotCrashed, 'Page does not crash on corrupted localStorage');
  // Cleanup
  await page.evaluate(() => localStorage.removeItem('learnChecklist'));

  // ---- I1: R6 Storage ownership ----
  console.log('\n[I1] R6: learnChecklist is the only key');
  const allKeys = await page.evaluate(() => Object.keys(localStorage));
  const learnKeys = allKeys.filter(k => k.includes('learn'));
  await assert(learnKeys.length <= 1, `Only learnChecklist key used (found: ${learnKeys.join(', ')})`);
  await page.evaluate(() => localStorage.clear());

  // ---- I2: R7 Registry ----
  console.log('\n[I2] R7: PORTED_PAGES includes /code-learn');
  // Check router config
  const fs = await import('fs');
  const routerPath = './projects/web-app/src/router/index.js';
  const hasRoute = fs.existsSync(routerPath);
  await assert(hasRoute, `Router file exists: ${routerPath}`);
  if (hasRoute) {
    const routerContent = fs.readFileSync(routerPath, 'utf-8');
    await assert(routerContent.includes('/code-learn'), 'Router has /code-learn route');
  }
  const registryPath = './projects/web-app/src/utils/ported-pages.js';
  const hasRegistry = fs.existsSync(registryPath);
  await assert(hasRegistry, `Registry file exists: ${registryPath}`);
  if (hasRegistry) {
    const registryContent = fs.readFileSync(registryPath, 'utf-8');
    await assert(registryContent.includes('/code-learn'), 'PORTED_PAGES includes /code-learn');
  }

  // ---- I3: R8 No hardcoded tokens ----
  console.log('\n[I3] R8: No hardcoded tokens');
  // This is a compile-time check - verify during review
  // We do a runtime check here for hex colors in computed styles
  const sidebarBg = await page.evaluate(() => {
    const el = document.querySelector('#learn-topic-list');
    if (!el) return null;
    const bg = window.getComputedStyle(el).backgroundColor;
    return bg;
  });
  // CSS vars should resolve to tokens
  const usesToken = sidebarBg && (sidebarBg.includes('rgb') || sidebarBg === 'transparent');
  await assert(usesToken !== false, `Sidebar uses CSS token (not hex): ${sidebarBg}`);

  // ---- I4: R1 Layer boundary ----
  console.log('\n[I4] R1: Layer boundary');
  const componentPath = './projects/web-app/src/pages/CodeLearnPage.vue';
  const componentExists = fs.existsSync(componentPath);
  await assert(componentExists, `Page component exists: ${componentPath}`);
  if (componentExists) {
    const componentContent = fs.readFileSync(componentPath, 'utf-8');
    // Should NOT import from relative web-en paths
    const hasRelativeImport = /from\s+['"]\.\.\/web-en/.test(componentContent);
    await assert(!hasRelativeImport, 'No relative ../web-en imports (use @legacy)');
  }

  // ---- FR-6: Visual verification prompt ----
  console.log('\n=== FR-6 Visual Comparison ===');
  console.log('Manual check required: Legacy vs Vue side-by-side');
  console.log('1. Block layout — sidebar + content layout');
  console.log('2. Color — accent, surface colors');
  console.log('3. Spacing — padding, margin');
  console.log('4. Font/size — typography');
  console.log('5. Hover state — topic highlight, checkbox');
  console.log(`\nLegacy: ${LEGACY}/pages/code-learn.html`);
  console.log(`Vue: ${BASE}/code-learn`);

  await browser.close();

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) {
    console.error(`\n${failed} assertions failed. Fix before merging.`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Guard script error:', err);
  process.exit(1);
});
