#!/usr/bin/env node
/**
 * Hex Color Audit Script for Vue Files
 * 
 * Detects all hex color instances in .vue files, categorizes them,
 * and outputs a JSON report for manual review.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const VUE_FILES_DIR = path.join(ROOT_DIR, 'projects/web-app/src');

// Hex color regex - matches #RGB, #RRGGBB, case insensitive
const HEX_PATTERN = /#([0-9a-fA-F]{3}){1,2}\b/g;

// Exclusion patterns
const EXCLUSION_PATTERNS = [
  // CSS custom property definitions: --my-var: #xxx
  { regex: /^--[\w-]+:\s*#[0-9a-fA-F]{3,6}/, reason: 'CSS custom property definition' },
  // CSS comments: /* ... */
  { regex: /\/\*[\s\S]*?\*\//, reason: 'CSS comment' },
  // HTML comments: <!-- ... -->
  { regex: /<!--[\s\S]*?-->/, reason: 'HTML comment' },
  // JS/TS comments: // ... or /* ... */
  { regex: /\/\/.*$/gm, reason: 'JS comment' },
  // Accent overrides: style="--color-accent: #xxx"
  { regex: /style="[^"]*--color-accent[^"]*#[0-9a-fA-F]{3,6}/, reason: 'Accent override (AD-17)' },
  // Linear gradients
  { regex: /linear-gradient\([^)]*#[0-9a-fA-F]{3,6}[^)]*\)/g, reason: 'Linear gradient' },
  // URL-encoded hex
  { regex: /%23[0-9a-fA-F]{3,6}/g, reason: 'URL-encoded hex' },
  // v-bind reactive colors
  { regex: /v-bind\(['"][^)]*#[0-9a-fA-F]{3,6}[^)]*['"]\)/g, reason: 'v-bind reactive color' },
  // Data attributes
  { regex: /data-[\w-]+="[^"]*#[0-9a-fA-F]{3,6}[^"]*"/g, reason: 'Data attribute' },
  // rgba/hsla functions
  { regex: /rgba\s*\([^)]*#[0-9a-fA-F]{3,6}[^)]*\)/g, reason: 'RGBA with hex' },
  { regex: /hsla\s*\([^)]*#[0-9a-fA-F]{3,6}[^)]*\)/g, reason: 'HSLA with hex' },
];

/**
 * Check if a match should be excluded
 */
function isExcluded(match, context, lineNumber) {
  const matchLower = match.toLowerCase();
  const contextLower = context.toLowerCase();
  
  // CSS custom property definition
  if (matchLower.startsWith('--')) return true;
  
  // Check for inline style with accent (AD-17)
  if (contextLower.includes('style=') && contextLower.includes('--color-accent')) return true;
  
  // Check for linear-gradient
  if (contextLower.includes('linear-gradient')) return true;
  
  // Check for URL-encoded
  if (context.includes('%23')) return true;
  
  return false;
}

/**
 * Categorize a hex color
 */
function categorize(match, context, filePath) {
  const contextLower = context.toLowerCase();
  const fileName = path.basename(filePath);
  
  // Check for fallbacks: var(--token, #hex)
  if (context.includes('var(') && context.includes(',')) {
    return 'fallback';
  }
  
  // Check for code syntax highlighting
  const codeColors = ['#1e1e1e', '#d4d4d4', '#569cd6', '#ce9178', '#6a9955', '#c586c0', '#9cdcfe', '#dcdcaa'];
  if (codeColors.some(c => c.toLowerCase() === match.toLowerCase())) {
    return 'code';
  }
  
  // Check for gradient colors
  if (contextLower.includes('gradient')) {
    return 'gradient';
  }
  
  // Check for accent overrides (AD-17)
  if (contextLower.includes('--color-accent:')) {
    return 'accent';
  }
  
  // Check for CSS custom property definition
  if (context.match(/^--[\w-]+:\s*#/)) {
    return 'excluded';
  }
  
  // Default: replaceable
  return 'replaceable';
}

/**
 * Extract hex colors from a Vue file
 */
function extractFromFile(filePath) {
  const results = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    const matches = line.matchAll(HEX_PATTERN);
    
    for (const match of matches) {
      const hex = match[0];
      const index = match.index;
      
      // Get context (the full line)
      const context = line;
      
      // Skip excluded patterns
      if (isExcluded(hex, context, lineNum + 1)) continue;
      
      // Categorize
      const category = categorize(hex, context, filePath);
      
      results.push({
        file: path.relative(VUE_FILES_DIR, filePath).replace(/\\/g, '/'),
        line: lineNum + 1,
        column: index + 1,
        hex: hex.toLowerCase(),
        hexRaw: hex,
        context: context.trim().substring(0, 100),
        category
      });
    }
  }
  
  return results;
}

/**
 * Recursively find all .vue files
 */
function findVueFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findVueFiles(fullPath));
    } else if (entry.name.endsWith('.vue')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Hex Color Audit for Vue Files\n');
  console.log(`Scanning: ${VUE_FILES_DIR}\n`);
  
  const vueFiles = findVueFiles(VUE_FILES_DIR);
  console.log(`Found ${vueFiles.length} Vue files\n`);
  
  const allResults = [];
  
  for (const file of vueFiles) {
    const results = extractFromFile(file);
    allResults.push(...results);
  }
  
  // Sort by file and line
  allResults.sort((a, b) => {
    if (a.file !== b.file) return a.file.localeCompare(b.file);
    return a.line - b.line;
  });
  
  // Count by category
  const categoryCounts = {};
  for (const r of allResults) {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  }
  
  // Count by file
  const fileCounts = {};
  for (const r of allResults) {
    fileCounts[r.file] = (fileCounts[r.file] || 0) + 1;
  }
  
  // Sort files by count (descending)
  const topFiles = Object.entries(fileCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Output summary
  console.log('=== SUMMARY ===\n');
  console.log(`Total hex colors found: ${allResults.length}\n`);
  console.log('By category:');
  for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    const bar = '█'.repeat(Math.floor(count / 5));
    console.log(`  ${cat.padEnd(12)} ${count.toString().padStart(4)} ${bar}`);
  }
  
  console.log('\nTop 10 files by violations:');
  for (const [file, count] of topFiles) {
    console.log(`  ${count.toString().padStart(4)} ${file}`);
  }
  
  // Write JSON report
  const report = {
    timestamp: new Date().toISOString(),
    total: allResults.length,
    categories: categoryCounts,
    topFiles,
    results: allResults
  };
  
  const reportPath = path.join(ROOT_DIR, 'hex-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 JSON report written: ${reportPath}`);
  
  // Write exclusion manifest
  const exclusionManifest = {
    patterns: EXCLUSION_PATTERNS.map(p => ({
      pattern: p.regex.source,
      reason: p.reason
    }))
  };
  
  const manifestPath = path.join(ROOT_DIR, 'hex-exclusion-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(exclusionManifest, null, 2));
  console.log(`📄 Exclusion manifest: ${manifestPath}`);
  
  // Categorize by replaceable
  const replaceable = allResults.filter(r => r.category === 'replaceable');
  
  // Find duplicate hex values
  const hexCounts = {};
  for (const r of replaceable) {
    hexCounts[r.hex] = (hexCounts[r.hex] || 0) + 1;
  }
  
  const duplicates = Object.entries(hexCounts)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);
  
  if (duplicates.length > 0) {
    console.log('\n🔄 Duplicate hex values (same color in multiple files):');
    for (const [hex, count] of duplicates.slice(0, 20)) {
      const files = replaceable.filter(r => r.hex === hex).map(r => r.file);
      console.log(`  ${hex} (${count}x): ${files.slice(0, 3).join(', ')}${files.length > 3 ? '...' : ''}`);
    }
  }
  
  console.log('\n✅ Audit complete!\n');
  
  return report;
}

main();
