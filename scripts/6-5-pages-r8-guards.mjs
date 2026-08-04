/**
 * Guard script for story 6.5 — Pages: AiHubPage, BmadAgentsPage, CodeLearnPage, GameSpeedQuizPage
 * Verifies R8 CSS token migration compliance
 *
 * Usage: node scripts/6-5-pages-r8-guards.mjs
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

// Token verification map
const EXPECTED_TOKENS = [
  { token: '--color-error', value: '#ef4444' },
  { token: '--color-primary', value: '#667eea' },
  { token: '--color-accent-bg', value: '#f3e5f5' },
  { token: '--color-text-inverse', value: '#000000' },
  { token: '--color-accent-mid', value: '#1565c0' },
];

// Files to check for hardcoded hex
const PAGES_TO_CHECK = [
  'pages/AiHubPage.vue',
  'pages/BmadAgentsPage.vue',
  'pages/CodeLearnPage.vue',
  'pages/GameSpeedQuizPage.vue',
];

let passed = 0;
let failed = 0;

function log(type, msg) {
  const icon = type === 'PASS' ? '✅' : type === 'FAIL' ? '❌' : 'ℹ️';
  console.log(`${icon} ${msg}`);
}

function assert(condition, message) {
  if (condition) {
    log('PASS', message);
    passed++;
  } else {
    log('FAIL', message);
    failed++;
  }
}

// Guard 1: Verify new tokens exist in variables.css
async function guardTokensExist() {
  console.log('\n--- Guard 1: Token Existence ---');
  const varsPath = resolve('./projects/web-en/css/variables.css');
  const content = readFileSync(varsPath, 'utf-8');

  for (const { token, value } of EXPECTED_TOKENS) {
    const pattern = new RegExp(`${token}:\\s*${value.replace('#', '#')}`, 'i');
    assert(pattern.test(content), `${token}: ${value}`);
  }
}

// Guard 2: No hardcoded hex in scoped style blocks
async function guardNoHardcodedHex() {
  console.log('\n--- Guard 2: No Hardcoded Hex in Pages ---');
  const srcPath = resolve('./projects/web-app/src');

  for (const file of PAGES_TO_CHECK) {
    const filePath = resolve(srcPath, file);
    try {
      const content = readFileSync(filePath, 'utf-8');

      // Extract scoped style blocks
      const scopedStyleMatch = content.match(/<style\s+scoped>([\s\S]*?)<\/style>/gi);
      if (!scopedStyleMatch) {
        log('INFO', `${file}: No scoped style block`);
        continue;
      }

      const scopedContent = scopedStyleMatch.join('\n');

      // Check for hardcoded hex (exclude fallback pattern)
      const hexPattern = /#[0-9a-fA-F]{3,6}(?![0-9a-fA-F]);/g;
      const matches = scopedContent.match(hexPattern) || [];

      // Filter out legitimate fallbacks
      const hardcodedHex = matches.filter(hex => {
        const escaped = hex.replace('#', '#');
        return !scopedContent.includes(`var(--`, hex) || !scopedContent.includes(escaped);
      });

      assert(hardcodedHex.length === 0, `${file}: ${hardcodedHex.length === 0 ? '0 hardcoded hex' : `Found ${hardcodedHex.length}: ${hardcodedHex.join(', ')}`}`);
    } catch (e) {
      log('FAIL', `${file}: Cannot read file - ${e.message}`);
    }
  }
}

// Guard 3: Token import present
async function guardTokenImport() {
  console.log('\n--- Guard 3: Token Import ---');
  const srcPath = resolve('./projects/web-app/src');

  for (const file of PAGES_TO_CHECK) {
    const filePath = resolve(srcPath, file);
    try {
      const content = readFileSync(filePath, 'utf-8');

      // Check for legacy token import
      const hasLegacyImport = content.includes("@import '@legacy/css/variables.css'") ||
                              content.includes('@import "@legacy/css/variables.css"');
      const hasRelativeImport = content.includes("../web-en/css/variables.css") ||
                                content.includes('../../web-en/css/variables.css');

      assert(hasLegacyImport && !hasRelativeImport, `${file}: Token import via @legacy`);
    } catch (e) {
      log('FAIL', `${file}: Cannot read file - ${e.message}`);
    }
  }
}

// Guard 4: Verify specific hex replaced correctly
async function guardHexReplacement() {
  console.log('\n--- Guard 4: Specific Hex Replacement ---');
  const replacements = [
    { file: 'pages/GameSpeedQuizPage.vue', hex: '#667eea', token: '--color-primary' },
    { file: 'pages/BmadAgentsPage.vue', hex: '#ef4444', token: '--color-error' },
    { file: 'pages/AiHubPage.vue', hex: '#f3e5f5', token: '--color-accent-bg' },
  ];

  const srcPath = resolve('./projects/web-app/src');

  for (const { file, hex, token } of replacements) {
    const filePath = resolve(srcPath, file);
    try {
      const content = readFileSync(filePath, 'utf-8');
      const pattern = new RegExp(`var\\(--${token}[^)]*\\)`);
      assert(pattern.test(content), `${file}: ${hex} → var(--${token})`);
    } catch (e) {
      log('FAIL', `${file}: Cannot read file - ${e.message}`);
    }
  }
}

async function run() {
  console.log('🎯 Story 6.5 Guards — R8 CSS Token Migration');
  console.log('============================================');

  await guardTokensExist();
  await guardNoHardcodedHex();
  await guardTokenImport();
  await guardHexReplacement();

  console.log('\n============================================');
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log('❌ Guards FAILED');
    process.exit(1);
  } else {
    console.log('✅ All guards PASSED');
    process.exit(0);
  }
}

run().catch(e => {
  console.error('❌ Guard script error:', e);
  process.exit(1);
});
