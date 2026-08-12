// Converts web-en/pages/devops/*.html (except hub.html) into src/data/devops-sections.js
// Each file becomes a topic; each .section block becomes { id, title, html }.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.resolve(__dirname, '../../web-en/pages/devops');
const outPath = path.resolve(__dirname, '../src/data/devops-sections.js');

const TOPIC_ORDER = ['docker', 'kubernetes', 'cicd', 'terraform', 'monitoring', 'aws'];

const sectionRe = /<div class="section" id="([^"]+)">\s*<div class="section-title">([\s\S]*?)<\/div>\s*<div class="section-body">([\s\S]*?)<\/div>\s*<\/div>/g;

function cleanTitle(raw) {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

const topics = [];
const files = readdirSync(pagesDir).filter(f => f.endsWith('.html') && f !== 'hub.html');
const ordered = TOPIC_ORDER.map(t => `${t}.html`).filter(f => files.includes(f));

for (const file of ordered) {
  const topicId = file.replace('.html', '');
  const html = readFileSync(path.join(pagesDir, file), 'utf8');

  const sections = [];
  let m;
  while ((m = sectionRe.exec(html)) !== null) {
    const [, rawId, rawTitle, body] = m;
    sections.push({
      id: `${topicId}-${rawId}`,
      title: cleanTitle(rawTitle),
      html: body.trim(),
    });
  }

  const titleMatch = html.match(/<h1>([^<]+)<\/h1>/);
  const descMatch = html.match(/<p class="desc"[^>]*>([\s\S]*?)<\/p>/);
  topics.push({
    id: topicId,
    title: titleMatch ? titleMatch[1].trim() : topicId,
    description: descMatch ? cleanTitle(descMatch[1]) : '',
    sections,
  });
}

const out = `// Generated from web-en/pages/devops/*.html — do not edit by hand.
export const devopsTopics = ${JSON.stringify(topics, null, 2)};
`;
writeFileSync(outPath, out, 'utf8');
console.log(`Wrote ${topics.length} topics (${topics.reduce((n, t) => n + t.sections.length, 0)} sections) to ${outPath}`);
