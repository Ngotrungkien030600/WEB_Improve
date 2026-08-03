const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'interview_java');
const files = fs.readdirSync(folder)
  .filter(f => f.endsWith('.md'))
  .sort((a, b) => {
    const na = parseInt(a.match(/Phan(\d+)/)?.[1] || '0', 10);
    const nb = parseInt(b.match(/Phan(\d+)/)?.[1] || '0', 10);
    if (na !== nb) return na - nb;
    return a.localeCompare(b);
  });

function parseMarkdown(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  let title = '';
  let contentLines = [];
  const checklist = [];
  let inCode = false;
  let codeBuffer = [];

  for (let line of lines) {
    if (!title && line.startsWith('# ')) {
      title = line.replace(/^#\s*/, '').trim();
      continue;
    }

    if (line.startsWith('```')) {
      if (inCode) {
        codeBuffer.push(line);
        contentLines.push(codeBuffer.join('\n'));
        codeBuffer = [];
        inCode = false;
      } else {
        inCode = true;
        codeBuffer.push(line);
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    const checklistMatch = line.match(/^-\s*\[([ xX])\]\s*(.+)$/);
    if (checklistMatch) {
      checklist.push(checklistMatch[2].trim());
      continue;
    }

    contentLines.push(line);
  }

  while (contentLines.length && contentLines[contentLines.length - 1].trim() === '') {
    contentLines.pop();
  }

  return {
    title,
    content: contentLines.join('').trim(),
    checklist
  };
}

const topics = files.map(file => {
  const md = fs.readFileSync(path.join(folder, file), 'utf-8');
  const parsed = parseMarkdown(md);
  return {
    file,
    title: parsed.title,
    content: parsed.content,
    checklist: parsed.checklist,
  };
});

const json = JSON.stringify(topics).replace(/\r/g, '');
const output = '// Auto-generated from interview_java/*.md\nwindow.interviewTopics = ' + json + ';\n\nexport const interviewTopics = window.interviewTopics;\n';

const outputPath = path.join(__dirname, 'js/data/interview-data.js');
fs.writeFileSync(outputPath, output, 'utf-8');
