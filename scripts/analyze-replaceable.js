#!/usr/bin/env node
/**
 * Analyze replaceable hex colors from audit report
 */

import fs from 'fs';

const reportPath = 'hex-audit-report.json';
if (!fs.existsSync(reportPath)) {
  console.error('hex-audit-report.json not found. Run hex-audit.js first.');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
const replaceable = report.results.filter(r => r.category === 'replaceable');
const unique = [...new Set(replaceable.map(r => r.hex))].sort();

console.log('Unique replaceable hex values:', unique.length);
unique.forEach(h => {
  const count = replaceable.filter(r => r.hex === h).length;
  const files = [...new Set(replaceable.filter(r => r.hex === h).map(r => r.file))];
  console.log(`  ${h} (${count}x): ${files.slice(0, 3).join(', ')}${files.length > 3 ? '...' : ''}`);
});
