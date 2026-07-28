/**
 * Markdown → HTML converter for interview content.
 */
import { escapeHtml } from './helpers.js';

function inlineMarkdownToHtml(text) {
  let html = escapeHtml(text);
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  return html;
}

export function markdownToHTML(text) {
  if (!text) return '';

  let html = text.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (m, lang, code) => {
    return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Tables
  html = html.replace(/(?:^\|[^\n]+\|\n\|\s*[-:]+\s*(?:\|\s*[-:]+\s*)*\|(?:\n\|[^\n]+\|)+)/gm, (table) => {
    const rows = table.trim().split('\n').filter(r => r.trim());
    if (rows.length < 2) return table;
    function parseCells(row) {
      const cells = row.split('|');
      cells.shift();
      cells.pop();
      return cells.map(c => c.trim());
    }
    let out = '<table><thead><tr>';
    parseCells(rows[0]).forEach(h => out += `<th>${inlineMarkdownToHtml(h)}</th>`);
    out += '</tr></thead><tbody>';
    for (let i = 2; i < rows.length; i++) {
      out += '<tr>';
      parseCells(rows[i]).forEach(c => out += `<td>${inlineMarkdownToHtml(c)}</td>`);
      out += '</tr>';
    }
    out += '</tbody></table>';
    return out;
  });

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---\s*$/gm, '<hr>');

  html = html.replace(/^(\s*)-\s+(.*)$/gm, (m, indent, item) => {
    const depth = Math.floor(indent.length / 2) + 1;
    return `<li class="list-depth-${depth}">${item}</li>`;
  });
  html = html.replace(/^(\s*)\d+\.\s+(.*)$/gm, (m, indent, item) => {
    const depth = Math.floor(indent.length / 2) + 1;
    return `<li class="list-depth-${depth}">${item}</li>`;
  });
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  if (!html.startsWith('<')) html = '<p>' + html + '</p>';
  return html;
}
