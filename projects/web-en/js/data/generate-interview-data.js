/**
 * Generate interview-data.js from markdown files in interview_java/
 */
const fs = require('fs');
const path = require('path');

const MD_DIR = path.join(__dirname, '../../interview_java');
const OUTPUT = path.join(__dirname, 'interview-data.js');

// Order defines index (0-based)
const ORDER = [
  'README.md',
  'Phan1_Java_Core_CheatSheet.md',
  'Phan2_Collections_CheatSheet.md',
  'Phan3_Exception_CheatSheet.md',
  'Phan4_Java8_CheatSheet.md',
  'Phan5_Multithreading_CheatSheet.md',
  'Phan6_SQL_Database_CheatSheet.md',
  'Phan7_SpringBoot_CheatSheet.md',
  'Phan8_REST_API_CheatSheet.md',
  'Phan9_DTO_Validation_CheatSheet.md',
  'Phan10_JPA_Hibernate_CheatSheet.md',
  'Phan11_Transaction_CheatSheet.md',
  'Phan12_Security_JWT_CheatSheet.md',
  'Phan13_Docker_CheatSheet.md',
  'Phan14_Kafka_CheatSheet.md',
  'Phan15_AWS_CheatSheet.md',
  'Phan16_CICD_CheatSheet.md',
  'Phan17_Microservices_CheatSheet.md',
  'Phan18_SystemDesign_CheatSheet.md',
  'Phan19_Project_Mau_CheatSheet.md',
  'Phan20_Cau_Hoi_Tinh_Huong_CheatSheet.md',
  'Phan21_100_Cau_Hoi_Tu_Kiem_Tra.md',
  'Phan21_100_Cau_Hoi_Tu_Kiem_Tra_Tra_Loi.md',
  'Phan22_DesignPatterns_CheatSheet.md',
  'Phan23_Reactive_CheatSheet.md',
  'Phan24_Kubernetes_CheatSheet.md',
  'Phan25_TestingAdvanced_CheatSheet.md',
  'Phan26_Performance_CheatSheet.md',
];

function extractTitle(content, filename) {
  // Try H1 first
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();

  // Fallback to filename
  const base = filename.replace('_CheatSheet.md', '').replace('_', ' ');
  return base;
}

function extractChecklist(content) {
  const checklist = [];
  const lines = content.split('\n');
  let inChecklist = false;

  for (const line of lines) {
    if (line.includes('## ✅ CHECKLIST') || line.includes('## ✅ checklist')) {
      inChecklist = true;
      continue;
    }
    if (inChecklist) {
      if (line.startsWith('##') || line.startsWith('#')) break;
      const match = line.match(/^-\s+\[?\s*\]\s*\(?\s*(.+)/i);
      if (match) {
        checklist.push(match[1].trim().replace(/\*\*/g, ''));
      }
    }
  }
  return checklist;
}

function processContent(content) {
  // Remove YAML frontmatter
  content = content.replace(/^---[\s\S]*?---\n?/, '');
  return content.trim();
}

const topics = [];

for (const filename of ORDER) {
  const filepath = path.join(MD_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`Missing: ${filename}`);
    continue;
  }

  const raw = fs.readFileSync(filepath, 'utf-8');
  const content = processContent(raw);
  const title = extractTitle(content, filename);
  const checklist = extractChecklist(raw);

  topics.push({
    file: filename,
    title: `📄 ${title}`,
    content: content,
    checklist
  });
}

const js = `// Auto-generated from interview_java/*.md
window.interviewTopics = ${JSON.stringify(topics, null, 2)};
`;

fs.writeFileSync(OUTPUT, js, 'utf-8');
console.log(`Generated ${topics.length} topics -> ${OUTPUT}`);
