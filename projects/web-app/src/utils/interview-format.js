const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const FENCE = '```';
const MARK_START = '\u0001';
const MARK_END = '\u0002';

export function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

export function normalizeForSearch(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function markMatches(escaped, query) {
  const needle = normalizeForSearch(query).trim();
  if (!needle) return escaped;

  const haystack = normalizeForSearch(escaped);
  const parts = [];
  let cursor = 0;
  let found = haystack.indexOf(needle);

  while (found !== -1) {
    parts.push(escaped.slice(cursor, found));
    parts.push(MARK_START + escaped.slice(found, found + needle.length) + MARK_END);
    cursor = found + needle.length;
    found = haystack.indexOf(needle, cursor);
  }
  parts.push(escaped.slice(cursor));
  return parts.join('');
}

function applyMarks(text) {
  return text.split(MARK_START).join('<mark>').split(MARK_END).join('</mark>');
}

export function highlightText(text, query = '') {
  return applyMarks(markMatches(escapeHtml(text), query));
}

export function formatInline(text, query = '') {
  const marked = markMatches(escapeHtml(text), query);
  const withCode = marked.replace(/`([^`]+)`/g, '<code>$1</code>');
  const withBold = withCode.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return applyMarks(withBold);
}

export function formatAnswer(answer, query = '') {
  const lines = String(answer ?? '').split('\n');
  const blocks = [];
  let bullets = [];
  let code = [];
  let inCode = false;

  const flushBullets = () => {
    if (!bullets.length) return;
    blocks.push(`<ul>${bullets.map((item) => `<li>${item}</li>`).join('')}</ul>`);
    bullets = [];
  };

  const flushCode = () => {
    if (!code.length) return;
    blocks.push(`<pre><code>${code.join('\n')}</code></pre>`);
    code = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '');
    if (line.trim().startsWith(FENCE)) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushBullets();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      code.push(escapeHtml(line));
      continue;
    }
    if (/^\s*-\s+/.test(line)) {
      bullets.push(formatInline(line.replace(/^\s*-\s+/, ''), query));
      continue;
    }
    flushBullets();
    if (line.trim()) blocks.push(`<p>${formatInline(line, query)}</p>`);
  }

  flushBullets();
  flushCode();
  return blocks.join('');
}

export function matchesQuestion(item, query) {
  const needle = normalizeForSearch(query).trim();
  if (!needle) return true;
  const haystack = normalizeForSearch(`${item.topic} ${item.q} ${item.a}`);
  return haystack.includes(needle);
}

export function filterQuestions(questions, query) {
  return questions.filter((item) => matchesQuestion(item, query));
}

export function countTopics(questions) {
  return new Set(questions.map((item) => item.topic)).size;
}

export function pageSlice(list, page, size) {
  const safeSize = Math.max(1, size);
  const start = (Math.max(1, page) - 1) * safeSize;
  return list.slice(start, start + safeSize);
}

export function pageCount(total, size) {
  const safeSize = Math.max(1, size);
  return Math.max(1, Math.ceil(total / safeSize));
}

export function pageNumbers(current, total, window = 5) {
  if (total <= window + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const numbers = [1];
  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);

  if (current <= 3) {
    start = 2;
    end = Math.min(total - 1, window - 1);
  }
  if (current >= total - 2) {
    start = Math.max(2, total - window + 2);
    end = total - 1;
  }
  if (start > 2) numbers.push('...');
  for (let page = start; page <= end; page += 1) numbers.push(page);
  if (end < total - 1) numbers.push('...');
  numbers.push(total);
  return numbers;
}
