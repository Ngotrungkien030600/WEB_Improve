// Converts web-en/pages/cloud.html into src/data/cloud-sections.js
// Each .section block becomes { id, title, html } where html is the inner section-body.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '../../web-en/pages/cloud.html');
const outPath = path.resolve(__dirname, '../src/data/cloud-sections.js');

const html = readFileSync(htmlPath, 'utf8');

// Extract each <div class="section" id="..."> ... </div>
const sectionRe = /<div class="section" id="([^"]+)">\s*<div class="section-title">([\s\S]*?)<\/div>\s*<div class="section-body">([\s\S]*?)<\/div>\s*<\/div>/g;

const sections = [];
let m;
while ((m = sectionRe.exec(html)) !== null) {
  const [, id, rawTitle, body] = m;
  const title = rawTitle
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
  sections.push({ id, title, html: body.trim() });
}

const out = `// Generated from web-en/pages/cloud.html — do not edit by hand.
export const cloudSections = ${JSON.stringify(sections, null, 2)};
`;
writeFileSync(outPath, out, 'utf8');
console.log(`Wrote ${sections.length} sections to ${outPath}`);
