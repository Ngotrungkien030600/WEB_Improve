// Quét class dùng trong template nhưng KHÔNG có CSS (trong scoped style của trang hoặc main.css).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = 'projects/web-app/src';
const globalCss = readFileSync(join(root, 'styles/main.css'), 'utf8');

function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return filesIn(full);
    return full.endsWith('.vue') ? [full] : [];
  });
}

const extractClasses = (source) => {
  const found = new Set();
  for (const match of source.matchAll(/class="([^"]+)"/g)) {
    match[1].split(/\s+/).forEach((name) => {
      if (name && !name.includes('{') && !name.includes('$')) found.add(name);
    });
  }
  for (const match of source.matchAll(/:class="\{([^}]+)\}"/g)) {
    for (const key of match[1].matchAll(/'([a-zA-Z0-9_-]+)'\s*:/g)) found.add(key[1]);
  }
  for (const match of source.matchAll(/class="([^"]*)"\s*:/g)) {
    match[1].split(/\s+/).forEach((name) => name && found.add(name));
  }
  return found;
};

const styledNames = (css) => {
  const names = new Set();
  for (const match of css.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)) names.add(match[1]);
  return names;
};

const globalNames = styledNames(globalCss);
const report = [];
for (const file of filesIn(join(root, 'pages'))) {
  const source = readFileSync(file, 'utf8');
  const styleStart = source.indexOf('<style');
  const style = styleStart === -1 ? '' : source.slice(styleStart);
  const localNames = styledNames(style);
  const used = extractClasses(source.slice(0, styleStart));
  const missing = [...used].filter((name) => !localNames.has(name) && !globalNames.has(name) && !name.startsWith('v-'));
  if (missing.length) report.push({ file: file.replace(root + '\\', ''), missing });
}

report.sort((a, b) => b.missing.length - a.missing.length);
for (const entry of report) {
  console.log(`${entry.file}  (${entry.missing.length})`);
  console.log(`   ${entry.missing.join(', ')}`);
}
console.log(`\nTổng file thiếu CSS: ${report.length}`);
